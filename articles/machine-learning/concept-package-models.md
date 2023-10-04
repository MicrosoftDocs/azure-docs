---
title: Model packages for deployment (preview)
titleSuffix: Azure Machine Learning
description:  Deploy models in a reliable and reproducible way using model packages in Azure Machine Learning.
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
reviewer: msakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 10/04/2023
ms.topic: how-to
---

# Model packages for deployment (preview)

After you train a machine learning model, you need to deploy it so others can consume their predictions. However, deploying a model requires more than just the weights or the model's artifacts. Model packages are a capability in Azure Machine Learning that allows you to collect all the dependencies required to deploy a machine learning model to a serving platform. Packages can be moved across workspaces and even outside of Azure Machine Learning.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## What's a model package?

As a best practice before deploying a model, all the dependencies the model requires for running successful have to be collected and resolved so you can deploy it in a reproducible and robust approach.

:::image type="content" source="media/model-packaging/model-package-dependencies.png" alt-text="Screenshot that shows the dependencies that are collected by a model package operation." :::

Typically, model's dependencies include:

* The base image or environment where your model executes on.
* The list of packages and dependencies that the model depends on to function properly.
* Extra assets that your model may need to generate inference. Those can be label's maps, preprocessing parameters, etc.
* The software required for the inference server to serve the requests (like the flask server, TensorFlow Serving, etc.).
* The inference routine (if required).

All these elements need to be collected to then be deployed in the serving infrastructure. The resulting asset generated after all the dependencies are collected is called a **model package**.


## Benefits of packaging models

Packaging models before deployment has the following advantages:

* **Reproducibility:**: All dependencies are collected at packaging time, rather than at deployment time. Once dependencies are resolved, you can deploy the package as many times as needed while guaranteeing that dependencies were resolved once.
* **Faster conflict resolution:** Any misconfiguration related with the dependencies, like a missing Python package, will be detected while packaging the model. You don't need to deploy the model to discover such issue.
* **Easier integration with the inference server:** Because the inference server you're using may need specific software configurations (for instance, Torch Serve package), such software can generate conflicts with your model's dependencies. Azure Machine Learning packages inject the dependencies required by the inference server to help you detect conflicts before deploying the model.
* **Portability:** Azure Machine Learning model packages can be moved from one workspace to another using registries. You can also generate packages that can be deployed outside of Azure Machine Learning.
* **MLflow support with private networks**: MLflow models require an internet connection to allow the resolution of the packages they need to run. By packaging MLflow models, all those packages are resolved during the package operation and hence they don't require an internet connection when deployed.

## Deploying with packages

Packages can be used directly as inputs to Online Endpoints. This helps streamline your MLOps workflows by reducing the changes of errors at deployment time since dependencies are all collected at once at packaging. You can also configure the package to generate docker images you can deploy anywhere outside of Azure Machine Learning, either on premise or in the cloud.

:::image type="content" source="media/model-packaging/model-package-targets.png" alt-text="Screenshot that shows all the possible targets for a model package.":::

The simplest way to deploy models with packages is by indicating Azure Machine Learning to do so before executing the deployment. When creating a deployment in an Online Endpoints, just indicate to prepackage the model. This is supported in the Azure CLI, Azure Machine Learning SDK, and Azure Machine Learning studio.

# [Azure CLI](#tab/cli)

Use flag `--with-package` when creating a deployment:

```azurecli
az ml online-deployment create  -f deployment.yml --package-model
```

# [Python](#tab/sdk)

Use the argument `--with_package=True` when creating a deployment:

```python
ml_client.batch_deployment.create(
    ManagedOnlineDeployment(
        name="default",
        endpoint_name=endpoint_name,
        model=model,
        instance_count=1,
        package_model=True,
    )
).result()
```

# [Studio](#tab/studio)

In the model detail page in [Azure Machine Learning studio](https://ml.azure.com), select the option **Deploy** and then click on **Online Endpoints**. In the creation wizard, you see an option **Package Model (preview)** to package the model before deployment.

:::image type="content" source="./media/model-packaging/model-package-ux.png" alt-text="An screenshot of the model deployment wizard to Online Endpoints highlighting the Package model option.":::

---

Azure Machine Learning packages the model first and then execute the deployment. Notice that when using packages, if you indicate a base environment with conda or pip dependencies, you don't need to include the dependencies of the inference server (`azureml-inference-server-http`). It's automatically added for you.

> [!TIP] 
> Packaging MLflow models before deployment is highly advisable and required for endpoints without outbound networking connectivity. MLflow models indicate their dependencies in the model itself, which requires dynamic installation of packages. When an MLflow model is packaged, this dynamic installation is performed at packaging time, avoiding the installation of software at deployment time.

## Next steps

> [!div class="nextstepaction"]
> [Create your first model package](how-to-package-models.md)