---
title: "Tutorial: Train your first ML model with R"
titleSuffix: Azure Machine Learning
description: In this tutorial, you learn the foundational design patterns in Azure Machine Learning, and train a logistic regression model model using R packages azuremlsdk and caret to predict likelihood of a fatality in an automobile accident.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.reviewer: sgilley
author: revodavid
ms.author: davidsmi
ms.date: 10/21/2019
---

# Tutorial: Train your first ML model using R & Azure Machine Learning

[!INCLUDE [applies-to-skus](../../../includes/aml-applies-to-basic-enterprise-sku.md)]

This tutorial is **part two of a two-part tutorial series**. In the previous tutorial, you [created a workspace and a compute instance](tutorial-1st-experiment-R-set-up.md).  In this tutorial, you learn the foundational design patterns in Azure Machine Learning.  You'll train and deploy a  logistic regression model using `azuremlsdk` and `caret`  to predict the likelihood of a fatality in an automobile accident. After completing this tutorial, you'll have the practical knowledge of the R SDK to scale up to developing more-complex experiments and workflows.

In this tutorial, you learn the following tasks:

> [!div class="checklist"]
> * Connect your workspace
> * Load data and prepare for training
> * Upload data to the datastore so it is available for remote training
> * Create a compute resource
> * Train a caret model to predict probability of fatality
> * Deploy a prediction endpoint
> * Test the model from R

If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

## Prerequisites

The only prerequisite is to run part one of this tutorial, [Tutorial: Get started with Azure Machine Learning and its R SDK](tutorial-1st-experiment-r-set-up.md).

In this part of the tutorial, you run `R-Tutorial.Rmd` in RStudio which you cloned in part one. This article walks through the that code.

## Open RStudio

1. Sign in to [https://ml.azure.com/](https://ml.azure.com/).

1. On the left hand side, select **Compute**.

1. Select **RStudio** in the **URI** column for the compute instance you created in [part one of this tutorial](tutorial-1st-experiment-r-set-up.md#compute-instance)..

   The link starts the RStudio server and opens RStudio in a new browser tab.  

1. Open the `R-Tutorial.Rmd` file in the **vignettes** folder you cloned in [part one of this tutorial](tutorial-1st-experiment-r-set-up.md#clone).


## Load the azureml package


> [!Important]
> The rest of this article contains the same content as you see in the  `R-Tutorial.Rmd` file in RStudio.  
>
> Switch to RStudio now if you want to read along as you run the code.


```R
library(azuremlsdk)
```

You'll use these additional R packages:

```R
install.packages("DAAG")
install.packages("caret")
```

## Load your workspace

Now define a workspace object in R by loading your config file.

```R
ws <- load_workspace_from_config()
```

## Load data and prepare for training 

This tutorial uses data from the [DAAG package](https://cran.r-project.org/package=DAAG). This dataset includes data from over 25,000 car crashes in the US, with variables you can use to predict the likelihood of a fatality. First, import the data into R and transform it into a new dataframe `accidents` for analysis, and export it to an `Rdata` file.

```R
library(DAAG)
data(nassCDS)

accidents <- na.omit(nassCDS[,c("dead","dvcat","seatbelt","frontal","sex","ageOFocc","yearVeh","airbag","occRole")])
accidents$frontal <- factor(accidents$frontal, labels=c("notfrontal","frontal"))
accidents$occRole <- factor(accidents$occRole)

saveRDS(accidents, file="accidents.Rd")
```

## Upload data to the datastore

Azure Machine Learning workspaces provide a default datastore where you can store data and other files needed for analysis.
Here, upload the accidents data you created above to the datastore.

```R
ds <- get_default_datastore(ws)
target_path <- "accidentdata"
upload_files_to_datastore(ds,
                          list("./accidents.Rd"),
                          target_path = target_path,
                          overwrite = TRUE)
```

## Create a compute resource

When you need more power than your local laptop to train a model, create a compute resource. 
Here you create a virtual machine in Azure (and give it a name of `rcluster`) to use for training your model.

```R
cluster_name <- "rcluster"
compute_target <- get_compute(ws, cluster_name = cluster_name)
if (is.null(compute_target)) {
  vm_size <- "STANDARD_D2_V2" 
  compute_target <- create_aml_compute(workspace = ws,
                                       cluster_name = cluster_name,
                                       vm_size = vm_size,
                                       max_nodes = 1)
}
```

## Train a model

Now fit a logistic regression model on your uploaded data using your remote compute target.

> NOTE
> You may need to wait a few minutes for your compute cluster to be provisioned before moving on to the next step.

The script to fit the model is called `accidents.R`. It will be run as a command-line script with `Rscript`.   `Rscript` takes one argument, `-d` to specify the storage folder where the data file is located. The argument will be provided for you by Azure Machine Learning.

To run the training script:

* Create an `estimator` object to specify the script file name, parameters for the script file, and other options. The code below uses the compute cluster to run the script. The `cran_packages` option defines the packages to be installed on the compute cluster for R to use.
* Create an `experiment` to start the computation.
* Submit the experiment and wait until it's finished.

```R
est <- estimator(source_directory = ".",
                 entry_script = "accidents.R",
                 script_params = list("--data_folder" = ds$path(target_path)),
                 compute_target = compute_target,
                 cran_packages = c("caret", "optparse", "e1071")
                 )

experiment_name <- "accident-logreg"
exp <- experiment(ws, experiment_name)

run <- submit_experiment(exp, est)
view_run_details(run)
wait_for_run_completion(run, show_output = TRUE)
```

(You -- and colleagues with access to the workspace -- can submit multiple experiments in parallel, and Azure Machine Learning will take of scheduling the tasks on the compute cluster. You can even configure the cluster to automatically scale up to multiple nodes, and scale back when there are no more compute tasks in the queue. This configuration is a cost-effective way for teams to share compute resources.)

In the file `accidents.R`, you stored a metric from your model: the accuracy of the predictions in the training data. (You can store any metrics you like.)

You can see metrics in your workspace in [Azure Machine Learning studio](https://ml.azure.com), or extract them to the local session as an R list as follows:

```R
metrics <- get_run_metrics(run)
metrics
```
> NOTE
> If you've run multiple experiments (say, using differing variables, algorithms, or hyperparamers), you can use the metrics from each run to choose the model you'll use in production.

## Retrieve the model

Now that you've fit the logistic regression model in the remote compute resource, you can retrieve the model object and look at the results in your local R session. 

You see some factors that contribute to an increase in the estimated probability of death:
* higher impact speed 
* male driver
* older occupant
* passenger

You see lower probabilities of death with:
* presence of airbags
* presence seatbelts
* frontal collision 

The vehicle year of manufacture does not have a significant effect.

```R
download_files_from_run(run, prefix="outputs/")
accident_model <- readRDS("outputs/model.rds")
summary(accident_model)
```

You can use this model to make new predictions:

```R
newdata <- data.frame( # valid values shown below
 dvcat="10-24",        # "1-9km/h" "10-24"   "25-39"   "40-54"   "55+"  
 seatbelt="none",      # "none"   "belted"  
 frontal="frontal",    # "notfrontal" "frontal"
 sex="f",              # "f" "m"
 ageOFocc=16,          # age in years, 16-97
 yearVeh=2002,         # year of vehicle, 1955-2003
 airbag="none",        # "none"   "airbag"   
 occRole="pass"        # "driver" "pass"
 )
## predicted probability of death for these variables, as a percentage
as.numeric(predict(accident_model,newdata, type="response")*100)
```

## Deploy a prediction endpoint

With your model, you can predict the danger death from of other types of collisions. Use Azure Machine Learning to deploy your model as a prediction service, and then call the model from a Shiny app.

First, register the model you downloaded for deployment:

```R
model <- register_model(ws, 
                        model_path = "outputs/model.rds", 
                        model_name = "accidents_model",
                        description = "Predict probablity of auto accident")
```

A registered model can be any collection of files, but in this case the R model object is sufficient. Azure Machine Learning will track models each time they are deployed, which is our next step.

To create a web service for your model, you first need to create an **entry script**: an R script that will take as input variable values (in JSON format) and output a prediction from your model. Use the file `accident-predict.R`.

Next, define an **environment** for your deployed model. With an environment, you specify R packages (from CRAN or elsewhere) that are needed for your entry script to run. You also provide the values of environment variables that your script can reference to modify its behavior. If you need software other than R to be available, specify a custom Docker image to use. In this tutorial, there are no special requirements, so create an environment with no special attributes:

```R
r_env <- r_environment(name = "basic_env")
```

Now you have everything you need to create an **inference config**:

```R
inference_config <- inference_config(
  entry_script = "accident-predict.R",
  source_directory = ".",
  environment = r_env)
```

You'll deploy your service to Azure Container Instances. This code provisions a single container to respond to inbound requests, which is suitable for testing and light loads. (For production scale, you can also deploy to Azure Kubernetes Service.)

```R
aci_config <- aci_webservice_deployment_config(cpu_cores = 1, memory_gb = 0.5)
```

Now you deploy your service.

> NOTE
> Deployment can take several minutes.

```R
aci_service <- deploy_model(ws, 
                        'accident-pred', 
                        list(model), 
                        inference_config, 
                        aci_config)
wait_for_deployment(aci_service, show_output = TRUE)
```

## Test the model from R

Now that your model is deployed as a service, you can test the service from R.  Provide a new set of data to predict from, convert it to JSON, and send it to the service.

```R
newdata <- data.frame( # valid values shown below
 dvcat="10-24",        # "1-9km/h" "10-24"   "25-39"   "40-54"   "55+"  
 seatbelt="none",      # "none"   "belted"  
 frontal="frontal",    # "notfrontal" "frontal"
 sex="f",              # "f" "m"
 ageOFocc=22,          # age in years, 16-97
 yearVeh=2002,         # year of vehicle, 1955-2003
 airbag="none",        # "none"   "airbag"   
 occRole="pass"        # "driver" "pass"
 )
prob <- invoke_webservice(aci_service, toJSON(newdata))
prob
```

## Clean up resources

Do not complete this section if you plan on running other Azure Machine Learning tutorials.

### Stop the compute instance

[!INCLUDE [aml-stop-server](../../../includes/aml-stop-server.md)]

### Delete everything

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

Now that you have completed your first Azure Machine Learning experiment in R, learn more about the [Azure Machine Learning SDK for R](https://azure.github.io/azureml-sdk-for-r/reference/index.html).
