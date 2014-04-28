<properties linkid="biztalk-backup-restore" urlDisplayName="BizTalk Services: Backup and Restore" pageTitle="BizTalk Services: Backup and Restore | Azure" metaKeywords="" description="BizTalk Services includes Backup and Restore capabilities. When creating a Backup, a snapshot of the BizTalk Services configuration is taken." metaCanonical="" services="" documentationCenter="" title="BizTalk Services: Backup and Restore"   solutions="" authors="mandia" manager="paulettm" editor="cgronlun"  />


# BizTalk Services: Backup and restore

Azure BizTalk Services includes Backup and Restore capabilities. When creating a Backup, a snapshot of the Azure BizTalk Services configuration is taken.

Consider the following scenarios:


- You can back up your BizTalk Service configuration in two ways using the Azure Management Portal - creating backups as needed (ad hoc backups) and by running scheduled backups.

- Backup content can be restored to the same BizTalk Service or to a new BizTalk Service. To restore the BizTalk Service using the same name, the existing BizTalk Service must be deleted. Otherwise, the restore fails.

- BizTalk Services can be restored to the same edition or a higher edition. Restoring BizTalk Service to a lower edition, from when the backup was taken, is not supported.

	For example, a backup using the Basic Edition can be restored to the Premium Edition. A backup using the Premium Edition cannot be restored to the Standard Edition.

- The EDI Control numbers are backed up to maintain continuity of the control numbers. If messages are processed after the last backup, restoring this backup content can cause duplicate control numbers.

- Backup and restore is not available as part of the BizTalk Services Developer Edition. 

This topic describes how to backup and restore BizTalk Services using the Azure Management Portal. You can also back up BizTalk Services using REST APIs. For more information on that, see [BizTalk Services REST API](http://msdn.microsoft.com/library/windowsazure/dn232347.aspx). 

[What gets backed up?](#budata)

[Create a backup](#createbu)

[Restore](#restore)


##<a name="budata"></a>What gets backed up?

When a backup is created, the following items are backed up:

<table border="1"> 
<TR bgcolor="FAF9F9">
<th> </th>
<TH>Items backed up</TH> 
</TR> 
<TR>
<td colspan="2">
 <strong>Azure BizTalk Services Portal</strong></td>
</TR> 
<TR>
<TD>Configuration and Runtime</TD> 
<TD><bl>
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
</bl></TD>
</TR> 
 
<TR>
<td colspan="2">
 <strong>Azure BizTalk Service</strong></td>
</TR> 
<TR>
<TD>SSL Certificate</TD> 
<TD>
<bl>
<li>SSL Certificate Data</li>
<li>SSL Certificate Password</li>
</bl>
</TD>
</TR> 
<TR>
<TD>BizTalk Service Settings</TD> 
<TD>
<bl>
<li>Scale unit count</li>
<li>Edition</li>
<li>Product Version</li>
<li>Region/Datacenter</li>
<li>Access Control Service (ACS) namespace and key</li>
<li>Tracking database connection string</li>
<li>Archiving Storage account connection string</li>
<li>Monitoring storage account connection string</li>
</bl></TD>
</TR> 
<TR>
<td colspan="2">
 <strong>Additional Items</strong></td>
</TR> 
<TR>
<TD>Tracking Database</TD> 
<TD>When the BizTalk Service is provisioned, the Tracking Database details are entered, including the Azure SQL Database Server and the Tracking Database name. The Tracking Database is not automatically backed up.<br/><br/>
<strong>Important</strong><br/>
If the Tracking Database is accidentally deleted and the database needs recovered, a previous backup must exist. If a backup does not exist, the Tracking Database and its data are not recoverable. In this situation, create a new Tracking Database with the same database name. Geo-Replication is recommended.</TD>
</TR> 
</table>

##<a name="createbu"></a>Create a backup

A backup can be taken at any time and is completely controlled by you. You can take backups either from the Azure Management Portal or from the BizTalk Service REST API. To create a backup using the BizTalk Services REST API, see <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=325584">Backup BizTalk Service</a>

This section provides instructions on how to take backups using the Management Portal. You can use the Management Portal to create ad hoc backups or schedule backups at desired intervals.

##<a name="beforebackup"></a>Before creating a backup

Make sure you adhere to the following considerations before you create a backup:

1. Before running an ad hoc backup, for active messages in a batch, process the batch of messages. This will help prevent message loss <i>if</i> this backup is restored. Messages in batches are never stored when doing a backup. With scheduled backups, you might not be able to ensure that there are no messages in the batch when the back up starts.
	<div class="dev-callout"><b>Note</b>
<p>If a backup is taken with active messages in a batch, these messages are not backed up and are therefore lost.</p></div>
2. Optional: In the BizTalk Services Portal, stop any management operations.
4. Create the backup to the Storage account using the <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=325584">Backup BizTalk Service</a> commands available with the REST API.

[Ad hoc backups](#backupnow)

[Schedule a backup](#backupschedule)

###<a name="backupnow"></a>Ad hoc backups
1. From the Azure Management Portal, click BizTalk Services, and then click the BizTalk Service name you want to back up.
2. From the BizTalk Service <b>Dashboard</b> tab, click <b>Back up</b> from the bottom of the page.
3. In the <b>Back up BizTalk Service</b> dialog box, provide a backup name.
4. Select a blob storage account and click the checkmark to start the backup.


Once the backup completes, a container with the backup name you specified is created under the storage account. This container contains your BizTalk Service backup configuration.


###<a name="backupschedule"></a>Schedule a backup

1. From the Azure Management Portal, click BizTalk Services, click the BizTalk Service name for which you want to schedule automated backups, and then click the **Configure** tab.
2. For **Backup Status**, select **None** if you do not want to schedule automated backups. To schedule automated backups, click **Automatic**.
3. For **Storage Account**, select an Azure storage account where the backups will be created.
4. For **Frequency**, specify the start date and time for the first backup, and the interval (in days) when a backup is taken.
5. For **Retention Days**, specify a time window (in days) for which the backups are retained. The retention period must be greater than the backup frequency.
6. Select the **Always keep at least one backup** checkbox to make sure there's at least one backup available even if it is past the retention days period.
7. Click **Save**.

When a scheduled backup job runs, it creates a container (to store backup data) in the storage account you specified. The name of the container is in the format *BizTalk Service name-date-time*. 

If a backup fails, the BizTalk Service dashboard page shows the status of the backup as **Failed**.

![Last scheduled backup status][BackupStatus] 

You can click the link to go the Management Services Operation Logs page to find out more about the fault. For more information about operation logs with respect to BizTalk Services, see [BizTalk Services: Troubleshoot using operation logs](http://go.microsoft.com/fwlink/?LinkId=391211).

##<a name="restore"></a>Restore

You can restore backups either from the Azure Management Portal or from the BizTalk Services REST API. This section provides instructions on how to restore using the Management Portal. To restore using the REST API, see [Restore BizTalk Service from Backup](http://go.microsoft.com/fwlink/p/?LinkID=325582).

###Before restoring a backup

When restoring a backup, consider the following:

- New tracking, archiving, and monitoring stores can be specified while restoring a BizTalk Service.

- To restore the BizTalk Service using the same name, delete the existing BizTalk Service before you start with the restore. Otherwise, the restore fails.

- The same EDI Runtime data is restored. The EDI Runtime backup stores the control numbers. The restored control numbers are in sequence from the time of the backup. If messages are processed after the last backup, restoring this backup content can cause duplicate control numbers.

####To restore a backup

1. From the Azure Management Portal, click <b>New</b>, point to <b>App Services</b>, <b>BizTalk Service</b>, and then click <b>Restore</b>.

	![Restore a backup][Restore]

2. In the New BizTalk Service - Restore wizard, on the <b>Restore BizTalk Service</b> page, click the folder icon from the <b>Backup URL</b> text box to open the <b>Browse Cloud Storage</b> dialog box. The dialog box lists your Azure storage accounts.

	Expand the storage account you specified while creating or scheduling the backup, and then select the container name from where you need to restore the BizTalk Service configuration.

	From the right pane, select the .txt file corresponding to the back up you are restoring from, and then click <b>Open</b>.

3. On the <b>Restore BizTalk Service</b> page, provide the following information:
- Provide a BizTalk Service name. By default, the name of the backed up BizTalk Service is used.
- Verify the domain URL, edition, and the region for the restored BizTalk Service.
- Chose to create a new SQL database instance for the tracking database, and then click the right arrow.

4. 	In the <b>Specify database settings</b> page, verify the name of the SQL database, specify the physical server where the SQL database will be created, and a username/password for that server.

	If you want to configure advanced settings for the SQL database, select the <b>Configure Advanced Database Settings</b> check box, and then click the right arrow.

	If you do not want to configure advanced database settings, click the right arrow, and then skip to step 6 below.
5. In the <b>Advanced database settings</b> page, select the database edition you want to use (<b>Web</b> or <b>Business</b>), specify the maximum database size, and the collation rules. Click the right arrow.

6. In the <b>Specify monitoring/archiving settings</b> page create a new storage account or specify an existing storage account where BizTalk Service monitoring information will be stored.

7. Click the checkmark to start the restoration process</b>.

8. Once the restoration successfully completes, a new BizTalk Service is listed in a suspended state on the BizTalk Services page in the Azure Management Portal.

###<a name="postrestore"></a>After restoring a backup

BizTalk Service is always restored in a **Suspended** state. This enables you to make any configuration changes in your applications, as required, in your BizTalk Service applications before the new environment is functional. Following are some such considerations that you must make before starting the newly restored BizTalk Service:

- If you created BizTalk Service applications using the Azure BizTalk Services SDK, you might need to to update the ACS credentials in those applications to work with the restored environment.

- You might restore a BizTalk Service to replicate an already functional BizTalk Service environment. In such a scenario, if you have agreements configured in the original BizTalk Services portal that use FTP shares as sources, you might want to update the agreements in the newly restored environment to use some other sources or FTP shares. If you fail to do so, you might have two different agreements trying to pull the same message.

- If you used the restore operation to have multiple BizTalk Service environments, make sure you target the right environment using Visual Studio applications, PowerShell cmdlets, REST APIs, or Trading Partner Management OM APIs.

- It's also a good practice to configure automated backups on the newly restored BizTalk Service environment.

Once you have met these or other such considerations, go to the BizTalk Service page on Azure Management Portal, select the newly restored BizTalk Service in suspended state, and then click **Resume** from the bottom of the page to start the service.

## Next

To provision Azure BizTalk Services in the Azure Management Portal, go to [BizTalk Services: Provisioning Using Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280). To start creating applications, go to [Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=235197).

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

[BackupStatus]: ./media/biztalk-backup-restore/status-last-backup.png
[Restore]: ./media/biztalk-backup-restore/restore-ui.png
