---
# Mandatory fields. See more on aka.ms/skyeye/meta.
#Intent: I want to use my existing containers as is and deploy them to Azure. (Windows or Linux) 
title: Quickstart - Deploy an existing container to Azure Service Fabric Mesh
description: This quickstart shows you how to deploy an existing container on Service Fabric Mesh.
services: Azure Service Fabric Mesh
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: david-stanford
ms.author: dastanfo
ms.date: 04/05/2018
ms.topic: quickstart
ms.service: service-fabric-mesh
manager: timlt
---
# Service Fabric Mesh: Deploy a container

Service Fabric Mesh makes it easy to create and manage Docker containers in Azure, without having to provision virtual machines. In this quickstart, you create a container in Azure and expose it to the internet. This operation is completed in a single command. Within just a couple minutes, you'll see this in your browser:

![Hello world app in the browser][sfm-app-browser]

To read more about applications and Service Fabric Mesh, head over to the [Service Fabric Mesh Overview](./service-fabric-mesh-overview.md)

If you don't already have an Azure account, [create a free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this quickstart. If you choose to install and use the CLI locally, this quickstart requires that you're running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. To install or upgrade to the latest version of the CLI, see [Install Azure CLI 2.0][azure-cli-install].

## Create a resource group

Create a resource group to deploy the application to. Alternatively, you can use an existing resource group and export rg to the name.

```azurecli-interactive
export rg=myResourceGroup
az group create --name $rg --location eastus
```

## Deploy the container

Create your application using the following deployment command:

```azurecli-interactive
az sbz deployment create --resource-group $rg --template-uri https://raw.githubusercontent.com/Azure-Samples/service-fabric-configuration/master/container-configuration.json
```

In just over a minute, your command should return with `"provisioningState": "Succeeded"`. Given below is the output from the command when using [Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview).

```json
{
  "id": "/subscriptions/<subscriptionId>/resourceGroups/myResourceGroup/providers/Microsoft.Resources/deployments/test",
  "name": "test",
  "properties": {
    "additionalProperties": {
      "duration": "PT1M9.2142639S",
      "outputResources": [
        {
          "id": "/subscriptions/<subscriptionId>/resourceGroups/myResourceGroup/providers/Microsoft.ServiceFabric/applications/helloWorldApp",
          "resourceGroup": "myResourceGroup"
        },
        {
          "id": "/subscriptions/<subscriptionId>/resourceGroups/myResourceGroup/providers/Microsoft.ServiceFabric/networks/helloWorldNetwork",
          "resourceGroup": "myResourceGroup"
        }
      ],
      "templateHash": "252151383102766848"
    },
    "correlationId": "a72d1e06-564c-45c0-ba85-5447b18b04c1",
    "debugSetting": null,
    "dependencies": [
      {
        "dependsOn": [
          {
            "id": "/subscriptions/<subscriptionId>/resourceGroups/myResourceGroup/providers/Microsoft.ServiceFabric/networks/helloWorldNetwork",
            "resourceGroup": "myResourceGroup",
            "resourceName": "helloWorldNetwork",
            "resourceType": "Microsoft.ServiceFabric/networks"
          }
        ],
        "id": "/subscriptions/<subscriptionId>/resourceGroups/myResourceGroup/providers/Microsoft.ServiceFabric/applications/helloWorldApp",
        "resourceGroup": "myResourceGroup",
        "resourceName": "helloWorldApp",
        "resourceType": "Microsoft.ServiceFabric/applications"
      }
    ],
    "mode": "Incremental",
    "outputs": null,
    "parameters": {
      "location": {
        "type": "String",
        "value": "eastus"
      }
    },
    "parametersLink": null,
    "providers": [
      {
        "id": null,
        "namespace": "Microsoft.ServiceFabric",
        "registrationState": null,
        "resourceTypes": [
          {
            "aliases": null,
            "apiVersions": null,
            "locations": [
              "eastus"
            ],
            "properties": null,
            "resourceType": "networks"
          },
          {
            "aliases": null,
            "apiVersions": null,
            "locations": [
              "eastus"
            ],
            "properties": null,
            "resourceType": "applications"
          }
        ]
      }
    ],
    "provisioningState": "Succeeded",
    "template": null,
    "templateLink": null,
    "timestamp": "2018-04-05T00:37:57.139252+00:00"
  },
  "resourceGroup": "myResourceGroup"
}
```

## Check application deployment status

At this point, your application has been deployed. You can check to see its status by using the `app show` command. This command provides useful information that you can follow up on.

The application name for this quickstart application is helloWorldApp, to gather the details on the application execute the following command:

```azurecli-interactive
az sbz app show --resource-group $rg --name helloWorldApp
```

## Browse to the application

Once the application status is returned as ""provisioningState": "Succeeded", you will need the ingress endpoint of the service. To retrieve the IP address query the network resource for the container where the service is deployed, and open it on a browser.

The network resource for this quickstart application is helloWorldNetwork, here is the command to get the IP address:

```azurecli-interactive
az sbz network show --resource-group $rg --name helloWorldNetwork
```

The command will return with information like the json snippet below when running the command in [Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview).

From the output, copy the IP address.

```json
    "publicIpAddress": "40.121.196.175",
    "qosLevel": "Bronze"
  },
  "location": "eastus",
  "name": "helloWorldNetwork",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "tags": {},
  "type": "Microsoft.ServiceFabric/networks"
}
```

In the example above, the service end point IP is 40.121.196.175.  Take your corresponding IP address and open it in your favorite browser.

## See all the application you have currently deployed to your subscription

You can use the "app list" command to get a list of applications you have deployed to your subscription.

```cli
az sbz app list --output table
```

## See the application logs

```azurecli-interactive
az sbz codepackage logs -g $rg --app-name helloWorldApp --code-package-name <needToFindThis>
```

## Clean up resources

When you are ready to delete the application run the following command, you'll be prompted to confirm deletion enter `y` to confirm the command.

```azurecli-interactive
az sbz app delete -g $rg -n helloWorldApp
```

If you no longer need any of the resources you created in this quickstart, you can execute the [az group delete][az-group-delete] command to remove the resource group and all resources it contains. This command deletes the container deployed to service fabric mesh and all related resources.

```azurecli-interactive
az group delete --name $rg
```

## Next steps

Advance to the next article to learn more about Service Fabric Mesh
> [!div class="nextstepaction"]
> [Next steps button](service-fabric-mesh-overview.md)

<!-- Images -->
[sfm-app-browser]: ./media/service-fabric-mesh-quickstart-containers-01.png

<!-- Links / Internal -->
[az-group-delete]: /cli/azure/group#az_group_delete
[azure-cli-install]: /cli/azure/install-azure-cli