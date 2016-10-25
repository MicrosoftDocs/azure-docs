<properties
	pageTitle="Host a Ruby on Rails website on a Linux VM | Microsoft Azure"
	description="Set up and host a Ruby on Rails-based website on Azure using a Linux virtual machine."
	services="virtual-machines-linux"
	documentationCenter="ruby"
	authors="rmcmurray"
	manager="wpickett"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="web"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="ruby"
	ms.topic="article"
	ms.date="08/11/2016"
	ms.author="robmcm"/>

# Ruby on Rails Web application on an Azure VM

This tutorial shows how to host a Ruby on Rails website on Azure using a Linux virtual machine.  

This tutorial was validated using Ubuntu Server 14.04 LTS. If you use a different Linux distribution, you might need to modify the steps to install Rails.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]

## Create an Azure VM

Start by creating an Azure VM with a Linux image.

To create the VM, you can use the Azure classic portal or the Azure Command-Line Interface (CLI).

### Azure Management Portal

1. Sign into the [Azure classic portal](http://manage.windowsazure.com)
2. Click **New** > **Compute** > **Virtual Machine** > **Quick Create**. Select a Linux image.
3. Enter a password.

After the VM is provisioned, click on the VM name, and click **Dashboard**. Find the SSH endpoint, listed under **SSH Details**.

### Azure CLI

Follow the steps in [Create a Virtual Machine Running Linux][vm-instructions].

After the VM is provisioned, you can get the SSH endpoint by running the following command:

	azure vm endpoint list <vm-name>  

## Install Ruby on Rails

1. Use SSH to connect to the VM.

2. From the SSH session, use the following commands to install Ruby on the VM:

		sudo apt-get update -y
		sudo apt-get upgrade -y
		sudo apt-get install ruby ruby-dev build-essential libsqlite3-dev zlib1g-dev nodejs -y

	The installation may take a few minutes. When it completes, use the following command to verify that Ruby is installed:

		ruby -v

	This returns the version of Ruby that was installed.

3. Use the following command to install Rails:

		sudo gem install rails --no-rdoc --no-ri -V

	Use the --no-rdoc and --no-ri flags to skip installing the documentation, which is faster.
	This command will likely take a long time to execute, so adding the -V will display information about the installation progress.

## Create and run an app

While still logged in via SSH, run the following commands:

	rails new myapp
	cd myapp
	rails server -b 0.0.0.0 -p 3000

The [new](http://guides.rubyonrails.org/command_line.html#rails-new) command creates a new Rails app. The [server](http://guides.rubyonrails.org/command_line.html#rails-server) command starts the WEBrick web server that comes with Rails. (For production use, you would probably want to use a different server, such as Unicorn or Passenger.)

You should see output similar to the following.

	=> Booting WEBrick
	=> Rails 4.2.1 application starting in development on http://0.0.0.0:3000
	=> Run `rails server -h` for more startup options
	=> Ctrl-C to shutdown server
	[2015-06-09 23:34:23] INFO  WEBrick 1.3.1
	[2015-06-09 23:34:23] INFO  ruby 1.9.3 (2013-11-22) [x86_64-linux]
	[2015-06-09 23:34:23] INFO  WEBrick::HTTPServer#start: pid=27766 port=3000

## Add an endpoint

1. Go to the [Azure classic portal][management-portal] and select your VM.

	![virtual machine list][vmlist]

2. Select **ENDPOINTS** at the top of the page, and then click **+ ADD ENDPOINT** at the bottom of the page.

	![endpoints page][endpoints]

3. In the **ADD ENDPOINT** dialog, select "Add a standalone endpoint" and click the **Next** arrow.

	![new endpoint dialog][new-endpoint1]

3. In the next dialog page, enter the following information:

	* **NAME**: HTTP

	* **PROTOCOL**: TCP

	* **PUBLIC PORT**: 80

	* **PRIVATE PORT**: 3000

	This will create a public port of 80 that will route traffic to the private port of 3000, where the Rails server is listening.

	![new endpoint dialog][new-endpoint]

4. Click the check mark to save the endpoint.

5. A message should appear that states **UPDATE IN PROGRESS**. Once this message disappears, the endpoint is active. You may now test your application by navigating to the DNS name of your virtual machine. The website should appear similar to the following:

	![default rails page][default-rails-cloud]

## Next steps

In this tutorial, you did most of the steps manually. In a production environment, you would write your app on a development machine and deploy it to the Azure VM. Also, most production environments host the Rails application in conjunction with another server process such as Apache or NginX, which handles request routing to multiple instances of the Rails application and serving static resources. For more information, see http://rubyonrails.org/deploy/.

To learn more about Ruby on Rails, visit the [Ruby on Rails Guides][rails-guides].

To use Azure services from your Ruby application, see:

* [Store unstructured data using blobs][blobs]

* [Store key/value pairs using tables][tables]

* [Serve high bandwidth content with the Content Delivery Network][cdn-howto]

<!-- WA.com links -->
[blobs]: ../storage/storage-ruby-how-to-use-blob-storage.md
[cdn-howto]: https://azure.microsoft.com/develop/ruby/app-services/
[management-portal]: https://manage.windowsazure.com/
[tables]: ../storage/storage-ruby-how-to-use-table-storage.md
[vm-instructions]: virtual-machines-linux-classic-createportal.md

<!-- External Links -->
[rails-guides]: http://guides.rubyonrails.org/
[sqlite3]: http://www.sqlite.org/

<!-- Images -->

[default-rails-cloud]: ./media/virtual-machines-linux-classic-ruby-rails-web-app/basicrailscloud.png
[vmlist]: ./media/virtual-machines-linux-classic-ruby-rails-web-app/vmlist.png
[endpoints]: ./media/virtual-machines-linux-classic-ruby-rails-web-app/endpoints.png
[new-endpoint]: ./media/virtual-machines-linux-classic-ruby-rails-web-app/newendpoint.png
[new-endpoint1]: ./media/virtual-machines-linux-classic-ruby-rails-web-app/newendpoint1.png
