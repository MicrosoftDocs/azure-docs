
```bash

#!/bin/bash
set -e

SUBSCRIPTION_ID="${SUBSCRIPTION_ID:?SUBSCRIPTION_ID must be set}"
SERVICE_PRINCIPAL_ID="${SERVICE_PRINCIPAL_ID:?SERVICE_PRINCIPAL_ID must be set}"
SERVICE_PRINCIPAL_SECRET="${SERVICE_PRINCIPAL_SECRET:?SERVICE_PRINCIPAL_SECRET must be set}"
RESOURCE_GROUP="${RESOURCE_GROUP:?RESOURCE_GROUP must be set}"
TENANT_ID="${TENANT_ID:?TENANT_ID must be set}"
LOCATION="${LOCATION:?LOCATION must be set}"
DCR_NAME=${DCR_NAME:-${RESOURCE_GROUP}-syslog-dcr}
POLICY_NAME=${POLICY_NAME:-${DCR_NAME}-policy}

az login --service-principal -u "${SERVICE_PRINCIPAL_ID}" -p "${SERVICE_PRINCIPAL_SECRET}" -t "${TENANT_ID}"

az account set -s "${SUBSCRIPTION_ID}"

DCR=$(az monitor data-collection rule show --name "${DCR_NAME}" --resource-group "${RESOURCE_GROUP}" -o tsv --query id)

PRINCIPAL=$(az policy assignment create \
  --name "${POLICY_NAME}" \
  --display-name "${POLICY_NAME}" \
  --resource-group "${RESOURCE_GROUP}" \
  --location "${LOCATION}" \
  --policy "d5c37ce1-5f52-4523-b949-f19bf945b73a" \
  --assign-identity \
  -p "{\"dcrResourceId\":{\"value\":\"${DCR}\"}}" \
  -o tsv --query identity.principalId)

required_roles=$(az policy definition show -n "d5c37ce1-5f52-4523-b949-f19bf945b73a" --query policyRule.then.details.roleDefinitionIds -o tsv)
for roleId in $(echo "$required_roles"); do
  az role assignment create \
    --role "${roleId##*/}" \
    --assignee-object-id "${PRINCIPAL}" \
    --assignee-principal-type "ServicePrincipal" \
    --scope /subscriptions/"$SUBSCRIPTION_ID"/resourceGroups/"$RESOURCE_GROUP"
done
```
