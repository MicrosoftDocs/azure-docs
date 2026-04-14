---
title: Import a gRPC API to Azure API Management
description: Learn how to import a gRPC service definition as an API to an API Management instance using the Azure portal, ARM template, or Bicep file.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 02/18/2026
ms.author: danlep
ms.custom:
  - devx-track-arm-template
  - devx-track-bicep
  - build-2024
  - devx-track-dotnet
  - build-2025
---
# Import a gRPC API

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

This article shows how to import a gRPC service definition as an API in API Management. You can then manage the API in API Management, secure access and apply other policies, and pass gRPC API requests through the gateway to the gRPC backend. 

To add a gRPC API to API Management, you need to:

* Upload the API's protobuf (protocol buffer) definition file to API Management.
* Specify the location of your gRPC service.
* Configure the API in API Management.

API Management supports pass-through with the following types of gRPC service methods: unary, server streaming, client streaming, and bidirectional streaming. To learn more about gRPC, see [Introduction to gRPC](https://grpc.io/docs/what-is-grpc/introduction/).

> [!NOTE]
> * gRPC APIs are supported in the [self-hosted gateway](self-hosted-gateway-overview.md) and in the managed gateway for classic tier instances created starting January 2026 (preview). Contact support to enable gRPC API support in classic tier instances created before this date. gRPC APIs currently aren't supported in the v2 tiers.
> * Currently, testing gRPC APIs isn't supported in the test console of the Azure portal or in the API Management developer portal.
> * Import is limited to a single protobuf (*.proto*) file.  

## Prerequisites

* An API Management instance. If you don't already have one, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).

* A gRPC protobuf (*.proto*) file available locally, and gRPC service that's accessible over HTTPS.

* HTTP/2 protocol support enabled for client traffic. For more information, see [Manage protocols and ciphers in Azure API Management](api-management-howto-manage-protocols-ciphers.md).

## Add a gRPC API

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.

1. Under **APIs** in the sidebar menu, select **APIs**.

1. Under **Define a new API**, select **gRPC**.

    :::image type="content" source="./media/grpc-api/grpc-api.png" alt-text="Screenshot of creating a gRPC API in the portal." :::

1. In the **Create a gRPC API window**, select **Full**.

1. For a gRPC API, specify the following settings:

    1. Enter a display name.

    1. For **Upload schema**, select a local *.proto* file associated with the API to import.

    1. For **gRPC server URL**, enter the address of the gRPC service. The address must be accessible over HTTPS.

    1. For **Gateways**, select the gateway resource that you want to use to expose the API. 

1. Enter any remaining settings to configure your API. The [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial explains these settings.

1. Select **Create**.

    The portal adds the API to the **APIs** list. You can view and update your settings by going to the **Settings** tab of the API.

## Call gRPC services by using .NET

For information about calling gRPC services by using .NET, see the following articles:

* [Tutorial: Create a gRPC client and server in ASP.NET Core](/aspnet/core/tutorials/grpc/grpc-start)
* [Troubleshoot gRPC on .NET](/aspnet/core/grpc/troubleshoot#calling-grpc-services-hosted-in-a-sub-directory)

[!INCLUDE [api-management-append-apis.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
