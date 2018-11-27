---
title: "Quickstart: Create a machine learning service workspace in the Azure portal - Azure Machine Learning"
description: Use the Azure portal to create an Azure Machine Learning workspace. This workspace is the foundational block in the cloud that you use to experiment, train, and deploy machine learning models with Azure Machine Learning.  
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: quickstart
ms.reviewer: sgilley
author: rastala
ms.author: roastala
ms.date: 09/24/2018
---

# Quickstart: Use the Azure portal to get started with Azure Machine Learning

In this quickstart, you use the Azure portal to create an Azure Machine Learning workspace. This workspace is the foundational block in the cloud that you use to experiment, train, and deploy machine learning models with Machine Learning. This quickstart uses cloud resources and requires no installation. To configure your own Jupyter notebook server instead, see [Quickstart: Use Python to get started with Azure Machine Learning](quickstart-create-workspace-with-python.md).

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE2F9Ad]

In this quickstart, you:

* Create a workspace in your Azure subscription.
* Try it out with Python in an Azure notebook, and log values across multiple iterations.
* View the logged values in your workspace.

The following Azure resources are added automatically to your workspace when they're regionally available:

  - [Azure Container Registry](https://azure.microsoft.com/services/container-registry/)
  - [Azure Storage](https://azure.microsoft.com/services/storage/)
  - [Azure Application Insights](https://azure.microsoft.com/services/application-insights/) 
  - [Azure Key Vault](https://azure.microsoft.com/services/key-vault/)

The resources you create can be used as prerequisites to other Machine Learning service tutorials and how-to articles. As with other Azure services, there are limits on certain resources associated with Machine Learning. An example is Azure Batch AI cluster size. For information on default limits and how to increase your quota, see [this article](how-to-manage-quotas.md).

If you don’t have an Azure subscription, create a [free account](https://aka.ms/AMLfree) before you begin.


## Create a workspace 

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

On the workspace page, select `Explore your Azure Machine Learning service workspace`.

 ![Explore workspace](./media/quickstart-get-started/explore_aml.png)


## Use the workspace

Now see how a workspace helps you manage your machine learning scripts. In this section, you:

* Open a notebook in Azure Notebooks.
* Run code that creates some logged values.
* View the logged values in your workspace.

This example shows how the workspace can help you keep track of information generated in a script. 

### Open a notebook 

Azure Notebooks provides a free cloud platform for Jupyter notebooks that are preconfigured with everything you need to run Machine Learning.  

Select `Open Azure Notebooks` to try your first experiment.

 ![Open Azure Notebooks](./media/quickstart-get-started/explore_ws.png)

Your organization might require [administrator consent](https://notebooks.azure.com/help/signing-up/work-or-school-account/admin-consent) before you can sign in.

After you sign in, a new tab opens and a `Clone Library` prompt appears. Select `Clone`


### Run the notebook

Along with two notebooks, you see a `config.json` file. This config file contains information about the workspace you created.  

Select `01.run-experiment.ipynb` to open the notebook.

To run the cells one at a time, use `Shift`+`Enter`. Or select `Cells` > `Run All` to run the entire notebook. When you see an asterisk [*] next to a cell, it's running. After the code for that cell finishes, a number appears. 

After you've completed running all of the cells in the notebook, you can view the logged values in your workspace.

## View logged values

After you run all the cells in the notebook, go back to the portal page.  

Select `View Experiments`.

![View experiments](./media/quickstart-get-started/view_exp.png)

Close the `Reports` pop-up.

Select `my-first-experiment`.

See information about the run you just performed. Scroll down the page to find the table of runs. Select the run number link.

 ![Run history link](./media/quickstart-get-started/report.png)

You see plots that were automatically created of the logged values. Whenever you log multiple values with the same name parameter, a plot is automatically generated for you.

   ![View history](./media/quickstart-get-started/plots.png)

Since the code to approximate pi uses random values, your plots will show different values.  

## Clean up resources 

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

You also can keep the resource group but delete a single workspace. Display the workspace properties, and select **Delete**.

## Next steps

You created the necessary resources to experiment with and deploy models. You also ran some code in a notebook. And you explored the run history from that code in your workspace in the cloud.

For an in-depth workflow experience, follow Machine Learning tutorials to train and deploy a model.  

> [!div class="nextstepaction"]
> [Tutorial: Train an image classification model](tutorial-train-models-with-aml.md)
