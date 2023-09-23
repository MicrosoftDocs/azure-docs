---
title: Model packages for deployment
titleSuffix: Azure Machine Learning
description:  Deploy models in a reliable and reproducible way using model packages in Azure Machine Learning.
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 10/04/2023
ms.topic: concept
---

# Model packages for deployment

After you train a machine learning model, you need to deploy it so others can consume their predictions. However, deploying a model requires more than just the weights or the model's artifacts. Model packages is a capability in Azure Machine Learning that allows you to collect all the dependencies required to deploy a machine learning model to a serving platform. Packages can be moved across workspaces and even outside of Azure Machine Learning.

## What's a model package?

In general, before deploying a model you want to collect all the dependencies it requires for running successfuly so you can deploy it in a reproducible and robut approach. Typically, model's dependencies include:

* The base image or environment where your model executes on.
* The list of packages and dependencies that the model depends on to function properly.
* Extra assets that your model may need to generate inference. Those can be label's maps, preprocessing parameters, etc.
* The software required for the inference server to serve the requests (like the flask server, gunicorn, etc.).
* The inference routine (if required).

All these elements need to be collected to then be deployed in the serving infrastructure. The resulting asset generated after all the dependencies are collected is called a **model package**.

:::image type="content" source="media/model-packaging/model-package-dependencies.png" alt-text="Screenshot that shows the dependencies that are collected by a model package operation.":::

## Benefitis of packaging models

Packaging models before deployment has the following advantages:

* **Reproducibility:**: All dependencies are collected at packaging time, rather than at deployment time. Once dependencies are resolved, you can deploy the package as many times as needed while guaranteeing that dependencies were resolved once.
* **Faster conflict resolution:** Any misconfiguration related with the dependencies, like a missing Python package, will be detected while packaging the model. You don't need to deploy the model to dicover such issue.
* **Easier integration with the inference server:** Because the inference server you are using may need specific software configurations (for instance, Torch Serve package), such software can generate conflicts with your model's dependencies. Azure Machine Learning packages inject the dependencies required by the inference server to help you detect conflicts before deploying the model.
* **Portability:** Azure Machine Learning model packages can be moved from one workspace to another using registries. You can also generate packages that can be deployed outside of Azure Machine Learning.
* **MLflow support with private networks**: MLflow models require an internet connection to allow the resolution of the packages they need to run. By packaging MLflow models, all those packages are resolved during the package operation and hence they don't require an internet connection when deployed.

## Deploying with packages

Packages can be used directly as inputs to Online Endpoints. This helps streamline your MLOps workflows by reducing the changes of errors at deployment time since dependencies are all collected at once at packaging. You can also configure the package to generate docker images you can deploy anywhere outside of Azure Machine Learning, either on premise or in the cloud.

:::image type="content" source="media/model-packaging/model-package-targets.png" alt-text="Screenshot that shows all the possible targets for a model package.":::

## Next steps

> [!div class="nextstepaction"]
> [Create your first model package](how-to-package-models.md)