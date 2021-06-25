---
title: What is Azure Machine Learning?
description: Azure Machine Learning solution for data scientists and ML engineers enabling MLOps and accelerating the model lifecycle.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: overview
ms.author: larryfr
author: BlackMist
ms.date: 06/24/2021
ms.custom: devx-track-python
adobe-target: true
---

# What is Azure Machine Learning?

Azure Machine Learning is a cloud service for managing and accelerating the machine learning model lifecycle. Machine learning professionals, data scientists, and engineers use it to accelerate their day-to-day workflows.

As a full-fledged Azure service in the Microsoft cloud, 

## Who is Azure Machine Learning for?

Enterprises...

Data scientists working at any stage of a machine learning project will find tools for 

For model building, from querying and cleaning data to computationally demanding deep learning training, harnessing 

## DevOps for machine learning (MLOps) [model lifecycle]

DevOps for machine learning models, often called MLOps, is a process for developing models for production settings. A model's lifecycle from training to deployment must be auditable if not reproducible.

**Example model lifecycle diagram**

[model lifecycle diagram]

Notice that training a machine learning model

Integration with `git`, code snapshots, and lineage between jobs and related assets allows for auditing of the model lifecycle - down to a specific commit, environment, and code.

## Machine learning project lifecycle [people lifecycle]

Typically models are developed as part of a project with an objective and goals. Projects often involve more than one person. When experimenting with data, algorithms, and models, development is iterative. 

While the project lifecycle will vary by project, it may often look like this:

**Example project lifecycle diagram**

[project lifecycle diagram]

A workspace organizes a project and allows for collaboration for many users all working toward a common objective. Users in a workspace can easily share the results of their runs from experimentation in the studio user inferface, leverage versioned assets for jobs like environments and storage references, or 

When a project is ready for operationalization, users' work can be automated in a machine learning pipeline and triggered on a schedule or https request.

Models can be deployed to the managed inferencing solution, for both realtime and batch deployments, abstracting away the infrastructure management typically required for deploying models.

## Train models

Training models typically involves data, an algorithm (via code), and an environment executed on compute to produce artifacts representing a model. Models are then packaged or otherwise embedded in applications or processes for meaningful prediction.

While 

key points to hit:

- embarassingly parallel tasks, training many models
- 

## Deploy models

key points to hit:

- abstract the infra management via managed endpoints/deployments
    - no managing Kubernetes clusters needed

## Built for ML teams

[technical details tone]

- Asset versioning
    - 

key points to hit:

- asset versioning
- tracking and audibility (who did what, when)
- collaboration (shared notebooks, compute, data, environments)

## Built for enterprises

key points to hit:

- integration with other Azure services (namely Synapse, Arc)
- general Azure security (private link, vnets, etc.)

## Developer experiences

key points to hit:

- CLI to CI/CD
- Python SDK for full solutions

## User interface (studio)

key points to hit:

- single pane for data science teams

## Next steps

- something

