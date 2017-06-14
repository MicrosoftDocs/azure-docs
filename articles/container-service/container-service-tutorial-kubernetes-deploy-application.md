---
title: Azure Container Service tutorial - Deploy Application | Microsoft Docs
description: Azure Container Service tutorial - Deploy Application
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, DC/OS, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: aurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/13/2017
ms.author: nepeters
---

# Azure Container Service tutorial - Deploy Application

If you have been following along, at this point, an application was tested, container images created and up loaded to an Azure Container registry, and finally an Azure Container Service Kubernetes cluster deployed. In this tutorial, the Azure Voting app will be deployed into the Kubernetes cluster. In subsequent tutorials, this application will be scaled out, updated, and monitored.

Tasks completed in this tutorial include:

> [!div class="checklist"]
> * Understand the Kubernetes resources that will be deployed
> * Deploy and test the application

## Prerequisites

This tutorial is one part of a series. While you do not need to complete the full series to work through this tutorial, the following items are required.

Azure Container Service Kubernetes cluster – see, [Create a Kubernetes cluster]( container-service-tutorial-kubernetes-deploy-cluster.md) for information on creating the cluster.

## Understand Kubernetes Objects

When deploying a containerized application into a Kubernetes cluster, many different Kubernetes objects are created. Each object represents the desired state for a portion of the application deployment. For example, a simple application may consist of a pod, which is a grouping of closely related containers, a persistent volume, which is a piece of networked storage that is used for data storage, persistent volume claim which is a request to use a persistent volume, and a deployment which manages the state of the application. 

For details on all Kubernetes object, see [Kubernetes Concepts]( https://kubernetes.io/docs/concepts/) on kubernetes.io.

## Create storage resources

Because the Azure Vote application includes a MySQL database, we will want to store the database file on a volume that can be shared between pods. In this configuration, if the MySQL pod is recreated, the database file will remain in-tact. 

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: slow
provisioner: kubernetes.io/azure-disk
parameters:
 skuName: Standard_LRS
 location: eastus
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pv-claim
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

```bash
kubectl create -f storage-resources.yaml
```

## Create Kubernetes secret

Kubernetes secrets provide a secure storage environment for sensitive information. These secrets can then be used inside of pods, when deploying application in a Kubernetes cluster.

In this example, the Azure Vote database credentials are stored in a secret and used in the application deployment. The values for each secret are stored in the Kubernetes manifest as base64 encoded strings. For this educational example, notes have been placed inside of the manifest with the decoded values.

```bash
apiVersion: v1
kind: Secret
metadata:
  name: azure-vote
type: Opaque
data:
  # dbuser
  MYSQL_USER: ZGJ1c2Vy
  # Password12
  MYSQL_PASSWORD: UGFzc3dvcmQxMg==
  # azurevote
  MYSQL_DATABASE: YXp1cmV2b3Rl
  # azure-vote-back
  MYSQL_HOST: YXp1cmUtdm90ZS1iYWNr
  # Password12
  MYSQL_ROOT_PASSWORD: UGFzc3dvcmQxMg==
```

```bash
kubectl create -f pod-secrets.yaml
```

## Create back-end deployment

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: azure-vote-back
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: azure-vote-back
    spec:
      containers:
      - name: azure-vote-back
        image: mycontainerregistry3433.azurecr.io/azure-vote-back:latest
        args: ["--ignore-db-dir=lost+found"]
        ports:
        - containerPort: 3306
          name: mysql
        imagePullPolicy: Always
        volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: azure-vote
              key: MYSQL_ROOT_PASSWORD
        - name: MYSQL_USER
          valueFrom:
            secretKeyRef:
              name: azure-vote
              key: MYSQL_USER
        - name: MYSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: azure-vote
              key: MYSQL_PASSWORD
        - name: MYSQL_DATABASE
          valueFrom:
            secretKeyRef:
              name: azure-vote
              key: MYSQL_DATABASE
      volumes:
      - name: mysql-persistent-storage
        persistentVolumeClaim:
          claimName: mysql-pv-claim
```

## Create front-end deployment

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: azure-vote-front
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: azure-vote-front
    spec:
      containers:
      - name: azure-vote-front
        image: mycontainerregistry3433.azurecr.io/azure-vote-front:latest
        ports:
        - containerPort: 80
        imagePullPolicy: Always
        env:
        - name: MYSQL_USER
          valueFrom:
            secretKeyRef:
              name: azure-vote
              key: MYSQL_USER
        - name: MYSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: azure-vote
              key: MYSQL_PASSWORD
        - name: MYSQL_DATABASE
          valueFrom:
            secretKeyRef:
              name: azure-vote
              key: MYSQL_DATABASE
        - name: MYSQL_HOST
          valueFrom:
            secretKeyRef:
              name: azure-vote
              key: MYSQL_HOST
``

## Create services

```yaml
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-back
spec:
  ports:
  - port: 3306
  selector:
    app: azure-vote-back
---
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-front
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: azure-vote-front
```

```bash
kubectl create -f services.yaml
```

To determine when the application is ready to be accessed, return a list of services.

```bash
kubectl get service
```

Output:

```bash
NAME               CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
azure-vote-back    10.0.77.30    <none>        3306/TCP       6s
azure-vote-front   10.0.120.96   <pending>     80:31482/TCP   5s
kubernetes         10.0.0.1      <none>        443/TCP        3m
```

When the EXTERNAL_IP of *azure-vote-front* service changes from *<pending>* to an IP address, the application is ready.

```bash
NAME               CLUSTER-IP    EXTERNAL-IP     PORT(S)        AGE
azure-vote-back    10.0.77.30    <none>          3306/TCP       4m
azure-vote-front   10.0.120.96   40.71.227.124   80:31482/TCP   4m
kubernetes         10.0.0.1      <none>          443/TCP        7m
```

Browse to the returned external IP address to see the application.

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/vote-app.png)


## Next steps

In this tutorial, the Azure vote application was deployed to an Azure Container Service Kubernetes cluster. Tasks completed include:  

> [!div class="checklist"]
> * Understand the Kubernetes resources that will be deployed
> * Deploy and test the application

Advance to the next tutorial to learn about scaling both a Kubernetes application and the underlying Kubernetes infrastructure. 

> [!div class="nextstepaction"]
> [Scale Kubernetes application and infrastructure](./container-service-tutorial-kubernetes-scale-application.md)

