---
title: Connect to a container console in Azure Container Apps
description: Connect to a container console in your container app.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 02/03/2025
ms.author: cshoe
---


# Connect to a container console in Azure Container Apps

Connecting to a container's console is useful when you want to troubleshoot your application inside a container. Azure Container Apps allows you to connect to a container's console using the Azure portal or Azure CLI.

## Azure portal

To connect to a container's console in the Azure portal, follow these steps.

1. In the Azure portal, select **Console** in the **Monitoring** menu group from your container app page.
1. Select the revision, replica, and container you want to connect to.
1. Choose to access your console via bash, sh, or a custom executable. If you choose a custom executable, it must be available in the container.

:::image type="content" source="media/observability/console-ss.png" alt-text="Screenshot of Azure Container Apps Console page.":::

## Azure CLI

To connect to a container console, Use the `az containerapp exec` command. To exit the console, select **Ctrl-D**.

For example, connect to a container console in a container app with a single container using the following command. Replace the \<PLACEHOLDERS\> with your container app's values.

# [Bash](#tab/bash)

```azurecli
az containerapp exec \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP>
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp exec `
  --name <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP>
```

---

To connect to a container console in a container app with multiple revisions, replicas, and containers include the  following parameters in the `az containerapp exec` command.

| Argument | Description |
|----------|-------------|
| `--revision` | The revision names of the container to connect to. |
| `--replica` | The replica name of the container to connect to. |
| `--container` | The container name of the container to connect to. |

You can get the revision names with the `az containerapp revision list` command. Replace the \<PLACEHOLDERS\> with your container app's values.

# [Bash](#tab/bash)

```azurecli
az containerapp revision list \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --query "[].name"
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp revision list `
  --name <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP> `
  --query "[].name"
```

---

Use the `az containerapp replica list` command to get the replica and container names. Replace the \<PLACEHOLDERS\> with your container app's values.

# [Bash](#tab/bash)

```azurecli
az containerapp replica list \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --revision <REVISION_NAME> \
  --query "[].{Containers:properties.containers[].name, Name:name}"
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp replica list `
  --name <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP> `
  --revision <REVISIONNAME> `
  --query "[].{Containers:properties.containers[].name, Name:name}"
```

---

Connect to the container console with the `az containerapp exec` command. Replace the \<PLACEHOLDERS\> with your container app's values.

# [Bash](#tab/bash)

```azurecli
az containerapp exec \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --revision <REVISION_NAME> \
  --replica <REPLICA_NAME> \
  --container <CONTAINER_NAME> 
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp exec `
  --name <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP> `
  --revision <REVISION_NAME> `
  --replica <REPLICA_NAME> `
  --container <CONTAINER_NAME> 
```

---

> [!div class="nextstepaction"]
> [View log streams from the Azure portal](log-streaming.md)
