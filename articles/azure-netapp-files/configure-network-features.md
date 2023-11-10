---
title: Configure network features for an Azure NetApp Files volume | Microsoft Docs
description: Describes the options for network features and how to configure the Network Features option for a volume. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 11/07/2023
ms.custom: references_regions
ms.author: anfdocs
---
# Configure network features for an Azure NetApp Files volume

The **Network Features** functionality enables you to indicate whether you want to use VNet features for an Azure NetApp Files volume. With this functionality, you can set the option to ***Standard*** or ***Basic***. You can specify the setting when you create a new NFS, SMB, or dual-protocol volume. You can also modify the network features option on existing volumes. See [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md) for details about network features.

This article helps you understand the options and shows you how to configure network features.

The **Network Features** functionality isn't available in Azure Government regions. See [supported regions](azure-netapp-files-network-topologies.md#supported-regions) for a full list. 

## Options for network features 

Two settings are available for network features: 

* ***Standard***  
    This setting enables VNet features for the volume.  

    If you need higher IP limits or VNet features such as [network security groups](../virtual-network/network-security-groups-overview.md), [user-defined routes](../virtual-network/virtual-networks-udr-overview.md#user-defined), or additional connectivity patterns, you should set **Network Features** to *Standard*.

* ***Basic***  
    This setting provides reduced IP limits (<1000) and no additional VNet features for the volumes.

    You should set **Network Features** to *Basic* if you don't require VNet features.  

## Considerations

* Regardless of the network features option you set (*Standard* or *Basic*), an Azure VNet can only have one subnet delegated to Azure NetApp files. See [Delegate a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md#considerations). 
 
* You can create or modify volumes with the Standard network features only if the corresponding [Azure region supports the Standard volume capability](azure-netapp-files-network-topologies.md#supported-regions). 

    * If the Standard volume capability is supported for the region, the Network Features field of the Create a Volume page defaults to *Standard*. You can change this setting to *Basic*. 
    * If the Standard volume capability isn't available for the region, the Network Features field of the Create a Volume page defaults to *Basic*, and you can't modify the setting.

* The ability to locate storage compatible with the desired type of network features depends on the VNet specified. If you can't create a volume because of insufficient resources, you can try a different VNet for which compatible storage is available.

* You can create Basic volumes from Basic volume snapshots and Standard volumes from Standard volume snapshots. Creating a Basic volume from a Standard volume snapshot isn't supported. Creating a Standard volume from a Basic volume snapshot isn't supported.

* When you restore a backup to a new volume, you can configure the new volume with Basic or Standard network features.

* When you change the network features option of existing volumes from Basic to Standard network features, access to existing Basic networking volumes might be lost if your UDR or NSG implementations prevent the Basic networking volumes from connecting to DNS and domain controllers. You might also lose the ability to update information, such as the site name, in the Active Directory connector if all volumes can’t communicate with DNS and domain controllers. For guidance about UDRs and NSGs, see [Configure network features for an Azure NetApp Files volume](azure-netapp-files-network-topologies.md#udrs-and-nsgs).

>[!NOTE]
> The networking features of the DP volume will not be affected by changing the source volume from basic to standard network features.

## <a name="set-the-network-features-option"></a>Set network features option during volume creation

This section shows you how to set the network features option when you create a new volume. 

1. During the process of creating a new [NFS](azure-netapp-files-create-volumes.md), [SMB](azure-netapp-files-create-volumes-smb.md), or [dual-protocol](create-volumes-dual-protocol.md) volume, you can set the **Network Features** option to **Basic** or **Standard** under the Basic tab of the Create a Volume screen.

    The following screenshot shows a volume creation example for a region that supports the Standard network features capabilities: 

    ![Screenshot that shows volume creation for Standard network features.](../media/azure-netapp-files/network-features-create-standard.png)

    The following screenshot shows a volume creation example for a region that does *not* support the Standard network features capabilities: 

    ![Screenshot that shows volume creation for Basic network features.](../media/azure-netapp-files/network-features-create-basic.png)

2. Before completing the volume creation process, you can display the specified network features setting in the **Review + Create** tab of the Create a Volume screen. Select **Create** to complete the volume creation.

    ![Screenshot that shows the Review and Create tab of volume creation.](../media/azure-netapp-files/network-features-review-create-tab.png)

3. You can select **Volumes** to display the network features setting for each volume:

    [ ![Screenshot that shows the Volumes page displaying the network features setting.](../media/azure-netapp-files/network-features-volume-list.png)](../media/azure-netapp-files/network-features-volume-list.png#lightbox)

## Edit network features option for existing volumes

You can edit the network features option of existing volumes from *Basic* to *Standard* network features. The change you make applies to all volumes in the same *network sibling set* (or *siblings*). Siblings are determined by their network IP address relationship. They share the same network interface card (NIC) for mounting the volume to the client or connecting to the SMB share of the volume. At the creation of a volume, its siblings are determined by a placement algorithm that aims for reusing the IP address where possible.

>[!IMPORTANT]
>It's not recommended that you use the edit network features option with Terraform-managed volumes due to risks. You must follow separate instructions if you use Terraform-managed volumes. For more information see, [Update Terraform-managed Azure NetApp Files volume from Basic to Standard](#update-terraform-managed-azure-netapp-files-volume-from-basic-to-standard).

You can also revert the option from *Standard* back to *Basic* network features, but considerations apply and require careful planning. For example, you might need to change configurations for Network Security Groups (NSGs), user-defined routes (UDRs), and IP limits if you revert. See [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md#constraints) for constraints and supported network topologies about Standard and Basic network features.

See [regions supported for this feature](azure-netapp-files-network-topologies.md#regions-edit-network-features).

This feature currently doesn't support SDK.

> [!IMPORTANT]
> The option to edit network features is currently in preview. You need to submit a waitlist request for accessing the feature through the **[Azure NetApp Files standard networking features (edit volumes) Public Preview Request Form](https://aka.ms/anfeditnetworkfeaturespreview)**. This feature is expected to be enabled within a week after you submit the waitlist request. You can check the status of feature registration by using the following command: 
>
> ```azurepowershell-interactive
> Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFBasicToStdNetworkFeaturesUpgrade                                                      
> 
> FeatureName                         ProviderName     RegistrationState   
> -----------                         ------------     -----------------   
> ANFBasicToStdNetworkFeaturesUpgrade Microsoft.NetApp Registered
> ```

> [!IMPORTANT]
> Updating the network features option might cause a network disruption on the volumes for up to 5 minutes. 

1. Navigate to the volume for which you want to change the network features option. 
1. Select **Change network features**. 
1. The **Edit network features** window displays the volumes that are in the same network sibling set. Confirm whether you want to modify the network features option. 

    :::image type="content" source="../media/azure-netapp-files/edit-network-features.png" alt-text="Screenshot showing the Edit Network Features window." lightbox="../media/azure-netapp-files/edit-network-features.png":::

### Update Terraform-managed Azure NetApp Files volume from Basic to Standard 

If your Azure NetApp Files volume is managed using Terraform, editing the network features requires additional steps. Terraform-managed Azure resources store their state in a local file, which is in your Terraform module or in Terraform Cloud. 

Updating the network features of your volume alters the underlying network sibling set of the NIC utilized by that volume. This NIC can be utilized by other volumes you own, and other NICs can share the same network sibling set. **If not performed correctly, updating the network features of one Terraform-managed volume can inadvertently update the network features of several other volumes.**

>[!IMPORTANT]
>A discontinuity between state data and remote Azure resource configurations--notably, in the `network_features` argument--can result in the destruction of one or more volumes and possible data loss upon running `terraform apply`. Carefully follow the workaround outlined here to safely update the network features from Basic to Standard of Terraform-managed volumes. 

>[!NOTE]
>A Terraform module usually consists solely of all top level `*.tf` and/or `*.tf.json` configuration files in a directory, but a Terraform module can make use of module calls to explicitly include other modules into the configuration. You can [learn more about possible module structures](https://developer.hashicorp.com/terraform/language/files). To update all configuration file in your module that reference Azure NetApp Files volumes, be sure to look at all possible sources where your module can reference configuration files.

The name of the state file in your Terraform module is `terraform.tfstate`. It contains the arguments and their values of all deployed resources in the module. Below is highlighted the `network_features` argument with value “Basic” for an Azure NetApp Files Volume in a `terraform.tfstate` example file:

:::image type="content" source="../media/azure-netapp-files/terraform-module.png" alt-text="Screenshot of Terraform module." lightbox="../media/azure-netapp-files/terraform-module.png":::

Do _not_ manually update the `terraform.tfstate` file. Likewise, the `network_features` argument in the `*.tf` and `*.tf.json` configuration files should also not be updated until you follow the steps outlined here as this would cause a mismatch in the arguments of the remote volume and the local configuration file representing that remote volume. When Terraform detects a mismatch between the arguments of remote resources and local configuration files representing those remote resources, Terraform can destroy the remote resources and reprovision them with the arguments in the local configuration files. This can cause data loss in a volume.

By following the steps outlined here, the `network_features` argument in the `terraform.tfstate` file is automatically updated by Terraform to have the value of "Standard" without destroying the remote volume, thus indicating the network features has been successfully updated to Standard.

>[!NOTE]
> It's recommended to always use the latest Terraform version and the latest version of the `azurerm` Terraform module.

#### Determine affected volumes 

Changing the network features for an Azure NetApp Files Volume can impact the network features of other Azure NetApp Files Volumes. Volumes in the same network sibling set must have the same network features setting. Therefore, before you change the network features of one volume, you must determine all volumes affected by the change using the Azure portal.

1. Log in to the Azure portal. 
1. Navigate to the volume for which you want to change the network features option.
1. Select the **Change network features**. ***Do **not** select Save.***
1. Record the paths of the affected volumes then select **Cancel**. 

:::image type="content" source="../media/azure-netapp-files/affected-volumes-network-features.png" alt-text="Screenshot of volumes affected by change network features." lightbox="../media/azure-netapp-files/affected-volumes-network-features.png":::

All Terraform configuration files that define these volumes need to be updated, meaning you need to find the Terraform configuration files that define these volumes. The configuration files representing the affected volumes might not be in the same Terraform module.

>[!IMPORTANT]
>With the exception of the single volume you know is managed by Terraform, additional affected volumes might not be managed by Terraform. An additional volume that is listed as being in the same network sibling set does not mean that this additional volume is managed by Terraform.

#### Modify the affected volumes’ configuration files

You must modify the configuration files for each affected volume managed by Terraform that you discovered. Failing to update the configuration file can destroy the volume or result in data loss. 

>[!IMPORTANT]
>Depending on your volume’s lifecycle configuration block settings in your Terraform configuration file, your volume can be destroyed, including possible data loss upon running `terraform apply`. Ensure you know which affected volumes are managed by Terraform and which are not.

1. Locate the affected Terraform-managed volumes configuration files.
1. Add the `ignore_changes = [network_features]` to the volume's `lifecycle` configuration block. If the `lifecycle` block does not exist in that volume’s configuration, add it.

    :::image type="content" source="../media/azure-netapp-files/terraform-lifecycle.png" alt-text="Screenshot of the lifecycle configuration." lightbox="../media/azure-netapp-files/terraform-lifecycle.png":::

1. Repeat for each affected Terraform-managed volume. 
 
The `ignore_changes` feature is intended to be used when a resource’s reference to data might change after the resource is created. Adding the `ignore_changes` feature to the `lifecycle` block allows the network features of the volumes to be changed in the Azure portal without Terraform trying to fix this argument of the volume on the next run of `terraform apply`. You can [learn more about the `ignore_changes` feature](https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle). 

#### Update the volumes' network features

1. In the Azure portal, navigate to the Azure NetApp Files volume for which you want to change network features. 
1. Select the **Change network features**.
1. In the **Action** field, confirm that it reads **Change to Standard**.

    :::image type="content" source="../media/azure-netapp-files/change-network-features-standard.png" alt-text="Screenshot of confirm change of network features." lightbox="../media/azure-netapp-files/change-network-features-standard.png":::

1. Select **Save**. 
1. Wait until you receive a notification that the network features update has completed. In your **Notifications**, the message reads "Successfully updated network features. Network features for network sibling set have successfully updated to ‘Standard’."
1. In the terminal, run `terraform plan` to view any potential changes. The output should indicate that the infrastructure matches the configuration with a message reading "No changes. Your infrastructure matches the configuration."

    :::image type="content" source="../media/azure-netapp-files/terraform-plan-output.png" alt-text="Screenshot of terraform plan command output." lightbox="../media/azure-netapp-files/terraform-plan-output.png":::

    >[!IMPORTANT]
    > As a safety precaution, execute `terraform plan` before executing `terraform apply`. The command `terraform plan` allows you to create a “plan” file, which contains the changes to your remote resources. This plan allows you to know if any of your affected volumes will be destroyed by running `terraform apply`.

1. Run `terraform apply` to update the `terraform.tfstate` file.

    Repeat for all modules containing affected volumes.

    Observe the change in the value of the `network_features` argument in the `terraform.tfstate` files, which changed from "Basic" to "Standard":

    :::image type="content" source="../media/azure-netapp-files/updated-terraform-module.png" alt-text="Screenshot of updated Terraform module." lightbox="../media/azure-netapp-files/updated-terraform-module.png":::

#### Update Terraform-managed Azure NetApp Files volumes’ configuration file for configuration parity

Once you've update the volumes' network features, you must also modify the `network_features` arguments and `lifecycle blocks` in all configuration files of affected Terraform-managed volumes. This update ensures that if you have to recreate or update the volume, it maintains its Standard network features setting. 

1. In the configuration file, set `network_features` to "Standard" and remove the `ignore_changes = [network_features]` line from the `lifecycle` block. 

    :::image type="content" source="../media/azure-netapp-files/terraform-network-features-standard.png" alt-text="Screenshot of Terraform module with Standard network features." lightbox="../media/azure-netapp-files/terraform-network-features-standard.png":::

1. Repeat for each affected Terraform-managed volume. 
1. Verify that the updated configuration files accurately represent the configuration of the remote resources by running `terraform plan`. Confirm the output reads "No changes."
1. Run `terraform apply` to complete the update. 

## Next steps  

* [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md)
* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md) 
* [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md) 
* [Configure Virtual WAN for Azure NetApp Files](configure-virtual-wan.md)
