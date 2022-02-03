---
title:  Enable Microsoft CloudKnox Permissions Management on your Azure Active Directory (Azure AD) tenant
description: How to enable Microsoft CloudKnox Permissions Management on your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/28/2022
ms.author: v-ydequadros
---

# Enable CloudKnox on your Azure Active Directory tenant

This article describes how to enable Microsoft CloudKnox Permissions Management (CloudKnox) on your Azure Active Directory (Azure AD) tenant.
> [!NOTE] 
> To complete this task, you must have Global Administrator permissions.

<!---Context: to collect data from your clouds, we need to…  @Mrudula to help fill in context--->

## Prerequisites

To add CloudKnox to your Azure AD tenant, you must have:

- An Azure AD user account. If you don't already have one, [Create a free account](https://azure.microsoft.com/free/).
- A global administrator role.

## Enable CloudKnox on your Azure AD tenant

1. Open your browser and enter `aka.ms/ciem-prod`.
1. Log in as a global administrator to your Azure AD tenant.
1. In the Azure AD portal, on the **Features highlights** section, select the **CloudKnox Permissions Management** tile.

    If you're asked to select an account to log in, log in as a global administrator to specified tenant.

    The **Welcome to CloudKnox Permissions Management** screen appears. 

    This screen provides information on how to enable CloudKnox on your tenant.

1. To provide access to the CloudKnox application, create a service principal.

    An Azure service principal is a security identity used by user-created apps, services, and automation tools to access specific Azure resources.
    > [!NOTE] 
    > To complete this step, you must have Azure CLI or Azure PowerShell on your system or an Azure subscription where you can run Cloud Shell.

    To create a service principal that points to the CloudKnox application via Cloud Shell:

    1. Copy the script on the **Welcome** screen:

        `az ad ap create --id b46c3ac5-9da6-418f-a849-0a7a10b3c6c`

    1. Return to the Azure AD portal and select the **Cloud Shell** button on the navigation bar.
    1. Paste the script into Cloud Shell and press the Enter key. 
    
        For information on how to create a service principal through the Azure portal, see [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli). 


        For information on the **az** command and how to log in with the no subscriptions flag, see [az login](/cli/azure/reference-index?view=azure-cli-latest#az-login).

        <!---(/cli/azure/reference-index?view=azure-cli-latest#az-login&preserve-view=true)--->
        
        For information on how to create a service principal via Azure PowerShell, see [Create an Azure service principal with Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps?view=azps-7.1.0).

    1. After the script runs successfully, the service principal attributes for CloudKnox display. Confirm the **Cloud Infrastructure Entitlement Management** application displays in the Azure AD portal under **Enterprise applications**.

1. Return to the **Welcome to CloudKnox** screen and select **Enable CloudKnox Permissions Management**.

    This completes enablement of CloudKnox on your tenant and launches the CloudKnox **Data Collectors** settings page.

    <!--- :::image type="content" source="media/cloudknox-onboard-enable-tenant/data-collectors-tab.png" alt-text="Data collectors settings page.":::--->

    Use the **Data Collectors** page to configure data collection settings for your authorization system. 

1. In the CloudKnox **Data Collectors** settings page, select the authorization system you want.

1. For information on how to  onboard an AWS account, Azure subscription, or GCP project into CloudKnox, select one of the following articles and follow the instructions:

    - [Onboard an Amazon Web Services (AWS) account](cloudknox-onboard-aws.md)
    - [Onboard a Microsoft Azure subscription](cloudknox-onboard-azure.md)
    - [Onboard a Google Cloud Platform (GCP) project](cloudknox-onboard-gcp.md)

<!---Next steps--->

<!---https://docs.microsoft.com/cli/azure/create-an-azure-service-principal-azure-cli
https://docs.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login--->

<!--- - For information on how to enable or disable the controller, see [Enable or disable the controller](cloudknox-onboard-enable-controller.md).
- For information on how to add an account/subscription/project after onboarding, see [Add an account/subscription/project after onboarding is complete](cloudknox-onboard-add-account-after-onboarding.md)--->
