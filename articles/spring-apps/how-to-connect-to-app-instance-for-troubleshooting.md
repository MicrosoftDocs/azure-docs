---
title:  Connect to an app instance for troubleshooting
description: Learn how to connect to an app instance in Azure Spring Apps for troubleshooting.
author: karlerickson
ms.author: xiangy
ms.service: spring-apps
ms.topic: article
ms.date: 11/09/2021
ms.custom: devx-track-java, devx-track-azurecli
---

# Connect to an app instance for troubleshooting

Although Azure Spring Apps offers a variety of managed troubleshooting approaches, you may want to do advanced troubleshooting using the shell environment. For example, you may want to accomplish the following troubleshooting tasks:

- Directly leverage Java Development Kit (JDK) tools.
- Diagnose against an app’s back-end services for network connection and API call latency for both virtual-network and non-virtual-network instances.
- Diagnose storage capacity and performance and CPU/memory issues.

This article describes how to access the shell environment inside your application instances to do advanced troubleshooting.

## Prerequisites

- [Azure CLI](/cli/azure/install-azure-cli) with the Azure Spring Apps extension. Use the following command to remove previous versions and install the latest extension. If you previously installed the spring-cloud extension, uninstall it to avoid configuration and version mismatches.

  ```azurecli
  az extension remove --name spring
  az extension add --name spring
  az extension remove --name spring-cloud
  ```

- A deployed application in Azure Spring Apps.
- If you have deployed a custom container, a shell program. The default is `/bin/sh`.

## Assign an Azure role

Before connecting to an app instance, you must be granted the role *Azure Spring Apps Connect Role*. Connecting to an app instance it requires the data action permission `Microsoft.AppPlatform/Spring/apps/deployments/connect/action`.

Use the following command to assign the *Azure Spring Apps Connect Role* role:

```azurecli
az role assignment create \
    --role 'Azure Spring Apps Connect Role' \
    --scope '<service-instance-resource-id>' \
    --assignee '<your-identity>'
```

## Connect to an app instance

If your app contains only one instance, use the following command to connect to the instance:

```azurecli
az spring app connect \
    --service <your-service-instance> \
    --resource-group <your-resource-group> \
    --name <app-name> 
```

Otherwise, use the following command to specify the instance:

```azurecli
az spring app connect \
    --service <your-service-instance> \
    --resource-group <your-resource-group> \
    --name <app-name> \
    --instance <instance_name>
```

Use the following command to specify another deployment of the app:

```azurecli
az spring app connect \
    --service <your-service-instance> \
    --resource-group <your-resource-group> \
    --name <app-name> \
    --deployment green
```

By default, Azure Spring Apps launches the app instance with `/bin/sh` bundled in the base image of the container. Use the following command to switch to another bundled shell such as `/bin/bash`:

```azurecli
az spring app connect \
    --service <your-service-instance> \
    --resource-group <your-resource-group> \
    --name <app-name> \
    --shell-cmd /bin/bash
```

You can also use the `--shell-cmd` parameter to specify a shell if your app is deployed with a custom image and custom shells.

## Troubleshooting

After connecting successfully, you can start to perform the troubleshooting. For example, check the status of the heap memory and GC:

Find the pid of the java process, which is usually `1`:

```azurecli
jps
```
![jps-result](./media/how-to-connect-to-app-instance-for-troubleshooting/jps-result.png)

And then run the jdk tool to check the result:

```azurecli
jstat -gc 1
```

![jstat-result](./media/how-to-connect-to-app-instance-for-troubleshooting/jstat-result.png)

## Disconnect

When the troubleshooting is done, you can disconnect from the app instance by running `exit` or pressing `Ctrl+d` simply.

## Pre-installed tools

The pre-installed tools includes some common tools as the following:

- lsof - list open files
- top - display system summary information and current utilization
- ps - get a snapshot of the running process
- netstat - print network connections, interface statistics
- nslookup - query Internet name servers interactively
- ping - the ping
- nc - arbitrary TCP and UDP connections and listens
- wget - The non-interactive network downloader
- df - free of disk space

As well as the JDK-bundled tools such as: `jps`, `jcmd`, `jstat` and etc.

The available tools depends on the tier of your service and deployment type of the application: 

| Tier | Deployment Type | Common tools | JDK tools | Notes |
| -- | -- | -- | -- | -- |
| Basic / Standard tier | Source code / Jar | Y | Y (for java workloads only)  | |
| Basic / Standard tier | Custom Image | N | N | Up to your installed toolset |
| Enterprise Tier | Source code / Artifacts | Y (for full OS stack)<br>N (for base OS stack) | Y (for java workloads only) | Depends on the os stack of your builder |
| Enterprise Tier | Custom Image | N | N | Up to your installed toolset |

## Limitations

The app is running as a non-root user, so you can't execute some actions requiring root permission, including install new tools by the system package manager `apt / yum`.
Also, some of the linux capabilities are prohibited, so those tools that need some special privileges don't work (e.g. `tcpdump`).
