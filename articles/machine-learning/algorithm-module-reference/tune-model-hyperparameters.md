---
title: "Tune Model Hyperparameters"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Tune Model Hyperparameters module in Azure Machine Learning service to perform a parameter sweep on a model to determine the optimum parameter settings.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/16/2019
---
# Tune Model Hyperparameters

This article describes how to use the [Tune Model Hyperparameters](tune-model-hyperparameters.md) module in Azure Machine Learning designer (preview), to determine the optimum hyperparameters for a given machine learning model. The module builds and tests multiple models, using different combinations of settings, and compares metrics over all models to get the combination of settings. 

The terms *parameter* and *hyperparameter* can be confusing. The model's *parameters* are what you set in the properties pane. Basically, this module performs a *parameter sweep* over the specified parameter settings, and learns an optimal set of _hyperparameters_, which might be different for each specific decision tree, dataset, or regression method. The process of finding the optimal configuration is sometimes called *tuning*. 

The module supports the following method for finding the optimum settings for a model 

**Integrated train and tune**: You configure a set of parameters to use, and then let the  module iterate over multiple combinations, measuring accuracy until it finds a "best" model. With most learner modules, you can choose which parameters should be changed during the training process, and which should remain fixed.

    Depending on how long you want the tuning process to run, you might decide to exhaustively test all combinations, or you could shorten the process by establishing a grid of parameter combinations and testing a randomized subset of the parameter grid.

 This method generates a trained model that you can save for reuse.  

### Related tasks

+ Before tuning, apply feature selection to determine the columns or variables that have the highest information value.

## How to configure Tune Model Hyperparameters  

Generally, learning the optimal hyperparameters for a given machine learning model requires considerable pipelineation.

### Train a model using a parameter sweep  

This section describes how to perform a basic parameter sweep, which trains a model by using the [Tune Model Hyperparameters](tune-model-hyperparameters.md) module.

1.  Add the [Tune Model Hyperparameters](tune-model-hyperparameters.md) module to your pipeline in the designer.

2.  Connect an untrained model to the leftmost input. 

3. Set the **Create trainer mode** option to **Parameter Range** and use the **Range Builder** to specify a range of values to use in the parameter sweep.  

    Almost all the classification and regression modules support an integrated parameter sweep. For those learners that do not support configuring a parameter range, only the available parameter values can be tested.

    You can manually set the value for one or more parameters, and then sweep over the remaining parameters. This might save some time.

4.  Add the dataset you want to use for training and connect it to the middle input of [Tune Model Hyperparameters](tune-model-hyperparameters.md).  

    Optionally, if you have a tagged dataset, you can connect it to the rightmost input port (**Optional validation dataset**). This lets you measure accuracy while training and tuning.

5.  In the **Properties** pane of [Tune Model Hyperparameters](tune-model-hyperparameters.md), choose a value for **Parameter sweeping mode**. This option controls how the parameters are selected.

    - **Entire grid**: When you select this option, the module loops over a grid predefined by the system, to try different combinations and identify the best learner. This option is useful for cases where you don't know what the best parameter settings might be and want to try all possible combination of values.

    - **Random sweep**: When you select this option, the module will randomly select parameter values over a system-defined range. You must specify the maximum number of runs that you want the module to execute. This option is useful for cases where you want to increase model performance using the metrics of your choice but still conserve computing resources.

    If you choose a random sweep, you can specify **Maximum number of runs on random sweep**, which means how many times the model should be trained, using a random combination of parameter values.

6.  For **Label column**, launch the column selector to choose a single label column.

7.  **Maximum number of runs on random sweep**: If you choose a random sweep, you can specify how many times the model should be trained, using a random combination of parameter values.

    **Maximum number of runs on random grid**: This option also controls the number of iterations over a random sampling of parameter values, but the values are not generated randomly from the specified range; instead, a matrix is created of all possible combinations of parameter values and a random sampling is taken over the matrix. This method is more efficient and less prone to regional oversampling or undersampling.

8.  Choose a single metric to use when **ranking** the models.

    When you run a parameter sweep, all applicable metrics for the model type are calculated and are returned in the **Sweep results** report. Separate metrics are used for regression and classification models.

    However, the metric you choose determines how the models are ranked. Only the top model, as ranked by the chosen metric, is output as a trained model to use for scoring.

9.  For **Random seed**, type a number to use when initializing the parameter sweep. 

10. Run the pipeline.

## Results of hyperparameter tuning

When training is complete:

+ To view a set of accuracy metrics for the best model, right-click the module, select **Sweep results**, and then select **Visualize**.

    All accuracy metrics applicable to the model type are output, but the metric that you selected for ranking determines which model is considered "best".

+ To use the model for scoring in other pipelines, without having to repeat the tuning process, right-click the model output and select **Save as Trained Model**. 


## Technical notes

This section contains implementation details, tips, and answers to frequently asked questions.

### How a parameter sweep works

This section describes how  parameter sweep works in general, and how the options in this module interact.

When you set up a parameter sweep, you define the scope of your search, to use either a finite number of parameters selected randomly, or an exhaustive search over a parameter space you define.

+ **Random sweep**: This option trains a model using a set number of iterations. 

     You specify a range of values to iterate over, and the module uses a randomly chosen subset of those values.  Values are chosen with replacement, meaning that numbers previously chosen at random are not removed from the pool of available numbers. Thus, the chance of any value being selected remains the same across all passes.  

+ **Entire grid**: The option to use the entire grid means just that: each and every combination is tested. This option can be considered the most thorough, but requires the most time. 

### Controlling the length and complexity of training

Iterating over many combinations of settings can be time-consuming, so the module provides several ways to constrain the process:

+ Limit the number of iterations used to test a model
+ Limit the parameter space
+ Limit both the number of iterations and the parameter space

We recommend that you pipeline with the settings to determine the most efficient method of training on a particular dataset and model.

### Choosing an evaluation metric

A report containing the accuracy for each model is presented at the end so that you can review the metric results. A uniform set of metrics is used for all binary classification models, accuracy is used for all multi-class classification models, and a different set of metrics is used for regression models. However, during training, you must choose a **single** metric to use in ranking the models that are generated during the tuning process. You might find that the best metric varies, depending on your business problem, and the cost of false positives and false negatives.

#### Metrics used for binary classification

-   **Accuracy** The proportion of true results to total cases.  

-   **Precision** The proportion of true results to positive results.  

-   **Recall** The fraction of all correct results over all results.  

-   **F-score** A measure that balances precision and recall.  

-   **AUC** A value that represents the area under the curve when false positives are plotted on the x-axis and true positives are plotted on the y-axis.  

-   **Average Log Loss** The difference between two probability distributions: the true one, and the one in the model.  

#### Metrics used for regression

-   **Mean absolute error** averages all the error in the model, where error means the distance of the predicted value from the true value. Often abbreviated as **MAE**.  

-   **Root of mean squared error** measures the average of the squares of the errors, and then takes the root of that value. Often abbreviated as **RMSE**  

-   **Relative absolute error** represents the error as a percentage of the true value.  

-   **Relative squared error** normalizes the total squared error it by dividing by the total squared error of the predicted values.  

-   **Coefficient of determination** A single number that indicates how well data fits a model. A value of one means that the model exactly matches the data; a value of zero means that the data is random or otherwise cannot be fit to the model. Often referred to as **r<sup>2</sup>**, **R<sup>2</sup>**, or **r-squared**.  

### Modules that do not support a parameter sweep

Almost all learners in Azure Machine Learning support cross-validation with an integrated parameter sweep, which lets you choose the parameters to pipeline with. If the learner doesn't support setting a range of values, you can still use it in cross-validation. In this case, some range of allowed values is selected for the sweep. 


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 

