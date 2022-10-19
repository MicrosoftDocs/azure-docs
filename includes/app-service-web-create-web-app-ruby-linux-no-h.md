---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 07/10/2019
ms.author: cephalin
ms.custom: "include file, devx-track-azurecli"
---

Create a [web app](../articles/app-service/overview.md#app-service-on-linux) in the `myAppServicePlan` App Service plan. 

In the Cloud Shell, you can use the [`az webapp create`](/cli/azure/webapp) command. In the following example, replace `<app-name>` with a globally unique app name (valid characters are `a-z`, `0-9`, and `-`). The runtime is set to `RUBY|2.6.2`. To see all supported runtimes, run [`az webapp list-runtimes --os linux`](/cli/azure/webapp). 

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app-name> --runtime 'RUBY|2.6.2' --deployment-local-git
```

When the web app has been created, the Azure CLI shows output similar to the following example:

<pre>
Local git is configured with url of 'https://&lt;username&gt;@&lt;app-name&gt;.scm.azurewebsites.net/&lt;app-name&gt;.git'
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "&lt;app-name&gt;.azurewebsites.net",
  "deploymentLocalGitUrl": "https://&lt;username&gt;@&lt;app-name&gt;.scm.azurewebsites.net/&lt;app-name&gt;.git",
  "enabled": true,
  &lt; JSON data removed for brevity. &gt;
}
</pre>

You've created an empty new web app, with git deployment enabled.

> [!NOTE]
> The URL of the Git remote is shown in the `deploymentLocalGitUrl` property, with the format `https://<username>@<app-name>.scm.azurewebsites.net/<app-name>.git`. Save this URL as you need it later.
>
