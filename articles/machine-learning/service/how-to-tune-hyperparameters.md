---
title: Tune hyperparameters for your model using Azure Machine Learning 
description: Learn how to tune the hyperparameters for your deep learning / machine learning model using Azure Machine Learning service. You will see how to define the parameter search space, specify a primary metric to optimize and early terminate poorly performing configurations. 
ms.author: swatig
author: swatig007
ms.reviewer: sgilley 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.date: 09/24/2018
---

# Tune hyperparameters for your model

In this article, you learn to efficiently tune hyperparameters for your model. You will see how to define the parameter search space, specify a primary metric to optimize and early terminate poorly performing configurations. You can also visualize the various training runs and select the best performing configuration for your model.

## What are hyperparameters?
Hyperparameters are adjustable parameters chosen prior to training a model that govern the training process itself. For example, prior to training a deep neural network, you will need to decide the number of hidden layers in the network and the number of nodes in each layer. These values usually stay constant during the training process.

In deep learning / machine learning scenarios, model performance depends heavily on the hyperparameter values selected. The goal of hyperparameter exploration is to search across various hyperparameter configurations to find a configuration that results in the desired performance. Typically, the hyperparameter exploration process is painstakingly manual, given that the search space is vast and evaluation of each configuration can be expensive.

Azure Machine Learning allows you to automate this hyperparameter exploration in an efficient manner, saving you significant time and resources. You can specify the range of hyperparameter values to explore and a maximum number of training runs for this exploration. The system then automatically launches multiple simultaneous training runs with different parameter configurations and finds the configuration that results in the best performance, as measured by a metric chosen by the user. Poorly performing training runs are automatically early terminated, reducing wastage of compute resources. These resources are instead used to explore other hyperparameter configurations.

In order to tune hyperparameters for your model using Azure Machine Learning service, you need to do the following -
* Define the hyperparameter search space
* Specify a primary metric to optimize
* Specify an early termination policy
* Allocate resources for hyperparameter tuning
* Launch an experiment with the above configuration

## Define the hyperparameter search space
Azure Machine Learning service automatically tunes hyperparameters by exploring the range of values defined for each hyperparameter.

### Types of hyperparameters
Each hyperparameter can either be discrete or continuous.

#### Discrete hyperparameters 
Discrete hyperparameters can be specified as a `choice` among discrete values. For example  

```Python
    {    
        "batch_size": choice(16, 32, 64, 128)
    }
```

In this case, batch_size can take on one of the values [16, 32, 64, 128].

#### Continuous hyperparameters 
Continuous hyperparameters can be specified as a distribution over a continuous range of values. Supported distributions include -
* `uniform(low, high)` - Returns a value uniformly distributed between low and high
* `loguniform(low, high)` - Returns a value drawn according to exp(uniform(low, high)) so that the logarithm of the return value is uniformly distributed
* `quniform(low, high, q)` - Returns a value like round(uniform(low, high) / q) * q
* `qloguniform(low, high, q)` - Returns a value like round(exp(uniform(low, high)) / q) * q
* `normal(mu, sigma)` - Returns a real value that's normally distributed with mean mu and standard deviation sigma
* `lognormal(mu, sigma)` - Returns a value drawn according to exp(normal(mu, sigma)) so that the logarithm of the return value is normally distributed
* `qnormal(mu, sigma, q)` - Returns a value like round(normal(mu, sigma) / q) * q
* `qlognormal(mu, sigma, q)` - Returns a value like round(exp(normal(mu, sigma)) / q) * q

Here is an example of a parameter space definition -

```Python
    {    
        "learning_rate": normal(10, 3),
        "keep_probability": uniform(0.05, 0.1)
    }
```

This example defines a search space with two parameters - learning_rate and keep_probability. learning_rate will have a normal distribution with mean value 10 and a standard deviation of 3. keep_probability will have a uniform distribution with a minimum value of 0.05 and a maximum value of 0.1.

### Sampling the hyperparameter space
The user also specifies the parameter sampling method to use over the specified hyperparameter space definition. Azure Machine Learning service supports Random sampling, Grid sampling, and Bayesian sampling.

#### Random Sampling
In Random sampling, hyperparameter values are randomly selected from the defined search space. Random sampling allows the search space to include both discrete and continuous hyperparameters. For example

```Python
from azureml.train.hyperdrive import RandomParameterSampling
param_sampling = RandomParameterSampling( {
        "learning_rate": normal(10, 3),
        "keep_probability": uniform(0.05, 0.1),
        "batch_size": choice(16, 32, 64, 128)
    }
)
```

#### Grid Sampling
Grid sampling performs a simple grid search over all feasible values in the defined search space. It can only be used with discrete hyperparameters. For example, the following space has a total of six samples -

```Python
from azureml.train.hyperdrive import GridParameterSampling
param_sampling = GridParameterSampling( {
        "num_hidden_layers": choice(1, 2, 3),
        "batch_size": choice(16, 32)
    }
)
```

#### Bayesian Sampling
Bayesian sampling tries to intelligently pick the next sample of hyperparameters, based on how the previous samples performed, such that the new sample improves the reported primary metric.

When using Bayesian sampling, the number of concurrent runs has an impact on the effectiveness of the tuning process. Typically, a smaller number of concurrent runs can lead to better sampling convergence. This is because the smaller degree of parallelism increases the number of runs that benefit from previously completed runs.

Bayesian sampling supports only `choice`, `uniform`, and `quniform` distributions over the search space. For example 

```Python
from azureml.train.hyperdrive import BayesianParameterSampling
param_sampling = BayesianParameterSampling( {
        "learning_rate": uniform(0.05, 0.1),
        "batch_size": choice(16, 32, 64, 128)
    }
)
```

> [!NOTE]
> Bayesian sampling does not currently support any early termination policy (See [Specify an Early Termination Policy](#specify-an-early-termination-policy)). If using Bayesian parameter sampling, you can set policy to NoTerminationPolicy(). Not specifying a termination policy with Bayesian Sampling will have the same effect.
>
> ```Python
> from azureml.train.hyperdrive import NoTerminationPolicy
> early_termination_policy = NoTerminationPolicy()
> ```

## Specify a primary metric to optimize
When tuning hyperparameters, you need to specify the primary metric that you want the hyperparameter tuning experiment to optimize. Each training run is evaluated for this primary metric and poorly performing runs (where the primary metric does not meet criteria set by the early termination policy) will be terminated. In addition to specifying the primary metric name, you also need to specify the goal of the optimization - whether to maximize or minimize the primary metric.
* `primary_metric_name`: The name of the primary metric to optimize. The name of the primary metric needs to exactly match the name of the metric logged by the training script. See [Log metrics for hyperparameter tuning](#log-metrics-for-hyperparameter-tuning).
* `primary_metric_goal`: It can be either `PrimaryMetricGoal.MAXIMIZE` or `PrimaryMetricGoal.MINIMIZE` and determines whether the primary metric will be maximized or minimized when evaluating the runs. 

For example -
```Python
primary_metric_name="accuracy",
primary_metric_goal=PrimaryMetricGoal.MAXIMIZE
```
This will optimize the runs to maximize "accuracy".

### Log metrics for hyperparameter tuning
In order to use Azure Machine Learning service for hyperparameter tuning, the training script for your model will need to report relevant metrics while the model executes. The user specifies the primary metric they want the service to use for evaluating run performance, and the training script will need to log this metric. See [Specify a primary metric to optimize](#specify-a-primary-metric-to-optimize).

You can update your training script to log this metric, using the following sample snippet -

```Python
from azureml.core.run import Run
run_logger = Run.get_submitted_run()
run_logger.log("accuracy", float(val_accuracy))
```

In this example, the training script calculates the `val_accuracy` and logs this "accuracy", which is used as the primary metric. It is up to the model developer to determine how frequently to report this metric.

## Specify an Early Termination Policy
When using Azure Machine Learning service to tune hyperparameters, poorly performing runs are automatically early terminated. This reduces wastage of resources and instead uses these resources for exploring other parameter configurations.

When using an early termination policy, a user can configure the following parameters that control when a policy is applied -
* `evaluation_interval`: the frequency for applying the policy. Each time the training script logs the primary metric counts as one interval. Thus an `evaluation_interval` of 1 will apply the policy every time the training script reports the primary metric. An `evaluation_interval` of 2 will apply the policy every other time the training script reports the primary metric. This is an optional parameter and if not specified, `evaluation_interval` is set to 1 by default.
* `delay_evaluation`: delays the first policy evaluation for a specified number of intervals. This is an optional parameter that allows all configurations to run for an initial minimum number of intervals, avoiding premature termination of training runs. If specified, the policy applies every multiple of evaluation_interval that is greater than or equal to delay_evaluation.

Azure Machine Learning service supports the following Early Termination Policies -

### Bandit Policy
Bandit Policy is a termination policy based on slack factor/slack amount and evaluation interval. This policy early terminates any runs where the primary metric is not within the specified slack factor / slack amount with respect to the best performing training run. It takes the following configuration parameters -
* `slack_factor` or `slack_amount`: the slack allowed with respect to the best performing training run. `slack_factor` specifies the allowable slack as a ratio. `slack_amount` specifies the allowable slack as an absolute amount, instead of a ratio.

    For example,  consider a Bandit policy being applied at interval 10. Assume that the best performing run at interval 10 reported a primary metric 0.8 with a goal to maximize the primary metric. If the policy was specified with a `slack_factor` of 0.2, any training runs, whose best metric at interval 10 is less than 0.66 (0.8/(1+`slack_factor`)) will be terminated. If instead, the policy was specified with a `slack_amount` of 0.2, any training runs, whose best metric at interval 10 is less than 0.6 (0.8 - `slack_amount`) will be terminated.
* `evaluation_interval`: the frequency for applying the policy (optional parameter).
* `delay_evaluation`: delays the first policy evaluation for a specified number of intervals (optional parameter).

Consider this example -

```Python
from azureml.train.hyperdrive import BanditPolicy
early_termination_policy = BanditPolicy(slack_factor = 0.1, evaluation_interval=1, delay_evaluation=5)
```

In this example, the early termination policy is applied at every interval when metrics are reported, starting at evaluation interval 5. Any run whose best metric is less than (1/(1+0.1) or 91% of the best performing run will be terminated.

### Median Stopping Policy
Median Stopping Policy is an early termination policy based on running averages of primary metrics reported by the runs. This policy computes running averages across all training runs and terminates runs whose performance is worse than the median of the running averages. This policy takes the following configuration parameters -
* `evaluation_interval`: the frequency for applying the policy (optional parameter).
* `delay_evaluation`: delays the first policy evaluation for a specified number of intervals (optional parameter).

Consider this example -

```Python
from azureml.train.hyperdrive import MedianStoppingPolicy
early_termination_policy = MedianStoppingPolicy(evaluation_interval=1, delay_evaluation=5)
```

In this example, the early termination policy is applied at every interval starting at evaluation interval 5. A run will be terminated at interval 5 if its best primary metric is worse than the median of the running averages over intervals 1:5 across all training runs.

### Truncation Selection Policy
Truncation Selection Policy cancels a given percentage of lowest performing runs at each evaluation interval. Runs are compared based on their performance on the primary metric and the lowest X% are terminated. It takes the following configuration parameters -
* `truncation_percentage`: the percentage of lowest performing runs to terminate at each evaluation interval. This should be an integer value between 1 and 99.
* `evaluation_interval`: the frequency for applying the policy (optional parameter).
* `delay_evaluation`: delays the first policy evaluation for a specified number of intervals (optional parameter).

Consider this example -

```Python
from azureml.train.hyperdrive import TruncationSelectionPolicy
early_termination_policy = TruncationSelectionPolicy(evaluation_interval=1, truncation_percentage=20, delay_evaluation=5)
```

In this example, the early termination policy is applied at every interval starting at evaluation interval 5. A run will be terminated at interval 5, if its performance at interval 5 is in the lowest 20% of performance of all runs at interval 5.

### No Termination Policy
If you want all training runs to run to completion, use NoTerminationPolicy. This will have the effect of not applying any early termination policy. For example 

```Python
from azureml.train.hyperdrive import NoTerminationPolicy
early_termination_policy = NoTerminationPolicy()
```

### Default Policy
If no policy is specified, the hyperparameter tuning service will use a Median Stopping Policy with `evaluation_interval` 1 and `delay_evaluation` 5 by default. These are conservative settings, that can provide approximately 25%-35% savings with no loss on primary metric (based on our evaluation data).

## Allocate resources for hyperparameter tuning
You can control your resource budget for your hyperparameter tuning experiment by specifying the maximum total number of training runs and optionally, the maximum duration for your hyperparameter tuning experiment (in minutes). 
* `max_total_runs`: Maximum total number of training runs that will be created. This is an upper bound - we may have fewer runs, for instance, if the hyperparameter space is finite and has fewer samples. Must be a number between 1 and 1000.
* `max_duration_minutes`: Maximum duration of the hyperparameter tuning experiment in minutes. This is an optional parameter, and if present, any runs that might be running after this duration are automatically canceled.

>[!NOTE] 
>If both `max_total_runs` and `max_duration_minutes` are specified, the hyperparameter tuning experiment is terminated when the first of these two thresholds is reached.

Additionally, you can specify the maximum number of training runs to run concurrently during your hyperparameter tuning search.
* `max_concurrent_runs`: This is the maximum number of runs to run concurrently at any given moment. If none specified, all `max_total_runs` will be launched in parallel. If specified, must be a number between 1 and 100.

>[!NOTE] 
>The number of concurrent runs is gated on the resources available in the specified compute target. Hence, you will need to ensure that the compute target has the available resources for the desired concurrency.

You can allocate resources for hyperparameter tuning as shown in this example -
```Python
max_total_runs=20,
max_concurrent_runs=4
```
This will configure the hyperparameter tuning experiment to use a maximum of 20 total runs, running 4 configurations at a time.

## Configure your hyperparameter tuning experiment
You can configure your hyperparameter tuning experiment using the defined hyperpameter search space, early termination policy, primary metric and resource allocation from the sections above. Additionally, you will need to provide an `estimator` that will be called with the sampled hyperparameters. The `estimator` describes the training script you run, the resources per job (single or multi-gpu), and the compute target to use. Since concurrency for your hyperparameter tuning experiment is gated on the resources available, you will need to ensure that your compute target specified in the `estimator` has sufficient resources for desired concurrency. (See [link](/how-to-train-ml-models.md) for more information on estimators).

Here is an example of how you can configure your hyperparameter tuning experiment -

```Python
from azureml.train.hyperdrive import HyperDriveRunConfig
hyperdrive_run_config = HyperDriveRunConfig(estimator=estimator,
                          hyperparameter_sampling=param_sampling, 
                          policy=early_termination_policy,
                          primary_metric_name="accuracy", 
                          primary_metric_goal=PrimaryMetricGoal.MAXIMIZE,
                          max_total_runs=100,
                          max_concurrent_runs=4)
```

## Submit your hyperparameter tuning experiment
Once you have defined your hyperparameter tuning configuration, you can submit an experiment using this configuration -

```Python
from azureml.core.experiment import Experiment
experiment = Experiment(workspace, experiment_name)
hyperdrive_run = experiment.submit(hyperdrive_run_config)
```

where `experiment_name` is the name you want to assign to your hyperparameter tuning experiment, and `workspace` is the workspace in which you want to create the experiment (See [link](/concept-azure-machine-learning-architecture.md) for more information on experiments).

## Visualize your hyperparameter tuning experiment
Azure Machine Learning SDK provides a Notebook widget that can be used to visualize the progress of your training runs. The following snippet can be used to visualize all your hyperparameter tuning runs in one place -

```Python
from azureml.train.widgets import RunDetails
RunDetails(hyperdrive_run).show()
```

This will display a table with details about the training runs for each of the hyperparameter configurations. For example

![hyperparameter tuning table](media/how-to-tune-hyperparameters/HyperparameterTuningTable.png)

You can also visualize the performance of each of the runs as training progresses. For example

![hyperparameter tuning plot](media/how-to-tune-hyperparameters/HyperparameterTuningPlot.png)

Finally, you can visually identify the correlation between performance and values of individual hyperparameters using a Parallel Coordinates Plot. For example 

![hyperparameter tuning parallel coordinates](media/how-to-tune-hyperparameters/HyperparameterTuningParallelCoordinates.png)

Alternatively, you can visualize all your hyperparameter tuning runs in the Azure web portal as well. See [link](/how-to-track-experiments.md/#view-the-experiment-in-the-web-portal) for more information on how to view an experiment in the web portal. For example, -

![hyperparameter tuning portal](media/how-to-tune-hyperparameters/HyperparameterTuningPortal.png)

## Find the configuration that resulted in the best performance
Once all of the hyperparameter tuning runs have completed, you can identify the best performing configuration and the corresponding hyperparameter values using the following snippet -

```Python
best_run = hyperdrive_run.get_best_run_by_primary_metric()
best_run_metrics = best_run.get_metrics()
parameter_values = best_run.get_details()['runDefinition']['Arguments']

print('Best Run Id: ', best_run.id)
print('\n Accuracy:', best_run_metrics['accuracy'])
print('\n learning rate:',parameter_values[3])
print('\n keep probability:',parameter_values[5])
print('\n batch size:',parameter_values[7])
```

## Sample notebooks
Refer to 
* `01.getting-started/08.hyperdrive-with-TensorFlow/08.hyperdrive-with-TensorFlow.ipynb` for a tutorial on tuning hyperparameters for a Tensorflow model. 
* `01.getting-started/07.hyperdrive-with-sklearn/07.hyperdrive-with-sklearn.ipynb` for a tutorial on tuning hyperparameters with sklearn. 

Get these notebooks:

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## Next steps
* [Track an experiment](/how-to-track-experiments.md)
* [Deploy a trained model](/how-to-deploy-and-where.md)
