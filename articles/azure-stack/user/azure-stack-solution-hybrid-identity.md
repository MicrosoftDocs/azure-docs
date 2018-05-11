---
title:  Configure hybrid cloud identity with Azure and Azure Stack applications | Microsoft Docs
description: Learn how to configure hybrid cloud identity with Azure and Azure Stack applications.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 05/07/2018
ms.author: mabrigg
ms.reviewer: Anjay.Ajodha
---

# Tutorial: Configure hybrid cloud identity with Azure and Azure Stack applications

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You have two options to grant access to your applications in both global Azure and Azure Stack. When Azure Stack has a continual connection to the Internet, you can use Azure Active Directory (Azure AD). When Azure Stack is disconnected from the Internet, you can use Azure Directory Federated Services (AD FS). You use service principals to grant access to your applications in Azure Stack for the sake of deploying or configuration through the Azure Resource Manger in Azure Stack. 

In this tutorial, you will build a sample environment to:

> [!div class="checklist"]
> * Establish a hybrid identity in global Azure and Azure Stack
> * Retrieving a token to access the Azure Stack API.

These steps require that you have Azure Stack operator permissions.

## Create a service principal for Azure AD in the portal

If you've deployed Azure Stack using Azure AD as the identity store, you can create service principals just like you do for Azure. [This document](https://docs.microsoft.com/en-us/azure/azure-stack/user/azure-stack-create-service-principals#create-service-principal-for-azure-ad) shows you how to perform the steps through the portal. Check that you
have the [required Azure AD permissions](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal#required-permissions) before beginning.

## Create a service principal for AD FS using PowerShell

If you have deployed Azure Stack with AD FS, you can use PowerShell to create a service principal, assign a role for access, and sign in from PowerShell using that identity. [This
document](https://docs.microsoft.com/en-us/azure/azure-stack/user/azure-stack-create-service-principals#create-service-principal-for-ad-fs) shows you how to perform the steps using PowerShell.

## Using the Azure Stack API

[This tutorial](https://docs.microsoft.com/en-us/azure/azure-stack/user/azure-stack-rest-api-use) will walk you through the process of retrieving a token to access the Azure Stack API.

## Connect to Azure Stack using Powershell

Here is a sample script using the concepts taught in this document for connecting to your Azure Stack.

### Prerequisites

An Azure Stack installation connected to Azure Active Directory with a subscription you can access. If you don’t have an Azure Stack installation, you can use these instructions to set up an [Azure Stack Development Kit](https://docs.microsoft.com/en-us/azure/azure-stack/asdk/asdk-deploy).

[This tutorial](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-powershell-configure-quickstart)
will walk you through the steps needed to install Azure PowerShell and connect to your Azure Stack installation.

#### Connect to Azure Stack using code

To connect to Azure Stack using code, use the Azure Resource Manager endpoints API to get the authentication and graph endpoints for your Azure Stack installation, and then authenticate using REST requests. You can find a sample application
[here](https://github.com/shriramnat/HybridARMApplication).

> [!Note]  
Unless the Azure SDK for your language of choice supports Azure API Profiles, the SDK may not work with Azure Stack. To learn more about Azure API Profiles, go [here](https://docs.microsoft.com/da-dk/azure/azure-stack/user/azure-stack-version-profiles).

## Next steps

 - To learn more about how identity is handled in Azure Stack, see [Identity architecture for Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-identity-architecture).  
 - To learn more about Azure Cloud Patterns, see [Cloud Design Patterns](https://docs.microsoft.com/azure/architecture/patterns).
