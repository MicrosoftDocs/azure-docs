---
title: Integrate prompt flow with LLM-based application DevOps
titleSuffix: Azure Machine Learning
description: Learn about integration of prompt flow with LLM-based application DevOps in Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: how-to
author: jiaochenlu
ms.author: chenlujiao
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# Integrate prompt flow with LLM-based application DevOps

In this article, you'll learn about the integration of prompt flow with LLM-based application DevOps in Azure Machine Learning. Prompt flow offers a developer-friendly and easy-to-use code-first experience for flow developing and iterating with your entire LLM-based application development workflow.

It provides an **prompt flow SDK and CLI**, an **VS code extension**, and the new UI of **flow folder explorer** to facilitate the local development of flows, local triggering of flow runs and evaluation runs, and transitioning flows from local to cloud (Azure Machine Learning workspace) environments.

This documentation focuses on how to effectively combine the capabilities of prompt flow code experience and DevOps to enhance your LLM-based application development workflows.

:::image type="content" source="./media/how-to-integrate-with-llm-app-devops/devops-process.png" alt-text="Diagram of the showing the following flow: create flow, develop and test flow, versioning in code repo, submit runs to cloud, and debut and iteration. " lightbox = "./media/how-to-integrate-with-llm-app-devops/devops-process.png":::

## Introduction of code-first experience in prompt flow

When developing applications using LLM, it's common to have a standardized application engineering process that includes code repositories and CI/CD pipelines. This integration allows for a streamlined development process, version control, and collaboration among team members.

For developers experienced in code development who seek a more efficient LLMOps iteration process, the following key features and benefits you can gain from prompt flow code experience:

- **Flow versioning in code repository**. You can define your flow in YAML format, which can stay aligned with the referenced source files in a folder structure. 
- **Integrate flow run with CI/CD pipeline**. You can trigger flow runs using the prompt flow CLI or SDK, which can be seamlessly integrated into your CI/CD pipeline and delivery process.
- **Smooth transition from local to cloud**. You can easily export your flow folder to your local or code repository for version control, local development and sharing. Similarly, the flow folder can be effortlessly imported back to the cloud for further authoring, testing, deployment in cloud resources.

## Accessing prompt flow code definition

Each flow each prompt flow is associated with a **flow folder structure** that contains essential files for defining the flow in code **folder structure**. This folder structure organizes your flow, facilitating smoother transitions.

Azure Machine Learning offers a shared file system for all workspace users. Upon creating a flow, a corresponding flow folder is automatically generated and stored there, located in the ```Users/<username>/promptflow``` directory.

:::image type="content" source="./media/how-to-integrate-with-llm-app-devops/flow-folder-created-in-file-share-storage.png" alt-text="Screenshot of standard flow creation showing the create a new flow. " lightbox = "./media/how-to-integrate-with-llm-app-devops/flow-folder-created-in-file-share-storage.png":::

### Flow folder structure

Overview of the flow folder structure and the key files it contains:

- **flow.dag.yaml**: This primary flow definition file, in YAML format, includes information about inputs, outputs, nodes, tools, and variants used in the flow. It's integral for authoring and defining the prompt flow.
- **Source code files (.py, .jinja2)**: The flow folder also includes user-managed source code files, which are referred to by the tools/nodes in the flow.
    - Files in Python (.py) format can be referenced by the python tool for defining custom python logic.
    - Files in Jinja2 (.jinja2) format can be referenced by the prompt tool or LLM tool for defining prompt context.
- **Non-source files**: The flow folder can also contain non-source files such as utility files and data files that can be included in the source files.

Once the flow is created, you can navigate to the Flow Authoring Page to view and operate the flow files in the right file explorer. This allows you to view, edit, and manage your files. Any modifications made to the files will be directly reflected in the file share storage.

:::image type="content" source="./media/how-to-integrate-with-llm-app-devops/flow-file-explorer.png" alt-text="Screenshot of standard flow highlighting the files explorer. " lightbox = "./media/how-to-integrate-with-llm-app-devops/flow-file-explorer.png":::

With "Raw file mode" switched on, you can view and edit the raw content of the files in the file editor, including the flow definition file `flow.dag.yaml` and the source files.

:::image type="content" source="./media/how-to-integrate-with-llm-app-devops/flow-day-yaml-raw-file.png" alt-text="Screenshot of raw file mode on a standard flow. " lightbox = "./media/how-to-integrate-with-llm-app-devops/flow-day-yaml-raw-file.png":::

:::image type="content" source="./media/how-to-integrate-with-llm-app-devops/flow-source-file-raw-file.png" alt-text="Screenshot of flow source file in a standard flow. " lightbox = "./media/how-to-integrate-with-llm-app-devops/flow-source-file-raw-file.png":::

Alternatively, you can access all the flow folders directly within the Azure Machine Learning notebook.

:::image type="content" source="./media/how-to-integrate-with-llm-app-devops/notebook-user-path.png" alt-text="Screenshot of notebooks in Azure Machine Learning in the prompt flow folder showing the files. " lightbox = "./media/how-to-integrate-with-llm-app-devops/notebook-user-path.png":::

## Versioning prompt flow in code repository

To check in your flow into your code repository, you can easily export the flow folder from the flow authoring page to your local system. This will download a package containing all the files from the explorer to your local machine, which you can then check into your code repository.

:::image type="content" source="./media/how-to-integrate-with-llm-app-devops/flow-export.png" alt-text="Screenshot of showing the download button in the file explorer." lightbox = "./media/how-to-integrate-with-llm-app-devops/flow-export.png":::

For more information about DevOps integration with Azure Machine Learning, see [Git integration in Azure Machine Learning](../concept-train-model-git-integration.md)

## Submitting runs to the cloud from local repository

### Prerequisites

- Complete the [Create resources to get started](../quickstart-create-resources.md) if you don't already have an Azure Machine Learning workspace.

- A Python environment in which you've installed Azure Machine Learning Python SDK v2 - [install instructions](https://github.com/Azure/azureml-examples/tree/sdk-preview/sdk#getting-started). This environment is for defining and controlling your Azure Machine Learning resources and is separate from the environment used at runtime. To learn more, see [how to manage runtime](how-to-create-manage-runtime.md) for prompt flow engineering.

### Install prompt flow SDK

```shell
pip install -r ../../examples/requirements.txt
```

### Connect to Azure Machine Learning workspace

# [Azure CLI](#tab/cli)

```sh
az login
```
# [Python SDK](#tab/python)

```python
import json

# Import required libraries
from azure.identity import DefaultAzureCredential, InteractiveBrowserCredential

# azure version promptflow apis
from promptflow.azure import PFClient

# Configure credential
try:
    credential = DefaultAzureCredential()
    # Check if given credential can get token successfully.
    credential.get_token("https://management.azure.com/.default")
except Exception as ex:
    # Fall back to InteractiveBrowserCredential in case DefaultAzureCredential not work
    credential = InteractiveBrowserCredential()

# Get a handle to workspace, it will use config.json in current and parent directory.
pf = PFClient.from_config(
    credential=credential,
)
```

---

# [Azure CLI](#tab/cli)

Prepare the `run.yml` to define the config for this flow run in cloud.

```yaml
$schema: https://azuremlschemas.azureedge.net/promptflow/latest/Run.schema.json
flow: <path_to_flow>
data: <path_to_flow>/data.jsonl

column_mapping:
  url: ${data.url}

# define cloud resource
# if omitted, it will use the automatic runtime, you can also specify the runtime name, specify automatic will also use the automatic runtime.
runtime: <runtime_name> 


# define instance type only work for automatic runtime, will be ignored if you specify the runtime name.
# resources:
#   instance_type: <instance_type>

# overrides connections 
connections:
  classify_with_llm:
    connection: <connection_name>
    deployment_name: <deployment_name>
  summarize_text_content:
    connection: <connection_name>
    deployment_name: <deployment_name>
```

You can specify the connection and deployment name for each tool in the flow. If you don't specify the connection and deployment name, it will use the one connection and deployment on the `flow.dag.yaml` file. To format of connections:

```yaml
...
connections:
  <node_name>:
    connection: <connection_name>
      deployment_name: <deployment_name>
...

```

```sh
pfazure run create --file run.yml
```

# [Python SDK](#tab/python)

```python
# load flow
flow = "<path_to_flow>"
data = "<path_to_flow>/data.jsonl"


# define cloud resource
runtime = <runtime_name>
# define instance type
# resources = {"instance_type": <instance_type>}

# overrides connections 
connections = {"classify_with_llm":
                  {"connection": <connection_name>,
                  "deployment_name": <deployment_name>},
               "summarize_text_content":
                  {"connection": <connection_name>,
                  "deployment_name": <deployment_name>}
                }
# create run
base_run = pf.run(
    flow=flow,
    data=data,
    runtime=runtime, # if ommited, it will use the automatic runtime, you can also specify the runtime name, specif automatic will also use the automatic runtime.
#    resources = resources, # only work for automatic runtime, will be ignored if you specify the runtime name.
    column_mapping={
        "url": "${data.url}"
    }, 
    connections=connections,  

)
print(base_run)
```

---

# [Azure CLI](#tab/cli)

Prepare the `run_evaluation.yml` to define the config for this evaluation flow run in cloud.

```yaml
$schema: https://azuremlschemas.azureedge.net/promptflow/latest/Run.schema.json
flow: <path_to_flow>
data: <path_to_flow>/data.jsonl
run: <id of web-classification flow run>
column_mapping:
  groundtruth: ${data.answer}
  prediction: ${run.outputs.category}

# define cloud resource
# if ommited, it will use the automatic runtime, you can also specify the runtime name, specif automatic will also use the automatic runtime.
runtime: <runtime_name> 


# define instance type only work for automatic runtime, will be ignored if you specify the runtime name.
# resources:
#   instance_type: <instance_type>

# overrides connections 
connections:
  classify_with_llm:
    connection: <connection_name>
    deployment_name: <deployment_name>
  summarize_text_content:
    connection: <connection_name>
    deployment_name: <deployment_name>

```

```sh
pfazure run create --file run_evaluation.yml
```

# [Python SDK](#tab/python)

```python
# load flow
flow = "<path_to_flow>"
data = "<path_to_flow>/data.jsonl"

# define cloud resource
runtime = <runtime_name>
# define instance type
# resources = {"instance_type": <instance_type>}

# overrides connections 
connections = {"classify_with_llm":
                  {"connection": <connection_name>,
                  "deployment_name": <deployment_name>},
               "summarize_text_content":
                  {"connection": <connection_name>,
                  "deployment_name": <deployment_name>}
                }

# create evaluation run
eval_run = pf.run(
    flow=flow
    data=data,
    run=base_run,
    column_mapping={
        "groundtruth": "${data.answer}",
        "prediction": "${run.outputs.category}",
    },
    runtime=runtime, # if ommited, it will use the automatic runtime, you can also specify the runtime name, specif automatic will also use the automatic runtime.
#    resources = resources, # only work for automatic runtime, will be ignored if you specify the runtime name.
    connections=connections
)
```

---

### View run results in Azure Machine Learning workspace

Submit flow run to cloud will return the portal url of the run. You can open the uri view the run results in the portal.

You can also use following command to view results for runs.

#### Stream the logs

# [Azure CLI](#tab/cli)

```sh
pfazure run stream --name <run_name>
```

# [Python SDK](#tab/python)

```python
pf.stream("<run_name>")
```

---

#### View run outputs

# [Azure CLI](#tab/cli)

```sh
pfazure run show-details --name <run_name>
```

# [Python SDK](#tab/python)

```python
details = pf.get_details(eval_run)
details.head(10)
```

---

#### View metrics of evaluation run

# [Azure CLI](#tab/cli)

```sh
pfazure run show-metrics --name <evaluation_run_name>
```

# [Python SDK](#tab/python)

```python
pf.get_metrics("evaluation_run_name")
```
---

> [!IMPORTANT]
> For more information, you can refer to [the prompt flow CLI documentation for Azure](https://microsoft.github.io/promptflow/reference/pfazure-command-reference.html).

## Iterative development from fine-tuning

### Local development and testing

During iterative development, as you refine and fine-tune your flow or prompts, it could be beneficial to carry out multiple iterations locally within your code repository. The community version, **prompt flow VS Code extension** and **prompt flow local SDK & CLI** is provided to facilitate pure local development and testing without Azure binding.

#### Prompt flow VS Code extension

With the prompt flow VS Code extension installed, you can easily author your flow locally from the VS Code editor, providing a similar UI experience as in the cloud.

To use the extension:

1. Open a prompt flow folder in VS Code Desktop.
2. Open the ```flow.dag.yaml`` file in notebook view.
3. Use the visual editor to make any necessary changes to your flow, such as tune the prompts in variants, or add more tools.
4. To test your flow, select the **Run Flow** button at the top of the visual editor. This will trigger a flow test.

:::image type="content" source="./media/how-to-integrate-with-llm-app-devops/run-flow-visual-editor.png" alt-text="Screenshot of VS Code showing running the flow in the visual editor. " lightbox = "./media/how-to-integrate-with-llm-app-devops/run-flow-visual-editor.png":::

#### Prompt flow local SDK & CLI

If you prefer to use Jupyter, PyCharm, Visual Studio, or other IDEs, you can directly modify the YAML definition in the ```flow.dag.yaml``` file.

:::image type="content" source="./media/how-to-integrate-with-llm-app-devops/flow-directory-and-yaml.png" alt-text="Screenshot of a yaml file in VS Code highlighting the default input and flow directory. " lightbox = "./media/how-to-integrate-with-llm-app-devops/flow-directory-and-yaml.png":::

You can then trigger a flow single run for testing using either the prompt flow CLI or SDK.

# [Azure CLI](#tab/cli)

Assuming you are in working directory `<path-to-the-sample-repo>/examples/flows/standard/`

```sh
pf flow test --flow web-classification  # "web-classification" is the directory name
```

:::image type="content" source="./media/how-to-integrate-with-llm-app-devops/flow-test-output-cli.png" alt-text="Screenshot of the flow test output in PowerShell." lightbox = "./media/how-to-integrate-with-llm-app-devops/flow-test-output-cli.png":::

# [Python SDK](#tab/python)

The return value of `test` function is the flow/node outputs.

```python
from promptflow import PFClient

pf_client = PFClient()

flow_path = "web-classification"  # "web-classification" is the directory name

# Test flow
flow_inputs = {"url": "https://www.youtube.com/watch?v=o5ZQyXaAv1g", "answer": "Channel", "evidence": "Url"}  # The inputs of the flow.
flow_result = pf_client.test(flow=flow_path, inputs=inputs)
print(f"Flow outputs: {flow_result}")

# Test node in the flow
node_name = "fetch_text_content_from_url"  # The node name in the flow.
node_inputs = {"url": "https://www.youtube.com/watch?v=o5ZQyXaAv1g"}  # The inputs of the node.
node_result = pf_client.test(flow=flow_path, inputs=node_inputs, node=node_name)
print(f"Node outputs: {node_result}")
```

:::image type="content" source="./media/how-to-integrate-with-llm-app-devops/flow-test-output.png" alt-text="Screenshot of the flow test output in Python. " lightbox = "./media/how-to-integrate-with-llm-app-devops/flow-test-output.png":::

---

This allows you to make and test changes quickly, without needing to update the main code repository each time. Once you're satisfied with the results of your local testing, you can then transfer to [submitting runs to the cloud from local repository](#submitting-runs-to-the-cloud-from-local-repository)  to perform experiment runs in the cloud.

For more details and guidance on using the local versions, you can refer to the [prompt flow GitHub community](https://github.com/microsoft/promptflow).

### Go back to studio UI for continuous development

Alternatively, you have the option to go back to the studio UI, using the cloud resources and experience to make changes to your flow in the flow authoring page.

To continue developing and working with the most up-to-date version of the flow files, you can access the terminal in the notebook and pull the latest changes of the flow files from your repository.

In addition, if you prefer continuing to work in the studio UI, you can directly import a local flow folder as a new draft flow. This allows you to seamlessly transition between local and cloud development.

:::image type="content" source="./media/how-to-integrate-with-llm-app-devops/flow-import-local-upload.png" alt-text="Screenshot of the create a new flow panel with upload to local highlighted. " lightbox = "./media/how-to-integrate-with-llm-app-devops/flow-import-local-upload.png":::

## CI/CD integration

### CI: Trigger flow runs in CI pipeline

Once you have successfully developed and tested your flow, and checked it in as the initial version, you're ready for the next tuning and testing iteration. At this stage, you can trigger flow runs, including batch testing and evaluation runs, using the prompt flow CLI. This could serve as an automated workflow in your Continuous Integration (CI) pipeline.

Throughout the lifecycle of your flow iterations, several operations can be automated:

- Running prompt flow after a Pull Request
- Running prompt flow evaluation to ensure results are high quality
- Registering of prompt flow models
- Deployment of prompt flow models

For a comprehensive guide on an end-to-end MLOps pipeline that executes a web classification flow, see [Set up end to end LLMOps with prompt Flow and GitHub](how-to-end-to-end-llmops-with-prompt-flow.md), and the [GitHub demo project](https://github.com/Azure/llmops-gha-demo).

### CD: Continuous deployment

The last step to go to production is to deploy your flow as an online endpoint in Azure Machine Learning. This allows you to integrate your flow into your application and make it available for use.

For more information on how to deploy your flow, see [Deploy flows to Azure Machine Learning managed online endpoint for real-time inference with CLI and SDK](how-to-deploy-to-code.md).

## Collaborating on flow development in production

In the context of developing a LLM-based application with prompt flow, collaboration amongst team members is often essential. Team members might be engaged in the same flow authoring and testing, working on diverse facets of the flow or making iterative changes and enhancements concurrently.

Such collaboration necessitates an efficient and streamlined approach to sharing code, tracking modifications, managing versions, and integrating these changes into the final project.

The introduction of the prompt flow **SDK/CLI** and the **Visual Studio Code Extension** as part of the code experience of prompt flow facilitates easy collaboration on flow development within your code repository. It is advisable to utilize a cloud-based **code repository**, such as GitHub or Azure DevOps, for tracking changes, managing versions, and integrating these modifications into the final project.

### Best practice for collaborative development

1. Authoring and single testing your flow locally - Code repository and VSC Extension

    - The first step of this collaborative process involves using a code repository as the base for your project code, which includes the prompt flow code. 
        - This centralized repository enables efficient organization, tracking of all code changes, and collaboration among team members.
    - Once the repository is set up, team members can leverage the VSC extension for local authoring and single input testing of the flow.
        - This standardized integrated development environment fosters collaboration among multiple members working on different aspects of the flow.
        :::image type="content" source="media/how-to-integrate-with-llm-app-devops/prompt-flow-local-develop.png" alt-text="Screenshot of local development. " lightbox = "media/how-to-integrate-with-llm-app-devops/prompt-flow-local-develop.png":::
1. Cloud-based experimental batch testing and evaluation - prompt flow CLI/SDK and workspace portal UI
    - Following the local development and testing phase, flow developers can use the pfazure CLI or SDK to submit batch runs and evaluation runs from the local flow files to the cloud.
        - This action provides a way for cloud resource consuming, results to be stored persistently and managed efficiently with a portal UI in the Azure Machine Learning workspace. This step allows for cloud resource consumption including compute and storage and further endpoint for deployments.
        :::image type="content" source="media/how-to-integrate-with-llm-app-devops/pfazure-run.png" alt-text="Screenshot of pfazure command to submit run to cloud. " lightbox = "media/how-to-integrate-with-llm-app-devops/pfazure-run.png":::
    - Post submissions to cloud, team members can access the cloud portal UI to view the results and manage the experiments efficiently.
        - This cloud workspace provides a centralized location for gathering and managing all the runs history, logs, snapshots, comprehensive results including the instance level inputs and outputs.
        :::image type="content" source="media/how-to-integrate-with-llm-app-devops/pfazure-run-snapshot.png" alt-text="Screenshot of cloud run snapshot. " lightbox = "media/how-to-integrate-with-llm-app-devops/pfazure-run-snapshot.png":::
        - In the run list that records all run history from during the development, team members can easily compare the results of different runs, aiding in quality analysis and necessary adjustments.
        :::image type="content" source="media/how-to-integrate-with-llm-app-devops/cloud-run-list.png" alt-text="Screenshot of run list in workspace. " lightbox = "media/how-to-integrate-with-llm-app-devops/cloud-run-list.png":::
        :::image type="content" source="media/how-to-integrate-with-llm-app-devops/cloud-run-compare.png" alt-text="Screenshot of run comparison in workspace. " lightbox = "media/how-to-integrate-with-llm-app-devops/cloud-run-compare.png":::
1. Local iterative development or one-step UI deployment for production
    - Following the analysis of experiments, team members can return to the code repository for additional development and fine-tuning. Subsequent runs can then be submitted to the cloud in an iterative manner. 
        - This iterative approach ensures consistent enhancement until the team is satisfied with the quality ready for production.
    - Once the team is fully confident in the quality of the flow, it can be seamlessly deployed via a UI wizard as an online endpoint in Azure Machine Learning. Once the team is entirely confident in the flow's quality, it can be seamlessly transitioned into production via a UI deploy wizard as an online endpoint in a robust cloud environment.
        - This deployment on an online endpoint can be based on a run snapshot, allowing for stable and secure serving, further resource allocation and usage tracking, and log monitoring in the cloud.
        :::image type="content" source="media/how-to-integrate-with-llm-app-devops/deploy-from-snapshot.png" alt-text="Screenshot of deploying flow from a run snapshot. " lightbox = "media/how-to-integrate-with-llm-app-devops/deploy-from-snapshot.png":::
        :::image type="content" source="media/how-to-integrate-with-llm-app-devops/deploy-wizard.png" alt-text="Screenshot of deploy wizard. " lightbox = "media/how-to-integrate-with-llm-app-devops/deploy-wizard.png":::

### Why we recommend using the code repository for collaborative development
For iterative development, a combination of a local development environment and a version control system, such as Git, is typically more effective. You can make modifications and test your code locally, then commit the changes to Git. This creates an ongoing record of your changes and offers the ability to revert to earlier versions if necessary.

When **sharing flows** across different environments is required, using a cloud-based code repository like GitHub or Azure Repos is advisable. This enables you to access the most recent version of your code from any location and provides tools for collaboration and code management.

By following this best practice, teams can create a seamless, efficient, and productive collaborative environment for prompt flow development.

## Next steps

- [Set up end-to-end LLMOps with prompt flow and GitHub](how-to-end-to-end-llmops-with-prompt-flow.md)
- [Prompt flow CLI documentation for Azure](https://microsoft.github.io/promptflow/reference/pfazure-command-reference.html)
