---
title: Create an ASE with Azure Resource Manager
description: Learn how to create an external or ILB App Service environment by using an Azure Resource Manager template.
author: madsd

ms.assetid: 6eb7d43d-e820-4a47-818c-80ff7d3b6f8e
ms.topic: article
ms.date: 03/27/2023
ms.author: madsd
ms.custom: seodec18
---
# Create an ASE by using an Azure Resource Manager template

## Overview

> [!IMPORTANT]
> This article is about App Service Environment v2 which is used with Isolated App Service plans. [App Service Environment v2 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). There's a new version of App Service Environment that is easier to use and runs on more powerful infrastructure. To learn more about the new version, start with the [Introduction to the App Service Environment](overview.md). If you're currently using App Service Environment v2, please follow the steps in [this article](migration-alternatives.md) to migrate to the new version.
>

Azure App Service environments (ASEs) can be created with an internet-accessible endpoint or an endpoint on an internal address in an Azure Virtual Network. When created with an internal endpoint, that endpoint is provided by an Azure component called an internal load balancer (ILB). The ASE on an internal IP address is called an ILB ASE. The ASE with a public endpoint is called an External ASE. 

An ASE can be created by using the Azure portal or an Azure Resource Manager template. This article walks through the steps and syntax you need to create an External ASE or ILB ASE with Resource Manager templates. To learn how to create an ASEv2 in the Azure portal, see [Make an External ASE][MakeExternalASE] or [Make an ILB ASE][MakeILBASE].

When you create an ASE in the Azure portal, you can create your virtual network at the same time or choose a pre-existing virtual network to deploy into. 

When you create an ASE from a template, you must start with: 

* An Azure Virtual Network.
* A subnet in that virtual network. We recommend an ASE subnet size of `/24` with 256 addresses to accommodate future growth and scaling needs. After the ASE is created, you can't change the size.
* The subscription you want to deploy into.
* The location you want to deploy into.

To automate your ASE creation, follow they guidelines in the following sections. If you're creating an ILB ASEv2 with custom dnsSuffix (for example, `internal-contoso.com`), there are a few more things to do.

1. After your ILB ASE with custom dnsSuffix is created, an TLS/SSL certificate that matches your ILB ASE domain should be uploaded.

2. The uploaded TLS/SSL certificate is assigned to the ILB ASE as its "default" TLS/SSL certificate.  This certificate is used for TLS/SSL traffic to apps on the ILB ASE when they use the common root domain that's assigned to the ASE (for example, `https://someapp.internal-contoso.com`).


## Create the ASE
A Resource Manager template that creates an ASE and its associated parameters file is available on GitHub for [ASEv2][quickstartasev2create].

If you want to make an ASE, use this Resource Manager template [ASEv2][quickstartilbasecreate] example. Most of the parameters in the *azuredeploy.parameters.json* file are common to the creation of ILB ASEs and External ASEs. The following list calls out parameters of special note, or that's unique, when you create an ILB ASE with an existing subnet.

### Parameters
* *aseName*: This parameter defines a unique ASE name.
* *location*: This parameter defines the location of the App Service Environment.
* *existingVirtualNetworkName*: This parameter defines the virtual network name of the existing virtual network and subnet where ASE will reside.
* *existingVirtualNetworkResourceGroup*: his parameter defines the resource group name of the existing virtual network and subnet where ASE will reside.
* *subnetName*: This parameter defines the subnet name of the existing virtual network and subnet where ASE will reside.
* *internalLoadBalancingMode*: In most cases, set this to 3, which means both HTTP/HTTPS traffic on ports 80/443, and the control/data channel ports listened to by the FTP service on the ASE, will be bound to an ILB-allocated virtual network internal address. If this property is set to 2, only the FTP service-related ports (both control and data channels) are bound to an ILB address. If this property is set to 0, the HTTP/HTTPS traffic remains on the public VIP.
* *dnsSuffix*: This parameter defines the default root domain that's assigned to the ASE. In the public variation of Azure App Service, the default root domain for all web apps is *azurewebsites.net*. Because an ILB ASE is internal to a customer's virtual network, it doesn't make sense to use the public service's default root domain. Instead, an ILB ASE should have a default root domain that makes sense for use within a company's internal virtual network. For example, Contoso Corporation might use a default root domain of *internal-contoso.com* for apps that are intended to be resolvable and accessible only within Contoso's virtual network. To specify custom root domain you need to use api version `2018-11-01` or earlier versions.
* *ipSslAddressCount*: This parameter automatically defaults to a value of 0 in the *azuredeploy.json* file because ILB ASEs only have a single ILB address. There are no explicit IP-SSL addresses for an ILB ASE. Hence, the IP-SSL address pool for an ILB ASE must be set to zero. Otherwise, a provisioning error occurs.

After the *azuredeploy.parameters.json* file is filled in, create the ASE by using the PowerShell code snippet. Change the file paths to match the Resource Manager template-file locations on your machine. Remember to supply your own values for the Resource Manager deployment name and the resource group name:

```powershell
$templatePath="PATH\azuredeploy.json"
$parameterPath="PATH\azuredeploy.parameters.json"

New-AzResourceGroupDeployment -Name "CHANGEME" -ResourceGroupName "YOUR-RG-NAME-HERE" -TemplateFile $templatePath -TemplateParameterFile $parameterPath
```

It takes about two hours for the ASE to be created. Then the ASE shows up in the portal in the list of ASEs for the subscription that triggered the deployment.

## Upload and configure the "default" TLS/SSL certificate
A TLS/SSL certificate must be associated with the ASE as the "default" TLS/SSL certificate that's used to establish TLS connections to apps. If the ASE's default DNS suffix is *internal-contoso.com*, a connection to `https://some-random-app.internal-contoso.com` requires an TLS/SSL certificate that's valid for **.internal-contoso.com*. 

Obtain a valid TLS/SSL certificate by using internal certificate authorities, purchasing a certificate from an external issuer, or using a self-signed certificate. Regardless of the source of the TLS/SSL certificate, the following certificate attributes must be configured properly:

* **Subject**: This attribute must be set to **.your-root-domain-here.com*.
* **Subject Alternative Name**: This attribute must include both **.your-root-domain-here.com* and **.scm.your-root-domain-here.com*. TLS connections to the SCM/Kudu site associated with each app use an address of the form *your-app-name.scm.your-root-domain-here.com*.

With a valid TLS/SSL certificate in hand, two more preparatory steps are needed. Convert/save the TLS/SSL certificate as a .pfx file. Remember that the .pfx file must include all intermediate and root certificates. Secure it with a password.

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
* *certificateThumbprint*: The certificate's thumbprint. If you retrieve this value from PowerShell (for example, `$certificate.Thumbprint` from the earlier code snippet), you can use the value as is. If you copy the value from the Windows certificate dialog box, remember to strip out the extraneous spaces. The *certificateThumbprint* should look something like  AF3143EB61D43F6727842115BB7F17BBCECAECAE.
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

It takes roughly 40 minutes per ASE front end to apply the change. For example, for a default-sized ASE that uses two front ends, the template takes around 1 hour and 20 minutes to complete. While the template is running, the ASE can't scale.  

After the template finishes, apps on the ILB ASE can be accessed over HTTPS. The connections are secured by using the default TLS/SSL certificate. The default TLS/SSL certificate is used when apps on the ILB ASE are addressed by using a combination of the application name plus the default host name. For example, `https://mycustomapp.internal-contoso.com` uses the default TLS/SSL certificate for **.internal-contoso.com*.

However, just like apps that run on the public multitenant service, developers can configure custom host names for individual apps. They also can configure unique SNI TLS/SSL certificate bindings for individual apps.

<!--Links-->
[quickstartilbasecreate]: https://azure.microsoft.com/resources/templates/web-app-asev2-ilb-create
[quickstartasev2create]: https://azure.microsoft.com/resources/templates/web-app-asev2-create
[quickstartconfiguressl]: https://azure.microsoft.com/resources/templates/web-app-ase-ilb-configure-default-ssl
[quickstartwebapponasev2create]: https://azure.microsoft.com/resources/templates/web-app-asp-app-on-asev2-create
[examplebase64encoding]: https://powershellscripts.blogspot.com/2007/02/base64-encode-file.html 
[configuringDefaultSSLCertificate]: https://azure.microsoft.com/resources/templates/web-app-ase-ilb-configure-default-ssl/
[Intro]: ./intro.md
[MakeExternalASE]: ./create-external-ase.md
[MakeASEfromTemplate]: ./create-from-template.md
[MakeILBASE]: ./create-ilb-ase.md
[ASENetwork]: ./network-info.md
[UsingASE]: ./using-an-ase.md
[ConfigureASEv1]: app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: app-service-app-service-environment-intro.md
[Pricing]: https://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/management/overview.md
[ConfigureSSL]: ../../app-service/configure-ssl-certificate.md
