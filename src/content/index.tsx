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

  const toTarget = () => getEle('[data-component="houseLayout"')?.scrollIntoView()
  const areaTarget = () => {
    return (
      <a class="cursor-pointer text-[#4688f1]" onClick={toTarget}>
        实用面积
      </a>
    )
  }

  const finalPriceEle = (
    <div class="final-price-ele my-1 flex items-center">
      <div class="text-xs text-[#999]">
        <span class="text-lg font-semibold text-rose-600">{unitPrice}</span> 元/平米
        <span>(根据{areaTarget()}计算)</span>
      </div>
    </div>
  )

  const finalAreaEle = (
    <div class="final-area-ele my-1 flex w-[150px] items-center">
      <div class="text-xs text-[#999]">
        <span class="text-lg font-semibold text-rose-600">{area}</span> 平米
        <span>({areaTarget()})</span>
      </div>
    </div>
  )

  const efficiencyRatio = ((area / getNumber(totalArea?.textContent)) * 100).toFixed(2) + '%'
  const efficiencyRatioEle = createEle({
    content: `得房率 ${efficiencyRatio}`,
    class: 'text-rose-600 font-semibold text-sm',
  })

  const subInfoEle = getEle('.subInfo', areaEle) as HTMLElement
  // @ts-expect-error jsx dom
  getEle('.text', priceEle)?.insertBefore(finalPriceEle, getEle('.text .tax', priceEle) as HTMLElement)
  // @ts-expect-error jsx dom
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
