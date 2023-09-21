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
ms.date: 09/13/2023
ms.author: jfields
---

# Enable Microsoft Entra Permissions Management in your organization

This article describes how to enable Microsoft Entra Permissions Management in your organization. Once you've enabled Permissions Management, you can connect it to your Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) platforms.

> [!NOTE]
> To complete this task, you must have *Microsoft Entra Permissions Management Administrator* permissions. You can't enable Permissions Management as a user from another tenant who has signed in via B2B or via Azure Lighthouse.

:::image type="content" source="media/onboard-enable-tenant/dashboard.png" alt-text="Screenshot of the Microsoft Entra Permissions Management dashboard." lightbox="media/onboard-enable-tenant/dashboard.png":::

## Prerequisites

To enable Permissions Management in your organization:

- You must have a Microsoft Entra tenant. If you don't already have one, [create a free account](https://azure.microsoft.com/free/).
- You must be eligible for or have an active assignment to the *Permissions Management Administrator* role as a user in that tenant.

<a name='how-to-enable-permissions-management-on-your-azure-ad-tenant'></a>

## How to enable Permissions Management on your Microsoft Entra tenant

1. In your browser:
    1. Browse to the [Microsoft Entra admin center](https://entra.microsoft.com) and sign in to [Microsoft Entra ID](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) as a [Global Administrator](https://aka.ms/globaladmin).
    1. If needed, activate the *Permissions Management Administrator* role in your Microsoft Entra tenant.
    1. In the Azure portal, select **Microsoft Entra Permissions Management**, then select the link to purchase a license or begin a trial.


## Activate a free trial or paid license 
There are two ways to activate a trial or a full product license. 
- The first way is to go to the [Microsoft 365 admin center](https://admin.microsoft.com).
    - Sign in as a *Global Administrator* for your tenant.
    - Go to Setup and sign up for a Microsoft Entra Permissions Management trial. 
    - For self-service, Go to the [Microsoft 365 portal](https://aka.ms/TryPermissionsManagement) to sign up for a 45-day free trial or to purchase licenses. 
- The second way is through Volume Licensing or Enterprise agreements. 
    - If your organization falls under a volume license or enterprise agreement scenario, contact your Microsoft representative.

Permissions Management launches with the **Data Collectors** dashboard.

## Configure data collection settings

Use the **Data Collectors** dashboard in Permissions Management to configure data collection settings for your authorization system.

1. If the **Data Collectors** dashboard isn't displayed when Permissions Management launches:

    - In the Permissions Management home page, select **Settings** (the gear icon), then select the **Data Collectors** subtab.

1. Select the authorization system you want: **AWS**, **Azure**, or **GCP**.

1. For information on how to onboard an AWS account, Azure subscription, or GCP project into Permissions Management, select one of the following articles and follow the instructions:

    - [Onboard an AWS account](onboard-aws.md)
    - [Onboard an Azure subscription](onboard-azure.md)
    - [Onboard a GCP project](onboard-gcp.md)

## Next steps

- For an overview of Permissions Management, see [What's Microsoft Entra Permissions Management?](overview.md)
