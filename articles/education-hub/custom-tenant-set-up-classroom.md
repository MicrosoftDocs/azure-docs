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

This article is for IT admins who use Azure Classroom (subject to regional availability). When you sign up for this offer, you should already have a tenant and billing profile created. But this article shows you how to create a custom tenant and billing profile and then associate them with an educator.

## Prerequisites

You must be signed up for Azure Classroom.

## Create a new tenant

1. Go to the [Azure portal](https://ms.portal.azure.com/), search for **entra**, and select the **Microsoft Entra ID** result.
1. On the **Manage tenants** tab, select **Create**.
1. Complete the tenant information.
1. On the **Tenant details** pane, copy the **Tenant ID** value for the newly created tenant. You'll use it in the next procedure.

   :::image type="content" source="media/custom-tenant-set-up-classroom/save-tenant-id.png" alt-text="Screenshot that shows tenant details and the button for copying the tenant ID." border="true":::

## Associate the new tenant with a university tenant

1. Go to **Cost Management** and select **Access control (IAM)**.
1. Select **Associated billing tenants**.
1. Select **Add** and paste the tenant ID of the newly created tenant.
1. Select the box for billing management.
1. Select **Add** to complete the association between the newly created tenant and university tenant.

## Invite an educator to the newly created tenant

1. Switch to the newly created tenant.
1. Go to **Users**, and then select **New user**.
1. On the **New user** pane, select **Invite user**, fill in the **Identity** information, and change the role to **Global Administrator**. Then select **Invite**.

   :::image type="content" source="media/custom-tenant-set-up-classroom/add-user.png" alt-text="Screenshot of selections for inviting an existing user to a tenant." border="true":::
1. Tell the educator to accept the invitation to this tenant.
1. After the educator joins the tenant, go to the tenant properties and select **Yes** under **Access management for Azure resources**.

## Next step

Now that you've created a custom tenant, you can go to the Azure Education Hub and begin distributing credit to educators to use in labs.

> [!div class="nextstepaction"]
> [Create an assignment and allocate credit](create-assignment-allocate-credit.md)
