---
  title: Security best practices for IaaS workloads in Azure | Microsoft Docs
  description: " The migration of workloads to Azure IaaS brings about opportunities to re-evaluate our designs "
  services: security
  documentationcenter: na
  author: barclayn
  manager: MBaldwin
  editor: TomSh

  ms.assetid: 02c5b7d2-a77f-4e7f-9a1e-40247c57e7e2
  ms.service: security
  ms.devlang: na
  ms.topic: article
  ms.tgt_pltfrm: na
  ms.workload: na
  ms.date: 11/16/2016
  ms.author: barclayn



---

# Security best practices for IaaS workloads in Azure

As you started thinking about moving workloads to Azure IaaS you probably came to the realization that some considerations are familiar. You may already have experience securing virtual environments. The move to Azure IaaS allow you to apply your expertise in securing virtual environments and also brings a new set of options to help you secure your assets.

Before we get going let's start by saying that we should not expect to bring on-premises resources as one to one to Azure. The new challenges and the new options bring about an opportunity to reevaluate existing deigns, tools, and processes.

## Best practices
We will be discussing some of the options available in Azure that could help you meet your organization’s security requirements. While doing this we must keep in mind the different types of workloads and how their requirements may vary. Not one of these best practices can by itself secure your systems. Like anything else in security, you have to choose the appropriate options and see how the solutions can complement each other by filling gaps left by the others.

### Use DevTest Labs

Using Azure for labs and development environments allows organizations to gain agility in testing and development by taking away the delays introduced by hardware procurement. Unfortunately, there is the risk that a lack of familiarity with Azure or a desire to help expedite its adoption may lead the administrator to be overly permissive with rights assignment. This may be unintentionally exposing the organization to internal attacks. Some users could be granted a lot more access than they should have.

In Azure we now include a service called [DevTest Labs](../devtest-lab/devtest-lab-overview.md). DevTest Labs uses [Azure Role based access control](../active-directory/role-based-access-control-what-is.md)(RBAC). RBAC allows you to segregate duties within your team into roles that grant only the level of access necessary for users to do their jobs. It comes with pre-defined roles (Owner, lab user and contributor). These roles can even be used to assign rights to external partners and greatly simplify collaboration.

Since DevTest Labs uses RBAC, it is possible to create additional [custom roles](../devtest-lab/devtest-lab-grant-user-permissions-to-specific-lab-policies.md). DevTest Labs not only simplifies the management of permissions, it is also designed to simplify the process of getting environments provisioned and to deal with other typical challenges of teams working on development and test environments. It requires some preparation but in the long term it will make things easier for your team.

Some key Azure DevTest Labs features include:

- It allows administrators control over the options available to users. Things like allowed VM sizes, maximum number of VMs and when VMs are started and shut down can be centrally managed by the administrator
- It helps automate the creation of lab environments
- Cost tracking
- Simplified distribution of VMs for temporary collaborative work
- Self-service allowing users to provision their labs using templates
- Managing and limiting consumption

![Creating a DevTestLab](./media/azure-security-iaas/devtestlabs.png)

There is no additional cost associated with the usage of DevTest Labs. The creation of labs, policy configuration, templates, and artifacts are all free. You only pay for the azure resources used within your labs such as virtual machines, storage accounts and virtual networks.

### Limit and Constrain Administrative Access

Securing the accounts that can manage your Azure subscription is extremely important. The compromise of any of those accounts effectively negates the value of all the other steps you may take to ensure the confidentiality and integrity of your data. As recently illustrated by the [Edward Snowden](https://en.wikipedia.org/wiki/Edward_Snowden) leak of classified information internal attacks poses a huge threat to the overall security of any organization.

Individuals who have administrative rights should have been evaluated by following a criteria similar to the one below:

- Are they performing tasks that require administrative privileges?
- How often are the tasks performed?
- Specific reason why the tasks cannot be performed by another administrator on their behalf.
- Document all other known alternative approaches to granting the privilege and why each isn't acceptable.

The use of just in time administration prevents the unnecessary existence of accounts with elevated rights during time periods when those rights are not needed. Accounts have elevated rights for a limited time enabling administrators to do their jobs and then they have those rights removed at the end of a shift or when a task is completed.

[PIM](../active-directory/active-directory-privileged-identity-management-configure.md) allows you to manage, monitor, and control access within your organization. It helps you remain aware of the actions taken by individuals within your organization and brings just in time administration to Azure AD by introducing the concept of an eligible admin. These are individuals who have accounts with the potential to be granted admin rights. These types of users can go through an activation process and be granted admin rights for a limited time.

### Use Secure Management Workstations

Organizations often run into problems because of administrators performing actions while using accounts with elevated rights. Usually this isn’t done maliciously but because existing configuration and processes allow them to do it. Most of these users understand the risk from a conceptual standpoint but still choose to take steps that they would agree are risky.

Doing things like checking email and browsing the internet seem innocent enough but may expose elevated accounts to compromise by malicious actors who may use browsing activities, specially crafted emails, or other techniques to gain access to your enterprise.
The use of secure management workstations for conducting all Azure administration tasks is highly recommended as a way of reducing exposure to accidental compromise.

Secure admin workstations are hardened systems that are closely managed and that have policies applied that limit the actions that can be performed while logged on to them.

For more information on Secure Management workstations look at the links below:

- [Protecting high-value assets with secure admin workstations](https://msdn.microsoft.com/library/mt186538.aspx)
- [Privileged Access Workstations](https://technet.microsoft.com/windows-server-docs/security/securing-privileged-access/privileged-access-workstations)

### Use multifactor authentication

One of the most beneficial steps that you can take to secure an account is to enable two factor authentication. Two factor authentication is a way of authenticating by using more than just your password. The second factor is something in addition to the password.  This helps mitigate the risk of access by someone who manages to get a hold of someone else’s password.

In the case of Azure, the simplest way to enable two factor authentication is to use Azure Multifactor Authentication (MFA). [Azure MFA](../multi-factor-authentication/multi-factor-authentication.md) has an application that can be used on your mobile devices, it can work via phone calls, text messages or via a code generated in the app and it can integrate with your on-premises directory.

For accounts that manage your Azure subscription you should use MFA and for accounts that can logon to the Virtual Machines you should use MFA when possible. Using MFA for these accounts gives you much greater level of security than just using a password. Using other forms of two factor authentication could work just as well but may be more involved to get deployed if they are not already in production.

The screenshot below shows some of the options avaialble for Azure MFA authentication.

![MFA options](./media/azure-security-iaas/mfa-options.png)

### Control and Limit Endpoint Access

Hosting labs or production systems in Azure means that your systems need to be accessible from the internet. By default, a new windows virtual machine has the RDP port accessible from the internet and a Linux virtual machine has the SSH port open. This means that taking steps to 'limit exposed endpoints' is necessary to minimize the risk of unauthorized access.

There are technologies in Azure that can help you limit the access to those administrative endpoints. In azure you can use Network security groups ([NSGs](../virtual-network/virtual-networks-nsg.md)). When you use Resource Manager for deployment NSGs are used to limit the access from all networks to just the management endpoints (RDP or SSH).  When you think NSGs, think router ACLs. You can use them to tightly control the network communication between various segments of your Azure networks. This is similar to creating networks in DMZs or other isolated networks. They do not inspect the traffic but they will help with network segmentation.


In Azure you can configure a [site-to-site VPN](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) from your on-premises network, effectively extending your on-premises network to the cloud.  This would provide you with another opportunity to use NSGs, as you could also modify the NSGs to not allow access from anywhere other than the local network and then require that administration is done by first connecting to the Azure network via VPN.

The site-to-site VPN option may be most attractive in cases where you are hosting production systems that are closely integrated with your on-premise resources in Azure.

Alternatively, the [point to site](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md) option could be used in situations where you want to manage systems that don't need access to on-premise resources. Those systems can be isolated in their own Azure network and administrators could VPN into the azure from their administrative workstation.

>[!NOTE] Either VPN option would allow you to reconfigure the ACLs on the NSGs to not allow access to management endpoints from the internet.

Another option worth considering is a [Remote Desktop Services](../multi-factor-authentication/multi-factor-authentication-get-started-server-rdg.md) deployment. You could use this remote desktop services deployment to securely connect over HTTPs to remote desktop servers while applying more granular controls to those connections.

Some of the features that you would have access to include:

- It gives the administrator the option to limit connections to requests from specific systems.
- You are able of requiring smartcard authentication or Azure MFA
- You can control which systems someone can connect to via the gateway.
- The administrator can control device and disk redirection.

### Operating system management best practices

In an IaaS deployment you are still responsible for the management of the systems that you deploy just like any other server or workstation in your environment. This means that patching, hardening, rights assignments and any other activity related to the maintenance of your system is still your responsibility.  For systems that are tightly integrated with your on-premises resources you may want to use the same tools and procedures that you are using on-premise for things like anti-virus, anti-malware, patching, and backup.

#### Install and manage antimalware

For environments that are hosted separately from your production environment there is an antimalware extension that can be used to protect your virtual machines and cloud services and it integrates with [Azure Security Center](../security-center/security-center-intro.md).


[Microsoft Antimalware](azure-security-antimalware.md) includes features like real-time protection, scheduled scanning, malware remediation, signature updates, engine updates, samples reporting, exclusion event collection, and [PowerShell support](https://msdn.microsoft.com/library/dn771715.aspx).

![Azure Antimalware](./media/azure-security-iaas/azantimalware.png)

#### Install the latest security updates
Some of the first workloads we see customers move to Azure are labs and external facing systems. If you are hosting virtual machines in Azure that host applications or services that need to be made accessible to the internet, you need to be vigilant about patching. Remember that this goes beyond patching the operating system. Unpatched vulnerabilities on third-party applications can also lead to problems that would have been easily avoided if good patch management was in place.

For more information on managing patching in Azure IaaS look at [Best practices for software updates on Microsoft Azure IaaS](azure-security-best-practices-software-updates-iaas.md).

#### Deploy and test a backup solution

Just like security updates, backup needs to be handled the same way you handle any other operation. This is true of systems that are part of your production environment extending to the cloud. Test and Dev Systems must follow back up strategies that are able of providing users with similar restore capabilities to what they have grown accustomed to based on their experience with on-premise environments.

Production workloads moved to Azure should integrate with existing backup solutions when possible or you can use [Azure backup](../backup/backup-azure-arm-vms.md) to help you address your backup requirements.

### Use a Key Management solution

Secure key management is essential to protecting data in the cloud. With [Azure Key Vault](../key-vault/key-vault-whatis.md), you can encrypt keys and small secrets like passwords using keys stored in hardware security modules (HSMs). For added assurance, you can import or generate keys in HSMs.

If you choose to do this, Microsoft will process your keys in FIPS 140-2 Level 2 validated HSMs (hardware and firmware). Key Vault is designed so that Microsoft does not see or extract your keys. Monitor and audit key use with Azure logging—pipe logs into Azure applying or your SIEM for additional analysis and threat detection.

Anyone with an Azure subscription can create and use key vaults. Although Key Vault benefits developers and security administrators, it could be implemented and managed by an organization’s administrator responsible for managing Azure services.


### Encrypt Virtual Disks and Disk Storage

[Azure Disk encryption](https://gallery.technet.microsoft.com/Azure-Disk-Encryption-for-a0018eb0) addresses the threat of data theft or exposure from unauthorized access achieved by moving a disk. The disk could be attached to another system as a way of bypassing other security controls. Disk encryption uses [BitLocker](https://technet.microsoft.com/library/hh831713 ) in windows and DM-Crypt in Linux to encrypt operating system and data drives. Azure Disk Encryption integrates with key vault to control and manage the encryption keys and it is available for standard VMs and VMs with premium storage.

For more information, look at the article covering [Azure disk Encryption in Windows and Linux IaaS VMs](azure-security-disk-encryption.md).

[Azure storage encryption](../storage/storage-service-encryption.md) protects your data at rest. It is enabled at the storage account level and it encrypts data as its written in our datacenters and it is automatically decrypted as you access it. It supports the following scenarios:

- Encryption of block blobs, append blobs, and page blobs.
- Encryption of archived VHDs and templates brought to Azure from on-premises.
- Encryption of underlying OS and data disks for IaaS VMs created using your VHDs.

Before you proceed with Azure Storage encryption you should be aware of two notable limitations:

- It is not available on classic storage accounts.
- It only encrypts data written after encryption is enabled.

### Use a Centralized Security Management System

Your servers need to be monitored for patching, configuration, and events and activities that may be considered security concerns. To address those concerns you can use [Security Center](https://azure.microsoft.com/services/security-center/) and [Operations Management Suite](https://azure.microsoft.com/services/security-center/). Both of these options go beyond the configuration within the operating system and also provide monitoring of the configuration of the underlying infrastructure like network configuration and virtual appliance use.

#### Security Center
[Security Center](../security-center/security-center-intro.md) provides ongoing evaluation of the security state of your Azure resources to identify potential security vulnerabilities. A list of recommendations guides you through the process of configuring needed controls.

Examples include:

- Provisioning antimalware to help identify and remove malicious software
- Configuring network security groups and rules to control traffic to virtual machines
- Provisioning of web application firewalls to help defend against attacks that target your web applications
- Deploying missing system updates
- Addressing OS configurations that do not match the recommended baselines

In the image below you can see some of the options available for you to enable in Security Center.

![Azure security center policies](./media/azure-security-iaas/security-center-policies.png)

#### Operations Management Suite (OMS)
Operations Management Suite is a Microsoft cloud based IT management solution that helps you manage and protect your on-premise and cloud infrastructure. Since OMS is implemented as a cloud based service it can be deployed quickly and with minimal investment in infrastructure resources.

New features are delivered automatically saving you ongoing maintenance and upgrade costs. It also integrates with System Center Operations Manager.  OMS has different components to help you better manage your Azure workloads including a 'Security and Compliance' module.

The security and compliance features in OMS allow you to view information about your resources organized into four major categories:

- Security Domains: in this area you will be able to further explore security records over time, access malware assessment, update assessment, network security, identity and access information, computers with security events and quickly have access to Azure Security Center dashboard.
- Notable Issues: this option will allow you to quickly identify the number of active issues and the severity of these issues.
- Detections (Preview): enables you to identify attack patterns by visualizing security alerts as they take place against your resources.
- Threat Intelligence: enables you to identify attack patterns by visualizing the total number of servers with outbound malicious IP traffic, the malicious threat type, and a map that shows where these IPs are coming from.
- Common security queries: this option provides you a list of the most common security queries that you can use to monitor your environment. When you click in one of those queries, it opens the Search blade with the results for that query

The screenshot below shows an example of the type of information that can be displayed by OMS.

![OMS security baselines](./media/azure-security-iaas/oms-security-baseline.png)

You can find more information on Operations Management Suite at the article [What is Operations Management Suite? ](../operations-management-suite/operations-management-suite-overview.md)

## Next Steps


* [Azure security Team Blog](https://blogs.msdn.microsoft.com/azuresecurity/)
* [Microsoft Security Response Center](https://technet.microsoft.com/library/dn440717.aspx)
