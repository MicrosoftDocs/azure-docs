---
title: Microsoft CloudKnox Permissions Management - Display an inventory of created resources and licenses for your authorization system
description: How to display an inventory of created resources and licenses for your authorization system in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/26/2022
ms.author: v-ydequadros
---

# Display an inventory of  created resources and licenses for your authorization system

You can use the **Inventory** dashboard in Microsoft CloudKnox Permissions Management (CloudKnox) to display an inventory of created resources and licensing information for your authorization system and its associated accounts.

## View resources created for your authorization system

1. To access inventory and licensing information about your data sources, at the top of the CloudKnox page, select **Settings** (the gear icon).

1. In the Inventory dashboard, select the **Inventory** tab.

    The **Inventory** tab displays:
    - The **Authorization system** name column displays the account names.
    - The number of **Dynamodb table** entries.
    - The number of **EC2 instance** entries.
    - The number of **VPC internet gateway** entries.
    - The number of **Elasticache cluster** entries.
    - The number of **Lambda function** entries. 

1. Select the authorization system you want: Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).

1. To change the columns displayed in the table, select **||| Columns**, and then select the information you want to display.

    - To discard your changes, select **Reset to default**.

## View the number of licenses associated with your authorization system

1. To access licensing information about your data sources, at the top of the CloudKnox page, select **Settings** (the gear icon).

1. In the **Inventory** dashboard, select the **Licensing** tab.

1. Select the authorization system you want: AWS, Azure, or GCP.

    Each authorization system lists the total number of licenses associated with their system.


## Next steps

- For information about viewing and configuring settings for collecting data from your authorization system and its associated accounts, see [View and configure settings for data collection](cloudknox-product-data-sources.md).
- For information about adding an authorization system for data collection, see [Add an authorization system for data collection](cloudknox-product-data-add-authorization-system.md).
