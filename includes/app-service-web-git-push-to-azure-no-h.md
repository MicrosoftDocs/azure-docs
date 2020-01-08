---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 02/02/2018
ms.author: cephalin
ms.custom: "include file"
---

Back in the local terminal window, add an Azure remote to your local Git repository. Replace *\<deploymentLocalGitUrl-from-create-step>* with the URL of the Git remote that you saved from [Create a web app](#create-a-web-app).

```bash
git remote add azure <deploymentLocalGitUrl-from-create-step>
```

Push to the Azure remote to deploy your app with the following command. When Git Credential Manager prompts you for credentials, make sure you enter the credentials you created in [Configure a deployment user](/azure/app-service/containers/tutorial-python-postgresql-app#configure-a-deployment-user), not the credentials you use to sign in to the Azure portal.

```bash
git push azure master
```

This command may take a few minutes to run. While running, it displays information similar to the following example:
