---
title: What is responsible machine learning (preview)
titleSuffix: Azure Machine Learning
description: Learn what responsible machine learning is and how to use it with Azure Machine Learning to understand models, protect data and control the model lifecycle.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: luquinta
author: luisquintanilla
ms.date: 02/25/2021
ms.custom: responsible-ml
#Customer intent: As a data scientist, I want to know learn what responsible machine learning is and how I can use it in Azure Machine Learning.
---

# What is responsible machine learning? (preview)

In this article, you'll learn what responsible machine learning (ML) is and ways you can put it into practice with Azure Machine Learning.

## Responsible machine learning principles

Throughout the development and use of AI systems, trust must be at the core. Trust in the platform, process, and models. At Microsoft, responsible machine learning encompasses the following values and principles:

- Understand machine learning models
  - Interpret and explain model behavior
  - Assess and mitigate model unfairness
- Protect people and their data
  - Prevent data exposure with differential privacy
  - Work with encrypted data using homomorphic encryption
- Control the end-to-end machine learning process
  - Document the machine learning lifecycle with datasheets

:::image type="content" source="media/concept-responsible-ml/responsible-ml-pillars.png" alt-text="Responsible ML pillars - interpretability, differential privacy, homomorphic encryption, audit trail - Azure Machine Learning":::

As artificial intelligence and autonomous systems integrate more into the fabric of society, it's important to proactively make an effort to anticipate and mitigate the unintended consequences of these technologies.

## Interpret and explain model behavior

Hard to explain or opaque-box systems can be problematic because it makes it hard for stakeholders like system developers, regulators, users, and business decision makers to understand why systems make certain decisions. Some AI systems are more explainable than others and there's sometimes a tradeoff between a system with higher accuracy and one that is more explainable.

To build interpretable AI systems, use [InterpretML](https://github.com/interpretml/interpret), an open-source package built by Microsoft. The InterpretML package supports a wide variety of interpretability techniques such as SHapley Additive exPlanations (SHAP), mimic explainer and permutation feature importance (PFI).  [InterpretML can be used inside of Azure Machine Learning](how-to-machine-learning-interpretability.md) to [interpret and explain your machine learning models](how-to-machine-learning-interpretability-aml.md), including [automated machine learning models](how-to-machine-learning-interpretability-automl.md).

## Mitigate fairness in machine learning models

As AI systems become more involved in the everyday decision-making of society, it's of extreme importance that these systems work well in providing fair outcomes for everyone.

Unfairness in AI systems can result in the following unintended consequences:

- Withholding opportunities, resources or information from individuals.
- Reinforcing biases and stereotypes.

Many aspects of fairness cannot be captured or represented by metrics. There are tools and practices that can improve fairness in the design and development of AI systems.

Two key steps in reducing unfairness in AI systems are assessment and mitigation. We recommend [FairLearn](https://github.com/fairlearn/fairlearn), an open-source package that can assess and mitigate the potential unfairness of AI systems. To learn more about fairness and the FairLearn package, see the [Fairness in ML article](./concept-fairness-ml.md).

## Prevent data exposure with differential privacy

When data is used for analysis, it's important that the data remains private and confidential throughout its use. Differential privacy is a set of systems and practices that help keep the data of individuals safe and private.

In traditional scenarios, raw data is stored in files and databases. When users analyze data, they typically use the raw data. This is a concern because it might infringe on an individual's privacy. Differential privacy tries to deal with this problem by adding "noise" or randomness to the data so that users can't identify any individual data points.

Implementing differentially private systems is difficult. [SmartNoise](https://github.com/opendifferentialprivacy/smartnoise-core) is an open-source project that contains different components for building global differentially private systems. To learn more about differential privacy and the SmartNoise project, see the [preserve data privacy by using differential privacy and SmartNoise](./concept-differential-privacy.md) article.

## Work on encrypted data with homomorphic encryption

In traditional cloud storage and computation solutions, the cloud needs to have unencrypted access to customer data to compute on it. This access exposes the data to cloud operators. Data privacy relies on access control policies implemented by the cloud and trusted by the customer.

Homomorphic encryption allows for computations to be done on encrypted data without requiring access to a secret (decryption) key. The results of the computations are encrypted and can be revealed only by the owner of the secret key. Using homomorphic encryption, cloud operators will never have unencrypted access to the data they're storing and computing on. Computations are performed directly on encrypted data. Data privacy relies on state-of-the-art cryptography, and the data owner controls all information releases. For more information on homomorphic encryption at Microsoft, see [Microsoft Research](https://www.microsoft.com/research/project/homomorphic-encryption/).

To get started with homomorphic encryption in Azure Machine Learning, use the [encrypted-inference](https://pypi.org/project/encrypted-inference/) Python bindings for [Microsoft SEAL](https://github.com/microsoft/SEAL). Microsoft SEAL is an open-source homomorphic encryption library that allows additions and multiplications to be performed on encrypted integers or real numbers. To learn more about Microsoft SEAL, see the [Azure Architecture Center](/azure/architecture/solution-ideas/articles/homomorphic-encryption-seal) or the [Microsoft Research project page](https://www.microsoft.com/research/project/microsoft-seal/).

See the following sample to learn [how to deploy an encrypted inferencing web service in Azure Machine Learning](how-to-homomorphic-encryption-seal.md).

## Document the machine learning lifecycle with datasheets

Documenting the right information in the machine learning process is key to making responsible decisions at each stage. Datasheets are a way to document machine learning assets that are used and created as part of the machine learning lifecycle.

Models tend to be thought of as "opaque boxes" and often there is little information about them. Because machine learning systems are becoming more pervasive and are used for decision making, using datasheets is a step towards developing more responsible machine learning systems.

Some model information you might want to document as part of a datasheet:

- Intended use
- Model architecture
- Training data used
- Evaluation data used
- Training model performance metrics
- Fairness information.

See the following sample to learn how to use the Azure Machine Learning SDK to implement [datasheets for models](https://github.com/microsoft/MLOps/blob/master/pytorch_with_datasheet/model_with_datasheet.ipynb).

## Additional resources

- For more information, see the [responsible innovation toolkit](/azure/architecture/guide/responsible-innovation/) to learn about best practices.
- Learn more about the [ABOUT ML](https://www.partnershiponai.org/about-ml/) set of guidelines for machine learning system documentation.