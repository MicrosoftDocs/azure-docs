---
title: Integrate DevTest Labs environments into Azure Pipelines
description: Learn how to integrate Azure DevTest Labs environments into Azure Pipelines continuous integration (CI) and continuous delivery (CD) pipelines.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 11/17/2021
ms.custom: UpdateFrequency2
---

# Integrate DevTest Labs environments into Azure Pipelines

You can use the Azure DevTest Labs Tasks extension to integrate Azure DevTest Labs into Azure Pipelines. In this article, you use the extension to create and deploy an environment, and then delete the environment, all in one pipeline. You can use the environment to integrate your Azure Pipelines continuous integration/continuous delivery (CI/CD) release pipelines with Azure DevTest Labs.

The Azure DevTest Labs Tasks extension adds the following tasks to Azure Pipelines:

- Create an Environment
- Delete an Environment

These tasks make it easy to quickly deploy an [environment](devtest-lab-test-env.md) for a specific test, and then delete the environment when you finish the test. You'd ordinarily do the environment creation and deletion separately in your own pipelines.

For information about other extension tasks like creating VMs and custom images, see [Integrate DevTest Labs into Azure Pipelines](devtest-lab-integrate-ci-cd.md).

## Prerequisites

- In the Azure portal, [create a DevTest Labs lab](devtest-lab-create-lab.md), or use an existing lab. Make sure your lab is configured to use **Public Environment**, which is turned on by default.
- Register or sign into your [Azure DevOps Services](https://dev.azure.com) organization, and [create a project](/vsts/organizations/projects/create-project), or use an existing project.
- Install the [Azure DevTest Labs Tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks) extension from Visual Studio Marketplace into your Azure DevOps Services organization.

## Create a release pipeline and environment

1. In your Azure DevOps project, select **Releases** under the **Pipelines** section.
1. Select **New pipeline**.
1. **Select a template** on the right shows a list of templates for common deployment patterns. Select the **Empty job** link at the top of the page.
1. On the **New release pipeline** page, drop down **Tasks** in the toolbar and select **Stage 1**.

   :::image type="content" source="./media/integrate-environments-devops-pipeline/new-release-pipeline-stage.png" alt-text="Screenshot that shows opening the pipeline release stage." border="false":::

1. Select the plus sign **+** next to **Agent job**.
1. Under **Add tasks**, search for and select **Azure DevTest Labs Create Environment**, and then select **Add**.
1. On the left, select the **Azure DevTest Labs Create Environment** task.
1. Fill out the **Azure DevTest Labs Create Environment (Preview)** form as follows:
   
   :::image type="content" source="./media/integrate-environments-devops-pipeline/new-release-pipeline-environment.png" alt-text="Screenshot shows the fields needed for Azure Pipelines environment for Azure DevTest Labs." border="false":::

   - **Azure RM Subscription**: Select your connection or Azure subscription from the dropdown list.
     > [!NOTE]
     > For information about creating a more restricted permissions connection to your Azure subscription, see [Azure Resource Manager service endpoint](/azure/devops/pipelines/library/service-endpoints#sep-azure-resource-manager).

   - **Lab**: Select the lab name you want to deploy against. You can also use a variable, `$(labName)`. Manually entering the name causes failure. Select the name from the dropdown list.

   - **Environment Name**: Enter the name of the environment to create in the lab.

   - **Repository**: Select the source code repository that contains the template.

     You can choose the default repository, **Public Environment Repo**, or another repository that contains the template you want to use. Repositories are designated in the lab policies. Manually entering the friendly name causes failures. Select the name from the dropdown list.

   - **Template**: Select the template to use to create the environment. Manually entering the friendly name cause failures. Select the name from the dropdown list.

   - **Parameters File**: Browse to the location of a saved parameters file.

   - **Parameter Overrides**: Pass custom parameters to the environment.

   You can use either **Parameters File**, **Parameter Overrides**, or both to set parameter values. For example, you can use these fields to pass the encrypted password. You can also use variables to avoid passing secret information in the logs, and even connect to Azure Key Vault.

## Delete the environment

The final pipeline stage is to delete the environment that you deployed. You'd ordinarily delete the environment after doing the developer tasks or running the tests on the deployed resources.

1. In the release pipeline, select the plus sign **+** next to **Agent job**.
1. In the **Add tasks** window, search for and add **Azure DevTest Labs Delete Environment**.
1. On the left, select the **Azure DevTest Labs Delete Environment** task.
1. Fill out the form as follows:

   - **Azure RM Subscription**: Select your connection or subscription.
   - **Lab**: Select the lab where the environment exists.
   - **Environment Name**: Select the name of the environment to delete.

1. Select **New release pipeline** at the top of the release pipeline page, and enter a new name for the pipeline.
1. Select **Save** at upper right.

## Next steps

- Learn how to [Create multi-VM environments with ARM templates](devtest-lab-create-environment-from-arm.md).
- Explore more quickstart ARM templates for DevTest Labs automation from the [public DevTest Labs GitHub repo](https://github.com/Azure/azure-quickstart-templates).
- If necessary, see [Azure Pipelines troubleshooting](/azure/devops/pipelines/troubleshooting).
