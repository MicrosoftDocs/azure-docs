<properties
	pageTitle="What is PowerApps Enterprise and how to get started | Microsoft Azure"
	description="Get started with PowerApps Enterprise and create the app service environment"
	services=""
    suite="powerapps"
	documentationCenter=""
	authors="linhtranms"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/02/2016"
   ms.author="litran"/>

# What is Microsoft PowerApps enterprise?

> [AZURE.IMPORTANT] This topic is archived and will soon be removed. Come and see what we're up to at the new [PowerApps](https://powerapps.microsoft.com). 


<!--Archived
Microsoft PowerApps Enterprise is a new Microsoft Azure service. PowerApps Enterprise extends creating mobile apps to business users within your company and allows IT Admins to tightly manage these apps.

Using an Office-style interface with ribbons and Excel formulas, business users can create apps that:

- Show data using line, pie, and bar charts, just like you can in Excel.
- Create user interfaces that include buttons, inserting text, and formatting a date.
- Add multiple-choice controls including list boxes, drop-down lists, and radio buttons.
- Upload images, take a picture, and play audio/video files.
- Use 'backend' systems like Excel and SQL Server to display and update information.
- Add pre-built App Service connectors to your apps that connect to PaaS programs like Twitter and SharePoint.

IT Admins can manage apps created by business users in their company, including:

- Manage these apps and manage user access to these apps.
- Create APIs and connections to different data sources.
- Manage user access for APIs and connections to these data sources.

## How do I get started?

First of all, determine if you need to create a new Azure Active Directory (Azure AD) tenant. If you already have an AD tenant, then simply enable PowerApps Enterprise in the Azure portal, add your APIs and connections, and start managing (start at *Step 2* in this topic).

If you don't have an AD tenant, then create a new AD tenant, enable PowerApps Enterprise in the Azure portal, add your APIs and connections, and start managing.

This topic lists the specifics.

## Step 1: Create a new or use an existing Azure AD tenant

To get started with PowerApps Enterprise, you need an Azure Active Directory (Azure AD) tenant. A tenant is a dedicated instance of the Azure AD service.

When your organization or company signs up for a Microsoft Azure cloud service such as Microsoft Intune or Office 365, your organization automatically receives and owns an AD tenant. Each AD tenant is distinct and separated from other Azure AD tenants.

Use the following steps to determine if you already have a tenant or how to create a new one.

#### Have an existing Office 365 subscription
If you have an existing Office 365 subscription (or Microsoft Dynamic CRM Online, Enterprise Mobility Suite, or other Microsoft services), you have a free subscription to Azure Active Directory. You can use Azure AD to create and manage user and group accounts. If you can’t sign into the Azure portal, chances are you need to activate the subscription. To do so, go to the [Azure classic portal](https://manage.windowsazure.com/), and complete a one time registration process. Use these [steps](https://technet.microsoft.com/library/dn832618.aspx) to gain access to your Azure AD tenant.

#### Have an existing Azure subscription associated with a Microsoft account
If you have previously signed up for an Azure subscription with your individual Microsoft Account (hotmail or live), you already have a tenant! In the [Azure classic portal](https://manage.windowsazure.com/), **Default Tenant** is listed under **All Items** and under **Active Directory**. You are free to use this tenant as you see fit - but you may want to create an Organizational administrator account.

To do so, use the following steps. Alternatively, you may wish to create a new tenant and create an administrator in that tenant following a similar process.

1.	Sign in to the [Azure classic portal](https://manage.windowsazure.com/) with your individual account.
2.	Select **Active Directory**” in the left menu bar.
3.	Select **Default Directory** in the list of available directories.
4.	Select the **Users** tab at the top. There is a single user listed with “Microsoft account” in the Sourced From column.
5.	Select **Add User** at the bottom.
6.	In **Add User Form**, enter the following details:  

	Property | Description
--- | ---
Type of User | New user in your organization
User name | Choose a user name for this administrator
First Name/Last Name/Display Name | Enter your values
Role | Global Administrator
Alternate Email Address | Enter your value
Optional | Enable Multi-Factor Authentication  

	Select the **CREATE** button to complete and to display the temporary password.

When finished, record this temporary password for the new administrative user. To change the temporary password, sign in to [https://login.microsoftonline.com](https://login.microsoftonline.com) with this new user account and change the password. You can also send the password directly to the user, using an alternative e-mail.


#### Have an existing Azure subscription associated with an organization account
If you have previously signed up for an Azure subscription with your organizational account, then you already have a tenant. In the [Azure classic portal](https://manage.windowsazure.com/), the tenant is listed under **All Items** and also under **Active Directory**. You are free to use this tenant as you see fit. You can also create a new tenant using the **New** menu in the task bar at the bottom.

#### Have none of the above and want to start from scratch
If none of the above applies to you, then go to the [https://account.windowsazure.com/organization](https://account.windowsazure.com/organization) to sign up for Azure with a new organization. Once signed up, you have your own Azure AD tenant with your chosen domain name. In the [Azure classic portal](https://manage.windowsazure.com/), you can see tenant in **Active Directory** in the left menu.

## Step 2: Create new or use existing Azure subscription
Now that you have your AD tenant, you can create a new or use an existing Azure subscription. The Azure AD subscription includes several editions. For PowerApps Enterprise, you can use the Free edition. However, if you need to use AAD Proxy to create hybrid connectivity to on-premises data, you need the Basic or Premium edition.

[Azure Active Directory editions](../active-directory/active-directory-editions.md) lists more features.


## Step 3: Sign up for PowerApps Enterprise in your Azure work subscription
> [AZURE.NOTE] The following steps require the subscription Administrator to sign-in to the Azure portal and submit a request.

Now that you have your AD tenant and an Azure subscription, your work subscription administrators can sign up for PowerApps enterprise. The Admin can also add users within your company to 'administer' PowerApps, including giving users permissions, and manage the PowerApps published to your Azure subscription.

Without signing up for PowerApps enterprise, you will see a no access blade when you go to [Azure portal](https://portal.azure.com/) and browse for PowerApps.  To sign-up your company, the **subscription administrator** can go to [PowerApps](http://go.microsoft.com/fwlink/p/?LinkId=716848) to contact us to learn more about pricing and the sign up process.

![][4]  

Once you finish the sign up process and ready to use PowerApps Enterprise, you can:

- Add users within your company and using [role-based access control](../active-directory/role-based-access-control-configure.md), give these users PowerApps Admin roles to access the PowerApps Enterprise portal.
- Create a dedicated app service environment to host your PowerApps.
- Create APIs and connections to run within your dedicated app service environment.
- In addition to apps created in PowerApps, you can add additional apps to your app service environment, including web apps, mobile apps, API apps, and logic apps.

In the following example, the Contoso company signed-up for PowerApps. In this new **PowerApps** blade, you can see a summary of the different type of apps created using this app service environment. In **Manage APIs**, you can see a summary of the Microsoft-created APIs (Microsoft managed) and see the Contoso-created APIs (IT managed):  

![Sample company PowerApps blade][3]  


## Step 4: Create an app service environment
Create an app service environment to host your PowerApps APIs and connections, as well as mobile apps, web apps, API apps, and logic apps.

An app service environment is an isolated and dedicated environment that securely runs all of your apps. Compute resources are per app service environment and are exclusively dedicated to running only your apps. When you sign-up for PowerApps Enterprise, a dedicated app service environment is used to host the APIs and connections used by your apps. This app service environment is a "special" type of app service environment. Specifically:

- You can use this app service environment for whatever you want. It's tied to your company, not the subscription.
- You configure APIs and connections to be used by your apps created in PowerApps. But, you can also add web apps, mobile apps, logic apps, and API apps to this same app service environment.
- Billing is fixed and included with PowerApps Enterprise.  
- Scale is automatically managed for you. You don't have to monitor the environment to determine if additional compute resources are needed.

The regular Azure app service environment has different features. See [Introduction to App Service Environment](../app-service-web/app-service-app-service-environment-intro.md) for those details.

#### Requirements to get started

- Azure company subscription
- The Subscription Administrator within your company [signed up your company for PowerApps](powerapps-get-started-azure-portal.md) Enterprise.
- You are signed into the Azure portal as the PowerApps Administrator ("owner" of PowerApps) or the Subscription Administrator.

### Create an app service environment
> [AZURE.NOTE] If you do not see the option to create the app service environment, then it is already created for your tenant. To view the details, select **Settings** to open the app service environment.

1. In the [Azure portal](https://portal.azure.com/), sign-in with your work account. For example, sign-in with *yourUserName*@*YourCompany*.com. When you do this, you are automatically signed in to your company subscription.

2. Select **Browse** in the task bar:  
![Browse for PowerApps][1]

3. In the list, you can scroll to find PowerApps or type in *powerapps*:  
![Search for PowerApps][2]  

4. In the **PowerApps** blade, select **Create App Service Environment to get started** or select **App Service Environment** under *Settings*:  
![][5]

	> [AZURE.NOTE] If you click on **Create App Service Environment to get started**, you will see one extra blade with details about the App Service Environment. Simply click Create link on that blade to launch the create blade.

5. Next, enter the name, select the subscription you want to use, select or create a new resource group, and select a virtual network. **Notice** that after you choose a virtual network, it cannot be changed:  
![][6]  
For more information how virtual networks work with an app service environment, see [How to Create an App Service Environment](../app-service-web/app-service-web-how-to-create-an-app-service-environment.md). 

6. Select **Add** to complete creating the app service environment.

> [AZURE.TIP] When creating the app service environment using PowerApps, you are not prompted to configure compute resource pools. This step is handled automatically.

Remember, you can also add web apps, mobile apps and API apps to this app service environment. In fact, it's your environment to add anything App Service Environment supports.

### Add Administrator(s) to manage the App Service Environment

To get access to the app service environment, create APIs, connections and other resources, users must be added with the Owner role.

1. Select the app service environment you just created.
2. In Essentials, select the **Resource group** property. This opens the resource group that contains the app service environment:  
![][7]
3. Select the RBAC icon to manage permissions:  
![][8]  
	Adding users and assigning roles is just like using [Role-based access control](https://azure.microsoft.com/documentation/articles/role-based-access-control-configure/) within Azure.

> [AZURE.NOTE] Currently, you cannot give RBAC permissions to the app service environment. You can give RBAC permissions at the parent resource group level.

## Summary and next steps
Your company is now signed up for PowerApps and has an app service environment. Next, you can add APIs and connections that can be used by your apps.

- [Monitor your PowerApps apps](powerapps-manage-monitor-usage.md)
- [Develop an API for PowerApps](powerapps-develop-api.md)
- [Add a new API, add a connection, and give users access](powerapps-manage-api-connection-user-access.md)
- [Update an existing API and its properties](powerapps-configure-apis.md)
-->


[1]: ./media/powerapps-get-started-azure-portal/browseall.png
[2]: ./media/powerapps-get-started-azure-portal/allresources.png
[3]: ./media/powerapps-get-started-azure-portal/powerappsblade.png
[4]: ./media/powerapps-get-started-azure-portal/noaccess.png
[5]: ./media/powerapps-get-started-azure-portal/createase.png
[6]: ./media/powerapps-get-started-azure-portal/aseproperties.png
[7]: ./media/powerapps-get-started-azure-portal/aseessentials.png
[8]: ./media/powerapps-get-started-azure-portal/resourcegrouprbac.png
