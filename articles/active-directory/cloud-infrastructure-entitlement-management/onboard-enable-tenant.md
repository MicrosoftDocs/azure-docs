---
title:  Enable Microsoft Entra Permissions Management in your organization
description: How to enable Microsoft Entra Permissions Management in your organization.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 07/21/2023
ms.author: jfields
---

# Enable Microsoft Entra Permissions Management in your organization

This article describes how to enable Microsoft Entra Permissions Management in your organization. Once you've enabled Permissions Management, you can connect it to your Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) platforms.

> [!NOTE]
> To complete this task, you must have *Microsoft Entra Permissions Management Administrator* permissions. You can't enable Permissions Management as a user from another tenant who has signed in via B2B or via Azure Lighthouse.

:::image type="content" source="media/onboard-enable-tenant/dashboard.png" alt-text="Screenshot of the Entra Permissions Management dashboard." lightbox="media/onboard-enable-tenant/dashboard.png":::

## Prerequisites

To enable Permissions Management in your organization:

- You must have an Azure AD tenant. If you don't already have one, [create a free account](https://azure.microsoft.com/free/).
- You must be eligible for or have an active assignment to the *Permissions Management Administrator* role as a user in that tenant.

## How to enable Permissions Management on your Azure AD tenant

1. In your browser:
    1. Go to [Entra services](https://entra.microsoft.com) and use your credentials to sign in to [Azure Active Directory](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview).
    1. If you aren't already authenticated, sign in as a *Permissions Management Administrator* user.
    1. If needed, activate the *Permissions Management Administrator* role in your Azure AD tenant.
    1. In the Azure portal, select **Permissions Management**, and then select the link to purchase a license or begin a trial.


## Activate a free trial or paid license 
There are two ways to activate a trial or a full product license. 
- The first way is to go to [admin.microsoft.com](https://admin.microsoft.com).
    - Sign in with *Global Admin* or *Billing Admin* credentials for your tenant.
    - Go to Setup and sign up for an Entra Permissions Management trial. 
    - For self-service, navigate to the [Microsoft 365 portal](https://aka.ms/TryPermissionsManagement) to sign up for a 45-day free trial or to purchase licenses. 
- The second way is through Volume Licensing or Enterprise agreements. If your organization falls under a volume license or enterprise agreement scenario, contact your Microsoft representative.

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

- For an overview of Permissions Management, see [What's Microsoft Entra Permissions Management?](overview.md)
- For a list of frequently asked questions (FAQs) about Permissions Management, see [FAQs](faqs.md).
- To start viewing information about your authorization system in Permissions Management, see [View key statistics and data about your authorization system](ui-dashboard.md).
