---
title: Web browser cookies used in Microsoft Entra authentication
description: Learn about Web browser cookies used in Microsoft Entra authentication.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: overview
ms.date: 01/29/2023

ms.author: justinha
author: custorod
manager: amycolannino
ms.reviewer: sahenry, michmcla

ms.collection: M365-identity-device-management

# Customer intent: As a Microsoft Entra administrator, I want to understand which weh browser cookies are used for Microsoft Entra ID.
---
# Web browser cookies used in Microsoft Entra authentication

During authentication against Microsoft Entra ID through a web browser, multiple cookies are involved in the process. Some of the cookies are common on all requests. Other cookies are used for specific authentication flows or specific client-side conditions.  

Persistent session tokens are stored as persistent cookies on the web browser's cookie jar. Non-persistent session tokens are stored as session cookies on the web browser, and are destroyed when the browser session is closed. 

|  Cookie Name | Type | Comments |
|--|--|--|
| ESTSAUTH | Common | Contains user's session information to facilitate SSO. Transient. |
| ESTSAUTHPERSISTENT | Common | Contains user's session information to facilitate SSO. Persistent. |
| ESTSAUTHLIGHT | Common  | Contains Session GUID Information. Lite session state cookie used exclusively by client-side JavaScript in order to facilitate OIDC sign-out. Security feature. |
| SignInStateCookie | Common | Contains list of services accessed to facilitate sign-out. No user information. Security feature. |
| CCState | Common | Contains session information state to be used between Microsoft Entra ID and the [Microsoft Entra Backup Authentication Service](../conditional-access/resilience-defaults.md). |
| build | Common | Tracks browser related information. Used for service telemetry and protection mechanisms. |
| fpc | Common | Tracks browser related information. Used for tracking requests and throttling. |
| esctx | Common | Session context cookie information. For CSRF protection. Binds a request to a specific browser instance so the request can't be replayed outside the browser. No user information. |
| ch | Common | ProofOfPossessionCookie. Stores the Proof of Possession cookie hash to the user agent. |
| ESTSSC | Common | Legacy cookie containing session count information no longer used. |
| ESTSSSOTILES | Common | Tracks session sign-out. When present and not expired, with value "ESTSSSOTILES=1", it will interrupt SSO, for specific SSO authentication model, and will present tiles for user account selection. |
| AADSSOTILES | Common | Tracks session sign-out. Similar to ESTSSSOTILES but for other specific SSO authentication model. |
| ESTSUSERLIST | Common | Tracks Browser SSO user's list. |
| SSOCOOKIEPULLED | Common | Prevents looping on specific scenarios. No user information. |
| cltm | Common | For telemetry purposes. Tracks AppVersion, ClientFlight and Network type. | 
| brcap | Common | Client-side cookie (set by JavaScript) to validate client/web browser's touch capabilities. |
| clrc | Common | Client-side cookie (set by JavaScript) to control local cached sessions on the client. |
| CkTst | Common | Client-side cookie (set by JavaScript). No longer in active use. | 
| wlidperf | Common | Client-side cookie (set by JavaScript) that tracks local time for performance purposes. |
| x-ms-gateway-slice | Common | Microsoft Entra Gateway cookie used for tracking and load balance purposes. |
| stsservicecookie | Common | Microsoft Entra Gateway cookie also used for tracking purposes. |
| x-ms-refreshtokencredential | Specific | Available when [Primary Refresh Token (PRT)](../devices/concept-primary-refresh-token.md) is in use. |
| estsStateTransient | Specific | Applicable to new session information model only. Transient. | 
| estsStatePersistent | Specific | Same as estsStateTransient, but persistent. |
| ESTSNCLOGIN | Specific | National Cloud Login related Cookie. | 
| UsGovTraffic | Specific | US Gov Cloud Traffic Cookie. | 
| ESTSWCTXFLOWTOKEN | Specific | Saves flowToken information when redirecting to ADFS. |
| CcsNtv | Specific | To control when Microsoft Entra Gateway will send requests to [Microsoft Entra Backup Authentication Service](../conditional-access/resilience-defaults.md). Native flows. | 
| CcsWeb | Specific | To control when Microsoft Entra Gateway will send requests to [Microsoft Entra Backup Authentication Service](../conditional-access/resilience-defaults.md). Web flows. | 
| Ccs* | Specific | Cookies with prefix Ccs*, have the same purpose as the ones without prefix, but only apply when [Microsoft Entra Backup Authentication Service](../conditional-access/resilience-defaults.md) is in use. | 
| threxp | Specific | Used for throttling control. | 
| rrc | Specific | Cookie used to identify a recent B2B invitation redemption. | 
| debug | Specific | Cookie used to track if user's browser session is enabled for DebugMode. |
| MSFPC | Specific | This cookie is not specific to any ESTS flow, but is sometimes present. It applies to all Microsoft Sites (when accepted by users). Identifies unique web browsers visiting Microsoft sites. It's used for advertising, site analytics, and other operational purposes. |

> [!NOTE] 
> Cookies identified as client-side cookies are set locally on the client device by JavaScript, hence, will be marked with HttpOnly=false.  
>
> Cookie definitions and respective names are subject to change at any moment in time according to Microsoft Entra service requirements.  

## Next steps

To learn more about self-service password reset concepts, see [How Microsoft Entra self-service password reset works][concept-sspr].

To learn more about multifactor authentication concepts, see [How Microsoft Entra multifactor authentication works][concept-mfa].

<!-- INTERNAL LINKS -->
[concept-sspr]: concept-sspr-howitworks.md
[concept-mfa]: concept-mfa-howitworks.md
