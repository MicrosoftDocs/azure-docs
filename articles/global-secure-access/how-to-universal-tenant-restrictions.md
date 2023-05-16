---
title: Global Secure Access and universal tenant restrictions
description: What are universal tenant restrictions

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 05/15/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Universal tenant restrictions

Universal tenant restrictions enhance the functionality of [tenant restriction v2](https://aka.ms/tenant-restrictions-enforcement) using Global Secure Access to tag all traffic no matter the operating system or device. It allows support for both branch locations and individual devices. Administrators no longer have to manage proxy server configurations or complex network configurations.

Universal Tenant Restrictions enforces tenant restrictions v2 for all operating system and browser platforms. It does this enforcement using Global Secure Access based policy signaling for both the authentication and data plane endpoints. Tenant restrictions v2 enables enterprises to prevent data exfiltration by malicious users using external tenant identities for Azure AD integrated applications like SharePoint Online and Exchange Online. TRv2 and NaaS work hand in hand to prevent data exfiltration universally across all devices and networks.  

:::image type="content" source="media/how-to-universal-tenant-restrictions/tenant-restrictions-v-2-universal-tenant-restrictions-flow.png" alt-text="Diagram showing how tenant restrictions v2 protects against malicious users." lightbox="media/how-to-universal-tenant-restrictions/tenant-restrictions-v-2-universal-tenant-restrictions-flow.png":::

The following table explains the steps taken at each point in the previous diagram.

| Step | Action |
| --- | --- |
| 0 | Azure AD blocks authentication requests tagged by the Global Secure Access edge to malicious tenants with tenant restrictions version 2 policy ID based checks |
| 1 | A malicious user requests an authentication token for a malicious tenant outside corpnet purview. |
| 2 | The malicious user copies the authentication token for a malicious tenant onto a corpnet or other managed device |
| 3 | Microsoft 365 blocks data sessions from managed devices to malicious tenant with tenant restrictions version 2 policy ID based checks |
| 4 | Global Secure Access enables tenant restrictions version 2 tagging on customers behalf after terminating Azure AD and Microsoft 365 datapath traffic at the Global Secure Access edge |

<!-- Should 3 and 4 in the diagram and table be switched? -->

Universal tenant restrictions help to prevent data exfiltration across browsers, devices, and networks in the following ways:

- It injects the following attributes into the header of outbound HTTP traffic at the client level in both the authentication control and data sessions to Microsoft 365 endpoints:
    - Cloud ID of the device tenant
    - Tenant ID of the device tenant
    - Tenant restrictions v2 policy ID of the device tenant
- It enables Azure AD, Microsoft Accounts, and Microsoft 365 SaaS applications to interpret this special HTTP header enabling lookup and enforcement of the associated tenant restrictions v2 policy. This lookup enables consistent policy application. 

## Enable tagging for tenant restrictions v2

To allow Global Secure Access to apply tagging for tenant restrictions v2, an administrator must take the following steps.

1. Sign in to the **Azure portal** as a Global Secure Access Administrator.
1. Browse to **NEED THE ACTUAL PATH** > **Security** > **Tenant Restrictions**.
1. Select the toggle to **Enable tagging to enforce tenant restrictions on your network**.

:::image type="content" source="media/how-to-universal-tenant-restrictions/toggle-enable-tagging-to-enforce-tenant-restrictions.png" alt-text="Screenshot showing the toggle to enable tagging.":::

## Where can we see Universal Tenant Restrictions? 

In the ZTNA portal, for tenant-level configuration of Universal Tenant Restrictions. 

Tenant restrictions (Preview) - Tenant restriction settings - Microsoft Azure 

Full feature flag URL: 

(https://portal.azure.com/?Microsoft_Azure_Network_Access_assettypeoptions=%7B%22NetworkAccess%22%3A%7B%22options%22%3A%22ShowAssetType%22%7D%7D&microsoft_azure_compute=true&Microsoft_Azure_Network_Access_adaptiveAccess=true&feature.caNetworkAccess=true%20#view/Microsoft_AAD_IAM/TenantRestrictions.ReactView/isDefault~/true)  

For more granular options, such as allow-listing, and blocking specific tenants. 

External Identities - Microsoft Azure 

Full feature flag URL: 

(https://portal.azure.com/?Microsoft_Azure_Network_Access_assettypeoptions=%7B%22NetworkAccess%22%3A%7B%22options%22%3A%22ShowAssetType%22%7D%7D&microsoft_azure_compute=true&Microsoft_Azure_Network_Access_adaptiveAccess=true&feature.caNetworkAccess=true%20#view/Microsoft_AAD_IAM/CompanyRelationshipsMenuBlade/~/CrossTenantAccessSettings) 

## Prerequisites 

As an end-user, set up NaaS client. 

Make sure the NaaS client is running on your machine.  

Configure cross-tenant access settings/ TRv2 policy in your tenant. There's only one cross tenant access settings/ TRv2 policy per tenant so all users in this tenant will be impacted by any modifications that you make.  

Once configured, a foreign tenant by default, that is, if it’s not allow-listed, is blocked.  

External Identities - Microsoft Azure;  

Full feature flag URL: 

(https://portal.azure.com/?Microsoft_AAD_IAM_isXTAPTenantRestrictionEnabled=true#view/Microsoft_AAD_IAM/CompanyRelationshipsMenuBlade/~/CrossTenantAccessSettings) 

