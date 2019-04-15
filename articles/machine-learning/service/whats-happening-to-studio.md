
# Visual interface for Azure Machine Learning service

The visual interface for Azure Machine Learning service allows you to build a visual flow of data without writing code.  It simplifies the process of creating machine learning models. The capabilities are similar to what we have in our popular Azure Machine Learning Studio offering.

## What is the difference between the Azure Machine Learning Studio and the visual interface for Azure Machine Learning service?

The key difference between the Azure Machine Learning Studio and the new visual interface for Azure Machine Learning service is the open and scalable platform.  

Azure Machine Learning Studio uses its proprietary platform for managing experiments, VMs, web services, and models. It has limitation on scale, model management, security, and modern hardware support. 

The new visual interface capability fully integrates with Azure Machine Learning service. it features

* autoscaled CPU and GPU clusters
* enterprise ready security
* model management

Here is a quick comparison:

---
  |Features   |Azure Machine Learning Studio |                         Visual interface  for Azure Machine Learning service (preview)|
|--------------------|---------------------|-------------------|
| Drag-n-drop interface|Yes|Yes|
|Installation/Setup free|Yes|Yes|
|Training|  <ul><li>Proprietary compute target</li> <li>Scale (<10-GB training data size) </li> <li> CPU support only</li></ul>|<ul><li>Bring your own compute</li> <li>Scale with compute target size </li> <li> Support CPU and GPU</li></ul>|
|Inferencing (Web service)|Proprietary, not customizable|<ul><li>Bring your own compute.</li> <li>Scale with inference target size </li> <li>   Support Azure Kubernetes Service</li></ul>|
|Data Input & Outputs*|8 types of data stores|3 types of data stores|
|built-in modules **|<ul><li>Data Preparation</li> <li>Data Transformation </li> <li> Classification</li><li> Regression</li><li> Clustering</li><li> Text Analysis</li><li> Anomaly Detection</li></ul> |                                             <ul><li>Data Preparation</li> <li>Data Transformation </li> <li> Classification</li><li> Regression</li><li> Other modules*\*</li></ul>|            
|Custom Modules|<ul><li>Execute Python Script</li> <li>Execute R Script </li> <li>Create R models </li></ul> | <ul><li>Execute Python Script</li> </ul>|
|Model Management| <ul><li>Proprietary</li> <li>Model can’t be used outside  </li> <li>Azure Machine Learning Studio </li></ul>|  <ul><li>Same as any model in Azure </li> <li>Machine Learning Service. </li></ul>|
|RBAC|Contributor and owner only|Azure Standard|
|Notebook|<ul><li>Python notebook</li><li>R Notebook</li></ul>|Replaced with AML notebook|
|Collaboration|   Yes. Any liveID can collaborate| Yes, Requires proper permission|

\* Full list can be found in [Algorithm & module reference overview](../algorithm-module-reference/module-reference.md)

\*\* More popular built-in modules in AML Studio will be added continuously


## Is there any way to migrate my Azure Machine Learning Studio experiment and webservice?

The experiments can be migrated. We plan to offer migration tool to help AML studio user to migrate their experiment to the visual interface for AML service. The AML studio trained model and web service managed by AML studio will not able to migrate. User need retrain their migrated experiment and redeploy to the AML service.

## How much does it cost?

For public preview, there will be no extra cost for using the visual interface. You still pay for compute and  inferencing as they are doing in the Azure Machine Learning service. The future pricing model will be disclosed when it’s ready.

## Will the new visual interface for Azure Machine Learning service built-in modules have full parity as Azure Machine Learning Studio?

The visual interface for Azure Machine Learning service starts with the best and popular built-in modules. Additional modules will be over time. Expanding from what Studio has, there will be new modules added such as deep learning. Meanwhile, for modules that are rarely used in Studio, will not show up in the new visual interface for Azure Machine Learning service.

## Does it support model versioning?

The model versioning inherits from Azure Machine Learning service. Each time you train a model using the visual interface, it shows up a new version of the model in the AML service.

## Can I use Automated machine learning in the visual interface for Azure Machine Learning service?

For public preview, the Automated machine learning is not available.

## Does this support deep learning models?

There is no built-in module support deep learning in the public preview. But you can use the **Execute Python Script** module to run deep learning code.