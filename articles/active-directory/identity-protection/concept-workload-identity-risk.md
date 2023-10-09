---
title: Securing workload identities with Microsoft Entra ID Protection
description: Workload identity risk in Microsoft Entra ID Protection

services: active-directory
ms.service: active-directory
ms.subservice: workload-identities
ms.topic: conceptual
ms.date: 11/10/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: etbasser

ms.collection: M365-identity-device-management
---
# Securing workload identities

Microsoft Entra ID Protection has historically protected users in detecting, investigating, and remediating identity-based risks. We're now extending these capabilities to workload identities to protect applications and service principals.

A [workload identity](../workload-identities/workload-identities-overview.md) is an identity that allows an application or service principal access to resources, sometimes in the context of a user. These workload identities differ from traditional user accounts as they:

- Can’t perform multifactor authentication.
- Often have no formal lifecycle process.
- Need to store their credentials or secrets somewhere.

These differences make workload identities harder to manage and put them at higher risk for compromise.

> [!IMPORTANT]
> Detections are visible only to [Workload Identities Premium](https://www.microsoft.com/security/business/identity-access/microsoft-entra-workload-identities#office-StandaloneSKU-k3hubfz) customers. Customers without Workload Identities Premium licenses still receive all detections but the reporting of details is limited. 

> [!NOTE]
> Identity Protection detects risk on single tenant, third party SaaS, and multi-tenant apps. Managed Identities are not currently in scope. 

## Prerequisites

To make use of workload identity risk, including the new **Risky workload identities** blade and the **Workload identity detections** tab in the **Risk detections** blade in the portal, you must have the following.

- Workload Identities Premium licensing: You can view and acquire licenses on the [Workload Identities blade](https://portal.azure.com/#view/Microsoft_Azure_ManagedServiceIdentity/WorkloadIdentitiesBlade).
- One of the following administrator roles assigned
   - Security Administrator
   - Security Operator
   - Security Reader Users assigned the Conditional Access administrator role can create policies that use risk as a condition.
   - Global Administrator

## Workload identity risk detections

We detect risk on workload identities across sign-in behavior and offline indicators of compromise. 

| Detection name | Detection type | Description |
| --- | --- | --- |
| Microsoft Entra threat intelligence | Offline | This risk detection indicates some activity that is consistent with known attack patterns based on Microsoft's internal and external threat intelligence sources. |
| Suspicious Sign-ins | Offline | This risk detection indicates sign-in properties or patterns that are unusual for this service principal. <br><br> The detection learns the baselines sign-in behavior for workload identities in your tenant in between 2 and 60 days, and fires if one or more of the following unfamiliar properties appear during a later sign-in: IP address / ASN, target resource, user agent, hosting/non-hosting IP change, IP country, credential type. <br><br> Because of the programmatic nature of workload identity sign-ins, we provide a timestamp for the suspicious activity instead of flagging a specific sign-in event. <br><br>  Sign-ins that are initiated after an authorized configuration change may trigger this detection. |
| Admin confirmed service principal compromised | Offline | This detection indicates an admin has selected 'Confirm compromised' in the Risky Workload Identities UI or using riskyServicePrincipals API. To see which admin has confirmed this account compromised, check the account’s risk history (via UI or API). |
| Leaked Credentials | Offline | This risk detection indicates that the account's valid credentials have been leaked. This leak can occur when someone checks in the credentials in public code artifact on GitHub, or when the credentials are leaked through a data breach. <br><br> When the Microsoft leaked credentials service acquires credentials from GitHub, the dark web, paste sites, or other sources, they're checked against current valid credentials in Microsoft Entra ID to find valid matches. |
| Malicious application | Offline | This detection combines alerts from Identity Protection and Microsoft Defender for Cloud Apps to indicate when Microsoft has disabled an application for violating our terms of service. We recommend [conducting an investigation](https://go.microsoft.com/fwlink/?linkid=2208429) of the application. Note: These applications will show `DisabledDueToViolationOfServicesAgreement` on the `disabledByMicrosoftStatus` property on the related [application](/graph/api/resources/application) and [service principal](/graph/api/resources/serviceprincipal) resource types in Microsoft Graph. To prevent them from being instantiated in your organization again in the future, you cannot delete these objects. |
| Suspicious application | Offline | This detection indicates that Identity Protection or Microsoft Defender for Cloud Apps have identified an application that may be violating our terms of service but hasn't disabled it. We recommend [conducting an investigation](https://go.microsoft.com/fwlink/?linkid=2208429) of the application.|
| Anomalous service principal activity | Offline | This risk detection baselines normal administrative service principal behavior in Microsoft Entra ID, and spots anomalous patterns of behavior like suspicious changes to the directory. The detection is triggered against the administrative service principal making the change or the object that was changed. |

## Identify risky workload identities

Organizations can find workload identities that have been flagged for risk in one of two locations:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Security Reader](../roles/permissions-reference.md#security-reader).
1. Browse to **Protection** > **Identity Protection** > **Risky workload identities**.
   
:::image type="content" source="media/concept-workload-identity-risk/workload-identity-detections-in-risk-detections-report.png" alt-text="Screenshot showing risks detected against workload identities in the report." lightbox="media/concept-workload-identity-risk/workload-identity-detections-in-risk-detections-report.png":::

### Microsoft Graph APIs

You can also query risky workload identities [using the Microsoft Graph API](/graph/use-the-api). There are two new collections in the [Identity Protection APIs](/graph/api/resources/identityprotection-root). 

- `riskyServicePrincipals`
- `servicePrincipalRiskDetections`

### Export risk data 

Organizations can export data by configurating [diagnostic settings in Microsoft Entra ID](howto-export-risk-data.md) to send risk data to a Log Analytics workspace, archive it to a storage account, stream it to an event hub, or send it to a SIEM solution. 

## Enforce access controls with risk-based Conditional Access

Using [Conditional Access for workload identities](../conditional-access/workload-identity.md), you can block access for specific accounts you choose when Identity Protection marks them "at risk." Policy can be applied to single-tenant service principals that have been registered in your tenant. Third-party SaaS, multi-tenanted apps, and managed identities are out of scope.

For improved security and resilience of your workload identities, Continuous Access Evaluation (CAE) for workload identities is a powerful tool that offers instant enforcement of your Conditional Access policies and any detected risk signals. CAE-enabled third party workload identities accessing CAE-capable first party resources are equipped with 24 hour Long Lived Tokens (LLT's) that are subject to continuous security checks. Refer to the [CAE for workload identities documentation](../conditional-access/concept-continuous-access-evaluation-workload.md) for information on configuring workload identity clients for CAE and up to date feature scope. 

## Investigate risky workload identities

Identity Protection provides organizations with two reports they can use to investigate workload identity risk. These reports are the risky workload identities, and risk detections for workload identities. All reports allow for downloading of events in .CSV format for further analysis. 

Some of the key questions to answer during your investigation include:

- Do accounts show suspicious sign-in activity?
- Have there been unauthorized changes to the credentials?
- Have there been suspicious configuration changes to accounts?
- Did the account acquire unauthorized application roles?

The [Microsoft Entra security operations guide for Applications](../architecture/security-operations-applications.md) provides detailed guidance on the above investigation areas.

Once you determine if the workload identity was compromised, dismiss the account’s risk, or confirm the account as compromised in the Risky workload identities report. You can also select “Disable service principal” if you want to block the account from further sign-ins.

:::image type="content" source="media/concept-workload-identity-risk/confirm-compromise-or-dismiss-risk.png" alt-text="Confirm workload identity compromise or dismiss the risk." lightbox="media/concept-workload-identity-risk/confirm-compromise-or-dismiss-risk.png":::

## Remediate risky workload identities

1. Inventory credentials assigned to the risky workload identity, whether for the service principal or application objects.
1. Add a new credential. Microsoft recommends using x509 certificates.
1. Remove the compromised credentials. If you believe the account is at risk, we recommend removing all existing credentials.
1. Remediate any Azure KeyVault secrets that the Service Principal has access to by rotating them. 

The [Microsoft Entra Toolkit](https://github.com/microsoft/AzureADToolkit) is a PowerShell module that can help you perform some of these actions.

## Next steps

- [Conditional Access for workload identities](../conditional-access/workload-identity.md)
- [Microsoft Graph API](/graph/use-the-api)
- [Microsoft Entra audit logs](../reports-monitoring/concept-audit-logs.md)
- [Microsoft Entra sign-in logs](../reports-monitoring/concept-sign-ins.md)
- [Simulate risk detections](howto-identity-protection-simulate-risk.md)
