---
title: What is risk? Azure AD Identity Protection
description: Explaining risk in Azure AD Identity Protection

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: conceptual
ms.date: 08/16/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: chuqiaoshi

ms.collection: M365-identity-device-management
---
# What is risk?

Risk detections in Azure AD Identity Protection include any identified suspicious actions related to user accounts in the directory. Risk detections (both user and sign-in linked) contribute to the overall user risk score that is found in the Risky Users report.

Identity Protection provides organizations access to powerful resources to see and respond quickly to these suspicious actions. 

![Security overview showing risky users and sign-ins](./media/concept-identity-protection-risks/identity-protection-security-overview.png)

> [!NOTE]
> Identity Protection generates risk detections only when the correct credentials are used. If incorrect credentials are used on a sign-in, it does not represent risk of credential compromise.

## Risk types and detection

Risk can be detected at the **User** and **Sign-in** level and two types of detection or calculation **Real-time** and **Offline**. Some risks are considered premium available to Azure AD Premium P2 customers only, while others are available to Free and Azure AD Premium P1 customers.

A sign-in risk represents the probability that a given authentication request isn't authorized by the identity owner. Risky activity can be detected for a user that isn't linked to a specific malicious sign-in but to the user itself. 

Real-time detections may not show up in reporting for 5 to 10 minutes. Offline detections may not show up in reporting for 48 hours.

> [!NOTE] 
> Our system may detect that the risk event that contributed to the risk user risk score was either:
>
> - A false positive
> - The [user risk was remediated](howto-identity-protection-remediate-unblock.md) by policy by either:
>    - Completing multifactor authentication 
>    - Secure password change. 
>
> Our system will dismiss the risk state and a risk detail of “AI confirmed sign-in safe” will show and no longer contribute to the user’s overall risk. 

### Premium detections

Premium detections are visible only to Azure AD Premium P2 customers. Customers without Azure AD Premium P2 licenses still receive the premium detections but they'll be titled "additional risk detected".

### Sign-in risk

#### Premium sign-in risk detections

| Risk detection | Detection type | Description |
| --- | --- | --- |
| Atypical travel | Offline | This risk detection type identifies two sign-ins originating from geographically distant locations, where at least one of the locations may also be atypical for the user, given past behavior. The algorithm takes into account multiple factors including the time between the two sign-ins and the time it would have taken for the user to travel from the first location to the second. This risk may indicate that a different user is using the same credentials. <br><br> The algorithm ignores obvious "false positives" contributing to the impossible travel conditions, such as VPNs and locations regularly used by other users in the organization. The system has an initial learning period of the earliest of 14 days or 10 logins, during which it learns a new user's sign-in behavior. |
| Anomalous Token | Offline | This detection indicates that there are abnormal characteristics in the token such as an unusual token lifetime or a token that is played from an unfamiliar location. This detection covers Session Tokens and Refresh Tokens. <br><br> **NOTE:** Anomalous token is tuned to incur more noise than other detections at the same risk level. This tradeoff is chosen to increase the likelihood of detecting replayed tokens that may otherwise go unnoticed. Because this is a high noise detection, there's a higher than normal chance that some of the sessions flagged by this detection are false positives. We recommend investigating the sessions flagged by this detection in the context of other sign-ins from the user. If the location, application, IP address, User Agent, or other characteristics are unexpected for the user, the tenant admin should consider this risk as an indicator of potential token replay. |
| Token Issuer Anomaly | Offline |This risk detection indicates the SAML token issuer for the associated SAML token is potentially compromised. The claims included in the token are unusual or match known attacker patterns. |
| Malware linked IP address | Offline | This risk detection type indicates sign-ins from IP addresses infected with malware that is known to actively communicate with a bot server. This detection matches the IP addresses of the user's device against IP addresses that were in contact with a bot server while the bot server was active. <br><br> **[This detection has been deprecated](../fundamentals/whats-new-archive.md#planned-deprecation---malware-linked-ip-address-detection-in-identity-protection)**. Identity Protection will no longer generate new "Malware linked IP address" detections. Customers who currently have "Malware linked IP address" detections in their tenant will still be able to view, remediate, or dismiss them until the 90-day detection retention time is reached.|
| Suspicious browser | Offline | Suspicious browser detection indicates anomalous behavior based on suspicious sign-in activity across multiple tenants from different countries in the same browser. |
| Unfamiliar sign-in properties | Real-time |This risk detection type considers past sign-in history to look for anomalous sign-ins. The system stores information about previous sign-ins, and triggers a risk detection when a sign-in occurs with properties that are unfamiliar to the user. These properties can include IP, ASN, location, device, browser, and tenant IP subnet. Newly created users will be in "learning mode" period where the unfamiliar sign-in properties risk detection will be turned off while our algorithms learn the user's behavior. The learning mode duration is dynamic and depends on how much time it takes the algorithm to gather enough information about the user's sign-in patterns. The minimum duration is five days. A user can go back into learning mode after a long period of inactivity. <br><br> We also run this detection for basic authentication (or legacy protocols). Because these protocols don't have modern properties such as client ID, there's limited telemetry to reduce false positives. We recommend our customers to move to modern authentication. <br><br> Unfamiliar sign-in properties can be detected on both interactive and non-interactive sign-ins. When this detection is detected on non-interactive sign-ins, it deserves increased scrutiny due to the risk of token replay attacks. |
| Malicious IP address | Offline | This detection indicates sign-in from a malicious IP address. An IP address is considered malicious based on high failure rates because of invalid credentials received from the IP address or other IP reputation sources. |
| Suspicious inbox manipulation rules | Offline | This detection is discovered by [Microsoft Defender for Cloud Apps](/cloud-app-security/anomaly-detection-policy#suspicious-inbox-manipulation-rules). This detection looks at your environment and triggers alerts when suspicious rules that delete or move messages or folders are set on a user's inbox. This detection may indicate: a user's account is compromised, messages are being intentionally hidden, and the mailbox is being used to distribute spam or malware in your organization. |
| Password spray | Offline | A password spray attack is where multiple usernames are attacked using common passwords in a unified brute force manner to gain unauthorized access. This risk detection is triggered when a password spray attack has been successfully performed. For example, the attacker is successfully authenticated, in the detected instance. |
| Impossible travel | Offline | This detection is discovered by [Microsoft Defender for Cloud Apps](/cloud-app-security/anomaly-detection-policy#impossible-travel). This detection identifies user activities (is a single or multiple sessions) originating from geographically distant locations within a time period shorter than the time it takes to travel from the first location to the second. This risk may indicate that a different user is using the same credentials. |
| New country | Offline | This detection is discovered by [Microsoft Defender for Cloud Apps](/cloud-app-security/anomaly-detection-policy#activity-from-infrequent-country). This detection considers past activity locations to determine new and infrequent locations. The anomaly detection engine stores information about previous locations used by users in the organization. |
| Activity from anonymous IP address | Offline | This detection is discovered by [Microsoft Defender for Cloud Apps](/cloud-app-security/anomaly-detection-policy#activity-from-anonymous-ip-addresses). This detection identifies that users were active from an IP address that has been identified as an anonymous proxy IP address. |
| Suspicious inbox forwarding | Offline | This detection is discovered by [Microsoft Defender for Cloud Apps](/cloud-app-security/anomaly-detection-policy#suspicious-inbox-forwarding). This detection looks for suspicious email forwarding rules, for example, if a user created an inbox rule that forwards a copy of all emails to an external address. |
| Mass Access to Sensitive Files | Offline | This detection is discovered by [Microsoft Defender for Cloud Apps](/defender-cloud-apps/investigate-anomaly-alerts#unusual-file-access-by-user). This detection looks at your environment and triggers alerts when users access multiple files from Microsoft SharePoint or Microsoft OneDrive. An alert is triggered only if the number of accessed files is uncommon for the user and the files might contain sensitive information|

#### Nonpremium sign-in risk detections

| Risk detection |  Detection type | Description |
| --- | --- | --- |
| Additional risk detected | Real-time or Offline | This detection indicates that one of the premium detections was detected. Since the premium detections are visible only to Azure AD Premium P2 customers, they're titled "additional risk detected" for customers without Azure AD Premium P2 licenses. |
| Anonymous IP address | Real-time | This risk detection type indicates sign-ins from an anonymous IP address (for example, Tor browser or anonymous VPN). These IP addresses are typically used by actors who want to hide their sign-in information (IP address, location, device, and so on) for potentially malicious intent. |
| Admin confirmed user compromised | Offline | This detection indicates an admin has selected 'Confirm user compromised' in the Risky users UI or using riskyUsers API. To see which admin has confirmed this user compromised, check the user's risk history (via UI or API). |
| Azure AD threat intelligence | Offline | This risk detection type indicates user activity that is unusual for the user or consistent with known attack patterns. This detection is based on Microsoft's internal and external threat intelligence sources. |

### User-linked detections

#### Premium user risk detections

| Risk detection |  Detection type | Description |
| --- | --- | --- |
| Possible attempt to access Primary Refresh Token (PRT) | Offline | This risk detection type is detected by Microsoft Defender for Endpoint (MDE). A Primary Refresh Token (PRT) is a key artifact of Azure AD authentication on Windows 10, Windows Server 2016, and later versions, iOS, and Android devices. A PRT is a JSON Web Token (JWT) that's specially issued to Microsoft first-party token brokers to enable single sign-on (SSO) across the applications used on those devices. Attackers can attempt to access this resource to move laterally into an organization or perform credential theft. This detection will move users to high risk and will only fire in organizations that have deployed MDE. This detection is low-volume and will be seen infrequently by most organizations. However, when it does occur it's high risk and users should be remediated. |
| Anomalous user activity | Offline | This risk detection indicates that suspicious patterns of activity have been identified for an authenticated user. The post-authentication behavior of users is assessed for anomalies. This behavior is based on actions occurring for the account, along with any sign-in risk detected. |

#### Nonpremium user risk detections

| Risk detection |  Detection type | Description |
| --- | --- | --- |
| Additional risk detected | Real-time or Offline | This detection indicates that one of the premium detections was detected. Since the premium detections are visible only to Azure AD Premium P2 customers, they're titled "additional risk detected" for customers without Azure AD Premium P2 licenses. |
| Leaked credentials | Offline | This risk detection type indicates that the user's valid credentials have been leaked. When cybercriminals compromise valid passwords of legitimate users, they often share those credentials. This sharing is typically done by posting publicly on the dark web, paste sites, or by trading and selling the credentials on the black market. When the Microsoft leaked credentials service acquires user credentials from the dark web, paste sites, or other sources, they're checked against Azure AD users' current valid credentials to find valid matches. For more information about leaked credentials, see [Common questions](#common-questions). |
| Azure AD threat intelligence | Offline | This risk detection type indicates user activity that is unusual for the user or consistent with known attack patterns. This detection is based on Microsoft's internal and external threat intelligence sources. |

## Common questions

### Risk levels

Identity Protection categorizes risk into three tiers: low, medium, and high. When configuring [Identity protection policies](./concept-identity-protection-policies.md), you can also configure it to trigger upon **No risk** level. No Risk means there's no active indication that the user's identity has been compromised.

Microsoft doesn't provide specific details about how risk is calculated. Each level of risk brings higher confidence that the user or sign-in is compromised. For example, something like one instance of unfamiliar sign-in properties for a user might not be as threatening as leaked credentials for another user.

### Password hash synchronization

Risk detections like leaked credentials require the presence of password hashes for detection to occur. For more information about password hash synchronization, see the article, [Implement password hash synchronization with Azure AD Connect sync](../hybrid/how-to-connect-password-hash-synchronization.md).

### Why are there risk detections generated for disabled user accounts?
          
Disabled user accounts can be re-enabled. If the credentials of a disabled account are compromised, and the account gets re-enabled, bad actors might use those credentials to gain access. Identity Protection generates risk detections for suspicious activities against disabled user accounts to alert customers about potential account compromise. If an account is no longer in use and wont be re-enabled, customers should consider deleting it to prevent compromise. No risk detections are generated for deleted accounts.

### Leaked credentials

#### Where does Microsoft find leaked credentials?

Microsoft finds leaked credentials in various places, including:

- Public paste sites such as pastebin.com and paste.ca where bad actors typically post such material. This location is most bad actors' first stop on their hunt to find stolen credentials.
- Law enforcement agencies.
- Other groups at Microsoft doing dark web research.

#### Why am I not seeing any leaked credentials?

Leaked credentials are processed anytime Microsoft finds a new, publicly available batch. Because of the sensitive nature, the leaked credentials are deleted shortly after processing. Only new leaked credentials found after you enable password hash synchronization (PHS) will be processed against your tenant. Verifying against previously found credential pairs isn't done. 

#### I haven't seen any leaked credential risk events for quite some time?

If you haven't seen any leaked credential risk events, it is because of the following reasons:

- You don't have PHS enabled for your tenant.
- Microsoft has not found any leaked credential pairs that match your users.

#### How often does Microsoft process new credentials?

Credentials are processed immediately after they have been found, normally in multiple batches per day.

### Locations

Location in risk detections is determined by IP address lookup.

## Next steps

- [Policies available to mitigate risks](concept-identity-protection-policies.md)
- [Investigate risk](howto-identity-protection-investigate-risk.md)
- [Remediate and unblock users](howto-identity-protection-remediate-unblock.md)
- [Security overview](concept-identity-protection-security-overview.md)
