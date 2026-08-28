---
title: "Quickstart: Create an Azure Native Commvault Cloud account"
description: Learn how to create and verify an Azure Native Commvault Cloud account in the Azure portal.
author: agrimayadav
ms.author: agrimayadav
ms.topic: quickstart
ms.service: partner-services
ms.date: 08/27/2026
---
# Quickstart: Create an Azure Native Commvault Cloud account

In this quickstart, you create a Commvault Cloud account in the Azure portal. The account establishes the relationship between your Azure subscription, Azure Marketplace subscription, and Commvault tenant.

## Prerequisites

- An active Azure subscription that can purchase the Commvault Azure Marketplace offer.
- An active [Azure Marketplace subscription to Commvault](overview.md#subscribe-to-azure-native-commvault).
- The required identity, access, and workload-protection settings described in [Configure prerequisites for Azure Native Commvault Cloud](configure-prerequisites.md).

## Create a Commvault Cloud account

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for **Commvault Cloud Account**, and then select **Create**.
1. On the **Basics** tab, select your subscription and resource group.
1. Enter a name for the Commvault Cloud account.
1. Select a supported region.
1. Select an active Marketplace SaaS subscription.
1. Map Microsoft Entra groups to the applicable Commvault roles. Assign at least one group to the **Commvault Backup Administrator** role.
1. Select **Managed Identity**.
1. Add Azure tags if required.
1. Select **Review + create**.
1. After validation succeeds, select **Create**.

> [!NOTE]
> Wait for the deployment notification that confirms the Commvault Cloud account was created successfully before you continue.

## Assign Azure access

After deployment finishes, assign the **Commvault Contributor** Azure role to the Microsoft Entra groups that you mapped during account creation:

1. Open the Commvault Cloud account in the Azure portal.
1. Select **Access control (IAM)**.
1. Assign the **Commvault Contributor** role to each applicable group.

You need both the mapped Commvault role and the **Commvault Contributor** Azure role for authorized backup and recovery operations.

## Verify the deployment

1. Open the resource group that you selected during account creation.
1. Confirm that the Commvault Cloud account appears in the resource group.
1. Open the account and confirm that its deployment completed successfully.
1. Under **Access control (IAM)**, confirm that the mapped Microsoft Entra groups have the **Commvault Contributor** role.

## Next step

> [!div class="nextstepaction"]
> [Manage Azure Native Commvault resources](manage.md)