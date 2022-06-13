---
title: Assess AI systems and make data-driven decisions with Azure Machine Learning Responsible AI dashboard
titleSuffix: Azure Machine Learning
description: The Responsible AI dashboard is a comprehensive UI and set of SDK/YAML components to help data scientists debug their machine learning models and make data-driven decisions.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: mesameki
author: mesameki
ms.date: 05/10/2022
ms.custom: responsible-ml, event-tier1-build-2022
---

# Assess AI systems and make data-driven decisions with Azure Machine Learning Responsible AI dashboard (preview)

Responsible AI requires rigorous engineering. Rigorous engineering, however, can be tedious, manual, and time-consuming without the right tooling and infrastructure. Data scientists need tools to implement responsible AI in practice effectively and efficiently.

The Responsible AI dashboard provides a single interface that makes responsible machine learning engineering efficient and interoperable across the larger model development and assessment lifecycle. The tool brings together several mature Responsible AI tools in the areas of model statistics assessment, data exploration, [machine learning interpretability](https://interpret.ml/), [unfairness assessment](http://fairlearn.org/), [error analysis](https://erroranalysis.ai/), [causal inference](https://github.com/microsoft/EconML), and [counterfactual analysis](https://github.com/interpretml/DiCE) for a holistic assessment and debugging of models and making informed business decisions. With a single command or simple UI wizard, the dashboard addresses the fragmentation issues of multiple tools and enables you to:

1. Evaluate and debug your machine learning models by identifying model errors, diagnosing why those errors are happening, and informing your mitigation steps.
2. Boost your data-driven decision-making abilities by addressing questions such as *“what is the minimum change the end user could apply to their features to get a different outcome from the model?” and/or “what is the causal effect of reducing red meat consumption on diabetes progression?”*
3. Export Responsible AI metadata of your data and models for sharing offline with product and compliance stakeholders.

## Responsible AI dashboard components

The Responsible AI dashboard brings together, in a comprehensive view, various new and pre-existing tools, integrating them with the Azure Machine Learning CLIv2, Python SDKv2 and studio. These tools include:  

1. [Data explorer](concept-data-analysis.md) to understand and explore your dataset distributions and statistics.
2. [Model overview and fairness assessment](concept-fairness-ml.md) to evaluate the performance of your model and evaluate your model’s group fairness issues (how diverse groups of people are impacted by your model’s predictions).
3. [Error Analysis](concept-error-analysis.md) to view and understand the error distributions of your model in a dataset via a decision tree map or a heat map visualization.  
4. [Model interpretability](how-to-machine-learning-interpretability.md) (aggregate/individual feature importance values) to understand you model’s predictions and how those overall and individual predictions are made.
5. [Counterfactual What-If's](concept-counterfactual-analysis.md) to observe how feature perturbations would impact your model predictions and provide you with the closest datapoints with opposing or different model predictions.
6. [Causal analysis](concept-causal-inference.md) to use historical data to view the causal effects of treatment features on the real-world outcome.

Together, these components will enable you to debug machine learning models, while informing your data-driven and model-driven decisions.

:::image type="content" source="./media/concept-responsible-ai-dashboard/dashboard.png" alt-text=" Diagram of Responsible A I dashboard components for model debugging and responsible decision making.":::

### Model debugging

Assessing and debugging machine learning models is critical for model reliability, interpretability, fairness, and compliance. It helps determine how and why AI systems behave the way they do. You can then use this knowledge to improve model performance. Conceptually, model debugging consists of three stages:

- **Identify**, to understand and recognize model errors by addressing the following questions:
  - *What kinds of errors does my model have?*
  - *In what areas are errors most prevalent?*
- **Diagnose**, to explore the reasons behind the identified errors by addressing:
  - *What are the causes of these errors?*
  - *Where should I focus my resources to improve my model?*
- **Mitigate**, to use the identification and diagnosis insights from previous stages to take targeted mitigation steps and address questions such as:
  - *How can I improve my model?*
  - *What social or technical solutions exist for these issues?*

:::image type="content" source="./media/concept-responsible-ai-dashboard/model-debugging.png" alt-text="Diagram of model debugging via responsible A I dashboard with the information in the table below." lightbox= "./media/concept-responsible-ai-dashboard/model-debugging.png":::

Below are the components of the Responsible AI dashboard supporting model debugging:

| Stage | Component | Description |
|-------|-----------|-------------|
| Identify | Error Analysis | The Error Analysis component provides machine learning practitioners with a deeper understanding of model failure distribution and assists you with quickly identifying erroneous cohorts of data. <br><br> The capabilities of this component in the dashboard are founded by [Error Analysis](https://erroranalysis.ai/) capabilities on generating model error profiles.|
| Identify | Fairness Analysis | The Fairness component assesses how different groups, defined in terms of sensitive attributes such as sex, race, age, etc., are affected by your model predictions and how the observed disparities may be mitigated. It evaluates the performance of your model by exploring the distribution of your prediction values and the values of your model performance metrics across different sensitive subgroups. The capabilities of this component in the dashboard are founded by [Fairlearn](https://fairlearn.org/) capabilities on generating model fairness assessments.  |
| Identify | Model Overview | The Model Statistics component aggregates various model assessment metrics, showing a high-level view of model prediction distribution for better investigation of its performance. It also enables group fairness assessment, highlighting the breakdown of model performance across different sensitive groups. |
| Diagnose | Data Explorer | The Data Explorer component helps to visualize datasets based on predicted and actual outcomes, error groups, and specific features. This helps to identify issues of over- and underrepresentation and to see how data is clustered in the dataset.  |
| Diagnose | Model Interpretability | The Interpretability component generates human-understandable explanations of the predictions of a machine learning model. It provides multiple views into a model’s behavior: global explanations (for example, which features affect the overall behavior of a loan allocation model) and local explanations (for example, why an applicant’s loan application was approved or rejected). <br><br> The capabilities of this component in the dashboard are founded by [InterpretML](https://interpret.ml/) capabilities on generating model explanations. |
| Diagnose | Counterfactual Analysis and What-If| The Counterfactual Analysis and what-if component consists of two functionalities for better error diagnosis: <br> - Generating a set of examples with minimal changes to a given point such that they change the model's prediction (showing the closest datapoints with opposite model precisions). <br> - Enabling interactive and custom what-if perturbations for individual data points to understand how the model reacts to feature changes. <br> <br> The capabilities of this component in the dashboard are founded by the [DiCE](https://github.com/interpretml/DiCE) package, which provides this information by showing feature-perturbed versions of the same datapoint, which would have received a different model prediction (for example, Taylor would have received the loan approval prediction if their yearly income was higher by $10,000).  |

Mitigation steps are available via stand-alone tools such as Fairlearn (for unfairness mitigation).

### Responsible decision-making

Decision-making is one of the biggest promises of machine learning. The Responsible AI dashboard helps you inform your model-driven and data-driven business decisions.

- Data-driven insights to further understand heterogeneous treatment effects on an outcome, using historic data only. For example, *“how would a medicine impact a patient’s blood pressure?"*. Such insights are provided through the "Causal Inference" component of the dashboard.
- Model-driven insights, to answer end-users’ questions such as *“what can I do to get a different outcome from your AI next time?”* to inform their actions. Such insights are provided to data scientists through the "Counterfactual Analysis and What-If" component described above.

:::image type="content" source="./media/concept-responsible-ai-dashboard/decision-making.png" alt-text="Responsible A I dashboard capabilities for responsible business decision making.":::

Exploratory data analysis, counterfactual analysis, and causal inference capabilities can assist you make informed model-driven and data-driven decisions responsibly.

Below are the components of the Responsible AI dashboard supporting responsible decision making:

- **Data Explorer**
    - The component could be reused here to understand data distributions and identify over- and underrepresentation. Data exploration is a critical part of decision making as one can conclude that it isn't feasible to make informed decisions about a cohort that is underrepresented within data.
- **Causal Inference**
    -  The Causal Inference component estimates how a real-world outcome changes in the presence of an intervention. It also helps to construct promising interventions by simulating different feature responses to various interventions and creating rules to determine which population cohorts would benefit from a particular intervention. Collectively, these functionalities allow you to apply new policies and effect real-world change.
    - The capabilities of this component are founded by [EconML](https://github.com/Microsoft/EconML) package, which estimates heterogeneous treatment effects from observational data via machine learning.
- **Counterfactual Analysis**
    - The Counterfactual Analysis component described above could be reused here to help data scientists generate a set of similar datapoints with opposite prediction outcomes (showing minimum changes applied to a datapoint's features leading to opposite model predictions). Providing counterfactual examples to the end users inform their perspective, educating them on how they can take action to get the desired outcome from the model in the future.
    - The capabilities of this component are founded by [DiCE](https://github.com/interpretml/DiCE) package.

## Why should you use the Responsible AI dashboard?

While Responsible AI is about rigorous engineering, its operationalization is tedious, manual, and time-consuming without the right tooling and infrastructure. There are minimal instructions, and few disjointed frameworks and tools available to empower data scientists to explore and evaluate their models holistically.  

While progress has been made on individual tools for specific areas of Responsible AI, data scientists often need to use various such tools together, to holistically evaluate their models and data. For example, if a data scientist discovers a fairness issue with one tool, they then need to jump to a different tool to understand what data or model factors lie at the root of the issue before taking any steps on mitigation. This highly challenging process is further complicated by the following reasons. First, there's no central location to discover and learn about the tools, extending the time it takes to research and learn new techniques. Second, the different tools don't exactly communicate with each other. Data scientists must wrangle the datasets, models, and other metadata as they pass them between the different tools. Third, the metrics and visualizations aren't easily comparable, and the results are hard to share.

The Responsible AI dashboard is the first comprehensive tool, bringing together fragmented experiences under one roof, enabling you to seamlessly onboard to a single customizable framework for model debugging and data-driven decision making.

## How to customize the Responsible AI dashboard

The Responsible AI dashboard’s strength lies in its customizability. It empowers users to design tailored, end-to-end model debugging and decision-making workflows that address their particular needs. Need some inspiration? Here are some examples of how Toolbox components can be put together to analyze scenarios in diverse ways:

| Responsible AI Dashboard Flow | Use Case |
|-------------------------------|----------|
| Model Overview -> Error Analysis -> Data Explorer | To identify model errors and diagnose them by understanding the underlying data distribution |
| Model Overview -> Fairness Assessment -> Data Explorer | To identify model fairness issues and diagnose them by understanding the underlying data distribution |
| Model Overview -> Error Analysis -> Counterfactuals Analysis and What-If  | To diagnose errors in individual instances with counterfactual analysis (minimum change to lead to a different model prediction) |
| Model Overview -> Data Explorer | To understand the root cause of errors and fairness issues introduced via data imbalances or lack of representation of a particular data cohort |
| Model Overview -> Interpretability | To diagnose model errors through understanding how the model has made its predictions |
| Data Explorer -> Causal Inference  | To distinguish between correlations and causations in the data or decide the best treatments to apply to see a positive outcome |
| Interpretability -> Causal Inference | To learn whether the factors that model has used for decision making has any causal effect on the real-world outcome. |
| Data Explorer -> Counterfactuals Analysis and What-If | To address customer questions about what they can do next time to get a different outcome from an AI. |

## Who should use the Responsible AI dashboard?

The Responsible AI dashboard, and its corresponding [Responsible AI scorecard](how-to-responsible-ai-scorecard.md), could be incorporated by the following personas to build trust with AI systems.

- Machine learning model engineers and data scientists who are interested in debugging and improving their machine learning models pre-deployment.
-Machine learning model engineers and data scientists who are interested in sharing their model health records with product manager and business stakeholders to build trust and receive deployment permissions.
- Product managers and business stakeholders who are reviewing machine learning models pre-deployment.
- Risk officers who are reviewing machine learning models for understanding fairness and reliability issues.
- Providers of solution to end users who would like to explain model decisions to the end users.
- Business stakeholders who need to review machine learning models with regulators and auditors.

## Supported machine learning models and scenarios

We support scikit-learn models for counterfactual generation and explanations. The scikit-learn models should implement `predict()/predict_proba()` methods or the model should be wrapped within a class, which implements `predict()/predict_proba()` methods.

Currently, we support counterfactual generation and explanations for tabular datasets having numerical and categorical data types. Counterfactual generation and explanations are supported for free formed text data, images and historical data.

## Next steps

- Learn how to generate the Responsible AI dashboard via [CLIv2 and SDKv2](how-to-responsible-ai-dashboard-sdk-cli.md) or [studio UI ](how-to-responsible-ai-dashboard-ui.md)
- Learn how to generate a [Responsible AI scorecard](how-to-responsible-ai-scorecard.md)) based on the insights observed in the Responsible AI dashboard.
