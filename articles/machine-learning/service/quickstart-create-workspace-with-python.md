---
title: 'Quickstart: Get started in Python'
titleSuffix: Azure Machine Learning service
description: Get started with Azure Machine Learning service in Python. Use the Python SDK to create a workspace, which is the foundational block in the cloud that you use to experiment, train, and deploy machine learning models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: quickstart
ms.reviewer: sgilley
author: sdgilley
ms.author: sgilley
ms.date: 01/22/2019
ms.custom: seodec18

---

# Quickstart: Use the Python SDK to get started with Azure Machine Learning

In this article, you use the Azure Machine Learning SDK for Python to run code that is logged in the Azure Machine Learning service [workspace](concept-azure-machine-learning-architecture.md). The workspace is the foundational block in the cloud that you use to experiment, train, and deploy machine learning models with Machine Learning.

This quickstart uses your own Python environment and Jupyter Notebook Server. For a quickstart with no installation, see [Quickstart: Use the Azure portal to get started with Azure Machine Learning](quickstart-get-started.md). 

View a video version of this quickstart:

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE2G9N6]

In this quickstart, you:

* Write code that logs values inside the workspace.
* View the logged values in your workspace.

If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

##Prerequisites

* A Python 3.6 notebook server with the following installed:
    * The Azure Machine Learning Data Prep SDK for Python
* An Azure Machine Learning service workspace
* A workspace configuration file (**aml_config/config.json** ).

Get all these prerequisites from [Create a Azure Machine Learning service workspace](setup-create-workspace.md#portal).


## Use the workspace

Create a script or start a notebook in the same directory as your workspace configuration file. Run this code that uses the basic APIs of the SDK to track experiment runs.

1. Create an experiment in the workspace.
1. Log a single value into the experiment.
1. Log a list of values into the experiment.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=useWs)]

## View logged results

When the run finishes, you can view the experiment run in the Azure portal. To print a URL that navigates to the results for the last run, use the following code:

```python
print(run.get_portal_url())
```

Use the link to view the logged values in the Azure portal in your browser.

![Logged values in the Azure portal](./media/quickstart-create-workspace-with-python/logged-values.png)

## Clean up resources 

>[!IMPORTANT]
>You can use the resources you've created here as prerequisites to other Machine Learning tutorials and how-to articles.

If you don't plan to use the resources that you created in this article, delete them to avoid incurring any charges.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/quickstart-create-workspace-with-python/quickstart.py?name=delete)]

## Next steps

In this article, you created the resources you need to experiment with and deploy models. You ran code in a notebook, and you explored the run history for the code in your workspace in the cloud.

> [!div class="nextstepaction"]
> [Tutorial: Train an image classification model](tutorial-train-models-with-aml.md)

You can also explore [more advanced examples on GitHub](https://aka.ms/aml-notebooks) or view the [SDK user guide](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).
