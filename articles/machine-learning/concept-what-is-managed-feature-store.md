---
title: What is managed feature store?
titleSuffix: Azure Machine Learning
description: Learn about the managed feature store in Azure Machine Learning
author: rsethur
ms.author: seramasu
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata 
ms.topic: conceptual
ms.date: 05/23/2023
---

# What is managed feature store?

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

Our vision for managed feature store is to empower machine learning professionals to develop and productionize features independently. You simply provide a feature set specification and let the system handle serving, securing, and monitoring of your features, freeing you from the overhead of setting up and managing the underlying feature engineering pipelines.

By integrating with our feature store across the machine learning life cycle, you're able to experiment and ship models faster, increase reliability of your models and reduce your operational costs. This is achieved by redefining the machine learning DevOps experience.

Managed features store provides the following capabilities: discovery and reuse of features, feature transformation, materialization, training/inference data generation, lineage and security.

## What are features?
Features are the input data for your model. For data-driven use cases in an enterprise context, features are often transformations on historical data (simple aggregates, window aggregates, row level transforms). For example, consider a machine learning model for customer churn. The inputs to the model could include customer interaction data like  `7day_transactions_sum` (number of transactions in the past 30 days) or `7day_complaints_sum` (number of complaints in the past 7 days). Note that both are aggregate functions that are computed on the past 7 day data.

## User stories addressed by the managed feature store
* “As a machine learning professional (data scientist, machine learning engineer, etc.), I want to __search and reuse features created by my team to avoid redundant work and deliver consistent predictions__”
* “As a machine learning professional I want to create __new features with ability for transformations__ so that I can address feature engineering requirements with agility”
* “As a machine learning professional I want __the system to operationalize and manage the feature engineering pipelines required for transformation and materialization__ so that my team is freed from the operational aspects”
* “As a machine learning professional I want to __use same feature pipeline that is used for training data generation to be used for inference__ to have online/offline consistency and to avoid training/serving skew

## Use managed feature store from Azure Machine Learning and other machine learning platforms

:::image type="content" source="./media/concept-what-is-managed-feature-store\share-feature-store.png" alt-text="Diagram depicting how a feature store can be shared among multiple users and workspaces":::

Feature store is a new type of workspace that can be used by multiple project workspaces. You can consume features from Spark-based environments other than Azure Machine Learning, such as Azure Databricks. You can also perform local development and testing of features.

## Overview

:::image type="content" source="./media/concept-what-is-managed-feature-store\conceptual-arch.png" alt-text="Diagram depicting a conceptual architecture of Azure Machine Learning":::

By providing a feature set specification, the system takes care of serving, securing, and monitoring your features. This eliminates the need for you to set up and manage the feature engineering pipelines. For more information on top level entities in feature store, including feature set specifications, see [Understanding top-level entities in managed feature store](concept-top-level-entities-in-managed-feature-store.md).

#### Discover and manage features
| Capability | Description|
|---|---|
| Search and reuse features| You'll be able to search and reuse features across feature stores|
|Versioning support | Feature sets are versioned and immutable, thereby allowing you to independently manage the feature set lifecycle. You can deploy new versions of models using different versions of features without disrupting the older version of the model.|
|View cost at feature store level | The primary cost associated with the feature store usage is the managed spark materialization jobs. You can see the cost at the feature store level|
| Feature set usage| You can see the list of registered models using the feature sets.|

#### Feature transformation
| Capability | Description|
|---|---|
| Support for custom transformations | If you need to develop features with custom transformations like wind based aggregates, you can do so by writing a Spark transformer|
|Support for precomputed features | If you have precomputed features, you can bring this into feature store and serve them without writing code |
|Local development and testing| With a Spark environment, you can fully develop and test feature sets locally|


#### Materialization
Materialization is the process of computing feature values for a given feature window and persisting in a materialization store. Now feature data can be retrieved more quickly and reliably for training and inference purposes.
| Capability | Description|
|---|---|
|Managed feature materialization pipeline| You declaratively specify the materialization schedule, and system takes care of scheduling, precomputing ans materializing the values into the materialization store.|
| Backfill support| You can perform on-demand materialization of feature sets for a given feature window|
|Managed spark support for materialization| materialization jobs are run using Azure Machine Learning managed Spark (in serverless compute instances), so that you're freed from setting up and managing the Spark infrastructure.|

> [!NOTE]
> Only offline store (ADLS Gen2) materialization is currently supported.

#### Feature retrieval
| Capability | Description|
|---|---|
| Declarative training data generation | Using the built-in feature retrieval component, you can generate training data in your pipelines without writing any code|
| Declarative batch inference data generation | Using the same built-in feature retrieval component, you can generate batch inference data|
| Programmatic feature retrieval | You can also use Python sdk `get_offline_features()`to generate the training/inference data|

#### Monitoring
| Capability | Description|
|---|---|
|Status of materialization jobs| You can view status of materialization jobs using the UI, CLI or SDK|
| Notification on materialization jobs| You can set up email notifications on the different statuses of the materialization jobs|

#### Security
| Capability | Description|
|---|---|
| RBAC| Role based access control for feature store, feature set and entities. Note that this is granular. For fine-grained access, see below|
| Query across feature stores | Though isn't a security feature, but very useful in this context. You can create multiple feature stores with different access for users, but allow querying (for example, generate training data) from across multiple feature stores|

## Benefits of using Azure Machine Learning managed feature store
1. __Increases agility in shipping the model (prototyping to operationalization):__
    * Discover and reuse features instead of creating from scratch
    * Faster experimentation with local dev/test of new features with transformation support and using feature retrieval specification as a connective tissue in the MLOps flow
    * Declarative materialization and backfill
    * Prebuilt constructs: feature retrieval component and feature retrieval spec
1. __Improves reliability of machine learning models__
    * Consistent feature definition across business unit/organization
    * Feature sets are versioned and immutable: Newer version of models can use newer version of features without disrupting the older version of the model
    * Monitoring of feature set materialization
    * Materialization avoids training/serving skew
    * Feature retrieval supports point-in-time temporal joins (also known as time travel) to avoid data leakage.
1. __Reduces cost__
    * Reuse features created by others in the organization
    * Materialization and monitoring are system managed – Engineering cost is avoided

## Users types and responsibilities

Following are the kind of users who use the feature store:
1. __Feature producers__ (for example, Data scientist, Data engineers, and machine learning engineers): They work primarily with the feature store workspace and responsible for:
    * Managing lifecycle of features: From creation to retirement/archival
    * Setting up materialization and backfill of features
    * Monitoring feature freshness and quality
1. __Feature consumers__ (for example, Data scientist and machine learning engineers): They work primarily with in a project workspace and use features: 
    * Discovering features for reuse in model
    * Experimenting with features during training to see if it improves model performance
    * Setting up training/inference pipelines to use the features
1. __Admins__: They're typically responsible for:
    * Managing lifecycle of feature store (creation to retirement)
    * Managing lifecycle of user access to feature store
    * Configuring feature store: quota and storage (offline/online stores)
    * Managing costs

In many organizations same person may wear multiple hats. For for example, the same person can both be a feature producer and consumer.