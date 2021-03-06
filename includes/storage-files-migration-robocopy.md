---
title: Map a folder structure to an Azure File Sync topology
description: Map an existing file and folder structure to Azure file shares for use with Azure File Sync. A common text block, shared across migration docs.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 2/20/2020
ms.author: fauhse
ms.subservice: files
---

```console
Robocopy /MT:16 /NP /NFL /NDL /B /MIR /IT /COPY:DATSO /COPY:DATSO /DCOPY:DAT /UNILOG:<FilePathAndName> <SourcePath> <Dest.Path> 
```

| Switch              | Meaning |
|---------------------|---------|
| /MT                 | Allows for RoboCopy to run multi-threaded. Default is 8, and the maximum is 128. Match this to your processor core count and thread count per core. Consider if cores need to be reserved for other tasks a production server may have. |
| /NP                 | Specifies that the progress of the copying operation (the number of files or directories copied so far) will not be displayed. Displaying the progress significantly lowers copy performance. |
| /NFL                | Specifies that file names aren't logged. Improves copy performance. |
| /NDL                | Specifies that directory names aren't logged. Improves copy performance. |
| /B                  | Runs RoboCopy in the same mode a backup application would use. It allows RoboCopy to move files that the current user doesn't have permissions to. |
| /MIR                | *Mirror source to target* allows RoboCopy to only have to copy deltas between source and target. Empty subdirectories will be copied. Items (files or folders) that have changed or do not exist on the target will be copied. Items that exist on the target but not on the source will be purged (deleted) from the target. This switch makes it imperative that the file and folder structure of source and target are congruent when a RoboCopy job is used to "catch up" a target with changes that have happened on the source. If you are not careful, using this switch could lead to large scale deletes and recopies due to a mismatch in directory levels between source and target. |
| /IT                 | Ensures fidelity is preserved in certain mirror scenarios.</br>*Example* - If between two RoboCopy runs a file experiences an ACL change and an attribute update: for instance it is marked *hidden*. Without /IT the ACL change can be missed by RoboCopy and thus not transferred to the target location. |
|/COPY:copyflag[s]    | Fidelity of the file copy (default if not specified is /COPY:DAT), copy flags: `D`=Data, `A`=Attributes, `T`=Timestamps, `S`=Security=NTFS ACLs, `O`=Owner information, `U`=A<u>u</u>diting information. Auditing information cannot be stored in an Azure file share. |
| /DCOPY:copyflag[s]  | Fidelity for the copy of directories (default if not specified is /DCOPY:DA), copy flags: `D`=Data, `A`=Attributes, `T`=Timestamps. |
| /UNILOG:<file name> | Outputs status to LOG file as UNICODE (overwrites existing log). |
| /LFSM               | **only for targets with tiered storage**</br>Using /LFSM requests RoboCopy to operate in 'low free space mode'. This switch is only useful for targets with tiered storage, that may run out of local capacity before RoboCopy can finish. This was added  specifically for use with an Azure File Sync cloud tiering enabled target. It can be used independent of Azure File Sync. In this mode, RoboCopy will pause whenever a file copy would cause the destination volume's free space to go below a 'floor' value, which can be explicitly specified by the LFSM:n\[KMG\] form of the flag. If /LFSM is specified with no explicit floor value, the floor is set to ten percent of the destination volume's size. Low free space mode is incompatible with /MT, /EFSRAW, /B, and /ZB. |
| /Z                  | **careful use**</br>Copies files in restart mode, use is only recommended in an unstable network environment. This option significantly decreases copy performance due to additional logging. |
| /ZB                 | **careful use**</br>Uses restart mode. If access is denied, this option uses backup mode. This option significantly decreases copy performance due to checkpointing. |
   