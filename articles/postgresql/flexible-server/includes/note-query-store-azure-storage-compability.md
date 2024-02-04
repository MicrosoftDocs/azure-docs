---
author: AlicjaKucharczyk
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
ms.date: 01/22/2024
ms.author: alkuchar
---
### Query store and Azure storage compatibility

Due to compatibility issues, the Query store and Azure storage extensions can't be enabled at the same time. Users are advised to enable only one of these extensions at a time to ensure proper functioning and avoid potential conflicts.
 
* **To use Azure storage**: Disable the query store by setting the parameter `pg_qs.query_capture_mode` to `NONE`. This parameter is dynamic, so no restart is needed.
 
* **To use Query store**: Disable the Azure storage extension by issuing `DROP EXTENSION azure_storage;`. Additionally, remove Azure storage from the `shared_preload_libraries`. Restart your database server after this change.
 
These steps are necessary to prevent conflicts and ensure your system operates correctly. We're working to resolve these compatibility issues and will keep you informed of any updates in future releases.