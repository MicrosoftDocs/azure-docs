---
title: Troubleshoot Azure Migrate projects
description: Helps you to troubleshoot issues with creating and managing Azure Migrate projects.
author: SnehaSudhirG
ms.author: sudhirsneha 
ms.topic: troubleshooting
ms.date: 06/26/2024
ms.custom: engagement-fy24
---

# Troubleshoot Azure Migrate projects

This article helps you troubleshoot issues when creating and managing [Azure Migrate](migrate-services-overview.md) projects.

## How to add new project?

You can have multiple Azure Migrate projects in a subscription. Learn how to [create a project](./create-manage-projects.md) for the first time, or [add additional](create-manage-projects.md#create-additional-projects) projects.

## What Azure permissions are needed?

You need Contributor or Owner permissions in the subscription to create an Azure Migrate project.

## Can't find a project

Finding an existing Azure Migrate project depends upon whether you're using the current or old version of Azure Migrate. [Follow these steps](create-manage-projects.md#find-a-project).

## Can't find a geography

You can create an Azure Migrate project in supported geographies for [public](migrate-support-matrix.md#public-cloud) and [government clouds](migrate-support-matrix.md#azure-government).

## What are VM limits?

You can assess up to 35,000 VMware VMs or up to 35,000 Hyper-V VMs in a single project. A project can include both VMware VMs and Hyper-V VMs, up to the assessment limits.

## Can I upgrade old project?

Projects from the previous version of Azure Migrate can't be updated. You need to [create a new project](./create-manage-projects.md), and add tools to it.

## Can't create a project

If you try to create a project and encounter a deployment error:

- Try to create the project again in case it's a transient error. In **Deployments**, select **Re-deploy** to try again.
- Check you have Contributor or Owner permissions in the subscription.
- If you're deploying in a newly added geography, wait a short time and try again.
- If you receive the error, "Requests must contain user identity headers", this might indicate that you don't have access to the Microsoft Entra tenant of the organization. In this case:
  - When you're added to a Microsoft Entra tenant for the first time, you receive an email invitation to join the tenant.
  - Accept the invitation to be added to the tenant.
  - If you can't see the email, contact a user with access to the tenant, and ask them to [resend the invitation](../active-directory/external-identities/add-users-administrator.md#resend-invitations-to-guest-users) to you.
  - After receiving the invitation email, open it and select the link to accept the invitation. Then, sign out of the Azure portal and sign in again. (refreshing the browser won't work.) You can then start creating the migration project.

## How do I delete a project

[Follow these instructions](create-manage-projects.md#delete-a-project) to delete a project. When you delete a project, both the project and the metadata about discovered machines in the project are deleted.

## Added tools don't show

Make sure you have the right project selected. In the Azure Migrate hub, select **Servers, databases and web apps**. Select your project and subscription from the **Project** drop-down list. The page refreshes with the selected project and added tools.

## Next steps

Add [assessment](how-to-assess.md) or [migration](how-to-migrate.md) tools to Azure Migrate projects.
