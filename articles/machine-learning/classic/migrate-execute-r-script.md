---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - Execute R Script'
description: Update Studio (classic) Execute R script modules to run on Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: xiaoharper
ms.author: zhanxia
ms.date: 02/04/2021
---


# Migrate Execute R Script modules in Studio (classic)

In this article, you learn how to migrate **Execute R Script** modules in Studio (classic) to Azure Machine Learning.

For more information on migrating from Studio (classic), see the [migration overview article](migrate-overview.md).

## Execute R Script

Azure Machine Learning designer now runs on Linux, not Windows like Studio (classic). Due to the platform change, you must adjust your R script during migration.

To migrate an **Execute R Script** module from Studio (classic), you must replace `maml.mapInputPort` and `maml.mapOutputPort` with standard functions.

The following table summarizes the changes to the R Script module:

|Feature|Studio (classic)|Azure Machine Learning designer|
|---|---|---|
|Script Interface|`maml.mapInputPort` and `maml.mapOutputPort`|Function interface|
|Platform|Windows|Linux|
|Internet Accessible |No|Yes|
|Memory|14 GB|Dependent on Compute SKU|

### How to update the R script interface

The following sample shows you how to update the R script interface.

Here are the contents of a sample **Execute R Script** module in Studio (classic):
```r
# Map 1-based optional input ports to variables 
dataset1 <- maml.mapInputPort(1) # class: data.frame 
dataset2 <- maml.mapInputPort(2) # class: data.frame 

# Contents of optional Zip port are in ./src/ 
# source("src/yourfile.R"); 
# load("src/yourData.rdata"); 

# Sample operation 
data.set = rbind(dataset1, dataset2); 

 
# You'll see this output in the R Device port. 
# It'll have your stdout, stderr and PNG graphics device(s). 

plot(data.set); 

# Select data.frame to be sent to the output Dataset port 
maml.mapOutputPort("data.set"); 
```

Here are the updated contents in the designer. Notice that the `maml.mapInputPort`` and maml.mapOutputPort` have been replaced with the standard function interface `azureml_main`. 
```r
azureml_main <- function(dataframe1, dataframe2){ 
    # Use the parameters dataframe1 and dataframe2 directly 
    dataset1 <- dataframe1 
    dataset2 <- dataframe2 

    # Contents of optional Zip port are in ./src/ 
    # source("src/yourfile.R"); 
    # load("src/yourData.rdata"); 

    # Sample operation 
    data.set = rbind(dataset1, dataset2); 


    # You'll see this output in the R Device port. 
    # It'll have your stdout, stderr and PNG graphics device(s). 
    plot(data.set); 

  # Return datasets as a Named List 

  return(list(dataset1=data.set)) 
} 
```
For more information, see the [Execute R Script designer module reference](../algorithm-module-reference/execute-r-script.md).

### Install R packages from the internet

Unlike Studio (classic), Azure Machine Learning designer lets you install packages directly from CRAN.

Studio (classic) runs in a sandbox environment with no internet access. In Studio (classic), you have to upload scripts in a zip bundle to install more packages. 

Use the following code to install CRAN packages in the designer's **Execute R Script** module:
```r
  if(!require(zoo)) { 
      install.packages("zoo",repos = "http://cran.us.r-project.org") 
  } 
  library(zoo) 
```

## Next steps

In this article, you learned how to migrate Execute R Script modules to Azure Machine Learning.


See the other articles in the Studio (classic) migration series:

1. [Migration overview](migrate-overview.md).
1. [Migrate dataset](migrate-register-dataset.md).
1. [Rebuild a Studio (classic) training pipeline](migrate-rebuild-experiment.md).
1. [Rebuild a Studio (classic) web service](migrate-rebuild-web-service.md).
1. [Integrate an Azure Machine Learning web service with client apps](migrate-rebuild-integrate-with-client-app.md).
1. **Migrate Execute R Script modules**.