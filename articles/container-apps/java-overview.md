---
title: Java on Azure Container Apps overview
description: Learn about the tools and resources needed to run Java applications on Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 04/30/2024
ms.author: cshoe
---

# Java on Azure Container Apps overview

Azure Container Apps can run any containerized Java application in the cloud while giving flexible options for how your deploy your applications.

When you use Container Apps for your containerized Java applications, you get:

- **Cost effective scaling**: When you use the [Consumption plan](plans.md#consumption), your Java apps can scale to zero. Scaling in when there's little demand for your app automatically drives costs down for your projects.

- **Deployment options**: Azure Container Apps integrates with [Buildpacks](https://buildpacks.io), which allows you to deploy directly from a Maven build, via artifact files, or with your own Dockerfile.

- **Automatic memory fitting**: Container Apps optimizes how the Java Virtual Machine (JVM) [manages memory](java-memory-fit.md), making the most possible memory available to your Java applications.

- **Build environment variables**: You can configure [custom key-value pairs](java-build-environment-variables.md) to control the Java image build from source code.

- **JAR deployment**: You can deploy your container app directly from a [JAR file](java-get-started.md?tabs=jar).

- **WAR deployment**: You can deploy your container app directly from a [WAR file](java-get-started.md?tabs=war).

This article details the information you need to know as you build Java applications on Azure Container Apps.

## Deployment types

Running containerized applications usually means you need to create a Dockerfile for your application, but running Java applications on Container Apps gives you a few options.

| Type | Description | Uses Buildpacks | Uses a Dockerfile |
|--|--|--|--|
| [Source code build](./quickstart-code-to-cloud.md?tabs=bash%2Cjava&pivots=without-dockerfile) | You can deploy directly to Container Apps from your source code. | Yes | No |
| [Artifact build](deploy-artifact.md) | You can create a Maven build to deploy to Container Apps | Yes | No |
| Dockerfile | You can create your Dockerfile manually and take full control over your deployment. | No | Yes |

> [!NOTE]
> The Buildpacks deployments support JDK versions 8, 11, 17, and 21.

## Application types

Different applications types are implemented either as an individual container app or as a [Container Apps job](jobs.md). Use the following table to help you decide which application type is best for your scenario.

Examples listed in this table aren't meant to be exhaustive, but to help you best understand the intent of different application types.

| Type | Examples | Implement as... |
|--|--|--|
| Web applications and API endpoints | Spring Boot, Quarkus, Apache Tomcat, and Jetty | An individual container app |
| Console applications, scheduled tasks, task runners, batch jobs | SparkJobs, ETL tasks, Spring Batch Job, Jenkins pipeline job | A Container Apps job |

## Debugging

As you debug your Java application on Container Apps, be sure to inspect the Java [in-process agent](/azure/spring-apps/enterprise/how-to-application-insights?pivots=sc-enterprise) for log stream and console debugging messages.

## Troubleshooting

Keep the following items in mind as you develop your Java applications:

- **Default resources**: By default, an app has a half a CPU and 1 GB available.

- **Stateless processes**: As your container app scales in and out, new processes are created and shut down. Make sure to plan ahead so that you write data to shared storage such as databases and file system shares. Don't expect any files written directly to the container file system to be available to any other container.

- **Scale to zero is the default**: If you need to ensure one or more instances of your application are continuously running, make sure you define a [scale rule](scale-app.md) to best meet your needs.

- **Unexpected behavior**: If your container app fails to build, start, or run, verify that the artifact path is set correctly in your container.

- **Buildpack support issues**: If your Buildpack doesn't support dependencies or the version of Java you require, create your own Dockerfile to deploy your app. You can view a [sample Dockerfile](https://github.com/Azure-Samples/containerapps-albumapi-java/blob/main/Dockerfile) for reference.

- **SIGTERM and SIGINT signals**: By default, the JVM handles `SIGTERM` and `SIGINT` signals and doesn’t pass them to the application unless you intercept these signals and handle them in your application accordingly. Container Apps uses both `SIGTERM` and `SIGINT` for process control. If you don't capture these signals, and your application terminates unexpectedly, you might lose these signals unless you persist them to storage.

- **Access to container images**: If you use artifact or source code deployment in combination with the default registry, you don't have direct access to your container images.

## Monitoring

All the [standard observability tools](observability.md) work with your Java application. As you build your Java applications to run on Container Apps, keep in mind the following items:

- **Logging**: Send application and error messages to `stdout` or `stderror` so they can surface in the log stream. Avoid logging directly to the container's filesystem as is common when using popular logging services.

- **Performance monitoring configuration**: Deploy performance monitoring services as a separate container in your Container Apps environment so it can directly access your application.

## Scaling

If you need to make sure requests from your front-end applications reach the same server, or your front-end app is split between multiple containers, make sure to enable [sticky sessions](sticky-sessions.md).

## Security

The Container Apps runtime terminates SSL for you inside your Container Apps environment.

## Memory management

To help optimize memory management in your Java application, you can ensure [JVM memory fitting](java-memory-fit.md) is enabled in your app.

Memory is measured in gibibytes (Gi) and CPU core pairs. The following table shows the range of resources available to your container app.

| Threshold | CPU cores | Memory in Gibibytes (Gi) |
|---|---|---|
| Minimum | 0.25 | 0.5 |
| Maximum | 4 | 8 |

Cores are available in 0.25 core increments, with memory available at a 2:1 ratio. For instance, if you require 1.25 cores, you have 2.5 Gi of memory available to your container app.

> [!NOTE]
> For apps using JDK versions 9 and lower, make sure to define custom JVM memory settings to match the memory allocation in Azure Container Apps.

## Spring components support

Azure Container Apps offers support for the following Spring Components as managed services:

- **Eureka Server for Spring**: Service registration and discovery are key requirements for maintaining a list of live application instances. Your application uses this list to for routing and load balancing inbound requests. Configuring each client manually takes time and introduces the possibility of human error. Eureka Server simplifies the management of service discovery by functioning as a [service registry](java-eureka-server-usage.md) where microservices can register themselves and discover other services within the system.

- **Config Server for Spring**: Config Server provides centralized external configuration management for distributed systems. This component designed to address the challenges of [managing configuration settings across multiple microservices](java-config-server-usage.md) in a cloud-native environment.

## Next steps

> [!div class="nextstepaction"]
> [Launch your first Java app](java-get-started.md)
