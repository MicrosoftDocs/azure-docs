<properties
	pageTitle="SSL Certificates binding using PowerShell"
	description="Learn how to bind SSL certificates to your web app using PowerShell."
	services="app-service\web"
	documentationCenter=""
	authors="ahmedelnably"
	manager="stefsch"
	editor=""/>

<tags
	ms.service="app-service-web"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date=""
	ms.author="ahmedelnably"/>

# Azure App Service SSL Certificate Binding using PowerShell #

With the release of Microsoft Azure PowerShell version 1.1.0 a new cmdlet has been added that would give the user the ability to bind existing or new SSL certificates to an existing Web App.

[AZURE.INCLUDE [app-service-web-to-api-and-mobile](../../includes/app-service-web-to-api-and-mobile.md)] 


## Uploading and Binding a new SSL certificate ##

Scenario: The user would like to bind an SSL certificate to one of his web apps.

Knowing the resource group name that contains the web app, the web app name, the certificate .pfx file path on the user machine, the password for the certificate, and the custom hostname, we can use the following PowerShell command to create that SSL binding:

    New-AzureRmWebAppSSLBinding -ResourceGroupName myresourcegroup -WebAppName mytestapp -CertificateFilePath PathToPfxFile -CertificatePassword PlainTextPwd -Name www.contoso.com

## Uploading and Binding an existing SSL certificate ##

Scenario: The user would like to bind a previously uploaded SSL certificate to one of his web apps.

We can get the list of certificates already uploaded to a specific resource group by using the following command

	Get-AzureRmWebAppCertificate -ResourceGroupName myresourcegroup

Note that the certificates are local to a specific location and resource group, the user need to re-upload the certificate if the configured web app is in a different location and resource group other that that of the needed certificate 

Knowing the resource group name that contains the web app, the web app name, the certificate thumbprint, and the custom hostname, we can use the following PowerShell command to create that SSL binding:

    New-AzureRmWebAppSSLBinding -ResourceGroupName myresourcegroup -WebAppName mytestapp -Thumbprint <certificate thumbprint> -Name www.contoso.com

## Deleting an existing SSL binding  ##

Scenario: The user would like to delete an existing SSL binding.

Knowing the resource group name that contains the web app, the web app name, and the custom hostname, we can use the following PowerShell command to remove that SSL binding:

    Remove-AzureRmWebAppSSLBinding -ResourceGroupName myresourcegroup -WebAppName mytestapp -Name www.contoso.com

Note that if the removed SSL binding was the last binding using that certificate in that location, by default the certificate will be deleted, if the user want to keep the certificate he can use the DeleteCertificate option to keep the certificate

	Remove-AzureRmWebAppSSLBinding -ResourceGroupName myresourcegroup -WebAppName mytestapp -Name www.contoso.com -DeleteCertificate $false

### References ###
- [Introduction to App Service Environment](app-service-app-service-environment-intro.md)
- [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md)
