---
title: Azure Service Fabric with API Management quick start | Microsoft Docs
description: This guide shows you how to quickly get started with Azure API Management and Service Fabric.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: timlt
editor: ''

ms.assetid: 96176149-69bb-4b06-a72e-ebbfea84454b
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/01/2017
ms.author: vturecek

---

# Service Fabric with Azure API Management Quick Start

This guide shows you how to set up Azure API Management with Service Fabric and configure your first API operation to send traffic to back-end services in Service Fabric. To learn more about Azure API Management scenarios with Service Fabric, see the [overview](service-fabric-api-management-overview.md) article. 

## Deploy API Management and Service Fabric to Azure

The first step is to deploy API Management and a Service Fabric cluster to Azure in a shared Virtual Network. This allows API Management to communicate directly with Service Fabric so it can perform service discovery, service partition resolution, and forward traffic directly to any backend service in Service Fabric.

### Topology

This guide deploys the following topology to Azure in which API Management and Service Fabric are in subnets of the same Virtual Network:

 ![Picture caption][sf-apim-topology-overview]

To get started quickly, Resource Manager templates are provided for each deployment step:

 - Network topology:
    - [network.json][network-arm]
    - [network.parameters.json][network-parameters-arm]
 - Service Fabric cluster:
    - [cluster.json][cluster-arm]
    - [cluster.parameters.json][cluster-parameters-arm]
 - API Management:
    - [apim.json][apim-arm]
    - [apim.parameters.json][apim-parameters-arm]

### Sign in to Azure and select your subscription

This guide uses [Azure PowerShell][azure-powershell]. When you start a new PowerShell session, sign in to your Azure account and select your subscription before you execute Azure commands.
 
Sign in to your Azure account:

```powershell
PS > Login-AzureRmAccount
```

Select your subscription:

```powershell
PS > Get-AzureRmSubscription
PS > Set-AzureRmContext -SubscriptionId <guid>
```

### Create a resource group

Create a new resource group for your deployment. Give it a name and a location.

```powershell
PS > New-AzureRmResourceGroup -Name <my-resource-group> -Location westus
```

### Deploy the network topology

The first step is to set up the network topology to which API Management and the Service Fabric cluster will be deployed. The [network.json][network-arm] Resource Manager template is configured to create a Virtual Network (VNET) with two subnets and two Network Security Groups (NSG). 

The [network.parameters.json][network-parameters-arm] parameters file contains the names of the subnets and NSGs that API Management and Service Fabric will be deployed to. For this guide, the parameter values do not need to be changed. The API Management and Service Fabric Resource Manager templates use these values, so if they are modified here, you must modify them in the other Resource Manager templates accordingly. 

 1. Download the following Resource Manager template and parameters file:

    - [network.json][network-arm]
    - [network.parameters.json][network-parameters-arm]

 2. Use the following PowerShell command to deploy the Resource Manager template and parameter files for the network setup:

    ```powershell
    PS > New-AzureRmResourceGroupDeployment -ResourceGroupName <my-resource-group> -TemplateFile .\network.json -TemplateParameterFile .\network.parameters.json -Verbose
    ```

### Deploy the Service Fabric cluster

Once the network resources have finished deploying, the next step is to deploy a Service Fabric cluster to the VNET in the subnet and NSG designated for the Service Fabric cluster. For this tutorial, the Service Fabric Resource Manager template is pre-configured to use the names of the VNET, subnet, and NSG that you set up in the previous step. 

The Service Fabric cluster Resource Manager template is configured to create a secure cluster with certificate security. The certificate is used to secure node-to-node communication for your cluster and to manage user access to your Service Fabric cluster. API Management uses this certificate to access  the Service Fabric Naming Service for service discovery.

This step requires having a certificate in Key Vault for cluster security. For more information on setting up a secure cluster with Key Vault, see [this guide on creating a cluster in Azure using Resource Manager](service-fabric-cluster-creation-via-arm.md)

> [!NOTE]
> You may add Azure Active Directory authentication in addition to the certificate used for cluster access. Azure Active Directory is the recommended way to manage user access to your Service Fabric cluster, but is not necessary to complete this tutorial. A certificate is required either way for cluster node-to-node security and for Azure API Management authentication, which currently does not support authenticating with Azure Active Directory for a Service Fabric backend.

 1. Download the following Resource Manager template and parameters file:
 
    - [cluster.json][cluster-arm]
    - [cluster.parameters.json][cluster-parameters-arm]

 2. Fill in the empty parameters in the `cluster.parameters.json` file for your deployment, including the [Key Vault information](service-fabric-cluster-creation-via-arm.md#set-up-a-key-vault) for your cluster certificate.

 3. Use the following PowerShell command to deploy the Resource Manager template and parameter files to create the Service Fabric cluster:

    ```powershell
    PS > New-AzureRmResourceGroupDeployment -ResourceGroupName <my-resource-group> -TemplateFile .\cluster.json -TemplateParameterFile .\cluster.parameters.json -Verbose
    ```

### Deploy API Management

Finally, deploy API Management to the VNET in the subnet and NSG designated for API Management. You do not need to wait for the Service Fabric cluster deployment to finish before deploying API Management. 

For this tutorial, the API Management Resource Manager template is pre-configured to use the names of the VNET, subnet, and NSG that you set up in the previous step. 

 1. Download the following Resource Manager template and parameters file:
 
    - [apim.json][apim-arm]
    - [apim.parameters.json][apim-parameters-arm]

 2. Fill in the empty parameters in the `apim.parameters.json` for your deployment.

 3. Use the following PowerShell command to deploy the Resource Manager template and parameter files for API Management:

    ```powershell
    PS > New-AzureRmResourceGroupDeployment -ResourceGroupName <my-resource-group> -TemplateFile .\apim.json -TemplateParameterFile .\apim.parameters.json -Verbose
    ```

## Configure API Management

Once your API Management and Service Fabric cluster are deployed, you can configure a Service Fabric backend in API Management. This allows you to create a backend service policy that sends traffic to your Service Fabric cluster.

### API Management Security

To configure the Service Fabric backend, you first need to configure API Management security settings. To configure security settings, go to your API Management service in the Azure portal.

#### Enable the API Management REST API

The API Management REST API is currently the only way to configure a backend service. The first step is to enable the API Management REST API and secure it.

 1. In the API Management service, select **Management API - PREVIEW** under **Security**.
 2. Check the **Enable API Management REST API** checkbox.
 3. Note the Management API URL - this is the URL we'll use later to set up the Service Fabric backend
 4. Generate an **access Token** by selecting an expiry date and a key, then click the **Generate** button toward the bottom of the page.
 5. Copy the **access token** and save it - we'll use this in the following steps. Note this is different from the primary key and secondary key.

#### Upload a Service Fabric client certificate

API Management must authenticate with your Service Fabric cluster for service discovery using a client certificate that has access to your cluster. For simplicity, this tutorial uses the same certificate specified when creating the Service Fabric cluster, which by default can be used to access your cluster.

 1. In the API Management service, select **Client certificates - PREVIEW** under **Security**.
 2. Click the **+ Add** button
 2. Select the private key file (.pfx) of the cluster certificate that you specified when creating your Service Fabric cluster, give it a name, and provide the private key password.

> [!NOTE]
> This tutorial uses the same certificate for client authentication and cluster node-to-node security. You may use a separate client certificate if you have one configured to access your Service Fabric cluster.

### Configure the backend

Now that API Management security is configured, you can configure the Service Fabric backend. 
For Service Fabric backends, the Service Fabric cluster is the backend, rather than a specific Service Fabric service. This allows a single policy to route to more than one service in the cluster.

This step requires the access token you generated earlier and the thumbprint for your cluster certificate you uploaded to API Management in the previous step.

> [!NOTE]
> If you used a separate client certificate in the previous step for API Management, you need the thumbprint for the client certificate in addition to the cluster certificate thumbprint in this step.

Send the following HTTP PUT request to the API Management API URL you noted earlier when enabling the API Management REST API to configure the Service Fabric backend service. You should see an `HTTP 201 Created` response when the command succeeds. 
For more information on each field, see the API Management [backend API reference documentation](https://docs.microsoft.com/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-contract-reference#a-namebackenda-backend).

HTTP command and URL:
```http
PUT https://your-apim.management.azure-api.net/backends/servicefabric?api-version=2016-10-10
```

Request headers:
```http
Authorization: SharedAccessSignature <your access token>
Content-Type: application/json
```

Request body:
```http
{
    "description": "<description>",
    "url": "<fallback service name>",
    "protocol": "http",
    "resourceId": "<cluster HTTP management endpoint>",
    "properties": {
        "serviceFabricCluster": {
            "managementEndpoints": [ "<cluster HTTP management endpoint>" ],
            "clientCertificateThumbprint": "<client cert thumbprint>",
            "serverCertificateThumbprints": [ "<cluster cert thumbprint>" ],
            "partitionResolutionRequestTimeout" : "00:02:00",
            "maxPartitionResolutionRetries" : 5
        }
    }
}
```

The **url** parameter here is a fully-qualified service name of a service in your cluster that all requests are routed to by default if no service name is specified in a backend policy. You may use a fake service name, such as "fabric:/fake/service" if you do not intend to have a fallback service.

Refer to the API Management [backend API reference documentation](https://docs.microsoft.com/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-contract-reference#a-namebackenda-backend) for more details on each field.

#### Example

```http
PUT https://your-apim.management.azure-api.net/backends/servicefabric?api-version=2016-10-10
Authorization: SharedAccessSignature 230948023984&Ld93cRGcNU6KZ4uVz7JlfTec4eX43Q9Nu8ndatOgBzs6+f559Pkf3iHX2cSge+r42pn35qGY3TitjrIl13hwcQ==
Content-Type: application/json

{
    "description": "My Service Fabric backend",
    "url": "fabric:/myapp/myservice",
    "protocol": "http",
    "resourceId": "https://your-cluster.westus.cloudapp.azure.com:19080",
    "properties": {
        "serviceFabricCluster": {
            "managementEndpoints": ["https://your-cluster.westus.cloudapp.azure.com:19080"],
            "clientCertificateThumbprint": "57bc463aba3aea3a12a18f36f44154f819f0fe32",
            "serverCertificateThumbprints": ["57bc463aba3aea3a12a18f36f44154f819f0fe32"],
            "partitionResolutionRequestTimeout" : "00:02:00",
            "maxPartitionResolutionRetries" : 5
        }
    }
}
```

## Deploy a Service Fabric back-end service

Now that you have the Service Fabric configured as a backend to API Management, you can author backend policies for your APIs that send traffic to your Service Fabric services. But first you need a service running in Service Fabric to accept requests.

### Create a Service Fabric service with an HTTP endpoint

For this tutorial, we'll create a basic stateless ASP.NET Core Reliable Service using the default Web API project template. This creates an HTTP endpoint for your service, which you'll expose through Azure API Management:

```
/api/values
```

Start by [setting up your development environment for ASP.NET Core development](service-fabric-add-a-web-frontend.md#set-up-your-environment-for-aspnet-core).

Once your development environment is set up, start Visual Studio as Administrator and create an ASP.NET Core service:

 1. In Visual Studio, select File -> New Project.
 2. Select the Service Fabric Application template under Cloud and name it **"ApiApplication"**.
 3. Select the ASP.NET Core service template and name the project **"WebApiService"**.
 4. Select the Web API ASP.NET Core 1.1 project template.
 5. Once the project is created, open `PackageRoot\ServiceManifest.xml` and remove the `Port` attribute from the endpoint resource configuration:
 
    ```xml
    <Resources>
      <Endpoints>
        <Endpoint Protocol="http" Name="ServiceEndpoint" Type="Input" />
      </Endpoints>
    </Resources>
    ```

    This allows Service Fabric to specify a port dynamically from the application port range, which we opened through the Network Security Group in the cluster Resource Manager template, allowing traffic to flow to it from API Management.
 
 6. Press F5 in Visual Studio to verify the web API is available locally. 

    Open Service Fabric Explorer and drill down to a specific instance of the ASP.NET Core service to see the base address the service is listening on. Add `/api/values` to the base address and open it in a browser. This invokes the Get method on the ValuesController in the Web API template. It returns the default response that is provided by the template, a JSON array that contains two strings:

    ```json
    ["value1", "value2"]`
    ```

    This is the endpoint that you'll expose through API Management in Azure.

 7. Finally, deploy the application to your cluster in Azure. [Using Visual Studio](service-fabric-publish-app-remote-cluster.md#to-publish-an-application-using-the-publish-service-fabric-application-dialog-box), right-click the Application project and select **Publish**. Provide your cluster endpoint (for example, `mycluster.westus.cloudapp.azure.com:19000`) to deploy the application to your Service Fabric cluster in Azure.

An ASP.NET Core stateless service named `fabric:/ApiApplication/WebApiService` should now be running in your Service Fabric cluster in Azure.

## Create an API operation

Now we're ready to create an operation in API Management that external clients use to communicate with the ASP.NET Core stateless service running in the Service Fabric cluster.

 1. Log in to the Azure portal and navigate to your API Management service deployment.
 2. In the API Management service blade, select **APIs - Preview**
 3. Add a new API by clicking the **Blank API** box and filling out the dialog box:

     - **Web service URL**: For Service Fabric backends, this URL value is not used. You can put any value here. For this tutorial, use: `http://servicefabric`.
     - **Name**: Provide any name for your API. For this tutorial, use `Service Fabric App`.
     - **URL scheme**: Select either HTTP, HTTPS, or both. For this tutorial, use `both`.
     - **API URL Suffix**: Provide a suffix for our API. For this tutorial, use `myapp`.
 
 4. Once the API is created, click **+ Add operation** to add a front-end API operation. Fill out the values:
    
     - **URL**: Select `GET` and provide a URL path for the API. For this tutorial, use `/api/values`.
     
       By default, the URL path specified here is the URL path sent to the backend Service Fabric service. If you use the same URL path here that your service uses, in this case `/api/values`, then the operation works without further modification. You may also specify a URL path here that is different from the URL path used by your backend Service Fabric service, in which case you will also need to specify a path rewrite in your operation policy later.
     - **Display name**: Provide any name for the API. For this tutorial, use `Values`.

## Configure a backend policy

The backend policy ties everything together. This is where you configure the backend Service Fabric service to which requests are routed. You can apply this policy to any API operation. The [backend configuration for Service Fabric](https://docs.microsoft.com/azure/api-management/api-management-transformation-policies#SetBackendService) provides the following request routing controls: 
 - Service instance selection by specifying a Service Fabric service instance name, either hardcoded (for example, `"fabric:/myapp/myservice"`) or generated from the HTTP request (for example, `"fabric:/myapp/users/" + context.Request.MatchedParameters["name"]`).
 - Partition resolution by generating a partition key using any Service Fabric partitioning scheme.
 - Replica selection for stateful services.
 - Resolution retry conditions that allow you to specify the conditions for re-resolving a service location and resending a request.

For this tutorial, create a backend policy that routes requests directly to the ASP.NET Core stateless service deployed earlier:

 1. Select and edit the **inbound policies** for the `Values` operation by clicking the edit icon, and then selecting **Code View**.
 2. In the policy code editor, add a `set-backend-service` policy under inbound policies as shown here and click the **Save** button:
    
    ```xml
    <policies>
      <inbound>
        <base/>
        <set-backend-service 
           backend-id="servicefabric"
           sf-service-instance-name="fabric:/ApiApplication/WebApiService"
           sf-resolve-condition="@((int)context.Response.StatusCode != 200)" />
      </inbound>
      <backend>
        <base/>
      </backend>
      <outbound>
        <base/>
      </outbound>
    </policies>
    ```

For a full set of Service Fabric back-end policy attributes, refer to the [API Management back-end documentation](https://docs.microsoft.com/azure/api-management/api-management-transformation-policies#SetBackendService)

### Add the API to a product. 

Before you can call the API, it must be added to a product where you can grant access to users. 

 1. In the API Management service, select **Products - PREVIEW**.
 2. By default, API Management providers two products: Starter and Unlimited. Select the Unlimited product.
 3. Select APIs.
 4. Click the **+ Add** button.
 5. Select the `Service Fabric App` API you created in the previous steps and click the **Select** button.

### Test it

You can now try sending a request to your back-end service in Service Fabric through API Management directly from the Azure portal.

 1. In the API Management service, select **API - PREVIEW**.
 2. In the `Service Fabric App` API you created in the previous steps, select the **Test** tab.
 3. Click the **Send** button to send a test request to the backend service.

## Next steps

At this point, you should have a basic setup with Service Fabric and API Management.

This tutorial uses basic certificate-based user authentication for your Service Fabric cluster to get you set up quickly. More advanced user authentication for your Service Fabric cluster is preferable with [Azure Active Directory authentication](service-fabric-cluster-creation-via-arm.md#set-up-azure-active-directory-for-client-authentication). 

Next, [create and configure advanced product settings in Azure API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-product-with-rules) to prepare your application for real world traffic.

<!-- links -->
[azure-powershell]:https://azure.microsoft.com/documentation/articles/powershell-install-configure/

[network-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/network.json
[network-parameters-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/network.parameters.json

[apim-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/apim.json
[apim-parameters-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/apim.parameters.json

[cluster-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/cluster.json
[cluster-parameters-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/cluster.parameters.json


<!-- pics -->
[sf-apim-topology-overview]: ./media/service-fabric-api-management-quickstart/sf-apim-topology-overview.png
