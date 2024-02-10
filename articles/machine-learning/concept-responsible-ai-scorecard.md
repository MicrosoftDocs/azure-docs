---
title: Share Responsible AI insights and make data-driven decisions with Azure Machine Learning Responsible AI scorecard
titleSuffix: Azure Machine Learning
description: Learn about how to use the Responsible AI scorecard to share responsible AI insights from your machine learning models and make data-driven decisions with non-technical and technical stakeholders.
services: machine-learning
ms.service: machine-learning
ms.subservice: rai
ms.topic:  conceptual
ms.author: mesameki
author: mesameki
ms.reviewer: lagayhar
ms.date: 11/09/2022
ms.custom: responsible-ml, build-2023, build-2023-dataai
---

# Share Responsible AI insights using the Responsible AI scorecard (preview)

Our Responsible AI dashboard is designed for machine learning professionals and data scientists to explore and evaluate model insights and inform their data-driven decisions. While it can help you implement Responsible AI practically in your machine learning lifecycle, there are some needs left unaddressed:

- There often exists a gap between the technical Responsible AI tools (designed for machine-learning professionals) and the ethical, regulatory, and business requirements that define the production environment.
- While an end-to-end machine learning life cycle includes both technical and non-technical stakeholders in the loop, there's little support to enable an effective multi-stakeholder alignment, helping technical experts get timely feedback and direction from the non-technical stakeholders.
- AI regulations make it essential to be able to share model and data insights with auditors and risk officers for auditability purposes.

One of the biggest benefits of using the Azure Machine Learning ecosystem is related to the archival of model and data insights in the Azure Machine Learning Run History (for quick reference in future). As a part of that infrastructure and to accompany machine learning models and their corresponding Responsible AI dashboards, we introduce the Responsible AI scorecard to empower ML professionals to generate and share their data and model health records easily.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Who should use a Responsible AI scorecard?

- If you're a data scientist or a machine learning professional, after training your model and generating its corresponding Responsible AI dashboard(s) for assessment and decision-making purposes, you can extract those learnings via our PDF scorecard and share the report easily with your technical and non-technical stakeholders to build trust and gain their approval for deployment.  

- If you're a product manager, business leader, or an accountable stakeholder on an AI product, you can pass your desired model performance and fairness target values such as your target accuracy, target error rate, etc., to your data science team, asking them to generate this scorecard with respect to your identified target values and whether your model meets them. That can provide guidance into whether the model should be deployed or further improved.

## Next steps

- Learn how to generate the Responsible AI dashboard and scorecard via [CLI and SDK](how-to-responsible-ai-insights-sdk-cli.md) or [Azure Machine Learning studio UI](how-to-responsible-ai-insights-ui.md).
- Learn more about how the Responsible AI dashboard and scorecard in this [tech community blog post](https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/responsible-ai-dashboard-and-scorecard-in-azure-machine-learning/ba-p/3391068).
