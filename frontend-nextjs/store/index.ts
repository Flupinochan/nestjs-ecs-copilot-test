import create from 'zustand'
import { EditedTask } from '../types'

// zustandは、reduxのような状態管理ライブラリ

// Taskのデータ定義
type State = {
  editedTask: EditedTask // データ型の定義(初期値)
  updateEditedTask: (payload: EditedTask) => void // データを更新する関数
  resetEditedTask: () => void // データをリセットする関数
}

// TaskのStoreの作成
const useStore = create<State>((set) => ({
  editedTask: { id: 0, title: '', description: '' },
  updateEditedTask: (payload) =>
    set({
      editedTask: {
        id: payload.id,
        title: payload.title,
        description: payload.description,
      },
    }),
  resetEditedTask: () =>
    set({ editedTask: { id: 0, title: '', description: '' } }),
}))

export default useStore
