---
title: Securing workload identities with Azure AD Identity Protection
description: Workload identity risk in Azure Active Directory Identity Protection

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: conceptual
ms.date: 01/03/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: etbasser

ms.collection: M365-identity-device-management
---
# Securing workload identities with Identity Protection

Azure AD Identity Protection has historically protected users in detecting, investigating, and remediating identity-based risks. We're now extending these capabilities to workload identities to protect applications, service principals, and Managed Identities against such risks.

A workload identity is an identity that allows an application or service principal access to resources, sometimes in the context of a user. These workload identities differ from traditional user accounts as they:

- Often have no formal lifecycle process.
- Need to store their credentials or secrets somewhere.
- May use multiple identities.

These differences make workload identities harder to manage and puts them at higher risk for compromise.

> [!IMPORTANT]
> In public preview, you can secure workload identities with Identity Protection and Azure Active Directory Premium P2 edition active in your tenant. After general availability, additional licenses might be required.

## Prerequisites

To make use of workload identity risk, including the new **Risky workload identities (preview)** blade and the **Workload identity detections** tab in the **Risk detections** blade, in the Azure portal you must have the following.

- Azure AD Premium P2 licensing
- One of the following administrator roles assigned
   - Global administrator
   - Security administrator
   - Security operator
   - Security reader

Users assigned the Conditional Access administrator role can create policies that use risk as a condition.

## Workload identity risk detections

We detect risk on workload identities across sign-in behavior and offline indicators of compromise. 

| Detection name | Detection type | Description |
| --- | --- | --- |
| Azure AD threat intelligence | Offline | This risk detection indicates some activity that is consistent with known attack patterns based on Microsoft's internal and external threat intelligence sources. |
| Suspicious Sign-ins | Offline | This risk detection indicates sign-in properties or patterns that are unusual for this service principal. <br><br> The detection learns the baselines sign-in behavior for workload identities in your tenant in between 2 and 60 days, and fires if one or more of the following unfamiliar properties appear during a later sign-in: IP address / ASN, target resource, user agent, hosting/non-hosting IP change, IP country, credential type. <br><br> Due to the programmatic nature of workload identity sign-ins, we provide a timestamp for the suspicious activity instead of flagging a specific sign-in event. <br><br> We mark accounts at high risk when the Suspicious Sign-ins detection fires because this detection can indicate account takeover for the subject application. <br><br>  Legitimate changes to an application’s configuration sometimes trigger this detection. |
| Leaked Credentials | Offline | This risk detection indicates that the account's valid credentials have been leaked. This leak can occur when someone checks in the credentials in public code artifact on GitHub, or when the credentials are leaked through a data breach. <br><br> When the Microsoft leaked credentials service acquires credentials from GitHub, the dark web, paste sites, or other sources, they're checked against Azure AD identities’ current valid credentials to find valid matches. For more information about leaked credentials, see [Common questions](). |
| Admin confirmed account compromised | Offline | This detection indicates an admin has selected 'Confirm compromised' in the Risky Workload Identities UI or using riskyServicePrincipals API. To see which admin has confirmed this account compromised, check the account’s risk history (via UI or API). |

## Identify risky workload identities

Organizations can find workload identities that have been flagged for risk in one of two locations:

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Browse to **Azure Active Directory** > **Security** > **Risky workload identities (preview)**.
1. Or browse to **Azure Active Directory** > **Security** > **Risk detections**.
   1. Select the **Workload identity detections** tab.

:::image type="content" source="media/concept-workload-identity-risk/workload-identity-detections-in-risk-detections-report.png" alt-text="Screenshot showing risks detected against workload identities in the report." lightbox="media/concept-workload-identity-risk/workload-identity-detections-in-risk-detections-report.png":::

### Graph APIs

You can also query risky workload identities [using the Microsoft Graph API](/graph/use-the-api). There are two new collections in the [Identity Protection APIs](/graph/api/resources/identityprotection-root?view=graph-rest-beta) 

- riskyServicePrincipals
- servicePrincipalRiskDetections

## Investigate risky workload identities

Identity Protection provides organizations with two reports they can use to investigate workload identity risk. These reports are the risky workload identities, and risk detections for workload identities. All reports allow for downloading of events in .CSV format for further analysis outside of the Azure portal. 

Some of the key questions to answer during your investigation include:

1. Do accounts show suspicious sign-in activity?
1. Have there been unauthorized changes to the credentials?
1. Have there been suspicious configuration changes to accounts?
1. Did the account acquire unauthorized application roles?

Once you determine if the workload identity was compromised, dismiss the account’s risk or confirm the account as compromised in the Risky workload identities (preview) report. You can also select “Disable service principal” ID you want to block the account from further sign-ins.

:::image type="content" source="media/concept-workload-identity-risk/confirm-compromise-or-dismiss-risk.png" alt-text="Confirm workload identity compromise or dismiss the risk in the Azure portal." lightbox="media/concept-workload-identity-risk/confirm-compromise-or-dismiss-risk.png":::

## Remediate risky workload identities

1.	Inventory credentials assigned to the risky workload identity, whether for the service principal or application objects.
1. Add a new credential. Microsoft recommends using x509 certificates.
1. Remove the compromised credentials. If you believe the account is at risk, we recommend removing all existing credentials.
1.	Remediate any Azure KeyVault secrets that the Service Principal has access to by rotating them. 

The Azure AD Toolkit PowerShell module can help do some of these remediation actions.

## Configure a risk-based Conditional Access policy

Using [Conditional Access for workload identities](../conditional-access/workload-identity.md) you can block access for specific accounts you choose when Identity Protection marks them “at risk”. Policy can be applied to single tenant service principals that have been registered in your tenant. Third-party SaaS and multi-tenanted apps are out of scope. Managed identities aren't covered by policy.

## Simulating risk detections

Completing the following leaked credential detection simulation requires:

 - A public GitHub repository
 - A test application with no permissions and no roles assigned to it 

To simulate a leaked credential, do the following steps:

1.	Browse to **Azure AD** > **Enterprise Apps** > **your test app** > **Properties**. 
   1. Confirm the app’s service principal isn't enabled for sign-in. The radio button on “Enabled for users to sign-in?” should read “No.”
1.	Browse to **Azure AD** > **App Registrations** > **your test app** 
   1. Make note of the Application (client) ID and the Directory (tenant) ID. 
   1. Browse to **Certificates and Secrets** > **New client secret** to add a test secret to the application. Make note the secret value.
1.	Browse to GitHub and create a public repository. 
1.	Commit the three values above in the following format:

      ```text
      "AadClientId": "[guid]",
      "AadSecret": "[secret]",
      "AadTenantId": "[guid]",
      ```

1.	The detection should appear in Identity Protection within 48 hours.


## Next steps

- [Conditional Access for workload identities](../conditional-access/workload-identity.md)

- [Microsoft Graph API](/graph/use-the-api)

- [Azure AD audit logs](../reports-monitoring/concept-audit-logs.md)

- [Azure AD sign-in logs](../reports-monitoring/concept-sign-ins.md)
