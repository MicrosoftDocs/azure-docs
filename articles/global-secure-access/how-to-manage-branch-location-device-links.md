---
title: How to manage device links for branch locations
description: Learn how to create, edit, and delete device links for branch locations for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 05/24/2023
ms.service: network-access
ms.custom: 
---

# Manage device links on branch locations

Device links are the customer premises equipment (CPE) used in your branch office locations. End users and guests connect to Global Secure Access through the device links. You can create device links when you create a new branch office or manage the device links after the office is created.

This article explains how to add, edit, and delete device links for a branch office location for Global Secure Access.

## Prerequisites 
- **Microsoft Entra Internet Access Premium license** for your Microsoft Entra Identity tenant
- **Microsoft Entra Network Access Administrator** role in Microsoft Entra ID
- The **Microsoft Graph** module must be installed to use PowerShell
- Administrator consent is required when using Microsoft Graph Explorer for the Microsoft Graph API

## Add a device link to a branch location

If you didn't add device links when you created the branch location or you want to add a new device link, you can add a device link at any time.

<!--- need correct role and need to update the steps to match "how-to-manage-branch-locations" article --->

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Global Secure Access Administrator. 
1. Go to **Global Secure Access (preview)** > **Devices** > **Branches**.
1. Select the branch location you need to add the device link to.
1. Select **Links** from the menu.
1. Select **Add a link**.
1. Under the **General** tab, enter the following details: 
    - **Link name**: Name of your CPE.
    - **Device type**: Choose one of the options from the dropdown list.
    - **IP address**: Public IP address of your device.
    - **Link BGP address**: The border gateway protocol address of the CPE.
    - **Link ASN**: Provide the autonomous system number of the CPE. For more information on the requirements for this detail, see the [Link ASN](#link-asn) section of this article.
1. Select the **Next** button.
1. Under the **Details** tab, enter the following details: 
    - Protocol: `IKEv2` 
    - IPSec/IKE policy: `Default` 

    Alternatively, you can select **IPSec/IKE** policy = `Custom`. In this case, enter the details:
    - IKE Phase 1 
    - Encryption: `GCMAES128` 
    - IKEv2 integrity: `GCMAES128` 
    - DH Group: `14` 
    - IKE Phase 2 
    - IPSec encryption: `GCMAES128` 
    - IPSec integrity: `GCMAES128` 
    - PFS group: `PFS1` 
    - SA lifetime (seconds): `300` 
1. Select the **Next** button.
1. Under the **Security** tab, enter the following details: 
    - Pre shared key (PSK): `<Enter the secret key. The same secret key must be used on your CPE.>` 
1. Select **Add link**. 

## Manage device links

If your branch location has device links added, they appear in the **Links** column on the list of branches. Select the link from the column to navigate directly to the device link details page.

<!--- not sure how to actually edit - there's no edit button --->

To delete a device link, navigate to the device link details page and select the **Delete** icon. A confirmation dialog appears. Select **Delete** to confirm the deletion.

### Delete a device link from a branch location using the API



## Next steps
- [List office branch locations](how-to-list-branch-locations.md)
