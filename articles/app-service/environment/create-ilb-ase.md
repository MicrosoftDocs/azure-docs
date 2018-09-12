---
title: Create and use an internal load balancer with an Azure App Service Environment
description: Details on how to create and use an internet-isolated Azure App Service Environment
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: 0f4c1fa4-e344-46e7-8d24-a25e247ae138
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 06/12/2018
ms.author: ccompy
ms.custom: mvc
---
# Create and use an internal load balancer with an App Service Environment #

 Azure App Service Environment is a deployment of Azure App Service into a subnet in an Azure virtual network (VNet). There are two ways to deploy an App Service Environment (ASE): 

- With a VIP on an external IP address, often called an External ASE.
- With a VIP on an internal IP address, often called an ILB ASE because the internal endpoint is an internal load balancer (ILB). 

This article shows you how to create an ILB ASE. For an overview on the ASE, see [Introduction to App Service Environments][Intro]. To learn how to create an External ASE, see [Create an External ASE][MakeExternalASE].

## Overview ##

You can deploy an ASE with an internet-accessible endpoint or with an IP address in your VNet. To set the IP address to a VNet address, the ASE must be deployed with an ILB. When you deploy your ASE with an ILB, you must provide:

-   Your own domain that you use when you create your apps.
-   The certificate used for HTTPS.
-   DNS management for your domain.

In return, you can do things such as:

-   Host intranet applications securely in the cloud, which you access through a site-to-site or Azure ExpressRoute VPN.
-   Host apps in the cloud that aren't listed in public DNS servers.
-   Create internet-isolated back-end apps, which your front-end apps can securely integrate with.

### Disabled functionality ###

There are some things that you can't do when you use an ILB ASE:

-   Use IP-based SSL.
-   Assign IP addresses to specific apps.
-   Buy and use a certificate with an app through the Azure portal. You can obtain certificates directly from a certificate authority and use them with your apps. You can't obtain them through the Azure portal.

## Create an ILB ASE ##

To create an ILB ASE:

1. In the Azure portal, select **Create a resource** > **Web** > **App Service Environment**.

1. Select your subscription.

1. Select or create a resource group.

1. Select or create a VNet.

1. If you select an existing VNet, you need to create a subnet to hold the ASE. Make sure to set a subnet size large enough to accommodate any future growth of your ASE. We recommend a size of `/24`, which has 256 addresses and can handle a maximum-sized ASE and any scaling needs. 

1. Select **Virtual Network/Location** > **Virtual Network Configuration**. Set the **VIP Type** to **Internal**.

1. Enter a domain name. This domain is the one used for apps created in this ASE. There are some restrictions. It can't be:

	* net	

	* azurewebsites.net

	* p.azurewebsites.net

	* &lt;asename&gt;.p.azurewebsites.net

   There is a feature called custom domain names that allows you to map an existing DNS name to your web app. You can read more about that feature in the [Map an existing DNS name to your web app][customdomain] document. The custom domain name used for apps and the domain name used by your ASE can't overlap. For an ILB ASE with the domain name _contoso.com_, you can't use custom domain names for your apps like:

	* www.contoso.com

	* abcd.def.contoso.com

	* abcd.contoso.com

   If you know the custom domain names for your apps, choose a domain for the ILB ASE that won’t have a conflict with those custom domain names. In this example, you can use something like *contoso-internal.com* for the domain of your ASE because that won't conflict with custom domain names that end in *.contoso.com*.

1. Select **OK**, and then select **Create**.

	![ASE creation][1]

On the **Virtual Network** blade, there is a **Virtual Network Configuration** option. You can use it to select an External VIP or an Internal VIP. The default is **External**. If you select **External**, your ASE uses an internet-accessible VIP. If you select **Internal**, your ASE is configured with an ILB on an IP address within your VNet.

After you select **Internal**, the ability to add more IP addresses to your ASE is removed. Instead, you need to provide the domain of the ASE. In an ASE with an External VIP, the name of the ASE is used in the domain for apps created in that ASE.

If you set **VIP Type** to **Internal**, your ASE name is not used in the domain for the ASE. You specify the domain explicitly. If your domain is *contoso.corp.net* and you create an app in that ASE named *timereporting*, the URL for that app is timereporting.contoso.corp.net.


## Create an app in an ILB ASE ##

You create an app in an ILB ASE in the same way that you create an app in an ASE normally.

1. In the Azure portal, select **Create a resource** > **Web + Mobile** > **Web App**.

1. Enter the name of the app.

1. Select the subscription.

1. Select or create a resource group.

1. Select your OS. 

	* If you want to create a Linux app using a custom Docker container, you can just bring your own container using the instructions [here][linuxapp]. 

1. Select or create an App Service plan. If you want to create a new App Service plan, select your ASE as the location. Select the worker pool where you want your App Service plan to be created. When you create the App Service plan, select your ASE as the location and the worker pool. When you specify the name of the app, the domain under your app name is replaced by the domain for your ASE.

1. Select **Create**. If you want the app to appear on your dashboard, select the **Pin to dashboard** check box.

	![App Service plan creation][2]

	Under **App name**, the domain name is updated to reflect the domain of your ASE.

## Post-ILB ASE creation validation ##

An ILB ASE is slightly different than the non-ILB ASE. As already noted, you need to manage your own DNS. You also have to provide your own certificate for HTTPS connections.

After you create your ASE, the domain name shows the domain you specified. A new item appears in the **Setting** menu called **ILB Certificate**. The ASE is created with a certificate that doesn't specify the ILB ASE domain. If you use the ASE with that certificate, your browser tells you that it's invalid. This certificate makes it easier to test HTTPS, but you need to upload your own certificate that's tied to your ILB ASE domain. This step is necessary regardless of whether your certificate is self-signed or acquired from a certificate authority.

![ILB ASE domain name][3]

Your ILB ASE needs a valid SSL certificate. Use internal certificate authorities, purchase a certificate from an external issuer, or use a self-signed certificate. Regardless of the source of the SSL certificate, the following certificate attributes need to be configured properly:

* **Subject**: This attribute must be set to *.your-root-domain-here.
* **Subject Alternative Name**: This attribute must include both **.your-root-domain-here* and **.scm.your-root-domain-here*. SSL connections to the SCM/Kudu site associated with each app use an address of the form *your-app-name.scm.your-root-domain-here*.

Convert/save the SSL certificate as a .pfx file. The .pfx file must include all intermediate and root certificates. Secure it with a password.

If you want to create a self-signed certificate, you can use the PowerShell commands here. Be sure to use your ILB ASE domain name instead of *internal.contoso.com*: 

	$certificate = New-SelfSignedCertificate -certstorelocation cert:\localmachine\my -dnsname "*.internal-contoso.com","*.scm.internal-contoso.com"
	
	$certThumbprint = "cert:\localMachine\my\" +$certificate.Thumbprint
	$password = ConvertTo-SecureString -String "CHANGETHISPASSWORD" -Force -AsPlainText
	
	$fileName = "exportedcert.pfx" 
	Export-PfxCertificate -cert $certThumbprint -FilePath $fileName -Password $password

The certificate that these PowerShell commands generate is flagged by browsers because the certificate wasn't created by a certificate authority that's in your browser's chain of trust. To get a certificate that your browser trusts, procure it from a commercial certificate authority in your browser's chain of trust. 

![Set ILB certificate][4]

To upload your own certificates and test access:

1. After the ASE is created, go to the ASE UI. Select **ASE** > **Settings** > **ILB Certificate**.

1. To set the ILB certificate, select the certificate .pfx file and enter the password. This step takes some time to process. A message appears stating that an upload operation is in progress.

1. Get the ILB address for your ASE. Select **ASE** > **Properties** > **Virtual IP Address**.

1. Create a web app in your ASE after the ASE is created.

1. Create a VM if you don't have one in that VNet.

	> [!NOTE] 
	> Don't try to create this VM in the same subnet as the ASE because it will fail or cause problems.
	>

1. Set the DNS for your ASE domain. You can use a wildcard with your domain in your DNS. To do some simple tests, edit the hosts file on your VM to set the web app name to the VIP IP address:

	a. If your ASE has the domain name _.ilbase.com_ and you create the web app named _mytestapp_, it's addressed at _mytestapp.ilbase.com_. You then set _mytestapp.ilbase.com_ to resolve to the ILB address. (On Windows, the hosts file is at _C:\Windows\System32\drivers\etc\_.)

	b. To test web deployment publishing or access to the advanced console, create a record for _mytestapp.scm.ilbase.com_.

1. Use a browser on that VM and go to http://mytestapp.ilbase.com. (Or go to whatever your web app name is with your domain.)

1. Use a browser on that VM and go to https://mytestapp.ilbase.com. If you use a self-signed certificate, accept the lack of security.

	The IP address for your ILB is listed under **IP addresses**. This list also has the IP addresses used by the external VIP and for inbound management traffic.

	![ILB IP address][5]

## Web jobs, Functions and the ILB ASE ##

Both Functions and web jobs are supported on an ILB ASE but for the portal to work with them, you must have network access to the SCM site.  This means your browser must either be on a host that is either in or connected to the virtual network.  

When you use Azure Functions on an ILB ASE, you might get an error message that says "We are not able to retrieve your functions right now. Please try again later." This error occurs because the Functions UI leverages the SCM site over HTTPS and the root certificate is not in the browser chain of trust. Web jobs has a similar problem. To avoid this problem you can do one of the following:

- Add the certificate to your trusted certificate store. This unblocks Edge and Internet Explorer.
- Use Chrome and go to the SCM site first, accept the untrusted certificate and then go to the portal.
- Use a commercial certificate that is in your browser chain of trust.  This is the best option.  

## DNS configuration ##

When you use an External VIP, the DNS is managed by Azure. Any app created in your ASE is automatically added to Azure DNS, which is a public DNS. In an ILB ASE, you must manage your own DNS. For a given domain such as _contoso.net_, you need to create DNS A records in your DNS that point to your ILB address for:

- *.contoso.net
- *.scm.contoso.net

If your ILB ASE domain is used for multiple things outside this ASE, you might need to manage DNS on a per-app-name basis. This method is challenging because you need to add each new app name into your DNS when you create it. For this reason, we recommend that you use a dedicated domain.

## Publish with an ILB ASE ##

For every app that's created, there are two endpoints. In an ILB ASE, you have *&lt;app name>.&lt;ILB ASE Domain>* and *&lt;app name>.scm.&lt;ILB ASE Domain>*. 

The SCM site name takes you to the Kudu console, called the **Advanced portal**, within the Azure portal. The Kudu console lets you view environment variables, explore the disk, use a console, and much more. For more information, see [Kudu console for Azure App Service][Kudu]. 

In the multitenant App Service and in an External ASE, there's single sign-on between the Azure portal and the Kudu console. For the ILB ASE, however, you need to use your publishing credentials to sign into the Kudu console.

Internet-based CI systems, such as GitHub and Azure DevOps, will still work with an ILB ASE if the build agent is internet accessible and on the same network as ILB ASE. So in case of Azure DevOps, if the build agent is created on the same VNET as ILB ASE (different subnet is fine), it will be able to pull code from Azure DevOps git and deploy to ILB ASE. 
If you don't want to create your own build agent, you need to use a CI system that uses a pull model, such as Dropbox.

The publishing endpoints for apps in an ILB ASE use the domain that the ILB ASE was created with. This domain appears in the app's publishing profile and in the app's portal blade (**Overview** > **Essentials** and also **Properties**). If you have an ILB ASE with the subdomain *contoso.net* and an app named *mytest*, use *mytest.contoso.net* for FTP and *mytest.scm.contoso.net* for web deployment.

## Couple an ILB ASE with a WAF device ##

Azure App Service provides many security measures that protect the system. They also help to determine whether an app was hacked. The best protection for a web application is to couple a hosting platform, such as Azure App Service, with a web application firewall (WAF). Because the ILB ASE has a network-isolated application endpoint, it's appropriate for such a use.

To learn more about how to configure your ILB ASE with a WAF device, see [Configure a web application firewall with your App Service environment][ASEWAF]. This article shows how to use a Barracuda virtual appliance with your ASE. Another option is to use Azure Application Gateway. Application Gateway uses the OWASP core rules to secure any applications placed behind it. For more information about Application Gateway, see [Introduction to the Azure web application firewall][AppGW].

## Get started ##

* To get started with ASEs, see [Introduction to App Service environments][Intro].
 
<!--Image references-->
[1]: ./media/creating_and_using_an_internal_load_balancer_with_app_service_environment/createilbase-network.png
[2]: ./media/creating_and_using_an_internal_load_balancer_with_app_service_environment/createilbase-webapp.png
[3]: ./media/creating_and_using_an_internal_load_balancer_with_app_service_environment/createilbase-certificate.png
[4]: ./media/creating_and_using_an_internal_load_balancer_with_app_service_environment/createilbase-certificate2.png
[5]: ./media/creating_and_using_an_internal_load_balancer_with_app_service_environment/createilbase-ipaddresses.png

<!--Links-->
[Intro]: ./intro.md
[MakeExternalASE]: ./create-external-ase.md
[MakeASEfromTemplate]: ./create-from-template.md
[MakeILBASE]: ./create-ilb-ase.md
[ASENetwork]: ./network-info.md
[UsingASE]: ./using-an-ase.md
[UDRs]: ../../virtual-network/virtual-networks-udr-overview.md
[NSGs]: ../../virtual-network/security-overview.md
[ConfigureASEv1]: app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: app-service-app-service-environment-intro.md
[webapps]: ../app-service-web-overview.md
[mobileapps]: ../../app-service-mobile/app-service-mobile-value-prop.md
[Functions]: ../../azure-functions/index.yml
[Pricing]: http://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/resource-group-overview.md
[ConfigureSSL]: ../web-sites-purchase-ssl-web-site.md
[Kudu]: http://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[ASEWAF]: app-service-app-service-environment-web-application-firewall.md
[AppGW]: ../../application-gateway/application-gateway-web-application-firewall-overview.md
[customdomain]: ../app-service-web-tutorial-custom-domain.md
[linuxapp]: ../containers/app-service-linux-intro.md
