---
title: Experimentation in Azure App Configuration
description: This document introduces experimentation in Azure App Configuration.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.custom:
  - build-2024
ms.topic: conceptual
ms.date: 11/12/2024
ms.collection: ce-skilling-ai-copilot
---

# Experimentation (preview)

> [!NOTE]
> We appreciate the feedback we have received during the preview phases of Experimentation on Azure App Configuration, and our teams are using it to make updates to the feature. During this time, Experimentation Workspace will be temporarily unavailable.

Experimentation is the process of systematically testing hypotheses or changes to improve user experience or software functionality. This definition also holds true for most scientific fields including technology, where all experiments have four common steps:

- **Developing a hypothesis** to document the purpose of this experiment,
- **Outlining a method** of carrying out the experiment including setup, what is measured and how,
- **Observation** of the results measured by the metrics defined in the previous step,
- **Drawing a conclusion** regarding whether the hypothesis was validated or invalidated.

### Concepts related to experimentation

- **Variant Feature Flags**: Represent different versions or configurations of a feature. In an experiment, the variant feature flags are compared in relevance to the metrics you're interested in and the traffic allocated for the application audience.

- **Telemetry**: Telemetry is the data for the variations of a feature and the related metrics to evaluate the feature.

- **A/B testing**: A/B testing, also known as experimentation, is an industry-standard method for evaluating the impact of potential changes within a technology stack.

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

### Release defense

Objective: Ensure smooth transitions and maintain or improve key metrics with each release.

Approach: Employ experimentation to gradually roll out new features, monitor performance metrics, and collect feedback for iterative improvements.

Benefits:

* Minimizes the risk of widespread issues by using guardrail metrics to detect and address problems early in the rollout.
* Helps maintain or improve key performance and user satisfaction metrics by making informed decisions based on real-time data.
 
### Test hypotheses

Objective: Validate assumptions and hypotheses to make informed decisions about product features, user behaviors, or business strategies.

Approach: Use experimentation to test specific hypotheses by creating different feature versions or scenarios, then analyze user interactions and performance metrics to determine outcomes.

Benefits:

* Provides evidence-based insights that reduce uncertainty and guide strategic decision-making.
* Enables faster iteration and innovation by confirming or refuting hypotheses with real user data.
* Enhances product development by focusing efforts on ideas that are proven to work, ultimately leading to more successful and user-aligned features.
  
### A/B testing

Objective: Optimize business metrics by comparing different UX variations and determining the most effective design.

Approach: Conduct A/B tests using experimentation with different user experiences, measure user interactions, and analyze performance metrics.

Benefits:
* Improves user experience by implementing UX changes based on empirical evidence.
* Increases conversion rates, engagement levels, and overall effectiveness of digital products or services.
 
### For intelligent applications (for example, AI-based features)

Objective: Accelerate Generative AI (Gen AI) adoption and optimize AI models and use cases through rapid experimentation.

Approach: Use experimentation to iterate quickly on AI models, test different scenarios, and determine effective approaches.

Benefits:

* Enhances agility in adapting AI solutions to evolving user needs and market trends.
* Facilitates understanding of the most effective approaches for scaling AI initiatives.
* Improves accuracy and performance of AI models based on real-world data and feedback.
 
### Personalization and targeting experiments

Objective: Deliver personalized content and experiences tailored to user preferences and behaviors.

Approach: Leverage experimentation to test personalized content, measure engagement, and iterate on personalization strategies.

Benefits:

* Increases user engagement, conversion rates, and customer loyalty through relevant and personalized experiences.
* Drives revenue growth and customer retention by targeting audiences with tailored messages and offers.
 
### Performance optimization experiments

Objective: Improve application performance and user experience through performance optimization experiments.

Approach: Conduct experiments to test performance enhancements, measure key metrics, and implement successful optimizations.

Benefits:

* Enhances application scalability, reliability, and responsiveness through proactive performance improvements.
* Optimizes resource utilization and infrastructure costs by implementing efficient optimizations.
