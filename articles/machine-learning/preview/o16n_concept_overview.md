---
title: Concepts article Azure Machine Learning Model Management | Microsoft Docs
description: This document explains model management concepts for Azure Machine Learning.
services: machine-learning
author: nk773
ms.author: neerajkh
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 08/28/2017
---
# Azure Machine Learning Model Management 

Azure Machine Learning Model Management enables enterprises and users to manage and deploy machine-learning workflows and models as Docker containerized web services. 

The Azure Machine Learning Model Management provides capability for model versioning, tracking models in the production, and deploying models in production. It provides these capabilities through [Azure Container Service](https://azure.microsoft.com/services/container-service/) using [Kubernetes](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-kubernetes-walkthrough). It allows deploying models as web service across various targets including local, on-prem, IoT edge device as Docker container) or cluster. The Azure Machine Learning Model Management also provides automated model retraining, and capturing model telemetry for actionable insights.  

The Azure Machine Learning Model Management deploys models into production by creating a Linux-based Docker container that includes model and all encompassing dependencies. It adds web service front end required for REST Endpoint with necessary authentication, load balancing, and encryption.  

The Azure Machine Learning Model Management provides these capabilities through CLI, API, and Azure portal. 

The Azure Machine Learning Model Management takes user generated scoring file, model path, conda dependency file, runtime environment choice, and schema for managing models in production. It registers given model, creates a manifest that is required for building a container, builds a container image for the Docker, and deploys the container to Azure Container Service using Kubernetes as shown in the following figure:

![](media/modelmanagement/ModelManagement.png)

## Create and manage models 
Enterprises can register models with Azure Machine Learning Model Management for tracking models and versions in the production. The model management captures all dependencies and associated information for ease of reproducibility and governance.  Enterprises can also capture model telemetry by using Python SDK for getting deeper insights into the model performance. This telemetry is archived in user provided storage, which could be later used for tracking model performance, retraining, and gaining model insights for the business users.

## Create and manage manifests 
The models require additional artifacts to deploy into the production. The system provides the capability to create a manifest using model, dependencies, inference script (aka scoring script), sample data, schema etc. This manifest acts as a recipe to create a Docker container image. Enterprises can auto-generate manifest, version manifest, and manage manifests. 

## Create and manage images 
The users can use the manifest from the previous step to generate and regenerate Docker-based container images in their respective environments. The containerized Docker-based images provide enterprises with the flexibility to run these images on scalable [Kubernetes based Azure Container Service](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-kubernetes-walkthrough), or pull these images into their environment to run on-prem, on the local machine, or on IoT device. These Docker-based containerized images are self-contained with all necessary dependencies required for generating predictions. 

## Deploy images 
The users can deploy Docker-based container images from the previous step with a single command to Azure Container Service. These deployments are created with front-end server that provides load balancing, encryption, API key authorization, and swagger. Users can control the deployment in terms of scale and telemetry. Users can enable/disable system logging and model telemetry at each web service level and if enabled, all stdout logs are streamed to [Azure Application Insights](https://azure.microsoft.com/services/application-insights/) and model telemetry is archived in users provided storage. Users can control auto-scale and concurrency limits that automatically increases the number of deployed containers based on the load within the existing cluster size. 

## Consumption 
Azure Machine Learning Model Management creates a REST API for the deployed models along with the swagger document. Users can easily consume deployed models by calling REST APIs with API key and model inputs to get the predictions as part of the line-of-business applications. The Sample code in languages Java, [Python](https://github.com/CortanaAnalyticsGallery-Int/digit-recognition-cnn-tf/blob/master/client.py), and C# for calling REST APIs are provided in the GitHub. The Azure Machine Learning Model Management CLI provides an easy way to consume these REST APIs using a single CLI command, swagger-enabled applications, or command-line curl sample for calling these APIs. 

## Retraining 
Azure Machine Learning Model Management also provides APIs for the users to retrain their model and update existing deployment with a new model. As part of the data science workflow, the user recreates a new model in their experimentation environment, register this new model with model management, and update existing deployment environment with this new model using UPDATE primitive with a single CLI command. The update method updates existing deployment without changing API URL and the key. This way the business applications consuming the model continues to work without any code change and starts getting better predictions with the new model.

The complete workflow describing these concepts is captured in the following figure:

![](media/modelmanagement/ModelManagementWorkflow.png)

## Frequently asked questions (FAQ) 
- What data types can I pass NumPy arrays directly as input to web service

If you are providing schema file that was created using generate_schema SDK, then you can pass NumPy and/or Pandas DF. You can pass any JSON serializable inputs. You can pass image as binary encoded string as well.

- Does the web service support multiple inputs or parse different inputs? 

Yes, you can take multiple inputs packaged in the same JSON request.

- Is the call activated by a  request to the web service a blocking call or an asynchronous call?

If service was created using realtime option as part of the CLI or AP, then it is blocking/sync. It is expected to be realtime fast. Although on the client you can call it using async HTTP library.

- How many requests can the web service simultaneously handle?

It depends on the cluster and web service scale. You can scale out your service to 100x of PODs and it handles as many requests concurrently. 

- How many requests can the web service queue up?

It is configurable. By default, it is set to ~50 per single POD, but you can increase/decrease it to your application requirements. Typically increasing it, increases the service throughput but makes the latencies worse at higher percentiles. To keep the latencies consistent, you may want to set the queuing to a low value (1-10), and increase the number of PODs to handle the throughput. You can also turn on autoscaling. 

- Can the same machine or cluster be used for multiple web service endpoints?

Absolutely. You can run 100x of services/endpoints on the same cluster. 


