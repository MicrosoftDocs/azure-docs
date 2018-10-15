---
title: Manage Azure reserved IP addresses (Classic) | Microsoft Docs
description: Understand reserved IP addresses (Classic) and how to manage them using Azure PowerShell and Azure CLI.
services: virtual-network
documentationcenter: na
author: genlin
manager: cshepard
editor: tysonn

ms.assetid: 34652a55-3ab8-4c2d-8fb2-43684033b191
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/12/2018
ms.author: genli

---
# Reserved IP addresses (classic deployment)

 IP addresses in Azure fall into two categories: dynamic and reserved. Public IP addresses managed by Azure are dynamic by default. That means that the IP address used for a given cloud service (VIP) or to access a VM or role instance directly (ILPIP) can change from time to time, when resources are shut down or stopped (deallocated).

To prevent IP addresses from changing, you can reserve an IP address. Reserved IPs can be used only as a VIP, ensuring that the IP address for the cloud service remains the same, even as resources are shut down or stopped (deallocated). Furthermore, you can convert existing dynamic IPs used as a VIP to a reserved IP address.

> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../azure-resource-manager/resource-manager-deployment-model.md). This article covers using the classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. Learn how to reserve a static public IP address using the [Resource Manager deployment model](virtual-network-ip-addresses-overview-arm.md).

To learn more about IP addresses in Azure, read the [IP addresses](virtual-network-ip-addresses-overview-classic.md) article.

## When do I need a reserved IP?
* **You want to ensure that the IP is reserved in your subscription**. If you want to reserve an IP address that is not released from your subscription under any circumstance, you should use a reserved public IP.  
* **You want your IP to stay with your cloud service even across stopped or deallocated state (VMs)**. If you want your service to be accessed by using an IP address that doesn't change, even when VMs in the cloud service are shut down or stop (deallocated).
* **You want to ensure that outbound traffic from Azure uses a predictable IP address**. You may have your on-premises firewall configured to allow only traffic from specific IP addresses. By reserving an IP, you know the source IP address, and don't need to update your firewall rules due to an IP change.

## FAQs
- Can I use a reserved IP for all Azure services?
    No. Reserved IPs can only be used for VMs and cloud service instance roles exposed through a VIP.
- How many reserved IPs can I have?
    For details, see the [Azure limits](../azure-subscription-service-limits.md#networking-limits) article.
- Is there a charge for reserved IPs?
    Sometimes. For pricing details, see the [Reserved IP Address Pricing Details](http://go.microsoft.com/fwlink/?LinkID=398482) page.
- How do I reserve an IP address?
    You can use PowerShell, the [Azure Management REST API](https://msdn.microsoft.com/library/azure/dn722420.aspx), or the [Azure portal](https://portal.azure.com) to reserve an IP address in an Azure region. A reserved IP address is associated to your subscription.
- Can I use a reserved IP with affinity group-based VNets?
    No. Reserved IPs are only supported in regional VNets. Reserved IPs are not supported for VNets that are associated with affinity groups. For more information about associating a VNet with a region or affinity group, see the [About Regional VNets and Affinity Groups](virtual-networks-migrate-to-regional-vnet.md) article.

## Manage reserved VIPs

### Using Azure PowerShell (classic)

Before you can use reserved IPs, you must add it to your subscription. Create a reserved IP from the pool of public IP addresses available in the *Central US* location as follows:

> [!NOTE]
> For classic deployment model, you must install the Service Management version of Azure PowerShell. For more information, see [Install the Azure PowerShell Service Management module](https://docs.microsoft.com/powershell/azure/servicemanagement/install-azure-ps?view=azuresmps-4.0.0). 

  ```powershell
    New-AzureReservedIP –ReservedIPName MyReservedIP –Location "Central US"
  ```
Notice, however, that you cannot specify what IP is being reserved. To view what IP addresses are reserved in your subscription, run the following PowerShell command, and notice the values for *ReservedIPName* and *Address*:

```powershell
Get-AzureReservedIP
```

Expected output:

    ReservedIPName       : MyReservedIP
    Address              : 23.101.114.211
    Id                   : d73be9dd-db12-4b5e-98c8-bc62e7c42041
    Label                :
    Location             : Central US
    State                : Created
    InUse                : False
    ServiceName          :
    DeploymentName       :
    OperationDescription : Get-AzureReservedIP
    OperationId          : 55e4f245-82e4-9c66-9bd8-273e815ce30a
    OperationStatus      : Succeeded

>[!NOTE]
>When you create a reserved IP address with PowerShell, you cannot specify a resource group to create the reserved IP in. Azure places it into a resource group named *Default-Networking* automatically. If you create the reserved IP using the [Azure portal](http://portal.azure.com), you can specify any resource group you choose. If you create the reserved IP in a resource group other than *Default-Networking* however, whenever you reference the reserved IP with commands such as `Get-AzureReservedIP` and `Remove-AzureReservedIP`, you must reference the name *Group resource-group-name reserved-ip-name*.  For example, if you create a reserved IP named *myReservedIP* in a resource group named *myResourceGroup*, you must reference the name of the reserved IP as *Group myResourceGroup myReservedIP*.   


Once an IP is reserved, it remains associated to your subscription until you delete it. Delete a reserved IP as follows:

```powershell
Remove-AzureReservedIP -ReservedIPName "MyReservedIP"
```

### Using Azure CLI (classic)
Create a reserved IP from the pool of public IP addresses available in the *Central US* location as Using Azure classic CLI follows:

> [!NOTE]
> For classic deployment, you must use Azure classic CLI. For information about installing Azure classic CLI, see [Install the Azure classic CLI](https://docs.microsoft.com/cli/azure/install-classic-cli?view=azure-cli-latest)
  
 Command:
 
```azurecli
azure network reserved-ip create <name> <location>
```
Example:
 ```azurecli
 azure network reserved-ip create MyReservedIP centralus
 ```

You can view what IP addresses are reserved in your subscription using Azure CLI as follows: 

Command:
```azurecli
azure network reserved-ip list
```
Once an IP is reserved, it remains associated to your subscription until you delete it. Delete a reserved IP as follows:

Command:

 ```azurecli
 azure network reserved-ip delete <name>
 ```
  Example:  
 ```azurecli
 azure network reserved-ip delete MyReservedIP
 ```
## Reserve the IP address of an existing cloud service
You can reserve the IP address of an existing cloud service by adding the `-ServiceName` parameter. Reserve the IP address of a cloud service *TestService* in the *Central US* location as follows:

- Using Azure PowerShell (classic):

  ```powershell
  New-AzureReservedIP –ReservedIPName MyReservedIP –Location "Central US" -ServiceName TestService
  ```

- Using Azure CLI (classic):
  
    Command:

    ```azurecli
     azure network reserved-ip create <name> <location> -r <service-name> -d <deployment-name>
    ```
    Example:

    ```azurecli
      azure network reserved-ip create MyReservedIP centralus -r TestService -d asmtest8942
    ```

## Associate a reserved IP to a new cloud service
The following script creates a new reserved IP, then associates it to a new cloud service named *TestService*.

### Using Azure PowerShell (classic)
```powershell
New-AzureReservedIP –ReservedIPName MyReservedIP –Location "Central US"

$image = Get-AzureVMImage|?{$_.ImageName -like "*RightImage-Windows-2012R2-x64*"}

New-AzureVMConfig -Name TestVM -InstanceSize Small -ImageName $image.ImageName `
| Add-AzureProvisioningConfig -Windows -AdminUsername adminuser -Password MyP@ssw0rd!! `
| New-AzureVM -ServiceName TestService -ReservedIPName MyReservedIP -Location "Central US"
```
> [!NOTE]
> When you create a reserved IP to use with a cloud service, you still refer to the VM by using *VIP:&lt;port number>* for inbound communication. Reserving an IP does not mean you can connect to the VM directly. The reserved IP is assigned to the cloud service that the VM has been deployed to. If you want to connect to a VM by IP directly, you have to configure an instance-level public IP. An instance-level public IP is a type of public IP (called an ILPIP) that is assigned directly to your VM. It cannot be reserved. For more information, read the [Instance-level Public IP (ILPIP)](virtual-networks-instance-level-public-ip.md) article.
> 

## Remove a reserved IP from a running deployment

Remove a reserved IP added to a new cloud service as follows: 
### Using Azure PowerShell (classic)

```powershell
Remove-AzureReservedIPAssociation -ReservedIPName MyReservedIP -ServiceName TestService
```

### Using Azure CLI (classic)
Command:

```azurecli
azure network reserved-ip disassociate <name> <service-name> <deployment-name>
```

Example:

```azurecli
azure network reserved-ip disassociate MyReservedIP TestService asmtest8942
```

> [!NOTE]
> Removing a reserved IP from a running deployment does not remove the reservation from your subscription. It simply frees the IP to be used by another resource in your subscription.
> 

To remove a reserved IP completely from a subscription, run the following command:

Command:

```azurecli
azure network reserved-ip delete <name>
```
Example:

```azurecli
azure network reserved-ip delete MyReservedIP
```

## Associate a reserved IP to a running deployment

### Using Azure PowerShell (classic)

The following commands create a cloud service named *TestService2* with a new VM named *TestVM2*. The existing reserved IP named *MyReservedIP* is then associated to the cloud service.

```powershell
$image = Get-AzureVMImage|?{$_.ImageName -like "*RightImage-Windows-2012R2-x64*"}

New-AzureVMConfig -Name TestVM2 -InstanceSize Small -ImageName $image.ImageName `
| Add-AzureProvisioningConfig -Windows -AdminUsername adminuser -Password MyP@ssw0rd!! `
| New-AzureVM -ServiceName TestService2 -Location "Central US"

Set-AzureReservedIPAssociation -ReservedIPName MyReservedIP -ServiceName TestService2
```

### Using Azure CLI (classic)
You can associate a new reserved IP to your running cloud service deployment using Azure CLI as follows:

Command:
```azurecli
azure network reserved-ip associate <name> <service-name> <deployment-name>
```
Example:
```azurecli
azure network reserved-ip associate MyReservedIP TestService asmtest8942
```
## Associate a reserved ip to a cloud service by using a service configuration file
You can also associate a reserved IP to a cloud service by using a service configuration (CSCFG) file. The following sample xml shows how to configure a cloud service to use a reserved VIP named *MyReservedIP*:
```
   <?xml version="1.0" encoding="utf-8"?>
    <ServiceConfiguration serviceName="ReservedIPSample" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceConfiguration" osFamily="4" osVersion="*" schemaVersion="2014-01.2.3">
      <Role name="WebRole1">
        <Instances count="1" />
        <ConfigurationSettings>
          <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="UseDevelopmentStorage=true" />
        </ConfigurationSettings>
      </Role>
      <NetworkConfiguration>
        <AddressAssignments>
          <ReservedIPs>
           <ReservedIP name="MyReservedIP"/>
          </ReservedIPs>
        </AddressAssignments>
      </NetworkConfiguration>
    </ServiceConfiguration>
```
## Next steps
* Understand how [IP addressing](virtual-network-ip-addresses-overview-classic.md) works in the classic deployment model.
* Learn about [reserved private IP addresses](virtual-networks-reserved-private-ip.md).
* Learn about [Instance Level Public IP (ILPIP) addresses](virtual-networks-instance-level-public-ip.md).

