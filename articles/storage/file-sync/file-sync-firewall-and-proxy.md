---
title: Azure File Sync on-premises firewall and proxy settings
description: Understand Azure File Sync on-premises proxy and firewall settings. Review configuration details for ports, networks, and special connections to Azure.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 04/04/2023
ms.author: kendownie
---

# Azure File Sync proxy and firewall settings

Azure File Sync connects your on-premises servers to Azure Files, enabling multi-site synchronization and cloud tiering features. As such, an on-premises server must be connected to the internet. An IT admin needs to decide the best path for the server to reach into Azure cloud services.

This article provides insight into specific requirements and options available to successfully and securely connect your server to Azure File Sync.

We recommend reading [Azure File Sync networking considerations](file-sync-networking-overview.md) prior to reading this how to guide.

## Overview

Azure File Sync acts as an orchestration service between your Windows Server, your Azure file share, and several other Azure services to sync data as described in your sync group. For Azure File Sync to work correctly, you'll need to configure your servers to communicate with the following Azure services:

- Azure Storage
- Azure File Sync
- Azure Resource Manager
- Authentication services

> [!NOTE]
> The Azure File Sync agent on Windows Server initiates all requests to cloud services which results in only having to consider outbound traffic from a firewall perspective. No Azure service initiates a connection to the Azure File Sync agent.

## Ports

Azure File Sync moves file data and metadata exclusively over HTTPS and requires port 443 to be open outbound. As a result, all traffic is encrypted.

## Networks and special connections to Azure

The Azure File Sync agent has no requirements regarding special channels like [ExpressRoute](../../expressroute/expressroute-introduction.md), etc. to Azure.

Azure File Sync will work through any means available that allow reach into Azure, automatically adapting to network characteristics like bandwidth and latency, as well as offering admin control for fine-tuning.

## Proxy

Azure File Sync supports app-specific and machine-wide proxy settings.

**App-specific proxy settings** allow configuration of a proxy specifically for Azure File Sync traffic. App-specific proxy settings are supported on agent version 4.0.1.0 or newer and can be configured during the agent installation or by using the `Set-StorageSyncProxyConfiguration` PowerShell cmdlet.

PowerShell commands to configure app-specific proxy settings:

```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
Set-StorageSyncProxyConfiguration -Address <url> -Port <port number> -ProxyCredential <credentials>
```

For example, if your proxy server requires authentication with a user name and password, run the following PowerShell commands:

```powershell
# IP address or name of the proxy server.
$Address="127.0.0.1"

# The port to use for the connection to the proxy.
$Port=8080

# The user name for a proxy.
$UserName="user_name"

# Please type or paste a string with a password for the proxy.
$SecurePassword = Read-Host -AsSecureString

$Creds = New-Object System.Management.Automation.PSCredential ($UserName, $SecurePassword)

# Please verify that you have entered the password correctly.
Write-Host $Creds.GetNetworkCredential().Password

Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"

Set-StorageSyncProxyConfiguration -Address $Address -Port $Port -ProxyCredential $Creds
```

**Machine-wide proxy settings** are transparent to the Azure File Sync agent as the entire traffic of the server is routed through the proxy.

To configure machine-wide proxy settings, follow the steps below:

1. Configure proxy settings for .NET applications

   - Edit these two files:  
     C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config\machine.config  
     C:\Windows\Microsoft.NET\Framework\v4.0.30319\Config\machine.config

   - Add the <system.net> section in the machine.config files (below the <system.serviceModel> section).  Change 127.0.01:8888 to the IP address and port for the proxy server. 

     ```
      <system.net>
        <defaultProxy enabled="true" useDefaultCredentials="true">
          <proxy autoDetect="false" bypassonlocal="false" proxyaddress="http://127.0.0.1:8888" usesystemdefault="false" />
        </defaultProxy>
      </system.net>
     ```

2. Set the WinHTTP proxy settings

   > [!NOTE]
   > There are several methods (WPAD, PAC file, netsh, etc.) to configure a Windows Server to use a proxy server. The steps below cover how to configure the proxy settings using `netsh` but any method listed in the [Configure proxy server settings in Windows](/troubleshoot/windows-server/networking/configure-proxy-server-settings) documentation is supported.

   - Run the following command from an elevated command prompt or PowerShell to see the existing proxy setting:

     `netsh winhttp show proxy`

   - Run the following command from an elevated command prompt or PowerShell to set the proxy setting (change 127.0.01:8888 to the IP address and port for the proxy server):

     `netsh winhttp set proxy 127.0.0.1:8888`

3. Restart the Storage Sync Agent service by running the following command from an elevated command prompt or PowerShell:

      `net stop filesyncsvc`

      Note: The Storage Sync Agent (filesyncsvc) service will auto-start once stopped.

## Firewall

As mentioned in a previous section, port 443 needs to be open outbound. Based on policies in your datacenter, branch or region, further restricting traffic over this port to specific domains may be desired or required.

The following table describes the required domains for communication:

| Service | Public cloud endpoint | Azure Government endpoint | Usage |
|---------|----------------|---------------|------------------------------|
| **Azure Resource Manager** | `https://management.azure.com` | `https://management.usgovcloudapi.net` | Any user call (like PowerShell) goes to/through this URL, including the initial server registration call. |
| **Azure Active Directory** | `https://login.windows.net`<br>`https://login.microsoftonline.com` | `https://login.microsoftonline.us` | Azure Resource Manager calls must be made by an authenticated user. To succeed, this URL is used for user authentication. |
| **Azure Active Directory** | `https://graph.microsoft.com/` | `https://graph.microsoft.com/` | As part of deploying Azure File Sync, a service principal in the subscription's Azure Active Directory will be created. This URL is used for that. This principal is used for delegating a minimal set of rights to the Azure File Sync service. The user performing the initial setup of Azure File Sync must be an authenticated user with subscription owner privileges. |
| **Azure Active Directory** | `https://secure.aadcdn.microsoftonline-p.com` | `https://secure.aadcdn.microsoftonline-p.com`<br>(same as public cloud endpoint URL) | This URL is accessed by the Active Directory authentication library that the Azure File Sync server registration UI uses to log in the administrator. |
| **Azure Storage** | &ast;.core.windows.net | &ast;.core.usgovcloudapi.net | When the server downloads a file, then the server performs that data movement more efficiently when talking directly to the Azure file share in the Storage Account. The server has a SAS key that only allows for targeted file share access. |
| **Azure File Sync** | &ast;.one.microsoft.com<br>&ast;.afs.azure.net | &ast;.afs.azure.us | After initial server registration, the server receives a regional URL for the Azure File Sync service instance in that region. The server can use the URL to communicate directly and efficiently with the instance handling its sync. |
| **Microsoft PKI** |  `https://www.microsoft.com/pki/mscorp/cps`<br>`http://crl.microsoft.com/pki/mscorp/crl/`<br>`http://mscrl.microsoft.com/pki/mscorp/crl/`<br>`http://ocsp.msocsp.com`<br>`http://ocsp.digicert.com/`<br>`http://crl3.digicert.com/` | `https://www.microsoft.com/pki/mscorp/cps`<br>`http://crl.microsoft.com/pki/mscorp/crl/`<br>`http://mscrl.microsoft.com/pki/mscorp/crl/`<br>`http://ocsp.msocsp.com`<br>`http://ocsp.digicert.com/`<br>`http://crl3.digicert.com/` | Once the Azure File Sync agent is installed, the PKI URL is used to download intermediate certificates required to communicate with the Azure File Sync service and Azure file share. The OCSP URL is used to check the status of a certificate. |
| **Microsoft Update** | &ast;.update.microsoft.com<br>&ast;.download.windowsupdate.com<br>&ast;.ctldl.windowsupdate.com<br>&ast;.dl.delivery.mp.microsoft.com<br>&ast;.emdl.ws.microsoft.com | &ast;.update.microsoft.com<br>&ast;.download.windowsupdate.com<br>&ast;.ctldl.windowsupdate.com<br>&ast;.dl.delivery.mp.microsoft.com<br>&ast;.emdl.ws.microsoft.com | Once the Azure File Sync agent is installed, the Microsoft Update URLs are used to download Azure File Sync agent updates. |

> [!IMPORTANT]
> When allowing traffic to &ast;.afs.azure.net, traffic is only possible to the sync service. There are no other Microsoft services using this domain.
> When allowing traffic to &ast;.one.microsoft.com, traffic to more than just the sync service is possible from the server. There are many more Microsoft services available under subdomains.

If &ast;.afs.azure.net or &ast;.one.microsoft.com is too broad, you can limit the server's communication by allowing communication to only explicit regional instances of the Azure File Sync service. Which instance(s) to choose depends on the region of the storage sync service you have deployed and registered the server to. That region is called "Primary endpoint URL" in the table below.

For business continuity and disaster recovery (BCDR) reasons you may have created your Azure file shares in a storage account that is configured for geo-redundant storage (GRS). If that is the case, your Azure file shares will fail over to the paired region in the event of a lasting regional outage. Azure File Sync uses the same regional pairings as storage. So if you use GRS storage accounts, you need to enable additional URLs to allow your server to talk to the paired region for Azure File Sync. The table below calls this "Paired region". Additionally, there is a traffic manager profile URL that needs to be enabled as well. This will ensure network traffic can be seamlessly re-routed to the paired region in the event of a failover and is called "Discovery URL" in the table below.

| Cloud  | Region | Primary endpoint URL | Paired region | Discovery URL |
|--------|--------|----------------------|---------------|---------------|
| Public |Australia East | https:\//australiaeast01.afs.azure.net<br>https:\//kailani-aue.one.microsoft.com | Australia Southeast | https:\//tm-australiaeast01.afs.azure.net<br>https:\//tm-kailani-aue.one.microsoft.com |
| Public |Australia Southeast | https:\//australiasoutheast01.afs.azure.net<br>https:\//kailani-aus.one.microsoft.com | Australia East | https:\//tm-australiasoutheast01.afs.azure.net<br>https:\//tm-kailani-aus.one.microsoft.com |
| Public | Brazil South | https:\//brazilsouth01.afs.azure.net | South Central US | https:\//tm-brazilsouth01.afs.azure.net |
| Public | Canada Central | https:\//canadacentral01.afs.azure.net<br>https:\//kailani-cac.one.microsoft.com | Canada East | https:\//tm-canadacentral01.afs.azure.net<br>https:\//tm-kailani-cac.one.microsoft.com |
| Public | Canada East | https:\//canadaeast01.afs.azure.net<br>https:\//kailani-cae.one.microsoft.com | Canada Central | https:\//tm-canadaeast01.afs.azure.net<br>https:\//tm-kailani.cae.one.microsoft.com |
| Public | Central India | https:\//centralindia01.afs.azure.net<br>https:\//kailani-cin.one.microsoft.com | South India | https:\//tm-centralindia01.afs.azure.net<br>https:\//tm-kailani-cin.one.microsoft.com |
| Public | Central US | https:\//centralus01.afs.azure.net<br>https:\//kailani-cus.one.microsoft.com | East US 2 | https:\//tm-centralus01.afs.azure.net<br>https:\//tm-kailani-cus.one.microsoft.com |
| Microsoft Azure operated by 21Vianet | China East 2 | https:\//chinaeast201.afs.azure.cn | China North 2 | https:\//tm-chinaeast201.afs.azure.cn |
| Microsoft Azure operated by 21Vianet | China North 2 | https:\//chinanorth201.afs.azure.cn | China East 2 | https:\//tm-chinanorth201.afs.azure.cn |
| Public | East Asia | https:\//eastasia01.afs.azure.net<br>https:\//kailani11.one.microsoft.com | Southeast Asia | https:\//tm-eastasia01.afs.azure.net<br>https:\//tm-kailani11.one.microsoft.com |
| Public | East US | https:\//eastus01.afs.azure.net<br>https:\//kailani1.one.microsoft.com | West US | https:\//tm-eastus01.afs.azure.net<br>https:\//tm-kailani1.one.microsoft.com |
| Public | East US 2 | https:\//eastus201.afs.azure.net<br>https:\//kailani-ess.one.microsoft.com | Central US | https:\//tm-eastus201.afs.azure.net<br>https:\//tm-kailani-ess.one.microsoft.com |
| Public | Germany North | https:\//germanynorth01.afs.azure.net | Germany West Central | https:\//tm-germanywestcentral01.afs.azure.net |
| Public | Germany West Central | https:\//germanywestcentral01.afs.azure.net | Germany North | https:\//tm-germanynorth01.afs.azure.net |
| Public | Japan East | https:\//japaneast01.afs.azure.net | Japan West | https:\//tm-japaneast01.afs.azure.net |
| Public | Japan West | https:\//japanwest01.afs.azure.net | Japan East | https:\//tm-japanwest01.afs.azure.net |
| Public | Korea Central | https:\//koreacentral01.afs.azure.net/ | Korea South | https:\//tm-koreacentral01.afs.azure.net/ |
| Public | Korea South | https:\//koreasouth01.afs.azure.net/ | Korea Central | https:\//tm-koreasouth01.afs.azure.net/ |
| Public | North Central US | https:\//northcentralus01.afs.azure.net | South Central US | https:\//tm-northcentralus01.afs.azure.net |
| Public | North Europe | https:\//northeurope01.afs.azure.net<br>https:\//kailani7.one.microsoft.com | West Europe | https:\//tm-northeurope01.afs.azure.net<br>https:\//tm-kailani7.one.microsoft.com |
| Public | South Central US | https:\//southcentralus01.afs.azure.net | North Central US | https:\//tm-southcentralus01.afs.azure.net |
| Public | South India | https:\//southindia01.afs.azure.net<br>https:\//kailani-sin.one.microsoft.com | Central India | https:\//tm-southindia01.afs.azure.net<br>https:\//tm-kailani-sin.one.microsoft.com |
| Public | Southeast Asia | https:\//southeastasia01.afs.azure.net<br>https:\//kailani10.one.microsoft.com | East Asia | https:\//tm-southeastasia01.afs.azure.net<br>https:\//tm-kailani10.one.microsoft.com |
| Public | Switzerland North | https:\//switzerlandnorth01.afs.azure.net<br>https:\//tm-switzerlandnorth01.afs.azure.net | Switzerland West | https:\//switzerlandwest01.afs.azure.net<br>https:\//tm-switzerlandwest01.afs.azure.net |
| Public | Switzerland West | https:\//switzerlandwest01.afs.azure.net<br>https:\//tm-switzerlandwest01.afs.azure.net | Switzerland North | https:\//switzerlandnorth01.afs.azure.net<br>https:\//tm-switzerlandnorth01.afs.azure.net |
| Public | UAE Central | https:\//uaecentral01.afs.azure.net | UAE North | https:\//tm-uaecentral01.afs.azure.net |
| Public | UAE North | https:\//uaenorth01.afs.azure.net | UAE Central | https:\//tm-uaenorth01.afs.azure.net |
| Public | UK South | https:\//uksouth01.afs.azure.net<br>https:\//kailani-uks.one.microsoft.com | UK West | https:\//tm-uksouth01.afs.azure.net<br>https:\//tm-kailani-uks.one.microsoft.com |
| Public | UK West | https:\//ukwest01.afs.azure.net<br>https:\//kailani-ukw.one.microsoft.com | UK South | https:\//tm-ukwest01.afs.azure.net<br>https:\//tm-kailani-ukw.one.microsoft.com |
| Public | West Central US | https:\//westcentralus01.afs.azure.net | West US 2 | https:\//tm-westcentralus01.afs.azure.net |
| Public | West Europe | https:\//westeurope01.afs.azure.net<br>https:\//kailani6.one.microsoft.com | North Europe | https:\//tm-westeurope01.afs.azure.net<br>https:\//tm-kailani6.one.microsoft.com |
| Public | West US | https:\//westus01.afs.azure.net<br>https:\//kailani.one.microsoft.com | East US | https:\//tm-westus01.afs.azure.net<br>https:\//tm-kailani.one.microsoft.com |
| Public | West US 2 | https:\//westus201.afs.azure.net | West Central US | https:\//tm-westus201.afs.azure.net |
| Government | US Gov Arizona | https:\//usgovarizona01.afs.azure.us | US Gov Texas | https:\//tm-usgovarizona01.afs.azure.us |
| Government | US Gov Texas | https:\//usgovtexas01.afs.azure.us | US Gov Arizona | https:\//tm-usgovtexas01.afs.azure.us |

- If you use a storage account configured for locally redundant storage (LRS) or zone redundant storage (ZRS), you only need to enable the URL listed under "Primary endpoint URL".

- If you use a storage account configured for GRS, enable three URLs.

**Example:** You deploy a storage sync service in `"West US"` and register your server with it. The URLs to allow the server to communicate to for this case are:

> - https:\//westus01.afs.azure.net (primary endpoint: West US)
> - https:\//eastus01.afs.azure.net (paired failover region: East US)
> - https:\//tm-westus01.afs.azure.net (discovery URL of the primary region)

### Allow list for Azure File Sync IP addresses

Azure File Sync supports the use of [service tags](../../virtual-network/service-tags-overview.md), which represent a group of IP address prefixes for a given Azure service. You can use service tags to create firewall rules that enable communication with the Azure File Sync service. The service tag for Azure File Sync is `StorageSyncService`.

If you're using Azure File Sync within Azure, you can use name of service tag directly in your network security group to allow traffic. To learn more about how to do this, see [Network security groups](../../virtual-network/network-security-groups-overview.md).

If you're using Azure File Sync on-premises, you can use the service tag API to get specific IP address ranges for your firewall's allow list. There are two methods for getting this information:

- The current list of IP address ranges for all Azure services supporting service tags are published weekly on the Microsoft Download Center in the form of a JSON document. Each Azure cloud has its own JSON document with the IP address ranges relevant for that cloud:
  - [Azure Public](https://www.microsoft.com/download/details.aspx?id=56519)
  - [Azure US Government](https://www.microsoft.com/download/details.aspx?id=57063)
  - [Microsoft Azure operated by 21Vianet](https://www.microsoft.com/download/details.aspx?id=57062)
  - [Azure Germany](https://www.microsoft.com/download/details.aspx?id=57064)
- The service tag discovery API allows programmatic retrieval of the current list of service tags. You can use the API surface based on your automation preference:
  - [REST API](/rest/api/virtualnetwork/servicetags/list)
  - [Azure PowerShell](/powershell/module/az.network/Get-AzNetworkServiceTag)
  - [Azure CLI](/cli/azure/network#az-network-list-service-tags)

Because the service tag discovery API might not be updated as frequently as the JSON documents published to the Microsoft Download Center, we recommend using the JSON document to update your on-premises firewall's allow list. This can be done as follows:

```powershell
# The specific region to get the IP address ranges for. Replace westus2 with the desired region code 
# from Get-AzLocation.
$region = "westus2"

# The service tag for Azure File Sync. Do not change unless you're adapting this
# script for another service.
$serviceTag = "StorageSyncService"

# Download date is the string matching the JSON document on the Download Center. 
$possibleDownloadDates = 0..7 | `
    ForEach-Object { [System.DateTime]::Now.AddDays($_ * -1).ToString("yyyyMMdd") }

# Verify the provided region
$validRegions = Get-AzLocation | `
    Where-Object { $_.Providers -contains "Microsoft.StorageSync" } | `
    Select-Object -ExpandProperty Location

if ($validRegions -notcontains $region) {
    Write-Error `
            -Message "The specified region $region is not available. Either Azure File Sync is not deployed there or the region does not exist." `
            -ErrorAction Stop
}

# Get the Azure cloud. This should automatically based on the context of 
# your Az PowerShell login, however if you manually need to populate, you can find
# the correct values using Get-AzEnvironment.
$azureCloud = Get-AzContext | `
    Select-Object -ExpandProperty Environment | `
    Select-Object -ExpandProperty Name

# Build the download URI
$downloadUris = @()
switch($azureCloud) {
    "AzureCloud" { 
        $downloadUris = $possibleDownloadDates | ForEach-Object {  
            "https://download.microsoft.com/download/7/1/D/71D86715-5596-4529-9B13-DA13A5DE5B63/ServiceTags_Public_$_.json"
        }
    }

    "AzureUSGovernment" {
        $downloadUris = $possibleDownloadDates | ForEach-Object { 
            "https://download.microsoft.com/download/6/4/D/64DB03BF-895B-4173-A8B1-BA4AD5D4DF22/ServiceTags_AzureGovernment_$_.json"
        }
    }

    "AzureChinaCloud" {
        $downloadUris = $possibleDownloadDates | ForEach-Object { 
            "https://download.microsoft.com/download/9/D/0/9D03B7E2-4B80-4BF3-9B91-DA8C7D3EE9F9/ServiceTags_China_$_.json"
        }
    }

    "AzureGermanCloud" {
        $downloadUris = $possibleDownloadDates | ForEach-Object { 
            "https://download.microsoft.com/download/0/7/6/076274AB-4B0B-4246-A422-4BAF1E03F974/ServiceTags_AzureGermany_$_.json"
        }
    }

    default {
        Write-Error -Message "Unrecognized Azure Cloud: $_" -ErrorAction Stop
    }
}

# Find most recent file
$found = $false 
foreach($downloadUri in $downloadUris) {
    try { $response = Invoke-WebRequest -Uri $downloadUri -UseBasicParsing } catch { }
    if ($response.StatusCode -eq 200) {
        $found = $true
        break
    }
}

if ($found) {
    # Get the raw JSON 
    $content = [System.Text.Encoding]::UTF8.GetString($response.Content)

    # Parse the JSON
    $serviceTags = ConvertFrom-Json -InputObject $content -Depth 100

    # Get the specific $ipAddressRanges
    $ipAddressRanges = $serviceTags | `
        Select-Object -ExpandProperty values | `
        Where-Object { $_.id -eq "$serviceTag.$region" } | `
        Select-Object -ExpandProperty properties | `
        Select-Object -ExpandProperty addressPrefixes
} else {
    # If the file cannot be found, that means there hasn't been an update in
    # more than a week. Please verify the download URIs are still accurate
    # by checking https://learn.microsoft.com/azure/virtual-network/service-tags-overview
    Write-Verbose -Message "JSON service tag file not found."
    return
}
```

You can then use the IP address ranges in `$ipAddressRanges` to update your firewall. Check your firewall/network appliance's website for information on how to update your firewall.

## Test network connectivity to service endpoints

Once a server is registered with the Azure File Sync service, the `Test-StorageSyncNetworkConnectivity` cmdlet and ServerRegistration.exe can be used to test communications with all endpoints (URLs) specific to this server. This cmdlet can help troubleshoot when incomplete communication prevents the server from fully working with Azure File Sync and it can be used to fine-tune proxy and firewall configurations.

To run the network connectivity test, run the following PowerShell commands:

```powershell
Import-Module "C:\Program Files\Azure\StorageSyncAgent\StorageSync.Management.ServerCmdlets.dll"
Test-StorageSyncNetworkConnectivity
```

## Summary and risk limitation

The lists earlier in this document contain the URLs Azure File Sync currently communicates with. Firewalls must be able to allow traffic outbound to these domains. Microsoft strives to keep this list updated.

Setting up domain restricting firewall rules can be a measure to improve security. If these firewall configurations are used, keep in mind that URLs will be added and might even change over time. Check this article periodically.

## Next steps

- [Planning for an Azure File Sync deployment](file-sync-planning.md)
- [Deploy Azure File Sync](file-sync-deployment-guide.md)
- [Monitor Azure File Sync](file-sync-monitoring.md)
