<properties 
	pageTitle="Get started with push notifications (Appcelerator) | Mobile Dev Center" 
	description="Learn how to use Azure Mobile Services to send push notifications to your Appcelerator app." 
	services="mobile-services" 
	documentationCenter="" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-multiple" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="11/24/2014" 
	ms.author="mahender"/>

# Get started with push notifications in Mobile Services (legacy push)
<div class="dev-center-tutorial-selector sublanding">
	<a href="/documentation/articles/mobile-services-windows-store-dotnet-get-started-push" title="Windows Store C#">Windows Store C#</a>
	<a href="/documentation/articles/mobile-services-javascript-backend-windows-store-javascript-get-started-push" title="Windows Store JavaScript">Windows Store JavaScript</a>
	<a href="/documentation/articles/mobile-services-windows-phone-get-started-push" title="Windows Phone">Windows Phone</a>
	<a href="/documentation/articles/mobile-services-ios-get-started-push" title="iOS">iOS</a>
	<a href="/documentation/articles/mobile-services-android-get-started-push" title="Android">Android</a>
<!--    <a href="/documentation/articles/partner-xamarin-mobile-services-ios-get-started-push" title="Xamarin.iOS">Xamarin.iOS</a>
    <a href="/documentation/articles/partner-xamarin-mobile-services-android-get-started-push" title="Xamarin.Android">Xamarin.Android</a> -->
	<a href="partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started.md-push" title="Appcelerator" class="current">Appcelerator</a>
</div>

This topic shows you how to use Microsoft Azure Mobile Services to send push notifications to both iOS and Android apps developed through Appcelerator Titanium Studio. In this tutorial you add push notifications using the Apple Push Notification service (APNS) and Google Cloud Messaging to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

>[AZURE.NOTE] Mobile Services integrates with Azure Notification Hubs to support additional push notification functionality, such as templates, multiple platforms, and improved scale. This topic supports existing mobile services that have not yet been upgraded to use Notification Hubs integration. When you create a new mobile service, this integrated functionality is automatically enabled. You should upgrade your service to use Notification Hubs when possible. **We will work to get a tutorial available for Notification Hubs push with Appcelerator soon.**

1.	[Generate the certificate signing request]
2.	[Register your app and enable push notifications]
3.	[Create a provisioning profile for the app]
4.	[Enable Google Cloud Messaging]
5.  [Create the GCM module for Titanium]
6.	[Configure Mobile Services]
7.	[Add push notifications to the app]
8.	[Update scripts to send push notifications]
9.	[Insert data to receive notifications]

This tutorial requires the following:

* Appcelerator Azure Mobile Services Module
* Appcelerator Titanium Studio 3.2.1 or later
* An iOS 7.0 (or later version) & Android 4.3 (or later version) capable device
* iOS Developer Program membership
* An active Google account

> [AZURE.NOTE] Because of push notification configuration requirements, you must deploy and test push notifications on an iOS capable device (iPhone or iPad) instead of in the emulator.

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services].

[AZURE.INCLUDE [Enable Apple Push Notifications](../includes/enable-apple-push-notifications.md)]

## <a name="register-gcm"></a>Enable Google Cloud Messaging

>[AZURE.NOTE]To complete this procedure, you must have a Google account that has a verified email address. To create a new Google account, go to <a href="http://go.microsoft.com/fwlink/p/?LinkId=268302" target="_blank">accounts.google.com</a>.

[AZURE.INCLUDE [Enable GCM](../includes/mobile-services-enable-Google-cloud-messaging.md)]


##  <a name="gcm-module"></a>Create the GCM module for Titanium

### Preparing Appcelerator Titanium Studio for Module Creation

If you are going to be creating Android modules, you will need to install Java support inside Appcelerator Titanium Studio. See Appcelerator's [Installing the Java Development Tools] for the brief steps if you have not already done so.

You will need to install the Android NDK. Download the appropriate .zip file from [http://developer.android.com/sdk/ndk/index.html](http://developer.android.com/sdk/ndk/index.html) and extract it to some location on disk. Remember this location. 

### Creating a New Module

1. Open Appcelerator Titanium studio.

2. Click on File -> New -> Mobile Module Project.

    ![][0]

3. In the next window, enter the data of project settings: 

    * **Project name:** In our case we use &quot;notificationhub&quot; (can be same).

    * **Module Id:** In our case we use &quot;com.winwire.notificationhub&quot;. Also this must match with our "application Id".

    * **Deployment Targets:** In this case we select Android.

    > [AZURE.NOTE] It is important that the name of our WorkSpace does not contain spaces, otherwise we will have problems when creating the compiled.

    ![][1]

4. Press next and fill in the information for the module.

    ![][2]

5. Last, press finish.

6. Open timodule.xml file. And add the following changes in android tag.


        <manifest package="com.winwire.notificationhub" android:versionCode="1" android:versionName="1.0">
        <supports-screens android:anyDensity="true"/>
        <uses-sdk android:minSdkVersion="8"/>
        <uses-permission android:name= "com.google.android.c2dm.permission.RECEIVE"/>
        <permission android:name= "${tiapp.properties['id']}.permission.C2D_MESSAGE" android:protectionLevel="signature"/>
        <uses-permission android:name= "${tiapp.properties['id']}.permission.C2D_MESSAGE"/>
        <uses-permission android:name= "android.permission.WAKE_LOCK"/>
        <uses-permission android:name= "android.permission.VIBRATE"/>
        <uses-permission android:name= "android.permission.INTERNET"/>
        <uses-permission android:name= "android.permission.GET_ACCOUNTS"/>
        <uses-permission android:name= "android.permission.USE_CREDENTIALS"/>
        <uses-permission android:name= "android.permission.ACCESS_NETWORK_STATE"/>
        <application>
        <service android:name= "com.winwire.notificationhub.GCMIntentService" />
        <receiver android:name= "com.google.android.gcm.GCMBroadcastReceiver" android:permission= "com.google.android.c2dm.permission.SEND">
        <!-- Start receiver on boot -->
        <intent-filter>
        <action android:name= "android.intent.action.BOOT_COMPLETED"/>
        <category android:name= "android.intent.category.HOME"/>
        </intent-filter>
        <!-- Receive the actual message -->
        <intent-filter>
        <action android:name= "com.google.android.c2dm.intent.RECEIVE" />
        <category android:name= "${tiapp.properties['id']}" />
        </intent-filter>
        <!-- Receive the registration id -->
        <intent-filter>
        <action android:name= "com.google.android.c2dm.intent.REGISTRATION" />
        <category android:name= "${tiapp.properties['id']}" />
        </intent-filter>
        </receiver>
        </application>
        </manifest>




> [AZURE.NOTE] In the above code you must replace all instances of the text *com.winwire.notificationhub* with your application's package name (module Id).

7. In your Notification Hub module right click on &quot;src&quot; folder and go to &quot;New&quot; and select &quot;folder&quot;. Give folder name as com.google.android.gcm.

> [AZURE.NOTE] If you are unable to see &quot;folder&quot; in &quot;New&quot; options, then selects &quot;Other&quot; and expands General then select &quot;Folder&quot;.

8. Now download &quot;.java&quot; files (gcm.zip) from here and copy those files into newly created folder (com.google.android.gcm).

9. Now find folder named as your module id and then expand it. In that folder you can see list of ".java" files. In those files open the file with your project name+module.java (for example, if your project name is notificationhub then it will look like &quot;NotificationhubModule.java&quot;) and add below lines of code at the top.

        private static NotificationhubModule _THIS;
        private KrollFunction successCallback;
        private KrollFunction errorCallback;
        private KrollFunction messageCallback;

10. In the same file locate constructor and replace it with below code.

        public NotificationhubModule() {
	        super();
	        _THIS = this;
        }

11. In the same file add the below lines of code at the bottom.

        @Kroll.method
        public void registerC2dm(HashMap options) {
	        successCallback = (KrollFunction) options.get("success");
	        errorCallback = (KrollFunction) options.get("error");
	        messageCallback = (KrollFunction) options.get("callback");
	        String registrationId = getRegistrationId();
	        if (registrationId != null && registrationId.length() > 0) {
		        sendSuccess(registrationId);
	        } else {
		        GCMRegistrar.register(TiApplication.getInstance(), getSenderId());
	        }
        }
        @Kroll.method
        public void unregister() {
	        GCMRegistrar.unregister(TiApplication.getInstance());
        }
        @Kroll.method
        public String getRegistrationId() {
	        return GCMRegistrar.getRegistrationId(TiApplication.getInstance());
        }
        @Kroll.method
        public String getSenderId() {
	        return TiApplication.getInstance().getAppProperties()
	        .getString("com.winwire.notificationhub.sender_id", "");
        }

        public void sendSuccess(String registrationId) {
	        if (successCallback != null) {
		        HashMap data = new HashMap();
		        data.put("registrationId", registrationId);
		        successCallback.callAsync(getKrollObject(), data);
	        }
        }

        public void sendError(String error) {
	        if (errorCallback != null) {
		        HashMap data = new HashMap();
		        data.put("error", error);
		        errorCallback.callAsync(getKrollObject(), data);
	        }
        }

        public void sendMessage(HashMap messageData) {
	        if (messageCallback != null) {
		        HashMap data = new HashMap();
		        data.put("data", messageData);
		        messageCallback.call(getKrollObject(), data);
	        }
        }
        public static NotificationhubModule getInstance() {
	        return _THIS;
        }

12. Now download module.zip and copy the files into folder with module id as its name.

> [AZURE.NOTE] In the above files you must replace all instances of the text *com.winwire.notificationhub* with your application's package name (module Id). Also replace &quot;NotificationhubModule&quot; with ProjectName+Module (e.g., &quot;NotificationhubModule&quot;).

### Building/Packaging a Module

Choose **Deploy > Package - Android Module**. You cannot build BlackBerry module using Studio--either use the BlackBerry NDK CLI tools or the Momentics IDE. 

![][3]


You may then choose to deploy the module for all projects, or for a specific project. This follows the installation rules as noted in [Using Titanium Modules], though to summarize:

- For all projects: the module .zip file is dropped at the root of the Titanium SDK installation location. 

- For a particular project: The module .zip file is dropped at the root of your project. 


## <a name="configure"></a>Configure Mobile Services to send push requests


[AZURE.INCLUDE [mobile-services-apns-configure-push](../includes/mobile-services-apns-configure-push.md)]

5.	Enter the API Key value obtained from GCM in the previous procedure, and then click Save.

    ![][4]

Your mobile service is now configured to work with both APNS and GCM.

## <a name="add-push"></a>Add push notifications to your app

1.	In tiapp.xml, select tiapp.xml tab (you can find this tab at bottom next to &quot;Overview&quot; tab) and locate `<android>` tag. Below the tag add following code:

        <modules>
            <module platform="android">ModuleId</module>
        </modules>
        <property name="ApplicationId.sender_id" type="string">Provide your GCM sender ID</property>
        <property name="ApplicationId.icon type="int">2130837504</property>
        <property name="ApplicationId.component" type="string">ApplicationId/ApplicationId.AppNameActivity</property>

>[AZURE.NOTE] In above code you need to replace **ModuleId**, **ApplicationId**. Your Module ID, which you given at the time of GCM Module creation and Application Id, which is entered at the time of project creation.  Also make sure both **ModuleId** and **ApplicationId** are same. You also required changing **ApplicationId.AppNameActivity**. It should look like com.winwire.notificationhub/ com.winwire.notificationhub.NotificationhubActivity.


2.	Copy the GCM module you created earlier, and place it into the below location.	

    <table><tr>
    <td>OSX
    </td>
    <td>/Library/Application Support/Titanium or  ~/Library/Application Support/Titanium
    </td>
    </tr>
    <td>Windows 7
    </td>
    <td>C:\Users\username\AppData\Roaming (or C:\ProgramData\Titanium on Titanium Studio 1.0.1 and earlier)
    </td>
    </tr><td>Windows XP
    </td>
    <td>C:\Documents and Settings\username\Application Data (or C:\Documents and Settings\All Users\Application Data\Titanium on Titanium Studio 1.0.1 and earlier)
    </td>
    </tr><td>Linux
    </td>
    <td>~/.titanium
    </td>
    </tr>
    </tr>
    
    </table>

>[AZURE.NOTE]  In Mac OS, Library is Hidden folder. To make it visible you need to run following command and then re-launch the Finder: `**defaults write com.apple.finder AppleShowAllFiles TRUE**`

3.	In Appcelerator Titanium Studio, open the index.js file and add the following code at the bottom. This code will register your device for push notifications.

            Alloy.Globals.tempRegId = '';
    	        if (OS_ANDROID) {
    	        var gcm = require('com.winwire.notificationhub');
            gcm.registerC2dm({
            success : function(e) {
            var regId = e.registrationId;
            Alloy.Globals.tempRegId = regId;
            },
            error : function(e) {
            alert("Error during registration : " + e.error);
            var message;
            if (e.error == "ACCOUNT_MISSING") {
            message = "No Google account found; you will need to add on in order to activate notifications";
            }
            Titanium.UI.createAlertDialog({
            title : 'Push Notification Setup',
            message : message,
            buttonNames : ['OK']
            }).show();
            },
            callback : function(e)// called when a push notification is received
            {
            var data = JSON.stringify(e.data);
            var intent = Ti.Android.createIntent({
            action : Ti.Android.ACTION_MAIN,
            className : 'com.winwire.notificationhub. WindowsAzureActivity',
            flags : Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
            });
            intent.addCategory(Titanium.Android.CATEGORY_LAUNCHER);
            var NotificationClickAction = Ti.Android.createPendingIntent({
            activity : Ti.Android.currentActivity,
            intent : intent,
            flags : Ti.Android.FLAG_UPDATE_CURRENT,
            type : Ti.Android.PENDING_INTENT_FOR_ACTIVITY
            });
            var NotificationMembers = {
            contentTitle : 'Notification Hub Demo',
            contentText : e.data.message,
            defaults : Titanium.Android.NotificationManager.DEFAULT_SOUND,
            tickerText : 'Notification Hub Demo',
            icon : Ti.App.Android.R.drawable.appicon,
            when : new Date(),
            flags : Ti.Android.FLAG_AUTO_CANCEL,
            contentIntent : NotificationClickAction
            };
            Ti.Android.NotificationManager.notify(1, .Android.createNotification(NotificationMembers));
            var toast = Titanium.UI.createNotification({
            duration : 2000,
            message : e.data.message
            });
            toast.show();
            alert(e.data.message);
            }
            });
            } else  if (OS_IOS) {
            Titanium.Network.registerForPushNotifications({
            types : [Titanium.Network.NOTIFICATION_TYPE_BADGE, .Network.NOTIFICATION_TYPE_ALERT, .Network.NOTIFICATION_TYPE_SOUND],
            success : function(e) {
            deviceToken = e.deviceToken;
            Alloy.Globals.tempRegId = deviceToken;
            },
            error : function(e) {
            Ti.API.info("Error during registration: " + e.error);
            },
            callback : function(e) {
            var data = e.data.inAppMessage;
            if (data != null && data != '') {
            alert(data);
            }
            }
            });
            }
   

4.	Now open TableData.js file and locate following lines in function **addOrUpdateDataFromAndroid**

        var request = {
    	    'text' : alertTextField.getValue(),
    	    'complete' : false
        };
  

    Please replace above code in else condition (for inserting new item) only.

5.	For Android, replace above code with following code:

       var request = {
    	'text' : alertTextField.getValue(),
    	'complete' : false,
    	'handle' : Alloy.Globals.tempRegId
    }; 
    
    

6.	Now locate following lines in function **updateOrAddData**

           var request = {
    	    'text' : alertTextField.getValue(),
    	    'complete' : false
        };
    
    Please replace above code in else condition (for inserting new item) only.

7.	For iOS, replace above code with following code:

       var request = {
    	'text' : alertTextField.getValue(),
    	'complete' : false,
    	'deviceToken' : Alloy.Globals.tempRegId
    };
    
 
Your app is now updated to support push notifications in both iOS and Android platforms.


## <a name="update-scripts"></a>Update the registered insert script in the Management Portal

1.	In the Management Portal, click the Data tab and then click the TodoItem table.

    ![][5]

2.	In todoitem, click the Script tab and select Insert.

    ![][6]

    This displays the function that is invoked when an insert occurs in the TodoItem table.

3.	Replace the insert function with the following code, and then click **Save**:

**For iOS:**

        function insert(item, user, request) { 
            request.execute();
            // Set timeout to delay the notification, to provide time for the  
            // app to be closed on the device to demonstrate toast notifications 
            setTimeout(function() { 
                push.apns.send(item.deviceToken, { 
                    alert: "Toast: " + item.text, 
                    payload: { 
                        inAppMessage: "Hey, a new item arrived: '" + item.text + "'" 
                    }
                 }); 
            }, 2500);
        }
  
   	> [AZURE.NOTE] This script delays sending the notification to give you time to close the app to receive a push notification.  

**For Android:**

          function insert(item, user, request) {
            request.execute({ 
                success: function() {  
                    // Write to the response and then send the notification in the background 
                    request.respond();  
                    push.gcm.send(item.handle, item.text, {
                        success: function(response) { 
                            console.log('Push notification sent: ', response);
                        }, error: function(error)   { 
                            console.log('Error sending push notification: ', error);      
                            }      
                   }); 
                }  
          });  
        }



This registers a new insert script, which uses the [Mobile Services push object] to send a push notification (the inserted text) to the device provided in the insert request.


<!-- Images. -->
[0]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-push/image0011.png
[1]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-push/image0031.png
[2]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-push/image0041.png
[3]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-push/image0061.png
[4]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-push/image062.png
[5]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-push/image064.png
[6]: ./media/partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started-push/image066.png

<!-- Anchors. -->
[Generate the certificate signing request]: #certificates
[Register your app and enable push notifications]: #register
[Create a provisioning profile for the app]: #profile
[Enable Google Cloud Messaging]: #register-gcm
[Create the GCM module for Titanium]: #gcm-module
[Configure Mobile Services]: #configure
[Add push notifications to the app]: #add-push
[Update scripts to send push notifications]: #update-scripts
[Insert data to receive notifications]: #test

<!-- URLs. -->
[Get started with Mobile Services]: partner-appcelerator-mobile-services-javascript-backend-appcelerator-get-started.md
[Using Titanium Modules]: http://docs.appcelerator.com/titanium/latest/#!/guide/Using_Titanium_Modules
[Microsoft Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services push object]: http://go.microsoft.com/fwlink/p/?linkid=272333&clcid=0x409
[Installing the Java Development Tools]: http://docs.appcelerator.com/titanium/latest/#!/guide/Installing_the_Java_Development_Tools
