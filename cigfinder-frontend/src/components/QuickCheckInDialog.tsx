/* versão enxuta, sem bloco duplicado */

import { useState, useRef, useEffect } from "react"
import { useCheckIn } from "../hooks/usePlaces"
import { showToast } from "./Toast"
import { useFabPosition } from "../hooks/useFabPosition"
import type { Place } from "../types"
import { cn } from "../lib/utils"

interface Props {
  place?: Place
  isRating?: boolean
  onClose?: () => void
}

export default function QuickCheckInDialog({
  place,
  isRating = false,
  onClose,
}: Props) {
  const [open, setOpen]           = useState(Boolean(place))
  const [openConfirm, setConfirm] = useState(true)
  const [selected, setSelected]   = useState<string[]>([])
  const [step, setStep]           = useState(isRating ? 3 : 1)
  const [rating, setRating]       = useState(0)
  const [comment, setComment]     = useState("")
  const ref                       = useRef<HTMLDivElement>(null)
  const checkIn                   = useCheckIn()
  const fabPos                    = useFabPosition()

  const brands = ["Marlboro", "Lucky Strike", "Dunhill", "Parliament"]

  /* focus-trap ----------------------------------------------------------- */
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const first = () =>
      ref.current?.querySelector<HTMLElement>(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
      )

    const esc   = (e: KeyboardEvent) => e.key === "Escape" && close()
    const trap  = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !ref.current) return
      const nodes = ref.current.querySelectorAll<HTMLElement>(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
      )
      if (!nodes.length) return
      const firstEl = nodes[0]
      const lastEl  = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    setTimeout(() => first()?.focus(), 80)
    document.addEventListener("keydown", esc)
    document.addEventListener("keydown", trap)
    return () => {
      document.removeEventListener("keydown", esc)
      document.removeEventListener("keydown", trap)
      prev?.focus()
    }
  }, [open])

  /* helpers -------------------------------------------------------------- */
  const toggleBrand = (b: string) =>
    setSelected(s => (s.includes(b) ? s.filter(i => i !== b) : [...s, b]))

  const submit = () => {
    if (isRating) {
      showToast(
        `Avaliação enviada: ${rating}★${
          comment ? ` – “${comment.slice(0, 60)}”` : ""
        }`,
        "success",
      )
    } else {
      checkIn.mutate(
        {
          place_id: place?.place_id ?? "unknown",
          open_confirm: openConfirm,
          brands: selected,
        },
        {
          onSuccess: () => showToast("Check-in realizado!", "success"),
          onError:   () => showToast("Erro ao enviar check-in", "error"),
        },
      )
    }
    close()
  }

  const close = () => {
    setOpen(false)
    setStep(isRating ? 3 : 1)
    setSelected([])
    setRating(0)
    setComment("")
    onClose?.()
  }

  /* botão flutuante ------------------------------------------------------ */
  if (!open && !place)
    return (
      <button
        aria-label="Check-in rápido"
        onClick={() => setOpen(true)}
        className={`absolute ${fabPos} w-12 h-12 rounded-full bg-brand text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105`}
      >
        +
      </button>
    )

  /* modal ---------------------------------------------------------------- */
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={e => e.target === e.currentTarget && close()}
    >
      <div
        ref={ref}
        onClick={e => e.stopPropagation()}
        className="w-80 rounded-lg bg-white p-5 shadow-lg dark:bg-gray-800"
      >
        {/* título/fechar */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {isRating ? "Avaliar local" : "Check-in rápido"}
            {place && ` – ${place.name}`}
          </h3>
          <button
            aria-label="Fechar"
            onClick={close}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>

        {/* passos / conteúdo */}
        {!isRating && (
          <div className="mb-4 flex justify-between">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                    step === i
                      ? "bg-brand text-white"
                      : step > i
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-500",
                  )}
                >
                  {step > i ? "✓" : i}
                </div>
                <span className="mt-1 text-xs">
                  {["Aberto", "Marcas", "Enviar"][i - 1]}
                </span>
              </div>
            ))}
          </div>
        )}

        {step === 1 && !isRating && (
          <div className="mb-6 space-y-4">
            <p>Este local está aberto?</p>
            <div className="flex gap-3">
              {["Sim", "Não"].map((txt, idx) => {
                const yes = idx === 0
                return (
                  <button
                    key={txt}
                    onClick={() => {
                      setConfirm(yes)
                      setStep(2)
                    }}
                    className={cn(
                      "flex-1 rounded py-2",
                      (yes ? openConfirm : !openConfirm)
                        ? "bg-brand text-white"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white",
                    )}
                  >
                    {txt}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 2 && !isRating && (
          <div className="mb-6">
            <p className="mb-3">Quais marcas estão disponíveis?</p>
            {brands.map(b => (
              <label key={b} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(b)}
                  onChange={() => toggleBrand(b)}
                />
                {b}
              </label>
            ))}
          </div>
        )}

        {((step === 3 && !isRating) || isRating) && (
          <div className="mb-6 space-y-4">
            {isRating ? (
              <>
                <div>
                  <p className="mb-2 font-medium">Sua avaliação</p>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      aria-label={`${s} estrelas`}
                      aria-pressed={rating >= s}
                      onClick={() => setRating(s)}
                      className={rating >= s ? "text-yellow-400" : "text-gray-300"}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  placeholder="Comentário (opcional)"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
              </>
            ) : (
              <>
                <p className="font-medium">Confirme as informações</p>
                <div className="rounded bg-gray-100 p-3 text-sm dark:bg-gray-700">
                  <p>
                    <strong>Status:</strong> {openConfirm ? "Aberto" : "Fechado"}
                  </p>
                  {!!selected.length && (
                    <p>
                      <strong>Marcas:</strong> {selected.join(", ")}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* footer ---------------------------------------------------------- */}
        <div className="flex justify-between">
          {!isRating && step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Voltar
            </button>
          )}

          {(isRating || step === 3) ? (
            <button
              onClick={submit}
              disabled={isRating && rating === 0}
              className={cn(
                "ml-auto rounded bg-brand px-4 py-2 text-sm text-white",
                isRating && rating === 0 && "opacity-50 cursor-not-allowed",
              )}
            >
              Enviar
            </button>
          ) : (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 2 && !selected.length}
              className={cn(
                "ml-auto rounded bg-brand px-4 py-2 text-sm text-white",
                step === 2 && !selected.length && "opacity-50 cursor-not-allowed",
              )}
            >
              Próximo
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
