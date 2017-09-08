---
title: Iris Tutorial for Machine Learning Server | Microsoft Docs
description: This full-length tutorial shows how to use Azure Machine Learning end-to-end. This is part 3 on deploying model.
services: machine-learning
author: raymondlaghaeian
ms.author: raymondl
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: hero-article
ms.date: 09/06/2017
---

# Classifying Iris Part 3: Deploy Model
In this tutorial, we show you the basics of Azure ML preview features by creating a data preparation package, building a model and operationalizing it as a real-time web service. To make things simple, we use the timeless [Iris flower dataset](https://en.wikipedia.org/wiki/Iris_flower_data_set). The instructions and screenshots are created for Windows, but they are similar, if not identical, for macOS.

This is part 3 of a 3-part tutorial, convering model deployment.

## Step 1. Obtain the Pickled Model
In the `iris_sklearn.py` script, we serialize the logistic regression model using the popular object serialization package -- pickle, into a file named `model.pkl` on disk. Here is the code snippet.

```python
print("Export the model to model.pkl")
f = open('./outputs/model.pkl', 'wb')
pickle.dump(clf1, f)
f.close()
```

When you executed the `iris_sklearn.py` script, the model was written to the `outputs` folder with the name `model.pkl`. This folder lives in the execution environment you choose to run the script, not your local project folder. You can find it in the run history detail page and download this binary file by clicking on the download button next to the file name. Read more about the `outputs` folder in the [Persisting Changes](PersistingChanges.md) article.

![Download Pickle](media/tutorial-classifying-iris/download_model.png)

Now, download the model file `model.pkl` and save it to the root of your  project folder. You need it in the later steps.

## Step 2. Prepare for Operationalization Locally
Local mode deployments run in Docker containers on your local computer, whether that is your desktop or a Linux VM running on Azure. You can use local mode for development and testing. The Docker engine must be running locally to complete the operationalization steps as shown in the following steps.

Let's prepare the operationalization environment. In the CLI window type the following to set up the environment for local operationalization:

```batch
C:\Temp\myIris> az ml env setup -n <your new environment name> -l <Azure region, for example, eastus2>
```
>If you need to scale out your deployment (or if you don't have Docker engine installed locally, you can choose to deploy the web service on a cluster. In cluster mode, your service is run in the Azure Container Service (ACS). The operationalization environment provisions Docker and Kubernetes in the cluster to manage the web service deployment. Deploying to ACS allows you to scale your service as needed to meet your business needs. To deploy web service into a cluster, add the _--cluster_ flag to the setup command. For more information, enter the _--help_ flag.

Follow the on-screen instructions to provision an Azure Container Registry (ACR) instance and a storage account in which to store the Docker image we are about to create. After the setup is complete, set the environment variables required for operationalization using the following command: 

```batch
C:\Temp\myIris> az ml env set -n <your environment name> -g <resource group>
```

To verify that you have properly configured your operationalization environment for local web service deployment, enter the following command:

```batch
C:\Temp\myIris> az ml env local
```

## Step 3. Create a Real-time Web Service
Now you are ready to operationalize the pickled Iris model. 

To deploy the web service, you must have a model, a scoring script, and optionally a schema for the web service input data. The scoring script loads the _model.pkl_ file from the current folder and uses it to produce a new predicted Iris class. The input to the model is an array of four numbers representing the sepal length and width, and pedal length and width. 

In this example, you use a schema file to help parse the input data. To generate the scoring and schema files, simply execute the `iris_schema_gen.py` file that comes with the sample project in the command prompt using Python interpreter directly.  

```batch
C:\Temp\myIris> python iris_schema_gen.py
```

Running this file creates a `service_schema.json` file. This file contains the schema of the web service input.

Now you are ready to create the real-time web service:
```batch
c:\temp\myIris> az ml service create realtime -f score.py --model-file model.pkl -s service_schema.json -n irisapp -r python
```
To quickly explain the switches of the `az ml service create realtime` command:
* -n: app name, must be lower case.
* -f: scoring script file name
* --model-file: model file, in this case it is the pickled sklearn model
* -r: type of model, in this case it is the python model

>Important: The service name (it is also the new Docker image name) must be all lower-case, otherwise you see an error.

When you run the command, the model and the scoring file are uploaded into an Azure service that we manage. As part of deployment process, the operationalization component uses the pickled model `model.pkl` and the scoring script `score.py` to build a Docker image named `<ACR_name>.azureacr.io/irisapp`. It then registers the image with your Azure Container Registry (ACR) service, pulls down that image locally to your computer, and starts a Docker container based on that image. (If your environment is configured in cluster mode, the Docker container will instead be deployed into the Kubernetes cluster.)

As part of the deployment, an HTTP REST endpoint for the web service is created on your local machine. After a few minutes the command should finish with a success message and your web service is ready for action!

You can see the running Docker container using the `docker ps` command:
```batch
c:\Temp\myIris> docker ps
```
You can test the running `irisapp` web service by feeding it with a JSON encoded record containing an array of four random numbers.

The web service creation included sample data. When running in local mode, you can call the `az ml service view` command to retrieve a sample run command that you can use to test the service.

```batch
C:\Temp\myIris> az ml service show realtime -i <web service id>
```

To test the service, execute the returned service run command.

```batch
C:\Temp\myIris> az ml service run realtime -n irisapp -d "{\"input_df\": [{\"petal length\": 1.3, \"sepal width\": 3.6, \"petal width\": 0.25, \"sepal length\": 3.0}]}"
```
The output is `"2"`, which is the predicted class. (Your result might be different.)  

## Congratulations!
Great job! You have successfully run a training script in various compute environments, created a model, serialized the model, and operationalized the model through a Docker-based web service. 

## Next Steps
- [Part 1: Project setup and data preparation](tutorial-classifying-iris-part-1.md)
- [Part 2: Model building](tutorial-classifying-iris-part-2.md)
- Part 3: Model deployment