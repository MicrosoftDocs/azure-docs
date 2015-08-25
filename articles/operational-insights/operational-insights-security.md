<properties
	pageTitle="Operational Insights Security"
	description="Learn about how Operational Insights protects your privacy and secures your data."
	services="operational-insights"
	documentationCenter=""
	authors="bandersmsft"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="operational-insights"
	ms.workload="dev-center-name"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/22/2015"
	ms.author="banders"/>

# Operational Insights security

[AZURE.INCLUDE [operational-insights-note-moms](../../includes/operational-insights-note-moms.md)]

Microsoft is committed to protecting your privacy and securing your data, while delivering software and services that help you manage the IT infrastructure of your organization. We recognize that when you entrust your data to others, that trust requires rigorous security. Microsoft adheres to strict compliance and security guidelines—from coding to operating a service.

Securing and protecting data is a top priority at Microsoft. Please contact us with any questions, suggestions, or issues about any of the following information, including our security policies at [Azure support options](http://azure.microsoft.com/support/options/).

This article explains how data is collected, processed, and secured in the Operations Management Suite (OMS). It was previously called Microsoft Azure Operational Insights. You can use either agents to connect directly to the web service or you can use System Center Operations Manager to collect operational data for the OMS service. The collected data is sent over the Internet to the OMS service, which is hosted in Microsoft Azure.

The OMS service manages your data securely by using the following methods:

**Data segregation:** Customer data is kept logically separate on each component throughout the OMS service. All data is tagged per organization. This tagging persists throughout the data lifecycle, and it is enforced at each layer of the service.

Each customer has a dedicated Azure blob that houses the long-term data. The blob is encrypted with unique per-customer keys, which are changed every 90 days.

**Data retention:** Aggregated metrics for some of the solutions (previously called intelligence packs), such as Capacity Management, is stored in a SQL Database hosted by Microsoft Azure. This data is stored for 390 days. Indexed log search data is stored and retained according to the pricing plan. For more information look at the [Pricing Page](http://azure.microsoft.com/pricing/details/operational-insights/)

**Physical security:** The OMS service is manned by Microsoft personnel and all activities are logged and can be audited. The OMS service runs completely in Azure and complies with the Azure common engineering criteria. You can view details about the physical security of Azure assets on page 18 of the [Microsoft Azure Security Overview](http://download.microsoft.com/download/6/0/2/6028B1AE-4AEE-46CE-9187-641DA97FC1EE/Windows%20Azure%20Security%20Overview%20v1.01.pdf).

**Compliance and certifications:** The OMS software development and service team is actively working with the Microsoft Legal and Compliance teams and other industry partners to acquire a variety of certifications, including ISO.

We currently meet the following security standards:

- Windows Common Engineering Criteria
- Microsoft Trustworthy Computing Certification


## Data flow security
The following diagram shows the flow of information from your company and how it is secured as is moves to the OMS service, ultimately seen by you in OMS. More information about each step follows the diagram.

![Image of OMS data collection and security](./media/operational-insights-security/security.png)

### 1. Sign up for OMS and collect data

For your organization to send data to the OMS service, you must either configure Microsoft Monitoring agents when connecting directly to the web service or use a configuration wizard in the Operations console in Operations Manager. Users (which might be you, other individual users, or a group of people) must create one or more OMS accounts and register either each directly-connected agent or their Operations Manager environment by using one of the following accounts:


- [Organizational ID](../sign-up-organization.md)

- [Microsoft Account - Outlook, Office Live, MSN](../sign-up-organization.md)

An OMS account is where data is collected, aggregated, analyzed, and presented. An OMS account is primarily used as a means to partition data, and each OMS account is unique. For example, you might want to have your production data managed with one OMS account and your test data managed with another account. Accounts also help an administrator control user access to the data. Each OMS account can have multiple user accounts associated with it, and each user account can have multiple OMS accounts.

When the configuration wizard is complete, each Operations Manager management group establishes a connection with the OMS service. You then use the Add Computers Wizard to choose which computers in the management group are allowed to send data to the service.

Both types of agents collect data for OMS. The type of data that is collected is dependent on the types of solutions used. A solution is a bundle of predefined views, log search queries, data collection rules, and processing logic. Only OMS administrators can use OMS to import a solution. After the solution is imported, it is moved to the Operations Manager management servers (if used), and then to the Operations Manager agents that you have chosen. Afterward, the agents collect the data.

The following table lists the available solutions in OMS and the types of data they collect.


|**Solution**|**Data types**|
|---|---|
|Configuration Assessment|Configuration data, metadata, and state data|
|Capacity Planning|Performance data, metadata, and state data|
|Antimalware|Configuration data, metadata, and state data|
|System Update Assessment|Metadata and state data|
|Log Management|User-defined event logs|
|Change Tracking|Software inventory and Windows service metadata|
|SQL and Active Directory Assessment|WMI data, registry data, performance data, and SQL Server dynamic management view results|



The following table shows examples of data types:

|**Data type**|**Fields**|
|---|---|
|Alert|Alert Name, Alert Description, BaseManagedEntityId, Problem ID, IsMonitorAlert, RuleId, ResolutionState, Priority, Severity, Category, Owner, ResolvedBy, TimeRaised, TimeAdded, LastModified, LastModifiedBy, LastModifiedExceptRepeatCount, TimeResolved, TimeResolutionStateLastModified, TimeResolutionStateLastModifiedInDB, RepeatCount|
|Configuration|CustomerID, AgentID, EntityID, ManagedTypeID, ManagedTypePropertyID, CurrentValue, ChangeDate|
|Event|EventId, EventOriginalID, BaseManagedEntityInternalId, RuleId, PublisherId, PublisherName, FullNumber, Number, Category, ChannelLevel, LoggingComputer, EventData, EventParameters, TimeGenerated, TimeAdded **Note:** *When you log events with custom fields into the Windows event log, OMS collects them.*|
|Metadata|BaseManagedEntityId, ObjectStatus, OrganizationalUnit, ActiveDirectoryObjectSid, PhysicalProcessors, NetworkName, IPAddress, ForestDNSName, NetbiosComputerName, VirtualMachineName, LastInventoryDate, HostServerNameIsVirtualMachine, IP Address, NetbiosDomainName, LogicalProcessors, DNSName, DisplayName, DomainDnsName, ActiveDirectorySite, PrincipalName, OffsetInMinuteFromGreenwichTime|
|Performance|ObjectName, CounterName, PerfmonInstanceName, PerformanceDataId, PerformanceSourceInternalID, SampleValue, TimeSampled, TimeAdded|
|State|StateChangeEventId, StateId, NewHealthState, OldHealthState, Context, TimeGenerated, TimeAdded, StateId2, BaseManagedEntityId, MonitorId, HealthState, LastModified, LastGreenAlertGenerated, DatabaseTimeModified|


### 2. Send data from agents

With agents that connect directly to the web service, you register them with a key and a secure connection is established between the agent and the OMS service by using port 443.

With Operations Manager, you register an account with the OMS service and a secure HTTPS connection is established between the Operations Manager management server and the OMS service by using port 443. If Operations Manager is unable to communicate to the service for any reason, the collected data is stored in a temporary cache and the management server tries to resend the data every 8 minutes for 2 hours. Collected data is compressed and sent to the OMS service, bypassing on-premises databases, so it does not add any load to them. After the collected data is sent, it is removed from the cache.

### 3. The OMS service receives and processes data

The OMS service ensures that incoming data is from a trusted source by validating certificates and the data integrity. The unprocessed raw data is then stored as a blob in [Microsoft Azure Storage](http://azure.microsoft.com/documentation/services/storage/). Each OMS user has a dedicated Azure blob, which is accessible only to that user. The type of data that is stored is dependent on the types of solutions that were imported and used to collect data.

The OMS service processes the raw data, and the aggregated processed data is stored in a SQL database. Communication between the OMS service and SQL database relies on SQL database authentication.

### 4. Use OMS to access the data

You can sign in to OMS by using the account you set up previously. All traffic between OMS and the OMS service is sent over a secure HTTPS channel.
