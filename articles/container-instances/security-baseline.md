---
title: Azure security baseline for Container Instances
description: Azure security baseline for Container Instances
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 05/27/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Container Instances

The Azure Security Baseline for Container Instances contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see the [Azure security baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Network security

*For more information, see [Security control: Network security](https://docs.microsoft.com/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect resources using Network Security Groups or Azure Firewall on your Virtual Network

**Guidance**: Azure Virtual Network provides secure, private networking for your Azure and on-premises resources. Integrate your container groups in Azure Container Instances with an Azure virtual network. 

* [Virtual network scenarios and resources - Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-virtual-network-concepts)

* [Deploy container instances into an Azure virtual network](https://docs.microsoft.com/azure/container-instances/container-instances-vnet)

* [How to create an NSG with a security configuration](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

* [How to deploy and configure Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of Vnets, Subnets, and NICs

**Guidance**: Use Azure Security Center and remediate network protection recommendations to help protect your network resources in Azure. Enable NSG flow logs and send logs into a Storage Account for traffic audit.

* [How to enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

* [Protect your network resources](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: Deploy Azure Web Application Firewall (WAF) in front of critical web applications hosted in Azure Container Instances for additional inspection of incoming traffic. Enable Diagnostic Setting for WAF and ingest logs into a Storage Account, Event Hub, or Log Analytics Workspace.

* [How to deploy Azure WAF](https://docs.microsoft.com/azure/web-application-firewall/ag/create-waf-policy-ag)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Enable DDoS Standard protection on your Azure Virtual Networks to guard against DDoS attacks. Use Azure Security Center Integrated Threat Intelligence to deny communications with known malicious IP addresses. Deploy Azure Firewall at each of the organization's network boundaries with Threat Intelligence enabled and configured to "Alert and deny" for malicious network traffic. Use Azure Security Center Just In Time Network access to configure NSGs to limit exposure of endpoints to approved IP addresses for a limited period. Use Azure Security Center Adaptive Network Hardening to recommend NSG configurations that limit ports and source IPs based on actual traffic and threat intelligence. 

* [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

* [Understand Azure Security Center Integrated Threat Intelligence](https://docs.microsoft.com/azure/security-center/security-center-alerts-service-layer)

* [Understand Azure Security Center Adaptive Network Hardening](https://docs.microsoft.com/azure/security-center/security-center-adaptive-network-hardening)

* [Azure Security Center Just In Time Network Access Control](https://docs.microsoft.com/azure/security-center/security-center-just-in-time)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.5: Record network packets and flow logs

**Guidance**: If using Network Security Groups (NSGs) with your virtual network implementation, enable NSG flow logs for the NSG attached to the subnet delegated to Azure Container Instances. Record the NSG flow logs into an Azure Storage Account to generate flow records. If required for investigating anomalous activity, enable Azure Network Watcher packet capture.

* [How to enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

* [How to enable Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.6: Deploy network based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Select an offer from the Azure Marketplace that supports IDS/IPS functionality with payload inspection capabilities. If intrusion detection and/or prevention based on payload inspection is not a requirement, Azure Firewall with Threat Intelligence can be used. Azure Firewall Threat intelligence-based filtering can alert and deny traffic to and from known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

Deploy the firewall solution of your choice at each of your organization's network boundaries to detect and/or deny malicious traffic.

* [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall)

* [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

* [How to configure alerts with Azure Firewall](https://docs.microsoft.com/azure/firewall/threat-intel)

* [Deploy in a virtual network - Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-vnet) 



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Deploy Azure Application Gateway for web applications with HTTPS/SSL enabled for trusted certificates.

* [How to deploy Application Gateway](https://docs.microsoft.com/azure/application-gateway/quick-create-portal)

* [How to configure Application Gateway to use HTTPS](https://docs.microsoft.com/azure/application-gateway/create-ssl-portal) 

* [Understand layer 7 load balancing with Azure web application gateways](https://docs.microsoft.com/azure/application-gateway/overview)

* [Expose a static IP address for a container group](https://docs.microsoft.com/azure/container-instances/container-instances-application-gateway)

* [Deploy in a virtual network - Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-vnet)



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use Virtual Network Service Tags to define network access controls on Network Security Groups or Azure Firewall. You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change. 

You may also use Application Security Groups to help simplify complex security configuration. Application security groups enable you to configure network security as a natural extension of an application's structure, allowing you to group virtual machines and define network security policies based on those groups. 

* [Understand and use Service Tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview) 

* [Understand and use Application Security Groups](https://docs.microsoft.com/azure/virtual-network/security-overview#application-security-groups)

* [Deploy in a virtual network - Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-vnet)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: You may also use Azure Blueprints to simplify large scale Azure deployments by packaging key environment artifacts, such as Azure Resources Manager templates, RBAC controls, and policies, in a single blueprint definition. You can apply the blueprint to new subscriptions, and fine-tune control and management through versioning. 

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [Azure Policy samples for networking](https://docs.microsoft.com/azure/governance/policy/samples/#network)

* [How to create an Azure Blueprint](https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Use Tags for NSGs and other resources related to network security and traffic flow. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.

Use any of the built-in Azure policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

You may use Azure PowerShell or Azure CLI to look-up or perform actions on resources based on their Tags.

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [Deploy in a virtual network - Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-vnet)

* [How to create an NSG with a Security Config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your container instances. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place.

* [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

* [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains time sources for Azure resources, however, you have the option to manage the time synchronization settings for your compute resources. For example, run a time synchronization command in a running container.

* [How to configure time synchronization for Azure compute resources](https://docs.microsoft.com/azure/virtual-machines/windows/time-sync)

* [Execute a command in a running Azure container instance](https://docs.microsoft.com/azure/container-instances/container-instances-exec)



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

### 2.2: Configure central security log management

**Guidance**: Ingest logs via Azure Monitor to aggregate security data generated by an Azure container group. Within Azure Monitor, use Log Analytics Workspace(s) to query and perform analytics, and use Azure Storage Accounts for long-term/archival storage.

* [Container group and instance logging with Azure Monitor logs](https://docs.microsoft.com/azure/container-instances/container-instances-log-analytics)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Azure Monitor collects resource logs (formerly called diagnostic logs) for user-driven events in your registry. Azure Container Instances includes built-in support for sending container group logs and event data, and container logs, to Azure Monitor logs.

* [Container group and instance logging with Azure Monitor logs](https://docs.microsoft.com/azure/container-registry/container-registry-diagnostics-audit-logs)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

**Guidance**: Not applicable. This guideline is intended for IaaS compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

**Guidance**: Within Azure Monitor, set your Log Analytics Workspace retention period according to your organization's compliance regulations. Use Azure Storage Accounts for long-term/archival storage.

* [How to set log retention parameters for Log Analytics Workspaces](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: Analyze and monitor logs for anomalous behavior and regularly review results. Use Azure Monitor's Log Analytics Workspace to review logs and perform queries on log data. 

* [Container group and instance logging with Azure Monitor logs](https://docs.microsoft.com/azure/container-instances/container-instances-log-analytics)

* [Understand Log Analytics Workspace](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal)

* [How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activity

**Guidance**: Use Log Analytics Workspace for monitoring and alerting on anomalous activity found in security logs and events. 

* [Container group and instance logging with Azure Monitor logs](https://docs.microsoft.com/azure/container-instances/container-instances-log-analytics)

* [How to alert on log analytics log data](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-response)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Provide your own anti-malware solution and event collection if needed to run in a container. 


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.9: Enable DNS query logging

**Guidance**: Provide your own solution if needed to query DNS logs in a container.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.10: Enable command-line audit logging

**Guidance**: If needed, configure console logging in a running container instance.

* [Execute a command in a running Azure container instance](https://docs.microsoft.com/azure/container-instances/container-instances-exec)



**Azure Security Center monitoring**: Not Applicable

**Responsibility**: Customer

## Identity and access control

*For more information, see [Security control: Identity and access control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Active Directory (Azure AD) has built-in roles that must be explicitly assigned and are queryable. Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of administrative groups.

If you use an Azure container registry with Azure Container Instances, for each Azure container registry, track whether the built-in admin account is enabled or disabled. Disable the account when not in use.

* [How to get a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

* [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

* [Azure Container Registry admin account](https://docs.microsoft.com/azure/container-registry/container-registry-authentication#admin-account)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

**Guidance**: Azure Active Directory (Azure AD) does not have the concept of default passwords. Other Azure resources requiring a password force a password to be created with complexity requirements and a minimum password length, which differ depending on the service. You are responsible for third-party applications and Marketplace services that may use default passwords.

If you use an Azure container registry with Azure Container Instances, if the default admin account of an Azure container registry is enabled, complex passwords are automatically created and should be rotated. Disable the account when not in use.

* [Azure Container Registry admin account](https://docs.microsoft.com/azure/container-registry/container-registry-authentication#admin-account)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: Create standard operating procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management to monitor the number of administrative accounts.

If you use an Azure container registry with Azure Container Instances, create procedures to enable the built-in admin account of a container registry. Disable the account when not in use.

* [Understand Azure Security Center Identity and Access](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

* [Azure Container Registry admin account](https://docs.microsoft.com/azure/container-registry/container-registry-authentication#admin-account)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Wherever possible, use Azure Active Directory SSO instead of configuring individual stand-alone credentials per-service. Use Azure Security Center Identity and Access Management recommendations.

* [Understand SSO with Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Enable Azure Active Directory (Azure AD) multi-factor authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations.

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

* [How to monitor identity and access within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use PAWs (privileged access workstations) with MFA configured to log into and configure Azure resources.

* [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)

* [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activity from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

* [How to identify Azure AD users flagged for risky activity](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk)

* [How to monitor users' identity and access activity in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources from only approved locations

**Guidance**: Use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

* [How to configure Named Locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system. Azure AD protects data by using strong encryption for data at rest and in transit. Azure AD also salts, hashes, and securely stores user credentials.

* [How to create and configure an Azure AD instance](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Active Directory (Azure AD) provides logs to help discover stale accounts. In addition, use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. User access can be reviewed on a regular basis to make sure only the right Users have continued access.

* [Understand Azure AD reporting](https://docs.microsoft.com/azure/active-directory/reports-monitoring/)

* [How to use Azure identity access reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated accounts

**Guidance**: You have access to Azure Active Directory (Azure AD) Sign-in Activity, Audit and Risk Event log sources, which allow you to integrate with any Security Information and Event Management (SIEM) /Monitoring tool.

You can streamline this process by creating Diagnostic Settings for Azure Active Directory user accounts and sending the audit logs and sign-in logs to a Log Analytics Workspace. You can configure desired Alerts within Log Analytics Workspace.

* [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

**Guidance**: Use Azure Active Directory (Azure AD) Risk and Identity Protection features to configure automated responses to detected suspicious actions related to user identities.

* [How to view Azure AD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

* [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

**Guidance**: Not currently available; Customer Lockbox is not currently supported for Azure Container Instances.

* [List of Customer Lockbox supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data protection

*For more information, see [Security control: Data protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use resource tags to assist in tracking Azure container instances that store or process sensitive information. 

Tag and version container images, to assist in tracking images that store or process sensitive information.

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [Recommendations for tagging and versioning container images](https://docs.microsoft.com/azure/container-registry/container-registry-image-tag-version)


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement separate subscriptions, and/or management groups for development, test, and production. Resources should be separated by VNet/Subnet, tagged appropriately, and secured by an NSG or Azure Firewall. Resources storing or processing sensitive data should be sufficiently isolated.

* [Execute a command in a running Azure container instance](https://docs.microsoft.com/azure/container-instances/container-instances-exec)

* [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

* [How to create management groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

* [Deploy in a virtual network - Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-vnet) 
* [How to create an NSG with a security config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

* [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)

* [How to configure alert or alert and deny with Azure Firewall](https://docs.microsoft.com/azure/firewall/threat-intel)


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Deploy an automated tool on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals. Monitor and block unauthorized information transfer from Azure file shares and other volumes mounted to container instances.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

* [Deploy in a virtual network - Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-vnet) 

* [Mount an Azure file share in Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-volume-azure-files)


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Ensure that any clients connecting to your Azure container groups are able to negotiate TLS 1.2 or greater. Microsoft Azure resources negotiate TLS 1.2 by default.

Follow Azure Security Center recommendations for encryption at rest and encryption in transit, where applicable.

* [Understand encryption in transit with Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not currently available for Azure Container Instances. Tag container groups that may be processing sensitive information as such and implement third-party solution if required for compliance purposes.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: Use Azure AD RBAC to control access to Azure Container Instances data and resources. 

* [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

* [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.8: Encrypt sensitive information at rest

**Guidance**: By default, all deployment data in Azure Container Instances is encrypted at rest using Microsoft-managed keys. Optionally, manage the encryption with your own key (customer-managed key).

* [Understand encryption at rest in Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-atrest)

* [Encrypt deployment data with Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-encrypt-data)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to your container groups and container instances. 

* [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](https://docs.microsoft.com/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Implement solutions to scan container images in a private registry and identify potential vulnerabilities. Follow recommendations from Azure Security Center on performing vulnerability assessments on container images stored in Azure Container Registry. Optionally deploy third-party solutions from Azure Marketplace to perform image vulnerability assessments.

* [Security considerations for Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-image-security)

* [Azure Container Registry integration with Security Center](https://docs.microsoft.com/azure/security-center/azure-container-registry-integration)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Microsoft performs patch management on the underlying systems that support running containers.

Use a custom or third party solution to patch container images. If you store container images in Azure Container Registry, run Azure Container Registry tasks to automate updates to application images in a container registry based on security patches or other updates in base OS images.

* [Security considerations for Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-image-security)

* [About base image updates for Azure Container Registry tasks](https://docs.microsoft.com/azure/container-registry/container-registry-tasks-base-images)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 5.3: Deploy automated third-party software patch management solution

**Guidance**: Use a custom or third party solution to patch container images. If you store container images in Azure Container Registry, run Azure Container Registry tasks to automate updates to application images in a container registry based on security patches or other updates in base OS images.

* [Security considerations for Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-image-security)

* [About base image updates for ACR Tasks](https://docs.microsoft.com/azure/container-registry/container-registry-tasks-base-images)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Export image scanning results at consistent intervals and compare the results to verify that vulnerabilities have been remediated. If you store container images in Azure Container Registry, integrate your registry with Azure Security Center to enable periodic scanning of container images for vulnerabilities. Optionally deploy third-party solutions from Azure Marketplace to perform periodic image vulnerability scans.

* [Security considerations for Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-image-security)

* [Azure Container Registry integration with Security Center](https://docs.microsoft.com/azure/security-center/azure-container-registry-integration)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**:  If you store container images in Azure Container Registry, integrate your registry with Azure Security Center to enable periodic scanning of container images for vulnerabilities and to classify risks. Optionally deploy third-party solutions from Azure Marketplace to perform periodic image vulnerability scans and risk classification.

* [Security considerations for Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-image-security)

* [Azure Container Registry integration with Security Center](https://docs.microsoft.com/azure/security-center/azure-container-registry-integration)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use Azure Asset Discovery

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s). Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

* [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

* [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

* [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure Container Instances and related resources giving metadata to logically organize them into a taxonomy.

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

* [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

* [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Maintain an inventory of approved Azure resources and software titles

**Guidance**: You will need to create an inventory of approved Azure resources as per your organizational needs.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s).

Use Azure Resource Graph to query/discover resources within their subscription(s). Ensure that all Azure resources present in the environment are approved.

* [Audit compliance of Azure container registries using Azure Policy](https://docs.microsoft.com/azure/container-registry/container-registry-azure-policy)

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Implement your own solution, or a third-party solution, to inventory software for approved containerized applications. 

Implement solutions to scan container images in a private registry and identify potential vulnerabilities. Follow recommendations from Azure Security Center to perform vulnerability assessments on container images stored in Azure Container Registry. Optionally deploy third-party solutions from Azure Marketplace to perform image vulnerability assessments.

Monitor Azure Container Instances logs for anomalous behavior and regularly review results. Use Azure Monitor's Log Analytics Workspace to review logs and perform queries on log data.

* [Container group and instance logging with Azure Monitor logs](https://docs.microsoft.com/azure/container-instances/container-instances-log-analytics)

* [Understand Log Analytics Workspace](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-portal)

* [How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries)

* [Security considerations for Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-image-security)
* [Azure Container Registry integration with Security Center](https://docs.microsoft.com/azure/security-center/azure-container-registry-integration)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Azure Automation provides complete control during deployment, operations, and decommissioning of workloads and resources. You can implement your own solution for removing unauthorized Azure resources and software applications.

* [An introduction to Azure Automation](https://docs.microsoft.com/azure/automation/automation-intro)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.8: Use only approved applications

**Guidance**: Tag and version container images, to assist in tracking images that run approved applications.
* [Recommendations for tagging and versioning container images](https://docs.microsoft.com/azure/container-registry/container-registry-image-tag-version)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to restrict which services you can provision in your environment.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Implement approved application list

**Guidance**: Tag and version container images, to assist in tracking images that run approved applications.
* [Recommendations for tagging and versioning container images](https://docs.microsoft.com/azure/container-registry/container-registry-image-tag-version)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: <div>Limit users' ability to interact with Azure Resource Manager via scripts<br></div>

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resources Manager by configuring "Block access" for the "Microsoft Azure Management" App. 

* [How to configure Conditional Access to block access to Azure Resources Manager](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts within compute resources

**Guidance**: All users with access to Azure Container Instances can execute scripts within containers.

Manage and review access to Azure Container Instances resources by using different Azure subscriptions or management groups, or isolate resources using virtual networks and NSGs or Azure Firewall.

* [Execute a command in a running Azure container instance](https://docs.microsoft.com/azure/container-instances/container-instances-exec)

* [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

* [How to create management groups](https://docs.microsoft.com/azure/governance/management-groups/create)

* [Deploy in a virtual network - Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-vnet)

* [How to create an NSG with a security config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

* [How to deploy Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Software that is required for business operations, but may incur higher risk for the organization, should be isolated within its own virtual network and sufficiently secured with either an Azure Firewall or Network Security Group.

* [Deploy in a virtual network - Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-vnet) 

* [How to create an NSG with a security config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure configuration

*For more information, see [Security control: Secure configuration](https://docs.microsoft.com/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Maintain an approved container group configuration by using an Azure Resource Manager template or exporting to a YAML file. Use Azure Policy to maintain security configurations for related Azure resources.

* [Container groups in Azure Container Instances](container-instances-container-groups.md#deployment)

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

**Guidance**: Use a custom or third party solution to patch container images. If you store container images in Azure Container Registry, run Azure Container Registry tasks to automate updates to application images in a container registry based on security patches or other updates in base OS images. 

* [About base image updates for Azure Container Registry tasks](https://docs.microsoft.com/azure/container-registry/container-registry-tasks-base-images)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Use Azure policy [deny] and [deploy if not exist] to enforce secure settings across your Azure resources.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

* [Understand Azure Policy effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

**Guidance**: Implement solutions to scan container images in a private registry and identify potential vulnerabilities in OS configurations. Follow recommendations from Azure Security Center to perform vulnerability assessments on container images stored in Azure Container Registry. Optionally deploy third-party solutions from Azure Marketplace to perform image vulnerability assessments.

Use a custom or third party solution to patch container images. If you store container images in Azure Container Registry, run Azure Container Registry tasks to automate updates to application images in a container registry based on security patches or other updates in base OS images. 

* [Container monitoring and scanning security recommendations for Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-image-security)

* [Azure Container Registry integration with Security Center](https://docs.microsoft.com/azure/security-center/azure-container-registry-integration)
* [About base image updates for Azure Container Registry tasks](https://docs.microsoft.com/azure/container-registry/container-registry-tasks-base-images)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.5: Securely store configuration of Azure resources

**Guidance**: Store and manage ARM templates, YAML files, and custom Azure policy definitions securely in source control.

* [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

* [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

**Guidance**: Store container images in Azure Container Registry and leverage RBAC to ensure only authorized users may access the images.

* [Understand RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles)

* [Understand RBAC for Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-roles)

* [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/quickstart-assign-role-user-portal)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy system configuration management tools

**Guidance**: Use Azure Policy to alert, audit, and enforce system configurations. Additionally, develop a process and pipeline for managing policy exceptions.

* [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy system configuration management tools for operating systems

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure services

**Guidance**: Use Azure Security Center to perform baseline scans for your Azure Resources.

Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s).

* [How to remediate recommendations in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations)

* [Audit compliance of Azure container registries using Azure Policy](https://docs.microsoft.com/azure/container-registry/container-registry-azure-policy)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: If you use Azure Container Registry to store container images, use Azure Security Center to perform baseline scans for OS and Docker settings for containers.

* [Understand Azure Security Center container recommendations](https://docs.microsoft.com/azure/security-center/security-center-container-recommendations)


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

**Guidance**: Use Managed Service Identity in conjunction with Azure Key Vault to simplify and secure secret management for your cloud applications.

* [How to integrate with Azure Managed Identities](https://docs.microsoft.com/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity)

* [How to create a Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-portal)

* [How to provide Key Vault authentication with a managed identity](https://docs.microsoft.com/azure/key-vault/managed-identity)

* [How to use managed identities with Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-managed-identity)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.12: Manage identities securely and automatically

**Guidance**: Use Managed Identities to provide Azure services with an automatically managed identity in Azure AD. Managed Identities allow you to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code.

* [How to configure Managed Identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm)

* [How to use managed identities with Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-managed-identity)



**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

* [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](https://docs.microsoft.com/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed anti-malware software

**Guidance**: Not applicable; this guideline is intended for IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure Container Instances), however it does not run on customer content.

Pre-scan any files being uploaded to non-compute Azure resources, such as App Service, Data Lake Storage, Blob Storage, etc. 


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 8.3: Ensure anti-malware software and signatures are updated

**Guidance**: Not applicable; this recommendation is intended for IaaS compute resources.

Microsoft anti-malware is enabled on the underlying host that supports Azure services (for example, Azure Container Instances), however it does not run on customer content.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data recovery

*For more information, see [Security control: Data recovery](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

**Guidance**: Enable Azure Backup and configure the backup source (such as a file share mounted to container groups), as well as the desired frequency and retention period. 

* [How to enable Azure Backup](https://docs.microsoft.com/azure/backup/)

* [Mount an Azure file share in Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-volume-azure-files)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.2: Perform complete system backups and backup any customer managed keys

**Guidance**: Back up customer-managed keys in Azure Key Vault using Azure command-line tools or SDKs.

Optionally back up container images by importing from one registry to another.
* [How to backup key vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey?view=azurermps-6.13.0)

* [Import container images to a container registry](https://docs.microsoft.com/azure/container-registry/container-registry-import-images)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.3: Validate all backups including customer managed keys

**Guidance**: Test restoration of backed up customer managed keys in Azure Key Vault using Azure command-line tools or SDKs.

* [How to restore Azure Key Vault keys in Azure](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)

* [Encrypt deployment data - Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-encrypt-data)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 9.4: Ensure protection of backups and customer managed keys

**Guidance**: You may enable Soft-Delete in Azure Key Vault to protect keys against accidental or malicious deletion.

* [How to enable Soft-Delete in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Incident response

*For more information, see [Security control: Incident response](https://docs.microsoft.com/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan.

* [How to configure Workflow Automations within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide)

* [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

* [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

* [NIST Computer Security Incident Handling Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for example. production, non-production) and create a naming system to clearly identify and categorize Azure resources.


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems' incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

* [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

* [How to set the Azure Security Center security contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

* [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

* [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

* [How to configure Workflow Automation and Logic Apps](https://docs.microsoft.com/azure/security-center/workflow-automation)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](https://docs.microsoft.com/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings within 60 days

**Guidance**: 
Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Use Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

* [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

* [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
