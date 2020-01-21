---
title: "Tune Model Hyperparameters"
titleSuffix: Azure Machine Learning
description: Learn how to use the Tune Model Hyperparameters module in Azure Machine Learning to perform a parameter sweep on a model to determine the optimum parameter settings.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/16/2019
---
# Tune Model Hyperparameters

This article describes how to use the Tune Model Hyperparameters module in Azure Machine Learning designer (preview). The goal is to determine the optimum hyperparameters for a machine learning model. The module builds and tests multiple models by using different combinations of settings. It compares metrics over all models to get the combinations of settings. 

The terms *parameter* and *hyperparameter* can be confusing. The model's *parameters* are what you set in the properties pane. Basically, this module performs a *parameter sweep* over the specified parameter settings. It learns an optimal set of _hyperparameters_, which might be different for each specific decision tree, dataset, or regression method. The process of finding the optimal configuration is sometimes called *tuning*. 

The module supports the following method for finding the optimum settings for a model: *integrated train and tune.* In this method, you configure a set of parameters to use. You then let the module iterate over multiple combinations. The module measures accuracy until it finds a "best" model. With most learner modules, you can choose which parameters should be changed during the training process, and which should remain fixed.

Depending on how long you want the tuning process to run, you might decide to exhaustively test all combinations. Or you might shorten the process by establishing a grid of parameter combinations and testing a randomized subset of the parameter grid.

This method generates a trained model that you can save for reuse.  

> [!TIP] 
> You can do a related task. Before you start tuning, apply feature selection to determine the columns or variables that have the highest information value.

## How to configure Tune Model Hyperparameters  

Learning the optimal hyperparameters for a machine learning model requires considerable use of pipelines.

### Train a model by using a parameter sweep  

This section describes how to perform a basic parameter sweep, which trains a model by using the Tune Model Hyperparameters module.

1.  Add the Tune Model Hyperparameters module to your pipeline in the designer.

2.  Connect an untrained model to the leftmost input. 

3. Set the **Create trainer mode** option to **Parameter Range**. Use **Range Builder** to specify a range of values to use in the parameter sweep.  

    Almost all the classification and regression modules support an integrated parameter sweep. For learners that don't support configuring a parameter range, you can test only the available parameter values.

    You can manually set the value for one or more parameters, and then sweep over the remaining parameters. This might save some time.

4.  Add the dataset that you want to use for training, and connect it to the middle input of Tune Model Hyperparameters.  

    Optionally, if you have a tagged dataset, you can connect it to the rightmost input port (**Optional validation dataset**). This lets you measure accuracy while training and tuning.

5.  In the **Properties** pane of Tune Model Hyperparameters, choose a value for **Parameter sweeping mode**. This option controls how the parameters are selected.

    - **Entire grid**: When you select this option, the module loops over a grid predefined by the system, to try different combinations and identify the best learner. This option is useful when you don't know what the best parameter settings might be and want to try all possible combinations of values.

    - **Random sweep**: When you select this option, the module will randomly select parameter values over a system-defined range. You must specify the maximum number of runs that you want the module to execute. This option is useful when you want to increase model performance by using the metrics of your choice but still conserve computing resources.    

6.  For **Label column**, open the column selector to choose a single label column.

7.  Choose the number of runs:

    1. **Maximum number of runs on random sweep**: If you choose a random sweep, you can specify how many times the model should be trained, by using a random combination of parameter values.

    2. **Maximum number of runs on random grid**: This option also controls the number of iterations over a random sampling of parameter values, but the values are not generated randomly from the specified range. Instead, the module creates a matrix of all possible combinations of parameter values. It then takes a random sampling over the matrix. This method is more efficient and less prone to regional oversampling or undersampling.

8.  For **Ranking**, choose a single metric to use for ranking the models.

    When you run a parameter sweep, the module calculates all applicable metrics for the model type and returns them in the **Sweep results** report. The module uses separate metrics for regression and classification models.

    However, the metric that you choose determines how the models are ranked. Only the top model, as ranked by the chosen metric, is output as a trained model to use for scoring.

9.  For **Random seed**, enter a number to use for starting the parameter sweep. 

10. Run the pipeline.

## Results of hyperparameter tuning

When training is complete:

+ To view a set of accuracy metrics for the best model, right-click the module, and then select **Visualize**.

    The output includes all accuracy metrics that apply to the model type, but the metric that you selected for ranking determines which model is considered "best."

+ To save a snapshot of the trained model, select the **Outputs** tab in the right panel of the **Train model** module. Select the **Register dataset** icon to save the model as a reusable module.


## Technical notes

This section contains implementation details and tips.

### How a parameter sweep works

When you set up a parameter sweep, you define the scope of your search. The search might use a finite number of parameters selected randomly. Or it might be an exhaustive search over a parameter space that you define.

+ **Random sweep**: This option trains a model by using a set number of iterations. 

  You specify a range of values to iterate over, and the module uses a randomly chosen subset of those values. Values are chosen with replacement, meaning that numbers previously chosen at random are not removed from the pool of available numbers. So the chance of any value being selected stays the same across all passes.  

+ **Entire grid**: The option to use the entire grid means that every combination is tested. This option is the most thorough, but it requires the most time. 

### Controlling the length and complexity of training

Iterating over many combinations of settings can be time-consuming, so the module provides several ways to constrain the process:

+ Limit the number of iterations used to test a model.
+ Limit the parameter space.
+ Limit both the number of iterations and the parameter space.

We recommend that you pipeline with the settings to determine the most efficient method of training on a particular dataset and model.

### Choosing an evaluation metric

At the end of testing, the model presents a report that contains the accuracy for each model so that you can review the metric results:

- A uniform set of metrics is used for all binary classification models.
- Accuracy is used for all multi-class classification models.
- A different set of metrics is used for regression models. 

However, during training, you must choose a *single* metric to use in ranking the models that are generated during the tuning process. You might find that the best metric varies, depending on your business problem and the cost of false positives and false negatives.

#### Metrics used for binary classification

-   **Accuracy** is the proportion of true results to total cases.  

-   **Precision** is the proportion of true results to positive results.  

-   **Recall** is the fraction of all correct results over all results.  

-   **F-score** is a measure that balances precision and recall.  

-   **AUC** is a  value that represents the area under the curve when false positives are plotted on the x-axis and true positives are plotted on the y-axis.  

-   **Average Log Loss** is the difference between two probability distributions: the true one, and the one in the model.  

#### Metrics used for regression

-   **Mean absolute error** averages all the errors in the model, where *error* means the distance of the predicted value from the true value. It's often abbreviated as *MAE*.  

-   **Root of mean squared error** measures the average of the squares of the errors, and then takes the root of that value. It's often abbreviated as *RMSE*.  

-   **Relative absolute error** represents the error as a percentage of the true value.  

-   **Relative squared error** normalizes the total squared error by dividing by the total squared error of the predicted values.  

-   **Coefficient of determination** is a single number that indicates how well data fits a model. A value of one means that the model exactly matches the data. A value of zero means that the data is random or otherwise can't be fit to the model. It's often called *r<sup>2</sup>*, *R<sup>2</sup>*, or *r-squared*.  

### Modules that don't support a parameter sweep

Almost all learners in Azure Machine Learning support cross-validation with an integrated parameter sweep, which lets you choose the parameters to pipeline with. If the learner doesn't support setting a range of values, you can still use it in cross-validation. In this case, a range of allowed values is selected for the sweep. 


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 

