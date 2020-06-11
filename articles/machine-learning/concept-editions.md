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

Azure Machine Learning offers two editions tailored for your machine learning needs. These editions determine which machine learning tools are available to developers and data scientists from their workspace.

<br/>
<br/>

| Basic edition | Enterprise edition                 |
|------------------------------------------------------------------------------------|-----------|
|Great for: <br/>+ open-source development <br/>+ at cloud scale with a<br/>+ code-first experience <br/><br/>Basic workspaces allow you to continue using Azure Machine Learning and [pay only for the Azure resources consumed](concept-plan-manage-cost.md) during the ML process. |All of Basic edition, plus:<br/>+ the studio web interface <br/>+ secure, comprehensive ML lifecycle management <br/>+ for all skill levels<br/><br/>Enterprise edition workspaces are charged only for their Azure consumption while the edition is in preview. |

## How to choose an edition

You assign the edition whenever you create a workspace. And, pre-existing workspaces have been converted to the Basic edition for you. 

Customers are responsible for costs incurred on compute and other Azure resources during this time. Learn how to [manage costs for Azure Machine Learning](concept-plan-manage-cost.md).

Learn how to [upgrade a Basic workspace to Enterprise edition](how-to-manage-workspace.md#upgrade). 


## What's in each edition

### Data for Machine Learning capabilities  

| Capabilities                     | Edition                 |
|------------------------------------------------------------------------------------|:-----------:|
| Labeling: Create & manage labeling projects in studio (Web)                                                | All                     |
| Labeling: Labeler in studio (Web)                                    | All                     |
| Labeling: Use private workforce                               | All                     |
| Labeling: ML assisted Image classification & Object detection                  | Enterprise edition only |
| Datasets + datastores: create & manage in Python                       | All                     |
| Datasets + datastores: create & manage in studio (Web)                         | All                     |
| Drift: View & manage dataset monitors in Python                           | All                     |
| Drift: View & manage dataset monitors in studio (Web)                            | Enterprise edition only |


<br/>
<br/>

### Automated training capabilities (AutoML)

| Capabilities    | Edition                 |
|------------------------------------------------------------------------------------|:-----------:|
| Create & run AutoML experiments in notebooks               | All                     |
| Create & run  AutoML experiments in studio (web)   | Enterprise edition only |
| Industry-leading  AutoML forecasting capabilities             | Enterprise edition only |
| Support for deep learning & other advanced learners | Enterprise edition only |
| Large data support classification & regression tasks (up to 100 GB)                     | Enterprise edition only |


<br/>
<br/>

### Responsible Machine Learning

| Capabilities    | Edition                 |
|------------------------------------------------------------------------------------|:-----------:|
| Model Explainability                                              | All                     |
| Differential privacy WhiteNoise toolkit                           | All                     |
| Custom tags to implement datasheets     | All                     |
| Fairness AzureML Integration                                      | All                     |

<br/>
<br/>


### Build & train capabilities

| Capabilities    | Edition                 |
|------------------------------------------------------------------------------------|:-----------:|
| Visual Studio Code integration                                                     | All                     |
| Reinforcement Learning                                                             | All                     |
| Experimentation UI                                                                 | All                     |
| Jupyter, JupyterLab Integration                                                    | All                     |
| Python SDK support                                                                 | All                     |
| R SDK support                                                                      | All                     |
| ML Pipelines: Create, run and publish  in Python                           | All                     |
| ML Pipelines: Create, edit and delete scheduled runs of pipelines in Python| All                     |
| ML Pipelines: Create pipeline endpoints in Python SDK                                   | All                     |
| ML Pipelines: View run details in studio (web)                                              | All                     |
| ML Pipelines: Create, run, visualize & publish in designer                  | Enterprise edition only |
| ML Pipelines: Create pipeline endpoints in designer | Enterprise edition only |
| Managed compute instances for integrated notebooks                                 | All                     |


<br/>
<br/>

### Deploy & model management capabilities

| Capabilities                            | Edition                 |
|------------------------------------------------------------------------------------|:-----------:|
| The Azure DevOps extension for Machine Learning & the Azure ML CLI                 | All                     |
| [Event Grid integration](how-to-use-event-grid.md)                                                             | All                     |
| Integrate Azure Stream Analytics with Azure Machine Learning                       | All                     |
| Create ML pipelines in SDK                                                         | All                     |
| Batch inferencing                                                                  | All                     |
| FPGA based Hardware Accelerated Models                                             | All                     |
| Model profiling                                                                    | All                     |
| Explainability in UI                                                               | Enterprise edition only |

<br/>
<br/>

### Security, governance, and control capabilities

| Capabilities     | Edition                 |
|------------------------------------------------------------------------------------|:-----------:|
| [Role-based Access Control](how-to-assign-roles.md) (RBAC) support                                           | All                     |
| [Virtual Network (VNet)](how-to-enable-virtual-network.md) support for compute                                         | All                     |
| Scoring endpoint authentication                                                    | All                     |
| [Workspace Private link](how-to-configure-private-link.md)                                                            | All                     |
| [Quota management](how-to-manage-quotas.md) across workspaces                                                 | Enterprise edition only |

## Next steps

Learn more about what's available in the Azure Machine Learning [edition overview & pricing page](https://azure.microsoft.com/pricing/details/machine-learning/). 

Learn how to [upgrade a Basic workspace to Enterprise edition](how-to-manage-workspace.md#upgrade). 