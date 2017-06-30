---
title: Create and Use an Internal Load Balancer with an Azure App Service Environment
description: Details on creating and using an internet isolated Azure App Service Environment
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
# Create and Use an Internal Load Balancer with an App Service Environment #

The App Service Environment (ASE) is a deployment of the Azure App Service into a subnet in your Azure Virtual Network (VNet). There are two ways to deploy an ASE: 

- with a VIP on an external IP address, often called an _External ASE_.
- with the VIP on an internal IP address, often called an _ILB ASE_ because the internal endpoint is an Internal Load Balancer (ILB). 

This article shows you how to create an _ILB ASE_.  For an overview on the ASE you can start with [An Introduction to the App Service Environments][Intro] and if you want to learn how to create an External ASE, start with [Creating an External ASE][MakeExternalASE].

## Overview ##

An ASE can be deployed with an internet accessible endpoint or with an IP address in your Virtual Network. In order to set the IP address to a Virtual Network address, the ASE has to be deployed with an ILB. When deploying your ASE with an ILB, you must provide:

-   your own domain that apps are created with
-   the certificate used for HTTPS
-   DNS management for your domain

In return, you can do things such as:

-   host intranet applications securely in the cloud, which you access through a Site-to-Site or ExpressRoute VPN
-   host apps in the cloud that are not listed in public DNS servers
-   create internet isolated back-end apps, which your front-end apps can securely integrate with

***Disabled functionality***

There are some things that you cannot do when using an ILB ASE, including:

-   using IP-based SSL
-   assigning IP addresses to specific apps
-   buying and using a certificate with an app through the portal. You can still obtain certificates directly with a Certificate Authority and use it with your apps, just not through the Azure portal.

## Create an ILB ASE ##

To create an ILB ASE:

1.  In the Azure portal, select **New -&gt; Web + Mobile -&gt; App Service Environment**.
2.  Select your subscription.
3.  Select or create a resource group.
4.  Select or create a Virtual Network.
5.  Create a subnet, if selecting a Virtual Network. Make sure to set a subnet size large enough to accommodate any future growth of your ASE. The recommended size is a `/25`, which has 128 addresses and can handle a maximum sized ASE. You cannot use a `/29` or smaller subnet size.  Infrastructure needs use up at least 5 addresses.  Even with a `/28` you would have a maximum scaling of 11 instances in a `/28` subnet. If you think you will need to go beyond the default maximum of 100 instances in your App Service plans someday, or will need to scale near 100 but with more rapid Front End scaling, then use a /24 with 256 addresses.
6.  Select **Virtual Network/Location -&gt; Virtual Network Configuration** and set the **VIP Type** to **Internal**.
7.  Provide domain name. This will be the domain used for apps created in this ASE. There are some restrictions. It cannot be:
	- net
    - azurewebsites.net
    - p.azurewebsites.net
    - &lt;asename&gt;.p.azurewebsites.net

	Also if you intend to use a custom domain name for the apps that are hosted with this ASE, you cannot have overlap between the custom domain name and the domain name used by your ASE. For an ILB ASE with the domain name of _contoso.com_, you cannot then use custom domain names for your apps that look like:
	- www.contoso.com
	- abcd.def.contoso.com
	- abcd.contoso.com

	If you know the custom domain names that you will want to use with the apps that you deploy onto your ILB ASE, then pick a domain for the ILB ASE during ILB ASE creation that won’t have a conflict. In this example, it could be something like _contoso-internal.com_.
8.  Select **Ok** and then **Create**.

	![][1]

Within the Virtual Network blade, there is a **Virtual Network Configuration** option. This lets you select between an External VIP or Internal VIP. The default is **External**. If you select **External**, then your ASE will use an internet accessible VIP. If you select **Internal**, your ASE will be configured with an ILB on an IP address within your Virtual Network.

After selecting **Internal**, the ability to add more IP addresses to your ASE is removed, and instead you need to provide the domain of the ASE. In an ASE with an External VIP, the name of the ASE is used in the domain for apps created in that ASE.

If you set **VIP Type** to **Internal**, your ASE name is not used in the domain for the ASE. You specify the domain explicitly. If your domain is ***contoso.corp.net*** and you create an app in that ASE named ***timereporting***, then the URL for that app is ***timereporting.contoso.corp.net***.

## Apps in an ILB ASE ##

Creating an app in an ILB ASE is the same as creating an app in an ASE normally.

1.  In the Azure portal select **New &gt; Web + Mobile &gt; Web** or **Mobile** or **API App**.
2.  Enter name of app.
3.  Select subscription.
4.  Select or create resource group.
5.  Select or create App Service plan. If you want to create a new App Service plan, then select your ASE as the location and select the worker pool you want your App Service plan to be created in. When you create the App Service plan, you select your ASE as the location and the worker pool. When you specify the name of the app, you will see that the domain under your app name is replaced by the domain for your ASE.
6.  Select **Create**. You should select the **Pin to dashboard** checkbox if you want the app to show up on your dashboard.

	![][2]

Under the app name, the domain name gets updated to reflect the domain of your ASE.

## Post ILB ASE creation validation ##

An ILB ASE is slightly different than the non-ILB ASE. As already noted, you need to manage your own DNS, and you also have to provide your own certificate for HTTPS connections.

After you create your ASE, you will notice that the domain name shows the domain you specified, and there is a new item in the **Setting** menu called **ILB Certificate**. The ASE is created with a certificate that does not specify the ILB ASE domain. If you use the ASE with that certificate, your browser will tell you that it is invalid. This
certificate makes it easier to test HTTPS, but the expectation is that you will need to upload your own certificate tied to your ILB ASE domain, regardless if it is self-signed or acquired from a certificate authority(CA).

![][3]

There are a variety of ways to obtain a valid SSL certificate including internal CAs, purchasing a certificate from an external issuer, and using a self-signed certificate. Regardless of the source of the SSL certificate, the following certificate attributes need to be configured properly:

-   _Subject_: This attribute must be set to _\*.your-root-domain-here_
-   _Subject Alternative Name_: This attribute must include both _\*.your-root-domain-here_, and _\*.scm.your-root-domain-here_. The reason for the second entry is that SSL connections to the SCM/Kudu site associated with each app will be made using an address of the form _your-app-name.scm.your-root-domain-here_

With a valid SSL certificate in hand, two additional preparatory steps are needed. The SSL certificate needs to be converted/saved as a .pfx file. Remember that the .pfx file needs to include all intermediate and root certificates, and also needs to be secured with a password.

If you want to create your own certificate using PowerShell you can use the commands shown below.  Be sure to use your ILB ASE domain name instead of *internal.contoso.com*. 

	$certificate = New-SelfSignedCertificate -certstorelocation cert:\localmachine\my -dnsname "\*.internal-contoso.com","\*.scm.internal-contoso.com"
	
	$certThumbprint = "cert:\localMachine\my\" +$certificate.Thumbprint
	$password = ConvertTo-SecureString -String "CHANGETHISPASSWORD" -Force -AsPlainText
	
	$fileName = "exportedcert.pfx" 
	Export-PfxCertificate -cert $certThumbprint -FilePath $fileName -Password $password

The certificate that these PowerShell commands generate will still be flagged by browsers, because it was not created by a CA that is in the chain of trust used by your browser. The only way to get a certificate that your browser will not have an issue with is to procure it from a commercial CA that is in the browser chain of trust.  

![][4]

To upload your own certificates and test access:

1.  Go to ASE UI after ASE is created (**ASE > Settings > ILB Certificates**).
2.  Set the ILB certificate by selecting the certificate pfx file and provide the password. This step takes a little while to process, and the message that an upload operation is in progress will be shown.
3.  Get the ILB address for your ASE (**ASE > Properties > Virtual IP Address**).
4.  Create a web app in your ASE after creation.
5.  Create a VM if you don't have one in that Virtual Network.

	> [!NOTE] 
	> Do not create this VM in the same subnet as the ASE. Otherwise, it will break your setup.
	>
	>

6.  Set the DNS for your ASE domain. You can use a wildcard with your domain in your DNS, or if you want to do some simple tests, edit the hosts file on your VM to set web app name to the VIP IP address. If your ASE has the domain name _.ilbase.com_ and you create the web app named _mytestapp_, then it will be addressed at _mytestapp.ilbase.com_. You will then set _mytestapp.ilbase.com_ to resolve to the ILB address. (On Windows, the hosts file is at _C:\Windows\System32\drivers\etc\_.) If you want to test web deploy publishing or accessing the advanced console, then you also need to create a record for _mytestapp.scm.ilbase.com_.
7.  Use a browser on that VM and go to ***http://mytestapp.ilbase.com*** (or whatever your web app name is with your domain).
8.  Use a browser on that VM and go to ***https://mytestapp.ilbase.com***. You will need to accept the lack of security if you use a self-signed certificate.

The IP address for your ILB is listed under **IP Addresses**. This also has the IP addresses used by the external VIP and for inbound management traffic.

![][5]

### Functions and the ILB ASE

When using Functions on an ILB ASE you can encounter an error that says, *"We are not able to retrieve your functions right now.  Please try again later."*  The reason for this is that the Functions UI leverages the scm site over HTTPS.  If you are using an HTTP certificate for your ASE that does not have a root certificate that is in the browser you can encounter this.  In addition the IE\Edge browsers don’t share the *accept-invalid-cert* setting between tabs. So you can either:

- add the cert to your trusted cert store 
- or use Chrome but you will need to go to the scm site first, accept the untrusted cert and then go to the portal

## DNS Configuration ##

When using an External VIP, the DNS is managed by Azure. Any app created in your ASE is automatically added to Azure DNS, which is a public DNS. In an ILB ASE, you must manage your own DNS. For a given domain such as _contoso.net_, you need to create DNS A records in your DNS that point to your ILB address for:

- *.contoso.net
- *.scm.contoso.net

If your ILB ASE domain is used for multiple things outside of this ASE, you may need to manage DNS on a per app name basis. This is a lot more challenging as you would need to add each new app name into your DNS when you create it. For this reason, the use of a dedicated domain is recommended.

## Publishing with an ILB ASE ##

For every app that is created, there are two endpoints. In an ILB ASE, you have *&lt;app name>.&lt;ILB ASE Domain>* as well as *&lt;app name>.scm.&lt;ILB ASE Domain>*. 

The SCM site name takes you to the Kudu console, which is called the **Advanced Portal** from within the Azure portal. The Kudu console lets you do a lot of things, including viewing environment variables, explore the disk, use a console, and much more. For more information, see [Kudu console for Azure App Service][Kudu]. 

In the multi-tenant App Service and in an External ASE, there is single sign-on between the Azure portal and the Kudu console. For the ILB ASE, however, you need to use your publishing credentials to sign into the Kudu console instead.

Internet-based CI systems, such as Github and VSTS, don't work with an ILB ASE as the publishing endpoint is not internet accessible. Instead, you need to use a CI system that uses a pull model, such as Dropbox.

The publishing endpoints for apps in an ILB ASE use the domain that the ILB ASE was created with. This can be seen in the app's publishing profile, and in the app's portal blade (in **Overview** > **Essentials** and also in **Properties**). If you have an ILB ASE with the subdomain *contoso.net* and an app named *mytest*, then you would FTP to *mytest.contoso.net* and perform web deploy to *mytest.scm.contoso.net*.

## Coupling an ILB ASE with a WAF device ##

Azure App Service provides a lot of security measures that protect the system and help determine if an app has been hacked. The best protection for a web application is to couple a hosting platform such as the Azure App Service with a Web Application Firewall (WAF). Because the ILB ASE has a network isolated application endpoint, it is perfect for such a usage.  

To learn more about configuring your ILB ASE with a WAF device, see [Configure a web application firewall with your App Service Environment][ASEWAF]. That article shows how to use a Barracuda virtual appliance with your ASE. Another option is to use the Azure Application Gateway. The App Gateway uses the OWASP core rules to secure any applications placed behind it. For more information about the Azure App Gateway, see [Introduction to the Azure Web Application Firewall][AppGW].

### Getting started ###

All articles and How-To's for App Service Environments are available in
the [README for Application Service Environments][ASEReadme].

To get started with App Service Environments, see [Introduction to App Service Environments][Intro].

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
