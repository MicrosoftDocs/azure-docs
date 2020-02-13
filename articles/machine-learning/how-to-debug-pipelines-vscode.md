---
title: Use VSCode to debug pipelines
titleSuffix: Azure Machine Learning
description: learn how to use Visual Studio Code to interactively debug Python code used by a machine learning pipeline. VSCode can attach to Azure Machine Learning compute 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.reviewer: larryfr
ms.author: 
author: 
ms.date: 02/12/2020
---

1. Create a compute instance. During creation, enable SSH access and provide an SSH public key.
1. Once the compute instance has been created, select the __SSH__ link to find the __public IP address__ and __port__ for SSH access. Save this info, as it is used later.
1. ssh -L 8000:localhost:8000 azureuser@52.138.127.188 -p 50000

    Why 8000? Presumably this is where the debug session is hosted.


ssh azureuser@52.138.127.188 -p 50000