---
title: "Get started with Service Groups - Azure Governance"
description: "Learn how to use and manage resources with Service Groups."
author: kenieva
ms.author: kenieva
ms.service: azure-policy
ms.topic: overview
ms.date: 05/19/2025
ms.custom:
  - build-2025
---

# What are Azure Service Groups?

Azure Service Groups offer a flexible way to organize and manage resources across subscriptions and resource groups, parallel to any existing Azure resource hierarchy. They're ideal for scenarios requiring cross-boundary grouping, minimal permissions, and aggregations of data across resources. These features empower teams to create tailored resource collections that align with operational, organizational, or persona-based needs. This article helps give you an overview of what Service Groups are, the scenarios to use them for, and important facts.

> [!IMPORTANT]
> Azure Service Groups is currently in public preview. 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


## Key capabilities
- **Multiple Hierarchies**: Service Groups enable scenarios where the resources can be grouped in different views for multiple purposes.
- **Flexible Membership**: Service Groups allow resources from different subscriptions to be grouped together, providing a unified view and management capabilities. They also allow the grouping of subscriptions, resource groups, and resources. The same resources can be connected to many different service groups allowing different customer personas and scenarios to be created and used. 
- **Low Privilege Management**: Service Groups are designed to operate with minimal permissions, ensuring that users can manage resources without needing excessive access rights.


### Example Scenarios
Customers can create many different views that support how they organize their resources.  

* Unified View of Resources
   * Organizations with multiple applications and environments can use Service Groups to create a centralized view of resource information across different environments. Member resources or resource containers from various environments within different management groups or subscriptions can be linked to a single Service Group, providing a unified reference point for resource details.
   * Since Service Groups don’t inherit permissions from their members, customers can apply least-privilege principles to assign permissions on the Service Groups that allow viewing of resource information. This capability enables scenarios where two users can access the same Service Group, but only one is allowed to see certain resources.
        
* Creating Inventory
    * Customers can connect resources to the Service Groups to get a consolidated view of all the resources of a particular type or function in the entire environment.

:::image type="content" source="./media/side-by-side.png" alt-text="Diagram showing the Management Group and Service Group Hierarchies within the Microsoft Entra Tenant" Lightbox="./media/side-by-side.png":::  

* Varying Personas 
    * With Service Groups, organizations have the ability to manage multiple hierarchies over the same resources for different personas and their own individual views. Customers can use the same resources to be members of a Workload Service Group, a Department Service Group, and a Service Group with all Production resources. 

:::image type="content" source="./media/multiple-service-group.png" alt-text="Diagram that shows multiple service group branches." Lightbox="./media/multiple-service-group.png":::


## How it works
Azure Service Groups are a parallel tenant level hierarchy that allows the grouping of resources. The separation from Management Groups, Subscriptions, and Resource Groups allows Service Groups to be connected many times to different resources and resource containers without impacting the existing structures. 

Information about Service Groups 
* A Service Group is created within the Microsoft.Management Resource Provider.  
* Service Groups allow self nesting to create up to 10 "levels" of grouping depth. Nesting can be managed via the 'parent' property within the Service Group resource. 
* Role assignments on the Service Group can be inherited to the **child Service Groups only**. There's **no inheritance** through the memberships to the resources or resource containers.
* There's a limit of 2000 service group members coming from within the same subscription. 
* Within the Preview window, there's a limit of 10,000 Service Groups in a single tenant.   
* Service Groups and Service Group Member IDs support up to 250 characters. They can be alphanumeric and special characters: - _ ( ). ~
* Service Groups require a globally unique ID. Two Microsoft Entra tenants can't have a Service Group with identical IDs.
* Membership to Service Groups are managed by the 'Microsoft.Relationship/ServiceGroupMember' on the desired member (a resource, resource group, or subscription) while targeting the desired Service Group. 


## Azure Resource Manager Groupings 

Azure offers a wide variety of resources containers that enable our customers to manage resources at many different scales. Service Groups is only the newest in a family of Azure Resource Manager (ARM) containers used to organize your environment.

This table shows a summary of the differences between the groups. 

### Scenario comparison

[!INCLUDE [scenario-comparison](../includes/scenario-comparison.md)]

## Important facts about service groups

- A single tenant can support 10,000 service groups.
- Service group tree can support up to 10 levels of depth.
  This limit doesn't include the root level.
- Each service group can have many children.
- A single service group name/ID can be up to 250 characters.
- There are no limits of number of members of service groups, but there's a limit of 2,000 relationships (including ServiceGroupMember) within a subscription

## The Root Service Group 

Service Groups, similarly to Management Groups, has a one root Service Group, which is the top parent of all service groups in that tenant. Root Service Group's ID is same as its Tenant ID.

Service Groups creates the Root Service Group on the first request received within the Tenant and users can't create or update the root service group. _"/providers/microsoft.management/servicegroups/[tenantId]"_

Access to the root has to be given from a user with "microsoft.authorization/roleassignments/write" permissions at the tenant level. For example, the Tenant's Global Administrator can elevate their access on the tenant to have these permissions. [Details on elevating Tenant Global Administrator Accesses](../../role-based-access-control/elevate-access-global-admin.md)

## Role Based Access Controls 
There are three built-in roles definitions to support Service Groups in the preview.  

> [!NOTE]
> Custom Role Based Access Controls aren't supported during the Preview. 

- [Service Group Administrator](../../role-based-access-control/built-in-roles/management-and-governance.md#service-group-administrator): This built-in role manages all aspects of Service Groups and Relationships and is the *default role* given to users when they create a Service Group.


- [Service Group Contributor](../../role-based-access-control/built-in-roles/management-and-governance.md#service-group-contributor): This built-in role should be given to users when they need to create or manage the lifecycle of a Service Group. This role allows for all actions except for Role Assignment capabilities.  


- [Service Group Reader](../../role-based-access-control/built-in-roles/management-and-governance.md#service-group-reader): This built-in role provides read-only access to service group information and can be assigned to other resources in order to view the connected relationships.


Anyone with valid permissions within the tenant is able to create a service group under the root. The user who creates the service group becomes the 'Service Group Administrator'. In order to edit the service group or create children service groups, a user must have 'Service Group Contributor' at that service group. To add members, users must have 'Service Group Contributor' on the service group and Microsoft.Relationship/write on the resource. 


## Related content
* [Quickstart: Create a service group with REST API](create-service-group-rest-api.md)
* [How to: Manage Service Groups](manage-service-groups.md)
* [Connect service group members with REST API](create-service-group-member-rest-api.md)

