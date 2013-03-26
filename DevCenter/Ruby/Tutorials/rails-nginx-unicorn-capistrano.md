<properties linkid="dev-ruby-web-app-with-linux-vm" urlDisplayName="Ruby on Rails Windows Azure VM" pageTitle="Ruby on Rails Web application in a Windows Azure Virtual Machine - tutorial" metaKeywords="ruby on rails, ruby on rails azure, rails azure, rails vm" metaDescription="Learn how to create a Ruby on Rails application that is hosted in a Windows Azure Virtual Machine." metaCanonical="" disqusComments="1" umbracoNaviHide="1" writer="larryfr" />

<div chunk="../chunks/article-left-menu.md" />

#Ruby on Rails Web application on a Windows Azure VM

This tutorial describes how to use Nginx and Unicorn to host a Ruby on Rails-based web site on Windows Azure using a Linux virtual machine. This tutorial also describes how to use Capistrano to deploy the application to the Windows Azure virtual machine.

This tutorial assumes you have no prior experience using Windows Azure. Upon completing this tutorial, you will have a Ruby on Rails-based application up and running in the cloud.

You will learn how to:

* Setup your development environment

* Setup a Windows Azure virtual machine

* Install Ruby and Ruby on Rails

* Install and configure Nginx and Unicorn

* Create a new Rails application

* Deploy a Rails application using Capistrano

The following is a screenshot of the completed application:

![a browser displaying Listing Posts][blog-rails-cloud]

##In this article

* [Set up your development environment](#setup)

* [Create a Rails application](#create)

* [Test the application](#test)

* [Create a Windows Azure Virtual Machine](#createvm)

* [Copy the application to the VM](#copy)

* [Install gems and start the application](#start)

* [Next steps](#next)

##<a id="setup"></a>Set up your development environment

1. Install Ruby in your development environment. Depending on your operating system, the steps may vary.

	* **Apple OS X** - There are several Ruby distributions for OS X. This tutorial was validated on OS X by using [Homebrew](http://mxcl.github.com/homebrew/) to install **rbenv** and **ruby-build**. Installation information can be found at [https://github.com/sstephenson/rbenv/](https://github.com/sstephenson/rbenv/).

	* **Linux** - Use your distributions package management system. This tutorial was validated on Ubuntu 12.10 using the ruby1.9.1 and ruby1.9.1-dev packages.

	* **Windows** - There are several Ruby distributions for Windows. This tutorial was validated using [RubyInstaller](http://rubyinstaller.org/) 1.9.3-p392.

2. Use the following command to install the latest version of Rails:

		gem install rails

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

1. Open a new command-line or terminal session and create a new Rails application named "blog_app" by using the following command:

		rails new blog_app

	This command creates a new directory named **blog_app**, and populates it with the files and sub-directories required by a Rails application. Finally the **bundle install** command will be ran to install gems listed in the **Gemfile** created by the **rails new** command.

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

After creating the Windows Azure Virtual Machine, perform the following steps to install Ruby and Rails on the virtual machine:

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

	Subsequent steps in this tutorial will create a link from /etc/nginx/sites-enabled to your blog website.

##<a id="repository"></a>Create a source repository

For this tutorial, we will use [Git](http://git-scm.com/) and [GitHub](https://github.com/) for version control and as a central location for our code.

1.	Create a new repository within your account on [GitHub](https://github.com/).

	<div class="dev-callout">
	<strong>Note</strong>
	<p>The scripts created in the next section will contain the address of your server and the user name used to deploy the application over SSH. For this reason, we recommend that you use a private GitHub repository if possible.</p>
	</div>

2.	Run the following commands from within the on your local computer to upload the initial version of the application:

		git init
		git add .
		git commit -m "initial commit on azure"
		git remote add origin https://github.com/YOUR_GITHUB_ACCOUNT/blog-azure.git
		git push -u origin master

##<a id="capify"></a>Prepare for deployment

In this section, you will modify the application to use the [Unicorn](http://unicorn.bogomips.org/) web server, enable [Capistrano](https://github.com/capistrano/capistrano/) for deployment, and create the scripts used to deploy and start the application.

1. On your development machine, modify the **Gemfile** and uncomment the lines for **Capistrano** and **Unicorn** by removing the '#' character from the beginning of following lines:

		# gem 'unicorn'

		# gem 'capistrano'

	![modify the gemfile and uncomment lines for capistrano and unicorn](../media/ruby-on-rails03.png)

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
		set :repository, "https://github.com/YourGitHubAccount/blog_app.git"
		set :branch, "master"
		set :use_sudo, true
		set :bundle_flags, "--no-deployment --quiet"

		server "VM-DNS-Name", :web, :app, :db, primary: true

		set :deploy_to, "/home/#{user}/apps/#{application}"
		default_run_options[:pty] = true
		ssh_options[:forward_agent] = true

		namespace :deploy do
		  desc "Remove mingw32 extensions from Gemfile.lock to re-bundle under LINUX"
		  task :rm_mingw32, :except => { :no_release => true }, :role => :app do
		    puts " modifying Gemfile.lock ... removing mingw32 platform ext. before re-bundling on LINUX"
		    run "sed 's/-x86-mingw32//' #{release_path}/Gemfile.lock > #{release_path}/Gemfile.tmp && mv #{release_path}/Gemfile.tmp #{release_path}/Gemfile.lock"
		    run "sed -n '/PLATFORMS/ a\ ruby' #{release_path}/Gemfile.lock"
		  end

		  desc "Fix permission"
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

		  before "bundle:install", "deploy:rm_mingw32"
		  after "deploy:finalize_update", "deploy:fix_permissions"
		  after "deploy:finalize_update", "deploy:symlink_config"
		end

	In the above text, replace **YourGitHubAccount** with your GitHub account name, and **VM-DNS-Name** with the DNS of your Windows Azure VM.

	<div class="dev-callout">
	<strong>Note</strong>
	<p>The settings used by this deployment file should not be considered best practices, and are instead crafted to work with the widest array of development environments possible.</p>
	</div>

7.	Uncomment the assets line in the **Capfile** located in the **blog_app** directory.

		load 'deploy/assets'

8.	Run the following commands to commit the changes to the project and upload them to GitHub.

		git add .
		git commit -m "adding config files"
		git push

##<a id="deploy"></a>Deploy

1. Authorize your development environment to authenticate to your GitHub account using a certificate by performing the steps described on the [Generating SSH Keys](https://help.github.com/articles/generating-ssh-keys#platform-all) page.

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

At this point, you should be able to enter the DNS address of your virtual machine in a browser and the Rails

##<a id="next"></a>Next steps

In this article you have learned how to create and publish a basic forms-based Rails application to a Windows Azure Virtual Machine. Most of the actions we performed were manual, and in a production environment it would be desirable to automate. Also, most production environments host the Rails application in conjunction with another server process such as Apache or Nginx, which handles request routing to multiple instances of the Rails application and serving static resources.

For information on automating deployment of your Rails application, as well as using the Unicorn web server and Nginx, see [Unicorn+NginX+Capistrano with a Windows Azure Virtual Machine][unicorn-nginx-capistratno].

This article also used the SQLite database to store data. Learn how to use Rails with SQL Database in the [Using SQL Database with Rails][sql-rails] article.

If you would like to learn more about Ruby on Rails, visit the [Ruby on Rails Guides][rails-guides].

[vm-instructions]: /en-us/manage/linux/tutorials/virtual-machine-from-gallery/
[unicorn-nginx-capistratno]: /en-us/develop/ruby/tutorials/unicorn-nginx-capistrano/
[sql-rails]: /en-us/develop/ruby/howto/sql-rails/
[rails-guides]: http://guides.rubyonrails.org/

[ruby-vm-endpoint]: 
[ruby-http-endpoint-details]: 
[blog-rails]: ../media/blograilslocal.png
[blog-rails-cloud]: ../media/blograilscloud.png 
[default-rails]: ../media/basicrailslocal.png
[default-rails-cloud]: ../media/basicrailscloud.png
[vmlist]: ../media/vmlist.png
[endpoints]: ../media/endpoints.png
[new-endpoint]: ../media/newendpoint.png

[management-portal]: https://manage.windowsazure.com/
[sqlite3]: http://www.sqlite.org/