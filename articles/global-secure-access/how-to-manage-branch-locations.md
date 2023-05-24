---
title: How to create branch office locations
description: Learn how to create branch office location for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 04/25/2023
ms.service: network-access
ms.custom: 
---

# Manage branch locations

Learn how to create a branch office location for Global Secure Access.

## Prerequisites 
- **Microsoft Entra Internet Access Premium license** for your Microsoft Entra Identity tenant
- **Microsoft Entra Network Access Administrator** role in Microsoft Entra ID
- The **Microsoft Graph** module must be installed to use PowerShell
- Administrator consent is required when using Microsoft Graph Explorer for the Microsoft Graph API

## Create a branch location
Global Secure Access provides branch connectivity so you can connect a branch office to Global Secure Access. Once a branch is connected, you can set up network security policies. These policies are applied on all outbound traffic. 

There are multiple ways to connect a branch location to Global Secure Access. In a nutshell, you're creating an Internet Protocol Security (IPSec) tunnel between a core router at your branch location and the nearest Microsoft VPN service. The network traffic is routed with the core router at the branch location so installation of a client isn't required on individual devices.

### Create a branch location using the Microsoft Entra admin center

1. Navigate to the Microsoft Entra admin center at `https://entra.microsoft.com` and login with administrator credentials.
1. In the left hand navigation, choose **Global Secure Access**.
1. Select **Connect**.
1. Select **Branch**.
1. Select the link to open a form. The form is used to onboard your Microsoft Entra Identity tenant. You can also find the form at https://aka.ms/ztnaonboard.
1. Fill out the form with the required information and then select **Submit**.
    You can't continue to the next step until your tenant has completed the onboard process. It takes up to seven days for your tenant to go through the onboard process. 
1. Select **Create branch office** and enter:
    - Name: `ContosoBranch` 
    - Region: `EastUS` 
1. Select **Add link**. 
1. Under the **General** tab, enter the details: 
    - Link name: `CPE link 1` 
    - Device type: `Other` 
    - IP address: `<public IP address of your device>` 
    - Local BGP address: `<Specify the address of the local end of a BGP session>` 
    - Peer BGP address: `<Specify the address of the peer end of a BGP session>` 
    - Link ASN: `<specify the ASN` 
    - Redundancy: `No redundancy` 
    - Per tunnel bandwidth (Mbps): `500 Mbps` 
1. Select **Next**.
1. Under the **Details** tab, enter the details: 
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
1. Select **Next**.
1. Under the **Security** tab, enter the details: 
    - Pre shared key (PSK): `<Enter the secret key. The same secret key must be used on your CPE.>` 
1. Select **Add link**. 
1. Select **Next: Forwarding profiles**.
1. Select **M365 traffic profile: All M365 traffic**. 
1. Select **Review + Create**.


### Create a branch location using the Microsoft Graph API
1. Sign in to the Graph Explorer. 
1. Select POST as the HTTP method from the dropdown. 
1. Select the API version to beta. 
1. Add the following query to use Create Branches API (add hyperlink to the Graph API) 
    ```
    POST https://graph.microsoft.com/beta/networkaccess/branches 
    { 
        "name": "ContosoBranch", 
        "country": "United States ", //must be removed 
        "region": "East US", 
        "bandwidthCapacity": 1000, //must be removed. This goes under deviceLink. 
        "deviceLinks": [ 
        { 
            "name": "CPE Link 1", 
            "ipAddress": "20.125.118.219", 
            "version": "1.0.0", 
            "deviceVendor": "Other", 
            "bgpConfiguration": { 
                "ipAddress": "172.16.11.5", 
                "asn": 8888 
              }, 
              "tunnelConfiguration": { 
                  "@odata.type": "#microsoft.graph.networkaccess.tunnelConfigurationIKEv2Default", 
                  "preSharedKey": "Detective5OutgrowDiligence" 
              } 
        }] 
    }  
    ```
1. Select **Run query** to create a branch.

## Edit top-level branch settings

### Edit a top-level branch setting using the Entra portal
1. Navigate to the Microsoft Entra admin center at [https://entra.microsoft.com](https://entra.microsoft.com) and login with administrator credentials.
1. In the left hand navigation, choose **Global Secure Access**. 
1. Select **Connect**. 
1. Select **Branch**.
1. Select a desired branch. 
1. Under the **Basics** tab, select the pencil icon to edit the name or region. 
1. Select **Save**.
1. Under the **Links** tab, select **Add a link to add new device**. Follow the steps listed to add a device link.

### Edit a top-level branch setting using the API
To update a branch using the Microsoft Graph API in Graph Explorer. 
1. Open a web browser and navigate to the Graph Explorer at https://aka.ms/ge.
1. Select **PATCH** as the HTTP method from the dropdown. 
1. Select the API version to **beta**. 
1. Enter the query:
    ```
    PATCH https://graph.microsoft.com/beta/networkaccess/branches/8d2b05c5-1e2e-4f1d-ba5a-1a678382ef16
    {
        "@odata.context": "#$delta",
        "name": "ContosoBranch2"
    }
    ``` 
1. Select **Run query** to update the branch. 

## Next steps

- [List branch locations](how-to-list-branch-locations.md)

