---
title: Access Control Overview
titleSuffix: Azure Enclave
description: Access Control Overview.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 6/29/2026
---

# Azure Enclave Access Controls

Azure Enclave provides robust identity and access management (IAM) controls to safeguard your environments while ensuring operational flexibility. Azure Enclave supports native Azure RBAC controls and/or isolated access controls at the Community, Enclave, and workload levels through a combination of RBAC role assignments, deny assignments, and deny assignment exclusions that block standard RBAC inheritance and allow for more granular access controls.  

## Community access controls 

- `Community Administration settings` - Define **who has permissions over Community managed resources**. Specify these settings during Community creation or modification. They result in RBAC role assignments and deny assignment exclusions over Community managed resources, such as Virtual WAN, Firewall, and Firewall policy.  

   [![Screenshot showing Community Administration settings in Azure Enclave.](./media/community-create-admin-settings.png)](./media/community-create-admin-settings.png#lightbox)

- `Community Maintenance Mode` - Grants specific users, groups, and service principals deny assignment exclusions over Community managed resources to perform the following RBAC actions:

   | Mode | Permissions |
   |------|-------------|
   | General | `Microsoft.Insights/alertRules/*` <br> `Microsoft.Support/*` <br> `Microsoft.Resources/tags/*` |
   | Advanced | `Microsoft.Network/azureFirewalls/networkRuleCollections/write` <br> `Microsoft.Network/azureFirewalls/applicationRuleCollections/write` <br> `Microsoft.Network/azureFirewalls/natRuleCollections/write` <br> `Microsoft.Network/firewallPolicies/ruleGroups/write` <br> `Microsoft.Insights/dataCollectionRules/*` <br> `Microsoft.Insights/dataCollectionEndpoints/*` <br> `Microsoft.OperationalInsights/workspaces/sharedKeys/action` <br> `Microsoft.Network/virtualHubs/write` <br> `Microsoft.Network/virtualWans/virtualHubs/read` <br> `Microsoft.Network/virtualWans/join/action` <br> `Microsoft.Authorization/policyExemptions/*` |

   [![Screenshot showing Community Maintenance Mode settings in Azure Enclave.](./media/community-create-maintenance-mode.png)](./media/community-create-maintenance-mode.png#lightbox)

## Enclave and workload access controls

Enclave-level access controls determine who can access Enclave managed resources and workload resources. Specify these settings during Enclave creation or modification and for Workload resource groups.

- `Enclave Administration settings` - Define **who has permissions over Enclave managed resources** and result in RBAC role assignments and deny assignment exclusions over Enclave managed resources (virtual network, network security groups, and other resources).

   [![Screenshot showing Enclave Administration settings in Azure Enclave.](./media/enclave-create-admin-settings.png)](./media/enclave-create-admin-settings.png#lightbox)

- `Workload Administration settings` - Define **RBAC inheritance and explicit permissions over Workload resources** and result in RBAC role assignments and deny assignment exclusions over workload resource groups.
  - `RBAC Inheritance`
    - Enabled: Standard Azure RBAC inheritance is enabled for Workload resources.
    - Disabled: Only permissions defined under workload admin settings apply to workload resources.
  - `Reader Access`
    - Allowed: Standard RBAC inheritance is enabled for read permissions only over workload resources.
    - Denied: Read access is denied unless explicitly defined under workload admin settings. 

[![Screenshot showing Workload Administration settings in Azure Enclave.](./media/enclave-create-workload-permissions.png)](./media/enclave-create-workload-permissions.png#lightbox)

- `Enclave Maintenance Mode` - Grants specific users, groups, and service principals deny assignment exclusions over Enclave managed resources to perform the following RBAC actions:

   | Mode | Permissions |
   |------|-------------|
   | General | `Microsoft.Support/*` <br> `Microsoft.Insights/alertRules/*` <br> `Microsoft.Resources/tags/*` |
   | Advanced | `Microsoft.Network/virtualNetworks/write` <br> `Microsoft.Network/routeTables/routes/write` <br> `Microsoft.Resources/deployments/*` <br> `Microsoft.Network/privateDnsZones/*` <br> `Microsoft.Network/privateDnsOperationResults/*` <br> `Microsoft.Network/privateDnsOperationStatuses/*` <br> `Microsoft.Network/virtualNetworks/join/action` <br> `Microsoft.Network/virtualNetworks/subnets/join/action` <br> `Microsoft.Authorization/policyExemptions/*` <br> `Microsoft.Insights/dataCollectionRules/*` <br> `Microsoft.Insights/dataCollectionEndpoints/*` <br> `Microsoft.OperationalInsights/workspaces/sharedKeys/action` |

   [![Screenshot showing Enclave Maintenance Mode settings in Azure Enclave.](./media/enclave-create-maintenance-mode.png)](./media/enclave-create-maintenance-mode.png#lightbox)

## Built in RBAC roles for Azure Enclave

Azure Enclave includes a set of built-in **Role-Based Access Control (RBAC)** roles designed to manage Azure Enclave-specific resource types. These roles provide granular permissions to manage Azure Enclave objects like communities and enclaves, without granting permissions to underlying Azure networking resources such as Virtual WAN or Azure Firewall. 

- **Community Owner** - Grants full control over the Azure Enclave community resource. This role allows the user to configure community-level settings and manage associated enclaves but doesn't permit direct modification of the underlying Azure networking resources (for example, Virtual WAN or firewall).  
- **Community Contributor** - Provides permissions to manage community configurations but doesn't include the ability to delete the resource.   
- **Community Reader** Grants read-only access to view the Azure Enclave community and its settings, such as networking endpoints and diagnostics configurations.  
- **Enclave Owner** - Grants full control over the Azure Enclave enclave resource. Users can manage the enclave’s configuration, including endpoints and workload associations, but can't modify the underlying infrastructure (for example, virtual network or NSGs).  
- **Enclave Contributor** - Provides permissions to manage enclave configurations without the ability to delete the resource.  
- **Enclave Reader** - Grants read-only access to view enclave settings and associated workloads.  
- **Enclave Approver** - Required role for authorizing actions that have been configured to require approvals. 