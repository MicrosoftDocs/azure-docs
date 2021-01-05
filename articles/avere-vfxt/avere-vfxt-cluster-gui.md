---
title: Access the Avere vFXT control panel - Azure
description: How to connect to the vFXT cluster and  the browser-based Avere Control Panel to configure the Avere vFXT 
author: ekpgh
ms.service: avere-vfxt
ms.topic: how-to
ms.date: 12/14/2019
ms.author: rohogue
---

# Access the vFXT cluster

To adjust cluster settings and monitor the cluster, use the Avere Control Panel. Avere Control Panel is a browser-based graphical interface to the cluster.

Because the vFXT cluster sits inside a private virtual network, you must create an SSH tunnel or use another method to reach the cluster's management IP address.

There are two basic steps:

1. Create a connection between your workstation and the private virtual network
1. Load the cluster's control panel in a web browser

> [!NOTE]
> This article assumes that you have set a public IP address on the cluster controller or on another VM inside your cluster's virtual network. This article describes how to use that VM as a host to access the cluster. If you are using a VPN or ExpressRoute for virtual network access, skip to [Connect to the Avere Control Panel](#connect-to-the-avere-control-panel-in-a-browser).

Before connecting, make sure that the SSH public/private key pair that you used when creating the cluster controller is installed on your local machine. Read the SSH keys documentation for [Windows](../virtual-machines/linux/ssh-from-windows.md) or for [Linux](../virtual-machines/linux/mac-create-ssh-keys.md) if you need help. If you used a password instead of a public key, you will be prompted to enter it when you connect.

## Create an SSH tunnel

You can create an SSH tunnel from the command line of a Linux-based or Windows 10 client system.

Use an SSH tunneling command with this form:

ssh -L *local_port*:*cluster_mgmt_ip*:443 *controller_username*\@*controller_public_IP*

This command connects to the cluster's management IP address through the cluster controller's IP address.

Example:

```sh
ssh -L 8443:10.0.0.5:443 azureuser@203.0.113.51
```

Authentication is automatic if you used your SSH public key to create the cluster and the matching key is installed on the client system. If you used a password, the system will prompt you to enter it.

## Connect to the Avere Control Panel in a browser

This step uses a web browser to connect to the configuration utility on the vFXT cluster.

* For an SSH tunnel connection, open your web browser and navigate to `https://127.0.0.1:8443`.

  You connected to the cluster IP address when you created the tunnel, so you just need to use the localhost IP address in the browser. If you used a local port other than 8443, use your port number instead.

* If you are using a VPN or ExpressRoute to reach the cluster, navigate to the cluster management IP address in your browser. Example: ``https://203.0.113.51``

Depending on your browser, you might need to click **Advanced** and verify that it is safe to proceed to the page.

Enter the username `admin` and the administrative password you provided when creating the cluster.

![Screenshot of the Avere sign in page populated with the username 'admin' and a password](media/avere-vfxt-gui-login.png)

Click **Login** or press enter on your keyboard.

## Next steps

After you have logged in to the cluster's control panel, enable [support](avere-vfxt-enable-support.md).