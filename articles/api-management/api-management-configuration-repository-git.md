<properties 
	pageTitle="How to save and configure your API Management service configuration using Git" 
	description="Learn how to save and configure your API Management service configuration using Git." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/09/2016" 
	ms.author="sdanie"/>


# How to save and configure your API Management service configuration using Git

>[AZURE.IMPORTANT] Git configuration for API Management is currently in preview. It is functionally complete, but is in preview because we are actively seeking feedback on this feature. It is possible that we may make a breaking change in response to customer feedback, so we recommend not depending on the feature for use in production environments. If you have any feedback or questions, please let us know at `apimgmt@microsoft.com`.

Each API Management service instance maintains a configuration database that contains information about the configuration and metadata for the service instance. Changes can be made to the service instance by changing a setting in the publisher portal, using a PowerShell cmdlet, or making a REST API call. In addition to these methods, you can also manage your service instance configuration using Git, enabling service management scenarios such as:

-	Configuration versioning - download and store different versions of your service configuration
-	Bulk configuration changes - make changes to multiple parts of your service configuration in your local repository and integrate the changes back to the server with a single operation
-	Familiar Git toolchain and workflow - use the Git tooling and workflows that you are already familiar with

The following diagram shows an overview of the different ways to configure your API Management service instance.

![Git configure][api-management-git-configure]

When you make changes to your service using the publisher portal, PowerShell cmdlets, or the REST API, you are managing your service configuration database using the `https://{name}.management.azure-api.net` endpoint, as shown on the right side of the diagram. The left side of the diagram illustrates how you can manage your service configuration using Git and Git repository for your service located at `https://{name}.scm.azure-api.net`.

The following steps provide an overview of managing your API Management service instance using Git.

1.	Enable Git access in your service
2.	Save your service configuration database to your Git repository
3.	Clone the Git repo to your local machine
4.	Pull the latest repo down to your local machine, and commit and push changes back to your repo
5.	Deploy the changes from your repo into your service configuration database

This article describes how to enable and use Git to manage your service configuration and provides a reference for the files and folders in the Git repository.

## To enable Git access

You can quickly view the status of your Git configuration by viewing the Git icon in the upper-right corner of the publisher portal. In this example, Git access has not yet been enabled.

![Git status][api-management-git-icon-enable]

To view and configure your Git configuration settings, you can either click the Git icon, or click the **Security** menu and navigate to the **Configuration repository** tab.

![Enable GIT][api-management-enable-git]

To enable Git access, check the **Enable Git access** checkbox.

After a moment the change is saved and a confirmation message is displayed. Note that Git icon has changed to color to indicate that Git access is enabled and the status message now indicates that there are unsaved changes to the repository. This is because the API Management service configuration database has not yet been saved to the repository.

![Git enabled][api-management-git-enabled]

>[AZURE.IMPORTANT] Any secrets that are not defined as properties will be stored in the repository and will remain in its history until you disable and re-enable Git access. Properties provide a secure place to manage constant string values, including secrets, across all API configuration and policies, so you don't have to store them directly in your policy statements. For more information, see [How to use properties in Azure API Management policies](api-management-howto-properties.md).

For information on enabling or disabling Git access using the REST API, see [Enable or disable Git access using the REST API](https://msdn.microsoft.com/library/dn781420.aspx#EnableGit).

## To save the service configuration to the Git repository

The first step before cloning the repository is to save the current state of the service configuration to the repository. Click **Save configuration to repository**.

![Save configuration][api-management-save-configuration]

Make any desired changes on the confirmation screen and click **Ok** to save.

![Save configuration][api-management-save-configuration-confirm]

After a few moments the configuration is saved, and the configuration status of the repository is displayed, including the date and time of the last configuration change and the last synchronization between the service configuration and the repository.

![Configuration status][api-management-configuration-status]

Once the configuration is saved to the repository, it can be cloned.

For information on performing this operation using the REST API, see [Commit configuration snapshot using the REST API](https://msdn.microsoft.com/library/dn781420.aspx#CommitSnapshot).

## To clone the repository to your local machine

To clone a repository, you need the URL to your repository, a user name, and a password. The user name and URL are displayed near the top of the **Configuration repository** tab.

![Git clone][api-management-configuration-git-clone]

The password is generated at the bottom of the **Configuration repository** tab.

![Generate password][api-management-generate-password]

To generate a password, first ensure that the **Expiry** is set to the desired expiration date and time, and then click **Generate Token**.

![Password][api-management-password]

>[AZURE.IMPORTANT] Make a note of this password. Once you leave this page the password will not be displayed again.

The following examples use the Git Bash tool from [Git for Windows](http://www.git-scm.com/downloads) but you can use any Git tool that you are familiar with.

Open your Git tool in the desired folder and run the following command to clone the git repository to your local machine, using the command provided by the publisher portal.

	git clone https://bugbashdev4.scm.azure-api.net/ 

Provide the user name and password when prompted.

If you receive any errors, try modifying your `git clone` command to include the user name and password, as shown in the following example.

	git clone https://username:password@bugbashdev4.scm.azure-api.net/

If this provides an error, try URL encoding the password portion of the command. One quick way to do this is to open Visual Studio, and issue the following command in the **Immediate Window**. To open the **Immediate Window**, open any solution or project in Visual Studio (or create a new empty console application), and choose **Windows**, **Immediate** from the **Debug** menu.

	?System.NetWebUtility.UrlEncode("password from publisher portal")

Use the encoded password along with your user name and repository location to construct the git command.

	git clone https://username:url encoded password@bugbashdev4.scm.azure-api.net/

Once the repository is cloned you can view and work with it in your local file system. For more information, see [File and folder structure reference of local Git repository](#file-and-folder-structure-reference-of-local-git-repository).

## To update your local repository with the most current service instance configuration

If you make changes to your API Management service instance in the publisher portal or using the REST API, you must save these changes to the repository before you can update your local repository with the latest changes. To do this, click **Save configuration to repository** on the **Configuration repository** tab in the publisher portal, and then issue the following command in your local repository.

	git pull

Before running `git pull` ensure that you are in the folder for your local repository. If you have just completed the `git clone` command, then you must change the directory to your repo by running a command like the following.

	cd bugbashdev4.scm.azure-api.net/

## To push changes from your local repo to the server repo

To push changes from your local repository to the server repository, you must commit your changes and then push them to the server repository. To commit your changes, open your Git command tool, switch to the directory of your local repository, and issue the following commands.

	git add --all
	git commit -m "Description of your changes"

To push all of the commits to the server, run the following command.

	git push

## To deploy any service configuration changes to the API Management service instance

Once your local changes are committed and pushed to the server repository, you can deploy them to your API Management service instance.

![Deploy][api-management-configuration-deploy]

For information on performing this operation using the REST API, see [Deploy Git changes to configuration database using the REST API](https://msdn.microsoft.com/library/dn781420.aspx#DeployChanges).

## File and folder structure reference of local Git repository

The files and folders in the local git repository contain the configuration information about the service instance.

| Item                       | Description                                                                                |
|-------------------------   |--------------------------------------------------------------------------------------------|
| root api-management folder | Contains top-level configuration for the service instance                                  |
| apis folder                | Contains the configuration for the apis in the service instance                            |
| groups folder              | Contains the configuration for the groups in the service instance                          |
| policies folder            | Contains the policies in the service instance                                              |
| portalStyles folder        | Contains the configuration for the developer portal customizations in the service instance |
| products folder            | Contains the configuration for the products in the service instance                        |
| templates folder           | Contains the configuration for the email templates in the service instance                 |

Each folder can contain one or more files, and in some cases one or more folders, for example a folder for each API, product, or group. The files within each folder are specific for the entity type described by the folder name.

| File type | Purpose                                                                |
|-----------|------------------------------------------------------------------------|
| json      | Configuration information about the respective entity                  |
| html      | Descriptions about the entity, often displayed in the developer portal |
| xml       | Policy statements                                                      |
| css       | Style sheets for developer portal customization                        |

These files can be created, deleted, edited, and managed on your local file system, and the changes deployed back to the your API Management service instance.

>[AZURE.NOTE] The following entities are not contained in the Git repository and cannot be configured using Git.
>
>-    Users
>-    Subscriptions
>-    Properties
>-    Developer portal entities other than styles

### Root api-management folder

The root `api-management` folder contains a `configuration.json` file that contains top-level information about the service instance in the following format.

	{
	  "settings": {
	    "RegistrationEnabled": "True",
	    "UserRegistrationTerms": null,
	    "UserRegistrationTermsEnabled": "False",
	    "UserRegistrationTermsConsentRequired": "False",
	    "DelegationEnabled": "False",
	    "DelegationUrl": "",
	    "DelegatedSubscriptionEnabled": "False",
	    "DelegationValidationKey": ""
	  },
	  "$ref-policy": "api-management/policies/global.xml"
	}

The first four settings (`RegistrationEnabled`, `UserRegistrationTerms`, `UserRegistrationTermsEnabled`, and `UserRegistrationTermsConsentRequired`) map to the following settings on the **Identities** tab in the **Security** section.

| Identity setting                     | Maps to                                               |
|--------------------------------------|-------------------------------------------------------|
| RegistrationEnabled                  | **Redirect anonymous users to sign-in page** checkbox |
| UserRegistrationTerms                | **Terms of use on user signup** textbox               |
| UserRegistrationTermsEnabled         | **Show terms of use on signup page** checkbox         |
| UserRegistrationTermsConsentRequired | **Require consent** checkbox                          |

![Identity settings][api-management-identity-settings]

The next four settings (`DelegationEnabled`, `DelegationUrl`, `DelegatedSubscriptionEnabled`, and `DelegationValidationKey`) map to the following settings on the **Delegation** tab in the **Security** section.

| Delegation setting           | Maps to                                    |
|------------------------------|--------------------------------------------|
| DelegationEnabled            | **Delegate sign-in & sign-up** checkbox    |
| DelegationUrl                | **Delegation endpoint URL** textbox        |
| DelegatedSubscriptionEnabled | **Delegate product subscription** checkbox |
| DelegationValidationKey      | **Delegate Validation Key** textbox        |

![Delegation settings][api-management-delegation-settings]

The final setting, `$ref-policy`, maps to the global policy statements file for the service instance.

### apis folder

The `apis` folder contains a folder for each API in the service instance which contains the following items.

-	`apis\<api name>\configuration.json` - this is the configuration for the API and contains information about the backend service URL and the operations. This is the same information that would be returned if you were to call [Get a specific API](https://msdn.microsoft.com/library/azure/dn781423.aspx#GetAPI) with `export=true` in `application/json` format.
-	`apis\<api name>\api.description.html` - this is the description of the API and corresponds to the `description` property of the [API entity](https://msdn.microsoft.com/library/azure/dn781423.aspx#EntityProperties).
-	`apis\<api name>\operations\` - this folder contains `<operation name>.description.html` files that map to the operations in the API. Each file contains the description of a single operation in the API which maps to the `description` property of the [operation entity](https://msdn.microsoft.com/library/azure/dn781423.aspx#OperationProperties) in the REST API.

### groups folder

The `groups` folder contains a folder for each group defined in the service instance.

-	`groups\<group name>\configuration.json` - this is the configuration for the group. This is the same information that would be returned if you were to call the [Get a specific group](https://msdn.microsoft.com/library/azure/dn776329.aspx#GetGroup) operation.
-	`groups\<group name>\description.html` - this is the description of the group and corresponds to the `description` property of the [group entity](https://msdn.microsoft.com/library/azure/dn776329.aspx#EntityProperties).

### policies folder

The `policies` folder contains the policy statements for your service instance.

-	`policies\global.xml` - contains policies defined at global scope for your service instance.
-	`policies\apis\<api name>\` - if you have any policies defined at API scope, they are contained in this folder.
-	`policies\apis\<api name>\<operation name>\` folder - if you have any policies defined at operation scope, they are contained in this folder in `<operation name>.xml` files that map to the policy statements for each operation.
-	`policies\products\` - if you have any policies defined at product scope, they are contained in this folder, which contains `<product name>.xml` files that map to the policy statements for each product.

### portalStyles folder

The `portalStyles` folder contains configuration and style sheets for developer portal customizations for the service instance.

-	`portalStyles\configuration.json` - contains the names of the style sheets used by the developer portal
-	`portalStyles\<style name>.css` - each `<style name>.css` file contains styles for the developer portal (`Preview.css` and `Production.css` by default).

### products folder

The `products` folder contains a folder for each product defined in the service instance.

-	`products\<product name>\configuration.json` - this is the configuration for the product. This is the same information that would be returned if you were to call the [Get a specific product](https://msdn.microsoft.com/library/azure/dn776336.aspx#GetProduct) operation.
-	`products\<product name>\product.description.html` - this is the description of the product and corresponds to the `description` property of the [product entity](https://msdn.microsoft.com/library/azure/dn776336.aspx#Product) in the REST API.

### templates

The `templates` folder contains configuration for the [email templates](api-management-howto-configure-notifications.md) of the service instance.

-	`<template name>\configuration.json` - this is the configuration for the email template.
-	`<template name>\body.html` - this is the body of the email template.

## Next steps

For information on other ways to manage your service instance, see:

-	Manage your service instance using the following PowerShell cmdlets
	-	[Service deployment PowerShell cmdlet reference](https://msdn.microsoft.com/library/azure/mt619282.aspx)
	-	[Service management PowerShell cmdlet reference](https://msdn.microsoft.com/library/azure/mt613507.aspx)
-	Manage your service instance in the publisher portal
	-	[Manage your first API](api-management-get-started.md)
-	Manage your service instance using the REST API
	-	[API Management REST API reference](https://msdn.microsoft.com/library/azure/dn776326.aspx)

## Watch a video overview

> [AZURE.VIDEO configuration-over-git]

[api-management-enable-git]: ./media/api-management-configuration-repository-git/api-management-enable-git.png
[api-management-git-enabled]: ./media/api-management-configuration-repository-git/api-management-git-enabled.png
[api-management-save-configuration]: ./media/api-management-configuration-repository-git/api-management-save-configuration.png
[api-management-save-configuration-confirm]: ./media/api-management-configuration-repository-git/api-management-save-configuration-confirm.png
[api-management-configuration-status]: ./media/api-management-configuration-repository-git/api-management-configuration-status.png
[api-management-configuration-git-clone]: ./media/api-management-configuration-repository-git/api-management-configuration-git-clone.png
[api-management-generate-password]: ./media/api-management-configuration-repository-git/api-management-generate-password.png
[api-management-password]: ./media/api-management-configuration-repository-git/api-management-password.png
[api-management-git-configure]: ./media/api-management-configuration-repository-git/api-management-git-configure.png
[api-management-configuration-deploy]: ./media/api-management-configuration-repository-git/api-management-configuration-deploy.png
[api-management-identity-settings]: ./media/api-management-configuration-repository-git/api-management-identity-settings.png
[api-management-delegation-settings]: ./media/api-management-configuration-repository-git/api-management-delegation-settings.png
[api-management-git-icon-enable]: ./media/api-management-configuration-repository-git/api-management-git-icon-enable.png




