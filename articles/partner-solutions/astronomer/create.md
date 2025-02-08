---
title: Create an Apache Airflow on Astro deployment
description: This article describes how to use the Azure portal to create an instance of Apache Airflow on Astro - An Azure Native ISV Service.
ms.topic: quickstart
ms.date: 02/07/2025
ms.custom:
  - references_regions
  - ignite-2023
---

In this quickstart, you create an instance of Apache Airflow on Astro.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to Apache Airflow on Astro](overview.md#subscribe-to-apache-airflow-on-astro).

## Create an Astro resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics

1. Set the following values in the **Create an Astro Organization** pane.

    :::image type="content" source="media/astronomer-create/astronomer-create.png" alt-text="Screenshot of basics pane of the Astronomer create experience.":::

    | Property  | Description |
    |---------|---------|
    | **Subscription**  | From the drop-down, select your Azure subscription where you have Owner or Contributor access. |
    | **Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](/azure/azure-resource-manager/management/overview).|
    | **Resource Name**  | Put the name for the Astro organization you want to create. |
    | **Region** | Select the closest region to where you would like to deploy your resource. |
    | **Astro Organization name** | Corresponds to the name of your company, usually. |
    | **Workspace Name** | Name of the default workspace where you would like to group your Airflow deployments. |
    | **Pricing Plan**     | Choose the default Pay-As-You-Go option |

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

[Manage the Astro resource](manage.md)

