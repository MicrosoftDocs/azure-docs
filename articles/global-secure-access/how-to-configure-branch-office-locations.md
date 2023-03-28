---
title: How to configure branch office locations
description: Learn how to configure branch office locations for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 03/16/2023
ms.service: network-access
ms.custom: 
---


<!-- 1. H1
Required. Set expectations for what the content covers, so customers know the 
content meets their needs. H1 format is # What is <product/service>?
-->

# Learn how to configure branch office locations for Global Secure Access

Learn how to configure a branch office location for Global Secure Access.

Global Secure Access includes Microsoft Entra Private Access and Microsoft Entra Internet Access. The table outlines which product is required for each feature in this article. To learn more about Microsoft Entra Private Access, see [What is Microsoft Entra Private Access?](overview-what-is-private-access.md). To learn more about Microsoft Entra Internet Access, see [What is Microsoft Entra Internet Access?](overview-what-is-internet-access.md).

| Feature   | Microsoft Entra Private Access | Microsoft Entra Internet Access |
|----------|-----------|------------|
| Feature A | X |   |
| Feature B |   | X |
| Feature C | X | X |
| Feature D | X |   |

## Create a branch location to connect to NaaS VPN service
Global Secure Access provides branch connectivity so you can connect a branch office to the Microsoft network. Once a branch is connected to the Microsoft network you can set up network security policies. These policies are applied on all outbound traffic. Alternatively, you can set up clients on individual devices to connect to the Microsoft network regardless of the device location and Internet connection. To learn more about the client for Global Secure Access, see [How to configure devices for Global Secure Access](how-to-configure-devices.md).

There are multiple ways to connect a branch location to the Microsoft network. In a nutshell, you are creating an IPSec tunnel between a core router at your branch location and the nearest Microsoft VPN service. The network traffic is routed by the core router at the branch location and thus a client is not required to be installed on individual devices.

### Create a branch location using the Entra portal

1. Navigate to the Microsoft Entra portal at `https://entra.microsoft.com` and login with administrator credentials.
1. In the left hand navigation choose **Global Secure Access*.
1. Select **Add branch location**.
1. Select **Add a link**.
1. Enter the following details: 
* Link name: `CPE Link 1` 
* Device type: `Other`
* IP address: `20.125.118.219` 
* Link BGP address: `172.16.11.5` 
* Link ASN: `65530`
1. Click **Next**. 
1. Select **IKEv2** for protocol.
1. Select **Default** for IPSec/IKI policy. 
> [!NOTE]
> For custom policies, use the values:
> * IKE Phase 1 -> Encryption: `AES128`
> * IKE Phase 1 -> IKEv2 integrity: `SHA256`
> * IKE Phase 1 -> DH group: `DHGroup14`
> * IKE Phase 2 -> IPSec encryption: `GCMAES128`
> * IKE Phase 2 -> IPSec integrity: `GCMAES128`
> * IKE Phase 2 -> PFS group: `PFS1`
> * IKE Phase 2 -> SA lifetime (seconds): `2700`
1. Click **Next**. 
1. Enter Pre-shared key (PSK): `key-value`
1. Click **Save**.
1. Click **Next: Forwarding Profiles** and select **M365 traffic profile All M365 traffic**.
1. Select **Review + add**.
1. Select **Add branch office**. 

### Create a branch location using the API

Enter the basic details of your branch and call this API. 

```
POST https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/branches 
{ 
    "name": "EnterYourDesiredBranchName", 
    "country": "United States", 
    "region": "East US", 
    "bandwidthCapacity": 1000 
}
```

You can create a branch location with device link using the same API.

```
POST https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/branches 
{ 
    "name": " EnterYourDesiredBranchName ", 
    "country": "United States ", 
    "region": "East US", 
    "bandwidthCapacity": 1000 
    "deviceLinks": [ 
       { 
          "name": "CPE2", 
          "ipAddress": "20.125.118.219", 
          "version": "1.0.0", 
          "deviceVendor": "checkPoint", 
          "bgpConfiguration": { 
               "ipAddress": "172.16.11.5", 
               "asn": 65530 
          }, 
          "tunnelConfiguration": { 
                "@odata.type": "#microsoft.graph.networkaccess.tunnelConfigurationIKEv2Default", 
                   "preSharedKey": "key-value" 
          } 
       } 
    ] 
}  
```

To get the config details of all branches in the tenant:

```
GET https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/branches 
```

To get the config details of a specific branch:

```
GET https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/branches/72647a2c-d264-4469-a0fb-ab8d99b33bd2  
```

## Create a device link at a branch location with IKEv2 and default IPsec policy
<!-- add your content here -->

## Create a device link at a branch location with IKEv2 and custom IPSec policy
<!-- add your content here -->

## Assign a Microsoft 365 traffic profile to a branch location
<!-- add your content here -->

## Edit top-level branch settings

## Test branch connectivity to a NaaS VPN service

## (optional) Test branch connectivity with Tenant Restrictions v2 (TRv2)

## Delete a device link from a branch location

## Delete a branch

## Known issues

## Next steps
<!-- Add a context sentence for the following links -->
- [Create applications](how-to-create-applications.md)

