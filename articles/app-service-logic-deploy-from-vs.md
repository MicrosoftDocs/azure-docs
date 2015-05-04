<properties 
	pageTitle="Deploy from Visual Studio" 
	description="Create a project in Visual Studio to manage your Logic app." 
	authors="stepsic-microsoft-com" 
	manager="dwrede" 
	editor="" 
	services="app-service\logic" 
	documentationCenter=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/26/2015"
	ms.author="stepsic"/>
	
# Deploy from Visual Studio

Although the [Azure Portal](https://portal.azure.com) gives you a great way to design and manage your Logic apps, you may also want to deploy your Logic app from Visual Studio instead. There are a couple key capabilities this enables:

- Store your Logic app alongside the other assets in your Solution, so it can contain all aspects of your application
- Keep your Logic app definition checked into source control so that you can use TFS or Git to track revisions to it 

You have to have the Azure SDK 2.6 installed in order to follow the steps below. Find [the latest SDK for VS](http://azure.microsoft.com/downloads/) here.

## Create a project

1. Go to the **File** menu and select **New** >  **Project** (or, you can go to **Add** and then select **New project** to add it to an existing solution)
    ![File menu](./media/app-service-logic-deploy-from-vs/filemenu.png)

2. In the dialog find **Cloud** and then select **Azure Resource Group**. Type a **Name** and then click **OK**.
    ![Add new project](./media/app-service-logic-deploy-from-vs/addnewproject.png)

3. You now need to select if you want an **Logic app** or **Logic app + API app**. Selecting **Logic app** requires you to point to existing API's. If you select **Logic app + API app** then you can also create an new, empty, API app at the same time.
    ![Select Azure template](./media/app-service-logic-deploy-from-vs/selectazuretemplate.png)

4. Once you have selected your **Template** hit **OK**.

Now your Logic app project will be added to your solution. You should see the deployment in the Solution Explorer:
![Deployment](./media/app-service-logic-deploy-from-vs/deployment.png)

## Configuring your Logic app

Once you have a project you can edit the definition of your Logic app inside VS. Click on the JSON file in the solution explorer. You will see a placeholder definition that you can fill in with your application's logic.

It's recommended to use **parameters** throughout your definition. This will be useful if you want to deploy to both a development and production environment. In that case, you should put all environment-specific configuration in the `.param` file, and the parameters instead of the actual strings.

Today, Visual Studio does not have a built-in designer, so if you'd like to use a graphical interface (as opposed to writing JSON), you will need to use the Azure Portal. 

If you previously created a Logic app inside the Azure Portal and now want to check it in to source control, you can:
- Go to **Code view** in the portal and copy the definition.
- Use the Logic apps [REST API](https://msdn.microsoft.com/library/azure/dn948510.aspx) to get the definition.
- Use [Azure Resource manager powershell](powershell-azure-resource-manager.md),  specifically the [`Get-AzureResource` command](https://msdn.microsoft.com/library/dn654579.aspx) to download the definition.

## Deploying your Logic app

Finally, after you have configured your app you can deploy directly from Visual Studio in just a couple steps. 

1. Right-click on the deployment in the Solution Explorer and go to **Deploy** > **New deployment...**
    ![New deployment](./media/app-service-logic-deploy-from-vs/newdeployment.png)

2. You will be prompted to sign in to your Azure subscription(s). 

3. Now you need to choose the details of the resource group that you want to deploy the Logic app to. 
    ![Deploy to resource group](./media/app-service-logic-deploy-from-vs/deploytoresourcegroup.png)

    Be sure to select the right template and parameters files for the resource group (for example if you are deploying to a production environment you'll want to choose the production parameters file). 
    
4. The status of the deployment will appear in the **Output** window (you may need to choose **Azure Provisioning**. 
    ![Output](./media/app-service-logic-deploy-from-vs/output.png)

In the future you can revise your Logic app in source control and use Visual Studio to deploy new versions. Note that if you modify the definition in the Azure Portal directly, the next time that you deploy from Visual Studio those changes will be overriden.

If you do not want to user Visual Studio, but still want to having tooling to deploy your Logic app from source control you can always use the [API](https://msdn.microsoft.com/library/azure/dn948510.aspx) or [Powershell](powershell-azure-resource-manager.md) directly to automate your deployments. 