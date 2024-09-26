---
title: Connect to a container debug console in Azure Container Apps
description: Connect to a container debug console in your container app.
services: container-apps
author: fangjian0423
ms.service: azure-container-apps
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 09/18/2024
ms.author: fangjimmy
---


# Connect to a container debug console in Azure Container Apps

Azure Container Apps platform offers debug console to help you troubleshoot your application under the following circumstances:

- You can not connect to the target container when you use distroless image.
- If you only install JRE in the runtime image, there are no JDK troubleshooting tools like jcmd, jstack pre-installed in the image.
- When encounter networking issues, your image do not have debugging utilities to investigate them.

You can connect to debug console using the Azure CLI.


> [!NOTE]
> Debug Console will create a separate container, which will share underlying resource with connected container(If the debug console container already exists when you try to connect to, we will reuse the existing one instead of creating a new one. At most 1 debug console container will be created per replicae). If you do not need to use a existing debug console container any more, please make sure to enter **exit** or use **Ctrl-D** to explicitly exit.

> [!NOTE]
> If you encounter input missing in debug console, you can try to use **Ctrl-D** to exit and re-connect to debug console again.

## Azure CLI

To connect to a container debug console, Use the `az containerapp debug` command. To exit the console, enter **exit** or use **Ctrl-D**.

For example, connect to a container debug console in a container app with a single container using the following command. Replace the \<PLACEHOLDERS\> with your container app's values.

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

To connect to a container debug console in a container app with multiple revisions, replicas, and containers include the  following parameters in the `az containerapp debug` command.

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

```azurecli
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

```azurecli
az containerapp replica list `
  --name <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP> `
  --revision <REVISIONNAME> `
  --query "[].{Containers:properties.containers[].name, Name:name}"
```

---

Connect to the container debug console with the `az containerapp debug` command. Replace the \<PLACEHOLDERS\> with your container app's values.

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

## Built-in tools in Debug Console

We will pre-install below diagnostic tools to help you troubleshoot issues more easily in debug console.

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

If you want to install other tools, you can run `tdnf install <TOOL_NAME>` command. Replace the \<PLACEHOLDERS\> with your container app's values.

For example, install JDK in debug console in a container app using the following command:

```bash
tdnf install msopenjdk-17
```

---

> [!div class="nextstepaction"]
> [View log streams from the Azure portal](log-streaming.md)
