---
title: "Security: Best practices"
description: This topic provides general guidance for securing SQL Server running in an Azure virtual machine.
services: virtual-machines-windows
documentationcenter: na
author: bluefooted
editor: ''
tags: azure-service-management

ms.assetid: d710c296-e490-43e7-8ca9-8932586b71da
ms.service: virtual-machines-sql
ms.subservice: security

ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 03/02/2022
ms.author: pamela
ms.reviewer: mathoma
---
# Security considerations for SQL Server on Azure Virtual Machines
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This topic includes overall security guidelines that help establish secure access to SQL Server instances in an Azure virtual machine (VM).

Azure complies with several industry regulations and standards that can enable you to build a compliant solution with SQL Server running in a virtual machine. For information about regulatory compliance with Azure, see [Azure Trust Center](https://azure.microsoft.com/support/trust-center/).

First review the security best practices for [SQL Server](/sql/relational-databases/security/sql-server-security-best-practices) and [Azure VMs](../../../virtual-machines/security-recommendations.md) and then review this article for the best practices that apply to SQL Server on Azure VMs specifically. 

To learn more about SQL Server VM best practices, see the other articles in this series: [Checklist](performance-guidelines-best-practices-checklist.md), [VM size](performance-guidelines-best-practices-vm-size.md), [HADR configuration](hadr-cluster-best-practices.md), and [Collect baseline](performance-guidelines-best-practices-collect-baseline.md). 

## Checklist


Review the following checklist in this section for a brief overview of the security best practices that the rest of the article covers in greater detail.

SQL Server features and capabilities provide a method of security at the data level and is how you achieve [defense-in-depth](https://azure.microsoft.com/resources/videos/defense-in-depth-security-in-azure/) at the infrastructure level for cloud-based and hybrid solutions. In addition, with Azure security measures, it is possible to encrypt your sensitive data, protect virtual machines from viruses and malware, secure network traffic, identify and detect threats, meet compliance requirements, and provides a single method for administration and reporting for any security need in the hybrid cloud. 

- Use [Azure Security Center](../../../defender-for-cloud/defender-for-cloud-introduction.md) to evaluate and take action to improve the security posture of your data environment. Capabilities such as [Azure Advanced Threat Protection (ATP)](../../database/threat-detection-overview.md) can be leveraged across your hybrid workloads to improve security evaluation and give the ability to react to risks. Registering your SQL Server VM with the [SQL IaaS Agent extension](sql-agent-extension-manually-register-single-vm.md) surfaces Azure Security Center assessments within the [SQL virtual machine resource](manage-sql-vm-portal.md) of the Azure portal. 
- Leverage [Microsoft Defender for SQL](../../../defender-for-cloud/defender-for-sql-introduction.md) to discover and mitigate potential database vulnerabilities, as well as detect anomalous activities that could indicate a threat to your SQL Server instance and database layer.
- [Vulnerability Assessment](../../database/sql-vulnerability-assessment.md) is a part of [Microsoft Defender for SQL](../../../defender-for-cloud/defender-for-sql-introduction.md) that can discover and help remediate potential risks to your SQL Server environment. It provides visibility into your security state, and includes actionable steps to resolve security issues.
- [Azure Advisor](../../../advisor/advisor-security-recommendations.md) analyzes your resource configuration and usage telemetry and then recommends solutions that can help you improve the cost effectiveness, performance, high availability, and security of your Azure resources. Leverage Azure Advisor at the virtual machine, resource group, or subscription level to help identify and apply best practices to optimize your Azure deployments. 
- Use [Azure Disk Encryption](../../../virtual-machines/windows/disk-encryption-windows.md) when your compliance and security needs require you to encrypt the data end-to-end using your encryption keys, including encryption of the ephemeral (locally attached temporary) disk.
- [Managed Disks are encrypted](../../../virtual-machines/disk-encryption.md) at rest by default using Azure Storage Service Encryption, where the encryption keys are Microsoft-managed keys stored in Azure.
- For a comparison of the managed disk encryption options review the [managed disk encryption comparison chart](../../../virtual-machines/disk-encryption-overview.md#comparison)
- Management ports should be closed on your virtual machines - Open remote management ports expose your VM to a high level of risk from internet-based attacks. These attacks attempt to brute force credentials to gain admin access to the machine.
- Turn on [Just-in-time (JIT) access](../../../defender-for-cloud/just-in-time-access-usage.md) for Azure virtual machines
- Use [Azure Bastion](../../../bastion/bastion-overview.md) over Remote Desktop Protocol (RDP).
- Lock down ports and only allow the necessary application traffic using [Azure Firewall](../../../firewall/features.md) which is a managed Firewall as a Service (FaaS) that grants/ denies server access based on the originating IP address.
- Use [Network Security Groups (NSGs)](../../../virtual-network/network-security-groups-overview.md) to filter network traffic to, and from, Azure resources on Azure Virtual Networks
- Leverage [Application Security Groups](../../../virtual-network/application-security-groups.md) to group servers together with similar port filtering requirements, with similar functions, such as web servers and database servers.
- For web and application servers leverage [Azure Distributed Denial of Service (DDoS) protection](../../../ddos-protection/ddos-protection-overview.md). DDoS attacks are designed to overwhelm and exhaust network resources, making apps slow or unresponsive. It is common for DDos attacks to target user interfaces. Azure DDoS protection sanitizes unwanted network traffic, before it impacts service availability
- Leverage VM extensions to help address anti-malware, desired state, threat detection, prevention, and remediation to address threats at the operating system, machine, and network levels:
   - [Guest Configuration extension](../../../virtual-machines/extensions/guest-configuration.md) performs audit and configuration operations inside virtual machines.
   - [Network Watcher Agent virtual machine extension for Windows and Linux](../../../virtual-machines/extensions/network-watcher-windows.md) monitors network performance, diagnostic, and analytics service that allows monitoring of Azure networks. 
   - [Microsoft Antimalware Extension for Windows](../../../virtual-machines/extensions/iaas-antimalware-windows.md) to help identify and remove viruses, spyware, and other malicious software, with configurable alerts.
   - [Evaluate 3rd party extensions](../../../virtual-machines/extensions/overview.md) such as Symantec Endpoint Protection for Windows VM (../../../virtual-machines/extensions/symantec)
- Leverage [Azure Policy](../../../governance/policy/overview.md) to create business rules that can be applied to your environment. Azure Policies evaluate Azure resources by comparing the properties of those resources against rules defined in JSON format.
- Azure Blueprints enables cloud architects and central information technology groups to define a repeatable set of Azure resources that implements and adheres to an organization's standards, patterns, and requirements. Azure Blueprints are [different than Azure Policies](../../../governance/blueprints/overview.md#how-its-different-from-azure-policy).

## Microsoft Defender for SQL 

[Microsoft Defender for SQL](../../../defender-for-cloud/defender-for-sql-introduction.md) enables Azure Security Center security features such as [vulnerability assessments](../../database/sql-vulnerability-assessment.md) and security alerts. See [enable Microsoft Defender for SQL](../../../defender-for-cloud/defender-for-sql-usage.md) to learn more. 

Use Azure Defender for SQL to discover and mitigate potential database vulnerabilities, and detect anomalous activities that may indicate a threat to your SQL Server instance and database layer. [Vulnerability Assessments](../../database/sql-vulnerability-assessment.md) are a feature of Microsoft Defender for SQL that can discover and help remediate potential risks to your SQL Server environment. It provides visibility into your security state, and it includes actionable steps to resolve security issues. Registering your SQL Server VM with the [SQL Server IaaS Agent Extension](sql-agent-extension-manually-register-single-vm.md) surfaces Microsoft Defender for SQL recommendations to the [SQL virtual machines resource](manage-sql-vm-portal.md) in the Azure portal.  


## Portal management

After you've [registered your SQL Server VM with the SQL IaaS extension](sql-agent-extension-manually-register-single-vm.md), you can configure a number of security settings using the [SQL virtual machines resource](manage-sql-vm-portal.md) in the Azure portal, such as enabling Azure Key Vault integration, or SQL authentication. 

Additionally, after you've enabled [Microsoft Defender for SQL](../../../defender-for-cloud/defender-for-sql-usage.md) you can view Defender for Cloud features directly within the [SQL virtual machines resource](manage-sql-vm-portal.md) in the Azure portal, such as vulnerability assessments and security alerts. 

See [manage SQL Server VM in the portal](manage-sql-vm-portal.md) to learn more. 

## Azure Security Center 

[Azure Security Center](../../../defender-for-cloud/defender-for-cloud-introduction.md) is a unified security management system that is designed to evaluate and provide opportunities to improve the security posture of your data environment. The Azure Security Center grants a consolidated view of the security health for all assets in the hybrid cloud. 

- Use [security score](../../../defender-for-cloud/secure-score-security-controls.md) in Azure Security Center. 
- Review the list of the [compute](../../../defender-for-cloud/recommendations-reference.md#compute-recommendations) and [data recommendations](../../../security-center/recommendations-reference.md#data-recommendations) currently available, for further details.
- Registering your SQL Server VM with the [SQL Server IaaS Agent Extension](sql-agent-extension-manually-register-single-vm.md) surfaces Azure Security Center recommendations to the [SQL virtual machines resource](manage-sql-vm-portal.md) in the Azure portal. 

## Azure Advisor 
       
[Azure Advisor](../../../advisor/advisor-security-recommendations.md) is a personalized cloud consultant that helps you follow best practices to optimize your Azure deployments. Azure Advisor analyzes your resource configuration and usage telemetry and then recommends solutions that can help you improve the cost effectiveness, performance, high availability, and security of your Azure resources. Azure Advisor can evaluate at the virtual machine, resource group, or subscription level.

## Azure Key Vault integration 

There are multiple SQL Server encryption features, such as transparent data encryption (TDE), column level encryption (CLE), and backup encryption. These forms of encryption require you to manage and store the cryptographic keys you use for encryption. The [Azure Key Vault](azure-key-vault-integration-configure.md) service is designed to improve the security and management of these keys in a secure and highly available location. The SQL Server Connector allows SQL Server to use these keys from Azure Key Vault.

Consider the following: 

 - Azure Key Vault stores application secrets in a centralized cloud location to securely control access permissions, and separate access logging.
 - When bringing your own keys to Azure it is recommended to store secrets and certificates in the [Azure Key Vault](/sql/relational-databases/security/encryption/extensible-key-management-using-azure-key-vault-sql-server). 
 - Azure Disk Encryption uses [Azure Key Vault](../../../virtual-machines/windows/disk-encryption-key-vault.md) to control and manage disk encryption keys and secrets.


## Access control 

When you create a SQL Server virtual machine with an Azure gallery image, the **SQL Server Connectivity** option gives you the choice of **Local (inside VM)**, **Private (within Virtual Network)**, or **Public (Internet)**.

![SQL Server connectivity](./media/security-considerations-best-practices/sql-vm-connectivity-option.png)

For the best security, choose the most restrictive option for your scenario. For example, if you are running an application that accesses SQL Server on the same VM, then **Local** is the most secure choice. If you are running an Azure application that requires access to the SQL Server, then **Private** secures communication to SQL Server only within the specified [Azure virtual network](../../../virtual-network/virtual-networks-overview.md). If you require **Public** (internet) access to the SQL Server VM, then make sure to follow other best practices in this topic to reduce your attack surface area.

The selected options in the portal use inbound security rules on the VM's [network security group](../../../active-directory/identity-protection/concept-identity-protection-security-overview.md) (NSG) to allow or deny network traffic to your virtual machine. You can modify or create new inbound NSG rules to allow traffic to the SQL Server port (default 1433). You can also specify specific IP addresses that are allowed to communicate over this port.

![Network security group rules](./media/security-considerations-best-practices/sql-vm-network-security-group-rules.png)

In addition to NSG rules to restrict network traffic, you can also use the Windows Firewall on the virtual machine.

If you are using endpoints with the classic deployment model, remove any endpoints on the virtual machine if you do not use them. For instructions on using ACLs with endpoints, see [Manage the ACL on an endpoint](/previous-versions/azure/virtual-machines/windows/classic/setup-endpoints#manage-the-acl-on-an-endpoint). This is not necessary for VMs that use the Azure Resource Manager.

Consider enabling [encrypted connections](/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine) for the instance of the SQL Server Database Engine in your Azure virtual machine. Configure SQL server instance with a signed certificate. For more information, see [Enable Encrypted Connections to the Database Engine](/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine) and [Connection String Syntax](/dotnet/framework/data/adonet/connection-string-syntax).

Consider the following when **securing the network connectivity or perimeter**: 

- [Azure Firewall](../../../firewall/features.md) - A stateful, managed, Firewall as a Service (FaaS) that grants/ denies server access based on originating IP address, to protect network resources.
- [Azure Distributed Denial of Service (DDoS) protection](../../../ddos-protection/ddos-protection-overview.md) - DDoS attacks overwhelm and exhaust network resources, making apps slow or unresponsive. Azure DDoS protection sanitizes unwanted network traffic before it impacts service availability. 
- [Network Security Groups (NSGs)](../../../virtual-network/network-security-groups-overview.md) - Filters network traffic to, and from, Azure resources on Azure Virtual Networks
- [Application Security Groups](../../../virtual-network/application-security-groups.md) - Provides for the grouping of servers with similar port filtering requirements, and group together servers with similar functions, such as web servers.

## Encryption

Managed disks offer server-side encryption, and Azure Disk Encryption. [Server-side encryption](../../../virtual-machines/disk-encryption.md) provides encryption-at-rest and safeguards your data to meet your organizational security and compliance commitments. [Azure Disk Encryption](../../../security/fundamentals/azure-disk-encryption-vms-vmss.md) uses either BitLocker or DM-Crypt technology, and integrates with Azure Key Vault to encrypt both the OS and data disks. 

Consider the following: 

- [Azure Disk Encryption](../../../virtual-machines/windows/disk-encryption-overview.md) - Encrypts virtual machine disks using Azure Disk Encryption both for Windows and Linux virtual machines.
    - When your compliance and security requirements require you to encrypt the data end-to-end using your encryption keys, including encryption of the ephemeral (locally attached temporary) disk, use
[Azure disk encryption](../../../virtual-machines/windows/disk-encryption-windows.md).
    - Azure Disk Encryption (ADE) leverages the industry-standard BitLocker feature of Windows and the DM-Crypt feature of Linux to
provide OS and data disk encryption.
- Managed Disk Encryption
    - [Managed Disks are encrypted](../../../virtual-machines/disk-encryption.md) at rest by default using Azure Storage Service Encryption where the encryption keys are Microsoft managed keys stored in Azure.
    - Data in Azure managed disks is encrypted transparently using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant.
- For a comparison of the managed disk encryption options review the [managed disk encryption comparison chart](../../../virtual-machines/disk-encryption-overview.md#comparison). 

## Manage accounts

You don't want attackers to easily guess account names or passwords. Use the following tips to help:

- Create a unique local administrator account that is not named **Administrator**.

- Use complex strong passwords for all your accounts. For more information about how to create a strong password, see [Create a strong password](https://support.microsoft.com/account-billing/how-to-create-a-strong-password-for-your-microsoft-account-f67e4ddd-0dbe-cd75-cebe-0cfda3cf7386) article.

- By default, Azure selects Windows Authentication during SQL Server virtual machine setup. Therefore, the **SA** login is disabled and a password is assigned by setup. We recommend that the **SA** login should not be used or enabled. If you must have a SQL login, use one of the following strategies:

  - Create a SQL account with a unique name that has **sysadmin** membership. You can do this from the portal by enabling **SQL Authentication** during provisioning.

    > [!TIP] 
    > If you do not enable SQL Authentication during provisioning, you must manually change the authentication mode to **SQL Server and Windows Authentication Mode**. For more information, see [Change Server Authentication Mode](/sql/database-engine/configure-windows/change-server-authentication-mode).

  - If you must use the **SA** login, enable the login after provisioning and assign a new strong password.

> [!NOTE]  
> Connecting to a SQL Server instance that's running on an Azure virtual machine (VM) is not supported using Azure Active Directory or Azure Active Directory Domain Services. Use an Active Directory domain account instead.

## Auditing and reporting

[Auditing with Log Analytics](../../../azure-monitor/agents/data-sources-windows-events.md#configuring-windows-event-logs) documents events and writes to an audit log in a secure Azure BLOB storage account. Log Analytics can be used to decipher the details of the audit logs. Auditing gives you the ability to save data to a separate storage account and create an audit trail of all events you select. You can also leverage Power BI against the audit log for quick analytics of and insights about your data, as well as to provide a view for regulatory compliance. To learn more about auditing at the VM and Azure levels, see [Azure security logging and auditing](../../../security/fundamentals/log-audit.md). 

## Virtual Machine level access

Close management ports on your machine - Open remote management ports are exposing your VM to a high level of risk from internet-based attacks. These attacks attempt to brute force credentials to gain admin access to the machine.
- Turn on [Just-in-time (JIT) access](../../../security-center/security-center-just-in-time.md?tabs=jit-config-asc%2Cjit-request-asc) for Azure virtual machines. 
- Leverage [Azure Bastion](../../../bastion/bastion-overview.md) over Remote Desktop Protocol (RDP). 


## Virtual Machine extensions

Azure Virtual Machine extensions are trusted Microsoft or 3rd party extensions that can help address specific needs and risks such as antivirus, malware, threat protection, and more.

- [Guest Configuration extension](../../../virtual-machines/extensions/guest-configuration.md)
    - To ensure secure configurations of in-guest settings of your machine, install the Guest Configuration extension. 
    - In-guest settings include the configuration of the operating system, application configuration or presence, and environment settings. 
    - Once installed, in-guest policies will be available such as 'Windows Exploit guard should be enabled'.
- [Network traffic data collection agent](../../../virtual-machines/extensions/network-watcher-windows.md)
    - Security Center uses the Microsoft Dependency agent to collect network traffic data from your Azure virtual machines. 
    - This agent enables advanced network protection features such as traffic visualization on the network map, network hardening recommendations, and specific network threats.
- [Evaluate extensions](../../../virtual-machines/extensions/overview.md) from Microsoft and 3rd parties to address anti-malware, desired state, threat detection, prevention, and remediation to address threats at the operating system, machine, and network levels.

## Next steps

Review the security best practices for [SQL Server](/sql/relational-databases/security/) and [Azure VMs](../../../virtual-machines/security-recommendations.md) and then review this article for the best practices that apply to SQL Server on Azure VMs specifically. 

For other topics related to running SQL Server in Azure VMs, see [SQL Server on Azure Virtual Machines overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.yml).


To learn more, see the other articles in this best practices series:

- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Storage](performance-guidelines-best-practices-storage.md)
- [HADR settings](hadr-cluster-best-practices.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)
