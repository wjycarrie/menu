<template>
  <div class="calendar-container">
    <van-nav-bar title="日历" />
    
    <div class="calendar-content">
      <div class="calendar-wrapper">
        <v-calendar
          :attributes="attributes"
          :locale="locale"
          :first-day-of-week="1"
          :is-expanded="true"
          @dayclick="onDayClick"
          class="custom-calendar"
        />
      </div>

      <!-- 菜品详情弹窗 -->
      <van-popup
        v-model:show="showMealDetail"
        position="bottom"
        round
        :style="{ height: '50%' }"
      >
        <div class="meal-detail">
          <div class="meal-detail-header">
            <h3>{{ selectedDateFormatted }}</h3>
            <van-icon name="cross" @click="showMealDetail = false" />
          </div>
          
          <div class="meal-content">
            <template v-if="selectedDayMeals">
              <div class="meal-section" v-if="selectedDayMeals.lunch">
                <h4>午餐</h4>
                <div class="dish-list">
                  <div class="dish-item" v-if="selectedDayMeals.lunch.meat">
                    <van-tag type="primary">荤菜</van-tag>
                    <span>{{ selectedDayMeals.lunch.meat.name }}</span>
                  </div>
                  <div class="dish-item" v-if="selectedDayMeals.lunch.veg">
                    <van-tag type="success">素菜</van-tag>
                    <span>{{ selectedDayMeals.lunch.veg.name }}</span>
                  </div>
                </div>
              </div>
              
              <div class="meal-section" v-if="selectedDayMeals.dinner">
                <h4>晚餐</h4>
                <div class="dish-list">
                  <div class="dish-item" v-if="selectedDayMeals.dinner.meat">
                    <van-tag type="primary">荤菜</van-tag>
                    <span>{{ selectedDayMeals.dinner.meat.name }}</span>
                  </div>
                  <div class="dish-item" v-if="selectedDayMeals.dinner.veg">
                    <van-tag type="success">素菜</van-tag>
                    <span>{{ selectedDayMeals.dinner.veg.name }}</span>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="no-meal">
              <van-empty description="这一天还没有安排菜品" />
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMenuStore } from '../store'

const store = useMenuStore()
const currentDate = ref(new Date())
const selectedDate = ref(null)
const showMealDetail = ref(false)

const locale = {
  id: 'zh-CN',
  firstDayOfWeek: 1,
  masks: {
    L: 'YYYY-MM-DD'
  }
}

const selectedDateFormatted = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

const selectedDayMeals = computed(() => {
  if (!selectedDate.value) return null
  return store.getMealsByDate(selectedDate.value)
})

const monthMeals = computed(() => {
  return store.getMealsByMonth(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth()
  )
})

const attributes = computed(() => {
  const attrs = [
    {
      key: 'today',
      dates: new Date(),
      highlight: {
        fillMode: 'outline',
        color: 'blue'
      }
    }
  ]

  // 添加有菜品的日期标记
  Object.entries(monthMeals.value || {}).forEach(([date, meals]) => {
    if (meals.lunch || meals.dinner) {
      attrs.push({
        key: `meal-${date}`,
        dates: new Date(date),
        highlight: {
          fillMode: 'solid',
          color: 'green'
        }
      })
    }
  })

  return attrs
})

const onDayClick = (day) => {
  selectedDate.value = day.date
  showMealDetail.value = true
}
</script>

<style lang="scss" scoped>
.calendar-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;

  .calendar-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    overflow-y: auto;
  }
}

.calendar-wrapper {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);

  :deep(.custom-calendar) {
    width: 100%;
    --day-content-height: min(7vw, 40px);
    --day-content-width: min(7vw, 40px);
    
    .vc-container {
      border: none;
      width: 100%;
    }

    .vc-weeks {
      padding: 0;
    }

    .vc-day {
      &:not(.is-not-in-month) {
        background-color: white;
        margin: 2px;
        border-radius: 8px;
      }
    }

    .vc-day-content {
      font-weight: 500;
    }

    .vc-highlights {
      .vc-highlight-outline-blue {
        border-color: var(--van-primary-color);
      }
      .vc-highlight-solid-green {
        background-color: var(--van-success-color);
      }
    }
  }
}

.meal-detail {
  padding: 20px;
}

.meal-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  .van-icon {
    font-size: 20px;
    cursor: pointer;
  }
}

.meal-section {
  margin-bottom: 20px;

  h4 {
    margin: 0 0 10px 0;
    color: #666;
  }
}

.dish-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dish-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background-color: #f8f8f8;
  border-radius: 6px;

  span {
    font-size: 14px;
  }
}

.no-meal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style> 