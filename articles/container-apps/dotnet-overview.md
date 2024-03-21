---
title: .NET on Azure Container Apps overview
description: Learn about the tools and resources needed to run .NET and ASP.NET Core applications on Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/21/2024
ms.author: cshoe
---

# .NET on Azure Container Apps overview

To deploy a .NET application to a cloud native environment like Azure Container Apps, there are a few things you need to consider to ensure your application runs smoothly and securely. This guide covers some key concepts and considerations for deploying a .NET application to Azure Container Apps.

## Overview

Azure Container Apps is a fully managed serverless container service that allows you to run containerized applications without having to manage the underlying infrastructure. It includes built-in support for features like auto-scaling, health checks, TLS certificates, and more. This makes Container Apps an ideal platform for running .NET applications in a cloud-native environment.

There are some important concepts and concerns you need to consider when deploying a .NET application to a cloud native environment like Azure Container Apps.

## Select the right resource type

Container Apps supports two types of resources: apps and jobs. Apps are continuously-running services, while jobs are tasks that are designed to run to completion.

It's important to understand the difference between these two types of resources, as it'll affect how you deploy and manage your .NET application. The following are some examples of apps and jobs.

| Description | Resource type |
|-------------|---------------|
| An ASP.NET Core web API that serves HTTP requests | App |
| A .NET Core console application that processes some data, then exits | Job |
| A continuously running background service that processes messages from a queue | App |
| An application using a framework like Hangfire, Quartz.NET, or the Azure WebJobs SDK | App |

## Containerize and deploy your .NET application

For an app or job, you need to build a container image that contains your .NET application. To learn how to build a container image for a .NET application, see [Docker images for ASP.NET Core](/aspnet/core/host-and-deploy/docker/building-net-docker-images).

After you've added a Dockerfile to your .NET project, you can deploy it to Azure Container Apps by following these guides:

* [Tutorial: Deploy to Azure Container Apps using Visual Studio](deploy-visual-studio.md)
* [Quickstart: Build and deploy from a repository to Azure Container Apps](quickstart-repo-to-cloud.md)
* [Create a job with Azure Container Apps](jobs-get-started-cli.md)

## Use the HTTP ingress

Azure Container Apps includes a built-in HTTP ingress, which allows you to expose your apps to external traffic. To learn more, see [HTTP ingress in Azure Container Apps](ingress.md).

All incoming HTTP requests are first handled by the ingress, then routed to your app. TLS termination is also handled by the ingress, so you don't need to configure HTTPS in your app.

### Target port

By default, the Dockerfile for an ASP.NET Core app is configured to listen on HTTP. The default port that it listens to depends on the ASP.NET Core version:

* ASP.NET Core 7 and earlier: `80`
* ASP.NET Core 8 and later: `8080`

When you configure the ingress, set the target port to the number corresponding to the version of ASP.NET Core you're using.

### X-forwarded headers

Because the original HTTP request is handled by the ingress, your app will see the ingress as the client. There are some situations where your app needs to know the original client's IP address or the original protocol (HTTP or HTTPS). The HTTP ingress adds [`X-Forwarded-*` headers](ingress-overview.md#http-headers) to the request that contain this information.

You can configure your ASP.NET Core app to use these headers by adding the following code:

```csharp
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});
```

For more information, see [Configure ASP.NET Core to work with proxy servers and load balancers](/aspnet/core/host-and-deploy/proxy-load-balancer).

## Build cloud-native .NET applications

Deploying to a cloud-native environment like Azure Container Apps requires you to build your .NET applications with cloud-native principles in mind.

### Application configuration

When deploying your .NET application to Azure Container Apps, you should use environment variables for configuration instead of *appsettings.json*. This allows you to configure your application differently in different environments, and makes it easier to manage configuration values without having to rebuild and redeploy your container image.

In Azure Container Apps, you set environment variables when you define your app or job's container. For settings that are sensitive, store them in secrets and reference them as environment variables. To learn more, see [Manage secrets in Azure Container Apps](manage-secrets.md).

### Managed identity

Azure Container Apps supports managed identity, which allows your app to access other Azure services without needing to manage credentials. To learn more, see [Managed identities in Azure Container Apps](managed-identity.md).

### Logging

In a cloud-native environment, logging is crucial for monitoring and troubleshooting your applications. By default, Azure Container Apps uses Azure Log Analytics to collect logs from your containers. You also can configure other logging providers. To learn more, see [Log storage and monitoring options in Azure Container Apps](log-options.md).

In your .NET application, configure a logging provider that writes logs to the console, and then Azure Container Apps will collect and store them.

### Health probes

Azure Container Apps includes built-in support for health probes, which allow you to monitor the health of your applications and automatically restart them if they become unhealthy. To learn more, see [Health probes in Azure Container Apps](health-probes.md).

In your ASP.NET Core application, you can configure a health check endpoint that Azure Container Apps can use to determine the health of your application. To learn more, see [Health checks in ASP.NET Core](/aspnet/core/host-and-deploy/health-checks).

### Auto-scaling considerations

By default, Azure Container Apps automatically scales your ASP.NET Core apps based on the number of incoming HTTP requests. You can also configure custom auto-scaling rules based on other metrics, such as CPU or memory usage. To learn more, see [Set scaling rules in Azure Container Apps](scale-app.md).

Auto-scaling changes the number of replicas of your app based on the rules you define. By default, Container Apps randomly routes incoming traffic to the replicas of your ASP.NET Core app. This means that your app should be stateless, so that clients don't experience any issues when their requests are routed to different replicas.

There are ASP.NET Core features that require additional configuration to work correctly when scaled to multiple replicas: data protection, SignalR, and Blazor Server.

#### Configure data protection

ASP.NET Core uses data protection to protect and unprotect data, such as session data and anti-forgery tokens. By default, data protection keys are stored in the file system, which isn't suitable for a cloud-native environment. When deploying your ASP.NET Core app to Azure Container Apps, you must configure data protection to use Azure Key Vault and Blob Storage for key persistence. To learn more, see [Configure ASP.NET Core Data Protection](/aspnet/core/security/data-protection/configuration/overview).

#### Configure ASP.NET Core SignalR

ASP.NET Core SignalR requires a backplane to distribute messages to multiple server replicas. When deploying your ASP.NET Core app to Azure Container Apps, you must configure one of the supported backplanes, such as Azure SignalR Service or Redis. To learn more, see [ASP.NET Core SignalR hosting and scaling](/aspnet/core/signalr/scale).

#### Configure Blazor Server

Blazor Server apps store state on the server, which means that each client must be connected to the same server replica for the duration of their session. When deploying your Blazor Server app to Azure Container Apps, you must enable sticky sessions to ensure that clients are routed to the same replica. To learn more, see [Session Affinity in Azure Container Apps](sticky-sessions.md).


## Next steps

> [!div class="nextstepaction"]
> [Deploying and scaling an ASP.NET Core app on Azure Container Apps](/aspnet/core/host-and-deploy/scaling-aspnet-apps/scaling-aspnet-apps)
> 
> [Deploy a .NET Aspire app](/dotnet/aspire/deployment/azure/aca-deployment)
