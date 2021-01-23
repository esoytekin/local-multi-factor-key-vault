let CategoryDao = require('../dao/categoryDao');
let TaskDao = require('../dao/taskDao');
let SubtaskDao = require('../dao/subtaskDao');

class TaskPaperService {
    constructor(){
      this.categoryDao = new CategoryDao();
      this.taskDao = new TaskDao();
      this.subtaskDao = new SubtaskDao();
    }
    getCategoryByUser(userId) {
        return this.categoryDao.findByUserId(userId);    
    }
    getCategoryByName(userId, name) {
        return this.categoryDao.findByUserAndName(userId,name);
    }
    saveCategory(name, userId) {
        return this.categoryDao.save(name, userId);
    }

    deleteCategory(category) {
        return this.categoryDao.deleteById(category.id);
    }

    updateCategory(category) {
        return this.categoryDao.update(category);
    }

    getTasksByCategoryName(userId, categoryName) {
        //get category
        //get tasks by categoryid
        console.log(`userid : ${userId} category: ${categoryName}`);
        return this.categoryDao.findByUserAndName(userId,categoryName).then(category => {
            if (category)
                return this.taskDao.findByCategory(category.id);
            else 
                return [];
        
        })
        .catch(err =>{
            console.log(err);
        })
    }

    getTaskById(taskId) {
        return this.taskDao.getById(taskId);
    }

    saveTask(task,userId){
        if (!task.hasOwnProperty('categoryName') || !task.hasOwnProperty("description") || ( task.categoryName.length <= 0 )) {
            throw new Error("task is not defined correctly");
        }


        let categoryName = task.categoryName;

        return this.categoryDao.findByUserAndName(userId, categoryName).then(category => {
            task.categoryId = category.id;
            return this.taskDao.save(task);
        })

    }

    updateTask(task) {
        return this.taskDao.update(task);
    }

    deleteTask(task){
        return this.taskDao.delete(task);
    }

    completeTask(task) {
        return this.taskDao.complete(task);
    }

    getSubtaskByTaskId(taskId) {
    
        return this.subtaskDao.findByTaskId(taskId);
    }

    updateSubTask(subTask) {

        return this.subtaskDao.update(subTask);
    }

    createSubtask(subtask) {
        return this.subtaskDao.save(subtask);
    }

    deleteSubtask(id) {
        return this.subtaskDao.deleteById(id);
    }
}

module.exports = TaskPaperService;
