---
title: How to assign a traffic profile to a branch location
description: Learn how to assign a traffic profile to a branch office location for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 04/13/2023
ms.service: network-access
ms.custom: 
---

# Learn how to assign a traffic profile to a branch office location for Global Secure Access.

Learn how to assign a traffic profile to a branch office location for Global Secure Access.

## Pre-requisites 
- Global Secure Access license for your Microsoft Entra Identity tenant.  
- Entra Network Access Administrator role in Microsoft Entra Identity.
- Microsoft Graph module when using PowerShell.
- Admin consent when using Graph explorer for Microsoft Graph API. 

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

