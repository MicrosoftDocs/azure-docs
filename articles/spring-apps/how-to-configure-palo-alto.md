---
title: How to configure Palo Alto for Azure Spring Apps
description: How to configure Palo Alto for Azure Spring Apps
author: KarlErickson
ms.author: karler
ms.topic: how-to
ms.service: spring-apps
ms.date: 09/17/2021
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# How to configure Palo Alto for Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article describes how to use Azure Spring Apps with a Palo Alto firewall.

If your current deployments include a Palo Alto firewall, you can omit the Azure Firewall from the Azure Spring Apps deployment and use Palo Alto instead, as described in this article.

You should keep configuration information, such as rules and address wildcards, in CSV files in a Git repository. This article shows you how to use automation to apply these files to Palo Alto. To understand the configuration to be applied to Palo Alto, see [Customer responsibilities for running Azure Spring Apps in a virtual network](./vnet-customer-responsibilities.md).

> [!NOTE]
> In describing the use of REST APIs, this article uses the PowerShell variable syntax to indicate names and values that are left to your discretion. Be sure to use the same values in all the steps.
>
> After you've configured the TLS/SSL certificate in Palo Alto, remove the `-SkipCertificateCheck` argument from all Palo Alto REST API calls in the examples below.
>
> You should not use this article as a reference for Palo Alto REST APIs. All examples are for demonstration purposes only. For authoritative API details, see [PAN-OS REST API](https://docs.paloaltonetworks.com/pan-os/9-1/pan-os-panorama-api/get-started-with-the-pan-os-rest-api/pan-os-rest-api.html) in the Palo Alto documentation.

## Prerequisites

* An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A Palo Alto deployment. If you don't have a deployment, you can provision [Palo Alto from Azure Marketplace](https://portal.azure.com/#create/paloaltonetworks.vmseries-ngfwbundle2).
* [PowerShell](/powershell/scripting/install/installing-powershell)
* [Azure CLI](/cli/azure/install-azure-cli)

## Configure Palo Alto

First, configure the Palo Alto VM-Series Firewall. For detailed instructions, see [Deploy the VM-Series Firewall from the Azure Marketplace (Solution Template)](https://docs.paloaltonetworks.com/vm-series/9-1/vm-series-deployment/set-up-the-vm-series-firewall-on-azure/deploy-the-vm-series-firewall-on-azure-solution-template.html). These instructions will help you provision a VM-Series Firewall and configure both the `Trust` and `UnTrust` subnets and the associated network interface cards. To stay consistent, you should create this firewall in the address space of the `Hub` virtual network in the reference architecture.

The [Reference Architecture Guide for Azure](https://www.paloaltonetworks.com/resources/guides/azure-architecture-guide) explores several technical design models for deploying the Firewall on Azure.

The rest of this article assumes you have the following two pre-configured network zones:

* `Trust`, containing the interface connected to a virtual network peered with the Azure Spring Apps virtual network.
* `UnTrust`, containing the interface to the public internet created earlier in the VM-Series deployment guide.

## Prepare CSV files

Next, create three CSV files.

Name the first file *AzureSpringAppsServices.csv*. This file should contain ingress ports for Azure Spring Apps. The values in the following example are for demonstration purposes only. For all of the required values, see the [Azure Global required network rules](./vnet-customer-responsibilities.md#azure-global-required-network-rules) section of [Customer responsibilities for running Azure Spring Apps in a virtual network](./vnet-customer-responsibilities.md).

```CSV
name,protocol,port,tag
ASC_1194,udp,1194,AzureSpringApps
ASC_443,tcp,443,AzureSpringApps
ASC_9000,tcp,9000,AzureSpringApps
ASC_445,tcp,445,AzureSpringApps
ASC_123,udp,123,AzureSpringApps
```

Name the second file *AzureSpringAppsUrlCategories.csv*. This file should contain the addresses (with wildcards) that should be available for egress from Azure Spring Apps. The values in the following example are for demonstration purposes only. For up-to-date values, see the [Azure Global required FQDN / application rules](./vnet-customer-responsibilities.md#azure-global-required-fqdn--application-rules) section of [Customer responsibilities for running Azure Spring Apps in a virtual network](./vnet-customer-responsibilities.md).

```CSV
name,description
*.azmk8s.io,
mcr.microsoft.com,
*.cdn.mscr.io,
*.data.mcr.microsoft.com,
management.azure.com,
*.microsoftonline.com,
*.microsoft.com,
packages.microsoft.com,
acs-mirror.azureedge.net,
mscrl.microsoft.com,
crl.microsoft.com,
crl3.digicert.com
```

Name the third file *AzureMonitorAddresses.csv*. This file should contain all addresses and IP ranges to be made available for metrics and monitoring via Azure Monitor, if you're using Azure monitor. The values in the following example are for demonstration purposes only. For up-to-date values, see [IP addresses used by Azure Monitor](../azure-monitor/app/ip-addresses.md).

```CSV
name,type,address,tag
40.114.241.141,ip-netmask,40.114.241.141/32,AzureMonitor
104.45.136.42,ip-netmask,104.45.136.42/32,AzureMonitor
40.84.189.107,ip-netmask,40.84.189.107/32,AzureMonitor
168.63.242.221,ip-netmask,168.63.242.221/32,AzureMonitor
52.167.221.184,ip-netmask,52.167.221.184/32,AzureMonitor
live.applicationinsights.azure.com,fqdn,live.applicationinsights.azure.com,AzureMonitor
rt.applicationinsights.microsoft.com,fqdn,rt.applicationinsights.microsoft.com,AzureMonitor
rt.services.visualstudio.com,fqdn,rt.services.visualstudio.com,AzureMonitor

```

## Authenticate into Palo Alto

Next you'll need to authenticate into Palo Alto and obtain an API key. For more information, see [Get Your API Key](https://docs.paloaltonetworks.com/pan-os/9-1/pan-os-panorama-api/get-started-with-the-pan-os-xml-api/get-your-api-key.html) in the Palo Alto documentation.

The following example uses PowerShell to authenticate and generate request headers that will be used later in this article:

```powershell
$username=<username for PaloAlto>
$password=<password for PaloAlto>
$authResponse = irm "https://${PaloAltoIpAddress}/api/?type=keygen&user=${username}&password=${password}" -SkipCertificateCheck
$paloAltoHeaders = @{'X-PAN-KEY' = $authResponse.response.result.key; 'Content-Type' = 'application/json' }
```

## Delete existing service group

If you've made prior configuration attempts, you should reset these configurations and delete any security rule and service group.

Delete the security rule using the [Security Rule REST API](https://docs.paloaltonetworks.com/pan-os/9-1/pan-os-panorama-api/get-started-with-the-pan-os-rest-api/create-security-policy-rule-rest-api.html), as shown in the following example:

```powershell
$url = "https://${PaloAltoIpAddress}/restapi/v9.1/Policies/SecurityRules?location=vsys&vsys=vsys1&name=${paloAltoSecurityPolicyName}"
Invoke-RestMethod -Method Delete -Uri $url -Headers $paloAltoHeaders -SkipCertificateCheck
```

Delete the service group as shown in the following example:

```powershell
$url = "https://${PaloAltoIpAddress}/restapi/v9.1/Objects/ServiceGroups?location=vsys&vsys=vsys1&name=${paloAltoServiceGroupName}"
Invoke-RestMethod -Method Delete -Uri $url -Headers $paloAltoHeaders -SkipCertificateCheck
```

Delete each Palo Alto service (as defined in *AzureSpringAppsServices.csv*) as shown in the following example:

```powershell
Get-Content .\AzureSpringAppsServices.csv | ConvertFrom-Csv | select name | ForEach-Object {
    $url = "https://${PaloAltoIpAddress}/restapi/v9.1/Objects/Services?location=vsys&vsys=vsys1&name=${_}"
    Invoke-RestMethod -Method Delete -Uri $url -Headers $paloAltoHeaders -SkipCertificateCheck
}
```

## Create a service and service group

To automate the creation of services based on the *AzureSpringAppsServices.csv* file you created earlier, use the following example.

```powershell
# Define a function to create and submit a Palo Alto service creation request
function New-PaloAltoService {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [PSCustomObject]
        $ServiceObject
    )
    PROCESS {
        $requestBody = @{
            'entry' = @{
                '@name'    = $ServiceObject.name
                'protocol' = @{
                    $ServiceObject.protocol = @{
                        'port'     = $ServiceObject.port
                        'override' = @{
                            'no' = @{}
                        }

                    }
                }
                'tag'      = @{
                    'member' = @($ServiceObject.tag)
                }
            }
        }

        # Some rules in the CSV may need to conain source ports or descriptions. If these are present, populate them in the request
        if ($ServiceObject.description) {
            $requestBody.entry.description = $ServiceObject.description
        }
        if ($ServiceObject.'source-port') {
            $requestBody.entry.protocol."$($ServiceObject.protocol)".'source-port' = $ServiceObject.'source-port'
        }

        # Send the request
        $name = $requestBody.entry.'@name'
        $url = "https://${PaloAltoIpAddress}/restapi/v9.1/Objects/Services?location=vsys&vsys=vsys1&name=${name}"
         Invoke-RestMethod -Method Post -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders -Body (ConvertTo-Json -WarningAction Ignore $requestBody -Depth 9) -Verbose
    }
}

# Now invoke that function for every row in AzureSpringAppsServices.csv
Get-Content ./AzureSpringAppsServices.csv | ConvertFrom-Csv | New-PaloAltoService
```

Next, create a Service Group for these services, as shown in the following example:

```powershell
# Create a function to consume service definitions and submit a service group creation request
function New-PaloAltoServiceGroup {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [PSCustomObject[]]
        $RuleData,

        [Parameter(Mandatory = $true)]
        [string]
        $ServiceGroupName
    )
    begin {
        [array] $names = @()
    }

    process {
        $names += $RuleData.name
    }

    end {
        $requestBody = @{ 'entry' = [ordered] @{
                '@name'   = $ServiceGroupName
                'members' = @{ 'member' = $names }
                'tag'     = @{ 'member' = 'AzureSpringApps' }
            }
        }

        $url = "https://${PaloAltoIpAddress}/restapi/v9.1/Objects/ServiceGroups?location=vsys&vsys=vsys1&name=${ServiceGroupName}"

        Invoke-RestMethod -Method Post -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders -Body (ConvertTo-Json $requestBody) -Verbose
    }
}

# Run that function for all services in AzureSpringAppsServices.csv.
Get-Content ./AzureSpringAppsServices.csv | ConvertFrom-Csv | New-PaloAltoServiceGroup -ServiceGroupName 'AzureSpringApps_SG'
```

## Create custom URL categories

Next, define custom URL categories for the service group to enable egress from Azure Spring Apps, as shown in the following example.

```powershell
# Read Service entries from CSV to enter into Palo Alto
$csvImport = Get-Content ${PSScriptRoot}/AzureSpringAppsUrls.csv | ConvertFrom-Csv

# Convert name column of CSV to add to the Custom URL Group in Palo Alto
$requestBody = @{ 'entry' = [ordered] @{
        '@name' = 'AzureSpringApps_SG'
        'list'  = @{ 'member' = $csvImport.name }
        'type'  = 'URL List'
    }
} | ConvertTo-Json -Depth 9

$url = "https://${PaloAltoIpAddress}/restapi/v9.1/Objects/CustomURLCategories?location=vsys&vsys=vsys1&name=AzureSpringApps_SG"

try {
    $existingObject = Invoke-RestMethod -Method Get -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders
    Invoke-RestMethod -Method Delete -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders
}
catch {
}

Invoke-RestMethod -Method Post -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders -Body $requestBody -Verbose
```

## Create a security rule

Next, create a JSON file to contain a security rule. Name the file *SecurityRule.json* and add the following content. The names of the two zones `Trust` and `UnTrust` match the zone names described earlier in the [Configure Palo Alto](#configure-palo-alto) section. The `service/member` entry contains the name of the service group created in the previous steps.

```json
{
    "entry": [
        {
            "@name": "AzureSpringAppsRule",
            "@location": "vsys",
            "@vsys": "vsys1",
            "to": {
                "member": [
                    "UnTrust"
                ]
            },
            "from": {
                "member": [
                    "Trust"
                ]
            },
            "source-user": {
                "member": [
                    "any"
                ]
            },
            "application": {
                "member": [
                    "any"
                ]
            },
            "service": {
                "member": [
                    "AzureSpringApps_SG"
                ]
            },
            "hip-profiles": {
                "member": [
                    "any"
                ]
            },
            "action": "allow",
            "category": {
                "member": [
                    "any"
                ]
            },
            "source": {
                "member": [
                    "any"
                ]
            },
            "destination": {
                "member": [
                    "any"
                ]
            }
        }
    ]
}
```

Now, apply this rule to Palo Alto, as shown in the following example.

```powershell
$url = "https://${PaloAltoIpAddress}/restapi/v9.1/Policies/SecurityRules?location=vsys&vsys=vsys1&name=AzureSpringAppsRule"

# Delete the rule if it already exists
try {
    $getResult = Invoke-RestMethod -Headers $paloAltoHeaders -Method Get -SkipCertificateCheck -Uri $url -Verbose
    if ($getResult.'@status' -eq 'success') {
        Invoke-RestMethod -Method Delete  -Headers $paloAltoHeaders -SkipCertificateCheck -Uri $url
    }
}
catch {}

# Create the rule from the JSON file
Invoke-WebRequest -Uri $url -Method Post -Headers $paloAltoHeaders -Body (Get-Content SecurityRule.json) -SkipCertificateCheck
```

## Create Azure Monitor addresses

Next, use the *AzureMonitorAddresses.csv* file to define Address objects in Palo Alto. The following example code shows you how to automate this task.

```powershell
Get-Content ./AzureMonitorAddresses.csv | ConvertFrom-Csv | ForEach-Object {
    $requestBody = @{ 'entry' = [ordered]@{
            '@name' = $_.name
            $_.type = $_.address
            'tag'   = @{ 'member' = @($_.tag) }
        }
    }

    $name = $requestBody.entry.'@name'
    $url = "https://${PaloAltoIpAddress}/restapi/v9.1/Objects/Addresses?location=vsys&vsys=vsys1&name=${name}"

    # Delete the address if it already exists
    try {
        Invoke-RestMethod -Method Delete -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders
    }
    catch {
    }

    # Create the address
    Invoke-RestMethod -Method Post -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders -Body (ConvertTo-Json -WarningAction Ignore $requestBody -Depth 3) -Verbose
}
```

## Commit changes to Palo Alto

You must commit some of the changes above so they'll become active. You can do this with the following REST API call.

```powershell
$url = "https://${PaloAltoIpAddress}/api/?type=commit&cmd=<commit></commit>"
Invoke-RestMethod -Method Get -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders
```

## Configure the Security Rules for Azure Spring Apps subnets

Next, add network security rules to enable traffic from Palo Alto to access Azure Spring Apps. The following examples reference the spoke Network Security Groups (NSGs) created by the Reference Architecture: `nsg-spokeapp` and `nsg-spokeruntime`.

Run the following Azure CLI commands in a PowerShell window to create the necessary network security rule for each of these NSGs, where `$PaloAltoAddressPrefix` is the Classless Inter-Domain Routing (CIDR) address of Palo Alto's private IPs.

```azurecli
az network nsg rule create `
    --resource-group $ResourceGroupName `
    --name 'allow-palo-alto' `
    --nsg-name 'nsg-spokeapp' `
    --access Allow `
    --source-address-prefixes $PaloAltoAddressPrefix `
    --priority 1000
az network nsg rule create `
    --resource-group $ResourceGroupName `
    --name 'allow-palo-alto' `
    --nsg-name 'nsg-spokeruntime' `
    --access Allow `
    --source-address-prefixes $PaloAltoAddressPrefix `
    --priority 1000
```

## Configure the next hop

After you've configured Palo Alto, configure Azure Spring Apps to have Palo Alto as its next hop for outbound internet access. You can use the following Azure CLI commands in a PowerShell window for this configuration. Be sure to provide values for the following variables:

* `$AppResourceGroupName`: The name of the resource group containing your Azure Spring Apps.
* `$AzureSpringAppsServiceSubnetRouteTableName`: The name of the Azure Spring Apps service/runtime subnet route table. In the reference architecture, this is set to `rt-spokeruntime`.
* `$AzureSpringAppsAppSubnetRouteTableName`: The name of the Azure Spring Apps app subnet route table. In the reference architecture, this is set to `rt-spokeapp`.

```azurecli
az network route-table route create `
    --resource-group ${AppResourceGroupName} `
    --name default `
    --route-table-name ${AzureSpringAppsServiceSubnetRouteTableName} `
    --address-prefix 0.0.0.0/0 `
    --next-hop-type VirtualAppliance `
    --next-hop-ip-address ${PaloAltoIpAddress} `
    --verbose

az network route-table route create `
    --resource-group ${AppResourceGroupName} `
    --name default `
    --route-table-name ${AzureSpringAppsAppSubnetRouteTableName} `
    --address-prefix 0.0.0.0/0 `
    --next-hop-type VirtualAppliance `
    --next-hop-ip-address ${PaloAltoIpAddress} `
    --verbose
```

Your configuration is now complete.

## Next steps

* [Stream Azure Spring Apps app logs in real-time](./how-to-log-streaming.md)
* [Application Insights Java In-Process Agent in Azure Spring Apps](./how-to-application-insights.md)
* [Automate application deployments to Azure Spring Apps](./how-to-cicd.md)
