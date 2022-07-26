// 给需要变化的元素（input）增加观察者，数据变化后执行对应方法
class Watcher{
	constructor(vm, expr, fn) {
		this.vm = vm;
		this.expr = expr;
		this.cb = fn;
		this.oldvalue = this.getOld();		
	}
	//获取数值
	getVal(vm,expr) {
		expr = expr.split('.'); 
		return expr.reduce((prev,next)=>{ 
			return prev[next];
		},vm.$data);
	}
	//获取旧的数值
	getOld() {
		Dep.target = this;

		let oldVal = this.getVal(this.vm,this.expr);

		Dep.target = null;

		return oldVal;
	}
	//更新
	update() {
		let newVal = this.getVal(this.vm,this.expr);
		let oldVal = this.oldvalue;
		//比对新值和旧值，发生变化则执行更新方法
		if(newVal != oldVal) {
			this.cb(newVal) 
		} 
	}	
}