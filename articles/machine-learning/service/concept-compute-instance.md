---
title: 'What is an Azure Machine Learning compute instance?'
titleSuffix: Azure Machine Learning
description: Learn about the Azure Machine Learning compute instance, a fully managed cloud-based workstation. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sgilley
author: sdgilley
ms.date: 10/08/2019
# As a data scientist, I want to know what a compute instance is and how to use it for Azure Machine Learning.
---

# What is an Azure Machine Learning compute instance?

An Azure Machine Learning compute instance is a fully managed cloud-based workstation.  It's easy to get started with Azure Machine Learning using the management and enterprise readiness capabilities of this compute resource. Use a compute instance as your fully configured and managed development environment in the cloud.

## Why use a compute instance?

A compute instance is a single managed VM, optimized to be your development environment in the cloud.  

* Collaborative: Provide your team of data scientists with a collaborative environment. Within the boundaries of a workspace, you can work on shared data, shared notebooks, and collaboratively debug models on shared compute instances.

* Managed: A managed VM with restricted end-user controls.  

* Secure: Support for secure networking configurations such as virtual network support and SSH policy. Robust management policies such as OS updates, automated provisioning, [role-based access control (RBAC)](/azure/role-based-access-control/overview), and disk encryption.

* Preconfigured for ML:  Pre-configured and up-to-date ML packages, GPU drivers, and everything you need to save time on setup tasks.

* Fully customizable: Broad support for Azure VM types including GPUs and persisted low-level customization makes advanced scenarios a breeze.

## Tools and environments

Azure Machine Learning compute instance enables you to author, train, and deploy models in a [fully integrated notebook experience](tutorial-1st-experiment-R-set-up.md) in your workspace. 

Use these pre-configured tools on the compute instance:

* Jupyter
* Jupyter Labs
* RStudio
* VS Code

These environments are installed for your machine learning tasks:

* Python
* R

Compute instances can be used as a compute target for training and inferencing.  For large tasks, [Azure Machine Learning compute clusters](how-to-set-up-training-targets.md#amlcompute) with multi-node scaling capabilities is a better compute target choice.

## Sharing

Notebooks that you run on your instance have access to the data stores and compute resources of your workspace. The notebooks themselves are stored in a storage account of your workspace. The storage  makes it easy to share notebooks between compute instances.  The storage account also keeps your notebooks safely preserved when you delete a compute instance. 

When you create a compute instance, you control whether it can be shared. Each shared compute instance has its own managed identity, so you can share access without compromising your credentials. Each person who accesses the compute instance signs in with their own identity.  

## Accessing files

Your 

## Managing a compute instance

In your workspace in [Azure Machine Learning studio](https://ml.azure.com), use the **Compute** section to perform the following actions on your compute instance:
* Create
* Refresh
* Start
* Stop
* Restart
* Delete  

You can also create an instance anywhere you need to select one for use in the studio.


## Next steps
 * [Tutorial: Get started with Azure Machine Learning and its R SDK](tutorial-1st-experiment-R-set-up.md) shows how to create and use a compute instance.
