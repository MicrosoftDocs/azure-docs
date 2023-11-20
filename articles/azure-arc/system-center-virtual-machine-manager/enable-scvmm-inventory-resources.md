---
title: Enable SCVMM inventory resources in Azure Arc center (preview)
description: This article helps you enable SCVMM inventory resources from Azure portal (preview)
ms.service: azure-arc
ms.subservice: azure-arc-scvmm
author: jyothisuri
ms.reviewer: jsuri
ms.date: 10/31/2023
ms.topic: how-to
keywords: "VMM, Arc, Azure"
---

# Enable SCVMM inventory resources from Azure portal (preview)

The article describes how you can view SCVMM management servers and enable SCVMM inventory from Azure portal, after connecting to the SCVMM management server.

## View SCVMM management servers

You can view all the connected SCVMM management servers under **SCVMM management servers** in Azure Arc center.

:::image type="content" source="media/enable-scvmm-inventory-resources/view-scvmm-servers-inline.png" alt-text="Screenshot of how to view SCVMM servers." lightbox="media/enable-scvmm-inventory-resources/view-scvmm-servers-expanded.png":::

In the inventory view, you can browse the virtual machines (VMs), VMM clouds, VM network, and VM templates.
Under each inventory, you can select and enable one or more SCVMM resources in Azure to create an Azure resource representing your SCVMM resource.

You can further use the Azure resource to assign permissions or perform management operations.

## Enable SCVMM cloud, VM templates and VM networks in Azure

To enable the SCVMM inventory resources, follow these steps:

1. From Azure home > **Azure Arc** center,  go to **SCVMM management servers (preview)** blade and go to inventory resources blade.

    :::image type="content" source="media/enable-scvmm-inventory-resources/scvmm-server-blade-inline.png" alt-text="Screenshot of how to go to SCVMM management servers blade." lightbox="media/enable-scvmm-inventory-resources/scvmm-server-blade-expanded.png":::

1. Select the resource(s) you want to enable and select **Enable in Azure**.

    :::image type="content" source="media/enable-scvmm-inventory-resources/scvmm-enable-azure-inline.png" alt-text="Screenshot of how to enable in Azure option." lightbox="media/enable-scvmm-inventory-resources/scvmm-enable-azure-expanded.png":::

1. In **Enable in Azure**, select your **Azure subscription** and **Resource Group** and select **Enable**.

    :::image type="content" source="media/enable-scvmm-inventory-resources/scvmm-select-sub-resource-inline.png" alt-text="Screenshot of how to select subscription and resource group." lightbox="media/enable-scvmm-inventory-resources/scvmm-select-sub-resource-expanded.png":::

    The deployment is initiated and it creates a resource in Azure, representing your SCVMM resources. It allows you to manage the access to these resources through the Azure role-based access control (RBAC) granularly.

    Repeat the above steps for one or more VM networks and VM template resources.

## Enable existing virtual machines in Azure

To enable the existing virtual machines in Azure, follow these steps:

1. From Azure home > **Azure Arc** center,  go to **SCVMM management servers (preview)** blade and go to inventory resources blade.

1. Go to **SCVMM inventory** resource blade, select **Virtual machines** and then select the VMs you want to enable and select **Enable in Azure**.

    :::image type="content" source="media/enable-scvmm-inventory-resources/scvmm-enable-existing-vm-inline.png" alt-text="Screenshot of how to enable existing virtual machines in Azure." lightbox="media/enable-scvmm-inventory-resources/scvmm-enable-existing-vm-expanded.png":::

1. Select your **Azure subscription** and **Resource group**.

1. Select **Enable** to start the deployment of the VM represented in Azure.

>[!NOTE]
>Moving SCVMM resources between Resource Groups and Subscriptions is currently not supported.

## Next steps

[Connect virtual machines to Arc](quickstart-connect-system-center-virtual-machine-manager-to-arc.md)
