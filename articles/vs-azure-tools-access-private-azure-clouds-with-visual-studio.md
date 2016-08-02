<properties 
   pageTitle="Accessing private Azure clouds with Visual Studio | Microsoft Azure"
   description="Learn how to access private cloud resources by using Visual Studio."
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

# Accessing private Azure clouds with Visual Studio

##Overview

By default, Visual Studio supports public Azure cloud REST endpoints. This can be a problem, though, if you're using Visual Studio with a private Azure cloud. You can use certificates to configure Visual Studio to access private Azure cloud REST endpoints. You can get these certificates through your Azure publish settings file.

## To access a private Azure cloud in Visual Studio

1. In the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885) for the private cloud, download your publish settings file, or contact your administrator for a publish settings file. On the public version of Azure, the link to download this is [https://manage.windowsazure.com/publishsettings/](https://manage.windowsazure.com/publishsettings/). (The file you download should have a .publishsettings extension.)

1. In **Server Explorer** in Visual Studio, choose the **Azure** node and, on the shortcut menu, choose the **Manage Subscriptions** command.

    ![Manage subscriptions command](./media/vs-azure-tools-access-private-azure-clouds-with-visual-studio/IC790778.png)

1. In the **Manage Microsoft Azure Subscriptions** dialog box, choose the **Certificates** tab, and then choose the **Import** button.

    ![Importing Azure certificates](./media/vs-azure-tools-access-private-azure-clouds-with-visual-studio/IC790779.png)

1. In the **Import Microsoft Azure Subscriptions** dialog box, browse to the folder where you saved the publish settings file and choose the file, then choose the **Import** button. This imports the certificates in the publish settings file into Visual Studio. You should now be able to interact with your private cloud resources.

    ![Importing publish settings](./media/vs-azure-tools-access-private-azure-clouds-with-visual-studio/IC790780.png)

## Next steps

[Publishing to an Azure Cloud Service from Visual Studio](https://msdn.microsoft.com/library/azure/ee460772.aspx)

[How to: Download and Import Publish Settings and Subscription Information](https://msdn.microsoft.com/library/dn385850(v=nav.70).aspx)

