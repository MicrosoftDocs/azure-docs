---
title: Migrate to Azure Container Apps overview
description: Learn about migrating existing applications to Azure Container Apps, how to prepare for migration, and which migration guide to use.
author: deepganguly
ms.author: deepganguly
ms.service: azure-container-apps
ms.topic: overview
ms.date: 11/09/2026
ms.ai-usage: ai-assisted
---

# Migrate to Azure Container Apps overview

Migrating to Azure Container Apps means moving an existing application from its current hosting platform to a managed, serverless container platform on Azure. You package your application and its runtime dependencies in a container image, configure the services it relies on, and deploy it to a Container Apps environment. Azure Container Apps manages the underlying infrastructure so you can focus on your application rather than managing servers or container orchestration.

You can migrate web applications, APIs, microservices, and background processing workloads. Whether you're moving from another cloud platform, an on-premises environment, or an existing Azure service, migration involves reviewing how your application runs today and adapting its configuration, dependencies, and operational processes for Container Apps.

For an introduction to the platform, see [Azure Container Apps overview](overview.md).

## Why migrate to Azure Container Apps?

Azure Container Apps provides capabilities that help you run and manage existing applications:

- **Managed infrastructure:** Run containerized applications without managing a Kubernetes cluster.
- **Automatic scaling:** Adjust application replicas based on HTTP traffic or event-driven scaling rules. Supported configurations can scale to zero when there's no demand.
- **Application updates:** Use revisions and traffic splitting to deploy and test new versions of your application.
- **Service connectivity:** Connect applications within an environment and integrate with external databases, storage, and messaging services.
- **Background processing:** Run scheduled, on-demand, or event-driven tasks with Container Apps jobs.

For more information about platform capabilities, see [Azure Container Apps overview](overview.md#features).

## Prepare for migration

Before moving your application, review the following areas:

- **Application compatibility:** Identify the runtime, operating system requirements, and dependencies that your container image needs.
- **State and storage:** Identify data stored in memory or on the local file system. Plan how to persist required data outside application replicas.
- **Configuration and secrets:** Inventory environment variables, connection strings, credentials, and certificates, and plan how to configure them in Container Apps.
- **Networking and scaling:** Review inbound traffic, access to dependent services, resource requirements, and scaling behavior.
- **Deployment and validation:** Plan how to build and deploy container images, monitor the application, test its behavior, and switch traffic from the existing platform.

The changes you need depend on your application's architecture and source platform. Use the migration guides in the following section for platform-specific assessment and deployment steps.

## Choose a migration guide

| Application or source platform | Migration guide |
| --- | --- |
| Heroku | Start with the [Heroku migration overview](migrate-heroku-overview.md) to map platform concepts and dependencies, then [migrate your Heroku application](migrate-heroku.md). |
| Spring Boot | [Migrate Spring Boot applications to Azure Container Apps](migrate-spring-boot.md). |
| Spring Cloud | [Migrate Spring Cloud applications to Azure Container Apps](migrate-spring-cloud.md). |
| Apache Tomcat | [Migrate Tomcat applications to Azure Container Apps](migrate-tomcat.md). |
| Java applications using migration tooling | [Migrate Java applications with GitHub Copilot app modernization](migrate-java-github-copilot-app-modernization.md). |

## Next steps

- Learn about [Azure Container Apps environments](environment.md).
- Review [containers in Azure Container Apps](containers.md).
- [Deploy your first container app](get-started.md).
