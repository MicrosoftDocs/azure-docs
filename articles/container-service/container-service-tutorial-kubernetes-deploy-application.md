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
ms.date: 06/11/2017
ms.author: nepeters
---

# Azure Container Service tutorial - Deploy Application

TODO - Move create DB operation into app. This remove the need to manage two images.

TODO - Create secret and new deployment for MySQL.

TODO - Create complete deployment / consolidate YAML, include in app repository.

TODO - Convert expose command to YAML definitions.

TODO - Try premium storage for volume mount (perf issue).

TODO (completed) - Integrate Azure Container Registry.

TODO (completed) - integrate Azure disk driver and move MySQL file.

TODO (completed) - figure out service discovery (currently hard coded pod address).

TODO (completed) - integrate secrets for environment variables.

## Create storage resources

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

## Create secrets

Base64 encode secrets for front-end.

```bash
# MYSQL_DATABASE_USER
echo -n dbuser | base64

# MYSQL_DATABASE_PASSWORD
echo -n Password12 | base64

# MYSQL_DATABASE_DB
echo -n azurevote | base64

# MYSQL_DATABASE_HOST - this name will equal a service created for the MySQL deployment.
echo -n azure-vote-back | base64
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: azure-vote-front-secret
type: Opaque
data:
  MYSQL_DATABASE_USER: ZGJ1c2Vy
  MYSQL_DATABASE_PASSWORD: UGFzc3dvcmQxMg==
  MYSQL_DATABASE_DB: YXp1cmV2b3Rl
  MYSQL_DATABASE_HOST: YXp1cmUtdm90ZS1iYWNr
```

## Create deployments

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
        image: mycontainerregistry22269.azurecr.io/azure-vote-front
        ports:
        - containerPort: 8000
        env:
        - name: MYSQL_DATABASE_USER
          valueFrom:
            secretKeyRef:
              name: azure-vote-front-secret
              key: MYSQL_DATABASE_USER
        - name: MYSQL_DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: azure-vote-front-secret
              key: MYSQL_DATABASE_PASSWORD
        - name: MYSQL_DATABASE_DB
          valueFrom:
            secretKeyRef:
              name: azure-vote-front-secret
              key: MYSQL_DATABASE_DB
        - name: MYSQL_DATABASE_HOST
          valueFrom:
            secretKeyRef:
              name: azure-vote-front-secret
              key: MYSQL_DATABASE_HOST
```

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
        image: mycontainerregistry22269.azurecr.io/azure-vote-back
        args: ["--ignore-db-dir=lost+found"]
        ports:
        - containerPort: 3306
          name: mysql
        volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: Password12
        - name: MYSQL_USER
          value: dbuser
        - name: MYSQL_PASSWORD
          value: Password12
        - name: MYSQL_DATABASE
          value: azurevote
      volumes:
      - name: mysql-persistent-storage
        persistentVolumeClaim:
          claimName: mysql-pv-claim
```

## Expose application

TODO - Convert these to YAML definitions.

```bash
kubectl expose deployment azure-vote-back
kubectl expose deployment azure-vote-front --type LoadBalancer --name azure-vote-front
```