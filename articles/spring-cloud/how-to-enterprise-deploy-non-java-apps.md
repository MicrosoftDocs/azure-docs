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

# How to Deploy Non-Java Applications in Azure Spring Cloud
This article shows you how to deploy your non-java application to Azure Spring Cloud Enterprise tier.

## Prerequisites

- An provisioned Azure Spring Cloud Enterprise Tier instance. For more information, see [Get started with Enterprise Tier](./get-started-enterprise.md).
- Application(s) running in Azure Spring Cloud. For more information on creating apps, see [App and deployment management in Azure Spring Cloud](./07-app.md)
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
    --source-path <path-to-source-code, for example ".">
```

## Application Restriction
- Your application must listen on port 8080, the service checks the port on TCP for readiness and liveness.
- If your source code contains a package management folder (ie: "node_modules"), ensure the folder contains all the dependencies. Otherwise, remove it and let Azure Spring Cloud install it.
- See [Support Matrix](#support-matrix) to see whether your source code language is supported and the feature is provided.

## Support Matrix

<!--Seems there should be some icon to show the supported or not supported. I left the supported as empty for a better viewer for content writer-->

| Feature                                                         | Java | Python | Node | Netcore | Go |
|-----------------------------------------------------------------|------|--------|------|---------|----|
| App lifecycle mgmt.                                             |      |        |      |         |    |
| Access App public endpoint                                      |      |        |      |         |    |
| Test endpoint                                                   |      |        |      |         |    |
| Log to LA                                                       |      |        |      |         |    |
| 3rd Part  APM Integration (New relic, Dynatrace, AI, etc.)      |      | N      | N    | N       | N  |
| Blue/green deployment                                           |      |        |      |         |    |
| Custom domain                                                   |      |        |      |         |    |
| Scaling - auto scaling                                          |      |        |      |         |    |
| Scaling - manual scaling (In/out, up/down)                      |      |        |      |         |    |
| Managed Identit                                                 |      |        |      |         |    |
| Configuration Service                                           |      | N      | N    | N       | N  |
| Service Registr                                                 |      | N      | N    | N       | N  |
| VNET                                                            |      |        |      |         |    |
| Outgoing IP Address                                             |      |        |      |         |    |
| TLS - e2e TLS (ngix2app, app2app)                               |      |        |      |         |    |
| TLS - app2backing service                                       |      |        |      |         |    |
| advanced troubleshooting - thread/heap/JFR dump                 |      | N      | N    | N       | N  |
| BYOS                                                            |      |        |      |         |    |
| Integrate service binding with Resource Connector               |      | N      | N    | N       | N  |
| AZ readiness (higher SLA)                                       |      |        |      |         |    |
| App Lifecycle events                                            |      |        |      |         |    |
| Reduced app size - 0.5 vCPU and 512 MB                          |      |        |      |         |    |
| Automate app deployments with Terraform and Azure Pipeline Task |      |        |      |         |    |
| Soft Deletion                                                   |      |        |      |         |    |
| interactive diagnostic experience(AppLens-based)                |      |        |      |         |    |
| SLA                                                             |      |        |      |         |    |

## Next Steps
