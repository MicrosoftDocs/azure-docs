---
description: Learn how to delete individual containers using az-cli
title: Delete Fluid containers
ms.date: 09/28/2021
ms.service: azure-fluid
ms.topic: reference
---

# Delete Fluid containers in Azure Fluid Relay

In this scenario, we will be deleting an existing Fluid container. Once a container is deleted, applications referencing the container will no longer be able to access the container or its data. 

## Requirements to delete a Fluid container
- To get started, you need to install [Azure CLI](/cli/azure/install-azure-cli). If you already have Azure CLI installed, please ensure your version is 2.0.67 or greater by running `az version`.
- In order to delete a Fluid container, you must ensure that your application and its clients have been disconnected from the container for more than 10 minutes.

## List the containers within a Fluid Relay resource
To see all of the containers belonging to your Fluid Relay resource, you can run the following command:
```
az rest --method get --uri https://management.azure.com/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.FluidRelay/FluidRelayServers/<frsResourceName>/FluidRelayContainers?api-version=<apiVersion>
```
**subscriptionId**: ID of Azure subscription your Fluid Relay resource belongs to.

**resourceGroupName**: Name of the resource group your Fluid Relay resource is in.

**frsResourceName**: Name of your Fluid Relay resource. Note that this is different from the tenantId of the Fluid Relay resource.

**apiVersion**: API Version of resource provider. Minimum supported version is **2022-06-01**.  


## Sample output
The output will contain a list of containers belonging to your Fluid Relay resource and their properties.
```json
{
  "value": [
    {
      "id": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupname>/providers/Microsoft.FluidRelay/fluidRelayServers/<frsResourcename>/fluidRelayContainers/<containerId>",
      "name": "<containerId>",
      "properties": {
        "frsContainerId": "<containerId>",
        "frsTenantId": "<frsResourceTenantId>"
      },
      "resourceGroup": "<resourceGroupname>",
      "type": "Microsoft.FluidRelay/fluidRelayServers/fluidRelayContainers"
    },
    ...
  ]
}
```


## Delete an existing container
To delete a container, you need to identify the **containerId** of the container from the output above and run the follow command: 
```
az rest --method delete --uri https://management.azure.com/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.FluidRelay/FluidRelayServers/<frsResourceName>/FluidRelayContainers/<frsContainerId>?api-version=<api-version>
```
  **frsContainerId**: ID of Fluid container to be deleted. 
