---
title: Connect OneLake to an Azure NetApp Files volume using object REST API 
description: Learn how to create a OneLake shortcut to connect Azure NetApp Files to a unified data lake. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 10/13/2025
ms.author: anfdocs
---
# Connect OneLake to an Azure NetApp Files volume using object REST API 

With Azure NetApp Files object REST API, you can use [OneLake shortcuts](/fabric/onelake/onelake-shortcuts) to virtualize Azure NetApp Files into Microsoft Fabric's unified data lake. With this shortcut, Azure AI search can index and retrieve data directly from Azure NetApp Files for semantic search and vector-based retrieval with intelligent applications. 

Sensitive information is protected through Microsoft Virtual Networks and Azure NetApp Files robust security protocols when you create the OneLake shortcut. A virtual data lake design approach simplifies data sharing across Azure's Data and AI services, improving collaboration. 

## Before you begin 

- You must have created an [Azure NetApp Files object REST API-enabled volume](object-rest-api-access-configure.md).
- You must install and configure an [on-premises data gateway](/data-integration/gateway/service-gateway-install#download-and-install-a-standard-gateway) on a virtual machine with network access to your Azure NetApp Files bucket endpoint.

>[!NOTE]
>When you install the data gateway, ensure you're using an [up-to-date release](/data-integration/gateway/service-gateway-install). 

## Connect to OneLake

1. Create a workspace in [OneLake](/fabric/onelake/create-lakehouse-onelake).
1. In OneLake, right-click the workspace then select 
**Create new lakehouse**.
1. After the lakehouse is successfully created, select **New shortcut**. Follow the instructions to [Create a OneLake shortcut](/fabric/onelake/create-onelake-shortcut). 

    The endpoint must be a URL with the volume's IP address, for example `http://0.0.0.0` or a fully qualified domain name, such as https://myanfendpoint.contoso.com.
1. Select your on-premises data gateway in the **Data Gateway** field. After you provide the access key and secret key, the Azure NetApp Files data appears in your OneLake workspace.


##  Connect to Azure AI Search

After connecting to OneLake, you can connect a volume to [Azure AI Search](/azure/search/search-what-is-azure-search) to create a search service. For additional information, see [How to index OneLake files](/azure/search/search-how-to-index-onelake-files).

## More information 

* [Understand object REST API](object-rest-api-introduction.md)
* [Configure object REST API in Azure NetApp Files](object-rest-api-access-configure.md)
* [OneLake shortcuts](/fabric/onelake/onelake-shortcuts)
* [What is an on-premises data gateway?](/data-integration/gateway/service-gateway-onprem)