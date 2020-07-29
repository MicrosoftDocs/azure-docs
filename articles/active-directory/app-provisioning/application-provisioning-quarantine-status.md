---
title: Application Provisioning status of Quarantine | Microsoft Docs
description: When you've configured an application for automatic user provisioning, learn what a provisioning status of Quarantine means and how to clear it.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: troubleshooting
ms.date: 04/28/2020
ms.author: kenwith
ms.reviewer: arvinh
---

# Application provisioning in quarantine status

The Azure AD provisioning service monitors the health of your configuration and places unhealthy apps in a "quarantine" state. If most or all of the calls made against the target system consistently fail because of an error, for example invalid admin credentials, the provisioning job is marked as in quarantine.

While in quarantine, the frequency of incremental cycles is gradually reduced to once per day. The provisioning job is removed from quarantine after all errors are fixed and the next sync cycle starts. If the provisioning job stays in quarantine for more than four weeks, the provisioning job is disabled (stops running).

## How do I know if my application is in quarantine?

There are three ways to check whether an application is in quarantine:
  
- In the Azure portal, navigate to **Azure Active Directory** > **Enterprise applications** > &lt;*application name*&gt; > **Provisioning** and review the progress bar for a quarantine message.   

  ![Provisioning status bar showing quarantine status](./media/application-provisioning-quarantine-status/progress-bar-quarantined.png)

- In the Azure portal, navigate to **Azure Active Directory** > **Audit Logs** > filter on **Activity: Quarantine** and review the quarantine history. While the view in the progress bar as described above shows whether provisioning is currently in quarantine, the audit logs allow you to see the quarantine history for an application. 

- Use the Microsoft Graph request [Get synchronizationJob](https://docs.microsoft.com/graph/api/synchronization-synchronizationjob-get?view=graph-rest-beta&tabs=http) to programmatically get the status of the provisioning job:

        `GET https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/`

- Check your email. When an application is placed in quarantine, a one-time notification email is sent. If the quarantine reason changes, an updated email is sent showing the new reason for quarantine. If you don't see an email:

  - Make sure you have specified a valid **Notification Email** in the provisioning configuration for the application.
  - Make sure there is no spam filtering on the notification email inbox.
  - Make sure you have not unsubscribed from emails.

## Why is my application in quarantine?

|Description|Recommended Action|
|---|---|
|**SCIM Compliance issue:** An HTTP/404 Not Found response was returned rather than the expected HTTP/200 OK response. In this case the Azure AD provisioning service has made a request to the target application and received an unexpected response.|Check the admin credentials section to see if the application requires specifying the tenant URL and ensure that the URL is correct. If you don't see an issue, please contact the application developer to ensure that their service is SCIM-compliant. https://tools.ietf.org/html/rfc7644#section-3.4.2 |
|**Invalid credentials:** When attempting to authorize access to the target application we received a response from the target application that indicates the credentials provided are invalid.|Please navigate to the admin credentials section of the provisioning configuration UI and authorize access again with valid credentials. If the application is in the gallery, review the application configuration tutorial for any additional steps required.|
|**Duplicate roles:** Roles imported from certain applications like Salesforce and Zendesk must be unique. |Navigate to the application [manifest](https://docs.microsoft.com/azure/active-directory/develop/reference-app-manifest) in the Azure portal and remove the duplicate role.|

 A Microsoft Graph request to get the status of the provisioning job shows the following reason for quarantine:

- `EncounteredQuarantineException` indicates that invalid credentials were provided. The provisioning service is unable to establish a connection between the source system and the target system.

- `EncounteredEscrowProportionThreshold` indicates that provisioning exceeded the escrow threshold. This condition occurs when more than 60% of provisioning events failed.

- `QuarantineOnDemand` means that we've detected an issue with your application and have manually set it to quarantine.

## How do I get my application out of quarantine?

First, resolve the issue that caused the application to be placed in quarantine.

- Check the application's provisioning settings to make sure you've [entered valid Admin Credentials](../app-provisioning/configure-automatic-user-provisioning-portal.md#configuring-automatic-user-account-provisioning). Azure AD must be able to establish a trust with the target application. Ensure that you have entered valid credentials and your account has the necessary permissions.

- Review the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to further investigate what errors are causing quarantine and address the error. Access the provisioning logs in the Azure portal by going to **Azure Active Directory** &gt; **Enterprise Apps** &gt; **Provisioning logs (preview)** in the **Activity** section.

After you've resolved the issue, restart the provisioning job. Certain changes to the application's provisioning settings, such as attribute mappings or scoping filters, will automatically restart provisioning for you. The progress bar on the application's **Provisioning** page indicates when provisioning last started. If you need to restart the provisioning job manually, use one of the following methods:  

- Use the Azure portal to restart the provisioning job. On the application's **Provisioning** page under **Settings**, select **Clear state and restart synchronization** and set **Provisioning Status** to **On**. This action fully restarts  the provisioning service, which can take some time. A full initial cycle will run again, which clears escrows, removes the app from quarantine, and clears any watermarks.

- Use Microsoft Graph to [restart the provisioning job](https://docs.microsoft.com/graph/api/synchronization-synchronizationjob-restart?view=graph-rest-beta&tabs=http). You'll have full control over what you restart. You can choose to clear escrows (to restart the escrow counter that accrues toward quarantine status), clear quarantine (to remove the application from quarantine), or clear watermarks. Use the following request:
 
       `POST /servicePrincipals/{id}/synchronization/jobs/{jobId}/restart`
