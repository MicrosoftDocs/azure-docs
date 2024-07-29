---
 title: include file
 description: include file
 author: kgremban
 ms.topic: include
 ms.date: 05/02/2024
 ms.author: kgremban
ms.custom: include file, ignite-2023, devx-track-azurecli
---


To connect your cluster to Azure Arc:

1. In your codespace terminal, sign in to Azure CLI:

   ```azurecli
   az login
   ```

   > [!TIP]
   > If you're using the GitHub codespace environment in a browser rather than VS Code desktop, running `az login` returns a localhost error. To fix the error, either:
   >
   > * Open the codespace in VS Code desktop, and then return to the browser terminal and rerun `az login`.
   > * Or, after you get the localhost error on the browser, copy the URL from the browser and run `curl "<URL>"` in a new terminal tab. You should see a JSON response with the message "You have logged into Microsoft Azure!."

1. Set the Azure subscription context for all commands:

   ```azurecli
   az account set -s $SUBSCRIPTION_ID
   ```

1. Register the required resource providers in your subscription:

   >[!NOTE]
   >This step only needs to be run once per subscription.

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

1. Use the [az connectedk8s connect](/cli/azure/connectedk8s#az-connectedk8s-connect) command to Arc-enable your Kubernetes cluster and manage it as part of your Azure resource group:

   ```azurecli
   az connectedk8s connect -n $CLUSTER_NAME -l $LOCATION -g $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
   ```

   >[!TIP]
   >The value of `$CLUSTER_NAME` is automatically set to the name of your codespace. Replace the environment variable if you want to use a different name.

1. Get the `objectId` of the Microsoft Entra ID application that the Azure Arc service uses and save it as an environment variable.

   ```azurecli
   export OBJECT_ID=$(az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv)
   ```

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable custom location support on your cluster. This command uses the `objectId` of the Microsoft Entra ID application that the Azure Arc service uses.

   ```azurecli
   az connectedk8s enable-features -n $CLUSTER_NAME -g $RESOURCE_GROUP --custom-locations-oid $OBJECT_ID --features cluster-connect custom-locations
   ```
