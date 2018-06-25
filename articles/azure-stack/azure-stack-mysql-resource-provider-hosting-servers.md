---
title: MySQL Hosting Servers on Azure Stack | Microsoft Docs
description: How to add MySQL instances for provisioning through the MySQL Adapter Resource Provider
services: azure-stack
documentationCenter: ''
author: jeffgilb
manager: femila
editor: ''
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/25/2018
ms.author: jeffgilb
ms.reviewer: jeffgo

---

# Add hosting servers for the MySQL resource provider

You can host a MySQL instance on a virtual machine (VM) in [Azure Stack](azure-stack-poc.md), or on a VM outside your Azure Stack environment, as long as the MySQL resource provider can connect to the instance.

## Connect to a MySQL hosting server

Make sure you have the credentials for an account with system admin privileges. To add a hosting server, follow these steps:

1. Sign in to the Azure Stack operator portal as a service admin.
2. Select **More services**.
3. Select **ADMINISTRATIVE RESOURCES** > **MySQL Hosting Servers** > **+Add**. This opens the **Add a MySQL Hosting Server** dialog, shown in the following screen capture.

   ![Configure a hosting server](./media/azure-stack-mysql-rp-deploy/mysql-add-hosting-server-2.png)

4. Provide the connection details of your MySQL Server instance.

   * For **MySQL Hosting Server Name**, provide the fully qualified domain name (FQDN) or a valid IPv4 address. Don't use the short VM name.
   * A default MySQL instance isn't provided, so you have to specify the **Size of Hosting Server in GB**. Enter a size that's close to the capacity of the database server.
   * Keep the default setting for **Subscription**.
   * For **Resource group**, create a new one, or use an existing group.

   > [!NOTE]
   > If the MySQL instance can be accessed by the tenant and the admin Azure Resource Manager, you can put it under the control of the resource provider. But, the MySQL instance **must** be allocated exclusively to the resource provider.

5. Select **SKUs** to open the **Create SKU** dialog.

   ![Create a MySQL SKU](./media/azure-stack-mysql-rp-deploy/mysql-new-sku.png)

   The SKU **Name** should reflect the properties of the SKU so users can deploy their databases to the appropriate SKU.

   >[!IMPORTANT]
   >Special characters, including spaces and periods, aren't supported in **Name** or **Tier** when you create a SKU for the MySQL resource provider.

6. Select **OK** to create the SKU.
7. Under **Add a MySQL Hosting Server**, select **Create**.

As you add servers, assign them to a new or existing SKU to differentiate service offerings. For example, you can have a MySQL enterprise instance that provides increased database and automatic backups. You can reserve this high-performance server for different departments in your organization.

## Increase backend database capacity

You can increase backend database capacity by deploying more MySQL servers in the Azure Stack portal. Add these servers to a new or existing SKU. If you add a server to an existing SKU, make sure that the server characteristics are the same as the other servers in the SKU.

## Make MySQL database servers available to your users

Create plans and offers to make MySQL database servers available to users. Add the Microsoft.MySqlAdapter service to the plan, and then add the default Quota, or create a new Quota.

![Create plans and offers for databases](./media/azure-stack-mysql-rp-deploy/mysql-new-plan.png)

## Next steps

[Create a MySQL database](azure-stack-mysql-resource-provider-databases.md)