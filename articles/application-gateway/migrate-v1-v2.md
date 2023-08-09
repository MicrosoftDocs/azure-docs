---
title: Migrate from V1 to V2 - Azure Application Gateway
description: This article shows you how to migrate Azure Application Gateway and Web Application Firewall from V1 to V2
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 08/01/2023
ms.author: greglin
---

# Migrate Azure Application Gateway and Web Application Firewall from V1 to V2

We announced the deprecation of Application Gateway V1 SKU (Standard and WAF) on April 28, 2023. The V1 SKU retires on April 28, 2026. For more information, see [Migrate your Application Gateways from V1 SKU to V2 SKU by April 28, 2026](./v1-retirement.md).

[Azure Application Gateway and Web Application Firewall (WAF) V2](application-gateway-autoscaling-zone-redundant.md) now offer additional features such as autoscaling, availability, zone redundancy, higher performance, faster operations and improved throughput compared to V1. Also, all new features are released for V2 SKU. It's highly recommended for you to create a migration plan now. 

V1 gateways aren't automatically upgraded to V2. Use this migration guide to help you plan and carry out the migrations. 

There are two stages in a migration:

1. Migrate the configuration
2. Migrate the client traffic

This article primarily helps with the configuration migration. Client traffic migration varies depending on the environment. Some [general recommendations are provided](#traffic-migration) in this article.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An existing Application Gateway V1 Standard.
* Make sure you have the latest PowerShell modules, or you can use Azure Cloud Shell in the portal.
* If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

> [!IMPORTANT]
>Run the `Set-AzContext -Subscription <V1 application gateway SubscriptionId>` cmdlet every time before running the migration script. This is necessary to set the active Azure context to the correct subscription, because the migration script might clean up the existing resource group if it doesn't exist in current subscription context.
## Configuration migration 

An Azure PowerShell script is provided in this document. It performs the following operations to help you with the configuration:

* Creates a new Standard_V2 or WAF_V2 gateway in a virtual network subnet that you specify.
* Seamlessly copies the configuration associated with the V1 Standard or WAF gateway to the newly created Standard_V2 or WAF_V2 gateway.

## Downloading the script

You can download the migration script from the  [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureAppGWMigration).

## Using the script

> [!NOTE]
> Run the `Set-AzContext -Subscription <V1 application gateway SubscriptionId>` cmdlet every time before running the migration script. This is necessary to set the active Azure context to the correct subscription, because the migration script might clean up the existing resource group if it doesn't exist in current subscription context.

There are two options for you depending on your local PowerShell environment setup and preferences:

* If you don't have the Azure Az modules installed, or don't mind uninstalling the Azure Az modules, the best option is to use the `Install-Script` option to run the script.
* If you need to keep the Azure Az modules, your best bet is to download the script and run it directly.

To determine if you have the Azure Az modules installed, run `Get-InstalledModule -Name az`. If you don't see any installed Az modules, then you can use the `Install-Script` method.

#### Install using the Install-Script method

To use this option, you must not have the Azure Az modules installed on your computer. If they're installed, the following command displays an error. You can either uninstall the Azure Az modules, or use the other option to download the script manually and run it.

Run the script with the following command to get the latest version:

`Install-Script -Name AzureAppGWMigration -Force`

This command also installs the required Az modules.

#### Install using the script directly

If you have some Azure Az modules installed and can't uninstall them (or don't want to uninstall them), you can manually download the script using the **Manual Download** tab in the script download link. The script is downloaded as a raw nupkg file. To install the script from this nupkg file, see [Manual Package Download](/powershell/gallery/how-to/working-with-packages/manual-download).

#### How to run the script

To run the script:

1. Use `Connect-AzAccount` to connect to Azure.

2. Use `Import-Module Az` to import the Az modules.

3. Run the `Set-AzContext` cmdlet ,to set the active Azure context to the correct subscription.This is an important step because the migration script might clean up the existing resource group if it doesn't exist in current subscription context.
   ```
   Set-AzContext -Subscription '<V1 application gateway SubscriptionId>'
   ```
4. Run `Get-Help AzureAppGWMigration.ps1` to examine the required parameters:

   ```
   AzureAppGwMigration.ps1
    -resourceId <V1 application gateway Resource ID>
    -subnetAddressRange <subnet space you want to use>
    -appgwName <string to use to append>
    -AppGwResourceGroupName <resource group name you want to use>
    -sslCertificates <comma-separated SSLCert objects as above>
    -trustedRootCertificates <comma-separated Trusted Root Cert objects as above>
    -privateIpAddress <private IP string>
    -publicIpResourceId <public IP name string>
    -validateMigration -enableAutoScale
   ```

   Parameters for the script:
   * **resourceId: [String]: Required**: This parameter is the Azure Resource ID for your existing Standard V1 or WAF V1 gateway. To find this string value,  navigate to the Azure portal, select your application gateway or WAF resource, and click the **Properties** link for the gateway. The Resource ID is located on that page.

     You can also run the following Azure PowerShell commands to get the Resource ID:

     ```azurepowershell
     $appgw = Get-AzApplicationGateway -Name <V1 gateway name> -ResourceGroupName <resource group Name>
     $appgw.Id
     ```

   * **subnetAddressRange: [String]:  Required**: This parameter is the IP address space that you've allocated (or want to allocate) for a new subnet that contains your new V2 gateway. The address space must be specified in the CIDR notation. For example: 10.0.0.0/24. You don't need to create this subnet in advance but the CIDR needs to be part of the VNET address space. The script creates it for you if it doesn't exist and if it exists, it uses the existing one (make sure the subnet is either empty, contains only V2 Gateway if any, and has enough available IPs).
   * **appgwName: [String]: Optional**. This is a string you specify to use as the name for the new Standard_V2 or WAF_V2 gateway. If this parameter isn't supplied, the name of your existing V1 gateway is used with the suffix *_V2* appended.
   * **AppGwResourceGroupName: [String]: Optional**. Name of resource group where you want V2 Application Gateway resources to be created (default value is `<V1-app-gw-rgname>`)
   * **sslCertificates: [PSApplicationGatewaySslCertificate]: Optional**.  A comma-separated list of PSApplicationGatewaySslCertificate objects that you create to represent the TLS/SSL certs from your V1 gateway must be uploaded to the new V2 gateway. For each of your TLS/SSL certs configured for your Standard V1 or WAF V1 gateway, you can create a new PSApplicationGatewaySslCertificate object via the `New-AzApplicationGatewaySslCertificate` command shown here. You need the path to your TLS/SSL Cert file and the password.

     This parameter is only optional if you don't have HTTPS listeners configured for your V1 gateway or WAF. If you have at least one HTTPS listener setup, you must specify this parameter.

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

   * **sslCertificates from Keyvault: Optional**. You can download the certificates stored in Azure Key Vault and pass it to migration script. To download the certificate as a PFX file, run following command. These commands access SecretId, and then save the content as a PFX file.

     ```azurepowershell
      $vaultName = ConvertTo-SecureString <kv-name> -AsPlainText -Force
      $certificateName = ConvertTo-SecureString <cert-name> -AsPlainText -Force
      $password = ConvertTo-SecureString <password> -AsPlainText -Force
      
      $pfxSecret = Get-AzKeyVaultSecret -VaultName $vaultName -Name $certificateName -AsPlainText
      $secretByte = [Convert]::FromBase64String($pfxSecret)
      $x509Cert = New-Object Security.Cryptography.X509Certificates.X509Certificate2
      $x509Cert.Import($secretByte, $null, [Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable)
      $pfxFileByte = $x509Cert.Export([Security.Cryptography.X509Certificates.X509ContentType]::Pkcs12, $password)
      
      # Write to a file
      [IO.File]::WriteAllBytes("KeyVaultcertificate.pfx", $pfxFileByte)
      ```
      For each of the cert downloaded from the Keyvault, you can create a new PSApplicationGatewaySslCertificate object via the New-AzApplicationGatewaySslCertificate command shown here. You need the path to your TLS/SSL Cert file and the password.

       ```azurepowershell
      //Convert the downloaded certificate to SSL object
      $password = ConvertTo-SecureString  <password> -AsPlainText -Force 
      $cert = New-AzApplicationGatewaySSLCertificate -Name <certname> -CertificateFile <Cert-File-Path-1> -Password $password 
       ```
     
   * **trustedRootCertificates: [PSApplicationGatewayTrustedRootCertificate]: Optional**. A comma-separated list of PSApplicationGatewayTrustedRootCertificate objects that you create to represent the [Trusted Root certificates](ssl-overview.md) for authentication of your backend instances from your v2 gateway.

      ```azurepowershell
      $certFilePath = ".\rootCA.cer"
      $trustedCert = New-AzApplicationGatewayTrustedRootCertificate -Name "trustedCert1" -CertificateFile $certFilePath
      ```

      To create a list of PSApplicationGatewayTrustedRootCertificate objects, see [New-AzApplicationGatewayTrustedRootCertificate](/powershell/module/Az.Network/New-AzApplicationGatewayTrustedRootCertificate).
   * **privateIpAddress: [String]: Optional**. A specific private IP address that you want to associate to your new V2 gateway.  This must be from the same VNet that you allocate for your new V2 gateway. If this isn't specified, the script allocates a private IP address for your V2 gateway.
   * **publicIpResourceId: [String]: Optional**. The resourceId of existing public IP address (standard SKU) resource in your subscription that you want to allocate to the new V2 gateway. If this isn't specified, the script allocates a new public IP in the same resource group. The name is the V2 gateway's name with *-IP* appended.
   * **validateMigration: [switch]: Optional**. Use this parameter if you want the script to do some basic configuration comparison validations after the V2 gateway creation and the configuration copy. By default, no validation is done.
   * **enableAutoScale: [switch]: Optional**. Use this parameter if you want the script to enable autoscaling on the new V2 gateway after it's created. By default, autoscaling is disabled. You can always manually enable it later on the newly created V2 gateway.

5. Run the script using the appropriate parameters. It may take five to seven minutes to finish.

    **Example**

   ```azurepowershell
   AzureAppGWMigration.ps1 `
      -resourceId /subscriptions/8b1d0fea-8d57-4975-adfb-308f1f4d12aa/resourceGroups/MyResourceGroup/providers/Microsoft.Network/applicationGateways/myv1appgateway `
      -subnetAddressRange 10.0.0.0/24 `
      -appgwname "MynewV2gw" `
      -AppGwResourceGroupName "MyResourceGroup" `
      -sslCertificates $mySslCert1,$mySslCert2 `
      -trustedRootCertificates $trustedCert `
      -privateIpAddress "10.0.0.1" `
      -publicIpResourceId "/subscriptions/8b1d0fea-8d57-4975-adfb-308f1f4d12aa/resourceGroups/MyResourceGroup/providers/Microsoft.Network/publicIPAddresses/MyPublicIP" `
      -validateMigration -enableAutoScale
   ```

### Caveats\Limitations

* The new V2 gateway has new public and private IP addresses. It isn't possible to move the IP addresses associated with the existing V1 gateway seamlessly to V2. However, you can allocate an existing (unallocated) public or private IP address to the new V2 gateway.
* You must provide an IP address space for another subnet within your virtual network where your V1 gateway is located. The script can't create the V2 gateway in a subnet that already has a V1 gateway. If the subnet already has a V2 gateway the script might still work, provided enough IP address space is available.
* If you have a network security group or user defined routes associated to the V2 gateway subnet, make sure they adhere to the [NSG requirements](../application-gateway/configuration-infrastructure.md#network-security-groups) and [UDR requirements](../application-gateway/configuration-infrastructure.md#supported-user-defined-routes) for a successful migration
* [Virtual network service endpoint policies](../virtual-network/virtual-network-service-endpoint-policies-overview.md) are currently not supported in an Application Gateway subnet.
* To  migrate a TLS/SSL configuration, you must specify all the TLS/SSL certs used in your V1 gateway.
* If you have FIPS mode enabled for your V1 gateway, it isn't migrated to your new V2 gateway. FIPS mode isn't supported in V2.
* If you have a Private IP only V1 gateway, the script generates a private and public IP address for the new V2 gateway. The Private IP only V2 gateway is currently in public preview. Once it becomes generally available, customers can utilize the script to transfer their private IP only V1 gateway to a private IP only V2 gateway.
* NTLM and Kerberos authentication isn't supported by Application Gateway V2. The script is unable to detect if the gateway is serving this type of traffic and may pose as a breaking change from V1 to V2 gateways if run.

## Traffic migration

First, double check that the script successfully created a new V2 gateway with the exact configuration migrated over from your V1 gateway. You can verify this from the Azure portal.

Also send a small amount of traffic through the V2 gateway as a manual test.

The following are a few scenarios where your current application gateway (Standard) may receive client traffic, and our recommendations for each one:

* **A custom DNS zone (for example, contoso.com) that points to the frontend IP address (using an A record) associated with your Standard V1 or WAF V1 gateway**.

    You can update your DNS record to point to the frontend IP or DNS label associated with your Standard_V2 application gateway. Depending on the TTL configured on your DNS record, it may take a while for all your client traffic to migrate to your new V2 gateway.
* **A custom DNS zone (for example, contoso.com) that points to the DNS label (for example: *myappgw.eastus.cloudapp.azure.com* using a CNAME record) associated with your V1 gateway**.

   You have two choices:

  * If you use public IP addresses on your application gateway, you can do a controlled, granular migration using a Traffic Manager profile to incrementally route traffic (weighted traffic routing method) to the new V2 gateway.

    You can do this by adding the DNS labels of both the V1 and V2 application gateways to the [Traffic Manager profile](../traffic-manager/traffic-manager-routing-methods.md#weighted-traffic-routing-method), and CNAMEing your custom DNS record (for example, `www.contoso.com`) to the Traffic Manager domain (for example, contoso.trafficmanager.net).
  * Or, you can update your custom domain DNS record to point to the DNS label of the new V2 application gateway. Depending on the TTL configured on your DNS record, it may take a while for all your client traffic to migrate to your new V2 gateway.
* **Your clients connect to the frontend IP address of your application gateway**.

   Update your clients to use the IP address(es) associated with the newly created V2 application gateway. We recommend that you don't use IP addresses directly. Consider using the DNS name label (for example, yourgateway.eastus.cloudapp.azure.com) associated with your application gateway that you can CNAME to your own custom DNS zone (for example, contoso.com).

## Pricing considerations

The pricing models are different for the Application Gateway V1 and V2 SKUs. V2 is charged based on consumption. See [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/) before migrating for pricing information. 

### Cost efficiency guidance

The V2 SKU comes with a range of advantages such as a performance boost of 5x, improved security with Key Vault integration, faster updates of security rules in WAF_V2, WAF Custom rules, Policy associations, and Bot protection. It also offers high scalability, optimized traffic routing, and seamless integration with Azure services. These features can improve the overall user experience, prevent slowdowns during times of heavy traffic, and avoid expensive data breaches.

There are five variants available in V1 SKU based on the Tier and Size - Standard_Small, Standard_Medium, Standard_Large, WAF_Medium and WAF_Large.


| SKU      | V1 Fixed Price/mo          | V2 Fixed Price/mo | Recommendation|
| ------------- |:-------------:|:-----:|:-----: | 
|Standard Medium     | 102.2 | 179.8|V2 SKU can handle a larger number of requests than a V1 gateway, so we recommend consolidating multiple V1 gateways into a single V2 gateway, to optimize the cost. Ensure that consolidation doesn’t exceed the Application Gateway [limits](../azure-resource-manager/management/azure-subscription-service-limits.md#application-gateway-limits). We recommend 3:1 consolidation. |
| WAF Medium    | 183.96     |   262.8 |Same as for Standard Medium |
| Standard Large | 467.2      |    179.58 | For these variants, in most cases, moving to a V2 gateway can provide you with a better price benefit compared to V1.|
| WAF Large | 654.08     |    262.8 |Same as for Standard Large |

> [!NOTE]
> The calculations shown here are based on East US and for a gateway with 2 instances in V1. The variable cost in V2 is based on one of the 3 dimensions with highest usage: New connections (50/sec), Persistent connections (2500 persistent connections/min), Throughput (1 CU can handle 2.22 Mbps). <br>
> <br>
> The scenarios described here are examples and are for illustration purposes only. For pricing information according to your region, see the [Pricing page](https://azure.microsoft.com/pricing/details/application-gateway/).
 
For further concerns regarding the pricing, work with your CSAM or get in touch with our support team for assistance.

## Common questions 

Common questions on migration can be found [here](./retirement-faq.md#faq-on-v1-to-v2-migration)

## Next steps

[Learn about Application Gateway V2](application-gateway-autoscaling-zone-redundant.md)
