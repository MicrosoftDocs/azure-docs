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

# Use Draft with Azure Container Service (AKS)

Draft is an open source tool that helps package and run code in a Kubernetes cluster. Draft is targeted at the development iteration cycle; as the code is being developed, but before committing to version control. With Draft, you can quickly redeploy to Kubernetes as code changes occurs. For more information on Draft, see the [Draft documentation on Github](https://github.com/Azure/draft/tree/master/docs).

This document details using Draft with an Azure Container Service (AKS) Kubernetes cluster.

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

During this process you will be prompted for the container registry credentials. When using an Azure Container Registry, the registry URL is the ACR login server, the username is the ACR name, and the password is the ACR password.

```console
1. Enter your Docker registry URL (e.g. docker.io/myuser, quay.io/myuser, myregistry.azurecr.io): <ACR Login Server>
2. Enter your username: <ACR Name>
3. Enter your password: <ACR Password>
```

Once complete, Draft will be configired in the AKS cluster and is ready to use.

```console
Draft has been installed into your Kubernetes Cluster.
Happy Sailing!
```

## Run an application

The Draft repository include several sample applications that can be used to demo Draft. Create a cloned copy of the repo.
 
```console
git clone https://github.com/Azure/draft
```

Change to the Java examples directory.

```console
cd draft/examples/java/
```

This command creates the artifacts that are used to run the application in a Kubernetes cluster. These items include a Dockerfile, a Helm chart, and a `draft.toml` file which is a Draft configuration file.

```console
draft create
```

Output:

```console
--> Draft detected the primary language as Java with 92.205567% certainty.
--> Ready to sail
```

To run the application on a Kubernetes cluster, use the `draft up` command. This command uploads the application code and the configuration files to the Kubernetes cluster, runs the Dockerfile to create a container image, pushes the image to the container registry, and finally runs the Helm chart to start the application.

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

## Test the application

To test the application, use the `draft connect` command. Draft connect proxies a connection to the Kubernetes pod allowing a secure local connection. When complete, the application can be accessed on the provided URL.

In some cases, it can take a few minutes for the container image to be download and that application to start. If you receive an error when accessing the application, retry the connection.

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

## Deploy application

## Next steps

For more information about using Draft, see the Draft documentation on GitHub.

> [!div class="nextstepaction"]
> [Draft documentation](https://github.com/Azure/draft/tree/master/docs)