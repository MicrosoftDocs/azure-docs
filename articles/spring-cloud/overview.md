---
title: Introduction to Azure Spring Cloud
description: Learn the features and benefits of Azure Spring Cloud to deploy and manage Java Spring applications in Azure.
author: karlerickson
ms.service: spring-cloud
ms.topic: overview
ms.date: 03/09/2021
ms.author: karler
ms.custom: devx-track-java, contperf-fy21q2
customer intent: As an Azure Cloud user, I want to deploy, run, and monitor Spring Boot microservices.
---

# What is Azure Spring Cloud?

Azure Spring Cloud makes it easy to deploy Spring Boot microservice applications to Azure without any code changes.  The service manages the infrastructure of Spring Cloud applications so developers can focus on their code.  Azure Spring Cloud provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

The following video shows an app composed of Java microservices running on Azure using Azure Spring Cloud.

<br>

> [!VIDEO https://www.youtube.com/embed/1jOXMFc1oRg]

## Why use Azure Spring Cloud?

Deployment of applications to Azure Spring Cloud has many benefits.  You can:
* Efficiently migrate existing Spring apps and manage cloud scaling and costs.
* Modernize apps with Spring Cloud patterns to improve agility and speed of delivery.
* Run Java at cloud scale and drive higher usage without complicated infrastructure.
* Develop and deploy rapidly without containerization dependencies.
* Monitor production workloads efficiently and effortlessly.

Azure Spring Cloud supports both Java [Spring Boot](https://spring.io/projects/spring-boot) and ASP.NET Core [Steeltoe](https://steeltoe.io/) apps. Steeltoe support is currently offered as a public preview. Public preview offerings let you experiment with new features prior to their official release.

## Service overview

As part of the Azure ecosystem, Azure Spring Cloud allows easy binding to other Azure services including storage, databases, monitoring, and more.  

  ![Azure Spring Cloud overview](media/spring-cloud-principles/azure-spring-cloud-overview.png)

* Azure Spring Cloud is a fully managed service for Spring Boot apps that lets you focus on building and running apps without the hassle of managing infrastructure.

* Simply deploy your JARs or code for your Spring Boot app or Zip for your Steeltoe app, and Azure Spring Cloud will automatically wire your apps with Spring service runtime and built-in app lifecycle.

* Monitoring is simple. After deployment you can monitor app performance, fix errors, and rapidly improve applications. 

* Full integration to Azure's ecosystems and services.

* Azure Spring Cloud is enterprise ready with fully managed infrastructure, built-in lifecycle management, and ease of monitoring.

## Documentation overview
This documentation includes sections that explain how to get started and leverage Azure Spring Cloud services.

* Get started
    * [Launch your first app](./quickstart.md)
    * [Provision an Azure Spring Cloud service](./quickstart-provision-service-instance.md)
    * [Set up the configuration server]()
    * [Build and deploy apps](./quickstart-deploy-apps.md)
    * [Use logs metrics and tracing](./quickstart-logs-metrics-tracing.md)
* How-to
    * [Develop](how-to-prepare-app-deployment.md): Prepare an existing Java Spring application for deployment to Azure Spring Cloud. When configured properly, Azure Spring Cloud provides robust services to monitor, scale, and update Java Spring Cloud applications.
    * [Deploy](./how-to-staging-environment.md): How to set up a staging deployment by using the blue-green deployment pattern in Azure Spring Cloud. Blue/green deployment is an Azure DevOps Continuous Delivery pattern that relies on keeping an existing (blue) version live, while a new (green) one is deployed.
    * [Configure apps](./how-to-start-stop-delete.md):  Start, stop, and delete your Azure Spring Cloud applications. Change an application's state in Azure Spring Cloud by using either the Azure portal or the Azure CLI.
    * [Scale](./how-to-scale-manual.md): Scale any microservice application using the Azure Spring Cloud dashboard in the Azure portal or using autoscale settings. Public IPs are available to communicate with external resources, such as databases, storage, and key vaults.
    * [Monitor apps](./how-to-distributed-tracing.md): Distributed tracing tools to easily debug and monitor complex issues. Azure Spring Cloud integrates Spring Cloud Sleuth with Azure's Application Insights. This integration provides powerful distributed tracing capability from the Azure portal.
    * [Secure apps](./how-to-enable-system-assigned-managed-identity.md): Azure resources provide an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code.
    * [Integration with other Azure services](./how-to-bind-cosmos.md): Instead of manually configuring your Spring Boot applications, you can automatically bind selected Azure services to your applications, for example, binding your application to an Azure Cosmos DB database.
    * [Automate](./how-to-cicd.md): Continuous integration and continuous delivery tools let you quickly deploy updates to existing applications with minimal effort and risk. Azure DevOps helps organize and control these key tasks. 
    * [Troubleshoot](./how-to-self-diagnose-solve.md): Azure Spring Cloud diagnostics provide an interactive experience to help troubleshoot apps. No configuration is required. When you find issues, Azure Spring Cloud diagnostics identifies problems and guides you to information that helps troubleshoot and resolve issues.
    * [Migrate](/azure/developer/java/migration/migrate-spring-boot-to-azure-spring-cloud): How to migrate an existing Spring Cloud application or Spring Boot application to run on Azure Spring Cloud.

 To get started, see:

> [!div class="nextstepaction"]
> [Spring Cloud quickstart](./quickstart.md)

Samples are available on GitHub: [Azure Spring Cloud Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/).