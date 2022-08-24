---
title: View log streams in Azure Container Apps
description: View your container apps's log stream.
services: container-apps
author: cebundy
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 07/09/2022
ms.author: v-bcatherine
---

# View log streams in Azure Container Apps

While developing and troubleshooting your container app, you often want to see a container's logs in real-time.  Container Apps lets you view a stream of your container's `stdout` and `stderr` log messages using the Azure portal or the Azure CLI.

## Azure portal


1. Navigate to your container app in the Azure portal.

1. Select **Log stream** under the *Monitoring* section on the sidebar menu.

  For apps with more than one container, choose a container from the drop-down lists. When there are multiple revisions and replicas, first choose from the **Revision**, **Replica**, and then the **Container** drop-down lists.

After you select a container, you can view the log stream in the viewing pane. To save the log messages, you can copy and paste them into the editor of your choice.

:::image type="content" source="media/observability/log-stream.png" alt-text="Screenshot of Azure Container Apps Log stream page.":::

## Azure CLI

You can view container's application logs from the Azure CLI with the `az containerapp logs show` command.  The show command has the following options:

- View previous log entries via the `--tail` parameter.
- View a live stream with the `--follow` parameter. Use `CTRL/CMD-C` to stop the live stream.

For example, you can list the last 50 container log entries in a container app with a single revision, replica, and container using the following command.

# [Bash](#tab/bash)

```azurecli
az containerapp logs show \
  --name album-api \
  --resource-group album-api-rg \
  --tail 50
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp logs show `
  --name album-api `
  --resource-group album-api-rg `
  --tail 50
```

---

You can view a log stream from a container in a container app with multiple revisions, replicas, and containers by adding the `--revision`, `--replica`, `--container` parameters to the `az containerapp show` command.  

Use the `az containerapp revision list` command to get the revision, replica, and container names to use in the `az containerapp logs show` command.

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

Show the streaming container logs: 

# [Bash](#tab/bash)

```azurecli
az containerapp logs show \
  --name album-api \
  --resource-group album-api-rg \
  --revision album-api--v2 \
  --replica album-api--v2-5fdd5b4ff5-6mblw \
  --container album-api-container \
  --follow
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp logs show  `
  --name album-api `
  --resource-group album-api-rg `
  --revision album-api--v2 `
  --replica album-api--v2-5fdd5b4ff5-6mblw `
  --container album-api-container `
  --follow
```

---
