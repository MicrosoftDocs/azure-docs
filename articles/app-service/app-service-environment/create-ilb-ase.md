---
title: Create and use an internal load balancer with an Azure App Service Environment
description: Details on how to create and use an Internet-isolated Azure App Service Environment
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: 0f4c1fa4-e344-46e7-8d24-a25e247ae138
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/13/2017
ms.author: ccompy
---
# Create and use an internal load balancer with an App Service Environment #

The Azure App Service Environment is a deployment of the Azure App Service into a subnet in your Azure virtual network. There are two ways to deploy an App Service Environment (ASE): 

- With a VIP on an external IP address, often called an External ASE.
- With a VIP on an internal IP address, often called an ILB ASE because the internal endpoint is an internal load balancer (ILB). 

This article shows you how to create an ILB ASE. For an overview on the ASE, see [Introduction to App Service Environments][Intro]. To learn how to create an External ASE, see [Create an External ASE][MakeExternalASE].

## Overview ##

An ASE can be deployed with an Internet-accessible endpoint or with an IP address in your virtual network. To set the IP address to a virtual network address, the ASE must be deployed with an ILB. When you deploy your ASE with an ILB, you must provide:

-   Your own domain that you use when you create your apps.
-   The certificate used for HTTPS.
-   DNS management for your domain.

In return, you can do things such as:

-   Host intranet applications securely in the cloud, which you access through a site-to-site or Azure ExpressRoute VPN.
-   Host apps in the cloud that aren't listed in public DNS servers.
-   Create Internet-isolated back-end apps that can securely integrate with your front-end apps.

### Disabled functionality ###

There are some things that you can't do when you use an ILB ASE:

-   Use IP-based SSL.
-   Assign IP addresses to specific apps.
-   Buy and use a certificate with an app through the Azure portal. You can obtain certificates directly with a certificate authority and use them with your apps. You can't obtain them through the Azure portal.

## Create an ILB ASE ##

To create an ILB ASE:

1. In the Azure portal, select **New** > **Web + Mobile** > **App Service Environment**.

2. Select your subscription.

3. Select or create a resource group.

4. Select or create a virtual network.

5. If you select a virtual network, create a subnet. Make sure to set a subnet size large enough to accommodate any future growth of your ASE. We recommend a size of `/25`, which has 128 addresses and can handle a maximum-sized ASE. You can't use a `/29` or smaller subnet size.  Infrastructure needs use up at least 5 addresses, which leaves a maximum scaling of 11 instances in a `/28` subnet. Use a `/24` with 256 addresses:

	* If you might need to go beyond the default maximum of 100 instances in your App Service plans someday.
	* You need to scale near 100 but with more rapid Front-End scaling.

6. Select **Virtual Network/Location** > **Virtual Network Configuration**. Set the **VIP Type** to **Internal**.

7. Provide a domain name. This is the domain used for apps created in this ASE. There are some restrictions. It can't be:

	- net
    - azurewebsites.net
    - p.azurewebsites.net
    - &lt;asename&gt;.p.azurewebsites.net

	 If you intend to use a custom domain name for the apps that are hosted with this ASE, you can't have overlap between the custom domain name and the domain name used by your ASE. For an ILB ASE with the domain name of _contoso.com_, you can't use custom domain names for your apps that look like:

	- www.contoso.com
	- abcd.def.contoso.com
	- abcd.contoso.com

	If you know the custom domain names that you want to use with the apps that you deploy onto your ILB ASE, choose a domain for the ILB ASE during ILB ASE creation that won’t have a conflict. In this example, it might be something like _contoso-internal.com_.

8. Select **OK**, and then select **Create**.

	![][1]

9. On the **Virtual Network** blade, select **Virtual Network Configuration**. Select **External** to configure your ASE with an Internet-accessible VIP. Select **Internal** to configure your ASE with an ILB on an IP address within your virtual network.

	* If you select **Internal**, you can't add more IP addresses to your ASE. Instead, you need to provide the domain of the ASE. In an ASE with an External VIP, the name of the ASE is used in the domain for apps created in that ASE.

	* If you set **VIP Type** to **Internal**, your ASE name isn't used in the domain for the ASE. You specify the domain explicitly. If your domain is *contoso.corp.net* and you create an app in that ASE named *timereporting*, the URL for that app is timereporting.contoso.corp.net.

## Create an app in an ILB ASE ##

You create an app in an ILB ASE in the same way that you create an app in an ASE normally.

1. In the Azure portal, select **New** > **Web + Mobile** > **Web** or **Mobile** or **API App**.

2. Enter the name of the app.

3. Select the subscription.

4. Select or create a resource group.

5. Select or create an App Service plan. If you want to create a new App Service plan, select your ASE as the location. Select the worker pool where you want your App Service plan to be created. When you create the App Service plan, select your ASE as the location and the worker pool. When you specify the name of the app, the domain under your app name is replaced by the domain for your ASE.

6. Select **Create**. If you want the app to appear on your dashboard, select the **Pin to dashboard** checkbox.

	![][2]

	Under the **App name**, the domain name is updated to reflect the domain of your ASE.

## Post-ILB ASE creation validation ##

An ILB ASE is slightly different than the non-ILB ASE. As already noted, you need to manage your own DNS. You also have to provide your own certificate for HTTPS connections.

After you create your ASE, the domain name shows the domain you specified. A new item appears in the **Setting** menu called **ILB Certificate**. The ASE is created with a certificate that doesn't specify the ILB ASE domain. If you use the ASE with that certificate, your browser tells you that it's invalid. This certificate makes it easier to test HTTPS, but you need to upload your own certificate that's tied to your ILB ASE domain. This step is necessary regardless of whether your certificate is self-signed or acquired from a certificate authority.

![][3]

You can obtain a valid SSL certificate by using internal certificate authorities, purchasing a certificate from an external issuer, or by using a self-signed certificate. Regardless of the source of the SSL certificate, the following certificate attributes need to be configured properly:

-   **Subject**: This attribute must be set to _\*.your-root-domain-here_.
-   **Subject Alternative Name**: This attribute must include both _\*.your-root-domain-here_ and _\*.scm.your-root-domain-here_. The second entry is needed because SSL connections to the SCM/Kudu site associated with each app are made by using an address of the form _your-app-name.scm.your-root-domain-here_.

With a valid SSL certificate in hand, two additional preparatory steps are needed. The SSL certificate needs to be converted/saved as a .pfx file. Remember that the .pfx file needs to include all intermediate and root certificates. It also needs to be secured with a password.

To create your own certificate by using PowerShell, use the following commands. Be sure to use your ILB ASE domain name instead of *internal.contoso.com*. 

	$certificate = New-SelfSignedCertificate -certstorelocation cert:\localmachine\my -dnsname "\*.internal-contoso.com","\*.scm.internal-contoso.com"
	
	$certThumbprint = "cert:\localMachine\my\" +$certificate.Thumbprint
	$password = ConvertTo-SecureString -String "CHANGETHISPASSWORD" -Force -AsPlainText
	
	$fileName = "exportedcert.pfx" 
	Export-PfxCertificate -cert $certThumbprint -FilePath $fileName -Password $password

The certificate that these PowerShell commands generate is flagged by browsers because it wasn't created by a certificate authority that's in the chain of trust used by your browser. The only way to get a certificate that your browser trusts is to procure it from a commercial certificate authority that's in the browser chain of trust. 

![][4]

To upload your own certificates and test access:

1. Go to the ASE UI after the ASE is created. Select **ASE** > **Settings** > **ILB Certificate**.

2. To set the ILB certificate, select the certificate .pfx file and enter the password. This step takes some time to process. A message displays stating that an upload operation is in progress.

3. Get the ILB address for your ASE. Select **ASE** > **Properties** > **Virtual IP Address**.

4. Create a web app in your ASE after the ASE is created.

5. Create a VM if you don't have one in that virtual network.

	> [!NOTE] 
	> Don't create this VM in the same subnet as the ASE. Otherwise, it will break your setup.
	>
	>

6. Set the DNS for your ASE domain. You can use a wildcard with your domain in your DNS. To do some simple tests, edit the hosts file on your VM to set the web app name to the VIP IP address.

	* If your ASE has the domain name _.ilbase.com_ and you create the web app named _mytestapp_, it's addressed at _mytestapp.ilbase.com_. You then set _mytestapp.ilbase.com_ to resolve to the ILB address. (On Windows, the hosts file is at _C:\Windows\System32\drivers\etc\_.) 
	* To test web deploy publishing or accessing the advanced console, you also need to create a record for _mytestapp.scm.ilbase.com_.

7. Use a browser on that VM and go to http://mytestapp.ilbase.com, or whatever your web app name is with your domain.

8. Use a browser on that VM and go to https://mytestapp.ilbase.com. If you use a self-signed certificate, accept the lack of security.

	The IP address for your ILB is listed under **IP addresses**. This list also has the IP addresses used by the external VIP and for inbound management traffic.

	![][5]

### Functions and the ILB ASE

When you use Functions on an ILB ASE, you might encounter an error that says "We are not able to retrieve your functions right now. Please try again later." This error occurs because the Functions UI leverages the scm site over HTTPS. If you use an HTTP certificate for your ASE that doesn't have a root certificate that's in the browser, you might encounter this situation. In addition, the Internet Explorer\Edge browsers don’t share the *accept-invalid-cert* setting between tabs. So you can either:

- Add the cert to your trusted cert store. 
- Or use Chrome. But you need to go to the scm site first, accept the untrusted cert, and then go to the portal.

## DNS configuration ##

When you use an External VIP, the DNS is managed by Azure. Any app created in your ASE is automatically added to Azure DNS, which is a public DNS. In an ILB ASE, you must manage your own DNS. For a given domain such as _contoso.net_, you need to create DNS A records in your DNS that point to your ILB address for:

- *.contoso.net
- *.scm.contoso.net

If your ILB ASE domain is used for multiple things outside of this ASE, you might need to manage DNS on a per-app-name basis. This method is challenging because you need to add each new app name into your DNS when you create it. For this reason, we recommend that you use a dedicated domain.

## Publishing with an ILB ASE ##

For every app that's created, there are two endpoints. In an ILB ASE, you have *&lt;app name>.&lt;ILB ASE Domain>* and *&lt;app name>.scm.&lt;ILB ASE Domain>*. 

The SCM site name takes you to the Kudu console, which is called the **Advanced Portal** from within the Azure portal. The Kudu console lets you view environment variables, explore the disk, use a console, and much more. For more information, see [Kudu console for Azure App Service][Kudu]. 

In the multitenant App Service and in an External ASE, there's single sign-on between the Azure portal and the Kudu console. For the ILB ASE, however, you need to use your publishing credentials to sign into the Kudu console.

Internet-based CI systems, such as GitHub and VSTS, don't work with an ILB ASE because the publishing endpoint isn't Internet accessible. Instead, you need to use a CI system that uses a pull model, such as Dropbox.

The publishing endpoints for apps in an ILB ASE use the domain that the ILB ASE was created with. This domain can be seen in the app's publishing profile and in the app's portal blade (in **Overview** > **Essentials** and also in **Properties**). If you have an ILB ASE with the subdomain *contoso.net* and an app named *mytest*, you use *mytest.contoso.net* for FTP and  *mytest.scm.contoso.net* for web deployment.

## Coupling an ILB ASE with a WAF device ##

Azure App Service provides many security measures that protect the system and help to determine if an app is hacked. The best protection for a web application is to couple a hosting platform, such as the Azure App Service, with a web application firewall (WAF). Because the ILB ASE has a network-isolated application endpoint, it's appropriate for such a use.  

To learn more about how to configure your ILB ASE with a WAF device, see [Configure a web application firewall with your App Service Environment][ASEWAF]. This article shows how to use a Barracuda virtual appliance with your ASE. Another option is to use the Azure Application Gateway. The Application Gateway uses the OWASP core rules to secure any applications placed behind it. For more information about the Application Gateway, see [Introduction to the Azure Web Application Firewall][AppGW].

## Get started ##

All articles and how-to instructions for ASEs are available in
the [README for Application Service Environments][ASEReadme].

To get started with ASEs, see [Introduction to App Service Environments][Intro].

For more information about the Azure App Service platform, see [Azure App Service](http://azure.microsoft.com/documentation/articles/app-service-value-prop-what-is/).
 
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
