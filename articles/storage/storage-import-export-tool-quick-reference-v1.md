---
title: "Quick Reference for Frequently Used Commands for Import Jobs"
ms.custom: na
ms.date: 05/25/2015
ms.prod: azure
ms.reviewer: na
ms.service: storage
ms.suite: na
ms.tgt_pltfrm: na
ms.topic: reference
ms.assetid: 1e6fe66a-083d-429f-a79f-c4cdca75877d
caps.latest.revision: 8
author: tamram
manager: adinah
translation.priority.mt: 
  - de-de
  - es-es
  - fr-fr
  - it-it
  - ja-jp
  - ko-kr
  - pt-br
  - ru-ru
  - zh-cn
  - zh-tw
---
# Quick Reference for Frequently Used Commands for Import Jobs
This section provides a quick references for some frequently used commands. For detailed usage, see [Preparing Hard Drives for an Import Job](../importexport/Preparing-Hard-Drives-for-an-Import-Job.md).  
  
## Copy a Single Directory to a Hard Drive  
 Here is a sample command to copy a single source directory to a hard drive that hasn’t been yet been encrypted with BitLocker:  
  
```  
WAImportExport.exe PrepImport /j:FirstDrive.jrn /id:movies /logdir:c:\logs /sk:8ImTigJhIwvL9VEIQKB/zbqcXbxrIHbBjLIfOt0tyR98TxtFvUM/7T0KVNR6KRkJrh26u5I8hTxTLM2O1aDVqg== /t:x /format /encrypt /srcdir:d:\Movies /dstdir:entertainment/movies/  
```  
  
## Copy Two Directories to a Hard Drive  
 To copy two source directories to a drive, you will need two commands.  
  
 The first command specifies the log directory, storage account key, target drive letter and `format/encrypt` requirements, in addition to the common parameters:  
  
```  
WAImportExport.exe PrepImport /j:FirstDrive.jrn /id:movies /logdir:c:\logs /sk:8ImTigJhIwvL9VEIQKB/zbqcXbxrIHbBjLIfOt0tyR98TxtFvUM/7T0KVNR6KRkJrh26u5I8hTxTLM2O1aDVqg== /t:x /format /encrypt /srcdir:d:\Movies /dstdir:entertainment/movies/  
```  
  
 The second command specifies the journal file, a new session ID, and the source and destination locations:  
  
```  
WAImportExport.exe PrepImport /j:FirstDrive.jrn /id:music /srcdir:d:\Music /dstdir:entertainment/music/  
```  
  
## Copy a Large File to a Hard Drive in a Second Copy Session  
 Here is a sample command that copies a single large file to a drive that has been prepared in a previous copy session:  
  
```  
WAImportExport.exe PrepImport /j:FirstDrive.jrn /id:dvd /srcfile:d:\dvd\favoritemovie.vhd /dstblob:dvd/favoritemovie.vhd  
```  
  
## See Also  
 [Sample Workflow to Prepare Hard Drives for an Import Job](../importexport/Sample-Workflow-to-Prepare-Hard-Drives-for-an-Import-Job.md)