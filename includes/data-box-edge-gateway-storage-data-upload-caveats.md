---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 02/14/2019
ms.author: alkohli
---

Following caveats apply to data as it moves into Azure.

- We suggest that more than one device should not write to the same container.
- If you have an existing Azure object (such as a blob or a file) in the cloud with the same name as the object that is being copied, device will overwrite the file in the cloud.
- An empty directory hierarchy (without any files) created under share folders is not uploaded to the blob containers.
- For large files, we recommend that you use robocopy because it retries the copy operation for intermittent errors.
- If the share associated with the Azure storage container uploads blobs that do not match the type of blobs defined for the share at the time of creation, then such blobs are not updated. For example, you create a block blob share on the device. Associate the share with an existing cloud container that has page blobs. Refresh that share to download the files. Modify some of the refreshed files that are already stored as page blobs in the cloud. You will see upload failures.
