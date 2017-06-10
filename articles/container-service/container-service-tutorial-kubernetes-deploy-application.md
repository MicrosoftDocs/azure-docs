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
ms.date: 06/10/2017
ms.author: nepeters
---

# Azure Container Service tutorial - Deploy Application

TODO - integrate Azure disk driver and move MySQL file.

TODO - integrate ACR

TODO - Create secret and new deployment for MySQL

TODO (completed) - figure out service discovery (currently hard coded pod address)

TODO (completed) - integrate secrets for env variables.

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

Create front-end secret definition.

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
  MYSQL_DATABASE_HOST: MTAuMjQ0LjMuMw==
```

Create front-end secret.

```bash
kubectl create -f secret.yaml
```

## Deploy application

Create back-end deployment definition

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
      - name: azure-vote-front
        image: neilpeterson/azure-vote-back
        ports:
        - containerPort: 3306
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: Password12
        - name: MYSQL_USER
          value: dbuser
        - name: MYSQL_PASSWORD
          value: Password12
        - name: MYSQL_DATABASE
          value: azurevote
```

Create front-end deployment definition - secrets have been integrated here.

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
        image: neilpeterson/azure-vote-front
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

Deploy application:

```bash
kubectl create -f ./azure-front-end.yaml
kubectl create -f ./azure-back-end.yaml
```

## Expose application

The MySQL deployment is exposed internally, and the Python deployment (azure-vote-front) externally.

```bash
kubectl expose deployment azure-vote-back
kubectl expose deployment azure-vote-front --type LoadBalancer --name azure-vote-front
```

```bash
kubectl get service -w
```

