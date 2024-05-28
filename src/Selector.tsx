import { Show, createSignal, batch, For } from 'solid-js'
import { FaSolidAngleDown, FaSolidCheck } from './util'

type SelectorDataType<T> = {
  Name: string
  Value: T
}

type SelectProps<T> = {
  disabled?: boolean
  readonly?: boolean
  data?: SelectorDataType<T>[]
  default?: T
  id?: string
  onSelect?: (val: SelectorDataType<T>, id?: string) => void
}

const findDefault = <T,>(data: SelectorDataType<T>[] | undefined, d: T) => {
  return data?.find(v => v.Value === d)
}

const Selector = <T,>(props: SelectProps<T>) => {
  const [selected, setSelected] = createSignal(findDefault(props.data, props.default))

  const [fVal, setFVal] = createSignal(props.data)

  const [show, setShow] = createSignal(false)

  const fetchVal = (val: string) => {
    const v = props.data?.filter(v => v.Name.toLowerCase().indexOf(val.toLowerCase()) !== -1)
    setFVal(v)
  }

  const upSelect = (val: SelectorDataType<T>) => {
    if (val.Value === selected()?.Value) return
    setSelected(val)
    if (props.onSelect) props.onSelect(val, props.id)
  }

  return (
    <div class="relative h-full w-full">
      <input
        class="disable-default focus:ring-primary h-full w-full rounded-md bg-dark-box py-3 pl-6 pr-10 text-left text-lg focus:outline-none focus:ring-1"
        readonly={props.readonly}
        value={selected()?.Name}
        onFocus={() => setShow(true)}
        onBlur={() => {
          batch(() => {
            setShow(false)
            setFVal(props.data)
          })
        }}
        onChange={e => fetchVal(e.target.value)}
      />
      <button
        type="button"
        class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-4"
      >
        <FaSolidAngleDown />
      </button>
      <Show when={show()}>
        <ul class="shadow-l scrollbar-0 text-md bg-dark-selector-bg absolute z-50 mt-1 max-h-64 min-h-12 w-full overflow-y-auto rounded-md py-1">
          <For each={fVal()}>
            {v => (
              <li
                class="hover:bg-accent relative cursor-pointer select-none py-2 pl-3 pr-9"
                onMouseDown={() => upSelect(v)}
              >
                <div class="ml-3 flex items-center truncate font-normal">
                  {v.Name === '' ? <>&emsp;</> : v.Name}
                </div>
                <Show when={v.Value === selected()?.Value}>
                  <span class="absolute inset-y-0 right-0 flex items-center pr-4">
                    <FaSolidCheck class="text-primary" />
                  </span>
                </Show>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  )
}

export default Selector
