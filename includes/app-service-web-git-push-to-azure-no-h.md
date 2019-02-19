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

Back in the _local terminal window_, add an Azure remote to your local Git repository. Replace _&lt;deploymentLocalGitUrl-from-create-step>_ with the URL of the Git remote that you saved from [Create a web app](#create-a-web-app).

```bash
git remote add azure <deploymentLocalGitUrl-from-create-step>
```

Push to the Azure remote to deploy your app with the following command. When prompted for credentials by Git Credential Manager, make sure that you enter the credentials you created in Configure a deployment user, not the credentials you use to sign in to the Azure portal.

```bash
git push azure master
```

This command may take a few minutes to run. While running, it displays information similar to the following example:
