---
title: "Troubleshoot known issues"
titleSuffix: Azure Digital Twins
description: Get help recognizing and mitigating known issues with Azure Digital Twins.
author: baanders
ms.author: baanders
ms.topic: troubleshooting
ms.service: azure-digital-twins
ms.date: 04/17/2025
---

# Azure Digital Twins known issues

This article provides information about known issues associated with Azure Digital Twins.

## Azure Digital Twins Explorer doesn't support private endpoints

**Issue description:** Azure Digital Twins Explorer shows errors when attempting to use it with an Azure Digital Twins instance that uses [Private Link](concepts-security.md#private-network-access-with-azure-private-link) to disable public access. You may see a popup that says *Error fetching models.*

| Does this affect me? | Cause | Resolution |
| --- | --- | --- |
| If you're using Azure&nbsp;Digital&nbsp;Twins with a private endpoint/Private Link, this issue will affect you when trying to view your instance in Azure&nbsp;Digital&nbsp;Twins Explorer. | Azure Digital Twins Explorer does not offer support for private endpoints. | You can deploy your own version of the Azure Digital Twins Explorer codebase privately in the cloud. For instructions on how to do this, see [Azure Digital Twins Explorer: Running in the cloud](https://github.com/Azure-Samples/digital-twins-explorer#running-in-the-cloud). Alternatively, you can manage your Azure Digital Twins instance using the [APIs and SDKs](./concepts-apis-sdks.md) instead. |

## "400 Client Error: Bad Request" in Cloud Shell

**Issue description:** Commands in Cloud Shell running at *https://shell.azure.com* may intermittently fail with the error "400 Client Error: Bad Request for url: `http://localhost:50342/oauth2/token`", followed by full stack trace.

| Does this affect me? | Cause | Resolution |
| --- | --- | --- |
| In&nbsp;Azure&nbsp;Digital&nbsp;Twins, this issue affects the following command groups:<br><br>`az dt route`<br><br>`az dt model`<br><br>`az dt twin` | It's the result of a known issue in Cloud Shell: [Getting token from Cloud Shell intermittently fails with 400 Client Error: Bad Request](https://github.com/Azure/azure-cli/issues/11749).<br><br>It presents a problem with Azure Digital Twins instance auth tokens and the Cloud Shell's default [managed identity](../active-directory/managed-identities-azure-resources/overview.md) based authentication. <br><br>It doesn't affect Azure Digital Twins commands from the `az dt` or `az dt endpoint` command groups, because they use a different type of authentication token (based on Azure Resource Manager), which doesn't have an issue with the Cloud Shell's managed identity authentication. | One way to resolve this issue is to rerun the `az login` command in Cloud Shell and completing the login steps that follow. This action will switch your session out of managed identity authentication, which avoids the root problem. Afterwards, you can rerun the command.<br><br>Otherwise, you can open the Cloud Shell pane in the Azure portal and complete your Cloud Shell work from there.<br>:::image type="content" source="media/troubleshoot-known-issues/portal-launch-icon.png" alt-text="Screenshot of the Cloud Shell icon in the Azure portal icon bar." lightbox="media/troubleshoot-known-issues/portal-launch-icon.png":::<br><br>Finally, another solution is to [install the Azure CLI](/cli/azure/install-azure-cli) on your machine so you can run Azure CLI commands locally. The local CLI doesn't experience this issue. |

## Issue with interactive browser authentication on Azure.Identity 1.2.0

**Issue description:** When writing authentication code in your Azure Digital Twins applications using version 1.2.0 of the [Azure.Identity](/dotnet/api/azure.identity?view=azure-dotnet&preserve-view=true) library, you may experience issues with the [InteractiveBrowserCredential](/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet&preserve-view=true) method. This issue presents as an error response of "Azure.Identity.AuthenticationFailedException" when trying to authenticate in a browser window. The browser window may fail to start up completely, or appear to authenticate the user successfully, while the client application still fails with the error.

| Does this affect me? | Cause | Resolution |
| --- | --- | --- |
| The&nbsp;affected&nbsp;method&nbsp;is&nbsp;used&nbsp;in&nbsp;the&nbsp;following articles:<br><br>[Code a client app](tutorial-code.md)<br><br>[Write app authentication code](how-to-authenticate-client.md)<br><br>[Azure Digital Twins APIs and SDKs](concepts-apis-sdks.md) | Some users have had this issue with version 1.2.0 of the `Azure.Identity` library. | To resolve, update your applications to use a [later version](https://www.nuget.org/packages/Azure.Identity) of `Azure.Identity`. After updating the library version, the browser should load and authenticate as expected. |

## Issue with default Azure credential authentication on Azure.Identity 1.3.0

**Issue description:** When writing authentication code using version 1.3.0 of the [Azure.Identity](/dotnet/api/azure.identity?view=azure-dotnet&preserve-view=true) library, some users have experienced issues with the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet&preserve-view=true) method used in many samples throughout these Azure Digital Twins docs. This issue presents as an error response of "Azure.Identity.AuthenticationFailedException: SharedTokenCacheCredential authentication failed" when the code tries to authenticate.

| Does this affect me? | Cause | Resolution |
| --- | --- | --- |
| `DefaultAzureCredential` is used in most of the documentation examples for this service that include authentication. If you're writing authentication code using `DefaultAzureCredential` with version 1.3.0 of the `Azure.Identity` library and seeing this error message, this issue affects you. | It's likely a result of some configuration issue with the `Azure.Identity` library and `DefaultAzureCredential`, its authentication class. This class is a wrapper containing several credential types that are tried in order. The issue may occur when the authentication flow reaches the `SharedTokenCacheCredential` type. | One strategy to resolve this is to exclude `SharedTokenCacheCredential` from your credential, as described in this [DefaultAzureCredential issue](https://github.com/Azure/azure-sdk/issues/1970) that is currently open against `Azure.Identity`. You can exclude `SharedTokenCacheCredential` from your credential by instantiating the `DefaultAzureCredential` class using the following optional parameter: `new DefaultAzureCredential(new DefaultAzureCredentialOptions { ExcludeSharedTokenCacheCredential = true });`<br>Another option is to change your application to use an earlier version of `Azure.Identity`, such as [version 1.2.3](https://www.nuget.org/packages/Azure.Identity/1.2.3). Using an earlier version has no functional impact to Azure Digital Twins, which makes it an accepted solution. |

## az dt commands fail with old azure-iot extension 

**Issue description:** CLI commands from the `az dt` command set fail if you are using an earlier version of the `azure-iot` extension than 0.26.0 (0.26.0 is acceptable) alongside version 2.70.0 or later of the Azure CLI. The error message ends in *AttributeError: 'CredentialAdaptor' object has no attribute 'signed_session'*.

| Does this affect me? | Cause | Resolution |
| --- | --- | --- |
| This issue affects your ability to run `az dt` commands if you're using an Azure CLI that's on version 2.70.0 or later, and a version of the `azure-iot` extension that's on an earlier version than 0.26.0. You can check your CLI version with the `az version` command and your `azure-iot` extension version with the `az extension show` command. | Version 0.26.0 or later of the `azure-iot` CLI extension is required to run `az dt` commands in version 2.70.0 or later of the Azure CLI. | Use the `az extension update` command to update the `azure-iot` extension to the latest version. |

## Next steps

Read more about security and permissions on Azure Digital Twins:
* [Security for Azure Digital Twins solutions](concepts-security.md)
