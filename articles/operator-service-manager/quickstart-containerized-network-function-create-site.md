---
title: Create a Containerized Network Functions (CNF) Site with Nginx
description: TBD
author: HollyCl
ms.author: HollyCl
ms.date: 09/08/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Create a Containerized Network Functions site with Nginx

This article helps you create a Containerized Network Functions (CNF) site using the Azure portal. A site is the collection of assets that represent one or more instances of nodes in a network service that should be discussed and managed in a similar manner. 

A site can represent:
- A physical location such as DC or rack(s). 
- A node in the network that needs to be upgraded separately (early or late) vs other nodes. 
- Resources serving particular class of customer. 

Sites can be within a single Azure region or an on-premises location. If collocated, they can span multiple NFVIs (such as multiple K8s clusters in a single Azure region). 

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Complete the [Quickstart: Design a Network Service Design for Nginx Container as CNF.](quickstart-containerized-network-function-network-design.md)
- Complete the [Quickstart: Prerequisites for Operator and Containerized Network Function (CNF)](quickstart-containerized-network-function-operator.md).

## Create a site

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
1. Select **Create a resource**.
1. Search for **Sites**, then select **Create**.
1. On the **Basics tab**, enter or select your **Subscription**, **Resource group**, and the **Name** and **Region** of your instance. 

    :::image type="content" source="media/create-site-basics-tab.png" alt-text="Screenshot showing the Basic tab to enter Project details and Instance details for your site.":::
    > [!NOTE]
    > The site must be located in the same region as the prerequisite resources.  
1. Add the Network Function Virtualization Infrastructure (NFVIs).


    |Setting  |Value  |
    |---------|---------|
    |NFVI Name     |  Enter nginx_NFVI.       |
    |NFVI Type     |   Select Azure Core.      |
    |NFVI Location    |    Select the location you used for your prerequisite resource.     |

    :::image type="content" source="media/create-site-add-nfvis.png" alt-text="Screenshot showing the Add the NFVIs table to enter the name, type and location of the NFVIs.":::

    > [!NOTE]
    > This example features a single Network Function Virtual Infrastructure (NFVI) named nginx_NFVI. If you modified the nsd_name in the input.json file while publishing the NSD, the NFVI name should be <nsd_name>_NFVI. Ensure that the NFVI type is set to Azure Core and that the NFVI location matches the location of the prerequisite resources.  

1. Select **Review + create**, then select **Create**.

## Next steps

- [Quickstart: Create a Containerized Network Function (CNF) Site Network Service (SNS) with Nginx](quickstart-containerized-network-function-create-site-network-service.md)
