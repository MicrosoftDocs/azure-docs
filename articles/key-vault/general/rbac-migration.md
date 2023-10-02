---
title: Migrate to Azure role-based access control | Microsoft Docs
description: Learn how to migrate from vault access policies to Azure roles.
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: general
ms.topic: how-to
ms.date: 01/20/2023
ms.author: mbaldwin

---
# Migrate from vault access policy to an Azure role-based access control permission model

Azure Key Vault offers two authorization systems: Azure role-based access control (Azure RBAC), and an access policy model. Azure RBAC is the default and recommended authorization system for Azure Key Vault. For a comparison of the two methods of authorization, see [Azure role-based access control (Azure RBAC) vs. access policies](rbac-access-policy.md).

This article provide the information necessary to migrate from a key vault from access policy authorization to an Azure RBAC model.

## Access policies to Azure roles mapping

Azure RBAC has several Azure built-in roles that you can assign to users, groups, service principals, and managed identities. If the built-in roles don't meet the specific needs of your organization, you can create your own [Azure custom roles](../../role-based-access-control/custom-roles.md).

Key Vault built-in roles for keys, certificates, and secrets access management:
- Key Vault Administrator
- Key Vault Reader
- Key Vault Certificates Officer
- Key Vault Crypto Officer
- Key Vault Crypto User
- Key Vault Crypto Service Encryption User
- Key Vault Secrets Officer
- Key Vault Secrets User

For more information about existing built-in roles, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md)

Vault access policies can be assigned with individually selected permissions or with predefined permission templates.

Access policy predefined permission templates:
- Key, Secret, Certificate Management
- Key & Secret Management
- Secret & Certificate Management
- Key Management
- Secret Management
- Certificate Management
- SQL Server Connector
- Azure Data Lake Storage or Azure Storage
- Azure Backup
- Exchange Online Customer Key
- SharePoint Online Customer Key
- Azure Information BYOK

### Access policy templates to Azure roles mapping
| Access policy template | Operations | Azure role |
| --- | --- | --- |
| Key, Secret, Certificate Management | Keys: all operations <br>Certificates: all operations<br>Secrets: all operations | Key Vault Administrator |
| Key & Secret Management | Keys: all operations <br>Secrets: all operations| Key Vault Crypto Officer <br> Key Vault Secrets Officer |
| Secret & Certificate Management | Certificates: all operations <br>Secrets: all operations| Key Vault Certificates Officer <br> Key Vault Secrets Officer|
| Key Management | Keys: all operations| Key Vault Crypto Officer|
| Secret Management | Secrets: all operations| Key Vault Secrets Officer|
| Certificate Management | Certificates: all operations | Key Vault Certificates Officer|
| SQL Server Connector | Keys: get, list, wrap key, unwrap key | Key Vault Crypto Service Encryption User|
| Azure Data Lake Storage or Azure Storage | Keys: get, list,  unwrap key | N/A<br> Custom role required|
| Azure Backup | Keys: get, list, backup<br> Secrets: get, list, backup | N/A<br> Custom role required|
| Exchange Online Customer Key | Keys: get, list, wrap key, unwrap key | Key Vault Crypto Service Encryption User|
| Exchange Online Customer Key | Keys: get, list, wrap key, unwrap key | Key Vault Crypto Service Encryption User|
| Azure Information BYOK | Keys: get, decrypt, sign | N/A<br>Custom role required|

> [!NOTE]
> Azure App Service certificate configuration through Azure Portal does not support Key Vault RBAC permission model. You can use Azure PowerShell, Azure CLI, ARM template deployments with **Key Vault Secrets User** and **Key Vault Reader** role assignemnts for 'Microsoft Azure App Service' global indentity.

## Assignment scopes mapping  

Azure RBAC for Key Vault allows roles assignment at following scopes:
- Management group
- Subscription
- Resource group
- Key Vault resource
- Individual key, secret, and certificate

The vault access policy permission model is limited to assigning policies only at Key Vault resource level.

In general, it's best practice to have one key vault per application and manage access at key vault level. There are scenarios when managing access at other scopes can simplify access management.

- **Infrastructure, security administrators and operators**: managing group of key vaults at management group, subscription or resource group level with vault access policies requires maintaining policies for each key vault. Azure RBAC allows creating one role assignment at management group, subscription, or resource group. That assignment will apply to any new key vaults created under the same scope. In this scenario, it's recommended to use Privileged Identity Management with just-in time access over providing permanent access.
 
- **Applications**: there are scenarios when application would need to share secret with other application. Using vault access polices separate key vault had to be created to avoid giving access to all secrets. Azure RBAC allows assign role with scope for individual secret instead using single key vault.

## Vault access policy to Azure RBAC migration steps
There are many differences between Azure RBAC and vault access policy permission model. In order, to avoid outages during migration, below steps are recommended.
 
1. **Identify and assign roles**: identify built-in roles based on mapping table above and create custom roles when needed. Assign roles at scopes, based on scopes mapping guidance. For more information on how to assign roles to key vault, see [Provide access to Key Vault with an Azure role-based access control](rbac-guide.md)
1. **Validate roles assignment**: role assignments in Azure RBAC can take several minutes to propagate. For guide how to check role assignments, see [List roles assignments at scope](../../role-based-access-control/role-assignments-list-portal.md#list-role-assignments-for-a-user-at-a-scope)
1. **Configure monitoring and alerting on key vault**: it's important to enable logging and setup alerting for access denied exceptions. For more information, see [Monitoring and alerting for Azure Key Vault](./alert.md)
1. **Set Azure role-based access control permission model on Key Vault**: enabling Azure RBAC permission model will invalidate all existing access policies. If an error, permission model can be switched back with all existing access policies remaining untouched.

> [!NOTE]
> Changing permission model requires 'Microsoft.Authorization/roleAssignments/write' permission, which is part of [Owner](../../role-based-access-control/built-in-roles.md#owner) and [User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) roles. Classic subscription administrator roles like 'Service Administrator' and 'Co-Administrator' are not supported.

> [!NOTE]
> When Azure RBAC permission model is enabled, all scripts which attempt to update access policies will fail. It is important to update those scripts to use Azure RBAC.

## Migration governance

Using the Azure Policy service, you can govern RBAC permission model migration across your vaults. You can create a custom policy definition to audit existing key vaults and enforce all new key vaults to use the Azure RBAC permission model.

### Create and assign policy definition for Key Vault Azure RBAC permission model
1. Navigate to Policy resource
1. Select **Assignments** under **Authoring** on the left side of the Azure Policy page.
1. Select **Assign policy** at the top of the page. This button opens to the Policy assignment page.
1. Enter the following information:
    - Define the scope of the policy by choosing the subscription and resource group over which the policy will be enforced. Select by clicking the three-dot button at on **Scope** field.
    - Select the name of the policy definition: "[[Preview]: Azure Key Vault should use RBAC permission model](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F12d4fa5e-1f9f-4c21-97a9-b99b3c6611b5)"
    - Go to the **Parameters** tab at the top of the page and define the desired effect of the policy (Audit, Deny, or Disabled). 
1. Fill out any additional fields. Navigate the tabs clicking on **Previous** and **Next** buttons at the bottom of the page.
1. Select **Review + create**
1. Select **Create**

Once the built-in policy is assigned, it can take up to 24 hours to complete the scan. After the scan is completed, you can see compliance results like below.

:::image type="content" source="../media/rbac/migration-policy.png" alt-text="RBAC policy compliance":::

For more information, see
- [Integrate Azure Key Vault with Azure Policy](azure-policy.md)

## Access Policy to Azure RBAC Comparison Tool

> [!IMPORTANT]
> This tool is build and maintained by Microsoft Community members and without formal Customer Support Services support.
> The tool is provided AS IS without warranty of any kind.

[PowerShell tool](https://github.com/Azure/KeyVault-AccessPolicyToRBAC-CompareTool) to compare Key Vault access policies to assigned RBAC roles to help with Access Policy to RBAC Permission Model migration. The tool intent is to provide sanity check when migrating existing Key Vault to RBAC permission model to ensure that assigned roles with underlying data actions cover existing Access Policies.

## Troubleshooting
-  Role assignment not working after several minutes - there are situations when role assignments can take longer. It's important to write retry logic in code to cover those cases.
- Role assignments disappeared when Key Vault was deleted (soft-delete) and recovered - it's currently a limitation of soft-delete feature across all Azure services. It's required to recreate all role assignments after recovery.

## Learn more

- [Azure RBAC Overview](../../role-based-access-control/overview.md)
- [Custom Roles Tutorial](../../role-based-access-control/tutorial-custom-role-cli.md)
- [Privileged Identity Management](../../active-directory/privileged-identity-management/pim-configure.md)
