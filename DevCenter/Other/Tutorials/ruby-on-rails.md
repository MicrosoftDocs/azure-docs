# Ruby on Rails on Windows Azure

Ruby on Rails is a full stack framework, providing the ability to talk with the web server, communicate with the database, and render templates. Many of today's popular sites use Rails, including GitHub. In this article, we are going to outline the basic steps to getting Ruby on Rails working on a Linux instance in Windows Azure. We will prepare our Windows Azure environment, build a simple app, and deploy it.

We will be using the following components to make up our "cloud stack":

* Hardware: [Windows Azure Virtual Machines](http://www.windowsazure.com/en-us/home/features/virtual-machines/)
* Operating System: [Ubuntu 12.04 LTS](http://www.ubuntu.com/)
* Language: [Ruby 1.9.3-p194](http://www.ruby-lang.org/en/) using [rbenv](https://github.com/sstephenson/rbenv/)
* Web Framework: [Ruby on Rails](http://rubyonrails.org/)
* Database: [SQLite](http://www.sqlite.org/)
* Web Server: [Nginx](http://wiki.nginx.org/Main)
* Version Control: [Git](http://git-scm.com/) and [GitHub](https://github.com/)
* Deployment Tools: [Capistrano](https://github.com/capistrano/capistrano/)

## Set up Ruby

The first thing you're going to want to do is setup a Ruby on Rails project on your computer. Depending on your operating system, the steps may vary.

* Windows - Visit: [http://railsinstaller.org/](http://railsinstaller.org/).
* Mac - Use [Homebrew](http://mxcl.github.com/homebrew/) to install **rbenv** and **ruby-build**. A basic tutorial can be found here: [https://github.com/sstephenson/rbenv/](https://github.com/sstephenson/rbenv/).

## Start a VM on Windows Azure

We'll now setup a Windows Azure Virtual Machine.

1.	Login to your Windows Azure account. If you don't have one, <a href="http://www.windowsazure.com/en-us/pricing/free-trial/" target="_blank">sign up for a free 3-month subscription</a>.
2.	If you haven't previously used Windows Azure Virtual Machines, follow the instructions at <a href="http://www.windowsazure.com/en-us/develop/net/tutorials/create-a-windows-azure-account/#enable" target="_blank">Enable Windows Azure preview features</a> to enable Virtual Machines on your account.
3.	Create a new Virtual Machine by clicking on **New** in the bottom left of the [Management Portal](http://manage.windowsazure.com), and selecting **Virtual Machine**. 

	![create a new virtual machine](../media/ruby-on-rails01.png)
 
4.	From the Gallery, Select **Ubuntu** as the OS.

	![select Ubuntu from the gallery](../media/ruby-on-rails02.png)
 
5.	For this article, I've used the following settings:
	* Virtual Machine Name: blogpost
	* Username: blogger
	* Password: *
	* DNS Name: blogpost (.cloudapp.net)
6.	Use the defaults for the rest of the settings.
Now that the machine is spinning up, we can focus on building a Ruby on Rails application to launch on our Windows Azure virtual machine.

## Create a sample app

We're going to build and use a toy application so we can focus on the setup of the environment in Windows Azure. To build the application, follow these steps.

1.	Create a new Rails application: 

		rails new blog_app 
2.  Change to the next directory:

		cd blog_app
2.	Generate the scaffolding for the application: 

		rails g scaffold article name content:text
And now we have a simple application working. You can test this out by running the following command: 

		rails server

## Prepare the virtual machine

We'll now setup the virtual machine so we can run our application.

1.	Log in to the server using the SSH. In the command below, replace *blogpost* with your unique DNS name.

		ssh blogger@blogpost.cloudapp.net -p22
2.	Now, using the **apt-get** command, we'll be updating and installing packages to our virtual machine. The following commands will install **curl**, **git**, **nginx**, **sqlite**, and **nodejs**:

		sudo apt-get -y update
		sudo apt-get -y install curl git-core python-software-properties
		sudo apt-get -y install nginx libsqlite3-0 libsqlite3-dev nodejs
3.	We're going to use [rbenv-installer](https://github.com/fesplugas/rbenv-installer/) to install **rbenv** to manage our Ruby versions. Install it using the following command (note that the text below may be wrapped, but this should be entered as a single command):
		
		curl https://raw.github.com/fesplugas/rbenv-installer/master/bin/rbenv-installer | bash	
4.	Follow the instructions provided by rbenv-installer to modify your **.bashrc** file to add rbenv to the load path. 

5. Reload .bashrc using: 
		
		. ~/.bashrc
5.	Run the bootstrap script provided by rbenv-installer for Ubuntu 12.04:

		rbenv bootstrap-ubuntu-12-04
6.	Now install the latest Ruby. At time of writing it was 1.9.3-p194. Tab completion should let you see the latest version. This will take some time, so grab a coffee:

		rbenv install 1.9.3-p194
7.	Set the global version to the one installed:

		rbenv global 1.9.3-p194
8.	Check to make sure Ruby installed correctly by running: 
	
		ruby -v
9.	Now we can install gems: 
		
		gem install bundler --no-ri --no-rdoc
10.	After installing a gem, we should let rbenv know how to run it using: 
		
		rbenv rehash

## Prepare for Deployment

We now have a working virtual machine with the necessary packages to run a Ruby on Rails application. We're going to prepare our application for deployment. We'll use [Git](http://git-scm.com/) and [GitHub](https://github.com/) for version control and as a central location for our code. Follow these steps to setup a local repository and upload it to GitHub.

1.	Create a repository within your account on [GitHub](https://github.com/). Name your repository blog-azure.
2.	Run the following commands on your local computer to upload the initial version of the application:

		git init
		git add .
		git commit -m "initial commit on azure"
		git remote add origin https://github.com/YOUR_GITHUB_ACCOUNT/blog-azure.git
		git push -u origin master
3.	We're now going to modify the application so we can deploy it using [Capistrano](https://github.com/capistrano/capistrano/).
4.	Modify the **Gemfile** and uncomment the lines for **capistrano** and **unicorn**.

	![modify the gemfile and uncomment lines for capistrano and unicorn](../media/ruby-on-rails03.png)
 
5.	Run the following commands to install the new gems, update your Ruby Environment, and setup Capify for your project:
		
		bundle
		rbenv rehash
		capify .
6.	Add the following files to the config directory:

	* [nginx.conf](https://gist.github.com/cff582f4f970a95991e9)
	* [unicorn_init.sh](https://gist.github.com/3272994)
	* [unicorn.rb](https://gist.github.com/3273014)
	* [deploy.rb](https://gist.github.com/3273427)
7.	Uncomment the assets line in the **Capfile**

		load 'deploy/assets'
8.	Run the following commands to commit the changes to the project and upload them to GitHub.

		chmod +x config/unicorn_init.sh
		git add .
		git commit -m "adding config files"
		git push

## Deploy

We're now ready to deploy the application. We're going to use **capistrano** to do the deployment using the files we've setup in the previous steps.

1.	Setup SSH Keys. You will need to ensure you can connect to the GitHub account on your cloud machine. You can use the SSH Agent to do this, using the following command: 

		ssh-add 
This command may vary depending on your operating system.
2.	Setup capistrano on the remote server:

		cap deploy:setup
3.	Now we're going to SSH into the machine and modify the permissions to let us avoid any issues with the deployment. (NOTE: This is not suggested for production environments, and is only being used now for demonstration purposes). Use the following command: 
		
		chmod -R 777 apps
4.	Do a cold deploy - since we've never deployed this application before. It will fail.

		cap deploy:cold

## Setup Nginx & Unicorn

Now we'll want to setup Nginx and Unicorn to run as services. Login to the server using SSH and do the following steps:

1.	Setup an endpoint from the Windows Azure Management Portal. Add a point for TCP Port 80 both publicly and locally.

	![add a VM endpoint](../media/ruby-on-rails04.png)
2.	Remove the default Nginx website with the following command:

		sudo rm /etc/nginx/sites-enabled/default
3.	Restart the Nginx service:

		sudo service nginx restart
4.	Add **unicorn** as a service:

		sudo update-rc.d -f unicorn_blog_app defaults

## Done
We should be all done now. You should be able to see a working Ruby on Rails application on Windows Azure Virtual Machines.

![Ruby on Rails on a Windows Azure VM](../media/ruby-on-rails05.png)
 

