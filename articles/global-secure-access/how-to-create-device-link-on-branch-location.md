---
title: How to create a device link on an office branch location
description: Learn how to create a device link on an office branch location for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 04/25/2023
ms.service: network-access
ms.custom: 
---

# Learn how to create a device link on an office branch location for Global Secure Access

Learn how to create a device link on an office branch location for Global Secure Access.

## Pre-requisites 
- Microsoft Entra Internet Access premium license for your Microsoft Entra Identity tenant.  
- Entra Network Access Administrator role in Microsoft Entra Identity.
- The *Microsoft Graph* module must be installed to use PowerShell.
- Admin consent is required when using Graph explorer for the Microsoft Graph API. 

## Create a device link at a branch location with IKEv2 and default IPsec policy

### Create a device link with IKEv2 and default IPSec using the Entra portal
Not yet available in UI.

### Create a device link with IKEv2 and default IPSec using the API

For this configuration, you must know the ID of the branch location created in the previous step, along with the VPN configuration settings of your CPE device, such as IP addresses and VPN policy options.

The example creates a device link for a demo tenant. 

```
POST https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/branches/8d04ae1d-952c-4dd9-9e27-e5c42a92620e/devicelinks 
{ 
    "name": "YourDesiredDeviceLinkName1", 
    "ipAddress": "20.125.118.219", 
    "deviceVendor": "other", 
    forwardingRuleAction {
        "asn": 65530 
    }, 
    "tunnelConfiguration": { 
        "@odata.type": "microsoft.graph.networkAccess.tunnelConfigurationIKEv2Default", 
        "preSharedKey": "key-value" 
    }
} 
```

## Create a device link at a branch location with IKEv2 and custom IPSec policy

### Create a device link with IKEv2 and a custom IPSec policy using the Entra portal.
Not yet available in UI.

### Create a device link with IKEv2 and a custom IPSec policy using the API
For this configuration, you must know the ID of the branch location created in the previous step, along with the VPN configuration settings of your CPE device, such as IP addresses and VPN policy options. During dogfood, you are using the information for our simulated CPE. See Pre-requisites (only for dogfood). 


```
POST: https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/branches/8d04ae1d-952c-4dd9-9e27-e5c42a92620e/devicelinks 
{ 
    "name": " YourDesiredDeviceLinkName2", 
    "ipAddress": "20.125.113.146", 
    "deviceVendor": "checkPoint", 
    "tunnelConfiguration": { 
        "saLifeTimeSeconds": 2700, 
        "ipSecEncryption": "gcmAes128", 
        "ipSecIntegrity": "gcmAes128", 
        "ikeEncryption": "aes128", 
        "ikeIntegrity": "sha256", 
        "dhGroup": "dhGroup14", 
        "pfsGroup": "pfs1", 
        "@odata.type": "#microsoft.graph.networkaccess.tunnelConfigurationIKEv2Custom", 
        "preSharedKey": "key-value" 
    }, 
    "bgpConfiguration": { 
        "ipAddress": "172.16.11.4", 
        "asn": 65530 
    } 
}
```

> [!IMPORTANT]
> saLifeTimeSeconds must be a value greater than 300. 

## Known issues

### Custom IPsec policy will not work properly if salifetimeinseconds is lower than 300 
* Validations are not happening at the control plane, so you may get an HTTP status response 200 / OK but it doesn’t mean it will work. 
* Ensure your `salifetimeinseconds` setting is higher than 300. 
* If the tunnel is not working within 2-5 minutes, delete your branch and recreate the device link using a `Default IPsec` policy.

### API GET for forwarding profiles works at a tenant level but doesn’t work at branch level 
* This works: `GET https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/forwardingProfiles`
* This does not work: `GET https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/branches/72647a2c-d264-4469-a0fb-ab8d99b33bd2/forwardingProfiles`

## Next steps
<!-- Add a context sentence for the following links -->
- [Create applications](how-to-create-applications.md)

