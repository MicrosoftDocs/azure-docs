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

<sup>1</sup>For more details on these limits, see [Azure Storage Scalability and Performance Targets](../articles/storage-scalability-targets.md).

<sup>2</sup>For virtual machines in the Basic Tier, do not place more than 66 highly used VHDs in a storage account to avoid the 20,000 total request rate limit (20,000/300). For virtual machines in the Standard Tier, do not place more than 40 highly used VHDs in a storage account (20,000/500). For more information, see [Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx).

<sup>3</sup>GRS is [Geo Redundant Storage](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/introducing-geo-replication-for-windows-azure-storage.aspx). LRS is [Locally Redundant Storage](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/08/introducing-locally-redundant-storage-for-windows-azure-storage.aspx). Note that GRS is also locally redundant.
