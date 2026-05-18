#!/bin/bash
set -e

# Attach a user-assigned managed identity to an Azure Data Manager for Energy instance

echo "Enter Subscription ID: "
read SUBSCRIPTION_ID

echo "Enter Azure Data Manager for Energy Instance Name: "
read ADME_INSTANCE_NAME

echo "Enter Managed Identity Name: "
read MANAGED_IDENTITY_NAME

echo "Attaching managed identity to Azure Data Manager for Energy instance..."

# Set subscription
az account set --subscription "$SUBSCRIPTION_ID" > /dev/null

# Get Azure Data Manager for Energy instance resource group
RESOURCE_GROUP=$(az resource list --resource-type "Microsoft.OpenEnergyPlatform/energyServices" --subscription "$SUBSCRIPTION_ID" --query "[?name=='$ADME_INSTANCE_NAME'].resourceGroup" -o tsv | tr -d '\r')

if [ -z "$RESOURCE_GROUP" ]; then
    echo "Error: Azure Data Manager for Energy instance '$ADME_INSTANCE_NAME' not found"
    exit 1
fi

# Get instance details using Azure CLI queries
LOCATION=$(az resource show --ids "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME" --api-version 2025-09-22-preview --query location -o tsv | tr -d '\r')
AUTH_APP_ID=$(az resource show --ids "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME" --api-version 2025-09-22-preview --query properties.authAppId -o tsv | tr -d '\r')
DATA_PARTITION_NAME=$(az resource show --ids "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME" --api-version 2025-09-22-preview --query 'properties.dataPartitionNames[0].name' -o tsv | tr -d '\r')

# Get managed identity resource ID (search in same resource group as ADME)
MI_ID=$(az identity list --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION_ID" --query "[?name=='$MANAGED_IDENTITY_NAME'].id" -o tsv | tr -d '\r')

if [ -z "$MI_ID" ]; then
    echo "Error: Managed identity '$MANAGED_IDENTITY_NAME' not found in resource group '$RESOURCE_GROUP'"
    exit 1
fi

# Get existing identities to preserve them
EXISTING_IDS=$(az resource show --ids "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.OpenEnergyPlatform/energyServices/$ADME_INSTANCE_NAME" --api-version 2025-09-22-preview --query 'identity.userAssignedIdentities | keys(@)' -o tsv 2>/dev/null | tr -d '\r')

# Build user-assigned identities JSON (preserve existing)
USER_ASSIGNED_IDENTITIES="\"$MI_ID\": {}"

if [ -n "$EXISTING_IDS" ]; then
    for identity in $EXISTING_IDS; do
        if [ "$identity" != "$MI_ID" ]; then
            USER_ASSIGNED_IDENTITIES="$USER_ASSIGNED_IDENTITIES, \"$identity\": {}"
        fi
    done
fi

# Get ARM token
TOKEN=$(az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv | tr -d '\r')

# Update Azure Data Manager for Energy instance
RESPONSE=$(curl --fail --silent --show-error --request PUT \
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
        $USER_ASSIGNED_IDENTITIES
      }
    }
  }")

if [ $? -eq 0 ]; then
    echo "Successfully attached managed identity to Azure Data Manager for Energy instance"
else
    echo "Error: Failed to attach managed identity"
    exit 1
fi
