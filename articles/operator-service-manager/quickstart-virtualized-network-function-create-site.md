---
title: Create a Virtualized Network Functions (VNF) Site
description: Learn how to create a Virtualized Network Functions (VNF) Site
author: Hollycl
ms.author: Hollycl
ms.date: 09/14/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Create a virtualized network functions (VNF) site for an Ubuntu virtual machine

This article shows you how to create a Site using the Azure portal.  A site is the collection of assets that represent one or more instances of nodes in a network service that should be discussed and managed in a similar manner.

A site can represent:

- A physical location such as DC or rack(s).
- A node in the network that needs to be upgraded separately (early or late) vs other nodes.
- Resources serving particular class of customer.

Sites can be within a single Azure region or an on-premises location. If collocated, they can span multiple NFVIs (such as multiple K8s clusters in a single Azure region).

> [!IMPORTANT]
> You must create a site prior to creating a site network service.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Complete the [Quickstart: Prerequisites for Operator and Virtualized Network Function (VNF)](quickstart-virtualized-network-function-operator.md)

## Create a site

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
1. Prior to creating a site, navigate to the resource group you created in the [Quickstart: Design a Network Service Design (NSD) for Ubuntu Virtual Machine (VM) as a Virtualized Network Function (VNF)](quickstart-virtualized-network-function-network-design.md) and select **Network Service Design Version**.

    :::image type="content" source="media/network-service-design-version.png" alt-text="Screenshot showing the network service design version used in creating your site.":::

1. Select **NVFI from site**, select **View value as JSON**, and locate the "name" of the NFVI. Note this information. You'll need it in a later step. 

    :::image type="content" source="media/network-service-design-version-name.png" alt-text="Screenshot showing the Add the NFVIs table to enter the name, type and location of the NFVIs.":::

1. Type Sites into the search and select **Sites** from the results.
1. Select  **+Create**.
1. On the **Basics tab**,  enter or select the following information:

    |Setting  |Value  |
    |---------|---------|
    |**Subscription**     | Select the **Subscription**.        |
    |**Resource Group**     |   Select **OperatorResourceGroup**.      |
    |**Name**     |   Enter *ubuntu-vm-site*.  This name should be unique in your subscription to avoid confusion when you create the SNS later.     |
    |**Region**     |    Select the location you used for your prerequisite resource.     |

   :::image type="content" source="media/create-site-basic-virtual-network-function.png" alt-text="Screenshot showing the Basic tab to enter Project details and Instance details for your site.":::

> [!NOTE]
 > The site must be located in the same region as the [prerequisite resources](quickstart-virtualized-network-function-prerequisites.md).  


7. Navigate to the **Add NFVI** tab of the **Create site** screen and select **+ Add NFVI**.
1. Enter the NFVI name you noted earlier.  Select **NFVI type** as "Azure Core", set **NFVI location** to the location of your resources, and select **Add NFVI**.

    :::image type="content" source="media/create-site-add-ubuntu.png" alt-text="Screenshot showing the NFVI tab where you enter the name, type and location of the NFVI.":::

1. Select **Review + create**, then select **Create**.

## Next steps

- Complete [Quickstart: Create a Virtualized Network Function (VNF) Site Network Service (SNS) for Ubuntu Virtual Machine (VM)](quickstart-virtualized-network-function-create-site-network-service.md).
