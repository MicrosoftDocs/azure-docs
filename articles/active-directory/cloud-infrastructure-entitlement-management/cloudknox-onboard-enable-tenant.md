---
title:  Enable CloudKnox Permissions Management in your organization
description: How to enable CloudKnox Permissions Management in your organization.
services: active-directory
author: mtillman
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 04/20/2022
ms.author: mtillman
---

# Enable CloudKnox in your organization

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.


> [!NOTE] 
> The CloudKnox Permissions Management (CloudKnox) PREVIEW is currently not available for tenants hosted in the European Union (EU).



This article describes how to enable CloudKnox Permissions Management (CloudKnox) in your organization. Once you've enabled CloudKnox, you can connect it to your Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) platforms.

> [!NOTE] 
> To complete this task, you must have *global administrator* permissions as a user in that tenant. You can't enable CloudKnox as a user from other tenant who has signed in via B2B or via Azure Lighthouse.

## Prerequisites

To enable CloudKnox in your organization:

- You must have an Azure AD tenant. If you don't already have one, [create a free account](https://azure.microsoft.com/free/).
- You must be eligible for or have an active assignment to the global administrator role as a user in that tenant.

> [!NOTE]
> During public preview, CloudKnox doesn't perform a license check.

## View a training video on enabling CloudKnox

- To view a video on how to enable CloudKnox in your Azure AD tenant, select [Enable CloudKnox in your Azure AD tenant](https://www.youtube.com/watch?v=-fkfeZyevoo).
- To view a video on how to configure and onboard AWS accounts in CloudKnox, select [Configure and onboard AWS accounts](https://www.youtube.com/watch?v=R6K21wiWYmE).
- To view a video on how to configure and onboard GCP accounts in CloudKnox, select [Configure and onboard GCP accounts](https://www.youtube.com/watch?app=desktop&v=W3epcOaec28).


## How to enable CloudKnox on your Azure AD tenant

1. In your browser:
    1. Go to [Azure services](https://portal.azure.com) and use your credentials to sign in to [Azure Active Directory](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview). 
    1. If you aren't already authenticated, sign in as a global administrator user. 
    1. If needed, activate the global administrator role in your Azure AD tenant.
    1. In the Azure AD portal, select **Features highlights**, and then select **CloudKnox Permissions Management**.

    1. If you're prompted to select a sign in account, sign in as a global administrator for a specified tenant.

        The **Welcome to CloudKnox Permissions Management** screen appears, displaying information on how to enable CloudKnox on your tenant.

1. To provide access to the CloudKnox application, create a service principal.

    An Azure service principal is a security identity used by user-created apps, services, and automation tools to access specific Azure resources.

    > [!NOTE] 
    > To complete this step, you must have Azure CLI or Azure PowerShell on your system, or an Azure subscription where you can run Cloud Shell.

    - To create a service principal that points to the CloudKnox application via Cloud Shell:

        1. Copy the script on the **Welcome** screen:

            `az ad sp create --id b46c3ac5-9da6-418f-a849-0a07a10b3c6c`

        1. If you have an Azure subscription, return to the Azure AD portal and select **Cloud Shell** on the navigation bar.
            If you don't have an Azure subscription, open a command prompt on a Windows Server.
        1. If you have an Azure subscription, paste the script into Cloud Shell and press **Enter**. 
    
            - For information on how to create a service principal through the Azure portal, see [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli). 

            - For information on the **az** command and how to sign in with the no subscriptions flag, see [az login](/cli/azure/reference-index?view=azure-cli-latest#az-login&preserve-view=true).
        
            - For information on how to create a service principal via Azure PowerShell, see [Create an Azure service principal with Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps?view=azps-7.1.0&preserve-view=true).

        1. After the script runs successfully, the service principal attributes for CloudKnox display. Confirm the attributes.
    
             The **Cloud Infrastructure Entitlement Management** application displays in the Azure AD portal under **Enterprise applications**.

1. Return to the **Welcome to CloudKnox** screen and select **Enable CloudKnox Permissions Management**.

    You have now completed enabling CloudKnox on your tenant. CloudKnox launches with the **Data Collectors** dashboard.

## Configure data collection settings

Use the **Data Collectors** dashboard in CloudKnox to configure data collection settings for your authorization system. 

1. If the **Data Collectors** dashboard isn't displayed when CloudKnox launches: 

    - In the CloudKnox home page, select **Settings** (the gear icon), and then select the **Data Collectors** subtab.
    
1. Select the authorization system you want: **AWS**, **Azure**, or **GCP**.

1. For information on how to onboard an AWS account, Azure subscription, or GCP project into CloudKnox, select one of the following articles and follow the instructions:

    - [Onboard an AWS account](cloudknox-onboard-aws.md)
    - [Onboard an Azure subscription](cloudknox-onboard-azure.md)
    - [Onboard a GCP project](cloudknox-onboard-gcp.md)

## Next steps

- For an overview of CloudKnox, see [What's CloudKnox Permissions Management?](cloudknox-overview.md)
- For a list of frequently asked questions (FAQs) about CloudKnox, see [FAQs](cloudknox-faqs.md).
- For information on how to start viewing information about your authorization system in CloudKnox, see [View key statistics and data about your authorization system](cloudknox-ui-dashboard.md).
