---
title: Manage a Virtual Instance for SAP solutions
description: Learn how to view and manage a Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions by using the Azure portal.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 04/22/2026
author: sagarkeswani
ms.author: sagarkeswani
ms.custom: sfi-image-nochange
# Customer intent: As a SAP Basis Admin, I want to configure and manage a Virtual Instance for SAP solutions in the Azure portal, so that I can monitor system properties and optimize resource connections for effective SAP system management.
---

# Manage a Virtual Instance for SAP solutions

[Azure Center for SAP solutions](overview.md) provides a centralized management experience for SAP systems running on Azure. A Virtual Instance for SAP solutions (VIS) is the resource that represents your SAP system within the service. Once an SAP system is set up on Azure, maintaining consistent oversight of the infrastructure is essential to manage performance and reliability. The VIS provides this central management point in the Azure portal.

This article shows you how to monitor, configure, and manage a VIS resource in the Azure portal.

## Prerequisites

- An Azure subscription with a successfully created VIS resource.
- An Azure account with **Azure Center for SAP solutions administrator** role access to the subscription or resource groups where the VIS resources exist.

## Open a VIS in Azure portal

To configure your VIS in the Azure portal:

1. Open the [Azure portal](https://portal.azure.com) in a browser.
1. Sign in with your Azure account that has the necessary role access as described in the [prerequisites](#prerequisites).
1. In the search field in the navigation menu, enter and select **Azure Center for SAP solutions**.
1. On the **Azure Center for SAP solutions** overview page, search for and select **Virtual Instances for SAP solutions** in the sidebar menu.
1. On the **Virtual Instances for SAP solutions** page, select the VIS that you want to view.

   :::image type="content" source="media/configure-virtual-instance/select-vis.png" lightbox="media/configure-virtual-instance/select-vis.png" alt-text="Screenshot of the VIS page in the Azure Center for SAP solutions service of available VIS resources.":::

> [!IMPORTANT]
> Each VIS resource has a unique managed resource group. This resource group contains resources like a storage account and key vault that are critical for Azure Center for SAP solutions to provide capabilities like infrastructure deployment, SAP software installation, system registration, and other management functions. Don't delete this resource group or any resources within it. If they're deleted, you must re-register the VIS to use any capabilities of Azure Center for SAP solutions.

## Monitor a VIS

To see infrastructure-based metrics for the VIS:

1. [Open the VIS in the Azure portal](#open-a-vis-in-azure-portal).
1. On the **Overview** pane, select the **Monitoring** tab.

You can see the following metrics:

- Virtual machine (VM) utilization by Advanced Business Application Programming SAP Central Services (ASCS) and Application Server instances. The graph shows CPU usage percentage for all VMs that support the ASCS and Application Server instances.
- VM utilization by the database instance. The graph shows CPU usage percentage for all VMs that support the database instance.
- IOPS consumed by the database instance's data disk. The graph shows the percentage of disk utilization by all VMs that support the database instance.

## View instance properties

To view properties for the instances within your VIS:

1. [Open the VIS in the Azure portal](#open-a-vis-in-azure-portal).
1. In the sidebar menu, under **SAP resources**, select the instance type:

   - To see properties of ASCS instances, select **Central service instances**.
   - To see properties of application server instances, select **App server instances**.
   - To see properties of database instances, select **Databases**.

:::image type="content" source="media/configure-virtual-instance/sap-resources.png" lightbox="media/configure-virtual-instance/sap-resources.png" alt-text="Screenshot of a VIS resource showing SAP resources pages in the sidebar menu for ASCS, App server, and Database instances.":::

## View managed identity for a VIS

To view the managed identity for the VIS:

1. [Open the VIS in the Azure portal](#open-a-vis-in-azure-portal).
1. In the sidebar menu, select **Identity**.

   :::image type="content" source="media/configure-virtual-instance/manage-identity-under-vis.png" lightbox="media/configure-virtual-instance/manage-identity-under-vis.png" alt-text="Screenshot of the managed identity view for a VIS resource in the Azure portal.":::

## View default instance numbers

If you deployed an SAP system by using Azure Center for SAP solutions, review the following table to identify the default instance numbers configured during deployment.

| Instance | Distributed systems (HA and non-HA) | Single server systems |
|---|---|---|
| ASCS | 00 | 01 |
| ERS | 01 | N/A |
| DB | 00 | 00 |
| APP | 00 | 02 |

## Delete a VIS

When you delete a VIS, you also delete the managed resource group and all instances that are attached to the VIS. The VIS, ASCS, Application Server, and Database instances are all deleted. Azure physical resources such as VMs, disks, and NICs aren't deleted when you delete a VIS.

> [!WARNING]
> Deleting a VIS is a permanent action. You **can't** restore a deleted VIS.

To delete a VIS:

1. [Open the VIS in the Azure portal](#open-a-vis-in-azure-portal).
1. On the overview page's menu, select **Delete**.

   :::image type="content" source="media/configure-virtual-instance/delete-vis-button.png" lightbox="media/configure-virtual-instance/delete-vis-button.png" alt-text="Screenshot of VIS resource in the Azure portal, showing delete button in the overview page's menu.":::

1. In the deletion pane, make sure that you want to delete this VIS and related resources. You can see a count for each type of resource to be deleted.

   :::image type="content" source="media/configure-virtual-instance/delete-vis-prompt.png" lightbox="media/configure-virtual-instance/delete-vis-prompt.png" alt-text="Screenshot where a VIS resource list of related resources is prepared for permanent deletion.":::

1. Enter **YES** in the confirmation field.
1. Select **Delete** to delete the VIS.
1. Wait for the deletion to finish.

After you delete a VIS, you can register the SAP system again. Open Azure Center for SAP solutions in the Azure portal, and select **Register an existing SAP system**.

## Connect to an SAP application

To connect to the SAP application:

1. Open your SAP client or connection tool.
1. Use the following credentials:

| Setting | Value |
|---|---|
| User | `DDIC`, `RFC_USER`, or `SAP*` |
| Client ID | `000` |

## Connect to HANA database

If you deployed an SAP system by using Azure Center for SAP solutions, [find the SAP system's main password and HANA database passwords](#find-sap-and-hana-passwords).

The HANA database username is either `system` or `SYSTEM` for:

- Distributed High Availability (HA) SAP systems
- Distributed non-HA systems
- Standalone systems

### Find SAP and HANA passwords

To retrieve the password:

1. [Open the VIS in the Azure portal](#open-a-vis-in-azure-portal).
1. On the overview page, select the **Managed resource group**.

   :::image type="content" source="media/configure-virtual-instance/select-managed-resource-group.png" lightbox="media/configure-virtual-instance/select-managed-resource-group.png" alt-text="Screenshot of VIS resource in the Azure portal, showing selection of managed resource group on the overview page.":::

1. On the resource group's page, select the **Key vault** resource in the table.

   :::image type="content" source="media/configure-virtual-instance/select-key-vault.png" lightbox="media/configure-virtual-instance/select-key-vault.png" alt-text="Screenshot of managed resource group in the Azure portal, showing the selection of the key vault on the overview page.":::

1. On the key vault page, select **Secrets** in the sidebar menu under **Settings**.
1. Verify that you have access to all the secrets. If you have the correct permissions, you can see the SAP password file listed in the table. This file contains the global password for your SAP system.
1. Select the SAP password file name to open the secret page.
1. Copy the **Secret value**.

If you receive the following warning:

```warning
The operation 'List' is not enabled in this key vault's access policy.

You are unauthorized to view these contents.
```

1. Verify that you're authorized to manage these secrets in your organization.
1. In the sidebar menu, under **Settings**, select **Access policies**.
1. On the access policies page for the key vault, select **+ Add Access Policy**.
1. In the **Add access policy** pane, configure the following settings.
   1. For **Configure from template (optional)**, select **Key, Secret, & Certificate Management**.
   1. For **Key permissions**, select the keys that you want to use.
   1. For **Secret permissions**, select the secrets that you want to use.
   1. For **Certificate permissions**, select the certificates that you want to use.
   1. For **Select principal**, assign your own account name.
1. Select **Add** to add the policy.
1. In the access policy's menu, select **Save** to save your settings.
1. In the sidebar menu, under **Settings**, select **Secrets**.
1. On the secrets page for the key vault, make sure you can now see the SAP password file.

## Next steps

- [Monitor SAP system from the Azure portal](monitor-portal.md)
- [Get quality checks and insights for your VIS](get-quality-checks-insights.md)
