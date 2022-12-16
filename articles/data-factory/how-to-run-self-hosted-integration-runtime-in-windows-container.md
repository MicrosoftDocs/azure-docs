---
title: How to run Self-Hosted Integration Runtime in Windows container
description: Learn about how to run Self-Hosted Integration Runtime in Windows container.

ms.author: lle
author: lrtoyou1223
ms.service: data-factory
ms.subservice: integration-runtime
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 08/10/2022
---

# How to run Self-Hosted Integration Runtime in Windows container

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Azure Data Factory provides Windows container support for the Self-Hosted Integration Runtime. You can [download the Docker Build source code](https://github.com/Azure/Azure-Data-Factory-Integration-Runtime-in-Windows-Container) and combine the building and running process in your own continuous delivery pipeline. 

> [!TIP]
> This article explains how to run the Self-Hosted Integration Runtime in a Windows container on a compatible physical or virtual machine. If you don't want to manage infrastructure, you can run the Self-Hosted Integration Runtime on Azure App Service. For more information, see the [Azure Data Factory self-hosted integration runtime on App Service](https://github.com/Azure-Samples/azure-data-factory-runtime-app-service) sample.

## Prerequisites 

- [Windows container requirements](/virtualization/windowscontainers/deploy-containers/system-requirements)
- Docker version 2.3 or later 
- Self-Hosted Integration Runtime Version 5.2.7713.1 or later

## Get started 

1. [Install Docker and enable Windows containers.](/virtualization/windowscontainers/quick-start/set-up-environment)

1. [Download the container image source code from GitHub.](https://github.com/Azure/Azure-Data-Factory-Integration-Runtime-in-Windows-Container)

1. If you need to use a specific version of the SHIR, you can download it and move it to the *SHIR* folder.

   Otherwise, skip this step. The container image build process will download the latest version of the SHIR automatically.

1. Open your folder in the shell: 

   ```console
   cd "yourFolderPath"
   ```

1. Build the Windows container image:

   ```console
   docker build . -t "yourDockerImageName" 
   ```

1. Run the Docker container:

   ```console
   docker run -d -e NODE_NAME="irNodeName" -e AUTH_KEY="IR_AUTHENTICATION_KEY" -e ENABLE_HA=true -e HA_PORT=8060 "yourDockerImageName"    
   ```

   > [!NOTE]
   > The `AUTH_KEY` environment variable is mandatory and must be set to the auth key value for your data factory.
   >
   > The `NODE_NAME`, `ENABLE_HA` and `HA_PORT` environment variables are optional. If you don't set their values, the command will use default values. The default value of `ENABLE_HA` is `false`, and the default value of `HA_PORT` is `8060`.

## Container health check

After the 120 second startup period, the health check runs periodically every 30 seconds. It provides the SHIR's health status to the container engine.

## Limitations

Currently we don't support the below features when running the Self-Hosted Integration Runtime in Windows containers:

- HTTP proxy 
- Encrypted node-node communication with TLS/SSL certificate 
- Generate and import backup 
- Daemon service 
- Auto-update 

There is a known issue when hosting an Azure Data Factory self-hosted integration runtime in Azure App Service. Azure App Service creates a new container instead of reusing existing container after restarting. This may cause self-hosted integration runtime node leak problem.

### Next steps

- Review [integration runtime concepts in Azure Data Factory](./concepts-integration-runtime.md).
- Learn how to [create a self-hosted integration runtime in the Azure portal](./create-self-hosted-integration-runtime.md).
