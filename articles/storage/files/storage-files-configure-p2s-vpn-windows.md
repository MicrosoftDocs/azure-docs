---
title: Configure a Point-to-Site (P2S) VPN on Windows for use with Azure Files
description: How to configure a Point-to-Site (P2S) VPN on Windows for use with Azure Files
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 11/08/2022
ms.author: kendownie
ms.custom: devx-track-azurepowershell
---

# Configure a Point-to-Site (P2S) VPN on Windows for use with Azure Files
You can use a Point-to-Site (P2S) VPN connection to mount your Azure file shares over SMB from outside of Azure, without opening up port 445. A Point-to-Site VPN connection is a VPN connection between Azure and an individual client. To use a P2S VPN connection with Azure Files, a P2S VPN connection will need to be configured for each client that wants to connect. If you have many clients that need to connect to your Azure file shares from your on-premises network, you can use a Site-to-Site (S2S) VPN connection instead of a Point-to-Site connection for each client. To learn more, see [Configure a Site-to-Site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).

We strongly recommend that you read [Networking considerations for direct Azure file share access](storage-files-networking-overview.md) before continuing with this how to article for a complete discussion of the networking options available for Azure Files.

The article details the steps to configure a Point-to-Site VPN on Windows (Windows client and Windows Server) to mount Azure file shares directly on-premises. If you're looking to route Azure File Sync traffic over a VPN, please see [configuring Azure File Sync proxy and firewall settings](../file-sync/file-sync-firewall-and-proxy.md).

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Prerequisites
- The most recent version of the Azure PowerShell module. For more information on how to install the Azure PowerShell, see [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell) and select your operating system. If you prefer to use the Azure CLI on Windows, you may, however the instructions below are presented for Azure PowerShell.

- An Azure file share you would like to mount on-premises. Azure file shares are deployed within storage accounts, which are management constructs that represent a shared pool of storage in which you can deploy multiple file shares, as well as other storage resources, such as blob containers or queues. You can learn more about how to deploy Azure file shares and storage accounts in [Create an Azure file share](storage-how-to-create-file-share.md).

- A virtual network with a private endpoint for the storage account containing the Azure file share you want to mount on-premises. To learn more about how to create a private endpoint, see [Configuring Azure Files network endpoints](storage-files-networking-endpoints.md?tabs=azure-powershell). 

- A [gateway subnet](../../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsub) must be created on the virtual network, and you'll need to know the name of the gateway subnet.

## Collect environment information
In order to set up the point-to-site VPN, we first need to collect some information about your environment for use throughout the guide. See the [prerequisites](#prerequisites) section if you have not already created a storage account, virtual network, gateway subnet, and/or private endpoints.

Remember to replace `<resource-group>`, `<vnet-name>`, `<subnet-name>`, and `<storage-account-name>` with the appropriate values for your environment.

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
In order for VPN connections from your on-premises Windows machines to be authenticated to access your virtual network, you must create two certificates: a root certificate, which will be provided to the virtual machine gateway, and a client certificate, which will be signed with the root certificate. The following PowerShell creates the root certificate; the client certificate will be created after the Azure virtual network gateway is created with information from the gateway. 

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
The Azure virtual network gateway is the service that your on-premises Windows machines will connect to. Before deploying the virtual network gateway, a [gateway subnet](../../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsub) must be created on the virtual network.

Deploying this service requires two basic components:

1. A public IP address that will identify the gateway to your clients wherever they are in the world
2. The root certificate you created earlier, which will be used to authenticate your clients

Remember to replace `<desired-vpn-name-here>`, `<desired-region-here>`, and `<gateway-subnet-name-here>` in the below script with the proper values for these variables.

> [!Note]  
> Deploying the Azure virtual network gateway can take up to 45 minutes. While this resource is being deployed, this PowerShell script will block for the deployment to be completed. This is expected.

```PowerShell
$vpnName = "<desired-vpn-name-here>" 
$publicIpAddressName = "$vpnName-PublicIP"
$region = "<desired-region-here>"
$gatewaySubnet = "<gateway-subnet-name-here>"

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

## Create client certificate
The client certificate is created with the URI of the virtual network gateway. This certificate is signed with the root certificate you created earlier.

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
The Azure virtual network gateway will create a downloadable package with configuration files required to initialize the VPN connection on your on-premises Windows machine. We will configure the VPN connection using the [Always On VPN](/windows-server/remote/remote-access/vpn/always-on-vpn/) feature introduced in Windows 10/Windows Server 2016. This package also contains executable packages which will configure the legacy Windows VPN client, if so desired. This guide uses Always On VPN rather than the legacy Windows VPN client as the Always On VPN client allows end-users to connect/disconnect from the Azure VPN without having administrator permissions to their machine. 

The following script will install the client certificate required for authentication against the virtual network gateway, download, and install the VPN package. Remember to replace `<computer1>` and `<computer2>` with the desired computers. You can run this script on as many machines as you desire by adding more PowerShell sessions to the `$sessions` array. Your use account must be an administrator on each of these machines. If one of these machines is the local machine you are running the script from, you must run the script from an elevated PowerShell session. 

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
Now that you have set up your Point-to-Site VPN, you can use it to mount the Azure file share on the computers you setup via PowerShell. The following example will mount the share, list the root directory of the share to prove the share is actually mounted, and the unmount the share. Unfortunately, it is not possible to mount the share persistently over PowerShell remoting. To mount persistently, see [Use an Azure file share with Windows](storage-how-to-use-files-windows.md). 

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
If a root certificate needs to be rotated due to expiration or new requirements, you can add a new root certificate to the existing virtual network gateway without the need for redeploying the virtual network gateway.  Once the root certificate is added using the following sample script, you will need to re-create [VPN client certificate](#create-client-certificate).  

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
- [Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files](storage-files-configure-p2s-vpn-linux.md)
- [Configure a Site-to-Site (S2S) VPN for use with Azure Files](storage-files-configure-s2s-vpn.md)