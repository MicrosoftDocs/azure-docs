---
author: AlicjaKucharczyk
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
ms.date: 01/22/2024
ms.author: alkuchar
---

### Query Store and Azure Storage compatibility

Because of compatibility issues, you can't enable Query Store and Azure Storage extensions at the same time. To ensure proper functioning and avoid potential conflicts, enable only one of these extensions at a time.

* **To use Azure Storage**: Disable the query store by setting the parameter `pg_qs.query_capture_mode` to `NONE`. This parameter is dynamic, so you don't need to restart.

* **To use Query Store**: Disable the Azure Storage extension by issuing `DROP EXTENSION azure_storage;`. Additionally, remove Azure Storage from `shared_preload_libraries`. Restart your database server after this change.

These steps are necessary to prevent conflicts and to ensure that your system operates correctly. We're working to resolve these compatibility issues and will keep you informed of any updates.
