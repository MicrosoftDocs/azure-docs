---
title: Track experiments and training metrics in Azure Machine Learning | Microsoft Docs
description: How to track your experiments and training metrics in Azure Machine Learning service.
services: machine-learning
author: heatherbshapiro
ms.author: hshapiro
manager: danielsc
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 09/24/2018
---

# Track experiments and training metrics in Azure Machine Learning
With the Azure Machine Learning service, you can track your experiments and monitor metrics to create better models. You can add logging to your training script to be able to track your experiments in the Web Portal as well as with widgets in Jupyter Notebooks. In this document, you will learn about the different ways to track your run in a local Jupyter Notebook. You can also check the progress of a running job in multiple ways through the Jupyter widget as well as a wait_for_completion method.

## What can be tracked
The below items can be added to a run while training an experiment. To view a more detailed list of what can be tracked on a run, view [the SDK reference documentation](https://docs.microsoft.com/python/api/overview/azure/azure-ml-sdk-overview?view=azure-ml-py).

  - Log metrics
    - Scalar values (float, integers, or strings)
    - Lists (float, integers, or strings)
    - Row or table (names lists of the above types)
    - Images
  - Tag a run
  - Give the run a name
  - Upload a file or directory

## Add experiment tracking
You can add tracking through Azure Machine Learning services to your training experiment. This example trains a simple sklearn Ridge model locally in a local Jupyter notebook. Learn more about submitting experiments to different environments [here](https://docs.microsoft.com/azure/machine-learning/service/how-to-set-up-training-targets). 
1. Load the workspace. To learn more about setting the workspace configuration, follow this [Quickstart guide](https://docs.microsoft.com/azure/machine-learning/service/quickstart-get-started).
  ```python
  from azureml.core import Workspace, Run
  import azureml.core
  
  ws = Workspace(workspace_name = <<workspace_name>>,
               subscription_id = <<subscription_id>>,
               resource_group = <<resource_group>>)
   ```
2. Create the Experiment.
  ```python
  from azureml.core import Experiment

  # make up an arbitrary name
  experiment_name = 'train-in-notebook'
  exp = Experiment(workspace_object = ws, name = experiment_name)
  ```
3. Start a training run in a local Jupyter Notebook. 
  ``` python
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

4. Add experiment tracking using the Azure Machine Learning service SDK, and upload a persisted model into the experiment run record as well. The code below adds tags, logs, and uploads a model file to the experiment run. 
  ```python 
  run = Run.start_logging(experiment = exp)
  run.tag("Description","My first run!")
  run.log('alpha', 0.03)
  reg = Ridge(alpha = 0.03)
  reg.fit(data['train']['X'], data['train']['y'])
  preds = reg.predict(data['test']['X'])
  run.log('mse', mean_squared_error(preds, data['test']['y']))
  joblib.dump(value = reg, filename = 'model.pkl')
  # Upload file directly to the outputs folder
  run.upload_file(name = 'outputs/model.pkl', path_or_stream = './model.pkl')

  run.complete()
```

## View the experiment in the web portal
When an experiment is done running, you can  browse to the recorded experiment run record. You can do this in two ways:
  - Get the URL to the run directly ```print(run.get_portal_url())```
  - You can also view the run details by submitting the name of the run, in this case, ```run```. This will point you to the Experiment name, Id, Type, Status, Datils Page, a link to the Web Portal and a link to documentation.

The link for the run brings you directly to the run details page in the web portal in Azure. Here you can see any properties, tracked metrics, images and charts that are logged in the experiment. In this case, we logged MSE and the alpha values. 

Under the outputs tab, you can view and download the model.pkl that we uploaded in the code above. This example did not save anything to logs, but if it had, you could see these under the logs tab. 

You can also download the snapshot of the experiment you submitted. 

## Monitor progress using Jupyter widgets
For longer running experiments, you can watch the progress of the run with a Jupyter Notebook widget. Like the run submission, the widget is asynchronous and provides live updates every 10-15 seconds until the job completes. This example runs locally against a user-managed environment. We can now expand on the basic ridge model from above and do a simple parameter sweep to sweep over alpha values of a sklearn ridge model to capture metrics and trained models in runs under the experiment.

1. Create a training script. This uses ```%%writefile%%``` to write the training code out to the script folder as ```train.py```.
  ```python
  %%writefile $project_folder/train.py

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

  run = Run.get_submitted_run()

  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 0)
  data = {"train": {"X": X_train, "y": y_train},
          "test": {"X": X_test, "y": y_test}}

  # list of numbers from 0.0 to 1.0 with a 0.05 interval
  alphas = np.arange(0.0, 1.0, 0.05)

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
  The script uses the Ridge model example and adds several logs, uploads the model file, and also registers each model. In this case we uploaded the models to the logs folder due to the missing ```outputs/``` preface to the name in the line ```run.upload_file)```.
  
2. The ```train.py``` script references ```mylib.py```. This file allows you to get the list of alpha values to use in the ridge model.
  ```python
  %%writefile $script_folder/mylib.py
  import numpy as np

  def get_alphas():
      # list of numbers from 0.0 to 1.0 with a 0.05 interval
      return np.arange(0.0, 1.0, 0.05)
  ```
3. Configure a user-managed local environment. 
  ```python
  from azureml.core.runconfig import RunConfiguration

  # Editing a run configuration property on-fly.
  run_config_user_managed = RunConfiguration()

  run_config_user_managed.environment.python.user_managed_dependencies = True

  # You can choose a specific Python environment by pointing to a Python path 
  #run_config.environment.python.interpreter_path = '/home/ninghai/miniconda3/envs/sdk2/bin/python'
  ```
4. Submit the ```train.py``` script to run in the user-managed environment. This whole script folder is submitted for execution, including the ```mylib.py``` file.
  ```python
  from azureml.core import ScriptRunConfig

  src = ScriptRunConfig(source_directory = script_folder, script = 'train.py', run_config = run_config_user_managed)
  run = exp.submit(src)
  ```
5. View the Jupyter widget while waiting for the run to complete.
  ```python
  
  from azureml.train.widgets import RunDetails
  RunDetails(run).show()
  ```
  
## Get log results upon completion
Model training and monitoring happen in the background so that you can run other tasks while you wait. You can also wait until the model has completed training before running more code. Use ```run.wait_for_completion(show_output = True)``` to show when the model training is complete. The ```show_output``` flag gives you verbose output.
  
## Query run metrics
You can view the metrics of a trained model using ```run.get_metrics()```. You can now get all of the metrics that were logged in the parameter sweep example above to determine the best model. 
1. Start off by determining what the best alpha value is in the list of metrics from above.
  ```python
  import numpy as np

  best_alpha = metrics['alpha'][np.argmin(metrics['mse'])]

  print('When alpha is {1:0.2f}, we have min MSE {0:0.2f}.'.format(
      min(metrics['mse']), 
      best_alpha
  ))
  ```
2. Once you load all of the metrics, you can find the run with the lowest Mean Squared Error value 
  ```python
  best_run_id = min(child_run_metrics, key = lambda k: child_run_metrics[k]['mse'])
  best_run = child_runs[best_run_id]
  print('Best run is:', best_run_id)
  print('Metrics:', child_run_metrics[best_run_id])
  ```
3. You can add tags to your runs to make them easier to catalog. In this case, we add a tag for the best run so that we can 
  ```python
  best_run.tag("Description","The best one")
  best_run.get_tags()
  ```
### Register the best model
In the above example, we registered each individual model within the script. Now that we have the best model, we can register it as well with ```model = run.register_model(model_name='best_ridge_model', model_path<<best-model-path>>)```

## List file names 
You can list all of the files that are associated with this run record by called ```run.get_file_names()```.

## Next steps
Try these next steps to learn how to use this Azure Machine Learning SDK for Python:
1. Learn how to register the best model and deploy it.
2. Follow the tutorial for training using PyTorch.
