---
title: Build a hybrid CI/CD pipeline with Azure Stack - Pre-reqs | Microsoft Docs
description: Learn about the pre-reqs to building a Hybrid CI/CD pipeline
services: azure-stack
documentationcenter: ''
author: HeathL17
manager: byronr
editor: ''


ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/10/2017
ms.author: helaw

---

# Deploy apps with a hybrid CI/CD pipeline:  Get started with pre-reqs
Before you can create and begin using the hybrid CI/CD pipeline, you'll need to prepare the environment.  In this topic, we'll walk through creating the infrastructure components used by the CI/CD pipeline. These steps will take a good bit of time, so plan accordingly.  

## Create Azure AD Directory
If you don't already have an Azure AD Diretory you'll use for this dev environment, follow the [instructions](https://docs.microsoft.com/azure/active-directory/develop/active-directory-howto-tenant#start-from-scratch) to create a a new directory tenant.  Make sure to take note of the **.onmicrosoft.com* tenant name, because you'll need this for steps later on.

## Get an Azure subscription
Next, you'll sign up for a new [Azure trial account] with the credentials you created.  This account will include a credit used to run the App Services.   

## Create user accounts
You'll need to create at least two accounts for this scenario.  

| Account | Suggested account name | Description|
| ----- | ----- | ----- |
|Service Admin account | serviceadmin@<tenant>.onmicrosoft.com | Requires global administrator to your Azure AD Directory.  This role is required because the Service Admin account is used during Azure Stack installation to create Azure AD objects, and is also used by VSTS to create identities used during deployment. |
|Tenant account| tenant@<tenant>.onmicrosoft.com | This account is configured as a user in your Azure AD directory.  Consider adding additional accounts if you have others who will be testing the Hybrid CI/CD scenario with you. |

If you're new to creating accounts in Azure AD, or assigning roles, these two topics can help:

 - [Add new users to Azure AD](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-users-create-azure-portal)
 - [Assign admin roles in Azure AD](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-assign-admin-roles)

## Create App Service on Azure
Since this example is using an ASP.NET application, we can host it on both Azure and Azure Stack using App Services.  We'll create a Web Plan in App Services on Azure to start.  You can use these steps to create it from the Azure Portal, or you can use this template to deploy a basic App Service instance.

## Create Azure Storage account
We'll use a storage account [blob service](https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/azure-storage-services-rest-api-reference#blob-service) to store the completed builds of our ASP.NET application.  This configuration allows us to retrieve the files when deploying to App Service on Azure & Azure Stack.

1. Begin by creating a [storage account](https://docs.microsoft.com/en-us/azure/storage/storage-create-storage-account#create-a-storage-account).
2. Make note of your [account keys](https://docs.microsoft.com/en-us/azure/storage/storage-create-storage-account#manage-your-storage-account).  

## Deploy Azure Stack
Deploy Azure Stack using the deployment documentation.  The Azure Stack installation will take several hours, so it's best to plan on leaving the deployment run overnight if possible.  Make sure you choose the Azure AD deployment option, and specify the Service Admin account during installation.  

### Deploy Azure Stack Platform-as-a-Service services
You'll also need to deploy Azure Stack Platform-as-a-Service services so you can host your app.  You'll need to deploy SQL and App Service resource providers.  These also require a bit of time, so it's best to start these and multi-task.  