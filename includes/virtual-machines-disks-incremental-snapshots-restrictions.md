---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 03/05/2020
 ms.author: rogarana
 ms.custom: include file
---

- Incremental snapshots currently cannot be moved between subscriptions.
- You can currently only generate SAS URIs of up to five snapshots of a particular snapshot family at any given time.
- You cannot create an incremental snapshot for a particular disk outside of that disk's subscription.
- Up to seven incremental snapshots per disk can be created every five minutes.
- A total of 200 incremental snapshots can be created for a single disk.
- You cannot get the changes between snapshots taken before and after the change in the size of the parent disk across 4 TB boundary. You have to again download the full copy of the snapshot created after the resize. Subsequently, you can get the changes between the snapshots created after the resize across 4 TB boundary. 
