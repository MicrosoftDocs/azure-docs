---
title: include file
description: include file
author: Deepika0530
manager: komivi.agbakpem
services: azure-communication-services

ms.author: v-deepikal
ms.date: 01/31/2024
ms.topic: include
ms.service: azure-communication-services
ms.custom: include files
---

Get started with Azure CLI PowerShell to automate the creation of Azure Communication Services, Email Communication Services, manage custom domains, configure DNS records, verify domains, and domain linking to communication resource.

In this sample, we describe what the sample does and the prerequisites you need before running it locally on your machine.

This article describes how to use Azure CLI PowerShell to automate the creation of Azure Communication Services and Email Communication Services. It also describes the process of managing custom domains, configuring DNS records (such as Domain, SPF, DKIM, DKIM2), verifying domains and domain linking to communication resource.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A DNS zone in Azure to manage your domains.
- The latest [Azure PowerShell](/powershell/azure/install-azps-windows).
- The latest [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli).

## Prerequisite check

- In a command prompt, run the `powershell -command $PSVersionTable.PSVersion` command to check whether the PowerShell is installed.

```azurepowershell-interactive
powershell -command $PSVersionTable.PSVersion
```

- In a command prompt, run the `az --version` command to check whether the Azure CLI is installed.

```azurepowershell-interactive
az --version
```

- Before you can use the Azure CLI to manage your resources, [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials.

```azurepowershell-interactive
az login
```

## Initialize all the Parameters

Before proceeding, define the variables needed for setting up the ACS, ECS, and domains, along with DNS configuration for the domains. Modify these variables based on your environment:

```azurepowershell-interactive
# Variables
# Define the name of the Azure resource group where resources are created
$resourceGroup = "ContosoResourceProvider1"

# Specify the region where the resources are created. In this case, Europe.
$dataLocation = "europe"

# Define the name of the Azure Communication Service resource
$commServiceName = "ContosoAcsResource1"

# Define the name of the Email Communication Service resource
$emailServiceName = "ContosoEcsResource1"

# Define the DNS zone name where the domains are managed (replace with actual DNS zone)
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

## Sign in to Azure account

Before performing any actions with Azure resources, authenticate using the `az login` cmdlet. This process enables you to sign in and authenticate your Azure account for further tasks:

```azurepowershell-interactive
# Log in to Azure
# Output message to indicate the authentication process is starting
Write-Host "Logging in to Azure..."
try {
    # Execute the Azure CLI login command
    az login
} catch {
    # If there is an error during authentication, display the error message
    Write-Host "Error during Azure login"

    # Exit the script with an error code (1) if authentication fails
    exit 1
}
```

## Create an Azure Communication Service (ACS) resource

This part of the script creates an Azure Communication Service resource:

```azurepowershell-interactive
# Create Communication resource
# Output message to indicate the creation of the Communication Service resource is starting
Write-Host "Creating Communication resource - $commServiceName"
try {
    # The az communication create cmdlet is used to create a new Communication Service resource
    az communication create --name $commServiceName --resource-group $resourceGroup --location global --data-location $dataLocation
} catch {
    # If there is an error during the creation of the Communication Service resource, display the error message
    Write-Host "Error while creating Communication resource"

    # Exit the script with an error code (1) if the creation of the Communication Service resource fails
    exit 1
}
```

## Create Email Communication Service (ECS) resource

This part of the script creates an Email Communication Service resource:

```azurepowershell-interactive
# Create Email Communication resource
# Output message to indicate the creation of the Email Communication Service resource is starting
Write-Host "Creating Email Communication resource - $emailServiceName"
try {
    # The az communication email create cmdlet is used to create a new Email Communication Service resource
    az communication email create --name $emailServiceName --resource-group $resourceGroup --location global --data-location $dataLocation
} catch {
    # If there is an error during the creation of the Email Communication Service resource, display the error message
    Write-Host "Error while creating Email Communication resource"

    # Exit the script with an error code (1) if the creation of the Email Communication Service resource fails
    exit 1
}
```

## Create domains

Automate the creation of email domains, by following command:

> [!NOTE]
> The maximum limit for domain creation is 800 per Email Communication Service.

> [!NOTE]
> In our code, we work with five predefined domains, for which DNS records are added and configured.

```azurepowershell-interactive
# Create the email domain in Email Communication Service.
# The command includes the domain name, resource group, email service name, location, and domain management type (CustomerManaged)
az communication email domain create --name $domainName --resource-group $resourceGroup --email-service-name $emailServiceName --location global --domain-management CustomerManaged
```

## Add records set to DNS

Add records to DNS record setup (including Domain, SPF, DKIM, DKIM2) for each domain.

```azurepowershell-interactive
# Function to add DNS records
function Add-RecordSetToDNS {
    param (
        [string]$domainName,
        [string]$subDomainPrefix
    )

    # Output a message indicating that DNS record sets are being added for the specified domain
    Write-Host "Adding DNS record sets for domain: $domainName"
    try {
        # Run the Azure CLI command to fetch domain details for the specified domain name
        $domainDetailsJson = az communication email domain show --resource-group $resourceGroup --email-service-name $emailServiceName --name $domainName
    } catch {
        # If an error occurs while fetching domain details, output an error message and exit the script
        Write-Host "Error fetching domain details for $domainName"
        exit 1
    }

    # If no domain details are returned, output a message and exit the script
    if (-not $domainDetailsJson) {
        Write-Host "Failed to fetch domain details for $domainName"
        exit 1
    }

    # Parse the JSON response to extract the necessary domain details
    $domainDetails = $domainDetailsJson | ConvertFrom-Json

    # Extract verification record values Domain, SPF and DKIM from the parsed JSON response
    # These values are used to create DNS records
    $dkimName = $domainDetails.verificationRecords.DKIM.name
    $dkimValue = $domainDetails.verificationRecords.DKIM.value
    $dkim2Name = $domainDetails.verificationRecords.DKIM2.name
    $dkim2Value = $domainDetails.verificationRecords.DKIM2.value
    $spfValue = $domainDetails.verificationRecords.SPF.value
    $domainValue = $domainDetails.verificationRecords.Domain.value
    try {
        # Create the TXT DNS record for the domain's verification value
        az network dns record-set txt create --name $subDomainPrefix --zone-name $dnsZoneName --resource-group $resourceGroup
        
        # Add the domain verification record to the TXT DNS record
        az network dns record-set txt add-record --resource-group $resourceGroup --zone-name $dnsZoneName --record-set-name $subDomainPrefix --value $domainValue
        
        # Add the SPF record value to the TXT DNS record
        az network dns record-set txt add-record --resource-group $resourceGroup --zone-name $dnsZoneName --record-set-name $subDomainPrefix --value "`"$spfValue`""
        
        # Create CNAME DNS records for DKIM verification
        az network dns record-set cname create --resource-group $resourceGroup --zone-name $dnsZoneName --name "$dkimName.$subDomainPrefix"
        
        # Add the DKIM record value to the CNAME DNS record
        az network dns record-set cname set-record --resource-group $resourceGroup --zone-name $dnsZoneName --record-set-name "$dkimName.$subDomainPrefix" --cname $dkimValue
        
        # Create a CNAME record for the second DKIM2 verification
        az network dns record-set cname create --resource-group $resourceGroup --zone-name $dnsZoneName --name "$dkim2Name.$subDomainPrefix"
        
        # Add the DKIM2 record value to the CNAME DNS record
        az network dns record-set cname set-record --resource-group $resourceGroup --zone-name $dnsZoneName --record-set-name "$dkim2Name.$subDomainPrefix" --cname $dkim2Value                
    } catch {
        # If an error occurs while adding DNS records, output an error message and exit the script
        Write-Host "Error while adding DNS records for domain $domainName"
        exit 1
    }

    # Return the domain details as an object for further use if needed
    return $domainDetails
}
```

## Verification of domains

Initiates the domain verification process for the domains, including Domain, SPF, DKIM, and DKIM2 verifications.

```azurepowershell-interactive
# Verify domain function
function Verify-Domain {
    param (
        [string]$domainName
    )

    Write-Host "Initiating domain verification for: $domainName"

    # Define the types of verification that need to be performed
    $verificationTypes = @("Domain", "SPF", "DKIM", "DKIM2")

    # Loop over each verification type and initiate the verification process via Azure CLI
    foreach ($verificationType in $verificationTypes) {
        try {
            # Run the Azure CLI command to initiate the verification process for each verification type
            az communication email domain initiate-verification --domain-name $domainName --email-service-name $emailServiceName --resource-group $resourceGroup --verification-type $verificationType
        } catch {
            Write-Host "Error initiating verification for $domainName"
            exit 1
        }
    }

    # Polling for domain verification
    $attempts = 0 # Track the number of verification attempts
    $maxAttempts = 10 # Set the maximum number of attempts to check domain verification status

    # Loop for polling and checking verification status up to maxAttempts times
    while ($attempts -lt $maxAttempts) {
        try {
            # Run the Azure CLI command to fetch the domain details
            $domainDetailsJson = az communication email domain show --resource-group $resourceGroup --email-service-name $emailServiceName --name $domainName
        } catch {
            # If an error occurs while fetching the domain verification status, output an error message and exit
            Write-Host "Error fetching domain verification status for $domainName"
            exit 1
        }

        # If no domain details are returned, output a message and exit the script
        if (-not $domainDetailsJson) {
            Write-Host "Failed to fetch domain verification details for $domainName"
            exit 1
        }

        # Parse the domain details JSON response
        $domainDetails = $domainDetailsJson | ConvertFrom-Json

        $dkimStatus = $domainDetails.verificationStates.DKIM.status
        $dkim2Status = $domainDetails.verificationStates.DKIM2.status
        $domainStatus = $domainDetails.verificationStates.Domain.status
        $spfStatus = $domainDetails.verificationStates.SPF.status

        # Check if all verification statuses are "Verified"
        if ($dkimStatus -eq 'Verified' -and $dkim2Status -eq 'Verified' -and $domainStatus -eq 'Verified' -and $spfStatus -eq 'Verified') {
            Write-Host "Domain verified successfully."
            return $true
        }

        # If verification is not yet complete, wait before checking again
        $attempts++
        Start-Sleep -Seconds 10
    }

    # If the maximum number of attempts is reached without successful verification, print failure message
    Write-Host "Domain $domainName verification failed or timed out."
    return $false
}
```

## Link domains to the communication service

Once the domains are verified and DNS records are configured, you can link the domains to the Azure Communication Service:

> [!NOTE]
> The maximum limit for domain linking is 1000 per Azure Communication Service.

```azurepowershell-interactive
# Linking domains to the communication service
if ($linkedDomainIds.Count -gt 0) {
    Write-Host "Linking domains to communication service."
    try {
        # Run the Azure CLI command to link the verified domains to the Communication service
        az communication update --name $commServiceName --resource-group $resourceGroup --linked-domains $linkedDomainIds

        # Output a success message if the domains were successfully linked
        Write-Host "Domains linked successfully."
    } catch {
        # If an error occurs while linking the domains, output an error message and exit the script
        Write-Host "Error linking domains"
        exit 1 # Exit the script with error code 1
    }
} else {
    # If no domains were linked, output a message indicating no domains to link
    Write-Host "No domains were linked."
}
```

## Complete PowerShell script with Azure CLI Commands for Automating End-to-End Resource Creation

```azurepowershell-interactive
# Variables
# Define the name of the Azure resource group where resources are created
$resourceGroup = "ContosoResourceProvider1"

# Specify the region where the resources are created. In this case, Europe.
$dataLocation = "europe"

# Define the name of the Azure Communication Service resource
$commServiceName = "ContosoAcsResource1"

# Define the name of the Email Communication Service resource
$emailServiceName = "ContosoEcsResource1"

# Define the DNS zone name where the domains are managed (replace with actual DNS zone)
$dnsZoneName = "contoso.net"

# Define the list of domains to be created and managed (replace with your own list of domains)
$domains = @(
    "sales.contoso.net",
    "marketing.contoso.net",
    "support.contoso.net",
    "technical.contoso.net",
    "info.contoso.net"
)

# Log in to Azure
# Output message to indicate the authentication process is starting
Write-Host "Logging in to Azure..."
try {
    # Execute the Azure CLI login command
    az login
} catch {
    # If there is an error during authentication, display the error message
    Write-Host "Error during Azure login"

    # Exit the script with an error code (1) if authentication fails
    exit 1
}

# Create Communication resource
# Output message to indicate the creation of the Communication Service resource is starting
Write-Host "Creating Communication resource - $commServiceName"
try {
    # The az communication create cmdlet is used to create a new Communication Service resource
    az communication create --name $commServiceName --resource-group $resourceGroup --location global --data-location $dataLocation
} catch {
    # If there is an error during the creation of the Communication Service resource, display the error message
    Write-Host "Error while creating Communication resource"

    # Exit the script with an error code (1) if the creation of the Communication Service resource fails
    exit 1
}

# Create Email Communication resource
# Output message to indicate the creation of the Email Communication Service resource is starting
Write-Host "Creating Email Communication resource - $emailServiceName"
try {
    # The az communication email create cmdlet is used to create a new Email Communication Service resource
    az communication email create --name $emailServiceName --resource-group $resourceGroup --location global --data-location $dataLocation
} catch {
    # If there is an error during the creation of the Email Communication Service resource, display the error message
    Write-Host "Error while creating Email Communication resource"

    # Exit the script with an error code (1) if the creation of the Email Communication Service resource fails
    exit 1
}

# Function to add DNS records
function Add-RecordSetToDNS {
    param (
        [string]$domainName,
        [string]$subDomainPrefix
    )

    # Output a message indicating that DNS record sets are being added for the specified domain
    Write-Host "Adding DNS record sets for domain: $domainName"
    try {
        # Run the Azure CLI command to fetch domain details for the specified domain name
        $domainDetailsJson = az communication email domain show --resource-group $resourceGroup --email-service-name $emailServiceName --name $domainName
    } catch {
        # If an error occurs while fetching domain details, output an error message and exit the script
        Write-Host "Error fetching domain details for $domainName"
        exit 1
    }

    # If no domain details are returned, output a message and exit the script
    if (-not $domainDetailsJson) {
        Write-Host "Failed to fetch domain details for $domainName"
        exit 1
    }

    # Parse the JSON response to extract the necessary domain details
    $domainDetails = $domainDetailsJson | ConvertFrom-Json

    # Extract verification record values Domain, SPF and DKIM from the parsed JSON response
    # These values are used to create DNS records
    $dkimName = $domainDetails.verificationRecords.DKIM.name
    $dkimValue = $domainDetails.verificationRecords.DKIM.value
    $dkim2Name = $domainDetails.verificationRecords.DKIM2.name
    $dkim2Value = $domainDetails.verificationRecords.DKIM2.value
    $spfValue = $domainDetails.verificationRecords.SPF.value
    $domainValue = $domainDetails.verificationRecords.Domain.value
    try {
        # Create the TXT DNS record for the domain's verification value
        az network dns record-set txt create --name $subDomainPrefix --zone-name $dnsZoneName --resource-group $resourceGroup
        
        # Add the domain verification record to the TXT DNS record
        az network dns record-set txt add-record --resource-group $resourceGroup --zone-name $dnsZoneName --record-set-name $subDomainPrefix --value $domainValue
        
        # Add the SPF record value to the TXT DNS record
        az network dns record-set txt add-record --resource-group $resourceGroup --zone-name $dnsZoneName --record-set-name $subDomainPrefix --value "`"$spfValue`""
        
        # Create CNAME DNS records for DKIM verification
        az network dns record-set cname create --resource-group $resourceGroup --zone-name $dnsZoneName --name "$dkimName.$subDomainPrefix"
        
        # Add the DKIM record value to the CNAME DNS record
        az network dns record-set cname set-record --resource-group $resourceGroup --zone-name $dnsZoneName --record-set-name "$dkimName.$subDomainPrefix" --cname $dkimValue
        
        # Create a CNAME record for the second DKIM2 verification
        az network dns record-set cname create --resource-group $resourceGroup --zone-name $dnsZoneName --name "$dkim2Name.$subDomainPrefix"
        
        # Add the DKIM2 record value to the CNAME DNS record
        az network dns record-set cname set-record --resource-group $resourceGroup --zone-name $dnsZoneName --record-set-name "$dkim2Name.$subDomainPrefix" --cname $dkim2Value                
    } catch {
        # If an error occurs while adding DNS records, output an error message and exit the script
        Write-Host "Error while adding DNS records for domain $domainName"
        exit 1
    }

    # Return the domain details as an object for further use if needed
    return $domainDetails
}

# Verify domain function
function Verify-Domain {
    param (
        [string]$domainName
    )

    Write-Host "Initiating domain verification for: $domainName"

    # Define the types of verification that need to be performed
    $verificationTypes = @("Domain", "SPF", "DKIM", "DKIM2")

    # Loop over each verification type and initiate the verification process via Azure CLI
    foreach ($verificationType in $verificationTypes) {
        try {
            # Run the Azure CLI command to initiate the verification process for each verification type
            az communication email domain initiate-verification --domain-name $domainName --email-service-name $emailServiceName --resource-group $resourceGroup --verification-type $verificationType
        } catch {
            Write-Host "Error initiating verification for $domainName"
            exit 1
        }
    }

    # Polling for domain verification
    $attempts = 0 # Track the number of verification attempts
    $maxAttempts = 10 # Set the maximum number of attempts to check domain verification status

    # Loop for polling and checking verification status up to maxAttempts times
    while ($attempts -lt $maxAttempts) {
        try {
            # Run the Azure CLI command to fetch the domain details
            $domainDetailsJson = az communication email domain show --resource-group $resourceGroup --email-service-name $emailServiceName --name $domainName
        } catch {
            # If an error occurs while fetching the domain verification status, output an error message and exit
            Write-Host "Error fetching domain verification status for $domainName"
            exit 1
        }

        # If no domain details are returned, output a message and exit the script
        if (-not $domainDetailsJson) {
            Write-Host "Failed to fetch domain verification details for $domainName"
            exit 1
        }

        # Parse the domain details JSON response
        $domainDetails = $domainDetailsJson | ConvertFrom-Json

        $dkimStatus = $domainDetails.verificationStates.DKIM.status
        $dkim2Status = $domainDetails.verificationStates.DKIM2.status
        $domainStatus = $domainDetails.verificationStates.Domain.status
        $spfStatus = $domainDetails.verificationStates.SPF.status

        # Check if all verification statuses are "Verified"
        if ($dkimStatus -eq 'Verified' -and $dkim2Status -eq 'Verified' -and $domainStatus -eq 'Verified' -and $spfStatus -eq 'Verified') {
            Write-Host "Domain verified successfully."
            return $true
        }

        # If verification is not yet complete, wait before checking again
        $attempts++
        Start-Sleep -Seconds 10
    }

    # If the maximum number of attempts is reached without successful verification, print failure message
    Write-Host "Domain $domainName verification failed or timed out."
    return $false
}

# Main loop to create and verify domains
# List to store the IDs of successfully verified domains
$linkedDomainIds = @()

# Loop through each domain in the domains list
foreach ($domainName in $domains) {
    # Extract the subdomain prefix from the fully qualified domain name (for example: "sales" from "sales.contoso.net")
    $subDomainPrefix = $domainName.Split('.')[0]
    try {
        # Output the domain name that is being created
        Write-Host "Creating domain: $domainName"
        # Create the email domain in Email Communication Service.
        # The command includes the domain name, resource group, email service name, location, and domain management type (CustomerManaged)
        az communication email domain create --name $domainName --resource-group $resourceGroup --email-service-name $emailServiceName --location global --domain-management CustomerManaged
    } catch {
        # If domain creation fails, display an error message and continue with the next domain
        Write-Host "Warning: Failed to create domain $domainName. Error"
        continue
    }

    # Add DNS records
    $domainDetails = Add-RecordSetToDNS $domainName $subDomainPrefix

    # Verify the domain
    if (Verify-Domain $domainName) {
        $linkedDomainIds += $domainDetails.id
    }
}

# Linking domains to the communication service
if ($linkedDomainIds.Count -gt 0) {
    Write-Host "Linking domains to communication service."
    try {
        # Run the Azure CLI command to link the verified domains to the Communication service
        az communication update --name $commServiceName --resource-group $resourceGroup --linked-domains $linkedDomainIds

        # Output a success message if the domains were successfully linked
        Write-Host "Domains linked successfully."
    } catch {
        # If an error occurs while linking the domains, output an error message and exit the script
        Write-Host "Error linking domains"
        exit 1 # Exit the script with error code 1
    }
} else {
    # If no domains were linked, output a message indicating no domains to link
    Write-Host "No domains were linked."
}
```
