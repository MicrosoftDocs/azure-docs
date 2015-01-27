<properties pageTitle="Operational Insights security" description="Operational Insights is an analysis service that enables IT administrators to gain deep insight across on-premises and cloud environments. It enables you to interact with real-time and historical machine data to rapidly develop custom insights, and provides Microsoft and community-developed patterns for analyzing data." services="operational-insights" documentationCenter="" authors="bandersmsft" manager="jwhit" editor=""/>

<tags ms.service="operational-insights" ms.workload="appservices" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/06/2014" ms.author="banders"/>





<h1 id="">Operational Insights security</h1>


Microsoft is committed to protecting your privacy and securing your data, while delivering software and services that help you manage the IT infrastructure of your organization. We recognize that when you entrust your data to others, that trust requires rigorous security. Microsoft adheres to strict compliance and security guidelines—from coding to operating a service.

Securing and protecting data is a top priority at Microsoft. Please contact us with any questions, suggestions, or issues about any of the following information, including our security policies: <a href="mailto:scdata@microsoft.com" target="_blank">scdata@microsoft.com</a>.

This article explains how data is collected, processed, and secured in Microsoft Azure Operational Insights. You can use either agents to connect directly to the web service or you can use System Center Operations Manager to collect operational data for the Operational Insights service. The collected data is sent over the Internet to the Operational Insights service, which is hosted in Microsoft Azure.

The Operational Insights service manages your data securely by using the following methods:

**Data segregation:** Customer data is kept logically separate on each component throughout the Operational Insights service. All data is tagged per organization. This tagging persists throughout the data lifecycle, and it is enforced at each layer of the service. 

Each customer has a dedicated Azure blob that houses the long-term data. The blob is encrypted with unique per-customer keys, which are changed every 90 days.

**Data retention:** Aggregated metrics for each of the intelligence packs is stored in a SQL Database hosted by Microsoft Azure. This data is stored for 390 days. Indexed search data is stored for 10 days on average before the data is groomed. If the upper limit of 20 million records for each data type is reached earlier, Operational Insights grooms the data earlier than 10 days. If the data limit is not reached by 10 days, Operational Insights waits until the limit is reached to groom it.

**Physical security:** The Operational Insights service is manned by Microsoft personnel and all activities are logged and can be audited. The Operational Insights service runs completely in Azure and complies with the Azure common engineering criteria. You can view details about the physical security of Azure assets on page 18 of the  <a href="http://download.microsoft.com/download/6/0/2/6028B1AE-4AEE-46CE-9187-641DA97FC1EE/Windows%20Azure%20Security%20Overview%20v1.01.pdf" target="_blank">Microsoft Azure Security Overview</a>.

**Compliance and certifications:** The Operational Insights software development and service team is actively working with the Microsoft Legal and Compliance teams and other industry partners to acquire a variety of certifications, including ISO, before the Operational Insights service is generally available.

We currently meet the following security standards:

- Windows Common Engineering Criteria
- Microsoft Trustworthy Computing Certification


