---
title: What are Approvals in Azure Virtual Enclaves?
description: Learn about the Approvals feature in Azure Virtual Enclaves that provides oversight and governance for critical infrastructure changes.
author: aserfass-msft
ms.author: aserfass
ms.topic: overview
ms.date: 6/12/2026
ai-usage: ai-assisted
---

# What are Approvals in Azure Virtual Enclaves?

Approvals in Azure Virtual Enclaves provide another layer of governance and oversight for critical infrastructure operations. This feature enables administrators to queue requests to create new resources or modify existing resources, while requiring explicit approval before changes are implemented.

Consider these Approvals scenarios:

- You're the community cyber expert and want the administrator team to create new enclaves, but you need to approve enclave creation. Add yourself as a required approver for new enclaves.
- The community cyber team must review new enclave connections to help maintain community security and isolation. Add a security group for the community cyber team as a required approver for enclave connection creation and updates.
- You're an enclave owner who hosts a shared web app. You created an enclave endpoint for other enclaves to connect to your web app. You trust three people to review changes to that endpoint for availability and security. Add a security group as a required approver for connections to the enclave endpoint.

> [!IMPORTANT]
> 
> The Approvals feature is currently in **Preview**. Access to this preview requires enrollment and approval from the Azure Virtual Enclaves team. This feature is encouraged for testing but shouldn't be used for production workloads.


## Enclave creation flow comparison

The following diagram illustrates how enclave creation differs when approvals are disabled versus enabled:

:::image type="content" source="./media/approvals-state-comparison.png" alt-text="Diagram showing the process for an enclave being created with approvals and without approvals." border="True" lightbox="./media/approvals-state-comparison.png":::

<pre>
<!--
This is the mermaid definition for the above diagram. Use this to edit and regenerate the PNG image.

```mermaid
---
title: Azure Virtual Enclaves - Approvals Process
config:
  theme: base
  themeVariables:
    primaryColor: '#0078D4'
    primaryTextColor: '#000000'
    primaryBorderColor: '#005A9E'
    lineColor: '#505050'
    secondaryColor: '#E6F2FB'
    tertiaryColor: '#F3F2F1'
    fontFamily: 'Segoe UI, sans-serif'
    fontSize: '14px'
---
stateDiagram-v2
  direction TB
    
  State "Without Approvals" as without {
    RequestSubmitted: 📝 Request Submitted
    Provisioning: ⚙️ Provisioning
    Active: ✅ Active

    [*] --> RequestSubmitted: User selects Create
    RequestSubmitted --> Provisioning: Immediate processing
    Provisioning --> Active: Deployment completes
    Active --> [*]
  }
  
  State "With Approvals" as with {
    RequestSubmittedTwo: 📝 Request Submitted
    PendingApproval: ⏳ Pending Approval
    Approved: ✅ Approved
    Rejected: ❌ Rejected
    Provisioning2: ⚙️ Provisioning
    Active2: ✅ Active

    [*] --> RequestSubmittedTwo: User selects Create
    RequestSubmittedTwo --> PendingApproval: Queued for review
    PendingApproval --> Approved: Approver approves
    PendingApproval --> Rejected: Approver rejects
    Approved --> Provisioning2: Processing begins
    Provisioning2 --> Active2: Deployment completes
    Active2 --> [*]
    Rejected --> [*]: No change
  }
  
  classDef azurePrimary fill:#0078D4,stroke:#005A9E,stroke-width:2px,color:#FFFFFF
  classDef azurePrimaryTwo fill:#0078D4,stroke:#005A9E,stroke-width:2px,color:#FFFFFF
  classDef azureSecondary fill:#50E6FF,stroke:#0078D4,stroke-width:2px,color:#000000
  classDef success1 fill:#107C10,stroke:#094509,stroke-width:2px,color:#FFFFFF
  classDef success2 fill:#107C10,stroke:#094509,stroke-width:2px,color:#FFFFFF
  classDef success3 fill:#107C10,stroke:#094509,stroke-width:2px,color:#FFFFFF
  classDef warning fill:#FFB900,stroke:#8A6914,stroke-width:2px,color:#000000
  classDef error fill:#D13438,stroke:#8B0000,stroke-width:2px,color:#FFFFFF
  classDef neutral1 fill:#F3F2F1,stroke:#8A8886,stroke-width:2px,color:#323130
  classDef neutral2 fill:#F3F2F1,stroke:#8A8886,stroke-width:2px,color:#323130
  
  Class RequestSubmitted azurePrimary
  Class RequestSubmittedTwo azurePrimaryTwo
  Class PendingApproval azureSecondary
  Class Approved success1
  Class Active success2
  Class Active2 success3
  Class Rejected error
  Class Provisioning neutral1
  Class Provisioning2 neutral2
```
-->
</pre>

| Flow | Description |
|------|-------------|
| **Without Approvals** | Enclave creation proceeds immediately upon request submission. Resources are provisioned by users with permissions to create enclaves without more oversight. |
| **With Approvals** | Enclave creation enters a pending state, requiring explicit approval before provisioning begins. Rejected requests are recorded without resource creation. |

## Why use Approvals?

Approvals help organizations maintain strict governance and security standards for sensitive environments by:

- **Enforcing separation of duties**: Ensuring that the person requesting a change isn't the same person approving it
- **Preventing unauthorized changes**: Requiring explicit approval before critical infrastructure modifications take effect
- **Enhancing audit trails**: Creating a comprehensive record of who requested changes, who approved them, and when
- **Reducing risk**: Catching potential misconfigurations or unauthorized changes before they're deployed
- **Supporting compliance requirements**: Meeting regulatory requirements for change management and oversight
- **Enabling controlled deployments**: Allowing teams to prepare changes while requiring management oversight before execution

## How Approvals work

The Approvals workflow in Azure Virtual Enclaves follows these key steps:

1. **Request submission**: A user with appropriate permissions initiates an action that requires approval, such as creating an enclave connection or modifying an endpoint
2. **Pending state**: The requested change enters a pending state and is queued for review
3. **Approval review**: Users with the **Enclave Approver** role can review pending approval requests
4. **Decision**: An approver either approves or rejects the request with optional comments
5. **Implementation**: If approved, the change is automatically implemented; if rejected, the request is discarded

## Resources that require approval

When the Approvals feature is enabled for a resource action, that action requires approval:

- **Enclave creation**: Creating a new enclave
- **Maintenance mode**: Modifying maintenance mode on an enclave, including turning maintenance mode on or off
- **Enclave connections**: Creating new connections between enclaves or to external resources or modifying existing connections
- **Enclave endpoints**: Modifying endpoint configurations that control network access
- **Community endpoints**: Changes to community-level networking rules

The specific operations requiring approval can be configured in the community configuration based on your organization's governance requirements.

## Roles and permissions

The Approvals feature integrates with Azure Virtual Enclaves' role-based access control (RBAC):

### Enclave Approver role

The **Enclave Approver** role is designed for managing approval requests:

- **Read-only access** to all Azure Virtual Enclaves resource types
- **Explicit permissions** to approve or reject pending approval requests
- **Cannot initiate changes**: This role is strictly for oversight and approval
- **Audit visibility**: Can view the full history of approval requests and decisions

### Other relevant roles

- **Enclave Owner/Contributor**: Can submit requests that require approval but can't self-approve
- **Community Owner/Contributor**: Can submit community-level requests requiring approval
- **Enclave Reader**: Can view pending approvals but can't approve or reject them

[Learn more about Azure Virtual Enclaves RBAC roles](./built-in-rbac-roles.md)

## Integration with Azure Privileged Identity Management

Approvals can be combined with Azure Privileged Identity Management (PIM) for enhanced security:

- **Just-in-time approver access**: Approver permissions can be granted on a time-limited basis
- **Multi-factor authentication**: Require MFA for approval actions
- **Approval for approvers**: Require a secondary approval before granting approver permissions
- **Comprehensive audit logs**: Track all approval activities across both AVE and PIM

[Learn more about Just-in-Time Access](./just-in-time-access.md)

## Best practices

When implementing Approvals in your Azure Virtual Enclaves environment:

1. **Assign dedicated approvers**: Designate specific individuals or teams as approvers to maintain separation of duties
2. **Define approval policies**: Clearly document which changes require approval and the approval criteria
3. **Set SLAs for approvals**: Establish timeframes for approval decisions to prevent deployment delays
4. **Use descriptive justifications**: Require requesters to provide detailed justifications for their change requests
5. **Regular audit reviews**: Periodically review approval logs to identify patterns and improve processes
6. **Combine with PIM**: Use time-bound approver access for sensitive environments
7. **Document rejection reasons**: When rejecting requests, provide clear feedback to help requesters understand why

## Monitoring and auditing

All approval activities are logged and auditable:

- **Azure Activity Logs**: All approval and rejection actions are logged in Azure Activity Logs
- **Log Analytics**: Query and analyze approval patterns and trends
- **Microsoft Sentinel**: Integrate approval logs with your security monitoring

## Approval states

Resources subject to approval can exist in the following states:

| State | Description |
|-------|-------------|
| **Pending** | The request is submitted and is awaiting approval |
| **Approved** | The request is approved and the change is being implemented |
| **Rejected** | The request is rejected and the requested resources aren't created or changed |
| **Connected/Active** | The approved change is successfully implemented |
| **Disconnected/Inactive** | The resource is in a disconnected state (for connections) |

## Next steps

- [Configure Approvals in Azure Virtual Enclaves](./configure-approvals.md)
- [Manage approval requests](./manage-approvals.md)
- [Learn about Just-in-Time Access](./just-in-time-access.md)
- [Understand Azure Virtual Enclaves RBAC](./built-in-rbac-roles.md)
- [Create an enclave connection with approvals](./create-enclave-connection-portal.md)
