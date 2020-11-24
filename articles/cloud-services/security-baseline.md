---
title: Azure security baseline for Azure Cloud Services
description: The Azure Cloud Services security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: cloud-services
ms.topic: conceptual
ms.date: 11/02/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Cloud Services

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to Microsoft Azure Cloud Services. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Cloud Services. **Controls** not applicable to Cloud Services have been excluded.

 
To see how Cloud Services completely maps to the Azure
Security Benchmark, see the [full Cloud Services security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network security

*For more information, see the [Azure Security Benchmark: Network security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Create a classic Azure Virtual Network with separate public and private subnets to enforce isolation based on trusted ports and IP ranges. These virtual network and subnets must be the classic Virtual Network (classic deployment) based resources, and not the current Azure Resource Manager resources.  

Allow or deny traffic using a network security group, which contains access control rules based on traffic direction, protocol, source address and port, and destination address and port. The rules of an network security group can be changed at any time, and changes are applied to all associated instances.

Microsoft Azure Cloud Services (Classic) cannot be placed in Azure Resource Manager virtual networks. However, Resource Manager-based virtual networks and classic deployment-based virtual networks can be connected through peering. 

- [Network Security Group overview](../virtual-network/network-security-groups-overview.md)

- [Virtual Network peering](https://docs.microsoft.com/azure/cloud-services/cloud-services-connectivity-and-networking-faq?&amp;preserve-view=true#how-can-i-use-azure-resource-manager-virtual-networks-with-cloud-services)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

**Guidance**: Document your Azure Cloud Services configuration and monitor it for changes. Use the service's configuration file to specify the number of role instances to deploy for each role in the service, the values of any configuration settings, and the thumbprints for any certificates associated with a role. 

If the service is part of a virtual network, configuration information for the network must be provided in the service configuration file, as well as in the virtual networking configuration file. The default extension for the service configuration file is .cscfg. Note that Azure Policy is not supported for Classic deployments for configuration enforcement.

Set a cloud service's configuration values in the service configuration file (.cscfg) and the definition in an service definition (.csdef) file. Use the service definition file to define the service model for an application. Define the roles, which are available to a cloud service and also specify the service endpoints. Log the configuration for Azure Cloud Services with service configuration file. Any reconfiguration can be done through the ServiceConfig.cscfg file. 

Monitor the optional NetworkTrafficRules element service definition which restricts which roles can communicate to specified internal endpoints. Configure the NetworkTrafficRules node, an optional element in the service definition file, to specify how roles should communicate with each other. Place limits on which roles can access the internal endpoints of the specific role.  Note that the service definition cannot be altered. 

Enable network security group flow logs and send the logs to an Azure Storage account for auditing. Send the flow logs to a Log Analytics workspace and use Traffic Analytics to provide insights into traffic patterns in your Azure tenant. Some advantages of Traffic Analytics are the ability to visualize network activity, identify hot spots and security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [Azure Resource Manager vs. classic deployment - Understand deployment models and the state of your resources](../azure-resource-manager/management/deployment-models.md)

- [Cloud Services Config file](schema-cscfg-file.md)

- [List of services supported by Azure Policy](https://docs.microsoft.com/cli/azure/azure-services-the-azure-cli-can-manage?&amp;preserve-view=true)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.3: Protect critical web applications

**Guidance**: Microsoft uses the Transport Layer Security (TLS) protocol v1.2 to protect data when it’s traveling between Azure Cloud Services and customers. Microsoft datacenters negotiate a TLS connection with client systems that connect to Azure services. TLS provides strong authentication, message privacy, and integrity (enabling detection of message tampering, interception, and forgery), interoperability, algorithm flexibility, and ease of deployment and use.

- [Encryption Fundamentals](../security/fundamentals/encryption-overview.md)

- [Configure TLS/SSL certificates](cloud-services-configure-ssl-certificate-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Azure Cloud implements a multilayer network security to protect its platform services against distributed denial-of-service (DDoS) attacks. The Azure DDoS Protection is part of Azure Cloud's continuous monitoring process, which is continually improved through penetration testing. This DDoS Protection is designed to withstand not only attacks from the outside but also from other Azure tenants. 

There are a few different ways to block or deny communication besides platform level protection within Azure Cloud Services. These are: 

-  Create a startup task to selectively block some specific IP addresses
-  Restrict an Azure web role access to a set of specified IP addresses by modifying your IIS web.config file

Prevent incoming traffic to the default URL or name of your Cloud Services, for example, *.cloudapp.net. Set the host header to a custom DNS name, under site binding configuration in the Cloud Services definition (*.csdef) file.

Configure a Deny Apply rule to classic subscription administrator assignments. By default, after an internal endpoint is defined, communication can flow from any role to the internal endpoint of a role without any restrictions. To restrict communication, you must add a NetworkTrafficRules element to the ServiceDefinition element in the service definition file.

- [How can I block/disable incoming traffic to the default URL of my cloud service](https://docs.microsoft.com/azure/cloud-services/cloud-services-connectivity-and-networking-faq?&amp;preserve-view=true#how-can-i-blockdisable-incoming-traffic-to-the-default-url-of-my-cloud-service)

- [Azure DDOS protection](https://docs.microsoft.com/azure/cloud-services/cloud-services-connectivity-and-networking-faq?&amp;preserve-view=true#how-do-i-prevent-receiving-thousands-of-hits-from-unknown-ip-addresses-that-might-indicate-a-malicious-attack-to-the-cloud-service)

- [Block a specific IP address](cloud-services-startup-tasks-common.md#block-a-specific-ip-address)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.5: Record network packets

**Guidance**: Use Azure Network Watcher, network performance monitoring, diagnostic, and analytics service, that allows monitoring of Azure networks. The Network Watcher Agent virtual machine extension is a requirement for capturing network traffic on demand, and other advanced functionality on Azure Virtual Machines. Install the Network Watcher Agent virtual machine extension, and turn on network security group flow logs.

Configure flow logging on a network security group. Review details on how to deploy the Network Watcher Virtual Machine extension to an existing Virtual Machine deployed through the classic deployment model.

- [Configure flow logging on a network security group](../virtual-machines/extensions/network-watcher-linux.md)

- [For more information about configuring flow logs visit](https://docs.microsoft.com/cli/azure/azure-services-the-azure-cli-can-manage?&amp;preserve-view=true)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Azure Cloud Services has no built-in IDS or IPS capability. Customers can select and deploy a supplementary network-based IDS or IPS solution from the Azure Marketplace based on their organizational requirements. When using third-party solutions, make sure to thoroughly test your
selected IDS or IPS solution with Azure Cloud Services to ensure proper operation and
functionality.

- [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/?term=Firewall) 

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

**Guidance**: Service certificates, which are attached to Azure Cloud Services, enable secure communication to and from the service. These certificates are defined in the services' definition and are automatically deployed to the virtual machine that is running an instance of a web role. As an example, for a web role, you can use a service certificate that can authenticate an exposed HTTPS endpoint. 

To update the certificate, it is only necessary to upload a new certificate and change the thumbprint value in the service configuration file.

Use the TLS 1.2 protocol, the most commonly used method of securing data to provide confidentiality and integrity protection. 

Generally, to protect web applications and to secure them against attacks such as OWASP Top 10, you can deploy an Azure Web Application Firewall-enabled Azure Application Gateway for protecting web applications. 

- [Service Certificates](cloud-services-certs-create.md)

- [Configuring TLS for an application in Azure](cloud-services-configure-ssl-certificate-portal.md)

- [How to deploy Application Gateway](../application-gateway/quick-create-portal.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Harden your Azure Cloud Services configuration and monitor it for changes. The service configuration file specifies the number of role instances to deploy for each role in the service, the values of any configuration settings, and the thumbprints for any certificates associated with a role. 

If your service is part of a virtual network, the configuration information for the network must be provided in the service configuration file, as well as in the virtual networking configuration file. The default extension for the service configuration file is .cscfg.

Note that Azure Policy is not supported with Azure Cloud Services for configuration enforcement.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.10: Document traffic configuration rules

**Guidance**: Azure network security groups can be used to filter network traffic to and from Azure resources in an Azure Virtual Network. A network security group contains security rules that allow or deny inbound network traffic to, or, outbound network traffic from, several types of Azure resources. For each rule, you can specify source and destination, port, and protocol.

Use the "Description" field for individual network security group rules within Azure Cloud Services to document the rules, which allow traffic to, or from a network.

- [How to filter network traffic with network security group rules](../virtual-network/tutorial-filter-network-traffic.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Traffic Manager's built-in endpoint monitoring and automatic endpoint failover features. They help you deliver high-availability applications, which are resilient to endpoint and Azure region failures. To configure endpoint monitoring, you must specify certain settings on your Traffic Manager profile.

Gather insight from Activity log, a platform log in Azure, into subscription-level events. It includes such information as when a resource is modified or when a virtual machine is started. View the Activity log in the Azure portal or retrieve entries with PowerShell and CLI. 

Create a diagnostic setting to send the Activity log to Azure Monitor, Azure Event Hubs to forward outside of Azure, or to Azure Storage for archival. Configure Azure Monitor for notification alerts when critical resources in your Azure Cloud Services are changed. 

- [Azure Activity log](../azure-monitor/platform/activity-log.md)

- [Create, view, and manage activity log alerts by using Azure Monitor](../azure-monitor/platform/alerts-activity-log.md)

- [Traffic Manager Monitoring](../traffic-manager/traffic-manager-monitoring.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and monitoring

*For more information, see the [Azure Security Benchmark: Logging and monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

**Guidance**: Microsoft maintains time sources for Azure resources for Azure Cloud Services. Customers might need to create a network rule to allow access to a time server used in their environment, over port 123 with UDP protocol.

- [NTP server access](../firewall/protect-windows-virtual-desktop.md#additional-considerations)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### 2.2: Configure central security log management

**Guidance**: Consume your cloud service streaming data programmatically with Azure Event Hubs. Integrate and send all this data to Azure Sentinel to monitor and review your logs, or use a third-party SIEM. For central security log management, configure continuous export of your chosen Azure Security Center data to Azure Event Hubs and set up the appropriate connector for your SIEM. Here are some options for Azure Sentinel including third party tools:

- Azure Sentinel - Use the native Security Center alerts data connector
- Splunk - Use the Azure Monitor add-on for Splunk
- IBM QRadar - Use a manually configured log source
- ArcSight – Use SmartConnector

Review the Azure Sentinel documentation for additional details on available connectors with Azure Sentinel. 

- [Connect data sources](../sentinel/connect-data-sources.md)

- [Integrate with a SIEM](../security-center/continuous-export.md)

- [Store diagnostic data](diagnostics-extension-to-storage.md)

- [Configuring SIEM integration via Azure Event Hubs](../security-center/continuous-export.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

**Guidance**: Configure Visual Studio to set up Azure Diagnostics for troubleshooting Azure Cloud Services which captures system and logging data on virtual machines, including virtual machine instances running your Azure Cloud Services. The Diagnostics data is transferred to a storage account of your choice. Turn on diagnostics in Azure Cloud Services projects before their deployment.

 
View the Change history for some events in the activity log within Azure Monitor. Audit  what changes happened during an event time period. Choose an event from the Activity Log for deeper inspection with Change history (Preview) tab. Send the diagnostic data to Application Insights when you publish a Azure Cloud Services from Visual Studio. Create the Application Insights Azure resource at that time or send the data to an existing Azure resource. 

Azure Cloud Services can be monitored by Application Insights for availability, performance, failures, and usage. Custom charts can be added to Application Insights so that you can see the data that matters the most. Role instance data can be collected by using the Application Insights SDK in your Azure Cloud Services project. 

- [Turn on diagnostics in Visual Studio before deployment](https://docs.microsoft.com/visualstudio/azure/vs-azure-tools-diagnostics-for-cloud-services-and-virtual-machines?&amp;preserve-view=true#to-turn-on-diagnostics-in-visual-studio-before-deployment)

- [View change history](../azure-monitor/platform/activity-log.md#view-change-history)

- [Application Insights for Azure Cloud service (Classic)](../azure-monitor/app/cloudservices.md)

- [Set up diagnostics for Azure Cloud service (Classic) and virtual machines](https://docs.microsoft.com/visualstudio/azure/vs-azure-tools-diagnostics-for-cloud-services-and-virtual-machines?toc=%2Fazure%2Fcloud-services%2Ftoc.json&amp;preserve-view=true)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.5: Configure security log storage retention

**Guidance**: You can use advanced monitoring with Azure Cloud Services which allows for additional metrics are sampled and collected at intervals of 5 minutes, 1 hour, and 12 hours. The aggregated data is stored in storage account, in tables, and is purged after 10 days. However, the storage account used is configured by role and you can use different storage accounts for different roles. This is configured with a connection string in the .csdef and .cscfg files.

Note that Advanced monitoring involves using the Azure Diagnostics extension (Application Insights SDK is optional) on the role you want to monitor. The diagnostics extension uses a config file (per role) named diagnostics.wadcfgx to configure the diagnostics metrics monitored. The Azure Diagnostic extension collects and stores data in an Azure Storage account. These settings are configured in the .wadcfgx, .csdef, and .cscfg files.

- [Introduction to Cloud Service Monitoring](cloud-services-how-to-monitor.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

**Guidance**: Basic or advanced monitoring modes are available for Azure Cloud Services. Azure Cloud Services automatically collects basic monitoring data (CPU percentage, network in/out, and disk read/write) from a host virtual machine. View the collected monitoring data on the overview and metrics pages of a cloud service in the Azure portal. 

Enable diagnostics in Azure Cloud Services to collect diagnostic data like application logs, performance counters, and more, while using the Azure Diagnostics extension. Enable or update diagnostics configuration on a cloud service that is already running with Set-AzureServiceDiagnosticsExtension cmdlet or deploy a cloud service with diagnostics extension automatically. Optionally, install the Application Insights SDK. Send performance counters to Azure Monitor.

The Azure Diagnostic extension collects and stores data in an Azure Storage account. Transfer Diagnostic data to the Microsoft Azure Storage Emulator or to Azure Storage as it is not permanently stored. Once in storage, it can be viewed with one of several available tools, such as Server Explorer in Visual Studio, Microsoft Azure Storage Explorer, Azure Management Studio. Configure the diagnostics metrics to be monitored with a config file (per role) named diagnostics.wadcfgx in the diagnostics extension. 

- [Introduction to Cloud Service Monitoring](cloud-services-how-to-monitor.md)

- [How to Enable Diagnostics in a Worker Role - Integrate with a SIEM](../security-center/continuous-export.md)

- [Enable diagnostics in Azure Cloud Services using PowerShell](cloud-services-diagnostics-powershell.md)

- [Store and view diagnostic data in Azure Storage](diagnostics-extension-to-storage.md?&amp;preserve-view=true)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

**Guidance**: You can monitor Azure Cloud Services log data by integration with Azure Sentinel, or with a third-party SIEM, by enable alerting for anomalous activities.

- [Integrate with a SIEM](../security-center/continuous-export.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

**Guidance**: Microsoft Antimalware for Azure, protects Azure Cloud Services and virtual machines. You have the option to deploy third-party security solutions in addition, such as web application fire walls, network firewalls, antimalware, intrusion detection and prevention systems (IDS or IPS), and more.

- [What are the features and capabilities that Azure basic IPS/IDS and DDOS provides](https://docs.microsoft.com/azure/cloud-services/cloud-services-configuration-and-management-faq?&amp;preserve-view=true#what-are-the-features-and-capabilities-that-azure-basic-ipsids-and-ddos-provides)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Identity and access control

*For more information, see the [Azure Security Benchmark: Identity and access control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Microsoft recommends that you manage access to Azure resources using Azure role-based access control (Azure RBAC). Azure Cloud Services, however, does not support the Azure RBAC model, as it's not an Azure Resource Manager based service and you have to use a classic subscription

By default, Account Administrator, Service Administrator, and Co-Administrator are the three classic subscription administrator roles in Azure. 

Classic subscription administrators have full access to the Azure subscription. They can manage resources using the Azure portal, Azure Resource Manager APIs, and the classic deployment model APIs. The account that is used to sign up for Azure is automatically set as both the Account Administrator and Service Administrator. Additional Co-Administrators can be added later. 

The Service Administrator and the Co-Administrators have equivalent access of users who have been assigned the Owner role (an Azure role) at the subscription scope. Manage Co-Administrators or view the Service Administrator by using the Classic administrators tab at the Azure portal. 

List role assignments for classic service administrator and coadministrators with PowerShell with the command:

Get-AzRoleAssignment -IncludeClassicAdministrators

Review the differences between classic subscription administrative roles. 

- [Differences between three classic subscription administrative roles](../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

**Guidance**: It is recommended to create standard operating procedures around the use of dedicated administrative accounts, based on available roles and the permissions required to operate and manage the Azure Cloud Services resources.

- [Differences between the classic subscription administrative roles](../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Avoid managing separate identities for applications that are running on Azure Cloud Services. Implement single sign-on to avoid requiring users to manage multiple identities and credentials.

- [What is single sign-on (SSO)](../active-directory/manage-apps/what-is-single-sign-on.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: It is recommended to use a secure, Azure-managed workstation (also known as a Privileged Access Workstation) for administrative tasks, which require elevated privileges.

- [Understand secure, Azure-managed workstations](../active-directory/devices/concept-azure-managed-workstation.md)

- [How to enable Azure AD MFA](../active-directory/authentication/howto-mfa-getstarted.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Data protection

*For more information, see the [Azure Security Benchmark: Data protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use the Azure Cloud Service REST APIs to inventory your Azure Cloud Service resources for sensitive information. Poll the deployed cloud service resources to get the configuration and .pkg resources.

 As an example, a few APIs are listed below:

- Get Deployment - The Get Deployment operation returns configuration information, status, and system properties for a deployment.
- Get Package - The Get Package operation retrieves a cloud service package for a deployment and stores the package files in Microsoft Azure Blob storage
- Get Cloud Service Properties - The Get Cloud Service Properties operation retrieves properties for the specified cloud service

Review Azure Cloud Service REST APIs documentation and create a process for data protection of sensitive information, based on your organizational requirements.

- [Get Deployment](/rest/api/compute/cloudservices/rest-get-deployment)

- [Get Cloud Service Properties](/rest/api/compute/cloudservices/rest-get-cloud-service-properties)

- [Get Package](/rest/api/compute/cloudservices/rest-get-package)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level for Azure Cloud Services.

You can also edit the "permissionLevel" in Azure Cloud Service's Certificate element to specify the access permissions given to the role processes. If you want only elevated processes to be able to access the private key, then specify elevated permission. limitedOrElevated permission allows all role processes to access the private key. Possible values are limitedOrElevated or elevated. The default value is limitedOrElevated.

- [How to create additional Azure subscriptions](/azure/billing/billing-create-subscription)

- [How to create management groups](/azure/governance/management-groups/create)

- [WebRole Schema](schema-csdef-webrole.md#Certificate)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: It is recommended to use a third-party solution from Azure Marketplace in network perimeters to monitor for unauthorized transfer of sensitive information and block such transfers while alerting information security professionals.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Configure TLS v2 for Azure Cloud Services. Use the Azure portal to add the certificate to your staged Azure Cloud Services deployment and add the certificate information to the services' CSDEF and CSCFG files. Re-package your application, and update your staged deployment to use the new package. 

Use service certificates in Azure which are attached to Azure Cloud Services to enable secure communication to and from the service. Provide a certificate that can authenticate an exposed HTTPS endpoint. Define Service certificates in the cloud service's service definition, and automatically deploy them to the Virtual Machine, running an instance of your role.

Authenticate with the management API with management certificates) Management certificates allow you to authenticate with the classic deployment model. Many programs and tools (such as Visual Studio or the Azure SDK) use these certificates to automate configuration and deployment of various Azure services. 

For additional reference, the Azure Service Management API provides programmatic access to the Service Management functionality available through the Azure portal. Azure SDK for Python can be used to manage Azure Cloud Services and Azure Storage accounts. The Azure SDK for Python wraps the Service Management API, a REST API. All API operations are performed over TLS and mutually authenticated by using X.509 v3 certificates. The management service can be accessed from within a service running in Azure. It also can be accessed directly over the Internet from any application that can send an HTTPS request and receive an HTTPS response.

- [Configure TLS for an application in Azure](cloud-services-configure-ssl-certificate-portal.md)

- [Use Service Management from Python](cloud-services-python-how-to-use-service-management.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: It is recommended to use a third-party active discovery tool to identify all sensitive information stored, processed, or transmitted by the organization's technology systems, including those located on-site, or at a remote service provider, and then update the organization's sensitive information inventory.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Not applicable to Cloud service (Classic). It does not enforce data loss prevention.

It is recommended to implement a third-party tool such as an automated host-based data loss prevention solution to enforce access controls on data even when data is copied off a system.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data in Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 4.8: Encrypt sensitive information at rest

**Guidance**: Azure Cloud Services does not support encryption-at-rest. This is because Azure Cloud Services are designed to be stateless. Azure Cloud Services do support external storage, for example, Azure Storage, which is by-default, encrypted at rest.  

The application data stored in temporary disks is not encrypted. The customer is responsible to manage and encrypt this data, as required.  

- [Understand encryption at rest in Azure](../security/fundamentals/encryption-atrest.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: You can use classic metric alerts in Azure Monitor to get notified when one of your metrics applied to critical resources cross a threshold. Classic metric alerts are an older functionality that allows for alerting only on non-dimensional metrics. There is an existing newer functionality called Metric alerts which has improved functionality over classic metric alerts. 

Additionally, Application Insights can monitor Azure Cloud Services apps for availability, performance, failures, and usage. This uses combined data from Application Insights SDKs with Azure Diagnostics data from your Azure Cloud Services.

- [Create, view, and manage classic metric alerts using Azure Monitor](../azure-monitor/platform/alerts-classic-portal.md)

- [Metric Alerts Overview](../azure-monitor/platform/alerts-metric-overview.md) 

- [Application Insights for Azure Cloud service (Classic)](../azure-monitor/app/cloudservices.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Vulnerability management

*For more information, see the [Azure Security Benchmark: Vulnerability management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Note that this information relates to the Azure Guest operating system for Azure Cloud Services worker and web roles with Platform as a Service (PaaS). It does not however apply to Virtual Machines with Infrastructure as a service (IaaS).

By default, Azure periodically updates customer's guest operating system to the latest supported image within the operating system family that they have specified in their service configuration (.cscfg), such as, Windows Server 2016.

When a customer chooses a specific operating system version for their Azure Cloud Services deployment, it disables automatic operating system updates and makes patching their responsibility. The customer must ensure that their role instances are receiving updates or they could expose their application to security vulnerabilities.

- [Azure Guest OS](cloud-services-guestos-msrc-releases.md)

- [Azure Guest OS supportability and retirement policy](cloud-services-guestos-retirement-policy.md)

- [How to Configure Cloud service (Classic)](cloud-services-how-to-configure-portal.md)

- [Manage Guest OS version](cloud-services-how-to-configure-portal.md#manage-guest-os-version)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 5.3: Deploy an automated patch management solution for third-party software titles

**Guidance**: Use a third-party patch management solution. Customers already using Configuration Manager in their environment can also use System Center Updates Publisher, allowing them to publish custom updates into Windows Server Update Service. 

This allows Update Management to patch machines that use Configuration Manager as their update repository with third-party software.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: It is recommended for a customer to understand the scope of their risk from a DDoS attack on an ongoing basis. 

We suggest thinking through these scenarios:

- What new publicly available Azure resources need protection?
- Is there a single point of failure in the service?
- How can services be isolated to limit the impact of an attack while still making services available to valid customers?
- Are there virtual networks where DDoS Protection Standard should be enabled but isn't?
- Are my services active/active with failover across multiple regions?

Supporting documentation:

- [Risk evaluation of your Azure resources](../security/fundamentals/ddos-best-practices.md#risk-evaluation-of-your-azure-resources)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Inventory and asset management

*For more information, see the [Azure Security Benchmark: Inventory and asset management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Not applicable to Azure Cloud Services. This recommendation is applicable to IaaS compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

**Guidance**: It is recommended to reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and maintain an inventory of approved Azure resources

**Guidance**: The customer should define approved Azure resources and approved software for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use the Adaptive Application Control feature, available in Azure Security Center. It is an intelligent, automated, end-to-end solution from Security Center which helps you control which applications can run on your Windows and Linux, Azure and non-Azure machines . It also helps harden your machines against malware. 

This feature is available for both Azure and non-Azure Windows (all versions, classic, or Azure Resource Manager) and Linux machines.

Security Center uses machine learning to analyze the applications running on your machines and creates an allow list from this intelligence. This capability greatly simplifies the process of configuring and maintaining application allow list policies, enabling you to:
- Block or alert on attempts to run malicious applications, including those that might otherwise be missed by antimalware solutions.

- Comply with your organization's security policy that dictates the use of only licensed software.
- Avoid unwanted software to be used in your environment.
- Avoid old and unsupported apps to run.
- Prevent specific software tools that are not allowed in your organization.
- Enable IT to control the access to sensitive data through app usage.

More details are available at the referenced links.

- [Adaptive application controls](../security-center/security-center-adaptive-application.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: 
Use the Adaptive Application Control feature, available in Azure Security Center. It is an intelligent, automated, end-to-end solution from Security Center which helps you control which applications can run on your Windows and Linux, Azure and non-Azure machines . It also helps harden your machines against malware. 

This feature is available for both Azure and non-Azure Windows (all versions, classic, or Azure Resource Manager) and Linux machines.

Security Center uses machine learning to analyze the applications running on your machines and creates an allow list from this intelligence. This capability greatly simplifies the process of configuring and maintaining application allow list policies, enabling you to:

- Block or alert on attempts to run malicious applications, including those that might otherwise be missed by antimalware solutions.

- Comply with your organization's security policy that dictates the use of only licensed software.

- Avoid unwanted software to be used in your environment.

- Avoid old and unsupported apps to run.

- Prevent specific software tools that are not allowed in your organization.

- Enable IT to control the access to sensitive data through app usage.

More details are available at the referenced links.

- [Adaptive application controls](../security-center/security-center-adaptive-application.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Use the Adaptive Application Control feature, available in Azure Security Center. It is an intelligent, automated, end-to-end solution from Security Center which helps you control which applications can run on your Windows and Linux, Azure and non-Azure machines . It also helps harden your machines against malware. 

This feature is available for both Azure and non-Azure Windows (all versions, classic, or Azure Resource Manager) and Linux machines.

Security Center uses machine learning to analyze the applications running on your machines and creates an allow list from this intelligence. This capability greatly simplifies the process of configuring and maintaining application allow list policies, enabling you to:

- Block or alert on attempts to run malicious applications, including those that might otherwise be missed by antimalware solutions.

- Comply with your organization's security policy that dictates the use of only licensed software.

- Avoid unwanted software to be used in your environment.

- Avoid old and unsupported apps to run.

- Prevent specific software tools that are not allowed in your organization.

- Enable IT to control the access to sensitive data through app usage.

More details are available at the referenced links.

- [Adaptive application controls](../security-center/security-center-adaptive-application.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.8: Use only approved applications

**Guidance**: Use the Adaptive Application Control feature, available in Azure Security Center. It is an intelligent, automated, end-to-end solution from Security Center which helps you control which applications can run on your Windows and Linux, Azure and non-Azure machines . It also helps harden your machines against malware. 

This feature is available for both Azure and non-Azure Windows (all versions, classic, or Azure Resource Manager) and Linux machines.

Security Center uses machine learning to analyze the applications running on your machines and creates an allow list from this intelligence. This capability greatly simplifies the process of configuring and maintaining application allow list policies, enabling you to:

- Block or alert on attempts to run malicious applications, including those that might otherwise be missed by antimalware solutions.

- Comply with your organization's security policy that dictates the use of only licensed software.

- Avoid unwanted software to be used in your environment.

- Avoid old and unsupported apps to run.

- Prevent specific software tools that are not allowed in your organization.

- Enable IT to control the access to sensitive data through app usage.

More details are available at the referenced links.

- [Adaptive application controls](../security-center/security-center-adaptive-application.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Use the Adaptive Application Control feature, available in Azure Security Center. It is an intelligent, automated, end-to-end solution from Security Center which helps you control which applications can run on your Windows and Linux, Azure and non-Azure machines . It also helps harden your machines against malware. 

This feature is available for both Azure and non-Azure Windows (all versions, classic, or Azure Resource Manager) and Linux machines.

Security Center uses machine learning to analyze the applications running on your machines and creates an allow list from this intelligence. This capability greatly simplifies the process of configuring and maintaining application allow list policies, enabling you to:
- Block or alert on attempts to run malicious applications, including those that might otherwise be missed by antimalware solutions.

- Comply with your organization's security policy that dictates the use of only licensed software.
- Avoid unwanted software to be used in your environment.
- Avoid old and unsupported apps to run.
- Prevent specific software tools that are not allowed in your organization.
- Enable IT to control the access to sensitive data through app usage.

More details are available at the referenced links.

- [Adaptive application controls](../security-center/security-center-adaptive-application.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts in compute resources

**Guidance**: Use the Adaptive Application Control feature, available in Azure Security Center. It is an intelligent, automated, end-to-end solution from Security Center which helps you control which applications can run on your Windows and Linux, Azure and non-Azure machines . It also helps harden your machines against malware. 

This feature is available for both Azure and non-Azure Windows (all versions, classic, or Azure Resource Manager) and Linux machines.

Security Center uses machine learning to analyze the applications running on your machines and creates an allow list from this intelligence. This capability greatly simplifies the process of configuring and maintaining application allow list policies, enabling you to:

- Block or alert on attempts to run malicious applications, including those that might otherwise be missed by antimalware solutions.

- Comply with your organization's security policy that dictates the use of only licensed software.

- Avoid unwanted software to be used in your environment.

- Avoid old and unsupported apps to run.

- Prevent specific software tools that are not allowed in your organization.

- Enable IT to control the access to sensitive data through app usage.

More details are available at the referenced links.

- [Adaptive application controls](../security-center/security-center-adaptive-application.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 6.13: Physically or logically segregate high risk applications

**Guidance**: For sensitive or high-risk applications with Azure Cloud Services, implement separate subscriptions, or management groups to provide isolation.

Use a network security group, create an Inbound security rule, choose a service such as http, choose a custom port as well, give it a priority and a name. The priority affects the order in which the rules are applied, the lower the numerical value, the earlier the rule is applied. You will need to associate your network security group to a subnet or a specific network interface to isolate or segment the network traffic based on your business needs.

More details are available at the referenced links.

- [Tutorial - Filter network traffic with a network security group using the Azure portal](../virtual-network/tutorial-filter-network-traffic.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Secure configuration

*For more information, see the [Azure Security Benchmark: Secure configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use the recommendations from Azure Security Center as a secure configuration baseline for your Azure Cloud Services resources. 

On the Azure portal, choose Security Center, then Compute &amp; apps, and Azure Cloud Services to see the recommendations applicable to your service resources.

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Not applicable to Azure Cloud Services. It is based on the classic deployment model. It is recommended to use a third-party solution to maintain secure Azure resource configurations

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.5: Securely store configuration of Azure resources

**Guidance**: Azure Cloud Service's configuration file stores the operating attributes for a resource. You can store a copy of the configuration files to a secure storage account.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Not applicable to Azure Cloud Services. It is based on the classic deployment model and cannot be managed by Azure Resource Manager deployment-based configuration tools.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Not applicable to Azure Cloud Services. This recommendation is applicable to Infrastructure as a service (IaaS) based compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Azure Security Center to perform baseline scans for your Azure Resources.  

- [How to remediate recommendations in Azure Security Center](../security-center/security-center-remediate-recommendations.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: In Azure Security Center, choose Compute &amp; Apps feature, and follow the recommendations for virtual machines, servers, and containers.

- [Understand Azure Security Center container recommendations](/azure/security-center/security-center-container-recommendations)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.11: Manage Azure secrets securely

**Guidance**: Azure Cloud Services is based on a classic deployment model and does not integrate with Azure Key Vault.

You can secure secrets such as credentials which are used in Azure Cloud Services so that you do not have to type in a password each time. 
To begin with, specify a plain text password, convert it to a secure string using ConvertTo-SecureString, PowerShell command. Next, convert this secure string into an encrypted standard string using ConvertFrom-SecureString.  You can now save this encrypted standard string to a file using Set-Content.

Additionally, it is recommended to store the private keys for certificates used in Azure Cloud Services to a secured storage.

- [Configure Remote Desktop from PowerShell](cloud-services-role-enable-remote-desktop-powershell.md#configure-remote-desktop-from-powershell)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.13: Eliminate unintended credential exposure

**Guidance**: Secure secrets such as credentials used in Azure Cloud Services so that you do not have to type in a password each time. 
 

To begin, specify a plain text password, change it to a secure string using ConvertTo-SecureString, PowerShell command. Next, convert this secure string into an encrypted standard string using ConvertFrom-SecureString. Now save this encrypted standard string to a file using Set-Content command.

Store the private keys for certificates used in Azure Cloud Services to a secured storage location.

- [Configure Remote Desktop from PowerShell](cloud-services-role-enable-remote-desktop-powershell.md#configure-remote-desktop-from-powershell)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see the [Azure Security Benchmark: Malware defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally managed antimalware software

**Guidance**: Microsoft Antimalware for Azure is available for Azure Cloud Services and Virtual Machines. It is a free real-time protection that helps identify and remove viruses, spyware, and other malicious software. It generates alerts when known malicious or unwanted software tries to install itself or run on your Azure systems. 

Use the PowerShell based Antimalware cmdlet to get the Antimalware configuration, with "Get-AzureServiceAntimalwareConfig".

Enable the Antimalware extension with a PowerShell script in the Startup Task in Azure Cloud Services.

Choose the Adaptive application control feature in Azure Security Center, an intelligent, automated, end-to-end solution. It helps harden your machines against malware and enables you to block or alert on attempts to run malicious applications, including those that might otherwise be missed by antimalware solutions.

- [How can I add an Antimalware extension for my Azure Cloud Services in an automated way](https://docs.microsoft.com/azure/cloud-services/cloud-services-configuration-and-management-faq?&amp;preserve-view=true#how-can-i-add-an-antimalware-extension-for-my-cloud-services-in-an-automated-way)

- [Antimalware Deployment Scenarios](../security/fundamentals/antimalware.md#antimalware-deployment-scenarios)

- [Adaptive application controls](../security-center/security-center-adaptive-application.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Incident response

*For more information, see the [Azure Security Benchmark: Incident response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert. 

Clearly mark subscriptions (for example, production, non-production) and create a naming system to clearly identify and categorize Azure resources.

**Azure Security Center monitoring**: Not applicable

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

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Security Center data connector to stream the alerts to Azure Sentinel. 

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

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies: 
https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1 

- [You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
