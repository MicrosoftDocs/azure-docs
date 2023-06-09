---
title: How to manage device links for remote networks for Global Secure Access (preview)
description: Learn how to create, edit, and delete device links for remote networks for Global Secure Access (preview).
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 06/01/2023
ms.service: network-access
ms.custom: 
---

# Manage device links on remote networks

Device links are the customer premises equipment (CPE) used in your remote networks. End users and guests connect to Global Secure Access (preview) through the device links. You can create device links when you create a new remote network or manage the device links after the office is created.

This article explains how to add, edit, and delete device links for remote networks for Global Secure Access.

## Prerequisites 

- A **Global Secure Access Administrator** role in Microsoft Entra ID

## Add a device link to a remote network

If you didn't add device links when you created the remote networks or you want to add a new device link, you can add a device link at any time.

<!--- need correct role and need to update the steps to match "how-to-manage-remote-networks" article --->

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Global Secure Access Administrator. 
1. Go to **Global Secure Access (preview)** > **Devices** > **Remote networks**.
1. Select the remote network you need to add the device link to.
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

If your remote network has device links added, they appear in the **Links** column on the list of remote networks. Select the link from the column to navigate directly to the device link details page.

<!--- not sure how to actually edit - there's no edit button --->

To delete a device link, navigate to the device link details page and select the **Delete** icon. A confirmation dialog appears. Select **Delete** to confirm the deletion.

## Link ASN

The link ASN is the autonomous system number of the CPE. The ASN is a unique number that identifies a network on the internet. The ASN is used to exchange routing information between the CPE and the Microsoft network. The ASN must be a 32-bit integer between 1 and 4294967295. The ASN must be unique for each device link.

The following ASNs are reserved by Azure and can't be used for your on-premises VPN devices when connecting to Azure VPN gateways:
- 8075
- 8076
- 12076 (public)
- 65517
- 65518
- 65519
- 65520 (private)

<!--- need to understand what this means - pulled it from the tooltip --->

While setting up IPsec connectivity from virtual network gateways to Azure virtual WAN VPN, the ASN for Local Network Gateway is required to be 65515.

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps
- [List remote networks](how-to-list-remote-networks.md)
