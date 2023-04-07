---
title: Create a Consumption + Dedicated workload profiles environment (preview) in the Azure portal
description: Learn to create an environment with a specialized hardware profile in the Azure portal. 
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  how-to
ms.date: 04/04/2023
ms.author: cshoe
ms.custom: references_regions
---

# Manage workload profiles in a Consumption + Dedicated workload profiles plan structure (preview) in the Azure portal

## Supported regions

The following regions support workload profiles during preview:

- North Central US
- North Europe
- West Europe
- East US

<a id="create"></a>

## Create a container app in a workload profile

At a high level, when you create a container app into a workload profile, you go through the following steps:

- Create a new container app
- Create a new environment
- Select a workload profile

1. Project details

    | Property | Value |
    | --- | --- |
    | Subscription | Select your subscription |
    | Resource group | Select or create a resource group |
    | Container app name | Enter your container app name |

1. Container Apps Environment

    | Property | Value |
    | --- | --- |
    | Region | Container Apps Environment |
    | Select your region | Select **Create New** |

1. Environment details

    | Property | Value |
    | --- | --- |
    | Environment name | Plan |
    | Enter an environment name | Select **(Preview) Consumption and Dedicated workload profiles** |
  
    Select the **Workload profiles** tab.
  
    :::image type="content" source="media/workload-profiles/azure-container-apps-dedicated-environment.png" alt-text="Create an Azure Container Apps Consumption + Dedicated plan environment.":::

1. Select the **Add workload profile** button.

1. For *Workload profile name*, enter a name.

1. Next to *Workload profile size*, select **Choose size**.

1. In the *Select a workload profile size* window, select a profile from the list.

    General purpose profiles offer a balanced mix cores vs memory for most applications.
  
    Memory optimized profiles offer specialized hardware with increased memory or compute capabilities.

1. Select the **Select** button.

1. For the *Autoscaling instance count range*, select the minimum and maximum number of instances you want available to this workload profile.

    :::image type="content" source="media/workload-profiles/azure-container-apps-workload-profile-slider.png" alt-text="Select the min and max instances for a workload profile.":::

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

    :::image type="content" source="media/workload-profiles/azure-container-apps-workload-profile-slider.png" alt-text="Select the minimum and maximum instances for a workload profile.":::

1. Select **Add**.

## Edit profiles

Under the *Settings* section, select **Workload profiles**.

From this window, you can:

- Adjust the minimum and maximum number of instances available to a profile
- Add new profiles
- Delete existing profiles (except for the Consumption profile)

## Delete a profile

Under the *Settings* section, select **Workload profiles**. From this window, you select a profile to delete.

> [!NOTE]
> The *Consumption* workload profile can’t be deleted.

## Next steps

> [!div class="nextstepaction"]
> [Workload profiles overview](./workload-profiles-overview.md)
