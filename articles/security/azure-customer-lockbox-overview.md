---
title: Overview - Customer Lockbox
description: This article provides an overview of Microsoft Azure Customer Lockbox.
author: cabailey
ms.service: security
ms.topic: article
ms.author: cabailey
manager: barbkess
ms.date: 04/19/2019
---

# Customer Lockbox for Microsoft Azure

[!Note]
To use this feature, your organization must have an [Azure support plan](https://azure.microsoft.com/support/plans/) with a minimal level of **Developer**.

As a cloud service provider, we understand the importance of maintaining the integrity and confidentiality of customer data. <Need to complete this section>


## Workflow

The following steps outline a typical workflow for a Customer Lockbox request.

1. Someone at an organization has an issue with their Azure workload.

2. After this person troubleshoots the issue, but can't fix it, they open a support request with Microsoft Support. The ticket is assigned to an Azure Customer Support Engineer.

3. An Azure Support Engineer reviews the service request and determines the next steps to resolve the issue.

4. For most cases, these support engineers can troubleshoot issues by using telemetry. <Fill this details>. However, in some cases, the next step is to request elevated permissions by using a Just-In-Time (JIT) access service. This request can be from the original support engineer, or from a different engineer as a result of the problem being escalated to the Azure DevOps team.

5. The JIT policy engine evaluates the request, taking into account parameters such as:
    - Scope of the Resource
    - Requester (Isolated Identity, MFA etc)
    - Secure Device (Secure Admin Workstation)
    - Permission level
    
    This step also includes an initial approval from internal Microsoft approvers, based on the JIT policy. For example, the Customer Support Lead or DevOps Manager.

6. When the request requires direct access to customer data, a Customer Lockbox request is initiated. For example, remote desktop access to a customer's virtual machine.
    
    The request is now in a **Customer Notified** state, waiting for the customer's approval before granting access.

7. At the customer organization, the user who has the [Owner role](https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles#azure-rbac-roles) for the Azure subscription receives an email from Microsoft, to notify them about the pending access request. For Customer Lockbox requests, this person is the designated approver.

<Add Screenshot>

8. The email notification provides a link to the **Customer Lockbox** blade in the Azure portal. Using this link, the designated approver signs in to the Azure portal to view any pending requests that their organization has for Customer Lockbox.
    
   The request remains in the customer queue for 4 days. After this time, the access request automatically expires and no access is granted to Microsoft engineers.

9. To get the details of the pending request, the designated approver can select the lockbox request.<Add Screenshot>

10. The designated approver can also select the **Ticket ID** reference to view the support ticket request that created by the original user. This information provides context for why Microsoft Support is engaged, and the history of the reported problem. <Include screenshot>

11. After reviewing the request, the designated approver selects **Approve** or **Deny**.
<Include Screenshot>
    
    As a result of the selection:
    - **Approve**:  Access is granted to the Microsoft engineer. The access is granted for a default period of 8 hours.
    - **Deny**: The elevated access request by the Microsoft engineer is rejected and no further action is taken.

For auditing purposes, the actions taken in this workflow are logged in [Customer Lockbox request logs](#auditing-logs).

## Service provisioning

Customer Lockbox is automatically available for all customers who have an [Azure support plan](https://azure.microsoft.com/support/plans/) with a minimal level of **Developer**. 

When you have an eligible support plan, no action is required by you to enable Customer Lockbox. Customer Lockbox request are automatically initiated by a Microsoft engineer if needed, to progress a support ticket that has been filed from somebody in your organization.

## Auditing logs

Use the **Activity Logs** to view auditing information related to Customer Lockbox requests. You can filter for specific actions, such as:
- Create Lockbox Requests
- Approve Lockbox Requests
- Deny Lockbox Requests
- Lockbox Request Expiry

<Include Screenshot>

## Supported services and scenarios

The following services and scenarios are currently in general availability for Customer Lockbox.

### Remote desktop access to virtual machines

Customer Lockbox is currently enabled for RDP Access requests to virtual machines. Interactive Remote Access (RDP) to the following workloads are supported:
- PAAS V1
- IAAS - Windows and Linux (ARM-based only)
- VMSS -Windows and Linux

[Note!]: IAAS Classic instances are not supported by Customer Lockbox. If you have workloads running on IAAS Classic instances, we recommend you migrate them from Classic to Resource Manager deployment models. For instructions, see [Platform-supported migration of IaaS resources from classic to Azure Resource Manager](https://docs.microsoft.com/azure/virtual-machines/windows/migration-classic-resource-manager-overview).

#### Detailed audit logs 

For scenarios that involve direct RDP access to a virtual machine, you can also use the Windows Event Log. If a virtual machine agent is installed on the virtual machine, you can export these logs for analysis and alerting, to be used by other monitoring solutions, such as Azure Monitor.

## Exclusions

Customer Lockbox requests are not triggered in following scenarios:

- Law enforcement requests
    
    In these very unusual situations, Microsoft is legally required to comply with such requests.

- Operations that are not part of standard operating procedures
   
    There are some scenarios where a Microsoft engineer needs to perform an activity that falls outside of standard operating procedures, for example, to recover or restore a service.

- Incidental access at the platform layer
    
    This scenario can arise when a Microsoft engineer accesses the platform as part of troubleshooting and inadvertently has access to customer data.
    
    For example, the Azure Network Team performs troubleshooting that results in a packet capture on a network device. Note that in this case, if the customer encrypted the data while it was in transit, the engineers cannot read the data.

# Frequently asked questions
