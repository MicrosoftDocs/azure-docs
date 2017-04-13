---
title: Create an Azure Container Service cluster into an existing virtual network | Microsoft Docs
description: This article explains how you can use the Azure Container Service Engine to deploy a brand new cluster into an existing virtual network
services: container-service
documentationcenter: ''
author: jucoriol
manager: pierlag
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Mesos, Azure, Kubernetes, Swarm, Network

ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/13/2017
ms.author: jucoriol

---

# Using a custom virtual network with Azure Container Service 
In this tutorial you are going to learn how to use [ACS Engine](https://github.com/Azure/acs-engine) to deploy a brand new cluster into an existing virtual network. This will work with the all the orchestrators available with ACS Engine: Docker Swarm, Kubernetes and DC/OS.

## Prerequisites
You can run this walkthrough on OS X, Windows, or Linux.
- You need an Azure subscription. If you don't have one, you can [sign up for an account](https://azure.microsoft.com/).
- Install the [Azure CLI 2.0](/cli/azure/install-az-cli2).
- Install the [ACS Engine](https://github.com/Azure/acs-engine/blob/master/docs/acsengine.md)

