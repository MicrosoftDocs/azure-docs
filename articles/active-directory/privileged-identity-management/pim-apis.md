---
title: API concepts in Privileged Identity management - Azure AD | Microsoft Docs
description: Information for understanding the APIs in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
editor: ''
ms.service: active-directory
ms.workload: identity
ms.subservice: pim
ms.topic: how-to
ms.date: 05/14/2021
ms.author: curtand
ms.custom: pim 
ms.collection: M365-identity-device-management
---
# Understand the Privileged Identity Management APIs

You can perform Privileged Identity Management (PIM) tasks using the Microsoft Graph APIs for Azure Active Directory (Azure AD) roles and the Azure Resource Manager API for Azure resource roles (sometimes called Azure RBAC roles). This article describes important concepts for using the APIs for Privileged Identity Management.

For requests and other details about PIM APIs, check out:

- [PIM for Azure AD roles API reference](/graph/api/resources/unifiedroleeligibilityschedulerequest?view=graph-rest-beta&preserve-view=true)
- [PIM for Azure resource roles API reference](/rest/api/authorization/roleeligibilityschedulerequests)

> [!IMPORTANT]
> PIM APIs [!INCLUDE [PREVIEW BOILERPLATE](../../../includes/active-directory-develop-preview.md)]

## PIM API history

There have been several iterations of the PIM API over the past few years. You'll find some overlaps in functionality, but they don't represent a linear progression of versions.

### Iteration 1 – only supports Azure AD roles, deprecating

Under the /beta/privilegedRoles endpoint, Microsoft had a classic version of the PIM API which is no longer supported in most tenants. We are in the process of deprecating remaining access to this API on 05/31.

### Iteration 2 – supports Azure AD roles and Azure resource roles

Under the /beta/privilegedAccess endpoint, Microsoft supported both /aadRoles and /azureResources. This endpoint is still available in your tenant but Microsoft recommends against starting any new development with this API. This beta API will never be released to general availability and will be eventually deprecated.

### Current iteration – Azure AD roles in Microsoft Graph and Azure resource roles in Azure Resource Manager

Now in beta, Microsoft has the final iteration of the PIM API before we release the API to general availability. Based on customer feedback, the Azure AD PIM API is now under the unifiedRoleManagement set of API and the Azure Resource PIM API is now under the Azure Resource Manager role assignment API. These locations also provide a few additional benefits including:

- Alignment of the PIM API for regular role assignment API for both Azure AD roles and Azure Resource roles.
- Reducing the need to call additional PIM API to onboard a resource, get a resource, or get role definition.
- Supporting app-only permissions.
- New features such as approval and email notification configuration.

In the current iteration, there is no API support for PIM alerts and privileged access groups.

## Current permissions required

### Azure AD roles

  To call the PIM Graph API for Azure AD roles, you will need at least one of the following permissions:

- RoleManagement.ReadWrite.Directory
- RoleManagement.Read.Directory

  The easiest way to specify the required permissions is to use the Azure AD consent framework.

### Azure resource roles

  The PIM API for Azure resource roles is developed on top of the Azure Resource Manager framework. You will need to give consent to Azure Resource Management but won’t need any Graph API permission. You will also need to make sure the user or the service principal calling the API has at least the Owner or User Access Administrator role on the resource you are trying to administer.

## Calling PIM API with an app-only token

### Azure AD roles

  PIM API now supports app-only permissions on top of delegated permissions.

- For app-only permissions, you must call the API with an application that's already been consented with either the required Azure AD or Azure role permissions.
- For delegated permission, you must call the PIM API with both a user and an application token. The user must be assigned to either the Global Administrator role or Privileged Role Administrator role, and ensure that the service principal calling the API has at least the Owner or User Access Administrator role on the resource you are trying to administer.

### Azure resource roles

  PIM API for Azure resources supports both user only and application only calls. Simply make sure the service principal has either the owner or user access administrator role on the resource.

## Design of current API iteration

PIM API consists of two categories that are consistent for both the API for Azure AD roles and Azure resource roles: assignment and activation API requests, and policy settings.

### Assignment and activation API

To make eligible assignments, time-bound eligible/active assignments, and to activate assignments, PIM provides the following entities:

- RoleAssignmentSchedule
- RoleEligibilitySchedule
- RoleAssignmentScheduleInstance
- RoleEligibilityScheduleInstance
- RoleAssignmentScheduleRequest
- RoleEligibilityScheduleRequest

These entities work alongside pre-existing roleDefinition and roleAssignment entities for both Azure AD roles and Azure roles to allow you to create end to end scenarios.

- If you are trying to create or retrieve a persistent (active) role assignment that does not have a schedule (start or end time), you should avoid these PIM entities and focus on the read/write operations under the roleAssignment entity

- To create an eligible assignment with or without an expiration time you can use the write operation on roleEligibilityScheduleRequest

- To create a persistent (active) assignment with a schedule (start or end time), you can use the write operation on roleAssignmentScheduleRequest  

- To activate an eligible assignment, you should also use the write operation on roleAssignmentScheduleRequest with a modified action parameter called selfActivate

Each of the request objects would either create a roleAssignmentSchedule or a roleEligibilitySchedule object. These objects are read-only and show a schedule of all the current and future assignments.

When an eligible assignment is activated, the roleEligibilityScheduleInstance continues to exist. The roleAssignmentScheduleRequest for the activation would create a separate roleAssignmentSchedule and roleAssignmentScheduleInstance for that activated duration.

The instance objects are the actual assignments that currently exist whether it is an eligible assignment or an active assignment. You should use the GET operation on the instance entity to retrieve a list of eligible assignments / active assignments to a role/user.

### Policy setting API

To manage the setting, we provide the following entities:

- roleManagementPolicy
- roleManagementPolicyAssignment

The *role management policy* defines the setting of the rule. For example, whether MFA/approval is required, whether and who to send the email notifications to, or whether permanent assignments are allowed or not. The *policy assignment* attaches the policy to a specific role.

Use this API is to get a list of all the roleManagementPolicyAssignments, filter it by the roleDefinitionID you want to modify, and then update the policy associated with the policyAssignment.

## Relationship between PIM entities and role assignment entities

The only link between the PIM entity and the role assignment entity for persistent (active) assignment for either Azure AD roles or Azure roles is the roleAssignmentScheduleInstance. There is a one-to-one mapping between the two entities. That mapping means roleAssignment and roleAssignmentScheduleInstance would both include:  

- Persistent (active) assignments made outside of PIM
- Persistent (active) assignments with a schedule made inside PIM
- Activated eligible assignments

## Next steps

- [Azure AD Privileged Identity Management API reference](/graph/api/resources/privilegedidentitymanagement-root?view=graph-rest-beta&preserve-view=true)