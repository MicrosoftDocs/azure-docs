---
title: Tutorial - Configure canary deployments for Azure Linux Virtual Machines
description: In this tutorial you will learn how to set up continuous deployment (CD) pipeline that updates a group of Azure Linux Virtual Machines using canary deployment strategy
author: moala
manager: jpconnock
tags: azure-devops-pipelines

ms.assetid: 
ms.service: virtual-machines-linux
ms.topic: tutorial
ms.tgt_pltfrm: azure-pipelines
ms.workload: infrastructure
ms.date: 4/10/2020
ms.author: moala
ms.custom: devops

#Customer intent: As a developer, I want to learn about CI/CD features in Azure so that I can use devops services like Azure Pipelines to build and deploy my applications automatically.
---

# Tutorial - Configure Canary deployment strategy for Azure Linux Virtual Machines


Azure DevOps is a built-in Azure service that enables you to configure continuous integration and continuous delivery for any Azure resource. This document contains the steps to use Azure Pipelines, a fully featured set of CI/CD automation tools, to deploy your application to Azure Linux Virtual Machines using Canary deployment strategy. You can also take a look at other strategies like [rolling](https://aka.ms/AA7jlh8) and [blue-green](https://aka.ms/AA83fwu), which are supported out-of-box from Azure portal. 
![AzDevOps_portalView](media/tutorial-devops-azure-pipelines-classic/azdevops-view.png) 
 


**Configure CI/CD on Linux Virtual Machines**

Linux Virtual machines can be added as targets to a [deployment group](https://docs.microsoft.com/azure/devops/pipelines/release/deployment-groups) and can be targeted for multi-machine updates. Once deployed, Deployment History views within Deployment Groups provides traceability from VM to the pipeline and then to the commit. 
 
  
**Canary Deployments**: A canary deployment reduces risk by slowly rolling out the change to a small subset of users. As you gain more confidence in the new version, you can start releasing it to more servers in your infrastructure and routing more users to it. 
You can configure canary deployments to your “**virtual machines**” with the Azure portal using continuous delivery option. 
Here is the step-by-step walkthrough. 
1. Sign in to your Azure portal and navigate to a virtual machine 
2. In the VM left pane, navigate to the **continuous delivery** menu. Then click on **Configure**. 

   ![AzDevOps_configure](media/tutorial-devops-azure-pipelines-classic/azure-devops-configure.png) 
3. In the configuration panel, click on “Azure DevOps Organization” to select an existing account or create one. Then select the project under which you would like to configure the pipeline.  


   ![AzDevOps_project](media/tutorial-devops-azure-pipelines-classic/azure-devops-rolling.png) 
4. A deployment group is a logical set of deployment target machines that represent the physical environments; for example, "Dev", "Test", "UAT", and "Production". You can create a new deployment group or select an existing deployment group. 
5. Select the build pipeline which publishes the package to be deployed to the virtual machine. Note that the published package should have a deployment script _deploy.ps1_ or _deploy.sh_ in _deployscripts_ folder at package root. This deployment script will be executed by Azure DevOps pipeline at run time.
6. Select the deployment strategy of your choice. In this case, lets select 'Canary'.
7. Add a 'canary' tag to the VMs that are to be part of canary deployments and a 'prod' tag to the VMs that are part of deployments after canary deployment in successful. This helps you target VMs that have specific role only.
![AzDevOps_configure_canary](media/tutorial-devops-azure-pipelines-classic/azure-devops-configure-canary.png)

8. Once done Click **OK** on the dialog to configure the continuous delivery pipeline, you will now have a continuous delivery pipeline configured to deploy to the virtual machine.
![AzDevOps_canary_pipeline](media/tutorial-devops-azure-pipelines-classic/azure-devops-canary-pipeline.png)


9. Click on  **Edit** release pipeline in Azure DevOps to see the pipeline configuration. The pipeline consists of 3 phases - first phase is a DG phase and deploys to VMs that are tagged as _canary_. The second phase, pauses the pipeline and waits for manual intervention to resume the run. Once a user is satisfied that canary deployment is stable, he can resume the pipeline run which will then run the third phase that deploys to VMs tagged as _prod_.
![AzDevOps_canary_task](media/tutorial-devops-azure-pipelines-classic/azure-devops-canary-task.png)

10. The Execute Deploy Script task will by default execute the the deployment script _deploy.ps1_ or _deploy.sh_ in _deployscripts_ folder at the root directory of published package. Make sure that the selected build pipeline publishes this in the root folder of package. 

![AzDevOps_publish_package](media/tutorial-devops-azure-pipelines-classic/azure-devops-published-package.png)




## Other deployment strategies
- [Configure Rolling Deployment Strategy](https://aka.ms/AA7jlh8)
- [Configure Blue-Green Deployment Strategy](https://aka.ms/AA83fwu)

## Azure DevOps project 
Get started with Azure more easily than ever.
 
With DevOps Projects, start running your application on any Azure service in just three steps: select an application language, a runtime, and an Azure service.
 
[Learn more](https://azure.microsoft.com/features/devops-projects/ ).
 
## Additional resources 
- [Deploy to Azure Virtual Machines using DevOps project](https://docs.microsoft.com/azure/devops-project/azure-devops-project-vms)
- [Implement continuous deployment of your app to an Azure Virtual Machine Scale Set](https://docs.microsoft.com/azure/devops/pipelines/apps/cd/azure/deploy-azure-scaleset)
