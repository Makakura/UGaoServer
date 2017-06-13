const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
var schedule = require('node-schedule');
app.use(cors());
var basicAuth = require('express-basic-auth');
app.use(basicAuth( { authorizer: myAuthorizer } ))


User =require('./models/user.js');
Item =require('./models/item.js');
Cart =require('./models/cart.js');
Order =require('./models/order.js');

// ket noi toi mongoose
//mongoose.connect('mongodb://localhost:27017/ugasdb')
mongoose.connect('mongodb://makakura:0985554820@ds023064.mlab.com:23064/bpartner');
mongoose.connection.on('connected', function (err) {
  console.log('Connected to DB');
});
var db = mongoose.connection;
 
function myAuthorizer(username, password) {
	console.log(username);
	console.log(password);
    if(username==="user" && password==="123456"){
		console.log(username);
		return true;
	}
}

app.set('port', (process.env.PORT || 5000));

app.get('/', (req, res) => {
	res.send('Hello pe hoa');
});

app.post('/api/hetgao', (req, res) => {
	var jsonString = req.headers.authorization;

		// Push Nor
		var requestify = require('requestify');
		requestify.request('https://fcm.googleapis.com/fcm/send', {
			method: 'POST',
			body: {
				'notification':{
					'title':'UGao', 
					'body':'Bạn sắp hết gạo, click để đặt gạo ngay',   
					'sound':'default',  
					'click_action':'FCM_PLUGIN_ACTIVITY',   
					'icon':'fcm_push_icon'   
				},
				'data':{
					'type': '2', // hết gạo reminder
				},
					'to': '/topics/client',
					'priority':'high',  
					'restricted_package_name':''  
			},
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'key=AIzaSyAglKU9k9G4W8TZmo5N9DmLslQdaMsm1G8'
			},
			dataType: 'json'        
		})
		.then(function(response) {
			console.log(JSON.stringify(response));
		});
		// End push nor


	console.log("Post Form ESP8266 Het Gao");	
	console.log("header: "+jsonString);
	res.json(req.headers.authorization); 
});
app.post('/api/congao', (req, res) => {
	var jsonString = req.headers.authorization;
	console.log("Post Form ESP8266 Con Gao");	
	console.log("header: "+jsonString);
	res.json(req.headers.authorization);

	var jsonString = req.headers.authorization;
	console.log("Post Form ESP8266 Het Gao");	
	console.log("header: "+jsonString);
	res.json(req.headers.authorization);

	var requestify = require('requestify');
	requestify.request('https://fcm.googleapis.com/fcm/send', {
		method: 'POST',
		body: {
			'notification':{
				'title':'UGao', 
				'body':'Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của UGao',   
				'sound':'default',  
				'click_action':'FCM_PLUGIN_ACTIVITY',   
				'icon':'fcm_push_icon'   
			},
			'data':{
				'type': '3', // hết gạo reminder
			},
				'to': '/topics/client',
				'priority':'high',  
				'restricted_package_name':''  
		},
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'key=AIzaSyAglKU9k9G4W8TZmo5N9DmLslQdaMsm1G8'
		},
		dataType: 'json'        
	})
	.then(function(response) {
		console.log(JSON.stringify(response));
	});
});

// User
// Get all user
app.get('/api/users', function(req, res){
	User.getUsers(function(err, users){
		if(err){
			throw err;
		}
		res.json(users);
	});
});
// Get all user
app.get('/api/staffs', function(req, res){
	User.getStaffs(function(err, users){
		if(err){
			throw err;
		}
		res.json(users);
	});
});
// get user by name
app.get('/api/users/:_id', function(req, res){
	User.getUserByUserName(req.params._id, function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});
// add new user
app.post('/api/users', function(req, res){
	var jsonString = '';
        req.on('data', function (data) {
            jsonString += data;
        });
        req.on('end', function () {
			var user = JSON.parse(jsonString)
			user.Point = 0;
			user.DayUse = 60,
			user.DayRemain = 60;
			user.Type = 1;
			user.isActive= false;
			user.PushToken = "";
			User.addUser(user, function(err, user){
				if(err){
					throw err;
				}
				res.json(user);
			});
        });
	
});
//update user
app.put('/api/users/:_id', function(req, res){
	var jsonString = '';
        req.on('data', function (data) {
            jsonString += data;
        });
        req.on('end', function () {
			var id = req.params._id;
			var user = JSON.parse(jsonString)
			
			User.updateUser(id, user, {}, function(err, user){
				if(err){
					throw err;
				}
				res.json(user);
			});
        });
});
// Item
//Get all item
app.get('/api/items', function(req, res){
	Item.getItems(function(err, items){
		if(err){
			throw err;
		}
		res.json(items);
	});
});
app.post('/api/items',function (req, res, next) {
 var jsonString = '';
        req.on('data', function (data) {
            jsonString += data;
        });
        req.on('end', function () {
			var item = JSON.parse(jsonString)
			Item.addItem(item, function(err, item){
				if(err){
					throw err;
				}
				res.json(item);
			});
        });
});
//update item
app.put('/api/items/:_id', function(req, res){
	var jsonString = '';
        req.on('data', function (data) {
            jsonString += data;
        });
        req.on('end', function () {
			var id = req.params._id;
			var item = JSON.parse(jsonString)
			Item.updateItem(id, item, {}, function(err, item){
				if(err){
					throw err;
				}
				res.json(item);
			});
        });
});
// Cart
//Get all cart
app.get('/api/carts', function(req, res){
	Cart.getCarts(function(err, carts){
		if(err){
			throw err;
		}
		res.json(carts);
	});
});
// get cart by cart id
app.get('/api/carts/:_id', function(req, res){
	Cart.getCartByUserId(req.params._id, function(err, cart){
		if(err){
			throw err;
		}
		res.json(cart);
	});
});
// add new cart
app.post('/api/carts', function(req, res){
	var jsonString = '';
        req.on('data', function (data) {
            jsonString += data;
        });
        req.on('end', function () {
			var cart = JSON.parse(jsonString);
			Cart.addCart(cart, function(err, cart){
				if(err){
					throw err;
				}
				res.json(cart);
			});
        });
	
});
//update cart
app.put('/api/carts/:_id', function(req, res){
	var jsonString = '';
        req.on('data', function (data) {
            jsonString += data;
        });
        req.on('end', function () {
			var id = req.params._id;
			var cart = JSON.parse(jsonString)
			Cart.updateCart(id, cart, {}, function(err, cart){
				if(err){
					throw err;
				}
				res.json(cart);
			});
        });
});
// Order
//Get all order
app.get('/api/orders', function(req, res){
	Order.getOrders(function(err, posts){
		if(err){
			throw err;
		}
		res.json(posts);
	});
});
// get order 1 by user or 2 by shipperId 3 by confirmed
app.get('/api/orders/:_flag/:value', function(req, res){
	var flag = req.params._flag;
	var value= req.params.value;
	if(flag==1){
		Order.getOrderByUserId(value, function(err, orders){
			if(err){
				throw err;
			}
			res.json(orders);
		});
	}
	else if(flag==2){
		Order.getOrderByShipperId(value, function(err, orders){
			if(err){
				throw err;
			}
			res.json(orders);
		});
	}
	else if(flag==3){
		Order.getOrderByStatus(value, function(err, orders){
			if(err){
				throw err;
			}
			res.json(orders);
		});
	}
	else throw err;
});
// get order by id
app.get('/api/orders/:_id', function(req, res){
	Order.getOrderById(req.params._id, function(err, order){
		if(err){
			throw err;
		}
		res.json(order);
	});
});
// add new order
app.post('/api/orders', function(req, res){
	var jsonString = '';
        req.on('data', function (data) {
            jsonString += data;
        });
        req.on('end', function () {
			var order = JSON.parse(jsonString);
			Order.addOrder(order, function(err, order){
				if(err){
					throw err;
				}
				res.json(order);
				// Push Nor
				var requestify = require('requestify');
				requestify.request('https://fcm.googleapis.com/fcm/send', {
					method: 'POST',
					body: {
						'notification':{
							'title':'Thông báo', 
							'body':'Có đơn hang mới',   
							'sound':'default',  
							'click_action':'FCM_PLUGIN_ACTIVITY',   
							'icon':'fcm_push_icon'   
						},
						'data':{
							'type': '1',
							'id':order._id,
						},
							'to':'/topics/host', 
							'priority':'high',  
							'restricted_package_name':''  
					},
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'key=AIzaSyAglKU9k9G4W8TZmo5N9DmLslQdaMsm1G8'
					},
					dataType: 'json'        
				})
				.then(function(response) {
					console.log(JSON.stringify(response));
				});
				// End push nor
			});
        });
	
});
//update order
app.put('/api/orders/:_id', function(req, res){
	var jsonString = '';
        req.on('data', function (data) {
            jsonString += data;
        });
        req.on('end', function () {
			var id = req.params._id;
			var orderTemp = JSON.parse(jsonString);
			console.log(orderTemp.Status);
			var pushToken = "";
			Order.updateOrderStatus(id, orderTemp, {}, function(err, orderTemp){
				if(err){
					throw err;
				}
				res.json(orderTemp);
			});
			if(orderTemp.Status ==3){
				User.getUserById(orderTemp.OwnerId, function(err, user){
					pushToken=user.PushToken;
					console.log(pushToken);
					// Push Nor
					var requestify = require('requestify');
					requestify.request('https://fcm.googleapis.com/fcm/send', {
						method: 'POST',
						body: {
							'notification':{
								'title':'Thông báo', 
								'body':'Gas của bạn đang được chuyển đi, sẽ tới trong vòng 30 phút, nhớ giữ liên lạc nha ;)',   
								'sound':'default',  
								'click_action':'FCM_PLUGIN_ACTIVITY',   
								'icon':'fcm_push_icon'   
							},
							'data':{
								'type': '1',
								'id':orderTemp._id,
							},
								'to': pushToken, 
								'priority':'high',  
								'restricted_package_name':''  
						},
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'key=AIzaSyAglKU9k9G4W8TZmo5N9DmLslQdaMsm1G8'
						},
						dataType: 'json'        
					})
					.then(function(response) {
						console.log(JSON.stringify(response));
					});
					// End push nor
				});
				
			}
			else  if(orderTemp.Status == 2){
				console.log("push nor to deliver");
				var requestify = require('requestify');
				requestify.request('https://fcm.googleapis.com/fcm/send', {
					method: 'POST',
					body: {
						'notification':{
							'title':'Thông báo', 
							'body':'Có đơn hàng mới cần chuyển đi',   
							'sound':'default',  
							'click_action':'FCM_PLUGIN_ACTIVITY',   
							'icon':'fcm_push_icon'   
						},
						'data':{
							'type': '1',
							'id':orderTemp._id,
						},
							'to': '/topics/shipper',
							'priority':'high',  
							'restricted_package_name':''  
					},
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'key=AIzaSyAglKU9k9G4W8TZmo5N9DmLslQdaMsm1G8'
					},
					dataType: 'json'        
				})
				.then(function(response) {
					console.log(JSON.stringify(response));
				});
			}
			else if(orderTemp.Status == 0){
				User.getUserById(orderTemp.OwnerId, function(err, user){
					pushToken=user.PushToken;
					console.log(pushToken);
					// Push Nor
					var requestify = require('requestify');
					requestify.request('https://fcm.googleapis.com/fcm/send', {
						method: 'POST',
						body: {
							'notification':{
								'title':'Thông báo', 
								'body':'Đơn hàng của bạn đã bị hủy, liên hệ 01649051057 để được hỗ trợ!',   
								'sound':'default',  
								'click_action':'FCM_PLUGIN_ACTIVITY',   
								'icon':'fcm_push_icon'   
							},
							'data':{
								'type': '1',
								'id':orderTemp._id,
							},
								'to': pushToken, 
								'priority':'high',  
								'restricted_package_name':''  
						},
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'key=AIzaSyAglKU9k9G4W8TZmo5N9DmLslQdaMsm1G8'
						},
						dataType: 'json'        
					})
					.then(function(response) {
						console.log(JSON.stringify(response));
					});
					// End push nor
				});
				
			}
        });
});
app.get('/api/ordersbyIDate/:_id', function(req, res){
	Order.getOrderByShipperIdInCurrentDay(req.params._id, function(err, order){
		if(err){
			throw err;
		}
		res.json(order);
	});
});
app.get('/api/GetOrderByDay', function(req, res){
	Order.getOrderByDay(function(err, orders){
		if(err){
			throw err;
		}
		res.json(orders);
	});
});
app.put('/api/ordersStatus/:_id', function(req, res){
	var jsonString = '';
        req.on('data', function (data) {
            jsonString += data;
        });
        req.on('end', function () {
			var id = req.params._id;
			var orderTemp = JSON.parse(jsonString);
			console.log(orderTemp.Status);
			var pushToken = "";
			Order.updateOrderStatus(id, orderTemp, {}, function(err, orderTemp){
				if(err){
					throw err;
				}
				res.json(orderTemp);
			});
			if(orderTemp.Status ==3){
				User.getUserById(orderTemp.OwnerId, function(err, user){
					pushToken=user.PushToken;
					console.log(pushToken);
					// Push Nor
					var requestify = require('requestify');
					requestify.request('https://fcm.googleapis.com/fcm/send', {
						method: 'POST',
						body: {
							'notification':{
								'title':'Thông báo', 
								'body':'Gas của bạn đang được chuyển đi, sẽ tới trong vòng 30 phút, nhớ giữ liên lạc nha ;)',   
								'sound':'default',  
								'click_action':'FCM_PLUGIN_ACTIVITY',   
								'icon':'fcm_push_icon'   
							},
							'data':{
								'type': '1',
								'id':orderTemp._id,
							},
								'to': pushToken, 
								'priority':'high',  
								'restricted_package_name':''  
						},
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'key=AIzaSyAglKU9k9G4W8TZmo5N9DmLslQdaMsm1G8'
						},
						dataType: 'json'        
					})
					.then(function(response) {
						console.log(JSON.stringify(response));
					});
					// End push nor
				});
				
			}
			else  if(orderTemp.Status == 2){
				console.log("push nor to deliver");
				var requestify = require('requestify');
				requestify.request('https://fcm.googleapis.com/fcm/send', {
					method: 'POST',
					body: {
						'notification':{
							'title':'Thông báo', 
							'body':'Có đơn hàng mới cần chuyển đi',   
							'sound':'default',  
							'click_action':'FCM_PLUGIN_ACTIVITY',   
							'icon':'fcm_push_icon'   
						},
						'data':{
							'type': '1',
							'id':orderTemp._id,
						},
							'to': '/topics/shipper',
							'priority':'high',  
							'restricted_package_name':''  
					},
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'key=AIzaSyAglKU9k9G4W8TZmo5N9DmLslQdaMsm1G8'
					},
					dataType: 'json'        
				})
				.then(function(response) {
					console.log(JSON.stringify(response));
				});
			}
			else if(orderTemp.Status == 0){
				User.getUserById(orderTemp.OwnerId, function(err, user){
					pushToken=user.PushToken;
					console.log(pushToken);
					// Push Nor
					var requestify = require('requestify');
					requestify.request('https://fcm.googleapis.com/fcm/send', {
						method: 'POST',
						body: {
							'notification':{
								'title':'Thông báo', 
								'body':'Đơn hàng của bạn đã bị hủy, liên hệ 01649051057 để được hỗ trợ!',   
								'sound':'default',  
								'click_action':'FCM_PLUGIN_ACTIVITY',   
								'icon':'fcm_push_icon'   
							},
							'data':{
								'type': '1',
								'id':orderTemp._id,
							},
								'to': pushToken, 
								'priority':'high',  
								'restricted_package_name':''  
						},
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'key=AIzaSyAglKU9k9G4W8TZmo5N9DmLslQdaMsm1G8'
						},
						dataType: 'json'        
					})
					.then(function(response) {
						console.log(JSON.stringify(response));
					});
					// End push nor
				});
				
			}
        });

});
// xoa order
app.delete('/api/orders/:_id', function(req, res){
	var id = req.params._id;
	Order.removeOrder(id, function(err, order){
		if(err){
			throw err;
		}
		res.json(order);
	});
});
app.get('/api/GetReportData',function(req,res){
	var numofWaitingOrder=0;
	var numOfOrder=0;
	var numofSuccessOrder=0;	
	var totalMoneyInDay=0;
	Order.getOrderByDay(function(err,orders){
		if(err){
			throw err;
		}
		numOfOrder=orders.length;
		console.log(orders.length);
		orders.forEach(function(item){
			if(item.Status==1)
				numofWaitingOrder++;
			});		
		Order.getSuccessOrderByDay(function(err,successOrders){
			if(err){
				throw err;
			}
			successOrders.forEach(function(item){
				totalMoneyInDay+=item.Total;
			});
			numofSuccessOrder=successOrders.length;
			console.log(totalMoneyInDay);
			Order.getOrderByCurrentMonth(function(err, ordersData){
				if(err){
					throw err;
				}
				//console.log(ordersData);			
				res.json({'numofWaitingOrder':numofWaitingOrder,
					'numofSuccessOrder':numofSuccessOrder,
					'totalMoneyInDay':totalMoneyInDay,
					'numOfOrder':numOfOrder,'ordersInMonth':ordersData});
			});
			
		});
		
	})
	
});
app.get('/api/GetReportDataInMonth',function(req,res){
	Order.getOrderByCurrentMonth(function(err, order){
		if(err){
			throw err;
		}
		res.json(order);
	});
	
});
app.get('/api/getshipperdatareport/:_id',function(req,res){
	var numOfwaitingOrder=0;
	var totalMoneyInDay=0;
	var numOfDeliveredOrder=0;	
	var totalMoneyReceive=0;
	var totalMoneyInMonth=0;
	var totalSuccessOrderInMonth=0
	var totalFailOrderInMonth=0;
	console.log(req.params);
	Order.getOrderByShipperIdInMonth(req.params._id, function(err, orderInMonth){
		if(err){
			throw err;
		}
		orderInMonth.forEach(function(item, index){
			if(item.Status===4){
				totalMoneyInMonth+=item.Total;
				totalSuccessOrderInMonth++;
			}
			if(item.Status===0){
				totalFailOrderInMonth++;
			}
		});
		Order.getOrderByShipperIdInCurrentDay(req.params._id, function(err, orderInDay){
			orderInDay.forEach(function(item,index){
				if(item.Status===4){
					totalMoneyInDay+=item.Total;
					numOfDeliveredOrder++;
				}
				if(item.Status===3){
					totalMoneyReceive+=item.Total;
					numofWaitingOrder++;
				}
			});
			res.json({'numOfwaitingOrder':numOfwaitingOrder,
					'totalMoneyInDay':totalMoneyInDay,
					'numOfDeliveredOrder':numOfDeliveredOrder,
					'totalMoneyReceive':totalMoneyReceive,
					'totalMoneyInMonth':totalMoneyInMonth,
					'totalSuccessOrderInMonth':totalSuccessOrderInMonth,
					'totalFailOrderInMonth':totalFailOrderInMonth
			});
		});

		
	});
})
var j = schedule.scheduleJob('17 * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
  User.getUsers(function(err,users){
	  if(err){
		  throw err;
	  }
	  users.forEach(function(user,index){
		  console.log(user.UserName);
	  });

  })
});

// Run on server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
