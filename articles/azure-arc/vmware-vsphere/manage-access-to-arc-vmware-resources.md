---
title: Manage access to VMware resources through Azure RBAC
description: Learn how to manage access to your on-premises VMware resources through Azure Role-Based Access Control (RBAC). 
ms.topic: how-to
ms.date: 04/13/2021

#Customer intent: As a VI admin, I want to manage access to my vCenter resources in Azure so that I can keep environments secure
---

# Manage access to VMware resources through Azure Role-Based Access Control

Once your VMware vCenter resources have been enabled for access through Azure, the final step in setting up a self-service experience for your teams is to provide them access to the compute, storage and networking and other vCenter resources using which they can provision VMs.

This article will describe how to use custom roles to manage granular access to VMware resources through Azure.

## Arc enabled VMware vSphere Custom Roles

We provide three custom roles to meet your Role Based Access Controls. These roles can be applied to a whole subscription, resource group or even a single resource.

- Azure Arc VMware Administrator role
- Azure Arc VMware Private Cloud User role
- Azure Arc VMware VM Contributor role

The first role is for Administrator and the last two roles are needed for anyone who needs to deploy/manage a VM.

> [!NOTE]
> These roles will eventually be converted into built-in roles.

### Azure Arc VMware Administrator role

This custom role provides permissions to perform all possible operations for the `Microsoft.ConnectedVMwarevSphere` resource provider. This role should be assigned to users/groups that are administrators that manage Azure Arc enabled VMware vSphere deployment.

```json
{
    "properties": {
        "roleName": "Azure Arc VMware Administrator",
        "description": "Azure Arc VMware Administrator has full permissions to connect new vCenter instances to Azure and decide which resource pools, networks and templates can be used by developers, and also create, update and delete VMs",
        "assignableScopes": [
            "/subscriptions/00000000-0000-0000-0000-000000000000"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.ConnectedVMwarevSphere/*",
                    "Microsoft.Insights/AlertRules/*",
                    "Microsoft.Insights/MetricAlerts/*",
                    "Microsoft.Support/*",
                    "Microsoft.Authorization/*/read",
                    "Microsoft.Resources/deployments/*",
                    "Microsoft.Resources/subscriptions/read",
                    "Microsoft.Resources/subscriptions/resourceGroups/read"
                ],
                "notActions": [],
                "dataActions": [],
                "notDataActions": []
            }
        ]
    }
}
```

Copy the above JSON into an empty file and save the file as `AzureArcVMwareAdministratorRole.json`. Replace the `00000000-0000-0000-0000-000000000000` with your subscription id.

### Azure Arc VMware Private Cloud User role

This custom role provides permissions to use the VMware vSphere resources that have been made accessible through Azure. This role should be assigned to any users/groups that need to deploy, update or delete VMs.

We recommend assigning this role at the individual resource pool (or host or cluster), virtual network or template that you want the user to deploy VMs using

```json
{
    "properties": {
        "roleName": "Azure Arc VMware Private Cloud User",
        "description": "Azure Arc VMware Private Cloud User has permissions to use the VMware cloud resources to deploy VMs.",
        "assignableScopes": [
            "/subscriptions/00000000-0000-0000-0000-000000000000"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Insights/AlertRules/*",
                    "Microsoft.Insights/MetricAlerts/*",
                    "Microsoft.Support/*",
                    "Microsoft.Authorization/*/read",
                    "Microsoft.Resources/deployments/*",
                    "Microsoft.Resources/subscriptions/read",
                    "Microsoft.Resources/subscriptions/resourceGroups/read",
                    "Microsoft.ConnectedVMwarevSphere/virtualnetworks/join/action",
                    "Microsoft.ConnectedVMwarevSphere/virtualnetworks/Read",
                    "Microsoft.ConnectedVMwarevSphere/virtualmachinetemplates/clone/action",
                    "Microsoft.ConnectedVMwarevSphere/virtualmachinetemplates/Read",
                    "Microsoft.ConnectedVMwarevSphere/resourcepools/deploy/action",
                    "Microsoft.ConnectedVMwarevSphere/resourcepools/Read",
                    "Microsoft.ExtendedLocation/customLocations/Read"
                ],
                "notActions": [],
                "dataActions": [
                    "Microsoft.ExtendedLocation/customLocations/deploy/action"
                ],
                "notDataActions": []
            }
        ]
    }
}
```

Copy the above JSON into an empty file and save the file as `AzureArcVMwarePrivateCloudUserRole.json`. Replace the `00000000-0000-0000-0000-000000000000` with your subscription id.

### Azure Arc VMware VM Contributor

This custom role provides permissions to perform all VMware virtual machine operations. This role should be assigned to any users/groups that need to deploy, update or delete VMs.

We recommend assigning this role at the subscription or resource group you want the user to deploy VMs using

```json
{
    "properties": {
        "roleName": "Arc VMware VM Contributor",
        "description": "Arc VMware VM Contributor has permissions to perform all actions to update ",
        "assignableScopes": [
            "/subscriptions/00000000-0000-0000-0000-000000000000"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Insights/AlertRules/*",
                    "Microsoft.Insights/MetricAlerts/*",
                    "Microsoft.Support/*",
                    "Microsoft.Authorization/*/read",
                    "Microsoft.Resources/deployments/*",
                    "Microsoft.Resources/subscriptions/read",
                    "Microsoft.Resources/subscriptions/resourceGroups/read",
                    "Microsoft.ConnectedVMwarevSphere/virtualmachines/Delete",
                    "Microsoft.ConnectedVMwarevSphere/virtualmachines/Write",
                    "Microsoft.ConnectedVMwarevSphere/virtualmachines/Read"
                ],
                "notActions": [],
                "dataActions": [],
                "notDataActions": []
            }
        ]
    }
}
```

Copy the above JSON into an empty file and save the file as `AzureArcVMwareVMContributorRole.json`. Replace the `00000000-0000-0000-0000-000000000000` with your subscription id.

## Adding custom roles to your subscription

To add the above custom roles to your subscription, perform the following steps.

1. Go to the [Azure portal](https://portal.azure.com)

2. Search and navigate to the subscription page.

3. Click on **Access control (IAM)** in the table of contents on the left.

4. Click on **Add** on the **Create a custom role** card.

5. On the **Basics** page, select **Start from JSON** on the **Baseline permissions** field

6. Pick one of the json files you saved from above steps.

7. Click **Review+Create** and review the assignable scope matches your subscription

8. Click on **Create**

Repeat this process for each custom role and each subscription.

## Assigning the custom roles to users/groups

1. Go to the [Azure portal](https://portal.azure.com)

2. Search and navigate to the subscription, resource group or the resource at which scope you want to provide this role.

3. To find the Arc enabled VMware vSphere resources,
     1. navigate to the resource group and select the **Show hidden types** checkbox.
     2. search for *"VMware"*

4. Click on **Access control (IAM)** in the table of contents on the left.

5. Click on **Add role assignments** on the **Grant access to this resource**

6. Select the custom role you want to assign (one of **Azure Arc VMware Administrator**, **Azure Arc VMware Private Cloud User** or **Azure Arc VMware VM Contributor**)

7. Search for AAD user or group that you want assign this role to

8. Click on the AAD user or group name to select. Repeat this for each user/group you want to provide this permission.

9. Repeat the above steps for each scope and role.

## Next steps

- [Create a VM using Azure Arc](quick-start-create-a-vm.md)
