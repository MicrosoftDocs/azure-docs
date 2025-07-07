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

Get started with Azure CLI Python to automate the creation of Azure Communication Services, Email Communication Services, manage custom domains, configure DNS records, verify domains, and domain linking to communication resource.

In this sample, we describe what the sample does and the prerequisites you need before running it locally on your machine.

This article describes how to use Azure CLI Python to automate the creation of Azure Communication Services and Email Communication Services. It also describes the process of managing custom domains, configuring DNS records (such as Domain, SPF, DKIM, DKIM2), verifying domains and domain linking to communication resource.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A DNS zone in Azure to manage your domains.
- The latest [Python.org](https://www.python.org/downloads/).
- The latest [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli).

## Prerequisite check

- In a command prompt, run the `python --version` command to check whether Python is installed.

```console
python --version
```

- In a command prompt, run the `pip --version` command to check whether pip is installed.

```console
pip --version
```

- In a command prompt, run the `az --version` command to check whether the Azure CLI is installed.

```console
az --version
```

- Before you can use the Azure CLI Commands to manage your resources, [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials.

```console
az login
```

## Initialize all the Variables

Before proceeding, define the variables needed for setting up the ACS, ECS, and domains, along with DNS configuration for the domains. Modify these variables based on your environment:

```python
# Define the name of the Azure resource group where resources are created
resourceGroup = "ContosoResourceProvider1"

# Specify the region where the resources are created. In this case, Europe.
dataLocation = "europe"

# Define the name of the Azure Communication Service resource
commServiceName = "ContosoAcsResource1"

# Define the name of the Email Communication Service resource
emailServiceName = "ContosoEcsResource1"

# Define the DNS zone name where the domains are managed (replace with actual DNS zone)
dnsZoneName = "contoso.net"

# Define the list of domains to be created and managed (replace with your own list of domains)
domains = [
    "sales.contoso.net",
    "marketing.contoso.net",
    "support.contoso.net",
    "technical.contoso.net",
    "info.contoso.net"
]
```

## Sign in to Azure account

To sign in to your Azure account through python code, use the following code:

```python
def loginToAzure():
    try:
        # Print a message indicating that the Azure login process is starting
        print("Logging in to Azure...")

        # Call the runCommand function to execute the Azure CLI login command
        runCommand("az login")

    except Exception as e:
        # If any exception occurs during the Azure login process, handle it using the errorHandler
        errorHandler(f"Azure login failed: {e}")
```

## Create an Azure Communication Service (ACS) resource

This part of the script creates an Azure Communication Service resource:

```python
def createCommunicationResource():
    try:
        # Print a message indicating the creation of the Communication Service resource is starting
        print(f"Creating Communication resource - {commServiceName}")

        # Run the Azure CLI command to create the Communication resource.
        # The 'az communication create' command is used to create a Communication Service in Azure.
        # It requires the name of the service, the resource group, location, and data location.
        runCommand(f"az communication create --name {commServiceName} --resource-group {resourceGroup} --location global --data-location {dataLocation}")
    except Exception as e:
        # If an error occurs during the creation process, the errorHandler function is called
        # The error message is formatted and passed to the errorHandler for proper handling
        errorHandler(f"Failed to create Communication resource: {e}")
```

## Create an Email Communication Service (ECS) resource

This part of the script creates an Email Communication Service resource:

```python
def createEmailCommunicationResource():
    try:
        # Print a message indicating the creation of the Email Communication Service resource is starting
        print(f"Creating Email Communication resource - {emailServiceName}")

        # Run the Azure CLI command to create the Email Communication resource.
        # The 'az communication email create' command is used to create an Email Communication Service.
        # It requires the service name, the resource group, location, and data location.
        runCommand(f"az communication email create --name {emailServiceName} --resource-group {resourceGroup} --location global --data-location {dataLocation}")
    except Exception as e:
        # If an error occurs during the creation process, the errorHandler function is called
        # The error message is formatted and passed to the errorHandler for proper handling
        errorHandler(f"Failed to create Email Communication resource: {e}")
```

## Create domains

Automate the creation of email domains, by following command:

> [!NOTE]
> The maximum limit for domain creation is 800 per Email Communication Service.

> [!NOTE]
> In our code, we work with five predefined domains, for which DNS records are added and configured.

```python
# Create the email domain in Email Communication Service.
# The command includes the domain name, resource group, email service name, location, and domain management type (CustomerManaged)
runCommand(f"az communication email domain create --name {domainName} --resource-group {resourceGroup} --email-service-name {emailServiceName} --location global --domain-management CustomerManaged")
```

## Add records set to DNS

Add records to DNS record setup (including Domain, SPF, DKIM, DKIM2) for each domain.

```python
# Function to add DNS records
# Add records set to DNS
def addRecordSetToDns(domainName, subDomainPrefix):
    try:
        print(f"Adding DNS record sets for domain: {domainName}")

        # Run the Azure CLI command to fetch domain details for the specified domain name
        domainDetailsJson = runCommand(f"az communication email domain show --resource-group {resourceGroup} --email-service-name {emailServiceName} --name {domainName}")

        # If no details are returned, handle the error by exiting the process
        if not domainDetailsJson:
            errorHandler(f"Failed to fetch domain details for {domainName}")

        # Parse the JSON response to extract the necessary domain details
        domainDetails = json.loads(domainDetailsJson)
        print(f"Domain details are: {domainDetails}")

        # Extract verification record values Domain, SPF and DKIM from the parsed JSON response
        # These values are used to create DNS records
        domainValue = domainDetails['verificationRecords']['Domain']['value']
        spfValue = domainDetails['verificationRecords']['SPF']['value']
        dkimName = domainDetails['verificationRecords']['DKIM']['name']
        dkimValue = domainDetails['verificationRecords']['DKIM']['value']
        dkim2Name = domainDetails['verificationRecords']['DKIM2']['name']
        dkim2Value = domainDetails['verificationRecords']['DKIM2']['value']
        
        # Create the TXT DNS record for the domain's verification value
        runCommand(f"az network dns record-set txt create --name {subDomainPrefix} --zone-name {dnsZoneName} --resource-group {resourceGroup}")
        
        # Add the domain verification record to the TXT DNS record
        runCommand(f"az network dns record-set txt add-record --resource-group {resourceGroup} --zone-name {dnsZoneName} --record-set-name {subDomainPrefix} --value {domainValue}")
        
        # Add the SPF record value to the TXT DNS record
        runCommand(f"az network dns record-set txt add-record --resource-group {resourceGroup} --zone-name {dnsZoneName} --record-set-name {subDomainPrefix} --value \"{spfValue}\"")
        
        # Create CNAME DNS records for DKIM verification
        runCommand(f"az network dns record-set cname create --resource-group {resourceGroup} --zone-name {dnsZoneName} --name {dkimName}.{subDomainPrefix}")
        
        # Add the DKIM record value to the CNAME DNS record
        runCommand(f"az network dns record-set cname set-record --resource-group {resourceGroup} --zone-name {dnsZoneName} --record-set-name {dkimName}.{subDomainPrefix} --cname {dkimValue}")
        
        # Create a CNAME record for the second DKIM2 verification
        runCommand(f"az network dns record-set cname create --resource-group {resourceGroup} --zone-name {dnsZoneName} --name {dkim2Name}.{subDomainPrefix}")
        
        # Add the DKIM2 record value to the CNAME DNS record
        runCommand(f"az network dns record-set cname set-record --resource-group {resourceGroup} --zone-name {dnsZoneName} --record-set-name {dkim2Name}.{subDomainPrefix} --cname {dkim2Value}")

        # Return the domain details
        return domainDetails

    # Handle JSON decoding errors (in case the response is not valid JSON)
    except json.JSONDecodeError as e:
        errorHandler(f"Failed to parse domain details JSON: {e}")

    # Catch any other exceptions that might occur during the DNS record creation process
    except Exception as e:
        errorHandler(f"Error while adding DNS records for domain {domainName}: {e}")
```

## Verification of domains

Initiates the domain verification process for the domains, including Domain, SPF, DKIM, and DKIM2 verifications.

```python
# Verify domain function
def verifyDomain(domainName):
    try:
        print(f"Initiating domain verification for: {domainName}")

        # Define the types of verification that need to be performed
        verificationTypes = ["Domain", "SPF", "DKIM", "DKIM2"]

        # Loop over each verification type and initiate the verification process via Azure CLI
        for verificationType in verificationTypes:
            # Run the Azure CLI command to initiate the verification process for each verification type
            runCommand(f"az communication email domain initiate-verification --domain-name {domainName} --email-service-name {emailServiceName} --resource-group {resourceGroup} --verification-type {verificationType}")

        # Polling for domain verification
        attempts = 0 # Track the number of verification attempts
        maxAttempts = 10 # Set the maximum number of attempts to check domain verification status

        # Loop for polling and checking verification status up to maxAttempts times
        while attempts < maxAttempts:
            # Run the Azure CLI command to fetch the domain details
            domainDetailsJson = runCommand(f"az communication email domain show --resource-group {resourceGroup} --email-service-name {emailServiceName} --name {domainName}")
            
            # If no details are returned, call the errorHandler to stop the process
            if not domainDetailsJson:
                errorHandler(f"Failed to get domain verification details for {domainName}")

            # Parse the domain details JSON response
            domainDetails = json.loads(domainDetailsJson)

            dkimStatus = domainDetails['verificationStates']['DKIM']['status']
            dkim2Status = domainDetails['verificationStates']['DKIM2']['status']
            domainStatus = domainDetails['verificationStates']['Domain']['status']
            spfStatus = domainDetails['verificationStates']['SPF']['status']
            
            # Check if all verification statuses are "Verified"
            if dkimStatus == 'Verified' and dkim2Status == 'Verified' and domainStatus == 'Verified' and spfStatus == 'Verified':
                print(f"Domain verified successfully.")
                return True

            # If verification is not yet complete, wait before checking again
            attempts += 1
            time.sleep(10)

        # If the maximum number of attempts is reached without successful verification, print failure message
        print(f"Domain {domainName} verification failed or timed out.")
        return False

    # Handle JSON decoding errors that might occur when trying to parse the domain verification response
    except json.JSONDecodeError as e:
        errorHandler(f"Failed to parse domain verification JSON: {e}")

    # Catch any other general exceptions that might occur during the domain verification process
    except Exception as e:
        errorHandler(f"Error while verifying domain {domainName}: {e}")
```

## Link domains to the communication service

Once the domains are verified and DNS records are configured, you can link the domains to the Azure Communication Service:

> [!NOTE]
> The maximum limit for domain linking is 1000 per Azure Communication Service.

```python
# Link the verified domains to the Communication service
# The command includes the communication service name, resource group, and the list of linked domain IDs
runCommand(f"az communication update --name {commServiceName} --resource-group {resourceGroup} --linked-domains {' '.join(linkedDomainIds)}")
```

## Complete Python Script with Azure CLI Commands for Automating End-to-End Resource Creation

```python
import subprocess
import json
import time

# Variables
# Define the name of the Azure resource group where resources are created
resourceGroup = "ContosoResourceProvider1"

# Specify the region where the resources are created. In this case, Europe.
dataLocation = "europe"

# Define the name of the Azure Communication Service resource
commServiceName = "ContosoAcsResource1"

# Define the name of the Email Communication Service resource
emailServiceName = "ContosoEcsResource1"

# Define the DNS zone name where the domains are managed (replace with actual DNS zone)
dnsZoneName = "contoso.net"

# Define the list of domains to be created and managed (replace with your own list of domains)
domains = [
    "sales.contoso.net",
    "marketing.contoso.net",
    "support.contoso.net",
    "technical.contoso.net",
    "info.contoso.net"
]

# Function to run shell commands and get output
def runCommand(command):
    try:
        # Execute the shell command using subprocess.run
        # 'check=True' raises an exception if the command exits with a non-zero status
        # 'capture_output=True' captures the command's output and stores it in 'result.stdout'
        # 'text=True' ensures the output is returned as a string (rather than bytes)
        # 'shell=True' us execute the command as if it were in the shell (for example: using shell features like pipes)
        result = subprocess.run(command, check=True, capture_output=True, text=True, shell=True)

        # Return the standard output (stdout) of the command if successful
        return result.stdout

    except subprocess.CalledProcessError as e:
        # This exception is raised if the command exits with a non-zero status (i.e., an error occurs)
        print(f"Error running command '{command}': {e}") # Print the error message
        print(f"Error details: {e.stderr}") # Print the standard error (stderr) details for more information
        return None # Return None to indicate that the command failed

    except Exception as e:
        # This catches any other exceptions that may occur (such as issues unrelated to the subprocess itself)
        print(f"Unexpected error while executing command '{command}': {e}") # Print any unexpected error messages
        return None # Return None to indicate that an error occurred

# Function to handle errors (catch functionality)
def errorHandler(errorMessage="Error occurred. Exiting."):
    print(errorMessage)
    exit(1)

# Sign in to Azure

def loginToAzure():
    try:
        # Print a message indicating that the Azure login process is starting
        print("Logging in to Azure...")

        # Call the runCommand function to execute the Azure CLI login command
        runCommand("az login")

    except Exception as e:
        # If any exception occurs during the Azure login process, handle it using the errorHandler
        errorHandler(f"Azure login failed: {e}")

# Create Communication resource
def createCommunicationResource():
    try:
        # Print a message indicating the creation of the Communication Service resource is starting
        print(f"Creating Communication resource - {commServiceName}")

        # Run the Azure CLI command to create the Communication resource.
        # The 'az communication create' command is used to create a Communication Service in Azure.
        # It requires the name of the service, the resource group, location, and data location.
        runCommand(f"az communication create --name {commServiceName} --resource-group {resourceGroup} --location global --data-location {dataLocation}")
    except Exception as e:
        # If an error occurs during the creation process, the errorHandler function is called
        # The error message is formatted and passed to the errorHandler for proper handling
        errorHandler(f"Failed to create Communication resource: {e}")

# Create Email Communication resource
def createEmailCommunicationResource():
    try:
        # Print a message indicating the creation of the Email Communication Service resource is starting
        print(f"Creating Email Communication resource - {emailServiceName}")

        # Run the Azure CLI command to create the Email Communication resource.
        # The 'az communication email create' command is used to create an Email Communication Service.
        # It requires the service name, the resource group, location, and data location.
        runCommand(f"az communication email create --name {emailServiceName} --resource-group {resourceGroup} --location global --data-location {dataLocation}")
    except Exception as e:
        # If an error occurs during the creation process, the errorHandler function is called
        # The error message is formatted and passed to the errorHandler for proper handling
        errorHandler(f"Failed to create Email Communication resource: {e}")

# Function to add DNS records
# Add records set to DNS
def addRecordSetToDns(domainName, subDomainPrefix):
    try:
        print(f"Adding DNS record sets for domain: {domainName}")

        # Run the Azure CLI command to fetch domain details for the specified domain name
        domainDetailsJson = runCommand(f"az communication email domain show --resource-group {resourceGroup} --email-service-name {emailServiceName} --name {domainName}")

        # If no details are returned, handle the error by exiting the process
        if not domainDetailsJson:
            errorHandler(f"Failed to fetch domain details for {domainName}")

        # Parse the JSON response to extract the necessary domain details
        domainDetails = json.loads(domainDetailsJson)
        print(f"Domain details are: {domainDetails}")

        # Extract verification record values Domain, SPF and DKIM from the parsed JSON response
        # These values are used to create DNS records
        domainValue = domainDetails['verificationRecords']['Domain']['value']
        spfValue = domainDetails['verificationRecords']['SPF']['value']
        dkimName = domainDetails['verificationRecords']['DKIM']['name']
        dkimValue = domainDetails['verificationRecords']['DKIM']['value']
        dkim2Name = domainDetails['verificationRecords']['DKIM2']['name']
        dkim2Value = domainDetails['verificationRecords']['DKIM2']['value']
        
        # Create the TXT DNS record for the domain's verification value
        runCommand(f"az network dns record-set txt create --name {subDomainPrefix} --zone-name {dnsZoneName} --resource-group {resourceGroup}")
        
        # Add the domain verification record to the TXT DNS record
        runCommand(f"az network dns record-set txt add-record --resource-group {resourceGroup} --zone-name {dnsZoneName} --record-set-name {subDomainPrefix} --value {domainValue}")
        
        # Add the SPF record value to the TXT DNS record
        runCommand(f"az network dns record-set txt add-record --resource-group {resourceGroup} --zone-name {dnsZoneName} --record-set-name {subDomainPrefix} --value \"{spfValue}\"")
        
        # Create CNAME DNS records for DKIM verification
        runCommand(f"az network dns record-set cname create --resource-group {resourceGroup} --zone-name {dnsZoneName} --name {dkimName}.{subDomainPrefix}")
        
        # Add the DKIM record value to the CNAME DNS record
        runCommand(f"az network dns record-set cname set-record --resource-group {resourceGroup} --zone-name {dnsZoneName} --record-set-name {dkimName}.{subDomainPrefix} --cname {dkimValue}")
        
        # Create a CNAME record for the second DKIM2 verification
        runCommand(f"az network dns record-set cname create --resource-group {resourceGroup} --zone-name {dnsZoneName} --name {dkim2Name}.{subDomainPrefix}")
        
        # Add the DKIM2 record value to the CNAME DNS record
        runCommand(f"az network dns record-set cname set-record --resource-group {resourceGroup} --zone-name {dnsZoneName} --record-set-name {dkim2Name}.{subDomainPrefix} --cname {dkim2Value}")

        # Return the domain details
        return domainDetails

    # Handle JSON decoding errors (in case the response is not valid JSON)
    except json.JSONDecodeError as e:
        errorHandler(f"Failed to parse domain details JSON: {e}")

    # Catch any other exceptions that might occur during the DNS record creation process
    except Exception as e:
        errorHandler(f"Error while adding DNS records for domain {domainName}: {e}")

# Verify domain function
def verifyDomain(domainName):
    try:
        print(f"Initiating domain verification for: {domainName}")

        # Define the types of verification that need to be performed
        verificationTypes = ["Domain", "SPF", "DKIM", "DKIM2"]

        # Loop over each verification type and initiate the verification process via Azure CLI
        for verificationType in verificationTypes:
            # Run the Azure CLI command to initiate the verification process for each verification type
            runCommand(f"az communication email domain initiate-verification --domain-name {domainName} --email-service-name {emailServiceName} --resource-group {resourceGroup} --verification-type {verificationType}")

        # Polling for domain verification
        attempts = 0 # Track the number of verification attempts
        maxAttempts = 10 # Set the maximum number of attempts to check domain verification status

        # Loop for polling and checking verification status up to maxAttempts times
        while attempts < maxAttempts:
            # Run the Azure CLI command to fetch the domain details
            domainDetailsJson = runCommand(f"az communication email domain show --resource-group {resourceGroup} --email-service-name {emailServiceName} --name {domainName}")
            
            # If no details are returned, call the errorHandler to stop the process
            if not domainDetailsJson:
                errorHandler(f"Failed to get domain verification details for {domainName}")

            # Parse the domain details JSON response
            domainDetails = json.loads(domainDetailsJson)

            dkimStatus = domainDetails['verificationStates']['DKIM']['status']
            dkim2Status = domainDetails['verificationStates']['DKIM2']['status']
            domainStatus = domainDetails['verificationStates']['Domain']['status']
            spfStatus = domainDetails['verificationStates']['SPF']['status']
            
            # Check if all verification statuses are "Verified"
            if dkimStatus == 'Verified' and dkim2Status == 'Verified' and domainStatus == 'Verified' and spfStatus == 'Verified':
                print(f"Domain verified successfully.")
                return True

            # If verification is not yet complete, wait before checking again
            attempts += 1
            time.sleep(10)

        # If the maximum number of attempts is reached without successful verification, print failure message
        print(f"Domain {domainName} verification failed or timed out.")
        return False

    # Handle JSON decoding errors that might occur when trying to parse the domain verification response
    except json.JSONDecodeError as e:
        errorHandler(f"Failed to parse domain verification JSON: {e}")

    # Catch any other general exceptions that might occur during the domain verification process
    except Exception as e:
        errorHandler(f"Error while verifying domain {domainName}: {e}")

# Main - to create and verify domains
# List to store the IDs of successfully verified domains
linkedDomainIds = []

def main():
    try:
        # Step 1: Call the loginToAzure() function to log in to Azure using the Azure CLI
        loginToAzure()

        # Step 2: Call the createCommunicationResource() function to create Azure Communication Service resource
        createCommunicationResource()

        # Step 3: Call the createEmailCommunicationResource() function to create Azure Communication Service resource.
        createEmailCommunicationResource()

        # Step 4: Loop through each domain in the 'domains' list
        for domainName in domains:

            # Extract the subdomain prefix from the fully qualified domain name (for example: "sales" from "sales.contoso.net")
            subDomainPrefix = domainName.split('.')[0]
            try:
                print(f"Creating domain: {domainName}")
                # Step 5: Create the email domain in Email Communication Service.
                # The command includes the domain name, resource group, email service name, location, and domain management type (CustomerManaged)
                runCommand(f"az communication email domain create --name {domainName} --resource-group {resourceGroup} --email-service-name {emailServiceName} --location global --domain-management CustomerManaged")
            except Exception as e:
                # If domain creation fails, print a warning and continue with the next domain
                print(f"Warning: Failed to create domain {domainName}. Error: {e}")
                continue

            # Step 6: Add DNS records
            domainDetails = addRecordSetToDns(domainName, subDomainPrefix)

            # Step 7: Verify the domain
            if verifyDomain(domainName):
                # If domain verification is successful, add the domain's ID to the linked domains list
                linkedDomainIds.append(domainDetails['id'])

        # Linking domains to the communication service
        if linkedDomainIds:
            print("Linking domains to communication service.")

            # Run the Azure CLI command to link the verified domains to the Communication service
            runCommand(f"az communication update --name {commServiceName} --resource-group {resourceGroup} --linked-domains {' '.join(linkedDomainIds)}")
            print("Domains linked successfully.")
        else:
            print("No domains were linked.")

    except Exception as e:
        errorHandler(f"An error occurred in the main process: {e}")

# Ensure the main function is called when the script is run directly
if __name__ == "__main__":
    main()
```
