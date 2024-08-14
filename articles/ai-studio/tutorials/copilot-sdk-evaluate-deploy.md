---
title: "Part 2: Evaluate and deploy copilot with the prompt flow SDK"
titleSuffix: Azure AI Studio
description: Evaluate and deploy a RAG-based copilot with the prompt flow SDK. This tutorial is part 2 of a two-part tutorial.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: tutorial
ms.date: 7/18/2024
ms.reviewer: lebaro
ms.author: sgilley
author: sdgilley
#customer intent: As a developer, I want to learn how to use the prompt flow SDK so that I can evaluate and deploy a copilot.
---

# Tutorial: Part 2 - Evaluate and deploy a RAG-based copilot with the prompt flow SDK

In this [Azure AI Studio](https://ai.azure.com) tutorial, you use the prompt flow SDK (and other libraries) to  evaluate and deploy the copilot you built in [Part 1 of the tutorial series](copilot-sdk-build-rag.md).

This tutorial is part two of a two-part tutorial.

> [!TIP]
> This tutorial is based on code in the sample repo for a [copilot application that implements RAG](https://github.com/Azure-Samples/rag-data-openai-python-promptflow).

In this part two, you learn how to:

> [!div class="checklist"]
> - [Evaluate the quality of copilot responses](#evaluate-the-quality-of-copilot-responses)
> - [Deploy the copilot to Azure](#deploy-the-copilot-to-azure)
> - [Verify the deployment](#verify-the-deployment)

## Prerequisites

- You must complete [part 1 of the tutorial series](copilot-sdk-build-rag.md) to build the copilot application.

- You must have the necessary permissions to add role assignments in your Azure subscription. Granting permissions by role assignment is only allowed by the **Owner** of the specific Azure resources. You might need to ask your IT admin for help with completing the [assign access](#assign-access-for-the-endpoint) section.

## Evaluate the quality of copilot responses

Now that you know your copilot responds well to your queries, including with chat history, it's time to evaluate how it does across a few different metrics and more data.

You use the prompt flow evaluator with an evaluation dataset and the `get_chat_response()` target function, then assess the evaluation results.

Once you run an evaluation, you can then make improvements to your logic, like improving your system prompt, and observing how the copilot responses change and improve.

### Set your evaluation model

Choose the evaluation model you want to use. It can be the same as the chat model you deployed before. If you want a different model for evaluation, you need to deploy it, or specify it if it already exists. For example, you might be using gpt-35-turbo for your chat completions, but want to use gpt-4 for evaluation since it might perform better.

Add your evaluation model name in your **.env** file:

```env
AZURE_OPENAI_EVALUATION_DEPLOYMENT=<your evaluation model deployment name>
```

### Create evaluation dataset

Use the following evaluation dataset, which contains example questions and expected answers (truth). 

1. Create a file called **eval_dataset.jsonl** in your **rag-tutorial** folder. See the [application code structure](copilot-sdk-build-rag.md#application-code-structure) for reference.
1. Paste this dataset into the file:

    :::code language="jsonl" source="~/rag-data-openai-python-promptflow-main/tutorial/eval_dataset.jsonl":::

### Evaluate with prompt flow evaluators

Now define an evaluation script that will:

- Import the `evaluate` function and evaluators from the Prompt flow `evals` package.
- Load the sample `.jsonl` dataset.
- Generate a target function wrapper around our copilot logic.
- Run the evaluation, which takes the target function, and merges the evaluation dataset with the responses from the copilot.
- Generate a set of GPT-assisted metrics (Relevance, Groundedness, and Coherence) to evaluate the quality of the copilot responses.
- Output the results locally, and logs the results to the cloud project.

The script allows you to review the results locally, by outputting the results in the command line, and to a json file.

The script also logs the evaluation results to the cloud project so that you can compare evaluation runs in the UI.

1. Create a file called **evaluate.py** in your **rag-tutorial** folder.
1. Add the following code. Update the `dataset_path` and `evaluation_name` to fit your use case.

    :::code language="python" source="~/rag-data-openai-python-promptflow-main/tutorial/evaluate.py":::

The main function at the end allows you to view the evaluation result locally, and gives you a link to the evaluation results in AI Studio.

### Run the evaluation script

1. From your console, sign in to your Azure account with the Azure CLI:

    ```bash
    az login
    ```

1. Install the required package:

    ```bash
    pip install promptflow-evals
    ```

1. Now run the evaluation script:

    ```bash
    python evaluate.py
    ```

For more information about using the prompt flow SDK for evaluation, see [Evaluate with the prompt flow SDK](../how-to/develop/flow-evaluate-sdk.md).

### Interpret the evaluation output

In the console output, you see for each question an answer and the summarized metrics in this nice table format. (You might see different columns in your output.)

```txt
'-----Summarized Metrics-----'
{'coherence.gpt_coherence': 4.3076923076923075,
 'groundedness.gpt_groundedness': 4.384615384615385,
 'relevance.gpt_relevance': 4.384615384615385}

'-----Tabular Result-----'
                                             question  ... gpt_coherence
0                  Which tent is the most waterproof?  ...             5
1          Which camping table holds the most weight?  ...             5
2       How much does TrailWalker Hiking Shoes cost?   ...             5
3   What is the proper care for trailwalker hiking...  ...             5
4                What brand is the TrailMaster tent?   ...             1
5        How do I carry the TrailMaster tent around?   ...             5
6             What is the floor area for Floor Area?   ...             3
7    What is the material for TrailBlaze Hiking Pants  ...             5
8     What color do the TrailBlaze Hiking Pants come   ...             5
9   Can the warranty for TrailBlaze pants be trans...  ...             3
10  How long are the TrailBlaze pants under warren...  ...             5
11  What is the material for PowerBurner Camping S...  ...             5
12                               Is France in Europe?  ...             1
```

The script writes the full evaluation results to `./eval_results.jsonl`.
And there's a link in the console to view evaluation results in your Azure AI Studio project.

> [!NOTE]
> You may see an `ERROR:asyncio:Unclosed client session` - this can be safely ignored and does not affect the evaluation results.

### View evaluation results in AI Studio

Once the evaluation run completes, follow the link to view the evaluation results on the **Evaluation** page in the Azure AI Studio.

:::image type="content" source="../media/tutorials/develop-rag-copilot-sdk/eval-studio-overview.png" alt-text="Screenshot shows evaluation overview in Azure AI Studio.":::

You can also look at the individual rows and see metric scores per row, and view the full context/documents that were retrieved. These metrics can be helpful in interpreting and debugging evaluation results.

:::image type="content" source="../media/tutorials/develop-rag-copilot-sdk/eval-studio-rows.png" alt-text="Screenshot shows rows of evaluation results in Azure AI Studio.":::

For more information about evaluation results in AI Studio, see [How to view evaluation results in AI Studio](../how-to/evaluate-flow-results.md).

Now that you verified your copilot behaves as expected, you're ready to deploy your application.

## Deploy the copilot to Azure

Now let's go ahead and deploy this copilot to a managed endpoint so that it can be consumed by an external application or website. 

The deploy script will:

- Create a managed online endpoint
- Define our flow as a model
- Deploy our flow to a managed environment on that endpoint that has our environment variables
- Route all traffic to that deployment
- Output the link to view and test the deployment in the Azure AI Studio

The deployment defines a build context (Dockerfile) that relies on the `requirement.txt` specified in our flow folder, and also sets our environment variables to the deployed environment, so we can be confident that our copilot application runs the same in a production environment as it did locally.

### Build context for the deployment (Dockerfile)

The deployed environment needs a build context, so let's define a Dockerfile for the deployed environment.
The deploy script creates an environment based on this Dockerfile. Create this **Dockerfile** in the **copilot_flow** folder:

```docker
FROM mcr.microsoft.com/azureml/promptflow/promptflow-runtime:latest
COPY ./requirements.txt .
RUN pip install -r requirements.txt
```

### Deploy copilot to a managed endpoint

To deploy your application to a managed endpoint in Azure, create an online endpoint, then create a deployment in that endpoint, and then route all traffic to that deployment.

As part of creating the deployment, your copilot_flow folder is packaged as a model and a cloud environment is built. The endpoint is set up with Microsoft Entra ID authentication. You can update the auth mode you want in the code, or in the Azure AI Studio on the endpoint details page.

> [!IMPORTANT]
> Deploying your application to a managed endpoint in Azure has associated compute cost based on the instance type you choose. Make sure you are aware of the associated cost and have quota for the instance type you specify. Learn more about [online endpoints](../../machine-learning/reference-managed-online-endpoints-vm-sku-list.md).

Create the file **deploy.py** in the **rag-tutorial** folder. Add the following code:

:::code language="python" source="~/rag-data-openai-python-promptflow-main/tutorial/deploy.py" id="deploy":::

> [!IMPORTANT]
> The endpoint and deployment name must be unique within an Azure region. If you get an error that the endpoint or deployment name already exists, try different names.

### Output deployment details

Add the following lines to the end your deploy script to view the evaluation result locally, and get a link to the studio:

:::code language="python" source="~/rag-data-openai-python-promptflow-main/tutorial/deploy.py" id="status":::

Now, run the script with:

```bash
python deploy.py
```

> [!NOTE]
> Deployment may take over 10 minutes to complete. We suggest you follow the next step to assign access to the endpoint while you wait.

Once the deployment is completed, you get a link to the Azure AI Studio deployment page, where you can test your deployment.

## Verify the deployment

We recommend you test your application in the Azure AI Studio. If you prefer to test your deployed endpoint locally, you can invoke it with some custom code.

Note your endpoint name, which you need for the next steps.

### Assign access for the endpoint

While you wait for your application to deploy, you or your administrator can assign role-based access to the endpoint. These roles allow the application to run without keys in the deployed environment, just like it did locally.

Previously, you provided your account with a specific role to be able to access the resource using Microsoft Entra ID authentication. Now, assign the endpoint that same role.

### Endpoint access for Azure OpenAI resource

You or your administrator needs to grant your endpoint the **Cognitive Services OpenAI User** role on the Azure AI Services resource that you're using. This role lets your endpoint call the Azure OpenAI service.

> [!NOTE]
> These steps are similar to how you assigned a role for your user identity to use the Azure OpenAI Service in the [quickstart](../quickstarts/get-started-code.md).

To grant yourself access to the Azure AI Services resource that you're using:

1. In [AI Studio](https://ai.azure.com), go to your project and select **Settings** from the left pane.
1. In the **Connected resources** section, select the connection name with type **AIServices**.

    :::image type="content" source="../media/quickstarts/promptflow-sdk/project-settings-pick-resource.png" alt-text="Screenshot of the project settings page, highlighting how to select the connected AI services resource to open it." lightbox="../media/quickstarts/promptflow-sdk/project-settings-pick-resource.png":::

    > [!NOTE]
    > If you don't see the **AIServices** connection, use the **Azure OpenAI** connection instead.

1. On the resource details page, select the link under the **Resource** heading to open the AI services resource in the Azure portal.

    :::image type="content" source="../media/quickstarts/promptflow-sdk/project-ai-services-open-in-portal.png" alt-text="Screenshot of the AI Services connection details showing how to open the resource in the Azure portal." lightbox="../media/quickstarts/promptflow-sdk/project-ai-services-open-in-portal.png":::

1. From the left page in the Azure portal, select **Access control (IAM)** > **+ Add** > **Add role assignment**.

1. Search for the **Cognitive Services OpenAI User** role and then select it. Then select **Next**.

    :::image type="content" source="../media/quickstarts/promptflow-sdk/ai-services-add-role-assignment.png" alt-text="Screenshot of the page to select the Cognitive Services OpenAI User role." lightbox="../media/quickstarts/promptflow-sdk/ai-services-add-role-assignment.png":::

1. Select **Managed identity**. Then select **Select members**.

1. In the **Select members** pane that opens, select _Machine learning online endpoint_ for the Managed identity, and then search for your endpoint name. Select the endpoint and then select **Select**.

    :::image type="content" source="../media/tutorials/develop-rag-copilot-sdk/managed-identity-role-aoai.png" alt-text="Screenshot shows Selection of members for the online endpoint.":::

1. Continue through the wizard and select **Review + assign** to add the role assignment.

> [!NOTE]
> It may take a few minutes for the access to propagate. If you get an unauthorized error when testing in the next step, try again after a few minutes.

### Endpoint access for Azure AI Search resource

Similar to how you assigned the **Search Index Data Contributor** [role to your Azure AI Search service](./copilot-sdk-build-rag.md#configure-access-for-the-azure-ai-search-service), you need to assign the same role for your endpoint.

1. In Azure AI Studio, select **Settings** and navigate to the connected **Azure AI Search** service. 
1. Select the link to open a summary of the resource. Select the link on the summary page to open the resource in the Azure portal.

1. From the left page in the Azure portal, select **Access control (IAM)** > **+ Add** > **Add role assignment**.

    :::image type="content" source="../media/tutorials/develop-rag-copilot-sdk/add-role-search.png" alt-text="Screenshot shows Access control for search resource.":::

1. Search for the **Search Index Data Contributor** role and then select it. Then select **Next**.

1. Select **Managed identity**. Then select **Select members**.

1. In the **Select members** pane that opens, select _Machine learning online endpoint_ for the Managed identity, and then search for your endpoint name. Select the endpoint and then select **Select**.

    :::image type="content" source="../media/tutorials/develop-rag-copilot-sdk/managed-identity-role-search.png" alt-text="Screenshot shows selecting the endpoint.":::

1. Continue through the wizard and select **Review + assign** to add the role assignment.

> [!NOTE]
> It may take a few minutes for the access to propagate. If you get an unauthorized error when testing in the next step, try again after a few minutes.

### Test your deployment in AI Studio

Once the deployment is completed, you get a handy link to your deployment. If you don't use the link, navigate to the **Deployments** tab in your project and select your new deployment.

:::image type="content" source="../media/tutorials/develop-rag-copilot-sdk/deployment-overview.png" alt-text="Screenshot shows deployment overview in Azure AI Studio.":::

Select the **Test** tab, and try asking a question in the chat interface.

For example, type "Are the Trailwalker hiking shoes waterproof?" and enter.

:::image type="content" source="../media/tutorials/develop-rag-copilot-sdk/deployment-test.png" alt-text="Screenshot shows deployment response in Azure AI Studio.":::

Seeing the response come back verifies your deployment.

If you get an error, select the **Logs** tab to get more details.

> [!NOTE]
> If you get an unauthorized error, your endpoint access may not have been applied yet. Try again in a few minutes.

### Invoke the deployed copilot locally

If you prefer to verify your deployment locally, you can invoke it via a Python script.

Define a script that will:

- Construct a well-formed request to our scoring URL.
- Post the request and handle the response.

Create an **invoke-local.py** file in your **rag-tutorial** folder, with the following code. Modify the `query` and `endpoint_name` (and other parameters as needed) to fit your use case.

:::code language="python" source="~/rag-data-openai-python-promptflow-main/tutorial/invoke-local.py":::

You should see the copilot reply to your query in the console.

> [!NOTE]
> If you get an unauthorized error, your endpoint access may not have been applied yet. Try again in a few minutes.

## Clean up resources

To avoid incurring unnecessary Azure costs, you should delete the resources you created in this tutorial if they're no longer needed. To manage resources, you can use the [Azure portal](https://portal.azure.com?azure-portal=true).

## Related content

> [!div class="nextstepaction"]
> [Learn more about prompt flow](../how-to/prompt-flow.md)