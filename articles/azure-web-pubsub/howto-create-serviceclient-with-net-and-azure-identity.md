---
title: How to create a WebPubSubServiceClient with .NET and Azure Identity
description: How to create a WebPubSubServiceClient with .NET and Azure Identity
author: terencefan
ms.author: tefa
ms.date: 11/15/2021
ms.service: azure-web-pubsub
ms.custom: devx-track-dotnet
ms.topic: how-to
---

# How to create a `WebPubSubServiceClient` with .NET and Azure Identity

This how-to guide shows you how to create a `WebPubSubServiceClient` using Microsoft Entra ID in .NET.

## Requirements

- Install [Azure.Identity](https://www.nuget.org/packages/Azure.Identity) from nuget.org.

  ```bash
  dotnet add package Azure.Identity
  ```

- Install [Azure.Messaging.WebPubSub](https://www.nuget.org/packages/Azure.Messaging.WebPubSub) from nuget.org

  ```bash
  dotnet add package Azure.Messaging.WebPubSub
  ```

- If using DependencyInjection, install [Microsoft.Extensions.Azure](https://www.nuget.org/packages/Microsoft.Extensions.Azure) from nuget.org

  ```bash
  dotnet add package Microsoft.Extensions.Azure
  ```
  
## Sample codes

1. Create a `TokenCredential` with Azure Identity SDK.

   ```C#
   using Azure.Identity;

   namespace chatapp
   {
       public class Program
       {
           public static void Main(string[] args)
           {
               var credential = new DefaultAzureCredential();
           }
       }
   }
   ```

   `credential` can be any class that inherits from `TokenCredential` class.

   - EnvironmentCredential
   - ClientSecretCredential
   - ClientCertificateCredential
   - ManagedIdentityCredential
   - VisualStudioCredential
   - VisualStudioCodeCredential
   - AzureCliCredential

   To learn more, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme)

2. Then create a `client` with `endpoint`, `hub`, and `credential`.

   ```C#
   using Azure.Identity;
   using Azure.Messaging.WebPubSub;

   public class Program
   {
       public static void Main(string[] args)
       {
           var credential = new DefaultAzureCredential();
           var client = new WebPubSubServiceClient(new Uri("<endpoint>"), "<hub>", credential);
       }
   }
   ```

   Or inject it into `IServiceCollections` with our `BuilderExtensions`.

   ```C#
   using System;

   using Azure.Identity;

   using Microsoft.Extensions.Azure;
   using Microsoft.Extensions.Configuration;
   using Microsoft.Extensions.DependencyInjection;

   namespace chatapp
   {
       public class Startup
       {
           public Startup(IConfiguration configuration)
           {
               Configuration = configuration;
           }

           public IConfiguration Configuration { get; }

           public void ConfigureServices(IServiceCollection services)
           {
               services.AddAzureClients(builder =>
               {
                   var credential = new DefaultAzureCredential();
                   builder.AddWebPubSubServiceClient(new Uri("<endpoint>"), "<hub>", credential);
               });
           }
       }
   }
   ```

   Learn how to use this client, see [Azure Web PubSub service client library for .NET](/dotnet/api/overview/azure/messaging.webpubsub-readme)

## Complete sample

- [Simple chatroom with Microsoft Entra authorization](https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/chatapp-aad)
