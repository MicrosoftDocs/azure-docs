---
title: Quickstart article for Iris model deployment for Machine Learning | Microsoft Docs
description: This document describes the steps needed to deploy the trained Iris model as a web service using Azure Machine Learning Model Management CLIs.
services: machine-learning
author: raymondlaghaeian
ms.author: raymondl
manager: neerajkh
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: hero-article
ms.date: 09/05/2017
---

# Deploying the Iris trained model as a web service
In this quick-start, you deploy the Iris model you trained in the previous [document](quick-start-iris.md).

>Note you must have Docker engine installed locally and running in order to follow these steps.

## View Run History and download the trained model
1. Open the `myIris` project you completed in the previous document.
2. Navigate to the Run History view, and click on `iris_sklearn.py`. 
3. Click on a completed run executed on `iris_sklearn.py`.
4. Scroll down to the _output files_ section. Expand the `outputs` folder, and select the `model.pkl` file.
5. Click download and select the `myIris` project folder to download the model to your local machine.

## Create the `schema.json` file
1. Choose `iris_schema_gen.py` to run against `local` environment, then click _Run_ to create the `service_schema.json` file.
2. Similar to getting the trained model, go to the run history of the `iris_shcema_gen.py` file, and download the `service_schema.json` file to the same folder.

## Create the `score.py` file
1. In the _File View_, click `+` and select _New Item_. 
2. Name the file `score.py`.
3. Go back to `iris_shcema_gen.py` file and copy the `init()` and `run()` functions. 
4. Open `score.py` and paste the functions. Then click save.

## Deploy the web service
1. In the top menu of the Workbench, click _File_ --> _Open Command-line Interface_.
2. In the command shell, type the following command:

```batch
C:\Temp\myIris> az ml service create realtime --model-file model.pkl -f score.py -n irisservice -s service_schema.json -r python
```
 
## Test the web service
```batch
C:\Temp\myIris> az ml service run realtime -n irisservice -d "{\"input_df\": [{3.4,4.2,5.1,3.1]}"
```
