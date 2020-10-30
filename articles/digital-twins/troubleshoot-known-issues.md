---
title: Known issues - Azure Digital Twins
description: Get help recognizing and mitigating known issues with Azure Digital Twins.
author: baanders
ms.author: baanders
ms.topic: troubleshooting
ms.service: digital-twins
ms.date: 07/14/2020
---

# Known issues in Azure Digital Twins

This article provides information about known issues associated with Azure Digital Twins.

## "400 Client Error: Bad Request" in Cloud Shell

Commands in Cloud Shell running at *https://shell.azure.com* may intermittently fail with the error "400 Client Error: Bad Request for url: http://localhost:50342/oauth2/token", followed by full stack trace.

For Azure Digital Twins specifically, this affects the following command groups:
* `az dt route`
* `az dt model`
* `az dt twin`

### Troubleshooting steps

This can be resolved by rerunning the `az login` command in Cloud Shell and completing subsequent login steps. After this, you should be able to rerun the command.

Alternatively, you can open the Cloud Shell pane in the Azure portal and complete your Cloud Shell work from there:

:::image type="content" source="media/includes/portal-cloud-shell.png" alt-text="View of the Azure portal with the 'Cloud Shell' icon highlighted, and the Cloud Shell appearing at the bottom of the portal window":::

Finally, another solution is to [install the Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest&preserve-view=true) on your machine so you can run Azure CLI commands locally. The local CLI does not experience this issue.

### Possible causes

This is the result of a known issue in Cloud Shell: [*Getting token from Cloud Shell intermittently fails with 400 Client Error: Bad Request*](https://github.com/Azure/azure-cli/issues/11749).

This presents a problem with Azure Digital Twins instance auth tokens and the Cloud Shell's default [managed identity](../active-directory/managed-identities-azure-resources/overview.md) based authentication. The troubleshooting step of running `az login` switches you out of managed identity authentication, thus stepping over this problem.

This doesn't affect Azure Digital Twins commands from the `az dt` or `az dt endpoint` command groups, because they use a different type of authentication token (ARM-based), which doesn't have an issue with the Cloud Shell's managed identity authentication.

## Missing role assignment after scripted setup

Some users may experience issues with the role assignment portion of [*How-to: Set up an instance and authentication (scripted)*](how-to-set-up-instance-scripted.md). The script does not indicate failure, but the *Azure Digital Twins Data Owner* role is not successfully assigned to the user, and this issue will impact ability to create other resources down the road.

[!INCLUDE [digital-twins-role-rename-note.md](../../includes/digital-twins-role-rename-note.md)]

To determine whether your role assignment was successfully set up after running the script, follow the instructions in the [*Verify user role assignment*](how-to-set-up-instance-scripted.md#verify-user-role-assignment) section of the setup article. If your user is not shown with this role, this issue affects you.

### Troubleshooting steps

To resolve, you can set up your role assignment manually using either the CLI or Azure portal. 

Follow these instructions:
* [CLI](how-to-set-up-instance-cli.md#set-up-user-access-permissions)
* [portal](how-to-set-up-instance-portal.md#set-up-user-access-permissions)

### Possible causes

For users logged in with a personal [Microsoft account (MSA)](https://account.microsoft.com/account), your user's Principal ID that identifies you in commands like this may be different from your user's sign-in email, making it difficult for the script to discover and use to assign the role properly.

## Issue with interactive browser authentication

When writing authentication code in your Azure Digital Twins applications using version **1.2.0** of the **[Azure.Identity](/dotnet/api/azure.identity?view=azure-dotnet&preserve-view=true) library**, you may experience issues with the [InteractiveBrowserCredential](/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet&preserve-view=true) method.

This is not the latest version of the library. The latest version is **1.2.2**.

The affected method is used in the following articles: 
* [*Tutorial: Code a client app*](tutorial-code.md)
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)
* [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md)

The issue includes an error response of "Azure.Identity.AuthenticationFailedException" when trying to authenticate in a browser window. The browser window may fail to start up completely, or appear to authenticate the user successfully, while the client application still fails with the error.

### Troubleshooting steps

To resolve, update your applications to use `Azure.Identity` version **1.2.2**. With this version of the library, the browser should load and authenticate as expected.

### Possible causes

This is related to an open issue with the latest version of the `Azure.Identity` library (version **1.2.0**): [*Fail to authenticate when using InteractiveBrowserCredential*](https://github.com/Azure/azure-sdk-for-net/issues/13940).

You will see this issue if you use version **1.2.0** in your Azure Digital Twins application, or if you add the library to your project without specifying a version (as that also defaults to this latest version).

## Next steps

Read more about security and permissions on Azure Digital Twins:
* [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md)