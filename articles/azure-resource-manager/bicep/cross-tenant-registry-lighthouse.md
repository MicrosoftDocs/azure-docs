---
title: Use a Bicep module registry across tenants with Azure Lighthouse
description: Learn how to use Azure Lighthouse to give a service principal in one tenant pull access to a Bicep module registry hosted in a different tenant.
ms.topic: how-to
ms.custom: devx-track-bicep
ms.date: 07/14/2026
---

# Use a Bicep module registry across tenants with Azure Lighthouse

When you host a [private Bicep module registry](./private-module-registry.md) in one Azure tenant and want to consume those modules in deployments targeting a different tenant, you need a way for the deploying identity to authenticate to the Azure Container Registry (ACR) in the source tenant. Azure Lighthouse lets you grant a principal from one tenant access to resources in another, which solves this problem without maintaining separate credentials.

This article describes how to:

- Understand why cross-tenant registry access requires Lighthouse
- Create and deploy a Lighthouse delegation that grants AcrPull to the deploying identity
- Configure an Azure DevOps pipeline that deploys from a cross-tenant registry

## Why Lighthouse solves cross-tenant registry access

When Bicep compiles a file that references a module stored in a registry (for example, `br:myregistry.azurecr.io/modules/storage:v1`), it restores the module before deployment. The restore step authenticates to the ACR using the credentials of the tool you're running, Azure CLI or Azure PowerShell, based on the [`credentialPrecedence` setting](./bicep-config-modules.md#configure-profiles-and-credentials) in `bicepconfig.json`.

When the deployment target is in tenant B but the registry is in tenant A, the deploying identity needs:

- **AcrPull** on the ACR in tenant A (to restore modules during compilation)
- **Deployment permissions** in tenant B (to deploy the compiled resources)

A single service principal can't natively hold roles across two unrelated tenants. Azure Lighthouse solves this problem by projecting a principal from tenant B into tenant A, so you can assign roles in tenant A to that principal without managing it in tenant A's directory.

## How Azure Lighthouse delegation works

A Lighthouse delegation consists of two resources:

|                      Resource                       |     Scope      |                                 Purpose                                 |
| --------------------------------------------------- | -------------- | ----------------------------------------------------------------------- |
| `Microsoft.ManagedServices/registrationDefinitions` | Subscription   | Declares the offer: which tenant manages what, and which roles to grant |
| `Microsoft.ManagedServices/registrationAssignments` | Resource group | Applies the delegation to a specific resource group                     |

You deploy both resources to **tenant A**, the tenant that owns the ACR. The delegation grants the principal in **tenant B** the `AcrPull` role on the resource group containing the ACR.

## Prerequisites

- An ACR in **tenant A** that hosts your Bicep modules.
- A service principal or managed identity in **tenant B** that runs your deployments (for example, an Azure DevOps service connection).
- The **object ID** of the principal in **tenant B**'s directory. Lighthouse takes the principal ID from the managing tenant (tenant B) and projects it into tenant A.
- **Contributor** or **Owner** permissions, or a custom role with `Microsoft.Authorization/roleAssignments/write`, `Microsoft.Authorization/roleAssignments/delete`, and `Microsoft.Authorization/roleAssignments/read`, on the subscription in tenant A where the ACR resides.

## Step 1: Deploy the Lighthouse delegation to tenant A

The delegation needs two Bicep files. Deploy the main file at subscription scope in tenant A. The assignment module targets the resource group where your ACR resides.

### Main delegation file

```bicep
targetScope = 'subscription'

@description('A unique name for this Lighthouse offer.')
param mspOfferName string = 'bicepAcrDelegation'

@description('A description for this Lighthouse offer.')
param mspOfferDescription string = 'Grants AcrPull to the deploying tenant for Bicep module restore.'

@description('The tenant ID of the managing tenant (tenant B - the deploying tenant).')
param managedByTenantId string // Enter the tenant B GUID

@description('Principals in tenant B to receive AcrPull in tenant A.')
param authorizations array // Example: [{principalId:'<object-id-in-tenant-B>', roleDefinitionId:'7f951dda-4ed3-4680-a7ca-43fe172d538d', principalIdDisplayName:'Bicep registry deployer'}]

@description('The resource group in tenant A that contains the ACR.')
param rgName string = 'bicep-registry-rg'

var registrationName = guid(mspOfferName, 'definition')
var assignmentName = guid(mspOfferName, 'assignment')

resource acrDelegationDefinition 'Microsoft.ManagedServices/registrationDefinitions@2022-10-01' = {
  name: registrationName
  properties: {
    registrationDefinitionName: mspOfferName
    description: mspOfferDescription
    managedByTenantId: managedByTenantId
    authorizations: authorizations
  }
}

module acrDelegationAssignment './acrDelegationAssignment.bicep' = {
  name: assignmentName
  scope: resourceGroup(rgName)
  params: {
    acrDefinitionResourceId: acrDelegationDefinition.id
    assignmentName: assignmentName
  }
}

output mspOfferName string = 'Managed by ${mspOfferName}'
output authorizations array = authorizations
```

### Assignment module (acrDelegationAssignment.bicep)

Save this file alongside the main file as `acrDelegationAssignment.bicep`:

```bicep
targetScope = 'resourceGroup'

param acrDefinitionResourceId string
param assignmentName string

resource acrDelegationAssignment 'Microsoft.ManagedServices/registrationAssignments@2022-10-01' = {
  name: assignmentName
  properties: {
    registrationDefinitionId: acrDefinitionResourceId
  }
}
```

### Deploy to tenant A

The deploying account must have the appropriate permissions on the subscription in tenant A. Authenticate to tenant A by using the Azure CLI, and then deploy at subscription scope. The assignment module automatically scopes itself down to the resource group:

```azurecli
az login --tenant <tenant-A-id>

az deployment sub create \
  --location eastus \
  --subscription <tenant-A-subscription-id> \
  --template-file main.bicep \
  --parameters managedByTenantId='<tenant-B-id>' \
               authorizations='[{"principalId":"<object-id-from-tenant-B>","roleDefinitionId":"7f951dda-4ed3-4680-a7ca-43fe172d538d","principalIdDisplayName":"Bicep registry deployer"}]'
```

You only need to deploy this delegation once. After it's in place, you don't need to touch tenant A again for subsequent module deployments.

## Step 2: Configure bicepconfig.json

In your Bicep project, configure `bicepconfig.json` to define the registry alias and set the credential provider. When you're using Azure CLI in a pipeline, set `credentialPrecedence` to `["AzureCLI"]`:

```json
{
  "moduleAliases": {
    "br": {
      "RegistryAlias": {
        "registry": "myregistry.azurecr.io",
        "modulePath": "bicep/modules"
      }
    }
  },
  "cloud": {
    "credentialPrecedence": [
      "AzureCLI"
    ]
  }
}
```

With this configuration, Bicep uses the Azure CLI token cache when restoring modules, the same token used by the `az deployment` command in your pipeline. Because the Lighthouse delegation grants AcrPull to the service principal in tenant B, that token now has access to the ACR in tenant A.

## Step 3: Configure your Azure DevOps pipeline

Use the service connection that targets **tenant B** for both tasks. No separate login step for tenant A is needed, the Lighthouse delegation handles the cross-tenant access transparently.

```yaml
trigger: none

pool:
  vmImage: ubuntu-latest

jobs:
- job: Deploy
  steps:
  - task: AzureCLI@2
    displayName: Upgrade Bicep CLI
    inputs:
      azureSubscription: 'my-tenant-b-service-connection'
      scriptType: bash
      scriptLocation: inlineScript
      inlineScript: az bicep upgrade

  - task: AzureCLI@2
    displayName: Deploy Bicep template
    inputs:
      azureSubscription: 'my-tenant-b-service-connection'
      scriptType: bash
      scriptLocation: inlineScript
      inlineScript: |
        az deployment group create \
          --name $(Build.BuildNumber) \
          --resource-group my-target-rg \
          --template-file main.bicep
```

The `az deployment group create` command:

- Compiles `main.bicep`, which triggers module restore from the ACR in tenant A using the Azure CLI token (permitted by the Lighthouse delegation)
- Deploys the resulting ARM template to the resource group in tenant B

## Verify the delegation is working

If the Lighthouse delegation isn't in place or is revoked, you might encounter a similar error:

```output
ERROR: /home/runner/work/main.bicep(6,13) : Error BCP192: Unable to restore the module with reference
"br:myregistry.azurecr.io/bicep/modules/storage:v1": Unhandled exception:
Azure.RequestFailedException: Service request failed.
```

This error means the token used during compilation doesn't have AcrPull on the registry. Verify that:

- The Lighthouse registration definition and assignment were deployed successfully to tenant A.
- The `principalId` in the delegation matches the object ID of the service principal used by your pipeline's service connection.
- The `credentialPrecedence` in `bicepconfig.json` includes `"AzureCLI"` (or `"AzurePowerShell"` if you're using PowerShell).

## Related content

- [Create a private Bicep module registry](./private-module-registry.md)
- [Configure module credentials in bicepconfig.json](./bicep-config-modules.md#configure-profiles-and-credentials)
- [Azure Lighthouse overview](/azure/lighthouse/overview)
- [Azure Lighthouse sample templates](/azure/lighthouse/samples/)
