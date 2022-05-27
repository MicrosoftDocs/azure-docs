---
title: CloudKnox Permissions Management - Display an inventory of created resources and licenses for your authorization system
description: How to display an inventory of created resources and licenses for your authorization system in CloudKnox Permissions Management.
services: active-directory
author: kenwith
manager: rkarlin
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/23/2022
ms.author: kenwith
---

# Display an inventory of created resources and licenses for your authorization system

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

You can use the **Inventory** dashboard in CloudKnox Permissions Management (CloudKnox) to display an inventory of created resources and licensing information for your authorization system and its associated accounts.

## View resources created for your authorization system

1. To access your inventory information, in the CloudKnox home page, select **Settings** (the gear icon). 
1. Select the **Inventory** tab, select the **Inventory** subtab, and then select your authorization system type: 

    - **AWS** for Amazon Web Services.
    - **Azure** for Microsoft Azure.
    - **GCP** for Google Cloud Platform.

    The **Inventory** tab displays information pertinent to your authorization system type.

1. To change the columns displayed in the table, select **Columns**, and then select the information you want to display.

    - To discard your changes, select **Reset to default**.

## View the number of licenses associated with your authorization system

1. To access licensing information about your data sources, in the CloudKnox home page, select **Settings** (the gear icon).

1. Select the **Inventory** tab, select the **Licensing** subtab, and then select your authorization system type.

    The **Licensing** table displays the following information pertinent to your authorization system type:

    - The names of your accounts in the **Authorization system** column.
    - The number of **Compute** licenses.
    - The number of **Serverless** licenses.
    - The number of **Compute containers**.
    - The number of **Databases**.
    - The **Total number of licenses**. 


## Next steps

- For information about viewing and configuring settings for collecting data from your authorization system and its associated accounts, see [View and configure settings for data collection](cloudknox-product-data-sources.md).
