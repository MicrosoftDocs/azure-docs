---
title: Migrate Azure Application Gateway v1 to v2
description: This show you how to migrate Azure Application Gateway from v1 to v2
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.date: 5/31/2019
ms.author: victorh
---

# Migrate Azure Application Gateway from v1 to v2

Azure Application Gateway v2 is now available, offering additional features such as autoscaling, and availability-zone redundancy. However, existing  v1 gateways are not automatically upgraded to v2. If you want to migrate from v1 to v2, follow the steps in this article.

There are two stages in the migration:

1. Migrate the configuration
2. Migrate the client traffic

This article covers configuration migration. Client traffic migration varies depending on the specifics of the environment. However, some high-level, general recommendations are provided.

## Migration overview

An Azure PowerShell script is available that does the following:

* Creates a new Standard_v2 or WAF_v2 gateway in a virtual network subnet that you specify.
* Seamlessly copies the configuration associated with the v1 Standard or WAF gateway to the newly created Standard_V2 or WAF_V2 gateway.

### Caveats\Limitations

* The new Standard_v2 or WAF_v2 gateway has new public and private IP addresses. It is not possible to move the IP addresses associated with the existing v1 gateway seamlessly to v2. However, you can allocate an existing (unallocated) public or private IP address to the new v2 gateway.
* You must provide an IP address space for another subnet within your virtual network where your v1 gateway is located. The script can't create the v2 gateway in any existing subnets that already have a v1 gateway. However, if the existing subnet already has a v2 gateway, that may still work provided there is enough IP address space.
* To  migrate an SSL configuration, you must specify all the SSL certs used in your v1 gateway.
* Migration is not supported for v1 gateways with FIPS mode enabled.

## Download the script

Download the migration script from the  [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureAppGWMigration).

## Use the script

There are two options for you depending on your local PowerShell environment setup and preferences:

* If you don’t have the Azure Az modules installed, or don’t mind uninstalling the Azure Az modules, the best option is to use the `Install-Script` option to run the script.
* If you need to keep the Azure Az modules, your best bet is to download the script and run it directly.

To determine if you have the Azure Az modules installed, run `Get-InstalledModule -Name az`. If you don't see any installed Az modules, then you can use the `Install-Script` method.

### Install using the `Install-Script` method

To use this option, you must not have the Azure Az modules installed on our client machine. If they are installed, the following command displays an error. You can either uninstall the Azure Az  modules to proceed, or use the other option to download the script manually and run it.
  
Run the script with the following command:

`Install-Script -Name AzureAppGWMigration`

This command also installs the required Az modules.  

### Install running the script directly

If you do have some Azure Az modules installed and cannot uninstall them (or do not wish to uninstall them), you can manually download the script using the **Manual Download** tab in the script download link. The script is downloaded as a raw nupkg file. To install the script from this nupkg file, see [Manual Package Download](https://docs.microsoft.com/en-us/powershell/gallery/how-to/working-with-packages/manual-download).

To run the script:
1. Use `Connct-AzAccount` to connect to Azure.
1. Run `Get-Help AzureAppGWMigration.ps1` to examine the required parameters.

   The following are the parameters for the script:
   * **resourceId: [String]: Required** - This is the Azure Resource ID for your existing Standard v1 or WAF v1 gateway. To find this string value,  navigate to the Azure portal, select your application gateway or WAF resource, and click on the **Properties** link for the gateway. The Resource ID is located on that page. You can also get the Resource ID by running the following commands within PowerShell:

     ```azurepowershell
     $appgw = Get-AzApplicationGateway -Name <v1 gateway name> -ResourceGroupName <resource group Name> 
     $appgw.Id
     ```


## Next steps

[Learn about application gateway components](application-gateway-components.md)
