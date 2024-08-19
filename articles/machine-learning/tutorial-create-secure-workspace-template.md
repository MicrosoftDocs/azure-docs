---
title: Use a template to create a secure workspace
titleSuffix: Azure Machine Learning
description: Use a template to create an Azure Machine Learning workspace and associated required Azure services inside a secure virtual network.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: enterprise-readiness
ms.custom: build-2023
ms.reviewer: None
ms.author: larryfr
author: Blackmist
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

To view either Bicep or Terraform information, select the Bicep or Terraform tabs in the following sections.

## Prerequisites

- An Azure subscription with a free or paid version of Azure Machine Learning. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

- Git installed on your development environment to clone the template repository. If you don't have the `git` command, you can install Git from [https://git-scm.com/](https://git-scm.com/).

- An Azure CLI or Azure PowerShell command line.

# [Bicep](#tab/bicep)

- Either the Azure CLI or Azure PowerShell Bicep command-line tools installed according to [Set up Bicep development and deployment environments](/azure/azure-resource-manager/bicep/install).

- The GitHub repo containing the Bicep template [Azure Machine Learning end-to-end secure setup](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure), cloned locally and switched to by running the following commands:

  ```bash
  git clone https://github.com/Azure/azure-quickstart-templates
  cd azure-quickstart-templates/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure
  ```  

# [Terraform](#tab/terraform)

- Terraform installed, configured, and authenticated to your Azure subscription by using the steps in one of the following articles:

  - [Azure Cloud Shell](/azure/developer/terraform/get-started-cloud-shell-bash)
  - [Windows with Bash](/azure/developer/terraform/get-started-windows-bash)
  - [Windows with Azure PowerShell](/azure/developer/terraform/get-started-windows-powershell)

- The GitHub repo containing the Terraform template [Azure Machine Learning workspace (moderately secure network set up)](https://github.com/Azure/terraform/tree/master/quickstart/201-machine-learning-moderately-secure), cloned locally and switched to by running the following commands:

  ```bash
  git clone https://github.com/Azure/terraform
  cd terraform/quickstart/201-machine-learning-moderately-secure
  ```

---
## Understand the template

# [Bicep](#tab/bicep)

The Bicep template is made up of the [main.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/main.bicep) and other *\*.bicep* files in the [modules](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules) subdirectory. The following table describes what each file is responsible for:

| File | Description |
| ----- | ----- |
| [main.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/main.bicep) | Passes parameters and variables to other modules in the *modules* subdirectory.|
| [vnet.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/vnet.bicep) | Defines the Azure virtual network and subnets. |
| [nsg.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/nsg.bicep) | Defines the network security group rules for the virtual network. |
| [bastion.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/bastion.bicep) | Defines the Azure Bastion host and subnet. Azure Bastion allows you to easily access a virtual machine (VM) inside the virtual network using your web browser. |
| [dsvmjumpbox.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/dsvmjumpbox.bicep) | Defines the DSVM. Azure Bastion is used to access this VM through your web browser. |
| [storage.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/storage.bicep) | Defines the Azure Storage account used by the workspace for default storage. |
| [keyvault.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/keyvault.bicep) | Defines the Azure Key Vault used by the workspace. |
| [containerregistry.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/containerregistry.bicep) | Defines the Azure Container Registry used by the workspace. |
| [applicationinsights.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/applicationinsights.bicep) | Defines the Azure Application Insights instance used by the workspace. |
| [machinelearningnetworking.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/machinelearningnetworking.bicep) | Defines the private endpoints and Domain Name System (DNS) zones for the workspace. |
| [machinelearning.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/machinelearning.bicep) | Defines the Azure Machine Learning workspace. |
| [machinelearningcompute.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/machinelearningcompute.bicep) | Defines an Azure Machine Learning compute cluster and compute instance. |
| [privateaks.bicep](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.machinelearningservices/machine-learning-end-to-end-secure/modules/privateaks.bicep) | Defines an AKS cluster instance. |

> [!IMPORTANT]
> Each Azure service has its own set of API versions. The example templates might not use the latest API versions for Azure Machine Learning and other resources. Before using the template, you should modify it to use the latest API versions.
> 
> For information on the API for a specific service, check the service information in the [Azure REST API reference](/rest/api/azure/). For information on the latest Azure Machine Learning API version, see the [Azure Machine Learning REST API](/rest/api/azureml/).
> 
> To update the API version, find the `Microsoft.MachineLearningServices/<resource>` entry for the resource type and update it to the latest version.

# [Terraform](#tab/terraform)

The Terraform template consists of multiple files. The following table describes what each file is responsible for:

| File | Description |
| ----- | ----- |
| [variables.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/variables.tf) | Defines variables and default values used by the template.
| [main.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/main.tf) | Specifies the Azure Resource Manager provider and defines the resource group. |
| [network.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/network.tf) | Defines the Azure virtual network, subnets, and network security groups (NSG). |
| [bastion.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/bastion.tf) | Defines the Azure Bastion host and associated NSG. Azure Bastion allows you to easily access a VM inside a virtual network by using your web browser. |
| [dsvm.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/dsvm.tf) | Defines the DSVM. Azure Bastion is used to access this VM through your web browser. |
| [workspace.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/workspace.tf) | Defines the Azure Machine Learning workspace, including dependent resources for Azure Storage, Key Vault, Application Insights, and Container Registry. |
| [compute.tf](https://github.com/Azure/terraform/blob/master/quickstart/201-machine-learning-moderately-secure/compute.tf) | Defines an Azure Machine Learning compute instance and cluster. |

> [!TIP]
> The [Terraform Azure provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) supports more arguments that this tutorial doesn't use. For example, the [environment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#environment) argument lets you target cloud regions such as Azure Government and Microsoft Azure operated by 21Vianet.

---

> [!IMPORTANT]
> The DSVM and Azure Bastion are easy ways to connect to the secured workspace for this tutorial. In a production environment, it's better to use an [Azure VPN gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways) or [Azure ExpressRoute](/azure/expressroute/expressroute-introduction) to access the resources inside the virtual network directly from your on-premises network.

## Configure the template

# [Bicep](#tab/bicep)

To deploy the Bicep template, make sure you're in the *machine-learning-end-to-end-secure* directory where the *main.bicep* file is located, and run the following commands:

1. To create a new Azure resource group, run the following example command, replacing `<myrgname>` with a resource group name and `<location>` with the Azure region you want to use.

    - Azure CLI:

      ```azurecli
      az group create --name <myrgname> --location <location>
      ```

    - Azure PowerShell:

      ```azurepowershell
      New-AzResourceGroup -Name <myrgname> -Location <location>
      ```

1. To deploy the template, use the following command, replacing `<myrgname>` with the name of the resource group you created, and `<pref>` with a unique prefix to use when creating required resources. Replace `<mydsvmpassword>` with a secure password for the DSVM jump box sign-in account, which is `azureadmin` in the following examples.

    > [!TIP]
    > The `prefix` must be five or fewer characters, and can't be entirely numeric or contain the characters `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `=`, `+`, `_`, `[`, `]`, `{`, `}`, `\`, `|`, `;`, `:`, `.`, `'`, `"`, `,`, `<`, `>`, `/`, or `?`.

    - Azure CLI:

      ```azurecli
      az deployment group create \
          --resource-group <myrgname> \
          --template-file main.bicep \
          --parameters \
          prefix=<pref> \
          dsvmJumpboxUsername=azureadmin \
          dsvmJumpboxPassword=<mydsvmpassword>
      ```

    - Azure PowerShell:

      ```azurepowershell
      $dsvmPassword = ConvertTo-SecureString "<mydsvmpassword>" -AsPlainText -Force
      New-AzResourceGroupDeployment -ResourceGroupName <myrgname> `
          -TemplateFile ./main.bicep `
          -prefix "<pref>" `
          -dsvmJumpboxUsername "azureadmin" `
          -dsvmJumpboxPassword $dsvmPassword
      ```

      > [!WARNING]
      > You should avoid using plain text strings in scripts or from the command line. The plain text can show up in event logs and command history. For more information, see [ConvertTo-SecureString](/powershell/module/microsoft.powershell.security/convertto-securestring).

# [Terraform](#tab/terraform)

To deploy the Terraform template, make sure you're in the *201-machine-learning-moderately-secure* directory where the template files are located, and run the following commands.

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

> [!IMPORTANT]
> The DSVM and any compute resources bill you for every hour that they run. To avoid excess charges, you should stop these resources when they're not in use. For more information, see the following articles:
> 
> - [Create/manage VMs (Linux)](/azure/virtual-machines/linux/tutorial-manage-vm).
> - [Create/manage VMs (Windows)](/azure/virtual-machines/windows/tutorial-manage-vm).
> - [Create compute instance](how-to-create-compute-instance.md).

## Connect to the workspace

After the deployment completes, use the following steps to connect to the DSVM:

1. From the [Azure portal](https://portal.azure.com), select the Azure resource group you used with the template. Then, select the DSVM that the template created. If you have trouble finding it, use the filters section to filter the **Type** to **virtual machine**.

    :::image type="content" source="./media/tutorial-create-secure-workspace-template/select-vm.png" alt-text="Screenshot of filtering and selecting the VM.":::

1. From the DSVM **Overview** page, select **Connect**, and then select **Connect via Bastion** from the dropdown list.

    :::image type="content" source="./media/tutorial-create-secure-workspace-template/connect-bastion.png" alt-text="Screenshot of selecting to connect using Bastion.":::

1. When prompted, provide the **Username** and **VM password** you specified when configuring the template, and then select **Connect**.

    > [!IMPORTANT]
    > The first time you connect to the DSVM desktop, a PowerShell window opens and runs a script. Allow the script to complete before continuing with the next step.

1. From the DSVM desktop, start **Microsoft Edge** and enter *https://ml.azure.com* as the address. Sign in to your Azure subscription, and then select the workspace the template created. The studio for your workspace appears.

## Troubleshooting

The following error can occur when the name for the DSVM jump box is greater than 15 characters or includes one of the following characters: `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `=`, `+`, `_`, `[`, `]`, `{`, `}`, `\`, `|`, `;`, `:`, `.`, `'`, `"`, `,`, `<`, `>`, `/`, or `?`.

**Error: Windows computer name cannot be more than 15 characters long, be entirely numeric, or contain the following characters ~ ! @ # $ % ^ & \* ( ) = + \_ [ ] { } \\ \| ; : . ' " , \< > / ?.**

# [Bicep](#tab/bicep)

The Bicep template generates the jump box name programmatically by using the prefix value provided to the template. To make sure the name doesn't exceed 15 characters or contain any invalid characters, use a prefix that's five or fewer characters and doesn't use the characters `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `=`, `+`, `_`, `[`, `]`, `{`, `}`, `\`, `|`, `;`, `:`, `.`, `'`, `"`, `,`, `<`, `>`, `/`, or `?`.

# [Terraform](#tab/terraform)

The Terraform template passes the jump box name by using the `dsvm_name` parameter. To avoid the error, use a name that's 15 characters or fewer and doesn't use the characters `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `=`, `+`, `_`, `[`, `]`, `{`, `}`, `\`, `|`, `;`, `:`, `.`, `'`, `"`, `,`, `<`, `>`, `/`, or `?`.

---

## Related content

To continue getting started with Azure Machine Learning, see [Quickstart: Get started with Azure Machine Learning](tutorial-azure-ml-in-a-day.md).

To learn more about common secure workspace configurations and input/output requirements, see [Azure Machine Learning secure workspace traffic flow](concept-secure-network-traffic-flow.md).
