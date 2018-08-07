---
title: Build, train, deploy models in Azure Machine Learning
description: This full-length tutorial shows how to use Azure Machine Learning services to build, train, and deploy a model with Azure Machine Learning in Python.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: quickstart

author: hning86
ms.author: haining
ms.reviewer: jmartens
ms.date: 09/24/2018
---

# Tutorial #2: Deploy model on Azure Machine Learning with MNIST dataset and TensorFlow

This tutorial is **part two of a three-part series**. In this part of the tutorial, you use Azure Machine Learning services (Preview) to:

> [!div class="checklist"]
> * Choose the best model
> * Test the model
> * Deploy as a web service

## Prerequisites
To complete this tutorial, you must have the following prerequisites.

1. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

1. The workspace, project, data, and model from [part 1 of the Tutorial](tutorial-train-models-with-aml.md)

### Delete the web service


```python
service.delete()
```


## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

In this Azure Machine Learning tutorial, you used Python to:
> [!div class="checklist"]
> * Train a model locally 
> * Train a model on remote Data Science Virtual Machine (DSVM)
> * Deploy and test a web service to Azure Container Instances

You can also try out the AutoML tutorial to see how Azure Machine Learning can automatically propose the best algorithm for your model and build that model for you. 