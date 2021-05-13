---
title: Create an ASE with ARM
description: Learn how to create an external or ILB App Service environment by using an Azure Resource Manager template.
author: ccompy

ms.assetid: 6eb7d43d-e820-4a47-818c-80ff7d3b6f8e
ms.topic: article
ms.date: 06/13/2017
ms.author: ccompy
ms.custom: seodec18, devx-track-azurepowershell
---
# Create an ASE by using an Azure Resource Manager template

## Overview

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

Azure App Service environments (ASEs) can be created with an internet-accessible endpoint or an endpoint on an internal address in an Azure virtual network (VNet). When created with an internal endpoint, that endpoint is provided by an Azure component called an internal load balancer (ILB). The ASE on an internal IP address is called an ILB ASE. The ASE with a public endpoint is called an External ASE. 

An ASE can be created by using the Azure portal or an Azure Resource Manager template. This article walks through the steps and syntax you need to create an External ASE or ILB ASE with Resource Manager templates. To learn how to create an ASE in the Azure portal, see [Make an External ASE][MakeExternalASE] or [Make an ILB ASE][MakeILBASE].

When you create an ASE in the Azure portal, you can create your VNet at the same time or choose a preexisting VNet to deploy into. When you create an ASE from a template, you must start with: 

* A Resource Manager VNet.
* A subnet in that VNet. We recommend an ASE subnet size of `/24` with 256 addresses to accommodate future growth and scaling needs. After the ASE is created, you can't change the size.
* The resource ID from your VNet. You can get this information from the Azure portal under your virtual network properties.
* The subscription you want to deploy into.
* The location you want to deploy into.

To automate your ASE creation:

1. Create the ASE from a template. If you create an External ASE, you're finished after this step. If you create an ILB ASE, there are a few more things to do.

2. After your ILB ASE is created, an TLS/SSL certificate that matches your ILB ASE domain is uploaded.

3. The uploaded TLS/SSL certificate is assigned to the ILB ASE as its "default" TLS/SSL certificate.  This certificate is used for TLS/SSL traffic to apps on the ILB ASE when they use the common root domain that's assigned to the ASE (for example, `https://someapp.mycustomrootdomain.com`).


## Create the ASE
A Resource Manager template that creates an ASE and its associated parameters file is available [in an example][quickstartasev2create] on GitHub.

If you want to make an ILB ASE, use these Resource Manager template [examples][quickstartilbasecreate]. They cater to that use case. Most of the parameters in the *azuredeploy.parameters.json* file are common to the creation of ILB ASEs and External ASEs. The following list calls out parameters of special note, or that are unique, when you create an ILB ASE:

* *internalLoadBalancingMode*: In most cases, set this to 3, which means both HTTP/HTTPS traffic on ports 80/443, and the control/data channel ports listened to by the FTP service on the ASE, will be bound to an ILB-allocated virtual network internal address. If this property is set to 2, only the FTP service-related ports (both control and data channels) are bound to an ILB address. The HTTP/HTTPS traffic remains on the public VIP.
* *dnsSuffix*: This parameter defines the default root domain that's assigned to the ASE. In the public variation of Azure App Service, the default root domain for all web apps is *azurewebsites.net*. Because an ILB ASE is internal to a customer's virtual network, it doesn't make sense to use the public service's default root domain. Instead, an ILB ASE should have a default root domain that makes sense for use within a company's internal virtual network. For example, Contoso Corporation might use a default root domain of *internal-contoso.com* for apps that are intended to be resolvable and accessible only within Contoso's virtual network. 
* *ipSslAddressCount*: This parameter automatically defaults to a value of 0 in the *azuredeploy.json* file because ILB ASEs only have a single ILB address. There are no explicit IP-SSL addresses for an ILB ASE. Hence, the IP-SSL address pool for an ILB ASE must be set to zero. Otherwise, a provisioning error occurs. 

After the *azuredeploy.parameters.json* file is filled in, create the ASE by using the PowerShell code snippet. Change the file paths to match the Resource Manager template-file locations on your machine. Remember to supply your own values for the Resource Manager deployment name and the resource group name:

```powershell
$templatePath="PATH\azuredeploy.json"
$parameterPath="PATH\azuredeploy.parameters.json"

New-AzResourceGroupDeployment -Name "CHANGEME" -ResourceGroupName "YOUR-RG-NAME-HERE" -TemplateFile $templatePath -TemplateParameterFile $parameterPath
```

It takes about an hour for the ASE to be created. Then the ASE shows up in the portal in the list of ASEs for the subscription that triggered the deployment.

## Upload and configure the "default" TLS/SSL certificate
A TLS/SSL certificate must be associated with the ASE as the "default" TLS/SSL certificate that's used to establish TLS connections to apps. If the ASE's default DNS suffix is *internal-contoso.com*, a connection to `https://some-random-app.internal-contoso.com` requires an TLS/SSL certificate that's valid for **.internal-contoso.com*. 

Obtain a valid TLS/SSL certificate by using internal certificate authorities, purchasing a certificate from an external issuer, or using a self-signed certificate. Regardless of the source of the TLS/SSL certificate, the following certificate attributes must be configured properly:

* **Subject**: This attribute must be set to **.your-root-domain-here.com*.
* **Subject Alternative Name**: This attribute must include both **.your-root-domain-here.com* and **.scm.your-root-domain-here.com*. TLS connections to the SCM/Kudu site associated with each app use an address of the form *your-app-name.scm.your-root-domain-here.com*.

With a valid TLS/SSL certificate in hand, two additional preparatory steps are needed. Convert/save the TLS/SSL certificate as a .pfx file. Remember that the .pfx file must include all intermediate and root certificates. Secure it with a password.

The .pfx file needs to be converted into a base64 string because the TLS/SSL certificate is uploaded by using a Resource Manager template. Because Resource Manager templates are text files, the .pfx file must be converted into a base64 string. This way it can be included as a parameter of the template.

Use the following PowerShell code snippet to:

* Generate a self-signed certificate.
* Export the certificate as a .pfx file.
* Convert the .pfx file into a base64-encoded string.
* Save the base64-encoded string to a separate file. 

This PowerShell code for base64 encoding was adapted from the [PowerShell scripts blog][examplebase64encoding]:

```powershell
$certificate = New-SelfSignedCertificate -certstorelocation cert:\localmachine\my -dnsname "*.internal-contoso.com","*.scm.internal-contoso.com"

$certThumbprint = "cert:\localMachine\my\" + $certificate.Thumbprint
$password = ConvertTo-SecureString -String "CHANGETHISPASSWORD" -Force -AsPlainText

$fileName = "exportedcert.pfx"
Export-PfxCertificate -cert $certThumbprint -FilePath $fileName -Password $password     

$fileContentBytes = get-content -encoding byte $fileName
$fileContentEncoded = [System.Convert]::ToBase64String($fileContentBytes)
$fileContentEncoded | set-content ($fileName + ".b64")
```

After the TLS/SSL certificate is successfully generated and converted to a base64-encoded string, use the example Resource Manager template [Configure the default SSL certificate][quickstartconfiguressl] on GitHub. 

The parameters in the *azuredeploy.parameters.json* file are listed here:

* *appServiceEnvironmentName*: The name of the ILB ASE being configured.
* *existingAseLocation*: Text string containing the Azure region where the ILB ASE was deployed.  For example: "South Central US".
* *pfxBlobString*: The based64-encoded string representation of the .pfx file. Use the code snippet shown earlier and copy the string contained in "exportedcert.pfx.b64". Paste it in as the value of the *pfxBlobString* attribute.
* *password*: The password used to secure the .pfx file.
* *certificateThumbprint*: The certificate's thumbprint. If you retrieve this value from PowerShell (for example, *$certificate.Thumbprint* from the earlier code snippet), you can use the value as is. If you copy the value from the Windows certificate dialog box, remember to strip out the extraneous spaces. The *certificateThumbprint* should look something like  AF3143EB61D43F6727842115BB7F17BBCECAECAE.
* *certificateName*: A friendly string identifier of your own choosing used to identity the certificate. The name is used as part of the unique Resource Manager identifier for the *Microsoft.Web/certificates* entity that represents the TLS/SSL certificate. The name *must* end with the following suffix: \_yourASENameHere_InternalLoadBalancingASE. The Azure portal uses this suffix as an indicator that the certificate is used to secure an ILB-enabled ASE.

An abbreviated example of *azuredeploy.parameters.json* is shown here:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json",
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
```

After the *azuredeploy.parameters.json* file is filled in, configure the default TLS/SSL certificate by using the PowerShell code snippet. Change the file paths to match where the Resource Manager template files are located on your machine. Remember to supply your own values for the Resource Manager deployment name and the resource group name:

```powershell
$templatePath="PATH\azuredeploy.json"
$parameterPath="PATH\azuredeploy.parameters.json"

New-AzResourceGroupDeployment -Name "CHANGEME" -ResourceGroupName "YOUR-RG-NAME-HERE" -TemplateFile $templatePath -TemplateParameterFile $parameterPath
```

It takes roughly 40 minutes per ASE front end to apply the change. For example, for a default-sized ASE that uses two front ends, the template takes around one hour and 20 minutes to complete. While the template is running, the ASE can't scale.  

After the template finishes, apps on the ILB ASE can be accessed over HTTPS. The connections are secured by using the default TLS/SSL certificate. The default TLS/SSL certificate is used when apps on the ILB ASE are addressed by using a combination of the application name plus the default host name. For example, `https://mycustomapp.internal-contoso.com` uses the default TLS/SSL certificate for **.internal-contoso.com*.

However, just like apps that run on the public multitenant service, developers can configure custom host names for individual apps. They also can configure unique SNI TLS/SSL certificate bindings for individual apps.

## App Service Environment v1 ##
App Service Environment has two versions: ASEv1 and ASEv2. The preceding information was based on ASEv2. This section shows you the differences between ASEv1 and ASEv2.

In ASEv1, you manage all of the resources manually. That includes the front ends, workers, and IP addresses used for IP-based SSL. Before you can scale out your App Service plan, you must scale out the worker pool that you want to host it.

ASEv1 uses a different pricing model from ASEv2. In ASEv1, you pay for each vCPU allocated. That includes vCPUs that are used for front ends or workers that aren't hosting any workloads. In ASEv1, the default maximum-scale size of an ASE is 55 total hosts. That includes workers and front ends. One advantage to ASEv1 is that it can be deployed in a classic virtual network and a Resource Manager virtual network. To learn more about ASEv1, see [App Service Environment v1 introduction][ASEv1Intro].

To create an ASEv1 by using a Resource Manager template, see [Create an ILB ASE v1 with a Resource Manager template][ILBASEv1Template].


<!--Links-->
[quickstartilbasecreate]: https://azure.microsoft.com/documentation/templates/201-web-app-asev2-ilb-create
[quickstartasev2create]: https://azure.microsoft.com/documentation/templates/201-web-app-asev2-create
[quickstartconfiguressl]: https://azure.microsoft.com/documentation/templates/201-web-app-ase-ilb-configure-default-ssl
[quickstartwebapponasev2create]: https://azure.microsoft.com/documentation/templates/201-web-app-asp-app-on-asev2-create
[examplebase64encoding]: https://powershellscripts.blogspot.com/2007/02/base64-encode-file.html 
[configuringDefaultSSLCertificate]: https://azure.microsoft.com/documentation/templates/201-web-app-ase-ilb-configure-default-ssl/
[Intro]: ./intro.md
[MakeExternalASE]: ./create-external-ase.md
[MakeASEfromTemplate]: ./create-from-template.md
[MakeILBASE]: ./create-ilb-ase.md
[ASENetwork]: ./network-info.md
[UsingASE]: ./using-an-ase.md
[UDRs]: ../../virtual-network/virtual-networks-udr-overview.md
[NSGs]: ../../virtual-network/network-security-groups-overview.md
[ConfigureASEv1]: app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: app-service-app-service-environment-intro.md
[mobileapps]: /previous-versions/azure/app-service-mobile/app-service-mobile-value-prop
[Functions]: ../../azure-functions/index.yml
[Pricing]: https://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/management/overview.md
[ConfigureSSL]: ../../app-service/configure-ssl-certificate.md
[Kudu]: https://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[ASEWAF]: app-service-app-service-environment-web-application-firewall.md
[AppGW]: ../../web-application-firewall/ag/ag-overview.md
[ILBASEv1Template]: app-service-app-service-environment-create-ilb-ase-resourcemanager.md
