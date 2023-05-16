---
title: How to test branch connectivity
description: Learn how to test branch connectivity for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 04/14/2023
ms.service: network-access
ms.custom: 
---

# Learn how to test branch connectivity for Global Secure Access

Learn how to test branch connectivity for Global Secure Access.

## Pre-requisites 
- Global Secure Access license for your Microsoft Entra Identity tenant.  
- Entra Network Access Administrator role in Microsoft Entra Identity.
- Microsoft Graph module when using PowerShell.
- Admin consent when using Graph explorer for Microsoft Graph API. 

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


