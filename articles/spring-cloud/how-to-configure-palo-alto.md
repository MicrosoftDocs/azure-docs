---
title: How to configure Palo Alto for Azure Spring Cloud
description: How to configure Palo Alto for Azure Spring Cloud
author: karlerickson
ms.author: vaangadi
ms.topic: conceptual
ms.service: spring-cloud
ms.date: 09/17/2021
ms.custom: devx-track-java
---

# How to configure Palo Alto for Azure Spring Cloud

The [Reference Architecture for Azure Spring Cloud](/azure/spring-cloud/reference-architecture) includes an Azure Firewall to secure your applications. However, if your current deployments include a Palo Alto firewall, you can omit the Azure Firewall from the Azure Spring Cloud deployment and use Palo Alto instead. This document will tell you how.

We recommend keeping configuration information, such as rules, address wildcards, etc in CSV files in a Git repository, following Infrastructure-As-Code processes. We'll show you how to use automation to apply these files to Palo Alto. Familiarize yourself with [Customer responsibilities for running Azure Spring Cloud in VNET](/azure/spring-cloud/vnet-customer-responsibilities) to understand the configuration to be applied to Palo Alto.

> [!Note]
> In describing the use of REST APIs, we'll use the PowerShell variable syntax to indicate names and values that are left to your discretion. Make sure you use the same values throughout all the steps.

> [!Note]
> Once you have configured the SSL certificate in Palo Alto, remove the `-SkipCertificateCheck` argument from all Palo Alto REST API calls in the examples below.

> [!Note]
> This document should not be used as a reference for Palo Alto REST APIs. All examples are used for demonstration purposes only. Consult [Palo Alto's REST API documentation](https://docs.paloaltonetworks.com/pan-os/9-1/pan-os-panorama-api/get-started-with-the-pan-os-rest-api/access-the-rest-api.html) for authoritative API details.

## Pre-requisites

### Palo Alto starting configuration

You should already have a Palo Alto deployment (you can provision [Palo Alto from Azure Marketplace](https://ms.portal.azure.com/#create/paloaltonetworks.vmseries-ngfwbundle2)). 
The detailed steps to configure the Palo Alto VM Based Firewall can be found [here](https://docs.paloaltonetworks.com/vm-series/9-1/vm-series-deployment/set-up-the-vm-series-firewall-on-azure/deploy-the-vm-series-firewall-on-azure-solution-template.html). The link helps you to provision a VM Series Firewall along with configuring both the `Trust`,  `Untrust` subnets and the associated Network interface cards. We reccomend that you create this Firewall in the address space of `Hub` virtual network in the referene architecture to stay consistent.
The detailed design of [Reference Architecture Guide for Azure](https://www.paloaltonetworks.com/resources/guides/azure-architecture-guide) explores several technical design models for deploying the Firewall on Azure. 
In the steps below, we'll assume you have two pre-configured network zones: `Trust`, containing the interface connected to a virtual network peered with the Azure Spring Cloud virtual network, and `Untrust` containing the interface to the public internet created earlier in the VM Series deployment guide.

### Prepare CSV files

We'll need to create three CSV files.

The first, *AzureSpringCloudServices.csv* should contain ingress ports for Azure Spring Cloud. The values below are offered as an example only. See [Azure Spring Cloud network requirements](/azure/spring-cloud/vnet-customer-responsibilities#azure-spring-cloud-network-requirements) for all required values.

```CSV
name,protocol,port,tag
ASC_1194,udp,1194,AzureSpringCloud
ASC_443,tcp,443,AzureSpringCloud
ASC_9000,tcp,9000,AzureSpringCloud
ASC_445,tcp,445,AzureSpringCloud
ASC_123,udp,123,AzureSpringCloud
```

The second CSV file is *AzureSpringCloudUrlCategories.csv*, containing the addresses (with wildcards) that should be available for egress from Azure Spring Cloud. As before, the content below is for demonstration purposes only. Consult [Azure Spring Cloud FQDN requirements/application rules](/azure/spring-cloud/vnet-customer-responsibilities#azure-spring-cloud-fqdn-requirementsapplication-rules) for up-to-date values.

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

The third CSV file is *AzureMonitorAddresses.csv*. This file should contain all addresses and IP ranges to be made available for metrics and monitoring via Azure Monitor, if Azure monitor is to be used. The content below is for demonstration purposes only. Consult [IP addresses used by Azure Monitor](/azure/azure-monitor/app/ip-addresses) for up-to-date values.

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

### Authenticate into Palo Alto

To follow the REST API calls below, you should [authenticate into Palo Alto and obtain an API key](https://docs.paloaltonetworks.com/pan-os/9-1/pan-os-panorama-api/get-started-with-the-pan-os-xml-api/get-your-api-key.html).

Here's a sample for how to do it in powershell and generate request headers that will be used in subsequent Palo Alto calls in this example:

```powershell
$authResponse = irm "https://${PaloAltoIpAddress}/api/?type=keygen&user=yevster&password=CwtN8s@MuqXDNE!(gb!CqWY" -SkipCertificateCheck
$paloAltoHeaders = @{'X-PAN-KEY' = $authResponse.response.result.key; 'Content-Type' = 'application/json' }
```

## Delete existing service group

If prior configuration attempts have been made, these should be reset. Delete any security rule and service group.

Delete the security rule using the [Security Rule REST API](https://docs.paloaltonetworks.com/pan-os/9-1/pan-os-panorama-api/get-started-with-the-pan-os-rest-api/create-security-policy-rule-rest-api.html).

```powershell
$url = "https://${PaloAltoIpAddress}/restapi/v9.1/Policies/SecurityRules?location=vsys&vsys=vsys1&name=${paloAltoSecurityPolicyName}"
Invoke-RestMethod -Method Delete -Uri $url -Headers $paloAltoHeaders -SkipCertificateCheck
```

**Delete the service group**

```powershell
$url = "https://${PaloAltoIpAddress}/restapi/v9.1/Objects/ServiceGroups?location=vsys&vsys=vsys1&name=${paloAltoServiceGroupName}"
Invoke-RestMethod -Method Delete -Uri $url -Headers $paloAltoHeaders -SkipCertificateCheck
```

**Delete the Palo Alto services**

Delete each service (as defined in `AzureSpringCloudServices.csv`)

```powershell
Get-Content .\AzureSpringCloudServices.csv | ConvertFrom-Csv | select name | ForEach-Object {
    $url = "https://${PaloAltoIpAddress}/restapi/v9.1/Objects/Services?location=vsys&vsys=vsys1&name=${_}"
    Invoke-RestMethod -Method Delete -Uri $url -Headers $paloAltoHeaders -SkipCertificateCheck
}
```

## Create a service and service group

Here's how you can automate creation of services based on the `AzureSpringCloudServices.csv` file created earlier.

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

# Now invoke that function for every row in AzureSpringCloudServices.csv
Get-Content ./AzureSpringCloudServices.csv | ConvertFrom-Csv | New-PaloAltoService
```

Next, let's create a Service Group for these services. 

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
                'tag'     = @{ 'member' = 'AzureSpringCloud' }
            }       
        }

        $url = "https://${PaloAltoIpAddress}/restapi/v9.1/Objects/ServiceGroups?location=vsys&vsys=vsys1&name=${ServiceGroupName}"

        Invoke-RestMethod -Method Post -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders -Body (ConvertTo-Json $requestBody) -Verbose   
    }
}

# Run that function for all services in `AzureSpringCloudServices.csv`.
Get-Content ./AzureSpringCloudServices.csv | ConvertFrom-Csv | New-PaloAltoServiceGroup -ServiceGroupName 'AzureSpringCloud_SG'
```

## Create custom URL categories

Next, we define custom URL categories for the service group to enable egress from Azure Spring Cloud.

```powershell
# Read Service entries from CSV to enter into Palo Alto
$csvImport = Get-Content ${PSScriptRoot}/AzureSpringCloudUrls.csv | ConvertFrom-Csv

# Convert name column of CSV to add to the Custom URL Group in Palo Alto
$requestBody = @{ 'entry' = [ordered] @{
        '@name' = 'AzureSpringCloud_SG'
        'list'  = @{ 'member' = $csvImport.name }
        'type'  = 'URL List'
    }
} | ConvertTo-Json -Depth 9

$url = "https://${PaloAltoIpAddress}/restapi/v9.1/Objects/CustomURLCategories?location=vsys&vsys=vsys1&name=AzureSpringCloud_SG"

try {
    $existingObject = Invoke-RestMethod -Method Get -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders
    Invoke-RestMethod -Method Delete -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders
}
catch {
}

Invoke-RestMethod -Method Post -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders -Body $requestBody -Verbose
```

## Create a security rule

Create a JSON file containing a security rule, e.g. `SecurityRule.json`. Note the name two zones `Azure_Inside` and `Azure_Outside` zone names match the zones from the prerequisites. Also note the `service/member` entry contains the name of the service group created in the previous steps.

```json
{
    "entry": [
        {
            "@name": "azureSpringCloudRule",
            "@location": "vsys",
            "@vsys": "vsys1",
            "to": {
                "member": [
                    "Untrust"
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
                    "AzureSpringCloud_SG"
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

Now, apply this rule to Palo Alto. 

```powershell
$url = "https://${PaloAltoIpAddress}/restapi/v9.1/Policies/SecurityRules?location=vsys&vsys=vsys1&name=azureSpringCloudRule"

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

Addreses for Azure Monitor (defined in `AzureMonitorAddresses.csv`) now need to be defined as Address objects on Palo Alto. Here's how this task can be automated:

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

Some of the changes above must be committed in order to become active. This can be done with a single REST API call:

```powershell
$url = "https://${PaloAltoIpAddress}/api/?type=commit&cmd=<commit></commit>"
Invoke-RestMethod -Method Get -Uri $url  -SkipCertificateCheck -Headers $paloAltoHeaders
```

## Configure the Security Rules for Azure Spring Cloud subnets

Add Network Security Rules to enable traffic from Palo Alto to access Azure Spring Cloud. In the examples below, we reference the spoke Network Security Groups created by the Reference Architecture: `nsg-spokeapp` and `nsg-spokeruntime`.

We run the following command to create the necessary network security rule for each of these NSGs, where $PaloAltoAddressPrefix is the CIDR of Palo Alto's private IPs.

```azurecli
az network nsg rule create `
    --name 'allow-palo-alto' `
    --nsg-name 'nsg-spokeapp' `
    --access Allow `
    --source-address-prefixes $PaloAltoAddressPrefix `
    -g $ResourceGroupName `
    --priority 1000
az network nsg rule create `
    --name 'allow-palo-alto' `
    --nsg-name 'nsg-spokeruntime' `
    --access Allow `
    --source-address-prefixes $PaloAltoAddressPrefix `
    -g $ResourceGroupName `
    --priority 1000
```

## Configure the next hop

With Palo Alto configured, Azure Spring Cloud must be configured to have Palo Alto as its next hop for outbound internet access.

You can do this with standard Azure CLI:

```azurecli
az network route-table route create `
    --resource-group ${AppResourceGroupName} `
    --route-table-name ${AzureSpringCloudServiceSubnetRouteTableName} `
    --name default `
    --address-prefix 0.0.0.0/0 `
    --next-hop-type VirtualAppliance `
    --next-hop-ip-address ${PaloAltoIpAddress} `
    --verbose

az network route-table route create `
    --resource-group ${AppResourceGroupName} `
    --route-table-name ${AzureSpringCloudAppSubnetRouteTableName} `
    --name default `
    --address-prefix 0.0.0.0/0 `
    --next-hop-type VirtualAppliance `
    --next-hop-ip-address ${PaloAltoIpAddress} `
    --verbose
```

The variables should be populated as follows:

* `$AppResourceGroupName`: The name of the resource group containing Azure Spring Cloud
* `$AzureSpringCloudServiceSubnetRouteTableName`: The name of the Azure Spring Cloud service/runtime subnet route table. In the reference architecture, this is set to 'rt-spokeruntime'.
* `$AzureSpringCloudAppSubnetRouteTableName`: The name of the Azure Spring Cloud app subnet route table. In the reference architecture, this is set to `rt-spokeapp`.

# Next steps

