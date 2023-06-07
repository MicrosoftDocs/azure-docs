---
title: 'Troubleshoot error: Azure Functions Runtime is unreachable'
description: Learn how to troubleshoot an invalid storage account.
ms.topic: article
ms.date: 12/15/2022
---

# Troubleshoot error: "Azure Functions Runtime is unreachable"

This article helps you troubleshoot the following error string that appears in the Azure portal:

> "Error: Azure Functions Runtime is unreachable. Click here for details on storage configuration."

This issue occurs when the Functions runtime can't start. The most common reason for this is that the function app has lost access to its storage account. For more information, see [Storage account requirements](storage-considerations.md#storage-account-requirements).

The rest of this article helps you troubleshoot specific causes of this error, including how to identify and resolve each case.

## Storage account was deleted

Every function app requires a storage account to operate. If that account is deleted, your functions won't work.

Start by looking up your storage account name in your application settings. Either `AzureWebJobsStorage` or `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` contains the name of your storage account as part of a connection string. For more information, see [App settings reference for Azure Functions](./functions-app-settings.md#azurewebjobsstorage).

Search for your storage account in the Azure portal to see whether it still exists. If it has been deleted, re-create the storage account and replace your storage connection strings. Your function code is lost, and you need to redeploy it.

## Storage account application settings were deleted

In the preceding step, if you can't find a storage account connection string, it was likely deleted or overwritten. Deleting application settings most commonly happens when you're using deployment slots or Azure Resource Manager scripts to set application settings.

### Required application settings

* Required:
  * [`AzureWebJobsStorage`](./functions-app-settings.md#azurewebjobsstorage)
* Required for Premium plan functions:
  * [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](./functions-app-settings.md)
  * [`WEBSITE_CONTENTSHARE`](./functions-app-settings.md)

For more information, see [App settings reference for Azure Functions](./functions-app-settings.md).

### Guidance

* Don't check **slot setting** for any of these settings. If you swap deployment slots, the function app breaks.
* Don't modify these settings as part of automated deployments.
* These settings must be provided and valid at creation time. An automated deployment that doesn't contain these settings results in a function app that won't run, even if the settings are added later.

## Storage account credentials are invalid

The previously discussed storage account connection strings must be updated if you regenerate storage keys. For more information about storage key management, see [Create an Azure Storage account](../storage/common/storage-account-create.md).

## Storage account is inaccessible

Your function app must be able to access the storage account. Common issues that block a function app's access to a storage account are:

* The function app is deployed to your App Service Environment (ASE) without the correct network rules to allow traffic to and from the storage account.

* The storage account firewall is enabled and not configured to allow traffic to and from functions. For more information, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

* Verify that the `allowSharedKeyAccess` setting is set to `true`, which is its default value. For more information, see [Prevent Shared Key authorization for an Azure Storage account](../storage/common/shared-key-authorization-prevent.md?tabs=portal#verify-that-shared-key-access-is-not-allowed). 

## Daily execution quota is full

If you have a daily execution quota configured, your function app is temporarily disabled, which causes many of the portal controls to become unavailable. 

To verify the quota in the [Azure portal](https://portal.azure.com), select **Platform Features** > **Function App Settings** in your function app. If you're over the **Daily Usage Quota** you've set, the following message is displayed:

> "The Function App has reached daily usage quota and has been stopped until the next 24 hours time frame."

To resolve this issue, remove or increase the daily quota, and then restart your app. Otherwise, the execution of your app is blocked until the next day.

## App is behind a firewall

Your function app might be unreachable for either of the following reasons:

* Your function app is hosted in an [internally load balanced App Service Environment](../app-service/environment/create-ilb-ase.md) and it's configured to block inbound internet traffic.

* Your function app has [inbound IP restrictions](functions-networking-options.md#inbound-networking-features) that are configured to block internet access. 

The Azure portal makes calls directly to the running app to fetch the list of functions, and it makes HTTP calls to the Kudu endpoint. Platform-level settings under the **Platform Features** tab are still available.

To verify your ASE configuration:

1. Go to the network security group (NSG) of the subnet where the ASE resides.
1. Validate the inbound rules to allow traffic that's coming from the public IP of the computer where you're accessing the application. 

You can also use the portal from a computer that's connected to the virtual network that's running your app or to a virtual machine that's running in your virtual network. 

For more information about inbound rule configuration, see the "Network Security Groups" section of [Networking considerations for an App Service Environment](../app-service/environment/network-info.md#network-security-groups).

## Container errors on Linux

For function apps that run on Linux in a container, the `Azure Functions runtime is unreachable` error can occur as a result of problems with the container. Use the following procedure to review the container logs for errors:

1. Navigate to the Kudu endpoint for the function app, which is located at `https://<FUNCTION_APP>.scm.azurewebsites.net`, where `<FUNCTION_APP>` is the name of your app.

1. Download the Docker logs .zip file and review the contents on your local computer. 

1. Check for any logged errors that indicate that the container is unable to start successfully.

### Container image unavailable

Errors can occur when the container image being referenced is unavailable or fails to start correctly. Check for any logged errors that indicate that the container is unable to start successfully.

You need to correct any errors that prevent the container from starting for the function app run correctly.

When the container image can't be found, you'll see a `manifest unknown` error in the Docker logs. In this case, you can use the Azure CLI commands documented at [How to target Azure Functions runtime versions](set-runtime-version.md?tabs=azurecli#manual-version-updates-on-linux) to change the container image being referenced. If you've deployed a [custom container image](./functions-how-to-custom-container.md), you need to fix the image and redeploy the updated version to the referenced registry.

### App container has conflicting ports

Your function app might be in an unresponsive state due to conflicting port assignment upon startup. This can happen in the following cases:

* Your container has separate services running where one or more services are tying to bind to the same port as the function app.
* You've added an Azure Hybrid Connection that shares the same port value as the function app.

By default, the container in which your function app runs uses port `:80`. When other services in the same container are also trying to using port `:80`, the function app can fail to start. If your logs show port conflicts, change the default ports.

## Host ID collision 

Starting with version 3.x of the Functions runtime, [host ID collision](storage-considerations.md#host-id-considerations) are detected and logged as a warning. In version 4.x, an error is logged and the host is stopped. If the runtime can't start for your function app, [review the logs](analyze-telemetry-data.md). If there's a warning or an error about host ID collisions, follow the mitigation steps in [Host ID considerations](storage-considerations.md#host-id-considerations).  

## Read-only app settings

Changing any _read-only_ [App Service application settings](../app-service/reference-app-settings.md#app-environment) can put your function app into an unreachable state. 

## Next steps

Learn about monitoring your function apps:
> [!div class="nextstepaction"]
> [Monitor Azure Functions](functions-monitoring.md)

