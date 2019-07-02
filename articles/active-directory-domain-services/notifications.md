---
title: 'Azure Active Directory Domain Services: Notification settings | Microsoft Docs'
description: Notification settings for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager: daveba
editor: curtand

ms.assetid: b9af1792-0b7f-4f3e-827a-9426cdb33ba6
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/20/2019
ms.author: iainfou

---
# Notification settings in Azure AD Domain Services

Notifications for Azure AD Domain Services allows you to be updated as soon as a health alert is detected on your managed domain.  

This feature is only available for managed domains that are not on classic virtual networks.


## How to check your Azure AD Domain Services email notification settings

1. Navigate to the [Azure AD Domain Services page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.AAD%2FdomainServices) on the Azure portal
2. Choose your managed domain from the table
3. In the left-hand navigation, choose **Notification settings**

On the page it lists out all of the email recipients for email notifications for Azure AD Domain Services.

## What does an email notification look like?

The following picture is an example of an email notification:

![Example email notification](./media/active-directory-domain-services-alerts/email-alert.png)

The email specifies the managed domain that the alert is present on, as well as giving the time of detection and a link to the Azure AD Domain Services health page in the Azure portal.

> [!WARNING]
> Always make sure that the email is coming from a verified Microsoft sender before clicking links in your emails. The emails always come from the email azure-noreply@microsoft.com


## Why would I receive email notifications?

Azure AD Domain Services sends email notifications for important updates about your domain.  These notifications are only for urgent matters that will impact your service and should be addressed immediately. Each email notification is triggered by an alert on your managed domain. These alerts will also appear on the Azure portal and can be viewed on the [Azure AD Domain Services health page](check-health.md).

Azure AD Domain Services does not send emails to this list for advertisement, updates, or sales purposes.

## When will I receive email notifications?

A notification will be sent immediately when a [new alert](troubleshoot-alerts.md) is found on your managed domain. If the alert is not resolved, an email notification will be sent as a reminder every four days.

## Who should receive the email notifications?


 We recommended the list of email recipients for Azure AD Domain Services to be composed of people who are able to administer and make changes to the managed domain. This email list should be thought of as your "first responders" to any problem found. If you have more than five additional emails you would like to add, we recommend creating a distribution list to add to the notification list instead.

You are able to add up to five additional emails for notifications regarding Azure AD Domain Services. In addition, you can also choose to have all Global Administrators of your directory and every member of the group 'AAD DC Administrators' receive Azure AD Domain Services email notifications. Azure AD Domain Services will only send notifications to up to 100 email addresses, including the list of global administrators and AAD DC Administrators.


## How to add an additional email recipient

> [!WARNING]
> When changing the notification settings, you are changing the notification settings for the entire managed domain, not just yourself.

1. Navigate to the [Azure AD Domain Services page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.AAD%2FdomainServices) on the Azure portal.
2. Click on your managed domain.
3. On the left-hand navigation, click **Notification settings**.
4. To add an email, type in the email address in the additional recipients table.
5. Click "Save" on the top-hand navigation.

## Frequently asked questions

#### I received an email notification for an alert but when I logged on to the Azure portal there was no alert. What happened?

If an alert is resolved, the alert will disappear from the Azure portal. The most likely reason is that someone else who receives email notifications resolved the alert on your managed domain, or it was auto-resolved by Azure AD Domain Services.


#### Why can I not edit the notification settings?

If you are unable to access the notification settings page in the Azure portal, you do not have the permissions to edit Azure AD Domain Services. You must contact your global administrator to either get permissions to edit Azure AD Domain Services resources or be removed from the recipient list.

#### I don't seem to be receiving email notifications even though I provided my email address. Why?

Check your spam or junk folder in your email for the notification and make sure to whitelist the sender (azure-noreply@microsoft.com).

## Next steps
- [Resolve alerts on your managed domain](troubleshoot-alerts.md)
- [Read more about Azure AD Domain Services](overview.md)
- [Contact the product team](contact-us.md)

## Contact us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](contact-us.md).
