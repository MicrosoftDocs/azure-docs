---
title: What is managed feature store?
titleSuffix: Azure Machine Learning
description: Learn about the managed feature store in Azure Machine Learning
author: rsethur
ms.author: seramasu
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata 
ms.custom: build-2023
ms.topic: conceptual
ms.date: 05/23/2023
---

# What is managed feature store?

Our vision for managed feature store is to empower machine learning professionals to develop and productionize features independently. You simply provide a feature set specification and let the system handle serving, securing, and monitoring of your features, freeing you from the overhead of setting up and managing the underlying feature engineering pipelines. 

[!INCLUDE [preview disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

By integrating with our feature store across the machine learning life cycle, you're able to experiment and ship models faster, increase reliability of your models and reduce your operational costs. This is achieved by redefining the machine learning DevOps experience.

For more information on top level entities in feature store, including feature set specifications, see [Understanding top-level entities in managed feature store](concept-top-level-entities-in-managed-feature-store.md).

## What are features?
Features are the input data for your model. For data-driven use cases in an enterprise context, features are often transformations on historical data (simple aggregates, window aggregates, row level transforms). For example, consider a machine learning model for customer churn. The inputs to the model could include customer interaction data like  `7day_transactions_sum` (number of transactions in the past 30 days) or `7day_complaints_sum` (number of complaints in the past 7 days). Both are aggregate functions that are computed on the past 7 day data.

## Problems solved by feature store
To better understand managed feature store, it helps to understand what problems feature store solves for you. 

- Feature store allows you to **search and reuse features created by your team to avoid redundant work and deliver consistent predictions**. 

- You can create **new features with the ability for transformations** so that you can address feature engineering requirements with agility.

- The system **operationalizes and manages the feature engineering pipelines required for transformation and materialization** so that your team is freed from the operational aspects. 

- You can use the **same feature pipeline that is used for training data generation to be used for inference** to have online/offline consistency and to avoid training/serving skew.

## Share managed feature store

:::image type="content" source="./media/concept-what-is-managed-feature-store\share-feature-store.png" alt-text="Diagram depicting how a feature store can be shared among multiple users and workspaces":::

Feature store is a new type of workspace that can be used by multiple project workspaces. You can consume features from Spark-based environments other than Azure Machine Learning, such as Azure Databricks. You can also perform local development and testing of features.

## Feature store overview

:::image type="content" source="./media/concept-what-is-managed-feature-store\conceptual-arch.png" alt-text="Diagram depicting a conceptual architecture of Azure Machine Learning":::

With managed feature store, you provide a feature set specification and let the system handle serving, securing & monitoring of your features. A feature set specification contains feature definitions and optional transformation logic. You can also declaratively provide materialization settings to materialize to an offline store (ADLS Gen2). The system generates and manages the underlying feature materialization pipelines. You can use the feature catalog to search, share, and reuse features. With the serving API, users can look up features to generate data for training and inference. The serving API can pull the data directly from the source or from an offline materialization store for training/batch inference. The system also provides capabilities for monitoring feature materialization jobs.

### Benefits of using Azure Machine Learning managed feature store

- __Increases agility in shipping the model (prototyping to operationalization):__
    - Discover and reuse features instead of creating from scratch
    - Faster experimentation with local dev/test of new features with transformation support and using feature retrieval spec as a connective tissue in the MLOps flow
    - Declarative materialization and backfill
    - Prebuilt constructs: feature retrieval component and feature retrieval spec
- __Improves reliability of ML models__
    - Consistent feature definition across business unit/organization
    - Feature sets are versioned and immutable: Newer version of models can use newer version of features without disrupting the older version of the model
    - Monitoring of feature set materialization
    - Materialization avoids training/serving skew
    - Feature retrieval supports point-in-time temporal joins (also known as time travel) to avoid data leakage.
- __Reduces cost__
    - Reuse features created by others in the organization
    - Materialization and monitoring are system managed – Engineering cost is avoided

### Discover and manage features

Managed feature store provides the following capabilities for discovering and managing features:

- **Search and reuse features** - You're able to search and reuse features across feature stores
- **Versioning support** - Feature sets are versioned and immutable, thereby allowing you to independently manage the feature set lifecycle. You can deploy new versions of models using different versions of features without disrupting the older version of the model.
- **View cost at feature store level** - The primary cost associated with the feature store usage is the managed spark materialization jobs. You can see the cost at the feature store level
- **Feature set usage** - You can see the list of registered models using the feature sets.

#### Feature transformation

Feature transformation involves modifying the features in a dataset to improve model performance. Feature transformation is done using transformation code, defined in a feature spec, to perform calculations on source data, allowing for the ability to develop and test transformations locally for faster experimentation.

Managed feature store provides the following feature transformation capabilities:

- **Support for custom transformations** - If you need to develop features with custom transformations like window-based aggregates, you can do so by writing a Spark transformer
- **Support for precomputed features** - If you have precomputed features, you can bring them into feature store and serve them without writing code
- **Local development and testing** - With a Spark environment, you can fully develop and test feature sets locally

### Feature materialization
Materialization is the process of computing feature values for a given feature window and persisting in a materialization store. Now feature data can be retrieved more quickly and reliably for training and inference purposes.

- **Managed feature materialization pipeline** - You declaratively specify the materialization schedule, and system takes care of scheduling, precomputing and materializing the values into the materialization store.
- **Backfill support** - You can perform on-demand materialization of feature sets for a given feature window
- **Managed spark support for materialization** - materialization jobs are run using Azure Machine Learning managed Spark (in serverless compute instances), so that you're freed from setting up and managing the Spark infrastructure.

> [!NOTE]
> Both offline store (ADLS Gen2) and online store (Redis) materialization are currently supported.

### Feature retrieval

Azure Machine Learning includes a built-in component to perform offline feature retrieval, allowing the features to be used in the training and batch inference steps of an Azure Machine Learning pipeline job.

Managed feature store provides the following feature retrieval capabilities:

- **Declarative training data generation** - Using the built-in feature retrieval component, you can generate training data in your pipelines without writing any code
- **Declarative batch inference data generation** - Using the same built-in feature retrieval component, you can generate batch inference data
- **Programmatic feature retrieval** - You can also use Python sdk `get_offline_features()`to generate the training/inference data


### Monitoring

Managed feature store provides the following monitoring capabilities:

- **Status of materialization jobs** - You can view status of materialization jobs using the UI, CLI or SDK
- **Notification on materialization jobs** - You can set up email notifications on the different statuses of the materialization jobs

### Security

Managed feature store provides the following security capabilities:

- **RBAC** - Role based access control for feature store, feature set and entities. 
- **Query across feature stores** - You can create multiple feature stores with different access for users, but allow querying (for example, generate training data) from across multiple feature stores

## Next steps

- [Understanding top-level entities in managed feature store](concept-top-level-entities-in-managed-feature-store.md)
- [Manage access control for managed feature store](how-to-setup-access-control-feature-store.md)
