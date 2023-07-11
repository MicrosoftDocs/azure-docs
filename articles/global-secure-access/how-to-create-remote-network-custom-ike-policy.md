---
title: How to create a remote network with a customer IKE policy for Global Secure Access (preview)
description: Learn how to create a remote network with a customer IKE policy for Global Secure Access (preview).
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 06/08/2023
ms.service: network-access
ms.custom: 

---
# Create a remote network with a customer IKE policy for Global Secure Access (preview)

IPSec tunnel is a bidirectional communication. This article provides the steps to set up the policy side the communication channel using the Microsoft Graph API. The other side of the communication is configured on your customer premises equipment. 

For more information about creating a remote network and the custom IKE policy, see [Create a remote network](how-to-create-remote-networks.md#create-a-remote-network-with-the-microsoft-entra-admin-center) and [Remote network configurations](reference-remote-network-configurations.md).


## Prerequisites

To create a remote network with a custom IKE policy, you must have:

- A **Global Secure Access Administrator** role in Microsoft Entra ID.
- Sent an email to Global Secure Access onboarding team according to the [onboarding process](how-to-create-remote-networks.md#onboard-your-tenant-for-remote-networks).
- Received the connectivity information from Global Secure Access onboarding.
- The preview requires a Microsoft Entra ID Premium P1 license. If needed, you can [purchase licenses or get trial licenses](https://aka.ms/azureadlicense).

## How to use Microsoft Graph to create a remote network with a custom IKE policy

Remote networks with a custom IKE policy can be created using Microsoft Graph on the `/beta` endpoint.

To get started, follow these instructions to work with remote networks using the Microsoft Graph API in Graph Explorer. 

1. Sign in to [Graph Explorer](https://aka.ms/ge).
1. Select **POST** as the HTTP method from the dropdown.
1. Set the API version to **beta**.
1. Add the following query, then select the **Run query** button.

```http
    POST https://graph.microsoft.com/beta/networkaccess/connectivity/branches
{
    "name": "BranchOffice_CustomIKE",
    "region": "eastUS", 
    "deviceLinks": [
        {
            "name": "custom link",
            "ipAddress": "114.20.4.14",
            "deviceVendor": "ciscoMeraki",
            "tunnelConfiguration": {
                "saLifeTimeSeconds": 300,
                "ipSecEncryption": "gcmAes128",
                "ipSecIntegrity": "gcmAes128",
                "ikeEncryption": "aes128",
                "ikeIntegrity": "sha256",
                "dhGroup": "ecp384",
                "pfsGroup": "ecp384",
                "@odata.type": "#microsoft.graph.networkaccess.tunnelConfigurationIKEv2Custom",
                "preSharedKey": "SHAREDKEY"
            },
            "bgpConfiguration": {
                "localIpAddress": "10.1.1.11",
                "peerIpAddress": "10.6.6.6",
                "asn": 65000
            },
            "redundancyConfiguration": {
                "redundancyTier": "zoneRedundancy",
                "zoneLocalIpAddress": "10.1.1.12"
            },
            "bandwidthCapacityInMbps": "mbps250"
        }
    ]
}
```

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

- [How to manage remote networks](how-to-manage-remote-networks.md)
- [How to manage remote network device links](how-to-manage-remote-network-device-links.md)
