---
title: "Tutorial 1-3: Create workloads in an enclave on Azure Virtual Enclaves"
description: Create frontend and backend workloads in an Azure Virtual Enclaves enclave by using the Azure portal.
author: aserfass-msft
ms.author: aserfass
ms.topic: tutorial
ms.date: 06/02/2026
---

# Tutorial 1-3: Create workloads in an enclave on Azure Virtual Enclaves

Workloads are logical groupings that help you organize Azure resources inside an Azure Virtual Enclaves (AVE) enclave. Each workload is associated with one or more workload resource groups where you deploy resources in later tutorials.

In this tutorial, part three of eight, you create workloads inside an enclave. You learn how to:

- Create frontend and backend workloads in an enclave.
- Associate each workload with a workload resource group.
- View workloads in the Azure portal.

## Before you begin

Complete [Tutorial 1-2: Create enclaves in a community](./1-2-create-enclaves-inside-community.md). This tutorial assumes that you have:

- An Azure account with an active subscription.
- An AVE community named `fabrikam`.
- An enclave named `Enclave-WebApp`.
- Permissions to create AVE workload resources and resource groups in the subscription.

## Create workloads using Azure Virtual Enclaves

Before creating Azure resources in an enclave, create the AVE workload resources and associate them with workload resource groups. Azure Virtual Enclaves applies enclave policy, guardrail, deny-assignment, and RBAC configuration to workload resource groups during creation.

> [!Important]
> This tutorial uses sample names such as `wl-webapp-frontend`, `wl-webapp-backend`, `rg-webapp-frontend`, and `rg-webapp-backend`. If you use different names, update the later tutorials to match your environment.

1. In the Azure portal, go to `Azure Virtual Enclaves`.

2. In the left menu, select `Enclaves`.

3. On the `Enclaves` page for the `fabrikam` community, select the `Enclave-WebApp` enclave that you created in [Tutorial 1-2: Create enclaves in a community](./1-2-create-enclaves-inside-community.md).

[ ![Screenshot showing the WebApp enclave overview.](./media/tutorial-step-two-webapp-enclave-overview-page.png) ](./media/tutorial-step-two-webapp-enclave-overview-page.png#lightbox)

4. Under `Manage`, select `Workloads`.

5. On the `Workloads` page, select `Create`.

[ ![Screenshot showing the WebApp enclave workloads list with the create button highlighted.](./media/tutorial-step-three-webapp-enclave-workload-list-create.png) ](./media/tutorial-step-three-webapp-enclave-workload-list-create.png#lightbox)

6. On the `Basics` tab, enter the following values for the frontend workload:

   - `Enclave`: Confirm that `Enclave-WebApp` is selected.
   - `Workload name`: Enter `wl-webapp-frontend`.
   - `Resource groups`: Select `Add`.
   - `Create new`: Enter `rg-webapp-frontend`, and then select `OK`.

> [!Note]
> Choose workload and resource group names that match your organization's naming convention. For guidance, see [Define your naming convention](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming).

![Screenshot showing the frontend workload creation screen with the tutorial inputs entered.](./media/tutorial-step-three-create-frontend-workload-screen-basics-input.png)

7. Select `Review + create`, confirm the workload details, and then select `Create`.

8. To create the backend workload, repeat the previous steps with these values:

   - `Enclave`: Confirm that `Enclave-WebApp` is selected.
   - `Workload name`: Enter `wl-webapp-backend`.
   - `Resource groups`: Select `Add`.
   - `Create new`: Enter `rg-webapp-backend`, and then select `OK`.

![Screenshot showing the backend workload creation screen with the tutorial inputs entered.](./media/tutorial-step-three-create-backend-workload-screen-basics-input.png)

9. Select `Review + create`, confirm the workload details, and then select `Create`.

## Validate the workloads

After both deployments complete, return to the `Workloads` page for `Enclave-WebApp`.

[ ![Screenshot showing both workloads deployed successfully.](./media/tutorial-step-three-workloads-deployed.png) ](./media/tutorial-step-three-workloads-deployed.png#lightbox)

Confirm that:

- `wl-webapp-frontend` appears in the workload list.
- `wl-webapp-backend` appears in the workload list.
- Each workload is associated with the expected workload resource group.

## Clean up resources

If you plan to continue the tutorial series, keep these workloads. Tutorial 1-4 uses them to deploy Azure resources from the service catalog.

If you need to remove the workloads created in this tutorial, first delete any resources in the associated workload resource groups. Workload deletion can fail when associated resource groups aren't empty.

After the workload resource groups are empty, delete the `wl-webapp-frontend` and `wl-webapp-backend` workload resources from the Azure portal.

[ ![Screenshot showing both workloads deployed successfully and selected for deletion.](./media/tutorial-step-three-workloads-deployed.png) ](./media/tutorial-step-three-workloads-deployed.png#lightbox)

## Next steps

In this tutorial, you created sample workloads in an enclave by using the Azure portal. In the [next tutorial](./1-4-use-service-catalog-create-azure-resources-workloads.md), you deploy Azure resources into those workloads by using the service catalog.
