---
title: How to delete a device link or branch office location
description: Learn how to delete a device link or branch office location for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 04/13/2023
ms.service: network-access
ms.custom: 
---


# Learn how to delete a device link or branch office location for Global Secure Access

Learn how to configure a branch office location for Global Secure Access.

## Pre-requisites 
- Global Secure Access license for your Microsoft Entra Identity tenant.  
- Entra Network Access Administrator role in Microsoft Entra Identity.
- Microsoft Graph module when using PowerShell.
- Admin consent when using Graph explorer for Microsoft Graph API. 

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

