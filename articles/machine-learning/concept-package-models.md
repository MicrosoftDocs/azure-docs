---
title: Model packages for deployment (preview)
titleSuffix: Azure Machine Learning
description:  Learn how the use of model packages in Azure Machine Learning is useful for deploying models in a reliable and reproducible way.
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
reviewer: msakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 10/04/2023
ms.topic: concept-article
---

# Model packages for deployment (preview)

After you train a machine learning model, you need to deploy it so others can consume its predictions. However, deploying a model requires more than just the weights or the model's artifacts. Model packages are a capability in Azure Machine Learning that allows you to collect all the dependencies required to deploy a machine learning model to a serving platform. You can move packages across workspaces and even outside Azure Machine Learning.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## What is a model package?

As a best practice before deploying a model, all the dependencies the model requires for running successfully have to be collected and resolved so you can deploy the model in a reproducible and robust approach.

:::image type="content" source="media/model-packaging/model-package-dependencies.png" alt-text="Screenshot that shows the dependencies collected during a model package operation." :::

Typically, a model's dependencies include:

* Base image or environment in which your model gets executed.
* List of Python packages and dependencies that the model depends on to function properly.
* Extra assets that your model may need to generate inference. These assets can include label's maps and preprocessing parameters.
* Software required for the inference server to serve requests; for example, flask server or TensorFlow Serving.
* Inference routine (if required).

All these elements need to be collected to then be deployed in the serving infrastructure. The resulting asset generated after you've collected all the dependencies is called a **model package**.


## Benefits of packaging models

Packaging models before deployment has the following advantages:

* **Reproducibility:** All dependencies are collected at packaging time, rather than deployment time. Once dependencies are resolved, you can deploy the package as many times as needed while guaranteeing that dependencies have already been resolved.
* **Faster conflict resolution:** Azure Machine Learning will detect any misconfigurations related with the dependencies, like a missing Python package, while packaging the model. You don't need to deploy the model to discover such issues.
* **Easier integration with the inference server:** Because the inference server you're using may need specific software configurations (for instance, Torch Serve package), such software can generate conflicts with your model's dependencies. Model packages in Azure Machine Learning inject the dependencies required by the inference server to help you detect conflicts before deploying a model.
* **Portability:** You can move Azure Machine Learning model packages from one workspace to another, using registries. You can also generate packages that can be deployed outside Azure Machine Learning.
* **MLflow support with private networks**: For MLflow models, Azure Machine Learning requires an internet connection to be able to dynamically install necessary Python packages for the models to run. By packaging MLflow models, these Python packages get resolved during the model packaging operation, so that the MLflow model package wouldn't require an internet connection to be deployed.

> [!TIP] 
> Packaging an MLflow model before deployment is highly recommended and even required for endpoints that don't have outbound networking connectivity. An MLflow model indicates its dependencies in the model itself, thereby requiring dynamic installation of packages. When an MLflow model is packaged, this dynamic installation is performed at packaging time rather than deployment time.

## Deployment of model packages

You can provide model packages as inputs to online endpoints. Use of model packages helps to streamline your MLOps workflows by reducing the chances of errors at deployment time, since all dependencies would have been collected during the packaging operation. You can also configure the model package to generate docker images for you to deploy anywhere outside Azure Machine Learning, either on premises or in the cloud.

:::image type="content" source="media/model-packaging/model-package-targets.png" alt-text="Screenshot that shows all the possible targets for a model package.":::

### Specify model package before deployment

The simplest way to deploy using a model package is by specifying to Azure Machine Learning to deploy a model package, before executing the deployment. When using the Azure CLI, Azure Machine Learning SDK, or Azure Machine Learning studio to create a deployment in an online endpoint, you can specify the use of model packaging as follows:

# [Azure CLI](#tab/cli)

Use the `--with-package` flag when creating a deployment:

```azurecli
az ml online-deployment create  -f deployment.yml --package-model
```

# [Python](#tab/sdk)

Use the `--with_package=True` argument when creating a deployment:

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

From the model's details page in [the studio](https://ml.azure.com),

1. Select the **Deploy**.
1. Select **Online Endpoints**. 
1. Enable the **Package model (preview)** option in the creation wizard to package the model before deployment.

:::image type="content" source="./media/model-packaging/model-package-ux.png" alt-text="An screenshot of the model deployment wizard to Online Endpoints highlighting the Package model option." lightbox="media/model-packaging/model-package-ux.png":::

---

Azure Machine Learning packages the model first and then executes the deployment.

> [!NOTE]
> When using packages, if you indicate a base environment with `conda` or `pip` dependencies, you don't need to include the dependencies of the inference server (`azureml-inference-server-http`). Rather, these dependencies are automatically added for you.


## Next step

> [!div class="nextstepaction"]
> [Create your first model package](how-to-package-models.md)