---
title: Azure security baseline for Azure Cognitive Search
description: The Azure Cognitive Search security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: search
ms.topic: conceptual
ms.date: 08/28/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Cognitive Search

This security baseline applies guidance from the [Azure Security Benchmark](../security/benchmarks/overview.md) to Azure Cognitive Search. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Cognitive Search. **Controls** not applicable to Azure Cognitive Search have been excluded. To see how Azure Cognitive Search completely maps to the Azure Security Benchmark, see the [full Azure Cognitive Search security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see the [Azure Security Benchmark: Network security](/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33328.).

**Guidance**: Configure your search service's firewall by restricting access to clients from specific public IP address ranges, select virtual networks, or specific Azure resources. You can also configure Private Endpoints so traffic to the search service from your enterprise travels exclusively over private networks.

- [How to configure the Azure Cognitive Search firewall](service-configure-firewall.md)

- [How to configure Private Endpoints for Azure Cognitive Search](service-create-private-endpoint.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33329.).

**Guidance**: Azure Cognitive Search cannot be deployed directly into a virtual network, but if your client application or data sources are in a virtual network, you can monitor and log traffic for those in-network components, including requests sent to a search service in the cloud. Standard recommendations include enabling a network security group flow log and sending logs to either Azure Storage or a Log Analytics workspace. You could optionally use Traffic Analytics for insights into traffic patterns.

+ [How to enable network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

+ [How to enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

+ [Understand network security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 1.4: Deny communications with known malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33331.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 1.5: Record network packets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33332.).

**Guidance**: For Azure Virtual Machines (VMs) that will be connecting to your Azure Cognitive Search service, enable network security group (NSG) flow logs for the NSGs protecting those VMs and send logs into an Azure Storage account for traffic audit. If required for investigating anomalous activity, enable Network Watcher packet capture.

+ [How to Enable NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)+ [How to enable Network Watcher](../network-watcher/network-watcher-create.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33333.).

**Guidance**: Cognitive Search does not support network intrusion detection, but as intrusion mitigation, you can configure firewall rules to specify which ports the search service accepts requests from. You can also configure a private endpoint to keep search traffic off the public internet.

+ [How to configure customer-managed keys for data encryption](search-security-manage-encryption-keys.md)
+ [How to get customer-managed key information from indexes and synonym maps](search-security-get-encryption-keys.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33334.).

**Guidance**: Not applicable; this recommendation is intended for web applications running on Azure App Service or compute resources.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33335.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33336.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33337.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33338.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Logging and monitoring

*For more information, see the [Azure Security Benchmark: Logging and monitoring](/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33339.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33340.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33341.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 2.4: Collect security logs from operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33342.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33343.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 2.6: Monitor and review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33344.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33345.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33346.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 2.9: Enable DNS query logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33347.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 2.10: Enable command-line audit logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33348.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Identity and access control

*For more information, see the [Azure Security Benchmark: Identity and access control](/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33349.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.2: Change default passwords where applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33350.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33351.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33352.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33353.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33354.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33355.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.8: Manage Azure resources only from approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33356.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33357.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33358.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.11: Monitor attempts to access deactivated credentials

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33359.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.12: Alert on account login behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33360.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33361.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Data protection

*For more information, see the [Azure Security Benchmark: Data protection](/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33362.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33363.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33364.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33365.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33366.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.6: Use Azure RBAC to manage access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33367.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.7: Use host-based data loss prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33368.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33369.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33370.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Vulnerability management

*For more information, see the [Azure Security Benchmark: Vulnerability management](/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33371.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 5.2: Deploy automated operating system patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33372.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 5.3: Deploy an automated patch management solution for third-party software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33373.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 5.4: Compare back-to-back vulnerability scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33374.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33375.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Inventory and asset management

*For more information, see the [Azure Security Benchmark: Inventory and asset management](/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33376.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33377.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33378.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.4: Define and maintain an inventory of approved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33379.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33380.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33381.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33382.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33383.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33384.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.10: Maintain an inventory of approved software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33385.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33386.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.12: Limit users' ability to execute scripts in compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33387.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33388.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Secure configuration

*For more information, see the [Azure Security Benchmark: Secure configuration](/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33389.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.2: Establish secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33390.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33391.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.4: Maintain secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33392.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33393.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.6: Securely store custom operating system images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33394.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.7: Deploy configuration management tools for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33395.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.8: Deploy configuration management tools for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33396.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.9: Implement automated configuration monitoring for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33397.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.10: Implement automated configuration monitoring for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33398.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33399.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33400.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33401.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Malware defense

*For more information, see the [Azure Security Benchmark: Malware defense](/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed antimalware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33402.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33403.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 8.3: Ensure antimalware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33404.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Data recovery

*For more information, see the [Azure Security Benchmark: Data recovery](/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33405.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33406.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 9.3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33407.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 9.4: Ensure protection of backups and customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33408.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Incident response

*For more information, see the [Azure Security Benchmark: Incident response](/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33409.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33410.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33415.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33411.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33412.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33413.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Penetration tests and red team exercises

*For more information, see the [Azure Security Benchmark: Penetration tests and red team exercises](/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/33414.).

**Guidance**: None.

**Azure Security Center monitoring**: Unset. Please provide a value in the work item.

**Responsibility**: Unset. Please provide a value in the work item.

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
