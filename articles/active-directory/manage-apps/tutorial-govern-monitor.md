---
title: "Tutorial: Govern and monitor applications"
description: In this tutorial, you learn how to govern and monitor an application in Microsoft Entra ID.
author: omondiatieno
manager: CelesteDG
ms.author: jomondi
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: tutorial
ms.date: 09/07/2023
ms.reviewer: saibandaru
ms.custom: enterprise-apps

# Customer intent: As an administrator of a Microsoft Entra tenant, I want to govern and monitor my applications.
---

# Tutorial: Govern and monitor applications

The IT administrator at Fabrikam has added and configured an application from the [Microsoft Entra application gallery](overview-application-gallery.md). They also made sure that access can be managed and that the application is secure by using the information in [Tutorial: Manage application access and security](tutorial-manage-access-security.md). They now need to understand the resources that are available to govern and monitor the application.

Using the information in this tutorial, an administrator of the application learns how to:

> [!div class="checklist"]
> * Create an access review
> * Access the audit logs report
> * Access the sign-ins report
> * Send logs to Azure Monitor

## Prerequisites

- An Azure account with an active subscription. If you don't already have one, [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Identity Governance Administrator, Privileged Role Administrator, Cloud Application Administrator, or Application Administrator.
- An enterprise application that has been configured in your Microsoft Entra tenant.

## Create an access review

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

The administrator wants to make sure that users or guests have appropriate access. They decide to ask users of the application to participate in an access review and recertify or attest to their need for access. When the access review is finished, they can then make changes and remove access from users who no longer need it. For more information, see
[Manage user and guest user access with access reviews](../governance/manage-access-review.md).

To create an access review:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Identity Governance** > **Access reviews**.
1. Select **New access review** to create a new access review.
1. In **Select what to review**, select **Applications**.
1. Select **+ Select application(s)**, select the application, and then choose **Select**.
1. Now you can select a scope for the review. Your options are:
    - **Guest users only** - This option limits the access review to only the Microsoft Entra B2B guest users in your directory.
    - **All users** - This option scopes the access review to all user objects associated with the resource.
    Select **All users**.
1. Select **Next: Reviews**.
1. In the **Specify reviewers** section, in the Select reviewers box, select **Selected user(s) or group(s)**, select **+ Select reviewers**, and then select the user account that is assigned to the application.
1. In the **Specify recurrence of review** section, specify the following selections:
    - **Duration (in days)** - Accept the default value of **3**.
    - **Review recurrence** - select **One time**.
    - **Start date** - Accept today's date as the start date.
1. Select **Next: Settings**.
1. In the **Upon completion settings** section, you can specify what happens after the review finishes. Select **Auto apply results to resource**.
1. Select **Next: Review + Create**.
1. Name the access review. Optionally, give the review a description. The name and description are shown to the reviewers.
1. Review the information and select **Create**.

### Start the access review

The access review starts in a few minutes and it appears in your list with an indicator of its status. 

By default, Microsoft Entra ID sends an email to reviewers shortly after the review starts. If you choose not to have Microsoft Entra ID send the email, be sure to inform the reviewers that an access review is waiting for them to complete. You can show them the instructions for how to review access to groups or applications. If your review is for guests to review their own access, show them the instructions for how to review access for themselves to groups or applications.

If you've assigned guests as reviewers and they haven't accepted their invitation to the tenant, they won't receive an email from access reviews. They must first accept the invitation before they can begin reviewing.

### View the status of an access review

You can track the progress of access reviews as they are completed.
 
1. Go to **Identity** > **Identity Governance** > **Access reviews**.
1. In the list, select the access review you created.
1. On the **Overview** page, check the progress of the access review. 

The **Results** page provides information on each user under review in the instance, including the ability to Stop, Reset, and Download results. To learn more, check out the [Complete an access review of groups and applications in Microsoft Entra access reviews](../governance/complete-access-review.md) article. 

## Access the audit logs report

The audit logs report combines several reports around application activities into a single view for context-based reporting. For more information, see [Audit logs in Microsoft Entra ID](../reports-monitoring/concept-audit-logs.md).

To access the audit logs report, go to **Identity** > **Monitoring & health** > **Audit logs**.

The audit logs report consolidates the following reports:

- Password reset activity
- Password reset registration activity
- Self-service groups activity
- Office365 Group Name Changes
- Account provisioning activity
- Password rollover status
- Account provisioning errors

## Access the sign-ins report

The Sign-ins view includes all user sign-ins, and the Application Usage report. You also can view application usage information in the Manage section of the Enterprise applications overview. For more information, see [Sign-in logs in Microsoft Entra ID](../reports-monitoring/concept-sign-ins.md)

To access the sign-in logs report, go to **Identity** > **Monitoring & health** > **Sign-in logs**.

## Send logs to Azure Monitor

The Microsoft Entra activity logs only store information for a maximum of 30 days. Depending on your needs, you may require extra storage to back up the activity logs data. Using the Azure Monitor, you can archive the audit and sign logs to an Azure storage account to retain the data for a longer time. 
The Azure Monitor is also useful for rich visualization, monitoring and alerting of data. To learn more about the Azure Monitor and the cost considerations for extra storage, see [Microsoft Entra activity logs in Azure Monitor](../reports-monitoring/concept-activity-logs-azure-monitor.md).

To send logs to your logs analytics workspace:

1. Select **Diagnostic settings**, and then select **Add diagnostic setting**. You can also select Export Settings from the Audit Logs or Sign-ins page to get to the diagnostic settings configuration page.
1. In the Diagnostic settings menu, select **Send to Log Analytics workspace**, and then select Configure.
1. Select the Log Analytics workspace you want to send the logs to, or create a new workspace in the provided dialog box.
1. Select the logs that you would like to send to the workspace.
1. Select **Save** to save the setting.

After about 15 minutes, verify that events are streamed to your Log Analytics workspace.

## Next steps

Advance to the next article to learn how to...
> [!div class="nextstepaction"]
> [Manage consent to applications and evaluate consent requests](manage-consent-requests.md)
