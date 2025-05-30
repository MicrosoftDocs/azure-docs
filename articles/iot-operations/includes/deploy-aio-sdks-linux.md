---
title: include file
description: include file
author: asergaz
ms.topic: include
ms.date: 05/29/2025
ms.author: sergaz
---

1. Create an Azure resource group. Only one Azure IoT Operations instance is supported per resource group. To create a new resource group, use the [az group create](/cli/azure/group#az-group-create) command. For the list of currently supported Azure regions, see [Supported regions](../overview-iot-operations.md#supported-regions).

   ```azurecli
   az group create --location <REGION> --resource-group <RESOURCE_GROUP> --subscription <SUBSCRIPTION_ID>
   ```

1. Register the required resource providers in your subscription:

   >[!NOTE]
   >This step only needs to be run once per subscription. To register resource providers, you need permission to do the `/register/action` operation, which is included in subscription Contributor and Owner roles. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

   ```azurecli
   az provider register -n "Microsoft.ExtendedLocation"
   az provider register -n "Microsoft.Kubernetes"
   az provider register -n "Microsoft.KubernetesConfiguration"
   az provider register -n "Microsoft.IoTOperations"
   az provider register -n "Microsoft.DeviceRegistry"
   az provider register -n "Microsoft.SecretSyncController"
   ```

1. Use the [az connectedk8s connect](/cli/azure/connectedk8s#az-connectedk8s-connect) command to Arc-enable your Kubernetes cluster and manage it as part of your Azure resource group.

   ```azurecli
   az connectedk8s connect --name <CLUSTER_NAME> -l <REGION> --resource-group <RESOURCE_GROUP> --subscription <SUBSCRIPTION_ID> --disable-auto-upgrade
   ```

   To prevent unplanned updates to Azure Arc and the system Arc extensions that Azure IoT Operations uses as dependencies, this command disables autoupgrade. Instead, [manually upgrade agents](/azure/azure-arc/kubernetes/agent-upgrade#manually-upgrade-agents) as needed.

1. Prepare for enabling the Azure Arc service, custom location, on your Arc cluster by getting the custom location object ID and saving it as the environment variable, OBJECT_ID. You must be logged into Azure CLI with a Microsoft Entra user account to successfully run the command, not a service principal. Run the following command **exactly as written**, without changing the GUID value. 

   ```azurecli
   export OBJECT_ID=$(az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv)
   ```

   > [!NOTE]
   >If you receive the error: "Unable to fetch oid of 'custom-locations' app. Proceeding without enabling the feature. Insufficient privileges to complete the operation," then your service principal might lack the necessary permissions to retrieve the object ID of the custom location. Log into Azure CLI with a Microsoft Entra user account that meets the prerequisites. For more information, see [Create and manage custom locations](https://aka.ms/enable-cl-sp).

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable the custom location feature on your Arc cluster. This command uses the OBJECT_ID environment variable saved from the previous step to set the value for the custom-locations-oid parameter: 

   ```azurecli
   az connectedk8s enable-features -n <CLUSTER_NAME> -g <RESOURCE_GROUP> --custom-locations-oid $OBJECT_ID --features cluster-connect custom-locations
   ```

1. Follow the instructions in [Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-deploy-iot-operations.md) to deploy Azure IoT Operations to your cluster with **Test settings**.