<properties
   pageTitle="Azure Backup limits table"
   description="Describes system limits for Azure Backup."
   services="backup"
   documentationCenter="NA"
   authors="Jim-Parker"
   manager="jwhit"
   editor="" />
<tags
   ms.service="backup"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="07/01/2015"
   ms.author="jimpark"; "aashishr" />


The following limits apply to Azure Backup.

| Limit Identifier | Default Limit |
|---|---|
|Number of servers/machines that can be registered against each vault|50|
|Size of a data source for data stored in Azure vault storage|1.65 TB max<sup>1</sup>|
|Number of backup vaults that can be created in each Azure subscription|25|
|Number of times backup can be scheduled per day|3 per day for Windows Server/Client <br/> 2 per day for SCDPM|
|Number of recovery points that can be created|366<sup>2</sup>|
|Data disks attached to an Azure virtual machine for backup|5|

- <sup>1</sup>The 1.65TB limit does not apply to IaaS VM backup.
- <sup>2</sup>You can use any permutation to arrive at a number which is less than 366.
