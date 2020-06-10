---
title: Azure Machine Learning Enterprise & Basic Editions
description: Learn about the differences between the editions of Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
author: j-martens
ms.author: jmartens
ms.date: 06/11/2020
---

# Enterprise & Basic Editions of Azure Machine Learning 

Azure Machine Learning offers two editions tailored for your machine learning needs:

| Basic Edition | Enterprise Edition                 |
|------------------------------------------------------------------------------------|-----------|
|Great for open-source development <br/>at cloud scale with <br/>a code-first experience.|All of Basic <br/>+ the studio web interface <br/>+ secure, comprehensive ML lifecycle management <br/>for all skill levels.|

These editions determine which machine learning tools are available to developers and data scientists from their workspace.   

Basic workspaces allow you to continue using Azure Machine Learning and pay for only the Azure resources consumed during the machine learning process. Enterprise edition workspaces will be charged only for their Azure consumption while the edition is in preview. 

## How to pick the edition

You assign the edition whenever you create a workspace. And, pre-existing workspaces have been converted to the Basic edition for you. Basic edition includes all features that were already generally available as of October 2019. Any experiments in those workspaces that were built using Enterprise edition features will continue to be available to you in read-only until you upgrade to Enterprise. Learn how to [upgrade a Basic workspace to Enterprise edition](how-to-manage-workspace.md#upgrade). 

Customers are responsible for costs incurred on compute and other Azure resources during this time.

## What is in each edition

### Data for Machine Learning capabilities  

| Data capabilities                     | Edition                 |
|------------------------------------------------------------------------------------|:-----------:|
| Labelling Project Management Portal                                                | All                     |
| Labeller Portal                                                                    | All                     |
| Labelling using private workforce                                                  | All                     |
| ML assisted labeling (Image classification and Object detection)                   | Enterprise edition only |
| Create, view or edit datasets and datastores from the SDK                          | All                     |
| Create, view or edit datasets and datastores from the UI                           | All                     |
| View, edit or delete dataset drift monitors from the SDK                           | All                     |
| View, edit or delete dataset drift monitors from the UI                            | Enterprise edition only |

<br/>
<br/>

### Build & train capabilities

| Build & Train Capabilities    | Edition                 |
|------------------------------------------------------------------------------------|:-----------:|
| Automated Machine Learning - Create and run experiments in notebooks               | All                     |
| Automated Machine Learning - Create and run experiments in studio web experience   | Enterprise edition only |
| Automated Machine Learning - Industry-leading forecasting capabilities             | Enterprise edition only |
| Automated Machine Learning - Support for deep learning and other advanced learners | Enterprise edition only |
| Automated Machine Learning - Large data support (up to 100 GB)                     | Enterprise edition only |
| Responsible ML - Model Explainability                                              | All                     |
| Responsible ML - Differential privacy WhiteNoise toolkit                           | All                     |
| Responsible ML - custom tags in Azure Machine Learning to implement datasheets     | All                     |
| Responsible ML - Fairness AzureML Integration                                      | All                     |
| Visual Studio Code integration                                                     | All                     |
| Reinforcement Learning                                                             | All                     |
| Experimentation UI                                                                 | All                     |
| Create, run and publish pipelines using the Azure ML SDK                           | All                     |
| Create pipeline endpoints using the Azure ML SDK                                   | All                     |
| Create, edit and delete scheduled runs of pipelines using the Azure ML SDK         | All                     |
| View pipeline run details in studio                                                | All                     |
| Create, run, visualize and publish pipelines in Azure ML designer                  | Enterprise edition only |
| Create pipeline endpoints in Azure ML designer                                     | Enterprise edition only |
| Managed compute Instances for integrated Notebooks                                 | All                     |
| Jupyter, JupyterLab Integration                                                    | All                     |
| R SDK support                                                                      | All                     |
| Python SDK support                                                                 | All                     |


<br/>
<br/>

### Deploy & model management capabilities

| Deploy & Model Management Capabilities                            | Edition                 |
|------------------------------------------------------------------------------------|:-----------:|
| The Azure DevOps extension for Machine Learning & the Azure ML CLI                 | All                     |
| Event Grid integration                                                             | All                     |
| Integrate Azure Stream Analytics with Azure Machine Learning                       | All                     |
| Create ML pipelines in SDK                                                         | All                     |
| Batch inferencing                                                                  | All                     |
| FPGA based Hardware Accelerated Models                                             | All                     |
| Model profiling                                                                    | All                     |
| Explainability in UI                                                               | Enterprise edition only |

<br/>
<br/>

### Security, governance, and control capabilities

| Security, Governance, and Control Capabilities     | Edition                 |
|------------------------------------------------------------------------------------|:-----------:|
| Role-based Access Control (RBAC) support                                           | All                     |
| Virtual Network (VNet) support for compute                                         | All                     |
| Scoring endpoint authentication                                                    | All                     |
| Workplace Private link                                                             | All                     |
| Managed Identity for AML Compute                                                   | All                     |
| quota management across workspaces                                                 | Enterprise edition only |

## Next steps

Learn more about what's available in the Azure Machine Learning [edition overview & pricing page](https://azure.microsoft.com/pricing/details/machine-learning/). 
