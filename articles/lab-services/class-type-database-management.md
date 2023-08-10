---
title: Set up a lab to teach database management for relational databases | Microsoft Docs
description: Learn how to set up a lab to teach the management of relational databases. 
author: emaher
ms.topic: how-to
ms.date: 02/22/2022
ms.service: lab-services
ms.custom: devdivchpfy22
---

# Set up a lab to teach database management for relational databases

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article describes how to set up a lab for a basic database management class in Azure Lab Services. Database concepts are one of the introductory courses taught in most of the Computer Science departments in college. Structured Query Language (SQL) is an international standard. SQL is the standard language for relation database management including adding, accessing, and managing content in a database.  It's most noted for its quick processing, proven reliability, ease, and flexibility of use.

In this article, you learn how to set up a virtual machine template in a lab with both MySQL Database Server and SQL Server 2019 server.  [MySQL](https://www.mysql.com/) is a freely available open source Relational Database Management System (RDBMS).  [SQL Server 2019](https://www.microsoft.com/sql-server/sql-server-2019) is the latest version of Microsoft’s RDBMS.

## Lab configuration

To set up this lab, you need an Azure subscription and lab account. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

When you get an Azure subscription, you can create a new lab plan in Azure Lab Services. For more information about creating a new lab plan, see the tutorial on [how to set up a lab plan](./quick-create-resources.md). You can also use an existing lab plan.

### Lab plan settings

Enable the settings described in the table below for the lab plan. For more information about enabling marketplace images, see [Specify Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab plan setting | Instructions |
| ------------------- | ------------ |
|Marketplace image| Enable the ‘SQL Server 2019 Standard on Windows Server 2019’ image.|

### Lab settings

Use the settings in the table below when setting up a lab. For more information about creating a lab, see [set up a lab tutorial](tutorial-setup-lab.md).

| Lab settings | Value/instructions |
| ------------ | ------------------ |
|Virtual Machine Size| Medium. This size is best suited for relational databases, in-memory caching, and analytics.|
|Virtual Machine Image| SQL Server 2019 Standard on Windows Server 2019|

## Template machine configuration

To install MySQL on Windows Server 2019, you can follow the steps mentioned in [Install and Run MySQL Community Server on a Virtual Machine](/previous-versions/azure/virtual-machines/windows/classic/mysql-2008r2?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json#install-and-run-mysql-community-server-on-the-virtual-machine).

SQL Server 2019 is pre-installed in the virtual machine image we selected when creating the new lab.

## Cost estimate

Let's cover a possible cost estimate for this class.  We'll use a class of 25 students.  There are 20 hours of scheduled class time.  Also, each student gets 10 hours quota for homework or assignments outside scheduled class time.  The virtual machine size we chose was medium, which is 42 lab units.

Following is an example of a possible cost estimate for this class:

25 students \* (20 scheduled hours + 10 quota hours) \* 0.42 USD per hour  = 315.00 USD

>[!IMPORTANT]
> Cost estimate is for example purposes only.  For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).  

## Conclusion

This article walked you through the steps necessary to create a lab for basic database management concepts using both MySQL and SQL Server. You can use a similar setup for other databases classes.

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]