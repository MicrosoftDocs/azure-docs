# Publishing a website with Git

Git is a popular, open source, distributed version control system. Windows Azure Web Sites allow you to enable a Git repository for your site, which allows you to quickly and easily push code changes to your site. Windows Azure Web Sites also support continuous deployment from your public GitHub or CodePlex repositories.

In this article, you will learn how to use Git to publish to a Windows Azure Web Site, as well as enable continuous deployment from GitHub and CodePlex.

<div class="dev-callout">
<strong>Note</strong>
<p>Many of the Git commands described in this article are performed automatically when creating a Web Site using the <a href="/en-us/develop/nodejs/how-to-guides/command-line-tools/">Windows Azure Command-Line Tools for Mac and Linux</a>.</p>
</div>

The task includes the following steps:

* [Install Git](#Step1)
* [Create a local repository](#Step2)
* [Add a web page](#Step3)
* [Enable the web site repository](#Step4)
* [Deploy your project](#Step5)
	* [Pushing local files to Windows Azure](#Step6)
	* [Deploy files from GitHub or CodePlex](#Step7)
* [Troubleshooting](#Step8)

<h2 id="Step1">Installing Git</h2>

The steps required to install Git vary between operating systems. See [Installing Git] for operating system specific distributions and installation guidance.

<div class="dev-callout">
<strong>Note</strong>
<p>On some operating systems, both a command-line and GUI version of Git will are available. The instructions provided in this article use the command-line version.</p>
</div>

<h2 id="Step2">Create a local repository</h2>

Perform the following tasks to create a new Git repository.

1. Open a command-line, such as **GitBash** (Windows) or **Bash** (Unix Shell). On OS X systems you can access the command-line through the **Terminal** application.

2. From the command line, change to the directory in which you will create your web site. For example, `cd needsmoregit`.

3. Use the following command to initialize a new Git repository:

		git init

	This should return a message such as **Initialized empty Git repository in [path]**.

<h2 id="Step3">Add a web page</h2>

Windows Azure Web Sites support a applications created in a variety of programming languages. For this example, you will use a static .html file. For information on publishing web sites in other programming languages to Windows Azure, see the [Windows Azure Developer Center].

1. Using a text editor, create a new file named **index.html** in the root of the Git repository. Add 'Hello Git!' as the contents, and then save the file.

2. From the command-line, make sure you are in the directory that you created the repository in and use the following command to add the **index.html** file to the repository:

		git add index.html 

3. Next, commit the changes to the repository by using the following command:

		git commit -m "Adding index.html to the repository"

	You should see output similar to the following:

		[master (root-commit) 369a79c] Adding index.html to the repository
		 1 file changed, 1 insertion(+)
		 create mode 100644 index.html

<h2 id="Step4">Enable the web site repository</h2>

Perform the following steps to enable a Git repository for your web site by using the Windows Azure portal:

1. Login to the [Windows Azure portal].

2. On the left of the page, select **Web Sites**, and then select the web site for which you want to enable a repository.

	![An image displaying a selected web site][portal-select-website]

3. In the **quick glance** section, select **Setup Git publishing**.

	![The Setup Git Publishing link][portal-setup-git]

	If this is the first time you have enabled publishing for a Windows Azure Website, you may be prompted for deployment credentials. Enter a username and password, which will be required when publishing to your web sites in the future.

	![Deployment credentials prompt][portal-deployment-credentials]

4. After a short delay, you should be presented with a message that your repository is ready. Below this message will be instructions for pushing local files to Windows Azure, deploying from a GitHub project, or deploying from a CodePlex project.

	![Repository ready][portal-repository-ready]

<h2 id="Step5">Deploy your project</h2>

Pushing local files to Windows Azure allows you to manually push updates from a local project to your Windows Azure Web Site, while deploying from GitHub or CodePlex results in a continuous deployment process where Windows Azure will pull in the most recent updates to your GitHub or CodePlex project.

While both methods result in your project being deployed to a Windows Azure Web Site, continuous deployment is useful when you have multiple people working on a project and want to ensure that the latest version is always published regardless of who made the most recent update. Continuous deployment is also useful if you are using GitHub or Codeplex as the central repository for your application.

<h3 id="Step6">Pushing local files to Windows Azure</h3>

Once the repository is ready, select **Push my local files to Windows Azure** in the portal for instructions on publishing your local files.

Since you have already initialized a local repository and added files to it, skip steps 1 and 2 of the instructions displayed in the portal. Using the command-line, change directories to your web site directory and use the commands listed in step 3 of the instructions returned by the portal. For example:

		git remote add azure http://username@needsmoregit.windowsazure.net/NeedsMoreGit.git


The **remote** command adds a named reference to a remote repository, in this case it creates a reference named 'azure' for your Windows Azure Website repository.

<h4>Publish and re-publish the web site</h4>

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

	<div class="dev-callout">
	<strong>Note</strong>
	<p>The repository created for your Windows Azure Website expects push requests to target the <strong>master</strong> branch of its repository, which will then be used as the content of the web site.</p>
	</div>

2. In the portal, click the **BROWSE** link at the bottom of the portal to verify that the **index.html** has been deployed. A page containing 'Hello Git!' will appear.

	![A webpage containing 'Hello Git!'][hello-git]

3. Using a text editor, change the **index.html** file so that it contains 'Yay!', and then save the file.

4. Use the following commands from the command-line to **add** and **commit** the changes, and then **push** the changes to the remote repository:

		git add index.html
		git commit -m "Celebration"
		git push azure master

	Once the **push** command has completed, refresh the browser and note that the content of the page now reflects the latest commit change.

	![A webpage containing 'Yay!'][yay]

<h3 id="Step7">Deploy files from GitHub or CodePlex</h3>

Deploying files from either GitHub or CodePlex requires that you have published your local project to one of these services. For more information on publishing your project to these services, see [Create a Repo (GitHub)] or [Using Git with CodePlex].

1. Once your project has been published to GitHub or CodePlex, select **Deploy from my GitHub project** or **Deploy from My CodePlex project**. The following steps are based on deploying from a CodePlex project, however the steps are identical for GitHub projects.

	![deployment links for GitHub and Codeplex][deploy-git-links]

1. In the steps displayed in the portal, select the link to **Associate Windows Azure**. This will display a page asking you to authorize Windows Azure to access your GitHub or CodePlex account. You may be prompted to login to GitHub or CodePlex if you are not already logged in to the service.

	![link to associate with CodePlex][git-associate-link]

2. Once you have authorized Windows Azure to access your account, you will be prompted with a list of repositories. Select the repository that you wish to be associate with this Windows Azure Web Site. Click the checkmark to continue.

	![select repository and click checkbox][git-select-repository]

	<div class="dev-callout">
	<strong>Note</strong>
	<p>When enabling continuous deployment with GitHub, only public projects will be displayed.</p>
	</div>

3. Windows Azure will create an association with the selected repository, and will pull in the files from the master branch. Once this process completes, you will see a message similar to the following:

	![initial deployment message][git-initial-deploy]

4. At this point your project has been deployed from GitHub or CodePlex to your Windows Azure Web Site. To verify that the site is active, navigate to the Web Site **DASHBOARD** page for your Web Site in the portal, and then click the **SITE URL**. The browser should navigate to the web site.

5. To verify that continuous deployment is occurring, make a change to your project and then push the update to the GitHub or CodePlex repository you have associated with this Web Site. Your Web Site should update to reflect the changes shortly after the push to GitHub and CodePlex completes. You can verify that it has pulled in the update by navigating to the **DEPLOYMENT** page for your Web Site in the portal.

	![updated deployment message][git-update-deploy]

<h4>Specifying the branch to use</h4>

When you enable continuous deployment, it will default to the **master** branch of the repository. If you wish to use a different branch, perform the following steps:

1. In the portal, select your website and then select **CONFIGURE**.

2. In the **git** section of the page, enter the branch you wish to use in the **BRANCH TO DEPLOY** field, and then hit enter. Finally, click **SAVE**.

	![Chaning the branch to use the notmaster branch][git-notmaster]

Windows Azure should immediately begin updating based on changes to the new branch.

<h4>Disabling continuous deployment</h4>

Continuous deployment cannot be disabled from the Windows Azure portal, but must instead be disabled from your repository settings on GitHub or CodePlex.

Continuous deployment works by providing the **DEPLOYMENT TRIGGER URL** found in the **git** section of your sites **CONFIGURATION** to GitHub or CodePlex.

![deployment trigger url][git-deployment-trigger]

When updates are made to your GitHub or CodePlex repository, a POST request is sent to this URL, which notifies your Windows Azure Web Site that the repository has been updated. At this point it retrieves the update and deploys it to your web site.

To discontinue continuous deployment, simply remove the URL from the configuration settings of your GitHub or CodePlex repository.

<h2 id="Step8">Troubleshooting</h2>

The following are errors or problems commonly encountered when using Git to publish to a Windows Azure Website:

****

**Symptom**: Couldn't resolve host 'hostname'

**Cause**: This error can occur if the address information entered when creating the 'azure' remote was incorrect.

**Resolution**: Use the `git remote -v` command to list all remotes, along with the associated URL. Verify that the URL for the 'azure' remote is correct. If needed, remove and recreate this remote using the correct URL.

****

**Symptom**: No refs in common and none specified; doing nothing. Perhaps you should specify a branch such as 'master'.

**Cause**: This error can occur if you do not specify a branch when performing a git push operation, and have not set the push.default value used by Git.

**Resolution**: Perform the push operation again, specifying the master branch. For example:

	git push azure master

****

**Symptom**: src refspec [branchname] does not match any.

**Cause**: This error can occur if you attempt to push to a branch other than master on the 'azure' remote.

**Resolution**: Perform the push operation again, specifying the master branch. For example:

	git push azure master

****

**Symptom**: Error - Changes commited to remote repository but your website not updated.

**Cause**: This error can occur if you are deploying a Node.js application containing a package.json file that specifies additional required modules.

**Resolution**: Additional messages containing 'npm ERR!' should be logged prior to this error, and can provide additional context on the failure. The following are known causes of this error and the corresponding 'npm ERR!' message:

* **Malformed package.json file**: npm ERR! Couldn't read dependencies.

* **Native module that does not have a binary distribution for Windows**:

	* npm ERR! \`cmd "/c" "node-gyp rebuild"\` failed with 1

		OR

	* npm ERR! [modulename@version] preinstall: \`make || gmake\`


## Additional Resources

* [How to use PowerShell for Windows Azure]
* [How to use the Windows Azure Command-Line Tools for Mac and Linux]
* [Git Documentation]

[Windows Azure Developer Center]: http://www.windowsazure.com/en-us/develop/overview/
[Windows Azure portal]: http://manage.windowsazure.com
[Git website]: http://git-scm.com
[Installing Git]: http://git-scm.com/book/en/Getting-Started-Installing-Git
[How to use PowerShell for Windows Azure]: http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/powershell-cmdlets/
[How to use the Windows Azure Command-Line Tools for Mac and Linux]: /en-us/develop/nodejs/how-to-guides/command-line-tools/
[Git Documentation]: http://git-scm.com/documentation

[portal-select-website]: ../Media/git-select-website.png
[portal-setup-git]: ../Media/git-setup-git-link.png
[portal-deployment-credentials]: ../Media/git-deployment-credentials.png
[portal-repository-ready]: ../Media/git-setup-complete.png
[hello-git]: ../Media/git-hello-git.png
[yay]: ../Media/git-yay.png
[git-select-repository]: ../Media/git-select-project.png
[git-initial-deploy]: ../Media/git-deployed.png
[git-update-deploy]: ../Media/git-deployment-updated.png
[git-associate-link]: ../Media/git-associate-link.png
[deploy-git-links]: ../Media/git-deploy-link.png
[git-notmaster]: ../Media/git-notmaster.png
[git-deployment-trigger]: ../Media/git-deployment-trigger.png

[Create a Repo (GitHub)]: https://help.github.com/articles/create-a-repo
[Using Git with CodePlex]: http://codeplex.codeplex.com/wikipage?title=Using%20Git%20with%20CodePlex&referringTitle=Source%20control%20clients&ProjectName=codeplex