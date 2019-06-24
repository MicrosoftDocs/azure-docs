---
title: Migrate Azure Application Gateway and Web Application Firewall from v1 to v2
description: This article shows you how to migrate Azure Application Gateway and Web Application Firewall from v1 to v2
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.date: 6/18/2019
ms.author: victorh
---

# Migrate Azure Application Gateway and Web Application Firewall from v1 to v2

[Azure Application Gateway and Web Application Firewall (WAF) v2](application-gateway-autoscaling-zone-redundant.md) is now available, offering additional features such as autoscaling and availability-zone redundancy. However, existing v1 gateways aren't automatically upgraded to v2. If you want to migrate from v1 to v2, follow the steps in this article.

There are two stages in a migration:

1. Migrate the configuration
2. Migrate the client traffic

This article covers configuration migration. Client traffic migration varies depending on your specific environment. However, some high-level, general recommendations [are provided](#migrate-client-traffic).

## Migration overview

An Azure PowerShell script is available that does the following:

* Creates a new Standard_v2 or WAF_v2 gateway in a virtual network subnet that you specify.
* Seamlessly copies the configuration associated with the v1 Standard or WAF gateway to the newly created Standard_V2 or WAF_V2 gateway.

### Caveats\Limitations

* The new v2 gateway has new public and private IP addresses. It isn't possible to move the IP addresses associated with the existing v1 gateway seamlessly to v2. However, you can allocate an existing (unallocated) public or private IP address to the new v2 gateway.
* You must provide an IP address space for another subnet within your virtual network where your v1 gateway is located. The script can't create the v2 gateway in any existing subnets that already have a v1 gateway. However, if the existing subnet already has a v2 gateway, that may still work provided there's enough IP address space.
* To  migrate an SSL configuration, you must specify all the SSL certs used in your v1 gateway.
* If you have FIPS mode enabled for your V1 gateway, it won’t be migrated to your new v2 gateway. FIPS mode isn't supported in v2.
* v2 doesn't support IPv6, so IPv6 enabled v1 gateways aren't migrated. If you run the script, it may not complete.
* If the v1 gateway has only a private IP address, the script creates a public IP address and a private IP address for the new v2 gateway. v2 gateways currently don't support only private IP addresses.

## Download the script

Download the migration script from the  [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureAppGWMigration).

## Use the script

There are two options for you depending on your local PowerShell environment setup and preferences:

* If you don’t have the Azure Az modules installed, or don’t mind uninstalling the Azure Az modules, the best option is to use the `Install-Script` option to run the script.
* If you need to keep the Azure Az modules, your best bet is to download the script and run it directly.

To determine if you have the Azure Az modules installed, run `Get-InstalledModule -Name az`. If you don't see any installed Az modules, then you can use the `Install-Script` method.

### Install using the Install-Script method

To use this option, you must not have the Azure Az modules installed on your computer. If they're installed, the following command displays an error. You can either uninstall the Azure Az modules, or use the other option to download the script manually and run it.
  
Run the script with the following command:

`Install-Script -Name AzureAppGWMigration`

This command also installs the required Az modules.  

### Install using the script directly

If you do have some Azure Az modules installed and can't uninstall them (or don't want to uninstall them), you can manually download the script using the **Manual Download** tab in the script download link. The script is downloaded as a raw nupkg file. To install the script from this nupkg file, see [Manual Package Download](https://docs.microsoft.com/powershell/gallery/how-to/working-with-packages/manual-download).

To run the script:

1. Use `Connect-AzAccount` to connect to Azure.

1. Use `Import-Module Az` to import the Az modules.

1. Run `Get-Help AzureAppGWMigration.ps1` to examine the required parameters:

   ```
   AzureAppGwMigration.ps1
    -resourceId <v1 application gateway Resource ID>
    -subnetAddressRange <subnet space you want to use>
    -appgwName <string to use to append>
    -sslCertificates <comma-separated SSLCert objects as above>
    -trustedRootCertificates <comma-separated Trusted Root Cert objects as above>
    -privateIpAddress <private IP string>
    -publicIpResourceName <public IP name string>
    -validateMigration -enableAutoScale
   ```

   Parameters for the script:
   * **resourceId: [String]: Required** - This is the Azure Resource ID for your existing Standard v1 or WAF v1 gateway. To find this string value,  navigate to the Azure portal, select your application gateway or WAF resource, and click the **Properties** link for the gateway. The Resource ID is located on that page.

     You can also run the following Azure PowerShell commands to get the Resource ID:

     ```azurepowershell
     $appgw = Get-AzApplicationGateway -Name <v1 gateway name> -ResourceGroupName <resource group Name> 
     $appgw.Id
     ```

   * **subnetAddressRange: [String]:  Required** - This is the IP address space that you've allocated (or want to allocate) for a new subnet that contains your new v2 gateway. This must be specified in the CIDR notation. For example: 10.0.0.0/24. You don't need to create this subnet in advance. The script creates it for you if it doesn't exist.
   * **appgwName: [String]: Optional**. This is a string you specify to use as the name for the new Standard_v2 or WAF_v2 gateway. If this parameter isn't supplied, the name of your existing v1 gateway will be used with the suffix *_v2* appended.
   * **sslCertificates: [PSApplicationGatewaySslCertificate]: Optional**.  A comma-separated list of PSApplicationGatewaySslCertificate objects that you create to represent the SSL certs from your v1 gateway must be uploaded to the new v2 gateway. For each of your SSL certs configured for your Standard v1 or WAF v1 gateway, you can create a new PSApplicationGatewaySslCertificate object via the `New-AzApplicationGatewaySslCertificate` command shown here. You need the path to your SSL Cert file and the password.

       This parameter is only optional if you don’t have HTTPS listeners configured for your v1 gateway or WAF. If you have at least one HTTPS listener setup, you must specify this parameter.

      ```azurepowershell  
      $password = ConvertTo-SecureString <cert-password> -AsPlainText -Force
      $mySslCert1 = New-AzApplicationGatewaySslCertificate -Name "Cert01" `
        -CertificateFile <Cert-File-Path-1> `
        -Password $password 
      $mySslCert2 = New-AzApplicationGatewaySslCertificate -Name "Cert02" `
        -CertificateFile <Cert-File-Path-2> `
        -Password $password
      ```

      You can pass in `$mySslCert1, $mySslCert2` (comma-separated) in the previous example as values for this parameter in the script.
   * **trustedRootCertificates: [PSApplicationGatewayTrustedRootCertificate]: Optional**. A comma-separated list of PSApplicationGatewayTrustedRootCertificate objects that you create to represent the [Trusted Root certificates](ssl-overview.md) for authentication of your backend instances from your v2 gateway.  

      To create a list of PSApplicationGatewayTrustedRootCertificate objects, see [New-AzApplicationGatewayTrustedRootCertificate](https://docs.microsoft.com/powershell/module/Az.Network/New-AzApplicationGatewayTrustedRootCertificate?view=azps-2.1.0&viewFallbackFrom=azps-2.0.0).
   * **privateIpAddress: [String]: Optional**. A specific private IP address that you want to associate to your new v2 gateway.  This must be from the same VNet that you allocate for your new v2 gateway. If this isn't specified, the script allocates a private IP address for your v2 gateway.
    * **publicIpResourceId: [String]: Optional**. The resourceId of a public IP address (standard SKU) resource in your subscription that you want to allocate to the new v2 gateway. If this isn't specified, the script allocates a new public IP in the same resource group. The name is the v2 gateway’s name with *-IP* appended.
   * **validateMigration: [switch]: Optional**. Use this parameter if you want the script to do some basic configuration comparison validations after the v2 gateway creation and the configuration copy. By default, no validation is done.
   * **enableAutoScale: [switch]: Optional**. Use this parameter if you want the script to enable AutoScaling on the new v2 gateway after it's created. By default, AutoScaling is disabled. You can always manually enable it later on the newly created v2 gateway.

1. Run the script using the appropriate parameters. It may take five to seven minutes to finish.

    **Example**

   ```azurepowershell
   AzureAppGWMigration.ps1 `
      -resourceId /subscriptions/8b1d0fea-8d57-4975-adfb-308f1f4d12aa/resourceGroups/MyResourceGroup/providers/Microsoft.Network/applicationGateways/myv1appgateway `
      -subnetAddressRange 10.0.0.0/24 `
      -appgwname "MynewV2gw" `
      -sslCertificates $Certs `
      -trustedRootCertificates $trustedCert `
      -privateIpAddress "10.0.0.1" `
      -publicIpResourceId "MyPublicIP" `
      -validateMigration -enableAutoScale
   ```

## Migrate client traffic

First, double check that the script successfully created a new v2 gateway with the exact configuration migrated over from your v1 gateway. You can verify this from the Azure portal.

Also, send a small amount of traffic through the v2 gateway as a manual test.
  
Here are a few scenarios where your current application gateway (Standard) may receive client traffic, and our recommendations for each one:

* **A custom DNS zone (for example, contoso.com) that points to the frontend IP address (using an A record) associated with your Standard v1 or WAF v1 gateway**.

    You can update your DNS record to point to the frontend IP or DNS label associated with your Standard_v2 application gateway. Depending on the TTL configured on your DNS record, it may take a while for all your client traffic to migrate to your new v2 gateway.
* **A custom DNS zone (for example, contoso.com) that points to the DNS label (for example: *myappgw.eastus.cloudapp.azure.com* using a CNAME record) associated with your v1 gateway**.

   You have two choices:

  * If you use public IP addresses on your application gateway, you can do a controlled, granular migration using a Traffic Manager profile to incrementally route traffic (weighted traffic routing method) to the new v2 gateway.

    You can do this by adding the DNS labels of both the v1 and v2 application gateways to the [Traffic Manager profile](../traffic-manager/traffic-manager-routing-methods.md#weighted-traffic-routing-method), and CNAMEing your custom DNS record (for example, www.contoso.com) to the Traffic Manager domain (for example, contoso.trafficmanager.net).
  * Or, you can update your custom domain DNS record to point to the DNS label of the new v2 application gateway. Depending on the TTL configured on your DNS record, it may take a while for all your client traffic to migrate to your new v2 gateway.
* **Your clients connect to the frontend IP address of your application gateway**.

   Update your clients to use the IP address(es) associated with the newly created v2 application gateway. We recommend that you don't use IP addresses directly. Consider using the DNS name label (for example, yourgateway.eastus.cloudapp.azure.com) associated with your application gateway that you can CNAME to your own custom DNS zone (for example, contoso.com).

## Common questions

### Are there any limitations with the Azure PowerShell script to migrate the configuration from v1 to v2?

Yes. See [Caveats/Limitations](#caveatslimitations).

### Is this article and the Azure PowerShell script applicable for Application Gateway WAF product as well? 

Yes.

### Does the Azure PowerShell script also switch over the traffic from my v1 gateway to the newly created v2 gateway?

No. The Azure PowerShell script only migrates the configuration. Actual traffic migration is your responsibility and in your control.

### Is the new v2 gateway created by the Azure PowerShell script sized appropriately to handle all of the traffic that is currently served by my v1 gateway?

The Azure PowerShell script creates a new v2 gateway with an appropriate size to handle the traffic on your existing v1 gateway. Autoscaling is disabled by default, but you can enable AutoScaling when you run the script.

### I configured my v1 gateway  to send logs to Azure storage. Does the script replicate this configuration for v2 as well?

No. The script doesn't  replicate this configuration for v2. You must add the log configuration separately to the migrated v2 gateway.

### I ran into some issues with using this script. How can I get help?
  
You can send an email to appgwmigrationsup@microsoft.com, open a support case with Azure Support, or do both.

## Next steps

[Learn about Application Gateway v2](application-gateway-autoscaling-zone-redundant.md)
