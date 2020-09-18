---
title: Parity between public and sovereign regions
titleSuffix: Azure Machine Learning
description: Some features of Azure Machine Learning, such as public preview features, may only be available in public cloud regions. This article lists what features are also available in the Azure Government, Azure Germany, and Azure China 21Vianet regions.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

ms.reviewer: larryfr
ms.author: andzha
author: Anurzeuii
ms.date: 08/24/2020
ms.custom: references_regions
---

# Azure Machine Learning sovereign cloud parity

Learn what Azure Machine Learning features are available in sovereign cloud regions. 

In the list of global Azure regions, there are several 'sovereign' regions that serve specific markets. For example, the Azure Government and the Azure China 21Vianet regions. Currently Azure Machine Learning is deployed into the following sovereign cloud regions:

* Azure Government regions **US-Arizona** and **US-Virginia**.
* Azure China 21Vianet region **China-East-2**.

> [!TIP]
> To differentiate between sovereign and non-sovereign regions, this article will use the term __public cloud__ to refer to non-sovereign regions.

We aim to provide maximum parity between our public cloud and sovereign regions. All Azure Machine Learning features will be available in these regions within **30 days of GA** (general availability) in our public cloud. We also enable a select number of preview features in these regions. Below display the current parity differences between our sovereign and public clouds.

## Azure Government	

| Feature | Public cloud status  | US-Virginia | US-Arizona| 
|----------------------------------------------------------------------------|:----------------------:|:--------------------:|:-------------:|
| **Automated machine learning** | | | |
| Create and run experiments in notebooks                                    | GA                   | YES                | YES         |
| Create and run experiments in studio web experience                        | Public Preview       | YES                | YES         |
| Industry-leading forecasting capabilities                                  | GA                   | YES                | YES         |
| Support for deep learning and other advanced learners                      | GA                   | YES                | YES         |
| Large data support (up to 100 GB)                                          | Public Preview       | YES                | YES         |
| Azure Databricks integration                                              | GA                   | NO                 | NO          |
| SQL, CosmosDB, and HDInsight integrations                                   | GA                   | YES                | YES         |
| **Machine Learning pipelines** |   |  | | 
| Create, run, and publish pipelines using the Azure ML SDK                   | GA                   | YES                | YES         |
| Create pipeline endpoints using the Azure ML SDK                           | GA                   | YES                | YES         |
| Create, edit, and delete scheduled runs of pipelines using the Azure ML SDK | GA                   | YES*               | YES*        |
| View pipeline run details in studio                                        | GA                   | YES                | YES         |
| Create, run, visualize, and publish pipelines in Azure ML designer          | Public Preview       | YES                | YES         |
| Azure Databricks Integration with ML Pipeline                             | GA                   | NO                 | NO          |
| Create pipeline endpoints in Azure ML designer                             | Public Preview       | YES                | YES         |
| **Integrated notebooks** |   |  | | 
| Workspace notebook and file sharing                                        | GA                   | YES                | YES         |
| R and Python support                                                       | GA                   | YES                | YES         |
| Virtual Network support                                                    | Public Preview       | NO                 | NO          |
| **Compute instance** |   |  | | 
| Managed compute Instances for integrated Notebooks                         | GA                   | YES                | YES         |
| Jupyter, JupyterLab Integration                                            | GA                   | YES                | YES         |
| Virtual Network (VNet) support                                             | Public Preview       | YES                | YES         |
| **SDK support** |  |  | | 
| R SDK support                                                              | Public Preview       | YES                | YES         |
| Python SDK support                                                         | GA                   | YES                | YES         |
| **Security** |   | | | 
| Virtual Network (VNet) support for training                                | GA                   | YES                | YES         |
| Virtual Network (VNet) support for inference                               | GA                   | YES                | YES         |
| Scoring endpoint authentication                                            | Public Preview       | YES                | YES         |
| Workplace Private link                                                     | Public Preview       | NO                 | NO          |
| ACI behind VNet                                                            | Public Preview       | NO                 | NO          |
| ACR behind VNet                                                            | Public Preview       | NO                 | NO          |
| Private IP of AKS cluster                                                  | Public Preview       | NO                 | NO          |
| **Compute** |   | | |
| quota management across workspaces                                         | GA                   | YES                | YES         |
| **Data for machine learning** |   | | |
| Create, view, or edit datasets and datastores from the SDK                  | GA                   | YES                | YES         |
| Create, view, or edit datasets and datastores from the UI                   | GA                   | YES                | YES         |
| View, edit, or delete dataset drift monitors from the SDK                   | Public Preview       | YES                | YES         |
| View, edit, or delete dataset drift monitors from the UI                    | Public Preview       | YES                | YES         |
| **Machine learning lifecycle** |   | | |
| Model profiling                                                            | GA                   | YES                | PARTIAL     |
| The Azure DevOps extension for Machine Learning & the Azure ML CLI         | GA                   | YES                | YES         |
| FPGA-based Hardware Accelerated Models                                     | GA                   | NO                 | NO          |
| Visual Studio Code integration                                             | Public Preview       | NO                 | NO          |
| Event Grid integration                                                     | Public Preview       | NO                 | NO          |
| Integrate Azure Stream Analytics with Azure Machine Learning               | Public Preview       | NO                 | NO          |
| **Labeling** |   | | |
| Labeling Project Management Portal                                        | GA                   | YES                | YES         |
| Labeler Portal                                                            | GA                   | YES                | YES         |
| Labeling using private workforce                                          | GA                   | YES                | YES         |
| ML assisted labeling (Image classification and object detection)           | Public Preview       | YES                | YES         |
| **Responsible ML** |   | | |
| Explainability in UI                                                       | Public Preview       | NO                 | NO          |
| Differential privacy WhiteNoise toolkit                                    | OSS                  | NO                 | NO          |
| custom tags in Azure Machine Learning to implement datasheets              | GA                   | NO                 | NO          |
| Fairness AzureML Integration                                               | Public Preview       | NO                 | NO          |
| Interpretability  SDK                                                      | GA                   | YES                | YES         |
| **Training** |   | | |
| Experimentation log streaming                                              | GA                   | YES                | YES         |
| Reinforcement Learning                                                     | Public Preview       | NO                 | NO          |
| Experimentation UI                                                         | GA                   | YES                | YES         |
| .NET integration ML.NET 1.0                                                | GA                   | YES                | YES         |
| **Inference** |   | | |
| Batch inferencing                                                          | GA                   | YES                | YES         |
| Data Box Edge with FPGA                                                    | Public Preview       | NO                 | NO          |
| **Other** |   | | |
| Open Datasets                                                              | Public Preview       | YES                | YES         |
| Custom Cognitive Search                                                    | Public Preview       | YES                | YES         |
| Many Models                                                                | Public Preview       | NO                 | NO          |


### Azure Government scenarios

| Scenario                                                    | US-Virginia | US-Arizona| Limitations  |
|----------------------------------------------------------------------------|:----------------------:|:--------------------:|-------------|
| **General security setup** |   | | |
| Private network communication between services                                     | NO | NO | No Private Link currently | 
| Disable/control internet access (inbound and outbound) and specific VNet | PARTIAL| PARTIAL	| ACR behind VNet is not available in Azure Government - double checking on ACI | 
| Placement for all associated resources/services  | YES | YES |  |
| Encryption at-rest and in-transit.                                                 | YES | YES |  |
| Root and SSH access to compute resources.                                          | YES | YES |  |
| Maintain the security of deployed systems (instances, endpoints, etc.), including endpoint protection, patching, and logging |  PARTIAL|	PARTIAL	|ACI behind VNet and private endpoint currently not available |                                  
| Control (disable/limit/restrict) the use of ACI/AKS integration                    | PARTIAL|	PARTIAL	|ACI behind VNet and private endpoint currently not available|
| Role-Based Access Control (RBAC) - Custom Role Creations                           | YES | YES |  |
| Control access to ACR images used by ML Service (Azure provided/maintained versus custom)  |PARTIAL|	PARTIAL	| ACR behind private endpoint and VNet not supported in Azure Government |
| **General Machine Learning Service Usage** |  | | |
| Ability to have a development environment to build a model, train that model, host it as an endpoint, and consume it via a webapp     | YES | YES |  |
| Ability to pull data from ADLS (Data Lake Storage)                                 |YES | YES |  |
| Ability to pull data from Azure Blob Storage                                       |YES | YES |  |



### Additional Azure Government limitations

* For Azure Machine Learning compute instances, the ability to refresh a token lasting more than 24 hours is not available in Azure Government.
* Model Profiling does not support 4 CPUs in the US-Arizona region.   
* Sample notebooks may not work in Azure Government if it needs access to public data.
* IP addresses: The CLI command used in the [VNet and forced tunneling](how-to-secure-training-vnet.md#forced-tunneling) instructions does not return IP ranges. Use the [Azure IP ranges and service tags for Azure Government](https://www.microsoft.com/download/details.aspx?id=57063) instead.
* For scheduled pipelines, we also provide a blob-based trigger mechanism. This mechanism is not supported for CMK workspaces. For enabling a blob-based trigger for CMK workspaces, you have to do additional setup. For more information, see [Trigger a run of a machine learning pipeline from a Logic App](how-to-trigger-published-pipeline.md).
* Firewalls: When using an Azure Government region, add the following additional hosts to your firewall setting:

    * For Arizona use: `usgovarizona.api.ml.azure.us`
    * For Virginia use: `usgovvirginia.api.ml.azure.us`
    * For both: `graph.windows.net` 


## Azure China 21Vianet	

| Feature                                       | Public cloud status | CH-East-2 | CH-North-3 |
|----------------------------------------------------------------------------|:------------------:|:--------------------:|:-------------:|
| **Automated machine learning** |    | | |
| Create and run experiments in notebooks                                    | GA               | YES       | N/A        |
| Create and run experiments in studio web experience                        | Public Preview   | YES       | N/A        |
| Industry-leading forecasting capabilities                                  | GA               | YES       | N/A        |
| Support for deep learning and other advanced learners                      | GA               | YES       | N/A        |
| Large data support (up to 100 GB)                                          | Public Preview   | YES       | N/A        |
| Azure Databricks Integration                                              | GA               | NO        | N/A        |
| SQL, CosmosDB, and HDInsight integrations                                   | GA               | YES       | N/A        |
| **Machine Learning pipelines** |    | | |
| Create, run, and publish pipelines using the Azure ML SDK                   | GA               | YES       | N/A        |
| Create pipeline endpoints using the Azure ML SDK                           | GA               | YES       | N/A        |
| Create, edit, and delete scheduled runs of pipelines using the Azure ML SDK | GA               | YES       | N/A        |
| View pipeline run details in studio                                        | GA               | YES       | N/A        |
| Create, run, visualize, and publish pipelines in Azure ML designer          | Public Preview   | YES       | N/A        |
| Azure Databricks Integration with ML Pipeline                             | GA               | NO        | N/A        |
| Create pipeline endpoints in Azure ML designer                             | Public Preview   | YES       | N/A        |
| **Integrated notebooks** |   | | |
| Workspace notebook and file sharing                                        | GA               | YES       | N/A        |
| R and Python support                                                       | GA               | YES       | N/A        |
| Virtual Network support                                                    | Public Preview   | NO        | N/A        |
| **Compute instance** |    | | |
| Managed compute Instances for integrated Notebooks                         | GA               | NO        | N/A        |
| Jupyter, JupyterLab Integration                                            | GA               | YES       | N/A        |
| Virtual Network (VNet) support                                             | Public Preview   | YES       | N/A        |
| **SDK support** |    | | |
| R SDK support                                                              | Public Preview   | YES       | N/A        |
| Python SDK support                                                         | GA               | YES       | N/A        |
| **Security** |   | | |
| Virtual Network (VNet) support for training                                | GA               | YES       | N/A        |
| Virtual Network (VNet) support for inference                               | GA               | YES       | N/A        |
| Scoring endpoint authentication                                            | Public Preview   | YES       | N/A        |
| Workplace Private link                                                     | Public Preview   | NO        | N/A        |
| ACI behind VNet                                                            | Public Preview   | NO        | N/A        |
| ACR behind VNet                                                            | Public Preview   | NO        | N/A        |
| Private IP of AKS cluster                                                  | Public Preview   | NO        | N/A        |
| **Compute** |   | | |
| quota management across workspaces                                         | GA               | YES       | N/A        |
| **Data for machine learning** | | | |
| Create, view, or edit datasets and datastores from the SDK                  | GA               | YES       | N/A        |
| Create, view, or edit datasets and datastores from the UI                   | GA               | YES       | N/A        |
| View, edit, or delete dataset drift monitors from the SDK                   | Public Preview   | YES       | N/A        |
| View, edit, or delete dataset drift monitors from the UI                    | Public Preview   | YES       | N/A        |
| **Machine learning lifecycle** |    | | |
| Model profiling                                                            | GA               | PARTIAL   | N/A        |
| The Azure DevOps extension for Machine Learning & the Azure ML CLI         | GA               | YES       | N/A        |
| FPGA-based Hardware Accelerated Models                                     | GA               | NO        | N/A        |
| Visual Studio Code integration                                             | Public Preview   | NO        | N/A        |
| Event Grid integration                                                     | Public Preview   | YES       | N/A        |
| Integrate Azure Stream Analytics with Azure Machine Learning               | Public Preview   | NO        | N/A        |
| **Labeling** |    | | |
| Labeling Project Management Portal                                        | GA               | YES       | N/A        |
| Labeler Portal                                                            | GA               | YES       | N/A        |
| Labeling using private workforce                                          | GA               | YES       | N/A        |
| ML assisted labeling (Image classification and object detection)           | Public Preview   | YES       | N/A        |
| **Responsible ML** |    | | |
| Explainability in UI                                                       | Public Preview   | NO        | N/A        |
| Differential privacy WhiteNoise toolkit                                    | OSS              | NO        | N/A        |
| custom tags in Azure Machine Learning to implement datasheets              | GA               | NO        | N/A        |
| Fairness AzureML Integration                                               | Public Preview   | NO        | N/A        |
| Interpretability  SDK                                                      | GA               | YES       | N/A        |
| **Training** |    | | |
| Experimentation log streaming                                              | GA               | YES       | N/A        |
| Reinforcement Learning                                                     | Public Preview   | NO        | N/A        |
| Experimentation UI                                                         | GA               | YES       | N/A        |
| .NET integration ML.NET 1.0                                                | GA               | YES       | N/A        |
| **Inference** |   | | |
| Batch inferencing                                                          | GA               | YES       | N/A        |
| Data Box Edge with FPGA                                                    | Public Preview   | NO        | N/A        |
| **Other** |    | | |
| Open Datasets                                                              | Public Preview   | YES       | N/A        |
| Custom Cognitive Search                                                    | Public Preview   | YES       | N/A        |
| Many Models                                                                | Public Preview   | NO        | N/A        |



### Additional Azure China limitations

* Azure China has limited VM SKU, especially for GPU SKU. It only has NCv3 family (V100).
* REST API Endpoints are different from global Azure. Use the following table to find the REST API endpoint for Azure China regions:

    | REST endpoint                 | Global Azure                                 | China-Government                           |
    |------------------|--------------------------------------------|--------------------------------------------|
    | Management plane | `https://management.azure.com/`              | `https://management.chinacloudapi.cn/`       |
    | Data plane       | `https://{location}.experiments.azureml.net` | `https://{location}.experiments.ml.azure.cn` |
    | Azure Active Directory              | `https://login.microsoftonline.com`          | `https://login.chinacloudapi.cn`             |

* Sample notebook may not work, if it needs access to public data.
* IP address ranges: The CLI command used in the [VNet forced tunneling](how-to-secure-training-vnet.md#forced-tunneling) instructions does not return IP ranges. Use the [Azure IP ranges and service tags for Azure China](https://www.microsoft.com//download/details.aspx?id=57062) instead.
* Azure Machine Learning compute instances preview is not supported in a workspace where Private Link is enabled for now, but CI will be supported in the next deployment for the service expansion to all AML regions.

## Next steps

To learn more about the regions that Azure Machine learning is available in, see [Products by region](https://azure.microsoft.com/global-infrastructure/services/).
