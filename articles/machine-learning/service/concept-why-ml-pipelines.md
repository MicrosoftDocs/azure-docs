---
title: 'Why Use ML Pipelines'
titleSuffix: Azure Machine Learning service
description: Pipelines are a powerful tool for data scientists and developers to build, optimize, and manage their machine learning workflows. This article will give an overview of when, where, and how they can benefit you.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: laobri
author: lobrien
ms.date: 09/14/2019
---

# Why use ML pipelines in an Azure Machine Learning service?

Azure Machine Learning pipelines allow you to create workflows in your machine learning projects. These workflows have a number of benefits: 

+ Simplicity
+ Speed
+ Repeatability
+ Flexibility
+ Modularity 
+ Quality assurance
+ Cost control

These benefits become significant as soon as your machine learning project moves beyond pure exploration and into iteration. Even simple one-step pipelines can be valuable. Machine learning projects are often in a complex state, and it can be a relief to make the precise execution of a single workflow a "no-brainer." 

## What can Azure ML pipelines do?

An Azure Machine Learning pipeline is an independently executable workflow of a machine learning stage. An Azure Machine Learning pipeline can be as simple as one that calls a Python script, so _may_ do just about anything. Pipelines _should_ focus on machine learning tasks such as:

+ Data preparation including importing, validating and cleaning, munging and transformation, normalization, and staging
+ Training configuration including parameterizing arguments, filepaths, and logging / reporting configurations
+ Training and validating efficiently and repeatably, which might include specifying specific data subsets, different hardware compute resources, distributed processing, and progress monitoring
+ Deployment, including versioning, scaling, provisioning, and access control 

In short, all of the complex tasks of the machine learning lifecycle can be helped with workflows. Other Azure pipeline technologies have their own strengths, such as [Azure Data Factory pipelines](https://docs.microsoft.com/azure/data-factory/concepts-pipelines-activities) for data manipulation and [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/) for continuous integration and deployment. But if your focus is machine learning, Azure Machine Learning pipelines are likely to be the best choice for your workflow needs. 

## What _are_ Azure ML pipelines?

An Azure Machine Learning pipeline performs a complete logical workflow with an ordered sequence of steps. Each step is a discrete processing action. Pipelines run in the context of an Azure Machine Learning [Experiment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment.experiment?view=azure-ml-py).

In the very early stages of an ML project, it's fine to have a single Jupyter notebook or Python script that does all the work of Azure workspace and resource configuration, data preparation, run configuration, training, and validation. But just as functions and classes quickly become preferable to a single imperative block of code, ML workflows quickly become preferable to a monolithic notebook or script. 

By modularizing ML stages, pipelines support the Computer Science imperative that a component should "do (only) one thing well." Modularity is clearly vital to project success when programming in teams, but even when working alone, even a small ML project involves separate tasks, each with a good amount of complexity. Tasks include: workspace configuration and data access, data preparation, model definition and configuration, and deployment. While the outputs of one or more tasks form the inputs to another, the exact implementation details of any one task are, at best, irrelevant distractions in the next. At worst, the computational state of one task can cause a bug in another.  

If you've used compiled languages, you may be familiar with tools like Make or [MSBuild](https://docs.microsoft.com/visualstudio/msbuild/msbuild?view=vs-2019) that orchestrate builds. These tools use file timestamps to calculate dependencies between compilation units. When a file is changed, only it and its dependents are recompiled. Azure Machine Learning pipelines extend this concept dramatically. Like traditional build tools, pipelines calculate dependencies between steps and only perform the necessary recalculations. 

The dependency analysis in Azure Machine Learning pipelines is more sophisticated than simple timestamps though. Every step may run in a different hardware and software environment. Data preparation might be a time-consuming process but not need to run on hardware with powerful GPUs, certain steps might require OS-specific software, you might only want to use distributed training after you've become confident in your model and data, and so forth. While the cost savings for optimizing resources may be significant, it can be overwhelming to manually juggle all the different variations in hardware and software resources. It's even harder to do all that without ever making a mistake in the data you transfer between steps. 

Pipelines solve this problem. The Azure Machine Learning service automatically orchestrates all of the dependencies between pipeline steps. This orchestration might include spinning up and down Docker images, attaching and detaching compute resources, and moving data between the steps in a consistent and automated manner.

Additionally, the output of a step may, if you choose, be reused. If you specify reuse as a possibility and there are no upstream dependencies triggering recalculation, the pipeline service will use a cached version of the step's results. Such reuse can dramatically decrease development time. If you have a complex data preparation task, you probably rerun it more often than is strictly necessary. Pipelines relieve you of that worry: if necessary, the step will run, if not, it won't.

All of this dependency analysis, orchestration, and activation are handled by the Azure Machine Learning service when you instantiate a [Pipeline](https://docs.microsoft.com/api/azureml-pipeline-core/azureml.pipeline.core.pipeline(class)?view=azure-ml-py) object, pass it to an `Experiment`, and call `submit()`. 

When you create and run a `Pipeline` object, the following high-level steps occur:

+ For each step, the service calculates requirements for:
    + Hardware compute resources
    + OS resources (Docker image(s))
    + Software resources (Conda / virtualenv dependencies)
    + Data inputs 
+ The service determines the dependencies between steps, resulting in an execution graph
+ When each node in the execution graph runs:
    + The service configures the necessary hardware and software environment (perhaps reusing existing resources)
    + The step runs, providing logging and monitoring information to its containing `Experiment` object
    + When the step completes, its outputs are prepared as inputs to the next step and/or written to storage
    + Resources that are no longer needed are finalized and detached

![Pipeline steps](media/how-to-create-your-first-pipeline/run_an_experiment_as_a_pipeline.png)

## How Do I Program Pipelines with the Azure Machine Learning Python SDK?

In the [Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py), a pipeline is a Python object defined in the `azureml.pipeline.core` module. A [Pipeline](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipeline%28class%29?view=azure-ml-py) object contains an ordered sequence of one or more [PipelineStep](https://docs.microsoft.com/api/azureml-pipeline-core/azureml.pipeline.core.builder.pipelinestep?view=azure-ml-py) objects. The `PipelineStep` class is abstract and the actual steps will be of subclasses such as [EstimatorStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.estimatorstep?view=azure-ml-py), [PythonScriptStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.pythonscriptstep?view=azure-ml-py), or [DataTransferStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.datatransferstep?view=azure-ml-py). The [ModuleStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.modulestep?view=azure-ml-py) class holds a reusable sequence of steps that can be shared among pipelines. A `Pipeline` executes as part of an `Experiment`.

An Azure Machine Learning pipeline is associated with an Azure Machine Learning service workspace and a pipeline step is associated with a compute target available within that workspace. For more information, see this [article about workspaces](https://docs.microsoft.com/azure/machine-learning/service/how-to-manage-workspace) or this explanation of [compute targets](https://docs.microsoft.com/azure/machine-learning/service/concept-compute-target).

In Azure Machine Learning, a compute target is the environment in which an ML phase occurs. The software environment may be a Remote VM, Azure Machine Learning Compute, Azure Databricks, Azure Batch, and so on. The hardware environment can also vary greatly, depending on GPU support, memory, storage, and so forth. You may specify the compute target for each step, which gives you fine-grained control over costs. You can use more- or less- powerful resources depending on the specific action, data volume, and performance needs of your project. 

The steps within a pipeline may have dependencies on other steps. The Azure Machine Learning pipeline service does the work of analyzing and orchestrating these dependencies. The nodes in the resulting "execution graph" are processing steps. Each step may involve creating or reusing a particular combination of hardware and software resources, reusing cached results, and so on. The service's orchestration and optimization of this execution graph can significantly speed up an ML phase and reduce costs. 

Because steps execute independently, objects to hold the input and output data that flows between steps must be defined externally. This is the role of [DataReference](https://docs.microsoft.com/python/api/azureml-core/azureml.data.data_reference.datareference?view=azure-ml-py), [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py), and associated classes. These data objects are associated with a [Datastore](https://docs.microsoft.com/python/api/azureml-core/azureml.core.datastore%28class%29?view=azure-ml-py) object that encapsulates their storage configuration. The `PipelineStep` base class is always created with a `name` string, a list of `inputs`, and a list of `outputs`. Usually, it also has a list of `arguments` and often it will have a list of `resource_inputs`. Subclasses will generally have additional arguments as well (for instance, `PythonScriptStep` requires the filename and path of the script to run). 

The execution graph is acyclic, but pipelines can be run on a recurring schedule and can execute Python scripts that can write state information to the file system, making it possible to create complex profiles. If you design your pipeline so that certain steps may run in parallel or asynchronously, the Azure Machine Learning service transparently handles the dependency analysis and coordination of fan-out and fan-in. You generally don't have to concern yourself with the details of the execution graph, but it's available via the [Pipeline.graph](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipeline.pipeline?view=azure-ml-py#attributes) attribute. 

This snippet shows the objects and calls needed to create and run a basic `Pipeline`:

```python
ws = Workspace.from_config() 
blob_store = Datastore(ws, "workspaceblobstore")
compute_target = ws.compute_targets["STANDARD_NC6"]
experiment = Experiment(ws, 'MyExperiment') 

input_data = DataReference(
    datastore=Datastore(ws, blob_store),
    data_reference_name="test_data",
    path_on_datastore="20newsgroups/20news.pkl")

output_data = PipelineData(
    "output_data",
    datastore=blob_store,
    output_name="output_data1")

steps = [ PythonScriptStep(
    script_name="train.py",
    arguments=["--input", input_data, "--output", output_data],
    inputs=[input_data],
    outputs=[output_data],
    compute_target=compute_target,
    source_directory="myfolder"
) ]

pipeline = Pipeline(workspace=ws, steps=steps)

pipeline_run = experiment.submit(pipeline)
pipeline_run.wait_for_completion()
```

The snippet starts with common Azure Machine Learning objects, a `Workspace`, a `Datastore`, a [ComputeTarget](https://docs.microsoft.com/python/api/azureml-core/azureml.core.computetarget?view=azure-ml-py), and an `Experiment`. Then, the code creates the objects to hold `input_data` and `output_data`. The array `steps` holds a single element, a `PythonScriptStep` that will use the data objects and run on the `compute_target`. Then, the code instantiates the `Pipeline` object itself, passing in the workspace and steps array. The call to `experiment.submit(pipeline)` begins the Azure Machine Learning pipeline run. The call to `wait_for_completion()` blocks until the pipeline is finished. 


{>> Does the pipeline API have ways to monitor and react to backpressure? <<}

## When Should I Use Azure Machine Learning Pipelines?

As you can see, creating an Azure Machine Learning pipeline is a little more complex than starting a script. Pipelines require a few Python objects be configured and created. In a team environment, the value of dividing ML stages into multiple independent steps is probably clear: developers can work and evolve their programs independently. For projects in or near deployment, the advantages of nailing down the configuration in familiar Python code and using scheduled and event-driven operations are obvious.

Even if you are in the early stages of an ML project or working alone, though, Azure Machine Learning pipelines can help. When programming, you will always spend much more time changing and rerunning your code rather than writing it in the first place. Investing in automating the build process almost always pays off quickly. As soon as you start spending mental effort recreating the configuration and computational state before executing a new idea, that's a signal that you might consider using a pipeline to automate the workflow. 

### When _Shouldn't_ I Use Azure Machine Learning Pipelines?

It's easy to become enthusiastic about reusing cached results, fine-grained control over compute costs, and process isolation, but pipelines do have costs. Scoping variables to a function, object, or a module goes a heck of a long way to avoiding confusing programmatic state! A pipeline step is much more expensive than a function call! 

A particular red flag is heavy coupling between pipeline steps. If refactoring a dependent step frequently requires modifying the outputs of a previous step, it's likely that separating the steps is currently more of a cost than a benefit. Another clue that something is wrong is if the arguments to a step are not data but flags to control processing. 

Another temptation is prematurely optimizing compute resources. For instance, there are often several stages to data preparation and one can often see "Oh, here's a place where I could use an `MpiStep` for parallel-programming but here's a place where I could use a `PythonScriptStep` with a less-powerful compute target," and so forth. And maybe, in the long run, creating fine-grained steps like that might prove worthwhile, especially if there's a possibility to use cached results rather than always recalculating. But pipelines are not intended to be a substitute for the `multiprocessing` module. 

Until a project gets large or nears deployment, your pipelines should be coarser rather than fine-grained. If you think of your ML project as involving _stages_ and a pipeline as providing a complete workflow to move you through a particular stage, you're on the right path. 

## Conclusion

Azure Machine Learning pipelines are a powerful facility that begins delivering value in the early development stages. The value increases as the team and project grows. This article has explained how pipelines are specified with the Azure Machine Learning Python SDK and orchestrated on Azure. You've seen some basic source code and been introduced to a few of the `PipelineStep` classes that are available. You should have a sense of when to use Azure Machine Learning pipelines and how Azure runs them. 

## Next steps

{>> tk Link to Larry Franks article <<}

+ Learn how to [create your first pipeline](how-to-create-your-first-pipeline.md).

+ Learn how to [run batch predictions on large data](how-to-run-batch-predictions.md).

+ See the [SDK reference docs for pipelines](https://docs.microsoft.com/python/api/azureml-pipeline-core/?view=azure-ml-py).

+ Try out example Jupyter notebooks showcasing [Azure Machine Learning pipelines](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines). Learn how to [run notebooks to explore this service](samples-notebooks.md).
