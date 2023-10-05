---
title: Import a gRPC API to Azure API Management (preview) | Microsoft Docs
description: Learn how to import a gRPC service definition as an API to an API Management instance using the Azure portal, ARM template, or bicep template.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 10/04/2023
ms.author: danlep
ms.custom: 
---
# Import a gRPC API (preview)

This article shows how to import a gRPC service definition as an API in API Management. You can then manage the API in API Management, secure access and apply other polices, and pass gRPC API requests through the gateway to the gRPC backend. 

To add a gRPC API to API Management, you need to:

* Upload the API's Protobuf (protocol buffer) definition file to API Management
* Specify the location of your gRPC service
* Configure the API in API Management

For background about gRPC, see [Introduction to gRPC](https://grpc.io/docs/what-is-grpc/introduction/).


> [!NOTE]
> * Importing a gRPC API is in preview. Currently, gRPC APIs are only supported in the self-hosted gateway, not the managed gateway for your API Management instance.
> * Currently, testing gRPC APIs isn't supported in the test console of the Azure portal or in the API Management developer portal.

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

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


[!INCLUDE [api-management-append-apis.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
