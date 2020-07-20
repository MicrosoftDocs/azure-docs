---
title: "Azure Digital Twins request failed with Status: 403 (Forbidden)"
description: "Causes and resolutions for 'Service request failed. Status: 403 (Forbidden)' on Azure Digital Twins."
author: baanders
ms.author: baanders
ms.topic: troubleshooting
ms.date: 7/20/2020
---

# Service request failed. Status: 403 (Forbidden)

This article describes causes and resolution steps for receiving a 403 error from service requests to Azure Digital Twins. 

## Symptoms

This error may occur on many types of service requests that require authentication. The effect is that the API returns the 403 error, and your request fails.

## Causes

### Cause #1

Most often, this error indicates that your RBAC permissions for the service are not set up correctly. Many actions for an Azure Digital Twins instance require you to have the *Azure Digital Twins Owner (Preview)* role on the instance you are trying to manage. 

### Cause #2

If you are using a client app to communicate with Azure Digital Twins, this error may happen because your [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) app registration does not have permissions set up for the Azure Digital Twins service.

In the app registration, you need to configure access permissions to the Azure Digital Twins APIs. Then, when your client app authenticates against the app registration, it will be granted the permissions that the app registration has configured.

## Solution

### Solution #1

The first solution is to verify that your Azure user has the *Azure Digital Twins Owner (Preview)* role on the instance you are trying to manage. If you do not have this role, set it up.

For instructions on how to assign yourself this role, follow the [*Assign yourself a role* section of *How-to: Create an Azure Digital Twins instance*](how-to-set-up-instance.md#assign-yourself-a-role).

### Solution #2

The second solution is to verify that the AAD app registration has permissions configured for the Azure Digital Twins service. If these are not configured, set them up.

For instructions on how to set this up, follow the [*Create an app registration* section of *How-to: Authenticate a client application*](how-to-authenticate-client.md#create-an-app-registration).

## Next steps

Read the setup steps for creating and authenticating a new Azure Digital Twins instance:
* [*How-to: Create an Azure Digital Twins instance*](how-to-set-up-instance.md)
* [*How-to: Authenticate a client application*](how-to-authenticate-client.md)

Read more about security and permissions on Azure Digital Twins:
* [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md)