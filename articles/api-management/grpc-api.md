---
title: Import a gRPC API to Azure API Management
description: Learn how to import a gRPC service definition as an API to an API Management instance using the Azure portal, ARM template, or bicep template.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/06/2024
ms.author: danlep
ms.custom: devx-track-arm-template, devx-track-bicep, build-2024, devx-track-dotnet
---
# Import a gRPC API

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

This article shows how to import a gRPC service definition as an API in API Management. You can then manage the API in API Management, secure access and apply other polices, and pass gRPC API requests through the gateway to the gRPC backend. 

To add a gRPC API to API Management, you need to:

* Upload the API's Protobuf (protocol buffer) definition file to API Management
* Specify the location of your gRPC service
* Configure the API in API Management

API Management supports pass-through with the following types of gRPC service methods: unary, server streaming, client streaming, and bidirectional streaming. For background about gRPC, see [Introduction to gRPC](https://grpc.io/docs/what-is-grpc/introduction/).


> [!NOTE]
> * Currently, gRPC APIs are only supported in the self-hosted gateway, not the managed gateway for your API Management instance.
> * Currently, testing gRPC APIs isn't supported in the test console of the Azure portal or in the API Management developer portal.
> * Import is limited to a single Protobuff (.proto) file. 

## Prerequisites

* An API Management instance. If you don't already have one, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).

* A gateway resource provisioned in your instance. If you don't already have one, see [Provision a self-hosted gateway in Azure API Management](api-management-howto-provision-self-hosted-gateway.md).

* A gRPC Protobuff (.proto) file available locally and gRPC service that's accessible over HTTPS.

## Add a gRPC API

#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.

1. In the left menu, select **APIs** > **+ Add API**.

1. Under **Define a new API**, select **gRPC**.

    :::image type="content" source="./media/grpc-api/grpc-api.png" alt-text="Screenshot of creating a gRPC API in the portal." :::

1. In the **Create a gRPC API window**, select **Full**.

1. For a gRPC API, you must specify the following settings:

    1. In **Upload schema**, select a local .proto file associated with the API to import.

    1. In **gRPC server URL**, enter the address of the gRPC service. The address must be accessible over HTTPS.

    1. In **Gateways**, select the gateway resource that you want to use to expose the API. 

        > [!IMPORTANT]
        > In public preview, you can only select a self-hosted gateway. The **Managed** gateway isn't supported. 

1. Enter remaining settings to configure your API. These settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.

1. Select **Create**.

    The API is added to the **APIs** list. You can view update your settings by going to the **Settings** tab of the API. 

---

## Call gRPC services with .NET

For information about calling gRPC services with .NET, see the following articles:

* [Tutorial: Create a gRPC client and server in ASP.NET Core](/aspnet/core/tutorials/grpc/grpc-start)
* [Troubleshoot gRPC on .NET](/aspnet/core/grpc/troubleshoot#calling-grpc-services-hosted-in-a-sub-directory)

[!INCLUDE [api-management-append-apis.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
