---
title: Manage environments in the studio
titleSuffix: Azure Machine Learning
description: Learn how to create and manage environments in the Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: ositanachi
ms.author:  osiotugo
ms.reviewer: larryfr
ms.date: 01/30/2023
ms.topic: how-to
ms.custom:
---

# Manage software environments in Azure Machine Learning studio

In this article, learn how to create and manage Azure Machine Learning [environments](/python/api/azure-ai-ml/azure.ai.ml.entities.environment) in the Azure Machine Learning studio. Use the environments to track and reproduce your projects' software dependencies as they evolve.

The examples in this article show how to:

* Browse curated environments.
* Create an environment and specify package dependencies.
* Edit an existing environment specification and its properties.
* Rebuild an environment and view image build logs.

For a high-level overview of how environments work in Azure Machine Learning, see [What are ML environments?](concept-environments.md) For information, see [How to set up a development environment for Azure Machine Learning](how-to-configure-environment.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* An [Azure Machine Learning workspace](quickstart-create-resources.md).

## Browse curated environments

Curated environments contain collections of Python packages and are available in your workspace by default. These environments are backed by cached Docker images, which reduce the job preparation cost and support training and inferencing scenarios. 

Click on an environment to see detailed information about its contents. For more information, see [Azure Machine Learning curated environments](resource-curated-environments.md). 

## Create an environment

To create an environment:
1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com).
1. On the left side, select **Environments**.
1. Select the **Custom environments** tab. 
1. Select the **Create** button. 

Create an environment by selecting one of the following options:
* Create a new docker [context](https://docs.docker.com/engine/reference/commandline/build/)
* Start from an existing environment
* Upload existing docker context
* Use existing docker image with optional conda file

:::image type="content" source="media/how-to-manage-environments-in-studio/create-page.png" alt-text="Environment creation wizard":::

You can customize the configuration file, add tags and descriptions, and review the properties before creating the entity. 

If a new environment is given the same name as an existing environment in the workspace, a new version of the existing one will be created.

## View and edit environment details

Once an environment has been created, view its details by clicking on the name. Use the dropdown menu to select different versions of the environment. Here you can view metadata and the contents of the environment through its various dependencies.

Click on the pencil icons to edit tags, descriptions, configuration files under the **Context** tab.

Keep in mind that any changes to the Docker or Conda sections will create a new version of the environment. 

:::image type="content" source="media/how-to-manage-environments-in-studio/details-page.png" alt-text="Environments details page":::

## View logs

Click on the **Build log** tab within the details page to view the logs of an environment version and the environment log analysis. Environment log analysis is a feature that provides insight and relevant troubleshooting documentation to explain environment definition issues or image build failures.
* Build log contains the bare output from an Azure Container Registry (ACR) task or an Image Build Compute job.
* Image build analysis is an analysis of the build log used to see the cause of the image build failure.
* Environment definition analysis provides information about the environment definition if it goes against best practices for reproducibility, supportability, or security.

For an overview of common build failures, see [How to troubleshoot for environments](https://aka.ms/azureml/environment/troubleshooting-guide).

If you have feedback on the environment log analysis, file a [GitHub issue](https://aka.ms/azureml/environment/log-analysis-feedback).

## Rebuild an environment

In the details page, click on the **rebuild** button to rebuild the environment. Any unpinned package versions in your configuration files may be updated to the most recent version with this action. 
