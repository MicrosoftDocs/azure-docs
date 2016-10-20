<properties
    pageTitle="Azure Role Properties"
    description="Learn how to use the Azure Toolkit for Eclipse to configure Azure role settings."
    services=""
    documentationCenter="java"
    authors="rmcmurray"
    manager="wpickett"
    editor=""/>

<tags
    ms.service="multiple"
    ms.workload="na"
    ms.tgt_pltfrm="multiple"
    ms.devlang="Java"
    ms.topic="article"
    ms.date="08/11/2016" 
    ms.author="robmcm"/>

<!-- Legacy MSDN URL = https://msdn.microsoft.com/library/azure/hh690945.aspx -->

# Azure Role Properties #

Various configuration settings for your Azure role can be set within the Azure Toolkit for Eclipse.

## Configuring Azure Role Properties ##

Configuring your Azure Role Properties is accomplished through the property dialogs for your worker role. Open the context menu for the role in Eclipse's Project Explorer pane and select the **Azure** sub-menu. (If you don't see the role in the Eclipse Project Explorer, expand your Azure project in Project Explorer.)

![][ic789599]

The various properties that can be set from the **Properties** dialogs are described in this topic. Note that many properties are filled in automatically when you create a new Azure deployment project.

The following property pages are available for Azure roles.

* [Virtual machine properties](#virtual_machine_properties)
* [Caching properties](#caching_properties)
* [Certificates properties](#certificates_properties)
* [Components properties](#components_properties)
* [Debugging properties](#debugging_properties)
* [Endpoints properties](#endpoints_properties)
* [Environment variables properties](#environment_variables_properties)
* [Load balancing / session affinity (a.k.a "sticky sessions") properties](#session_affinity_properties)
* [Local storage properties](#local_storage_properties)
* [Server configuration properties](#server_configuration_properties)
* [SSL offloading properties](#ssl_offloading_properties)
	
<a name="virtual_machine_properties"></a>
### Virtual machine properties ###

Open the context menu for the role in Eclipse's Project Explorer pane, click **Azure**, and then click **Properties**, and you will have the ability to change the virtual machine size, and also change the number of instances, as shown in the following image.

![][ic719499]

>[AZURE.NOTE] Windows only: when you set the number of instances to a value greater than 1 and you also configure an application server, the toolkit will allow only 1 role instance to run in the emulator, regardless of this setting. This is to avoid port binding conflicts between the different server instances (for example, all trying to bind to port 8080) when they run on the same computer. Your desired instance count setting is preserved, but it goes into effect only when you deploy to the cloud.

<a name="caching_properties"></a> 
### Caching properties ###

Open the context menu for the role in Eclipse's Project Explorer pane, click **Azure**, and then click **Caching**. Within this dialog, you can enable named co-located memcache-compatible caches, allowing you to help speed up your web applications.

![][ic719483]

Within the **Caching** property page, you can specify global settings for the following:

* whether co-located caching is enabled.
* the cache size as a percent of memory.
* the storage account name for saving the cache state when your application runs as a cloud service, or none if you do not want to save the cache state. (The storage account name is not used when you run your application in the compute emulator.) If you set the storage account name to **(auto)** (which is the default), your caching configuration will automatically use the same storage account as the one you select in the **Publish to Azure** dialog.

>[AZURE.NOTE] The **(auto)** setting will have the desired effect only if you publish your deployment using the Eclipse toolkit's publish wizard. If instead you publish the .cspkg file manually using an external mechanism, such as the [Azure Management Portal][], the deployment will not function properly.

The following dialog shows the properties for a cache.

![][ic719501]

* **Name:** The name of the co-located cache.
* **Port number:** The port number to use for the cache.
* **Expiration policy:** One of the following values that specifies when a key in the cache expires.
    * **Absolute:** The key expires when the time specified by **Minutes to live** is reached.
    * **NeverExpires:** The key does not have an expiration time.
    * **SlidingWindow:** The key expires if it has not been accessed for the amount of time specified by **Minutes to live**; each time it is accessed, the expiration clock is reset.
* **Minutes to live:** Maximum number of minutes for a memcached key to live, subject to the expiration policy.
* **High availability with replicated backups on different role instances:** If enabled, helps provide high availability utilizing replicated backups on different role instances. Note that at least two role instances must be in effect for your deployment for this feature to work.

To add a new cache, click the **Add** button in the **Caching** property page, and a **Configure Named Cache** dialog will be opened. Provide values for the properties which are described above.

To modify a named cache, select the cache and click the **Edit** button in the **Caching** property page. A dialog will be opened allowing you to modify the cache properties. Press **OK** to save the cache values.

To delete a cache, select the cache and click the **Remove** button in the **Caching** property page, and then click **Yes** to confirm the deletion.

For more information on how to use caching, see [How to Use Co-located Caching][].

<a name="certificates_properties"></a> 
### Certificates properties ###

Open the context menu for the role in Eclipse's Project Explorer pane, click **Azure**, and then click **Certificates**.

![][ic710964]

Within this dialog, you can add or remove certificates referenced by your Eclipse project. Note that the certificates listed here are not automatically stored inside any Java keystore, and therefore are not automatically available for any use from within a Java application. They are only registered with Azure so that they can be preloaded into the Windows certificate store on the virtual machines running your deployment and subsequently used by other Windows software. Currently, the only feature of the toolkit that uses the certificates referenced this way in the **Certificates** dialog is [SSL Offloading][], due to its reliance on Internet Information Services (IIS) and Application Request Routing (ARR), which require the proper certificate to be made available in this manner.

When you deploy your project to Azure using the Publish wizard, you will be prompted to point at the Personal Information Exchange (PFX) files corresponding to these certificates, along with their passwords, in order to automatically upload them to the Azure service, but only if they have not been uploaded there previously.

<a name="components_properties"></a> 
### Components properties ###

Open the context menu for the role in Eclipse's Project Explorer pane, click **Azure**, and then click **Components**. Within this dialog, you have the ability to add, modify, or remove the components of your role, as well as change the order in which they are processed.

![][ic719502]

The components feature enables you to add dependencies to your Azure deployment project, such as Java application projects, special files, and executable command line statements that are needed by your deployment.

For each component, you can specify:

* The step to be taken when importing the component into your Azure deployment project when it is built.
* The step to be taken when deploying that component in the Azure cloud.

>[AZURE.NOTE] When specifying component files or command lines, keep in mind that your deployment will be published to a Windows virtual machine, so your custom steps must be valid for a Windows-based operating system. 

Components have the following properties:

* **Import:** Method that indicates how the component will be imported into the project when the project is built. This can be one of the following values:
    * **copy:** The component is copied from the local path specified by the **From** property into the role's **approot** directory.
    * **EAR:** The component is a Java enterprise archive (EAR) imported from an Enterprise Application Project at the local path specified by the **From** property. (This is detected automatically by the toolkit based on the nature of the project at that location).
    * **JAR:** The component is a Java archive (JAR) and is imported from a Java project at the local path specified by the **From** property. (This is detected automatically by the toolkit based on the nature of the project at that location).
    * **none:** No action is taken to import the component. This is applicable when the component is assumed to already be present in the role's **approot** directory, or when the component is merely an executable command line statement, as specified in the **As** property when the **Deploy** method is **exec**.
    * **WAR:** The component is a Java web application archive (WAR) and is imported from a Dynamic Web Project at the local path specified by the **From** property. (This is detected automatically by the toolkit based on the nature of the project at that location).
    * **zip:** The component is a zip file and is imported by zipping the directory or file specified by the **From** property.
* **From:** Source path on your local machine to the folder or file that represents the item(s) to import to your deployment. Windows environment variables can be used in this property. All importable components will be imported into the role's **approot** directory when the project is built.
	
	Note that you have the ability to deploy a component from a download when deploying to the cloud (not the compute emulator). See related information below about adding a component.	
	
* **As:** File name under which the component will be imported into the role's **approot** directory and ultimately deployed in the Azure cloud. Leave this property blank to keep the name the same as it is on the local machine. (For executable components, that is, those whose **Deploy** method is set to **exec**, this can be an arbitrary Windows command line statement.)

	>[AZURE.IMPORTANT] If you use space characters for this value, they will be handled differently depending on the deploy method. If the deploy method is **exec**, spaces will be interpreted as command line argument separators and not as part of the file name. For all other deploy methods, spaces will be interpreted as part of the file name.
	
* **Deploy:** Method that indicates the action applied to the component when the deployment is started. This can be one of the following values:
    * **copy:** The component is copied to the destination path specified by the **To** property.
    * **exec:** The component is an executable Windows command line statement executed in the context of the path specified by the **To** property, at the time the deployment starts.
    * **none:** No action is applied to the component when the deployment starts.
    * **zip:** The component is unzipped to the destination path specified by the **To** property. This method is available only when the **Import** property is **zip**.
* **To:** Destination path on the virtual machine where the component will be deployed. Windows environment variables can be used in this property, and file paths are relative to **approot**.
	
To add a new component, click the **Add** button in the **Components** property page, and an **Azure Role Component** dialog will be opened. Provide values for the properties which are described above. 

The following shows an example for adding a new WAR component.

![][ic719503]

When deploying to the cloud (not the compute emulator), if you want to deploy the component from a download, ensure that **When in cloud, instead of including in the package, deploy from** is checked. If you want to download from your Azure storage account, select the storage account from the **Storage account** drop-down list (you can click the **Accounts** link to modify what is in the list), which will partially fill in the **URL** field, and then fill in the remaining portion of the URL. If you do not want to use Azure storage, select **(none)** from the **Storage account** drop-down list, and enter the URL to your component in the **URL** field. Specify one of the following methods:

* **copy:** The download component is copied to the destination path specified by the **To Directory** path.
* **same:** The same method used for **Deploy from download** as for **Deploy from package**.
* **zip:** The download component is unzipped to the destination path specified by the **To Directory** path.

To modify a component, select the component and click the **Edit** button in the **Components** property page. A dialog will be opened allowing you to modify the component properties. Press **OK** to save the component values.

To delete a component, select the component and click the **Remove** button in the **Components** property page, and then click **Yes** to confirm the deletion.

Components are processed in the order listed. Use the **Move Up** and **Move Down** buttons to arrange the order.

>[AZURE.NOTE] The server configuration feature relies on components as well. Those components cannot be removed or edited without removing the corresponding server configuration. You will be prompted about that when attempting to make changes to such components.

<a name="debugging_properties"></a> 
### Debugging properties ###

Open the context menu for the role in Eclipse's Project Explorer pane, click **Azure**, and then click **Debugging**. Within this dialog, you have the ability to enable or disable remote debugging, as well as create debug configurations, as shown in the following image.

![][ic719504]

For related information about debugging, see [Debugging Azure Applications in Eclipse][].

<a name="endpoints_properties"></a> 
### Endpoints properties ###

Open the context menu for the role in Eclipse's Project Explorer pane, click **Azure**, and then click **Endpoints**. Within this dialog, you have the ability to create an endpoint, as well as edit or remove an endpoint, as shown in the following image.

![][ic719505]

To add an endpoint, click the **Add** button in the **Endpoints** property page, and an **Add Endpoint** dialog will be opened.

![][ic710897]

Enter a name for the endpoint, select the type (either **Input**, **Internal**, or **InstanceInput**), and specify the public and private port. Press **OK** to save the new endpoint values.

Depending on the type of endpoint, you may use port ranges as follows:

* For an input instance endpoint, the public port can be a range of ports (for example **2000-2010**) and the private port is a fixed value.
* For an internal endpoint, the public port is not used, and the private port can be a range, or left blank or set to an asterisk to indicate it is automatically set by Azure.
* For input endpoints, the public port can only be a fixed value, and the private port can be a fixed value, or left blank or set to an asterisk to indicate it is automatically set by Azure.

If you want to use a single port number instead of a range, leave the text box for the end of the range blank.

For ports that are set to automatic, if you need to determine which port is actually used during runtime, your application can use the Azure Service Runtime API, which is documented in the [com.microsoft.windowsazure.serviceruntime package summary][].

To see how instance input endpoints can be used to help with debugging a multi-instance deployment, see [Debugging a specific role instance in a multi-instance deployment][].

To modify an endpoint, select the endpoint and click the **Edit** button in the **Endpoints** property page. A dialog will be opened allowing you to modify the endpoint name, type, and public and private ports. Press **OK** to save the modified endpoint values.

To delete an endpoint, select the endpoint and click the **Remove** button in the **Endpoints** property page, and then click **Yes** to confirm the deletion.

In order to properly configure some of the features (such as Caching, Remote Debugging, Session Affinity, or SSL offloading) enabled by the user on a role, the toolkit may automatically configure special endpoints that will be listed along with user-defined endpoints. The toolkit prevents the user from editing or deleting such automatically generated endpoints as long as the associated feature is enabled.

<a name="environment_variables_properties"></a> 
### Environment variables properties ###

Open the context menu for the role in Eclipse's Project Explorer pane, click **Azure**, and then click **Environment Variables**. Within this dialog, you have the ability to create an environment variable, as well as modify or remove an environment variable, as shown in the following image.

![][ic719506]

Environment variables are available to your startup script when the role starts.

>[AZURE.NOTE] When specifying environment variables, keep in mind that your deployment will be published to a Windows virtual machine, so your environment variables must be valid for a Windows-based operating system.

As an example of an environment variable being available when the role starts, create a new environment variable by clicking the **Add** button. The following shows an environment variable named **MyRoleVersion** being created and assigned the value **1.0**.

![][ic659268]

Within your jsp code, you could display the value using the `System.getenv` method:

    <body>
      <b> Hello World!</b>
      <p>Running role version: <%= System.getenv("MyRoleVersion") %></p>
    </body>

Resulting in this output when your application runs:

![][ic552233]

To modify an environment variable, select the environment variable and click the **Edit** button in the **Environment Variables** property page. A dialog will be opened allowing you to modify the environment variable properties. Press **OK** to save the environment variable values.

To delete an environment variable, select the environment variable and click the **Remove** button in the **Environment Variables** property page, and then click **Yes** to confirm the deletion.

In order to properly configure some of the features (such as Server Configuration, Remote Debugging or Local Storage) enabled by the user on a role, the toolkit may automatically configure special environment variables that will be listed along with user-defined environment variables. The toolkit prevents the user from editing or deleting such automatically generated environment variables as long as the associated feature is enabled.

<a name="session_affinity_properties"></a> 
### Load balancing / session affinity (a.k.a "sticky sessions") properties ###

Open the context menu for the role in Eclipse's Project Explorer pane, click **Azure**, and then click **Load Balancing**. Within this dialog, you have the ability to enable or disable session affinity, as shown in the following image.

![][ic719492]

For related information, see [Session Affinity][]. Also, note this feature's behavior in the context of SSL offloading, as described at [SSL Offloading][].

<a name="local_storage_properties"></a> 
### Local storage properties ###

Open the context menu for the role in Eclipse's Project Explorer pane, click **Azure**, and then click **Local Storage**. Within this dialog, you have the ability to create, modify or remove temporary local storage for the virtual machine that is running your application. Specific values can be set for the size of the local storage, as well as whether the contents are preserved when the role is recycled, as shown in the following image.

![][ic719508]

You can also optionally specify an environment variable that corresponds to the local storage.

By default, everything that you deploy into Azure is placed (and unzipped) in the **approot** folder of the role instance. While most simple deployments will fit there even after unzipping, the space allocated for the **approot** directory is limited and not well-defined (less than 1 GB is a reasonable rule of thumb). Therefore, to ensure Azure allocates sufficient disk space for larger deployments that might not fit in the **approot** folder, you should set up a local storage resource using the **Local Storage** dialog. For an easy way to do this, see [Deploying Large Deployments][].

You can easily reference the storage resource from startup scripts (for example, your **startup.cmd**) using the environment variable automatically associated by the Eclipse toolkit with the resource, as shown in the **Local Storage** dialog. That environment variable will contain the full path of the local resource you've configured at the time your startup script is executed. 

To modify a local storage resource, select the local storage resource and click the **Edit** button in the **Local Storage** property page. A dialog will be opened allowing you to modify the local storage resource properties. Press **OK** to save the local storage resource values.

To delete a local storage resource, select the local storage resource and click the **Remove** button in the **Local Storage** property page, and then click **Yes** to confirm the deletion.

<a name="server_configuration_properties"></a> 
### Server configuration properties ###

Open the context menu for the role in Eclipse's Project Explorer pane, click **Azure**, and then click **Server Configuration**. Within this dialog, you have the ability to add, remove, and modify the JDK and Java application server used by your deployment, as well as add or remove the applications (such as WAR, JAR or EAR files) used by your deployment.

### JDK configuration ###

This dialog allows you to specify the JDK package to use for your deployment. If you are using Eclipse on Windows, you can specify the JDK package to use locally when running in the Azure emulator and you have the option to deploy that local installation to Azure. On non-Windows operating systems, the emulator JDK setting is not applicable and you cannot deploy the locally installed JDK since it is not compatible with Windows. However, regardless of the operating system that you are using, you can always choose among the 3rd party JDK packages to deploy to Azure, or point at your own Windows-compatible JDK package from an alternate download location.

The following is an example of how you can specify a JDK on Windows:

![][ic780647]

If you are using Eclipse on Windows, you can specify a JDK to use with the compute emulator; to do so, ensure **Use the JDK from this file path for testing locally** is checked in the **Emulator deployment** section. Then, specify the local path to your JDK; you can browse to different JDK if the one you want to use is not selected automatically. You also have the option to deploy your JDK to your Azure cloud service; to do so, select the **Deploy my local JDK (auto-upload to cloud storage)** option in the **Cloud deployment** section.

Note: On non-Windows operating systems, the **Emulator deployment** settings and the **Deploy my local JDK** option are not available. The following example illustrates specifying a JDK on a Mac or other supported non-Windows operating system:

![][ic789643]

Regardless of the operating system you are on, you have the following two **Cloud deployment** options for the source and type of your JDK package:

* **Deploy a 3rd party JDK package available on Azure** 
* **Deploy from a custom download** 

If you are using the **Deploy a 3rd party JDK package available from Azure** option:

1. Check the checkbox named **Deploy a 3rd party JDK package available from Azure**.
1. From the drop-down list, select the 3rd party JDK package that is available on Azure.
1. Your **JDK** tab will look similar to the following on Windows:
	![][ic780648]
	And it will look similar to the following on Mac OS or other supported non-Windows operating systems:
	![][ic789643]
1. Click **OK** to save your changes.
1. When prompted to accept the license agreement from the 3rd party JDK package provider, review the license terms. Assuming you accept the terms, click **Yes** to close the **Accept license agreement** dialog.
	Note that the underlying logic for which items appear in the drop-down list for the **Deploy a 3rd party JDK package available from Azure** option can be customized. To customize the items, in the **JDK** dialog, click the **Customize** link. This will close the **JDK** property page and open the **componentsets.xml** file in Eclipse, which you can then modify as needed. Documentation for **componentsets.xml** is included in the **componentsets.xml** file itself.

If you are using the **Deploy a JDK from a custom download** option:

1. Create a ZIP of your JDK installation directory, ensuring that the directory node itself is the child of the ZIP structure, and not its contents. Take note of the name of the directory, as you will need it later, and keep in mind this JDK installation will be deployed to a Windows virtual machine.
1. Upload the ZIP into your Azure storage account as a blob. You can do this using an externally available tool for uploading blobs to Azure storage. It is recommended to use a private blob. Take note of the blob URL of the ZIP contents.
1. Check the checkbox named **Deploy a JDK from a custom download**.
	If you want to download from your Azure storage account, select the storage account from the **Storage account** drop-down list (you can click the **Accounts** link to modify what is in the list), which will partially fill in the **URL** field, and then fill in the remaining portion of the URL. If you do not want to use Azure storage, select **(none)** from the **Storage account** drop-down list, and enter the URL to your JDK download in the **URL** field. If using Azure storage, blob names in the URL must be lowercase.
1. Ensure that the **JAVA_HOME** textbox refers to the correct directory name. By default, it will reference the same JDK directory name as the value you chose for your local use. But if the directory contained in the ZIP has a different name (for example, due to using a different version), update the directory name in the **JAVA_HOME** textbox accordingly, since this setting will be used in the cloud (not in the compute emulator).
1. Click **OK** to save your changes.

That's it. Now, when you build for the cloud, you will notice the package size will be much smaller, the build process should typically take less time, and the deployment itself when you publish to the cloud should also take less time. Note that the **Deploy my local JDK (auto-upload to cloud storage)** or **Deploy a JDK from a custom download** options are in effect only when your application is deployed in the cloud. They have no effect on your compute emulator experience; the local version of the components will still be used when you deploy to the compute emulator. 

### Server configuration ###

The following is an example of how you can specify an application server.

![][ic796926]

Verify that the **Deploy a server of this type** checkbox is selected, and then choose the type of application server you want to use.

For specifying a server to use for cloud deployment, you can take advantage of the following options:

1. **Deploy a 3rd party server available on Azure** - this is especially applicable in dev/test scenarios where deployment efficiency and simplicity is a priority and the server does not require a custom configuration. Or when you want to use one of those servers as the starting point but you include appropriate server customization steps in your deployment's startup logic.
1. **Deploy from a custom download** - this is especially applicable in production scenarios when you have a specially prepared and configured server that you want to use in the cloud.
1. **Deploy my local server installation** - this is especially applicable in if your local server installation is already custom-configured for your use. If you choose this option, you must also specify your local server's path in the **Local server path** text box below.

If you are using the **Deploy a 3rd party server available on Azure** option:

1. Check the checkbox named **Deploy a 3rd party server available on Azure**.
1. From the dropdown menu, select the desired server software to use with your deployment in the cloud. Note, if you already specified a type of server to use earlier, you will be limited to choosing only a cloud server that is in the same family as that server type. But if you did not choose a server type, you can choose from any of the servers that are currently available on Azure and the server type will be automatically selected for you.
1. Click **OK** to save your changes.

If using the **Deploy from a custom download** option:

1. Make sure that you have already selected a server type according to the preceding steps. This tells the plugin how to deploy the server from your custom download, as it must be from the same family as your selected server type.
1. Check the checkbox named **Deploy from a custom download**.
	If you want to download from your Azure storage account, select the storage account from the **Storage account** drop-down list (you can click the **Accounts** link to modify what is in the list), which will partially fill in the **URL** field, and then fill in the remaining portion of the URL to your server download ZIP (when using Azure storage, blob names in the URL must be lowercase). If you do not want to use Azure storage, select **(none)** from the **Storage account** drop-down list, and enter the URL to your server download ZIP in the **URL** field. The ZIP would contain a child folder representing your application server installation directory. For example, if you are using a zip for Apache Tomcat 7.0.35, within the zip would be the child folder representing the installation directory, such as **apache-tomcat-7.0.35**. 
1. Specify the value for the home directory environment variable. It will default to the value used for your local application server, if any, but you can specify a different value if your cloud application server is different from your local application server. However, you need to make sure that your cloud application server is of the same family as the server type selected earlier.
	If you update your cloud application server zip in the future, you can manually change the home directory setting, or, to have it again match your local setting (if you changed your local application server too).
1. Click **OK** to save your changes.

The underlying logic for which items appear in the **Server** tab of the **Server Configuration** property page can be customized. This is an advanced feature that you might need if your needs extend beyond the default values or if you want to add other servers. To customize the logic, in the **Server** dialog, click the **Customize** link. This will close the **Server Configuration** property page and open the **componentsets.xml** file in Eclipse, which you can then modify as needed to extend the server configuration template. Documentation for **componentsets.xml** is included in the **componentsets.xml** file itself.

If you are using the **Deploy my local server (auto-upload to cloud storage)** option:

1. Check the checkbox named **Deploy my local server (auto-upload to cloud storage)**.
1. Using the **Storage account** drop-down list, select **(auto)**. If you specify **(auto)** here, the Eclipse toolkit will use the same storage account for your server as the one you select for your deployment in the **Publish to Azure** dialog.
1. Click **OK** to save your changes.

Select a server installation path on your computer in the **Local server path** text box if any of the following conditions are true:

* You want to test your deployment in the emulator (applies to Windows only).
* You want to deploy your locally installed server to the cloud.
* You want to use a custom server download of your own in the cloud, in which case, also ensure the **Deploy my local server (auto-upload to cloud storage)** option is selected above.

If none of the preceding options apply to your situation, the local server setting is optional.

### Applications configuration ###

The following is an example of how you can specify an application.

![][ic719512]

Click **Add** to add another application, or **Remove** to remove an application. For efficiency purposes, if you want to use a download for the source of an application when deploying to the cloud, use the [components properties](#components_properties) to specify a URL, storage account, etc. 

Beginning with the April 2014 release, your applications are automatically uploaded into the same storage account (under the **eclipsedeploy** container) as the one selected for your deployment. The startup logic of your deployment contains a step that first downloads those applications from that storage account. This means that you may upgrade your applications in your deployment without needing to rebuild and redeploy the entire package, by manually uploading newer versions of the application directly into that storage account (using the Azure portal for example), replacing the WAR files originally uploaded there by the toolkit. Then, just initiate the recycling of all those role instances using Azure's management portal again, or via command line utilities. (Triggering role recycling directly from within the Eclipse toolkit is not currently supported.)

### Notes about server configuration ###

Changes made through the **Server configuration** property page are reflected in the `<component>` elements of the package.xml file.

When you use the **Automatically upload...** or **Deploy from download...** options for either the JDK or application server, and you are building for the cloud (not the compute emulator), and you are connected to the network, you may notice build messages such as the following in the Console output, as the Ant builder verifies the download's availability:

`[windowsazurepackage] Verifying blob availability (https://example.blob.core.windows.net/temp/tomcat6.zip)...` 

If you selected the **Deploy from download...** option, the following warning may be shown, but the build will continue:

`[windowsazurepackage] warning: Failed to confirm blob availability! Make sure the URL and/or the access key is correct (https://example.blob.core.windows.net/temp/tomcat6.zip).` 

This warning is the only indication that the download's availability hasn't been verified. So if a deployment fails in the cloud for some reason, check to see if you received this warning.

If you want to disable the download verification (for example, if you feel it unnecessarily slows down the build), set the `verifydownloads` attribute to `false` in the `<windowsazurepackage>` element of package.xml: 

`<windowsazurepackage verifydownloads="false" ...>` 

If you selected the **Automatically upload...** option, then in the console window you will see build messages reporting the progress of the upload every 5 seconds, whenever an upload is necessary.

<a name="ssl_offloading_properties"></a> 
### SSL offloading properties ###

Open the context menu for the role in Eclipse's Project Explorer pane, click **Azure**, and then click **SSL Offloading**. 

![][ic719481]

Within this dialog, you can enable SSL offloading, allowing you to easily enable Hypertext Transfer Protocol Secure (HTTPS) support in your Java deployment on Azure, without requiring you to configure SSL in your Java application server. For more information, see [SSL Offloading][] and [How to Use SSL Offloading][].

## See Also ##

[Azure Toolkit for Eclipse][]

[Installing the Azure Toolkit for Eclipse][]

[Creating a Hello World Application for Azure in Eclipse][]

[Azure Project Properties][]

[Azure Storage Account List][]

For more information about using Azure with Java, see the [Azure Java Developer Center][].

<!-- URL List -->

[Azure Java Developer Center]: http://go.microsoft.com/fwlink/?LinkID=699547
[Azure Management Portal]: http://go.microsoft.com/fwlink/?LinkID=512959
[Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699529
[Azure Project Properties]: http://go.microsoft.com/fwlink/?LinkID=699524
[Azure Storage Account List]: http://go.microsoft.com/fwlink/?LinkID=699528
[com.microsoft.windowsazure.serviceruntime package summary]: http://azure.github.io/azure-sdk-for-java/com/microsoft/windowsazure/serviceruntime/package-summary.html
[Creating a Hello World Application for Azure in Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699533
[Debugging a specific role instance in a multi-instance deployment]: http://go.microsoft.com/fwlink/?LinkID=699535#debugging_specific_role_instance
[Debugging Azure Applications in Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699535
[Deploying Large Deployments]: http://go.microsoft.com/fwlink/?LinkID=699536
[How to Use Co-located Caching]: http://go.microsoft.com/fwlink/?LinkID=699542
[How to Use SSL Offloading]: http://go.microsoft.com/fwlink/?LinkID=699545
[Installing the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkId=699546
[Session Affinity]: http://go.microsoft.com/fwlink/?LinkID=699548
[SSL Offloading]: http://go.microsoft.com/fwlink/?LinkID=699549

<!-- IMG List -->

[ic789599]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic789599.png
[ic719499]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic719499.png
[ic719483]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic719483.png
[ic719501]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic719501.png
[ic710964]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic710964.png
[ic719502]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic719502.png
[ic719503]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic719503.png
[ic719504]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic719504.png
[ic719505]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic719505.png
[ic710897]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic710897.png
[ic719506]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic719506.png
[ic659268]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic659268.png
[ic552233]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic552233.png
[ic719492]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic719492.png
[ic719508]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic719508.png
[ic780647]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic780647.png
[ic789643]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic789643.png
[ic780648]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic780648.png
[ic789643]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic789643.png
[ic796926]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic796926.png
[ic719512]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic719512.png
[ic719481]: ./media/azure-toolkit-for-eclipse-azure-role-properties/ic719481.png
