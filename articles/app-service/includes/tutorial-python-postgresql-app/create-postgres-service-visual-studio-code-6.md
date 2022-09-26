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

After the firewall rule allowing local access has been successfully added, create the `restaurant` database.

1. Select **Azure** icon the [activity bar](https://code.visualstudio.com/docs/getstarted/userinterface).

1. Select **Databases**.

1. Under your subscription, find the PostgreSQL Server you created (for example, *msdocs-python-postgres-webapp-db-\<unique-id>*), right-click and select **Create Database**.

1. Enter *restaurant* as the **Database Name**.

If you have trouble creating the database, the server may still be processing the firewall rule from the previous step. Wait a moment and try again.
