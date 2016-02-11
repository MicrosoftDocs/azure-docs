<properties
	pageTitle="Azure Active Directory B2C preview: Call a web API from an Android application | Microsoft Azure"
	description="This article will show you how to create an Android "to-do list" app that calls a Node.js web API by using OAuth 2.0 bearer tokens. Both the Android app and the web API use Azure Active Directory B2C to manage user identities and authenticate users."
	services="active-directory-b2c"
	documentationCenter="android"
	authors="brandwe"
	manager="msmbaldwin"
	editor=""/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="java"
	ms.topic="article"
	ms.date="11/19/2015"
	ms.author="brandwe"/>

# Azure AD B2C preview: Call a web API from an Android application

By using Azure Active Directory (Azure AD) B2C, you can add powerful self-service identity management features to your Android apps and web APIs in a few short steps. This article will discuss how to create an Android "to-do list" app that calls a Node.js web API by using OAuth 2.0 bearer tokens. Both the Android app and web API use Azure AD B2C to manage user identities and authenticate users.

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

> [AZURE.NOTE]
	This Quickstart requires that you have a web API protected by Azure AD with B2C in order to work fully. We have built one for both .NET and Node.js for you to use. This walk-through assumes that the Node.js web API sample is configured. For more, see the [Azure AD B2C web API for Node.js tutorial](active-directory-b2c-devquickstarts-api-node.md).


> [AZURE.NOTE]
	This article does not cover how to implement sign-in, sign-up and profile management by using Azure AD B2C. It focuses on how to call web APIs after the user is authenticated. If you haven't already, you should start with the [.NET web app getting started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md) to learn about the basics of Azure AD B2C.

For Android clients that need to access protected resources, Azure AD provides the Active Directory Authentication Library (ADAL). The sole purpose of ADAL is to make it easy for your app to get access tokens. To demonstrate how easy it is, in this guide we’ll build an Android to-do list application that:

-	Gets access tokens that call a to-do list API by using the [OAuth 2.0 authentication protocol](https://msdn.microsoft.com/library/azure/dn645545.aspx).
-	Gets users' to-do lists.
-	Signs out users.

## Get an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant. A directory is a container for all your users, apps, groups, and more.  If you don't have one already, [create a B2C directory](active-directory-b2c-get-started.md) before you continue in this guide.

## Create an application

Next, you need to create an app in your B2C directory. This gives Azure AD information that it needs to securely communicate with your app. Both the app and web API are represented by a single **Application ID** in this case, because they comprise one logical app. To create an app, follow [these instructions](active-directory-b2c-app-registration.md). Be sure to:

- Include a **web app**/**web API** in the application.
- Enter `urn:ietf:wg:oauth:2.0:oob` as a **Reply URL**. It is the default URL for this code sample.
- Create an **Application secret** for your application and copy it. You will need it later.
- Copy the **Application ID** that is assigned to your app. You will also need this later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Create your policies

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-policy](../../includes/active-directory-b2c-devquickstarts-policy.md)]

In Azure AD B2C, every user experience is defined by a [policy](active-directory-b2c-reference-policies.md).  This app contains three
identity experiences - sign-up, sign-in, and sign-in with Facebook.  You will need to create one policy of each type, as described in the [policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy). When you create your three policies, be sure to:

- Choose the **Display name** and other sign-up attributes in your sign-up policy.
- Choose the **Display name** and **Object ID** application claims in every policy. You can choose other claims as well.
- Copy the **Name** of each policy after you create it. It should have the prefix `b2c_1_`.  You'll need these policy names later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-policy](../../includes/active-directory-b2c-devquickstarts-policy.md)]

After you create the three policies, you're ready to build your app.

Note that this article does not cover how to use the policies you just created. To learn about how policies work in Azure AD B2C,
start with the [.NET web app getting started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md).

## Download the code

The code for this tutorial [is maintained on GitHub](https://github.com/AzureADQuickStarts/B2C-NativeClient-Android). To build the sample as you go, you can [download a skeleton project as a .zip file](https://github.com/AzureADQuickStarts/B2C-NativeClient-Android/archive/skeleton.zip). You can also clone the skeleton:

```
git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-NativeClient-Android.git
```

> [AZURE.NOTE] **You are required to downloading the skeleton to complete this tutorial.** Because of the complexity of implementing a fully functioning application on Android, the skeleton has UX code that will run after you have completed this tutorial. This is a time-saving measure for the developer. The UX code is not germane to the topic of how to add B2C to an Android application.

The completed app is also [available as a .zip file](https://github.com/AzureADQuickStarts/B2C-NativeClient-Android/archive/complete.zip) or on the `complete` branch of the same repository.

To build with Maven, you can use `pom.xml` at the top level.

  1. Follow the steps in [the prerequisites section to set up Maven for android](https://github.com/MSOpenTech/azure-activedirectory-library-for-android/wiki/Setting-up-maven-environment-for-Android).
  2. Set up an emulator with SDK 21.
  3. Go to the root folder where you cloned the repo.
  4. Run the command `mvn clean install`.
  5. Change the directory to the Quickstart sample `cd samples\hello`.
  6. Run the command `mvn android:deploy android:run`.

You should see the app launch. Enter test user credentials to try it.

Java Archive (JAR) packages will be also submitted beside the Android Archive (AAR) package.

## Download the Android ADAL and add it to your Android Studio workspace

You have options for how to use this library in your Android project:

* You can use the source code to import the library into Eclipse and link to your application.
* If you use Android Studio, you can use the AAR package format and reference the binaries.

### Option 1: Binaries via Gradle (recommended)

You can get the binaries from the Maven central repo. The AAR package can be included in your project in Android Studio (for example, in `build.gradle`) this way:

```gradle
repositories {
    mavenCentral()
    flatDir {
        dirs 'libs'
    }
    maven {
        url "YourLocalMavenRepoPath\\.m2\\repository"
    }
}
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile('com.microsoft.aad:adal:2.0.1-alpha') {
        exclude group: 'com.android.support'
    } // Recent version is 2.0.1-alpha
}
```

### Option 2: AAR via Maven

If you use the `m2e` plug-in in Eclipse, you can specify the dependency in your `pom.xml` file:

```xml
<dependency>
    <groupId>com.microsoft.aad</groupId>
    <artifactId>adal</artifactId>
    <version>2.0.1-alpha</version>
    <type>aar</type>
</dependency>
```

### Option 3: Source via Git (last resort)

To get the source code of the SDK via Git, enter:

    git clone git@github.com:AzureAD/azure-activedirectory-library-for-android.git
    cd ./azure-activedirectory-library-for-android/src

Use the branch "convergence."

## Set up your configuration file

Use the configuration that you set up earlier in the B2C portal to configure the Android project.

Open `helpes/Constants.java` and fill in the values for the following:

```

package com.microsoft.aad.taskapplication.helpers;

import com.microsoft.aad.adal.AuthenticationResult;

public class Constants {

    public static final String SDK_VERSION = "1.0";
    public static final String UTF8_ENCODING = "UTF-8";
    public static final String HEADER_AUTHORIZATION = "Authorization";
    public static final String HEADER_AUTHORIZATION_VALUE_PREFIX = "Bearer ";

    // -------------------------------AAD
    // PARAMETERS----------------------------------
    public static String AUTHORITY_URL = "https://login.microsoftonline.com/hypercubeb2c.onmicrosoft.com/";
    public static String CLIENT_ID = "<your application id>";
    public static String[] SCOPES = {"<your application id>"};
    public static String[] ADDITIONAL_SCOPES = {""};
    public static String REDIRECT_URL = "<redirect uri>";
    public static String CORRELATION_ID = "";
    public static String USER_HINT = "";
    public static String EXTRA_QP = "";
    public static String FB_POLICY = "B2C_1_<your policy>";
    public static String EMAIL_SIGNIN_POLICY = "B2C_1_<your policy>";
    public static String EMAIL_SIGNUP_POLICY = "B2C_1_<your policy>";
    public static boolean FULL_SCREEN = true;
    public static AuthenticationResult CURRENT_RESULT = null;
    // Endpoint we are targeting for the deployed WebAPI service
    public static String SERVICE_URL = "http://localhost:3000/tasks";

    // ------------------------------------------------------------------------------------------

    static final String TABLE_WORKITEM = "WorkItem";
    public static final String SHARED_PREFERENCE_NAME = "com.example.com.test.settings";


}


```
`SCOPES`: The scopes that you pass to the server that you want to request from the server when a user signs in. For B2C preview, you pass `client_id`. However, this is expected to change to `read scopes` in the future. This document will be updated when that occurs.
`ADDITIONAL_SCOPES`: Additional scopes you may want to use for your application. They are expected to be used in the future.
`CLIENT_ID`: The Application ID you got from the portal.
`REDIRECT_URL`: The redirect where you expect the token to be posted back.
`EXTRA_QP`: Anything extra you want to pass to the server in a URL-encoded format.
`FB_POLICY`: The policy you are invoking. This is the most important part for this walk-through.
`EMAIL_SIGNIN_POLICY`: The policy you are invoking. This is the most important part for this walk-through.
`EMAIL_SIGNUP_POLICY`: The policy you are invoking. This is the most important part for this walk-through.

## Add references to Android ADAL to your project

> [AZURE.NOTE]	ADAL for Android uses an intent-based model to invoke authentication. Intents "lay over" the app to do work. This entire sample, and all ADAL for Android, centers on how to manage intents and pass information between them.

First, tell Android about the layout of your application, including the intents you want to use. These intents will be explained in detail later in this tutorial.

Update your project's `AndroidManifest.xml` file to include all of your intents:

```
   <?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.microsoft.aad.taskapplication"
    android:versionCode="1"
    android:versionName="1.0" >

    <uses-sdk
        android:minSdkVersion="11"
        android:targetSdkVersion="19" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme" >
        <activity
            android:name="com.microsoft.aad.adal.AuthenticationActivity"
            android:configChanges="orientation|keyboardHidden|screenSize"
            android:exported="true"
            android:label="@string/title_login_hello_app" >
        </activity>
        <activity
            android:name="com.microsoft.aad.taskapplication.LoginActivity"
            android:configChanges="orientation|keyboardHidden|screenSize"
            android:label="@string/app_name" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <activity
            android:name="com.microsoft.aad.taskapplication.UsersListActivity"
            android:label="@string/title_activity_feed" >
        </activity>
        <activity
            android:name="com.microsoft.aad.taskapplication.SettingsActivity"
            android:label="@string/title_activity_settings" >
        </activity>
        <activity
            android:name="com.microsoft.aad.taskapplication.AddTaskActivity"
            android:label="@string/title_activity_settings" >
        </activity>
        <activity
            android:name="com.microsoft.aad.taskapplication.ToDoActivity"
            android:label="@string/app_name" >
        </activity>
    </application>

</manifest>    
```

As you can see, you define five activities. You will use all of these.

`AuthenticationActivity`: This comes from ADAL, and it provides the sign-in web view.

`LoginActivity`: This displays your sign-in policies and the buttons for each policy.

`SettingsActivity`: You change the app settings at runtime by using this.

`AddTaskActivity`: You add tasks to your REST API protected by Azure AD by using this.

`ToDoActivity`: This is the main activity that displays tasks.

## Create the sign-in activity

Create a main activity and call it `LoginActivity`.

Create a file called `LoginActivity.java`.

You need to initialize the activity and add some buttons that will control your UI. This is familiar to you if you've written Android code before:

```
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.microsoft.aad.adal.AuthenticationContext;
import com.microsoft.aad.taskapplication.helpers.Constants;
import com.microsoft.aad.taskapplication.helpers.WorkItemAdapter;

/**
 * Created by brwerner on 9/17/15.
 */
public class LoginActivity extends Activity {

    private final static String TAG = "ToDoActivity";

    private AuthenticationContext mAuthContext;

    /**
     * Adapter to sync the items list with the view
     */
    private WorkItemAdapter mAdapter = null;

    /**
     * Show this dialog when activity first launches to check if user has login
     * or not.
     */
    private ProgressDialog mLoginProgressDialog;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signin);
        Toast.makeText(getApplicationContext(), TAG + "LifeCycle: OnCreate", Toast.LENGTH_SHORT)
                .show();

        Button button = (Button) findViewById(R.id.signin_facebook);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(LoginActivity.this, ToDoActivity.class);
                intent.putExtra("thePolicy", Constants.FB_POLICY);
                startActivity(intent);

            }
        });

        button = (Button) findViewById(R.id.signin_email);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(LoginActivity.this, ToDoActivity.class);
                intent.putExtra("thePolicy", Constants.EMAIL_SIGNIN_POLICY);
                startActivity(intent);

            }
        });

        button = (Button) findViewById(R.id.signup_email);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(LoginActivity.this, ToDoActivity.class);
                intent.putExtra("thePolicy", Constants.EMAIL_SIGNUP_POLICY);
                startActivity(intent);

            }
        });

    }

}


```
What we've done is create buttons that call our ToDoActivity intent (which will call ADAL when we need a token) with our own Activity as a reference and an extra parameter. This extra parameter is passed by the `intent.putExtra()` method. You see here we define "thePolicy" as what you specified in `Constants.java`. This allows the intent to know what policy to invoke during authentication.

### Step 9: Create the Settings Activity

This is just an Activity that populates our Settings UI.

Create a file called `SettingsActivity.java`

Pretty simple CRUD here:

```
 package com.microsoft.aad.taskapplication;

import android.app.Activity;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.Switch;
import android.widget.TextView;

import com.microsoft.aad.taskapplication.helpers.Constants;

/**
 * Settings page to try broker by options
 */
public class SettingsActivity extends Activity {

	//private CheckBox checkboxAskBroker, checkboxCheckBroker;
    private Switch fullScreenSwitch;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_settings);

        loadSettings();
//		checkboxAskBroker = (CheckBox) findViewById(R.id.askInstall);
//		checkboxCheckBroker = (CheckBox) findViewById(R.id.useBroker);

        Button save = (Button) findViewById(R.id.settingsSave);

        save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                TextView textView = (TextView)findViewById(R.id.authority);
                Constants.AUTHORITY_URL = textView.getText().toString();

                textView = (TextView)findViewById(R.id.resource);
            //    Constants.SCOPES = textView.getText().toString();

                textView = (TextView)findViewById(R.id.clientId);
                Constants.CLIENT_ID = textView.getText().toString();

                textView = (TextView)findViewById(R.id.extraQueryParameters);
                Constants.EXTRA_QP = textView.getText().toString();

                textView = (TextView)findViewById(R.id.redirectUri);
                Constants.REDIRECT_URL = textView.getText().toString();

                textView = (TextView)findViewById(R.id.serviceUrl);
                Constants.SERVICE_URL = textView.getText().toString();

                textView = (TextView)findViewById(R.id.serviceUrl);
                textView.setText(Constants.SERVICE_URL);

                textView = (TextView)findViewById(R.id.fb_signin);
                textView.setText(Constants.FB_POLICY);

                textView = (TextView)findViewById(R.id.email_signin);
                textView.setText(Constants.EMAIL_SIGNIN_POLICY);

                textView = (TextView)findViewById(R.id.email_signup);
                textView.setText(Constants.EMAIL_SIGNUP_POLICY);

                textView = (TextView)findViewById(R.id.correlationId);
                textView.setText(Constants.CORRELATION_ID);

                fullScreenSwitch = (Switch)findViewById(R.id.fullScreen);
                Constants.FULL_SCREEN = fullScreenSwitch.isChecked();

                finish();
            }
        });


	}

    private void loadSettings() {
        TextView textView = (TextView)findViewById(R.id.authority);
        textView.setText(Constants.AUTHORITY_URL);
        textView = (TextView)findViewById(R.id.resource);
        textView.setText(Constants.SCOPES[0]);
        textView = (TextView)findViewById(R.id.clientId);
        textView.setText(Constants.CLIENT_ID);
        textView = (TextView)findViewById(R.id.extraQueryParameters);
        textView.setText(Constants.EXTRA_QP);
        textView = (TextView)findViewById(R.id.redirectUri);
        textView.setText(Constants.REDIRECT_URL);
        textView = (TextView)findViewById(R.id.serviceUrl);
        textView.setText(Constants.SERVICE_URL);
        textView = (TextView)findViewById(R.id.fb_signin);
        textView.setText(Constants.FB_POLICY);
        textView = (TextView)findViewById(R.id.email_signin);
        textView.setText(Constants.EMAIL_SIGNIN_POLICY);
        textView = (TextView)findViewById(R.id.email_signup);
        textView.setText(Constants.EMAIL_SIGNUP_POLICY);
        textView = (TextView)findViewById(R.id.correlationId);
        textView.setText(Constants.CORRELATION_ID);

        fullScreenSwitch = (Switch)findViewById(R.id.fullScreen);
        fullScreenSwitch.setChecked(Constants.FULL_SCREEN);
    }

	private void saveSettings(String key, boolean value) {
		SharedPreferences prefs = SettingsActivity.this.getSharedPreferences(
				Constants.SHARED_PREFERENCE_NAME, Activity.MODE_PRIVATE);
		Editor prefsEditor = prefs.edit();
		prefsEditor.putBoolean(key, value);
		prefsEditor.commit();
	}
}
```

### Step 10: Create the AddTask Activity

This will allow us to add a Task to our REST API endpoint. Again, rather simple.

Create a file called `AddTaskActivity.java`

And write:

```
package com.microsoft.aad.taskapplication;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.microsoft.aad.taskapplication.helpers.Constants;
import com.microsoft.aad.taskapplication.helpers.TodoListHttpService;

public class AddTaskActivity extends Activity {

    EditText textField;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_task);
        textField = (EditText) findViewById(R.id.taskToAdd);
        Button button = (Button) findViewById(R.id.postTaskbutton);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (textField.getText().toString() != null
                        && !textField.getText().toString().trim().isEmpty()
                        && Constants.CURRENT_RESULT != null) {

                    TodoListHttpService service = new TodoListHttpService();
                    try {
                        service.addItem(textField.getText().toString(), Constants.CURRENT_RESULT.getAccessToken());
                    } catch (Exception e) {
                        SimpleAlertDialog.showAlertDialog(getApplicationContext(), "Exception caught", e.getMessage());
                    }
                    finish();
                }
            }
        });
    }

}

```

### Step 11: Create the ToDoList Activity

Now we have the most important Activity, one that allows us to get a token from Azure AD for policy and then use that token to call the Task REST API server.

Create a file called `ToDoActivity.java`

Write the following (I'll explain the calls afterwards):

```

package com.microsoft.aad.taskapplication;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.microsoft.aad.adal.AuthenticationCallback;
import com.microsoft.aad.adal.AuthenticationContext;
import com.microsoft.aad.adal.AuthenticationResult;
import com.microsoft.aad.adal.AuthenticationSettings;
import com.microsoft.aad.adal.UserIdentifier;
import com.microsoft.aad.adal.PromptBehavior;
import com.microsoft.aad.taskapplication.helpers.Constants;
import com.microsoft.aad.taskapplication.helpers.InMemoryCacheStore;
import com.microsoft.aad.taskapplication.helpers.TodoListHttpService;
import com.microsoft.aad.taskapplication.helpers.Utils;
import com.microsoft.aad.taskapplication.helpers.WorkItemAdapter;


import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ToDoActivity extends Activity {



    private final static String TAG = "ToDoActivity";

    private AuthenticationContext mAuthContext;
    private static AuthenticationResult sResult;

    /**
     * Adapter to sync the items list with the view
     */
    private WorkItemAdapter mAdapter = null;

    /**
     * Show this dialog when activity first launches to check if user has login
     * or not.
     */
    private ProgressDialog mLoginProgressDialog;


    /**
     * Initializes the activity
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list_todo_items);
        CookieSyncManager.createInstance(getApplicationContext());
        Toast.makeText(getApplicationContext(), TAG + "LifeCycle: OnCreate", Toast.LENGTH_SHORT)
                .show();

        // Clear previous sessions
        clearSessionCookie();
        try {
            // Provide key info for Encryption
            if (Build.VERSION.SDK_INT < 18) {
                Utils.setupKeyForSample();
            }

        Button button = (Button) findViewById(R.id.addTaskButton);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ToDoActivity.this, AddTaskActivity.class);
                startActivity(intent);
            }
        });

        button = (Button) findViewById(R.id.appSettingsButton);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ToDoActivity.this, SettingsActivity.class);
                startActivity(intent);

            }
        });

        button = (Button) findViewById(R.id.switchUserButton);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ToDoActivity.this, LoginActivity.class);
                startActivity(intent);

            }
        });


        final TextView name = (TextView)findViewById(R.id.userLoggedIn);


        mLoginProgressDialog = new ProgressDialog(this);
        mLoginProgressDialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        mLoginProgressDialog.setMessage("Login in progress...");
        mLoginProgressDialog.show();
        // Ask for token and provide callback
        try {
            mAuthContext = new AuthenticationContext(ToDoActivity.this, Constants.AUTHORITY_URL,
                    false);
            String policy = getIntent().getStringExtra("thePolicy");

            if(Constants.CORRELATION_ID != null &&
                    Constants.CORRELATION_ID.trim().length() !=0){
                mAuthContext.setRequestCorrelationId(UUID.fromString(Constants.CORRELATION_ID));
            }

            AuthenticationSettings.INSTANCE.setSkipBroker(true);

            mAuthContext.acquireToken(ToDoActivity.this, Constants.SCOPES, Constants.ADDITIONAL_SCOPES, policy, Constants.CLIENT_ID,
                    Constants.REDIRECT_URL, getUserInfo(), PromptBehavior.Always,
                    "nux=1&" + Constants.EXTRA_QP,
                    new AuthenticationCallback<AuthenticationResult>() {

                        @Override
                        public void onError(Exception exc) {
                            if (mLoginProgressDialog.isShowing()) {
                                mLoginProgressDialog.dismiss();
                            }
                            SimpleAlertDialog.showAlertDialog(ToDoActivity.this,
                                    "Failed to get token", exc.getMessage());
                        }

                        @Override
                        public void onSuccess(AuthenticationResult result) {
                            if (mLoginProgressDialog.isShowing()) {
                                mLoginProgressDialog.dismiss();
                            }

                            if (result != null && !result.getToken().isEmpty()) {
                                setLocalToken(result);
                                updateLoggedInUser();
                                getTasks();
                                ToDoActivity.sResult = result;
                                Toast.makeText(getApplicationContext(), "Token is returned", Toast.LENGTH_SHORT)
                                        .show();

                                if (sResult.getUserInfo() != null) {
                                    name.setText(result.getUserInfo().getDisplayableId());
                                    Toast.makeText(getApplicationContext(),
                                            "User:" + sResult.getUserInfo().getDisplayableId(), Toast.LENGTH_SHORT)
                                            .show();
                                }
                            } else {
                                //TODO: popup error alert
                            }
                        }
                    });
        } catch (Exception e) {
            SimpleAlertDialog.showAlertDialog(ToDoActivity.this, "Exception caught", e.getMessage());
        }
        Toast.makeText(ToDoActivity.this, TAG + "done", Toast.LENGTH_SHORT).show();
    } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }}

```


 You may notice that this relies on methods we haven't written yet, such as `updateLoggedInUser()`, `clearSessionCookie()` and `getTasks()`. We'll write those below.	You can safely ignore the errors in Android Studio for now.

Explanation of the parameters:

  * ***SCOPES*** is required and is the scopes you are trying to request access for. For the B2C preview this is the same as the Clientid but will change in the future.
  * ***POLICY*** is the policy for while you wish to authenticate the user.
  * ***CLIENT_ID*** is required and comes from the AzureAD Portal.
  * You can setup redirectUri as your packagename. It is not required to be provided for the acquireToken call.
  * ***getUserInfo()*** is the way we look up if the user is already in the cache and prompt the user if they are not found or the access token is invalid. We write this method below.
  * ***PromptBehavior.always*** helps to ask for credentials to skip cache and cookie.
  * ***Callback*** will be called after authorization code is exchanged for a token.

  The Callback will have an object of AuthenticationResult which has accesstoken, date expired, and idtoken info.

> [AZURE.NOTE]	Microsoft Intune's Company portal app provides the broker component and may be installed on the user's device. Developers should be prepared to allow for it's use as it provides SSO across all applications on the device. ADAL for Android will use the broker account if there is one user account created in the Authenticator. To use the broker, the developer needs to register a special redirectUri for broker usage. RedirectUri is in the format of msauth://packagename/Base64UrlencodedSignature. You can get your redirecturi for your app using the script `brokerRedirectPrint.ps1` or use API call `mContext.getBrokerRedirectUri()`. The signature is related to your signing certificates from the Google Play store.

 A Developer can skip the broker user with:

    ```java
     AuthenticationSettings.Instance.setSkipBroker(true);
    ```
> [AZURE.NOTE] In order to reduce the complexity of this B2C Quickstart, we have opted in our sample to skip the broker.

Next, let's create some helper methods that will get the token alone during our authentication calls to the Task API.

**In the same file** called `ToDoActivity.java`

```
    private void getToken(final AuthenticationCallback callback) {

        String policy = getIntent().getStringExtra("thePolicy");

        // one of the acquireToken overloads
        mAuthContext.acquireToken(ToDoActivity.this, Constants.SCOPES, Constants.ADDITIONAL_SCOPES,
                policy, Constants.CLIENT_ID, Constants.REDIRECT_URL, getUserInfo(),
                PromptBehavior.Always, "nux=1&" + Constants.EXTRA_QP, callback);
    }
```

Let's also add some methods that will "set" and "get" our AuthenticationResult (which has our token) in to the global CONSTANTS. This is needed because even though `ToDoActivity.java` uses **sResult** in it's flows our other activites wouldn't have access to the token to work (such as add a task in our `AddTaskActivity.java`)

```

    private AuthenticationResult getLocalToken() {
        return Constants.CURRENT_RESULT;
    }

    private void setLocalToken(AuthenticationResult newToken) {


        Constants.CURRENT_RESULT = newToken;
    }


```
### Step 12: Create a method to return a UserIdentifier

ADAL for Android represents the user in the form of a **UserIdentifier** object. This manages the user and allows us to know if the same user is being used in our calls so we can rely on the cache vs. making a new call to the server. In order to make this easier, we create a `getUserInfo()` which will return a UserIdentifier we can use for `acquireToken()`. We also create a getUniqueId() method which will quickly reutrn us the ID of the UserIdentifier in our cache.

```
  private String getUniqueId() {
        if (sResult != null && sResult.getUserInfo() != null
                && sResult.getUserInfo().getUniqueId() != null) {
            return sResult.getUserInfo().getUniqueId();
        }

        return null;
    }

    private UserIdentifier getUserInfo() {

        final TextView names = (TextView)findViewById(R.id.userLoggedIn);
        String name = names.getText().toString();
        return new UserIdentifier(name, UserIdentifier.UserIdentifierType.OptionalDisplayableId);
    }

```

### Step 13: Write some helper methods

We need to write some hepler methods that help us clear the cookies and provide an AuthenticationCallback. These are used purely for the sample in order to make sure we're in a clean state when calling our ToDo activity.

**In the same file** called `ToDoActivity.java`

```

    private void clearSessionCookie() {

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.removeSessionCookie();
        CookieSyncManager.getInstance().sync();
    }
```

```
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        mAuthContext.onActivityResult(requestCode, resultCode, data);
    }

```   

### Step 14: Call the Task API

Now that we have our Activity wired up and ready to go to do the heavy lifting of grabbing tokens, let's write our API to access the task server.

Our `getTasks` provides an array that represents the tasks in our server

Let's write our `getTask` first:

**In the same file** called `ToDoActivity.java`

```
    private void getTasks() {
        if (sResult == null || sResult.getToken().isEmpty())
            return;

        List<String> items = new ArrayList<>();
        try {
            items = new TodoListHttpService().getAllItems(sResult.getToken());
        } catch (Exception e) {
            items = new ArrayList<>();
        }

        ListView listview = (ListView) findViewById(R.id.listViewToDo);
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,
                android.R.layout.simple_list_item_1, android.R.id.text1, items);
        listview.setAdapter(adapter);
    }

```



 Let's also write a method that will initialize our tables on first run:

 **In the same file** called `ToDoActivity.java`

```
    private void initAppTables() {
        try {
            ListView listViewToDo = (ListView) findViewById(R.id.listViewToDo);
            listViewToDo.setAdapter(mAdapter);

        } catch (Exception e) {
            createAndShowDialog(new Exception(
                    "There was an error creating the Mobile Service. Verify the URL"), "Error");
        }
    }

```

 You'll see that this code requires some additional methods to do it's work. Let's write those now.

### Create endpoint URL generator

 We need to generate the endpoint URL that we'll be connecting to. Let's do that in the same class file:

 **In the same file** called `ToDoActivity.java`

 ```
    private URL getEndpointUrl() {
        URL endpoint = null;
        try {
            endpoint = new URL(Constants.SERVICE_URL);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        return endpoint;
    }

 ```


Note that we add the access token to the request in the following code:

### Step 15: Let's write some UX methods

Android requires us to handle some callbacks in order to operate the app. These are `createAndShowDialog` and `onResume()`. This is pretty simple and very familiar if you've written Android code before.

Let's write those now:

**In the same file** called `ToDoActivity.java`

```
    @Override
    public void onResume() {
        super.onResume(); // Always call the superclass method first

        updateLoggedInUser();
        // User can click logout, it will come back here
        // It should refresh list again
        getTasks();
    }


```

And now manage our dialog callbacks:

**In the same file** called `ToDoActivity.java`


```
    /**
     * Creates a dialog and shows it
     *
     * @param exception The exception to show in the dialog
     * @param title     The dialog title
     */
    private void createAndShowDialog(Exception exception, String title) {
        createAndShowDialog(exception.toString(), title);
    }

    /**
     * Creates a dialog and shows it
     *
     * @param message The dialog message
     * @param title   The dialog title
     */
    private void createAndShowDialog(String message, String title) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        builder.setMessage(message);
        builder.setTitle(title);
        builder.create().show();
    }

```

That's it! You should have a `ToDoActivity.java` file that compiles. The entire project should compile at this point as well.



### Step 16: Run the sample app

Finally, build and run both the app in Android Studio or Eclipse.  Sign up or sign into the app, and create tasks for the signed in user.  Sign out, and sign back in as a different user, creating tasks for that user.

Notice how the tasks are stored per-user on the API, since the API extracts the user's identity from the access token it receives.

For reference, the completed sample [is provided as a .zip here](https://github.com/AzureADQuickStarts/B2C-NativeClient-Android/archive/complete.zip),
or you can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/B2C-NativeClient-Android```


### Important Information


#### Encryption

ADAL encrypts the tokens and store in SharedPreferences by default. You can look at the StorageHelper class to see the details. Android introduced AndroidKeyStore for 4.3(API18) secure storage of private keys. ADAL uses that for API18 and above. If you want to use ADAL for lower SDK versions, you need to provide secret key at AuthenticationSettings.INSTANCE.setSecretKey

#### Session cookies in Webview

Android webview does not clear session cookies after app is closed. You can handle this with sample code below:
```
CookieSyncManager.createInstance(getApplicationContext());
CookieManager cookieManager = CookieManager.getInstance();
cookieManager.removeSessionCookie();
CookieSyncManager.getInstance().sync();
```
More about cookies: http://developer.android.com/reference/android/webkit/CookieSyncManager.html
