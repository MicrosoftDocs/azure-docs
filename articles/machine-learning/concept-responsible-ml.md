---
title: What is responsible AI (preview)
titleSuffix: Azure Machine Learning
description: Learn what responsible AI is and how to use it with Azure Machine Learning to understand models, protect data and control the model lifecycle.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.author: mesameki
author: mesameki
ms.date: 05/06/2022
ms.custom: responsible-ai, event-tier1-build-2022
#Customer intent: As a data scientist, I want to know learn what responsible AI is and how I can use it in Azure Machine Learning.
---

# What is responsible AI? (preview)

[!INCLUDE [dev v1](../../includes/machine-learning-dev-v1.md)]

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

The societal implications of AI and the responsibility of organizations to anticipate and mitigate unintended consequences of AI technology are significant. Organizations are finding the need to create internal policies, practices, and tools to guide their AI efforts, whether they're deploying third-party AI solutions or developing their own. At Microsoft, we've recognized six principles that we believe should guide AI development and use: fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability. For us, these principles are the cornerstone of a responsible and trustworthy approach to AI, especially as intelligent technology becomes more prevalent in the products and services we use every day. Azure Machine Learning currently supports tools for various these principles, making it seamless for ML developers and data scientists to implement Responsible AI in practice.

:::image type="content" source="./media/concept-responsible-ml/concept-responsible-ml.png" alt-text="Responsible A I principles - fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability.":::

## Fairness and inclusiveness

AI systems should treat everyone fairly and avoid affecting similarly situated groups of people in different ways. For example, when AI systems provide guidance on medical treatment, loan applications, or employment, they should make the same recommendations to everyone with similar symptoms, financial circumstances, or professional qualifications.  

**Fairness and inclusiveness in Azure Machine Learning**: Azure Machine Learning’s [fairness assessment component](./concept-fairness-ml.md) of the [Responsible AI dashboard](./concept-responsible-ai-dashboard.md) enables data scientists and ML developers to assess model fairness across sensitive groups defined in terms of gender, ethnicity, age, etc.

## Reliability and safety

To build trust, it's critical that AI systems operate reliably, safely, and consistently under normal circumstances and in unexpected conditions. These systems should be able to operate as they were originally designed, respond safely to unanticipated conditions, and resist harmful manipulation. It's also important to be able to verify that these systems are behaving as intended under actual operating conditions. How they behave and the variety of conditions they can handle reliably and safely largely reflects the range of situations and circumstances that developers anticipate during design and testing.

**Reliability and safety in Azure Machine Learning**:  Azure Machine Learning’s [Error Analysis](./concept-error-analysis.md) component of the [Responsible AI dashboard](./concept-responsible-ai-dashboard.md) enables data scientists and ML developers to get a deep understanding of how failure is distributed for a model, identify cohorts of data with higher error rate than the overall benchmark. These discrepancies might occur when the system or model underperforms for specific demographic groups or infrequently observed input conditions in the training data.

## Transparency

When AI systems are used to help inform decisions that have tremendous impacts on people's lives, it's critical that people understand how those decisions were made. For example, a bank might use an AI system to decide whether a person is creditworthy, or a company might use an AI system to determine the most qualified candidates to hire.

A crucial part of transparency is what we refer to as interpretability, or the useful explanation of the behavior of AI systems and their components. Improving interpretability requires that stakeholders comprehend how and why they function so that they can identify potential performance issues, safety and privacy concerns, fairness issues, exclusionary practices, or unintended outcomes.  

**Transparency in Azure Machine Learning**: Azure Machine Learning’s [Model Interpretability](how-to-machine-learning-interpretability.md) and [Counterfactual What-If](./concept-counterfactual-analysis.md) components of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md) enables data scientists and ML developers to generate human-understandable descriptions of the predictions of a model. It provides multiple views into a model’s behavior: global explanations (for example, what features affect the overall behavior of a loan allocation model) and local explanations (for example, why a customer’s loan application was approved or rejected). One can also observe model explanations for a selected cohort as a subgroup of data points. Moreover, the Counterfactual What-If component enables understanding and debugging a machine learning model in terms of how it reacts to input (feature) changes. Azure Machine Learning also supports a Responsible AI scorecard, a customizable report which machine learning developers can easily configure, download, and share with their technical and non-technical stakeholders to educate them about data and model health and compliance and build trust. This scorecard could also be used in audit reviews to inform the stakeholders about the characteristics of machine learning models.

## Privacy and Security 

As AI becomes more prevalent, protecting privacy and securing important personal and business information is becoming more critical and complex. With AI, privacy and data security issues require especially close attention because access to data is essential for AI systems to make accurate and informed predictions and decisions about people. AI systems must comply with privacy laws that require transparency about the collection, use, and storage of data and mandate that consumers have appropriate controls to choose how their data is used.  

**Privacy and Security in Azure Machine Learning**: Implementing differentially private systems is difficult. [SmartNoise](https://github.com/opendifferentialprivacy/smartnoise-core) is an open-source project (co-developed by Microsoft) that contains different components for building global differentially private systems. To learn more about differential privacy and the SmartNoise project, see the preserve [data privacy by using differential privacy and SmartNoise article](concept-differential-privacy.md). Azure Machine Learning is also enabling administrators, DevOps, and MLOps to [create a secure configuration that is compliant](concept-enterprise-security.md) with your companies policies. With Azure Machine Learning and the Azure platform, you can:

- Restrict access to resources and operations by user account or groups
- Restrict incoming and outgoing network communications
- Encrypt data in transit and at rest
- Scan for vulnerabilities
- Apply and audit configuration policies

Besides SmartNoise, Microsoft released [Counterfit](https://github.com/Azure/counterfit/), an open-source project that comprises a command-line tool and generic automation layer to allow developers to simulate cyber-attacks against AI systems. Anyone can download the tool and deploy it through Azure Shell, to run in-browser, or locally in an Anaconda Python environment. It can assess AI models hosted in various cloud environments, on-premises, or in the edge. The tool is agnostic to AI models and supports various data types, including text, images, or generic input.

## Accountability

The people who design and deploy AI systems must be accountable for how their systems operate. Organizations should draw upon industry standards to develop accountability norms. These norms can ensure that AI systems aren't the final authority on any decision that impacts people's lives and that humans maintain meaningful control over otherwise highly autonomous AI systems.

**Accountability in Azure Machine Learning**: Azure Machine Learning’s [Machine Learning Operations (MLOps)](concept-model-management-and-deployment.md) is based on DevOps principles and practices that increase the efficiency of workflows. It specifically supports quality assurance and end-to-end lineage tracking to capture the governance data for the end-to-end ML lifecycle. The logged lineage information can include who is publishing models, why changes were made, and when models were deployed or used in production.

Azure Machine Learning’s [Responsible AI scorecard](./how-to-responsible-ai-scorecard.md) creates accountability by enabling cross-stakeholders communications and by empowering machine learning developers to easily configure, download, and share their model health insights with their technical and non-technical stakeholders to educate them about data and model health and compliance and build trust.  

The ML platform also enables decision-making by informing model-driven and data-driven business decisions:

- Data-driven insights to further understand heterogeneous treatment effects on an outcome, using historic data only. For example, “how would a medicine impact a patient’s blood pressure?". Such insights are provided through the[Causal Inference](concept-causal-inference.md) component of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- Model-driven insights, to answer end-users’ questions such as “what can I do to get a different outcome from your AI next time?” to inform their actions. Such insights are provided to data scientists through the [Counterfactual What-If](concept-counterfactual-analysis.md) component of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md).

## Next steps

- For more information on how to implement Responsible AI in Azure Machine Learning, see [Responsible AI dashboard](concept-responsible-ai-dashboard.md). 
- Learn more about the [ABOUT ML](https://www.partnershiponai.org/about-ml/) set of guidelines for machine learning system documentation.
