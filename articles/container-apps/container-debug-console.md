---
title: Connect to a container debug console in Azure Container Apps
description: Connect to a container debug console in your container app.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 05/29/2025
ms.author: cshoe
---

# Connect to a container debug console in Azure Container Apps

Azure Container Apps platform offers a debugging console to help you troubleshoot your application under the following circumstances:

- You can't connect to the target container when you use a container that only includes the application and its runtime dependencies, or a "distroless" image.
- When encounter networking issues, your images don't have debugging utilities to investigate them.

You can connect to debug console using the Azure CLI.

> [!NOTE]
> The debug console creates a separate container, which shares the underlying resources with the container where your app is running. If a debug container already exists, the debug console reuses the existing one instead of creating a new one. There is at most one running debug container per container app replica. If you don't need to keep a debug container running, enter **exit** or use **Ctrl/Cmd + D** in the debug console session.

## Azure CLI

To connect to a container the debug console, use the `az containerapp debug` command. To exit the console, enter **exit** or use **Ctrl/Cmd + D**.

For example, connect to a container debug console in a container app with a single container using the following command. Before you run this command, replace the `<PLACEHOLDERS>` with your container app's values.

# [Bash](#tab/bash)

```azurecli
az containerapp debug \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp debug `
  --name <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP>
```

---

To connect to a container debug console in a container app with multiple revisions, replicas, and containers, include the following parameters in the `az containerapp debug` command.

| Argument | Description |
|----------|-------------|
| `--revision` | The revision name of the container to debug. |
| `--replica` | The replica name of the container to debug. |
| `--container` | The container name of the container to debug. |

You can get the revision names with the `az containerapp revision list` command.  Before you run this command, replace the `<PLACEHOLDERS>` with your container app's values.

# [Bash](#tab/bash)

```azurecli
az containerapp revision list \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --query "[].name"
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp revision list `
  --name <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP> `
  --query "[].name"
```

---

Use the `az containerapp replica list` command to get the replica and container names.  Before you run this command, replace the `<PLACEHOLDERS>` with your container app's values.

# [Bash](#tab/bash)

```azurecli
az containerapp replica list \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --revision <REVISION_NAME> \
  --query "[].{Containers:properties.containers[].name, Name:name}"
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp replica list `
  --name <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP> `
  --revision <REVISIONNAME> `
  --query "[].{Containers:properties.containers[].name, Name:name}"
```

---

Connect to the container debug console with the `az containerapp debug` command.  Before you run this command, replace the `<PLACEHOLDERS>` with your container app's values.

# [Bash](#tab/bash)

```azurecli
az containerapp debug \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --revision <REVISION_NAME> \
  --replica <REPLICA_NAME> \
  --container <CONTAINER_NAME> 
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp debug `
  --name <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP> `
  --revision <REVISION_NAME> `
  --replica <REPLICA_NAME> `
  --container <CONTAINER_NAME> 
```

---

## Built-in tools in the debug console

The following diagnostic tools are preinstalled to the debug console to help you troubleshoot issues:

- [ip-utils](https://github.com/iputils/iputils)
- [net-tools](https://github.com/ecki/net-tools)
- [procps](https://github.com/warmchang/procps)
- [lsof](https://github.com/lsof-org/lsof)
- [util-linux](https://github.com/util-linux/util-linux)
- [nc](https://en.wikipedia.org/wiki/Netcat)
- [wget](https://github.com/mirror/wget)
- [openssl](https://github.com/openssl/openssl)
- [traceroute](https://en.wikipedia.org/wiki/Traceroute)
- [ca-certificates](https://fedoraproject.org/wiki/CA-Certificates)
- [bind-utils](https://www.linuxfromscratch.org/~ken/inkscape-python-deps/blfs-book-sysv/basicnet/bind-utils.html)
- [tcpping](http://www.vdberg.org/~richard/tcpping.html)

If you want to install other tools, run the `tdnf install -y <TOOL_NAME>` command. Before you run this command, replace the `<PLACEHOLDERS>` with your container app's values.

For example, install JDK in the debug console using the following command:

```bash
tdnf install -y msopenjdk-17
```

---

## Accessing a container's file system in the debug console

By default, the debug console runs as the root user. You can access your container's file system through the `/proc/1/cwd/` directory. If your container doesn't run as the root user, run the following command before accessing the `/proc/1/cwd/` directory, or you'll get a permission denied error.

```bash
switch-user
```

For more information, see the following Linux man pages:

- [pid_namespaces](https://www.man7.org/linux/man-pages/man7/pid_namespaces.7.html)
- [/proc/pid/cwd](https://www.man7.org/linux/man-pages/man5/proc_pid_cwd.5.html)

---

> [!div class="nextstepaction"]
> [View log streams from the Azure portal](log-streaming.md)
