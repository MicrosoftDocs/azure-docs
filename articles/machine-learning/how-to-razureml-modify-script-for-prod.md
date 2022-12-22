---
title: Adapt your R script to run in production
titleSuffix: Azure Machine Learning
description: 'Learn how to modify your existing R scripts to run in production on Azure Machine Learning'
ms.service: machine-learning
ms.date: 12/21/2022
ms.topic: how-to
author: wahalulu
ms.author: mavaisma
ms.reviewer: sgilley
ms.devlang: r
---

# Adapt your R script to run in production

This article explains how to take an existing R script and make the appropriate changes to run it as a job in Azure Machine Learning.

You'll have to make most of, if not all, of the changes described in detail below.

## Remove any action that may require user interaction

Your R script must be designed to run unattended and will be executed via the Rscript command within the container. Make sure you remove any interactive inputs or outputs from the script. 

## Add parsing of input parameters 

If your script requires any sort of input parameter (most scripts do), those inputs will be passed into the script via the `Rscript` call as shown below, and the inputs will be specified in the job YAML. 

```bash
Rscript <name-of-r-script>.R
--data_file ${{inputs.<name-of-yaml-input-1>}} 
--brand ${{inputs.<name-of-yaml-input-2>}}
```
You'll have to parse the inputs and make the proper type conversions within the R script. We recommend that you use the `optparse` package. The following snippet shows how to initiate the parser, add all your inputs as options and then parse the inputs with the appropriate data types. You can also add defaults (which is handy for testing.) We recommend that you add an `--output` parameter with a default value of `./outputs` so that any output of the script 

```r
library(optparse)

parser <- OptionParser()

parser <- add_option(
  parser,
  "--output",
  type = "character",
  action = "store",
  default = "./outputs"
)

parser <- add_option(
  parser,
  "--data_file",
  type = "character",
  action = "store",
  default = "data/myfile.csv"
)

parser <- add_option(
  parser,
  "--brand",
  type = "double",
  action = "store",
  default = 1
)
args <- parse_args(parser)
```
`args` is a named list and you can use any of the parameters later in your script.

## Source the `azureml_utils.R` helper script

You must source a helper script called `azureml_utils.R` script in the same working directory of the R script that will be run. This is required for the running R script to be able to communicate with the MLFlow server. This helper script provides a method to continuously retrieve the authentication token since this changes quickly in a running job, and allows you to use the logging functions provided in the [R MLFlow API](https://mlflow.org/docs/latest/R-api.html) to log models, parameters, tags and general artifacts.

We recommend you start your R script with the following line:

```r
source("azureml_utils.R")
```
The code for the `azureml_utils.R` script is shown below:

::: code language="r" source="~/azureml-examples-mavaisma-r-azureml/tutorials/using-r-with-azureml/03-train-model-job/src/azureml_utils.R" :::

## Read your data files locally

When you run an R script as a job, Azure Machine Learning takes the data you specify in the job submission and mounts it on the running container. Therefore you'll be able to read the data file(s) as if they were local files on the running container.

* Make sure your source data is registered as a data asset 
* Pass the data asset by name in the job submission parameters
* Read the files as you normally would

In the [parameters section above](#add-parsing-of-input-parameters) you defined an input parameter called `--data_file`. You can read 

## Create an environment with all the R packages you need

You can create a custom R [environment](concept-environments.md) on Azure Machine Learning by specifying a Docker image. 

All Docker context files for R environments must have the following in order to work on Azure Machine Learning:

```dockerfile
FROM rocker/tidyverse:latest

# Install python
RUN apt-get update -qq && \
 apt-get install -y python3-pip tcl tk libz-dev libpng-dev

RUN ln -f /usr/bin/python3 /usr/bin/python
RUN ln -f /usr/bin/pip3 /usr/bin/pip
RUN pip install -U pip

# Install azureml-mlflow
RUN pip install azureml-mlflow
RUN pip install mlflow

# Create link for python
RUN ln -f /usr/bin/python3 /usr/bin/python

# Install R packages required for logging with mlflow (these are necessary)
RUN R -e "install.packages('mlflow', dependencies = TRUE, repos = 'https://cloud.r-project.org/')"
RUN R -e "install.packages('carrier', dependencies = TRUE, repos = 'https://cloud.r-project.org/')"
RUN R -e "install.packages('optparse', dependencies = TRUE, repos = 'https://cloud.r-project.org/')"
RUN R -e "install.packages('tcltk2', dependencies = TRUE, repos = 'https://cloud.r-project.org/')"
```

The base image above is `rocker/tidyverse:latest` which has many R packages and their dependencies already installed. 

> [!IMPORTANT]
> You must install any R packages your script will need to run in advance. You can add more lines to the Docker context file as needed.

```dockerfile
RUN R -e "install.packages('<package-to-install>', dependencies = TRUE, repos = 'https://cloud.r-project.org/')"
```

## Save job artifacts (images, data, etc.)

> [!IMPORTANT]
> This section does not apply to models. See the following two sections for model specific saving and logging instructions.

You can store arbitrary script outputs like data files, images, serialized R objects, etc. that are generated by the R script in Azure Machine Learning. Create a `./outputs` directory to store any generated artifacts (images, models, data, etc.) Any files saved to `./outputs` will be automatically included in the run within uploaded to the experiment at the end of the run. Since you added a default value for the `--output` parameter in the [input parameters](#add-parsing-of-input-parameters) section above, you can include the following code snippet in your R script to create the `output` directory.

```r
if (!dir.exists(args$output)) {
  dir.create(args$output)
}
```
Once this directory is created, you can save artifacts to that directory. For example:

```r
# create and save a plot
library(ggplot2)

myplot <- ggplot(...)

ggsave(myplot, 
       filename = "./outputs/myplot.png")


# save an rds serialized object
saveRDS(myobject, file = "./outputs/myobject.rds")

```

## `crate` your models with the `carrier` package

The [R MLFlow API documentation](https://mlflow.org/docs/latest/models.html#r-function-crate) specifies that your R models need to be of the `crate` _model flavor_.  

* If your R script trains a model and you produce a model object, you'll need to `crate` it to be able to deploy it at a later time with Azure Machine Learning.
* When using the `crate` function, you need to use explicit namespaces when calling any package function you need.

Let's say you have a timeseries model object called `my_ts_model` created with the `fable` package. In order to make this model callable when it's deployed, you need to create a crate where you'll pass in the model object and a forecasting horizon in number of periods:

```r
library(carrier)
crated_model <- crate(function(x)
{
  fabletools::forecast(!!my_ts_model, h = x)
})
```
The `crated_model` object is the one you'll log.

## Log models, parameters, tags, or other artifacts with the R MLFlow API

In addition to [saving any generated artifacts](#save-job-artifacts-images-data-etc), you can also log models, tags, and parameters for each run. Use the R MLFlow API to do so.

When you log a model, you log the _crated model_ your created as described in the [previous section](#crate-your-models-with-the-carrier-package).

> [!NOTE]
> When you log a model, the model is also saved and added to the run artifacts. There is no need to explicitly save a model unless you are not going to log it.

To log a model, and/or parameter, you need to:

    1. Start the run with `mlflow_start_run()`
    1. Log artifacts with `mlflow_log_model`, `mlflow_log_param`, or `mlflow_log_batch`
    1. End the run with `mflow

For example, to log the `crated_model` object as created in the [previous section](#crate-your-models-with-the-carrier-package), you would include the following code in your R script:

```r
mlflow_start_run()

mlflow_log_model(
  model = crated_model, # the crate model object
  artifact_path = "model" # a path to save the model object to
  )

mlflow_log_param(<key-name>, <value>)

mlflow_end_run()
```

## Script structure and example

Use the following code snippet as a guide to structure your R script following all the changes outlined in this article.

```r
# BEGIN R SCRIPT

# source the azureml_utils.R script which is needed to use the MLFlow back end
# with R
source("azureml_utils.R")

# load your packages here. Make sure that they are installed in the container.
library(...)

# parse the command line arguments.
library(optparse)

parser <- OptionParser()

parser <- add_option(
  parser,
  "--output",
  type = "character",
  action = "store",
  default = "./outputs"
)

parser <- add_option(
  parser,
  "--data_file",
  type = "character",
  action = "store",
  default = "data/myfile.csv"
)

parser <- add_option(
  parser,
  "--brand",
  type = "double",
  action = "store",
  default = 1
)
args <- parse_args(parser)

# your own R code goes here
# - model building/training
# - visualizations
# - etc.

# create the ./outputs directory
if (!dir.exists(args$output)) {
  dir.create(args$output)
}

# log models and parameters to MLFlow
mlflow_start_run()

mlflow_log_model(
  model = crated_model, # the crate model object
  artifact_path = "model" # a path to save the model object to
  )

mlflow_log_param(<key-name>, <value>)

mlflow_end_run()

## END OF R SCRIPT
```

A complete example of an R script that has all of the steps described in this document can be found [here.](~/azureml-examples-mavaisma-r-azureml/tutorials/using-r-with-azureml/03-train-model-job/src/timeseries-train-single.R)

## Additional suggestions

These are some additional suggestions you may want to consider:

- Use R's `tryCatch` function for exception and error handling
- Add explicit logging for troubleshooting and debugging


## Next steps
