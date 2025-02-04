---
title: Support multiple users of Cloud Shell in a private virtual network
description: This article explains changes required to support multiple users for a Cloud Shell instance deployed in a private virtual network.
ms.topic: how-to
ms.date: 02/04/2025
---
# Support multiple users of Cloud Shell in a private virtual network

The instructions and ARM templates used to deploy Cloud Shell in a private virtual network create an
environment designed to be used by a single user. A single-user deployment is the most secure
configuration because each user can only access their own file share. However, you might have a need
to allow multiple users access to a single deployment. To support access for multiple users, you
need to make the following changes:

- Increase File Share quota
- Assign roles to the users that allow access to the storage resources

## Increase File Share quota

The initial deployment of Cloud Shell in a private virtual network creates a file share with a 6-GiB
quota limit. When a new user starts their first session, Cloud Shell creates a 5-GiB image file in
the file share. The first user uses up the quota limit. When a second user starts their session,
they receive the 'ephemeral storage' error message because Cloud Shell is unable to create another
5-GiB image file. Also, notice that Cloud Shell created a 0-byte image file for the failed attempt.

To support multiple users, you need to increase the file share quota to accommodate the number of
users that share the same storage account. Increase the quota by 5-GiB per user.

Use the following steps to change the file share quota:

1. Sign in to the Azure portal.
1. Use the search bar to find your storage accounts
1. On the **Storage accounts** page, select the storage account that you're using for the Azure
   Cloud Shell environment and view the details.
1. From the left-hand menu, expand **Data storage** and select **File shares**.
1. Locate the file share that you're using for the Azure Cloud Shell environment.
1. On the file share for Cloud Shell, select the 3-dots menu.
1. Select **Edit quota** from the menu.
1. Change the **Quota** amount to the desired size.
1. Select **OK** to save the change.

> [!NOTE]
> There's a 100-TiB size limit for the file share.

## Assign roles to the users that allow access to the storage resources

To access the storage account and file share, each user needs to have the following role
assignments:

- **Reader and Data Access** or **Storage Account Contributor**
- **Storage File Data Privileged Contributor**

Apply the roles on the storage account. The file share inherits the role assignments from the
storage account.

Use the following steps to assign roles:

1. Sign in to the Azure portal.
1. Use the search bar to find your storage accounts
1. On the **Storage accounts** page, select the storage account that you're using for the Azure
   Cloud Shell environment and view the details.
1. From the left-hand menu, select **Access Control (IAM)**.
1. In the details pane, select the **Role assignments** tab.
1. In the header menu, select **+ Add** then select **Add role assignment** from the dropdown menu.
1. Use the search field to search for **Reader and Data Access** and select it from the search
   results.
1. Select **Next** on the bottom of the page to get to the **Members** tab.
1. To add users to the role:
   1. Select **+ Select members**.
   1. In the **Select members** pane, search for the user
   1. Select the user then use **Select** button at the bottom to add the user.
   1. Repeat the process for each user.
1. After adding the users, select **Next** to go to the **Review + assign** tab.
1. Repeat the process for the **Storage File Data Privileged Contributor** role.

## Summary

In this article, you learned how to increase storage quotas for a file share and how to assign roles
to users to allow access to storage resources in Azure.
