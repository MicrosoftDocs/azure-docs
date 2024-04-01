---
title: Customer Lockbox for Microsoft Azure
description: Technical overview of Customer Lockbox for Microsoft Azure, which provides control over cloud provider access when Microsoft might need to access customer data.
author: msmbaldwin
ms.service: information-protection
ms.topic: article
ms.author: mbaldwin
ms.date: 03/15/2024
---

# Customer Lockbox for Microsoft Azure

> [!NOTE]
> To use this feature, your organization must have an [Azure support plan](https://azure.microsoft.com/support/plans/) with a minimal level of **Developer**.

Most operations and support performed by Microsoft personnel and subprocessors do not require access to customer data. In those rare circumstances where such access is required, Customer Lockbox for Microsoft Azure provides an interface for customers to review and approve or reject customer data access requests. It is used in cases where a Microsoft engineer needs to access customer data, whether in response to a customer-initiated support ticket or a problem identified by Microsoft.

This article covers how to enable Customer Lockbox for Microsoft Azure and how requests are initiated, tracked, and stored for later reviews and audits.

## Supported services

The following services are currently supported for Customer Lockbox for Microsoft Azure:

- Azure API Management
- Azure App Service
- Azure AI Search
- Azure Chaos Studio
- Azure Cognitive Services
- Azure Container Registry
- Azure Data Box
- Azure Data Explorer
- Azure Data Factory
- Azure Data Manager for Energy
- Azure Database for MySQL
- Azure Database for MySQL Flexible Server
- Azure Database for PostgreSQL
- Azure Edge Zone Platform Storage
- Azure Energy
- Azure Functions
- Azure HDInsight
- Azure Health Bot
- Azure Intelligent Recommendations
- Azure Kubernetes Service
- Azure Load Testing (CloudNative Testing)
- Azure Logic Apps
- Azure Monitor (Log Analytics)
- Azure Red Hat OpenShift
- Azure Spring Apps
- Azure SQL Database
- Azure SQL Managed Instance
- Azure Storage
- Azure Subscription Transfers
- Azure Synapse Analytics
- Commerce AI (Intelligent Recommendations)
- DevCenter / DevBox
- ElasticSan
- Kusto (Dashboards)
- Microsoft Azure Attestation
- OpenAI
- Spring Cloud
- Unified Vision Service
- Virtual Machines in Azure

## Enable Customer Lockbox for Microsoft Azure

You can now enable Customer Lockbox for Microsoft Azure from the [Administration module](https://aka.ms/customerlockbox/administration).  

> [!NOTE]
> To enable Customer Lockbox for Microsoft Azure, the user account needs to have the [Global Administrator role assigned](../../active-directory/roles/manage-roles-portal.md).

## Workflow

The following steps outline a typical workflow for a Customer Lockbox for Microsoft Azure request.

1. Someone at an organization has an issue with their Azure workload.
1. After this person troubleshoots the issue, but can't fix it, they open a support ticket from the [Azure portal](https://portal.azure.com/signin/index/?feature.settingsportalinstance=mpac). The ticket is assigned to an Azure Customer Support Engineer.
1. An Azure Support Engineer reviews the service request and determines the next steps to resolve the issue.
1. If the support engineer can't troubleshoot the issue by using standard tools and service generated data, the next step is to request elevated permissions by using a Just-In-Time (JIT) access service. This request can be from the original support engineer or from a different engineer because the problem is escalated to the Azure DevOps team.
1. After the Azure Engineer submits an access request, Just-In-Time service evaluates the request taking into account factors such as:
    - The scope of the resource.
    - Whether the requester is an isolated identity or using multifactor authentication.
    - Permissions levels.
    Based on the JIT rule, this request might also include an approval from Internal Microsoft Approvers. For example, the approver might be the Customer support lead or the DevOps Manager.
1. When the request requires direct access to customer data, a Customer Lockbox request is initiated. For example, remote desktop access to a customer's virtual machine.
    
    The request is now in a **Customer Notified** state, waiting for the customer's approval before granting access.
1. One or more approvers at the customer organization for a given Customer Lockbox request are determined as follows:
    - For Subscription scoped requests (requests to access specific resources contained within a subscription), users with the Owner role or the Azure Customer Lockbox Approver for Subscription role (currently in public preview) on the associated subscription.
    - For Tenant scope requests (requests to access the Microsoft Entra tenant), users with the Global Administrator role on the Tenant.
    > [!NOTE]
    > Role assignments must be in place before Customer Lockbox for Microsoft Azure starts to process a request. Any role assignments made after Customer Lockbox for Microsoft Azure starts to process a given request will not be recognized.  Because of this, to use PIM eligible assignments for the Subscription Owner role, users are required to activate the role before the Customer Lockbox request is initiated. Refer to [Activate Microsoft Entra roles in PIM](../../active-directory/privileged-identity-management/pim-how-to-activate-role.md) / [Activate Azure resource roles in PIM](../../active-directory/privileged-identity-management/pim-resource-roles-activate-your-roles.md#activate-a-role) for more information on activating PIM eligible roles.
    > 
    > **Role assignments scoped to management groups are not supported in Customer Lockbox for Microsoft Azure at this time.**
1. At the customer organization, designated lockbox approvers ([Azure Subscription Owner](../../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles)/[Microsoft Entra Global admin](../../role-based-access-control/rbac-and-directory-admin-roles.md#azure-ad-roles)/Azure Customer Lockbox Approver for Subscription receive an email from Microsoft to notify them about the pending access request.  You can also use the [Azure Lockbox alternate email notifications](customer-lockbox-alternative-email.md) feature (currently in public preview) to configure an alternate email address to receive lockbox notifications in scenarios where Azure account is not email enabled or if a service principal is defined as the lockbox approver.

    
    Example email:
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-email-notification.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-email-notification.png" alt-text="A screenshot of the email notification.":::

1. The email notification provides a link to the **Customer Lockbox** blade in the Administration module. The designated approver signs in to the Azure portal to view any pending requests that their organization has for Customer Lockbox for Microsoft Azure:
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-landing-page.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-landing-page.png" alt-text="A screenshot of the Customer Lockbox for Microsoft Azure landing page.":::
   The request remains in the customer queue for four days. After this time, the access request automatically expires and no access is granted to Microsoft engineers.
1. To get the details of the pending request, the designated approver can select the Customer Lockbox request from **Pending Requests**:
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-pending-requests.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-pending-requests.png" alt-text="A screenshot of the pending request.":::
1. The designated approver can also select the **SERVICE REQUEST ID** to view the support ticket request that was created by the original user. This information provides context for why Microsoft Support is engaged, and the history of the reported problem. For example:
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-support-ticket.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-support-ticket.png" alt-text="A screenshot of the support ticket request.":::
1. The designated approver reviews the request and selects **Approve** or **Deny**:
    :::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-approval.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-approval.png" alt-text="A screenshot of the Approve or Deny UI.":::
    As a result of the selection:
    - **Approve**:  Access is granted to the Microsoft engineer for the duration specified in the request details, which is shown in the email notification and in the Azure portal
    - **Deny**: The elevated access request by the Microsoft engineer is rejected and no further action is taken.
    
    For auditing purposes, the actions taken in this workflow are logged in [Customer Lockbox request logs](#auditing-logs).

## Auditing logs

Customer Lockbox logs are stored in activity logs. In the Azure portal, select **Activity Logs** to view auditing information related to Customer Lockbox requests. You can filter for specific actions, such as:
- **Deny Lockbox Request**
- **Create Lockbox Request**
- **Approve Lockbox Request**
- **Lockbox Request Expiry**

As an example:

:::image type="content" source="./media/customer-lockbox-overview/customer-lockbox-activitylogs.png" lightbox="./media/customer-lockbox-overview/customer-lockbox-activitylogs.png" alt-text="A screenshot of the activity logs.":::

## Customer Lockbox for Microsoft Azure integration with the Microsoft cloud security benchmark

We introduced a new baseline control ([PA-8: Determine access process for cloud provider support](/security/benchmark/azure/mcsb-privileged-access#pa-8-determine-access-process-for-cloud-provider-support)) in the Microsoft cloud security benchmark that covers Customer Lockbox applicability. Customers can now use the benchmark to review Customer Lockbox applicability for a service.

## Exclusions

Customer Lockbox requests are not triggered in the following scenarios:

- Emergency scenarios that fall outside of standard operating procedures. For example, a major service outage requires immediate attention to recover or restore services in an unexpected or unpredictable scenario. These “break glass” events are rare and, in most instances, do not require any access to customer data to resolve.
- A Microsoft engineer accesses the Azure platform as part of troubleshooting and is inadvertently exposed to customer data. For example, the Azure Network Team performs troubleshooting that results in a packet capture on a network device. It is rare that such scenarios would result in access to meaningful quantities of customer data. Customers can further protect their data through the use of Customer-managed keys (CMK), which is available for some Azure service. For more information see [Overview of Key Management in Azure](key-management.md).

External legal demands for data also do not trigger Customer Lockbox requests. For details, see the discussion of [government requests for data](https://www.microsoft.com/trust-center/) on the Microsoft Trust Center.

## Next steps

Enable Customer Lockbox from the [Administration module](https://ms.portal.azure.com/#view/Microsoft_Azure_Lockbox/LockboxMenu/~/Overview) in the Customer Lockbox blade. Customer Lockbox for Microsoft Azure is available for all customers who have an [Azure support plan](https://azure.microsoft.com/support/plans/) with a minimal level of Developer.

- [Customer Lockbox for Microsoft Azure alternate email notifications](customer-lockbox-alternative-email.md)
- [Customer Lockbox for Microsoft Azure FAQ](customer-lockbox-faq.yml)
