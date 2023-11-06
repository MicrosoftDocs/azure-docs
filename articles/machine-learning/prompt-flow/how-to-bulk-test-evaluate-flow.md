---
title: Submit bulk test and evaluate a flow in Prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Learn how to submit bulk test and use built-in evaluation methods in prompt flow to evaluate how well your flow performs with a large dataset with Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: ZikeiWong
ms.author: ziqiwang
ms.reviewer: lagayhar
ms.date: 06/30/2023
---

# Submit bulk test and evaluate a flow (preview)

To evaluate how well your flow performs with a large dataset, you can submit bulk test and use built-in evaluation methods in Prompt flow.

In this article you'll learn to:

- Submit a Bulk Test and Use a Built-in Evaluation Method
- View the evaluation result and metrics
- Start A New Round of Evaluation
- Check Bulk Test History and Compare Metrics
- Understand the Built-in Evaluation Metrics
- Ways to Improve Flow Performance

You can quickly start testing and evaluating your flow by following this video tutorial [submit bulk test and evaluate a flow video tutorial](https://www.youtube.com/watch?v=5Khu_zmYMZk).

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

To run a bulk test and use an evaluation method, you need to have the following ready:

- A test dataset for bulk test. Your dataset should be in one of these formats: `.csv`, `.tsv`, `.jsonl`, or `.parquet`. Your data should also include headers that match the input names of your flow.
- An available runtime to run your bulk test. A runtime is a cloud-based resource that executes your flow and generates outputs. To learn more about runtime, see [Runtime](./how-to-create-manage-runtime.md).

## Submit a bulk test and use a built-in evaluation method

A bulk test allows you to run your flow with a large dataset and generate outputs for each data row. You can also choose an evaluation method to compare the output of your flow with certain criteria and goals. An evaluation method  **is a special type of flow**  that calculates metrics for your flow output based on different aspects. An evaluation run will be executed to calculate the metrics when submitted with the bulk test.

To start a bulk test with evaluation, you can select on the **"Bulk test"** button on the top right corner of your flow page.

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-button.png" alt-text="Screenshot of Web Classification with bulk test highlighted. " lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-button.png":::

To submit bulk test, you can select a dataset to test your flow with. You can also select an evaluation method to calculate metrics for your flow output. If you don't want to use an evaluation method, you can skip this step and run the bulk test without calculating any metrics. You can also start a new round of evaluation later.

First, select or upload a dataset that you want to test your flow with. An available runtime that can run your bulk test is also needed. You also give your bulk test a descriptive and recognizable name. After you finish the configuration, select **"Next"** to continue.

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-setting.png" alt-text="Screenshot of bulk test settings where you can select an available runtime and select a test dataset. " lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-setting.png":::

Second, you can decide to use an evaluation method to validate your flow performance either immediately or later. If you have already completed a bulk test, you can start a new round of evaluation with a different method or subset of variants.

- **Submit Bulk test without using evaluation method to calculate metrics:** You can select **"Skip"** button to skip this step and run the bulk test without using any evaluation method to calculate metrics. In this way, this bulk test will only generate outputs for your dataset. You can check the outputs manually or export them for further analysis with other methods.

- **Submit Bulk test using evaluation method to calculate metrics:**  This option will run the bulk test and also evaluate the output using a method of your choice. A special designed evaluation method will run and calculate metrics for your flow output to validate the performance.

If you want to run bulk test with evaluation now, you can select an evaluation method from the dropdown box based on the description provided. After you selected an evaluation method, you can select **"View detail"** button to see more information about the selected method, such as the metrics it generates and the connections and inputs it requires.

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-eval-selection.png" alt-text="Screenshot of evaluation settings where you can select built-in evaluation method from drop-down box. " lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-eval-selection.png":::

In the  **"input mapping"**  section, you need to specify the sources of the input data that are needed for the evaluation method. The sources can be from the current flow output or from your test dataset, even if some columns in your dataset aren't used by your flow. For example, if your evaluation method requires a _ground truth_ column, you need to provide it in your dataset and select it in this section.

You can also manually type in the source of the data column.

- If the data column is in your test dataset, then it's specified as **"data.[column\_name]".**
- If the data column is from your flow output, then it's specified as **"output.[output\_name]".**

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-eval-input-mapping.png" alt-text="Screenshot of evaluation input mapping where you can define the required input columns for evaluation. " lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-eval-input-mapping.png":::

If an evaluation method uses Large Language Models (LLMs) to measure the performance of the flow response, you're required to set connections for the LLM nodes in the evaluation methods.

> [!NOTE]
> Some evaluation methods require GPT-4 or GPT-3 to run. You must provide valid connections for these evaluation methods before using them.

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-eval-connection.png" alt-text="Screenshot of connection where you can configure the connection for evaluation method. " lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-eval-connection.png":::

After you finish the input mapping, select on  **"Next"**  to review your settings and select on  **"Submit"**  to start the bulk test with evaluation.

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-review.png" alt-text="Screenshot of review where you can review the setting of the bulk test submission. " lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-review.png":::

## View the evaluation result and metrics

In the bulk test detail page, you can check the status of the bulk test you submitted. In the  **"Evaluation History"** section, you can find the records of the evaluation for this bulk test. The link of the evaluation navigates to the snapshot of the evaluation run that executed for calculating the metrics.

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-detail.png" alt-text="Screenshot of bulk test detail page where you check evaluation run. " lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-detail.png":::

When the evaluation run is completed, you can go to the **Outputs** tab in the bulk test detail page to check the outputs/responses generated by the flow with the dataset that you provided. You can also select **"Export"** to export and download the outputs in a .csv file.

You can  **select an evaluation run**  from the dropdown box and you'll see additional columns appended at the end of the table showing the evaluation result for each row of data. In this screenshot, you can locate the result that is falsely predicted with the output column "grade".

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-detail-output.png" alt-text="Screenshot of bulk test detail page on the outputs tab where you check bulk test outputs. " lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-detail-output.png":::

To view the overall performance, you can select the **"Metrics"** tab, and you can see various metrics that indicate the quality of each variant.

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-detail-metrics.png" alt-text="Screenshot of bulk test detail page on the metrics tab where you check the overall performance in the metrics tab. " lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-detail-metrics.png":::

To learn more about the metrics calculated by the built-in evaluation methods, please navigate to [understand the built-in evaluation metrics](#understand-the-built-in-evaluation-metrics).

## Start a new round of evaluation


If you have already completed a bulk test, you can start another round of evaluation to submit a new evaluation run to calculate metrics for the outputs **without running your flow again**. This is helpful and can save your cost to rerun your flow when:

- you didn't select an evaluation method to calculate the metrics when submitting the bulk test, and decide to do it now.
- you have already used evaluation method to calculate a metric. You can start another round of evaluation to calculate another metric.
- your evaluation run failed but your flow successfully generated outputs. You can submit your evaluation again.

You can select **"New evaluation"** to start another round of evaluation. The process is similar to that in submitting bulk test, except that you're asked to specify the output from which variants you would like to evaluate on in this new round.

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/new-evaluation.gif" alt-text="Gif of bulk test detail page on where a new round of evaluation is started. " lightbox = "./media/how-to-bulk-test-evaluate-flow/new-evaluation.gif":::

After setting up the configuration, you can select **"Submit"** for this new round of evaluation. After submission, you'll be able to see a new record in the "Evaluation History" Section.

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-detail-new-eval.png" alt-text="Screenshot of bulk test detail page on with evaluation history highlighted which shows a new record of evaluation." lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-detail-new-eval.png":::

After the evaluation run completed, similarly, you can check the result of evaluation in the **"Output"** tab of the bulk test detail page. You need select the new evaluation run to view its result.

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-detail-output-new-eval.png" alt-text="Screenshot of bulk test detail page on the output tab with checking the new evaluation output." lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-detail-output-new-eval.png":::

When multiple different evaluation runs are submitted for a bulk test, you can go to the **"Metrics"** tab of the bulk test detail page to compare all the metrics. 

## Check bulk test history and compare metrics

In some scenarios, you'll modify your flow to improve its performance. You can submit multiple bulk tests to compare the performance of your flow with different versions. You can also compare the metrics calculated by different evaluation methods to see which one is more suitable for your flow.

To check the bulk test history of your flow, you can select the **"Bulk test"** button on the top right corner of your flow page. You'll see a list of bulk tests that you have submitted for this flow.

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-history.png" alt-text="Screenshot of Web Classification with the view bulk runs button selected." lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-history.png":::

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-history-list.png" alt-text="Screenshot of bulk test runs showing the history." lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-history-list.png":::

You can select on each bulk test to check the detail. You can also select multiple bulk tests and select on the **"Compare Metrics"** to compare the metrics of these bulk tests.

:::image type="content" source="./media/how-to-bulk-test-evaluate-flow/bulk-test-compare.png" alt-text="Screenshot of metrics compare of multiple bulk tests." lightbox = "./media/how-to-bulk-test-evaluate-flow/bulk-test-compare.png":::

## Understand the built-in evaluation metrics

In Prompt flow, we provide multiple built-in evaluation methods to help you measure the performance of your flow output. Each evaluation method calculates different metrics. Now we provide nine built-in evaluation methods available, you can check the following table for a quick reference:

| Evaluation Method | Metrics  | Description | Connection Required | Required Input  | Score Value |
|---|---|---|---|---|---|
| Classification Accuracy Evaluation | Accuracy | Measures the performance of a classification system by comparing its outputs to ground truth. | No | prediction, ground truth | in the range [0, 1]. |
| QnA Relevance Scores Pairwise Evaluation | Score, win/lose | Assesses the quality of answers generated by a question answering system. It involves assigning relevance scores to each answer based on how well it matches the user question, comparing different answers to a baseline answer, and aggregating the results to produce metrics such as averaged win rates and relevance scores. | Yes | question, answer (no ground truth or context)  | Score: 0-100, win/lose: 1/0 |
| QnA Groundedness Evaluation | Groundedness | Measures how grounded the model's predicted answers are in the input source. Even if LLM’s responses are true, if not verifiable against source, then is ungrounded.  | Yes | question, answer, context (no ground truth)  | 1 to 5, with 1 being the worst and 5 being the best. |
| QnA GPT Similarity Evaluation | GPT Similarity | Measures similarity between user-provided ground truth answers and the model predicted answer using GPT Model.  | Yes | question, answer, ground truth (context not needed)  | 1 to 5, with 1 being the worst and 5 being the best. |
| QnA Relevance Evaluation | Relevance | Measures how relevant the model's predicted answers are to the questions asked.  | Yes | question, answer, context (no ground truth)  | 1 to 5, with 1 being the worst and 5 being the best. |
| QnA Coherence Evaluation | Coherence  | Measures the quality of all sentences in a model's predicted answer and how they fit together naturally.  | Yes | question, answer (no ground truth or context)  | 1 to 5, with 1 being the worst and 5 being the best. |
| QnA Fluency Evaluation | Fluency  | Measures how grammatically and linguistically correct the model's predicted answer is.  | Yes | question, answer (no ground truth or context)  | 1 to 5, with 1 being the worst and 5 being the best |
| QnA f1 scores Evaluation | F1 score   | Measures the ratio of the number of shared words between the model prediction and the ground truth.  | No | question, answer, ground truth (context not needed)  | in the range [0, 1]. |
| QnA Ada Similarity Evaluation | Ada Similarity  | Computes sentence (document) level embeddings using Ada embeddings API for both ground truth and prediction. Then computes cosine similarity between them (one floating point number)  | Yes | question, answer, ground truth (context not needed)  | in the range [0, 1]. |

## Ways to improve flow performance

After checking the [built-in metrics](#understand-the-built-in-evaluation-metrics) from the evaluation, you can try to improve your flow performance by:

- Check the output data to debug any potential failure of your flow.
- Modify your flow to improve its performance. This includes but not limited to:
  - Modify the prompt
  - Modify the system message
  - Modify parameters of the flow
  - Modify the flow logic

Prompt construction can be difficult. We provide a [Introduction to prompt engineering](../../cognitive-services/openai/concepts/prompt-engineering.md) to help you learn about the concept of constructing a prompt that can achieve your goal. You can also check the [Prompt engineering techniques](../../cognitive-services/openai/concepts/advanced-prompt-engineering.md?pivots=programming-language-chat-completions) to learn more about how to construct a prompt that can achieve your goal.

System message, sometimes referred to as a metaprompt or [system prompt](../../cognitive-services/openai/concepts/advanced-prompt-engineering.md?pivots=programming-language-completions#meta-prompts) that can be used to guide an AI system’s behavior and improve system performance. Read this document on [System message framework and template recommendations for Large Language Models(LLMs)](../../cognitive-services/openai/concepts/system-message.md) to learn about how to improve your flow performance with system message.

## Next steps

In this document, you learned how to run a bulk test and use a built-in evaluation method to measure the quality of your flow output. You also learned how to view the evaluation result and metrics, and how to start a new round of evaluation with a different method or subset of variants. We hope this document helps you improve your flow performance and achieve your goals with Prompt flow.

- [Develop a customized evaluation flow](how-to-develop-an-evaluation-flow.md)
- [Tune prompts using variants](how-to-tune-prompts-using-variants.md)
- [Deploy a flow](how-to-deploy-for-real-time-inference.md)
