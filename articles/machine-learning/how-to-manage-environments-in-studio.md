---
title: Manage environments in the studio (preview)
titleSuffix: Azure Machine Learning
description: Learn how to create and manage environments in the Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: saachigopal
ms.author:  sagopal
ms.date: 5/25/2021
ms.topic: how-to
ms.custom: devx-track-python
---

# Manage software environments in Azure Machine Learning studio (preview)

In this article, learn how to create and manage Azure Machine Learning [environments](/python/api/azureml-core/azureml.core.environment.environment) in the Azure Machine Learning studio. Use the environments to track and reproduce your projects' software dependencies as they evolve.

The examples in this article show how to:

* Browse curated environments.
* Create an environment and specify package dependencies.
* Edit an existing environment specification and its properties.
* Rebuild an environment and view image build logs.

For a high-level overview of how environments work in Azure Machine Learning, see [What are ML environments?](concept-environments.md) For information, see [How to set up a development environment for Azure Machine Learning](how-to-configure-environment.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* An [Azure Machine Learning workspace](how-to-manage-workspace.md)

## Browse curated environments

Curated environments contain collections of Python packages and are available in your workspace by default. These environments are backed by cached Docker images which reduces the run preparation cost. 

Click on an environment to see detailed information about its contents. For more information, see [Azure Machine Learning curated environments](resource-curated-environments.md). 

## Create an environment

To create an environment:
1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com).
1. On the left side, select **Environments**.
1. Select the **Custom environments** tab. 
1. Select the **Create** button. 

Create an environment by specifying one of the following:
* Pip requirements [file](https://pip.pypa.io/en/stable/cli/pip_install)
* Conda yaml [file](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html)
* Docker [image](https://hub.docker.com/search?q=&type=image)
* [Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

:::image type="content" source="media/how-to-manage-environments-in-studio/create-page.jpg" alt-text="Environment creation wizard":::

You can customize the configuration file, add tags and descriptions, and review the properties before creating the entity. 

If a new environment is given the same name as an existing environment in the workspace, a new version of the existing one will be created.

## View and edit environment details

Once an environment has been created, view its details by clicking on the name. Use the dropdown menu to select different versions of the environment. Here you can view metadata and the contents of the environment through its Docker and Conda layers. 

Click on the pencil icons to edit tags and descriptions as well as the configuration files or image. Keep in mind that any changes to the Docker or Conda sections will create a new version of the environment. 

:::image type="content" source="media/how-to-manage-environments-in-studio/details-page.jpg" alt-text="Environments details page":::

## View image build logs

Click on the **Build log** tab within the details page to view the image build logs of an environment version. 

## Rebuild an environment

In the details page, click on the **rebuild** button to rebuild the environment. Any unpinned package versions in your configuration files may be updated to the most recent version with this action. 
