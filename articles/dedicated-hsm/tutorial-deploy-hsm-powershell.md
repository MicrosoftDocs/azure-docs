---
title: Tutorial deploys into an existing virtual network using PowerShell - Azure Dedicated HSM | Microsoft Docs
description: Tutorial showing how to deploy a dedicated HSM using PowerShell into an existing virtual network
services: dedicated-hsm
documentationcenter: na
author: msmbaldwin
manager: rkarlin
editor: ''

ms.service: key-vault
ms.topic: tutorial
ms.custom: "mvc, seodec18, devx-track-azurepowershell"
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/25/2021
ms.author: keithp
---

# Tutorial – Deploying HSMs into an existing virtual network using PowerShell

The Azure Dedicated HSM Service provides a physical device for sole customer use, with complete administrative control and full management responsibility. Due to providing physical hardware, Microsoft must control how those devices are allocated to ensure capacity is managed effectively. As a result, within an Azure subscription, the Dedicated HSM service won't normally be visible for resource provisioning. Any Azure customer requiring access to the Dedicated HSM service, must first contact their Microsoft account executive to request registration for the Dedicated HSM service. Only once this process completes successfully will provisioning be possible.
This tutorial aims to show a typical provisioning process where:

- A customer has a virtual network already
- They have a virtual machine
- They need to add HSM resources into that existing environment.

A typical, high availability, multi-region deployment architecture may look as follows:

![multi region deployment](media/tutorial-deploy-hsm-powershell/high-availability.png)

This tutorial focuses on a pair of HSMs and the required [ExpressRoute gateway](../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md) (see Subnet 1 above) being integrated into an existing virtual network (see VNET 1 above).  All other resources are standard Azure resources. The same integration process can be used for HSMs in subnet 4 on VNET 3 above.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

Azure Dedicated HSM is not currently available in the Azure portal, therefore all interaction with the service will be via command-line or using PowerShell. This tutorial will use PowerShell in the Azure Cloud Shell. If you're new to PowerShell, follow getting started instructions here: [Azure PowerShell Get Started](/powershell/azure/get-started-azureps).

Assumptions:

- You have an assigned Microsoft Account Manager and meet the monetary requirement of five million ($5M) USD or greater in overall committed Azure revenue annually to qualify for onboarding and use of Azure Dedicated HSM.
- You have been through the Azure Dedicated HSM registration process and been approved for use of the service. If not, then contact your Microsoft account representative for details. 
- You have created a Resource Group for these resources and the new ones deployed in this tutorial will join that group.
- You have already created the necessary virtual network, subnet, and virtual machines as per the diagram above and now want to integrate 2 HSMs into that deployment.

All instructions below assume that you've already navigated to the Azure portal and you've opened the Cloud Shell (select “\>\_” towards the top right of the portal).

## Provisioning a Dedicated HSM

Provisioning the HSMs and integrating into an existing virtual network via [ExpressRoute gateway](../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md) will be validated using the ssh command-line tool to ensure reachability and basic availability of the HSM device for any further configuration activities. The following commands will use a Resource Manager template to create the HSM resources and associated networking resources.

### Validating Feature Registration

As mentioned above, any provisioning activity requires that the Dedicated HSM service is registered for your subscription. To validate that, run the following PowerShell command in the Azure portal Cloud Shell. 

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.HardwareSecurityModules -FeatureName AzureDedicatedHsm
```

The command should return a status of “Registered” (as shown below) before you proceed any further.  If you're not registered for this service, please contact your Microsoft account representative.

![subscription status](media/tutorial-deploy-hsm-powershell/subscription-status.png)

### Creating HSM resources

An HSM device is provisioned into a customers’ virtual network. This implies the requirement for a subnet. A dependency for the HSM to enable communication between the virtual network and physical device is an [ExpressRoute gateway](../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md), and finally a virtual machine is required to access the HSM device using the Thales client software. These resources have been collected into a template file, with corresponding parameter file, for ease of use. The files are available by contacting Microsoft directly at HSMrequest@Microsoft.com.

Once you have the files, you must edit the parameter file to insert your preferred names for resources. This means editing lines with “value”: “”.

- `namingInfix` Prefix for names of HSM resources
- `ExistingVirtualNetworkName` Name of the virtual network used for the HSMs
- `DedicatedHsmResourceName1` Name of HSM resource in datacenter stamp 1
- `DedicatedHsmResourceName2` Name of HSM resource in datacenter stamp 2
- `hsmSubnetRange` Subnet IP Address range for HSMs
- `ERSubnetRange` Subnet IP Address range for VNET gateway

An example of these changes is as follows:

```json
{
"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "namingInfix": {
      "value": "MyHSM"
    },
    "ExistingVirtualNetworkName": {
      "value": "MyHSM-vnet"
    },
    "DedicatedHsmResourceName1": {
      "value": "HSM1"
    },
    "DedicatedHsmResourceName2": {
      "value": "HSM2"
    },
    "hsmSubnetRange": {
      "value": "10.0.2.0/24"
    },
    "ERSubnetRange": {
      "value": "10.0.255.0/26"
    },
  }
}
```

The associated Resource Manager template file will create six resources with this information:

- A subnet for the HSMs in the specified VNET
- A subnet for the virtual network gateway 
- A virtual network gateway that connects the VNET to the HSM devices
- A public IP address for the gateway
- An HSM in stamp 1
- An HSM in stamp 2

Once parameter values are set, the files need to be uploaded to Azure portal Cloud Shell file share for use. In the Azure portal, click the “\>\_” Cloud Shell symbol top right and this will make the bottom portion of the screen a command environment. The options for this are BASH and PowerShell and you should select BASH if not already set.

The command shell has an upload/download option on the toolbar and you should select this to upload the template and parameter files to your file share:

![file share](media/tutorial-deploy-hsm-powershell/file-share.png)

Once the files are uploaded, you're ready to create resources.
Prior to creating new HSM resources there are some pre-requisite resources you should ensure are in place. You must have a virtual network with subnet ranges for compute, HSMs, and gateway. The following commands serve as an example of what would create such a virtual network.

```powershell
$compute = New-AzVirtualNetworkSubnetConfig `
  -Name compute `
  -AddressPrefix 10.2.0.0/24
```

```powershell
$delegation = New-AzDelegation `
  -Name "myDelegation" `
  -ServiceName "Microsoft.HardwareSecurityModules/dedicatedHSMs"

```

```powershell
$hsmsubnet = New-AzVirtualNetworkSubnetConfig ` 
  -Name hsmsubnet ` 
  -AddressPrefix 10.2.1.0/24 ` 
  -Delegation $delegation 

```

```powershell

$gwsubnet= New-AzVirtualNetworkSubnetConfig `
  -Name GatewaySubnet `
  -AddressPrefix 10.2.255.0/26

```

```powershell

New-AzVirtualNetwork `
  -Name myHSM-vnet `
  -ResourceGroupName myRG `
  -Location westus `
  -AddressPrefix 10.2.0.0/16 `
  -Subnet $compute, $hsmsubnet, $gwsubnet

```

>[!NOTE]
>The most important configuration to note for the virtual network, is that the subnet for the HSM device must have delegations set to “Microsoft.HardwareSecurityModules/dedicatedHSMs”.  The HSM provisioning will not work without this.

Once all pre-requisites are in place, run the following command to use the Resource Manager template ensuring you have updated values with your unique names (at least the resource group name):

```powershell

New-AzResourceGroupDeployment -ResourceGroupName myRG `
     -TemplateFile .\Deploy-2HSM-toVNET-Template.json `
     -TemplateParameterFile .\Deploy-2HSM-toVNET-Params.json `
     -Name HSMdeploy -Verbose

```

This command should take approximately 20 minutes to complete. The “-verbose” option used will ensure status is continually displayed.

![provisioning status](media/tutorial-deploy-hsm-powershell/progress-status.png)

When completed successfully, shown by “provisioningState”: “Succeeded”, you can sign in to your existing virtual machine and use SSH to ensure availability of the HSM device.

## Verifying the Deployment

To verify the devices have been provisioned and see device attributes, run the following command set. Ensure the resource group is set appropriately and the resource name is exactly as you have in the parameter file.

```powershell

$subid = (Get-AzContext).Subscription.Id
$resourceGroupName = "myRG"
$resourceName = "HSM1"  
Get-AzResource -Resourceid /subscriptions/$subId/resourceGroups/$resourceGroupName/providers/Microsoft.HardwareSecurityModules/dedicatedHSMs/$resourceName

```

![provision status](media/tutorial-deploy-hsm-powershell/progress-status2.png)

You'll also now be able to see the resources using the [Azure resource explorer](https://resources.azure.com/).   Once in the explorer, expand “subscriptions” on the left, expand your specific subscription for Dedicated HSM, expand “resource groups”, expand the resource group you used and finally select the “resources” item.

## Testing the Deployment

Testing the deployment is a case of connecting to a virtual machine that can access the HSM(s) and then connecting directly to the HSM device. These actions will confirm the HSM is reachable.
The ssh tool is used to connect to the virtual machine. The command will be similar to the following but with the administrator name and dns name you specified in the parameter.

`ssh adminuser@hsmlinuxvm.westus.cloudapp.azure.com`

The password to use is the one from the parameter file.
Once logged on to the Linux VM you can log in to the HSM using the private IP address found in the portal for the resource \<prefix>hsm_vnic.

```powershell

(Get-AzResource -ResourceGroupName myRG -Name HSMdeploy -ExpandProperties).Properties.networkProfile.networkInterfaces.privateIpAddress

```
When you have the IP address, run the following command:

`ssh tenantadmin@<ip address of HSM>`

If successful you'll be prompted for a password. The default password is PASSWORD. The HSM will ask you to change your password so set a strong password and use whatever mechanism your organization prefers to store the password and prevent loss.  

>[!IMPORTANT]
>if you lose this password, the HSM will have to be reset and that means losing your keys.

When you're connected to the HSM device using ssh, run the following command to ensure the HSM is operational.

`hsm show`

The output should look like the image shown below:

![Screenshot that shows the output from the hsm show command.](media/tutorial-deploy-hsm-powershell/output.png)

At this point, you've allocated all resources for a highly available, two HSM deployment and validated access and operational state. Any further configuration or testing involves more work with the HSM device itself. For this, you should follow the instructions in the Thales Luna 7 HSM Administration Guide chapter 7 to initialize the HSM and create partitions. All documentation and software are available directly from Thales for download once you're registered in the [Thales customer support portal](https://supportportal.thalesgroup.com/csm) and have a Customer ID. Download Client Software version 7.2 to get all required components.

## Delete or clean up resources

If you've finished with just the HSM device, then it can be deleted as a resource and returned to the free pool. The obvious concern when doing this is any sensitive customer data that is on the device. The best way to "zeroize" a device is to get the HSM admin password wrong three times (note: this is not appliance admin, it's the actual HSM admin). As a safety measure to protect key material, the device can't be deleted as an Azure resource until it is in the zeroized state.

> [!NOTE]
> if you have issue with any Thales device configuration you should contact [Thales customer support](https://supportportal.thalesgroup.com/csm).

If you want to remove the HSM resource in Azure, you can use the following command replacing the "$" variables with your unique parameters:

```powershell

$subid = (Get-AzContext).Subscription.Id
$resourceGroupName = "myRG" 
$resourceName = "HSMdeploy"  
Remove-AzResource -Resourceid /subscriptions/$subId/resourceGroups/$resourceGroupName/providers/Microsoft.HardwareSecurityModules/dedicatedHSMs/$resourceName 

```

## Next steps

After completing the steps in the tutorial, Dedicated HSM resources are provisioned and available in your virtual network. You're now in a position to complement this deployment with more resources as required by your preferred deployment architecture. For more information on helping plan your deployment, see the Concepts documents. A design with two HSMs in a primary region addressing availability at the rack level, and two HSMs in a secondary region addressing regional availability is recommended. The template file used in this tutorial can easily be used as a basis for a two HSM deployment but needs to have its parameters modified to meet your requirements.

* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Monitoring](monitoring.md)
* [Supportability](supportability.md)