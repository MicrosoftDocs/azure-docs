---
title: Log metrics in the designer
titleSuffix: Azure Machine Learning
description: Monitor your Azure ML designer experiments. Enable logging using the Execute Python Script module and view the logged results in the studio.
services: machine-learning
author: likebupt
ms.author: keli19
ms.reviewer: peterlu
ms.service: machine-learning
ms.subservice: core
ms.date: 01/11/2021
ms.topic: how-to
ms.custom: designer
---

# Enable logging in Azure Machine Learning designer pipelines


In this article, you learn how to add logging code to designer pipelines. You also learn how to view those logs using the Azure Machine Learning studio web portal.

For more information on logging metrics using the SDK authoring experience, see [Monitor Azure ML experiment runs and metrics](how-to-log-view-metrics.md).

## Enable logging with Execute Python Script

Use the [Execute Python Script](./algorithm-module-reference/execute-python-script.md) module to enable logging in designer pipelines. Although you can log any value with this workflow, it's especially useful to log metrics from the __Evaluate Model__ module to track model performance across runs.

The following example shows you how to log the mean squared error of two trained models using the Evaluate Model and Execute Python Script modules.

1. Connect an __Execute Python Script__ module to the output of the __Evaluate Model__ module.

    ![Connect Execute Python Script module to Evaluate Model module](./media/how-to-log-view-metrics/designer-logging-pipeline.png)

1. Paste the following code into the __Execute Python Script__ code editor to log the mean absolute error for your trained model. You can use a similar pattern to log any other value in the designer:

    ```python
    # dataframe1 contains the values from Evaluate Model
    def azureml_main(dataframe1=None, dataframe2=None):
        print(f'Input pandas.DataFrame #1: {dataframe1}')
    
        from azureml.core import Run
    
        run = Run.get_context()
    
        # Log the mean absolute error to the parent run to see the metric in the run details page.
        # Note: 'run.parent.log()' should not be called multiple times because of performance issues.
        # If repeated calls are necessary, cache 'run.parent' as a local variable and call 'log()' on that variable.
        parent_run = Run.get_context().parent
        
        # Log left output port result of Evaluate Model. This also works when evaluate only 1 model.
        parent_run.log(name='Mean_Absolute_Error (left port)', value=dataframe1['Mean_Absolute_Error'][0])
        # Log right output port result of Evaluate Model. The following line should be deleted if you only connect one Score Module to the` left port of Evaluate Model module.
        parent_run.log(name='Mean_Absolute_Error (right port)', value=dataframe1['Mean_Absolute_Error'][1])

        return dataframe1,
    ```
    
This code uses the Azure Machine Learning Python SDK to log values. It uses Run.get_context() to get the context of the current run. It then logs values to that context with the run.parent.log() method. It uses `parent` to log values to the parent pipeline run rather than the module run.

For more information on how to use the Python SDK to log values, see [Enable logging in Azure ML training runs](how-to-log-view-metrics.md).

## View logs

After the pipeline run completes, you can see the *Mean_Absolute_Error* in the Experiments page.

1. Navigate to the **Experiments** section.
1. Select your experiment.
1. Select the run in your experiment you want to view.
1. Select **Metrics**.

    ![View run metrics in the studio](./media/how-to-log-view-metrics/experiment-page-metrics-across-runs.png)

## Next steps

In this article, you learned how to use logs in the designer. For next steps, see these related articles:


* Learn how to troubleshoot designer pipelines, see [Debug & troubleshoot ML pipelines](how-to-debug-pipelines.md#azure-machine-learning-designer).
* Learn how to use the Python SDK to log metrics in the SDK authoring experience, see [Enable logging in Azure ML training runs](how-to-log-view-metrics.md).
* Learn how to use [Execute Python Script](./algorithm-module-reference/execute-python-script.md) in the designer.
