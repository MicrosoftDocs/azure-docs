---
title: How to Deploy Non-Java Applications in Azure Spring Cloud Enterprise Tier
titleSuffix: Azure Spring Cloud Enterprise Tier
description: How to Deploy Non-Java Applications in Azure Spring Cloud Enterprise Tier
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 12/31/2021
ms.custom: devx-track-java, devx-track-azurecli
---

# How to deploy non-Java applications in Azure Spring Cloud

This article shows you how to deploy your non-java application to Azure Spring Cloud Enterprise tier.

## Prerequisites

- A provisioned Azure Spring Cloud Enterprise Tier instance. For more information, see [Get started with Enterprise Tier](./get-started-enterprise.md).
- Application(s) running in Azure Spring Cloud. For more information on creating apps, see [Launch your Spring Cloud application from source code](./how-to-launch-from-source.md)
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

- Your application must listen on port 8080. The service checks the port on TCP for readiness and liveness.
- If your source code contains a package management folder, such as "node_modules", ensure the folder contains all the dependencies. Otherwise, remove it and let Azure Spring Cloud install it.
- To see whether your source code language is supported and the feature is provided, see the [Support Matrix](#support-matrix) section.

## Support matrix

<!--Seems there should be some icon to show the supported or not supported. I left the supported as empty for a better viewer for content writer-->

| Feature                                                            | Java | Python | Node | Netcore | Go |
|--------------------------------------------------------------------|------|--------|------|---------|----|
| App lifecycle management                                           |      |        |      |         |    |
| Access App public endpoint                                         |      |        |      |         |    |
| Test endpoint                                                      |      |        |      |         |    |
| Log to LA                                                          |      |        |      |         |    |
| Third Party  APM Integration (New relic, Dynatrace, AI, and so on) |      | N      | N    | N       | N  |
| Blue/green deployment                                              |      |        |      |         |    |
| Custom domain                                                      |      |        |      |         |    |
| Scaling - auto scaling                                             |      |        |      |         |    |
| Scaling - manual scaling (in/out, up/down)                         |      |        |      |         |    |
| Managed Identity                                                   |      |        |      |         |    |
| Configuration Service                                              |      | N      | N    | N       | N  |
| Service Registry                                                   |      | N      | N    | N       | N  |
| VNET                                                               |      |        |      |         |    |
| Outgoing IP Address                                                |      |        |      |         |    |
| TLS - e2e TLS (ngix2app, app2app)                                  |      |        |      |         |    |
| TLS - app2backing service                                          |      |        |      |         |    |
| advanced troubleshooting - thread/heap/JFR dump                    |      | N      | N    | N       | N  |
| BYOS                                                               |      |        |      |         |    |
| Integrate service binding with Resource Connector                  |      | N      | N    | N       | N  |
| AZ readiness (higher SLA)                                          |      |        |      |         |    |
| App Lifecycle events                                               |      |        |      |         |    |
| Reduced app size - 0.5 vCPU and 512 MB                             |      |        |      |         |    |
| Automate app deployments with Terraform and Azure Pipeline Task    |      |        |      |         |    |
| Soft Deletion                                                      |      |        |      |         |    |
| interactive diagnostic experience (AppLens-based)                  |      |        |      |         |    |
| SLA                                                                |      |        |      |         |    |

## Next steps

* [Azure Spring Cloud](.)
