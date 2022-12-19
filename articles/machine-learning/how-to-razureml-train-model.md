---
title: Train R models in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: 'Learn how to train R models in Azure Machine Learning.'
ms.service: machine-learning
ms.date: 11/10/2022
ms.topic: how-to
author: wahalulu
ms.author: mavaisma
ms.reviewer: sgilley
ms.devlang: r
---

# How to train R models in Azure Machine Learning

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

In this article you will learn how to train a model using R in Azure Machine Learning.

## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).
- Familiarity with the [R programming language](http://www.r-project.org).
- Familiarity with using a terminal application such as the [RStudio terminal](https://support.rstudio.com/hc/articles/115010737148-Using-the-RStudio-Terminal-in-the-RStudio-IDE), [Linux terminal](https://ubuntu.com/tutorials/command-line-for-beginners#1-overview) or [macOS terminal](https://support.apple.com/guide/terminal/welcome/mac).
- The [Azure CLI extension for Machine Learning service (v2)](https://aka.ms/sdk-v2-install).
- A local machine with [R](http://www.r-project.org) installed, or an Azure Machine Learning compute instance that has been [setup with RStudio](how-to-create-manage-compute-instance.md#setup-rstudio-open-source). 
- In your R environment, you'll need to install the [carrier package](https://github.com/r-lib/carrier) using `install.packages("carrier")`


## Set up folder structure for project

In your terminal application, create this folder structure for your project:

```bash
# create a parent project folder
mkdir azureml-train-r

# change directory to the project folder
cd azureml-train-r

# create a subfolder to store R scripts
mkdir src

# create a subfolder to store artifacts to build a container
mkdir docker-context
```

> [!NOTE]
> Your folder structure should look like:
>```
> └── 📁 azureml-train-r
>     ├── 📁 docker-context
>     ├── 📁 src
>```

## Create an R training script

```r
# src/train.R
library(rpart)
library(carrier)
library(optparse)

parser <- OptionParser()
parser <- add_option(
  parser,
  "--data_file",
  type="character", 
  action="store"
)

parser <- add_option(
  parser,
  "--model_folder",
  type="character", 
  action="store"
)

args <- parse_args(parser)

print("data file...\n")
print(args$data_file)

file_name <- file.path(args$data_file)

print("first 6 rows...\n")
iris <- read.csv(file_name)
print(head(iris))


print("building model...\n")

model <- rpart(species ~ ., data = iris, method = "class")

predictor <- crate(~ stats::predict(!!model, .x, method = "class"))

model_output <- file.path(args$model_folder, "iris-model.rds")

print("model output....\n")
print(model_output)

print("saving model....\n")
saveRDS(predictor, file=model_output)


```

## Create an R environment

Azure Machine Learning *environments* are an encapsulation of the environment where your machine learning training happens. You can encapsulate R packages (and their Linux package dependencies), environment variables, and software settings around your training scripts. The environments are managed and versioned entities within your Machine Learning workspace that enable reproducible, auditable, and portable machine learning workflows across a variety of compute targets.

> [!TIP]
> We recommend creating your environments at the start of the project. They

```dockerfile
# ./docker-context/Dockerfile
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

# Install additional R packages
COPY r-package-install.R .
RUN Rscript r-package-install.R
```

```r
# ./docker-context/r-package-install.R
pkgs <- c("mlflow",
          "carrier",
          "optparse",
          "tcltk2")

devtools::install_cran(pkgs)
```


```yml
# ./r-environment.yml
$schema: https://azuremlschemas.azureedge.net/latest/environment.schema.json
name: r-environment-with-mlflow
build:
  path: docker-context
```

```azurecli
az ml environment create -f r-environment.yml
```

## Submit job

```yml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
command: >
  Rscript train.R 
  --data_file ${{inputs.iris}}
  --model_folder ${{outputs.model}}
code: src

inputs:
  iris: 
    type: uri_file
    path: https://azuremlexamples.blob.core.windows.net/datasets/iris.csv
outputs:
  model:
    type: custom_model
environment: azureml:r-environment-with-mlflow@latest
compute: azureml:cpu-cluster
display_name: r-iris-example
experiment_name: r-iris-example
description: Train an R model on the Iris dataset.
```

## Create model assets

## Next steps

* [How to deploy an R model to an online (real time) endpoint](how-to-razureml-deploy-an-r-model.md)
