import { $$, getEle, createEle, getNumber } from '@/utils'

function init() {
  const area = getArea()
  if (!area) return
  const priceEle = getEle('.price-container .price')
  const areaEle = getEle('.houseInfo .area')
  const totalArea = getEle('.mainInfo', areaEle)
  if (!priceEle || !areaEle) return
  const totalPriceEle = getEle('.total', priceEle)
  const unitPrice = Math.ceil((Number(totalPriceEle?.textContent) * 10000) / area)
  const finalPriceEle = createEle({ content: `${unitPrice} 元/平米(实用面积对应单价)` })
  const finalAreaEle = createEle({ content: `${area} 平米(实用面积)` })
  const efficiencyRatio = ((area / getNumber(totalArea?.textContent)) * 100).toFixed(2) + '%'
  const efficiencyRatioEle = createEle({ content: `得房率 ${efficiencyRatio}` })

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
