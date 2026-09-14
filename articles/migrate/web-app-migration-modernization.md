---
title: Web App Migration and Modernization - Move and Upgrade Apps for Scalability and Performance
description: Learn what web app migration and modernization means—moving apps to the cloud and upgrading them with modern architectures for better scalability, performance, and security.
author: jyothisuri
ms.author: jsuri
ms.service: azure-migrate
ms.reviewer: jsuri
ms.update-cycle: 1095-days
ms.topic: upgrade-and-migration-article
ms.date: 08/28/2026
---

# Web app migration and modernization

Web app migration and modernization is the process of moving existing applications from on-premises or legacy environments to the cloud. It also involves upgrading apps to use modern frameworks, architectures, and services, enabling improved scalability, performance, and security. This approach helps organizations optimize costs and deliver faster, more reliable experiences.

Explore articles that explain how to migrate and modernize ASP.NET and Java web applications to Azure Kubernetes Service and Azure App Service.

## Migrate to Azure Kubernetes Service

Migrate your applications to Azure Kubernetes Service (AKS) for scalable, secure, and containerized deployment.

- **ASP.NET app containerization and migration to AKS**: Use Azure Migrate: App Containerization to package ASP.NET apps without code access and deploy them on Azure Kubernetes Service. [Learn more](tutorial-app-containerization-aspnet-kubernetes.md).


- **Java web app containerization and migration to Azure Kubernetes Service**: App Containerization to package Java apps running on Apache Tomcat without code access and deploy them on Azure Kubernetes Service. [Learn more](tutorial-app-containerization-java-kubernetes.md).

## Migrate to Azure App Service

Migrate your applications to Azure App Service for a fully managed platform that simplifies deployment and scales effortlessly.

-  Containerize Java apps and deploy them on App Service containers. [Learn more](tutorial-app-containerization-java-app-service.md).

- Upgrade ASP.NET apps to modern code on App Service. [Learn more](tutorial-modernize-asp-net-appservice-code.md).

- Migrate infrastructure-dependent .NET Framework apps to [Managed Instance on Azure App Service](../app-service/overview-managed-instance.md), which supports Windows operating system customization, configuration scripts, registry adapters, and storage mounts.

## Migrate web apps using GitHub Copilot

Migrate web apps by using GitHub Copilot modernization to accelerate assessment, remediation, validation, and deployment with an agentic workflow.

- Assess and migrate .NET projects to Azure by using GitHub Copilot modernization, which evaluates readiness, creates a migration plan, automates code changes, validates the result, and deploys to Azure. For applications that need Windows operating system customization, configure `AppServiceManagedInstance.Windows` as the [assessment target](/dotnet/azure/migration/appmod/working-with-assessment), then [deploy the migrated project](/dotnet/azure/migration/appmod/deploy).

-  Assess and migrate Java projects to Azure using GitHub Copilot app modernization, with automated readiness checks and predefined migration tasks. [Learn more](/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate).

## Deploy containerized applications using Azure DevOps

Deploying containerized applications with Azure DevOps automates building, testing, and deploying containerized apps to cloud or Kubernetes environments.

- Automate continuous deployment of containerized applications with Azure pipelines that build Docker images, push to Azure Container Registry, and deploy to AKS or App Service. [Learn more](/azure/migrate/tutorial-app-containerization-azure-pipeline).

## Next steps

- Review best practices for [deploying to Azure App service](/azure/app-service/deploy-best-practices). 
- Review best practices for [deploying to Azure Kubernetes service](/azure/aks/best-practices). 