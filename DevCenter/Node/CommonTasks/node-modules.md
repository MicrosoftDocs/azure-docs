
This document provides guidance on using Node.js modules with applications hosted on Windows Azure. It provides guidance on ensuring that your application uses a specific version of module as well as using native modules with Windows Azure.

##Node.js module installation on Windows Azure

The following table is a quick reference of what module deployment methods are supported by Windows Azure:

<table border=1>
<tr>
<th>Module deployment</th>
<th>Web Site</th>
<th>Cloud Service</th>
</tr>
<tr>
<td>native_module folder</td>
<td>Yes
<br>Required for native modules</td>
<td>Yes</td>
</tr>
<tr>
<td>package.json</td>
<td>Yes</td>
<td>No</td>
</tr>
<tr>
<td>npm-shrinkwrap.json</td>
<td>Yes</td>
<td>No</td>
</tr>
</table>
<br>
<div class="dev-callout">
<strong>Note</strong>
<p>Windows Azure Virtual Machines are not included in the above table, as the deployment experience will be dependent on the operating system hosted by the Virtual Machine.</p>
</div>

##Node.js Modules

Modules are loadable JavaScript packages that provide specific functionality for your application. A module is usually installed using the **npm** utility, however some (such as the http module) are provided as part of the core Node.js package.

When a module is installed, are stored in the **node\_modules** directory at the root of your application directory structure. Each module within the **node\_modules** directory each maintains its own **node\_directory** that contains any modules that it depend on, and this repeats again for every module all the way down the dependency chain. This allows each module installed to have its own version requirements for the modules it depends on, however it can result in quite a large directory structure.

When deploying an application, it is usually undesirable to deploy the **node\_modules** directory as it increases the deployment size; however, it does guarantee that the version of the modules used in production are the same as those used in development.

###Native Modules

While most modules are simply plain-text JavaScript files, some modules are platform-specific binary images. These modules are compiled at install time, usually by using Python and node-gyp. One specific limitation of Windows Azure Web Sites is that while it natively understands how to install modules specified in a **package.json** or **npm-shrinkwrap.json** file, it does not provide Python or node-gyp.

If you are deploying to a Windows Azure Web Site, and you are using a native module, you must first install the module locally on a Windows development system and then deploy the **node\_modules** folder with your application. This will copy the compiled native module to the Windows Azure Web Site environment instead of attempting to build it for that environment.

###Using a package.json file

The **package.json** file is a way to specify the top level dependencies your application requires so that the hosting platform can install the dependencies, rather than requiring you to include the **node\_packages** folder as part of the deployment. After the application has been deployed, the **npm install** command is used to parse the **package.json** file and install all the dependencies listed.

During development, you can use the **--save**, **--save-dev**, or **--save-optional** parameters when installing modules to add an entry for the module to your **package.json** file automatically. For more information, see [https://npmjs.org/doc/install.html].

One potential problem with the **package.json** file is that it only specifies the version for top level dependencies. Each module installed may or may not specify the version of the modules it depends on, and so it is possible that you may end up with a different dependency chain than the one used in development. 

<div class="dev-callout">
<strong>Note</strong>
<p>When deploying to a Windows Azure Web Site, if your <b>package.json</b> file references a native module you will see an error similar to the following when publishing the application using Git:</p>
<pre>npm ERR! module-name@0.6.0 install: `node-gyp configure build`
npm ERR! `cmd "/c" "node-gyp configure build"` failed with 1</pre>
</div>

###Using a npm-shrinkwrap.json file

The **npm-shrinkwrap.json** file is an attempt to address the module versioning limitations of the **package.json** file. While the **package.json** file only includes versions for the top level modules, the **npm-shrinkwrap.json** file contains the version requirements for the full module dependency chain.

When your application is ready for production, you can lock-down version requirements and create an **npm-shrinkwrap.json** file by using the **npm shrinkwrap** command. This will use the versions currently installed in the **node\_modules** folder, and record these to the **npm-shrinkwrap.json** file. After the application has been deployed to the hosting environment, the **npm install** command is used to parse the **npm-shrinkwrap.json** file and install all the dependencies listed. For more information, see [https://npmjs.org/doc/shrinkwrap.html].

<div class="dev-callout">
<strong>Note</strong>
<p>When deploying to a Windows Azure Web Site, if your <b>npm-shrinkwrap.json</b> file references a native module you will see an error similar to the following when publishing the application using Git:</p>
<pre>npm ERR! module-name@0.6.0 install: `node-gyp configure build`
npm ERR! `cmd "/c" "node-gyp configure build"` failed with 1</pre>
</div>

##Additional resources

* [Publishing with Git]

* [Build and deploy a Node.js application to a Windows Azure Cloud Service]

* [Node.js Web Application with Storage on MongoDB (MongoLab)]

[Node.js Web Application with Storage on MongoDB (MongoLab)]: /en-us/develop/nodejs/tutorials/website-with-mongodb-mongolab/
[Publishing with Git]: /en-us/develop/nodejs/common-tasks/publishing-with-git/
[Build and deploy a Node.js application to a Windows Azure Cloud Service]: /en-us/develop/nodejs/tutorials/getting-started/
[https://npmjs.org/doc/install.html]: https://npmjs.org/doc/install.html
[https://npmjs.org/doc/shrinkwrap.html]: https://npmjs.org/doc/shrinkwrap.html