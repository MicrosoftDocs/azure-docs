---
title: 
description: 

ms.service: network-access
ms.subservice: 
ms.topic: 
ms.date: 04/25/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Universal tenant restrictions

The initial implementation of tenant restrictions was important but lacked some funtionality. Tenant restrictions v1 had a heavy reliance on your corporate proxy, tenant restrictions v2 integrates with Global Secure Access through universal tenant restrictions for policy application while users are on your network (clients or branches) or devices. For more information about tenant restrictions v2, the changes, and how to configure, see the article [Set up tenant restrictions V2 (Preview)](https://aka.ms/tenant-restrictions-enforcement).

With the help of Global Secure Access, tenant restrictions v2 provides the following benefits in the form of universal tenant restrictions:

1. Coverage for tagging all traffic no matter the browser or OS on the device.
1. Support for [branch connectivity](BRANCHDOC) as well as direct from [device connectivity](DEVICESDOC).
1. No need to manage proxy configurations and native integration with [Microsoft 365 frontdoor](/microsoft-365/enterprise/microsoft-365-networking-overview).
1. Performance enhancements across both the Azure AD and Microsoft 365 datapath.

Universal tenant restrictions helps organizations to prevent data exfiltration across browsers, devices, and networks.

## Enable Global Secure Access tagging for tenant restrictions v2

To allow tagging for tenant restrictions v2 an administrator must take the following steps.

1. Sign in to the **Azure portal** as a Global Secure Access Administrator.
1. Browse to **NEED THE ACTUAL PATH** > **Security **> **Tenant Restrictions**.
1. Select the toggle to **Enable tagging to enforce tenant restrictions on your network**.

Now 

Where can we see Universal Tenant Restrictions? 

In the ZTNA portal, for tenant-level configuration of Universal Tenant Restrictions. 

Tenant restrictions (Preview) - Tenant restriction settings - Microsoft Azure 

Full feature flag URL: 

(https://portal.azure.com/?Microsoft_Azure_Network_Access_assettypeoptions=%7B%22NetworkAccess%22%3A%7B%22options%22%3A%22ShowAssetType%22%7D%7D&microsoft_azure_compute=true&Microsoft_Azure_Network_Access_adaptiveAccess=true&feature.caNetworkAccess=true%20#view/Microsoft_AAD_IAM/TenantRestrictions.ReactView/isDefault~/true)  

For more granular options, such as allow-listing, and blocking specific tenants. 

External Identities - Microsoft Azure 

Full feature flag URL: 

(https://portal.azure.com/?Microsoft_Azure_Network_Access_assettypeoptions=%7B%22NetworkAccess%22%3A%7B%22options%22%3A%22ShowAssetType%22%7D%7D&microsoft_azure_compute=true&Microsoft_Azure_Network_Access_adaptiveAccess=true&feature.caNetworkAccess=true%20#view/Microsoft_AAD_IAM/CompanyRelationshipsMenuBlade/~/CrossTenantAccessSettings) 

Pre-requisites 

As an end-user, setup NaaS client. 

Make sure the NaaS client is running on your machine.  

Configure cross-tenant access settings/ TRv2 policy in your tenant. There is only one cross tenant access settings/ TRv2 policy per tenant so all users in this tenant will be impacted by any modifications that you make.  

Once configured, a foreign tenant by default, i.e., if it’s not allow-listed, is blocked.  

External Identities - Microsoft Azure;  

Full feature flag URL: 

(https://portal.azure.com/?Microsoft_AAD_IAM_isXTAPTenantRestrictionEnabled=true#view/Microsoft_AAD_IAM/CompanyRelationshipsMenuBlade/~/CrossTenantAccessSettings) 