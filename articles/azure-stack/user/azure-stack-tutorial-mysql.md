---
title: Create highly available MySQL databases in Azure Stack | Microsoft Docs
description: Learn how to create a MySQL Server resource provider host computer and highly available MySQL databases with Azure Stack.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/18/2018
ms.author: jeffgilb
ms.reviewer: quying
---

# Tutorial: create highly available MySQL databases

As an Azure Stack tenant user, you can configure server VMs to host MySQL Server databases. After a MySQL cluster is successfully created, and managed by Azure Stack, users who have subscribed to MySQL services can easily create highly available MySQL databases.

This tutorial shows how to use Azure Stack marketplace items to create a [MySQL with replication cluster](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/bitnami.mysql-cluster). This solution uses multiple VMs to replicate the databases from the master node to a configurable number of replicas. Once created, the cluster can then be added as an Azure Stack MySQL Hosting Server, and then users can create a highly available MySQL databases.

What you will learn:

> [!div class="checklist"]
> * Create a MySQL Server cluster from marketplace items
> * Create an Azure Stack MySQL Hosting Server
> * Create a highly available MySQL database

In this tutorial, a three VM MySQL Server cluster will be created and configured using available Azure Stack marketplace items. 

Before starting the steps in this tutorial, ensure that the Azure Stack Operator has made the following items available in the Azure Stack marketplace:

> [!IMPORTANT]
> All of the following are required to create the MySQL cluster.

- [MySQL with Replication](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/bitnami.mysql-cluster). This is the Bitnami solution template that will be used for the MySQL cluster deployment.
- [Debian 8 "Jessie"](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/credativ.Debian8backports?tab=Overview). Debian 8 "Jessie" with backports kernel for Microsoft Azure provided by credativ. Debian GNU/Linux is one of the most popular Linux distributions.
- [Custom script for linux 2.0](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft.custom-script-linux?tab=Overview). Custom Script Extension is a tool to execute your VM customization tasks post VM provision. When this Extension is added to a Virtual Machine, it can download scripts from Azure storage and run them on the VM. Custom Script Extension tasks can also be automated using the Azure PowerShell cmdlets and Azure Cross-Platform Command-Line Interface (xPlat CLI).
- VM Access For Linux Extension 1.4.7. The VM Access extension enables you to reset the password, SSH key, or the SSH configurations, so you can regain access to your VM. You can also add a new user with password or SSH key, or delete a user using this extension. This extension targets Linux VMs.

  > [!TIP]
  > You won't be able to see Debian 8 "Jessie", custom script for linux, or VM access for Linux Extension marketplace items when creating a VM from the user portal. Contact your Azure Stack Operator to ensure these items have been downloaded from Azure before beginning the steps in this tutorial.

To learn more about adding items to the Azure Stack marketplace, see the [Azure Stack Marketplace overview](.\.\azure-stack-marketplace.md).

In addition, you'll need an SSH client like [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) to log into the Linux VMs after they are deployed.

## Create a MySQL Server cluster 
Use the steps in this section to deploy the MySQL Server cluster using the [MySQL with Replication](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/bitnami.mysql-cluster) marketplace item. This template deploys three MySQL Server instances configured in a highly available MySQL cluster. By default, it creates the following resources:

- A virtual network
- A network security group
- A storage account
- An availablity set
- Three network interfaces (one for each of the default VMs)
- A public IP address (for the primary MySQL cluster VM)
- Three Linux VMs to host the MySQL cluster

> [!NOTE]
> Run these steps from the Azure Stack user portal as a tenant user with a subscription providing IaaS capabilities (compute, network, storage services).

1. Sign in to the user portal:
    - For an integrated system deployment, the portal address will vary based on your solution's region and external domain name. It will be in the format of https://portal.&lt;*region*&gt;.&lt;*FQDN*&gt;.
    - If you’re using the Azure Stack Development Kit (ASDK), the user portal address is [https://portal.local.azurestack.external](https://portal.local.azurestack.external).

2. Select **\+** **Create a resource** > **Compute**, and then **MySQL with Replication**.

   ![Custom template deployment](media/azure-stack-tutorial-mysqlrp/createcluster1.png)

3. Provide basic deployent information on the **Basics** page. Review the default values and change as needed and click **OK**.<br><br>At a minimum, provide the following:
   - Deployment name (default is mysql)
   - Application root password. Provide a 12 character alphanumeric password with **no special characters**
   - Application database name (defalt is bitnami)
   - Number of cluster computers to create (default is 2)
   - Select the subscription to use
   - Select the resource group to use or create a new one
   - Select the location (default is local for ASDK)

   ![Deployment basics](media/azure-stack-tutorial-mysqlrp/createcluster2.png)

4. On the **Environment Configuration** page, provide the following information and then click **OK**: 
   - Password or SSH public key to use for secure shell (SSH) authentication. If using a password, it must contain letters, numbers and **can** contain special characters
   - VM size (default is Standard D1 v2 VMs)
   - Data disk size in GB
Click **OK**

   ![Environment configuration](media/azure-stack-tutorial-mysqlrp/createcluster3.png)

5. Review the deployment **Summary**. Optionally, you can download the customized template and parameters, and then click **OK**.

   ![Summary](media/azure-stack-tutorial-mysqlrp/createcluster4.png)

6. Click **Create** on the **Buy** page to start the deployment.

   ![Buy](media/azure-stack-tutorial-mysqlrp/createcluster4.png)

    > [!NOTE]
    > The deployment will take about an hour. Ensure that the deployment has finished and the MySQL cluster has been completely configured before continuing. 

7. After all deployments have completed successfully, review the resource group items and select the **mysqlip** Public IP address item. Record the public IP address and full FQDN of the public IP for the cluster.<br><br>You will need to provide this to an Azure Stack Operator so they can create a MySQL hosting server leveraging this MySQL cluster.


### Configure an NSG rule
By default, no public access is configured for MySQL into the tenant VM. For the Azure Stack MySQL resource provider to connect and manage the MySQL cluster, an inbound network security group (NSG) rule needs to be created.

1. In the user portal, navigate to the resource group created when deploying the MySQL cluster and select the network security group (**default-subnet-sg**):

   ![open](media/azure-stack-tutorial-mysqlrp/nsg1.png)

2. Select **Inbound security rules** and then click **Add**.<br><br>Enter **3306** in the **Destination port range** and optionally provide a description in the **Name** and **Description** fields. Click Add to close the inbound security rule dialog.

   ![open](media/azure-stack-tutorial-mysqlrp/nsg2.png)

### Configure external access to the MySQL cluster
Before the MySQL cluster can be added as an Azure Stack MySQL Server host, external access must be enabled.

1. Using an SSH client, this example uses [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html), log into the primary MySQL machine from a computer than can access the public IP. The primary MySQL VM name usually ends with **0** and has a public IP assigned to it.<br><br>Use the public IP and log into the VM with the username of **bitnami** and the application password you created earlier without special characters.

   ![LinuxLogin](media/azure-stack-tutorial-mysqlrp/bitnami1.png)


2. In the SSH client window, use the following command to ensure the bitnami service is active and running. Provide the bitnami password again when prompted:

   `sudo service bitnami status`

   ![Check service](media/azure-stack-tutorial-mysqlrp/bitnami2.png)

3. Create a remote access user account to be used by the Azure Stack MySQL Hosting Server to connect to MySQL and then exit the SSH client.<br><br>Run the following commands to log into MySQL as root, using the root password created earlier, and create a new admin user, replace *\<username\>* and *\<password\>* as required for your environment. In this example, the user to be created is named **sqlsa** and a strong password is used:

   ```mysql
   mysql -u root -p
   create user <username>@'%' identified by '<password>';
   grant all privileges on *.* to <username>@'%' with grant option;
   flush privileges;
   ```
   ![Create admin user](media/azure-stack-tutorial-mysqlrp/bitnami3.png)

 4. Record the new MySQL user information.<br><br>You will need to provide this username and password to an Azure Stack Operator so they can create a MySQL hosting server leveraging this MySQL cluster.


## Create an Azure Stack SQL Hosting Server


## Create a highly available SQL database



## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]
> * Create a MySQL Server cluster from marketplace items
> * Create an Azure Stack MySQL Hosting Server
> * Create a highly available MySQL database

Advance to the next tutorial to learn how to:
> [!div class="nextstepaction"]
> [Create highly available MySQL databases](azure-stack-tutorial-mysql.md)