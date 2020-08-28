---
title: How to deploy models from the designer
titleSuffix: Azure Machine Learning
description: 'Use Azure Machine Learning studio to deploy models trained in the designer.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: keli19
author: likebupt
ms.reviewer: peterlu
ms.date: 08/24/2020
ms.topic: conceptual
ms.custom: how-to
---

# Deploy trained models from the designer
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you will learn how to deploy a trained model from the designer as a real-time endpoint in the Azure Machine Learning studio.

The workflow consists of the following steps:

1. Register the trained model in the completed pipeline run.
1. Download entry script file and conda dependencies file for the trained model.
1. Deploy the model to a compute target.

For more information on the concepts involved in the deployment workflow, see [Manage, deploy, and monitor models with Azure Machine Learning](concept-model-management-and-deployment.md).

Models trained  in the designer can also be deployed through the SDK or CLI, see [Deploy your existing model with Azure Machine Learning](how-to-deploy-existing-model.md)

## Prerequisites

* [An Azure Machine Learning workspace](how-to-manage-workspace.md)

* A completed training pipeline containing a [Train Model module](./algorithm-module-reference/train-model.md)

## Register your model

After the training pipeline completes:

1. Select the [Train Model module](./algorithm-module-reference/train-model.md).
1. Select the **Outputs + logs** tab in the right pane.
1. Select the **Register Model** icon ![Screenshot of the gear icon](./media/how-to-deploy-model-designer/register-model-icon.png).

    ![Screenshot of right pane of Train Model module](./media/how-to-deploy-model-designer/train-model-right-pane.png)

1. Enter a name for your model in the pop-up window, and select **Save**.

    ![Screenshot of register trained model](./media/how-to-deploy-model-designer/register-trained-model.png)

After registering your model, you can find it in the **Models** asset page.
    
![Screenshot of register model in Models asset page](./media/how-to-deploy-model-designer/models-asset-page.png)


## Download entry script file and conda dependencies file

You need the following files to deploy a model in Azure Machine Learning studio:

- An **entry script file** - loads trained model, processes input data from requests, does real-time inferences and returns the result. In designer, a `score.py` file will be automatically generated when the **Train Model** module is completed.

- A **conda dependencies file** - specifies which pip and conda packages your webservice depends on. In designer, a `conda_env.yaml` file will be automatically generated when the **Train Model** module is completed.

You can download these two files in the right pane of the **Train Model** module:

1. Select the **Train Model** module.
1. In the **Outputs + logs** tab, select the folder `trained_model_outputs`.
1. Download the `conda_env.yaml` file and `score.py` file.

    ![Screenshot of download files for deployment in right pane](./media/how-to-deploy-model-designer/download-artifacts-in-right-pane.png)

Alternatively, you can download the files from the **Models** asset page:

1. Navigate to the **Models** asset page.
1. Select the model you want to deploy.
1. Select the **Artifacts** tab.
1. Select the `trained_model_outputs` folder.
1. Download the `conda_env.yaml` file and `score.py` file.  

    ![Screenshot of download files for deployment in model detail page](./media/how-to-deploy-model-designer/download-artifacts-in-models-page.png)

## Deploy your model

You're now ready to deploy your model.

1. In the **Models** asset page, select the registered model.
1. Select the **Deploy** button.
1. In the configuration menu, enter the following information:

    - Input the name of the endpoint.
    - Select to deploy the model to [Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md) or [Azure Container Instance](how-to-deploy-azure-container-instance.md).
    - Upload the `score.py` for the **Entry script file**, and `conda_env.yml` for the **Conda dependencies file**. 
    - (Optional) In **Advanced** setting, you can set CPU/Memory reserve capacity and other parameters for deployment. These settings are important for certain models such as         PyTorch models, which consum considerable amount of momery (about 4 GB).

1. Select **Deploy** to deploy your model as a real-time endpoint.

    ![Screenshot of deploy model in model asset page](./media/how-to-deploy-model-designer/deploy-model.png)

## Consume the real-time endpoint

After deployment succeeds, you can find the real-time endpoint in the **Endpoints** asset page. Once there, you will find a REST endpoint, which clients can use to submit requests to the real-time endpoint. 

> [!NOTE]
> The designer also generates sample data json file for consuming, you can download `_samples.json` in the **trained_model_outputs** folder. 
> `_samples.json` is good reference for consuming, especially when input data contains too many columns.

Following is sample code to consume the real-time endpoint.

```python

import json
from pathlib import Path
from azureml.core.workspace import Workspace, Webservice
 
service_name = 'YOUR_SERVICE_NAME'
ws = Workspace.get(
    name='WORKSPACE_NAME',
    subscription_id='SUBSCRIPTION_ID',
    resource_group='RESOURCEGROUP_NAME'
)
service = Webservice(ws, service_name)
sample_file_path = '_samples.json'
 
with open(sample_file_path, 'r') as f:
    sample_data = json.load(f)
score_result = service.run(json.dumps(sample_data))
print(f'Inference result = {score_result}')
```

## Next steps

* [Train a model in the designer](tutorial-designer-automobile-price-train-score.md)
* [Troubleshoot a failed deployment](how-to-troubleshoot-deployment.md)
* [Deploy to Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md)
* [Create client applications to consume web services](how-to-consume-web-service.md)
* [Update web service](how-to-deploy-update-web-service.md)
