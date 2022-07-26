
class MVVM{
	constructor(options) {
		//属性挂载在实例
		this.$el = options.el;
		this.$data = options.data;

		if(this.$el) {
			//数据劫持，将对象所有属性 改为get和set方法
			new Observer(this.$data);
			this.proxyData(this.$data)
			//用数据和元素编译
			new Compile(this.$el, this);
		}
	}
	
	proxyData(data) {
		Object.keys(data).forEach((key)=>{
			Object.defineProperty(this,key,{

				get: function() {
					return data[key];
				},
				set: function(newVal) {
					data[key] = newVal;
				}
			})
		})

	}
}