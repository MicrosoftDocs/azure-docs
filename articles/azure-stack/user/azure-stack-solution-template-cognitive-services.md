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

>  Note  
>  zure Cognitive Services on Azure Stack is in preview.

You can use Azure Cognitive Services on Azure Stack. Available services include [Computer Vision](https://docs.microsoft.com/azure/cognitive-services/computer-vision/), [Face](https://docs.microsoft.com/azure/cognitive-services/face/), and [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/) services. You can now deploy Azure Cognitive Services on-premises and on the edge with container support. Cognitive Services containers allow you to use the same intelligent APIs that are available in Azure, but with the flexibility that comes with [Docker containers](https://www.docker.com/what-container). For more details, please go to [Container support in Azure Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-container-support).

With Azure Stack, you can enable Cognitive Services with the ability to scale for high throughput and low latency on containers running in Kubernetes. The service can have close physical proximity of both application logic and data. This article describes how to deploy the Azure Face API. You can use follow the same approach to deploy other cognitive services containers on Azure Stack Kubernetes cluster.

## Prerequisites

Before you get started, you will need to:

1.  Request access to the container registry to pull Face container images from Azure Cognitive Services Container Registry. For details go to section of [Request access to the private container registry](https://docs.microsoft.com/azure/cognitive-services/face/face-how-to-install-containers#request-access-to-the-private-container-registry).

2.  Prepare a Kubernetes cluster on Azure Stack. You can follow the article [Deploy Kubernetes to Azure Stack](azure-stack-solution-template-kubernetes-deploy.md).

## Create Azure resources

Create a Cognitive Service resource on Azure to preview the [Face](vscode-resource://c:/Users/guanghu/Desktop/Cognitive%20Service/readme.md#working-with-face), [LUIS](vscode-resource://c:/Users/guanghu/Desktop/Cognitive%20Service/readme.md#working-with-luis), or [Recognize Text](vscode-resource://c:/Users/guanghu/Desktop/Cognitive%20Service/readme.md#working-with-recognize-text) containers, respectively. YOu will need to use the subscription key and endpoint URL from the resource to instantiate the cognitive service containers.

1.  Create an Azure resource in the Azure portal. If you want to preview the [Face](vscode-resource://c:/Users/guanghu/Desktop/Cognitive%20Service/readme.md#working-with-face) containers, you must first create a corresponding Face resource in the Azure portal. For more information, see Quickstart: Create a Cognitive Services account in the Azure portal.

    >  [!Note]  
    >  The Face or Computer Vision resource must use the F0   pricing tier.

1.  Get the endpoint URL and subscription key for the Azure resource.\ Once the Azure resource is created, you must use the subscription key and endpoint URL from that resource to instantiate the corresponding [Face](vscode-resource://c:/Users/guanghu/Desktop/Cognitive%20Service/readme.md#working-with-face), [LUIS](vscode-resource://c:/Users/guanghu/Desktop/Cognitive%20Service/readme.md#working-with-luis), or [Recognize Text](vscode-resource://c:/Users/guanghu/Desktop/Cognitive%20Service/readme.md#working-with-recognize-text) container for the preview.

## Create secrete

Take use of the Kubectl create secret command to access the private container registry. Replace **&lt;username&gt;** with the user name and **&lt;password&gt;** with the password provided in the credential you received from the Azure Cognitive Service team.

```bash  
    kubectl create secret docker-registry <secretName> \
        --docker-server='containerpreview.azurecr.io' \
        --docker-username='<username>' \
        --docker-password='<password>' 
```

## Prepare a YAML

You are going to leverage the YAML to simplify the overall deployment of the cognitive service on the Kubernetes cluster.

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
| ImageLocation | Indicates the location of the specific cognitive service container image in ACR. For example, the face service: aicpppe.azurecr.io/microsoft/cognitive-services-face &lt;TBD this needs update after the public ones.&gt; |
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

## Check the cognitive service

Access the [OpenAPI specification](https://swagger.io/docs/specification/about/) (formerly the Swagger specification), describing the operations supported by an instantiated container, from the **/swagger** relative URI for that container. For example, the following URI provides access to the OpenAPI specification for the Sentiment Analysis container that was instantiated in the previous example:

```Text  
http:&lt;External IP&gt;:5000/swagger
```

You can get the external IP address from the following command: 

```bash  
    Kubectl get svc &lt;LoadBalancerName&gt;
```

## Next steps

[How to install and run Computer Vision API containers.](https://docs.microsoft.com/azure/cognitive-services/computer-vision/computer-vision-how-to-install-containers)

[How to install and run Face API containers](https://docs.microsoft.com/azure/cognitive-services/face/face-how-to-install-containers#create-a-face-resource-on-azure)

[How to install and run Text Analytics API containers](https://docs.microsoft.com/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-install-containers) 