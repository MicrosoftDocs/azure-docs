---
title: Azure API Management backends | Microsoft Docs
description: Learn about custom backends in API Management and how to create a Service Fabric service backend in API Management.
services: api-management
documentationcenter: ''
author: dlepow
editor: ''

ms.service: api-management
ms.topic: article
ms.date: 01/04/2021
ms.author: apimpm
---

# Set up an API Management backend using the Azure portal

This article shows how to configure a Service Fabric service as a custom backend using the Azure portal. You can also configure other Azure resources or your own services as custom backends. 

## About backends

A *backend* (or *backend API*) in API Management is an HTTP service that implements your front-end API and its operations.

When importing certain APIs, API Management configures the API backend automatically. For example, API Management configures the backend when importing an [OpenAPI specification](import-api-from-oas.md), [SOAP API](import-soap-api.md), or certain Azure resources directly such as an HTTP-triggered [Azure Function App](import-function-app-as-api.md) or [Logic App](import-logic-app-as-api.md).

API Management also supports using other Azure resources such as a [Service Fabric cluster](../service-fabric/service-fabric-api-management-overview.md) or custom services as an API backend. Using these backends requires additional configuration to authorize credentials of requests to the backend service and to create API operations.

After creating a backend, you can reference the backend URL when [manually adding a blank API](add-api-manually.md) and then add API operations. You can also reference the backend from the [`set-backend-service`](api-management-transformation-policies.md#SetBackendService) policy, to redirect an incoming request to a different backend than the one specified in the API settings for that operation.

## Prerequisites

* **Windows development environment** - Install [Visual Studio 2019](https://www.visualstudio.com) and the **Azure development**, **ASP.NET and web development**, and **.NET Core cross-platform development** workloads.  Then set up a [.NET development environment](../service-fabric/service-fabric-get-started.md).

* **Service Fabric cluster** - See [Tutorial: Deploy a Service Fabric cluster running Windows into an Azure virtual network](../service-fabric/service-fabric-tutorial-create-vnet-and-windows-cluster.md). You can create a cluster with an existing X.509 certificate or use a new, self-signed certificate.

he certificate is added to an Azure key vault.

* **Sample Service Fabric app** -  Create a Web API app and deploy to the Service Fabric cluster as described in [Integrate API Management wth Service Fabric in Azure](../service-fabric/service-fabric-tutorial-deploy-api-management.md). These steps create a basic stateless ASP.NET Core Reliable Service using the default Web API project template. This creates an HTTP endpoint for your service, which you expose through Azure API Management.

* **API Management instance** - in at least Developer tier (for VNet) in same region as SF cluster and VNet.







## Add API Management to Service Fabric VNet
or create service in the VNet

## Create backend - portal

## Add SF certificate to API Management

[should this be done through a KV secret named value?]
https://docs.microsoft.com/azure/api-management/api-management-howto-mutual-certificates

:::image type="content" source="media/backends/add-cluster-certificate.png" alt-text="Add cluster certificate to API Management":::

### Add backend

To create a service fabric backend:

1. In the [Azure portal](https://management.azure.com), navigate to your API Mangement instance.
1. Under **APIs**, select **Backends**.
1. Enter a backend name and an optional description
1. In **Type**, select **Service Fabric**.
1. In **Runtime URL**, enter the Service Fabric URL for the backend service, for example, `fabric:/myApplication/myService`. 
1. Enter a number between 0 and 10 for **Maximum number of partition resolution retries**.
1. Enter the management endpoint of the service fabric cluster. This endpoint should be the the URL of the cluster on port `198080`, for example, `https://mysfcluster.eastus.cloudapp.azure.com:19080`.

:::image type="content" source="media/backends/create-service-fabric-backend.png" alt-text="Create a service fabric backend":::

## Create test API

:::image type="content" source="media/backends/create-blank-api.png" alt-text="Create blank API":::

Add a GET operation to the API:

:::image type="content" source="media/backends/configure-get-operation.png" alt-text="Add GET operation to API":::

## Configure `set-backend` policy

Use the [`set-backend-service`](api-management-transformation-policies.md#SetBackendService) policy to redirect an incoming request to a different backend than the one specified in the API settings for that operation. 

Add this policy to the **Inbound processing** seciton. In `backend-id`, substitute the name of your Service Fabric backend.

```xml
<set-backend-service backend-id="mysfbackend" sf-resolve-condition="@((int)context.Response.StatusCode != 200 || context.LastError?.Reason == "BackendConnectionFailure" || context.LastError?.Reason == "Timeout")"  />
```

:::image type="content" source="media/backends/set-backend-service.png" alt-text="Configure set-backend-service policy":::

## Test backend API

:::image type="content" source="media/backends/test-backend-service.png" alt-text="Test Service Fabic backend":::

## Create backend - Azure PowerShell

## Credentials

API Management can use query parameters, client certificates, the Authorization header, or other headers to present authorization credentials to the backend service.


## Next steps

* Learn how to [configure policies](api-management-advanced-policies.md) to forward requests to a backend
* Backends can also be configured using the API Management [REST API](/rest/api/apimanagement/2020-06-01-preview/backend) or [Azure Resource Manager templates](../service-fabric/service-fabric-tutorial-deploy-api-management.md)

