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

#How to Integrate Engagement Reach on Android

> [AZURE.IMPORTANT] You must follow the integration procedure described in the How to Integrate Engagement on Android document before following this guide.

##Standard integration

The Reach SDK requires the **Android Support library (v4)**.

The fastest way to add the library to your project in **Eclipse** is `Right click on your project -> Android Tools -> Add Support Library...`.

If you don't use Eclipse, you can read the instructions [here].

Copy Reach resource files from the SDK in your project :

-   Copy the files from the `res/layout` folder delivered with the SDK into the `res/layout` folder of your application.
-   Copy the files from the `res/drawable` folder delivered with the SDK into the `res/drawable` folder of your application.

Edit your `AndroidManifest.xml` file:

-   Add the following section (between the `<application>` and `</application>` tags):

			<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementTextAnnouncementActivity" android:theme="@android:style/Theme.Light">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.ANNOUNCEMENT"/>
			    <category android:name="android.intent.category.DEFAULT" />
			    <data android:mimeType="text/plain" />
			  </intent-filter>
			</activity>
			<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementWebAnnouncementActivity" android:theme="@android:style/Theme.Light">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.ANNOUNCEMENT"/>
			    <category android:name="android.intent.category.DEFAULT" />
			    <data android:mimeType="text/html" />
			  </intent-filter>
			</activity>
			<activity android:name="com.microsoft.azure.engagement.reach.activity.EngagementPollActivity" android:theme="@android:style/Theme.Light">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.POLL"/>
			    <category android:name="android.intent.category.DEFAULT" />
			  </intent-filter>
			</activity>
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

-   You need this permission to replay system notifications that were not clicked at boot (otherwise they will be kept on disk but won't be displayed anymore, you really have to include this).

			<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

-   Specify an icon used for notifications (both in app and system ones) by copying and editing the following section (between the `<application>` and `</application>` tags):

			<meta-data android:name="engagement:reach:notification:icon" android:value="<name_of_icon_WITHOUT_file_extension_and_WITHOUT_'@drawable/'>" />

> [AZURE.IMPORTANT] This section is **mandatory** if you plan on using system notifications when creating Reach campaigns. Android prevents system notifications without icons from being shown. So if you omit this section, your end users will not be able to receive them.

-   If you create campaigns with system notifications using big picture, you need to add the following permissions (after the `</application>` tag) if missing:

			<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
			<uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION"/>

-   For system notifications you can also specify in the Reach campaign if the device should ring and/or vibrate. For it to work, you have to make sure you declared the following permission (after the `</application>` tag):

			<uses-permission android:name="android.permission.VIBRATE" />

	Without this permission, Android prevents system notifications from being shown if you checked the ring or the vibrate option in the Reach Campaign manager.

-   If you build your application using **ProGuard** and have errors related to the Android Support library or the Engagement jar, add the following lines to your `proguard.cfg` file:

			-dontwarn android.**
			-keep class android.support.v4.** { *; }

**Your application is now ready to receive and display reach campaigns!**

##How to handle data push

### Integration

If you want your application to be able to receive Reach data pushes, you have to create a sub-class of `com.microsoft.azure.engagement.reach.EngagementReachDataPushReceiver` and reference it in the `AndroidManifest.xml` file (between the `<application>` and/or `</application>` tags):

			<receiver android:name="<your_sub_class_of_com.microsoft.azure.engagement.reach.EngagementReachDataPushReceiver>"
			  android:exported="false">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.reach.intent.action.DATA_PUSH" />
			  </intent-filter>
			</receiver>

Then you can override the `onDataPushStringReceived` and `onDataPushBase64Received` callbacks. Here is an example:

			public class MyDataPushReceiver extends EngagementReachDataPushReceiver
			{
			  @Override
			  protected Boolean onDataPushStringReceived(Context context, String category, String body)
			  {
			    Log.d("tmp", "String data push message received: " + body);
			    return true;
			  }
			
			  @Override
			  protected Boolean onDataPushBase64Received(Context context, String category, byte[] decodedBody, String encodedBody)
			  {
			    Log.d("tmp", "Base64 data push message received: " + encodedBody);
			    // Do something useful with decodedBody like updating an image view
			    return true;
			  }
			}

### Category

The category parameter is optional when you create a Data Push campaign and allows you to filter data pushes. This is useful if you have several broadcast receivers handling different types of data pushes, or if you want to push different kinds of `Base64` data and want to identify their type before parsing them.

### Callbacks' return parameter

Here are some guidelines to properly handle the return parameter of `onDataPushStringReceived` and `onDataPushBase64Received`:

-   A broadcast receiver should return `null` in the callback if it does not know how to handle a data push. You should use the category to determine whether your broadcast receiver should handle the data push or not.
-   One of the broadcast receiver should return `true` in the callback if it accepts the data push.
-   One of the broadcast receiver should return `false` in the callback if it recognizes the data push, but discards it for whatever reason. For example, return `false` when the received data is invalid.
-   If one broadcast receiver returns `true` while another one returns `false` for the same data push, the behavior is undefined, you should never do that.

The return type is used only for the Reach statistics:

-   `Replied` is incremented if one of the broadcast receivers returned either `true` or `false`.
-   `Actioned` is incremented only if one of the broadcast receivers returned `true`.

##How to receive campaigns at any time

When following the integration procedure described above, the Engagement service connects to the Engagement servers only when statistics need to be reported (plus a 1 minute timeout). Consequently, **Reach campaigns can only be received during a user session**. Fortunately, Engagement can be configured to **allow your application to receive Reach campaigns at any time**, including when the device is sleeping (the device must of course have an active network connection, messages are delayed while the device is offline).

To benefit from "Any time" push, you need to use one or more Native Push services depending on devices you target:

  - Google Play devices: Use [Google Cloud Messaging] by following the [How to Integrate GCM with Engagement guide](mobile-engagement-android-gcm-integrate.md) guide.
  - Amazon devices: Use [Amazon Device Messaging] by following the [How to Integrate ADM with Engagement guide](mobile-engagement-android-adm-integrate.md) guide.

If you want to target both Amazon and Google Play devices, its possible to have everything inside 1 AndroidManifest.xml/APK for development. But when submitting to Amazon, they may reject your application if they find GCM code.

You should use multiple APKs in that case.

##How to customize campaigns

To customize campaigns, you can modify the layouts provided in the Reach SDK.

You should keep all the identifiers used in the layouts and keep the types of the views that use an identifier, especially for text views and image views. Some views are just used to hide or show areas so their type may be changed. Please check the source code if you intend to change the type of a view in the provided layouts.

### Notifications

There are two types of notifications: system and in-app notifications which use different layout files.

#### System notifications

To customize system notifications you need to use the **categories**. You can jump to [Categories](#categories).

#### In-app notifications

By default, an in-app notification is a view that is dynamically added to the current activity user interface thanks to the Android method `addContentView()`. This is called a notification overlay. Notification overlays are great for a fast integration because they do not require you to modify any layout in your application.

To modify the look of your notification overlays, you can simply modify the file `engagement_notification_area.xml` to your needs.

> [AZURE.NOTE] The file `engagement_notification_overlay.xml` is the one that is used to create a notification overlay, it includes the file `engagement_notification_area.xml`. You can also customize it to suit your needs (such as for positioning the notification area within the overlay).

##### Include notification layout as part of an activity layout

Overlays are great for a fast integration but can be inconvenient or have side effects in special cases. The overlay system can be customized at an activity level, making it easy to prevent side effects for special activities.

You can decide to include our notification layout in your existing layout thanks to the Android **include** statement. The following is an example of a modified `ListActivity` layout containing just a `ListView`.

**Before Engagement integration :**

			<?xml version="1.0" encoding="utf-8"?>
			<ListView
			  xmlns:android="http://schemas.android.com/apk/res/android"
			  android:id="@android:id/list"
			  android:layout_width="fill_parent"
			  android:layout_height="fill_parent" />

**After Engagement integration :**

			<?xml version="1.0" encoding="utf-8"?>
			<LinearLayout
			  xmlns:android="http://schemas.android.com/apk/res/android"
			  android:orientation="vertical"
			  android:layout_width="fill_parent"
			  android:layout_height="fill_parent">
			
			  <ListView
			    android:id="@android:id/list"
			    android:layout_width="fill_parent"
			    android:layout_height="fill_parent"
			    android:layout_weight="1" />
			
			  <include layout="@layout/engagement_notification_area" />
			
			</LinearLayout>

In this example we added a parent container since the original layout used a list view as the top level element. We also added `android:layout_weight="1"` to be able to add a view below a list view configured with `android:layout_height="fill_parent"`.

The Engagement Reach SDK automatically detects that the notification layout is included in this activity and will not add an overlay for this activity.

> [AZURE.TIP] If you use a ListActivity in your application, a visible Reach overlay will prevent you from reacting to clicked items in the list view anymore. This is a known issue. To work around this problem we suggest you to embed the notification layout in your own list activity layout like in the previous sample.

##### Disabling application notification per activity

If you don't want the overlay to be added to your activity, and if you don't include the notification layout in your own layout, you can disable the overlay for this activity in the `AndroidManifest.xml` by adding a `meta-data` section like in the following example:

			<activity android:name="SplashScreenActivity">
			  <meta-data android:name="engagement:notification:overlay" android:value="false"/>
			</activity>

#### <a name="categories"></a> Categories

When you modify the provided layouts, you modify the look of all your notifications. Categories allow you to define various targeted looks (possibly behaviors) for notifications. A category can be specified when you create a Reach campaign. Keep in mind that categories also let you customize announcements and polls, that is described later in this document.

To register a category handler for your notifications, you need to add a call when the application is initialized.

> [AZURE.IMPORTANT] Please read the warning about the android:process attribute \<android-sdk-engagement-process\> in the How to Integrate Engagement on Android topic before proceeding.

The following example assumes you acknowledged the previous warning and use a sub-class of `EngagementApplication`:

			public class MyApplication extends EngagementApplication
			{
			  @Override
			  protected void onApplicationProcessCreate()
			  {
			    // [...] other init
			    EngagementReachAgent reachAgent = EngagementReachAgent.getInstance(this);
			    reachAgent.registerNotifier(new MyNotifier(this), "myCategory");
			  }
			}

The `MyNotifier` object is the implementation of the notification category handler. It is either an implementation of the `EngagementNotifier` interface or a sub class of the default implementation: `EngagementDefaultNotifier`.

Note that the same notifier can handle several categories, you can register them like this:

			reachAgent.registerNotifier(new MyNotifier(this), "myCategory", "myAnotherCategory");

To replace the default category implementation, you can register your implementation like in the following example:

			public class MyApplication extends EngagementApplication
			{
			  @Override
			  protected void onApplicationProcessCreate()
			  {
			    // [...] other init
			    EngagementReachAgent reachAgent = EngagementReachAgent.getInstance(this);
			    reachAgent.registerNotifier(new MyNotifier(this), Intent.CATEGORY_DEFAULT); // "android.intent.category.DEFAULT"
			  }
			}

The current category used in a handler is passed as a parameter in most methods you can override in `EngagementDefaultNotifier`.

It is passed either as a `String` parameter or indirectly in a `EngagementReachContent` object which has a `getCategory()` method.

You can change most of the notification creation process by redefining methods on `EngagementDefaultNotifier`, for more advanced customization feel free to take a look at the technical documentation and at the source code.

##### In-app notifications

If you just want to use alternate layouts for a specific category, you can implement this as in the following example:
			
			public class MyNotifier extends EngagementDefaultNotifier
			{
			  public MyNotifier(Context context)
			  {
			    super(context);
			  }
			
			  @Override
			  protected int getOverlayLayoutId(String category)
			  {
			    return R.layout.my_notification_overlay;
			  }
			
			
			  @Override
			  public Integer getOverlayViewId(String category)
			  {
			    return R.id.my_notification_overlay;
			  }
			
			  @Override
			  public Integer getInAppAreaId(String category)
			  {
			    return R.id.my_notification_area;
			  }
			}

**Example of `my_notification_overlay.xml` :**

			<?xml version="1.0" encoding="utf-8"?>
			<RelativeLayout
			  xmlns:android="http://schemas.android.com/apk/res/android"
			  android:id="@+id/my_notification_overlay"
			  android:layout_width="fill_parent"
			  android:layout_height="fill_parent">
			
			  <include layout="@layout/my_notification_area" />
			
			</RelativeLayout>

As you can see, the overlay view identifier is different than the standard one. It is important that each layout use a unique identifier for overlays.

**Example of `my_notification_area.xml` :**

			<?xml version="1.0" encoding="utf-8"?>
			<merge
			  xmlns:android="http://schemas.android.com/apk/res/android"
			  android:layout_width="fill_parent"
			  android:layout_height="fill_parent">
			
			  <RelativeLayout
			    android:id="@+id/my_notification_area"
			    android:layout_width="fill_parent"
			    android:layout_height="64dp"
			    android:layout_alignParentTop="true"
			    android:background="#B000">
			
			    <LinearLayout
			      android:orientation="horizontal"
			      android:layout_width="fill_parent"
			      android:layout_height="fill_parent"
			      android:gravity="center_vertical">
			
			      <ImageView
			        android:id="@+id/engagement_notification_icon"
			        android:layout_width="48dp"
			        android:layout_height="48dp" />
			
			      <LinearLayout
			        android:id="@+id/engagement_notification_text"
			        android:orientation="vertical"
			        android:layout_width="fill_parent"
			        android:layout_height="fill_parent"
			        android:layout_weight="1"
			        android:gravity="center_vertical">
			
			        <TextView
			          android:id="@+id/engagement_notification_title"
			          android:layout_width="fill_parent"
			          android:layout_height="wrap_content"
			          android:singleLine="true"
			          android:ellipsize="end"
			          android:textAppearance="@android:style/TextAppearance.Medium" />
			
			        <TextView
			          android:id="@+id/engagement_notification_message"
			          android:layout_width="fill_parent"
			          android:layout_height="wrap_content"
			          android:maxLines="2"
			          android:ellipsize="end"
			          android:textAppearance="@android:style/TextAppearance.Small" />
			
			      </LinearLayout>
			
			      <ImageView
			        android:id="@+id/engagement_notification_image"
			        android:layout_width="wrap_content"
			        android:layout_height="fill_parent"
			        android:adjustViewBounds="true" />
			
			      <ImageButton
			        android:id="@+id/engagement_notification_close_area"
			        android:visibility="invisible"
			        android:layout_width="wrap_content"
			        android:layout_height="fill_parent"
			        android:src="@android:drawable/btn_dialog"
			        android:background="#0F00" />
			
			    </LinearLayout>
			
			    <ImageButton
			      android:id="@+id/engagement_notification_close"
			      android:layout_width="wrap_content"
			      android:layout_height="fill_parent"
			      android:layout_alignParentRight="true"
			      android:src="@android:drawable/btn_dialog"
			      android:background="#0F00" />
			
			  </RelativeLayout>
			
			</merge>

As you can see, the notification area view identifier is different than the standard one. It is important that each layout uses a unique identifier for notification areas.

This simple example of category makes application (or in-app) notifications displayed at the top of the screen. We did not change the standard identifiers used in the notification area itself.

If you want to change that, you have to redefine the `EngagementDefaultNotifier.prepareInAppArea` method. It's recommended to look at the technical documentation and at the source code of `EngagementNotifier` and `EngagementDefaultNotifier` if you want this level of advanced customization.

##### System notifications

By extending `EngagementDefaultNotifier`, you can override `onNotificationPrepared` to alter the notification that was prepared by the default implementation.

For example:

			@Override
			protected boolean onNotificationPrepared(Notification notification, EngagementReachInteractiveContent content)
			  throws RuntimeException
			{
			  if ("ongoing".equals(content.getCategory()))
			    notification.flags |= Notification.FLAG_ONGOING_EVENT;
			  return true;
			}

This example makes a system notification for a content being displayed as an ongoing event when the "ongoing" category is used.

If you want to build the `Notification` object from scratch, you can return `false` to the method and call `notify` yourself on the `NotificationManager`. In that case it's important that you keep a `contentIntent`, a `deleteIntent` and the notification identifier used by `EngagementReachReceiver`.

Here is a correct example of such an implementation:

			@Override
			protected boolean onNotificationPrepared(Notification notification, EngagementReachInteractiveContent content) throws RuntimeException
			{
			  /* Required fields */
			  NotificationCompat.Builder builder = new NotificationCompat.Builder(mContext)
			    .setSmallIcon(notification.icon)              // icon is mandatory
			    .setContentIntent(notification.contentIntent) // keep content intent
			    .setDeleteIntent(notification.deleteIntent);  // keep delete intent
			
			  /* Your customization */
			  // builder.set...
			
			  /* Dismiss option can be managed only after build */
			  Notification myNotification = builder.build();
			  if (!content.isNotificationCloseable())
			    myNotification.flags |= Notification.FLAG_NO_CLEAR;
			
			  /* Notify here instead of super class */
			  NotificationManager manager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
			  manager.notify(getNotificationId(content), myNotification); // notice the call to get the right identifier
			
			  /* Return false, we notify ourselves */
			  return false;
			}

##### Notification only announcements

The management of the click on a notification only announcement can be customized by overriding `EngagementDefaultNotifier.onNotifAnnouncementIntentPrepared` to modify the prepared `Intent`. Using this method allows you to tune the flags easily.

For example to add the `SINGLE_TOP` flag:
			
			@Override
			protected Intent onNotifAnnouncementIntentPrepared(EngagementNotifAnnouncement notifAnnouncement,
			  Intent intent)
			{
			  intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
			  return intent;
			}

For legacy Engagement users, please note that system notifications without action URL now launches the application if it was in background, so this method can be called with an announcement without action URL. You should consider that when customizing the intent.

You can also implement `EngagementNotifier.executeNotifAnnouncementAction` from scratch.

##### Notification life cycle

When using the default category, some life cycle methods are called on the `EngagementReachInteractiveContent` object to report statistics and update the campaign state:

-   When the notification is displayed in application or put in the status bar, the `displayNotification` method is called (which reports statistics) by `EngagementReachAgent` if `handleNotification` returns `true`.
-   If the notification is dismissed, the `exitNotification` method is called, statistic is reported and next campaigns can now be processed.
-   If the notification is clicked, `actionNotification` is called, statistic is reported and the associated intent is launched.

If your implementation of `EngagementNotifier` bypasses the default behavior, you have to call these life cycle methods by yourself. The following examples illustrate some cases where the default behavior is bypassed:

-   You don't extend `EngagementDefaultNotifier`, e.g. you implemented category handling from scratch.
-   For system notifications, you overrode the `onNotificationPrepared` and you modified `contentIntent` or `deleteIntent` in the `Notification` object.
-   For in-app notifications, you overrode `prepareInAppArea`, be sure to map at least `actionNotification` to one of your U.I controls.

> [AZURE.NOTE] If `handleNotification` throws an exception, the content is deleted and `dropContent` is called. This is reported in statistics and next campaigns can now be processed.

### Announcements and polls

#### Layouts

You can modify the `engagement_text_announcement.xml`, `engagement_web_announcement.xml` and `engagement_poll.xml` files to customize text announcements, web announcements and polls.

These files share two common layouts for the title area and the button area. The layout for the title is `engagement_content_title.xml` and uses the eponymous drawable file for the background. The layout for the action and exit buttons is `engagement_button_bar.xml` and uses the eponymous drawable file for the background.

In a poll, the question layout and their choices are dynamically inflated using several times the `engagement_question.xml` layout file for the questions and the `engagement_choice.xml` file for the choices.

#### Categories

##### Alternate layouts

Like notifications, the campaign's category can be used to have alternate layouts for your announcements and polls.

For example, to create a category for a text announcement, you can extend `EngagementTextAnnouncementActivity` and reference it the `AndroidManifest.xml` file:

			<activity android:name="com.your_company.MyCustomTextAnnouncementActivity">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.intent.action.ANNOUNCEMENT"/>
			    <category android:name="my_category" />
			    <data android:mimeType="text/plain" />
			  </intent-filter>
			</activity>

Note that the category in the intent filter is used to make the difference with the default announcement activity.

The Reach SDK uses the intent system to resolve the right activity for a specific category and it falls back on the default category if the resolution failed.

Then you have to implement `MyCustomTextAnnouncementActivity`, if you just want to change the layout (but keep the same view identifiers), you just have to define the class like in the following example:

			public class MyCustomTextAnnouncementActivity extends EngagementTextAnnouncementActivity
			{
			  @Override
			  protected String getLayoutName()
			  {
			    return "my_text_announcement";  // tell super class to use R.layout.my_text_announcement
			  }
			}

To replace the default category of text announcements, simply replace `android:name="com.microsoft.azure.engagement.reach.activity.EngagementTextAnnouncementActivity"` by your implementation.

Web announcements and polls can be customized in a similar fashion.

For web announcements you can extend `EngagementWebAnnouncementActivity` and declare your activity in the `AndroidManifest.xml` like in the following example:

			<activity android:name="com.your_company.MyCustomWebAnnouncementActivity">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.intent.action.ANNOUNCEMENT"/>
			    <category android:name="my_category" />
			    <data android:mimeType="text/html" />    <!-- only difference with text announcements in the intent is the data mime type -->
			  </intent-filter>
			</activity>

For polls you can extend `EngagementPollActivity` and declare your in the `AndroidManifest.xml` like in the following example:

			<activity android:name="com.your_company.MyCustomPollActivity">
			  <intent-filter>
			    <action android:name="com.microsoft.azure.engagement.intent.action.POLL"/>
			    <category android:name="my_category" />
			  </intent-filter>
			</activity>
			
##### Implementation from scratch

You can implement categories for your announcement (and poll) activities without extending one of the `Engagement*Activity` classes provided by the Reach SDK. This is useful for example if you want to define a layout that does not use the same views as the standard layouts.

Like for advanced notification customization, it is recommended to look at the source code of the standard implementation.

Here are some things to keep in mind: Reach will launch the activity with a specific intent (corresponding to the intent filter) plus an extra parameter which is the content identifier.

To retrieve the content object which contain the fields you specified when creating the campaign on the web site you can do this:

			public class MyCustomTextAnnouncement extends EngagementActivity
			{
			  private EngagementAnnouncement mContent;
			
			  @Override
			  protected void onCreate(Bundle savedInstanceState)
			  {
			    super.onCreate(savedInstanceState);
			
			    /* Get content */
			    mContent = EngagementReachAgent.getInstance(this).getContent(getIntent());
			    if (mContent == null)
			    {
			      /* If problem with content, exit */
			      finish();
			      return;
			    }
			
			    setContentView(R.layout.my_text_announcement);
			
			    /* Configure views by querying fields on mContent */
			    // ...
			  }
			}

For statistics, you should report the content is displayed in the `onResume` event:
			
			@Override
			protected void onResume()
			{
			 /* Mark the content displayed */
			 mContent.displayContent(this);
			 super.onResume();
			}

Then, don't forget to call either `actionContent(this)` or `exitContent(this)` on the content object before the activity goes into background.

If you don't call either `actionContent` or `exitContent`, statistics won't be sent (i.e. no analytics on the campaign) and more importantly, the next campaigns will not be notified until the application process is restarted.

Orientation or other configuration changes can make the code tricky to determine whether the activity goes into background or not, the standard implementation makes sure the content is reported as exited if the user leaves the activity (either by pressing `HOME` or `BACK`) but not if the orientation changes.

Here is the interesting part of the implementation:

			@Override
			protected void onUserLeaveHint()
			{
			  finish();
			}
			
			@Override
			protected void onPause()
			{
			  if (isFinishing() && mContent != null)
			  {
			    /*
			     * Exit content on exit, this is has no effect if another process method has already been
			     * called so we don't have to check anything here.
			     */
			    mContent.exitContent(this);
			  }
			  super.onPause();
			}

As you can see, if you called `actionContent(this)` then finished the activity, `exitContent(this)` can be safely called without having any effect.

##Test

Now please verify your integration by reading How to Test Engagement Integration on Android.

[here]:http://developer.android.com/tools/extras/support-library.html#Downloading
[Google Cloud Messaging]:http://developer.android.com/guide/google/gcm/index.html
[Amazon Device Messaging]:https://developer.amazon.com/sdk/adm.html
