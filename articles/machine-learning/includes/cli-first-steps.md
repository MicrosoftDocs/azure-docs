---
title: Include file
description: Include file
author: sdgilley
ms.service: machine-learning
services: machine-learning
ms.topic: include
ms.date: 05/03/2024
ms.author: sgilley
ms.custom: include file
---

* If you're on a compute instance:

    ```azurecli
    az login --identity
    # next line needed only if you have multiple subscriptions:
    az account set --subscription "<SUBSCRIPTION-NAME>" # replace with your subscription name
    az configure --defaults group=$CI_RESOURCE_GROUP workspace=$CI_WORKSPACE
     ```

* If you're running the commands locally, omit `--identity` and follow instructions for authentication. Also replace `$CI_RESOURCE_GROUP` and `$CI_WORKSPACE` with your values.
