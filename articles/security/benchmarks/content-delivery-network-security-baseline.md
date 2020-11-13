---
title: Azure security baseline for Content Delivery Network
description: The Content Delivery Network security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: azure-cdn
ms.topic: conceptual
ms.date: 01/01/2000
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Content Delivery Network

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](overview.md) to Content Delivery Network. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Content Delivery Network. **Controls** not applicable to Content Delivery Network have been excluded.

To see how Content Delivery Network completely maps to the Azure Security Benchmark, see the [full Content Delivery Network security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](/azure/security/benchmarks/security-controls-v2-network-security).*

### NS-1: Implement security for internal traffic

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40584).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Microsoft Azure Content Delivery Network does not support deploying directly into a virtual network

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-2: Connect private networks together

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40585).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network is not designed to deploy into or be secured to a private network, this control is intended to describe network connectivity and does not apply.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-3: Establish private network access to Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40586).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable, Content Delivery Network is not designed to deploy into or be secured to a virtual network for access.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-4: Protect applications and services from external network attacks

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40587).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Content Delivery Network does not support deploying directly into a virtual network,. Because of this you can not leverage traditional networking features to prevent denial of service (DDoS) attacks with native Azure network features like DDoS Protection Standard.

CDN is not intended to run web applications, and does not require you to configure any additional settings or deploy any extra network services to protect it from external network attacks targeting web applications. A content delivery network provides DDoS protection by design 

- [Tutorial - Azure CDN DDoS protection](../../cdn/cdn-ddos.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40588).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable, Content Delivery Network does not support deploying into a virtual network and cannot be configured with an IDS or IPS solution for detecting or preventing threats on the network.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-6: Simplify network security rules

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40589).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for offerings that can be deployed into Azure Virtual Networks, or have the capability to define groupings of allowed IP ranges for efficient management. Content Delivery Network does not currently support service tags, or it is not designed to deploy into Azure virtual networks

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### NS-7: Secure Domain Name Service (DNS)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40590).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network  does not expose its underlying DNS configurations, these settings are maintained by Microsoft.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](/azure/security/benchmarks/security-controls-v2-identity-management).*

### IM-1: Standardize Azure Active Directory as the central identity and authentication system

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40570).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network is not integrated with Azure Active Directory (Azure AD).

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-2: Manage application identities securely and automatically

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40571).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not use any identities or manage any secrets for identities.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-3: Use Azure AD single sign-on (SSO) for application access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40572).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not support single sign-on for authentication to its resources.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Not applicable

### IM-4: Use strong authentication controls for all Azure Active Directory based access

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40573).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not provide capability to support strong authentication.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-5: Monitor and alert on account anomalies

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40574).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not use any sensitive accounts or there is no account activity logs or logs are not exportable by customers.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-6: Restrict Azure resource access based on conditions

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40575).

**Guidance**: Restrict access to content on your Content Delivery Network by country or region. Create rules on specific paths on your CDN endpoint to allow or block content in selected countries or regions using the geo-filtering feature,

- [Restrict Azure CDN content by country or region](../../cdn/cdn-restrict-access-by-country.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IM-7: Eliminate unintended credential exposure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40576).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not allow customer to deploy any persisted data into the running environment.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### IM-8: Secure user access to legacy applications

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40612).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network doesn't access any legacy applications.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](/azure/security/benchmarks/security-controls-v2-privileged-access).*

### PA-1: Protect and limit highly privileged users

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40577).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; CDN doesn't use any administrative accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-2: Restrict administrative access to business-critical systems

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40578).

**Guidance**: Use Azure role-based access control (Azure RBAC) in Content Delivery Network to isolate access to business-critical systems by restricting which accounts are granted privileged access to the subscriptions and management groups they are in.

Also restrict access to the management, identity, and security systems that have administrative access to your business critical access such as Active Directory Domain Controllers (DCs), security tools, and system management tools with agents installed on business critical systems. Attackers who compromise these management and security systems can immediately weaponize them to compromise business critical assets.

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access-controls.

- [Azure Components and Reference model](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151) 

- [Management Group Access](../../governance/management-groups/overview.md#management-group-access) 

- [Azure subscription administrators](../../cost-management-billing/manage/add-change-subscription-administrator.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### PA-3: Review and reconcile user access regularly

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40579).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network doesn't use any user accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-4: Set up emergency access in Azure AD

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40580).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network doesn't support emergency accounts or doesn't need emergency accounts.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-5: Automate entitlement management 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40581).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network doesn't support any automation on account or role management.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PA-6: Use privileged access workstations

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40582).

**Guidance**: Secured, isolated workstations are critically important for the security of sensitive roles like administrators, developers, and critical service operators. Use highly secured user workstations and/or Azure Bastion for administrative tasks. Use Azure Active Directory (Azure AD), Microsoft Defender Advanced Threat Protection (ATP), and/or Microsoft Intune to deploy a secure and managed user workstation for administrative tasks. The secured workstations can be centrally managed to enforce secured configuration including strong authentication, software and hardware baselines, restricted logical and network access.

- [Understand privileged access workstations](../../active-directory/devices/concept-azure-managed-workstation.md) 

- [Deploy a privileged access workstation](../../active-directory/devices/howto-azure-managed-workstation.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-7: Follow just enough administration (least privilege principle) 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40583).

**Guidance**: Content Delivery Network is integrated with Azure role-based access control (RBAC) to manage its resources. Use Azure RBAC to manage Azure resource access through role assignments. Assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal. 

Limit the privileges you assign to resources through the Azure RBAC as required by the roles. This complements the just in time (JIT) approach of Azure AD Privileged Identity Management (PIM) and should be reviewed periodically. 

Additionally, use built-in roles to allocate permission and only create custom role when required.

- [What is Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) 

- [How to configure RBAC in Azure](../../role-based-access-control/role-assignments-portal.md) 

- [How to use Azure AD identity and access reviews](../../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### PA-8: Choose approval process for Microsoft support  

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40639).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network service does not store customer data and thus has no need for accessing customer data.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](/azure/security/benchmarks/security-controls-v2-data-protection).*

### DP-1: Discovery, classify and label sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40591).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not store, process or transmit data classified as sensitive.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-2: Protect sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40592).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not store, process or transmit data classified as sensitive

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-3: Monitor for unauthorized transfer of sensitive data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40593).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not store, process or transmit data classified as sensitive.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### DP-4: Encrypt sensitive information in transit

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40594).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Use encryption to protect traffic on external and public networks as it is critical for data protection. Additionally:

- Use access controls,

- protect data in transit against ‘out of band’ attacks (such as traffic capture) using encryption to ensure that attackers cannot easily read or modify the data.
- Ensure that any clients connecting to your Azure resources for HTTP traffic can negotiate TLS v1.2 or greater.
- Use SSH (for Linux) or RDP/TLS (for Windows) for remote management, instead of unencrypted protocols

- Disable obsoleted SSL/TLS/SSH versions, protocols, and weak ciphers

By default, Azure provides data-in-transit encryption for data traffic between Azure data centers. 

- [Tutorial -  How to Configure HTTPS on a Content Delivery Network custom domain](https://docs.microsoft.com/azure/cdn/cdn-custom-ssl?tabs=option-1-default-enable-https-with-a-cdn-managed-certificate)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

### DP-5: Encrypt sensitive data at rest

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40595).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Azure provides data at rest encryption by default. For highly sensitive data, you have options to implement additional encryption at rest on all Azure resources where available. 
Azure manages your encryption keys by default, but it also provides options to manage your own keys (customer managed keys) for certain Azure services.

If required for compliance on compute resources, Implement a third-party tool, such as an automated host-based Data Loss Prevention solution, to enforce access controls to data even when data is copied off a system.

- [Understand encryption at rest in Azure](../fundamentals/encryption-atrest.md#encryption-at-rest-in-microsoft-cloud-services) 

- [How to configure customer managed encryption keys](/azure/storage/common/storage-encryption-keys-portal) 

- [Data encryption models](../fundamentals/encryption-models.md) 

- [Data at rest double encryption in Azure](../fundamentals/double-encryption.md#data-at-rest)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Microsoft

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](/azure/security/benchmarks/security-controls-v2-asset-management).*

### AM-1: Ensure security team has visibility into risks for assets

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40613).

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions, for them to monitor security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could  be the responsibility of a central security team or a local team. However, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions. 

Note: that additional permissions may be required for visibility into workloads and services. 

- [Overview of Security Reader Role](../../role-based-access-control/built-in-roles.md#security-reader)

- [Overview of Azure Management Groups](../../governance/management-groups/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-2: Ensure security team has access to asset inventory and metadata

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40614).

**Guidance**: Apply tags to your Azure resources, resource groups, and subscriptions to logically organize them into a taxonomy. Each tag consists of a name and a value pair. For example, you can apply the name "Environment" and the value "Production" to all the resources in production.

- [How to create queries with Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md) 

- [Azure Security Center asset inventory management](../../security-center/asset-inventory.md) 

- [Resource naming and tagging decision guide](https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### AM-3: Use only approved Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40615).

**Guidance**: Use Azure Policy to audit and restrict which services users can provision in your environment. Use Azure Resource Graph to query for and discover resources within their subscriptions. You can also use Azure Monitor to create rules to trigger alerts when a non-approved service is detected.

- [How to configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md) 

- [How to deny a specific resource type with Azure Policy](../../governance/policy/samples/built-in-policies.md#general) 

- [How to create queries with Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-4: Ensure security of asset lifecycle management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40616).

**Guidance**: Content Data Network can not be used for ensuring security of assets in a lifecycle management process. It is the customer's responsibility to maintain attributes and network configurations of assets which are considered high-impact. It is recommended that the customer create a process to capture the attribute and network-configuration changes, measure the change-impact and create remediation tasks, as applicable.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### AM-5: Limit users' ability to interact with Azure Resource Manager

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40617).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not use Azure Active Directory (Azure AD) for Authentication. Thus you cannot restrict access to Azure Resource Manager via Azure AD Conditional Access policies.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### AM-6: Use only approved applications in compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40618).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network is not comprised of any virtual machines or containers which would either expose compute resources or allow customers to install applications on them.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](/azure/security/benchmarks/security-controls-v2-logging-threat-protection).*

### LT-1: Enable threat detection for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40596).

**Guidance**: Content Delivery Network does not provide native capabilities to monitor security threats related to its resources.

Forward any logs from Content Delivery Network to your Security Information and Event Management (SIEM) solution which can be used to set up custom threat detections. 

Monitoring different types of Azure assets for potential threats and anomalies with focus on getting high quality alerts to reduce false positives for analysts to sort through. Alerts can be sourced from log data, agents, or other data.

- [Create custom analytics rules to detect threats](../../sentinel/tutorial-detect-threats-custom.md) 

- [Cyber threat intelligence with Azure Sentinel](/azure/architecture/example-scenario/data/sentinel-threat-intelligence)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### LT-2: Enable threat detection for Azure identity and access management

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40597).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: CDN does not support authentication or authorization via Azure Active Directory (Azure AD) for control or data-plane actions.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-3: Enable logging for Azure network activities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40598).

**Guidance**: Content Delivery Network is not intended to deploy into virtual networks, because of this you are unable to enable network security group flow logging, route traffic through a firewall or perform packet captures.

Content Delivery Network logs all network traffic that it processes for customer access. Enable the network flow capability within your deployed offering resources and configure these logs to be sent to a storage account for long term retention and auditing.

- [Tutorial -  How to setup diagnostic log in Azure Content Delivery Network](../../cdn/cdn-azure-diagnostic-logs.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### LT-4: Enable logging for Azure resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40599).

**Guidance**: Activity logs, which are automatically available, contain all write operations (PUT, POST, DELETE) for your Content Delivery Network resources except read operations (GET). Activity logs can be used to find an error when troubleshooting or to monitor how a user in your organization modified a resource.

Enable Azure resource logs for CDN,  You can use Azure Security Center and Azure Policy to enable resource logs and log data collecting. These logs can be critical for later investigating security incidents and performing forensic exercises.

- [How to collect platform logs and metrics with Azure Monitor](../../azure-monitor/platform/diagnostic-settings.md) 

- [Understand logging and different log types in Azure](../../azure-monitor/platform/platform-logs-overview.md) 

- [Understand Azure Security Center data collection](../../security-center/security-center-enable-data-collection.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### LT-5: Centralize security log management and analysis

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40600).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not produce or process any security related logs which would need to be collected centrally for security log management and analysis.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-6: Configure log storage retention

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40601).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Content Delivery Network does not currently produce any security-related logs. Customer cannot set up any log retention.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### LT-7: Use approved time synchronization sources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40602).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Content Delivery Network does not support configuring your own time synchronization sources. It relies on Microsoft time synchronization sources and is not exposed to customers for configuration.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](/azure/security/benchmarks/security-controls-v2-incident-response).*

### IR-1: Preparation – update incident response process for Azure

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40603).

**Guidance**: Ensure your organization has processes to respond to security incidents, has updated these processes for Azure, and is regularly exercising them to ensure readiness.

- [Implement security across the enterprise environment](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Incident response reference guide](/microsoft-365/downloads/IR-Reference-Guide.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-2: Preparation – setup incident notification

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40604).

**Guidance**: Set up security incident contact information in Azure Security Center. This contact information is used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. You also have options to customize incident alert and notification in different Azure services based on your incident response needs. 

- [How to set the Azure Security Center security contact](../../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IR-3: Detection and analysis – create incidents based on high quality alerts

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40605).

**Guidance**: Ensure you have a process to create high quality alerts and measure the quality of alerts. This allows you to learn lessons from past incidents and prioritize alerts for analysts, so they don’t waste time on false positives. 

High quality alerts can be built based on experience from past incidents, validated community sources, and tools designed to generate and clean up alerts by fusing and correlating diverse signal sources. 

Azure Security Center provides high quality alerts across many Azure assets. You can use the ASC data connector to stream the alerts to Azure Sentinel. Azure Sentinel lets you create advanced alert rules to generate incidents automatically for an investigation. 

Export your Azure Security Center alerts and recommendations using the export feature to help identify risks to Azure resources. Export alerts and recommendations either manually or in an ongoing, continuous fashion.

- [How to configure export](../../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-4: Detection and analysis – investigate an incident

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40606).

**Guidance**: Ensure analysts can query and use diverse data sources as they investigate potential incidents, to build a full view of what happened. Diverse logs should be collected to track the activities of a potential attacker across the kill chain to avoid blind spots.  You should also ensure insights and learnings are captured for other analysts and for future historical reference.  

The data sources for investigation include the centralized logging sources that are already being collected from the in-scope services and running systems, but can also include:

- Network data – use network security groups' flow logs, Azure Network Watcher, and Azure Monitor to capture network flow logs and other analytics information. 

- Snapshots of running systems: 

    - Use Azure virtual machine's snapshot capability to create a snapshot of the running system's disk. 

    - Use the operating system's native memory dump capability to create a snapshot of the running system's memory.

    - Use the snapshot feature of the Azure services or your software's own capability to create snapshots of the running systems.

Azure Sentinel provides extensive data analytics across virtually any log source and a case management portal to manage the full lifecycle of incidents. Intelligence information during an investigation can be associated with an incident for tracking and reporting purposes. 

- [Snapshot a Windows machine's disk](../../virtual-machines/windows/snapshot-copy-managed-disk.md)

- [Snapshot a Linux machine's disk](../../virtual-machines/linux/snapshot-copy-managed-disk.md)

- [Microsoft Azure Support diagnostic information and memory dump collection](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) 

- [Investigate incidents with Azure Sentinel](../../sentinel/tutorial-investigate-cases.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-5: Detection and analysis – prioritize incidents

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40607).

**Guidance**: Provide context to analysts on which incidents to focus on first based on alert severity and asset sensitivity. 

Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert, as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark resources using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-6: Containment, eradication and recovery – automate the incident handling

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40608).

**Guidance**: Automate manual repetitive tasks to speed up response time and reduce the burden on analysts. Manual tasks take longer to execute, slowing each incident and reducing how many incidents an analyst can handle. Manual tasks also increase analyst fatigue, which increases the risk of human error that causes delays, and degrades the ability of analysts to focus effectively on complex tasks. 
Use workflow automation features in Azure Security Center and Azure Sentinel to automatically trigger actions or run a playbook to respond to incoming security alerts. The playbook takes actions, such as sending notifications, disabling accounts, and isolating problematic networks. 

- [Configure workflow automation in Security Center](../../security-center/workflow-automation.md)

- [Set up automated threat responses in Azure Security Center](../../security-center/tutorial-security-incident.md#triage-security-alerts)

- [Set up automated threat responses in Azure Sentinel](../../sentinel/tutorial-respond-threats-playbook.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](/azure/security/benchmarks/security-controls-v2-vulnerability-management).*

### PV-1: Establish secure configurations for Azure services 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40623).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not have provide any security configuration capabilities.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-2: Sustain secure configurations for Azure services

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40624).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not have provide any security configuration capabilities.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-3: Establish secure configurations for compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40625).

**Guidance**: Not applicable; Content Delivery Network does not have provide any security configuration capabilities.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### PV-4: Sustain secure configurations for compute resources

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40626).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this recommendation is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-5: Securely store custom operating system and container images

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40627).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; this guideline is intended for compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### PV-6: Perform software vulnerability assessments

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40628).

>[!NOTE]
>Because the Responsibility field is set to "Microsoft", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Microsoft performs vulnerability management on the underlying systems that support Content Delivery Network.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### PV-7: Rapidly and automatically remediate software vulnerabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40629).

**Guidance**: Rapidly deploy software updates to remediate software vulnerabilities in operating systems and applications. 

Prioritize remediation using a common risk scoring program (for example, Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool. Tailor to your environment using context of which applications present a high security risk and which ones require high uptime.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PV-8: Conduct regular attack simulation

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40630).

**Guidance**: As required, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.
Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](../fundamentals/pen-testing.md)

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Endpoint Security

*For more information, see the [Azure Security Benchmark: Endpoint Security](/azure/security/benchmarks/security-controls-v2-endpoint-security).*

### ES-1: Use Endpoint Detection and Response (EDR)

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40609).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network is not comprised of any virtual machines or containers which would require Endpoint Detection and Response (EDR) protection.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### ES-2: Use centrally managed modern anti-malware software

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40610).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable;  Content Delivery Network does not interact with compute hosts, containers or storage which require anti-malware protection.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### ES-3: Ensure anti-malware software and signatures are updated

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40611).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Content Delivery Network is not comprised of any virtual machines or containers which would require anti-malware protection. Thus it does not require you to configure any additional settings or deploy any extra services to protect it from malware.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Backup and Recovery

*For more information, see the [Azure Security Benchmark: Backup and Recovery](/azure/security/benchmarks/security-controls-v2-backup-recovery).*

### BR-1: Ensure regular automated backups

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40619).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not support data-backup or need them.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### BR-2: Encrypt backup data

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40620).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not support any data-backup encryption.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### BR-3: Validate all backups including customer-managed keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40621).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not support data-backups.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### BR-4: Mitigate risk of lost keys

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40622).

>[!NOTE]
>Because the Responsibility field is set to "Not applicable", this section will be omitted from the published baseline.

**Guidance**: Not applicable; Content Delivery Network does not manage any keys.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Governance and Strategy

*For more information, see the [Azure Security Benchmark: Governance and Strategy](/azure/security/benchmarks/security-controls-v2-governance-strategy).*

### GS-1: Define asset management and data protection strategy 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40631).

**Guidance**: Ensure you document and communicate a clear strategy for continuous monitoring and protection of systems and data. Prioritize discovery, assessment, protection, and monitoring of business-critical data and systems. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Data classification standard in accordance with the business risks

-	Security organization visibility into risks and asset inventory 

-	Security organization approval of Azure services for use 

-	Security of assets through their lifecycle

-	Required access control strategy in accordance with organizational data classification

-	Use of Azure native and third party data protection capabilities

-	Data encryption requirements for in-transit and at-rest use cases

-	Appropriate cryptographic standards

More information is available at the referenced links.

- [Azure Security Architecture Recommendation - Storage, data, and encryption](https://docs.microsoft.com/azure/architecture/framework/security/storage-data-encryption?toc=/security/compass/toc.json&amp;bc=/security/compass/breadcrumb/toc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](https://docs.microsoft.com/azure/security/fundamentals/data-encryption-best-practices?toc=/azure/cloud-adoption-framework/toc.json&amp;bc=/azure/cloud-adoption-framework/_bread/toc.json)

- [Azure Security Benchmark - Asset management](/azure/security/benchmarks/security-benchmark-v2-asset-management)

- [Azure Security Benchmark - Data Protection](/azure/security/benchmarks/security-benchmark-v2-data-protection)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-2: Define enterprise segmentation strategy 

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40638).

**Guidance**: Establish an enterprise-wide strategy to segmenting access to assets using a combination of identity, network, application, subscription, management group, and other controls.

Carefully balance the need for security separation with the need to enable daily operation of the systems that need to communicate with each other and access data.

Ensure that the segmentation strategy is implemented consistently across control types including network security, identity and access models, and application permission/access models, and human process controls.

- [Guidance on segmentation strategy in Azure (video)](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Guidance on segmentation strategy in Azure (document)](/security/compass/governance#enterprise-segmentation-strategy)

- [Align network segmentation with enterprise segmentation strategy](/security/compass/network-security-containment#align-network-segmentation-with-enterprise-segmentation-strategy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-3: Define security posture management strategy

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40632).

**Guidance**: Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](/azure/security/benchmarks/security-benchmark-v2-posture-vulnerability-management)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-4: Align organization roles, responsibilities, and accountabilities

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40633).

**Guidance**: Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, educating everyone on the shared responsibility model, and educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](/azure/cloud-adoption-framework/security/security-top-10#1-people-educate-teams-about-the-cloud-security-journey)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](/azure/cloud-adoption-framework/security/security-top-10#2-people-educate-teams-on-cloud-security-technology)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-5: Define network security strategy

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40634).

**Guidance**: Establish an Azure network security approach as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Centralized network management and security responsibility

-	Virtual network segmentation model aligned with the enterprise segmentation strategy

-	Remediation strategy in different threat and attack scenarios

-	Internet edge and ingress and egress strategy

-	Hybrid cloud and on-premises interconnectivity strategy

-	Up-to-date network security artifacts (e.g. network diagrams, reference network architecture)

For more information, see the following references:
- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure Security Benchmark - Network Security](/azure/security/benchmarks/security-benchmark-v2-network-security)

- [Azure network security overview](../fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-6: Define identity and privileged access strategy

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40635).

**Guidance**: Establish an Azure identity and privileged access approaches as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	A centralized identity and authentication system and its interconnectivity with other internal and external identity systems

-	Strong authentication methods in different use cases and conditions

-	Protection of highly privileged users

-	Anomaly user activities monitoring and handling  

-	User identity and access review and reconciliation process

More information is available at the referenced links.

- [Azure Security Benchmark - Identity management](/azure/security/benchmarks/security-benchmark-v2-identity-management)

- [Azure Security Benchmark - Privileged access](/azure/security/benchmarks/security-benchmark-v2-privileged-access)

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure identity management security overview](../fundamentals/identity-management-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-7: Define logging and threat response strategy

>[!TIP]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/40636).

**Guidance**: Establish a logging and threat response strategy to rapidly detect and remediate threats while meeting compliance requirements. Prioritize providing analysts with high quality alerts and seamless experiences so that they can focus on threats rather than integration and manual steps. 

This strategy should include documented guidance, policy, and standards for the following elements:

-	The security operations (SecOps) organization’s role and responsibilities 

-	A well-defined incident response process aligning with NIST or another industry framework 

-	Log capture and retention to support threat detection, incident response, and compliance needs

-	Centralized visibility of and correlation information about threats, using SIEM, native Azure capabilities, and other sources 

-	Communication and notification plan with your customers, suppliers, and public parties of interest

-	Use of Azure native and third-party platforms for incident handling, such as logging and threat detection, forensics, and attack remediation and eradication

-	Processes for handling incidents and post-incident activities, such as lessons learned and evidence retention

More information is available at the referenced links.

- [Azure Security Benchmark - Logging and threat detection](/azure/security/benchmarks/security-benchmark-v2-logging-threat-detection)

- [Azure Security Benchmark - Incident response](/azure/security/benchmarks/security-benchmark-v2-incident-response)

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

- [Azure enterprise scale, management, and monitoring](/azure/cloud-adoption-framework/ready/enterprise-scale/management-and-monitoring)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
