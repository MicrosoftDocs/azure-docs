---
title: Use Apache Spark in a machine learning pipeline (preview)
titleSuffix: Azure Machine Learning
description: Link your Azure Synapse Analytics workspace to your Azure machine learning pipeline to use Apache Spark for data manipulation.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: laobri
author: lobrien
ms.date: 03/04/2021
ms.topic: conceptual
ms.custom: how-to, synapse-azureml

# Customer intent: As a user of both Azure Machine Learning pipelines and Azure Synapse Analytics, I'd like to use Apache Spark for the data preparation of my pipeline

---

# How to use Apache Spark (powered by Azure Synapse Analytics) in your machine learning pipeline (preview)

In this article, you'll learn how to use Apache Spark pools powered by Azure Synapse Analytics as the compute target for a data preparation step in an Azure Machine Learning pipeline. You'll learn how a single pipeline can use compute resources suited for the specific step, such as data preparation or training. You'll see how data is prepared for the Spark step and how it's passed to the next step. 

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* Create an [Azure Machine Learning workspace](how-to-manage-workspace.md) to hold all your pipeline resources.

* [Configure your development environment](how-to-configure-environment.md) to install the Azure Machine Learning SDK, or use an [Azure Machine Learning compute instance](concept-compute-instance.md) with the SDK already installed.

* Create an Azure Synapse Analytics workspace and Apache Spark pool (see [Quickstart: Create a serverless Apache Spark pool using Synapse Studio](../synapse-analytics/quickstart-create-apache-spark-pool-studio.md)). 

## Link your Azure Machine Learning workspace and Azure Synapse Analytics workspace 

You create and administer your Apache Spark pools in an Azure Synapse Analytics workspace. To integrate an Apache Spark pool with an Azure Machine Learning workspace, you must [link to the Azure Synapse Analytics workspace](how-to-link-synapse-ml-workspaces.md). 

You can attach an Apache Spark pool via Azure Machine Learning studio UI by using the **Linked Services** page. You may also do it via the **Compute** page with the **Attach compute** option.

You may also attach an Apache Spark pool via SDK (as elaborated below) or via an ARM template (see this [Example ARM template](https://github.com/Azure/azure-quickstart-templates/blob/master/101-machine-learning-linkedservice-create/azuredeploy.json)). 

You can use the command line to follow the ARM template, add the linked service, and attach the Apache Spark pool with the following code:

```bash
az deployment group create --name --resource-group <rg_name> --template-file "azuredeploy.json" --parameters @"azuredeploy.parameters.json"
```

> [!Important]
> To link to the Azure Synapse Analytics workspace successfully, you must have the Owner role in the Azure Synapse Analytics workspace resource. Check your access in the Azure portal.
> The linked service will get a System Assigned Identity (SAI) when you create it. You must assign this link service SAI the "Synapse Apache Spark administrator" role from Synapse Studio so that it can submit the Spark job (see [How to manage Synapse RBAC role assignments in Synapse Studio](../synapse-analytics/security/how-to-manage-synapse-rbac-role-assignments.md)). You must also give the user of the Azure Machine Learning workspace the role "Contributor" from Azure portal of resource mangement.

## Create or retrieve the link between your Azure Synapse Analytics workspace and your Azure Machine Learning workspace

You can retrieve linked services in your workspace with code such as:

```python
from azureml.core import Workspace, LinkedService, SynapseWorkspaceLinkedServiceConfiguration

ws = Workspace.from_config()

for service in LinkedService.list(ws) : 
    print(f"Service: {service}")

# Retrieve a known linked service
linked_service = LinkedService.get(ws, 'synapselink1')
```

First, `Workspace.from_config()` accesses your Azure Machine Learning workspace using the configuration in `config.json` (see [Tutorial: Get started with Azure Machine Learning in your development environment](tutorial-1st-experiment-sdk-setup-local.md)). Then, the code prints all of the linked services available in the Workspace. Finally, `LinkedService.get()` retrieves a linked service named `'synapselink1'`. 

## Attach your Apache spark pool as a compute target for Azure Machine Learning

To use your Apache spark pool to power a step in your machine learning pipeline, you must attach it as a `ComputeTarget` for the pipeline step, as shown in the following code.

```python
from azureml.core.compute import SynapseCompute, ComputeTarget

attach_config = SynapseCompute.attach_configuration(
        linked_service = linked_service,
        type="SynapseSpark",
        pool_name="spark01") # This name comes from your Synapse workspace

synapse_compute=ComputeTarget.attach(
        workspace=ws,
        name='link1-spark01',
        attach_configuration=attach_config)

synapse_compute.wait_for_completion()
```

The first step is to configure the `SynapseCompute`. The `linked_service` argument is the `LinkedService` object you created or retrieved in the previous step. The `type` argument must be `SynapseSpark`. The `pool_name` argument in `SynapseCompute.attach_configuration()` must match that of an existing pool in your Azure Synapse Analytics workspace. For more information on creating an Apache spark pool in the Azure Synapse Analytics workspace, see [Quickstart: Create a serverless Apache Spark pool using Synapse Studio](../synapse-analytics/quickstart-create-apache-spark-pool-studio.md). The type of `attach_config` is `ComputeTargetAttachConfiguration`.

Once the configuration is created, you create a machine learning `ComputeTarget` by passing in the `Workspace`, `ComputeTargetAttachConfiguration`, and the name by which you'd like to refer to the compute within the machine learning workspace. The call to `ComputeTarget.attach()` is asynchronous, so the sample blocks until the call completes.

## Create a `SynapseSparkStep` that uses the linked Apache Spark pool

The sample notebook [Spark job on Apache spark pool](https://github.com/azure/machinelearningnotebooks/blob/master/how-to-use-azureml/azure-synapse/spark_job_on_synapse_spark_pool.ipynb) defines a simple machine learning pipeline. First, the notebook defines a data preparation step powered by the `synapse_compute` defined in the previous step. Then,  the notebook defines a training step powered by a compute target better suited for training. The sample notebook uses the Titanic survival database to demonstrate data input and output; it doesn't actually clean the data or make a predictive model. Since there's no real training in this sample, the training step uses an inexpensive, CPU-based compute resource.

Data flows into a machine learning pipeline by way of `DatasetConsumptionConfig` objects, which can hold tabular data or sets of files. The data often comes from files in blob storage in a workspace's datastore. The following code shows some typical code for creating input for a machine learning pipeline:

```python
from azureml.core import Dataset

datastore = ws.get_default_datastore()
file_name = 'Titanic.csv'

titanic_tabular_dataset = Dataset.Tabular.from_delimited_files(path=[(datastore, file_name)])
step1_input1 = titanic_tabular_dataset.as_named_input("tabular_input")

# Example only: it wouldn't make sense to duplicate input data, especially one as tabular and the other as files
titanic_file_dataset = Dataset.File.from_files(path=[(datastore, file_name)])
step1_input2 = titanic_file_dataset.as_named_input("file_input").as_hdfs()
```

The above code assumes that the file `Titanic.csv` is in blob storage. The code shows how to read the file as a `TabularDataset` and as a `FileDataset`. This code is for demonstration purposes only, as it would be confusing to duplicate inputs or to interpret a single data source as both a table-containing resource and just as a file.

> [!Important]
> In order to use a `FileDataset` as input, your `azureml-core` version must be at least `1.20.0`. How to specify this using the `Environment` class is discussed below.

When a step completes, you may choose to store output data using code similar to:

```python
from azureml.data import HDFSOutputDatasetConfig
step1_output = HDFSOutputDatasetConfig(destination=(datastore,"test")).register_on_complete(name="registered_dataset")
```

In this case, the data would be stored in the `datastore` in a file called `test` and would be available within the machine learning workspace as a `Dataset` with the name `registered_dataset`.

In addition to data, a pipeline step may have per-step Python dependencies. Individual `SynapseSparkStep` objects can specify their precise Azure Synapse Apache Spark configuration, as well. This is shown in the following code, which specifies that the `azureml-core` package version must be at least `1.20.0`. (As mentioned previously, this requirement for `azureml-core` is needed to use a `FileDataset` as an input.)

```python
from azureml.core.environment import Environment
from azureml.pipeline.steps import SynapseSparkStep

env = Environment(name="myenv")
env.python.conda_dependencies.add_pip_package("azureml-core>=1.20.0")

step_1 = SynapseSparkStep(name = 'synapse-spark',
                          file = 'dataprep.py',
                          source_directory="./code", 
                          inputs=[step1_input1, step1_input2],
                          outputs=[step1_output],
                          arguments = ["--tabular_input", step1_input1, 
                                       "--file_input", step1_input2,
                                       "--output_dir", step1_output],
                          compute_target = 'link1-spark01',
                          driver_memory = "7g",
                          driver_cores = 4,
                          executor_memory = "7g",
                          executor_cores = 2,
                          num_executors = 1,
                          environment = env)
```

The above code specifies a single step in the Azure machine learning pipeline. This step's `environment` specifies a specific `azureml-core` version and could add other conda or pip dependencies as necessary.

The `SynapseSparkStep` will zip and upload from the local computer the subdirectory `./code`. That directory will be recreated on the compute server and the step will run the file `dataprep.py` from that directory. The `inputs` and `outputs` of that step are the `step1_input1`, `step1_input2`, and `step1_output` objects previously discussed. The easiest way to access those values within the `dataprep.py` script is to associate them with named `arguments`.

The next set of arguments to the `SynapseSparkStep` constructor control Apache Spark. The `compute_target` is the `'link1-spark01'` that we attached as a compute target previously. The other parameters specify the memory and cores we'd like to use.

The sample notebook uses the following code for `dataprep.py`:

```python
import os
import sys
import azureml.core
from pyspark.sql import SparkSession
from azureml.core import Run, Dataset

print(azureml.core.VERSION)
print(os.environ)

import argparse
parser = argparse.ArgumentParser()
parser.add_argument("--tabular_input")
parser.add_argument("--file_input")
parser.add_argument("--output_dir")
args = parser.parse_args()

# use dataset sdk to read tabular dataset
run_context = Run.get_context()
dataset = Dataset.get_by_id(run_context.experiment.workspace,id=args.tabular_input)
sdf = dataset.to_spark_dataframe()
sdf.show()

# use hdfs path to read file dataset
spark= SparkSession.builder.getOrCreate()
sdf = spark.read.option("header", "true").csv(args.file_input)
sdf.show()

sdf.coalesce(1).write\
.option("header", "true")\
.mode("append")\
.csv(args.output_dir)
```

This "data preparation" script doesn't do any real data transformation, but illustrates how to retrieve data, convert it to a spark dataframe, and how to do some basic Apache Spark manipulation. You can find the output in Azure Machine Learning Studio by opening the child run, choosing the **Outputs + logs** tab, and opening the `logs/azureml/driver/stdout` file, as shown in the following figure.

:::image type="content" source="media/how-to-use-synapsesparkstep/synapsesparkstep-stdout.png" alt-text="Screenshot of Studio showing stdout tab of child run":::

## Use the `SynapseSparkStep` in a pipeline

The following example uses the output from the `SynapseSparkStep` created in the [previous section](#create-a-synapsesparkstep-that-uses-the-linked-apache-spark-pool). Other steps in the pipeline may have their own unique environments and run on different compute resources appropriate to the task at hand. The sample notebook runs the "training step" on a small CPU cluster:

```python
from azureml.core.compute import AmlCompute

cpu_cluster_name = "cpucluster"

if cpu_cluster_name in ws.compute_targets:
    cpu_cluster = ComputeTarget(workspace=ws, name=cpu_cluster_name)
    print('Found existing cluster, use it.')
else:
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2', max_nodes=1)
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)
    print('Allocating new CPU compute cluster')

cpu_cluster.wait_for_completion(show_output=True)

step2_input = step1_output.as_input("step2_input").as_download()

step_2 = PythonScriptStep(script_name="train.py",
                          arguments=[step2_input],
                          inputs=[step2_input],
                          compute_target=cpu_cluster_name,
                          source_directory="./code",
                          allow_reuse=False)
```

The code above creates the new compute resource if necessary. Then, the `step1_output` result is converted to input for the training step. The `as_download()` option means that the data will be moved onto the compute resource, resulting in faster access. If the data was so large that it wouldn't fit on the local compute hard drive, you would use the `as_mount()` option to stream the data via the FUSE filesystem. The `compute_target` of this second step is `'cpucluster'`, not the `'link1-spark01'` resource you used in the data preparation step. This step uses a simple program `train.py` instead of the `dataprep.py` you used in the previous step. You can see the details of `train.py` in the sample notebook.

Once you've defined all of your steps, you can create and run your pipeline. 

```python
from azureml.pipeline.core import Pipeline

pipeline = Pipeline(workspace=ws, steps=[step_1, step_2])
pipeline_run = pipeline.submit('synapse-pipeline', regenerate_outputs=True)
```

The above code creates a pipeline consisting of the data preparation step on Apache Spark pools powered by Azure Synapse Analytics (`step_1`) and the training step (`step_2`). Azure calculates the execution graph by examining the data dependencies between the steps. In this case, there's only a straightforward dependency that `step2_input` necessarily requires `step1_output`.

The call to `pipeline.submit` creates, if necessary, an Experiment called `synapse-pipeline` and asynchronously begins a Run within it. Individual steps within the pipeline are run as Child Runs of this main run and can be monitored and reviewed in the Experiments page of Studio.

## Next steps

* [Publish and track machine learning pipelines](how-to-deploy-pipelines.md) 
* [Monitor Azure Machine Learning](monitor-azure-machine-learning.md)
* [Use automated ML in an Azure Machine Learning pipeline in Python](how-to-use-automlstep-in-pipelines.md)
