---
title: "Azure Digital Twins request failed with Status: 403 (Forbidden)"
description: "Causes and resolutions for 'Service request failed. Status: 403 (Forbidden)' on Azure Digital Twins."
ms.service: digital-twins
author: baanders
ms.author: baanders
ms.topic: troubleshooting
ms.date: 7/20/2020
---

# Service request failed. Status: 403 (Forbidden)

This article describes causes and resolution steps for receiving a 403 error from service requests to Azure Digital Twins. 

## Symptoms

This error may occur on many types of service requests that require authentication. The effect is that the API request fails, returning an error status of `403 (Forbidden)`.

## Causes

### Cause #1

Most often, this error indicates that your role-based access control (RBAC) permissions for the service are not set up correctly. Many actions for an Azure Digital Twins instance require you to have the *Azure Digital Twins Owner (Preview)* role **on the instance you are trying to manage**. 

### Cause #2

If you are using a client app to communicate with Azure Digital Twins, this error may happen because your [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) app registration does not have permissions set up for the Azure Digital Twins service.

The app registration is required to have access permissions configured for the Azure Digital Twins APIs. Then, when your client app authenticates against the app registration, it will be granted the permissions that the app registration has configured.

## Solutions

### Solution #1

The first solution is to verify that your Azure user has the *Azure Digital Twins Owner (Preview)* role on the instance you are trying to manage. If you do not have this role, set it up.

#### Check current setup

To check whether you have this role, view the role assignments for the Azure Digital Twins instance in the Azure portal. From your portal page of [Azure Digital Twins instances](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.DigitalTwins%2FdigitalTwinsInstances), select the name of the instance you want to check. Then, view all of its assigned roles under *Access control (IAM) > Role assignments*. If your role assignment has been set up, you will show up in the list with a role of *Azure Digital Twins Owner (Preview)*. 

:::image type="content" source="media/how-to-set-up-instance/verify-role-assignment.png" alt-text="View of the role assignments for an Azure Digital Twins instance in Azure portal":::

#### Fix issues 

If you do not have this role assignment, someone with an Owner role in your **Azure subscription** should run the following command to give your Azure user the *Azure Digital Twins Owner (Preview)* role on the **Azure Digital Twins instance**. If you are an Owner on the subscription, you can run this command yourself. If you are not, contact an Owner to run this command on your behalf.

```azurecli-interactive
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<your-AAD-email>" --role "Azure Digital Twins Owner (Preview)"
```

For more details about this role requirement and the assignment process, see the [*Assign yourself a role* section of *How-to: Create an Azure Digital Twins instance*](how-to-set-up-instance.md#assign-yourself-a-role).

If you have this role assignment already and still encounter the 403 issue, continue to the next solution.

### Solution #2

The second solution is to verify that the AAD app registration has permissions configured for the Azure Digital Twins service. If this is not configured, set them up.

#### Check current setup

To check whether the permissions have been configured correctly, follow [this link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to navigate to the AAD app registration overview page in the Azure portal. This page shows all the app registrations that have been created in your subscription.

You should recognize an app registration that was created for Azure Digital Twins. Select it to open up its details.

First, verify that the settings from your uploaded *manifest.json* were properly set on the registration. To do this, select *Manifest* from the menu bar to view the app registration's manifest code. Scroll to the bottom of the code window and look for the fields from your *manifest.json* under `requiredResourceAccess`:

:::image type="content" source="media/how-to-set-up-instance/verify-manifest.png" alt-text="Portal view of the manifest for the AAD app registration":::

Next, select *API permissions* from the menu bar to verify that this app registration contains Read/Write permissions for Azure Digital Twins. You should see an entry like this:

:::image type="content" source="media/how-to-set-up-instance/verify-api-permissions.png" alt-text="Portal view of the API permissions for the AAD app registration, showing 'Read/Write Access' for Azure Digital Twins":::

#### Fix issues

If any of this appears differently than described, follow the instructions on how to set up an app registration in the [*Create an app registration* section of *How-to: Authenticate a client application*](how-to-authenticate-client.md#create-an-app-registration).

## Next steps

Read the setup steps for creating and authenticating a new Azure Digital Twins instance:
* [*How-to: Create an Azure Digital Twins instance*](how-to-set-up-instance.md)
* [*How-to: Authenticate a client application*](how-to-authenticate-client.md)

Read more about security and permissions on Azure Digital Twins:
* [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md)