---
title: Manage approval requests in Azure Enclave
description: Learn how to review, approve, and reject approval requests in Azure Enclave.
author: aserfass-msft
ms.author: aserfass
ms.topic: how-to
ms.date: 1/26/2026
ai-usage: ai-assisted
---

# Manage approval requests in Azure Enclave

This article explains how to review, approve, and reject approval requests in Azure Enclave. Users with the Enclave Approver Role can manage approval requests to ensure proper oversight of critical infrastructure changes.

> [!IMPORTANT]
> 
> The Approvals feature is currently in **Preview**. This feature is encouraged for testing but shouldn't be used for production workloads while in preview.

## Prerequisites

To manage approval requests, you need:

- The **Enclave Approver Role** assigned at the enclave or community level
- Access to the Azure portal or Azure CLI
- Permissions to view the resources related to the approval request

## View pending approval requests

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Azure Enclave enclave or community resource.

1. In the left navigation menu, select `Approvals`.

1. The Approvals page displays all pending, approved, and rejected requests.

1. Use the filters to view specific types of requests:
   - `Approval status`: `Pending`, `Approved`, `Rejected`
   - `Requestor`: Filter by who submitted the request
   - `Requested on`: Filter by submission date/time range
   - `Parent Resource`: Filter to the enclave or community of interest
   - `Action Type` (if shown in your portal experience): Filter by the requested operation

## Review an approval request

Before approving or rejecting a request, carefully review the details:

1. In the `Approvals` list, select the request you want to review.

1. The approval details page displays:
   - `Request type`: The type of resource or operation (for example, `Enclave Connection`)
   - `Requested by`: The user who submitted the request
   - `Request date`: When the request was submitted
   - `Resource details`: Information about the resource being created or modified
   - `Justification`: The reason provided by the requester (if available)
   - `Impact assessment`: Potential effect of approving the request
   - `Security considerations`: Security implications of the change

1. Review all information carefully before making a decision.

## Approve a request

After reviewing a request, approve it to allow the change to proceed:

1. On the approval details page, select `Approve`.

1. In the approval dialog:
   - `Add comments` (optional): Provide context or conditions for the approval

1. Select `Confirm` to approve the request.

1. The request status is now `Approved` and the resource change is automatically implemented.

## Reject a request

If a request doesn't meet approval criteria, reject it with a clear explanation:

1. On the approval details page, select `Reject`.

1. In the rejection dialog:
   - `Reason for rejection` (required): Explain why the request is being rejected
   - `Suggestions` (optional): Provide guidance on how to resubmit the request

1. Select `Confirm` to reject the request.

1. The request status changes to `Rejected` and the resource change won't be implemented.

## Common approval scenarios

### Approving enclave creation

When reviewing an enclave creation request:

1. **Validate purpose and ownership**: Confirm the enclave has a clear business purpose and accountable owners
1. **Check placement and scope**: Verify the enclave is being created in the correct community and scope
1. **Review baseline security expectations**: Ensure required governance and security controls are planned
1. **Confirm naming and lifecycle standards**: Validate alignment with naming, tagging, and lifecycle requirements

**Example approval**: "Approved. New enclave supports the approved workload onboarding plan and meets ownership and governance requirements."

**Example rejection**: "Rejected. Enclave purpose and ownership are incomplete. Provide accountable owners and updated deployment justification before resubmitting."

### Approving a maintenance mode change

When reviewing a maintenance mode request:

1. **Verify maintenance window**: Confirm the change aligns to an approved maintenance window
1. **Validate impact communication**: Ensure affected stakeholders are informed
1. **Check rollback/readiness plans**: Confirm there's a clear rollback or completion plan
1. **Assess operational risk**: Review service and dependency effect before approval

**Example approval**: "Approved. Maintenance mode is scheduled in the approved change window with a documented rollback plan."

**Example rejection**: "Rejected. Maintenance window and service effect plan are missing. Add operational readiness details and resubmit."

### Approving an enclave connection

When reviewing an enclave connection request:

1. **Verify the source and destination**: Ensure the connection is between authorized enclaves or external endpoints
1. **Check network rules**: Review the firewall rules and network security group configurations
1. **Validate business justification**: Confirm there's a legitimate business need for the connection
1. **Assess security implications**: Evaluate whether the connection poses any security risks
1. **Review compliance requirements**: Ensure the connection meets organizational compliance standards

**Example approval**: "Approved. Connection between production and logging enclave is necessary for centralized log aggregation. Security team verified firewall rules."

**Example rejection**: "Rejected. Connection to external endpoint requires more security review. Submit a detailed security assessment and obtain InfoSec approval before resubmitting."

### Approving an enclave endpoint

When reviewing an enclave endpoint request:

1. **Review endpoint rules**: Check the network rules being added or modified
1. **Verify allowed/denied traffic**: Ensure the endpoint controls align with security policies
1. **Check for overly permissive rules**: Look for rules that might grant excessive access
1. **Validate compliance**: Confirm the endpoint configuration meets compliance requirements

**Example approval**: "Approved. Endpoint configuration follows least-privilege principles and the network security team reviewed this request."

**Example rejection**: "Rejected. Endpoint allows traffic from 0.0.0.0/0, which violates security policy. Restrict to specific IP ranges and resubmit."

### Approving a community endpoint

When reviewing a community endpoint request:

1. **Assess external connectivity**: Verify the external destination is trusted and necessary
1. **Review transit hub configuration**: If VPN or ExpressRoute is involved, ensure proper configuration
1. **Check firewall rules**: Verify Azure Firewall rules are appropriately restrictive
1. **Validate third-party access**: If allowing access to/from external parties, ensure proper authorization

**Example approval**: "Approved. VPN connection to partner network is required for data exchange as specified in the partnership agreement. Connection is properly secured with IPsec."

**Example rejection**: "Rejected. External connection requires approval from the Chief Information Security Officer (CISO). Obtain written approval and attach to the request."

## Bulk approval operations

For multiple related requests, you can perform bulk operations:

### [Portal](#tab/portal)

1. In the `Approvals` list, select the checkbox next to multiple pending requests.

1. Select `Bulk Actions` > `Approve selected` or `Reject selected`.

1. Provide comments or rejection reasons that apply to all selected requests.

1. Select `Confirm` to process all requests.

---

## View approval history

To maintain compliance and audit trails, you can review the history of all approval decisions:

### [Portal](#tab/portal)

1. Navigate to your enclave or community resource.

1. Select `Approvals` in the left navigation menu.

1. Select the `History` tab to view all past approvals and rejections.

1. Filter by:
   - `Date range`: View approvals within a specific timeframe
   - `Approver`: See decisions made by specific approvers
   - `Status`: View only approved or rejected requests
   - `Request type`: Filter by resource type

1. Select any historical request to view full details including comments and timestamps.

---

## Notification behavior

The Approvals feature doesn't currently provide a built-in email notification option for approval requests.

Use your organization's monitoring and operational processes to track and triage pending approvals.

## Best practices for approval management

When managing approval requests:

1. **Review promptly**: Respond to approval requests in a timely manner to avoid blocking legitimate operations

1. **Provide clear feedback**: When rejecting requests, explain the reason and provide guidance for resubmission

1. **Document decisions**: Add comments to approvals explaining the reasoning, especially for complex decisions

1. **Use consistent criteria**: Apply the same approval standards across similar requests to ensure fairness

1. **Escalate when needed**: If uncertain about a request, escalate to senior leadership or security teams

1. **Regular audits**: Periodically review approval history to identify patterns or potential issues

1. **Update policies**: Based on approval patterns, update governance policies to improve the process

1. **Communicate with requesters**: For complex requests, consider discussing with the requester before making a decision

## Delegate approval authority

In some cases, you might need to temporarily delegate approval authority:

1. Navigate to `Access control (IAM)` for the enclave or community.

1. Assign the **Enclave Approver Role** to the delegate.

1. Set an expiration date for temporary delegations.

1. For permanent delegation, consider using Azure PIM with appropriate approval workflows.

[Learn more about role assignments](./role-based-access-controls.md)

## Troubleshooting

### Can't see pending approval requests

**Cause**: You don't have the Enclave Approver Role or the role is assigned at the wrong scope.

**Solution**: Verify with your administrator that you have the Enclave Approver Role assigned at the appropriate level (enclave or community).

### Approved request isn't being implemented

**Cause**: The resource might have conflicts or insufficient permissions to complete the deployment.

**Solution**: Check Azure Activity Logs for errors. Ensure the system has the necessary permissions to implement the approved change.

### Unable to approve or reject

**Cause**: Check if another approver processed the request already or if there's a permission issue.

**Solution**: Refresh the page to see the current status. If the issue persists, verify your role assignment.

## Next steps

- [Configure Approvals](./configure-approvals.md)
- [Learn about the Approvals feature](./what-approvals.md)
- [Understand Azure Enclave RBAC](./built-in-rbac-roles.md)
- [Configure Just-in-Time Access](./just-in-time-access.md)
- [Create an enclave connection](./create-enclave-connection-portal.md)
