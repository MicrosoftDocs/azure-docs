---
title: Quickstart - Use Terraform to create a DPS instance
description: Learn how to deploy an Azure IoT Device Provisioning Service (DPS) resource with Terraform in this quickstart.
keywords: azure, devops, terraform, device provisioning service, DPS, IoT, IoT Hub DPS
ms.topic: quickstart
ms.date: 11/03/2022
ms.custom: devx-track-terraform
author: kgremban
ms.author: kgremban
ms.service: iot-dps
services: iot-dps
---

# Quickstart: Use Terraform to create an Azure IoT Device Provisioning Service

In this quickstart, you will learn how to deploy an Azure IoT Hub Device Provisioning Service (DPS) resource with a hashed allocation policy using Terraform.

This quickstart was tested with the following Terraform and Terraform provider versions:

- [Terraform v1.2.8](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.20.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[Terraform](https://www.terraform.io/) enables the definition, preview, and deployment of cloud infrastructure. Using Terraform, you create configuration files using HCL syntax. The [HCL syntax](https://www.terraform.io/language/syntax/configuration) allows you to specify the cloud provider - such as Azure - and the elements that make up your cloud infrastructure. After you create your configuration files, you create an execution plan that allows you to preview your infrastructure changes before they're deployed. Once you verify the changes, you apply the execution plan to deploy the infrastructure.

In this article, you learn how to:

- Create a Storage Account & Storage Container
- Create an Event Hubs, Namespace, & Authorization Rule
- Create an IoT Hub
- Link IoT Hub to Storage Account endpoint & Event Hubs endpoint
- Create an IoT Hub Shared Access Policy
- Create a DPS Resource
- Link DPS & IoT Hub

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](~/azure-dev-docs-pr/articles/includes/open-source-devops-prereqs-azure-subscription.md)]

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The example code in this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/). See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/developer/terraform/)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

   [!code-terraform[master](~/terraform_samples/quickstart/201-iot-hub-with-device-provisioning-service/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

   [!code-terraform[master](~/terraform_samples/quickstart/201-iot-hub-with-device-provisioning-service/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

   [!code-terraform[master](~/terraform_samples/quickstart/201-iot-hub-with-device-provisioning-service/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

   [!code-terraform[master](~/terraform_samples/quickstart/201-iot-hub-with-device-provisioning-service/outputs.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

#### [Bash](#tab/bash)

Run [az iot dps show](/cli/azure/iot/dps#az-iot-dps-show) to display the Azure DPS resource.

```azurecli
az iot dps show \
   --name <azurerm_iothub_dps_name> \
   --resource-group <resource_group_name>
```

**Key points:**

- The names of the resource group and the DPS instance display in the `terraform apply` output. You can also run [terraform output](https://www.terraform.io/cli/commands/output) to view these output values.

#### [Azure PowerShell](#tab/azure-powershell)

Run [Get-AzIoTDeviceProvisioningService](/powershell/module/az.deviceprovisioningservices/get-aziotdeviceprovisioningservice) to display the Azure DPS resource.

```powershell
Get-AzIoTDeviceProvisioningService `
      -ResourceGroupName <resource_group_name> `
      -Name <azurerm_iothub_dps_name>
```

**Key points:**

- The names of the resource group and the DPS instance display in the `terraform apply` output. You can also run [terraform output](https://www.terraform.io/cli/commands/output) to view these output values.

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

In this quickstart, you deployed an IoT hub and a Device Provisioning Service instance, and linked the two resources. To learn how to use this setup to provision a device, continue to the quickstart for creating a device.

> [!div class="nextstepaction"]
> [Quickstart: Provision a simulated symmetric key device](./quick-create-simulated-device-symm-key.md)
