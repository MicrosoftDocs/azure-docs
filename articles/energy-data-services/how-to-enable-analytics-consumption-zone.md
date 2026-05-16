---
title: How to enable the Analytics Consumption Zone (ACZ) in Azure Data Manager for Energy
description: Learn how to enable the Analytics Consumption Zone (ACZ) capability on your Azure Data Manager for Energy instance. Configure user-assigned managed identity, storage, and permissions for ACZ.
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 05/12/2026
ms.author: nsannala
author: NSannala
ms.reviewer: 

#customer intent: As a data engineer, I want to enable the Analytics Consumption Zone so that I can export Azure Data Manager for Energy data to ADLS Gen2.

---

# How to enable the Analytics Consumption Zone (ACZ)

This article explains how to enable the Analytics Consumption Zone (ACZ) capability on your Azure Data Manager for Energy resource. Enablement is a one-time setup process that configures your Azure Data Manager for Energy resource, user-assigned managed identity, and storage account. After enablement, you can create multiple ACZs to sync different Azure Data Manager for Energy data sets to your Azure Data Lake Storage (ADLS) Gen2 account.

> [!IMPORTANT]
> Analytics Consumption Zone is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!NOTE]
> During the preview, ACZ is only available on Developer Tier instances and requires allowlisting. To enable ACZ on your Azure Data Manager for Energy resource, complete the steps in this article and contact your Microsoft representative.

## Setup overview

Complete the following one-time setup tasks to enable ACZ on your Azure Data Manager for Energy resource. After enablement, you can create multiple ACZs using the APIs.

| Step | Task |
|------|------|
| 1 | Create a user-assigned managed identity for ACZ |
| 2 | Assign the user-assigned managed identity to your Azure Data Manager for Energy resource |
| 3 | Verify the user has entitlement group access |
| 4 | Create or use an existing ADLS Gen2 storage account |
| 5 | Grant the user-assigned managed identity permissions on the ADLS Gen2 container |
| 6 | Share user-assigned managed identity and Azure Data Manager for Energy instance details with Microsoft (preview requirement) |

## Prerequisites

- An active Azure subscription. [Create a subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Data Manager for Energy instance (Developer Tier) with at least one data partition. [Create an Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md).
- The [Azure CLI](/cli/azure/install-azure-cli) installed on your machine, or access to [Azure Cloud Shell](../cloud-shell/overview.md).

## Quick setup with automation (Recommended)

For a faster setup experience, use our automation scripts that handle all configuration steps automatically. Choose the script for your environment:

# [PowerShell](#tab/powershell-script)

**What the script does:**
- Discovers your Azure subscriptions and Azure Data Manager for Energy (ADME) instances
- Prompts for required inputs (resource names, locations)
- Creates managed identity (or uses existing)
- Assigns identity to ADME instance (preserving existing identities)
- Grants storage permissions
- Provides summary of configuration for Microsoft allowlisting

**Prerequisites:**
- Azure CLI installed and logged in (`az login`)
- Permissions to create resources and assign roles

**Setup script:**

```powershell
<#
.SYNOPSIS
    Automates Analytics Consumption Zone (ACZ) setup for Azure Data Manager for Energy.

.DESCRIPTION
    This script automates the one-time setup required to enable ACZ on your Azure Data Manager for Energy instance.
    It handles managed identity creation, assignment, and storage permissions.

.NOTES
    Prerequisites:
    - Azure CLI installed and authenticated (az login)
    - Permissions to create managed identities and assign roles
    - Azure Data Manager for Energy instance already created
#>

[CmdletBinding()]
param()

# Colors for output
function Write-Info { param($Message) Write-Host $Message -ForegroundColor Cyan }
function Write-Success { param($Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }
function Write-ErrorMsg { param($Message) Write-Host "✗ $Message" -ForegroundColor Red }

Write-Info "=== Azure Data Manager for Energy - ACZ Setup Automation ==="
Write-Info ""

# Step 1: Discover and select subscription
Write-Info "Step 1: Select Azure Subscription"
Write-Info "Discovering subscriptions..."

$subscriptions = az account list --query '[].{Name:name, SubscriptionId:id, State:state}' -o json | ConvertFrom-Json
$subscriptions = $subscriptions | Sort-Object Name

if ($subscriptions.Count -eq 0) {
    Write-ErrorMsg "No subscriptions found. Please run 'az login' first."
    exit 1
}

Write-Info "`nAvailable subscriptions:"
for ($i = 0; $i -lt $subscriptions.Count; $i++) {
    $state = if ($subscriptions[$i].State -eq 'Enabled') { '' } else { " [$($subscriptions[$i].State)]" }
    Write-Host "  [$i] $($subscriptions[$i].Name)$state"
}

$subSelection = Read-Host "`nSelect subscription number (or press Enter for 0)"
if ([string]::IsNullOrWhiteSpace($subSelection)) { $subSelection = 0 }
$subSelection = [int]$subSelection

$subscriptionId = $subscriptions[$subSelection].SubscriptionId
$subscriptionName = $subscriptions[$subSelection].Name

az account set --subscription $subscriptionId
Write-Success "Subscription set to: $subscriptionName ($subscriptionId)"
Write-Info ""

# Step 2: Discover and select ADME instance
Write-Info "Step 2: Select Azure Data Manager for Energy Instance"
Write-Info "Discovering ADME instances in subscription..."

$admeInstances = az resource list --resource-type "Microsoft.OpenEnergyPlatform/energyServices" --query "[].{Name:name, ResourceGroup:resourceGroup, Location:location}" -o json | ConvertFrom-Json
$admeInstances = $admeInstances | Sort-Object Name

if ($admeInstances.Count -eq 0) {
    Write-ErrorMsg "No ADME instances found in subscription $subscriptionId"
    exit 1
}

Write-Info "`nAvailable ADME instances:"
for ($i = 0; $i -lt $admeInstances.Count; $i++) {
    Write-Host "  [$i] $($admeInstances[$i].Name) (RG: $($admeInstances[$i].ResourceGroup), Location: $($admeInstances[$i].Location))"
}

$selection = Read-Host "`nSelect ADME instance number (or press Enter for 0)"
if ([string]::IsNullOrWhiteSpace($selection)) { $selection = 0 }
$selection = [int]$selection

$admeInstanceName = $admeInstances[$selection].Name
$resourceGroup = $admeInstances[$selection].ResourceGroup
$location = $admeInstances[$selection].Location

Write-Success "Selected: $admeInstanceName"
Write-Info ""

# Get ADME instance details
Write-Info "Retrieving ADME instance configuration..."
$admeDetails = az resource show `
    --ids "/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.OpenEnergyPlatform/energyServices/$admeInstanceName" `
    --query "{location:location, authAppId:properties.authAppId, dataPartitions:properties.dataPartitionNames, existingIdentities:identity.userAssignedIdentities}" `
    -o json | ConvertFrom-Json

$authAppId = $admeDetails.authAppId
$dataPartitionName = $admeDetails.dataPartitions[0].name
$existingIdentities = $admeDetails.existingIdentities

Write-Success "Instance details retrieved"
Write-Info "  Location: $($admeDetails.location)"
Write-Info "  Auth App ID: $authAppId"
Write-Info "  Data Partition: $dataPartitionName"

if ($existingIdentities) {
    Write-Warning "Found existing managed identities on this instance"
    Write-Info "  Identities: $($existingIdentities | ConvertTo-Json -Compress)"
}
Write-Info ""

# Step 3: Managed Identity - Create or Use Existing
Write-Info "Step 3: Managed Identity Configuration"
$useExisting = Read-Host "Use existing managed identity? (y/n, default: n)"

if ($useExisting -eq 'y') {
    Write-Info "`nDiscovering managed identities in subscription..."
    $identities = az identity list --query "[].{Name:name, ResourceGroup:resourceGroup, Id:id}" -o json | ConvertFrom-Json
    $identities = $identities | Sort-Object Name
    
    if ($identities.Count -eq 0) {
        Write-ErrorMsg "No managed identities found. Creating new identity..."
        $useExisting = 'n'
    } else {
        Write-Info "`nAvailable managed identities:"
        for ($i = 0; $i -lt $identities.Count; $i++) {
            Write-Host "  [$i] $($identities[$i].Name) (RG: $($identities[$i].ResourceGroup))"
        }
        
        $idSelection = Read-Host "`nSelect identity number"
        $idSelection = [int]$idSelection
        
        $identityResourceId = $identities[$idSelection].Id
        $identityName = $identities[$idSelection].Name
        $identityRg = $identities[$idSelection].ResourceGroup
        
        Write-Success "Using existing identity: $identityName"
    }
}

if ($useExisting -ne 'y') {
    $identityName = Read-Host "`nEnter name for new managed identity (e.g. acz-identity)"
    $identityRg = Read-Host "Enter resource group for identity (default: $resourceGroup)"
    if ([string]::IsNullOrWhiteSpace($identityRg)) { $identityRg = $resourceGroup }
    
    Write-Info "Creating managed identity: $identityName..."
    $identity = az identity create --name $identityName --resource-group $identityRg --location $location -o json | ConvertFrom-Json
    $identityResourceId = $identity.id
    
    Write-Success "Managed identity created: $identityResourceId"
}
Write-Info ""

# Step 4: Assign managed identity to ADME instance
Write-Info "Step 4: Assigning Managed Identity to ADME Instance"
Write-Info "Getting Azure Resource Manager token..."

$token = az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv

# Build identity object (preserve existing identities)
$identityObject = @{
    $identityResourceId = @{}
}

if ($existingIdentities) {
    Write-Info "Preserving existing identities..."
    $existingIdentities.PSObject.Properties | ForEach-Object {
        $identityObject[$_.Name] = @{}
    }
}

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
        userAssignedIdentities = $identityObject
    }
} | ConvertTo-Json -Depth 10

Write-Info "Updating ADME instance..."
$response = Invoke-RestMethod `
    -Method Put `
    -Uri "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.OpenEnergyPlatform/energyServices/$admeInstanceName?api-version=2025-09-22-preview" `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } `
    -Body $body

Write-Success "Managed identity assigned to ADME instance"
Write-Info ""

# Step 5: Storage Account
Write-Info "Step 5: Storage Account Configuration"
$storageAccountName = Read-Host "Enter ADLS Gen2 storage account name"
$storageRg = Read-Host "Enter storage account resource group (default: $resourceGroup)"
if ([string]::IsNullOrWhiteSpace($storageRg)) { $storageRg = $resourceGroup }

$storageResourceId = "/subscriptions/$subscriptionId/resourceGroups/$storageRg/providers/Microsoft.Storage/storageAccounts/$storageAccountName"

Write-Info "Verifying storage account exists..."
$storageExists = az storage account show --name $storageAccountName --resource-group $storageRg --query "id" -o tsv 2>$null

if (-not $storageExists) {
    Write-ErrorMsg "Storage account not found: $storageAccountName"
    $create = Read-Host "Create ADLS Gen2 storage account? (y/n)"
    
    if ($create -eq 'y') {
        Write-Info "Creating ADLS Gen2 storage account..."
        az storage account create `
            --name $storageAccountName `
            --resource-group $storageRg `
            --location $location `
            --sku Standard_LRS `
            --kind StorageV2 `
            --enable-hierarchical-namespace true
        
        Write-Success "Storage account created"
    } else {
        Write-ErrorMsg "Storage account required. Exiting."
        exit 1
    }
}

Write-Success "Storage account verified: $storageAccountName"
Write-Info ""

# Step 6: Grant storage permissions
Write-Info "Step 6: Granting Storage Permissions"
Write-Info "Assigning 'Storage Blob Data Contributor' role to managed identity..."

# Get the principal ID of the managed identity
$principalId = az identity show --ids $identityResourceId --query principalId -o tsv

az role assignment create `
    --assignee $principalId `
    --role "Storage Blob Data Contributor" `
    --scope $storageResourceId

Write-Success "Storage permissions granted"
Write-Info ""

# Summary
Write-Info "========================================="
Write-Info "ACZ Setup Complete!"
Write-Info "========================================="
Write-Info ""
Write-Success "Configuration Summary:"
Write-Info ""
Write-Info "ADME Instance Details:"
Write-Info "  Name: $admeInstanceName"
Write-Info "  Resource Group: $resourceGroup"
Write-Info "  Location: $location"
Write-Info "  Data Partition: $dataPartitionName"
Write-Info ""
Write-Info "Managed Identity:"
Write-Info "  Name: $identityName"
Write-Info "  Resource ID: $identityResourceId"
Write-Info ""
Write-Info "Storage Account:"
Write-Info "  Name: $storageAccountName"
Write-Info "  Resource ID: $storageResourceId"
Write-Info ""
Write-Warning "NEXT STEPS:"
Write-Info "1. Share the following with your Microsoft representative for allowlisting:"
Write-Info "   - ADME Instance: $admeInstanceName"
Write-Info "   - Managed Identity Resource ID: $identityResourceId"
Write-Info ""
Write-Info "2. After allowlisting, verify entitlement group access (see manual steps below)"
Write-Info ""
Write-Info "3. Create your first ACZ using the API (see 'Create an Analytics Consumption Zone' section below)"
Write-Info ""
```

Save this script as `enable-acz-setup.ps1` and run it with PowerShell.

# [Bash](#tab/bash-script)

**What the script does:**
- Discovers your Azure subscriptions and Azure Data Manager for Energy (ADME) instances
- Prompts for required inputs (resource names, locations)
- Creates managed identity (or uses existing)
- Assigns identity to ADME instance (preserving existing identities)
- Grants storage permissions
- Provides summary of configuration for Microsoft allowlisting

**Prerequisites:**
- Azure CLI installed and logged in (`az login`)
- `jq` installed for JSON parsing
- Permissions to create resources and assign roles

**Setup script:**

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

info() { echo -e "${CYAN}$1${NC}"; }
success() { echo -e "${GREEN}✓ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
error() { echo -e "${RED}✗ $1${NC}"; }

info "=== Azure Data Manager for Energy - ACZ Setup Automation ==="
echo ""

# Check prerequisites
if ! command -v az &> /dev/null; then
    error "Azure CLI not found. Please install: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    error "jq not found. Please install: https://stedolan.github.io/jq/download/"
    exit 1
fi

# Step 1: Select subscription
info "Step 1: Select Azure Subscription"
info "Available subscriptions:"
az account list --output table

echo ""
read -p "Enter your subscription ID: " SUBSCRIPTION_ID
az account set --subscription "$SUBSCRIPTION_ID"
success "Subscription set to: $SUBSCRIPTION_ID"
echo ""

# Step 2: Select ADME instance
info "Step 2: Select Azure Data Manager for Energy Instance"
info "Discovering ADME instances in subscription..."

ADME_INSTANCES=$(az resource list --resource-type "Microsoft.OpenEnergyPlatform/energyServices" --query "[].{Name:name, ResourceGroup:resourceGroup, Location:location}" -o json)

if [ "$(echo "$ADME_INSTANCES" | jq 'length')" -eq 0 ]; then
    error "No ADME instances found in subscription $SUBSCRIPTION_ID"
    exit 1
fi

echo ""
info "Available ADME instances:"
echo "$ADME_INSTANCES" | jq -r 'to_entries[] | "  [\(.key)] \(.value.Name) (RG: \(.value.ResourceGroup), Location: \(.value.Location})"'

echo ""
read -p "Select ADME instance number (default: 0): " SELECTION
SELECTION=${SELECTION:-0}

ADME_INSTANCE_NAME=$(echo "$ADME_INSTANCES" | jq -r ".[$SELECTION].Name")
RESOURCE_GROUP=$(echo "$ADME_INSTANCES" | jq -r ".[$SELECTION].ResourceGroup")
LOCATION=$(echo "$ADME_INSTANCES" | jq -r ".[$SELECTION].Location")

success "Selected: $ADME_INSTANCE_NAME"
echo ""

# Get ADME instance details
info "Retrieving ADME instance configuration..."
ADME_DETAILS=$(az resource show \
    --ids "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME" \
    --query "{location:location, authAppId:properties.authAppId, dataPartitions:properties.dataPartitionNames, existingIdentities:identity.userAssignedIdentities}" \
    -o json)

AUTH_APP_ID=$(echo "$ADME_DETAILS" | jq -r '.authAppId')
DATA_PARTITION_NAME=$(echo "$ADME_DETAILS" | jq -r '.dataPartitions[0].name')
EXISTING_IDENTITIES=$(echo "$ADME_DETAILS" | jq -r '.existingIdentities // {}')

success "Instance details retrieved"
info "  Location: $(echo "$ADME_DETAILS" | jq -r '.location')"
info "  Auth App ID: $AUTH_APP_ID"
info "  Data Partition: $DATA_PARTITION_NAME"

if [ "$EXISTING_IDENTITIES" != "{}" ] && [ "$EXISTING_IDENTITIES" != "null" ]; then
    warning "Found existing managed identities on this instance"
    info "  Identities: $EXISTING_IDENTITIES"
fi
echo ""

# Step 3: Managed Identity
info "Step 3: Managed Identity Configuration"
read -p "Use existing managed identity? (y/n, default: n): " USE_EXISTING

if [ "$USE_EXISTING" = "y" ]; then
    info ""
    info "Discovering managed identities in subscription..."
    IDENTITIES=$(az identity list --query "[].{Name:name, ResourceGroup:resourceGroup, Id:id}" -o json)
    
    if [ "$(echo "$IDENTITIES" | jq 'length')" -eq 0 ]; then
        error "No managed identities found. Creating new identity..."
        USE_EXISTING="n"
    else
        info ""
        info "Available managed identities:"
        echo "$IDENTITIES" | jq -r 'to_entries[] | "  [\(.key)] \(.value.Name) (RG: \(.value.ResourceGroup})"'
        
        echo ""
        read -p "Select identity number: " ID_SELECTION
        
        IDENTITY_RESOURCE_ID=$(echo "$IDENTITIES" | jq -r ".[$ID_SELECTION].Id")
        IDENTITY_NAME=$(echo "$IDENTITIES" | jq -r ".[$ID_SELECTION].Name")
        IDENTITY_RG=$(echo "$IDENTITIES" | jq -r ".[$ID_SELECTION].ResourceGroup")
        
        success "Using existing identity: $IDENTITY_NAME"
    fi
fi

if [ "$USE_EXISTING" != "y" ]; then
    echo ""
    read -p "Enter name for new managed identity (e.g., 'acz-identity'): " IDENTITY_NAME
    read -p "Enter resource group for identity (default: $RESOURCE_GROUP): " IDENTITY_RG
    IDENTITY_RG=${IDENTITY_RG:-$RESOURCE_GROUP}
    
    info "Creating managed identity: $IDENTITY_NAME..."
    IDENTITY=$(az identity create --name "$IDENTITY_NAME" --resource-group "$IDENTITY_RG" --location "$LOCATION" -o json)
    IDENTITY_RESOURCE_ID=$(echo "$IDENTITY" | jq -r '.id')
    
    success "Managed identity created: $IDENTITY_RESOURCE_ID"
fi
echo ""

# Step 4: Assign managed identity to ADME instance
info "Step 4: Assigning Managed Identity to ADME Instance"
info "Getting Azure Resource Manager token..."

TOKEN=$(az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv)

# Build identity object (preserve existing identities)
if [ "$EXISTING_IDENTITIES" != "{}" ] && [ "$EXISTING_IDENTITIES" != "null" ]; then
    info "Preserving existing identities..."
    IDENTITY_OBJECT=$(echo "$EXISTING_IDENTITIES" | jq ". + {\"$IDENTITY_RESOURCE_ID\": {}}")
else
    IDENTITY_OBJECT=$(jq -n "{\"$IDENTITY_RESOURCE_ID\": {}}")
fi

BODY=$(jq -n \
    --arg location "$LOCATION" \
    --arg authAppId "$AUTH_APP_ID" \
    --arg dataPartition "$DATA_PARTITION_NAME" \
    --argjson identities "$IDENTITY_OBJECT" \
    '{
        location: $location,
        properties: {
            authAppId: $authAppId,
            dataPartitionNames: [{name: $dataPartition}]
        },
        identity: {
            type: "UserAssigned",
            userAssignedIdentities: $identities
        }
    }')

info "Updating ADME instance..."
curl --request PUT \
    --url "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME?api-version=2025-09-22-preview" \
    --header "Authorization: Bearer $TOKEN" \
    --header "Content-Type: application/json" \
    --data "$BODY" \
    --silent --show-error

success "Managed identity assigned to ADME instance"
echo ""

# Step 5: Storage Account
info "Step 5: Storage Account Configuration"
read -p "Enter ADLS Gen2 storage account name: " STORAGE_ACCOUNT_NAME
read -p "Enter storage account resource group (default: $RESOURCE_GROUP): " STORAGE_RG
STORAGE_RG=${STORAGE_RG:-$RESOURCE_GROUP}

STORAGE_RESOURCE_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$STORAGE_RG/providers/Microsoft.Storage/storageAccounts/$STORAGE_ACCOUNT_NAME"

info "Verifying storage account exists..."
if ! az storage account show --name "$STORAGE_ACCOUNT_NAME" --resource-group "$STORAGE_RG" &> /dev/null; then
    error "Storage account not found: $STORAGE_ACCOUNT_NAME"
    read -p "Create ADLS Gen2 storage account? (y/n): " CREATE_STORAGE
    
    if [ "$CREATE_STORAGE" = "y" ]; then
        info "Creating ADLS Gen2 storage account..."
        az storage account create \
            --name "$STORAGE_ACCOUNT_NAME" \
            --resource-group "$STORAGE_RG" \
            --location "$LOCATION" \
            --sku Standard_LRS \
            --kind StorageV2 \
            --enable-hierarchical-namespace true
        
        success "Storage account created"
    else
        error "Storage account required. Exiting."
        exit 1
    fi
fi

success "Storage account verified: $STORAGE_ACCOUNT_NAME"
echo ""

# Step 6: Grant storage permissions
info "Step 6: Granting Storage Permissions"
info "Assigning 'Storage Blob Data Contributor' role to managed identity..."

PRINCIPAL_ID=$(az identity show --ids "$IDENTITY_RESOURCE_ID" --query principalId -o tsv)

az role assignment create \
    --assignee "$PRINCIPAL_ID" \
    --role "Storage Blob Data Contributor" \
    --scope "$STORAGE_RESOURCE_ID"

success "Storage permissions granted"
echo ""
    '{
        location: $location,
        properties: {
            authAppId: $authAppId,
            dataPartitionNames: [{name: $dataPartition}]
        },
        identity: {
            type: "UserAssigned",
            userAssignedIdentities: $identities
        }
    }')

info "Updating ADME instance..."
curl --request PUT \
    --url "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME?api-version=2025-09-22-preview" \
    --header "Authorization: Bearer $TOKEN" \
    --header "Content-Type: application/json" \
    --data "$BODY" \
    --silent --show-error

success "Managed identity assigned to ADME instance"
echo ""

# Step 6: Grant storage permissions
info "Step 6: Granting Storage Permissions"
info "Assigning 'Storage Blob Data Contributor' role to managed identity..."

PRINCIPAL_ID=$(az identity show --ids "$IDENTITY_RESOURCE_ID" --query principalId -o tsv)

az role assignment create \
    --assignee "$PRINCIPAL_ID" \
    --role "Storage Blob Data Contributor" \
    --scope "$STORAGE_RESOURCE_ID"

success "Storage permissions granted"
echo ""

# Summary
info "========================================="
info "ACZ Setup Complete!"
info "========================================="
echo ""
success "Configuration Summary:"
echo ""
info "ADME Instance Details:"
info "  Name: $ADME_INSTANCE_NAME"
info "  Resource Group: $RESOURCE_GROUP"
info "  Location: $LOCATION"
info "  Data Partition: $DATA_PARTITION_NAME"
echo ""
info "Managed Identity:"
info "  Name: $IDENTITY_NAME"
info "  Resource ID: $IDENTITY_RESOURCE_ID"
echo ""
info "Storage Account:"
info "  Name: $STORAGE_ACCOUNT_NAME"
info "  Resource ID: $STORAGE_RESOURCE_ID"
echo ""
warning "NEXT STEPS:"
info "1. Share the following with your Microsoft representative for allowlisting:"
info "   - ADME Instance: $ADME_INSTANCE_NAME"
info "   - Managed Identity Resource ID: $IDENTITY_RESOURCE_ID"
echo ""
info "2. After allowlisting, verify entitlement group access (see manual steps below)"
echo ""
info "3. Create your first ACZ using the API (see 'Create an Analytics Consumption Zone' section below)"
echo ""
```

Save this script as `enable-acz-setup.sh`, make it executable with `chmod +x enable-acz-setup.sh`, and run it.

---

> [!TIP]
> The automation scripts handle all setup steps automatically. If you prefer to understand each configuration step or need customization, continue with the manual step-by-step instructions in this section.

## Manual step-by-step setup

For users who want to understand each configuration step or need customization, follow the manual setup instructions in this section.

## Step 1: Create a user-assigned managed identity for ACZ

ACZ uses a user-assigned managed identity to write data to ADLS Gen2. Create a dedicated identity for ACZ:

> [!IMPORTANT]
> Microsoft recommends creating a dedicated user-assigned managed identity for ACZ rather than reusing identities from other services like Customer-Managed Encryption Keys (CMEK) or External Data Sources (EDS). A dedicated identity provides:
> - **Clear audit trails**: Separate identity makes it easier to track ACZ-specific operations in audit logs
> - **Independent lifecycle management**: You can rotate, update, or remove ACZ identity without affecting other services
> - **Granular access control**: ACZ identity gets only the permissions it needs (Storage Blob Data Contributor) without inheriting unnecessary permissions
> - **Simplified troubleshooting**: Issues with ACZ permissions don't affect CMEK, EDS, or other services

To create a user-assigned managed identity:

1. In the [Azure portal](https://portal.azure.com/), search for **Managed Identities** and select it.
2. Select **+ Create**.
3. Select your subscription, resource group, region, and provide a name for the identity.
4. Select **Review + create**, then select **Create**.

## Step 2: Assign the user-assigned managed identity to your Azure Data Manager for Energy resource

> [!IMPORTANT]
> **Different token required for this step!**  
> This step uses an **Azure Resource Manager (ARM) token** (not your Azure Data Manager for Energy auth token) to update the instance configuration via the ARM control plane API. The following script generates the correct ARM token automatically.

Assign the user-assigned managed identity you created in Step 1 to your Azure Data Manager for Energy resource.

 > [!IMPORTANT]
> **Preserve existing managed identities!**  
> If your Azure Data Manager for Energy instance includes user-assigned managed identities (for example, for Customer-Managed Encryption Keys or External Data Sources), you **must include all existing identities** in the `userAssignedIdentities` object. The PUT operation replaces the entire identity configuration—omitting existing identities removes them from the instance.

### Initialize variables

First, set up your variables. The Azure CLI commands help you discover available resources.

# [Bash](#tab/bash)

```bash
# Discover available subscriptions
az account list --output table

# Set your subscription (replace with your subscription ID)
SUBSCRIPTION_ID="<your-subscription-id>"
az account set --subscription $SUBSCRIPTION_ID

# Discover resource groups
az group list --output table

# Set variables for your Azure Data Manager for Energy instance
RESOURCE_GROUP="<your-resource-group>"
ADME_INSTANCE_NAME="<your-adme-instance-name>"

# Discover Azure Data Manager for Energy instances in your subscription
az resource list \
  --resource-type "Microsoft.OpenEnergyPlatform/energyServices" \
  --output table

# Get instance details (location, authAppId, data partitions)
az resource show \
  --ids /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME \
  --query "{location:location, authAppId:properties.authAppId, dataPartitions:properties.dataPartitionNames}" \
  --output json

# Set instance properties based on the output
LOCATION="<location-from-output>"  # e.g., "southcentralus"
AUTH_APP_ID="<authAppId-from-output>"
DATA_PARTITION_NAME="<partition-name-from-output>"  # e.g., "dp1"

# Set managed identity details
IDENTITY_SUBSCRIPTION_ID="$SUBSCRIPTION_ID"  # Change if identity is in different subscription
IDENTITY_RESOURCE_GROUP="<identity-resource-group>"
IDENTITY_NAME="<your-managed-identity-name>"

# Construct the managed identity resource ID
IDENTITY_RESOURCE_ID="/subscriptions/$IDENTITY_SUBSCRIPTION_ID/resourceGroups/$IDENTITY_RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$IDENTITY_NAME"

echo "Configuration:"
echo "  Subscription: $SUBSCRIPTION_ID"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  ADME Instance: $ADME_INSTANCE_NAME"
echo "  Location: $LOCATION"
echo "  Managed Identity: $IDENTITY_RESOURCE_ID"
```

# [PowerShell](#tab/powershell)

```powershell
# Discover available subscriptions
az account list --output table

# Set your subscription (replace with your subscription ID)
$SUBSCRIPTION_ID = "<your-subscription-id>"
az account set --subscription $SUBSCRIPTION_ID

# Discover resource groups
az group list --output table

# Set variables for your Azure Data Manager for Energy instance
$RESOURCE_GROUP = "<your-resource-group>"
$ADME_INSTANCE_NAME = "<your-adme-instance-name>"

# Discover Azure Data Manager for Energy instances in your subscription
az resource list `
  --resource-type "Microsoft.OpenEnergyPlatform/energyServices" `
  --output table

# Get instance details (location, authAppId, data partitions)
az resource show `
  --ids /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME `
  --query "{location:location, authAppId:properties.authAppId, dataPartitions:properties.dataPartitionNames}" `
  --output json

# Set instance properties based on the output
$LOCATION = "<location-from-output>"  # e.g., "southcentralus"
$AUTH_APP_ID = "<authAppId-from-output>"
$DATA_PARTITION_NAME = "<partition-name-from-output>"  # e.g., "dp1"

# Set managed identity details
$IDENTITY_SUBSCRIPTION_ID = $SUBSCRIPTION_ID  # Change if identity is in different subscription
$IDENTITY_RESOURCE_GROUP = "<identity-resource-group>"
$IDENTITY_NAME = "<your-managed-identity-name>"

# Construct the managed identity resource ID
$IDENTITY_RESOURCE_ID = "/subscriptions/$IDENTITY_SUBSCRIPTION_ID/resourceGroups/$IDENTITY_RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$IDENTITY_NAME"

Write-Host "Configuration:"
Write-Host "  Subscription: $SUBSCRIPTION_ID"
Write-Host "  Resource Group: $RESOURCE_GROUP"
Write-Host "  ADME Instance: $ADME_INSTANCE_NAME"
Write-Host "  Location: $LOCATION"
Write-Host "  Managed Identity: $IDENTITY_RESOURCE_ID"
```

---

> [!TIP]
> To preserve existing identities, first retrieve the current configuration:
> ```bash
> az resource show --ids /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME --query identity.userAssignedIdentities
> ```
> Include all returned identity resource identifiers along with your new ACZ identity in the `userAssignedIdentities` object in the next step.

### Update the Azure Data Manager for Energy instance

Use the Azure Management API to assign the user-assigned managed identity to your Azure Data Manager for Energy resource.

# [Bash](#tab/bash)

```bash
# Get Azure Resource Manager token
TOKEN=$(az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv)

# Update Azure Data Manager for Energy instance with managed identity
curl --request PUT \
  --url "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME?api-version=2025-09-22-preview" \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data "{
    \"location\": \"$LOCATION\",
    \"properties\": {
      \"authAppId\": \"$AUTH_APP_ID\",
      \"dataPartitionNames\": [
        {
          \"name\": \"$DATA_PARTITION_NAME\"
        }
      ]
    },
    \"identity\": {
      \"type\": \"UserAssigned\",
      \"userAssignedIdentities\": {
        \"$IDENTITY_RESOURCE_ID\": {}
      }
    }
  }"
```

# [PowerShell](#tab/powershell)

```powershell
# Get Azure Resource Manager token
$TOKEN = az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv

# Build the request body
$body = @{
  location = $LOCATION
  properties = @{
    authAppId = $AUTH_APP_ID
    dataPartitionNames = @(
      @{
        name = $DATA_PARTITION_NAME
      }
    )
  }
  identity = @{
    type = "UserAssigned"
    userAssignedIdentities = @{
      $IDENTITY_RESOURCE_ID = @{}
    }
  }
} | ConvertTo-Json -Depth 10

# Update Azure Data Manager for Energy instance with managed identity
$response = Invoke-RestMethod `
  -Method Put `
  -Uri "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME?api-version=2025-09-22-preview" `
  -Headers @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
  } `
  -Body $body

$response | ConvertTo-Json -Depth 10
```

---

### Verify the identity assignment

After the operation completes, verify the identity is assigned:

# [Bash](#tab/bash)

```bash
az resource show \
  --ids /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME \
  --query identity.userAssignedIdentities
```

# [PowerShell](#tab/powershell)

```powershell
az resource show `
  --ids /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME `
  --query identity.userAssignedIdentities
```

---

**Sample response:**

```json
{
  "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/my-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-acz-identity": {
    "clientId": "abcd1234-ab12-cd34-ef56-abcdef123456",
    "principalId": "98765432-9876-5432-1098-987654321098"
  }
}
```

The output should include your user-assigned managed identity's resource ID with its `clientId` and `principalId`.

## Step 3: Verify the user has entitlement group access

To call ACZ APIs, you (the user) must be a member of the `users@{data-partition-id}.dataservices.energy` entitlement group.

> [!IMPORTANT]
> This step verifies that YOU (the user calling ACZ APIs) have access, not the user-assigned managed identity. The user-assigned managed identity created in Step 1 is only used by the ACZ service to write data to storage—it doesn't need entitlement group membership.

If you're not already a member of the users entitlement group, have an Azure Data Manager for Energy administrator add your user account. See [How to manage users](how-to-manage-users.md) for detailed instructions.

### Initialize variables

# [Bash](#tab/bash)

```bash
# Set your Azure Data Manager for Energy instance details
BASE_URL="<your-adme-instance>.energy.azure.com"  # e.g., "myinstance.energy.azure.com"
DATA_PARTITION_ID="<your-data-partition-id>"  # e.g., "dp1"

# Get access token for Azure Data Manager for Energy APIs
# See https://learn.microsoft.com/azure/energy-data-services/how-to-generate-auth-token
ACCESS_TOKEN="<your-access-token>"

echo "Configuration:"
echo "  Base URL: $BASE_URL"
echo "  Data Partition: $DATA_PARTITION_ID"
```

# [PowerShell](#tab/powershell)

```powershell
# Set your Azure Data Manager for Energy instance details
$BASE_URL = "<your-adme-instance>.energy.azure.com"  # e.g., "myinstance.energy.azure.com"
$DATA_PARTITION_ID = "<your-data-partition-id>"  # e.g., "dp1"

# Get access token for Azure Data Manager for Energy APIs
# See https://learn.microsoft.com/azure/energy-data-services/how-to-generate-auth-token
$ACCESS_TOKEN = "<your-access-token>"

Write-Host "Configuration:"
Write-Host "  Base URL: $BASE_URL"
Write-Host "  Data Partition: $DATA_PARTITION_ID"
```

---

### Verify entitlement group membership

Use the Entitlements Service API to verify your membership:

# [Bash](#tab/bash)

```bash
curl --request GET \
  --url "https://$BASE_URL/api/entitlements/v2/groups/users@$DATA_PARTITION_ID.dataservices.energy/members" \
  --header "Authorization: Bearer $ACCESS_TOKEN" \
  --header "data-partition-id: $DATA_PARTITION_ID"
```

# [PowerShell](#tab/powershell)

```powershell
$response = Invoke-RestMethod `
  -Method Get `
  -Uri "https://$BASE_URL/api/entitlements/v2/groups/users@$DATA_PARTITION_ID.dataservices.energy/members" `
  -Headers @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
    "data-partition-id" = $DATA_PARTITION_ID
  }

$response | ConvertTo-Json -Depth 10
```

---

**Sample response:**

```json
{
  "desId": "users@dp1.dataservices.energy",
  "name": "users@dp1.dataservices.energy",
  "description": "Datalake users",
  "email": "users@dp1.dataservices.energy",
  "members": [
    {
      "email": "user@example.com",
      "role": "MEMBER"
    },
    {
      "email": "admin@example.com",
      "role": "OWNER"
    }
  ]
}
```

The response should include your user account in the `members` array. If you're not listed, contact your Azure Data Manager for Energy administrator to add you to the users group.

## Step 4: Create or use an existing ADLS Gen2 storage account

ACZ requires an Azure Data Lake Storage Gen2 storage account with hierarchical namespace enabled to store the synchronized data. If you don't already have one, create it:

1. In the [Azure portal](https://portal.azure.com/), select **Create a resource** > **Storage account**.
2. On the **Basics** tab, select your subscription and resource group.
3. Enter a storage account name and select your preferred region.
4. On the **Advanced** tab, select **Enable hierarchical namespace**.
5. Select **Review + create**, then select **Create**.

> [!IMPORTANT]
> You're responsible for selecting an in-geo destination storage account if you have data residency requirements. ACZ exports data to the ADLS Gen2 storage account you specify, regardless of location.

## Step 5: Grant the user-assigned managed identity permissions on the ADLS Gen2 container

Grant the user-assigned managed identity write access to the ADLS Gen2 storage account. The ACZ identity needs Storage Blob Data Contributor permissions to write Delta Parquet files.

1. Navigate to your ADLS Gen2 storage account in the [Azure portal](https://portal.azure.com/).
2. Select **Access control (IAM)** from the left menu.
3. Select **+ Add** > **Add role assignment**.
4. On the **Role** tab, search for **Storage Blob Data Contributor**, select it, then select **Next**.
5. On the **Members** tab, select **Managed identity** for **Assign access to**.
6. Select **+ Select members**.
7. In the **Managed identity** dropdown, select **User-assigned managed identity**.
8. Select the user-assigned managed identity you created in Step 2 (or your existing CMEK/EDS identity), then select **Select**.
9. Select **Review + assign** to complete the role assignment.

## Step 6: Share user-assigned managed identity and Azure Data Manager for Energy instance details with Microsoft (Preview requirement)

> [!IMPORTANT]
> During the preview, ACZ access requires allowlisting. Microsoft must enable the ACZ capability on your Azure Data Manager for Energy instance and configure it with your user-assigned managed identity. Share the following details with your Microsoft contact to complete the ACZ enablement.

Provide the following information to your Microsoft representative:

| Information | Description |
|---|---|
| **Azure Data Manager for Energy resource name** | Your Azure Data Manager for Energy resource name (for example, `my-adme-instance`). |
| **User-assigned managed identity Resource ID** | The full Azure Resource ID of the user-assigned managed identity. In the Azure portal, go to your user-assigned managed identity and select **Settings** > **Properties** to find the **Resource ID** (for example, `/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identity-name}`). |

After Microsoft adds your user-assigned managed identity to the allow list, ACZ is enabled on your Azure Data Manager for Energy resource.

## Create an Analytics Consumption Zone

After completing the enablement steps, you can create one or more ACZs to sync your Azure Data Manager for Energy data to ADLS Gen2. Each ACZ can be configured to sync different data types.

### Call the ACZ Create API

Use the ACZ Create API to create an Analytics Consumption Zone. For a full walkthrough, see [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md).

#### Initialize variables

# [Bash](#tab/bash)

```bash
# Set your Azure Data Manager for Energy instance details (reuse from Step 4 if in same session)
BASE_URL="<your-adme-instance>.energy.azure.com"  # e.g., "myinstance.energy.azure.com"
DATA_PARTITION_ID="<your-data-partition-id>"  # e.g., "dp1"
ACCESS_TOKEN="<your-access-token>"

# Set storage account details
STORAGE_SUBSCRIPTION_ID="<storage-subscription-id>"
STORAGE_RESOURCE_GROUP="<storage-resource-group>"
STORAGE_ACCOUNT_NAME="<storage-account-name>"

# Construct storage resource ID
STORAGE_RESOURCE_ID="/subscriptions/$STORAGE_SUBSCRIPTION_ID/resourceGroups/$STORAGE_RESOURCE_GROUP/providers/Microsoft.Storage/storageAccounts/$STORAGE_ACCOUNT_NAME"

echo "Configuration:"
echo "  ADME Base URL: $BASE_URL"
echo "  Data Partition: $DATA_PARTITION_ID"
echo "  Storage Account: $STORAGE_RESOURCE_ID"
```

# [PowerShell](#tab/powershell)

```powershell
# Set your Azure Data Manager for Energy instance details (reuse from Step 4 if in same session)
$BASE_URL = "<your-adme-instance>.energy.azure.com"  # e.g., "myinstance.energy.azure.com"
$DATA_PARTITION_ID = "<your-data-partition-id>"  # e.g., "dp1"
$ACCESS_TOKEN = "<your-access-token>"

# Set storage account details
$STORAGE_SUBSCRIPTION_ID = "<storage-subscription-id>"
$STORAGE_RESOURCE_GROUP = "<storage-resource-group>"
$STORAGE_ACCOUNT_NAME = "<storage-account-name>"

# Construct storage resource ID
$STORAGE_RESOURCE_ID = "/subscriptions/$STORAGE_SUBSCRIPTION_ID/resourceGroups/$STORAGE_RESOURCE_GROUP/providers/Microsoft.Storage/storageAccounts/$STORAGE_ACCOUNT_NAME"

Write-Host "Configuration:"
Write-Host "  ADME Base URL: $BASE_URL"
Write-Host "  Data Partition: $DATA_PARTITION_ID"
Write-Host "  Storage Account: $STORAGE_RESOURCE_ID"
```

---

#### Create the ACZ

# [Bash](#tab/bash)

```bash
curl --request POST \
  --url "https://$BASE_URL/api/acz/v1/aczs" \
  --header "Authorization: Bearer $ACCESS_TOKEN" \
  --header "Content-Type: application/json" \
  --header "data-partition-id: $DATA_PARTITION_ID" \
  --data "{
    \"name\": \"my-first-acz\",
    \"sink\": {
      \"storageId\": \"$STORAGE_RESOURCE_ID\"
    },
    \"configuration\": {
      \"catalogKinds\": [
        \"osdu:wks:master-data--Well:*\",
        \"osdu:wks:reference-data--UnitOfMeasure:*\"
      ],
      \"wellboreDDMSKinds\": [
        \"osdu:wks:work-product-component--WellLog:*\"
      ]
    }
  }"
```

# [PowerShell](#tab/powershell)

```powershell
# Build the request body
$body = @{
  name = "my-first-acz"
  sink = @{
    storageId = $STORAGE_RESOURCE_ID
  }
  configuration = @{
    catalogKinds = @(
      "osdu:wks:master-data--Well:*",
      "osdu:wks:reference-data--UnitOfMeasure:*"
    )
    wellboreDDMSKinds = @(
      "osdu:wks:work-product-component--WellLog:*"
    )
  }
} | ConvertTo-Json -Depth 10

# Create the ACZ
$response = Invoke-RestMethod `
  -Method Post `
  -Uri "https://$BASE_URL/api/acz/v1/aczs" `
  -Headers @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
    "Content-Type" = "application/json"
    "data-partition-id" = $DATA_PARTITION_ID
  } `
  -Body $body

$response | ConvertTo-Json -Depth 10
```

---

A successful response returns HTTP status `201` with the ACZ details:

```json
{
  "aczId": "acz-8a0aa7433085",
  "name": "my-first-acz",
  "status": "ACTIVE",
  "targetFormat": "DELTA_PARQUET",
  "aczType": "LATEST_VERSION",
  "sink": {
    "storageType": "microsoft.storage/storageaccounts",
    "storageId": "/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}",
    "basePath": ""
  },
  "configuration": {
    "catalogKinds": [
      "osdu:wks:master-data--Well:*",
      "osdu:wks:reference-data--UnitOfMeasure:*"
    ],
    "wellboreDDMSKinds": [
      "osdu:wks:work-product-component--WellLog:*"
    ]
  },
  "historicalSnapshotStatus": "PROCESSING",
  "createdTs": "2026-05-01T12:00:00.000000",
  "updatedTs": "2026-05-01T12:00:00.000000",
  "createdBy": "your-user-object-id"
}
```

Note the `aczId` value (format: `acz-<identifier>`). You need this ACZ identifier to:
- Manage and query the ACZ using APIs
- Locate your data in ADLS Gen2 storage at `<container>/<aczId>/` or `<container>/<basePath>/<aczId>/` if you specified a base path

## Related content

- [Tutorial: Use ACZ APIs](tutorial-analytics-consumption-zone-apis.md)
- [Connect ACZ data to Microsoft Fabric](how-to-connect-analytics-consumption-zone-to-fabric.md)
- [Connect ACZ data to Azure Databricks](how-to-connect-analytics-consumption-zone-to-databricks.md)
- [Analytics Consumption Zone concepts](concepts-analytics-consumption-zone.md)

