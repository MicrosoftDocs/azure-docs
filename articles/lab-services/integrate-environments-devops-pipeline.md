---
title: Integrate environments into Azure Pipelines in Azure DevTest Labs
description: Learn how to integrate Azure DevTest Labs environments into your Azure DevOps continuous integration (CI) and continuous delivery (CD) pipelines. 
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/16/2020
ms.author: spelluru

---

# Integrate environments into your Azure DevOps CI/CD pipelines
You can use the Azure DevTest Labs Tasks extension that is installed in Azure DevOps Services (formerly known as Visual Studio Team Services) to easily integrate your continuous integration (CI)/ continuous delivery (CD) build-and-release pipeline with Azure DevTest Labs. These extensions make it easier to quickly deploy an [environment](devtest-lab-test-env.md) for a specific test task and then delete it when the test is finished. 

This article shows how to create and deploy an environment, then delete the environment, all in one complete pipeline. You would ordinarily perform each of these tasks individually in your own custom build-test-deploy pipeline. The extensions used in this article are in addition to these [create/delete DTL VM tasks](devtest-lab-integrate-ci-cd-vsts.md):

- Create an Environment
- Delete an Environment

## Before you begin
Before you can integrate your CI/CD pipeline with Azure DevTest Labs, install [Azure DevTest Labs Tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks) extension from Visual Studio Marketplace. 

## Create and configure the lab for environments
This section describes how to create and configure a lab where the Azure environment will be deployed to.

1. [Create a lab](devtest-lab-create-lab.md) if you don't already have one. 
2. Configure the lab and create an environment template by following instructions from this article: [Create multi-VM environments and PaaS resources with Azure Resource Manager templates](devtest-lab-create-environment-from-arm.md).
3. For this example, use an existing Azure Quickstart Template [https://azure.microsoft.com/resources/templates/201-web-app-redis-cache-sql-database/](https://azure.microsoft.com/resources/templates/201-web-app-redis-cache-sql-database/).
4. Copy the **201-web-app-redis-cache-sql-database** folder into the **ArmTemplate** folder in the repository configured in the step 2.

## Create a release definition
To create the release definition, do the following:

1.	On the **Releases** tab of the **Build & Release hub**, select the **plus sign (+)** button.
2.	In the **Create release definition** window, select the **Empty** template, and then select **Next**.
3.	Select **Choose Later**, and then select **Create** to create a new release definition with one default environment and no linked artifacts.
4.	To open the shortcut menu, in the new release definition, select the **ellipsis (...)** next to the environment name, and then select **Configure variables**.
5.	In the **Configure - environment** window, for the variables that you use in the release definition tasks, enter the following values:
1.	For **administratorLogin**, enter the SQL Administrator login name.
2.	For **administratorLoginPassword**, enter the password to be used by the SQL Administrator login. Use the "padlock" icon to hide and secure the password.
3.	For **databaseName**, enter the SQL Database name.
4.	These variables are specific for the example environments, different environments may have different variables.

## Create an environment
The next stage of the deployment is to create the environment to be used for development or testing purposes.

1. In the release definition, select **Add tasks**.
2. On the **Tasks** tab, add an Azure DevTest Labs Create Environment task. Configure the task as follows:
    1. For **Azure RM Subscription**, select a connection in the **Available Azure Service Connections** list, or create a more restricted permissions connection to your Azure subscription. For more information, see [Azure Resource Manager service endpoint](/azure/devops/pipelines/library/service-endpoints).
2. For **Lab Name**, select the name of the instance that you created earlier*.
3. For **Repository Name**, select the repository where the Resource Manager template (201) has been pushed to*.
4. For **Template Name**, select the name of the environment that you saved to your source code repository*. 
5. The **Lab Name**, **Repository Name**, and **Template Name** are the friendly representations of the Azure resource IDs. Manually entering the friendly name will cause failures, use the drop-down lists to select the information.
6. For **Environment Name**, enter a name to uniquely identify the environment instance within the lab.  It must be unique within the lab.
7. The **Parameter File** and the **Parameters**, allow custom parameters to be passed to the environment. Either or both can be used to set the parameter values. For this example, the Parameters section will be used. Use the names of the variables that you defined in the environment, for example: `-administratorLogin "$(administratorLogin)" -administratorLoginPassword "$(administratorLoginPassword)" -databaseName "$(databaseName)" -cacheSKUCapacity 1`
8. Information within the environment template can be passed through in the output section of the template. Check **Create output variables based on the environment template output** so other tasks can use the data. `$(Reference name.Output Name)` is the pattern to follow. For example, if the Reference Name was DTL and the output name in the template was location the variable would be `$(DTL.location)`.

## Delete the environment
The final stage is to delete the Environment that you deployed in your Azure DevTest Labs instance. You would ordinarily delete the environment after you execute the dev tasks or run the tests that you need on the deployed resources.

In the release definition, select **Add tasks**, and then on the **Deploy** tab, add an **Azure DevTest Labs Delete Environment** task. Configure it as follows:

1. To delete the VM, see [Azure DevTest Labs Tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks):
    1. For **Azure RM Subscription**, select a connection in the **Available Azure Service Connections** list, or create a more restricted permissions connection to your Azure subscription. For more information, see [Azure Resource Manager service endpoint](/azure/devops/pipelines/library/service-endpoints).
    2. For **Lab Name**, select the lab where the environment exists.
    3. For **Environment Name**, enter the name of the environment to be removed.
2. Enter a name for the release definition, and then save it.

## Next steps
See the following articles: 
- [Create multi-VM environments with Resource Manager templates](devtest-lab-create-environment-from-arm.md).
- Quickstart Resource Manager templates for DevTest Labs automation from the [DevTest Labs GitHub repository](https://github.com/Azure/azure-quickstart-templates).
- [VSTS Troubleshooting page](/azure/devops/pipelines/troubleshooting)

