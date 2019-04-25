---
title: Upload an Azure Service Management Certificate | Microsoft Docs
description: Learn how to upload the Service Management certificate for the Azure portal.
services: cloud-services
documentationcenter: .net
author: jpconnock
manager: timlt
editor: ''

ms.assetid: 1b813833-39c8-46be-8666-fd0960cfbf04
ms.service: api-management
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/01/2017
ms.author: jeconnoc

---
# Upload an Azure Service Management Certificate
Management certificates allow you to authenticate with the classic deployment model provided by Azure. Many programs and tools (such as Visual Studio or the Azure SDK) use these certificates to automate configuration and deployment of various Azure services. 

> [!WARNING]
> Be careful! These types of certificates allow anyone who authenticates with them to manage the subscription they are associated with.
>
>

If you'd like more information about Azure certificates (including creating a self-signed certificate), see [Certificates overview for Azure Cloud Services](cloud-services/cloud-services-certs-create.md#what-are-management-certificates).

You can also use [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) to authenticate client-code for automation purposes.

**Note:** You must be a Co-administrator on the subscription to perform any operations under Management Certificates. [Learn More](https://go.microsoft.com/fwlink/?linkid=849300) on how to Add or Remove Co-Admins from new Azure Portal 

## Upload a management certificate
Once you have a management certificate created, (.cer file with only the public key) you can upload it into the portal. When the certificate is available in the portal, anyone with a matching certificate (private key) can connect through the Management API and access the resources for the associated subscription.

1. Log in to the [Azure portal](https://portal.azure.com).
2. Click **All services** at the bottom Azure service list, then select **Subscriptions** in the _General_ service group.

    ![Subscription menu](./media/azure-api-management-certs/subscriptions_menu.png)

3. Make sure to select the correct subscription that you want to associate with the certificate.     
4. After you have selected the correct subscription, press **Management certificates** in the _Settings_ group.

    ![Settings](./media/azure-api-management-certs/mgmtcerts_menu.png)

5. Press the **Upload** button.

    ![Upload on certificates page](./media/azure-api-management-certs/certificates_page.png)
6. Fill out the dialog information and press **Upload**.

    ![Settings](./media/azure-api-management-certs/certificate_details.png)

## Next steps
Now that you have a management certificate associated with a subscription, you can (after you have installed the matching certificate locally) programmatically connect to the [classic deployment model REST API](/azure/#pivot=sdkstools) and automate the various Azure resources that are also associated with that subscription.
