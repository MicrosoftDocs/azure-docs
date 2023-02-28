---
author: MashaMSFT
ms.service: dms
ms.topic: include
ms.date: 01/25/2023
ms.author: mathoma
---

- If migrating a single database, the database backups must be placed in a flat-file structure inside a database folder (including container root folder), and the folders can't be nested, as it's not supported.
- If migrating multiple databases using the same Azure Blob Storage container, you must place backup files for different databases in separate folders inside the container.
- Overwriting existing databases using DMS in your target SQL Server on Azure Virtual Machine isn't supported.
- Configuring high availability and disaster recovery on your target to match source topology isn't supported by DMS.
- The following server objects aren't supported:
   - SQL Server Agent jobs
   - Credentials
   - SSIS packages
   - Server audit

- You can't use an existing self-hosted integration runtime created from Azure Data Factory for database migrations with DMS. Initially, the self-hosted integration runtime should be created using the Azure SQL migration extension in Azure Data Studio and can be reused for further database migrations.
- VM with SQL Server 2008 and below as target versions aren't supported when migrating to SQL Server on Azure Virtual Machines.
- If you're using a VM with SQL Server 2012 or SQL Server 2014, you need to store your source database backup files on an Azure Storage Blob Container instead of using the network share option. Store the backup files as page blobs since block blobs are only supported in SQL 2016 and after.
- You must make sure the SQL IaaS Agent Extension in the target Azure Virtual Machine is in **Full mode** instead of Lightweight mode.
- SQL IaaS Agent Extension  only supports management of Default Server Instance or Single Named Instance,
- There is a temporary limit of 80 databases per target Azure Virtual Machine. A workaround to break the limit (reset the counter) is to Uninstall and Reinstall SQL IaaS Agent Extension in the target Azure Virtual Machine.
- Apart from configuring the Networking/Firewall of your Storage Account to allow your VM to access backup files, you also need to configure the Networking/Firewall of your VM to allow outbound connection to your storage account.
