---
title: View log streams in Azure Container Apps
description: View your container app's log stream.
services: container-apps
author: cebundy
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 08/30/2022
ms.author: v-bcatherine
---

# View log streams in Azure Container Apps

While developing and troubleshooting your container app, it's important to see a container's logs in real-time.  Container Apps lets you view a stream of your container's `stdout` and `stderr` log messages through the Azure portal or the Azure CLI.

## Azure portal

View a container app's log stream in the Azure portal with these steps.

1. Navigate to your container app in the Azure portal.
1. Select **Log stream** under the *Monitoring* section on the sidebar menu.
1. If you have multiple revisions, replicas, or containers, you can select from the pull-down menus to choose a container.  If your app has only one container, you can skip this step.

After a container is selected, the log stream is displayed in the viewing pane.

:::image type="content" source="media/observability/log-stream.png" alt-text="Screenshot of Azure Container Apps Log stream page.":::

## Azure CLI

You can view a container's log stream from the Azure CLI with the `az containerapp logs show` command.  You can use these arguments to:

- View previous log entries with the  `--tail` argument.
- View a live stream with the `--follow`argument. 

Use `Ctrl/Cmd-C` to stop the live stream.

For example, you can list the last 50 container log entries in a container app with a single container using the following command.

This example live streams a container's log entries.

# [Bash](#tab/bash)

```azurecli
az containerapp logs show \
  --name <ContainerAppName> \
  --resource-group <ResourceGroup> \
  --tail 50
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp logs show `
  --name <ContainerAppName> `
  --resource-group <ResourceGroup> `
  --tail 50
```

---

To connect to a container console in a container app with multiple revisions, replicas, and containers include the  following parameters in the `az containerapp logs show` command.

| Argument | Description |
|----------|-------------|
| `--revision` | The revision name of the container to connect to. |
| `--replica` | The replica name of the container to connect to. |
| `--container` | The container name of the container to connect to. |

You can get the revision names with the `az containerapp revision list` command.  Replace the \<placeholders\> with your container app's values.

# [Bash](#tab/bash)

```azurecli
az containerapp revision list \
  --name <ContainerAppName> \
  --resource-group <ResourceGroup> \
  --query "[].name"
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision list `
  --name <ContainerAppName> `
  --resource-group <ResourceGroup> `
  --query "[].name"
```

---

Use the `az containerapp replica list` command to get the replica and container names. Replace the \<placeholders\> with your container app's values.

# [Bash](#tab/bash)

```azurecli
az containerapp replica list \
  --name <ContainerAppName> \
  --resource-group <ResourceGroup> \
  --revision <RevisionName> \
  --query "[].{Containers:properties.containers[].name, Name:name}"
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp replica list `
  --name <ContainerAppName> `
  --resource-group <ResourceGroup> `
  --revision <RevisionName> `
  --query "[].{Containers:properties.containers[].name, Name:name}"
```

---

Stream the container logs with the `az container app show` command. Replace the \<placeholders\> with your container app's values.


# [Bash](#tab/bash)

```azurecli
az containerapp logs show \
  --name <ContainerAppName> \
  --resource-group <ResourceGroup> \
  --revision <RevisionName> \
  --replica <ReplicaName> \
  --container <ContainerName> \
  --follow
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp logs show  `
  --name <ContainerAppName> `
  --resource-group <ResourceGroup> `
  --revision <RevisionName> `
  --replica <ReplicaName> `
  --container <ContainerName> `
  --follow
```

---


Enter **Ctrl-C** to stop the log stream.

> [!div class="nextstepaction"]
> [View log streams from the Azure portal](log-streaming.md)