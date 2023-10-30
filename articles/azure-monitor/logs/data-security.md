---
title: Azure Monitor Logs data security | Microsoft Docs
description: Learn about how Azure Monitor Logs protects your privacy and secures your data.
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.reviewer: MeirMen
ms.date: 07/02/2023

---

# Azure Monitor Logs data security

This article explains how Azure Monitor collects, processes, and secures log data, and describes security features you can use to further secure your Azure Monitor environment. The information in this article is specific to [Azure Monitor Logs](../logs/data-platform-logs.md) and supplements the information on [Azure Trust Center](https://www.microsoft.com/en-us/trust-center?rtc=1).  

Azure Monitor Logs manages your cloud-based data securely using:

* Data segregation
* Data retention
* Physical security
* Incident management
* Compliance
* Security standards certifications

Contact us with any questions, suggestions, or issues about any of the following information, including our security policies at [Azure support options](https://azure.microsoft.com/support/options/).

## Sending data securely using TLS 1.2 

To ensure the security of data in transit to Azure Monitor, we strongly encourage you to configure the agent to use at least Transport Layer Security (TLS) 1.2. Older versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable and while they still currently work to allow backwards compatibility, they are **not recommended**, and the industry is quickly moving to abandon support for these older protocols. 

The [PCI Security Standards Council](https://www.pcisecuritystandards.org/) has set a [deadline of June 30, 2018](https://www.pcisecuritystandards.org/pdfs/PCI_SSC_Migrating_from_SSL_and_Early_TLS_Resource_Guide.pdf) to disable older versions of TLS/SSL and upgrade to more secure protocols. Once Azure drops legacy support, if your agents can't communicate over at least TLS 1.2 you won't be able to send data to Azure Monitor Logs. 

We recommend you do NOT explicit set your agent to only use TLS 1.2 unless necessary. Allowing the agent to automatically detect, negotiate, and take advantage of future security standards is preferable. Otherwise you may miss the added security of the newer standards and possibly experience problems if TLS 1.2 is ever deprecated in favor of those newer standards.    

### Platform-specific guidance

|Platform/Language | Support | More Information |
| --- | --- | --- |
|Linux | Linux distributions tend to rely on [OpenSSL](https://www.openssl.org) for TLS 1.2 support.  | Check the [OpenSSL Changelog](https://www.openssl.org/news/changelog.html) to confirm your version of OpenSSL is supported.|
| Windows 8.0 - 10 | Supported, and enabled by default. | To confirm that you're still using the [default settings](/windows-server/security/tls/tls-registry-settings).  |
| Windows Server 2012 - 2016 | Supported, and enabled by default. | To confirm that you're still using the [default settings](/windows-server/security/tls/tls-registry-settings) |
| Windows 7 SP1 and Windows Server 2008 R2 SP1 | Supported, but not enabled by default. | See the [Transport Layer Security (TLS) registry settings](/windows-server/security/tls/tls-registry-settings) page for details on how to enable.  |

## Data segregation
After your data is ingested by Azure Monitor, the data is kept logically separate on each component throughout the service. All data is tagged per workspace. This tagging persists throughout the data lifecycle, and it's enforced at each layer of the service. Your data is stored in a dedicated database in the storage cluster in the region you've selected.

## Data retention
Indexed log search data is stored and retained according to your pricing plan. For more information, see [Log Analytics Pricing](https://azure.microsoft.com/pricing/details/log-analytics/).

As part of your [subscription agreement](https://azure.microsoft.com/support/legal/subscription-agreement/), Microsoft retains your data per the terms of the agreement.  When customer data is removed, no physical drives are destroyed.  

The following table lists some of the available solutions and provides examples of the type of data they collect.

| **Solution** | **Data types** |
| --- | --- |
| Capacity and Performance |Performance data and metadata |
| Update Management |Metadata and state data |
| Log Management |User-defined event logs, Windows Event Logs and/or IIS Logs |
| Change Tracking |Software inventory, Windows service and Linux daemon metadata, and Windows/Linux file metadata |
| SQL and Active Directory Assessment |WMI data, registry data, performance data, and SQL Server dynamic management view results |

The following table shows examples of data types:

| **Data type** | **Fields** |
| --- | --- |
| Alert |Alert Name, Alert Description, BaseManagedEntityId, Problem ID, IsMonitorAlert, RuleId, ResolutionState, Priority, Severity, Category, Owner, ResolvedBy, TimeRaised, TimeAdded, LastModified, LastModifiedBy, LastModifiedExceptRepeatCount, TimeResolved, TimeResolutionStateLastModified, TimeResolutionStateLastModifiedInDB, RepeatCount |
| Configuration |CustomerID, AgentID, EntityID, ManagedTypeID, ManagedTypePropertyID, CurrentValue, ChangeDate |
| Event |EventId, EventOriginalID, BaseManagedEntityInternalId, RuleId, PublisherId, PublisherName, FullNumber, Number, Category, ChannelLevel, LoggingComputer, EventData, EventParameters, TimeGenerated, TimeAdded <br>**Note:** When you write events with custom fields in to the Windows event log, Log Analytics collects them. |
| Metadata |BaseManagedEntityId, ObjectStatus, OrganizationalUnit, ActiveDirectoryObjectSid, PhysicalProcessors, NetworkName, IPAddress, ForestDNSName, NetbiosComputerName, VirtualMachineName, LastInventoryDate, HostServerNameIsVirtualMachine, IP Address, NetbiosDomainName, LogicalProcessors, DNSName, DisplayName, DomainDnsName, ActiveDirectorySite, PrincipalName, OffsetInMinuteFromGreenwichTime |
| Performance |ObjectName, CounterName, PerfmonInstanceName, PerformanceDataId, PerformanceSourceInternalID, SampleValue, TimeSampled, TimeAdded |
| State |StateChangeEventId, StateId, NewHealthState, OldHealthState, Context, TimeGenerated, TimeAdded, StateId2, BaseManagedEntityId, MonitorId, HealthState, LastModified, LastGreenAlertGenerated, DatabaseTimeModified |

## Physical security
Azure Monitor is managed by Microsoft personnel and all activities are logged and can be audited. Azure Monitor is operated as an Azure Service and meets all Azure Compliance and Security requirements. You can view details about the physical security of Azure assets on page 18 of the [Microsoft Azure Security Overview](https://download.microsoft.com/download/6/0/2/6028B1AE-4AEE-46CE-9187-641DA97FC1EE/Windows%20Azure%20Security%20Overview%20v1.01.pdf). Physical access rights to secure areas are changed within one business day for anyone who no longer has responsibility for the Azure Monitor service, including transfer and termination. You can read about the global physical infrastructure we use at [Microsoft Datacenters](https://azure.microsoft.com/global-infrastructure/).

## Incident management
Azure Monitor has an incident management process that all Microsoft services adhere to. To summarize, we:

* Use a shared responsibility model where a portion of security responsibility belongs to Microsoft and a portion belongs to the customer
* Manage Azure security incidents:
  * Start an investigation upon detection of an incident
  * Assess the impact and severity of an incident by an on-call incident response team member. Based on evidence, the assessment may or may not result in further escalation to the security response team.
  * Diagnose an incident by security response experts to conduct the technical or forensic investigation, identify containment, mitigation, and work around strategies. If the security team believes that customer data may have become exposed to an unlawful or unauthorized individual, parallel execution of the Customer Incident Notification process begins in parallel.  
  * Stabilize and recover from the incident. The incident response team creates a recovery plan to mitigate the issue. Crisis containment steps such as quarantining impacted systems may occur immediately and in parallel with diagnosis. Longer term mitigations may be planned which occur after the immediate risk has passed.  
  * Close the incident and conduct a post-mortem. The incident response team creates a post-mortem that outlines the details of the incident, with the intention to revise policies, procedures, and processes to prevent a recurrence of the event.
* Notify customers of security incidents:
  * Determine the scope of impacted customers and to provide anybody who is impacted as detailed a notice as possible
  * Create a notice to provide customers with detailed enough information so that they can perform an investigation on their end and meet any commitments they have made to their end users while not unduly delaying the notification process.
  * Confirm and declare the incident, as necessary.
  * Notify customers with an incident notification without unreasonable delay and in accordance with any legal or contractual commitment. Notifications of security incidents are delivered to one or more of a customer's administrators by any means Microsoft selects, including via email.
* Conduct team readiness and training:
  * Microsoft personnel are required to complete security and awareness training, which helps them to identify and report suspected security issues.  
  * Operators working on the Microsoft Azure service have addition training obligations surrounding their access to sensitive systems hosting customer data.
  * Microsoft security response personnel receive specialized training for their roles

While rare, Microsoft notifies each customer within one day if significant loss of any customer data occurs. 

For more information about how Microsoft responds to security incidents, see [Microsoft Azure Security Response in the Cloud](https://gallery.technet.microsoft.com/Azure-Security-Response-in-dd18c678/file/150826/4/Microsoft%20Azure%20Security%20Response%20in%20the%20cloud.pdf).

## Compliance
The Azure Monitor software development and service team's information security and governance program supports its business requirements and adheres to laws and regulations as described at [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/) and [Microsoft Trust Center Compliance](https://www.microsoft.com/en-us/trustcenter/compliance/default.aspx). How Azure Monitor Logs establishes security requirements, identifies security controls, manages, and monitors risks are also described there. Annually, we review policies, standards, procedures, and guidelines.

Each development team member receives formal application security training. Internally, we use a version control system for software development. Each software project is protected by the version control system.

Microsoft has a security and compliance team that oversees and assesses all services at Microsoft. Information security officers make up the team and they are not associated with the engineering teams that develop Log Analytics. The security officers have their own management chain and conduct independent assessments of products and services to ensure security and compliance.

Microsoft's board of directors is notified by an annual report about all information security programs at Microsoft.

The Log Analytics software development and service team are actively working with the Microsoft Legal and Compliance teams and other industry partners to acquire various certifications.

## Certifications and attestations
Azure Log Analytics meets the following requirements:

* [ISO/IEC 27001](https://www.iso.org/iso/home/standards/management-standards/iso27001.htm)
* [ISO/IEC 27018:2014](https://www.iso.org/iso/home/store/catalogue_tc/catalogue_detail.htm?csnumber=61498)
* [ISO 22301](https://azure.microsoft.com/blog/iso22301/)
* [Payment Card Industry (PCI Compliant) Data Security Standard (PCI DSS)](https://www.microsoft.com/en-us/TrustCenter/Compliance/PCI) by the PCI Security Standards Council.
* [Service Organization Controls (SOC) 1 Type 1 and SOC 2 Type 1](https://www.microsoft.com/en-us/TrustCenter/Compliance/SOC1-and-2) compliant
* [HIPAA and HITECH](/compliance/regulatory/offering-hipaa-hitech) for companies that have a HIPAA Business Associate Agreement
* Windows Common Engineering Criteria
* Microsoft Trustworthy Computing
* As an Azure service, the components that Azure Monitor uses adhere to Azure compliance requirements. You can read more at [Microsoft Trust Center Compliance](https://www.microsoft.com/en-us/trustcenter/compliance/default.aspx).

> [!NOTE]
> In some certifications/attestations, Azure Monitor Logs is listed under its former name of *Operational Insights*.
>
>

## Cloud computing security data flow
The following diagram shows a cloud security architecture as the flow of information from your company and how it's secured as is moves to Azure Monitor, ultimately seen by you in the Azure portal. More information about each step follows the diagram.

![Image of Azure Monitor Logs data collection and security](./media/data-security/log-analytics-data-security-diagram.png)

### 1. Sign up for Azure Monitor and collect data
For your organization to send data to Azure Monitor Logs, you configure a Windows or Linux agent running on Azure virtual machines, or on virtual or physical computers in your environment or other cloud provider.  If you use Operations Manager, from the management group you configure the Operations Manager agent. Users (which might be you, other individual users, or a group of people) create one or more Log Analytics workspaces, and register agents by using one of the following accounts:

* [Organizational ID](../../active-directory/fundamentals/sign-up-organization.md)
* [Microsoft Account - Outlook, Office Live, MSN](https://account.microsoft.com/account)

A Log Analytics workspace is where data is collected, aggregated, analyzed, and presented. A workspace is primarily used as a means to partition data, and each workspace is unique. For example, you might want to have your production data managed with one workspace and your test data managed with another workspace. Workspaces also help an administrator control user access to the data. Each workspace can have multiple user accounts associated with it, and each user account can access multiple Log Analytics workspaces. You create workspaces based on datacenter region.

For Operations Manager, the Operations Manager management group establishes a connection with the Azure Monitor service. You then configure which agent-managed systems in the management group are allowed to collect and send data to the service. Depending on the solution you've enabled, data from these solutions are either sent directly from an Operations Manager management server to the Azure Monitor service, or because of the volume of data collected by the agent-managed system, are sent directly from the agent to the service. For systems not monitored by Operations Manager, each connects securely to the Azure Monitorservice directly.

All communication between connected systems and the Azure Monitor service is encrypted. The TLS (HTTPS) protocol is used for encryption.  The Microsoft SDL process is followed to ensure Log Analytics is up-to-date with the most recent advances in cryptographic protocols.

Each type of agent collects log data for Azure Monitor. The type of data that is collected depends on the configuration of your workspace and other features of Azure Monitor. 

### 2. Send data from agents
You register all agent types with an enrollment key and a secure connection is established between the agent and the Azure Monitor service using certificate-based authentication and TLS with port 443. Azure Monitor uses a secret store to generate and maintain keys. Private keys are rotated every 90 days and are stored in Azure and are managed by the Azure operations who follow strict regulatory and compliance practices.

With Operations Manager, the management group registered with a Log Analytics workspace establishes a secure HTTPS connection with an Operations Manager management server.

For Windows or Linux agents running on Azure virtual machines, a read-only storage key is used to read diagnostic events in Azure tables.  

With any agent reporting to an Operations Manager management group that is integrated with Azure Monitor, if the management server is unable to communicate with the service for any reason, the collected data is stored locally in a temporary cache on the management server.   They try to resend the data every eight minutes for two hours.  For data that bypasses the management server and is sent directly to Azure Monitor, the behavior is consistent with the Windows agent.  

The Windows or management server agent cached data is protected by the operating system's credential store. If the service cannot process the data after two hours, the agents will queue the data. If the queue becomes full, the agent starts dropping data types, starting with performance data. The agent queue limit is a registry key so you can modify it, if necessary. Collected data is compressed and sent to the service, bypassing the Operations Manager management group databases, so it does not add any load to them. After the collected data is sent, it is removed from the cache.

As described above, data from the management server or direct-connected agents is sent over TLS to Microsoft Azure datacenters. Optionally, you can use ExpressRoute to provide extra security for the data. ExpressRoute is a way to directly connect to Azure from your existing WAN network, such as a multi-protocol label switching (MPLS) VPN, provided by a network service provider. For more information, see [ExpressRoute](https://azure.microsoft.com/services/expressroute/).

### 3. The Azure Monitor service receives and processes data
The Azure Monitor service ensures that incoming data is from a trusted source by validating certificates and the data integrity with Azure authentication. The unprocessed raw data is then stored in an Azure Event Hubs in the region the data will eventually be stored at rest. The type of data that is stored depends on the types of solutions that were imported and used to collect data. Then, the Azure Monitor service processes the raw data and ingests it into the database.

The retention period of collected data stored in the database depends on the selected pricing plan. For the *Free* tier, collected data is available for seven days. For the *Paid* tier, collected data is available for 31 days by default, but can be extended to 730 days. Data is stored encrypted at rest in Azure storage, to ensure data confidentiality, and the data is replicated within the local region using locally redundant storage (LRS), or zone-redundant storage (ZRS) in [supported regions](../logs/availability-zones.md). The last two weeks of data are also stored in SSD-based cache and this cache is encrypted.

Data in database storage cannot be altered once ingested but can be deleted via [*purge* API path](personal-data-mgmt.md#delete). Although data cannot be altered, some certifications require that data is kept immutable and cannot be changed or deleted in storage. Data immutability can be achieved using [data export](logs-data-export.md) to a storage account that is configured as [immutable storage](../../storage/blobs/immutable-policy-configure-version-scope.md).

### 4. Use Azure Monitor to access the data
To access your Log Analytics workspace, you sign in to the Azure portal using the organizational account or Microsoft account that you set up previously. All traffic between the portal and Azure Monitor service is sent over a secure HTTPS channel. When using the portal, a session ID is generated on the user client (web browser) and data is stored in a local cache until the session is terminated. When terminated, the cache is deleted. Client-side cookies, which do not contain personally identifiable information, are not automatically removed. Session cookies are marked HTTPOnly and are secured. After a pre-determined idle period, the Azure portal session is terminated.


## Additional security features
You can use these additional security features to further secure your Azure Monitor environment. These features require more administrator management. 
- [Customer-managed (security) keys](../logs/customer-managed-keys.md) - You can use customer-managed keys to encrypt data sent to your Log Analytics workspaces. It requires use of Azure Key Vault. 
- [Private/customer-managed storage](./private-storage.md) - Manage your personally encrypted storage account and tell Azure Monitor to use it to store monitoring data 
- [Private Link networking](./private-link-security.md) - Azure Private Link allows you to securely link Azure PaaS services (including Azure Monitor) to your virtual network using private endpoints. 
- [Azure Customer Lockbox](../../security/fundamentals/customer-lockbox-overview.md) - Customer Lockbox for Microsoft Azure provides an interface for customers to review and approve or reject customer data access requests. It is used in cases where a Microsoft engineer needs to access customer data during a support request.

## Tamper-proofing and immutability 

Azure Monitor is an append-only data platform, but includes provisions to delete data for compliance purposes. You can [set a lock on your Log Analytics workspace](../../azure-resource-manager/management/lock-resources.md) to block all activities that could delete data: purge, table delete, and table- or workspace-level data retention changes. However, this lock can still be removed. 

To fully tamper-proof your monitoring solution, we recommend you [export your data to an immutable storage solution](../../storage/blobs/immutable-storage-overview.md).


## Next steps
* [See the different kinds of data that you can collect in Azure Monitor](../monitor-reference.md).
