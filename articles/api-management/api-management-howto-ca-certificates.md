---
title: Secure back-end services using CA certificate authentication - Azure API Management | Microsoft Docs
description: Learn how to secure back-end services using CA certificate authentication in Azure API Management.
services: api-management
documentationcenter: ''
author: mikebudzynski
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/20/2018
ms.author: apimpm
---

# How to secure back-end services using CA certificate authentication in Azure API Management

Azure API Management allows installing CA certificates on the machine inside the trusted root and intermediate stores. This functionality should be used if your services require a custom CA certificate, for example to secure the back-end service.

The article shows how to manage CA certificates of an Azure API Management service instance in the Azure portal.

## <a name="step1"> </a>Upload a CA certificate

![Add CA certificates](media/api-management-howto-ca-certificates/00.png)

Follow the steps below to upload a new CA certificate. If you have not created an API Management service instance yet, see the tutorial [Create an API Management service instance](get-started-create-service-instance.md).

1. Navigate to your Azure API Management service instance in the Azure portal.

2. Select **CA certificates** from the menu.

3. Click the **+ Add** button.  

    ![Add CA certificates](media/api-management-howto-ca-certificates/01.png)  

4. Browse for the certificate and decide on the certificate store. If needed, provide the password.

    ![Add CA certificates](media/api-management-howto-ca-certificates/02.png)  

5. Click **Save**. This operation may take a few minutes.

    ![Add CA certificates](media/api-management-howto-ca-certificates/03.png)  

> [!NOTE]
> You can upload a CA certificate using the `New-AzureRmApiManagementSystemCertificate` Powershell command.

## <a name="step1a"> </a>Delete a client certificate

To delete a certificate, click context menu **...** and select **Delete** beside the certificate.

![Delete CA certificates](media/api-management-howto-ca-certificates/04.png)  

[Upload a CA certificate]: #step1
[Delete a CA certificate]: #step1a