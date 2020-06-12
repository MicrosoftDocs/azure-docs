---
title: Quickstart - Create an Azure notification hub using the Azure CLI | Microsoft Docs
description: In this tutorial, you learn how to create an Azure notification hub using the Azure CLI.
services: notification-hubs
author: dbradish-microsoft
manager: barbkess
editor: sethmanheim

ms.service: notification-hubs
ms.devlang: azurecli
ms.workload: mobile
ms.topic: quickstart
ms.date: 05/27/2020
ms.author: dbradish
ms.reviewer: sethm
ms.lastreviewed: 03/18/2020
---

# Quickstart: Create an Azure notification hub using the Azure CLI

Azure Notification Hubs provide an easy-to-use and scaled-out push engine that allows you to send notifications to any platform (iOS, Android, Windows, Kindle, Baidu, etc.) from any backend (cloud or on-premises). For more information about the service, see [What is Azure Notification Hubs?](notification-hubs-push-notification-overview.md).

In this quickstart, you create a notification hub using the Azure CLI. The first section gives you steps to create a notification hub namespace.  The second section gives you steps to create a notification hub in an existing namespace.  You also learn how to create a custom access policy.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

Notification Hubs requires version 2.0.67 or later of the Azure CLI. Run `az --version` to find the version and dependent libraries that are installed. To install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Prepare your environment

1. Sign in.

   Sign in using the [az login](/cli/azure/reference-index#az-login) command if you're using a local install of the CLI.

    ```azurecli
    az login
    ```

    Follow the steps displayed in your terminal to complete the authentication process.

2. Install the Azure CLI extension.

   When working with extension references for the Azure CLI, you must first install the extension.  Azure CLI extensions give you access to experimental and pre-release commands that have not yet shipped as part of the core CLI.  To learn more about extensions including updating and uninstalling, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).

   Install the [extension for Notification Hubs](/cli/azure/ext/notification-hub/notification-hub) by running the following command:

    ```azurecli
    az extension add --name notification-hub
   ```

3. Create a resource group.

   Azure Notification Hubs, like all Azure resources, must be deployed into a resource group. Resource groups allow you to organize and manage related Azure resources.

   For this quickstart, create a resource group named _spnhubrg_ in the _eastus_ location with the following [az group create](/cli/azure/group#az-group-create) command:

   ```azurecli
   az group create --name spnhubrg --location eastus
   ```

## Create a notification hub namespace

1. Create a namespace for your notification hubs.

   A namespace contains one or more hubs, and **the name must be unique across all Azure subscriptions and be at least six characters in length**.  To check the availability of a name, use the [az notification-hub namespace check-availability](/cli/azure/ext/notification-hub/notification-hub/namespace#ext-notification-hub-az-notification-hub-namespace-check-availability) command.

   ```azurecli
   az notification-hub namespace check-availability --name spnhubns
   ```

   Azure CLI will respond to your request for availability by displaying the following console output:

   ```output
   {
   "id": "/subscriptions/yourSubscriptionID/providers/Microsoft.NotificationHubs/checkNamespaceAvailability",
   "isAvailiable": true,
   "location": null,
   "name": "spnhubns",
   "properties": false,
   "sku": null,
   "tags": null,
   "type": "Microsoft.NotificationHubs/namespaces/checkNamespaceAvailability"
   }
   ```

   Notice the second line in the Azure CLI response, `"isAvailable": true`.  This line will read `false` if the desired name you specified for the namespace is available.  Once you have confirmed availability of the name, run the [az notification-hub namespace create](/cli/azure/ext/notification-hub/notification-hub/namespace#ext-notification-hub-az-notification-hub-namespace-create) command to create your namespace.  

   ```azurecli
   az notification-hub namespace create --resource-group spnhubrg --name spnhubns  --location eastus --sku Free
   ```

   If the `--name` you provided to the `az notification-hub namespace create` command is not available, or does not meet [Naming rules and restrictions for Azure resources](/azure/azure-resource-manager/management/resource-name-rules), Azure CLI will respond with the following console output:

   ```output
   #the name is not available
   The specified name is not available. For more information visit https://aka.ms/eventhubsarmexceptions.

   #the name is invalied
   The specified service namespace is invalid.
   ```

   If the first name you tried is not successful, select a different name for your new namespace and run the `az notification-hub namespace create` command again.

   > [!NOTE]
   > From this step forward you will need to replace the value of the `--namespace` parameter in each Azure CLI command you copy from this quickstart.

2. Get a list of namespaces.

   To see the details about your new namespace use the [az notification-hub namespace list](/cli/azure/ext/notification-hub/notification-hub/namespace?view=azure-cli-latest#ext-notification-hub-az-notification-hub-namespace-list) command.  The `--resource-group` parameter is optional if you want to see all namespaces for a subscription.

   ```azurecli
   az notification-hub namespace list --resource-group spnhubrg
   ```

## Create notification hubs

1. Create your first notification hub.

   One or more notification hubs can now be created in your new namespace.  Run the [az notification-hub create](/cli/azure/ext/notification-hub/notification-hub#ext-notification-hub-az-notification-hub-create) command to create a notification hub.

   ```azurecli
   az notification-hub create --resource-group spnhubrg --namespace-name spnhubns --name spfcmtutorial1nhub --location eastus --sku Free
   ```

2. Create a second notification hub.

   Multiple notification hubs can be created in a single namespace.  To create a second notification hub in the same namespace, run the `az notification-hub create` command again using a different hub name.

   ```azurecli
   az notification-hub create --resource-group spnhubrg --namespace-name spnhubns --name mysecondnhub --location eastus --sku Free
   ```

3. Get a list of notification hubs.

   Azure CLI returns either a success or error message with each executed command; however, being able to query for a list of notification hubs is reassuring.  The [az notification-hub list](/cli/azure/ext/notification-hub/notification-hub?view=azure-cli-latest#ext-notification-hub-az-notification-hub-list) command was designed for this purpose.

   ```azurecli
   az notification-hub list --resource-group spnhubrg --namespace-name spnhubns --output table
   ```

## Work with notification hub access policies

1. List access policies for a notification hub.

   Azure Notification Hubs uses [shared access signature security](/azure/notification-hubs/notification-hubs-push-notification-security) through the use of access policies.  Two policies are created automatically when you create a notification hub.  The connection strings from these policies are needed to configure push notifications.  The [az  notification-hub authorization-rule list](/cli/azure/ext/notification-hub/notification-hub/authorization-rule#ext-notification-hub-az-notification-hub-authorization-rule-list) command provides a list of policy names and their respective resource groups.

   ```azurecli
   az notification-hub authorization-rule list --resource-group spnhubrg --namespace-name spnhubns --notification-hub-name spfcmtutorial1nhub --output table
   ```

   > [!IMPORTANT]
   > Do not use the _DefaultFullSharedAccessSignature_ policy in your application. This is meant to be used in your back-end only.  Use only `Listen` access policies in your client application.

2. Create a new authorization-rule for a notification hub.

   If you wish to create additional authorization rules with meaningful names, you can create and customize your own access policy by using the [az notification-hub authorization-rule create](/cli/azure/ext/notification-hub/notification-hub/authorization-rule#ext-notification-hub-az-notification-hub-authorization-rule-create) command.  The `--rights` parameter is a space delimited list of the permissions you want to assign.

   ```azurecli
   az notification-hub authorization-rule create --resource-group spnhubrg --namespace-name spnhubns --notification-hub-name spfcmtutorial1nhub --name spnhub1key --rights Listen Manage Send
   ```

3. List keys and connection strings for a notification hub access policy

   There are two sets of keys and connection strings for each access policy.  You'll need them later to [configure a notification hub](/azure/notification-hubs/configure-notification-hub-portal-pns-settings).  To list the keys and connections strings for a notification hub access policy, use the [az notification-hub authorization-rule list-keys](/cli/azure/ext/notification-hub/notification-hub/authorization-rule#ext-notification-hub-az-notification-hub-authorization-rule-list-keys) command.

   ```azurecli
   #query the keys and connection strings for DefaultListenSharedAccessSignature
   az notification-hub authorization-rule list-keys --resource-group spnhubrg --namespace-name spnhubns --notification-hub-name spfcmtutorial1nhub --name DefaultListenSharedAccessSignature --output table
   ```

   ```azurecli
   #query the keys and connection strings for a custom policy
   az notification-hub authorization-rule list-keys --resource-group spnhubrg --namespace-name spnhubns --notification-hub-name spfcmtutorial1nhub --name spnhub1key --output table
   ```

   > [!NOTE]
   > A [notification hub namespace](/cli/azure/ext/notification-hub/notification-hub/namespace/authorization-rule#ext-notification-hub-az-notification-hub-namespace-authorization-rule-list-keys) and a [notification hub](/cli/azure/ext/notification-hub/notification-hub/authorization-rule#ext-notification-hub-az-notification-hub-authorization-rule-list-keys) have separate access policies.  Make sure you are using the correct Azure CLI reference when querying for keys and connection strings.

## Clean up resources

When no longer needed, use the [az group delete](/cli/azure/group) command to remove the resource group, and all related resources.

```azurecli
az group delete --name spnhubrg
```

## Next steps

* In this quickstart, you created a notification hub. To learn how to configure the hub with platform notification system (PNS) settings, see [Set up push notifications in a notification hub](configure-notification-hub-portal-pns-settings.md)

* Discover the extensive capabilities for managing notifications hubs with the Azure CLI.

  [Notification Hubs full reference list](/cli/azure/ext/notification-hub/notification-hub)

  [Notification Hubs namespace reference list](/cli/azure/ext/notification-hub/notification-hub/namespace)

  [Notification Hubs authorization rule reference list](/cli/azure/ext/notification-hub/notification-hub/authorization-rule)

  [Notification Hubs credential reference list](/cli/azure/ext/notification-hub/notification-hub/credential)
