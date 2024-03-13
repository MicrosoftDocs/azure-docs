---
title: Deploy Bitnami virtual appliances
description: Learn about the virtual appliances packed by Bitnami to deploy in your Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 11/28/2023
ms.custom: engagement-fy23
---

# Bitnami appliance deployment

Bitnami by VMware provides a rich catalog of turnkey virtual appliances. You can deploy any vSphere compatible appliance by Bitnami available in the [VMware Marketplace](https://marketplace.cloud.vmware.com/), including many of the most common open-source software projects.

In this article, learn how to install and configure the following virtual appliances packaged by Bitnami on your Azure VMware Solution private cloud:

- LAMP

- Jenkins

- PostgreSQL

- NGINX

- RabbitMQ



## Prerequisites

- Azure VMware Solution private cloud [deployed with a minimum of three nodes](deploy-azure-vmware-solution.md).

- Networking configured as described in [Network planning checklist](tutorial-network-checklist.md).



## Step 1: Download the Bitnami virtual appliance OVA/OVF file


1. Go to the [VMware Marketplace](https://marketplace.cloud.vmware.com/) and download the virtual appliance you want to install on your Azure VMware Solution private cloud:

   - [LAMP virtual appliance packaged by Bitnami](https://marketplace.cloud.vmware.com/services/details/lampstack?slug=true)

   - [Jenkins](https://marketplace.cloud.vmware.com/services/details/jenkins?slug=true)

   - [PostgreSQL](https://marketplace.cloud.vmware.com/services/details/postgresql?slug=true)

   - [NGINX](https://marketplace.cloud.vmware.com/services/details/nginxstack?slug=true)

   - [RabbitMQ](https://marketplace.cloud.vmware.com/services/details/rabbitmq?slug=true)

1. Select the version, select **Download**, and then accept the EULA license. 

   >[!NOTE]
   >Make sure the file is accessible from the virtual machine.

## Step 2: Access the local vCenter Server of your private cloud

1. Sign in to the [Azure portal](https://portal.azure.com).

   >[!NOTE]
   >If you need access to the Azure US Gov portal, go to https://portal.azure.us/

1. Select your private cloud, and then **Manage** > **Identity**.

1. Copy the vCenter Server URL, username, and password. You'll use them to access your virtual machine (VM). 

1. Select **Overview**, select the VM, and then connect to it through RDP. If you need help with connecting, see [connect to a virtual machine](../virtual-machines/windows/connect-logon.md#connect-to-the-virtual-machine) for details.

1. In the VM, open a browser and navigate to the vCenter URL. 

1. Sign in with the `cloudadmin@vsphere.local` user credentials you copied earlier.

   :::image type="content" source="media/tutorial-access-private-cloud/ss5-vcenter-login.png" alt-text="Screenshot showing the VMware vSphere sign in page." border="true":::

## Step 3: Install the Bitnami OVA/OVF file in vCenter Server

1. Right-click the cluster that you want to install the LAMP virtual appliance and select **Deploy OVF Template**.

1. Select **Local file** and navigate to the OVF file you downloaded earlier. Then select **Next**.

1. Select your data center and provide a name for your virtual appliance VM, for example, **bitnami-lampstack**. Then select **Next**.

1. Select the ESXi host as the compute resource to run your VM and then select **Next**.

1. Review the details and select **Next**.

1. Accept the license agreement and select **Next**.

1. Select the storage for your VM and select **Next**.

1. Select the destination network for your VM and select **Next**.

1. Provide the required information to customize the template, such as the VM and networking properties. Then select **Next**.  

1. Review the configuration settings and then select **Finish**.

1. From the **Task Console**, verify that the status of the OVF template deployment has completed successfully.

1. After the installation finishes, under **Actions**, select **Power on** to turn on the appliance. 

1. From the vCenter Server console, select **Launch Web Console** and sign in to the Bitnami virtual appliance. Check the [Bitnami virtual appliance support documentation](https://docs.bitnami.com/vmware-marketplace/faq/get-started/find-credentials/) for the default username and password.

   >[!NOTE]
   >You can change the default password to a more secure one. For more information, see ...



## Step 4: Assign a static IP to the virtual appliance

In this step, you'll modify the *bootproto* and *onboot* parameters and assign a static IP address to the Bitnami virtual appliance. 

1. Search for the network configuration file. 

   ```bash
   sudo find /etc -name \*ens160\*
   ```

1. Edit the *\/etc\/sysconfig\/network-scripts\/ifcfg-ens160* file and modify the boot parameters. Then add the static IP, netmask, and gateway addresses.

   - bootproto=static

   - onboot=yes


1. View and confirm the changes to the **ifcfg-ens160** file.

   ```bash
   cat ifcfg-ens160  
   ```

1. Restart the networking service. This stops the networking services first and then applies the IP configuration. 

   ```bash
   sudo systemctl restart network
   ```

1. Ping the gateway IP address to verify the configuration and VM connectivity to the network.

1. Confirm that the default route 0.0.0.0 is listed.

   ```bash
   sudo route -n
   ```



## Step 5: Enable SSH access to the virtual appliance

In this step, you'll enable SSH on your virtual appliance for remote access control. The SSH service is disabled by default. You'll also use an OpenSSH client to connect to the host console.

1. Enable and start the SSH service.

   ```bash
   sudo rm /etc/ssh/sshd_not_to_be_run
   sudo systemctl enable sshd
   sudo systemctl start sshd
   ```

1. Edit the *\/etc\/ssh\/sshd_config* file to change the password authentication.

   ```bash
   PasswordAuthentication yes
   ```

1. View and confirm the changes to the **sshd_config** file.

   ```bash
   sudo cat sshd_config
   ```

1. Reload the changes made to the file. 

   ```bash
   sudo /etc/init.d/ssh force-reload
   ```

1. Start the SSH session.
   ```bash
   ssh hostname:22
   ```

1. At the virtual appliance console prompt, enter the Bitnami username and password to connect to the host. 



