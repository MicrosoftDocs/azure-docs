---
title: How to delete operator resources
description: Learn how to delete operator services
author: sherrygonz
ms.author: sherryg
ms.date: 09/11/2023
ms.topic: how-to
ms.service: azure-operator-service-manager
---

# Delete operator resources in Azure Operator Service Manager

In this how-to guide, you learn how to delete operator resources. In Azure Operator Service Manager (AOSM), deleting a site resource requires careful consideration of the associated child resources. To ensure a smooth deletion process, it's important to follow specific guidelines based on the presence of child resources. 

## Prerequisites

- You must already have a site, in your deployment, that you want to delete.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create the site(s).

## Delete a site with no child resources

If a site has no child resources deployed, you can proceed with the deletion process. 

1. In the search box at the top of the portal, enter resource groups. Select **Resource groups** in the search results. 
1. From the list of resource groups, select the resource group that contains the site you want to delete. 
1. Select the site, then select **delete**. 
1. Confirm the deletion when prompted. 

## Delete a site with deployed child resources

When a site has child \ linked resources deployed within it, a sequential approach is required. 

1. Identify and list all the child \ linked resources associated with the site you want to delete.
   > [!IMPORTANT]
    > This includes both Configuration Group Values and Site Network Services. Consult the content for each resource type to understand the specific deletion procedure. This step is crucial to ensure that you follow the correct steps for each resource type. 
1. Prioritize the deletion based on any interdependencies among the child \ linked resources (Site Network Services and Configuration Group Values). Delete child \ linked resources that don't have dependencies first before proceeding to others. 
1. Once all child resources are safely deleted, follow the steps to [Delete a site with no child resources](#delete-a-site-with-no-child-resources).