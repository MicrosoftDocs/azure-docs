---
title: Log ML experiments & metrics
titleSuffix: Azure Machine Learning
description: Monitor your Azure ML experiments and monitor run metrics to enhance the model creation process. Add logging to your training script and view the logged results of a run.  Use run.log, Run.start_logging, or ScriptRunConfig.
services: machine-learning
author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.workload: data-services
ms.topic: conceptual
ms.date: 09/11/2019

ms.custom: seodec18
---

# Monitor Azure ML experiment runs and metrics
[!INCLUDE [applies-to-skus](../../../includes/aml-applies-to-basic-enterprise-sku.md)]

Enhance the model creation process by tracking your experiments and monitoring run metrics. In this article, learn how to add logging code to your training script, submit an experiment run, monitor that run, and inspect the results in Azure Machine Learning.

> [!NOTE]
> Azure Machine Learning may also log information from other sources during training, such as automated machine learning runs, or the Docker container that runs the training job. These logs are not documented. If you encounter problems and contact Microsoft support, they may be able to use these logs during troubleshooting.

## Available metrics to track

The following metrics can be added to a run while training an experiment. To view a more detailed list of what can be tracked on a run, see the [Run class reference documentation](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py).

|Type| Python function | Notes|
|----|:----|:----|
|Scalar values |Function:<br>`run.log(name, value, description='')`<br><br>Example:<br>run.log("accuracy", 0.95) |Log a numerical or string value to the run with the given name. Logging a metric to a run causes that metric to be stored in the run record in the experiment.  You can log the same metric multiple times within a run, the result being considered a vector of that metric.|
|Lists|Function:<br>`run.log_list(name, value, description='')`<br><br>Example:<br>run.log_list("accuracies", [0.6, 0.7, 0.87]) | Log a list of values to the run with the given name.|
|Row|Function:<br>`run.log_row(name, description=None, **kwargs)`<br>Example:<br>run.log_row("Y over X", x=1, y=0.4) | Using *log_row* creates a metric with multiple columns as described in kwargs. Each named parameter generates a column with the value specified.  *log_row* can be called once to log an arbitrary tuple, or multiple times in a loop to generate a complete table.|
|Table|Function:<br>`run.log_table(name, value, description='')`<br><br>Example:<br>run.log_table("Y over X", {"x":[1, 2, 3], "y":[0.6, 0.7, 0.89]}) | Log a dictionary object to the run with the given name. |
|Images|Function:<br>`run.log_image(name, path=None, plot=None)`<br><br>Example:<br>`run.log_image("ROC", plt)` | Log an image to the run record. Use log_image to log an image file or a matplotlib plot to the run.  These images will be visible and comparable in the run record.|
|Tag a run|Function:<br>`run.tag(key, value=None)`<br><br>Example:<br>run.tag("selected", "yes") | Tag the run with a string key and optional string value.|
|Upload file or directory|Function:<br>`run.upload_file(name, path_or_stream)`<br> <br> Example:<br>run.upload_file("best_model.pkl", "./model.pkl") | Upload a file to the run record. Runs automatically capture file in the specified output directory, which defaults to "./outputs" for most run types.  Use upload_file only when additional files need to be uploaded or an output directory is not specified. We suggest adding `outputs` to the name so that it gets uploaded to the outputs directory. You can list all of the files that are associated with this run record by called `run.get_file_names()`|

> [!NOTE]
> Metrics for scalars, lists, rows, and tables can have type: float, integer, or string.

## Choose a logging option

If you want to track or monitor your experiment, you must add code to start logging when you submit the run. The following are ways to trigger the run submission:
* __Run.start_logging__ - Add logging functions to your training script and start an interactive logging session in the specified experiment. **start_logging** creates an interactive run for use in scenarios such as notebooks. Any metrics that are logged during the session are added to the run record in the experiment.
* __ScriptRunConfig__ - Add logging functions to your training script and load the entire script folder with the run.  **ScriptRunConfig** is a class for setting up configurations for script runs. With this option, you can add monitoring code to be notified of completion or to get a visual widget to monitor.

## Set up the workspace
Before adding logging and submitting an experiment, you must set up the workspace.

1. Load the workspace. To learn more about setting the workspace configuration, see [workspace configuration file](how-to-configure-environment.md#workspace).

   ```python
   from azureml.core import Experiment, Run, Workspace
   import azureml.core
  
   ws = Workspace.from_config()
   ```
  
## Option 1: Use start_logging

**start_logging** creates an interactive run for use in scenarios such as notebooks. Any metrics that are logged during the session are added to the run record in the experiment.

The following example trains a simple sklearn Ridge model locally in a local Jupyter notebook. To learn more about submitting experiments to different environments, see [Set up compute targets for model training with Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/service/how-to-set-up-training-targets).

1. Create a training script in a local Jupyter notebook. 

   ```python
   # load diabetes dataset, a well-known small dataset that comes with scikit-learn
   from sklearn.datasets import load_diabetes
   from sklearn.linear_model import Ridge
   from sklearn.metrics import mean_squared_error
   from sklearn.model_selection import train_test_split
   from sklearn.externals import joblib

   X, y = load_diabetes(return_X_y = True)
   columns = ['age', 'gender', 'bmi', 'bp', 's1', 's2', 's3', 's4', 's5', 's6']
   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 0)
   data = {
      "train":{"X": X_train, "y": y_train},        
      "test":{"X": X_test, "y": y_test}
   }
   reg = Ridge(alpha = 0.03)
   reg.fit(data['train']['X'], data['train']['y'])
   preds = reg.predict(data['test']['X'])
   print('Mean Squared Error is', mean_squared_error(preds, data['test']['y']))
   joblib.dump(value = reg, filename = 'model.pkl');
   ```

2. Add experiment tracking using the Azure Machine Learning SDK, and upload a persisted model into the experiment run record. The following code adds tags, logs, and uploads a model file to the experiment run.

   ```python
    # Get an experiment object from Azure Machine Learning
    experiment = Experiment(workspace=ws, name="train-within-notebook")
    
    # Create a run object in the experiment
    run =  experiment.start_logging()
    # Log the algorithm parameter alpha to the run
    run.log('alpha', 0.03)
    
    # Create, fit, and test the scikit-learn Ridge regression model
    regression_model = Ridge(alpha=0.03)
    regression_model.fit(data['train']['X'], data['train']['y'])
    preds = regression_model.predict(data['test']['X'])
    
    # Output the Mean Squared Error to the notebook and to the run
    print('Mean Squared Error is', mean_squared_error(data['test']['y'], preds))
    run.log('mse', mean_squared_error(data['test']['y'], preds))
    
    # Save the model to the outputs directory for capture
    model_file_name = 'outputs/model.pkl'
    
    joblib.dump(value = regression_model, filename = model_file_name)
    
    # upload the model file explicitly into artifacts 
    run.upload_file(name = model_file_name, path_or_stream = model_file_name)
    
    # Complete the run
    run.complete()
   ```

    The script ends with ```run.complete()```, which marks the run as completed.  This function is typically used in interactive notebook scenarios.

## Option 2: Use ScriptRunConfig

[**ScriptRunConfig**](https://docs.microsoft.com/python/api/azureml-core/azureml.core.scriptrunconfig?view=azure-ml-py) is a class for setting up configurations for script runs. With this option, you can add monitoring code to be notified of completion or to get a visual widget to monitor.

This example expands on the basic sklearn Ridge model from above. It does a simple parameter sweep to sweep over alpha values of the model to capture metrics and trained models in runs under the experiment. The example runs locally against a user-managed environment. 

1. Create a training script `train.py`.

   ```python
   # train.py

   import os
   from sklearn.datasets import load_diabetes
   from sklearn.linear_model import Ridge
   from sklearn.metrics import mean_squared_error
   from sklearn.model_selection import train_test_split
   from azureml.core.run import Run
   from sklearn.externals import joblib

   import numpy as np

   #os.makedirs('./outputs', exist_ok = True)

   X, y = load_diabetes(return_X_y = True)

   run = Run.get_context()

   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 0)
   data = {"train": {"X": X_train, "y": y_train},
          "test": {"X": X_test, "y": y_test}}

   # list of numbers from 0.0 to 1.0 with a 0.05 interval
   alphas = mylib.get_alphas()

   for alpha in alphas:
      # Use Ridge algorithm to create a regression model
      reg = Ridge(alpha = alpha)
      reg.fit(data["train"]["X"], data["train"]["y"])

      preds = reg.predict(data["test"]["X"])
      mse = mean_squared_error(preds, data["test"]["y"])
      # log the alpha and mse values
      run.log('alpha', alpha)
      run.log('mse', mse)

      model_file_name = 'ridge_{0:.2f}.pkl'.format(alpha)
      # save model in the outputs folder so it automatically get uploaded
      with open(model_file_name, "wb") as file:
          joblib.dump(value = reg, filename = model_file_name)

      # upload the model file explicitly into artifacts 
      run.upload_file(name = model_file_name, path_or_stream = model_file_name)

      # register the model
      #run.register_model(file_name = model_file_name)

      print('alpha is {0:.2f}, and mse is {1:0.2f}'.format(alpha, mse))
  
   ```

2. The `train.py` script references `mylib.py` which allows you to get the list of alpha values to use in the ridge model.

   ```python
   # mylib.py
  
   import numpy as np

   def get_alphas():
      # list of numbers from 0.0 to 1.0 with a 0.05 interval
      return np.arange(0.0, 1.0, 0.05)
   ```

3. Configure a user-managed local environment.

   ```python
   from azureml.core import Environment
    
   # Editing a run configuration property on-fly.
   user_managed_env = Environment("user-managed-env")
    
   user_managed_env.python.user_managed_dependencies = True
    
   # You can choose a specific Python environment by pointing to a Python path 
   #user_managed_env.python.interpreter_path = '/home/johndoe/miniconda3/envs/myenv/bin/python'
   ```

4. Submit the ```train.py``` script to run in the user-managed environment. This whole script folder is submitted for training, including the ```mylib.py``` file.

   ```python
   from azureml.core import ScriptRunConfig
    
   exp = Experiment(workspace=ws, name="train-on-local")
   src = ScriptRunConfig(source_directory='./', script='train.py')
   src.run_config.environment = user_managed_env
   run = exp.submit(src)
   ```

## Manage a run

The [Start, monitor, and cancel training runs](how-to-manage-runs.md) article highlights specific Azure Machine Learning workflows for how to manage your experiments.

## View run details

### Monitor run with Jupyter notebook widget
When you use the **ScriptRunConfig** method to submit runs, you can watch the progress of the run with a [Jupyter widget](https://docs.microsoft.com/python/api/azureml-widgets/azureml.widgets?view=azure-ml-py). Like the run submission, the widget is asynchronous and provides live updates every 10-15 seconds until the job completes.

1. View the Jupyter widget while waiting for the run to complete.

   ```python
   from azureml.widgets import RunDetails
   RunDetails(run).show()
   ```

   ![Screenshot of Jupyter notebook widget](./media/how-to-track-experiments/run-details-widget.png)

You can also get a link to the same display in your workspace.

```python
print(run.get_portal_url())
```

2. **[For automated machine learning runs]** To access the charts from a previous run. Replace `<<experiment_name>>` with the appropriate experiment name:

   ``` 
   from azureml.widgets import RunDetails
   from azureml.core.run import Run

   experiment = Experiment (workspace, <<experiment_name>>)
   run_id = 'autoML_my_runID' #replace with run_ID
   run = Run(experiment, run_id)
   RunDetails(run).show()
   ```

   ![Jupyter notebook widget for Automated Machine Learning](./media/how-to-track-experiments/azure-machine-learning-auto-ml-widget.png)


To view further details of a pipeline click on the Pipeline you would like to explore in the table, and the charts will render in a pop-up from the Azure Machine Learning studio.

### Get log results upon completion

Model training and monitoring occur in the background so that you can run other tasks while you wait. You can also wait until the model has completed training before running more code. When you use **ScriptRunConfig**, you can use ```run.wait_for_completion(show_output = True)``` to show when the model training is complete. The ```show_output``` flag gives you verbose output. 


### Query run metrics

You can view the metrics of a trained model using ```run.get_metrics()```. You can now get all of the metrics that were logged in the  example above to determine the best model.

<a name="view-the-experiment-in-the-web-portal"></a>
## View the experiment in your workspace in [Azure Machine Learning studio](https://ml.azure.com)

When an experiment has finished running, you can browse to the recorded experiment run record. You can access the history from the [Azure Machine Learning studio](https://ml.azure.com).

Navigate to the Experiments tab and select your experiment. You are brought to the experiment run dashboard, where you can see tracked metrics and charts that are logged for each run. In this case, we logged MSE and the alpha values.

  ![Run details in the Azure Machine Learning studio](./media/how-to-track-experiments/experiment-dashboard.png)

You can drill down to a specific run to view its outputs or logs, or download the snapshot of the experiment you submitted so you can share the experiment folder with others.

### Viewing charts in run details

There are various ways to use the logging APIs to record different types of metrics during a run and view them as charts in Azure Machine Learning studio.

|Logged Value|Example code| View in portal|
|----|----|----|
|Log an array of numeric values| `run.log_list(name='Fibonacci', value=[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89])`|single-variable line chart|
|Log a single numeric value with the same metric name repeatedly used (like from within a for loop)| `for i in tqdm(range(-10, 10)):    run.log(name='Sigmoid', value=1 / (1 + np.exp(-i))) angle = i / 2.0`| Single-variable line chart|
|Log a row with 2 numerical columns repeatedly|`run.log_row(name='Cosine Wave', angle=angle, cos=np.cos(angle))   sines['angle'].append(angle)      sines['sine'].append(np.sin(angle))`|Two-variable line chart|
|Log table with 2 numerical columns|`run.log_table(name='Sine Wave', value=sines)`|Two-variable line chart|


## Example notebooks
The following notebooks demonstrate concepts in this article:
* [how-to-use-azureml/training/train-within-notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-within-notebook)
* [how-to-use-azureml/training/train-on-local](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-local)
* [how-to-use-azureml/training/logging-api/logging-api.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/logging-api)

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## Next steps

Try these next steps to learn how to use the Azure Machine Learning SDK for Python:

* See an example of how to register the best model and deploy it in the tutorial, [Train an image classification model with Azure Machine Learning](tutorial-train-models-with-aml.md).

* Learn how to [Train PyTorch Models with Azure Machine Learning](how-to-train-pytorch.md).
