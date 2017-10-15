---
title: Use Draft with Azure Container Service and Azure Container Registry | Microsoft Docs
description: Create an ACS Kubernetes cluster and an Azure Container Registry to create your first application in Azure with Draft.
services: container-service
documentationcenter: ''
author: squillace
manager: gamonroy
editor: ''
tags: draft, helm, acs, azure-container-service
keywords: Docker, Containers, microservices, Kubernetes, Draft, Azure


ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/14/2017
ms.author: rasquill
ms.custom: mvc
---

# Use Draft with Azure Container Service and Azure Container Registry to build and deploy an application to Kubernetes

[Draft](https://aka.ms/draft) is an open-source tool that makes it easy to develop container-based applications and deploy them to Kubernetes clusters without knowing much about Docker and Kubernetes. Using tools like Draft let you and your teams focus on building the application with Kubernetes, not paying as much attention to infrastructure.

You can use Draft with any Docker image registry and any Kubernetes cluster, including locally. This tutorial shows how to use AKS with Kubernetes and ACR to create a live but secure developer pipeline in Kubernetes using Draft, and how to use Azure DNS to expose that developer pipeline for others to see at a domain.

## Prerequisites

The steps detailed in this document assume that you have created an AKS Kubernetes cluster and have established a kubectl connection with the cluster. If you need these items see, the [AKS Kubernetes quickstart](./kubernetes-walkthrough.md).

You will also need an Azure Container Registry. For instructions on deploying an ACR instance, see the [Azure Container Registry Quickstart](../container-registry/container-registry-get-started-azure-cli.md).


## Install Helm

The Helm CLI is a client that runs on your development system and allows you to start, stop, and manage applications with Helm charts. 

To install the Helm CLI on a Mac use `brew`. For additional installation options see, [Installing Helm](https://github.com/kubernetes/helm/blob/master/docs/install.md).
 
```console
brew install kubernetes-helm
```

Output:

```console
==> Downloading https://homebrew.bintray.com/bottles/kubernetes-helm-2.6.2.sierra.bottle.1.tar.gz
######################################################################## 100.0%
==> Pouring kubernetes-helm-2.6.2.sierra.bottle.1.tar.gz
==> Caveats
Bash completion has been installed to:
  /usr/local/etc/bash_completion.d
==> Summary
🍺  /usr/local/Cellar/kubernetes-helm/2.6.2: 50 files, 132.4MB
```

## Install Draft

The Draft CLI is a client that runs on your development system and allows you to quicky deploy code into a Kubernetes cluster.

To install the Draf CLI on a Mac use `brew`. For additional installation options see, the [Draft Install guide](https://github.com/Azure/draft/blob/master/docs/install.md).

```console
brew install draft
```

## Configure Draft

When configuring Draft a container registry needs to be specified. In this example Azure Container Registry is used. Run the following command to get name and login server name of the ACR instance.

Update the command with the resource group of your ACR instance.

```console
az acr list --resource-group <resource group> --query "[].{Name:name,LoginServer:loginServer}" --output table
```

The ACR instance password is also needed. Run the following command to return the ACR password.

Update the command with the name of the ACR instance.

```console
az acr credential show --name <acr name> --query "passwords[0].value" --output table
```

Initialize Draft.

```console
draft init
```

Output:

```console
Creating pack go...
Pack go already exists. Skipping!
Creating pack java...
Pack java already exists. Skipping!
Creating pack javascript...
Pack javascript already exists. Skipping!
Creating pack gradle...
Pack gradle already exists. Skipping!
Creating pack csharp...
Pack csharp already exists. Skipping!
Creating pack php...
Pack php already exists. Skipping!
Creating pack python...
Pack python already exists. Skipping!
Creating pack ruby...
Pack ruby already exists. Skipping!
$DRAFT_HOME has been configured at /usr/local/etc/draft.
```

During this process you will be prompted for the container registry credentials. When using an Azure Container Registry, the registry URL is the ACR login server, the username is the ACR name, and the password is the ACR password.

```console
1. Enter your Docker registry URL (e.g. docker.io/myuser, quay.io/myuser, myregistry.azurecr.io): myacr007.azurecr.io
2. Enter your username: myACR007
3. Enter your password:
```

Once complete, Draft will be configired in the AKS cluster and is ready to use.

```console
Draft has been installed into your Kubernetes Cluster.
Happy Sailing!
```

## Build and deploy an application    

```console
git clone https://github.com/Azure/draft
```

```console
cd draft/examples/java/
```

```console
draft create
```

Output:

```console
--> Draft detected the primary language as Java with 92.205567% certainty.
--> Ready to sail
```

```console
draft up
```

Output:

```console
Draft Up Started: 'open-jaguar'
open-jaguar: Building Docker Image: SUCCESS ⚓  (28.0342s)
open-jaguar: Pushing Docker Image: SUCCESS ⚓  (7.0647s)
open-jaguar: Releasing Application: SUCCESS ⚓  (4.5056s)
open-jaguar: Build ID: 01BW3VVNZYQ5NQ8V1QSDGNVD0S
```

## Securely view your application

Your container is now running in AKS. To view it, use the `draft connect` command, which creates a secured connection to the cluster's IP with a specific port for your application so that you can view it locally. If successful, look for the URL to connect to your app on the first line after the **SUCCESS** indicator.


```console
draft connect
```

Output:

```
Connecting to your app...SUCCESS...Connect to your app on localhost:46143
Starting log streaming...
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
== Spark has ignited ...
>> Listening on 0.0.0.0:4567
```

In the preceding example, you could type `curl -s http://localhost:46143` to receive the reply, `Hello World, I'm Java!`. When you CTRL+ or CMD+C (depending on your OS environment), the secure tunnel is torn down and you can continue iterating.

## Next steps

For more information about using Draft, see the Draft documentation on GitHub.

> [!div class="nextstepaction"]
> [Draft documentation](https://github.com/Azure/draft/tree/master/docs)