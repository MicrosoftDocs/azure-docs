<properties
   pageTitle="Azure portal dashboard access | Microsoft Azure"
   description="This article explains how to share access to a dashboard in the Azure portal."
   services="azure-portal"
   documentationCenter=""
   authors="tfitzmac"
   manager="timlt"
   editor="tysonn"/>

<tags
   ms.service="multiple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="na"
   ms.date="07/30/2016"
   ms.author="tomfitz"/>

# Sharing Azure dashboards

After configuring a dashboard, you can publish it and share it with other users in your organization. You permit others to access your dashboard by using Azure [Role Based Access Control](../active-directory/role-based-access-control-configure.md). All published dashboards are implemented as Azure resources, which means they exist as manageable items within your subscription and are contained in a resource group.  From an access control perspective, dashboards are no different than other resources, such as a virtual machine or a storage account.

Here is an example.  Let's say you have an Azure subscription and various members of your team have been assigned the roles of **owner**, **contributor**, or **reader** of the subscription. That permission level is inherited by resources in the subscription.  Users who are owners or contributors are able to list, view, create, modify, or delete dashboards within the subscription.  Users who are readers are able to list and view dashboards, but cannot modify or delete them.  Users with reader access are able to make local edits to a published dashboard (e.g. when troubleshooting an issue), but are not able to publish those changes back to the server.  They will have the option to make a private copy of the dashboard for themselves

However, you could also assign permissions to the resource group that contains several dashboards or to an individual dashboard. For example, you may decide that a group of users should have access to a particular dashboard but you do not want to assign those permissions across the subscription. You specify a unique set of permissions for that dashboard. 

> [AZURE.TIP] Individual tiles on the dashboard enforce their own access control requirements based on the resources they display.  Therefore, you can design a dashboard that is shared broadly while still protecting the data on individual tiles.

## Assign access to a dashboard

Let's suppose you have finished configuring a dashboard that you want to share with users in your subscription. Now, you want to share it with other users in your organization.

1. Select **Share**.

     ![select share](./media/azure-portal-dashboard-share-access/select-share.png)

2. Before assigning access, you must publish the dashboard. By default, the dashboard will be published to a resource group named **dashboards**. Select **Publish**.

     ![publish](./media/azure-portal-dashboard-share-access/publish.png)

Your dashboard is now published. If you are fine with the permissions inherited from the subscription, you do not need to do anything more. Other users in your organization will be able to access and modify the dashboard based on their subscription level role. However, for this tutorial, let's assign access to a group.

1. Select **Manage users**.

     ![manage users](./media/azure-portal-dashboard-share-access/manage-users.png)

2. You will see a list of existing users that already are assigned a role for this dashboard. Most likely, this assignment is inherited from the subscription. To add a new user or group, select **Add**.

     ![add user](./media/azure-portal-dashboard-share-access/existing-users.png)

3. Select the role that represents the permissions you would like to grant.

     ![select role](./media/azure-portal-dashboard-share-access/select-role.png)

4. Select the user or group that you wish to assign to the role. If you do not see the user or group you are looking for in the list, use the search box. 

     ![select user](./media/azure-portal-dashboard-share-access/select-user.png) 

5. When you have finished adding users or groups, select **OK**. The new assignment is added to the list of users. Notice that its **Access** is listed as **Assigned** rather than **Inherited**.