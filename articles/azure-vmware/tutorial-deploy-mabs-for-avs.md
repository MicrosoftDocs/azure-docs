---
title: Tutorial - 
description: Learn to create and configure 
ms.topic: tutorial
ms.date: 05/04/2020
---

<details><summary><b>To use an existing instance of SQL Server</b></summary><p>
    If you wish to use your own SQL server, the supported versions are SQL Server 2014 SP1 or higher, 2016 and 2017. All SQL Server versions should be Standard or Enterprise 64-bit. Azure Backup Server will not work with a remote SQL Server instance. The instance being used by Azure Backup Server needs to be local. If you are using an existing SQL server for MABS, the MABS setup only supports the use of named instances of SQL server.
   </p>
   <p><b>Manual configuration</b></p>
   <p>When you use your own instance of SQL, make sure you add builtin\Administrators to sysadmin role to master DB.</p>
   <p><b>SSRS Configuration with SQL 2017</b></p>
   <p>When you are using your own instance of SQL 2017, you need to manually configure SSRS. After SSRS configuration, ensure that IsInitialized property of SSRS is set to True. When this is set to True, MABS assumes that SSRS is already configured and will skip the SSRS configuration.</p>
   </details>