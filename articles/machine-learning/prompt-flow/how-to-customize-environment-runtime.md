---
title: Customize environment for runtime in Prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Learn how to create customized environment for runtime in Prompt flow with Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: cloga
ms.author: lochen
ms.reviewer: lagayhar
ms.date: 06/30/2023
---

# Customize environment for runtime (preview)


> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Customize environment with docker context for runtime

This section assumes you have knowledge of [Docker](https://www.docker.com/) and [Azure Machine Learning environments](../concept-environments.md).

### Step-1: Prepare the docker context

#### Create `image_build` folder

In your local environment, create a folder contains following files, the folder structure should look like this:

```
|--image_build
|  |--requirements.txt
|  |--Dockerfile
|  |--environment-build.yaml
|  |--environment.yaml
```

#### Define your required packages in `requirements.txt`

**Optional**: Add packages in private pypi repository.

Using the following command to download your packages to local: `pip wheel <package_name> --index-url=<private pypi> --wheel-dir <local path to save packages>`

Open the `requirements.txt` file and add your extra packages and specific version in it.  For example:

```
###### Requirements with Version Specifiers ######
langchain == 0.0.149        # Version Matching. Must be version 0.6.1
keyring >= 4.1.1            # Minimum version 4.1.1
coverage != 3.5             # Version Exclusion. Anything except version 3.5
Mopidy-Dirble ~= 1.1        # Compatible release. Same as >= 1.1, == 1.*
```

You can obtain the path of local packages using `ls > requirements.txt`.

#### Define the `Dockerfile`

Create a `Dockerfile` and add the following content, then save the file:

```
FROM <Base_image>
COPY ./* ./
RUN pip install -r requirements.txt
```

> [!NOTE]
> This docker image should be built from prompt flow base image that is `mcr.microsoft.com/azureml/promptflow/promptflow-runtime:<newest_version>`. If possible use the [latest version of the base image](https://mcr.microsoft.com/v2/azureml/promptflow/promptflow-runtime/tags/list). 

### Step 2: Use Azure Machine Learning environment to build image

#### Define your environment in `environment_build.yaml`

In your local compute, you can use the CLI (v2) to create a customized environment based on your docker image.

> [!NOTE]
> - Make sure to meet the [prerequisites](../how-to-manage-environments-v2.md#prerequisites) for creating environment.
> - Ensure you have [connected to your workspace](../how-to-manage-environments-v2.md?#connect-to-the-workspace).

> [!IMPORTANT]
> Prompt flow is **not supported** in the workspace which has data isolation enabled. The enableDataIsolation flag can only be set at the workspace creation phase and can't be updated.
>
>Prompt flow is **not supported** in the project workspace which was created with a workspace hub. The workspace hub is a private preview feature.

```shell
az login(optional)
az account set --subscription <subscription ID>
az configure --defaults workspace=<Azure Machine Learning workspace name> group=<resource group>
```

Open the `environment_build.yaml` file and add the following content. Replace the <environment_name_docker_build> placeholder with your desired environment name.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/environment.schema.json
name: <environment_name_docker_build>
build:
  path: .
```

#### Run CLI command to create an environment

```bash
cd image_build
az login(optional)
az ml environment create -f environment_build.yaml --subscription <sub-id> -g <resource-group> -w <workspace>
```

> [!NOTE]
> Building the image may take several minutes.

#### Locate the image in ACR

Go to the environment page to find the built image in your workspace Azure Container Registry (ACR).

:::image type="content" source="./media/how-to-customize-environment-runtime/runtime-update-env-custom-environment-list.png" alt-text="Screenshot of environments on the custom tab. " lightbox = "./media/how-to-customize-environment-runtime/runtime-update-env-custom-environment-list.png":::

Find the image in ACR.

:::image type="content" source="./media/how-to-customize-environment-runtime/runtime-update-env-custom-environment-acr.png" alt-text="Screenshot of environments showing the details tab of the image. " lightbox = "./media/how-to-customize-environment-runtime/runtime-update-env-custom-environment-acr.png":::

> [!IMPORTANT]
> Make sure the `Environment image build status` is `Succeeded`  before using it in the next step.

### Step 3: Create a custom Azure Machine Learning environment for runtime

Open the `environment.yaml` file and add the following content. Replace the `<environment_name>` placeholder with your desired environment name and change `<image_build_in_acr>` to the ACR image found in the step 2.3.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/environment.schema.json
name: <environment_name>
image: <image_build_in_acr>
inference_config:
  liveness_route:
    port: 8080
    path: /health
  readiness_route:
    port: 8080
    path: /health
  scoring_route:
    port: 8080
    path: /score
```

Using following CLI command to create the environment:

```bash
cd image_build # optional if you already in this folder
az login(optional)
az ml environment create -f environment.yaml --subscription <sub-id> -g <resource-group> -w <workspace>
```

Go to your workspace UI page, go to the `environment` page,  and locate the custom environment you created. You can now use it to create a runtime in your Prompt flow. To learn more, see:

- [Create compute instance runtime in UI](how-to-create-manage-runtime.md#create-compute-instance-runtime-in-ui)
- [Create managed online endpoint runtime in UI](how-to-create-manage-runtime.md#create-managed-online-endpoint-runtime-in-ui)

To Learn more about environment CLI, see [Manage environments](../how-to-manage-environments-v2.md#manage-environments).

## Create a custom application on compute instance that can be used as Prompt flow runtime

A prompt flow runtime is a custom application that runs on a compute instance. You can create a custom application on a compute instance and then use it as a Prompt flow runtime. To create a custom application for this purpose, you need to specify the following properties:

| UI             | SDK                         | Note                                                                           |
|----------------|-----------------------------|--------------------------------------------------------------------------------|
| Docker image   | ImageSettings.reference     | Image used to build this custom application                                    |
| Target port    | EndpointsSettings.target    | Port where you want to access the application, the port inside the container   |
| published port | EndpointsSettings.published | Port where your application is running in the image, the publicly exposed port |

### Create custom application as Prompt flow runtime via SDK v2

```python
# import required libraries
import os
from azure.ai.ml import MLClient
from azure.ai.ml.entities import WorkspaceConnection
# Import required libraries
from azure.identity import DefaultAzureCredential, InteractiveBrowserCredential

try:
    credential = DefaultAzureCredential()
    # Check if given credential can get token successfully.
    credential.get_token("https://management.azure.com/.default")
except Exception as ex:
    # Fall back to InteractiveBrowserCredential in case DefaultAzureCredential not work
    credential = InteractiveBrowserCredential()

from azure.ai.ml.entities import ComputeInstance 
from azure.ai.ml.entities import CustomApplications, ImageSettings, EndpointsSettings, VolumeSettings 

ml_client = MLClient.from_config(credential=credential)

image = ImageSettings(reference='mcr.microsoft.com/azureml/promptflow/promptflow-runtime:<newest_version>') 

endpoints = [EndpointsSettings(published=8081, target=8080)]

app = CustomApplications(name='promptflow-runtime',endpoints=endpoints,bind_mounts=[],image=image,environment_variables={}) 

ci_basic_name = "<compute_instance_name>"

ci_basic = ComputeInstance(name=ci_basic_name, size="<instance_type>",custom_applications=[app]) 

ml_client.begin_create_or_update(ci_basic)
```

> [!NOTE]
> Change `newest_version`, `compute_instance_name` and `instance_type` to your own value.

### Create custom application as Prompt flow runtime via Azure Resource Manager template

You can use this Azure Resource Manager template to create compute instance with custom application.

 [![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fcloga%2Fazure-quickstart-templates%2Flochen%2Fpromptflow%2Fquickstarts%2Fmicrosoft.machinelearningservices%2Fmachine-learning-prompt-flow%2Fcreate-compute-instance-with-custom-application%2Fazuredeploy.json)

To learn more, see [Azure Resource Manager template for custom application as Prompt flow runtime on compute instance](https://github.com/cloga/azure-quickstart-templates/tree/lochen/promptflow/quickstarts/microsoft.machinelearningservices/machine-learning-prompt-flow/create-compute-instance-with-custom-application). 

## Create custom application as Prompt flow runtime via Compute instance UI

Follow [this document to add custom application](../how-to-create-compute-instance.md#setup-other-custom-applications).

:::image type="content" source="./media/how-to-customize-environment-runtime/runtime-creation-add-custom-application-ui.png" alt-text="Screenshot of compute showing custom applications. " lightbox = "./media/how-to-customize-environment-runtime/runtime-creation-add-custom-application-ui.png":::

## Create managed online deployment that can be used as Prompt flow runtime

### Create managed online deployment that can be used as Prompt flow runtime via CLI v2

Learn more about [deploy and score a machine learning model by using an online endpoint](../how-to-deploy-online-endpoints.md)

#### Create managed online endpoint

To define a managed online endpoint, you can use the following yaml template. Make sure to replace the `ENDPOINT_NAME` with the desired name for your endpoint.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
name: <ENDPOINT_NAME>
description: this is a sample promptflow endpoint
auth_mode: key
```

Use following CLI command `az ml online-endpoint create -f <yaml_file> -g <resource_group> -w <workspace_name>` to create managed online endpoint. To learn more, see [Deploy and score a machine learning model by using an online endpoint](../how-to-deploy-online-endpoints.md).

#### Create Prompt flow runtime image config file

To configure your Prompt flow runtime, place the following config file in your model folder. This config file provides the necessary information for the runtime to work properly.

For the `mt_service_endpoint` parameter, follow this format: `https://<region>.api.azureml.ms`. For example, if your region is eastus, then your service endpoint should be `https://eastus.api.azureml.ms`

```yaml
storage:
  storage_account: <WORKSPACE_LINKED_STORAGE>
deployment:
  subscription_id: <SUB_ID>
  resource_group: <RG_NAME>
  workspace_name: <WORKSPACE_NAME>
  endpoint_name: <ENDPOINT_NAME>
  deployment_name: blue
  mt_service_endpoint: <PROMPT_FLOW_SERVICE_ENDPOINT>
```

#### Create managed online endpoint

You need to replace the following placeholders with your own values:

- `ENDPOINT_NAME`: the name of the endpoint you created in the previous step
- `PRT_CONFIG_FILE`: the name of the config file that contains the port and runtime settings
- `IMAGE_NAME` to name of your own image, for example: `mcr.microsoft.com/azureml/promptflow/promptflow-runtime:<newest_version>`, you can also follow [Customize environment with docker context for runtime](#customize-environment-with-docker-context-for-runtime) to create your own environment.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
name: blue
endpoint_name: <ENDPOINT_NAME>
type: managed
model:
  path: ./
  type: custom_model
instance_count: 1
# 4core, 32GB
instance_type: Standard_E4s_v3
request_settings:
  max_concurrent_requests_per_instance: 10
  request_timeout_ms: 90000
environment_variables:
  PRT_CONFIG_FILE: <PRT_CONFIG_FILE>
environment:
  name: promptflow-runtime
  image: <IMAGE_NAME>
  inference_config:
    liveness_route:
      port: 8080
      path: /health
    readiness_route:
      port: 8080
      path: /health
    scoring_route:
      port: 8080
      path: /score

```

Use following CLI command `az ml online-deployment create -f <yaml_file> -g <resource_group> -w <workspace_name>` to create managed online deployment that can be used as a Prompt flow runtime.

Follow [Create managed online endpoint runtime in UI](how-to-create-manage-runtime.md#create-managed-online-endpoint-runtime-in-ui) to select this deployment as Prompt flow runtime.

## Next steps

- [Develop a standard flow](how-to-develop-a-standard-flow.md)
- [Develop a chat flow](how-to-develop-a-chat-flow.md)
