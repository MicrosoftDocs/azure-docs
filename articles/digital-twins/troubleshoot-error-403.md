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

#### Check current setup

To check whether you have this role, view the role assignments for the Azure Digital Twins instance in the Azure portal. From your portal page of [Azure Digital Twins instances](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.DigitalTwins%2FdigitalTwinsInstances), select the name of the instance you want to check. Then, view all of its assigned roles under *Access control (IAM) > Role assignments*. If your role assignment has been set up, you will show up in the list with a role of *Azure Digital Twins Owner (Preview)*. 

:::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/verify-role-assignment.png" alt-text="View of the role assignments for an Azure Digital Twins instance in Azure portal":::

#### Fix issues 

If you do not have this role assignment, follow the steps to assign it in the [*Set up your user's access permissions* section of *How-to: Set up an instance and authentication (Manual)*](how-to-set-up-instance.md#set-up-your-users-access-permissions).

If you do have this role assignment already, continue to the next solution.

### Solution #2

The second solution is to verify that the AAD app registration has permissions configured for the Azure Digital Twins service. If this is not configured, set them up.

#### Check current setup

To check whether the permissions have been configured correctly, follow [this link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to navigate to the AAD app registration overview page in the Azure portal. This page shows all the app registrations that have been created in your subscription.

You should recognize an app registration that was created for Azure Digital Twins. Select it to open up its details.

First, verify that the settings from your uploaded *manifest.json* were properly set on the registration. To do this, select *Manifest* from the menu bar to view the app registration's manifest code. Scroll to the bottom of the code window and look for the fields from your *manifest.json* under `requiredResourceAccess`:

:::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/verify-manifest.png" alt-text="Portal view of the manifest for the AAD app registration":::

Next, select *API permissions* from the menu bar to verify that this app registration contains Read/Write permissions for Azure Digital Twins. You should see an entry like this:

:::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/verify-api-permissions.png" alt-text="Portal view of the API permissions for the AAD app registration, showing 'Read/Write Access' for Azure Digital Twins":::

#### Fix issues

If any of this appears differently than described, follow the instructions on how to set up an app registration in the [*Set up access permissions for client applications* section of *How-to: Set up an instance and authentication (Manual)*](how-to-authenticate-client.md#set-up-access-permissions-for-client-applications).

## Next steps

Read the setup steps for creating and authenticating a new Azure Digital Twins instance:
* [*How-to: How-to: Set up an instance and authentication (Manual)*](how-to-set-up-instance-manual.md)

Read more about security and permissions on Azure Digital Twins:
* [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md)