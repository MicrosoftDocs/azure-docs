---
title: How to deploy the Form Recognizer sample labeling tool
titleSuffix: Azure Cognitive Services
description: Learn the different ways you can deploy the Form Recognizer sample labeling tool to help with supervised learning.
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 02/24/2020
ms.author: pafrley
---

# Deploy the sample labeling tool

The Form Recognizer sample labeling tool is an application that runs in a Docker container. It provides a helpful UI that you can use to manually label form documents for the purpose of supervised learning. The [Train with labels](./quickstarts/label-tool.md) quickstart shows you how to run the tool on your local computer, which is the most common scenario. 

This guide will explain alternative ways you can deploy and run the sample labeling tool. 

## Deploy to Azure Kubernetes Service

[Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/index).

1- Follow the instructions on [Train a Form Recognizer model with labels using the sample labeling tool](https://docs.microsoft.com/en-us/azure/cognitive-services/form-recognizer/quickstarts/label-tool) documentation page to register and get your credentials to access the containerpreview.azurecr.io registry.

2 - create a secret in your AKS cluster
```
kubectl create secret docker-registry container-io \
    --docker-server=containerpreview.azurecr.io \
    --docker-username=<username> \
    --docker-password=<password> \
    --docker-email=<your email>
```

3 - optional: update the sample-labeling-tool-deployment.yaml file with you secret name (if called differently than 'container-io')

4 - execute on your AKS cluster

````
kubectl apply -f sample-labeling-tool-deployment.yaml
````

5 - execute on your AKS cluster

````
kubectl apply -f sample-labeling-tool-service.yaml
````

6 - execute 'kubectl get services' to get the EXTERNAL-IP and navigate to this specific IP in your web browser to get access to the tool. This deployment uses a loab balancer to get an external-ip created by the cluster.

### tool deployment
```yml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    io.kompose.service: labeltool
  name: labeltool
spec:
  replicas: 1
  template:
    metadata:
      labels:
        io.kompose.service: labeltool
    spec:
      containers:
        - args:
            - eula=accept
          image: containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer-custom-supervised-labeltool:latest
          name: labeltool
          ports:
            - containerPort: 80
          resources: {}
      imagePullSecrets:
        - name: container-io
      restartPolicy: Always
status: {}
```

### tool service 

```yml
apiVersion: v1
kind: Service
metadata:
  name: labeltool
spec:
  ports:
    - port: 80
      targetPort: 80
  selector:
    io.kompose.service: labeltool
  type: LoadBalancer
```

## Deploy to Azure Container Instances

[Azure Container Instances](https://docs.microsoft.com/azure/container-instances/index),

```console
#####################

DNS_NAME_LABEL=aci-demo-$RANDOM

az container create \

  --resource-group <resorunce_group_name> \

  --name <name> \

  --image containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer-custom-supervised-labeltool:latest \

  --ports 3000 \

  --dns-name-label $DNS_NAME_LABEL \

  --location westus2 \

  --cpu 2 \

  --memory 8

--command-line "./run.sh eula=accept
```

## Deploy to a Kubernetes cluster

or a Kubernetes cluster [deployed to an Azure Stack](https://docs.microsoft.com/azure-stack/user/azure-stack-solution-template-kubernetes-deploy?view=azs-1910). 

## Next steps

Return to the [Train with labels](./quickstarts/label-tool.md) quickstart to learn how to use the tool to manually label training data and do supervised learning.
