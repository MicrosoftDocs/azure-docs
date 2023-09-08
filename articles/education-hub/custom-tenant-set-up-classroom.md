---
title: How to create a custom Azure for Classroom Tenant and Billing Profile
description: This article shows you how to make a custom tenant and billing profile for educators in your organization 
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: how-to 
ms.date: 3/17/2023
ms.custom: template-how-to
---

# Create a custom Tenant and Billing Profile for Microsoft for Teaching Paid

This article is meant for IT Admins utilizing Azure for Classroom. When signing up for this offer, you should already have a tenant and billing profile created, but this article is meant to help walk you through how to create a custom tenant and billing profile and associate them with an educator.

## Prerequisites

- Be signed up for Azure for Classroom

## Create a new tenant

This section walks you through how to create a new tenant and associate it with your university tenant using multi-tenant

1. Go to the Azure portal and search for "Azure Active Directory"
2. Create a new tenant in the "Manage tenants" tab
3. Fill in and Finalize Tenant information
4. After the tenant has been created copy the Tenant ID of the new tenant
:::image type="content" source="media/custom-tenant-set-up-classroom/save-tenant-id.png" alt-text="Screenshot of user saving tenant id." border="true":::

## Associate new tenant with university tenant

1. Go to "Cost Management" and click on "Access control (IAM)
2. Click on "Associated billing tenants"
3. Click "Add" and add the Tenant ID of the newly created tenant
4. Check the box for Billing management
1. Click "Add" to finalize the association between the newly created tenant and university tenant

## Invite Educator to the newly created tenant

This section walks through how to add an Educator to the newly created tenant.

1. Switch tenants to the newly created tenant
2. Go to "Users" in the new tenant
3. Invite a user to this tenant
1. Change the role to "Global administrator"
:::image type="content" source="media/custom-tenant-set-up-classroom/add-user.png" alt-text="Screenshot of user inviting existing user." border="true":::
1. Tell the Educator to accept the invitation to this tenant
2. After the Educator has joined the tenant, go into the tenant properties and click Yes under the Access management for Azure resources.

Now that you've created a custom Tenant, you can go into Education Hub and begin distributing credit to Educators to use in labs.

## Next steps

> [!div class="nextstepaction"]
> [Create an assignment and allocate credit](create-assignment-allocate-credit.md)
