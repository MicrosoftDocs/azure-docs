## Description

Registering a model is a three step process:
- Model saving which is saved in the filesystem of the job container
- Model logging which uploads the output directory of the model (artifact) to MLFlow server and saves it with the job run
* Model registering (or recording) which tells  MLFlow  that the logged artifact is a model (of a specific type) and creates a model version in the registry





## How to do it?

Model saving

Use the StudioUI

1. Navigate to the run where the model was logged
2. Register the model


## Limitations and Pain Points

- The R/MLFlow API offeres some convenience functions to do all of the steps above, however, it cannot be done programatically from an R job script or R interactive session
	* `mlflow_save_model()` 
	* `mlflow_log_model()`
	* `mlflow_create_registered_model()`
	* `mlflow_create_model_version()`

* Creating an empty model entity (i.e. registering a name) works fine with the `mlflow_create_registered_model()` function from the R/MLflow package, however, attempting to create a model version using the `mlflow_create_model_version()` from the R/MLflow package gives an error: 
```
Message = "The provided Model Flavors dictionary is invalid. When provided, Flavors must contain a top level python_function key with a loader_module sub-key under it."
```

* Our mlflow implementation is expecting a `python_function` flavor when called from a job. This is not the case when registering the model using Studio UI
- While it is possible to specify a custom model flavor of the `python_function` using the R/MLflow package, the package code needs to be updated to register it correctly requring a pull-request to the MLflow repo

possible solution:
* PR the r/mlflow package
* add a custom function to the azureml_utils.R to call the rest api
* use mlflow_cli?


## Work to be planned
* Easiest - Remove the MLFlow server check for python_function when it is an R model of the `crate` flavor
* Contribute to the MLFlow repo

## Area(s) impacted

