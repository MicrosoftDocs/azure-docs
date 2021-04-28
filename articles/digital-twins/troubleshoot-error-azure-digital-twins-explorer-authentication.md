---
title: "Azure Digital Twins Explorer authentication error"
description: "Causes and resolutions for 'Authentication failed.' in Azure Digital Twins Explorer."
ms.service: digital-twins
author: baanders
ms.author: baanders
ms.topic: troubleshooting
ms.date: 4/8/2021
---

# Authentication failed

This article describes causes and resolution steps for receiving an 'Authentication failed' error while running the [Azure Digital Twins Explorer](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/) sample on your local machine. 

## Symptoms

When setting up and running the Azure Digital Twins Explorer application, attempts to authenticate with the app are met with the following error message:

:::image type="content" source="media/troubleshoot-error-azure-digital-twins-explorer-authentication/authentication-error.png" alt-text="Screenshot of an error message in Azure Digital Twins explorer with the following text:Authentication failed. If you are running the app locally, please make sure that you are logged in to Azure on your host machine, or example by running 'az login' in a command prompt, by signing into Visual Studio or VS Code or by setting environment variables. If you need more information, please see the readme, or look up DefaultAzureCredential in the Azure.Identity documentation. If you are running adt-explorer hosted in the cloud, please make sure that your hosting Azure Function has a system-assigned managed identity set up. See the readme for more information.":::

## Causes

### Cause #1

The Azure Digital Twins Explorer application uses [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) (part of the `Azure.Identity` library), which will search for credentials within your local environment.

As the error text states, this error may occur if you have not provided local credentials for `DefaultAzureCredential` to pick up.

For more information about using local credentials with Azure Digital Twins Explorer, see the [Set up local Azure credentials](./quickstart-azure-digital-twins-explorer.md#set-up-local-azure-credentials) section of the Azure Digital Twins *Quickstart: Explore a sample scenario*.

### Cause #2

This error may also occur if your Azure account does not have the required Azure role-based access control (Azure RBAC) permissions set on your Azure Digital Twins instance. In order to access data in your instance, you must have the **Azure Digital Twins Data Reader** or **Azure Digital Twins Data Owner** role on the instance you are trying to read or manage, respectively. 

For more information about security and roles in Azure Digital Twins, see [Concepts: Security for Azure Digital Twins solutions](concepts-security.md).

## Solutions

### Solution #1

First, ensure that you've provided necessary credentials to the application.

#### Provide local credentials

`DefaultAzureCredential` authenticates to the service using the information from a local Azure sign-in. You can provide your Azure credentials by signing into your Azure account in a local [Azure CLI](/cli/azure/install-azure-cli) window, or in Visual Studio or Visual Studio Code.

You can view the credential types that `DefaultAzureCredential` accepts, as well as the order in which they're attempted, in the [Azure Identity documentation for DefaultAzureCredential](/dotnet/api/overview/azure/identity-readme#defaultazurecredential).

If you're already signed in locally to the right Azure account and the issue is not resolved, continue to the next solution.

### Solution #2

Verify that your Azure user has the **Azure Digital Twins Data Reader** role on the Azure Digital Twins instance if you're just trying to read its data, or the **Azure Digital Twins Data Owner** role on the instance if you're trying to manage its data.

Note that this role is different from...
* the former name for this role during preview, *Azure Digital Twins Owner (Preview)* (the role is the same, but the name has changed)
* the *Owner* role on the entire Azure subscription. *Azure Digital Twins Data Owner* is a role within Azure Digital Twins and is scoped to this individual Azure Digital Twins instance.
* the *Owner* role in Azure Digital Twins. These are two distinct Azure Digital Twins management roles, and *Azure Digital Twins Data Owner* is the role that should be used for management.

 If you do not have this role, set it up to resolve the issue.

#### Check current setup

[!INCLUDE [digital-twins-setup-verify-role-assignment.md](../../includes/digital-twins-setup-verify-role-assignment.md)]

#### Fix issues 

If you do not have this role assignment, someone with an Owner role in your **Azure subscription** should run the following command to give your Azure user the appropriate role on the **Azure Digital Twins instance**. 

If you're an Owner on the subscription, you can run this command yourself. If you're not, contact an Owner to run this command on your behalf. The role name is either **Azure Digital Twins Data Owner** for edit access or **Azure Digital Twins Data Reader** for read access.

```azurecli-interactive
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<your-Azure-AD-email>" --role "<role-name>"
```

For more details about this role requirement and the assignment process, see the [Set up your user's access permissions section](how-to-set-up-instance-CLI.md#set-up-user-access-permissions) of *How-to: Set up an instance and authentication (CLI or portal)*.

## Next steps

Read the setup steps for creating and authenticating a new Azure Digital Twins instance:
* [How-to: Set up an instance and authentication (CLI)](how-to-set-up-instance-cli.md)

Read more about security and permissions on Azure Digital Twins:
* [Concepts: Security for Azure Digital Twins solutions](concepts-security.md)
