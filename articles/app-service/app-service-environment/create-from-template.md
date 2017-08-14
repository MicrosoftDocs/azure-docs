---
title: Creating an Azure App Service Environment using a resource manager template
description: Explains how to create an External or ILB Azure App Service Environment using a resource manager template
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: 6eb7d43d-e820-4a47-818c-80ff7d3b6f8e
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/13/2017
ms.author: ccompy
---
# How To Create an ASE Using Azure Resource Manager Templates

## Overview
App Service Environments (ASEs) can be created with an internet accessible endpoint or an endpoint on an internal address in the Azure Virtual Network (VNet).  When created with an internal endpoint, that endpoint is provided by an Azure component called an internal load balancer (ILB).  The ASE with a public endpoint is called an External ASE and the ASE on an internal IP address is called an ILB ASE.  

An ASE can be created using the Azure portal or with Azure Resource Manager templates.  This article walks through the steps and syntax needed to create an External ASE or ILB ASE with Azure Resource Manager templates.  To learn more about creating an ASE in the portal you can start with [Making an External ASE][MakeExternalASE] or [Making an ILB ASE][MakeILBASE].

When creating an ASE in the portal you can choosed to create your VNet at the same time or to pick a pre-existing VNet to deploy into.  When creating from a template you must start with: 
* A resource manager VNet
* A subnet in that VNet.  It is recommended that the ASE subnet is a /25 with 128 addresses so as to accomodate future growth.  This cannot be changed after ASE creation
* The resource id from your vnet.  You can get this from the Azure portal under your Azure Virtual Network Properties
* the subscription you want to deploy into
* The location you wish to deploy into

To automate your ASE creation:

1. Create the ASE from a template.  If creating an External ASE you are done with this one step.  If creating an ILB ASE there are a few extra things to do
2. After your ILB ASE is created, an SSL certificate matching to your ILB ASE domain is uploaded.
3. The uploaded SSL certificate is assigned to the ILB ASE as its "default" SSL certificate.  This SSL certificate will be used for SSL traffic to apps on the ILB ASE when the apps are addressed using the common root domain assigned to the ASE (e.g. https://someapp.mycustomrootcomain.com)


## Creating the ASE
An example Azure Resource Manager template that creates an ASE, and its associated parameters file, are available on GitHub [here][quickstartasev2create].

If you want to make an ILB ASE then there you should instead use the Resource Manager templates [here][quickstartilbasecreate].  They cater to that use case.  Most of the parameters in the *azuredeploy.parameters.json* file are common to creating both ILB ASEs, as well as External ASEs.  The list below calls out parameters of special note, or that are unique, when creating an ILB ASE:

* *interalLoadBalancingMode*:  In most cases set this to 3, which means both HTTP/HTTPS traffic on ports 80/443, and the control/data channel ports listened to by the FTP service on the ASE, will be bound to an ILB allocated virtual network internal address.  If this property is instead set to 2, then only the FTP service related ports (both control and data channels) will be bound to an ILB address, while the HTTP/HTTPS traffic will remain on the public VIP.
* *dnsSuffix*:  This parameter defines the default root domain that will be assigned to the ASE.  In the public variation of Azure App Service, the default root domain for all web apps is *azurewebsites.net*.  However since an ILB ASE is internal to a customer's virtual network, it doesn't make sense to use the public service's default root domain.  Instead, an ILB ASE should have a default root domain that makes sense for use within a company's internal virtual network.  For example, a hypothetical Contoso Corporation might use a default root domain of *internal-contoso.com* for apps that are intended to only be resolvable and accessible within Contoso's virtual network. 
* *ipSslAddressCount*:  This parameter is automatically defaulted to a value of 0 in the *azuredeploy.json* file because ILB ASEs only have a single ILB address.  There are no explicit IP-SSL addresses for an ILB ASE, and hence the IP-SSL address pool for an ILB ASE must be set to zero, otherwise a provisioning error will occur. 

Once the *azuredeploy.parameters.json* file has been filled in, the ASE can then be created using the following Powershell code snippet.  Change the file PATHs to match where the Azure Resource Manager template files are located on your machine.  Also remember to supply your own values for the Azure Resource Manager deployment name, and resource group name.

    $templatePath="PATH\azuredeploy.json"
    $parameterPath="PATH\azuredeploy.parameters.json"

    New-AzureRmResourceGroupDeployment -Name "CHANGEME" -ResourceGroupName "YOUR-RG-NAME-HERE" -TemplateFile $templatePath -TemplateParameterFile $parameterPath

After the Azure Resource Manager template is submitted it will take about an hour for the ASE to be created.  Once the creation completes, the ASE will show up in the portal UX in the list of App Service Environments for the subscription that triggered the deployment.

## Uploading and Configuring the "Default" SSL Certificate
Once the ILB ASE is created, an SSL certificate should be associated with the ASE as the "default" SSL certificate use for establishing SSL connections to apps.  Continuing with the hypothetical Contoso Corporation example, if the ASE's default DNS suffix is *internal-contoso.com*, then a connection to *https://some-random-app.internal-contoso.com* requires an SSL certificate that is valid for **.internal-contoso.com*. 

There are a variety of ways to obtain a valid SSL certificate including internal CAs, purchasing a certificate from an external issuer, and using a self-signed certificate.  Regardless of the source of the SSL certificate, the following certificate attributes need to be configured properly:

* *Subject*:  This attribute must be set to **.your-root-domain-here.com*
* *Subject Alternative Name*:  This attribute must include both **.your-root-domain-here.com*, and **.scm.your-root-domain-here.com*.  The reason for the second entry is that SSL connections to the SCM/Kudu site associated with each app will be made using an address of the form *your-app-name.scm.your-root-domain-here.com*.

With a valid SSL certificate in hand, two additional preparatory steps are needed.  The SSL certificate needs to be converted/saved as a .pfx file.  Remember that the .pfx file needs to include all intermediate and root certificates, and also needs to be secured with a password.

Then the resultant .pfx file needs to be converted into a base64 string because the SSL certificate will be uploaded using an Azure Resource Manager template.  Since Azure Resource Manager templates are text files, the .pfx file needs to be converted into a base64 string so it can be included as a parameter of the template.

The Powershell code snippet below shows an example of generating a self-signed certificate, exporting the certificate as a .pfx file, converting the .pfx file into a base64 encoded string, and then saving the base64 encoded string to a separate file.  The Powershell code for base64 encoding was adapted from the [Powershell Scripts Blog][examplebase64encoding].

    $certificate = New-SelfSignedCertificate -certstorelocation cert:\localmachine\my -dnsname "*.internal-contoso.com","*.scm.internal-contoso.com"

    $certThumbprint = "cert:\localMachine\my\" + $certificate.Thumbprint
    $password = ConvertTo-SecureString -String "CHANGETHISPASSWORD" -Force -AsPlainText

    $fileName = "exportedcert.pfx"
    Export-PfxCertificate -cert $certThumbprint -FilePath $fileName -Password $password     

    $fileContentBytes = get-content -encoding byte $fileName
    $fileContentEncoded = [System.Convert]::ToBase64String($fileContentBytes)
    $fileContentEncoded | set-content ($fileName + ".b64")

Once the SSL certificate has been successfully generated and converted to a base64 encoded string, the example Azure Resource Manager template on GitHub for [configuring the default SSL certificate][quickstartconfiguressl] can be used.

The parameters in the *azuredeploy.parameters.json* file are listed below:

* *appServiceEnvironmentName*:  The name of the ILB ASE being configured.
* *existingAseLocation*:  Text string containing the Azure region where the ILB ASE was deployed.  For example:  "South Central US".
* *pfxBlobString*:  The based64 encoded string representation of the .pfx file.  Using the code snippet shown earlier, you would copy the string contained in "exportedcert.pfx.b64" and paste it in as the value of the *pfxBlobString* attribute.
* *password*:  The password used to secure the .pfx file.
* *certificateThumbprint*:  The certificate's thumbprint.  If you retrieve this value from Powershell (e.g. *$certificate.Thumbprint* from the earlier code snippet), you can use the value as-is.  However if you copy the value from the Windows certificate dialog, remember to strip out the extraneous spaces.  The *certificateThumbprint* should look something like:  AF3143EB61D43F6727842115BB7F17BBCECAECAE
* *certificateName*:  A friendly string identifier of your own choosing used to identity the certificate.  The name is used as part of the unique Azure Resource Manager identifier for the *Microsoft.Web/certificates* entity representing the SSL certificate.  The name **must** end with the following suffix:  \_yourASENameHere_InternalLoadBalancingASE.  This suffix is used by the portal as an indicator that the certificate is used for securing an ILB-enabled ASE.

An abbreviated example of *azuredeploy.parameters.json* is shown below:

    {
         "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json",
         "contentVersion": "1.0.0.0",
         "parameters": {
              "appServiceEnvironmentName": {
                   "value": "yourASENameHere"
              },
              "existingAseLocation": {
                   "value": "East US 2"
              },
              "pfxBlobString": {
                   "value": "MIIKcAIBAz...snip...snip...pkCAgfQ"
              },
              "password": {
                   "value": "PASSWORDGOESHERE"
              },
              "certificateThumbprint": {
                   "value": "AF3143EB61D43F6727842115BB7F17BBCECAECAE"
              },
              "certificateName": {
                   "value": "DefaultCertificateFor_yourASENameHere_InternalLoadBalancingASE"
              }
         }
    }

Once the *azuredeploy.parameters.json* file has been filled in, the default SSL certificate can be configured using the following Powershell code snippet.  Change the file PATHs to match where the Azure Resource Manager template files are located on your machine.  Also remember to supply your own values for the Azure Resource Manager deployment name, and resource group name.

    $templatePath="PATH\azuredeploy.json"
    $parameterPath="PATH\azuredeploy.parameters.json"

    New-AzureRmResourceGroupDeployment -Name "CHANGEME" -ResourceGroupName "YOUR-RG-NAME-HERE" -TemplateFile $templatePath -TemplateParameterFile $parameterPath

After the Azure Resource Manager template is submitted it will take roughly forty minutes minutes per ASE front-end to apply the change.  For example, with a default sized ASE using two front-ends, the template will take around one hour and twenty minutes to complete.  While the template is running the ASE will not be able to scaled.  

Once the template completes, apps on the ILB ASE can be accessed over HTTPS and the connections will be secured using the default SSL certificate.  The default SSL certificate will be used when apps on the ILB ASE are addressed using a combination of the application name plus the default hostname.  For example *https://mycustomapp.internal-contoso.com* would use the default SSL certificate for **.internal-contoso.com*.

However, just like apps running on the public multi-tenant service, developers can also configure custom host names for individual apps, and then configure unique SNI SSL certificate bindings for individual apps.  

## ASEv1 ##
The App Service Environment has two versions: ASEv1 and ASEv2. The preceding information was centered around ASEv2. This section shows you the differences between ASEv1 and ASEv2.

In ASEv1, you need to manage all of the resources manually. That includes the front-ends, workers, and, IP addresses used for IP-based SSL. Before you can scale out your App Service plan, you need to first scale out the worker pool you want to host it in.

ASEv1 uses a different pricing model from ASEv2. In ASEv1, you need to pay for each core allocated. That includes cores used for front-ends or workers that are not hosting any workloads. In ASEv1, default maximum scale size of an App Service Environment is 55 total hosts. That includes workers and front-ends. The one advantage to ASEv1 is that it can be deployed in a classic virtual network as well as a Resource Manager virtual network. You can learn more about ASEv1 from here: [App Service Environment v1 introduction][ASEv1Intro]

If you want to create an ASEv1 using a Resource Manager template you can start here with [Creating an ILB ASE v1 with a Resource Manager template][ILBASEv1Template].


<!--Links-->
[quickstartilbasecreate]: http://azure.microsoft.com/documentation/templates/201-web-app-asev2-ilb-create
[quickstartasev2create]: http://azure.microsoft.com/documentation/templates/201-web-app-asev2-create
[quickstartconfiguressl]: http://azure.microsoft.com/documentation/templates/201-web-app-ase-ilb-configure-default-ssl
[quickstartwebapponasev2create]: http://azure.microsoft.com/documentation/templates/201-web-app-asp-app-on-asev2-create
[examplebase64encoding]: http://powershellscripts.blogspot.com/2007/02/base64-encode-file.html 
[configuringDefaultSSLCertificate]: https://azure.microsoft.com/documentation/templates/201-web-app-ase-ilb-configure-default-ssl/
[Intro]: ./intro.md
[MakeExternalASE]: ./create-external-ase.md
[MakeASEfromTemplate]: ./create-from-template.md
[MakeILBASE]: ./create-ilb-ase.md
[ASENetwork]: ./network-info.md
[ASEReadme]: ./readme.md
[UsingASE]: ./using-an-ase.md
[UDRs]: ../../virtual-network/virtual-networks-udr-overview.md
[NSGs]: ../../virtual-network/virtual-networks-nsg.md
[ConfigureASEv1]: ../../app-service-web/app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: ../../app-service-web/app-service-app-service-environment-intro.md
[webapps]: ../../app-service-web/app-service-web-overview.md
[mobileapps]: ../../app-service-mobile/app-service-mobile-value-prop.md
[APIapps]: ../../app-service-api/app-service-api-apps-why-best-platform.md
[Functions]: ../../azure-functions/index.yml
[Pricing]: http://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/resource-group-overview.md
[ConfigureSSL]: ../../app-service-web/web-sites-purchase-ssl-web-site.md
[Kudu]: http://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[AppDeploy]: ../../app-service-web/web-sites-deploy.md
[ASEWAF]: ../../app-service-web/app-service-app-service-environment-web-application-firewall.md
[AppGW]: ../../application-gateway/application-gateway-web-application-firewall-overview.md
[ILBASEv1Template]: ../../app-service-web/app-service-app-service-environment-create-ilb-ase-resourcemanager.md
