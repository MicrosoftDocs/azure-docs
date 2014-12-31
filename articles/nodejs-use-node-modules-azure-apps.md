<properties urlDisplayName="Working with Node.js Modules" pageTitle="Working with Node.js Modules" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="nodejs" title="Using Node.js Modules with Azure applications" authors="larryfr" solutions="" manager="wpickett" editor="mollybos" />

<tags ms.service="na" ms.workload="na" ms.tgt_pltfrm="na" ms.devlang="nodejs" ms.topic="article" ms.date="09/17/2014" ms.author="larryfr" />





# Using Node.js Modules with Azure applications

This document provides guidance on using Node.js modules with applications hosted on Azure. It provides guidance on ensuring that your application uses a specific version of module as well as using native modules with Azure.

If you are already familiar with using Node.js modules, **package.json** and **npm-shrinkwrap.json** files, the following is a quick summary of what is discussed in this article:

* Azure Webites understand **package.json** and **npm-shrinkwrap.json** files and can install modules based on entries in these files.
* Azure Cloud Services expect all modules to be installed on the development environment, and the **node\_modules** directory to be included as part of the deployment package.

> [AZURE.NOTE] Azure Virtual Machines are not discussed in this article, as the deployment experience in a VM will be dependent on the operating system hosted by the Virtual Machine

> [AZURE.NOTE] It is possible to enable support for installing modules using **package.json** or **npm-shrinkwrap.json** files on Azure, however this requires customization of the default scripts used by Cloud Service projects. For an example of how to accomplish this, see [Azure Startup task to run npm install to avoid deploying node modules](http://nodeblog.azurewebsites.net/startup-task-to-run-npm-in-azure)

##Node.js Modules

Modules are loadable JavaScript packages that provide specific functionality for your application. A module is usually installed using the **npm** command-line tool, however some (such as the http module) are provided as part of the core Node.js package.

When modules are installed, they are stored in the **node\_modules** directory at the root of your application directory structure. Each module within the **node\_modules** directory maintains its own **node\_modules** directory that contains any modules that it depend on, and this repeats again for every module all the way down the dependency chain. This allows each module installed to have its own version requirements for the modules it depends on, however it can result in quite a large directory structure.

When deploying the **node\_modules** directory as part of your application, it will increase the size of the deployment compared to using a **package.json** or **npm-shrinkwrap.json** file; however, it does guarantee that the version of the modules used in production are the same as those used in development.

###Native Modules

While most modules are simply plain-text JavaScript files, some modules are platform-specific binary images. These modules are compiled at install time, usually by using Python and node-gyp. One specific limitation of Azure Webites is that while it natively understands how to install modules specified in a **package.json** or **npm-shrinkwrap.json** file, it does not provide Python or node-gyp and cannot build native modules.

Since Azure Cloud Services rely on the **node\_modules** folder being deployed as part of the application, any native module included as part of the installed modules should work in a cloud service as long as it was installed and compiled on a Windows development system. 

Native modules are not supported with Azure Webites. Some modules such as JSDOM and MongoDB have optional native dependencies, and will work with applications hosted in Azure Webites.

###Using a package.json file

The **package.json** file is a way to specify the top level dependencies your application requires so that the hosting platform can install the dependencies, rather than requiring you to include the **node\_packages** folder as part of the deployment. After the application has been deployed, the **npm install** command is used to parse the **package.json** file and install all the dependencies listed.

During development, you can use the **--save**, **--save-dev**, or **--save-optional** parameters when installing modules to add an entry for the module to your **package.json** file automatically. For more information, see [npm-install](https://npmjs.org/doc/install.html).

One potential problem with the **package.json** file is that it only specifies the version for top level dependencies. Each module installed may or may not specify the version of the modules it depends on, and so it is possible that you may end up with a different dependency chain than the one used in development. 

> [AZURE.NOTE]
> When deploying to an Azure Webite, if your <b>package.json</b> file references a native module you will see an error similar to the following when publishing the application using Git:

>		npm ERR! module-name@0.6.0 install: 'node-gyp configure build'

>		npm ERR! 'cmd "/c" "node-gyp configure build"' failed with 1	


###Using a npm-shrinkwrap.json file

The **npm-shrinkwrap.json** file is an attempt to address the module versioning limitations of the **package.json** file. While the **package.json** file only includes versions for the top level modules, the **npm-shrinkwrap.json** file contains the version requirements for the full module dependency chain.

When your application is ready for production, you can lock-down version requirements and create an **npm-shrinkwrap.json** file by using the **npm shrinkwrap** command. This will use the versions currently installed in the **node\_modules** folder, and record these to the **npm-shrinkwrap.json** file. After the application has been deployed to the hosting environment, the **npm install** command is used to parse the **npm-shrinkwrap.json** file and install all the dependencies listed. For more information, see [npm-install](https://npmjs.org/doc/install.html).

> [AZURE.NOTE]
>When deploying to an Azure Webite, if your <b>npm-shrinkwrap.json</b> file references a native module you will see an error similar to the following when publishing the application using Git:
		
>		npm ERR! module-name@0.6.0 install: 'node-gyp configure build'

>		npm ERR! 'cmd "/c" "node-gyp configure build"' failed with 1


##Next Steps

Now that you understand how to use Node.js modules with Azure, learn how to [specify the Node.js version], [build and deploy a Node.js Web Site], and [How to use the Azure Command-Line Tools for Mac and Linux].

[specify the Node.js version]: /en-us/documentation/articles/nodejs-specify-node-version-azure-apps/
[How to use the Azure Command-Line Tools for Mac and Linux]: /en-us/documentation/articles/xplat-cli/
[build and deploy a Node.js Web Site]: /en-us/documentation/articles/web-sites-nodejs-develop-deploy-mac/
[Node.js Web Application with Storage on MongoDB (MongoLab)]: /en-us/documentation/articles/store-mongolab-web-sites-nodejs-store-data-mongodb/
[Publishing with Git]: /en-us/documentation/articles/web-sites-publish-source-control/
[Build and deploy a Node.js application to an Azure Cloud Service]: /en-us/documentation/articles/cloud-services-nodejs-develop-deploy-app/


