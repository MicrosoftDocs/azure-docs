---
title: Update Terraform-managed Azure resource
description: Learn how to safely update Terraform-managed Azure resources to ensure the safety of your data.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.custom: devx-track-terraform
ms.topic: how-to
ms.date: 12/20/2023
ms.author: anfdocs
---
# Update Terraform-managed Azure resources outside of Terraform

Although it's not recommended that you modify Terraform-managed resources outside of Terraform due to the risk of data loss, certain features require that you do. Because of the risks, it's essential that you correctly update the resources using the steps outlined. 

Terraform-managed resources store their state in the `terraform.tfstate` located in either Terraform Cloud of the local Terraform module. The state contains all properties of the remote resource relevant to Terraform. When a Terraform-managed resource is modified outside of Terraform, the Terraform state does not match the remote resource's properties. In its attempt to resolve the mismatch, Terraform might destroy and recreate the remote resource, resulting in data loss.  

## Protect Terraform-managed resources with lifecycle 

To prevent data loss on any Azure resource that includes volatile resources, you should use the [`prevent_destroy` lifecycle argument](https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle#prevent_destroy) in the Terraform configuration file. For example:

```
resource "azure_netapp_volume" "example {
    lifecycle{
        prevent_destroy = true
    }

}
```

## Modify a Terraform-managed resource outside of Terraform

The following instructions are a high-level overview of the steps required to update a Terraform-managed resource outside of Terraform. 

1. Navigate to the Terraform module's configuration file. The extension for the configuration file is either `.tf` or `.tf.json`.
1. In the Terraform-managed volume's configuration file (`main.tf`), locate the lifecycle configuration block. Modify the block with `ignore_changes = <property>`, assigning the appropriate property value for the feature you're using. If no lifecycle configuration block exists, add it:
    ```
    lifecycle {
        ignore_changes = <property>
    }
    ```
1. Make the desired modification to the Azure NetApp Files volume. 
1. Run `terraform plan` to confirm that no changes will be made to your volume. The CLI output should display: `No changes. Your infrastructure matches the configuration.`
    >[!NOTE]
    > The `terraform plan` command creates a plan file with the changes to the remote resource, allowing you to ensure the safety of your resource before applying any changes. 
1. Run `terraform apply` to apply the changes. You should see the same CLI output as in the previous step. 

## Next steps 

* [Update Terraform-Managed Azure NetApp Files Volume Network Feature from Basic to Standard](configure-network-features.md#update-terraform-managed-azure-netapp-files-volume-from-basic-to-standard)
* [Populate Availability Zone for Terraform-Managed Azure NetApp Files Volume](manage-availability-zone-volume-placement.md#populate-availability-zone-for-terraform-managed-volumes)
* [Managing Azure NetApp Files preview features with Terraform Cloud and AzAPI Provider](https://techcommunity.microsoft.com/t5/azure-architecture-blog/managing-azure-netapp-files-preview-features-with-terraform/ba-p/3657714)
