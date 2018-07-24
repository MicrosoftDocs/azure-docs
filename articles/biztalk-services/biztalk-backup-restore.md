---
title: Create and restore a backup in BizTalk Services | Microsoft Docs
description: BizTalk Services includes Backup and Restore. Learn how to create and restore a backup and determine what gets backed up. MABS, WABS
services: biztalk-services
documentationcenter: ''
author: MandiOhlinger
manager: anneta
editor: ''

ms.assetid: 59f91173-4683-48df-abd5-41262bfce6df
ms.service: biztalk-services
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/07/2016
ms.author: mandia

---
# BizTalk Services: Backup and Restore

> [!INCLUDE [BizTalk Services is being retired, and replaced with Azure Logic Apps](../../includes/biztalk-services-retirement.md)]

Azure BizTalk Services includes Backup and Restore capabilities. 

> [!INCLUDE [Use APIs to manage MABS](../../includes/biztalk-services-retirement-azure-classic-portal.md)]

> [!NOTE]
> Hybrid Connections are NOT backed up, regardless of the Edition. You must recreate your hybrid connections.


## Before you Begin
* Backup and Restore may not be available for all editions. See [BizTalk Services: Editions Chart](biztalk-editions-feature-chart.md).
* Backup content can be restored to the same BizTalk Service or to a new BizTalk Service. To restore the BizTalk Service using the same name, the existing BizTalk Service must be deleted and the name must be available. After you delete a BizTalk Service, it can take longer time than wanted for the same name to be available. If you cannot wait for the same name to be available, then restore to a new BizTalk Service.
* BizTalk Services can be restored to the same edition or a higher edition. Restoring BizTalk Services to a lower edition, from when the backup was taken, is not supported.
  
    For example, a backup using the Basic Edition can be restored to the Premium Edition. A backup using the Premium Edition cannot be restored to the Standard Edition.
* The EDI Control numbers are backed up to maintain continuity of the control numbers. If messages are processed after the last backup, restoring this backup content can cause duplicate control numbers.
* If a batch has active messages, process the batch **before** running a backup. When creating a backup (as needed or scheduled), messages in batches are never stored. 
  
    **If a backup is taken with active messages in a batch, these messages are not backed up and are therefore lost.**
* Optional: In the BizTalk Services Portal, stop any management operations.

## Create a backup
A backup can be taken at any time and is completely controlled by you. To create a backup, use the [REST API for Managing BizTalk Services on Azure](https://msdn.microsoft.com/library/azure/dn232347.aspx).

## Restore
To restore a backup, use the [REST API for Managing BizTalk Services on Azure](https://msdn.microsoft.com/library/azure/dn232347.aspx).

### <a name="postrestore"></a>After restoring a backup
The BizTalk Service is always restored in a **Suspended** state. In this state, you can make any configuration changes before the new environment is functional, including:

* If you created BizTalk Service applications using the Azure BizTalk Services SDK, you may need to update the Access Control (ACS) credentials in those applications to work with the restored environment.
* You restore a BizTalk Service to replicate an existing BizTalk Service environment. In this situation, if there are agreements configured in the original BizTalk Services portal that use a source FTP folder, you may need to update the agreements in the newly restored environment to use a different source FTP folder. Otherwise, there may be two different agreements trying to pull the same message.
* If you restored to have multiple BizTalk Service environments, make sure you target the correct environment in the Visual Studio applications, PowerShell cmdlets, REST APIs, or Trading Partner Management OM APIs.
* It's a good practice to configure automated backups on the newly restored BizTalk Service environment.

## What gets backed up
When a backup is created, the following items are backed up:

<table border="1"> 
<tr bgcolor="FAF9F9">
<th> </th>
<TH>Items backed up</TH> 
</tr> 
<tr>
<td colspan="2">
 <strong>Azure BizTalk Services Portal</strong></td>
</tr> 
<tr>
<td>Configuration and Runtime</td> 
<td>
<ul>
<li>Partner and profile details</li>
<li>Partner Agreements</li>
<li>Custom assemblies deployed</li>
<li>Bridges deployed</li>
<li>Certificates</li>
<li>Transforms deployed</li>
<li>Pipelines</li>
<li>Templates created and saved in the BizTalk Services Portal</li>
<li>X12 ST01 and GS01 mappings</li>
<li>Control numbers (EDI)</li>
<li>AS2 Message MIC values</li>
</ul>
</td>
</tr> 

<tr>
<td colspan="2">
 <strong>Azure BizTalk Service</strong></td>
</tr> 
<tr>
<td>SSL Certificate</td> 
<td>
<ul>
<li>SSL Certificate Data</li>
<li>SSL Certificate Password</li>
</ul>
</td>
</tr> 
<tr>
<td>BizTalk Service Settings</td> 
<td>
<ul>
<li>Scale unit count</li>
<li>Edition</li>
<li>Product Version</li>
<li>Region/Datacenter</li>
<li>Access Control Service (ACS) namespace and key</li>
<li>Tracking database connection string</li>
<li>Archiving Storage account connection string</li>
<li>Monitoring storage account connection string</li>
</ul>
</td>
</tr> 
<tr>
<td colspan="2">
 <strong>Additional Items</strong></td>
</tr> 
<tr>
<td>Tracking Database</td> 
<td>When the BizTalk Service is created, the Tracking Database details are entered, including the Azure SQL Database Server and the Tracking Database name. The Tracking Database is not automatically backed up.
<br/><br/>
<strong>Important</strong><br/>
If the Tracking Database is deleted and the database needs recovered, a previous backup must exist. If a backup does not exist, the Tracking Database and its data are not recoverable. In this situation, create a new Tracking Database with the same database name. Geo-Replication is recommended.</td>
</tr> 
</table>

## Next
To create Azure BizTalk Services, go to [BizTalk Services: Provisioning](http://go.microsoft.com/fwlink/p/?LinkID=302280). To start creating applications, go to [Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=235197).

## See Also
* [Backup BizTalk Service](http://go.microsoft.com/fwlink/p/?LinkID=325584)
* [Restore BizTalk Service from Backup](http://go.microsoft.com/fwlink/p/?LinkID=325582)
* [BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)
* [BizTalk Services: Provisioning](http://go.microsoft.com/fwlink/p/?LinkID=302280)
* [BizTalk Services: Provisioning Status Chart](http://go.microsoft.com/fwlink/p/?LinkID=329870)
* [BizTalk Services: Dashboard, Monitor and Scale tabs](http://go.microsoft.com/fwlink/p/?LinkID=302281)
* [BizTalk Services: Throttling](http://go.microsoft.com/fwlink/p/?LinkID=302282)
* [BizTalk Services: Issuer Name and Issuer Key](http://go.microsoft.com/fwlink/p/?LinkID=303941)
* [How do I Start Using the Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)

[BackupStatus]: ./media/biztalk-backup-restore/status-last-backup.png
[Restore]: ./media/biztalk-backup-restore/restore-ui.png
[AutomaticBU]: ./media/biztalk-backup-restore/AutomaticBU.png
[RestoreBizTalkService]: ./media/biztalk-backup-restore/RestoreBizTalkServiceWindow.png

