---
title: Create Enclaves in a Community on Azure Virtual Enclaves
description: Create Enclaves in a Community on Azure Virtual Enclaves.
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
ms.custom: references_region
---

# Tutorial 2: Create Enclaves in a Community on Azure Virtual Enclaves

An enclave is an isolated Azure Virtual Network that is part of a community in which one or more workloads are hosted. 

In this tutorial, part two of eight, you deploy enclaves into a community. You learn how to:

- ✅ Create several isolated enclaves as spokes in the hub-and-spoke network
- ✅ View enclaves in Azure portal

## Before you begin
In the previous [tutorial](./1-create-community.md), you used Azure portal to create a simple community. If you haven't created the community yet, return to [Tutorial 1 - Deploy a community](./1-create-community.md).

## Create an enclave using Azure Virtual Enclaves
Before creating an enclave instance, you need a resource group. An Azure resource group is a logical container into which you deploy and manage Azure resources. Learn more about each of the settings of an [enclave](./what-enclave.md) and [How-To Create an Enclave](./create-enclave-azure-portal.md).

> [!Important]
>
> This tutorial uses `myResourceGroup` as a placeholder for the resource group name. If you want to use a different name, replace `myResourceGroup` with your own resource group name.

Enclave deployments take around 30-45 minutes to complete. Once it completes, open your Enclave and verify that the Status is `succeeded`.

1. In the `Azure Virtual Enclaves` page, select `Enclaves` in the left menu.

![Screenshot showing the Azure Virtual Enclaves portal page with the Enclaves list selected.](./media/tutorial-step-two-azure-virtual-enclaves-page-enclaves-list.png)

2. On the `Enclaves` page, select `Create`.

3. Enter the basic details for your first Enclave:
   - **Subscription**: Select an existing Subscription
   - **Resource Group**: `myResourceGroup`
   - **Enclave name**: `Enclave-WebApp`
   - **Region**: `East US`
   - **Community**: Select the Community created in the earlier tutorial `fabrikam` - [1. Deploy a community](./1-create-community.md).

![Screenshot showing the create WebApp Enclave screen with the basics inputs for the tutorial environment.](./media/tutorial-step-two-create-webapp-enclave-screen-basics-input.png)

4. Select `Review + create`, ensure the details for your Enclave are correct, and select `Create`.

5. Now, to deploy another Enclave -- **repeat Steps 1 and 2.** Once you are on the **Enclave Create** page, Enter these basic details for your second Enclave:
   - **Subscription**: Select an existing Subscription
   - **Resource Group**: `myResourceGroup`
   - **Enclave name**: `Enclave-DMZ`
   - **Region**: `East US`
   - **Community**: Select the Community created in the earlier tutorial `fabrikam` - [1. Deploy a community](./1-create-community.md).

![Screenshot showing the create DMz Enclave screen with the basics inputs for the tutorial environment.](./media/tutorial-step-two-create-dmz-enclave-screen-basics-input.png)

6. After the Enclave resources have been created, you can view them in Azure portal from the fabrikam community.

![Screenshot showing created enclaves on listed on enclaves page.](./media/tutorial-step-two-azure-virtual-enclaves-page-enclaves-list-both-deployed.png)

7. Select an enclave name to view and manage the enclave
   
![Screenshot showing created WebApp enclave on its overview page.](./media/tutorial-step-two-webapp-enclave-overview-page.png)

## Clean up resources
If you need to delete your enclaves created after completing this tutorial, this can be also done from the Azure portal.

![Screenshot showing the completed enclave in the Azure Virtual Enclaves portal page.](./media/tutorial-step-two-azure-virtual-enclaves-page-enclaves-list-both-deployed.png)

## Next steps
In this tutorial, you created two sample Enclaves using Azure portal. In the next tutorial, you learn how to create several workloads within your enclave.
