<properties
   pageTitle="Resource Manager SDK for Ruby| Microsoft Azure"
   description="An overview of the Azure Resource Manager SDK for Ruby with authentication and other code samples"
   services="azure-resource-manager"
   documentationCenter="na"
   authors="allclark"
   manager="douge"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="ruby"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/28/2016"
   ms.author="allclark"/>
   
# Azure Resource Manager SDK for Ruby

> [AZURE.SELECTOR]
- [Java](resource-manager-java-sdk.md)
- [Node.js](https://github.com/Azure/azure-sdk-node)
- [Python](https://github.com/Azure/azure-sdk-for-python)
- [Ruby](https://github.com/Azure/azure-sdk-ruby)
- [PHP](https://github.com/Azure/azure-sdk-for-php)
- [Go](https://github.com/Azure/azure-sdk-for-go)
- [.NET](resource-manager-dotnet-sdk.md)
   
Azure Resource Manager (ARM) Preview SDKs are available for multiple languages and platforms. Each of these language implementations 
are available through their ecosystem package managers and GitHub.

The Azure Resource Manager Ruby SDK Preview is hosted in GitHub [Azure Ruby SDK repository](https://github.com/azure/azure-sdk-for-ruby).
You'll need an [Azure account](http://azure.com) and [Ruby](https://www.ruby-lang.org) to use the SDK.

Check [Azure Code Samples](https://azure.microsoft.com/documentation/samples/?platform=ruby) for examples of how to use the SDK.

## Authentication

Authentication for ARM is handled by Azure Active Directory (AD). In order to connect to any API you first need to authenticate 
with Azure AD to receive an authentication token that you can pass on to every request. To get this token you first need to create 
what is called an Azure AD Application and a Service Principal that will be used to login with. 
Follow [Create Azure AD Application and Service Principle](./resource-group-create-service-principal-portal.md) for step by step instructions.

After creating the service principal, you should have:

* Client id (GUID)
* Client secret (string)
* Tenant id (GUID) or domain name (string)

Once you have this values, you can obtain an Active Directory Access Token, valid for one hour.

The Ruby SDK include a helper class AuthHelper that creates the access token, once provided with the client id, secret and tenant id.
The following example, in the [ServicePrincipalExample](https://github.com/Azure/azure-sdk-for-ruby/blob/master/azure-mgmt-samples/src/main/Ruby/com/microsoft/azure/samples/authentication/ServicePrincipalExample.Ruby) class,
uses the AuthHelper *getAccessTokenFromServicePrincipalCredentials* method to obtain the access token:

```Ruby
public static Configuration createConfiguration() throws Exception {
   String baseUri = System.getenv("arm.url");

   return ManagementConfiguration.configure(
         null,
         baseUri != null ? new URI(baseUri) : null,
         System.getenv(ManagementConfiguration.SUBSCRIPTION_ID),
         AuthHelper.getAccessTokenFromServicePrincipalCredentials(
                  System.getenv(ManagementConfiguration.URI), System.getenv("arm.aad.url"),
                  System.getenv("arm.tenant"), System.getenv("arm.clientid"),
                  System.getenv("arm.clientkey"))
                  .getAccessToken());
}
```

## Support
If you encounter any bugs with the SDK please [file an issue](https://github.com/Azure/azure-sdk-for-ruby/issues)
or check out [StackOverflow for Azure Ruby SDK](http://stackoverflow.com/questions/tagged/azure-ruby-sdk).
