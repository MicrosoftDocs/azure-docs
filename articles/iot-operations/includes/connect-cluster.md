---
 title: include file
 description: include file
 author: kgremban
 ms.topic: include
 ms.date: 11/03/2023
 ms.author: kgremban
ms.custom:
  - include file
  - ignite-2023
---


To connect your cluster to Azure Arc:

1. Sign in with Azure CLI.

   ```azurecli
   az login
   ```

1. Set environment variables for the rest of the setup. Replace values in `<>` with valid values or names of your choice. A new cluster and resource group are created in your Azure subscription based on the names you provide:

   ```bash
   # Id of the subscription where your resource group and Arc-enabled cluster will be created
   export SUBSCRIPTION_ID=<SUBSCRIPTION_ID>
   # Azure region where the created resource group will be located
   # Currently supported regions: "eastus", "eastus2", "westus", "westus2", "westus3", "westeurope", or "northeurope"
   export LOCATION="WestUS3"
   # Name of a new resource group to create which will hold the Arc-enabled cluster and Azure IoT Operations resources
   export RESOURCE_GROUP=<NEW_RESOURCE_GROUP_NAME>
   # Name of the Arc-enabled cluster to create in your resource group
   export CLUSTER_NAME=<NEW_CLUSTER_NAME>
   ```

1. Set the Azure subscription context for all commands:

   ```azurecli
   az account set -s $SUBSCRIPTION_ID
   ```

1. Register the required resource providers in your subscription:

   ```azurecli
   az provider register -n "Microsoft.ExtendedLocation"
   az provider register -n "Microsoft.Kubernetes"
   az provider register -n "Microsoft.KubernetesConfiguration"
   az provider register -n "Microsoft.IoTOperationsOrchestrator"
   az provider register -n "Microsoft.IoTOperationsMQ"
   az provider register -n "Microsoft.IoTOperationsDataProcessor"
   az provider register -n "Microsoft.DeviceRegistry"
   ```

1. Use the [az group create](/cli/azure/group#az-group-create) command to create a resource group in your Azure subscription to store all the resources:

   ```azurecli
   az group create --location $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
   ```

1. Use the [az connectedk8s connect](/cli/azure/connectedk8s#az-connectedk8s-connect) command to Arc-enable your Kubernetes cluster and manage it in the resource group you created in the previous step:

   ```azurecli
   az connectedk8s connect -n $CLUSTER_NAME -l $LOCATION -g $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
   ```

1. Fetch the `objectId` or `id` of the Microsoft Entra ID application that the Azure Arc service uses.

   ```azurecli
   az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv
   ```

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable custom location support on your cluster. Use the `objectId` or `id` value from the previous command to enable custom locations on the cluster:

    ```azurecli
    az connectedk8s enable-features -n $CLUSTER_NAME -g $RESOURCE_GROUP --custom-locations-oid <objectId/id> --features cluster-connect custom-locations
    ```
