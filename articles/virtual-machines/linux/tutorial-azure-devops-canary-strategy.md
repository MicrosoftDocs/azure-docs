---
title: Configure canary deployments for Azure Linux Virtual Machines
description: Learn how to set up a classic release pipeline and deploy to Linux virtual machines using the canary deployment strategy.
author: moala
tags: azure-devops-pipelines
ms.service: virtual-machines
ms.collection: linux
ms.topic: how-to
ms.tgt_pltfrm: azure-pipelines
ms.workload: infrastructure
ms.date: 08/11/2022
ms.author: moala
ms.custom: devops
---

# Configure the canary deployment strategy for Azure Linux Virtual Machines

**Applies to:** :heavy_check_mark: Linux VMs

Azure Pipelines provides a fully featured set of CI/CD automation tools for deployments to virtual machines. This article will show you how to set up a classic release pipeline that uses the canary strategy to deploy web applications to Linux virtual machines.

## Canary deployments

A canary deployment reduces risk by slowly rolling out changes to a small subset of users. As you gain confidence in the new version, you can release it to more servers in your infrastructure and route more users to it.

Using the **Continuous-delivery** feature, you can use the canary strategy to deploy your application from Azure portal.

1. Sign in to [Azure portal](https://portal.azure.com/) and navigate to a virtual machine.

1. Select **Continuous delivery**, and then select **Configure**.

    :::image type="content" source="media/tutorial-devops-azure-pipelines-classic/azure-devops-configure.png" alt-text="A screenshot showing how to navigate to continuous delivery in your VM settings.":::

1. In the configuration panel, select **Use existing** and select your organization/project or select **Create** and create new ones.

1. Select your **Deployment group name** from the dropdown menu or create a new one.

1. Select your **Build pipeline** from the dropdown menu.

1. Select **Deployment strategy**, and then select **Canary**.

    :::image type="content" source="media/tutorial-devops-azure-pipelines-classic/azure-devops-rolling.png" alt-text="A screenshot showing how to configure the canary deployment strategy.":::

1. Add a "canary" tag to the VMs that will be used in the canary deployment.

    :::image type="content" source="media/tutorial-devops-azure-pipelines-classic/azure-devops-configure-canary.png" alt-text="A screenshot showing how to add canary tag.":::

1. Select **OK** to configure the classic release pipeline to deploy to your virtual machine.

    :::image type="content" source="media/tutorial-devops-azure-pipelines-classic/azure-devops-canary-pipeline.png" alt-text="A screenshot showing a classic release pipeline.":::

1. Navigate to your release pipeline and then select **Edit** to view the pipeline configuration. In this example, the *dev* stage is composed of three jobs:

   1. Deploy Canary: the application is deployed to VMs with a "canary" tag.
   1. Wait for manual resumption: the pipeline pauses and waits for manual intervention. Before resuming the pipeline, ensure that at least one VM is tagged "prod". In the next phase, the app will be deployed only to "prod" VMs.
   1. Deploy Prod: the application is deployed to VMs with a "prod" tag.

    :::image type="content" source="media/tutorial-devops-azure-pipelines-classic/azure-devops-canary-task.png" alt-text="A screenshot showing release pipeline jobs.":::

## Resources

- [Deploy to Azure virtual machines with Azure DevOps](../../devops-project/azure-devops-project-vms.md)
- [Deploy to an Azure virtual machine scale set](/azure/devops/pipelines/apps/cd/azure/deploy-azure-scaleset)

## Related articles

- [Configure the rolling deployment strategy](./tutorial-devops-azure-pipelines-classic.md)
- [Configure the blue-green deployment strategy](./tutorial-azure-devops-blue-green-strategy.md)
