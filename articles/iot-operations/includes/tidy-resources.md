---
 title: include file
 description: include file
 author: dominicbetts
 ms.topic: include
 ms.date: 10/22/2024
 ms.author: dobett
ms.custom:
  - include file
---

If you want to remove the Azure IoT Operations deployment but keep your cluster, use the [az iot ops delete](/cli/azure/iot/ops#az-iot-ops-delete) command:

   ```azurecli
   az iot ops delete --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP
   ```

If you want to delete all the resources you created for this quickstart, delete the Kubernetes cluster where you deployed Azure IoT Operations and then remove the Azure resource group that contained the cluster.

If you used Codespaces for these quickstarts, delete your Codespace from GitHub.
