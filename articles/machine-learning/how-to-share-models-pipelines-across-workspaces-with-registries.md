---
title: Share models, components, and environments across workspaces with registries
titleSuffix: Azure Machine Learning
description: Learn how practice cross-workspace MLOps and collaborate across teams buy sharing models, components and environments through registries.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: kritifaujdar
author: fkriti
ms.reviewer: larryfr
ms.date: 11/02/2023
ms.topic: how-to
ms.custom: ignite-2022, devx-track-azurecli, build-2023
---

# Share models, components, and environments across workspaces with registries

Azure Machine Learning registry enables you to collaborate across workspaces within your organization. Using registries, you can share models, components, and environments.
 
There are two scenarios where you'd want to use the same set of models, components and environments in multiple workspaces:

* __Cross-workspace MLOps__: You're training a model in a `dev` workspace and need to deploy it to `test` and `prod` workspaces. In this case you, want to have end-to-end lineage between endpoints to which the model is deployed in `test` or `prod` workspaces and the training job, metrics, code, data and environment that was used to train the model in the `dev` workspace.
* __Share and reuse models and pipelines across different teams__: Sharing and reuse improve collaboration and productivity. In this scenario, you may want to publish a trained model and the associated components and environments used to train it to a central catalog. From there, colleagues from other teams can search and reuse the assets you shared in their own experiments.

In this article, you'll learn how to:

* Create an environment and component in the registry.
* Use the component from registry to submit a model training job in a workspace.
* Register the trained model in the registry.
* Deploy the model from the registry to an online-endpoint in the workspace, then submit an inference request.

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

- An Azure Machine Learning registry to share models, components and environments. To create a registry, see [Learn how to create a registry](how-to-manage-registries.md).

- An Azure Machine Learning workspace. If you don't have one, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create one.

    > [!IMPORTANT]
    > The Azure region (location) where you create your workspace must be in the list of supported regions for Azure Machine Learning registry

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

For the Python SDK example, use the `nyc_taxi_data_regression` sample from the [examples repository](https://github.com/Azure/azureml-examples). The sample notebook, [share-models-components-environments.ipynb,](https://github.com/Azure/azureml-examples/tree/main/sdk/python/assets/assets-in-registry/share-models-components-environments.ipynb) is available in the `sdk/python/assets/assets-in-registry` folder. All the sample YAML for components, model training code, sample data for training and inference is available in `cli/jobs/pipelines-with-components/nyc_taxi_data_regression`. Change to the `sdk/resources/registry` directory and open the `share-models-components-environments.ipynb` notebook if you'd like to step through a notebook to try out the code in this document.

---

### Create SDK connection

> [!TIP]
> This step is only needed when using the Python SDK.

Create a client connection to both the Azure Machine Learning workspace and registry:

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

## Create environment in registry

Environments define the docker container and Python dependencies required to run training jobs or deploy models. For more information on environments, see the following articles:

* [Environment concepts](./concept-environments.md)
* [How to create environments (CLI)](./how-to-manage-environments-v2.md) articles. 

# [Azure CLI](#tab/cli)

> [!TIP]
> The same CLI command `az ml environment create` can be used to create environments in a workspace or registry. Running the command with `--workspace-name` command creates the environment in a workspace whereas running the command with `--registry-name` creates the environment in the registry.

We'll create an environment that uses the `python:3.8` docker image and installs Python packages required to run a training job using the SciKit Learn framework. If you've cloned the examples repo and are in the folder `cli/jobs/pipelines-with-components/nyc_taxi_data_regression`, you should be able to see environment definition file `env_train.yml` that references the docker file `env_train/Dockerfile`. The `env_train.yml` is shown below for your reference:

```YAML
$schema: https://azuremlschemas.azureedge.net/latest/environment.schema.json
name: SKLearnEnv
version: 1
build:
  path: ./env_train
```

Create the environment using the `az ml environment create` as follows

```azurecli 
az ml environment create --file env_train.yml --registry-name <registry-name>
```

If you get an error that an environment with this name and version already exists in the registry, you can either edit the `version` field in `env_train.yml` or specify a different version on the CLI that overrides the version value in `env_train.yml`.

```azurecli 
# use shell epoch time as the version
version=$(date +%s)
az ml environment create --file env_train.yml --registry-name <registry-name> --set version=$version
```

> [!TIP]
> `version=$(date +%s)` works only in Linux. Replace `$version` with a random number if this does not work.

Note down the `name` and `version` of the environment from the output of the `az ml environment create` command and use them with `az ml environment show` commands as follows. You'll need the `name` and `version` in the next section when you create a component in the registry.

```azurecli
az ml environment show --name SKLearnEnv --version 1 --registry-name <registry-name>
```

> [!TIP]
> If you used a different environment name or version, replace the `--name` and `--version` parameters accordingly.

 You can also use `az ml environment list --registry-name <registry-name>` to list all environments in the registry.

# [Python SDK](#tab/python)

> [!TIP]
> The same `MLClient.environments.create_or_update()` can be used to create environments in either a workspace or a registry depending on the target it has been initialized with. Since you work wth both workspace and registry in this document, you have initialized `ml_client_workspace` and `ml_client_registry` to work with workspace and registry respectively. 


We'll create an environment that uses the `python:3.8` docker image and installs Python packages required to run a training job using the SciKit Learn framework. The `Dockerfile` with base image and list of Python packages to install is available in `cli/jobs/pipelines-with-components/nyc_taxi_data_regression/env_train`. Initialize the environment object and create the environment.

```python
env_docker_context = Environment(
    build=BuildContext(path="../../../../cli/jobs/pipelines-with-components/nyc_taxi_data_regression/env_train/"),
    name="SKLearnEnv",
    version=str(1),
    description="Scikit Learn environment",
)
ml_client_registry.environments.create_or_update(env_docker_context)
```

> [!TIP]
> If you get an error that an environment with this name and version already exists in the registry, specify a different version for the `version` parameter.

Note down the `name` and `version` of the environment from the output and pass them to the `ml_client_registry.environments.get()` method to fetch the environment from registry. 

You can also use `ml_client_registry.environments.list()` to list all environments in the registry.

---

You can browse all environments in the Azure Machine Learning studio. Make sure you navigate to the global UI and look for the __Registries__ entry.

:::image type="content" source="./media/how-to-share-models-pipelines-across-workspaces-with-registries/environment-in-registry.png" lightbox="./media/how-to-share-models-pipelines-across-workspaces-with-registries/environment-in-registry.png" alt-text="Screenshot of environments in the registry.":::

 
## Create a component in registry

Components are reusable building blocks of Machine Learning pipelines in Azure Machine Learning. You can package the code, command, environment, input interface and output interface of an individual pipeline step into a component. Then you can reuse the component across multiple pipelines without having to worry about porting dependencies and code each time you write a different pipeline.

Creating a component in a workspace allows you to use the component in any pipeline job within that workspace. Creating a component in a registry allows you to use the component in any pipeline in any workspace within your organization. Creating components in a registry is a great way to build modular reusable utilities or shared training tasks that can be used for experimentation by different teams within your organization.

For more information on components, see the following articles:
* [Component concepts](concept-component.md)
* [How to use components in pipelines (CLI)](how-to-create-component-pipelines-cli.md)
* [How to use components in pipelines (SDK)](how-to-create-component-pipeline-python.md)

# [Azure CLI](#tab/cli)

Make sure you are in the folder `cli/jobs/pipelines-with-components/nyc_taxi_data_regression`. You'll find the component definition file `train.yml` that packages a Scikit Learn training script `train_src/train.py` and the [curated environment](resource-curated-environments.md) `AzureML-sklearn-0.24-ubuntu18.04-py37-cpu`. We'll use the Scikit Learn environment created in pervious step instead of the curated environment. You can edit `environment` field in the `train.yml` to refer to your Scikit Learn environment. The resulting component definition file `train.yml` will be similar to the following example: 

```YAML
# <component>
$schema: https://azuremlschemas.azureedge.net/latest/commandComponent.schema.json
name: train_linear_regression_model
display_name: TrainLinearRegressionModel
version: 1
type: command
inputs:
  training_data: 
    type: uri_folder
  test_split_ratio:
    type: number
    min: 0
    max: 1
    default: 0.2
outputs:
  model_output:
    type: mlflow_model
  test_data:
    type: uri_folder
code: ./train_src
environment: azureml://registries/<registry-name>/environments/SKLearnEnv/versions/1`
command: >-
  python train.py 
  --training_data ${{inputs.training_data}} 
  --test_data ${{outputs.test_data}} 
  --model_output ${{outputs.model_output}}
  --test_split_ratio ${{inputs.test_split_ratio}}

```

If you used different name or version, the more generic representation looks like this: `environment: azureml://registries/<registry-name>/environments/<sklearn-environment-name>/versions/<sklearn-environment-version>`, so make sure you replace the `<registry-name>`,  `<sklearn-environment-name>` and `<sklearn-environment-version>` accordingly. You then run the `az ml component create` command to create the component as follows.

```azurecli
az ml component create --file train.yml --registry-name <registry-name>
```

> [!TIP]
> The same the CLI command `az ml component create` can be used to create components in a workspace or registry. Running the command with `--workspace-name` command creates the component in a workspace whereas running the command with `--registry-name` creates the component in the registry.

If you prefer to not edit the `train.yml`, you can override the environment name on the CLI as follows:

```azurecli
az ml component create --file train.yml --registry-name <registry-name>` --set environment=azureml://registries/<registry-name>/environments/SKLearnEnv/versions/1
# or if you used a different name or version, replace `<sklearn-environment-name>` and `<sklearn-environment-version>` accordingly
az ml component create --file train.yml --registry-name <registry-name>` --set environment=azureml://registries/<registry-name>/environments/<sklearn-environment-name>/versions/<sklearn-environment-version>
```

> [!TIP]
> If you get an error that the name of the component already exists in the registry, you can either edit the version in `train.yml` or override the version on the CLI with a random version.

Note down the `name` and `version` of the component from the output of the `az ml component create` command and use them with `az ml component show` commands as follows. You'll need the `name` and `version` in the next section when you create submit a training job in the workspace.

```azurecli 
az ml component show --name <component_name> --version <component_version> --registry-name <registry-name>
```
 You can also use `az ml component list --registry-name <registry-name>` to list all components in the registry.

# [Python SDK](#tab/python)

Review the component definition file `train.yml` and the Python code `train_src/train.py` to train a regression model using Scikit Learn available in the `cli/jobs/pipelines-with-components/nyc_taxi_data_regression` folder. Load the component object from the component definition file `train.yml`. 

```python
parent_dir = "../../../../cli/jobs/pipelines-with-components/nyc_taxi_data_regression"
train_model = load_component(path=parent_dir + "/train.yml")
print(train_model)
```

Update the `environment` to point to the `SKLearnEnv` environment created in the previous section and create the environment. 

```python
train_model.environment=env_from_registry
ml_client_registry.components.create_or_update(train_model)
```

> [!TIP]
> If you get an error that the name of the component already exists in the registry, you can either update the version with `train_model.version=<unique_version_number>` before creating the component. 

Note down the `name` and `version` of the component from the output and pass them to the `ml_client_registry.components.get()` method to fetch the component from registry. 

You can also use `ml_client_registry.components.list()` to list all components in the registry or browse all components in the Azure Machine Learning studio UI. Make sure you navigate to the global UI and look for the Registries hub.

---

You can browse all components in the Azure Machine Learning studio. Make sure you navigate to the global UI and look for the __Registries__ entry.

:::image type="content" source="./media/how-to-share-models-pipelines-across-workspaces-with-registries/component-in-registry.png" lightbox="./media/how-to-share-models-pipelines-across-workspaces-with-registries/component-in-registry.png" alt-text="Screenshot of components in the registry.":::

## Run a pipeline job in a workspace using component from registry

When running a pipeline job that uses a component from a registry, the _compute_ resources and _training data_ are local to the workspace. For more information on running jobs, see the following articles:

* [Running jobs (CLI)](./how-to-train-cli.md)
* [Running jobs (SDK)](./how-to-train-sdk.md)
* [Pipeline jobs with components (CLI)](./how-to-create-component-pipelines-cli.md)
* [Pipeline jobs with components (SDK)](./how-to-create-component-pipeline-python.md)

# [Azure CLI](#tab/cli)

We'll run a pipeline job with the Scikit Learn training component created in the previous section to train a model. Check that you are in the folder `cli/jobs/pipelines-with-components/nyc_taxi_data_regression`. The training dataset is located in the `data_transformed` folder. Edit the `component` section in under the `train_job` section of the `single-job-pipeline.yml` file to refer to the training component created in the previous section.  The resulting `single-job-pipeline.yml` is shown below.

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
        path: ./data_transformed
    outputs:
      model_output: 
        type: mlflow_model
      test_data: 
```  

The key aspect is that this pipeline is going to run in a workspace using a component that isn't in the specific workspace. The component is in a registry that can be used with any workspace in your organization. You can run this training job in any workspace you have access to without having worry about making the training code and environment available in that workspace. 

> [!WARNING]
> * Before running the pipeline job, confirm that the workspace in which you will run the job is in a Azure region that is supported by the registry in which you created the component.
> * Confirm that the workspace has a compute cluster with the name `cpu-cluster` or edit the `compute` field under `jobs.train_job.compute` with the name of your compute.

Run the pipeline job with the `az ml job create` command.

```azurecli
az ml job create --file single-job-pipeline.yml 
```

> [!TIP]
> If you have not configured the default workspace and resource group as explained in the prerequisites section, you will need to specify the `--workspace-name` and `--resource-group` parameters for the `az ml job create` to work.


Alternatively, ou can skip editing `single-job-pipeline.yml` and override the component name used by `train_job` in the CLI.

```azurecli
az ml job create --file single-job-pipeline.yml --set jobs.train_job.component=azureml://registries/<registry-name>/component/train_linear_regression_model/versions/1
```

Since the component used in the training job is shared through a registry, you can submit the job to any workspace that you have access to in your organization, even across different subscriptions. For example, if you have `dev-workspace`, `test-workspace` and `prod-workspace`, running the training job in these three workspaces is as easy as running three `az ml job create` commands. 

```azurecli
az ml job create --file single-job-pipeline.yml --workspace-name dev-workspace --resource-group <resource-group-of-dev-workspace>
az ml job create --file single-job-pipeline.yml --workspace-name test-workspace --resource-group <resource-group-of-test-workspace>
az ml job create --file single-job-pipeline.yml --workspace-name prod-workspace --resource-group <resource-group-of-prod-workspace>
```

# [Python SDK](#tab/python)

You'll run a pipeline job with the Scikit Learn training component created in the previous section to train a model. The training dataset is located in the `cli/jobs/pipelines-with-components/nyc_taxi_data_regression/data_transformed` folder. Construct the pipeline using the component created in the previous step. 

The key aspect is that this pipeline is going to run in a workspace using a component that isn't in the specific workspace. The component is in a registry that can be used with any workspace in your organization. You can run this training job in any workspace you have access to without having worry about making the training code and environment available in that workspace. 

```Python
@pipeline()
def pipeline_with_registered_components(
    training_data
):
    train_job = train_component_from_registry(
        training_data=training_data,
    )
pipeline_job = pipeline_with_registered_components(
    training_data=Input(type="uri_folder", path=parent_dir + "/data_transformed/"),
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
    pipeline_job, experiment_name="sdk_job_component_from_registry" ,  skip_validation=True
)
ml_client_workspace.jobs.stream(pipeline_job.name)
pipeline_job=ml_client_workspace.jobs.get(pipeline_job.name)
pipeline_job
```

> [!TIP]
> Notice that you are using `ml_client_workspace` to run the pipeline job whereas you had used `ml_client_registry` to use create environment and component.

Since the component used in the training job is shared through a registry, you can submit the job to any workspace that you have access to in your organization, even across different subscriptions. For example, if you have `dev-workspace`, `test-workspace` and `prod-workspace`, you can connect to those workspaces and resubmit the job.

---

In Azure Machine Learning studio, select the endpoint link in the job output to view the job. Here you can analyze training metrics, verify that the job is using the component and environment from registry, and review the trained model. Note down the `name` of the job from the output or find the same information from the job overview in Azure Machine Learning studio. You'll need this information to download the trained model in the next section on creating models in registry.

:::image type="content" source="./media/how-to-share-models-pipelines-across-workspaces-with-registries/job-using-component-from-registy-metrics.png" lightbox="./media/how-to-share-models-pipelines-across-workspaces-with-registries/job-using-component-from-registy-metrics.png" alt-text="Screenshot of the pipeline in Azure Machine Learning studio.":::

## Create a model in registry

You'll learn how to create models in a registry in this section. Review [manage models](./how-to-manage-models.md) to learn more about model management in Azure Machine Learning. We'll look at two different ways to create a model in a registry. First is from local files. Second, is to copy a model registered in the workspace to a registry. 

In both the options, you'll create model with the [MLflow format](./how-to-manage-models-mlflow.md), which will help you to [deploy this model for inference without writing any inference code](./how-to-deploy-mlflow-models-online-endpoints.md). 

### Create a model in registry from local files

# [Azure CLI](#tab/cli)

Download the model, which is available as output of the `train_job` by replacing `<job-name>` with the name from the job from the previous section. The model along with MLflow metadata files should be available in the `./artifacts/model/`.

```azurecli
# fetch the name of the train_job by listing all child jobs of the pipeline job
train_job_name=$(az ml job list --parent-job-name <job-name> --query [0].name | sed 's/\"//g')
# download the default outputs of the train_job
az ml job download --name $train_job_name 
# review the model files
ls -l ./artifacts/model/
```

> [!TIP]
> If you have not configured the default workspace and resource group as explained in the prerequisites section, you will need to specify the `--workspace-name` and `--resource-group` parameters for the `az ml model create` to work.

> [!WARNING]
> The output of `az ml job list` is passed to `sed`. This works only on Linux shells. If you are on Windows, run `az ml job list --parent-job-name <job-name> --query [0].name ` and strip any quotes you see in the train job name.

If you're unable to download the model, you can find sample MLflow model trained by the training job in the previous section in `cli/jobs/pipelines-with-components/nyc_taxi_data_regression/artifacts/model/` folder.

Create the model in the registry:

```azurecli
# create model in registry
az ml model create --name nyc-taxi-model --version 1 --type mlflow_model --path ./artifacts/model/ --registry-name <registry-name>
```

> [!TIP]
> * Use a random number for the `version` parameter if you get an error that model name and version exists.
> * The same the CLI command `az ml model create` can be used to create models in a workspace or registry. Running the command with `--workspace-name` command creates the model in a workspace whereas running the command with `--registry-name` creates the model in the registry.

# [Python SDK](#tab/python)

Make sure you use the `pipeline_job` object from the previous section or fetch the pipeline job using `ml_client_workspace.jobs.get(name="<pipeline-job-name>")` method to get the list of child jobs in the pipeline. You'll then look for the job with `display_name` as `train_job` and download the trained model from `train_job` output. The downloaded model along with MLflow metadata files should be available in the `./artifacts/model/`.

```python
jobs=ml_client_workspace.jobs.list(parent_job_name=pipeline_job.name)
for job in jobs:
    if (job.display_name == "train_job"):
        print (job.name)
        ml_client_workspace.jobs.download(job.name)
```
If you're unable to download the model, you can find sample MLflow model trained by the training job in the previous section in `sdk/resources/registry/model` folder.

Create the model in the registry.

```python
mlflow_model = Model(
    path="./artifacts/model/",
    type=AssetTypes.MLFLOW_MODEL,
    name="nyc-taxi-model",
    version=str(1), # use str(int(time.time())) if you want a random model number
    description="MLflow model created from local path",
)
ml_client_registry.models.create_or_update(mlflow_model)
```

---

### Share a model from workspace to registry 

In this workflow, you'll first create the model in the workspace and then share it to the registry. This workflow is useful when you want to test the model in the workspace before sharing it. For example, deploy it to endpoints, try out inference with some test data and then copy the model to a registry if everything looks good. This workflow may also be useful when you're developing a series of models using different techniques, frameworks or parameters and want to promote just one of them to the registry as a production candidate. 

# [Azure CLI](#tab/cli)

Make sure you have the name of the pipeline job from the previous section and replace that in the command to fetch the training job name below. You'll then register the model from the output of the training job into the workspace. Note how the `--path` parameter refers to the output `train_job` output with the `azureml://jobs/$train_job_name/outputs/artifacts/paths/model` syntax. 

```azurecli
# fetch the name of the train_job by listing all child jobs of the pipeline job
train_job_name=$(az ml job list --parent-job-name <job-name> --workspace-name <workspace-name> --resource-group <workspace-resource-group> --query [0].name | sed 's/\"//g')
# create model in workspace
az ml model create --name nyc-taxi-model --version 1 --type mlflow_model --path azureml://jobs/$train_job_name/outputs/artifacts/paths/model 
```

> [!TIP]
> * Use a random number for the `version` parameter if you get an error that model name and version exists.`
> * If you have not configured the default workspace and resource group as explained in the prerequisites section, you will need to specify the `--workspace-name` and `--resource-group` parameters for the `az ml model create` to work.

Note down the model name and version. You can validate if the model is registered in the workspace by browsing it in the Studio UI or using `az ml model show --name nyc-taxi-model --version $model_version` command.  

Next, you'll now share the model from the workspace to the registry. 


```azurecli
# share model registered in workspace to registry
az ml model share --name nyc-taxi-model --version 1 --registry-name <registry-name> --share-with-name <new-name> --share-with-version <new-version>
```

> [!TIP]
> * Make sure to use the right model name and version if you changed it in the `az ml model create` command.
> * The above command has two optional parameters "--share-with-name" and "--share-with-version". If these are not provided the new model will have the same name and version as the model that is being shared.
Note down the `name` and `version` of the model from the output of the `az ml model create` command and use them with `az ml model show` commands as follows. You'll need the `name` and `version` in the next section when you deploy the model to an online endpoint for inference. 

```azurecli 
az ml model show --name <model_name> --version <model_version> --registry-name <registry-name>
```

You can also use `az ml model list --registry-name <registry-name>` to list all models in the registry or browse all components in the Azure Machine Learning studio UI. Make sure you navigate to the global UI and look for the Registries hub.

# [Python SDK](#tab/python)

Make sure you use the `pipeline_job` object from the previous section or fetch the pipeline job using `ml_client_workspace.jobs.get(name="<pipeline-job-name>")` method to get the list of child jobs in the pipeline. You'll then look for the job with `display_name` as `train_job` and use the `name` of the `train_job` to construct the path pointing to the model output, which looks like this: `azureml://jobs/<job_name>/outputs/artifacts/paths/model`.

```python
jobs=ml_client_workspace.jobs.list(parent_job_name=pipeline_job.name)
for job in jobs:
    if (job.display_name == "train_job"):
        print (job.name)
        model_path_from_job="azureml://jobs/{job_name}/outputs/artifacts/paths/model".format(job_name=job.name)

print(model_path_from_job)
```

Register the model from the output of the training job into the workspace using the path constructed above.

```python
mlflow_model = Model(
    path=model_path_from_job,
    type=AssetTypes.MLFLOW_MODEL,
    name="nyc-taxi-model",
    version=version_timestamp,
    description="MLflow model created from job output",
)
ml_client_workspace.models.create_or_update(mlflow_model)
```

> [!TIP]
> Notice that you are using MLClient object `ml_client_workspace` since you are creating the model in the workspace. 

Note down the model name and version. You can validate if the model is registered in the workspace by browsing it in the Studio UI or fetching it using `ml_client_workspace.model.get()` method.

Next, you'll now share the model from the workspace to the registry.

```python
# share the model from registry to workspace
ml_client.models.share(name="nyc-taxi-model", version=1, registry_name=<registry_name>, share_with_name=<new-name>, share_with_version=<new-version>)
```

> [!TIP]
> The above code has two optional parameters "share-with-name" and "share-with-version". If these are not provided the new model will have the same name and version as the model that is being shared.

Note down the `name` and `version` of the model from the output and use them with `ml_client_workspace.model.get()` commands as follows. You'll need the `name` and `version` in the next section when you deploy the model to an online endpoint for inference. 

```python 
mlflow_model_from_registry = ml_client_registry.models.get(name="nyc-taxi-model", version=str(1))
print(mlflow_model_from_registry)
```
You can also use `ml_client_registry.models.list()` to list all models in the registry or browse all components in the Azure Machine Learning studio UI. Make sure you navigate to the global UI and look for the Registries hub.

---

The following screenshot shows a model in a registry in Azure Machine Learning studio. If you created a model from the job output and then copied the model from the workspace to registry, you'll see that the model has a link to the job that trained the model. You can use that link to navigate to the training job to review the code, environment and data used to train the model.

:::image type="content" source="./media/how-to-share-models-pipelines-across-workspaces-with-registries/model-in-registry.png" alt-text="Screenshot of the models in the registry.":::

## Deploy model from registry to online endpoint in workspace

In the last section, you'll deploy a model from registry to an online endpoint in a workspace. You can choose to deploy any workspace you have access to in your organization, provided the location of the workspace is one of the locations supported by the registry. This capability is helpful if you trained a model in a `dev` workspace and now need to deploy the model to `test` or `prod` workspace, while preserving the lineage information around the code, environment and data used to train the model.

Online endpoints let you deploy models and submit inference requests through the REST APIs. For more information, see [How to deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md).

# [Azure CLI](#tab/cli)

Create an online endpoint. 

```azurecli
az ml online-endpoint create --name reg-ep-1234
```

Update the `model:` line `deploy.yml` available in the `cli/jobs/pipelines-with-components/nyc_taxi_data_regression` folder to refer the model name and version from the pervious step. Create an online deployment to the online endpoint. The `deploy.yml` is shown below for reference.

```YAML
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
name: demo
endpoint_name: reg-ep-1234
model: azureml://registries/<registry-name>/models/nyc-taxi-model/versions/1
instance_type: Standard_DS2_v2
instance_count: 1
```
Create the online deployment. The deployment takes several minutes to complete. 

```azurecli
az ml online-deployment create --file deploy.yml --all-traffic
```

Fetch the scoring URI and submit a sample scoring request. Sample data for the scoring request is available in the `scoring-data.json` in the `cli/jobs/pipelines-with-components/nyc_taxi_data_regression` folder. 

```azurecli
ENDPOINT_KEY=$(az ml online-endpoint get-credentials -n reg-ep-1234 -o tsv --query primaryKey)
SCORING_URI=$(az ml online-endpoint show -n $ep_name -o tsv --query scoring_uri)
curl --request POST "$SCORING_URI" --header "Authorization: Bearer $ENDPOINT_KEY" --header 'Content-Type: application/json' --data @./scoring-data.json
```

> [!TIP]
> * `curl` command works only on Linux.
> * If you have not configured the default workspace and resource group as explained in the prerequisites section, you will need to specify the `--workspace-name` and `--resource-group` parameters for the `az ml online-endpoint` and `az ml online-deployment` commands to work.

# [Python SDK](#tab/python)

Create an online endpoint. 

```python
online_endpoint_name = "endpoint-" + datetime.datetime.now().strftime("%m%d%H%M%f")
endpoint = ManagedOnlineEndpoint(
    name=online_endpoint_name,
    description="this is a sample online endpoint for mlflow model",
    auth_mode="key"
)
ml_client_workspace.begin_create_or_update(endpoint)
```

Make sure you have the `mlflow_model_from_registry` model object from the previous section or fetch the model from the registry using `ml_client_registry.models.get()` method. Pass it to the deployment configuration object and create the online deployment. The deployment takes several minutes to complete. Set all traffic to be routed to the new deployment. 

```python
demo_deployment = ManagedOnlineDeployment(
    name="demo",
    endpoint_name=online_endpoint_name,
    model=mlflow_model_from_registry,
    instance_type="Standard_F4s_v2",
    instance_count=1
)
ml_client_workspace.online_deployments.begin_create_or_update(demo_deployment)

endpoint.traffic = {"demo": 100}
ml_client_workspace.begin_create_or_update(endpoint)
```

Submit a sample scoring request using the sample data file `scoring-data.json`. This file is available in the `cli/jobs/pipelines-with-components/nyc_taxi_data_regression` folder.

```azurecli
# test the  deployment with some sample data
ml_client_workspace.online_endpoints.invoke(
    endpoint_name=online_endpoint_name,
    deployment_name="demo",
    request_file=parent_dir + "/scoring-data.json"
)
```

---

## Clean up resources

If you aren't going use the deployment, you should delete it to reduce costs. The following example deletes the endpoint and all the underlying deployments:

# [Azure CLI](#tab/cli)

```azurecli
az ml online-endpoint delete --name reg-ep-1234 --yes --no-wait
```

# [Python SDK](#tab/python)

```python
ml_client_workspace.online_endpoints.begin_delete(name=online_endpoint_name)
```

---

## Next steps

* [How to share data assets using registries](how-to-share-data-across-workspaces-with-registries.md)
* [How to create and manage registries](how-to-manage-registries.md)
* [How to manage environments](how-to-manage-environments-v2.md)
* [How to train models](how-to-train-cli.md)
* [How to create pipelines using components](how-to-create-component-pipeline-python.md)
