---
# Mandatory fields.
title: Set up an instance and authentication (portal)
titleSuffix: Azure Digital Twins
description: See how to set up an instance of the Azure Digital Twins service using the Azure portal
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/23/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up an Azure Digital Twins instance and authentication (portal)

[!INCLUDE [digital-twins-setup-selector.md](../../includes/digital-twins-setup-selector.md)]

This article covers the steps to **set up a new Azure Digital Twins instance**, including creating the instance and setting up authentication. After completing this article, you will have an Azure Digital Twins instance ready to start programming against.

This version of this article goes through these steps manually, one by one, using the Azure portal. The Azure portal is a web-based, unified console that provides an alternative to command-line tools.
* To go through these steps manually using the CLI, see the CLI version of this article: [*How-to: Set up an instance and authentication (CLI)*](how-to-set-up-instance-cli.md).
* To run through an automated setup using a deployment script sample, see the scripted version of this article: [*How-to: Set up an instance and authentication (scripted)*](how-to-set-up-instance-scripted.md).

[!INCLUDE [digital-twins-setup-steps-prereq.md](../../includes/digital-twins-setup-steps-prereq.md)]

## Create the Azure Digital Twins instance

In this section, you will **create a new instance of Azure Digital Twins** using the [Azure portal](https://ms.portal.azure.com/). Navigate to the portal and log in with your credentials.

Once in the portal, start by selecting _Create a resource_ in the Azure services home page menu.

:::image type="content" source= "media/how-to-set-up-instance/portal/create-resource.png" alt-text="Selecting 'Create a resource' from the home page of the Azure portal":::

Search for *Azure Digital Twins* in the search box, and choose the **Azure Digital Twins (Preview)** service from the results. Select the _Create_ button to create a new instance of the service.

:::image type="content" source= "media/how-to-set-up-instance/portal/create-azure-digital-twins.png" alt-text="Selecting 'Create' from the Azure Digital Twins service page":::

On the following *Create Resource* page, fill in the values given below:
* **Subscription**: The Azure subscription you're using
  - **Resource group**: A resource group in which to deploy the instance. If you don't already have an existing resource group in mind, you can create one here by selecting the *Create new* link and entering a name for a new resource group
* **Location**: An Azure Digital Twins-enabled region for the deployment. For more details on regional support, visit [*Azure products available by region (Azure Digital Twins)*](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).
* **Resource name**: A name for your Azure Digital Twins instance. The name of the new instance must be unique within the region for your subscription (meaning that if your subscription has another Azure Digital Twins instance in the region that's already using the name you choose, you'll be asked to pick a different name).

:::image type="content" source= "media/how-to-set-up-instance/portal/create-azure-digital-twins-2.png" alt-text="Filling in the described values to create an Azure Digital Twins resource":::

When finished, select _Review + create_. This will take you to a summary page, where you can review the instance details you entered and hit _Create_. 

### Verify success and collect important values

After pushing *Create*, you can view the status of your instance's deployment in your Azure notifications along the portal icon bar. The notification will indicate when deployment has succeeded, and you'll be able to select the _Go to resource_ button to view your created instance.

:::image type="content" source="media/how-to-set-up-instance/portal/notifications-deployment.png" alt-text="View of Azure notifications showing a successful deployment and highlighting the 'Go to resource' button":::

Alternatively, if deployment fails, the notification will indicate why. Observe the advice from the error message and retry creating the instance.

>[!TIP]
>Once your instance is created, you can return to its page at any time by searching for the name of your instance in the Azure portal search bar.

From the instance's *Overview* page, note its *Name*, *Resource group*, and *Host name*. These are all important values that you may need as you continue working with your Azure Digital Twins instance. If other users will be programming against the instance, you should share these values with them.

:::image type="content" source="media/how-to-set-up-instance/portal/instance-important-values.png" alt-text="Highlighting the important values from the instance's Overview page":::

You now have an Azure Digital Twins instance ready to go. Next, you'll give the appropriate Azure user permissions to manage it.

## Set up user access permissions

[!INCLUDE [digital-twins-setup-role-assignment.md](../../includes/digital-twins-setup-role-assignment.md)]

First, open the page for your Azure Digital Twins instance in the Azure portal. From the instance's menu, select *Access control (IAM)*. Select the  *Add* button under *Add a role assignment*.

:::image type="content" source="media/how-to-set-up-instance/portal/add-role-assignment-1.png" alt-text="Selecting to add a role assignment from the 'Access control (IAM)' page":::

On the following *Add role assignment* page, fill in the values (must be completed by a user with [sufficient permissions](#prerequisites-permission-requirements) in the Azure subscription):
* **Role**: Select *Azure Digital Twins Owner (Preview)* from the dropdown menu
* **Assign access to**: Select *Azure AD user, group or service principal* from the dropdown menu
* **Select**: Search for the name or email address of the user to assign. When you select the result, the user will show up in a *Selected members* section.

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-set-up-instance/portal/add-role-assignment-2.png" alt-text="Filling the listed fields into the 'Add role assignment' dialog":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

When you're finished entering the details, hit the *Save* button.

### Verify success

You can view the role assignment you've set up under *Access control (IAM) > Role assignments*. The user should show up in the list with a role of *Azure Digital Twins Owner (Preview)*. 

:::image type="content" source="media/how-to-set-up-instance/portal/verify-role-assignment.png" alt-text="View of the role assignments for an Azure Digital Twins instance in Azure portal":::

You now have an Azure Digital Twins instance ready to go, and have assigned permissions to manage it.

### Other possible steps for your organization

[!INCLUDE [digital-twins-setup-additional-requirements.md](../../includes/digital-twins-setup-additional-requirements.md)]

## Next steps

Test out individual REST API calls on your instance using the Azure Digital Twins CLI commands: 
* [az dt reference](/cli/azure/ext/azure-iot/dt?preserve-view=true&view=azure-cli-latest)
* [*How-to: Use the Azure Digital Twins CLI*](how-to-use-cli.md)

Or, see how to connect a client application to your instance with authentication code:
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)