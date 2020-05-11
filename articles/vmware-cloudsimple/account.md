--- 
title: Account management - Azure VMware Solution by CloudSimple portal 
description: Describes how to manage accounts on the Azure VMware Solution by CloudSimple portal 
author: sharaths-cs
ms.author: b-shsury 
ms.date: 08/14/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Manage accounts on the Azure VMware Solution by CloudSimple portal

When you create your CloudSimple service, it creates an account on CloudSimple. The account is associated with your Azure subscription where the service is located. All users with owner and contributor roles in the subscription have access to the CloudSimple portal. The Azure subscription ID and tenant ID associated with the CloudSimple service are found on the Accounts page.

To manage accounts in the CloudSimple portal, [access the portal](access-cloudsimple-portal.md) and select **Account** on the side menu.

Select **Summary** to view information about your company’s CloudSimple configuration. The current capacity of your cloud configuration is shown, including number of Private Clouds, total storage, vSphere cluster configuration, number of nodes, and number of compute cores. A link is included to purchase additional nodes if the current configuration doesn't meet all of your needs.

## Email alerts

You can add email addresses of any people you would like to notify about changes to the Private Cloud configuration.

1. In the **Additional email alerts** area, click **Add new**.
2. Enter the email address.
3. Press Return.  

To remove an entry, click **X**.

## CloudSimple operator access

The operator access setting allows CloudSimple to help you with troubleshooting by permitting a support engineer to sign in to your CloudSimple portal.  The setting is enabled by default. All actions performed by the support engineer when logged in to your customer account are recorded and available for your review on the **Activity** > **Audit** page.

Click the **CloudSimple operator access enabled** toggle to turn access on or off.
