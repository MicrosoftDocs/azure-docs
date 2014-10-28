<properties urlDisplayName="Azure Subscription and Service Limits, Quotas, and Constraints" pageTitle="Microsoft Azure Subscription and Service Limits, Quotas, and Constraints" metaKeywords="Cloud Services, Virtual Machines, Web Sites, Virtual Network, SQL Database, Subscription, Storage" description="Provides a list of common Azure subscription and service limits along with maximum values." metaCanonical="" services="web-sites,virtual-machines,cloud-services" documentationCenter="" title="" authors="jroth" solutions="" manager="paulettm" editor="mollybos" />

<tags ms.service="multiple" ms.workload="multiple" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="jroth" />

# Azure Subscription and Service Limits, Quotas, and Constraints

The following document specifies some of the most common Microsoft Azure limits. Note that this document does not currently cover all Azure services. Over time, these limits will be expanded and updated to cover more of the platform.

- [Subscription Limits](#subscription)
- [Cloud Service Limits](#webworkerlimits)
- [Virtual Machine Limits](#vmlimits)
- [Websites Limits](#websiteslimits)
- [Networking Limits](#networkinglimits)
- [Storage Limits](#storagelimits)
- [DocumentDB Preview Limits](#documentdblimits)
- [SQL Database Limits](#sqldblimits)
- [Media Services Limits](#mediaserviceslimits)
- [Service Bus Limits](#servicebuslimits)

> [WACOM.NOTE] If you want to raise the limit above the **Default Limit**, you can [open an online customer support request at no charge][azurelimitsblogpost]. The limits cannot be raised above the **Maximum Limit** value in the tables below. If there is no **Maximum Limit** column, then the specified resource does not have adjustable limits.

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
   <td valign="middle"><p>100</p></td>
   <td valign="middle"><p>100</p></td>
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
   <td valign="middle"><p>SQL Databases per subscription</p></td>
   <td valign="middle"><p>150</p></td>
   <td valign="middle"><p>500</p></td>
</tr>
<tr>
   <td valign="middle"><p>Logical SQL Database servers per subscription</p></td>
   <td valign="middle"><p>6</p></td>
   <td valign="middle"><p>150</p></td>
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

##<a name="webworkerlimits"></a>Cloud Service Limits

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

<sup>1</sup>Each Cloud Service with Web/Worker roles can have two deployments, one for production and one for staging. Also note that this limit refers to the number of distinct roles (configuration) and not the number of instances per role (scaling). 

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

##<a name="websiteslimits"></a>Websites Limits

[WACOM.INCLUDE [azure-websites-limits](../includes/azure-websites-limits.md)]

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

##<a name="storagelimits"></a>Storage Limits

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Resource<sup>1</sup></th>
   <th align="left" valign="middle">Default Limit</th>
</tr>
<tr>
   <td valign="middle"><p>TB per storage account</p></td>
   <td valign="middle"><p>500 TB</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max size of a single blob container, table, or queue</p></td>
   <td valign="middle"><p>500 TB</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max number of blob containers, blobs, file shares, tables, queues, entities, or messages per storage account</p></td>
   <td valign="middle"><p>Only limit is the 500 TB storage account capacity</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max size of a file share</p></td>
   <td valign="middle"><p>5 TB</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max number of files in a file share</p></td>
   <td valign="middle"><p>Only limit is the 5 TB total capacity of the file share</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max 8 KB IOPS per persistent disk (Basic Tier)</p></td>
   <td valign="middle"><p>300<sup>2</sup></p></td>
</tr>
<tr>
   <td valign="middle"><p>Max 8 KB IOPS per persistent disk (Standard Tier)</p></td>
   <td valign="middle"><p>500<sup>2</sup></p></td>
</tr>
<tr>
   <td valign="middle"><p>Total Request Rate (assuming 1KB object size) per storage account</p></td>
   <td valign="middle"><p>Up to 20,000 entities or messages per second</p></td>
</tr>
<tr>
   <td valign="middle"><p>Target Throughput for Single Blob</p></td>
   <td valign="middle"><p>Up to 60 MB per second, or up to 500 requests per second</p></td>
</tr>
<tr>
   <td valign="middle"><p>Target Throughput for Single Queue (1 KB messages)</p></td>
   <td valign="middle"><p>Up to 2000 messages per second</p></td>
</tr>
<tr>
   <td valign="middle"><p>Target Throughput for Single Table Partition (1 KB entities)</p></td>
   <td valign="middle"><p>Up to 2000 entities per second</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max ingress per storage account (US Regions)</p></td>
   <td valign="middle"><p>10 Gbps if GRS<sup>3</sup> enabled, 20 Gbps for LRS</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max egress per storage account (US Regions)</p></td>
   <td valign="middle"><p>20 Gbps if GRS<sup>3</sup> enabled, 30 Gbps for LRS</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max ingress per storage account (European and Asian Regions)</p></td>
   <td valign="middle"><p>5 Gbps if GRS<sup>3</sup> enabled, 10 Gbps for LRS</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max egress per storage account (European and Asian Regions)</p></td>
   <td valign="middle"><p>10 Gbps if GRS<sup>3</sup> enabled, 15 Gbps for LRS</p></td>
</tr>
</table>

<sup>1</sup>For more details on these limits, see [Azure Storage Scalability and Performance Targets][storagelimits]. 

<sup>2</sup>For virtual machines in the Basic Tier, do not place more than 66 highly used VHDs in a storage account to avoid the 20,000 total request rate limit (20,000/300). For virtual machines in the Standard Tier, do not place more than 40 highly used VHDs in a storage account (20,000/500). For more information, see [Virtual Machine and Cloud Service Sizes for Azure][vmsizes]. 

<sup>3</sup>GRS is [Geo Redundant Storage][georedundantstorage]. LRS is [Locally Redundant Storage][locallyredundantstorage]. Note that GRS is also locally redundant.

##<a name="documentdblimits"></a>DocumentDB Preview Limits

[WACOM.INCLUDE [azure-documentdb-limits](../includes/azure-documentdb-limits.md)]

##<a name="sqldblimits"></a>SQL Database Limits

For SQL Database Limits, please see the following topics:

 - [Azure SQL Database Service Tiers (Editions)][sqltiers]
 - [Azure SQL Database Service Tiers and Performance Levels][sqltiersperflevels]
 - [Database Throughput Unit (DTU) Quotas][sqlDTU]
 - [SQL Database Resource Limits][sqldblimits]

##<a name="mediaserviceslimits"></a>Media Services Limits

[WACOM.INCLUDE [azure-mediaservices-limits](../includes/azure-mediaservices-limits.md)]

##<a name="servicebuslimits"></a>Service Bus Limits

[WACOM.INCLUDE [azure-servicebus-limits](../includes/azure-servicebus-limits.md)]

##<a name="seealso"></a>See Also

[Understanding Azure Limits and Increases][azurelimitsblogpost]

[Virtual Machine and Cloud Service Sizes for Azure][vmsizes]

  [customersupportfaq]: http://azure.microsoft.com/en-us/support/faq/
  [azurelimitsblogpost]: http://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/
  [gateway]: http://msdn.microsoft.com/en-us/library/azure/jj156210.aspx 
  [storagelimits]: http://msdn.microsoft.com/library/azure/dn249410.aspx
  [georedundantstorage]: http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/introducing-geo-replication-for-windows-azure-storage.aspx
  [sqldblimits]: http://msdn.microsoft.com/en-us/library/azure/dn338081.aspx
  [sqltiers]: http://msdn.microsoft.com/en-us/library/azure/dn741340.aspx
  [sqltiersperflevels]: http://msdn.microsoft.com/en-us/library/azure/dn741336.aspx
  [sqlDTU]: http://msdn.microsoft.com/en-us/library/azure/ee336245.aspx#DTUs
  [vmsizes]: http://msdn.microsoft.com/en-us/library/azure/dn197896.aspx
  [georedundantstorage]: http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/introducing-geo-replication-for-windows-azure-storage.aspx
  [locallyredundantstorage]: http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/08/introducing-locally-redundant-storage-for-windows-azure-storage.aspx
