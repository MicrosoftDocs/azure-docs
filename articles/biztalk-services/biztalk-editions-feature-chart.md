<properties
	pageTitle="Learn about features in BizTalk Services editions | Microsoft Azure"
	description="Compare the capabilities of the BizTalk Services editions: Free, Developer, Basic, Standard, and Premium. MABS, WABS."
	services="biztalk-services"
	documentationCenter=""
	authors="MandiOhlinger"
	manager="erikre"
	editor=""/>

<tags
	ms.service="biztalk-services"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="05/16/2016"
	ms.author="mandia"/>


# BizTalk Services: Editions chart

Azure BizTalk Services offers several editions. Use this article to determine which edition is right for your scenario and business needs.


## Compare the editions

**Free (Preview)**

Can create and manage Hybrid Connections. A Hybrid Connection is an easy way to connect an Azure website to an on-premises system, like SQL Server.

**Developer**

Includes Hybrid Connections, EAI and EDI message processing with an easy-to-use trading partner management portal, and support for common EDI schemas and rich EDI processing over X12 and AS2. Can create common EAI scenarios connecting services in the cloud with any HTTP/S, REST, FTP, WCF and SFTP protocols to read and write messages.  Utilize connectivity to on-premises LOB systems with ready-to-use SAP, Oracle eBusiness, Oracle DB, Siebel, and SQL Server adapters. Use a developer centric environment with Visual Studio tools for easy development and deployment. Limited to development and test purposes only with no Service Level Agreement (SLA).

**Basic**

Includes most of the Developer capabilities with increases in Hybrid Connections, EAI bridges, EDI Agreements, and BizTalk Adapter Pack connections. Also offers high availability, and the option to scale with a Service Level Agreement (SLA).

**Standard**

Includes all the Basic capabilities with increases in Hybrid Connections, EAI bridges, EDI Agreements, and BizTalk Adapter Pack connections. Also offers high availability, and the option to scale with a Service Level Agreement (SLA).

**Premium**

Includes all the Standard capabilities with increases in Hybrid Connections, EAI bridges, EDI Agreements, and BizTalk Adapter Pack connections. Also includes archiving, high availability, and the option to scale with a Service Level Agreement (SLA).


## Editions chart
The following table lists the differences.

<table border="1">
<tr bgcolor="FAF9F9">
        <th></th>
        <th>Free (Preview)</th>
        <th>Developer</th>
        <th>Basic</th>
        <th>Standard</th>
        <th>Premium</th>
</tr>

<tr>
<td><strong>Starting price</strong></td>
<td colspan="5"><a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Azure BizTalk Services Pricing</a> <br/><br/> <a HREF="http://azure.microsoft.com/pricing/calculator/?scenario=full"> Azure Pricing Calculator</a></td>
</tr>
<tr>
<td><strong>Default minimum configuration</strong></td>
<td>1 Free Unit</td>
<td>1 Developer Unit</td>
<td>1 Basic Unit</td>
<td>1 Standard Unit</td>
<td>1 Premium Unit</td>
</tr>
<tr>
<td><strong>Scale</strong></td>
<td>No Scale</td>
<td>No Scale</td>
<td>Yes, in increments of 1 Basic unit</td>
<td>Yes, in increments of 1 Standard unit</td>
<td>Yes, in increments of 1 Premium unit</td>
</tr>
<tr>
<td><strong>Maximum allowed scale out</strong></td>
<td>No Scale</td>
<td>No Scale</td>
<td>Up to 8 Units</td>
<td>Up to 8 Units</td>
<td>Up to 8 Units</td>
</tr>
<tr>
<td><strong>EAI Bridges per unit</strong></td>
<td>Not included</td>
<td>25</td>
<td>25</td>
<td>125</td>
<td>500</td>
</tr>
<tr>
<td><strong>EDI, AS2</strong>
<br/><br/>
Includes TPM agreements</td>
<td>Not included</td>
<td>Included. 10 agreements per unit.</td>
<td>Included. 50 agreements per unit.</td>
<td>Included. 250 agreements per unit.</td>
<td>Included. 1000 agreements per unit.</td>
</tr>
<tr>
<td><strong>Hybrid Connections per unit</strong></td>
<td>5</td>
<td>5</td>
<td>10</td>
<td>50</td>
<td>100</td>
</tr>
<tr>
<td><strong>Hybrid Connection Data Transfer (GB) per Unit</strong></td>
<td>5</td>
<td>5</td>
<td>50</td>
<td>250</td>
<td>500</td>
</tr>
<tr>
<td><strong>BizTalk Adapter Service connections to on-premises LOB systems</strong></td>
<td>Not included</td>
<td>1 connection</td>
<td>2 connections</td>
<td>5 connections</td>
<td>25 connections</td>
</tr>
<tr>
<td align="left"><strong>Supported protocols/Systems:</strong>
<ul>
<li>HTTP</li>
<li>HTTPS</li>
<li>FTP</li>
<li>SFTP</li>
<li>WCF</li>
<li>Service Bus (SB)</li>
<li>Azure Blob</li>
<li>REST APIs</li>
</ul>
</td>
<td>Not included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
<tr>
<td><strong>High availability</strong>
<br/><br/>
For Service Level Agreement (SLA), see <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=304011"> Azure BizTalk Services Pricing</a>.
</td>
<td>Not included</td>
<td>Not included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
<tr>
<td><strong>Backup and restore</strong></td>
<td>Not included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
<tr>
<td><strong>Tracking</strong></td>
<td>Not included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
<tr>
<td><strong>Archiving</strong><br/><br/>
Includes Non-repudiation of Receipt (NRR) and downloading tracked messages</td>
<td>Not included</td>
<td>Included</td>
<td>Not Included</td>
<td>Not Included</td>
<td>Included</td>
</tr>
<tr>
<td><strong>Use of custom code</strong></td>
<td>Not included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
<tr>
<td><strong>Use of transforms, including custom XSLT</strong></td>
<td>Not included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
<td>Included</td>
</tr>
</table>

> [AZURE.NOTE] For resiliency against hardware failures, High Availability implies having multiple VMs within a single BizTalk Unit.


## FAQs

#### What is a BizTalk unit?
A "unit" is the atomic level of an Azure BizTalk Services deployment. Each edition comes with a unit that has different compute capacity and memory. For example, a Basic unit has more compute than Developer, Standard has more compute than Basic, and so on. When you scale a BizTalk Service, you scale in terms of units.

#### What is the difference between BizTalk Services and Azure BizTalk VM?
BizTalk Services provides a true Platform-as-a-Service (PaaS) architecture for building integration solutions in the cloud. With the PaaS model, you focus completely on the application logic and leave all of the infrastructure management to Microsoft, including:

- No need to manage or patch virtual machines.
- Microsoft ensures availability.
- You control scale on-demand by simply requesting more or less capacity through the Azure portal.

BizTalk Server on Azure Virtual Machines provides an Infrastructure-as-a-Service (IaaS) architecture. You  create virtual machines and configure them exactly like your on-premises environment, making it easier to run existing applications in the cloud with no code changes. With IaaS, you are still responsible for configuring the virtual machines,  managing the virtual machines (for example, installing software and OS patches), and architecting the application for high availability.

If you are looking at building new integration solutions that minimize your infrastructure management effort, use BizTalk Services. If you are looking to quickly migrate your existing BizTalk solutions or looking for an on-demand environment to develop and test BizTalk Server applications, use BizTalk Server on an Azure Virtual Machine.

#### What is the difference between BizTalk Adapter Service and Hybrid Connections?
The BizTalk Adapter Service is used by an Azure BizTalk Service. The BizTalk Adapter Service uses the BizTalk Adapter Pack to connect to an on-premises Line of Business (LOB) system. A Hybrid Connection provides an easy and convenient way to connect Azure applications, like the Web Apps feature in Azure App Service and Azure Mobile Services, to an on-premises resource.

#### What does "Hybrid Connection Data Transfer (GB) per unit" mean? Is this per minute/hour/day/week/month? What happens when the limit is reached?

The Hybrid Connection cost per unit depends on the BizTalk Services edition. Simply put, costs  depend on how much data you transfer. For example, transferring 10 GB data daily costs less than transferring 100 GB daily. Use the [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/?scenario=full) for BizTalk Services to determine specific costs. Typically, the limits are enforced daily. If you exceed the limit, any overage is charged at the rate of $1 per GB.

#### When I create an agreement in BizTalk Services, why does the number of bridges go up by two instead of just one?

Each agreement comprises of two different bridges: a send side communication bridge and a receive side communication bridge.

####  What happens when I hit the quota limit on the number of bridges or agreements?

You are not able to deploy any new bridges or create any new agreements. To deploy more, you  need to scale up to more units of the BizTalk service, or upgrade to a higher edition.

#### How do I migrate from one tier of BizTalk Services to another?

The Free edition cannot be migrated or 'scaled up' to another tier, and cannot be backed up and restored to another tier. If you need another tier, create a new BizTalk Service using the new tier. Any artifacts created using the Free edition, including hybrid connections, need to be recreated in the new BizTalk Service. 

For the remaining editions, use the backup and restore for migrating your artifacts from one tier to another. For example, backup your artifacts in the Standard tier, and then restore them to the Premium tier. [BizTalk Services: Backup and Restore](biztalk-backup-restore.md) describes the supported migration paths and lists what artifacts are backed up. Note that Hybrid Connections are not backed up. After backing up and restoring to a new tier, you then recreate the hybrid connections.  


#### Is the BizTalk Adapter Service included in the service? How do I receive the software?

Yes, the BizTalk Adapter Service with the BizTalk Adapter Pack are included with the Azure BizTalk Services SDK [download](http://www.microsoft.com/download/details.aspx?id=39087).

## Next steps

To create Azure BizTalk Services in the Azure portal, go to [BizTalk Services: Provisioning using the Azure portal](biztalk-provision-services.md). To start creating applications, go to [Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=235197).

## Additional resources
- [BizTalk Services: Provisioning using the Azure portal](biztalk-provision-services.md)<br/>
- [BizTalk Services: Provisioning Status Chart](biztalk-service-state-chart.md)<br/>
- [BizTalk Services: Dashboard, Monitor and Scale tabs](biztalk-dashboard-monitor-scale-tabs.md)<br/>
- [BizTalk Services: Backup and restore](biztalk-backup-restore.md)<br/>
- [BizTalk Services: Throttling](biztalk-throttling-thresholds.md)<br/>
- [BizTalk Services: Issuer Name and Issuer Key](biztalk-issuer-name-issuer-key.md)<br/>
- [How do I Start Using the Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)<br/>
