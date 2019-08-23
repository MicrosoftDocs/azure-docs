---
 title: include file
 description: include file
 services: virtual-network
 author: genlin
 ms.service: virtual-network
 ms.topic: include
 ms.date: 04/13/2018
 ms.author: genli
 ms.custom: include file

---

## How to create a virtual network using a network config file from PowerShell
Azure uses an xml file to define all virtual networks available to a subscription. You can download this file, edit it to modify or delete existing virtual networks, and create new virtual networks. In this tutorial, you learn how to download this file, referred to as network configuration (or netcfg) file, and edit it to create a new virtual network. To learn more about the network configuration file, see the [Azure virtual network configuration schema](https://msdn.microsoft.com/library/azure/jj157100.aspx).

To create a virtual network with a netcfg file using PowerShell, complete the following steps:

1. If you have never used Azure PowerShell, complete the steps in the [How to Install and Configure Azure PowerShell](/powershell/azureps-cmdlets-docs) article, then sign in to Azure and select your subscription.
2. From the Azure PowerShell console, use the **Get-AzureVnetConfig** cmdlet to download the network configuration file to a directory on your computer by running the following command: 
   
   ```powershell
   Get-AzureVNetConfig -ExportToFile c:\azure\NetworkConfig.xml
   ```
   
   Expected output:
  
      ```
      XMLConfiguration                                                                                                     
      ----------------                                                                                                     
      <?xml version="1.0" encoding="utf-8"?>...
      ```

3. Open the file you saved in step 2 using any XML or text editor application, and look for the **\<VirtualNetworkSites>** element. If you have any networks already created, each network is displayed as its own **\<VirtualNetworkSite>** element.
4. To create the virtual network described in this scenario, add the following XML just under the **\<VirtualNetworkSites>** element:

   ```xml
         <?xml version="1.0" encoding="utf-8"?>
         <NetworkConfiguration xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/ServiceHosting/2011/07/NetworkConfiguration">
           <VirtualNetworkConfiguration>
             <VirtualNetworkSites>
                 <VirtualNetworkSite name="TestVNet" Location="East US">
                   <AddressSpace>
                     <AddressPrefix>192.168.0.0/16</AddressPrefix>
                   </AddressSpace>
                   <Subnets>
                     <Subnet name="FrontEnd">
                       <AddressPrefix>192.168.1.0/24</AddressPrefix>
                     </Subnet>
                     <Subnet name="BackEnd">
                       <AddressPrefix>192.168.2.0/24</AddressPrefix>
                     </Subnet>
                   </Subnets>
                 </VirtualNetworkSite>
             </VirtualNetworkSites>
           </VirtualNetworkConfiguration>
         </NetworkConfiguration>
   ```
   
5. Save the network configuration file.
6. From the Azure PowerShell console, use the **Set-AzureVnetConfig** cmdlet to upload the network configuration file by running the following command: 
   
   ```powershell
   Set-AzureVNetConfig -ConfigurationPath c:\azure\NetworkConfig.xml
   ```
   
   Returned output:
   
      ```
      OperationDescription OperationId                          OperationStatus
      -------------------- -----------                          ---------------
      Set-AzureVNetConfig  <Id>                                 Succeeded 
      ```
   
   If **OperationStatus** is not *Succeeded* in the returned output, check the xml file for errors and complete step 6 again.

7. From the Azure PowerShell console, use the **Get-AzureVnetSite** cmdlet to verify that the new network was added by running the following command: 

   ```powershell
   Get-AzureVNetSite -VNetName TestVNet
   ```
   
   The returned (abbreviated) output includes the following text:
  
      ```
      AddressSpacePrefixes : {192.168.0.0/16}
      Location             : Central US
      Name                 : TestVNet
      State                : Created
      Subnets              : {FrontEnd, BackEnd}
      OperationDescription : Get-AzureVNetSite
      OperationStatus      : Succeeded
      ```
