# **NNF Resource Update & Commit Scenarios**
## Background

Currently, NNF resources don’t support dynamic updates and operator needs to disable a parent resource (for example, L3 Isolation domain) and reput the parent or child resource with updated values and execute the administrative post action to enable and configure the devices. NNF’s new resource update flow will provide an ability to batch and update a set of NNF resources via a commitConfiguration POST action when resources are enabled. There's no change if the user chooses the current workflow of disabling L3 Isolation domain, making changes and the enabling L3 Isolation domain.


## NNF Resource Update Overview

Any CUD (Create, Update, Delete) operation on a child resource, which is linked to an existing enabled   parent resource or an update to an enabled parent resource property will be considered as an “Update Operation”. A few examples would be a new Internal network, or a new subnet needs to be added to an existing enabled Layer 3 Isolation domain (Internal network is a child resource of Layer 3 isolation domain). A new route policy needs to be attached to existing internal network; both these scenarios qualify for an “Update Operation”.

Any update operation carried out on supported NNF resources (supported list   in section below) will put the fabric into a pending commit state (currently “Accepted” state in Configuration state) where the user must initiate a ”fabric commit-configuration” action to apply the desired changes. All updates to NNF resources (including child   resources) in fabric will follow the same workflow.

Commit action/updates to resources shall only be valid and applicable when the fabric is in provisioned state and NNF resources are in administrative state “Enabled”. Updates to parent and child resources can be batched (across various NNF resources) and a commitConfiguration action can be performed to execute all changes in a single POST action. 

Creation of parent resources and enablement via administrative action   is independent of Update/Commit Action workflow. Additionally, all administrative actions to enable / disable are independent and shall not require commitConfiguration action trigger for execution. CommitConfiguration action is only applicable to a scenario when operator wants to update any existing Azure Resource Manager (ARM) resources and fabric, parent resource is in enabled state. Any automation scripts or bicep templates, which were used by the operators to create NNF resource and enable will require no changes.

## **User Workflow**

To successfully execute update resources, fabric must be in provisioned state. The following steps are involved in updating NNF resources.

1. Operator updates the required NNF resources (multiple resources updates can be batched) which were already enabled (config applied to devices) using update call on NNF resources via AzCli, Azure Resource Manager (ARM), Portal. (Supported scenarios, resources and parameters’ details are in the table below). In the following example, a new internal network is  added to an existing L3 Isolation Domain “l3domain101523-sm".

 **CLI example snippet**
 ```azurecli
“az networkfabric internalnetwork create --subscription 5ffad143-8f31-4e1e-b171-fa1738b14748 --resource-group "Fab3Lab-4-1-PROD" --l3-isolation-domain-name "l3domain101523-sm" --resource-name "internalnetwork101523" --vlan-id 789 --mtu 1432 --connected-ipv4-subnets "[{prefix:'10.252.11.0/24'},{prefix:'10.252.12.0/24'}]"
 ```

2. Once the Azure Resource Manager (ARM) update call succeeds, the specific resource's ConfigurationState is set to Accepted and when it fails, it's set to Rejected. Fabric ConfigurationState is set to Accepted    irrespective of PATCH call success/failure.

3. If any Azure Resource Manager (ARM) resource on the fabric such as, Internal Network or RoutePolicy, is in “Rejected” state, the Operator has to correct the configuration  and ensure the specific resource's ConfigurationState is set to Accepted before proceeding further.

4. Operator executes the commitConfiguration POST action on Fabric resource.
 **CLI example snippet**
 ```azurecli
  “az networkfabric fabric commit-configuration --subscription 5ffad143-8f31-4e1e-b171-fa1738b14748 --resource-group "FabLAB-4-1-PROD" --resource-name "nffab3-4-1-prod"
 ```
5.  Service validates if all the resource updates   succeeded and does more validation on inputs. It also validates connected logical resources to ensure consistent behavior and configuration. Once all validations succeed, the new configuration is generated and pushed to the devices.

6. Specific resource configurationState is reset to Succeeded   and Fabric configurationState is set to Provisioned. (Refer table below)

7. If the commitConfiguration action fails, the service will show appropriate error message and notify the operator of the potential NNF resource update failure.  (Refer table below)

## **## NNF States- Update/Commit flow** 




|States	|Definition|Prior to Azure Resource Manager (ARM) Resource Update  |Prior to CommitConfiguration  & Post Azure Resource Manager (ARM) update  |Post CommitConfiguration  ||
|--|--|--|--|--|--
| Administrative State | State to represent  administrative action performed on the resource | Enabled (Only enabled is supported) | Enabled (Only enabled is supported) |Enabled(Can be disabled by the user)  |
| Configuration State | State to represent operator actions/service driven configurations |**Resource state** -	Succeeded, **Fabric State** - Provisioned  | 	 **Resource state** - Accepted (In case of success), 	Rejected (Incase of failure), **Fabric State**  - Accepted| 	**Resource state** -	Accepted (In case of failure), Succeeded (In case of Success), **Fabric State**  -Provisioned|
 |Provisioning State|State to represent Azure Resource Manager (ARM) provisioning state of resources|Provisioned|Provisioned|Provisioned|

				

# **Supported NNF resources and scenarios:**


**NNF Update Support NNF resources (NNF 4.1,Nexus 2310.1)**

| NNF Resource |Type  | Scenarios Supported | Scenarios Not Supported | Notes |
|--|--|--|--|--|
| Layer 2 Isolation Domain | Parent |* Update to properties – MTU <br>* Addition/update tags  |*Re-PUT of resource  |  |
|Layer 3 Isolation Domain  |Parent  |* Update to properties, <br> * Redistribute connected<br>  * Redistribute static routes.<br> * Aggregate route configuration <br>* Connected subnet route policy. <br> *Addition/update tags |* Re-PUT of resource  |  |
|  Internal Network|Child (of L3 ISD)  | *Adding a new Internal network <br> *Update to properties <br> *MTU Addition/Update of connected IPv4/IPv6 subnets<br> *Addition/Update of IPv4/IPv6 RoutePolicy <br> *Addition/Update of Egress/Ingress ACL <br>*Update isMonitoringEnabled flag<br> *Addition/Update to Static routes <br> *BGP Config,<br> *Addition/update tags	                                                        |Re-PUT of resource  | Deleting an Internal network when parent Layer 3 Isolation domain is enabled. To delete the resource, the parent resource must be disabled |
|External Network  | Child (of L3 ISD) | *Update to properties <br> *MTU <br>*Addition/Update of connected IPv4/IPv6 subnets<br> *Addition/Update of IPv4/IPv6 RoutePolicy <br> *Addition/Update of Egress/Ingress ACL <br>*Option A properties – BFD Configuration <br>*Option B properties – Route Targets <br>*Addition/Update of tags | Re-PUT of resource. <br> * Creating a new external network|Deleting an External network when parent Layer 3 Isolation domain is enabled.	To delete the resource the parent resource must be disabled. NOTE: Only one external network is supported per ISD  |
|Route Policy   | Parent | *Update entire statement including seq number, condition, action. <br> *Addition/update tags | *Re-PUT of resource. <br> *Update to Route Policy linked to a Network-to-Network Interconnect resource. | To delete the resource the connectedResource (like IsolationDomain or N-to-N Interconnect) shouldn’t hold any reference. |
| IPCommunity  |Parent	  | * Update entire ipCommunity rule including seq number, action, community members, well known communities. <br> *Addition/update tags | * Re-PUT of resource	 | To delete the resource the connected RoutePolicy Resource shouldn’t hold any reference.  |
|IPCommunity  |Parent  | * Update the entire IPPrefix rule including seq number, networkPrefix, condition, subnetMask Length. <br> *Addition/update tags|Re-PUT of resource  | 	To delete the resource the connected RoutePolicy Resource shouldn’t hold any reference. |
| IPExtendedCommunity	 | Parent |* Update entire IPExtended community rule including seq number, action, route targets. <br>*Addition/update tags  |Re-PUT of resource  | To delete the resource the connected RoutePolicy Resource shouldn’t hold any reference. |
|ACLs  | Parent |*Addition/Update to match configurations and dynamic match configurations.<br> *Update to configuration type <br> *Addition/updating ACLs URL <br>*Addition/update tags | Re-PUT of resource. | Update to ACLs linked to a Network-to-Network Interconnect resource.	To delete the resource the connectedResource (like IsolationDomain or N-to-N Interconnect) shouldn’t hold any reference. |
|  |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |



## **Additional Notes on Behavior/Constraints**
- NNF update flow is by default disabled and would require a request to be raised via a support ticket to enable the feature.
- If a parent resource is in administrative state “disabled” and there are changes made to either to the parent or the child resources, commitConfiguration action isn't applicable as enabling the resource would push the configuration. Commit path for such resources shall be triggered only when the parent resource is in administrative state “enabled”.
- If commitConfiguration fails the fabric continues to stay in configuration state “Accepted” until the user addresses the issues and does commitConfiguration again, which is successful. There's currently only roll-forward mechanisms if there's failure provided to the user.
- If the Fabric configuration state is in “Accepted” and has updates to Azure Resource Manager (ARM) resources, which are yet to be committed then no administrative action is allowed on the resources.
 - If the Fabric configuration state is in “Accepted” and has updates to Azure Resource Manager (ARM) resources, which are yet to be committed then delete operation on supported resources can’t be triggered
- Creation of parent resources is independent of commitConfiguration and update flow. On all the supported resources reput of the resources aren't supported.
- NNF resource update is supported for both Greenfield deployments and Brownfield deployments but with some constraints.
    -  In Greenfield scenario, the Fabric configuration state will be “Accepted” state once there are any updates done NNF resources. Once the commitConfiguration action is triggered, it will move to either Provisioned or Accepted state depending on success or failure of the action.                                             

   - In Brownfield scenario, commitConfiguration action is supported but the supported NNF resources (such as Isolation domains, Internal Networks, RoutePolicy & ACLs) must be created using GA version of the API (2023-06-15). This is a temporary restriction, which will be relaxed post migration of all resources to the latest GA version.
- In Brownfield scenario, the Fabric configuration state will remain in “Provisioned” state when there are changes to any supported NNF resources or commitConfiguration action is triggered. This is temporary behavior until all fabrics are migrated to the latest GA version.
- Route policy and other related resources (IP community, IP Extended Community, IP PrefixList) updates are considered as a list replace operation. All the existing statements will be removed and only the new updated statements will be configured.
- Update or removal of existing subnets, routes, BGP configurations and other relevant network params in Internal network or external networks configuration might cause traffic disruption and should be performed at operators discretion.
- Update of new Route policies and ACLs might cause traffic disruption depending on the rules applied. 

## Future Work
NNF resource update currently supports a limited set of resources and scenarios. Update to following resources will be part of future NNF releases.
- 	Network TAP 
- 	Network TAP rule 
- 	Neighbor Group
- 	Network Fabric
- 	Network-to-Network Interconnect
- 	More scenarios to delete child resources when Parent is enabled.
- 	More scenarios to update existing resources, which are referenced to a non-supported resources (example – route policy or ACLs on NNI)



