---
title: Manage experiment iterations
titleSuffix: Azure Machine Learning Studio
description: How to manage experiment iterations in Azure Machine Learning Studio. You can review previous runs of your experiments at any time in order to challenge, revisit, and ultimately either confirm or refine previous assumptions.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: conceptual

author: xiaoharper
ms.author: amlstudiodocs
ms.custom: seodec18
ms.date: 03/20/2017
---
# Manage experiment iterations in Azure Machine Learning Studio
Developing a predictive analysis model is an iterative process - as you modify the various functions and parameters of your experiment, your results converge until you are satisfied that you have a trained, effective model. Key to this process is tracking the various iterations of your experiment parameters and configurations.



You can review previous runs of your experiments at any time in order to challenge, revisit, and ultimately either confirm or refine previous assumptions. When you run an experiment, Machine Learning Studio keeps a history of the run, including dataset, module, and port connections and parameters. This history also captures results, runtime information such as start and stop times, log messages, and execution status. You can look back at any of these runs at any time to review the chronology of your experiment and intermediate results. You can even use a previous run of your experiment to launch into a new phase of inquiry and discovery on your path to creating simple, complex, or even ensemble modeling solutions.

> [!NOTE]
> When you view a previous run of an experiment, that version of the experiment is locked and can't be edited. You can, however, save a copy of it by clicking **SAVE AS** and providing a new name for the copy. Machine Learning Studio opens the new copy, which you can then edit and run. This copy of your experiment is available in the **EXPERIMENTS** list along with all your other experiments.
> 
> 

## Viewing the Prior Run
When you have an experiment open that you have run at least once, you can view the preceding run of the experiment by clicking **Prior Run** in the properties pane.

For example, suppose you create an experiment and run versions of it at 11:23, 11:42, and 11:55. If you open the last run of the experiment (11:55) and click **Prior Run**, the version you ran at 11:42 is opened.

## Viewing the Run History
You can view all the previous runs of an experiment by clicking **View Run History** in an open experiment.

For example, suppose you create an experiment with the [Linear Regression][linear-regression] module and you want to observe the effect of changing the value of **Learning rate** on your experiment results. You run the experiment multiple times with different values for this parameter, as follows:

| Learning Rate value | Run start time |
| --- | --- |
| 0.1 |9/11/2014 4:18:58 pm |
| 0.2 |9/11/2014 4:24:33 pm |
| 0.4 |9/11/2014 4:28:36 pm |
| 0.5 |9/11/2014 4:33:31 pm |

If you click **VIEW RUN HISTORY**, you see a list of all these runs:

![Example run history](./media/manage-experiment-iterations/viewrunhistory.jpg)

Click any of these runs to view a snapshot of the experiment at the time you ran it. The configuration, parameter values, comments, and results are all preserved to give you a complete record of that run of your experiment.

> [!TIP]
> To document your iterations of the experiment, you can modify the title each time you run it, you can update the **Summary** of the experiment in the properties pane, and you can add or update comments on individual modules to record your changes. The title, summary, and module comments are saved with each run of the experiment.
> 
> 

The list of experiments in the **EXPERIMENTS** tab in Machine Learning Studio always displays the latest version of an experiment. If you open a previous run of the experiment (using **Prior Run** or **VIEW RUN HISTORY**), you can return to the draft version by clicking **VIEW RUN HISTORY** and selecting the iteration that has a **STATE** of **Editable**.

## Iterating on a Previous Run
When you click **Prior Run** or **VIEW RUN HISTORY** and open a previous run, you can view a finished experiment in read-only mode.

If you want to begin an iteration of your experiment starting with the way you configured it for a previous run, you can do this by opening the run and clicking **SAVE AS**. This creates a new experiment, with a new title, an empty run history, and all the components and parameter values of the previous run. This new experiment is listed in the **EXPERIMENTS** tab in the Machine Learning Studio home page, and you can modify and run it, initiating a new run history for this iteration of your experiment. 

For example, suppose you have the experiment run history shown in the previous section. You want to observe what happens when you set the **Learning rate** parameter to 0.4, and try different values for the **Number of training epochs** parameter.

1. Click **VIEW RUN HISTORY** and open the iteration of the experiment that you ran at 4:28:36 pm (in which you set the parameter value to 0.4).
2. Click **SAVE AS**.
3. Enter a new title and click the **OK** checkmark. A new copy of the experiment is created.
4. Modify the **Number of training epochs** parameter.
5. Click **RUN**.

You can now continue to modify and run this version of your experiment, building a new run history to record your work.

<!-- Module References -->
[linear-regression]: https://msdn.microsoft.com/library/azure/31960a6f-789b-4cf7-88d6-2e1152c0bd1a/
