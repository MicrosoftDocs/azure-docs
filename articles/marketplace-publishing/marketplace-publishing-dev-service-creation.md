<properties
   pageTitle="Create a developer service for the Azure Marketplace | Microsoft Azure"
   description="How to guide for creating a developer to sell in the Azure Marketplace."
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace-publishing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="Azure"
   ms.workload="na"
   ms.date="10/01/2015"
   ms.author="hascipio; v-shresh"/>

# Guide to creating a developer service for the Azure Marketplace

This article is step 2 in the publishing process and guides you through the creation of your resource provider which is the foundation of your developer service offer that you will publish into the Microsoft Azure Marketplace.  

> [AZURE.WARNING] You must be an approved seller to complete the publishing process of an offering into the Azure Marketplace and receive payout. If you have already released an app you may already be an approved seller. You only need one approved seller account to sell apps and services in Microsoft Marketplaces.

## 3.1 Create a resource provider
### 3.1.1 Create Azure Storage & Queues for RP & Usage
1. Navigate to https://portal.azure.com/.
2.	Sign in with MSA and Azure Subscription (from Part 1 – Non-Technical steps).
3.	(Once Portal Loads) Confirm in the top right that the Azure Subscription and Tenant (aka Directory) selected is correct.
4.	Navigate to “+NEW” (top left of portal)
5.	Select “Data + Storage”
6.	Select “Storage”
7.	Provide the required Azure Storage settings/configurations such as Storage Account name, pricing, etcetera.

  >	[AZURE.TIP] – when naming Azure Storage follow these naming rules http://blogs.msdn.com/b/jmstall/archive/2014/06/12/azure-storage-naming-rules.aspx


>**Kind:**	Storage Account

>**Length Casing:** 3-24

>**Valid chars:** 3-24

>FYI — The RP .vsix will create all the tables and queues for e.g. Usage Table, Usage Queue, Error Table, and Error Queue under the provided Azure Storage Account using these naming rules):

><RPNamespaceInLowerCaseHashedTo26chars><ServiceInLowerCaseHashedTo26chars><ResourceTypeLowerCaseHashedTo26chars]>usagetable

><RPNamespaceInLowerCaseHashedTo26chars><ServiceInLowerCaseHashedTo26chars><ResourceTypeLowerCaseHashedTo26chars> usagequeue

><RPNamespaceInLowerCaseHashedTo26chars><ServiceInLowerCaseHashedTo26chars><ResourceTypeLowerCaseHashedTo26chars> errortable

><RPNamespaceInLowerCaseHashedTo26chars><ServiceInLowerCaseHashedTo26chars><ResourceTypeLowerCaseHashedTo26chars> errorqueue

>–ResourceProviderNamespace (aka PublisherNamespace), Service and ResourceType should not exceed 26 characters each.  Please let Microsoft onboarding team know if this is the case so we can resolve this before moving forward.

8. Navigate to [Publisher Portal](https://publish.windowsazure.com/) and input the correct details for the storage account under “Resource Providers” tab and “Metering Storage Account” section.  Specifically, you need a staging and production Azure Storage Account Name and Key.Note

> [AZURE.NOTE] Download Azure Storage Explorer:  http://azurestorageexplorer.codeplex.com/  to manage your storage account.

### 3.1.2 Create a C# Resource Provider
**Requirements**

*	VS2013 (with VS2013.4 Patch) or higher
*	Azure Resource Provider Template (.vsix)

**Instructions**

1.	Open Visual Studio 2013 --> New Project--> Select Visual C#-->  “Application Service Resource Provider”
2.	Provide your Resource Provider (RP) project name and location as required and click ok
3.	A dialogue will prompt for the required RP information similar to below (this will be values that you have or will enter into Publisher Portal: https://portal.azure.com/).
Note – you can always update these values in the “Global.asax” file.
4.	This will create the following project hierarchy:
5.	Right click on project and go to properties and under “build” make sure the output path is “bin\” (as opposed to “bin\debug\”) as shown below:
6.	Implement the following methods:

  **File Name:** MarketplaceRequestHandler.cs
  * ProvisionResource
  *	DeprovisionResource
  *	UpgradeResource
  *	RegenerateKey
  *	istSecretes
  *	ResumeResource
  *	SuspendResource

  **File Name:** CommunicationPreferenceController.cs
  *	UpdateCommunicationPreference
  *	GetCommunicationPreference

7. After implementing each method of your RP you should test locally by building & deploying and using the Mock Tool.  Refer to next step.
8.	Once all methods are implemented do one file Mock Tool test.

	>	Call the validate contracts method in Mock tool.

Once Mock Tool tests have passed, to Step 3.3 and test the validate contracts against Azure website endpoint.

## 3.2 Deploy resource provider
### 3.2.1 Deploy resource provider as Azure websites
1. Navigate to the [Azure Management Portal](https://portal.azure.com/).
2.	Sign in with MSA and Azure Subscription (from Part 1 – Non-Technical steps).
3.	(Once Portal Loads) Confirm in the top right that the Azure Subscription and Tenant (aka Directory) selected is correct.
4.	Navigate to “+NEW” (top left of portal)
5.	Select “Web + Mobile”
6.	Select “Web App”
7.	Provide the required Azure Storage settings/configurations such as website name subscription etc.
8.	For Developer Service Plan, create new
9.	Fill in the required details, but make sure you select a plan higher than Free or Shared.

    ![drawing][img-site-details]

10. Create the website.

### 3.2.2 Enabling SSL on Azure Websites
The steps to enable SSL on azure websites is given [here.][link-ssl]

**Overview**

You can restrict access to your Azure web app by enabling different types of authentication for it. One way to do so is to authenticate using a client certificate when the request is over TLS/SSL. This mechanism is called TLS mutual authentication or client certificate authentication and this article will detail how to setup your web app to use client certificate authentication.

**Configure Web App for Client Certificate Authentication**

To setup your web app to require client certificates you need to add the clientCertEnabled site setting for your web app and set it to true. This setting is not currently available through the management experience in the portal, and the REST API will need to be used to accomplish this.

You can use the ARMClient tool to make it easy to craft the REST API call. After you log in with the tool you will need to issue the following command:

Copy

> ARMClient PUT subscriptions/{Subscription Id}/resourcegroups/{Resource Group Name}/providers/Microsoft.Web/sites/{Website Name}?api-version=2015-04-01 @enableclientcert.json -verbose

replacing everything in {} with information for your web app and creating a file called enableclientcert.json with the following JSON content:

	{ "location": "My Web App Location",
	"properties": {
	"clientCertEnabled": true } }

Make sure to change the value of "location" to wherever your web app is located e.g. North Central US or West US etc.

Accessing the Client Certificate From Your Web App
When your web app is configured to use client certificate authentication, the client cert will be available in your app through a base64 encoded value in the "X-ARR-ClientCert" request header. Your application can create a certificate from this value and then use it for authentication and authorization purposes in your application.

## Next Step
Now that you have created and deployed the resource provider for your developer service, you can move forward with step 4, [Getting Your Offer to Staging][link-pushstaging] which entails business processes of setting marketing content and pricing and technical processes of testing and certification of the offer.

[img-site-details]:media/marketplace-publishing-dev-service-creation/dev-services-create-and-deploy-resourceprovider-as-azurewebsites.jpg
[link-ssl]:http://azure.microsoft.com/blog/2015/07/02/enabling-client-certificate-authentication-for-an-azure-web-app/
[link-acct-creation]:marketplace-publishing-accounts-creation-registration.md
[link-pushstaging]:marketplace-publishing-push-to-staging.md
