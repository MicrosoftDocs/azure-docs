---
title: "include file"
description: "include file"
services: machine-learning
author: sdgilley
ms.service: machine-learning
ms.author: sgilley
manager: cgronlund
ms.custom: "include file"
ms.topic: "include"
ms.date: 07/27/2018
---

In a command-prompt or shell window, create and activate the conda package manager environment with numpy and cython. This example uses Python 3.6.

  + On Windows:
       ```sh 
       conda create -n myenv Python=3.6 cython numpy
       conda activate myenv
       ```

  + On Linux or MacOS:
       ```sh 
       conda create -n myenv Python=3.6 cython numpy
       source activate myenv
       ```

Install the SDK.
   ```sh 
   pip install azureml-sdk
   ```
