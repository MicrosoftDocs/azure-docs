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
ms.date: 08/05/2022
ms.custom: responsible-ai, event-tier1-build-2022
#Customer intent: As a data scientist, I want to learn what responsible AI is and how I can use it in Azure Machine Learning.
---

# What is Responsible AI? (preview)

[!INCLUDE [dev v1](../../includes/machine-learning-dev-v1.md)]

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

Responsible Artificial Intelligence (Responsible AI) is an approach to developing, assessing, and deploying AI systems in a safe, trustworthy and ethical manner. AI systems are the product of many different decisions made by those who develop and deploy them. From system purpose to how people interact with AI systems, we need to proactively guide these decisions toward more beneficial and equitable outcomes. That means keeping people and their goals at the center of system design decisions and respecting enduring values like fairness, reliability, and transparency.

At Microsoft, we've developed a [Responsible AI Standard](https://blogs.microsoft.com/wp-content/uploads/prod/sites/5/2022/06/Microsoft-Responsible-AI-Standard-v2-General-Requirements-3.pdf), a framework to guide how we build AI systems, according to our six principles of fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability. For us, these principles are the cornerstone of a responsible and trustworthy approach to AI, especially as intelligent technology becomes more prevalent in the products and services we use every day.


This article explains the six principles and demonstrates how Azure Machine Learning supports tools for making it seamless for ML developers and data scientists to implement and operationalize them in practice.

:::image type="content" source="./media/concept-responsible-ml/concept-responsible-ml.png" alt-text=" Diagram of Microsoft Responsible AI six principles - fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability." border="false":::

## Fairness and inclusiveness

AI systems should treat everyone fairly and avoid affecting similarly situated groups of people in different ways. For example, when AI systems provide guidance on medical treatment, loan applications, or employment, they should make the same recommendations to everyone with similar symptoms, financial circumstances, or professional qualifications.  

**Fairness and inclusiveness in Azure Machine Learning**: Azure Machine Learning’s [fairness assessment component](./concept-fairness-ml.md) of the [Responsible AI dashboard](./concept-responsible-ai-dashboard.md) enables data scientists and ML developers to assess model fairness across sensitive groups defined in terms of gender, ethnicity, age, etc.

## Reliability and safety

To build trust, it's critical that AI systems operate reliably, safely, and consistently under normal circumstances and in unexpected conditions. These systems should be able to operate as they were originally designed, respond safely to unanticipated conditions, and resist harmful manipulation. It's also important to be able to verify that these systems are behaving as intended under actual operating conditions. How they behave and the variety of conditions they can handle reliably and safely largely reflects the range of situations and circumstances that developers anticipate during design and testing.

**Reliability and safety in Azure Machine Learning**:  Azure Machine Learning’s [Error Analysis](./concept-error-analysis.md) component of the [Responsible AI dashboard](./concept-responsible-ai-dashboard.md) enables data scientists and ML developers to get a deep understanding of how failure is distributed for a model, identify cohorts of data with higher error rate than the overall benchmark. These discrepancies might occur when the system or model underperforms for specific demographic groups or infrequently observed input conditions in the training data.

## Transparency

When AI systems are used to help inform decisions that have tremendous impacts on people's lives, it's critical that people understand how those decisions were made. For example, a bank might use an AI system to decide whether a person is creditworthy, or a company might use an AI system to determine the most qualified candidates to hire.

A crucial part of transparency is what we refer to as interpretability or the useful explanation of the behavior of AI systems and their components. Improving interpretability requires that stakeholders comprehend how and why AI systems function the way they do so that they can identify potential performance issues, fairness issues, exclusionary practices, or unintended outcomes.  

**Transparency in Azure Machine Learning**: Azure Machine Learning’s [Model Interpretability](how-to-machine-learning-interpretability.md) and [Counterfactual What-If](./concept-counterfactual-analysis.md) components of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md) enable data scientists and ML developers to generate human-understandable descriptions of the predictions of a model. The Model Interpretability component provides multiple views into their model’s behavior: global explanations (for example, what features affect the overall behavior of a loan allocation model?) and local explanations (for example, why a customer’s loan application was approved or rejected?). One can also observe model explanations for a selected cohort of data points (for example, what features affect the overall behavior of a loan allocation model for low-income applicants?). Moreover, the Counterfactual What-If component enables understanding and debugging a machine learning model in terms of how it reacts to feature changes and perturbations. Azure Machine Learning also supports a [Responsible AI scorecard](./how-to-responsible-ai-scorecard.md), a customizable PDF report that machine learning developers can easily configure, generate, download, and share with their technical and non-technical stakeholders to educate them about their datasets and models health, achieve compliance, and build trust. This scorecard could also be used in audit reviews to uncover the characteristics of machine learning models.

## Privacy and Security

As AI becomes more prevalent, protecting the privacy and securing important personal and business information is becoming more critical and complex. With AI, privacy and data security issues require especially close attention because access to data is essential for AI systems to make accurate and informed predictions and decisions about people. AI systems must comply with privacy laws that require transparency about the collection, use, and storage of data and mandate that consumers have appropriate controls to choose how their data is used.  

**Privacy and Security in Azure Machine Learning**: Azure Machine Learning is enabling administrators, DevOps, and MLOps developers to [create a secure configuration that is compliant](concept-enterprise-security.md) with their company's policies. With Azure Machine Learning and the Azure platform, users can:

- Restrict access to resources and operations by user account or groups
- Restrict incoming and outgoing network communications
- Encrypt data in transit and at rest
- Scan for vulnerabilities
- Apply and audit configuration policies

Microsoft has also created two open source packages that could enable further implementation of privacy and security principles:

- SmartNoise: Differential privacy is a set of systems and practices that help keep the data of individuals safe and private. In machine learning solutions, differential privacy may be required for regulatory compliance. Implementing differentially private systems, however, is difficult. [SmartNoise](https://github.com/opendifferentialprivacy/smartnoise-core) is an open-source project (co-developed by Microsoft) that contains different components for building global differentially private systems.


- Counterfit: [Counterfit](https://github.com/Azure/counterfit/) is an open-source project that comprises a command-line tool and generic automation layer to allow developers to simulate cyber-attacks against AI systems. Anyone can download the tool and deploy it through Azure Shell, to run in-browser, or locally in an Anaconda Python environment. It can assess AI models hosted in various cloud environments, on-premises, or in the edge. The tool is agnostic to AI models and supports various data types, including text, images, or generic input.

## Accountability

The people who design and deploy AI systems must be accountable for how their systems operate. Organizations should draw upon industry standards to develop accountability norms. These norms can ensure that AI systems aren't the final authority on any decision that impacts people's lives and that humans maintain meaningful control over otherwise highly autonomous AI systems.

**Accountability in Azure Machine Learning**: Azure Machine Learning’s [Machine Learning Operations (MLOps)](concept-model-management-and-deployment.md) is based on DevOps principles and practices that increase the efficiency of AI workflows. Azure Machine Learning provides the following MLOps capabilities for better accountability of your AI systems:

- Register, package, and deploy models from anywhere. You can also track the associated metadata required to use the model.
- Capture the governance data for the end-to-end ML lifecycle. The logged lineage information can include who is publishing models, why changes were made, and when models were deployed or used in production.
- Notify and alert on events in the ML lifecycle. For example, experiment completion, model registration, model deployment, and data drift detection.
- Monitor ML applications for operational and ML-related issues. Compare model inputs between training and inference, explore model-specific metrics, and provide monitoring and alerts on your ML infrastructure.

Besides the MLOps capabilities, Azure Machine Learning’s [Responsible AI scorecard](how-to-responsible-ai-scorecard.md) creates accountability by enabling cross-stakeholders communications and by empowering machine learning developers to easily configure, download, and share their model health insights with their technical and non-technical stakeholders to educate them about their AI's data and model health, and build trust.  

The ML platform also enables decision-making by informing model-driven and data-driven business decisions:

- Data-driven insights to help stakeholders understand causal treatment effects on an outcome, using historic data only. For example, “how would a medicine impact a patient’s blood pressure?". Such insights are provided through the [Causal Inference](concept-causal-inference.md) component of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- Model-driven insights, to answer end-users questions such as “what can I do to get a different outcome from your AI next time?” to inform their actions. Such insights are provided to data scientists through the [Counterfactual What-If](concept-counterfactual-analysis.md) component of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md).

## Next steps

- For more information on how to implement Responsible AI in Azure Machine Learning, see [Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- Learn how to generate the Responsible AI dashboard via [CLIv2 and SDKv2](how-to-responsible-ai-dashboard-sdk-cli.md) or [Azure Machine Learning studio UI](how-to-responsible-ai-dashboard-ui.md).
- Learn how to generate a [Responsible AI scorecard](how-to-responsible-ai-scorecard.md) based on the insights observed in your Responsible AI dashboard.
- Learn about Microsoft's [Responsible AI Standard](https://blogs.microsoft.com/wp-content/uploads/prod/sites/5/2022/06/Microsoft-Responsible-AI-Standard-v2-General-Requirements-3.pdf), a framework to guide how to build AI systems, according to Microsoft's six principles of fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability.
