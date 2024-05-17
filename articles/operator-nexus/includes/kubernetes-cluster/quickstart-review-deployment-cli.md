---
author: dramasamy
ms.author: dramasamy
ms.date: 06/26/2023
ms.topic: include
ms.service: azure-operator-nexus
---

After the deployment finishes, you can view the resources using the CLI or the Azure portal.

To view the details of the ```myNexusK8sCluster``` cluster in the ```myResourceGroup``` resource group, execute the following Azure CLI command:

```azurecli
az networkcloud kubernetescluster show \
  --name myNexusK8sCluster \
  --resource-group myResourceGroup
```

Additionally, to get a list of agent pool names associated with the ```myNexusK8sCluster``` cluster in the ```myResourceGroup``` resource group, you can use the following Azure CLI command.

```azurecli
az networkcloud kubernetescluster agentpool list \
  --kubernetes-cluster-name myNexusK8sCluster \
  --resource-group myResourceGroup \
  --output table
```