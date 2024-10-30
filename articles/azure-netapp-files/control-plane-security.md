---
title: Understand Azure NetApp Files control plane security
description: Learn about the different control plane security features in Azure NetApp Files
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 09/30/2024
ms.author: anfdocs
---
# Understand Azure NetApp Files control plane security

Learn about the different control plane security features in Azure NetApp Files to understand what is available to best serve your needs.

## Control plane security concepts

Azure NetApp Files operates within the Azure control plane, utilizing Azure Resource Manager (ARM) to manage resources efficiently. This integration allows for centralized management of all Azure resources, including Azure NetApp Files, through interfaces including APIs, PowerShell, CLI, or the Azure portal. With ARM, you can automate and script tasks, enhancing operational efficiency, and reducing the likelihood of manual errors. 

The control plane also integrates with Azure’s security features, such as [identity and access management (IAM)](/entra/fundamentals/introduction-identity-access-management), to enforce access controls and compliance requirements. This integration ensures that only authorized users can access and manage resources, maintaining a secure environment. 

The control plane also provides tools for monitoring and auditing resource usage and changes, helping maintain visibility and compliance across the Azure environment. This comprehensive integration within the Azure control plane ensures that Azure NetApp Files can be managed effectively, securely, and consistently, providing a robust solution for data management and storage needs.

## Identity and access management

A set of operations and services used to manage and control access to Azure NetApp Files resources. Utilize either built-in or custom role-based access control (RBAC) roles to ensure each user receives only the necessary access. Tailor individual permissions to create a custom RBAC role that suits both users and administrators.

- Use either [built-in](../role-based-access-control/built-in-roles.md) or [custom RBAC](../role-based-access-control/custom-roles.md) roles to ensure only required access is given to each user. 
- Use [individual permissions](../role-based-access-control/permissions/storage.md#microsoftnetapp) to create an appropriate custom RBAC role for users and administrators.

## Encryption key management

Managing Microsoft platform-managed keys or customer-managed keys involves control plane operations that affect:

- **Key management:** The control plane allows you to manage the lifecycle of your encryption keys, including creation, rotation, and deletion. This ensures that you have full control over your data encryption keys.
- **Access control:** Through the control plane, you can define and enforce access policies using Azure RBAC, ensuring only authorized users and services can access or manage your keys.
- **Integration with Azure Key Vault:** The control plane facilitates the integration of Azure NetApp Files with Azure Key Vault, where your customer-managed keys are stored. This integration ensures secure key storage and management. 
- **Encryption operations:** For encryption and decryption operations, the control plane handles Azure Key Vault requests to unwrap the account encryption key so your data is securely encrypted and decrypted as needed. 
- **Auditing and monitoring:** The control plane provides capabilities for auditing and monitoring key usage. This helps you track who accessed your keys and when, enhancing security and compliance.
For more information, see [Configure customer-managed keys](configure-customer-managed-keys.md).

## Network Security Groups management

Managing network security groups (NSGs) in Azure NetApp Files relies on the control plane to oversee and secure network traffic. Benefits include:

- **Traffic management:** The control plane allows you to define and enforce NSG rules, which control the flow of network traffic to and from your Azure NetApp Files. Controlling network traffic ensures that only authorized traffic is allowed, enhancing security. 
- **Configuration and deployment:** Through the control plane, you can configure NSGs on the subnets where your Azure NetApp Files volumes are deployed, including establishing rules for inbound and outbound traffic based on IP addresses, ports, and protocols. 
- **Integration with Azure Services:** The control plane facilitates the integration of NSGs with other Azure services, such as Azure Virtual Network and Azure Key Vault. This integration helps maintain a secure and compliant environment.
- **Monitoring and auditing:** The control plane provides tools for monitoring and auditing network traffic. You can track which rules are being applied and adjust them as needed to ensure optimal security and performance. 
- **Policy Enforcement:** By using the control plane, you can enforce network policies across your Azure environment. This includes applying custom policies to meet specific security requirements and ensuring consistent policy enforcement.

For more information, see [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md) and [Azure NSGs](../virtual-network/network-security-groups-overview.md).

## Routing management

The control plane enables the configuration of User-Defined Routes (UDRs) on the subnets where Azure NetApp Files volumes are deployed. UDRs allow for precise control over the routing of network traffic, ensuring data packets are directed through specific paths such as Network Virtual Appliances (NVAs) for traffic inspection. By defining these routes, network performance can be optimized, and security can be enhanced by controlling how traffic flows within the Azure environment.

For more information, see [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md) and the [UDR overview](../virtual-network/virtual-networks-udr-overview.md#user-defined).

## Resource lock management

Resource locking at the control plane layer ensures that your Azure NetApp Files resources are protected from accidental or malicious deletions and modifications. Locking is important for maintaining the integrity and stability of your storage environment.

[Resource locking](../azure-resource-manager/management/lock-resources.md) protects subscriptions, resource groups, or resources from accidental or malicious user deletions and modifications. The lock overrides any user permissions. Unlike RBAC,  management locks apply a restriction across _all_ users and roles. Take careful consideration when locking any necessary resources to prevent changes after all configuration is in place.

## Monitoring and audit logging

Monitoring, auditing, and logging are critical for maintaining security and compliance in your Azure NetApp Files environment. The control plane logs events related to storage operations, providing a comprehensive record of activities. Logging allows administrators to monitor and detect any suspicious activity, investigate security incidents, and establish accountability.

### Monitoring capabilities

- **Azure Activity log:**
    - **Function:** Provides insights into subscription-level events, such as resource modifications or virtual machine startups. These insights aid in tracking changes and identifying unauthorized activities. To understand how Activity log works, see [Azure Activity log](/azure/azure-monitor/essentials/activity-log).
    - **Use case:** Useful for auditing and compliance, ensuring that all actions within your Azure NetApp Files environment are logged and traceable. 
- **Azure NetApp Files metrics:**
    - **Function:** Azure NetApp Files offers metrics on allocated storage, actual storage usage, volume I/OPS, and latency. These metrics help you understand usage patterns and volume performance. For more information, see [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md).
	- **Use case:** Metrics are essential for performance tuning and capacity planning, allowing you to optimize your storage resources effectively.
- **Azure Service Health:**
    - **Function:** Azure Service Health keeps you informed about the health of your Azure services, providing a personalized view of the status of your environment. For more information, see [Service Health portal classic experience overview](/azure/service-health/service-health-overview).
    - **Use case:** Azure Service Health helps you stay updated on planned maintenance and health advisories, ensuring minimal disruption to your operations.
- **Audit logging:**
    - **Scope:** The control plane logs all PUT, POST, and DELETE API operations against Azure NetApp Files. These logs include actions such as creating snapshots, modifying volumes, and deleting resources. For more information, see [Are Azure activity logs supported in Azure NetApp Files?](faq-security.md#are-azure-activity-logs-supported-on-azure-netapp-files)
    - **Details:** Logs capture detailed information about each operation, including who performed the action, when it was performed, and what changes were made. This level of detail is crucial for auditing and forensic investigations. For a complete list of API operations, see [Azure NetApp Files REST API](/rest/api/netapp).

## Azure Policy

When you use Azure Policy, the control plane ensures that your policies are enforced consistently across your environment. Azure Policy helps maintain compliance with organizational standards and regulatory requirements.

### Azure Policy integration

* **Enforcing standards:**
    - **Custom policies:** You can create custom Azure Policy definitions tailored to your specific needs for Azure NetApp Files. These policies can enforce rules such as ensuring certain configurations, restricting the use of insecure protocols, or mandating encryption. For more information about custom policy definitions, see [Built-in policy definitions for Azure NetApp Files](azure-policy-definitions.md#custom-policy-definitions).
    - **Built-in policies:** Azure provides built-in policy definitions that you can use to enforce common standards. For example, you can restrict the creation of unsecure volumes or audit existing volumes to ensure they meet your security requirements. For more information about built-in policies, see [Custom policy definitions for Azure NetApp Files](azure-policy-definitions.md#built-in-policy-definitions).
* **Policy evaluation:**
    * **Continuous assessment:** The control plane continuously evaluates your resources against the defined policies. If a resource doesn't comply, the control plane can take actions such as denying resource creation, auditing it, or applying specific configurations.
    - **Real-time enforcement:** Policies are enforced in real-time, ensuring any noncompliant actions are immediately addressed to maintain the integrity and security of your environment.

## More information 

- [Security FAQs for Azure NetApp Files](faq-security.md)
- [Azure security baseline for Azure NetApp Files](/security/benchmark/azure/baselines/azure-netapp-files-security-baseline?toc=/azure/azure-netapp-files/TOC.json)
- [Configure customer-managed keys for Azure NetApp Files volume encryption](configure-customer-managed-keys.md)
- [Understand Azure NetApp Files data plane security](data-plane-security.md)
