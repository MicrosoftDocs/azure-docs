---
title: How to deploy the Form Recognizer sample labeling tool
titleSuffix: Azure Cognitive Services
description: Learn the different ways you can deploy the Form Recognizer sample labeling tool to help with supervised learning.
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 02/24/2020
ms.author: pafrley
---

# Deploy the sample labeling tool

The Form Recognizer sample labeling tool is an application that runs in a Docker container. It provides a helpful UI that you can use to manually label form documents for the purpose of supervised learning. The [Train with labels](./quickstarts/label-tool.md) quickstart shows you how to run the tool on your local computer, which is the most common scenario. 

This guide will explain alternate ways you can deploy and run the sample labeling tool. 

## Deploy with Azure Container Instances

You can run the label tool in a Docker web app container. Create a new Web App resource on the Azure portal. 

fill in the following fields
Publish: Docker Container
Operating System: Linux

On the next page is the Docker setup. 

Options=Single Container
Image Source=Public Registry
Server URL=https://containerpreview.azurecr.io

Image and tag=mcr.microsoft.com/azure-cognitive-services/custom-form/labeltool:latest

Then connect to Azure AD. Otherwise anyone with the url can access the Web App (and your label tool container).

[Azure Container Instances](https://docs.microsoft.com/azure/container-instances/index),

```console
#####################

DNS_NAME_LABEL=aci-demo-$RANDOM

az container create \

  --resource-group <resorunce_group_name> \

  --name <name> \

  --image containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer-custom-supervised-labeltool:latest \

  --ports 3000 \

  --dns-name-label $DNS_NAME_LABEL \

  --location westus2 \

  --cpu 2 \

  --memory 8

--command-line "./run.sh eula=accept
```

## Deploy to a Kubernetes cluster

or a Kubernetes cluster [deployed to an Azure Stack](https://docs.microsoft.com/azure-stack/user/azure-stack-solution-template-kubernetes-deploy?view=azs-1910). 

## Next steps

Return to the [Train with labels](./quickstarts/label-tool.md) quickstart to learn how to use the tool to manually label training data and do supervised learning.
