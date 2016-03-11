<properties
	pageTitle="How to Use Apache Cordova Plugin for Azure Mobile Apps"
	description="How to Use Apache Cordova Plugin for Azure Mobile Apps"
	services="app-service\mobile"
	documentationCenter="javascript"
	authors="adrianhall"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-html"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="02/17/2016"
	ms.author="adrianha"/>

# How to Use Apache Cordova Client Library for Azure Mobile Apps

[AZURE.INCLUDE [app-service-mobile-selector-client-library](../../includes/app-service-mobile-selector-client-library.md)]

This guide teaches you to perform common scenarios using the latest [Apache Cordova Plugin for Azure Mobile Apps]. If you are new to Azure Mobile
Apps, first complete [Azure Mobile Apps Quick Start] to create a backend, create a table, and download a pre-built Apache Cordova project. In this
guide, we focus on the client-side Apache Cordova Plugin.

##<a name="Setup"></a>Setup and Prerequisites

This guide assumes that you have created a backend with a table. This guide assumes that the table has the same schema as the tables in those
tutorials. This guide also assumes that you have added the Apache Cordova Plugin to your code.  If you have not done so, you may add the Apache
Cordova plugin to your project on the command-line:

```
cordova plugin add cordova-plugin-ms-azure-mobile-apps
```

For more information on creating [your first Apache Cordova app], see their documentation.

##<a name="create-client"></a>How to: Create Client

Create a client connection by creating a `WindowsAzure.MobileServicesClient` object.  Replace `appUrl` with the URL to your Mobile App.

```
var client = new WindowsAzure.MobileServicesClient(appUrl);
```

##<a name="table-reference"></a>How to: Create Table Reference

To access or update data, create a reference to the backend table. Replace `tableName` with the name of your table

```
var table = client.getTable(tableName);
```

##<a name="querying"></a>How to: Query a Table Reference

Once you have a table reference, you can use it to query for data on the server.  Queries are made in a "LINQ-like" language.
To return all data from the table, use the following:

```
/**
 * Process the results that are received by a call to table.read()
 *
 * @param {Object} results the results as a pseudo-array
 * @param {int} results.length the length of the results array
 * @param {Object} results[] the individual results
 */
function success(results) {
   var numItemsRead = results.length;

   for (var i = 0 ; i < results.length ; i++) {
       var row = results[i];
       // Each row is an object - the properties are the columns
   }
}

function failure(error) {
    throw new Error('Error loading data: ', error);
}

table
    .read()
    .then(success, failure);
```

The success function is called with the results.   Do not use `for (var i in results)` in
the success function as that will iterate over information that is included in the results
when other query functions (such as `.includeTotalCount()`) are used.

For more information on the Query syntax, refer to the [Query object documentation].

### Filtering Data on the server

You can use a `where` clause on the table reference:

```
table
    .where({ userId: user.userId, complete: false })
    .read()
    .then(success, failure);
```

You can also use a function that filters the object.  In this case the `this` variable is assigned to the
current object being filtered.  The following is functionally equivalent to the prior example:

```
function filterByUserId(currentUserId) {
    return this.userId === currentUserId && this.complete === false;
}

table
    .where(filterByUserId, user.userId)
    .read()
    .then(success, failure);
```

### Paging through data

Utilize the take() and skip() methods.  For example, if you wish to split the table into 100-row records:

```
var totalCount = 0, pages = 0;

// Step 1 - get the total number of records
table.includeTotalCount().take(0).read(function (results) {
    totalCount = results.totalCount;
    pages = Math.floor(totalCount/100) + 1;
    loadPage(0);
}, failure);

function loadPage(pageNum) {
    let skip = pageNum * 100;
    table.skip(skip).take(100).read(function (results) {
        for (var i = 0 ; i < results.length ; i++) {
            var row = results[i];
            // Process each row
        }
    }
}
```

The `.includeTotalCount()` method is used to add a totalCount field to the results object.  The
totalCount field is filled with the total number of records that would be returned if no paging
is used.

You can then use the pages variable and some UI buttons to provide a page list; use loadPage() to
load the new records for each page.  You should implement some sort of caching to speed access to
records that have already been loaded.


###<a name="sorting-data"></a>How to: Return data sorted

Use the .orderBy() or .orderByDescending() query methods:

```
table
    .orderBy('name')
    .read()
    .then(success, failure);
```

For more information on the Query object, refer to the [Query object documentation].

##<a name="inserting"></a>How to: Insert Data

Create a JavaScript object with the appropriate date and call table.insert() asynchronously:

```
var newItem = {
    name: 'My Name',
    signupDate: new Date()
};

table
    .insert(newItem)
    .done(function (insertedItem) {
        var id = insertedItem.id;
    }, failure);
```

On successful insertion, the inserted item is returned with the additional fields that are required
for sync operations.  You should update your own cache with this information for later updates.

Note that the Azure Mobile Apps Node.js Server SDK supports dynamic schema for development purposes.
In the case of dynamic schema, the schema of the table is updated on the fly, allowing you to add
columns to the table just by specifying them in an insert or update operation.  We recommend that
you turn off dynamic schema before moving your application to production.

##<a name="modifying"></a>How to: Modify Data

Similar to the .insert() method, you should create an Update object and then call .update().  The update
object must contain the ID of the record to be updated - this is obtained when reading the record or
when calling .insert().

```
var updateItem = {
    id: '7163bc7a-70b2-4dde-98e9-8818969611bd',
    name: 'My New Name'
};

table
    .update(updateItem)
    .done(function (updatedItem) {
        // You can now update your cached copy
    }, failure);
```

##<a name="deleting"></a>How to: Delete Data

Call the .del() method to delete a record.  Pass the ID in an object reference:

```
table
    .del({ id: '7163bc7a-70b2-4dde-98e9-8818969611bd' })
    .done(function () {
        // Record is now deleted - update your cache
    }, failure);
```

##<a name="auth"></a>How to: Authenticate Users

Azure App Service supports authenticating and authorizing app users using a variety of external identity
providers: Facebook, Google, Microsoft Account, and Twitter.   You can set permissions on tables to restrict
access for specific operations to only authenticated users. You can also use the identity of authenticated
users to implement authorization rules in server scripts. For more information, see the [Get started with authentication] tutorial.

When using authentication in an Apache Cordova app, the following Cordova plugins must be available:

* [cordova-plugin-device]
* [cordova-plugin-inappbrowser]

Two authentication flows are supported: a server flow and a client flow.  The server flow provides the simplest
authentication experience, as it relies on the provider's web authentication interface. The client flow allows
for deeper integration with device-specific capabilities such as single-sign-on as it relies on provider-specific
device-specific SDKs.

##<a name="server-auth"></a>How to: Authenticate with a Provider (Server Flow)

o have Mobile Services manage the authentication process in your Windows Store or HTML5 app, you must register
your app with your identity provider. Then in your Azure App Service, you need to configure the application ID and
secret provided by your provider. For more information, see the tutorial [Add authentication to your app].

Once you have registered your identity provider, simply call the .login() method with the name of your provider. For
example, to login with Facebook use the following code.

```
client.login("facebook").done(function (results) {
     alert("You are now logged in as: " + results.userId);
}, function (err) {
     alert("Error: " + err);
});
```

If you are using an identity provider other than Facebook, change the value passed to the login method above to one of
the following: `microsoftaccount`, `facebook`, `twitter`, `google`, or `aad`.

In this case, Azure App Service manages the OAuth 2.0 authentication flow by displaying the login page of the selected
provider and generating a App Service authentication token after successful login with the identity provider. The login
function, when complete, returns a JSON object (user) that exposes both the user ID and App Service authentication token
in the userId and authenticationToken fields, respectively. This token can be cached and re-used until it expires.

##<a name="client-auth"></a>How to: Authenticate with a Provider (Client Flow)

Your app can also independently contact the identity provider and then provide the returned token to your App Service for
authentication. This client flow enables you to provide a single sign-in experience for users or to retrieve additional
user data from the identity provider.

### Social Authentication basic example

This example uses Facebook client SDK for authentication:

```
client.login(
     "facebook",
     {"access_token": token})
.done(function (results) {
     alert("You are now logged in as: " + results.userId);
}, function (err) {
     alert("Error: " + err);
});
```
This example assumes that the token provided by the respective provider SDK is stored in the token variable.

### Microsoft Account example

The following example uses the Live SDK, which supports single-sign-on for Windows Store apps by using Microsoft Account:

```
WL.login({ scope: "wl.basic"}).then(function (result) {
      client.login(
            "microsoftaccount",
            {"authenticationToken": result.session.authentication_token})
      .done(function(results){
            alert("You are now logged in as: " + results.userId);
      },
      function(error){
            alert("Error: " + err);
      });
});
```

This example gets a token from Live Connect, which is supplied to your App Service by calling the login function.

##<a name="auth-getinfo"></a>How to: Obtain information about the authenticated user

The authentication information for the current user can be retrieved from the `/.auth/me` endpoint using any
AJAX method.  For example, to use the fetch API:

```
var url = client.applicationUrl + '/.auth/me';
fetch(url)
    .then(function (data) {
        return data.json()
    }).then(function (user) {
        // The user object contains the claims for the authenticated user
    });
```

You could also use jQuery or another AJAX API to fetch the information.  Data will be received as a JSON object.

##<a name="register-for-push"></a>How to: Register for Push Notifications

Install the [phonegap-plugin-push] to handle push notifications.  This can be easily added using the `cordova plugin add`
command on the command line, or via the Git plugin installer within Visual Studio.  The following code in your Apache
Cordova app will register your device for push notifications:

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

Use the Notification Hubs SDK to send push notifications from the server.  You should never
send push notifications directly from clients as that could be used to trigger a denial of
service attack against Notification Hubs or the PNS.

<!-- URLs. -->
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

