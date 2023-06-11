---
title: How to add device links to remote networks for Global Secure Access (preview)
description: Learn how to add device links to remote networks for Global Secure Access (preview).
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 06/09/2023
ms.service: network-access
ms.custom: 
---

# Add device links to remote networks

You can create device links when you create a new remote network or add them after the remote network is created.

This article explains how to add and delete device links for remote networks for Global Secure Access.

## Prerequisites 

- A **Global Secure Access Administrator** role in Microsoft Entra ID

## Add a device link to a remote network

If you didn't add device links when you created the remote networks or you want to add a new device link, you can add a device link at any time.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Global Secure Access Administrator. 
1. Go to **Global Secure Access (preview)** > **Devices** > **Remote network**.

**General**

1. Enter the following details:
    - **Link name**: Name of your CPE.
    - **Device type**: Choose one of the options from the dropdown list.
    - **IP address**: Public IP address of your device.
    - **Peer BGP address**: The border gateway protocol address of the CPE.
    - **Link ASN**: Provide the autonomous system number of the CPE. For more information, see the **Valid ASNs** section of the [Remote network configurations](reference-remote-network-configurations.md) article.
    - **Redundancy**: Select either *No redundancy* or *Zone redundancy* for your IPSec tunnel.
    - **Bandwidth capacity (Mbps)**: Choose the bandwidth for your IPSec tunnel.
1. Select the **Next** button.

![Screenshot of the general tab of the create device link process.](media/how-to-manage-remote-network-device-links/device-link-general-tab.png)

**Details**

1. **IKEv2** is selected by default. At this time only IKEv2 is supported.
1. The IPSec/IKE policy is set to **Default** but you can change to **Custom**.
    - If you select **Custom** you must use a combination of settings that are supported by Global Secure Access.
    - The valid configurations you can use are mapped out in the [Remote network valid configurations](reference-remote-network-configurations.md) reference article.
    - Whether you choose Default or Custom, the IPSec/IKE policy you specify must match the policy on your CPE.
    - View the [remote network valid configurations](reference-remote-network-configurations.md).

1. Select the **Next** button.

![Screenshot of the custom details for the device link.](media/how-to-manage-remote-network-device-links/device-link-details.png)

**Security**

1. Enter the Pre-shared key (PSK): `<Enter the secret key. The same secret key must be used on your CPE.>` 
1. Select **Add link**. 

## Delete device links

If your remote network has device links added, they appear in the **Links** column on the list of remote networks. Select the link from the column to navigate directly to the device link details page.

To delete a device link, navigate to the device link details page and select the **Delete** icon. A confirmation dialog appears. Select **Delete** to confirm the deletion.

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps
- [List remote networks](how-to-list-remote-networks.md)
