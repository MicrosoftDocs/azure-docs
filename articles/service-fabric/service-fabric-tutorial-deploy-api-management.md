---
title: Integrate Azure Service Fabric with API Management | Microsoft Docs
description: Learn how to quickly get started with Azure API Management and Service Fabric.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/13/2017
ms.author: ryanwi

---

# Deploy API Management with Service Fabric
This tutorial is part three of a series.  Deploying Azure API Management with Service Fabric is an advanced scenario, useful when you need to publish APIs with a rich set of routing rules to your back-end Service Fabric services. Cloud applications typically need a front-end gateway to provide a single point of ingress for users, devices, or other applications. In Service Fabric, a gateway can be any stateless service such as an ASP.NET Core application, or another service designed for traffic ingress, such as Event Hubs, IoT Hub, or Azure API Management. This tutorial shows you how to set up [Azure API Management](../api-management/api-management-key-concepts.md) with Service Fabric to route traffic to a back-end service in Service Fabric.  When you're finished, you have deployed API Management to a VNET, configured an API operation to send traffic to back-end stateless services. To learn more about Azure API Management scenarios with Service Fabric, see the [overview](service-fabric-api-management-overview.md) article.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy API Management
> * Configure API Management
> * Create an API operation
> * Configure a backend policy
> * Add the API to a product

In this tutorial series you learn how to:
> [!div class="checklist"]
> * Create a secure [Windows cluster](service-fabric-tutorial-create-vnet-and-windows-cluster.md) or [Linux cluster](service-fabric-tutorial-create-vnet-and-linux-cluster.md) on Azure using a template
> * Deploy API Management with Service Fabric

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Install the [Azure Powershell module version 4.1 or higher](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) or [Azure CLI 2.0](/cli/azure/install-azure-cli).
- Create a secure [Windows cluster](service-fabric-tutorial-create-vnet-and-windows-cluster.md) or [Linux cluster](service-fabric-tutorial-create-vnet-and-linux-cluster.md) on Azure
- If you deploy a Windows cluster, set up a Windows development environment. Install [Visual Studio 2017](http://www.visualstudio.com) and the **Azure development**, **ASP.NET and web development**, and **.NET Core cross-platform development** workloads.  Then set up a [.NET development environment](service-fabric-get-started.md).
- If you deploy a Linux cluster, set up a Java development environment on [Linux](service-fabric-get-started-linux.md) or [MacOS](service-fabric-get-started-mac.md).  Install the [Service Fabric CLI](service-fabric-cli.md). 

## Network topology
Now that you have a secure [Windows cluster](service-fabric-tutorial-create-vnet-and-windows-cluster.md) or [Linux cluster](service-fabric-tutorial-create-vnet-and-linux-cluster.md) on Azure, deploy API Management to the virtual network (VNET) in the subnet and NSG designated for API Management. For this tutorial, the API Management Resource Manager template is pre-configured to use the names of the VNET, subnet, and NSG that you set up in the previous [Windows cluster tutorial](service-fabric-tutorial-create-vnet-and-windows-cluster.md) or [Linux cluster tutorial](service-fabric-tutorial-create-vnet-and-linux-cluster.md). This tutorial deploys the following topology to Azure in which API Management and Service Fabric are in subnets of the same Virtual Network:

 ![Picture caption][sf-apim-topology-overview]

## Sign in to Azure and select your subscription
Sign in to your Azure account select your subscription before you execute Azure commands.

```powershell
Login-AzureRmAccount
Get-AzureRmSubscription
Set-AzureRmContext -SubscriptionId <guid>
```

```azurecli
az login
az account set --subscription <guid>
```

## Deploy a Service Fabric back-end service

Before configuring API Management to route traffic to a Service Fabric back-end service, first you need a running service to accept requests.  If you previously created a [Windows cluster](service-fabric-tutorial-create-vnet-and-windows-cluster.md), deploy a .NET Service Fabric service.  If you previously created a [Linux cluster](service-fabric-tutorial-create-vnet-and-linux-cluster.md), deploy a Java Service Fabric service.

### Deploy a .NET Service Fabric service

For this tutorial, we create a basic stateless ASP.NET Core Reliable Service using the default Web API project template. This creates an HTTP endpoint for your service, which you expose through Azure API Management.

Start Visual Studio as Administrator and create an ASP.NET Core service:

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

    This is the endpoint that you expose through API Management in Azure.

 7. Finally, deploy the application to your cluster in Azure. [Using Visual Studio](service-fabric-publish-app-remote-cluster.md#to-publish-an-application-using-the-publish-service-fabric-application-dialog-box), right-click the Application project and select **Publish**. Provide your cluster endpoint (for example, `mycluster.southcentralus.cloudapp.azure.com:19000`) to deploy the application to your Service Fabric cluster in Azure.

An ASP.NET Core stateless service named `fabric:/ApiApplication/WebApiService` should now be running in your Service Fabric cluster in Azure.

### Create a Java Service Fabric service
For this tutorial, we deploy a basic web server which echoes messages back to the user. The echo server sample application contains an HTTP endpoint for your service, which you expose through Azure API Management.

1. Clone the Java getting started samples.

   ```bash
   git clone https://github.com/Azure-Samples/service-fabric-java-getting-started.git
   cd service-fabric-java-getting-started
   ```

2. Edit *Services/EchoServer/EchoServer1.0/EchoServerApplication/EchoServerPkg/ServiceManifest.xml*. Update the endpoint so the service listens on port 8081.

   ```xml
   <Endpoint Name="WebEndpoint" Protocol="http" Port="8081" />
   ```

3. Save *ServiceManifest.xml*, then build the EchoServer1.0 application.

   ```bash
   cd Services/EchoServer/EchoServer1.0/
   gradle
   ```

4. Deploy the application to the cluster.

   ```bash
   cd Scripts
   sfctl cluster select --endpoint http://mycluster.southcentralus.cloudapp.azure.com:19080
   ./install.sh
   ```

   A Java stateless service named `fabric:/EchoServerApplication/EchoServerService` should now be running in your Service Fabric cluster in Azure.

5. Open a browser and type in http://mycluster.southcentralus.cloudapp.azure.com:8081/getMessage, you should see "[version 1.0]Hello World !!!" displayed.

## Download and understand the Azure Resource Manager template
Download and save the following Resource Manager template and parameters file:
 
- [apim.json][apim-arm]
- [apim.parameters.json][apim-parameters-arm]

The following sections describe the resources being defined by the *apim.json* template. For more information on the , follow the links to the template reference documentation within each section. The configurable parameters defined in the *apim.parameters.json* paramters file are set later in this article.

### Microsoft.ApiManagement/service
[Microsoft.ApiManagement/service](/azure/templates/microsoft.apimanagement/service) describes the API Managment service instance: name, SKU or tier, resource group location, publisher information, and virtual network.

### Microsoft.ApiManagement/service/certificates
[Microsoft.ApiManagement/service/certificates](/azure/templates/microsoft.apimanagement/service/certificates) configures API Management security. API Management must authenticate with your Service Fabric cluster for service discovery using a client certificate that has access to your cluster. This tutorial uses the same certificate specified previously when creating the [Windows cluster](service-fabric-tutorial-create-vnet-and-windows-cluster.md#createvaultandcert_anchor) or [Linux cluster](service-fabric-tutorial-create-vnet-and-linux-cluster.md#createvaultandcert_anchor), which by default can be used to access your cluster. This tutorial uses the same certificate for client authentication and cluster node-to-node security. You may use a separate client certificate if you have one configured to access your Service Fabric cluster. Provide the name, password, and data (base-64 encoded) of the private key file (.pfx) of the cluster certificate that you specified when creating your Service Fabric cluster.

### Microsoft.ApiManagement/service/backends
[Microsoft.ApiManagement/service/backends](/azure/templates/microsoft.apimanagement/service/backends) configures the Service Fabric backend. For Service Fabric backends, the Service Fabric cluster is the backend instead of a specific Service Fabric service. This allows a single policy to route to more than one service in the cluster. The **url** parameter here is a fully qualified service name of a service in your cluster that all requests are routed to by default if no service name is specified in a backend policy. You may use a fake service name, such as "fabric:/fake/service" if you do not intend to have a fallback service. The cluster managment endpoint and certificate thumbprint are used to identify the cluster.

### Microsoft.ApiManagement/service/products
[Microsoft.ApiManagement/service/products](/azure/templates/microsoft.apimanagement/service/products) configures the product. In Azure API Management, a product contains one or more APIs as well as a usage quota and the terms of use. Once a product is published, developers can subscribe to the product and begin to use the product's APIs. For this tutorial, a subscription is required but subcription approval by an admin is not.  This product is "published" and is visible to subscribers. 

### Microsoft.ApiManagement/service/apis

### Microsoft.ApiManagement/service/apis/operations
Now we're ready to create an operation in API Management that external clients use to communicate with the ASP.NET Core stateless service running in the Service Fabric cluster.
    - **Web service URL**: For Service Fabric backends, this URL value is not used. You can put any value here. For this tutorial, use: "http://servicefabric".
    - **Display Name**: Provide any name for your API. For this tutorial, use "Service Fabric App".
    - **Name**: Enter "service-fabric-app".
    - **URL scheme**: Select either **HTTP**, **HTTPS**, or **both**. For this tutorial, use **both**.
    - **API URL Suffix**: Provide a suffix for our API. For this tutorial, use "myapp".

to add a front-end API operation. Fill out the values:
    
    - **URL**: Select **GET** and provide a URL path for the API. For this tutorial, use "/api/values".  By default, the URL path specified here is the URL path sent to the backend Service Fabric service. If you use the same URL path here that your service uses, in this case "/api/values", then the operation works without further modification. You may also specify a URL path here that is different from the URL path used by your backend Service Fabric service, in which case you also need to specify a path rewrite in your operation policy later.
    - **Display name**: Provide any name for the API. For this tutorial, use "Values".

### Microsoft.ApiManagement/service/apis/policies
The backend policy ties everything together. This is where you configure the backend Service Fabric service to which requests are routed. You can apply this policy to any API operation. The [backend configuration for Service Fabric](https://docs.microsoft.com/azure/api-management/api-management-transformation-policies#SetBackendService) provides the following request routing controls: 
 - Service instance selection by specifying a Service Fabric service instance name, either hardcoded (for example, `"fabric:/myapp/myservice"`) or generated from the HTTP request (for example, `"fabric:/myapp/users/" + context.Request.MatchedParameters["name"]`).
 - Partition resolution by generating a partition key using any Service Fabric partitioning scheme.
 - Replica selection for stateful services.
 - Resolution retry conditions that allow you to specify the conditions for re-resolving a service location and resending a request.

For this tutorial, create a backend policy that routes requests directly to the ASP.NET Core stateless service deployed earlier. Add a `set-backend-service` policy under inbound policies as shown here and click the **Save** button:
    
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

### Microsoft.ApiManagement/service/products/apis

## Set parameters and deploy API Management
Fill in the following empty parameters in the *apim.parameters.json* for your deployment.

|Parameter|Value|Description|
|---|---|---|
|apimInstanceName|sf-apim||
|apimPublisherEmail|myemail@contosos.com||
|apimSku|Developer||
|serviceFabricCertificateName|sfclustertutorialgroup320171031144217||
|certificatePassword|q6D7nN%6ck@6||
|serviceFabricCertificate|0C6CFFA0DE2573E8CD3C161A65E584B5BDAD65B1||
|url_path|/api/values||
|clusterHttpManagementEndpoint|https://mysfcluster321.westus2.cloudapp.azure.com:19080||
|inbound_policy|<policies>\r\n  <inbound>\r\n    <base />\r\n    <set-backend-service backend-id=\"servicefabric\" sf-service-instance-name=\"fabric:/ApiApplication/WebApiService\" sf-resolve-condition=\"@((int)context.Response.StatusCode != 200)\" />\r\n  </inbound>\r\n  <backend>\r\n    <base />\r\n  </backend>\r\n  <outbound>\r\n    <base />\r\n  </outbound>\r\n  <on-error>\r\n    <base />\r\n  </on-error>\r\n</policies>||

Use the following script to deploy the Resource Manager template and parameter files for API Management:

```powershell
$ResourceGroupName = "tutorialgroup"
New-AzureRmResourceGroupDeployment -ResourceGroupName $ResourceGroupName -TemplateFile .\apim.json -TemplateParameterFile .\apim.parameters.json -Verbose
```

```azurecli
ResourceGroupName="tutorialgroup"
az group deployment create --name ApiMgmtDeployment --resource-group $ResourceGroupName --template-file apim.json --parameters @apim.parameters.json 
```

## Test it

You can now try sending a request to your back-end service in Service Fabric through API Management directly from the Azure portal.

 1. In the API Management service, select **API**.
 2. In the **Service Fabric App** API you created in the previous steps, select the **Test** tab and then the **Values** operation.
 3. Click the **Send** button to send a test request to the backend service.  You should see an HTTP response similar to:

    ```http
    HTTP/1.1 200 OK

    Transfer-Encoding: chunked

    Content-Type: application/json; charset=utf-8

    Vary: Origin

    Access-Control-Allow-Origin: https://apimanagement.hosting.portal.azure.net

    Access-Control-Allow-Credentials: true

    Access-Control-Expose-Headers: Transfer-Encoding,Date,Server,Vary,Ocp-Apim-Trace-Location

    Ocp-Apim-Trace-Location: https://apimgmtstuvyx3wa3oqhdbwy.blob.core.windows.net/apiinspectorcontainer/RaVVuJBQ9yxtdyH55BAsjQ2-1?sv=2015-07-08&sr=b&sig=Ab6dPyLpTGAU6TdmlEVu32DMfdCXTiKAASUlwSq3jcY%3D&se=2017-09-15T05%3A49%3A53Z&sp=r&traceId=ed9f1f4332e34883a774c34aa899b832

    Date: Thu, 14 Sep 2017 05:49:56 GMT


    [
    "value1",
    "value2"
    ]
    ```

## Clean up resources

A cluster is made up of other Azure resources in addition to the cluster resource itself. The simplest way to delete the cluster and all the resources it consumes is to delete the resource group.

Log in to Azure and select the subscription ID with which you want to remove the cluster.  You can find your subscription ID by logging in to the [Azure portal](http://portal.azure.com). Delete the resource group and all the cluster resources using the [Remove-AzureRMResourceGroup cmdlet](/en-us/powershell/module/azurerm.resources/remove-azurermresourcegroup).

```powershell
$ResourceGroupName = "tutorialgroup"
Remove-AzureRmResourceGroup -Name $ResourceGroupName -Force
```

```azurecli
ResourceGroupName="tutorialgroup"
az group delete --name $ResourceGroupName
```

## Conclusion
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Deploy API Management
> * Configure API Management
> * Create an API operation
> * Configure a backend policy
> * Add the API to a product

[azure-powershell]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/

[apim-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/apim.json
[apim-parameters-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/apim.parameters.json

[network-arm]: https://github.com/Azure-Samples/service-fabric-api-management/blob/master/network.json
[network-parameters-arm]: https://github.com/Azure-Samples/service-fabric-api-management/blob/master/network.parameters.json

[cluster-arm]: https://github.com/Azure-Samples/service-fabric-api-management/blob/master/cluster.json
[cluster-parameters-arm]: https://github.com/Azure-Samples/service-fabric-api-management/blob/master/cluster.parameters.json

<!-- pics -->
[sf-apim-topology-overview]: ./media/service-fabric-tutorial-deploy-api-management/sf-apim-topology-overview.png
