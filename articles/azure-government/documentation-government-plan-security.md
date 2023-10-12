---
title: Azure Government Security
description: Customer guidance and best practices for securing Azure workloads.
author: stevevi
ms.author: stevevi
ms.service: azure-government
ms.topic: article
recommendations: false
ms.date: 03/21/2022
---

# Azure Government security

Azure Government provides a range of features and services that you can use to build cloud solutions to meet your regulated/controlled data needs. A compliant customer solution can be a combination of the effective implementation of out-of-the-box Azure Government capabilities coupled with a solid data security practice.

When you host a solution in Azure Government, Microsoft handles many of these requirements at the cloud infrastructure level.

The following diagram shows the Azure defense-in-depth model. For example, Microsoft provides basic cloud infrastructure Distributed Denial of Service (DDoS) protection, along with customer capabilities such as [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md) or security appliances for customer-specific application DDoS needs.

:::image type="content" source="./media/azure-government-Defenseindepth.png" alt-text="Azure defense-in-depth model" border="false":::

This article outlines the foundational principles for securing your services and applications. It provides guidance and best practices on how to apply these principles. For example, how you should make smart use of Azure Government to meet requirements for a solution that handles information subject to the [International Traffic in Arms Regulations](./documentation-government-overview-itar.md#itar) (ITAR). For extra security recommendations and implementation details to help you improve your security posture with respect to Azure resources, see the [Azure Security Benchmark](../security/benchmarks/index.yml).

The overarching principles for securing customer data are:

- Protecting data using encryption
- Managing secrets
- Isolation to restrict data access

These principles are applicable to both Azure and Azure Government. As described in [Understanding isolation](#understanding-isolation), Azure Government provides extra physical networking isolation and meets demanding US government compliance requirements.

## Data encryption

Mitigating risk and meeting regulatory obligations are driving the increasing focus and importance of data encryption. Use an effective encryption implementation to enhance current network and application security measures and decrease the overall risk of your cloud environment. Azure has extensive support to safeguard customer data using [data encryption](../security/fundamentals/encryption-overview.md), including various encryption models:

- Server-side encryption that uses service-managed keys, customer-managed keys (CMK) in Azure, or CMK in customer-controlled hardware.
- Client-side encryption that enables you to manage and store keys on-premises or in another secure location. Client-side encryption is built into the Java and .NET storage client libraries, which can use Azure Key Vault APIs, making the implementation straightforward. You can use Microsoft Entra ID to provide specific individuals with access to Azure Key Vault secrets.

Data encryption provides isolation assurances that are tied directly to encryption key access. Since Azure uses strong ciphers for data encryption, only entities with access to encryption keys can have access to data. Deleting or revoking encryption keys renders the corresponding data inaccessible. 

### Encryption at rest

Azure provides extensive options for [encrypting data at rest](../security/fundamentals/encryption-atrest.md) to help you safeguard your data and meet your compliance needs using both Microsoft-managed encryption keys and customer-managed encryption keys. This process relies on multiple encryption keys and services such as Azure Key Vault and Microsoft Entra ID to ensure secure key access and centralized key management. For more information about Azure Storage service encryption and Azure disk encryption, see [Data encryption at rest](./azure-secure-isolation-guidance.md#data-encryption-at-rest).

### Encryption in transit

Azure provides many options for [encrypting data in transit](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit). Data encryption in transit isolates your network traffic from other traffic and helps protect data from interception. For more information, see [Data encryption in transit](./azure-secure-isolation-guidance.md#data-encryption-in-transit).

The basic encryption available for connectivity to Azure Government supports Transport Layer Security (TLS) 1.2 protocol and X.509 certificates. Federal Information Processing Standard (FIPS) 140 validated cryptographic algorithms are also used for infrastructure network connections between Azure Government datacenters. Windows, Windows Server, and Azure File shares can use SMB 3.0 for encryption between the virtual machine (VM) and the file share. Use client-side encryption to encrypt the data before it's transferred into storage in a client application, and to decrypt the data after it's transferred out of storage.

### Best practices for encryption

- **IaaS VMs:** Use Azure disk encryption. Turn on Storage service encryption to encrypt the VHD files that are used to back up those disks in Azure Storage. This approach only encrypts newly written data. If you create a VM and then enable Storage service encryption on the storage account that holds the VHD file, only the changes will be encrypted, not the original VHD file.
- **Client-side encryption:** Represents the most secure method for encrypting your data, because it encrypts it before transit, and encrypts the data at rest. However, it does require that you add code to your applications using storage, which you might not want to do. In those cases, you can use HTTPS for your data in transit, and Storage service encryption to encrypt the data at rest. Client-side encryption also involves more load on the client that you have to account for in your scalability plans, especially if you're encrypting and transferring much data.

## Managing secrets

Proper protection and management of encryption keys is essential for data security. You should strive to simplify key management and maintain control of keys used by cloud applications and services to encrypt data. [Azure Key Vault](../key-vault/index.yml) is a cloud service for securely storing and managing secrets. Key Vault enables you to store your encryption keys in hardware security modules (HSMs) that are [FIPS 140](/azure/compliance/offerings/offering-fips-140-2) validated. For more information, see [Data encryption key management](./azure-secure-isolation-guidance.md#data-encryption-key-management).

### Best practices for managing secrets

- Use Key Vault to minimize the risks of secrets being exposed through hard-coded configuration files, scripts, or in source code. For added assurance, you can import or generate keys in Azure Key Vault HSMs.
- Application code and templates should only contain URI references to the secrets, meaning the actual secrets aren't in code, configuration, or source code repositories. This approach prevents key phishing attacks on internal or external repositories, such as harvest-bots at GitHub.
- Utilize strong Azure role-based access control (RBAC) within Key Vault. A trusted operator who leaves the company or transfers to a new group within the company should be prevented from being able to access the secrets.

## Understanding isolation

Isolation in Azure Government is achieved through the implementation of trust boundaries, segmentation, and containers to limit data access only to authorized users, services, and applications. Azure Government supports environment and tenant isolation controls and capabilities. 

### Environment isolation

The Azure Government multi-tenant cloud platform environment is an Internet standards-based Autonomous System (AS) that is physically isolated and separately administered from the rest of Azure public cloud. As defined by [IETF RFC 4271](https://datatracker.ietf.org/doc/rfc4271/), the AS is composed of a set of switches and routers under a single technical administration, using an interior gateway protocol and common metrics to route packets within the AS. An exterior gateway protocol is used to route packets to other ASs through a single and clearly defined routing policy.

The isolation of the Azure Government environment is achieved through a series of physical and logical controls that include:

- Physically isolated hardware
- Physical barriers to the hardware using biometric devices and cameras
- Conditional access (Azure RBAC, workflow)
- Specific credentials and multi-factor authentication for logical access
- Infrastructure for Azure Government is located within the United States
 
Within the Azure Government network, internal network system components are isolated from other system components through implementation of separate subnets and access control policies on management interfaces. Azure Government doesn't directly peer with the public internet or with the Microsoft corporate network. Azure Government directly peers to the commercial Microsoft Azure network, which has routing and transport capabilities to the Internet and the Microsoft Corporate network. Azure Government limits its exposed surface area by applying extra protections and communications capabilities of our commercial Azure network. In addition, Azure Government ExpressRoute (ER) uses peering with our customer’s networks over non-Internet private circuits to route ER customer “DMZ” networks using specific Border Gateway Protocol (BGP)/AS peering as a trust boundary for application routing and associated policy enforcement.

Azure Government maintains the following authorizations:

- FedRAMP High provisional authorization to operate (P-ATO) issued by the FedRAMP Joint Authorization Board (JAB)
- DoD SRG IL4 and IL5 provisional authorizations (PA) issued by the Defense Information Systems Agency (DISA)

### Tenant isolation

Separation between customers/tenants is an essential security mechanism for both Azure and Azure Government multi-tenant cloud environments. Azure and Azure Government provide baseline per-customer or tenant isolation controls including isolation of Hypervisor, Root OS, and Guest VMs, isolation of Fabric Controllers, packet filtering, and VLAN isolation. For more information, see [Compute isolation](./azure-secure-isolation-guidance.md#compute-isolation).

You can manage your isolation posture to meet individual requirements through network access control and segregation through virtual machines, virtual networks, VLAN isolation, ACLs, load balancers, and IP filters. Additionally, you can further manage isolation levels for your resources across subscriptions, resource groups, virtual networks, and subnets. The customer/tenant logical isolation controls help prevent one tenant from interfering with the operations of any other customer/tenant.

## Screening

All Azure and Azure Government employees in the United States are subject to Microsoft background checks. Personnel with the ability to access customer data for troubleshooting purposes in Azure Government are additionally subject to the verification of US citizenship and extra screening requirements where appropriate.

We're now screening all our operators at a Tier 3 Investigation (formerly National Agency Check with Law and Credit, NACLC) as defined in Section 5.6.2.2 (Page 77) of the DoD [Cloud Computing SRG](https://public.cyber.mil/dccs/dccs-documents/):

> [!NOTE]
> The minimum background investigation required for CSP personnel having access to Level 4 and 5 information based on a “noncritical-sensitive” (e.g., DoD’s ADP-2) is a Tier 3 Investigation (for “noncritical-sensitive” contractors), or a Moderate Risk Background Investigation (MBI) for a “moderate risk” position designation.
> 

|Applicable screening and background check|Environment|Frequency|Description|
|------|------|------|------|
|New hire check|Azure </br>Azure Gov|Upon employment|- Education history (highest degree) </br>- Employment history (7-yr history) </br>- Social Security Number search </br>- Criminal history check (7-yr history) </br>- Office of Foreign Assets Control (OFAC) list </br>- Bureau of Industry and Security (BIS) list </br>- Office of Defense Trade Controls (DDTC) debarred list|
|Cloud screen|Azure </br>Azure Gov|Every two years|- Social Security Number search </br>- Criminal history check (7-yr history) </br>- Office of Foreign Assets Control (OFAC) list </br>- Bureau of Industry and Security (BIS) list </br>- Office of Defense Trade Controls (DDTC) debarred list|
|US citizenship|Azure Gov|Upon employment|- Verification of US citizenship|
|Criminal Justice Information Services (CJIS)|Azure Gov|Upon signed CJIS agreement with State|- Adds fingerprint background check against FBI database </br>- Criminal records check and credit check|
|Tier 3 Investigation|Azure Gov|Upon signed contract with sponsoring agency|- Detailed background and criminal history investigation ([SF 86](https://www.opm.gov/forms/pdf_fill/SF86.pdf))|

For Azure operations personnel, the following access principles apply:

- Duties are clearly defined, with separate responsibilities for requesting, approving, and deploying changes.
- Access is through defined interfaces that have specific functionality.
- Access is just-in-time (JIT), and is granted on a per-incident basis or for a specific maintenance event, and for a limited duration.
- Access is rule-based, with defined roles that are only assigned the permissions required for troubleshooting.

Screening standards include the validation of US citizenship of all Microsoft support and operational staff before access is granted to Azure Government-hosted systems. Support personnel who need to transfer data use the secure capabilities within Azure Government. Secure data transfer requires a separate set of authentication credentials to gain access.

## Restrictions on insider access

**Controls for restricting insider access to customer data are the same for both Azure and Azure Government. As described in the previous section, Azure Government imposes extra personnel background screening requirements, including verification of US citizenship.**

> [!NOTE]
> Insider threat is characterized as potential for providing back-door connections and cloud service provider (CSP) privileged administrator access to customer’s systems and data. Microsoft provides strong **[customer commitments](https://www.microsoft.com/trust-center/privacy/data-access)** regarding who can access customer data and on what terms. Access to customer data by Microsoft operations and support personnel is **denied by default**. Access to customer data isn't needed to operate Azure. Moreover, for most support scenarios involving customer troubleshooting tickets, access to customer data isn't needed.

No default access rights and Just-in-Time (JIT) access provisions reduce greatly the risks associated with traditional on-premises administrator elevated access rights that typically persist throughout the duration of employment. Microsoft makes it considerably more difficult for malicious insiders to tamper with your applications and data. The same access control restrictions and processes are imposed on all Microsoft engineers, including both full-time employees and subprocessors/vendors. The following controls are in place to restrict insider access to your data:

- Internal Microsoft controls that prevent access to production systems unless it's authorized through **Just-in-Time (JIT)** privileged access management system, as described in this section.
- Enforcement of **Customer Lockbox** that puts you in charge of approving insider access in support and troubleshooting scenarios, as described in this section. For most support scenarios, access to your data isn't required.
- **Data encryption** with option for customer-managed encryption keys – encrypted data is accessible only by entities who are in possession of the key, as described previously.
- **Customer monitoring** of external access to provisioned Azure resources, which includes security alerts as described in the next section.

### Access control requirements

Microsoft takes strong measures to protect your data from inappropriate access or use by unauthorized persons. Microsoft engineers (including full-time employees and subprocessors/vendors) [don't have default access](https://www.microsoft.com/trust-center/privacy/data-access) to your data in the cloud. Instead, they're granted access, under management oversight, only when necessary. Using the [restricted access workflow](https://www.youtube.com/watch?v=lwjPGtGGe84&feature=youtu.be&t=25m), access to your data is carefully controlled, logged, and revoked when it's no longer needed. For example, access to your data may be required to resolve troubleshooting requests that you initiated. The access control requirements are [established by the following policy](../security/fundamentals/protection-customer-data.md):

- No access to customer data, by default.
- No user or administrator accounts on customer virtual machines (VMs).
- Grant the least privilege that is required to complete task, audit, and log access requests.

Microsoft engineers can be granted access to customer data using temporary credentials via **Just-in-Time (JIT)** access. There must be an incident logged in the Azure Incident Management system that describes the reason for access, approval record, what data was accessed, etc. This approach ensures that there's appropriate oversight for all access to customer data and that all JIT actions (consent and access) are logged for audit. Evidence that procedures have been established for granting temporary access for Azure personnel to customer data and applications upon appropriate approval for customer support or incident handling purposes is available from the Azure [SOC 2 Type 2 attestation report](/azure/compliance/offerings/offering-soc-2) produced by an independent third-party auditing firm.

JIT access works with multi-factor authentication that requires Microsoft engineers to use a smartcard to confirm their identity. All access to production systems is performed using Secure Admin Workstations (SAWs) that are consistent with published guidance on [securing privileged access](/security/compass/overview). Use of SAWs for access to production systems is required by Microsoft policy and compliance with this policy is closely monitored. These workstations use a fixed image with all software fully managed – only select activities are allowed and users cannot accidentally circumvent the SAW design since they don't have admin privileges on these machines. Access is permitted only with a smartcard and access to each SAW is limited to specific set of users.

### Customer Lockbox

[Customer Lockbox for Azure](../security/fundamentals/customer-lockbox-overview.md) is a service that provides you with the capability to control how a Microsoft engineer accesses your data. As part of the support workflow, a Microsoft engineer may require elevated access to your data. Customer Lockbox puts you in charge of that decision by enabling you to approve/deny such elevated requests. Customer Lockbox is an extension of the JIT workflow and comes with full audit logging enabled. Customer Lockbox capability isn't required for support cases that don't involve access to customer data. For most support scenarios, access to customer data isn't needed and the workflow shouldn't require Customer Lockbox. Microsoft engineers rely heavily on logs to maintain Azure services and provide customer support.

Customer Lockbox is available to all customers who have an Azure support plan with a minimum level of Developer. You can enable Customer Lockbox from the [Administration module](https://aka.ms/customerlockbox/administration) in the Customer Lockbox blade. A Microsoft engineer will initiate Customer Lockbox request if this action is needed to progress a customer-initiated support ticket. Customer Lockbox is available to customers from all Azure public regions.

### Guest VM memory crash dumps

On each Azure node, there's a Hypervisor that runs directly over the hardware and divides the node into a variable number of Guest virtual machines (VMs), as described in [Compute isolation](./azure-secure-isolation-guidance.md#compute-isolation). Each node also has one special Root VM, which runs the Host OS.

When a Guest VM (also known as customer VM) crashes, customer data may be contained inside a memory dump file on the Guest VM. **By default, Microsoft engineers don't have access to Guest VMs and can't review crash dumps on Guest VMs without customer's approval.** The same process involving explicit customer authorization is used to control access to Guest VM crash dumps should you request an investigation of your VM crash. As described previously, access is gated by the JIT privileged access management system and Customer Lockbox so that all actions are logged and audited. The primary forcing function for deleting the memory dumps from Guest VMs is the routine process of VM reimaging that typically occurs at least every two months.

### Data deletion, retention, and destruction

As a customer, you're [always in control of your customer data](https://www.microsoft.com/trust-center/privacy/data-management) in Azure. You can access, extract, and delete your customer data stored in Azure at will. When you terminate your Azure subscription, Microsoft takes the necessary steps to ensure that you continue to own your customer data. A common customer concern upon data deletion or subscription termination is whether another customer or Azure administrator can access their deleted data. For more information on how data deletion, retention, and destruction are implemented in Azure, see our online documentation:

- [Data deletion](./azure-secure-isolation-guidance.md#data-deletion)
- [Data retention](./azure-secure-isolation-guidance.md#data-retention)
- [Data destruction](./azure-secure-isolation-guidance.md#data-destruction)

## Customer monitoring of Azure resources

This section covers essential Azure services that you can use to gain in-depth insight into your provisioned Azure resources and get alerted about suspicious activity, including outside attacks aimed at your applications and data. For a complete list, see the Azure service directory sections for [Management + Governance](https://azure.microsoft.com/services/#management-tools), [Networking](https://azure.microsoft.com/services/#networking), and [Security](https://azure.microsoft.com/services/#security). Moreover, the [Azure Security Benchmark](../security/benchmarks/index.yml) provides security recommendations and implementation details to help you improve your security posture with respect to Azure resources.

**[Microsoft Defender for Cloud](../defender-for-cloud/index.yml)** (formerly Azure Security Center) provides unified security management and advanced threat protection across hybrid cloud workloads. It's an essential service for you to limit your exposure to threats, protect cloud resources, [respond to incidents](../defender-for-cloud/alerts-overview.md), and improve your regulatory compliance posture.

With Microsoft Defender for Cloud, you can:

- Monitor security across on-premises and cloud workloads.
- Apply advanced analytics and threat intelligence to detect attacks.
- Use access and application controls to block malicious activity.
- Find and fix vulnerabilities before they can be exploited.
- Simplify investigation when responding to threats.
- Apply policy to ensure compliance with security standards.

To assist you with Microsoft Defender for Cloud usage, Microsoft has published extensive [online documentation](../security-center/index.yml) and numerous blog posts covering specific security topics:

- [How Microsoft Defender for Cloud detects a Bitcoin mining attack](https://azure.microsoft.com/blog/how-azure-security-center-detects-a-bitcoin-mining-attack/)
- [How Microsoft Defender for Cloud detects DDoS attack using cyber threat intelligence](https://azure.microsoft.com/blog/how-azure-security-center-detects-ddos-attack-using-cyber-threat-intelligence/)
- [How Microsoft Defender for Cloud aids in detecting good applications being used maliciously](https://azure.microsoft.com/blog/how-azure-security-center-aids-in-detecting-good-applications-being-used-maliciously/)
- [How Microsoft Defender for Cloud unveils suspicious PowerShell attack](https://azure.microsoft.com/blog/how-azure-security-center-unveils-suspicious-powershell-attack/)
- [How Microsoft Defender for Cloud helps reveal a cyber attack](https://azure.microsoft.com/blog/how-azure-security-center-helps-reveal-a-cyberattack/)
- [How Microsoft Defender for Cloud helps analyze attacks using Investigation and Log Search](https://azure.microsoft.com/blog/how-azure-security-center-helps-analyze-attacks-using-investigation-and-log-search/)
- [Microsoft Defender for Cloud adds context alerts to aid threat investigation](https://azure.microsoft.com/blog/azure-security-center-adds-context-alerts-to-aid-threat-investigation/)
- [How Microsoft Defender for Cloud automates the detection of cyber attack](https://azure.microsoft.com/blog/how-azure-security-center-automates-the-detection-of-cyber-attack/)
- [Heuristic DNS detections in Microsoft Defender for Cloud](https://azure.microsoft.com/blog/heuristic-dns-detections-in-azure-security-center/)
- [Detect the latest ransomware threat (Bad Rabbit) with Microsoft Defender for Cloud](https://azure.microsoft.com/blog/detect-the-latest-ransomware-threat-aka-bad-rabbit-with-azure-security-center/)
- [Petya ransomware prevention & detection in Microsoft Defender for Cloud](https://azure.microsoft.com/blog/petya-ransomware-prevention-detection-in-azure-security-center/)
- [Detecting in-memory attacks with Sysmon and Microsoft Defender for Cloud](https://azure.microsoft.com/blog/detecting-in-memory-attacks-with-sysmon-and-azure-security-center/)
- [How Defender for Cloud and Log Analytics can be used for threat hunting](https://azure.microsoft.com/blog/ways-to-use-azure-security-center-log-analytics-for-threat-hunting/)
- [How Microsoft Defender for Cloud helps detect attacks against your Linux machines](https://azure.microsoft.com/blog/how-azure-security-center-helps-detect-attacks-against-your-linux-machines/)
- [Use Microsoft Defender for Cloud to detect when compromised Linux machines attack](https://azure.microsoft.com/blog/leverage-azure-security-center-to-detect-when-compromised-linux-machines-attack/)

**[Azure Monitor](../azure-monitor/overview.md)** helps you maximize the availability and performance of applications by delivering a comprehensive solution for collecting, analyzing, and acting on telemetry from both cloud and on-premises environments. It helps you understand how your applications are performing, and proactively identifies issues affecting deployed applications and resources they depend on. Azure Monitor integrates the capabilities of [Log Analytics](../azure-monitor/logs/data-platform-logs.md) and [Application Insights](../azure-monitor/app/app-insights-overview.md) that were previously branded as standalone services.

Azure Monitor collects data from each of the following tiers:

- **Application monitoring data:** Data about the performance and functionality of the code you've written, regardless of its platform.
- **Guest OS monitoring data:** Data about the operating system on which your application is running. The application could be running in Azure, another cloud, or on-premises. 
- **Azure resource monitoring data:** Data about the operation of an Azure resource.
- **Azure subscription monitoring data:** Data about the operation and management of an Azure subscription and data about the health and operation of Azure itself. 
- **Azure tenant monitoring data:** Data about the operation of tenant-level Azure services, such as Microsoft Entra ID.

With Azure Monitor, you can get a 360-degree view of your applications, infrastructure, and network with advanced analytics, dashboards, and visualization maps. Azure Monitor provides intelligent insights and enables better decisions with AI. You can analyze, correlate, and monitor data from various sources using a powerful query language and built-in machine learning constructs. Moreover, Azure Monitor provides out-of-the-box integration with popular DevOps, IT Service Management (ITSM), and Security Information and Event Management (SIEM) tools.
  
**[Azure Policy](../governance/policy/overview.md)** enables effective governance of Azure resources by creating, assigning, and managing policies. These policies enforce various rules over provisioned Azure resources to keep them compliant with your specific corporate security and privacy standards. For example, one of the built-in policies for Allowed Locations can be used to restrict available locations for new resources to enforce your geo-compliance requirements. For additional customer assistance, Microsoft provides **Azure Policy regulatory compliance built-in initiatives**, which map to **compliance domains** and **controls** in many US government, global, regional, and industry standards. For more information, see [Azure Policy samples](../governance/policy/samples/index.md#regulatory-compliance). Regulatory compliance in Azure Policy provides built-in initiative definitions to view a list of the controls and compliance domains based on responsibility – customer, Microsoft, or shared. For Microsoft-responsible controls, we provide additional audit result details based on third-party attestations and our control implementation details to achieve that compliance. Each control is associated with one or more Azure Policy definitions. These policies may help you [assess compliance](../governance/policy/how-to/get-compliance-data.md) with the control; however, compliance in Azure Policy is only a partial view of your overall compliance status. Azure Policy helps to enforce organizational standards and assess compliance at scale. Through its compliance dashboard, it provides an aggregated view to evaluate the overall state of the environment, with the ability to drill down to more granular status.

**[Azure Firewall](../firewall/overview.md)** provides a managed, cloud-based network security service that protects your Azure Virtual Network resources. It's a fully stateful firewall as a service with built-in high availability that integrates with Azure Monitor for logging and analytics.

**[Network Watcher](../network-watcher/network-watcher-monitoring-overview.md)** allows you to monitor, diagnose, and gain insights into your Azure Virtual Network performance and health. With network security group flow logs, you can gain deeper understanding of your network traffic patterns and collect data for compliance, auditing, and monitoring of your network security profile. Packet capture allows you to capture traffic to and from your virtual machines to diagnose network anomalies and gather network statistics, including information on network intrusions.

**[Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md)** provides extensive Distributed Denial of Service (DDoS) mitigation capability to help you protect your Azure resources from attacks. Always-on traffic monitoring provides near real-time detection of a DDoS attack, with automatic mitigation of the attack as soon as it's detected. In combination with Web Application Firewall, DDoS Protection defends against a comprehensive set of network layer attacks, including SQL injection, cross-site scripting attacks, and session hijacks. Azure DDoS Protection is integrated with Azure Monitor for analytics and insight.

**[Microsoft Sentinel](../sentinel/overview.md)** (formerly Azure Sentinel) is a cloud-native SIEM platform that uses built-in AI to help you quickly analyze large volumes of data across an enterprise. Microsoft Sentinel aggregates data from various sources, including users, applications, servers, and devices running on-premises or in any cloud, letting you reason over millions of records in a few seconds. With Microsoft Sentinel, you can:

- **Collect** data at cloud scale across all users, devices, applications, and infrastructure, both on-premises and in multiple clouds.
- **Detect** previously uncovered threats and minimize false positives using analytics and unparalleled threat intelligence from Microsoft.
- **Investigate** threats with AI and hunt suspicious activities at scale, tapping into decades of cybersecurity work at Microsoft.
- **Respond** to incidents rapidly with built-in orchestration and automation of common tasks.

**[Azure Advisor](../advisor/advisor-overview.md)** helps you follow best practices to optimize your Azure deployments. It analyzes resource configurations and usage telemetry and then recommends solutions that can help you improve the cost effectiveness, performance, high availability, and security of Azure resources.

## Next steps

- [Azure Government overview](./documentation-government-welcome.md)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [Azure and other Microsoft services compliance offerings](/azure/compliance/offerings/)
- [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md)
- [Azure guidance for secure isolation](./azure-secure-isolation-guidance.md)
- [Azure Government isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md)
- [Azure Government DoD overview](./documentation-government-overview-dod.md)
- [Azure security fundamentals documentation](../security/fundamentals/index.yml)
- [Azure Policy regulatory compliance built-in initiatives](../governance/policy/samples/index.md#regulatory-compliance)
