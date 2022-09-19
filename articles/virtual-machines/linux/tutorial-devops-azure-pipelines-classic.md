---
title: Configure rolling deployments for Azure Linux virtual machines
description: Learn how to set up a classic release pipeline and deploy your application to Linux virtual machines using the rolling deployment strategy.
author: moala
manager: jpconnock
tags: azure-devops-pipelines
ms.service: virtual-machines
ms.collection: linux
ms.topic: tutorial
ms.tgt_pltfrm: azure-pipelines
ms.workload: infrastructure
ms.date: 08/15/2022
ms.author: moala
ms.custom: devops
---

# Configure the rolling deployment strategy for Azure Linux virtual machines

**Applies to:** :heavy_check_mark: Linux VMs

Azure Pipelines provides a fully featured set of CI/CD automation tools for deployments to virtual machines. This article will show you how to set up a classic release pipeline that uses the rolling strategy to deploy your web applications to Linux virtual machines.

## Rolling deployments

In each iteration, a rolling deployment replaces instances of an application's previous version. It replaces them with instances of the new version on a fixed set of machines (rolling set). The following walk-through shows how to configure a rolling update to virtual machines.

Using **Continuous-delivery**, you can configure rolling updates to your virtual machines within the Azure portal.

[!IMPORTANT] Virtual Machine's Continuous delivery setting will be retired on March 31, 2023. [Learn more](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/tutorial-devops-azure-pipelines-classic?source=recommendations#retirement)


1. Sign in to [Azure portal](https://portal.azure.com/) and navigate to a virtual machine.

1. Select **Continuous delivery**, and then select **Configure**.

   :::image type="content" source="media/tutorial-devops-azure-pipelines-classic/azure-devops-configure.png" alt-text="A screenshot showing the continuous delivery settings.":::

1. Select your **Azure DevOps Organization** and your **Project** from the dropdown menu or **Create** a new one.

1. Select your **Deployment group** from the dropdown menu or **Create** a new one.

1. Select your **Build pipeline**.

1. Select **Deployment strategy**, and then select **Rolling**.

    :::image type="content" source="media/tutorial-devops-azure-pipelines-classic/azure-devops-rolling.png" alt-text="A screenshot showing how to configure a rolling deployment strategy.":::

1. Optionally, you can tag each machine with its role such as *web* or *db*. These tags help you target only VMs that have a specific role.

1. Select **OK** to configure the continuous delivery pipeline.

1. After completion, your continuous delivery pipeline should look similar to the following.  

    :::image type="content" source="media/tutorial-devops-azure-pipelines-classic/azure-devops-deployment-history.png" alt-text="A screenshot showing the continuous delivery pipeline.":::

1. If you want to configure multiple VMs, repeat steps 2 through 4 for the other VMs. If you use the same deployment group that already has a configured pipeline, the new VMs will just be added to the deployment group and no new pipelines will be created.

1. Select the link to navigate to your pipeline, and then select**Edit** to modify the pipeline definition.

    :::image type="content" source="media/tutorial-devops-azure-pipelines-classic/azure-devops-rolling-pipeline.png" alt-text="A screenshot showing the pipeline definition.":::

1. Select the tasks in the **dev** stage to navigate to the pipeline tasks, and then select **Deploy**.

    :::image type="content" source="media/tutorial-devops-azure-pipelines-classic/azure-devops-rolling-pipeline-tasks.png" alt-text="A screenshot showing the pipeline tasks.":::

1. You can specify the number of target machines to deploy to in parallel in each iteration. If you want to deploy to multiple machines, you can specify the number of machines as a percentage by using the slider.

1. The **Execute Deploy Script** task will execute the deployment script located in the root folder of the published artifacts.

    :::image type="content" source="media/tutorial-deployment-strategy/package.png" alt-text="A screenshot showing the published artifacts.":::

## Resources

- [Deploy to Azure virtual machines with Azure DevOps](../../devops-project/azure-devops-project-vms.md)
- [Deploy to Azure virtual machine scale set](/azure/devops/pipelines/apps/cd/azure/deploy-azure-scaleset)

## Related articles

- [Configure the canary deployment strategy](./tutorial-azure-devops-canary-strategy.md)
- [Configure the blue-green deployment strategy](./tutorial-azure-devops-blue-green-strategy.md)

## Retirement

Continuous delivery setting of Virtual Machines will be retired on March 31, 2023. Please switch to directly using Azure DevOps to create customized pipelines for deployment to Azure VMs. Release pipeline [Stage Templates](/azure/devops/pipelines/release/env-templates?view=azure-devops) and [Deployments Groups](/azure/devops/pipelines/process/deployment-group-phases?view=azure-devops&tabs=yaml) Azure DevOps' features provide similar experiences.

### Migration Steps

There is no migration required as VM CD experience does not store any information itself, it just helps users with their Day 0 getting started experience on Azure and Azure DevOps. Users will still be able to perform all operations from Azure DevOps portal even after the retirement of this experience. Only the ability to create and view pipelines from Azure portal will be removed. 

### FAQ

1. Where can I set up my CD pipeline after this experience is deprecated?  

You won't be able to view or create Azure DevOps pipelines from an Azure portal Virtual Machine blade after retirement. You still can go to Azure DevOps portal and view or update pipelines. 

2. Will I lose my earlier configured pipelines? 

    No.  All the created pipelines will still be available and functional in Azure DevOps portal. Only the experience of creating/viewing the Azure DevOps pipeline from Azure portal will be retired. 

 
3. How can I configure different deployment strategies? 

    The current experience leverages [deployment groups](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/deployment-group-phases?view=azure-devops&tabs=yaml) to create deployment strategies. You can use the same in Azure DevOps to create customized pipelines as per your requirements. You can also use release pipeline [Stage Templates](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/env-templates?view=azure-devops) to have a templatized pipeline stage created. 


