---
title: What is Azure Machine Learning studio?
description: Azure Machine Learning studio is a web portal for Azure Machine Learning workspaces. The studio combines no-code and code-first experiences to create an inclusive data science platform.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: overview
author: j-martens
ms.author: jmartens
ms.date: 08/24/2020
---
 
# What is Azure Machine Learning studio?

In this article, you learn about Azure Machine Learning studio, the web portal for data scientist developers in Azure Machine Learning. The studio combines no-code and code-first experiences for an inclusive data science platform.

Use the studio to:
- Author machine learning projects
- Manage assets and resources

## Author ML projects

The studio offers multiple authoring experiences depending on the type project and the level of user experience.

+ **Notebooks**

  Write and run your own code in managed Jupyter Notebook servers.

+ **Azure Machine Learning designer (preview)**

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
- Experiments
- Run logs
- Pipelines 
- Pipeline endpoints
- And more

Even if you're an experienced developer, the studio can make it easy to manage your workspace resources.

## Machine Learning Studio (classic) vs Azure Machine Learning studio

Released in 2015, Machine Learning **Studio (classic)** was our first drag-and-drop machine learning builder. It is a standalone service that only offers a visual experience. Studio (classic) does not interoperate with Azure Machine Learning.

**Azure Machine Learning** is a separate and modernized service that delivers a complete data science platform. It supports both code-first and low-code experiences.

**Azure Machine Learning studio** is a web portal *in* Azure Machine Learning that contains low-code and no-code options for project authoring and asset management. 

We recommend that new users choose **Azure Machine Learning**, instead of Machine Learning studio (classic), for the latest range of data science tools.

### Feature comparison

The following table summarizes the key differences between Machine Learning Studio (classic) and Azure Machine Learning.

| Feature | Machine Learning Studio (classic) | Azure Machine Learning |
|---| --- | --- |
| Drag and drop interface | Classic experience | Updated experience - [Azure Machine Learning designer (preview)](concept-designer.md) <br/>(Requires Enterprise workspace) | 
| Experiment | Scalable (10-GB training data limit) | Scale with compute target |
| Training compute targets | Proprietary compute target, CPU support only | Wide range of customizable [training compute targets](concept-compute-target.md#train). Includes GPU and CPU support | 
| Deployment compute targets | Proprietary web service format, not customizable | Wide range of customizable [deployment compute targets](concept-compute-target.md#deploy). Includes GPU and CPU support |
| ML Pipeline | Not supported | Build flexible, modular [pipelines](concept-ml-pipelines.md) to automate workflows |
| MLOps | Basic model management and deployment | Entity versioning (model, data, workflows), workflow automation, integration with CICD tooling, [and more](concept-model-management-and-deployment.md) |
| Model format | Proprietary format, Studio (classic) only | Multiple supported formats depending on training job type |
| Automated model training and hyperparameter tuning |  Not supported | [Supported](concept-automated-ml.md) | 
| Data drift detection | Not supported | [Supported](how-to-monitor-datasets.md) |

## Next steps

Visit the studio at [ml.azure.com](https://ml.azure.com), or learn how to use some of the studio's features:  
  + [Use Python notebooks to train & deploy models](tutorial-1st-experiment-sdk-setup.md)
  + [Use automated machine learning to train & deploy models](tutorial-first-experiment-automated-ml.md)  
  + [Use the designer to train & deploy models](tutorial-designer-automobile-price-train-score.md)

