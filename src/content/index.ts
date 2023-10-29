import { $$, getEle, createEle, getNumber } from '@/utils'
import '@/style/index.scss'

function init() {
  const area = getArea()
  if (!area) return
  const priceEle = getEle('.price-container .price')
  const areaEle = getEle('.houseInfo .area')
  const totalArea = getEle('.mainInfo', areaEle)
  if (!priceEle || !areaEle) return
  const totalPriceEle = getEle('.total', priceEle)
  const unitPrice = Math.ceil((Number(totalPriceEle?.textContent) * 10000) / area)
  const finalUnit = createEle({ content: '(实用面积)', class: 'text-[#999] font-normal text-xs' })
  const finalPriceValue = createEle({ content: `${unitPrice} 元`, class: 'text-rose-600 font-black text-sm' })
  const finalPriceEle = createEle({ content: '', class: 'final-price-ele flex my-1 w-[150px] items-center' })
  finalPriceEle.appendChild(finalPriceValue)
  finalPriceEle.appendChild(finalUnit)

  const finalAreaValue = createEle({ content: `${area} 平米`, class: 'text-rose-600 font-black text-sm' })
  const finalAreaEle = createEle({ content: '', class: 'final-area-ele flex my-1 w-[150px] items-center' })
  finalAreaEle.appendChild(finalAreaValue)
  finalAreaEle.appendChild(finalUnit)

  const efficiencyRatio = ((area / getNumber(totalArea?.textContent)) * 100).toFixed(2) + '%'
  const efficiencyRatioEle = createEle({ content: `得房率 ${efficiencyRatio}`, class: 'text-rose-600 text-sm' })

  const subInfoEle = getEle('.subInfo', areaEle) as HTMLElement
  getEle('.text', priceEle)?.insertBefore(finalPriceEle, getEle('.text .tax', priceEle) as HTMLElement)
  areaEle.insertBefore(finalAreaEle, subInfoEle)
  areaEle.insertBefore(efficiencyRatioEle, subInfoEle)
}

init()

function getArea(): number {
  const infoEle = document.getElementById('infoList')
  if (!infoEle) return 0
  const area = Array.from($$('.col:nth-child(2)', infoEle))
    .map((item) => getNumber(item.textContent))
    .reduce((acc, cur) => acc + Number(cur), 0)
  return Number(area.toFixed(2))
}
