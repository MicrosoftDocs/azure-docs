---
title: Microsoft Entra security operations guide
description: Learn to monitor, identify, and alert on security issues with accounts, applications, devices, and infrastructure in Microsoft Entra ID.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: overview
ms.date: 09/06/2022
ms.author: jricketts
ms.custom:
  - it-pro
  - seodec18
  - kr2b-contr-experiment
ms.collection: M365-identity-device-management
---

# Microsoft Entra security operations guide

Microsoft has a successful and proven approach to [Zero Trust security](https://aka.ms/Zero-Trust) using [Defense in Depth](https://www.cisa.gov/sites/default/files/recommended_practices/NCCIC_ICS-CERT_Defense_in_Depth_2016_S508C.pdf) principles that use identity as a control plane. Organizations continue to embrace a hybrid workload world for scale, cost savings, and security. Microsoft Entra ID plays a pivotal role in your strategy for identity management. Recently, news surrounding identity and security compromise has increasingly prompted enterprise IT to consider their identity security posture as a measurement of defensive security success.

Increasingly, organizations must embrace a mixture of on-premises and cloud applications, which users access with both on–premises and cloud-only accounts. Managing users, applications, and devices both on-premises and in the cloud poses challenging scenarios.

## Hybrid identity

Microsoft Entra ID creates a common user identity for authentication and authorization to all resources, regardless of location. We call this *hybrid identity*.

To achieve hybrid identity with Microsoft Entra ID, one of three authentication methods can be used, depending on your scenarios. The three methods are:

* [Password hash synchronization (PHS)](../hybrid/connect/whatis-phs.md)
* [Pass-through authentication (PTA)](../hybrid/connect/how-to-connect-pta.md)
* [Federation (AD FS)](../hybrid/connect/whatis-fed.md)

As you audit your current security operations or establish security operations for your Azure environment, we recommend you:

* Read specific portions of the Microsoft security guidance to establish a baseline of knowledge about securing your cloud-based or hybrid Azure environment.
* Audit your account and password strategy and authentication methods to help deter the most common attack vectors.
* Create a strategy for continuous monitoring and alerting on activities that might indicate a security threat.

### Audience

The Microsoft Entra SecOps Guide is intended for enterprise IT identity and security operations teams and managed service providers that need to counter threats through better identity security configuration and monitoring profiles. This guide is especially relevant for IT administrators and identity architects advising Security Operations Center (SOC) defensive and penetration testing teams to improve and maintain their identity security posture.

### Scope

This introduction provides the suggested prereading and password audit and strategy recommendations. This article also provides an overview of the tools available for hybrid Azure environments and fully cloud-based Azure environments. Finally, we provide a list of data sources you can use for monitoring and alerting and configuring your security information and event management (SIEM) strategy and environment. The rest of the guidance presents monitoring and alerting strategies in the following areas:

* [User accounts](security-operations-user-accounts.md). Guidance specific to non-privileged user accounts without administrative privilege, including anomalous account creation and usage, and unusual sign-ins.

* [Privileged accounts](security-operations-privileged-accounts.md). Guidance specific to privileged user accounts that have elevated permissions to perform administrative tasks. Tasks include Microsoft Entra role assignments, Azure resource role assignments, and access management for Azure resources and subscriptions.

* [Privileged Identity Management (PIM)](security-operations-privileged-identity-management.md). Guidance specific to using PIM to manage, control, and monitor access to resources.

* [Applications](security-operations-applications.md). Guidance specific to accounts used to provide authentication for applications.

* [Devices](security-operations-devices.md). Guidance specific to monitoring and alerting for devices registered or joined outside of policies, non-compliant usage, managing device administration roles, and sign-ins to virtual machines.

* [Infrastructure](security-operations-infrastructure.md). Guidance specific to monitoring and alerting on threats to your hybrid and purely cloud-based environments.

## Important reference content

Microsoft has many products and services that enable you to customize your IT environment to fit your needs. We recommend that you review the following guidance for your operating environment:

* Windows operating systems

  * [Windows 10 and Windows Server 2016 security auditing and monitoring reference](https://www.microsoft.com/download/details.aspx?id=52630)
  * [Security baseline (FINAL) for Windows 10 v1909 and Windows Server v1909](https://techcommunity.microsoft.com/t5/microsoft-security-baselines/security-baseline-final-for-windows-10-v1909-and-windows-server/ba-p/1023093)
  * [Security baseline for Windows 11](https://techcommunity.microsoft.com/t5/microsoft-security-baselines/windows-11-security-baseline/ba-p/2810772)
  * [Security baseline for Windows Server 2022](https://techcommunity.microsoft.com/t5/microsoft-security-baselines/windows-server-2022-security-baseline/ba-p/2724685)

* On-premises environments

  * [Microsoft Defender for Identity architecture](/defender-for-identity/architecture)
  * [Connect Microsoft Defender for Identity to Active Directory quickstart](/defender-for-identity/install-step2)
  * [Azure security baseline for Microsoft Defender for Identity](/defender-for-identity/security-baseline)
  * [Monitoring Active Directory for Signs of Compromise](/windows-server/identity/ad-ds/plan/security-best-practices/monitoring-active-directory-for-signs-of-compromise)

* Cloud-based Azure environments

  * [Monitor sign-ins with the Microsoft Entra sign-in log](../reports-monitoring/concept-all-sign-ins.md)
  * [Audit activity reports in the Azure portal](../reports-monitoring/concept-audit-logs.md)
  * [Investigate risk with Microsoft Entra ID Protection](../identity-protection/howto-identity-protection-investigate-risk.md) 
  * [Connect Microsoft Entra ID Protection data to Microsoft Sentinel](../../sentinel/data-connectors/azure-active-directory-identity-protection.md)

* Active Directory Domain Services (AD DS)

  * [Audit Policy Recommendations](/windows-server/identity/ad-ds/plan/security-best-practices/audit-policy-recommendations)

* Active Directory Federation Services (AD FS)

  * [AD FS Troubleshooting - Auditing Events and Logging](/windows-server/identity/ad-fs/troubleshooting/ad-fs-tshoot-logging)

## Data sources

The log files you use for investigation and monitoring are:

* [Microsoft Entra audit logs](../reports-monitoring/concept-audit-logs.md)
* [Sign-in logs](../reports-monitoring/concept-all-sign-ins.md)
* [Microsoft 365 Audit logs](/microsoft-365/compliance/auditing-solutions-overview)
* [Azure Key Vault logs](../../key-vault/general/logging.md?tabs=Vault)

From the Azure portal, you can view the Microsoft Entra audit logs. Download logs as comma separated value (CSV) or JavaScript Object Notation (JSON) files. The Azure portal has several ways to integrate Microsoft Entra logs with other tools that allow for greater automation of monitoring and alerting:

* **[Microsoft Sentinel](../../sentinel/overview.md)** - Enables intelligent security analytics at the enterprise level by providing security information and event management (SIEM) capabilities.

* **[Sigma rules](https://github.com/SigmaHQ/sigma/tree/master/rules/cloud/azure)** - Sigma is an evolving open standard for writing rules and templates that automated management tools can use to parse log files. Where Sigma templates exist for our recommended search criteria, we have added a link to the Sigma repo. The Sigma templates are not written, tested, and managed by Microsoft. Rather, the repo and templates are created and collected by the worldwide IT security community.

* **[Azure Monitor](../../azure-monitor/overview.md)** - Enables automated monitoring and alerting of various conditions. Can create or use workbooks to combine data from different sources.

* **[Azure Event Hubs](../../event-hubs/event-hubs-about.md)** integrated with a SIEM. Microsoft Entra logs can be integrated to other SIEMs such as Splunk, ArcSight, QRadar and Sumo Logic via the Azure Event Hubs integration. For more information, see [Stream Microsoft Entra logs to an Azure event hub](../reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md).

* **[Microsoft Defender for Cloud Apps](/cloud-app-security/what-is-cloud-app-security)** - Enables you to discover and manage apps, govern across apps and resources, and check the compliance of your cloud apps.

* **[Securing workload identities with Identity Protection Preview](../identity-protection/concept-workload-identity-risk.md)** - Used to detect risk on workload identities across sign-in behavior and offline indicators of compromise.

Much of what you will monitor and alert on are the effects of your Conditional Access policies. You can use the Conditional Access insights and reporting workbook to examine the effects of one or more Conditional Access policies on your sign-ins and the results of policies, including device state. This workbook enables you to view an impact summary, and identify the impact over a specific time period. You can also use the workbook to investigate the sign-ins of a specific user. For more information, see [Conditional Access insights and reporting](../conditional-access/howto-conditional-access-insights-reporting.md).

The remainder of this article describes what to monitor and alert on. Where there are specific pre-built solutions we link to them or provide samples following the table. Otherwise, you can build alerts using the preceding tools.

* **[Identity Protection](../identity-protection/overview-identity-protection.md)** generates three key reports that you can use to help with your investigation:

* **Risky users** contains information about which users are at risk, details about detections, history of all risky sign-ins, and risk history.

* **Risky sign-ins** contains information surrounding the circumstance of a sign-in that might indicate suspicious circumstances. For more information on investigating information from this report, see [How To: Investigate risk](../identity-protection/howto-identity-protection-investigate-risk.md).

* **Risk detections** contains information on risk signals detected by Microsoft Entra ID Protection that informs sign-in and user risk. For more information, see the [Microsoft Entra security operations guide for user accounts](security-operations-user-accounts.md).

For more information, see [What is Identity Protection](../identity-protection/overview-identity-protection.md).

### Data sources for domain controller monitoring

For the best results, we recommend that you monitor your domain controllers using Microsoft Defender for Identity. This approach enables the best detection and automation capabilities. Follow the guidance from these resources:

* [Microsoft Defender for Identity architecture](/defender-for-identity/architecture)
* [Connect Microsoft Defender for Identity to Active Directory quickstart](/defender-for-identity/install-step2)

If you don't plan to use Microsoft Defender for Identity, monitor your domain controllers by one of these approaches:

* Event log messages. See [Monitoring Active Directory for Signs of Compromise](/windows-server/identity/ad-ds/plan/security-best-practices/monitoring-active-directory-for-signs-of-compromise).
* PowerShell cmdlets. See [Troubleshooting Domain Controller Deployment](/windows-server/identity/ad-ds/deploy/troubleshooting-domain-controller-deployment).

## Components of hybrid authentication

As part of an Azure hybrid environment, the following items should be baselined and included in your monitoring and alerting strategy.

* **PTA Agent** - The pass-through authentication agent is used to enable pass-through authentication and is installed on-premises. See [Microsoft Entra pass-through authentication agent: Version release history](../hybrid/connect/reference-connect-pta-version-history.md) for information on verifying your agent version and next steps.

* **AD FS/WAP** - Active Directory Federation Services (Azure AD FS) and Web Application Proxy (WAP) enable secure sharing of digital identity and entitlement rights across your security and enterprise boundaries. For information on security best practices, see [Best practices for securing Active Directory Federation Services](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs).

* **Microsoft Entra Connect Health Agent** - The agent used to provide a communications link for Microsoft Entra Connect Health. For information on installing the agent, see [Microsoft Entra Connect Health agent installation](../hybrid/connect/how-to-connect-health-agent-install.md).

* **Microsoft Entra Connect Sync Engine** - The on-premises component, also called the sync engine. For information on the feature, see [Microsoft Entra Connect Sync service features](../hybrid/connect/how-to-connect-syncservice-features.md).

* **Password Protection DC agent** - Azure password protection DC agent is used to help with monitoring and reporting event log messages. For information, see [Enforce on-premises Microsoft Entra Password Protection for Active Directory Domain Services](../authentication/concept-password-ban-bad-on-premises.md).

* **Password Filter DLL** - The password filter DLL of the DC Agent receives user password-validation requests from the operating system. The filter forwards them to the DC Agent service that's running locally on the DC. For information on using the DLL, see [Enforce on-premises Microsoft Entra Password Protection for Active Directory Domain Services](../authentication/concept-password-ban-bad-on-premises.md).

* **Password writeback Agent** - Password writeback is a feature enabled with [Microsoft Entra Connect](../hybrid/whatis-hybrid-identity.md) that allows password changes in the cloud to be written back to an existing on-premises directory in real time. For more information on this feature, see [How does self-service password reset writeback work in Microsoft Entra ID](../authentication/concept-sspr-writeback.md).

* **Microsoft Entra application proxy Connector** - Lightweight agents that sit on-premises and facilitate the outbound connection to the Application Proxy service. For more information, see [Understand Azure ADF Application Proxy connectors](../app-proxy/application-proxy-connectors.md).

## Components of cloud-based authentication

As part of an Azure cloud-based environment, the following items should be baselined and included in your monitoring and alerting strategy.

* **Microsoft Entra application proxy** - This cloud service provides secure remote access to on-premises web applications. For more information, see [Remote access to on-premises applications through Microsoft Entra application proxy](../app-proxy/application-proxy-connectors.md).

* **Microsoft Entra Connect** - Services used for a Microsoft Entra Connect solution. For more information, see [What is Microsoft Entra Connect](../hybrid/connect/whatis-azure-ad-connect.md).

* **Microsoft Entra Connect Health** - Service Health provides you with a customizable dashboard that tracks the health of your Azure services in the regions where you use them. For more information, see [Microsoft Entra Connect Health](../hybrid/connect/whatis-azure-ad-connect.md).

* **Microsoft Entra multifactor authentication** - multifactor authentication requires a user to provide more than one form of proof for authentication. This approach can provide a proactive first step to securing your environment. For more information, see [Microsoft Entra multifactor authentication](../authentication/concept-mfa-howitworks.md).

* **Dynamic groups** - Dynamic configuration of security group membership for Microsoft Entra Administrators can set rules to populate groups that are created in Microsoft Entra ID based on user attributes. For more information, see [Dynamic groups and Microsoft Entra B2B collaboration](../external-identities/use-dynamic-groups.md).

* **Conditional Access** - Conditional Access is the tool used by Microsoft Entra ID to bring signals together, to make decisions, and enforce organizational policies. Conditional Access is at the heart of the new identity driven control plane. For more information, see [What is Conditional Access](../conditional-access/overview.md).

* **Identity Protection** - A tool that enables organizations to automate the detection and remediation of identity-based risks, investigate risks using data in the portal, and export risk detection data to your SIEM. For more information, see [What is Identity Protection](../identity-protection/overview-identity-protection.md).

* **Group-based licensing** - Licenses can be assigned to groups rather than directly to users. Microsoft Entra ID stores information about license assignment states for users.

* **Provisioning Service** - Provisioning refers to creating user identities and roles in the cloud applications that users need access to. In addition to creating user identities, automatic provisioning includes the maintenance and removal of user identities as status or roles change. For more information, see [How Application Provisioning works in Microsoft Entra ID](../app-provisioning/how-provisioning-works.md).

* **Graph API** - The Microsoft Graph API is a RESTful web API that enables you to access Microsoft Cloud service resources. After you register your app and get authentication tokens for a user or service, you can make requests to the Microsoft Graph API. For more information, see [Overview of Microsoft Graph](/graph/overview).

* **Domain Service** - Microsoft Entra Domain Services (AD DS) provides managed domain services such as domain join, group policy. For more information, see [What is Microsoft Entra Domain Services](../../active-directory-domain-services/overview.md).

* **Azure Resource Manager** - Azure Resource Manager is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure account. For more information, see [What is Azure Resource Manager](../../azure-resource-manager/management/overview.md).

* **Managed identity** - Managed identities eliminate the need for developers to manage credentials. Managed identities provide an identity for applications to use when connecting to resources that support Microsoft Entra authentication. For more information, see [What are managed identities for Azure resources](../managed-identities-azure-resources/overview.md).

* **Privileged Identity Management** - PIM is a service in Microsoft Entra ID that enables you to manage, control, and monitor access to important resources in your organization. For more information, see [What is Microsoft Entra Privileged Identity Management](../privileged-identity-management/pim-configure.md).

* **Access reviews** - Microsoft Entra access reviews enable organizations to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed regularly to make sure only the right people have continued access. For more information, see [What are Microsoft Entra access reviews](../governance/access-reviews-overview.md).

* **Entitlement management** - Microsoft Entra entitlement management is an [identity governance](../governance/identity-governance-overview.md) feature. Organizations can manage identity and access lifecycle at scale, by automating access request workflows, access assignments, reviews, and expiration. For more information, see [What is Microsoft Entra entitlement management](../governance/entitlement-management-overview.md).

* **Activity logs** - The Activity log is an Azure [platform log](../../azure-monitor/essentials/platform-logs-overview.md) that provides insight into subscription-level events. This log includes such information as when a resource is modified or when a virtual machine is started. For more information, see [Azure Activity log](../../azure-monitor/essentials/activity-log.md).

* **Self-service password reset service** - Microsoft Entra self-service password reset (SSPR) gives users the ability to change or reset their password. The administrator or help desk isn't required. For more information, see [How it works: Microsoft Entra self-service password reset](../authentication/concept-sspr-howitworks.md).

* **Device services** - Device identity management is the foundation for [device-based Conditional Access](../conditional-access/concept-conditional-access-grant.md). With device-based Conditional Access policies, you can ensure that access to resources in your environment is only possible with managed devices. For more information, see [What is a device identity](../devices/overview.md).

* **Self-service group management** - You can enable users to create and manage their own security groups or Microsoft 365 groups in Microsoft Entra ID. The owner of the group can approve or deny membership requests and can delegate control of group membership. Self-service group management features aren't available for mail-enabled security groups or distribution lists. For more information, see [Set up self-service group management in Microsoft Entra ID](../enterprise-users/groups-self-service-management.md).

* **Risk detections** - Contains information about other risks triggered when a risk is detected and other pertinent information such as sign-in location and any details from Microsoft Defender for Cloud Apps.

## Next steps

See these security operations guide articles:

[Security operations for user accounts](security-operations-user-accounts.md)

[Security operations for consumer accounts](security-operations-consumer-accounts.md)

[Security operations for privileged accounts](security-operations-privileged-accounts.md)

[Security operations for Privileged Identity Management](security-operations-privileged-identity-management.md)

[Security operations for applications](security-operations-applications.md)

[Security operations for devices](security-operations-devices.md)

[Security operations for infrastructure](security-operations-infrastructure.md)
