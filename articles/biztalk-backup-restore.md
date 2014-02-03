<properties linkid="develop-mobile-how-to-guides-register-windows-store-app-server-auth" urlDisplayName="Register your Windows Store app package for Microsoft authentication" pageTitle="Register your Windows Store app package for Microsoft authentication" metaKeywords="" description="Learn how to register your Windows Store app for Microsoft authentication in your Windows Azure Mobile Services application." metaCanonical="" services="" documentationCenter="" title="BizTalk Services: Backup and Restore" authors=""  solutions="" writer="mandia" manager="paulettm" editor="cgronlun"  />



# BizTalk Services: Backup and Restore

Windows Azure BizTalk Services includes Backup and Restore capabilities. When creating a Backup, a snapshot of the Windows Azure BizTalk Services configuration is taken.

Consider the following scenarios:

- Backup content can be restored to the same BizTalk Service or to a new BizTalk Service. To restore the BizTalk Service using the same name, the BizTalk Service must be deleted. Then do a restore. Otherwise, the restore fails.

- Backup content can be restored to the same BizTalk Service version. For example, if a backup is taken of version 1.0 of the BizTalk Service, it can only be restored to version 1.0. Otherwise, the restore fails.

- Backup content can be restored to the same edition or a higher edition. Backup content cannot be restored to a lower edition. <br/><br/>
For example, a backup using the Basic Edition can be restored to the Premium Edition. A backup using the Premium Edition cannot be restored to the Standard Edition.

- A Backup can be taken at any time and is completely controlled by you. There is no SQL Agent job or any other method that automatically creates backup content. 

- The EDI Control numbers are backed up to maintain continuity of the control numbers. If messages are processed after the last backup, restoring this backup content can cause duplicate control numbers.

- Backup and Restore is not available for the Developer Edition. 


This topic describes the Backup and Restore functionality, including:

[Prerequisites](#prereq)

[Backed up Data](#budata)

[Create a Backup](#createbu)

[Restore](#restore)

##<a name="prereq"></a>Prerequisites

To backup Windows Azure BizTalk Services, the following prerequisites are required:

<table border="1">
<TR>
<TD>Windows Azure Subscription</TD> 
<TD>The subscription ID is listed in the Dashboard tab of the BizTalk Service. The Dashboard tab is available by clicking the BizTalk Service in the <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=213885">Windows Azure Management Portal</a>.</TD> 
</TR> 
<TR>
<TD>BizTalk Service Name</TD> 
<TD>Enter the BizTalk Service name. The BizTalk Service name is available in the <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=213885">Windows Azure Management Portal</a> under <strong>BizTalk Services</strong>.</TD> 
</TR> 
<TR>
<TD>Windows Azure Storage Account and access key</TD> 
<TD>Specify an existing Windows Azure Storage account with its Primary Access Key to store the backup content. This Storage account can be in any Region, including a different region than the Windows Azure SQL Database and the BizTalk Service. The Storage account and Primary Access Key are available in the <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=213885">Windows Azure Management Portal</a> under <strong>Storage</strong>.</TD>
</TR>
</table>


##<a name="budata"></a>Backed up Data

When a Backup is created, the following items are backed up:

<table border="1"> 
<TR bgcolor="FAF9F9">
<th> </th>
<TH>Items backed up</TH> 
</TR> 
<TR>
<td colspan="2">
 <strong>Windows Azure BizTalk Services Portal</strong></td>
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
 <strong>Windows Azure BizTalk Service</strong></td>
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
<TD>When the BizTalk Service is provisioned, the Tracking Database details are entered, including the Windows Azure SQL Database Server and the Tracking Database name. The Tracking Database is not automatically backed up.<br/><br/>
<strong>Important</strong><br/>
If the Tracking Database is accidentally deleted and the database needs recovered, a previous backup must exist. If a backup does not exist, the Tracking Database and its data are not recoverable. In this situation, create a new Tracking Database with the same database name. Geo-Replication is recommended.</TD>
</TR> 
</table>




##<a name="createbu"></a>Create a Backup

A backup can be taken at any time and is completely controlled by you. You can take backups either from the Windows Azure Management Portal or from the BizTalk Service REST API. This section provides instructions on how to take backups using the Management Portal. To create a backup using the BizTalk Services REST API, see <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=325584">Backup BizTalk Service</a>.

You can use the Management Portal to create ad hoc backups or schedule backups at desired intervals.

[Ad hoc Backups](#backupnow)

[Schedule a Backup](#backupschedule)

###Before Creating a Backup

Make sure you adhere to the following considerations before you create a backup:

<ol>
<li><p>For active messages in a batch, process the batch of messages. This will help prevent message loss <i>if</i> this backup is restored. Messages in batches are never stored when doing a backup.</p>
<div class="dev-callout"><b>Note</b>
<p>If a backup is taken with active messages in a batch, these messages are not backed up and are therefore lost.</p></div></li>
<li>Suspend the BizTalk Service by issuing a SUSPEND command using the <a HREF="http://msdn.microsoft.com/library/windowsazure/dn232419.aspx">Suspend BizTalk Service</a> command available with the REST API.</li>
<li><p>Optional: In the BizTalk Services Portal, stop any management operations.</p></li>
<li><p>Create the backup to the Storage account using the <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=325584">Backup BizTalk Service</a> commands available with the REST API.</p></li>
</ol>

###<a name="backupnow"></a>Ad hoc Backups
<ol>
<li><p>From the Windows Azure Management Portal, click BizTalk Services, and then click the BizTalk Service name you want to back up.</p></li>
<li><p>From the BizTalk Service <b>Dashboard</b> tab, click <b>Backup</b> from the bottom of the page.</p></li>
<li><p>In the <b>Backup BizTalk Service</b> dialog box, provide a backup name.</p></li>
<li><p>Select a blob storage account and click the checkmark to start the backup.</p>
<p>Once the backup completes, a container with the backup name you specified is created under the storage account. This container contains your BizTalk Service backup configuration.
</li>
</ol>

###<a name="backupschedule"></a>Schedule a Backup 

<ol>
<li><p>From the Windows Azure Management Portal, click BizTalk Services, click the BizTalk Service name for which you want to schedule automated backups, and then click the <b>Configure</b> tab.</p></li>
<li><p>For <b>Backup Status</b>, select <b>None</b> if you do not want to schedule automated backups. To schedule automated backups, click <b>Automatic</b>.</p></li>
<li><p>For <b>Storage Account</b>, select an Azure storage account where the backups will be created.</p></li>
<li><p>For <b>Frequency</b>, specify the start date and time for the first backup, and the interval (in days) when a backup is taken.</p></li>
<li><p>For <b>Retention Days</b>, specify a time window (in days) for which the backups are retained. The retention period must be greater than the backup frequency.</p></li>
<li><p>Select the <b>Always keep at least one backup</b> checkbox to make sure there's at least one backup available even if it is past the retention days period.</p></li>
<li><p>Click <b>Save</b>.</p></li>
</ol>
When a scheduled backup job runs, it creates a container (to store backup data) in the storage account you specified. The name of the container is in the format *BizTalk Service name-date-time*. 

If a backup fails, the BizTalk Service dashboard page shows the status of the backup as **Failed**.

![Last scheduled backup status][BackupStatus] 

You can click the link to go the Management Services Operation Logs page to find out more about the fault. For more information about operation logs with respect to BizTalk Services, see [BizTalk Services: Troubleshoot using operation logs](http://go.microsoft.com/fwlink/?LinkId=391211).

##<a name="restore"></a>Restore

When a backup is restored, the **exact** same configuration is restored. When the Storage account is entered during the backup, the configuration details are used to restore the same BizTalk Service configuration. You can restore backups either from the Windows Azure Management Portal or from the BizTalk Services REST API. This section provides instructions on how to restore using the Management Portal. To restore using the REST API, see [Restore BizTalk Service from Backup](http://go.microsoft.com/fwlink/p/?LinkID=325582).

###Before Restoring a Backup

When restoring a backup, consider the following:

- New tracking, archiving, and monitoring stores can be specified.

- To restore the BizTalk Service using the same name, delete the existing BizTalk Service before you start with the restore. Otherwise, the restore fails.

- The same EDI Runtime data is restored. The EDI Runtime backup stores the control numbers. The restored control numbers are in sequence from the time of the backup. If messages are processed after the last backup, restoring this backup content can cause duplicate control numbers.

####To restore a Backup

1. From the Windows Azure Management Portal, click <b>New</b>, point to <b>App Services</b>, <b>BizTalk Service</b>, and then click <b>Restore</b>.

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

8. Once the restoration successfully completes, a new BizTalk Service is listed in a suspended state on the BizTalk Services page in the Windows Azure Management Portal.

	Select the new service and click <b>Resume</b> from the bottom of the page to start the service.





## Next

To provision Windows Azure BizTalk Services in the Windows Azure Management Portal, go to [BizTalk Services: Provisioning Using Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280). To start creating applications, go to [Windows Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=235197).

## See Also
- [Backup BizTalk Service](http://go.microsoft.com/fwlink/p/?LinkID=325584)<br/>
- [Restore BizTalk Service from Backup](http://go.microsoft.com/fwlink/p/?LinkID=325582)<br/>
- [BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)<br/>
- [BizTalk Services: Provisioning Using Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)<br/>
- [BizTalk Services: Provisioning Status Chart](http://go.microsoft.com/fwlink/p/?LinkID=329870)<br/>
- [BizTalk Services: Dashboard, Monitor and Scale tabs](http://go.microsoft.com/fwlink/p/?LinkID=302281)<br/>
- [BizTalk Services: Throttling](http://go.microsoft.com/fwlink/p/?LinkID=302282)<br/>
- [BizTalk Services: Issuer Name and Issuer Key](http://go.microsoft.com/fwlink/p/?LinkID=303941)<br/>
- [How do I Start Using the Windows Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)<br/>

[BackupStatus]: ./media/biztalk-backup-restore/Last-Backup-Status.png
[Restore]: ./media/biztalk-backup-restore/Restore.png