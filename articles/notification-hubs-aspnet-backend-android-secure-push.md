<properties 
	pageTitle="Azure Notification Hubs Secure Push" 
	description="Learn how to send secure push notifications to an Android app from Azure. Code samples written in Java and C#." 
	documentationCenter="android" 
	authors="wesmc7777" 
	manager="dwrede" 
	editor="" 
	services="notification-hubs"/>

<tags 
	ms.service="notification-hubs" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="android" 
	ms.devlang="java" 
	ms.topic="article" 
	ms.date="02/26/2015" 
	ms.author="wesmc"/>

#Azure Notification Hubs Secure Push

<div class="dev-center-tutorial-selector sublanding"> 
    	<a href="/documentation/articles/notification-hubs-aspnet-backend-windows-dotnet-secure-push/" title="Windows Universal">Windows Universal</a><a href="/documentation/articles/notification-hubs-aspnet-backend-ios-secure-push/" title="iOS">iOS</a>
		<a href="/documentation/articles/notification-hubs-aspnet-backend-android-secure-push/" title="Android" class="current">Android</a>
</div>

##Overview

Push notification support in Microsoft Azure enables you to access an easy-to-use, multiplatform, and scaled-out push infrastructure, which greatly simplifies the implementation of push notifications for both consumer and enterprise applications for mobile platforms. 

Due to regulatory or security constraints, sometimes an application might want to include something in the notification that cannot be transmitted through the standard push notification infrastructure. This tutorial describes how to achieve the same experience by sending sensitive information through a secure, authenticated connection between the client device and the app backend.

At a high level, the flow is as follows:

1. The app back-end:
	- Stores secure payload in back-end database.
	- Sends the ID of this notification to the device (no secure information is sent).
2. The app on the device, when receiving the notification:
	- The device contacts the back-end requesting the secure payload.
	- The app can show the payload as a notification on the device.

It is important to note that in the preceding flow (and in this tutorial), we assume that the device stores an authentication token in local storage, after the user logs in. This guarantees a completely seamless experience, as the device can retrieve the notification’s secure payload using this token. If your application does not store authentication tokens on the device, or if these tokens can be expired, the device app, upon receiving the notification should display a generic notification prompting the user to launch the app. The app then authenticates the user and shows the notification payload.

This Secure Push tutorial shows how to send a push notification securely. The tutorial builds on the **Notify Users** tutorial, so you should complete the steps in that tutorial first.

> [AZURE.NOTE] This tutorial assumes that you have created and configured your notification hub as described in [Getting Started with Notification Hubs (Android)](notification-hubs-android-get-started.md).

[AZURE.INCLUDE [notification-hubs-aspnet-backend-securepush](../includes/notification-hubs-aspnet-backend-securepush.md)]

## Modify the Android project

Now that you modified your app back-end to send just the *id* of a notification, you have to change your Android app to handle that notification and call back your back-end to retrieve the secure message to be displayed.
To achieve this goal, you have to make sure that your Android app knows how to authenticate itself with your back-end when it receives the push notifications.

We will now modify the *login* flow in order to save the authentication header value in the shared preferences of your app. Analogous mechanisms can be used to store any authentication token (e.g. OAuth tokens) that the app will have to use without requiring user credentials.

1. In your Android app project, add the following constants at the top of the **MainActivity** class:

		public static final String NOTIFY_USERS_PROPERTIES = "NotifyUsersProperties";
		public static final String AUTHORIZATION_HEADER_PROPERTY = "AuthorizationHeader";

2. Still in the **MainActivity** class, update the `getAuthorizationHeader()` method to contain the following code:

		private String getAuthorizationHeader() throws UnsupportedEncodingException {
			EditText username = (EditText) findViewById(R.id.usernameText);
    		EditText password = (EditText) findViewById(R.id.passwordText);
    		String basicAuthHeader = username.getText().toString()+":"+password.getText().toString();
    		basicAuthHeader = Base64.encodeToString(basicAuthHeader.getBytes("UTF-8"), Base64.NO_WRAP);
    	
    		SharedPreferences sp = getSharedPreferences(NOTIFY_USERS_PROPERTIES, Context.MODE_PRIVATE);
    		sp.edit().putString(AUTHORIZATION_HEADER_PROPERTY, basicAuthHeader).commit();
    	
    		return basicAuthHeader;
		}

3. Add the following `import` statements at the top of the **MainActivity** file:

		import android.content.SharedPreferences;

Now we will change the handler that is called when the notification is received.

4. In the **MyHandler** class change the `OnReceive()` method to contain:

		public void onReceive(Context context, Bundle bundle) {
	    	ctx = context;   
	    	String secureMessageId = bundle.getString("secureId");
	    	retrieveNotification(secureMessageId);
		}

5. Then add the `retrieveNotification()` method, replacing the placeholder `{back-end endpoint}` with the back-end endpoint obtained while deploying your back-end:

		private void retrieveNotification(final String secureMessageId) {
			SharedPreferences sp = ctx.getSharedPreferences(MainActivity.NOTIFY_USERS_PROPERTIES, Context.MODE_PRIVATE);
    		final String authorizationHeader = sp.getString(MainActivity.AUTHORIZATION_HEADER_PROPERTY, null);
		
			new AsyncTask<Object, Object, Object>() {
				@Override
				protected Object doInBackground(Object... params) {
					try {
						HttpUriRequest request = new HttpGet("{back-end endpoint}/api/notifications/"+secureMessageId);
						request.addHeader("Authorization", "Basic "+authorizationHeader);
						HttpResponse response = new DefaultHttpClient().execute(request);
						if (response.getStatusLine().getStatusCode() != HttpStatus.SC_OK) {
							Log.e("MainActivity", "Error retrieving secure notification" + response.getStatusLine().getStatusCode());
							throw new RuntimeException("Error retrieving secure notification");
						}
						String secureNotificationJSON = EntityUtils.toString(response.getEntity());
						JSONObject secureNotification = new JSONObject(secureNotificationJSON);
						sendNotification(secureNotification.getString("Payload"));
					} catch (Exception e) {
						Log.e("MainActivity", "Failed to retrieve secure notification - " + e.getMessage());
						return e;
					}
					return null;
				}
			}.execute(null, null, null);
		}
		

This method calls your app back-end to retrieve the notification content using the credentials stored in the shared preferences and displays it as a normal notification. The notification looks to the app user exactly like any other push notification.

Note that it is preferable to handle the cases of missing authentication header property or rejection by the back-end. The specific handling of these cases depend mostly on your target user experience. One option is to display a notification with a generic prompt for the user to authenticate to retrieve the actual notification.

## Run the Application

To run the application, do the following:

1. Make sure **AppBackend** is deployed in Azure. If using Visual Studio, run the **AppBackend** Web API application. An ASP.NET web page is displayed.

2. In Eclipse, run the app on a physical Android device or the emulator.

3. In the Android app UI, enter a username and password. These can be any string, but they must be the same value.

4. In the Android app UI, click **Log in**. Then click **Send push**.
