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

Once the database is created, configure access from your local environment to the PostgreSQL database server:

1. Open the **Command Palette** (Ctrl + Shift + P).

1. Search for select *PostgreSQL: Configure Firewall*.

1. Select a subscription if prompted.

1. Select the database you created above, for example *msdocs-python-postgres-webapp-db-\<unique-id>*. If the database name doesn't appear in the list, it's likely it hasn't finished being created.

1. Select **Yes** in the dialog box to add your IP address to the firewall rules of the PostgreSQL server.
