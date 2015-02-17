<properties 
	pageTitle="Azure Mobile Engagement Android SDK Integration" 
	description="Latest updates and procedures for Android SDK for Azure Mobile Engagement"
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="kpiteira" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-android" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="02/12/2015" 
	ms.author="kapiteir" />


#Upgrade procedures

If you already have integrated an older version of our SDK into your application, you have to consider the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDK. For example if you migrate from 1.4.0 to 1.6.0 you have to first follow the "from 1.4.0 to 1.5.0" procedure then the "from 1.5.0 to 1.6.0" procedure.

Whatever the version you upgrade from, you have to replace all the `capptain*.jar` by the new ones.

Please note that starting from SDK 2.0.0, there is only one jar file: `capptain.jar`.

Starting from SDK 3.0.0, the jar file is renamed: `mobile-engagement-VERSION.jar`.

##From 2.4.0 to 3.0.0

Capptain is rebranded as Engagement, a lot of modifications are necessary to handle this change.

We also modified a lot of other integration parameters that are described in the following sections.

### JAR file

Replace `capptain.jar` by `mobile-engagement-VERSION.jar` in your `libs` folder.

### Resource files

Every resource file that we provided (prefixed by `capptain_`) have to be replaced by the new ones (prefixed with `engagement_`).

If you customized those files, you have to re-apply your customization on the new files, **all the identifiers in the resource files have also been renamed**.

### Application ID

Now Engagement uses a connection string to configure the SDK identifiers such as the application identifier.

You have to use `EngagementAgent.init` method in your launcher activity like this:

			EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
			engagementConfiguration.setConnectionString("Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}");
			EngagementAgent.getInstance(this).init(engagementConfiguration);

The connection string for your application is displayed on Azure Portal.

Please remove any call to `CapptainAgent.configure` as `EngagementAgent.init` replaces that method.

The `appId` can no longer be configured using `AndroidManifest.xml`.

Please remove this section from your `AndroidManifest.xml` if you have it:

			<meta-data android:name="capptain:appId" android:value="<YOUR_APPID>"/>

### Java API

Every call to any Java class of our SDK have to be renamed, for example `CapptainAgent.getInstance(this)` must be renamed `EngagementAgent.getInstance(this)`, `extends CapptainActivity` must be renamed `extends EngagementActivity` etc...

If you were integrated with default agent preference files, the default file name is now `engagement.agent` and the key is `engagement:agent`.

When creating web announcements, the Javascript binder is now `engagementReachContent`.

### AndroidManifest.xml

A lot of changes happened there, the service is not shared anymore and a lot of receivers are not exportable anymore.

The service declaration is now simpler, remove the intent filter and all meta-data inside it, and add `exportable=false`.

Plus everything is renamed to use engagement.

It must now looks like:

			<service
			  android:name="com.microsoft.azure.engagement.service.EngagementService"
			  android:exported="false"
			  android:label="<Your application name>Service"
			  android:process=":Engagement"/>

When you want to enable test logs, the meta-data has now been moved to the application tag and has been renamed:

			<application>
			
			  <meta-data android:name="engagement:log:test" android:value="true" />
			
			  <service/>
			
			</application>

All other meta-data have just been renamed, here is the full list (of course rename only the ones you use):

			<meta-data
			  android:name="engagement:reportCrash"
			  android:value="true"/>
			<meta-data
			  android:name="engagement:sessionTimeout"
			  android:value="10000"/>
			<meta-data
			  android:name="engagement:burstThreshold"
			  android:value="0"/>
			<meta-data
			  android:name="engagement:connection:delay"
			  android:value="0"/>
			<meta-data
			  android:name="engagement:locationReport:lazyArea"
			  android:value="false"/>
			<meta-data
			  android:name="engagement:locationReport:realTime"
			  android:value="false"/>
			<meta-data
			  android:name="engagement:locationReport:realTime:background"
			  android:value="false"/>
			<meta-data
			  android:name="engagement:locationReport:realTime:fine"
			  android:value="false"/>
			<meta-data
			  android:name="engagement:agent:settings:name"
			  android:value="engagement.agent"/>
			<meta-data
			  android:name="engagement:agent:settings:mode"
			  android:value="0"/>
			<meta-data
			  android:name="engagement:gcm:sender"
			  android:value="<YOUR_PROJECT_NUMBER>\n"/>
			<meta-data
			  android:name="engagement:adm:register"
			  android:value="true"/>
			<meta-data
			  android:name="engagement:reach:notification:icon"
			  android:value="<DRAWABLE_NAME_WITHOUT_EXTENSION>"/>
			
			<activity android:name="SomeActivityWithoutReachOverlay">
			  <meta-data
			    android:name="engagement:notification:overlay"
			    android:value="false"/>
			</activity>

Google Play and SmartAd tracking has been removed from SDK you just have to remove this without replacement:

			<meta-data
			  android:name="capptain:track:adservers"
			  android:value="smartad" />

The Reach activities are now declared like this:

			<activity
			  android:name="com.microsoft.azure.engagement.reach.activity.EngagementTextAnnouncementActivity"
			  android:theme="@android:style/Theme.Light">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.ANNOUNCEMENT"/>
			    <category android:name="android.intent.category.DEFAULT"/>
			    <data android:mimeType="text/plain"/>
			  </intent-filter>
			</activity>
			<activity
			  android:name="com.microsoft.azure.engagement.reach.activity.EngagementWebAnnouncementActivity"
			  android:theme="@android:style/Theme.Light">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.ANNOUNCEMENT"/>
			    <category android:name="android.intent.category.DEFAULT"/>
			    <data android:mimeType="text/html"/>
			  </intent-filter>
			</activity>
			<activity
			  android:name="com.microsoft.azure.engagement.reach.activity.EngagementPollActivity"
			  android:theme="@android:style/Theme.Light">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.POLL"/>
			    <category android:name="android.intent.category.DEFAULT"/>
			  </intent-filter>
			</activity>
			
If you have custom Reach activities, you need only to change the intent actions to match either `com.microsoft.azure.engagement.reach.intent.action.ANNOUNCEMENT` or `com.microsoft.azure.engagement.reach.intent.action.POLL`.

The broadcast receivers have been renamed, plus we now add `exported=false`. Here is the full list of the receivers with the new specification, (of course rename only the ones you use):

			<receiver android:name="com.microsoft.azure.engagement.reach.EngagementReachReceiver"
			  android:exported="false">
			  <intent-filter>
			    <action android:name="android.intent.action.BOOT_COMPLETED"/>
			    <action android:name="com.microsoft.azure.engagement.intent.action.AGENT_CREATED"/>
			    <action android:name="com.microsoft.azure.engagement.intent.action.MESSAGE"/>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.ACTION_NOTIFICATION"/>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.EXIT_NOTIFICATION"/>
			    <action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.DOWNLOAD_TIMEOUT"/>
			  </intent-filter>
			</receiver>
			
			<receiver android:name="com.microsoft.azure.engagement.gcm.EngagementGCMEnabler"
			  android:exported="false">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.intent.action.APPID_GOT" />
			  </intent-filter>
			</receiver>
			
			<receiver
			  android:name="com.microsoft.azure.engagement.gcm.EngagementGCMReceiver"
			  android:permission="com.google.android.c2dm.permission.SEND">
			  <intent-filter>
			    <action android:name="com.google.android.c2dm.intent.REGISTRATION"/>
			    <action android:name="com.google.android.c2dm.intent.RECEIVE"/>
			    <category android:name="<your_package_name>"/>
			  </intent-filter>
			</receiver>
			
			<receiver android:name="com.microsoft.azure.engagement.adm.EngagementADMEnabler"
			  android:exported="false">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.intent.action.APPID_GOT"/>
			  </intent-filter>
			</receiver>
			
			<receiver
			  android:name="com.microsoft.azure.engagement.adm.EngagementADMReceiver"
			  android:permission="com.amazon.device.messaging.permission.SEND">
			  <intent-filter>
			    <action android:name="com.amazon.device.messaging.intent.REGISTRATION"/>
			    <action android:name="com.amazon.device.messaging.intent.RECEIVE"/>
			    <category android:name="<your_package_name>"/>
			  </intent-filter>
			</receiver>
			
			<receiver android:name="<your_sub_class_of_com.microsoft.azure.engagement.reach.EngagementReachDataPushReceiver>"
			  android:exported="false">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.DATA_PUSH" />
			  </intent-filter>
			</receiver>
			
			<receiver android:name="com.microsoft.azure.engagement.EngagementLocationBootReceiver"
			   android:exported="false">
			   <intent-filter>
			      <action android:name="android.intent.action.BOOT_COMPLETED" />
			   </intent-filter>
			</receiver>
			
			<receiver android:name="<your_sub_class_of_com.microsoft.azure.engagement.EngagementConnectionReceiver.java>"
			  android:exported="false">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.intent.action.CONNECTED"/>
			    <action android:name="com.microsoft.azure.engagement.intent.action.DISCONNECTED"/>
			  </intent-filter>
			</receiver>
			
			<receiver
			  android:name="<your_sub_class_of_com.microsoft.azure.engagement.EngagementMessageReceiver.java>"
			  android:exported="false">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.MESSAGE"/>
			  </intent-filter>
			</receiver>

Tracking receiver has been removed, so you have to remove this section:

		  <receiver android:name="com.ubikod.capptain.android.sdk.track.CapptainTrackReceiver">
		    <intent-filter>
		      <action android:name="com.ubikod.capptain.intent.action.APPID_GOT" />
		      <!-- possibly <action android:name="com.android.vending.INSTALL_REFERRER" /> -->
		    </intent-filter>
		  </receiver>

Note that the declaration of your implementation of the broadcast receiver **EngagementMessageReceiver** has changed in the `AndroidManifest.xml`. This is because the API to send and remove arbitrary XMPP messages from arbitrary XMPP entities and the API to send and receive messages between devices have been removed. Thus, you have also to delete the following callbacks from your **EngagementMessageReceiver** implementation :

			protected void onDeviceMessageReceived(android.content.Context context, java.lang.String deviceId, java.lang.String payload)

and

			protected void onXMPPMessageReceived(android.content.Context context, android.os.Bundle message)

then delete any call on **EngagementAgent** for :

			sendMessageToDevice(java.lang.String deviceId, java.lang.String payload, java.lang.String packageName)

and

			sendXMPPMessage(android.os.Bundle msg)

### Proguard

Proguard configuration can be impacted by rebranding, the rules are now looking like:

			-dontwarn android.**
			-keep class android.support.v4.** { *; }
			
			-keep public class * extends android.os.IInterface
			-keep class com.microsoft.azure.engagement.reach.activity.EngagementWebAnnouncementActivity$EngagementReachContentJS {
			  <methods>;
			}

##From 2.3.0 to 2.4.0

> [AZURE.IMPORTANT] The SDK is now compatible only with Android 2.3.3 (API level 10), please make sure to update your **minSdkVersion** accordingly.

### API level

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="23"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="24"/>

### Reach

The Reach receiver now needs to declare additional actions. Additionally, system notifications that were not clicked can be restored at device reboot. Please add these actions:

			<action android:name="com.ubikod.capptain.reach.intent.action.ACTION_NOTIFICATION"/>
			<action android:name="com.ubikod.capptain.reach.intent.action.EXIT_NOTIFICATION"/>
			<action android:name="android.intent.action.BOOT_COMPLETED"/>

To the Reach receiver so that it looks like:

			<receiver android:name="com.ubikod.capptain.android.sdk.reach.CapptainReachReceiver">
			  <intent-filter>
			    <action android:name="android.intent.action.BOOT_COMPLETED"/>
			    <action android:name="com.ubikod.capptain.intent.action.AGENT_CREATED"/>
			    <action android:name="com.ubikod.capptain.intent.action.MESSAGE"/>
			    <action android:name="com.ubikod.capptain.reach.intent.action.ACTION_NOTIFICATION"/>
			    <action android:name="com.ubikod.capptain.reach.intent.action.EXIT_NOTIFICATION"/>
			    <action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>
			    <action android:name="com.ubikod.capptain.reach.intent.action.DOWNLOAD_TIMEOUT"/>
			  </intent-filter>
			</receiver>

If you don't add the boot action, notifications won't be restored, even if you launch the application again (because the SDK can't tell if the device has reboot if you omit the action).

You also need the following permission if missing:

			<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

If you have your own version of **CapptainNotifier**, please look at the source code of **CapptainDefaultNotifier** to see the changes related to the way system notifications are now being replayed based on the first displayed date. Replay now only occurs at boot or when application upgraded and restarted.

##From 2.2.0 to 2.3.0

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="22"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="23"/>

##From 2.1.0 to 2.2.0

### API level

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="21"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="22"/>

### Reach

Fixed Lint warnings in `capptain_poll_choice.xml`, you should replace it if you did not customize it.

##From 2.0.0 to 2.1.0

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="20"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="21"/>

If you build your application using ProGuard, replace

			-keep class com.ubikod.capptain.android.sdk.reach.activity.CapptainWebAnnouncementActivity$JavascriptInterface { 
			  <methods>;
			}

by

			-keep class com.ubikod.capptain.android.sdk.reach.activity.CapptainWebAnnouncementActivity$CapptainReachContentJS {
			  <methods>;
			}

##From 1.17.0 to 2.0.0

-   Capptain is **no longer compatible with Android 1.5**, please make sure your application **minimum SDK version is 4 or more** in the `AndroidManifest.xml`.
-   There is now a unique jar file: `capptain.jar`, please delete all the previous `capptain-*.jar` files.
-   `CapptainMapActivity` is now excluded from the `capptain.jar` but the sources are still available in the `src` folder.

### API level

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="19"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="20"/>

### C2DM

As of June 26, 2012, GCM has replaced C2DM.

C2DM support was already deprecated in the version **1.12.0** of our SDK. The possibility to integrate C2DM with Capptain in the SDK has now been removed in this version.

Devices running older versions of the SDK with C2DM integrated are still pushed using C2DM: our backend remains compatible with C2DM for some months.

First, you must remove anything related to C2DM in your `AndroidManifest.xml` file:

			<receiver android:name="com.ubikod.capptain.android.sdk.c2dm.CapptainC2DMEnabler">
			  <intent-filter>
			    <action android:name="com.ubikod.capptain.intent.action.APPID_GOT" />
			  </intent-filter>
			</receiver>
			
			<receiver android:name="com.ubikod.capptain.android.sdk.c2dm.CapptainC2DMReceiver" android:permission="com.google.android.c2dm.permission.SEND">
			 <intent-filter>
			   <action android:name="com.google.android.c2dm.intent.REGISTRATION" />
			   <action android:name="com.google.android.c2dm.intent.RECEIVE" />
			   <category android:name="<your_package_name>" />
			 </intent-filter>
			</receiver>
			
			<meta-data android:name="capptain:c2dm:sender" android:value="<your_sender_id>" />

You must now enable GCM in your application and integrate it using our SDK, please read Latest/How to Integrate GCM with Engagement.

### Reach

The SDK now handle Jelly Bean Notifications in a compatible way thanks to the **Android Support library (v4)**.

The fastest way to add the library to your project in **Eclipse** is `Right click on your project -> Android Tools -> Add Support Library...`.

If you don't use Eclipse, you can read the instructions [here].

If you have troubles with **ProGuard** after adding the support lib and the new Capptain jars, add the following lines to the `proguard.cfg` file:

			-dontwarn android.**
			-keep class android.support.v4.** { *; }

You can safely delete `capptain_notification_system.xml`, we don't support some system notification options anymore due to Jelly Bean notifications handling:

-   Ticker icon cannot be hidden anymore.
-   Content icon cannot be hidden anymore.
-   The image now plays the role of the large icon, and is displayed only on Android 3+.

You can also remove the `capptain_blank.png` file and remove the following `meta-data` from the `AndroidManifest.xml`:

			<meta-data
			  android:name="capptain:reach:ticker:icon"
			  android:value="icon"/>
			<meta-data
			  android:name="capptain:reach:ticker:icon:blank"
			  android:value="capptain_blank"/>

As a consequence, the use of a content icon is now mandatory for all system notifications (it's also used for the ticker), so you need to specify the icon used for system and in app notifications if not already done:

			<meta-data android:name="capptain:reach:notification:icon" android:value="<name_of_icon_WITHOUT_file_extension_and_WITHOUT_'@drawable/'>" />

All options have been kept for in app notifications.

#### Big picture

For big picture notifications support, you must also add new permissions and actions to the Reach receiver.

Add the missing permissions to the `AndroidManifest.xml` file:

			<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
			<uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION"/>

Then fix `com.ubikod.capptain.android.sdk.reach.CapptainReachReceiver` section to match the following one:

			<receiver android:name="com.ubikod.capptain.android.sdk.reach.CapptainReachReceiver">
			  <intent-filter>
			    <action android:name="com.ubikod.capptain.intent.action.AGENT_CREATED"/>
			    <action android:name="com.ubikod.capptain.intent.action.MESSAGE"/>
			    <action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>
			    <action android:name="com.ubikod.capptain.reach.intent.action.DOWNLOAD_TIMEOUT"/>
			  </intent-filter>
			</receiver>

#### Categories

The Reach SDK code has been refactored, it may break your existing categories. Here is a summary of the changes:

-   `CapptainReachInteractiveContent (extends CapptainReachContent)` now handle most common fields and methods of `CapptainAbstractAnnouncement` and `CapptainPoll`.
-   As a result most method signatures like the ones in `CapptainNotifier` and `CapptainDefaultNotifier` have changed to use `CapptainReachInteractiveContent`.
-   `CapptainNotifier.handleNotification` now returns `Boolean` instead of `boolean`, allowing you to return `null`, see `JavaDoc` for details.
-   `CapptainDefaultNotifier.buildRemoteView(...)` does not exist anymore, but you can move your code to `onNotificationPrepared(...)`.

#### Data Push

It is now possible to specify a category for each data push. Thus, you need to change your callbacks's signature to handle it.

Suppose your code looks like:

			public class DataPushReceiver extends CapptainReachDataPushReceiver
			{
			 @Override
			 protected Boolean onDataPushStringReceived(Context context, String body)
			 {
			   Toast.makeText(context, "Data push: " + body, Toast.LENGTH_LONG).show();
			   return true;
			 }
			
			 @Override
			 protected Boolean onDataPushBase64Received(Context context, byte[] decodedBody, String encodedBody)
			 {
			   Toast.makeText(context, "Data push (binary) " + decodedBody.length + " bytes (decoded)",
			     Toast.LENGTH_LONG).show();
			   return true;
			 }
			} 

Update it like this:
			
			public class DataPushReceiver extends CapptainReachDataPushReceiver
			{
			 @Override
			 protected Boolean onDataPushStringReceived(Context context, String category, String body)
			 {
			   Toast.makeText(context, "Data push: " + body, Toast.LENGTH_LONG).show();
			   return true;
			 }
			
			 @Override
			 protected Boolean onDataPushBase64Received(Context context, String category, byte[] decodedBody, String encodedBody)
			 {
			   Toast.makeText(context, "Data push (binary) " + decodedBody.length + " bytes (decoded)",
			     Toast.LENGTH_LONG).show();
			   return true;
			 }
			} 

##From 1.16.0 to 1.17.0

### GCM

If you integrated GCM, the `CapptainGCMEnabler` broadcast receiver is now **mandatory**, even if you don't use `capptain:gcm:sender`. Plus the **intent filter** for this broadcast receiver **changed**. Please make sure you have `CapptainGCMEnabler` configured like this:

			<receiver android:name="com.ubikod.capptain.android.sdk.gcm.CapptainGCMEnabler">
			  <intent-filter>
			    <action android:name="com.ubikod.capptain.intent.action.APPID_GOT" /> <!-- not com.ubikod.capptain.intent.action.AGENT_CREATED anymore -->
			  </intent-filter>
			</receiver>

### C2DM

If you integrated C2DM, the `CapptainC2DMEnabler` broadcast receiver is now **mandatory**, even if you don't use `capptain:c2dm:sender`. Plus the **intent filter** for this broadcast receiver **changed**. Please make sure you have `CapptainC2DMEnabler` configured like this:

			<receiver android:name="com.ubikod.capptain.android.sdk.c2dm.CapptainC2DMEnabler">
			  <intent-filter>
			    <action android:name="com.ubikod.capptain.intent.action.APPID_GOT" /> <!-- not com.ubikod.capptain.intent.action.AGENT_CREATED anymore -->
			  </intent-filter>
			</receiver>

### Tracking

Tracking using cookies and opening the browser at application startup is no longer supported.

Please remove these sections in your `AndroidManifest.xml` file if present:

			<activity android:name="com.ubikod.capptain.android.sdk.track.CapptainTrackActivity">
			  <intent-filter>
			    <data android:scheme="capptain.<your_package_name>" />
			    <action android:name="android.intent.action.VIEW" />
			    <category android:name="android.intent.category.DEFAULT" />
			    <category android:name="android.intent.category.BROWSABLE" />
			  </intent-filter>
			  <!-- possibly a meta-data -->     
			</activity>

And any occurrence of the browser meta-data:

			<meta-data android:name="capptain:track:browser:enabled" android:value="<true_or_false>" />

Such occurrences include, but are not limited to, the Capptain Reach activities.

If you don't use Android Market install referrer, you can also remove this receiver:

			<receiver android:name="com.ubikod.capptain.android.sdk.track.CapptainTrackReceiver">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.APPID_GOT" />
			 </intent-filter>
			</receiver>

##From 1.15.0 to 1.16.0

### API level

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="18"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="19"/>   

### Extras and appInfo

Limits on keys and size are now in place, please read Latest/How to Use the Engagement API on Android.

##From 1.14.0 to 1.15.0

### API level

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="17"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="18"/>

### Application ID

You can now specify the application identifier at runtime.

##From 1.13.0 to 1.14.0

### API level

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="16"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="17"/>

### Application ID

Before this version, an Android application was only identified by the combination of its package name and its signature.

It is now possible to specify the Capptain `Application ID (APPID)` in the `AndroidManifest.xml` file.

As signatures support is now deprecated, we strongly recommend that you specify the `APPID`.

To specify it, add the following section (between the `<application>` and `</application>` tags):

			<meta-data android:name="capptain:appId" android:value="<YOUR_APPID>"/>

##From 1.12.0 to 1.13.0

### API level

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="15"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="16"/>

### Reach

If you have a overridden the `onNotificationPrepared` method of `CapptainDefaultNotifier` , you must now return true. Returning false let you responsible of managing the system notification.

##From 1.11.1 to 1.12.0

### API level

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="14"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="15"/>

### Reach

The `capptain_notification_system.xml` file has been modified to fix an issue with Android 4.1. You should use the latest version of this file. If you use a custom one, the fix is to specify `height=64dp` on the root layout.

### C2DM/GCM

#### Introduction

C2DM is deprecated, you can still use it but it's recommended to migrate to GCM.

After migrating, devices running older versions of your application are still pushed via C2DM while devices running the latest version are pushed via GCM (don't forget to register an API Key on the application details page on the Capptain web site).

> [AZURE.IMPORTANT] If your client code manages C2DM registration identifiers while the Capptain SDK is configured to use GCM, a conflict on the registration identifiers occurs. Use GCM in Capptain only if your own code does not use C2DM.
>
> Capptain can still be configured to use C2DM, in that case you have nothing to change.

#### AndroidManifest.xml

Replace:

			<receiver android:name="com.ubikod.capptain.android.sdk.c2dm.CapptainC2DMReceiver" android:permission="com.google.android.c2dm.permission.SEND">
			 <intent-filter>
			   <action android:name="com.google.android.c2dm.intent.REGISTRATION" />
			   <action android:name="com.google.android.c2dm.intent.RECEIVE" />
			   <category android:name="<your_package_name>" />
			 </intent-filter>
			</receiver>

by

			<receiver android:name="com.ubikod.capptain.android.sdk.gcm.CapptainGCMReceiver" android:permission="com.google.android.c2dm.permission.SEND">
			 <intent-filter>
			   <action android:name="com.google.android.c2dm.intent.REGISTRATION" />
			   <action android:name="com.google.android.c2dm.intent.RECEIVE" />
			   <category android:name="<your_package_name>" />
			 </intent-filter>
			</receiver>

If you use `CapptainC2DMEnabler`, replace this:

			<receiver android:name="com.ubikod.capptain.android.sdk.c2dm.CapptainC2DMEnabler">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.AGENT_CREATED" />
			 </intent-filter>
			</receiver>
			
			<meta-data android:name="capptain:c2dm:sender" android:value="<your_sender_id>" />

by

			<receiver android:name="com.ubikod.capptain.android.sdk.gcm.CapptainGCMEnabler">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.AGENT_CREATED" />
			 </intent-filter>
			</receiver>
			
			<!-- If only 1 sender, don't forget the \n, otherwise it will be parsed as a negative number... -->
			<meta-data android:name="capptain:gcm:sender" android:value="<your_project_id>\n" />

##From 1.10.0 to 1.11.0

### API level

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="13"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="14"/>

### Activity, job, event and error names

Activity, job, event and error names are now limited to 64 characters. The logs that exceed this limit are not sent and an error is triggered (if you enabled test logs).

### Reach

#### Layout

The `capptain_button_bar.xml` file has been modified to swap the positions of the action and exit buttons. You can use the new layout file if you wish, this migration is not required.

#### Categories

The following sections are needed only if you implemented custom categories from scratch for Reach campaigns.

##### Code

`CapptainAnnouncement` does not extend `CapptainNotifAnnouncement` anymore, both classes now extend the new `CapptainAbstractAnnouncement` class. If you have code relying on the `instanceof` keyword (or using reflection) when using these classes you should check that your code still works well.

The `actionContent` and `exitContent` methods are now forbidden on a `CapptainNotifAnnouncement` instance, you must use `actionNotification` and `exitNotification` instead.

`actionNotification` now has an additional parameter, set it to `true` to make your code compatible. Setting it to `false` disable the launch of the viewing/action intent, but still reports the action in statistics.

##### New feedbacks

The life cycle of a campaign is now more detailed. If you implemented your own category from scratch, you should add new calls such as when a content is displayed. Please read the updated Reach documentation to integrate the new life cycle calls.

##From 1.9.0 to 1.10.0

### API level

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="12"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="13"/>

##From 1.8.4 to 1.9.0

### API level

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="11"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="12"/>

### Network location

If you previously enabled location report, replace the the following line:

			<meta-data android:name="capptain:reportLocation" android:value="true"/>

by this one:

			<meta-data android:name="capptain:locationReport:lazyArea" android:value="true"/>

##From 1.8.3 to 1.8.4

### Reach

The look of the notifications and content activities have been changed. It's not mandatory to update the resources but here is a quick guide to upgrade them. All the new modifications only affect the `res` folder of your Android project.

These files have been modified :

-   In `drawable` :
    -   capptain\_content\_title.xml
-   In `layout` :
    -   capptain\_button\_bar.xml
    -   capptain\_content\_title.xml
    -   capptain\_notification\_area.xml
    -   capptain\_poll.xml
    -   capptain\_poll\_choice.xml
    -   capptain\_poll\_question.xml
    -   capptain\_text\_announcement.xml
    -   capptain\_web\_announcement.xml

Moreover, a new drawable have been added : `capptain_close.png`.

Simply erase the old files with the new ones to make the modifications effective. These changes aim to make the capptain experience consistent accross all currently supported platforms (Android/Web/iOS).

##From 1.7.2 to 1.8.0

### Service

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="10"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="11"/>

##From 1.7.1 to 1.7.2

### Service

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="9"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="10"/>

On some devices we can't generate the Capptain device identifier from the `ANDROID_ID` (it can be buggy or unavailable). In that case, the SDK generates a random device identifier and tries to save it on the device's external storage so that other Capptain applications can share the same device identifier (it's also saved as a shared preference to ensure that the application itself always use the same device identifier, whatever happens to the external storage). For this mechanism to work properly, you need to add the following permission if missing (after the `</application>` tag):

			<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>

This section was missing in the previous versions of the SDK's documentation.

##From 1.7.0 to 1.7.1

### Reach

The file `res/layout/capptain_notification_system.xml` has been updated. It's recommended to use the new one in your applications.

##From 1.6.0 to 1.7.0

### Reach & Tracking

If you have integrated both Reach and Tracking into your application, please replace the following section:

			<activity android:name="com.ubikod.capptain.android.sdk.reach.activity.CapptainTextAnnouncementActivity" android:theme="@android:style/Theme.Light">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.ANNOUNCEMENT"/>
			   <category android:name="android.intent.category.DEFAULT" />
			   <data android:mimeType="text/plain" />
			 </intent-filter>
			</activity>
			<activity android:name="com.ubikod.capptain.android.sdk.reach.activity.CapptainWebAnnouncementActivity" android:theme="@android:style/Theme.Light">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.ANNOUNCEMENT"/>
			   <category android:name="android.intent.category.DEFAULT" />
			   <data android:mimeType="text/html" />
			 </intent-filter>
			</activity>
			<activity android:name="com.ubikod.capptain.android.sdk.reach.activity.CapptainPollActivity" android:theme="@android:style/Theme.Light">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.POLL"/>
			   <category android:name="android.intent.category.DEFAULT" />
			 </intent-filter>
			</activity>

by
			
			<activity android:name="com.ubikod.capptain.android.sdk.reach.activity.CapptainTextAnnouncementActivity" android:theme="@android:style/Theme.Light">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.ANNOUNCEMENT"/>
			   <category android:name="android.intent.category.DEFAULT" />
			   <data android:mimeType="text/plain" />
			 </intent-filter>
			 <meta-data android:name="capptain:track:browser:enabled" android:value="false" />
			</activity>
			<activity android:name="com.ubikod.capptain.android.sdk.reach.activity.CapptainWebAnnouncementActivity" android:theme="@android:style/Theme.Light">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.ANNOUNCEMENT"/>
			   <category android:name="android.intent.category.DEFAULT" />
			   <data android:mimeType="text/html" />
			 </intent-filter>
			 <meta-data android:name="capptain:track:browser:enabled" android:value="false" />
			</activity>
			<activity android:name="com.ubikod.capptain.android.sdk.reach.activity.CapptainPollActivity" android:theme="@android:style/Theme.Light">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.POLL"/>
			   <category android:name="android.intent.category.DEFAULT" />
			 </intent-filter>
			 <meta-data android:name="capptain:track:browser:enabled" android:value="false" />
			</activity>

##From 1.5.0 to 1.6.0

### Service

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="8"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="9"/>

### Reach

A lot of modifications have been done on the Reach SDK, we strongly recommend you to read the new integration guide.

#### Proguard configuration

Action and exit buttons can now be put directly in Web announcement's HTML. If you use Proguard to obfuscate your application you need to add this section, otherwise JavaScript bindings won't work:

			-keep class com.ubikod.capptain.android.sdk.reach.activity.CapptainWebAnnouncementActivity$JavascriptInterface {
			 <methods>;
}

#### AndroidManifest.xml

Replace the old broadcast receivers, i.e. replace the following section
			
			<receiver android:name="com.ubikod.capptain.android.sdk.reach.CapptainReachMessageReceiver">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.MESSAGE"/>
			 </intent-filter>
			</receiver>
			<receiver android:name="com.ubikod.capptain.android.sdk.reach.CapptainReachBoot">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.AGENT_CREATED" />
			 </intent-filter>
			</receiver>
			<receiver android:name="com.ubikod.capptain.android.sdk.reach.CapptainReachNotifAnnouncementReceiver">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.NOTIF_ANNOUNCEMENT" />
			 </intent-filter>
			</receiver>

By this one

			<receiver android:name="com.ubikod.capptain.android.sdk.reach.CapptainReachReceiver">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.AGENT_CREATED" />
			   <action android:name="com.ubikod.capptain.intent.action.MESSAGE" />
			 </intent-filter>
			</receiver>

If you enabled sound and/or vibration on system notifications, this section has become useless, you can remove it:

			<meta-data
			 android:name="capptain:reach:notification:vibrate"
			 android:value="true" />
			<meta-data
			 android:name="capptain:reach:notification:sound"
			 android:value="true" />

You can now set vibration and sound settings directly when creating an announcement or poll on the web site. (Of course you still need the permission to vibrate).

The ticker icon in system notifications (the one in the status bar) is now handled in a different way than the icon in the content. You have to configure both the ticker icon and the "blank" ticker icon, that is to say the transparent icon used to simulate the fact that you want to hide the ticker icon (this is now possible when creating an announcement or a poll).

> [AZURE.IMPORTANT] The ticker icon in Android is mandatory; a notification will not show up if the icon is not correctly set.

Please add this in your `<application>...</application>` section:

			<meta-data
			 android:name="capptain:reach:ticker:icon"
			 android:value="<drawable_name_without_file_extension>" />      
			<meta-data
			 android:name="capptain:reach:ticker:icon:blank"
			 android:value="capptain_blank" />

#### Layouts

The `capptain_notification_overlay.xml` and `capptain_notification_area.xml` have been modified (the SDK expects some new identifiers in these layouts), you have to replace them.

If you customized these files, please re-apply your customization on the new files.

There also new resources that you have to add to your project:

-   `drawable/capptain_blank.png`
-   `layout/capptain_notification_system.xml`

#### Data push

The callbacks now have a return type.

Suppose your code looks like:

			public class DataPushReceiver extends CapptainReachDataPushReceiver
			{
			 @Override
			 protected void onDataPushStringReceived(Context context, String body)
			 {
			   Toast.makeText(context, "Data push: " + body, Toast.LENGTH_LONG).show();
			 }
			
			 @Override
			 protected void onDataPushBase64Received(Context context, byte[] decodedBody, String encodedBody)
			 {
			   Toast.makeText(context, "Data push (binary) " + decodedBody.length + " bytes (decoded)", Toast.LENGTH_LONG).show();
			 }
			}

Update it like this:

			public class DataPushReceiver extends CapptainReachDataPushReceiver
			{
			 @Override
			 protected Boolean onDataPushStringReceived(Context context, String body)
			 {
			   Toast.makeText(context, "Data push: " + body, Toast.LENGTH_LONG).show();
			   return true;
			 }
			
			 @Override
			 protected Boolean onDataPushBase64Received(Context context, byte[] decodedBody, String encodedBody)
			 {
			   Toast.makeText(context, "Data push (binary) " + decodedBody.length + " bytes (decoded)",
			     Toast.LENGTH_LONG).show();
			   return true;
			 }
			}

##From 1.4.0 to 1.5.0

### Service

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="7"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="8"/>

### Reach

Reach resource files and their activities have been modified, it's mandatory to replace ALL the resources files and to integrate the new ones (because new identifiers are used by the code and some assumptions are made on the layout).

If you had customized Reach, please refer to the updated Reach integration procedure and re-apply the changes to the new resource files.

##From 1.2.0 to 1.3.0

Reach integration:

Add this broadcast receiver in your AndroidManifest.xml (between the `<application>` and `</application>` tags):

			<receiver android:name="com.ubikod.capptain.android.sdk.reach.CapptainReachNotifAnnouncementReceiver">
			 <intent-filter>
			   <action android:name="com.ubikod.capptain.intent.action.NOTIF_ANNOUNCEMENT" />
			 </intent-filter>
			</receiver>

##From 1.1.2 to 1.2.0

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="6"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="7"/>

##From 1.0.2 to 1.1.0

### API level

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="5"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="6"/>

### Network location

Network location reporting is no longer enabled by default.

If you want network locations to be reported, you must add this (between the `<application>` and `</application>` tags):

			<meta-data android:name="capptain:reportLocation" android:value="true"/>

##From 0.8.9 to 1.0.0

### Jar files

Some jar files have been renamed and there is a new one.

Delete all previous capptain jar files before adding the new ones to your classpath.

### AndroidManifest.xml

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="4"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="5"/>

#### Proguard configuration

Optionally, you can now improve Proguard configuration for Capptain, you can replace this:

			-keep class com.ubikod.capptain.** {
			 *;
			}

by

			-keep public class * extends android.os.IInterface

From 0.8.8 to 0.8.9

### Reach integration

The `capptain_poll.xml` file has a new exit button, you must use the new one.

##From 0.8.7 to 0.8.8

### Service integration

After having replaced the capptain jars in your classpath, you have to edit your `AndroidManifest.xml` file:

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="3"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="4"/>

The following permission is now mandatory, if you did not declared it, add:

			<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

##From 0.8.6 to 0.8.7

### Service integration

After having replaced the capptain jars in your classpath, you have to edit your `AndroidManifest.xml` file:

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="2"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="3"/>

##From 0.8.2 to 0.8.3

### Reach integration

Some layout issues have been fixed in Reach, it's not mandatory to update them though it's recommended.

In your `res/layout` folder, replace all the Capptain layout files by the ones provided in this SDK version.

##From 0.8.1 to 0.8.2

### Service integration

After having replaced the capptain jars in your classpath, you have to edit your `AndroidManifest.xml` file:

Replace the following line:

			<meta-data android:name="capptain:api:level" android:value="1"/>

by this one:

			<meta-data android:name="capptain:api:level" android:value="2"/>

### Reach integration

Some layout issues have been fixed in Reach, it's not mandatory to update them though it's recommended.

In your `res/layout` folder, replace the following files by the ones provided in this SDK version:

-   `capptain_text_announcement.xml`
-   `capptain_web_announcement.xml`

[here]:http://developer.android.com/tools/extras/support-library.html#Downloading
