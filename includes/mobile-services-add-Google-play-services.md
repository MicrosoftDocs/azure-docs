1. Open the Android SDK Manager by clicking the icon on the toolbar of Android Studio or by clicking **Tools** -> **Android** -> **SDK Manager** on the menu. Locate the target version of the Android SDK that is used in your project , open it, and choose **Google APIs**, if it is not already installed.

2. Scroll down to **Extras**, expand it, and choose **Google Play Services**, as shown below. Click **Install Packages**. Note the SDK path, for use in the following step. 

   	![](./media/notification-hubs-android-get-started/notification-hub-create-android-app4.png)


3. Open the **build.gradle** file in the app directory.

	![](./media/mobile-services-android-get-started-push/android-studio-push-build-gradle.png)

4. Add this line under *dependencies*: 

   		compile 'com.google.android.gms:play-services-base:6.5.87'

5. Under *defaultConfig*, change *minSdkVersion* to 9.
 
6. Click the **Sync Project with Gradle Files** button in the tool bar.

7. Open **AndroidManifest.xml** and add this tag to the *application* tag.

        <meta-data android:name="com.google.android.gms.version"
            android:value="@integer/google_play_services_version" />
 




