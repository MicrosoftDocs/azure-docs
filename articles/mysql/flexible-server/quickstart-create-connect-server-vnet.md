---
title: 'Connect to Azure Database for MySQL flexible server with private access in Azure Portal'
description: This article walks you through using the Azure portal to create and connect to an Azure Database for MySQL flexible server in private access.
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.custom: mvc
ms.topic: quickstart
ms.date: 04/18/2021
---

# Connect to MySQL Server in Virtual network - Azure Database for MySQL Flexible Server

Azure Database for MySQL Flexible Server is a managed service that you can use to run, manage, and scale highly available MySQL servers in the cloud. This quickstart shows you how to create a flexible server in a virtual network by using the Azure portal.

> [!IMPORTANT]
> Azure Database for MySQL Flexible Server is currently in public preview.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal
Go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Database for MySQL flexible server

You create a flexible server with a defined set of [compute and storage resources](./concepts-compute-storage.md). You create the server within an [Azure resource group](../../azure-resource-manager/management/overview.md).

Complete these steps to create a flexible server:

1. Search for and select **Azure Database for MySQL servers** in the portal:

 > :::image type="content" source="./media/quickstart-create-connect-server-vnet/search-flexible-server-in-portal.png" alt-text="Screenshot that shows a search for Azure Database for MySQL servers.":::

2. Select **Add**.

3. On the **Select Azure Database for MySQL deployment option** page, select **Flexible server** as the deployment option:

    > :::image type="content" source="./media/quickstart-create-connect-server-vnet/deployment-option.png" alt-text="Screenshot that shows the Flexible server option.":::

4. On the **Basics** tab, enter the following information:

    > :::image type="content" source="./media/quickstart-create-connect-server-vnet/create-form.png" alt-text="Screenshot that shows the Basics tab of the Flexible server page.":::

    |**Setting**|**Suggested value**|**Description**|
    |---|---|---|
    Subscription|Your subscription name|The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you want to be billed for the resource.|
    Resource group|**myresourcegroup**| A new resource group name or an existing one from your subscription.|
    Server name |**mydemoserver**|A unique name that identifies your flexible server. The domain name `mysql.database.azure.com` is appended to the server name you provide. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain between 3 and 63 characters.|
    Region|**East US**| Choose from any of the supported regions listed.|
    Workload type|**Development** | For production workload, you can choose Small/Medium-size or Large-size depending on [max_connections](concepts-server-parameters.md#max_connections) requirements|
    Availability zone| **No preference** | If your application in Azure VMs, virtual machine scale sets or AKS instance is provisioned in a specific availability zone, you can specify your flexible server in the same availability zone to collocate application and database to improve performance by cutting down network latency across zones.|
    High Availability| Default | For production servers, enabling zone redundant high availability (HA) is highly recommended for business continuity and protection against zone failures|
    MySQL version|**5.7**| A MySQL major version.|
    Admin username |**mydemouser**| Your own sign-in account to use when you connect to the server. The admin user name can't be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.|
    Password |Your password| A new password for the server admin account. It must contain between 8 and 128 characters. It must also contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, and so on).|
    Compute + storage | **Burstable**, **Standard_B1ms**, **10 GiB**, **100 iops**, **7 days** | The compute, storage, IOPS, and backup configurations for your new server. Select **Configure server** to change these values. Select **Save** if you change any compute and storage properties.|

    >![TIP]
    > For faster data loads during migration, it is recommended to increase the IOPS to the maximum size supported by compute size and later scale it back to save cost.

5.  Go to the **Networking** tab, select **private access**.You can't change the connectivity method after you create the server. Select **Create virtual network** to create new  virtual network **vnetenvironment1**.

    > :::image type="content" source="./media/quickstart-create-connect-server-vnet/create-new-vnet-for-mysql-server.png" alt-text="Screenshot that shows the Networking tab with new VNET.":::

6. Select **OK** once you have provided the virtual network name and subnet information.
    > :::image type="content" source="./media/quickstart-create-connect-server-vnet/show-new-vnet-information.png" alt-text="review VNET information":::

7. Select **Review + create** to review your flexible server configuration.

8. Select **Create** to provision the server. Provisioning can take a few minutes.

9. Wait until the deployment is complete and successful.

   > :::image type="content" source="./media/quickstart-create-connect-server-vnet/deployment-success.png" alt-text="Screenshot that shows the Networking tab with new VNET.":::

9.  Select **Go to resource** to view the server's **Overview** page opens.

## Connect to the Server from Azure Linux virtual machine
Since the server is in virtual network, you can only connect to the server from other Azure services in the same virtual network as the server. To connect and manage the server, let's create a linux virtual machine.

### Create Azure Linux virtual machine

Create a Azure Linux virtual machine in the same virtual network. The virtual machine must be created in the same region in order to configure it in the same virtual network.

1. Go to you resource group in which the server was created. Select **Add**.
2. Select **Ubuntu Server 18.04 LTS**
3. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected and then choose to **Create new** resource group. Type *myResourceGroup* for the name.*.

	![Screenshot of the Project details section showing where you select the Azure subscription and the resource group for the virtual machine](../../virtual-machines/linux/media/quick-create-portal/project-details.png)

2. Under **Instance details**, type *myVM* for the **Virtual machine name**, choose the same **Region** as your database server.

	![Screenshot of the Instance details section where you provide a name for the virtual machine and select its region, image and size](../../virtual-machines/linux/media/quick-create-portal/instance-details.png)

3. Under **Administrator account**, select **SSH public key**.

4. In **Username** type *azureuser*.

5. For **SSH public key source**, leave the default of **Generate new key pair**, and then type *myKey* for the **Key pair name**.

    ![Screenshot of the Administrator account section where you select an authentication type and provide the administrator credentials](../../virtual-machines/linux/media/quick-create-portal/administrator-account.png)

6. Under **Inbound port rules** > **Public inbound ports**, choose **Allow selected ports** and then select **SSH (22)** and **HTTP (80)** from the drop-down.

	![Screenshot of the inbound port rules section where you select what ports inbound connections are allowed on](../../virtual-machines/linux/media/quick-create-portal/inbound-port-rules.png)

7. Select **Networking** page to configure the virtual network. For virtual network, choose the **vnetenvironment1** created for the database server.
![Screenshot of select existing virtual network of the database server](./media/quick-create-connect-server-vnet/vm-vnet-configuration.png)

8. Select **Manange subnet configuration** to create a new subnet for the server.

![Screenshot of manage subnet](../../virtual-machines/linux/media/quick-create-portal/vm-manage-subnet-integration.png)

9. Add new subnet for the virtual machine.

 ![Screenshot of adding a new subnet for virtual machine](../../virtual-machines/linux/media/quick-create-portal/vm-add-new-subnet.png)

10. After the subnet has been created successfully , close the page.
 ![Screenshot of adding a new subnet for virtual machine](../../virtual-machines/linux/media/quick-create-portal/subnet-create-success.png)

11. Select **Review + Create**.
12. Select **Create**. When the **Generate new key pair** window opens, select **Download private key and create resource**. Your key file will be download as **myKey.pem**.

![Screenshot of the dialog to download the private key and create](../../virtual-machines/linux/media/quick-create-portal/vm-download-private-key.png)

>[!IMPORTANT]
> Make sure you know where the `.pem` file was downloaded, you will need the path to it in the next step.

13. When the deployment is finished, select **Go to resource**.

![Screenshot of deployment success](./media/quick-create-connect-server-vnet/vvm-create-success.png)

11. On the page for your new VM, select the public IP address and copy it to your clipboard.

	![Screenshot showing how to copy the IP address for the virtual machine](./media/quick-create-portal/ip-address.png)


### Connect to virtual machine

Create an SSH connection with the VM using Bash or PowerShell. At your prompt, open an SSH connection to your virtual machine. Replace the IP address with the one from your VM, and replace the path to the `.pem` with the path to where the key file was downloaded.

```console
ssh -i .\Downloads\myKey1.pem azureuser@10.111.12.123
```

> [!TIP]
> The SSH key you created can be used the next time your create a VM in Azure. Just select the **Use a key stored in Azure** for **SSH public key source** the next time you create a VM. You already have the private key on your computer, so you won't need to download anything.


### Install msyql-client tools

You need to install mysql-client tool to be able to connect to the server.

```bash
sude apt-getupdate
sudo apt-get install mysql-client
```

Connections to the database are enforced with SSL, hence you need to download the public SSL certificate.

```bash
wget --no-check-certificate https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem
```

### Connect to the server
With [mysql.exe](https://dev.mysql.com/doc/refman/8.0/en/mysql.html) client tool installed, we can now connect to the server from your local environment.

```bash
mysql -h mydemoserver.mysql.database.azure.com -u mydemouser -p --ssl-mode=REQUIRED --ssl-ca=DigiCertGlobalRootCA.crt.pem
```

## Clean up resources
You have now created an Azure Database for MySQL flexible server in a resource group. If you don't expect to need these resources in the future, you can delete them by deleting the resource group, or you can just delete the MySQL server. To delete the resource group, complete these steps:

1. In the Azure portal, search for and select **Resource groups**.
1. In the list of resource groups, select the name of your resource group.
1. In the **Overview** page for your resource group, select **Delete resource group**.
1. In the confirmation dialog box, type the name of your resource group, and then select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Build a PHP (Laravel) web app with MySQL](tutorial-php-database-app.md)
