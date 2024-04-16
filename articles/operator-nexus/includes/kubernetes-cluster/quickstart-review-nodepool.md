---
author: dramasamy
ms.author: dramasamy
ms.date: 06/26/2023
ms.topic: include
ms.service: azure-operator-nexus
---

> [!NOTE]
> You can add multiple agent pools during the initial creation of your cluster itself by using the initial agent pool configurations. However, if you want to add agent pools after the initial creation, you can utilize the above command to create additional agent pools for your Nexus Kubernetes cluster.

The following output example resembles successful creation of the agent pool.

```bash
$ az networkcloud kubernetescluster agentpool list --kubernetes-cluster-name myNexusK8sCluster --resource-group myResourceGroup --output table
This command is experimental and under development. Reference and support levels: https://aka.ms/CLI_refstatus
Count    Location    Mode    Name                          ProvisioningState    ResourceGroup    VmSkuName
-------  ----------  ------  ----------------------------  -------------------  ---------------  -----------
1        eastus      System  myNexusK8sCluster-nodepool-1  Succeeded            myResourceGroup  NC_P10_56_v1
1        eastus      User    myNexusK8sCluster-nodepool-2  Succeeded            myResourceGroup  NC_P10_56_v1
```
