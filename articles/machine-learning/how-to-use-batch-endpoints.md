---
title: 'Use batch endpoints and deployments'
titleSuffix: Azure Machine Learning
description: In this article you will learn how to use batch endpoints to operationalize long running machine learning jobs under an stable API.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.date: 05/01/2023
ms.custom: how-to, devplatv2
---

# Use batch endpoints and deployments

Use Azure Machine Learning batch endpoints to operationalize your machine learning workloads in a repetitible and scalable way. Batch endpoints provide a unified interface to invoke and manage long running machine learning jobs.



A deployment is a set of resources required for hosting the resources that does the actual inferencing. Each endpoint can host multiple deployments with different configuration, models, or pipelines. Batch endpoints automatically route the client to the default deployment which can be configured and changed at any time.

There are two types of deployments in batch endpoints:

* __Model deployment:__ They allow users to operationalize models to perform batch inference at scale by processing big amounts of data in a low latency and asynchronous way. Scalability is automatically instrumented by Azure ML by providing parallelization of the inferencing processes across multiple nodes in a compute cluster. 
* __Pipeline component deployment:__ They allow users to operationalize entire processing graphs (pipelines and jobs) to perform batch inference in a low latency and asynchronous way. 