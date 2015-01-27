<properties pageTitle="Azure Notification Hubs Notify Users" description="Learn how to send secure push notifications in Azure. Code samples written in C# using the .NET API." documentationCenter="" services="notification-hubs" authors="ggailey777" manager="dwrede" editor=""/>

<tags ms.service="notification-hubs" ms.workload="mobile" ms.tgt_pltfrm="mobile-android" ms.devlang="java" ms.topic="article" ms.date="11/22/2014" ms.author="glenga"/>

#Azure Notification Hubs Notify Users

<div class="dev-center-tutorial-selector sublanding"> 
    	<a href="/en-us/documentation/articles/notification-hubs-aspnet-backend-windows-dotnet-notify-users/" title="Windows Universal">Windows Universal</a><a href="/en-us/documentation/articles/notification-hubs-aspnet-backend-ios-notify-users/" title="iOS">iOS</a>
		<a href="/en-us/documentation/articles/notification-hubs-aspnet-backend-android-notify-users/" title="Android" class="current">Android</a>
</div>

Push notification support in Azure enables you to access an easy-to-use, multiplatform, and scaled-out push infrastructure, which greatly simplifies the implementation of push notifications for both consumer and enterprise applications for mobile platforms. This tutorial shows you how to use Azure Notification Hubs to send push notifications to a specific app user on a specific device. An ASP.NET WebAPI backend is used to authenticate clients and to generate notifications, as shown in the guidance topic [Registering from your app backend](http://msdn.microsoft.com/en-us/library/dn743807.aspx). This tutorial builds on the notification hub that you created in the **Get started with Notification Hubs** tutorial.

> [AZURE.NOTE] This tutorial assumes that you have created and configured your notification hub as described in [Getting Started with Notification Hubs (Android)](/en-us/documentation/articles/notification-hubs-android-get-started/). 
> If you are using Mobile Services as your backend service, see the [Mobile Services version](/en-us/documentation/articles/mobile-services-javascript-backend-android-push-notifications-app-users/) of this tutorial.

[AZURE.INCLUDE [notification-hubs-aspnet-backend-notifyusers](../includes/notification-hubs-aspnet-backend-notifyusers.md)]

## Create the Android Project

The next step is to create the Android application.

1. Follow the [Getting Started with Notification Hubs (Android)](/en-us/documentation/articles/notification-hubs-android-get-started/) tutorial to create and configure your app to receive push notifications from GCM.

2. Open your res/layout/activity_main.xml file, and substitute the content with the following:
			
		<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
		    xmlns:tools="http://schemas.android.com/tools"
		    android:layout_width="match_parent"
		    android:layout_height="match_parent"
		    android:paddingBottom="@dimen/activity_vertical_margin"
		    android:paddingLeft="@dimen/activity_horizontal_margin"
		    android:paddingRight="@dimen/activity_horizontal_margin"
		    android:paddingTop="@dimen/activity_vertical_margin"
		    tools:context="com.example.notifyusers.MainActivity"
		    android:orientation="vertical">
		    <EditText
		        android:id="@+id/usernameText"
		        android:layout_width="match_parent"
		        android:layout_height="wrap_content"
		        android:ems="10"
		        android:hint="@string/usernameHint" >
		    </EditText>
		    <EditText
		        android:id="@+id/passwordText"
		        android:layout_width="match_parent"
		        android:layout_height="wrap_content"
		        android:ems="10"
		        android:hint="@string/passwordHint"
		        android:inputType="textPassword" />
		    <Button
		        android:id="@+id/buttonLogin"
		        android:layout_width="wrap_content"
		        android:layout_height="wrap_content"
		        android:text="@string/loginButton"
		        android:onClick="login" />
		    <Button
		        android:id="@+id/buttonSend"
		        android:layout_width="wrap_content"
		        android:layout_height="wrap_content"
		        android:text="@string/sendButton"
		        android:onClick="sendPush" />
		</LinearLayout>

2. Open your res/values/strings.xml file and add the following lines:

		<string name="usernameHint">Username</string>
	    <string name="passwordHint">Password</string>
	    <string name="loginButton">1. Log in</string>
	    <string name="sendButton">2. Send push</string>

	Your main_activity.xml graphical layout should now look like this:

	![][A1]

3. Now create a class **RegisterClient** in the same package as your **MainActivity** class. Be sure to replace `{backend endpoint}` with the your backend endpoint obtained in the previous section.

		import java.io.IOException;
		import java.io.UnsupportedEncodingException;
		import java.util.Set;
		
		import org.apache.http.HttpResponse;
		import org.apache.http.HttpStatus;
		import org.apache.http.client.ClientProtocolException;
		import org.apache.http.client.HttpClient;
		import org.apache.http.client.methods.HttpPost;
		import org.apache.http.client.methods.HttpPut;
		import org.apache.http.client.methods.HttpUriRequest;
		import org.apache.http.entity.StringEntity;
		import org.apache.http.impl.client.DefaultHttpClient;
		import org.apache.http.util.EntityUtils;
		import org.json.JSONArray;
		import org.json.JSONException;
		import org.json.JSONObject;
		
		import android.content.Context;
		import android.content.SharedPreferences;
		import android.util.Log;
		
		public class RegisterClient {
			private static final String PREFS_NAME = "ANHSettings";
			private static final String REGID_SETTING_NAME = "ANHRegistrationId";
			private static final String BACKEND_ENDPOINT = "{backend endpoint}/api/register";
			SharedPreferences settings;
			protected HttpClient httpClient;
			private String authorizationHeader;
		
			public RegisterClient(Context context) {
				super();
				this.settings = context.getSharedPreferences(PREFS_NAME, 0);
				httpClient =  new DefaultHttpClient();
			}
		
			public String getAuthorizationHeader() {
				return authorizationHeader;
			}
			
			public void setAuthorizationHeader(String authorizationHeader) {
				this.authorizationHeader = authorizationHeader;
			}
			
			public void register(String handle, Set<String> tags) throws ClientProtocolException, IOException, JSONException {
				String registrationId = retrieveRegistrationIdOrRequestNewOne(handle);

				JSONObject deviceInfo = new JSONObject();
				deviceInfo.put("Platform", "gcm");
				deviceInfo.put("Handle", handle);
				deviceInfo.put("Tags", new JSONArray(tags));

				int statusCode = upsertRegistration(registrationId, deviceInfo);
				
				if (statusCode == HttpStatus.SC_OK) {
					return;
				} else if (statusCode == HttpStatus.SC_GONE){
					settings.edit().remove(REGID_SETTING_NAME).commit();
					registrationId = retrieveRegistrationIdOrRequestNewOne(handle);
					statusCode = upsertRegistration(registrationId, deviceInfo);
					if (statusCode != HttpStatus.SC_OK) {
						Log.e("RegisterClient", "Error upserting registration: " + statusCode);
						throw new RuntimeException("Error upserting registration");
					}
				} else {
					Log.e("RegisterClient", "Error upserting registration: " + statusCode);
					throw new RuntimeException("Error upserting registration");
				}
			}

			private int upsertRegistration(String registrationId, JSONObject deviceInfo)
					throws UnsupportedEncodingException, IOException,
					ClientProtocolException {
				HttpPut request = new HttpPut(BACKEND_ENDPOINT+"/"+registrationId);
				request.setEntity(new StringEntity(deviceInfo.toString()));
				request.addHeader("Authorization", "Basic "+authorizationHeader);
				request.addHeader("Content-Type", "application/json");
				HttpResponse response = httpClient.execute(request);
				int statusCode = response.getStatusLine().getStatusCode();
				return statusCode;
			}

			private String retrieveRegistrationIdOrRequestNewOne(String handle) throws ClientProtocolException, IOException {
				if (settings.contains(REGID_SETTING_NAME))
					return settings.getString(REGID_SETTING_NAME, null);
				
				HttpUriRequest request = new HttpPost(BACKEND_ENDPOINT+"?handle="+handle);
				request.addHeader("Authorization", "Basic "+authorizationHeader);
				HttpResponse response = httpClient.execute(request);
				if (response.getStatusLine().getStatusCode() != HttpStatus.SC_OK) {
					Log.e("RegisterClient", "Error creating registrationId: " + response.getStatusLine().getStatusCode());
					throw new RuntimeException("Error creating Notification Hubs registrationId");
				}
				String registrationId = EntityUtils.toString(response.getEntity());
				registrationId = registrationId.substring(1, registrationId.length()-1);
				
				settings.edit().putString(REGID_SETTING_NAME, registrationId).commit();
				
				return registrationId;
			}
		}

	This component implements the REST calls required to contact the app backend, in order to register for push notifications. It also locally stores the *registrationIds* created by the Notification Hub as detailed in [Registering from your app backend](http://msdn.microsoft.com/en-us/library/dn743807.aspx). Note that it uses an authorization token stored in local storage when you click the **Log in and register** button.

4. In your **MainActivity** class remove your private fields for **NotificationHub**, and add a field for **RegisterClient**:

		//private NotificationHub hub;
		private RegisterClient registerClient;
 
5. Then, in the **onCreate** method, remove the initialization of the **hub** field and the **registerWithNotificationHubs** method. Then add the following lines which initialize an instance of the **RegisterClient** class. The method should contain the following lines:

		@Override
	    protected void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	        
	        NotificationsManager.handleNotifications(this, SENDER_ID,
					MyHandler.class);
	        gcm = GoogleCloudMessaging.getInstance(this);
	        
	        registerClient = new RegisterClient(this);
	        
	        setContentView(R.layout.activity_main);
	    }

6. Then, add the following methods, making sure to replace `{backend endpoint}` with the your backend endpoint obtained in the previous section.

	    @Override
	    protected void onStart() {
	    	super.onStart();
	    	Button sendPush = (Button) findViewById(R.id.buttonSend);
	        sendPush.setEnabled(false);
	    }
	
		public void login(View view) throws UnsupportedEncodingException {
	    	this.registerClient.setAuthorizationHeader(getAuthorizationHeader());
	    	
	    	final Context context = this;
	    	new AsyncTask<Object, Object, Object>() {
				@Override
				protected Object doInBackground(Object... params) {
					try {
						String regid = gcm.register(SENDER_ID);
				        registerClient.register(regid, new HashSet<String>());
					} catch (Exception e) {
						Log.e("MainActivity", "Failed to register - " + e.getMessage());
						return e;
					}
					return null;
				}
	
				protected void onPostExecute(Object result) {
					Button sendPush = (Button) findViewById(R.id.buttonSend);
			        sendPush.setEnabled(true);
					Toast.makeText(context, "Logged in and registered.",
							Toast.LENGTH_LONG).show();
				}
			}.execute(null, null, null);
	    }
	    
	    public void sendPush(View view) throws ClientProtocolException, IOException {
	    	new AsyncTask<Object, Object, Object>() {
				@Override
				protected Object doInBackground(Object... params) {
					try {
						HttpUriRequest request = new HttpPost("{backend endpoint}/api/notifications");
						request.addHeader("Authorization", "Basic "+getAuthorizationHeader());
						HttpResponse response = new DefaultHttpClient().execute(request);
						if (response.getStatusLine().getStatusCode() != HttpStatus.SC_OK) {
							Log.e("MainActivity", "Error sending notification" + response.getStatusLine().getStatusCode());
							throw new RuntimeException("Error sending notification");
						}
					} catch (Exception e) {
						Log.e("MainActivity", "Failed to send notification - " + e.getMessage());
						return e;
					}
					return null;
				}
			}.execute(null, null, null);
	    }
	    
		private String getAuthorizationHeader() throws UnsupportedEncodingException {
			EditText username = (EditText) findViewById(R.id.usernameText);
	    	EditText password = (EditText) findViewById(R.id.passwordText);
	    	String basicAuthHeader = username.getText().toString()+":"+password.getText().toString();
	    	basicAuthHeader = Base64.encodeToString(basicAuthHeader.getBytes("UTF-8"), Base64.NO_WRAP);
	    	return basicAuthHeader;
		}

	The callback for **Log in** generates a basic anthentication token based on the input username and password (note that this represents any token your authentication scheme uses), then uses `RegisterClient` to call the backend. The callback for **Send push** calls the backend to trigger a secure notification to all devices of this user. 

## Run the Application

To run the application, do the following:

1. In Eclipse, run the app on a physical Android device or the emulator.

2. In the Android app UI, enter a username and password. These can be any string, but they must be the same value.

3. In the Android app UI, click **Log in**. Then click **Send push**.


[A1]: ./media/notification-hubs-aspnet-backend-android-notify-users/android-notify-users1.PNG
