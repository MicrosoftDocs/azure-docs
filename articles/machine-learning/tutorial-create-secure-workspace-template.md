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
ms.date: 11/29/2021
ms.topic: how-to
ms.custom: subject-rbac-steps
---
# How to create a secure workspace by using template

Templates provide a convenient way to create reproducible service deployments. The template defines what will be created, with some information provided by you when the template is ran. For example, specifying a unique name for the services.

In this tutorial, you learn how to use a template with [Hashicorp Terraform](https://www.terraform.io/) to create the following Azure resources:

* Azure resource group
* Azure Virtual Network
* Azure Machine Learning workspace
    * Azure Machine Learning compute instance
    * Azure Machine Learning compute cluster
* Azure Storage Account
* Azure Key Vault
* Azure Application Insights
* Azure Container Registry
* Azure Bastion host
* Azure Machine Learning Virtual Machine (Data Science Virtual Machine)

> [!IMPORTANT]
> The Data Science Virtual Machine (DSVM) and compute instance resources bill you for every hour that they are running. To avoid excess charges, you should stop these resources when they are not in use. For more information, see the following articles:
> 
> * [Create/manage VMs (Linux)](/azure/virtual-machines/linux/tutorial-manage-vm).
> * [Create/manage VMs (Windows)](/azure/virtual-machines/windows/tutorial-manage-vm).
> * [Create/manage compute instance](how-to-create-manage-compute-instance.md).

## Prerequisites

1. To install, configure, and authenticate Terraform to your Azure subscription, follow the steps in one of the following articles:

    * [Azure Cloud Shell](/azure/developer/terraform/get-started-cloud-shell-bash)
    * [Windows with Bash](/azure/developer/terraform/get-started-windows-bash)
    * [Windows with Azure PowerShell](/azure/developer/terraform/get-started-windows-powershell)

1. The template files used in this article are located at [https://github.com/Azure/terraform/tree/master/quickstart/201-machine-learning-moderately-secure](https://github.com/Azure/terraform/tree/master/quickstart/201-machine-learning-moderately-secure). To clone the repo locally and change directory to where the template files are located, use the following commands from the command line:

    ```azurecli
    git clone https://github.com/Azure/terraform
    cd terraform/quickstart/201-machine-learning-moderately-secure
    ```

## Understanding the template

The template consists of multiple files. The following table describes what each file is responsible for:

| File | Description |
| ----- | ----- |
| [variables.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/variables.tf) | Variables and default values used by the template.
| [main.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/main.tf) | Specifies the Azure Resource Manager provider and defines the resource group. |
| [network.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/network.tf) | Defines the Azure Virtual Network (VNet), subnets, network security groups (NSG), and private DNS zones. |
| [bastion.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/bastion.tf) | Defines the Azure Bastion host and associated NSG. Azure Bastion allows you to easily access a VM inside a VNet using your web browser. |
| [dsvm.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/dsvm.tf) | Defines the Azure Virtual Machine (a Data Science Virtual Machine, or DSVM). Azure Bastion is used to access this VM through your web browser. |
| [workspace.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/workspace.tf) | Defines the Azure Machine Learning workspace, including the dependency resources for Azure Storage, Key Vault, Application Insights, and Container Registry. It also defines an Azure Machine Learning compute cluster, which is required for building Docker images when Container Registry is secured in the VNet. |
| [compute.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/compute.tf) | Defines an Azure Machine Learning compute instance and cluster. |

## Configure the template

To run the template, use the following commands from the `201-machine-learning-moderately-secure` directory:

1. To initialize the directory for working with Terraform, use the following command:

    ```azurecli
    terraform init
    ```

1. To create a configuration, use the following command. Use the `-var` parameter to set the value for the variables used by the template. For a full list of variables, see the [variables.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/variables.tf) file:

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

## Connect to the workspace

After the template completes, use the following steps to connect to the DSVM:

1. From the [Azure portal](https://portal.azure.com), select the DSVM that was created by the template.
1. From the __Overview__ page, select __Connect__, and then select __Bastion__ from the dropdown.
1. When prompted, provide the __username__ and __password__ you specified when configuring the template and then select __Connect__.

    > [!IMPORTANT]
    > The first time you connect to the DSVM desktop, a PowerShell window opens and begins running a script. Allow this to complete before continuing with the next step.

1. From the DSVM desktop, start __Microsoft Edge__ and enter `https://ml.azure.com` as the address. Sign in to your Azure subscription, and then select the workspace created by the template.

## Next steps

 