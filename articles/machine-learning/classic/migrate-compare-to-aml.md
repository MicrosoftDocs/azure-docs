---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - compare to AML'
description: describe how to migrate ML Studio classic projects to Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: zhanxia
ms.author: zhanixa
ms.date: 11/27/2020
---

# Compare Machine Learning Studio(classic) and Azure Machine Learning 

Azure Machine Learning Studio(classic) will retire on Feb 29, 2024. Before this date, customer will have access to their existing Machine Learning Studio(classic) assets. The experiments and web services can still run. But new resource (workspace, web service plan) creation will be stopped after May 31 2021. Free workspace creation will still be allow without SLA commitment.

Azure Machine Learning provides a modern machine learning platform with a fully managed experience. Customer should migrate their Studio(classic) projects to Azure Machine Learning before Feb 29,2024. We encourage customers to make the switch sooner to gain the richer benefit of the new platform.


This is an introductory guide of the difference of Machine Learning Studio(classic) and Azure Machine Learning.  


## Learn the difference of Machine Learning Studio(classic) and Azure Machine Learning

Released in 2015, Machine Learning Studio (classic) was Microsoft first drag-and-drop machine learning builder. It is a standalone service that only offers a visual experience with traditional machine learning algorithms. 

Azure Machine Learning is a separate and modernized service. It can be used for any kind of machine learning, from classical ml to deep learning, supervised, and unsupervised learning. Whether you prefer to write Python or R code with the SDK or work with no-code/low-code options in the studio, you can build, train, and track machine learning and deep-learning models in an Azure Machine Learning Workspace. It also interoperates with popular deep learning and reinforcement open-source tools such as PyTorch, TensorFlow, scikit-learn, and Ray RLlib.

Compare to Machine Learning Studio(classic), Azure Machine Learning provides following values adds:

- Scalable compute clusters for large-scale training.
- Enterprise security and governance.
- Open and interoperable with popular open-source tools.
- End-to-end MLOps capability.
 
### Feature comparison

The following table summarizes the key differences between ML Studio (classic) and Azure Machine Learning.

| Feature | ML Studio (classic) | Azure Machine Learning |
|---| --- | --- |
| Drag and drop interface | Classic experience | Updated experience - [Azure Machine Learning designer](../concept-designer.md)| 
| Code SDKs | Unsupported | Fully integrated with [Azure Machine Learning Python](/python/api/overview/azure/ml/) and [R](../tutorial-1st-r-experiment.md) SDKs |
| Experiment | Scalable (10-GB training data limit) | Scale with compute target |
| Training compute targets | Proprietary compute target, CPU support only | Wide range of customizable [training compute targets](../concept-compute-target.md#train). Includes GPU and CPU support | 
| Deployment compute targets | Proprietary web service format, not customizable | Wide range of customizable [deployment compute targets](../concept-compute-target.md#deploy). Includes GPU and CPU support |
| ML Pipeline | Not supported | Build flexible, modular [pipelines](../concept-ml-pipelines.md) to automate workflows |
| MLOps | Basic model management and deployment; CPU only deployments | Entity versioning (model, data, workflows), workflow automation, integration with CICD tooling, CPU, and GPU deployments [and more](../concept-model-management-and-deployment.md) |
| Model format | Proprietary format, Studio (classic) only | Multiple supported formats depending on training job type |
| Automated model training and hyperparameter tuning |  Not supported | [Supported](../concept-automated-ml.md). Code-first and no-code options. | 
| Data drift detection | Not supported | [Supported](../how-to-monitor-datasets.md) |
| Data labeling projects | Not supported | [Supported](../how-to-create-labeling-projects.md) |
|RBAC|Contributor and owner role supported|[Flexible role definition and RBAC control](../how-to-assign-roles.md)|



### Concept mapping

Many ML Studio(classic) concepts also exist in Azure Machine Learning, below table summarized the concept mapping of the two products.

|ML Studio(classic) concept|Corresponding concept in Azure Machine Learning|
|---| --- |
|Workspace|Workspace|
|Projects|NA|
|Experiment (the drag-n-drop graph)|Pipeline draft. <br/>           Experiment in Azure Machine Learning refers to a grouping of many runs|
|Run|Pipeline run|
|Web service - batch|Pipeline endpoint|
|Web service - real-time|Real-time endpoint|
|Web service plan|NA|
|Datasets|Datasets|
|Trained models|Models|
|Settings - user management|RBAC|
|Settings - data gateway|Not supported. It's recommended to move data from on-premises to cloud storage using [Azure data factory integration runtime](../../data-factory/create-self-hosted-integration-runtime.md).|
|AI gallery|NA|

Learn more about the Azure Machine Learning concepts and architecture in [this article](../concept-azure-machine-learning-architecture.md). 


[**to-do: is it necessary to add AML architecture overview here?** ]


## Migration path

Machine Learning Studio(classic) provides pure UI based tool to train and deploy model. Azure Machine Learning provides much richer tools for different skill levels customer. 

If your company already have the training code, it's suggested to rebuild the project using code first approach. Get started of Azure Machine Learning SDK and CLI with following tutorials.

- [Python get started](../tutorial-1st-experiment-sdk-setup-local.md)
- [Jupyter Notebooks tutorial](https://docs.microsoft.com/en-us/azure/machine-learning/tutorial-1st-experiment-sdk-setup.md)
- [Use automated machine learning in SDK](../tutorial-auto-train-models.md)
- [R SDK first experiment](../tutorial-1st-r-experiment.md)
- [Train and deploy with CLI](../tutorial-train-deploy-model-cli.md)

If you prefer to use the drag-n-drop experience similar to Studio(classic), it's suggested to rebuild the project with Azure Machine Learning designer. Check [migrate to designer](./migrate-to-designer.md) to learn how.
