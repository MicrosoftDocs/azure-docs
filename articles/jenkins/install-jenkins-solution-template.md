---
title: Create your first Jenkins Master on a Linux (Ubuntu) VM on Azure
description: Leverage the solution template to deploy Jenkins.
services: app-service\web
documentationcenter: ''
author: mlearned
manager: douge
editor: ''

ms.assetid: 8bacfe3e-7f0b-4394-959a-a88618cb31e1
ms.service: multiple
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 6/7/2017
ms.author: mlearned
ms.custom: mvc
---
# Create your first Jenkins Master on a Linux (Ubuntu) VM on Azure

This quickstart shows how to install the latest stable Jenkins version on a Linux (Ubuntu 14.04 LTS) VM along with the tools and plugins configured to work with Azure. These include:
<ul>
<li>Git for source control</li>
<li>Azure credential plugin for connecting securely</li>
<li>Azure VM Agents plugin for elastic build, test and continuous integration</li>
<li>Azure Storage plugin for storing artifacts></li>
<li>Azure CLI to deploy apps using scripts</li>
</ul>

## Prerequisites

To complete this quickstart, you need:

*  An Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/))

## Create the VM in Azure by deploying the solution template

Go to http://aka.ms/jenkins-on-azure, click **GET IT NOW**  

In Azure Portal, click **Create**.
   
![Azure Portal dialog](./media/install-jenkins-solution-template/ap-create.png)

In the **Set up basic settings** tab:

![Set up basic settings](./media/install-jenkins-solution-template/ap-basic.png)

* Provide a name to your Jenkins instance.
* Select a VM disk type.
* User name: must meet length requirements, and must not include reserved words or unsupported characters. Names like "admin" are not allowed.
* Authentication type: you can create an instance that is secured by a password or [SSH public key](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/ssh-from-windows). If you use a password, note that it must have 3 of the following: 1 lower case character, 1 upper case character, 1 number and 1 special character.
* Select a subscription.
* Create a new resource group or use an existing one.
* Select a location.

In the **Configure additional options** tab:

![Set up additional options](./media/install-jenkins-solution-template/ap-addtional.png)

* Provide a domain name label

Click **OK** to go to the next step. 

Once validation passes, click **OK** to download the template and parameters. 

Next, select **Purchase** to provision all the resources.

## Setup SSH port forwarding

By default the Jenkins instance is using the http protocol and listens on port 8080. Users shouldn't authenticate over unsecured protocols.
	
You need to setup port forwarding to view the Jenkins UI on your local machine.

### If you are using Windows:

Install Putty and run this command if you use password to secure Jenkins:
```
putty.exe -ssh -L 8080:localhost:8080 <username>@<Domain name label>.<location>.cloudapp.azure.com
```
* Enter the password to login.

![Enter password to login](./media/install-jenkins-solution-template/jenkins-pwd.png)

If you use SSH, run this command:
```
putty -i <private key file including path> -L 8080:localhost:8080 <username>@<Domain name label>.<location>.cloudapp.azure.com
```

### If you are using Linux or Mac:

If you use a password to secure your Jenkins master, run this command:
```
ssh -L 8080:localhost:8080 <username>@<Domain name label>.<location>.cloudapp.azure.com
```
* Enter the password to login.

If you use SSH, run this command:
```
ssh -i <private key file including path> -L 8080:localhost:8080 <username>@<Domain name label>.<location>.cloudapp.azure.com
```

## Connect to Jenkins
After you have started your tunnel, navigate to http://localhost:8080/ on your local machine.

You must unlock the Jenkins dashboard for the first time with the initial admin password.

![Unlock jenkins](./media/install-jenkins-solution-template/jenkins-unlock.png)

To get a token, SSH into the VM and run `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`.

![Unlock jenkins](./media/install-jenkins-solution-template/jenkins-ssh.png)

You will be asked to install the suggested plugins.

![Install plugins](./media/install-jenkins-solution-template/jenkins-plugins.png)

Next, create an admin user for your Jenkins master.

Your Jenkins instance is now ready to use! You can access a read-only view by going to http://&lt;Public DNS name of instance you just created>.

![Jenkins is ready!](./media/install-jenkins-solution-template/jenkins-welcome.png)

## Next Steps

> [!div class="nextstepaction"]
> [Azure VMs as Jenkins agents](jenkins-azure-vm-agents.md)
