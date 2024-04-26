---
title: Create a custom Azure Classroom tenant and billing profile
description: This article shows you how to make a custom tenant and billing profile for educators in your organization.
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: how-to 
ms.date: 2/22/2024
ms.custom: template-how-to
---

# Create a custom tenant and billing profile for Azure Classroom

This article is meant for IT admins who use Azure Classroom (subject to regional availability). When you sign up for this offer, you should already have a tenant and billing profile created. But this article helps walk you through how to create a custom tenant and billing profile and associate them with an educator.

## Prerequisites

- Be signed up for Azure Classroom.

## Create a new tenant

1. Go to the Azure portal and search for **Microsoft Entra ID**.
1. Create a new tenant in the **Manage tenants** tab.
1. Fill in and finalize tenant information.
1. Copy the tenant ID of the newly created tenant.

:::image type="content" source="media/custom-tenant-set-up-classroom/save-tenant-id.png" alt-text="Screenshot of user saving tenant ID." border="true":::

## Associate new tenant with university tenant

1. Go to **Cost Management** and select **Access control (IAM)**.
1. Select **Associated billing tenants**.
1. Select **Add** and add the tenant ID of the newly created tenant.
1. Select the box for billing management.
1. Select **Add** to finalize the association between the newly created tenant and university tenant.

## Invite an educator to the newly created tenant

1. Switch tenants to the newly created tenant.
1. Go to **Users** in the new tenant.
1. Invite a user to this tenant.
1. Change the role to **Global administrator**.

   :::image type="content" source="media/custom-tenant-set-up-classroom/add-user.png" alt-text="Screenshot of user inviting existing user." border="true":::
1. Tell the educator to accept the invitation to this tenant.
1. After the educator has joined the tenant, go into the tenant properties and select **Yes** under **Access management for Azure resources**.

Now that you've created a custom tenant, you can go into the Education Hub and begin distributing credit to educators to use in labs.

## Next steps

> [!div class="nextstepaction"]
> [Create an assignment and allocate credit](create-assignment-allocate-credit.md)
