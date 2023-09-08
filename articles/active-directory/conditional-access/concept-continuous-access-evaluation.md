---
title: Continuous access evaluation in Azure AD
description: Responding to changes in user state faster with continuous access evaluation in Azure AD

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 07/27/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: vmahtani
ms.custom: has-adal-ref
ms.collection: M365-identity-device-management
---
# Continuous access evaluation

Token expiration and refresh are a standard mechanism in the industry. When a client application like Outlook connects to a service like Exchange Online, the API requests are authorized using OAuth 2.0 access tokens. By default, access tokens are valid for one hour, when they expire the client is redirected to Azure AD to refresh them. That refresh period provides an opportunity to reevaluate policies for user access. For example: we might choose not to refresh the token because of a Conditional Access policy, or because the user has been disabled in the directory. 

Customers have expressed concerns about the lag between when conditions change for a user, and when policy changes are enforced. Azure AD has experimented with the "blunt object" approach of reduced token lifetimes but found they can degrade user experiences and reliability without eliminating risks.

Timely response to policy violations or security issues really requires a "conversation" between the token issuer (Azure AD), and the relying party (enlightened app). This two-way conversation gives us two important capabilities. The relying party can see when properties change, like network location, and tell the token issuer. It also gives the token issuer a way to tell the relying party to stop respecting tokens for a given user because of account compromise, disablement, or other concerns. The mechanism for this conversation is continuous access evaluation (CAE), an industry standard based on [Open ID Continuous Access Evaluation Profile (CAEP)](https://openid.net/specs/openid-caep-specification-1_0-01.html). The goal for critical event evaluation is for response to be near real time, but latency of up to 15 minutes may be observed because of event propagation time; however, IP locations policy enforcement is instant.

The initial implementation of continuous access evaluation focuses on Exchange, Teams, and SharePoint Online.

To prepare your applications to use CAE, see [How to use Continuous Access Evaluation enabled APIs in your applications](../develop/app-resilience-continuous-access-evaluation.md).

### Key benefits

- User termination or password change/reset: User session revocation is enforced in near real time.
- Network location change: Conditional Access location policies are enforced in near real time.
- Token export to a machine outside of a trusted network can be prevented with Conditional Access location policies.

## Scenarios 

There are two scenarios that make up continuous access evaluation, critical event evaluation and Conditional Access policy evaluation.

### Critical event evaluation

Continuous access evaluation is implemented by enabling services, like Exchange Online, SharePoint Online, and Teams, to subscribe to critical Azure AD events. Those events can then be evaluated and enforced near real time. Critical event evaluation doesn't rely on Conditional Access policies so it's available in any tenant. The following events are currently evaluated:

- User Account is deleted or disabled
- Password for a user is changed or reset
- Multifactor Authentication is enabled for the user
- Administrator explicitly revokes all refresh tokens for a user
- High user risk detected by Azure AD Identity Protection

This process enables the scenario where users lose access to organizational SharePoint Online files, email, calendar, or tasks, and Teams from Microsoft 365 client apps within minutes after a critical event. 

> [!NOTE] 
> SharePoint Online doesn't support user risk events.

### Conditional Access policy evaluation

Exchange Online, SharePoint Online, Teams, and MS Graph can synchronize key Conditional Access policies for evaluation within the service itself.

This process enables the scenario where users lose access to organizational files, email, calendar, or tasks from Microsoft 365 client apps or SharePoint Online immediately after network location changes.

> [!NOTE]
> Not all client app and resource provider combinations are supported. See the following tables. The first column of this table refers to web applications launched via web browser (i.e. PowerPoint launched in web browser) while the remaining four columns refer to native applications running on each platform described. Additionally, references to "Office" encompass Word, Excel, and PowerPoint.

| | Outlook Web | Outlook Win32 | Outlook iOS | Outlook Android | Outlook Mac |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **SharePoint Online** | Supported | Supported | Supported | Supported | Supported |
| **Exchange Online** | Supported | Supported | Supported | Supported | Supported |

| | Office web apps | Office Win32 apps | Office for iOS | Office for Android | Office for Mac |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **SharePoint Online** | Not Supported \* | Supported | Supported | Supported | Supported |
| **Exchange Online** | Not Supported | Supported | Supported | Supported | Supported |

| | OneDrive web | OneDrive Win32 | OneDrive iOS | OneDrive Android | OneDrive Mac |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **SharePoint Online** | Supported | Not Supported | Supported | Supported | Not Supported |

| | Teams web | Teams Win32 | Teams iOS | Teams Android | Teams Mac |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Teams Service** | Partially supported | Partially supported | Partially supported | Partially supported | Partially supported |
| **SharePoint Online** | Partially supported | Partially supported | Partially supported | Partially supported | Partially supported |
| **Exchange Online** | Partially supported | Partially supported | Partially supported | Partially supported | Partially supported |

> \* Token lifetimes for Office web apps are reduced to 1 hour when a Conditional Access policy is set.

> [!NOTE]
> Teams is made up of multiple services and among these the calls and chat services don't adhere to IP-based Conditional Access policies.

Continuous access evaluation is also available in Azure Government tenants (GCC High and DOD) for Exchange Online.

## Client Capabilities

### Client-side claim challenge

Before continuous access evaluation, clients would replay the access token from its cache as long as it wasn't expired. With CAE, we introduce a new case where a resource provider can reject a token when it isn't expired. To inform clients to bypass their cache even though the cached tokens haven't expired, we introduce a mechanism called **claim challenge** to indicate that the token was rejected and a new access token need to be issued by Azure AD. CAE requires a client update to understand claim challenge. The latest versions of the following applications support claim challenge:

| | Web | Win32 | iOS | Android | Mac |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Outlook** | Supported | Supported | Supported | Supported | Supported |
| **Teams** | Supported | Supported | Supported | Supported | Supported |
| **Office** | Not Supported | Supported | Supported | Supported | Supported |
| **OneDrive** | Supported | Supported | Supported | Supported | Supported |

### Token lifetime

Because risk and policy are evaluated in real time, clients that negotiate continuous access evaluation aware sessions no longer rely on static access token lifetime policies. This change means that the configurable token lifetime policy isn't honored for clients negotiating CAE-aware sessions.

Token lifetime increases to long-lived, up to 28 hours, in CAE sessions. Critical events and policy evaluation drive revocation, not just an arbitrary time period. This change increases the stability of applications without affecting security posture. 

If you aren't using CAE-capable clients, your default access token lifetime remains 1 hour. The default only changes if you configured your access token lifetime with the [Configurable Token Lifetime (CTL)](../develop/configurable-token-lifetimes.md) preview feature.

## Example flow diagrams

### User revocation event flow

![User revocation event flow](./media/concept-continuous-access-evaluation/user-revocation-event-flow.png)

1. A CAE-capable client presents credentials or a refresh token to Azure AD asking for an access token for some resource.
1. An access token is returned along with other artifacts to the client.
1. An Administrator explicitly [revokes all refresh tokens for the user](/powershell/module/microsoft.graph.users.actions/revoke-mgusersigninsession), then a revocation event is sent to the resource provider from Azure AD.
1. An access token is presented to the resource provider. The resource provider evaluates the validity of the token and checks whether there's any revocation event for the user. The resource provider uses this information to decide to grant access to the resource or not.
1. In this case, the resource provider denies access, and sends a 401+ claim challenge back to the client.
1. The CAE-capable client understands the 401+ claim challenge. It bypasses the caches and goes back to step 1, sending its refresh token along with the claim challenge back to Azure AD. Azure AD then reevaluates all the conditions and prompt the user to reauthenticate in this case.

### User condition change flow

In the following example, a Conditional Access Administrator has configured a location based Conditional Access policy to only allow access from specific IP ranges:

![User condition event flow](./media/concept-continuous-access-evaluation/user-condition-change-flow.png)

1. A CAE-capable client presents credentials or a refresh token to Azure AD asking for an access token for some resource.
1. Azure AD evaluates all Conditional Access policies to see whether the user and client meet the conditions.
1. An access token is returned along with other artifacts to the client.
1. User moves out of an allowed IP range.
1. The client presents an access token to the resource provider from outside of an allowed IP range.
1. The resource provider evaluates the validity of the token and checks the location policy synced from Azure AD.
1. In this case, the resource provider denies access, and sends a 401+ claim challenge back to the client. The client is challenged because it isn't coming from an allowed IP range.
1. The CAE-capable client understands the 401+ claim challenge. It bypasses the caches and goes back to step 1, sending its refresh token along with the claim challenge back to Azure AD. Azure AD reevaluates all the conditions and denies access in this case.

## Exception for IP address variations and how to turn off the exception 

In step 8 above, when Azure AD reevaluates the conditions, it denies access because the new location detected by Azure AD is outside the allowed IP range. This isn't always the case. Due to [some complex network topologies](concept-continuous-access-evaluation.md#ip-address-variation-and-networks-with-ip-address-shared-or-unknown-egress-ips), the authentication request can arrive from an allowed egress IP address even after the access request received by the resource provider arrived from an IP address that isn't allowed. Under these conditions, Azure AD interprets that the client continues to be in an allowed location and should be granted access.  Therefore, Azure AD issues a one-hour token that suspends IP address checks at the resource until token expiration. Azure AD continues to enforce IP address checks. 

Standard vs. Strict mode. The granting of access under this exception (that is, an allowed location detected between Azure AD with a disallowed location detected by the resource provider) protects user productivity by maintaining access to critical resources. This is standard location enforcement. On the other hand, Administrators who operate under stable network topologies and wish remove this exception can use [Strict Location Enforcement (Public Preview)](concept-continuous-access-evaluation-strict-enforcement.md).

## Enable or disable CAE

The CAE setting has been moved to under the Conditional Access blade. New CAE customers can access and toggle CAE directly when creating Conditional Access policies. However, some existing customers must go through migration before they can access CAE through Conditional Access.

#### Migration

Customers who have configured CAE settings under Security before have to migrate settings to a new Conditional Access policy. Use the steps that follow to migrate your CAE settings to a Conditional Access policy.

:::image type="content" source="media/concept-continuous-access-evaluation/migrate-continuous-access-evaluation.png" alt-text="Portal view showing the option to migrate continuous access evaluation to a Conditional Access policy." lightbox="media/concept-continuous-access-evaluation/migrate-continuous-access-evaluation.png":::

1. Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator. 
1. Browse to **Azure Active Directory** > **Security** > **Continuous access evaluation**. 
1. You have the option to **Migrate** your policy. This action is the only one that you have access to at this point.
1. Browse to **Conditional Access** and you find a new policy named **Conditional Access policy created from CAE settings** with your settings configured. Administrators can choose to customize this policy or create their own to replace it.

The following table describes the migration experience of each customer group based on previously configured CAE settings. 

| Existing CAE Setting | Is Migration Needed | Auto Enabled for CAE | Expected Migration Experience |
| --- | --- | --- | --- |
| New tenants that didn't configure anything in the old experience. | No | Yes | Old CAE setting is hidden given these customers likely didn't see the experience before general availability. |
| Tenants that explicitly enabled for all users with the old experience. | No | Yes | Old CAE setting is greyed out. Since these customers explicitly enabled this setting for all users, they don't need to migrate. |
| Tenants that explicitly enabled some users in their tenants with the old experience.| Yes | No | Old CAE settings are greyed out. Clicking **Migrate** launches the new Conditional Access policy wizard, which includes **All users**, while excluding users and groups copied from CAE. It also sets the new **Customize continuous access evaluation** Session control to **Disabled**. |
| Tenants that explicitly disabled the preview. | Yes | No | Old CAE settings are greyed out. Clicking **Migrate** launches the new Conditional Access policy wizard, which includes **All users**, and sets the new **Customize continuous access evaluation** Session control to **Disabled**. |

More information about continuous access evaluation as a session control can be found in the section, [Customize continuous access evaluation](concept-conditional-access-session.md#customize-continuous-access-evaluation).

## Limitations

### Group membership and Policy update effective time

Changes made to Conditional Access policies and group membership made by administrators could take up to one day to be effective. The delay is from replication between Azure AD and resource providers like Exchange Online and SharePoint Online. Some optimization has been done for policy updates, which reduce the delay to two hours. However, it doesn't cover all the scenarios yet.  

When Conditional Access policy or group membership changes need to be applied to certain users immediately, you have two options. 

- Run the [revoke-mgusersign PowerShell command](/powershell/module/microsoft.graph.users.actions/revoke-mgusersigninsession) to revoke all refresh tokens of a specified user.
- Select "Revoke Session" on the user profile page in the Azure portal to revoke the user's session to ensure that the updated policies are applied immediately.

### IP address variation and networks with IP address shared or unknown egress IPs 

Modern networks often optimize connectivity and network paths for applications differently. This optimization frequently causes variations of the routing and source IP addresses of connections, as seen by your identity provider and resource providers. You may observe this split path or IP address variation in multiple network topologies, including, but not limited to: 

- On-premises and cloud-based proxies.
- Virtual private network (VPN) implementations, like [split tunneling](/microsoft-365/enterprise/microsoft-365-vpn-implement-split-tunnel).
- Software defined wide area network (SD-WAN) deployments.
- Load balanced or redundant network egress network topologies, like those using [SNAT](https://wikipedia.org/wiki/Network_address_translation#SNAT). 
- Branch office deployments that allow direct internet connectivity for specific applications.
- Networks that support IPv6 clients.
- Other topologies, which handle application or resource traffic differently from traffic to the identity provider.

In addition to IP variations, customers also may employ network solutions and services that: 

- Use IP addresses that may be shared with other customers. For example, cloud-based proxy services where egress IP addresses are shared between customers.
- Use easily varied or undefinable IP addresses. For example, topologies where there are large, dynamic sets of egress IP addresses used, like large enterprise scenarios or [split VPN](/microsoft-365/enterprise/microsoft-365-vpn-implement-split-tunnel) and local egress network traffic.

Networks where egress IP addresses may change frequently or are shared may affect Azure AD Conditional Access and Continues Access Evaluation (CAE). This variability can affect how these features work and their recommended configurations. Split Tunneling may also cause unexpected blocks when an environment is configured using [Split Tunneling VPN Best Practices](/microsoft-365/enterprise/microsoft-365-vpn-implement-split-tunnel). Routing [Optimized IPs](/microsoft-365/enterprise/microsoft-365-vpn-implement-split-tunnel#optimize-ip-address-ranges) through a Trusted IP/VPN may be required to prevent blocks related to *insufficient_claims* or *Instant IP Enforcement check failed*.


The following table summarizes Conditional Access and CAE feature behaviors and recommendations for different types of network deployments: 

| Network Type | Example | IPs seen by Azure AD | IPs seen by RP | Applicable Conditional Access Configuration (Trusted Named Location) | CAE enforcement | CAE access token | Recommendations |
|---|---|---|---|---|---|---|---|
| 1. Egress IPs are dedicated and enumerable for both Azure AD and all RPs traffic | All to network traffic to Azure AD and RPs egresses through 1.1.1.1 and/or 2.2.2.2 | 1.1.1.1 | 2.2.2.2 | 1.1.1.1 <br> 2.2.2.2 | Critical Events <br> IP location Changes | Long lived – up to 28 hours | If Conditional Access Named Locations are defined, ensure that they contain all possible egress IPs (seen by Azure AD and all RPs) |
| 2. Egress IPs are dedicated and enumerable for Azure AD, but not for RPs traffic | Network traffic to Azure AD egresses through 1.1.1.1. RP traffic egresses through x.x.x.x | 1.1.1.1 | x.x.x.x | 1.1.1.1 | Critical Events | Default access token lifetime – 1 hour | Don't add non dedicated or nonenumerable egress IPs (x.x.x.x) into Trusted Named Location Conditional Access rules as it can weaken security |
| 3. Egress IPs are non-dedicated/shared or not enumerable for both Azure AD and RPs traffic | Network traffic to Azure AD egresses through y.y.y.y. RP traffic egresses through x.x.x.x | y.y.y.y | x.x.x.x | N/A -no IP Conditional Access policies/Trusted Locations configured | Critical Events | Long lived – up to 28 hours | Don't add non dedicated or nonenumerable egress IPs (x.x.x.x/y.y.y.y) into Trusted Named Location Conditional Access rules as it can weaken security |

Networks and network services used by clients connecting to identity and resource providers continue to evolve and change in response to modern trends. These changes may affect Conditional Access and CAE configurations that rely on the underlying IP addresses. When deciding on these configurations, factor in future changes in technology and upkeep of the defined list of addresses in your plan.

### Supported location policies

CAE only has insight into [IP-based named locations](../conditional-access/location-condition.md#ipv4-and-ipv6-address-ranges). CAE doesn't have insight into other location conditions like [MFA trusted IPs](../authentication/howto-mfa-mfasettings.md#trusted-ips) or country/region-based locations. When a user comes from an MFA trusted IP, trusted location that includes MFA Trusted IPs, or country/region location, CAE won't be enforced after that user moves to a different location. In those cases, Azure AD issues a one-hour access token without instant IP enforcement check. 

> [!IMPORTANT]
> If you want your location policies to be enforced in real time by continuous access evaluation, use only the [IP based Conditional Access location condition](../conditional-access/location-condition.md) and configure all IP addresses, **including both IPv4 and IPv6**, that can be seen by your identity provider and resources provider. Do not use country/region location conditions or the trusted ips feature that is available in Azure AD Multifactor Authentication's service settings page.

### Named location limitations

When the sum of all IP ranges specified in location policies exceeds 5,000, user change location flow isn't enforced by CAE in real time. In this case, Azure AD issues a one-hour CAE token. CAE continues enforcing [all other events and policies](#critical-event-evaluation) besides client location change events. With this change, you still maintain stronger security posture compared to traditional one-hour tokens, since [other events](#critical-event-evaluation) are still evaluated in near real time.

### Office and Web Account Manager settings

| Office update channel | DisableADALatopWAMOverride | DisableAADWAM |
| --- | --- | --- |
| Semi-Annual Enterprise Channel | If set to enabled or 1, CAE won't be supported. | If set to enabled or 1, CAE won't be supported. |
| Current Channel <br> or <br> Monthly Enterprise Channel | CAE is supported whatever the setting | CAE is supported whatever the setting |

For an explanation of the office update channels, see [Overview of update channels for Microsoft 365 Apps](/deployoffice/overview-update-channels). The recommendation is that organizations don't disable Web Account Manager (WAM).

### Coauthoring in Office apps

When multiple users are collaborating on a document at the same time, their access to the document may not be immediately revoked by CAE based on policy change events. In this case, the user loses access completely after:

- Closing the document
- Closing the Office app
- After 1 hour when a Conditional Access IP policy is set

To further reduce this time, a SharePoint Administrator can reduce the maximum lifetime of coauthoring sessions for documents stored in SharePoint Online and OneDrive for Business, by [configuring a network location policy in SharePoint Online](/sharepoint/control-access-based-on-network-location). Once this configuration is changed, the maximum lifetime of coauthoring sessions is reduced to 15 minutes, and can be adjusted further using the SharePoint Online PowerShell command [Set-SPOTenant –IPAddressWACTokenLifetime](/powershell/module/sharepoint-online/set-spotenant).

### Enable after a user is disabled

If you enable a user right after disabling, there's some latency before the account is recognized as enabled in downstream Microsoft services.

- SharePoint Online and Teams typically have a 15-minute delay.
- Exchange Online typically has a 35-40 minute delay. 

### Push notifications

An IP address policy isn't evaluated before push notifications are released. This scenario exists because push notifications are outbound and don't have an associated IP address to be evaluated against. If a user selects that push notification, for example an email in Outlook, CAE IP address policies are still enforced before the email can display. Push notifications display a message preview, which isn't protected by an IP address policy. All other CAE checks are done before the push notification being sent. If a user or device has its access removed, enforcement occurs within the documented period. 

### Guest users

CAE doesn't support Guest user accounts. CAE revocation events and IP based Conditional Access policies aren't enforced instantaneously.

### CAE and Sign-in Frequency

Sign-in Frequency is honored with or without CAE.

## Next steps

- [How to use Continuous Access Evaluation enabled APIs in your applications](../develop/app-resilience-continuous-access-evaluation.md)
- [Claims challenges, claims requests, and client capabilities](../develop/claims-challenge.md)
- [Conditional Access: Session](concept-conditional-access-session.md)
- [Monitor and troubleshoot continuous access evaluation](howto-continuous-access-evaluation-troubleshoot.md)
