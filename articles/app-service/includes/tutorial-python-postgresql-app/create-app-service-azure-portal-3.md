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

On the **Create Web App** page, fill out the form as follows:

1. **Resource Group** &rarr; Select **Create new** and use a name of *msdocs-python-postgres-webapp-rg*.

1. **Name** &rarr; Use *msdocs-python-postgres-webapp-\<unique-id>*. The name must be unique across Azure with the web app's URL `https://<app-service-name>.azurewebsites.com`).

1. **Runtime stack** &rarr; **Python 3.9**

1. **Region** &rarr; Any Azure region near you.

1. **App Service Plan** &rarr; Select **Create new** under **Linux Plan** and use the name of *msdocs-python-postgres-webapp-plan*.

1. **App Service Plan** &rarr; Select **Change size** under **Sku and size** to select a different App Service plan.
