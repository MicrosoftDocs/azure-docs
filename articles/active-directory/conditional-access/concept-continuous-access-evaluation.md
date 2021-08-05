---
title: Continuous access evaluation in Azure AD
description: Responding to changes in user state faster with continuous access evaluation in Azure AD

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 08/05/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jlu

ms.collection: M365-identity-device-management
---
# Continuous access evaluation

Token expiration and refresh are a standard mechanism in the industry. When a client application like Outlook connects to a service like Exchange Online, the API requests are authorized using OAuth 2.0 access tokens. By default, access tokens are valid for one hour, when they expire the client is redirected to Azure AD to refresh them. That refresh period provides an opportunity to reevaluate policies for user access. For example: we might choose not to refresh the token because of a Conditional Access policy, or because the user has been disabled in the directory. 

Customers have expressed concerns about the lag between when conditions change for a user, and when policy changes are enforced. Azure AD has experimented with the "blunt object" approach of reduced token lifetimes but found they can degrade user experiences and reliability without eliminating risks.

Timely response to policy violations or security issues really requires a "conversation" between the token issuer (Azure AD), and the relying party (enlightened app). This two-way conversation gives us two important capabilities. The relying party can see when properties change, like network location, and tell the token issuer. It also gives the token issuer a way to tell the relying party to stop respecting tokens for a given user because of account compromise, disablement, or other concerns. The mechanism for this conversation is continuous access evaluation (CAE). The goal is for response to be near real time, but latency of up to 15 minutes may be observed because of event propagation time.

The initial implementation of continuous access evaluation focuses on Exchange, Teams, and SharePoint Online.

To prepare your applications to use CAE, see [How to use Continuous Access Evaluation enabled APIs in your applications](../develop/app-resilience-continuous-access-evaluation.md).

### Key benefits

- User termination or password change/reset: User session revocation will be enforced in near real time.
- Network location change: Conditional Access location policies will be enforced in near real time.
- Token export to a machine outside of a trusted network can be prevented with Conditional Access location policies.

## Scenarios 

There are two scenarios that make up continuous access evaluation, critical event evaluation and Conditional Access policy evaluation.

### Critical event evaluation

Continuous access evaluation is implemented by enabling services, like Exchange Online, SharePoint Online, and Teams, to subscribe to critical Azure AD events. Those events can then be evaluated and enforced near real time. Critical event evaluation doesn't rely on Conditional Access policies so is available in any tenant. The following events are currently evaluated:

- User Account is deleted or disabled
- Password for a user is changed or reset
- Multi-factor authentication is enabled for the user
- Administrator explicitly revokes all refresh tokens for a user
- High user risk detected by Azure AD Identity Protection

This process enables the scenario where users lose access to organizational SharePoint Online files, email, calendar, or tasks, and Teams from Microsoft 365 client apps within minutes after a critical event. 

> [!NOTE] 
> Teams and SharePoint Online do not support user risk events.

### Conditional Access policy evaluation (preview)

Exchange Online, SharePoint Online, Teams, and MS Graph can synchronize key Conditional Access policies for evaluation within the service itself.

This process enables the scenario where users lose access to organizational files, email, calendar, or tasks from Microsoft 365 client apps or SharePoint Online immediately after network location changes.

> [!NOTE]
> Not all app and resource provider combination are supported. See table below. Office refers to Word, Excel, and PowerPoint.

| | Outlook Web | Outlook Win32 | Outlook iOS | Outlook Android | Outlook Mac |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **SharePoint Online** | Supported | Supported | Supported | Supported | Supported |
| **Exchange Online** | Supported | Supported | Supported | Supported | Supported |

| | Office web apps | Office Win32 apps | Office for iOS | Office for Android | Office for Mac |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **SharePoint Online** | Not Supported | Supported | Supported | Supported | Supported |
| **Exchange Online** | Not Supported | Supported | Supported | Supported | Supported |

| | OneDrive web | OneDrive Win32 | OneDrive iOS | OneDrive Android | OneDrive Mac |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **SharePoint Online** | Supported | Supported | Supported | Supported | Supported |

| | Teams web | Teams Win32 | Teams iOS | Teams Android | Teams Mac |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Teams Service** | Supported | Supported | Supported | Supported | Supported |
| **SharePoint Online** | Supported | Supported | Supported | Supported | Supported |
| **Exchange Online** | Supported | Supported | Supported | Supported | Supported |

## Client Capabilities

### Client-side claim challenge

Before continuous access evaluation, clients would replay the access token from its cache as long as it hadn't expired. With CAE, we introduce a new case where a resource provider can reject a token when it isn't expired. To inform clients to bypass their cache even though the cached tokens haven't expired, we introduce a mechanism called **claim challenge** to indicate that the token was rejected and a new access token need to be issued by Azure AD. CAE requires a client update to understand claim challenge. The latest version of the following applications below support claim challenge:

| | Web | Win32 | iOS | Android | Mac |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Outlook** | Supported | Supported | Supported | Supported | Supported |
| **Teams** | Supported | Supported | Supported | Supported | Supported |
| **Office** | Not Supported | Supported | Supported | Supported | Supported |
| **OneDrive** | Supported | Supported | Supported | Supported | Supported |

### Token lifetime

Because risk and policy are evaluated in real time, clients that negotiate continuous access evaluation aware sessions no longer rely on static access token lifetime policies. This change means that the configurable token lifetime policy isn't honored for clients negotiating CAE-aware sessions.

Token lifetime is increased to long lived, up to 28 hours, in CAE sessions. Revocation is driven by critical events and policy evaluation, not just an arbitrary time period. This change increases the stability of applications without affecting security posture. 

If you aren't using CAE-capable clients, your default access token lifetime will remain 1 hour. The default only changes if you configured your access token lifetime with the [Configurable Token Lifetime (CTL)](../develop/active-directory-configurable-token-lifetimes.md) preview feature.

## Example flow diagrams

### User revocation event flow

![User revocation event flow](./media/concept-continuous-access-evaluation/user-revocation-event-flow.png)

1. A CAE-capable client presents credentials or a refresh token to Azure AD asking for an access token for some resource.
1. An access token is returned along with other artifacts to the client.
1. An Administrator explicitly [revokes all refresh tokens for the user](/powershell/module/azuread/revoke-azureaduserallrefreshtoken). A revocation event will be sent to the resource provider from Azure AD.
1. An access token is presented to the resource provider. The resource provider evaluates the validity of the token and checks whether there's any revocation event for the user. The resource provider uses this information to decide to grant access to the resource or not.
1. In this case, the resource provider denies access, and sends a 401+ claim challenge back to the client.
1. The CAE-capable client understands the 401+ claim challenge. It bypasses the caches and goes back to step 1, sending its refresh token along with the claim challenge back to Azure AD. Azure AD will then reevaluate all the conditions and prompt the user to reauthenticate in this case.

### User condition change flow (Preview)

In the following example, a Conditional Access administrator has configured a location based Conditional Access policy to only allow access from specific IP ranges:

![User condition event flow](./media/concept-continuous-access-evaluation/user-condition-change-flow.png)

1. A CAE-capable client presents credentials or a refresh token to Azure AD asking for an access token for some resource.
1. Azure AD evaluates all Conditional Access policies to see whether the user and client meet the conditions.
1. An access token is returned along with other artifacts to the client.
1. User moves out of an allowed IP range
1. The client presents an access token to the resource provider from outside of an allowed IP range.
1. The resource provider evaluates the validity of the token and checks the location policy synced from Azure AD.
1. In this case, the resource provider denies access, and sends a 401+ claim challenge back to the client. The client is challenged because it isn't coming from an allowed IP range.
1. The CAE-capable client understands the 401+ claim challenge. It bypasses the caches and goes back to step 1, sending its refresh token along with the claim challenge back to Azure AD. Azure AD reevaluates all the conditions and will deny access in this case.

## Enable or disable CAE (Preview)

1. Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator
1. Browse to **Azure Active Directory** > **Security** > **Continuous access evaluation**.
1. Choose **Enable preview**.
1. Select **Save**.

From this page, you can optionally limit the users and groups that will be subject to the preview.

> [!NOTE]
> You can query the Microsoft Graph via [**continuousAccessEvaluationPolicy**](/graph/api/continuousaccessevaluationpolicy-get?view=graph-rest-beta&tabs=http#request-body) to verify the configuration of CAE in your tenant. An HTTP 200 response and associated response body indicate whether CAE is enabled or disabled in your tenant. CAE is not configured if Microsoft Graph returns an HTTP 404 response.

![Enabling the CAE preview in the Azure portal](./media/concept-continuous-access-evaluation/enable-cae-preview.png)

### Available options

Organizations have options when it comes to enabling CAE.

1. Leaving the default selected **Auto Enable after general availability** enables the functionality when CAE is generally available.
1. Customers who select **Enable preview** immediately benefit from the new functionality and won't have to make any changes at general availability. 
1. Customers who select **Disable preview** have time to adopt CAE at their organization's own pace. This setting will persist as **Disabled** at general availability.

## Limitations

### Group membership and Policy update effective time

Changes made to Conditional Access policies and group membership made by administrators could take up to one day to be effective. The delay is from replication between Azure AD and resource providers like Exchange Online and SharePoint Online. Some optimization has been done for policy updates, which reduce the delay to two hours. However, it doesn't cover all the scenarios yet.  

In the event that Conditional Access policy or group membership changes need to be applied to certain users immediately, you have two options. 

- Run the [revoke-azureaduserallrefreshtoken PowerShell command](/powershell/module/azuread/revoke-azureaduserallrefreshtoken) to revoke all refresh tokens of a specified user.
- Select "Revoke Session" on the user profile page in the Azure Portal to revoke the user's session to ensure that the updated policies will be applied immediately.

### IP address variation

Your identity provider and resource providers may see different IP addresses. This mismatch may happen because of:

- Network proxy implementations in your organization
- Incorrect IPv4/IPv6 configurations between your identity provider and resource provider
 
Examples:

- Your identity provider sees one IP address from the client.
- Your resource provider sees a different IP address from the client after passing through a proxy.
- The IP address your identity provider sees is part of an allowed IP range in policy but the IP address from the resource provider isn't.

To avoid infinite loops because of these scenarios, Azure AD issues a one hour CAE token and won't enforce client location change. In this case, security is improved compared to traditional one hour tokens since we're still evaluating the [other events](#critical-event-evaluation) besides client location change events.

### Supported location policies

CAE only has insight into [IP-based named locations](../conditional-access/location-condition.md#ip-address-ranges). CAE doesn't have insight into other location conditions like [MFA trusted IPs](../authentication/howto-mfa-mfasettings.md#trusted-ips) or country-based locations. When a user comes from an MFA trusted IP, trusted location that includes MFA Trusted IPs, or country location, CAE won't be enforced after that user moves to a different location. In those cases, Azure AD will issue a one-hour access token without instant IP enforcement check. 

> [!IMPORTANT]
> When configuring locations for continuous access evaluation, use only the [IP based Conditional Access location condition](../conditional-access/location-condition.md) and configure all IP addresses, **including both IPv4 and IPv6**, that can be seen by your identity provider and resources provider. Do not use country location conditions or the trusted ips feature that is available in Azure AD Multi-Factor Authentication's service settings page.

### Office and Web Account Manager settings

| Office update channel | DisableADALatopWAMOverride | DisableAADWAM |
| --- | --- | --- |
| Semi-Annual Enterprise Channel | If set to enabled or 1, CAE won't be supported. | If set to enabled or 1, CAE won't be supported. |
| Current Channel <br> or <br> Monthly Enterprise Channel | CAE is supported whatever the setting | CAE is supported whatever the setting |

For an explanation of the office update channels, see [Overview of update channels for Microsoft 365 Apps](/deployoffice/overview-update-channels). The recommendation is that organizations don't disable Web Account Manager (WAM).

### Coauthoring in Office apps

When multiple users are collaborating on a document at the same time, their access to the document may not be immediately revoked by CAE based on user revocation or policy change events. In this case, the user loses access completely after: 

- Closing the document
- Closing the Office app
- After a period of 10 hours

To reduce this time a SharePoint Administrator can reduce the maximum lifetime of coauthoring sessions for documents stored in SharePoint Online and OneDrive for Business, by [configuring a network location policy in SharePoint Online](/sharepoint/control-access-based-on-network-location). Once this configuration is changed, the maximum lifetime of coauthoring sessions will be reduced to 15 minutes, and can be adjusted further using the SharePoint Online PowerShell command "[Set-SPOTenant –IPAddressWACTokenLifetime](/powershell/module/sharepoint-online/set-spotenant?view=sharepoint-ps)".

### Enable after a user is disabled

If you enable a user right after disabling, there's some latency before the account is recognized as enabled in downstream Microsoft services.

- SharePoint Online and Teams typically have a 15-minute delay. 
- Exchange Online typically has a 35-40 minute delay. 

## FAQs

### How will CAE work with Sign-in Frequency?

Sign-in Frequency will be honored with or without CAE.

## Next steps

- [How to use Continuous Access Evaluation enabled APIs in your applications](../develop/app-resilience-continuous-access-evaluation.md)
- [Claims challenges, claims requests, and client capabilities](../develop/claims-challenge.md)
- [Monitor and troubleshoot continuous access evaluation](howto-continuous-access-evaluation-troubleshoot.md)
