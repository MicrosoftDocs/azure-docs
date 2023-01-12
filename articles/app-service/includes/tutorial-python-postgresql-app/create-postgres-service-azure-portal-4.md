---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/25/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

On the **Flexible server** page, fill out the form as follows:

1. **Resource group** &rarr; Select and use a name of *msdocs-python-postgres-webapp-rg*.

1. **Server name** &rarr; Enter a name such as *msdocs-python-postgres-webapp-db-\<unique-id>*. The name must be unique across Azure with the database server's URL `https://<server-name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`.

1. **Region** &rarr; Same Azure region used for the Web App.

1. **Data source** &rarr; **None**

1. **Workload type** &rarr; **Production**

1. **Compute + storage** &rarr; Select **Configure server** to select a different Compute + storage plan, which is discussed below.

1. **Availability zone** &rarr; Keep the default (which is no preference).

1. **Version** &rarr; Keep the default (which is the latest version).
