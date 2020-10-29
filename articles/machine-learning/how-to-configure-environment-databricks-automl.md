---
title: Develop with autoML & Azure Databricks
titleSuffix: Azure Machine Learning
description: Learn to set up a development environment for Azure Machine Learning and Azure Databricks. Use the Azure ML SDKs for Databricks and Databricks with autoML.
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.date: 10/21/2020
ms.topic: conceptual
ms.custom: how-to, devx-track-python
---

# Set up a development environment with Azure Databricks and autoML for Azure Machine Learning 

Learn how to configure a development environment for Azure Machine Learning that uses Azure Databricks and automated ML.

[Azure Databricks](#aml-databricks) is ideal for running large-scale intensive machine learning workflows on the scalable Apache Spark platform in the Azure cloud. It provides a collaborative Notebook-based environment with a CPU or GPU-based compute cluster.

For information on other machine learning development environments, see [Set up Python development environment](how-to-configure-environment.md).


## Prerequisite

* Azure Machine Learning workspace. If you don't have one you can create an Azure Machine Learning workspace through the [Azure portal](how-to-manage-workspace.md), [Azure CLI](how-to-manage-workspace-cli.md#create-a-workspace), and [Azure Resource Manager templates](how-to-create-workspace-template.md).


## Azure Databricks with Azure Machine Learning and autoML

With Azure Machine Learning, you can use Azure Databricks:

+ To train a model using Spark MLlib and deploy the model to ACI/AKS.
+ With [automated machine learning](concept-automated-ml.md) capabilities.
+ As a compute target from an [Azure Machine Learning pipeline](concept-ml-pipelines.md).

You can also use the Azure ML SDK for Data

## Set up your Databricks cluster

Create a [Databricks cluster](https://docs.microsoft.com/azure/azure-databricks/quickstart-create-databricks-workspace-portal). Some settings apply only if you install the SDK for automated machine learning on Databricks.
**It takes few minutes to create the cluster.**

Use these settings:

| Setting |Applies to| Value |
|----|---|---|
| Cluster name |always| yourclustername |
| Databricks Runtime |always|Non-ML Runtime 7.1 (scala 2.21, spark 3.0.0) |
| Python version |always| 3 |
| Workers |always| 2 or higher |
| Worker node VM types <br>(determines max # of concurrent iterations) |Automated ML<br>only| Memory optimized VM preferred |
| Enable Autoscaling |Automated ML<br>only| Uncheck |

Wait until the cluster is running before proceeding further.

## Install the correct SDK into a Databricks library

Once the cluster is running, [create a library](https://docs.databricks.com/user-guide/libraries.html#create-a-library) to attach the appropriate Azure Machine Learning SDK package to your cluster. For automated ML skip to the [SDK for Databricks with automated machine learning section](#sdk-for-databricks-with-automated-machine-learning).


1. Right-click the current Workspace folder where you want to store the library. Select **Create** > **Library**.
    > [Tip]
    > If you have an old SDK version, deselect it from cluster's installed libs and move to trash. Install the new SDK version and restart the cluster. If there is an issue after the restart, detach and reattach your cluster.

1. Choose the following option (no other SDK installation are supported)

   |SDK&nbsp;package&nbsp;extras|Source|PyPi&nbsp;Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|
   |----|---|---|
   |For Databricks| Upload Python Egg or PyPI | azureml-sdk[databricks]|

   > [!Warning]
   > No other SDK extras can be installed. Choose only the [`databricks`] option .

   * Do not select **Attach automatically to all clusters**.
   * Select  **Attach** next to your cluster name.

1. Monitor for errors until status changes to **Attached**, which may take several minutes.  If this step fails:

   Try restarting your cluster by:
   1. In the left pane, select **Clusters**.
   1. In the table, select your cluster name.
   1. On the **Libraries** tab, select **Restart**.

### AutoML config with Azure Databricks

In AutoML config, when using Azure Databricks add the following parameters:
    1. ```max_concurrent_iterations``` is based on number of worker nodes in your cluster.
    2. ```spark_context=sc``` is based on the default spark context.


If install was successful, the imported library should look like one of these:

### SDK for Databricks
![Azure Machine Learning SDK for Databricks](./media/how-to-configure-environment/amlsdk-withoutautoml.jpg)

### SDK for Databricks with automated machine learning
If the cluster was created with Databricks non ML runtime 7.1 or above, run the following command in the first cell of your notebook to install the AML SDK.

```
%pip install --upgrade --force-reinstall -r https://aka.ms/automl_linux_requirements.txt
```
For Databricks non ML runtime 7.0 and lower, install the AML SDK using the [init script](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/azure-databricks/automl/README.md).


## ML notebooks that work with Azure Databricks

Try it out:
+ While many sample notebooks are available, **only [these sample notebooks](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/azure-databricks) work with Azure Databricks.**

+ Import these samples directly from your workspace. See below:
![Select Import](./media/how-to-configure-environment/azure-db-screenshot.png)
![Import Panel](./media/how-to-configure-environment/azure-db-import.png)

+ Learn how to [create a pipeline with Databricks as the training compute](how-to-create-your-first-pipeline.md).

## Next steps

- [Train a model](tutorial-train-models-with-aml.md) on Azure Machine Learning with the MNIST dataset
- View the [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py&preserve-view=true) reference
