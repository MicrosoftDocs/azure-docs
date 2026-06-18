---
title: "Tutorial 1-2: Create enclaves in an Azure Enclave community"
description: Create two isolated enclaves in an Azure Enclave community by using the Azure portal.
author: aserfass-msft
ms.author: aserfass
ms.topic: tutorial
ms.date: 06/02/2026
---

# Tutorial 1-2: Create enclaves in an Azure Enclave community

An enclave is an isolated Azure Virtual Network that's part of a community and hosts one or more workloads.

In this tutorial, part two of eight, you create two enclaves in the community that you deployed in the previous tutorial. The enclaves become spokes in the community hub-and-spoke network topology.

In this tutorial, you:

- Create the `Enclave-WebApp` enclave.
- Create the `Enclave-DMZ` enclave.
- Validate that both enclaves are deployed successfully.
- View and manage enclaves in the Azure portal.

## Before you begin

Complete [Tutorial 1-1: Deploy a community](./1-1-create-community.md) before you start this tutorial. You need:

- An existing Azure Enclave community named `fabrikam`.
- A resource group named `myResourceGroup` for the enclave resource.
- Permissions to create Azure Enclave resources in the target subscription and resource group.
- Access to the Azure portal.

For more information about enclave settings, see [Create an enclave in the Azure portal](./create-enclave-portal.md) and [What is an enclave?](./what-enclave.md).

## Create enclaves using Azure Enclave

Before creating an enclave instance, you need a resource group. An Azure resource group is a logical container into which you deploy and manage Azure resources. Azure Enclave also creates managed resources for each enclave in a managed resource group.

> [!Important]
>
> This tutorial uses `myResourceGroup` as a placeholder for the resource group name. If you want to use a different name, replace `myResourceGroup` with your own resource group name.

Enclave deployments can take around 30-45 minutes to complete. After deployment completes, open your enclave and verify that `Status` is `Succeeded`.

1. In the `Azure Enclave` page, select `Enclaves` in the left menu.

![Screenshot showing the Azure Enclave portal page with the enclaves list selected.](./media/tutorial-step-two-azure-virtual-enclaves-page-enclaves-list.png)

2. On the `Enclaves` page, select `Create`.

3. Enter the basic details for your first enclave:
   - `Subscription`: Select an existing subscription
   - `Resource Group`: `myResourceGroup`
   - `Enclave name`: `Enclave-WebApp`
   - `Region`: `East US`
   - `Community`: Select the `fabrikam` community that you created in [Tutorial 1-1: Deploy a community](./1-1-create-community.md).

![Screenshot showing the create WebApp enclave screen with the basics inputs for the tutorial environment.](./media/tutorial-step-two-create-webapp-enclave-screen-basics-input.png)

4. Select `Review + create`, verify the settings, and then select `Create`.

5. To deploy the second enclave, repeat steps 1 and 2. On the `Create enclave` page, enter these basic details:
   - `Subscription`: Select an existing subscription
   - `Resource Group`: `myResourceGroup`
   - `Enclave name`: `Enclave-DMZ`
   - `Region`: `East US`
   - `Community`: Select the `fabrikam` community that you created in [Tutorial 1-1: Deploy a community](./1-1-create-community.md).

![Screenshot showing the create DMZ enclave screen with the basics inputs for the tutorial environment.](./media/tutorial-step-two-create-dmz-enclave-screen-basics-input.png)

6. Select `Review + create`, verify the settings, and then select `Create`.

## Validate the deployment

After the enclave resources are created, you can view them in the Azure portal from the `fabrikam` community.

![Screenshot showing created enclaves on listed on enclaves page.](./media/tutorial-step-two-azure-virtual-enclaves-page-enclaves-list-both-deployed.png)

Confirm that:

- `Enclave-WebApp` and `Enclave-DMZ` appear on the `Enclaves` page.
- Each enclave shows `Status` as `Succeeded`.
- Each enclave is associated with the `fabrikam` community.

Select an enclave name to view and manage the enclave.

![Screenshot showing created WebApp enclave on its overview page.](./media/tutorial-step-two-webapp-enclave-overview-page.png)

## Clean up resources

If you're continuing to the next tutorial, keep both enclaves. The next tutorial uses these enclave resources.

If you don't need the resources from this tutorial, delete `Enclave-WebApp` and `Enclave-DMZ` from the Azure portal.

![Screenshot showing the completed enclave in the Azure Enclave portal page.](./media/tutorial-step-two-azure-virtual-enclaves-page-enclaves-list-both-deployed.png)

## Next steps

In this tutorial, you created two sample enclaves by using the Azure portal. In the [next tutorial](./1-3-create-workloads-inside-enclave.md), you learn how to create workloads within your enclave.
