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

Azure Container Registry – if you would like to integrate Azure Container registry (optional), an ACR instance will be needed. See, [Deploy container registry]() for information on the deployment steps.

Kubernetes manifest files – the Azure Vote application will be deployed using Kubernetes YAML manifest files. These can either be copied from the text of this tutorial or pre-created files are included in the Azure Vote repo. To clone the repo, run:

```bash
git clone https://github.com/neilpeterson/azure-kubernetes-samples.git
```

## Understand Kubernetes Objects

When deploying a containerized application into a Kubernetes cluster, many different Kubernetes objects are created. Each object represents the desired state for a portion of the application deployment. For example, a simple application may consist of a pod, which is a grouping of closely related containers, a persistent volume, which is a piece of networked storage that is used for data storage, persistent volume claim which is a request to use a persistent volume, and a deployment which manages the state of the application. 

For details on all Kubernetes object, see [Kubernetes Concepts]( https://kubernetes.io/docs/concepts/) on kubernetes.io.

## Deploye the Vote app

This document will individual detail all objects included with the Azure Vote app deployment. If you would rather just deploy the app, without examining the details, a completed manifest has been pre-created. When deploying the complete manifest, the Azure Vote images are pulled from a public registry using default values.

To deploy the Azure Vote app, run the following command. 

```bash
kubectl create -f https://raw.githubusercontent.com/neilpeterson/azure-kubernetes-samples/master/kubernetes-manifests/azure-vote-all-in-one.yaml
```

Once deployed, run the following command to monitor deployment status. This will return a list of services. When the *ENTERNAL-IP* address value for the *azure-vote-front* switches from *<pending>* to and IP address, the application is ready and can be accessed on the external IP address.

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

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/vote-app.png)

## Create storage resources

Because the Azure Vote application includes a MySQL database, we will want to store the database file on a volume that can be shared between pods. In this configuration, if the MySQL pod is recreated, the database file will remain in-tact. 

The following manifest file creates a Storage Class object which defines how and where a persistent volume will be created. Several volume plug-ins are available for Kubernetes. In this case the [Azure disk]()https://kubernetes.io/docs/concepts/storage/persistent-volumes/#azure-disk plug in is used.

A persistent volume claim is also created, which configures a piece of storage (using a storage class), and assigns it to a pod. 

When deployed, the combination of these objects will create a VHD in an Azure storage account, and attach that to the resulting Kubernetes pods. The VHD is automatically created in a storage account residing in the same resource group as the Kubernete cluster and of the same configuration as the storage class object (Standard_LRS).

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

Create the storage objects with the following command.

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

Create the secreat objects with the following command.

```bash
kubectl create -f pod-secrets.yaml
```

## Create back-end deployment

A Kubernetes deployment controller manages the state of an applications pods. This includes things like ensuring that the desired replica counts are running, that volumes are mounted, and the proper container images are being used.

The following example creates a deployment for the back-end portion of the Azure Vote application. This includes configuring the Azure disk volume, passing through the MySQL connection secrets, and providing arguments to the back-end container image.

Note, if using Azure Container Registry, update the image name with the loginServer of the ACR instance.

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

Create the deployment with the following command.

```bash
kubectl create -f backend-deployment
```

## Create front-end deployment

The front-end deployment is like the back-end. Again, if using ACR, update the image names to reference the ACR loginServer name. 

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
```

Create the deployment with the following command.

```bash
kubectl create -f frontend-deployment
```

## Create services

A Kubernetes services define how a pod will be accessed. In the case of the Azure Vote app, the front-end pod must be accessible from the internet, and the back-end pod front the front-end pod.

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

Create the services with the following command.

```bash
kubectl create -f services.yaml
```

Once deployed, run the following command to monitor deployment status. This will return a list of services. When the *ENTERNAL-IP* address value for the *azure-vote-front* switches from *<pending>* to and IP address, the application is ready and can be accessed on the external IP address.

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

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/vote-app.png)

## Next steps

In this tutorial, the Azure vote application was deployed to an Azure Container Service Kubernetes cluster. Tasks completed include:  

> [!div class="checklist"]
> * Understand the Kubernetes resources that will be deployed
> * Deploy and test the application

Advance to the next tutorial to learn about scaling both a Kubernetes application and the underlying Kubernetes infrastructure. 

> [!div class="nextstepaction"]
> [Scale Kubernetes application and infrastructure](./container-service-tutorial-kubernetes-scale-application.md)

