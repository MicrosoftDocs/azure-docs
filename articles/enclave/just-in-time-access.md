---
title: Just-in-time Access
titleSuffix: Azure Enclave
description: Just-in-time Access.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# Configuring just-in-time access in Azure Enclave using Privileged Identity Management

Azure Enclave uses **Privileged Identity Management (PIM)** to enable **just-in-time (JIT)** access for sensitive resources within enclaves and workloads. PIM allows users to request temporary, time-bound permissions to perform specific tasks, minimizing the risk of overprovisioning and unauthorized actions. This article explains how to configure JIT access in Azure Enclave using PIM.


[Azure Privileged Identity Management (PIM)](/entra/id-governance/privileged-identity-management/pim-configure) is an Azure service that helps you manage, control, and monitor access within your Azure environment. By combining Azure PIM with Azure Enclave, you can enforce a controlled and secure workflow for approving actions that are taken within Azure Enclave. You can prevent unauthorized or accidental changes that could change your organization's security posture.

Here's how you can use Azure PIM to approve actions within Azure Enclave:

1. **Enable Azure PIM**:
   Before you can use Azure PIM, you need to enable it for your Azure subscription. You can do this through the Azure portal. Navigate to the "Microsoft Entra ID Privileged Identity Management" service and follow the steps to set up PIM for your subscription.

1. **Assign roles with approval**:
   In Azure PIM, you can define custom roles or use built-in roles with approval workflows. These roles are designed to grant access to Azure Enclave resource actions, such as creating, modifying, and deleting community, endpoints, enclaves, etc. - including establishing internal connections. When you assign these roles to users, you can configure them to require approval before the role's permissions are activated.

1. **Approve Access Requests**:
   When a user needs to perform an action within Azure Enclave that requires privileged access, they initiate a request through Azure PIM. This request is then sent to the appropriate approver for review. The approver can be a community owner, enclave owner, or an individual with the necessary permissions to evaluate and approve the request.

1. **Review and Approve**:
   The designated approver receives a notification that a user requested access. The approver can review the details of the request, including the specific actions the user intends to perform within Azure Enclave. The approver can approve or deny the request based on the information provided. This process ensures only authorized and legitimate actions are taken within Azure Enclave.

1. **Time-bound Access**:
   Azure PIM allows you to grant time-bound access to users. This means that users are only granted the specified permissions for a limited period. This is especially useful for situations where temporary access is required. Once the approved time period expires, the user's permissions are automatically revoked, reducing the risk of prolonged privileged access.

1. **Audit and Monitoring**:
   Azure PIM provides comprehensive audit logs and reporting capabilities. This allows you to track and monitor all access requests, approvals, denials, and actions taken within Azure Enclave. Auditing helps you maintain visibility into who is accessing sensitive resources, their actions, and whether they were approved and legitimate.

By integrating Azure PIM's access approval workflows with Azure Enclave's security actions, you can establish a robust security posture that prevents unauthorized changes and minimizes the risks associated with privileged access. This approach aligns with the principle of least privilege and helps organizations maintain a strong security foundation in their Azure environment.

## Steps to Configure JIT Access with PIM in Azure Enclave

### Step 1: Enable Privileged Identity Management
1. Navigate to the **Azure portal**.
1. Go to **Microsoft Entra ID (formerly Azure Active Directory)**.
1. Select **Privileged Identity Management** from the menu.
1. Follow the on-screen instructions to enable PIM for your directory.

### Step 2: Assign Roles for Enclave Resources
1. In the PIM dashboard, select **Azure Resources**.
1. Choose the subscription or resource group containing your Azure Enclave resource.
1. Assign the desired roles to users or groups. Common roles include:
   - **Owner**: Full access to manage enclave and workload resources.
   - **Contributor**: Permissions to manage resources but not access security-related settings.
   - **Reader**: View-only access for monitoring and compliance.

1. For each role, configure the following settings:
   - **Activation Required**: Ensure the role requires activation for JIT access.
   - **Assignment Scope**: Limit the role to specific resources, such as the **enclave managed resource group** or **workload resource groups**.

### Step 3: Define approval settings
1. Navigate to the role’s settings in PIM.
1. Enable **Require approval to Activate**.
1. Specify approvers, such as administrators or project managers, who will validate access requests.
1. Configure **Notification Settings** to alert approvers and users when requests are made or approved.

### Step 4: Configure Activation Policies
1. In the role’s settings, define activation conditions:
   - **Maximum Activation Duration**: Set the duration (for example, 1 hour, 8 hours) for which the role is active after approval.
   - **Multi-Factor Authentication (MFA)**: Require MFA for all activations.
   - **Justification**: Require users to provide a reason for requesting access.

### Step 5: Test the Configuration
1. Assign the configured role to a test user.
1. Have the user request activation for the role:
   - The user navigates to the **PIM dashboard** and selects **My Roles**.
   - The user chooses the desired role and submits an activation request with justification.
1. Approve the request to validate the workflow.
1. Verify that permissions are granted and automatically revoked after the specified duration.


## Benefits of JIT Access in Azure Enclave

- **Enhanced Security**:
   - Time-bound access minimizes exposure to sensitive resources.
   - Conditional Access enforces strong identity and device verification.

- **Operational Flexibility**:
   - Users can quickly request and receive necessary permissions for specific tasks.
   - Approvers retain control over who accesses enclave resources and when.

- **Compliance and Auditability**:
   - Logs of all access requests, approvals, and actions ensure traceability for audits.
   - Integration with tools like Azure Monitor and Microsoft Sentinel enhances visibility.


## Resources to Learn More

- [Privileged Identity Management Overview](/azure/active-directory/privileged-identity-management/pim-configure)
- [Azure Conditional Access Policies](/azure/active-directory/conditional-access/overview)
- [Azure Enclave Documentation](./what-azure-enclave.md)
- [Azure Monitor for Logging and Diagnostics](/azure/azure-monitor/fundamentals/overview)
- [Microsoft Sentinel Integration](/azure/sentinel/overview)


Configure just-in-time access with Privileged Identity Management and Azure Enclave to provide a secure, scalable framework for managing temporary permissions. This approach supports operational flexibility while maintaining a robust security posture and compliance with organizational standards.
