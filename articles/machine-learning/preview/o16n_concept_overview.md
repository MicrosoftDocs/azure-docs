---
title: Concepts article Model Management | Microsoft Docs
description: This document explains model managemnet concepts for Azure Machine Learning.
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
# Azure Machine Learning Model Management #

Azure Machine Learning Model Management empowers enterprises and users to manage and deploy machine-learning workflows and models as docker containerized web services. 

The Azure Machine Learning Model Management provides capability for model versioning, tracking models in the production, deploying models in production through [Azure Container Service](https://azure.microsoft.com/en-us/services/container-service/) using [Kubernetes](https://docs.microsoft.com/en-us/azure/container-service/kubernetes/container-service-kubernetes-walkthrough), deploying models as web service on local, on-prem, or IoT edge device as docker container) cluster, automated model retraining, and capturing model telemetry for actionable insights.  

The Azure Machine Learning Model Management deploys models into production by creating a Linux-based docker container that includes model and all encompassing dependencies and adds web service front end required for REST Endpoint with necessary authentication model, load balancing, and encryption for data in motion and at rest.  

The Azure Machine Learning Model Management provides these capabilities through CLI, API, and Azure portal UX. 

The Azure Machine Learning Model Management takes user generated scoring file, model file or directory, conda dependency file, runtime environment choice, and schema to register given model, create a manifest that is required for building a container, build a container image for the docker, and deploy the container to Azure Container Service using Kubernetes as shown in the following figure.

![](media/modelmanagement/ModelManagement.png)

## Create and Manage Models ##
Enterprises can register models with Azure Machine Learning Model Management for tracking models and versions in the production. The model management captures all dependencies and associated information for ease of reproducibility and governance.  Enterprises can also capture model telemetry by using Python SDK for getting deeper insights into the model performance. This telemetry is archived in user provided storage, which could be later used for tracking model performance, retraining, and explainability to the business users.

## Create and Manage Manifests ##
The models require additional artifacts to deploy into the production. The system provides the capability to create a manifest using model, dependencies, inference script (aka scoring script), sample data, schema etc. This manifest acts as a recipe to create a docker container image. Enterprises can auto-generate manifest, version manifest, and manage manifests. 

## Create and Manage Images ##
The users can use the manifest from the previous step to generate and regenerate docker container images in their respective environments. The containerized docker images provide enterprises with the flexibility to run these images on scalable [Kubrenetes based Azure Container Service](https://docs.microsoft.com/en-us/azure/container-service/kubernetes/container-service-kubernetes-walkthrough), or pull these images into their environment to run on-prem, on the local machine, or on IoT device. These images are self-contained with all necessary dependencies required for generating predictions based on the user inputs. 

## Deploy Images ##
With Azure Machine Learning Model Management, users can deploy docker container images from the previous step with a single command to Azure Container Service. These deployments are created with front-end server that provides load balancing, encryption, API key authorization, and swagger. Users can control the deployment in terms of scale and telemetry. Users can enable/disable system logging and model telemetry at each web service level and if enabled, all stdout logs are streamed to [Azure Application Insights](https://azure.microsoft.com/en-us/services/application-insights/) and model telemetry is archived in users provided storage. Users can control auto-scale and concurrency limits that will automatically increase the number of deployed containers based on the load within the existing cluster size. 

## Consumption ##
Azure Machine Learning Model Management creates a REST API for the deployed models along with the swagger document. Users can easily consume deployed models by calling REST APIs with API key and model inputs to get the predictions as part of the line-of-business applications. The Sample code in languages Java, [Python](https://github.com/CortanaAnalyticsGallery-Int/digit-recognition-cnn-tf/blob/master/client.py), and C# for calling REST APIs are provided in the GitHub. The Azure Machine Learning Model Management CLI provides an easy way to consume these REST APIs through a single command, swagger enabled applications, and a command-line sample for calling these APIs using curl. 

## Retraining ##
Azure Machine Learning Model Management also provides APIs for the users to retrain their model and update existing deployment with a new model. As part of the data science workflow, the user recreates a new model in their experimentation environment, register this new model with model management, and update existing deployment environment with this new model using UPDATE primitive with a single CLI command. The update method updates existing deployment without changing API URL and the key. This way the business applications consuming the model continues to work without any code change and starts getting better predictions with the new model.

The complete workflow describing the above steps is captured in the figure below:

![](media/modelmanagement/ModelManagementWorkflow.png)

## FAQ ##
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

- Whether the same machine or cluster can be used for multiple web service endpoints?

Absolutely. You can run 100x of services/endpoints on the same cluster. 


