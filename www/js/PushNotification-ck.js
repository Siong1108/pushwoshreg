//
//  PushNotification.js
//
// Based on the Push Notifications Cordova Plugin by Olivier Louvignes on 06/05/12.
// Modified by Max Konev on 18/05/12.
//
// Pushwoosh Push Notifications Plugin for Cordova iOS
// www.pushwoosh.com
//
// MIT Licensed
function PushNotification(){}var exec=require("cordova/exec");PushNotification.prototype.registerDevice=function(e,t,n){exec(t,n,"PushNotification","registerDevice",e?[e]:[])};PushNotification.prototype.setTags=function(e,t,n){exec(t,n,"PushNotification","setTags",e?[e]:[])};PushNotification.prototype.sendLocation=function(e,t,n){exec(t,n,"PushNotification","sendLocation",e?[e]:[])};PushNotification.prototype.onDeviceReady=function(){exec(null,null,"PushNotification","onDeviceReady",[])};PushNotification.prototype.getTags=function(e,t){exec(e,t,"PushNotification","getTags",[])};PushNotification.prototype.unregisterDevice=function(e,t){exec(e,t,"PushNotification","unregisterDevice",[])};PushNotification.prototype.createLocalNotification=function(e,t,n){exec(t,n,"PushNotification","createLocalNotification",e?[e]:[])};PushNotification.prototype.clearLocalNotification=function(){exec(null,null,"PushNotification","clearLocalNotification",[])};PushNotification.prototype.startGeoPushes=function(e,t){exec(e,t,"PushNotification","startGeoPushes",[])};PushNotification.prototype.stopGeoPushes=function(e,t){exec(e,t,"PushNotification","stopGeoPushes",[])};PushNotification.prototype.setMultiNotificationMode=function(e,t){exec(e,t,"PushNotification","setMultiNotificationMode",[])};PushNotification.prototype.setSingleNotificationMode=function(e,t){exec(e,t,"PushNotification","setSingleNotificationMode",[])};PushNotification.prototype.setSoundType=function(e,t,n){exec(t,n,"PushNotification","setSoundType",[e])};PushNotification.prototype.setVibrateType=function(e,t,n){exec(t,n,"PushNotification","setVibrateType",[e])};PushNotification.prototype.setLightScreenOnNotification=function(e,t,n){exec(t,n,"PushNotification","setLightScreenOnNotification",[e])};PushNotification.prototype.setEnableLED=function(e,t,n){exec(t,n,"PushNotification","setEnableLED",[e])};PushNotification.prototype.sendGoalAchieved=function(e,t,n){exec(t,n,"PushNotification","sendGoalAchieved",e?[e]:[])};PushNotification.prototype.startLocationTracking=function(e,t){exec(e,t,"PushNotification","startLocationTracking",[])};PushNotification.prototype.stopLocationTracking=function(e,t){exec(e,t,"PushNotification","stopLocationTracking",[])};PushNotification.prototype.getRemoteNotificationStatus=function(e){exec(e,e,"PushNotification","getRemoteNotificationStatus",[])};PushNotification.prototype.setApplicationIconBadgeNumber=function(e,t){exec(t,t,"PushNotification","setApplicationIconBadgeNumber",[{badge:e}])};PushNotification.prototype.cancelAllLocalNotifications=function(e){exec(e,e,"PushNotification","cancelAllLocalNotifications",[])};PushNotification.prototype.notificationCallback=function(e){var t=document.createEvent("HTMLEvents");t.notification=e;t.initEvent("push-notification",!0,!0,arguments);document.dispatchEvent(t)};module.exports=new PushNotification;