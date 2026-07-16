---
title: Manage Supercomputer and Nodepools in Microsoft Discovery
description: How to create and manage supercomputer and Nodepools
author: anzaman
ms.author: alzam
ms.service: azure
ms.topic: how-to
ms.date: 04/01/2026
---

# How to create a supercomputer and nodepools in Microsoft Discovery

> **Applies to:** Microsoft Discovery (Public Preview)

This article describes how to create a **Supercomputer** and **NodePools** using the Azure portal. It follows Learn.microsoft.com conventions and is safe for public preview documentation.

---

## Overview

A **Supercomputer** is a managed compute cluster in Microsoft Discovery. **NodePools** provide the underlying virtual machines (VMs) that run workloads on the Supercomputer. You can attach multiple Node Pools, each with different VM types and scaling limits, to a single Supercomputer.

This article is **scoped only to Supercomputer and NodePool creation**. Prerequisites such as networking, identities, and storage must already be in place.

> [!IMPORTANT]
> This article doesn't cover workspace creation, storage provisioning, or network setup. Complete those steps before continuing.

---

## Prerequisites

Before you begin, make sure the following requirements are met:

- An Azure subscription with the **Microsoft.Discovery** resource provider registered.
- A virtual network with the following subnets:
  - `aksSubnet` – used by the Supercomputer control plane
  - `supercomputerNodepoolSubnet` – used by Node Pools
- A **user-assigned managed identity (UAMI)** with the required role assignments.
- Sufficient quota for the VM type you plan to use in the target region.

---

## Create a Supercomputer

A Supercomputer represents the managed compute cluster that hosts one or more Nodepools.

### Create the Supercomputer resource

1. Sign in to the [**Azure portal**](https://portal.azure.com)
2. In the search bar, enter **Microsoft Discovery Supercomputers**.
3. Select **Create**.
4. On the **Basics** tab, specify:
   - **Subscription**
   - **Resource group**
   - **Region**
   - **Supercomputer name**
5. Select **Next**.

:::image type="content" source="./media/how-to-manage-supercomputers/create-supercomputer-basics.jpg" alt-text="Screenshot of Azure portal showing Basic Settings of supercomputer." lightbox="./media/how-to-manage-supercomputers/create-supercomputer-basics.jpg":::

### Configure networking

1. On the **Networking** tab:
   - Select the virtual network created during prerequisites.
   - Select the `aksSubnet` subnet.
2. Select **Next**.

:::image type="content" source="./media/how-to-manage-supercomputers/create-supercomputer-networking.jpg" alt-text="Screenshot of Azure portal showing Networking Settings of supercomputer." lightbox="./media/how-to-manage-supercomputers/create-supercomputer-networking.jpg":::

### Assign managed identities

1. On the **Identity** tab, add the user-assigned managed identity (UAMI).
2. Assign the same UAMI for:
   - **Cluster identity**
   - **Kubelet identity**
   - **Workload identity**

This identity allows the Supercomputer to securely access Azure resources such as storage accounts.

:::image type="content" source="./media/how-to-manage-supercomputers/create-supercomputer-identities.jpg" alt-text="Screenshot of Azure portal Assign UAMI page." lightbox="./media/how-to-manage-supercomputers/create-supercomputer-identities.jpg":::

### Create the Supercomputer

1. Review your selections.
2. Select **Create**.
3. Wait for deployment to complete. The provisioning state must show **Succeeded**.

:::image type="content" source="./media/how-to-manage-supercomputers/create-supercomputer-success.jpg" alt-text="Screenshot of Azure portal supercomputer overview page." lightbox="./media/how-to-manage-supercomputers/create-supercomputer-success.jpg":::

---

## Create a Nodepool

Nodepools define the compute capacity (VMs) attached to a Supercomputer. You can create multiple Nodepools with different VM types and scaling limits.

### Open the Supercomputer

1. In the Azure portal, open the Supercomputer resource.
2. Under **Settings**, select **Nodepools**.
3. Select **Create**.

   :::image type="content" source="./media/how-to-manage-supercomputers/create-supercomputer-node-pool-create.jpg" alt-text="Screenshot of Azure portal showing Supercomputer create nodepool page." lightbox="./media/how-to-manage-supercomputers/create-supercomputer-node-pool-create.jpg":::

### Configure basic settings

1. Enter a **Nodepool name** that meets the following requirements:
   - Lowercase letters only
   - Maximum of 12 characters
   - Starts with a letter
   - Letters and numbers only
2. Select the **Region**.
3. Select **Next**.

### Configure networking

1. Select the same virtual network used by:
   - The Supercomputer
   - Microsoft Discovery shared storage
2. Select the `supercomputerNodepoolSubnet` subnet.
3. Select **Next**.

### Select VM configuration

1. Choose a **Virtual Machine type** for the Node Pool.

   :::image type="content" source="./media/how-to-manage-supercomputers/create-supercomputer-node-pool-vm-configuration.jpg" alt-text="SCreenshot of Azure portal showing Nodepool select VM type." lightbox="./media/how-to-manage-supercomputers/create-supercomputer-node-pool-vm-configuration.jpg":::

> [!NOTE]
> The selected Virtual Machine type must be available and quota-approved in the selected region.

2. Select **Next**.

### Configure scaling

Specify the **maximum node count**, which defines the upper bound for automatically scaling.

   :::image type="content" source="./media/how-to-manage-supercomputers/create-supercomputer-node-pool-scaling.jpg" alt-text="Screenshot of Azure portal showing Nodepool scaling options." lightbox="./media/how-to-manage-supercomputers/create-supercomputer-node-pool-scaling.jpg":::

### Create the Nodepool

1. Review your selections.
2. Select **Create**.
3. Wait for provisioning to complete. The Nodepool provisioning state must show **Succeeded**.

---

## Delete a Supercomputer

You must delete all associated nodepools before you can delete a supercomputer.

To delete the nodepools, follow these steps:

1. Sign in to the Azure portal
2. Navigate to the Supercomputer

    - In the top search bar, type "Microsoft Discovery Supercomputers."
    - Select Microsoft Discovery Supercomputers.
    - Select the Supercomputer that owns the nodepool.
3. Select the **Nodepool** under **Settings** in the left pane.

   :::image type="content" source="./media/how-to-manage-supercomputers/delete-node-pool.jpg" alt-text="Screenshot of Azure portal showing nodepools." lightbox="./media/how-to-manage-supercomputers/delete-node-pool.jpg":::

4. Select the nodepool or nodepools that you want to delete and select **Delete**
1. Wait for all the nodepools to get deleted, then navigate to the supercomputer and select the **Overview** section in the left pane

   :::image type="content" source="./media/how-to-manage-supercomputers/delete-supercomputer.jpg" alt-text="Screenshot of Azure portal showing supercomputer overview." lightbox="./media/how-to-manage-supercomputers/delete-supercomputer.jpg":::

1. Select **Delete**

## Troubleshooting Common Issues

### Deployment Failures

- **Insufficient Quota**: Ensure you have sufficient VM quota in the selected region
- **Network Configuration**: Verify virtual network and subnet configurations are correct
- **Identity Permissions**: Confirm the UAMI has the required permissions

### Performance Considerations

- **Nodepool Sizing**: Choose VM type that match your computational requirements
- **Scaling Limits**: Set appropriate maximum node counts based on your workload patterns
- **Regional Availability**: Select regions with good availability for your chosen VM type

## Security Considerations

- **Network Isolation**: Supercomputers operate within your virtual network boundaries
- **Identity Management**: Use managed identities for secure access to Azure resources
- **Access Control**: Implement least-privilege access principles for supercomputer resources
- **Monitoring**: Enable Azure Monitor and logging for operational insights

---

## Next steps

After creating a Supercomputer and Node Pools, you can:

- Attach the Supercomputer to a **Microsoft Discovery workspace**.
- Run tools, workflows, and investigations using Node Pools.
- Add more Nodepools with different VM types as your workload requirements evolve
