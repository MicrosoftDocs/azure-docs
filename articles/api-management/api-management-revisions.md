---
title: Revisions in Azure API Management | Microsoft Docs
description: Learn about the concept of revisions in Azure API Management.
services: api-management
documentationcenter: ''
author: johndowns
 
ms.service: api-management
ms.topic: article
ms.date: 06/12/2020
ms.author: jodowns
ms.custom: fasttrack-new
---
# Revisions in Azure API Management

Revisions allow you to make changes to your APIs in a controlled and safe way. When you want to make changes, create a new revision. You can then edit and test API without disturbing your API consumers. When you are ready, you can then make your revision current. At the same time, you can post an entry to the change log, to keep your API consumers up to date with what has changed. The change log is published to your developer portal.

> [!NOTE]
> The developer portal is not available in the Consumption tier.

With revisions you can:

- Safely make changes to your API definitions and policies, without disturbing your production API.
- Try out changes before publishing them.
- Document the changes you make, so your developers can understand what is new.
- Roll back if you find issues.

[Get started with revisions by following our walkthrough.](./api-management-get-started-revise-api.md)

## Accessing specific revisions

Each revision to your API can be accessed using a specially formed URL. Append `;rev={revisionNumber}` at the end of your API URL, but before the query string, to access a specific revision of that API. For example, you might use this URL to access revision 3 of the `customers` API:

`https://apis.contoso.com/customers;rev=3?customerId=123`

While a revision's private URL requires the caller knows the revision number to create a valid API URL, the private address of the revision otherwise has the same security context as the current revision. You can deliberately change the policies for a specific revision if you want to have different security applied for each revision.

A revision can also be taken offline, which makes it inaccessible to callers even if they try to access the revision through its URL. This can be done using the Azure Portal. Alternatively, if you use PowerShell, you can use the `Set-AzApiManagementApiRevision` cmdlet and set the `Path` argument to `$null`.

> [!NOTE]
> We suggest taking revisions offline when you are not using them for testing.

## Current revision

A single revision can be set as the *current* revision. This revision will be the one used for all API requests that do not specify an explicit revision number. 

You can set a revision as current using the Azure Portal. Alternatively, if you use PowerShell, you can use the `New-AzApiManagementApiRelease` cmdlet.

## Revision descriptions

When you create a revision, you can set a description. This can be used for your own internal tracking purposes. Descriptions are not displayed to API users.

When you set a revision as current you can also optionally specify a public change log note. This will be included in the developer portal for your API users to view. You can modify your change log note using the `Update-AzApiManagementApiRelease` PowerShell cmdlet.

## Versioning and revisions

Versions and revisions are distinct features. Each version can have multiple revisions, just like a non-versioned API. Alternatively you can use revisions without using versions, or vice versa.

Should you find that your revision has breaking changes, or if you wish to formally turn your revision into a beta/test version, you can create a version from a revision. Using the Azure Portal, click the 'Create Version from Revision' on the revision context menu on the Revisions tab.
