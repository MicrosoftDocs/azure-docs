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
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/10/2017
ms.author: nepeters
---

# Azure Container Service tutorial - Deploy Application

TODO - figure out service discovery (currently hard coded pod address)

TODO - integrate secrets for env variables.

TODO - integrate Azure disk driver and move MySQL file.

TODO - integrate ACR

Secrets:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: azure-vote-front-secret
type: Opaque
data:
  MYSQL_DATABASE_USER: ZGJ1c2VyCg==
  MYSQL_DATABASE_PASSWORD: UGFzc3dvcmQxMgo=
  MYSQL_DATABASE_DB: VUdGemMzZHZjbVF4TWdvPQo=
  MYSQL_DATABASE_HOST: MTAuMjQ0LjMuMgo=
```

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
          value: dbuser 
        - name: MYSQL_DATABASE_PASSWORD
          value: Password12 
        - name: MYSQL_DATABASE_DB
          value: azurevote
        - name: MYSQL_DATABASE_HOST
          value: 10.244.3.7
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

