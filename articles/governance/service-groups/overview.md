---
title: "Get started with Service Groups"
description: "Learn how to use and manage resources with Service Groups."
author: rthorn17
ms.author: rithorn
ms.service: Service Groups
ms.topic: concept-article #Don't change
ms.date: 05/19/2025
---

# What are Azure Service Groups?

Service groups in Azure are a low-privilege-based grouping of resources across subscriptions. They provide a way to manage resources with minimal permissions, ensuring that resources can be grouped and managed without granting excessive access. Service Groups are designed to complement existing organizational structures like Resource Groups, Subscriptions, and Management Groups by offering a flexible and secure way to aggregate resources for specific purposes. This article helps give you an overview of what Service Groups are, the scenarios to use them for, and provide guidance on how to get started. 

> [!IMPORTANT]
> Service Groups is currently in PREVIEW. For more information about participating in the preview, see [TBD Link]().
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


## Key capabilities
* **Flexible Membership**: Service Groups allow resources from different subscriptions to be grouped together, providing a unified view and management capabilities. They also allow the grouping of subscriptions, resource groups, and resources. 
* **Low Privilege Management**: Service Groups are designed to operate with minimal permissions, ensuring that users can manage resources without needing excessive access rights.
* **Multiple Hierarchies**: Service Groups live outside of the resource hierarchy enabling scenarios where the same resources need to be group for different purposes.   


### Flexible Membership
Within the hierarchy of resources, there's a limitation of one parent resource container to many children. For example, a resource can only be a member of one resource group or a resource group can only be a member of one subscription. Service Groups introduce a new model that allows a resources or resource containers to have memberships with multiple different Service Groups. The Service Group allows new scenarios where the same resources can be connected to many Service Groups Trees enabling new ways to view your data.  

#### Example Scenarios 
* Aggregating Health Metrics
   * Organizations with multiple applications and environments can use Service Groups to aggregate health metrics across different environments. Member resources or resource containers could be from various environments within different management groups or subscriptions, can be linked to a single Service Group providing a unified view of health metrics.
* Creating Inventory of a specific resource type
    * Customers can connect all Virtual Machines or CosmosDBs to the same Service Groups to get a consolidated view of all the resources of that type in the entire environment. This capability allows a customer like a Virtual Machine Administrator to view aggregated data on all their resources no matter what subscription they live in.

![MGsandSGs](./media/sidebyside.png)

### Low Privilege Management
Service Groups don't have the same inheritance capabilities that other Azure Resource Manager groups have today so that they can use minimal permissions and oversight over resources. This low privilege allows customers to assign only the required permissions needed to manage the Service Groups and its members. The [Azure Role Based Access Controls Permissions]() required to add resources can be assigned separately than the permissions to manage the Service Group itself allowing separation of duties to be defined. 

#### Example Scenarios 
* Aggregating monitoring metrics 
   * Since Service Groups don't inherit permissions to the members, customers can apply least privileges to assign permissions on the Service Groups that allow viewing of metrics. This capability provides a solution where two users can be assigned access to the same Service Group, but only one is allowed to see certain resources. 

### Multiple Hierarchies 
The same resources can be connected to many different service groups allowing different customer personas and scenarios to be created and used. With different Role Based Access Controls being assigned to the multiple Service Groups, customers can create many different views that support how they organize their resources.   

#### Example Scenarios
* Separate Personas 
    * An issue that arose frequently when trying to adopt a strict hierarchy was who would own the parent items. With Service Groups, this situation no longer becomes an issue and the different personas can have their own individual views. Customers can use the same resources to be members of a Workload Service Group, a Department Service Group, and a Service Group with all Production resources. 

![MultipleSGTree](./media/MultiSG.png)

## How it works
Azure Service Groups are a separate hierarchy grouping resources that don't exist in the resource hierarchy with Resource Groups, Subscriptions, and Management Groups. The separation allows Service Groups to be connected many times to different resources and resource containers without impacting the existing structures. 

Information about Service Groups 
* A Service Group is created within the Microsoft.Management Resource Provider, the same Resource Provider that owns Management Groups.  
* Service Groups allow self nesting to create "levels" of groupings just as Management Groups do, but Service Groups can allow up to 10 levels of depth  
* Role assignments on the Service Group can be inherited to the **child Service Groups only**. There's **no inheritance** through the memberships to the resources or resource containers.
* There's a limit of 2000 service group members coming from within the same subscription. This means that within one subscription, resources, or resource groups, there can only be 2,000 memberships to Service Groups. 
* Within the Preview window, there's a Limit of 10,000 Service Groups in a single tenant.   
* Service Groups Names support up to 250 characters. They can be alphanumeric and special characters: - _ ( ) . ~



## Azure Resource Manager Groupings 

Azure offers a wide variety of resources containers that enable our customers to manage resources at many different scales. Service Groups is only the newest in a family of Azure Resource Manager (ARM) containers used to organize your environment.

This table shows a summary of the differences between the groups. 

### Scenario comparison

|Scenario|Resource Group|Subscription|Management Group|Service Group|Tags|
|--------|--------------|------------|----------------|-------------|----|
|Require Inheritance from assignment on scope to each member/descendant resource|Supported*|Supported|Supported|Not Supported|Not Supported|
|Consolidation of resources for reduction of Role Assignments/Policy Assignments|Supported|Supported|Supported|Not Supported|Not Supported|
|Grouping of resources that are shared across scope boundaries. Ex. Global Networking resources in one subscription/resource group that are shared across multiple applications that have their own subscriptions/resource groups. |Not Supported| Not Supported|Not Supported|Supported|Supported|
|Create separate groupings that allow for separate aggregations of metrics|Not Supported|Supported|Supported|Supported|Supported**|
|Enforce enterprise-wide restrictions or organizational configurations across many resources|Supported*|Supported*|Supported*|Not Supported|Supported***|

*: When a policy is applied to a scope, the enforcement is to all of the members within the scope  Ex. On a Resource Group, it only applies to the resources under it.

**: Tags can be applied across scopes and are added to resources individually. Azure Policy has built-in policies that can help manage tags.

***: Azure tags can be used as criteria within Azure Policy to apply policies to certain resources. Azure tags are subject to limitations.

### The Root Service Group 

Service Groups is similar to Management Groups, in that there's only one root Service Group which is the top parent of all service groups in that tenant. Root Service Group's ID is same as its Tenant ID.

Service Groups creates the Root Service Group on the first request received within the Tenant and users can't create or update the root service group.

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
