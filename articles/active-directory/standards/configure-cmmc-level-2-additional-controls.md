---
title: Configure identity access controls to meet CMMC Level 2
description: Learn how to configure Azure AD identities to meet CMMC Level 2 requirements.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 12/13/2022
ms.author: jricketts
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Configure Azure Active Directory to meet CMMC Level 2

Azure Active Directory helps meet identity-related practice requirements in each Cybersecurity Maturity Model Certification (CMMC) level. To be compliant with requirements in [CMMC V2.0 level 2](https://cmmc-coe.org/maturity-level-two/), it's the responsibility of companies performing work with, and on behalf of, the US Dept. of Defense (DoD) to complete other configurations or processes.

In CMMC Level 2, there are 13 domains that have one or more practices related to identity. The domains are:

* Access Control (AC)
* Audit & Accountability (AU)
* Configuration Management (CM)
* Identification & Authentication (IA)
* Incident Response (IR)
* Maintenance (MA)
* Media Protection (MP)
* Personnel Security (PS)
* Physical Protection (PE)
* Risk Assessment (RA)
* Security Assessment (CA)
* System and Communications Protection (SC)
* System and Information Integrity (SI)

The remainder of this article provides guidance for all of the domains except Access Control (AC) and Identification and Authentication (IA) which are covered in other articles. For each domain, there's a table with links to content that provides step-by-step guidance to accomplish the practice.

## Audit & Accountability

The following table provides a list of control IDs and associated customer responsibilities and guidance.

| *Control* | *Guidance* |
| - | - |
| AU.L2-3.3.1<br><br>AU.L2-3.3.2 | All operations are audited within the Azure AD audit logs. Each audit log entry contains a user’s immutable objectID that can be used to uniquely trace an individual system user to each action. You can collect and analyze logs by using a Security Information and Event Management (SIEM) solution such as Microsoft Sentinel. Alternatively, you can use Azure Event Hubs to integrate logs with third-party SIEM solutions to enable monitoring and notification.<br>[Audit activity reports in the Azure Active Directory portal](/azure/active-directory/reports-monitoring/concept-audit-logs.md)<br>[Connect Azure Active Directory data to Microsoft Sentinel](/azure/sentinel/connect-azure-active-directory)<br>[Tutorial: Stream logs to an Azure event hub](/azure/active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md) |
| AU.L2-3.3.4 | Azure Service Health notifies you about Azure service incidents so you can take action to mitigate downtime. Configure customizable cloud alerts for Azure Active Directory. <br>[What is Azure Service Health?](/azure/service-health/overview.md)<br>[Three ways to get notified about Azure service issues](https://azure.microsoft.com/blog/three-ways-to-get-notified-about-azure-service-issues/)<br>[Azure Service Health](https://azure.microsoft.com/get-started/azure-portal/service-health/) |
| AU.L2-3.3.6 | Ensure Azure AD events are included in event logging strategy. You can collect and analyze logs by using a Security Information and Event Management (SIEM) solution such as Microsoft Sentinel. Alternatively, you can use Azure Event Hubs to integrate logs with third-party SIEM solutions to enable monitoring and notification. Use Azure AD entitlement management with access reviews to ensure compliance status of accounts. <br>[Audit activity reports in the Azure Active Directory portal](/azure/active-directory/reports-monitoring/concept-audit-logs.md)<br>[Connect Azure Active Directory data to Microsoft Sentinel](/azure/sentinel/connect-azure-active-directory.md)<br>[Tutorial: Stream logs to an Azure event hub](/azure/active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md) |
| AU.L2-3.3.8<br><br>AU.L2-3.3.9 | Azure AD logs are retained by default for 30 days. These logs are unable to modified or deleted and are only accessible to limited set of privileged roles.<br>[Sign-in logs in Azure Active Directory](/azure/active-directory/reports-monitoring/concept-sign-ins.md)<br>[Audit logs in Azure Active Directory](/azure/active-directory/reports-monitoring/concept-audit-logs.md)

## Configuration Management (CM)

The following table provides a list of control IDs and associated customer responsibilities and guidance.

| *Control* | *Guidance* |
| - | - |
| CM.L2-3.4.2 | Adopt a zero-trust security posture. Use conditional access policies to restrict access to compliant devices. Configure policy settings on the device to enforce security configuration settings on the device with MDM solutions such as Microsoft Intune. Microsoft Endpoint Configuration Manager(MECM) or group policy objects can also be considered in hybrid deployments and combined with conditional access require hybrid Azure AD joined device.<br><br>**Zero-trust**<br>[Securing identity with Zero Trust](/security/zero-trust/identity.md)<br><br>**Conditional access**<br>[What is conditional access in Azure AD?](/azure/active-directory/conditional-access/overview.md)<br>[Grant controls in Conditional Access policy](/azure/active-directory/conditional-access/concept-conditional-access-grant.md)<br><br>**Device policies**<br>[What is Microsoft Intune?](/mem/intune/fundamentals/what-is-intune.md)<br>[What is Defender for Cloud Apps?](/cloud-app-security/what-is-cloud-app-security.md)<br>[What is app management in Microsoft Intune?](/mem/intune/apps/app-management.md)<br>[Microsoft Endpoint Manager overview](/mem/endpoint-manager-overview.md) |
| CM.L2-3.4.5 | Azure Active Directory (Azure AD) is a cloud-based identity and access management service. Customers don't have physical access to the Azure AD datacenters. As such, each physical access restriction above is satisfied by Microsoft and inherited by the customers of Azure AD. Implement Azure AD role based access controls. Eliminate standing privileged access, provide just in time access with approval workflows with Privileged Identity Management.<br>[Overview of Azure Active Directory role-based access control (RBAC)](/azure/active-directory/roles/custom-overview.md)<br>[What is Privileged Identity Management?](/azure/active-directory/privileged-identity-management/pim-configure.md)<br>[Approve or deny requests for Azure AD roles in PIM](/azure/active-directory/privileged-identity-management/azure-ad-pim-approval-workflow.md) |
| CM.L2-3.4.6 | Configure device management solutions (Such as Microsoft Intune) to implement a custom security baseline applied to organizational systems to remove non-essential applications and disable unnecessary services. Leave only the fewest capabilities necessary for the systems to operate effectively. Configure conditional access to restrict access to compliant or hybrid Azure AD joined devices. <br>[What is Microsoft Intune](/mem/intune/fundamentals/what-is-intune.md)<br>[Require device to be marked as compliant](../conditional-access/require-managed-devices.md)<br>[Grant controls in Conditional Access policy - Require hybrid Azure AD joined device](../conditional-access/concept-conditional-access-grant.md) |
| CM.L2-3.4.7 | Use Application Administrator role to delegate authorized use of essential applications. Use App Roles or group claims to manage least privilege access within application. Configure user consent to require admin approval and don't allow group owner consent. Configure Admin consent request workflows to enable users to request access to applications that require admin consent. Use Microsoft Defender for Cloud Apps to identify unsanctioned/unknown application use. Use this telemetry to then determine essential/non-essential apps.<br>[Azure AD built-in roles - Application Administrator](/azure/active-directory/roles/permissions-reference.md)<br>[Azure AD App Roles - App Roles vs. Groups ](/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps.md)<br>[Configure how users consent to applications](/azure/active-directory/manage-apps/configure-user-consent?tabs=azure-portal.md)<br>[Configure group owner consent to apps accessing group data](/azure/active-directory/manage-apps/configure-user-consent-groups?tabs=azure-portal.md)<br>[Configure the admin consent workflow](/azure/active-directory/manage-apps/configure-admin-consent-workflow.md)<br>[What is Defender for Cloud Apps?](/defender-cloud-apps/what-is-defender-for-cloud-apps.d)<br>[Discover and manage Shadow IT tutorial](/defender-cloud-apps/tutorial-shadow-it.md) |
| CM.L2-3.4.8 <br><br>CM.L2-3.4.9 | Configure MDM/configuration management policy to prevent the use of unauthorized software. Configure conditional access grant controls to require compliant or hybrid joined device to incorporate device compliance with MDM/configuration management policy into the conditional access authorization decision.<br>[What is Microsoft Intune](/mem/intune/fundamentals/what-is-intune.md)<br>[Conditional Access - Require compliant or hybrid joined devices](/azure/active-directory/conditional-access/howto-conditional-access-policy-compliant-device.md) |

## Incident Response (IR)

The following table provides a list of control IDs and associated customer responsibilities and guidance.

| *Control* | *Guidance* |
| - | - |
| IR.L2-3.6.1 | Implement incident handling and monitoring capabilities. The audit logs record all configuration changes. Authentication and authorization events are audited within the sign-in logs, and any detected risks are audited in the Identity Protection logs. You can stream each of these logs directly into a SIEM solution, such as Microsoft Sentinel. Alternatively, use Azure Event Hubs to integrate logs with third-party SIEM solutions.<br><br>**Audit events**<br>[Audit activity reports in the Azure Active Directory portal](/azure/active-directory/reports-monitoring/concept-audit-logs.md)<br>[Sign-in activity reports in the Azure Active Directory portal](/azure/active-directory/reports-monitoring/concept-sign-ins.md)<br>[How To: Investigate risk](/azure/active-directory/identity-protection/howto-identity-protection-investigate-risk.md)<br><br>**SIEM integrations**<br>[Microsoft Sentinel : Connect data from Azure Active Directory (Azure AD)](/azure/sentinel/connect-azure-active-directory.md)[Stream to Azure event hub and other SIEMs](/azure/active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md) |

## Maintenance (MA)

The following table provides a list of control IDs and associated customer responsibilities and guidance.

| *Control* | *Guidance* |
| - | - |
| MA.L2-3.7.5 | Accounts assigned administrative rights are targeted by attackers, including accounts used to establish non-local maintenance sessions. Requiring multifactor authentication (MFA) on those accounts is an easy way to reduce the risk of those accounts being compromised.<br>[Conditional Access - Require MFA for administrators](../conditional-access/howto-conditional-access-policy-admin-mfa.md) |
| MP.L2-3.8.7 | Configure device management policies via MDM (such as Microsoft Intune), Microsoft Endpoint Manager (MEM) or group policy objects (GPO) to control the use of removable media on systems. Deploy and manage Removable Storage Access Control using Intune or Group Policy. Configure Conditional Access policies to enforce device compliance.<br><br>**Conditional Access**<br>[Require device to be marked as compliant](/azure/active-directory/conditional-access/concept-conditional-access-grant#require-device-to-be-marked-as-compliant.md)<br>[Require hybrid Azure AD joined device](/conditional-access/concept-conditional-access-grant#require-hybrid-azure-ad-joined-device.md)<br><br>**Intune**<br>[Device compliance policies in Microsoft Intune](/mem/intune/protect/device-compliance-get-started.md)<br><br>**Removable storage access control**<br>[Deploy and manage Removable Storage Access Control using Intune](/microsoft-365/security/defender-endpoint/deploy-manage-removable-storage-intune?view=o365-worldwide&preserve-view=true)<br>[Deploy and manage Removable Storage Access Control using group policy](/microsoft-365/security/defender-endpoint/deploy-manage-removable-storage-group-policy?view=o365-worldwide&preserve-view=true) |

## Personnel Security (PS)

The following table provides a list of control IDs and associated customer responsibilities and guidance.

| *Control* | *Guidance* |
| - | - |
| PS.L2-3.9.2 | Configure provisioning (including disablement upon termination) of accounts in Azure AD from external HR systems, on-premises Active Directory, or directly in the cloud. Terminate all system access by revoking existing sessions.<br><br>**Account provisioning**<br>[What is identity provisioning with Azure AD?](/azure/active-directory/cloud-sync/what-is-provisioning.md)<br>[Azure AD Connect sync: Understand and customize synchronization](/azure/active-directory/hybrid/how-to-connect-sync-whatis.md)<br>[What is Azure AD Connect cloud sync?](/azure/active-directory/cloud-sync/what-is-cloud-sync.md)<br><br>**Revoke all associated authenticators**<br>[Revoke user access in an emergency in Azure Active Directory](/azure/active-directory/enterprise-users/users-revoke-access.md) |

## System and Communications Protection (SC)

The following table provides a list of control IDs and associated customer responsibilities and guidance.

| *Control* | *Guidance* |
| - | - |
| SC.L2-3.13.3 | Maintain separate user accounts in Azure Active Directory for everyday productivity use and administrative or system/privileged management. Privileged accounts should be cloud-only or managed accounts and not synchronized from on-premises to protect the cloud environment from on-premises compromise. System/privileged access should only be permitted from a security hardened privileged access workstation (PAW). Configure Conditional Access device filters to restrict access to administrative applications from PAWs that are enabled using Azure Virtual Desktops.<br>[Why are privileged access devices important](/security/compass/privileged-access-devices.md)<br>[Device Roles and Profiles](/security/compass/privileged-access-devices.md)<br>[Filter for devices as a condition in Conditional Access policy](../conditional-access/concept-condition-filters-for-devices.md)<br>[Azure Virtual Desktop](https://azure.microsoft.com/products/virtual-desktop/) |
| SC.L2-3.13.4 | Configure device management policies via MDM (such as Microsoft Intune), Microsoft Endpoint Manager (MEM) or group policy objects (GPO) to ensure devices are compliant with system hardening procedures. Include compliance with company policy regarding software patches to prevent attackers from exploiting flaws.<br><br>Configure Conditional Access policies to enforce device compliance.<br><br>**Conditional Access**<br>[Require device to be marked as compliant](/azure/active-directory/conditional-access/concept-conditional-access-grant.md)<br>[Require hybrid Azure AD joined device](/azure/active-directory/conditional-access/concept-conditional-access-grant.md)<br><br>**InTune**<br>[Device compliance policies in Microsoft Intune](/mem/intune/protect/device-compliance-get-started.md)<br><br>9-20 check split tunneling language. |
| SC.L2-3.13.13 | Configure device management policies via MDM (such as Microsoft Intune), Microsoft Endpoint Manager (MEM) or group policy objects (GPO) to disable the use of mobile code. Where use of mobile code is required monitor the use with endpoint security such as Microsoft Defender for Endpoint.<br><br>Configure Conditional Access policies to enforce device compliance.<br><br>**Conditional Access**<br>[Require device to be marked as compliant](/azure/active-directory/conditional-access/concept-conditional-access-grant.md)<br>[Require hybrid Azure AD joined device](/azure/active-directory/conditional-access/concept-conditional-access-grant.md)<br><br>**InTune**<br>[Device compliance policies in Microsoft Intune](/mem/intune/protect/device-compliance-get-started.md)<br><br>**Defender for Endpoint**<br>[Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint?view=o365-worldwide&preserve-view=true) |

## System and Information Integrity (SI)

The following table provides a list of control IDs and associated customer responsibilities and guidance.

| *Control* | *Guidance* |
| - | - |
| SI.L2-3.14.7 | Consolidate telemetry: Azure AD logs to stream to SIEM, such as Azure Sentinel Configure device management policies via MDM (such as Microsoft Intune), Microsoft Endpoint Manager (MEM), or group policy objects (GPO) to require Intrusion Detection/Protection (IDS/IPS) such as Microsoft Defender for Endpoint is installed and in use. Use telemetry provided by the IDS/IPS to identify unusual activities or conditions related to inbound and outbound communications traffic or unauthorized use.<br><br>Configure Conditional Access policies to enforce device compliance.<br><br>**Conditional Access**<br>[Require device to be marked as compliant](/azure/active-directory/conditional-access/concept-conditional-access-grant.md)<br>[Require hybrid Azure AD joined device](/azure/active-directory/conditional-access/concept-conditional-access-grant.md)<br><br>**InTune**<br>[Device compliance policies in Microsoft Intune](/mem/intune/protect/device-compliance-get-started.md)<br><br>**Defender for Endpoint**<br>[Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint?view=o365-worldwide&preserve-view=true) |

### Next steps

* [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)

* [Configure additional controls](configure-cmmc-level-2-additional-controls.md)

* [Conditional Access require managed device - Require Hybrid Azure AD joined device](../conditional-access/concept-conditional-access-grant.md)

* [Conditional Access require managed device - Require device to be marked as compliant](../conditional-access/require-managed-devices.md)

* [What is Microsoft Intune?](/mem/intune/fundamentals/what-is-intune)

* [Co-management for Windows 10 devices](/mem/configmgr/comanage/overview)
