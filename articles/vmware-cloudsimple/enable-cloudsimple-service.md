--- 
title: Enable Azure VMware Solution by CloudSimple service
description: Describes how to enable the CloudSimple service on an Azure subscription and then register the CLoudSimple resource provider
author: sharaths-cs
ms.author: b-shsury 
ms.date: 06/04/2019 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---

# Register the Microsoft.VMwareCloudSimple resource provider on your Azure subscription

The CloudSimple service allows you to consume Azure VMware Solution by CloudSimple. To use the CloudSimple service, it must first be enabled on your Azure subscription. You can then register the Microsoft.VMwareCloudSimple service as your resource provider.

## Enable the CloudSimple service

To enable the CloudSimple service on your Azure subscription, open a support request with [Microsoft support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Select the following options when you submit the request.

* Issue type: **Technical**
* Subscription: **Your subscription ID**
* Service type: **VMware Solution by CloudSimple**
* Problem type: **Dedicated Nodes quota**
* Problem subtype: **Increase quota of dedicated nodes**
* Subject: **Enable CloudSimple service**

You can also contact your Microsoft account representative at [azurevmwaresales@microsoft.com](mailto:azurevmwaresales@microsoft.com). Provide your Azure subscription ID in the email.  

After the CloudSimple service is enabled for your subscription, you can enable the resource provider on the subscription.

## Register the resource provider

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **All services**.

3. Search for and select **subscriptions**.

    ![Select subscriptions](media/cloudsimple-service-select-subscriptions.png)

4. Select the subscription on which you want to enable CloudSimple service.

5. Click **Resource providers** for the subscription.

6. Use **Microsoft.VMwareCloudSimple** to filter the resource provider.

7. Select the resource provider and click **Register**.

    ![Register resource provider](media/cloudsimple-service-enable-resource-provider.png)

## Next steps

* Learn how to [Create a CloudSimple service](create-cloudsimple-service.md)
* Learn how to [Configure a private cloud environment](quickstart-create-private-cloud.md)