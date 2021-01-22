---
title: Azure API Management backends | Microsoft Docs
description: Learn about custom backends in API Management and how to create a Service Fabric service backend in API Management using the Azure portal
services: api-management
documentationcenter: ''
author: dlepow
editor: ''

ms.service: api-management
ms.topic: article
ms.date: 01/21/2021
ms.author: apimpm
---

# Set up an API Management backend using the Azure portal

You can create and manage backends for API Management using the Azure portal, Azure REST APIs, or other Azure tools.

This article shows how to configure a Service Fabric service as a custom backend for API Management using the Azure portal. You can also configure other Azure resources or your own services as custom backends. 

## About backends

A *backend* (or *backend API*) in API Management is an HTTP service that implements your front-end API and its operations.

When importing certain APIs, API Management configures the API backend automatically. For example, API Management configures the backend when importing an [OpenAPI specification](import-api-from-oas.md), [SOAP API](import-soap-api.md), or certain Azure resources directly such as an HTTP-triggered [Azure Function App](import-function-app-as-api.md) or [Logic App](import-logic-app-as-api.md).

API Management also supports using other Azure resources such as a [Service Fabric cluster](../service-fabric/service-fabric-api-management-overview.md) or custom services as an API backend. Using these backends requires extra configuration, for example, to authorize credentials of requests to the backend service and to create API operations.

After creating a backend, you can reference the backend URL in your API Management instance:
* [Manually add a blank API](add-api-manually.md) pointing to the backend URL. Then, add API operations mapping to the backend service. 
* Reference the backend URL from the [`set-backend-service`](api-management-transformation-policies.md#SetBackendService) policy, to redirect an incoming request to a different backend than the one specified in the API settings for that operation.

## Prerequisites

Prerequisites to configure a sample service in a Service Fabric cluster running Windows as a custom backend:

* **Windows development environment** - Install [Visual Studio 2019](https://www.visualstudio.com) and the **Azure development**, **ASP.NET and web development**, and **.NET Core cross-platform development** workloads. Then set up a [.NET development environment](../service-fabric/service-fabric-get-started.md).

* **Service Fabric cluster** - See [Tutorial: Deploy a Service Fabric cluster running Windows into an Azure virtual network](../service-fabric/service-fabric-tutorial-create-vnet-and-windows-cluster.md). You can create a cluster with an existing X.509 certificate or for test purposes create a new, self-signed certificate. The cluster is created in a virtual network.

* **Sample Service Fabric app** -  Create a Web API app and deploy to the Service Fabric cluster as described in [Integrate API Management with Service Fabric in Azure](../service-fabric/service-fabric-tutorial-deploy-api-management.md).

    These steps create a basic stateless ASP.NET Core Reliable Service using the default Web API project template. Later, you expose the HTTP endpoint for this service through Azure API Management.

    Take note of the application name, for example `fabric:/myApplication/myService`. 

* **API Management instance** - An existing or new API Management instance in the **Premium** or  **Developer** tier and in the same region as the Service Fabric cluster. If you need one, [create an API Management instance](get-started-create-service-instance.md).

* **Virtual network** - Add your API Management instance to the virtual network you created for your Service Fabric cluster. Choose the same subnet as the cluster.

  For steps to enable virtual network connectivity for the API Management instance, see [How to use Azure API Management with virtual networks](api-management-using-with-vnet.md).

## Create backend - portal

### Download Service Fabric cluster certificate

If you need a local copy of the Service Fabric cluster certificate with private key, download it from Azure Key Vault.

1. In the [Azure portal](https://portal.azure.com), navigate to the key vault that was used to store the Service Fabric cluster certificate.
1. Select **Settings** > **Certificates**, and then the name of the certificate.
1. Select the version of the certificate you want, and then select **Download in PFX/PEM format**.
1. Save the certificate to secure location on your local system.

### Add certificate to API Management

Add the certificate to your API Management instance as a client certificate. For details, see [How to secure back-end services using client certificate authentication in Azure API Management](api-management-howto-mutual-certificates.md).

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Under **Security**, select **Certificates**.
1. In the **Certificates** tab, select **+Add**.
1. Enter an **Id** of your choice.
1. In **Certificate** and **password**, provide the filename and password of the private key file (.pfx) of the cluster certificate on your local system. Then select **Add**. 

:::image type="content" source="media/backends/add-cluster-certificate.png" alt-text="Add cluster certificate to API Management":::

### Add Service Fabric backend

1. In the [Azure portal](https://management.azure.com), navigate to your API Management instance.
1. Under **APIs**, select **Backends** > **+ Add**.
1. Enter a backend name and an optional description
1. In **Type**, select **Service Fabric**.
1. In **Runtime URL**, enter the name of the Service Fabric backend service that API Management will forward requests to. Example: `fabric:/myApplication/myService`. 
1. In **Maximum number of partition resolution retries**, enter a number between 0 and 10.
1. Enter the management endpoint of the Service Fabric cluster. This endpoint is the URL of the cluster on port `19080`, for example, `https://mysfcluster.eastus.cloudapp.azure.com:19080`.
1. In **Client certificate**, select the certificate you added to your API Management instance in the previous section.
1. In **Management endpoint authorization method**, enter a thumbprint or server X509 name of a certificate used by the Service Fabric cluster management service for TLS communication.
1. Enable the **Validate certificate chain** and **Validate certificate name** settings.
1. In **Authorization credentials**, provide credentials, if necessary, to reach the configured backend service in Service Fabric. For the sample app used in this scenario, authorization credentials aren't needed.
1. Select **Create**.

:::image type="content" source="media/backends/create-service-fabric-backend.png" alt-text="Create a service fabric backend":::

## Use the backend

To use a custom backend, you reference the backend using the [`set-backend-service`](api-management-transformation-policies.md#SetBackendService) policy. This policy changes the default backend service base URL of an incoming API request to a specified backend, in this case the Service Fabric backend. 

The `set-backend-service` policy is often used on an existing API to transform an incoming request to a different backend than the one specified in the API settings. For demonstration purposes in this article, create a test API and set the policy to direct API requests to the Service Fabric backend. 

### Create API

Follow the steps in [Add an API manually](add-api-manually.md) to create a blank API.

* In the API settings, leave the **Web service URL** blank
* Add an **API URL suffix**, such as *fabric*.

  :::image type="content" source="media/backends/create-blank-api.png" alt-text="Create blank API":::

### Add GET operation to the API

As shown in [Deploy a Service Fabric back-end service](../service-fabric/service-fabric-tutorial-deploy-api-management.md#deploy-a-service-fabric-back-end-service), the sample ASP.NET Core service deployed on the Service Fabric cluster supports a single HTTP GET operation on the URL path `api/values`.

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

### Configure `set-backend` policy

Add the [`set-backend-service`](api-management-transformation-policies.md#SetBackendService) policy to the test API.

1. On the **Design** tab, in the **Inbound processing** section, select the code editor (**</>**) icon. 
1. Position the cursor inside the **&lt;inbound&gt;** element
1. Add the following policy statement. In `backend-id`, substitute the name of your Service Fabric backend.

    ```xml
    <set-backend-service backend-id="mysfbackend" sf-resolve-condition="@(context.LastError?.Reason == "BackendConnectionFailure")"  />
    ```
1. Select **Save**.

    :::image type="content" source="media/backends/set-backend-service.png" alt-text="Configure set-backend-service policy":::

### Test backend API

1. On the **Test** tab, select the **GET** operation you created in a previous section.
1. Select **Send**.

When properly configured, the HTTP response shows an HTTP success code and displays the JSON returned from the backend Service Fabric service.

:::image type="content" source="media/backends/test-backend-service.png" alt-text="Test Service Fabric backend":::

## Next steps

* Learn how to [configure policies](api-management-advanced-policies.md) to forward requests to a backend
* Backends can also be configured using the API Management [REST API](/rest/api/apimanagement/2020-06-01-preview/backend), [Azure PowerShell](/powershell/module/az.apimanagement/new-azapimanagementbackend), or [Azure Resource Manager templates](../service-fabric/service-fabric-tutorial-deploy-api-management.md)

