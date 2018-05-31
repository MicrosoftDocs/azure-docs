---
title: Integrate Azure Active Directrory with Azure Kubernetes Service
description: How to create Azure Active Directrory enabled Azure Kubernetes Service clusters.
services: container-service
author: neilpeterson
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 6/13/2018
ms.author: nepeters
ms.custom: mvc
---

# Integrate Azure Active Directory with Azure Kubernetes Service

## Create server application

```azurecli
$ az ad app create --display-name aks-server-application --identifier-uris https://example007.com --password P@ssword12 --query appId -o tsv

cf7897ef-0000-0000-0000-952ca28b7cd7
```

## Create client application

```azurecli
$ az ad app create --display-name aks-client-application --native-app --query appId -o tsv

2e364fb9-0000-0000-0000-b407b05de88b
```

## Get tenant ID

```azurecli
az account list --query "[].{Name:name,TenantID:tenantId}" -o table
```

Output:

```
Name                                TenantID
----------------------------------  ------------------------------------
Microsoft Internal - Billable       00000000-0000-0000-0000-000000000000
Microsoft Internal - Rate Capped    00000000-0000-0000-0000-000000000000
```
