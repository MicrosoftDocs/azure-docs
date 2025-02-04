---
title: Overview of Containerization
description: Describes how to containerize a Java application.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Overview of containerization

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article describes how to containerize a Java application.

Azure Spring Apps enables you to upload a JAR or WAR file, which it automatically packages into a managed container image. It also supports building polyglot applications from source code to container images using VMware Tanzu Buildpacks or open-source [Paketo Buildpacks](https://paketo.io/).

Azure Container Apps and Azure Kubernetes Service (AKS) are container platforms that support multiple programming languages. We highly recommend creating a container image from your application and deploying it to Azure Container Apps or AKS. Building your container image separately gives you full control over the customization and optimization of your application environment, ensuring that it meets your specific requirements before deployment. This article explains how to build your source code or artifact into a container image on your own.

## Build a container image

The following table indicates articles to assist you with migration, based on your plan and the type of artifact you're using in Azure Spring Apps:

| Azure Spring Apps plan | Artifact          | Guide                                                                                                           |
|------------------------|-------------------|-----------------------------------------------------------------------------------------------------------------|
| Basic/Standard plan    | A JAR or WAR file | [Build a container image from a JAR or WAR](./migrate-to-azure-container-apps-build-artifacts.md)               |
| Standard plan          | Source code       | [Containerize an application by using Paketo Buildpacks](./migrate-to-azure-container-apps-build-buildpacks.md) |
| Enterprise plan        | JAR or WAR file   | [Containerize an application by using Paketo Buildpacks](./migrate-to-azure-container-apps-build-buildpacks.md) |
| Enterprise plan        | Source code       | [Containerize an application by using Paketo Buildpacks](./migrate-to-azure-container-apps-build-buildpacks.md) |

To integrate an application performance monitoring (APM) agent into your container image, see [Integrate application performance monitoring into container images](./migrate-to-azure-container-apps-build-application-performance-monitoring.md).

## Push the container image to a container registry

After you build your artifact into a container image, you need to push it to a container registry, whether public or private. If you're using Azure Container Registry, see [Push your first image to your Azure container registry using the Docker CLI](/azure/container-registry/container-registry-get-started-docker-cli).

If you have an Azure Container Registry instance, you can also use Azure Container Registry to build and push an image. For more information, see [Quickstart: Build and run a container image using Azure Container Registry Tasks](/azure/container-registry/container-registry-quickstart-task-cli).
