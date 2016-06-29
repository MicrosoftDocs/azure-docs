<properties
	pageTitle="How to enable cross-app SSO on iOS using ADAL | Microsoft Azure"
	description="How to use the features of the ADAL SDK to enable Single Sign On across your applications. "
	services="active-directory"
	documentationCenter=""
	authors="brandwe"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="05/31/2016"
	ms.author="brandwe"/>


# How to enable cross-app SSO on iOS using ADAL


Providing Single Sign-On (SSO) so that users only need to enter their credentials once and have those credentials automatically work across applications is now expected by customers. The difficulty in entering their username and password on a small screen, often times combined with an additional factor (2FA) like a phone call or a texted code, results in quick dissatisfaction if a user has to do this more than one time for your product. 

In addition, if you leverage an identity platform that other applications may use such as Microsoft Accounts or a work account from Office365, customers expect that those credentials to be available to use across all their applications no matter the vendor. 

The Microsoft Identity platform, along with our Microsoft Identity SDKs, does all of this hard work for you and gives you the ability to delight your customers with SSO either within your own suite of applications or, as with our broker capability and Authenticator applications, across the entire device.

This walkthrough will tell you how to configure our SDK within your application to provide this benefit to your customers.

This walkthrough applies to:

* Azure Active Directory
* Azure Active Directory B2C
* Azure Active Directory B2B


Note that the document below assumes you have knowledge of how to [provision applications in the legacy portal for Azure Active Directory](active-directory-how-to-integrate.md) as well as have integrated your application with the [Microsoft Identity iOS SDK](https://github.com/AzureAD/azure-activedirectory-library-for-objc).

## SSO Concepts in the Microsoft Identity Platform

### Microsoft Identity Brokers

Microsoft provides applications for every mobile platform that allow for the bridging of credentials across applications from different vendors as well as allows for special enhanced features that require a single secure place from where to validate credentials. We call these **brokers**. On iOS and Android these are provided through downloadable applications that customers either install independently or can be pushed to the device by a company who manages some or all of the device for their employee. These brokers support managing security just for some applications or the entire device based on what IT Administrators desire. In Windows this functionality is provided by an account chooser built in to the operating system, known technically as the Web Authentication Broker.

To understand how we use these brokers and how your customers might see them in their login flow for the Microsoft Identity platform read on for more information.

### Patterns for logging in on mobile devices

Access to credentials on devices follow two basic patterns for the Microsoft Identity platform: 

* Non-broker assisted logins
* Broker assisted logins

#### Non-broker assisted logins

Non-broker assisted logins are login experiences that happen inline with the application and use the local storage on the device for that application. This storage may be shared across applications but the credentials are tightly bound to the app or suite of apps using that credential. This is the experience you've most likely experienced in many mobile applications where you enter a username and password within the application itself.

These logins have the following benefits:

-  User experience exists entirely within the application.
-  Credentials can be shared across applications that are signed by the same certificate, providing a single sign-on experience to your suite of applications. 
-  Control around the experience of logging in is provided to the application before and after sign-in.

These logins have the following drawbacks:

- User cannot experience single-sign on across all apps that use a Microsoft Identity, only across those Microsoft Identities that are your application owns and have configured.
- Your application can not be used with more advanced business features such as Conditional Access or use the InTune suite of products.
- Your application can't support certificate based authentication for business users.

Here is a representation of how the Microsoft Identity SDKs work with the shared storage of your applications to enable SSO:

```
+------------+ +------------+  +-------------+
|            | |            |  |             |
|   App 1    | |   App 2    |  |   App 3     |
|            | |            |  |             |
|            | |            |  |             |
+------------+ +------------+  +-------------+
| Azure SDK  | | Azure SDK  |  | Azure SDK   |
+------------+-+------------+--+-------------+
|                                            |
|            App Shared Storage              |
+--------------------------------------------+
```

#### Broker assisted logins

Broker-assisted logins are login experiences that occur within the broker application and use the storage and security of the broker to share credentials across all applications on the device that leverage the Microsoft Identity platform. This means that your applications will rely on the broker in order to sign users in. On iOS and Android these are provided through downloadable applications that customers either install independently or can be pushed to the device by a company who manages the device for their user. An example of this type of application is the Azure Authenticator application on iOS. In Windows this functionality is provided by an account chooser built in to the operating system, known technically as the Web Authentication Broker. 
The experience varies by platform and can sometimes be disruptive to users if not managed correctly. You're probably most familiar with this pattern if you have the Facebook application installed and use Facebook Login functionality in another application. The Microsoft Identity platform leverages the same pattern.

For iOS this leads to a "transition" animation where your application is sent to the background while the Azure Authenticator applications comes to the foreground for the user to select which account they would like to sign in with.  

For Android and Windows the account chooser is displayed on top of your application which is less disruptive to the user.

#### How the broker gets invoked

If a compatible broker is installed on the device, like the Azure Authenticator application, the Microsoft Identity SDKs will automatically do the work of invoking the broker for you when a user indicates they wish to log in using any account from the Microsoft Identity platform. This could be a personal Microsoft Account, a work or school account, or an account that you provide and host in Azure using our B2C and B2B products. By using extremely secure algorithms and encryption we ensure that the credentials are asked for and delivered back to your application in a secure manner. The exact technical detail of these mechanisms is not published but have been developed with collaboration by Apple and Google.

**The developer has the choice of if the Microsoft Identity SDK calls the broker or uses the non-broker assisted flow.** However if the developer chooses not to use the broker-assisted flow they lose the benefit of leveraging SSO credentials that the user may have already added on the device as well as prevents their application from being used with business features Microsoft provides its customers such as Conditional Access, Intune Management capabilities, and certificate based authentication.

These logins have the following benefits:

-  User experiences SSO across all their applications no matter the vendor.
-  Your application can leverage more advanced business features such as Conditional Access or use the InTune suite of products.
-  Your application can support certificate based authentication for business users.
- Much more secure sign-in experience as the identity of the application and the user are verified by the broker application with additional security algorithms and encryption.

These logins have the following drawbacks:

- In iOS the user is transitioned out of your application's experience while credentials are chosen.
- Loss of the ability to manage the login experience for your customers within your application.



Here is a representation of how the Microsoft Identity SDKs work with the broker applications to enable SSO:

```
+------------+ +------------+   +-------------+
|            | |            |   |             |
|   App 1    | |   App 2    |   |   Someone   |
|            | |            |   |    Else's   |
|            | |            |   |     App     |
+------------+ +------------+   +-------------+
| Azure SDK  | | Azure SDK  |   | Azure SDK   |
+-----+------+-+-----+------+-  +-------+-----+
      |              |                  |
      |       +------v------+           |
      |       |             |           |
      |       | Microsoft   |           |
      +-------> Broker      |^----------+
              | Application
              |             |
              +-------------+
              |             |
              |   Broker    |
              |   Storage   |
              |             |
              +-------------+
```
              
Armed with this background information you should be able to better understand and implement SSO within your application using the Microsoft Identity platform and SDKs.


## Enabling cross-app SSO using ADAL

Here we'll use the ADAL iOS SDK to:

- Turn on non-broker assisted SSO for your suite of apps
- Turn on support for broker-assisted SSO

### Turning on SSO for non-broker assisted SSO

For non-broker assisted SSO across applications the Microsoft Identity SDKs manage much of the complexity of SSO for you. This includes finding the right user in the cache and maintaining a list of logged in users for you to query. 

To enable SSO across applications you own you need to do the following:

1. Ensure all your applications user the same Client ID or Application ID. 
* Ensure that all of your applications share the same signing certificate from Apple so that you can share keychains
* Request the same keychain entitlement for each of your applications.
* Tell the Microsoft Identity SDKs about the shared keychain you want us to use.

#### Using the same Client ID / Application ID for all the applications in your suite of apps

In order for the Microsoft Identity platform to know that it's allowed to share tokens across your applications, each of your applications will need to share the same Client ID or Application ID. This is the unique identifier that was provided to you when you registered your first application in the portal. 

You may be wondering how you will identify different apps to the Microsoft Identity service if it uses the same Application ID. The answer is with the **Redirect URIs**. Each application can have multiple Redirect URIs registered in the onboarding portal. Each app in your suite will have a different redirect URI. An example of how this looks is below:

App1 Redirect URI: `x-msauth-mytestiosapp://com.myapp.mytestapp`

App2 Redirect URI: `x-msauth-mytestiosapp://com.myapp.mytestapp2`

App3 Redirect URI: `x-msauth-mytestiosapp://com.myapp.mytestapp3`

....

These are nested under the same client ID / application ID and looked up based on the redirect URI you return to us in your SDK configuration. 

```
+-------------------+
|                   |
|  Client ID        |
+---------+---------+
          |
          |           +-----------------------------------+
          |           |  App 1 Redirect URI               |
          +----------^+                                   |
          |           +-----------------------------------+
          |
          |           +-----------------------------------+
          +----------^+  App 2 Redirect URI               |
          |           |                                   |
          |           +-----------------------------------+
          |
          +----------^+-----------------------------------+
                      |  App 3 Redirect URI               |
                      |                                   |
                      +-----------------------------------+

```


*Note that the format of these Redirect URIs are explained below. You may use any Redirect URI unless you wish to support the broker, in which case they must look something like the above*



#### Create keychain sharing between applications

Enabling keychain sharing is beyond the scope of this document and covered by Apple in their document [Adding Capabilities](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html). What is important is that you decide what you want your keychain to be called and add that capability across all your applications. 

When you do have entitlements set up correctly you should see a file in your project directory entitled `entitlements.plist` that contains something that looks like the following:

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>keychain-access-groups</key>
	<array>
		<string>$(AppIdentifierPrefix)com.myapp.mytestapp</string>
		<string>$(AppIdentifierPrefix)com.myapp.mycache</string>
	</array>
</dict>
</plist>
```

Once you have the keychain entitlement enabled in each of your applications, and you are ready to use SSO, tell the Microsoft Identity SDK about your keychain by using the following setting in your `ADAuthenticationSettings` with the following setting:

```
defaultKeychainSharingGroup=@"com.myapp.mycache";
```

> [AZURE.WARNING] 
When you share a keychain across your applications any application can delete users or worse delete all the tokens across your application. This is particularly disastrous if you have applications that rely on the tokens to do background work. Sharing a keychain means that you must be very careful in any and all remove operations through the Microsoft Identity SDKs.

That's it! The Microsoft Identity SDK will now share credentials across all your applications. The user list will also be shared across application instances.

### Turning on SSO for broker assisted SSO

The ability for an application to use any broker that is installed on the device is **turned off by default**. In order to use your application with the broker you must do some additional configuration and add some code to your application.

The steps to follow are:

1. Enable broker mode in your application code's call to the MS SDK.
2. Establish a new redirect URI and provide that to both the app and your app registration.
3. Registering a URL Scheme.
4. iOS9 Support: Add a permission to your info.plist file.


#### Step 1: Enable broker mode in your application
The ability for your application to use the broker is turned on when you create the "context" or initial setup of your Authentication object. You do this by setting your credentials type in your code:

```
/*! See the ADCredentialsType enumeration definition for details */
@propertyADCredentialsType credentialsType;
```
The `AD_CREDENTIALS_AUTO` setting will allow the Microsoft Identity SDK to try to call out to the broker, `AD_CREDENTIALS_EMBEDDED` will prevent the Microsoft Identity SDK from calling to the broker.

#### Step 2: Registering a URL Scheme
The Microsoft Identity platform uses URLs to invoke the broker and then return control back to your application. To finish that round trip you need a URL scheme registered for your application that the Microsoft Identity platform will know about. This can be in addition to any other app schemes you may have previously registered with your application.

> [AZURE.WARNING] 
We recommend making the URL scheme fairly unique to minimize the chances of another app using the same URL scheme. Apple does not enforce the uniqueness of URL schemes that are registered in the app store. 

Below is an example of how this appears in your project configuration. You may also do this in XCode as well:

```
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>com.myapp.mytestapp</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>x-msauth-mytestiosapp</string>
        </array>
    </dict>
</array>
```

#### Step 3: Establish a new redirect URI with your URL Scheme

In order to ensure that we always return the credential tokens to the correct application, we need to make sure we call back to your application in a way that the iOS operating system can verify. The iOS operating system reports to the Microsoft broker applications the Bundle ID of the application calling it. This cannot be spoofed by a rogue application. Therefore, we leverage this along with the URI of our broker application to ensure that the tokens are returned to the correct application. We require you to establish this unique redirect URI both in your application and set as a Redirect URI in our developer portal. 

Your redirect URI must be in the proper form of:

`<app-scheme>://<your.bundle.id>`

ex: *x-msauth-mytestiosapp://com.myapp.mytestapp*

This Redirect URI needs to be specified in your app registration using the [Azure classic portal](https://manage.windowsazure.com/). For more information on Azure AD app registration, see [Integrating with Azure Active Directory](active-directory-how-to-integrate.md).


##### Step 3a: Add a redirect URI in your app and dev portal to support certificate based authentication

To support cert based authentication a second "msauth"  needs to be registered in your application and the [Azure classic portal](https://manage.windowsazure.com/) to handle certificate authentication if you wish to add that support in your application.

`msauth://code/<broker-redirect-uri-in-url-encoded-form>`

ex: *msauth://code/x-msauth-mytestiosapp%3A%2F%2Fcom.myapp.mytestapp*


#### Step 4: iOS9: Add a configuration parameter to your app

ADAL uses –canOpenURL: to check if the broker is installed on the device. In iOS 9 Apple locked down what schemes an application can query for. You will need to add “msauth” to the LSApplicationQueriesSchemes section of your `info.plist file`.

<key>LSApplicationQueriesSchemes</key>
<array>
     <string>msauth</string>
</array>

### You've configured SSO!

Now the Microsoft Identity SDK will automatically both share credentials across your applications and invoke the broker if it's present on their device.









