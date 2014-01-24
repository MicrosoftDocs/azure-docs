<properties linkid="develop-mobile-how-to-guides-register-windows-store-app-server-auth" urlDisplayName="Register your Windows Store app package for Microsoft authentication" pageTitle="Register your Windows Store app package for Microsoft authentication" metaKeywords="" description="Learn how to register your Windows Store app for Microsoft authentication in your Windows Azure Mobile Services application." metaCanonical="" services="" documentationCenter="" title="BizTalk Services: Backup and Restore" authors=""  solutions="" writer="mandia" manager="paulettm" editor="cgronlun"  />



# BizTalk Services: Backup and Restore Test

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

A Backup can be taken at any time and is completely controlled by you. To create a Backup:

<ol>
<li><p>For active messages in a batch, process the batch of messages. This will help prevent message loss <i>if</i> this backup is restored. Messages in batches are never stored when doing a backup.</p>
<p><strong>Caution</strong></p>
<p>If a backup is taken with active messages in a batch, these messages are not backed up and therefore are lost.</p></li>
<li>Suspend the BizTalk Service by issuing a SUSPEND command using the <a HREF="http://msdn.microsoft.com/library/windowsazure/dn232419.aspx">Suspend BizTalk Service</a> command available with the REST API.</li>
<li><p>Optional: In the BizTalk Services Portal, stop any management operations.</p></li>
<li><p>Create the backup to the Storage account using the <a HREF="http://go.microsoft.com/fwlink/p/?LinkID=325584">Backup BizTalk Service</a> commands available with the REST API.</p></li>
</ol>



##<a name="restore"></a>Restore

When a backup is restored, the **exact** same configuration is restored. When the Storage account is entered during the backup, the configuration details are used to restore the same BizTalk Service configuration. 

When restoring a backup, consider the following:

- New tracking, archiving, and monitoring stores can be specified.

- To restore the BizTalk Service using the same name, the BizTalk Service must be deleted. Then do a restore. Otherwise, the restore fails.

- The same EDI Runtime data is restored. The EDI Runtime backup stores the control numbers. The restored control numbers are in sequence from the time of the backup. If messages are processed after the last backup, restoring this backup content can cause duplicate control numbers.

**Known Issue**
<p>During a Restore, you specify the Access Control Namespace and Key, SQL Azure database, and Storage account. If you don't enter these properties, their values are retrieved from the backup content. The values are not validated. If the parameters in the backup content have been removed from the BizTalk Service settings, the Restore does not detect that they have been deleted. As a result, the Restore fails.</p>

User-provided input is validated in the Restore. To validate the parameters, enter the Access Control Namespace and Key, SQL Azure database, and Storage account when doing the Restore.


####To restore a Backup

Restore the backup using the [Restore BizTalk Service from Backup](http://go.microsoft.com/fwlink/p/?LinkID=325582) commands available with the REST API.



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
