---
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 04/19/2022
 ms.author: cherylmc
---
### I'm a network virtual appliance (NVA) partner and want to get our NVA in the hub. Can I join this partner program?

Unfortunately, we don't have capacity to on-board any new partner offers at this time. Check back with us at a later date!

### Can I deploy any NVA from Azure Marketplace into the Virtual WAN hub?

Only partners listed in the [Partners](../articles/virtual-wan/about-nva-hub.md#partners) section can be deployed into the Virtual WAN hub.

### What is the cost of the NVA?

You must purchase a license for the NVA from the NVA vendor. Bring-your-own license (BYOL) is the only licensing model supported today. In addition, Microsoft charges for the NVA Infrastructure Units you consume, and any other resources you use. For more information, see [Pricing concepts](../articles/virtual-wan/pricing-concepts.md).

### Can I deploy an NVA to a Basic hub?

No, you must use a Standard hub if you want to deploy an NVA.

### Can I deploy an NVA into a Secure hub?

Yes. Partner NVAs can be deployed into a hub with Azure Firewall.

### Can I connect any device in my branch office to my NVA in the hub?

No,  Barracuda CloudGen WAN is only compatible with Barracuda edge devices. To learn more about CloudGen WAN requirements, see [Barracuda's CloudGen WAN page](https://www.barracuda.com/products/cloudgenwan). For Cisco, there are several SD-WAN devices that are compatible. See [Cisco Cloud OnRamp for Multi-Cloud](https://www.cisco.com/c/en/us/td/docs/routers/sdwan/configuration/cloudonramp/ios-xe-17/cloud-onramp-book-xe/cloud-onramp-multi-cloud.html#Cisco_Concept.dita_c61e0e7a-fff8-4080-afee-47b81e8df701) documentation for compatible devices. Reach out to your provider with any questions.

### What routing scenarios are supported with NVA in the hub?

All routing scenarios supported by Virtual WAN are supported with NVAs in the hub.

### What regions are supported?

For supported regions, see [NVA supported regions](../articles/virtual-wan/about-nva-hub.md#regions).

### How do I delete my NVA in the hub?

If the Network Virtual Appliance resource was deployed via a Managed Application, delete the Managed Application. Deleting the Managed Application automatically deletes the Managed Resource Group and associated Network Virtual Appliance resource.

You can't delete an NVA that is the next hop resource for a Routing Policy. To delete the NVA, first delete the Routing Policy.

If the Network Virtual Appliance resource was deployed via partner orchestration software, reference partner documentation to delete the Network Virtual Appliance.

Alternatively, you can run the following PowerShell command to delete your Network Virtual Appliance.

1. Find the Azure resource group of the NVA you want to delete. The Azure resource group is usually **different** than the resource group  the Virtual WAN hub is deployed in. Ensure the  Virtual Hub property of the NVA resource corresponds to the NVA you want to delete. The following example assumes that all NVAs in your subscription have distinct names. If there are multiple NVAs with the same name, make sure you collect the information associated with the NVA you want to delete.  

    ```azurepowershell-interactive
    $nva = Get-AzNetworkVirtualAppliance -Name <NVA name>
    $nva.VirtualHub
    ```  
2. Delete the NVA.
   ```azurepowershell-interactive
   Remove-AzNetworkVirtualAppliance -Name $nva.Name -ResourceGroupName $nva.ResourceGroupName
   ```

The same series of steps can be executed from Azure CLI.

1. Find the Azure resource group of the NVA you want to delete.  The Azure resource group is usually **different** than the resource group  the Virtual WAN hub is deployed in. Ensure the  Virtual Hub property of the NVA resource corresponds to the NVA you want to delete. 
   ```azurecli-interactive
    az network virtual-appliance list
   ```
2. Delete the NVA
   ```azurecli-interactive
    az network virtual-appliance delete --subscription <subscription name> --resource-group <resource group name> --name <NVA name>
   ```
