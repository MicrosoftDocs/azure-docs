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

If you are using a client app to communicate with Azure Digital Twins that is authenticating with an [app registration](how-to-create-app-registration.md), this error may happen because your app registration does not have permissions set up for the Azure Digital Twins service.

The app registration must have access permissions configured for the Azure Digital Twins APIs. Then, when your client app authenticates against the app registration, it will be granted the permissions that the app registration has configured.

## Solutions

### Solution #1

The first solution is to verify that your Azure user has the _**Azure Digital Twins Owner (Preview)**_ role on the instance you are trying to manage. If you do not have this role, set it up.

Note that this role is different from...
* the *Owner* role on the entire Azure subscription. *Azure Digital Twins Owner (Preview)* is a role within Azure Digital Twins and is scoped to this individual Azure Digital Twins instance.
* the *Owner* role in Azure Digital Twins. These are two distinct Azure Digital Twins management roles, and *Azure Digital Twins Owner (Preview)* is the role that should be used for management during preview.

#### Check current setup

[!INCLUDE [digital-twins-setup-verify-role-assignment.md](../../includes/digital-twins-setup-verify-role-assignment.md)]

#### Fix issues 

If you do not have this role assignment, someone with an Owner role in your **Azure subscription** should run the following command to give your Azure user the *Azure Digital Twins Owner (Preview)* role on the **Azure Digital Twins instance**. 

If you are an Owner on the subscription, you can run this command yourself. If you are not, contact an Owner to run this command on your behalf.

```azurecli
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<your-Azure-AD-email>" --role "Azure Digital Twins Owner (Preview)"
```

For more details about this role requirement and the assignment process, see the [*Set up your user's access permissions* section](how-to-set-up-instance-CLI.md#set-up-user-access-permissions) of *How-to: Set up an instance and authentication (CLI or portal)*.

If you have this role assignment already and still encounter the 403 issue, continue to the next solution.

### Solution #2

If you're using an Azure AD app registration to authenticate a client app, the second possible solution is to verify that the app registration has permissions configured for the Azure Digital Twins service. If these are not configured, set them up.

#### Check current setup

To check whether the permissions have been configured correctly, navigate to the [Azure AD app registration overview page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) in the Azure portal. You can get to this page yourself by searching for *App registrations* in the portal search bar.

Switch to the *All applications* tab to see all the app registrations that have been created in your subscription.

You should see the app registration you just created in the list. Select it to open up its details.

:::image type="content" source="media/troubleshoot-error-403/app-registrations.png" alt-text="App registrations page in the Azure portal":::

First, verify that the Azure Digital Twins permissions settings were properly set on the registration. To do this, select *Manifest* from the menu bar to view the app registration's manifest code. Scroll to the bottom of the code window and look for these fields under `requiredResourceAccess`. The values should match those in the screenshot below:

:::image type="content" source="media/troubleshoot-error-403/verify-manifest.png" alt-text="Portal view of the manifest for the Azure AD app registration":::

Next, select *API permissions* from the menu bar to verify that this app registration contains Read/Write permissions for Azure Digital Twins. You should see an entry like this:

:::image type="content" source="media/troubleshoot-error-403/verify-api-permissions.png" alt-text="Portal view of the API permissions for the Azure AD app registration, showing 'Read/Write Access' for Azure Digital Twins":::

#### Fix issues

If any of this appears differently than described, follow the instructions on how to set up an app registration in [*How-to: Create an app registration*](how-to-create-app-registration.md).

## Next steps

Read the setup steps for creating and authenticating a new Azure Digital Twins instance:
* [*How-to: Set up an instance and authentication (CLI)*](how-to-set-up-instance-cli.md)

Read more about security and permissions on Azure Digital Twins:
* [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md)