---
title: Upgrade hyperparameter tuning to SDK v2
titleSuffix: Azure Machine Learning
description: Upgrade hyperparameter tuning from v1 to v2 of Azure Machine Learning SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: SturgeonMi
ms.author: xunwan 
ms.date: 09/16/2022
ms.reviewer: sgilley
ms.custom: migration
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade hyperparameter tuning to SDK v2

In SDK v2, tuning hyperparameters are consolidated into jobs.

A job has a type. Most jobs are command jobs that run a `command`, like `python main.py`. What runs in a job is agnostic to any programming language, so you can run `bash` scripts, invoke `python` interpreters, run a bunch of `curl` commands, or anything else.

A sweep job is another type of job, which defines sweep settings and can be initiated by calling the sweep method of command.

To upgrade, you'll need to change your code for defining and submitting your hyperparameter tuning experiment to SDK v2. What you run _within_ the job doesn't need to be upgraded to SDK v2. However, it's recommended to remove any code specific to Azure Machine Learning from your model training scripts. This separation allows for an easier transition between local and cloud and is considered best practice for mature MLOps. In practice, this means removing `azureml.*` lines of code. Model logging and tracking code should be replaced with MLflow. For more information, see [how to use MLflow in v2](how-to-use-mlflow-cli-runs.md).

This article gives a comparison of scenario(s) in SDK v1 and SDK v2.

## Run hyperparameter tuning in an experiment

* SDK v1

    ```python
    from azureml.core import ScriptRunConfig, Experiment, Workspace
    from azureml.train.hyperdrive import RandomParameterSampling, BanditPolicy, HyperDriveConfig, PrimaryMetricGoal
    from azureml.train.hyperdrive import choice, loguniform
    
    dataset = Dataset.get_by_name(ws, 'mnist-dataset')
    
    # list the files referenced by mnist dataset
    dataset.to_path()
    
    #define the search space for your hyperparameters
    param_sampling = RandomParameterSampling(
        {
            '--batch-size': choice(25, 50, 100),
            '--first-layer-neurons': choice(10, 50, 200, 300, 500),
            '--second-layer-neurons': choice(10, 50, 200, 500),
            '--learning-rate': loguniform(-6, -1)
        }
    )
    
    args = ['--data-folder', dataset.as_named_input('mnist').as_mount()]
    
    #Set up your script run
    src = ScriptRunConfig(source_directory=script_folder,
                          script='keras_mnist.py',
                          arguments=args,
                          compute_target=compute_target,
                          environment=keras_env)
    
    # Set early stopping on this one
    early_termination_policy = BanditPolicy(evaluation_interval=2, slack_factor=0.1)
    
    # Define the configurations for your hyperparameter tuning experiment
    hyperdrive_config = HyperDriveConfig(run_config=src,
                                         hyperparameter_sampling=param_sampling,
                                         policy=early_termination_policy,
                                         primary_metric_name='Accuracy',
                                         primary_metric_goal=PrimaryMetricGoal.MAXIMIZE,
                                         max_total_runs=20,
                                         max_concurrent_runs=4)
    # Specify your experiment details                                     
    experiment = Experiment(workspace, experiment_name)
    
    hyperdrive_run = experiment.submit(hyperdrive_config)
    
    #Find the best model
    best_run = hyperdrive_run.get_best_run_by_primary_metric()
    ```

* SDK v2

    ```python
    from azure.ai.ml import MLClient
    from azure.ai.ml import command, Input
    from azure.ai.ml.sweep import Choice, Uniform, MedianStoppingPolicy
    from azure.identity import DefaultAzureCredential
    
    # Create your command
    command_job_for_sweep = command(
        code="./src",
        command="python main.py --iris-csv ${{inputs.iris_csv}} --learning-rate ${{inputs.learning_rate}} --boosting ${{inputs.boosting}}",
        environment="AzureML-lightgbm-3.2-ubuntu18.04-py37-cpu@latest",
        inputs={
            "iris_csv": Input(
                type="uri_file",
                path="https://azuremlexamples.blob.core.windows.net/datasets/iris.csv",
            ),
            #define the search space for your hyperparameters
            "learning_rate": Uniform(min_value=0.01, max_value=0.9),
            "boosting": Choice(values=["gbdt", "dart"]),
        },
        compute="cpu-cluster",
    )
    
    # Call sweep() on your command job to sweep over your parameter expressions
    sweep_job = command_job_for_sweep.sweep(
        compute="cpu-cluster", 
        sampling_algorithm="random",
        primary_metric="test-multi_logloss",
        goal="Minimize",
    )
    
    # Define the limits for this sweep
    sweep_job.set_limits(max_total_trials=20, max_concurrent_trials=10, timeout=7200)
    
    # Set early stopping on this one
    sweep_job.early_termination = MedianStoppingPolicy(delay_evaluation=5, evaluation_interval=2)
    
    # Specify your experiment details
    sweep_job.display_name = "lightgbm-iris-sweep-example"
    sweep_job.experiment_name = "lightgbm-iris-sweep-example"
    sweep_job.description = "Run a hyperparameter sweep job for LightGBM on Iris dataset."
    
    # submit the sweep
    returned_sweep_job = ml_client.create_or_update(sweep_job)
    
    # get a URL for the status of the job
    returned_sweep_job.services["Studio"].endpoint
    
    # Download best trial model output
    ml_client.jobs.download(returned_sweep_job.name, output_name="model")
    ```

## Run hyperparameter tuning in a pipeline

* SDK v1

    ````python
    
    tf_env = Environment.get(ws, name='AzureML-TensorFlow-2.0-GPU')
    data_folder = dataset.as_mount()
    src = ScriptRunConfig(source_directory=script_folder,
                          script='tf_mnist.py',
                          arguments=['--data-folder', data_folder],
                          compute_target=compute_target,
                          environment=tf_env)
    
    #Define HyperDrive configs
    ps = RandomParameterSampling(
        {
            '--batch-size': choice(25, 50, 100),
            '--first-layer-neurons': choice(10, 50, 200, 300, 500),
            '--second-layer-neurons': choice(10, 50, 200, 500),
            '--learning-rate': loguniform(-6, -1)
        }
    )
    
    early_termination_policy = BanditPolicy(evaluation_interval=2, slack_factor=0.1)
    
    hd_config = HyperDriveConfig(run_config=src, 
                                 hyperparameter_sampling=ps,
                                 policy=early_termination_policy,
                                 primary_metric_name='validation_acc', 
                                 primary_metric_goal=PrimaryMetricGoal.MAXIMIZE, 
                                 max_total_runs=4,
                                 max_concurrent_runs=4)
                                 
    metrics_output_name = 'metrics_output'
    metrics_data = PipelineData(name='metrics_data',
                                datastore=datastore,
                                pipeline_output_name=metrics_output_name,
                                training_output=TrainingOutput("Metrics"))
    
    model_output_name = 'model_output'
    saved_model = PipelineData(name='saved_model',
                                datastore=datastore,
                                pipeline_output_name=model_output_name,
                                training_output=TrainingOutput("Model",
                                                               model_file="outputs/model/saved_model.pb"))
    #Create HyperDriveStep
    hd_step_name='hd_step01'
    hd_step = HyperDriveStep(
        name=hd_step_name,
        hyperdrive_config=hd_config,
        inputs=[data_folder],
        outputs=[metrics_data, saved_model])                             
    
    #Find and register best model
    conda_dep = CondaDependencies()
    conda_dep.add_pip_package("azureml-sdk")
    
    rcfg = RunConfiguration(conda_dependencies=conda_dep)
    
    register_model_step = PythonScriptStep(script_name='register_model.py',
                                           name="register_model_step01",
                                           inputs=[saved_model],
                                           compute_target=cpu_cluster,
                                           arguments=["--saved-model", saved_model],
                                           allow_reuse=True,
                                           runconfig=rcfg)
    
    register_model_step.run_after(hd_step)
    
    #Run the pipeline
    pipeline = Pipeline(workspace=ws, steps=[hd_step, register_model_step])
    pipeline_run = exp.submit(pipeline)
    
    ````

* SDK v2

    ```python
    train_component_func = load_component(path="./train.yml")
    score_component_func = load_component(path="./predict.yml")
    
    # define a pipeline
    @pipeline()
    def pipeline_with_hyperparameter_sweep():
        """Tune hyperparameters using sample components."""
        train_model = train_component_func(
            data=Input(
                type="uri_file",
                path="wasbs://datasets@azuremlexamples.blob.core.windows.net/iris.csv",
            ),
            c_value=Uniform(min_value=0.5, max_value=0.9),
            kernel=Choice(["rbf", "linear", "poly"]),
            coef0=Uniform(min_value=0.1, max_value=1),
            degree=3,
            gamma="scale",
            shrinking=False,
            probability=False,
            tol=0.001,
            cache_size=1024,
            verbose=False,
            max_iter=-1,
            decision_function_shape="ovr",
            break_ties=False,
            random_state=42,
        )
        sweep_step = train_model.sweep(
            primary_metric="training_f1_score",
            goal="minimize",
            sampling_algorithm="random",
            compute="cpu-cluster",
        )
        sweep_step.set_limits(max_total_trials=20, max_concurrent_trials=10, timeout=7200)
    
        score_data = score_component_func(
            model=sweep_step.outputs.model_output, test_data=sweep_step.outputs.test_data
        )
    
    
    pipeline_job = pipeline_with_hyperparameter_sweep()
    
    # set pipeline level compute
    pipeline_job.settings.default_compute = "cpu-cluster"
    
    # submit job to workspace
    pipeline_job = ml_client.jobs.create_or_update(
        pipeline_job, experiment_name="pipeline_samples"
    )
    pipeline_job
    ```

## Mapping of key functionality in SDK v1 and SDK v2

|Functionality in SDK v1|Rough mapping in SDK v2|
|-|-|
|[HyperDriveRunConfig()](/python/api/azureml-train-core/azureml.train.hyperdrive.hyperdriverunconfig)|[SweepJob()](/python/api/azure-ai-ml/azure.ai.ml.sweep.sweepjob)|
|[hyperdrive Package](/python/api/azureml-train-core/azureml.train.hyperdrive)|[sweep Package](/python/api/azure-ai-ml/azure.ai.ml.sweep)|


## Next steps

For more information, see:

* [SDK v1 - Tune Hyperparameters](./v1/how-to-tune-hyperparameters.md)
* [SDK v2 - Tune Hyperparameters](/python/api/azure-ai-ml/azure.ai.ml.sweep)
* [SDK v2 - Sweep in Pipeline](how-to-use-sweep-in-pipeline.md)