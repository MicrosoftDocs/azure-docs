<properties
	pageTitle="Deploy templates with Visual Studio in Azure Stack | Microsoft Azure"
	description="Learn how to deploy templates with Visual Studio in Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/25/2016"
	ms.author="erikje"/>

# Deploy templates in Azure Stack using Visual Studio

Use Visual Studio to deploy Azure Resource Manager (ARM) templates to the Azure Stack POC.

ARM templates deploy and provision all of the resources for your application in a single, coordinated operation.

1.  Open Visual Studio 2015 Update 1.

2.  Click **File**, click **New**, and in the **New Project** dialog box click **Azure Resource Group**.

3.  Enter a **Name** for the new project, and then click **OK**.

4.  In the **Select Azure Template** dialog box, click **Windows Virtual Machine**, and then click **OK**.

  You can see a list of templates available in your new project by expanding the **Templates** node in the **Solution Explorer** pane.

5.  In the **Solution Explorer** pane, right-click the name of your project, click **Deploy**, then click **New Deployment**.

6.  In the **Deploy to Resource Group** dialog box, in the **Subscription** drop-down, select your Microsoft Azure Stack subscription.

7.  In the **Resource Group** list, choose an existing resource group or create a new one.

8.  In the **Resource group location** list, choose a location, and then click **Deploy**.

9.  In the **Edit Parameters** dialog box, enter values for the parameters (which vary by template), and then click **Save**.

## Next steps

[Deploy templates with the command line](azure-stack-deploy-template-command-line.md)
