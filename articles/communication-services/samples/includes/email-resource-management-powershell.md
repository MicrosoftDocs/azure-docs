---
title: include file
description: include file
author: v-deepikal
manager: komivi Agbakpem
services: azure-communication-services

ms.author: v-deepikal
ms.date: 01/16/2024
ms.topic: include
ms.service: azure-communication-services
ms.custom: include files
---

# Get started with Azure PowerShell to automate the creation of Azure Communication Services(ACS), Email Communication Services(ECS), manage custom domains, configure DNS records, verify domains and domain linking to communication resource.

In this sample, we'll cover off what this sample does and what you need as pre-requisites before we run this sample locally on your machine. 

This documentation provides a detailed guide on using Azure PowerShell to automate the creation of Azure Communication Services(ACS) and Email Communication Services(ECS). It also covers the process of managing custom domains, configuring DNS records (such as Domain, SPF, DKIM, DKIM2), verifying domains and domain linking to communication resource.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A DNS zone in Azure to manage your domains.
- The latest [Azure PowerShell](/powershell/azure/install-azps-windows).

### Prerequisite check

- In a command prompt, run the `powershell -command $PSVersionTable.PSVersion` command to check whether the powershell is installed or not.

## Initialize all the Parameters

Before proceeding, define the variables needed for setting up the ACS, ECS and domains, along with DNS configuration for the domains. Modify these variables based on your environment:

```azurepowershell-interactive
$resourceGroup = "ContosoResourceProvider1"
$dataLocation = "United States" # Specify your region
$commServiceName = "ContosoAcsResource1" # Replace with commServiceName
$emailServiceName = "ContosoEcsResource1" # Replace with emailServiceName
$baseDomain = "contoso"
$dnsZoneName = "testing.contoso.net" # Replace with DNS zone name
$domainCount = 10 # Specify the number of domains to create
```

## Connect to Azure Account

Before performing any actions with Azure resources, authenticate using the `Connect-AzAccount` cmdlet. This allows you to login and authenticate your Azure account for further tasks:

```azurepowershell-interactive
try {
    Write-Host "Authenticating to Azure"
    Connect-AzAccount
}
catch {
    Write-Host "Error authenticating to Azure"
    exit 1
}
```

## Create an Azure Communication Service (ACS)

This part of the script creates an Azure Communication Service resource:

```azurepowershell-interactive
try {
    Write-Host "Creating Communication resource - $commServiceName"
    New-AzCommunicationService -ResourceGroupName $resourceGroup -Name $commServiceName -Location "Global" -DataLocation $dataLocation
}
catch {
    Write-Host "Error creating Communication resource"
    exit 1
}
```

## Create Email Communication Service (ECS)

This part of the script creates an Email Communication Service resource:

```azurepowershell-interactive
try {
    Write-Host "Creating Email Communication resource - $emailServiceName"
    New-AzEmailService -ResourceGroupName $resourceGroup -Name $emailServiceName -DataLocation $dataLocation
}
catch {
    Write-Host "Error creating Email Communication resource: $_"
    exit 1
}
```

## Create domains and add records set to DNS

Automate domain creation, configuration, and DNS record setup (including Domain, SPF, DKIM, DKIM2) for each domain:

> [!NOTE]
> The maximum limit for domain creation is 800 per Email Communication Service.

```azurepowershell-interactive
for ($i = 1; $i -le $domainCount; $i++) {
    $currentBaseDomain = "d$i.$baseDomain"
    $domainName = "$currentBaseDomain.$dnsZoneName"
    Write-Host "Creating domain: $domainName"
    try {
        New-AzEmailServiceDomain -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -Name $domainName -DomainManagement "CustomerManaged"
    }
    catch {
        Write-Host "Error creating domain $domainName"
        continue
    }

    Start-Sleep -Seconds 30
    $domainDetailsJson = Get-AzEmailServiceDomain -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -Name $domainName
    $domainDetails = $domainDetailsJson | ConvertFrom-Json
    Add-RecordSetToDNS -baseDomain $currentBaseDomain -domainName $domainName -dnsZoneName $dnsZoneName -resourceGroup $resourceGroup -emailServiceName $emailServiceName -domainDetails $domainDetails    
    if ($domainDetails) {
        $result = Verify-Domain -domainName $domainName -resourceGroup $resourceGroup -emailServiceName $emailServiceName
        if ($result) {
            $linkedDomainIds += $($domainDetails.Id)
        }
        else {
            Write-Host "Domain $domainName verification failed."
        }
    }
    else {
        Write-Host "Failed to add DNS records for domain $domainName."
    }
}

# Add Record Set to DNS
function Add-RecordSetToDNS {
    param (
        [string]$baseDomain,
        [string]$domainName,
        [string]$dnsZoneName,
        [string]$resourceGroup,
        [string]$emailServiceName,
        [PSObject]$domainDetails
    )
    try {
        Write-Host "Adding DNS records for domain: $domainName"
        if ($domainDetails) {
            $recordSetDomain = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $baseDomain -recordtype txt -ErrorAction SilentlyContinue
            if ($recordSetDomain.Count -eq 0) {
                New-AzDnsRecordSet -Name $baseDomain -RecordType "TXT" -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -Ttl 3600
                $recordSetDomain = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $baseDomain -recordtype txt
            }
            Add-AzDnsRecordConfig -RecordSet $recordSetDomain -Value $($domainDetails.properties.VerificationRecords.Domain.Value)
            Set-AzDnsRecordSet -RecordSet $recordSetDomain

            $existingSpfRecord = $recordSetDomain.Records | Where-Object { $_.Value -eq $domainDetails.properties.VerificationRecords.SPF.Value }
            if (-not $existingSpfRecord) {
                $RecordSetSPF = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $baseDomain -recordtype txt
                Add-AzDnsRecordConfig -RecordSet $RecordSetSPF -Value $($domainDetails.properties.VerificationRecords.SPF.Value)
                Set-AzDnsRecordSet -RecordSet $RecordSetSPF                    
            }
            else {
                Write-Host "SPF record already exists for domain: $domainName"
            }

            $recordSetDKIM = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name "$($domainDetails.properties.VerificationRecords.DKIM.Name).$baseDomain" -RecordType CNAME -ErrorAction SilentlyContinue
            if ($recordSetDKIM.Count -eq 0) {
                New-AzDnsRecordSet -Name "$($domainDetails.properties.VerificationRecords.DKIM.Name).$baseDomain" -RecordType CNAME -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -Ttl 3600
                $recordSetDKIM = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name "$($domainDetails.properties.VerificationRecords.DKIM.Name).$baseDomain" -RecordType CNAME
                Add-AzDnsRecordConfig -RecordSet $recordSetDKIM -Cname $($domainDetails.properties.VerificationRecords.DKIM.Value)
                Set-AzDnsRecordSet -RecordSet $recordSetDKIM
            }
            else {
                Write-Host "DKIM record already exists for domain: $domainName"
            }

            $recordSetDKIM2 = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name "$($domainDetails.properties.VerificationRecords.DKIM2.Name).$baseDomain" -RecordType CNAME -ErrorAction SilentlyContinue
            if ($recordSetDKIM2.Count -eq 0) {
                New-AzDnsRecordSet -Name "$($domainDetails.properties.VerificationRecords.DKIM2.Name).$baseDomain" -RecordType "CNAME" -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -Ttl 3600
                $recordSetDKIM2 = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name "$($domainDetails.properties.VerificationRecords.DKIM2.Name).$baseDomain" -RecordType CNAME
                Add-AzDnsRecordConfig -RecordSet $recordSetDKIM2 -Cname $($domainDetails.properties.VerificationRecords.DKIM2.Value)
                Set-AzDnsRecordSet -RecordSet $recordSetDKIM2
            }
            else {
                Write-Host "DKIM2 record already exists for domain: $domainName"
            }                
        }
        else {
            Write-Host "No domain details found for $domainName"
        }
    }
    catch {        
        Write-Host "Error adding DNS records for domain $domainName"
    }
}
```

## Verification of domains

Initiates the domain verification process for the domains, including Domain, SPF, DKIM, and DKIM2 verifications.

```azurepowershell-interactive
function Verify-Domain {
    param (
        [string]$domainName,
        [string]$resourceGroup,
        [string]$emailServiceName
    )
    try {
        Write-Host "Initiating domain verification for $domainName"
        $verificationTypes = @('Domain', 'SPF', 'DKIM', 'DKIM2')

        foreach ($verificationType in $verificationTypes) {
            Invoke-AzEmailServiceInitiateDomainVerification -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -DomainName $domainName -VerificationType $verificationType
        }

        return Poll-ForDomainVerification -domainName $domainName -resourceGroup $resourceGroup -emailServiceName $emailServiceName
    }
    catch {
        Write-Host "Error during domain verification for $domainName"
        return $false
    }
}
```

## Link domains to the communication service

Once the domains are verified and DNS records are configured, you can link the domains to the Azure Communication Service:

> [!NOTE]
> The maximum limit for domain linking is 1000 per Azure Communication Service.

```azurepowershell-interactive
if ($linkedDomainIds.Count -gt 0) {
    try {
        Write-Host "Linking domains to communication service."
        Update-AzCommunicationService -ResourceGroupName $resourceGroup -Name $commServiceName -LinkedDomain $linkedDomainIds
        Write-Host "Domains linked successfully."
    }
    catch {
        Write-Host "Error linking domains"
    }
}
else {
    Write-Host "No domains linked."
}
```

### Complete PowerShell Script for Automating end to end resource creation

```azurepowershell-interactive
# Parameters
$resourceGroup = "ContosoResourceProvider1"
$dataLocation = "United States" # Specify your region
$commServiceName = "ContosoAcsResource1" # Replace with commServiceName
$emailServiceName = "ContosoEcsResource1" # Replace with emailServiceName
$baseDomain = "contoso"
$dnsZoneName = "testing.contoso.net" # Replace with DNS zone name
$domainCount = 10 # Specify the number of domains to create

# Function to add DNS records (Domain, SPF, DKIM, DKIM2) for the domain
function Add-RecordSetToDNS {
    param (
        [string]$baseDomain,
        [string]$domainName,
        [string]$dnsZoneName,
        [string]$resourceGroup,
        [string]$emailServiceName,
        [PSObject]$domainDetails
    )
    try {
        Write-Host "Adding DNS records for domain: $domainName"
        if ($domainDetails) {
            $recordSetDomain = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $baseDomain -recordtype txt -ErrorAction SilentlyContinue
            if ($recordSetDomain.Count -eq 0) {
                New-AzDnsRecordSet -Name $baseDomain -RecordType "TXT" -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -Ttl 3600
                $recordSetDomain = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $baseDomain -recordtype txt
            }
            Add-AzDnsRecordConfig -RecordSet $recordSetDomain -Value $($domainDetails.properties.VerificationRecords.Domain.Value)
            Set-AzDnsRecordSet -RecordSet $recordSetDomain

            $existingSpfRecord = $recordSetDomain.Records | Where-Object { $_.Value -eq $domainDetails.properties.VerificationRecords.SPF.Value }
            if (-not $existingSpfRecord) {
                $RecordSetSPF = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $baseDomain -recordtype txt
                Add-AzDnsRecordConfig -RecordSet $RecordSetSPF -Value $($domainDetails.properties.VerificationRecords.SPF.Value)
                Set-AzDnsRecordSet -RecordSet $RecordSetSPF                    
            }
            else {
                Write-Host "SPF record already exists for domain: $domainName"
            }

            $recordSetDKIM = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name "$($domainDetails.properties.VerificationRecords.DKIM.Name).$baseDomain" -RecordType CNAME -ErrorAction SilentlyContinue
            if ($recordSetDKIM.Count -eq 0) {
                New-AzDnsRecordSet -Name "$($domainDetails.properties.VerificationRecords.DKIM.Name).$baseDomain" -RecordType CNAME -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -Ttl 3600
                $recordSetDKIM = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name "$($domainDetails.properties.VerificationRecords.DKIM.Name).$baseDomain" -RecordType CNAME
                Add-AzDnsRecordConfig -RecordSet $recordSetDKIM -Cname $($domainDetails.properties.VerificationRecords.DKIM.Value)
                Set-AzDnsRecordSet -RecordSet $recordSetDKIM
            }
            else {
                Write-Host "DKIM record already exists for domain: $domainName"
            }

            $recordSetDKIM2 = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name "$($domainDetails.properties.VerificationRecords.DKIM2.Name).$baseDomain" -RecordType CNAME -ErrorAction SilentlyContinue
            if ($recordSetDKIM2.Count -eq 0) {
                New-AzDnsRecordSet -Name "$($domainDetails.properties.VerificationRecords.DKIM2.Name).$baseDomain" -RecordType "CNAME" -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -Ttl 3600
                $recordSetDKIM2 = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name "$($domainDetails.properties.VerificationRecords.DKIM2.Name).$baseDomain" -RecordType CNAME
                Add-AzDnsRecordConfig -RecordSet $recordSetDKIM2 -Cname $($domainDetails.properties.VerificationRecords.DKIM2.Value)
                Set-AzDnsRecordSet -RecordSet $recordSetDKIM2
            }
            else {
                Write-Host "DKIM2 record already exists for domain: $domainName"
            }                
        }
        else {
            Write-Host "No domain details found for $domainName"
        }
    }
    catch {        
        Write-Host "Error adding DNS records for domain $domainName"
    }
}

# Function to verify domain
function Verify-Domain {
    param (
        [string]$domainName,
        [string]$resourceGroup,
        [string]$emailServiceName
    )
    try {
        Write-Host "Initiating domain verification for $domainName"
        $verificationTypes = @('Domain', 'SPF', 'DKIM', 'DKIM2')

        foreach ($verificationType in $verificationTypes) {
            Invoke-AzEmailServiceInitiateDomainVerification -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -DomainName $domainName -VerificationType $verificationType
        }

        return Poll-ForDomainVerification -domainName $domainName -resourceGroup $resourceGroup -emailServiceName $emailServiceName
    }
    catch {
        Write-Host "Error during domain verification for $domainName"
        return $false
    }
}

# Function to poll for domain verification
function Poll-ForDomainVerification {
    param (
        [string]$domainName,
        [string]$resourceGroup,
        [string]$emailServiceName,
        [int]$maxAttempts = 10,
        [int]$delayBetweenAttempts = 10000
    )

    try {
        for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
            $domainDetailsJson = Get-AzEmailServiceDomain -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -Name $domainName
            $domainDetails = $domainDetailsJson | ConvertFrom-Json
            if ($domainDetails) {
                if ($($domainDetails.properties.verificationStates.Domain.Status) -eq 'Verified' -and
                    $($domainDetails.properties.verificationStates.SPF.status) -eq 'Verified' -and
                    $($domainDetails.properties.verificationStates.DKIM.status) -eq 'Verified' -and
                    $($domainDetails.properties.verificationStates.DKIM2.status) -eq 'Verified') {
                    Write-Host "Domain verified successfully."
                    return $true
                }
            }

            Start-Sleep -Milliseconds $delayBetweenAttempts
        }
        Write-Host "Domain verification failed or timed out."
        return $false
    }
    catch {
        Write-Host "Error polling for domain verification"
        return $false
    }
}

# Authenticate to Azure
try {
    Write-Host "Authenticating to Azure"
    Connect-AzAccount
}
catch {
    Write-Host "Error authenticating to Azure"
    exit 1
}

# Create Communication resource
try {
    Write-Host "Creating Communication resource - $commServiceName"
    New-AzCommunicationService -ResourceGroupName $resourceGroup -Name $commServiceName -Location "Global" -DataLocation $dataLocation
}
catch {
    Write-Host "Error creating Communication resource"
    exit 1
}

# Create Email Communication resource
try {
    Write-Host "Creating Email Communication resource - $emailServiceName"
    New-AzEmailService -ResourceGroupName $resourceGroup -Name $emailServiceName -DataLocation $dataLocation
}
catch {
    Write-Host "Error creating Email Communication resource: $_"
    exit 1
}

# Initialize list to store linked domains
$linkedDomainIds = @()

# Create domains and DNS records
for ($i = 1; $i -le $domainCount; $i++) {
    $currentBaseDomain = "d$i.$baseDomain"
    $domainName = "$currentBaseDomain.$dnsZoneName"
    Write-Host "Creating domain: $domainName"
    try {
        New-AzEmailServiceDomain -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -Name $domainName -DomainManagement "CustomerManaged"
    }
    catch {
        Write-Host "Error creating domain $domainName"
        continue
    }

    Start-Sleep -Seconds 30
    $domainDetailsJson = Get-AzEmailServiceDomain -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -Name $domainName
    $domainDetails = $domainDetailsJson | ConvertFrom-Json
    Add-RecordSetToDNS -baseDomain $currentBaseDomain -domainName $domainName -dnsZoneName $dnsZoneName -resourceGroup $resourceGroup -emailServiceName $emailServiceName -domainDetails $domainDetails    
    if ($domainDetails) {
        $result = Verify-Domain -domainName $domainName -resourceGroup $resourceGroup -emailServiceName $emailServiceName
        if ($result) {
            $linkedDomainIds += $($domainDetails.Id)
        }
        else {
            Write-Host "Domain $domainName verification failed."
        }
    }
    else {
        Write-Host "Failed to add DNS records for domain $domainName."
    }
}

# Link domains to the communication service
if ($linkedDomainIds.Count -gt 0) {
    try {
        Write-Host "Linking domains to communication service."
        Update-AzCommunicationService -ResourceGroupName $resourceGroup -Name $commServiceName -LinkedDomain $linkedDomainIds
        Write-Host "Domains linked successfully."
    }
    catch {
        Write-Host "Error linking domains"
    }
}
else {
    Write-Host "No domains linked."
}
```