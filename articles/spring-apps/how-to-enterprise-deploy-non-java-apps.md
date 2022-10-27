---
title: How to Deploy Non-Java Applications in Azure Spring Apps Enterprise Tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: How to Deploy Non-Java Applications in Azure Spring Apps Enterprise Tier
author: karlerickson
ms.author: xiading
ms.service: spring-apps
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# How to deploy non-Java applications in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to deploy your non-java application to Azure Spring Apps Enterprise tier.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).
- One or more applications running in Azure Spring Apps. For more information on creating apps, see [How to Deploy Spring Boot applications from Azure CLI](./how-to-launch-from-source.md).
- [Azure CLI](/cli/azure/install-azure-cli), version 2.0.67 or higher.
- Your application source code.

## Deploy your application

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

- Your application must listen on port 8080. The service checks the port on TCP for readiness and liveness.
- If your source code contains a package management folder, such as *node_modules*, ensure the folder contains all the dependencies. Otherwise, remove it and let Azure Spring Apps install it.
- To see whether your source code language is supported and the feature is provided, see the [Support Matrix](#support-matrix) section.

## Support matrix

The following table indicates the features supported for each language.

| Feature                                                         | Java | Python | Node | .NET Core | Go |[Static Files](how-to-enterprise-deploy-static-file.md)|
|-----------------------------------------------------------------|------|--------|------|-----------|----|-----------|
| App lifecycle management                                        | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Assign endpoint                                                 | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Azure Monitor                                                   | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Out of box APM integration                                      | ✔️   | ❌    | ❌   | ❌       | ❌ | ❌       |
| Blue/green deployment                                           | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Custom domain                                                   | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Scaling - auto scaling                                          | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Scaling - manual scaling (in/out, up/down)                      | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Managed Identity                                                | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| API portal for VMware Tanzu®                                    | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Spring Cloud Gateway for VMware Tanzu®                          | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Application Configuration Service for VMware Tanzu®             | ✔️   | ❌    | ❌   | ❌       | ❌ | ❌       |
| VMware Tanzu® Service Registry                                  | ✔️   | ❌    | ❌   | ❌       | ❌ | ❌       |
| VNET                                                            | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Outgoing IP Address                                             | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| E2E TLS                                                         | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Advanced troubleshooting - thread/heap/JFR dump                 | ✔️   | ❌    | ❌   | ❌       | ❌ | ❌       |
| Bring your own storage                                          | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Integrate service binding with Resource Connector               | ✔️   | ❌    | ❌   | ❌       | ❌ | ❌       |
| Availability Zone                                               | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| App Lifecycle events                                            | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Reduced app size - 0.5 vCPU and 512 MB                          | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Automate app deployments with Terraform and Azure Pipeline Task | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Soft Deletion                                                   | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Interactive diagnostic experience (AppLens-based)               | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| SLA                                                             | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |

## Next steps

- [Azure Spring Apps](index.yml)
