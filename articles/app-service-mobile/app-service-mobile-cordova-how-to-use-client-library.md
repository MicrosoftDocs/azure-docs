<properties
	pageTitle="How to Use Apache Cordova Plugin for Azure Mobile Apps"
	description="How to Use Apache Cordova Plugin for Azure Mobile Apps"
	services="app-service\mobile"
	documentationCenter="javascript"
	authors="adrianhall"
	manager="erikre"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-html"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="10/01/2016"
	ms.author="adrianha"/>

# How to Use Apache Cordova Client Library for Azure Mobile Apps

[AZURE.INCLUDE [app-service-mobile-selector-client-library](../../includes/app-service-mobile-selector-client-library.md)]

This guide teaches you to perform common scenarios using the latest [Apache Cordova Plugin for Azure Mobile Apps]. If you are new to Azure Mobile
Apps, first complete [Azure Mobile Apps Quick Start] to create a backend, create a table, and download a pre-built Apache Cordova project. In this
guide, we focus on the client-side Apache Cordova Plugin.

## Supported Platforms

This SDK supports Apache Cordova v6.0.0 and later on iOS, Android, and Windows devices.  The platform
support is as follows:

* Android API 19-24 (KitKat through Nougat)
* iOS versions 8.0 and later.
* Windows Phone 8.0
* Windows Phone 8.1
* Universal Windows Platform

##<a name="Setup"></a>Setup and Prerequisites

This guide assumes that you have created a backend with a table. This guide assumes that the table has the same schema as the tables in those
tutorials. This guide also assumes that you have added the Apache Cordova Plugin to your code.  If you have not done so, you may add the Apache
Cordova plugin to your project on the command line:

```
cordova plugin add cordova-plugin-ms-azure-mobile-apps
```

For more information on creating [your first Apache Cordova app], see their documentation.

[AZURE.INCLUDE [app-service-mobile-html-js-library.md](../../includes/app-service-mobile-html-js-library.md)]


##<a name="auth"></a>How to: Authenticate Users

Azure App Service supports authenticating and authorizing app users using various external identity
providers: Facebook, Google, Microsoft Account, and Twitter. You can set permissions on tables to restrict
access for specific operations to only authenticated users. You can also use the identity of authenticated
users to implement authorization rules in server scripts. For more information, see the [Get started with authentication] tutorial.

When using authentication in an Apache Cordova app, the following Cordova plugins must be available:

* [cordova-plugin-device]
* [cordova-plugin-inappbrowser]

Two authentication flows are supported: a server flow and a client flow.  The server flow provides the simplest
authentication experience, as it relies on the provider's web authentication interface. The client flow allows
for deeper integration with device-specific capabilities such as single-sign-on as it relies on provider-specific
device-specific SDKs.

[AZURE.INCLUDE [app-service-mobile-html-js-auth-library.md](../../includes/app-service-mobile-html-js-auth-library.md)]

###<a name="configure-external-redirect-urls"></a>How to: Configure your Mobile App Service for External Redirect URLs.

Several types of Apache Cordova applications use a loopback capability to handle OAuth UI flows.  OAuth UI
flows on localhost cause problems since the authentication service only knows how to utilize your service 
by default.  Examples of problematic OAuth UI flows include:

- The Ripple emulator.
- Live Reload with Ionic.
- Running the mobile backend locally
- Running the mobile backend in a different Azure App Service than the one providing authentication.

Follow these instructions to add your local settings to the configuration:

1. Log in to the [Azure portal]
2. Select **All resources** or **App Services** then click the name of your Mobile App.
3. Click **Tools**
4. Click **Resource explorer** in the OBSERVE menu, then click **Go**.  A new window or tab opens.
5. Expand the **config**, **authsettings** nodes for your site in the left-hand navigation.
6. Click **Edit**
7. Look for the "allowedExternalRedirectUrls" element.  It may be set to null or an array of values.  Change 
   the value to the following value:

         "allowedExternalRedirectUrls": [
             "http://localhost:3000",
             "https://localhost:3000"
         ],

    Replace the URLs with the URLs of your service.  Examples include "http://localhost:3000" (for the Node.js sample
    service), or "http://localhost:4400" (for the Ripple service).  However, these URLs are examples - your situation,
    including for the services mentioned in the examples, may be different.
8. Click the **Read/Write** button in the top-right corner of the screen.
9. Click the green **PUT** button.

The settings are saved at this point.  Do not close the browser window until the settings have finished saving.
Also add these loopback URLs to the CORS settings for your App Service:

1. Log in to the [Azure portal]
2. Select **All resources** or **App Services** then click the name of your Mobile App.
3. The Settings blade opens automatically.  If it doesn't, click **All Settings**.
4. Click **CORS** under the API menu.
5. Enter the URL that you wish to add in the box provided and press Enter.
6. Enter additional URLs as needed.
7. Click **Save** to save the settings.

It takes approximately 10-15 seconds for the new settings to take effect.

##<a name="register-for-push"></a>How to: Register for Push Notifications

Install the [phonegap-plugin-push] to handle push notifications.  This plugin can be easily added using the 
`cordova plugin add` command on the command line, or via the Git plugin installer within Visual Studio.  The 
following code in your Apache Cordova app registers your device for push notifications:

```
var pushOptions = {
    android: {
        senderId: '<from-gcm-console>'
    },
    ios: {
        alert: true,
        badge: true,
        sound: true
    },
    windows: {
    }
};
pushHandler = PushNotification.init(pushOptions);

pushHandler.on('registration', function (data) {
    registrationId = data.registrationId;
    // For cross-platform, you can use the device plugin to determine the device
    // Best is to use device.platform
    var name = 'gcm'; // For android - default
    if (device.platform.toLowerCase() === 'ios')
        name = 'apns';
    if (device.platform.toLowerCase().substring(0, 3) === 'win')
        name = 'wns';
    client.push.register(name, registrationId);
});

pushHandler.on('notification', function (data) {
    // data is an object and is whatever is sent by the PNS - check the format
    // for your particular PNS
});

pushHandler.on('error', function (error) {
    // Handle errors
});
```

Use the Notification Hubs SDK to send push notifications from the server.  Never send push notifications 
directly from clients. Doing so could be used to trigger a denial of service attack against Notification Hubs 
or the PNS.  The PNS could ban your traffic as a result of such attacks.

<!-- URLs. -->
[Azure portal]: https://portal.azure.com
[Azure Mobile Apps Quick Start]: app-service-mobile-cordova-get-started.md
[Get started with authentication]: app-service-mobile-cordova-get-started-users.md
[Add authentication to your app]: app-service-mobile-cordova-get-started-users.md

[Apache Cordova Plugin for Azure Mobile Apps]: https://www.npmjs.com/package/cordova-plugin-ms-azure-mobile-apps
[your first Apache Cordova app]: http://cordova.apache.org/#getstarted
[phonegap-facebook-plugin]: https://github.com/wizcorp/phonegap-facebook-plugin
[phonegap-plugin-push]: https://www.npmjs.com/package/phonegap-plugin-push
[cordova-plugin-device]: https://www.npmjs.com/package/cordova-plugin-device
[cordova-plugin-inappbrowser]: https://www.npmjs.com/package/cordova-plugin-inappbrowser
[Query object documentation]: https://msdn.microsoft.com/en-us/library/azure/jj613353.aspx
