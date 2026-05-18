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
az account set --subscription "$SUBSCRIPTION_ID"

# Get Azure Data Manager for Energy instance
ADME_JSON=$(az resource list --resource-type "Microsoft.OpenEnergyPlatform/energyServices" --name "$ADME_INSTANCE_NAME" --query "[0]" -o json)

if [ -z "$ADME_JSON" ] || [ "$ADME_JSON" = "null" ]; then
    echo "Error: Azure Data Manager for Energy instance '$ADME_INSTANCE_NAME' not found"
    exit 1
fi

RESOURCE_GROUP=$(echo "$ADME_JSON" | jq -r '.resourceGroup')
ADME_ID=$(echo "$ADME_JSON" | jq -r '.id')
LOCATION=$(echo "$ADME_JSON" | jq -r '.location' | tr -d '\r')
AUTH_APP_ID=$(echo "$ADME_JSON" | jq -r '.properties.authAppId' | tr -d '\r')
DATA_PARTITION_NAME=$(echo "$ADME_JSON" | jq -r '.properties.dataPartitionNames[0].name' | tr -d '\r')

# Get managed identity
MI_JSON=$(az identity list --query "[?name=='$MANAGED_IDENTITY_NAME']" -o json)
MI_ID=$(echo "$MI_JSON" | jq -r '.[0].id' | tr -d '\r')

if [ -z "$MI_ID" ] || [ "$MI_ID" = "null" ]; then
    echo "Error: Managed identity '$MANAGED_IDENTITY_NAME' not found"
    exit 1
fi

# Build user-assigned identities (preserve existing)
EXISTING_IDENTITIES=$(echo "$ADME_JSON" | jq -r '.identity.userAssignedIdentities | keys[]' 2>/dev/null | tr -d '\r')
USER_ASSIGNED_IDENTITIES="\"$MI_ID\": {}"

if [ -n "$EXISTING_IDENTITIES" ]; then
    for identity in $EXISTING_IDENTITIES; do
        if [ "$identity" != "$MI_ID" ]; then
            USER_ASSIGNED_IDENTITIES="$USER_ASSIGNED_IDENTITIES, \"$identity\": {}"
        fi
    done
fi

# Get ARM token
TOKEN=$(az account get-access-token --resource "https://management.azure.com/" --query accessToken -o tsv | tr -d '\r')

# Update Azure Data Manager for Energy instance
curl --request PUT \
  --url "https://management.azure.com${ADME_ID}?api-version=2025-09-22-preview" \
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
  }"

echo "Successfully attached managed identity to Azure Data Manager for Energy instance"
