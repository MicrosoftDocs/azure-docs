---
title: Azure security baseline for Azure Stack Edge
description: The Azure Stack Edge security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: databox
ms.topic: conceptual
ms.date: 12/18/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Stack Edge

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](../security/benchmarks/overview.md) to Microsoft Azure Stack Edge. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Stack Edge. **Controls** not applicable to Azure Stack Edge have been excluded.

To see how Azure Stack Edge completely maps to the Azure Security Benchmark, see the [full Azure Stack Edge security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-controls-v2-network-security.md).*

### NS-1: Implement security for internal traffic

**Guidance**: Customers deploy a Microsoft-provided, physical, Azure Stack Edge device into their private network for internal access and have options to secure it further. 
For example, the Azure Stack Edge device is accessible over the customer's internal network and requires a customer-configured IP. Additionally, an access password is chosen by the customer to access the user interface of the device. 

Internal traffic is further secured by:

- Transport Layer Security (TLS) version 1.2 is required for Azure portal and SDK management of the Azure Stack Edge device.

- Any client access to the device is through the local web UI using standard TLS 1.2 as the default secure protocol.

- Only an authorized Azure Stack Edge Pro device is allowed to join the Azure Stack Edge service that the customer's create in their Azure subscription.

Additional information is available at the referenced links.
 
- [Configure TLS 1.2 on Windows clients accessing Azure Stack Edge Pro GPU device](azure-stack-edge-j-series-configure-tls-settings.md)

- [Quickstart - Get started with Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-quickstart.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### NS-2: Connect private networks together

**Guidance**: Customers can choose a point-to-site virtual private network (VPN) to connect an Azure Stack Edge device from their on-premise private network to the Azure network. VPN provides a second layer of encryption for the data-in-motion over transport layer security from the customer's device to Azure. 

Customers can configure a virtual private network on their Azure Stack Edge device via the Azure portal or via the Azure PowerShell.

- [Configure Azure VPN via Azure PowerShell script for Azure Stack Edge Pro R and Azure Stack Edge Mini R](azure-stack-edge-mini-r-configure-vpn-powershell.md)

- [Configure TLS 1.2 on Windows clients accessing Azure Stack Edge Pro GPU device](azure-stack-edge-j-series-configure-tls-settings.md)

- [Tutorial: Configure certificates for your Azure Stack Edge Pro R](azure-stack-edge-pro-r-deploy-configure-certificates-vpn-encryption.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### NS-3: Establish private network access to Azure services

**Guidance**: Customers can choose a point-to-site virtual private network (VPN) to connect an Azure Stack Edge device from their on-premise private network to the Azure network. VPN provides a second layer of encryption for the data-in-motion over transport layer security from the customer's device to Azure. 

- [Configure Azure VPN via Azure PowerShell script for Azure Stack Edge Pro R and Azure Stack Edge Mini R](azure-stack-edge-mini-r-configure-vpn-powershell.md)

- [Configure TLS 1.2 on Windows clients accessing Azure Stack Edge Pro GPU device](azure-stack-edge-j-series-configure-tls-settings.md)

- [Tutorial: Configure certificates for your Azure Stack Edge Pro R](azure-stack-edge-pro-r-deploy-configure-certificates-vpn-encryption.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### NS-4: Protect applications and services from external network attacks

**Guidance**: The Azure Stack Edge device incorporates standard Windows Server network protection features, which are not configurable by customers.

Customers can choose to secure their private network connected with Azure Stack Edge device from external attacks using a network virtual appliance, such as a firewall with advanced distributed denial of service (DDoS) protections.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### NS-5: Deploy intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: The endpoints used by Azure Stack Edge device are all managed by Microsoft. Customers are responsible for any additional controls they wish to deploy to their on-premise systems.

The Azure Stack Edge device uses its own intrusion detection features to protect the service. 

- [Understand Azure Stack Edge security](azure-stack-edge-security.md)

- [Port information for Azure Stack Edge](azure-stack-edge-gpu-system-requirements.md)

- [Get hardware and software intrusion detection logs](azure-stack-edge-gpu-troubleshoot.md#gather-advanced-security-logs)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](../security/benchmarks/security-controls-v2-identity-management.md).*

### IM-2: Manage application identities securely and automatically

**Guidance**: All Azure Stack Edge devices automatically have a system-assigned managed identity in Azure Active Directory (Azure AD). Currently, the managed identity is used for the cloud management of virtual machines hosted on Azure Stack Edge.

Azure Stack Edge devices boot up into a locked state for local access. For the local device administrator account, you will need to connect to your device through the local web user interface or PowerShell interface and set a strong password. Store and manage your device administrator credential in a secure location such as an Azure Key Vault and rotate the admin password according to your organizational standards.

- [Protect Azure Stack Edge device via password](azure-stack-edge-security.md#protect-the-device-via-password)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### IM-3: Use Azure AD single sign-on (SSO) for application access

**Guidance**: Single sign-on is not supported for Azure Stack Edge endpoint devices. However, you can choose to enable standard Azure Active Directory (Azure AD) based single sign-on to secure access to your Azure cloud resources.

- [Understand application SSO with Azure AD](../active-directory/manage-apps/what-is-single-sign-on.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-4: Use strong authentication controls for all Azure Active Directory based access

**Guidance**: Multifactor authentication  is a strong authentication control, but an opt-in feature for the Azure Stack Edge service users. It can be leveraged for supported scenarios such as edge-management of Azure Stack Edge devices at the Azure portal. Note that the local access to the Azure Stack Edge devices does not support multifactor authentication.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-5: Monitor and alert on account anomalies

**Guidance**: Enable Azure Monitor to gather device or container logs for your Azure Stack Edge service. Monitor containers, such as the ones running multiple compute applications at the Kubernetes cluster on your device.

Additionally, a support package, which includes audit logs can be gathered at the local web user interface of the Azure Stack Edge device. Note that the support package is not available at the Azure portal.
 
- [Enable Azure Monitor on your Azure Stack Edge Pro device](azure-stack-edge-gpu-enable-azure-monitor.md) 

- [Gather a support package](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IM-6: Restrict Azure resource access based on conditions

**Guidance**: Azure Active Directory (Azure AD) conditional access is an opt-in feature for authentication to Azure Stack Edge service. Azure Stack Edge service is a resource in the Azure portal that lets you manage an Azure Stack Edge Pro device across different geographical locations. 

- [What is conditional access](../active-directory/conditional-access/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IM-7: Eliminate unintended credential exposure

**Guidance**: Follow the best practices to protect credentials, such as:

- Activation key used to activate the device with the Azure Stack Edge resource in Azure.
- Sign in credentials to access the Azure Stack Edge device.
- Key files that can facilitate a recovery of Azure Stack Edge device.
- Channel encryption key

Rotate and then sync your storage account keys regularly to help protect your storage account from unauthorized users.

- [Azure Stack Edge Pro security and data protection](azure-stack-edge-security.md)

- [Sync storage keys](azure-stack-edge-manage-shares.md#sync-storage-keys)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](../security/benchmarks/security-controls-v2-privileged-access.md).*

### PA-2: Restrict administrative access to business-critical systems

**Guidance**: Azure Stack Edge solution has several components with strong access-controls to restrict access to business critical devices. Your organization will need an Enterprise Agreement (EA) or Cloud Solution Provider (CSP) or a Microsoft Azure Sponsorship subscription to configure and manage the device: 

Azure Stack Edge service is protected by the Azure security features as a management service hosted in Azure. You can get the encryption key for your resource in Device properties for any software development kit management operations, but can view the encryption key only if you have the appropriate permissions for the Resource Graph API.

The Azure Stack Edge Pro device is an on-premises device that helps transform your data by processing it locally and then sending it to Azure. Your device:

- needs an activation key to access the Azure Stack Edge service.
- is protected at all times by a device password.
- has secure boot enabled.

- is a locked-down device. The device Baseboard Management Controller (BMC) and BIOS are password-protected. The BIOS is protected by limited user-access.
- runs Windows Defender Device Guard. Device Guard lets you run only trusted applications that you define in your code-integrity policies.

Follow the best practices to protect all credentials and secrets used to access Azure Stack Edge. 

- [Password best practices](azure-stack-edge-security.md#protect-the-device-via-password)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-3: Review and reconcile user access regularly

**Guidance**: Azure
Stack Edge has a user named 'EdgeUser' that can configure the device. It also
has Azure Resource Manager user 'EdgeArmUser' for the local Azure Resource
Manager features on the device. 

Best practices should be followed to protect
the:

- Credentials used to
access the on-premises device

- SMB share credentials.

- Access to client
systems that have been configured to use NFS shares.

- Local storage account
keys used to access the local storage accounts when using the Blob REST API.

Additional information is available at the referenced link.

- [Information on security for your Azure Stack Edge devices](azure-stack-edge-security.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-6: Use privileged access workstations

**Guidance**: Secured and isolated workstations are critically important for the security of sensitive roles like administrators, developers, and critical service operators. Use highly secured user workstations with or without Azure Bastion for administrative tasks. Use Azure Active Directory (Azure AD), Microsoft Defender Advanced Threat Protection (ATP), and Microsoft Intune to deploy a secure and managed user workstation for administrative tasks. 

The secured workstations can be centrally managed to enforce secured configuration including strong authentication, software and hardware baselines, restricted logical and network access.

- [Understand privileged access workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/) 

- [Deploy a privileged access workstation](/security/compass/privileged-access-deployment)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-controls-v2-data-protection.md).*

### DP-2: Protect sensitive data

**Guidance**: Azure
Stack Edge treats all interacted data as sensitive with only authorized users having access to this data. You should follow best practices to protect the credentials used to
access Azure Stack Edge service.

- [Azure Stack Edge Pro security and data protection](azure-stack-edge-security.md#protect-the-device-via-password)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### DP-4: Encrypt sensitive information in transit

**Guidance**: Azure
Stack Edge uses secure channels for data in flight. These are:

- Standard TLS 1.2 is used for data that travels between the device and Azure cloud. There is no fallback to TLS 1.1 and earlier. Agent communication will be blocked if TLS 1.2 isn't supported. TLS 1.2 is also required for Azure portal and  software development kit (SDK) management.

- When clients access your device through the local web user interface of a browser, standard TLS 1.2 is used as the default secure protocol

The best practice is to configure your browser to use TLS 1.2. Use SMB 3.0 with encryption to protect data when you copy it from your data servers.

- [Best practices to protect data in flight](azure-stack-edge-security.md#protect-data-in-flight)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](../security/benchmarks/security-controls-v2-asset-management.md).*

### AM-1: Ensure security team has visibility into risks for assets

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions so they can monitor for security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could  be the responsibility of a central security team or a local team. That said, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions. 

Note that additional permissions might be required to get visibility into workloads and services. 

- [Overview of Security Reader Role](../role-based-access-control/built-in-roles.md#security-reader)

- [Overview of Azure Management Groups](../governance/management-groups/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-5: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Only authorized users, for example, the 'EdgeArmUser' can access the Azure Stack Edge device APIs via the local Azure Resource Manager. User account passwords can only be managed at the Azure portal. 

- [Set Azure Resource Manager password](azure-stack-edge-j-series-set-azure-resource-manager-password.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-6: Use only approved applications in compute resources

**Guidance**: You can bring in your own applications to run on any locally created virtual machines. Use PowerShell scripts to create local compute virtual machines on your Stack Edge device. We strongly recommend that you bring in only trusted applications to run on the local virtual machines. 

- [How to control PowerShell script execution in Windows environment](/powershell/module/microsoft.powershell.security/set-executionpolicy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](../security/benchmarks/security-controls-v2-logging-threat-detection.md).*

### LT-1: Enable threat detection for Azure resources

**Guidance**: Azure Stack Edge does not offer threat detection capabilities. However, customers can collect audit logs in a support package for offline threat detection and analysis. 

- [Collect support package for Azure Stack Edge device](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### LT-3: Enable logging for Azure network activities

**Guidance**: Azure Stack Edge has network audit logs enabled as part of the downloadable support package. These logs can be parsed to implement a semi-real time monitoring for your Azure Stack Edge devices.

- [Azure Stack Edge gather a support package](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-4: Enable logging for Azure resources

**Guidance**: Real-time monitoring with logs is currently not supported for Azure Stack Edge. A capability to gather a support package exists that allows you to analyze the various logs included in it, such as firewall, software, hardware intrusion and system event logs for your Azure Stack Edge Pro device. Note that the software intrusion or the default firewall logs are collected for inbound and outbound traffic.

- [Gather a support package for Azure Stack Edge](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### LT-5: Centralize security log management and analysis

**Guidance**: Real-time monitoring with logs is currently not supported for Azure Stack Edge. However, you can gather a support package that allows you to analyze the various logs included in it.  The support package is compressed and is downloaded to the path of your choice. Unzip the package and the view the system log files contained in it. You can also send these logs into a security information event management tool or another central storage location for analysis.

- [Gather a support package for Azure Stack Edge](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-6: Configure log storage retention

**Guidance**: Log storage retention period cannot be changed at the Azure Stack Edge device. Older logs are purged as needed. You can gather support packages from the device at periodic intervals for any requirements to retain the logs for a longer period of time. 

- [Gather a support package for Azure Stack Edge](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### LT-7: Use approved time synchronization sources

**Guidance**: Azure Stack Edge uses time.windows.com, a network time provider server by Microsoft.  Azure Stack Edge also allows customer to configure the network time protocol server of their choosing.

- [Configure Azure Stack Edge device time settings](azure-stack-edge-gpu-deploy-set-up-device-update-time.md#configure-time)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-controls-v2-incident-response.md).*

### IR-1: Preparation – update incident response process for Azure

**Guidance**: Ensure your organizational incident response plan includes processes: 

- to respond to security incidents

- which have been updated for Azure cloud
 
- are regularly exercised to ensure readiness

It is recommended to implement security using standardized incident response processes across the enterprise environment.

- [Implement security across the enterprise environment](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Incident response reference guide](/microsoft-365/downloads/IR-Reference-Guide.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-2: Preparation – setup incident notification

**Guidance**: Set up security incident contact information in Azure Security Center. This contact information is used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. You also have options to customize incident alert and notification in different Azure services based on your incident response needs. 

- [How to set the Azure Security Center security contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IR-3: Detection and analysis – create incidents based on high-quality alerts 

**Guidance**: Ensure you have a process to create high-quality alerts and to measure their quality. This allows you to learn lessons from past incidents and prioritize alerts for analysts, to prevent wasted time processing false positive alerts. Build high-quality alerts based on your experiences from past incidents, validated community sources and tools designed to generate and clean up alerts with logging and correlation for diverse alert sources. 

Azure Security Center provides high-quality alerts across many Azure assets. You can use the Security Center data connector to stream the alerts to Azure Sentinel. Create advanced alert rules with Azure Sentinel to generate automatic incidents for an investigation. 

Export your Security Center alerts and recommendations into Azure Sentinel with the export feature to help identify risks to Azure resources. It is recommended to create a process to export alerts and recommendations in an automated fashion for continuous security.

- [How to configure export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-4: Detection and analysis – investigate an incident

**Guidance**: Ensure analysts can query and use diverse data sources to build a full view of the activity that occurred while investigating potential incidents. Diverse log types should be collected to track the activities of a potential attacker across the kill chain to avoid blind spots.  Also ensure insights and learnings are captured for historical reference.  

The data sources for investigation include the centralized logging sources that are already being collected from the in-scope services and running systems, but can also include:

- Network data – use network security groups' flow logs, Azure Network Watcher, and Azure Monitor to capture network flow logs and other analytics information. 

- Snapshots of running systems: 

    - Use Azure virtual machine's snapshot capability to create a snapshot of the running system's disk. 

    - Choose the operating system's native memory dump capability to create a snapshot of the running system's memory.

    - Use the snapshot feature of the Azure services or a third-party software capability to create snapshots of the running systems.

Azure Sentinel provides extensive data analytics across virtually any log source and a case management portal to manage the full lifecycle of incidents. Intelligence information during an investigation can be associated with an incident for tracking and reporting purposes. 

- [Snapshot a Windows machine's disk](../virtual-machines/windows/snapshot-copy-managed-disk.md)

- [Snapshot a Linux machine's disk](../virtual-machines/linux/snapshot-copy-managed-disk.md)

- [Microsoft Azure Support diagnostic information and memory dump collection](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) 

- [Investigate incidents with Azure Sentinel](../sentinel/tutorial-investigate-cases.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-5: Detection and analysis – prioritize incidents

**Guidance**: Provide context to analysts on which incidents to focus on first based on alert severity and asset sensitivity. Use the assigned a severity to each alert from Azure Security Center to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert, as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark resources using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-6: Containment, eradication and recovery – automate the incident handling

**Guidance**: Automate manual repetitive tasks to speed up response time and reduce the burden on analysts. Manual tasks take longer to execute, slowing each incident and reducing how many incidents an analyst can handle. Manual tasks also increase analyst fatigue, which increases the risk of human error that causes delays, and degrades the ability of analysts to focus effectively on complex tasks. 
Use workflow automation features in Azure Security Center and Azure Sentinel to automatically trigger actions or run a playbook to respond to incoming security alerts. The playbook takes actions, such as sending notifications, disabling accounts, and isolating problematic networks. 

- [Configure workflow automation in Security Center](../security-center/workflow-automation.md)

- [Set up automated threat responses in Azure Security Center](../security-center/tutorial-security-incident.md#triage-security-alerts)

- [Set up automated threat responses in Azure Sentinel](../sentinel/tutorial-respond-threats-playbook.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](../security/benchmarks/security-controls-v2-posture-vulnerability-management.md).*

### PV-3: Establish secure configurations for compute resources

**Guidance**: Azure Stack Edge does offer support to create secure configurations for the local virtual machines which are created by the customers. It is strongly recommended to use Microsoft provided guidelines to establish security baselines while creating local virtual machines,

- [Download the security baselines included in the Security compliance toolkit](/windows/security/threat-protection/windows-security-baselines)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PV-4: Sustain secure configurations for compute resources

**Guidance**: Azure Stack Edge does not offer any support to sustain secure configurations for the local virtual machines which have been created by the customers. It is strongly recommended that customers use the Security compliance toolkits (SCT) to help sustain secure configurations for their compute resources.

Host operating system and virtual machines managed by Azure Stack Edge maintain their security configurations. 

- [Windows security baselines](/windows/security/threat-protection/windows-security-baselines#using-security-baselines-in-your-organization)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### PV-5: Securely store custom operating system and container images

**Guidance**: Host operating systems and virtual machines managed by Azure Stack Edge are stored securely. 

Customers can bring their own virtual machine and containers images and are responsible for their secure management.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PV-7: Rapidly and automatically remediate software vulnerabilities

**Guidance**: Azure Stack Edge provides regular patch updates and alerts customers when such updates are available to remediate vulnerabilities. It is the customer's responsibility to keep their devices and virtual machines (created by them) up-to-date with the latest patches.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### PV-8: Conduct regular attack simulation

**Guidance**: As required, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.
Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](../security/fundamentals/pen-testing.md)

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Endpoint Security

*For more information, see the [Azure Security Benchmark: Endpoint Security](../security/benchmarks/security-controls-v2-endpoint-security.md).*

### ES-1: Use Endpoint Detection and Response (EDR)

**Guidance**: Azure Stack Edge does not support endpoint detection and response (EDR) directly. However, you can collect a support package and retrieve audit logs. These logs can then be analyzed to check for anomalous activities. 

- [Collect support package for Azure Stack Edge device](azure-stack-edge-gpu-troubleshoot.md#collect-support-package)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### ES-2: Use centrally managed modern anti-malware software

**Guidance**: Azure Stack Edge uses Windows Defender Application Control (WDAC) with a strict code integrity (CI) Policy that only allows predetermined applications and scripts to be run. Windows Defender Real Time Protection (RTP) anti-malware is also enabled. Customer may choose to run anti-malware in the compute VMs they create to run locally on Azure Stack Edge device.

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Backup and Recovery

*For more information, see the [Azure Security Benchmark: Backup and Recovery](../security/benchmarks/security-controls-v2-backup-recovery.md).*

### BR-1: Ensure regular automated backups

**Guidance**: Periodic backups of your Azure Stack Edge device are recommended and can be performed with Azure Backup and other third-party data protection solutions to protect the data contained in the virtual machines deployed on the device. 

Third-party data protection solutions such as Cohesity, Commvault and Veritas can also provide a backup solution for the data in the local SMB or NFS shares, . 

Additional information is available at the referenced links.

- [Prepare for a device failure](azure-stack-edge-gpu-prepare-device-failure.md)

- [Protect files and folders on VMs](azure-stack-edge-gpu-prepare-device-failure.md#protect-files-and-folders-on-vms)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### BR-2: Encrypt backup data

**Guidance**: Ensure that your backups are protected against
attacks. This should include encryption of the backups to protect against loss
of confidentiality.  For more information, refer to your backup solution of choice for
details.

- [Protect data in Edge local shares](azure-stack-edge-gpu-prepare-device-failure.md#protect-data-in-edge-local-shares)

- [Protect files and folders in virtual machines](azure-stack-edge-gpu-prepare-device-failure.md#protect-files-and-folders-on-vms)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### BR-3: Validate all backups including customer-managed keys

**Guidance**: Periodically perform data restoration of your
backups. 

- [Recovery procedures for Azure Stack Edge](azure-stack-edge-gpu-recover-device-failure.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### BR-4: Mitigate risk of lost keys

**Guidance**: Ensure all Azure Stack Edge backups including any customer-managed keys are protected in accordance with organizational best practices. Your Azure Stack Edge device is associated with an Azure Storage account, used as a destination repository for your data in Azure. 

Access to the Azure Storage account is controlled by Azure subscriptions and the two 512-bit storage access keys associated with that storage account. One of the access keys is used for authentication purposes when the Azure Stack Edge device accesses the storage account. The other key is held in reserved for periodic key rotation. Ensure  security best practices are used for key rotation.

- [Protect Azure Stack Edge device data in the Azure Storage accounts](azure-stack-edge-pro-r-security.md#protect-data-in-storage-accounts)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Governance and Strategy

*For more information, see the [Azure Security Benchmark: Governance and Strategy](../security/benchmarks/security-controls-v2-governance-strategy.md).*

### GS-1: Define asset management and data protection strategy 

**Guidance**: Ensure you document and communicate a clear strategy for continuous monitoring and protection of systems and data. Prioritize discovery, assessment, protection, and monitoring of business-critical data and systems. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Data classification standard in accordance with the business risks

-	Security organization visibility into risks and asset inventory 

-	Security organization approval of Azure services for use 

-	Security of assets through their lifecycle

-	Required access control strategy in accordance with organizational data classification

-	Use of Azure native and third-party data protection capabilities

-	Data encryption requirements for in-transit and at-rest use cases

-	Appropriate cryptographic standards

For more information, see the following references:
- [Azure Security Architecture Recommendation - Storage, data, and encryption](/azure/architecture/framework/security/storage-data-encryption?bc=%2fsecurity%2fcompass%2fbreadcrumb%2ftoc.json&toc=%2fsecurity%2fcompass%2ftoc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../security/fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](../security/fundamentals/data-encryption-best-practices.md?bc=%2fazure%2fcloud-adoption-framework%2f_bread%2ftoc.json&toc=%2fazure%2fcloud-adoption-framework%2ftoc.json)

- [Azure Security Benchmark - Asset management](../security/benchmarks/security-controls-v2-asset-management.md)

- [Azure Security Benchmark - Data Protection](../security/benchmarks/security-controls-v2-data-protection.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-2: Define enterprise segmentation strategy 

**Guidance**: Establish an enterprise-wide strategy to segmenting access to assets using a combination of identity, network, application, subscription, management group, and other controls.

Carefully balance the need for security separation with the need to enable daily operation of the systems that need to communicate with each other and access data.

Ensure that the segmentation strategy is implemented consistently across control types including network security, identity and access models, and application permission/access models, and human process controls.

- [Guidance on segmentation strategy in Azure (video)](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Guidance on segmentation strategy in Azure (document)](/security/compass/governance#enterprise-segmentation-strategy)

- [Align network segmentation with enterprise segmentation strategy](/security/compass/network-security-containment#align-network-segmentation-with-enterprise-segmentation-strategy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-3: Define security posture management strategy

**Guidance**: Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](../security/benchmarks/security-controls-v2-posture-vulnerability-management.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-4: Align organization roles, responsibilities, and accountabilities

**Guidance**: Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, educating everyone on the shared responsibility model, and educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](/azure/cloud-adoption-framework/security/security-top-10#1-people-educate-teams-about-the-cloud-security-journey)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](/azure/cloud-adoption-framework/security/security-top-10#2-people-educate-teams-on-cloud-security-technology)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-5: Define network security strategy

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

- [Azure Security Benchmark - Network Security](../security/benchmarks/index.yml)

- [Azure network security overview](../security/fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-6: Define identity and privileged access strategy

**Guidance**: Establish an Azure identity and privileged access approaches as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	A centralized identity and authentication system and its interconnectivity with other internal and external identity systems

-	Strong authentication methods in different use cases and conditions

-	Protection of highly privileged users

-	Anomaly user activities monitoring and handling  

-	User identity and access review and reconciliation process

For more information, see the following references:

- [Azure Security Benchmark - Identity management](../security/benchmarks/security-controls-v2-identity-management.md)

- [Azure Security Benchmark - Privileged access](../security/benchmarks/security-controls-v2-privileged-access.md)

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure identity management security overview](../security/fundamentals/identity-management-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-7: Define logging and threat response strategy

**Guidance**: Establish a logging and threat response strategy to rapidly detect and remediate threats while meeting compliance requirements. Prioritize providing analysts with high-quality alerts and seamless experiences so that they can focus on threats rather than integration and manual steps. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	The security operations (SecOps) organization’s role and responsibilities 

-	A well-defined incident response process aligning with NIST or another industry framework 

-	Log capture and retention to support threat detection, incident response, and compliance needs

-	Centralized visibility of and correlation information about threats, using SIEM, native Azure capabilities, and other sources 

-	Communication and notification plan with your customers, suppliers, and public parties of interest

-	Use of Azure native and third-party platforms for incident handling, such as logging and threat detection, forensics, and attack remediation and eradication

-	Processes for handling incidents and post-incident activities, such as lessons learned and evidence retention

For more information, see the following references:

- [Azure Security Benchmark - Logging and threat detection](../security/benchmarks/security-controls-v2-logging-threat-detection.md)

- [Azure Security Benchmark - Incident response](../security/benchmarks/security-controls-v2-incident-response.md)

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)
