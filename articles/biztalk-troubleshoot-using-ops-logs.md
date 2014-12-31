<properties urlDisplayName="BizTalk Services: Troubleshoot using operation logs" pageTitle="BizTalk Services: Troubleshoot using ops logs | Azure" metaKeywords="" description="BizTalk Services: Troubleshoot using ops logs" metaCanonical="" services="" documentationCenter="" title="BizTalk Services: Troubleshoot using ops logs" authors="mandia"  solutions="" writer="nitinme" manager="dwrede" editor="cgronlun"  />

<tags ms.service="biztalk-services" ms.workload="integration" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/10/2014" ms.author="mandia" />


# BizTalk Services: Troubleshoot using operation logs

Operation Logs is a Management Services feature available in the Azure Management portal that allows you to view historical logs of operations performed on your Azure services, including BizTalk Service. This enables you to view historical data related to management operations on your BizTalk Service subscription for as far back as 180 days.

> [AZURE.NOTE] This feature only captures logs for management operations on BizTalk Services, such as when the service was started, backed up, etc. Such operations are tracked irrespective of whether they are performed from the Azure Management Portal or by using the [BizTalk Service REST APIs](http://msdn.microsoft.com/en-us/library/windowsazure/dn232347.aspx). For a complete list of operations that are tracked using Management Services, see [>Operations Tracked Using Azure Management Services](#bizops).<br />
This does not capture the logs for activities related to BizTalk Service runtime (such as message processed by bridges, etc.). To view such logs, you must use the Tracking view from the BizTalk Services portal. For more information, see [Tracking Messages](http://msdn.microsoft.com/library/windowsazure/hh949805.aspx).

##<a name="viewlogs"></a>View BizTalk Services Operation Logs
1. From the Azure Management Portal, click Management Services, and then click the Operation Logs tab.
2. You can filter the logs based on various parameters like subscription, date range, service type (e.g. BizTalk Services), service name, or status (of the operation e.g. Succeeded, Failed)
3. Click the checkmark to view the filtered list. The following illustration shows activities related to testbiztalkservice.
	![View operation logs][ViewLogs] 
4. To view more about a specific operation, select the row and click <b>Details</b> from the bottom of the page.


##<a name="bizops"></a>Operations Tracked Using Azure Management Services
The following table lists the operations that are tracked using the Azure Management Services.

<table border="1" cellpadding="5">
<tr>
<td>CreateBizTalkService</td> 
<td align="left">Operation to create a new BizTalk Service</td> 
</tr> 
<tr>
<td>DeleteBizTalkService</td> 
<td align="left">Operation to delete a BizTalk Service</td>  
</tr> 
<tr>
<td>RestartBizTalkService</td> 
<td align="left">Operation to restart a BizTalk Service</td> 
</tr>
<tr>
<td>StartBizTalkService</td> 
<td align="left">Operation to start a BizTalk Service</td> 
</tr>
<tr>
<td>StopBizTalkService</td> 
<td align="left">Operation to stop a BizTalk Service</td> 
</tr>
<tr>
<td>DisableBizTalkService</td> 
<td align="left">Operation to disable a BizTalk Service</td> 
</tr>
<tr>
<td>EnableBizTalkService</td> 
<td align="left">Operation to enable a BizTalk Service</td> 
</tr>
<tr>
<td>BackupBizTalkService</td> 
<td align="left">Operation to back up a BizTalk Service</td> 
</tr>
<tr>
<td>RestoreBizTalkService</td> 
<td align="left">Operation to restore a BizTalk Service from specified backup</td> 
</tr>
<tr>
<td>SuspendBizTalkService</td> 
<td align="left">Operation to suspend a BizTalk Service</td> 
</tr>
<tr>
<td>ResumeBizTalkService</td> 
<td align="left">Operation to resume a BizTalk Service</td> 
</tr>
<tr>
<td>ScaleBizTalkService</td> 
<td align="left">Operation to scale a BizTalk Service up or down</td> 
</tr>
<tr>
<td>ConfigUpdateBizTalkService</td> 
<td align="left">Operation to update the configuration of a BizTalk Service</td> 
</tr>
<tr>
<td>ServiceUpdateBizTalkService</td> 
<td align="left">Operation to upgrade or downgrade a BizTalk Service to a different version</td> 
</tr>
<tr>
<td>PurgeBackupBizTalkService</td> 
<td align="left">Operation to purge backups of the BizTalk Service outside the retention period</td> 
</tr>
</table>


## See Also
- [Backup BizTalk Service](http://go.microsoft.com/fwlink/p/?LinkID=325584)
- [Restore BizTalk Service from Backup](http://go.microsoft.com/fwlink/p/?LinkID=325582)
- [BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)
- [BizTalk Services: Provisioning Using Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)
- [BizTalk Services: Provisioning Status Chart](http://go.microsoft.com/fwlink/p/?LinkID=329870)
- [BizTalk Services: Dashboard, Monitor and Scale tabs](http://go.microsoft.com/fwlink/p/?LinkID=302281)
- [BizTalk Services: Throttling](http://go.microsoft.com/fwlink/p/?LinkID=302282)
- [BizTalk Services: Issuer Name and Issuer Key](http://go.microsoft.com/fwlink/p/?LinkID=303941)
- [How do I Start Using the Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)

[ViewLogs]: ./media/biztalk-troubleshoot-using-ops-logs/Operation-Logs.png
