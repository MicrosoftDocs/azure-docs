---
title: What is managed feature store?
titleSuffix: Azure Machine Learning
description: Learn about the managed feature store in Azure Machine Learning
author: rsethur
ms.author: seramasu
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata 
ms.custom: build-2023, ignite-2023
ms.topic: conceptual
ms.date: 10/20/2023
---

# What is managed feature store?

In our vision for managed feature store, we want to empower machine learning professionals to independently develop and productionize features. You provide a feature set specification, and then let the system handle serving, securing, and monitoring of the features. This frees you from the overhead of underlying feature engineering pipeline set-up and management.

Thanks to integration of our feature store across the machine learning life cycle, you can experiment and ship models faster, increase the reliability of their models, and reduce your operational costs. The redefinition of the machine learning experience provides these advantages.

For more information on top level entities in feature store, including feature set specifications, see [Understanding top-level entities in managed feature store](concept-top-level-entities-in-managed-feature-store.md).

## What are features?
Features serve as the input data for your model. For data-driven use cases in an enterprise context, features often transform historical data (simple aggregates, window aggregates, row level transforms, etc.). For example, consider a customer churn machine learning model. The model inputs could include customer interaction data like `7day_transactions_sum` (number of transactions in the past seven days) or `7day_complaints_sum` (number of complaints in the past seven days). Both of these aggregate functions are computed on the previous seven-day data.

## Problems solved by feature store
To better understand managed feature store, you should first understand the problems that feature store can solve.

- Feature store allows you to **search and reuse features created by your team, to avoid redundant work and deliver consistent predictions**.

- You can create **new features with the ability for transformations**, to address feature engineering requirements in an agile, dynamic way.

- The system **operationalizes and manages the feature engineering pipelines required for transformation and materialization** to free your team from the operational aspects.

- You can use the **same feature pipeline, originally used for training data generation, for new use for inference purposes** to provide online/offline consistency, and to avoid training/serving skew.

## Share managed feature store

:::image type="content" source="./media/concept-what-is-managed-feature-store/share-feature-store.png" alt-text="Diagram that shows how you can share a feature store among multiple users and workspaces":::

Feature store is a new type of workspace that multiple project workspaces can use. You can consume features from Spark-based environments other than Azure Machine Learning, such as Azure Databricks. You can also perform local development and testing of features.

## Feature store overview

:::image type="content" source="./media/concept-what-is-managed-feature-store\conceptual-arch.png" alt-text="Diagram depicting a conceptual architecture of Azure Machine Learning":::

For managed feature store, you provide a feature set specification. Then, the system handles serving, securing, and monitoring of your features. A feature set specification contains feature definitions and optional transformation logic. You can also declaratively provide materialization settings to materialize to an offline store (ADLS Gen2). The system generates and manages the underlying feature materialization pipelines. You can use the feature catalog to search, share, and reuse features. With the serving API, users can look up features to generate data for training and inference. The serving API can pull the data directly from the source, or from an offline materialization store for training/batch inference. The system also provides capabilities for monitoring feature materialization jobs.

### Benefits of using Azure Machine Learning managed feature store

- __Increases agility in shipping the model (prototyping to operationalization):__
    - Discover and reuse features instead of creating features from scratch
    - Faster experimentation with local dev/test of new features with transformation support and use of feature retrieval spec as a connective tissue in the MLOps flow
    - Declarative materialization and backfill
    - Prebuilt constructs: feature retrieval component and feature retrieval spec
- __Improves reliability of ML models__
    - A consistent feature definition across business unit/organization
    - Feature sets are versioned and immutable: Newer version of models can use newer feature versions without disrupting the older version of the model
    - Monitor feature set materialization
    - Materialization avoids training/serving skew
    - Feature retrieval supports point-in-time temporal joins (also known as time travel) to avoid data leakage.
- __Reduces cost__
    - Reuse features created by others in the organization
    - Materialization and monitoring are system managed, to reduce engineering cost

### Discover and manage features

Managed feature store provides these capabilities for feature discovery and management:

- **Search and reuse features** - You can search and reuse features across feature stores
- **Versioning support** - Feature sets are versioned and immutable, which allows you to independently manage the feature set lifecycle. You can deploy new model versions with different feature versions, and avoid disruption of the older model version
- **View cost at feature store level** - The primary cost associated with feature store usage involves managed Spark materialization jobs. You can see this cost at the feature store level
- **Feature set usage** - You can see the list of registered models using the feature sets.

#### Feature transformation

Feature transformation involves dataset feature modification, to improve model performance. Transformation code, defined in a feature spec, handles feature transformation. For faster experimentation, transformation code performs calculations on source data, and allows for local development and testing of transformations.

Managed feature store provides these feature transformation capabilities:

- **Support for custom transformations** - You can write a Spark transformer to develop features with custom transformations, like window-based aggregates, for example
- **Support for precomputed features** - You can bring precomputed features into feature store, and serve them without writing code
- **Local development and testing** - With a Spark environment, you can fully develop and test feature sets locally

### Feature materialization
Materialization involves the computation of feature values for a given feature window, and persistence of those values in a materialization store. Now, feature data can be retrieved more quickly and reliably for training and inference purposes.

- **Managed feature materialization pipeline** - You declaratively specify the materialization schedule, and the system then handles the scheduling, precomputation, and materialization of the values into the materialization store.
- **Backfill support** - You can perform on-demand materialization of feature sets for a given feature window
- **Managed Spark support for materialization** - Azure Machine Learning managed Spark (in serverless compute instances) runs the materialization jobs. It frees you from set-up and management of the Spark infrastructure.

> [!NOTE]
> Both offline store (ADLS Gen2) and online store (Redis) materialization are currently supported.

### Feature retrieval

Azure Machine Learning includes a built-in component that handles offline feature retrieval. It allows use of the features in the training and batch inference steps of an Azure Machine Learning pipeline job.

Managed feature store provides these feature retrieval capabilities:

- **Declarative training data generation** - With the built-in feature retrieval component, you can generate training data in your pipelines without writing any code
- **Declarative batch inference data generation** - With the same built-in feature retrieval component, you can generate batch inference data
- **Programmatic feature retrieval** - You can also use Python SDK `get_offline_features()`to generate the training/inference data

### Monitoring

Managed feature store provides the following monitoring capabilities:

- **Status of materialization jobs** - You can view status of materialization jobs using the UI, CLI or SDK
- **Notification on materialization jobs** - You can set up email notifications on the different statuses of the materialization jobs

### Security

Managed feature store provides the following security capabilities:

- **RBAC** - Role based access control for feature store, feature set and entities.
- **Query across feature stores** - You can create multiple feature stores with different access permissions for users, but allow querying (for example, generate training data) from across multiple feature stores

## Next steps

- [Understanding top-level entities in managed feature store](concept-top-level-entities-in-managed-feature-store.md)
- [Manage access control for managed feature store](how-to-setup-access-control-feature-store.md)
- [Azure Machine Learning managed feature stores samples repository](https://github.com/Azure/azureml-examples/tree/main/sdk/python/featurestore_sample)
