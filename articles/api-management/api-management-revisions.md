---
title: Revisions in Azure API Management | Microsoft Docs
description: Learn about the concept of revisions in Azure API Management.
services: api-management
documentationcenter: ''
author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 02/22/2022
ms.author: danlep
ms.custom: fasttrack-new
---
# Revisions in Azure API Management

Revisions allow you to make changes to your APIs in a controlled and safe way. When you want to make changes, create a new revision. You can then edit and test API without disturbing your API consumers. When you're ready, you then make your revision current. At the same time, you can optionally post an entry to the change log, to keep your API consumers up to date with what has changed. The change log is published to your developer portal.

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

`https://apis.contoso.com/customers;rev=3/leads?customerId=123`

By default, each revision has the same security settings as the current revision. You can deliberately change the policies for a specific revision if you want to have different security applied for each revision. For example, you might want to add a [IP filtering policy](ip-filter-policy.md) to prevent external callers from accessing a revision that is still under development.

> [!NOTE]
> The `;rev={id}` must be appended to the API ID, and not the URI path.

## Current revision

A single revision can be set as the *current* revision. This revision will be the one used for all API requests that don't specify an explicit revision number in the URL. You can roll back to a previous revision by setting that revision as current.

You can set a revision as current using the Azure portal. If you use PowerShell, you can use the `New-AzApiManagementApiRelease` cmdlet.

## Revision descriptions

When you create a revision, you can set a description for your own tracking purposes. Descriptions aren't displayed to your API users.

When you set a revision as current you can also optionally specify a public change log note. The change log is included in the developer portal for your API users to view. You can modify your change log note using the `Update-AzApiManagementApiRelease` PowerShell cmdlet.

> [!CAUTION]
> If you are editing a non-current revision of an API, you cannot change the following properties:
>
> * Name
> * Type
> * Description
> * Subscription required
> * API version
> * API version description
> * Path
> * Protocols
>
> These properties can only be changed in the current revision.  If your edits change any of the above 
> properties of a non-current revision, the error message `Can't change property for non-current revision` will be displayed.

## Take a revision offline

A revision can be taken offline, which makes it inaccessible to callers even if they try to access the revision through its URL. You can mark a revision as offline using the Azure portal.

> [!NOTE]
> We suggest taking revisions offline when you aren't using them for testing.

## Versions and revisions

Versions and revisions are distinct features. Each version can have multiple revisions, just like a non-versioned API. You can use revisions without using versions, or the other way around. Typically versions are used to separate API versions with breaking changes, while revisions can be used for minor and non-breaking changes to an API.

Should you find that your revision has breaking changes, or if you wish to formally turn your revision into a beta/test version, you can create a version from a revision. Using the Azure portal, click the 'Create Version from Revision' on the revision context menu on the Revisions tab.
