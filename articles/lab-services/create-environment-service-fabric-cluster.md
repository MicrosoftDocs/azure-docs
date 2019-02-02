---
title: Create an environment with a Service Fabric cluster in Azure DevTest Labs | Microsoft Docs
description: Learn how to create an environment with a self-contained Service Fabric cluster, and start and stop the cluster using schedules.
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.assetid: 
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/01/2019
ms.author: spelluru
---

# Create an environment with self-contained Service Fabric cluster in Azure DevTest Labs
This article provides information on how to create an environment with a self-contained Service Fabric cluster in Azure DevTest Labs. 

## Overview
DevTest Labs can create self-contained test environments as defined by an Azure Resource Management template. These environments contain both IaaS resources, like virtual machines, and PaaS resources, like Service Fabric.

DevTest Lab provides the means to manage virtual machine resources defined within an environment by providing commands to control the virtual machines. These commands give you the ability to start or stop a virtual machine on a schedule. DevTest Labs can also help you manage Service Fabric clusters in an environment as well. You can start or stop a Service Fabric custer in an environment either manually or via a schedule.

The following image shows the updated view of **My Virtual Machines** with environments. This article covers how to create an environment with a self-contained Service Fabric cluster, and how to start and stop the cluster via schedules.

![My virtual machines view with environment](./media/create-environment-service-fabric-cluster/virtual-machines-with-environments.png)

## Creating an Environment
Service Fabric clusters must be created using environments in DevTest Labs. You create Resource Manager templates that define environments, add them to a Git repository, and then add a link to the repository from the lab. Then, 

You can find a sample environment to create Service Fabric clusters in DevTest Labs at: [https://github.com/Azure/azure-devtestlab/tree/master/Environments/](https://github.com/Azure/azure-devtestlab/tree/master/Environments/).



Service Fabric clusters are highly configurable in ARM. If you would like to test Service Fabric in DevTest Labs, a sample environment can be found at [https://github.com/Azure/azure-devtestlab/tree/master/Environments/](https://github.com/Azure/azure-devtestlab/tree/master/Environments/). An environment named ‘Service Fabric Lab Cluster’, as seen below, will become available when creating new lab resources. See [README.md](https://github.com/Azure/azure-devtestlab/blob/master/Environments/ServiceFabric-LabCluster/README.md) for more details how this environment works.


You add a Git repository source to the lab to make the environments available to the lab. For details on how to add a Git repository with environments, see [Add a Git repository to store custom artifacts and Resource Manager templates](devtest-lab-add-artifact-repo.md) for instruction on how to add a repository source. See [Create multi-VM environments and PaaS resources with Azure Resource Manager templates](devtest-lab-create-environment-from-arm.md) for an overview how to create an environment.

Each environment is defined by an Azure Resource Manager (ARM) template. Service Fabric clusters are highly configurable in ARM. If you would like to test Service Fabric in DevTest Labs, a sample environment can be found at [https://github.com/Azure/azure-devtestlab/tree/master/Environments/](https://github.com/Azure/azure-devtestlab/tree/master/Environments/). An environment named ‘Service Fabric Lab Cluster’, as seen below, will become available when creating new lab resources. See [README.md](https://github.com/Azure/azure-devtestlab/blob/master/Environments/ServiceFabric-LabCluster/README.md) for more details how this environment works.



## Next steps
* Once a VM has been created, you can connect to the VM by selecting **Connect** on the VM's management pane.
* View and manage resources in an environment by selecting the environment in the **My virtual machines** list in your lab. 
* Explore the [Azure Resource Manager templates from Azure Quickstart template gallery](https://github.com/Azure/azure-quickstart-templates).
