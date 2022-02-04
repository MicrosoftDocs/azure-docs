---
title:  Enable CloudKnox Permissions Management in your organization
description: How to enable CloudKnox Permissions Management on your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/04/2022
ms.author: v-ydequadros
---

# Enable CloudKnox in your organization

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how to enable CloudKnox Permissions Management (CloudKnox) on your Azure Active Directory (Azure AD) tenant.  Once you have CloudKnox enabled, then you can connect it to your Azure, AWS or GCP platforms.

> [!NOTE] 
> To complete this task, you must have Global Administrator permissions.

<!---Context: to collect data from your clouds, we need to…  @Mrudula to help fill in context--->

## Prerequisites

To enable CloudKnox in your organization, you must have:

- An Azure AD tenant. If you don't already have one, [Create a free account](https://azure.microsoft.com/free/).
- The global administrator role in that tenant.

> [!NOTE]
> During public preview, CloudKnox does not perform a license check.

## Enable CloudKnox on your Azure AD tenant

1. Open your browser and enter `https://aka.ms/ciem-prod`.
1. If you are not already authenticated, log in as a global administrator to your Azure AD tenant.
1. In the Azure AD portal, on the **Features highlights** section, select the **CloudKnox Permissions Management** tile.

    If you're asked to select an account to log in, select that same global administrator account in that tenant.

    The **Welcome to CloudKnox Permissions Management** screen appears. 

    This screen provides information on how to enable CloudKnox on your tenant.

1. To provide access to the CloudKnox application, create a service principal.

    An Azure service principal is a security identity used by user-created apps, services, and automation tools to access specific Azure resources.
    > [!NOTE] 
    > To complete this step, you must have Azure CLI or Azure PowerShell on your system or an Azure subscription where you can run Cloud Shell.

    To create a service principal that points to the CloudKnox application via Cloud Shell:

    1. Copy the script on the **Welcome** screen:

        `az ad ap create --id b46c3ac5-9da6-418f-a849-0a7a10b3c6c`

    1. If you have an Azure subscription, return to the Azure AD portal and select the **Cloud Shell** button on the navigation bar.  If you don't have an Azure subscription, open a command prompt on a Windows Server.
    1. If you have an Azure subscription, paste the script into Cloud Shell and press the Enter key. 
    
        For information on how to create a service principal through the Azure portal, see [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli). 


        For information on the **az** command and how to log in with the no subscriptions flag, see [az login](/cli/azure/reference-index?view=azure-cli-latest#az-login).

        <!---(/cli/azure/reference-index?view=azure-cli-latest#az-login&preserve-view=true)--->
        
        For information on how to create a service principal via Azure PowerShell, see [Create an Azure service principal with Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps?view=azps-7.1.0).

    1. After the script runs successfully, the service principal attributes for CloudKnox display. You can confirm the **Cloud Infrastructure Entitlement Management** application displays in the Azure AD portal under **Enterprise applications**.

1. Return to the **Welcome to CloudKnox** screen and select **Enable CloudKnox Permissions Management**.

    This completes enablement of CloudKnox on your tenant and launches the CloudKnox **Data Collectors** settings page.

    <!--- :::image type="content" source="media/cloudknox-onboard-enable-tenant/data-collectors-tab.png" alt-text="Data collectors settings page.":::--->

    Use the **Data Collectors** page to configure data collection settings for your authorization system, Amazon Web Services (AWS), Google Cloud Platform (GCP) or Azure. 

1. In the CloudKnox **Data Collectors** settings page, select the authorization system you want.

1. For information on how to  onboard an AWS account, Azure subscription, or GCP project into CloudKnox, select one of the following articles and follow the instructions:

    - [Onboard an Amazon Web Services (AWS) account](cloudknox-onboard-aws.md)
    - [Onboard a Microsoft Azure subscription](cloudknox-onboard-azure.md)
    - [Onboard a Google Cloud Platform (GCP) project](cloudknox-onboard-gcp.md)

## Next steps

- For an overview of CloudKnox, see [What's CloudKnox Permissions Management?](cloudknox-overview.md).
- For a list of frequently asked questions (FAQs) about CloudKnox, see [FAQs](cloudknox-faqs.md).

<!--- - For information on how to enable or disable the controller, see [Enable or disable the controller](cloudknox-onboard-enable-controller.md).
- For information on how to add an account/subscription/project after onboarding, see [Add an account/subscription/project after onboarding is complete](cloudknox-onboard-add-account-after-onboarding.md)--->
