---
title: Get data from Azure Analysis Services | Microsoft Docs
description: Learn how to connect to and get data from an Analysis Services server in Azure.
services: analysis-services
documentationcenter: ''
author: minewiskan
manager: erikre
editor: ''
tags: ''

ms.assetid: b37f70a0-9166-4173-932d-935d769539d1
ms.service: analysis-services
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: na
ms.date: 02/13/2017
ms.author: owend

---
# Get data from Azure Analysis Services

Once you've created a server in Azure, and deployed a tabular model to it, users in your organization are ready to connect and begin exploring data.

## Data providers (aka client libraries)

Client applications such as Power BI Desktop and Microsoft Excel use updated AMO, ADOMD.NET, and OLEDB providers to connect to and interface with Analysis Services. With some older versions of Excel or custom applications, you may need to install the latest data providers to connect to Azure Analysis Services. To learn more, see [Data providers](analysis-services-data-providers.md).

## Server name

When you create an Analysis Services server in Azure, you specify a unique name and the region where the server is to be created. When specifying the server name in a connection, the server naming scheme is:

```
<protocol>://<region>/<servername>
```
 Where protocol is string **asazure**, the region is the Uri of the region where the server was created (for example, for West US, westus.asazure.windows.net) and servername is the name of your unique server within the region.

## Get the server name

Before you connect, you need to get the server name. In **Azure portal** > server > **Overview** > **Server name**, copy the entire server name. If other users in your organization are connecting to this server too, you can share this server name with them. When specifying a server name, the entire path must be used.

![Get server name in Azure](./media/analysis-services-deploy/aas-deploy-get-server-name.png)

## Connect in Power BI Desktop

> [!NOTE]
> This feature is Preview.
> 
> 

1. In [Power BI Desktop](https://powerbi.microsoft.com/desktop/), click **Get Data** > **Azure** > **Microsoft Azure Analysis Services database**.
2. In **Server**, paste the server name from the clipboard.
3. In **Database**, if you know the name of the tabular model database or perspective you want to connect to, paste it here. Otherwise, you can leave this field blank. You can select a database or perspective on the next screen.
4. Leave the default **Connect live** option selected, then press **Connect**. If you're prompted to enter an account, enter your organizational account.
5. In **Navigator**, expand the server, then select the model or perspective you want to connect to, then click **Connect**. A click on a model or perspective shows all the objects for that view.

## Connect in Power BI

1. Create a Power BI Desktop file that has a live connection to your model on your server.
2. In [Power BI](https://powerbi.microsoft.com), click **Get Data** > **Files**. Locate and select your file.

## Connect in Excel

Connecting to Azure Analysis Services server in Excel is supported by using Get Data in Excel 2016 or Power Query in earlier versions. [MSOLAP.7 provider](analysis-services-data-providers.md) is required. Connecting by using the Import Table Wizard in Power Pivot is not supported.

> [!NOTE]
> Some organizations deploy Office 365 updates on the Deferred Channel; meaning version updates are delayed up to four months from the current version. For Excel 2016 version 1609.7369.2115 and earlier, or Excel 2013, you can create an .odc file and manually update the MSOLAP.7 provider to connect to a server. To learn more, see [Create an .odc file](analysis-services-odc.md).
> 
> 

**To connect from Excel 2016**

1. In Excel 2016, on the **Data** ribbon, click **Get External Data** > **From Other Sources** > **From Analysis Services**.
2. In the Data Connection Wizard, in **Server name**, paste the server name from the clipboard. Then, in **Logon credentials**, select **Use the following User Name and Password**, and then type the organizational user name, for example nancy@adventureworks.com, and password.

    ![Connect in Excel logon](./media/analysis-services-connect/aas-connect-excel-logon.png)
3. In **Select Database and Table**, select the database and model or perspective, and then click **Finish**.
   
    ![Connect in Excel select model](./media/analysis-services-connect/aas-connect-excel-select.png)

## Connection string

When connecting to Azure Analysis Services using the Tabular Object Model, use the following connection string formats:

###### Integrated Azure Active Directory authentication

```
"Provider=MSOLAP;Data Source=<Azure AS instance name>;"
```
Integrated authentication picks up the Azure Active Directory credential cache if available. If not, the Azure login window is shown.

###### Azure Active Directory authentication with username and password

```
"Provider=MSOLAP;Data Source=<Azure AS instance name>;User ID=<user name>;Password=<password>;Persist Security Info=True; Impersonation Level=Impersonate;";
```

## Next steps

[Manage your server](analysis-services-manage.md)

