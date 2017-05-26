---
title: Scale Azure Container Service cluster | Microsoft Docs
description: How to scale agent nodes in a DC/OS, Docker Swarm, or Kubernetes cluster in Azure Container Service using the Azure CLI or Azure portal.
services: container-service
documentationcenter: ''
author: sauryadas
manager: madhana
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Mesos, Azure

ms.assetid: 4a567474-f9a2-4172-bf86-7522aa4d4d80
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/01/2017
ms.author: saudas
ms.custom: H1Hack27Feb2017

---
# Scale agent nodes in a Container Service cluster
After [deploying an Azure Container Service cluster](container-service-deployment.md), you might need to change the number of agent nodes. For example, you might need more agents so you can run more container applications or instances. 

You can change the number of agent nodes in a DC/OS, Docker Swarm, or Kubernetes cluster by using the Azure portal or the Azure CLI 2.0. 

## Scale with the Azure portal

1. In the [Azure portal](https://portal.azure.com), browse for **Container services**, and then click the container service that you want to modify.
2. In the **Container service** blade, click **Agents**.
3. In **VM Count**, enter the desired number of agents nodes.

    ![Scale a pool in the portal](./media/container-service-scale/container-service-scale-portal.png)

4. To save the configuration, click **Save**.



## Scale with the Azure CLI 2.0

Make sure that you [installed](/cli/azure/install-az-cli2) the latest Azure CLI 2.0 and logged in to an azure account (`az login`).


### See the current agent count
To see the number of agents currently in the cluster, run the `az acs show` command. This shows the cluster configuration. For example, the following command shows the configuration of the container service named `containerservice-myACSName` in the resource group `myResourceGroup`:

```azurecli
az acs show -g myResourceGroup -n containerservice-myACSName
```

The command returns the number of agents in the `Count` value under `AgentPoolProfiles`.


### Use the az acs scale command
To change the number of agent nodes, run the `az acs scale` command and supply the **resource group**, **container service name**, and the desired **new agent count**. By using a smaller or higher number, you can scale down or up, respectively.

For example, to change the number of agents in the previous cluster to 10, type the following command:

```azurecli
azure acs scale -g myResourceGroup -n containerservice-myACSName --new-agent-count 10
```

The Azure CLI 2.0 returns a JSON string representing the new configuration of the container service, including the new agent count.

For more command options, run `az acs scale --help`.


## Scaling considerations


* The number of agent nodes must be between 1 and 100, inclusive. 

* Your cores quota can limit the number of agent nodes in a cluster.

* Agent node scaling operations are applied to an Azure virtual machine scale set that contains the agent pool. In a DC/OS cluster, only agent nodes in the private pool are scaled by the operations shown in this article.

* Depending on the orchestrator you deploy in your cluster, you can separately scale the number of instances of a container running on the cluster. For example, in a DC/OS cluster, use the [Marathon UI](container-service-mesos-marathon-ui.md) to change the number of instances of a container application.

* Currently, autoscaling of agent nodes in a container service cluster is not supported.





## Next steps
* See [more examples](container-service-create-acs-cluster-cli.md) of using Azure CLI 2.0 commands with Azure Container Service.
* Learn more about [DC/OS agent pools](container-service-dcos-agents.md) in Azure Container Service.

