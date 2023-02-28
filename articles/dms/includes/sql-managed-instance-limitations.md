---
author: MashaMSFT
ms.service: dms
ms.topic: include
ms.date: 12/19/2022
ms.author: mathoma
---

- If migrating a single database, the database backups must be placed in a flat-file structure inside a database folder (including the container root folder), and the folders can't be nested, as it's not supported.
- If migrating multiple databases using the same Azure Blob Storage container, you must place backup files for different databases in separate folders inside the container.
- Overwriting existing databases using DMS in your target Azure SQL Managed Instance isn't supported.
- Configuring high availability and disaster recovery on your target to match source topology isn't supported by DMS.
- The following server objects aren't supported:
   - SQL Server Agent jobs
   - Credentials
   - SSIS packages
   - Server audit
- You can't use an existing self-hosted integration runtime created from Azure Data Factory for database migrations with DMS. Initially, the self-hosted integration runtime should be created using the Azure SQL migration extension in Azure Data Studio and can be reused for further database migrations.
- A single LRS job (created by DMS) can run for a maximum of 30 days. When this period expires, the job is automatically canceled thus your target database gets automatically deleted.