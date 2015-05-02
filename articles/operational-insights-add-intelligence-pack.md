<properties 
    pageTitle="Operational Insights intelligence packs" 
    description="You can add additional functionality to Operational Insights with intelligence packs" 
    services="operational-insights" 
    documentationCenter="" 
    authors="bandersmsft" 
    manager="jwhit" 
    editor=""/>

<tags 
    ms.service="operational-insights" 
    ms.workload="operational-insights" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="04/30/2015" 
    ms.author="banders"/>

# Operational Insights intelligence packs

[AZURE.INCLUDE [operational-insights-note-moms](../includes/operational-insights-note-moms.md)]

Microsoft Azure Operational Insights includes the base Configuration Assessment module. However, you can get additional functionality by adding intelligence packs to it from the Overview page.

![image of intelligence packs icon](./media/operational-insights-add-intelligence-pack/overview-intelpacks.png)

After you have added an intelligence pack, data is collected from the servers in your infrastructure and sent to the Operational Insights service. Processing by the Operational Insights service can take from a few minutes to several hours. After the service processes the data, you can view it in Operational Insights.

You can easily remove an intelligence pack when it is no longer needed. When you remove an intelligence pack, its data is not sent to Operational Insights, which reduces the amount of data used by your daily quota.

## Intelligence packs supported by the Microsoft Monitoring Agent

At this time, servers that are connected directly to Microsoft Azure Operational Insights using the Microsoft Monitoring Agent can use most of the intelligence packs available, including:

- [System Updates](operational-insights-updates.md)

- [Log Management](operational-insights-log-collection.md)

- [Antimalware](operational-insights-antimalware.md)

- [Change Tracking](operational-insights-change-tracking.md)

- [SQL and Active Directory Assessment](operational-insights-assessment.md)

However, the following intelligence packs are *not* supported with the Microsoft Monitoring Agent

- [Capacity Management](operational-insights-capacity.md)

- [Configuration Assessment](operational-insights-configuration-assessment.md)

IIS log collection is supported on computers with:

- Windows Server 2012

- Windows Server 2012 R2

### To add an intelligence pack


1. On the Overview page in Operational Insights, click the **Intelligence Packs** tile.


2. On the Operational Insights Intelligence Packs Gallery page, you can learn about each available intelligence pack. Click the name of the intelligence pack that you want to add to Operational Insights.


3. On the page for the intelligence pack that you chose, detailed information about the intelligence pack is displayed. Click **Add**.


4. On the Confirmation page, click **Accept** to agree to the privacy statement and terms of use.


5. A new tile for the intelligence pack that you added appears on the Overview page in Operational Insights and you can start using it after the Operational Insights service processes your data.




### To remove an intelligence pack



1. On the Overview page in Operational Insights, click the **Intelligence Packs** tile.


2. On the Operational Insights Intelligence Packs Gallery page, under the intelligence pack that you want to remove, click **Remove**.


3. On the confirmation page, click **Yes** to remove the intelligence pack.


