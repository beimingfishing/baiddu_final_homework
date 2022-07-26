
class Observer{
	//构造器
	constructor(data) {

		this.observe(data);
		
	}

	observe(data) {
		//将data属性改为get和set形式
		if(!data || typeof data !== 'object') {
			return
		}

		//数据属性一一劫持
		Object.keys(data).forEach(key=>{
			this.defineReactive(data,key,data[key]);
			this.observe(data[key]);					
		})

	}
	
	defineReactive(obj,key,value) {
		let that = this;
		
		//每个变化数据对应一个数组  存放所有更新操作
		let dep = new Dep();

		//设置get 和 set
		Object.defineProperty(obj, key, {
			enumerable:true,
			configurable:true,

			get: function() {

				Dep.target && dep.addSub(Dep.target);

				return value;
			},

			set: function(newVal) {
				if(newVal != value){
					that.observe(newVal); // 如果是对象仍劫持
					value = newVal;

					dep.notify(); //通知所有 数据更新
				}
			}
		});

	}
}


//发布订阅 数组
class Dep{
	constructor() {
		this.subs = [];
	}

	addSub(watcher) {
		this.subs.push(watcher)
	}

	notify() {
		this.subs.forEach(watcher=>watcher.update());
	}
}