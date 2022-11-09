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

While Azure Spring Apps tries to offer managed troubleshooting approaches as much as possible, it may not be sufficient sometimes as some customers would like to: 

* Directly leverage the JDK tools. 
* Diagnose against an app’s backing services in terms of network connection, API call latency and etc for both VNET and non-VNET instances. 
* Diagnosis of storage (capacity and performance) and CPU/memory 

This feature enable you to access the shell environment inside your application instances and do some advanced troubleshooting.

## Prerequisites
* Azure CLI and Spring Apps extension are installed.
* App already deployed.
* If Custom Container is deployed, please ensure a shell program is included. Default to `/bin/sh`.

## Assign an Azure role

Before connecting to the app instances, you must be granted the role "Azure Spring Apps Connect Role" because it requires a new Data Action permission `Microsoft.AppPlatform/Spring/apps/deployments/connect/action`. It can be achieved by the following command:

```azurecli
az role assignment create --role 'Azure Spring Apps Connect Role' --scope '<Resource id of your service instance>' --assignee '<your identity>'
```

## Connect with CLI subcommand `spring app connect`

If your app contains only one instance, simply run:
```
az spring app connect -s <Your_Service_instance> -g <Resource_group> -n <App_name> 
```

Otherwise must specify the instance with `-i`:
```
az spring app connect -s <Your_Service_instance> -g <Resource_group> -n <App_name> --i <Instance_name>
```

To specify another deployment of the app:
```
az spring app connect -s <Your_Service_instance> -g <Resource_group> -n <App_name> -d green
```

By default, it will be launched with `/bin/sh` bundled in the base image of the container. You can switch to another bundled shell `/bin/bash` by:
```
az spring app connect -s <Your_Service_instance> -g <Resource_group> -n <App_name> --shell-cmd /bin/bash
```
Also, if your app is deployed with a custom image and custom shells, you can specify the shell with `--shell-cmd` as well.

## Troubleshooting
After connecting successfully, you can start to perform the troubleshooting. For example, check the status of the heap memory and GC:

Find the pid of the java process, which is usually `1`:
```
jps
```
![jps-result](./media/how-to-connect-to-app-instance-for-troubleshooting/jps-result.png)

And then run the jdk tool to check the result:
```
jstat -gc 1
```
![jstat-result](./media/how-to-connect-to-app-instance-for-troubleshooting/jstat-result.png)

## Disconnect

When the troubleshooting is done, you can disconnect from the app instance by running `exit` or pressing `Ctrl+d` simply.

## Pre-installed tools

The pre-installed tools includes some common tools as the following:

* lsof - list open files
* top - display system summary information and current utilization
* ps - get a snapshot of the running process
* netstat - print network connections, interface statistics
* nslookup - query Internet name servers interactively
* ping - the ping
* nc - arbitrary TCP and UDP connections and listens
* wget - The non-interactive network downloader
* df - free of disk space

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
