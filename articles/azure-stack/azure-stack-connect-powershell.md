<properties
	pageTitle="Install PowerShell and connect | Microsoft Azure"
	description="Learn how to manage Azure Stack with PowerShell"
	services="azure-stack"
	documentationCenter=""
	authors="HeathL17"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/26/2016"
	ms.author="helaw"/>

# Install PowerShell and connect
In this guide, we'll walk through teh steps required to connect to Azure Stack with PowerShell.  Once complete, you can use these steps to manage and deploy resources.

## Install Azure Stack PowerShell commandlets

1.	Open a PowerShell Console on MAS-CON01.  
2.	You will be installing the AzureRM modules from the PSGallery. To see more details on this, run Get-PSRepository:
<Insert screentshot>

3.	Execute the following command:
    Install-Module -Name AzureRM -RequiredVersion 1.2.6 -Scope CurrentUser

> [AZURE.NOTE] *-Scope CurrentUser* is optional.  If you want more than the current user to have access to the modules, use an elevated command prompt and leave off the Scope parameter

4.	This command will execute, run for a bit, and install the AzureRM modules from the PSGallery
5.	To confirm the install of the AzureRM modules, execute the following command(s):
    Get-Module -ListAvailable | where {$_.Name -match "AzureRM"}
    Get-Command -Module AzureRM.AzureStackAdmin

> [AZURE.NOTE] If you do not see them listed, Restart the MAS-CON01 VM.  Once the machine has restarted, check for the modules again

The AzureRM modules have now been Installed and can now be used by the CurrentUser

## Connect to Azure Stack
In the following steps, we'll add an Azure Environment.  This step configures PowerShell to work with Azure Stack.  

Before running the PowerShell below, updated the password and username strings (*MySecret* and *MYACCOUNT@MYDIR.onmicrosoft.com*) with values for your environment.
        
    #Establish credentials for connection to Azure Stack
	$password = ConvertTo-SecureString "MySecret" -AsPlainText -Force
	$Credential = New-Object System.Management.Automation.PSCredential "MYACCOUNT@MYDIR.onmicrosoft.com", $password
	
	#Optional for interactive credential request	
	#$Credential = Get-Credential
	
	#Configure Azure Stack environment information
	$Name = "AzureStack"
	$ResourceManagerEndpoint = "https://api." + $env:USERDNSDOMAIN
	$DirectoryTenantId = ([xml](Get-Content -Path "C:\CloudDeployment\Config.xml")).SelectSingleNode("//Role[@Id='AAD']").PublicInfo.AADTenant.Id
	$endpoints = Invoke-RestMethod -Method Get -Uri "$($ResourceManagerEndpoint.ToString().TrimEnd('/'))/metadata/endpoints?api-version=2015-01-01" -Verbose
	Write-Verbose -Message "Endpoints: $(ConvertTo-Json $endpoints)" -Verbose
	
	$AzureKeyVaultDnsSuffix="vault.$($env:USERDNSDOMAIN)".ToLowerInvariant()
	$AzureKeyVaultServiceEndpointResourceId= $("https://vault.$env:USERDNSDOMAIN".ToLowerInvariant())
	$StorageEndpointSuffix = ($env:USERDNSDOMAIN).ToLowerInvariant()
	
	$azureEnvironmentParams = @{
        Name                                     = $Name
        ActiveDirectoryEndpoint                  = $endpoints.authentication.loginEndpoint.TrimEnd('/') + "/"
        ActiveDirectoryServiceEndpointResourceId = $endpoints.authentication.audiences[0]
        AdTenant                                 = $DirectoryTenantId
        ResourceManagerEndpoint                  = $ResourceManagerEndpoint
        GalleryEndpoint                          = $endpoints.galleryEndpoint
        GraphEndpoint                            = $endpoints.graphEndpoint
        GraphAudience                            = $endpoints.graphEndpoint
        StorageEndpointSuffix                    = $StorageEndpointSuffix
        AzureKeyVaultDnsSuffix                   = $AzureKeyVaultDnsSuffix
        AzureKeyVaultServiceEndpointResourceId   = $AzureKeyVaultServiceEndpointResourceId
    }

    $azureEnvironment = Add-AzureRmEnvironment @azureEnvironmentParams
    $azureEnvironment = Get-AzureRmEnvironment $azureEnvironmentParams.Name

    #Connect to Azure Stack using the environment and credential information from above
    $azureAccount = Add-AzureRmAccount -Environment $azureEnvironment -Credential $Credential -TenantId $DirectoryTenantId -Verbose
    Write-Verbose "Using account: $(ConvertTo-Json $azureAccount.Context)" -Verbose

## Retrieve a list of subscriptions
In this section, we'll verify PowerShell cmdlets are running against Azure Stack by retrieving and selecting a subscription for use.  

        

## Next steps

[Deploy templates with Visual Studio](azure-stack-deploy-template-visual-studio.md)
