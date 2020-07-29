---
# Mandatory fields.
title: Set up an instance and authentication (scripted)
titleSuffix: Azure Digital Twins
description: See how to set up an instance of the Azure Digital Twins service, including the proper authentication. Scripted version.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/22/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up an Azure Digital Twins instance and authentication (scripted)

[!INCLUDE [digital-twins-setup-selector.md](../../includes/digital-twins-setup-selector.md)]

This article covers the steps to **set up a new Azure Digital Twins instance**, including creating the instance and setting up authentication. After completing this article, you will have an Azure Digital Twins instance ready to start programming against.

This version of this article completes these steps by running an [**automated deployment script** sample](https://docs.microsoft.com/samples/azure-samples/digital-twins-samples/digital-twins-samples/) that streamlines the process. To view the manual steps that the script runs through behind the scenes, see the manual version of this article: [*How-to: Set up an instance and authentication (manual)*](how-to-set-up-instance-manual.md).

[!INCLUDE [digital-twins-setup-starter.md](../../includes/digital-twins-setup-starter.md)]

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
    * For the instance: a *location* where you'd like to deploy the instance. To see what regions support Azure Digital Twins, visit [*Azure products available by region*](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).
    * For the instance: a *resource group* name. You can use an existing resource group, or enter a new name of one to create.
    * For the instance: a *name* for your Azure Digital Twins instance. The name of the new instance must be unique within the region for your subscription (meaning that if your subscription has another Azure Digital Twins instance in the region that's already using the name you choose, you'll be asked to pick a different name).
    * For the app registration: an *Azure AD application display name* to associate with the registration. This app registration is where you configure access permissions to the [Azure Digital Twins APIs](how-to-use-apis-sdks.md). Later, the client app will authenticate against the app registration, and as a result be granted the configured access permissions to the APIs.
    * For the app registration: an *Azure AD application reply URL* for the Azure AD application. You can use `http://localhost`.

The script will create an Azure Digital Twins instance, assign your Azure user the *Azure Digital Twins Owner (Preview)* role on the instance, and set up an Azure AD app registration for your client app to use.

Here is an excerpt of the output log from the script:

:::image type="content" source="media/how-to-set-up-instance/deployment-script-output.png" alt-text="Cloud Shell window showing log of input and output through the run of the deploy script" lightbox="media/how-to-set-up-instance/deployment-script-output.png":::

If the script completes successfully, the final printout will say `Deployment completed successfully`. Otherwise, address the error message, and re-run the script. It will bypass the steps that you've already completed and start requesting input again at the point where you left off.

Upon script completion, you now have an Azure Digital Twins instance ready to go and permissions set up to manage it.

## Collect important values

There are two important values from the app registration that will be needed later to [authenticate a client app against the Azure Digital Twins APIs](how-to-authenticate-client.md). 

To find them, follow [this link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to navigate to the Azure AD app registration overview page in the Azure portal. This page shows all the app registrations that have been created in your subscription.

You should see the the app registration you just created in this list. Select it to open up its details:

:::image type="content" source="media/how-to-set-up-instance/app-important-values.png" alt-text="Portal view of the important values for the app registration":::

Take note of the *Application (client) ID* and *Directory (tenant) ID* shown on **your** page. If you are not the person who will be writing code for client applications, you'll need to share these values with the person who will be.

## Verify success

If you would like to verify the creation of your resources and permissions set up by the script, you can look at them in the [Azure portal](https://portal.azure.com).

### Verify instance

To verify that your instance was created, go to the [Azure Digital Twins page](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.DigitalTwins%2FdigitalTwinsInstances) in the Azure portal. This page lists all your Azure Digital Twins instances. Look for the name of your newly-created instance in the list.

### Verify user role assignment

[!INCLUDE [digital-twins-setup-verify-role-assignment.md](../../includes/digital-twins-setup-verify-role-assignment.md)]

### Verify app registration

[!INCLUDE [digital-twins-setup-verify-app-registration-1.md](../../includes/digital-twins-setup-verify-app-registration-1.md)]

First, verify that the Azure Digital Twins permissions settings were properly set on the registration. To do this, select *Manifest* from the menu bar to view the app registration's manifest code. Scroll to the bottom of the code window and look for these fields under `requiredResourceAccess`. The values should match those in the screenshot below:

[!INCLUDE [digital-twins-setup-verify-app-registration-2.md](../../includes/digital-twins-setup-verify-app-registration-2.md)]

## Other possible steps for your organization

[!INCLUDE [digital-twins-setup-additional-requirements.md](../../includes/digital-twins-setup-additional-requirements.md)]

## Next steps

See how to connect your client application to your instance by writing the client app's authentication code:
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)
