---
title: API concepts in Privileged Identity management
description: Information for understanding the APIs in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.workload: identity
ms.subservice: pim
ms.topic: how-to
ms.date: 04/18/2022
ms.author: billmath
ms.reviewer: shaunliu
ms.custom: pim 
ms.collection: M365-identity-device-management
---
# Understand the Privileged Identity Management APIs

You can perform Privileged Identity Management (PIM) tasks using the Microsoft Graph APIs for Azure Active Directory (Azure AD) roles and groups, and the Azure Resource Manager API for Azure resource roles. This article describes important concepts for using the APIs for Privileged Identity Management.

For requests and other details about PIM APIs, check out:

- [PIM for Azure AD roles API reference](/graph/api/resources/privilegedidentitymanagementv3-overview)
- [PIM for groups API reference (preview))(/graph/api/resources/privilegedidentitymanagement-for-groups-api-overview)
- [PIM for Azure resource roles API reference](/rest/api/authorization/roleeligibilityschedulerequests)

## PIM API history

There have been several iterations of the PIM APIs over the past few years. You'll find some overlaps in functionality, but they don't represent a linear progression of versions.

### Iteration 1 – Deprecated

Under the `/beta/privilegedRoles` endpoint, Microsoft had a classic version of the PIM APIs which only supported Azure AD roles. Access to this API was retired in June 2021.

### Iteration 2 – Supports Azure AD roles and Azure resource roles

Under the `/beta/privilegedAccess` endpoint, Microsoft supported both `/aadRoles` and `/azureResources`. The `/aadRoles` endpoint has been retired but the `/azureResources` endpoint is still available in your tenant. Microsoft recommends against starting any new development with the APIs available through the `/azureResources` endpoint. This API will never be released to general availability and will be eventually deprecated and retired.

### Current iteration – Azure AD roles and groups in Microsoft Graph and Azure resource roles in Azure Resource Manager

Currently, in general availability, this is the final iteration of the PIM APIs. Based on customer feedback, the PIM APIs for managing Azure AD roles are now under the **unifiedRoleManagement** set of APIs and the Azure Resource PIM APIs is now under the Azure Resource Manager role assignment APIs. These locations also provide a few additional benefits including:

- Alignment of the PIM APIs for regular role assignment of both Azure AD roles and Azure Resource roles.
- Reducing the need to call additional PIM APIs to onboard a resource, get a resource, or get a role definition.
- Supporting app-only permissions.
- New features such as approval and email notification configuration.

This iteration also includes PIM APIs for managing ownership and membership of groups as well as security alerts for PIM for Azure AD roles.

## Current permissions required

### Azure AD roles

To understand the permissions that you need to call the PIM Microsoft Graph API for Azure AD roles, see [Role management permissions](/graph/permissions-reference#role-management-permissions).

The easiest way to specify the required permissions is to use the Azure AD consent framework.

### Azure resource roles

  The PIM API for Azure resource roles is developed on top of the Azure Resource Manager framework. You will need to give consent to Azure Resource Management but won’t need any Microsoft Graph API permission. You will also need to make sure the user or the service principal calling the API has at least the Owner or User Access Administrator role on the resource you are trying to administer.

## Calling PIM API with an app-only token

### Azure AD roles

  PIM API now supports app-only permissions on top of delegated permissions.

- For app-only permissions, you must call the API with an application that's already been consented with either the required Azure AD or Azure role permissions.
- For delegated permission, you must call the PIM API with both a user and an application token. The user must be assigned to either the Global Administrator role or Privileged Role Administrator role, and ensure that the service principal calling the API has at least the Owner or User Access Administrator role on the resource you are trying to administer.

### Azure resource roles

  PIM API for Azure resources supports both user only and application only calls. Simply make sure the service principal has either the owner or user access administrator role on the resource.

## Design of current API iteration

PIM API consists of two categories that are consistent for both the API for Azure AD roles and Azure resource roles: assignment and activation API requests, and policy settings.

### Assignment and activation APIs

To make eligible assignments, time-bound eligible or active assignments, and to activate eligible assignments, PIM provides the following resources:

- [unifiedRoleAssignmentScheduleRequest](/graph/api/resources/unifiedroleassignmentschedulerequest)
- [unifiedRoleEligibilityScheduleRequest](/graph/api/resources/unifiedroleeligibilityschedulerequest)

These entities work alongside pre-existing **roleDefinition** and **roleAssignment** resources for both Azure AD roles and Azure roles to allow you to create end to end scenarios.

- If you are trying to create or retrieve a persistent (active) role assignment that does not have a schedule (start or end time), you should avoid these PIM entities and focus on the read/write operations under the roleAssignment entity

- To create an eligible assignment with or without an expiration time you can use the write operation on the [unifiedRoleEligibilityScheduleRequest](/graph/api/resources/unifiedroleeligibilityschedulerequest) resource

- To create a persistent (active) assignment with a schedule (start or end time), you can use the write operation on the  [unifiedRoleAssignmentScheduleRequest](/graph/api/resources/unifiedroleassignmentschedulerequest) resource

- To activate an eligible assignment, you should also use the [write operation on roleAssignmentScheduleRequest](/graph/api/rbacapplication-post-roleassignmentschedulerequests) with a `selfActivate` **action** property.

Each of the request objects would create the following read-only objects:

- [unifiedRoleAssignmentSchedule](/graph/api/resources/unifiedroleassignmentschedule)
- [unifiedRoleEligibilitySchedule](/graph/api/resources/unifiedroleeligibilityschedule)
- [unifiedRoleAssignmentScheduleInstance](/graph/api/resources/unifiedroleassignmentscheduleinstance)
- [unifiedRoleEligibilityScheduleInstance](/graph/api/resources/unifiedroleeligibilityscheduleinstance)

The **unifiedRoleAssignmentSchedule** and **unifiedRoleEligibilitySchedule** objects show a schedule of all the current and future assignments.

When an eligible assignment is activated, the **unifiedRoleEligibilityScheduleInstance** continues to exist. The **unifiedRoleAssignmentScheduleRequest** for the activation would create a separate **unifiedRoleAssignmentSchedule** object and a **unifiedRoleAssignmentScheduleInstance** for that activated duration.

The instance objects are the actual assignments that currently exist whether it is an eligible assignment or an active assignment. You should use the GET operation on the instance entity to retrieve a list of eligible assignments / active assignments to a role/user.

For more information about assignment and activation APIs, see [PIM API for managing role assignments and eligibilities](/graph/api/resources/privilegedidentitymanagementv3-overview#pim-api-for-managing-role-assignment).

### Policy settings APIs

To manage the settings of Azure AD roles, we provide the following entities:

- [unifiedroleManagementPolicy](/graph/api/resources/unifiedrolemanagementpolicy)
- [unifiedroleManagementPolicyAssignment](/graph/api/resources/unifiedrolemanagementpolicyassignment)

The [unifiedroleManagementPolicy](/graph/api/resources/unifiedrolemanagementpolicy) resource through it's **rules** relationship defines the rules or settings of the Azure AD role. For example, whether MFA/approval is required, whether and who to send the email notifications to, or whether permanent assignments are allowed or not. The [unifiedroleManagementPolicyAssignment](/graph/api/resources/unifiedrolemanagementpolicyassignment) object attaches the policy to a specific role.

Use the APIs supported by these resources retrieve role management policy assignments for all Azure AD role or filter the list by a **roleDefinitionId**, and then update the rules or settings in the policy associated with the Azure AD role.

For more information about the policy settings APIs, see [role settings and PIM](/graph/api/resources/privilegedidentitymanagementv3-overview#role-settings-and-pim).

## Relationship between PIM entities and role assignment entities

The only link between the PIM entity and the role assignment entity for persistent (active) assignment for either Azure AD roles or Azure roles is the unifiedRoleAssignmentScheduleInstance. There is a one-to-one mapping between the two entities. That mapping means roleAssignment and unifiedRoleAssignmentScheduleInstance would both include:  

- Persistent (active) assignments made outside of PIM
- Persistent (active) assignments with a schedule made inside PIM
- Activated eligible assignments

## Next steps

- [Azure AD Privileged Identity Management API reference](/graph/api/resources/privilegedidentitymanagementv3-overview)
