class Compile{
	constructor(el, vm) {
		this.el = this.isElementNode(el) ? el : document.querySelector(el);
		this.vm = vm;
		document.querySelector(el);

		if(this.el) {
			//获取到元素才开始编译
			//将dom加载到内存，fragment
			let fragment = this.nodetoFragment(this.el);

			
			this.compile(fragment);

			//fragment加入页面
			this.el.appendChild(fragment)
		}
	}

	

	//判断是不是节点
	isElementNode(node) {
		return node.nodeType === 1;
	}


	compile(fragment) {
		let childNodes = fragment.childNodes;
		
		Array.from(childNodes).forEach(node=>{
			if(this.isElementNode(node)) {
				this.compile(node);
				this.compileElement(node);
				console.log('element:',node)
			} else{
				this.compileText(node);
				console.log('test:' +node)
			}
		})
	}
	//编译元素
	compileElement(node) {
		let attrs = node.attributes;
		Array.from(attrs).forEach(attr=>{
			console.log(attr.name)
			let attrName = attr.name;
			if(this.isDirective(attrName)) {
				//取到对应值放到节点
				let expr = attr.value;
				let [,type] = attrName.split('-');
				CompileUtil[type](node, this.vm, expr)

			}
		})

	}

	compileText(node) {
		let expr = node.textContent; 
		let reg = /\{\{([^}]+)\}\}/g;
		if(reg.test(expr)) {
			CompileUtil['text'](node, this.vm, expr)
		}
	}
	
	isDirective(name) {
		return name.includes('v-');
	}

	nodetoFragment(el) {
		let fragment = document.createDocumentFragment();
		let firstChild;
		while (firstChild = el.firstChild){
			fragment.appendChild(firstChild);
		}

		return fragment; 
	}

}

CompileUtil = {
	getVal(vm,expr) {
		expr = expr.split('.'); 
		return expr.reduce((prev,next)=>{ 
			return prev[next];
		},vm.$data);
	},

	getTextVal(vm,expr) {
		return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments)=>{
			return this.getVal(vm,arguments[1]);
			
		});
	},
	text(node,vm,expr) {
		let updateFn = this.updater['textUpdate'];
		
		let value = this.getTextVal(vm,expr);
		
		expr.replace(/\{\{([^}]+)\}\}/g, (...arguments)=>{
			
			new Watcher(vm,arguments[1],()=>{
				
				updateFn && updateFn(node,this.getTextVal(vm,expr));
			});
		});
		


		updateFn && updateFn(node,value);
	},

	setVal(vm,expr,value) {
		expr = expr.split('.');
		return expr.reduce((prev,next,currentIndet)=>{
			
			if(currentIndet == expr.length -1) {
				return prev[next] = value;
			}
			return prev[next]; //获取值

		},vm.$data);
	},
	model(node,vm,expr) {
		let updateFn = this.updater['modelUpdate'];

		//加一个监控 数据变化 调用watch的callback
		new Watcher(vm,expr,(newVal)=>{
			
			//值变化调用cb 新值传入 调用watch里updata时调用
			updateFn && updateFn(node,newVal);
		});

		
		node.addEventListener('input',(e)=>{
			let newVal = e.target.value;
			this.setVal(vm,expr,newVal);
		})

		updateFn && updateFn(node,this.getVal(vm,expr));
	},

	updater:{
		textUpdate(node, value) {
			node.textContent = value;
		},
		modelUpdate(node, value) {
			node.value = value;
		}
	}
}

