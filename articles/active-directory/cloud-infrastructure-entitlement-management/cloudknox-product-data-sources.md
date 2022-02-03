---
title: View and configure settings for data collection from your authorization system in CloudKnox Permissions Management
description: How to view and configure settings for collecting data from your authorization system in CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# View and configure settings for data collection 

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.


You can use the **Data collectors** dashboard in CloudKnox Permissions Management (CloudKnox) to view and configure settings for collecting data from your authorization system and its associated accounts. It also provides information about data types, including entitlements and benchmarks.

## Access and view data sources

1. To access your data sources, at the top of the CloudKnox page, select **Settings** (the gear icon). Then select the **Data collectors** tab.

1. On the **Data collectors** dashboard, select your authorization system: 

    - **AWS** for Amazon Web Services.
    - **Azure** for Microsoft Azure.
    - **GCP** for Google Cloud Platform.

1. To display specific information about an account:

    1. Enter the following information:

        - **Uploaded on**: Select **All** accounts, **Online** accounts, or **Offline** accounts.
        - **Transformed on**: Select **All** accounts, **Online** accounts, or **Offline** accounts.
        - **Search**: Enter an ID or IP address to find a specific account.

    1. Select **Apply** to display the results.

        Select **Reset Filter** to discard your changes.

1. The following information displays:

    - The name of your authorization system.
    - **ID**: The unique identification number for the account.
    - **Data types**: Displays the two data types that are collected:
         - **Entitlements**: The permissions of all identities and resources for all the configured authentication systems.
         - **Benchmarks**: The results of security best practices tests.
    - **Recently uploaded on**: Displays whether the entitlement and benchmark data are being collected. 

        The status displays *ONLINE* if the data collection has no errors and *OFFLINE* if there are errors.
    - **Recently transformed on**: Displays whether the entitlement and benchmark data are being processed.

        The status displays *ONLINE* if the data processing has no errors and *OFFLINE* if there are errors. - **IP address**: Displays the specific internet protocol (IP) address or domain name system (DNS) name for the account.
    - The **Tenant ID** and **Tenant name**

## Configure data collection settings

1. Select the ellipses **(...)** at the end of the row in the table.
1. To configure CloudKnox to collect data, select **Configure**.
     
     The **Sentry appliance configuration** box displays.

1. To configure data collection settings, select the displayed URL.
1. To link the appliance to CloudKnox, use the displayed **REGISTERED EMAIL** address and **PIN** combination.
1. Return to the **Sentry appliance configuration** box and select **Close**.

## Start collecting data from an authorization system   

1. Select the ellipses **(...)** at the end of the row in the table.
1. Select **Collect Data**.

    A message displays to confirm data collection has started. 

## Modify information about your authorization system   

1. Select the ellipses **(...)** at the end of the row in the table.
1. To change the information displayed, select **Edit**. 

    The **Onboarding - Summary** box displays.

1. Select **Edit** for each field you want to change. 
1. Select **Verify now & save**.

    To verify your changes later, select **Save & verify later**.

    When your changes are saved, the following message displays: **Successfully updated configuration.**

## Stop collecting data from an authorization system   

1. Select the ellipses **(...)** at the end of the row in the table.
1. To delete your authorization system, select **Delete configuration**. 

    The **Onboarding - Summary** box displays.

1. Select **Delete**. 

## Next steps

- For information about adding an authorization system for data collection, see [Add an authorization system for data collection](cloudknox-product-data-add-authorization-system.md)
- For information about viewing an inventory of created resources and licensing information for your authorization system, see [Display an inventory of  created resources and licenses for your authorization system](cloudknox-product-data-inventory.md)