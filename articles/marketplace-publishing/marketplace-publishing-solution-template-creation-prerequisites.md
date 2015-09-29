<properties
   pageTitle="Requirements for creating a Multi-Virtual Machine Image Solution Template | Microsoft Azure"
   description="Understand the requirements for creating a Multi-VM Image Solution Template to deploy and sell on the Azure Marketplace"
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="AzureStore"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/29/2015"
   ms.author="hascipio; v-divte" />

# Pre-requisites for creating a multi-Virtual Machine image solution template for the Azure Marketplace

Read the process thoroughly before beginning and understand where and why each step is performed. You should prepare as much of your company information and other data as possible before beginning the process. This should be clear from reviewing the process itself.  

## Get Approved via Microsoft Azure Certification Program
> [AZURE.WARNING] You must be approved via the Azure Certification program to start the virtual machine image creation and publishing process. For a detailed overview of the Microsoft Azure Certification program and its benefits, visit http://azure.com/certified

The first step on the path to getting your application or service certified and onboarded to Azure Marketplace is to fill out the application form on the Microsoft Azure Certified web page.
If you meet the basic eligibility criteria we will ask you to share some more details about your business and the application or service that you want to certify. When we have all the details from you we will review your application to ensure is it’s a good fit for Azure Marketplace and if your application is approved we will start working with you to onboard your solution to Azure Marketplace.
Take these steps to get started:
-	Visit the Microsoft Azure Certified web page: https://azure.microsoft.com/en-us/marketplace/partner-program/ to learn more about the program

-	If you are working with a Partner Account Manager or a DX Partner Manager please request them to nominate you for the Azure Certification program. Or go to the Microsoft Azure Certified web page, click on **Request Information** and fill in the application form.

## Ensure you are registered as a seller with Microsoft
For detailed instructions on registering a seller account with Microsoft, go to [Account Creation & Registration](marketplace-publishing-accounts-creation-registration.md).
- If you are already registered, find out who in your company owns it or which credentials were used to register
- If you are not the owner of the publishing account, you can have the account owner add your Microsoft Account as a co-admin to the Publishing portal -> Publishers -> Administrators
- Ensure that stakeholders in the Azure publishing process receive the email that goes to this address. It must be monitored and responded to in order to complete the publishing process.
- Avoid having the account associated with a single person. If that person leaves your company, they could impact your ability to access information about and publish your SKUs.

<!--
For instructions on creating and submitting a Microsoft seller profile, visit [Microsoft Seller Account Creation & Registration][link-acct-creation].
-->
<!--
If you are not registered, you will need to collect the Company Tax and Payout Information (banking information) and then register your company as a seller in the [Seller Dashboard](https://sellerdashboard.microsoft.com).

A company can register only once as seller with Microsoft.
- If you don't know the seller registration stats of your company, please contact us through your Sharepoint site ('Need help?' section) or you can email us at AzureMarketOnboard@microsoft.com
- If you are already registered, find out who in your company owns it? Alternatively, which credentials were used to register? This information can be obtained form your Finance or Marketing Team
-->

> [AZURE.IMPORTANT] You do not have to complete company tax and banking information if you are planning to publish only free offers (or bring your own license).



> [AZURE.TIP] The company registration must be completed to get started. However, while your company works on the tax and bank information in the Seller Dashboard account, the developers can start working on creating the virtual machine image in the [Publishing Portal](https:publishl.windowsazure.com), getting them certified and testing them in Azure Staging Environment. You will need the complete seller account approval only for the final step of publishing your offer to the Marketplace.

> [AZURE.TIP] If you have issues with Seller Registration completion, please log a Support ticket as below:
1. Contact [Support](http://go.microsoft.com/fwlink?LinkId=272975)
2. Choose **Seller Dashboard registration and your account**
3. Choose **Registering for a developer account**
4. Choose contact **method**

## Acquire an Azure "pay-as-you-go" Subscription

This is the subscription you will use to create your VM images and hand over the images to [Azure Marketplace](http://azure.microsoft.com/marketplace). If you do not have an existing subscription, then please sign up here, https://account.windowsazure.com/signup?offer=ms-azr-0003p

## Create an Azure compatible solution
1. Identifying topology and platform evaluation
  For each type of deployment - Evaluation, Proof of Concept, Dev/Test, and Production - think through the exact layout and topology needed for your application. Questions to ask:
  - What are the different tiers?
  - What resources are needed for each tier and of what size?
  - What are the building blocks needed to create these resources?
  A production deployment, or even a dev/test environment, can vary significantly in size depending on the customer and their needs. Decide upon what a small, medium, large, and extra-large topology would look like for your workload and think through availability, scalability, and performance requirements needed to be successful.
2. Familiarize yourself with Azure ARM Template
  The Azure Resource Manager deploys and manages the lifecycle of a collection of resources through declarative, model-based template language. This ARM template is simply a parameterized JSON file which expresses the set of resources and their relationship to be used for deployments. Each resource is placed in a resource group, which is simply a container for resources. ARM provides centralized auditing, tagging, Resource Based Access Control, and most importantly, its operations are idempotent.
  With ARM and ARM templates, you can express more complex deployments of Azure resources, such as Virtual Machines, Storage Accounts, and Virtual Networks, which build upon Marketplace content such as VM Images and VM Extensions.
3. Developing and testing the identified topology
  After identifying the topology, you need to work on the following:
  - Review the best practices for the Multi VM solutions (Please refer to the [Template Solutions in the Marketplace](https://microsoft.sharepoint.com/teams/AzureMarketplaceOnboarding/_layouts/15/start.aspx#/Onboarding%20Resources/Forms/AllItems.aspx?RootFolder=%2Fteams%2FAzureMarketplaceOnboarding%2FOnboarding%20Resources%2FMulti%20VM&FolderCTID=0x01200022453DD82E509544B11C9F5367F6105B&View=%7BEC6E631C%2DEFA1%2D4E67%2D87C6%2D4FCA489A2F92%7D&InitialTabId=Rib) for best practices).
  - Work on the configuration (VM sizes, Storage accounts, VNet, Subnet, Network interface card, public IP, etc.)
  - Set up dev and test environment
  - Build and iterate on the template
  - Perform rigorous stress testing and performance testing
  For detailed information on the guidance, best practices and requirements for Multi-VM solutions please refer to the document [Template Solutions in the Marketplace](https://microsoft.sharepoint.com/teams/AzureMarketplaceOnboarding/_layouts/15/start.aspx#/Onboarding%20Resources/Forms/AllItems.aspx?RootFolder=%2Fteams%2FAzureMarketplaceOnboarding%2FOnboarding%20Resources%2FMulti%20VM&FolderCTID=0x01200022453DD82E509544B11C9F5367F6105B&View=%7BEC6E631C%2DEFA1%2D4E67%2D87C6%2D4FCA489A2F92%7D&InitialTabId=Rib).

## Next Steps
Now that you reviewed the pre-requisites and completed the necessary tasks, you can move forward with the creating your Multi-VM Image Solution Template offer as detailed in the [Guide to creating a multi-vm image solution template](marketplace-publishing-solution-template-creation.md)

[link-acct]:marketplace-publishing-accounts-creation-registration.md
