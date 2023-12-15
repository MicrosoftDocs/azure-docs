---
title: "Use a template to create a secure workspace"
titleSuffix: Azure Machine Learning
description: Use a template to create an Azure Machine Learning workspace and required Azure services inside a secure virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.custom: ignite-2022, build-2023
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 06/05/2023
ms.topic: tutorial
monikerRange: 'azureml-api-2 || azureml-api-1'
---
# Tutorial: How to create a secure workspace by using template

Templates provide a convenient way to create reproducible service deployments. The template defines what will be created, with some information provided by you when you use the template. For example, specifying a unique name for the Azure Machine Learning workspace.

In this tutorial, you learn how to use a [Microsoft Bicep](../azure-resource-manager/bicep/overview.md) and [Hashicorp Terraform](https://www.terraform.io/) template to create the following Azure resources:

* Azure Virtual Network. The following resources are secured behind this VNet:
    * Azure Machine Learning workspace
        * Azure Machine Learning compute instance
        * Azure Machine Learning compute cluster
    * Azure Storage Account
    * Azure Key Vault
    * Azure Application Insights
    * Azure Container Registry
    * Azure Bastion host
    * Azure Machine Learning Virtual Machine (Data Science Virtual Machine)
    * The __Bicep__ template also creates an Azure Kubernetes Service cluster, and a separate resource group for it.

[!INCLUDE [managed-vnet-note](includes/managed-vnet-note.md)]

## Prerequisites

Before using the steps in this article, you must have an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).

You must also have either a Bash or Azure PowerShell command line.

> [!TIP]
> When reading this article, use the tabs in each section to select whether to view information on using Bicep or Terraform templates.

# [Bicep](#tab/bicep)

1. To install the command-line tools, see [Set up Bicep development and deployment environments](../azure-resource-manager/bicep/install.md).

1. The Bicep template used in this article is located at [https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure). Use the following commands to clone the GitHub repo to your development environment:

    > [!TIP]
    > If you do not have the `git` command on your development environment, you can install it from [https://git-scm.com/](https://git-scm.com/).

    ```azurecli
    git clone https://github.com/Azure/azure-quickstart-templates
    cd azure-quickstart-templates/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure
    ```  

# [Terraform](#tab/terraform)

1. To install, configure, and authenticate Terraform to your Azure subscription, use the steps in one of the following articles:

    * [Azure Cloud Shell](/azure/developer/terraform/get-started-cloud-shell-bash)
    * [Windows with Bash](/azure/developer/terraform/get-started-windows-bash)
    * [Windows with Azure PowerShell](/azure/developer/terraform/get-started-windows-powershell)

1. The Terraform template files used in this article are located at [https://github.com/Azure/terraform/tree/master/quickstart/201-machine-learning-moderately-secure](https://github.com/Azure/terraform/tree/master/quickstart/201-machine-learning-moderately-secure). To clone the repo locally and change directory to where the template files are located, use the following commands from the command line:

    > [!TIP]
    > If you do not have the `git` command on your development environment, you can install it from [https://git-scm.com/](https://git-scm.com/).

    ```azurecli
    git clone https://github.com/Azure/terraform
    cd terraform/quickstart/201-machine-learning-moderately-secure
    ```

---
## Understanding the template

# [Bicep](#tab/bicep)

The Bicep template is made up of the [main.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/main.bicep) and the `.bicep` files in the [modules](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules) subdirectory. The following table describes what each file is responsible for:

| File | Description |
| ----- | ----- |
| [main.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/main.bicep) | Parameters and variables. Passing parameters & variables to other modules in the `modules` subdirectory. |
| [vnet.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/vnet.bicep) | Defines the Azure Virtual Network and subnets. |
| [nsg.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/nsg.bicep) | Defines the network security group rules for the VNet. |
| [bastion.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/bastion.bicep) | Defines the Azure Bastion host and subnet. Azure Bastion allows you to easily access a VM inside the VNet using your web browser. |
| [dsvmjumpbox.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/dsvmjumpbox.bicep) | Defines the Data Science Virtual Machine (DSVM). Azure Bastion is used to access this VM through your web browser. |
| [storage.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/storage.bicep) | Defines the Azure Storage account used by the workspace for default storage. |
| [keyvault.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/keyvault.bicep) | Defines the Azure Key Vault used by the workspace. |
| [containerregistry.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/containerregistry.bicep) | Defines the Azure Container Registry used by the workspace. |
| [applicationinsights.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/applicationinsights.bicep) | Defines the Azure Application Insights instance used by the workspace. |
| [machinelearningnetworking.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/machinelearningnetworking.bicep) | Defines the private endpoints and DNS zones for the Azure Machine Learning workspace. |
| [Machinelearning.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/machinelearning.bicep) | Defines the Azure Machine Learning workspace. |
| [machinelearningcompute.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/machinelearningcompute.bicep) | Defines an Azure Machine Learning compute cluster and compute instance. |
| [privateaks.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/privateaks.bicep) | Defines an Azure Kubernetes Services cluster instance. |

> [!IMPORTANT]
> The example templates may not always use the latest API version for Azure Machine Learning. Before using the template, we recommend modifying it to use the latest API versions. For information on the latest API versions for Azure Machine Learning, see the [Azure Machine Learning REST API](/rest/api/azureml/).
>
> Each Azure service has its own set of API versions. For information on the API for a specific service, check the service information in the [Azure REST API reference](/rest/api/azure/).
>
> To update the API version, find the `Microsoft.MachineLearningServices/<resource>` entry for the resource type and update it to the latest version. The following example is an entry for the Azure Machine Learning workspace that uses an API version of `2022-05-01`:
>
>```json
>resource machineLearning 'Microsoft.MachineLearningServices/workspaces@2022-05-01' = {
>```

# [Terraform](#tab/terraform)

The template consists of multiple files. The following table describes what each file is responsible for:

| File | Description |
| ----- | ----- |
| [variables.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/variables.tf) | Variables and default values used by the template.
| [main.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/main.tf) | Specifies the Azure Resource Manager provider and defines the resource group. |
| [network.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/network.tf) | Defines the Azure Virtual Network, subnets, and network security groups. |
| [bastion.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/bastion.tf) | Defines the Azure Bastion host and associated NSG. Azure Bastion allows you to easily access a VM inside a VNet using your web browser. |
| [dsvm.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/dsvm.tf) | Defines the Data Science Virtual Machine (DSVM). Azure Bastion is used to access this VM through your web browser. |
| [workspace.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/workspace.tf) | Defines the Azure Machine Learning workspace. Including dependency resources for Azure Storage, Key Vault, Application Insights, and Container Registry. |
| [compute.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/compute.tf) | Defines an Azure Machine Learning compute instance and cluster. |

> [!TIP]
> The [Terraform Azure provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) supports additional arguments that are not used in this tutorial. For example, the [environment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#environment) argument allows you to target cloud regions such as Azure Government and Microsoft Azure operated by 21Vianet.

---

> [!IMPORTANT]
> The DSVM and Azure Bastion is used as an easy way to connect to the secured workspace for this tutorial. In a production environment, we recommend using an [Azure VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [Azure ExpressRoute](../expressroute/expressroute-introduction.md) to access the resources inside the VNet directly from your on-premises network.

## Configure the template

# [Bicep](#tab/bicep)

To run the Bicep template, use the following commands from the `machine-learning-end-to-end-secure` where the `main.bicep` file is:

1. To create a new Azure Resource Group, use the following command. Replace `exampleRG` with your resource group name, and `eastus` with the Azure region you want to use:

    # [Azure CLI](#tab/cli)

    ```azurecli
    az group create --name exampleRG --location eastus
    ```
    # [Azure PowerShell](#tab/ps1)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    ```

    ---

1. To run the template, use the following command. Replace the `prefix` with a unique prefix. The prefix will be used when creating Azure resources that are required for Azure Machine Learning. Replace the `securepassword` with a secure password for the jump box. The password is for the login account for the jump box (`azureadmin` in the examples below):

    > [!TIP]
    > The `prefix` must be 5 or less characters. It can't be entirely numeric or contain the following characters: `~ ! @ # $ % ^ & * ( ) = + _ [ ] { } \ | ; : . ' " , < > / ?`.

    # [Azure CLI](#tab/cli)

    ```azurecli
    az deployment group create \
        --resource-group exampleRG \
        --template-file main.bicep \
        --parameters \
        prefix=prefix \
        dsvmJumpboxUsername=azureadmin \
        dsvmJumpboxPassword=securepassword
    ```
    # [Azure PowerShell](#tab/ps1)

    ```azurepowershell
    $dsvmPassword = ConvertTo-SecureString "mysecurepassword" -AsPlainText -Force
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG `
        -TemplateFile ./main.bicep `
        -prefix "prefix" `
        -dsvmJumpboxUsername "azureadmin" `
        -dsvmJumpboxPassword $dsvmPassword
    ```

    > [!WARNING]
    > You should avoid using plain text strings in script or from the command line. The plain text can show up in event logs and command history. For more information, see [ConvertTo-SecureString](/powershell/module/microsoft.powershell.security/convertto-securestring).

    ---

# [Terraform](#tab/terraform)

To run the Terraform template, use the following commands from the `201-machine-learning-moderately-secure` directory where the template files are:

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

1. To run the template and apply the saved configuration to your Azure subscription, use the following command:

    ```azurecli
    terraform apply azureml.tfplan
    ```

    The progress is displayed as the template is processed.

---

## Connect to the workspace

After the template completes, use the following steps to connect to the DSVM:

1. From the [Azure portal](https://portal.azure.com), select the Azure Resource Group you used with the template. Then, select the Data Science Virtual Machine that was created by the template. If you have trouble finding it, use the filters section to filter the __Type__ to __virtual machine__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-template/select-vm.png" alt-text="Screenshot of filtering and selecting the vm.":::

1. From the __Overview__ section of the Virtual Machine, select __Connect__, and then select __Bastion__ from the dropdown.

    :::image type="content" source="./media/tutorial-create-secure-workspace-template/connect-bastion.png" alt-text="Screenshot of selecting to connect using Bastion.":::

1. When prompted, provide the __username__ and __password__ you specified when configuring the template and then select __Connect__.

    > [!IMPORTANT]
    > The first time you connect to the DSVM desktop, a PowerShell window opens and begins running a script. Allow this to complete before continuing with the next step.

1. From the DSVM desktop, start __Microsoft Edge__ and enter `https://ml.azure.com` as the address. Sign in to your Azure subscription, and then select the workspace created by the template. The studio for your workspace is displayed.

## Troubleshooting

### Error: Windows computer name cannot be more than 15 characters long, be entirely numeric, or contain the following characters

This error can occur when the name for the DSVM jump box is greater than 15 characters or includes one of the following characters: `~ ! @ # $ % ^ & * ( ) = + _ [ ] { } \ | ; : . ' " , < > / ?`.

When using the Bicep template, the jump box name is generated programmatically using the prefix value provided to the template. To make sure the name does not exceed 15 characters or contain any invalid characters, use a prefix that is 5 characters or less and do not use any of the following characters in the prefix: `~ ! @ # $ % ^ & * ( ) = + _ [ ] { } \ | ; : . ' " , < > / ?`.

When using the Terraform template, the jump box name is passed using the `dsvm_name` parameter. To avoid this error, use a name that is not greater than 15 characters and does not use any of the following characters as part of the name: `~ ! @ # $ % ^ & * ( ) = + _ [ ] { } \ | ; : . ' " , < > / ?`.

## Next steps

> [!IMPORTANT]
> The Data Science Virtual Machine (DSVM) and any compute instance resources bill you for every hour that they are running. To avoid excess charges, you should stop these resources when they are not in use. For more information, see the following articles:
> 
> * [Create/manage VMs (Linux)](../virtual-machines/linux/tutorial-manage-vm.md).
> * [Create/manage VMs (Windows)](../virtual-machines/windows/tutorial-manage-vm.md).
> * [Create compute instance](how-to-create-compute-instance.md).

:::moniker range="azureml-api-2"
To continue learning how to use the secured workspace from the DSVM, see [Tutorial: Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md).
:::moniker-end

To learn more about common secure workspace configurations and input/output requirements, see [Azure Machine Learning secure workspace traffic flow](concept-secure-network-traffic-flow.md).
