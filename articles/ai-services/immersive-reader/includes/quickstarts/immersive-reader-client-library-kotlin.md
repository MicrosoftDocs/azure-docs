---
title: Immersive Reader Kotlin (Android) client library quickstart 
titleSuffix: Azure AI services
description: In this quickstart, you build an Android app from scratch and add the Immersive Reader API functionality.
#services: cognitive-services
author: rwallerms
manager: guillasi
ms.service: azure-ai-immersive-reader
ms.topic: include
ms.date: 09/14/2020
ms.author: rwaller
ms.custom: devx-track-js
---

[Immersive Reader](https://www.onenote.com/learningtools) is an inclusively designed tool that implements proven techniques to improve reading comprehension for new readers, language learners, and people with learning differences such as dyslexia. You can use Immersive Reader in your applications to isolate text to improve focus, display pictures for commonly used words, highlight parts of speech, read selected text out loud, translate words and phrases in real-time, and more.

In this quickstart, you build an Android app from scratch and integrate the Immersive Reader. A full working sample of this quickstart is available [on GitHub](https://github.com/microsoft/immersive-reader-sdk/tree/master/js/samples/quickstart-kotlin).

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* An Immersive Reader resource configured for Microsoft Entra authentication. Follow [these instructions](../../how-to-create-immersive-reader.md) to get set up. You'll need some of the values created here when you configure the environment properties. Save the output of your session into a text file for future reference.
* [Git](https://git-scm.com/).
* [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk).
* [Android Studio](https://developer.android.com/studio).

## Create an Android project

Start a new project in Android Studio. Source code for this example is available as part of the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk/tree/master/js/samples/quickstart-kotlin).

![New project - Kotlin](../../media/android/kotlin/android-studio-create-project.png)

In the **Choose your project** window, select **Empty Activity**, and then select **Next**.

![Empty Activity project - Kotlin](../../media/android/kotlin/android-studio-empty-activity.png)

## Configure the project

Name the project **QuickstartKotlin**, and select a location to save it. Select **Kotlin** as the programming language, and then select **Finish**.

![Configure the project - Kotlin](../../media/android/kotlin/android-studio-configure-project.png)

## Set up assets and authentication

Create a new **/assets** folder.

![Create a new assets folder - Kotlin](../../media/android/kotlin/android-studio-assets-folder.png)

 Create a file named **env** inside the assets folder. Add the following names and values, and supply values as appropriate. Don't commit this env file into source control because it contains secrets that shouldn't be made public.

> [!IMPORTANT]
> Remember to never post secrets publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md).

![Create a new env file - Kotlin](../../media/android/kotlin/android-studio-create-env-file.png)

```text
TENANT_ID=<YOUR_TENANT_ID>
CLIENT_ID=<YOUR_CLIENT_ID>
CLIENT_SECRET=<YOUR_CLIENT_SECRET>
SUBDOMAIN=<YOUR_SUBDOMAIN>
```
![Environment variables in Android Studio - Kotlin](../../media/android/kotlin/android-studio-assets-and-env-file.png)

## Add dependencies

Replace the existing dependencies in the **build.gradle** file with the following implementations to enable coroutines (asynchronous programming), gson (JSON parsing and serialization), and dotenv to reference the variables defined in the env file. You might need to sync the project again when you implement MainActivity.kt in a later step in this quickstart.

```build.gradle
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation"org.jetbrains.kotlin:kotlin-stdlib-jdk7:$kotlin_version"
    implementation 'androidx.appcompat:appcompat:1.0.2'
    implementation 'androidx.core:core-ktx:1.0.2'
    implementation 'androidx.constraintlayout:constraintlayout:1.1.3'
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.1.1"
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.1.1"
    implementation 'com.google.code.gson:gson:2.8.6'
    implementation 'io.github.cdimascio:java-dotenv:5.1.3'
    testImplementation 'junit:junit:4.12'
    androidTestImplementation 'androidx.test.ext:junit:1.1.0'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.1.1'
}
```

![App Gradle implementations- Kotlin](../../media/android/kotlin/android-studio-build-gradle.png)

## Update app strings and layout resources

Replace the content in **res/strings/strings.xml** with the following strings to be used in the app.

![App strings.xml - Kotlin](../../media/android/kotlin/android-studio-strings.png)

```strings.xml
<resources>

    <!-- Copyright (c) Microsoft Corporation. All rights reserved. -->
    <!-- Licensed under the MIT License. -->

    <string name="app_name">ImmersiveReaderSDK</string>
    <string name="geographyTitle">Geography</string>
    <string name="geographyTextEn">The study of Earth's landforms is called physical geography. Landforms can be mountains and valleys. They can also be glaciers, lakes or rivers. Landforms are sometimes called physical features. It is important for students to know about the physical geography of Earth. The seasons, the atmosphere and all the natural processes of Earth affect where people are able to live. Geography is one of a combination of factors that people use to decide where they want to live.The physical features of a region are often rich in resources. Within a nation, mountain ranges become natural borders for settlement areas. In the U.S., major mountain ranges are the Sierra Nevada, the Rocky Mountains, and the Appalachians. Fresh water sources also influence where people settle. People need water to drink. They also need it for washing. Throughout history, people have settled near fresh water. Living near a water source helps ensure that people have the water they need. There was an added bonus, too. Water could be used as a travel route for people and goods. Many Americans live near popular water sources, such as the Mississippi River, the Colorado River and the Great Lakes.Mountains and deserts have been settled by fewer people than the plains areas. However, they have valuable resources of their own.</string>
    <string name="geographyTextFr">L\'étude des reliefs de la Terre est appelée géographie physique. Les reliefs peuvent être des montagnes et des vallées. Il peut aussi s\'agira de glaciers, delacs ou de rivières. Les reliefs sont parfois appelés caractéristiques physiques. Il est important que les élèves connaissent la géographie physique de laTerre. Les saisons, l\'atmosphère et tous les processus naturels de la Terre affectent l\'endroit où les gens sont capables de vivre. La géographie est l\'un desfacteurs que les gens utilisent pour décider où ils veulent vivre. Les caractéristiques physiques d\'une région sont souvent riches en ressources. Àl\'intérieur d\'une nation, les chaînes de montagnes deviennent des frontières naturelles pour les zones de peuplement. Aux États-Unis, les principaleschaînes de montagnes sont la Sierra Nevada, les montagnes Rocheuses et les Appalaches.Les sources d\'eau douce influencent également l\'endroit où lesgens s\'installent. Les gens ont besoin d\'eau pour boire. Ils en ont aussi besoin pour se laver. Tout au long de l\'histoire, les gens se sont installés près del\'eau douce. Vivre près d\'une source d\'eau permet de s\'assurer que les gens ont l\'eau dont ils ont besoin. Il y avait un bonus supplémentaire, aussi. L\'eaupourrait être utilisée comme voie de voyage pour les personnes et les marchandises. Beaucoup d\'Américains vivent près des sources d\'eau populaires,telles que le fleuve Mississippi, le fleuve Colorado et les Grands Lacs.Mountains et les déserts ont été installés par moins de gens que les zones desplaines. Cependant, ils disposent de ressources précieuses.Les gens ont une réponse.</string>
    <string name="immersiveReaderButtonText">Immersive Reader</string>
</resources>
```

Replace the content in **res/layout/activity_main.xml** with the following XML to be used in the app. This XML is the UI layout of the app.

![App activity_main.xml - Kotlin](../../media/android/kotlin/android-studio-activity-main-xml.png)

```activity_main.xml
<?xml version="1.0" encoding="utf-8"?>

<!-- Copyright (c) Microsoft Corporation. All rights reserved. -->
<!-- Licensed under the MIT License. -->

<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#FFFFFF"
    tools:context=".MainActivity">

    <LinearLayout
        android:id="@+id/linearLayout"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:background="#FFFFFF"
        android:orientation="vertical"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.0"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_bias="0.0">

        <TextView
            android:id="@+id/Title"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginLeft="48dp"
            android:layout_marginTop="24dp"
            android:layout_marginRight="48dp"
            android:layout_marginBottom="24dp"
            android:text="@string/geographyTitle"
            android:textSize="24sp"
            android:textStyle="bold" />

        <ScrollView
            android:id="@+id/ContentPane"
            android:layout_width="match_parent"
            android:layout_height="480dp"
            android:layout_marginBottom="48dp"
            android:clipToPadding="false"
            android:fillViewport="false"
            android:paddingLeft="48dp"
            android:paddingRight="48dp"
            android:scrollbarStyle="outsideInset"
            android:visibility="visible"
            tools:visibility="visible">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:orientation="vertical">

                <TextView
                    android:id="@+id/Content1"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:background="#00FFFFFF"
                    android:text="@string/geographyTextEn"
                    android:textSize="18sp" />

                <TextView
                    android:id="@+id/Content2"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:background="#00FFFFFF"
                    android:text="@string/geographyTextFr"
                    android:textSize="18sp" />

            </LinearLayout>

        </ScrollView>

        <Button
            android:id="@+id/LaunchImmersiveReaderButton"
            android:layout_width="match_parent"
            android:layout_height="60dp"
            android:layout_marginLeft="40dp"
            android:layout_marginRight="40dp"
            android:layout_marginBottom="80dp"
            android:text="@string/immersiveReaderButtonText"
            android:textAllCaps="false"
            android:textSize="24sp"
            android:visibility="visible"
            tools:visibility="visible" />

    </LinearLayout>

</androidx.constraintlayout.widget.ConstraintLayout>
```

## Set up the app Kotlin code JavaScript interface

In the **/Java/com.example.quickstartkotlin** folder, create a new Kotlin class and name it **WebAppInterface**. Then add the following code to it. This code enables the app to interface with JavaScript functions in HTML that will be added in a later step.

![com.example.quickstartkotlin folder - Kotlin](../../media/android/kotlin/android-studio-com-folder.png)

![WebAppInterface - Kotlin](../../media/android/kotlin/android-studio-web-app-interface.png)

```WebAppInterface.kt
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

package com.example.quickstartkotlin

import android.content.Context
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.LinearLayout
import android.widget.Toast

class WebAppInterface(private val mContext: Context, var parentLayout: LinearLayout, var webView: WebView) {

    // Show a toast from html.
    @JavascriptInterface
    fun showToast(toast: String) {
        Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show()
    }

    // Exit the Immersive Reader.
    @JavascriptInterface
    fun immersiveReaderExit() {
        webView.post(Runnable { destroyWebView(parentLayout, webView) })

        // Any additional functionality may be added here.
        Toast.makeText(mContext, "The Immersive Reader has been closed!", Toast.LENGTH_SHORT).show()
    }

    // Disposes of the WebView when the back arrow is tapped.
    private fun destroyWebView(parentLayout: LinearLayout, webView: WebView) {

        // Removes the WebView from its parent view before doing anything.
        parentLayout.removeView(webView)

        // Cleans things up before destroying the WebView.
        webView.clearHistory()
        webView.clearCache(true)
        webView.loadUrl("about:blank")
        webView.onPause()
        webView.removeAllViews()
        webView.pauseTimers()
        webView.destroy()
    }
}
```

## Set up the app Kotlin code Main Activity

In the **/Java/com.example.quickstartkotlin** folder, you'll see an existing **MainActivity.kt** Kotlin class file. This file is where the app logic is authored. Replace its contents with the following code:

```MainActivity.kt
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

package com.example.quickstartkotlin

import android.app.Activity
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.CookieManager
import android.webkit.WebView
import android.widget.Button
import android.webkit.WebViewClient
import android.widget.LinearLayout
import android.widget.TextView
import com.google.gson.*
import io.github.cdimascio.dotenv.dotenv
import java.io.IOException
import java.io.*
import java.net.HttpURLConnection
import java.net.HttpURLConnection.HTTP_OK
import java.net.URL
import kotlinx.coroutines.*
import org.json.JSONObject
import java.util.*

// This sample app uses the Dotenv. It's a module that loads environment variables from a .env file to better manage secrets.
// https://github.com/cdimascio/java-dotenv
// Be sure to add a "env" file to the /assets folder.
// Instead of '.env', use 'env'.

class MainActivity : AppCompatActivity() {
    private val dotEnv = dotenv {
        directory = "/assets"
        filename = "env"
        ignoreIfMalformed = true
        ignoreIfMissing = true
    }

    private lateinit var contextualWebView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        this.supportActionBar!!.hide()
        setContentView(R.layout.activity_main)
        val immersiveReaderButton = findViewById<Button>(R.id.LaunchImmersiveReaderButton)
        immersiveReaderButton.setOnClickListener { GlobalScope.launch { handleLoadImmersiveReaderWebView() } }
    }

    // Assigns values to the objects sent to the Immersive Reader SDK,
    // acquires the token and authorizes the app, then launches
    // the Web View to get the response and load the Immersive Reader
    // when the button is clicked in HTML.
    private suspend fun handleLoadImmersiveReaderWebView() {
        val exampleActivity = this
        val subdomain = dotEnv["SUBDOMAIN"]
        val irTitle = findViewById<TextView>(R.id.Title)
        val irText1 = findViewById<TextView>(R.id.Content1)
        val irText2 = findViewById<TextView>(R.id.Content2)

        // The content of the request that's shown in the Immersive Reader.
        // This basic example contains chunks of two different languages.
        val chunk1 = Chunk()
        chunk1.content = irText1.text.toString()
        chunk1.lang = "en"
        chunk1.mimeType = "text/plain"

        val chunk2 = Chunk()
        chunk2.content = irText2.text.toString()
        chunk2.lang = "fr"
        chunk2.mimeType = "text/plain"

        val chunks = ArrayList<Chunk>()
        chunks.add(chunk1)
        chunks.add(chunk2)

        val content = Content()
        content.title = irTitle.text.toString()
        content.chunks = chunks

        // Options may be assigned values here (e.g. options.uiLang = "en").
        val options = Options()

        var token: String

        runBlocking{
            val resp = async { getImmersiveReaderTokenAsync() }
            token = resp.await()
            val jsonResp = JSONObject(token)
            loadImmersiveReaderWebView(exampleActivity, jsonResp.getString("access_token"), subdomain, content, options)
        }
    }

    // The next two functions get the token from the Immersive Reader SDK
    // and authorize the app.
    private suspend fun getImmersiveReaderTokenAsync(): String {
        return getToken()
    }

    @Throws(IOException::class)
    fun getToken(): String {
        val clientId = dotEnv["CLIENT_ID"]
        val clientSecret = dotEnv["CLIENT_SECRET"]
        val tenantId = dotEnv["TENANT_ID"]
        val tokenUrl = URL("https://login.windows.net/$tenantId/oauth2/token")
        val form = "grant_type=client_credentials&resource=https://cognitiveservices.azure.com/&client_id=$clientId&client_secret=$clientSecret"

        val connection = tokenUrl.openConnection() as HttpURLConnection
        connection.requestMethod = "POST"
        connection.setRequestProperty("content-type", "application/x-www-form-urlencoded")
        connection.doOutput = true

        val writer = DataOutputStream(connection.outputStream)
        writer.writeBytes(form)
        writer.flush()
        writer.close()

        val responseCode = connection.responseCode

        if (responseCode == HTTP_OK) {
            val readerIn = BufferedReader(InputStreamReader(connection.inputStream))
            var inputLine = readerIn.readLine()
            val response = StringBuffer()

            do {
                response.append(inputLine)
            } while (inputLine.length < 0)
            readerIn.close()

            // Return token
            return response.toString()
        } else {
            val responseError = Error(code = "BadRequest", message = "There was an error getting the token.")
            throw IOException(responseError.toString())
        }
    }

    // To be assigned values and sent to the Immersive Reader SDK
    class Chunk(var content: String? = null,
                var lang: String? = null,
                var mimeType: String? = null)

    class Content(var title: String? = null,
                  var chunks: List<Chunk>? = null)

    class Message(var cogSvcsAccessToken: String? = null,
                  var cogSvcsSubdomain: String? = null,
                  var content: Content? = null,
                  var launchToPostMessageSentDurationInMs: Int? = null,
                  var options: Options? = null)

    // Only includes Immersive Reader options relevant to Android apps.
    // For a complete list, visit https://learn.microsoft.com/azure/ai-services/immersive-reader/reference
    class Options(var uiLang: String? = null, // Language of the UI, e.g. en, es-ES (optional). Defaults to browser language if not specified.
                  var timeout: Int? = null, // Duration (in milliseconds) before launchAsync fails with a timeout error (default is 15000 ms).
                  var uiZIndex: Int? = null, // Z-index of the iframe that will be created (default is 1000)
                  var onExit: (() -> Any)? = null, // Executes a callback function when the Immersive Reader exits
                  var customDomain: String? = null, // Reserved for internal use. Custom domain where the Immersive Reader webapp is hosted (default is null).
                  var allowFullscreen: Boolean? = null, // The ability to toggle fullscreen (default is true).
                  var hideExitButton: Boolean? = null // Whether or not to hide the Immersive Reader's exit button arrow (default is false). This should only be true if there is an alternative mechanism provided to exit the Immersive Reader (e.g a mobile toolbar's back arrow).
    )

    class Error(var code: String? = null,
                var message: String? = null)

    // A custom Web View component that launches inside the app
    @Throws(IOException::class)
    fun loadImmersiveReaderWebView(
        exampleActivity: Activity,
        token: String,
        subdomain: String?,
        content: Content,
        options: Options
    ) {
        val startPostMessageSentDurationInMs = Date()

        // Populate the message
        val messageData = Message()
        messageData.cogSvcsAccessToken = token
        messageData.cogSvcsSubdomain = subdomain
        messageData.content = content
        messageData.options = options

        GlobalScope.launch {
            withContext(Dispatchers.Main) {
                contextualWebView = WebView(exampleActivity)
                val parentLayout = findViewById<LinearLayout>(R.id.linearLayout)
                val contextualWebViewSettings = contextualWebView.settings

                contextualWebViewSettings.allowContentAccess = true
                contextualWebViewSettings.builtInZoomControls = true
                contextualWebViewSettings.javaScriptEnabled = true
                contextualWebViewSettings.loadsImagesAutomatically = true
                contextualWebViewSettings.loadWithOverviewMode = true
                contextualWebViewSettings.useWideViewPort = true
                contextualWebViewSettings.userAgentString = "Android"
                contextualWebViewSettings.domStorageEnabled = true

                contextualWebViewSettings.setAppCacheEnabled(false)
                contextualWebViewSettings.setSupportZoom(true)
                contextualWebView.setInitialScale(1)

                // Enables WebView Cookies
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
                    CookieManager.getInstance().setAcceptThirdPartyCookies(contextualWebView, true)
                } else {
                    CookieManager.getInstance().setAcceptCookie(true)
                }

                val contextualWebViewLayout = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT)
                parentLayout.addView(contextualWebView, 0, contextualWebViewLayout)

                // This is required to launch the WebView *inside* the host application.
                contextualWebView.webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                        view.loadUrl(url)
                        return true
                    }

                    // Send message JSON object to Immersive Reader html
                    override fun onPageFinished(view: WebView, url: String) {
                        val endPostMessageSentDurationInMs = Date()
                        val postMessageSentDurationInMs = (endPostMessageSentDurationInMs.time - startPostMessageSentDurationInMs.time).toInt()

                        // Updates launchToPostMessageSentDurationInMs
                        messageData.launchToPostMessageSentDurationInMs = postMessageSentDurationInMs

                        // Serializes message data class to JSON
                        val gson = Gson()
                        val message = gson.toJson(messageData)

                        // Calls the handleLaunchImmersiveReader function in HTML
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
                            view.evaluateJavascript("handleLaunchImmersiveReader($message)", null)
                        } else {
                            view.loadUrl("javascript:handleLaunchImmersiveReader($message)")
                        }

                        // Sets the visibility of the WebView after the function has been called.
                        view.visibility = WebView.VISIBLE
                    }
                }

                // This is where the WebAppInterface Class is used.
                // Affords a way for JavaScript to work with the app directly from
                // the Web View's HTML.
                val jsInterface = WebAppInterface(exampleActivity, parentLayout, contextualWebView)
                contextualWebView.addJavascriptInterface(jsInterface, "Android")
                contextualWebView.loadUrl("file:///android_asset/immersiveReader.html")
            }
        }
    }
}
```

## Add the app HTML to the web view

The web view implementation needs HTML to work. Right-click the **/assets** folder, create a new file, and name it **immersiveReader.html**.

![Create a new HTML file - Kotlin](../../media/android/kotlin/android-studio-immersive-reader-html.png)

![HTML asset location - Kotlin](../../media/android/kotlin/android-studio-immersive-reader-html-assets.png)

Add the following HTML and JavaScript. This code adds the Immersive Reader SDK to the app and uses it to open the Immersive Reader by using the app code we've written.

```immersiveReader.html
<!-- Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License. -->

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <script type="text/javascript" src="https://ircdname.azureedge.net/immersivereadersdk/immersive-reader-sdk.1.4.0.js"></script>
</head>
<body>
<script type="text/javascript">
        function handleLaunchImmersiveReader(message) {
            if (!message) {
                Android.showToast('Message is null or undefined!');
            } else {
                // Learn more about chunk usage and supported MIME types https://learn.microsoft.com/azure/ai-services/immersive-reader/reference#chunk
                var data = {
                    title: message.content.title,
                    chunks: message.content.chunks
                };

                // A simple declarative function used to close the Immersive Reader WebView via @JavaScriptInterface
                var exitCallback = function() {
                    Android.immersiveReaderExit();
                }

                // Learn more about options https://learn.microsoft.com/azure/ai-services/immersive-reader/reference#options
                var options = {
                    onExit: exitCallback,
                    uiZIndex: 2000
                };

                // Use the JavaScript SDK to launch the Immersive Reader.
                ImmersiveReader.launchAsync(message.cogSvcsAccessToken, message.cogSvcsSubdomain, data, options);
            }
        }
    </script>
</body>
</html>
```

## Set up app permissions

![AndroidManifest - Kotlin](../../media/android/kotlin/android-studio-android-manifest-xml.png)

Because the application needs to make network calls to the Immersive Reader SDK to function, we need to ensure the app permissions are configured to allow network access. Replace the content of **/manifests/AndroidManifest.xml** with the following XML:

```AndroidManifest.xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.quickstartkotlin">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

## Run the app

Use Android Studio to run the app on a device emulator. When you select **Immersive Reader**, the Immersive Reader opens with the content on the app.

![Immersive Reader - Kotlin](../../media/android/kotlin/android-studio-device-emulator.png)

## Next steps

> [!div class="nextstepaction"]
> [Create a resource and configure Microsoft Entra ID](../../how-to-create-immersive-reader.md)
