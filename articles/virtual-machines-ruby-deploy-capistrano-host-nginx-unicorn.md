<properties 
	pageTitle="Deploying a Ruby on Rails Web application to an Azure Virtual Machine using Capistrano - tutorial" 
	description="Learn how to deploy a Ruby on Rails application to an Azure Virtual Machine using Capistrano, Unicorn and Nginx." 
	authors="wpickett" 
	manager="wpickett" 
	editor="" 
	services="virtual-machines" 
	documentationCenter=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="web" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="ruby" 
	ms.topic="article" 
	ms.date="02/19/2015" 
	ms.author="wpickett"/>


#Deploy a Ruby on Rails Web application to an Azure VM using Capistrano

This tutorial describes how to deploy a Ruby on Rails website to an Azure Virtual Machine using [Capistrano 3](https://github.com/capistrano/capistrano/). Once deployed, you will use [Nginx](http://nginx.org/) and [Unicorn](https://github.com/blog/517-unicorn) to host the website. [PostgreSQL](https://www.postgresql.org) will store application data for the deployed application.

This tutorial assumes you have no prior experience using Azure, but assumes that you are familiar with Ruby, Rails, Git, and Linux. Upon completing this tutorial, you will have a Ruby on Rails-based application up and running in the cloud.

You will learn how to:

* Setup your development and production environments

* Install Ruby and Ruby on Rails

* Install Unicorn, Nginx, and PostgreSQL

* Create a new Rails application

* Create a Capistrano deployment and use it to deploy the application

The following is a screenshot of the completed application:

![a browser displaying Listing Posts][blog-rails-cloud]

> [AZURE.NOTE] The application used for this tutorial includes native binary components. You may encounter errors when deploying to the VM if your development environment is not Linux-based. The Gemfile.lock file used during deployment will contain platform-specific gems, which may not include entries for the native Linux versions of the gems required on the VM.
> 
> Specific steps are called out for using a Windows development environment. However, if you encounter errors during or after deployment that are not covered in this article, you may wish to retry the steps in this article from a Linux-based development environment.

##In this article

* [Set up your development environment](#setup)

* [Create a Rails application](#create)

* [Test the application](#test)

* [Create a source repository](#repository)

* [Create an Azure Virtual Machine](#createvm)

* [Test Nginx](#nginx)

* [Prepare for deployment](#capify)

* [Deploy](#deploy)

* [Next steps](#next)

##<a id="setup"></a>Set up your development environment

1. Install Ruby in your development environment. Depending on your operating system, the steps may vary.

	* **Apple OS X** - There are several Ruby distributions for OS X. This tutorial was validated on OS X by using [Homebrew](http://brew.sh/) to install **rbenv**, **ruby-build**, and **Ruby 2.0.0-p451**. Installation information can be found at [https://github.com/sstephenson/rbenv/](https://github.com/sstephenson/rbenv/).

	* **Linux** - Use your distributions package management system. This tutorial was validated on Ubuntu 12.10 using **rbenv**, **ruby-build**, and **Ruby 2.0.0-p451**.

	* **Windows** - There are several Ruby distributions for Windows. This tutorial was validated using [RubyInstaller](http://RubyInstaller.org/) to install **Ruby 2.0.0-p451**. Commands were issued using the **GitBash** command-line available with [Git for Windows](http://git-scm.com/download/win).

2. Open a new command-line or terminal session and enter the following command to install Ruby on Rails:

		gem install rails --no-rdoc --no-ri

	> [AZURE.NOTE] This may require administrator or root privileges on some operating systems. If you receive an error while running this command, try using 'sudo' as follows.
	> 
	> `sudo gem install rails`

	> [AZURE.NOTE] Version 4.0.4 of the Rails gem was used for this tutorial.

3. You must also install a JavaScript interpreter, which will be used by Rails to compile CoffeeScript assets used by your Rails application. A list of supported interpreters is available at [https://github.com/sstephenson/execjs#readme](https://github.com/sstephenson/execjs#readme).
	
	> [AZURE.NOTE] [Node.js](http://nodejs.org/) was used for this tutorial, as it is available for OS X, Linux and Windows operating systems.

##<a id="create"></a>Create a Rails application

1. From the command-line or terminal session, create a new Rails application named "blog_app" by using the following command:

		rails new blog_app

	This creates a new directory named **blog_app**, and populates it with the files and sub-directories required by a Rails application.

	> [AZURE.NOTE] This command may take a minute or longer to complete. It performs a silent installation of the gems required for a default application, and will be unresponsive during this time.

2. Change directories to the **blog_app** directory, and then use the following command to create a basic blog scaffolding:

		rails generate scaffold Post name:string title:string content:text

	This will create the controller, view, model, and database migrations used to hold posts to the blog. Each post will have an author name, title for the post, and text content.

3. To create the database that will store the blog posts, use the following command:

		rake db:migrate

	This will create the database schema for storing posts using the default database provider for Rails, which is the [SQLite3 Database][sqlite3].

4. To display an index of posts as the home page, modify the **config/routes.rb** file and add the following after the `resources :posts` line.

		root 'posts#index'

	This will display a list of posts when users visit the website.

##<a id="test"></a>Test the application

1. Change directories to the **blog_app** directory if you are not already there, and start the rails server using the following command.

		rails s

	You should see output similar to the following. Note the port that the web server is listening on. In the example below, it is listening on port 3000.

		=> Booting WEBrick
		=> Rails 4.0.4 application starting in development on http://0.0.0.0:3000
		=> Call with -d to detach
		=> Ctrl-C to shutdown server
		[2013-03-12 19:11:31] INFO  WEBrick 1.3.1
		[2013-03-12 19:11:31] INFO  ruby 2.0.0 (2014-02-24) [x86_64-linux]
		[2013-03-12 19:11:31] INFO  WEBrick::HTTPServer#start: pid=9789 port=3000

2. Open your browser and navigate to http://localhost:3000/. You should see a page similar to the following.

	![a page listing posts][blog-rails]

	To stop the server process, enter CTRL+C in the command-line

##<a id="repository"></a>Create a source repository

When deploying an application using Capistrano, the files to are pulled from a repository. For this tutorial, we will use [Git](http://git-scm.com/) for version control and [GitHub](https://github.com/) for the repository.

1.	Create a new repository on [GitHub](https://github.com/). If you do not have a GitHub account, you can sign up for one for free. The following steps assume that the repository name is **blog_app**.

	> [AZURE.NOTE] To support automated deployments of your application, you should use SSH keys to authenticate to GitHub. For more information, see the GitHub documentation on [Generating SSH Keys](https://help.github.com/articles/generating-ssh-keys).

2.	From the command prompt, change directories to the **blog_app** directory and run the following commands to upload the application to your GitHub repository. Replace **YourGitHubName** with the name of your GitHub account.

		git init
		git add .
		git commit -m "initial commit on azure"
		git remote add origin git@github.com:YourGitHubName/blog-azure.git
		git push -u origin master

In the next section, you will create the Virtual Machine that this application will be deployed to.

##<a id="createvm"></a>Create an Azure Virtual Machine

Follow the instructions given [here][vm-instructions] to create an Azure virtual machine that hosts Linux.

1. Sign in to the Azure [Management Portal][management-portal]. On the command bar, select **New**.

2. Select **Virtual Machine**, and then select **From Gallery**.

3. From **Choose an image**, select **Ubuntu**, and then select version **12.04 LTS**. Select the arrow to continue.

	> [AZURE.NOTE] The steps in this tutorial were performed on an Azure Virtual Machine hosting Ubuntu 12.04 LTS. If you are using a different Linux distribution, different steps may be required to accomplish the same tasks.

4. In the **Virtual Machine Name** type the name you want to use. This name will be used to create the domain name of this virtual machine.

5. In **New User Name**, type the name of the administrator account for this machine.

	> [AZURE.NOTE] For this tutorial, the administrator account will also be used to deploy the application. For information on creating a separate account for deployment, see the [Capistrano][capistrano] documentation.

6. Under **Authentication**, check **Upload compatible SSH key for authentication**, then browse and select the **.pem** file containing the certificate. Finally, select the arrow to continue.

	> [AZURE.NOTE] If you are unfamiliar with generating or using an SSH key, see [How to use SSH with Linux on Azure][ssh-on-azure] for instructions on creating SSH keys.
	> 
	> You may also enable password authentication, however the SSH Key must also be provided, as it is used to automate deployment.

7. Under **Endpoints**, use the **Enter or select a value** dropdown to select **HTTP**. The other fields on this page can be left at the default values. Make a note of the **Cloud service DNS name**, as this value will be used by later steps. Finally, select the arrow to continue.

8. On the final page, select the checkmark to create the virtual machine.

###Install Git, Ruby, and Nginx

After the virtual machine has been created, connect to it using SSH and use the following commands to prepare the hosting environment for your Ruby application.

	sudo apt-get update
	sudo apt-get -y upgrade
	sudo apt-get -y install git build-essential libssl-dev curl nodejs nginx
	git clone git://github.com/sstephenson/rbenv.git ~/.rbenv
	echo 'export RBENV_ROOT=~/.rbenv' >> ~/.bash_profile
	echo 'export PATH="$RBENV_ROOT/bin:$PATH"' >> ~/.bash_profile
	echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
	source ~/.bash_profile
	eval "$(rbenv init -)"
	git clone git://github.com/sstephenson/ruby-build.git
	cd ruby-build
	sudo ./install.sh
	~/.rbenv/bin/rbenv install 2.0.0-p451
	~/.rbenv/bin/rbenv global 2.0.0-p451
	gem install bundler
	~/.rbenv/bin/rbenv rehash

> [AZURE.NOTE] You may wish to save the above into a script (.sh file,) to avoid typos when executing the commands.
> 
> The **~/.rbenv/bin/rbenv install 2.0.0-p451** command can take several minutes to complete.

The above commands performs the following actions:
	
* Updates and upgrades currently installed packages
* Installs build tools
* Installs Git
* Installs Node.js
* Installs Nginx
* Installs build tools and other utilities required by Ruby and Rails
* Sets up a local (user) deployment of [rbenv]
* Installs Ruby 2.0.0-p451
* Installs the [Bundler] gem

After the installation completes, use the following command to verify that Ruby has been successfully installed:

	ruby -v

This should return `ruby 2.0.0p451` as the version.

###Install PostgreSQL

The default database used by Rails for development is SQLite. Usually you will use something different in production. The following steps install PostgreSQL on the virtual machine, then create a user and database. Later steps will configure the Rails application to use PostgreSQL during deployment.

1. Install PostgreSQL and development bits using the following command.

		sudo apt-get -y install postgresql postgresql-contrib libpq-dev

6. Use the following commands to create a user and database for your login. Replace **my_username** and **my_database** with the name of your login. For example, if the login for your vm is **deploy**, replace **my_username** and **my_database** with **deploy**.

		sudo -u postgres createuser -D -A -P my_username
		sudo -u postgres createdb -O my_username my_database

	> [AZURE.NOTE] Use the user name for the database name as well. This is required for the capistrano-postgresql gem used by this application.

	When prompted, enter a password for the user. When prompted to allow the user to create new roles, select **y**, as this user will be used during deployment to create the database and login that will be used by your Rails application.

7. To verify that you can connect to the database using the user account, use the following command. Replace **my_username** and **my_database** with the values used previously.

		psql -U my_username -W my_database

	You should arrive at a `database=>` prompt. To exit the psql utility, enter `\q` at the prompt.

###<a id="nginx"></a>Test Nginx

The HTTP endpoint added during the creation of the virtual machine will allow it to accept HTTP requests over port 80. To verify this, use the following steps to verify you can access the default site created by Nginx.

2.	From the SSH session with the VM, start the Nginx service:

		sudo service nginx start

	This will start the Nginx service, which will listen for incoming traffic on port 80.

6. Test your application by navigating to the DNS name of your virtual machine. The website should appear similar to the following:

	![nginx welcome page][nginx-welcome]

	> [AZURE.NOTE] The deployment scripts used later in this tutorial will make the blog_app the default website served by Nginx.

At this point, you have an Azure Virtual Machine with Ruby, Nginx, and PostgreSQL that is ready for your deployment. In the next section, you will modify your Rails application to add the scripts and information that perform the deployment.

##<a id="capify"></a>Prepare for deployment

On your development environment, modify the application to use the Unicorn web server, PostgreSQL, and enable Capistrano for deployment, and create the scripts used to deploy and start the application.

1. On your development machine, modify the **Gemfile** and add the following lines to add gems for Unicorn, PostgreSQL, Capistrano and related gems to your Rails application

		# Use Unicorn
		gem 'unicorn'
		# Use PostgreSQL
		gem 'pg', group: :production

		group :development do
		  # Use Capistrano for deployment
		  gem 'capistrano', '~> 3.1'
		  gem 'capistrano-rails', '~> 1.1.1'
		  gem 'capistrano-bundler'
		  gem 'capistrano-rbenv', '~> 2.0'
		  gem 'capistrano-unicorn-nginx', '~> 2.0'
		  gem 'capistrano-postgresql', '~> 3.0'
		end

	> [AZURE.NOTE] Unicorn is not available on Windows. If you are using Windows as your development environment, modify the __Gemfile__ to ensure that it will only attempt to install Unicorn when deployed to the VM by using the following when specifying the unicorn gem.
	> 
	> `platforms :ruby do`
	> `  gem 'unicorn'`
	> `end`

	Most of the capistraon-* gems are helpers that work with specific things we are using on the production server (rbenv,) or the framework (rails).

	The capistrano-unicorn-nginx gem automatically creates scripts used with Unicorn and Nginx during deployment so we don't have to create these manually. The capistrano-postgresql automatically generates a database, user, and password in PostgreSQL for your application. While you don't have to use these, they both make the deployment process much simplier.
 
5.	Use the following commands to install the new gems.
		
		bundle

6. Use the following command to create default deployment files used by Capistrano.

		cap install

	After the `cap install` command completes, the following files and directories will have been added to your application.

		├── Capfile
		├── config
		│   ├── deploy
		│   │   ├── production.rb
		│   │   └── staging.rb
		│   └── deploy.rb
		└── lib
		    └── capistrano
		            └── tasks

	The **deploy.rb** file provides generic configuration and actions for all types of deployments, while **production.rb** and **staging.rb** contain additional configuration for production and staging deployments.

	The **capistrano** folder contains tasks and other files that are used as part of the deployment process.

5. Edit the **Capfile** in the root of your application, and uncomment the following lines by removing the __#__ character from the beginning of the line.

		require 'capistrano/rbenv'
		require 'capistrano/bundler'
		require 'capistrano/rails/assets'
		require 'capistrano/rails/migrations'

	After uncommenting the previous lines, add the following lines.

		require 'capistrano/unicorn_nginx'
		require 'capistrano/postgresql'

	These lines instruct Capistrano to use the gems that were previously added to the Gemfile.

	After making the above changes, save the file.

6.  Edit the **config/deploy.rb** file and replace the file contents with the following. Replace **YourApplicationName** with the name of your application and replace **https://github.com/YourGitHubName/YourRepoName.git** with the URL of the GitHub repository for this project.

		lock '3.1.0'
		# application name and the github repository
		set :application, 'YourApplicationName'
		set :repo_url, 'git@github.com:YourGitHubName/YourRepoName.git'
		
		# describe the rbenv environment we are deploying into
		set :rbenv_type, :user
		set :rbenv_ruby, '2.0.0-p451'
		set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
		set :rbenv_map_bins, %w{rake gem bundle ruby rails}
		
		# dirs and files we want symlinked to the shared folder
		# during deployment
		set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}
		set :linked_files, %w{config/database.yml config/unicorn.rb}
		
		namespace :deploy do

		  desc 'Restart application'
		  task :restart do
		    on roles(:app), in: :sequence, wait: 5 do
		      # Your restart mechanism here, for example:
		      # execute :touch, release_path.join('tmp/restart.txt')
              #
			  # The capistrano-unicorn-nginx gem handles all this
			  # for this example
		    end
		  end
		
		  after :publishing, :restart
		
		  after :restart, :clear_cache do
		    on roles(:web), in: :groups, limit: 3, wait: 10 do
		      # Here we can do anything such as:
		      # within release_path do
		      #   execute :rake, 'cache:clear'
		      # end
		    end
		  end
		
		end

	This file provides generic information and tasks that are common to all deployment types.

5.  Edit the **config/deploy/production.rb** file and replace the existing content with the following. Replace **YourVm.cloudapp.net** with the domain name of your VM. Replace **YourAzureVMUserName** with the login account created previously for your Azure VM.

		# production deployment
		set :stage, :production
		# use the master branch of the repository
		set :branch, "master"
		# the user login on the remote server
		# used to connect and deploy
		set :deploy_user, "YourAzureVMUserName"
		# the 'full name' of the application
		set :full_app_name, "#{fetch(:application)}_#{fetch(:stage)}"
		# the server(s) to deploy to
		server 'YourVM.cloudapp.net', user: 'YourAzureVMUserName', roles: %w{web app db}, primary: true
		# the path to deploy to
		set :deploy_to, "/home/#{fetch(:deploy_user)}/apps/#{fetch(:full_app_name)}"
        # set to production for Rails
		set :rails_env, :production

	This file provides information specific to production deployments.

8.	Run the following commands to commit the changes to the files you modified in previous steps, and then upload the changes to GitHub.

		git add .
		git commit -m "adding config files"
		git push

The application should now be ready for deployment.

> [AZURE.NOTE] For a more complex application, or for a different database or application server, you may need additional configuration or deployment scripts.

##<a id="deploy"></a>Deploy

2.	From your local development machine, use the following command to deploy the configuration files used by the application to the VM.

		bundle exec cap production setup

	Capistrano will connect to the VM using SSH, and then create the directory (~/apps) that the application will be deployed to. If this is the first deployment, the capistrano-postgresql gem will also create a role and database in PostgreSQL on the server. It will also create a database.yml configuration file that Rails will used to connect to the database.

	> [AZURE.NOTE] If you receive an error of **Error reading response length from authentication socket** when deploying, you may need to start the SSH agent on your development environment using the `ssh-agent` command. For example, adding `eval $(ssh-agent)` to your ~/.bash\_profile file.
	> 
	> You may also need to add the SSH key to the agent cache using the `ssh-add` command.

4.	Perform a production deploy using the following command. This will deploy the application to the virtual machine, start the Unicorn service, and configure Nginx to route traffic to Unicorn.

		bundle exec cap production deploy

	This command will deploy the application to the VM, install required gems, and then start/restart Unicorn and Nginx.

	> [AZURE.NOTE] The process may pause for several minutes during processing.

	> [AZURE.NOTE] Some portions of the deployment may return 'exit status 1 (failed).' These can generally be ignored as long as the deployment completes successfully.

	> [AZURE.NOTE] On some systems, you may encounter a situation where the SSH Agent cannot forward credentials to the remote VM when authenticating to GitHub. If this occurs, you can work around the error by modifying the **config/deploy.rb** file and change the `set :repo_url` line to use HTTPS when accessing GitHub. When using HTTPS, you must specify your GitHub user name and password (or authentication token,) as part of the URL. For example:
	> 
	> `set :repo_url, 'https://you:yourpassword@github.com/You/yourrepository.git'
	> 
	> While this should allow you to bypass the error and complete this tutorial, this is not a recommended solution for a production deployment, as it stores your authentication credentials in plain text as part of the application. You should consult documentation for your operating system on using forwarding with the SSH Agent

At this point, your Ruby on Rails application should be running on your Azure virtual machine. To verify this, enter the DNS name of your virtual machine in your web browser. For example, http://railsvm.cloudapp.net. The  posts index should appear and you should be able to create, edit and delete posts.

##<a id="next"></a>Next steps

In this article you have learned how to create and publish a basic Rails application to an Azure Virtual Machine using Capistrano. Working with a basic application such as the one in this article only scratches the surface of what you can do using Capistrano for deployment. For more information on using Capistrano, see:

* [Capistranorb.com](http://capistranorb.com) - The Capistrano site.
* [Azure, Ruby on Rails, Capistrano 3, & PostgreSQL](http://wootstudio.ca/articles/tutorial-windows-azure-ruby-on-rails-capistrano-3-postgresql) - An alternative approach to deploying to Azure that involves custom deployment scripts.
* [Capistrano 3 tutorial](http://www.talkingquickly.co.uk/2014/01/deploying-rails-apps-to-a-vps-with-capistrano-v3/) - A tutorial on working with Capistrano 3.

For a more basic example of creating and deploying a Rails application to an Azure VM using only SSH, see [Host a Ruby on Rails Web App using a Linux Virtual Machine][ruby-vm].

If you would like to learn more about Ruby on Rails, visit the [Ruby on Rails Guides][rails-guides].

To learn how to use the Azure SDK for Ruby to access Azure services from your Ruby application, see:

* [Store unstructured data using blobs][blobs]

* [Store key/value pairs using tables][tables]

* [Serve high bandwidth content with the Content Delivery Network][cdn-howto]

[vm-instructions]: /manage/linux/tutorials/virtual-machine-from-gallery/


[rails-guides]: http://guides.rubyonrails.org/
[blobs]: /develop/ruby/how-to-guides/blob-storage/
[tables]: /develop/ruby/how-to-guides/table-service/
[cdn-howto]: /develop/ruby/app-services/
[ruby-vm]: /develop/ruby/tutorials/web-app-with-linux-vm/
 
[blog-rails]: ./media/virtual-machines-ruby-deploy-capistrano-host-nginx-unicorn/blograilslocal.png
[blog-rails-cloud]: ./media/virtual-machines-ruby-deploy-capistrano-host-nginx-unicorn/blograilscloud.png 
[default-rails]: ./media/virtual-machines-ruby-deploy-capistrano-host-nginx-unicorn/basicrailslocal.png
[default-rails-cloud]: ./media/virtual-machines-ruby-deploy-capistrano-host-nginx-unicorn/basicrailscloud.png
[vmlist]: ./media/virtual-machines-ruby-deploy-capistrano-host-nginx-unicorn/vmlist.png
[endpoints]: ./media/virtual-machines-ruby-deploy-capistrano-host-nginx-unicorn/endpoints.png
[new-endpoint]: ./media/virtual-machines-ruby-deploy-capistrano-host-nginx-unicorn/newendpoint80.png
[nginx-welcome]: ./media/virtual-machines-ruby-deploy-capistrano-host-nginx-unicorn/welcomenginx.png

[management-portal]: https://manage.windowsazure.com/
[sqlite3]: http://www.sqlite.org/
[ssh-on-azure]: http://azure.microsoft.com/documentation/articles/linux-use-ssh-key/
[capistrano]: http://capistranorb.com
