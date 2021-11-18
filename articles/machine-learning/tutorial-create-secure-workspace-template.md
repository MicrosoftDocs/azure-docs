---
title: Use a template to create a secure workspace
titleSuffix: Azure Machine Learning
description: Use a template to create an Azure Machine Learning workspace and required Azure services inside a secure virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: jhirono
ms.author: larryfr
author: blackmist
ms.date: 11/15/2021
ms.topic: how-to
ms.custom: subject-rbac-steps
---
# How to create a secure workspace

## Prerequisites

1. To install, configure, and authenticate Terraform to your Azure subscription, follow the steps in one of the following:

    * Azure Cloud Shell
    * Windows with Bash
    * Windows with Azure PowerShell

1. The template files used in this article are located at [https://github.com/Azure/terraform/tree/master/quickstart/201-machine-learning-moderately-secure](https://github.com/Azure/terraform/tree/master/quickstart/201-machine-learning-moderately-secure). To clone the repo locally and change directory to where the template files are located, use the following commands:

    ```azurecli
    git clone https://github.com/Azure/terraform
    cd terraform/quickstart/201-machine-learning-moderately-secure
    ```

## Configure the template

To run the template, use the following commands from the `201-machine-learning-moderately-secure` directory:

1. To initialize the directory for working with Terraform, use the following command:

    ```azurecli
    terraform init
    ```

1. To create a configuration, use the following command. Use the `-var` parameter to set the value for the variables used by the template. For a full list of variables, see the `variables.tf` file:

    ```azurecli
    terraform plan \
        -var name=myworkspace \
        -var environment=dev \
        -var location=westus \
        -var dsvm_name=jumpbox \
        -var dsvm_host_password=secure_password \
        -out azureml.tfplan
    ```

    After this command completes, the configuration is displayed in the terminal. To display it again, use the `terraform show azureml.tfplan` command.

## Run the template

To run the template and apply the saved configuration to your Azure subscription, use the following command:

```azurecli
terraform apply azureml.tfplan
```

The progress is displayed as the template is processed.