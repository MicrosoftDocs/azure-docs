---
title: Tutorial deploy into an existing virtual network using the Azure CLI - Azure Dedicated HSM | Microsoft Docs
description: Tutorial showing how to deploy a dedicated HSM using the CLI into an existing virtual network
services: dedicated-hsm
documentationcenter: na
author: msmbaldwin
manager: rkarlin
editor: ''

ms.service: key-vault
ms.topic: tutorial
ms.custom: "mvc, seodec18, devx-track-azurecli"
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/25/2021
ms.author: keithp
---

# Tutorial: Deploying HSMs into an existing virtual network using the Azure CLI

Azure Dedicated HSM provides a physical device for sole customer use, with complete administrative control and full management responsibility. The use of physical devices creates the need for Microsoft to control device allocation to ensure capacity is managed effectively. As a result, within an Azure subscription, the Dedicated HSM service will not normally be visible for resource provisioning. Any Azure customer requiring access to the Dedicated HSM service, must first contact their Microsoft account executive to request registration for the Dedicated HSM service. Only once this process completes successfully will provisioning be possible. 

This tutorial shows a typical provisioning process where:

- A customer has a virtual network already
- They have a virtual machine
- They need to add HSM resources into that existing environment.

A typical, high availability, multi-region deployment architecture may look as follows:

![multi region deployment](media/tutorial-deploy-hsm-cli/high-availability-architecture.png)

This tutorial focuses on a pair of HSMs and required ExpressRoute Gateway (see Subnet 1 above) being integrated into an existing virtual network (see VNET 1 above).  All other resources are standard Azure resources. The same integration process can be used for HSMs in subnet 4 on VNET 3 above.

## Prerequisites

Azure Dedicated HSM is not currently available in the Azure portal. All interaction with the service will be via command-line or using PowerShell. This tutorial will use the command-line (CLI) interface in the Azure Cloud Shell. If you are new to the Azure CLI, follow getting started instructions here: [Azure CLI 2.0 Get Started](/cli/azure/get-started-with-azure-cli).

Assumptions:

- You completed the Azure Dedicated HSM registration process
- You have been approved for use of the service. If not, contact your Microsoft account representative for details.
- You created a Resource Group for these resources and the new ones deployed in this tutorial will join that group.
- You already created the necessary virtual network, subnet, and virtual machines as per the diagram above and now want to integrate 2 HSMs into that deployment.

All instructions below assume that you have already navigated to the Azure portal and you have opened the Cloud Shell (select "\>\_" towards the top right of the portal).

## Provisioning a Dedicated HSM

Provisioning HSMs and integrating them into an existing virtual network via ExpressRoute Gateway will be validated using ssh. This validation helps ensure reachability and basic availability of the HSM device for any further configuration activities.

### Validating Feature Registration

As mentioned above, any provisioning activity requires that the Dedicated HSM service is registered for your subscription. To validate that, run the following commands in the Azure portal Cloud Shell.

```azurecli
az feature show \
   --namespace Microsoft.HardwareSecurityModules \
   --name AzureDedicatedHSM
```

The commands should return a status of "Registered" (as shown below). If the commands don't return "Registered" you need to register for this service by contacting your Microsoft account representative.

![subscription status](media/tutorial-deploy-hsm-cli/subscription-status.png)

### Creating HSM resources

Before you create HSM resources, there are some pre-requisite resources you need. You must have a virtual network with subnet ranges for compute, HSMs, and gateway. The following commands serve as an example of what would create such a virtual network.

```azurecli
az network vnet create \
  --name myHSM-vnet \
  --resource-group myRG \
  --address-prefix 10.2.0.0/16 \
  --subnet-name compute \
  --subnet-prefix 10.2.0.0/24
```

```azurecli
az network vnet subnet create \
  --vnet-name myHSM-vnet \
  --resource-group myRG \
  --name hsmsubnet \
  --address-prefixes 10.2.1.0/24 \
  --delegations Microsoft.HardwareSecurityModules/dedicatedHSMs
```

```azurecli
az network vnet subnet create \
  --vnet-name myHSM-vnet \
  --resource-group myRG \
  --name GatewaySubnet \
  --address-prefixes 10.2.255.0/26
```

>[!NOTE]
>The most important configuration to note for the virtual network, is that the subnet for the HSM device must have delegations set to "Microsoft.HardwareSecurityModules/dedicatedHSMs".  The HSM provisioning will not work without this option being set.

After you configure your network, use these Azure CLI commands to provision your HSMs.

1. Use the [az dedicated-hsm create](/cli/azure/dedicated-hsm#az_dedicated_hsm_create) command to provision the first HSM. The HSM is named hsm1. Substitute your subscription:

   ```azurecli
   az dedicated-hsm create --location westus --name hsm1 --resource-group myRG --network-profile-network-interfaces \
        /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Network/virtualNetworks/MyHSM-vnet/subnets/MyHSM-vnet
   ```

   This deployment should take approximately 25 to 30 minutes to complete with the bulk of that time being the HSM devices.

1. To see a current HSM, run the [az dedicated-hsm show](/cli/azure/dedicated-hsm#az_dedicated_hsm_show) command:

   ```azurecli
   az dedicated-hsm show --resource group myRG --name hsm1
   ```

1. Provision the second HSM by using this command:

   ```azurecli
   az dedicated-hsm create --location westus --name hsm2 --resource-group myRG --network-profile-network-interfaces \
        /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Network/virtualNetworks/MyHSM-vnet/subnets/MyHSM-vnet
   ```

1. Run the [az dedicated-hsm list](/cli/azure/dedicated-hsm#az_dedicated_hsm_list) command to view details about your current HSMs:

   ```azurecli
   az dedicated-hsm list --resource-group myRG
   ```

There are some other commands that might be useful. Use the [az dedicated-hsm update](/cli/azure/dedicated-hsm#az_dedicated_hsm_update) command to update an HSM:

```azurecli
az dedicated-hsm update --resource-group myRG –name hsm1
```

To delete an HSM, use the [az dedicated-hsm delete](/cli/azure/dedicated-hsm#az_dedicated_hsm_delete) command:

```azurecli
az dedicated-hsm delete --resource-group myRG –name hsm1
```

## Verifying the Deployment

To verify the devices have been provisioned and see device attributes, run the following command set. Ensure the resource group is set appropriately and the resource name is exactly as you have in the parameter file.

```azurecli
subid=$(az account show --query id --output tsv)
az resource show \
   --ids /subscriptions/$subid/resourceGroups/myRG/providers/Microsoft.HardwareSecurityModules/dedicatedHSMs/HSM1
az resource show \
   --ids /subscriptions/$subid/resourceGroups/myRG/providers/Microsoft.HardwareSecurityModules/dedicatedHSMs/HSM2
```

The output looks something like the following output:

```json
{
    "id": n/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/HSM-RG/providers/Microsoft.HardwareSecurityModules/dedicatedHSMs/HSMl",
    "identity": null,
    "kind": null,
    "location": "westus",
    "managedBy": null,
    "name": "HSM1",
    "plan": null,
    "properties": {
        "networkProfile": {
            "networkInterfaces": [
            {
            "id": n/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/HSM-RG/providers/Microsoft.Network/networkInterfaces/HSMl_HSMnic", "privatelpAddress": "10.0.2.5",
            "resourceGroup": "HSM-RG"
            }
            L
            "subnet": {
                "id": n/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/HSM-RG/providers/Microsoft.Network/virtualNetworks/demo-vnet/subnets/hsmsubnet", "resourceGroup": "HSM-RG"
            }
        },
        "provisioningState": "Succeeded",
        "stampld": "stampl",
        "statusMessage": "The Dedicated HSM device is provisioned successfully and ready to use."
    },
    "resourceGroup": "HSM-RG",
    "sku": {
        "capacity": null,
        "family": null,
        "model": null,
        "name": "SafeNet Luna Network HSM A790",
        "size": null,
        "tier": null
    },
    "tags": {
        "Environment": "prod",
        "resourceType": "Hsm"
    },
    "type": "Microsoft.HardwareSecurityModules/dedicatedHSMs"
}
```

You will also now be able to see the resources using the [Azure resource explorer](https://resources.azure.com/).   Once in the explorer, expand "subscriptions" on the left, expand your specific subscription for Dedicated HSM, expand "resource groups", expand the resource group you used and finally select the "resources" item.

## Testing the Deployment

Testing the deployment is a case of connecting to a virtual machine that can access the HSM(s) and then connecting directly to the HSM device. These actions will confirm the HSM is reachable.
The ssh tool is used to connect to the virtual machine. The command will be similar to the following but with the administrator name and dns name you specified in the parameter.

`ssh adminuser@hsmlinuxvm.westus.cloudapp.azure.com`

The IP Address of the VM could also be used in place of the DNS name in the above command. If the command is successful, it will prompt for a password and you should enter that. Once logged on to the virtual machine, you can sign in to the HSM using the private IP address found in the portal for the network interface resource associated with the HSM.

![components list](media/tutorial-deploy-hsm-cli/resources.png)

>[!NOTE]
>Notice the "Show hidden types" checkbox, which when selected will display HSM resources.

In the screenshot above, clicking the "HSM1_HSMnic" or "HSM2_HSMnic" would show the appropriate Private IP Address. Otherwise, the `az resource show` command used above is a way to identify the right IP Address. 

When you have the correct IP address, run the following command substituting that address:

`ssh tenantadmin@10.0.2.4`

If successful you will be prompted for a password. The default password is PASSWORD and the HSM will first ask you to change your password so set a strong password and use whatever mechanism your organization prefers to store the password and prevent loss.

>[!IMPORTANT]
>if you lose this password, the HSM will have to be reset and that means losing your keys.

When you are connected to the HSM using ssh, run the following command to ensure the HSM is operational.

`hsm show`

The output should look as shown on the image below:

![Screenshot shows output in PowerShell window.](media/tutorial-deploy-hsm-cli/hsm-show-output.png)

At this point, you have allocated all resources for a highly available, two HSM deployment and validated access and operational state. Any further configuration or testing involves more work with the HSM device itself. For this, you should follow the instructions in the Thales Luna 7 HSM Administration Guide chapter 7 to initialize the HSM and create partitions. All documentation and software are available directly from Thales for download once you are registered in the [Thales customer support portal](https://supportportal.thalesgroup.com/csm) and have a Customer ID. Download Client Software version 7.2 to get all required components.

## Delete or clean up resources

If you have finished with just the HSM device, then it can be deleted as a resource and returned to the free pool. The obvious concern when doing this is any sensitive customer data that is on the device. The best way to "zeroize" a device is to get the HSM admin password wrong 3 times (note: this is not appliance admin, it's the actual HSM admin). As a safety measure to protect key material, the device cannot be deleted as an Azure resource until it is in the zeroized state.

> [!NOTE]
> if you have issue with any Thales device configuration you should contact [Thales customer support](https://supportportal.thalesgroup.com/csm).

If you have finished with all resources in this resource group, then you can remove them all with the following command:

```azurecli
az group delete \
   --resource-group myRG \
   --name HSMdeploy \
   --verbose
```

## Next steps

After completing the steps in the tutorial, Dedicated HSM resources are provisioned and you have a virtual network with necessary HSMs and further network components to enable communication with the HSM.  You are now in a position to compliment this deployment with more resources as required by your preferred deployment architecture. For more information on helping plan your deployment, see the Concepts documents.
A design with two HSMs in a primary region addressing availability at the rack level, and two HSMs in a secondary region addressing regional availability is recommended. 

* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
* [Monitoring](monitoring.md)
