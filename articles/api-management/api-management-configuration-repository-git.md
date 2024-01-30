---
title: Configure your Azure API Management service using Git | Microsoft Docs
description: Learn how to save and configure your API Management service configuration using a Git repository.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 08/05/2022
ms.author: danlep
---
# How to save and configure your API Management service configuration using Git

Each API Management service instance maintains a configuration database that contains information about the configuration and metadata for the service instance. Changes can be made to the service instance by changing a setting in the Azure portal, using Azure tools such as Azure PowerShell or the Azure CLI, or making a REST API call. In addition to these methods, you can manage your service instance configuration using Git, enabling scenarios such as:

* **Configuration versioning** - Download and store different versions of your service configuration
* **Bulk configuration changes** - Make changes to multiple parts of your service configuration in your local repository and integrate the changes back to the server with a single operation
* **Familiar Git toolchain and workflow** - Use the Git tooling and workflows that you are already familiar with

The following diagram shows an overview of the different ways to configure your API Management service instance.

:::image type="content" source="media/api-management-configuration-repository-git/api-management-git-configure.png" alt-text="Diagram that compares ways to configure Azure API Management." border="false":::

When you make changes to your service using the Azure portal, Azure tools such as Azure PowerShell or the Azure CLI, or the REST API, you're managing your service configuration database using the `https://{name}.management.azure-api.net` endpoint, as shown on the right side of the diagram. The left side of the diagram illustrates how you can manage your service configuration using Git and Git repository for your service located at `https://{name}.scm.azure-api.net`.

The following steps provide an overview of managing your API Management service instance using Git.

1. Access Git configuration in your service
1. Save your service configuration database to your Git repository
1. Clone the Git repo to your local machine
1. Pull the latest repo down to your local machine, and commit and push changes back to your repo
1. Deploy the changes from your repo into your service configuration database

This article describes how to enable and use Git to manage your service configuration and provides a reference for the files and folders in the Git repository.

> [!IMPORTANT]
> This feature is designed to work with small to medium API Management service configurations, such as those with an exported size less than 10 MB, or with fewer than 10,000 entities. Services with a large number of entities (products, APIs, operations, schemas, and so on) may experience unexpected failures when processing Git commands. If you encounter such failures, please reduce the size of your service configuration and try again. Contact Azure Support if you need assistance. 

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]



## Access Git configuration in your service

 1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com/).

 1. In the left menu, under **Deployment and infrastructure**, select **Repository**.
 
:::image type="content" source="media/api-management-configuration-repository-git/api-management-enable-git.png" alt-text="Screenshot showing how to access Git configuration for API Management.":::

## Save the service configuration to the Git repository

> [!CAUTION]
> Any secrets that are not defined as named values will be stored in the repository and will remain in its history. Named values provide a secure place to manage constant string values, including secrets, across all API configuration and policies, so you don't have to store them directly in your policy statements. For more information, see [Use named values in Azure API Management policies](api-management-howto-properties.md).
>


Before cloning the repository, save the current state of the service configuration to the repository. 

1. On the **Repository** page, select **Save to repository**.

1. Make any desired changes on the confirmation screen, such as the name of the branch for saving the configuration, and select **Save**.

After a few moments the configuration is saved, and the configuration status of the repository is displayed, including the date and time of the last configuration change and the last synchronization between the service configuration and the repository.

Once the configuration is saved to the repository, it can be cloned.

For information on saving the service configuration using the REST API, see [Tenant configuration - Save](/rest/api/apimanagement/current-ga/tenant-configuration/save).

## Get access credentials

To clone a repository, in addition to the URL to your repository, your need a username and a password. 

1. On the **Repository** page, select **Access credentials** near the top of the page.

1. Note the username provided on the **Access credentials** page.

1. To generate a password, first ensure that the **Expiry** is set to the desired expiration date and time, and then select **Generate**.

> [!IMPORTANT]
> Make a note of this password. Once you leave this page the password will not be displayed again.
>

## Clone the repository to your local machine

The following examples use the Git Bash tool from [Git for Windows](https://www.git-scm.com/downloads) but you can use any Git tool that you're familiar with.

Open your Git tool in the desired folder and run the following command to clone the Git repository to your local machine, using the following command:

```
git clone https://{name}.scm.azure-api.net/
```

Provide the username and password when prompted.

If you receive any errors, try modifying your `git clone` command to include the user name and password, as shown in the following example.

```
git clone https://username:password@{name}.scm.azure-api.net/
```

If this provides an error, try URL encoding the password portion of the command. One quick way to do this is to open Visual Studio, and issue the following command in the **Immediate Window**. To open the **Immediate Window**, open any solution or project in Visual Studio (or create a new empty console application), and choose **Windows**, **Immediate** from the **Debug** menu.

```
?System.Net.WebUtility.UrlEncode("password from the Azure portal")
```

Use the encoded password along with your user name and repository location to construct the git command.

```
git clone https://username:url encoded password@{name}.scm.azure-api.net/
```

After cloning completes, change the directory to your repo by running a command like the following.

```
cd {name}.scm.azure-api.net/
```

If you saved the configuration to a branch other than the default branch (`master`), check out the branch:

```
git checkout <branch_name>
```

Once the repository is cloned, you can view and work with it in your local file system. For more information, see [File and folder structure reference of local Git repository](#file-and-folder-structure-reference-of-local-git-repository).

## Update your local repository with the most current service instance configuration

If you make changes to your API Management service instance in the Azure portal or using other Azure tools, you must save these changes to the repository before you can update your local repository with the latest changes. 

To save changes using the Azure portal, select **Save to repository** on the **Repository** tab for your API Management instance.

Then, to update your local repository:

1. Ensure that you are in the folder for your local repository. If you've just completed the `git clone` command, then you must change the directory to your repo by running a command like the following.

    ```
    cd {name}.scm.azure-api.net/
    ```

1. In the folder for your local repository, issue the following command.

    ```
    git pull
    ```

## Push changes from your local repo to the server repo
To push changes from your local repository to the server repository, you must commit your changes and then push them to the server repository. To commit your changes, open your Git command tool, switch to the directory of your local repository, and issue the following commands.

```
git add --all
git commit -m "Description of your changes"
```

To push all of the commits to the server, run the following command.

```
git push
```

## Deploy service configuration changes to the API Management service instance

Once your local changes are committed and pushed to the server repository, you can deploy them to your API Management service instance.

1. Navigate to your API Management instance in the [Azure portal](https://portal.azure.com/).

1. In the left menu, under **Deployment and infrastructure**, select **Repository** > **Deploy to API Management**.

1. On the **Deploy repository configuration** page, enter the name of the branch containing the desired configuration changes, and optionally select **Remove subscriptions of deleted products**. Select **Save**.

For information on performing this operation using the REST API, see [Tenant Configuration - Deploy](/rest/api/apimanagement/current-ga/tenant-configuration/deploy).

## File and folder structure reference of local Git repository

The files and folders in the local Git repository contain the configuration information about the service instance.

| Item | Description |
| --- | --- |
| root api-management folder |Contains top-level configuration for the service instance |
| apiReleases folder |Contains the configuration for the API releases in the service instance |
| apis folder |Contains the configuration for the APIs in the service instance |
| apiVersionSets folder |Contains the configuration for the API version sets in the service instance |
| backends folder |Contains the configuration for the backend resources in the service instance |
| groups folder |Contains the configuration for the groups in the service instance |
| policies folder |Contains the policies in the service instance |
| portalStyles folder |Contains the configuration for the developer portal customizations in the service instance |
| portalTemplates folder |Contains the configuration for the developer portal templates in the service instance |
| products folder |Contains the configuration for the products in the service instance |
| templates folder |Contains the configuration for the email templates in the service instance |

Each folder can contain one or more files, and in some cases one or more folders, for example a folder for each API, product, or group. The files within each folder are specific for the entity type described by the folder name.

| File type | Purpose |
| --- | --- |
| json |Configuration information about the respective entity |
| html |Descriptions about the entity, often displayed in the developer portal |
| xml |Policy statements |
| css |Style sheets for developer portal customization |

These files can be created, deleted, edited, and managed on your local file system, and the changes deployed back to your API Management service instance.

> [!NOTE]
> The following entities are not contained in the Git repository and cannot be configured using Git.
>
> * [Users](/rest/api/apimanagement/current-ga/user)
> * [Subscriptions](/rest/api/apimanagement/current-ga/subscription)
> * Named values
> * Developer portal entities other than styles and templates
> * Policy Fragments
>

### Root api-management folder
The root `api-management` folder contains a `configuration.json` file that contains top-level information about the service instance in the following format.

```json
{
  "settings": {
    "RegistrationEnabled": "True",
    "UserRegistrationTerms": null,
    "UserRegistrationTermsEnabled": "False",
    "UserRegistrationTermsConsentRequired": "False",
    "DelegationEnabled": "False",
    "DelegationUrl": "",
    "DelegatedSubscriptionEnabled": "False",
    "DelegationValidationKey": "",
    "RequireUserSigninEnabled": "false"
  },
  "$ref-policy": "api-management/policies/global.xml"
}
```

The first four settings (`RegistrationEnabled`, `UserRegistrationTerms`, `UserRegistrationTermsEnabled`, and `UserRegistrationTermsConsentRequired`) map to the following settings on the **Identities** tab in the **Developer portal** section.

| Identity setting | Maps to |
| --- | --- |
| RegistrationEnabled |Presence of **Username and password** identity provider |
| UserRegistrationTerms |**Terms of use on user signup** textbox |
| UserRegistrationTermsEnabled |**Show terms of use on signup page** checkbox |
| UserRegistrationTermsConsentRequired |**Require consent** checkbox |
| RequireUserSigninEnabled |**Redirect anonymous users to sign-in page** checkbox |

The next four settings (`DelegationEnabled`, `DelegationUrl`, `DelegatedSubscriptionEnabled`, and `DelegationValidationKey`) map to the following settings on the **Delegation** tab in the **Developer portal** section.

| Delegation setting | Maps to |
| --- | --- |
| DelegationEnabled |**Delegate sign-in & sign-up** checkbox |
| DelegationUrl |**Delegation endpoint URL** textbox |
| DelegatedSubscriptionEnabled |**Delegate product subscription** checkbox |
| DelegationValidationKey |**Delegate Validation Key** textbox |

The final setting, `$ref-policy`, maps to the global policy statements file for the service instance.

### apiReleases folder
The `apiReleases` folder contains a folder for each API release deployed to a production API, and contains the following items.

* `apiReleases\<api release Id>\configuration.json` - Configuration for the release, containing information about the release dates. This is the same information that would be returned if you were to call the [Get a specific release](/rest/api/apimanagement/current-ga/api-release/get) operation.


### apis folder
The `apis` folder contains a folder for each API in the service instance, which contains the following items.

* `apis\<api name>\configuration.json` - Configuration for the API, containing information about the backend service URL and the operations. This is the same information that would be returned if you were to call the [Get a specific API](/rest/api/apimanagement/current-ga/apis/get) operation.
* `apis\<api name>\api.description.html` - Description of the API, corresponding to the `description` property of the API entity in the REST API.
* `apis\<api name>\operations\` - Folder containing `<operation name>.description.html` files that map to the operations in the API. Each file contains the description of a single operation in the API, which maps to the `description` property of the [operation entity](/rest/api/apimanagement/current-ga/operation) in the REST API.

### apiVersionSets folder
The `apiVersionSets` folder contains a folder for each API version set created for an API, and contains the following items.

* `apiVersionSets\<api version set Id>\configuration.json` - Configuration for the version set. This is the same information that would be returned if you were to call the [Get a specific version set](/rest/api/apimanagement/current-ga/api-version-set/get) operation.

### groups folder
The `groups` folder contains a folder for each group defined in the service instance.

* `groups\<group name>\configuration.json` - Configuration for the group. This is the same information that would be returned if you were to call the [Get a specific group](/rest/api/apimanagement/current-ga/group/get) operation.
* `groups\<group name>\description.html` - Description of the group, corresponding to the `description` property of the [group entity](/rest/api/apimanagement/current-ga/group/).

### policies folder
The `policies` folder contains the policy statements for your service instance.

* `policies\global.xml` - Policies defined at global scope for your service instance.
* `policies\apis\<api name>\` - If you have policies defined at API scope, they're contained in this folder.
* `policies\apis\<api name>\<operation name>\` folder - If you have policies defined at operation scope, they're contained in this folder in `<operation name>.xml` files that map to the policy statements for each operation.
* `policies\products\` - If you have policies defined at product scope, they're contained in this folder, which contains `<product name>.xml` files that map to the policy statements for each product.

### portalStyles folder
The `portalStyles` folder contains configuration and style sheets for customizing the deprecated developer portal of the service instance.

* `portalStyles\configuration.json` - Contains the names of the style sheets used by the developer portal
* `portalStyles\<style name>.css` - Each `<style name>.css` file contains styles for the developer portal (`Preview.css` and `Production.css` by default).

### portalTemplates folder
The `portalTemplates` folder contains templates for customizing the deprecated developer portal of the service instance.

* `portalTemplates\<template name>\configuration.json` - Configuration of the template. 
* `portalTemplates\<template name>\<page name>.html` - Original and modified HTML pages of the template. 

### products folder
The `products` folder contains a folder for each product defined in the service instance.

* `products\<product name>\configuration.json` - Configuration for the product. This is the same information that would be returned if you were to call the [Get a specific product](/rest/api/apimanagement/current-ga/product/get) operation.
* `products\<product name>\product.description.html` - Description of the product, corresponding to the `description` property of the [product entity](/rest/api/apimanagement/current-ga/product/) in the REST API.

### templates
The `templates` folder contains configuration for the [email templates](api-management-howto-configure-notifications.md) of the service instance.

* `<template name>\configuration.json` - Configuration for the email template.
* `<template name>\body.html` - Body of the email template.

## Next steps
For information on other ways to manage your service instance, see:

* [Azure PowerShell cmdlet reference](/powershell/module/az.apimanagement)
* [Azure CLI reference](/cli/azure/apim)
* [API Management REST API reference](/rest/api/apimanagement/)
* [Azure SDK releases](https://azure.github.io/azure-sdk/)


