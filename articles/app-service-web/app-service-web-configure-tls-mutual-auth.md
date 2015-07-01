<properties 
	pageTitle="How To Configure TLS Mutual Authentication for Web App" 
	description="Learn how to configure your web app to use client certificate authentication on TLS." 
	services="app-service\web" 
	documentationCenter="" 
	authors="naziml" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/24/2015" 
	ms.author="naziml"/>	

# How To Configure TLS Mutual Authentication for Web App

## Overview ##
You can restrict access to your Azure web app by enabling different types of authentication for it. One way to do so is to authenticate using a client certificate when the request is over TLS/SSL. This mechanism is called TLS mutual authentication or client certificate authentication and this article will detail how to setup your web app to use client certificate authentication.

## Configure Web App for Client Certificate Authentication ##
To setup your web app to require client certificates you need to add the clientCertEnabled site setting for your web app and set it to true. This setting is not currently available through the management experience in the portal, and the REST API will need to be used to accomplish this.

You can use the [ARMClient tool](https://github.com/projectkudu/ARMClient) to make it easy to craft the REST API call. After you log in with the tool you will need to issue the following command:

    ARMClient PUT subscriptions/{Subscription Id}/resourcegroups/{Resource Group Name}/providers/Microsoft.Web/sites/{Website Name}?api-version=2015-04-01 @enableclientcert.json -verbose
    
replacing everything in {} with information for your web app and creating a file called enableclientcert.json with the following JSON content:

> {
>   "location": "My Web App Location",   
>   "properties": 
>   {  
>     "clientCertEnabled": true
>   }
> }  


Make sure to change the value of "location" to wherever your web app is located e.g. North Central US or West US etc.


## Accessing the Client Certificate From Your Web App ##
When your web app is configured to use client certificate authentication, the client cert will be available in your app through a base64 encoded value in the "X-ARR-ClientCert" request header. Your application can create a certificate from this value and then use it for authentication and authorization purposes in your application.

## Special Considerations for Certificate Validation ##
The client certificate that is sent to the application does not go through any validation by the Azure Web Apps platform. Validating this certificate is the responsibility of the web app.

 