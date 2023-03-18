---
title: How to create a custom Azure for Classroom Tenant and Billing Profile
description: This article will show you how to make a custom tenant and billing profile for educators in your organization 
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

This section will walk you through how to create a new tenant and associate it with your university tenant using multi-tenant

1. Go to the Azure Portal and search for "Azure Active Directory"
:::image type="content" source="Media/custom-tenant-setup/Navigate-to-AAD.png" alt-text="Navigate to AAD" border="true":::
1. Create a new tenant in the "Manage tenants" tab
:::image type="content" source="Media/custom-tenant-setup/Navigate-to-Manage-Tenants.png" alt-text="Navigate to manage tenants" border="true":::
1. Fill in and Finalize Tenant information
:::image type="content" source="Media/custom-tenant-setup/Create-Tenant.png" alt-text="Create tenant" border="true":::
1. After tenant has been created copy the Tenant ID of the new tenant
:::image type="content" source="Media/custom-tenant-setup/Save-Tenant-ID.png" alt-text="Save tenant id" border="true":::

## Associate new tenant with university tenant

1. Go to "Cost Management" and click on "Access control (IAM)
:::image type="content" source="Media/custom-tenant-setup/Navigate-to-CCM.png" alt-text="Navigate to CCM" border="true":::
2. Click on "Associated billing tenants"
:::image type="content" source="Media/custom-tenant-setup/Associated-Tenants.png" alt-text="Find associated tenants" border="true":::
3. Click "Add" and add the Tenant ID of the newly created tenant
:::image type="content" source="Media/custom-tenant-setup/Add-New-Tenant.png" alt-text="Add new tenant" border="true":::
4. Check the box for Billing management
:::image type="content" source="Media/custom-tenant-setup/Select-Billing-Management.png" alt-text="Select Billing management" border="true":::
5. Click "Add" to finalize the association between the newly created tenant and university tenant

## Invite Educator to the newly created tenant

This section will walk you through how to add an Educator to the newly created tenant. This is necessary in order to be able to provision credits to the Educator.

1. Switch tenants to the newly created tenant
:::image type="content" source="Media/custom-tenant-setup/Switch-to-New-Tenant.png" alt-text="Switch to new tenant" border="true":::
2. Go to "Users" in the new tenant
:::image type="content" source="Media/custom-tenant-setup/Navigate-to-Users.png" alt-text="Navigate to users" border="true":::
3. Invite a user to this tenant
:::image type="content" source="Media/custom-tenant-setup/Invite-Existing-User.png" alt-text="Invite existing user" border="true":::
4. Change the role to "Global administrator"
:::image type="content" source="Media/custom-tenant-setup/Change-Role.png" alt-text="Change role" border="true":::
5. Tell the Educator to accept the invitation to this tenant
6. After the Educator has joined the tenant, go into the tenant properties and click Yes under the Access management for Azure resources.
:::image type="content" source="Media/custom-tenant-setup/Access-Management.png" alt-text="Access management" border="true":::

Now that you have created a custom Tenant and Billing Profile, you can go into Education Hub and begin distributing credit to Educators to use in labs.

## Next steps

- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)
