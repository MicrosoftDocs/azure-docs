
---
title: 'Tutorial: Deploy a Python Django or Flask web app with PostgreSQL'
description: Create a Python Django or Flask web app with a PostgreSQL database and deploy it to Azure. The tutorial uses either the Django or Flask framework and the app is hosted on Azure App Service on Linux.
ms.devlang: python
ms.topic: tutorial
ms.date: 11/30/2023
ms.author: msangapu
author: msangapu-msft
ms.custom: mvc, cli-validate, devx-track-python, devdivchpfy22, vscode-azure-extension-update-completed, AppS
---

2. Verify connection settings

For Flask:
1. Run the following Python script to generate a unique secret: `python -c 'import secrets; print(secrets.token_hex())'`. Copy the output value to use in the next step.
2. Back in the Configuration page, select New application setting. Name the setting `SECRET_KEY`. Paste the value from the previous step. Select OK.
3. Select Save.

For Django:
1. Back in the Configuration page, select New application setting. Name the setting `SECRET_KEY`. Paste the value from the previous step. Select OK.
2. Select Save.
