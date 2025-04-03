import { defineStore } from 'pinia'

// 调试日志
const debugStore = (message, data) => {
  console.log(`[Store] ${message}`, data)
  try {
    localStorage.setItem('debug_store_' + Date.now(), JSON.stringify({ message, data }))
  } catch (e) {
    console.error('无法存储调试信息', e)
  }
}

// 从本地存储加载数据
const loadFromStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch (e) {
    console.error(`加载${key}数据失败:`, e)
    return defaultValue
  }
}

// 保存数据到本地存储
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`保存${key}数据失败:`, e)
  }
}

// 日期格式化
const formatDate = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const useMenuStore = defineStore('menu', {
  state: () => {
    // 记录状态初始化
    debugStore('初始化状态', '开始')
    
    const defaultState = {
      meatDishes: [
        { id: 1, name: '清蒸排骨', type: '荤菜' },
        { id: 2, name: '爆炒花甲', type: '荤菜' },
        { id: 3, name: '猪排', type: '荤菜' },
        { id: 4, name: '清蒸鸡', type: '荤菜' },
        { id: 5, name: '清蒸虾', type: '荤菜' },
        { id: 6, name: '清蒸鸡翅', type: '荤菜' },
        { id: 7, name: '豉油鸡', type: '荤菜' },
        { id: 8, name: '炒鱿鱼', type: '荤菜' },
        { id: 9, name: '清蒸多宝鱼', type: '荤菜' },
        { id: 10, name: '清蒸鲈鱼', type: '荤菜' },
        { id: 11, name: '鸡翅', type: '荤菜' },
        { id: 12, name: '烤肠', type: '荤菜' },
        { id: 13, name: '红烧肉炖豆角', type: '荤菜' },
        { id: 14, name: '红烧排骨炖豆角', type: '荤菜' },
        { id: 15, name: '牛肝菌炒青椒腊肠', type: '荤菜' },
        { id: 16, name: '土豆牛腩', type: '荤菜' },
        { id: 17, name: '四季豆炒肉', type: '荤菜' },
        { id: 18, name: '白蘑菇炒肉', type: '荤菜' },
        { id: 19, name: '土豆雪花牛肉粒', type: '荤菜' },
        { id: 20, name: '椰子鸡火锅', type: '荤菜' },
        { id: 21, name: '萝卜排骨汤', type: '荤菜' },
        { id: 22, name: '韭黄炒鸡蛋', type: '荤菜' },
        { id: 23, name: '芦笋炒肉', type: '荤菜' },
        { id: 24, name: '胡萝卜玉米山药排骨汤', type: '荤菜' }
      ],
      vegDishes: [
        { id: 25, name: '地三鲜', type: '素菜' },
        { id: 26, name: '豆角炒茄子', type: '素菜' },
        { id: 27, name: '丝瓜豆腐蛋汤', type: '素菜' },
        { id: 28, name: '栗子山药红枣鸡汤', type: '素菜' },
        { id: 29, name: '上汤娃娃菜', type: '素菜' },
        { id: 30, name: '西红柿蛋汤', type: '素菜' },
        { id: 31, name: '紫菜蛋花汤', type: '素菜' },
        { id: 32, name: '炒西葫芦', type: '素菜' },
        { id: 33, name: '炒油麦菜', type: '素菜' },
        { id: 34, name: '白灼菜心', type: '素菜' }
      ],
      calendarMeals: loadFromStorage('calendarMeals', {})
    }

    // 从本地存储加载数据
    const state = {
      meatDishes: loadFromStorage('meatDishes', defaultState.meatDishes),
      vegDishes: loadFromStorage('vegDishes', defaultState.vegDishes),
      calendarMeals: defaultState.calendarMeals
    }

    // 保存默认数据到本地存储
    saveToStorage('meatDishes', state.meatDishes)
    saveToStorage('vegDishes', state.vegDishes)

    // 记录状态初始化完成
    debugStore('初始化状态', { 
      meatDishesCount: state.meatDishes.length,
      vegDishesCount: state.vegDishes.length,
      calendarMealsCount: Object.keys(state.calendarMeals).length
    })
    
    return state
  },

  getters: {
    dishes() {
      return [...this.meatDishes, ...this.vegDishes]
    }
  },

  actions: {
    addDish(dish) {
      debugStore('添加菜品', dish)
      if (dish.type === '荤菜') {
        this.meatDishes.push(dish)
        saveToStorage('meatDishes', this.meatDishes)
      } else {
        this.vegDishes.push(dish)
        saveToStorage('vegDishes', this.vegDishes)
      }
    },

    removeDish(dishId) {
      debugStore('移除菜品', { id: dishId })
      this.meatDishes = this.meatDishes.filter(dish => dish.id !== dishId)
      this.vegDishes = this.vegDishes.filter(dish => dish.id !== dishId)
      saveToStorage('meatDishes', this.meatDishes)
      saveToStorage('vegDishes', this.vegDishes)
    },

    saveMealSelection(date, mealType, meat, veg) {
      const dateStr = formatDate(date)
      if (!this.calendarMeals[dateStr]) {
        this.calendarMeals[dateStr] = {}
      }
      this.calendarMeals[dateStr][mealType] = { meat, veg }
      saveToStorage('calendarMeals', this.calendarMeals)
      debugStore('保存菜品到日历', { date: dateStr, mealType, meat, veg })
    },

    getMealsByDate(date) {
      const dateStr = formatDate(date)
      return this.calendarMeals[dateStr]
    },

    getMealsByMonth(year, month) {
      const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
      return Object.entries(this.calendarMeals)
        .filter(([date]) => date.startsWith(monthStr))
        .reduce((acc, [date, meals]) => {
          acc[date] = meals
          return acc
        }, {})
    }
  }
}) 