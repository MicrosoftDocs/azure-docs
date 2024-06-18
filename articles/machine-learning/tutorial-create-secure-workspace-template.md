---
title: "Use a template to create a secure workspace"
titleSuffix: Azure Machine Learning
description: Use a template to create an Azure Machine Learning workspace and associated required Azure services inside a secure virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.custom: build-2023
ms.reviewer: larryfr
ms.author: meerakurup 
author: meerakurup 
ms.date: 06/18/2024
ms.topic: tutorial
monikerRange: 'azureml-api-2 || azureml-api-1'
---
# Tutorial: How to create a secure workspace by using a template

Templates provide a convenient way to create reproducible service deployments. The template defines what to create, with some information you provide when you use the template. For example, you specify a unique name for an Azure Machine Learning workspace.

In this tutorial, you learn how to use a [Microsoft Bicep](../azure-resource-manager/bicep/overview.md) or [Hashicorp Terraform](https://www.terraform.io/) template to create an Azure virtual network with the following Azure resources secured behind it.

* Azure Machine Learning workspace
  * Azure Machine Learning compute instance
  * Azure Machine Learning compute cluster
* Azure Storage Account
* Azure Key Vault
* Azure Application Insights
* Azure Container Registry
* Azure Bastion host
* Azure Machine Learning Data Science Virtual Machine (DSVM)

The Bicep template also creates an Azure Kubernetes Service (AKS) cluster, and a separate resource group for the AKS cluster.

[!INCLUDE [managed-vnet-note](includes/managed-vnet-note.md)]

Select the Bicep or Terraform tabs in the following sections to view the Bicep or Terraform information.

## Prerequisites

- An Azure subscription with a free or paid version of Azure Machine Learning. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

- Git installed on your development environment to clone the template repository. If you don't have the `git` command, you can install Git from [https://git-scm.com/](https://git-scm.com/).

- Either a Bash or Azure PowerShell command line.

# [Bicep](#tab/bicep)

- To install the command-line tools, see [Set up Bicep development and deployment environments](../azure-resource-manager/bicep/install.md).

- The Bicep template for this article is at [Azure Machine Learning end-to-end secure setup](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure). To clone the GitHub repo to your development environment and switch to the template directory, run the following commands:

  ```bash
  git clone https://github.com/Azure/azure-quickstart-templates
  cd azure-quickstart-templates/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure
  ```  

# [Terraform](#tab/terraform)

- To install, configure, and authenticate Terraform to your Azure subscription, use the steps in one of the following articles:

  - [Azure Cloud Shell](/azure/developer/terraform/get-started-cloud-shell-bash)
  - [Windows with Bash](/azure/developer/terraform/get-started-windows-bash)
  - [Windows with Azure PowerShell](/azure/developer/terraform/get-started-windows-powershell)

- The Terraform template for this article is at [Azure Machine Learning workspace (moderately secure network set up)](https://github.com/Azure/terraform/tree/master/quickstart/201-machine-learning-moderately-secure). To clone the repo locally and switch to the template directory, run the following commands:

  ```bash
  git clone https://github.com/Azure/terraform
  cd terraform/quickstart/201-machine-learning-moderately-secure
  ```

---
## Understand the template

# [Bicep](#tab/bicep)

The Bicep template is made up of the [main.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/main.bicep) and the *.bicep* files in the [modules](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules) subdirectory. The following table describes what each file is responsible for:

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
> The example templates might not always use the latest API version for Azure Machine Learning. Before using the template, you should modify it to use the latest API versions. For information on the latest API versions for Azure Machine Learning, see the [Azure Machine Learning REST API](/rest/api/azureml/).
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
| [network.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/network.tf) | Defines the Azure Virtual Network, subnets, and network security groups (NSG). |
| [bastion.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/bastion.tf) | Defines the Azure Bastion host and associated NSG. Azure Bastion allows you to easily access a virtual machine (VM) inside a virtual network by using your web browser. |
| [dsvm.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/dsvm.tf) | Defines the DSVM. Azure Bastion is used to access this VM through your web browser. |
| [workspace.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/workspace.tf) | Defines the Azure Machine Learning workspace, including dependent resources for Azure Storage, Key Vault, Application Insights, and Container Registry. |
| [compute.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/compute.tf) | Defines an Azure Machine Learning compute instance and cluster. |

> [!TIP]
> The [Terraform Azure provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) supports more arguments that aren't used in this tutorial. For example, the [environment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#environment) argument allows you to target cloud regions such as Azure Government and Microsoft Azure operated by 21Vianet.

---

> [!IMPORTANT]
> The DSVM and Azure Bastion are used as easy ways to connect to the secured workspace for this tutorial. In a production environment, it's best to use an [Azure VPN gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [Azure ExpressRoute](/azure/expressroute/expressroute-introduction) to access the resources inside the virtual network directly from your on-premises network.

## Configure the template

# [Bicep](#tab/bicep)

To deploy the Bicep template, run the following commands from the *machine-learning-end-to-end-secure* directory where the *main.bicep* file is located.

1. To create a new Azure resource group, run the following example command, replacing `exampleRG` with the resource group name and `eastus` with the Azure region you want to use:

    # [Azure CLI](#tab/cli)

    ```azurecli
    az group create --name exampleRG --location eastus
    ```
    # [Azure PowerShell](#tab/ps1)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    ```

    ---

1. To deploy the template, use the following command, replacing `prefix` with a unique prefix to use when creating required Azure Machine Learning resources. Replace `dsvmpassword` with a secure password for the DSVM jump box sign-in account, `azureadmin` in the following examples.

    > [!TIP]
    > The `prefix` must be five or fewer characters, and can't be entirely numeric or contain the characters `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `=`, `+`, `_`, `[`, `]`, `{`, `}`, `\`, `|`, `;`, `:`, `.`, `'`, `"`, `,`, `<`, `>`, `/`, or `?`.

    # [Azure CLI](#tab/cli)

    ```azurecli
    az deployment group create \
        --resource-group exampleRG \
        --template-file main.bicep \
        --parameters \
        prefix=prefix \
        dsvmJumpboxUsername=azureadmin \
        dsvmJumpboxPassword=dsvmpassword
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
    > You should avoid using plain text strings in scripts or from the command line. The plain text can show up in event logs and command history. For more information, see [ConvertTo-SecureString](/powershell/module/microsoft.powershell.security/convertto-securestring).

---

# [Terraform](#tab/terraform)

To deploy the Terraform template, use the following commands from the *201-machine-learning-moderately-secure* directory where the template files are located.

1. To initialize the directory for working with Terraform, use the following command:

    ```azurecli
    terraform init
    ```

1. To create a configuration, use the following command. Use the `-var` parameters to set the values for the variables the template uses. For a full list of variables, see the [variables.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/variables.tf) file.

    ```azurecli
    terraform plan \
        -var name=myworkspace \
        -var environment=dev \
        -var location=westus \
        -var dsvm_name=jumpbox \
        -var dsvm_host_password=secure_password \
        -out azureml.tfplan
    ```

    After this command completes, the configuration displays in the terminal. To display it again, use the `terraform show azureml.tfplan` command.

1. To deploy the template and apply the saved configuration to your Azure subscription, use the following command:

    ```azurecli
    terraform apply azureml.tfplan
    ```

    The progress displays as the template processes.

---

## Connect to the workspace

After the deployment completes, use the following steps to connect to the DSVM:

1. From the [Azure portal](https://portal.azure.com), select the Azure Resource Group you used with the template. Then, select the DSVM that the template created. If you have trouble finding it, use the filters section to filter the __Type__ to __virtual machine__.

    :::image type="content" source="./media/tutorial-create-secure-workspace-template/select-vm.png" alt-text="Screenshot of filtering and selecting the vm.":::

1. From the DSVM __Overview__ page, select __Connect__, and then select __Bastion__ from the dropdown list.

    :::image type="content" source="./media/tutorial-create-secure-workspace-template/connect-bastion.png" alt-text="Screenshot of selecting to connect using Bastion.":::

1. When prompted, provide the __username__ and __password__ you specified when configuring the template, and then select __Connect__.

    > [!IMPORTANT]
    > The first time you connect to the DSVM desktop, a PowerShell window opens and runs a script. Allow the script to complete before continuing with the next step.

1. From the DSVM desktop, start __Microsoft Edge__ and enter *https://ml.azure.com* as the address. Sign in to your Azure subscription, and then select the workspace the template created. The studio for your workspace appears.

## Troubleshooting

The following error can occur when the name for the DSVM jump box is greater than 15 characters or includes one of the following characters: `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `=`, `+`, `_`, `[`, `]`, `{`, `}`, `\`, `|`, `;`, `:`, `.`, `'`, `"`, `,`, `<`, `>`, `/`, or `?`.

**Error: Windows computer name cannot be more than 15 characters long, be entirely numeric, or contain the following characters**

# [Bicep](#tab/bicep)

The Bicep template generates the jump box name programmatically by using the prefix value provided to the template. To make sure the name doesn't exceed 15 characters or contain any invalid characters, use a prefix that's five or fewer characters and doesn't use the characters `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `=`, `+`, `_`, `[`, `]`, `{`, `}`, `\`, `|`, `;`, `:`, `.`, `'`, `"`, `,`, `<`, `>`, `/`, or `?`.

# [Terraform](#tab/terraform)

The Terraform template passes the jump box name by using the `dsvm_name` parameter. To avoid the error, use a name that's not greater than 15 characters and doesn't use the characters `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `=`, `+`, `_`, `[`, `]`, `{`, `}`, `\`, `|`, `;`, `:`, `.`, `'`, `"`, `,`, `<`, `>`, `/`, or `?`.

> [!IMPORTANT]
> The DSVM and any compute resources bill you for every hour that they run. To avoid excess charges, you should stop these resources when they're not in use. For more information, see the following articles:
> 
> - [Create/manage VMs (Linux)](/azure/virtual-machines/linux/tutorial-manage-vm).
> - [Create/manage VMs (Windows)](/azure/virtual-machines/windows/tutorial-manage-vm).
> - [Create compute instance](how-to-create-compute-instance.md).

## Next steps

:::moniker range="azureml-api-2"
To continue learning how to use the secured workspace from the DSVM, see [Tutorial: Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md).
:::moniker-end

To learn more about common secure workspace configurations and input/output requirements, see [Azure Machine Learning secure workspace traffic flow](concept-secure-network-traffic-flow.md).
