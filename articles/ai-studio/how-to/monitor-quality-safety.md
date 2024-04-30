---
title: Monitor quality and token usage of deployed prompt flow applications
titleSuffix: Azure AI Studio
description: Learn how to monitor quality and token usage of deployed prompt flow applications with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 04/24/2024
ms.reviewer: alehughes
reviewer: ahughes-msft
ms.author: mopeakande
author: msakande

---

# Monitor quality and token usage of deployed prompt flow applications 

Monitoring applications that are deployed to production is an essential part of the generative AI application lifecycle. Changes in data and consumer behavior can influence your application over time, resulting in outdated systems that negatively affect business outcomes and expose organizations to compliance, economic, and reputation risks. 

Azure AI monitoring for generative AI applications enables you to monitor your applications in production for token usage, generation quality, and operational metrics.

Capabilities and integrations for monitoring a prompt flow deployment include: 
- Collect production inference data using the [data collector](https://learn.microsoft.com/en-us/azure/machine-learning/concept-data-collection?view=azureml-api-2).
- Apply Responsible AI evaluation metrics such as groundedness, coherence, fluency, and relevance, which are interoperable with prompt flow evaluation metrics.
- Monitor prompt, completion, and total token usage across each model deployment in your prompt flow.
- Monitor operational metrics, such as request count, latency, and error rate.
- Preconfigured alerts and defaults to run monitoring on a recurring basis.
- Consume data visualizations and configure advanced behavior in Azure AI Studio.

## screenshots

:::image type="content" source="../media/deploy-monitor/monitor/column-map-advanced-options.png" alt-text="Screenshot of advanced options when mapping columns for monitoring metrics." lightbox = "../media/deploy-monitor/monitor/column-map-advanced-options.png":::

:::image type="content" source="../media/deploy-monitor/monitor/deployment-operational-tab.png" alt-text="Screenshot of the operational tab for the deployment." lightbox = "../media/deploy-monitor/monitor/deployment-operational-tab.png":::

:::image type="content" source="../media/deploy-monitor/monitor/deployment-page.png" alt-text="Screenshot of the deployment page." lightbox = "../media/deploy-monitor/monitor/deployment-page.png":::

:::image type="content" source="../media/deploy-monitor/monitor/deployment-page-highlight-monitoring.png" alt-text="Screenshot of the deployment page highlighting generation quality monitoring." lightbox = "../media/deploy-monitor/monitor/deployment-page-highlight-monitoring.png":::

:::image type="content" source="../media/deploy-monitor/monitor/deployment-with-data-collection-enabled.png" alt-text="Screenshot of the review page when setting up the deployment with data collectin enabled." lightbox = "../media/deploy-monitor/monitor/deployment-with-data-collection-enabled.png":::

:::image type="content" source="../media/deploy-monitor/monitor/generation-quality-trendline.png" alt-text="Screenshot showing the generation quality trendline on the deployment's monitoring page." lightbox = "../media/deploy-monitor/monitor/generation-quality-trendline.png":::

:::image type="content" source="../media/deploy-monitor/monitor/generation-quality-tracing-information.png" alt-text="Screenshot showing the trace button for the generation quality." lightbox = "../media/deploy-monitor/monitor/generation-quality-tracing-information.png":::

:::image type="content" source="../media/deploy-monitor/monitor/monitor-token-usage.png" alt-text="Screenshot showing the token usage on the deployment's monitoring page." lightbox = "../media/deploy-monitor/monitor/monitor-token-usage.png":::

:::image type="content" source="../media/deploy-monitor/monitor/trace-information.png" alt-text="Screenshot showing the trace information." lightbox = "../media/deploy-monitor/monitor/trace-information.png":::

## Set up monitoring for prompt flow 

Follow these steps to set up monitoring for your prompt flow deployment:

1. Confirm your flow runs successfully, and that the required inputs and outputs are configured for the [metrics you want to assess](#evaluation-metrics). The minimum required parameters of collecting only inputs and outputs provide only two metrics: coherence and fluency. You must configure your flow according to the [flow and metric configuration requirements](#flow-and-metric-configuration-requirements).

    :::image type="content" source="../media/deploy-monitor/monitor/user-experience.png" alt-text="Screenshot of prompt flow editor with deploy button." lightbox = "../media/deploy-monitor/monitor/user-experience.png":::

1. Deploy your flow. By default, both inferencing data collection and application insights are enabled automatically. These are required for the creation of your monitor. 

    :::image type="content" source="../media/deploy-monitor/monitor/basic-settings.png" alt-text="Screenshot of basic settings in the deployment wizard." lightbox = "../media/deploy-monitor/monitor/basic-settings.png":::

    :::image type="content" source="../media/deploy-monitor/monitor/basic-settings-with-connections-specified.png" alt-text="Screenshot of basic settings with connections specified in the deployment wizard." lightbox = "../media/deploy-monitor/monitor/basic-settings-with-connections-specified.png":::

1. By default, all outputs of your deployment are collected using Azure AI's Model Data Collector. As an optional step, you can enter the advanced settings to confirm that your desired columns (for example, context of ground truth) are included in the endpoint response. 

    Your deployed flow needs to be configured in the following way:  
    - Flow inputs & outputs: You need to name your flow outputs appropriately and remember these column names when creating your monitor. In this article, we use the following settings: 
      - Inputs (required): "prompt" 
      - Outputs (required): "completion" 
      - Outputs (optional): "context" and/or "ground truth" 

    - Data collection: The **inferencing data collection** toggle must be enabled using Model Data Collector 

    - Outputs: In the prompt flow deployment wizard, confirm the required outputs are selected (such as completion, context, and ground_truth) that meet your metric configuration requirements.

1. Test your deployment in the deployment **Test** tab. 

    :::image type="content" source="../media/deploy-monitor/monitor/test-deploy.png" alt-text="Screenshot of the deployment test page." lightbox = "../media/deploy-monitor/monitor/test-deploy.png":::

    > [!NOTE]
    > Monitoring requires the endpoint to be used at least 10 times to collect enough data to provide insights. If you'd like to test sooner, manually send about 50 rows in the 'test' tab before running the monitor.

1. Create your monitor by either enabling from the deployment details page, or the **Monitoring** tab.

    :::image type="content" source="../media/deploy-monitor/monitor/enable-monitoring.png" alt-text="Screenshot of the button to enable monitoring." lightbox = "../media/deploy-monitor/monitor/enable-monitoring.png":::

1. Ensure your columns are mapped from your flow as defined in the previous requirements. 

    :::image type="content" source="../media/deploy-monitor/monitor/column-map.png" alt-text="Screenshot of columns mapped for monitoring metrics." lightbox = "../media/deploy-monitor/monitor/column-map.png":::

1. View your monitor in the **Monitor** tab.  

    :::image type="content" source="../media/deploy-monitor/monitor/monitor-metrics.png" alt-text="Screenshot of the monitoring result metrics." lightbox = "../media/deploy-monitor/monitor/monitor-metrics.png":::

By default, operational metrics such as requests per minute and request latency show up. The default safety and quality monitoring signal are configured with a 10% sample rate and run on your default workspace Azure OpenAI connection. 

Your monitor is created with default settings:
- 10% sample rate
- 4/5 (thresholds / recurrence)
- Weekly recurrence on Monday mornings
- Alerts are delivered to the inbox of the person that triggered the monitor.

To view more details about your monitoring metrics, you can follow the link to navigate to monitoring in Azure Machine Learning studio, which is a separate studio that allows for more customizations. 


## Evaluation metrics 

Metrics are generated by the following state-of-the-art GPT language models configured with specific evaluation instructions (prompt templates) which act as evaluator models for sequence-to-sequence tasks. This technique has strong empirical results and high correlation with human judgment when compared to standard generative AI evaluation metrics. For more information about prompt flow evaluation, see [Submit bulk test and evaluate a flow](./flow-bulk-test-evaluation.md) and [evaluation and monitoring metrics for generative AI](../concepts/evaluation-metrics-built-in.md).

These GPT models are supported with monitoring and configured as your Azure OpenAI resource: 

- GPT-3.5 Turbo 
- GPT-4 
- GPT-4-32k 

The following metrics are supported for monitoring:

| Metric       | Description |
|--------------|-------------|
| Groundedness | Measures how well the model's generated answers align with information from the source data (user-defined context.) |
| Relevance    | Measures the extent to which the model's generated responses are pertinent and directly related to the given questions. |
| Coherence    | Measures the extent to which the model's generated responses are logically consistent and connected. |
| Fluency      | Measures the grammatical proficiency of a generative AI's predicted answer. |

## Flow and metric configuration requirements 

When creating your flow, you need to ensure your column names are mapped. The following input data column names are used to measure generation safety and quality: 

| Input column name | Definition | Required |
|------|------------|----------|
| Prompt text | The original prompt given (also known as "inputs" or "question") | Required |
| Completion text | The final completion from the API call that is returned (also known as "outputs" or "answer") | Required |
| Context text | Any context data that is sent to the API call, together with original prompt. For example, if you hope to get search results only from certain certified information sources/website, you can define in the evaluation steps. | Optional |

What parameters are configured in your data asset dictates what metrics you can produce, according to this table: 

| Metric       | Prompt  | Completion | Context | Ground truth |
|--------------|---------|------------|---------|--------------|
| Coherence    | Required | Required   | -       | -            |
| Fluency      | Required | Required   | -       | -            |
| Groundedness | Required | Required   | Required| -            |
| Relevance    | Required | Required   | Required| -            |

For more information, see [question answering metric requirements](evaluate-generative-ai-app.md#question-answering-metric-requirements).

## Next steps

- Learn more about what you can do in [Azure AI Studio](../what-is-ai-studio.md)
- Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml)
