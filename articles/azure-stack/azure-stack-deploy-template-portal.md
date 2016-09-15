<properties
	pageTitle="Deploy templates with the portal in Azure Stack | Microsoft Azure"
	description="Learn how to use the Azure Stack portal to deploy templates."
	services="azure-stack"
	documentationCenter=""
	authors="HeathL17"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/26/2016"
	ms.author="helaw"/>

# Deploy templates using the Azure Stack portal

Use the portal to deploy Azure Resource Manager templates to the Azure Stack POC.

Resource Manager templates deploy and provision all the resources for your application in a single, coordinated operation.

1.  Log in to the portal, click **New**, click **Custom**, and then click **Template deployment**.

2.  Click **Edit template**, then paste your JSON template code into the blade, and then click **Save**.

3.  Click **Edit parameters**, type values for the parameters listed, and then click **OK**.

4.  Click **Subscription**, choose the subscription you want to use, and then click **OK**.

5.  Click **Resource group**, choose an existing resource group or create a new one, and then click **OK**.

6.  Click **Create**. A new tile on the dashboard tracks the progress of your template deployment.

## Next steps

[Deploy templates with PowerShell](azure-stack-deploy-template-powershell.md)
