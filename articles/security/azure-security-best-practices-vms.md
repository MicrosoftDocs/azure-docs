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
# Best practices for Azure virtual machine security

In most infrastructure as a service (IaaS) scenarios, [virtual machines (VMs)](https://docs.microsoft.com/en-us/azure/virtual-machines/) are the main workload for organizations that use cloud computing. This fact is especially evident in [hybrid scenarios](https://social.technet.microsoft.com/wiki/contents/articles/18120.hybrid-cloud-infrastructure-design-considerations.aspx) where organizations want to slowly migrate workloads to the cloud. In such a scenario, you should follow [general security considerations for IaaS](https://social.technet.microsoft.com/wiki/contents/articles/3808.security-considerations-for-infrastructure-as-a-service-iaas.aspx), and apply security best practices to all your Azure VMs.

This article discusses a variety of Azure VM security best practices, each derived from our own and our customers' direct experiences with Azure VMs.

The best practices are based on a consensus of opinion, and they work with Azure platform capabilities and feature sets as they currently exist. Because opinions and technologies change over time, we plan to update this article regularly to reflect those changes.

For each best practice, the article explains:

* What the best practice is.
* Why it's a good idea to enable it.
* How you can learn to enable it.
* What might happen if you fail to enable it.
* Possible alternatives to the best practice.

The article examines the following Azure VM security best practices:

* VM authentication and access control
* VM availability and network access
* Protect data at rest in Azure VMs by enforcing encryption
* Manage VM updates
* Manage your VM secure posture
* Monitor VM performance

## VM authentication and access control

The first step in protecting your VM is to ensure that only authorized users are able to set up new VMs. You can use [Azure Resource Manager policies](../azure-resource-manager/resource-manager-policy.md) to establish conventions for resources in your organization, create customized policies, and apply these policies to resources, such as [resource groups](../azure-resource-manager/resource-group-overview.md).

VMs that belong to a resource group inherit its policies. Although we recommend this approach to managing resources (including VMs) that have various needs and are located in various resource groups, you can also control individual access to VMs by using [role-based access control (RBAC)](../active-directory/role-based-access-control-configure.md).

By enabling Resource Manager policies and RBAC to control VM access, you help improve the overall security of your VM. We recommend that you tightly consolidate VMs that share the same life cycle into the same resource group. When you use resource groups, you can deploy, monitor, and roll up billing costs for your resources. To enable users to access and set up VMs, use a [least privilege approach](https://technet.microsoft.com/en-us/windows-server-docs/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models). And when you assign privileges to users, plan to use the following built-in Azure roles:

- [Virtual Machine Contributor](../active-directory/role-based-access-built-in-roles.md#virtual-machine-contributor): Can manage VMs, but not the virtual network or storage account to which they are connected.
- [Classic Virtual Machine Contributor](../active-directory/role-based-access-built-in-roles.md#classic-virtual-machine-contributor): Can manage classic VMs, but not the virtual network or storage account to which they are connected.
- [Security Manager](../active-directory/role-based-access-built-in-roles.md#security-manager): Can manage security components, security policies, and VMs.
- [DevTest Labs User](../active-directory/role-based-access-built-in-roles.md#devtest-labs-user): Can view everything and connect, start, restart, and shut down VMs.

Don't share accounts and passwords between administrators, and don't reuse passwords across multiple user accounts or services, particularly passwords for social media or other non-administrative activities. Ideally, you should use [Azure Resource Manager](../azure-resource-manager/resource-group-authoring-templates.md) templates to securely set up your VMs. By using this approach you can strengthen your deployment choices and enforce security settings throughout the deployment.

Organizations that do not enforce data-access control by taking advantage of such capabilities as RBAC might be granting their users more privileges than necessary. This can direct lead to data compromise by having access to certain level of data that you shouldn’t have in the first place.

## VM availability and network access

If your VM runs critical applications that need to have high availability, we strongly recommend that you use multiple VMs. For better availability, create at least two VMs in the [availability set](../virtual-machines/virtual-machines-windows-infrastructure-availability-sets-guidelines.md). [Azure Load Balancer](../load-balancer/load-balancer-overview.md) also requires that load-balanced VMs belong to the same availability set. If these VMs must be accessed from the Internet, you will need to configure an [Internet-facing load balancer](../load-balancer/load-balancer-internet-overview.md).

When VMs are exposed to the Internet, it is important that you [control network traffic flow with network security groups (NSGs)](../virtual-network/virtual-networks-nsg.md). Because NSGs can be applied to subnets, you can minimize the number of NSGs by grouping your resources by subnet and by applying NSGs to subnets. The intent is to create a layer of network isolation, which can be accomplished by properly configuring the [network security](../best-practices-network-security.md) capabilities in Azure.

You can also use the just-in-time (JIT) VM-access feature from Azure Security Center to control who has remote access to a specific VM, and for how long. For more information about JIT VM-access capability, watch the following video:

<iframe src="https://channel9.msdn.com/Blogs/Azure-Security-Videos/Azure-Security-Center-Just-in-Time-VM-Access/player" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

Organizations that do not enforce network-access restrictions to Internet-facing VMs are exposed to security risks, such as a Remote Desktop Protocol (RDP) Brute Force attack.

## Protect data at rest in Azure VMs by enforcing encryption

[Data encryption at rest](https://blogs.microsoft.com/cybertrust/2015/09/10/cloud-security-controls-series-encrypting-data-at-rest/) is a mandatory step toward data privacy, compliance, and data sovereignty. [Azure Disk Encryption](../security/azure-security-disk-encryption.md) enables IT administrators to encrypt Windows and Linux IaaS VM disks. Azure Disk Encryption leverages the industry standard BitLocker feature of Windows and the DM-Crypt feature of Linux to provide volume encryption for the OS and the data disks.

You can leverage Azure Disk Encryption to help protect and safeguard your data to meet your organizational security and compliance requirements. Organizations should also consider using encryption to help mitigate risks related to unauthorized data access. It is also recommended that you encrypt drives prior to writing sensitive data to them.

Make sure to encrypt VM’s data volume(s) to protect the data volumes at rest in your Azure storage account. Safeguard the encryption keys and secret by leveraging [Azure Key Vault](https://azure.microsoft.com/en-us/documentation/articles/key-vault-whatis/).

Organizations that are not enforcing data encryption are more exposed to data integrity issues, such as malicious or rogue users stealing data and compromised accounts gaining unauthorized access to data in clear format. Besides these risks, companies that have to comply with industry regulations, must prove that they are diligent and using the correct security controls to enhance data security.

You can learn more about Azure Disk Encryption by reading the article [Azure Disk Encryption for Windows and Linux IaaS VMs](azure-security-disk-encryption.md).


## Manage VM updates

Azure does not push Windows Updates to Windows Azure VMs since these machines are intended to be managed by the user. This is just like any on-premises machine. Customers are, however encouraged to leave the automatic Windows Update setting enabled. Another option is to deploy a [Windows Server Update Services (WSUS)](https://technet.microsoft.com/windowsserver/bb332157.aspx) server or another suitable update management product either on another Azure VM or on-premises. Both WSUS and Windows Update keep VMs up to date. It is also advisable to make use of a scanning product to verify that all IaaS VMs are up to date.

Stock images provided by Azure are routinely updated to include the most recent round of Windows Updates. However, there is no guarantee that images will be current at deployment time. It is possible there may be a slight lag (no more than a few weeks) from public releases. Checking for and installing all Windows Updates should be the first step of every deployment. This is especially important to remember when deploying images you provide or from your own library. Images provided as part of the Windows Azure gallery always have automatic Windows Updates enabled by default.

Organizations that are not enforcing software update policies are more exposed to threats that are exploiting known vulnerabilities that were already fixed. Besides these risks, companies that have to comply with industry regulations, must prove that they are diligent and using the correct security controls to enhance the security of their workload located in the cloud.
It is important to emphasize that there are many similarities between software update best practices in a traditional datacenter versus Azure IaaS, therefore it is recommended that you evaluate your current software update policies to include Azure VMs.

## Manage VM secure posture

Cyber threats are evolving, and safeguarding your VMs requires a more rich monitoring capability that is able to quickly detect threats, trigger alerts, and reduce false positive. The secure posture for this type of workload comprises in all security aspects of the VM, from the update management, to the secure network access, while active monitoring for threats that are trying to gain unauthorized access to your resources.

You can use [Azure Security Center](../security-center/security-center-intro.md) to monitor the secure posture of your [Windows](../security-center/security-center-virtual-machine.md) and [Linux VMs](../security-center/security-center-linux-virtual-machine.md). You can leverage the following capabilities in Azure Security Center to monitor your VMs:

- Operating System (OS) security settings with the recommended configuration rules
- System security and critical updates that are missing
- Endpoint protection recommendations (antimalware)
- Disk encryption validation
- Vulnerability assessment and remediation
- Threat detection

Security Center can actively monitor for threats, and these threats will be exposed under Security Alerts. Threats that are correlated will be aggregated in a single view called *Security Incident*. You can watch the video below to understand how Security Center can help you identify potential threats in your VMs located in Azure.

<iframe src="https://channel9.msdn.com/Blogs/Azure-Security-Videos/Azure-Security-Center-in-Incident-Response/player" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

Organizations that are not enforcing a secure posture for their VMs are unaware of potential attempts to circumvent security controls that are in place.

## Monitoring VM performance

Resource abuse can also be a problem when you have processes in a VM that are consuming more resources than it should. A VM with a performance issue can lead to service disruption, which goes against one of the security principals: availability. For this reason it is imperative to monitor VM access not only reactively (while an issue is taking place) but also having a baseline done during normal operation hours.

[Azure Diagnostic Logs](https://azure.microsoft.com/en-us/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) can assist you to monitor your VM’s resources and identify potential issues that are compromising its performance and availability. The Azure Diagnostics Extension provides the monitoring and diagnostics capabilities on a Windows-based Azure VM. You can enable these capabilities on the VM by including the extension as part of the Azure Resource Manager [template](../virtual-machines/virtual-machines-windows-extensions-diagnostics-template.md). You can also use [Azure Monitor](../monitoring-and-diagnostics/monitoring-overview-metrics.md) to gain visibility to your resource’s health.

Organizations that are not monitoring VM’s performance will not be able to determine if certain changes in performance patterns are part of its normal utilization or if there is an abnormal operation taking place that it is consuming more resources than normal. The anomaly could indicate a potential attack coming from an external resource or a compromised process running in this VM.
