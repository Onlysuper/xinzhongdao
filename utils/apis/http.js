function HTTP(obj, config) {
	let defaultConfig = {
		isRes: false,
		loading: false
	}
	config = { ...defaultConfig,
		...config
	}
    wx.showNavigationBarLoading();
	return new Promise((resolve, reject) => {
		let langs = wx.I18n.getLanguage();
		let options = {
			url: "",
			method: "GET",
			data: {},
			dataType: "json",
			header: {
				"content-type": "application/json",
				"X-requested-With": "XMLHttpRequest"
			},
			success: (res) => {
				// 状态码为200
				wx.hideNavigationBarLoading();
				if(res.data.code=='1'){
					resolve(res.data);
				}else{
					wx.$toast({
					
						content: res.data.msg,
						showCancel: false
					})
				}
			},fail: (err) => {
                wx.hideNavigationBarLoading();
                wx.$toast({
					title: langs['http_error'],
                    showCancel: false
                  })
				reject(langs['http_error']);
			},
			complete: () => {}
		}
		options = { ...options,
			...obj
		};
		if (options.url && options.method) {
			wx.request(options);
		} 
	})
}
export default{
	POST(baseurl,url, data) {
		return HTTP({
			url:baseurl+url,
			data,
			method: "POST"
		});
	},
	POSTFORM(baseurl,url, data) {
		return HTTP({
			url:baseurl+url,
			data,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: "POST"
		});
	}
}