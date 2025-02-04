---
title: Enable cross-subscription patching in Azure Update Manager
description: Learn how to enable cross-subscription patching in Azure Update Manager.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 02/04/2025
ms.topic: how-to
---

# Enable cross subscription patching in Azure Update Manager

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes how to enable cross-subscription patching either through Azure CLI or Azure portal.

## Enable resource providers in your subscription

1. You can register the necessary resource providers to your subscription through Azure CLI or manually via the Azure portal.

    # [Azure CLI](#tab/az-cli)

    Open your Azure CLI and run the following commands:

    ```azurecli-interactive
      az provider register--namespace "Microsoft.Insights"
      az provider register--namespace "Microsoft.Maintenance"
   ```
    # [Azure portal](#tab/az-portal)

    1. Sign in to the [Azure portal](https://portal.azure.com) and go to your subscription.
    1. Under **Settings**, select **Resource providers**.
    1. Activate both **Microsoft.Insights** and **Microsoft.Maintenance**.

    :::image type="content" source="./media/enable-cross-subscription-patching/select-resource-providers.png" alt-text="Screenshot that shows how to select the resource providers from subscription." lightbox="./media/enable-cross-subscription-patching/select-resource-providers.png":::

---
2. Grant necessary roles to your managed identity

   - Assign the appropriate roles to your Azure VM and Arc assets to ensure scheduled patching is managed effectively. The required roles are:
        - Scheduled patching contributor
        - Reader
   - These roles can be granted on the Resource Group or at the Subscription level if you have resources spread among multiple resource groups and want to include them all at once.
   - If you have a smaller scope and plan to manage it with a dedicated admin or group, these two roles can be granted to a user or a security group (SG). If you are envisioning a larger scope with automation in place, ensure to grant these roles to the API and Service Principal Name (SPN) you use.

3. Scheduling using maintenance configurations
   
   To create maintenance configurations in Azure Update Manager, you can set it up as follows:

   # [Using Azure portal](#tab/az-patch-portal)
      
   1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
   1. Under **Resources**, select **Machines**, and then select **Maintenance configurations**.
   1. In the **Maintenance Configurations** page, follow the steps to [set up the patching schedule](scheduled-patching.md#schedule-recurring-updates-on-a-single-vm).

   # [Using API](#tab/az-patch-cli)
    
   - Use the API to programmatically schedule the patching.
   - For scheduled patching on VM or Arc assets, locate the assets by using the *resourceId* and *subscription* that they're attached to.

---

## Next steps

* Overview on [cross-subscription patching](cross-subscription-patching.md)
* [Schedule recurring updates](scheduled-patching.md)
* [Manage update settings via portal](manage-update-settings.md)
* [Manage multiple machines using Update Manager](manage-multiple-machines.md)
