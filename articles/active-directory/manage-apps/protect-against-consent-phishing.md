---
title: Protect against consent phishing
description: Learn ways of mitigating against application-based consent phishing attacks using Microsoft Entra ID.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 06/17/2022
ms.custom: template-concept, enterprise-apps-article
ms.author: jomondi
ms.reviewer: tilarso

#Customer intent: As a developer, I want to learn how to protect against application-based consent phishing attacks so I can protect my users from malicious threat actors.
---

# Protect against consent phishing

Productivity is no longer confined to private networks, and work has shifted dramatically toward cloud services. While cloud applications enable employees to be productive remotely, attackers can also use application-based attacks to gain access to valuable organization data. You may be familiar with attacks focused on users, such as email phishing or credential compromise. ***Consent phishing*** is another threat vector to be aware of.

This article explores what consent phishing is, what Microsoft does to protect an organization, and what steps organizations can take to stay safe.

## What is consent phishing?

Consent phishing attacks trick users into granting permissions to malicious cloud applications. These malicious applications can then gain access to legitimate cloud services and data of users. Unlike credential compromise, *threat actors* who perform consent phishing target users who can grant access to their personal or organizational data directly. The consent screen displays all permissions the application receives. Because the application is hosted by a legitimate provider (such as the Microsoft identity platform), unsuspecting users accept the terms, which grant a malicious application the requested permissions to the data. The following image shows an example of an OAuth app that is requesting access to a wide variety of permissions.

:::image type="content" source="./media/protect-consent-phishing/permissions-requested.png" alt-text="Screenshot showing permissions requested window requiring user consent.":::

## Mitigating consent phishing attacks

Administrators, users, or Microsoft security researchers may flag OAuth applications that appear to behave suspiciously. A flagged application is reviewed by Microsoft to determine whether it violates the terms of service. If a violation is confirmed, Microsoft Entra ID disables the application and prevents further use across all Microsoft services.

When Microsoft Entra ID disables an OAuth application, the following actions occur:

- The malicious application and related service principals are placed into a fully disabled state. Any new token requests or requests for refresh tokens are denied, but existing access tokens are still valid until their expiration.
- These applications will show `DisabledDueToViolationOfServicesAgreement` on the `disabledByMicrosoftStatus` property on the related [application](/graph/api/resources/application) and [service principal](/graph/api/resources/serviceprincipal) resource types in Microsoft Graph. To prevent them from being instantiated in your organization again in the future, you cannot delete these objects.
- An email is sent to a global administrator when a user in an organization consented to an application before it was disabled. The email specifies the action taken and recommended steps they can do to investigate and improve their security posture.

## Recommended response and remediation

If the organization has been impacted by an application disabled by Microsoft, the following immediate steps should be taken to keep the environment secure:

1. Investigate the application activity for the disabled application, including:
    - The delegated permissions or application permissions requested by the application.
    - The Microsoft Entra audit logs for activity by the application and sign-in activity for users authorized to use the application.
1. Review and use the [guidance for defending against illicit consent grants](/microsoft-365/security/office-365-security/detect-and-remediate-illicit-consent-grants). The guidance includes auditing permissions and consent for disabled and suspicious applications found during review.
1. Implement best practices for hardening against consent phishing, described below.

## Best practices for hardening against consent phishing attacks

Administrators should be in control of application use by providing the right insights and capabilities to control how applications are allowed and used within organizations. While attackers never rest, there are steps organizations can take to improve the security posture. Some best practices to follow include:

- Educate your organization on how our permissions and consent framework works:
  - Understand the data and the permissions an application is asking for and understand how [permissions and consent](../develop/permissions-consent-overview.md) works within the platform.
  - Make sure that administrators know how to [manage and evaluate consent requests](./manage-consent-requests.md).
  - Routinely [audit applications and consented permissions](/azure/security/fundamentals/steps-secure-identity#audit-apps-and-consented-permissions) in the organization to make sure that applications are accessing only the data they need and are adhering to the principles of least privilege.
- Know how to spot and block common consent phishing tactics:
  - Check for poor spelling and grammar. If an email message or the consent screen of the application has spelling and grammatical errors, it's likely a suspicious application. In that case, report it directly on the [consent prompt](../develop/application-consent-experience.md#building-blocks-of-the-consent-prompt) with the **Report it here** link and Microsoft will investigate if it's a malicious application and disable it, if confirmed.
  - Don't rely on application names and domain URLs as a source of authenticity. Attackers like to spoof application names and domains that make it appear to come from a legitimate service or company to drive consent to a malicious application. Instead, validate the source of the domain URL and use applications from [verified publishers](../develop/publisher-verification-overview.md) when possible.
  - Block [consent phishing emails with Microsoft Defender for Office 365](/microsoft-365/security/office-365-security/anti-phishing-policies-about#impersonation-settings-in-anti-phishing-policies-in-microsoft-defender-for-office-365) by protecting against phishing campaigns where an attacker is impersonating a known user in the organization.
  - Configure Microsoft Defender for Cloud Apps policies to help manage abnormal application activity in the organization. For example, [activity policies](/defender-cloud-apps/user-activity-policies), [anomaly detection](/defender-cloud-apps/anomaly-detection-policy), and [OAuth app policies](/defender-cloud-apps/app-permission-policy).
  - Investigate and hunt for consent phishing attacks by following the guidance on [advanced hunting with Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview).
- Allow access to trusted applications that meet certain criteria and protect against those applications that don't:
  - [Configure user consent settings](./configure-user-consent.md?tabs=azure-portal) to allow users to only consent to applications that meet certain criteria, such as applications developed by your organization or from verified publishers and only for low risk permissions you select.
  - Use applications that have been publisher verified. [Publisher verification](../develop/publisher-verification-overview.md) helps administrators and users understand the authenticity of application developers through a Microsoft supported vetting process. Even if an application does have a verified publisher, it is still important to review the consent prompt to understand and evaluate the request. For example, reviewing the permissions being requested to ensure they align with the scenario the app is requesting them to enable, additional app and publisher details on the consent prompt, etc.
  - Create proactive [application governance](/defender-cloud-apps/app-governance-manage-app-governance) policies to monitor third-party application behavior on the Microsoft 365 platform to address common suspicious application behaviors.

## Next steps

- [Application consent grant investigation](/security/operations/incident-response-playbook-app-consent)
- [Managing access to applications](./what-is-access-management.md)
- [Restrict user consent operations in Microsoft Entra ID](/azure/security/fundamentals/steps-secure-identity#restrict-user-consent-operations)
- [Compromised and malicious applications investigation](/security/operations/incident-response-playbook-compromised-malicious-app)
