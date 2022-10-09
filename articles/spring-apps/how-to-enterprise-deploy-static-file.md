---
title: How to Deploy Static File in Azure Spring Apps Enterprise Tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: How to Deploy Static File in Azure Spring Apps Enterprise Tier
ms.author: yili7
ms.service: spring-apps
ms.topic: how-to
ms.date: 10/09/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# How to deploy Static File in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to deploy your Static File to Azure Spring Apps Enterprise tier.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).
- One or more applications running in Azure Spring Apps. For more information on creating apps, see [How to Deploy Spring Boot applications from Azure CLI](./how-to-launch-from-source.md).
- [Azure CLI](/cli/azure/install-azure-cli), version 2.0.67 or higher.
- Your static files to be served by web servers such as Nginx or Apache HTTP Server.

## Deploy your Static File

To deploy from a source code folder your local machine, see [Non-Java application restrictions](#application-restriction).

To deploy the source code folder to an active deployment, use the following command:

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code>
```

## Application restriction

Your application must conform to the following restrictions:

- if you 
- Your application must listen on port 8080. The service checks the port on TCP for readiness and liveness.
- 
- To see whether your source code language is supported and the feature is provided, see the [Support Matrix](#support-matrix) section.

## Next steps

- [Azure Spring Apps](index.yml)
