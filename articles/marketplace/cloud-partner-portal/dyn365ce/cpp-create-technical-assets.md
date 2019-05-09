---
title: Create Dynamics 365 for Customer Engagement technical assets | Azure Marketplace 
description: Create the technical assets for a Dynamics 365 for Customer Engagement application offer.
services: Dynamics 365 for Customer Engagement, Azure, Marketplace, Cloud Partner Portal, AppSource
author: v-miclar
ms.service: marketplace
ms.topic: article
ms.date: 12/29/2018
ms.author: pabutler
---

# Create technical assets for Azure application offer

Typically you develop solutions using the [SDK for Dynamics 365 for Customer Engagement apps](https://docs.microsoft.com/dynamics365/customer-engagement/developer/get-started-sdk).  Solutions take a variety of forms, as described in [Programming models for Dynamics 365 for Customer Engagement apps](https://docs.microsoft.com/dynamics365/customer-engagement/developer/programming-models).  Chose the form that best conforms to your solution requirements.  When developing a solution, there are a number of issues you must address, such as extensibility choices, solution components, and version compatibility.  For more information, see  [Introduction to solutions](https://docs.microsoft.com/dynamics365/customer-engagement/developer/introduction-solutions).

Most of the Dynamics 365 solutions published to AppSource are managed applications distributed as package files.


## Creating and storing the package

The parallel documentation creating Dynamics 365 for Customer Engagement offers is found in the section [Publish your app on AppSource](https://docs.microsoft.com/dynamics365/customer-engagement/developer/publish-app-appsource).  The following contained topics detail how to create the solution package file and upload it to Azure storage:

- [Step 4: Create an AppSource package for your app](https://docs.microsoft.com/dynamics365/customer-engagement/developer/create-package-app-appsource) - explains how to create a compressed (zip) file that represents your managed application and contains: solution assets folder, custom code DLL, MIME type information file, AppSource package icon, license terms (HTML) file, and contents file (XML).
- [Step 5: Store your AppSource Package on Azure Storage and generate a URL with SAS key](https://docs.microsoft.com/dynamics365/customer-engagement/developer/store-appsource-package-azure-storage) - explains how to store an AppSource package file in a Microsoft Azure Blob storage account, and use a Shared Access Signature (SAS) key to share the package file. Your package file is retrieved from your Azure Storage location for certification, and then for AppSource trials and publication.


## Next steps

If you have not already done so, [create your Dynamics 365 for Customer Engagement offer](./cpp-create-offer.md).  Then you will be ready to [publish your offer](./cpp-publish-offer.md).
