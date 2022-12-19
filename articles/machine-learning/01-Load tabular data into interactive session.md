## Description

Load tabular data files that are in underlying cloud locations into your interactive R session. The cloud locations or files need to be registered as _Data assets_ or be in a registered _Datastore_ within the AzureML workspace for proper authentication.

## Scorecard

Yellow: most customers can get the job done but with difficulty/workarounds



## How to do it?

* Files can be read into an interactive R (or Python session) using the `azureml-fsspec` Python library and `reticulate` R package, and both **need to be installed** in the Compute Instance:
	* `azureml-fsspec` must be **pip installed** in the default conda environment (`azureml_py38` as of this writing) 
	* the R `reticulate` package needs to be at least version 1.26. 
	* This can be done manually in the CI’s terminal or through a setup script at CI creation time
* The user needs to retrieve the complete AzureML URI for the file to be used in the form of `azureml://subscriptions/<subscription_id>/resourcegroups/<resource_group_name>/workspaces/<workspace_name>/datastores/<datastore_name>/<path/to/file>`
	* This can be done through the CLI 
* The data asset needs to be created in AzureML (via Studio or CLIv2)

	Once the setup script is run on the compute instance and the file URI(s) has been retrieved, loading a tabular file into an R `data.frame` is a four step process:

	1. Load `reticulate`
	```
	library(reticulate)
	```
	2. Select the approprate conda environment which has `azureml-fsspec`
	```
	use_condaenv("azureml_py38")
	```
	3. Load `Pandas` in R
	```
	pd <- import("pandas")
	```
	4. Use Pandas read functions to read in the file(s) into the R environment
	```
	r_dataframe <- pd$read_csv(<complete-uri-of-file>)
	```


## Limitations and Pain Points
* Using `azureml-fsspec` with `Pandas` and `reticulate` only works in the R environment on the Compute Instance which can be accessed interactively through a Jupyter notebook running an R kernel
* The RStudio custom application container does not have the required authentication passthrough to make this work
* Getting the URI has to be done through AzureML Studio or Azure Storage Explorer. The complete URI is not available in the Details screen and you have to naviagate to the underlying storage, and the path to get the URI.
* This process only works for tabular data that can be read with Pandas (text-delimited, parquet, confirm what else.)
* While the ability to create a Compute Instance with a setup script that can install `azureml-fsspec` and check the version of `reticulate`, the setup script must first be uploaded to the Workspace User storage (`azureml://datastores/workspacefilestore/Users/`) before it can be invoked in the Compute Instance YAML


## Work to be planned
* Allow mounting of registered _Data assets_ and/or _Datastores_ to the Compute Instance (as is done in a job container) and allow these to be referenced with local paths 
	* In lieu of this ^, allow the use of _Data asset_ names in the form of `azureml:data_asset_name:version` for `azureml-fsspec`
* Allow the use of a local bash file as a setup script for a compute instance withtout having to upload it prior to specifying it in the YAML for a compute instance
* Update the OS image for the Compute Instance and install `azureml-fsspec` in the default conda environment (and others if necessary). **This might not be necessary if Data assets or Datastores can be mounted on the compute instance.**
* Expose the complete URI path of a registered data asset in the form of `azureml://subscriptions/<subscription_id>/resourcegroups/<resource_group_name>/workspaces/<workspace_name>/datastores/<datastore_name>/<path/to/file>`  in the Details screen of the asset. 


## Area(s) impacted

* Compute
* Data
* Experience
