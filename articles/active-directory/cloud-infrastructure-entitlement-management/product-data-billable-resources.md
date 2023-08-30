---
title: View current billable resources in your authorization systems
description: How to view current billable resources in your authorization system in Microsoft Entra Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 06/19/2023
ms.author: jfields
---

# View billable resources listed in your authorization system

Gain insight into current billable resources listed in your authorization system. In Microsoft Entra Permissions Management, a billable resource is defined as a cloud service that uses compute or memory and requires a license. The Permissions Management Billable Resources tab shows you which resources are in your authorization system, and how many of them you're being billed for.

Here's the current list of resources per cloud provider. This list is subject to change as cloud providers add more services in the future.

:::image type="content" source="media/onboard-enable-tenant/billable-resources.png" alt-text="A table of current Microsoft billable resources." lightbox="media/onboard-enable-tenant/billable-resources.png":::

## View resources in your authorization system

1. To access your billable resource information, from the Permissions Management home page, select Settings (gear icon).
1. Select the Billable Resources tab.
1. Select your Authorization System:

    - **AWS** for Amazon Web Services.
    - **Azure** for Microsoft Azure.
    - **GCP** for Google Cloud Platform.

    The interface displays information showing which resource you have in your Authorization System per category.

1. To change the columns displayed in the table, select **Columns**, and then select the information you want to display.

    - To discard your changes, select **Reset to default**.


## Next steps

- For information about viewing and configuring settings for collecting data from your authorization system and its associated accounts, see [View and configure settings for data collection](product-data-sources.md).
