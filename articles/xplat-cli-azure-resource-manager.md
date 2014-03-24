<properties linkid="script-xplat-intro" urlDisplayName="Microsoft Azure Cross-Platform Command-Line Interface" pageTitle="Using Microsoft Azure Cross-Platform Command-Line Interface with Azure Resource Manager" title="Using Microsoft Azure Cross-Platform Command-Line Interface with Azure Resource Manager" metaKeywords="windows azure cross-platform command-line interface Azure Resource Manager, windows azure command-line resource manager, azure command-line resource manager, azure cli resource manager" description="Use the Microsoft Azure Cross-Platform Command-Line Interface with Azure Resource Manager" metaCanonical="http://www.windowsazure.com/en-us/script/xplat-cli-intro" umbracoNaviHide="0" disqusComments="1" editor="mollybos" manager="paulettm" documentationCenter="" solutions="" authors="larryfr" services="" />

#Using the Azure Cross-Platform Command-Line Interface with Azure Resource Manager

The new Azure Resource Manager functionality allows you to manage resources in a declarative fashion using *templates*. Templates are JSON files that describe the configuration of resources within a group. 

The Microsoft Azure Cross-Platform Command-Line Interface (xplat-cli) provides commands that allow you to work with Azure Resource Manager from the command line, including scripts.

>[WACOM.NOTE] If you have not already installed and configured xplat-cli, see [Install and Configure the Microsoft Azure Cross-Platform Command-Line Interface][xplatsetup] for more steps on how to install, configure, and use the xplat-cli.


##Authentication

Currently, working with the Azure Resource Manager through the xplat-cli requires that you authenticate to Microsoft Azure using an organizational ID. Authenticating with a Microsoft Account or a certificate installed through a .publishsettings file will not work.

An organizational ID is a user that is managed by your organization, and defined in your organizations Azure Active Directory tenant. If you do not currently have an organizational ID, and are using a Microsoft account to log in to your Azure subscription, you can easily create an one using the following steps.

[Question: Isn't just the act of creating an AD and having it list your @hotmail account turning your @hotmail into an organizational ID?]

1. Login to the [Azure Management Portal][portal], and click on **Active Directory**.

2. If no directory exists, select **Create your directory** and provide the requested information.

3. Select your directory and add a new user. This new user is an organizational ID.

	>[WACOM.NOTE] During the creation of the user, you will be supplied with both an e-mail address for the user and a temporary password. Save this  information as it is used in another step.

4. From the management portal, select **Settings** and then select **Administrators**. Select **Add**, and add the new user as a co-administrator. This allows the organizational ID to manage your Azure subscription.

5. Finally, log out of the Azure portal and then log back in using the new organizational ID. If this is the first time logging in with this ID, you will be prompted to change the password.

For more information on organizational accounts with Microsoft Azure, see [Sign up for Microsoft Azure as an Organization][signuporg].

##Working with Groups and Templates

1. The Azure Resource Manager is currently in preview, so the xplat-cli commands to work with it are not enabled by default. Use the following command to enable the commands.

		azure config mode arm

2. When working with templates, you can either create your own, or use one from the Template Gallery. To list available templates from the gallery, use the following command.

		azure group template list

3. To view details of a template that will create an Azure Web Site and SQL Database, use the following command.

		azure group template show Microsoft.WebSiteSQLDatabase.0.1.0-preview1

4. Once you have selected a template, you can download it with the following command.

		azure group template download Microsoft.WebSiteSQLDatabase.0.1.0-preview1

	Downloading a template allows you to customize it to better suite your requirements. For example, adding another resource to the template.

5. Open the template file in a text editor. Note the **parameters** collection near the top. This contains a list of the parameters that this template expects in order to create the resources described by the template. When using a template, you must supply these parameters either as part of the command-line parameters, or by specifying a file containing the parameter values. Either way, the parameters must be in JSON format.

	To create a file that contains parameters for the Microsoft.WebSiteSQLDatabase.0.1.0-preview1 template, use the following data and create a file named **params.json**. Replace values beginning with **My** such as **MyWebSite** with your own values. Replace the **siteLocation** and **serverLocation** values with an Azure region near you.

        {
            
        }

1. After saving the **params.json** file, use the following command to create a new resource group based on the template. The `-e` parameter specifies the **params.json** file created in the previous step.

		azure group create MyGroupName "South Central US" -y Microsoft.WebSiteSQLDatabase.0.1.0-preview1 -d MyDeployment -e params.json

	Replace the **MyGroupName** and **South Central US** values with the group name and data center specified in the template.

	>[WACOM.NOTE] This command will return OK once the deployment has been uploaded, but before the deployment have been applied to resources in the group. To check the status of the deployment, use the following command.
	>
	> `azure group deployment show MyGroupName MyDeployment`
	> 
	> The **ProvisioningState** shows the status of the deployment.
	> 
	> If you realize that your configuration isn't correct, and need to stop a long running deployment, use the following command.
	> 
	> `azure group deployment stop MyGroupName MyDeployment`
	> 
	> If you do not provide a deployment name, one will be created automatically based on the current date and time.

3. To view the group, use the following command.

		azure group show MyGroupName

	This command returns information about the resources in the group. If you have multiple groups, you can use the `azure group list` command to retrieve a list of group names, and then use `azure group show` to view details of a specific group.

4. To view individual resources, such as the Web Site, within the group, use the following command.

		azure resource show MyGroupName MyWebSite Microsoft.Web/sites

	This command returns information related to the web site. For example, the **hostNames** field should contain the URL for the web site. Use this with your browser to verify that the web site is running.

##Working with resources

While templates allow you to declare group-wide changes in configuration, it is not suitable for all tasks. For example, if you encounter a problem with a resource such as a Web Site, you may want to enable logging. Creating a new deployment just to enable diagnostic logging is a bit extreme, so the xplat-cli provides commands to work directly with resources within a group. In the previous steps, the `azure resource show` command was used to display details for a specific resource. The following steps demonstrate how to modify a resource.

1. When viewing details on a resource, it is often useful to use the `--json` parameter to see the data structure returned from the server, as this is usually the same format it expects when we attempt to modify a value. Use the following command to return information on the Web Site resource.

		azure resource show MyGroupName MyWebSite Microsoft.Web/sites --json

	>[WACOM.NOTE] You can save the JSON data to file by using the &gt; character to pipe the output to file. For example:
	>
	> `azure resource show MyGroupName MyWebSite Micrsoft.Web/sites --json > myfile.json`

2. When viewing the data, note the **properties** object. It contains the properties for the web site. Diagnostic logging for the site is available through the [TBD] value. To enable **web server logging**, need to change [TBD] to [TBD]. The JSON used to make this change is `[TBD]`.

3. To enable web server logging for the Web Site resource, use the following command.

		azure resource set MyGroupName MyWebSite Microsoft.Web/sites -p "{\"propeties\":\"TBD\"}"

	The `-p` parameter provides the JSON string for this command. Note that quotes within the JSON string must be escaped with an '\' character.

4. To verify that the change has been applied, use the following command to view the Web Site resource and check the value of [TBD].

		azure resource show MyGroup MyWebSite Microsoft.Web/sites

##Logging

[warning! none of the following commands exist outside of spec currently]

Just as the previous section showed how to enable diagnostic logging for a Web Site resource, you can also view logs of operations against groups and resources.

1. Use the following to view the last operation performed on the group.

		azure group log show MyGroup

	To view all operations, use the `--all` parameter. For a the last deployment, use `--last-deployment`. For a specific deployment, use `--deployment` and specify the deployment name.

2. To view information for a specific resource, use the `azure resource log` command. For example, the following will return the last operation for the Web Resource in the group

		azure resource log MyGroup MyWebSite Microsoft.Web/sites

	To view all operations against this resource, use the `--all` parameter.


[signuporg]: http://www.windowsazure.com/en-us/documentation/articles/sign-up-organization/
[adtenant]: http://technet.microsoft.com/en-us/library/jj573650#createAzureTenant