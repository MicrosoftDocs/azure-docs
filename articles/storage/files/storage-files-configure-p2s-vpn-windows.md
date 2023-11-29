---
title: Configure a point-to-site (P2S) VPN on Windows for use with Azure Files
description: How to configure a point-to-site (P2S) VPN on Windows for use with Azure Files
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 11/29/2023
ms.author: kendownie
ms.custom: devx-track-azurepowershell
---

# Configure a point-to-site (P2S) VPN on Windows for use with Azure Files

You can use a point-to-site (P2S) VPN connection to mount your Azure file shares over SMB from outside of Azure, without opening up port 445. A point-to-site VPN connection is a VPN connection between Azure and an individual client. To use a P2S VPN connection with Azure Files, you must configure a VPN connection for each client that wants to connect. If you have many clients that need to connect to your Azure file shares from your on-premises network, you can use a site-to-site (S2S) VPN connection instead of a point-to-site connection for each client. To learn more, see [Configure a site-to-site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).

We strongly recommend that you read [Networking considerations for direct Azure file share access](storage-files-networking-overview.md) before continuing with this how-to article for a complete discussion of the networking options available for Azure Files.

The article details the steps to configure a point-to-site VPN on Windows (Windows client and Windows Server) to mount Azure file shares directly on-premises. If you're looking to route Azure File Sync traffic over a VPN, see [configuring Azure File Sync proxy and firewall settings](../file-sync/file-sync-firewall-and-proxy.md).

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Prerequisites

- The most recent version of the Azure PowerShell module. See [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell).

- An Azure file share you would like to mount on-premises. Azure file shares are deployed within storage accounts, which are management constructs that represent a shared pool of storage in which you can deploy multiple file shares, as well as other storage resources. Learn more about how to deploy Azure file shares and storage accounts in [Create an Azure file share](storage-how-to-create-file-share.md).

- A [virtual network](../../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md) with a private endpoint for the storage account that contains the Azure file share you want to mount on-premises. To learn how to create a private endpoint, see [Configuring Azure Files network endpoints](storage-files-networking-endpoints.md?tabs=azure-powershell).

- You must create a [gateway subnet](../../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsub) on the virtual network. To create a gateway subnet, sign into the Azure portal, navigate to the virtual network, select **Settings > Subnets**, and then select **+ Gateway subnet**. When you create the gateway subnet, you specify the number of IP addresses that the subnet contains. The number of IP addresses needed depends on the VPN gateway configuration that you want to create. It's best to specify /27 or larger (/26, /25 etc.) to allow enough IP addresses for future changes, such as adding an ExpressRoute gateway.

## Collect environment information

Before setting up the point-to-site VPN, you need to collect some information about your environment. Replace `<resource-group>`, `<vnet-name>`, `<subnet-name>`, and `<storage-account-name>` with the appropriate values for your environment.

```PowerShell
$resourceGroupName = "<resource-group-name>" 
$virtualNetworkName = "<vnet-name>"
$subnetName = "<subnet-name>"
$storageAccountName = "<storage-account-name>"

$virtualNetwork = Get-AzVirtualNetwork `
    -ResourceGroupName $resourceGroupName `
    -Name $virtualNetworkName

$subnetId = $virtualNetwork | `
    Select-Object -ExpandProperty Subnets | `
    Where-Object { $_.Name -eq "StorageAccountSubnet" } | `
    Select-Object -ExpandProperty Id

$storageAccount = Get-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName

$privateEndpoint = Get-AzPrivateEndpoint | `
    Where-Object {
        $subnets = $_ | `
            Select-Object -ExpandProperty Subnet | `
            Where-Object { $_.Id -eq $subnetId }

        $connections = $_ | `
            Select-Object -ExpandProperty PrivateLinkServiceConnections | `
            Where-Object { $_.PrivateLinkServiceId -eq $storageAccount.Id }
        
        $null -ne $subnets -and $null -ne $connections
    } | `
    Select-Object -First 1
```

## Create root certificate for VPN authentication

In order for VPN connections from your on-premises Windows machines to be authenticated to access your virtual network, you must create two certificates: a root certificate, which will be provided to the virtual machine gateway, and a client certificate, which will be signed with the root certificate.

You can use either a root certificate that was generated with an enterprise solution, or generate a self-signed certificate. If you're using an enterprise solution, acquire the .cer file for the root certificate that you want to use. If you aren't using an enterprise certificate solution, create a self-signed root certificate using this PowerShell script. You'll create the client certificate after deploying the virtual network gateway.

> [!IMPORTANT]
> Run this PowerShell script as administrator from an on-premises machine running Windows 10 or later. Don't run the script from a Cloud Shell or VM in Azure.

```PowerShell
$rootcertname = "CN=P2SRootCert"
$certLocation = "Cert:\CurrentUser\My"
$vpnTemp = "C:\vpn-temp\"
$exportedencodedrootcertpath = $vpnTemp + "P2SRootCertencoded.cer"
$exportedrootcertpath = $vpnTemp + "P2SRootCert.cer"

if (-Not (Test-Path $vpnTemp)) {
    New-Item -ItemType Directory -Force -Path $vpnTemp | Out-Null
}

if ($PSVersionTable.PSVersion -ge [System.Version]::new(6, 0)) {
    Install-Module WindowsCompatibility
    Import-WinModule PKI
}

$rootcert = New-SelfSignedCertificate `
    -Type Custom `
    -KeySpec Signature `
    -Subject $rootcertname `
    -KeyExportPolicy Exportable `
    -HashAlgorithm sha256 `
    -KeyLength 2048 `
    -CertStoreLocation $certLocation `
    -KeyUsageProperty Sign `
    -KeyUsage CertSign

Export-Certificate `
    -Cert $rootcert `
    -FilePath $exportedencodedrootcertpath `
    -NoClobber | Out-Null

certutil -encode $exportedencodedrootcertpath $exportedrootcertpath | Out-Null

$rawRootCertificate = Get-Content -Path $exportedrootcertpath

[System.String]$rootCertificate = ""
foreach($line in $rawRootCertificate) { 
    if ($line -notlike "*Certificate*") { 
        $rootCertificate += $line 
    } 
}
```

## Deploy virtual network gateway

The Azure virtual network gateway is the service that your on-premises Windows machines will connect to. If you haven't already, you must create a [gateway subnet](../../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsub) on the virtual network before deploying the virtual network gateway.

Deploying a virtual network gateway requires two basic components:

1. A public IP address that will identify the gateway to your clients wherever they are in the world
2. The root certificate you created in the previous step, which will be used to authenticate your clients

You can use the Azure portal or Azure PowerShell to deploy the virtual network gateway. Deployment can take up to 45 minutes to complete.

# [Portal](#tab/azure-portal)

To deploy a virtual network gateway using the Azure portal, follow these instructions.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In **Search resources, services, and docs**, type virtual network gateways. Locate Virtual network gateways in the Marketplace search results and select it

1. Select **+ Create** to create a new virtual network gateway.

1. On the **Basics** tab, fill in the values for **Project details** and **Instance details**.

   :::image type="content" source="media/storage-files-configure-p2s-vpn-windows/create-virtual-network-gateway.png" alt-text="Screenshot showing how to create a virtual network gateway in the Azure portal." lightbox="media/storage-files-configure-p2s-vpn-windows/create-virtual-network-gateway.png":::

   * **Subscription**: Select the subscription you want to use from the dropdown.
   * **Resource Group**: This setting is autofilled when you select your virtual network on this page.
   * **Name**: Name your gateway. Naming your gateway not the same as naming a gateway subnet. It's the name of the gateway object you're creating.
   * **Region**: Select the region in which you want to create this resource. The region for the gateway must be the same as the virtual network.
   * **Gateway type**: Select **VPN**. VPN gateways use the virtual network gateway type **VPN**.
   * **SKU**: Select the gateway SKU that supports the features you want to use from the dropdown. See [Gateway SKUs](../../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsku).
   * **Generation**: Select the generation you want to use. We recommend using a Generation2 SKU. For more information, see [Gateway SKUs](../../vpn-gateway/vpn-gateway-about-vpngateways.md#gwsku).
   * **Virtual network**: From the dropdown, select the virtual network to which you want to add this gateway. If you can't see the VNet for which you want to create a gateway, make sure you selected the correct subscription and region in the previous settings.
   * **Subnet**: This field should be grayed out and list the name of the gateway subnet you created and its IP address range.

1. Specify in the values for **Public IP address**. These settings specify the public IP address object that gets associated to the VPN gateway. The public IP address is assigned to this object when the VPN gateway is created. The only time the primary public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway.

   :::image type="content" source="media/storage-files-configure-p2s-vpn-windows/create-public-ip-address.png" alt-text="Screenshot showing how to specify the public IP address for a virtual network gateway in the Azure portal." lightbox="media/storage-files-configure-p2s-vpn-windows/create-public-ip-address.png":::

   * **Public IP address**: Leave **Create new** selected.
   * **Public IP address name**: In the text box, type a name for your public IP address instance.
   * **Public IP address SKU**: Setting is autoselected.
   * **Assignment**: The assignment is typically autoselected and can be either Dynamic or Static.
   * **Enable active-active mode**: Select **Disabled**. Only enable this setting if you're creating an active-active gateway configuration.
   * **Configure BGP**: Select **Disabled**, unless your configuration specifically requires this setting. If you do require this setting, the default ASN is 65515, although this value can be changed.

1. Select **Review + create** to run validation.

1. Once validation passes, select **Create** to deploy the virtual network gateway.

# [PowerShell](#tab/azure-powershell)

Replace `<desired-vpn-name>`, `<desired-region>`, and `<gateway-subnet-name>` in the following script with the proper values for these variables.

While this resource is being deployed, this PowerShell script will block the deployment from being completed. This is expected.

```PowerShell
$vpnName = "<desired-vpn-name>" 
$publicIpAddressName = "$vpnName-PublicIP"
$region = "<desired-region>"
$gatewaySubnet = "<gateway-subnet-name>"

$publicIPAddress = New-AzPublicIpAddress `
    -ResourceGroupName $resourceGroupName `
    -Name $publicIpAddressName `
    -Location $region `
    -Sku Basic `
    -AllocationMethod Dynamic

$gatewayIpConfig = New-AzVirtualNetworkGatewayIpConfig `
    -Name "vnetGatewayConfig" `
    -SubnetId $gatewaySubnet.Id `
    -PublicIpAddressId $publicIPAddress.Id

$azRootCertificate = New-AzVpnClientRootCertificate `
    -Name "P2SRootCert" `
    -PublicCertData $rootCertificate

$vpn = New-AzVirtualNetworkGateway `
    -ResourceGroupName $resourceGroupName `
    -Name $vpnName `
    -Location $region `
    -GatewaySku VpnGw1 `
    -GatewayType Vpn `
    -VpnType RouteBased `
    -IpConfigurations $gatewayIpConfig `
    -VpnClientAddressPool "172.16.201.0/24" `
    -VpnClientProtocol IkeV2 `
    -VpnClientRootCertificates $azRootCertificate
```
---

## Create client certificate

The following script creates the client certificate with the URI of the virtual network gateway. This certificate is signed with the root certificate you created earlier.

```PowerShell
$clientcertpassword = "1234"

$vpnClientConfiguration = New-AzVpnClientConfiguration `
    -ResourceGroupName $resourceGroupName `
    -Name $vpnName `
    -AuthenticationMethod EAPTLS

Invoke-WebRequest `
    -Uri $vpnClientConfiguration.VpnProfileSASUrl `
    -OutFile "$vpnTemp\vpnclientconfiguration.zip"

Expand-Archive `
    -Path "$vpnTemp\vpnclientconfiguration.zip" `
    -DestinationPath "$vpnTemp\vpnclientconfiguration"

$vpnGeneric = "$vpnTemp\vpnclientconfiguration\Generic"
$vpnProfile = ([xml](Get-Content -Path "$vpnGeneric\VpnSettings.xml")).VpnProfile

$exportedclientcertpath = $vpnTemp + "P2SClientCert.pfx"
$clientcertname = "CN=" + $vpnProfile.VpnServer

$clientcert = New-SelfSignedCertificate `
    -Type Custom `
    -DnsName $vpnProfile.VpnServer `
    -KeySpec Signature `
    -Subject $clientcertname `
    -KeyExportPolicy Exportable `
    -HashAlgorithm sha256 `
    -KeyLength 2048 `
    -CertStoreLocation $certLocation `
    -Signer $rootcert `
    -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.2")

$mypwd = ConvertTo-SecureString -String $clientcertpassword -Force -AsPlainText

Export-PfxCertificate `
    -FilePath $exportedclientcertpath `
    -Password $mypwd `
    -Cert $clientcert | Out-Null
```

## Configure the VPN client

The Azure virtual network gateway will create a downloadable package with configuration files required to initialize the VPN connection on your on-premises Windows machine. You'll configure the VPN connection using the [Always On VPN](/windows-server/remote/remote-access/vpn/always-on-vpn/) feature introduced in Windows 10/Windows Server 2016. This package also contains executables that will configure the legacy Windows VPN client, if desired. This guide uses Always On VPN rather than the legacy Windows VPN client because the Always On VPN client allows you to connect/disconnect from the Azure VPN without having administrator permissions to the machine.

The following script will install the client certificate required for authentication against the virtual network gateway, and then download and install the VPN package. Remember to replace `<computer1>` and `<computer2>` with the desired computers. You can run this script on as many machines as you desire by adding more PowerShell sessions to the `$sessions` array. Your user account must be an administrator on each of these machines. If one of these machines is the local machine you're running the script from, you must run the script from an elevated PowerShell session.

```PowerShell
$sessions = [System.Management.Automation.Runspaces.PSSession[]]@()
$sessions += New-PSSession -ComputerName "<computer1>"
$sessions += New-PSSession -ComputerName "<computer2>"

foreach ($session in $sessions) {
    Invoke-Command -Session $session -ArgumentList $vpnTemp -ScriptBlock { 
        $vpnTemp = $args[0]
        if (-Not (Test-Path $vpnTemp)) {
            New-Item `
                -ItemType Directory `
                -Force `
                -Path "C:\vpn-temp" | Out-Null
        }
    }

    Copy-Item `
        -Path $exportedclientcertpath, $exportedrootcertpath, "$vpnTemp\vpnclientconfiguration.zip" `
        -Destination $vpnTemp `
        -ToSession $session

    Invoke-Command `
        -Session $session `
        -ArgumentList `
            $mypwd, `
            $vpnTemp, `
            $virtualNetworkName `
        -ScriptBlock { 
            $mypwd = $args[0] 
            $vpnTemp = $args[1]
            $virtualNetworkName = $args[2]

            Import-PfxCertificate `
                -Exportable `
                -Password $mypwd `
                -CertStoreLocation "Cert:\LocalMachine\My" `
                -FilePath "$vpnTemp\P2SClientCert.pfx" | Out-Null

            Import-Certificate `
                -FilePath "$vpnTemp\P2SRootCert.cer" `
                -CertStoreLocation "Cert:\LocalMachine\Root" | Out-Null

            Expand-Archive `
                -Path "$vpnTemp\vpnclientconfiguration.zip" `
                -DestinationPath "$vpnTemp\vpnclientconfiguration"
            $vpnGeneric = "$vpnTemp\vpnclientconfiguration\Generic"

            $vpnProfile = ([xml](Get-Content -Path "$vpnGeneric\VpnSettings.xml")).VpnProfile

            Add-VpnConnection `
                -Name $virtualNetworkName `
                -ServerAddress $vpnProfile.VpnServer `
                -TunnelType Ikev2 `
                -EncryptionLevel Required `
                -AuthenticationMethod MachineCertificate `
                -SplitTunneling `
                -AllUserConnection

            Add-VpnConnectionRoute `
                -Name $virtualNetworkName `
                -DestinationPrefix $vpnProfile.Routes `
                -AllUserConnection

            Add-VpnConnectionRoute `
                -Name $virtualNetworkName `
                -DestinationPrefix $vpnProfile.VpnClientAddressPool `
                -AllUserConnection

            rasdial $virtualNetworkName
        }
}

Remove-Item -Path $vpnTemp -Recurse
```

## Mount Azure file share

Now that you've set up your point-to-Site VPN, you can use it to mount the Azure file share to an on-premises machine. The following example will mount the share, list the root directory of the share to prove the share is actually mounted, and then unmount the share.

> [!NOTE]
> It isn't possible to mount the share persistently over PowerShell remoting. To mount persistently, see [Use an Azure file share with Windows](storage-how-to-use-files-windows.md).

```PowerShell
$myShareToMount = "<file-share>"

$storageAccountKeys = Get-AzStorageAccountKey `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName
$storageAccountKey = ConvertTo-SecureString `
    -String $storageAccountKeys[0].Value `
    -AsPlainText `
    -Force

$nic = Get-AzNetworkInterface -ResourceId $privateEndpoint.NetworkInterfaces[0].Id
$storageAccountPrivateIP = $nic.IpConfigurations[0].PrivateIpAddress

Invoke-Command `
    -Session $sessions `
    -ArgumentList  `
        $storageAccountName, `
        $storageAccountKey, `
        $storageAccountPrivateIP, `
        $myShareToMount `
    -ScriptBlock {
        $storageAccountName = $args[0]
        $storageAccountKey = $args[1]
        $storageAccountPrivateIP = $args[2]
        $myShareToMount = $args[3]

        $credential = [System.Management.Automation.PSCredential]::new(
            "AZURE\$storageAccountName", 
            $storageAccountKey)

        New-PSDrive `
            -Name Z `
            -PSProvider FileSystem `
            -Root "\\$storageAccountPrivateIP\$myShareToMount" `
            -Credential $credential `
            -Persist | Out-Null
        Get-ChildItem -Path Z:\
        Remove-PSDrive -Name Z
    }
```

## Rotate VPN Root Certificate

If a root certificate needs to be rotated due to expiration or new requirements, you can add a new root certificate to the existing virtual network gateway without redeploying the virtual network gateway. After adding the root certificate using the following script, you'll need to re-create the [VPN client certificate](#create-client-certificate).  

Replace `<resource-group-name>`, `<desired-vpn-name-here>`, and `<new-root-cert-name>` with your own values, then run the script.

```PowerShell
#Creating the new Root Certificate
$ResourceGroupName = "<resource-group-name>"
$vpnName = "<desired-vpn-name-here>"
$NewRootCertName = "<new-root-cert-name>"

$rootcertname = "CN=$NewRootCertName"
$certLocation = "Cert:\CurrentUser\My"
$date = get-date -Format "MM_yyyy"
$vpnTemp = "C:\vpn-temp_$date\"
$exportedencodedrootcertpath = $vpnTemp + "P2SRootCertencoded.cer"
$exportedrootcertpath = $vpnTemp + "P2SRootCert.cer"

if (-Not (Test-Path $vpnTemp)) {
    New-Item -ItemType Directory -Force -Path $vpnTemp | Out-Null
}

$rootcert = New-SelfSignedCertificate `
    -Type Custom `
    -KeySpec Signature `
    -Subject $rootcertname `
    -KeyExportPolicy Exportable `
    -HashAlgorithm sha256 `
    -KeyLength 2048 `
    -CertStoreLocation $certLocation `
    -KeyUsageProperty Sign `
    -KeyUsage CertSign

Export-Certificate `
    -Cert $rootcert `
    -FilePath $exportedencodedrootcertpath `
    -NoClobber | Out-Null

certutil -encode $exportedencodedrootcertpath $exportedrootcertpath | Out-Null

$rawRootCertificate = Get-Content -Path $exportedrootcertpath

[System.String]$rootCertificate = ""
foreach($line in $rawRootCertificate) { 
    if ($line -notlike "*Certificate*") { 
        $rootCertificate += $line 
    } 
}

#Fetching gateway details and adding the newly created Root Certificate.
$gateway = Get-AzVirtualNetworkGateway -Name $vpnName -ResourceGroupName $ResourceGroupName

Add-AzVpnClientRootCertificate `
    -PublicCertData $rootCertificate `
    -ResourceGroupName $ResourceGroupName `
    -VirtualNetworkGatewayName $gateway `
    -VpnClientRootCertificateName $NewRootCertName

```

## See also

- [Networking considerations for direct Azure file share access](storage-files-networking-overview.md)
- [Configure a point-to-site (P2S) VPN on Linux for use with Azure Files](storage-files-configure-p2s-vpn-linux.md)
- [Configure a site-to-site (S2S) VPN for use with Azure Files](storage-files-configure-s2s-vpn.md)