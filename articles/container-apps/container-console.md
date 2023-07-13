---
title: Connect to a container console in Azure Container Apps
description: Connect to a container console in your container app.
services: container-apps
author: v-jaswel
ms.service: container-apps
ms.custom: event-tier1-build-2022, devx-track-azurecli
ms.topic: how-to
ms.date: 08/30/2022
ms.author: v-wellsjason
---


# Connect to a container console in Azure Container Apps

Connecting to a container's console is useful when you want to troubleshoot your application inside a container.  Azure Container Apps lets you connect to a container's console using the Azure portal or the Azure CLI.

## Azure portal

To connect to a container's console in the Azure portal, follow these steps.

1. Select **Console** in the **Monitoring** menu group from your container app page in the Azure portal.
1. Select the revision, replica and container you want to connect to.
1. Choose to access your console via bash, sh, or a custom executable.  If you choose a custom executable, it must be available in the container.

:::image type="content" source="media/observability/console-ss.png" alt-text="Screenshot of Azure Container Apps Console page.":::

## Azure CLI

Use the `az containerapp exec` command to connect to a container console.  Select **Ctrl-D** to exit the console.

For example, connect to a container console in a container app with a single container using the following command.  Replace the \<placeholders\> with your container app's values.

# [Bash](#tab/bash)

```azurecli
az containerapp exec \
  --name <ContainerAppName> \
  --resource-group <ResourceGroup>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp exec `
  --name <ContainerAppName> `
  --resource-group <ResourceGroup>
```

---

To connect to a container console in a container app with multiple revisions, replicas, and containers include the  following parameters in the `az containerapp exec` command.

| Argument | Description |
|----------|-------------|
| `--revision` | The revision names of the container to connect to. |
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

Connect to the container console with the `az containerapp exec` command. Replace the \<placeholders\> with your container app's values.

# [Bash](#tab/bash)

```azurecli
az containerapp exec \
  --name <ContainerAppName> \
  --resource-group <ResourceGroup> \
  --revision <RevisionName> \
  --replica <ReplicaName> \
  --container <ContainerName> 
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp exec `
  --name <ContainerAppName> `
  --resource-group <ResourceGroup> `
  --revision <RevisionName> `
  --replica <ReplicaName> `
  --container <ContainerName> 
```

---

> [!div class="nextstepaction"]
> [View log streams from the Azure portal](log-streaming.md)
