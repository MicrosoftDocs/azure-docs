1. Open the Android SDK Manager by clicking the icon on the toolbar of Android Studio or by clicking **Tools** -> **Android** -> **SDK Manager** on the menu. Locate the target version of the Android SDK that is used in your project , open it, and choose **Google APIs**, if it is not already installed.

2. Go to **File**, **Project Structure**. Then enable Push Notifications under **Notifications**.

3. Open **AndroidManifest.xml** and add this tag to the *application* tag.

        <meta-data android:name="com.google.android.gms.version"
            android:value="@integer/google_play_services_version" />
 




