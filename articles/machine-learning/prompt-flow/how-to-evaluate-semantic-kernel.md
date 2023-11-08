---
title: Evaluate your Semantic Kernel with Prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Learn how to evaluate Semantic Kernel in Prompt flow with Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: jiaochenlu
ms.author: chenlujiao
ms.reviewer: lagayhar
ms.date: 09/15/2023
---

# Evaluate your Semantic Kernel with Prompt flow (preview)

In the rapidly evolving landscape of AI orchestration, a comprehensive evaluation of your plugins and planners is paramount for optimal performance. This article introduces how to evaluate your **Semantic Kernel** [plugins](/semantic-kernel/ai-orchestration/plugins) and [planners](/semantic-kernel/ai-orchestration/planners) with Prompt flow. Furthermore, you can learn the seamless integration story between Prompt flow and Semantic Kernel.


The integration of Semantic Kernel with Prompt flow is a significant milestone. 
* It allows you to harness the powerful AI orchestration capabilities of Semantic Kernel to enhance the efficiency and effectiveness of your Prompt flow. 
* More importantly, it enables you to utilize Prompt flow's powerful evaluation and experiment management to assess the quality of your Semantic Kernel plugins and planners comprehensively.

## What is Semantic Kernel?

[Semantic Kernel](/semantic-kernel/overview/) is an open-source SDK that lets you easily combine AI services with conventional programming languages like C# and Python. By doing so, you can create AI apps that combine the best of both worlds. It provides plugins and planners, which are powerful tool that makes use of AI capabilities to optimize operations, thereby driving efficiency and accuracy in planning. 

## Using prompt flow for plugin and planner evaluation

As you build plugins and add them to planners, it’s important to make sure they work as intended. This becomes crucial as more plugins are added, increasing the potential for errors.

Previously, testing plugins and planners was a manual, time-consuming process. Until now, you can automate this with Prompt flow.

In our comprehensive updated documentation, we provide guidance step by step:
1. Create a flow with Semantic Kernel.
1. Executing batch tests.
1. Conducting evaluations to quantitatively ascertain the accuracy of your planners and plugins.

### Create a flow with Semantic Kernel

Similar to the integration of Langchain with Prompt flow, Semantic Kernel, which also supports Python, can operate within Prompt flow in the **Python node**.

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/prompt-flow-end-result.png" alt-text="Screenshot of prompt flow with Semantic kernel." lightbox = "./media/how-to-evaluate-semantic-kernel/prompt-flow-end-result.png":::

#### Prerequisites: Setup runtime and connection

> [!IMPORTANT]
> Prior to developing the flow, it's essential to install the [Semantic Kernel package](/semantic-kernel/get-started/quick-start-guide/?toc=%2Fsemantic-kernel%2Ftoc.json&tabs=python) in your runtime environment for executor. 

To learn more, see [Customize environment for runtime](./how-to-customize-environment-runtime.md) for guidance.

> [!IMPORTANT]
> The approach to consume OpenAI or Azure OpenAI in Semantic Kernel is to obtain the keys you have specified in environment variables or stored in a `.env` file.

In prompt flow, you need to use **Connection** to store the keys. You can convert these keys from environment variables to key-values in a custom connection in Prompt flow. 

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/custom-connection-for-semantic-kernel.png" alt-text="Screenshot of custom connection." lightbox = "./media/how-to-evaluate-semantic-kernel/custom-connection-for-semantic-kernel.png":::

You can then utilize this custom connection to invoke your OpenAI or Azure OpenAI model within the flow.


#### Create and develop a flow
Once the setup is complete, you can conveniently convert your existing Semantic Kernel planner to a Prompt flow by following the steps below:
1. Create a standard flow.
1. Select a runtime with Semantic Kernel installed.
1. Select the *+ Python* icon to create a new Python node.
1. Name it as your planner name (e.g., *math_planner*).
1. Select **+** button in *Files* tab to upload any other reference files (for example, *plugins*).
1. Update the code in *__.py* file with your planner's code.
1. Define the input and output of the planner node.
1. Set the flow input and output.
1. Click *Run* for a single test.

For example, we can create a flow with a Semantic Kernel planner that solves math problems. Follow this [documentation](/semantic-kernel/ai-orchestration/planners/evaluate-and-deploy-planners/create-a-prompt-flow-with-semantic-kernel) with steps necessary to create a simple Prompt flow with Semantic Kernel at its core.

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/semantic-kernel-flow.png" alt-text="Screenshot of creating a flow with semantic kernel planner." lightbox = "./media/how-to-evaluate-semantic-kernel/semantic-kernel-flow.png":::

Set up the connection in python code.

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/set-connection-in-python.png" alt-text="Screenshot of setting custom connection in python node." lightbox = "./media/how-to-evaluate-semantic-kernel/set-connection-in-python.png":::

Select the connection object in the node input, and set the model name of OpenAI or deployment name of Azure OpenAI.

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/set-key-model.png" alt-text="Screenshot of setting model and key in node input." lightbox = "./media/how-to-evaluate-semantic-kernel/set-key-model.png":::

### Batch testing your plugins and planners

Instead of manually testing different scenarios one-by-one, now you can now automatically run large batches of tests using Prompt flow and benchmark data. 

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/using-batch-runs-with-prompt-flow.png" alt-text="Screenshot of batch runs with prompt flow for Semantic kernel." lightbox = "./media/how-to-evaluate-semantic-kernel/using-batch-runs-with-prompt-flow.png":::

Once the flow has passed the single test run in the previous step, you can effortlessly create a batch test in Prompt flow by adhering to the following steps:
1. Create benchmark data in a *jsonl* file, contains a list of JSON objects that contains the input and the correct ground truth.
1. Click *Batch run* to create a batch test.
1. Complete the batch run settings, especially the data part.
1. Submit run without evaluation (for this specific batch test, the *Evaluation step* can be skipped).

In our [Running batches with Prompt flow](/semantic-kernel/ai-orchestration/planners/evaluate-and-deploy-planners/running-batches-with-prompt-flow?tabs=gpt-35-turbo), we demonstrate how you can use this functionality to run batch tests on a planner that uses a math plugin. By defining a bunch of word problems, we can quickly test any changes we make to our plugins or planners so we can catch regressions early and often.

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/semantic-kernel-test-data.png" alt-text="Screenshot of data of batch runs with prompt flow for Semantic kernel." lightbox = "./media/how-to-evaluate-semantic-kernel/semantic-kernel-test-data.png":::

In your workspace, you can go to the **Run list** in Prompt flow, select **Details** button, and then select **Output** tab to view the batch run result.

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/run.png" alt-text="Screenshot of the run list." lightbox = "./media/how-to-evaluate-semantic-kernel/run.png":::

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/run-detail.png" alt-text="Screenshot of the run detail." lightbox = "./media/how-to-evaluate-semantic-kernel/run-detail.png":::

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/run-output.png" alt-text="Screenshot of the run output." lightbox = "./media/how-to-evaluate-semantic-kernel/run-output.png":::

### Evaluating the accuracy

Once a batch run is completed, you then need an easy way to determine the adequacy of the test results. This information can then be used to develop accuracy scores, which can be incrementally improved.

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/evaluation-batch-run-with-prompt-flow.png" alt-text="Screenshot of evaluating batch run with prompt flow." lightbox = "./media/how-to-evaluate-semantic-kernel/evaluation-batch-run-with-prompt-flow.png":::

Evaluation flows in Prompt flow enable this functionality. Using the sample evaluation flows offered by prompt flow, you can assess various metrics such as **classification accuracy**, **perceived intelligence**, **groundedness**, and more. 

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/evaluation-sample-flows.png" alt-text="Screenshot showing evaluation flow samples." lightbox = "./media/how-to-evaluate-semantic-kernel/evaluation-sample-flows.png":::

There's also the flexibility to develop **your own custom evaluators** if needed.
:::image type="content" source="./media/how-to-evaluate-semantic-kernel/my-evaluator.png" alt-text="My custom evaluation flow" lightbox = "./media/how-to-evaluate-semantic-kernel/my-evaluator.png":::

In Prompt flow, you can quick create an evaluation run based on a completed batch run by following the steps below:
1. Prepare the evaluation flow and the complete a batch run.
1. Click *Run* tab in home page to go to the run list.
1. Go into the previous completed batch run.
1. Click *Evaluate* in the above to create an evaluation run.
1. Complete the evaluation settings, especially the evaluation flow and the input mapping.
1. Submit run and wait for the result.


:::image type="content" source="./media/how-to-evaluate-semantic-kernel/add-evaluation.png" alt-text="Screenshot showing add new evaluation." lightbox = "./media/how-to-evaluate-semantic-kernel/add-evaluation.png":::

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/evaluation-setting.png" alt-text="Screenshot showing evaluation settings." lightbox = "./media/how-to-evaluate-semantic-kernel/evaluation-setting.png":::


Follow this [documentation](/semantic-kernel/ai-orchestration/planners/evaluate-and-deploy-planners/evaluating-plugins-and-planners-with-prompt-flow?tabs=gpt-35-turbo) for Semantic Kernel to learn more about how to use the [math accuracy evaluation flow](https://github.com/microsoft/promptflow/tree/main/examples/flows/evaluation/eval-accuracy-maths-to-code) to test our planner to see how well it solves word problems. 

After running the evaluator, you’ll get a summary back of your metrics. Initial runs may yield less than ideal results, which can be used as a motivation for immediate improvement. 

To check the metrics, you can go back to the batch run detail page, click **Details** button, and then click **Output** tab, select the evaluation run  name in the dropdown list to view the evaluation result.

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/evaluation-result.png" alt-text="Screenshot showing evaluation result." lightbox = "./media/how-to-evaluate-semantic-kernel/evaluation-result.png":::

You can check the aggregated metric in the **Metrics** tab.

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/evaluation-metrics.png" alt-text="Screenshot showing evaluation metrics." lightbox = "./media/how-to-evaluate-semantic-kernel/evaluation-metrics.png":::


### Experiments for quality improvement

If you find that your plugins and planners aren’t performing as well as they should, there are steps you can take to make them better. In this documentation, we provide an in-depth guide on practical strategies to bolster the effectiveness of your plugins and planners. We recommend the following high-level considerations:

1. Use a more advanced model like GPT-4 instead of GPT-3.5-turbo.
1. [Improve the description of your plugins](/semantic-kernel/ai-orchestration/planners/evaluate-and-deploy-planners/evaluating-plugins-and-planners-with-prompt-flow?tabs=gpt-35-turbo#improving-the-descriptions-of-your-plugin) so they’re easier for the planner to use.
1. [Inject additional help to the planner](/semantic-kernel/ai-orchestration/planners/evaluate-and-deploy-planners/evaluating-plugins-and-planners-with-prompt-flow?tabs=gpt-35-turbo#improving-the-descriptions-of-your-plugin) when sending the user’s ask.

By doing a combination of these three things, we demonstrate how you can take a failing planner and turn it into a winning one! At the end of the walkthrough, you should have a planner that can correctly answer all of the benchmark data.

Throughout the process of enhancing your plugins and planners in Prompt flow, you can **utilize the runs to monitor your experimental progress**. Each iteration allows you to submit a batch run with an evaluation run at the same time.

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/batch-evaluation.png" alt-text="Screenshot of batch run with evaluation." lightbox = "./media/how-to-evaluate-semantic-kernel/batch-evaluation.png":::

This enables you to conveniently compare the results of various runs, assisting you in identifying which modifications are beneficial and which are not.

To compare, select the runs you wish to analyze, then select the **Visualize outputs** button in the above.

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/compare.png" alt-text="Screenshot of compare runs." lightbox = "./media/how-to-evaluate-semantic-kernel/compare.png":::

This will present you with a detailed table, line-by-line comparison of the results from selected runs.

:::image type="content" source="./media/how-to-evaluate-semantic-kernel/compare-detail.png" alt-text="Screenshot of compare runs details." lightbox = "./media/how-to-evaluate-semantic-kernel/compare-detail.png":::

## Next steps

> [!TIP]
> Follow along with our documentations to get started!
> And keep an eye out for more integrations.

If you’re interested in learning more about how you can use Prompt flow to test and evaluate Semantic Kernel, we recommend following along to the articles we created. At each step, we provide sample code and explanations so you can use Prompt flow successfully with Semantic Kernel.

* [Using Prompt flow with Semantic Kernel](/semantic-kernel/ai-orchestration/planners/evaluate-and-deploy-planners/)
* [Create a Prompt flow with Semantic Kernel](/semantic-kernel/ai-orchestration/planners/evaluate-and-deploy-planners/create-a-prompt-flow-with-semantic-kernel)
* [Running batches with Prompt flow](/semantic-kernel/ai-orchestration/planners/evaluate-and-deploy-planners/running-batches-with-prompt-flow)
* [Evaluate your plugins and planners](/semantic-kernel/ai-orchestration/planners/evaluate-and-deploy-planners/)

When your planner is fully prepared, it can be deployed as an online endpoint in Azure Machine Learning. This allows it to be easily integrated into your application for consumption. Learn more about how to [deploy a flow as a managed online endpoint for real-time inference](./how-to-deploy-for-real-time-inference.md).


