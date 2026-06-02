---
title: Assign Managed Identity to GeoCatalog in Microsoft Planetary Computer Pro via the CLI
description: Learn how to assign a User-assigned managed identity to a Microsoft Planetary Computer Pro GeoCatalog using either PowerShell or Bash.
author: jglixon
ms.topic: how-to
ms.service: planetary-computer-pro
ms.date: 05/27/2026
ms.author: jglixon
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
  --uri "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/${GEOCATALOG_NAME}?api-version=2026-04-15" `
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
  --uri "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/$GEOCATALOG_NAME?api-version=2026-04-15" \
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

# [.NET](#tab/dotnet)
## Use the .NET SDK to assign a user-assigned managed identity

```csharp
using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.PlanetaryComputer;
using Azure.ResourceManager.PlanetaryComputer.Models;
using Azure.ResourceManager.Models;
using Azure.Core;

var client = new ArmClient(new DefaultAzureCredential());

string subscriptionId = "<your-subscription-id>";
string resourceGroupName = "<your-resource-group>";
string catalogName = "<your-geocatalog-name>";
string identityName = "<your-identity-name>";

var geoCatalogResourceId = PlanetaryComputerGeoCatalogResource.CreateResourceIdentifier(
    subscriptionId, resourceGroupName, catalogName);
var geoCatalog = client.GetPlanetaryComputerGeoCatalogResource(geoCatalogResourceId);

string userAssignedIdentityId =
    $"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}" +
    $"/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}";

var patch = new PlanetaryComputerGeoCatalogPatch
{
    Identity = new ManagedServiceIdentity(ManagedServiceIdentityType.UserAssigned)
    {
        UserAssignedIdentities =
        {
            [new ResourceIdentifier(userAssignedIdentityId)] = new UserAssignedIdentity()
        }
    }
};

var operation = await geoCatalog.UpdateAsync(Azure.WaitUntil.Completed, patch);
Console.WriteLine("Managed identity assigned successfully.");
```

For more information, see the [.NET SDK reference](/dotnet/api/azure.resourcemanager.planetarycomputer).

# [Java](#tab/java)
## Use the Java SDK to assign a user-assigned managed identity

```java
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.resourcemanager.planetarycomputer.PlanetaryComputerManager;
import com.azure.resourcemanager.planetarycomputer.models.ManagedServiceIdentity;
import com.azure.resourcemanager.planetarycomputer.models.ManagedServiceIdentityType;
import com.azure.resourcemanager.planetarycomputer.models.UserAssignedIdentity;
import com.azure.resourcemanager.planetarycomputer.models.GeoCatalogProperties;
import com.azure.resourcemanager.planetarycomputer.models.CatalogTier;

import java.util.Map;

PlanetaryComputerManager manager = PlanetaryComputerManager.authenticate(
    new DefaultAzureCredentialBuilder().build(),
    "<your-subscription-id>");

String userAssignedIdentityId =
    "/subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group>" +
    "/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<your-identity-name>";

manager.geoCatalogs()
    .define("<your-geocatalog-name>")
    .withRegion("<your-location>")
    .withExistingResourceGroup("<your-resource-group>")
    .withProperties(new GeoCatalogProperties().withTier(CatalogTier.BASIC))
    .withIdentity(new ManagedServiceIdentity()
        .withType(ManagedServiceIdentityType.USER_ASSIGNED)
        .withUserAssignedIdentities(Map.of(userAssignedIdentityId, new UserAssignedIdentity())))
    .create();

System.out.println("Managed identity assigned successfully.");
```

For more information, see the [Java SDK reference](/java/api/overview/azure/planetarycomputer-readme).

# [JavaScript](#tab/javascript)
## Use the JavaScript SDK to assign a user-assigned managed identity

```javascript
import { SpatioClient } from "@azure/arm-planetarycomputer";
import { DefaultAzureCredential } from "@azure/identity";

const subscriptionId = "<your-subscription-id>";
const resourceGroupName = "<your-resource-group>";
const catalogName = "<your-geocatalog-name>";
const identityName = "<your-identity-name>";

const credential = new DefaultAzureCredential();
const client = new SpatioClient(credential, subscriptionId);

const userAssignedIdentityId =
  `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}` +
  `/providers/Microsoft.ManagedIdentity/userAssignedIdentities/${identityName}`;

const result = await client.geoCatalogs.update(
  resourceGroupName,
  catalogName,
  {
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        [userAssignedIdentityId]: {}
      }
    }
  }
);

console.log("Managed identity assigned successfully.");
```

For more information, see the [JavaScript SDK reference](/javascript/api/@azure/arm-planetarycomputer).

# [Python](#tab/python)
## Use the Python SDK to assign a user-assigned managed identity

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.planetarycomputer import PlanetaryComputerMgmtClient
from azure.mgmt.planetarycomputer.models import (
    GeoCatalogUpdate,
    ManagedServiceIdentity,
    UserAssignedIdentity,
)

subscription_id = "<your-subscription-id>"
resource_group = "<your-resource-group>"
catalog_name = "<your-geocatalog-name>"
identity_name = "<your-identity-name>"

credential = DefaultAzureCredential()
client = PlanetaryComputerMgmtClient(credential=credential, subscription_id=subscription_id)

user_assigned_identity_id = (
    f"/subscriptions/{subscription_id}/resourceGroups/{resource_group}"
    f"/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identity_name}"
)

client.geo_catalogs.begin_update(
    resource_group_name=resource_group,
    catalog_name=catalog_name,
    properties=GeoCatalogUpdate(
        identity=ManagedServiceIdentity(
            type="UserAssigned",
            user_assigned_identities={user_assigned_identity_id: UserAssignedIdentity()},
        ),
    ),
).result()

print("Managed identity assigned successfully.")
```

For more information, see the [Python SDK reference](/python/api/azure-mgmt-planetarycomputer).

# [Go](#tab/go)
## Use the Go SDK to assign a user-assigned managed identity

```go
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/planetarycomputer/armplanetarycomputer"
)

func main() {
	subscriptionID := "<your-subscription-id>"
	resourceGroup := "<your-resource-group>"
	catalogName := "<your-geocatalog-name>"
	identityName := "<your-identity-name>"

	userAssignedIdentityID := fmt.Sprintf(
		"/subscriptions/%s/resourceGroups/%s/providers/Microsoft.ManagedIdentity/userAssignedIdentities/%s",
		subscriptionID, resourceGroup, identityName)

	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("failed to create credential: %v", err)
	}

	clientFactory, err := armplanetarycomputer.NewClientFactory(subscriptionID, cred, nil)
	if err != nil {
		log.Fatalf("failed to create client factory: %v", err)
	}

	client := clientFactory.NewGeoCatalogsClient()

	poller, err := client.BeginUpdate(context.Background(),
		resourceGroup, catalogName,
		armplanetarycomputer.GeoCatalogUpdate{
			Identity: &armplanetarycomputer.ManagedServiceIdentity{
				Type: to.Ptr(armplanetarycomputer.ManagedServiceIdentityTypeUserAssigned),
				UserAssignedIdentities: map[string]*armplanetarycomputer.UserAssignedIdentity{
					userAssignedIdentityID: {},
				},
			},
		}, nil)
	if err != nil {
		log.Fatalf("failed to assign identity: %v", err)
	}

	_, err = poller.PollUntilDone(context.Background(), nil)
	if err != nil {
		log.Fatalf("failed to complete: %v", err)
	}

	fmt.Println("Managed identity assigned successfully.")
}
```

For more information, see the [Go SDK source](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/resourcemanager/planetarycomputer/armplanetarycomputer).

---
Once complete, proceed to assign managed identity to Storage Blob Data reader role. 

> [!div class="nextstepaction"]
> [Assign your managed identity the Storage Blob Data Reader role](./set-up-ingestion-credentials-managed-identity.md#assign-your-managed-identity-the-storage-blob-data-reader-role)

