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
ms.date: 03/17/2020
ms.author: dbradish
ms.reviewer: sethm
ms.lastreviewed: 03/18/2020
---

# Quickstart: Create an Azure notification hub using the Azure CLI

Azure Notification Hubs provide an easy-to-use and scaled-out push engine that allows you to send notifications to any platform (iOS, Android, Windows, Kindle, Baidu, etc.) from any backend (cloud or on-premises). For more information about the service, see [What is Azure Notification Hubs?](notification-hubs-push-notification-overview.md).

In this quickstart, you create a notification hub using the Azure CLI. The first section gives you steps to create a notification hub namespace, and query access policy information for that namespace. The second section gives you steps to create a notification hub in an existing namespace.  You also learn how to create a custom access policy.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

Notification Hubs requires version 2.0.67 or later of the Azure CLI. Run `az --version` to find the version and dependent libraries that are installed. To install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Prepare your environment

1. Sign in.

   Sign in using the [az login](/cli/azure/reference-index#az-login) command if you're using a local install of the CLI.

    ```azurecli-interactive
    az login
    ```

    Follow the steps displayed in your terminal to complete the authentication process.

2. Install the Azure CLI extension.

   To run the Azure CLI commands for notification hubs, install the Azure CLI [extension for Notification Hubs](/cli/azure/ext/notification-hub/notification-hub).  

    ```azurecli-interactive
    az extension add --name notification-hub
   ```

3. Create a resource group.

   Azure notification hubs, like all Azure resources, must be deployed into a resource group. Resource groups allow you to organize and manage related Azure resources.

   For this quickstart, create a resource group named *spnhubrg* in the *eastus* location with the following [az group create](/cli/azure/group#az-group-create) command:

   ```azurecli-interactive
   az group create --name spnhubrg --location eastus
   ```

## Create a notification hub namespace

1. Create a namespace for your notification hubs

   A namespace contains one or more hubs, and the name must be unique across all Azure subscriptions.  To check the availability of the given service namespace, use the [az notification-hub namespace check-availability](/cli/azure/ext/notification-hub/notification-hub/namespace#ext-notification-hub-az-notification-hub-namespace-check-availability) command.  Run the [az notification-hub namespace create](/cli/azure/ext/notification-hub/notification-hub/namespace#ext-notification-hub-az-notification-hub-namespace-create) command to create a namespace.  

   ```azurecli-interactive
   #check availability
   az notification-hub namespace check-availability --name spnhubns

   #create the namespace
   az notification-hub namespace create --resource-group spnhubrg --name spnhubns  --location eastus --sku Free
   ```

2. List keys and connection strings for your namespace access policy.

   An access policy named **RootManageSharedAccessKey** is automatically created for a new namespace.  Every access policy has two sets of keys and connection strings.  To list the keys and connection strings for the namespace, run the [az notification-hub namespace authorization-rule list-keys](/cli/azure/ext/notification-hub/notification-hub/authorization-rule#ext-notification-hub-az-notification-hub-authorization-rule-list-keys) command.

   ```azurecli-interactive
   az notification-hub namespace authorization-rule list-keys --resource-group spnhubrg --namespace-name spnhubns --name RootManageSharedAccessKey
   ```

## Create notification hubs

1. Create your first notification hub.

   A notification hub can now be created in the new namespace.  Run the [az notification-hub create](/cli/azure/ext/notification-hub/notification-hub#ext-notification-hub-az-notification-hub-create) command to create a notification hub.

   ```azurecli-interactive
   az notification-hub create --resource-group spnhubrg --namespace-name spnhubns --name spfcmtutorial1nhub --location eastus --sku Free
   ```

2. Create a second notification hub.

   Multiple notification hubs can be created in a single namespace.  To create a second notification hub in the same namespace, run the `az notification-hub create` command again using a different hub name.

   ```azurecli-interactive
   az notification-hub create --resource-group spnhubrg --namespace-name spnhubns --name mysecondnhub --location eastus --sku Free
   ```

## Work with access policies

1. Create a new authorization-rule for a notification hub.

   An access policy is automatically created for each new notification hub.  To create and customize your own access policy, use the [az notification-hub authorization-rule create](/cli/azure/ext/notification-hub/notification-hub/authorization-rule#ext-notification-hub-az-notification-hub-authorization-rule-create) command.

   ```azurecli-interactive
   az notification-hub authorization-rule create --resource-group spnhubrg --namespace-name spnhubns --notification-hub-name spfcmtutorial1nhub --name spnhub1key --rights Listen Send
   ```

2. List access policies for a notification hub.

   To query what access policies exist for a notification hub, use the [az  notification-hub authorization-rule list](/cli/azure/ext/notification-hub/notification-hub/authorization-rule#ext-notification-hub-az-notification-hub-authorization-rule-list) command.

   ```azurecli-interactive
   az notification-hub authorization-rule list --resource-group spnhubrg --namespace-name spnhubns --notification-hub-name spfcmtutorial1nhub --output table
   ```

   > [!IMPORTANT]
   > Do not use the **DefaultFullSharedAccessSignature** policy in your application. This is meant to be used in your back-end only.  Use only **Listen** access policies in your client application.

3. List keys and connection strings for a notification hub access policy

   There are two sets of keys and connection strings for each access policy.  You'll need them later to handle push notifications.  To list the keys and connections strings for a notification hub access policy, use the [az notification-hub authorization-rule list-keys](/cli/azure/ext/notification-hub/notification-hub/authorization-rule#ext-notification-hub-az-notification-hub-authorization-rule-list-keys) command.

   ```azurecli-interactive
   #query the keys and connection strings for DefaultListenSharedAccessSignature
   az notification-hub authorization-rule list-keys --resource-group spnhubrg --namespace-name spnhubns --notification-hub-name spfcmtutorial1nhub --name DefaultListenSharedAccessSignature --output json

   #query the keys and connection strings for the custom policy
   az notification-hub authorization-rule list-keys --resource-group spnhubrg --namespace-name spnhubns --notification-hub-name spfcmtutorial1nhub --name spnhub1key --output table
   ```

   > [!NOTE]
   > A [notification hub namespace](/cli/azure/ext/notification-hub/notification-hub/namespace/authorization-rule#ext-notification-hub-az-notification-hub-namespace-authorization-rule-list-keys) and a [notification hub](/cli/azure/ext/notification-hub/notification-hub/authorization-rule#ext-notification-hub-az-notification-hub-authorization-rule-list-keys) have separate access policies.  Make sure you are using the correct Azure CLI reference when querying for keys and connection strings.

## Clean up resources

When no longer needed, use the [az group delete](/cli/azure/group) command to remove the resource group, and all related resources.

```azurecli-interactive
az group delete --name spnhubrg
```

## See also

Discover full capabilities for managing notifications hubs with the Azure CLI.

* [Notification Hubs full Azure CLI reference list](/cli/azure/ext/notification-hub/notification-hub)
* [Notification Hubs namespace Azure CLI reference list](/cli/azure/ext/notification-hub/notification-hub/namespace)
* [Notification Hubs authorization rule Azure CLI reference list](/cli/azure/ext/notification-hub/notification-hub/authorization-rule)
* [Notification Hubs credential Azure CLI reference list](/cli/azure/ext/notification-hub/notification-hub/credential)
