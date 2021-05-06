---
title: Troubleshoot virtual machine image uploads in Azure Stack Edge Pro | Microsoft Docs 
description: Describes how to troubleshoot issues that occur when uploading, downloading, or deleting virtual machine images in Azure Stack Edge.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 05/05/2021
ms.author: alkohli
---
# Troubleshoot virtual machine image uploads in Azure Stack Edge Pro

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]<!--Verify SKUs.-->

This article describes how to troubleshoot issues that occur when managing <!--and downloading and deleting?--> virtual machine (VM) images on an Azure Stack Edge Pro device.<!--1) Specifically, are they uploading images to a Blob container in a storage account? 2) Although the article is touted as "upload" issues, some of the errors appear to occur during downloads. Could be a step in the upload process.-->

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Troubleshoot issues when uploading VM images to a device

<!--CURRENT STATUS OF DRAFT (05/05/2021): Content from source pasted in. Screen grabs pasted in for reference when available. Minimal edits.-->

## Unable to add VM image to Blob container

**Error Description:** In the Azure portal, when trying to upload a VM image to a Blob container, the **Add** button is not available, and the image can't be uploaded to the container.<!--Verify context. Source is not specific about where the image is uploaded to.-->

Possible causes:

* You don't have the required contributor role permissions to the resource group or subscription for the device.

* The image name already exists in SCOPE?.<!--1) Unique name required within what scope - on the device, in the container, in the storage account, in the subscription? 2) This is listed as an outlier. Most common cause is permissions issue.-->

**Suggested solution:** Make sure you have the required contributor permissions to add files to the resource group or storage account. For more information, see [Prerequisites for the Azure Stack Edge resource](azure-stack-edge-deploy-prep.md#prerequisites).


## Invalid blob type for the source blob uri

**Error Description:** You picked a block blob virtual hard disk (VHD)<!--Terminology: "block blob VHD" probably is't a thing--> to download instead of a page blob VHD.

**Suggested solution:** Upload the VHD as a page blob. Then download the blob again.

=================
GRAB TEXT: Error B
Resource
Status
Type
®	aseimagestorageaccount	MicrosoftStorage/storageAccounts	Completed
®	aseimagestorageaccount	MicrosoftStorage/storageAccounts	Completed
<B	dbelocal/blockblobblankdiskl	MicrosoftAzure8ndge/1ocatK>ns/inges...	Failed
X Creation of image failed.
Possible Causes
•	DeploymentFailed : At least one resource deployment operation failed. Please list deployment operations for details. Please see https/akajns/DeployOperations for usage details.
•	Conflict : {
•status': -Failed-.
"error": {
"code*: 'ResourceDeploymentFailure",
"message*: "The resource operation completed with terminal provisioning state ‘Failed’.",
"details": [
{
"code": "BlobDownloadFailed".
"message": "Invalid blob type for source blob uri."
}
Recommended Action
In the local web Ul of the device, go to Troubleshooting > Diagnostic tests and dick Run diagnostic tests. Resolve the reported issues. If the issue persists, contact Microsoft Support.
=================

## Only blobs formatted as VHDs can be imported.

**Error Description:** The VHD hasn’t been formatted properly. It needs to be a Generation 1, VHD extension and fixed size. Most of our ICMs will have this error.

**Suggested solution:** Go to [Common issues for Image creation on ASE](https://microsoft-my.sharepoint.com/:w:/p/niachary/EQih4TRKTMVFnZmAfvX6qUoBwI-2-v5mRNleGtfwWmGVZg).

=================
GRAB TEXT: Error C

Resource
Q aseimagestorageaccount ® aseimagestorageaccount ® dbelocal/ubuntuBdynamic ! ubuntu13dynamic
X Creation of image failed.
Possible Causes
• DeploymentFailed : At least one resource deployment operation failed. Please list deployment operations for details. Please ! https://aka.ms/DeployOperations for usage details.
. Conflict : l •status': ‘Failed*.
•error": {
"code": "ResourceDeploymentFailure".
"message": "The resource operation completed with terminal provisioning state ‘Failed’.",
"details": I
{
"code": "BlobError",
"message": "Only blobs formatted as VHDs can be imported."
}
]
)
)
Recommended Action
In the local web Ul of the device, go to Troubleshooting > Diagnostic tests and click Run diagnostic tests. Resolve the reported issues. If the issue persists, contact Microsoft Support.
Type	Status
MurosoftStorage/st orage Accounts	Completed
MiaosofLStorage/storageAccounts	Completed
MiaosofLAzureBridge/locations/inges... Completed
MicrosoftCompute/images	Failed
=================


## The condition specified using HTTP conditional header(s) is not met.

**Error Description:** If any sort of modification is being done on the source VHD in Azure, then the download will fail because the etags between each chunk of download will be different. This can also happen if you are uploading the source VHD into Azure and try to start a download before the upload has completed.

**Suggested solution:** Wait until all modifications/uploads are done on the VHD and then try downloading the VHD again.

=================
GRAB TEXT: Error D

Resource
Type
Status
0	aseimagestorageaccount	MicrosoftStorage/storageAccounts	Completed
0	aseimagestorageaccount	MicrosoftStorage/storageAccounts	Completed
0	dbelocal/blockblobblankdiskl	MicrosoftAzureBridge/locations/inges... Failed
X Creation of image failed.
Possible Causes
•	DeploymentFailed : At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/DeployOperations for usage details.
•	Conflict : {
"status": "Failed",
"error": {
"code": "ResourceDeploymentFailure",
"message": "The resource operation completed with terminal provisioning state ■Failed'.",
"details": [
{
"code": "BlobDownloadFailed",
"message": "Invalid blob type for source blob uri."
}
]
}
Î
Recommended Action
In the local web Ul of the device, go to Troubleshooting > Diagnostic tests and click Run diagnostic tests. Resolve the reported issues. If the issue persists, contact Microsoft Support.
=================

<!--Product team note to self: Todo – document this storage account so they can clean up if the ingestion job fails, every failed job – see if IDC can delete the container.-->


## Not able to delete the image through the Azure portal.

**Error Description:** The issue is that there is a bug in the October release build where we return an error if a delete is called on a metadata object that doesn't exist anymore. For example, you could call delete image through the portal and step #1 succeeds but step #2 fails. Then when you call delete again, step #1 will fail immediately saying that the object doesn't exist anymore and this prevents us from proceeding to step #2. 

**Suggested solution:** Use the AzureRM Powershell modules to manually delete the image using `Remove-AzureRmImage`. Once this delete completes, the image won’t show up in the portal anymore.


## Next steps

* Learn more about how to [Troubleshoot your Azure Stack Edge Pro issues](azure-stack-edge-troubleshoot.md).<!--Not updated.-->