<properties
   pageTitle="Create a developer service for the Azure Marketplace | Microsoft Azure"
   description="How to guide for creating a developer to sell in the Azure Marketplace."
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="Azure"
   ms.workload="na"
   ms.date="01/04/2016"
   ms.author="hascipio; v-shresh"/>

# Guide to creating a developer service for the Azure Marketplace

This article is step 2 in the publishing process and guides you through the creation of your resource provider which is the foundation of your developer service offer that you will publish into the Microsoft Azure Marketplace.  

> [AZURE.WARNING] You must be an approved seller to complete the publishing process of an offering into the Azure Marketplace and receive payout. If you have already released an app you may already be an approved seller. You only need one approved seller account to sell apps and services in Microsoft Marketplaces.

## 3.1 Create a resource provider
### 3.1.1 Create Azure Storage & Queues for RP & Usage
1. Navigate to [https://portal.azure.com/](https://portal.azure.com/).
2. Sign in with MSA and Azure Subscription (from Part 1 – Non-Technical steps).
3. (Once Portal Loads) Confirm in the top right that the Azure Subscription and Tenant (aka Directory) selected is correct.
4. Navigate to “+NEW” (top left of portal)
5. Select “Data + Storage”
6. Select “Storage”
7. Provide the required Azure Storage settings/configurations such as Storage Account name, pricing, etcetera.

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

> [AZURE.NOTE] Download Azure Storage Explorer:  [http://azurestorageexplorer.codeplex.com/](http://azurestorageexplorer.codeplex.com/)  to manage your storage account.

### 3.1.2 Create a C# Resource Provider
**Requirements**

-	VS2013 (with VS2013.4 Patch) or higher
-	Azure Resource Provider Template (.vsix)

**Instructions**

1.	Open Visual Studio 2013 --> New Project--> Select Visual C#-->  “Application Service Resource Provider”

2.	Provide your Resource Provider (RP) project name and location as required and click ok

3.	A dialogue will prompt for the required RP information similar to below (this will be values that you have or will enter into Publisher Portal: [https://portal.azure.com/](https://portal.azure.com/)).

    >[AZURE.NOTE] You can always update these values in the “Global.asax” file.

4.	This will create the following project hierarchy:

5.	Right click on project and go to properties and under “build” make sure the output path is “bin\” (as opposed to “bin\debug\”) as shown below:

6.	Implement the following methods:

  **File Name:** MarketplaceRequestHandler.cs
  * ProvisionResource
  *	DeprovisionResource
  *	UpgradeResource
  *	RegenerateKey
  *	ListSecretes
  *	OnSubscriptionNotification
  *	UpdateCommunicationPreference
  *	GetCommunicationPreference
  *	GetSingleSignonToken

7. After implementing each method of your RP you should test locally by building & deploying and using the Mock Tool.  Refer to next step.

8.	Once all methods are implemented do one file Mock Tool test.

	>	Call the validate contracts method in Mock tool.

Once Mock Tool tests have passed, to Step 3.2 and test the validate contracts against Azure website endpoint.

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

*Copy*

> ARMClient PUT subscriptions/{Subscription Id}/resourcegroups/{Resource Group Name}/providers/Microsoft.Web/sites/{Website Name}?api-version=2015-04-01 @enableclientcert.json -verbose

replacing everything in {} with information for your web app and creating a file called enableclientcert.json with the following JSON content:

	{ "location": "My Web App Location",
	"properties": {
	"clientCertEnabled": true } }

Make sure to change the value of "location" to wherever your web app is located e.g. North Central US or West US etc.

Once this is done, You just make sure you enter the ARM certificate thumbprint in Global.asax in the VSIX project you created. The VSIX will handle the cert authorization.

## 3.3 Connect your RP endpoint to your Marketplace offer
### Step 1. Login to the Publishing Portal
Go to [https://publish.windowsazure.com](https://publish.windowsazure.com)

>[AZURE.NOTE] For first time login to Publishing Portal, use the same account with which your company’s Seller Profile was registered in Developer Center. (Later you can add any employee of your company as a co-admin in the Publishing Portal).

Click on the **Publish a Developer Service** tile if this is the first login to the Publishing Portal.

### Step 2. Choose **Developer Services** in the navigation menu on the left side

### Step 3. Create a new Developer Service
Fill in the title of your new developer service offer and click **"+"** on the right.

### Step 4. Review the sub-menu under the newly created Developer Service in the navigation Menu
Click on the **Walkthrough** tab and review all necessary steps needed to publish properly the Developer Service on the Azure Marketplace.

>[AZURE.TIP] You can always click on the links in the "Walkthrough" page or use tabs on the Developer Service offer's sub-menu on the left side

### Step 5. Create a new plan
**Offers, Plans, Transactions**

Each offer can have multiple plans, but must have at least one (1) plan. When end-users subscribe to your offer they subscribe for one of the offer’s plan. Each plan defines how end-users will be able to use your service.

Currently Azure Marketplace support only *Monthly Subscription Transaction Based model* for Developer Services, i.e. end-users will pay monthly fee according to the price of the specific plan they subscribed to and will be able to consume each month number of transaction defined by the plan.

Each transaction usually defined as number of records your developer service will return based on the query sent to the service.

**Create a new plan**
1. Click on **"+"** next to the **"Add a new plan"**

2. ...

### Step 6. Connect your RP endpoint to your Service
1. Click **Resource Provider** in the left navigation menu

2. Enter **ARM Company Identifier**

3. Enter **ARM Product Identifier**

4. Choose **ARM Resource Type**

5. Enter or edit **Publisher Namespace**

6. Enter **Product Namespace**

7. Click **"+"** next to "Add an ARM Resource Provider Endpoint"

8. Enter **Staging URL**

9. Enter **Production URL**

10. Select **Endpoint Location**

11. Click **Validate**

## Next Step
Now that you have created and deployed the resource provider for your developer service, you can move forward with step 4, [Getting Your Offer to Staging][link-pushstaging] which entails business processes of setting marketing content and pricing and technical processes of testing and certification of the offer.

## See Also
- [Getting Started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

[img-site-details]:media/marketplace-publishing-dev-service-creation/dev-services-create-and-deploy-resourceprovider-as-azurewebsites.jpg
[link-ssl]:http://azure.microsoft.com/blog/2015/07/02/enabling-client-certificate-authentication-for-an-azure-web-app/
[link-acct-creation]:marketplace-publishing-accounts-creation-registration.md
[link-pushstaging]:marketplace-publishing-push-to-staging.md
