---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 11/08/2018
ms.author: alkohli
---

Following caveats apply to data as it moves into Azure.

- We suggest that more than one device should not write to the same container.
- If you have an existing Azure object (such as a blob or a file) in the cloud with the same name as the object that is being copied, device will overwrite the file in the cloud.
- An empty directory hierarchy (without any files) created under share folders is not uploaded to the blob containers.
- If you are copying files larger than the device size, it's recommended to use *Robocopy* or *rsync* to ensure there are no failures.
