<properties
   pageTitle="Setting Up Named Authentication Credentials | Microsoft Azure"
   description="Learn how to to provide credentials that Visual Studio can use to authenticate requests to Azure to publish an application to Azure from Visual Studio or to monitor an existing cloud service.. "
   services="visual-studio-online"
   documentationCenter="na"
   authors="TomArcher"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="05/08/2016"
   ms.author="tarcher" />

# Setting Up Named Authentication Credentials

To publish an application to Azure from Visual Studio or to monitor an existing cloud service, you must provide credentials that Visual Studio can use to authenticate requests to Azure. There are several places in Visual Studio where you can sign in to provide these credentials. For example, from the Server Explorer, you can open the shortcut menu for the **Azure** node and choose **Connect to Azure**. When you sign in, the subscription information associated with your Azure account is available in Visual Studio, and there is nothing more you need to do.

Azure Tools also supports an older way of providing credentials, using the subscription file (.publishsettings file). This topic describes this method, which is still supported in Azure SDK 2.2.

The following items are required for authentication to Azure.

- Your subscription ID

- A valid X.509 v3 certificate

>[AZURE.NOTE] The length of the X.509 v3 certificate's key must be at least 2048 bits. Azure will reject any certificate that doesn’t meet this requirement or that isn’t valid.

Visual Studio uses your subscription ID together with the certificate data as credentials. The appropriate credentials are referenced in the subscription file (.publishsettings file), which contains a public key for the certificate. The subscription file can contain credentials for more than one subscription.

You can edit the subscription information from the **New/Edit Subscription** dialog box, as explained later in this topic.

If you want to create a certificate yourself, you can refer to the instructions in [Create and Upload a Management Certificate for Azure](https://msdn.microsoft.com/library/windowsazure/gg551722.aspx) and then manually upload the certificate to the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885).

>[AZURE.NOTE] These credentials that Visual Studio requires to manage your cloud services aren’t the same credentials that are required to authenticate a request against the Azure storage services.

## Modify or Export Authentication Credentials in Visual Studio

You can also set up, modify, or export your authentication credentials in the **New Subscription** dialog box, which appears if you perform either of the following actions:

- In **Server Explorer**, open the shortcut menu for the **Azure** node, choose **Manage Subscriptions**, choose the **Certificates** tab, and choose the **New** or **Edit** button.

- When you publish an Azure cloud service from the **Publish Azure Application** wizard, choose **Manage** in the **Choose your Subscription** list, then choose the Certificates tab, and then choose the **New** or **Edit** button.

The following procedure assumes that the **New Subscription** dialog box is open.

### To set up authentication credentials in Visual Studio

1. In the **Select an existing certificate** for authentication list, choose a certificate.

1. Choose the **Copy the full path** button.The path for the certificate (.cer file) is copied to the Clipboard.

    >[AZURE.IMPORTANT] To publish your Azure application from Visual Studio, you must upload this certificate to the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885).

1. To upload the certificate to the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885):

    1. Choose the Azure Portal link.

         The [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885) opens.

    1. Sign in to the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885), and then choose the **Cloud Services** button.

    1. Choose the cloud service that interests you.

        The page for the service opens.

    1. On the **Certificates** tab, choose the **Upload** button.

    1. Paste the full path of the .cer file that you just created, and then enter the password that you specified.
