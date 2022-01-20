---
title: How to Deploy Non-Java Applications in Azure Spring Cloud Enterprise Tier
titleSuffix: Azure Spring Cloud Enterprise Tier
description: How to Deploy Non-Java Applications in Azure Spring Cloud Enterprise Tier
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# How to deploy non-Java applications in Azure Spring Cloud

**This article applies to:** ✔️ Enterprise tier

This article shows you how to deploy your non-java application to Azure Spring Cloud Enterprise tier.

## Prerequisites

- A provisioned Azure Spring Cloud Enterprise Tier instance. For more information, see [Get started with Enterprise Tier](./get-started-enterprise.md).
- One or more applications running in Azure Spring Cloud. For more information on creating apps, see [Launch your Spring Cloud application from source code](./how-to-launch-from-source.md).
- [Azure CLI](/cli/azure/install-azure-cli), version 2.0.67 or higher.
- Your application source code.

## Deploy your application

To deploy from a source code folder your local machine, see [Non-Java application restrictions](#application-restriction).

To deploy the source code folder to an active deployment, use the following command:

```azurecli
az spring-cloud app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Cloud-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code>
```

## Application restriction

Your application must conform to the following restrictions:

- Your application must listen on port 8080. The service checks the port on TCP for readiness and liveness.
- If your source code contains a package management folder, such as *node_modules*, ensure the folder contains all the dependencies. Otherwise, remove it and let Azure Spring Cloud install it.
- To see whether your source code language is supported and the feature is provided, see the [Support Matrix](#support-matrix) section.

## Support matrix

The following table indicates the features supported for each language.

| Feature                                                         | Java | Python | Node | .NET Core | Go |
|-----------------------------------------------------------------|------|--------|------|-----------|----|
| App lifecycle management                                        | Y    | Y      | Y    | Y         | Y  |
| Assign endpoint                                                 | Y    | Y      | Y    | Y         | Y  |
| Azure Monitor                                                   | Y    | Y      | Y    | Y         | Y  |
| Out of box APM integration                                      | Y    | N      | N    | N         | N  |
| Blue/green deployment                                           | Y    | Y      | Y    | Y         | Y  |
| Custom domain                                                   | Y    | Y      | Y    | Y         | Y  |
| Scaling - auto scaling                                          | Y    | Y      | Y    | Y         | Y  |
| Scaling - manual scaling (In/out, up/down)                      | Y    | Y      | Y    | Y         | Y  |
| Managed Identity                                                | Y    | Y      | Y    | Y         | Y  |
| API portal                                                      | Y    | Y      | Y    | Y         | Y  |
| Spring Cloud Gateway                                            | Y    | Y      | Y    | Y         | Y  |
| Application Configuration Service                               | Y    | N      | N    | N         | N  |
| Service Registry                                                | Y    | N      | N    | N         | N  |
| VNET                                                            | Y    | Y      | Y    | Y         | Y  |
| Outgoing IP Address                                             | Y    | Y      | Y    | Y         | Y  |
| e2e TLS                                                         | Y    | Y      | Y    | Y         | Y  |
| advanced troubleshooting - thread/heap/JFR dump                 | Y    | N      | N    | N         | N  |
| Bring your own storage                                          | Y    | Y      | Y    | Y         | Y  |
| Integrate service binding with Resource Connector               | Y    | N      | N    | N         | N  |
| Availability Zone                                               | Y    | Y      | Y    | Y         | Y  |
| App Lifecycle events                                            | Y    | Y      | Y    | Y         | Y  |
| Reduced app size - 0.5 vCPU and 512 MB                          | Y    | Y      | Y    | Y         | Y  |
| Automate app deployments with Terraform and Azure Pipeline Task | Y    | Y      | Y    | Y         | Y  |
| Soft Deletion                                                   | Y    | Y      | Y    | Y         | Y  |
| interactive diagnostic experience(AppLens-based)                | Y    | Y      | Y    | Y         | Y  |
| SLA                                                             | Y    | Y      | Y    | Y         | Y  |

## Next steps

- [Azure Spring Cloud](index.yml)
