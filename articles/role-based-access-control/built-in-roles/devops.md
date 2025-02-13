---
title: Azure built-in roles for DevOps - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the DevOps category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 01/25/2025
ms.custom: generated
---

# Azure built-in roles for DevOps

This article lists the Azure built-in roles in the DevOps category.


## Chaos Studio Experiment Contributor

Can create, run, and see details for experiments, onboard targets, and manage capabilities.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Chaos](../permissions/devops.md#microsoftchaos)/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can create, run, and see details for experiments, onboard targets, and manage capabilities.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7c2e40b7-25eb-482a-82cb-78ba06cb46d5",
  "name": "7c2e40b7-25eb-482a-82cb-78ba06cb46d5",
  "permissions": [
    {
      "actions": [
        "Microsoft.Chaos/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Chaos Studio Experiment Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Chaos Studio Operator

Can run and see details for experiments but cannot create experiments or manage targets and capabilities.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Chaos](../permissions/devops.md#microsoftchaos)/*/read |  |
> | [Microsoft.Chaos](../permissions/devops.md#microsoftchaos)/experiments/start/action | Starts a Chaos Experiment to inject faults. |
> | [Microsoft.Chaos](../permissions/devops.md#microsoftchaos)/experiments/cancel/action | Cancels a running Chaos Experiment to stop the fault injection. |
> | [Microsoft.Chaos](../permissions/devops.md#microsoftchaos)/experiments/executions/getExecutionDetails/action | Gets details of a chaos experiment execution for a given chaos experiment. |
> | [Microsoft.Chaos](../permissions/devops.md#microsoftchaos)/locations/operationResults/read | Gets an Operation Result. |
> | [Microsoft.Chaos](../permissions/devops.md#microsoftchaos)/locations/operationStatuses/read | Gets an Operation Status. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can run and see details for experiments but cannot create experiments or manage targets and capabilities.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/1a40e87e-6645-48e0-b27a-0b115d849a20",
  "name": "1a40e87e-6645-48e0-b27a-0b115d849a20",
  "permissions": [
    {
      "actions": [
        "Microsoft.Chaos/*/read",
        "Microsoft.Chaos/experiments/start/action",
        "Microsoft.Chaos/experiments/cancel/action",
        "Microsoft.Chaos/experiments/executions/getExecutionDetails/action",
        "Microsoft.Chaos/locations/operationResults/read",
        "Microsoft.Chaos/locations/operationStatuses/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Chaos Studio Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Chaos Studio Reader

Can view targets, capabilities, experiments, and experiment details.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Chaos](../permissions/devops.md#microsoftchaos)/*/read |  |
> | [Microsoft.Chaos](../permissions/devops.md#microsoftchaos)/experiments/executions/getExecutionDetails/action | Gets details of a chaos experiment execution for a given chaos experiment. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can view targets, capabilities, experiments, and experiment details.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/29e2da8a-229c-4157-8ae8-cc72fc506b74",
  "name": "29e2da8a-229c-4157-8ae8-cc72fc506b74",
  "permissions": [
    {
      "actions": [
        "Microsoft.Chaos/*/read",
        "Microsoft.Chaos/experiments/executions/getExecutionDetails/action",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Chaos Studio Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Deployment Environments Reader

Provides read access to environment resources.

[Learn more](/azure/deployment-environments/how-to-configure-deployment-environments-user)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/read | Gets a specific project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/pools/read | Gets a machine pool |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/pools/schedules/read | Gets a schedule resource. |
> | **DataActions** |  |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/adminRead/action | Allows a project administrator to read all of the environments in a project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/adminActionRead/action | Allows an admin to read environment actions. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/adminOutputsRead/action | Allows an admin to read Output values from environment deployment. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Provides read access to environment resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/eb960402-bf75-4cc3-8d68-35b34f960f72",
  "name": "eb960402-bf75-4cc3-8d68-35b34f960f72",
  "permissions": [
    {
      "actions": [
        "Microsoft.DevCenter/projects/read",
        "Microsoft.DevCenter/projects/*/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [
        "Microsoft.DevCenter/projects/pools/read",
        "Microsoft.DevCenter/projects/pools/schedules/read"
      ],
      "dataActions": [
        "Microsoft.DevCenter/projects/users/environments/adminRead/action",
        "Microsoft.DevCenter/projects/users/environments/adminActionRead/action",
        "Microsoft.DevCenter/projects/users/environments/adminOutputsRead/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Deployment Environments Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Deployment Environments User

Provides access to manage environment resources.

[Learn more](/azure/deployment-environments/how-to-configure-deployment-environments-user)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/read | Gets a specific project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/*/read |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | **NotActions** |  |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/pools/read | Gets a machine pool |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/pools/schedules/read | Gets a schedule resource. |
> | **DataActions** |  |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/userRead/action | Allows a user to read the environments they have access to in a project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/userWrite/action | Allows a user to write the environments they have access to in a project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/userDelete/action | Allows a user to delete the environments they have access to in a project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/userActionManage/action | Allows a user to skip, delay etc. environment actions. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/userOutputsRead/action | Allows a user to read Output values from environment deployment. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Provides access to manage environment resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/18e40d4e-8d2e-438d-97e1-9528336e149c",
  "name": "18e40d4e-8d2e-438d-97e1-9528336e149c",
  "permissions": [
    {
      "actions": [
        "Microsoft.DevCenter/projects/read",
        "Microsoft.DevCenter/projects/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Authorization/*/read"
      ],
      "notActions": [
        "Microsoft.DevCenter/projects/pools/read",
        "Microsoft.DevCenter/projects/pools/schedules/read"
      ],
      "dataActions": [
        "Microsoft.DevCenter/projects/users/environments/userRead/action",
        "Microsoft.DevCenter/projects/users/environments/userWrite/action",
        "Microsoft.DevCenter/projects/users/environments/userDelete/action",
        "Microsoft.DevCenter/projects/users/environments/userActionManage/action",
        "Microsoft.DevCenter/projects/users/environments/userOutputsRead/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Deployment Environments User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## DevCenter Dev Box User

Provides access to create and manage dev boxes.

[Learn more](/azure/dev-box/how-to-dev-box-user)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/read | Gets a specific project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userStop/action | Allows a user to stop their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userStart/action | Allows a user to start their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userGetRemoteConnection/action | Allows a user to get the RDP connection information for their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userRead/action | Allows a user to read their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userWrite/action | Allows a user to create and update their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userDelete/action | Allows a user to delete their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userUpcomingActionRead/action | Allows a user to read upcoming actions. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userUpcomingActionManage/action | Allows a user to skip or delay upcoming actions. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userActionRead/action | Allows a user to read dev box actions. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userActionManage/action | Allows a user to skip or delay dev box actions. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userCustomize/action | Allows a user to customize their own Dev Box resources. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Provides access to create and manage dev boxes.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/45d50f46-0b78-4001-a660-4198cbe8cd05",
  "name": "45d50f46-0b78-4001-a660-4198cbe8cd05",
  "permissions": [
    {
      "actions": [
        "Microsoft.DevCenter/projects/read",
        "Microsoft.DevCenter/projects/*/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.DevCenter/projects/users/devboxes/userStop/action",
        "Microsoft.DevCenter/projects/users/devboxes/userStart/action",
        "Microsoft.DevCenter/projects/users/devboxes/userGetRemoteConnection/action",
        "Microsoft.DevCenter/projects/users/devboxes/userRead/action",
        "Microsoft.DevCenter/projects/users/devboxes/userWrite/action",
        "Microsoft.DevCenter/projects/users/devboxes/userDelete/action",
        "Microsoft.DevCenter/projects/users/devboxes/userUpcomingActionRead/action",
        "Microsoft.DevCenter/projects/users/devboxes/userUpcomingActionManage/action",
        "Microsoft.DevCenter/projects/users/devboxes/userActionRead/action",
        "Microsoft.DevCenter/projects/users/devboxes/userActionManage/action",
        "Microsoft.DevCenter/projects/users/devboxes/userCustomize/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "DevCenter Dev Box User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## DevCenter Project Admin

Provides access to manage project resources.

[Learn more](/azure/dev-box/how-to-project-admin)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/write | Partially updates a project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/delete | Deletes a project resource. |
> | **DataActions** |  |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/adminStart/action | Allows a user to start any Dev Box resource. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/adminStop/action | Allows a user to stop any Dev Box resource. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/adminRead/action | Allows a user read access to any Dev Box resource. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/adminWrite/action | Allows a user write access to any Dev Box resource. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/adminDelete/action | Allows a user to delete any Dev Box resource. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userStop/action | Allows a user to stop their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userStart/action | Allows a user to start their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userGetRemoteConnection/action | Allows a user to get the RDP connection information for their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userRead/action | Allows a user to read their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userWrite/action | Allows a user to create and update their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userDelete/action | Allows a user to delete their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userActionRead/action | Allows a user to read dev box actions. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userActionManage/action | Allows a user to skip or delay dev box actions. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/devboxes/userCustomize/action | Allows a user to customize their own Dev Box resources. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/adminRead/action | Allows a project administrator to read all of the environments in a project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/userWrite/action | Allows a user to write the environments they have access to in a project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/adminWrite/action | Allows a project administrator to write all of the environments in a project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/userDelete/action | Allows a user to delete the environments they have access to in a project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/adminDelete/action | Allows a project administrator to delete all of the environments in a project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/adminAction/action | Allows a project administrator to perform an action on all of the environments in a project. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/adminActionRead/action | Allows an admin to read environment actions. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/adminActionManage/action | Allows an admin to skip, delay etc. environment actions. |
> | [Microsoft.DevCenter](../permissions/devops.md#microsoftdevcenter)/projects/users/environments/adminOutputsRead/action | Allows an admin to read Output values from environment deployment. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Provides access to manage project resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/331c37c6-af14-46d9-b9f4-e1909e1b95a0",
  "name": "331c37c6-af14-46d9-b9f4-e1909e1b95a0",
  "permissions": [
    {
      "actions": [
        "Microsoft.DevCenter/projects/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [
        "Microsoft.DevCenter/projects/write",
        "Microsoft.DevCenter/projects/delete"
      ],
      "dataActions": [
        "Microsoft.DevCenter/projects/users/devboxes/adminStart/action",
        "Microsoft.DevCenter/projects/users/devboxes/adminStop/action",
        "Microsoft.DevCenter/projects/users/devboxes/adminRead/action",
        "Microsoft.DevCenter/projects/users/devboxes/adminWrite/action",
        "Microsoft.DevCenter/projects/users/devboxes/adminDelete/action",
        "Microsoft.DevCenter/projects/users/devboxes/userStop/action",
        "Microsoft.DevCenter/projects/users/devboxes/userStart/action",
        "Microsoft.DevCenter/projects/users/devboxes/userGetRemoteConnection/action",
        "Microsoft.DevCenter/projects/users/devboxes/userRead/action",
        "Microsoft.DevCenter/projects/users/devboxes/userWrite/action",
        "Microsoft.DevCenter/projects/users/devboxes/userDelete/action",
        "Microsoft.DevCenter/projects/users/devboxes/userActionRead/action",
        "Microsoft.DevCenter/projects/users/devboxes/userActionManage/action",
        "Microsoft.DevCenter/projects/users/devboxes/userCustomize/action",
        "Microsoft.DevCenter/projects/users/environments/adminRead/action",
        "Microsoft.DevCenter/projects/users/environments/userWrite/action",
        "Microsoft.DevCenter/projects/users/environments/adminWrite/action",
        "Microsoft.DevCenter/projects/users/environments/userDelete/action",
        "Microsoft.DevCenter/projects/users/environments/adminDelete/action",
        "Microsoft.DevCenter/projects/users/environments/adminAction/action",
        "Microsoft.DevCenter/projects/users/environments/adminActionRead/action",
        "Microsoft.DevCenter/projects/users/environments/adminActionManage/action",
        "Microsoft.DevCenter/projects/users/environments/adminOutputsRead/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "DevCenter Project Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## DevTest Labs User

Lets you connect, start, restart, and shutdown your virtual machines in your Azure DevTest Labs.

[Learn more](/azure/devtest-labs/devtest-lab-add-devtest-user)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/availabilitySets/read | Get the properties of an availability set |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/*/read | Read the properties of a virtual machine (VM sizes, runtime status, VM extensions, etc.) |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/deallocate/action | Powers off the virtual machine and releases the compute resources |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/read | Get the properties of a virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/restart/action | Restarts the virtual machine |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/start/action | Starts the virtual machine |
> | [Microsoft.DevTestLab](../permissions/devops.md#microsoftdevtestlab)/*/read | Read the properties of a lab |
> | [Microsoft.DevTestLab](../permissions/devops.md#microsoftdevtestlab)/labs/claimAnyVm/action | Claim a random claimable virtual machine in the lab. |
> | [Microsoft.DevTestLab](../permissions/devops.md#microsoftdevtestlab)/labs/createEnvironment/action | Create virtual machines in a lab. |
> | [Microsoft.DevTestLab](../permissions/devops.md#microsoftdevtestlab)/labs/ensureCurrentUserProfile/action | Ensure the current user has a valid profile in the lab. |
> | [Microsoft.DevTestLab](../permissions/devops.md#microsoftdevtestlab)/labs/formulas/delete | Delete formulas. |
> | [Microsoft.DevTestLab](../permissions/devops.md#microsoftdevtestlab)/labs/formulas/read | Read formulas. |
> | [Microsoft.DevTestLab](../permissions/devops.md#microsoftdevtestlab)/labs/formulas/write | Add or modify formulas. |
> | [Microsoft.DevTestLab](../permissions/devops.md#microsoftdevtestlab)/labs/policySets/evaluatePolicies/action | Evaluates lab policy. |
> | [Microsoft.DevTestLab](../permissions/devops.md#microsoftdevtestlab)/labs/virtualMachines/claim/action | Take ownership of an existing virtual machine |
> | [Microsoft.DevTestLab](../permissions/devops.md#microsoftdevtestlab)/labs/virtualmachines/listApplicableSchedules/action | Lists the applicable start/stop schedules, if any. |
> | [Microsoft.DevTestLab](../permissions/devops.md#microsoftdevtestlab)/labs/virtualMachines/getRdpFileContents/action | Gets a string that represents the contents of the RDP file for the virtual machine |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/backendAddressPools/join/action | Joins a load balancer backend address pool. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/loadBalancers/inboundNatRules/join/action | Joins a load balancer inbound nat rule. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/*/read | Read the properties of a network interface (for example, all the load balancers that the network interface is a part of) |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/join/action | Joins a Virtual Machine to a network interface. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/read | Gets a network interface definition.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkInterfaces/write | Creates a network interface or updates an existing network interface.  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/publicIPAddresses/*/read | Read the properties of a public IP address |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/publicIPAddresses/join/action | Joins a public IP address. Not Alertable. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/publicIPAddresses/read | Gets a public IP address definition. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/read | Gets or lists deployments. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/listKeys/action | Returns the access keys for the specified storage account. |
> | **NotActions** |  |
> | [Microsoft.Compute](../permissions/compute.md#microsoftcompute)/virtualMachines/vmSizes/read | Lists available sizes the virtual machine can be updated to |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you connect, start, restart, and shutdown your virtual machines in your Azure DevTest Labs.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/76283e04-6283-4c54-8f91-bcf1374a3c64",
  "name": "76283e04-6283-4c54-8f91-bcf1374a3c64",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Compute/availabilitySets/read",
        "Microsoft.Compute/virtualMachines/*/read",
        "Microsoft.Compute/virtualMachines/deallocate/action",
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/virtualMachines/restart/action",
        "Microsoft.Compute/virtualMachines/start/action",
        "Microsoft.DevTestLab/*/read",
        "Microsoft.DevTestLab/labs/claimAnyVm/action",
        "Microsoft.DevTestLab/labs/createEnvironment/action",
        "Microsoft.DevTestLab/labs/ensureCurrentUserProfile/action",
        "Microsoft.DevTestLab/labs/formulas/delete",
        "Microsoft.DevTestLab/labs/formulas/read",
        "Microsoft.DevTestLab/labs/formulas/write",
        "Microsoft.DevTestLab/labs/policySets/evaluatePolicies/action",
        "Microsoft.DevTestLab/labs/virtualMachines/claim/action",
        "Microsoft.DevTestLab/labs/virtualmachines/listApplicableSchedules/action",
        "Microsoft.DevTestLab/labs/virtualMachines/getRdpFileContents/action",
        "Microsoft.Network/loadBalancers/backendAddressPools/join/action",
        "Microsoft.Network/loadBalancers/inboundNatRules/join/action",
        "Microsoft.Network/networkInterfaces/*/read",
        "Microsoft.Network/networkInterfaces/join/action",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/networkInterfaces/write",
        "Microsoft.Network/publicIPAddresses/*/read",
        "Microsoft.Network/publicIPAddresses/join/action",
        "Microsoft.Network/publicIPAddresses/read",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/deployments/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/listKeys/action"
      ],
      "notActions": [
        "Microsoft.Compute/virtualMachines/vmSizes/read"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "DevTest Labs User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Lab Assistant

Enables you to view an existing lab, perform actions on the lab VMs and send invitations to the lab.

[Learn more](/azure/lab-services/administrator-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/images/read | Get the properties of an image. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/read | Get the properties of a lab plan. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/read | Get the properties of a lab. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/schedules/read | Get the properties of a schedule. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/users/read | Get the properties of a user. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/users/invite/action | Send email invitation to a user to join the lab. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/read | Get the properties of a virtual machine. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/start/action | Start a virtual machine. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/stop/action | Stop and deallocate a virtual machine. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/reimage/action | Reimage a virtual machine to the last published image. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/redeploy/action | Redeploy a virtual machine to a different compute node. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/locations/usages/read | Get Usage in a location |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/skus/read | Get the properties of a Lab Services SKU. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "The lab assistant role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ce40b423-cede-4313-a93f-9b28290b72e1",
  "name": "ce40b423-cede-4313-a93f-9b28290b72e1",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.LabServices/labPlans/images/read",
        "Microsoft.LabServices/labPlans/read",
        "Microsoft.LabServices/labs/read",
        "Microsoft.LabServices/labs/schedules/read",
        "Microsoft.LabServices/labs/users/read",
        "Microsoft.LabServices/labs/users/invite/action",
        "Microsoft.LabServices/labs/virtualMachines/read",
        "Microsoft.LabServices/labs/virtualMachines/start/action",
        "Microsoft.LabServices/labs/virtualMachines/stop/action",
        "Microsoft.LabServices/labs/virtualMachines/reimage/action",
        "Microsoft.LabServices/labs/virtualMachines/redeploy/action",
        "Microsoft.LabServices/locations/usages/read",
        "Microsoft.LabServices/skus/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Lab Assistant",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Lab Contributor

Applied at lab level, enables you to manage the lab. Applied at a resource group, enables you to create and manage labs.

[Learn more](/azure/lab-services/administrator-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/images/read | Get the properties of an image. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/read | Get the properties of a lab plan. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/saveImage/action | Create an image from a virtual machine in the gallery attached to the lab plan. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/read | Get the properties of a lab. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/write | Create new or update an existing lab. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/delete | Delete the lab and all its users, schedules and virtual machines. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/publish/action | Publish a lab by propagating image of the template virtual machine to all virtual machines in the lab. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/syncGroup/action | Updates the list of users from the Active Directory group assigned to the lab. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/schedules/read | Get the properties of a schedule. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/schedules/write | Create new or update an existing schedule. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/schedules/delete | Delete the schedule. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/users/read | Get the properties of a user. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/users/write | Create new or update an existing user. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/users/delete | Delete the user. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/users/invite/action | Send email invitation to a user to join the lab. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/read | Get the properties of a virtual machine. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/start/action | Start a virtual machine. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/stop/action | Stop and deallocate a virtual machine. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/reimage/action | Reimage a virtual machine to the last published image. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/redeploy/action | Redeploy a virtual machine to a different compute node. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/resetPassword/action | Reset local user's password on a virtual machine. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/locations/usages/read | Get Usage in a location |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/skus/read | Get the properties of a Lab Services SKU. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/createLab/action | Create a new lab from a lab plan. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "The lab contributor role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5daaa2af-1fe8-407c-9122-bba179798270",
  "name": "5daaa2af-1fe8-407c-9122-bba179798270",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.LabServices/labPlans/images/read",
        "Microsoft.LabServices/labPlans/read",
        "Microsoft.LabServices/labPlans/saveImage/action",
        "Microsoft.LabServices/labs/read",
        "Microsoft.LabServices/labs/write",
        "Microsoft.LabServices/labs/delete",
        "Microsoft.LabServices/labs/publish/action",
        "Microsoft.LabServices/labs/syncGroup/action",
        "Microsoft.LabServices/labs/schedules/read",
        "Microsoft.LabServices/labs/schedules/write",
        "Microsoft.LabServices/labs/schedules/delete",
        "Microsoft.LabServices/labs/users/read",
        "Microsoft.LabServices/labs/users/write",
        "Microsoft.LabServices/labs/users/delete",
        "Microsoft.LabServices/labs/users/invite/action",
        "Microsoft.LabServices/labs/virtualMachines/read",
        "Microsoft.LabServices/labs/virtualMachines/start/action",
        "Microsoft.LabServices/labs/virtualMachines/stop/action",
        "Microsoft.LabServices/labs/virtualMachines/reimage/action",
        "Microsoft.LabServices/labs/virtualMachines/redeploy/action",
        "Microsoft.LabServices/labs/virtualMachines/resetPassword/action",
        "Microsoft.LabServices/locations/usages/read",
        "Microsoft.LabServices/skus/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.LabServices/labPlans/createLab/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Lab Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Lab Creator

Lets you create new labs under your Azure Lab Accounts.

[Learn more](/azure/lab-services/administrator-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labAccounts/*/read |  |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labAccounts/createLab/action | Create a lab in a lab account. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labAccounts/getPricingAndAvailability/action | Get the pricing and availability of combinations of sizes, geographies, and operating systems for the lab account. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labAccounts/getRestrictionsAndUsage/action | Get core restrictions and usage for this subscription |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/images/read | Get the properties of an image. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/read | Get the properties of a lab plan. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/saveImage/action | Create an image from a virtual machine in the gallery attached to the lab plan. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/read | Get the properties of a lab. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/schedules/read | Get the properties of a schedule. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/users/read | Get the properties of a user. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/read | Get the properties of a virtual machine. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/locations/usages/read | Get Usage in a location |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/skus/read | Get the properties of a Lab Services SKU. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/createLab/action | Create a new lab from a lab plan. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you create new labs under your Azure Lab Accounts.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b97fb8bc-a8b2-4522-a38b-dd33c7e65ead",
  "name": "b97fb8bc-a8b2-4522-a38b-dd33c7e65ead",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.LabServices/labAccounts/*/read",
        "Microsoft.LabServices/labAccounts/createLab/action",
        "Microsoft.LabServices/labAccounts/getPricingAndAvailability/action",
        "Microsoft.LabServices/labAccounts/getRestrictionsAndUsage/action",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.LabServices/labPlans/images/read",
        "Microsoft.LabServices/labPlans/read",
        "Microsoft.LabServices/labPlans/saveImage/action",
        "Microsoft.LabServices/labs/read",
        "Microsoft.LabServices/labs/schedules/read",
        "Microsoft.LabServices/labs/users/read",
        "Microsoft.LabServices/labs/virtualMachines/read",
        "Microsoft.LabServices/locations/usages/read",
        "Microsoft.LabServices/skus/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.LabServices/labPlans/createLab/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Lab Creator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Lab Operator

Gives you limited ability to manage existing labs.

[Learn more](/azure/lab-services/administrator-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/images/read | Get the properties of an image. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/read | Get the properties of a lab plan. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/saveImage/action | Create an image from a virtual machine in the gallery attached to the lab plan. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/publish/action | Publish a lab by propagating image of the template virtual machine to all virtual machines in the lab. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/read | Get the properties of a lab. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/schedules/read | Get the properties of a schedule. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/schedules/write | Create new or update an existing schedule. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/schedules/delete | Delete the schedule. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/users/read | Get the properties of a user. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/users/write | Create new or update an existing user. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/users/delete | Delete the user. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/users/invite/action | Send email invitation to a user to join the lab. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/read | Get the properties of a virtual machine. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/start/action | Start a virtual machine. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/stop/action | Stop and deallocate a virtual machine. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/reimage/action | Reimage a virtual machine to the last published image. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/redeploy/action | Redeploy a virtual machine to a different compute node. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labs/virtualMachines/resetPassword/action | Reset local user's password on a virtual machine. |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/locations/usages/read | Get Usage in a location |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/skus/read | Get the properties of a Lab Services SKU. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "The lab operator role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a36e6959-b6be-4b12-8e9f-ef4b474d304d",
  "name": "a36e6959-b6be-4b12-8e9f-ef4b474d304d",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.LabServices/labPlans/images/read",
        "Microsoft.LabServices/labPlans/read",
        "Microsoft.LabServices/labPlans/saveImage/action",
        "Microsoft.LabServices/labs/publish/action",
        "Microsoft.LabServices/labs/read",
        "Microsoft.LabServices/labs/schedules/read",
        "Microsoft.LabServices/labs/schedules/write",
        "Microsoft.LabServices/labs/schedules/delete",
        "Microsoft.LabServices/labs/users/read",
        "Microsoft.LabServices/labs/users/write",
        "Microsoft.LabServices/labs/users/delete",
        "Microsoft.LabServices/labs/users/invite/action",
        "Microsoft.LabServices/labs/virtualMachines/read",
        "Microsoft.LabServices/labs/virtualMachines/start/action",
        "Microsoft.LabServices/labs/virtualMachines/stop/action",
        "Microsoft.LabServices/labs/virtualMachines/reimage/action",
        "Microsoft.LabServices/labs/virtualMachines/redeploy/action",
        "Microsoft.LabServices/labs/virtualMachines/resetPassword/action",
        "Microsoft.LabServices/locations/usages/read",
        "Microsoft.LabServices/skus/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Lab Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Lab Services Contributor

Enables you to fully control all Lab Services scenarios in the resource group.

[Learn more](/azure/lab-services/administrator-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/* | Create and manage lab services components |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/labPlans/createLab/action | Create a new lab from a lab plan. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "The lab services contributor role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f69b8690-cc87-41d6-b77a-a4bc3c0a966f",
  "name": "f69b8690-cc87-41d6-b77a-a4bc3c0a966f",
  "permissions": [
    {
      "actions": [
        "Microsoft.LabServices/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.LabServices/labPlans/createLab/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Lab Services Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Lab Services Reader

Enables you to view, but not change, all lab plans and lab resources.

[Learn more](/azure/lab-services/administrator-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.LabServices](../permissions/devops.md#microsoftlabservices)/*/read | Read lab services properties |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "The lab services reader role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/2a5c394f-5eb7-4d4f-9c8e-e8eae39faebc",
  "name": "2a5c394f-5eb7-4d4f-9c8e-e8eae39faebc",
  "permissions": [
    {
      "actions": [
        "Microsoft.LabServices/*/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Lab Services Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Load Test Contributor

View, create, update, delete and execute load tests. View and list load test resources but can not make any changes.

[Learn more](/azure/load-testing/how-to-assign-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.LoadTestService](../permissions/devops.md#microsoftloadtestservice)/*/read | Read load testing resources |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.LoadTestService](../permissions/devops.md#microsoftloadtestservice)/loadtests/* | Create and manage load tests |
> | [Microsoft.LoadTestService](../permissions/devops.md#microsoftloadtestservice)/testProfiles/* |  |
> | [Microsoft.LoadTestService](../permissions/devops.md#microsoftloadtestservice)/testProfileRuns/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "View, create, update, delete and execute load tests. View and list load test resources but can not make any changes.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/749a398d-560b-491b-bb21-08924219302e",
  "name": "749a398d-560b-491b-bb21-08924219302e",
  "permissions": [
    {
      "actions": [
        "Microsoft.LoadTestService/*/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Insights/alertRules/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.LoadTestService/loadtests/*",
        "Microsoft.LoadTestService/testProfiles/*",
        "Microsoft.LoadTestService/testProfileRuns/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Load Test Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Load Test Owner

Execute all operations on load test resources and load tests

[Learn more](/azure/load-testing/how-to-assign-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.LoadTestService](../permissions/devops.md#microsoftloadtestservice)/* | Create and manage load testing resources |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.LoadTestService](../permissions/devops.md#microsoftloadtestservice)/* | Create and manage load testing resources |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Execute all operations on load test resources and load tests",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/45bb0b16-2f0c-4e78-afaa-a07599b003f6",
  "name": "45bb0b16-2f0c-4e78-afaa-a07599b003f6",
  "permissions": [
    {
      "actions": [
        "Microsoft.LoadTestService/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Insights/alertRules/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.LoadTestService/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Load Test Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Load Test Reader

View and list all load tests and load test resources but can not make any changes

[Learn more](/azure/load-testing/how-to-assign-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.LoadTestService](../permissions/devops.md#microsoftloadtestservice)/*/read | Read load testing resources |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.LoadTestService](../permissions/devops.md#microsoftloadtestservice)/loadtests/readTest/action | Read Load Tests |
> | [Microsoft.LoadTestService](../permissions/devops.md#microsoftloadtestservice)/testProfiles/read | Read Test Profiles |
> | [Microsoft.LoadTestService](../permissions/devops.md#microsoftloadtestservice)/testProfileRuns/read | Read Test Profile Runs |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "View and list all load tests and load test resources but can not make any changes",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/3ae3fb29-0000-4ccd-bf80-542e7b26e081",
  "name": "3ae3fb29-0000-4ccd-bf80-542e7b26e081",
  "permissions": [
    {
      "actions": [
        "Microsoft.LoadTestService/*/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Insights/alertRules/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.LoadTestService/loadtests/readTest/action",
        "Microsoft.LoadTestService/testProfiles/read",
        "Microsoft.LoadTestService/testProfileRuns/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Load Test Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)