<properties umbracoNaviHide="0" pageTitle="How to Create and Deploy a web site" metaKeywords="Windows Azure Web Sites, deployment, configuration changes, deployment update, Windows Azure .NET deployment, .NET deployment" metaDescription="Learn how to configure web sites in Windows Azure to use a SQL or MySQL database, and learn how to configure diagnostics and download logs." linkid="itpro-windows-howto-configure-websites" urlDisplayName="How to Configure Web Sites" headerExpose="" footerExpose="" disqusComments="1" />

#How to Create and Deploy a Web Site

<div chunk="../../ITPro/Shared/Chunks/disclaimer.md" />

Just as you can quickly create and deploy a web application created from the gallery, you can also deploy a web site created on a workstation with traditional developer tools from Microsoft or other companies. 


## Table of Contents ##

- [Development Tools for Creating a Web Site](#tools)
- [How to: Create a Web Site from the Gallery](#howtocreatefromgallery)
- [How to: Deploy a Web Site from Git](#deployawebsite)
- [Next Steps](#nextsteps)


##<a name="tools"></a>Development Tools for Creating a Web Site

Some development tools available from Microsoft include [Microsoft Visual Studio 2010][VS2010], [Microsoft Expression Studio 4][msexpressionstudio] and [Microsoft WebMatrix][mswebmatrix], a free web development tool from Microsoft which provides essential functionality for web site development. 





##<a name="howtocreatefromgallery"></a>How to: Create a Web Site from the Gallery

<div chunk="../../Shared/Chunks/website-from-gallery.md" />


##<a name="deployawebsite"></a>How to: Deploy a  web site from Git


If you use a Git for source code control, you can publish your app directly from a local Git repository to a web site. Git is a free, open-source, distributed version control system that handles small to very large projects. To use Git with your web site, you must set up Git publishing from the Quick Start or Dashboard management pages for your web site. After you set up Git publishing, each .Git push initiates a new deployment. You'll manage your Git deployments on the Deployments management page.

**Tip**  
After you create your web site, use **Set up Git Publishing** from the **Quick Start** or **Dashboard** management pages to set up Git publishing for the web site. If you're new to Git, you'll be guided through creating a Git account and a local repository for your web site. You'll see the exact Git commands that you need to enter, including the Git repository URLs to use with your web site.

### Set up Git Publishing ###

1. Create a web site in Windows Azure. (**Create New - Web Site**)
2. From the **Quick Start** management page, click **Set up Git publishing**.

Follow the instructions to create a deployment user account by specifying a username and password to use for deploying with Git and FTP, if you haven’t done that already. A Git repository will be created for the web site that you are managing.

### Push your local Git repository to Windows Azure ###
The following procedures below will walk you through creating a new repository or cloning an existing repository and then pushing your content to the Git repository for the web site.

1. Install the Git client. ([Download Git][getgit])
2. Open a command prompt, change directories to your application's root directory, and type the following commands:
   
		git init
		git add.
		git commit -m "initial commit"

	This creates a local Git repository and commits your local application files to the repository.

3. Add a remote Windows Azure repository and push your files to it.
4. Open a command prompt, cd into your app's root directory and type the following:

  		git remote add azure http://azure@microsoft.com.antdf0.windows-int.net/azureweb.git
		git push azure master
 
	 **Note**
	 The commands above will vary depending upon the name of the web site for which you have created the Git repository.
 
### Clone a web site to my computer ###
1. Install the Git client. ([Download Git][getgit]) if you have not already.
2. Clone your web site.
3. Open a command prompt, change directories to the directory where you want your files, and type:

		git clone -b master GitRepositoryURL
 
	where _GitRepositoryURL_ is the URL for the Git repository that you want to clone.

4. Commit changes, and push the repository's contents back to Windows Azure.

5. After changing or adding some files, change directories your app's root directory and type:

  		git add.
		git commit -m "some changes"
		git push
 
After deployment begins, you can monitor the deployment status on the **Deployments** management page. When the deployment completes, click **Browse** to open your web site in a browser.

--------------------------------------------------------------------------------

##<a name="nextsteps"></a>Next Steps
For more information about web sites, see the following:

* [Walkthrough: Troubleshooting a Web Site on Windows Azure](http://go.microsoft.com/fwlink/?LinkId=251824)



[vs2010]:http://go.microsoft.com/fwlink/?LinkId=225683
[msexpressionstudio]:http://go.microsoft.com/fwlink/?LinkID=205116
[mswebmatrix]:http://go.microsoft.com/fwlink/?LinkID=226244
[getgit]:http://go.microsoft.com/fwlink/?LinkId=252533
[azuresdk]:http://go.microsoft.com/fwlink/?LinkId=246928
[gitref]:http://go.microsoft.com/fwlink/?LinkId=246651
[howtoconfiganddownloadlogs]:http://go.microsoft.com/fwlink/?LinkId=252031
[sqldbs]:http://go.microsoft.com/fwlink/?LinkId=246930
[fzilla]:http://go.microsoft.com/fwlink/?LinkId=247914
[configvmsizes]:http://go.microsoft.com/fwlink/?LinkID=236449
[webmatrix]:http://go.microsoft.com/fwlink/?LinkId=226244