---
title: Configure canary deployments for Azure Linux virtual machines
description: Learn how to set up a classic release pipeline and deploy to Linux virtual machines using the blue-green deployment strategy.
author: moala
tags: azure-devops-pipelines
ms.service: virtual-machines
ms.collection: linux
ms.topic: how-to
ms.tgt_pltfrm: azure-pipelines
ms.workload: infrastructure
ms.date: 08/08/2022
ms.author: moala
ms.custom: devops
---

# Configure the blue-green deployment strategy for Azure Linux virtual machines

**Applies to:** :heavy_check_mark: Linux VMs

Azure Pipelines provides a fully featured set of CI/CD automation tools for deployments to virtual machines. This article will show you how to set up a classic release pipeline that uses the blue-green strategy to deploy to Linux virtual machines. Azure also supports other strategies like [rolling](./tutorial-devops-azure-pipelines-classic.md) and [canary](./tutorial-azure-devops-canary-strategy.md) deployments.

## Blue-green deployments

A blue-green deployment is a deployment strategy where you create two separate and identical environments but only one is live at any time. This strategy is used to increase availability and reduce downtime by switching between the blue/green environments. The blue environment is usually set to run the current version of the application while the green environment is set to host the updated version. When all updates are completed, traffic is directed to the green environment and blue environment is set to idle.

Using the **Continuous-delivery** feature, you can use the blue-green deployment strategy to deploy to your virtual machines from Azure portal.

1. Sign in to [Azure portal](https://portal.azure.com/) and navigate to a virtual machine.

1. ISelect **Continuous delivery**, and then select **Configure**.

   ![A screenshot showing how to navigate to the continuous delivery feature.](media/tutorial-devops-azure-pipelines-classic/azure-devops-configure.png)

1. In the configuration panel, select **Use existing** and select your organization/project or select **Create** and create new ones.

1. Select your **Deployment group name** from the dropdown menu or create a new one.

1. Select your **Build pipeline** from the dropdown menu.

1. Select the **Deployment strategy** dropdown menu, and then select **Blue-Green**.

   ![A screenshot showing how to configure a blue green continuous delivery strategy.](media/tutorial-devops-azure-pipelines-classic/azure-devops-rolling.png)

1. Add a "blue" or "green" tag to VMs that are used for blue-green deployments. If a VM is for a standby role, tag it as "green". Otherwise, tag it as "blue".

   ![A screenshot showing a blue-green deployment strategy tagged green.](media/tutorial-devops-azure-pipelines-classic/azure-devops-blue-green-configure.png)

1. Select **OK** to configure the classic release pipeline to deploy to your virtual machine.

   ![A screenshot showing the classic release pipeline.](media/tutorial-devops-azure-pipelines-classic/azure-devops-blue-green-pipeline.png)

1. Navigate to your release pipeline and then select **Edit** to view the pipeline configuration. In this example, the *dev* stage is composed of three jobs:

   1. Deploy Green: the app is deployed to a standby VM tagged "green".
   1. Wait for manual resumption: the pipeline pauses and waits for manual intervention.
   1. Swap Blue-Green: this job swaps the "blue" and "green" tags in the VMs. This ensures that VMs with older application versions are now tagged as "green". During the next pipeline run, applications will be deployed to these VMs.

      ![A screenshot showing the three pipeline jobs](media/tutorial-devops-azure-pipelines-classic/azure-devops-blue-green-tasks.png)

## Resources

- [Deploy to Azure virtual machines with Azure DevOps](../../devops-project/azure-devops-project-vms.md)
- [Deploy to an Azure virtual machine scale set](/azure/devops/pipelines/apps/cd/azure/deploy-azure-scaleset)

## Related articles

- [Configure the rolling deployment strategy](./tutorial-devops-azure-pipelines-classic.md)
- [Configure the canary deployment strategy](./tutorial-azure-devops-canary-strategy.md)
