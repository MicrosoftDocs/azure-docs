---
title: Deploy Azure Cognitive Services to Azure Stack | Microsoft Docs
description: Learn how to deploy Azure Cognitive Services to Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/04/2018
ms.author: mabrigg
ms.reviewer: guanghu

---

# Deploy Azure Cognitive Services to Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

> [!Note]  
> Aure Cognitive Services on Azure Stack is in preview.

You can use container support in Azure Cognitive Services on Azure Stack. Container support in Azure Cognitive Services allows developers to use the same rich APIs that are available in Azure, and enables flexibility in where to deploy and host the services that come with [Docker containers](https://www.docker.com/what-container). Container support is currently available in preview for a subset of Azure Cognitive Services, including parts of [Computer Vision](https://docs.microsoft.com/azure/cognitive-services/computer-vision/home), [Face](https://docs.microsoft.com/azure/cognitive-services/face/overview), and [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/overview), and [Language Understanding](https://docs.microsoft.com/azure/cognitive-services/luis/luis-container-howto) (LUIS).

Containerization is an approach to software distribution in which an application or service, including its dependencies & configuration, is packaged together as a container image. With little or no modification, a container image can be deployed on a container host. Containers are isolated from each other and the underlying operating system, with a smaller footprint than a virtual machine. Containers can be instantiated from container images for short-term tasks, and removed when no longer needed. 

## Features

- **Control over data**  
  Allow customers to use Cognitive Services with complete control over their data. This is essential for customers that cannot send data to the cloud but need access to Cognitive Services technology. Support consistency in hybrid environments – across data, management, identity, and security.

- **Control over model updates**  
  Provide customers flexibility in versioning and updating of models deployed in their solutions.

- **Portable architecture**  
  Enable the creation of a portable application architecture that can be deployed in the cloud, on-premises and the edge. Containers can also be deployed directly to Azure Kubernetes Service, Azure Container Instances, or to a Kubernetes cluster deployed to Azure Stack. For more information, see Deploy Kubernetes to Azure Stack.

- **High throughput and low latency** 
   Provide customers the ability to scale for high throughput and low latency requirements by enabling Cognitive Services to run in Azure Kubernetes Service physically close to their application logic and data.

With Azure Stack, you can deploy Cognitive Services containers in a Kubernetes cluster along with your application containers for high availability and elastic scaling. You can develop your application by combining Cognitive services with components built on App Services, Functions, Blob storage or SQL or mySQL databases. 

This article describes how to deploy the Azure Face API on Kubernetes cluster on Azure Stack. You can use follow the same approach to deploy other cognitive services containers on Azure Stack Kubernetes cluster.

For more details on Cognitive Services containers, please go to [Container support in Azure Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-container-support).

## Prerequisites

Before you get started, you will need to:

1.  Request access to the container registry to pull Face container images from Azure Cognitive Services Container Registry. For details go to section of [Request access to the private container registry](https://docs.microsoft.com/azure/cognitive-services/face/face-how-to-install-containers#request-access-to-the-private-container-registry).

2.  Prepare a Kubernetes cluster on Azure Stack. You can follow the article [Deploy Kubernetes to Azure Stack](azure-stack-solution-template-kubernetes-deploy.md).

## Create Azure resources

Create a Cognitive Service resource on Azure to preview the [Face](vscode-resource://c:/Users/guanghu/Desktop/Cognitive%20Service/readme.md#working-with-face), [LUIS](vscode-resource://c:/Users/guanghu/Desktop/Cognitive%20Service/readme.md#working-with-luis), or [Recognize Text](vscode-resource://c:/Users/guanghu/Desktop/Cognitive%20Service/readme.md#working-with-recognize-text) containers, respectively. You will need to use the subscription key and endpoint URL from the resource to instantiate the cognitive service containers.

1.  Create an Azure resource in the Azure portal. If you want to preview the Face containers, you must first create a corresponding Face resource in the Azure portal. For more information, see [Quickstart: Create a Cognitive Services account in the Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account).

    >  [!Note]  
    >  The Face or Computer Vision resource must use the F0   pricing tier.

1.  Get the endpoint URL and subscription key for the Azure resource. Once the Azure resource is created, you must use the subscription key and endpoint URL from that resource to instantiate the corresponding Face, LUIS, or Recognize Text container for the preview.

## Create a Kubernetes secret 

Take use of the Kubectl create secret command to access the private container registry. Replace **&lt;username&gt;** with the user name and **&lt;password&gt;** with the password provided in the credential you received from the Azure Cognitive Service team.

```bash  
    kubectl create secret docker-registry <secretName> \
        --docker-server='containerpreview.azurecr.io' \
        --docker-username='<username>' \
        --docker-password='<password>' 
```

## Prepare a YAML

You are going to leverage the YAML to simplify the deployment of the cognitive service on the Kubernetes cluster.

Here is a sample YAML configure file to deploy the Face service to Azure Stack:

```Yaml  
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: <deploymentName>
spec:
  replicas: <replicaNumber>
  template:
    metadata:
      labels:
        app: <appName>
    spec:
      containers:
      - name: <containersName>
        image: <ImageLocation>
        env: 
        - name: EULA
          value: accept 
        - name: Billing
          value: <billingURL> 
        - name: apikey
          value: <apiKey>
        tty: true
        stdin: true
        ports:
        - containerPort: 5000 
      imagePullSecrets:
        - name: <secretName>
---
apiVersion: v1
kind: Service
metadata:
  name: <LBName>
spec:
  type: LoadBalancer
  ports:
  - port: 5000
    targetPort : 5000
    name: <PortsName>
  selector:
    app: <appName>
```

In this YAML file, use the secret you used to get the cognitive service container images from Azure Container Registry. You and use the secret file to deploy a specific replica of the container. You also create a load balancer to make sure users can access this service externally.

Details about the key fields:

| Field | Notes |
| --- | --- |
| replicaNumber | Defines the initial replicas of instances to create. You can surely scale it later after the deployment. |
| ImageLocation | Indicates the location of the specific cognitive service container image in ACR. For example, the face service: `aicpppe.azurecr.io/microsoft/cognitive-services-face` |
| BillingURL |The Endpoint URL noted in step of [Create Azure Resource](#create-azure-resources) |
| ApiKey | The subscription key noted in step of [Create Azure Resource](#create-azure-resources) |
| SecretName | The secret name you just noted in step of [Create secrete to access the private container registry](#create-secrete-to-access-the-private-container-registry) |

## Deploy the cognitive service

Use of the following command to deploy the cognitive service containers

```bash  
    Kubectl apply -f <yamlFineName>
```
Use of the following command to monitor how it deploys: 
```bash  
    Kubectl get pod – watch
```

## Test the cognitive service

Access the [OpenAPI specification](https://swagger.io/docs/specification/about/) (formerly the Swagger specification), describing the operations supported by an instantiated container, from the **/swagger** relative URI for that container. For example, the following URI provides access to the OpenAPI specification for the Sentiment Analysis container that was instantiated in the previous example:

```HTTP  
http:<External IP>:5000/swagger
```

You can get the external IP address from the following command: 

```bash  
    Kubectl get svc <LoadBalancerName>
```

## Try the services with Python scripts

You can try to validate the Cognitive services on your Azure Stack by running some simple Python scripts. There are official Python quickstart samples for [Computer Vision](https://docs.microsoft.com/azure/cognitive-services/computer-vision/home), [Face](https://docs.microsoft.com/azure/cognitive-services/face/overview), and [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/overview), and [Language Understanding](https://docs.microsoft.com/azure/cognitive-services/luis/luis-container-howto) (LUIS) for your reference.

There are two things need to keep in mind to make the Python app run against the services running on containers: 
1. Cognitive services in container do not need sub keys for authentication, but we still need to input any string as a placeholder to satisfy the SDK. 
2. Replace the base_URL with the actual service EndPoint IP address 

Here is a sample Python scripts used Face services Python SDK to detect and frame faces in an image. 

```Python  
import cognitive_face as CF

# Cognitive Services in container do not need sub keys for authentication
# Keep the invalid key to satisfy the SDK inputs requirement. 
KEY = '0'  #  (keeping the quotes in place).
CF.Key.set(KEY)

# Get your actual Ip Address of service endpoint of your cognitive service on Azure Stack
BASE_URL = 'http://<svc IP Address>:5000/face/v1.0/'  
CF.BaseUrl.set(BASE_URL)

# You can use this example JPG or replace the URL below with your own URL to a JPEG image.
img_url = 'https://raw.githubusercontent.com/Microsoft/Cognitive-Face-Windows/master/Data/detection1.jpg'
faces = CF.face.detect(img_url)
print(faces)

```

## Next steps

[How to install and run Computer Vision API containers.](https://docs.microsoft.com/azure/cognitive-services/computer-vision/computer-vision-how-to-install-containers)

[How to install and run Face API containers](https://docs.microsoft.com/azure/cognitive-services/face/face-how-to-install-containers#create-a-face-resource-on-azure)

[How to install and run Text Analytics API containers](https://docs.microsoft.com/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-install-containers) 

[How to install and run Language Understanding (LIUS) containers](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-container-howto)