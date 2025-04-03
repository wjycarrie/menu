<template>
  <div class="menu">
    <van-nav-bar title="菜单" />
    <div class="content">
      <van-button type="primary" block @click="showAddDialog">添加菜品</van-button>
      
      <van-tabs v-model:active="activeTab" sticky>
        <van-tab title="全部">
          <van-empty v-if="!dishes.length" description="暂无菜品" />
          <div v-else class="dish-list">
            <div v-for="dish in dishes" :key="dish.id" class="dish-item">
              <div class="dish-info">
                <span class="dish-name">{{ dish.name }}</span>
                <van-tag :type="dish.type === '荤菜' ? 'danger' : 'success'" round>{{ dish.type }}</van-tag>
                <van-icon name="delete-o" @click="showDeleteConfirm(dish)" />
              </div>
            </div>
          </div>
        </van-tab>

        <van-tab title="荤菜">
          <van-empty v-if="!meatDishes.length" description="暂无荤菜" />
          <div v-else class="dish-list">
            <div v-for="dish in meatDishes" :key="dish.id" class="dish-item">
              <div class="dish-info">
                <span class="dish-name">{{ dish.name }}</span>
                <van-tag type="danger" round>荤菜</van-tag>
                <van-icon name="delete-o" @click="showDeleteConfirm(dish)" />
              </div>
            </div>
          </div>
        </van-tab>

        <van-tab title="素菜">
          <van-empty v-if="!vegDishes.length" description="暂无素菜" />
          <div v-else class="dish-list">
            <div v-for="dish in vegDishes" :key="dish.id" class="dish-item">
              <div class="dish-info">
                <span class="dish-name">{{ dish.name }}</span>
                <van-tag type="success" round>素菜</van-tag>
                <van-icon name="delete-o" @click="showDeleteConfirm(dish)" />
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <van-dialog
      v-model:show="showDialog"
      title="添加菜品"
      show-cancel-button
      @confirm="confirmAdd"
    >
      <van-form @submit="onSubmit">
        <van-field
          v-model="newDish.name"
          name="name"
          label="菜品名称"
          placeholder="请输入菜品名称"
          :rules="[{ required: true, message: '请输入菜品名称' }]"
        />
        <van-field
          name="type"
          label="类型"
        >
          <template #input>
            <van-radio-group v-model="newDish.type" direction="horizontal">
              <van-radio name="荤菜">荤菜</van-radio>
              <van-radio name="素菜">素菜</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-form>
    </van-dialog>

    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除确认"
      show-cancel-button
      confirm-button-text="删除"
      confirm-button-color="#ee0a24"
      @confirm="confirmDelete"
    >
      <div class="delete-confirm-content">
        确定要删除 <span class="highlight">{{ selectedDish?.name }}</span> 吗？
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMenuStore } from '../store'

const store = useMenuStore()
const activeTab = ref(0)
const showDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedDish = ref(null)
const newDish = ref({
  name: '',
  type: '荤菜'
})

const dishes = computed(() => store.dishes)
const meatDishes = computed(() => store.meatDishes)
const vegDishes = computed(() => store.vegDishes)

const showAddDialog = () => {
  showDialog.value = true
}

const showDeleteConfirm = (dish) => {
  selectedDish.value = dish
  showDeleteDialog.value = true
}

const confirmAdd = () => {
  if (!newDish.value.name) return
  store.addDish(newDish.value)
  showDialog.value = false
  newDish.value = { name: '', type: '荤菜' }
}

const confirmDelete = () => {
  if (selectedDish.value) {
    store.removeDish(selectedDish.value.id)
    selectedDish.value = null
  }
}
</script>

<style lang="scss" scoped>
.menu {
  .content {
    padding: 16px;
    padding-top: 0;
    
    .van-button {
      margin: 16px 0;
    }

    .dish-list {
      padding: 16px 0;
    }

    .dish-item {
      background: #fff;
      border-radius: 8px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(100, 101, 102, 0.08);

      &:active {
        background-color: #f5f5f5;
      }

      .dish-info {
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 8px;

        .dish-name {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }

        .van-icon {
          font-size: 20px;
          color: #999;
          padding: 4px;

          &:active {
            color: #ee0a24;
          }
        }
      }
    }
  }
}

.delete-confirm-content {
  padding: 16px;
  text-align: center;
  
  .highlight {
    color: #ee0a24;
    font-weight: 500;
  }
}
</style> 