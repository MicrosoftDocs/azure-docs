---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 06/06/2025
ms.author: anfdocs
ms.custom: include file

# manage-cool-access.md // 2 workflows
---
    
* **Enable Cool Access**:

    The coolness period defines the minimum number of days before data is transitioned to the cold tier. The default value is 31 days. The supported values are between 2 and 183 days.

    >[!NOTE]
    > The coolness period is calculated from the time of volume creation. If any existing volumes are enabled with cool access, the coolness period is applied retroactively on those volumes. If certain data blocks on the volumes have not been accessed for the number of days specified in the coolness period, those blocks move to the cool tier once the feature is enabled. Once the coolness period is reached, background jobs can take up to 48 hours to initiate the data transfer to the cool tier.

* **Cool Access Retrieval Policy**:

    This option specifies under which conditions data moves back to the hot tier. You can set this option to **Default**, **On-Read**, or **Never**.

    If you don't set a value for the cool access retrieval policy, the retrieval policy is set to Default. The following table describes each policy's data retrieval behavior:

    | Retrieval policy | Behavior |
    | - | - | 
    | Default | Cold data is returned to the hot tier when performing random reads. Data is served from the cool tier with sequential reads. | 
    | On-read | On both sequential and random reads, cold data  is returned to the hot tier. |
    | Never | Cold data is served directly from the cool tier. After data moves to the cool tier, it's not returned to the hot tier. |

* **Cool Access Tiering policy**     

    The tiering policy manages what data moves to the cool tier. You can tier all data or limit tiering to snapshots. Select one of the following policies: 

    | Tiering policy | Description |
    | - | - | 
    | `Auto` | This policy encompasses both data in the active file system and snapshot copy data. |
    | `SnapshotOnly` | This policy limits tiering to data in snapshots. All data blocks associated with files in the active file system remain in the hot tier. |