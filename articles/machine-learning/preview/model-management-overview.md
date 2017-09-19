---
title: Conceptual overview of Azure Machine Learning model management | Microsoft Docs
description: This document explains Model Management concepts for Azure Machine Learning.
services: machine-learning
author: nk773
ms.author: neerajkh, padou
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 08/28/2017
---
# Azure Machine Learning model management 

Azure Machine Learning model management enables enterprises and users to manage and deploy machine-learning workflows and models. 


Model management provides capabilities for:
- Model versioning
- Tracking models in production
- Deploying models to production through AzureML Compute Environment with [Azure Container Service](https://azure.microsoft.com/services/container-service/) and [Kubernetes](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-kubernetes-walkthrough)
- Creating Docker containers with the models and testing them locally
- Automated model retraining
- Capturing model telemetry for actionable insights. 
 

Azure Machine Learning Model Management provides a registry of model versions and automated workflows for packaging and deployng the ML containers as REST APIs. The models and their runtime dependencies are packaged in Linux-based Docker container with prediction API. 

Azure Machine Learning Compute Environments help to setup and manage scalable clusters for hosting the models. The compute environment is based on Azure Container Services and provide automatic exposure of ML APIs as REST API endpoint with necessary authentication, load balancing, automatic scale out, and encryption.

The Azure Machine Learning model management provides these capabilities through the CLI, API, and the Azure portal. 

The Azure Machine Learning model management uses the following information for registering a given model, creating a manifest that is required for building a container, building a Docker container image, and deploying the container to Azure Container Service.

 - Model file or a directory with the model files
 - User created Python file implplementing a model scoring function
 - Conda dependency file listing runtime dependencies
 - Runtime environment choice, and 
 - Schema file for API parameters 
 
 The following figure shows an overview of how models are registered and deployed into the cluster. 

![](media/model-management-overview/modelmanagement.png)

## Create and manage models 
Users can register models with Azure Machine Learning Model Management for tracking model versions in production. For ease of reproducibility and governance, the service captures all dependencies and associated information. For deeper insights into performance, users can capture model telemetry using the  provided SDK. Model telemetry is archived in a user-provided storage, and can be used later for analyzing model performance, retraining, and gaining insights for the business users.

## Create and manage manifests 
Models require additional artifacts to deploy into  production. The system provides the capability to create a manifest that encompasses model, dependencies, inference script (aka scoring script), sample data, schema etc. This manifest acts as a recipe to create a Docker container image. Enterprises can auto-generate manifest, create different versions, and manage their manifests. 

## Create and manage Docker container images 
The users can use the manifest from the previous step to build Docker-based container images in their respective environments. The containerized Docker-based images provide enterprises with the flexibility to run these images on scalable ML Compute Environments running on [Kubernetes based Azure Container Service](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-kubernetes-walkthrough), or pull these images into their environment to run on-prem, on the local machine, or on IoT device. These Docker-based containerized images are self-contained with all necessary dependencies required for generating predictions. 

## Deploy Docker container images 
With the Azure Machine Learning model management, users can deploy Docker-based container images with a single command to Azure Container Service managed by ML Compute Environment. These deployments are created with a front-end server that provides low latency predictions at scale, load balancing, automatic scaling of ML endpoints, API key authorization, and API swagger document. Users can control the deployment scale and telemetry: 
- Users can enable/disable system logging and model telemetry for each web service level. If enabled, all stdout logs are streamed to [Azure Application Insights](https://azure.microsoft.com/services/application-insights/) and model telemetry is archived in users provided storage. 
- Users can control auto-scale and concurrency limits that automatically increases the number of deployed containers based on the load within the existing cluster size, and control the throughput and consistency of prediction latency

## Consumption 
Azure Machine Learning model management creates REST API for the deployed model along with the swagger document. Users can consume deployed models by calling the REST APIs with API key and model inputs to get the predictions as part of the line-of-business applications. The sample code is available in GitHub for languages Java, [Python](https://github.com/CortanaAnalyticsGallery-Int/digit-recognition-cnn-tf/blob/master/client.py), and C# for calling REST APIs. The Azure Machine Learning model management CLI provides an easy way to consume these REST APIs using a single CLI command, within a swagger-enabled applications, or a using curl. 

## Retraining 
Azure Machine Learning model management provides APIs for the users to retrain their models, and to update existing deployment with new versions of the model. As part of the data science workflow, the user recreates a new model in their experimentation environment, registers this new model with model management, and updates  existing deployment  with this new model using a single UPDATE CLI command. The UPDATE method updates existing deployment without changing API URL and the key. The business applications consuming the model continues to work without any code change and starts getting better predictions using new model.

The complete workflow describing these concepts is captured in the following figure:

![](media/model-management-overview/modelmanagementworkflow.png)

## Frequently asked questions (FAQ) 
- What data types are supported? Can I pass NumPy arrays directly as input to web service?

If you are providing schema file that was created using generate_schema SDK, then you can pass NumPy and/or Pandas DF. You can also pass any JSON serializable inputs. You can pass image as binary encoded string as well.

- Does the web service support multiple inputs or parse different inputs? 

Yes, you can take multiple inputs packaged in the one JSON request as a dictionary. Each input would correspond to a single unique dictionary key.

- Is the call activated by a request to the web service a blocking call or an asynchronous call?

If service was created using realtime option as part of the CLI or API, then it is a blocking/synchronous call. It is expected to be realtime fast. Although on the client side you can call it using async HTTP library to avoid blocking the client thread.

- How many requests can the web service simultaneously handle?

It depends on the cluster and web service scale. You can scale out your service to 100x of replicas and then it can handle many requests concurrently. You can also configure the maximum concurrent request per replica to increase service throughput.

- How many requests can the web service queue up?

It is configurable. By default, it is set to ~10 per single replica, but you can increase/decrease it to your application requirements. Typically, increasing it the number of queued requests increases the service throughput but makes the latencies worse at higher percentiles. To keep the latencies consistent, you may want to set the queuing to a low value (1-5), and increase the number of replicas to handle the throughput. You can also turn on autoscaling to make the number of replicas adjusting automatically based on load. 

- Can the same machine or cluster be used for multiple web service endpoints?

Absolutely. You can run 100x of services/endpoints on the same cluster. 

## Next steps
For getting started with model management, see [this document](model-management-configuration.md).
