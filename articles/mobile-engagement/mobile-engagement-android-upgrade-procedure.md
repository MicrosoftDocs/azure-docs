<properties 
	pageTitle="Azure Mobile Engagement Android SDK Integration" 
	description="Latest updates and procedures for Android SDK for Azure Mobile Engagement"
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-android" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="05/10/2016"
	ms.author="piyushjo" />


#Upgrade procedures

If you already have integrated an older version of our SDK into your application, you have to consider the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDK. For example if you migrate from 1.4.0 to 1.6.0 you have to first follow the "from 1.4.0 to 1.5.0" procedure then the "from 1.5.0 to 1.6.0" procedure.

Whatever the version you upgrade from, you have to replace the `mobile-engagement-VERSION.jar` with the new one.

##From 4.2.0 to 4.2.1

This step can actually be done on any version of the SDK, its a security improvement when you integrate Reach activities.

You should now add `exported="false"` to all Reach activities.

Reach activities should now look like this on your `AndroidManifest.xml`:

			<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementTextAnnouncementActivity" android:theme="@android:style/Theme.Light" android:exported="false">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.ANNOUNCEMENT"/>
			    <category android:name="android.intent.category.DEFAULT" />
			    <data android:mimeType="text/plain" />
			  </intent-filter>
			</activity>
			<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementWebAnnouncementActivity" android:theme="@android:style/Theme.Light" android:exported="false">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.ANNOUNCEMENT"/>
			    <category android:name="android.intent.category.DEFAULT" />
			    <data android:mimeType="text/html" />
			  </intent-filter>
			</activity>
			<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementPollActivity" android:theme="@android:style/Theme.Light" android:exported="false">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.POLL"/>
			    <category android:name="android.intent.category.DEFAULT" />
			  </intent-filter>
			</activity>
			<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementLoadingActivity" android:theme="@android:style/Theme.Dialog" android:exported="false">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.LOADING"/>
			    <category android:name="android.intent.category.DEFAULT"/>
			  </intent-filter>
			</activity>

##From 4.0.0 to 4.1.0

The SDK now handle new permission model from Android M.

If you use location features or big picture notifications please read [this section](mobile-engagement-android-integrate-engagement.md#android-m-permissions).

In addition to the new permission model, we now support configuring location features at runtime.
We are still compatible with the manifest parameters for location but it's now deprecated. To use runtime configuration, remove the following sections from your ``AndroidManifest.xml``:

    <meta-data
      android:name="engagement:locationReport:lazyArea"
      android:value="true"/>
    <meta-data
      android:name="engagement:locationReport:realTime"
      android:value="true"/>
    <meta-data
      android:name="engagement:locationReport:realTime:background"
      android:value="true"/>
    <meta-data
      android:name="engagement:locationReport:realTime:fine"
      android:value="true"/>

and read [this updated procedure](mobile-engagement-android-integrate-engagement.md#location-reporting) to use runtime configuration instead.

##From 3.0.0 to 4.0.0

### Native push

Native push (GCM/ADM) is now also used for in app notifications so you must configure the native push credentials for any type of push campaign.

If not already done please follow [this procedure](mobile-engagement-android-integrate-engagement-reach.md#native-push).

### AndroidManifest.xml

Reach integration has been modified in ``AndroidManifest.xml``.

Replace this:

    <receiver
      android:name="com.microsoft.azure.engagement.reach.EngagementReachReceiver"
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

By

    <receiver
      android:name="com.microsoft.azure.engagement.reach.EngagementReachReceiver"
      android:exported="false">
      <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED"/>
        <action android:name="com.microsoft.azure.engagement.intent.action.AGENT_CREATED"/>
        <action android:name="com.microsoft.azure.engagement.intent.action.MESSAGE"/>
        <action android:name="com.microsoft.azure.engagement.reach.intent.action.ACTION_NOTIFICATION"/>
        <action android:name="com.microsoft.azure.engagement.reach.intent.action.EXIT_NOTIFICATION"/>
        <action android:name="com.microsoft.azure.engagement.reach.intent.action.DOWNLOAD_TIMEOUT"/>
      </intent-filter>
    </receiver>
    <receiver android:name="com.microsoft.azure.engagement.reach.EngagementReachDownloadReceiver">
      <intent-filter>
        <action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>
      </intent-filter>
    </receiver>

There is possibly a loading screen now when you click on an announcement (with text/web content) or a poll.
You have to add this for those campaigns to work in 4.0.0:

    <activity
      android:name="com.microsoft.azure.engagement.reach.activity.EngagementLoadingActivity"
      android:theme="@android:style/Theme.Dialog">
      <intent-filter>
        <action android:name="com.microsoft.azure.engagement.reach.intent.action.LOADING"/>
        <category android:name="android.intent.category.DEFAULT"/>
      </intent-filter>
    </activity>

### Resources

Embed the new `res/layout/engagement_loading.xml` file into your project.

##From 2.4.0 to 3.0.0

The following describes how to migrate an SDK integration from the Capptain service offered by Capptain SAS into an app powered by Azure Mobile Engagement. If you are migrating from an earlier version, please consult the Capptain web site to migrate to 2.4.0 first and then apply the following procedure.

>[AZURE.IMPORTANT] Capptain and Mobile Engagement are not the same services, and the procedure given below only highlights how to migrate the client app. Migrating the SDK in the app will NOT migrate your data from the Capptain servers to the Mobile Engagement servers.

### JAR file

Replace `capptain.jar` by `mobile-engagement-VERSION.jar` in your `libs` folder.

### Resource files

Every resource file that we provided (prefixed by `capptain_`) has to be replaced by the new ones (prefixed with `engagement_`).

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

Every call to any Java class of our SDK has to be renamed; for example, `CapptainAgent.getInstance(this)` must be renamed `EngagementAgent.getInstance(this)`, `extends CapptainActivity` must be renamed `extends EngagementActivity` etc...

If you were integrated with default agent preference files, the default file name is now `engagement.agent` and the key is `engagement:agent`.

When creating web announcements, the Javascript binder is now `engagementReachContent`.

### AndroidManifest.xml

A lot of changes happened there, the service is not shared anymore, and a lot of receivers are not exportable anymore.

The service declaration is now simpler; remove the intent filter and all meta-data inside it, and add `exportable=false`.

Plus everything is renamed to use engagement.

It now looks like:

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
				android:name="capptain:track:installReferrerForwardList"
				android:value="com.class1,com.class2"/>
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
 