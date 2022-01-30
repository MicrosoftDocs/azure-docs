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
ms.date: 01/27/2022
ms.author: v-ydequadros
---

# Display an inventory of created resources and licenses for your authorization system

You can use the **Inventory** dashboard in Microsoft CloudKnox Permissions Management (CloudKnox) to display an inventory of created resources and licensing information for your authorization system and its associated accounts.

## View resources created for your authorization system

1. To access your inventory information, at the top of the CloudKnox page, select **Settings** (the gear icon). Then select the **Inventory** tab.
1. On the **Inventory** dashboard, select the **Inventory** subtab, and then select your authorization system: 

    - **AWS** for Amazon Web Services.
    - **Azure** for Microsoft Azure.
    - **GCP** for Google Cloud Platform.

    The **Inventory** tab displays:
    - The names of your accounts in the **Authorization system name** column.
    - The number of **Dynamodb table** entries.
    - The number of **EC2 instance** entries.
    - The number of **VPC internet gateway** entries.
    - The number of **Elasticache cluster** entries.
    - The number of **Lambda function** entries. 

1. To change the columns displayed in the table, select **||| Columns**, and then select the information you want to display.

    - To discard your changes, select **Reset to default**.

## View the number of licenses associated with your authorization system

1. To access licensing information about your data sources, at the top of the CloudKnox page, select **Settings** (the gear icon).

1. In the **Inventory** dashboard, select the **Licensing** tab.

1. On the **Inventory** dashboard, select the **Inventory** subtab, and then select your authorization system: 

    - **AWS** for Amazon Web Services.
    - **Azure** for Microsoft Azure.
    - **GCP** for Google Cloud Platform.

    The table displays the authorization system displays the following information:

    - The names of your accounts in the **Authorization system** column.
    - The number of **Compute** licenses.
    - The number of **Serverless** licenses.
    - The number of **Compute containers**.
    - The number of **Databases**.
    - The **Total number of licenses**. 


## Next steps

- For information about viewing and configuring settings for collecting data from your authorization system and its associated accounts, see [View and configure settings for data collection](cloudknox-product-data-sources.md).
- For information about adding an authorization system for data collection, see [Add an authorization system for data collection](cloudknox-product-data-add-authorization-system.md).
