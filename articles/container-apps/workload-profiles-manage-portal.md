---
title: Create a workload profiles environment in the Azure portal
description: Learn to create an environment with a specialized hardware profile in the Azure portal. 
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  how-to
ms.date: 08/29/2023
ms.author: cshoe
ms.custom: references_regions
---

# Manage a workload profiles in the Azure portal

Learn to manage a [workload profiles](./workload-profiles-overview.md) environment in the Azure portal.

## Create a container app in a workload profile

1. Open the Azure portal.

1. Search for *Container Apps* in the search bar, and select **Container Apps**.

1. Select **Create**.

1. Create a new container app and environment.

    :::image type="content" source="media/workload-profiles/azure-container-apps-new-environment.png" alt-text="Screenshot of the create a container apps environment window.":::

    Enter the following values to create your new container app.

    | Property | Value |
    | --- | --- |
    | Subscription | Select your subscription |
    | Resource group | Select or create a resource group |
    | Container app name | Enter your container app name |
    | Region | Select your region. |
    | Container Apps Environment | Select **Create New**. |

1. Configure the new environment.

    :::image type="content" source="media/workload-profiles/azure-container-apps-workload-profiles-environment.png" alt-text="Screenshot of create an Azure Container Apps workload profiles environment window.":::

    Enter the following values to create your environment.

    | Property | Value |
    | --- | --- |
    | Environment name | Enter an environment name. |
    | Environment type| Select **Workload profiles** |
  
    Select the new **Workload profiles** tab at the top of this section.

1. Select the **Add workload profile** button.

    :::image type="content" source="media/workload-profiles/azure-container-apps-add-workload-profile.png" alt-text="Screenshot of the window to add a workload profile to the container apps environment.":::

1. For *Workload profile name*, enter a name.

1. Next to *Workload profile size*, select **Choose size**.

    :::image type="content" source="media/workload-profiles/azure-container-apps-add-workload-profile-details.png" alt-text="Screenshot of the window to select a workload profile for your container apps environment.":::

1. In the *Select a workload profile size* window, select a profile from the list.

    :::image type="content" source="media/workload-profiles/azure-container-apps-add-workload-profile-size.png" alt-text="Screenshot of the window to select a workload profile size.":::

    General purpose profiles offer a balanced mix cores vs memory for most applications.
  
    Memory optimized profiles offer specialized hardware with increased memory capabilities.

1. Select the **Select** button.

1. For the *Autoscaling instance count range*, select the minimum and maximum number of instances you want available to this workload profile.

    :::image type="content" source="media/workload-profiles/azure-container-apps-workload-profile-slider.png" alt-text="Screenshot of the window to select the min and max instances for a workload profile.":::

1. Select **Add**.

1. Select **Create**.

1. Select **Review + Create** and wait as Azure validates your configuration options.

1. Select **Create** to create your container app and environment.

## Add profiles

Add a new workload profile to an existing environment.

1. Under the *Settings* section, select **Workload profiles**.

1. Select **Add**.

1. For *Workload profile name*, enter a name.

1. Next to *Workload profile size*, select **Choose size**.

1. In the *Select a workload profile size* window, select a profile from the list.

    General purpose profiles offer a balanced mix cores vs memory for most applications.
  
    Memory optimized profiles offer specialized hardware with increased memory or compute capabilities.

1. Select the **Select** button.

1. For the *Autoscaling instance count range*, select the minimum and maximum number of instances you want available to this workload profile.

    :::image type="content" source="media/workload-profiles/azure-container-apps-workload-profile-slider.png" alt-text="Screenshot of the window to select the minimum and maximum instances for a workload profile.":::

1. Select **Add**.

## Edit profiles

Under the *Settings* section, select **Workload profiles**.

From this window, you can:

- Adjust the minimum and maximum number of instances available to a profile
- Add new profiles
- Delete existing profiles (except for the consumption profile)

## Delete a profile

Under the *Settings* section, select **Workload profiles**. From this window, you select a profile to delete.

> [!NOTE]
> The *Consumption* workload profile can’t be deleted.

## Next steps

> [!div class="nextstepaction"]
> [Workload profiles overview](./workload-profiles-overview.md)
