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

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to deploy your non-java application to Azure Spring Cloud Enterprise tier.

## Prerequisites

- An already provisioned Azure Spring Cloud Enterprise tier instance. For more information, see [Quickstart: Provision an Azure Spring Cloud service instance using the Enterprise tier](quickstart-provision-service-instance-enterprise.md).
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
| App lifecycle management                                        | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Assign endpoint                                                 | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Azure Monitor                                                   | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Out of box APM integration                                      | ✔️   | ❌    | ❌   | ❌       | ❌ |
| Blue/green deployment                                           | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Custom domain                                                   | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Scaling - auto scaling                                          | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Scaling - manual scaling (in/out, up/down)                      | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Managed Identity                                                | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| API portal for VMware Tanzu®                                    | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Spring Cloud Gateway for VMware Tanzu®                          | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Application Configuration Service for VMware Tanzu®             | ✔️   | ❌    | ❌   | ❌       | ❌ |
| VMware Tanzu® Service Registry                                  | ✔️   | ❌    | ❌   | ❌       | ❌ |
| VNET                                                            | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Outgoing IP Address                                             | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| E2E TLS                                                         | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Advanced troubleshooting - thread/heap/JFR dump                 | ✔️   | ❌    | ❌   | ❌       | ❌ |
| Bring your own storage                                          | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Integrate service binding with Resource Connector               | ✔️   | ❌    | ❌   | ❌       | ❌ |
| Availability Zone                                               | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| App Lifecycle events                                            | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Reduced app size - 0.5 vCPU and 512 MB                          | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Automate app deployments with Terraform and Azure Pipeline Task | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Soft Deletion                                                   | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| Interactive diagnostic experience (AppLens-based)               | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |
| SLA                                                             | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ |

## Next steps

- [Azure Spring Cloud](index.yml)
