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
  const taxElTarget = getEle('.jing-item + .item')
  const tax = taxElTarget?.querySelector('.number')?.textContent

  // 跳转至测量/套内面积数据
  const goToAreaEle = () => {
    let scrollTarget
    let target
    if (areaInfo.type === AreaType.Manual) {
      scrollTarget = document.getElementById('layout')
      target = document.getElementById('infoList')
    } else {
      scrollTarget = document.getElementById('introduction')
      target = getAutoAreaEle()
    }
    if (!scrollTarget || !target) return
    scrollAndBlink(scrollTarget, target as HTMLElement)
  }

  const goToTaxEle = () => {
    const scrollTarget = getEle('.tab-tax') as HTMLElement
    const target = taxElTarget as HTMLElement
    if (!scrollTarget || !target) return
    scrollAndBlink(scrollTarget, target)
  }

  const areaTarget = () => (
    <a class="sss-text-primary sss-cursor-pointer" onClick={goToAreaEle}>
      {areaInfo.type === AreaType.Manual ? '测量面积' : '套内面积'}
    </a>
  )

  const taxTarget = () => (
    <a class="sss-text-primary sss-cursor-pointer" onClick={goToTaxEle}>
      税费
    </a>
  )

  const taxEle = (
    <span>
      税费：
      <span class="sss-text-warning sss-hover:cursor-pointer sss-hover:underline">{tax}万元</span>
      <span>{taxTarget()}</span>
    </span>
  )

  // 测量/套内面积对应价格
  const finalPriceEle = (
    <div class="final-price-ele sss-my-1 sss-flex sss-items-center">
      <div class="sss-text-xs">
        <span class="sss-text-warning sss-text-lg sss-font-semibold">{unitPrice}</span>元/平米
        <span class="sss-text-info">(根据{areaTarget()}计算)</span>
      </div>
    </div>
  )

  // 测量/套内面积
  const finalAreaEle = (
    <div class="final-area-ele sss-my-1 sss-flex sss-w-[150px] sss-items-center">
      <div class="sss-text-xs">
        <span class="sss-text-warning sss-text-lg sss-font-semibold">{areaInfo.size}</span>平米
        <span class="sss-text-info">({areaTarget()})</span>
      </div>
    </div>
  )

  // 得房率
  const efficiencyRatio = ((areaInfo.size / getNumber(totalArea?.textContent)) * 100).toFixed(2) + '%'

  const efficiencyRatioEle = (
    <div class="sss-flex sss-items-center">
      <div class="sss-text-xs">
        <span>得房率</span>
        <span class="sss-text-warning sss-text-lg sss-font-semibold"> {efficiencyRatio}</span>
        <span class="sss-text-info">(根据{areaTarget()}计算)</span>
      </div>
    </div>
  )

  const subInfoEle = getEle('.subInfo', areaEle) as HTMLElement
  // @ts-expect-error jsx dom
  getEle('.text', priceEle)?.insertBefore(finalPriceEle, getEle('.text .tax', priceEle) as HTMLElement)
  // @ts-expect-error jsx dom
  areaEle.insertBefore(finalAreaEle, subInfoEle)
  areaEle.insertBefore(efficiencyRatioEle, subInfoEle)
  const taxContainer = getEle('.price-container .price div.text')
  taxContainer?.appendChild(taxEle)
}

init()

function getAutoAreaEle() {
  return getEle('.louceng+li')
}

function getAreaInfo(): AreaInfo {
  // 页面已有测量/套内面积
  const areaEle = getAutoAreaEle()
  let areaNum = 0
  areaEle?.childNodes.forEach((item) => {
    if (item.nodeType === 3 && item.textContent?.trim()) {
      areaNum = getNumber(item.textContent.trim())
    }
  })
  if (areaNum) {
    return {
      size: areaNum,
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

function scrollAndBlink(scrollTarget: HTMLElement, blinkTarget: HTMLElement) {
  scrollTarget?.scrollIntoView({ behavior: 'smooth' })
  blinkTarget?.classList.add('alerts-border')
  setTimeout(() => {
    blinkTarget?.classList.remove('alerts-border')
  }, 2000)
}
