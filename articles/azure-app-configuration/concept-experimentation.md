---
title: Experimentation in Azure App Configuration
description: Experimentation in Azure App Configuration
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.custom:
  - build-2024
ms.topic: conceptual
ms.date: 05/08/2024
---

# Experimentation (preview)

Experimentation is the process of systematically testing hypotheses or changes to improve user experience or software functionality. This definition also holds true for most scientific fields including technology, where all experiments have four common steps:

- **Developing a hypothesis** to document the purpose of this experiment,
- **Outlining a method** of carrying out the experiment including setup, what is measured and how,
- **Observation** of the results measured by the metrics defined in the previous step,
- **Drawing a conclusion** regarding whether the hypothesis was validated or invalidated.

[Check this video](https://aka.ms/eshopSplitDemo) for a quick demonstration of Experimentation in App Configuration, highlighting the user experience optimization use case to boost your business metrics.

## Experimentation in Azure App Configuration (preview)

In Azure App Configuration, the experimentation feature allows developers to easily test different variants of a feature and monitor the impact at the feature-level. Once configured, users are able to analyze new features, compare different variants of a feature, and promptly assess relevant metrics for new product changes. This capability empowers development teams with measurable insights, facilitating quicker and safer product deployments. Microsoft partners with Split Software to deliver the experimentation feature in Azure App Configuration. The Split Experimentation Workspace (preview) is a [Azure Native ISV resource](../partner-solutions/split-experimentation/index.yml) for the integration between Microsoft and Split Software.

High-level data flow for experimentation in Azure.

:::image type="content" source="./media/concept-experimentation/experimentation-data-flow.png" alt-text="Diagram of data flow for experimentation in Azure." lightbox="./media/concept-experimentation/experimentation-data-flow.png":::

To start an experimentation, first you need to identify the feature and its variations that you want to experiment on. Next are the metrics that form the basis of the feature evaluation. To get started on your first experiment in Azure, follow the steps outlined in this [tutorial](./run-experiments-aspnet-core.md).

### Concepts related to experimentation

- **Variant Feature Flags**: Represent different versions or configurations of a feature. In an experiment, the variant feature flags are compared in relevance to the metrics you're interested in and the traffic allocated for the application audience.

- **Telemetry**: Telemetry is the data for the variations of a feature and the related metrics to evaluate the feature. For the setup in Azure, the feature flag evaluation/assignment data flows to the telemetry provider. Application Insights is the telemetry provider for the experimentation setup. Data for the defined metrics also flow to the same Application Insights instance.

- **A/B testing**: A/B testing, also known as split testing, is an industry-standard method for evaluating the impact of potential changes within a technology stack.

- **Sampling size**: Sampling size is the size of the sample of users under experiment. It's the number of events sent for any variation of the feature that you're experimenting on.

- **Minimum sampling size**: is the minimum number of events required per variation of the feature for the experiment to show you statistically significant results. The larger the sample size, better the statistical significance of the experiment's results.

Consider the following example: you want to see if customers of your e-commerce website are more likely to click the checkout button if it's yellow in color (variant A) or blue in color (variant B). To set up this comparison, you're likely to divide traffic between the two variants of the feature flag, and use number of clicks as a metric to measure their performance. It's unlikely that all your features are as simple to measure and immediately evaluate, and that is where experimentation comes in. Running an experiment involves setting up a timeline for this process of comparing the performance of each variant relevant to the metrics you're interested in. The terms "A/B testing" and "experimentation" are often used interchangeably, where experimentation is essentially an extended A/B test where you're systematically testing hypotheses.

### Setting up your experiment

Before starting, consider the following questions in your hypothesis discovery stage:
What questions are you trying to answer by running an experiment? What should you run an experiment on? Why? Where do you even start? What are some strategies to follow according to your business needs? Will this experiment help you make immediate improvements to the performance of your application or to your business?

Identify what you hope to achieve by running an experiment before a full release, you should document your plan at this stage. What are the variations of the feature or functionality that you want to experiment on? What are some metrics you're interested in? What events of user or system interaction could be used to capture data to fuel these metrics for measure?

Your experiment is only as good as the data you collect for it. Before you start the experiment, you must determine which variant you intend to use as the control (baseline variant) and which one you intend to see changes in (comparison variant).

### Drawing a conclusion from experiment

Drawing a conclusion (or multiple conclusions if needed) is the final stage of your experimentation cycle. You can check the experiment results, which show the outcome and impact of comparison variant against the control variant. The results also show their statistical significance. Statsig measure does depend on the telemetry data and sample size.

The results help you to conclude the learnings and outcomes into actionable items that you can immediately implement into production. However, experimentation is a continuous process. Begin new experiments to continuously improve your product.

## Scenarios for using experimentation

- **Intelligent applications (e.g., AI-based features)**
Accelerate General AI (Gen AI) adoption and optimize AI models and use cases through rapid experimentation. Use Experimentation to iterate quickly on AI models, test different scenarios, and determine effective approaches.
It helps enhance agility in adapting AI solutions to evolving user needs and market trends, and facilitate understanding of the most effective approaches for scaling AI initiatives.

- **CI, CD and continuous experimentation (Gradual feature rollouts and version updates)**
Ensure seamless transitions and maintain or improve key metrics with each version update while managing feature releases. Utilize experimentation to gradually roll out new features to subsets of users using feature flags, monitor performance metrics, and collect feedback for iterative improvements.
It's beneficial to reduce the risk of introducing bugs or performance issues to the entire user base. It enables data-driven decision-making during version rollouts and feature flag management, leading to improved product quality and user satisfaction.

- **User experience optimization (UI A/B testing)**
Optimize business metrics by comparing different UI variations and determining the most effective design. Conduct A/B tests using experimentation to test UI elements, measure user interactions, and analyze performance metrics.
The best return here's improved user experience by implementing UI changes based on empirical evidence.

- **Personalization and targeting experiments**
Deliver personalized content and experiences tailored to user preferences and behaviors. Use experimentation to test personalized content, measure engagement, and iterate on personalization strategies.
Results are increased user engagement, conversion rates, and customer loyalty through relevant and personalized experiences. These results, in turn drive revenue growth and customer retention by targeting audiences with tailored messages and offers.

- **Performance optimization experiments**
Improve application performance and provide an efficient user experience through performance optimization experiments. Conduct experiments to test performance enhancements, measure key metrics, and implement successful optimizations.
Here, experimentation enhances application scalability, reliability, and responsiveness through proactive performance improvements. It optimizes resource utilization and infrastructure costs by implementing efficient optimizations.

## Experiment operations

- **Create experiment**: Experiment can be created on a variant feature flag emitting telemetry. Once an experiment is created, an experiment version is created with the experiment as well. Any further edits to the feature flag result in a new experiment version getting created for that experiment.

- **Archive experiment**: Archiving an experiment puts it in an archived state. While an experiment is archived, no calculations are performed on the experiment. You can always restore the experiment later to resume the calculations and go back to active state.

- **Recover experiment**: Recovering an experiment puts an archived experiment in an active state, and calculations are resumed for the experiment.

- **Delete experiment**: Deleting an experiment deletes the experiment in Split and all of its related data. It's an irreversible operation so there's no restore after deleting.

- **Check experiment results**: Checking the results of an active experiment allows you to see how each variant in the experiment is performing.

## Access requirements for experiment operations

The following sections detail the roles required to perform experiment-related operations with Microsoft Entra ID.

### Set up experimentation

To set up experimentation with the required resources, including the Split Experimentation Workspace, either the Azure subscription Owner role or the combination of subscription Contributor and User Access Administrator roles is required.

### Create or update experiment

To create, update, archive, or delete an experiment you would need App Configuration Data Owner role on the App Configuration store. It also requires the role of ExperimentationDataOwner in the Enterprise app managing the data access to the connected Split Experimentation Workspace.

### Read experiment results

To check experiments, their versions, and results, you would need App Configuration Data Reader role on the App Configuration store. It also requires the role of an ExperimentationDataReader or an ExperimentationDataOwner in the Enterprise app managing the data access to the connected Split Experimentation Workspace.

## Billing considerations and limits

App Configuration doesn't bill specifically for experiments. Experimentation is provided via an integration with [Split Experimentation Workspace (preview)](../partner-solutions/split-experimentation/index.yml). Check the pricing plan <!--link to be updated --> for Split Experimentation for Azure App Configuration.

Minimum sample size required for Split experimentation is 30 per variant. An experiment is required to have the minimum sample size to get the experiment results or results show "No data" in the **outcome**.

## Next steps

> [!div class="nextstepaction"]
> [Run experiments with variant feature flags](./run-experiments-aspnet-core.md)

> [!div class="nextstepaction"]
> [Split Experimentation quickstart](../partner-solutions/split-experimentation/create.md)
