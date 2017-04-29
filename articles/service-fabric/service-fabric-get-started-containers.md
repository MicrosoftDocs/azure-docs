---
title: Create an Azure Service Fabric container app | Microsoft Docs
description: Create your first container app on Azure Service Fabric.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/28/2017
ms.author: ryanwi

---

# Create your first Service Fabric container app
Running an existing web application in a Windows container on Service Fabric doesn't require any changes to your app. This quickstart walks you through creating a Docker image containing your app, packaging it, and deploying it to a cluster.  This article assumes a basic understanding of Docker. You can learn about Docker by reading the [Docker Overview](https://docs.docker.com/engine/understanding-docker/).

## Prerequisites
* The development computer must be running:
    1. Visual Studio 2015 or Visual Studio 2017.
    2. [Service Fabric SDK and tools](service-fabric-get-started.md).
    3. Docker for Windows.  [Get Docker CE for Windows (stable)](https://store.docker.com/editions/community/docker-ce-desktop-windows?tab=description). After installing and starting Docker, right-click on the tray icon and select **Switch to Windows containers**. This is required to run Docker images based on Windows. This command takes a few seconds to execute.

* A Windows cluster with 3 or more nodes running on Windows Server 2016 with Containers. Not a development cluster. [Create a cluster](service-fabric-get-started-azure-cluster.md)

* Azure container registry - Create a container registry in your Azure subscription. For example, use the Azure portal or the Azure CLI 2.0.

## Create a simple web app
Collect all the assets that you need to load into a Docker image in one place. For this quickstart, create a Hello World web app on your development computer.

1. Create a new directory, such as *c:\temp\helloworldapp*.
2. Create a sub-directory *c:\temp\helloworldapp\content*.
3. In *c:\temp\helloworldapp\content*, create a new file *index.html*.
4. Edit *index.html* and add the following line:
    ```
    <h1>Hello World!</h1>
    ```
5. Save your changes to *index.html*.

## Build the Docker image
You will build an image based on the [microsft/iis image](https://hub.docker.com/r/microsoft/iis/) located on Docker Hub. The base image, microsoft/iis, is a Windows Server image which contains Windows Server Core and Internet Information Services (IIS).  Running this image in your container automatically starts IIS and installed websites.

Define your Docker image in a Dockerfile. The Dockerfile contains instructions for the base image, additional components, the app you want to run, and other configuration images. The Dockerfile is the input to the docker build command, which creates the image. The Dockerfile that creates your image looks like this:

```
FROM microsoft/iis

RUN mkdir C:\site

RUN powershell -NoProfile -Command \
    Import-module IISAdministration; \
    New-IISSite -Name "Site" -PhysicalPath C:\site -BindingInformation "*:8000:"

EXPOSE 8000

ADD content/ /site
```

## Verify the image

## Push the image to the container registry

## Package the container app

## Deploy the container app


## Clean up
Delete your cluster

## Next steps

