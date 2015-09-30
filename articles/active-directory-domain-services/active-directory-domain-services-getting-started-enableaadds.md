<properties
	pageTitle="Azure Active Directory Domain Services preview: Getting Started | Microsoft Azure"
	description="Getting started with Azure Active Directory Domain Services"
	services="active-directory-domain-services"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="udayh"
	editor="femila"/>

<tags
	ms.service="active-directory-domain-services"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/30/2015"
	ms.author="mahesh-unnikrishnan"/>

# Azure AD Domain Services - Getting started

## Step 3: Enable Azure AD Domain Services
In this step you can enable Azure AD Domain Services for your directory. Perform the following configuration steps in order to enable Azure AD Domain Services for your directory.

1. Navigate to the **Azure management portal** ([https://manage.windowsazure.com](https://manage.windowsazure.com)).
2. Select the **Active Directory** node on the left pane.
3. Select the Azure AD tenant (directory) for which you would like to enable Azure AD Domain Services.
4. Click on the **Configure** tab.
5. Scroll down to a section titled **domain services**.
6. Toggle the option titled **Enable Domain Services for this directory** to **YES**. You will notice a few more configuration options for Azure AD Domain services appear on the page.
7. Specify the **DNS Domain name of Domain Services**.
   - The default domain name of the directory (i.e. ending with the **.onmicrosoft.com** domain suffix) will be selected by default.
   - You can however specify a custom DNS domain name.
   - The drop-down lists all domains that have been configured for your Azure AD directory – including verified as well as unverified domains that you configure in the ‘Domains’ tab.
   - Additionally, you can also specify a custom domain name in this editable drop-down.
8. The next step is to select a virtual network. Select the virtual network you just created in the drop-down titled **Connect Domain Services to this virtual network**.

9. When you are done selecting the above options, click ‘Save’ from the task pane at the bottom of the page to enable Azure AD Domain Services.
10. The page will display a ‘Pending …’ state, while Azure AD Domain Services is being enabled for your directory. Expect this process to take about 20 to 30 minutes.

When Azure AD Domain Services is enabled for your directory, the page will display the IP addresses at which Azure AD Domain Services are available in your chosen virtual network. These are the IP addresses at which managed domain controllers will be available on your selected virtual network. Note down these IP addresses so you can update the DNS settings for your virtual network.

> [AZURE.NOTE] Azure AD Domain Services provides high availability in the form of two domain controllers to service your domain. When you first enable Azure AD Domain Services for your domain, you will notice the IP addresses of the domain controllers show up one by one. The second (replica) domain controller will take a while to be provisioned and therefore its IP address will be displayed later. When both domain controllers are provisioned and active for your domain, you should see two IP addresses in the **domain services** section of the **Configure** tab.
