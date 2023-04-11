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
1. In the left hand navigation choose **Global Secure Access**.
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
    "deviceLinks": [ { 
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

## Assign a Microsoft 365 traffic profile to a branch location

### Assign a traffic profile to a branch location using the Entra portal
1. Navigate to the Microsoft Entra portal at `https://entra.microsoft.com` and login with administrator credentials.
1. In the left hand navigation choose **Global Secure Access*.
1. Select **Traffic profile**. 
1. Select **Add/edit assignments** under M365 traffic profile. 
1. Select **Add assignments**.
1. Select desired branch location
1. Select **Add**. 

### Assign a traffic profile to a branch location using the API
Traffic profiles (aka forwarding profiles) determine what traffic will be routed to the Microsoft network. Associating a traffic profile to your branch location is 2-step process. First, get the ID of the traffic profile. This is important as this ID is different for all tenants. Second, associate this traffic profile with your desired branch location.

To get all traffic profiles in your tenant:

```
GET https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/forwardingProfiles 
```

To associate a profile with a branch location:
 
```
PATCH https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/branches/8d04ae1d-952c-4dd9-9e27-e5c42a92620e/forwardingProfiles 
{ 
    "@odata.context": "#$delta", 
    "value": [ 
    { 
      "id": "a8046459-4cfe-4dbe-ae89-650876b6ea28" 
    } 
  ] 
} 
```

## Edit top-level branch settings

### Edit a top-level branch setting using the Entra portal
Not yet available in the UI.

### Edit a top-level branch setting using the API
You can change the name of your branch location by doing this - 

```
PATCH https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/branches/8d04ae1d-952c-4dd9-9e27-e5c42a92620e  
{ 
    "@odata.context": "#$delta", 
      "name": "modified name of the branch location" 
} 
```


## Test branch connectivity to Global Secure Access
We will be using a VM that is running on a VNet that routes traffic to the Global Secure Access service over the established VPN tunnel.

Follow these steps to get the VPN Client installed so you can access the VMs. 

Connect to one of the VPNs. 

Log into the VM via Remote Desktop Connection. 

Use a VM labeled as “ZTNA branch testing” as its purpose (a VM that has “BR” in the name) 

Once logged in, open the browser. 

Navigate to www.google.com, which is a website not tunneled through the NaaS VPN service. 

Search for “what is my IP address” and observe your IP address, which should not be a NaaS edge IP, for example 20.38.175.9. 

Navigate to www.google.co.uk, which is a website tunneled through the NaaS VPN service. 

Search for “what is my IP address” and observe your IP address. It should be different than the previous one. It should align with one of the egress Global Secure Access edge IPs, for example 147.243.143.240.  

Verify this IP is in the Global Secure Access edge IP list:

So, what just happened above? 

On a VM, we have updated host file at windows/system32/drivers/etc/hosts and added a static DNS entry for www.google.co.uk. 

On our CPE device (simulated by local network gateway in our config), we have added a static IP address entry for 142.250.72.163(i.e. www.google.co.uk). This ensures that all traffic to this URL is captured by NaaS VPN service. In other words, we created a traffic profile to capture all traffic to this IP address and route it via NaaS (similar to M365 traffic profile). 

## (optional) Test branch connectivity with Tenant Restrictions v2 (TRv2)

## Delete a device link from a branch location

### Delete a device link from a branch location using the Entra portal
Not yet available in UI.

### Delete a device link from a branch location using the API
First, get the ID of the branch location and device link that you want to delete.

Get details of all branches in the tenant:

```
GET https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/branches 
```

Delete a device link from a branch location using the ID:

```
DELETE https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/branches/2505aa87-57d8-41c2-8ac1-7b195f8109ef/devicelinks/a7339c75-30e3-4142-b76c-c48c61ead39b     
```

## Delete a branch

### Delete a branch using the Entra portal
Not yet available in the UI.

### Delete a branch using the API
Delete your branch location:
```
DELETE https://canary.graph.microsoft.com/testprodbetaZTNA-UI-integration/networkaccess/branches/8d04ae1d-952c-4dd9-9e27-e5c42a92620e 
```

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

