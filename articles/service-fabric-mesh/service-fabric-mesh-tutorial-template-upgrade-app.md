---
title: Tutorial- Upgrade an app running in Azure Service Fabric Mesh 
description: In this tutorial, you learn how to upgrade a Service Fabric application running in Service Fabric Mesh.
author: dkkapur
ms.topic: tutorial
ms.date: 01/11/2019
ms.author: dekapur
ms.custom: mvc, devcenter
#Customer intent: As a developer, I want learn how to create a Service Fabric Mesh app that communicates with another service, and then publish it to Azure.
---

# Tutorial: Upgrade a Service Fabric application running in Service Fabric Mesh

This tutorial is part three of a series. You'll learn how to upgrade a Service Fabric application that was [previously deployed to Service Fabric Mesh](service-fabric-mesh-tutorial-template-deploy-app.md) by increasing the allocated CPU resources.  When you're finished, you'll have a web front-end service running with higher CPU resources.

In part three of the series, you learn how to:

> [!div class="checklist"]
> * Change application configurations
> * Upgrade an application running in Service Fabric Mesh

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Deploy an application to Service Fabric Mesh using a template](service-fabric-mesh-tutorial-template-deploy-app.md)
> * [Scale an application running in Service Fabric Mesh](service-fabric-mesh-tutorial-template-scale-services.md)
> * Upgrade an application running in Service Fabric Mesh
> * [Remove an application](service-fabric-mesh-tutorial-template-remove-app.md)

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Open [Azure Cloud Shell](service-fabric-mesh-howto-setup-cli.md), or [install the Azure CLI and Service Fabric Mesh CLI locally](service-fabric-mesh-howto-setup-cli.md#install-the-azure-service-fabric-mesh-cli).

## Upgrade application configurations

One of the main advantages of deploying applications to Service Fabric Mesh is the ability for you to easily update your application configuration.  For example, the CPU or memory resources for your services.

This tutorial uses the To Do List sample as an example, which was [deployed previously](service-fabric-mesh-tutorial-template-deploy-app.md) and should now be running. The application has two services: WebFrontEnd and ToDoService. Each service was initially deployed with CPU resources of 0.5.  To view the CPU resources for the WebFrontEnd service, run the following:

```azurecli
az mesh service show --resource-group myResourceGroup --name WebFrontEnd --app-name todolistapp
```

In the deployment template for the application resource, each service has a *cpu* property that can be used to set the requested CPU resources. An application can consist of multiple services, each service with a unique *cpu* setting, which are deployed and managed together. In order to increase the CPU resources of the web front-end service, modify the *cpue* value in the deployment template or parameters file.  Then upgrade the application.

### Modify the deployment template parameters

When you have values in your template that you anticipate changing once the application is deployed, or would like to have the option to change on a per deployment basis (if you plan on reusing this template for other deployments), the best practice is to parameterize the values.

Previously, the application was deployed using the [mesh_rp.windows.json deployment template](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.json) and [mesh_rp.windows.parameter.json parameters](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.parameters.json) files.

Open the [mesh_rp.windows.parameter.json parameters](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.parameters.json) file locally and set the *frontEndCpu* value to 1:

```json
      "frontEndCpu":{
        "value": "1"
      }
```

Save your changes to the parameters file.  

The *frontEndCpu* parameter is declared in the *parameters* section of the [mesh_rp.windows.json deployment template](https://github.com/Azure-Samples/service-fabric-mesh/blob/master/templates/todolist/mesh_rp.windows.json):

```json
"frontEndCpu": {
    "defaultValue": "0.5",
    "type": "string",
    "metadata": {
        "description": "The CPU resources for the front end web service."
    }
}
```

The WebFrontEnd service *codePackages->resources->requests->cpu* property references the *frontEndCpu* parameter:

```json
    "services": [
          {
            "name": "WebFrontEnd",
            "properties": {
              "description": "WebFrontEnd description.",
              "osType": "Windows",
              "codePackages": [
                {
                  "name": "WebFrontEnd",
                  "image": "[parameters('frontEndImage')]",
                  ...
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
              ...
```

### Upgrade your application

While the application is running, you can upgrade it by redeploying the template and updated parameters file:

```azurecli
az mesh deployment create --resource-group myResourceGroup --template-file c:\temp\mesh_rp.windows.json --parameters c:\temp\mesh_rp.windows.parameters.json
```

This will start a rolling upgrade to your application and you should see the CPU resources increase in a few minutes.  To view the CPU resources for the WebFrontEnd service, run the following:

```azurecli
az mesh service show --resource-group myResourceGroup --name WebFrontEnd --app-name todolistapp
```

## Next steps

In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * Change application configurations
> * Upgrade an application running in Service Fabric Mesh

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Remove a Service Fabric Mesh application](service-fabric-mesh-tutorial-template-remove-app.md)
