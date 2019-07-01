---
title: Tutorial- Deploy an app to Azure Service Fabric Mesh | Microsoft Docs
description: In this tutorial, you learn how to deploy an application to Service Fabric Mesh using a template.
services: service-fabric-mesh
documentationcenter: .net
author: dkkapur
manager: jeconnoc
editor: ''
ms.assetid:  
ms.service: service-fabric-mesh
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/11/2019
ms.author: dekapur
ms.custom: mvc, devcenter
#Customer intent: As a developer, I want learn how to create a Service Fabric Mesh app that communicates with another service, and then publish it to Azure.
---

# Tutorial: Deploy an application to Service Fabric Mesh using a template

This tutorial is part one of a series. You'll learn how to deploy an Azure Service Fabric Mesh application using a template.  The application is composed of an ASP.NET web front-end service and an ASP.NET Core Web API back-end service, which are found in Docker Hub.  You pull the two container images from Docker Hub and then push them to your own private registry. You then create an Azure RM template for the application and deploy the application from your container registry to Service Fabric Mesh. When you're finished, you'll have a simple To Do List application running in Service Fabric Mesh.

In part one of the series, you learn how to:

> [!div class="checklist"]
> * Create a private Azure Container Registry instance
> * Push a container image to the registry
> * Create RM template and parameters files
> * Deploy an application to Service Fabric Mesh

In this tutorial series you learn how to:
> [!div class="checklist"]
> * Deploy an application to Service Fabric Mesh using a template
> * [Scale services in an application running in Service Fabric Mesh](service-fabric-mesh-tutorial-template-scale-services.md)
> * [Upgrade an application running in Service Fabric Mesh](service-fabric-mesh-tutorial-template-upgrade-app.md)
> * [Remove an application](service-fabric-mesh-tutorial-template-remove-app.md)

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* [Install Docker](service-fabric-mesh-howto-setup-developer-environment-sdk.md#install-docker)

* [Install the Azure CLI and Service Fabric Mesh CLI locally](service-fabric-mesh-howto-setup-cli.md#install-the-azure-service-fabric-mesh-cli).

## Create a container registry

The container images associated with the services in your Service Fabric Mesh application must be stored in a container registry.  This tutorial uses a private Azure Container Registry (ACR)instance. 

Use the following steps to create an ACR instance.  If you already have an ACR instance setup, you can skip ahead.

### Sign in to Azure

Sign in to Azure and set the active subscription.

```azurecli
az login
az account set --subscription "<subscriptionName>"
```

### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed. Use the following command to create a resource group named *myResourceGroup* in the *eastus* location.

```azurecli
az group create --name myResourceGroup --location eastus
```

### Create the container registry

Create an ACR instance using the `az acr create` command. The registry name must be unique within Azure and contain 5-50 alphanumeric characters. In the following example, the name *myContainerRegistry* is used. If you get an error that the registry name is in use, choose a different name.

```azurecli
az acr create --resource-group myResourceGroup --name myContainerRegistry --sku Basic
```

When the registry is created, you'll see output similar to the following:

```json
{
  "adminUserEnabled": false,
  "creationDate": "2018-09-13T19:43:57.388203+00:00",
  "id": "/subscriptions/<subscription>/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myContainerRegistry",
  "location": "eastus",
  "loginServer": "mycontainerregistry.azurecr.io",
  "name": "myContainerRegistry",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "status": null,
  "storageAccount": null,
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

## Push the images to Azure Container Registry

This tutorial uses the To Do List sample application as an example.  The container images for the [WebFrontEnd](https://hub.docker.com/r/seabreeze/azure-mesh-todo-webfrontend/) and the [ToDoService](https://hub.docker.com/r/seabreeze/azure-mesh-todo-service/) services can be found on Docker Hub. See [Build a Service Fabric Mesh web app](service-fabric-mesh-tutorial-create-dotnetcore.md) for information on how to build the application in Visual Studio. Service Fabric Mesh can run Windows or Linux Docker containers.  If you're working with Linux containers, select **Switch to Linux containers** in Docker.  If you're working with Windows containers, select **Switch to Windows containers** in Docker.

To push an image to an ACR instance, you must first have a container image. If you don't yet have any local container images, use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to pull the [WebFrontEnd](https://hub.docker.com/r/seabreeze/azure-mesh-todo-webfrontend/) and [ToDoService](https://hub.docker.com/r/seabreeze/azure-mesh-todo-service/) images from Docker Hub.

Pull the Windows images:

```bash
docker pull seabreeze/azure-mesh-todo-webfrontend:1.0-nanoserver-1709
docker pull seabreeze/azure-mesh-todo-service:1.0-nanoserver-1709
```

Before you can push an image to your registry, you must tag it with the fully qualified name of your ACR login server.

Run the following command to get the full login server name of your ACR instance.

```azurecli
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table

AcrLoginServer
---------------------------------
mycontainerregistry.azurecr.io
```

Now tag your Docker image using the [docker tag](https://docs.docker.com/engine/reference/commandline/tag/) command. The following example tags the seabreeze/azure-mesh-todo-service:1.0-nanoserver-1709 and seabreeze/azure-mesh-todo-webfrontend:1.0-nanoserver-1709 images. If you are using different images, substitute those image names in the following command.

```bash
docker tag seabreeze/azure-mesh-todo-webfrontend:1.0-nanoserver-1709 mycontainerregistry.azurecr.io/seabreeze/azure-mesh-todo-webfrontend:1.0-nanoserver-1709
docker tag seabreeze/azure-mesh-todo-service:1.0-nanoserver-1709 mycontainerregistry.azurecr.io/seabreeze/azure-mesh-todo-service:1.0-nanoserver-1709
```

Sign in to the Azure Container Registry.

```azurecli
az acr login -n myContainerRegistry
```

Push the image to the ACR instance with the [docker push](https://docs.docker.com/engine/reference/commandline/push/) command:

```bash
docker push mycontainerregistry.azurecr.io/seabreeze/azure-mesh-todo-webfrontend:1.0-nanoserver-1709
docker push mycontainerregistry.azurecr.io/seabreeze/azure-mesh-todo-service:1.0-nanoserver-1709
```

### List container images

To see the repositories in your ACR instance, run the following:

```azurecli
az acr repository list --name myContainerRegistry --output table

Result
-------------------------------
seabreeze/azure-mesh-todo-webfrontend
seabreeze/azure-mesh-todo-service
```

The following example lists the tags on the **azure-mesh-todo-service** repository.

```azurecli
az acr repository show-tags --name myContainerRegistry --repository seabreeze/azure-mesh-todo-service --output table

Result
--------
1.0-nanoserver-1709
```

The preceding output confirms the presence of `azure-mesh-todo-service:1.0-nanoserver-1709` in the private container registry.  Also verify the presence of `azure-mesh-todo-webfrontend:1.0-nanoserver-1709`.

## Retrieve credentials for the registry

> [!IMPORTANT]
> Enabling the admin user on an ACR instance is not recommended for production scenarios. It is done here for convenience. For production scenarios, use a [service principal](https://docs.microsoft.com/azure/container-registry/container-registry-auth-service-principal) for both user and system authentication in production scenarios.

In order to deploy a container instance from the registry that was created using a template, you must provide the registry credentials during the deployment. First, enable the admin user on your registry with the following command:

```azurecli
az acr update --name myContainerRegistry --admin-enabled true
```

Next, get the registry login server name, user name, and password using the following commands:

```azurecli
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
az acr credential show --name myContainerRegistry --query username
az acr credential show --name myContainerRegistry --query "passwords[0].value"
```

Use the returned ACR login server name, user name, and password values when creating the RM template and parameters files in the following section.

## Download and explore the template and parameters files

A Service Fabric Mesh application is an Azure resource that you can deploy and manage using Azure Resource Manager (RM) templates. If you aren't familiar with the concepts of deploying and managing your Azure solutions, see [Azure Resource Manager overview](/azure/azure-resource-manager/resource-group-overview) and [Understand the structure and syntax of RM Templates](/azure/azure-resource-manager/resource-group-authoring-templates).

This tutorial uses the To Do List sample as an example.  Instead of building new template and parameters files, download the [mesh_rp.windows.json deployment template](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.json) and [mesh_rp.windows.parameter.json parameters](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.parameters.json) files.

### Parameters
When you have values in your template that you anticipate changing once the application is deployed, or would like to have the option to change on a per deployment basis (if you plan on reusing this template for other deployments), the best practice is to parameterize the values. The right way to do this is to create a "parameters" section at the top of your deployment template, where you specify parameter names and properties, which are then referenced later in the deployment template. Each parameter definition includes *type*, *defaultValue*, and an optional *metadata* section with a *description*.

The parameters section is defined at the top of your deployment template, right before the *resources* section:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
      ...
    },
    "resources": [
```

In the [mesh_rp.windows.json deployment template](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.json), the following parameters are declared: location, registryPassword, registryUserName, registryServer, frontEndImage, serviceImage, frontEndCpu, serviceCpu, frontEndMemory, serviceMemory, frontEndReplicaCount, serviceReplicaCount.  Descriptions for each parameter can be found in the deployment template file.

These parameters are used in the [mesh_rp.windows.parameter.json parameters](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.parameters.json) file.  Using a separate parameters file gives you the ability to change parameter values from deployment to deployment without updating the deployment template itself.

### Overview of the application and services

Services are specified in the template as properties of the application resource.  Applications are deployed to a private network, which is declared as a resource in the template.  Services can use volumes to persist data, which are declared as resources in the template.  For each service, the OS type, code package(s), number of replicas, and the network are specified as properties of the service.  For each code package, specify the container image, endpoints, memory and CPU resources, and image repository credentials. At a high level, the template for a Service Fabric Mesh application with multiple services looks like:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json",
  "contentVersion": "1.0.0.0",
  "parameters": {
    ...
  },
  "resources": [
    {
      "apiVersion": "2018-09-01-preview",
      "name": "MyMeshApplication",
      "type": "Microsoft.ServiceFabricMesh/applications",
      "location": "[parameters('location')]",
      "dependsOn": [
        "Microsoft.ServiceFabricMesh/networks/MeshAppNetwork",
        "Microsoft.ServiceFabricMesh/volumes/ServiceAVolume"
      ],
      "properties": {
        "services": [
          {
            "name": "ServiceA",
            "properties": {
              "description": "ServiceA description.",
              "osType": "Linux",
              "codePackages": [
                {
                  "name": "ServiceA",
                  "image": "[parameters('frontEndImage')]",
                  "volumeRefs": [
                    {
                      "name": "[resourceId('Microsoft.ServiceFabricMesh/volumes', 'ServiceAVolume')]",
                      "destinationPath": "/app/data"
                    }
                  ],
                  "endpoints": [
                    {
                      "name": "ServiceAListener",
                      "port": 20001
                    }
                  ],
                  "resources": {
                    "requests": {
                      "cpu": "[parameters('frontEndCpu')]",
                      "memoryInGB": "[parameters('frontEndMemory')]"
                    }
                  },
                  "imageRegistryCredential": {
                    "server": "[parameters('registryServer')]",
                    "username": "[parameters('registryUserName')]",
                    "password": "[parameters('registryPassword')]"
                  }
                }
              ],
              "replicaCount": "[parameters('frontEndReplicaCount')]",
              "networkRefs": [
                {
                  "name": "[resourceId('Microsoft.ServiceFabricMesh/networks', 'MeshAppNetwork')]"
                }
              ]
            }
          },
          {
            "name": "ServiceB",
            ...
          }
        ],
        "description": "Application description."
      }
    },
    {
      "apiVersion": "2018-07-01-preview",
      "name": "MeshAppNetwork",
      "type": "Microsoft.ServiceFabricMesh/networks",
      "location": "[parameters('location')]",
      "dependsOn": [],
      "properties": {
        "description": "MeshAppNetwork description.",
        "addressPrefix": "10.0.0.4/22",
        "ingressConfig": {
          "layer4": [
            {
              "name": "ServiceAIngress",
              "publicPort": "20001",
              "applicationName": "MyMeshApplication",
              "serviceName": "ServiceA",
              "endpointName": "ServiceAListener"
            }
          ]
        }
      }
    },
    {
      "apiVersion": "2018-09-01-preview",
      "name": "ServiceAVolume",
      "type": "Microsoft.ServiceFabricMesh/volumes",
      "location": "[parameters('location')]",
      "dependsOn": [],
      "properties": {
        "description": "Azure Files storage volume for counter App.",
        "provider": "SFAzureFile",
        "azureFileParameters": {
          "shareName": "[parameters('fileShareName')]",
          "accountName": "[parameters('storageAccountName')]",
          "accountKey": "[parameters('storageAccountKey')]"
        }
      }
    }
  ]
}
```

Refer to the [mesh_rp.windows.json deployment template](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.json) file for the specifics of the To Do List application.

## Deploy the application to Service Fabric Mesh
Create the application and related resources using the following command, and provide the credentials from the previous [Retrieve credentials for the registry](#retrieve-credentials-for-the-registry) step.

In the parameters file, update the following parameter values:

|Parameter|Value|
|---|---|
|location|The region to deploy the application to.  For example, "eastus".|
|registryPassword|The password you obtained previously in [Retrieve credentials for the registry](#retrieve-credentials-for-the-registry). This parameter in the template is a secure string and will not be displayed in the deployment status or `az mesh service show` commands.|
|registryUserName|The username you obtained in [Retrieve credentials for the registry](#retrieve-credentials-for-the-registry).|
|registryServer|The registry server name you obtained in [Retrieve credentials for the registry](#retrieve-credentials-for-the-registry).|
|frontEndImage|The container image for the front end service.  For example, `<myregistry>.azurecr.io/seabreeze/azure-mesh-todo-webfrontend:1.0-nanoserver-1709`.|
|serviceImage|The container image for the back end service.  For example, `<myregistry>.azurecr.io/seabreeze/azure-mesh-todo-service:1.0-nanoserver-1709`.|

To deploy the application, run the following:

```azurecli
az mesh deployment create --resource-group myResourceGroup --template-file c:\temp\mesh_rp.windows.json --parameters c:\temp\mesh_rp.windows.parameters.json
```

This command will produce a JSON snippet that is shown below. Under the ```outputs``` section of the JSON output, copy the ```publicIPAddress``` property.

```json
"outputs": {
    "publicIPAddress": {
    "type": "String",
    "value": "40.83.78.216"
    }
}
```

This information comes from the ```outputs``` section in the ARM template. As shown below, this section references the Gateway resource to fetch the public IP address. 

```json
  "outputs": {
    "publicIPAddress": {
      "value": "[reference('todolistappGateway').ipAddress]",
      "type": "string"
    }
  }
```

## Open the application

Once the application successfully deploys, get the public IP address for the service endpoint. The deployment command returns the public IP address of the service endpoint. Optionally, you can also query the network resource to find the public IP address of the service endpoint. The network resource name for this application is `todolistappNetwork`, fetch information about it using the following command. 

```azurecli
az mesh gateway show --resource-group myResourceGroup --name todolistappGateway
```

Navigate to the IP address in a web browser.

## Check application status

You can check the application's status using the app show command. The application name for the deployed application is "todolistapp", so fetch its details.

```azurecli
az mesh app show --resource-group myResourceGroup --name todolistapp
```

Examine the logs for the deployed application using the `az mesh code-package-log get` command:
```azurecli
az mesh code-package-log get --resource-group myResourceGroup --application-name todolistapp --service-name WebFrontEnd --replica-name 0 --code-package-name WebFrontEnd
```

## Next steps

In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * Create a private container registry
> * Push a container image to the registry
> * Create a template and parameters file
> * Deploy an application to Service Fabric Mesh

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Scale an application running in Service Fabric Mesh](service-fabric-mesh-tutorial-template-scale-services.md)
