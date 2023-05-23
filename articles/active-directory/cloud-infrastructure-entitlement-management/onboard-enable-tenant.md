---
title:  Enable Permissions Management in your organization
description: How to enable Permissions Management in your organization.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 04/24/2023
ms.author: jfields
---

# Enable Permissions Management in your organization

This article describes how to enable Permissions Management in your organization. Once you've enabled Permissions Management, you can connect it to your Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) platforms.

> [!NOTE]
> To complete this task, you must have *Microsoft Entra Permissions Management Administrator* permissions. You can't enable Permissions Management as a user from another tenant who has signed in via B2B or via Azure Lighthouse.

:::image type="content" source="media/onboard-enable-tenant/dashboard.png" alt-text="A preview of what the permissions management dashboard looks like." lightbox="media/onboard-enable-tenant/dashboard.png":::

## Prerequisites

To enable Permissions Management in your organization:

- You must have an Azure AD tenant. If you don't already have one, [create a free account](https://azure.microsoft.com/free/).
- You must be eligible for or have an active assignment to the global administrator role as a user in that tenant.

> [!NOTE]
> During public preview, Permissions Management doesn't perform a license check.
> The public preview environment will only be available until October 7th, 2022. You will be no longer be able view or access your configuration and data in the public preview environment after that date.
> Once you complete all the steps and confirm to use Microsoft Entra Permissions Management, access to the public preview environment will be lost. You can take a note of your configuration before you start. 
> To start using generally available Microsoft Entra Permissions Management, you must purchase a license or begin a trial. From the public preview console, initiate the workflow by selecting Start.




## How to enable Permissions Management on your Azure AD tenant

1. In your browser:
    1. Go to [Entra services](https://entra.microsoft.com) and use your credentials to sign in to [Azure Active Directory](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview).
    1. If you aren't already authenticated, sign in as a global administrator user.
    1. If needed, activate the global administrator role in your Azure AD tenant.
    1. In the Azure portal, select **Permissions Management**, and then select the link to purchase a license or begin a trial.

> [!NOTE]
> There are two ways to enable a trial or a full product license, self-service and volume licensing. 
> For self-service, navigate to the M365 portal at [https://aka.ms/TryPermissionsManagement](https://aka.ms/TryPermissionsManagement) and purchase licenses or sign up for a free trial. The second way is through Volume Licensing or Enterprise agreements. If your organization falls under a volume license or enterprise agreement scenario, please contact your Microsoft representative.

Permissions Management launches with the **Data Collectors** dashboard.

## Configure data collection settings

Use the **Data Collectors** dashboard in Permissions Management to configure data collection settings for your authorization system.

1. If the **Data Collectors** dashboard isn't displayed when Permissions Management launches:

    - In the Permissions Management home page, select **Settings** (the gear icon), and then select the **Data Collectors** subtab.

1. Select the authorization system you want: **AWS**, **Azure**, or **GCP**.

1. For information on how to onboard an AWS account, Azure subscription, or GCP project into Permissions Management, select one of the following articles and follow the instructions:

    - [Onboard an AWS account](onboard-aws.md)
    - [Onboard an Azure subscription](onboard-azure.md)
    - [Onboard a GCP project](onboard-gcp.md)

## Next steps

- For an overview of Permissions Management, see [What's Permissions Management?](overview.md)
- For a list of frequently asked questions (FAQs) about Permissions Management, see [FAQs](faqs.md).
- For information on how to start viewing information about your authorization system in Permissions Management, see [View key statistics and data about your authorization system](ui-dashboard.md).
