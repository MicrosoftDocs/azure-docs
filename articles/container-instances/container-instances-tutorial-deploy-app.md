---
title: Azure Container Instances tutorial - Deploy app | Microsoft Docs
description: Azure Container Instances tutorial - Deploy app
services: container-instances
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags: 
keywords: 

ms.assetid: 
ms.service: container-instances
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/15/2017
ms.author: seanmck
---

# Deploy a container group

Azure Container Instances support the deployment of multiple containers onto a single host using a *container group*. This tutorial walks through the creation of an Azure Resource Manager (ARM) template defining a multi-container group and deploying it to Azure Container Instances. Steps completed include:

> [!div class="checklist"]
> * Defining a container group using an ARM template
> * Deploying the container group using the Azure CLI
> * Viewing container logs