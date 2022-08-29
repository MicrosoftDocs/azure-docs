---
title: Connect to a container console in Azure Container Apps
description: Connect to a container console in your container app.
services: container-apps
author: cebundy
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 08/25/2022
ms.author: v-bcatherine
---


# Connect to a container console in Azure Container Apps

Connecting to a container's console is useful when you want to troubleshoot your application inside a container.  Azure Container Apps lets you connect to a container's console using the Azure portal or the Azure CLI.

## Azure portal

Select **Console** in the **Monitoring** menu group from your container app page in the Azure portal.

* Select the revision, replica and container you want to connect to.

* You can choose to access your console via bash, sh, or a custom executable.  If you choose a custom executable, it must be available in the container.

:::image type="content" source="media/observability/console-ss.png" alt-text="Screenshot of Azure Container Apps Console page.":::

## Azure CLI

Use the `az containerapp exec` command to connect to a container console.  Select **Ctrl-D** to exit the console.

For example, connect to a container console in a container app with a single revision, replica, and container using the following command.  Replace the \<placeholders\> with your container app's values.

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

To connect to a container console in a container app with multiple revisions, replicas, and containers include the `--revision`, `--replica`, and `--container` arguments with the `az containerapp exec` command. 

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

Connect to the container console using the names from the `az containerapp revision list` command.

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