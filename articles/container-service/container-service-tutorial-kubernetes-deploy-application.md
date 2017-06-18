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
ms.date: 06/21/2017
ms.author: nepeters
---

# Deploy application to Kubernetes cluster

In previous tutorials of this set, an application has been tested and container images created. These images have been pushed to an Azure Container Registry. Finally, and Azure Container Service Kubernetes cluster has been deployed. In this tutorial, the Azure Voting app is deployed into the Kubernetes cluster. In subsequent tutorials, this application is scaled out, updated, and monitored.

Tasks completed in this tutorial include:

> [!div class="checklist"]
> * Understand the Kubernetes objects
> * Download Kubernetes manifest files
> * Deploy application into Kubernetes cluster
> * Test the application

## Prerequisites

This is one tutorial of a multi-part series. You do not need to complete the full series to work through this tutorial, however the following items are required.

**ACS Kubernetes cluster** – see, [Create a Kubernetes cluster](container-service-tutorial-kubernetes-deploy-cluster.md) for information on creating the cluster.

**Azure Container Registry** – if you would like to integrate Azure Container registry, an ACR instance is needed. See, [Deploy container registry](container-service-tutorial-kubernetes-prepare-acr.md) for information on the deployment steps.

## Introduction to Kubernetes objects

When deploying a containerized application into a Kubernetes cluster, many different Kubernetes objects are created. Each object represents the desired state for a portion of the deployment. For example, a simple application may consist of a pod, which is a grouping of closely related containers, a persistent volume, which is a piece of networked storage that is used for data storage, persistent volume claim, which is a request to use a persistent volume, and a deployment, which manages the state of the application. 

For details on all Kubernetes object, see [Kubernetes Concepts]( https://kubernetes.io/docs/concepts/) on kubernetes.io.

## Get manifest files

For this tutorial, Kubernetes object will be deployed using Kubernetes manifest files. Manifest files are YAML files that contain the configuration instructions.

The manifest files for each object in this tutorial are available in the Azure Vote application repo. If you have not already done so, clone the repo with the following command: 

```bash
git clone https://github.com/Azure-Samples/azure-voting-app.git
```

Once downloaded, change to the kubernetes-manifests directory.

```bash
cd ./azure-voting-app/kubernetes-manifests
```

## Deploy the Azure Vote app

### Create storage resources

Because the Azure Vote application includes a MySQL database, you want to store the database file on a volume that can be shared between pods. In this configuration, if the MySQL pod is recreated, the database file remains in-tact. 

The following manifest file creates a **storage class** object, which defines how and where a persistent volume is created. Several volume plug-ins are available for Kubernetes. In this case, the [Azure disk](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#azure-disk) plug-in is used.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: slow
provisioner: kubernetes.io/azure-disk
parameters:
 skuName: Standard_LRS
 location: eastus

```

A *persistent volume claim* is also created, which configures a piece of storage (using a storage class), and assigns it to a pod. 

```yaml
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

Create the storage objects with the following command:

```bash
kubectl create -f storage-resources.yaml
```

Once completed, a virtual disk is created in an Azure storage account, and attached to the resulting Kubernetes pods. The virtual disk is automatically created in a storage account residing in the same resource group as the Kubernetes cluster, and of the same configuration as the storage class object (Standard_LRS).

### Secure sensitive values

Kubernetes secrets provide a secure storage environment for sensitive information. These secrets can then be used inside the pods, when deploying application in a Kubernetes cluster.

In this example, the Azure Vote database credentials are stored in a secret, and used in the application deployment. The values for each secret are stored in the Kubernetes manifest as base64 encoded strings. For this educational example, notes have been placed inside the manifest with the decoded values.

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

Create the secret objects with the following command:

```bash
kubectl create -f pod-secrets.yaml
```

### Create back-end deployment

A Kubernetes deployment object manages the state of pods. This includes things like ensuring that the desired replica counts are running, volumes are mounted, and the proper container images are being used.

The following example creates a deployment for the back-end portion of the Azure Vote application. This includes configuring the Azure disk volume, passing through the MySQL connection secrets, and providing arguments to the back-end container image.

Note, if using Azure Container Registry, update the container image name in the **backend-deployment.yaml** file with the loginServer of the ACR instance.

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
        image: <acrLoginServer>/azure-vote-back:v1
        args: ["--ignore-db-dir=lost+found"]
        ports:
        - containerPort: 3306
          name: mysql
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

Create the deployment with the following command:

```bash
kubectl create -f backend-deployment.yaml
```

### Create front-end deployment

The front-end deployment is like the back-end. 

Again, if using ACR, update the container image name in the **frontend-deployment.yaml** file to reference the ACR loginServer name. 

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: azure-vote-front
spec:
  replicas: 1
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  minReadySeconds: 5 
  template:
    metadata:
      labels:
        app: azure-vote-front
    spec:
      containers:
      - name: azure-vote-front
        image: <acrLoginServer>/azure-vote-front:v1
        resources:
          requests:
            cpu: 250m
          limits:
            cpu: 500m
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 250m
          limits:
            cpu: 500m
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
```

Create the deployment with the following command:

```bash
kubectl create -f frontend-deployment.yaml
```

### Expose application

A Kubernetes service defines how a pod is accessed. With the Azure Vote app, the back-end pod must be internal accessible by name. The font-end pod must be accessible over the internet. Giving the service a type of *LoadBalancer* crates an externally accessible IP address over which the application can be accessed.

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

Create the services with the following command:

```bash
kubectl create -f services.yaml
```

## Test application

Once all resources have been created, the application can be accessed over the external IP address for the azure-vote-front service. This service can take a few minutes to create. To monitor the service creation process, run the following command. When the *EXTERNAL-IP* value for the *azure-vote-front* service switches from *pending* to an IP address, the application is ready and can be accessed on the external IP address.

```bash
kubectl get service -w
```

Output:

```bash
NAME               CLUSTER-IP    EXTERNAL-IP     PORT(S)        AGE
azure-vote-back    10.0.77.30    <none>          3306/TCP       4m
azure-vote-front   10.0.120.96   40.71.227.124   80:31482/TCP   4m
kubernetes         10.0.0.1      <none>          443/TCP        7m
```

Browse to the returned external IP address to see the application.

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/vote-app-external.png)

## Next steps

In this tutorial, the Azure vote application was deployed to an Azure Container Service Kubernetes cluster. Tasks completed include:  

> [!div class="checklist"]
> * Understand the Kubernetes objects
> * Download Kubernetes manifest files
> * Deploy application into Kubernetes cluster
> * Test the application

Advance to the next tutorial to learn about scaling both a Kubernetes application and the underlying Kubernetes infrastructure. 

> [!div class="nextstepaction"]
> [Scale Kubernetes application and infrastructure](./container-service-tutorial-kubernetes-scale.md)