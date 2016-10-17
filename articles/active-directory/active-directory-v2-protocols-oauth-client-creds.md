
<properties
	pageTitle="Azure AD v2.0 OAuth Client Credentials Flow | Microsoft Azure"
	description="Building web applications using Azure AD's implementation of the OAuth 2.0 authentication protocol."
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="msmbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/26/2016"
	ms.author="dastrock"/>

# v2.0 Protocols - OAuth 2.0 Client Credentials Flow

The [OAuth 2.0 client credentials grant](http://tools.ietf.org/html/rfc6749#section-4.4), sometimes referred to as "two-legged OAuth", can be used to access web hosted resources using the identity of an application.  It is commonly used for server to server interactions that must run in the background without the immediate precense of an end-user.  These types of applications are often referred to as **daemons** or **service accounts**.

> [AZURE.NOTE]
	Not all Azure Active Directory scenarios & features are supported by the v2.0 endpoint.  To determine if you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

In the more typical three "three-legged OAuth," a client application is granted permission to access a resource on behalf of a particular user.  The permission is **delegated** from the user to the application, usually during the [consent](active-directory-v2-scopes.md) process.  However, in the client credentials flow, permissions are granted **directly** to the application itself.  When the app presents a token to a resource, the resource enforces that the app itself has authorization to perform some action - not that some user has authorization.

## Protocol diagram
The entire client credentials flow looks something like this - each of the steps are described in detail below.

![Client Credentials Flow](../media/active-directory-v2-flows/convergence_scenarios_client_creds.png)

## Get direct authorization 
There are two ways that an app typically receives direct authorization to access a resource: through an access control list at the resource, or through application permission assignment in Azure AD.  There are several other ways a resource may choose to authorize its clients, and each resource server may choose the method that makes the most sense for its application.  These two methods are the most common in Azure AD and are reccommended for clients and resources that wish to perform the client credentials flow.

### Access control lists
A given resource provider might enforce an authorization check based on a list of application IDs that it knows and grants some particular level of access.  When the resource receives a token from the v2.0 endpoint, it can decode the token and extract the the client's Application ID from the `appid` and `iss` claims.  It can then compare that the application against some access control list (ACL) it maintains.  The granularity and method of the access control list can vary dramatically from resource to resource.

A common use case for such ACLs is test runners for a web application or web api.  The web api may only grant a subset of its full permissions to its various clients.  But in order to run end to end tests on the api, a test client is created that acquires tokens from the v2.0 endpoint and sends them to the api.  The api can then ACL the test client's Application ID for full access to the api's entire functionality.  Note that if you have such a list on your service, you should be sure to not only validate the caller's `appid`, but also validate that the `iss` of the token is trusted as well.

This type of authorization is common for daemons and service accounts that need to access data owned by consumer users with personal Microsoft accounts.  For data owned by organizations, it's recommended that you acquire the necessary authorization via application perimssions.

### Application permissions
Instead of using ACLs, APIs can expose a set of **application permissions** that can be granted to an application.  An application permission is granted to an application by an administrator of an organization, and can only be used to access data owned by that organization and its employees.  For example, the Microsoft Graph exposes several application permissions:

- Reading mail in all mailboxes
- Reading and writing mail in all mailboxes
- Sending mail as any user
- Reading directory data
- [+ more](https://graph.microsoft.io)

In order to acquire these permissions in your app, you can perform the following steps.

#### Request the permissions in the app registration portal

- Navigate to your application in [apps.dev.microsoft.com](https://apps.dev.microsoft.com), or [create an app](active-directory-v2-app-registration.md) if you haven't already.  You will need to ensure that your application has created at least one Application Secret.
- Locate the **Direct Application Permissions** section and add the permissions that your app requires.
- Make sure to **Save** the app registration

#### Recommended: sign the user into your app

Typically when building an application that uses application permissions, the app will need to have a page/view that allows the admin to approve the app's permissions.  This page can be part of the app's sign-up flow, part of the app's settings, or a dedicated "connect" flow.  In many cases, it makes sense for the app to show this "connect" view only after a user has signed in with a work or school Microsoft account.

Signing the user into the app allows you to identify the organziation to which the user belongs before asking them to approve the application permissions.  While not strictly necessary, it can help you create a more intuitive experience for your organizational users.  To sign the user in, follow our [v2.0 protocol tutorials](active-directory-v2-protocols.md).

#### Request the permissions from a directory admin

When you're ready to request permissions from the company's admin, you can redirect the user to the v2.0 **admin consent endpoint**.

```
// Line breaks for legibility only

GET https://login.microsoftonline.com/{tenant}/adminconsent?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&state=12345
&redirect_uri=http://localhost/myapp/permissions
```

```
// Pro Tip: Try pasting the below request in a browser!
```

```
https://login.microsoftonline.com/common/adminconsent?client_id=6731de76-14a6-49ae-97bc-6eba6914391e&state=12345&redirect_uri=http://localhost/myapp/permissions
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | --------------- |
| tenant | required | The directory tenant that you want to request permission from.  Can be provided in guid or friendly name format.  If you do not know which tenant the user belongs to and want to let them sign in with any tenant, use `common`. |
| client_id | required | The Application Id that the registration portal ([apps.dev.microsoft.com](https://apps.dev.microsoft.com)) assigned your app. |
| redirect_uri | required | The redirect_uri where you want the response to be sent for your app to handle.  It must exactly match one of the redirect_uris you registered in the portal, except it must be url encoded and can have additional path segments. |
| state | recommended | A value included in the request that will also be returned in the token response.  It can be a string of any content that you wish.  The state is used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |

At this point, Azure AD will enforce that only a tenant administrator can sign in to complete the request.  The administrator will be asked to approve all of the direct application permissions that you have requested for your app in the registration portal. 

##### Successful response
If the admin approves the permissions for your application, the successful response will be:

```
GET http://localhost/myapp/permissions?tenant=a8990e1f-ff32-408a-9f8e-78d3b9139b95&state=state=12345&admin_consent=True
```

| Parameter | Description |
| ----------------------- | ------------------------------- | --------------- |
| tenant | The directory tenant that granted your application the permissions it requested, in guid format. |
| state | A value included in the request that will also be returned in the token response.  It can be a string of any content that you wish.  The state is used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| admin_consent | Will be set to `True`. |


##### Error response
If the admin does not approve the permissions for your application, the failed response will be:

```
GET http://localhost/myapp/permissions?error=permission_denied&error_description=The+admin+canceled+the+request
```

| Parameter | Description |
| ----------------------- | ------------------------------- | --------------- |
| error | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer identify the root cause of an error.  |

Once you've received a successful response from the app provisioning endpoint, your app has gained the direct application permissions it requested.  You can now move onto requesting a token for the desired resource.

## Get a token
Once you've acquired the necessary authrorization for your application, you can proceed with acquiring access tokens for APIs.  To get a token using the client credentials grant, send a POST request to the `/token` v2.0 endpoint:

```
POST /common/oauth2/v2.0/token HTTP/1.1
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

client_id=535fb089-9ff3-47b6-9bfb-4f1264799865&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=qWgdYAmab0YSkuL1qKv5bPX&grant_type=client_credentials
```

```
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'client_id=535fb089-9ff3-47b6-9bfb-4f1264799865&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=qWgdYAmab0YSkuL1qKv5bPX&grant_type=client_credentials' 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
```

| Parameter | | Description |
| ----------------------- | ------------------------------- | --------------- |
| client_id | required | The Application Id that the registration portal ([apps.dev.microsoft.com](https://apps.dev.microsoft.com)) assigned your app. |
| scope | required | The value passed for the `scope` parameter in this request should be the resource identifier (App ID URI) of the desired resource, affixed with the `.default` suffix.  So for the Microsoft Graph example given, the value should be `https://graph.microsoft.com/.default`.  This value informs the v2.0 endpoint that of all the direct application permissions you have configured for your app, it should issue a token for the ones pertaining to the desired resource. |
| client_secret | required | The Application Secret that you generated in the registration portal for your app. |
| grant_type | required | Must be `client_credentials`. | 

#### Successful response
A successful response will take the form:

```
{
  "token_type": "Bearer",
  "expires_in": 3599,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBP..."
}
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| access_token | The requested access token. The  app can use this token to authenticate to the secured resource, such as a web API. |
| token_type | Indicates the token type value. The only type that Azure AD supports is `Bearer`.  |
| expires_in | How long the access token is valid (in seconds). |

#### Error response
An error response will take the form:

```
{
  "error": "invalid_scope",
  "error_description": "AADSTS70011: The provided value for the input parameter 'scope' is not valid. The scope https://foo.microsoft.com/.default is not valid.\r\nTrace ID: 255d1aef-8c98-452f-ac51-23d051240864\r\nCorrelation ID: fb3d2015-bc17-4bb9-bb85-30c5cf1aaaa7\r\nTimestamp: 2016-01-09 02:02:12Z",
  "error_codes": [
    70011
  ],
  "timestamp": "2016-01-09 02:02:12Z",
  "trace_id": "255d1aef-8c98-452f-ac51-23d051240864",
  "correlation_id": "fb3d2015-bc17-4bb9-bb85-30c5cf1aaaa7"
}
```

| Parameter | Description |
| ----------------------- | ------------------------------- |
| error | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| error_description | A specific error message that can help a developer identify the root cause of an authentication error.  |
| error_codes | A list of STS specific error codes that can help in diagnostics.  |
| timestamp | The time at which the error occurred. |
| trace_id | A unique identifier for the request that can help in diagnostics.  |
| correlation_id | A unique identifier for the request that can help in diagnostics across components. |

## Use a token
Now that you've acquired a token, you can use that token to make requests to the resource.  When the token expires, simply repeat the request to the `/token` endpoint to acquire a fresh access token.

```
GET /v1.0/me/messages
Host: https://graph.microsoft.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

```
// Pro Tip: Try the below command out! (but replace the token with your own)
```

```
curl -X GET -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q" 'https://graph.microsoft.com/v1.0/me/messages'
```

## Code sample
To see an example of an application that implements the client_credentials grant using the admin consent endpoint, refer to our [v2.0 daemon code sample](https://github.com/Azure-Samples/active-directory-dotnet-daemon-v2).