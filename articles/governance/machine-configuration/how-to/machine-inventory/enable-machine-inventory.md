---
title: Enable Machine Inventory
description: Learn how to assign built-in Azure policies to enable machine inventory on Windows and Linux Azure VMs and Arc-enabled servers.
ms.date: 11/07/2026
ms.topic: how-to
ms.service: azure-machine-configuration
---

# Enable Machine Inventory (preview)

Use built-in Azure policies to enable machine inventory on Windows and Linux Azure virtual machines (VMs) and Azure Arc-enabled servers. After collection starts, you can review inventory in the Azure portal and query it by using Azure Resource Graph.

This article describes how to enable inventory on Azure or Arc-enabled machines. For servers managed through Microsoft Configuration Manager, see [Enable Configuration Manager Connected Inventory](configuration-manager-connected-inventory.md).

## Prerequisites

- An Azure subscription and a resource group containing the machines you want to inventory.
- Windows or Linux Azure VMs, or servers connected to Azure through Azure Arc.
- The applicable [Machine Configuration prerequisites](../../overview/02-setup-prerequisites.md).
- Permissions to assign the required Azure policies at the target scope and view the machines and their inventory.


## Assign the prerequisite initiative

For Azure VMs, assign the prerequisite initiative before enabling inventory.

1. In the Azure portal, open the **Machine Configuration** page. Search for this page by using the search bar.
2. In the table of contents, under **Solutions**, select **Policy**.
2. Open **Definitions** and find **Deploy prerequisites to enable Guest Configuration policies on virtual machines**.
3. Assign the initiative to the scope containing your target VMs.
4. Review the assignment and create it.
5. Verify that prerequisite deployment succeeds on the target VMs.

:::image type="content" source="machine-inventory-prerequisites.png" alt-text="Screenshot of the prerequisite policy initiative for enabling Guest Configuration on virtual machines." lightbox="machine-inventory-prerequisites.png" border="true":::


## Assign the inventory policies

Assign the policy that matches the operating system of your target machines. For a resource group containing both Windows and Linux machines, assign both policies.

| Operating system | Built-in policy |
| --- | --- |
| Windows | **[Preview]: Windows machines should have Azure inventory enabled** |
| Linux | **[Preview]: Linux machines should have Azure inventory enabled** |

:::image type="content" source="machine-inventory-policies.png" alt-text="Screenshot of the Windows and Linux policies for enabling machine inventory." lightbox="machine-inventory-policies.png" border="true":::

1. In the Azure portal, open the **Machine Configuration** page. Search for this page by using the search bar.
2. In the table of contents, under **Solutions**, select **Policy**. Use the search bar to find the applicable policy for your machine.
2. Select **Assign**.
3. Select the resource group containing your target machines and enter an assignment name.
4. For Azure Arc-enabled servers, set the `IncludeArcMachines` parameter to the lowercase string `"true"` where offered.
5. Review the assignment and create it. It takes 5-15 minutes for Azure to apply these changes.
6. Repeat for the other operating system, if needed.



## Troubleshoot missing inventory

| Symptom | What to check |
| --- | --- |
| No machines appear | Confirm the selected subscription and resource-group filters, and verify that the target machines are within the policy assignment scope. |
| A machine has no inventory records | Check prerequisite deployment, the applicable inventory policy assignment, and Machine Configuration health. Allow collection and reporting to complete. |
| An expected category is empty | Confirm that the category is available for that operating system. Query the corresponding resource type in Azure Resource Graph. |
| Policy deployment fails | Review assignment and deployment errors, including any identity or authorization errors, before troubleshooting inventory presentation. |

An empty result isn't evidence that a machine has no installed software or other guest resources.

## Next step

[View and query machine inventory](view-and-query-machine-inventory.md).
