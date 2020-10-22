---
title: What is Azure Machine Learning studio?
description: Azure Machine Learning studio is a web portal for Azure Machine Learning workspaces. The studio combines no-code and code-first experiences to create an inclusive data science platform.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: overview
author: peterclu
ms.author: peterlu
ms.date: 08/24/2020
---
 
# What is Azure Machine Learning studio?

In this article, you learn about Azure Machine Learning studio, the web portal for data scientist developers in [Azure Machine Learning](overview-what-is-azure-ml.md). The studio combines no-code and code-first experiences for an inclusive data science platform.

In this article you learn:
>[!div class="checklist"]
> - How to [author machine learning projects](#author-machine-learning-projects) in the studio.
> - How to [manage assets and resources](#manage-assets-and-resources) in the studio.
> - The differences between [Azure Machine Learning studio and ML Studio (classic)](#ml-studio-classic-vs-azure-machine-learning-studio).


## Author machine learning projects

The studio offers multiple authoring experiences depending on the type project and the level of user experience.

+ **Notebooks**

  Write and run your own code in managed [Jupyter Notebook servers](how-to-run-jupyter-notebooks.md) that are directly integrated in the studio. 

+ **Azure Machine Learning designer**

  Use the designer to train and deploy machine learning models without writing any code. Drag and drop datasets and modules to create ML pipelines. Try out the [designer tutorial](tutorial-designer-automobile-price-train-score.md).

    ![Azure Machine Learning designer example](media/concept-designer/designer-drag-and-drop.gif)

+ **Automated machine learning UI**

  Learn how to create [automated ML experiments](tutorial-first-experiment-automated-ml.md) with an easy-to-use interface. 

  [![Azure Machine Learning studio navigation pane](./media/overview-what-is-azure-ml/azure-machine-learning-automated-ml-ui.jpg)](./media/overview-what-is-azure-ml/azure-machine-learning-automated-ml-ui.jpg)

+ **Data labeling**

    Use [Azure Machine Learning data labeling](how-to-create-labeling-projects.md) to efficiently coordinate data labeling projects.

## Manage assets and resources

Manage your machine learning assets directly in your browser. Assets are shared in the same workspace between the SDK and the studio for a seamless experience. Use the studio to manage:

- Models
- Datasets
- Datastores
- Compute resources
- Notebooks
- Experiments
- Run logs
- Pipelines 
- Pipeline endpoints

Even if you're an experienced developer, the studio can simplify how you manage workspace resources.

## ML Studio (classic) vs Azure Machine Learning studio

Released in 2015, **ML Studio (classic)** was our first drag-and-drop machine learning builder. It is a standalone service that only offers a visual experience. Studio (classic) does not interoperate with Azure Machine Learning.

**Azure Machine Learning** is a separate and modernized service that delivers a complete data science platform. It supports both code-first and low-code experiences.

**Azure Machine Learning studio** is a web portal *in* Azure Machine Learning that contains low-code and no-code options for project authoring and asset management. 

We recommend that new users choose **Azure Machine Learning**, instead of ML Studio (classic), for the latest range of data science tools.

### Feature comparison

The following table summarizes the key differences between ML Studio (classic) and Azure Machine Learning.

| Feature | ML Studio (classic) | Azure Machine Learning |
|---| --- | --- |
| Drag and drop interface | Classic experience | Updated experience - [Azure Machine Learning designer](concept-designer.md)| 
| Code SDKs | Unsupported | Fully integrated with [Azure Machine Learning Python](https://docs.microsoft.com/python/api/overview/azure/ml/) and [R](tutorial-1st-r-experiment.md) SDKs |
| Experiment | Scalable (10-GB training data limit) | Scale with compute target |
| Training compute targets | Proprietary compute target, CPU support only | Wide range of customizable [training compute targets](concept-compute-target.md#train). Includes GPU and CPU support | 
| Deployment compute targets | Proprietary web service format, not customizable | Wide range of customizable [deployment compute targets](concept-compute-target.md#deploy). Includes GPU and CPU support |
| ML Pipeline | Not supported | Build flexible, modular [pipelines](concept-ml-pipelines.md) to automate workflows |
| MLOps | Basic model management and deployment; CPU only deployments | Entity versioning (model, data, workflows), workflow automation, integration with CICD tooling, CPU and GPU deployments [and more](concept-model-management-and-deployment.md) |
| Model format | Proprietary format, Studio (classic) only | Multiple supported formats depending on training job type |
| Automated model training and hyperparameter tuning |  Not supported | [Supported](concept-automated-ml.md). Code-first and no-code options. | 
| Data drift detection | Not supported | [Supported](how-to-monitor-datasets.md) |
| Data labeling projects | Not supported | [Supported](how-to-create-labeling-projects.md) |


## Next steps

Visit the [studio](https://ml.azure.com), or explore the different authoring options with these tutorials:  
  + [Use Python notebooks to train & deploy models](tutorial-1st-experiment-sdk-setup.md)
  + [Use automated machine learning to train & deploy models](tutorial-first-experiment-automated-ml.md)  
  + [Use the designer to train & deploy models](tutorial-designer-automobile-price-train-score.md)

