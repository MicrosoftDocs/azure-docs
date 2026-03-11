---
title: Migrate from V1 to V2 - Azure Application Gateway
description: This article shows you how to migrate Azure Application Gateway and Web Application Firewall from V1 to V2.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 03/04/2026
ms.author: mbender
#customer intent: As a DevOps engineer, I want to migrate my Azure Application Gateway and Web Application Firewall deployments from V1 to V2 so that I can take advantage of the improved features and performance while ensuring minimal downtime during the transition.
---

# Migrate Azure Application Gateway and Web Application Firewall from V1 to V2

Microsoft announced the deprecation of Application Gateway V1 (Standard and Web Application Firewall) on April 28, 2023. Application Gateway V1 will retire on April 28, 2026.

In this article, you learn how to migrate Azure Application Gateway and Azure Web Application Firewall from V1 to V2 by using Azure PowerShell scripts. Migration has two stages: configuration migration and traffic migration. You can use the enhanced cloning script (recommended) or the legacy cloning script to clone your V1 gateway configuration to a new V2 gateway, and then redirect client traffic with minimal downtime.

For more information about the retirement of Application Gateway V1, see [Migrate from Application Gateway V1 to V2 by April 28, 2026](./v1-retirement.md).

## Why migrate to V2?

[Application Gateway V2 and Web Application Firewall V2](application-gateway-autoscaling-zone-redundant.md) offer the following benefits over V1:

- **Resiliency**. Availability zone redundancy and autoscale.
- **Security**. Azure Key Vault integration, improved Web Application Firewall capabilities, and bot protection.
- **Monitoring**. Comprehensive monitoring for CPU, memory, and disk usage. (V1 supports CPU only.)
- **Detection and mitigation**. Advanced detection and automated mitigation that identify and resolve problems without manual intervention.
- **New features**. Release of new features for V2 only.

V1 gateways aren't automatically upgraded to V2. Use this guide to plan and carry out your migration.

This article focuses on the configuration stage of migration. Migration of client traffic varies by environment. This article provides only general recommendations for traffic migration.

## Prerequisites

- You need an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- You need an existing Application Gateway V1 Standard deployment.

- Use the latest PowerShell modules, or you can use Azure Cloud Shell in the Azure portal.

- If you're running PowerShell locally, run `Connect-AzAccount` to create a connection with Azure.

- You can't have an existing gateway with the provided `AppGWV2Name` and `AppGWResourceGroupName` parameters in a V1 subscription. This condition prevents rewriting existing resources.

- You can't have any other planned operation on the V1 gateway or any associated resources during migration.

- If you provide a public IP address, ensure that it's in a succeeded state. If you don't provide a public IP address but provide `AppGWResourceGroupName`, ensure that a public IP resource with the name `AppGWV2Name-IP` doesn't exist in a resource group with the name `AppGWResourceGroupName` in the V1 subscription.

- For V1, authentication certificates are required to set up TLS connections with backend servers. V2 requires uploading [trusted root certificates](./certificates-for-backend-authentication.md) for the same purpose. Whereas V1 allows the use of self-signed certificates as authentication certificates, V2 mandates [generating and uploading a self-signed root certificate](./self-signed-certificates.md) if self-signed certificates are used in the backend.

- If you enable network isolation on the subscription, all Application Gateway V2 public-only or private-only deployments must be in a subnet delegated to `Microsoft.Network/applicationGateways`. Use the [steps to set up subnet delegation](/azure/virtual-network/manage-subnet-delegation?tabs=manage-subnet-delegation-portal).

> [!NOTE]
> Application Gateway V2 includes [customer-controlled backend TLS relaxation](configuration-http-settings.md#backend-https-validation-settings), a capability that streamlines backend certificate validation during migration. You can use this feature to temporarily relax TLS checks by skipping the certificate chain, skipping expiry validation, or overriding Server Name Indication (SNI) validation. This action aligns behavior with what's already permitted in V1.
>
> When the [enhanced migration script](#enhanced-cloning-script-recommended) runs, it enables these relaxation settings by default for HTTPS backends to prevent disruptions caused by the stricter certificate enforcement in V2. After you complete the migration, you can upload the appropriate trusted root certificates and disable backend TLS relaxation to align with the recommended security posture for V2.

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Configuration migration

The configuration migration focuses on setting up the new V2 gateway with the settings from your existing V1 environment. Two Azure PowerShell scripts facilitate the migration of configurations (Standard or Web Application Firewall) from V1 to V2 gateways. These scripts help streamline the transition process by automating key deployment and configuration tasks.

## Enhanced cloning script (recommended)

The enhanced cloning script is the recommended option. It offers an improved migration experience by:

- Eliminating the need for manual input of frontend SSL certificates and backend trusted root certificates.
- Supporting the deployment of private-only V2 gateways.

You can download the enhanced cloning script from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureAppGWClone).

### Considerations

If the existing Application Gateway V1 deployment is configured with a private-only frontend, you must [register the `EnableApplicationGatewayNetworkIsolation` feature in the subscription](../application-gateway/application-gateway-private-deployment.md#onboard-to-the-feature) for private deployment before running the migration script. This step is required to avoid deployment failures.

Private Application Gateway deployments must have subnet delegation configured to `Microsoft.Network/applicationGateways`. Use the [steps to set up subnet delegation](/azure/virtual-network/manage-subnet-delegation?tabs=manage-subnet-delegation-portal).

### Parameters for the script

- `AppGw V1 ResourceId -Required`. Azure resource ID for your existing Standard V1 or Web Application Firewall V1 gateway. To find this string value, go to the Azure portal, select your Application Gateway or Web Application Firewall resource, and then select the **Properties** link for the gateway. The resource ID is on that pane.

   You can also run the following Azure PowerShell commands to get the resource ID:

   ```azurepowershell
   $appgw = Get-AzApplicationGateway -Name <V1 gateway name> -ResourceGroupName <resource group Name>
   $appgw.Id
   ```

- `SubnetAddressRange -Required`. Subnet address in CIDR notation, where Application Gateway V2 will be deployed.

- `AppGwName -Optional`. Name of the V2 application gateway. The default value is `{AppGwV1 Name}_migrated`.

- `AppGwResourceGroupName -Optional`. Name of resource group where the V2 application gateway will be created. If you don't provide it, the Application Gateway V1 resource group is used.

- `PrivateIPAddress -Optional`. Private IP address to be assigned to Application Gateway V2. If you don't provide it, a random private IP is assigned.

- `ValidateBackendHealth -Optional`. Post-migration validation by comparing `ApplicationGatewayBackendHealth` responses. If you don't set it, this validation is skipped.

- `PublicIpResourceId -Optional`. Resource ID of the public IP address (if it already exists) to be attached to the application gateway. If you don't provide it, the public IP name is `{AppGwName}-IP`.

- `DisableAutoscale -Optional`. Option to disable autoscale configuration for Application Gateway V2 instances. It's `false` by default.

- `WafPolicyName -Optional`. Name of the Web Application Firewall policy that will be created from the Web Application Firewall V1 configuration and attached to the Web Application Firewall V2 gateway.

### Steps to run the script

1. Use `Connect-AzAccount` to connect to Azure.

2. Use `Import-Module Az` to import the Az modules.

3. Run the `Set-AzContext` cmdlet to set the active Azure context to the correct subscription. This step is important because the migration script might clean up the existing resource group if the group doesn't exist in the current subscription context.

   ```
   Set-AzContext -Subscription '<V1 application gateway SubscriptionId>'
   ```

4. Install the script by following the steps in [Installing the script](#installing-the-script) later in this article.

5. Run the script by using the appropriate parameters. The script might take five to seven minutes to finish.

   ```
   ./AzureAppGWClone.ps1
   -resourceId <V1 application gateway resource ID>
   -subnetAddressRange <subnet space you want to use>
   -appgwName <string to use to append>
   -AppGWResourceGroupName <resource group name you want to use>
   -privateIpAddress <private IP string>
   -publicIpResourceId <public IP name string>
   - disableAutoscale
   -wafpolicyname <wafpolicyname>
   ```

    Here's an example:

   ```azurepowershell
   ./AzureAppGWClone.ps1 `
   -resourceId /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/MyResourceGroup/providers/Microsoft.Network/applicationGateways/myv1appgateway `
   -subnetAddressRange 10.0.0.0/24 `
   -appgwname "MynewV2gw" `
   -AppGWResourceGroupName "MyResourceGroup" `
   -privateIpAddress "10.0.0.1" `
   -publicIpResourceId "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/MyResourceGroup/providers/Microsoft.Network/publicIPAddresses/MyPublicIP" `
   ```

### Recommendations

- After script completion, review the V2 gateway configuration in the Azure portal and test connectivity by sending traffic directly to the V2 gateway's IP.

- The script relaxes backend TLS validation by default (no certificate chain, expiry, or SNI validation) during cloning. If you need stricter TLS validation or authentication certificates, you can update your Application Gateway V2 deployment after creation to add trusted root certificates and enable this feature.

- For NTLM and Kerberos passthrough, set the dedicated backend connection to `true` in HTTP settings after cloning.

### Caveats

- You must provide an IP address space for another subnet within the virtual network that contains your V1 gateway. The script can't create the V2 gateway in a subnet that already has a V1 gateway. If the subnet already has a V2 gateway, the script might still work if enough IP address space is available.

- If you have a network security group (NSG) or user-defined routes (UDRs) associated with the V2 gateway subnet, make sure they adhere to the [NSG requirements](../application-gateway/configuration-infrastructure.md#network-security-groups) and [UDR requirements](../application-gateway/configuration-infrastructure.md#supported-user-defined-routes) for a successful migration.

- If you have FIPS mode enabled for your V1 gateway, it isn't migrated to your new V2 gateway.

- Web Application Firewall V2 is configured to use Core Rule Set (CRS) 3.0 by default. Because CRS 3.0 is on the path to deprecation, upgrade to the latest rule set after migration: Default Rule Set (DRS) 2.2. For more information, see [Web Application Firewall DRS and CRS rule groups and rules](../web-application-firewall/ag/application-gateway-crs-rulegroups-rules.md).

> [!NOTE]
> During migration, don't attempt any other operation on the V1 gateway or any associated resources.

## Legacy cloning script

The legacy cloning script facilitates the transition by:

- Creating a new Standard V2 or Web Application Firewall V2 application gateway in a user-specified virtual network subnet.
- Automatically copying the configuration from an existing Standard or Web Application Firewall V1 gateway to the newly created V2 gateway.
- Requiring you to provide TLS/SSL and authentication certificates as input. This script doesn't support private-only V2 gateways.
You can download this cloning script from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureAppGWMigration).

### Parameters for the script

The legacy script takes the following parameters:

- `resourceId`. This required parameter is the Azure resource ID for your existing Standard V1 or Web Application Firewall V1 gateway. To find this string value, go to the Azure portal, select your Application Gateway or Web Application Firewall resource, and select the **Properties** link for the gateway. The resource ID is on that pane.

  You can also run the following Azure PowerShell commands to get the resource ID:

  ```azurepowershell
  $appgw = Get-AzApplicationGateway -Name <V1 gateway name> -ResourceGroupName <resource group Name>
  $appgw.Id
  ```

- `subnetAddressRange`. This required string parameter is the IP address space that you allocated (or want to allocate) for a new subnet that contains your new V2 gateway. The address space must be specified in the CIDR notation. An example is `10.0.0.0/24`.

   You don't need to create this subnet in advance, but the CIDR needs to be part of the address space for the virtual network. The script creates it for you if it doesn't exist. If it exists, the script uses the existing one. Make sure the subnet is empty or contains only the V2 gateway, and that it has enough available IPs.

- `appgwName`. You specify this optional string as the name for the new Standard V2 or Web Application Firewall V2 gateway. If you don't supply this parameter, the name of your existing V1 gateway is used with the suffix `_V2` appended.

- `AppGWResourceGroupName`. This optional string is the name of the resource group where you want Application Gateway V2 resources to be created. The default value is `<V1-app-gw-rgname>`.

  Ensure that no existing application gateway with the provided `AppGWV2Name` and `AppGWResourceGroupName` values is in the V1 subscription. This parameter rewrites the existing resources.

- `sslCertificates`. This parameter provides a comma-separated list of `PSApplicationGatewaySslCertificate` objects that you create to represent the TLS/SSL certificates from your V1 gateway that must be uploaded to the new V2 gateway.

  For each of your TLS/SSL certificates configured for your Standard V1 or Web Application Firewall V1 gateway, you can create a new `PSApplicationGatewaySslCertificate` object via the `New-AzApplicationGatewaySslCertificate` command shown in the following code. You need the path to your TLS/SSL certificate file and the password.

  This parameter is optional only if you don't have HTTPS listeners configured for your V1 gateway or for Web Application Firewall. If you have at least one HTTPS listener set up, you must specify this parameter.

  ```azurepowershell
       $password = ConvertTo-SecureString <cert-password> -AsPlainText -Force
       $mySslCert1 = New-AzApplicationGatewaySslCertificate -Name "Cert01" `
      -CertificateFile <Cert-File-Path-1> `
       Password $password
       $mySslCert2 = New-AzApplicationGatewaySslCertificate -Name "Cert02" `
      -CertificateFile <Cert-File-Path-2> `
      -Password $password
   ```

  You can pass in `$mySslCert1, $mySslCert2` (comma separated) in the previous example as values for this parameter in the script.

- `sslCertificates`. You use this optional parameter to download the certificates stored in Azure Key Vault and pass it to the migration script. To download the certificate as a PFX file, run the following command. These commands access `SecretId` and then save the content as a PFX file.

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

   For each of the certificates downloaded from Key Vault, you can create a new `PSApplicationGatewaySslCertificate` object via the `New-AzApplicationGatewaySslCertificate` command shown in the following code. You need the path to your TLS/SSL certificate file and the password.

   ```azurepowershell
   //Convert the downloaded certificate to SSL object
   $password = ConvertTo-SecureString  <password> -AsPlainText -Force 
   $cert = New-AzApplicationGatewaySSLCertificate -Name <certname> -CertificateFile <Cert-File-Path-1> -Password $password 
   ```

- `trustedRootCertificates`. Use this optional parameter to create a comma-separated list of `PSApplicationGatewayTrustedRootCertificate` objects to represent the [trusted root certificates](ssl-overview.md) for authentication of your backend instances from your V2 gateway.

  ```azurepowershell
   $certFilePath = ".\rootCA.cer"
   $trustedCert = New-AzApplicationGatewayTrustedRootCertificate -Name "trustedCert1" -CertificateFile $certFilePath
  ```

   To create a list of `PSApplicationGatewayTrustedRootCertificate` objects, see [New-AzApplicationGatewayTrustedRootCertificate](/powershell/module/Az.Network/New-AzApplicationGatewayTrustedRootCertificate).

- `privateIpAddress`. Use this optional string to provide a specific private IP address that you want to associate with your new V2 gateway. It must be from the same virtual network that you allocate for your new V2 gateway. If you don't specify this parameter, the script allocates a private IP address for your V2 gateway.

- `publicIpResourceId`. Use this optional string to provide the resource ID of an existing public IP address (Standard tier) resource in your subscription that you want to allocate to the new V2 gateway. If you provide the public IP resource name, ensure that it exists in a succeeded state.

  If you don't specify this parameter, the script allocates a new public IP address in the same resource group. The name is the V2 gateway's name with `-IP` appended. If you provide `AppGWResourceGroupName` without providing a public IP address, ensure that a public IP resource with the name `AppGWV2Name-IP` doesn't exist in a resource group with the name `AppGWResourceGroupName` in the V1 subscription.

- `validateMigration`. Use this optional switch parameter to enable the script to do some basic configuration comparison validations after the V2 gateway creation and the configuration copy. By default, no validation is done.

- `enableAutoScale`. Use this optional switch parameter to enable the script to enable autoscaling on the new V2 gateway after it's created. By default, autoscaling is disabled. You can always manually enable it later on the newly created V2 gateway.

### Steps to run the script

1. Use `Connect-AzAccount` to connect to Azure.

2. Use `Import-Module Az` to import the Az modules.

3. Run the `Set-AzContext` cmdlet to set the active Azure context to the correct subscription. This step is important because the migration script might clean up the existing resource group if it doesn't exist in current subscription context.

   ```
   Set-AzContext -Subscription '<V1 application gateway SubscriptionId>'
   ```

4. Install the script by following the steps in [Installing the script](#installing-the-script) later in this article.

5. Run `Get-Help AzureAppGWMigration.ps1` to examine the required parameters.

6. Run the script by using the appropriate parameters. The script might take five to seven minutes to finish.

   ```Azurepowershell
      ./AzureAppGWMigration.ps1
      -resourceId <V1 application gateway resource ID>
      -subnetAddressRange <subnet space you want to use>
      -appgwName <string to use to append>
      -AppGWResourceGroupName <resource group name you want to use>
      -sslCertificates <comma-separated SSLCert objects as above>
      -trustedRootCertificates <comma-separated Trusted Root Cert objects as above>
      -privateIpAddress <private IP string>
      -publicIpResourceId <public IP name string>
      -validateMigration -enableAutoScale
   ```

   Here's an example:

   ```Azurepowershell
      ./AzureAppGWMigration.ps1 `
      -resourceId /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/MyResourceGroup/providers/Microsoft.Network/applicationGateways/myv1appgateway `
      -subnetAddressRange 10.0.0.0/24 `
      -appgwname "MynewV2gw" `
      -AppGWResourceGroupName "MyResourceGroup" `
      -sslCertificates $mySslCert1,$mySslCert2 `
      -trustedRootCertificates $trustedCert `
      -privateIpAddress "10.0.0.1" `
      -publicIpResourceId "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/MyResourceGroup/providers/Microsoft.Network/publicIPAddresses/MyPublicIP" `
      -validateMigration -enableAutoScale
   ```

### Caveats and limitations

- The new V2 gateway has new public and private IP addresses. You can't move the IP addresses associated with the existing V1 gateway seamlessly to V2. However, you can allocate an existing (unallocated) public or private IP address to the new V2 gateway.

- You must provide an IP address space for another subnet within your virtual network that contains your V1 gateway. The script can't create the V2 gateway in a subnet that already has a V1 gateway. If the subnet already has a V2 gateway, the script might still work if enough IP address space is available.

- If you have an NSG or UDRs associated with the V2 gateway subnet, make sure they adhere to the [NSG requirements](../application-gateway/configuration-infrastructure.md#network-security-groups) and [UDR requirements](../application-gateway/configuration-infrastructure.md#supported-user-defined-routes) for a successful migration.

- [Virtual network service endpoint policies](../virtual-network/virtual-network-service-endpoint-policies-overview.md) are currently not supported in an Application Gateway subnet.

- To migrate a TLS/SSL configuration, you must specify all the TLS/SSL certificates used in your V1 gateway.

- If you have FIPS mode enabled for your V1 gateway, it isn't migrated to your new V2 gateway.

- The Web Application Firewall V2 instance is created in the old Web Application Firewall configuration mode. Migration to the Web Application Firewall policy is required.

- Web Application Firewall V2 is configured to use CRS 3.0 by default. Because CRS 3.0 is on the path to deprecation, upgrade to the latest rule set (DRS 2.2) after migration. For more information, see [CRS and DRS rule groups and rules](../web-application-firewall/ag/application-gateway-crs-rulegroups-rules.md).

> [!NOTE]
> Application Gateway V2 supports NTLM and Kerberos passthrough authentication. For more information, see [Dedicated backend connection](configuration-http-settings.md#dedicated-backend-connection).

## Installing the script

> [!NOTE]
> Run the `Set-AzContext -Subscription <V1 application gateway SubscriptionId>` cmdlet every time before you run the migration script. This step is necessary to set the active Azure context to the correct subscription, because the migration script might clean up the existing resource group if it doesn't exist in current subscription context.

You have two options, depending on your local PowerShell environment setup and preferences:

- If you don't have the Azure Az modules installed, or you don't mind uninstalling the Azure Az modules, the best option is to use the `Install-Script` option to run the script.
- If you need to keep the Azure Az modules, download the script and run it directly.

To determine if you have the Azure Az modules installed, run `Get-InstalledModule -Name az`. If you don't see any installed Az modules, you can use the `Install-Script` method.

### Install by using the Install-Script method (recommended)

To use this option, you must not have the Azure Az modules installed on your computer. If they're installed, the following command displays an error. You can either uninstall the Azure Az modules or use the other option to download the script manually and run it.

Run the script with one of the following commands to get the latest version:

- For the enhanced cloning script with public IP retention, use `Install-Script -Name AzureAppGWIPMigrate -Force`.
- For the enhanced cloning script, use `Install-Script -Name AzureAppGWClone -Force`.
- For the legacy cloning script, use `Install-Script -Name AzureAppGWMigration -Force`.

The command also installs the required Az modules.

### Install by using the script directly

If you have some Azure Az modules installed and can't uninstall them (or you don't want to uninstall them), you can manually download the script by using the **Manual Download** tab in the script download link.

The script is downloaded as a raw .nupkg file. To install the script from this .nupkg file, see [Manual Package Download](/powershell/gallery/how-to/working-with-packages/manual-download).

For the legacy cloning script, version 1.0.11 is the new version of the migration script. It includes major bug fixes. Make sure to use the latest stable version from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureAppGWMigration).

### Check the version of the downloaded script

1. Extract the contents of the NuGet package.

2. Open the `.PS1` file in the folder and check the `.VERSION` value to confirm the version of the downloaded script.

    ```
    <#PSScriptInfo
    .VERSION 1.0.10
    .GUID aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb
    .AUTHOR Microsoft Corporation
    .COMPANYNAME Microsoft Corporation
    .COPYRIGHT Microsoft Corporation. All rights reserved.
    ```

## Traffic migration

### Prerequisites

- In the Azure portal, verify that the script successfully created a new V2 gateway with the exact configuration migrated over from your V1 gateway.
- Send a small amount of traffic through the V2 gateway as a manual test.

### Public IP retention script

After you successfully migrate the configuration and thoroughly test your new V2 gateway, this step focuses on redirecting live traffic.

We provide an Azure PowerShell script that *retains the public IP address from V1*. Here are important considerations for the script:

- The script reserves the Basic public IP from V1, converts it to Standard, and attaches it to the V2 gateway. This action effectively redirects all incoming traffic to the V2 gateway.
- This IP swap operation typically results in a brief *downtime of approximately one to five minutes*. Plan accordingly.
- After a successful script run, the public IP is moved from Application Gateway V1 to Application Gateway V2. Application Gateway V1 receives a new public IP.
- During IP migration, don't attempt any other operation on the V1 and V2 gateways or any associated resources.
- The public IP swap that this script performs is irreversible. After you initiate it, you can't revert the IP to the V1 gateway by using the script.

> [!NOTE]
> The IP migration script does not support public IP address resources that have a DNS name beginning with a numeric character. This limitation exists because public IP address resources don't allow DNS name labels that start with a number. This issue is more likely to occur for V1 gateways *created before May 2023*, when public IP addresses were automatically assigned a default DNS name of the form `{GUID}.cloudapp.net`.
>
> To proceed with migration, update the public IP address resource to use a DNS name label that begins with a letter before running the script. [Learn about configuring public IP DNS](../virtual-network/ip-services/public-ip-addresses.md#domain-name-label).

You can download this public IP retention script from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureAppGWIPMigrate).

#### Parameters for the script

This script requires the following mandatory parameters:

- `v1resourceId`. The resource ID of the V1 gateway whose public IP will be reserved and associated with V2.
- `v2resourceId`. The resource ID of the V2 gateway to which the V1 public IP will be assigned. You can create the V2 gateway manually or by using any one of the cloning scripts.

After you download and [install the script](#installing-the-script), run `AzureAppGWIPMigrate.ps1` with the required parameters:

```azurepowershell
   ./AzureAppGWIPMigrate.ps1
    -v1resourceId <V1 application gateway resource ID>
    -v2resourceId <V2 application gateway resource ID>
```

Here's an example:

```azurepowershell
   ./AzureAppGWIPMigrate.ps1 `
   -v1resourceId /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/MyResourceGroup/providers/Microsoft.Network/applicationGateways/myv1appgateway `
   -v2resourceId /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/MyResourceGroup/providers/Microsoft.Network/applicationGateways/myv2appgateway `
```

After the IP swap finishes, verify control plane and data plane operations on the V2 gateway. All control plane actions except deletion are disabled on the V1 gateway.

### Traffic migration recommendations

The following items are a few scenarios where your current application gateway (Standard) can receive client traffic, and our recommendations for each one:

- **A custom DNS zone (for example, contoso.com) points to the frontend IP address (by using an A record) associated with your Standard V1 or Web Application Firewall V1 gateway**.

  You can update your DNS record to point to the frontend IP or DNS label associated with your Standard V2 application gateway. Depending on the time to live (TTL) configured on your DNS record, it can take a while for all your client traffic to migrate to your new V2 gateway.

- **A custom DNS zone (for example, contoso.com) points to the DNS label (for example, myappgw.eastus.cloudapp.azure.com by using a CNAME record) associated with your V1 gateway**.

  You have two choices:
  
  - If you use public IP addresses on your application gateway, you can do a controlled, granular migration by using an Azure Traffic Manager profile to incrementally route traffic to the new V2 gateway.

    You can use this weighted traffic-routing method by adding the DNS labels of both the V1 and V2 application gateways to the [Traffic Manager profile](../traffic-manager/traffic-manager-routing-methods.md#weighted-traffic-routing-method). Then, apply CNAME on your custom DNS record (for example, `www.contoso.com`) to the Traffic Manager domain (for example, `contoso.trafficmanager.net`).

  - You can update your custom domain DNS record to point to the DNS label of the new V2 application gateway. Depending on the TTL configured on your DNS record, it can take a while for all your client traffic to migrate to your new V2 gateway.

- **Your clients connect to the frontend IP address of your application gateway**.

  Update your clients to use the IP address associated with the newly created V2 application gateway. We recommend that you don't use IP addresses directly. Consider using the DNS name label (for example, `yourgateway.eastus.cloudapp.azure.com`) associated with your application gateway that you can apply to your own custom DNS zone via CNAME (for example, `contoso.com`).

## Post-migration tasks

After traffic migration succeeds and you fully verify that the application runs correctly through the V2 gateway, you can safely decommission and delete the old Application Gateway V1 resource to avoid unnecessary costs.

## Pricing considerations

The pricing models are different for Application Gateway V1 and V2. V2 is charged based on consumption. For pricing information, see [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/) before you migrate.

### Cost-efficiency guidance

Application Gateway V2 comes with a range of advantages, such as:

- A performance boost of 5x.
- Improved security with Key Vault integration.
- Faster updates of security rules in Web Application Firewall V2.
- Web Application Firewall custom rules.
- Policy associations.
- Bot protection.

Application Gateway V2 also offers high scalability, optimized traffic routing, and seamless integration with Azure services. These features can improve the overall user experience, prevent slowdowns during times of heavy traffic, and help you avoid expensive data breaches.

Five variants are available in V1, based on the tier and size: Standard Small, Standard Medium, Standard Large, Web Application Firewall Medium, and Web Application Firewall Large. For pricing information according to your region, see the [pricing page](https://azure.microsoft.com/pricing/details/application-gateway/).

The scenarios in the following table are examples for illustration purposes only. The calculations are based on East US and for a gateway with two instances in V1. The variable cost in V2 is based on one of the three dimensions with highest usage: new connections (50 per second), persistent connections (2,500 per minute), and throughput (2.22 Mbps per capacity unit).

| Variant | V1 fixed price/month | V2 fixed price/month | Recommendation |
| --- | :---------------: | :---------------: | :------------: |
| Standard Medium | 102.2 | 179.8 | V2 can handle a larger number of requests than a V1 gateway, so we recommend consolidating multiple V1 gateways into a single V2 gateway to optimize the cost. Ensure that consolidation doesn't exceed the Application Gateway [limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-application-gateway-limits). We recommend 3:1 consolidation. |
| Web Application Firewall Medium | 183.96 | 262.8 | Same as for Standard Medium |
| Standard Large | 467.2 | 179.58 | For this variant, in most cases, moving to a V2 gateway can provide a better price benefit compared to V1. |
| Web Application Firewall Large | 654.08 | 262.8 | Same as for Standard Large. |

For further concerns about the pricing, work with your customer success account manager (CSAM) or get in touch with our support team for assistance.

## Common questions

For answers to common questions about migration, see [Frequently asked questions about Application Gateway V1 retirement](./retirement-faq.md#common-questions-about-migration-from-v1-to-v2).

## Related content

- [Learn about Application Gateway V2](application-gateway-autoscaling-zone-redundant.md)
