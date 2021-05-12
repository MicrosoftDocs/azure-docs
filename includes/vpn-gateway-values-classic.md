---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 10/08/2020
 ms.author: cherylmc
 ms.custom: include file
---

When you create classic VNets in the Azure portal, the name that you view is not the full name that you use for PowerShell. For example, a VNet that appears to be named **TestVNet1** in the portal, may have a much longer name in the network configuration file. For a VNet in the resource group "ClassicRG" name might look something like: **Group ClassicRG TestVNet1**. When you create your connections, it's important to use the values that you see in the network configuration file.

In the following steps, you will connect to your Azure account and download and view the network configuration file to obtain the values that are required for your connections.

1. Download and install the latest version of the Azure Service Management (SM) PowerShell cmdlets. Most people have the Resource Manager modules installed locally, but do not have Service Management modules. Service Management modules are legacy and must be installed separately. For more information, see [Install Service Management cmdlets](/powershell/azure/servicemanagement/install-azure-ps).

1. Open your PowerShell console with elevated rights and connect to your account. Use the following examples to help you connect. You must run these commands locally using the PowerShell Service Management module. Connect to your account. Use the following example to help you connect:

   ```powershell
   Add-AzureAccount
   ```
1. Check the subscriptions for the account.

   ```powershell
   Get-AzureSubscription
   ```
1. If you have more than one subscription, select the subscription that you want to use.

   ```powershell
   Select-AzureSubscription -SubscriptionId "Replace_with_your_subscription_ID"
   ```
1. Create a directory on your computer. For example, C:\AzureVNet
1. Export the network configuration file to the directory. In this example, the network configuration file is exported to **C:\AzureNet**.

   ```powershell
   Get-AzureVNetConfig -ExportToFile C:\AzureNet\NetworkConfig.xml
   ```
1. Open the file with a text editor and view the names for your VNets and sites. These names will be the names you use when you create your connections.<br>**VNet** names are listed as **VirtualNetworkSite name =**<br>**Site** names are listed as **LocalNetworkSiteRef name =**