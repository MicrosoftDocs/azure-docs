---
title: Protecting against OAuth consent phishing | Azure AD app management
description: Learn ways of mitigating against app-based consent phishing attacks using Azure AD.
services: active-directory
author: Chrispine-Chiedo
manager: CelesteDG

ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 08/09/2021
ms.custom: template-concept
ms.author: cchiedo
ms.reviewer: tilarso

#Customer intent: As a developer, I want to learn how to protect against app-based consent phishing attacks so I can protect my users from malicious threat actors.
---

# Protecting against OAuth consent phishing

Productivity is no longer confined to private networks, and work has shifted dramatically toward cloud services. While cloud applications enable employees to be productive remotely, attackers can also use application-based attacks to gain access to valuable organization data. You may be familiar with attacks focused on users, such as email phishing or credential compromise. ***Consent phishing*** is another threat vector to be aware of.
This article explores what consent phishing is, what Microsoft does to protect you, and what steps organizations can take to stay safe.

## What is consent phishing?

Consent phishing attacks trick users into granting permissions to malicious cloud apps. These malicious apps can then gain access to users’ legitimate cloud services and data. Unlike credential compromise, *threat actors* who perform consent phishing will target users who can grant access to their personal or organizational data directly. The consent screen displays all permissions the app receives. Because the application is hosted by a legitimate provider (such as Microsoft’s identity platform), unsuspecting users accept the terms or hit ‘*Accept*’, which grants a malicious application the requested permissions to the user’s or organization's data.

:::image type="content" source="./media/protect-consent-phishing/permissions-requested.png" alt-text="Screenshot showing permissions requested window requiring user consent.":::

*An example of an OAuth app that is requesting access to a wide variety of permissions.*

## Mitigating consent phishing attacks using Azure AD

Microsoft researchers can can flag OAuth applications that violate Microsoft's terms of service. OAuth applications flagged by Microsoft's researchers undergo a review process in order to validate the suspicious activity or reason the application was flagged. When such a violation is fully determined, Azure AD will disable the application and prevent further use across all Microsoft services.

When Azure AD disables an OAuth application, a few things happen:
- The malicious application and related service principals are placed into a fully disabled state. Any new token requests or requests for refresh tokens will be denied, but existing access tokens will still be valid until their expiration.
- We surface the disabled state through an exposed property called *disabledByMicrosoftStatus* on the related [application](/graph/api/resources/application?view=graph-rest-1.0) and [service principal](/graph/api/resources/serviceprincipal?view=graph-rest-1.0) resource types in Microsoft Graph.
- Global admins who may have had a user in their organization that consented to an application before disablement by Microsoft should receive an email reflecting the action taken and recommended steps they can take to investigate and improve their security posture.

## Recommended response and remediation

If your organization has been impacted by an application disabled by Microsoft, we recommend these immediate steps to keep your environment secure:

1. Investigate the application activity for the disabled application, including:
    - The delegated permissions or application permissions requested by the application.
    - The Azure AD audit logs for activity by the application and sign-in activity for users authorized to use the application.
1. Review and implement the [guidance on defending against illicit consent grants](/microsoft-365/security/office-365-security/detect-and-remediate-illicit-consent-grants?view=o365-worldwide) in Microsoft cloud products, including auditing permissions and consent for the disabled application or any other suspicious apps found during review.
1. Implement best practices for hardening against consent phishing, described below.


## Best practices for hardening against consent phishing attacks

At Microsoft, we want to put admins in control by providing the right insights and capabilities to control how applications are allowed and used within organizations. While attackers will never rest, there are steps organizations can take to improve their security posture. Some best practices to follow include:

* Educate your organization on how our permissions and consent framework works
    - Understand the data and the permissions an application is asking for and understand how [permissions and consent](../develop/v2-permissions-and-consent.md) work within our platform.
    - Ensure administrators know how to [manage and evaluate consent requests](./manage-consent-requests.md).
    - Routinely [audit apps and consented permissions](/azure/security/fundamentals/steps-secure-identity#audit-apps-and-consented-permissions) in your organization to ensure applications that are used are accessing only the data they need and adhering to the principles of least privilege.
* Know how to spot and block common consent phishing tactics
    - Check for poor spelling and grammar. If an email message or the application’s consent screen has spelling and grammatical errors, it’s likely a suspicious application.
    - Don’t rely on app names and domain URLs as a source of authenticity. Attackers like to spoof app names and domains that make it appear to come from a legitimate service or company to drive consent to a malicious app. Instead validate the source of the domain URL and use applications from [verified publishers](../develop/publisher-verification-overview.md) when possible.
    - Block [consent phishing emails with Microsoft Defender for Office 365](/microsoft-365/security/office-365-security/set-up-anti-phishing-policies?view=o365-worldwide#impersonation-settings-in-anti-phishing-policies-in-microsoft-defender-for-office-365) by protecting against phishing campaigns where an attacker is impersonating a known user in your organization.
    - Configure Microsoft cloud app security policies such as [activity policies](/cloud-app-security/user-activity-policies), [anomaly detection](/cloud-app-security/anomaly-detection-policy), and [OAuth app policies](/cloud-app-security/app-permission-policy) to help manage and take action on abnormal application activity in to your organization.
    - Investigate and hunt for consent phishing attacks by following the guidance on [advanced hunting with Microsoft 365 Defender](/microsoft-365/security/defender/advanced-hunting-overview?view=o365-worldwide).
* Allow access to apps you trust and protect against those you don’t trust
    - Use applications that have been publisher verified. [Publisher verification](../develop/publisher-verification-overview.md) helps admins and end users understand the authenticity of application developers through a Microsoft supported vetting process.
    - [Configure user consent settings](./configure-user-consent?tabs=azure-portal.md) to allow users to only consent to specific applications you trust, such as application developed by your organization or from verified publishers.
    - Create proactive [app governance](/microsoft-365/compliance/app-governance-manage-app-governance?view=o365-worldwide) policies to monitor third-party app behavior on the Microsoft 365 platform to address common suspicious app behaviors.


## Next steps

* [App consent grant investigation](/security/compass/incident-response-playbook-app-consent)
* [Managing access to apps](./what-is-access-management.md)
* [Restrict user consent operations in Azure AD](/azure/security/fundamentals/steps-secure-identity#restrict-user-consent-operations)
