---
title: Managed Online Endpoint in Azure Machine Learning Studio (Preview)
titleSuffix: Azure Machine Learning
description: 'Learn how to use Azure Machine Learning Studio to perform CRUD operations, Test and Consume, and Monitor Managed Online Endpoint and Deployments.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: how-to, managed online endpoints
ms.author: ssambare
author: shivanissambare
ms.reviewer: lu.peter
ms.date: 05/07/2021
---

# Managed Online Endpoints and Deployments in Azure Machine Learning Studio (Preview)

In Azure Machine Learning studio, you can:

* Create a managed online endpoint and a deployment.
* Read managed online endpoint and deployment details.
* Add a managed online deployment to an existing managed online endpoint.
* Read deployment logs for managed online deployments.
* Update traffic and instance count.
* Delete managed online endpoints and deployments.
* Test and Consume tab.
* Monitor metrics.

## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).
- A machine learning model registered in your workspace. If you don't have a registered model, see []()
- A registered environment. If you don't have a registered environment, see []()

## Create a managed online endpoint and a deployment

#### Azure Machine Learning Studio - Endpoints 

1. In the Azure Machine Learning studio, click on **Endpoints** page in the left navigation bar.
2. Select **+ Create (preview)** button.
3. Follow the wizard screen to create an endpoint and a deployment.

[comment]: <> (Add Screenshot 1)

#### Azure Machine Learning Studio - Models

1. You can also create an endpoints and a deployment from **Models** page in the left navigation bar.
2. Select a *registered model* from the Models list.
3. In **Deploy** button drop down, click on **Deploy to endpoint (preview)**
4. Follow the wizard screen to create an endpoint and a deployment.

[comment]: <> (Add Screenshot 2)

> [!NOTE]
> It takes several minutes to create a managed online deployment.

## Read managed online endpoint and deployment details

1. On the **Endpoints** list page, select the endpoint with compute type *Managed* to see the details
2. You can see endpoint and deployment details.

[comment]: <> (Add Screenshot 3)

## Add a managed online deployment to an existing managed online endpoint

1. Select **+ Add Deployment** button on the endpoint's details page.
2. Complete the wizard screen to add a deployment to an existing endpoint.
3. You can adjust the traffic for all the deployments, when adding a new deployment.

[comment]: <> (Add Screenshot 4)

## Read deployment logs for managed online deployments

1. Select **Deployment Logs** in the endpoint's detail page.
2. From the drop down select the deployment name.
3. You will see deployment logs for the selected deployment.

## Update traffic and instance count.

#### Update the traffic for all the managed online deployments in an online endpoint

1. Select the **Update traffic** button on the endpoint's detail page.
2. Adjust your traffic and hit update button.

[comment]: <> (Add Screenshot 5)

#### Update instance count for an individual deployment

1. Select edit icon on the deployment's detail card.
2. Update the instance count and hit update button.

[comment]: <> (Add Screenshot 6)

## Delete managed online endpoints and deployments

#### Delete a managed online endpoint and associated deployments.

__Option 1__

1. On the Real-time endpoints list page, select the online endpoints you wish to delete.
2. Select the Delete button.

__Option 2__

1. In the online endpoint's details page, select the Delete button on the top.

#### Delete an individual managed online deployment.

1. Select the delete icon on the deployment's detail card.

> [!NOTE]
> You can delete an individual deployment taking non-zero traffic only.
> Update the traffic to 0% and then delete the deployment.

## Test and Consume tab

#### Test tab 

You can easily test a deployment from Azure Machine Learning studio.

1. Click on **Test** tab in the endpoint's detail page and select the deployment you want to test from the dropdown.
2. Give sample JSON input to test the endpoint.

[comment]: <> (Add Screenshot 7)

#### Consume tab

[comment]: <> (Add Screenshot 8)

## Monitor Metrics

In Azure Machine Learning Studio, you can monitor average request per minute and average request latency.

In the endpoint's detail page, select **Monitoring** and analyze the metrics.

[comment]: <> (Add Screenshot 9,10)