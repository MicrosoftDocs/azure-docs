---
title: Set up resources required to send data to Azure Monitor Logs using the Logs Ingestion API
description: Run a PowerShell script to set up all resources required to send data to Azure Monitor using the Logs Ingestion API.
author: guywi-ms
ms.author: guywild
ms.reviewer: ivankh
ms.topic: tutorial
ms.custom: devx-track-azurepowershell
ms.date: 06/12/2023
---

# Set up resources required to send data to Azure Monitor Logs using the Logs Ingestion API

This article provides a PowerShell script that sets up all of the resources you need before you can send data to Azure Monitor Logs using the [Logs ingestion API](logs-ingestion-api-overview.md). 

> [!NOTE]
> As a Microsoft MVP, [Morten Waltorp Knudsen](https://mortenknudsen.net/) contributed to and provided material feedback for this article. For an example of how you can automate the setup and ongoing use of the Log Ingestion API, see Morten's [AzLogDcrIngestPS PowerShell module](https://github.com/KnudsenMorten/AzLogDcrIngestPS).

## Create resources and permissions 
The script creates these resources, if they don't already exist:

- A Log Analytics workspace and a resource group for the Log Analytics workspace. 
    
    You probably already have a Log Analytics workspace, in which case, provide the workspace details so the script sets up the other resources in the same region as the workspace. 

- A Microsoft Entra application to authenticate against the API and:
    - A service principal on the Microsoft Entra application
    - A secret for the Microsoft Entra application
- A data collection endpoint (DCE) and a resource group for the data collection endpoint, in same region as Log Analytics workspace, to receive data. 
- A resource group for data collection rules (DCR) in the same region as the Log Analytics workspace.

The script also grants the app `Contributor` permissions to:

- The Log Analytics workspace  
- The resource group for data collection rules 
- The resource group for data collection endpoints

## PowerShell script



```powershell
#------------------------------------------------------------------------------------------------------------
# Prerequisite functions
#------------------------------------------------------------------------------------------------------------

Write-Output "Checking needed functions ... Please Wait !"
$ModuleCheck = Get-Module -Name Az.Resources -ListAvailable -ErrorAction SilentlyContinue
If (!($ModuleCheck))
    {
        Write-Output "Installing Az-module in CurrentUser scope ... Please Wait !"
        Install-module -Name Az -Force -Scope CurrentUser
    }

$ModuleCheck = Get-Module -Name Microsoft.Graph -ListAvailable -ErrorAction SilentlyContinue
If (!($ModuleCheck))
    {
        Write-Output "Installing Microsoft.Graph in CurrentUser scope ... Please Wait !"
        Install-module -Name Microsoft.Graph -Force -Scope CurrentUser
    }

<#
    Install-module Az -Scope CurrentUser
    Install-module Microsoft.Graph -Scope CurrentUser
    install-module Az.portal -Scope CurrentUser

    Import-module Az -Scope CurrentUser
    Import-module Az.Accounts -Scope CurrentUser
    Import-module Az.Resources -Scope CurrentUser
    Import-module Microsoft.Graph.Applications -Scope CurrentUser
    Import-Module Microsoft.Graph.DeviceManagement.Enrolment -Scope CurrentUser
#>


#----------------------------------------------------------------------------
# (1) Variables (Prerequisites, environment setup)
#----------------------------------------------------------------------------
$TenantId                              = "<your tenant ID>"

# Azure app registration
$AzureAppName                          = "Log-Ingestion-App"
$AzAppSecretName                       = "Log-Ingestion-App secret"

# Log Analytics workspace
$LogAnalyticsSubscription              = "<Log Analytics workspace ID>"
$LogAnalyticsResourceGroup             = "<Log Analytics workspace resource group>"
$LoganalyticsWorkspaceName             = "<Log Analytics workspace name>"
$LoganalyticsLocation                  = "<Log Analytics workspace location>"

# Data collection endpoint
$AzDceName                             = "dce-log-ingestion-demo"
$AzDceResourceGroup                    = "rg-dce-log-ingestion-demo"

# Data collection rule
$AzDcrResourceGroup                    = "rg-dcr-log-ingestion-demo"
$AzDcrPrefix                           = "demo"

$VerbosePreference                     = "SilentlyContinue"  # "Continue"

#----------------------------------------------------------------------------
# (2) Connectivity
#----------------------------------------------------------------------------
    # Connect to Azure
    Connect-AzAccount -Tenant $TenantId -WarningAction SilentlyContinue

    # Get access token
    $AccessToken = Get-AzAccessToken -ResourceUrl https://management.azure.com/
    $AccessToken = $AccessToken.Token

    # Build headers for Azure REST API with access token
    $Headers = @{
                    "Authorization"="Bearer $($AccessToken)"
                    "Content-Type"="application/json"
                }


    # Connect to Microsoft Graph
    $MgScope = @(
                    "Application.ReadWrite.All",`
                    "Directory.Read.All",`
                    "Directory.AccessAsUser.All",
                    "RoleManagement.ReadWrite.Directory"
                )
    Connect-MgGraph -TenantId $TenantId -Scopes $MgScope

#-------------------------------------------------------------------------------------------
# (3) Prerequisites - deployment of environment (if missing)
#-------------------------------------------------------------------------------------------

    <#
    This section deploys all resources needed for ingesting logs using the Log Ingestion API.

    The deployment includes the following steps:

    (1)  Create a resource group for the Log Analytics workspace
    (2)  Create the Log Analytics workspace
    (3)  Create an Azure App registration to send data to Azure Monitor Logs
    (4)  Create a service principal on the app
    (5)  Create a secret for the app
    (6)  Create a resource group for the data collection endpoint (DCE) in the same region as the Log Analytics workspace
    (7)  Create a resource group for data collection rules (DCR) in the same region as the Log Analytics workspace
    (8)  Create data collection endpoint (DCE) in same region as Log Analytics workspace
    (9)  Grant the Azure app permissions to the Log Analytics workspace  
    (10) Grant the Azure app permissions to the resource group for data collection rules (DCR) 
    (11) Grant the Azure app permissions to the resource group for data collection endpoints (DCE)
    #>

    #-------------------------------------------------------------------------------------
    # Azure context
    #-------------------------------------------------------------------------------------

        Write-Output ""
        Write-Output "Validating Azure context is subscription [ $($LogAnalyticsSubscription) ]"
        $AzContext = Get-AzContext
            If ($AzContext.Subscription -ne $LogAnalyticsSubscription )
                {
                    Write-Output ""
                    Write-Output "Switching Azure context to subscription [ $($LogAnalyticsSubscription) ]"
                    $AzContext = Set-AzContext -Subscription $LogAnalyticsSubscription -Tenant $TenantId
                }

    #-------------------------------------------------------------------------------------
    # Create the resource group for Log Analytics workspace
    #-------------------------------------------------------------------------------------

        Write-Output ""
        Write-Output "Validating Azure resource group exist [ $($LogAnalyticsResourceGroup) ]"
        try {
            Get-AzResourceGroup -Name $LogAnalyticsResourceGroup -ErrorAction Stop
        } catch {
            Write-Output ""
            Write-Output "Creating Azure resource group [ $($LogAnalyticsResourceGroup) ]"
            New-AzResourceGroup -Name $LogAnalyticsResourceGroup -Location $LoganalyticsLocation
        }

    #-------------------------------------------------------------------------------------
    # Create the workspace
    #-------------------------------------------------------------------------------------

        Write-Output ""
        Write-Output "Validating Log Analytics workspace exist [ $($LoganalyticsWorkspaceName) ]"
        try {
            $LogWorkspaceInfo = Get-AzOperationalInsightsWorkspace -Name $LoganalyticsWorkspaceName -ResourceGroupName $LogAnalyticsResourceGroup -ErrorAction Stop
        } catch {
            Write-Output ""
            Write-Output "Creating Log Analytics workspace [ $($LoganalyticsWorkspaceName) ] in $LogAnalyticsResourceGroup"
            New-AzOperationalInsightsWorkspace -Location $LoganalyticsLocation -Name $LoganalyticsWorkspaceName -Sku PerGB2018 -ResourceGroupName $LogAnalyticsResourceGroup
        }

    #-------------------------------------------------------------------------------------
    # Get workspace details
    #-------------------------------------------------------------------------------------

        $LogWorkspaceInfo = Get-AzOperationalInsightsWorkspace -Name $LoganalyticsWorkspaceName -ResourceGroupName $LogAnalyticsResourceGroup

        $LogAnalyticsWorkspaceResourceId = $LogWorkspaceInfo.ResourceId

    #-------------------------------------------------------------------------------------
    # Create Azure app registration
    #-------------------------------------------------------------------------------------

        Write-Output ""
        Write-Output "Validating Azure App [ $($AzureAppName) ]"
        $AppCheck = Get-MgApplication -Filter "DisplayName eq '$AzureAppName'" -ErrorAction Stop
            If ($AppCheck -eq $null)
                {
                    Write-Output ""
                    Write-host "Creating Azure App [ $($AzureAppName) ]"
                    $AzureApp = New-MgApplication -DisplayName $AzureAppName
                }

    #-------------------------------------------------------------------------------------
    # Create service principal on Azure app
    #-------------------------------------------------------------------------------------

        Write-Output ""
        Write-Output "Validating Azure Service Principal on App [ $($AzureAppName) ]"
        $AppInfo  = Get-MgApplication -Filter "DisplayName eq '$AzureAppName'"

        $AppId    = $AppInfo.AppId
        $ObjectId = $AppInfo.Id

        $ServicePrincipalCheck = Get-MgServicePrincipal -Filter "AppId eq '$AppId'"
            If ($ServicePrincipalCheck -eq $null)
                {
                    Write-Output ""
                    Write-host "Creating Azure Service Principal on App [ $($AzureAppName) ]"
                    $ServicePrincipal = New-MgServicePrincipal -AppId $AppId
                }

    #-------------------------------------------------------------------------------------
    # Create secret on Azure app
    #-------------------------------------------------------------------------------------

        Write-Output ""
        Write-Output "Validating Azure Secret on App [ $($AzureAppName) ]"
        $AppInfo  = Get-MgApplication -Filter "AppId eq '$AppId'"

        $AppId    = $AppInfo.AppId
        $ObjectId = $AppInfo.Id

            If ($AzAppSecretName -notin $AppInfo.PasswordCredentials.DisplayName)
                {
                    Write-Output ""
                    Write-host "Creating Azure Secret on App [ $($AzureAppName) ]"

                    $passwordCred = @{
                        displayName = $AzAppSecretName
                        endDateTime = (Get-Date).AddYears(1)
                    }

                    $AzAppSecret = (Add-MgApplicationPassword -applicationId $ObjectId -PasswordCredential $passwordCred).SecretText
                    Write-Output ""
                    Write-Output "Secret with name [ $($AzAppSecretName) ] created on app [ $($AzureAppName) ]"
                    Write-Output $AzAppSecret
                    Write-Output ""
                    Write-Output "AppId for app [ $($AzureAppName) ] is"
                    Write-Output $AppId
                }

    #-------------------------------------------------------------------------------------
    # Create a resource group for data collection endpoints (DCE) in the same region as the Log Analytics workspace
    #-------------------------------------------------------------------------------------

        Write-Output ""
        Write-Output "Validating Azure resource group exist [ $($AzDceResourceGroup) ]"
        try {
            Get-AzResourceGroup -Name $AzDceResourceGroup -ErrorAction Stop
        } catch {
            Write-Output ""
            Write-Output "Creating Azure resource group [ $($AzDceResourceGroup) ]"
            New-AzResourceGroup -Name $AzDceResourceGroup -Location $LoganalyticsLocation
        }

    #-------------------------------------------------------------------------------------
    # Create a resource group for data collection rules (DCR) in the same region as the Log Analytics workspace
    #-------------------------------------------------------------------------------------

        Write-Output ""
        Write-Output "Validating Azure resource group exist [ $($AzDcrResourceGroup) ]"
        try {
            Get-AzResourceGroup -Name $AzDcrResourceGroup -ErrorAction Stop
        } catch {
            Write-Output ""
            Write-Output "Creating Azure resource group [ $($AzDcrResourceGroup) ]"
            New-AzResourceGroup -Name $AzDcrResourceGroup -Location $LoganalyticsLocation
        }

    #-------------------------------------------------------------------------------------
    # Create data collection endpoint
    #-------------------------------------------------------------------------------------

        Write-Output ""
        Write-Output "Validating data collection endpoint exist [ $($AzDceName) ]"
    
        $DceUri = "https://management.azure.com" + "/subscriptions/" + $LogAnalyticsSubscription + "/resourceGroups/" + $AzDceResourceGroup + "/providers/Microsoft.Insights/dataCollectionEndpoints/" + $AzDceName + "?api-version=2022-06-01"
        Try
            {
                Invoke-RestMethod -Uri $DceUri -Method GET -Headers $Headers
            }
        Catch
            {
                Write-Output ""
                Write-Output "Creating/updating DCE [ $($AzDceName) ]"

                $DceObject = [pscustomobject][ordered]@{
                                properties = @{
                                                description = "DCE for LogIngest to LogAnalytics $LoganalyticsWorkspaceName"
                                                networkAcls = @{
                                                                    publicNetworkAccess = "Enabled"

                                                                }
                                                }
                                location = $LogAnalyticsLocation
                                name = $AzDceName
                                type = "Microsoft.Insights/dataCollectionEndpoints"
                            }

                $DcePayload = $DceObject | ConvertTo-Json -Depth 20

                $DceUri = "https://management.azure.com" + "/subscriptions/" + $LogAnalyticsSubscription + "/resourceGroups/" + $AzDceResourceGroup + "/providers/Microsoft.Insights/dataCollectionEndpoints/" + $AzDceName + "?api-version=2022-06-01"

                Try
                    {
                        Invoke-WebRequest -Uri $DceUri -Method PUT -Body $DcePayload -Headers $Headers
                    }
                Catch
                    {
                    }
            }
    
    #-------------------------------------------------------------------------------------
    # Sleeping 1 min to let Azure AD replicate before delegation
    #-------------------------------------------------------------------------------------

        # Write-Output "Sleeping 1 min to let Azure AD replicate before doing delegation"
        # Start-Sleep -s 60

    #-------------------------------------------------------------------------------------
    # Grant the Azure app permissions to the Log Analytics workspace
    # Needed for table management - not needed for log ingestion - for simplicity, it's set up when there's one app
    #-------------------------------------------------------------------------------------

        Write-Output ""
        Write-Output "Setting Contributor permissions for app [ $($AzureAppName) ] on the Log Analytics workspace [ $($LoganalyticsWorkspaceName) ]"

        $LogWorkspaceInfo = Get-AzOperationalInsightsWorkspace -Name $LoganalyticsWorkspaceName -ResourceGroupName $LogAnalyticsResourceGroup

        $LogAnalyticsWorkspaceResourceId = $LogWorkspaceInfo.ResourceId

        $ServicePrincipalObjectId = (Get-MgServicePrincipal -Filter "AppId eq '$AppId'").Id
        $DcrRgResourceId          = (Get-AzResourceGroup -Name $AzDcrResourceGroup).ResourceId

        # Contributor on Log Analytics workspace
            $guid = (new-guid).guid
            $ContributorRoleId = "b24988ac-6180-42a0-ab88-20f7382dd24c"  # Contributor
            $roleDefinitionId = "/subscriptions/$($LogAnalyticsSubscription)/providers/Microsoft.Authorization/roleDefinitions/$($ContributorRoleId)"
            $roleUrl = "https://management.azure.com" + $LogAnalyticsWorkspaceResourceId + "/providers/Microsoft.Authorization/roleAssignments/$($Guid)?api-version=2018-07-01"
            $roleBody = @{
                properties = @{
                    roleDefinitionId = $roleDefinitionId
                    principalId      = $ServicePrincipalObjectId
                    scope            = $LogAnalyticsWorkspaceResourceId
                }
            }
            $jsonRoleBody = $roleBody | ConvertTo-Json -Depth 6

            $result = try
                {
                    Invoke-RestMethod -Uri $roleUrl -Method PUT -Body $jsonRoleBody -headers $Headers -ErrorAction SilentlyContinue
                }
            catch
                {
                }


    #-------------------------------------------------------------------------------------
    # Grant the Azure app permissions to the DCR resource group
    #-------------------------------------------------------------------------------------

        Write-Output ""
        Write-Output "Setting Contributor permissions for app [ $($AzureAppName) ] on resource group [ $($AzDcrResourceGroup) ]"

        $ServicePrincipalObjectId = (Get-MgServicePrincipal -Filter "AppId eq '$AppId'").Id
        $AzDcrRgResourceId        = (Get-AzResourceGroup -Name $AzDcrResourceGroup).ResourceId

        # Contributor
            $guid = (new-guid).guid
            $ContributorRoleId = "b24988ac-6180-42a0-ab88-20f7382dd24c"  # Contributor
            $roleDefinitionId = "/subscriptions/$($LogAnalyticsSubscription)/providers/Microsoft.Authorization/roleDefinitions/$($ContributorRoleId)"
            $roleUrl = "https://management.azure.com" + $AzDcrRgResourceId + "/providers/Microsoft.Authorization/roleAssignments/$($Guid)?api-version=2018-07-01"
            $roleBody = @{
                properties = @{
                    roleDefinitionId = $roleDefinitionId
                    principalId      = $ServicePrincipalObjectId
                    scope            = $AzDcrRgResourceId
                }
            }
            $jsonRoleBody = $roleBody | ConvertTo-Json -Depth 6

            $result = try
                {
                    Invoke-RestMethod -Uri $roleUrl -Method PUT -Body $jsonRoleBody -headers $Headers -ErrorAction SilentlyContinue
                }
            catch
                {
                }

        Write-Output ""
        Write-Output "Setting Monitoring Metrics Publisher permissions for app [ $($AzureAppName) ] on RG [ $($AzDcrResourceGroup) ]"

        # Monitoring Metrics Publisher
            $guid = (new-guid).guid
            $monitorMetricsPublisherRoleId = "3913510d-42f4-4e42-8a64-420c390055eb"
            $roleDefinitionId = "/subscriptions/$($LogAnalyticsSubscription)/providers/Microsoft.Authorization/roleDefinitions/$($monitorMetricsPublisherRoleId)"
            $roleUrl = "https://management.azure.com" + $AzDcrRgResourceId + "/providers/Microsoft.Authorization/roleAssignments/$($Guid)?api-version=2018-07-01"
            $roleBody = @{
                properties = @{
                    roleDefinitionId = $roleDefinitionId
                    principalId      = $ServicePrincipalObjectId
                    scope            = $AzDcrRgResourceId
                }
            }
            $jsonRoleBody = $roleBody | ConvertTo-Json -Depth 6

            $result = try
                {
                    Invoke-RestMethod -Uri $roleUrl -Method PUT -Body $jsonRoleBody -headers $Headers -ErrorAction SilentlyContinue
                }
            catch
                {
                }

    #-------------------------------------------------------------------------------------
    # Grant the Azure app permissions to the DCE resource group
    #-------------------------------------------------------------------------------------

        Write-Output ""
        Write-Output "Setting Contributor permissions for app [ $($AzDceName) ] on RG [ $($AzDceResourceGroup) ]"

        $ServicePrincipalObjectId = (Get-MgServicePrincipal -Filter "AppId eq '$AppId'").Id
        $AzDceRgResourceId        = (Get-AzResourceGroup -Name $AzDceResourceGroup).ResourceId

        # Contributor
            $guid = (new-guid).guid
            $ContributorRoleId = "b24988ac-6180-42a0-ab88-20f7382dd24c"  # Contributor
            $roleDefinitionId = "/subscriptions/$($LogAnalyticsSubscription)/providers/Microsoft.Authorization/roleDefinitions/$($ContributorRoleId)"
            $roleUrl = "https://management.azure.com" + $AzDceRgResourceId + "/providers/Microsoft.Authorization/roleAssignments/$($Guid)?api-version=2018-07-01"
            $roleBody = @{
                properties = @{
                    roleDefinitionId = $roleDefinitionId
                    principalId      = $ServicePrincipalObjectId
                    scope            = $AzDceRgResourceId
                }
            }
            $jsonRoleBody = $roleBody | ConvertTo-Json -Depth 6

            $result = try
                {
                    Invoke-RestMethod -Uri $roleUrl -Method PUT -Body $jsonRoleBody -headers $Headers -ErrorAction SilentlyContinue
                }
            catch
                {
                }

    #-----------------------------------------------------------------------------------------------
    # Summarize environment details
    #-----------------------------------------------------------------------------------------------

    # Azure App
        Write-Output ""
        Write-Output "Tenant Id:"
        Write-Output $TenantId

    # Azure App
        $AppInfo  = Get-MgApplication -Filter "DisplayName eq '$AzureAppName'"
        $AppId    = $AppInfo.AppId
        $ObjectId = $AppInfo.Id

        Write-Output ""
        Write-Output "Log Ingestion Azure App name:"
        Write-Output $AzureAppName

        Write-Output ""
        Write-Output "Log Ingestion Azure App ID:"
        Write-Output $AppId
        Write-Output ""


        If ($AzAppSecret)
            {
                Write-Output "LogIngestion Azure App secret:"
                Write-Output $AzAppSecret
            }
        Else
            {
                Write-Output "Log Ingestion Azure App secret:"
                Write-Output "N/A (new secret must be made)"
            }

    # Azure Service Principal for App
        $ServicePrincipalObjectId = (Get-MgServicePrincipal -Filter "AppId eq '$AppId'").Id
        Write-Output ""
        Write-Output "Log Ingestion service principal Object ID for app:"
        Write-Output $ServicePrincipalObjectId

    # Azure Loganalytics
        Write-Output ""
        $LogWorkspaceInfo = Get-AzOperationalInsightsWorkspace -Name $LoganalyticsWorkspaceName -ResourceGroupName $LogAnalyticsResourceGroup
        $LogAnalyticsWorkspaceResourceId = $LogWorkspaceInfo.ResourceId

        Write-Output ""
        Write-Output "Log Analytics workspace resource ID:"
        Write-Output $LogAnalyticsWorkspaceResourceId

    # DCE
        $DceUri = "https://management.azure.com" + "/subscriptions/" + $LogAnalyticsSubscription + "/resourceGroups/" + $AzDceResourceGroup + "/providers/Microsoft.Insights/dataCollectionEndpoints/" + $AzDceName + "?api-version=2022-06-01"
        $DceObj = Invoke-RestMethod -Uri $DceUri -Method GET -Headers $Headers

        $AzDceLogIngestionUri = $DceObj.properties.logsIngestion[0].endpoint

        Write-Output ""
        Write-Output "Data collection endpoint name:"
        Write-Output $AzDceName

        Write-Output ""
        Write-Output "Data collection endpoint Log Ingestion URI:"
        Write-Output $AzDceLogIngestionUri
        Write-Output ""
        Write-Output "-------------------------------------------------"
```

## Next steps

- [Learn more about data collection rules](../essentials/data-collection-rule-overview.md)
- [Learn more about writing transformation queries](../essentials//data-collection-transformations.md)
