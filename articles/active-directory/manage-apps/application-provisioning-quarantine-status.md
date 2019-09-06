---
title: Application Provisioning status of Quarantine | Microsoft Docs
description: When you've configured an application for automatic user provisioning, learn what a provisioning status of Quarantine means and how to clear it.
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/06/2019
ms.author: mimart
ms.reviewer: arvinh

ms.collection: M365-identity-device-management
---

# Application provisioning in quarantine status

If most or all of the calls made against the target system consistently fail because of an error, like invalid admin credentials, the provisioning job is placed in a "quarantine" state.

While in quarantine, the frequency of incremental syncs is gradually reduced to once per day. The provisioning job is removed from quarantine after all errors are fixed and the next sync cycle starts. If the provisioning job stays in quarantine for more than four weeks, the provisioning job is disabled.

## How do I know if my application is in quarantine?

There are three ways to check whether an application is in quarantine:
  
- In the Azure portal, navigate to **Azure Active Directory** > **Enterprise applications** > &lt;*application name*&gt; > **Provisioning** and scroll to the progress bar at the bottom.  

- Use Microsoft Graph to programmatically get the status of provisioning. The quarantine resource provides the reason the application is in quarantine. Use the following request:

  `GET https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/`

- Check your email. Notification emails are sent 1 day after quarantine to the email specified in your provisioning configuration. The notifications are resent **`[>>>periodically<<<]`**. If you don't see an email:

  - Make sure the following alias is not blocked: **`[>>>NEED ALIAS<<<]`**

  - Make sure you have specified a valid **Notification Email** in the provisioning configuration for the application
  - Make sure there is no spam filtering on the notification email inbox
  - Make sure you have not unsubscribed from emails

## Why is my application in quarantine?

Applications can fall into quarantine for a number of reasons:

- Invalid credentials were provided, and the provisioning service is unable to establish a connection between the source system and the target system. A Microsoft Graph request shows the following reason for quarantine:

    `EncounteredQuarantineException`

- Provisioning exceeded the escrow threshold. This condition occurs when more than 5,000 objects were unsuccessfully provisioned and **`[>>>"and" or "or"?<<<]`** more than 60% of objects were unsuccessfully provisioned. A Microsoft Graph request shows the following reason for quarantine:

  `EncounteredEscrowProportionThreshold`

- We've detected an issue with your application and have manually set it to quarantine. A Microsoft Graph request shows the following reason for quarantine:

   `QuarantineOnDemand`

## How do I get my application out of quarantine?

First, resolve the issue that caused the application to be placed in quarantine.

- Check the application's provisioning settings to make sure you've entered valid **Admin Credentials**. Azure AD must be able to establish a trust with the target application. Ensure that you have entered valid credentials and your account has the necessary permissions.

- Review the provisioning logs to further investigate what errors are causing quarantine and address the error. Access the provisioning logs in the Azure portal by going to **Azure Active Directory** &gt; **Enterprise Apps** &gt; **Provisioning logs (preview)** in the **Activity** section.

After you've resolved the issue, restart the provisioning job. Certain changes to the application's provisioning settings, such as attribute mappings or scoping filters, will automatically restart provisioning for you. The progress bar on the application's **Provisioning** page indicates when provisioning last started. If you need to restart the provisioning job manually, use one of the following methods:  

- Use the Azure portal to restart the provisioning job. On the application's **Provisioning** page under **Settings**, select **Clear state and restart synchronization** and set **Provisioning Status** to **On**. This action fully restarts  the provisioning service, which can take some time. A full initial cycle will run again, which clears escrows, removes the app from quarantine, and clears any watermarks.

- Use Microsoft Graph to restart the provisioning job. You'll have full control over what you restart. You can choose to clear escrows (to restart the escrow counter that accrues toward quarantine status), clear quarantine (to remove the application from quarantine), or clear watermarks.
