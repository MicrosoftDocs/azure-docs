---
title: Accessing private Azure clouds with Visual Studio | Microsoft Docs
description: Learn how to access private cloud resources by using Visual Studio.
services: visual-studio-online
author: ghogen
manager: douge
assetId: 9d733c8d-703b-44e7-a210-bb75874c45c8
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 11/13/2017
ms.author: ghogen

---
# Accessing private Azure clouds with Visual Studio

By default, Visual Studio supports Azure cloud REST endpoints. In this article, you learn how to use your private cloud's certificate to access and interact with the private cloud from Visual Studio.

1. In the Azure portal for the private cloud, download your publish-settings file, or contact your administrator for a publish-settings file. (The file has the extension `.publishsettings`.)

1. In Visual Studio **Server Explorer**, right-click the **Azure** node and select **Manage and Filter Subscriptions**.

    ![Manage subscriptions command](./media/vs-azure-tools-access-private-azure-clouds-with-visual-studio/IC790778.png)

1. In the **Manage Microsoft Azure Subscriptions** dialog, select the **Certificates** tab, then select **Import**.

    ![Importing Azure certificates](./media/vs-azure-tools-access-private-azure-clouds-with-visual-studio/IC790779.png)

1. In the **Import Microsoft Azure Subscriptions** dialog, select **Browse**.

    ![Browse button on the Import Microsoft Azure Subscriptions dialog](./media/vs-azure-tools-access-private-azure-clouds-with-visual-studio/browse-button.png)

1. In the **Open** dialog, browse to the directory where you saved the publish-settings file, select the file, and then select **Open**.

    ![Select the publish-settings file](./media/vs-azure-tools-access-private-azure-clouds-with-visual-studio/select-publish-settings-file.png)

1. When returned to the **Import Microsoft Azure Subscriptions** dialog, select **Import**.

    ![Import the publish-settings file](./media/vs-azure-tools-access-private-azure-clouds-with-visual-studio/IC790780.png)

    The certificates are imported from the publish-settings file into Visual Studio, and you can now interact with your private cloud resources.

