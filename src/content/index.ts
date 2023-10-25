import { $$, getEle, createEle } from '@/utils'

function init() {
  console.log('init')
  const area = getArea()
  if (!area) return
  console.log(area)
  const priceEle = getEle('.price-container .price')
  const areaEle = getEle('.houseInfo .area')
  const totalPriceEle = getEle('.total', priceEle)
  const unitPrice = Math.ceil((Number(totalPriceEle.textContent) * 10000) / area)
  const finalPriceEle = createEle({ tag: 'span', content: `${unitPrice}元/平米(实际使用面积对应单价)` })
  const finalAreaEle = createEle({ tag: 'span', content: `${area}平米(实际使用面积)` })
  getEle('.text', priceEle).insertBefore(finalPriceEle, getEle('.text .tax', priceEle))
  areaEle.insertBefore(finalAreaEle, getEle('.subInfo', areaEle))
}

init()

function getArea(): number {
  const infoEle = document.getElementById('infoList')
  if (!infoEle) return 0
  return Array.from($$('.col:nth-child(2)', infoEle))
    .map((item) => item.textContent.replace(/[^(\d|.)]/g, ''))
    .reduce((acc, cur) => acc + Number(cur), 0)
}
