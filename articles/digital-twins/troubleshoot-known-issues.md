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

Commands in Cloud Shell may intermittently fail with the error "400 Client Error: Bad Request for url: http://localhost:50342/oauth2/token" followed by full stack trace.

### Troubleshooting steps

This can be resolved by re-running the `az login` command and completing subsequent login steps.

After this, you should be able to re-run the command.

### Possible causes

This is the result of a known issue in Cloud Shell: [*Getting token from Cloud Shell intermittently fails with 400 Client Error: Bad Request*](https://github.com/Azure/azure-cli/issues/11749).

## "Azure.Identity.AuthenticationFailedException" after browser authentication

When writing authentication code in your Azure Digital Twins applications and using version **1.2.0** of the **[Azure.Identity](https://docs.microsoft.com/dotnet/api/azure.identity?view=azure-dotnet) library** (currently the latest version available), you may experience issues with the [InteractiveBrowserCredential](https://docs.microsoft.com/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet) method.

This method is used in the following articles: 
* [*Tutorial: Code a client app*](tutorial-code.md)
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)
* [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis.sdks.md).

The issue includes an error response of "Azure.Identity.AuthenticationFailedException" when trying to authenticate in a browser window. The browser window may fail to start up completely, or appear to authenticate the user successfully, while the client application still fails with the error.

### Troubleshooting steps

To resolve, have your applications use Azure.Identity version **1.1.1** instead. With this version of the library, the browser should load and authenticate as expected.

### Possible causes

This is an incompatibility between Azure Digital Twins and Azure.Identity version **1.2.0**.

## Next steps

Read more about security and permissions on Azure Digital Twins:
* [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md)