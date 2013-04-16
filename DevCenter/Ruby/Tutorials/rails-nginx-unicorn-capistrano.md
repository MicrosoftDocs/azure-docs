<properties linkid="dev-ruby-web-app-with-linux-vm-capistrano" urlDisplayName="Ruby on Rails Windows Azure VM Capistrano" pageTitle="Deploying a Ruby on Rails Web application to a Windows Azure Virtual Machine using Capistrano - tutorial" metaKeywords="ruby on rails, ruby on rails azure, rails azure, rails vm, capistrano azure vm, capistrano azure rails, unicorn azure vm, unicorn azure rails, unicorn nginx capistrano, unicorn nginx capistrano azure, nginx azure" metaDescription="Learn how to deploy a Ruby on Rails application to a Windows Azure Virtual Machine using Capistrano, Unicorn and Nginx." metaCanonical="" disqusComments="1" umbracoNaviHide="1" writer="larryfr" />

<div chunk="../chunks/article-left-menu.md" />

#Deploy a Ruby on Rails Web application to a Windows Azure VM using Capistrano

This tutorial describes how to deploy a Ruby on Rails-based web site to a Windows Azure Virtual Machine using [Capistrano](https://github.com/capistrano/capistrano/). This tutorial also describes how to [Nginx](http://nginx.org/) and [Unicorn](http://unicorn.bogomips.org/) to host the application on the virtual machine.

This tutorial assumes you have no prior experience using Windows Azure. Upon completing this tutorial, you will have a Ruby on Rails-based application up and running in the cloud.

You will learn how to:

* Setup your development environment

* Install Ruby and Ruby on Rails

* Install and configure Nginx and Unicorn

* Create a new Rails application

* Deploy a Rails application to a Windows Azure Virtual machine using Capistrano

The following is a screenshot of the completed application:

![a browser displaying Listing Posts][blog-rails-cloud]

<div class="dev-callout">
<strong>Note</strong>
<p>The application used for this tutorial includes native binary components. For this reason, you may encounter problems if your development environment is not Linux-based as the Gemfile.lock produced on the development machine may not include entries for the Linux compatible version of required gems.</p>
<p>Specific steps are called out for using a Windows development environment, as this represents the most significant delta from the target deployment environment. However, if you encounter errors during or after deployment that are not covered by the steps in this article, you may wish to retry the steps in this article from a Linux-based development environment.</p>

</div>

##In this article

* [Set up your development environment](#setup)

* [Create a Rails application](#create)

* [Test the application](#test)

* [Create a source repository](#repository)

* [Create a Windows Azure Virtual Machine](#createvm)

* [Test Nginx](#nginx)

* [Prepare for deployment](#capify)

* [Deploy](#deploy)

* [Next steps](#next)

##<a id="setup"></a>Set up your development environment

1. Install Ruby in your development environment. Depending on your operating system, the steps may vary.

	* **Apple OS X** - There are several Ruby distributions for OS X. This tutorial was validated on OS X by using [Homebrew](http://mxcl.github.com/homebrew/) to install **rbenv** and **ruby-build**. Installation information can be found at [https://github.com/sstephenson/rbenv/](https://github.com/sstephenson/rbenv/).

	* **Linux** - Use your distributions package management system. This tutorial was validated on Ubuntu 12.10 using the ruby1.9.1 and ruby1.9.1-dev packages.

	* **Windows** - There are several Ruby distributions for Windows. This tutorial was validated using [RailsInstaller](http://railsinstaller.org/) 1.9.3-p392.

2. Open a new command-line or terminal session and enter the following command to install Ruby on Rails:

		gem install rails --no-rdoc --no-ri

	<div class="dev-callout">
	<strong>Note</strong>
	<p>This command may require administrator or root privileges on some operating systems. If you receive an error while running this command, try using 'sudo' as follows:</p>
	<pre><code>sudo gem install rails</code></pre>
	</div>

	<div class="dev-callout">
	<strong>Note</strong>
	<p>Version 3.2.12 of the Rails gem was used for this tutorial.</p>
	</div>

3. You must also install a JavaScript interpreter, which will be used by Rails to compile CoffeeScript assets used by your Rails application. A list of supported interpreters is available at [https://github.com/sstephenson/execjs#readme](https://github.com/sstephenson/execjs#readme).
	
	[Node.js](http://nodejs.org/) was used during validation of this tutorial, as it is available for OS X, Linux and Windows operating systems.

##<a id="create"></a>Create a Rails application

1. From the command-line or terminal session, create a new Rails application named "blog_app" by using the following command:

		rails new blog_app

	This command creates a new directory named **blog_app**, and populates it with the files and sub-directories required by a Rails application.

	<div class="dev-callout">
	<strong>Note</strong>
	<p>This command may take a minute or longer to complete. It performs a silent installation of the gems required for a default application, and during this time may appear to hang.</p>
	</div>

2. Change directories to the **blog_app** directory, and then use the following command to create a basic blog scaffolding:

		rails generate scaffold Post name:string title:string content:text

	This will create the controller, view, model, and database migrations used to hold posts to the blog. Each post will have an author name, title for the post, and text content.

3. To create the database that will store the blog posts, use the following command:

		rake db:migrate

	This will use the default database provider for Rails, which is the [SQLite3 Database][sqlite3]. While you may wish to use a different database for a production application, SQLite is sufficient for the purposes of this tutorial.

##<a id="test"></a>Test the application

Perform the following steps to start the Rails server in your development environment

1. Change directories to the **blog_app** directory if you are not already there, and start the rails server using the following command:

		rails s

	You should see output similar to the following. Note the port that the web server is listening on. In the example below, it is listening on port 3000.

		=> Booting WEBrick
		=> Rails 3.2.12 application starting in development on http://0.0.0.0:3000
		=> Call with -d to detach
		=> Ctrl-C to shutdown server
		[2013-03-12 19:11:31] INFO  WEBrick 1.3.1
		[2013-03-12 19:11:31] INFO  ruby 1.9.3 (2012-04-20) [x86_64-linux]
		[2013-03-12 19:11:31] INFO  WEBrick::HTTPServer#start: pid=9789 port=3000

2. Open your browser and navigate to http://localhost:3000/. You should see a page similar to the following:

	![default rails page][default-rails]

	This page is a static welcome page. To see the forms generated by the scaffolding command, navigate to http://localhost:3000/posts. You should see a page similar to the following:

	![a page listing posts][blog-rails]

	To stop the server process, enter CTRL+C in the command-line

##<a id="repository"></a>Create a source repository

For this tutorial, we will use [Git](http://git-scm.com/) and [GitHub](https://github.com/) for version control and as a central location for our code.

1.	Create a new repository on [GitHub](https://github.com/). If you do not currently have a GitHub account, you can sign up for a free account. The steps in this tutorial assume that the repository name is **blog_app**.

	<div class="dev-callout">
	<strong>Note</strong>
	<p>The scripts created in later sections of this document will contain the address of your virtual machine and the user name used to deploy the application over SSH. For this reason, we recommend that you use a private GitHub repository if possible.</p>
	</div>

2.	From the command prompt, change directories to the **blog_app** directory and run the following commands to upload the initial version of the application to your GitHub repository:

		git init
		git add .
		git commit -m "initial commit on azure"
		git remote add origin https://github.com/YOUR_GITHUB_ACCOUNT/blog-azure.git
		git push -u origin master


##<a id="createvm"></a>Create a Windows Azure Virtual Machine

Follow the instructions given [here][vm-instructions] to create a Windows Azure virtual machine that hosts Linux.

<div class="dev-callout">
<strong>Note</strong>
<p>The steps in this tutorial were performed on a Windows Azure Virtual Machine hosting Ubuntu 12.10. If you are using a different Linux distribution, different steps may be required to accomplish the same tasks.</p>
</div>

<div class="dev-callout">
<strong>Note</strong>
<p>You <strong>only</strong> need to create the virtual machine. Stop after learning how to connect to the virtual machine using SSH.</p>
</div>

After creating the Windows Azure Virtual Machine using SSH and perform the following steps to install Ruby and Rails on the virtual machine:

1. Connect to the virtual machine using SSH and use the following commands to update existing packages and install your Ruby environment:

		sudo apt-get -y update
		sudo apt-get -y upgrade
		sudo apt-get -y install ruby1.9.1 ruby1.9.l-dev build-essential libsqlite3-dev nodejs curl git-core nginx

	After the installation completes, use the following command to verify that Ruby has been successfully installed:

		ruby -v

	This should return the version of Ruby that is installed on the virtual machine, which may be different than 1.9.1. For example, **ruby 1.9.3p194 (2012-04-20 revision 35410) [x86_64-linux]**.

2. Use the following command to install Bundler:

		sudo gem install bundler

	Bundler will be used to install the gems required by your Rails application once it has been copied to the server.

##<a id="nginx"></a>Open port 80 and test Nginx

Nginx provides a default web site that we can use to make sure our virtual machine is accepting web traffic. Perform the following steps enable traffic over port 80 and test the default Nginx web site.

2.	From the SSH session with the VM, start the Nginx service:

		sudo service nginx start

	This will start the Nginx service, which will listen for incoming traffic on port 80.

2. In your browser, navigate to the [Windows Azure Management Portal][management-portal] and select your Virtual Machine.

	![virtual machine list][vmlist]

3. Select **ENDPOINTS** at the top of the page, and then click **+ ADD ENDPOINT** at the bottom of the page.

	![endpoints page][endpoints]

4. In the **ADD ENDPOINT** dialog, click the arrow in the bottom left to continue to the second page, and enter the following information in the form:

	* **NAME**: HTTP

	* **PROTOCOL**: TCP

	* **PUBLIC PORT**: 80

	* **PRIVATE PORT**: 80

	This will create a public port of 80 that will route traffic to the private port of 80 - where Nginx is listening.

	![new endpoint dialog][new-endpoint]

5. Click the checkmark to save the endpoint.

6. A message should appear that states **UPDATE IN PROGRESS**. Once this message disappears, the endpoint is active. You may now test your application by navigating to the DNS name of your virtual machine. The web site should appear similar to the following:

	![nginx welcome page][nginx-welcome]

2.	Stop and remove the default Nginx website with the following commands:

		sudo service nginx stop
		sudo rm /etc/nginx/sites-enabled/default

	The deployment scripts ran later in this tutorial will make the blog_app the default website served by Nginx.

##<a id="capify"></a>Prepare for deployment

In this section, you will modify the application to use the Unicorn web server, enable Capistrano for deployment, enable GitHub access from the virtual machine, and create the scripts used to deploy and start the application.

1. Authorize your virtual machine to authenticate to your GitHub account using a certificate by performing the steps described on the [Generating SSH Keys](https://help.github.com/articles/generating-ssh-keys#platform-all) page. This will be used to access your GitHub repository from the deployment scripts.

	<div class="dev-callout">
	<strong>Note</strong>
	<p>While the SSH key must be generated on the virtual machine, you can add the key to your GitHub account using the browser in the development environment.</p>
	<p>To view the contents of the SSH certificate so that you can copy and paste to GitHub, use the following command:</p>
	<pre>cat ~/.ssh/id_rsa.pub</pre>
	</div>


1. On your development machine, modify the **Gemfile** and uncomment the lines for **Capistrano** and **Unicorn** by removing the '#' character from the beginning of following lines:

		# gem 'unicorn'

		# gem 'capistrano'

	<div class="dev-callout">
	<strong>Note</strong>
	<p>Unicorn is not available on Windows. If you are using Windows as your development environment, modify the <strong>Gemfile</strong> to ensure that it will only attempt to install Unicorn when deployed to the VM:</p>
	<pre><code>platforms :ruby do<br />  gem 'unicorn'<br />end</code></pre>
	</div>
 
5.	Run the following commands to install the new gems and setup Capistrano for your project:
		
		bundle
		capify .

6.	Add the following files to the **blog_app/config** directory and populate each file with the contents found at the links below:

	* [nginx.conf](https://gist.github.com/cff582f4f970a95991e9) - Configures Nginx to work with Unicorn and serve the static files included with the Rails application
	* [unicorn_init.sh](https://gist.github.com/3272994) - The shell script used to start the Unicorn server process
	* [unicorn.rb](https://gist.github.com/3273014) - The configuration file for Unicorn

	In each file, replace the word **blogger** with the username used to login to your virtual machine. This is the user that will be used to deploy the application.

7.  In the **blog_app/config** directory, edit the **deploy.rb** file and replace the existing contents with the following:

		require "bundler/capistrano"

		set :application, "blog_app"
		set :user, "blogger"

		set :scm, :git
		set :repository, "git@github.com:YourGitHubAccount/blog_app.git"
		set :branch, "master"
		set :use_sudo, true

		server "VMDNSName", :web, :app, :db, primary: true

		set :deploy_to, "/home/#{user}/apps/#{application}"
		default_run_options[:pty] = true
		ssh_options[:forward_agent] = true
		ssh_options[:port] = SSHPort

		namespace :deploy do
		  desc "Fix permissions"
		  task :fix_permissions, :roles => [ :app, :db, :web ] do
		  	run "chmod +x #{release_path}/config/unicorn_init.sh"
		  end

		  %w[start stop restart].each do |command|
		    desc "#{command} unicorn server"
		    task command, roles: :app, except: {no_release: true} do
		      run "service unicorn_#{application} #{command}"
		    end
		  end

		  task :setup_config, roles: :app do
		    sudo "ln -nfs #{current_path}/config/nginx.conf /etc/nginx/sites-enabled/#{application}"
		    sudo "ln -nfs #{current_path}/config/unicorn_init.sh /etc/init.d/unicorn_#{application}"
		    sudo "mkdir -p #{shared_path}/config"
		  end
		  after "deploy:setup", "deploy:setup_config"

		  task :symlink_config, roles: :app do
		    # Add database config here
		  end
		  after "deploy:finalize_update", "deploy:fix_permissions"
		  after "deploy:finalize_update", "deploy:symlink_config"
		end

	In the above text, replace the following:

	* **YourGitHubAccount** with your GitHub account name
	* **VMDNSName** with the DNS of your Windows Azure virtual machine
	* **blogger** with the username used to login to your virtual machine
	* **SSHPort** with the external SSH port for your virtual machine

	<div class="dev-callout">
	<strong>Note</strong>
	<p>If your development environment is a Windows system, you must add the following line to the <b>deploy.rb</b> file. This should be placed along with the other <b>set</b> statements at the beginning of the file:</p>
	<pre>set :bundle_flags, "--no-deployment --quiet"</pre>
	<p>This is not best practice, as it causes gems to be loaded from the Gemfile during deployment instead of the Gemfile.lock, but is required since the target system (Linux) is different than the development system (Windows).</p>
	</div>

7.	Uncomment the assets line in the **Capfile** located in the **blog_app** directory.

		load 'deploy/assets'

8.	Run the following commands to commit the changes to the project and upload them to GitHub.

		git add .
		git commit -m "adding config files"
		git push

##<a id="deploy"></a>Deploy

2.	From your local development machine, use the following command to setup the remote Windows Azure VM for deployment.

		cap deploy:setup

	When prompted, enter the password for the virtual machine user account. Capistrano will connect to the VM and create an **apps** directory under the home directory of the user account.

3.	From an SSH connection to Windows Azure VM, modify the permissions of the **app** directory by using the following command:
		
		sudo chmod -R 777 apps

	<div class="dev-callout">
	<strong>Note</strong>
	<p>This is not suggested for production environments, and is only being used now for demonstration purposes.</p>
	</div>

4.	Do a cold deploy using the following command on your development environment. This will deploy the application to the virtual machine and start the Unicorn service.

		cap deploy:cold

3.	Start the Nginx service, which should begin routing traffic to Unicorn and serving static content:

		sudo service nginx start

At this point, your Ruby on Rails application should be running on your Windows Azure virtual machine. To verify this, enter the DNS name of your virtual machine in your web browser. For example, http://railsvm.cloudapp.net. The 'Welcome aboard' screen should appear:

![welcome aboard page][default-rails-cloud]

If you append '/posts' to the URL, the posts index should appear and you should be able to create, edit and delete posts.

##<a id="next"></a>Next steps

In this article you have learned how to create and publish a basic forms-based Rails application to a Windows Azure Virtual Machine using Capistrano. The virtual machine used Unicorn and Nginx to handle web requests to the application.

While Capistrano is a popular deployment method for Ruby on Rails applications, it is not the only one. To see another method of deploying an application to a virtual machine, see [Deploying Ruby on Rails to a Windows Azure VM using Chef].

If you would like to learn more about Ruby on Rails, visit the [Ruby on Rails Guides][rails-guides].

[vm-instructions]: /en-us/manage/linux/tutorials/virtual-machine-from-gallery/
[unicorn-nginx-capistratno]: /en-us/develop/ruby/tutorials/unicorn-nginx-capistrano/
[sql-rails]: /en-us/develop/ruby/howto/sql-rails/
[rails-guides]: http://guides.rubyonrails.org/

 
[blog-rails]: ../media/blograilslocal.png
[blog-rails-cloud]: ../media/blograilscloud.png 
[default-rails]: ../media/basicrailslocal.png
[default-rails-cloud]: ../media/basicrailscloud.png
[vmlist]: ../media/vmlist.png
[endpoints]: ../media/endpoints.png
[new-endpoint]: ../media/newendpoint80.png
[nginx-welcome]: ../media/welcomenginx.png

[management-portal]: https://manage.windowsazure.com/
[sqlite3]: http://www.sqlite.org/