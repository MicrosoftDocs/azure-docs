<properties
   pageTitle="Automating Azure virtual machine deployment with Chef"
   description="Learn the art of Azure virtual machine automation with Chef"
   services="virtual-machines"
   documentationCenter=""
   authors="diegoviso"
   manager="timlt"
   editor=""/>

<tags ms.service="virtual-machines" ms.workload="infrastructure-services"
ms.tgt_pltfrm="vm-multiple"
ms.devlang="na"
ms.topic="article"
ms.date="05/19/2015"
ms.author="diviso"/>

# Automating Azure virtual machine deployment with Chef

Chef is a great tool for delivering automation and desired state configurations.

With our latest cloud-api release, Chef provides seamless integration with Azure, giving you the ability to provision and deploy configuration states through a single command.

In this article, I’ll show you how to set up your Chef environment to provision Azure virtual machines and walk you through creating a policy or “CookBook” and then deploying this cookbook to an Azure virtual machine.

Let’s begin!

## Chef basics

Before you begin, I suggest you review the basic concepts of Chef. There is great material <a href="http://www.chef.io/chef" target="_blank">here</a> and I recommend you have a quick read before you attempt this walkthrough. I will however recap the basics before we get started.

The following diagram depicts the high-level Chef architecture.

![][2]

Chef has three main architectural components: Chef Server, Chef Client (node), and Chef Workstation.

The Chef Server is our management point and there are two options for the Chef Server: a hosted solution or an on-premises solution. We will be using a hosted solution.

The Chef Client (node) is the agent that sits on the servers you are managing.

The Chef Workstation is our admin workstation where we create our policies and execute our management commands. We run the **knife** command from the Chef Workstation to manage our infrastructure.

There is also the concept of “Cookbooks” and “Recipes”. These are effectively the policies we define and apply to our servers.

## Preparing the workstation

First, lets prep the workstation. I’m using a standard Windows workstation. We need to create a directory to store our config files and cookbooks.

First create a directory called C:\chef.

Then create a second directory called c:\chef\cookbooks.

We now need to download our Azure settings file so Chef can communicate with our Azure subscription.

Download your publish settings from [here](https://manage.windowsazure.com/publishsettings/).

Save the publish settings file in C:\chef.

##Creating a managed Chef account

Sign up for a hosted Chef account [here](https://manage.chef.io/signup).

During the signup process, you will be asked to create a new organization.

![][3]

Once your organization is created, download the starter kit.

![][4]

> [AZURE.NOTE] If you receive a prompt warning you that your keys will be reset, it’s ok to proceed as we have no existing infrastructure configured as yet.

This starter kit zip file contains your organization config files and keys.

##Configuring the Chef workstation

Extract the content of the chef-starter.zip to C:\chef.

Copy all files under chef-starter\chef-repo\.chef to your c:\chef directory.

Your directory should now look something like the following example.

![][5]

You should now have four files including the Azure publishing file in the root of c:\chef.

The PEM files contain your organization and admin private keys for communication while the knife.rb file contains your knife configuration. We will need to edit the knife.rb file.

Open the file in your editor of choice and modify the “cookbook_path” by removing the /../ from the path so it appears as shown next.

	cookbook_path  ["#{current_dir}/cookbooks"]

Also add the following line reflecting the name of your Azure publish settings file.

	knife[:azure_publish_settings_file] = "yourfilename.publishsettings"

Your knife.rb file should now look similar to the following example.

![][6]

These lines will ensure that Knife references the cookbooks directory under c:\chef\cookbooks, and also uses our Azure Publish Settings file during Azure operations.

## Installing the Chef Development Kit

Next [download and install](http://downloads.getchef.com/chef-dk/windows) the ChefDK (Chef Development Kit) to set up your Chef Workstation.

![][7]

Install in the default location of c:\opscode. This install will take around 10 minutes.

Confirm your PATH variable contains entries for C:\opscode\chefdk\bin;C:\opscode\chefdk\embedded\bin;c:\users\yourusername\.chefdk\gem\ruby\2.0.0\bin

If they are not there, make sure you add these paths!

*NOTE THE ORDER OF THE PATH IS IMPORTANT!* If your opscode paths are not in the correct order you will have issues.

Reboot your workstation before you continue.

Next, we will install the Knife Azure extension. This provides Knife with the “Azure Plugin”.

Run the following command.

	chef gem install knife-azure ––pre

> [AZURE.NOTE] The –pre argument ensures you are receiving the latest RC version of the Knife Azure Plugin which provides access to the latest set of APIs.

It’s likely that a number of dependencies will also be installed at the same time.

![][8]


To ensure everything is configured correctly, run the following command.

	knife azure image list

If everything is configured correctly, you will see a list of available Azure images scroll through.

Congratulations. The workstation is set up!

##Creating a Cookbook

A Cookbook is used by Chef to define a set of commands that you wish to execute on your managed client. Creating a Cookbook is straightforward and we use the **chef generate cookbook** command to generate our Cookbook template. I will be calling my Cookbook web server as I would like a policy that automatically deploys IIS.

Under your C:\Chef directory run the following command.

	chef generate cookbook webserver

This will generate a set of files under the directory C:\Chef\cookbooks\webserver. We now need to define the set of commands we would like our Chef client to execute on our managed virtual machine.

The commands are stored in the file default.rb. In this file, I’ll be defining a set of commands that installs IIS, starts IIS and copies a template file to the wwwroot folder.

Modify the C:\chef\cookbooks\webserver\recipes\default.rb file and add the following lines.

	powershell_script 'Install IIS' do
 		action :run
 		code 'add-windowsfeature Web-Server'
	end

	service 'w3svc' do
 		action [ :enable, :start ]
	end

	template 'c:\inetpub\wwwroot\Default.htm' do
 		source 'Default.htm.erb'
 		rights :read, 'Everyone'
	end

Save the file once you are done.

## Creating a template

As we mentioned previously, we need to generate a template file which will be used as our default.html page.

Run the following command to generate the template.

	chef generate template webserver Default.htm

Now navigate to the C:\chef\cookbooks\webserver\templates\default\Default.htm.erb file. Edit the file by adding some simple “Hello World” HTML code, and then save the file.



## Upload the Cookbook to the Chef Server

In this step, we are taking a copy of the Cookbook that we have created on our local machine and uploading it to the Chef Hosted Server. Once uploaded, the Cookbook will appear under the **Policy** tab.

	knife cookbook upload webserver

![][9]

## Deploy a virtual machine with Knife Azure

We will now deploy an Azure virtual machine and apply the “Webserver” Cookbook which will install our IIS web service and default web page.

In order to do this, use the **knife azure server create** command.

Am example of the command appears next.

	knife azure server create --azure-dns-name 'diegotest01' --azure-vm-name 'testserver01' --azure-vm-size 'Small' --azure-storage-account 'portalvhdsxxxx' --bootstrap-protocol 'cloud-api' --azure-source-image 'a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-Datacenter-201411.01-en.us-127GB.vhd' --azure-service-location 'Southeast Asia' --winrm-user azureuser --winrm-password 'myPassword123' --tcp-endpoints 80,3389 --r 'recipe[webserver]'

The parameters are self-explanatory. Substitute your particular variables and run.

> [AZURE.NOTE] Through the the command line, I’m also automating my endpoint network filter rules by using the –tcp-endpoints parameter. I’ve opened up ports 80 and 3389 to provide access to my web page and RDP session.

Once you run the command, go to the Azure portal and you will see your machine begin to provision.

![][13]

The command prompt appears next.

![][10]

Once the deployment is complete, we should be able to connect to the web service over port 80 as we had opened the port when we provisioned the virtual machine with the Knife Azure command. As this virtual machine is the only virtual machine in my cloud service, I’ll connect it with the cloud service url.

![][11]

As you can see, I got creative with my HTML code.

Don’t forget we can also connect through an RDP session from the Azure portal via port 3389.

I hope this has been helpful! Go  and start your infrastructure as code journey with Azure today!


<!--Image references-->
[2]: ./media/virtual-machines-automation-with-chef/2.png
[3]: ./media/virtual-machines-automation-with-chef/3.png
[4]: ./media/virtual-machines-automation-with-chef/4.png
[5]: ./media/virtual-machines-automation-with-chef/5.png
[6]: ./media/virtual-machines-automation-with-chef/6.png
[7]: ./media/virtual-machines-automation-with-chef/7.png
[8]: ./media/virtual-machines-automation-with-chef/8.png
[9]: ./media/virtual-machines-automation-with-chef/9.png
[10]: ./media/virtual-machines-automation-with-chef/10.png
[11]: ./media/virtual-machines-automation-with-chef/11.png
[13]: ./media/virtual-machines-automation-with-chef/13.png


<!--Link references-->
