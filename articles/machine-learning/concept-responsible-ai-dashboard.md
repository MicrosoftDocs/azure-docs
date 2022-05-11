---
title: Assess AI systems and make data-driven decisions with Azure Machine Learning Responsible AI dashboard
titleSuffix: Azure Machine Learning
description: 
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: mesameki
author: mesameki
ms.date: 05/10/2022
ms.custom: responsible-ml
---

# Assess AI systems and make data-driven decisions with Azure Machine Learning Responsible AI dashboard

Responsible AI requires rigorous engineering. Rigorous engineering, however, can be tedious, manual, and time-consuming without the right tooling and infrastructure. Data scientists need tools to implement responsible AI in practice effectively and efficiently.

The Responsible AI dashboard provides a single interface that makes responsible machine learning engineering efficient and interoperable across the larger model development and assessment lifecycle. The tool brings together several mature Responsible AI tools in the areas of model statistics assessment, data exploration, [machine learning interpretability](https://interpret.ml/), [unfairness assessment](http://fairlearn.org/), [error analysis](https://erroranalysis.ai/), [causal inference](https://github.com/microsoft/EconML), and [counterfactual analysis](https://github.com/interpretml/DiCE) for a holistic assessment and debugging of models and making informed business decisions. With a single command or simple UI wizard, the dashboard addresses the fragmentation issues of multiple tools and enables you to:

1. Evaluate and debug your machine learning models by identifying model errors, diagnosing why those errors are happening, and informing your mitigation steps.
2. Boost your data-driven decision-making abilities by addressing questions such as *“what is the minimum change the end user could apply to his/her features to get a different outcome from the model?” and/or “what is the causal effect of reducing red meat consumption on diabetes progression?”*
3. Export Responsible AI metadata of your data and models for sharing offline with product and compliance stakeholders.

## Responsible AI dashboard components

The Responsible AI dashboard brings together, in a comprehensive view, a variety of new and pre-existing tools, integrating them with the Azure Machine Learning CLIv2, Python SDKv2 and studio. These tools include:  

1. [Data explorer](concept-data-analysis.md) to understand and explore your dataset distributions and statistics. 
2. [Model overview and fairness assessment](concept-fairness-ml.md) to evaluate the performance of your model and evaluate your model’s group fairness issues (how diverse groups of people are impacted by your model’s predictions). 
3. [Error Analysis](concept-error-analysis.md) to view and understand the error distributions of your model in a dataset via a decision tree map or a heat map visualization.  
4. [Model interpretability](concept-interpretability-ml.md) (aggregate/individual feature importance values) to understand you model’s predictions and how those overall and individual predictions are made. 
5. [Counterfactual What-If's](concept-counterfactual-analysis.md) to observe how feature perturbations would impact your model predictions and provide you with closest datapoints with oppositive or different model predictions. 
6. [Causal analysis](concept-causal-inference.md) to use historical data to view the causal effects of treatment features on the real-world outcome. 

Together, these components will enable you to debug machine learning models, while informing your data-driven and model-driven decisions. 

:::image type="content" source="./media/how-to-responsible-ai-dashboard/dashboard.png" alt-text="Responsible AI dashboard components for model debugging and responsible decision making.":::

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

:::image type="content" source="./media/how-to-responsible-ai-dashboard/model-debugging.png" alt-text="Responsible AI dashboard capabilities for debugging machine learning models. The capabilities can assist you in two specific stages of error identification and diagnosis so that you can take informed error mitigation decisions.":::


Below are the components of the Responsible AI dashboard supporting model debugging:

| Stage | Component | Description |
|-------|-----------|-------------|
| Identify | Error Analysis | The Error Analysis component provides machine learning practitioners with a deeper understanding of model failure distribution and assists you with quickly identifying erroneous cohorts of data. <br><br> The capabilities of this component in the dashboard are founded by [Error Analysis](https://erroranalysis.ai/) capabilities on generating model error profiles.|
| Identify | Fairness Analysis | The Fairness component assess how different groups, defined in terms of sensitive attributes such as sex, race, age, etc., are affected by your model predictions and how the observed disparities may be mitigated. It evaluates the performance of your model by exploring the distribution of your prediction values and the values of your model performance metrics across different sensitive subgroups. The capabilities of this component in the dashboard are founded by [Fairlearn](https://fairlearn.org/) capabilities on generating model fairness assessments.  |
| Identify | Model Overview | The Model Statistics component aggregates a variety of model assessment metrics, showing a high-level view of model prediction distribution for better investigation of its performance. It also enables group fairness assessment, highlighting the breakdown of model performance across different sensitive groups. |
| Diagnose | Data Explorer | The Data Explorer component helps to visualize datasets based on predicted and actual outcomes, error groups, and specific features. This helps to identify issues of over- and underrepresentation and to see how data is clustered in the dataset.  |
| Diagnose | Model Interpretability | The Interpretability component generates human-understandable explanations of the predictions of a machine learning model. It provides multiple views into a model’s behavior: global explanations (for example, which features affect the overall behavior of a loan allocation model) and local explanations (for example, why an applicant’s loan application was approved or rejected). <br><br> The capabilities of this component in the dashboard are founded by [InterpretML](https://interpret.ml/) capabilities on generating model explanations. |
| Diagnose | Counterfactual Analysis and What-If| The Counterfactual Analysis and what-if component consists of two functionalities for better error diagnosis: <br> - Generating a set of examples with minimal changes to a given point such that they change the model's prediction (i.e. showing the closest datapoints with opposite model precisions). <br> - Enabling interactive and custom what-if perturbations for individual data points to understand how the model reacts to feature changes. <br> <br> The capabilities of this component in the dashboard are founded by the [DiCE](https://github.com/interpretml/DiCE) package, which provides this information by showing feature-perturbed versions of the same datapoint which would have received a different model prediction (e.g., Taylor would have received the loan approval prediction if his/her yearly income was higher by $10,000).  |

Mitigation steps are available via stand-alone tools such as Fairlearn (for unfairness mitigation).


:::image type="content" source="./media/how-to-responsible-ai-dashboard/decision-making.png" alt-text="Responsible AI dashboard capabilities for responsible business decision making. Exploratory data analysis, counterfactual analysis, and causal inference capabilities can assist you make informed model-driven and data-driven decisions responsibly.":::