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

A site may represent:
- A physical location such as DC or rack(s). 
- A node in the network that needs to be upgraded separately (early or late) vs other nodes. 
- Resources serving particular class of customer. 

Sites can be within a single Azure region or an on-premises location. If collocated, they can span multiple NFVIs (such as multiple K8s clusters in a single Azure region). 

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/en-us/free/?WT.mc_id=A261C142F) before you begin.
- Complete the Quickstart: Design a Network Service Design for Nginx Container as CNF.

## Create a Site

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
1. Select **Create a resource**.
1. Search for **Sites**, then select **Create**.
1. On the **Basics tab**, enter or select your **Subscription**, **Resource group**, and the **Name** and **Region** of your instance. 
    :::image type="content" source="media/create-site-basics-tab.png" alt-text="Shows the Basic tab to enter Project details and Instance details for your site.":::
    > [!NOTE]
    > The site must be located in the same region as the prerequisite resources.  
1. Navigate to the **NFVI** tab and enter "nginx_NFVI" for the **NFVI name**, select Azure Core as the **NFVI type** and select UK South for the **NFVI location**.
:::image type="content" source="media/create-site-add-nfvis.png" alt-text="Shows the Add the NFVIs table to enter the name, type and location of the NFVIs.":::
    > [!NOTE]
    > This example features a single Network Function Virtual Infrastructure (NFVI) named nginx_NFVI. If you modified the nsdg_name in the input.json file while publishing NSD, the NFVI name should be <nsdg_name>_NFVI. Ensure that the NFVI type is set to Azure Core and that the NFVI location matches the location of the prerequisite resources.  
1. Select **Review + create**, then select **Create**.

## Delete Site

In Azure Operator Service Manager (AOSM), deleting a site requires careful consideration of the associated child resources. To ensure a smooth deletion process, it's important to follow specific guidelines based on the presence of child resources. 

### Delete a Site with no child resources

If a Site has no child resources deployed, you can proceed with the deletion process. 

1. In the search box at the top of the portal, enter resource groups. Select **Resource groups** in the search results. 
1. From the list of resource groups, select the resource group that contains the site you want to delete. 
1. Select the site, then select **delete**. 
1. Confirm the deletion when prompted. 

### Delete a Site with deployed child resources

When a Site has child \ linked resources deployed within it, a sequential approach is required. 

1. Identify and list all the child \ linked resources associated with the Site you want to delete.
   > [!IMPORTANT]
    > This includes both configuration group values and site network services. Consult the documentation for each resource type to understand the specific deletion procedure. This step is crucial to ensure that you follow the correct steps for each resource type. 
1. Prioritize the deletion based on any interdependencies among the child \ linked resources. Delete child \ linked resources that don't have dependencies first before proceeding to others. 
1. Once all child resources are safely deleted, follow the steps to [Delete a Site with no child resources](#delete-a-site-with-no-child-resources).