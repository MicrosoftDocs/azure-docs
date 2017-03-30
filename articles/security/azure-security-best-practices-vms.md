---
title: Azure virtual machine security best practices | Microsoft Docs
description: This article provides a variety of security best practices to be used in virtual machines located in Azure.
services: security
documentationcenter: na
author: YuriDio
manager: mbaldwin
editor: ''

ms.assetid: 5e757abe-16f6-41d5-b1be-e647100036d8
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/02/2017
ms.author: yurid

---
# Best practices for Azure VM security

In most infrastructure as a service (IaaS) scenarios, [Azure virtual machines (VMs)](https://docs.microsoft.com/en-us/azure/virtual-machines/) are the main workload for organizations that use cloud computing. This fact is especially evident in [hybrid scenarios](https://social.technet.microsoft.com/wiki/contents/articles/18120.hybrid-cloud-infrastructure-design-considerations.aspx) where organizations want to slowly migrate workloads to the cloud. In such scenarios, follow the [general security considerations for IaaS](https://social.technet.microsoft.com/wiki/contents/articles/3808.security-considerations-for-infrastructure-as-a-service-iaas.aspx), and apply security best practices to all your VMs.

This article discusses various VM security best practices, each derived from our customers' and our own direct experiences with VMs.

The best practices are based on a consensus of opinion, and they work with current Azure platform capabilities and feature sets. Because opinions and technologies can change over time, we plan to update this article regularly to reflect those changes.

For each best practice, the article explains:

* What the best practice is.
* Why it's a good idea to enable it.
* How you can learn to enable it.
* What might happen if you fail to enable it.
* Possible alternatives to the best practice.

The article examines the following VM security best practices:

* VM authentication and access control
* VM availability and network access
* Protect data at rest in VMs by enforcing encryption
* Manage your VM updates
* Manage your VM security posture
* Monitor VM performance

## VM authentication and access control

The first step in protecting your VM is to ensure that only authorized users are able to set up new VMs. You can use [Azure Resource Manager policies](../azure-resource-manager/resource-manager-policy.md) to establish conventions for resources in your organization, create customized policies, and apply these policies to resources, such as [resource groups](../azure-resource-manager/resource-group-overview.md).

VMs that belong to a resource group naturally inherit its policies. Although we recommend this approach to managing VMs, you can also control access to individual VM policies by using [role-based access control (RBAC)](../active-directory/role-based-access-control-configure.md).

When you enable Resource Manager policies and RBAC to control VM access, you help improve overall VM security. We recommend that you consolidate VMs with the same life cycle into the same resource group. By using resource groups, you can deploy, monitor, and roll up billing costs for your resources. To enable users to access and set up VMs, use a [least privilege approach](https://technet.microsoft.com/en-us/windows-server-docs/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models). And when you assign privileges to users, plan to use the following built-in Azure roles:

- [Virtual Machine Contributor](../active-directory/role-based-access-built-in-roles.md#virtual-machine-contributor): Can manage VMs, but not the virtual network or storage account to which they are connected.
- [Classic Virtual Machine Contributor](../active-directory/role-based-access-built-in-roles.md#classic-virtual-machine-contributor): Can manage VMs created by using the classic deployment model, but not the virtual network or storage account to which the VMs are connected.
- [Security Manager](../active-directory/role-based-access-built-in-roles.md#security-manager): Can manage security components, security policies, and VMs.
- [DevTest Labs User](../active-directory/role-based-access-built-in-roles.md#devtest-labs-user): Can view everything and connect, start, restart, and shut down VMs.

Don't share accounts and passwords between administrators, and don't reuse passwords across multiple user accounts or services, particularly passwords for social media or other non-administrative activities. Ideally, you should use [Azure Resource Manager](../azure-resource-manager/resource-group-authoring-templates.md) templates to set up your VMs securely. By using this approach, you can strengthen your deployment choices and enforce security settings throughout the deployment.

Organizations that do not enforce data-access control by taking advantage of capabilities such as RBAC might be granting their users more privileges than necessary. Inappropriate user access to certain data can directly compromise that data.

## VM availability and network access

If your VM runs critical applications that need to have high availability, we strongly recommend that you use multiple VMs. For better availability, create at least two VMs in the [availability set](../virtual-machines/windows/infrastructure-availability-sets-guidelines.md).

[Azure Load Balancer](../load-balancer/load-balancer-overview.md) also requires that load-balanced VMs belong to the same availability set. If these VMs must be accessed from the Internet, you must configure an [Internet-facing load balancer](../load-balancer/load-balancer-internet-overview.md).

When VMs are exposed to the Internet, it is important that you [control network traffic flow with network security groups (NSGs)](../virtual-network/virtual-networks-nsg.md). Because NSGs can be applied to subnets, you can minimize the number of NSGs by grouping your resources by subnet and then applying NSGs to the subnets. The intent is to create a layer of network isolation, which you can do by properly configuring the [network security](../best-practices-network-security.md) capabilities in Azure.

You can also use the just-in-time (JIT) VM-access feature from Azure Security Center to control who has remote access to a specific VM, and for how long.

Organizations that don't enforce network-access restrictions to Internet-facing VMs are exposed to security risks, such as a Remote Desktop Protocol (RDP) Brute Force attack.

## Protect data at rest in your VMs by enforcing encryption

[Data encryption at rest](https://blogs.microsoft.com/cybertrust/2015/09/10/cloud-security-controls-series-encrypting-data-at-rest/) is a mandatory step toward data privacy, compliance, and data sovereignty. [Azure Disk Encryption](../security/azure-security-disk-encryption.md) enables IT administrators to encrypt Windows and Linux IaaS VM disks. Disk Encryption combines the industry-standard Windows BitLocker feature and the Linux dm-crypt feature to provide volume encryption for the OS and the data disks.

You can apply Disk Encryption to help safeguard your data to meet your organizational security and compliance requirements. Your organization should consider using encryption to help mitigate risks related to unauthorized data access. We also recommend that you encrypt your drives before you write sensitive data to them.

Be sure to encrypt your VM data volumes to protect them at rest in your Azure storage account. Safeguard the encryption keys and secret by using [Azure Key Vault](https://azure.microsoft.com/en-us/documentation/articles/key-vault-whatis/).

Organizations that do not enforce data encryption are more exposed to data-integrity issues. For example, unauthorized or rogue users might steal data in compromised accounts or gain unauthorized access to data coded in ClearFormat. Besides taking on such risks, to comply with industry regulations, companies must prove that they are exercising diligence and using correct security controls to enhance their data security.

To learn more about Disk Encryption, see [Azure Disk Encryption for Windows and Linux IaaS VMs](azure-security-disk-encryption.md).


## Manage your VM updates

Because Azure VMs, like all on-premises VMs, are intended to be user-managed, Azure doesn't push Windows updates to them. You are, however, encouraged to leave the automatic Windows Update setting enabled. Another option is to deploy [Windows Server Update Services (WSUS)](https://technet.microsoft.com/windowsserver/bb332157.aspx) or another suitable update-management product either on another VM or on-premises. Both WSUS and Windows Update keep VMs current. We also recommend that you use a scanning product to verify that all your IaaS VMs are up to date.

Stock images provided by Azure are routinely updated to include the most recent round of Windows updates. However, there is no guarantee that the images will be current at deployment time. A slight lag (of no more than a few weeks) following public releases might be possible. Checking for and installing all Windows updates should be the first step of every deployment. This measure is especially important to apply when you deploy images that come from either you or your own library. Images that are provided as part of the Azure Marketplace are updated automatically by default.

Organizations that don't enforce software-update policies are more exposed to threats that exploit known, previously fixed vulnerabilities. Besides risking such threats, to comply with industry regulations, companies must prove that they are exercising diligence and using correct security controls to help ensure the security of their workload located in the cloud.

It is important to emphasize that software-update best practices for traditional datacenters and Azure IaaS have many similarities. We therefore recommend that you evaluate your current software update policies to include VMs.

## Manage your VM security posture

Cyber threats are evolving, and safeguarding your VMs requires a rich monitoring capability that can quickly detect threats, prevent unauthorized access to your resources, trigger alerts, and reduce false positives. The security posture for such a workload comprises all security aspects of the VM, from update management to secure network access.

To monitor the security posture of your [Windows](../security-center/security-center-virtual-machine.md) and [Linux VMs](../security-center/security-center-linux-virtual-machine.md), use [Azure Security Center](../security-center/security-center-intro.md). In Azure Security Center, safeguard your VMs by taking advantage of the following capabilities:

* Apply OS security settings with recommended configuration rules
* Identify and download system security and critical updates that might be missing
* Deploy Endpoint antimalware protection recommendations
* Validate disk encryption
* Assess and remediate vulnerabilities
* Detect threats

Security Center can actively monitor for threats, and potential threats are exposed under **Security Alerts**. Correlated threats are aggregated in a single view called **Security Incident**.

To understand how Security Center can help you identify potential threats in your VMs located in Azure, watch the following video:

<iframe src="https://channel9.msdn.com/Blogs/Azure-Security-Videos/Azure-Security-Center-in-Incident-Response/player" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

Organizations that don't enforce a strong security posture for their VMs remain unaware of potential attempts by unauthorized users to circumvent established security controls.

## Monitor VM performance

Resource abuse can be a problem when VM processes consume more resources than they should. Performance issues with a VM can lead to service disruption, which violates the security principle of availability. For this reason, it is imperative to monitor VM access not only reactively, while an issue is occurring, but also proactively, against baseline performance as measured during normal operation.

By analyzing [Azure diagnostic log files](https://azure.microsoft.com/en-us/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/), you can monitor your VM resources and identify potential issues that might compromise performance and availability. The Azure Diagnostics Extension provides monitoring and diagnostics capabilities on Windows-based VMs. You can enable these capabilities by including the extension as part of the [Azure Resource Manager template](../virtual-machines/windows/extensions-diagnostics-template.md).

You can also use [Azure Monitor](../monitoring-and-diagnostics/monitoring-overview-metrics.md) to gain visibility into your resource’s health.

Organizations that don't monitor VM performance are unable to determine whether certain changes in performance patterns are normal or abnormal. If the VM is consuming more resources than normal, such an anomaly could indicate a potential attack from an external resource or a compromised process running in the VM.
