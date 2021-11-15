---
title: How to use Azure Active Directory (AAD) in C#
description: How to use Azure Active Directory (AAD) in C#
author: terencefan

ms.author: tefa
ms.date: 11/15/2021
ms.service: azure-web-pubsub
ms.topic: how-to
---

# How to use Azure Active Directory (AAD) in C#

## Requirements

- Install [Azure.Identity](https://www.nuget.org/packages/Azure.Identity) from nuget.org.

  ```bash
  Install-Package Azure.Identity
  ```

- Install [Azure.Messaging.WebPubSub](https://www.nuget.org/packages/Azure.Messaging.WebPubSub) from nuget.org

  ```bash
  Install-Package Azure.Messaging.WebPubSub 
  ```

## Sample codes

1. Create a `TokenCredential` with Azure Identity SDK.

    ```C#
    using Azure.Identity

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
    - ...

    To learn more, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme)

2. Then create a `client` with `endpoint`, `hub`, and `credential`. 

    ```C#
    using Azure.Identity

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

3. Learn how to use this client, see [Azure Web PubSub service client library for .NET](/dotnet/api/overview/azure/messaging.webpubsub-readme-pre)

## Complete sample

- [Simple chatroom with AAD Auth](https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/chatapp-aad)