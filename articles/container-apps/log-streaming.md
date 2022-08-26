---
title: View log streams in Azure Container Apps
description: View your container app's log stream.
services: container-apps
author: cebundy
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 08/29/2022
ms.author: v-bcatherine
---

# View log streams in Azure Container Apps

While developing and troubleshooting your container app, you often want to see a container's logs in real-time.  Container Apps lets you view a stream of your container's `stdout` and `stderr` log messages using the Azure portal or the Azure CLI.

## Azure portal


1. Navigate to your container app in the Azure portal.
1. Select **Log stream** under the *Monitoring* section on the sidebar menu.
1. Select the Revision, Replica, and Container yoFu want to view the log stream for.  If your app has only one revision, replica, and container, you can skip this step.

    :::image type="content" source="media/observability/log-stream-ss.png" alt-text="Screenshot of Azure Container Apps Log Stream page.":::


After you select a container, a stream of application log data is display in the viewing pane.  To save the log messages, copy and paste them into the editor of your choice.

:::image type="content" source="media/observability/log-stream.png" alt-text="Screenshot of Azure Container Apps Log stream page.":::

## Azure CLI

You can view container's application logs from the Azure CLI with the `az containerapp logs show` command.  The show command has the following options:

- View previous log entries with the  `--tail` argument.
- View a live stream with the `--follow`argument. 
- Use `Ctrl/Cmd-C` to stop the live stream.

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

When your app has multiple active revisions, replicas, and containers, specify the container by including  `--revision`, `--replica`, and `--container` arguments in the `az containerapp logs show` command.

Run the `az containerapp revision list` command to get the revision, replica, and container names to use in the `az containerapp logs show` command. For example:

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

Run the `az container app show` command using the names from the `az containerapp revision list ` command output.  For example:

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

---

```

Enter **Ctrl-C** to stop the log stream.

> [!div class="nextstepaction"]
> [View log streams from the Azure portal](log-streaming.md)