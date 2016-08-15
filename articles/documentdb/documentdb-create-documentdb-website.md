<properties 
	pageTitle="Deploy DocumentDB and Azure App Service Web Apps using an Azure Resource Manager Template | Microsoft Azure" 
	description="Learn how to deploy a DocumentDB account, Azure App Service Web Apps, and a sample web application using an Azure Resource Manager template." 
	services="documentdb, app-service\web" 
	authors="stephbaron" 
	manager="jhubbard" 
	editor="monicar" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/02/2016" 
	ms.author="stbaro"/>

# Deploy DocumentDB and Azure App Service Web Apps using an Azure Resource Manager Template

This tutorial shows you how to use an Azure Resource Manager template to deploy and integrate [Microsoft Azure DocumentDB](https://azure.microsoft.com/services/documentdb/), an [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) web app, and a sample web application.

Using Azure Resource Manager templates, you can easily automate the deployment and configuration of your Azure resources.  This tutorial shows how to deploy a web application and automatically configure DocumentDB account connection information.

After completing this tutorial, you will be able to answer the following questions:  

-	How can I use an Azure Resource Manager template to deploy and integrate a DocumentDB account and a web app in Azure App Service?
-	How can I use an Azure Resource Manager template to deploy and integrate a DocumentDB account, a web app in App Service Web Apps, and a Webdeploy application?

<a id="Prerequisites"></a>
## Prerequisites
> [AZURE.TIP] While this tutorial does not assume prior experience with Azure Resource Manager templates or JSON, should you wish to modify the referenced templates or deployment options, then knowledge of each of these areas will be required.

Before following the instructions in this tutorial, ensure that you have the following:

- An Azure subscription. Azure is a subscription-based platform.  For more information about obtaining a subscription, see [Purchase Options](https://azure.microsoft.com/pricing/purchase-options/), [Member Offers](https://azure.microsoft.com/pricing/member-offers/), or [Free Trial](https://azure.microsoft.com/pricing/free-trial/).

##<a id="CreateDB"></a>Step 1: Download the template files ##
Let's start by downloading the template files we will use in this tutorial.

1. Download the [Create a DocumentDB account, Web Apps, and deploy a demo application sample](https://portalcontent.blob.core.windows.net/samples/DocDBWebsiteTodo.json) template to a local folder (e.g. C:\DocumentDBTemplates). This template will deploy a DocumentDB account, an App Service web app, and a web application.  It will also automatically configure the web application to connect to the DocumentDB account.

2. Download the [Create a DocumentDB account and Web Apps sample](https://portalcontent.blob.core.windows.net/samples/DocDBWebSite.json) template to a local folder (e.g. C:\DocumentDBTemplates). This template will deploy a DocumentDB account, an App Service web app, and will modify the site's application settings to easily surface DocumentDB connection information, but does not include a web application.  

<a id="Build"></a>
##Step 2: Deploy the DocumentDB account, App Service web app and demo application sample

Now let's deploy our first template.

> [AZURE.TIP] The template does not validate that the web app name and DocumentDB account name entered below are a) valid and b) available.  It is highly recommended that you verify the availability of the names you plan to supply prior to submitting the deployment.

1. Login to the [Azure Portal](https://portal.azure.com), click New and search for "Template deployment".
	![Screenshot of the template deployment UI](./media/documentdb-create-documentdb-website/TemplateDeployment1.png)

2. Select the Template deployment item and click **Create**
	![Screenshot of the template deployment UI](./media/documentdb-create-documentdb-website/TemplateDeployment2.png)

3.  Click **Edit template**, paste the contents of the DocDBWebsiteTodo.json template file, and click **Save**.
	![Screenshot of the template deployment UI](./media/documentdb-create-documentdb-website/TemplateDeployment3.png)

4. Click **Edit parameters**, provide values for each of the mandatory parameters, and click **OK**.  The parameters are as follows:

	1. SITENAME: Specifies the App Service web app name and is used to construct the URL that you will use to access the web app (e.g. if you specify "mydemodocdbwebapp", then the URL by which you will access the web app will be mydemodocdbwebapp.azurewebsites.net).

	2. HOSTINGPLANNAME: Specifies the name of App Service hosting plan to create.

	3. LOCATION: Specifies the Azure location in which to create the DocumentDB and web app resources.

	4. DATABASEACCOUNTNAME: Specifies the name of the DocumentDB account to create.   

	![Screenshot of the template deployment UI](./media/documentdb-create-documentdb-website/TemplateDeployment4.png)

5. Choose an existing Resource group or provide a name to make a new resource group, and choose a location for the resource group.
	![Screenshot of the template deployment UI](./media/documentdb-create-documentdb-website/TemplateDeployment5.png)
  
6.  Click **Review legal terms**, **Purchase**, and then click **Create** to begin the deployment.  Select **Pin to dashboard** so the resulting deployment is easily visible on your Azure portal home page.
	![Screenshot of the template deployment UI](./media/documentdb-create-documentdb-website/TemplateDeployment6.png)

7.  When the deployment finishes, the Resource group blade will open.
	![Screenshot of the resource group blade](./media/documentdb-create-documentdb-website/TemplateDeployment7.png)  

8.  To use the application, simply navigate to the web app URL (in the example above, the URL would be http://mydemodocdbwebapp.azurewebsites.net).  You'll see the following web application:

	![Sample Todo application](./media/documentdb-create-documentdb-website/image2.png)

9. Go ahead and create a couple of tasks in the web app and then return to the Resource group blade in the Azure portal. Click the DocumentDB account resource in the Resources list and then click **Query Explorer**.
	![Screenshot of the Summary lens with the myotherdocumentdbwebapp web app highlighted](./media/documentdb-create-documentdb-website/TemplateDeployment8.png)  

10. Run the default query, "SELECT * FROM c" and inspect the results.  Notice that the query has retrieved the JSON representation of the todo items you created in step 7 above.  Feel free to experiment with queries; for example, try running SELECT * FROM c WHERE c.isComplete = true to return all todo items which have been marked as complete.

	![Screenshot of the Query Explorer and Results blades showing the query results](./media/documentdb-create-documentdb-website/image5.png)

11. Feel free to explore the DocumentDB portal experience or modify the sample Todo application.  When you're ready, let's deploy another template.
	
<a id="Build"></a> 
## Step 3: Deploy the Document account and web app sample

Now let's deploy our second template.  This template is useful to show how you can inject DocumentDB connection information such as account endpoint and master key into a web app as application settings or as a custom connection string. For example, perhaps you have your own web application that you would like to deploy with a DocumentDB account and have the connection information automatically populated during deployment.

> [AZURE.TIP] The template does not validate that the web app name and DocumentDB account name entered below are a) valid and b) available.  It is highly recommended that you verify the availability of the names you plan to supply prior to submitting the deployment.

1. In the [Azure Portal](https://portal.azure.com), click New and search for "Template deployment".
	![Screenshot of the template deployment UI](./media/documentdb-create-documentdb-website/TemplateDeployment1.png)

2. Select the Template deployment item and click **Create**
	![Screenshot of the template deployment UI](./media/documentdb-create-documentdb-website/TemplateDeployment2.png)

3.  Click **Edit template**, paste the contents of the DocDBWebSite.json template file, and click **Save**.
	![Screenshot of the template deployment UI](./media/documentdb-create-documentdb-website/TemplateDeployment3.png)

4. Click **Edit parameters**, provide values for each of the mandatory parameters, and click **OK**.  The parameters are as follows:

	1. SITENAME: Specifies the App Service web app name and is used to construct the URL that you will use to access the web app (e.g. if you specify "mydemodocdbwebapp", then the URL by which you will access the web app will be mydemodocdbwebapp.azurewebsites.net).

	2. HOSTINGPLANNAME: Specifies the name of App Service hosting plan to create.

	3. LOCATION: Specifies the Azure location in which to create the DocumentDB and web app resources.

	4. DATABASEACCOUNTNAME: Specifies the name of the DocumentDB account to create.   

	![Screenshot of the template deployment UI](./media/documentdb-create-documentdb-website/TemplateDeployment4.png)

5. Choose an existing Resource group or provide a name to make a new resource group, and choose a location for the resource group.
	![Screenshot of the template deployment UI](./media/documentdb-create-documentdb-website/TemplateDeployment5.png)
  
6.  Click **Review legal terms**, **Purchase**, and then click **Create** to begin the deployment.  Select **Pin to dashboard** so the resulting deployment is easily visible on your Azure portal home page.
	![Screenshot of the template deployment UI](./media/documentdb-create-documentdb-website/TemplateDeployment6.png)

7.  When the deployment finishes, the Resource group blade will open.
	![Screenshot of the resource group blade](./media/documentdb-create-documentdb-website/TemplateDeployment7.png)  

8. Click the Web App resource in the Resources list and then click **Application settings**
	![Screenshot of the resource group](./media/documentdb-create-documentdb-website/TemplateDeployment9.png)  

9. Note how there are application settings present for the DocumentDB endpoint and each of the DocumentDB master keys.
	![Screenshot of application settings](./media/documentdb-create-documentdb-website/TemplateDeployment10.png)  

10. Feel free to continue exploring the Azure Portal, or follow one of our DocumentDB [samples](http://go.microsoft.com/fwlink/?LinkID=402386) to create your own DocumentDB application.

	
	
<a name="NextSteps"></a>
## Next steps

Congratulations! You've deployed DocumentDB, App Service web app and a sample web application using Azure Resource Manager templates.

- To learn more about DocumentDB, click [here](http://azure.com/docdb).
- To learn more about Azure App Service Web apps, click [here](http://go.microsoft.com/fwlink/?LinkId=325362).
- To learn more about Azure Resource Manager templates, click [here](https://msdn.microsoft.com/library/azure/dn790549.aspx).


## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the Azure Classic Portal](http://go.microsoft.com/fwlink/?LinkId=529715)

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.
 
