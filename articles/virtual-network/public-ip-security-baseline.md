---
title: Azure security baseline for Azure Public IP
description: The Azure Public IP security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: virtual-network
ms.topic: conceptual
ms.date: 09/11/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Public IP

This security baseline applies guidance from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview.md) to Azure Public IP. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Public IP. **Controls** not applicable to Azure Public IP have been excluded.  Note Azure Public IPs do not store customer data.

To see how Azure Public IP completely maps to the Azure Security Benchmark, see the [full Azure Public IP security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network security

*For more information, see the [Azure Security Benchmark: Network security](../security/benchmarks/security-control-network-security.md).*

### 1.10: Document traffic configuration rules

**Guidance**: Azure Public IPs can be assigned tags. Use resource tags for network security groups and other resources related to network security.  Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" that ensure that all resources are created with tags and to notify you of existing untagged resources.  

Azure PowerShell or Azure CLI can be used to look up or perform actions on resources based on their tags. 

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags) 

- [How to create an Azure Virtual Network](quick-create-portal.md) 

- [How to filter network traffic with network security group rules](tutorial-filter-network-traffic.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and monitoring

*For more information, see the [Azure Security Benchmark: Logging and monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.2: Configure central security log management

**Guidance**: Use Azure Activity Log to monitor configurations and detect changes to your Public IP instances. Other than at the control plane (for example, Azure portal), Public IP itself does not generate logs related to network traffic.

Public IP provides tools to monitor, diagnose, view metrics, and enable or disable logs for resources in an Azure virtual network.

Instead, you can enable and on-board data to Azure Sentinel or a third-party SIEM.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/platform/diagnostic-settings.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Use Azure Activity Log to monitor configurations and detect changes for your Public IP instances. Other than at the control plane (for example, Azure portal), Public IP itself does not generate audit logs. Public IP provides tools to monitor, diagnose, view metrics, and enable or disable logs for resources in an Azure virtual network.

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log-view)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.5: Configure security log storage retention

**Guidance**: Use Azure Monitor to set log retention period for the Log Analytics workspaces associated with Public IP instances per your organization's compliance obligations.

- [How to set log retention parameters](../azure-monitor/platform/manage-cost-storage.md#change-the-data-retention-period)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: Public IP provides tools to monitor, diagnose, view metrics, and enable or disable logs for resources in an Azure virtual network. 

Use Azure Activity Log to monitor configurations and detect changes for your Public IP instances. 

Public IP itself does not generate logs related to network traffic other than at the control plane (for example, Azure portal).

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log-view)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

**Guidance**: Configure your alerts based on activity logs related to Public IP. Use Azure Monitor to configure an alert to send an email notification, call a webhook, or invoke an Azure Logic App.

- [How to manage alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Identity and access control

*For more information, see the [Azure Security Benchmark: Identity and access control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: 
Use Azure role-based access control (Azure RBAC) to manage access to Azure resources like Public IP instances with role assignments. Assign these roles to users, groups, service principals, and managed identities. 

Inventoried or query pre-defined Azure built-in roles exist for certain resources through tools such as Azure CLI, Azure PowerShell, or the Azure portal.

- [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. 

Enabled Just-In-Time access by using Azure Active Directory (Azure AD) Privileged Identity Management (PIM) and Azure Resource Manager. 

- [Learn more about Privileged Identity Management](/azure/active-directory/privileged-identity-management)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure Active Directory Multi-Factor Authentication and follow Security Center Identity and Access Management recommendations.

- [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use a Privileged Access Workstation (PAW) with Azure Multi-Factor Authentication (MFA) enabled to log into and configure your Azure Sentinel-related resources.

- [Privileged Access Workstations](/windows-server/identity/securing-privileged-access/privileged-access-workstations)

- [Planning a cloud-based Azure Multi-Factor Authentication deployment](../active-directory/authentication/howto-mfa-getstarted.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment.

Review and action Azure AD risk detections for alerts and reports on risky user behavior.

- [How to deploy Privileged Identity Management (PIM)](/azure/active-directory/privileged-identity-management/pim-deployment-plan)

- [Understand Azure AD risk detections](/azure/active-directory/reports-monitoring/concept-risk-events)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources only from approved locations

**Guidance**: Use Conditional Access Named Locations to allow access to the Azure portal only from specific logical groupings of IP address ranges or countries/regions.

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

- [How to create and configure an Azure AD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Discover stale accounts with logs in Azure Active Directory (Azure AD). 

Use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure users have approved and continued access.

- [Understand Azure AD reporting](/azure/active-directory/reports-monitoring/)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Implement integration with any SIEM/monitoring tool based on your access to Azure Active Directory (Azure AD) sign-in activity, audit, and risk event log sources.
Streamline this process by creating diagnostic settings for Azure AD user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. Configure desired alerts within the Log Analytics workspace. 

- [How to integrate Azure activity logs with Azure Monitor](/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD) Identity Protection features to configure automated responses to detected suspicious actions related to user identities. Ingest data into Azure Sentinel for further investigation as desired and based on business requirements.
- [How to view Azure AD risky sign-ins](/azure/active-directory/reports-monitoring/concept-risky-sign-ins) 

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md) 

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Inventory and asset management

*For more information, see the [Azure Security Benchmark: Inventory and asset management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols and so on) within your subscriptions. Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended that you create and use Azure Resource Manager resources going forward.

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track Azure resources. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

In addition, use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types
- Allowed resource types

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription)

- [How to create management groups](/azure/governance/management-groups/create)

- [How to create and use tags](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions.

Use Azure Resource Graph to query for and discover resources within their subscriptions. Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types
- Allowed resource types

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Configure Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure configuration

*For more information, see the [Azure Security Benchmark: Secure configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Define and implement standard security configurations for Azure Public IP with Azure Policy. Use Azure Policy aliases in the "Microsoft.Network" namespace to create custom policies to audit or enforce the network configuration of your Azure Public IP instances. You may also make use of built-in policy definitions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create a custom policy with policy aliases](../governance/policy/tutorials/create-custom-policy-definition.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Define and implement standard security configurations for Azure Public IP with Azure Policy. Use Azure Policy aliases in the "Microsoft.Network" namespace to create custom policies to audit or enforce the network configuration of your Azure Public IP instances.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create a custom policy with policy aliases](../governance/policy/tutorials/create-custom-policy-definition.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use built-in Azure Policy definitions as well as Azure Policy aliases in the "Microsoft.Network" namespace to create custom Azure Policy definitions to alert, audit, and enforce system configurations. Use Azure Policy [audit], [deny], and [deploy if not exist] to automatically enforce configurations for your Azure resources.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Incident response

*For more information, see the [Azure Security Benchmark: Incident response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automation within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Customers may also use NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md) 

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see the [Azure Security Benchmark: Penetration tests and red team exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications. 

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
