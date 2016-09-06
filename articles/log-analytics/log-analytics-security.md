<properties
	pageTitle="Log Analytics data security | Microsoft Azure"
	description="Learn about how Log Analytics protects your privacy and secures your data."
	services="log-analytics"
	documentationCenter=""
	authors="bandersmsft"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/20/2016"
	ms.author="banders"/>

# Log Analytics data security

Microsoft is committed to protecting your privacy and securing your data, while delivering software and services that help you manage the IT infrastructure of your organization. We recognize that when you entrust your data to others, that trust requires rigorous security. Microsoft adheres to strict compliance and security guidelines—from coding to operating a service.

Securing and protecting data is a top priority at Microsoft. Please contact us with any questions, suggestions, or issues about any of the following information, including our security policies at [Azure support options](http://azure.microsoft.com/support/options/).

This article explains how data is collected, processed, and secured by Log Analytics in Operations Management Suite (OMS). You can use agents to connect to the web service, use System Center Operations Manager to collect operational data, or retrieve data from Azure diagnostics for use by Log Analytics. The collected data is sent over the Internet to the Log Analytics service, which is hosted in Microsoft Azure.

The Log Analytics service manages your cloud-based data securely by using the following methods:

**Data segregation:** Customer data is kept logically separate on each component throughout the OMS service. All data is tagged per organization. This tagging persists throughout the data lifecycle, and it is enforced at each layer of the service. Each customer has a dedicated Azure blob that houses the long-term data.

**Data retention:** Aggregated metrics for some of the solutions, such as Capacity Management, is stored in a SQL Database hosted by Microsoft Azure. This data is stored for 390 days. Indexed log search data is stored and retained according to your pricing plan. For more information, see [Log Analytics Pricing](https://azure.microsoft.com/pricing/details/log-analytics/).

**Physical security:** The Log Analytics in OMS service is manned by Microsoft personnel and all activities are logged and can be audited. The service runs completely in Azure and complies with the Azure common engineering criteria. You can view details about the physical security of Azure assets on page 18 of the [Microsoft Azure Security Overview](http://download.microsoft.com/download/6/0/2/6028B1AE-4AEE-46CE-9187-641DA97FC1EE/Windows%20Azure%20Security%20Overview%20v1.01.pdf).

**Compliance and certifications:** The OMS software development and service team is actively working with the Microsoft Legal and Compliance teams and other industry partners to acquire a variety of certifications.

Log Analytics in OMS currently meet the following security standards:

- Windows Common Engineering Criteria
- Microsoft Trustworthy Computing Certification
- [ISO/IEC 27001](http://www.iso.org/iso/home/standards/management-standards/iso27001.htm) compliant
- [Service Organization Controls (SOC) 1 Type 1 and SOC 2 Type 1](https://www.microsoft.com/en-us/TrustCenter/Compliance/SOC1-and-2) compliant


## Cloud computing security data flow
The following diagram shows a cloud security architecture as the flow of information from your company and how it is secured as is moves to the Log Analytics service, ultimately seen by you in the OMS portal. More information about each step follows the diagram.

![Image of OMS data collection and security](./media/log-analytics-security/log-analytics-security-diagram.png)

## 1. Sign up for Log Analytics and collect data

For your organization to send data to Log Analytics, you configure Windows agents, agents running on Azure virtual machines, or OMS Agents for Linux. If you use Operations Manager agents, then you'll use a configuration wizard in the Operations console to configure them. Users (which might be you, other individual users, or a group of people) create one or more OMS accounts and register agents by using one of the following accounts:


- [Organizational ID](../active-directory/sign-up-organization.md)

- [Microsoft Account - Outlook, Office Live, MSN](http://www.microsoft.com/account/default.aspx)

An account is where data is collected, aggregated, analyzed, and presented. An account is primarily used as a means to partition data, and each account is unique. For example, you might want to have your production data managed with one OMS account and your test data managed with another account. Accounts also help an administrator control user access to the data. Each account can have multiple user accounts associated with it, and each user account can have multiple OMS accounts.

For Operations Manager, when the configuration wizard completes, each Operations Manager management group establishes a connection with the Log Analytics service. You then use the Add Computers Wizard to choose which computers in the management group are allowed to send data to the service. For other agent types, each connects securely to the OMS service.

Each type of agent collects data for Log Analytics. The type of data that is collected is dependent on the types of solutions used. A solution is a bundle of predefined views, log search queries, data collection rules, and processing logic. Only administrators can use Log Analytics to import a solution. After the solution is imported, it is moved to the Operations Manager management servers (if used), and then to any agents that you have chosen. Afterward, the agents collect the data.

Data for the specific solutions that you've enabled is collected. See [Add Log Analytics solutions from the Solutions Gallery](log-analytics-add-solutions.md) for more information about the data that is collected for various solutions.


## 2. Send data from agents

You register all agent types with an enrollment key and a secure connection is established between the agent and the Log Analytics service using certificate-based authentication and SSL with port 443.

With Operations Manager, you register an account with the Log Analytics service and a secure HTTPS connection is established between the Operations Manager management server. If Operations Manager is unable to communicate to the service for any reason, the collected data is stored in a temporary cache and the management server tries to resend the data every 8 minutes for 2 hours. Collected data is compressed and sent to the service, bypassing on-premises databases, so it does not add any load to them. After the collected data is sent, it is removed from the cache.

For Windows agents running on Azure virtual machines, a read-only storage key is used to read diagnostic events in Azure tables.


## 3. The Log Analytics service receives and processes data

The Log Analytics service ensures that incoming data is from a trusted source by validating certificates and the data integrity with Azure authentication. The unprocessed raw data is then stored as a blob in [Microsoft Azure Storage](../storage/storage-introduction.md). Each Log Analytics user has a dedicated Azure blob, which is accessible only to that user. The type of data that is stored is dependent on the types of solutions that were imported and used to collect data.

The Log Analytics service processes the raw data, and the aggregated processed data is stored in a SQL database. Communication between the service and SQL database relies on SQL database authentication.

## 4. Use Log Analytics to access the data

You can sign in to Log Analytics in the OMS portal by using the organizational account or Microsoft account that you set up previously. All traffic between the OMS portal and Log Analytics in OMS is sent over a secure HTTPS channel.

## Next steps

- [Get started with Log Analytics](log-analytics-get-started.md) to learn more about Log Analytics and get up and running in minutes.
