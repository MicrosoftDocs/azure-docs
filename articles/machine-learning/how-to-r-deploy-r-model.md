---
title: Deploy a registered R model to an online (real time) endpoint
titleSuffix: Azure Machine Learning
description: 'Learn how to deploy your R model to an online (real-time) managed endpoint'
ms.service: machine-learning
ms.subservice: core
ms.date: 01/12/2023
ms.topic: how-to
author: wahalulu
ms.author: mavaisma
ms.reviewer: sgilley
ms.devlang: r
ms.custom: devx-track-azurecli
---

# How to deploy a registered R model to an online (real time) endpoint

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

In this article, you'll learn how to deploy an R model to a managed endpoint (Web API) so that your application can score new data against the model in near real-time. 

## Prerequisites

- An [Azure Machine Learning workspace](quickstart-create-resources.md).
- Azure [CLI and ml extension installed](how-to-configure-cli.md).  Or use a [compute instance in your workspace](quickstart-create-resources.md), which has the CLI pre-installed.
- At least one custom environment associated with your workspace. Create [an R environment](how-to-r-modify-script-for-production.md#create-an-environment), or any other custom environment if you don't have one.
- An understanding of the [R `plumber` package](https://www.rplumber.io/index.html)
- A model that you've trained and [packaged with `crate`](how-to-r-modify-script-for-production.md#crate-your-models-with-the-carrier-package), and [registered into your workspace](how-to-r-train-model.md#register-model)

## Create a folder with this structure

Create this folder structure for your project:

```
📂 r-deploy-azureml
 ├─📂 docker-context
 │  ├─ Dockerfile
 │  └─ start_plumber.R
 ├─📂 src
 │  └─ plumber.R
 ├─ deployment.yml
 ├─ endpoint.yml
```

The contents of each of these files is shown and explained in this article.


### Dockerfile

This is the file that defines the container environment. You'll also define the installation of any additional R packages here.

A sample **Dockerfile** will look like this:

```dockerfile
# REQUIRED: Begin with the latest R container with plumber
FROM rstudio/plumber:latest

# REQUIRED: Install carrier package to be able to use the crated model (whether from a training job
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

Modify the file to add the packages you need for your scoring script.

### plumber.R

> [!IMPORTANT]
> This section shows how to structure the **plumber.R** script. For detailed information about the `plumber` package, see [`plumber` documentation](https://www.rplumber.io/index.html) .

The file **plumber.R** is the R script where you'll define the function for scoring. This script also performs tasks that are necessary to make your endpoint work. The script:

- Gets the path where the model is mounted from the `AZUREML_MODEL_DIR` environment variable in the container.
- Loads a model object created with the `crate` function from the `carrier` package, which was saved as **crate.bin** when it was packaged.  
- _Unserializes_ the model object
- Defines the scoring function

> [!TIP]
> Make sure that whatever your scoring function produces can be converted back to JSON. Some R objects are not easily converted.

```r
# plumber.R
# This script will be deployed to a managed endpoint to do the model scoring

# REQUIRED
# When you deploy a model as an online endpoint, Azure Machine Learning mounts your model
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
# in the example here, forecast_horizon (the number of time units to forecast) is the input to scoring_function.  
# the output is a tibble
# we are converting some of the output types so they work in JSON


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

### start_plumber.R

The file **start_plumber.R** is the R script that gets run when the container starts, and it calls your **plumber.R** script. Use the following script as-is.

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

## Build container

These steps assume you have an Azure Container Registry associated with your workspace, which is created when you create your first custom environment.  To see if you have a custom environment:

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).
1. Select your workspace if necessary.
1. On the left navigation, select **Environments**.
1. On the top, select **Custom environments**.
1. If you see custom environments, nothing more is needed.
1. If you don't see any custom environments, create [an R environment](how-to-r-modify-script-for-production.md#create-an-environment), or any other custom environment.  (You *won't* use this environment for deployment, but you *will* use the container registry that is also created for you.)

Once you have verified that you have at least one custom environment, use the following steps to build a container.

1. Open a terminal window and sign in to Azure.  If you're doing this from an [Azure Machine Learning compute instance](quickstart-create-resources.md#create-a-compute-instance), use:

    ```azurecli
    az login --identity
    ```

    If you're not on the compute instance, omit `--identity` and follow the prompt to open a browser window to authenticate.

1. Make sure you have the most recent versions of the CLI and the `ml` extension:
    
    ```azurecli
    az upgrade
    ```

1. If you have multiple Azure subscriptions, set the active subscription to the one you're using for your workspace. (You can skip this step if you only have access to a single subscription.)  Replace `<SUBSCRIPTION-NAME>` with your subscription name.  Also remove the brackets `<>`.

    ```azurecli
    az account set --subscription "<SUBSCRIPTION-NAME>"
    ```

1. Set the default workspace.  If you're doing this from a compute instance, you can use the following command as is.  If you're on any other computer, substitute your resource group and workspace name instead.  (You can find these values in [Azure Machine Learning studio](how-to-r-train-model.md#submit-the-job).)

    ```azurecli
    az configure --defaults group=$CI_RESOURCE_GROUP workspace=$CI_WORKSPACE
    ```

1. Make sure you are in your project directory.

    ```bash
    cd r-deploy-azureml
    ```

1. To build the image in the cloud, execute the following bash commands in your terminal. Replace `<IMAGE-NAME>` with the name you want to give the image.

    If your workspace is in a virtual network, see [Enable Azure Container Registry (ACR)](how-to-secure-workspace-vnet.md#enable-azure-container-registry-acr) for additional steps to add `--image-build-compute` to the `az acr build` command in the last line of this code.

    ```azurecli
    WORKSPACE=$(az config get --query "defaults[?name == 'workspace'].value" -o tsv)
    ACR_NAME=$(az ml workspace show -n $WORKSPACE --query container_registry -o tsv | cut -d'/' -f9-)
    IMAGE_TAG=${ACR_NAME}.azurecr.io/<IMAGE-NAME>
    
    az acr build ./docker-context -t $IMAGE_TAG -r $ACR_NAME
    ```

> [!IMPORTANT]
> It will take a few minutes for the image to be built. Wait until the build process is complete before proceeding to the next section.  Don't close this terminal, you'll use it next to create the deployment.

The `az acr` command will automatically upload your docker-context folder - that contains the artifacts to build the image - to the cloud where the image will be built and hosted in an Azure Container Registry.


## Deploy model

In this section of the article, you'll define and create an [endpoint and deployment](concept-endpoints.md) to deploy the model and image built in the previous steps to a managed online endpoint.

An *endpoint* is an HTTPS endpoint that clients - such as an application - can call to receive the scoring output of a trained model. It provides:

> [!div class="checklist"]
> - Authentication using "key & token" based auth
> - SSL termination
> - A stable scoring URI (endpoint-name.region.inference.ml.Azure.com)

A *deployment* is a set of resources required for hosting the model that does the actual scoring. A **single** *endpoint* can contain **multiple** *deployments*. The load balancing capabilities of Azure Machine Learning managed endpoints allows you to give any percentage of traffic to each deployment. Traffic allocation can be used to do safe rollout blue/green deployments by balancing requests between different instances.

### Create managed online endpoint

1. In your project directory, add the **endpoint.yml** file with the following code. Replace `<ENDPOINT-NAME>` with the name you want to give your managed endpoint.

    ```yml
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
    name: <ENDPOINT-NAME>
    auth_mode: aml_token
    ```

1. Using the same terminal where you built the image, execute the following CLI command to create an endpoint:

    ```azurecli
    az ml online-endpoint create -f endpoint.yml
    ```

1. Leave the terminal open to continue using it in the next section.

### Create deployment

1. To create your deployment, add the following code to the **deployment.yml** file. 

    * Replace `<ENDPOINT-NAME>` with the endpoint name you defined in the **endpoint.yml** file
    * Replace `<DEPLOYMENT-NAME>` with the name you want to give the deployment
    * Replace `<MODEL-URI>` with the registered model's URI in the form of `azureml:modelname@latest`
    * Replace `<IMAGE-TAG>` with the value from:
    
         ```bash
         echo $IMAGE_TAG
         ```
    
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

1. Next, in your terminal execute the following CLI command to create the deployment (notice that you're setting 100% of the traffic to this model):

    ```azurecli
    az ml online-deployment create -f deployment.yml --all-traffic --skip-script-validation
    ```

> [!NOTE]
> It may take several minutes for the service to be deployed.  Wait until deployment is finished before proceeding to the next section.

## Test

Once your deployment has been successfully created, you can test the endpoint using studio or the CLI:

# [Studio](#tab/azure-studio)

Navigate to the [Azure Machine Learning studio](https://ml.azure.com) and select from the left-hand menu **Endpoints**. Next, select the **r-endpoint-iris** you created earlier.

Enter the following json into the **Input data to rest real-time endpoint** textbox:

```json
{
    "forecast_horizon" : [2]
}
```

Select **Test**. You should see the following output:

:::image type="content" source="media/how-to-r-deploy-an-r-model/test-deployment.png" alt-text="Screenshot shows results from testing a model." lightbox="media/how-to-r-deploy-an-r-model/test-deployment.png":::

# [Azure CLI](#tab/cli)

### Create a sample request

In your project parent folder, create a file called **sample_request.json** and populate it with:


```json
{
    "forecast_horizon" : [2]
}
```

### Invoke the endpoint

Invoke the request.  This example uses the name r-endpoint-forecast:

```azurecli
az ml online-endpoint invoke --name r-endpoint-forecast --request-file sample_request.json
```

---

## Clean-up resources

Now that you've successfully scored with your endpoint, you can delete it so you don't incur ongoing cost:

```azurecli
az ml online-endpoint delete --name r-endpoint-forecast
```

## Next steps

For more information about using R with Azure Machine Learning, see [Overview of R capabilities in Azure Machine Learning](how-to-r-overview-r-capabilities.md)
