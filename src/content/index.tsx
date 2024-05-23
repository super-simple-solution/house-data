import { $$, getEle, getNumber } from '@/utils'
import '@/style/index.scss'

// https://wh.ke.com/ershoufang/104113418870.html
enum AreaType {
  Manual, // 测量,
  Automatic, // 套内,
}

type AreaInfo = {
  size: number
  type: AreaType
}

function init() {
  const areaInfo: AreaInfo = getAreaInfo()
  if (!areaInfo.size) return
  const priceEle = getEle('.price-container .price')
  const areaEle = getEle('.houseInfo .area')
  const totalArea = getEle('.mainInfo', areaEle)
  if (!priceEle || !areaEle) return
  const totalPriceEle = getEle('.total', priceEle)
  const unitPrice = Math.ceil((Number(totalPriceEle?.textContent) * 10000) / areaInfo.size)

  // 跳转至实用面积数据
  const toTarget = () => getEle('[data-component="houseLayout"')?.scrollIntoView({ behavior: 'smooth' })

  const areaTarget = () => {
    return (
      <a class="cursor-pointer text-[#4688f1]" onClick={toTarget}>
        {areaInfo.type === AreaType.Manual ? '实用面积' : '套内面积'}
      </a>
    )
  }

  // 实用面积对应价格
  const finalPriceEle = (
    <div class="final-price-ele my-1 flex items-center">
      <div class="text-xs text-info">
        <span class="text-lg font-semibold text-red">{unitPrice}</span> 元/平米
        <span>(根据{areaTarget()}计算)</span>
      </div>
    </div>
  )

  // 实用面积
  const finalAreaEle = (
    <div class="final-area-ele my-1 flex w-[150px] items-center">
      <div class="text-xs text-info">
        <span class="text-lg font-semibold text-red">{areaInfo.size}</span> 平米
        <span>预估({areaTarget()})</span>
      </div>
    </div>
  )

  // 得房率
  const efficiencyRatio = ((areaInfo.size / getNumber(totalArea?.textContent)) * 100).toFixed(2) + '%'
  // const efficiencyRatioEle = createEle({
  //   content: `预估得房率 ${efficiencyRatio}`,
  //   class: 'text-red font-semibold text-sm',
  // })

  const efficiencyRatioEle = (
    <div class="flex items-center">
      <div class="text-xs text-info">
        <span class="text-lg font-semibold text-red">预估得房率 {efficiencyRatio}</span>
        <span>(根据{areaTarget()}计算)</span>
      </div>
    </div>
  )

  const subInfoEle = getEle('.subInfo', areaEle) as HTMLElement
  // @ts-expect-error jsx dom
  getEle('.text', priceEle)?.insertBefore(finalPriceEle, getEle('.text .tax', priceEle) as HTMLElement)
  // @ts-expect-error jsx dom
  areaEle.insertBefore(finalAreaEle, subInfoEle)
  areaEle.insertBefore(efficiencyRatioEle, subInfoEle)
}

init()

function getAreaInfo(): AreaInfo {
  // 页面已有实用面积
  const areaEle = getEle('.louceng+li')
  let areaNum = ''
  areaEle?.childNodes.forEach((item) => {
    if (item.nodeType === 3 && item.textContent?.trim()) {
      areaNum = item.textContent.trim()
    }
  })
  if (areaNum) {
    return {
      size: getNumber(areaNum),
      type: AreaType.Automatic,
    }
  }
  const infoEle = document.getElementById('infoList')
  if (!infoEle) {
    return {
      size: 0,
      type: AreaType.Manual,
    }
  }
  const areaSize = Array.from($$('.col:nth-child(2)', infoEle))
    .map((item) => getNumber(item.textContent))
    .reduce((acc, cur) => acc + Number(cur), 0)
  return {
    size: getNum(areaSize),
    type: AreaType.Manual,
  }
}

function getNum(number: number) {
  return Number(number.toFixed(2))
}
