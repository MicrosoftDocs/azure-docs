---
title: Enable the dedicated hosting plan for Azure Monitor for SAP solutions
description: Switch the Azure function hosting plan in Azure Monitor for SAP solutions (AMS) from Elastic Premium to the dedicated plan to optimize cost and improve scaling efficiency.
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 04/09/2026
ms.author: vaidehikher
author: vaidehikher18
# Customer intent: As an SAP Basis team member, I want to enable the dedicated hosting plan for Azure Monitor for SAP solutions, so that I can optimize cost and improve scaling efficiency for monitoring my SAP systems.
---

# Enable the dedicated hosting plan for Azure Monitor for SAP solutions

Azure Monitor for SAP solutions (AMS) uses an Azure function to collect monitoring data from your SAP systems. By default, this function runs on the Elastic Premium hosting plan. Switch to the dedicated hosting plan to reduce costs and improve scaling efficiency for high-volume monitoring workloads.

This article shows you how to switch the hosting plan from Elastic Premium to dedicated and check the change in the Azure portal.

## Prerequisites

- No locks on the monitor subnet's resource group.

## Enable the dedicated hosting plan

To switch from the Elastic Premium plan to the dedicated hosting plan, follow these steps:

1. Go to the **Overview** section of the AMS monitor. Check that the hosting option is **Elastic Premium plan**, and then select **edit**.

   :::image type="content" source="media/enable-dedicated-hosting-plan/change-hosting-plan.png" alt-text="Screenshot of changing the Azure function hosting plan in AMS from the Overview section.":::

1. In the dialog that opens, select **Update**, and then select **Confirm**.

   :::image type="content" source="media/enable-dedicated-hosting-plan/successful.png" alt-text="Screenshot of a successful hosting plan migration in Azure Monitor for SAP solutions.":::

1. Check that the hosting plan is updated in the **Overview** section after the deployment succeeds.

## Revert to the Elastic Premium plan

If the deployment fails with the code `FunctionAppRestoreFailed` or if you need to restore the Elastic Premium plan after multiple failures, follow these steps.

### Before you begin

Make sure the storage account has public network access:

1. Go to the storage account in the AMS managed resource group.
1. Go to the **Security + networking** tab, and then select **Networking**.
1. Under **Public network access**, make sure the **Enabled from all networks** option is selected.

### Restore the monitor

1. [Install Azure CLI](/cli/azure/install-azure-cli).

1. Set the subscription:

   ```azurecli
   az account set --subscription "<Subscription Name>"
   ```

1. Install the Workloads CLI extension:

   ```azurecli
   az extension add --name workloads
   ```

1. Run `az workloads monitor create` with the required properties for your AMS instance:

   ```azurecli
   az workloads monitor create -g <rg-name> -n <ams_name> -l <location> --app-location <app-location> --managed-rg-name <managed_rg_name> --monitor-subnet <subnet_arm_id> --routing-preference <routing_preference> --identity type=None
   ```

1. Check that the monitor is restored after the operation completes.

## Related content

- [What is Azure Monitor for SAP solutions?](about-azure-monitor-sap-solutions.md)
