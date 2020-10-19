---
title: Azure security baseline for Azure Data Box
description: Azure security baseline for Azure Data Box
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 06/22/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Data Box

The Azure Security Baseline for Azure Data Box contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview.md), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see the [Azure security baselines overview](../security/benchmarks/security-baselines-overview.md).

## Network security

*For more information, see [Security control: Network security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Not applicable; your Azure Data Box cannot be associated with a virtual network. You control traffic from the Data Box to Azure-hosted storage via the Azure portal. When you leverage Data Box, data is transferred over the Azure backbone.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

**Guidance**: Not applicable; your Azure Data Box cannot be associated with a virtual network. You control traffic from the Data Box to Azure-hosted storage via the Azure portal. When you leverage Data Box, data is transferred over the Azure backbone.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.3: Protect critical web applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Not applicable; your Azure Data Box cannot be associated with a virtual network. You control traffic from the Data Box to Azure-hosted storage via the Azure portal. When you leverage Data Box, data is transferred over the Azure backbone.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.5: Record network packets

**Guidance**: Not applicable; your Azure Data Box cannot be associated with a virtual network. You control traffic from the Data Box to Azure-hosted storage via the Azure portal. When you leverage Data Box, data is transferred over the Azure backbone.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Guidance: The endpoints used by Azure Data Box are all managed by Microsoft. You are responsible for any additional controls you wish to deploy to your on-premises systems.

* [Understand Azure Data Box security](./data-box-security.md)

* [Port information for Azure Data Box](./data-box-system-requirements.md#port-requirements)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 1.7: Manage traffic to web applications

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Not applicable; your Azure Data Box cannot be associated with a virtual network.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Not applicable; your Azure Data Box cannot be associated with a virtual network.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.10: Document traffic configuration rules

**Guidance**: Not applicable; your Azure Data Box cannot be associated with a virtual network.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Not applicable; your Azure Data Box cannot be associated with a virtual network.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains the time source used for Azure resources, for example, for timestamps in the logs. Azure Data Box time could drift if it is not connected to the network that can access the NTP server at the customer site.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.2: Configure central security log management

**Guidance**: Corresponding to each step in your Data Box order, you can take multiple actions to control the access to the order, audit the events, track the order, and interpret the various logs that are generated.

* [Understand tracking and event logging for your Azure Data Box](./data-box-logs.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Corresponding to each step in your Data Box order, you can take multiple actions to control the access to the order, audit the events, track the order, and interpret the various logs that are generated.

* [Understand tracking and event logging for your Azure Data Box](./data-box-logs.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: This recommendation is intended for compute resources. Data Box has audit logs and Support package that contain Security logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 2.5: Configure security log storage retention

**Guidance**: Not applicable

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.6: Monitor and review Logs

**Guidance**: Corresponding to each step in your Data Box order, you can take multiple actions to control the access to the order, audit the events, track the order, and interpret the various logs that are generated.

* [Understand tracking and event logging for your Azure Data Box](./data-box-logs.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

**Guidance**: Corresponding to each step in your Data Box order, you can take multiple actions to control the access to the order, audit the events, track the order, and interpret the various logs that are generated.

* [Understand tracking and event logging for your Azure Data Box](./data-box-logs.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Not applicable; Azure Data Box does not process or produce anti-malware related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

**Guidance**: Not applicable; Azure Data Box does not process or produce DNS-related logs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and access control

*For more information, see [Security control: Identity and access control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Maintain an inventory of the user accounts that have administrative access to your Azure Data Box. You can use the Identity and Access control (IAM) pane in the Azure portal for your subscription to configure Azure role-based access control (Azure RBAC). The roles are applied to users, groups, service principals, and managed identities in Active Directory.You can control who can access your order when the order is first created. Set up Azure roles at various scopes to control the access to the Data Box order. An Azure role determines the type of access – read-write, read-only, read-write to a subset of operations.

* [Understand custom roles](../role-based-access-control/custom-roles.md)

* [How to configure Azure RBAC for workbooks](../sentinel/quickstart-get-visibility.md)

* [Understand how to set up access control on the order](./data-box-logs.md#set-up-access-control-on-the-order)

**Azure Security Center monitoring**: No

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: Azure AD does not have the concept of default passwords. Other Azure resources requiring a password forces a password to be created with complexity requirements and a minimum password length, which differs depending on the service. You are responsible for third-party applications and marketplace services that may use default passwords.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

Additionally, to help you keep track of dedicated administrative accounts, you may use recommendations from Azure Security Center or built-in Azure Policies, such as:
- There should be more than one owner assigned to your subscription
- Deprecated accounts with owner permissions should be removed from your subscription
- External accounts with owner permissions should be removed from your subscription

* [How to use Azure Security Center to monitor identity and access (Preview)](../security-center/security-center-identity-access.md)

* [How to use Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Not applicable; access to your Data Box order is through the Azure portal and reserved for accounts with the tenant role of owner or contributor.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Not applicable

**Azure Security Center monitoring**: No

**Responsibility**: Not applicable

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use a Privileged Access Workstation (PAW) with Azure Multi-Factor Authentication (MFA) enabled to log into and configure your Azure Data Box orders.

* [Privileged Access Workstations](/windows-server/identity/securing-privileged-access/privileged-access-workstations)

* [Planning a cloud-based Azure Multi-Factor Authentication deployment](../active-directory/authentication/howto-mfa-getstarted.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Not applicable, Azure Data Box does not have its own administrative account. You access it through the Azure portal. However, you can configure your Azure subscription to use Azure Active Directory (AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

* [How to deploy Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

* [Understand Azure AD risk detections](../active-directory/identity-protection/overview-identity-protection.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access to the Azure portal from only specific logical groupings of IP address ranges or countries/regions.

* [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system where applicable. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

* [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (AD) provides logs to help you discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

For the Data Box appliance, this is not supported in real time. You can review the logs at the end of the job.

* [Understand Azure AD reporting](../active-directory/reports-monitoring/index.yml)

* [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Use Azure Active Directory (AD) as the central authentication and authorization system where applicable. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

You have access to Azure AD sign-in activity, audit and risk event log sources, which allow you to integrate with Azure Sentinel or a third-party SIEM.

You can streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics workspace. You can configure desired log alerts within Log Analytics.

Azure Data Box service logs are not written into Log Analytics workspace.

* [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

* [How to on-board Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: For account login behavior deviation on the control plane (e.g. Azure portal), use Azure AD Identity Protection and risk detection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

* [How to view Azure AD risky sign-in](../active-directory/identity-protection/overview-identity-protection.md)

* [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

* [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Customer Lockbox is not currently supported for Azure Data Box.

* [List of Customer Lockbox-supported services](../security/fundamentals/customer-lockbox-overview.md#supported-services-and-scenarios-in-general-availability)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Not applicable for Azure Data Box.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Azure Data Box will be provisioned in the subscription where the resources that you are giving access to reside. There is no public endpoint to protect or isolate. Data Box access is available to users with owner or contributor access to the subscription.

During the data upload to Azure, the Data Box appliance and the service used to upload the data are isolated.

* [How to get started with Azure Data Box](./data-box-quickstart-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Microsoft manages the underlying infrastructure for Azure Data Box and has implemented strict controls to prevent the loss or exposure of customer data. When Data Box is at the customer site, follow best practices to ensure that sensitive data being transferred is protected.

* [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Microsoft manages the underlying infrastructure for Azure Data Box and has implemented strict controls to prevent the loss or exposure of customer data. When Data Box is at the customer site, follow best practices to ensure that sensitive data being transferred is protected.

* [Understand data migration in Azure Data Box](./data-box-faq.md)

* [Data Box security overview](./data-box-security.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Currently not available; data identification, classification, and loss prevention features are not yet available for Azure Data Box.Microsoft manages the underlying infrastructure for Azure Data Box and has implemented strict controls to prevent the loss or exposure of customer data.

* [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Not applicable

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: Ensure that you have owner or contributor access to the subscription to create a Data Box order. You can also define Data Box Reader and Data Box Contributor roles at the resource level.

* [Understand how to get started with Azure Data Box](./data-box-quickstart-portal.md)

* [Understand how to set up access control](./data-box-logs.md#set-up-access-control-on-the-order)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; this recommendation is intended for compute resources. Microsoft manages the underlying infrastructure for Azure Data Box and has implemented strict controls to prevent the loss or exposure of customer data.

* [Azure customer data protection](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.8: Encrypt sensitive information at rest

**Guidance**: Azure Data Box implements AES 256-bit encryption for Data-at-rest.

Azure Data Box implements AES 256-bit encryption for Data-at-rest.Additionally, Azure Data Box protects the device unlock key (also known as device password) that is used to lock the device via an encryption key. By default, device unlock key for a Data Box order is encrypted with a Microsoft managed key. For additional control over device unlock key, you can also provide a customer-managed key. Customer-managed keys must be created and stored in an Azure Key Vault.

* [Understand Data Box data protection](./data-box-security.md)

* [Use customer-managed keys in Azure Key Vault for Azure Data Box](./data-box-customer-managed-encryption-key-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity log to create alerts for when changes take place to Azure Data Box as well as other critical or related resources.

* [How to create alerts for Azure Activity Log events](../azure-monitor/platform/alerts-activity-log.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Azure Data Box.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.2: Deploy automated operating system patch management solution

**Guidance**: When Data Box is shipped, it is installed with the latest updates. We do not perform field updates.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.3: Deploy automated patch management solution for third-party software titles

**Guidance**: When Data Box is shipped, it is installed with the latest updates. We do not perform field updates.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Azure Data Box.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Microsoft performs vulnerability management on the underlying systems that support Azure Data Box.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated Asset Discovery solution

**Guidance**: Not applicable, there are no Data Box assets to discover.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.2: Maintain asset metadata

**Guidance**: Not applicable, there is no asset metadata for Data Box.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.3: Delete unauthorized Azure resources

**Guidance**: Not applicable, Data Box service ensures that no unauthorized Azure resources are used.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 6.4: Define and Maintain an inventory of approved Azure resources

**Guidance**: Not applicable; there are none at the Data Box service level.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Not applicable, there are none at the Data Box service level.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Not applicable, there are none at the Data Box service level.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Not applicable, there are none at the Data Box service level.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.8: Use only approved applications

**Guidance**: Not applicable, there are none at the Data Box service level.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.9: Use only approved Azure services

**Guidance**: Not applicable, Data Box services uses only approved Azure services.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Not applicable; Data Box services only uses approved software titles.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

* [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Not applicable; Data Box service does not support executing scripts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Not applicable; Data Box service does not have web applications running on Azure App service.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Secure configuration

*For more information, see [Security control: Secure configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Azure Data Box comes with pre-configured best practices security settings.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 7.2: Establish secure operating system configurations

**Guidance**: Azure Data Box comes with pre-configured best practices security settings.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Azure Data Box comes with pre-configured best practices security settings for resources and can’t be changed.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 7.4: Maintain secure operating system configurations

**Guidance**: Azure Data Box comes with pre-configured best practices security settings for resources and can’t be changed.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

**Guidance**: All Data Box configurations are securely stored.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 7.6: Securely store custom operating system images

**Guidance**: All Data Box operating system images are securely stored.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Not applicable, Azure Data Box configurations can’t be changed.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Not applicable, Azure Data Box configurations can’t be changed.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Not applicable, Azure Data Box configurations can’t be changed.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Not applicable, Azure Data Box configurations can’t be changed.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

**Guidance**: Customer-managed keys must be created and stored in an Azure Key Vault.

* [How to use customer-managed keys in Azure Key Vault for Azure Data Box](./data-box-customer-managed-encryption-key-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 7.12: Manage identities securely and automatically

**Guidance**: Not applicable; Azure Data Box does not make use of managed identities.

* [Azure services that support managed identities](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.13: Eliminate unintended credential exposure

**Guidance**: Microsoft runs credential scanner on Data Box code. Additionally, Microsoft also securely protects credentials. Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

* [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: N/A

**Responsibility**: Shared

## Malware defense

*For more information, see [Security control: Malware defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: Not applicable; this guideline is intended for compute resources. Microsoft Anti-malware is enabled on the underlying host that supports Azure services (for example, Azure App Service), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft Anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Customer Lockbox), however it does not run on customer content.

It is your responsibility to pre-scan any content being uploaded to non-compute Azure resources. Microsoft cannot access customer data, and therefore cannot conduct anti-malware scans of customer content on your behalf.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this recommendation is intended for compute resources. Microsoft Antimalware is enabled on the underlying host that supports Azure services, however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data recovery

*For more information, see [Security control: Data recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back ups

**Guidance**: Not applicable, Data Box service does not require backups.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Make sure to back up any data and the customer-managed key. Data Box does not make any backups.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer-managed keys

**Guidance**: You should verify that all your data is in Azure Storage account before you delete it from your premises.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Make sure that any backups or customer-managed keys you have are protected in accordance with best practices.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

* [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

* [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

* [Leverage NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) using tags and create a naming system to clearly identify and categorize Azure resources, especially those processing sensitive data. It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

* [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

* [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence to help protect your Azure resources. Identify weak points and gaps and revise plan as needed.

* [NIST's publication - Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://csrc.nist.gov/publications/detail/sp/800-84/final)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

* [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

* [How to configure continuous export](../security-center/continuous-export.md)

* [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations to protect your Azure resources.

* [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Microsoft does penetration testing and vulnerability scanning on Data Box devices. You can do your own penetration testing and vulnerability scan. If you choose to do so, follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

* [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

* [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)