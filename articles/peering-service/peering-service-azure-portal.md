---
title: Microsoft Azure Peering Service | Microsoft Docs
description: Learn about Microsoft Azure Peering Service
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2019
ms.author: v-meravi
---

# Register the Peering Service using the Azure portal

Peering Service is a networking service that improves internet access to Microsoft Public services such as Office 365, Dynamics 365, SaaS services running on Azure or any Microsoft services accessible via public IP Azure. In this article, you will learn how to register a Peering Service.

In this article, you will learn how to cerate a Peering Service connection.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

## Pre-requisites 

### Azure account

A valid and active Microsoft Azure account. This account is required to set up the Peering Service connection. Peering Services are resources within Azure subscriptions.  

### Connectivity provider

   - You can work with an Internet Service provider or Internet Exchange Partner to obtain Peering Service to connect your network with Microsoft network.

   - Ensure the connectivity providers are certified.

### Registering your subscription with the resource provider and feature flag

Before proceeding to the steps of registering the Peering Service, you need to register your subscription with the resource provider and feature flag.  

```PowerShellCopy
Register-AzProviderFeature-FeatureName AllowPeeringService ProviderNamespace Microsoft.Peering 

Register-AzResourceProvider -ProviderNamespace Microsoft.Peering 

```

## Sign into the Azure portal

From a browser, navigate to the Azure portal and sign in with your Azure account.

## Register the Peering Service connection

1. To register the Peering Service connection, click **Create a resource > Peering Service** as depicted below: 
 
2.	Clicking on the **Peering Service**  from the **Marketplace**  page, **Peering Service**  page appears as shown below:
 
3.	Next, click on the **Create button**  below the Peering Service. By doing so, Create a peering service connection page appears as depicted below:
 
4.	Click on the **Basics**  tab at the left top of the **Create a peering service connection**  page.
5.	Choose the **Subscription**  and the **Resource group** associated with the subscription as shown in the screen below:

>[!Note]
>Ensure existing resource group is chosen from the **Resource group** drop-down list, as Peering Service supports only existing ones.
>

6.	Next, provide a **Name** to which the Peering Service instance should be registered.
 
7.	Now, click on the **Next: Configuration**  button at the bottom. Doing so, Configuration page appears.

## Configure the Peering Service connection

1.	In the **Configuration**  page, choose the location to which the **Peering Service** must be enabled by from the **Peering service location** drop-down list.

2.	Now, choose the service provider from whom the Peering Service must be procured by choosing provider name from the **Peering service provider**  drop-down list.
 
3.	**Prefixes –** 
Clicking on the **Create new**  under Prefixes, text boxes appear. Now, provide **Name** of the prefix resource and the **Prefix** that is associated with the Service Provider.

4.	Provide a name to the prefix resource in the Name text box and provide the prefix range in the Prefixes text box that is associated with the service provider.
 
5.	Now, click on the **Review + create** button at the bottom right of the page. Doing so, **Review + create**  page appears as depicted below:
 
## Next steps

- In this article, you registered the Peering Service connection using Azure portal.

- To learn more about Peering Service concepts see [Peering Service Connection](peering-service-connection.md).

- To learn how to measure telemetry please refer [Measure connection telemetry](peering-service-measure-connection-telemetry.md).
