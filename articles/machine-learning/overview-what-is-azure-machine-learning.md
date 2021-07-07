---
title: What is Azure Machine Learning?
description: Azure Machine Learning solution for data scientists and ML engineers enabling MLOps and accelerating the model lifecycle.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: overview
ms.author: cgronlun
author: cjgronlund
ms.date: 06/30/2021
ms.custom: devx-track-python
adobe-target: true
---

# What is Azure Machine Learning?

Azure Machine Learning is a cloud service for accelerating and managing the machine learning project lifecycle. Machine learning professionals, data scientists, and engineers can use it in their day-to-day workflows: Train and deploy models, and manage MLOps.

You can create a model in Azure Machine Learning or use a model built from an open-source platform, such as Pytorch, TensorFlow, or scikit-learn. MLOps tools help you monitor, retrain, and redeploy models. 


> [!Tip]
> **Free trial!**  If you don’t have an Azure subscription, create a free account before you begin. [Try the free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/machine-learning/search/). You get credits to spend on Azure services. After they're used up, you can keep the account and use [free Azure services](https://azure.microsoft.com/free/). Your credit card is never charged unless you explicitly change your settings and ask to be charged.

## Who is Azure Machine Learning for?

A full-featured machine learning platform, Azure Machine Learning provides tools for:
- Data scientists
- Machine learning engineers

Train and deploy models, and manage your machine learning project lifecycle

Secure workspaces
Confidential data
Scale

Enterprises...

Data scientists working at any stage of a machine learning project will find tools for 

For model building, from querying and cleaning data to computationally demanding deep learning training, harnessing 

### Enterprise-readiness

key points to hit:

- integration with other Azure services (namely Synapse, Arc)
- general Azure security (private link, vnets, etc.)



### User interface (studio)

key points to hit:

- single pane for data science teams


## Machine learning project workflow

Typically models are developed as part of a project with an objective and goals. Projects often involve more than one person. When experimenting with data, algorithms, and models, development is iterative. 

While the project lifecycle will vary by project, it may often look like this:

**Example project lifecycle diagram**

[project lifecycle diagram]

A workspace organizes a project and allows for collaboration for many users all working toward a common objective. Users in a workspace can easily share the results of their runs from experimentation in the studio user inferface, leverage versioned assets for jobs like environments and storage references, or 

When a project is ready for operationalization, users' work can be automated in a machine learning pipeline and triggered on a schedule or https request.

Models can be deployed to the managed inferencing solution, for both realtime and batch deployments, abstracting away the infrastructure management typically required for deploying models.

### Train models

Training models typically involves data, an algorithm (via code), and an environment executed on compute to produce artifacts representing a model. Models are then packaged or otherwise embedded in applications or processes for meaningful prediction.

While 

key points to hit:

- embarassingly parallel tasks, training many models
- 

### Deploy models

key points to hit:

- abstract the infra management via managed endpoints/deployments
    - no managing Kubernetes clusters needed
    - 
    - 


## MLOps: DevOps for machine learning 

DevOps for machine learning models, often called MLOps, is a process for developing models for production settings. A model's lifecycle from training to deployment must be auditable if not reproducible.

**Example model lifecycle diagram**

[model lifecycle diagram]

Notice that training a machine learning model

Integration with `git`, code snapshots, and lineage between jobs and related assets allows for auditing of the model lifecycle - down to a specific commit, environment, and code.

Learn more about [MLOps in Azure Machine Learning](concept-model-management-and-deployment.md).

### CI/CD and complete solutions

Developer experiences

key points to hit:

- CLI to CI/CD
- Python SDK for full solutions

### Capabilities for machine learning teams

[technical details tone]

- Asset versioning
    - 

key points to hit:

- asset versioning
- tracking and audibility (who did what, when)
- collaboration (shared notebooks, compute, data, environments)



## Next steps

Start using Azure Machine Learning:
- [Set up an Azure Machine Learning workspace](/quickstart-create-resources.md)
- [Tutorial: Build a first machine learning project](tutorial-1st-experiment-hello-world.md)
- [Preview: Run model training jobs with the v2 CLI](how-to-train-cli.md)

