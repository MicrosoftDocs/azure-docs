---
author: gvashishtha
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: include
ms.date: 04/21/2021
ms.author: gopalv
---

# [Azure CLI](#tab/azcli)

Replace `bidaf_onnx:1` with the name of your model and its version number.

<!-- ```azurecli-interactive
az ml model deploy -n myservice -m bidaf_onnx:1 --ic inferenceconfig.json --dc deploymentconfig.json
az ml service get-logs -n myservice
``` -->

:::code language="azurecli-interactive" source="~/azureml-examples-main/tutorials/deploy-local/1.deploy-local.ipynb?name=deploy-model-code":::

# [Python](#tab/python)
<!-- 
```python

service = Model.deploy(ws, "myservice", [model], inference_config, deployment_config)
service.wait_for_deployment(show_output=True)
print(service.get_logs())
``` -->

[!notebook-python[] (~/azureml-examples-main/tutorials/deploy-local/1.deploy-local.ipynb?name=re-deploy-model-code)]

[!notebook-python[] (~/azureml-examples-main/tutorials/deploy-local/1.deploy-local.ipynb?name=re-deploy-model-print-logs)]

For more information, see the documentation for [Model.deploy()](/python/api/azureml-core/azureml.core.model.model#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) and [Webservice](/python/api/azureml-core/azureml.core.webservice.webservice).

---
