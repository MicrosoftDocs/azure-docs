---
title: Customer Lockbox for Microsoft Azure
description: Technical overview of Customer Lockbox for Microsoft Azure, which provides control over cloud provider access when Microsoft may need to access customer data.
author: TerryLanfear
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: terrylan
manager: rkarlin
ms.date: 02/19/2021
---

# Customer Lockbox for Microsoft Azure

> [!NOTE]
> To use this feature, your organization must have an [Azure support plan](https://azure.microsoft.com/support/plans/) with a minimal level of **Developer**.

Customer Lockbox for Microsoft Azure provides an interface for customers to review and approve or reject customer data access requests. It is used in cases where a Microsoft engineer needs to access customer data during a support request.

This article covers how to enable Customer Lockbox and how Lockbox requests are initiated, tracked, and stored for later reviews and audits.

<a name='supported-services-and-scenarios-in-general-availability'></a><a name='supported-services-and-scenarios-in-preview'></a>
## Supported services and scenarios (General Availability)

The following services are now generally available for Customer Lockbox:

- Azure API Management
- Azure App Service
- Azure Cognitive Services
- Azure Container Registry
- Azure Database for MySQL
- Azure Databricks
- Azure Data Box
- Azure Data Explorer
- Azure Data Factory
- Azure Database for PostgreSQL
- Azure Functions
- Azure HDInsight
- Azure Kubernetes Service
- Azure Monitor
- Azure Storage
- Azure SQL Database
- Azure subscription transfers
- Azure Synapse Analytics
- Virtual machines in Azure (covering remote desktop access, access to memory dumps, and managed disks)

## Enable Customer Lockbox

You can now enable Customer Lockbox from the [Administration module](https://aka.ms/customerlockbox/administration) in the Customer Lockbox blade.  

> [!NOTE]
> To enable Customer Lockbox, the user account needs to have the [Global Administrator role assigned](../../active-directory/roles/manage-roles-portal.md).

## Workflow

The following steps outline a typical workflow for a Customer Lockbox request.

1. Someone at an organization has an issue with their Azure workload.

2. After this person troubleshoots the issue, but can't fix it, they open a support ticket from the [Azure portal](https://ms.portal.azure.com/signin/index/?feature.settingsportalinstance=mpac). The ticket is assigned to an Azure Customer Support Engineer.

3. An Azure Support Engineer reviews the service request and determines the next steps to resolve the issue.

4. If the support engineer can't troubleshoot the issue by using standard tools and telemetry, the next step is to request elevated permissions by using a Just-In-Time (JIT) access service. This request can be from the original support engineer or from a different engineer because the problem is escalated to the Azure DevOps team.

5. After the access request is submitted by the Azure Engineer, Just-In-Time service evaluates the request taking into account factors such as:
    - The scope of the resource
    - Whether the requester is an isolated identity or using multi-factor authentication
    - Permissions levels

    Based on the JIT rule, this request may also include an approval from Internal Microsoft Approvers. For example, the approver might be the Customer support lead or the DevOps Manager.

6. When the request requires direct access to customer data, a Customer Lockbox request is initiated. For example, remote desktop access to a customer's virtual machine.

    The request is now in a **Customer Notified** state, waiting for the customer's approval before granting access.

7. At the customer organization, the user who has the [Owner role](../../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles) for the Azure subscription receives an email from Microsoft, to notify them about the pending access request. For Customer Lockbox requests, this person is the designated approver.

    Example email:

    ![Azure Customer Lockbox - email notification](./media/customer-lockbox-overview/customer-lockbox-email-notification.png)

8. The email notification provides a link to the **Customer Lockbox** blade in the Administration module. Using this link, the designated approver signs in to the Azure portal to view any pending requests that their organization has for Customer Lockbox:

    ![Azure Customer Lockbox - landing page](./media/customer-lockbox-overview/customer-lockbox-landing-page.png)

   The request remains in the customer queue for four days. After this time, the access request automatically expires and no access is granted to Microsoft engineers.

9. To get the details of the pending request, the designated approver can select the lockbox request from **Pending Requests**:

    ![Azure Customer Lockbox - view the pending request](./media/customer-lockbox-overview/customer-lockbox-pending-requests.png)

10. The designated approver can also select the **SERVICE REQUEST ID** to view the support ticket request that was created by the original user. This information provides context for why Microsoft Support is engaged, and the history of the reported problem. For example:

    ![Azure Customer Lockbox - view the support ticket request](./media/customer-lockbox-overview/customer-lockbox-support-ticket.png)

11. After reviewing the request, the designated approver selects **Approve** or **Deny**:

    ![Azure Customer Lockbox - select Approve or Deny](./media/customer-lockbox-overview/customer-lockbox-approval.png)

    As a result of the selection:
    - **Approve**:  Access is granted to the Microsoft engineer. The access is granted for a default period of eight hours.
    - **Deny**: The elevated access request by the Microsoft engineer is rejected and no further action is taken.

For auditing purposes, the actions taken in this workflow are logged in [Customer Lockbox request logs](#auditing-logs).

## Auditing logs

Customer Lockbox logs are stored in activity logs. In the Azure portal, select **Activity Logs** to view auditing information related to Customer Lockbox requests. You can filter for specific actions, such as:
- **Deny Lockbox Request**
- **Create Lockbox Request**
- **Approve Lockbox Request**
- **Lockbox Request Expiry**

As an example:

![Azure Customer Lockbox - activity logs](./media/customer-lockbox-overview/customer-lockbox-activitylogs.png)

## Customer Lockbox integration with Azure Security Benchmark

We've introduced a new baseline control ([3.13](../benchmarks/security-control-identity-access-control.md#313-provide-microsoft-with-access-to-relevant-customer-data-during-support-scenarios)) in Azure Security Benchmark that covers Customer Lockbox applicability. Customers can now leverage the benchmark to review Customer Lockbox applicability for a service.

## Exclusions

Customer Lockbox requests are not triggered in the following engineering support scenarios:

- A Microsoft engineer needs to do an activity that falls outside of standard operating procedures. For example, to recover or restore services in unexpected or unpredictable scenarios.
- A Microsoft engineer accesses the Azure platform as part of troubleshooting and inadvertently has access to customer data. For example, the Azure Network Team performs troubleshooting that results in a packet capture on a network device. In this scenario, if the customer encrypts the data while it is in transit then the engineer cannot read the data.

## Next steps

Customer Lockbox is available for all customers who have an [Azure support plan](https://azure.microsoft.com/support/plans/) with a minimal level of **Developer**. You can enable Customer Lockbox from the [Administration module](https://aka.ms/customerlockbox/administration) in the Customer Lockbox blade.

Customer Lockbox requests are initiated by a Microsoft engineer if this action is needed to progress a support case.
