---
title: 'Preflight: Server-side validation before deployment'
description: Server‑side validation phase that runs after the template is submitted but before any resources are created or modified.
ms.topic: article
ms.date: 05/14/2026
---

# Preflight: Server validation before deployment

In Azure Resource Manager (ARM), server-side validation consists of two distinct parts:

- Static validation, which is the operation developers interact with.
- Resource provider preflight validation, which is the internal resource provider validation phase.

Static validation checks aspects of the template that ARM can evaluate without calling resource providers, such as:

- Template structure and schema correctness
- Parameter definitions and basic value constraints
- Expression evaluation and template consistency

These checks ensure the template is syntactically and structurally valid before deeper validation occurs.

Preflight validation is an Azure Resource Manager (ARM) internal process executed during the validation phase. Its purpose is to accelerate error detection by preventing deployments that are known to fail. During this step, ARM invokes the relevant resource providers to verify that the deployment is feasible, without creating or modifying any resources. This part validates:

- **Resource name conflicts**: During preflight, ARM evaluates the final, resolved resource names and checks whether they violate provider‑enforced uniqueness or naming rules. This check happens after expressions like `concat()` or `uniqueString()` are resolved. Preflight validation commonly fails when:

  - A globally unique name (for example, a storage account name) is already taken
  - A resource name violates provider‑specific naming constraints

- **Scope correctness**: Preflight validation ensures that resources are being deployed to a valid scope and that the deployment command matches the resource types declared in the template. This validation includes:

  - Whether the deployment scope (resource group, subscription, management group, tenant) is compatible with the resource types
  - Whether required parent scopes exist. For example, deploying a resource group–scoped resource at subscription scope without a resource group.

- RBAC permissions (whether you can deploy those resource types): During preflight, ARM verifies that the caller has sufficient permissions at the deployment scope to create or modify the requested resources. If the identity lacks permissions, the deployment is rejected before execution. Typical preflight permission failures include:

  - Missing write permissions for a resource type
  - Insufficient permissions at the target scope
  - Required resource providers not registered

- Basic provider and API compatibility: Preflight validation confirms that:

  - The referenced resource providers are registered
  - The specified API versions are valid and supported
  - The resource type is recognized by Azure Resource Manager

  If a provider isn't registered or the API version is invalid, ARM fails the deployment during preflight.

If any of these checks fail, the deployment never starts.

## Limitations

Preflight validation is a best-effort process and does not catch all deployment-time errors. It cannot detect runtime failures (for example, errors within a custom script extension during execution), and its validation may be incomplete when resources depend on values that are not yet available, such as dynamically generated properties from other resources.

### RBAC permissions inherited through management groups

When preflight validation runs for resources at tenant or management group scope, Azure Resource Manager evaluates permissions at the scope of the validation request. In some cases, ARM doesn't resolve the full management group ancestor chain during this evaluation. As a result, RBAC role assignments that are inherited through management group hierarchy might not be recognized during preflight, even though those same permissions are honored during the actual deployment.

This behavior can cause preflight to fail with an authorization error (HTTP 401 or 403) for identities that have sufficient permissions through management group inheritance. The actual deployment of the same template would succeed because the standard resource creation pipeline fully evaluates inherited permissions.

**Workaround**: Assign the required role (for example, Contributor or Owner) directly at the subscription or resource group scope rather than relying solely on management group–inherited permissions. Alternatively, use the `--validation-level Template` switch (Azure CLI 2.76.0+) or `-ValidationLevel Template` (Azure PowerShell 13.4.0+) with what-if and validate commands to skip preflight permission checks.

## Run preflight

Preflight validation runs automatically when you use deployment validate or what-if style commands. For example, these operations run preflight validation:

- ARM JSON or Bicep validation in Azure CLI or PowerShell

  ### [Azure CLI](#tab/azure-cli)
  
  ```azurecli
  az deployment group validate \
    --resource-group myResourceGroup \
    --template-file main.bicep
  ```
  
  ### [PowerShell](#tab/azure-powershell)
  
  ```azurepowershell
  Test-AzResourceGroupDeployment `
    -ResourceGroupName myResourceGroup `
    -TemplateFile ./main.bicep
  ```

  For more information, see [Deploy Bicep files with the Azure CLI](./deploy-cli.md) and [Deploy Bicep files with the Azure PowerShell](./deploy-powershell.md).

- Azure portal **Review + create** step

  Currently, the Azure portal only supports deploying ARM JSON templates. For more information, see [Deploy ARM templates with the Azure portal](../templates/deploy-portal.md).

- What-if

  What-if includes preflight checks before calculating changes unless you configure it to skip the preflight. For more information, see [Running the what-if operation](./deploy-what-if.md#running-the-what-if-operation).

Preflight errors appear in the activity log but not in deployment history, because the deployment never began.

## Next steps

- To use the what-if operation, see [Bicep What-If: Preview Changes Before Deployment](./deploy-what-if.md).
