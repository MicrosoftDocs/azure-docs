<properties title="ISS endpoints and access keys" pageTitle="ISS endpoints and access keys" description="Learn about the endpoints and access keys in ISS." metaKeywords="Intelligent Systems,ISS,IoT,endpoint,access key" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" manager="alanth" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" ms.prod="azure">

#ISS endpoints and access keys
Endpoints and access keys provide access to your Azure Intelligent Systems Service (ISS) account.  

**Sections in this article:**  

-	[Where to get your endpoints and access keys](#subheading1)
-	[Endpoints](#subheading2)
-	[Access keys](#subheading3)
-	[Connect to the data endpoint](#subheading4)
-	[Sample connection settings](#subheading5)

##<a name="subheading1"></a>Where to get your endpoints and access keys

|To get your	|Go to |
|---------------|------|-	
|Management and device endpoints	|•	Azure portal > your ISS account > dashboard</br>**-OR-**</br>•	ISS management portal > **Settings** > **Access keys**|![][1]</br>**-OR-**</br>![][2]
|Data endpoint	|ISS management portal > **Settings** > **Access keys**|![][2] 
|Management and device endpoint access keys	|Azure portal > your ISS account > **Manage access keys**|![][3]	 
|Data endpoint access key	|•	Azure portal > your ISS account > **Manage access keys**</br>**-OR-**</br>•	ISS management portal > **Settings** > **Access keys**|![][3]</br>**-OR-**</br>![][2]
 

##<a name="subheading2"></a>Endpoints
When you create an Azure Intelligent Systems Service (ISS) account, the following endpoints are created for your use. A developer can use these endpoints with the ISS APIs to configure and build device applications that connect to ISS.  

-	**Management endpoint**  
	Use this endpoint to access the management endpoint REST APIs. The management endpoint is used to configure your account, such as by uploading schemas, pre-registering devices, and querying and managing alarms. The management endpoint will be   
	**[ISS-account-name].management.intelligentsystems.azure.net/core**
-	**Device endpoint**  
	Your devices will connect to the device endpoint, which may also be referred to as the *ingress endpoint* or the *front door endpoint*. The device endpoint REST APIs allow a device to register itself with ISS. Upon registration, the device obtains an initial security token. This token is used to provide the device with additional endpoints and authorization to access Service Bus entities which are used for bidirectional communication with the service. The device endpoint is used to renew these tokens. The device endpoint will be  
	**[ISS-account-name].device.intelligentsystems.azure.net**
-	**Data endpoint**  
	Connect to the data endpoint to retrieve the data that your devices send to ISS. The data endpoint will be   
	**[ISS-account-name].data.intelligentsystems.azure.net/data.svc**

##<a name="subheading3"></a>Access keys
Each endpoint is assigned an access key. The access key provides authorization for access to the endpoint. Each access key confers different permissions to communicate with the service endpoints and perform different operations.  

-  **Management endpoint access key**  
	A management endpoint access key allows a caller to perform any operation against any of the service endpoints. It confers administrator rights to the account.
 
-	**Device endpoint access key**  
	A device endpoint access key allows a caller to register devices and renew device-specific tokens. It can only be used to access the device endpoint.  
 
	You can also pre-register devices in the ISS management portal and download per-device security tokens, rather than using the device endpoint access key. Read [Best practices for device registration](./iss-best-practice-device-registration.md) to learn why we recommend that you use per-device security tokens rather than device endpoint access keys on your devices. Read [Register multiple devices in ISS](./iss-device-registration-portal.md) to learn how to obtain security tokens.
-	**Data endpoint access key**  
	A data endpoint access key allows a caller to perform any query operation available from both the management endpoint and the data endpoint. See [Connect to the data endpoint]() for tips on using different programs to connect to the data endpoint.  

The access keys are generated when you create your ISS account. You can get your access keys for your ISS account in the Azure portal. The access keys for the management and device endpoints are only available in the Azure portal. The data endpoint access key is available in the Azure portal and in **Settings** in the ISS management portal.  

When you view your access keys in the Azure portal, notice the **Regenerate** button. In the event of a security breach, you can regenerate the access keys for any endpoint. Keep in mind that any device or application that uses that endpoint will be unable to connect until it is reconfigured with the new access key.  

>[AZURE.NOTE]The act of regenerating an access key cannot be undone.  

##<a name="subheading4"></a>Connect to the data endpoint
The data endpoint requires different authorization methods depending on how you connect to it. The following table provides some tips for connecting to the data endpoint through different programs, and it gives links to more detailed information.

|&nbsp;|&nbsp;
|------|-----
|**Use Microsoft Power Query for Excel to connect to the endpoint**|	Copy the **URI** and paste it into the OData feed URL field. Enter your **[ISS-account-name]** in the **Username** field. Copy the **Primary access key** and paste it into the **Password** field.</br></br>See [Retrieve your data with Power Query](./iss-retrieve-odata-feed.md) for complete instructions.
|**Use HTTP requests (through the REST APIs) to connect to the endpoint**	|The **Authorization header** is the Base64-encoded string required for HTTP basic authentication. Use this string for the **Authorization** in your request header (`Authorization: Basic <Authorization header>`).</br></br>For more information about how to use the REST APIs, see [Data Endpoint REST APIs]().</br></br> >[AZURE.NOTE] The data endpoint uses standard HTTP basic authentication, which requires a Base64-encoded authorization header. The **Authorization header** is constructed as **[ISS-account-name]:[Data access key**, and then encoded as Base64. In the example settings, the authorization header is *TreyResearch:opqrst456789def*, encoded as Base64. For more information about basic authentication, see S[ection 11.1 of the HTTP/1.0 standard](http://go.microsoft.com/fwlink/p/?LinkId=506635).</br></br>For information about how to convert text to Base64 in .NET, see [Convert.ToBase64String Method](http://go.microsoft.com/fwlink/p/?LinkId=506636) on MSDN. For information about how to convert text to Base64 in JavaScript, see [Window.btoa](http://go.microsoft.com/fwlink/p/?LinkId=506637) on the Mozilla Developer Network.
 

##<A note="subheading5"></a>Sample connection settings
The following table shows the example connection settings that are used throughout the documentation

|Item	|Value used in the examples
|-------|--------------------------
|Account name:	|treyresearch
|Data endpoint	|https://treyresearch.data.intelligentsystems.azure.net/data.svc
|Data access key	|opqrst456789def
|Authorization header for HTTP requests	|VHJleVJlc2VhcmNoOm9wcXJzdDQ1Njc4OWRlZg==
|Management endpoint	|https://treyresearch.management.intelligentsystems.azure.net/core 
|Management access key	|abcdegf123456xyz
|Device endpoint	|https://treyresearch.device.intelligentsystems.azure.net
|Device access key	|hijklmn7890123abc

##See Also
[Retrieve and analyze your ISS data]()

[1]: ./media/iss-endpoints-access-keys/iss-endpoints-access-keys-01.png
[2]: ./media/iss-endpoints-access-keys/iss-endpoints-access-keys-02.png
[3]: ./media/iss-endpoints-access-keys/iss-endpoints-access-keys-03.png
