---
title: Using managed identities with GeoCatalog resource
description: Learn how to add, update, or remove a user-assigned managed identity for a Microsoft Planetary Computer Pro GeoCatalog resource.
author: jglixon
ms.topic: how-to
ms.service: planetary-computer-pro
ms.date: 05/29/2026
ms.author: jglixon
---

# Using managed identities with GeoCatalog resource

This article shows you how to add, update, or remove a user-assigned managed identity for a GeoCatalog resource using the Azure CLI or Azure SDKs.

## Prerequisites

- Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
- An existing [GeoCatalog resource](./deploy-geocatalog-resource.md)
- [Azure CLI](/cli/azure/install-azure-cli) installed
- Authenticated to Azure via `az login`. The GeoCatalog control plane API requires [Azure Active Directory OAuth2 authentication](/rest/api/planetarycomputer/resource-manager/geocatalogs/update) with the `user_impersonation` scope. The Azure CLI handles this automatically after sign-in.

## When to use managed identities

[Managed identities](/entra/identity/managed-identities-azure-resources/overview) are the recommended authentication method for applications running on Azure that need to access your GeoCatalog. They eliminate the need to manage credentials (secrets or certificates) in code or configuration.

| Scenario | Recommended approach |
|----------|---------------------|
| App running on Azure (VM, App Service, Functions, Container Apps) | [**User-assigned managed identity**](/entra/identity/managed-identities-azure-resources/overview) (this article) |
| App running outside Azure (on-premises, other cloud) | [Service principal via app registration](/entra/identity-platform/quickstart-register-app) — see [setup guide](./application-authentication.md#applications-not-running-on-azure) |
| User accessing via Explorer, QGIS, or portal | [Delegated access (OAuth2 user_impersonation)](./application-authentication.md#delegated-access) |
| CLI/SDK scripting with user credentials | [`az login`](/cli/azure/authenticate-azure-cli) with [RBAC role assignment](./manage-access.md) |

For token acquisition in application code, use the [Azure Identity client library](/python/api/overview/azure/identity-readme). For a complete guide to all authentication options, see [Configure application authentication](./application-authentication.md).

## Add or update a user-assigned managed identity

Use the `PATCH` method to add or update a managed identity on an existing GeoCatalog resource. `PATCH` performs a partial update, modifying only the identity configuration without affecting other resource properties.

# [PowerShell](#tab/powershell)

```powershell
# Define variables (Replace these with your specific values)
$SUBSCRIPTION_ID = "{your-subscription-id}" # <-- Modify this line
$RESOURCE_GROUP = "{your-resource-group}" # <-- Modify this line
$GEOCATALOG_NAME = "{your-geocatalog-name}" # <-- Modify this line
$IDENTITY_NAME = "{your-identity-name}" # <-- Modify this line

# Construct the user-assigned identity URI
$USER_ASSIGNED_IDENTITY = "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$IDENTITY_NAME"

# Add or update the managed identity on the GeoCatalog
az rest --method PATCH `
  --uri "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/${GEOCATALOG_NAME}?api-version=2026-04-15" `
  --headers "Content-Type=application/json" `
  --body "{'identity': {'type': 'UserAssigned', 'userAssignedIdentities': {'$USER_ASSIGNED_IDENTITY': {}}}}"
```

# [Bash](#tab/bash)

```bash
# Define variables (Replace these with your specific values)
export SUBSCRIPTION_ID="{your-subscription-id}"  # <-- Modify this line
export RESOURCE_GROUP="{your-resource-group}"  # <-- Modify this line
export GEOCATALOG_NAME="{your-geocatalog-name}"  # <-- Modify this line
export USER_ASSIGNED_IDENTITY_NAME="{your-identity-name}"  # <-- Modify this line

# Construct the user-assigned identity URI
export USER_ASSIGNED_IDENTITY="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$USER_ASSIGNED_IDENTITY_NAME"

# Define the identity payload
PROPERTIES=$(cat <<EOF
{
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "$USER_ASSIGNED_IDENTITY": {}
    }
  }
}
EOF
)

# Add or update the managed identity on the GeoCatalog
az rest --method PATCH \
  --uri "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/$GEOCATALOG_NAME?api-version=2026-04-15" \
  --body "$PROPERTIES"
```

# [.NET](#tab/dotnet)

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

For more information, see the [Java SDK reference](/java/api/overview/azure/resourcemanager-planetarycomputer-readme).

# [JavaScript](#tab/javascript)

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

For more information, see the [Python SDK reference](/python/api/overview/azure/mgmt-planetarycomputer-readme).

# [Go](#tab/go)

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

## Remove a user-assigned managed identity

To remove a specific user-assigned managed identity from a GeoCatalog resource, set the identity value to `null` in the `userAssignedIdentities` map.

# [PowerShell](#tab/powershell)

```powershell
# Define variables (Replace these with your specific values)
$SUBSCRIPTION_ID = "{your-subscription-id}" # <-- Modify this line
$RESOURCE_GROUP = "{your-resource-group}" # <-- Modify this line
$GEOCATALOG_NAME = "{your-geocatalog-name}" # <-- Modify this line
$IDENTITY_NAME = "{your-identity-name}" # <-- Modify this line

# Construct the user-assigned identity URI
$USER_ASSIGNED_IDENTITY = "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$IDENTITY_NAME"

# Remove the specified identity from the GeoCatalog
az rest --method PATCH `
  --uri "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/${GEOCATALOG_NAME}?api-version=2026-04-15" `
  --headers "Content-Type=application/json" `
  --body "{'identity': {'type': 'UserAssigned', 'userAssignedIdentities': {'$USER_ASSIGNED_IDENTITY': null}}}"
```

# [Bash](#tab/bash)

```bash
# Define variables (Replace these with your specific values)
export SUBSCRIPTION_ID="{your-subscription-id}"  # <-- Modify this line
export RESOURCE_GROUP="{your-resource-group}"  # <-- Modify this line
export GEOCATALOG_NAME="{your-geocatalog-name}"  # <-- Modify this line
export IDENTITY_NAME="{your-identity-name}"  # <-- Modify this line

# Construct the user-assigned identity URI
export USER_ASSIGNED_IDENTITY="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$IDENTITY_NAME"

# Define the body to remove the specified identity
PROPERTIES=$(cat <<EOF
{
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "$USER_ASSIGNED_IDENTITY": null
    }
  }
}
EOF
)

# Remove the specified identity from the GeoCatalog
az rest --method PATCH \
  --uri "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/$GEOCATALOG_NAME?api-version=2026-04-15" \
  --body "$PROPERTIES"
```

# [.NET](#tab/dotnet)

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
            [new ResourceIdentifier(userAssignedIdentityId)] = null
        }
    }
};

var operation = await geoCatalog.UpdateAsync(Azure.WaitUntil.Completed, patch);
Console.WriteLine("Managed identity removed successfully.");
```

For more information, see the [.NET SDK reference](/dotnet/api/azure.resourcemanager.planetarycomputer).

# [Java](#tab/java)

```java
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.resourcemanager.planetarycomputer.PlanetaryComputerManager;
import com.azure.resourcemanager.planetarycomputer.models.ManagedServiceIdentity;
import com.azure.resourcemanager.planetarycomputer.models.ManagedServiceIdentityType;

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
    .withIdentity(new ManagedServiceIdentity()
        .withType(ManagedServiceIdentityType.USER_ASSIGNED)
        .withUserAssignedIdentities(Map.of(userAssignedIdentityId, null)))
    .create();

System.out.println("Managed identity removed successfully.");
```

For more information, see the [Java SDK reference](/java/api/overview/azure/resourcemanager-planetarycomputer-readme).

# [JavaScript](#tab/javascript)

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
        [userAssignedIdentityId]: null
      }
    }
  }
);

console.log("Managed identity removed successfully.");
```

For more information, see the [JavaScript SDK reference](/javascript/api/@azure/arm-planetarycomputer).

# [Python](#tab/python)

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.planetarycomputer import PlanetaryComputerMgmtClient
from azure.mgmt.planetarycomputer.models import (
    GeoCatalogUpdate,
    ManagedServiceIdentity,
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
            user_assigned_identities={user_assigned_identity_id: None},
        ),
    ),
).result()

print("Managed identity removed successfully.")
```

For more information, see the [Python SDK reference](/python/api/overview/azure/mgmt-planetarycomputer-readme).

# [Go](#tab/go)

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
					userAssignedIdentityID: nil,
				},
			},
		}, nil)
	if err != nil {
		log.Fatalf("failed to remove identity: %v", err)
	}

	_, err = poller.PollUntilDone(context.Background(), nil)
	if err != nil {
		log.Fatalf("failed to complete: %v", err)
	}

	fmt.Println("Managed identity removed successfully.")
}
```

For more information, see the [Go SDK source](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/resourcemanager/planetarycomputer/armplanetarycomputer).

---

## Next steps

> [!div class="nextstepaction"]
> [Assign your managed identity the Storage Blob Data Reader role](./set-up-ingestion-credentials-managed-identity.md#assign-your-managed-identity-the-storage-blob-data-reader-role)

## Related content

- [Configure application authentication for Microsoft Planetary Computer Pro](./application-authentication.md)
- [Manage access for Microsoft Planetary Computer Pro](./manage-access.md)
- [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)
