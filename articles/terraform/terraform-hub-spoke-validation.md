---
title: Validate a hub and spoke network with Terraform in Azure
description: Tutorial to validate hub and spoke network topology with all virtual networks connected to one another. 
services: terraform
ms.service: terraform
keywords: terraform, hub and spoke, networks, hybrid networks, devops, virtual machine, azure,  vnet peering, 
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 2/28/2019
---

# Tutorial: Validate a hub and spoke network with Terraform in Azure

This article is the final step of hub-spoke tutorial. Here we will execute all the terraform files created in the earlier steps and verify the connectivity between various virtual networks.

[!div class="checklist"]

> * Use HCL (HashiCorp Language) to implement the Hub VNet in hub-spoke topology
> * Use Terraform plan to verify the resources to be deployed
> * Use Terraform apply to create the resources in Azure
> * Verify the connectivity between different networks
> * Use Terraform to destroy all the resources

## Prerequisites

- [Create a hub and spoke hybrid network topology with Terraform in Azure](./terraform-hub-spoke-introduction.md).
- [Create on-premises virtual network with Terraform in Azure](./terraform-hub-spoke-on-prem.md).
- [Create a hub virtual network with Terraform in Azure](./terraform-hub-spoke-hub-network.md).
- [Create a hub virtual network appliance with Terraform in Azure](./terraform-hub-spoke-hub-nva.md).
- [Create a spoke virtual networks with Terraform in Azure](./terraform-hub-spoke-spoke-network.md).

## Verify your configuration

After completing the [prerequisites][#prerequisites], verify that the appropriate config files are present.

1. Browse to the [Azure portal](http://portal.azure.com).

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview). If you didn't select an environment previously, select **Bash** as your environment.

    ![Cloud Shell prompt](./media/terraform-common/azure-portal-cloud-shell-button-min.png)

1. Change directories to the `clouddrive` directory.

    ```bash
    cd clouddrive
    ```

1. Change directories to the new directory:

    ```bash
    cd hub-spoke
    ```

   ![Terraform demo config files](./media/terraform-hub-and-spoke-tutorial-series/hub-spoke-config-files.jpg)

## Deploying the resources

### Initialize

In this step, we will initialize the Terraform Azure Resource Manager provider using the following steps.
    
```bash
    terraform init
```

![Example resuults of "terraform init" command](./media/terraform-hub-and-spoke-tutorial-series/hub-spoke-terraform-init.jpg)


### Plan

One of the benefits of Terraform is to visualize all the deployment actions before execution. The following steps explain the terraform plan command.

```bash
    terraform plan
```

![Example results of "terraform plan" command](./media/terraform-hub-and-spoke-tutorial-series/hub-spoke-terraform-plan.jpg)

### Apply

The final step of the deployment is the apply command. 

```bash
    terraform apply
```


Type **yes** when prompted.

![Example results of "terraform apply" command](./media/terraform-hub-and-spoke-tutorial-series/hub-spoke-terraform-apply.jpg)

The above command should complete and deploy all the resources for the hub-spoke network.

## Validation


### Test connectivity to the hub VNet &mdash; Linux deployment

To test conectivity from the simulated on-premises environment to the hub VNet using Linux VMs, follow these steps:

1. Use the Azure portal to find the VM named `onprem-vm` in the `onprem-vnet-rg` resource group.

2. Click `Connect` and copy the `ssh` command shown in the portal.

3. From a Linux prompt, run `ssh` to connect to the simulated on-premises environment. Use the password that you specified in the `on-prem.tf` parameter file.

4. Use the `ping` command to test connectivity to the jumpbox VM in the hub VNet:

   ```shell
   ping 10.0.0.68
   ```

### Test connectivity to the spoke VNets &mdash; Linux deployment

To test conectivity from the simulated on-premises environment to the spoke VNets using Linux VMs, perform the following steps:

1. Use the Azure portal to find the VM named `onprem-vm` in the `onprem-vnet-rg` resource group.

2. Click `Connect` and copy the `ssh` command shown in the portal.

3. From a Linux prompt, run `ssh` to connect to the simulated on-premises environment. Use the password that you specified in the `on-prem.tf` parameter file.

4. Use the `ping` command to test connectivity to the jumpbox VMs in each spoke:

   ```bash
   ping 10.1.0.68
   ping 10.2.0.68
   ```

## How to troubleshoot issues

To troubleshoot a hybrid azure network please follow the troubleshooting tips in this [Troubleshoot a hybrid VPN connection](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/troubleshoot-vpn) article.


## Next steps

> [!div class="nextstepaction"] 
> [Terraform in Azure](/azure/terraform/)