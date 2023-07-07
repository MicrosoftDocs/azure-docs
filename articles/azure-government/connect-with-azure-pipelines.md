---
title: Deploy an app in Azure Government with Azure Pipelines
description: Configure continuous deployment to your applications hosted in Azure Government by connecting from Azure Pipelines.
ms.service: azure-government
ms.topic: article
ms.custom: devx-track-azurepowershell
recommendations: false
ms.date: 06/27/2022
---

# Deploy an app in Azure Government with Azure Pipelines

This how-to guide helps you use Azure Pipelines to set up continuous integration (CI) and continuous delivery (CD) of your web app running in Azure Government. CI/CD automates the build of your code from a repository along with the deployment (release) of the built code artifacts to a service or set of services in Azure Government. In this how-to guide, you'll build a web app and deploy it to an Azure Governments App Service. The build and release process is triggered by a change to a code file in the repository.

> [!NOTE]
> [Azure DevOps](/azure/devops/) isn't available on Azure Government. While this how-to guide shows how to configure the CI/CD capabilities of Azure Pipelines to deploy an app to a service inside Azure Government, be aware that Azure Pipelines runs its pipelines outside of Azure Government. Research your organization's security and service policies before using it as part of your deployment tools. For guidance on how to use Azure DevOps Server to create a DevOps experience inside a private network on Azure Government, see [Azure DevOps Server on Azure Government](https://devblogs.microsoft.com/azuregov/azure-devops-server-in-azure-government/).

[Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines) is used by development teams to configure continuous deployment for applications hosted in Azure subscriptions. We can use this service for applications running in Azure Government by defining [service connections](/azure/devops/pipelines/library/service-endpoints) for Azure Government.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

Before starting this how-to guide, you must complete the following prerequisites:

- [Create an organization in Azure DevOps](/azure/devops/organizations/accounts/create-organization)
- [Create and add a project to the Azure DevOps organization](/azure/devops/organizations/projects/create-project)
- Install and set up [Azure PowerShell](/powershell/azure/install-azure-powershell)

If you don't have an active Azure Government subscription, create a [free account](https://azure.microsoft.com/global-infrastructure/government/request/) before you begin.

## Create Azure Government App Service app

Follow [Tutorial: Deploy an Azure App Service app](./documentation-government-howto-deploy-webandmobile.md) to learn how to deploy an Azure App Service app to Azure Government. The following steps will set up a CD process to deploy to your web app.

## Set up build and source control integration

Review one of the following quickstarts to set up a build for your specific type of app:

- [ASP.NET 4](/azure/devops/pipelines/apps/aspnet/build-aspnet-4)
- [.NET Core](/azure/devops/pipelines/ecosystems/dotnet-core)
- [Node.js](/azure/devops/pipelines/ecosystems/javascript)

## Generate a service principal

1. Copy and paste the following service principal creation PowerShell script into an IDE or editor, and then save the script. This code is compatible only with Azure Az PowerShell v7.0.0 or higher.
    
    ```powershell
    param
    (
        [Parameter(Mandatory=$true, HelpMessage="Enter Azure subscription name - you need to be subscription admin to execute the script")]
        [string] $subscriptionName,

        [Parameter(Mandatory=$false, HelpMessage="Provide SPN role assignment")]
        [string] $spnRole = "owner",
    
        [Parameter(Mandatory=$false, HelpMessage="Provide Azure environment name for your subscription")]
        [string] $environmentName = "AzureUSGovernment"
    )

    # Initialize
    $ErrorActionPreference = "Stop"
    $VerbosePreference = "SilentlyContinue"
    $userName = ($env:USERNAME).Replace(' ', '')
    $newguid = [guid]::NewGuid()
    $displayName = [String]::Format("AzDevOps.{0}.{1}", $userName, $newguid)
    $homePage = "http://" + $displayName
    $identifierUri = $homePage

    # Check for Azure Az PowerShell module
    $isAzureModulePresent = Get-Module -Name Az -ListAvailable
    if ([String]::IsNullOrEmpty($isAzureModulePresent) -eq $true)
    {
        Write-Output "Script requires Azure PowerShell modules to be present. Obtain Azure PowerShell from https://learn.microsoft.com//powershell/azure/install-az-ps" -Verbose
        return
    }

    Import-Module -Name Az.Accounts
    Write-Output "Provide your credentials to access your Azure subscription $subscriptionName" -Verbose
    Connect-AzAccount -Subscription $subscriptionName -Environment $environmentName
    $azureSubscription = Get-AzSubscription -SubscriptionName $subscriptionName
    $connectionName = $azureSubscription.Name
    $tenantId = $azureSubscription.TenantId
    $id = $azureSubscription.SubscriptionId

    # Create new Azure AD application
    Write-Output "Creating new application in Azure AD (App URI - $identifierUri)" -Verbose
    $azureAdApplication = New-AzADApplication -DisplayName $displayName -HomePage $homePage -Verbose
    $appId = $azureAdApplication.AppId
    $objectId = $azureAdApplication.Id
    Write-Output "Azure AD application creation completed successfully (Application Id: $appId) and (Object Id: $objectId)" -Verbose

    # Add secret to Azure AD application
    Write-Output "Creating new secret for Azure AD application"
    $secret = New-AzADAppCredential -ObjectId $objectId -EndDate (Get-Date).AddYears(2)
    Write-Output "Secret created successfully" -Verbose

    # Create new SPN
    Write-Output "Creating new SPN" -Verbose
    $spn = New-AzADServicePrincipal -ApplicationId $appId
    $spnName = $spn.DisplayName
    Write-Output "SPN creation completed successfully (SPN Name: $spnName)" -Verbose

    # Assign role to SPN
    Write-Output "Waiting for SPN creation to reflect in directory before role assignment"
    Start-Sleep 20
    Write-Output "Assigning role ($spnRole) to SPN app ($appId)" -Verbose
    New-AzRoleAssignment -RoleDefinitionName $spnRole -ApplicationId $spn.AppId
    Write-Output "SPN role assignment completed successfully" -Verbose

    # Print values
    Write-Output "`nCopy and paste below values for service connection" -Verbose
    Write-Output "***************************************************************************"
    Write-Output "Connection Name: $connectionName(SPN)"
    Write-Output "Environment: $environmentName"
    Write-Output "Subscription Id: $id"
    Write-Output "Subscription Name: $connectionName"
    Write-Output "Service Principal Id: $appId"
    Write-Output "Tenant Id: $tenantId"
    Write-Output "***************************************************************************"
    ```

2. Open your PowerShell window and run the following command, which sets a policy that enables running local files:

   `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

   When asked whether you want to change the execution policy, enter "A" (for "Yes to All").

3. Navigate to the directory where you saved the service principal creation PowerShell script.

4. Edit the following command with the name of your script and run:

   `./<name of script file you saved>`

5. The "subscriptionName" parameter can be found by logging into your Azure Government subscription via `Connect-AzAccount -EnvironmentName AzureUSGovernment` and then running `Get-AzureSubscription`.

6. After providing your Azure Government subscription credentials, you should see the following message:

   `The Environment variable should be AzureUSGovernment`

7. After the script has run, you should see your service connection values. Copy these values as we'll need them when setting up our endpoint.

   :::image type="content" source="./media/documentation-government-vsts-img11.png" alt-text="Service connection values displayed after running the PowerShell script." border="false":::

## Configure the Azure Pipelines service connection

Follow [Manage service connections](/azure/devops/pipelines/library/service-endpoints) to set up the Azure Pipelines service connection.

Make one change specific to Azure Government:

- In step #3 of [Manage service connections: Create a service connection](/azure/devops/pipelines/library/service-endpoints#create-a-service-connection), click on *Use the full version of the service connection catalog* and set **Environment** to **AzureUSGovernment**.

## Define a release process

Follow [Deploy an Azure Web App](/azure/devops/pipelines/targets/webapp) instructions to set up your release pipeline and deploy to your application in Azure Government.

## Q&A

**Do I need a build agent?** <br/>
You need at least one [agent](/azure/devops/pipelines/agents/agents) to run your deployments. By default, the build and deployment processes are configured to use [hosted agents](/azure/devops/pipelines/agents/agents#microsoft-hosted-agents). Configuring a private agent would limit data sharing outside of Azure Government.

**Can I configure CD on Azure DevOps Server (formerly Team Foundation Server) to target Azure Government?** <br/>
You can set up Azure DevOps Server in Azure Government. For guidance on how to use Azure DevOps Server to create a DevOps experience inside a private network on Azure Government, see [Azure DevOps Server on Azure Government](https://devblogs.microsoft.com/azuregov/azure-devops-server-in-azure-government/).

## Next steps

For more information, see the following resources:

- [Sign up for Azure Government trial](https://azure.microsoft.com/global-infrastructure/government/request/?ReqType=Trial)
- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [Ask questions via the azure-gov tag on StackOverflow](https://stackoverflow.com/tags/azure-gov)
- [Azure Government blog](https://devblogs.microsoft.com/azuregov/)
- [What is Infrastructure as Code? – Azure DevOps](/devops/deliver/what-is-infrastructure-as-code)
- [DevSecOps for infrastructure as code (IaC) – Azure Architecture Center](/azure/architecture/solution-ideas/articles/devsecops-infrastructure-as-code)
- [Testing your application and Azure environment – Microsoft Azure Well-Architected Framework](/azure/architecture/framework/devops/release-engineering-testing)
- [Azure Government overview](./documentation-government-welcome.md)
- [Azure Government security](./documentation-government-plan-security.md)
- [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [Azure compliance](../compliance/index.yml)
