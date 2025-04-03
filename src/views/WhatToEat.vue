<template>
  <div class="what-to-eat">
    <van-nav-bar
      title="今天吃什么"
      left-text="重新选择"
      @click-left="resetAll"
    />
    
    <div class="content">
      <div class="date-info">
        <h2>明天是 {{ tomorrowDate }}</h2>
      </div>

      <div class="meals">
        <div class="meal-section">
          <div class="meal-header">
            <van-icon name="clock" />
            <h3>午餐</h3>
          </div>
          <div class="dish-selection">
            <div class="dish-card" :class="{ confirmed: lunchMeatConfirmed }">
              <div class="dish-info">
                <van-tag type="primary" size="medium">荤菜</van-tag>
                <span class="dish-name">{{ lunchMeat?.name || '暂无荤菜' }}</span>
              </div>
              <div class="dish-actions">
                <template v-if="!lunchMeatConfirmed">
                  <van-button size="small" type="primary" @click="confirmDish('lunchMeat')" icon="success">就它了</van-button>
                  <van-button size="small" @click="changeDish('lunchMeat')" icon="replay">换一个</van-button>
                </template>
                <template v-else>
                  <van-tag type="success" size="medium">已选定</van-tag>
                  <van-button size="small" @click="undoConfirm('lunchMeat')" icon="replay">重新选择</van-button>
                </template>
              </div>
            </div>
            
            <div class="dish-card" :class="{ confirmed: lunchVegConfirmed }">
              <div class="dish-info">
                <van-tag type="success" size="medium">素菜</van-tag>
                <span class="dish-name">{{ lunchVeg?.name || '暂无素菜' }}</span>
              </div>
              <div class="dish-actions">
                <template v-if="!lunchVegConfirmed">
                  <van-button size="small" type="primary" @click="confirmDish('lunchVeg')" icon="success">就它了</van-button>
                  <van-button size="small" @click="changeDish('lunchVeg')" icon="replay">换一个</van-button>
                </template>
                <template v-else>
                  <van-tag type="success" size="medium">已选定</van-tag>
                  <van-button size="small" @click="undoConfirm('lunchVeg')" icon="replay">重新选择</van-button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <van-divider />

        <div class="meal-section">
          <div class="meal-header">
            <van-icon name="clock" />
            <h3>晚餐</h3>
          </div>
          <div class="dish-selection">
            <div class="dish-card" :class="{ confirmed: dinnerMeatConfirmed }">
              <div class="dish-info">
                <van-tag type="primary" size="medium">荤菜</van-tag>
                <span class="dish-name">{{ dinnerMeat?.name || '暂无荤菜' }}</span>
              </div>
              <div class="dish-actions">
                <template v-if="!dinnerMeatConfirmed">
                  <van-button size="small" type="primary" @click="confirmDish('dinnerMeat')" icon="success">就它了</van-button>
                  <van-button size="small" @click="changeDish('dinnerMeat')" icon="replay">换一个</van-button>
                </template>
                <template v-else>
                  <van-tag type="success" size="medium">已选定</van-tag>
                  <van-button size="small" @click="undoConfirm('dinnerMeat')" icon="replay">重新选择</van-button>
                </template>
              </div>
            </div>
            
            <div class="dish-card" :class="{ confirmed: dinnerVegConfirmed }">
              <div class="dish-info">
                <van-tag type="success" size="medium">素菜</van-tag>
                <span class="dish-name">{{ dinnerVeg?.name || '暂无素菜' }}</span>
              </div>
              <div class="dish-actions">
                <template v-if="!dinnerVegConfirmed">
                  <van-button size="small" type="primary" @click="confirmDish('dinnerVeg')" icon="success">就它了</van-button>
                  <van-button size="small" @click="changeDish('dinnerVeg')" icon="replay">换一个</van-button>
                </template>
                <template v-else>
                  <van-tag type="success" size="medium">已选定</van-tag>
                  <van-button size="small" @click="undoConfirm('dinnerVeg')" icon="replay">重新选择</van-button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="final-selection" v-if="allDishesConfirmed">
        <van-divider>已完成明天的菜品选择</van-divider>
        <van-button type="primary" block icon="replay" @click="resetAll">重新选择</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMenuStore } from '../store'

const store = useMenuStore()

// 日期计算
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const tomorrowDate = computed(() => {
  return `${tomorrow.getFullYear()}年${tomorrow.getMonth() + 1}月${tomorrow.getDate()}日 周${weekDays[tomorrow.getDay()]}`
})

// 菜品状态
const lunchMeat = ref(null)
const lunchVeg = ref(null)
const dinnerMeat = ref(null)
const dinnerVeg = ref(null)

const lunchMeatConfirmed = ref(false)
const lunchVegConfirmed = ref(false)
const dinnerMeatConfirmed = ref(false)
const dinnerVegConfirmed = ref(false)

// 初始化已保存的菜品
const initSavedMeals = () => {
  const savedMeals = store.getMealsByDate(tomorrow)
  if (savedMeals) {
    if (savedMeals.lunch) {
      lunchMeat.value = savedMeals.lunch.meat
      lunchVeg.value = savedMeals.lunch.veg
      lunchMeatConfirmed.value = !!savedMeals.lunch.meat
      lunchVegConfirmed.value = !!savedMeals.lunch.veg
    }
    if (savedMeals.dinner) {
      dinnerMeat.value = savedMeals.dinner.meat
      dinnerVeg.value = savedMeals.dinner.veg
      dinnerMeatConfirmed.value = !!savedMeals.dinner.meat
      dinnerVegConfirmed.value = !!savedMeals.dinner.veg
    }
  } else {
    // 如果没有保存的数据，初始化随机菜品
    changeDish('lunchMeat')
    changeDish('lunchVeg')
    changeDish('dinnerMeat')
    changeDish('dinnerVeg')
  }
}

// 组件加载时初始化数据
onMounted(() => {
  initSavedMeals()
})

// 获取随机菜品
const getRandomDish = (type) => {
  const dishes = type === '荤菜' ? store.meatDishes : store.vegDishes
  if (!dishes.length) return null
  return dishes[Math.floor(Math.random() * dishes.length)]
}

// 更换单个菜品
const changeDish = (type) => {
  switch(type) {
    case 'lunchMeat':
      lunchMeat.value = getRandomDish('荤菜')
      break
    case 'lunchVeg':
      lunchVeg.value = getRandomDish('素菜')
      break
    case 'dinnerMeat':
      dinnerMeat.value = getRandomDish('荤菜')
      break
    case 'dinnerVeg':
      dinnerVeg.value = getRandomDish('素菜')
      break
  }
}

// 确认菜品
const confirmDish = (type) => {
  switch(type) {
    case 'lunchMeat':
      lunchMeatConfirmed.value = true
      break
    case 'lunchVeg':
      lunchVegConfirmed.value = true
      break
    case 'dinnerMeat':
      dinnerMeatConfirmed.value = true
      break
    case 'dinnerVeg':
      dinnerVegConfirmed.value = true
      break
  }

  // 如果所有菜品都已确认，保存到日历
  if (allDishesConfirmed.value) {
    store.saveMealSelection(
      tomorrow,
      'lunch',
      lunchMeat.value,
      lunchVeg.value
    )
    store.saveMealSelection(
      tomorrow,
      'dinner',
      dinnerMeat.value,
      dinnerVeg.value
    )
  }
}

// 取消确认并重新选择
const undoConfirm = (type) => {
  switch(type) {
    case 'lunchMeat':
      lunchMeatConfirmed.value = false
      changeDish('lunchMeat')
      break
    case 'lunchVeg':
      lunchVegConfirmed.value = false
      changeDish('lunchVeg')
      break
    case 'dinnerMeat':
      dinnerMeatConfirmed.value = false
      changeDish('dinnerMeat')
      break
    case 'dinnerVeg':
      dinnerVegConfirmed.value = false
      changeDish('dinnerVeg')
      break
  }
}

// 计算是否所有菜品都已确认
const allDishesConfirmed = computed(() => {
  return lunchMeatConfirmed.value && 
         lunchVegConfirmed.value && 
         dinnerMeatConfirmed.value && 
         dinnerVegConfirmed.value
})

// 重置所有选择
const resetAll = () => {
  // 重置确认状态
  lunchMeatConfirmed.value = false
  lunchVegConfirmed.value = false
  dinnerMeatConfirmed.value = false
  dinnerVegConfirmed.value = false

  // 清除存储的数据
  store.saveMealSelection(tomorrow, 'lunch', null, null)
  store.saveMealSelection(tomorrow, 'dinner', null, null)

  // 重新随机选择菜品
  changeDish('lunchMeat')
  changeDish('lunchVeg')
  changeDish('dinnerMeat')
  changeDish('dinnerVeg')
}
</script>

<style lang="scss" scoped>
.what-to-eat {
  min-height: 100vh;
  background-color: #f7f8fa;

  .content {
    padding: 16px;
  }
  
  .date-info {
    text-align: center;
    margin-bottom: 24px;
    
    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: #323233;
    }
  }

  .meal-section {
    margin-bottom: 24px;

    .meal-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      
      .van-icon {
        margin-right: 8px;
        font-size: 20px;
        color: #1989fa;
      }

      h3 {
        margin: 0;
        font-size: 17px;
        font-weight: 500;
        color: #323233;
      }
    }
  }

  .dish-selection {
    .dish-card {
      background: #ffffff;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      &:last-child {
        margin-bottom: 0;
      }

      &.confirmed {
        background: #f0f9eb;
      }

      .dish-info {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .dish-name {
          margin-left: 8px;
          font-size: 16px;
          color: #323233;
        }
      }

      .dish-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }

  .final-selection {
    margin-top: 32px;

    .van-divider {
      margin: 24px 0;
      color: #00b578;
      border-color: #00b578;
    }
  }
}
</style> 