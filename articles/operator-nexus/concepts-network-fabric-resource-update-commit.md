---
title: Update and commit Network Fabric resources 
description: Learn how Nexus Network Fabric's resource update flow allows you to batch and update a set of Network Fabric resources.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-nexus
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 04/03/2024

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---

# Update and commit Network Fabric resources

Currently, Nexus Network Fabric resources require that you disable a parent resource (such as an L3Isolation domain) and reput the parent or child resource with updated values and execute the administrative post action to enable and configure the devices. Network Fabric's new resource update flow allows you to  batch and update a set of Network Fabric resources via a `commitConfiguration` POST action when resources are enabled. There's no change if you choose the current workflow of disabling L3 Isolation domain, making changes and the enabling L3 Isolation domain. 

## Network Fabric resource update overview

Any Create, Update, Delete (CUD) operation on a child resource linked to an existing enabled parent resource or an update to an enabled parent resource property is considered an **Update** operation. A few examples would be a new Internal network, or a new subnet needs to be added to an existing enabled Layer 3 Isolation domain (Internal network is a child resource of Layer 3 isolation domain). A new route policy needs to be attached to existing internal network; both these scenarios qualify for an **Update** operation. 

Any update operation carried out on supported Network Fabric resources shown in the following table puts the fabric into a pending commit state (currently **Accepted** in Configuration state) where you must initiate a fabric commit-configuration action to apply the desired changes. All updates to Network Fabric resources (including child resources) in fabric follow the same workflow. 

Commit action/updates to resources shall only be valid and applicable when the fabric is in provisioned state and Network Fabric resources are in an **enabled administrative state. Updates to parent and child resources can be batched (across various Network Fabric resources) and a `commitConfiguration` action can be performed to execute all changes in a single POST action.  

Creation of parent resources and enablement via administrative action is independent of Update/Commit Action workflow. Additionally, all administrative actions to enable / disable are independent and shall not require commitConfiguration action trigger for execution. CommitConfiguration action is only applicable to a scenario when operator wants to update any existing Azure Resource Manager resources and fabric, parent resource is in enabled state. Any automation scripts or bicep templates that were used by the operators to create Network Fabric resource and enable require no changes. 

## User workflow

To successfully execute update resources, fabric must be in provisioned state. The following steps are involved in updating Network Fabric resources. 

1. Operator updates the required Network Fabric resources (multiple resources updates can be batched) which were already enabled (config applied to devices) using update call on Network Fabric resources via AzCli, Azure Resource Manager, Portal. (Refer to the supported scenarios, resources, and parameters' details  in the following table). 

    In the following example, a new `internalnetwork` is  added to an existing L3Isolation **l3domain101523-sm**. 

    ```azurecli
    az networkfabric internalnetwork create --subscription 5ffad143-8f31-4e1e-b171-fa1738b14748 --resource-group "Fab3Lab-4-1-PROD" --l3-isolation-domain-name "l3domain101523-sm" --resource-name "internalnetwork101523" --vlan-id 789 --mtu 1432 --connected-ipv4-subnets "[{prefix:'10.252.11.0/24'},{prefix:'10.252.12.0/24'}]
    ```

1. Once the Azure Resource Manager update call succeeds, the specific resource's `ConfigurationState` is set to **Accepted** and when it fails, it's set to **Rejected**. Fabric `ConfigurationState` is set to **Accepted** regardless of PATCH call success/failure. 

    If any Azure Resource Manager resource on the fabric (such as Internal Network or `RoutePolicy`) is in **Rejected** state, the Operator has to correct the configuration  and ensure the specific resource's ConfigurationState is set to Accepted before proceeding further. 

2. Operator executes the commitConfiguration POST action on Fabric resource. 

    ```azurecli
    az networkfabric fabric commit-configuration --subscription 5ffad143-8f31-4e1e-b171-fa1738b14748 --resource-group "FabLAB-4-1-PROD" --resource-name "nffab3-4-1-prod"
    ```

3. Service validates if all the resource updates succeeded and validates inputs. It also validates connected logical resources to ensure consistent behavior and configuration. Once all validations succeed, the new configuration is generated and pushed to the devices. 

1. Specific resource `configurationState` is reset to **Succeeded** and Fabric `configurationState` is set to **Provisioned**. 
1. If the `commitConfiguration` action fails, the service displays the appropriate error message and notifies the operator of the potential Network Fabric resource update failure. 


|State  |Definition  |Before Azure Resource Manager Resource Update   |Before CommitConfiguration & Post Azure Resource Manager update   |Post CommitConfiguration |
|---------|---------|---------|---------|-----------|
|**Administrative State**     |  State to represent  administrative action performed on the resource        | Enabled (only enabled is supported)         | Enabled (only enabled is supported)         |Enabled (user can disable) |
|**Configuration State**      | State to represent operator actions/service driven configurations         |**Resource State** - Succeeded, <br> **Fabric State**  Provisioned         | **Resource State** <br>- Accepted (Success)<br>-  Rejected (Failure) <br>**Fabric State** <br>- Accepted        | **Resource State** <br> - Accepted (Failure), <br>- Succeeded (Success)<br> **Fabric State**<br> - Provisioned |
|Provisioning State     | State to represent Azure Resource Manager provisioning state of resources     |Provisioned         | Provisioned        | Provisioned |


## Supported Network Fabric resources and scenarios

 Network Fabric Update Support Network Fabric resources (Network Fabric 4.1, Nexus 2310.1) 

| Network Fabric Resource   | Type     | Scenarios Supported | Scenarios Not Supported    |Notes  |
| ----------------- | ----------------- | --------------- | ----- | ----------- |
| **Layer 2 Isolation Domain** | Parent     | -   Update to properties – MTU <br> -   Addition/update tags | *Re-PUT* of resource   | |
| **Layer 3 Isolation Domain** | Parent            | Update to properties <br> -   redistribute connected. <br>-   redistribute static routes. <br>-   Aggregate route configuration <br>-   connected subnet route policy. <br>Addition/update tags   |  *Re-PUT* of resource  |         |
| **Internal Network**       | Child (of L3 ISD) | Adding a new Internal network <br>   Update to properties  <br>-   MTU <br>-   Addition/Update of connected IPv4/IPv6 subnets <br>-   Addition/Update of IPv4/IPv6 RoutePolicy <br>-   Addition/Update of Egress/Ingress ACL <br>-   Update `isMonitoringEnabled` flag <br>-   Addition/Update to Static routes <br>-   BGP Config <br>   Addition/update tags | - *Re-PUT* of resource. <br>-   Deleting an Internal network when parent Layer 3 Isolation domain is enabled.   | To delete the resource, the parent resource must be disabled                      |
| **External Network**         | Child (of L3 ISD) |   Update to properties  <br>-   Addition/Update of IPv4/IPv6 RoutePolicy <br>-   Option A properties MTU, Addition/Update of Ingress and Egress ACLs, <br>-   Option A properties – BFD Configuration <br>-   Option B properties – Route Targets <br>   Addition/Update of tags  | -   *Re-PUT* of resource. <br>-   Creating a new external network <br>-   Deleting an External network when parent Layer 3 Isolation domain is enabled. | To delete the resource, the parent resource must be disabled.<br><br> NOTE: Only one external network is supported per ISD.      |
| **Route Policy**             | Parent            | -   Update entire statement including seq number, condition, action. <br>-   Addition/update tags   | -   *Re-PUT* of resource. <br>-   Update to Route Policy linked to a Network-to-Network Interconnect resource.   | To delete the resource, the `connectedResource` (`IsolationDomain` or N-to-N Interconnect) shouldn't hold any reference. |
| **IPCommunity**              | Parent            |  Update entire ipCommunity rule including seq number, action, community members, well known communities.  |   *Re-PUT* of resource   | To delete the resource, the connected `RoutePolicy` Resource shouldn't hold any reference. |
| **IPPrefixes**               | Parent            | -   Update the entire IPPrefix rule including seq number, networkPrefix, condition, subnetMask Length. <br>-   Addition/update tags  |    *Re-PUT* of resource  | To delete the resource, the connected `RoutePolicy` Resource shouldn't hold any reference. |
| **IPExtendedCommunity**      | Parent            | -   Update entire IPExtended community rule including seq number, action, route targets. <br>-   Addition/update tags    |  *Re-PUT* of resource      | To delete the resource, the connected `RoutePolicy` Resource shouldn't hold any reference.|
| **ACLs**   | Parent            | - Addition/Update to match configurations and dynamic match configurations. <br>-   Update to configuration type <br>-   Addition/updating ACLs URL <br>-   Addition/update tags   | -   *Re-PUT* of resource. <br>-   Update to ACLs linked to a Network-to-Network Interconnect resource.  | To delete the resource, the `connectedResource` (like `IsolationDomain` or N-to-N Interconnect) shouldn't hold any reference.  |

## Behavior notes and constraints

- If a parent resource is in a **Disabled** administrative state and there are changes made to either to the parent or the child resources, the `commitConfiguration` action isn't applicable. Enabling the resource would push the configuration. The commit path for such resources is triggered only when the parent resource is in the **Enabled** administrative state. 

- If `commitConfiguration` fails, then the fabric remains in the **Accepted** in configuration state  until the user addresses the issues and performs a successful `commitConfiguration`. Currently, only roll-forward mechanisms are provided when failure occurs.

- If the Fabric configuration is in an **Accepted** state and has updates to Azure Resource Manager resources yet to be committed, then no administrative action is allowed on the resources. 

- If the Fabric configuration is in an **Accepted** state and has updates to Azure Resource Manager resources yet to be committed, then delete operation on supported resources can't be triggered. 

- Creation of parent resources is independent of `commitConfiguration` and the update flow. *Re-PUT* of resources isn't supported on any resource. 

- Network Fabric resource update is supported for both Greenfield deployments and Brownfield deployments but with some constraints. 

    - In the Greenfield deployment, the Fabric configuration state is **Accepted**  once there are any updates done Network Fabric resources. Once the `commitConfiguration` action is triggered, it moves to either **Provisioned** or **Accepted** state depending on success or failure of the action.  

    - In the Brownfield deployment, the `commitConfiguration` action is supported but the supported Network Fabric resources (such as Isolation domains, Internal Networks, RoutePolicy & ACLs) must be created using general availability version of the API (2023-06-15). This temporary restriction is relaxed following the migration of all resources to the latest version. 

    - In the Brownfield deployment, the Fabric configuration state remains in a **Provisioned** state when there are changes to any supported Network Fabric resources or commitConfiguration action is triggered. This behavior is temporary until all fabrics are migrated to the latest version. 

- Route policy and other related resources (IP community, IP Extended Community, IP PrefixList) updates are considered as a list replace operation. All the existing statements are removed and only the new updated statements are configured. 

- Updating or removing existing subnets, routes, BGP configurations, and other relevant network params in Internal network or external networks configuration might cause traffic disruption and should be performed at operators discretion. 

- Update of new Route policies and ACLs might cause traffic disruption depending on the rules applied.  

- Use a list command on the specific resource type (list all resources of an internal network type) to verify the resources that are updated and aren't committed to device. The resources that have an **Accepted** or **Rejected** configuration state can be filtered and identified as resources that are yet to be committed or where the commit to device fails. 

For example: 

```azurecli
az networkfabric internalnetwork list --resource-group "example-rg" --l3domain  "example-l3domain"
```
