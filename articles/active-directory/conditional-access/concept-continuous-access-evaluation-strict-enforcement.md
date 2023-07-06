---
title: Continuous access evaluation strict location enforcement in Azure AD
description: Responding to changes in user state faster with continuous access evaluation strict location enforcement in Azure AD

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 07/06/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: eolasunkanmi

ms.collection: M365-identity-device-management
---
# Strictly enforce location policies using continuous access evaluation (preview)

Strictly enforce location policies is a new enforcement mode for continuous access evaluation, used in Conditional Access policies. This new mode provides protection for resources, immediately stopping access if the IP address detected by the resource provider isn't allowed by Conditional Access policy. This option is the highest security modality of CAE location enforcement, and requires that administrators understand the routing of authentication and access requests in their network environment. See our [Introduction to continuous access evaluation](concept-continuous-access-evaluation.md) for a review of how CAE-capable clients and resource providers, like the Outlook email client and Exchange Online evaluate location changes.  

| Location enforcement mode | Recommended network topology | If the IP address detected by the Resource isn't in the allowed list | Benefits | Configuration |
| --- | --- | --- | --- | --- |
| Standard (Default) | Suitable for all topologies | A short-lived token is issued only if Azure AD detects an allowed IP address. Otherwise, access is blocked | Falls back to the pre-CAE location detection mode in split tunnel network deployments where CAE enforcement would affect productivity. CAE still enforces other events and policies. | None (Default Setting) |
| Strictly enforced location policies | Egress IP addresses are dedicated and enumerable for both Azure AD and all resource provider traffic | Access blocked | Most secure, but requires well understood network paths | 1. Test IP address assumptions with a small population <br><br> 2. Enable “Strictly enforce” under Session controls |

## Configure strictly enforced location policies

### Step 1 - Configure a Conditional Access location based policy for your target users

Before creating a Conditional Access policy requiring strict location enforcement, administrators must be comfortable using policies like the one described in [Conditional Access location based policies](howto-conditional-access-policy-location.md). Policies like this one should be tested with a subset of users before proceeding to the next step. By testing before enabling strict enforcement, administrators can isolate any discrepancies between the allowed set of IP addresses and the actual IP addresses seen by Azure AD during authentication.  

### Step 2 - Test policy on a small subset of users  

**SCREENSHOT TO GO HERE**

After enabling policies requiring strict location enforcement on a subset of test users, validate your testing experience using the filter **IP address (seen by resource)** in the Azure AD Sign-in logs. This validation allows administrators to find scenarios where strict location enforcement may block users with an unallowed IP seen by the CAE-enabled resource provider.

**SCREENSHOT TO GO HERE**

   - Admins must ensure all authentication traffic towards Azure AD and access traffic to Resource Providers (like Exchange Online, Teams, SharePoint Online, and MSGraph) are from an Egress IPs that are dedicated and known by the admins. 
   - Before administrators turn on Conditional Access policies requiring strict location enforcement administrators should ensure that all IP addresses from which your users can access Azure AD and resource providers are included in the [IP-based named locations policy](location-condition.md#ipv4-and-ipv6-address-ranges).

If administrators don't perform this validation, their users may be negatively impacted. If traffic to Azure AD or a CAE supported resource is through a shared or undefinable egress IP, don't enable strict location enforcement in your Conditional Access policies.

### Step 3 - Identify IP addresses that should be added to your named locations 

If the filter search of **IP address (seen by resource)** in the Azure AD Sign-in logs isn't empty, you might have a split-tunnel network configuration. To ensure your users aren't accidentally locked out by policies requiring strict location enforcement, administrators should: 

- Investigate and identify any IP addresses identified in the Sign-in logs.
- Add public IP addresses associated with known organizational egress points to their defined [named locations](location-condition.md#named-locations).

**SCREENSHOT TO GO HERE**

The following screenshot shows an example of a client’s access to a resource being blocked due to policies requiring CAE strict location enforcement being triggered revoking the client’s session. 

**SCREENSHOT TO GO HERE**

This behavior can be verified in the sign-in logs. Look for **IP address (seen by resource)** and investigate adding this IP to [named locations](location-condition.md#named-locations) if experiencing unexpected blocks from Conditional Access on users.

**SCREENSHOT TO GO HERE**

Looking at the **Conditional Access Policy details** tab provides more details of blocked sign-in events. 

**SCREENSHOT TO GO HERE**

### Step 4 - Continue deployment

Repeat steps 2 and 3 with expanding groups of users until Strictly Enforce Location Policies are applied across your target user base. Roll out carefully to avoid impacting user experience. 

## Troubleshooting with Sign-in logs

Administrators can investigate the Sign-in logs to find cases with **IP address (seen by resource)**.

1. Sign in to the **Azure portal** as at least a Global Reader.
1. Browse to **Azure Active Directory** > **Sign-ins**.
1. Find events to review by adding filters and columns to filter out unnecessary information.
   1. Add the **IP address (seen by resource)** column and filter out any blank items to narrow the scope.

**SCREENSHOT TO GO HERE**

**IP address (seen by resource)** contains filter isn't empty in the following examples: 

### Initial authentication

a.) Authentication succeeds using a CAE token. 

**SCREENSHOT TO GO HERE**

b.) The **IP address (seen by resource)** is different from the IP address seen by Azure AD. Although the IP address seen by the resource is known, there's no enforcement until the resource redirects the user for reevaluation of the IP address seen by the resource.

**SCREENSHOT TO GO HERE**

c.) Azure AD authentication is successful because strict location enforcement isn't applied at the resource level.

**SCREENSHOT TO GO HERE**
 
### Resource redirect for reevaluation

a.) Authentication fails and a CAE token isn't issued.  

**SCREENSHOT TO GO HERE**

b.) **IP address (seen by resource)** is different from the IP seen by Azure AD. 

**SCREENSHOT TO GO HERE**

c.) Authentication isn't successful because **IP address (seen by resource)** isn't a known [named location](location-condition.md#named-locations) in Conditional Access. 

**SCREENSHOT TO GO HERE**

## Next steps

- [Continuous access evaluation in Azure AD](concept-continuous-access-evaluation.md)
- [Claims challenges, claims requests, and client capabilities](../develop/claims-challenge.md)
- [How to use continuous access evaluation enabled APIs in your applications](../develop/app-resilience-continuous-access-evaluation.md)
- [Monitor and troubleshoot sign-ins with continuous access evaluation](howto-continuous-access-evaluation-troubleshoot.md#potential-ip-address-mismatch-between-azure-ad-and-resource-provider)
