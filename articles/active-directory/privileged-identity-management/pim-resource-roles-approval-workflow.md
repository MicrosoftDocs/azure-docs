---
title:  Privileged Identity Management - Approval workflow for Azure resource roles| Microsoft Docs
description: Describes how the approval workflow process for Azure resources.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/02/2018
ms.author: billmath
ms.custom: pim
---

# Privileged Identity Management - Resource Roles - Approve

With approval workflow in PIM for Azure resource roles, administrators can further protect or restrict access to critical resources by requiring approval to activate role assignments. Unique to Azure resource roles is the concept of a resource hierarchy. This hierarchy enables the inheritance of role assignments from a parent resource object downward to all subordinate child resources within the parent container. 

For example Bob, a resource administrator uses PIM to assign Alice as an eligible member to the Owner role in the Contoso subscription. With this assignment Alice is also an eligible Owner of all resource group containers within the Contoso subscription, and all resources (like virtual machines) contained within each resource group, of the subscription. Let's assume there are three resource groups in the Contoso subscription; Fabrikam Test, Fabrikam Dev, and Fabrikam Prod. Each of these resource groups contains a single virtual machine.

PIM settings are configured for each role of a resource and unlike assignments these settings are not inherited and apply strictly to the  resource role. [Read more about eligible assignments and resource visibility.](pim-resource-roles-eligible-visibility.md)

Using the above example Bob uses PIM to require all members in the Owner role of the Contoso subscription request approval to activate. To protect the resources contained within the Fabrikam Prod resource group, Bob requires approval for members of the Owner role of this resource also. The owner roles in Fabrikam Test and Fabrikam Dev do not require approval to activate.

When Alice requests activation of her Owner role for the Contoso subscription an approver must approve or deny her request before she becomes active in the role. Additionally if Alice decides to [scope her activation](pim-resource-roles-activate-your-roles.md#just-enough-administration) to the Fabrikam Prod resource group an approver must approve or deny this request too. However, if Alice decides to scope her activation to either or both Fabrikam Test or Fabrikam Dev, approval will not be required.

Approval workflow may not be necessary for all members of a role. Consider a scenario where your organization hires several contract associates to assist in the development of an application that will run in an Azure subscription. As a resource administrator, you would like employees to have eligible access without approval required, but the contract associates must request approval. To configure approval workflow for only the contract associates you can create a custom role with the same permissions as the role assigned to employees and require approval to activate that custom role. [Learn more about custom roles](pim-resource-roles-custom-role-policy.md).

Follow the steps below to configure approval workflow and specify who can approve or deny requests.

## Require approval to activate

Navigate to PIM in the Azure portal, and select a resource from the list.

![](media/azure-pim-resource-rbac/aadpim_manage_azure_resource_some_there.png)

From the left navigation menu, select **Role settings**.

Search for and select a role, and click **Edit** to modify settings.

![](media/azure-pim-resource-rbac/aadpim_rbac_role_settings_view_settings.png)

In the Activation section check the box **Require approval to activate**.

![](media/azure-pim-resource-rbac/aadpim_rbac_settings_require_approval_checkbox.png)

## Specify approvers

Click **Select approvers** to open the selection screen.

>[!NOTE]
>You must select at least one user or group to update the setting. There are no default approvers.

Resource administrators can add any combination of users and groups to the list of approvers. 

![](media/azure-pim-resource-rbac/aadpim_rbac_role_settings_select_approvers.png)

## Request approval to activate

Requesting approval has no impact on the procedure a member must follow to activate. [Review the steps to activate a role](pim-resource-roles-activate-your-roles.md).

If a member requested activation of a role that requires approval and the role is no longer required, the member may cancel their request in PIM.

To cancel, navigate to PIM and select "My requests". Locate the request and click "Cancel".

![](media/azure-pim-resource-rbac/aadpim_rbac_role_approval_request_pending.png)

## Approve or deny a request

To approve or deny a request you must be a member of the approver list. In PIM, select "Approve requests" from the tab in the left navigation menu and locate the request.

![](media/azure-pim-resource-rbac/aadpim_rbac_approve_requests_list.png)

Select the request, provide a justification for the decision, and select approve or deny, resolving the request.

![](media/azure-pim-resource-rbac/aadpim_rbac_approve_request_approved.png)

## Workflow notifications

- All members of the approver list are notified by email when a request for a role is pending their review. Email notifications include a direct link to the request where the approver can approve or deny.
- Requests are resolved by the first member of the list that approves or denies. 
- When an approver responds to the request, all members of the approver list are notified of the action. 
- Resource administrators are notified when an approved member becomes active in their role. 

>[!Note]
>In an event where a resource administrator believes the approved member should not be active, they may remove the active role assignment in PIM. Although resource administrators are not notified of pending requests unless they are members of the approver list, they may view and cancel pending requests of all users by viewing pending requests in PIM. 

## Next steps

[Apply PIM settings to unique groups of users](pim-resource-roles-custom-role-policy.md)
