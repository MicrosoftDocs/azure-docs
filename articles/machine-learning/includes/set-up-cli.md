---
title: "Include file"
description: "Include file"
services: machine-learning
author: sdgilley
ms.service: machine-learning
ms.author: sgilley
ms.custom: "include file"
ms.topic: "include"
ms.date: 06/10/2024
---

1. Open a terminal window and sign in to Azure. If you're using an [Azure Machine Learning compute instance](../quickstart-create-resources.md#create-a-compute-instance), use:

    ```azurecli
    az login --identity
    ```

    If you're not on the compute instance, omit `--identity` and follow the prompt to open a browser window to authenticate.

1. Make sure you have the most recent versions of the CLI and the `ml` extension:

    ```azurecli
    az upgrade
    ```

1. If you have multiple Azure subscriptions, set the active subscription to the one you're using for your workspace. (You can skip this step if you only have access to a single subscription.)  Replace `<YOUR_SUBSCRIPTION_NAME_OR_ID>` with either your subscription name or subscription ID. Also remove the brackets `<>`.

    :::code language="azurecli" source="~/azureml-examples-main/cli/misc.sh" id="az_account_set":::


1. Set the default workspace. If you're using a compute instance, you can keep the following command as is. If you're on any other computer, substitute your resource group and workspace name instead. (You can find these values in [Azure Machine Learning studio](../how-to-r-train-model.md#submit-the-job).)

    ```azurecli
    az configure --defaults group=$CI_RESOURCE_GROUP workspace=$CI_WORKSPACE
    ```
