---
title: Microsoft CloudKnox Permissions Management - View and configure settings for data collection from your authorization system
description: How to view and configure settings for collecting data from your authorization system in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/25/2022
ms.author: v-ydequadros
---

# View and configure settings for data collection 

You can use the **Data collectors** dashboard in Microsoft CloudKnox Permissions Management (CloudKnox) to view and configure settings for collecting data from your authorization system and its associated accounts. It also provides information about data types, including entitlements and benchmarks.

## Access and view data sources

1. To access your data sources, at the top of the CloudKnox page, select **Settings** (the gear icon).

2. On the **Data collectors** dashboard, each authorization system is listed with the following details.

     - **ID** - Displays the data collector identification number. It is a unique number that identifies a specific data collector.
     - **IP Address** - Displays the specific Internet Protocol (IP) address or Domain Name System (DNS) name for the data collector.
     - **Data Types** - There are two data types that are collected:
         - **Entitlements -** The permissions of all identities and resources for all the configured authentication systems.
         - **Benchmarks -** The results of security best practices tests.
     - **Recently Uploaded On** - Displays whether the entitlement and benchmark data are being collected. 

     The status displays *ONLINE* if the data collection has no errors and *OFFLINE* if there are errors.
     - **Recently Transformed On** - Displays whether the entitlement and benchmark data are being processed.

      The status displays *ONLINE* if the data processing has no errors and *OFFLINE* if there are errors.

## Configure settings to collect data

1. Select the ellipses **(...)** at the end of the row.
1. To configure CloudKnox to collect data, select **Configure**.
     
     The **Sentry appliance configuration** box displays.

1. To configure data collection settings, select the displayed URL.
1. To link the appliance to CloudKnox, use the displayed **REGISTERED EMAIL** address and **PIN** combination.
1. Return to the **Sentry appliance configuration** box and select **Close**.

## Stop collecting data from an authorization system   

1. Select the ellipses **(...)** at the end of the row.
1. To delete your authorization system, select **Delete**. 

    The **Delete Data collector** box displays.

1. Select **OK**. 


## Deploy a a data source

1. Select **Deploy**.

    The **Sentry appliance deployment** box displays.

1. For instructions on how to deploy a data source, select the link in the **Follow the instructions here to deploy** message.

4. Select **Next**.
5. In the **Enter Appliance DNS Name or IP** box, enter a name or IP address.
6. Select **Next**.
7. For information on how to link the appliance, select the URL.
8. Select **Configure Appliance**.


## Next steps

- For information about adding an authorization systems for data collection, see [Add an authorization systems for data collection](cloudknox-product-data-add-authorization-system.md)
- For information about viewing an inventory of created resources and licensing information for your authorization systems, see [Display inventory about created resources and licensing information for your authorization systems](cloudknox-product-data-inventory.md)