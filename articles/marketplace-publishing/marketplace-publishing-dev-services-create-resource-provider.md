<properties
   pageTitle="Developer Service Publishing Guide - Building a Resource Provider"
   description="Detailed instructions on how to build a resource provider for a developer service offering."
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="AzureStore"
   ms.devlang="en-us"
   ms.topic="Build a resource provider for a Developer Service"
   ms.tgt_pltfrm="Azure"
   ms.workload=""
   ms.date="09/13/2015"
   ms.author="hascipio"/>

# Developer Service Onboarding Guide - Creating a Resource Provider

> ## PRE-REQUISITES
1. Need to have Visual Studio 2013 Ultimate or higher
1. Need to have service PatchVS2013.4 or higher
1. Azure SDK 2.3 or higher

## Install VSIX

Please contact the Azure Certified team for downloading VSIX.

>**Note**: If already installed, then uninstall and reinstall (to make sure you have latest version):
VS Menu Bar --> Tools --> Extensions and Updates… --> Remove “Application Services Resource Provider”

## Create Azure Storage & Queues for RP & Usage

1. Navigate to https://portal.azure.com/.
2.	Sign in with MSA and Azure Subscription (from Part 1 – Non-Technical steps).
3.	(Once Portal Loads) Confirm in the top right that the Azure Subscription and Tenant (aka Directory) selected is correct.
4.	Navigate to “+NEW” (top left of portal)
5.	Select “Data + Storage”
6.	Select “Storage”
7.	Provide the required Azure Storage settings/configurations such as Storage Account name, pricing, etcetera.
>	**Note** – when naming Azure Storage follow these naming rules http://blogs.msdn.com/b/jmstall/archive/2014/06/12/azure-storage-naming-rules.aspx


>**Kind:**	Storage Account

>**Length Casing**:3-24

>**Valid chars:**3-24

>FYI — The RP .vsix will create all the tables and queues for e.g. Usage Table, Usage Queue, Error Table, and Error Queue under the provided Azure Storage Account using these naming rules):

>[RPNamespaceInLowerCaseHashedTo26chars][ServiceInLowerCaseHashedTo26chars][ResourceTypeLowerCaseHashedTo26chars] usagetable

>[RPNamespaceInLowerCaseHashedTo26chars][ServiceInLowerCaseHashedTo26chars][ResourceTypeLowerCaseHashedTo26chars] usagequeue

>[RPNamespaceInLowerCaseHashedTo26chars][ServiceInLowerCaseHashedTo26chars][ResourceTypeLowerCaseHashedTo26chars] errortable

>[RPNamespaceInLowerCaseHashedTo26chars][ServiceInLowerCaseHashedTo26chars][ResourceTypeLowerCaseHashedTo26chars] errorqueue

>–ResourceProviderNamespace (aka PublisherNamespace), Service and ResourceType should not exceed 26 characters each.  Please let Microsoft onboarding team know if this is the case so we can resolve this before moving forward.

8. Navigate to [Publisher Portal](https://publish.windowsazure.com/) and input the correct details for the storage account under “Resource Providers” tab and “Metering Storage Account” section.  Specifically, you need a staging and production Azure Storage Account Name and Key.Note

>**Note**:
Download Azure Storage Explorer:  http://azurestorageexplorer.codeplex.com/  to manage your storage account.


## CREATE C# RESOURCE PROVIDER

### Pre-requisites

*	VS2013 (with VS2013.4 Patch) or higher
*	Azure Resource Provider Template (.vsix)

### Instructions

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

## Next Step
Once Mock Tool tests have passed, [deploy your solution to Azure Websites](marketplace-publishing-dev-services-deploy-resourceprovider-as-azurewebsites.md) and test the validate contracts against azure website endpoint.
