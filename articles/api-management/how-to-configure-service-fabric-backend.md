---
title: Set up Service Fabric backend in Azure API Management | Microsoft Docs
description: How to create a Service Fabric service backend in Azure API Management using the Azure portal
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 01/29/2021
ms.author: danlep 
---

# Set up a Service Fabric backend in API Management using the Azure portal

This article shows how to configure a [Service Fabric](../service-fabric/service-fabric-api-management-overview.md) service as a custom API backend using the Azure portal. For demonstration purposes, it shows how to set up a basic stateless ASP.NET Core Reliable Service as the Service Fabric backend.

For background, see [Backends in API Management](backends.md).

## Prerequisites

Prerequisites to configure a sample service in a Service Fabric cluster running Windows as a custom backend:

* **Windows development environment** - Install [Visual Studio 2019](https://www.visualstudio.com) and the **Azure development**, **ASP.NET and web development**, and **.NET Core cross-platform development** workloads. Then set up a [.NET development environment](../service-fabric/service-fabric-get-started.md).

* **Service Fabric cluster** - See [Tutorial: Deploy a Service Fabric cluster running Windows into an Azure virtual network](../service-fabric/service-fabric-tutorial-create-vnet-and-windows-cluster.md). You can create a cluster with an existing X.509 certificate or for test purposes create a new, self-signed certificate. The cluster is created in a virtual network.

* **Sample Service Fabric app** -  Create a Web API app and deploy to the Service Fabric cluster as described in [Integrate API Management with Service Fabric in Azure](../service-fabric/service-fabric-tutorial-deploy-api-management.md).

    These steps create a basic stateless ASP.NET Core Reliable Service using the default Web API project template. Later, you expose the HTTP endpoint for this service through Azure API Management.

    Take note of the application name, for example `fabric:/myApplication/myService`. 

* **API Management instance** - An existing or new API Management instance in the **Premium** or  **Developer** tier and in the same region as the Service Fabric cluster. If you need one, [create an API Management instance](get-started-create-service-instance.md).

* **Virtual network** - Add your API Management instance to the virtual network you created for your Service Fabric cluster. API Management requires a dedicated subnet in the virtual network.

  For steps to enable virtual network connectivity for the API Management instance, see [How to use Azure API Management with virtual networks](api-management-using-with-vnet.md).

## Create backend - portal

### Add Service Fabric cluster certificate to API Management

The Service Fabric cluster certificate is stored and managed in an Azure key vault associated with the cluster. Add this certificate to your API Management instance as a client certificate.

For steps to add a certificate to your API Management instance, see [How to secure backend services using client certificate authentication in Azure API Management](api-management-howto-mutual-certificates.md). 

> [!NOTE]	
> We recommend adding the certificate to API Management by referencing the key vault certificate. 

### Add Service Fabric backend

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Under **APIs**, select **Backends** > **+ Add**.
1. Enter a backend name and an optional description
1. In **Type**, select **Service Fabric**.
1. In **Runtime URL**, enter the name of the Service Fabric backend service that API Management will forward requests to. Example: `fabric:/myApplication/myService`. 
1. In **Maximum number of partition resolution retries**, enter a number between 0 and 10.
1. Enter the management endpoint of the Service Fabric cluster. This endpoint is the URL of the cluster on port `19080`, for example, `https://mysfcluster.eastus.cloudapp.azure.com:19080`.
1. In **Client certificate**, select the Service Fabric cluster certificate you added to your API Management instance in the previous section.
1. In **Management endpoint authorization method**, enter a thumbprint or server X509 name of a certificate used by the Service Fabric cluster management service for TLS communication.
1. Enable the **Validate certificate chain** and **Validate certificate name** settings.
1. In **Authorization credentials**, provide credentials, if necessary, to reach the configured backend service in Service Fabric. For the sample app used in this scenario, authorization credentials aren't needed.
1. Select **Create**.

:::image type="content" source="media/backends/create-service-fabric-backend.png" alt-text="Create a service fabric backend":::

## Use the backend

To use a custom backend, reference it using the [`set-backend-service`](set-backend-service-policy.md) policy. This policy transforms the default backend service base URL of an incoming API request to a specified backend, in this case the Service Fabric backend. 

The `set-backend-service` policy can be useful with an existing API to transform an incoming request to a different backend than the one specified in the API settings. For demonstration purposes in this article, create a test API and set the policy to direct API requests to the Service Fabric backend. 

### Create API

Follow the steps in [Add an API manually](add-api-manually.md) to create a blank API.

* In the API settings, leave the **Web service URL** blank.
* Add an **API URL suffix**, such as *fabric*.

  :::image type="content" source="media/backends/create-blank-api.png" alt-text="Create blank API":::

### Add GET operation to the API

As shown in [Deploy a Service Fabric back-end service](../service-fabric/service-fabric-tutorial-deploy-api-management.md#deploy-a-service-fabric-back-end-service), the sample ASP.NET Core service deployed on the Service Fabric cluster supports a single HTTP GET operation on the URL path `/api/values`.

The default response on that path is a JSON array of two strings:

```json
["value1", "value2"]
```

To test the integration of API Management with the cluster, add the corresponding GET operation to the API on the path `/api/values`:

1. Select the API you created in the previous step.
1. Select **+ Add Operation**.
1. In the **Frontend** window, enter the following values, and select **Save**.

     | Setting             | Value                             | 
    |---------------------|-----------------------------------|
    | **Display name**    | *Test backend*                       |  
    | **URL** | GET                               | 
    | **URL**             | `/api/values`                           | 
    
    :::image type="content" source="media/backends/configure-get-operation.png" alt-text="Add GET operation to API":::

### Configure `set-backend-service` policy

Add the [`set-backend-service`](set-backend-service-policy.md) policy to the test API.

1. On the **Design** tab, in the **Inbound processing** section, select the code editor (**</>**) icon. 
1. Position the cursor inside the **&lt;inbound&gt;** element
1. Add the `set-service-backend` policy statement. 
    * In `backend-id`, substitute the name of your Service Fabric backend.

    * The `sf-resolve-condition` is a condition for re-resolving a service location and resending a request. The number of retries was set when configuring the backend. For example:

      ```xml
      <set-backend-service backend-id="mysfbackend" sf-resolve-condition="@(context.LastError?.Reason == "BackendConnectionFailure")"/>
      ```
1. Select **Save**.

    :::image type="content" source="media/backends/set-backend-service.png" alt-text="Configure set-backend-service policy":::

> [!NOTE]
> If one or more nodes in the Service Fabric cluster goes down or is removed, API Management does not get an automatic notification and continues to send traffic to these nodes. To handle these cases, configure a resolve condition similar to: `sf-resolve-condition="@((int)context.Response.StatusCode != 200 || context.LastError?.Reason == "BackendConnectionFailure" || context.LastError?.Reason == "Timeout")"`

### Test backend API

1. On the **Test** tab, select the **GET** operation you created in a previous section.
1. Select **Send**.

When properly configured, the HTTP response shows an HTTP success code and displays the JSON returned from the backend Service Fabric service.

:::image type="content" source="media/backends/test-backend-service.png" alt-text="Test Service Fabric backend":::

## Next steps

* Learn how to [configure policies](api-management-advanced-policies.md) to forward requests to a backend
* Backends can also be configured using the API Management [REST API](/rest/api/apimanagement/current-ga/backend), [Azure PowerShell](/powershell/module/az.apimanagement/new-azapimanagementbackend), or [Azure Resource Manager templates](../service-fabric/service-fabric-tutorial-deploy-api-management.md)
