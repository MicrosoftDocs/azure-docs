---
title: Setting Up Named Authentication Credentials | Microsoft Docs
description: 'Learn how to to provide credentials that Visual Studio can use to authenticate requests to Azure to publish an application to Azure from Visual Studio or to monitor an existing cloud service.. '
services: visual-studio-online
documentationcenter: na
author: kraigb
manager: ghogen
editor: ''

ms.assetid: 61570907-42a1-40e8-bcd6-952b21a55786
ms.service: multiple
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 8/22/2017
ms.author: kraigb

---
# Setting Up Named Authentication Credentials
To publish an application to Azure from Visual Studio or to monitor an existing cloud service, you must provide credentials that Visual Studio can use to authenticate requests to Azure. There are several places in Visual Studio where you can sign in to provide these credentials. For example, from the Server Explorer, you can open the shortcut menu for the **Azure** node and choose **Connect to Microsoft Azure Subscription...**. When you sign in, the subscription information associated with your Azure account is available in Visual Studio, and there is nothing more you have to do.

Azure Tools also supports an older way of providing credentials, using the subscription file (.publishsettings file). This topic describes this method, which is still supported in Azure SDK 2.2.

The following items are required for authentication to Azure:

* Your subscription ID
* A valid X.509 v3 certificate

> [!NOTE]
> The length of the X.509 v3 certificate's key must be at least 2048 bits. Azure will reject any certificate that doesn’t meet this requirement or that isn’t valid.
>
>

Visual Studio uses your subscription ID together with the certificate data as credentials. The appropriate credentials are referenced in the subscription file (.publishsettings file), which contains a public key for the certificate. The subscription file can contain credentials for more than one subscription.

You can edit the subscription information from the **New/Edit Subscription** dialog box, as explained later in this topic.

If you want to create a certificate yourself, you can refer to the instructions in [Create and Upload a Management Certificate for Azure](https://msdn.microsoft.com/library/windowsazure/gg551722.aspx) and then manually upload the certificate to the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885).

> [!NOTE]
> These credentials that Visual Studio requires to manage your cloud services aren’t the same credentials that are required to authenticate a request against the Azure storage services.
>
>

## Import, set up, or edit authentication credentials in Visual Studio
You can import, set up, or modify your authentication credentials in the **New Subscription** dialog box, which appears if you perform the following action:

* In **Server Explorer**, open the shortcut menu for the **Azure** node, choose **Manage and Filter Subscriptions...**, choose the **Certificates** tab, and do one of the following:

    * Choose **Import** to open the Import Microsoft Azure Subscriptions dialog where you can download the  subscriptions file for the currently loaded subscription, browse to its download location, and then import it for use in authentication.
    * Choose **New** to open the New Subscription dialog where you can set up a new subscription for use in authentication.
    * Choose **Edit** (after choosing your active subscription) to open the Edit Subscription dialog where you can edit an existing subscription for use in authentication. 

The following procedure assumes that the **New Subscription** dialog box is open.

### To set up authentication credentials in Visual Studio
1. In the **Select an existing certificate** for authentication list, choose a certificate.
2. Choose the **Copy the full path** link. The path for the certificate (.cer file) is copied to the Clipboard.

   > [!IMPORTANT]
   > To publish your Azure application from Visual Studio, you must upload this certificate to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
   >
   >
3. To upload the certificate to the Azure portal:

   1. Open the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
   2. If prompted, sign in to the portal and then navigate to **Settings**, **Management Certificates**.
   3. In the Management certificates pane, choose **Upload**.
   4. Select your Azure subscription, paste the full path of the .cer file that you just created, and choose **Upload**.
