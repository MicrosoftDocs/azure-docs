<properties 
	pageTitle="Connecting to Media Services Account using .NET" 
	description="This topic demonstrates how to connect to Media Services uisng .NET." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/03/2015" 
	ms.author="juliako"/>


# Connecting to Media Services Account using Media Services SDK for .NET

This article is part of the [Media Services Video on Demand workflow](media-services-video-on-demand-workflow.md) and [Media Services Live Streaming workflow](media-services-live-streaming-workflow.md) series. 

This topic describes how to obtain a programmatic connection to Microsoft Azure Media Services when you are programming with the Media Services SDK for .NET.


## Connecting to Media Services

To connect to Media Services programmatically, you must have previously set up an Azure account, configured Media Services on that account, and then set up a Visual Studio project for development with the Media Services SDK for .NET. For more information, see Setup for Development with the Media Services SDK for .NET.

At the end of the Media Services account setup process, you obtained the following required connection values. Use these to make programmatic connections to Media Services.

- Your Media Services account name.

- Your Media Services account key.

To find these values, go to the Azure Managment Portal, select your Media Service account, and click on the “**MANAGE KEYS**” icon on the bottom of the portal window. Clicking on the icon next to each text box copies the value to the system clipboard.


## Creating a CloudMediaContext Instance

To start programming against Media Services you need to create a **CloudMediaContext** instance that represents the server context. The **CloudMediaContext** includes references to important collections including jobs, assets, files, access policies, and locators.

>[AZURE.NOTE] The **CloudMediaContext** class is not thread safe. You should create a new CloudMediaContext per thread or per set of operations.


CloudMediaContext has five constructor overloads. It is recommended to use constructors that take **MediaServicesCredentials** as a parameter. For more information, see the **Reusing Access Control Service Tokens** that follows. 

The following example uses the public CloudMediaContext(MediaServicesCredentials credentials) constructor:

	// _cachedCredentials and _context are class member variables. 
	_cachedCredentials = new MediaServicesCredentials(
	                _mediaServicesAccountName,
	                _mediaServicesAccountKey);
	
	_context = new CloudMediaContext(_cachedCredentials);


## Reusing Access Control Service Tokens

This section shows how to reuse Access Control Service tokens by using CloudMediaContext constructors that take MediaServicesCredentials as a parameter.


[Azure Active Directory Access Control](https://msdn.microsoft.com/library/hh147631.aspx) (also known as Access Control Service or ACS) is a cloud-based service that provides an easy way of authenticating and authorizing users to gain access to their web applications. Microsoft Azure Media Services controls access to its services though OAuth protocol that requires an ACS token. Media Services receives the ACS tokens from an authorization server.

When developing with the Media Services SDK, you can choose to not deal with the tokens because the SDK code managers them for you. However, letting the SDK fully manage the ACS tokens leads to unnecessary token requests. Requesting tokens takes time and consumes the client and server resources. Also, the ACS server throttles the requests if the rate is too high. The limit is 30 requests per second, see [ACS Service Limitations](https://msdn.microsoft.com/library/gg185909.aspx) for more details.

Starting with the Media Services SDK version 3.0.0.0, you can reuse the ACS tokens. The **CloudMediaContext** constructors that take **MediaServicesCredentials** as a parameter enable sharing the ACS tokens between multiple contexts. The MediaServicesCredentials class encapsulates the Media Services credentials. If an ACS token is available and its expiration time is known, you can create a new MediaServicesCredentials instance with the token and pass it to the constructor of CloudMediaContext. Note that the Media Services SDK automatically refreshes tokens whenever they expire. There are two ways to reuse ACS tokens, as shown in the examples below.

- You can cache the **MediaServicesCredentials** object in memory (for example, in a static class variable). Then, pass the cached object to the CloudMediaContext constructor. The MediaServicesCredentials object contains an ACS token that can be reused if it is still valid. If the token is not valid, it will be refreshed by the Media Services SDK using the credentials given to the MediaServicesCredentials constructor.

	Note that the **MediaServicesCredentials** object gets a valid token after the RefreshToken is called. The **CloudMediaContext** calls the **RefreshToken** method in the constructor. If you are planning to save the token values to an external storage, make sure to check whether the TokenExpiration value is valid before saving the token data. If it is not valid, call RefreshToken before caching.

		// Create and cache the Media Services credentials in a static class variable.
		_cachedCredentials = new MediaServicesCredentials(_mediaServicesAccountName, _mediaServicesAccountKey);

		
		// Use the cached credentials to create a new CloudMediaContext object.
		if(_cachedCredentials == null)
		{
		    _cachedCredentials = new MediaServicesCredentials(_mediaServicesAccountName, _mediaServicesAccountKey);
		}
		
		CloudMediaContext context = new CloudMediaContext(_cachedCredentials);

- You can also cache the AccessToken string and the TokenExpiration values. The values could later be used to create a new MediaServicesCredentials object with the cached token data.  This is especially useful for scenarios where the token can be securely shared among multiple processes or computers.

	The following code snippets call the SaveTokenDataToExternalStorage, GetTokenDataFromExternalStorage, and UpdateTokenDataInExternalStorageIfNeeded methods that are not defined in this example. You could define these methods to store, retrieve, and update token data in an external storage. 

		CloudMediaContext context1 = new CloudMediaContext(_mediaServicesAccountName, _mediaServicesAccountKey);
		
		// Get token values from the context.
		var accessToken = context1.Credentials.AccessToken;
		var tokenExpiration = context1.Credentials.TokenExpiration;
		
		// Save token values for later use. 
		// The SaveTokenDataToExternalStorage method should check 
		// whether the TokenExpiration value is valid before saving the token data. 
		// If it is not valid, call MediaServicesCredentials’s RefreshToken before caching.
		SaveTokenDataToExternalStorage(accessToken, tokenExpiration);
		
	Use the saved token values to create MediaServicesCredentials.


		var accessToken = "";
		var tokenExpiration = DateTime.UtcNow;
		
		// Retrieve saved token values.
		GetTokenDataFromExternalStorage(out accessToken, out tokenExpiration);
		
		// Create a new MediaServicesCredentials object using saved token values.
		MediaServicesCredentials credentials = new MediaServicesCredentials(_mediaServicesAccountName, _mediaServicesAccountKey)
		{
		    AccessToken = accessToken,
		    TokenExpiration = tokenExpiration
		};
		
		CloudMediaContext context2 = new CloudMediaContext(credentials);

	Update the token copy in case the token was updated by the Media Services SDK. 
	
		if(tokenExpiration != context2.Credentials.TokenExpiration)
		{
		    UpdateTokenDataInExternalStorageIfNeeded(accessToken, context2.Credentials.TokenExpiration);
		}
		

- If you have multiple Media Services accounts (for example, for load sharing purposes or Geo-distribution) you can cache MediaServicesCredentials objects using the System.Collections.Concurrent.ConcurrentDictionary collection (the ConcurrentDictionary collection represents a thread-safe collection of key/value pairs that can be accessed by multiple threads concurrently). You can then use the GetOrAdd method to get the cached credentials. 

		// Declare a static class variable of the ConcurrentDictionary type in which the Media Services credentials will be cached.  
		private static readonly ConcurrentDictionary<string, MediaServicesCredentials> mediaServicesCredentialsCache = 
		    new ConcurrentDictionary<string, MediaServicesCredentials>();
		

		// Cache (or get already cached) Media Services credentials. Use these credentials to create a new CloudMediaContext object.
		static public CloudMediaContext CreateMediaServicesContext(string accountName, string accountKey)
		{
		    CloudMediaContext cloudMediaContext;
		    MediaServicesCredentials mediaServicesCredentials;
		
		    mediaServicesCredentials = mediaServicesCredentialsCache.GetOrAdd(
		        accountName,
		        valueFactory => new MediaServicesCredentials(accountName, accountKey));
		
		    cloudMediaContext = new CloudMediaContext(mediaServicesCredentials);
		
		    return cloudMediaContext;
		}
		
## Connecting to a Media Services account located in the North China region

If your account is located in the North China region, use the following constructor:

	public CloudMediaContext(Uri apiServer, string accountName, string accountKey, string scope, string acsBaseAddress)

For example:


	_context = new CloudMediaContext(
	    new Uri("https://wamsbjbclus001rest-hs.chinacloudapp.cn/API/"),
	    _mediaServicesAccountName,
	    _mediaServicesAccountKey,
	    "urn:WindowsAzureMediaServices",
	    "https://wamsprodglobal001acs.accesscontrol.chinacloudapi.cn");


## Storing Connection Values in Configuration

It is a highly recommended practice to store connection values, especially sensitive values such as your account name and password, in configuration. Also, it is a recommended practice to encrypt sensitive configuration data. You can encrypt the entire configuration file by using the Windows Encrypting File System (EFS). To enable EFS on a file, right-click the file, select **Properties**, and enable encryption in the **Advanced** settings tab. Or you can create a custom solution for encrypting selected portions of a configuration file by using protected configuration. See [Encrypting Configuration Information Using Protected Configuration](https://msdn.microsoft.com/library/53tyfkaw.aspx).

The following App.config file contains the required connection values. The values in the <appSettings> element are the required values that you got from the Media Services account setup process.


<pre><code>
&lt;configuration&gt;
    &lt;appSettings&gt;
	&lt;add key="MediaServicesAccountName" value="Media-Services-Account-Name" /&gt;
    	&lt;add key="MediaServicesAccountKey" value="Media-Services-Account-Key" /&gt;
    &lt;/appSettings&gt;
&lt;/configuration&gt;
</code></pre>

To retrieve connection values from configuration, you can use the **ConfigurationManager** class and then assign the values to fields in your code:
	
	private static readonly string _accountName = ConfigurationManager.AppSettings["MediaServicesAccountName"];
	private static readonly string _accountKey = ConfigurationManager.AppSettings["MediaServicesAccountKey"];


<!-- Anchors. -->


<!-- URLs. -->
