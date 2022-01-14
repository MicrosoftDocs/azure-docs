---
title: Manage access to VMware resources through Azure Role-Based Access Control
description: Learn how to manage access to your on-premises VMware resources through Azure Role-Based Access Control (RBAC). 
ms.topic: how-to
ms.date: 11/08/2021

#Customer intent: As a VI admin, I want to manage access to my vCenter resources in Azure so that I can keep environments secure
---

# Manage access to VMware resources through Azure Role-Based Access Control

Once your VMware vCenter resources have been enabled for access through Azure, the final step is setting up a self-service experience for your teams. It provides access to the compute, storage, networking, and other vCenter resources to deploy and manage virtual machines (VMs).

This article describes how to use custom roles to manage granular access to VMware resources through Azure.

> [!IMPORTANT]
> In the interest of ensuring new features are documented no later than their release, this page may include documentation for features that may not yet be publicly available.

## Arc enabled VMware vSphere custom roles

You can select from three custom roles to meet your RBAC needs. You can apply these roles to a whole subscription, resource group, or a single resource.

- **Azure Arc VMware Administrator** role - is used by administrators

- **Azure Arc VMware Private Cloud User** role - is used by anyone who needs to deploy and manage VMs

- **Azure Arc VMware VM Contributor** role - is used by anyone who needs to deploy and manage VMs

>[!NOTE]
>These roles will eventually be converted into built-in roles.

### Azure Arc VMware Administrator role

The **Azure Arc VMware Administrator** role is a custom role that provides permissions to perform all possible operations for the `Microsoft.ConnectedVMwarevSphere` resource provider. Assign this role to users or groups that are administrators managing Azure Arc enabled VMware vSphere deployment.

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

Copy the above JSON into an empty file and save the file as `AzureArcVMwareAdministratorRole.json`. Make sure to replace the `00000000-0000-0000-0000-000000000000` with your subscription ID.

### Azure Arc VMware Private Cloud User role

The **Azure Arc VMware Private Cloud User** role is a custom role that provides permissions to use the VMware vSphere resources made accessible through Azure. Assign this role to any users or groups that need to deploy, update, or delete VMs.

We recommend assigning this role at the individual resource pool (or host or cluster), virtual network, or template that you want the user to deploy VMs using:

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

Copy the above JSON into an empty file and save the file as `AzureArcVMwarePrivateCloudUserRole.json`. Make sure to replace the `00000000-0000-0000-0000-000000000000` with your subscription ID.

### Azure Arc VMware VM Contributor

The **Azure Arc VMware VM Contributor** role is a custom role that provides permissions to conduct all VMware virtual machine operations. Assign this role to any users or groups that need to deploy, update, or delete VMs.

We recommend assigning this role at the subscription or resource group you want the user to deploy VMs using:

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

Copy the above JSON into an empty file and save the file as `AzureArcVMwareVMContributorRole.json`. Replace the `00000000-0000-0000-0000-000000000000` with your subscription ID.

## Add custom roles to your subscription

In this step, you'll add the custom roles to your subscription. Repeat these steps for each custom role and each subscription.

1. From your browser, go to the [Azure portal](https://portal.azure.com) and select the subscription.

1. Select **Access control (IAM)** > **Add** > **Add a custom role**.

1. From the Baseline permissions field, select **Start from JSON** and then select the json file you saved earlier. 

1. Select **Review + Create** to review and then select **Create**.

## Assign custom roles to users or groups

In this step, you'll add the custom roles to users or groups in the subscription, resource group, or a single resource.  Repeat these steps for each scope and role.

1. From your browser, go to the [Azure portal](https://portal.azure.com) and select the subscription, resource group, or a single resource.

1. Locate the Arc enabled VMware vSphere resources. Navigate to the resource group and select the **Show hidden types** checkbox. Then search for **VMware**.

1. Select **Access control (IAM)** > **Add role assignments** > **Grant access to this resource**.

1. Select the custom role you want to assign:

   - **Azure Arc VMware Administrator**

   - **Azure Arc VMware Private Cloud User**

   - **Azure Arc VMware VM Contributor**

1. Search for and select the Azure Active Directory (AAD) user or group.  Repeat these steps for each user or group you want to grant permission.

## Next steps

[Create a VM using Azure Arc-enabled vSphere](quick-start-create-a-vm.md)
