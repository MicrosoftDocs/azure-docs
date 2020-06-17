---
title: Deployment Center for Azure Kubernetes
description: Deployment Center in Azure DevOps simplifies setting up a robust Azure DevOps pipeline for your application
ms.author: puagarw
ms.topic: tutorial
ms.date: 07/12/2019
author: pulkitaggarwl
---

# Deployment Center for Azure Kubernetes

Deployment Center in Azure DevOps simplifies setting up a robust Azure DevOps pipeline for your application. By default, Deployment Center configures an Azure DevOps pipeline to deploy your application updates to the Kubernetes cluster. You can extend the default configured Azure DevOps pipeline and also add richer capabilities: the ability to gain approval before deploying, provision additional Azure resources, run scripts, upgrade your application, and even run more validation tests.

In this tutorial, you will:

> [!div class="checklist"]
> * Configure an Azure DevOps pipeline to deploy your application updates to the Kubernetes cluster.
> * Examine the continuous integration (CI) pipeline.
> * Examine the continuous delivery (CD) pipeline.
> * Clean up the resources.

## Prerequisites

* An Azure subscription. You can get one free through [Visual Studio Dev Essentials](https://visualstudio.microsoft.com/dev-essentials/).

* An Azure Kubernetes Service (AKS) cluster.

## Create an AKS cluster

1. Sign in to your [Azure portal](https://portal.azure.com/).

1. Select the [Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview) option on the right side of the menu bar in the Azure portal.

1. To create the AKS cluster, run the following commands:

    ```azurecli
    # Create a resource group in the South India location:

    az group create --name azooaks --location southindia

    # Create a cluster named azookubectl with one node.

    az aks create --resource-group azooaks --name azookubectl --node-count 1 --enable-addons monitoring --generate-ssh-keys
    ```

## Deploy application updates to a Kubernetes cluster

1. Go to the resource group that you created in the previous section.

1. Select the AKS cluster, and then select **Deployment Center (preview)** on the left blade. Select **Get started**.

   ![settings](media/deployment-center-launcher/settings.png)

1. Choose the location of the code and select **Next**. Then, select one of the currently supported repositories: **[Azure Repos](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)** or **GitHub**.

    Azure Repos is a set of version control tools that help you manage your code. Whether your software project is large or small, using version control as early as possible is a good idea.

    - **Azure Repos**: Choose a repository from your existing project and organization.

        ![Azure Repos](media/deployment-center-launcher/azure-repos.gif)

    - **GitHub**: Authorize and select the repository for your GitHub account.

        ![GitHub](media/deployment-center-launcher/github.gif)


1. Deployment Center analyzes the repository and detects your Dockerfile. If you want to update the Dockerfile, you can edit the identified port number.

    ![Application Settings](media/deployment-center-launcher/application-settings.png)

    If the repository doesn't contain the Dockerfile, the system displays a message to commit one.

    ![Dockerfile](media/deployment-center-launcher/dockerfile.png)

1. Select an existing container registry or create one, and then select **Finish**. The pipeline is created automatically and queues a build in [Azure Pipelines](https://docs.microsoft.com/azure/devops/pipelines/index?view=azure-devops).

    Azure Pipelines is a cloud service that you can use to automatically build and test your code project and make it available to other users. Azure Pipelines combines continuous integration and continuous delivery to constantly and consistently test and build your code and ship it to any target.

    ![Container Registry](media/deployment-center-launcher/container-registry.png)

1. Select the link to see the ongoing pipeline.

1. You'll see the successful logs after deployment is complete.

    ![Logs](media/deployment-center-launcher/logs.png)

## Examine the CI pipeline

Deployment Center automatically configures your Azure DevOps organization's CI/CD pipeline. The pipeline can be explored and customized.

1. Go to the Deployment Center dashboard.  

1. Select the build number from the list of successful logs to view the build pipeline for your project.

1. Select the ellipsis (...) in the upper-right corner. A menu shows several options, such as queuing a new build, retaining a build, and editing the build pipeline. Select **Edit pipeline**. 

1. You can examine the different tasks for your build pipeline in this pane. The build performs various tasks, such as collecting sources from the Git repository, creating an image, pushing an image to the container registry, and publishing outputs that are used for deployments.

1. Select the name of the build pipeline at the top of the pipeline.

1. Change your build pipeline name to something more descriptive, select **Save & queue**, and then select **Save**.

1. Under your build pipeline, select **History**. This pane shows an audit trail of your recent build changes. Azure DevOps monitors any changes made to the build pipeline and allows you to compare versions.

1. Select **Triggers**. You can include or exclude branches from the CI process.

1. Select **Retention**. You can specify policies to keep or remove a number of builds, depending on your scenario.

## Examine the CD pipeline

Deployment Center automatically creates and configures the relationship between your Azure DevOps organization and your Azure subscription. The steps involved include setting up an Azure service connection to authenticate your Azure subscription with Azure DevOps. The automated process also creates a release pipeline, which provides continuous delivery to Azure.

1. Select **Pipelines**, and then select **Releases**.

1. To edit the release pipeline, select **Edit**.

1. Select **Drop** from the **Artifacts** list. In the previous steps, the construction pipeline you examined produces the output used for the artifact. 

1. Select the **Continuous deployment** trigger on the right of the **Drop** option. This release pipeline has an enabled CD trigger that runs a deployment whenever a new build artifact is available. You can also disable the trigger to require manual execution for your deployments.

1. To examine all the tasks for your pipeline, select **Tasks**. The release sets the tiller environment, configures the `imagePullSecrets` parameter, installs Helm tools, and deploys the Helm charts to the Kubernetes cluster.

1. To view the release history, select **View releases**.

1. To see the summary, select **Release**. Select any of the stages to explore multiple menus, such as a release summary, associated work items, and tests. 

1. Select **Commits**. This view shows code commits related to this deployment. Compare releases to see the commit differences between deployments.

1. Select **Logs**. The logs contain useful deployment information, which you can view during and after deployments.

## Clean up resources

You can delete the related resources that you created when you don't need them anymore. Use the delete functionality on the DevOps Projects dashboard.

## Next steps

You can modify these build and release pipelines to meet the needs of your team. Or, you can use this CI/CD model as a template for your other pipelines.
