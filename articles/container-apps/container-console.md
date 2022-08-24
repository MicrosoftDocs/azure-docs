---
title: Connect to a container console in Azure Container Apps
description: Connect to a container console in your container app.
services: container-apps
author: cebundy
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 07/29/2022
ms.author: v-bcatherine
---


# Connect to a container console in Azure Container Apps

Connecting to a container's console is useful when you want to troubleshoot your application inside a container.  Azure Container Apps lets you connect to a container's console using the Azure portal or the Azure CLI.

## Connect though the Azure portal

Select **Console** in the **Monitoring** menu group from your container app page in the Azure portal. When your app has more than one container, choose a container from the drop-down list. When there are multiple revisions and replicas, first choose from the **Revision**, **Replica**, and then the **Container** drop-down lists.

You can choose to access your console via bash, sh, or a custom executable.  If you choose a custom executable, it must be available in the container.

:::image type="content" source="media/observability/console-ss.png" alt-text="Screenshot of Azure Container Apps Console page.":::

## Connect via the Azure CLI

Use the `az containerapp exec` command to connect to a container console.  Select Ctrl-D to exit the console.

For example, you can connect to a container console in a container app with a single revision, replica, and container using the following command.

# [Bash](#tab/bash)

```azurecli
az containerapp exec \
  --name album-api \
  --resource-group album-api-rg
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp exec `
  --name album-api `
  --resource-group album-api-rg
```

---

To connect to a container console in a container app with multiple revisions, replicas, and containers include the `--revision`, `--replica`, and `--container` arguments in the `az containerapp exec` command. 

Use the `az containerapp revision list` command to get the revision, replica and container names to use in the `az containerapp exec` command.

# [Bash](#tab/bash)

```azurecli
az containerapp revision list \
  --name album-api \
  --resource-group album-api-rg
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision list `
  --name album-api `
  --resource-group album-api-rg
```

---

Connect to the container console.

# [Bash](#tab/bash)

```azurecli
az containerapp exec \
  --name album-api \
  --resource-group album-api-rg \
  --revision album-api--v2 \
  --replica album-api--v2-5fdd5b4ff5-6mblw \
  --container album-api-container 
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp exec `
  --name album-api `
  --resource-group album-api-rg `
  --revision album-api--v2 `
  --replica album-api--v2-5fdd5b4ff5-6mblw `
  --container album-api-container
```

---

> [!div class="nextstepaction"]
> [View log streams from the Azure portal](log-streaming.md)