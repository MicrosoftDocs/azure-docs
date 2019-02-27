---
title: Validate Hub Spoke network topology connectivity 
description: Tutorial to validate hub and spoke network topology with all virtual networks connected to one another. 
services: terraform
ms.service: terraform
keywords: terraform, hub and spoke, networks, hybrid networks, devops, virtual machine, azure,  vnet peering, 
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 2/11/2019
---

# Hub and spoke network validation 

This article is the final step of hub-spoke tutorial. Here we will execute all the terraform files created in the earlier steps and verify the connectivity between various virtual networks.

[!div class="checklist"]

> * Use HCL (HashiCorp Language) to implement the Hub VNet in hub-spoke topology
> * Use Terraform plan to verify the resources to be deployed
> * Use Terraform apply to create the resources in Azure
> * Verify the connectivity between different networks
> * Use Terraform to destroy all the resources

## Prerequisites

To implement this tutorial, complete the following articles in order

* [Prerequisites in the Introduction to Hub and Spoke topology article](./hub-spoke-introduction.md)
* [On Premises virtual network article](./on-prem.md)
* [Hub virtual network article](./hub-network.md)
* [Hub network virtual appliance article](./hub-nva.md)
* [Spoke networks article](./spoke-networks.md)

After completing the above prerequisites, you should have following config files.


1. Browse to the [Azure portal](http://portal.azure.com).

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview). If you didn't select an environment previously, select **Bash** as your environment.

    ![Cloud Shell prompt](./media/hub-spoke/azure-portal-cloud-shell-button-min.png)

1. Change directories to the `clouddrive` directory.

    ```bash
    cd clouddrive
    ```

1. Change directories to the new directory:

    ```bash
    cd hub-spoke
    ```

   ![Hub spoke Terraform config files](./media/hub-spoke/hub-spoke-config-files.jpg
)

## Deploying the resources

### Initialize

In this step, we will initialize the Terraform Azure Resource Manager provider using the following steps.
    
```bash
    terraform init
```

![Terraform init](./media/hub-spoke/hub-spoke-terraform-init.jpg)


### Plan

One of the benefits of Terraform is to visualize all the deployment actions before execution. The following steps explain the terraform plan command.

```bash
    terraform plan
```

![Terraform plan](./media/hub-spoke/hub-spoke-terraform-plan.jpg)

### Apply

The final step of the deployment is the apply command. 

```bash
    terraform apply
```


Type **yes** when prompted.

![0](./media/hub-spoke/hub-spoke-terraform-apply.jpg)

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

## Troubleshooting

To trouble shoot a hybrid azure network please follow the troubleshooting tips in this [Troubleshoot a hybrid VPN connection](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/troubleshoot-vpn) article.


## Next steps
In this tutorial, you learned how to use Terraform to lay out an entire hybrid network architecture by using various azure resources. Here are some additional resources to help you learn more about Terraform on Azure.
 
 > [!div class="nextstepaction"] 
 > [Terraform Hub in Microsoft.com](https://docs.microsoft.com/azure/terraform/)