---
title: How to configure Palo Alto for Azure Spring Cloud
description: How to configure Palo Alto for Azure Spring Cloud
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.service: spring-cloud
ms.date: 06/30/2021
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

You should already have a Palo Alto deployment (you can provision [Palo Alto from Azure Marketplace](https://ms.portal.azure.com/#create/paloaltonetworks.vmseries-ngfwbundle2)). In the steps below, we'll assume you have two pre-configured network zones: `Azure_Inside`, containing the interface connected to a virtual network peered with the Azure Spring Cloud virtual network, and `Azure_Outside` containing the interface to the public internet.

### Prepare CSV files

We'll need to create three CSV files.

The first, `AzureSpringCloudServices.csv` should contain ingress ports for Azure Spring Cloud. The values below are offered as an example only. See [Azure Spring Cloud network requirements](/azure/spring-cloud/vnet-customer-responsibilities#azure-spring-cloud-network-requirements) for all required values.

```
name,protocol,port,tag
ASC_1194,udp,1194,AzureSpringCloud
ASC_443,tcp,443,AzureSpringCloud
ASC_9000,tcp,9000,AzureSpringCloud
ASC_445,tcp,445,AzureSpringCloud
ASC_123,udp,123,AzureSpringCloud
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

**Delete the security rule using the [Security Rule REST API](https://docs.paloaltonetworks.com/pan-os/9-1/pan-os-panorama-api/get-started-with-the-pan-os-rest-api/create-security-policy-rule-rest-api.html)**

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

## Create a custom URL category

## Create a security rule

## Create App Insights addresses

## Configure the next hop

