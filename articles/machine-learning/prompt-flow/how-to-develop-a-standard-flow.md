---
title: Develop a standard flow in Prompt flow (preview)
titleSuffix: Azure Machine Learning
description: learn how to develop the standard flow in the authoring page in Prompt flow with Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.topic: how-to
author: jiaochenlu
ms.author: chenlujiao
ms.reviewer: lagayhar
ms.date: 09/12/2023
---

# Develop a standard flow (preview)

You can develop your flow from scratch, by creating a standard flow. In this article, you'll learn how to develop the standard flow in the authoring page.

You can quickly start developing your standard flow by following this video tutorial:

A quick video tutorial can be found here: [standard flow video tutorial](https://www.youtube.com/watch?v=Y1CPlvQZiBg).

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Create a standard flow

In the Prompt flow​​​​​​​ homepage, you can create a standard flow from scratch. Select **Create** button.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-create-standard.png" alt-text="Screenshot of the Prompt flow home page showing create a new flow with standard flow highlighted. " lightbox = "./media/how-to-develop-a-standard-flow/flow-create-standard.png":::

After selecting **Create**, as shown in the right panel, the new flow will be saved in a specific folder within your workspace file share storage. You can customize the folder name according to your preferences.

:::image type="content" source="./media/how-to-develop-a-standard-flow/specify-flow-folder-name.png" alt-text="Screenshot of specify the flow folder name when creating a flow. " lightbox = "./media/how-to-develop-a-standard-flow/specify-flow-folder-name.png":::

## Authoring page

After the creation, you'll enter the authoring page for flow developing.

At the left, it's the flatten view, the main working area where you can author the flow, for example add a new node, edit the prompt, select the flow input data, etc.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-flatten-view.png" alt-text="Screenshot of web classification highlighting the main working area." lightbox = "./media/how-to-develop-a-standard-flow/flow-flatten-view.png":::

The top right corner shows the folder structure of the flow. Each flow has a folder that contains a flow.dag.yaml file, source code files, and system folders. You can export or import a flow easily for testing, deployment, or collaborative purposes.

:::image type="content" source="./media/how-to-develop-a-standard-flow/folder-structure-view.png" alt-text="Screenshot of web classification highlighting the folder structure area." lightbox = "./media/how-to-develop-a-standard-flow/folder-structure-view.png":::

In addition to inline editing the node in flatten view, you can also turn on the **Raw file mode** toggle and select the file name to edit the file in the opening file tab.

:::image type="content" source="./media/how-to-develop-a-standard-flow/file-edit-tab.png" alt-text="Screenshot of the file edit tab under raw file mode." lightbox = "./media/how-to-develop-a-standard-flow/file-edit-tab.png":::

In the bottom right corner, it's the graph view for visualization only. You can zoom in, zoom out, auto layout, etc.

> [!NOTE]
> You cannot edit the graph view. To edit one tool node, you can double-click the node to locate to the corresponding tool card in the flatten view, then do the inline edit.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-graph-view.png" alt-text="Screenshot of web classification highlighting graph view area." lightbox = "./media/how-to-develop-a-standard-flow/flow-graph-view.png":::


## Select runtime

Before you start authoring to develop your flow, you should first select a runtime.  Select the Runtime at the top and select an available one that suits your flow run.

> [!IMPORTANT]
> You cannot save your inline edit of tool without a runtime!

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-runtime-setting.png" alt-text="Screenshot of the runtime drop-down menu showing two different runtimes. " lightbox = "./media/how-to-develop-a-standard-flow/flow-runtime-setting.png":::

## Flow input data

The flow input data is the data that you want to process in your flow. When unfolding **Inputs** section in the authoring page, you can set and view your flow inputs, including input schema (name and type), and the input value.

For Web Classification sample as shown the screenshot below, the flow input is a URL of string type.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-input.png" alt-text="Screenshot of Web Classification highlighting the input node and add input button. " lightbox = "./media/how-to-develop-a-standard-flow/flow-input.png":::

We also support the input type of int, bool, double, list and object.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-input-datatype.png" alt-text="Screenshot of inputs showing the type drop-down menu with string selected. " lightbox = "./media/how-to-develop-a-standard-flow/flow-input-datatype.png":::

## Develop the flow using different tools

In one flow, you can consume different kinds of tools. We now support LLM, Python, Serp API, Content Safety, Vector Search, etc.

### Add tool as your need

By selecting the tool card on the very top, you'll add a new tool node to flow.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-tool.png" alt-text="Screenshot of the tool card showing the drop-down menu from selecting more tools. " lightbox = "./media/how-to-develop-a-standard-flow/flow-tool.png":::

### Edit tool

When a new tool node is added to flow, it will be appended at the bottom of flatten view with a random name by default. The new added tool appears at the top of the graph view as well.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-new-tool.png" alt-text="Screenshot of Python node and its location in the graph view. " lightbox = "./media/how-to-develop-a-standard-flow/flow-new-tool.png":::

At the top of each tool node card, there's a toolbar for adjusting the tool node. You can **move it up or down**, you can **delete** or **rename** it too.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-tool-edit.png" alt-text="Screenshot of the Python tool node highlighting the toolbar buttons. " lightbox = "./media/how-to-develop-a-standard-flow/flow-tool-edit.png":::

### Select connection

In the LLM tool, select Connection to select one to set the LLM key or credential.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-llm-connection.png" alt-text="Screenshot of the summarize text content node with connection highlighted. " lightbox = "./media/how-to-develop-a-standard-flow/flow-llm-connection.png":::

### Prompt and python code inline edit

In the LLM tool and python tool, it's available to inline edit the prompt or code. Go to the card in the flatten view, select the prompt section or code section, then you can make your change there.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-inline-edit-prompt.png" alt-text="Animation of inline editing the prompt in the LLM tool." lightbox = "./media/how-to-develop-a-standard-flow/flow-inline-edit-prompt.png":::

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-inline-edit.png" alt-text="Animation of inline editing the code in the Python tool." lightbox = "./media/how-to-develop-a-standard-flow/flow-inline-edit.png":::

### Validate and run

To test and debug a single node, select the **Run** icon on node in flatten view. The run status appears at the top of the screen. If the run fails, an error banner displays. To view the output of the node, go to the node and open the output section, you can see the output value, trace and logs of the single step run.

The single node status is shown in the graph view as well.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-step-run.png" alt-text="Screenshot of showing where the run icon on the node is located and the view full output button. " lightbox = "./media/how-to-develop-a-standard-flow/flow-step-run.png":::

You can also change the flow input URL to test the node behavior for different URLs.

## Chain your flow - link nodes together

Before linking nodes together, you need to define and expose an interface.

### Define LLM node interface

LLM node has only one output, the completion given by LLM provider.

As for inputs, we offer a templating strategy that can help you create parametric prompts that accept different input values. Instead of fixed text, enclose your input name in `{{}}`, so it can be replaced on the fly. We use **Jinja** as our templating language.

Edit the prompt box to define inputs using `{{input_name}}`.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-input-interface.png" alt-text="Screenshot of editing the prompt box to define inputs. " lightbox = "./media/how-to-develop-a-standard-flow/flow-input-interface.png":::

### Define Python node interface

Python node might have multiple inputs and outputs. Define inputs and outputs as shown below. If you have multiple outputs, remember to make it a dictionary so that the downstream node can call each key separately.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-input-python.png" alt-text="Screenshot of Python code highlighting the place to define inputs and outputs. " lightbox = "./media/how-to-develop-a-standard-flow/flow-input-python.png":::

### Link nodes together

After the interface is defined, you can use:

- ${inputs.key} to link with flow input.
- ${upstream_node_name.output} to link with single-output upstream node.
- ${upstream_node_name.output.key} to link with multi-output upstream node.

Below are common scenarios for linking nodes together.

### Scenario 1 - Link LLM node with flow input

1. Add a new LLM node, rename it with a meaningful name, specify the connection and API type.
2. Edit the prompt box, add an input by `{{url}}`, select **Validate and parse input**, then you'll see an input called URL is created in inputs section.
3. In the value drop-down, select ${inputs.url}, then you'll see in the graph view that the newly created LLM node is linked to the flow input. When running the flow, the URL input of the node will be replaced by flow input on the fly.

:::image type="content" source="./media/how-to-develop-a-standard-flow/link-llm-node-input-1-1.png" alt-text="Screenshot of scenario one showing the LLM tool and editing the prompt in step 1. " lightbox = "./media/how-to-develop-a-standard-flow/link-llm-node-input-1-1.png":::

:::image type="content" source="./media/how-to-develop-a-standard-flow/link-llm-node-input-1-2.png" alt-text="Screenshot of scenario one showing the LLM tool and editing the prompt in step 2. " lightbox = "./media/how-to-develop-a-standard-flow/link-llm-node-input-1-2.png":::

### Scenario 2 - Link LLM node with single-output upstream node

1. Edit the prompt box, add another input by `{{summary}}`, select **Validate and parse input**, then you'll see an input called summary is created in inputs section.
2. In the value drop-down, select ${summarize_text_content.output}, then you'll see in the graph view that the newly created LLM node is linked to the upstream summarize_text_content node. When running the flow, the summary input of the node will be replaced by summarize_text_content node output on the fly.

We support search and autosuggestion here in the drop-down. You can search by node name if you have many nodes in the flow.

:::image type="content" source="./media/how-to-develop-a-standard-flow/link-llm-node-input-2.png" alt-text="Animation of scenario two editing the prompt and inputs. " lightbox = "./media/how-to-develop-a-standard-flow/link-llm-node-input-2.png":::

You can also navigate to the node you want to link with, copy the node name, navigate back to the newly created LLM node, paste in the input value field.

:::image type="content" source="./media/how-to-develop-a-standard-flow/link-llm-node-summary-2.png" alt-text="Animation of the LLM node showing how copying the node name works. " lightbox = "./media/how-to-develop-a-standard-flow/link-llm-node-summary-2.png":::

### Scenario 3 - Link LLM node with multi-output upstream node

Suppose we want to link the newly created LLM node with covert_to_dict Python node whose output is a dictionary with two keys: category and evidence.

1. Select Edit next to the prompt box, add another input by `{{category}}`, then you'll see an input called category is created in inputs section.
2. In the value drop-down, select ${convert_to_dict.output}, then manually append category, then you'll see in the graph view that the newly created LLM node is linked to the upstream convert_to_dict node. When running the flow, the category input of the node will be replaced by category value from convert_to_dict node output dictionary on the fly.

:::image type="content" source="./media/how-to-develop-a-standard-flow/link-llm-node-summary-3.png" alt-text="Screenshot of the LLM tool highlighting the category value. " lightbox = "./media/how-to-develop-a-standard-flow/link-llm-node-summary-3.png":::

### Scenario 4 - Link Python node with upstream node/flow input

1. First you need to edit the code, add an input in python function.
1. The linkage is the same as LLM node, using \${flow.input_name\} to link with flow input or \${upstream_node_name.output1\} to link with upstream node.

:::image type="content" source="./media/how-to-develop-a-standard-flow/new-python-node-input.gif" alt-text="Gif of the Python node showing editing the code and selecting a value from the value drop-down menu. " lightbox = "./media/how-to-develop-a-standard-flow/new-python-node-input.gif":::

## Flow run

To test and debug the whole flow, select the Run button at the right top.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-run-all.png" alt-text="Screenshot of the flow page with the run button highlighted. " lightbox = "./media/how-to-develop-a-standard-flow/flow-run-all.png":::

## Set and check flow output

When the flow is complicated, instead of checking outputs on each node, you can set flow output and check outputs of multiple nodes in one place. Moreover, flow output helps:

- Check bulk test results in one single table.
- Define evaluation interface mapping.
- Set deployment response schema.

First define flow output schema, then select in drop-down the node whose output you want to set as flow output. Since convert_to_dict has a dictionary output with two keys: category and evidence, you need to manually append category and evidence to each. Then run flow, after a while, you can check flow output in a table.

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-output.png" alt-text="Screenshot of outputs showing the value drop-down menu. " lightbox = "./media/how-to-develop-a-standard-flow/flow-output.png":::

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-output-check.png" alt-text="Screenshot of Web Classification highlighting the view outputs button. " lightbox = "./media/how-to-develop-a-standard-flow/flow-output-check.png":::

:::image type="content" source="./media/how-to-develop-a-standard-flow/flow-output-check-2.png" alt-text="Screenshot of outputs, which shows the status is completed and information for that output. " lightbox = "./media/how-to-develop-a-standard-flow/flow-output-check-2.png":::

## Next steps

- [Bulk test using more data and evaluate the flow performance](how-to-bulk-test-evaluate-flow.md)
- [Tune prompts using variants](how-to-tune-prompts-using-variants.md)
- [Deploy a flow](how-to-deploy-for-real-time-inference.md)
