---
title: Azure Virtual Machine Security Best Practices | Microsoft Docs
description: This article provides a collection of security best practices to be used in virtual machines located in Azure.
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
# Azure Virtual Machine security best practices

In most IaaS (Infrastructure as a Service) scenarios, [Virtual Machines](https://docs.microsoft.com/en-us/azure/virtual-machines/) are the main workload for organizations that are using cloud computing. This is predominant in [hybrid scenarios](https://social.technet.microsoft.com/wiki/contents/articles/18120.hybrid-cloud-infrastructure-design-considerations.aspx) where organizations want to slowly migrate workloads to the cloud. You should follow [general security considerations for IaaS](https://social.technet.microsoft.com/wiki/contents/articles/3808.security-considerations-for-infrastructure-as-a-service-iaas.aspx) scenario and ensure that you have security best practices applied to all your VMs located in Azure.

In this article we will discuss a collection of Azure VMs security best practices. These best practices are derived from our experience with Azure VMs and the experiences of customers like yourself. 

For each best practice, we’ll explain:

- What the best practice is
- Why you want to enable that best practice
- What might be the result if you fail to enable the best practice
- Possible alternatives to the best practice
- How you can learn to enable the best practice

This Azure Virtual Machine Security Best Practices article is based on a consensus opinion, and Azure platform capabilities and feature sets, as they exist at the time this article was written. Opinions and technologies change over time and this article will be updated on a regular basis to reflect those changes.

Azure VMs security best practices discussed in this article include:

- Virtual machine authentication, and access control
- Virtual machine availability and network access
- Protect data at rest in Azure VMs by enforcing encryption
- Managing virtual machine updates
- Manage your virtual machine secure posture
- Monitoring virtual machine performance

## Virtual machine authentication, and access control

The first step in protecting your Virtual Machine is to ensure that only authorized users are able to provision new VMs. You can use [Resource Manager policies](../azure-resource-manager/resource-manager-policy.md) to establish conventions for resources in your organization, create customized policies, and apply these policies to resources, such as [resource group](../azure-resource-manager/resource-group-overview.md). The VMs that belong to that resource group will inherit these policies. While this is the recommended approach to manage resources (including VMs) that have different needs, and are located in different resource groups, you can also control individual access to VMs by using [role-based access control (RBAC)](../active-directory/role-based-access-control-configure.md).

By enabling Azure Resource Manager policies and RBAC to control VM access, you are enhancing the overall security of your VM. It is recommended to tightly-coupled VMs that share the same life cycle into the same resource group. Resource groups allow you to deploy and monitor resources as a group and roll up billing costs by resource group. Use [least privilege](https://technet.microsoft.com/en-us/windows-server-docs/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models) approach to enable access to users to provision VMs, and plan to use the following built in roles in Azure when assigning privileges to users:

- [Virtual Machine Contributor](../active-directory/role-based-access-built-in-roles.md#virtual-machine-contributor): can manage virtual machines, but not the virtual network or storage account to which they are connected.
- [Classic Virtual Machine Contributor](../active-directory/role-based-access-built-in-roles.md#classic-virtual-machine-contributor): can manage classic virtual machines, but not the virtual network or storage account to which they are connected.
- [Security Manager](../active-directory/role-based-access-built-in-roles.md#security-manager): can manage security components, security policies, and virtual machines.
- [DevTest Labs User](../active-directory/role-based-access-built-in-roles.md#devtest-labs-user): can view everything and connect, start, restart, and shutdown virtual machines

Don't share accounts and passwords between administrators, or reuse passwords across multiple user accounts or services, particularly those for social media or other non-administrative activities. Ideally you should use [Azure Resource Manager](../azure-resource-manager/resource-group-authoring-templates.md) templates to secure provision your VMs. By using this approach you can harden the deployment choices and enforce security settings throughout the deployment.

Organizations that are not enforcing data access control by leveraging capabilities such as RBAC may be giving more privileges than necessary for their users. This can direct lead to data compromise by having access to certain level of data that you shouldn’t have in the first place.
 

## Virtual machine availability and network access

If your VM runs critical applications that need to have high availability, it is strongly recommended that you use multiple VMs.  For better availability, create at least two VMs in the [availability set](../virtual-machines/virtual-machines-windows-infrastructure-availability-sets-guidelines.md). The Azure [load balancer](../load-balancer/load-balancer-overview.md) also requires that load-balanced VMs belong to the same availability set. If these VMs need to be access from the Internet, you will need to configure an [Internet facing load balancer](../load-balancer/load-balancer-internet-overview.md).

When VMs are exposed to the Internet, it is important to ensure that you [control network traffic flow with network security groups](../virtual-network/virtual-networks-nsg.md).  Since NSGs can be applied to subnets, you can minimize the number of NSGs by grouping your resources by subnet, and applying NSGs to subnets. The intent is to create a layer of network isolation, which can be accomplished by proper configuring [network security](../best-practices-network-security.md) capabilities in Azure.  

You can also use just in time VM access feature from Azure Security Center to control who and for how long someone can have remote access to a specific VM. Watch the video below for more information on how to use this capability:


<iframe src="https://channel9.msdn.com/Blogs/Azure-Security-Videos/Azure-Security-Center-Just-in-Time-VM-Access/player" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

Organizations that are not enforcing network access restriction to Internet facing VMs are exposed to security risks, such as RDP Brute Force attack. 

## Protect data at rest in Azure VMs by enforcing encryption

Nowadays [data encryption at rest](https://blogs.microsoft.com/cybertrust/2015/09/10/cloud-security-controls-series-encrypting-data-at-rest/) is a mandatory step towards data privacy, compliance and data sovereignty. [Azure Disk Encryption](../security/azure-security-disk-encryption.md) enables IT administrators to encrypt Windows and Linux IaaS Virtual Machine (VM) disks. Azure Disk Encryption leverages the industry standard BitLocker feature of Windows and the DM-Crypt feature of Linux to provide volume encryption for the OS and the data disks.

You can leverage Azure Disk Encryption to help protect and safeguard your data to meet your organizational security and compliance requirements. Organizations should also consider using encryption to help mitigate risks related to unauthorized data access. It is also recommended that you encrypt drives prior to writing sensitive data to them. 

Make sure to encrypt VM’s data volume(s) to protect the data volumes at rest in your Azure storage account. Safeguard the encryption keys and secret by leveraging [Azure Key Vault](https://azure.microsoft.com/en-us/documentation/articles/key-vault-whatis/). 

Organizations that are not enforcing data encryption are more exposed to data integrity issues, such as malicious or rogue users stealing data and compromised accounts gaining unauthorized access to data in clear format. Besides these risks, companies that have to comply with industry regulations, must prove that they are diligent and using the correct security controls to enhance data security.

You can learn more about Azure Disk Encryption by reading the article [Azure Disk Encryption for Windows and Linux IaaS VMs](azure-security-disk-encryption.md).


## Manage virtual machine updates

Azure does not push Windows Updates to Windows Azure Virtual Machines since these machines are intended to be managed by the user. This is just like any on-premises machine. Customers are, however encouraged to leave the automatic Windows Update setting enabled. Another option is to deploy a [Windows Server Update Services (WSUS)](https://technet.microsoft.com/windowsserver/bb332157.aspx) server or another suitable update management product either on another Azure Virtual Machine or on-premises. Both WSUS and Windows Update keep VMs up to date. It is also advisable to make use of a scanning product to verify that all IaaS Virtual Machines are up to date.

Stock images provided by Azure are routinely updated to include the most recent round of Windows Updates. However, there is no guarantee that images will be current at deployment time. It is possible there may be a slight lag (no more than a few weeks) from public releases. Checking for and installing all Windows Updates should be the first step of every deployment. This is especially important to remember when deploying images you provide or from your own library. Images provided as part of the Windows Azure gallery always have automatic Windows Updates enabled by default.

Organizations that are not enforcing software update policies are more exposed to threats that are exploiting known vulnerabilities that were already fixed. Besides these risks, companies that have to comply with industry regulations, must prove that they are diligent and using the correct security controls to enhance the security of their workload located in the cloud.
It is important to emphasize that there are many similarities between software update best practices in a traditional datacenter versus Azure IaaS, therefore it is recommended that you evaluate your current software update policies to include Azure VMs.

## Manage virtual machine secure posture

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

## Monitoring virtual machine performance

Resource abuse can also be a problem when you have processes in a VM that are consuming more resources than it should. A virtual machine with a performance issue can lead to service disruption, which goes against one of the security principals: availability. For this reason it is imperative to monitor VM access not only reactively (while an issue is taking place) but also having a baseline done during normal operation hours.

[Azure Diagnostic Logs](https://azure.microsoft.com/en-us/blog/windows-azure-virtual-machine-monitoring-with-wad-extension/) can assist you to monitor your virtual machine’s resources and identify potential issues that are compromising its performance and availability. The Azure Diagnostics Extension provides the monitoring and diagnostics capabilities on a Windows-based Azure virtual machine. You can enable these capabilities on the virtual machine by including the extension as part of the Azure Resource Manager [template](../virtual-machines/virtual-machines-windows-extensions-diagnostics-template.md). You can also use [Azure Monitor](../monitoring-and-diagnostics/monitoring-overview-metrics.md) to gain visibility to your resource’s health.

Organizations that are not monitoring virtual machine’s performance will not be able to determine if certain changes in performance patterns are part of its normal utilization or if there is an abnormal operation taking place that it is consuming more resources than normal. The anomaly could indicate a potential attack coming from an external resource or a compromised process running in this virtual machine. 