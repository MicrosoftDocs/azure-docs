---
title: Migrate to Azure Machine Learning from Studio (classic)
description: Learn how to migrate from Machine Learning Studio (classic) to Azure Machine Learning for a modernized data science platform.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio-classic
ms.custom: UpdateFrequency5
ms.topic: how-to
ms.reviewer: larryfr
author: xiaoharper
ms.author: zhanxia
ms.date: 04/02/2024
---

# Migrate to Azure Machine Learning from Studio (classic)

> [!IMPORTANT]
> Support for Machine Learning Studio (classic) ends on 31 August 2024. We recommend that you transition to [Azure Machine Learning](../overview-what-is-azure-machine-learning.md) by that date.
>
> After December 2021, you can no longer create new Studio (classic) resources. Through 31 August 2024, you can continue to use existing Studio (classic) resources.  
>
> Studio (classic) documentation is being retired and might not be updated in the future.

Learn how to migrate from Machine Learning Studio (classic) to Azure Machine Learning. Azure Machine Learning provides a modernized data science platform that combines no-code and code-first approaches.

This guide walks through a basic *lift and shift* migration. If you want to optimize an existing machine learning workflow, or modernize a machine learning platform, see the [Azure Machine Learning Adoption Framework](https://aka.ms/mlstudio-classic-migration-repo) for more resources, including digital survey tools, worksheets, and planning templates.

:::image type="content" source="media/migrate-overview/aml-adoption-framework.png" alt-text="Diagram of the Azure Machine Learning adoption framework." lightbox="media/migrate-overview/aml-adoption-framework.png":::

Please work with your cloud solution architect on the migration.

## Recommended approach

To migrate to Azure Machine Learning, we recommend the following approach:

> [!div class="checklist"]
> * Step 1: Assess Azure Machine Learning
> * Step 2: Define a strategy and plan
> * Step 3: Rebuild experiments and web services
> * Step 4: Integrate client apps
> * Step 5: Clean up Studio (classic) assets
> * Step 6: Review and expand scenarios

### Step 1: Assess Azure Machine Learning

1. Learn about [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/) and its benefits, costs, and architecture.

1. Compare the capabilities of Azure Machine Learning and Studio (classic).

    The following table summarizes the key differences.

    | Feature | Studio (classic) | Azure Machine Learning |
    |---| --- | --- |
    | Drag-and-drop interface | Classic experience | Updated experience: [Azure Machine Learning designer](../concept-designer.md)|
    | Code SDKs | Not supported | Fully integrated with Azure Machine Learning [Python](/python/api/overview/azure/ml/) and [R](https://github.com/Azure/azureml-sdk-for-r) SDKs |
    | Experiment | Scalable (10-GB training data limit) | Scale with compute target |
    | Training compute targets | Proprietary compute target, CPU support only | Wide range of customizable [training compute targets](../concept-compute-target.md#training-compute-targets); includes GPU and CPU support |
    | Deployment compute targets | Proprietary web service format, not customizable | Wide range of customizable [deployment compute targets](../concept-compute-target.md#compute-targets-for-inference); includes GPU and CPU support |
    | Machine learning pipeline | Not supported | Build flexible, modular [pipelines](../concept-ml-pipelines.md) to automate workflows |
    | MLOps | Basic model management and deployment; CPU-only deployments | Entity versioning (model, data, workflows), workflow automation, integration with CICD tooling, CPU and GPU deployments, [and more](../concept-model-management-and-deployment.md) |
    | Model format | Proprietary format, Studio (classic) only | Multiple supported formats depending on training job type |
    | Automated model training and hyperparameter tuning |  Not supported | [Supported](../concept-automated-ml.md)<br><br> Code-first and no-code options |
    | Data drift detection | Not supported | [Supported](../v1/how-to-monitor-datasets.md) |
    | Data labeling projects | Not supported | [Supported](../how-to-create-image-labeling-projects.md) |
    | Role-based access control (RBAC) | Only contributor and owner role | [Flexible role definition and RBAC control](../how-to-assign-roles.md) |
    | AI Gallery | [Supported](https://gallery.azure.ai) | Not supported <br><br> Learn with [sample Python SDK notebooks](https://github.com/Azure/MachineLearningNotebooks) |

    >[!NOTE]
    > The **designer** feature in Azure Machine Learning provides a drag-and-drop experience that's similar to Studio (classic). However, Azure Machine Learning also provides robust [code-first workflows](../concept-model-management-and-deployment.md) as an alternative. This migration series focuses on the designer, since it's most similar to the Studio (classic) experience.

1. Verify that your critical Studio (classic) modules are supported in Azure Machine Learning designer. For more information, see the [Studio (classic) and designer component-mapping](#studio-classic-and-designer-component-mapping) table.

1. Create an [Azure Machine Learning workspace](../quickstart-create-resources.md).

### Step 2: Define a strategy and plan

1. Define business justifications and expected outcomes.

1. Align an actionable Azure Machine Learning adoption plan to business outcomes.

1. Prepare people, processes, and environments for change.

Please work with your cloud solution architect to define your strategy.

For planning resources, including a planning doc template, see the [Azure Machine Learning Adoption Framework](https://aka.ms/mlstudio-classic-migration-repo).

### Step 3: Rebuild your first model

After you define a strategy, migrate your first model.

1. [Migrate a dataset to Azure Machine Learning](migrate-register-dataset.md).

1. Use the Azure Machine Learning designer to [rebuild an experiment](migrate-rebuild-experiment.md).

1. Use the Azure Machine Learning designer to [redeploy a web service](migrate-rebuild-web-service.md).

    >[!NOTE]
    > This guidance is built on top of Azure Machine Learning v1 concepts and features. Azure Machine Learning has CLI v2 and Python SDK v2. We suggest that you rebuild your Studio (classic) models using v2 instead of v1. Start with [Azure Machine Learning v2](../concept-v2.md).

### Step 4: Integrate client apps

Modify client applications that invoke Studio (classic) web services to use your new [Azure Machine Learning endpoints](migrate-rebuild-integrate-with-client-app.md).

### Step 5: Clean up Studio (classic) assets

To avoid extra charges, [clean up Studio (classic) assets](../classic/export-delete-personal-data-dsr.md). You might want to retain assets for fallback until you've validated Azure Machine Learning workloads.

### Step 6: Review and expand scenarios

1. Review the model migration for best practices and validate workloads.

1. Expand scenarios and migrate more workloads to Azure Machine Learning.

## Studio (classic) and designer component-mapping

Consult the following table to see which modules to use while rebuilding Studio (classic) experiments in the Azure Machine Learning designer.

> [!IMPORTANT]
> The designer implements modules through open-source Python packages rather than C# packages like Studio (classic). Because of this difference, the output of designer components might vary slightly from their Studio (classic) counterparts.

|Category|Studio (classic) module|Replacement designer component|
|--------------|----------------|--------------------------------------|
|Data input and output|- Enter data manually <br> - Export data <br> - Import data <br> - Load trained model <br> - Unpack zipped datasets|- Enter data manually <br> - Export data <br> - Import data|
|Data format conversions|- Convert to CSV <br> - Convert to dataset <br> - Convert to ARFF <br> - Convert to SVMLight <br> - Convert to TSV|- Convert to CSV <br> - Convert to dataset|
|Data transformation – Manipulation|- Add columns<br> - Add rows <br> - Apply SQL transformation <br> - Clean missing data <br> - Convert to indicator values <br> - Edit metadata <br> - Join data <br> - Remove duplicate rows <br> - Select columns in dataset <br> - Select columns transform <br> - SMOTE <br> - Group categorical values|- Add columns<br> - Add rows <br> - Apply SQL transformation <br> - Clean missing data <br> - Convert to indicator values <br> - Edit metadata <br> - Join data <br> - Remove duplicate rows <br> - Select columns in dataset <br> - Select columns transform <br> - SMOTE|
|Data transformation – Scale and reduce |- Clip values <br> - Group data into bins <br> - Normalize data <br>- Principal component analysis |- Clip values <br> - Group data into bins <br> - Normalize data|
|Data transformation – Sample and split|- Partition and sample <br> - Split data|- Partition and sample <br> - Split data|
|Data transformation – Filter |- Apply filter <br> - FIR filter <br> - IIR filter <br> - Median filter <br> - Moving average filter <br> - Threshold filter <br> - User-defined filter| |
|Data transformation – Learning with counts |- Build counting transform <br> - Export count table <br> - Import count table <br> - Merge count transform<br>  - Modify count table parameters| |
|Feature selection |- Filter-based feature selection <br> - Fisher linear discriminant analysis  <br> - Permutation feature importance |- Filter-based feature selection <br> - Permutation feature importance|
| Model – Classification| - Multiclass decision forest <br> - Multiclass decision jungle  <br> - Multiclass logistic regression  <br>- Multiclass neural network  <br>- One-vs-all multiclass <br>- Two-class averaged perceptron <br>- Two-class Bayes point machine <br>- Two-class boosted decision tree  <br> - Two-class decision forest  <br> - Two-class decision jungle  <br> - Two-class locally deep SVM <br> - Two-class logistic regression  <br> - Two-class neural network <br> - Two-class support vector machine  | - Multiclass decision forest <br> - Multiclass boost decision tree <br> - Multiclass logistic regression <br> - Multiclass neural network <br> - One-vs-all multiclass  <br> - Two-class averaged perceptron  <br> - Two-class boosted decision tree  <br> - Two-class decision forest <br> - Two-class logistic regression <br> - Two-class neural network <br> - Two-class support vector machine  |
| Model – Clustering| - K-means clustering| - K-means clustering|
| Model – Regression| - Bayesian linear regression <br> - Boosted decision tree regression <br> - Decision forest regression <br> - Fast forest quantile regression <br> - Linear regression <br> - Neural network regression <br> - Ordinal regression <br> - Poisson regression| - Boosted decision tree regression <br> - Decision forest regression  <br> - Fast forest quantile regression <br> - Linear regression <br> - Neural network regression <br> - Poisson regression|
| Model – Anomaly detection| - One-class SVM <br> - PCA-based anomaly detection | - PCA-based anomaly detection|
| Machine Learning – Evaluate  | - Cross-validate model <br> - Evaluate model <br> - Evaluate recommender | - Cross-validate model <br> - Evaluate model <br> - Evaluate recommender|
| Machine Learning – Train| - Sweep clustering <br> - Train anomaly detection model <br> - Train clustering model  <br> - Train matchbox recommender - <br> Train model <br> - Tune model hyperparameters| - Train anomaly detection model <br> - Train clustering model <br> - Train model <br> - Train PyTorch model <br> - Train SVD recommender  <br> - Train wide and deep recommender <br> - Tune model hyperparameters|
| Machine Learning – Score| - Apply transformation <br> - Assign data to clusters <br> - Score matchbox recommender <br> - Score model|- Apply transformation <br> - Assign data to clusters <br> - Score image model <br> - Score model <br> - Score SVD recommender <br> - Score wide and deep recommender|
| OpenCV library modules| - Import images <br> - Pre-trained cascade image classification | |
| Python language modules| - Execute Python script| - Execute Python script <br> - Create Python model |
| R language modules | - Execute R script <br> - Create R model| - Execute R script|
| Statistical functions | - Apply math operation <br> -  Compute elementary statistics <br> - Compute linear correlation <br> - Evaluate probability function <br> - Replace discrete values <br> - Summarize data <br> - Test hypothesis using t-Test| - Apply math operation <br>- Summarize data|
| Text analytics| - Detect languages <br> - Extract key phrases from text <br> - Extract N-gram features from text  <br> - Feature hashing <br> - Latent dirichlet allocation <br> - Named entity recognition <br> - Preprocess text  <br> - Score vVowpal Wabbit version 7-10 model  <br> - Score Vowpal Wabbit version 8 model <br>- Train Vowpal Wabbit version 7-10 model  <br> - Train Vowpal Wabbit version 8 model | -  Convert Word to vector <br> - Extract N-gram features from text <br> -  Feature hashing <br> - Latent dirichlet allocation <br> - Preprocess text <br> - Score Vowpal Wabbit model <br> - Train Vowpal Wabbit model|
| Time series| - Time series anomaly detection | |
| Web service | - Input <br> - Output | - Input <br> - Output|
| Computer vision| | - Apply image transformation <br> - Convert to image directory <br> - Init image transformation <br> - Split image directory <br> - DenseNet image classification <br> - ResNet image classification |

For more information on how to use individual designer components, see the [Algorithm & component reference](../component-reference/component-reference.md).

### What if a designer component is missing?

Azure Machine Learning designer contains the most popular modules from Studio (classic). It also includes new modules that take advantage of the latest machine learning techniques.

If your migration is blocked due to missing modules in the designer, contact us by [creating a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Example migration

The following migration example highlights some of the differences between Studio (classic) and Azure Machine Learning.

### Datasets

In Studio (classic), *datasets* were saved in your workspace and could only be used by Studio (classic).

:::image type="content" source="media/migrate-overview/studio-classic-dataset.png" alt-text="Screenshot of automobile price datasets in Studio classic." lightbox="media/migrate-overview/studio-classic-dataset.png":::

In Azure Machine Learning, *datasets* are registered to the workspace and can be used across all of Azure Machine Learning. For more information on the benefits of Azure Machine Learning datasets, see [Data in Azure Machine Learning](concept-data.md).

### Pipeline

In Studio (classic), *experiments* contained the processing logic for your work. You created experiments with drag-and-drop modules.

:::image type="content" source="media/migrate-overview/studio-classic-experiment.png" alt-text="Screenshot of automobile price experiments in Studio classic." lightbox="media/migrate-overview/studio-classic-experiment.png":::

In Azure Machine Learning, *pipelines* contain the processing logic for your work. You can create pipelines with either drag-and-drop modules or by writing code.

:::image type="content" source="media/migrate-overview/aml-pipeline.png" alt-text="Screenshot of automobile price drag-and-drop pipelines in classic." lightbox="media/migrate-overview/aml-pipeline.png":::

### Web service endpoints

Studio (classic) used *REQUEST/RESPOND API* for real-time prediction and *BATCH EXECUTION API* for batch prediction or retraining.

:::image type="content" source="media/migrate-overview/studio-classic-web-service.png" alt-text="Screenshot of endpoint API in classic." lightbox="media/migrate-overview/studio-classic-web-service.png":::

Azure Machine Learning uses *real-time endpoints* (managed endpoints) for real-time prediction and *pipeline endpoints* for batch prediction or retraining.

:::image type="content" source="media/migrate-overview/aml-endpoint.png" alt-text="Screenshot of real-time endpoints and pipeline endpoints." lightbox="media/migrate-overview/aml-endpoint.png":::

## Related content

In this article, you learned the high-level requirements for migrating to Azure Machine Learning. For detailed steps, see the other articles in the Machine Learning Studio (classic) migration series:

- [Migrate a Studio (classic) dataset](migrate-register-dataset.md)
- [Rebuild a Studio (classic) experiment](migrate-rebuild-experiment.md)
- [Rebuild a Studio (classic) web service](migrate-rebuild-web-service.md)
- [Consume pipeline endpoints from client applications](migrate-rebuild-integrate-with-client-app.md).
- [Migrate Execute R Script modules](migrate-execute-r-script.md)

For more migration resources, see the [Azure Machine Learning Adoption Framework](https://aka.ms/mlstudio-classic-migration-repo).
