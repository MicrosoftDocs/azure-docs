---
title: Azure security baseline for Service Fabric
description: The Service Fabric security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: service-fabric
ms.topic: conceptual
ms.date: 07/22/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Service Fabric

The Azure Security Baseline for Service Fabric contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](../security/benchmarks/overview.md), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](../security/benchmarks/security-baselines-overview.md).



## Network security

*For more information, see [Security control: Network security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Ensure that all Virtual Network subnet deployments have a Network Security Group applied with network access controls specific to your application's trusted ports and sources.

* [Deploy Azure Firewall using a template](../firewall/deploy-template.md)

* [Create perimeter networks by using Azure Network Security Groups (NSGs)](../security/fundamentals/service-fabric-best-practices.md#use-network-isolation-and-security-with-azure-service-fabric)

* [How to integrate your Azure Service Fabric cluster with an existing virtual network](./service-fabric-patterns-networking.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

**Guidance**: Use Azure Security Center and remediate network protection recommendations for the virtual network, subnet, and network security group being used to secure your Azure Service Fabric cluster. Enable network security group (NSG) flow logs and send logs into an Azure Storage Account to traffic audit. You may also send NSG flow logs to an Azure Log Analytics Workspace and use Azure Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Azure Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

* [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

* [How to Enable and use Azure Traffic Analytics](../network-watcher/traffic-analytics.md)

* [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: Provide a front-end gateway to provide a single point of ingress for users, devices, or other applications. Azure API Management integrates directly with Service Fabric, allowing you to secure access to back-end services, prevent DOS attacks by using throttling, and verify API keys, JWT tokens, certificates, and other credentials.

Consider deploying Azure Web Application Firewall (WAF) in front of critical web applications for additional inspection of incoming traffic. Enable Diagnostic Setting for WAF and ingest logs into a Storage Account, Event Hub, or Log Analytics Workspace.

* [Service Fabric with Azure API Management overview](./service-fabric-api-management-overview.md)

* [Integrate API Management in an internal VNET with Application Gateway](../api-management/api-management-howto-integrate-internal-vnet-appgateway.md)

* [How to deploy Azure WAF](../web-application-firewall/ag/create-waf-policy-ag.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: For protections from DDoS attacks, enable Azure DDoS Standard protection on the virtual network where your Azure Service Fabric cluster is deployed. Use Azure Security Center integrated threat intelligence to deny communications with known malicious or unused Internet IP addresses.

* [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

* [Understand Azure Security Center Integrated Threat Intelligence](../security-center/azure-defender.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets

**Guidance**: Enable network security group (NSG) flow logs for the NSG attached to the subnet being used to protect your Azure Service Fabric cluster. Record the NSG flow logs into an Azure Storage Account to generate flow records. If required for investigating anomalous activity, enable Azure Network Watcher packet capture.

* [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

* [How to enable Network Watcher](../network-watcher/network-watcher-create.md)

* [Use traffic analytics to visualize NSG flow logs](../network-watcher/traffic-analytics.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Select an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities. If intrusion detection and/or prevention based on payload inspection is not a requirement, Azure Firewall with Threat Intelligence can be used. Azure Firewall Threat intelligence-based filtering can alert and deny traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or deny malicious traffic.

* [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

* [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

* [How to configure alerts with Azure Firewall](../firewall/threat-intel.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Deploy Azure Application Gateway for web applications with HTTPS/SSL enabled for trusted certificates.

* [How to deploy Application Gateway](../application-gateway/quick-create-portal.md)

* [How to configure Application Gateway to use HTTPS](../application-gateway/create-ssl-portal.md)

* [Understand layer 7 load balancing with Azure web application gateways](../application-gateway/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual network service tags to define network access controls on network security groups (NSG) that are attached to the subnet your Azure Service Fabric cluster is deployed in. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

* [Virtual network service tags](../virtual-network/service-tags-overview.md)

* [Service Fabric networking best practices](./service-fabric-best-practices-networking.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations for network resources related to your Azure Service Fabric cluster. Use Azure Policy aliases in the "Microsoft.ServiceFabric" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your Azure Service Fabric cluster.

You may also use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, Azure RBAC controls, and policies, in a single blueprint definition. Easily apply the blueprint to new subscriptions and environments, and fine-tune control and management through versioning.

* [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

* [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

* [How to create an Azure Blueprint](../governance/blueprints/create-blueprint-portal.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use Tags for network security group (NSGs) and other resources related to network security and traffic flow that are associated with your Azure Service Fabric cluster. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure command-line interface (CLI) to look up or perform actions on resources based on their Tags.

* [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

* [How to create a virtual network](../virtual-network/quick-create-portal.md)

* [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Service Fabric deployments. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

* [How to view and retrieve Azure Activity Log events](../azure-monitor/essentials/activity-log.md#view-the-activity-log)

* [How to create alerts in Azure Monitor](../azure-monitor/alerts/alerts-activity-log.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains time sources for Azure Service Fabric cluster components, you may update time synchronization for your compute deployments.

* [How to configure time synchronization for Azure compute resources](../virtual-machines/windows/time-sync.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: You can onboard your Azure Service Fabric cluster to Azure Monitor to aggregate security data generated by the cluster. See example diagnostics problems and solutions with Service Fabric.

* [Configure Azure Monitor logs integration with Service Fabric](./service-fabric-diagnostics-oms-setup.md)

* [Set up Azure Monitor logs for monitoring containers in Azure Service Fabric](./service-fabric-tutorial-monitoring-wincontainers.md)

* [Diagnosing common Service Fabric scenarios](./service-fabric-diagnostics-common-scenarios.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Enable Azure Monitor for the Service Fabric cluster, direct it to a Log Analytics workspace. This will log relevant cluster information and OS metrics for all Azure Service Fabric cluster nodes.

* [Configure Azure Monitor logs integration with Service Fabric](./service-fabric-diagnostics-oms-setup.md)

* [Set up Azure Monitor logs for monitoring containers in Azure Service Fabric](./service-fabric-tutorial-monitoring-wincontainers.md)

* [How to deploy the Log Analytics agent onto your nodes](./service-fabric-diagnostics-oms-agent.md)

* [Log Analytics Log Searches](../azure-monitor/logs/log-query-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Onboard the Azure Service Fabric cluster to Azure Monitor. Ensure that the Log Analytics workspace used has the log retention period set according to your organization's compliance regulations.

* [Configure Azure Monitor logs integration with Service Fabric](./service-fabric-diagnostics-oms-setup.md)

* [Set up Azure Monitor logs for monitoring containers in Azure Service Fabric](./service-fabric-tutorial-monitoring-wincontainers.md)

* [How to deploy the Log Analytics agent onto your nodes](./service-fabric-diagnostics-oms-agent.md)

* [How to configure Log Analytics Workspace Retention Period](../azure-monitor/logs/manage-cost-storage.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.5: Configure security log storage retention

**Guidance**: Onboard the Azure Service Fabric cluster to Azure Monitor. Ensure that the Log Analytics workspace used has the log retention period set according to your organization's compliance regulations.

* [Configure Azure Monitor logs integration with Service Fabric](./service-fabric-diagnostics-oms-setup.md)

* [Set up Azure Monitor logs for monitoring containers in Azure Service Fabric](./service-fabric-tutorial-monitoring-wincontainers.md)

* [How to deploy the Log Analytics agent onto your nodes](./service-fabric-diagnostics-oms-agent.md)

* [How to configure Log Analytics Workspace Retention Period](../azure-monitor/logs/manage-cost-storage.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.6: Monitor and review logs

**Guidance**: Use Azure Log Analytics workspace queries to query Azure Service Fabric logs.

* [Log Analytics Log Searches](../azure-monitor/logs/log-query-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Azure Log Analytics workspace for monitoring and alerting on anomalous activities in security logs and events related to your Azure Service Fabric cluster.

* [How to manage alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md)

* [How to alert on log analytics log data](../azure-monitor/alerts/tutorial-response.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: By default, Windows Defender is installed on Windows Server 2016. Refer to your Antimaleware documentation for configuration rules if you are not using Windows Defender. Windows Defender is not supported on Linux.

* [For details, see Windows Defender antivirus on Windows Server 2016](/windows/security/threat-protection/windows-defender-antivirus/windows-defender-antivirus-on-windows-server-2016)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.9: Enable DNS query logging

**Guidance**: Implement a third-party solution for DNS logging.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.10: Enable command-line audit logging

**Guidance**: Manually configure console logging on a per-node basis.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Identity and access control

*For more information, see [Security control: Identity and access control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Maintain record of the local administrative account that is created during cluster provisioning of Azure Service Fabric cluster as well as any other accounts you create. In addition, if Azure AD integration is used, Azure AD has built-in roles that must be explicitly assigned and are therefore queryable. Use the Azure AD PowerShell module to perform adhoc queries to discover accounts that are members of administrative groups.

In addition, you may use Azure Security Center Identity and Access Management recommendations.

* [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

* [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

* [How to monitor identity and access with Azure Security Center](../security-center/security-center-identity-access.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: When provisioning a cluster, Azure requires you to create new passwords for the web portal. There are no default passwords to change, however you can specify different passwords for web portal access.

* [Create in Azure portal](./service-fabric-cluster-creation-via-portal.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Integrate Authentication for Azure Service Fabric with Azure Active Directory. Create policies and procedures around the use of dedicated administrative accounts.

In addition, you may use Azure Security Center Identity and Access Management recommendations.

* [Set up Azure Active Directory client authentication](./service-fabric-tutorial-create-vnet-and-windows-cluster.md#set-up-azure-active-directory-client-authentication)

* [How to monitor identity and access with Azure Security Center](../security-center/security-center-identity-access.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Wherever possible, use Azure Active Directory SSO instead of configuring individual stand-alone credentials per-service. Use Azure Security Center Identity and Access Management recommendations.

* [Understand SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure AD MFA and follow Azure Security Center Identity and Access Management recommendations.

* [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

* [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use PAWs (privileged access workstations) with multi-factor authentication (MFA) configured to log into and configure your Azure Service Fabric clusters and related resources.

* [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

* [How to enable MFA in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (AD) Privileged Identity Management (PIM) for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. In addition, use Azure AD risk detections to view alerts and reports on risky user behavior.

* [How to deploy Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-deployment-plan.md)

* [Understand Azure AD risk detections](../active-directory/identity-protection/overview-identity-protection.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

* [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (AAD) as the central authentication and authorization system to secure access to management endpoints of Azure Service Fabric clusters. AAD protects data by using strong encryption for data at rest and in transit. AAD also salts, hashes, and securely stores user credentials.

* [How to create and configure an AAD instance](../active-directory/fundamentals/active-directory-access-create-new-tenant.md)

* [Setup Azure Active Directory for Service Fabric client authentication](./service-fabric-cluster-creation-setup-aad.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Use Azure Active Directory (AAD) authentication with your Azure Service Fabric cluster. AAD provides logs to help discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User's access can be reviewed on a regular basis to make sure only the right Users have continued access.

* [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.11: Alert on account login behavior deviation

**Guidance**: Use Azure Active Directory (AAD) Sign-in and Audit logs to monitor for attempts to access deactivated accounts; these logs can be integrated into any third-party SIEM/monitoring tool.

You can streamline this process by creating Diagnostic Settings for AAD user accounts, sending the audit logs and sign-in logs to a Azure Log Analytics workspace. Configure desired Alerts within Azure Log Analytics workspace.

* [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on account sign-in behavior deviation

**Guidance**: Use Azure AD Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities. You can also ingest data into Azure Sentinel for further investigation.

* [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

* [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

* [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not available; Customer Lockbox not yet supported for Azure Service Fabric.

* [List of Customer Lockbox supported services](../security/fundamentals/customer-lockbox-overview.md#supported-services-and-scenarios-in-general-availability)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data protection

*For more information, see [Security control: Data protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags on resources related to your Azure Service Fabric cluster deployments to assist in tracking Azure resources that store or process sensitive information.

* [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by VNet/Subnet, tagged appropriately, and secured by an NSG or Azure Firewall. Resources storing or processing sensitive data should be sufficiently isolated. For Virtual Machines storing or processing sensitive data, implement policy and procedure(s) to turn them off when not in use.

* [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

* [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

* [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

* [How to create a virtual network](../virtual-network/quick-create-portal.md)

* [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

* [How to deploy Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

* [How to configure alert or alert and deny with Azure Firewall](../firewall/threat-intel.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Deploy an automated tool on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and

capabilities.

* [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater.

Follow Azure Security Center recommendations for encryption at rest and encryption in transit, where applicable.

* [Understand encryption in transit with Azure](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit)

* [Service Fabric cluster security scenarios](./service-fabric-cluster-security.md)

* [Service Fabric Troubleshooting Guide for TLS Configuration](https://github.com/Azure/Service-Fabric-Troubleshooting-Guides/blob/master/Security/TLS%20Configuration.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

* [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: Not applicable; this recommendation is intended for non-compute resources designed to store data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: For Azure Service Fabric clusters storing or processing sensitive information, mark the cluster and related resources as sensitive using tags. Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

* [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.8: Encrypt sensitive information at rest

**Guidance**: Use encryption at rest on all Azure resources. Microsoft recommends allowing Azure to manage your encryption keys, however there is the option for you to manage your own keys in some instances.

* [Understand encryption at rest in Azure](../security/fundamentals/encryption-atrest.md)

* [How to configure customer-managed encryption keys](../storage/common/customer-managed-keys-configure-key-vault.md)

* [Enable disk encryption for Azure Service Fabric cluster nodes in Windows](./service-fabric-enable-azure-disk-encryption-windows.md)

* [Enable disk encryption for Azure Service Fabric cluster nodes in Linux](./service-fabric-enable-azure-disk-encryption-linux.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to critical Azure resources.

* [How to create alerts for Azure Activity Log events](../azure-monitor/alerts/alerts-activity-log.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Regularly run the Service Fabric Fault Analysis Service and Chaos services to simulate faults throughout the cluster to assess the robustness and reliability of your services.

Follow recommendations from Azure Security Center on performing vulnerability assessments on your Azure virtual machines and container images.

Use a third-party solution for performing vulnerability assessments on network devices and web applications. When conducting remote scans, do not use a single, perpetual, administrative account. Consider implementing JIT provisioning methodology for the scan account. Credentials for the scan account should be protected, monitored, and used only for vulnerability scanning.

* [Introduction to Service Fabric Fault Analysis Service](./service-fabric-testability-overview.md)

* [Induce controlled Chaos in Service Fabric clusters](./service-fabric-controlled-chaos.md)

* [How to implement Azure Security Center vulnerability assessment recommendations](../security-center/deploy-vulnerability-assessment-vm.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Enable automatic OS image upgrades on the virtual machine scale sets of your Azure Service Fabric cluster.

Alternately, to test OS patches first before going to production, use the manual trigger for OS image upgrades of your scale set. Note that the manual trigger option doesn't provide built-in rollback. Monitor OS patches using Update Management from Azure Automation.

* [Patch management for Service Fabric cluster nodes](./service-fabric-best-practices-infrastructure-as-code.md#azure-virtual-machine-operating-system-automatic-upgrade-configuration)

* [Automatic OS image upgrades with Azure virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md)

* [How to bring VMs up-to-date with the latest scale set model](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model)

* [Azure Automation Update Management overview](../automation/update-management/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.3: Deploy automated patch management solution for third-party software titles

**Guidance**: Enable automatic OS image upgrades on the virtual machine scale sets of your Azure Service Fabric cluster. Patch Orchestration Application (POA) is an alternative solution that is intended for Service Fabric clusters hosted outside of Azure. POA can be used with Azure clusters, with some additional hosting overhead.

* [Patch management for Service Fabric cluster nodes](./service-fabric-best-practices-infrastructure-as-code.md#azure-virtual-machine-operating-system-automatic-upgrade-configuration)

* [Automatic OS image upgrades with Azure virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md)

* [How to configure the OS patching schedule for Service Fabric clusters](./service-fabric-patch-orchestration-application.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Export scan results at consistent intervals and compare the results to verify that vulnerabilities have been remediated. When using vulnerability management recommendations suggested by Azure Security Center, you may pivot into the selected solution's portal to view historical scan data.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use a common risk scoring program (e.g. Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

* [How to create queries with Azure Resource Graph](../governance/resource-graph/first-query-portal.md)

* [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

* [Understand Azure RBAC](../role-based-access-control/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

* [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

* [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

* [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

* [How to create and use Tags](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Define approved Azure resources and approved software for compute resources.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscription(s) using the following built-in policy definitions:

Not allowed resource types

Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

* [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

* [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Implement a third-party solution to monitor cluster nodes for unapproved software applications.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.), including Azure Service Fabric clusters, within your subscription(s). Remove any unapproved Azure resources that you discover. For Azure Service Fabric cluster nodes, implement a third-party solution to remove or alert on unapproved software.

* [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.8: Use only approved applications

**Guidance**: For Azure Service Fabric cluster nodes, implement a third-party solution to prevent unauthorized software from executing.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to restrict which services you can provision in your environment.

* [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

* [How to deny a specific resource type with Azure Policy](../governance/policy/samples/index.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

**Guidance**: For Azure Service Fabric cluster nodes, implement a third-party solution to prevent unauthorized file types from executing.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App.

* [How to configure Conditional Access to block access to Azure Resources Manager](../role-based-access-control/conditional-access-azure-management.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: Use operating system specific configurations or third-party resources to limit users' ability to execute scripts within Azure compute resources.

* [For example, how to control PowerShell script execution in Windows Environments](/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-6)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Software that is required for business operations, but may incur higher risk for the organization, should be isolated within its own virtual machine and/or virtual network and sufficiently secured with either an Azure Firewall or Network Security Group.

* [How to create a virtual network](../virtual-network/quick-create-portal.md)

* [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Secure configuration

*For more information, see [Security control: Secure configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.ServiceFabric" namespace to create custom policies to audit or enforce the network configuration of your Service Fabric cluster.

* [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

* [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Azure Service Fabric Operating System Images are managed and maintained by Microsoft. Customer responsible for implementing secure configurations for your cluster nodes' operating system.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure Policy [deny] and [deploy if not exist] to enforce secure settings for your Azure Service Fabric clusters and related resources.

* [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

* [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Azure Service Fabric cluster Operating System Images managed and maintained by Microsoft. Customer responsible for implementing OS-level state configuration.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 7.5: Securely store configuration of Azure resources

**Guidance**: If using custom Azure Policy definitions, use Azure DevOps or Azure Repos to securely store and manage your code.

* [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow?view=azure-devops)

* [Azure Repos Documentation](/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: If using custom images, use Azure role-based access control (Azure RBAC) to ensure only authorized users may access the images. For container images, store them in Azure Container Registry and leverage Azure RBAC to ensure only authorized users may access the images.

* [Understand Azure RBAC](../role-based-access-control/rbac-and-directory-admin-roles.md)

* [Understand Azure RBAC for Container Registry](../container-registry/container-registry-roles.md)

* [How to configure Azure RBAC](../role-based-access-control/quickstart-assign-role-user-portal.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.ServiceFabric" namespace to create custom policies to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

* [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.ServiceFabric" namespace to create custom policies to audit or enforce the configuration of your Service Fabric cluster.

* [How to view available Azure Policy aliases](/powershell/module/az.resources/get-azpolicyalias?view=azps-3.3.0)

* [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Use Azure Security Center to perform baseline scans for OS and Docker Settings for containers.

* [Understand Azure Security Center container recommendations](../security-center/container-security.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.

* [Using managed identities for Azure with Service Fabric](./concepts-managed-identity.md)

* [Configure managed identity support for a new Service Fabric cluster](./configure-new-azure-service-fabric-enable-managed-identity.md)

* [Use managed identity with a Service Fabric application](./how-to-managed-identity-service-fabric-app-code.md)

* [KeyVaultReference support for Service Fabric applications](./service-fabric-keyvault-references.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: Managed identities can be used in Azure-deployed Service Fabric clusters, and for applications deployed as Azure resources. Managed Identities allows you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

* [Using managed identities for Azure with Service Fabric](./concepts-managed-identity.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: If using any code related to your Azure Service Fabric deployment, you may implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

Use Azure Key Vault to rotate Service Fabric cluster certificates automatically.

* [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

* [Certificate management in Service Fabric clusters](./cluster-security-certificate-management.md#certificate-rotation)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: By default, Windows Defender antivirus is installed on Windows Server 2016. The user interface is installed by default on some SKUs, but is not required.

Refer to your Antimalware documentation for configuration rules if you are not using Windows Defender. Windows Defender isn't supported on Linux.

* [Understand Windows Defender Antivirus on Windows Server 2016](/windows/security/threat-protection/windows-defender-antivirus/windows-defender-antivirus-on-windows-server-2016)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Not applicable; this recommendation is intended for non-compute resources designed to store data. Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Service Fabric), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this recommendation is intended for non-compute resources designed to store data. Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Service Fabric), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data recovery

*For more information, see [Security control: Data recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back ups

**Guidance**: The Backup and Restore service in Service Fabric enables easy and automatic backup of information stored in stateful services. Backing up application data on a periodic basis is fundamental for guarding against data loss and service unavailability. Service Fabric provides an optional backup and restore service, which allows you to configure periodic backup of stateful Reliable Services (including Actor Services) without having to write any additional code. It also facilitates restoring previously taken backups.

* [Periodic backup and restore in an Azure Service Fabric cluster](./service-fabric-backuprestoreservice-quickstart-azurecluster.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Enable backup restore service in your Service Fabric cluster and create backup policies to back up stateful services periodically and on-demand. Backup customer-managed keys within Azure Key Vault.

* [Periodic backup and restore in an Azure Service Fabric cluster](./service-fabric-backuprestoreservice-quickstart-azurecluster.md)

* [Understanding periodic backup configuration in Azure Service Fabric](./service-fabric-backuprestoreservice-configure-periodic-backup.md)

* [How to backup key vault keys in Azure](/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Ensure ability to perform restoration from the backup restore service by periodically reviewing backup configuration information and available backups. Test restoration of backed up customer-managed keys.

* [Understanding periodic backup configuration in Azure Service Fabric](./service-fabric-backuprestoreservice-configure-periodic-backup.md)

* [Restoring backup in Azure Service Fabric](./service-fabric-backup-restore-service-trigger-restore.md)

* [How to restore key vault keys in Azure](/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Backups from Service Fabric backup restore service use an Azure Storage account in your subscription. Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys for encryption of storage data.

If you are using customer-managed-keys, ensure Soft-Delete in Key Vault is enabled to protect keys against accidental or malicious deletion.

* [Azure Storage encryption at rest](../storage/common/storage-service-encryption.md)

* [How to enable Soft-Delete in Key Vault](../storage/blobs/soft-delete-blob-overview.md?tabs=azure-portal)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Develop an incident response guide for your organization. Ensure there are written incident response plans that define all the roles of personnel as well as the phases of incident handling and management from detection to post-incident review.

* [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

* [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/06/27/inside-the-msrc-anatomy-of-a-ssirp-incident/)

* [Use NIST's Computer Security Incident Handling Guide to aid in the creation of your own incident response plan](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data. It's your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

* [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

* [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

* [NIST Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

* [How to set the Azure Security Center security contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

* [How to configure continuous export](../security-center/continuous-export.md)

* [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

* [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

* [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

* [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)