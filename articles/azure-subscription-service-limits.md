<properties linkid="azure-subscription-service-limits" urlDisplayName="Azure Subscription and Service Limits, Quotas, and Constraints" pageTitle="Microsoft Azure Subscription and Service Limits, Quotas, and Constraints" metaKeywords="Cloud Services, Virtual Machines, Web Sites, Virtual Network, SQL Database, Subscription, Storage" description="Provides a list of common Azure subscription and service limits along with maximum values." metaCanonical="" services="web-sites,virtual-machines,cloud-services" documentationCenter="" title="" authors="jroth" solutions="" manager="paulettm" editor="mollybos" />

# Azure Subscription and Service Limits, Quotas, and Constraints

The following document specifies some of the most common Microsoft Azure limits. Note that this document does not currently cover all Azure services. Over time, these limits will be expanded and updated to cover more of the platform.

- [Subscription Limits](#subscription)
- [Web Worker Limits](#webworkerlimits)
- [Virtual Machine Limits](#vmlimits)
- [Networking Limits](#networkinglimits)
- [Storage Limits](#storagelimits)
- [SQL Database Limits](#sqldblimits)

> [WACOM.NOTE] If you want to raise the limit above the **Default Limit**, open an incident with [customer support][customersupport]. The limits cannot be raised above the **Maximum Limit** value in the tables below. If there is no **Maximum Limit** column, then the specified resource does not have adjustable limits.

##<a name="subscription"></a>Subscription Limits

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Resource</th>
   <th align="left" valign="middle">Default Limit</th>
   <th align="left" valign="middle">Maximum Limit</th>
</tr>
<tr>
   <td valign="middle"><p>Cores per <a href="http://msdn.microsoft.com/en-us/library/azure/hh531793.aspx">subscription</a><sup>1</sup></p></td>
   <td valign="middle"><p>20</p></td>
   <td valign="middle"><p>10,000</p></td>
</tr>
<tr>
   <td valign="middle"><p><a href="http://msdn.microsoft.com/en-us/library/azure/gg456328.aspx">Co-administrators</a> per subscription</p></td>
   <td valign="middle"><p>200</p></td>
   <td valign="middle"><p>200</p></td>
</tr>
<tr>
   <td valign="middle"><p><a href="http://azure.microsoft.com/en-us/documentation/articles/storage-whatis-account/">Storage accounts</a> per subscription</p></td>
   <td valign="middle"><p>20</p></td>
   <td valign="middle"><p>50</p></td>
</tr>
<tr>
   <td valign="middle"><p><a href="http://azure.microsoft.com/en-us/documentation/articles/cloud-services-what-is/">Cloud services</a> per subscription</p></td>
   <td valign="middle"><p>20</p></td>
   <td valign="middle"><p>200</p></td>
</tr>
<tr>
   <td valign="middle"><p><a href="http://msdn.microsoft.com/library/azure/jj156007.aspx">Virtual networks</a> per subscription<sup>2</sup></p></td>
   <td valign="middle"><p>10</p></td>
   <td valign="middle"><p>100</p></td>
</tr>
<tr>
   <td valign="middle"><p><a href="http://msdn.microsoft.com/en-us/library/jj157100.aspx">Local networks</a> per subscription</p></td>
   <td valign="middle"><p>10</p></td>
   <td valign="middle"><p>100</p></td>
</tr>
<tr>
   <td valign="middle"><p>DNS servers per subscription</p></td>
   <td valign="middle"><p>9</p></td>
   <td valign="middle"><p>100</p></td>
</tr>
<tr>
   <td valign="middle"><p>Reserved IPs per subscription</p></td>
   <td valign="middle"><p>5</p></td>
   <td valign="middle"><p>100</p></td>
</tr>
<tr>
   <td valign="middle"><p>Hosted service certificates per subscription</p></td>
   <td valign="middle"><p>400</p></td>
   <td valign="middle"><p>400</p></td>
</tr>
<tr>
   <td valign="middle"><p><a href="http://msdn.microsoft.com/en-us/library/azure/jj156085.aspx">Affinity groups</a> per subscription</p></td>
   <td valign="middle"><p>256</p></td>
   <td valign="middle"><p>256</p></td>
</tr>
</table>

<sup>1</sup>Extra Small instances count as one core towards the core limit despite using a partial core.

<sup>2</sup>Each virtual network supports a single virtual network gateway.

##<a name="webworkerlimits"></a>Web/Worker Limits

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Resource</th>
   <th align="left" valign="middle">Default Limit</th>
   <th align="left" valign="middle">Maximum Limit</th>
</tr>
<tr>
   <td valign="middle"><p><a href="http://azure.microsoft.com/en-us/documentation/articles/cloud-services-what-is/">Web/worker roles per deployment<sup>1</sup></a></p></td>
   <td valign="middle"><p>25</p></td>
   <td valign="middle"><p>25</p></td>
</tr>
<tr>
   <td valign="middle"><p><a href="http://msdn.microsoft.com/en-us/library/gg557552.aspx#InstanceInputEndpoint">Instance Input Endpoints</a> per deployment</p></td>
   <td valign="middle"><p>25</p></td>
   <td valign="middle"><p>25</p></td>
</tr>
<tr>
   <td valign="middle"><p><a href="http://msdn.microsoft.com/en-us/library/gg557552.aspx#InputEndpoint">Input Endpoints</a> per deployment</p></td>
   <td valign="middle"><p>25</p></td>
   <td valign="middle"><p>25</p></td>
</tr>
<tr>
   <td valign="middle"><p><a href="http://msdn.microsoft.com/en-us/library/gg557552.aspx#InternalEndpoint">Internal Endpoints</a> per deployment</p></td>
   <td valign="middle"><p>25</p></td>
   <td valign="middle"><p>25</p></td>
</tr>
</table>

<sup>1</sup>Each Cloud Service with Web/Worker roles can have two deployments, one for production and one for staging. 

##<a name="vmlimits"></a>Virtual Machine Limits

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Resource</th>
   <th align="left" valign="middle">Default Limit</th>
   <th align="left" valign="middle">Maximum Limit</th>
</tr>
<tr>
   <td valign="middle"><p><a href="http://azure.microsoft.com/en-us/documentation/services/virtual-machines/">Virtual machines</a> per cloud service<sup>1</sup></p></td>
   <td valign="middle"><p>50</p></td>
   <td valign="middle"><p>50</p></td>
</tr>
<tr>
   <td valign="middle"><p>Input Endpoints per cloud service<sup>2</sup></p></td>
   <td valign="middle"><p>150</p></td>
   <td valign="middle"><p>150</p></td>
</tr>
</table>

<sup>1</sup>When you create a virtual machine, a cloud service is automatically created to contain the machine. You can then add multiple virtual machines in that same Cloud Service.

<sup>2</sup>Input endpoints are used to allow communication to the virtual machines that is external to the containing cloud service. Virtual machines within the same cloud service automatically allow communication between all UDP and TCP ports for internal communication.

##<a name="networkinglimits"></a>Networking Limits

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Resource</th>
   <th align="left" valign="middle">Default Limit</th>
   <th align="left" valign="middle">Maximum Limit</th>
</tr>
<tr>
   <td valign="middle"><p>Total machines<sup>1</sup> per <a href="http://msdn.microsoft.com/library/azure/jj156007.aspx">Virtual Network</a><sup>2</sup></p></td>
   <td valign="middle"><p>2048</p></td>
   <td valign="middle"><p>2048</p></td>
</tr>
<tr>
   <td valign="middle"><p>Concurrent TCP connections for a virtual machine or role instance</p></td>
   <td valign="middle"><p>500K</p></td>
   <td valign="middle"><p>500K</p></td>
</tr>
<tr>
   <td valign="middle"><p>Access Control Lists (ACLs) per endpoint<sup>3</sup></p></td>
   <td valign="middle"><p>50</p></td>
   <td valign="middle"><p>50</p></td>
</tr>
<tr>
   <td valign="middle"><p>Local network sites per virtual network</p></td>
   <td valign="middle"><p>10</p></td>
   <td valign="middle"><p>10</p></td>
</tr>
</table>

<sup>1</sup>The total number of machines includes Virtual Machines and Web/Worker role instances.

<sup>2</sup>Each virtual network supports a single [virtual network gateway][gateway].

<sup>3</sup>ACL is supported on Input Endpoints for Virtual Machines. For web/worker roles, it is supported on Input and Instance Input endpoints.

##<a name="storagelimits"></a>Storage Limits<sup>1</sup>

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Resource</th>
   <th align="left" valign="middle">Default Limit</th>
</tr>
<tr>
   <td valign="middle"><p>TB per storage account<sup>2</sup></p></td>
   <td valign="middle"><p>500</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max IOPS for persistent disk</p></td>
   <td valign="middle"><p>500<sup>3</sup></p></td>
</tr>
<tr>
   <td valign="middle"><p>Max IOPS per storage account</p></td>
   <td valign="middle"><p>20,000</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max ingress per storage account (US Regions)</p></td>
   <td valign="middle"><p>10 Gbps if GRS<sup>4</sup> enabled, 20 Gbps with it disabled</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max ingress per storage account (European and Asian Regions)</p></td>
   <td valign="middle"><p>5 Gbps if GRS<sup>4</sup> enabled, 10 Gbps with it disabled</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max egress per storage account (US Regions)</p></td>
   <td valign="middle"><p>20 Gbps if GRS<sup>4</sup> enabled, 30 Gbps with it disabled</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max egress per storage account (European and Asian Regions)</p></td>
   <td valign="middle"><p>10 Gbps if GRS<sup>4</sup> enabled, 15 Gbps with it disabled</p></td>
</tr>
</table>

<sup>1</sup>For more details on these limits, see [Azure Storage Scalability and Performance Targets][storagelimits]. 

<sup>2</sup>For page blobs only pages that are in-use accrue capacity usage. For example, a Virtual Machine with a 127 GB VHD but with only 30 GB being used by the OS, is only billed for the used 30 GB portion within the VHD, not the entire 127 GB. 

<sup>3</sup>Do not place more than 40 highly used VHDs in an account to avoid the 20,000 IOPS limit.

<sup>4</sup>Geo-Redundant Storage Account

##<a name="sqldblimits"></a>SQL Database Limits

For SQL Database Limits, please see the following topics:

 - [Azure SQL Database Service Tiers (Editions)][sqltiers]
 - [Azure SQL Database Service Tiers and Performance Levels][sqltiersperflevels]
 - [SQL Database Resource Limits][sqldblimits]

##<a name="seealso"></a>See Also

[Virtual Machine and Cloud Service Sizes for Azure][vmsizes]

[Azure Storage Scalability and Performance Targets][storagelimits]

[Azure SQL Database Service Tiers (Editions)][sqltiers]

[Azure SQL Database Service Tiers and Performance Levels][sqltiersperflevels] 

[SQL Database Resource Limits][sqldblimits]

  [customersupport]: http://azure.microsoft.com/en-us/support/faq/
  [gateway]: http://msdn.microsoft.com/en-us/library/azure/jj156210.aspx 
  [storagelimits]: http://msdn.microsoft.com/library/azure/dn249410.aspx
  [georedundantstorage]: http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/introducing-geo-replication-for-windows-azure-storage.aspx
  [sqldblimits]: http://msdn.microsoft.com/en-us/library/azure/dn338081.aspx
  [sqltiers]: http://msdn.microsoft.com/en-us/library/azure/dn741340.aspx
  [sqltiersperflevels]: http://msdn.microsoft.com/en-us/library/azure/dn741336.aspx
  [vmsizes]: http://msdn.microsoft.com/en-us/library/azure/dn197896.aspx
