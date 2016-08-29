<properties
	pageTitle="Deploy a web app using MSDeploy with hostname and ssl certificate"
	description="Use an Azure Resource Manager template to deploy a web app using MSDeploy and setting up custom hostname and a SSL certificate"
	services="app-service\web"
	documentationCenter=""
	authors="jodehavi"
	/>

<tags
	ms.service="app-service-web"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/31/2016"
	ms.author="john.dehavilland"/>

# Deploy a web app with MSDeploy, custom hostname and SSL certificate

This guide walks through creating an end-to-end deployment for an Azure Web App, leveraging MSDeploy as well as adding a custom hostname and an SSL certificate to the ARM template.

For more information about creating templates, see [Authoring Azure Resource Manager Templates](../resource-group-authoring-templates.md).

###Create Sample Application

You will be deploying an ASP.NET web application. The first step is to create a simple web application (or you could choose to use an existing one - in which case you can skip this step).

Open Visual Studio 2015 and choose File > New Project. On the dialog that appears choose Web > ASP.NET Web Application. Under Templates choose Web and choose the MVC template. Select _Change authentication type_ to _No Authentication_. This is just to make the sample application as simple as possible.

At this point you will have a basic ASP.Net web app ready to use as part of your deployment process.

###Create MSDeploy package

Next step is to create the package to deploy the web app to Azure. To do this, save your project and then run the following from the command line:

	msbuild yourwebapp.csproj /t:Package /p:PackageLocation="path\to\package.zip"

This will create a zipped package under the PackageLocation folder. The application is now ready to be deployed, which you can now build out an Azure Resource Manager template to do that.

###Create ARM Template
First, let's start with a basic ARM template that will create a web application and a hosting plan (note that parameters and variables are not shown for brevity).

	{
		"name": "[parameters('appServicePlanName')]",
		"type": "Microsoft.Web/serverfarms",
		"location": "[resourceGroup().location]",
		"apiVersion": "2014-06-01",
		"dependsOn": [ ],
		"tags": {
		    "displayName": "appServicePlan"
		},
		"properties": {
		    "name": "[parameters('appServicePlanName')]",
		    "sku": "[parameters('appServicePlanSKU')]",
		    "workerSize": "[parameters('appServicePlanWorkerSize')]",
		    "numberOfWorkers": 1
		}
	},
	{
		"name": "[variables('webAppName')]",
		"type": "Microsoft.Web/sites",
		"location": "[resourceGroup().location]",
		"apiVersion": "2015-08-01",
		"dependsOn": [
		    "[concat('Microsoft.Web/serverfarms/', parameters('appServicePlanName'))]"
		],
		"tags": {
		    "[concat('hidden-related:', resourceGroup().id, '/providers/Microsoft.Web/serverfarms/', parameters('appServicePlanName'))]": "Resource",
		    "displayName": "webApp"
		},
		"properties": {
		    "name": "[variables('webAppName')]",
		    "serverFarmId": "[resourceId('Microsoft.Web/serverfarms/', parameters('appServicePlanName'))]"
		}
	}

Next, you will need to modify the web app resource to take a nested MSDeploy resource. This will allow you to reference the package created earlier and tell Azure Resource Manager to use MSDeploy to deploy the package to the Azure WebApp. The following shows the Microsoft.Web/sites resource with the nested MSDeploy resource:

    {
        "name": "[variables('webAppName')]",
        "type": "Microsoft.Web/sites",
        "location": "[resourceGroup().location]",
        "apiVersion": "2015-08-01",
        "dependsOn": [
            "[concat('Microsoft.Web/serverfarms/', parameters('appServicePlanName'))]"
        ],
        "tags": {
            "[concat('hidden-related:', resourceGroup().id, '/providers/Microsoft.Web/serverfarms/', parameters('appServicePlanName'))]": "Resource",
            "displayName": "webApp"
        },
        "properties": {
            "name": "[variables('webAppName')]",
            "serverFarmId": "[resourceId('Microsoft.Web/serverfarms/', parameters('appServicePlanName'))]"
        },
        "resources": [
            {
                "name": "MSDeploy",
                "type": "extensions",
                "location": "[resourceGroup().location]",
                "apiVersion": "2015-08-01",
                "dependsOn": [
                    "[concat('Microsoft.Web/sites/', variables('webAppName'))]"
                ],
                "tags": {
                    "displayName": "webDeploy"
                },
                "properties": {
                    "packageUri": "[concat(parameters('_artifactsLocation'), '/', parameters('webDeployPackageFolder'), '/', parameters('webDeployPackageFileName'), parameters('_artifactsLocationSasToken'))]",
                    "dbType": "None",
                    "connectionString": "",
                    "setParameters": {
                        "IIS Web Application Name": "[variables('webAppName')]"
                    }
                }
            }
        ]
    }

Now you will notice that the MSDeploy resource takes a **packageUri** property which is defined as follows:

	"packageUri": "[concat(parameters('_artifactsLocation'), '/', parameters('webDeployPackageFolder'), '/', parameters('webDeployPackageFileName'), parameters('_artifactsLocationSasToken'))]"

This **packageUri** takes the storage account uri which points to the storage account where you will upload your package zip to. The Azure Resource Manager will leverage [Shared Access Signatures](../storage/storage-dotnet-shared-access-signature-part-1.md) to pull the package down locally from the storage account when you deploy the template. This process will be automated via a PowerShell script that will upload the package and call the Azure Management API to create the keys required and pass those into the template as parameters (*_artifactsLocation* and *_artifactsLocationSasToken*). You will need to define parameters for the folder and filename the package is uploaded to under the storage container.

Next you need to add in another nested resource to setup the hostname bindings to leverage a custom domain. You will first need to ensure that you own the hostname and set it up to be verified by Azure that you own it - see [Configure a custom domain name in Azure App Service](web-sites-custom-domain-name.md). Once that is done you can add the following to your template under the Microsoft.Web/sites resource section:

	{
		"apiVersion": "2015-08-01",
		"type": "hostNameBindings",
		"name": "www.yourcustomdomain.com",
		"dependsOn": [
		    "[concat('Microsoft.Web/sites/', variables('webAppName'))]"
		],
		"properties": {
		    "domainId": null,
		    "hostNameType": "Verified",
		    "siteName": "variables('webAppName')"
		}
	}

Finally you need to add another top level resource, Microsoft.Web/certificates. This resource will contain your SSL certificate and will exist at the same level as your web app and hosting plan.

	{
	    "name": "[parameters('certificateName')]",
	    "apiVersion": "2014-04-01",
	    "type": "Microsoft.Web/certificates",
	    "location": "[resourceGroup().location]",
	    "properties": {
	        "pfxBlob": "pfx base64 blob",
	        "password": "some pass"
	    }
	}

You will need to have a valid SSL certificate in order to set up this resource. Once you have that valid certificate then you need to extract the pfx bytes as a base64 string. One option to extract this is to use the following PowerShell command:

	$fileContentBytes = get-content 'C:\path\to\cert.pfx' -Encoding Byte

	[System.Convert]::ToBase64String($fileContentBytes) | Out-File 'pfx-bytes.txt'

You could then pass this as a parameter to your ARM deployment template.

At this point the ARM template is ready.

###Deploy Template

The final steps are to piece this all together into a full end-to-end deployment. To make deployment easier you can leverage the **Deploy-AzureResourceGroup.ps1** PowerShell script that is added when you create an Azure Resource Group project in Visual Studio to help with uploading of any artifacts required in the template. It requires you to have created a storage account you want to use ahead of time. For this example, I created a shared storage account for the package.zip to be uploaded. The script will leverage AzCopy to upload the package to the storage account. You pass in your artifact folder location and the script will automatically upload all files within that directory to the named storage container. After calling Deploy-AzureResourceGroup.ps1 you have to then update the SSL bindings to map the custom hostname with your SSL certificate.

The following PowerShell shows the complete deployment calling the Deploy-AzureResourceGroup.ps1:

	#Set resource group name
	$rgName = "Name-of-resource-group"

	#call deploy-azureresourcegroup script to deploy web app

	.\Deploy-AzureResourceGroup.ps1 -ResourceGroupLocation "East US" `
									-ResourceGroupName $rgName `
									-UploadArtifacts `
									-StorageAccountName "name-of-storage-acct-for-package" `
									-StorageAccountResourceGroupName "resource-group-name-storage-acct" `
									-TemplateFile "web-app-deploy.json" `
									-TemplateParametersFile "web-app-deploy-parameters.json" `
									-ArtifactStagingDirectory "C:\path\to\packagefolder\"

	#update web app to bind ssl certificate to hostname. This has to be done after creation above.

	$cert = Get-PfxCertificate -FilePath C:\path\to\certificate.pfx

	$ar = Get-AzureRmResource -Name nameofwebsite -ResourceGroupName $rgName -ResourceType Microsoft.Web/sites -ApiVersion 2014-11-01

	$props = $ar.Properties

	$props.HostNameSslStates[2].'SslState' = 1
	$props.HostNameSslStates[2].'thumbprint' = $cert.Thumbprint
	$props.hostNameSslStates[2].'toUpdate' = $true

	Set-AzureRmResource -ApiVersion 2014-11-01 -Name nameofwebsite -ResourceGroupName $rgName -ResourceType Microsoft.Web/sites -PropertyObject $props

At this point your application should have been deployed and you should be able to browse to it via https://www.yourcustomdomain.com
