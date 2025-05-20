import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "../../lib/utils"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Selecione...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen]   = React.useState(false)
  const [searchTerm, setTerm] = React.useState("")

  const filtered = React.useMemo(
    () =>
      options.filter(o =>
        o.label.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [options, searchTerm],
  )

  const toggle = (value: string) =>
    onChange(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value],
    )

  const remove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selected.filter(v => v !== value))
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* campo “visual” ---------------------------------------------------- */}
      <div
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center rounded-md border border-input bg-white px-3 py-2 text-sm",
          "focus-within:ring-1 focus-within:ring-brand",
          disabled && "cursor-not-allowed opacity-50",
          "dark:bg-gray-800 dark:border-gray-700",
        )}
        onClick={() => !disabled && setIsOpen(true)}
      >
        {selected.length ? (
          <div className="flex flex-wrap gap-1 pr-2">
            {selected.map(v => {
              const o = options.find(o => o.value === v)
              return (
                <div
                  key={v}
                  className="flex items-center gap-1 rounded-sm bg-brand/10 px-1 text-xs text-brand dark:bg-brand/20"
                >
                  <span>{o?.label ?? v}</span>
                  <button
                    type="button"
                    aria-label={`Remover ${o?.label ?? v}`}
                    className="ml-1 rounded-full hover:bg-brand/20"
                    onClick={e => remove(v, e)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}

        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="ml-auto flex h-4 w-4 items-center justify-center text-gray-500"
          onClick={e => {
            e.stopPropagation();
            if (!disabled) {
              setIsOpen(!isOpen);
            }
          }}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* dropdown ---------------------------------------------------------- */}
      {isOpen && (
        <>
          <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="sticky top-0 p-2">
              <input
                autoFocus
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={e => setTerm(e.target.value)}
                onClick={e => e.stopPropagation()}
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <ul
              role="listbox"
              aria-multiselectable="true"
              className="max-h-[200px] overflow-y-auto p-1"
            >
              {filtered.length ? (
                filtered.map(o => (
                  <li
                    key={o.value}
                    role="option"
                    aria-selected={selected.includes(o.value)}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm",
                      "hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white",
                      selected.includes(o.value) &&
                        "bg-gray-100 dark:bg-gray-700",
                    )}
                    onClick={() => toggle(o.value)}
                  >
                    <span>{o.label}</span>
                    {selected.includes(o.value) && (
                      <span className="absolute right-2 flex h-4 w-4 items-center justify-center">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </li>
                ))
              ) : (
                <li className="py-2 text-center text-sm text-gray-500">
                  Nenhum resultado
                </li>
              )}
            </ul>
          </div>

          {/* backdrop para fechar ----------------------------------------- */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  )
}
