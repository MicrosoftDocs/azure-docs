---
title: Role-based access control for Azure Batch service
description: Learn how to use Azure role-based access control for managing individual access to Azure Batch account.
ms.topic: how-to
ms.date: 12/11/2024
---

# Role-based access control for Azure Batch service

Azure Batch Service supports a set of [built-in Azure roles](#azure-batch-built-in-rbac-roles) that provide different levels of permissions to Azure Batch account. By using Azure role-based access control ([Azure RBAC](/azure/role-based-access-control/)), an authorization system for managing individual access to Azure resources, you could assign specific permissions to users, service principals, or other identities that need to interact with your Batch account. You can also [assign custom roles](#assign-a-custom-role) with custom, fine-grained permissions that adapt your specific use scenario.

> [!NOTE]
> All RBAC (both built-in and custom) roles are for users authenticated by Microsoft Entra ID, not for the Batch shared key credentials. The Batch shared key credentials give full permission to the Batch account. 

## Assign Azure RBAC

Follow these steps to assign an Azure RBAC role to a user, group, service principal, or managed identity. For detailed steps, see [Assign Azure roles by using the Azure portal](/azure/role-based-access-control/role-assignments-portal). 

1. In the Azure portal, navigate to your specific Batch account.
    > [!TIP]
    > You can also set up Azure RBAC for whole resource groups, subscriptions, or management groups. Do this by selecting the desired scope level and then navigating to the desired item. For example, selecting **Resource groups** and then navigating to a specific resource group.
     
1. Select **Access control (IAM)** from the left navigation.
1. On the **Access control (IAM)** page, select **Add role assignment**.
1. On the **Add role assignment** page, select the **Role** tab, and then select one of [Azure Batch built-in RBAC roles](#azure-batch-built-in-rbac-roles).
1. Select the **Members** tab, and select **Select members** under **Members**.
1. On the **Select members** screen, search for and select a user, group, service principal, or managed identity, and then select **Select**.
    > [!NOTE]
    > When configuring an application to authenticate Azure Batch services with service principal, search and select your application here to configure its access and permissions to the Azure Batch account.
    
1. Select **Review + assign** on the **Add role assignment** page.

The target identity should now appear on the **Role assignments** tab of the Batch account's **Access control (IAM)** page.

## Azure Batch built-in RBAC roles
 
Azure Batch has some predefined roles to address common user scenarios, ensuring appropriate access levels on Azure Batch account could be efficiently assigned to an identity for their specific duty. 

> | Built-in role | Description | ID |
> | --- | --- | --- |
> | [Azure Batch Account Contributor](#azure-batch-account-contributor) | Grants full access to manage all Batch resources, including Batch accounts, pools, and jobs. | 29fe4964-1e60-436b-bd3a-77fd4c178b3c |
> | [Azure Batch Account Reader](#azure-batch-account-reader) | Lets you view all resources including pools and jobs in the Batch account. | 11076f67-66f6-4be0-8f6b-f0609fd05cc9 |
> | [Azure Batch Data Contributor](#azure-batch-data-contributor) | Grants permissions to manage Batch pools and jobs but not to modify accounts. | 6aaa78f1-f7de-44ca-8722-c64a23943cae |
> | [Azure Batch Job Submitter](#azure-batch-job-submitter) | Lets you submit and manage jobs in the Batch account. | 48e5e92e-a480-4e71-aa9c-2778f4c13781 |

> | Permissions | Azure Batch Account Contributor | Azure Batch Account Reader | Azure Batch Data Contributor | Azure Batch Job Submitter |
> | --- | --- | --- | --- | --- |
> | List Batch accounts or view properties of a Batch account | ✓ | ✓ | ✓ | |
> | Create, update or delete a Batch account | ✓ | | | |
> | List access keys for a Batch account | ✓ | | | |
> | Regenerate access keys for a Batch account | ✓ | | | |
> | List or view properties of applications and application packages on a Batch account | ✓ | ✓ | ✓ | ✓ |
> | Create, update or delete applications and application packages on a Batch account | ✓ | | ✓ | |
> | List or view properties of certificates on a Batch account  | ✓ | ✓ | ✓ | |
> | Create, update or delete certificates on a Batch account | ✓ | | ✓ | |
> | List or view properties of pools on a Batch account | ✓ | ✓ | ✓ | ✓ |
> | Create, update or delete pools on a Batch account | ✓ | | ✓ | |
> | List or view properties of jobs on a Batch account | ✓ | ✓ | ✓ | ✓ |
> | Create, update or delete jobs on a Batch account | ✓ | | ✓ | ✓ |
> | List or view properties of job schedules on a Batch account | ✓ | ✓ | ✓ | ✓ |
> | Create, update or delete job schedules on a Batch account | ✓ | | ✓ | ✓ |

> [!WARNING]
> The Batch account certificate feature has been [retired](./batch-certificate-migration-guide.md).

### Azure Batch Account Contributor

Grants full access to manage all Batch resources, including Batch accounts, pools, and jobs.

> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](/azure/role-based-access-control/permissions/management-and-governance#microsoftauthorization)/*/read | Read roles and role assignments. |
> | [Microsoft.Insights](/azure/role-based-access-control/permissions/monitor#microsoftinsights)/alertRules/* | Create and manage a classic metric alert. |
> | [Microsoft.Resources](/azure/role-based-access-control/permissions/management-and-governance#microsoftresources)/deployments/* | Create and manage a deployment. |
> | [Microsoft.Resources](/azure/role-based-access-control/permissions/management-and-governance#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
    "assignableScopes": [
        "/"
    ],
    "description": "Grants full access to manage all Batch resources, including Batch accounts, pools and jobs.",
    "id": "/providers/Microsoft.Authorization/roleDefinitions/29fe4964-1e60-436b-bd3a-77fd4c178b3c",
    "permissions": [
        {
            "actions": [
                "Microsoft.Authorization/*/read",
                "Microsoft.Batch/batchAccounts/*",
                "Microsoft.Insights/alertRules/*",
                "Microsoft.Resources/deployments/*",
                "Microsoft.Resources/subscriptions/resourceGroups/read"
            ],
            "dataActions": [
                "Microsoft.Batch/batchAccounts/*"
            ],
            "notActions": [],
            "notDataActions": []
        }
    ],
    "roleName": "Azure Batch Account Contributor",
    "roleType": "BuiltInRole",
    "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Batch Account Reader

Lets you view all resources including pools and jobs in the Batch account.

> | Actions | Description |
> | --- | --- |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/read | Lists Batch accounts or gets the properties of a Batch account. |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/*/read | View all resources in Batch account. |
> | [Microsoft.Resources](/azure/role-based-access-control/permissions/management-and-governance#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/*/read | View all resources in Batch account. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
    "assignableScopes": [
        "/"
    ],
    "description": "Lets you view all resources including pools and jobs in the Batch account.",
    "id": "/providers/Microsoft.Authorization/roleDefinitions/11076f67-66f6-4be0-8f6b-f0609fd05cc9",
    "permissions": [
        {
            "actions": [
                "Microsoft.Batch/batchAccounts/read",
                "Microsoft.Batch/batchAccounts/*/read",
                "Microsoft.Resources/subscriptions/resourceGroups/read"
            ],
            "dataActions": [
                "Microsoft.Batch/batchAccounts/*/read"
            ],
            "notActions": [],
            "notDataActions": []
        }
    ],
    "roleName": "Azure Batch Account Reader",
    "roleType": "BuiltInRole",
    "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Batch Data Contributor

Grants permissions to manage Batch pools and jobs but not to modify accounts.

> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](/azure/role-based-access-control/permissions/management-and-governance#microsoftauthorization)/*/read | Read roles and role assignments. |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/read | Lists Batch accounts or gets the properties of a Batch account. |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/applications/* | Create and manage applications and application packages on a Batch account. |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/certificates/* | Create and manage certificates on a Batch account. |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/certificateOperationResults/* | Gets the results of a long running certificate operation on a Batch account. |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/pools/* | Create and manage pools on a Batch account. | 
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/poolOperationResults/* | Gets the results of a long running pool operation on a Batch account. | 
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/locations/*/read | Get Batch account operation result/Batch quota/supported VM size at the given location. |
> | [Microsoft.Insights](/azure/role-based-access-control/permissions/monitor#microsoftinsights)/alertRules/* | Create and manage a classic metric alert. |
> | [Microsoft.Resources](/azure/role-based-access-control/permissions/management-and-governance#microsoftresources)/deployments/* | Create and manage a deployment. |
> | [Microsoft.Resources](/azure/role-based-access-control/permissions/management-and-governance#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/jobSchedules/* | Create and manage job schedules on a Batch account. |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/jobs/* | Create and manage jobs on a Batch account. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
    "assignableScopes": [
        "/"
    ],
    "description": "Grants permissions to manage Batch pools and jobs but not to modify accounts.",
    "id": "/providers/Microsoft.Authorization/roleDefinitions/6aaa78f1-f7de-44ca-8722-c64a23943cae",
    "permissions": [
        {
            "actions": [
                "Microsoft.Authorization/*/read",
                "Microsoft.Batch/batchAccounts/read",
                "Microsoft.Batch/batchAccounts/applications/*",
                "Microsoft.Batch/batchAccounts/certificates/*",
                "Microsoft.Batch/batchAccounts/certificateOperationResults/*",
                "Microsoft.Batch/batchAccounts/pools/*",
                "Microsoft.Batch/batchAccounts/poolOperationResults/*",
                "Microsoft.Batch/locations/*/read",
                "Microsoft.Insights/alertRules/*",
                "Microsoft.Resources/deployments/*",
                "Microsoft.Resources/subscriptions/resourceGroups/read"
            ],
            "dataActions": [
                "Microsoft.Batch/batchAccounts/jobSchedules/*",
                "Microsoft.Batch/batchAccounts/jobs/*"
            ],
            "notActions": [],
            "notDataActions": []
        }
    ],
    "roleName": "Azure Batch Data Contributor",
    "roleType": "BuiltInRole",
    "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Batch Job Submitter

Lets you submit and manage jobs in the Batch account.

> | Actions | Description |
> | --- | --- |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/applications/read | Lists applications or gets the properties of an application. |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/applications/versions/read | Gets the properties of an application package. |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/pools/read | Lists pools on a Batch account or gets the properties of a pool. | 
> | [Microsoft.Insights](/azure/role-based-access-control/permissions/monitor#microsoftinsights)/alertRules/* | Create and manage a classic metric alert. |
> | [Microsoft.Resources](/azure/role-based-access-control/permissions/management-and-governance#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/jobSchedules/* | Create and manage job schedules on a Batch account. |
> | [Microsoft.Batch](/azure/role-based-access-control/permissions/compute#microsoftbatch)/batchAccounts/jobs/* | Create and manage jobs on a Batch account. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
    "assignableScopes": [
        "/"
    ],
    "description": "Lets you submit and manage jobs in the Batch account.",
    "id": "/providers/Microsoft.Authorization/roleDefinitions/48e5e92e-a480-4e71-aa9c-2778f4c13781",
    "permissions": [
        {
            "actions": [
                "Microsoft.Batch/batchAccounts/applications/read",
                "Microsoft.Batch/batchAccounts/applications/versions/read",
                "Microsoft.Batch/batchAccounts/pools/read",
                "Microsoft.Insights/alertRules/*",
                "Microsoft.Resources/subscriptions/resourceGroups/read"
            ],
            "dataActions": [
                "Microsoft.Batch/batchAccounts/jobSchedules/*",
                "Microsoft.Batch/batchAccounts/jobs/*"
            ],
            "notActions": [],
            "notDataActions": []
        }
    ],
    "roleName": "Azure Batch Job Submitter",
    "roleType": "BuiltInRole",
    "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Assign a custom role

If Azure Batch built-in roles don't meet your needs, [Azure custom roles](../role-based-access-control/custom-roles.md) could be used to grant granular permission to a user for submitting jobs, tasks, and more. You can use a custom role to grant or deny permissions to a Microsoft Entra ID for the following Azure Batch RBAC operations. 

- Microsoft.Batch/batchAccounts/pools/write
- Microsoft.Batch/batchAccounts/pools/delete
- Microsoft.Batch/batchAccounts/pools/read
- Microsoft.Batch/batchAccounts/jobSchedules/write
- Microsoft.Batch/batchAccounts/jobSchedules/delete
- Microsoft.Batch/batchAccounts/jobSchedules/read
- Microsoft.Batch/batchAccounts/jobs/write
- Microsoft.Batch/batchAccounts/jobs/delete
- Microsoft.Batch/batchAccounts/jobs/read
- Microsoft.Batch/batchAccounts/certificates/write
- Microsoft.Batch/batchAccounts/certificates/delete
- Microsoft.Batch/batchAccounts/certificates/read
- Microsoft.Batch/batchAccounts/applications/write
- Microsoft.Batch/batchAccounts/applications/delete
- Microsoft.Batch/batchAccounts/applications/read
- Microsoft.Batch/batchAccounts/applications/versions/write
- Microsoft.Batch/batchAccounts/applications/versions/delete
- Microsoft.Batch/batchAccounts/applications/versions/read
- Microsoft.Batch/batchAccounts/read, for any read operation
- Microsoft.Batch/batchAccounts/listKeys/action, for any operation

> [!TIP]
> Jobs that use [autopool](nodes-and-pools.md#autopools) require pool-level write permissions.

> [!NOTE]
> Certain role assignments need to be specified in the `actions` field, whereas others need to be specified in the `dataActions` field. You need to examine both `actions` and `dataActions` to understand the full scope of capabilities assigned to a role. For more information, see [Azure resource provider operations](/azure/role-based-access-control/permissions/compute#microsoftbatch).


The following example shows an Azure Batch custom role definition:

```json
{
 "properties":{
    "roleName":"Azure Batch Custom Job Submitter",
    "type":"CustomRole",
    "description":"Allows a user to submit autopool jobs to Azure Batch",
    "assignableScopes":[
      "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e"
    ],
    "permissions":[
      {
        "actions":[
          "Microsoft.Batch/*/read",
          "Microsoft.Batch/batchAccounts/pools/write",
          "Microsoft.Batch/batchAccounts/pools/delete",
          "Microsoft.Authorization/*/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Support/*",
          "Microsoft.Insights/alertRules/*"
        ],
        "notActions":[

        ],
        "dataActions":[
          "Microsoft.Batch/batchAccounts/jobs/*",
          "Microsoft.Batch/batchAccounts/jobSchedules/*"
        ],
        "notDataActions":[

        ]
      }
    ]
  }
}
```

## Next steps

- [Create a Batch account in the Azure portal](./batch-account-create-portal.md)
- [Authenticate Batch Management solutions with Microsoft Entra ID](./batch-aad-auth-management.md)
- [Authenticate Azure Batch services with Microsoft Entra ID](./batch-aad-auth.md)
