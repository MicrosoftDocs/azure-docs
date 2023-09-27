---
title: API concepts in Privileged Identity management
description: Information for understanding the APIs in Microsoft Entra Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''
ms.service: active-directory
ms.workload: identity
ms.subservice: pim
ms.topic: how-to
ms.date: 09/12/2023
ms.author: barclayn
ms.reviewer: shaunliu
ms.custom: pim 
ms.collection: M365-identity-device-management
---
# Privileged Identity Management APIs

Privileged Identity Management (PIM), part of Microsoft Entra, includes three providers: 

 - PIM for Microsoft Entra roles 
 - PIM for Azure resources 
 - PIM for Groups 

You can manage assignments in PIM for Microsoft Entra roles and PIM for Groups using Microsoft Graph API. You can manage assignments in PIM for Azure Resources using Azure Resource Manager (ARM) API. This article describes important concepts for using the APIs for Privileged Identity Management. 

Find more details about APIs that allow to manage assignments in the documentation: 

- [PIM for Microsoft Entra roles API reference](/graph/api/resources/privilegedidentitymanagementv3-overview)
- [PIM for Azure resource roles API reference](/rest/api/authorization/privileged-role-eligibility-rest-sample)
- [PIM for Groups API reference](/graph/api/resources/privilegedidentitymanagement-for-groups-api-overview)
- [PIM Alerts for Microsoft Entra roles API reference](/graph/api/resources/privilegedidentitymanagementv3-overview?view=graph-rest-beta#building-blocks-of-the-pim-alerts-apis&preserve-view=true)
- [PIM Alerts for Azure Resources API reference](/rest/api/authorization/role-management-alert-rest-sample)


## PIM API history

There have been several iterations of the PIM API over the past few years. You'll find some overlaps in functionality, but they don't represent a linear progression of versions.

### Iteration 1 – Deprecated

Under the /beta/privilegedRoles endpoint, Microsoft had a classic version of the PIM API, which only supported Microsoft Entra roles and is no longer supported. Access to this API was deprecated in June 2021.

<a name='iteration-2--supports-azure-ad-roles-and-azure-resource-roles'></a>

### Iteration 2 – Supports Microsoft Entra roles and Azure resource roles

Under the `/beta/privilegedAccess` endpoint, Microsoft supported both `/aadRoles` and `/azureResources`. This endpoint is still available in your tenant but Microsoft recommends against starting any new development with this API. This beta API will never be released to general availability and will be eventually deprecated.

<a name='iteration-3-current--pim-for-azure-ad-roles-groups-in-microsoft-graph-api-and-for-azure-resources-in-arm-api-'></a>

### Iteration 3 (Current) – PIM for Microsoft Entra roles, groups in Microsoft Graph API, and for Azure resources in ARM API 

This is the final iteration of the PIM API. It includes:
  - PIM for Microsoft Entra roles in Microsoft Graph API - Generally available. 
  - PIM for Azure resources in ARM API - Generally available. 
  - PIM for groups in Microsoft Graph API - Preview. 
  - PIM Alerts for Microsoft Entra roles in Microsoft Graph API - Preview.
  - PIM Alerts for Azure Resources in ARM API - Preview.

Having PIM for Microsoft Entra roles in Microsoft Graph API and PIM for Azure Resources in ARM API provide a few benefits including:
  - Alignment of the PIM API for regular role assignment API for both Microsoft Entra roles and Azure Resource roles. 
  - Reducing the need to call additional PIM API to onboard a resource, get a resource, or get role definition. 
  - Supporting app-only permissions. 
  - New features such as approval and email notification configuration. 


### Overview of PIM API iteration 3 

PIM APIs across providers (both Microsoft Graph APIs and ARM APIs) follow the same principles. 

#### Assignments management 
To create assignment (active or eligible), renew, extend, of update assignment (active or eligible), activate eligible assignment, deactivate eligible assignment, use resources **\*AssignmentScheduleRequest** and **\*EligibilityScheduleRequest**: 

  - For Microsoft Entra roles: [unifiedRoleAssignmentScheduleRequest](/graph/api/resources/unifiedroleassignmentschedulerequest), [unifiedRoleEligibilityScheduleRequest](/graph/api/resources/unifiedroleeligibilityschedulerequest); 
  - For Azure resources: [Role Assignment Schedule Request](/rest/api/authorization/role-assignment-schedule-requests), [Role Eligibility Schedule Request](/rest/api/authorization/role-eligibility-schedule-requests); 
  - For Groups: [privilegedAccessGroupAssignmentScheduleRequest](/graph/api/resources/privilegedaccessgroupassignmentschedulerequest), [privilegedAccessGroupEligibilityScheduleRequest](/graph/api/resources/privilegedaccessgroupeligibilityschedulerequest). 

Creation of **\*AssignmentScheduleRequest** or **\*EligibilityScheduleRequest** objects may lead to creation of read-only **\*AssignmentSchedule**, **\*EligibilitySchedule**, **\*AssignmentScheduleInstance**, and **\*EligibilityScheduleInstance** objects. 

  - **\*AssignmentSchedule** and **\*EligibilitySchedule** objects show current assignments and requests for assignments to be created in the future. 
  - **\*AssignmentScheduleInstance** and **\*EligibilityScheduleInstance** objects show current assignments only. 

When an eligible assignment is activated (**Create** **\*AssignmentScheduleRequest** was called), the **\*EligibilityScheduleInstance** continues to exist, new **\*AssignmentSchedule** and a **\*AssignmentScheduleInstance** objects will be created for that activated duration. 

For more information about assignment and activation APIs, see [PIM API for managing role assignments and eligibilities](/graph/api/resources/privilegedidentitymanagementv3-overview#pim-api-for-managing-role-assignment). 

 

#### PIM Policies (role settings) 

To manage the PIM policies, use **\*roleManagementPolicy** and **\*roleManagementPolicyAssignment** entities: 
  - For PIM for Microsoft Entra roles, PIM for Groups: [unifiedroleManagementPolicy](/graph/api/resources/unifiedrolemanagementpolicy), [unifiedroleManagementPolicyAssignment](/graph/api/resources/unifiedrolemanagementpolicyassignment) 
  - For PIM for Azure resources: [Role Management Policies](/rest/api/authorization/role-management-policies), [Role Management Policy Assignments](/rest/api/authorization/role-management-policy-assignments) 

The **\*roleManagementPolicy** resource includes rules that constitute PIM policy: approval requirements, maximum activation duration, notification settings, etc. 

The **\*roleManagementPolicyAssignment** object attaches the policy to a specific role. 

For more information about the policy settings APIs, see [role settings and PIM](/graph/api/resources/privilegedidentitymanagementv3-overview#role-settings-and-pim). 

## Permissions 

<a name='pim-for-azure-ad-roles-'></a>

### PIM for Microsoft Entra roles 

For Graph API permissions required for PIM for Microsoft Entra roles, see [Role management permissions](/graph/permissions-reference#role-management-permissions). 

### PIM for Azure resources 

The PIM API for Azure resource roles is developed on top of the Azure Resource Manager framework. You will need to give consent to Azure Resource Management but won’t need any Microsoft Graph API permission. You will also need to make sure the user or the service principal calling the API has at least the Owner or User Access Administrator role on the resource you are trying to administer. 

### PIM for Groups 

For Graph API permissions required for PIM for Groups, see [PIM for Groups – Permissions and privileges](/graph/api/resources/privilegedidentitymanagement-for-groups-api-overview#permissions-and-privileges). 




## Relationship between PIM entities and role assignment entities

The only link between the PIM entity and the role assignment entity for persistent (active) assignment for either Microsoft Entra roles or Azure roles is the **\*AssignmentScheduleInstance**. There is a one-to-one mapping between the two entities. That mapping means roleAssignment and **\*AssignmentScheduleInstance** would both include:  

- Persistent (active) assignments made outside of PIM
- Persistent (active) assignments with a schedule made inside PIM
- Activated eligible assignments

PIM-specific properties (such as end time) will be available only through **\*AssignmentScheduleInstance** object. 

## Next steps

- [Microsoft Entra Privileged Identity Management API reference](/graph/api/resources/privilegedidentitymanagementv3-overview)
