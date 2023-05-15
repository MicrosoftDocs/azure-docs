---
title: Enable compliant network check with Conditional Access
description: Require known compliant network locations with Conditional Access.

ms.service: network-access
ms.subservice: 
ms.topic: 
ms.date: 05/03/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Enable compliant network check with Conditional Access

Leveraging Azure AD Conditional Access (CA) checks, customers can prevent malicious access to Microsoft apps, third-party SaaS apps, and private line-of-business (LoB) apps by using defense-in-depth provisions like device and/or location conditions. These conditions provide effective protection against user identity theft or token theft. Microsoft Network-as-a-Service (NaaS) introduces the new ‘Compliant Network’ check within CA and Continuous Access Evaluation (CAE) – ensuring that the user connects from a verified network connectivity model for the specific enterprise tenant as well as is compliant with all the network security policies enforced by the admins.  

Furthermore, in today’s world of remote users, in place of tracking multiple IP locations and IP ranges for physical offices, the admin can use the compliant network location as a gating condition to secure access to corporate resources. In essence, this Compliant Network capability makes it infinitely easier for an Admin to manage and maintain, without going through the cumbersome process of compiling a list of all the enterprise location IPs. The NaaS compliant network check also works seamlessly for remote users (and not just branch offices), without the need to hairpin traffic through corporate VPN egress points, thereby enabling dual advantage of best performance with best security! 

Administrators today struggle to track IP network locations with the concept of remote first users. Using the Global Secure Access client installed on devices or configured branch office locations allows administrators to gate resource behind a compliant network with advanced Conditional Access controls. 

This compliant network check is specific to each tenant. 

- Using this check you can ensure that other organizations using Microsoft's Global Secure Access services can't access your resources. 
   - For example: Contoso can protect their services like Exchange Online and SharePoint Online behind their compliant network check to ensure only Contoso users can access these resources. 
   - If another organization like Fabrikam was using a compliant network check they would not pass Contoso's compliant network check. 

Further this compliant network check removes the need to hairpin traffic through a VPN, providing your users with better performance and security. This compliant network is different than [IPv4, IPv6, or country locations](/azure/active-directory/conditional-access/location-condition) you may configure in Azure AD. No upkeep is required by administrators.

## Prerequisites

* A working Azure AD tenant with the appropriate [Global Secure Access license](NEED-LINK-TO-DOC). If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing. To follow the [Zero Trust principle of least privilege](/security/zero-trust/), consider using [Privileged Identity Management (PIM)](/azure/active-directory/privileged-identity-management/pim-configure) to activate just-in-time privileged role assignments.
   * [Global Secure Access Administrator role](/azure/active-directory/privileged-identity-management/how-to-manage-admin-access#global-secure-access-administrator-role)
   * [Conditional Access Administrator](/azure/active-directory/roles/permissions-reference#conditional-access-administrator) or [Security Administrator](/azure/active-directory/roles/permissions-reference#security-administrator) to create and interact with Conditional Access policies and named locations.
* A Windows client machine with the [Global Secure Access client installed](how-to-install-windows-client.md) and running or a [branch office configured](NEED-LINK-TO-DOC).
* You must be routing your end-user Microsoft 365 network traffic through the **Global Secure Access preview** using the steps in [Learn how to configure traffic forwarding for Global Secure Access](how-to-configure-traffic-forwarding.md).

### Known limitations

The preview does not support IPv6 traffic. IPv6 must be turned off for this preview.

Some Outlook traffic may use the QUIC protocol. Global Secure Access doesn’t yet support the QUIC protocol.

### Enable Global Secure Access signaling for Conditional Access

To enable the required setting to allow the compliant network check an administrator must take the following steps.

1. Sign in to the **Azure portal** as a Global Secure Access Administrator.
1. Browse to **NEED THE ACTUAL PATH** > **Security **> **Adaptive Access**.
1. Select the toggle to **Enable Global Secure Access signaling in Conditional Access**.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access** > **Named locations**.
   1. Confirm you have a location **All Network Access locations of my tenant** with location type **Network Access**. Organizations can optionally mark this location as trusted.

> [!CAUTION]
> If your organization has active Conditional Access policies based on compliant network check, and you disable Global Secure Access signaling in Conditional Access, you may unintentionally block targeted end-users from being able to access the resources. If you must disable this feature, first delete any corresponding Conditional Access policies. 

## PLACEHOLDER FOR CAE ENFORCEMENT EXCHANGE SHAREPOINT AND GRAPH

## Protect Exchange and SharePoint Online behind the compliant network

The follwoing example shows a Conditional Access policy that requires Exchange Online and SharePoint Online to be accessed from behind a compliant network.

1. Sign in to the **Azure portal** as a Conditional Access Administrator or Security Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Cloud apps or actions** > **Include**, and select **Select apps**.
   1. Choose **Office 365 Exchange Online** and **Office 365 SharePoint Online**.
1. Under **Conditions** > **Location**.
   1. Set **Configure** to **Yes**
   1. Under **Include**, select **Any location**.
   1. Under **Exclude**, select **Selected locations**
      1. Select the **All Network Access locations of my tenant** location.
   1. Click **Select**.
1. Under **Access controls**: 
   1. **Grant**, select **Block Access**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the policy settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

## Try your compliant network policy

1. On an end-user device with the [NaaS client installed and running](how-to-install-windows-client.md)
1. Browse to [https://outlook.office.com/mail/](https://outlook.office.com/mail/) or [http://yourcompanyname.sharepoint.com/](http://yourcompanyname.sharepoint.com/), this should allow you access to resources.
1. Pause the NaaS client by right-clicking the application in the Windows tray and selecting **Pause**.
1. Browse to [https://outlook.office.com/mail/](https://outlook.office.com/mail/) or [http://yourcompanyname.sharepoint.com/](http://yourcompanyname.sharepoint.com/), this should block access to resources and you should see an error message that says **You cannot access this right now**.

ADD A SCREENSHOT WITH THE BLOCK ERROR MESSAGE

## Troubleshooting

Verify the new named location was automatically created using [Microsoft Graph](https://developer.microsoft.com/graph/graph-explorer). 

GET https://graph.microsoft.com/beta/identity/conditionalAccess/namedLocations 

SCREENSHOT OF GRAPH EXPLORER

## Next steps

TBD