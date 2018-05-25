let test = {
	chromeAgent45: "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
	chromeAgent68: "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3414.0 Safari/537.36",
	safariAgent11: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0.2 Safari/604.4.7",
	mozAgent38: "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0",
	mozAgent58: "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:58.0) Gecko/20100101 Firefox/58.0",
	mozAgent56: "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0",
	ieAgent7: "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; Zoom 3.6.0)",
	ieAgent8: "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; Zoom 3.6.0)",
	ieAgent9: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; Zoom 3.6.0)",
	ieAgent10: "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; Zoom 3.6.0)",
	ieAgent11: "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; Zoom 3.6.0; rv:11.0) like Gecko"
}

//NT 6.0——Windows Vista；Windows Server 2008 
//NT 6.1——Windows 7；Windows Server 2008 R2 
//NT 6.2——Windows 8, Windows RT；Windows Server 2012
//NT 6.3—— Windows 8.1；Windows Server 2012 R2。

let systemMap = {
	"WINDOWS NT 6.0": "WINDOWS VISTA",
	"WINDOWS NT 6.1": "WINDOWS 7",
	"WINDOWS NT 6.2": "WINDOWS 8",
	"WINDOWS NT 6.3": "WINDOWS 8.1",
	"WINDOWS NT 6.4": "WINDOWS 10",
	"WINDOWS NT 10.0": "WINDOWS 10"
}

function agentHandler(userAgent) {
	userAgent = userAgent.toUpperCase();
	userAgent = userAgent.slice(userAgent.indexOf(" ") + 1, userAgent.length);

	//	console.log(userAgent)
	let model = {
		//内核
		//IE,CHROME,FIREFOX,SAFARI
		kernel: null,
		//版本
		kernelVersion: null,
		//完整版本
		kernelFullVersion: null,
		//操作系统
		system: null,
		//系统版本
		//cpu架构
		//architecture: null
	}

	let _systemInfo = null;

	//操作系统位数
	let _architecture = null;

	let _kernelFullVersion = null;

	//TRIDENT 内核 IE,IE和其他的非常不一样
	if(userAgent.indexOf("TRIDENT") !== -1) {
		model.kernel = "IE";
		let items = userAgent.slice(userAgent.indexOf("(") + 1, userAgent.indexOf(")")).split(";").map(item => item.trim());
		//ie11+版本
		//-11 浏览器版本，0系统信息 2cpu架构
		if(userAgent.indexOf("LIKE GECKO") !== -1) {
			_systemInfo = items[0];
			_architecture = items[1];
			_kernelFullVersion = items[items.length - 1].split(":")[1];
		}
		//ie10-版本
		//1 浏览器版本，2系统信息 3cpu架构
		else {
			_systemInfo = items[2];
			_architecture = items[3];
			_kernelFullVersion = items[1].split(" ")[1]
		}
		//ie里面 8，9，10，和 11也是不一样的
	} else if(userAgent.indexOf("FIREFOX") !== -1) {
		model.kernel = "FIREFOX";
		let items = userAgent.slice(userAgent.indexOf("(") + 1, userAgent.indexOf(")")).split(";").map(item => item.trim());
		_systemInfo = items[0];
		_architecture = items[1];
		_kernelFullVersion = items[items.length - 1].split(":")[1];
	} else if(userAgent.indexOf("CHROME") !== -1) {
		model.kernel = "CHROME";
		let items = userAgent.slice(userAgent.indexOf("(") + 1, userAgent.indexOf(")")).split(";").map(item => item.trim());
		let items2 = userAgent.slice(userAgent.lastIndexOf(")") + 1, userAgent.length).trim().split(" ");
		_systemInfo = items[0];
		_architecture = items[1];
		_kernelFullVersion = items2[0].split("/")[1]
	} else if(userAgent.indexOf("VERSION") !== -1) {
		model.kernel = "SAFARI";
		let items = userAgent.slice(userAgent.indexOf("(") + 1, userAgent.indexOf(")")).split(";").map(item => item.trim());
		let items2 = userAgent.slice(userAgent.lastIndexOf(")") + 1, userAgent.length).trim().split(" ");
		_systemInfo = items[1];
		_kernelFullVersion = items2[0].split("/")[1]
	}

	model.kernelFullVersion = _kernelFullVersion;
	model.kernelVersion = parseInt(_kernelFullVersion)
	model.system = _systemInfo in systemMap ? systemMap[_systemInfo] : _systemInfo;
	return model
}

Object.keys(test).forEach(key => {
	console.log(agentHandler(test[key]))
})