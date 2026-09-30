---
title: include file
description: include file
services: private-link
author: mbender
ms.service: azure-private-link
ms.topic: include
ms.date: 07/09/2026
ms.author: mbender-ms
ms.custom: include file
---

To get started, sign in to [Azure Cloud Shell](https://shell.azure.com) or use your local CLI environment.

1. If you're using Azure Cloud Shell, sign in and select your subscription.
1. If you installed CLI locally, sign in by using the following command: 

    ```azurecli-interactive
    # Sign in to your Azure account
    az login 
    ```

1. Once in your shell, select your active subscription locally by using the following command: 

    ```azurecli-interactive
    # List all subscriptions
    az account set --subscription <Azure Subscription>

    # Re-register the Microsoft.Network resource provider
    az provider register --namespace Microsoft.Network    
    ```