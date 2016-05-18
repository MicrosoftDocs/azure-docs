<properties 
	pageTitle="Troubleshoot BizTalk Services using operation logs | Microsoft Azure" 
	description="Troubleshoot BizTalk Services using operation logs. MABS, WABS" 
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
	ms.topic="article" 
	ms.date="05/16/2016" 
	ms.author="mandia"/>


# BizTalk Services: Troubleshoot using operation logs

## What are the Operation Logs
Operation Logs is a Management Services feature available in the Azure classic portal that allows you to view historical logs of operations performed on your Azure services, including BizTalk Services. This enables you to view historical data related to management operations on your BizTalk Service subscription as far back as 180 days.

> [AZURE.NOTE] This feature only captures logs for management operations on BizTalk Services, such as when the service was started, backed up, and so on. Such operations are tracked irrespective of whether they are performed from the Azure classic portal or by using the [BizTalk Service REST APIs](http://msdn.microsoft.com/library/azure/dn232347.aspx). For a complete list of operations that are tracked using Management Services, see [Operations Tracked Using Azure Management Services](#bizops).<br/><br/>
This does not capture the logs for activities related to BizTalk Service runtime (such as message processed by bridges, and so on.). To view these logs, use the Tracking view from the BizTalk Services portal. For more information, see [Tracking Messages](http://msdn.microsoft.com/library/azure/hh949805.aspx).

## View BizTalk Services Operation Logs
1. In the Azure classic portal, select **Management Services**, and then select the **Operation Logs** tab.
2. You can filter the logs based on different parameters like subscription, date range, service type (e.g. BizTalk Services), service name, or status of the operation (Succeeded, Failed).
3. Select the checkmark to view the filtered list. The following image shows activities related to testbiztalkservice:
	![View operation logs][ViewLogs] 
4. To view more about a specific operation, select the row, and click **Details** in the task bar at the bottom.


## <a name="bizops"></a>Operations Tracked Using Azure Management Services
The following table lists the operations that are tracked using the Azure Management Services:

Operation Name | Task
--- | ---
CreateBizTalkService | Operation to create a new BizTalk Service
DeleteBizTalkService | Operation to delete a BizTalk Service
RestartBizTalkService | Operation to restart a BizTalk Service
StartBizTalkService | Operation to start a BizTalk Service
StopBizTalkService | Operation to stop a BizTalk Service
DisableBizTalkService | Operation to disable a BizTalk Service
EnableBizTalkService | Operation to enable a BizTalk Service
BackupBizTalkService | Operation to back up a BizTalk Service
RestoreBizTalkService | Operation to restore a BizTalk Service from specified backup
SuspendBizTalkService | Operation to suspend a BizTalk Service
ResumeBizTalkService | Operation to resume a BizTalk Service
ScaleBizTalkService | Operation to scale a BizTalk Service up or down
ConfigUpdateBizTalkService | Operation to update the configuration of a BizTalk Service
ServiceUpdateBizTalkService | Operation to upgrade or downgrade a BizTalk Service to a different version
PurgeBackupBizTalkService | Operation to purge backups of the BizTalk Service outside the retention period


## See Also
- [Backup BizTalk Service](http://go.microsoft.com/fwlink/p/?LinkID=325584)
- [Restore BizTalk Service from Backup](http://go.microsoft.com/fwlink/p/?LinkID=325582)
- [BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)
- [BizTalk Services: Provisioning Using Azure classic portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)
- [BizTalk Services: Provisioning Status Chart](http://go.microsoft.com/fwlink/p/?LinkID=329870)
- [BizTalk Services: Dashboard, Monitor and Scale tabs](http://go.microsoft.com/fwlink/p/?LinkID=302281)
- [BizTalk Services: Throttling](http://go.microsoft.com/fwlink/p/?LinkID=302282)
- [BizTalk Services: Issuer Name and Issuer Key](http://go.microsoft.com/fwlink/p/?LinkID=303941)
- [How do I Start Using the Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)

[ViewLogs]: ./media/biztalk-troubleshoot-using-ops-logs/Operation-Logs.png
 
