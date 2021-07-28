---
title: Troubleshooting sign-ins with continuous access evaluation in Azure AD
description: Troubleshoot and respond to changes in user state faster with continuous access evaluation in Azure AD

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 07/19/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jlu

ms.collection: M365-identity-device-management
---
# Troubleshooting continuous access evaluation

Administrators can monitor and troubleshoot sign in events where continuous access evaluation (CAE) is applied in multiple ways.

## Continuous access evaluation sign-in reporting

Administrators will have the opportunity to monitor user sign-ins where CAE is applied. This pane can be located by via the following instructions:

1.	Sign in to the Azure portal as a Conditional Access Administrator, Security Administrator, or Global Administrator
1.	Browse to Azure Active Directory > Sign-ins. 
1.	Apply the Is CAE Token filter. 

From here, admins will be presented with information about their user’s sign-in events. They can click on any sign-in entry to see details about the session, like is CAE enabled and which Conditional Access policies were applied. 

A given sign-in attempt may display on either the interactive or non-interactive tab. This classification does not hold significance and admins may need to check both tabs as they track their user’s sign-ins.

### Searching for specific sign-in attempts

Browse to Azure Active Directory > Sign-ins (under monitoring)

Use filters to scope down the search. For example, if a user signed in to Teams, we can use the Application filter and set it to Teams. Admins may need to check the sign-ins from both interactive and non-interactive tabs to locate the sign-in we are interested in. In order to further narrow the search, admins may apply multiple filters.
 
The same search with a filter for is CAE Token applied. We can this filter to search for sign-ins where a CAE token is issued as well as when not issued:

## Continuous access evaluation workbooks

The continuous access evaluation (CAE) workbook allows administrators to monitor CAE usage insights for their tenants. The first table displays authentication attempts with IP mismatches. The second table displays the support status of CAE across various applications.

This documentation covers the continuous access evaluation workbook.  The continuous access evaluation workbook allows admins to view and monitor CAE token insights. This workbook can be found as template under the Conditional Access category. 

### Accessing the CAE workbook template
 
1.	Sign in to the Azure portal as a Conditional Access Administrator, Security Administrator, or Global Administrator. 
1.	Browse to Azure Active Directory > Workbooks.
1.	Under Public Templates, search for Continuous Access Evaluation Token Insights.
 
Note: Using workbooks has a prior dependency on syncing with Woodgrove. If you have not already set this up, you will see a message indicating “Log Analytics integration not enabled.” Further information can be found at the following public documentation: Stream Azure Active Directory logs to Azure Monitor logs | Microsoft Docs. 

This workbook contains two tables as described below:
 
### Table 1: Potential IP address mismatch between Azure AD and resource provider  
  
The Potential IP Address Mismatch between Azure AD & resource provider table allows admins to investigate sessions where the IP address detected by Azure Active Directory does not match with the IP address detected by the Resource Provider. 
 
An IP mismatch scenario may occur when split tunneling. Another cause of an IP mismatch can come from IP versioning, for example, the resource provider is using an IPv4 address and Azure AD is using an IPv6 address. This workbook table sheds light on these scenarios by displaying the respective IP addresses and whether a CAE token was issued during this session. 


IP address configuration
Your identity provider and resource providers may see different IP addresses. This mismatch may happen due to network proxy implementations in your organization or incorrect IPv4/IPv6 configurations between your identity provider and resource provider. For example:

- Your identity provider sees one IP address from the client.
- Your resource provider sees a different IP address from the client after passing through a proxy.
- The IP address your identity provider sees is part of an allowed IP range in policy but the IP address from the resource provider is not.

If this scenario exists in your environment to avoid infinite loops, Azure AD will issue a one hour CAE token and will not enforce client location change. Even in this case, security is improved compared to traditional one hour tokens since we are still evaluating the other events besides client location change events.


With CAE, IP based Conditional Access Policies are evaluated on the resource end and the client side. When the IP seen on the resource end is to be blocked, then the token will be rejected by the resource with claims challenge having IP address seen on the resource side. The request is redirected to AAD for a new token and AAD performs CA policy validation not only on the IP address seen by it but also IP address in the claims challenge (Resource’s IP address). Consider the IP address seen on the RP side results in “block”. If the customer has not enabled the Strict Location Enforcement, then AAD will issue short lived CAE token. On the other hand, the request is blocked when SLE is enabled.

In order to unblock the user, the admin has the ability to add specific IP addresses to an “allowlist” called Named Locations. In order to edit or add to this list, refer to the instructions below:

1.	Sign in to the Azure portal as a Conditional Access Administrator, Security Administrator, or Global Administrator. 
1.	Browse to Conditional Access > Named Locations. Here you will be able to create IP location lists and mark them as trusted.

Before adding an IP address as a trusted Named Location, confirm that the IP address does in fact belong to the intended tenant. 

Admins have the ability to view records filtered by time range and application. Admins will also be able to compare the number of mismatched IPs detected with the total number of sign-ins during a specified time period. 
 
 
### Table 2: Continuous access evaluation support status
  
The Continuous Access Evaluation Support Status table allows admins to differentiate between client applications that support CAE and those client applications that don't support CAE. This table also displays the corresponding user sign-ins for each of these client applications. 

You may notice that the same application may appear as both supported and not supported. This duplication is because of a concept called client capability. Not all clients are CAE supported and capable. For example, if a customer has some users using the latest version of Outlook and others still using Outlook 2013, that customer will see Outlook instances as supported and non supported.  The older version of Outlook is not CAE capable and will therefore not be able to perform continuous access evaluation. However, for those users within that customer that are using the most recent version of Outlook, the admin will see supported CAE status.

If most instances of an application are displaying as CAE supported, it is safe to assume that most users are on a CAE capable version of the application. However, if this Workbooks table is showing otherwise, this may be an indication of declining security within the customer’s client usage. 

Based on this analysis, admins may choose to turn on strict enforcement within a Conditional Access policy. When strict enforcement is turned on, any client that is not CAE capable will be rejected entirely. 
Admins have the ability to view records filtered by time range, application, and resource.

## Next steps