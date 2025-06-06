---
title: Assign Managed Identity to GeoCatalog in Microsoft Planetary Computer Pro via the CLI
description: Learn how to assign a User-assigned managed identity to a Microsoft Planetary Computer Pro GeoCatalog using either PowerShell or Bash.
author: prasadko
ms.topic: how-to
ms.service: planetary-computer-pro
ms.date: 04/24/2025
ms.author: prasadkomma
ms.custom:
  - build-2025
---

# Assign a user-assigned managed identity to a Microsoft Planetary Computer Pro GeoCatalog via the CLI

This guide shows how to use the [Azure Command Line Interface (CLI)](/cli/azure/) through the command terminal of your choice to assign a managed identity to a GeoCatalog resource.  

Select either PowerShell or Bash tab to assign the managed identity.

# [PowerShell](#tab/powershell)
## Use PowerShell to assign a user-assigned managed identity

```powershell
# Define variables (Replace these with your specific values)
# Subscription ID: Your Azure subscription ID
$SUBSCRIPTION_ID = "{your-subscription-id}" # <-- Modify this line

# Resource Group: The name of the resource group where the GeoCatalog will be updated
$RESOURCE_GROUP = "{your-resource-group}" # <-- Modify this line

# GeoCatalog Name: The name of the GeoCatalog
$GEOCATALOG_NAME = "{your-geocatalog-name}" # <-- Modify this line

# Location: The Azure region where the GeoCatalog will be located
$LOCATION = "{your-location}" # <-- Modify this line

# Identity Name: The name of the user-assigned managed identity
$IDENTITY_NAME = "{your-identity-name}" # <-- Modify this line

# Tier: The tier of the GeoCatalog
$TIER = "Basic"

# Construct the user-assigned identity URI
$USER_ASSIGNED_IDENTITY = "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$IDENTITY_NAME"

# Use the Azure CLI to create or update a GeoCatalog with the specified properties
az rest --method PUT `
  --uri "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/${GEOCATALOG_NAME}?api-version=2025-02-11-preview" `
  --headers "Content-Type=application/json" `
  --body "{'location': '$LOCATION', 'Properties': {'tier': '$TIER'}, 'identity': {'type': 'UserAssigned', 'userAssignedIdentities': {'$USER_ASSIGNED_IDENTITY': {}}}}"
```

### Save the script For PowerShell

1.  Save the script with a `.ps1` extension. For example, `assign_identity.ps1`.
1.  Open a text editor, for example, Notepad, or VS Code, and paste the script into the editor.
1.  Save the file with the `.ps1` extension.

### Replace the variables

1.  Open the saved script file in a text editor.
1.  Replace the placeholder values in the script with your specific values:
    *   `{your-subscription-id}`
    *   `{your-resource-group}`
    *   `{your-geocatalog-name}`
    *   `{your-location}`
    *   `{your-identity-name}`
1.  Ensure that you replace all instances of these placeholders with the actual values.

### Run the script

After saving the script and replacing the variables, run it using the following command:

```powershell
.\assign_identity.ps1
```

Once complete, proceed to the [Give a User-assigned Managed Identity read permissions to Azure Blob Storage](./set-up-ingestion-credentials-managed-identity.md#assign-your-managed-identity-the-storage-blob-data-reader-role) instructions. 

# [Bash](#tab/bash)

## Use a bash script to assign a user-assigned managed identity

```bash
# Define variables (Replace these with your specific values)
# Subscription ID: Your Azure subscription ID
export SUBSCRIPTION_ID="{your-subscription-id}"  # <-- Modify this line

# Resource Group: The name of the resource group where the GeoCatalog will be updated
export RESOURCE_GROUP="{your-resource-group}"  # <-- Modify this line

# GeoCatalog Name: The name of the GeoCatalog
export GEOCATALOG_NAME="{your-geocatalog-name}"  # <-- Modify this line

# Location: The Azure region where the GeoCatalog will be located
export LOCATION="{your-location}"  # <-- Modify this line

# Identity Name: The name of the user-assigned managed identity
export USER_ASSIGNED_IDENTITY_NAME="{your-identity-name}"  # <-- Modify this line

# Tier: The tier of the GeoCatalog
export TIER="Basic" 

# Construct the user-assigned identity URI
export USER_ASSIGNED_IDENTITY="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$USER_ASSIGNED_IDENTITY_NAME"

# Define the properties for the GeoCatalog
PROPERTIES=$(cat <<EOF
{
  "location": "$LOCATION",
  "Properties": {
    "tier": "$TIER"
  },
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "$USER_ASSIGNED_IDENTITY": {}
    }
  }
}
EOF
)

# Use the Azure CLI to create or update a geo catalog with the specified properties
az rest --method PUT \
  --uri "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/$GEOCATALOG_NAME?api-version=2025-02-11-preview" \
  --body "$PROPERTIES"
```

### Save the script for bash

1.  Save the script with a `.sh` extension. For example, `assign_identity.sh`.
1.  Open a text editor, for example, Notepad++, or VS Code, and paste the script into the editor.
1.  Save the file with the `.sh` extension.

### Replace the variables

1.  Open the saved script file in a text editor.
1.  Replace the placeholder values in the script with your specific values:
    *   `{your-subscription-id}`
    *   `{your-resource-group}`
    *   `{your-geocatalog-name}`
    *   `{your-location}`
    *   `{your-identity-name}`
1.  Ensure that you replace all instances of these placeholders with the actual values.

### Run the Bash script

1.  **Make the Script Executable:**  Use the `chmod` command to make the script executable:

    ```bash
    chmod +x assign_identity.sh
    ```

2.  **Execute the Script:** Run the script using the following command via WSL, or another Bash environment:

    ```bash
    ./assign_identity.sh
    ```


## Next steps
Once complete, proceed to assign managed identity to Storage Blob Data reader role. 

> [!div class="nextstepaction"]
> [Assign your managed identity the Storage Blob Data Reader role](./set-up-ingestion-credentials-managed-identity.md#assign-your-managed-identity-the-storage-blob-data-reader-role)

