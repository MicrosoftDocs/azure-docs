---
title: Email Resource Management - Automating the creation and management of Communication and Email Services with custom domains
titleSuffix: An Azure Communication Services Automation Sample
description: Learn how to automate the creation of Communication Services and Email Communication Services. You will also manage custom domains, configure DNS records, and verify domains.
author: Deepika0530
manager: komivi.agbakpem
services: azure-communication-services

ms.author: v-deepikal
ms.date: 01/16/2025
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: email
---

# Email Resource Management: Automating end to end resource creation

Get started with Azure PowerShell to automate the creation of Azure Communication Services (ACS), Email Communication Services (ECS), manage custom domains, configure DNS records, verify domains, and domain linking to communication resource.

In this sample, we cover what the sample does and the prerequisites you need before running it locally on your machine.

This documentation provides a detailed guide on using Azure PowerShell to automate the creation of Azure Communication Services (ACS) and Email Communication Services (ECS). It also covers the process of managing custom domains, configuring DNS records (such as Domain, SPF, DKIM, DKIM2), verifying domains and domain linking to communication resource.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A DNS zone in Azure to manage your domains.
- The latest [Azure PowerShell](/powershell/azure/install-azps-windows).

### Prerequisite check

- In a command prompt, run the `powershell -command $PSVersionTable.PSVersion` command to check whether the PowerShell is installed or not.

## Initialize all the Parameters

Before proceeding, define the variables needed for setting up the ACS, ECS, and domains, along with DNS configuration for the domains. Modify these variables based on your environment:

```azurepowershell-interactive
# Parameters for configuration

# Define the name of the Azure resource group where resources will be created
$resourceGroup = "ContosoResourceProvider1"

# Specify the region where the resources will be created
$dataLocation = "United States"

# Define the name of the Azure Communication Service resource
$commServiceName = "ContosoAcsResource1"

# Define the name of the Email Communication Service resource
$emailServiceName = "ContosoEcsResource1"

# Define the DNS zone name where the domains will be managed (replace with actual DNS zone)
$dnsZoneName = "contoso.net"

# Define the list of domains to be created and managed (replace with your own list of domains)
$domains = @(
    "sales.contoso.net",
    "marketing.contoso.net",
    "support.contoso.net",
    "technical.contoso.net",
    "info.contoso.net"
)
```

## Connect to Azure Account

Before performing any actions with Azure resources, authenticate using the `Connect-AzAccount` cmdlet. This process allows you to log in and authenticate your Azure account for further tasks:

```azurepowershell-interactive
# Attempt to authenticate the Azure session using the Connect-AzAccount cmdlet
try {
    # Output message to indicate the authentication process is starting
    Write-Host "Authenticating to Azure"

    # The Connect-AzAccount cmdlet is used to authenticate the Azure account
    Connect-AzAccount
}
catch {
    # If there is an error during authentication, display the error message
    Write-Host "Error authenticating to Azure"

    # Exit the script with an error code (1) if authentication fails
    exit 1
}
```

## Create an Azure Communication Service (ACS) resource

This part of the script creates an Azure Communication Service resource:

```azurepowershell-interactive
# Attempt to create the Communication Service resource in the specified resource group
try {
    # Output message to indicate the creation of the Communication Service resource is starting
    Write-Host "Creating Communication resource - $commServiceName"

    # The New-AzCommunicationService cmdlet is used to create a new Communication Service resource
    New-AzCommunicationService -ResourceGroupName $resourceGroup -Name $commServiceName -Location "Global" -DataLocation $dataLocation
}
catch {
    # If there is an error during the creation of the Communication Service resource, display the error message
    Write-Host "Error creating Communication resource"

    # Exit the script with an error code (1) if the creation of the Communication Service resource fails
    exit 1
}
```

## Create Email Communication Service (ECS) resource

This part of the script creates an Email Communication Service resource:

```azurepowershell-interactive
# Attempt to create the Email Communication Service resource in the specified resource group
try {
    # Output message to indicate the creation of the Email Communication Service resource is starting
    Write-Host "Creating Email Communication resource - $emailServiceName"

    # The New-AzEmailService cmdlet is used to create a new Email Communication Service resource
    New-AzEmailService -ResourceGroupName $resourceGroup -Name $emailServiceName -DataLocation $dataLocation
}
catch {
    # If there is an error during the creation of the Email Communication Service resource, display the error message
    Write-Host "Error creating Email Communication resource: $_"

    # Exit the script with an error code (1) if the creation of the Email Communication Service resource fails
    exit 1
}
```

## Create domains and add records set to DNS

Automate domain creation, configuration, and DNS record setup (including Domain, SPF, DKIM, DKIM2) for each domain:

> [!NOTE]
> The maximum limit for domain creation is 800 per Email Communication Service.

> [!NOTE]
> In our code, we work with five predefined domains, for which DNS records are added and configured.

```azurepowershell-interactive
# Loop through each domain in the predefined list of domains to create and configure them
foreach ($domainName in $domains){
    # Extract the subdomain prefix from the fully qualified domain name (e.g., "sales" from "sales.contoso.net")
    $subDomainPrefix = $domainName.split('.')[0]

    # Output the domain name that is being created
    Write-Host "Creating domain: $domainName"
    try {
        # Attempt to create the domain in the Email Communication Service resource
        # The "CustomerManaged" option means that the domain management will be done by the customer
        New-AzEmailServiceDomain -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -Name $domainName -DomainManagement "CustomerManaged"
    }
    catch {
        # If domain creation fails, display an error message and continue with the next domain
        Write-Host "Error creating domain $domainName"
        continue
    }

    # Wait for 5 seconds before proceeding to allow time for the domain creation to be processed
    Start-Sleep -Seconds 5

    # Retrieve the domain details after creation
    # The domain details will be used during the DNS record setting request
    $domainDetailsJson = Get-AzEmailServiceDomain -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -Name $domainName
    $domainDetails = $domainDetailsJson | ConvertFrom-Json
    
    # Add DNS records for the domain
    Add-RecordSetToDNS -subDomainPrefix $subDomainPrefix -domainName $domainName -dnsZoneName $dnsZoneName -resourceGroup $resourceGroup -emailServiceName $emailServiceName -domainDetails $domainDetails    
    
    # Check if domain details were successfully retrieved
    if ($domainDetails) {
        # Initiate domain verification process (Domain, SPF, DKIM, DKIM2)
        $result = Verify-Domain -domainName $domainName -resourceGroup $resourceGroup -emailServiceName $emailServiceName
        if ($result) {
            # If the domain is successfully verified, add it to the list of linked domains
            $linkedDomainIds += $($domainDetails.Id)
        }
        else {
            # If domain verification fails, display an error message
            Write-Host "Domain $domainName verification failed."
        }
    }
    else {
        # If domain details were not retrieved, display an error message
        Write-Host "Failed to add DNS records for domain $domainName."
    }
}

# Function to add DNS records (DKIM, DKIM2) for the domain
function Add-DkimRecord {
    param (
        [string]$dnsZoneName,
        [string]$resourceGroup,
        [string]$recordName,
        [string]$recordValue,
        [string]$recordType
    )
    try {
        # Output the attempt to check if the DNS record already exists
        Write-Host "Checking for existing $recordType record: $recordName"

        # Retrieves the DNS record set for the given subdomain prefix and type (CNAME) in the specified DNS zone and resource group. 
        # The first instance uses -ErrorAction SilentlyContinue to suppress any errors if the record set doesn't exist.
        $recordSet = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $recordName -RecordType $recordType -ErrorAction SilentlyContinue

        # If no existing record set is found (i.e., recordSet.Count is 0)
        if ($recordSet.Count -eq 0) {
            # Output a message stating that a new record is being created
            Write-Host "Creating new $recordType record: $recordName"

            # Creates a new DNS record set for the specified record type (CNAME) in the given zone and resource group
            # The TTL is set to 3600 seconds (1 hour)
            New-AzDnsRecordSet -Name $recordName -RecordType $recordType -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -Ttl 3600
            
            # Retrieve the newly created record set to add the record value
            $recordSet = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $recordName -RecordType $recordType
            
            # Add the provided record value to the newly created record set (e.g., CNAME)
            Add-AzDnsRecordConfig -RecordSet $recordSet -Cname $recordValue
            
            # Apply the changes and save the updated record set back to Azure DNS
            Set-AzDnsRecordSet -RecordSet $recordSet
        }
        else {
            # If the record already exists, notify that it has been found
            Write-Host "$recordType record already exists for: $recordName"
        }
    }
    catch {
        # If an error occurs during the execution of the try block, output an error message
        Write-Host "Error adding $recordType record for $recordName"
    }
}

# Function to add DNS records (Domain, SPF, DKIM, DKIM2) for the domain
function Add-RecordSetToDNS {
    param (
        [string]$subDomainPrefix,
        [string]$domainName,
        [string]$dnsZoneName,
        [string]$resourceGroup,
        [string]$emailServiceName,
        [PSObject]$domainDetails
    )
    try {
        # Output message indicating that DNS records are being added for the domain
        Write-Host "Adding DNS records for domain: $domainName"

        # Check if domain details are available
        if ($domainDetails) {
            # Retrieve the TXT record set for the domain
            # Retrieves the DNS record set for the given subdomain prefix and type (TXT) in the specified DNS zone and resource group. 
            # The first instance uses -ErrorAction SilentlyContinue to suppress any errors if the record set doesn't exist.
            $recordSetDomain = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $subDomainPrefix -recordtype txt -ErrorAction SilentlyContinue

            # If the TXT record set does not exist, create a new one
            if ($recordSetDomain.Count -eq 0) {
                New-AzDnsRecordSet -Name $subDomainPrefix -RecordType "TXT" -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -Ttl 3600
                $recordSetDomain = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $subDomainPrefix -recordtype txt
            }

            # Add the Domain verification record to the TXT record set
            Add-AzDnsRecordConfig -RecordSet $recordSetDomain -Value $($domainDetails.properties.VerificationRecords.Domain.Value)
            Set-AzDnsRecordSet -RecordSet $recordSetDomain

            # Check if the SPF record already added; if not, create and add it
            $existingSpfRecord = $recordSetDomain.Records | Where-Object { $_.Value -eq $domainDetails.properties.VerificationRecords.SPF.Value }
            if (-not $existingSpfRecord) {
                # Create and add the SPF record
                $RecordSetSPF = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $subDomainPrefix -recordtype txt
                Add-AzDnsRecordConfig -RecordSet $RecordSetSPF -Value $($domainDetails.properties.VerificationRecords.SPF.Value)
                Set-AzDnsRecordSet -RecordSet $RecordSetSPF                    
            }
            else {
                # If SPF record already exists, notify the user
                Write-Host "SPF record already exists for domain: $domainName"
            }

            # Call the Add-DkimRecord function for DKIM
            Add-DkimRecord -dnsZoneName $dnsZoneName -resourceGroup $resourceGroup -recordName "$($domainDetails.properties.VerificationRecords.DKIM.Name).$subDomainPrefix" -recordValue $domainDetails.properties.VerificationRecords.DKIM.Value -recordType "CNAME"

            # Call the Add-DkimRecord function for DKIM2
            Add-DkimRecord -dnsZoneName $dnsZoneName -resourceGroup $resourceGroup -recordName "$($domainDetails.properties.VerificationRecords.DKIM2.Name).$subDomainPrefix" -recordValue $domainDetails.properties.VerificationRecords.DKIM2.Value -recordType "CNAME"
        }
        else {
            # If domain details are not found, output an error message
            Write-Host "No domain details found for $domainName"
        }
    }
    catch {     
        # If an error occurs during the DNS record setup, output an error message
        Write-Host "Error adding DNS records for domain $domainName"
    }
}
```

## Verification of domains

Initiates the domain verification process for the domains, including Domain, SPF, DKIM, and DKIM2 verifications.

```azurepowershell-interactive
# This function initiates the domain verification process for the specified domain.
# It checks verification for four types: Domain, SPF, DKIM, and DKIM2.
function Verify-Domain {
    param (
        [string]$domainName,
        [string]$resourceGroup,
        [string]$emailServiceName
    )
    try {
        Write-Host "Initiating domain verification for $domainName"

        # Define the verification types: Domain, SPF, DKIM, and DKIM2
        $verificationTypes = @('Domain', 'SPF', 'DKIM', 'DKIM2')

        # Loop through each verification type and initiate the verification process
        foreach ($verificationType in $verificationTypes) {
            Invoke-AzEmailServiceInitiateDomainVerification -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -DomainName $domainName -VerificationType $verificationType
        }

        # After initiating the verification, call the Poll function to check the verification status
        return Poll-ForDomainVerification -domainName $domainName -resourceGroup $resourceGroup -emailServiceName $emailServiceName
    }
    catch {
        Write-Host "Error during domain verification for $domainName" # Handle any error during the process
        return $false # Return false if verification fails
    }
}
```

## Link domains to the communication service

Once the domains are verified and DNS records are configured, you can link the domains to the Azure Communication Service:

> [!NOTE]
> The maximum limit for domain linking is 1000 per Azure Communication Service.

```azurepowershell-interactive
# Link domains to the communication service

# Once the domains have been verified and the necessary DNS records are configured, 
# this section of the script links those domains to the Azure Communication Service.
# Ensure that domain verification and DNS setup are completed before linking.

# Check if there are any domains that need to be linked (i.e., domains that were successfully verified)
if ($linkedDomainIds.Count -gt 0) {
    try {
        # Output message indicating that the domains are being linked to the communication service
        Write-Host "Linking domains to communication service."

        # Link the verified domains to the Azure Communication Service
        Update-AzCommunicationService -ResourceGroupName $resourceGroup -Name $commServiceName -LinkedDomain $linkedDomainIds

        # Output message indicating that the domains have been successfully linked
        Write-Host "Domains linked successfully."
    }
    catch {
        # If there is an error during the domain linking process, display an error message
        Write-Host "Error linking domains"
    }
}
else {
    # If there are no domains to link, output a message indicating that no domains are linked
    Write-Host "No domains linked."
}
```

### Complete PowerShell Script for Automating end to end resource creation

```azurepowershell-interactive
# Parameters for configuration

# Define the name of the Azure resource group where resources will be created
$resourceGroup = "ContosoResourceProvider1"

# Specify the region where the resources will be created
$dataLocation = "United States"

# Define the name of the Azure Communication Service resource
$commServiceName = "ContosoAcsResource1"

# Define the name of the Email Communication Service resource
$emailServiceName = "ContosoEcsResource1"

# Define the DNS zone name where the domains will be managed (replace with actual DNS zone)
$dnsZoneName = "contoso.net"

# Define the list of domains to be created and managed (replace with your own list of domains)
$domains = @(
    "sales.contoso.net",
    "marketing.contoso.net",
    "support.contoso.net",
    "technical.contoso.net",
    "info.contoso.net"
)

# Function to add DNS records (DKIM, DKIM2) for the domain
function Add-DkimRecord {
    param (
        [string]$dnsZoneName,
        [string]$resourceGroup,
        [string]$recordName,
        [string]$recordValue,
        [string]$recordType
    )
    try {
        # Output the attempt to check if the DNS record already exists
        Write-Host "Checking for existing $recordType record: $recordName"

        # Retrieves the DNS record set for the given subdomain prefix and type (CNAME) in the specified DNS zone and resource group. 
        # The first instance uses -ErrorAction SilentlyContinue to suppress any errors if the record set doesn't exist.
        $recordSet = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $recordName -RecordType $recordType -ErrorAction SilentlyContinue

        # If no existing record set is found (i.e., recordSet.Count is 0)
        if ($recordSet.Count -eq 0) {
            # Output a message stating that a new record is being created
            Write-Host "Creating new $recordType record: $recordName"

            # Creates a new DNS record set for the specified record type (CNAME) in the given zone and resource group
            # The TTL is set to 3600 seconds (1 hour)
            New-AzDnsRecordSet -Name $recordName -RecordType $recordType -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -Ttl 3600
            
            # Retrieve the newly created record set to add the record value
            $recordSet = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $recordName -RecordType $recordType
            
            # Add the provided record value to the newly created record set (e.g., CNAME)
            Add-AzDnsRecordConfig -RecordSet $recordSet -Cname $recordValue
            
            # Apply the changes and save the updated record set back to Azure DNS
            Set-AzDnsRecordSet -RecordSet $recordSet
        }
        else {
            # If the record already exists, notify that it has been found
            Write-Host "$recordType record already exists for: $recordName"
        }
    }
    catch {
        # If an error occurs during the execution of the try block, output an error message
        Write-Host "Error adding $recordType record for $recordName"
    }
}

# Function to add DNS records (Domain, SPF, DKIM, DKIM2) for the domain
function Add-RecordSetToDNS {
    param (
        [string]$subDomainPrefix,
        [string]$domainName,
        [string]$dnsZoneName,
        [string]$resourceGroup,
        [string]$emailServiceName,
        [PSObject]$domainDetails
    )
    try {
        # Output message indicating that DNS records are being added for the domain
        Write-Host "Adding DNS records for domain: $domainName"

        # Check if domain details are available
        if ($domainDetails) {
            # Retrieve the TXT record set for the domain
            # Retrieves the DNS record set for the given subdomain prefix and type (TXT) in the specified DNS zone and resource group. 
            # The first instance uses -ErrorAction SilentlyContinue to suppress any errors if the record set doesn't exist.
            $recordSetDomain = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $subDomainPrefix -recordtype txt -ErrorAction SilentlyContinue

            # If the TXT record set does not exist, create a new one
            if ($recordSetDomain.Count -eq 0) {
                New-AzDnsRecordSet -Name $subDomainPrefix -RecordType "TXT" -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -Ttl 3600
                $recordSetDomain = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $subDomainPrefix -recordtype txt
            }

            # Add the Domain verification record to the TXT record set
            Add-AzDnsRecordConfig -RecordSet $recordSetDomain -Value $($domainDetails.properties.VerificationRecords.Domain.Value)
            Set-AzDnsRecordSet -RecordSet $recordSetDomain

            # Check if the SPF record already added; if not, create and add it
            $existingSpfRecord = $recordSetDomain.Records | Where-Object { $_.Value -eq $domainDetails.properties.VerificationRecords.SPF.Value }
            if (-not $existingSpfRecord) {
                # Create and add the SPF record
                $RecordSetSPF = Get-AzDnsRecordSet -ZoneName $dnsZoneName -ResourceGroupName $resourceGroup -name $subDomainPrefix -recordtype txt
                Add-AzDnsRecordConfig -RecordSet $RecordSetSPF -Value $($domainDetails.properties.VerificationRecords.SPF.Value)
                Set-AzDnsRecordSet -RecordSet $RecordSetSPF                    
            }
            else {
                # If SPF record already exists, notify the user
                Write-Host "SPF record already exists for domain: $domainName"
            }

            # Call the Add-DkimRecord function for DKIM
            Add-DkimRecord -dnsZoneName $dnsZoneName -resourceGroup $resourceGroup -recordName "$($domainDetails.properties.VerificationRecords.DKIM.Name).$subDomainPrefix" -recordValue $domainDetails.properties.VerificationRecords.DKIM.Value -recordType "CNAME"

            # Call the Add-DkimRecord function for DKIM2
            Add-DkimRecord -dnsZoneName $dnsZoneName -resourceGroup $resourceGroup -recordName "$($domainDetails.properties.VerificationRecords.DKIM2.Name).$subDomainPrefix" -recordValue $domainDetails.properties.VerificationRecords.DKIM2.Value -recordType "CNAME"
        }
        else {
            # If domain details are not found, output an error message
            Write-Host "No domain details found for $domainName"
        }
    }
    catch {     
        # If an error occurs during the DNS record setup, output an error message
        Write-Host "Error adding DNS records for domain $domainName"
    }
}

# Verification of domains
# This function initiates the domain verification process for the specified domain.
# It checks verification for four types: Domain, SPF, DKIM, and DKIM2.
function Verify-Domain {
    param (
        [string]$domainName,
        [string]$resourceGroup,
        [string]$emailServiceName
    )
    try {
        Write-Host "Initiating domain verification for $domainName"

        # Define the verification types: Domain, SPF, DKIM, and DKIM2
        $verificationTypes = @('Domain', 'SPF', 'DKIM', 'DKIM2')

        # Loop through each verification type and initiate the verification process
        foreach ($verificationType in $verificationTypes) {
            Invoke-AzEmailServiceInitiateDomainVerification -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -DomainName $domainName -VerificationType $verificationType
        }

        # After initiating the verification, call the Poll function to check the verification status
        return Poll-ForDomainVerification -domainName $domainName -resourceGroup $resourceGroup -emailServiceName $emailServiceName
    }
    catch {
        Write-Host "Error during domain verification for $domainName" # Handle any error during the process
        return $false # Return false if verification fails
    }
}

# Function to poll for domain verification

# This function checks the verification status of a domain, including Domain, SPF, DKIM, and DKIM2.
# It will keep checking the verification status at regular intervals (defined by $delayBetweenAttempts)
# until the domain is verified or the maximum number of attempts ($maxAttempts) is reached.
function Poll-ForDomainVerification {
    param (
        [string]$domainName,
        [string]$resourceGroup,
        [string]$emailServiceName,
        [int]$maxAttempts = 10, # Maximum number of attempts to check the domain verification status (default: 10)
        [int]$delayBetweenAttempts = 10000 # Delay between attempts in milliseconds (default: 10 seconds)
    )

    try {
        # Loop through the attempts to check the domain verification status
        for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
			# Fetch domain details to check the verification status
            $domainDetailsJson = Get-AzEmailServiceDomain -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -Name $domainName
            $domainDetails = $domainDetailsJson | ConvertFrom-Json
			
            if ($domainDetails) {
				# Check if all verification states (Domain, SPF, DKIM, DKIM2) are 'Verified'
                if ($($domainDetails.properties.verificationStates.Domain.Status) -eq 'Verified' -and
                    $($domainDetails.properties.verificationStates.SPF.status) -eq 'Verified' -and
                    $($domainDetails.properties.verificationStates.DKIM.status) -eq 'Verified' -and
                    $($domainDetails.properties.verificationStates.DKIM2.status) -eq 'Verified') {
                    Write-Host "Domain verified successfully."
                    return $true # Return true if all verification states are 'Verified'
                }
            }
			
            # Wait for the specified delay before checking again
            Start-Sleep -Milliseconds $delayBetweenAttempts
        }
		
        # If the maximum attempts are reached and domain is still not verified, return false
        Write-Host "Domain verification failed or timed out."
        return $false
    }
    catch {
        # Catch any errors during the polling process and return false
        Write-Host "Error polling for domain verification"
        return $false
    }
}

# Connect to Azure
# Attempt to authenticate the Azure session using the Connect-AzAccount cmdlet
try {
    # Output message to indicate the authentication process is starting
    Write-Host "Authenticating to Azure"

    # The Connect-AzAccount cmdlet is used to authenticate the Azure account
    Connect-AzAccount
}
catch {
    # If there is an error during authentication, display the error message
    Write-Host "Error authenticating to Azure"

    # Exit the script with an error code (1) if authentication fails
    exit 1
}

# Create Communication resource
# Attempt to create the Communication Service resource in the specified resource group
try {
    # Output message to indicate the creation of the Communication Service resource is starting
    Write-Host "Creating Communication resource - $commServiceName"

    # The New-AzCommunicationService cmdlet is used to create a new Communication Service resource
    New-AzCommunicationService -ResourceGroupName $resourceGroup -Name $commServiceName -Location "Global" -DataLocation $dataLocation
}
catch {
    # If there is an error during the creation of the Communication Service resource, display the error message
    Write-Host "Error creating Communication resource"

    # Exit the script with an error code (1) if the creation of the Communication Service resource fails
    exit 1
}

# Create Email Communication resource
# Attempt to create the Email Communication Service resource in the specified resource group
try {
    # Output message to indicate the creation of the Email Communication Service resource is starting
    Write-Host "Creating Email Communication resource - $emailServiceName"

    # The New-AzEmailService cmdlet is used to create a new Email Communication Service resource
    New-AzEmailService -ResourceGroupName $resourceGroup -Name $emailServiceName -DataLocation $dataLocation
}
catch {
    # If there is an error during the creation of the Email Communication Service resource, display the error message
    Write-Host "Error creating Email Communication resource: $_"

    # Exit the script with an error code (1) if the creation of the Email Communication Service resource fails
    exit 1
}

# Initialize list to store linked domains
$linkedDomainIds = @()

# Create domains and DNS records
# Loop through each domain in the predefined list of domains to create and configure them
foreach ($domainName in $domains){
    # Extract the subdomain prefix from the fully qualified domain name (e.g., "sales" from "sales.contoso.net")
    $subDomainPrefix = $domainName.split('.')[0]

    # Output the domain name that is being created
    Write-Host "Creating domain: $domainName"
    try {
        # Attempt to create the domain in the Email Communication Service resource
        # The "CustomerManaged" option means that the domain management will be done by the customer
        New-AzEmailServiceDomain -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -Name $domainName -DomainManagement "CustomerManaged"
    }
    catch {
        # If domain creation fails, display an error message and continue with the next domain
        Write-Host "Error creating domain $domainName"
        continue
    }

    # Wait for 5 seconds before proceeding to allow time for the domain creation to be processed
    Start-Sleep -Seconds 5

    # Retrieve the domain details after creation
    $domainDetailsJson = Get-AzEmailServiceDomain -ResourceGroupName $resourceGroup -EmailServiceName $emailServiceName -Name $domainName
    $domainDetails = $domainDetailsJson | ConvertFrom-Json
    
    # Add DNS records for the domain
    Add-RecordSetToDNS -subDomainPrefix $subDomainPrefix -domainName $domainName -dnsZoneName $dnsZoneName -resourceGroup $resourceGroup -emailServiceName $emailServiceName -domainDetails $domainDetails    
    
    # Check if domain details were successfully retrieved
    if ($domainDetails) {
        # Initiate domain verification process (Domain, SPF, DKIM, DKIM2)
        $result = Verify-Domain -domainName $domainName -resourceGroup $resourceGroup -emailServiceName $emailServiceName
        if ($result) {
            # If the domain is successfully verified, add it to the list of linked domains
            $linkedDomainIds += $($domainDetails.Id)
        }
        else {
            # If domain verification fails, display an error message
            Write-Host "Domain $domainName verification failed."
        }
    }
    else {
        # If domain details were not retrieved, display an error message
        Write-Host "Failed to add DNS records for domain $domainName."
    }
}

# Link domains to the communication service
# Once the domains have been verified and the necessary DNS records are configured, 
# this section of the script links those domains to the Azure Communication Service.
# Ensure that domain verification and DNS setup are completed before linking.

# Check if there are any domains that need to be linked (i.e., domains that were successfully verified)
if ($linkedDomainIds.Count -gt 0) {
    try {
        # Output message indicating that the domains are being linked to the communication service
        Write-Host "Linking domains to communication service."

        # Link the verified domains to the Azure Communication Service
        Update-AzCommunicationService -ResourceGroupName $resourceGroup -Name $commServiceName -LinkedDomain $linkedDomainIds

        # Output message indicating that the domains have been successfully linked
        Write-Host "Domains linked successfully."
    }
    catch {
        # If there is an error during the domain linking process, display an error message
        Write-Host "Error linking domains"
    }
}
else {
    # If there are no domains to link, output a message indicating that no domains are linked
    Write-Host "No domains linked."
}
```

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. To delete your communication resource, run the following command.

```azurecli-interactive
az communication delete --name "ContosoAcsResource1" --resource-group "ContosoResourceProvider1"
```

If you want to clean up and remove an Email Communication Services, You can delete your Email Communication resource by running the following command:

```PowerShell
PS C:\> Remove-AzEmailService -Name ContosoEcsResource1 -ResourceGroupName ContosoResourceProvider1
```

If you want to clean up and remove a Domain resource, You can delete your Domain resource by running the following command:

```PowerShell
PS C:\> Remove-AzEmailServiceDomain -Name contoso.com -EmailServiceName ContosoEcsResource1 -ResourceGroupName ContosoResourceProvider1
```

[Deleting the resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md#delete-resource-groups) also deletes any other resources associated with it.

If you have any phone numbers assigned to your resource upon resource deletion, the phone numbers are automatically released from your resource at the same time.

> [!NOTE]
> Resource deletion is **permanent** and no data, including Event Grid filters, phone numbers, or other data tied to your resource, can be recovered if you delete the resource.
