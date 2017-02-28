---
title: Deploy a Node.js application to Linux Virtual Machines in Azure
description: Learn how to deploy a Node.js application to Linux virtual machines in Azure.
services: ''
documentationcenter: nodejs
author: stepro
manager: dmitryr
editor: ''
ROBOTS: NOINDEX, NOFOLLOW
redirect_url: /azure

ms.assetid: 857a812d-c73e-4af7-a985-2d0baf8b6f71
ms.service: multiple
ms.devlang: nodejs
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/02/2016
ms.author: stephpr

---
# Deploy a Node.js application to Linux Virtual Machines in Azure
This tutorial shows how to take a Node.js application and deploy it to Linux virtual machines running in Azure. The instructions in this tutorial can be followed on any operating system that is capable of running Node.js.

You'll learn how to:

* Fork and clone a GitHub repository containing a simple TODO application;
* Create and configure two Linux virtual machines in Azure to run the application;
* Iterate on the application by pushing updates to the web frontend virtual machine.

> [!NOTE]
> To complete this tutorial, you need a GitHub account and a Microsoft Azure account, and the ability to use Git from a development machine.
> 
> If you don't have a GitHub account, you can sign up [here](https://github.com/join).
> 
> If you don't have a [Microsoft Azure](https://azure.microsoft.com/) account, you can sign up for a FREE trial [here](https://azure.microsoft.com/pricing/free-trial/). This will also lead you through the sign up process for a [Microsoft Account](http://account.microsoft.com) if you do not already have one. Alternatively, if you are a Visual Studio subscriber, you can [activate your MSDN benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).
> 
> If you do not have git on your development machine, then if you are using a Macintosh or Windows machine, install git from [here](http://www.git-scm.com). If you are using Linux, install git using the mechanism most appropriate for you, such as `sudo apt-get install git`.
> 
> 

## Forking and Cloning the TODO Application
The TODO application used by this tutorial implements a simple web frontend over a MongoDB instance that keeps track of a TODO list. After signing in to GitHub, go [here](https://github.com/stepro/node-todo) to find the application and fork it using the link in the top right. This should create a repository in your account named *accountname*/node-todo.

Now on your development machine, clone this repository:

    git clone https://github.com/accountname/node-todo.git

We'll use this local clone of the repository a little later when making changes to the source code.

## Creating and Configuring the Linux Virtual Machines
Azure has great support for raw compute using Linux virtual machines. This part of the tutorial shows how you can easily spin up two Linux virtual machines and deploy the TODO application to them, running the web frontend on one and the MongoDB instance on the other.

### Creating Virtual Machines
The easiest way to create a new virtual machine in Azure is to use the Azure Portal. Click [here](https://portal.azure.com) to sign in and launch the Azure Portal in your web browser. Once the Azure Portal has loaded, complete the following steps:

* Click the "+ New" link;
* Pick the "Compute" category and choose "Ubuntu Server 14.04 LTS";
* Select the "Resource Manager" deployment model and click "Create";
* Fill in the basics following these guidelines:
  * Specify a name you can easily identify later;
  * For this tutorial, choose Password authentication;
  * Create a new resource group with an identifiable name.
* For the Virtual Machine size, "A1 Standard" is a reasonable choice for this tutorial.
* For additional settings, ensure the disk type is "Standard" and accept all the remaining defaults.
* Kick off the creation on the summary page.

Perform the above process twice to create two Linux virtual machines, one for the web frontend and one for the MongoDB instance. Creation of the virtual machines will take about 5-10 minutes.

### Assigning a DNS entry for Virtual Machines
Virtual machines created in Azure are by default only accessible through a public IP address like 1.2.3.4. Let's make the machines more easily identifiable by assigning them DNS entries.

Once the portal indicates that the virtual machines have been created, click on the "Virtual machines" link in the left navbar and locate your machines. For each machine:

* Locate the Essentials tab and click on the Public IP Address;
* In the public IP address configuration, assign a DNS name label and save.

The portal will ensure that the name you specify is available. After saving the configuration, your virtual machines will have host names similar to `machinename.region.cloudapp.azure.com`.

### Connecting to the Virtual Machines
When your virtual machines were provisioned, they were pre-configured to allow remote connections over SSH. This is the mechanism we will use to configure the virtual machines. If you are using Windows for your development, you will need to get an SSH client if you do not already have one. A common choice here is PuTTY, which can be downloaded from [here](http://www.chiark.greenend.org.uk/~sgtatham/putty/). Macintosh and Linux OSes come with a version of SSH pre-installed.

### Configuring the Web Frontend Virtual Machine
SSH to the web frontend machine you created using PuTTY, ssh command line or your other favorite SSH tool. You should see a welcome message followed by a command prompt.

First, let's make sure that git and node are both installed:

    sudo apt-get install -y git
    curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
    sudo apt-get install -y nodejs

Since the application's web frontend relies on some native Node.js modules, we also need to install the essential set of build tools:

    sudo apt-get install -y build-essential

Finally, let's install a Node.js application called *forever*, which helps to run Node.js server applications:

    sudo npm install -g forever

These are all the dependencies needed on this virtual machine to be able to run the application's web frontend, so let's get that running. To do this, we will first create a bare clone of the GitHub repository you previously forked so that you can easily publish updates to the virtual machine (we'll cover this update scenario later), and then clone the bare clone to provide a version of the repository that can actually be executed.

Starting from the home (~) directory, run the following commands (replacing *accountname* with your GitHub user account name):

    git clone --bare https://github.com/accountname/node-todo.git
    git clone node-todo.git

Now enter the node-todo directory and run these commands:

    npm install
    forever start server.js

The application's web frontend is now running, however there is one more step before you can access the application from a web browser. The virtual machine you created is protected by an Azure resource called a *network security group*, which was created for you when you provisioned the virtual machine. Currently, this resource only allows external requests to port 22 to be routed to the virtual machine, which enables SSH communication with the machine but nothing else. So in order to view the TODO application, which is configured to run on port 8080, this port also needs to be opened up.

Return to the Azure Portal and complete the following steps:

* Click on "Resource groups" in the left navbar;
* Select the resource group that contains your virtual machine;
* In the resulting list of resources, select the network security group (the one with a shield icon);
* In the properties, choose "Inbound security rules";
* In the toolbar, click "Add";
* Provide a name like "default-allow-todo";
* Set the protocol to "TCP";
* Set the destination port range to "8080";
* Click OK and wait for the security rule to be created.

After creating this security rule, the TODO application is publically visible on the internet and you can browse to it, for instance using a URL such as:

    http://machinename.region.cloudapp.azure.com:8080

You will notice that even though we have not yet configured the MongoDB virtual machine, the TODO application appears to be quite functional. This is because the source repository is hardcoded to use a pre-deployed MongoDB instance. Once we have configured the MongoDB virtual machine, we will go back and change the source code to utilize our private MongoDB instance instead.

### Configuring the MongoDB Virtual Machine
SSH to the second machine you created using PuTTY, ssh command line or your other favorite SSH tool. After seeing the welcome message and command prompt, install MongoDB (these instructions were taken from [here](https://docs.mongodb.org/master/tutorial/install-mongodb-on-ubuntu/)):

    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
    echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org

By default, MongoDB is configured so it can only be accessed locally. For this tutorial, we will configure MongoDB so it can be accessed from the application's virtual machine. In a sudo context, open the /etc/mongod.conf file and locate the `# network interfaces` section. Change the `net.bindIp` configuration value to `0.0.0.0`.

> [!NOTE]
> This configuration is for the purposes of this tutorial only. It is **NOT** a recommended security practice and should not be used in production environments.
> 
> 

Now ensure the MongoDB service has been started:

    sudo service mongod restart

MongoDB operates over port 27017 by default. So, in the same way that we needed to open port 8080 on the web frontend virtual machine, we need to open port 27017 on the MongoDB virtual machine.

Return to the Azure Portal and complete the following steps:

* Click on "Resource groups" in the left navbar;
* Select the resource group that contains the MongoDB virtual machine;
* In the resulting list of resources, select the network security group (the one with a shield icon) with the same name that you gave to the MongoDB virtual machine;
* In the properties, choose "Inbound security rules";
* In the toolbar, click "Add";
* Provide a name like "default-allow-mongo";
* Set the protocol to "TCP";
* Set the destination port range to "27017";
* Click OK and wait for the security rule to be created.

## Iterating on the TODO application
So far, we have provisioned two Linux virtual machines: one that is running the application's web frontend and one that is running a MongoDB instance. But there is a problem - the web frontend isn't actually using the provisioned MongoDB instance yet. Let's fix that by updating the web frontend code to use an environment variable instead of a hard-coded instance.

### Changing the TODO application
On your development machine where you first cloned the node-todo repository, open the `node-todo/config/database.js` file in your favorite editor and change the url value from the hard-coded value like `mongodb://...` to `process.env.MONGODB`.

Commit your changes and push to the GitHub master:

    git commit -am "Get MongoDB instance from env"
    git push origin master

Unfortunately, this doesn't publish the change to the web frontend virtual machine. Let's make a few more changes to that virtual machine to enable a simple but effective mechanism for publishing updates so you can quickly observe the effect of the changes in the live environment.

### Configuring the Web Frontend Virtual Machine
Recall that we previously created a bare clone of the node-todo repository on the web frontend virtual machine. It turns out that this action created a new Git remote to which changes can be pushed. However, simply pushing to this remote doesn't quite give the rapid iteration model that developers are looking for when working on their code.

What we would like to be able to do is ensure that when a push to the remote repository on the virtual machine occurs, the running TODO application is automatically updated. Fortunately, this is easy to achieve with git.

Git exposes a number of hooks that are called at particular times to react to actions taken on the repository. These are specified using shell scripts in the repository's `hooks` folder. The hook that is most applicable for the auto-update scenario is the `post-update` event.

In a SSH session to the web frontend virtual machine, change to the `~/node-todo.git/hooks` directory and add the following content to a file named `post-update` (replacing `machinename` and `region` with your MongoDB virtual machine information):

    #!/bin/bash

    forever stopall
    unset 'GIT_DIR'
    export MONGODB="mongodb://machinename.region.cloudapp.azure.com:27017/tododb"
    cd ~/node-todo && git fetch origin && git pull origin master && npm install && forever start ~/node-todo/server.js
    exec git update-server-info

Ensure this file is executable by running the following command:

    chmod 755 post-update

This script ensures that the current server application is stopped, the code in the cloned repository is updated to the latest, any updated dependencies are satisfied, and the server is restarted. It also ensures that the environment has been configured in preparation for receiving our first application update to get the MongoDB instance from an environment variable.

### Configuring your Development Machine
Now let's get your development machine hooked up to the web frontend virtual machine. This is as simple as adding the bare repository on the virtual machine as a remote. Run the following command to do this (replacing *user* with your web frontend virtual machine login name and *machinename* and *region* as appropriate):

    git remote add azure user@machinename.region.cloudapp.azure.com:node-todo.git

This is all that is needed to enable pushing, or in effect publishing, changes to the web frontend virtual machine.

### Publishing Updates
Let's publish the one change that has been made so far so that the application will use our own MongoDB instance:

    git push azure master

You should see output similar to this:

    Counting objects: 4, done.
    Delta compression using up to 4 threads.
    Compressing objects: 100% (3/3), done.
    Writing objects: 100% (4/4), 406 bytes | 0 bytes/s, done.
    Total 4 (delta 1), reused 0 (delta 0)
    remote: info:    Forever stopped processes:
    remote: data:        uid  command         script    forever pid  id logfile                         uptime
    remote: data:    [0] 0Lyh /usr/bin/nodejs server.js 9064    9301    /home/username/.forever/0Lyh.log 0:0:3:17.487
    remote: From /home/username/node-todo
    remote:    5f31fd7..5bc7be5  master     -> origin/master
    remote: From /home/username/node-todo
    remote:  * branch            master     -> FETCH_HEAD
    remote: Updating 5f31fd7..5bc7be5
    remote: Fast-forward
    remote:  config/database.js | 2 +-
    remote:  1 file changed, 1 insertion(+), 1 deletion(-)
    remote: npm WARN package.json node-todo@0.0.0 No repository field.
    remote: npm WARN package.json node-todo@0.0.0 No license field.
    remote: warn:    --minUptime not set. Defaulting to: 1000ms
    remote: warn:    --spinSleepTime not set. Your script will exit if it does not stay up for at least 1000ms
    remote: info:    Forever processing file: /home/username/node-todo/server.js
    To username@machinename.region.cloudapp.azure.com:node-todo.git
    5f31fd7..5bc7be5  master -> master

After this command completes, try refreshing the application in a web browser. You should be able to see that the TODO list presented here is empty and no longer tied to the shared deployed MongoDB instance.

To complete the tutorial, let's make another, more visible change. On your development machine, open the node-todo/public/index.html file using your favorite editor. Locate the jumbotron header and change  the title from "I'm a Todo-aholic" to "I'm a Todo-aholic on Azure!".

Now let's commit:

    git commit -am "Azurify the title"

This time, let's publish the change to Azure before pushing it to back to the GitHub repo:

    git push azure master

Once this command completes, refresh the web page and you will see the changes. Since they look good, push the change back to the origin remote: 

    git push origin master

## Next Steps
This article showed how to take a Node.js application and deploy it to Linux virtual machines running in Azure. To learn more about Linux virtual machines in Azure, see [Introduction to Linux on Azure](/documentation/articles/virtual-machines-linux-introduction/).

For more information about how to develop Node.js applications on Azure, see the [Node.js Developer Center](/develop/nodejs/).

