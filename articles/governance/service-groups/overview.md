---
title: "Get started with Service Groups"
description: "Learn how to leverage and manage resources with Service Groups."
author: rthorn17
ms.author: rithorn
ms.service: Service Groups
ms.topic: concept-article #Don't change
ms.date: 05/19/2025
---

# What are Azure Service Groups?

Service groups in Azure are a low-privilege-based grouping of resources across subscriptions. They provide a way to manage resources with minimal permissions, ensuring that resources can be grouped and managed without granting excessive access. Service Groups are designed to complement existing organizational structures like Resource Groups, Subscriptions, and Management Groups by offering a flexible and secure way to aggregate resources for specific purposes. This article will help give you an overview of what Service Groups are, the scenarios to use them for, and provide guidance on how to get started. 

> ![IMPORTANT]
> Service Groups are currently in a Limited Preview state and require Tenant onboarding before trial. To request for onboarding please see [TBD Link](). 


## Key capabilities
* **Flexible Membership**: Service Groups allow resources from different subscriptions to be grouped together, providing a unified view and management capabilities. They also allow the grouping of subscriptions, resource groups, and resources. 
* **Low Privilege Management**: Service Groups are designed to operate with minimal permissions, ensuring that users can manage resources without needing excessive access rights.
* **Multiple Hierarchies**: Service Groups live outside of the resource hierarchy enabling scenarios where the same resources need to be group for different purposes.   


### Flexible Membership
No matter where a resource or resource container exists within the Resource Hierarchy, it has always been limited to one parent resource container. For example a resource can only be a member of one resource group or a resource group can only be a member of one subscriptions. Service Groups introduce a new model that allows a resources or resource containers to have memberships with multiple different Service Groups.  This allows new scenarios where the same resources can be connected to many Service Groups Trees enabling new ways to view your data.  

#### Example Scenarios 
* Aggregating Health Metrics
   * Organizations with multiple applications and environments can use Service Groups to aggregate health metrics across different environments. Member resources or resource containers could be from various environments within different management groups or subscriptions, can be linked to a single Service Group providing a unified view of health metrics.
* Creating Inventory of a specific resource type
    * Customers can connected all Virtual Machines or CosmosDBs to the same Service Groups to get a consolidated view of all the resources of that type in the entire environment.  This allows a customer like a Virtual Machine Administrator simple aggregated data views on all their resources no matter what subscription they live in.  

![MGsandSGs](./media/sidebyside.png)

### Low Privilege Management
Service Groups do not have the same inheritance capabilities that other ARM groups have today so that they can leverage minimal permissions and oversight over resources. This allows customers to assign only the required permissions needed to manage the Service Groups and its members. The [RBAC Permissions]() required to add resources can be assigned separately than the permissions to mange the Service Group itself allowing separation of duties to be defined. 

#### Example Scenarios 
* Aggregating Monitor Telemetry 
   * Since Service Groups do not inherit permissions to the members, customers can leverage least privileges to assign permissions on the Service Groups that allow viewing of telemetry. This provides a level of separation where two users might be assigned access to the same SG, but one user might be allowed to see certain regulated resources, while the other is not.  

### Multiple Hierarchies 
The same resources can be connected to many different service groups allowing different customer personas and scenarios to be created and used.  With different RBAC roles being assigned to the the multiple SGs, customers can create many different views that support how they organize their resources.   

#### Example Scenarios
* Separate Personas 
    * An issue that arose frequently when trying to adopt a sine hierarchy was who would own the parent items.  With Service Groups this no longer becomes an issue and the different personas can have their own individual views. Customers can use the same resources to be members of a Workload Service Group, a Department Service Group, and a Service Group with all Production resources. 

![MultipleSGTree](./media/MultiSG.png)

## How it works
Azure Service Groups are a separate hierarchy grouping object that don't exist in the resource hierarchy.  This allows Service Groups to be connected many times to different resources and resource containers without impacting the existing structures. 

Information about Service Groups 
* A Service Group is created within the Microsoft.Management Resource Provider, the same Resource Provider that owns Management Groups.  
* Service Groups allow self nesting to create "levels" of groupings just as Management Groups do, but Service Groups can allow up to 10 levels of depth  
* Role assignments on the Service Group can be inherited to the **child Service Groups only**. There is **no inheritance** through the memberships to the resources or resource containers.
* There is a limit of 2000 memberships source from within the same subscription.  This means that within one subscription, no matter a resource or resource group, there can only be 2000 memberships to Service Groups. 
* Within the Preview window there is a Limit of 10,000 Service Groups in a single tenant.   
* Service Groups Names support up to 250 characters.  They can be alphanumeric and special characters: - _ ( ) . ~



## Azure Resource Manager Groupings 

Azure offers a wide variety of resources containers that enable our customers to mange resources at many different scales.  Service Groups is only the newest in a family of Azure Resource Manager (ARM) containers used to organize your environment.

This table shows a summary of the differences between the groups. 

### Scenario comparison

|Scenario|Resource Group|Subscription|Management Group|Service Group|Tags|
|--------|--------------|------------|----------------|-------------|----|
|Require Inheritance from assignment on scope to each member/descendant resource|Supported*|Supported|Supported|Not Supported|Not Supported|
|Consolidation of resources for reduction of Role Assignments/Policy Assignments|Supported|Supported|Supported|Not Supported|Not Supported|
|Grouping of resources that are shared across scope boundaries. Ex. Global Networking resources in one subscription/resource group that are shared across multiple applications that have their own subscriptions/resource groups. |Not Supported| Not Supported|Not Supported|Supported|Supported|
|Create separate groupings that allow for separate aggregations of metrics/telemetry|Not Supported|Supported|Supported|Supported|Supported**|
|Enforce enterprise-wide restrictions or organizational configurations across many resources|Supported*|Supported*|Supported*|Not Supported|Supported***|

*: When a policy is applied to a scope, the enforcement is to all of the members within the scope.  Ex. On a Resource Group, it only applies to the resources under it.

**: Tags can be applied across scopes and are added to resources individually.  Azure Policy has built-in polices that can help manage tags.

***: Azure tags can be used as criteria within Azure Policy to apply policies to certain resources.  Azure tags are subject to limitations.

### The Root Service Group 

Service Groups is similar to Management Groups, in that there will be only one root Service Group which will be top most parent of all service groups in that tenant. Root Service Group's id will be same as its tenant id.

Also as Management Groups, if root entity of Service Group is not already created, it will be created in the background when it is provided as parent-resourceId. Users cannot create root entity of serviceGroup type on their own.

```json
/providers/microsoft.management/servicegroups/<tenantId>
```

Access to the root has to be given from a user with "microsoft.authorization/roleassignments/write" permissions at the tenant level. For example, the Tenant's Global Administrator can elevate their access on the tenant to have these permissions. [Details on elevating Tenant Global Administrator Accesses](https://learn.microsoft.com/en-us/azure/role-based-access-control/elevate-access-global-admin?tabs=azure-portal%2Centra-audit-logs)


## Next step -or- Related content

> [!div class="nextstepaction"]
> [Getting Started: Service Groups](link.md)

-or-

* [How to: Connect Service Group Members](link.md)
* [How to:](link.md)
* [Related article title](link.md)
* [Service Group REST API Spec]()
* [Service Group Member REST API Spec]()