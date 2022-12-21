---
title: Deploy an R model to an online (real time) endpoint
titleSuffix: Azure Machine Learning
description: 'Learn how to deploy your R model to an online (real-time) managed endpoint'
ms.service: machine-learning
ms.date: 11/10/2022
ms.topic: how-to
author: samuel100
ms.author: samkemp
ms.reviewer: sgilley
ms.devlang: r
---

# How to deploy an R model to an online (real time) endpoint

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

In this article, you'll learn how to deploy an R model to a managed endpoint (Web API) so that your application can score new data against the model in near real-time. The steps you'll take are:

> [!div class="checklist"]
> - Package an R model using the [carrier package](https://github.com/r-lib/carrier) so that the model is reproducible.
> - Create a scoring R script using [plumber](https://www.rplumber.io/).
> - Create a custom Docker image containing all the required dependencies (for example; operating system, R version, R packages) to run your model in production.
> - Deploy your custom image to an online managed endpoint so you can score new data against your model in near real-time.
> - Test your deployed model.

## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).
- A familiarity with the [R programming language](http://www.r-project.org).
- The [Azure CLI extension for Machine Learning service (v2)](https://aka.ms/sdk-v2-install).
- A local machine with [R](http://www.r-project.org) installed, or an Azure Machine Learning compute instance that has been [setup with RStudio](how-to-create-manage-compute-instance.md#setup-rstudio-open-source). 
- In your R environment, you'll need to install the [carrier package](https://github.com/r-lib/carrier) using `install.packages("carrier")`

## Set up folder structure for project

Create this folder structure for your project:

```bash
# create a parent project folder 
mkdir azureml-deploy-r

# change directory to the project folder
cd azureml-deploy-r

# create a subfolder to store docker container build details
mkdir docker-context

# create a subfolder to store models
mkdir models

# create a subfolder to store R scripts
mkdir scripts
```

> [!NOTE]
> Your folder structure should look like:
>```
> └── 📁 azureml-deploy-r 
>     ├── 📁 docker-context
>     ├── 📁 models
>     └── 📁 scripts
>```

## Train and package an R Model

In an R console, execute the code below to train a model using `rpart` on the infamous `iris` dataset (which is built into R). The model is packaged into a *crate* using the [carrier package](https://github.com/r-lib/carrier), which creates functions in a self-contained environment. Using `crate` has two advantages:

1. They can easily be executed in another process.
1. Their effects are reproducible. You can run them locally with the same results as on a different process.

```r
# train.R
library(rpart)
library(carrier)

# set working directory to the project
setwd("./azureml-deploy-r")

# train a model on the iris data
model <- rpart(Species ~ ., data = iris, method = "class")

# create a crate
predictor <- crate(~ stats::predict(!!model, .x, method = "class"))

# save the crate to an rds file
saveRDS(predictor, file="./models/iris-model.rds")
```

## Create an R script to score new data using plumber

You'll use [plumber](https://www.rplumber.io/) to create a web API by merely decorating your existing R source code with roxygen2-like comments.

Create a new R file in the scripts subfolder of your project called `plumber.R` that contains the code below.

```r
# plumber.R
# This script will be deployed to a managed endpoint to do the model scoring

# << Get the model directory >>
# When you deploy a model as an online endpoint, AzureML mounts your model
# to your endpoint. Model mounting enables you to deploy new versions of the model without
# having to create a new Docker image. By default, a model registered with the name foo
# and version 1 would be located at the following path inside of your deployed 
# container: var/azureml-app/azureml-models/foo/1

# For example, if you have a directory structure of /azureml-examples/cli/endpoints/online/custom-container on your local # machine, where the model is named half_plus_two:
# model_dir <- Sys.getenv("AZUREML_MODEL_DIR")

# << Read the predictor function >>
# This reads the serialized predictor function we stored in a crate
model <- readRDS(paste0(model_dir,"/models/iris-model.rds"))

# << Readiness route vs. liveness route >>
# An HTTP server defines paths for both liveness and readiness. A liveness route is used to
# check whether the server is running. A readiness route is used to check whether the 
# server's ready to do work. In machine learning inference, a server could respond 200 OK 
# to a liveness request before loading a model. The server could respond 200 OK to a
# readiness request only after the model has been loaded into memory.

#* Liveness check
#* @get /live
function() {
  "alive"
}

#* Readiness check
#* @get /ready
function() {
  "ready"
}

# << The scoring function >>
# This is the function that is deployed as a web API that will score the model
# notice how it accepts parameters and posts back the classification.

#* @param sepal_length
#* @param sepal_width
#* @param petal_length
#* @param petal_width
#* @post /score
function(sepal_length, sepal_width, petal_length, petal_width) {
  newdata <- data.frame(
    Sepal.Length=sepal_length,
    Sepal.Width=sepal_width,
    Petal.Length=petal_length,
    Petal.Width=petal_width
  )
  scores<-model(newdata)
  return(colnames(scores)[which.max(scores)])
}
```

Your project folder structure will look like:

```
└── 📁 azureml-deploy-r 
    ├── 📁 docker-context
    ├── 📁 models
    │   └── 📄iris-model.rds
    └── 📁 scripts
        └── 📄plumber.R
```

## Create a custom Docker image

Custom container deployments can use web servers other than the default Python Flask server used by Azure Machine Learning - for example, plumber in R. These deployments still take advantage of Azure Machine Learning's built-in monitoring, scaling, alerting, and authentication.

In this section you'll learn how to bundle all your model dependencies (operating system, Linux packages, R packages) into a Docker image.

### Create a `Dockerfile`

 A `Dockerfile` is a text document that contains all the commands a user could call on the command line to assemble an image. In your project docker-context subfolder, create a file called `Dockerfile` that contains:

```dockerfile
# ./docker-context/Dockerfile
FROM rstudio/plumber:latest

ENTRYPOINT []

COPY ./start_plumber.R /tmp/start_plumber.R 

CMD ["Rscript", "/tmp/start_plumber.R"]
```

You'll notice that the `Dockerfile` is going to run an R script called **start_plumber.R**, which will initialize plumber. In your project `docker-context` subfolder, create an R script called `start_plumber.R` that contains the following code:

```r
# ./docker-context/start_plumber.R

entry_script_path <- paste0(Sys.getenv('AML_APP_ROOT'),'/', Sys.getenv('AZUREML_ENTRY_SCRIPT'))

pr <- plumber::plumb(entry_script_path)

args <- list(host = '0.0.0.0', port = 8000); 

if (packageVersion('plumber') >= '1.0.0') {
  pr$setDocs(TRUE)
} else { 
  args$swagger <- TRUE 
} 

do.call(pr$run, args)
```

### Build container

Your project folder structure will now look as follows:

```
└── 📁 azureml-deploy-r 
    ├── 📁 docker-context
    │   └── 📄start_plumber.R
    │   └── 📄Dockerfile
    ├── 📁 models
    │   └── 📄iris-model.rds
    └── 📁 scripts
        └── 📄plumber.R
```

To build the image in the cloud, execute the following bash commands in your terminal:

```bash
WORKSPACE=$(az config get --query "defaults[?name == 'workspace'].value" -o tsv)
ACR_NAME=$(az ml workspace show -n $WORKSPACE --query container_registry -o tsv | cut -d'/' -f9-)
IMAGE_TAG=${ACR_NAME}.azurecr.io/r_server

az acr build ./docker-context -t $IMAGE_TAG -r $ACR_NAME
```

The `az acr` command will automatically upload your docker-context folder - that contains the artifacts to build the image - to the cloud where the image will be built and hosted in an Azure Container Registry.

> [!NOTE]
> It may take a few minutes for the image to be built.

## Deploy model

In this section of the article, you'll deploy the model and image built in the previous steps to a managed online endpoint. 

### Create managed online endpoint

An *endpoint* is an HTTPS endpoint that clients - such as an application - can call to receive the scoring output of a trained model. It provides:

> [!div class="checklist"]
> - Authentication using "key & token" based auth
> - SSL termination
> - A stable scoring URI (endpoint-name.region.inference.ml.Azure.com)

In your project directory, create a new YAML file called **r-endpoint.yml** and populate it with:

```yml
# r-endpoint.yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
name: r-endpoint-iris
auth_mode: aml_token
```

Next, in your terminal execute the following CLI command to create an endpoint:

```azurecli
az ml online-endpoint create -f r-endpoint.yml
```

### Create deployment

A *deployment* is a set of resources required for hosting the model that does the actual scoring. A ***single** endpoint* can contain ***multiple** deployments*. The load balancing capabilities of Azure Machine Learning managed *endpoints* allows you to give any percentage of traffic to each deployment. Traffic allocation can be used to do safe rollout blue/green deployments by balancing requests between different instances.

To create your deployment, add a YAML file to your project folder called **r-deployment.yml** and populate it with the following:

> [!IMPORTANT]
> In the YAML file below, update the `<ACR_NAME>` placeholder. You can find the Azure Container Registry name with:
>
> ```azurecli
> az ml workspace show -n $WORKSPACE --query container_registry -o tsv | cut -d'/' -f9-
> ```

```yml
# ./r-deployment.yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
name: r-deployment
endpoint_name: r-endpoint-iris
code_configuration:
  code: ./scripts
  scoring_script: plumber.R
model:
  name: rplumber
  version: 1
  path: ./models
environment:
  image: <ACR_NAME>.azurecr.io/r_server
  inference_config:
    liveness_route:
      port: 8000
      path: /live
    readiness_route:
      port: 8000
      path: /ready
    scoring_route:
      port: 8000
      path: /score
instance_type: Standard_DS2_v2
instance_count: 1
```

Next, in your terminal execute the following CLI command to create the deployment (notice that you're setting 100% of the traffic to this model):

```azurecli
az ml online-deployment create -f r-deployment.yml --all-traffic --skip-script-validation
```

> [!NOTE]
> It may take several minutes for the service to be deployed

## Test

Once your deployment has been successfully created, you can test the endpoint using the Studio UI or the CLI:

# [Studio](#tab/azure-studio)

Navigate to the [Azure Machine Learning studio](https://ml.azure.com) and select from the left-hand menu **Endpoints**. Next, select the **r-endpoint-iris** you created earlier.

Enter the following json into the **Input data to rest real-time endpoint** textbox:

```json
{
    "sepal_length" : [6.7],
    "sepal_width" : [3.3],
    "petal_length" : [5.7],
    "petal_width" : [2.5]
}
```

Select **Test**. You should see the following output:

:::image type="content" source="media/how-to-razureml-deploy-an-r-model/test-r-model-ui.png" alt-text="Test an R Model":::

# [Azure CLI](#tab/cli)

### Create a sample request

In your project parent folder, create a file called **sample_request.json** and populate it with:

```json
{
    "sepal_length" : [6.7],
    "sepal_width" : [3.3],
    "petal_length" : [5.7],
    "petal_width" : [2.5]
}
```

### Invoke the endpoint

Invoke the request using:

```azurecli
az ml online-endpoint invoke --name r-endpoint-iris --request-file sample_request.json
```

---

## Clean-up resources

Now that you've successfully scored with your endpoint, you can delete it so you don't incur ongoing cost:

```azurecli
az ml online-endpoint delete --name r-endpoint-iris
```

# Next steps

For more information about using R with Azure Machine Learning, see [Overview of R capabilities in Azure Machine Learning](how-to-razureml-overview-r-capabilities.md)