---
author: peterclu
ms.service: machine-learning
ms.topic: include
ms.date: 03/08/2021
ms.author: peterlu
---

The following table summarizes the key differences between ML Studio (classic) and Azure Machine Learning.

| Feature | ML Studio (classic) | Azure Machine Learning |
|---| --- | --- |
| Drag and drop interface | Classic experience | Updated experience - [Azure Machine Learning designer](../concept-designer.md)| 
| Code SDKs | Not supported | Fully integrated with [Azure Machine Learning Python](/python/api/overview/azure/ml/) and [R](https://github.com/Azure/azureml-sdk-for-r) SDKs |
| Experiment | Scalable (10-GB training data limit) | Scale with compute target |
| Training compute targets | Proprietary compute target, CPU support only | Wide range of customizable [training compute targets](../concept-compute-target.md#training-compute-targets). Includes GPU and CPU support | 
| Deployment compute targets | Proprietary web service format, not customizable | Wide range of customizable [deployment compute targets](../concept-compute-target.md#compute-targets-for-inference). Includes GPU and CPU support |
| ML Pipeline | Not supported | Build flexible, modular [pipelines](../concept-ml-pipelines.md) to automate workflows |
| MLOps | Basic model management and deployment; CPU only deployments | Entity versioning (model, data, workflows), workflow automation, integration with CICD tooling, CPU and GPU deployments [and more](../concept-model-management-and-deployment.md) |
| Model format | Proprietary format, Studio (classic) only | Multiple supported formats depending on training job type |
| Automated model training and hyperparameter tuning |  Not supported | [Supported](../concept-automated-ml.md). Code-first and no-code options. | 
| Data drift detection | Not supported | [Supported](../v1/how-to-monitor-datasets.md) |
| Data labeling projects | Not supported | [Supported](../how-to-create-image-labeling-projects.md) |
| Role-Based Access Control (RBAC) | Only contributor and owner role | [Flexible role definition and RBAC control](../how-to-assign-roles.md) |
| AI Gallery | Supported ([https://gallery.azure.ai/](https://gallery.azure.ai/)) | Unsupported <br><br> Learn with [sample Python SDK notebooks](https://github.com/Azure/MachineLearningNotebooks). |