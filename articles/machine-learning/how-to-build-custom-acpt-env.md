---
title: Create ACPT Custom Curated Environment
titleSuffix: Azure Machine Learning
description: In AML, you can create customized environments to run your machine learning models and reuse it in different scenarios.
services: machine-learning
author: sheetalarkadam
ms.author: parinitarahi
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 03/17/2023
---

# Creating Custom Curated ACPT Environments in Azure Machine Learning Studio

If you are looking to extend curated environment and add HF transformers or datasets or any other external packages to be installed, AzureML offers creating a new env with docker context containing ACPT curated environment as base image and additional packages on top of it as below.

### Step 1: Navigate to Environments

In the [Azure Machine Learning Studio](https://ml.azure.com/registries/environments), navigate to the "Environments" section by clicking on the "Environments" option in the left-hand menu.

![Screenshot of navigating to environments from AML studio](media/how-to-build-custom-acpt-env/navigate_to_environments.png) 

### Step 2: Navigate to Curated Enviroments

Navigate to curated environments and search "acpt" to list all the available ACPT curated enviroments. Clicking on the environment will show details of the environment. 

![Screenshot of navigating to curated enviroments](media/how-to-build-custom-acpt-env/navigate-to-curated-environments.png) 

### Step 3: Get details of the curated enviroment

To create custom environment you will need the base docker image repository which can be found in the "Description" section as "Azure Container Registry". Copy the "Azure Container Registry" name which will be used later when you create a new custom environment.

![Screenshot of getting contaioner registry name](media/how-to-build-custom-acpt-env/get_details-curated-environments.png) 

### Step 4: Navigate to Custom Enviroments

Go back and click on the " Custom Environments" tab.

![Screenshot of navigating to custom enviroments](media/how-to-build-custom-acpt-env/navigate-to-custom-environment.png)

### Step 5: Create Custom Environment 

Click on + Create. In the "Create Environment" window, name the environment, description and select "Create a new docker context" in Select enbvironment type section

![Screenshot of creating custom environment](media/how-to-build-custom-acpt-env/create-environment-window.png)

Paste the docker image name that you copied in Step 3. Configure your environment by declaring the base image and add any env variables you want to use and the packages that you want to include.

![Screenshot of configuring the environment with name, packages with docker context](media/how-to-build-custom-acpt-env/configure-environment.png)

Review your environment settings, add any tags if needed and click on the "Create" button to create your custom environment.

That's it! You have now created a custom environment in Azure Machine Learning Studio and can use it to run your machine learning models.

## Next steps

* Learn more about environment objects:

    * [What are Azure Machine Learning Environments? ](concept-environments.md.md).
    * Learn more about [curated environments](concept-environments.md).

* Learn more about [training models in AML](concept-train-machine-learning-model.md).
