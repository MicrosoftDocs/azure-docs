
## Create an application (Express)
Now you need to register your application in the *Microsoft Application Registration Portal*:
1. Register your application via the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app?appType=mobileAndDesktopApp&appTech=android&step=configure)
2.	Enter a name for your application and your email
3.	Make sure the option for Guided Setup is checked
4.	Follow the instructions to obtain the application ID and paste it into your code

### Add your application registration information to your solution (Advanced)
Now you need to register your application in the *Microsoft Application Registration Portal*:
1. Go to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app) to register an application
2. Enter a name for your application and your email 
3. Make sure the option for Guided Setup is unchecked
4. Click `Add Platform`, then select `Native Application` and hit Save
5.	Open `MainActivity` (under `app` > `java` > *`{host}.{namespace}`*)
6.	Replace the *[Enter the application Id here]* in the line starting with `final static String CLIENT_ID` with the application ID you just registered:

```java
final static String CLIENT_ID = "[Enter the application Id here]";
```
<!-- Workaround for Docs conversion bug -->
<ol start="7">
<li>
Open `AndroidManifest.xml` (under `app` > `manifests`)
Add the following activity to `manifest\application` node. This registers a `BrowserTabActivity` to allow the OS to resume your application after completing the authentication:
</li>
</ol>

```xml
<!--Intent filter to capture System Browser calling back to our app after Sign In-->
<activity
    android:name="com.microsoft.identity.client.BrowserTabActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        
        <!--Add in your scheme/host from registered redirect URI-->
        <!--By default, the scheme should be similar to 'msal[appId]' -->
        <data android:scheme="msal[Enter the application Id here]"
            android:host="auth" />
    </intent-filter>
</activity>
```
<!-- Workaround for Docs conversion bug -->
<ol start="8">
<li>
In the `BrowserTabActivity`, replace `[Enter the application Id here]` with the application ID.
</li>
</ol>
