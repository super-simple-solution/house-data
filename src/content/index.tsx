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
  const housePrice = Number(totalPriceEle?.textContent)
  const unitPrice = Math.ceil((housePrice * 10000) / areaInfo.size)
  const taxElTarget = getEle('.jing-item + .item')
  const tax = taxElTarget?.querySelector('.number')?.textContent
  const taxNumber = getNumber(tax)
  const agencyFee = [housePrice * 0.01, housePrice * 0.03]
  const totalPriceLow = (housePrice + taxNumber + agencyFee[0]).toFixed(2)
  const totalPriceHigh = (housePrice + taxNumber + agencyFee[1]).toFixed(2)

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
    <a class="sss-cursor-pointer sss-text-primary" onClick={goToAreaEle}>
      {areaInfo.type === AreaType.Manual ? '测量面积' : '套内面积'}
    </a>
  )

  const taxTarget = () => (
    <a class="" onClick={goToTaxEle}>
      {tax}
    </a>
  )

  const taxEle = (
    <div class="sss-my-1">
      <div class="sss-text-xs sss-text-info">
        <span>
          <span class="sss-cursor-pointer sss-text-lg sss-font-semibold sss-text-warning hover:sss-underline">
            {taxTarget()}
            <span class="sss-text-xs sss-font-normal">万</span>
          </span>
          税费
        </span>
        <span>
          <span class="sss-text-lg sss-font-semibold sss-text-warning">
            {agencyFee[0].toFixed(2)}~{agencyFee[1].toFixed(2)}
            <span class="sss-text-xs sss-font-normal">万</span>
          </span>
          中介费
        </span>
      </div>
      <div class="sss-my-1 sss-text-xs sss-text-info">
        <span class="sss-text-lg sss-font-semibold sss-text-warning">
          {totalPriceLow}~{totalPriceHigh}
          <span class="sss-text-xs sss-font-normal">万</span>
        </span>
        总成本
      </div>
    </div>
  )

  // 测量/套内面积对应价格
  const finalPriceEle = (
    <div class="final-price-ele sss-my-1 sss-flex sss-items-center">
      <div class="sss-text-xs">
        <span class="sss-text-lg sss-font-semibold sss-text-warning">{unitPrice}</span>元/平米
        <span class="sss-text-info">(根据{areaTarget()}计算)</span>
      </div>
    </div>
  )

  // 测量/套内面积
  const finalAreaEle = (
    <div class="final-area-ele sss-my-1 sss-flex sss-w-[150px] sss-items-center">
      <div class="sss-text-xs">
        <span class="sss-text-lg sss-font-semibold sss-text-warning">{areaInfo.size}</span>平米
        <span class="sss-text-info">({areaTarget()})</span>
      </div>
    </div>
  )

  // 得房率
  const efficiencyRatio = ((areaInfo.size / getNumber(totalArea?.textContent)) * 100).toFixed(2) + '%'

  const efficiencyRatioEle = (
    <div class="sss-flex sss-items-center">
      <div class="sss-text-xs">
        <span class="sss-text-lg sss-font-semibold sss-text-warning">{efficiencyRatio}</span>
        <span>得房率</span>
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
  }, 3000)
}
