---
title: Azure Storage samples using Java | Microsoft Docs
description: View, download, and run sample code and applications for Azure Storage. Discover getting started samples for blobs, queues, tables, and files, using the Java storage client libraries.
services: storage
author: seguler
ms.service: storage
ms.devlang: java
ms.topic: article
ms.date: 01/12/2017
ms.author: seguler
ms.component: common
---
# Azure Storage samples using Java

## Java sample index

The following table provides an overview of our samples repository and the scenarios covered in each sample. Click on the links to view the corresponding sample code in GitHub.

<table style="font-size:90%"><thead><tr><th style="font-size:110%">Endpoint</th><th style="font-size:110%">Scenario</th><th style="font-size:110%">Sample Code</th></tr></thead><tbody> 
<tr> 
<td rowspan="16"><b>Blob</b></td>
<td>Append Blob</td> 
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobBasics.java">Getting Started with Azure Blob Service in Java</a></td> 
</tr> 
<tr> 
<td>Block Blob</td>
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobBasics.java">Getting Started with Azure Blob Service in Java</a></td>
</tr> 
<tr> 
<td>Client-Side Encryption</td>
<td><a href="https://github.com/Azure-Samples/storage-java-client-side-encryption">Getting Started with Azure Client Side Encryption in Java</a></td>
</tr> 
<tr> 
<td>Copy Blob</td>
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobBasics.java">Getting Started with Azure Blob Service in Java</a></td>
</tr> 
<tr> 
<td>Create Container</td>
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobBasics.java">Getting Started with Azure Blob Service in Java</a></td>
</tr> 
<tr> 
<td>Delete Blob</td>
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobBasics.java">Getting Started with Azure Blob Service in Java</a></td>
</tr> 
<tr> 
<td>Delete Container</td>
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobBasics.java">Getting Started with Azure Blob Service in Java</a></td>
</tr> 
<tr> 
<td>Blob Metadata/Properties/Stats</td>
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobAdvanced.java">Getting Started with Azure Blob Service in Java</a></td>
</tr> 
<tr> 
<td>Container ACL/Metadata/Properties</td>
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobAdvanced.java">Getting Started with Azure Blob Service in Java</a></td>
</tr> 
<tr> 
<td>Get Page Ranges</td>
<td><a href="https://github.com/Azure/azure-storage-java/blob/master/microsoft-azure-storage-test/src/com/microsoft/azure/storage/blob/CloudPageBlobTests.java">Page Blob Tests Sample</a></td>
</tr> 
<tr> 
<td>Lease Blob/Container</td>
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobBasics.java">Getting Started with Azure Blob Service in Java</a></td>
</tr> 
<tr> 
<td>List Blob/Container</td>
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobBasics.java">Getting Started with Azure Blob Service in Java</a></td>
</tr> 
<tr> 
<td>Page Blob</td>
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobBasics.java">Getting Started with Azure Blob Service in Java</a></td>
</tr>
<tr> 
<td>SAS</td>
<td><a href="https://github.com/Azure/azure-storage-java/blob/master/microsoft-azure-storage-test/src/com/microsoft/azure/storage/blob/SasTests.java">SAS Tests Sample</a></td>
</tr> 	
<tr> 
<td>Service Properties</td>
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobAdvanced.java">Getting Started with Azure Blob Service in Java</a></td>
</tr> 			
<tr> 
<td>Snapshot Blob</td>
<td><a href="https://github.com/Azure-Samples/storage-blob-java-getting-started/blob/master/src/BlobBasics.java">Getting Started with Azure Blob Service in Java</a></td>
</tr> 
<tr> 
<td rowspan="9"><b>File</b></td>
<td>Create Shares/Directories/Files</td> 
<td><a href="https://github.com/Azure-Samples/storage-file-java-getting-started/blob/master/src/FileBasics.java">Getting Started with Azure File Service in Java</a></td> 
</tr>
<tr> 
<td>Delete Shares/Directories/Files</td> 
<td><a href="https://github.com/Azure-Samples/storage-file-java-getting-started/blob/master/src/FileBasics.java">Getting Started with Azure File Service in Java</a></td> 
</tr> 
<tr> 
<td>Directory Properties/Metadata</td> 
<td><a href="https://github.com/Azure-Samples/storage-file-java-getting-started/blob/master/src/FileAdvanced.java">Getting Started with Azure File Service in Java</a></td> 
</tr> 
<tr> 
<td>Download Files</td> 
<td><a href="https://github.com/Azure-Samples/storage-file-java-getting-started/blob/master/src/FileBasics.java">Getting Started with Azure File Service in Java</a></td> 
</tr> 
<tr> 
<td>File Properties/Metadata/Metrics</td> 
<td><a href="https://github.com/Azure-Samples/storage-file-java-getting-started/blob/master/src/FileAdvanced.java">Getting Started with Azure File Service in Java</a></td> 
</tr> 
<tr> 
<td>File Service Properties</td> 
<td><a href="https://github.com/Azure-Samples/storage-file-java-getting-started/blob/master/src/FileAdvanced.java">Getting Started with Azure File Service in Java</a></td> 
</tr> 
<tr> 
<td>List Directories and Files</td> 
<td><a href="https://github.com/Azure-Samples/storage-file-java-getting-started/blob/master/src/FileBasics.java">Getting Started with Azure File Service in Java</a></td> 
</tr>
<tr> 
<td>List Shares</td> 
<td><a href="https://github.com/Azure-Samples/storage-file-java-getting-started/blob/master/src/FileBasics.java">Getting Started with Azure File Service in Java</a></td> 
</tr>
<tr> 
<td>Share Properties/Metadata/Stats</td> 
<td><a href="https://github.com/Azure-Samples/storage-file-java-getting-started/blob/master/src/FileAdvanced.java">Getting Started with Azure File Service in Java</a></td> 
</tr>
<tr> 
<td rowspan="8"><b>Queue</b></td>
<td>Add Message</td> 
<td><a href="https://github.com/Azure/azure-storage-java/blob/master/microsoft-azure-storage-samples/src/com/microsoft/azure/storage/queue/gettingstarted/QueueBasics.java">Storage Java Client Library Samples</a></td> 
</tr> 
<tr> 
<td>Client-Side Encryption</td> 
<td><a href="https://github.com/Azure/azure-storage-java/blob/master/microsoft-azure-storage-samples/src/com/microsoft/azure/storage/encryption/queue/gettingstarted/QueueGettingStarted.java">Storage Java Client Library Samples</a></td> 
</tr> 
<tr> 
<td>Create Queues</td> 
<td><a href="https://github.com/Azure-Samples/storage-queue-java-getting-started/blob/master/src/QueueBasics.java">Getting Started with Azure Queue Service in Java</a></td> 
</tr> 
<tr> 
<td>Delete Message/Queue</td> 
<td><a href="https://github.com/Azure-Samples/storage-queue-java-getting-started/blob/master/src/QueueBasics.java">Getting Started with Azure Queue Service in Java</a></td> 
</tr> 
<tr> 
<td>Peek Message</td> 
<td><a href="https://github.com/Azure-Samples/storage-queue-java-getting-started/blob/master/src/QueueBasics.java">Getting Started with Azure Queue Service in Java</a></td> 
</tr> 
<tr> 
<td>Queue ACL/Metadata/Stats</td> 
<td><a href="https://github.com/Azure-Samples/storage-queue-java-getting-started/blob/master/src/QueueAdvanced.java">Getting Started with Azure Queue Service in Java</a></td> 
</tr> 
<tr> 
<td>Queue Service Properties</td> 
<td><a href="https://github.com/Azure-Samples/storage-queue-java-getting-started/blob/master/src/QueueAdvanced.java">Getting Started with Azure Queue Service in Java</a></td> 
</tr> 
<tr> 
<td>Update Message</td> 
<td><a href="https://github.com/Azure-Samples/storage-queue-java-getting-started/blob/master/src/QueueBasics.java">Getting Started with Azure Queue Service in Java</a></td> 
</tr> 
<tr> 
<td rowspan="7"><b>Table</b></td>
<td>Create Table</td> 
<td><a href="https://github.com/Azure-Samples/storage-table-java-getting-started/blob/master/src/TableBasics.java">Getting Started with Azure Table Service in Java</a></td> 
</tr> 
<tr> 
<td>Delete Entity/Table</td> 
<td><a href="https://github.com/Azure-Samples/storage-table-java-getting-started/blob/master/src/TableBasics.java">Getting Started with Azure Table Service in Java</a></td> 
</tr> 
<tr> 
<td>Insert/Merge/Replace Entity</td> 
<td><a href="https://github.com/Azure/azure-storage-java/blob/master/microsoft-azure-storage-samples/src/com/microsoft/azure/storage/table/gettingtstarted/TableBasics.java">Storage Java Client Library Samples</a></td> 
</tr> 
<tr> 
<td>Query Entities</td> 
<td><a href="https://github.com/Azure-Samples/storage-table-java-getting-started/blob/master/src/TableBasics.java">Getting Started with Azure Table Service in Java</a></td> 
</tr> 
<tr> 
<td>Query Tables</td> 
<td><a href="https://github.com/Azure-Samples/storage-table-java-getting-started/blob/master/src/TableBasics.java">Getting Started with Azure Table Service in Java</a></td> 
</tr> 
<tr> 
<td>Table ACL/Properties</td> 
<td><a href="https://github.com/Azure-Samples/storage-table-java-getting-started/blob/master/src/TableAdvanced.java">Getting Started with Azure Table Service in Java</a></td> 
</tr> 
<tr> 
<td>Update Entity</td> 
<td><a href="https://github.com/Azure/azure-storage-java/blob/master/microsoft-azure-storage-samples/src/com/microsoft/azure/storage/table/gettingtstarted/TableBasics.java">Storage Java Client Library Samples</a></td> 
</tr> 
</tbody> 
</table>
<br/>

## Azure Code Samples library

To view the complete sample library, go to the [Azure Code Samples](https://azure.microsoft.com/resources/samples/?service=storage) library, which includes samples for Azure Storage that you can download and run locally. The Code Sample Library provides sample code in .zip format. Alternatively, you can browse and clone the GitHub repository for each sample.

[!INCLUDE [storage-java-samples-include](../../../includes/storage-java-samples-include.md)]

## Getting started guides

Check out the following guides if you are looking for instructions on how to install and get started with the Azure Storage Client Libraries.

* [Getting Started with Azure Blob Service in Java](../blobs/storage-quickstart-blobs-java.md)
* [Getting Started with Azure Queue Service in Java](../queues/storage-java-how-to-use-queue-storage.md)
* [Getting Started with Azure Table Service in Java](../../cosmos-db/table-storage-how-to-use-java.md)
* [Getting Started with Azure File Service in Java](../files/storage-java-how-to-use-file-storage.md)

## Next steps

For information on samples for other languages:

* .NET: [Azure Storage samples using .NET](storage-samples-dotnet.md)
* All other languages: [Azure Storage samples](storage-samples.md)
