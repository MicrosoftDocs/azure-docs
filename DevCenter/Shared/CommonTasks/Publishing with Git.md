# Publishing with Git

Git is a popular, open source, distributed version control system. Windows Azure Websites allow you to enable a Git repository for your site, which allows you to quickly and easily push code changes to your site. In this article, you will learn how to use Git to publish to Windows Azure.

The task inclues the following steps:

* [Install Git] (#Step1)
* [Create a local repository] (#Step2)
* [Working with files] (#Step3)
* [Enable the web site repository] (#Step4)
* [Add the web site as a remote repository] (#Step5)
* [Push updates to the web site] (#Step6)

<h2 id="Step1">Installing Git</h2>

The steps required to install Git vary between operating systems. To find the latest version of Git and the installation steps specific to your operating system, visist the [Git website]. If a pre-compiled version is not available from the Git website, you may be able to obtain one through your operating system's [package management system]. Alternatively, you can download and compile the source code.

**Note**: On Windows, when you reach the **Adjusting your PATH environment** section of Git installation, you should select **Run Git from the Windows Command Prompt**. If you do not select this option, you may receive errors when using utilities such as the Windows Azure cross-platform tools when creating a new website.

![Git setup, with run Git from the Windows Command Prompt selected][run-git-from-cmd]

<h2 id="Step2">Create a local repository</h2>

There are two ways to create a Git repository; using the **git** command directly or using the **Cross-Platform Tools for Windows Azure**.

##Git command

1. Open a command-line, such as **cmd.exe** (Windows,) **Bash** (Unix Shell). On OS X systems you can access the command-line through the **Terminal** application.

2. From the command line, change to the directory in which you will create your web site. For example, `cd needsmoregit`.

3. Use the following command to initialize a new Git repository:

		git init

	This should return a message such as **Initialized empty Git repository in [path]**.
	
	This command creates a hidden directory named **.git**, which stores metadata about the files in this repository.

##Cross-Platform Tools for Windows Azure

The [cross-platform tools] allow you to create a Windows Azure Website directly from the command line by using the `azure create` command. This command supports a `--git` parameter, which will perform a `git init` operation in the current directory.

The cross-platform tools also create a remote repository on Windows Azure when creating the web site, as well as automatically performing the `git add remote` command described later in this article.

<h2 id="Step3">Working with files</h2>

When working with files, you must use the **git** command to notify the repository of changes to files. The most commonly used commands are **add** and **rm**; **add** incrementally records changes to files into the repository, while **rm** removes a file. For information on other commands supported by Git, use `git help` from the command line. 

###Add changes

1. Using a text editor, create a new file named **index.html** in the root of the Git repository. Add 'Hello world!' as the contents, and then save the file.

2. From the command-line, make sure you are in the directory that you created the repository in and use the following command to add the **index.html** file to the repository:

		git add index.html

	**Note**: If you want to add changes to all files to the repository at onece, use `git add .`.

3. Next, commit the changes to the repository by using the following command:

		git commit -m "Adding changes to index.html to the repository"

	You should see output similar to the following:

		[master (root-commit) 369a79c] Adding changes to index.html to the repository
		 1 file changed, 1 insertion(+)
		 create mode 100644 index.html

	**Note**: You do not have to perform a **commit** after every **add**. You can incrementally perform **add**s and then perform a **commit** to persist all outstanding **add** operations at once.

4. Using a text editor, change **index.html** so that it contains 'Hello Git!'. Save the file.

5. From the command-line, use the following commands to add and commit changes to this file:

		git add index.html
		git commit -m "Changing index.html"

	This will commit any changes to the **index.html** file since the last commit. You should see output similar to the following:

		[master 369a79c] Changing index.html
		 1 file changed, 1 insertion(+), 1 deletion(-)

###Removing files

1. Use the following command to remove the **index.html** file:

		git rm index.html

	After issuing this command, use the **dir** or **ls** command to verify that the **index.html** file no longer exists.

2. Even though the file is no longer present in the directory, the deletion has not yet been commited to the repository. You can verify this by using the **status** command, which will show all uncommited changes.

		git status

	The output should appear as follows:

		# On branch master
		# Changes to be committed:
		#   (use "git reset HEAD <file>..." to unstage)
		#
		#       deleted:    index.html
		#

3. Instead of commiting the deletion of the file, use the **checkout** command to retrieve the last commited version of index.html:

		git checkout HEAD index.html

	After issuing this command, use the **dir** or **ls** command to verify that the **index.html** has been restored, and is the previously commited version containing 'Hello Git!'. Note that `git status` no longer shows a pending delete operation.

<h2 id="Step4">Enable the web site repository</h2>

As mentioned earlier, if you use the **Cross-Platform Tools for Windows Azure** and specify the `--git` parameter, a repository will be created for your web site automatically. However you can also enable a repository by using the Windows Azure portal. You can also use the portal to reset the authentication used when publishing to the repository.

Perform the following steps to enable a Git repository for your web site by using the Windows Azure portal:

1. Open your web browser, navigate to **TBD**, and login.

2. On the left of the page, select **WEB SITES**, and then select the web site for which you want to enable a repository.

	![An image displaying a selected web site][portal-select-website]

3. At the bottom of the page, select **Setup Git publishing**.

	![The Setup Git Publishing link][portal-setup-git]

	If this is the first time you have enabled publishing for for a Windows Azure Website, you may be prompted for deployment credentials. Enter a username and password, which will be required when publishing to your web sites in the future.

	![Deployment credentials prompt][portal-deployment-credentials]

4. After a short delay, you should be presented with a message that your repository is ready. Below this message, click the **Push my local files to Windows Azure** for a list of commands that can be used to push your local files to Windows Azure.

	![Repository ready][portal-repository ready]

	![Push steps][portal-push-steps]

<h2 id="Step5">Add the web site as a remote repository</h2>

Since you have already initialized a local repository and added files to it, skip steps 1 and 2 of the instructions displayed in the portal. Using the command-line, change directories to your web site directory and use the commands listed in step 3 of the instructions returned by the portal. For example:

		git remote add azure http://username@needsmoregit.windowsazure.net/NeedsMoreGit.git


The **remote** command adds a named reference to a remote repository, in this case it creates a reference named 'azure' for your Windows Azure Website repository.

<h2 id="Step6">Push updates to the web site</h2>

The **push** command pushes the latest changes that have been checked into the local repository to the a remote repository. The repository created for your Windows Azure Website expects push requests to target the **master** branch of its repository, which will then be used as the content of the web site.

1. Use the following from the command-line to push the current repository contents from the local repository to the 'azure' remote:

		git push azure master

	You will be prompted for the password you created earlier when setting up your repository. Enter the password and you should see output similar to the following:

		Counting objects: 6, done.
		Compressing objects: 100% (2/2), done.
		Writing objects: 100% (6/6), 486 bytes, done.
		Total 6 (delta 0), reused 0 (delta 0)
		remote: New deployment received.
		remote: Updating branch 'master'.
		remote: Preparing deployment for commit id '369a79c929'.
		remote: Preparing files for deployment.
		remote: Deployment successful.
		To http://username@needsmoregit.windowsauzre.net/NeedsMoreGit.git
		* [new branch]		master -> master

2. In the portal, click the **BROWSE** link at the bottom of the portal to verify that the **index.html** has been deployed. A page containing 'Hello Git!' will appear.

	![A webpage containing 'Hello Git!'][hello-git]

3. Using a text editor, change the **index.html** file so that it contains 'Yay!', and then save the file.

4. Use the following commands from the command-line to **add** and **commit** the changes, and then **push** the changes to the remote repository:

		git add index.html
		git commit -m "Celebration"
		git push azure master

	Once the **push** command has completed, refresh the browser and note that the content of the page now reflects the latest commit change.

	![A webpage containing 'Yay!'][yay]

## Additional Resources

[(TODO: insert link text for first additional resource)] [Resource1]

[(TODO: insert link text for second additional resource)] [Resource2]

[Git website]: http://git-scm.com
[package management system]: http://en.wikipedia.org/wiki/List_of_software_package_management_systems

[Image1]: (TODO: insert hyperlink for Image1, if it exists.)