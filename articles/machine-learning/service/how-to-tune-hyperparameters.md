---
title: Tune hyperparameters for your model
description: Learn how to tune the hyperparameters for your Deep Learning / Machine Learning model using Azure Machine Learning services.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: sgilley
ms.author: swatig
author: swatig007
ms.date: 09/24/2018
---

# Tune Hyperparameters for your model

In Deep Learning / Machine Learning scenarios, model performance depends heavily on the hyperparameter values selected. The goal of hyperparameter exploration is to search across various hyperparameter configurations and to find a 'good' configuration, that result in the desired performance. Typically, the hyperparameter exploration process is painstakingly manual, given that the search space is vast and evaluation of each configuration can be quite expensive.

Azure Machine Learning Services allows users to automate this hyperparameter exploration in an efficient manner, saving users significant time and resources. Users can specify the range of hyperparameter values to explore and a maximum number of training jobs to run for this exploration. The system then automatically launches multiple simultaneous training jobs with different parameter configurations and finds the configuration that results in the best performance, as measured by a metric chosen by the user. Poorly performing training jobs are automatically early terminated, reducing wastage of compute resources, and these resources are instead used to explore other hyperparameter configurations.

In this article, we demonstrate how to efficiently perform a hyperparameter sweep. We will show you how to define the parameter search space, specify a primary metric to optimize and early terminate poorly performing configurations. You can also visualize the various training runs and select the best performing configuration for your model.

## Define the hyperparameter search space
Azure Machine Learning services automatically tunes hyperparameters by exploring the range of values defined for each hyperparameter. Each hyperparameter can either be discrete or continuous. 

### Discrete hyperparameters 
Discrete hyperparameters can be specified as a choice among discrete values. E.g.  
```Python
    {    
    "batch_size": choice(16, 32, 64, 128)
    }
```
In this case, batch_size can take on one of the values [16, 32, 64, 128].

### Continuous hyperparameters 
Continuous hyperparameters can be specified as a distribution over a continuous range of values. Supported distributions include uniform, loguniform, normal, lognormal, etc. E.g.
```Python
    {    
    "learning_rate": normal(10, 3),
    "keep_probability": uniform(0.05, 0.1)
    }
```
In this case, learning_rate will have a normal distribution with mean value 10 and a standard deviation of 3. keep_probability will have a uniform distribution with a minimum value of 0.05 and a maximum value of 0.1.

The user also specifies the parameter sampling method to use over the specified hyperparameter space definition. Currently, Azure Machine Learning services supports Random sampling and Grid sampling.

### Random Sampling
In Random sampling, hyperparameter values are randomly selected from the defined search space. Random sampling allows the search space to include both discrete and continuous hyperparameters. E.g. 
```Python
param_sampling = RandomParameterSampling( {
        "learning_rate": normal(10, 3),
        "keep_probability": uniform(0.05, 0.1),
        "batch_size": choice(16, 32, 64, 128)
    }
)
```

### Grid Sampling
Grid sampling can only be used with discrete hyperparameters. Grid sampling performs a simple grid search over all feasible values in the defined search space. For example, the following space has a total of 6 samples -
```Python
param_sampling = GridParameterSampling( {
        "num_hidden_layers": choice(1, 2, 3),
        "batch_size": choice(16, 32)
    }
)
```

## Logging metrics for hyperparameter tuning
In order to use Azure Machine Learning services for hyperparameter tuning, the training script for your model will need to report relevant metrics while the model executes. The user specifies the primary metric they want the service to use for evaluating run performance, and the training script will need to log this metric.
You can update your training script to log this metric, using the following sample snippet -
```Python
run_logger.log("Accuracy", float(val_accuracy))
```
In this example, the training script calculates the val_accuracy and logs this "Accuracy", which is used as the primary metric. It is up to the model developer to determine how frequently to report this metric.

## Early Termination Policy
When using Azure Machine Learning services to tune hyperparameters, poorly performing jobs are automatically early terminated. This reduces wastage of resources and instead uses these resources for exploring other parameter configurations.

Azure Machine Learning service supports the following Early Termination Policies -

### Bandit Policy
The Bandit Policy early terminates any runs that are not within the specified slack factor / slack amount with respect to the best performing training run. It takes only 3 configuration parameters -
* `evaluation_interval`: the frequency for applying the policy. Each time the training script logs the primary metric counts as one interval. Thus an `evaluation_interval` of 1 will apply the policy every time the training script reports the primary metric. An `evaluation_interval` of 2 will apply the policy every other time the training script reports the primary metric.
* `slack_factor` or `slack_amount`: the slack allowed with respect to the best performing training run. `slack_factor` specifies the allowable slack as a ratio. `slack_amount` specifies the allowable slack as an absolute amount, instead of a ratio.

e.g. consider a Bandit policy being applied at interval 10. Assume that the best performing run at interval 10 reported a primary metric 0.8 with a goal to maximize the primary metric. If the policy was specified with a `slack_factor` of 0.2, any training runs, whose best metric at interval 10 is less than 0.66 (0.8/(1+`slack_factor`)) will be terminated. If instead, the policy was specified with a `slack_amount` of 0.2, any training runs, whose best metric at interval 10 is less than 0.6 (0.8 - `slack_amount`) will be terminated.
* `delay_evaluation`: delays the first policy evaluation for a specified number of intervals. This allows all configurations to run for an initial minimum number of intervals, avoiding premature termination of training runs.

### Median Stopping Policy

### Default Policy