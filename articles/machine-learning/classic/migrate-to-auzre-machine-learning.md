# Migrate to Azure Machine Learning 

Azure Machine Learning Studio(classic) will start retirement from Feb 2021, following by 3 years retirement period to leave customer time for migration . During the retirement period, customer will have access to their existing Machine Learning Studio(classic) workspace. The experiments and web services can still run. But new user sign-up or create new workspace will not be allowed.

 The Azure Machine Learning  is the new version of machine learning product in Azure, which delivers a complete data science platform for all skill levels. The migration from ML Studio(classic) to Azure Machine Learning will be be manual at this moment. There is plan to offer migration tool and we will further announce when it's ready. This document details the guidance on how to migrate from ML Studio(classic) to Azure Machine Learning.


## Prerequisite for migration

### Understand basics of Azure Machine Learning
To have a smooth migration from ML Studio(classic) to Azure Machine Learning, it's recommended to go through following contents to understand the basics of Azure Machine Learning. 

- [What is Azure Machine Learning](../overview-what-is-azure-ml.md)
- [What is Azure Machine Learning studio]((../overview-what-is-machine-learning-studio.md))


### Create Azure Machine Learning workspace

The workspace is the top-level resource for Azure Machine Learning, it provides a centralized place to work with all the artifacts you create in Azure Machine Learning.

Follow [this article](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-manage-workspace?tabs=azure-portal) to create Azure Machine Learning workspace. 


## Compare Machine Learning Studio(classic) and Azure Machine Learning.

 
Released in 2015, Machine Learning Studio (classic) was Microsoft first drag-and-drop machine learning builder. It is a standalone service that only offers a visual experience with traditional machine learning algorithms. 

Azure Machine Learning is a separate and modernized service.It can be used for any kind of machine learning, from classical ml to deep learning, supervised, and unsupervised learning. Whether you prefer to write Python or R code with the SDK or work with no-code/low-code options in the studio, you can build, train, and track machine learning and deep-learning models in an Azure Machine Learning Workspace.

The service also interoperates with popular deep learning and reinforcement open-source tools such as PyTorch, TensorFlow, scikit-learn, and Ray RLlib.

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
| MLOps | Basic model management and deployment; CPU only deployments | Entity versioning (model, data, workflows), workflow automation, integration with CICD tooling, CPU and GPU deployments [and more](../concept-model-management-and-deployment.md) |
| Model format | Proprietary format, Studio (classic) only | Multiple supported formats depending on training job type |
| Automated model training and hyperparameter tuning |  Not supported | [Supported](../concept-automated-ml.md). Code-first and no-code options. | 
| Data drift detection | Not supported | [Supported](../how-to-monitor-datasets.md) |
| Data labeling projects | Not supported | [Supported](../how-to-create-labeling-projects.md) |
|RBAC|Contributor and owner role supported|[Flexible role definition and RBAC control](../how-to-assign-roles.md)|

### Concept mapping

Many ML Studio(classic) concepts also exists in Azure Machine Learning, below table summarized the concept mapping of the two products.

|ML Studio(classic) concept|Corresponding concept in Azure Machine Learning|
|---| --- | --- |
|Workspace|Workspace|
|Projects|NA|
|Experiment (the drag-n-drop graph)|Pipeline draft. <br/>           Experiment in AML refers to a grouping of many runs|
|Run|Pipeline run|
|Web service - batch|Pipeline endpoint|
|Web service - realtime|Realtime endpoint|
|Web service plan|NA|
|Datasets|Datasets|
|Trained models|Models|
|Settings - user management|RBAC|
|Settings - data gateway|It's recommended to move data from on-premises to cloud storage using [Azure data factory integration runtime](https://docs.microsoft.com/en-us/azure/data-factory/create-self-hosted-integration-runtime). |
|AI gallery|NA|

Learn more about the Azure Machine Learning concepts in [this article](../concept-azure-machine-learning-architecture.md). 



## Suggested migration path

Compared to ML Studio(classic), Azure Machine Learning offers much richer capabilities for multiple skill level of customers.
There are Python/R SDK and CLI offerings for customers who are more comfortable to write code. There is also Azure Machine Learning designer - the very similar visual interface as ML Studio(classic) to train and deploy in a low code fashion. 

Below table summarize the suggested migration path based on customer profile and ML Studio(classic) usage pattern.

|ML Studio(classic) use pattern|Low code/node code|Code first|
|---| --- | --- |
|Experiment only| - [Manually migrate the graph to Azure Machine Learning designer]() </br> - Graph migration tool ETA| Rebuild using notebooks. Notebook tutorial.|
|Inference only| - Manually deploy in designer after run the experiment(link to doc) </br> - Batch inference migration tool ETA </br> - Real-time web service migration tool ETA| SDK deployment tutorial|
|Retrain and update web service automatically| NA|MLOps tutorial|
|Both experiment and web service|- experiment migration guide </br> - web service deploy guide|- training tutorial</br> - deployment tutorial|
