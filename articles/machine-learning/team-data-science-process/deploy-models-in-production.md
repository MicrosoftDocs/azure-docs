---
title: Deploy models in production - Team Data Science Process
description: How to deploy models to production enabling them to play an active role in making business decisions.
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 11/30/2017
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---

# Deploy models to production to play an active role in making business decisions

Production deployment enables a model to play an active role in a business. Predictions from a deployed model can be used for business decisions.

## Production platforms

There are various approaches and platforms to put models into production. Here are a few options:

- [Where to deploy models with Azure Machine Learning service](../service/how-to-deploy-and-where.md)
- [Deployment of a model in SQL-server](https://docs.microsoft.com/sql/advanced-analytics/tutorials/sqldev-py6-operationalize-the-model)
- [Microsoft Machine Learning Server](https://docs.microsoft.com/sql/advanced-analytics/r/r-server-standalone)

>[!NOTE]
>Prior to deployment, one has to insure the latency of model scoring is low enough to use in production.
>

>[!NOTE]
>For deployment using Azure Machine Learning Studio, see [Deploy an Azure Machine Learning web service](../studio/publish-a-machine-learning-web-service.md).
>

## A/B testing

When multiple models are in production, it can be useful to perform [A/B testing](https://en.wikipedia.org/wiki/A/B_testing) to compare performance of the models. 
 
## Next steps

Walkthroughs that demonstrate all the steps in the process for **specific scenarios** are also provided. They are listed and linked with thumbnail descriptions in the [Example walkthroughs](walkthroughs.md) article. They illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application. 
