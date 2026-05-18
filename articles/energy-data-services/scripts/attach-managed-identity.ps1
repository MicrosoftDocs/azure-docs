<#
.SYNOPSIS
    Attach a user-assigned managed identity to an Azure Data Manager for Energy instance.
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$SubscriptionId,
    
    [Parameter(Mandatory=$true)]
    [string]$AdmeInstanceName,
    
    [Parameter(Mandatory=$true)]
    [string]$ManagedIdentityName
)

Write-Host "Attaching managed identity to Azure Data Manager for Energy instance..." -ForegroundColor Cyan

# Set subscription
az account set --subscription $SubscriptionId | Out-Null

# Get Azure Data Manager for Energy instance resource group
$resourceGroup = az resource list --resource-type "Microsoft.OpenEnergyPlatform/energyServices" --subscription $SubscriptionId --query "[?name=='$AdmeInstanceName'].resourceGroup" -o tsv

if (-not $resourceGroup) {
    Write-Host "Error: Azure Data Manager for Energy instance '$AdmeInstanceName' not found" -ForegroundColor Red
    exit 1
}

# Get full instance details with API version
$adme = az resource show --ids "/subscriptions/$SubscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.OpenEnergyPlatform/energyServices/$AdmeInstanceName" --api-version 2025-09-22-preview | ConvertFrom-Json

$location = $adme.location
$authAppId = $adme.properties.authAppId
$dataPartitionName = $adme.properties.dataPartitionNames[0].name

# Get managed identity
$mi = az identity list --query "[?name=='$ManagedIdentityName']" | ConvertFrom-Json
if (-not $mi) {
    Write-Host "Error: Managed identity '$ManagedIdentityName' not found" -ForegroundColor Red
    exit 1
}

$miResourceId = $mi[0].id

# Build user-assigned identities object (preserve existing)
$identities = @{}
if ($adme.identity.userAssignedIdentities) {
    foreach ($key in $adme.identity.userAssignedIdentities.PSObject.Properties.Name) {
        $identities[$key] = @{}
    }
}
$identities[$miResourceId] = @{}

# Build request body
$body = @{
    location = $location
    properties = @{
        authAppId = $authAppId
        dataPartitionNames = @(
            @{ name = $dataPartitionName }
        )
    }
    identity = @{
        type = "UserAssigned"
        userAssignedIdentities = $identities
    }
} | ConvertTo-Json -Depth 10

# Get ARM token and update Azure Data Manager for Energy instance
$token = az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv
$uri = "https://management.azure.com/subscriptions/$SubscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.OpenEnergyPlatform/energyServices/$AdmeInstanceName`?api-version=2025-09-22-preview"

Invoke-RestMethod -Uri $uri -Method Put -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
} -Body $body

Write-Host "Successfully attached managed identity to Azure Data Manager for Energy instance" -ForegroundColor Green
