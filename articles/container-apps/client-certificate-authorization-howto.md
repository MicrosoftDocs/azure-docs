---
title: Configure client certificate authorization in Azure Container Apps
description: Configure client certificate authorization in Azure Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: how-to
ms.date: 02/15/2023
ms.author: v-bcatherine
---

# Configure client certificate authorization in Azure Container Apps

Azure Container Apps allows you to restrict access to your container app by requiring a client certificate. This is useful for scenarios where you want to ensure that only authorized users can access your container app. For example, you might want to require a client certificate for a container app that is used to manage sensitive data.

This article shows you how to configure client certificate authorization in Azure Container Apps.

>[!NOTE]
> Client certificate authorization is only supported in Container Apps environments that use a [custom VNET](vnet-custom.md).


>[!NOTE]
> Question:  Is this the same certificates referenced in the custom-domains-certificates-howto.md article?  If so, we should probably link to that article from here.
> Question:  Are certificates available in the consumption tier?  Any other limitations?  
> Question: Are certificates configurable at both the container app and environment level?  If so, we should probably mention that here.

## Configure client certificate authorization

You can configure client certificate authorization for your container app in the Azure portal or by using the Azure CLI.

#[Azure portal](#tab/azure-portal)

To configure client certificate authorization in the Azure portal, follow these steps:

1. In the Azure portal, go to your container app.
1. Select **Networking**.
1. ???


#[Azure CLI](#tab/azure-cli)
  


