---
title: Upload a vhd to Azure using Azure CLI
description: Learn how to upload a vhd to an Azure managed disk, using the Azure CLI.
services: "virtual-machines-linux,storage"
author: roygara
ms.author: rogarana
ms.date: 02/11/2019
ms.topic: article
ms.service: virtual-machines-linux
ms.tgt_pltfrm: linux
ms.subservice: disks
---

Ensure that you are using the latest version (>= 25.0.0) of Azure .Net SDK from nuget.org 

Ensure that you are using the latest version (>=10.0.1) of Azure Storage blob .Net SDK from nuget.org 

Create an empty managed disk for upload and generate a writable SAS of the managed disk 

```csharp
using (var computeClient = new ComputeManagementClient(credential)) 

{ 
computeClient.SubscriptionId = subscriptionId; 

Disk diskInUploadState = new Disk() 

{ 
Location = region, 

Sku = new DiskSku("Standard_LRS", "Standard"), 

DiskSizeGB = sizeInGiB, 

//CreationData must be set to Upload if you want to create an empty disk for uploading data 

CreationData = new CreationData("Upload"),
};
var createDiskResponse = computeClient.Disks.BeginCreateOrUpdate(resourceGroupName, managedDiskName, diskInUploadState); 

int sasExpiryInSec = 60 * 24 * 60 * 60; 
//You must set the access to Write when you invoke GrantAccessData for generating a SAS for upload.  

// Setting the access to Read generates a read-only SAS that can be used for downloading data only. 

GrantAccessData grantAccessData = new GrantAccessData("Write", sasExpiryInSec);
var getSasResponse = computeClient.Disks.GrantAccess(resourceGroupName, managedDiskName, grantAccessData); 
//Note the SAS generated. The name of the storage account starts with md-impexp.  

//These are temporary storage accounts created by the system for the upload.  

return getSasResponse.AccessSAS; 
}
Upload data to the managed disk by using WritePage as shown below. You can choose either a or b.  
```
The sample below gets the pages of a page blob, downloads the pages and writes the pages to the managed disk. 
CloudPageBlob sourceVHD = new CloudPageBlob(new Uri(sourceSASURI)); 

CloudPageBlob targetMD = new CloudPageBlob(new Uri(targetSASURI)); 
// Get the valid ranges of the source blob 

IEnumerable<PageRange> pageRanges = sourceVHD.GetPageRanges(); 

int fourMB = 4*1024*1024; 

 

foreach (PageRange range in pageRanges) 

{ 
Int64 rangeSize = (Int64)(range.EndOffset + 1 - range.StartOffset); 

// Chop range into 4MB chucks 

for (Int64 subOffset = 0; subOffset < rangeSize; subOffset += fourMB) 

{ 

int subRangeSize = (int)Math.Min(rangeSize - subOffset, fourMB); 
using (MemoryStream stream = new MemoryStream()) 

{
await sourceVHD.DownloadRangeToStreamAsync(stream, range.StartOffset + subOffset, subRangeSize); 
stream.Position = 0;
await targetMD.WritePagesAsync(stream, range.StartOffset + subOffset, null);
}
}
}

The sample below gets the pages of a page blob, writes the pages to the target managed disk without downloading the pages. System downloads the source pages and writes them to managed disks.  

CloudPageBlob sourceVHD = new CloudPageBlob(new Uri(sourceSASURI)); 

loudPageBlob targetMD = new CloudPageBlob(new Uri(targetSASURI)); 
//Get the valid page ranges for the source page blob 
IEnumerable<PageRange> pageRanges = sourceVHD.GetPageRanges(); 
int fourMB = 4*1024*1024;
foreach (PageRange range in pageRanges)
{ 

Int64 rangeSize = (Int64)(range.EndOffset + 1 - range.StartOffset); 

// Chop a range into 4MB chunchs 

for (Int64 subOffset = 0; subOffset < rangeSize; subOffset += fourMB) 

{
int subRangeSize = (int)Math.Min(rangeSize - subOffset, fourMB); 

await targetMD.WritePagesAsync(new Uri(sourceSASURI), range.StartOffset + subOffset, subRangeSize, range.StartOffset + subOffset, null,null,null, null, null, CancellationToken.None); 
} 
} 

Revoke the SAS after the upload is complete to attach the disk to a VM 

using (var computeClient = new ComputeManagementClient(credential)) 

{ 
computeClient.SubscriptionId = subscriptionId; 
computeClient.Disks.RevokeAccess(resourceGroupName, managedDiskName); 
} 