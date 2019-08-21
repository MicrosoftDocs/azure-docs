--- 
title: Azure VMware Solution by CloudSimple - Register the CloudSimple resource provider on your Azure subscription
description: Describes how to enable the CloudSimple service on an Azure subscription and then register the CloudSimple resource provider
author: sharaths-cs
ms.author: b-shsury 
ms.date: 8/22/3019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Register the CloudSimple resource provider on your Azure subscription

The CloudSimple service allows you to consume Azure VMware Solution by CloudSimple. You can register the `Microsoft.VMwareCloudSimple` service as your resource provider.

## Register the resource provider

After the CloudSimple service is enabled for your subscription, you can enable the resource provider on the subscription. In the Azure portal, select the service and then select the Microsoft.VMwareCloudSimple resource provider and register it.

1. Sign in to the [Azure portal](http://portal.azure.com).
2. Select **All services**.
3. Search for and select **subscriptions**.
    ![Select subscriptions](media/cloudsimple-service-select-subscriptions.png)
4. Select the subscription on which you want to enable the CloudSimple service.
5. Click **Resource providers** for the subscription.
6. Use **Microsoft.VMwareCloudSimple** to filter the resource provider.
7. Select **Microsoft.VMwareCloudSimple** and click **Register**.
    ![Register resource provider](media/cloudsimple-service-enable-resource-provider.png)
