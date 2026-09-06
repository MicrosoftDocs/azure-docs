---
title: 'Quickstart: Create and run an Azure Container Apps sandbox using the Python SDK (preview)'
description: Create a sandbox group, run a command in an Azure Container Apps sandbox, and clean up resources by using the Python SDK.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.topic: quickstart
ms.date: 08/21/2026
# customer intent: As a developer, I want to create an Azure Container Apps sandbox with the Python SDK so that I can automate isolated compute workflows from code.
---

# Quickstart: Create and run an Azure Container Apps sandbox using the Python SDK (preview)

In this quickstart, you use the Python SDK to provision a sandbox group, launch a sandbox, run a command, and clean up all created resources.

> [!IMPORTANT]
> Azure Container Apps Sandboxes are currently in preview. Sandboxes created during preview might not be compatible with future releases and might need to be recreated.


## Prerequisites

- An Azure subscription with permission to create resource groups.
- Azure CLI (`az`) installed and signed in.
- [uv](https://docs.astral.sh/uv/getting-started/installation/) with Python 3.13+.

## Set up your environment

Install the SDK, sign in to Azure, and write a `.env` file for the scripts in this quickstart.

#### [Bash](#tab/bash)

```bash
uv venv
uv pip install azure-containerapps-sandbox azure-mgmt-resource azure-mgmt-authorization

# Sign in so DefaultAzureCredential picks up your identity
az login

cat > .env <<EOF
AZURE_SUBSCRIPTION_ID=$(az account show --query id -o tsv)
AZURE_RESOURCE_GROUP=my-rg
AZURE_SANDBOX_GROUP=my-sandbox-group
AZURE_REGION=eastus2
AZURE_PRINCIPAL_ID=$(az ad signed-in-user show --query id -o tsv)
EOF
```

#### [PowerShell](#tab/powershell)

```powershell
uv venv
uv pip install azure-containerapps-sandbox azure-mgmt-resource azure-mgmt-authorization

# Sign in so DefaultAzureCredential picks up your identity
az login

@"
AZURE_SUBSCRIPTION_ID=$(az account show --query id -o tsv)
AZURE_RESOURCE_GROUP=my-rg
AZURE_SANDBOX_GROUP=my-sandbox-group
AZURE_REGION=eastus2
AZURE_PRINCIPAL_ID=$(az ad signed-in-user show --query id -o tsv)
"@ | Set-Content -Path .env -Encoding utf8NoBOM
```

---

Create the resource group and sandbox group, and grant yourself data-plane access. Save as `setup.py`:

```python
import os, uuid
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.authorization import AuthorizationManagementClient
from azure.containerapps.sandbox import SandboxGroupManagementClient

credential = DefaultAzureCredential()
sub = os.environ["AZURE_SUBSCRIPTION_ID"]
rg = os.environ["AZURE_RESOURCE_GROUP"]
group = os.environ["AZURE_SANDBOX_GROUP"]
region = os.environ["AZURE_REGION"]

ResourceManagementClient(credential, sub).resource_groups.create_or_update(
    rg, {"location": region},
)

SandboxGroupManagementClient(
    credential, subscription_id=sub, resource_group=rg,
).begin_create_group(group, location=region).result()

# Container Apps SandboxGroup Data Owner (built-in role)
ROLE_DEF_ID = "c24cf47c-5077-412d-a19c-45202126392c"
scope = f"/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.App/sandboxGroups/{group}"

AuthorizationManagementClient(credential, sub).role_assignments.create(
    scope=scope,
    role_assignment_name=str(uuid.uuid4()),
    parameters={
        "properties": {
            "roleDefinitionId": f"/subscriptions/{sub}/providers/Microsoft.Authorization/roleDefinitions/{ROLE_DEF_ID}",
            "principalId": os.environ["AZURE_PRINCIPAL_ID"],
            "principalType": "User",
        }
    },
)
print(f"Setup complete: rg={rg}, sandbox_group={group}, role granted.")
```

```bash
uv run --env-file .env python setup.py
```

Role assignments take 30 to 60 seconds to propagate. If `main.py` returns a 403, wait a minute and retry.

## Create and run a sandbox

Save as `main.py`:

```python
import os
from azure.identity import DefaultAzureCredential
from azure.containerapps.sandbox import SandboxGroupClient, endpoint_for_region

credential = DefaultAzureCredential()
client = SandboxGroupClient(
    endpoint_for_region(os.environ["AZURE_REGION"]), credential,
    subscription_id=os.environ["AZURE_SUBSCRIPTION_ID"],
    resource_group=os.environ["AZURE_RESOURCE_GROUP"],
    sandbox_group=os.environ["AZURE_SANDBOX_GROUP"],
)

# Create a sandbox
sandbox = client.begin_create_sandbox(disk="ubuntu").result()

# Run a command
result = sandbox.exec("echo 'Hello from Azure Container Apps Sandbox.'")
print(result.stdout)

# Clean up
sandbox.delete()
```

Run the script:

```bash
uv run --env-file .env python main.py
```

## Clean up resources

To delete the sandbox group and the resource group, save the following code as `teardown.py`:

```python
import os
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.containerapps.sandbox import SandboxGroupManagementClient

credential = DefaultAzureCredential()
sub = os.environ["AZURE_SUBSCRIPTION_ID"]
rg = os.environ["AZURE_RESOURCE_GROUP"]

SandboxGroupManagementClient(
    credential, subscription_id=sub, resource_group=rg,
).begin_delete_group(os.environ["AZURE_SANDBOX_GROUP"]).result()

ResourceManagementClient(credential, sub).resource_groups.begin_delete(rg).result()
print(f"Teardown complete: {rg} deleted.")
```

Run the cleanup script.

```bash
uv run --env-file .env python teardown.py
```

## Next steps

> [!div class="nextstepaction"]
> [Snapshots and state management for Azure Container Apps Sandboxes](sandboxes-snapshots-state-management.md)

