---
# Mandatory fields.
title: Set up an instance and authentication
titleSuffix: Azure Digital Twins
description: See how to set up an instance of the Azure Digital Twins service, including the proper authentication.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 4/22/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up an Azure Digital Twins instance and authentication (Scripted)

[!INCLUDE [digital-twins-setup-selector.md](../../includes/digital-twins-setup-selector.md)]

This article covers the steps to **set up a new Azure Digital Twins instance**, including creating the instance and setting up authentication. After completing this article, you will have an Azure Digital Twins instance ready to start programming against.

This version of this article completes these steps by running an [**automated deployment script** sample](https://docs.microsoft.com/samples/azure-samples/digital-twins-samples/digital-twins-samples/) that streamlines the process. To view the manual steps that the script runs through behind the scenes, see the manual version of this article: [*How-to: Set up an instance and authentication (Manual)*](how-to-set-up-instance-manual.md).

>[!NOTE]
>These operations are intended to be completed by a user with an *Owner* role on the Azure subscription. Although some pieces can be completed without this elevated permission, an owner's cooperation will be required to completely set up a usable instance. View more information on this in the [*Prerequisites: Required permissions*](#prerequisites-permission-requirements) section below.

Full setup for a new Azure Digital Twins instance consists of three parts:
1. **Creating the instance**
2. **Setting up your user's access permissions**: Your Azure user needs to have the *Azure Digital Twins Owner (Preview)* role on the instance in order to perform management activities. In this step, you will either assign yourself this role (if you are an Owner in the Azure subscription), or get an Owner on your subscription to assign it to you.
3. **Setting up access permissions for client applications**: It is common to write a client application that you use to interact with your instance. In order for that client app to access your Azure Digital Twins, you need to set up an *app registration* in [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) that the client application will use to authenticate to the instance.

To proceed, you will need an Azure subscription. You can set one up for free [here](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites: Permission requirements

To be able to complete all the steps in this article, you need to be classified as an Owner in your Azure subscription. 

You can check your permission level by running this command in Cloud Shell:

```azurecli-interactive
az role assignment list --assignee <your-Azure-email>
```

If you are an owner, the `roleDefinitionName` value in the output is *Owner*:

:::image type="content" source="media/how-to-set-up-instance/owner-role.png" alt-text="Cloud Shell window showing output of the az role assignment list command":::

If you find that the value is *Contributor* or something other than *Owner*, you can contact your subscription Owner and proceed in one of the following ways:
* Request for the Owner to complete the steps in this article on your behalf
* Request for the Owner to elevate you to Owner on the subscription as well, so that you will have the permissions to proceed yourself. Whether this is appropriate depends on your organization and your role within it.

## Run the deployment script

This article uses an Azure Digital Twins code sample to deploy an Azure Digital Twins instance and the required authentication semi-automatically. It can also be used as a starting point for writing your own scripted interactions.

The sample script is written in PowerShell. It is part of the [Azure Digital Twins samples](https://docs.microsoft.com/samples/azure-samples/digital-twins-samples/digital-twins-samples/), which you can download to your machine by navigating to that sample link and selecting the *Download ZIP* button underneath the title.

In the downloaded sample folder, the deployment script is located at _Azure_Digital_Twins_samples.zip > scripts > **deploy.ps1**_.

Here are the steps to run the deployment script in Cloud Shell.
1. Go to an [Azure Cloud Shell](https://shell.azure.com/) window in your browser. Sign in using this command:
    ```azurecli-interactive
    az login
    ```
    If the CLI can open your default browser, it will do so and load an Azure sign-in page. Otherwise, open a browser page at *https://aka.ms/devicelogin* and enter the authorization code displayed in your terminal.
 
2. After signing in, look to the Cloud Shell window icon bar. Select the "Upload/Download files" icon and choose "Upload".

    :::image type="content" source="media/how-to-set-up-instance/cloud-shell-upload.png" alt-text="Cloud Shell window showing selection of the Upload option":::

    Navigate to the _**deploy.ps1**_ file on your machine and hit "Open." This will upload the file to Cloud Shell so that you can run it in the Cloud Shell window.

3. Run the script by sending the `./deploy.ps1` command in the Cloud Shell window. As the script runs through the automated setup steps, you will be asked to pass in the following values:
    * For the instance: the *subscription ID* of your Azure subscription to use
    * For the instance: a *location* where you'd like to deploy the instance
    * For the instance: a *resource group* name (you can use an existing resource group, or enter a new name of one to create)
    * For the instance: a *name* for your Azure Digital Twins instance
    * For the app registration: an *AAD application display name* to associate with the registration
    * For the app registration: an *AAD application reply URL* for the AAD application. You can use `http://localhost`.

The script will create an Azure Digital Twins instance, assign your Azure user the *Azure Digital Twins Owner (Preview)* role on the instance, and set up an AAD app registration for your client app to use.

Here is an excerpt of the output log from the script:

:::image type="content" source="media/how-to-set-up-instance/deployment-script-output.png" alt-text="Cloud Shell window showing log of input and output through the run of the deploy script" lightbox="media/how-to-set-up-instance/deployment-script-output.png":::

If the script completes successfully, the final printout will say `Deployment completed successfully`. Otherwise, address the error message, and re-run the script. It will bypass the steps that you've already completed and start requesting input again at the point where you left off.

Upon script completion, you now have an Azure Digital Twins instance ready to go and permissions set up to manage it.

## Collect important values

There are two important values from the app registration that will be needed later to [authenticate a client app against the Azure Digital Twins APIs](how-to-authenticate-client.md). 

To find them, follow [this link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to navigate to the AAD app registration overview page in the Azure portal. This page shows all the app registrations that have been created in your subscription.

You should see the the app registration you just created in this list. Select it to open up its details:

:::image type="content" source="media/how-to-set-up-instance/app-important-values.png" alt-text="Portal view of the important values for the app registration":::

Take note of the *Application (client) ID* and *Directory (tenant) ID* shown on **your** page. If you are not the person who will be writing code for client applications, you'll need to share these values with the person who will be.

## Verify success

If you would like to verify the creation of your resources and permissions set up by the script, you can look at them in the [Azure portal](https://portal.azure.com).

### Verify instance

To verify that your instance was created, go to the [Azure Digital Twins page](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.DigitalTwins%2FdigitalTwinsInstances) in the Azure portal. This page lists all your Azure Digital Twins instances. Look for the name of your newly-created instance in the list.

### Verify user role assignment

One way to check that the role assignment was successful is to view the role assignments for the Azure Digital Twins instance in the Azure portal. From your portal page of [Azure Digital Twins instances](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.DigitalTwins%2FdigitalTwinsInstances), select the name of the instance you want to check. Then, view all of its assigned roles under *Access control (IAM) > Role assignments*. The user should show up in the list with a role of *Azure Digital Twins Owner (Preview)*. 

:::image type="content" source="media/how-to-set-up-instance/verify-role-assignment.png" alt-text="View of the role assignments for an Azure Digital Twins instance in Azure portal":::

### Verify app registration

To verify the app registration, follow [this link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to navigate to the AAD app registration overview page in the Azure portal. This page shows all the app registrations that have been created in your subscription.

You should see the the app registration you just created in the overview list. Select it to open up its details.

First, verify that the settings from your uploaded *manifest.json* were properly set on the registration. To do this, select *Manifest* from the menu bar to view the app registration's manifest code. Scroll to the bottom of the code window and look for the fields from your *manifest.json* under `requiredResourceAccess`:

:::image type="content" source="media/how-to-set-up-instance/verify-manifest.png" alt-text="Portal view of the manifest for the AAD app registration":::

Next, select *API permissions* from the menu bar to verify that this app registration contains Read/Write permissions for Azure Digital Twins. You should see an entry like this:

:::image type="content" source="media/how-to-set-up-instance/verify-api-permissions.png" alt-text="Portal view of the API permissions for the AAD app registration, showing 'Read/Write Access' for Azure Digital Twins":::

## Possible additional requirements

It is possible that your organization requires additional actions from subscription Owners in order to successfully set up an app registration. The steps required may vary depending on your organization's specific settings.

Here are some common potential activities that an Owner may need to perform. These and other operations can be performed from the [AAD App registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) page in the Azure portal.
* Grant admin consent for the app registration. Your organization may have *Admin Consent Required* globally turned on in AAD for all app registrations within your subscription. If this is the case, the Owner may need to select this button for your company on the app registration's *API permissions* page in the Azure portal:

    :::image type="content" source="media/how-to-set-up-instance/grant-admin-consent.png" alt-text="Portal view of the 'Grant admin consent' button under API permissions":::
  - If this is successful, the entry for Azure Digital Twins should show a *Status* of _Granted for **your company**_
   
        :::image type="content" source="media/how-to-set-up-instance/granted-admin-consent.png" alt-text="Portal view of the admin consent granted for the company under API permissions":::
* Grant *Owner* role in the app registration to any users who will be calling the API. You can do this on the *Owners* page in the Azure portal:

    :::image type="content" source="media/how-to-set-up-instance/add-owners.png" alt-text="Portal view of the 'Add owners' button under Owners":::
* Activate public client access
* Set specific reply URLs for web and desktop access
* Allow for implicit OAuth2 authentication flows
* If users will be using personal [**Microsoft accounts (MSAs)**](https://account.microsoft.com/account/Account), such as *@outlook.com* accounts, for this Azure subscription, you may need to set the *signInAudience* on the app registration to support personal accounts.

For more information about app registration and its different options, see [Register an application with the Microsoft identity platform](https://docs.microsoft.com/graph/auth-register-app-v2).

You now have an Azure Digital Twins instance ready to go, have assigned permissions to manage it, and have set up permissions for a client app to access it.

## Next steps

See how to connect your client application to your instance by writing the client app's authentication code:
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)
