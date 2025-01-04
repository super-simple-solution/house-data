export const entityMap = {
  '&': 'amp',
  '<': 'lt',
  '>': 'gt',
  '"': 'quot',
  "'": '#39',
  '/': '#x2F',
}

export const escapeHtml = (str: string) =>
  String(str).replace(/[&<>"'/\\]/g, (s: string) => `&${entityMap[s as keyof typeof entityMap]};`)

// To keep some consistency with React DOM, lets use a mapper
// https://reactjs.org/docs/dom-elements.html
export const AttributeMapper = (val: string) =>
  ({
    tabIndex: 'tabindex',
    className: 'class',
    readOnly: 'readonly',
  })[val] || val

export function h(
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  tag: Function | string,
  attrs?: { [key: string]: any },
  ...children: (HTMLElement | string)[]
): HTMLElement {
  const attrs_final = attrs || {}
  const stack: any[] = [...children]

  // Support for components(ish)
  if (typeof tag === 'function') {
    attrs_final.children = stack
    return tag(attrs_final)
  }

  const elm = document.createElement(tag)

  // Add attributes
  for (let [name, val] of Object.entries(attrs_final)) {
    // event
    if (name.startsWith('on')) {
      elm.addEventListener(name.slice(2).toLowerCase(), val)
      continue
    }
    name = escapeHtml(AttributeMapper(name))
    if (name === 'style') {
      Object.assign(elm.style, val)
    } else if (val === true) {
      elm.setAttribute(name, name)
    } else if (val !== false && val != null) {
      if (['src', 'href'].includes(name)) {
        elm.setAttribute(name, val)
      } else {
        elm.setAttribute(name, escapeHtml(val))
      }
    } else if (val === false) {
      elm.removeAttribute(name)
    }
  }

  // Append children
  while (stack.length) {
    const child = stack.shift()

    // Is child a leaf?
    if (!Array.isArray(child)) {
      elm.appendChild(
        (child as HTMLElement).nodeType == null ? document.createTextNode(child.toString()) : child,
      )
    } else {
      stack.push(...child)
    }
  }

  return elm
}

export function Fragment(...children: (HTMLElement | string)[]): (HTMLElement | string)[] {
  return children
}
