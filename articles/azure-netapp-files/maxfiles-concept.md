---
title: Understand maxfiles limits in Azure NetApp Files
description: Learn about the impact of maxfiles on Azure NetApp Files quotas and how to resolve "out of space" messages. 
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 01/27/2025
ms.author: anfdocs
---
# Understand `maxfiles` limits in Azure NetApp Files

Azure NetApp Files volumes have a value called `maxfiles` that refers to the maximum number of files and folders (also known as inodes) a volume can contain. The `maxfiles` limit for an Azure NetApp Files volume is based on the size (quota) of the volume, where the service dynamically adjusts the `maxfiles` limit for a volume based on its provisioned size and uses the following guidelines.

- For regular volumes less than or equal to 683 GiB, the default `maxfiles` limit is 21,251,126.
- For regular volumes greater than 683 GiB, the default `maxfiles` limit is approximately one file (or inode) per 32 KiB of allocated volume capacity up to a maximum of 2,147,483,632.
- For [large volumes](large-volumes-requirements-considerations.md), the default `maxfiles` limit is approximately one file (or inode) per 32 KiB of allocated volume capacity up to a default maximum of 15,938,355,048.
- Each inode uses roughly 288 bytes of capacity in the volume. Having many inodes in a volume can consume a non-trivial amount of physical space overhead on top of the capacity of the actual data.
    - If a file is less than 64 bytes in size, it's stored in the inode itself and doesn't use additional capacity. This capacity is only used when files are actually allocated to the volume.
    - Files larger than 64 bytes do consume additional capacity on the volume. For instance, if there are one million files greater than 64 bytes in an Azure NetApp Files volume, then approximately 274 MiB of capacity would belong to the inodes.


The following table shows examples of the relationship `maxfiles` values based on volume sizes for regular volumes. 

| Volume size | Estimated `maxfiles` limit |
| - | - |
| 0 – 683 GiB | 21,251,126 |
| 1 TiB (1,073,741,824 KiB) | 31,876,709 |
| 10 TiB (10,737,418,240 KiB) | 318,767,099 |
| 50 TiB (53,687,091,200 KiB)	| 1,593,835,519 |
| 100 TiB (107,374,182,400 KiB) | 2,147,483,632 |

The following table shows examples of the relationship `maxfiles` values based on volume sizes for [large volumes](large-volumes-requirements-considerations.md). 

| Volume size | Estimated `maxfiles` limit |
| - | - |
| 50 TiB (53,687,091,200 KiB) |	1,593,835,512 |
| 100 TiB (107,374,182,400 KiB)	| 3,187,671,024 |
| 200 TiB (214,748,364,800 KiB)	| 6,375,342,024  |
| 500 TiB (536,870,912,000 KiB)	| 15,938,355,048 |

To see the `maxfiles` allocation for a specific volume size, check the **Maximum number of files** field in the volume’s overview pane.

:::image type="content" source="./media/azure-netapp-files-resource-limits/maximum-number-files.png" alt-text="Screenshot of volume overview menu." lightbox="./media/azure-netapp-files-resource-limits/maximum-number-files.png":::

When the `maxfiles` limit is reached, clients receive "out of space" messages when attempting to create new files or folders. Adjusting your quota based on this information can create greater inode availability. If you have further issues with the `maxfiles` limit, contact Microsoft technical support.


You can't set `maxfiles` limits for data protection volumes via a quota request. Azure NetApp Files automatically increases the `maxfiles` limit of a data protection volume to accommodate the number of files replicated to the volume. When a failover happens on a data protection volume, the `maxfiles` limit remains the last value before the failover. In this situation, you can submit a `maxfiles` [quota request](azure-netapp-files-resource-limits.md#request-limit-increase) for the volume.

## Next steps

* [Azure NetApp Files resource limits](azure-netapp-files-resource-limits.md)
* [Understand maximum directory sizes](directory-sizes-concept.md)