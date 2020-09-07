---
title: Introduction to Azure Spring Cloud
description: Learn the features and benefits of Azure Spring Cloud to deploy and manage Java Spring applications in Azure.
author: bmitchell287

ms.service: spring-cloud
ms.topic: overview
ms.date: 11/4/2019
ms.author: brendm
ms.custom: devx-track-java
---

# What is Azure Spring Cloud?

Azure Spring Cloud makes it easy to deploy Spring Boot-based microservice applications to Azure with zero code changes.  Azure Spring Cloud manages the infrastructure of Spring Cloud applications, so developers can focus on their code.  Spring Cloud provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

As part of the Azure ecosystem, Azure Spring Cloud allows easy binding to other Azure services including storage, databases, monitoring, and more.

This introduction describes the Azure Spring Cloud configuration server, how to enable blue/green deployments, scale apps, and how to monitor app performance.

## Spring Cloud Config Server

Azure Spring Cloud Config Server provides externalized configuration in a distributed system with both server and client-side support.  Azure Spring Cloud Config Server is a central location to manage application properties across all environments. For more information see [Spring Cloud Config Server reference](https://spring.io/projects/spring-cloud-config.md). 

## Enable blue/green deployments

Azure Spring Cloud supports blue/green deployments for releasing and updating code to production environments.  This change management pattern allows developers to implement features and code changes with the security of an immediate fallback when necessary.  Developers can concentrate on writing code with multiple production environments to update or roll back code changes without interrupting the application.  To learn more about staging environments and blue/green deployments, visit this [How-To article](spring-cloud-howto-staging-environment.md).

## Automate CI/CD pipelines

Azure Spring Cloud provides integration with Azure DevOps using the Azure CLI.  Using Azure DevOps, you can automate code integration and deployment to your Spring application.  To learn more, visit this [article](spring-cloud-howto-cicd.md).

## Scale your application

Azure Spring Cloud allows you to easily scale the micro-services in your Azure Spring Cloud dashboard.  Both the number of vCPUs and the amount of memory available to your micro-services can be scaled up or down to suit your requirements.  Scaling takes effect in seconds and does not require code changes or redeployment.  To learn more, complete this [tutorial](spring-cloud-tutorial-scale-manual.md).

## Application monitoring

### Monitor your application using distributed tracing and Azure App Insights

Spring Cloud's distributed tracing tools allow developers to debug and monitor the complex interconnections between microservices in an application.  By integrating [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) with Azure's [Application Insights](../azure-monitor/insights/insights-overview.md), Azure provides powerful distributed tracing capability directly from the Azure portal.  To learn more, complete this [tutorial](spring-cloud-tutorial-distributed-tracing.md).

## Next steps
To get started, complete the Spring Cloud quickstart:
> [!div class="nextstepaction"]
> [Quickstart: Deploy your first Azure Spring Cloud application](spring-cloud-quickstart.md)

More samples are available on GitHub: [Azure Spring Cloud Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/service-binding-cosmosdb-sql).
