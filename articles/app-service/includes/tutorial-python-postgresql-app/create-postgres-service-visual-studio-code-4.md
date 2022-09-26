---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/28/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['vscode-azure-tools']
ms.custom: devx-track-python
---

In the VS Code prompts, enter the following information:

1. **Server name** &rarr; Enter a name for the database server that's unique across all Azure (the database server's URL becomes `https://<server-name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. For example: *msdocs-python-postgres-webapp-db-\<unique-id>*.

1. **Select the Postgres SKU and options** &rarr; Select **B1ms Basic**, 1 vCore, 2GiB Memory, 32GB storage.

1. **Administrator Username** and **Administrator Password** &rarr; Enter credentials for an administrator account on the database server. Record these credentials as you'll need them later in this tutorial.

1. **Select a resource group** &rarr; Select the resource group you created the App Service in, for example *msdocs-python-postgres-webapp-rg*.

1. **Select a location** &rarr; Select the same location as the App Service.
