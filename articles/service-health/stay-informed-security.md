---
title: Stay informed about Azure security issues
description: This article shows you where Azure customers receive Azure security notifications and three steps you can follow to ensure security alerts reach the right people in your organization.
ms.topic: conceptual
ms.date: 10/27/2022
---
# Stay informed about Azure security issues

With the increased adoption of cloud computing, customers rely increasingly on Azure to run their workload for critical and non-critical business applications. It is important for you as Azure customers to stay informed about Azure security issues or privacy breaches and take the right action to protect your environment.

This article shows you where Azure customers receive Azure security notifications and three steps you can follow to ensure security alerts reach the right people in your organization.


## View and manage Azure security notifications 


### Security issues affecting your Azure subscription workloads

You receive security-related notifications affecting your Azure **subscription** workloads in two ways: 

**Security Advisory in [Azure Service Health](https://azure.microsoft.com/get-started/azure-portal/service-health/)**

Service health notifications are published by Azure and contain information about the resources under your subscription. You can review these security advisories in the Service Health experience in the Azure portal and get notified about security advisories via your preferred channel by setting up Service Health alerts for this type of notification. You can create [Activity Log alerts](../service-health/alerts-activity-log-service-notifications-portal.md) on Service notifications by using the Azure portal.

>[!Note]
>Depending on your requirements, you can configure various alerts to use the same [action group](../azure-monitor/alerts/action-groups.md) or different action groups. Action group types include sending a voice call, SMS, or email. You can also trigger various types of automated actions.

**Email Notification**

If a security issue requires direct action taken by subscription admins/owners, or critical and sensitive resource information needs to be shared, we send an email notification to subscription admins/owners.

>[!Note]
>You should ensure that there is a **contactable email address** as the [subscription administrator or subscription owner](../cost-management-billing/manage/add-change-subscription-administrator.md). This email address is used for security issues that would have impact at the subscription level.

### Security issues affecting your Azure tenant workloads

We typically communicate security-related information affecting your Azure **tenant** workloads via **Email Notification**. We send an email notification to Global admin and Technical Contacts

>[!Note]
>You should ensure that there is a **contactable email address** entered for your organization's [Global Admin](../active-directory/roles/permissions-reference.md) and [Technical contact](../active-directory/fundamentals/active-directory-properties-area.md) on your tenant. This email address is used for security issues that would have impact at the tenant level.  

## Three steps to help you stay informed about Azure security issues

**1. Check Contact on Subscription Admin Owner Role**

Ensure that there is a **contactable email address** as the [subscription administrator or subscription owner](../cost-management-billing/manage/add-change-subscription-administrator.md). This email address is used for security issues that would have impact at the subscription level.

**2. Check Contact on Tenant Global Admin and Technical Contact Role**

Ensure that there is a **contactable email address** entered for your [Global Admin](../active-directory/roles/permissions-reference.md) and [Technical contact](../active-directory/fundamentals/active-directory-properties-area.md) on your tenant. This email address is used for security issues that would have an impact at the tenant level.

**3. Create Azure Service Health Alerts for Subscription Notifications**

Create **Azure Service Health** alerts for security events so that your organization can be alerted for any security event that Microsoft identifies. This is the same channel you would configure to be alerted of outages, or maintenance information on the platform: [Create Activity Log Alerts on Service Notifications using the Azure portal](../service-health/alerts-activity-log-service-notifications-portal.md).

Depending on your requirements, you can configure various alerts to use the same [action group](../azure-monitor/alerts/action-groups.md) or different action groups. Action group types include sending a voice call, SMS, or email. You can also trigger various types of automated actions.

There's an important difference between Service Health security advisories and [Microsoft Defender for Cloud](../defender-for-cloud/defender-for-cloud-introduction.md) security notifications. Security advisories in Service Health provide notifications dealing with platform vulnerabilities and security and privacy breaches at the subscription and tenant level,   while security notifications in Microsoft Defender for Cloud communicate vulnerabilities that pertain to affected individual Azure resources.

More information about the Azure Service Health notifications can be found at: [What are Azure service health notifications? - Azure Service Health | Microsoft Learn](../service-health/service-health-notifications-properties.md)
