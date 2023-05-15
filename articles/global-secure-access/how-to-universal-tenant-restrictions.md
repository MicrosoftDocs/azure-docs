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

Universal tenant restrictions enhances the functionality of [tenant restriction v2](https://aka.ms/tenant-restrictions-enforcement) using Global Secure Access to tag all traffic no matter the operating system or device. It allows support for both branch locations and individual devices. Administrators no longer have to manage proxy server configurations or complex network configurations.

Universal Tenant Restrictions enforces tenant restrictions v2 for all operating system and browser platforms. It does this enforcement using Global Secure Access based policy signaling for both the authentication and data plane endpoints. Tenant restrictions v2 enables enterprises to prevent data exfiltration by malicious users using external tenant identities for Azure AD integrated applications like SharePoint Online and Exchange Online. TRv2 and NaaS work hand in hand to prevent data exfiltration universally across all devices and networks.  

INSERT DIAGRAM HERE SHOWING TRV2 SCENARIO

In the example depicted in the diagram 


Universal tenant restrictions help to prevent data exfiltration across browsers, devices, and networks in the following ways:

- It injects the following attributes into the header of outbound HTTP traffic at the client level in both the authentication control and data sessions to Microsoft 365 endpoints:
    - Cloud ID of the device tenant
    - Tenant ID of the device tenant
    - Tenant restrictions v2 policy ID of the device tenant
- It enables Azure AD, Microsoft Accounts, and Microsoft 365 SaaS applications to interpret this special HTTP header enabling lookup and enforcement of the associated tenant restrictions v2 policy. This lookup enables consistent policy application. 

## Enable tagging for tenant restrictions v2

To allow Global Secure Access to apply tagging for tenant restrictions v2, an administrator must take the following steps.

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

Prerequisites 

As an end-user, setup NaaS client. 

Make sure the NaaS client is running on your machine.  

Configure cross-tenant access settings/ TRv2 policy in your tenant. There is only one cross tenant access settings/ TRv2 policy per tenant so all users in this tenant will be impacted by any modifications that you make.  

Once configured, a foreign tenant by default, i.e., if it’s not allow-listed, is blocked.  

External Identities - Microsoft Azure;  

Full feature flag URL: 

(https://portal.azure.com/?Microsoft_AAD_IAM_isXTAPTenantRestrictionEnabled=true#view/Microsoft_AAD_IAM/CompanyRelationshipsMenuBlade/~/CrossTenantAccessSettings) 

## Next steps