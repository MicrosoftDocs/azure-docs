---
title: Deploy an R model to an online (real time) endpoint
titleSuffix: Azure Machine Learning
description: 'Learn how to deploy your R model to an online (real-time) managed endpoint'
ms.service: machine-learning
ms.date: 11/10/2022
ms.topic: how-to
author: wahalulu
ms.author: samkemp
ms.reviewer: sgilley
ms.devlang: r
---

# How to deploy an R model to an online (real time) endpoint

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

In this article, you'll learn how to deploy an R model to a managed endpoint (Web API) so that your application can score new data against the model in near real-time. 

## Prerequisites

- An [Azure Machine Learning workspace](quickstart-create-resources.md).
- An [Azure Container Registry] associated with the workspace
- One or more models
- Azure [CLI and ml extension installed](how-to-configure-cli.md).  Or use a [compute instance in your workspace](quickstart-create-resources.md), which has the CLI pre-installed.
- [An R environment](how-to-razureml-modify-script-for-prod.md#create-an-environment) for the compute cluster to use to run the job.
- An understanding of the [R `plumber` package](https://www.rplumber.io/index.html)

## Create a folder with this structure

Create this folder structure for your project:
> ```
> 📁 r-deploy-azureml
> ├─ docker-context
> │  ├─ Dockerfile
> │  ├─ start_plumber.R
> ├─ src
> │  ├─ plumber.R
> ├─ deployment.yml
> ├─ endpoint.yml
> ```

![NOTE]
> The endpoint and deployment files are explained [later in the article](#deploy-model).

### The `Dockerfile`

This is the file that defines the container environment. You will also define the installation of any additional R packages here.

A sample **Dockerfile** will look like this:

```dockerfile
# REQUIRED: Begin with the latest R container with plumber
FROM rstudio/plumber:latest

# REQUIRED: Install carrier package to be able to use the crated model (wether from a training job
# or uploaded)
RUN R -e "install.packages('carrier', dependencies = TRUE, repos = 'https://cloud.r-project.org/')"

# OPTIONAL: Install any additional R packages you may need for your model crate to run
RUN R -e "install.packages('<PACKAGE-NAME>', dependencies = TRUE, repos = 'https://cloud.r-project.org/')"
RUN R -e "install.packages('<PACKAGE-NAME>', dependencies = TRUE, repos = 'https://cloud.r-project.org/')"

# REQUIRED
ENTRYPOINT []

COPY ./start_plumber.R /tmp/start_plumber.R 

CMD ["Rscript", "/tmp/start_plumber.R"]
```

### The `plumber.R` file

> [!IMPORTANT]
> This section shows how to structure the **plumber.R** script. Please read [`plumber's` documentation](https://www.rplumber.io/index.html) for detailed information about the `plumber` package.

This is the R script where you will define the function for scoring. This scrip also performs the following tasks that are necessary to make all of this work. The script:

- Gets the path where the model is mounted from the `AZUREML_MODEL_DIR` environment variable 
- Loads a model object created with the `crate` function from the `carrier` package which is saved as **crate.bin**.
- _Unserializes_ the model object
- Defines the scoring function

> [!TIP]
> Make sure that whatever your scoring function produces can be converted back to JSON. Some R objects are not easily converted.

```r
# plumber.R
# This script will be deployed to a managed endpoint to do the model scoring

# REQUIRED
# When you deploy a model as an online endpoint, AzureML mounts your model
# to your endpoint. Model mounting enables you to deploy new versions of the model without
# having to create a new Docker image.

model_dir <- Sys.getenv("AZUREML_MODEL_DIR")

# REQUIRED
# This reads the serialized model with its respecive predict/score method you 
# registered. The loaded load_model object is a raw binary object.
load_model <- readRDS(paste0(model_dir, "/models/crate.bin"))

# REQUIRED
# You have to unserialize the load_model object to make it its function
scoring_function <- unserialize(load_model)

# REQUIRED
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
# Make sure that whatever you are producing as a score can be converted 
# to JSON to be sent back as the API response

#* @param forecast_horizon
#* @post /score
function(forecast_horizon) {
  scoring_function(as.numeric(forecast_horizon)) |> 
    tibble::as_tibble() |> 
    dplyr::transmute(period = as.character(yr_wk),
                     dist = as.character(logmove),
                     forecast = .mean) |> 
    jsonlite::toJSON()
}

```

### The `start_plumber.R` file

This is the R script that gets run when the container starts, and it calls your **plumber.R** script. Use the script below as-is.

```r
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

## Register model

This article shows you how to register a model created in a training job run and packaged with crate. See the [modify R script article](how-to-razureml-modify-script-for-prod.md#crate-your-models-with-the-carrier-package) and the [run training job]() articles for mor information.

@@sdgilley 

Need screen shots


## Build container

To build the image in the cloud, execute the following bash commands in your terminal. Replace <IMAGE-NAME> with the name you want to give the image.

```bash
WORKSPACE=$(az config get --query "defaults[?name == 'workspace'].value" -o tsv)
ACR_NAME=$(az ml workspace show -n $WORKSPACE --query container_registry -o tsv | cut -d'/' -f9-)
IMAGE_TAG=${ACR_NAME}.azurecr.io/<IMAGE-NAME>

az acr build ./docker-context -t $IMAGE_TAG -r $ACR_NAME
```

The `az acr` command will automatically upload your docker-context folder - that contains the artifacts to build the image - to the cloud where the image will be built and hosted in an Azure Container Registry.

> [!NOTE]
> It may take a few minutes for the image to be built.

## Deploy model

In this section of the article, you'll define and create an [endpoint and deployment](concept-endpoints.md) to deploy the model and image built in the previous steps to a managed online endpoint. 

An *endpoint* is an HTTPS endpoint that clients - such as an application - can call to receive the scoring output of a trained model. It provides:

> [!div class="checklist"]
> - Authentication using "key & token" based auth
> - SSL termination
> - A stable scoring URI (endpoint-name.region.inference.ml.Azure.com)

A *deployment* is a set of resources required for hosting the model that does the actual scoring. A ***single** endpoint* can contain ***multiple** deployments*. The load balancing capabilities of Azure Machine Learning managed *endpoints* allows you to give any percentage of traffic to each deployment. Traffic allocation can be used to do safe rollout blue/green deployments by balancing requests between different instances.

### Create managed online endpoint

In your project directory, add the **endpoint.yml** file with the code below. Replace <ENDPOINT-NAME> with the name you want to give your managed endpoint.

```yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
name: <ENDPOINT-NAME>
auth_mode: aml_token
```

Next, in your terminal execute the following CLI command to create an endpoint:

```azurecli
az ml online-endpoint create -f endpoint.yml
```

### Create deployment

To create your deployment, add the **deployment.yml** with the code below. 

* Replace <ENDPOINT-NAME> with the endpoint name you defined in the **environment.yml** file
* Replace <DEPLOYMENT-NAME> with the name you want to give the deployment
* Replace <MODEL-URL> with the registered model's URI in the form of `azureml:modelname@latest`
* Replace <IMAGE-TAG> with the name of the created image you defined earlier

> [!TIP]
> You can find the Azure Container Registry name with:
>
> ```bash
> echo $IMAGE_TAG
> ```



```yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
name: <DEPLOYMENT-NAME>
endpoint_name: <ENDPOINT-NAME>
code_configuration:
  code: ./src
  scoring_script: plumber.R
model: <MODEL-URI>
environment:
  image: <IMAGE-TAG>
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