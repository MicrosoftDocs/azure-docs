---
title: Share data across workspaces with registries (preview)
titleSuffix: Azure Machine Learning
description: Learn how practice cross-workspace MLOps and collaborate across teams by sharing data through registries.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: kritifaujdar
author: fkriti
ms.reviewer: larryfr
ms.date: 03/21/2023
ms.topic: how-to
ms.custom: devx-track-azurecli, sdkv2, build-2023
---

# Share data across workspaces with registries (preview)

Azure Machine Learning registry enables you to collaborate across workspaces within your organization. Using registries, you can share models, components, environments and data. Sharing data with registries is currently a preview feature. In this article, you learn how to:

* Create a data asset in the registry.
* Share an existing data asset from workspace to registry
* Use the data asset from registry as input to a model training job in a workspace.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

### Key scenario addressed by data sharing using Azure Machine Learning registry 

You may want to have data shared across multiple teams, projects, or workspaces in a central location. Such data doesn't have sensitive access controls and can be broadly used in the organization. 

Examples include: 
* A team wants to share a public dataset that is preprocessed and ready to use in experiments. 
* Your organization has acquired a particular dataset for a project from an external vendor and wants to make it available to all teams working on a project. 
* A team wants to share data assets across workspaces in different regions.

In these scenarios, you can create a data asset in a registry or share an existing data asset from a workspace to a registry. This data asset can then be used across multiple workspaces.

### Scenarios NOT addressed by data sharing using Azure Machine Learning registry

* Sharing sensitive data that requires fine grained access control. You can't create a data asset in a registry to share with a small subset of users/workspaces while the registry is accessible by many other users in the org. 

* Sharing data that is available in existing storage that must not be copied or is too large or too expensive to be copied. Whenever data assets are created in a registry, a copy of data is ingested into the registry storage so that it can be replicated.

### Data asset types supported by Azure Machine Learning registry

> [!TIP]
> Check out the following **canonical scenarios** when deciding if you want to use `uri_file`, `uri_folder`, or `mltable` for your scenario.

You can create three data asset types:

| Type        | V2 API           |     Canonical scenario  |
| :------------- |:-------------| :-----|
| **File:**  Reference a single file | `uri_file` | Read/write a single file - the file can have any format. |
|**Folder:** Reference a single folder   | `uri_folder`      |   You must read/write a directory of parquet/CSV files into Pandas/Spark. Deep-learning with images, text, audio, video files located in a directory. |
| **Table:** Reference a data table | `mltable`      |    You have a complex schema subject to frequent changes, or you need a subset of large tabular data. |

### Paths supported by Azure Machine Learning registry

When you create a data asset, you must specify a **path** parameter that points to the data location. Currently, the only supported paths are to locations on your local computer.

> [!TIP]
> "Local" means the local storage for the computer you are using. For example, if you're using a laptop, the local drive. If an Azure Machine Learning compute instance, the "local" drive of the compute instance.


## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

- Familiarity with [Azure Machine Learning registries](concept-machine-learning-registries-mlops.md) and [Data concepts in Azure Machine Learning](concept-data.md).

- An Azure Machine Learning registry to share data. To create a registry, see [Learn how to create a registry](how-to-manage-registries.md).

- An Azure Machine Learning workspace. If you don't have one, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create one.

    > [!IMPORTANT]
    > The Azure region (location) where you create your workspace must be in the list of supported regions for Azure Machine Learning registry.

- The *environment* and *component* created from the [How to share models, components, and environments](how-to-share-models-pipelines-across-workspaces-with-registries.md) article.

- The Azure CLI and the `ml` extension __or__ the Azure Machine Learning Python SDK v2:

    # [Azure CLI](#tab/cli)

    To install the Azure CLI and extension, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

    > [!IMPORTANT]
    > * The CLI examples in this article assume that you are using the Bash (or compatible) shell. For example, from a Linux system or [Windows Subsystem for Linux](/windows/wsl/about).
    > * The examples also assume that you have configured defaults for the Azure CLI so that you don't have to specify the parameters for your subscription, workspace, resource group, or location. To set default settings, use the following commands. Replace the following parameters with the values for your configuration:
    >
    >     * Replace `<subscription>` with your Azure subscription ID.
    >     * Replace `<workspace>` with your Azure Machine Learning workspace name.
    >     * Replace `<resource-group>` with the Azure resource group that contains your workspace.
    >     * Replace `<location>` with the Azure region that contains your workspace.
    >
    >     ```azurecli
    >     az account set --subscription <subscription>
    >     az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
    >     ```
    >     You can see what your current defaults are by using the `az configure -l` command.

    # [Python SDK](#tab/python)

    To install the Python SDK v2, use the following command:

    ```bash
    pip install --pre --upgrade azure-ai-ml azure-identity
    ```

    ---

### Clone examples repository

The code examples in this article are based on the `nyc_taxi_data_regression` sample in the [examples repository](https://github.com/Azure/azureml-examples). To use these files on your development environment, use the following commands to clone the repository and change directories to the example:

```bash
git clone https://github.com/Azure/azureml-examples
cd azureml-examples
```

# [Azure CLI](#tab/cli)

For the CLI example, change directories to `cli/jobs/pipelines-with-components/nyc_taxi_data_regression` in your local clone of the [examples repository](https://github.com/Azure/azureml-examples).

```bash
cd cli/jobs/pipelines-with-components/nyc_taxi_data_regression
```

# [Python SDK](#tab/python)

For the Python SDK example, use the `nyc_taxi_data_regression` sample from the [examples repository](https://github.com/Azure/azureml-examples). The sample notebook is available in the `sdk/python/assets/assets-in-registry` directory. All the sample YAML files  model training code, sample data for training and inference is available in `cli/jobs/pipelines-with-components/nyc_taxi_data_regression`. Change to the `sdk/resources/registry` directory and open the notebook if you'd like to step through a notebook to try out the code in this document.

---

### Create SDK connection

> [!TIP]
> This step is only needed when using the Python SDK.

Create a client connection to both the Azure Machine Learning workspace and registry. In the following example, replace the `<...>` placeholder values with the values appropriate for your configuration. For example, your Azure subscription ID, workspace name, registry name, etc.:

```python
ml_client_workspace = MLClient( credential=credential,
    subscription_id = "<workspace-subscription>",
    resource_group_name = "<workspace-resource-group",
    workspace_name = "<workspace-name>")
print(ml_client_workspace)

ml_client_registry = MLClient(credential=credential,
                        registry_name="<REGISTRY_NAME>",
                        registry_location="<REGISTRY_REGION>")
print(ml_client_registry)
```

## Create data in registry  

The data asset created in this step is used later in this article when submitting a training job.

# [Azure CLI](#tab/cli)

> [!TIP]
> The same CLI command `az ml data create` can be used to create data in a workspace or registry. Running the command with `--workspace-name` command creates the data in a workspace whereas running the command with `--registry-name` creates the data in the registry.

The data source is located in the [examples repository](https://github.com/Azure/azureml-examples) that you cloned earlier. Under the local clone, go to the following directory path: `cli/jobs/pipelines-with-components/nyc_taxi_data_regression`. In this directory, create a YAML file named `data-registry.yml` and use the following YAML as the contents of the file:

```YAML
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
name: transformed-nyc-taxt-data
description: Transformed NYC Taxi data created from local folder.
version: 1
type: uri_folder
path: data_transformed/
```

The `path` value points to the `data_transformed` subdirectory, which contains the data that is shared using the registry.

To create the data in the registry, use the `az ml data create`. In the following examples, replace `<registry-name>` with the name of your registry.

```azurecli 
az ml data create --file data-registry.yml --registry-name <registry-name>
```

If you get an error that data with this name and version already exists in the registry, you can either edit the `version` field in `data-registry.yml` or specify a different version on the CLI that overrides the version value in `data-registry.yml`.

```azurecli 
# use shell epoch time as the version
version=$(date +%s)
az ml data create --file data-registry.yml --registry-name <registry-name> --set version=$version
```

> [!TIP]
> If the `version=$(date +%s)` command doesn't set the `$version` variable in your environment, replace `$version` with a random number.

Save the `name` and `version` of the data from the output of the `az ml data create` command and use them with `az ml data show` command to view details for the asset.

```azurecli
az ml data show --name transformed-nyc-taxt-data --version 1 --registry-name <registry-name>
```

> [!TIP]
> If you used a different data name or version, replace the `--name` and `--version` parameters accordingly.

 You can also use `az ml data list --registry-name <registry-name>` to list all data assets in the registry.

# [Python SDK](#tab/python)

> [!TIP]
> The same `MLClient.environmentsdata.create_or_update()` can be used to create data in either a workspace or a registry depending on the target it has been initialized with. Since you work wth both workspace and registry in this document, you have initialized `ml_client_workspace` and `ml_client_registry` to work with workspace and registry respectively. 


The source data directory `data_transformed` is available in `cli/jobs/pipelines-with-components/nyc_taxi_data_regression/`. Initialize the data object and create the data.

```python
my_path = "./data_transformed/"
my_data = Data(path=my_path,
               type=AssetTypes.URI_FOLDER,
               description="Transformed NYC Taxi data created from local folder.",
               name="transformed-nyc-taxt-data",
               version='1')
ml_client_registry.data.create_or_update(my_data)
```

> [!TIP]
> If you get an error that an data with this name and version already exists in the registry, specify a different version for the `version` parameter.

Note down the `name` and `version` of the data from the output and pass them to the `ml_client_registry.data.get()` method to fetch the data from registry. 

You can also use `ml_client_registry.data.list()` to list all data assets in the registry.

---
 
## Create an environment and component in registry

To create an environment and component in the registry, use the steps in the [How to share models, components, and environments](how-to-share-models-pipelines-across-workspaces-with-registries.md) article. The environment and component are used in the training job in next section. 

> [!TIP]
> You can use an environment and component from the workspace instead of using ones from the registry.

## Run a pipeline job in a workspace using component from registry

When running a pipeline job that uses a component and data from a registry, the *compute* resources are local to the workspace. In the following example, the job uses the Scikit Learn training component and the data asset created in the previous sections to train a model.

> [!NOTE]
> The key aspect is that this pipeline is going to run in a workspace using training data that isn't in the specific workspace. The data is in a registry that can be used with any workspace in your organization. You can run this training job in any workspace you have access to without having worry about making the training data available in that workspace. 

# [Azure CLI](#tab/cli)

Verify that you are in the `cli/jobs/pipelines-with-components/nyc_taxi_data_regression` directory. Edit the `component` section in under the `train_job` section of the `single-job-pipeline.yml` file to refer to the training component and `path` under `training_data` section to refer to data asset created in the previous sections. The following example shows what the `single-job-pipeline.yml` looks like after editing. Replace the `<registry_name>` with the name for your registry:

```YAML
$schema: https://azuremlschemas.azureedge.net/latest/pipelineJob.schema.json
type: pipeline
display_name: nyc_taxi_data_regression_single_job
description: Single job pipeline to train regression model based on nyc taxi dataset

jobs:
  train_job:
    type: command
    component: azureml://registries/<registry-name>/component/train_linear_regression_model/versions/1
    compute: azureml:cpu-cluster
    inputs:
      training_data: 
        type: uri_folder
        path: azureml://registries/<registry-name>/data/transformed-nyc-taxt-data/versions/1
    outputs:
      model_output: 
        type: mlflow_model
      test_data: 
```  

> [!WARNING]
> * Before running the pipeline job, confirm that the workspace in which you will run the job is in a Azure region that is supported by the registry in which you created the data.
> * Confirm that the workspace has a compute cluster with the name `cpu-cluster` or edit the `compute` field under `jobs.train_job.compute` with the name of your compute.

Run the pipeline job with the `az ml job create` command.

```azurecli
az ml job create --file single-job-pipeline.yml 
```

> [!TIP]
> If you have not configured the default workspace and resource group as explained in the prerequisites section, you will need to specify the `--workspace-name` and `--resource-group` parameters for the `az ml job create` to work.

For more information on running jobs, see the following articles:

* [Running jobs (CLI)](./how-to-train-cli.md)
* [Pipeline jobs with components (CLI)](./how-to-create-component-pipelines-cli.md)

# [Python SDK](#tab/python)


```Python
# get the data asset
data_asset_from_registry = ml_client_registry.data.get(name="transformed-nyc-taxt-data", version="1")

@pipeline()
def pipeline_with_registered_components(
    training_data
):
    train_job = train_component_from_registry(
        training_data=training_data,
    )
pipeline_job = pipeline_with_registered_components(
    training_data=Input(type="uri_folder", path=data_asset_from_registry.id"),
)
pipeline_job.settings.default_compute = "cpu-cluster"
print(pipeline_job)
```

> [!WARNING]
> * Confirm that the workspace in which you will run this job is in a Azure location that is supported by the registry in which you created the component before you run the pipeline job.
> * Confirm that the workspace has a compute cluster with the name `cpu-cluster` or update it `pipeline_job.settings.default_compute=<compute-cluster-name>`.

Run the pipeline job and wait for it to complete. 

```python
pipeline_job = ml_client_workspace.jobs.create_or_update(
    pipeline_job, experiment_name="sdk_job_data_from_registry" ,  skip_validation=True
)
ml_client_workspace.jobs.stream(pipeline_job.name)
pipeline_job=ml_client_workspace.jobs.get(pipeline_job.name)
pipeline_job
```

> [!TIP]
> Notice that you are using `ml_client_workspace` to run the pipeline job whereas you had used `ml_client_registry` to use create environment and component.

Since the component used in the training job is shared through a registry, you can submit the job to any workspace that you have access to in your organization, even across different subscriptions. For example, if you have `dev-workspace`, `test-workspace` and `prod-workspace`, you can connect to those workspaces and resubmit the job.

For more information on running jobs, see the following articles:

* [Running jobs (SDK)](./how-to-train-sdk.md)
* [Pipeline jobs with components (SDK)](./how-to-create-component-pipeline-python.md)

---

### Share data from workspace to registry 

The following steps show how to share an existing data asset from a workspace to a registry. 

# [Azure CLI](#tab/cli)

First, create a data asset in the workspace. Make sure that you are in the `cli/assets/data` directory. The `local-folder.yml` located in this directory is used to create a data asset in the workspace. The data specified in this file is available in the `cli/assets/data/sample-data` directory. The following YAML is the contents of the `local-folder.yml` file:

```YAML
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
name: local-folder-example-titanic
description: Dataset created from local folder.
type: uri_folder
path: sample-data/
```

To create the data asset in the workspace, use the following command:

```azurecli
az ml data create -f local-folder.yml
```

For more information on creating data assets in a workspace, see [How to create data assets](how-to-create-data-assets.md).  

The data asset created in the workspace can be shared to a registry. From the registry, it can be used in multiple workspaces. Note that we are passing `--share_with_name` and `--share_with_version` parameter in share function. These parameters are optional and if you do not pass these data will be shared with same name and version as in workspace.

The following example demonstrates using share command to share a data asset. Replace `<registry-name>` with the name of the registry that the data will be shared to.

```azurecli
az ml data share --name local-folder-example-titanic --version <version-in-workspace> --share-with-name <name-in-registry> --share-with-version <version-in-registry> --registry-name <registry-name>
```

# [Python SDK](#tab/python)

First, create a data asset in the workspace. Make sure that you are in `sdk/assets/data` directory. The data is available in the `sdk/assets/data/sample-data` directory.

```python
my_path = "./sample-data/"
my_data = Data(path=my_path,
               type=AssetTypes.URI_FOLDER,
               description="",
               name="titanic-dataset",
               version='1')
ml_client_workspace.data.create_or_update(my_data)

```

For more information on creating data assets in a workspace, see [How to create data assets](how-to-create-data-assets.md).  

The data asset created in workspace can be shared to a registry and it can be used in multiple workspaces from there. You can also change the name and version when sharing the data from workspace to registry.

Note that we are passing `share_with_name` and `share_with_version` parameter in share function. These parameters are optional and if you do not pass these data will be shared with same name and version as in workspace.

```python
# Sharing data from workspace to registry
ml_client_workspace.data.share(
    name="titanic-dataset",
    version="1",
    registry_name="<REGISTRY_NAME>",
    share_with_name=<name-in-registry>,
    share_with_version=<version-in-registry>,
)
```

---



## Next steps

* [How to create and manage registries](how-to-manage-registries.md)
* [How to manage environments](how-to-manage-environments-v2.md)
* [How to train models](how-to-train-cli.md)
* [How to create pipelines using components](how-to-create-component-pipeline-python.md)
