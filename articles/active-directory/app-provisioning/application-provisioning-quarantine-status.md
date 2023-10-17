---
title: Quarantine status in Microsoft Entra Application Provisioning
description: When you've configured an application for automatic user provisioning, learn what a provisioning status of Quarantine means and how to clear it.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/15/2023
ms.author: kenwith
ms.reviewer: arvinh
---

# Application provisioning in quarantine status

The Microsoft Entra provisioning service monitors the health of your configuration. It also places unhealthy apps in a "quarantine" state. If most, or all, of the calls made against the target system consistently fail then the provisioning job is marked as in quarantine. An example of a failure is an error received because of invalid admin credentials.

While in quarantine:
- The frequency of incremental cycles is gradually reduced to once per day.
- The provisioning job is removed from quarantine after all errors are fixed and the next sync cycle starts. 
- If the provisioning job stays in quarantine for more than four weeks, the provisioning job is disabled (stops running).

## How do I know if my application is in quarantine?

There are three ways to check whether an application is in quarantine:

- In the Microsoft Entra admin center, navigate to **Identity** > **Applications** > **Enterprise applications** > &lt;*application name*&gt; > **Provisioning** and review the progress bar for a quarantine message.   

  ![Provisioning status bar showing quarantine status](./media/application-provisioning-quarantine-status/progress-bar-quarantined.png)

- In the Microsoft Entra admin center, navigate to **Identity** > **Monitoring & health** > **Audit Logs** > filter on **Activity: Quarantine** and review the quarantine history. The view in the progress bar as described above shows whether provisioning is currently in quarantine. The audit logs show the quarantine history for an application. 

- Use the Microsoft Graph request [Get synchronizationJob](/graph/api/synchronization-synchronizationjob-get?tabs=http&view=graph-rest-beta&preserve-view=true) to programmatically get the status of the provisioning job:

```microsoft-graph
        GET https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/
```

- Check your email. When an application is placed in quarantine, a one-time notification email is sent. If the quarantine reason changes, an updated email is sent showing the new reason for quarantine. If you don't see an email:

  - Make sure you've specified a valid **Notification Email** in the provisioning configuration for the application.
  - Make sure there's no spam filtering on the notification email inbox.
  - Make sure you haven't unsubscribed from emails.
  - Check for emails from `azure-noreply@microsoft.com`

## Why is my application in quarantine?

Below are the common reasons your application may go into quarantine

|Description|Recommended Action|
|---|---|
|**SCIM Compliance issue:** An HTTP/404 Not Found response was returned rather than the expected HTTP/200 OK response. In this case, the Microsoft Entra provisioning service has made a request to the target application and received an unexpected response.|Check the admin credentials section. See if the application requires specifying the tenant URL and that the URL is correct. If you don't see an issue, contact the application developer to ensure that their service is SCIM-compliant. https://tools.ietf.org/html/rfc7644#section-3.4.2 |
|**Invalid credentials:** When attempting to authorize,  access to the target application, we received a response from the target application that indicates the credentials provided are invalid.|Navigate to the admin credentials section of the provisioning configuration UI and authorize access again with valid credentials. If the application is in the gallery, review the application configuration tutorial for anymore required steps.|
|**Duplicate roles:** Roles imported from certain applications like Salesforce and Zendesk must be unique. |Navigate to the application [manifest](../develop/reference-app-manifest.md) in the Microsoft Entra admin center and remove the duplicate role.|

 A Microsoft Graph request to get the status of the provisioning job shows the following reason for quarantine:
- `EncounteredQuarantineException` indicates that invalid credentials were provided. The provisioning service is unable to establish a connection between the source system and the target system.
- `EncounteredEscrowProportionThreshold` indicates that provisioning exceeded the escrow threshold. This condition occurs when more than 40% of provisioning events failed. For more information, see escrow threshold details below.
- `QuarantineOnDemand` means that we've detected an issue with your application and have manually set it to quarantine.

**Escrow thresholds**

If the proportional escrow threshold is met, the provisioning job will go into quarantine. This logic is subject to change, but works roughly as described below: 

A job can go into quarantine regardless of failure counts for issues such as admin credentials or SCIM compliance. However, in general, 5,000 failures are the minimum to start evaluating whether to quarantine because of too many failures. For example, a job with 4,000 failures wouldn't go into quarantine. But, a job with 5,000 failures would trigger an evaluation. An evaluation uses the following criteria:  
- If more than 40% of provisioning events fail, or there are more than 40,000 failures, the provisioning job will go into quarantine. Reference failures won't be counted as part of the 40% threshold or 40,000 threshold. For example, failure to update a manager or a group member is a reference failure.
- A job where 45,000 users were unsuccessfully provisioned would lead to quarantine as it exceeds the 40,000 threshold.
- A job where 30,000 users failed provisioning and 5,000 were successful would lead to quarantine as it exceeds the 40% threshold and 5,000 minimum.
- A job with 20,000 failures and 100,000 success wouldn't go into quarantine because it does not exceed the 40% failure threshold or the 40,000 failure max.  
- There's an absolute threshold of 60,000 failures that accounts for both reference and non-reference failures. For example, 40,000 users failed to be provisioned and 21,000 manager updates failed. The total is 61,000 failures and exceeds the 60,000 limit.

**Retry duration**

The logic documented here may be different for certain connectors to ensure best customer experience, but we generally have the below retry cycles after a failure:

After the failure, the first retry will happen in 6 hours.
- The second retry happens 12 hours after the first failure.
- The third retry happens 24 hours after the first failure.

There will be retries every 24 hours after the 3rd retry. The retries will go on for 28 days after the first failure after which the escrow entry is removed and the job is disabled.  
If any of the retries above gets a successful response, the job is automatically put out of quarantine and shall resume regular sync behavior.

## How do I get my application out of quarantine?

First, resolve the issue that caused the application to be placed in quarantine.

- Check the application's provisioning settings to make sure you've [entered valid Admin Credentials](../app-provisioning/configure-automatic-user-provisioning-portal.md#configuring-automatic-user-account-provisioning). Microsoft Entra ID must establish a trust with the target application. Ensure that you have entered valid credentials and your account has the necessary permissions.

- Review the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to further investigate what errors are causing quarantine and address the error. Go to **Microsoft Entra ID** &gt; **Enterprise Apps** &gt; **Provisioning logs (preview)** in the **Activity** section.

After you've resolved the issue, restart the provisioning job. Certain changes to the application's provisioning settings, such as attribute mappings or scoping filters, will automatically restart provisioning for you. The progress bar on the application's **Provisioning** page indicates when provisioning last started. If you need to restart the provisioning job manually, use one of the following methods:  

- Use the Microsoft Entra admin center to restart the provisioning job. On the application's **Provisioning** page, select **Restart provisioning**. This action fully restarts the provisioning service, which can take some time. A full initial cycle will run again, which clears escrows, removes the app from quarantine, and clears any watermarks. The service will then evaluate all the users in the source system again and determine if they are in scope for provisioning. This can be useful when your application is currently in quarantine, as this article discusses, or you need to make a change to your attribute mappings. Note that the initial cycle takes longer to complete than the typical incremental cycle due to the number of objects that need to be evaluated. You can learn more about the performance of initial and incremental cycles [here](application-provisioning-when-will-provisioning-finish-specific-user.md).

- Use Microsoft Graph to [restart the provisioning job](/graph/api/synchronization-synchronizationjob-restart?tabs=http&view=graph-rest-beta&preserve-view=true). You'll have full control over what you restart. You can choose to clear escrows (to restart the escrow counter that accrues toward quarantine status), clear quarantine (to remove the application from quarantine), or clear watermarks. Use the following request:

```microsoft-graph
        POST /servicePrincipals/{id}/synchronization/jobs/{jobId}/restart
```

Replace "{ID}" with the value of the Application ID, and replace "{jobId}" with the [ID of the synchronization job](/graph/synchronization-configure-with-directory-extension-attributes?preserve-view=true&tabs=http&view=graph-rest-beta#list-synchronization-jobs-in-the-context-of-the-service-principal).
