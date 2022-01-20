---
title: Move a private mobile network to another region
titlesuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to move your private mobile network to another Azure region. 
author: drichards
ms.author: djrmetaswitch
ms.service: private-mobile-network
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 01/20/2022
ms.custom: template-how-to
#Customer intent: As a service provider or systems integrator, I want to move a private mobile network to another Azure region.
---

# Move an Azure Private 5G Core Preview private mobile network to another Azure region

There are scenarios where you might want to move your private mobile network from one region to another. You might move your private mobile network to another region for a number of reasons. For example, to take advantage of a new Azure region, to deploy features or services available in specific regions only, to meet internal policy and governance requirements, or in response to capacity planning requirements.<!-- need to confirm if any of those apply --> In this how-to-guide, you'll learn how to move a private mobile network.

> [!CAUTION]
> There will be a service interruption while you move your private mobile network to another region. You must carry out this procedure during a maintenance window. 

<!-- need to confirm whether we want to acknowledge this --> 

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Identify the resource group containing your private mobile network resources.

## Prepare the template

Use the information in [Use Azure portal to export a template](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/export-template-portal) to export all resources in the resource group containing your private mobile network, with the exception of the **Azure Network Function Manager - Network Function** resource.

## Delete the existing private mobile network

Follow the instructions in [Delete a private mobile network](delete-private-mobile-network.md) to delete the existing mobile network.

## Modify the template

Load and modify the template so you can create a new private mobile network in the target region.

1. In the Azure portal, select **Create a resource**.
1. In **Search the Marketplace**, type **template deployment**, and then select Enter.
1. Select **Template deployment (deploy using custom templates)**.
1. Select **Create**.
1. Select **Build your own template in the editor**.
1. Select **Load file**, and then select the *template.json* file you downloaded in [Prepare the template](#prepare-the-template).
1. <!-- what modifications will customers need to make? -->

## Move the private mobile network

Deploy the template to create the private mobile network in the target region.

1. Now that you've made your modifications, select **Save** below the `template.json` file.
1. Enter or select the property values:
   - **Subscription**: Select the subscription you used for the existing private mobile network. You identified this in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
   - **Resource group**: Provide the name of a new resource group in which to create your resources.
   - **Region**: Select **Create new** and give the resource group a name.
1. Select **Review and create**, then select **Create**.

