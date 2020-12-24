---
title: Azure API Management backends | Microsoft Docs
description: Learn about ... how to create backends in API Management.
services: api-management
documentationcenter: ''
author: dlepow
editor: ''

ms.service: api-management
ms.topic: article
ms.date: 12/22/2020
ms.author: apimpm
---

# Set up a custom API Management backend

When importing an API, API Management can often configure an API backend automatically. For example, API Management sets up the backend when importing an [OpenAPI specification](import-api-from-oas.md), [Azure Function App](import-function-app-as-api.md), or [Azure Logic App](import-logic-app-as-api.md), among others.

API Management also supports using an Azure resource such as a [Service Fabric cluster](../service-fabric/service-fabric-api-management-overview.md) as an API backend. This article shows how to configure a Service Fabric service as a custom backend using the Azure portal or Azure PowerShell. You can also configure other Azure resources or services as custom backends. 

After creating a backend, you can reference the backend URL when [manually adding an API](add-api-manually.md) or from API Managment policies such as the he [`set-backend-service`](api-management-transformation-policies.md#SetBackendService) policy.

https://github.com/Azure-Samples/service-fabric-api-management 

## Prerequisites

* **Tools** - Visual Studio 2019, install Service Fabric SDK, Service Fabric Explorer

* **Service Fabric cluster** - See [Tutorial: Deploy a Service Fabric cluster running Windows into an Azure virtual network](../service-fabric/service-fabric-tutorial-create-vnet-and-windows-cluster.md). You can create a cluster with an existing X.509 certificate or use a new, self-signed certificate.

he certificate is added to an Azure key vault.

* **Sample Service Fabric app** -  Create a Web API app and deploy to the Service Fabric cluster as described in [Integrate API Management wth Service Fabric in Azure](../service-fabric/service-fabric-tutorial-deploy-api-management.md)

T
* **API Management instance** - in at least Developer tier (for VNet) in same region as SF cluster and VNet.







## Add API Management to Service Fabric VNet
or create service in the VNet

## Create backend - portal

## Add SF certificate to API Management

[should this be done through a KV secret named value?]
https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-mutual-certificates

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

:::image type="content" source="media/backends/configure-get-operation.png" alt-text="":::

## Configure `set-backend` policy

Use the [`set-backend-service`](api-management-transformation-policies.md#SetBackendService) policy to redirect an incoming request to a different backend than the one specified in the API settings for that operation. 

Add this policy to the **Inbound processing** seciton. In `backend-id`, substitute the name of your Service Fabric backend.

```xml
<set-backend-service backend-id="mysfbackend" sf-resolve-condition="@((int)context.Response.StatusCode != 200 || context.LastError?.Reason == "BackendConnectionFailure" || context.LastError?.Reason == "Timeout")"  />
```

:::image type="content" source="media/backends/set-backend-service.png" alt-text="Configure set-backend-service policy":::

## Test backend API



## Create backend - Azure PowerShell

## Credentials

API Management can use query parameters, client certificates, the Authorization header, or other headers to present authorization credentials to the backend service.



## Use backend in policies

After configuring a backend, you can use the backend in API Management policies:

* Use the [`set-backend-service`](api-management-transformation-policies.md#SetBackendService) policy to redirect an incoming request to a different backend than the one specified in the API settings for that operation. 
* Refer to the backend ... in a [forward request policy](api-management-advanced-policies.md#ForwardRequest).

The `forward-request` policy forwards the incoming request to the backend service specified in the request [context](api-management-policy-expressions.md#ContextVariables). The backend service URL is specified in the API [settings](./import-and-publish.md) and can be changed using the [set backend service](api-management-transformation-policies.md) policy.




## Next steps

* Learn how to [configure policies](api-management-advanced-policies.md) to forward requests to a backend
* Backends can also be configured using the API Management [REST API](/rest/api/apimanagement/2020-06-01-preview/backend) or [Azure Resource Manager templates](../service-fabric/service-fabric-tutorial-deploy-api-management.md)

