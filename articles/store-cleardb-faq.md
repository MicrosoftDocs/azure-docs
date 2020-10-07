---
title: FAQ for ClearDB MySql databases with Azure App Service
description: Answers to common questions about using ClearDB MySQL databases with Azure App Service.
documentationcenter: php
services: mysql
author: sunbuild
manager: yochayk
tags: mysql
ms.service: multiple
ms.topic: article
ms.date: 10/27/2016
ms.author: sumuth
ROBOTS: NOINDEX,NOFOLLOW
ms.custom: references_regions
---
# FAQ for ClearDB MySql databases with Azure App Service
This FAQ answers common questions about using and purchasing ClearDB MySQL databases for Azure Web Apps.

> [!IMPORTANT]
> As of June 13, 2018, ClearDB transitioned Azure-based customers currently billed by Microsoft to a direct billing model with ClearDB. The information in this article is now out of date. You will no longer be able to create or upgrade a ClearDB database that was created in Azure.
>
> For more details and next steps, see [Changes to ClearDB service plans](https://w2.cleardb.net/important-change-of-billing-notice-for-all-azure-cleardb-service-plans/).

## What options do I have for MySQL on Azure?
See [ClearDB](https://w2.cleardb.net/) for the latest information on that service. ClearDB is a MySQL hosting service and manages the MySQL infrastructure for you. 

You have several other options for hosting MySQL in Azure:
* [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/)
* [MySQL cluster running on an Azure VM](https://github.com/azure/azure-quickstart-templates/tree/master/mysql-replication)
* [Single instance of MySQL running on an Azure VM](virtual-machines/windows/classic/mysql-2008r2.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)


## Do I need a credit card for the Web app + MySQL template in the Azure Marketplace?
This depends on the type of subscription you are using. Here are some commonly used subscription types:

* [Pay as you Go](https://azure.microsoft.com/offers/ms-azr-0003p/): Requires a credit card, and when you purchase a paid MySQL database your credit card is charged.
* [Free trial](https://azure.microsoft.com/pricing/free-trial/): Includes credits for use with Microsoft Azure services but doesn't allow purchase of third-party resources. To purchase third-party services or a paid MySQL database you need to use a credit card enabled subscription. For Web Apps, you can create a FREE ClearDB MySQL database.
* [MSDN subscription](https://azure.microsoft.com/pricing/member-offers/msdn-benefits/) and **MSDN Dev Test Pay as you go**: Similar to Free trial, an MSDN subscription requires you to have a credit card to purchase a paid MySQL solution from ClearDB.
* [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/): EA customers are billed against their EA each quarter for all of their Azure Marketplace (third-party) purchases on a separate, consolidated invoice. You are billed outside the monetary commitment for any marketplace purchases. Please note that, at this time, Azure Store is not available to customers enrolled in Azerbaijan, Croatia, Norway and Puerto Rico. 

## Why was I charged $3.50 for a Web app + MySQL from the Azure Marketplace?
The default database option is Titan, which is $3.50. We don’t show the cost during database creation, and you may mistakenly purchase a database you didn’t intend to. We are trying to find a way to improve the experience but until then you must check all your selected pricing tiers for web app and database before clicking **Create** and starting the deployment of the resources.

## I am running MySQL on my own Azure virtual machine. Can I connect my Azure web app to my database?
Yes. You can connect your web app to your database as long as your Azure VM has given remote access to your web app. For more information, see [Install MySQL on a virtual machine](virtual-machines/windows/classic/mysql-2008r2.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

## In which countries/regions are ClearDB Premium MySQL clusters supported?
ClearDB Premium MySQL clusters are available in all Azure regions worldwide with the exception of India, Australia, Brazil South, and China.

## Can I create a new cluster prior to creating a database with ClearDB premium cluster solution?
No, creating empty ClearDB clusters is not supported. The Azure portal allows you to create databases in a cluster, which may create a new cluster at the same time.

## Will I be warned if I try to delete a ClearDB MySQL database that is in use by one of my applications?
No, Azure will not warn you if you delete a marketplace purchase that your application depends on.

## Which regions can I create ClearDB databases in?
Azure Marketplace is not available to customers enrolled in Azerbaijan, Croatia, Norway or Puerto Rico. ClearDB is not available in these regions.

## What pricing tier should I choose for a production web app and database?
Use Basic or a higher pricing tier for Web Apps. For ClearDB, we recommend either a Saturn or Jupiter plan. Review the features & limitations of each pricing tier for both [Web Apps](https://azure.microsoft.com/pricing/details/app-service/) and [ClearDB MySQL databases](https://w2.cleardb.net/important-change-of-billing-notice-for-all-azure-cleardb-service-plans/) to choose the one that fits your needs.

## How do I upgrade my ClearDB database from one plan to another?
In the [Azure portal](https://portal.azure.com), you can scale up a ClearDB shared hosting database. Read this [article](https://blogs.msdn.microsoft.com/appserviceteam/2016/10/06/upgrade-your-cleardb-mysql-database-in-azure-portal/) to learn more. We currently don't support upgrade for ClearDB Premium clusters in the Azure portal.

## I can’t see my ClearDB database in Azure portal?
If you created a ClearDB database in classic, you will not be able to see your database in the [Azure portal](https://portal.azure.com). There is no work-around for this scenario.

## Who do I contact for support when my database is down?
Contact [ClearDB support](https://www.cleardb.com/developers/help/support) for any database related issues. Be prepared to provide them with your Azure subscription information.

## Can I create additional users for my ClearDB MySQL database cluster solution?
No. You cannot create additional users but you can create additional databases on your ClearDB database cluster.  

## Can Basic/Pro series databases be upgraded in-place similar to Planetary plans today on ClearDB portal?
Yes, Basic series databases can be upgraded in-place (Basic 60 through Basic 500). Pro series can be upgraded in-place (Pro 125 through Pro 1000) except for Pro 60. We do not support upgrading Pro 60 database currently. 

## When I migrate my resources from one subscription to another, does my ClearDB MySQL database get migrated as well?
When you perform resource migration across subscriptions, some [limitations](azure-resource-manager/management/move-support-resources.md) apply. A ClearDB MySQL database is a third-party service and hence does not get migrated during Azure subscription migration. If you do not manage the migration of your MySQL database prior to migrating Azure resources, your ClearDB MySQL databases can be disabled. Manually migrate your databases first and then perform Azure subscription migration for your web app. 

## I hit the spending limit on my subscription. I removed the limit and my App Service is online, however the database is not accessible. How do I re-enable the ClearDB database?
Contact [ClearDB support](https://www.cleardb.com/developers/help/support) to re-enable the database. Provide them with your Azure subscription information and database name.

## Can I transfer a ClearDB database from a credit card subscription to an EA subscription?
Existing ClearDB databases use the credit card associated with the existing subscriptions. To use an EA subscription you need to migrate your data to a new database:

* Purchase a new ClearDB database with your EA subscription.
* Migrate your data to your new database.
* Update your application to use the new database.
* Delete your old ClearDB database.

When you create a new web app with MySQL (ClearDB) or create a MySQL database (ClearDB), the subscription you choose determines how you will pay for the service. With an EA subscription, we will not block the procurement of the third-party services such as ClearDB in the Azure portal. EA subscriptions are billed outside of Monetary Commitment and are billed quarterly and in arrears. The EA customer would have to set up a payment method such as a credit card to pay for any third-party marketplace services.

## Where can I see the charges for ClearDB resources in an EA subscription?
For Direct EA customers, Azure Marketplace charges are visible on the Enterprise Portal. Note that all marketplace purchases and consumption are billed outside of Monetary Commitment and are billed quarterly and in arrears. EA customers have to pay directly to the third-party service providers and can do so by enabling a payment method such as a credit card with their EA account.

Indirect EA customers can find their Azure Marketplace subscriptions on the **Manage Subscriptions** page of the Enterprise Portal, but pricing is hidden. Customers should contact their LSP for information on marketplace charges.

Access to Azure Marketplace for third-party services can be managed by your EA Azure enrollment administrators. They can disable or re-enable access to 3rd party purchases from the Store in Manage Accounts and Subscriptions under the Accounts section in the Enterprise Portal.

## Who do I contact for questions about my bill for ClearDB services in my EA subscription?
Contact [Enterprise Customer Support](https://aka.ms/AzureEntSupport) with regards to billing under their EA enrollment. The EA Portal Support Team will answer your question or help resolve your issue.

## More information
[Azure Marketplace FAQ](https://azure.microsoft.com/marketplace/faq/)

