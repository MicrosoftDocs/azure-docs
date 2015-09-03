<properties
	pageTitle="Azure AD B2C Preview | Microsoft Azure"
	description="How to call the Graph API for a B2C directory using an application identity to automate the process."
	services="active-directory"
	documentationCenter=".net"
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="09/01/2015"
	ms.author="dastrock"/>


# Azure AD B2C Preview: Using the Graph API

<!-- TODO [AZURE.INCLUDE [active-directory-b2c-devquickstarts-graph-switcher](../../includes/active-directory-b2c-devquickstarts-graph-switcher.md)]-->

Azure AD B2C directories tend to be very large, which means that many common directory management tasks need to be performed programatically.  
A primary example is user management - you might need to migrate an existing user store to a B2C directory, or maybe you want to host user 
registration on your own page, creating user accounts in Azure AD behind the scenes.  These types of tasks require the ability to create,
read, update and delete user accounts - which you can do using the Azure AD Graph API.

> [AZURE.NOTE]
	This information applies to the Azure AD B2C preview.  For information on how to integrate with the generally available Azure AD service, 
	please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).
	
For B2C directories, there are primarily two modes of communicating with the Graph API.  

- For interactive, run-once tasks, you will likely want to perform management tasks acting as an administrator account in the B2C directory.
  This mode requires an admin to login with their credentials before performing any calls to the Graph API.
- For automated, continuous tasks, you will want to perform management tasks using some type of service account to which you grant necessary
privileges.  In Azure AD, you can do so by registering an application and authenticating to Azure AD using an "application identity", using
the [OAuth 2.0 Client Credentials Grant](active-directory-authentication-scenarios.md#daemon-or-server-application-to-web-api).  In this case, 
the appilication calls the Graph API acting as itself, rather than as any particular user.  

In this article, we'll show how to perform the latter, automated use case. At a high level, you will need to:

- Create an application in your B2C directory
- Grant that application the necessary permissions to perform user CRUD
- Acquire an access_token for calling the Graph API
- Call the Graph API, using a few specific properties and parameters specific to consumer accounts.
- Optionally, you can add custom properties to user objects in your B2C directory and use the Graph API to update those properties.

To demonstrate, we'll build a .NET 4.5 "B2CGraphClient" which performs user CRUD operations.  For the purposes of trying things out,
the client will have a Windows command line interface that allows you to invoke various methods.  However, the code is written to 
behave in a non-interactive, automated fashion.  Let's get started.

## Get a B2C enabled directory

Before you can create application, users, or interact with Azure AD at all, you will need a B2C enabled directory and an administrator account
in that directory.  If you don't have one already, follow the guide to [getting started with Azure AD B2C](active-directory-b2c-get-started.md).

## Register a service application in your directory

Now that you have a B2C directory, you need to create your service application, which you will need to do with the Azure AD Powershell Cmdlets.
First, download & install the [Microsoft Online Services Sign-In Assistant](http://go.microsoft.com/fwlink/?LinkID=286152).  Then you can download
& install the [64-bit Azure Active Directory Module for Windows Powershell](http://go.microsoft.com/fwlink/p/?linkid=236297).

Once you've installed the powershell module, open up Powershell and connect to your B2C directory.  After running `Get-Credential`, you will be
prompted for a username and password - enter those of your B2C directory admin account.

```
> $msolcred = Get-Credential
> Connect-MsolService -credential $msolcred
``` 

Before creating your application, you need to generate a new "client secret".  Your application will use the client secret to authenticate to Azure
AD and acquire access tokens.  You can generate a valid secret in Powershell:

```
> $bytes = New-Object Byte[] 32
> $rand = [System.Security.Cryptography.RandomNumberGenerator]::Create()
> $rand.GetBytes($bytes)
> $rand.Dispose()
> $newClientSecret = [System.Convert]::ToBase64String($bytes)
> $newClientSecret
``` 

The final command above should print out your new client secret.  Copy it down somewhere safe, you'll need it again shortly. Now you can create your 
application, providing the new client secret as a credential for the app:

```
> New-MsolServicePrincipal -DisplayName "My New B2C Graph API App" -Type password -Value $newClientSecret

DisplayName           : My New B2C Graph API App
ServicePrincipalNames : {dd02c40f-1325-46c2-a118-4659db8a55d5}
ObjectId              : e2bde258-6691-410b-879c-b1f88d9ef664
AppPrincipalId        : dd02c40f-1325-46c2-a118-4659db8a55d5
TrustedForDelegation  : False
AccountEnabled        : True
Addresses             : {}
KeyType               : Password
KeyId                 : a261e39d-953e-4d6a-8d70-1f915e054ef9
StartDate             : 9/2/2015 1:33:09 AM
EndDate               : 9/2/2016 1:33:09 AM
Usage                 : Verify
```

If creating the application succeeds, it should print out some properties of the application like the ones above.  You'll need both the `ObjectId` and
the `AppPrincipalId`, so copy those values down as well.

Now that you've created an application in your B2C directory, you need to assign it the permissions it needs to peform user CRUD operations.  You'll need
to assign the application three different roles: Directory Readers (for reading users), Directory Writers (for creating & updating users), and User Account
Administrator (for deleting users).  These roles have well-known identifiers, so you can run the below commands, replacing the `-RoleMemberObjectId`
parameter with the `ObjectId` from above.  To see the list of all directory roles, try running `Get-MsolRole`.

```
> Add-MsolRoleMember -RoleObjectId 88d8e3e3-8f55-4a1e-953a-9b9898b8876b -RoleMemberObjectId <Your-ObjectId> -RoleMemberType servicePrincipal
> Add-MsolRoleMember -RoleObjectId 9360feb5-f418-4baa-8175-e2a00bac4301 -RoleMemberObjectId <Your-ObjectId> -RoleMemberType servicePrincipal
> Add-MsolRoleMember -RoleObjectId fe930be7-5e62-47db-91af-98c3a49a38b1 -RoleMemberObjectId <Your-ObjectId> -RoleMemberType servicePrincipal
```  

You now have an application that has permission to create, read, update, and delete users from your B2C directory - it's time to write some code that uses it.

## Download, configure, & build the sample code

First, lets download the sample code and get it running.  Then we can take a look at what's going on behind the scenes.  You can 
[download the sample code from GitHub](https://github.com/AzureADQuickStarts/B2C-GraphAPI-DotNet/archive/master.zip) or clone it
into a directory of your choice:

`git clone https://github.com/AzureADQuickStarts/B2C-GraphAPI-DotNet.git`

Open the `B2CGraphClient\B2CGraphClient.sln` Visual Studio solution in Visual Studio 2013.  In the `B2CGraphClient` project, open the file `App.config`.  Replace
the three app settings with your own values, like so:

```
<appSettings>
    <add key="b2c:Tenant" value="contosob2c.onmicrosoft.com" />
    <add key="b2c:ClientId" value="<The AppPrincipalId from above>" />
    <add key="b2c:ClientSecret" value="<The client secret you generated above>" />
</appSettings>
```

Now, right click on the `B2CGraphClient` solution and rebuild the sample.  If it succeeds, you should now have an executable `B2C.exe` located in `B2CGraphClient\bin\Debug`.

## User CRUD with the Graph API

To use the B2CGraphClient, open up a cmd Windows command prompt and cd to the `Debug` directory.  Then run the `B2C Help` command.

```
> cd B2CGraphClient\bin\Debug
> B2C Help
```

This will display a brief description of each command.  When you invoke any of these commands, the B2CGraphClient will make a request to the Azure AD Graph API - which
requires an access_token for authenticating requests.

### Getting an access token

The B2CGraphClient uses the open-source Active Directory Authentication Library, or ADAL, to help acquire & cache access tokens.  You certainly don't have to use ADAL to get tokens - 
you can get tokens by crafting HTTP requests yourself.  But ADAL makes token acquisition a little easier by providing a simple API and taking care of some important details,
such as caching access tokens.

> [AZURE.NOTE]
	This code sample deliberately uses ADAL v2, the generally available version of ADAL.  It does NOT use ADAL v4, which is a preview version designed for working with Azure AD B2C.
	For the Azure AD B2C preview, you must use ADAL v2 to communicate with the Graph API.  Over time, we will enable Graph API access with ADAL v4, so that you do not have to use two
	different versions of ADAL in your complete Azure AD B2C solution.

When the B2CGraphClient runs, it creates an instance of the `B2CGraphClient` class.  The constructor for this class sets ADAL's authentication scaffolding:

```C#
public B2CGraphClient(string clientId, string clientSecret, string tenant)
{
	// The client_id, client_secret, and tenant are pulled in from the App.config file
	this.clientId = clientId;
	this.clientSecret = clientSecret;
	this.tenant = tenant;

	// The AuthenticationContext is ADAL's primary class, in which you indicate the direcotry to use.
	this.authContext = new AuthenticationContext("https://login.microsoftonline.com/" + tenant);

	// The ClientCredential is where you pass in your client_id and client_secret, which are 
	// provided to Azure AD in order to receive an access_token using the app's identity.
	this.credential = new ClientCredential(clientId, clientSecret);
}
```

Let's use the `B2C Get-User` command as an example.  When `Get-User` is invoked without any additional inputs, the CLI calls the `B2CGraphClient.GetAllUsers(...)` method.
This method calls `B2CGraphClient.SendGraphGetRequest(...)`, which submits an HTTP GET request to the provided endpoint of the Graph API:

```C#
public async Task<string> SendGraphGetRequest(string api, string query)
{
	// First, use ADAL to acquire a token using the app's identity (the credential)
	// The first parameter is the resource we want an access_token for; in this case, the Graph API.
	AuthenticationResult result = authContext.AcquireToken("https://graph.windows.net", credential);

	... 

```

As you can see, you can authenticate to the Graph API by calling ADAL's `AuthenticationContext.AcquireToken(...)` method.  ADAL will return an access_token representing
the application's identity.

### Constructing the request

Continuing with the `B2C Get-User` example - the `B2CGraphClient.SendGraphGetRequest(...)` contructs the Graph API request as follows:

```C#
public async Task<string> SendGraphGetRequest(string api, string query)
{
	...
	
	// For B2C user managment, be sure to use the beta Graph API version.
	HttpClient http = new HttpClient();
	string url = "https://graph.windows.net/" + tenant + api + "?" + "api-version=beta";
	if (!string.IsNullOrEmpty(query))
	{
		url += "&" + query;
	}
	
	// Append the access token for the Graph API to the Authorization header of the request, using the Bearer scheme.
	HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, url);
	request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
	HttpResponseMessage response = await http.SendAsync(request);
	
	... 
```

Which results in an HTTP request that looks like:

```
GET https://graph.windows.net/contosob2c.onmicrosoft.com/users?api-version=beta
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod...
```   

Where the access_token acquired via ADAL has been added to the request in the authorization header.

> [AZURE.NOTE]
	The Azure AD Graph API beta version provides preview functionality.  Please refer to 
	[this Graph API team blog post](http://blogs.msdn.com/b/aadgraphteam/archive/2015/04/10/graph-api-versioning-and-the-new-beta-version.aspx) 
	for details on the beta version.

There are many other actions you can perform with the Azure AD Graph API in addition to user managment.  The 
[Azure AD Graph API Reference](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/api-catalog) provides the details of each action, along with sample requests.  

### Creating & updating consumer user accounts 

For creating & updating consumer user accounts, the B2CGraphClient includes a `B2C Create-User` and a `B2C Update-User` command.  Each command takes a `.json` file
as an input parameter (try running `B2C Syntax`).  The file contains a JSON representation of a user object and its properties.  There are two example `.json` files
included in the sample code - `usertemplate-email.json` and `usertemplate-username.json` - that you can modify to suit your needs.

Here is the contents `usertemplate-email.json`, with `//` comments describing important information about each field.  Additional information about other fields can
be found in the [Azure AD Graph API Entity Reference](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#UserEntity).

```JSON
{
	// These properties are all required for creating consumer users. 
	"accountEnabled": false,                    // always set to false
	"alternativeSignInNamesInfo": [             // controls what identifier the user uses to sign into their account
		{
			"type": "emailAddress",             // can be 'emailAddress' or 'userName'
			"value": "joeconsumer@gmail.com"
		}
	],
	"creationType": "NameCoexistence",          // always set to 'NameCoexistence'
	"displayName": "Joe Consumer",
	"mailNickname": "joec",
	"passwordProfile": {
		"password": "P@ssword!",
		"forceChangePasswordNextLogin": false   // always set to false
	},
	
	// These properties are not required for creating consumer users.
	"city": "San Diego",
	"country": null,
	"facsimileTelephoneNumber": null,
	"givenName": "Joe",
	"mail": null,
	"mobile": null,
	"otherMails": [],
	"postalCode": "92130",
	"preferredLanguage": null,
	"state": "California",
	"streetAddress": null,
	"surname": "Consumer",
	"telephoneNumber": null
}
```

To create a user with the template JSON files, try: 

`> B2C Create-User ..\..\..\usertemplate-email.json`

Which should result in a request like:

```
POST https://graph.windows.net/contosob2c.onmicrosoft.com/users?api-version=beta
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod...
Content-Type: application/json

{ <the-json-object> }
```

Similarly, to update a user with the template JSON files, use:

`> B2C Update-User <user-object-id> ..\..\..\usertemplate-username.json`
	
Which should result in a request like:

```
PATCH https://graph.windows.net/contosob2c.onmicrosoft.com/users/<user-object-id>?api-version=beta
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod...
Content-Type: application/json

{ <the-json-object> }
```

### Deleting users

Deleting a user is staightfoward - just like reading users, you need to get an access token, construct the HTTP request, and append the access token to the request.
To see an example, try the below command and view the resulting DELETE request that is printed to the console:

`> B2C Delete-User <object-id-of-user>`

The resulting Graph API request should look like:

```
DELETE https://graph.windows.net/contosob2c.onmicrosoft.com/users?api-version=beta
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod...
```

## Using Custom Attributes

Almost every consumer application needs to store some type of custom user profile information.  One way to do this is to define a custom attribute in your B2C directory,
which will allow you to treat that attribute just like any other property on a user object.  You can update the attribute, delete the attribute, query by the attribute, 
send the attribute as a claim in sign in tokens, and so on.  

To define a custom attribute in your B2C directory, see the [B2C Preview Custom Attribute Reference](active-directory-b2c-reference-custom-attr.md).

You can view the custom attributes defined in your B2C directory by using the B2CGraphClient:

```
> B2C Get-B2C-Application
> B2C Get-Extension-Attribute <object-id-output-by-the-above-command>
```

The output of these functions will reveal the details of each custom attribute, such as:

```JSON
{
      "odata.type": "Microsoft.DirectoryServices.ExtensionProperty",
      "objectType": "ExtensionProperty",
      "objectId": "cec6391b-204d-42fe-8f7c-89c2b1964fca",
      "deletionTimestamp": null,
      "appDisplayName": "",
      "name": "extension_55dc0861f9a44eb999e0a8a872204adb_Jersey_Number",
      "dataType": "Integer",
      "isSyncedFromOnPremises": false,
      "targetObjects": [
        "User"
      ]
}
```

You can use the full name, such as `extension_55dc0861f9a44eb999e0a8a872204adb_Jersey_Number` as a property on your user objects.  Simply update your `.json` file with the new
property, a value for the property, and run:

`> B2C Update-User <object-id-of-user> <path-to-json-file>`


And that's it!  With the B2CGraphClient, you now have a service application that can manage your B2C directory users programatically.  It uses its own application identity to 
authenticate to the Azure AD Graph API, and acquires tokens using a client_secret.  As you incorporate this functionality into your own application, remember a few key points
for B2C apps:

- You need to grant the application the proper permissions in the directory
- For now, you need to use ADAL v2 to get access tokens (or you can send protocol messages directly, without a library)
- When calling the Graph API, use [`api-version=beta`](http://blogs.msdn.com/b/aadgraphteam/archive/2015/04/10/graph-api-versioning-and-the-new-beta-version.aspx).
- When creating & updating consumer users, there are a few required properties, described above.

If you have any questions or requests for actions you would like to perform with the Graph API on your B2C directory, we're all ears!  Please leave a comment on the artice
or file an issue in the code sample GitHub repo.