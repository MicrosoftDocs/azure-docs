<properties
	pageTitle="What is PowerApps Enterprise and how to get started | Microsoft Azure"
	description=""
	services="powerapps"
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="" 
   ms.date="11/05/2015"
   ms.author="litran"/>

# What is PowerApps Enterprise?

PowerApps Enterprise is a Microsoft Azure offering that extends not only creating mobile apps to business users within your company but allows IT Admins to tightly manage them. 

Using an Office-style interface including ribbons and Excel formulas, business users can create apps that:

- Show data using line, pie, and bar charts, just like you can in Excel.
- Create user interfaces that includes buttons, inserting text, and formatting a date.
- Add multiple-choice controls including list boxes, drop-down lists, and radio buttons.
- Upload images, take a picture, and play audio/video files.
- Use 'backend' systems like Excel and SQL Server to display and update information.
- Add pre-built App Service connectors to your apps that connect to PaaS programs like Twitter and SharePoint.

IT Admins can manage apps created by business users in their company:

- Manage apps created within their company and user access to these apps.
- Create APIs and connections to different data sources. 
- Manage user access for APIs and connections to data sources. 

## How do I get started?

Determine if you need to create a new Azure Active Directory (Azure AD) tenant, enable PowerApps Enterprise in the Azure portal, add your APIs and connections, and start managing!

Here are the specifics. 

### Step 1: Create new or use existing Azure AD tenant

To get started with PowerApps Enterprise you will need an Azure Active Directory (Azure AD) tenant. A tenant is a dedicated instance of the Azure AD service that an organization receives and owns when it signs up for a Microsoft cloud service such as Azure, Microsoft Intune, or Office 365. Each AD tenant is distinct and separated from other Azure AD tenants. Follow the steps below to determine if you already have a tenant or how to create a new one.

##### Have an existing Office 365 subscription
If you have an existing Office 365 subscription (or Microsoft Dynamic CRM Online, Enterprise Mobility Suite, or other Microsoft services), you have a free subscription to Azure Active Directory. You can use Azure AD to create and manage user and group accounts. If you can’t sign into the Azure Management Portal, chances are you need to active the subscription. To do so and access the [Azure management portal](https://manage.windowsazure.com/), you have to complete a onetime registration process.  Please follow [these instructions](https://technet.microsoft.com/library/dn832618.aspx) to gain access to your Azure AD tenant. 

##### Have an existing Azure subscription associated with a Microsoft account
If you have previously signed up for an Azure subscription with your individual Microsoft Account, you already have a tenant! In the [Azure management portal](https://manage.windowsazure.com/), you should find a tenant named "Default Tenant" listed under "All Items" and "Active Directory." You are free to use this tenant as you see fit - but you may want to create an Organizational administrator account.

To do so, follow these steps. Alternatively, you may wish to create a new tenant and create an administrator in that tenant following a similar process.

1.	Log into the [Azure management portal](https://manage.windowsazure.com/) with your individual account
2.	Navigate to the “Active Directory” section of the portal (found in the left nav bar)
3.	Select the “Default Directory” entry in the list of available directories
4.	Click on the Users link at the top of the page. You will see a single user in the list with value “Microsoft account” in the Sourced From column
5.	Click “Add User” at the bottom of the page
6.	In the Add User Form provide the following details: 
	- Type of User: New user in your organization
	- User name: (choose a user name for this administrator
	- First Name/Last Name/Display Name: (choose appropriate values)
	- Role: Global Administrator
	- Alternate Email Address: (enter appropriate values)
	- Optional: Enable Multi-Factor Authentication
	- Lastly, click on the green “CREATE” button to finalize user creation (and display the temporary password).
7.	When you have completed the Add User Form, and receive the temporary password for the new administrative user, be sure to record this password as you will need to login with this new user in order to change the password. You can also send the password directly to the user, using an alternative e-mail.
8.	To change the temporary password, log into https://login.microsoftonline.com with this new user account and change the password when requested.


##### Have an existing Azure subscription associated with an organization account
If you have previously signed up for an Azure subscription with your organizational account, you already have a tenant! In the [Azure management portal](https://manage.windowsazure.com/), you should find a tenant listed under "All Items" and "Active Directory." You are free to use this tenant as you see fit. You may also wish to create a new tenant using the "New" button in the bottom left hand corner of the portal.

##### Have none of the above and want to start from scratch
If none of the above applies to you, simply visit https://account.windowsazure.com/organization to sign up for Azure with a new organization. Once you have completed the process, you will have your very own Azure AD tenant with the domain name you chose during sign up. In the [Azure management portal](https://manage.windowsazure.com/), you can find your tenant by navigating to ‘Active Directory’ in the left hand nav.

#### Create new or use existing Azure subscription
Now that you identify your tenant, you can create new or use existing Azure subscription you already have. There are three editions Free, Basic and Premium for Azure AD subscription. For PowerApps Enterprise, you can use the Free edition. However, if you need to use AAD Proxy to create a hybrid connectivity to on premise data, you will need either Basic or Premium edition. 

To know more about that features come with each type of edition, please read the [details](https://azure.microsoft.com/en-us/documentation/articles/active-directory-editions/) here. 


### Step 2: Sign up for PowerApps Enterprise in your Azure work subscription
> [AZURE.NOTE] The following steps require the subscription Administrator to sign-in to the Azure portal and submit a request. 

Now that you identify your tenant and have an Azure subscription, subscription administrators of your Azure work subscription can sign up for PowerApps Enterprise. The Admin can also add users within your company to 'administer' PowerApps, including giving users permissions, and manage the apps published to your Azure subscription. 

To sign-up your company, the **subscription administrator** submits a request for *@yourCompany.com* email accounts. Use the following steps to sign-up:

1. In the Azure portal, sign-in to your work subscription.
2. Select **Browse All** in the task bar:  
![Browse for PowerApps][1]  
3. In the list, you can scroll to find PowerApps. You can also select **Resources**, and type in *powerapps*:
![Search for PowerApps in Resources][2]  
4. Next, select **Get an invitation**:  
![Get an invitation][3]  

An email opens that is sent to the PowerApps group. After you submit your request, the PowerApps team reviews the information you provided. There is no ETA on approval and each scenario is considered on a case-by-case basis. Until your request is reviewed, an **Access denied** message may display in PowerApps in the Azure portal.


If the request is approved, you can then: 

- Add users within your company and using [role-based access control](../role-based-access-control-configure.md), give these users PowerApps Admin roles to access the PowerApps Enterprise management portal.
- Create APIs and connections to run within your dedicated App Service environment (ASE).
- View performance metrics for your App Service environment.
- In addition to PowerApps apps, you can add additional apps to your app service environment, including web apps, mobile apps, and logic apps.

In the following example, the Contoso company signed-up for PowerApps. In this new **PowerApps** blade, you can see a summary of the different type of apps created using this app service environment. In **Registered APIs**, you can see a summary of the Microsoft-created APIs (Microsoft managed) and see the Contoso-created APIs (IT managed):  

![Sample company PowerApps blade][4]  

In **All apps**, you can select the different app types to see all those apps. For example, you can select **Logic apps** and see all those apps listed, including *Twitter daily* and *Link forms*. You can also see all the APIs used by your logic apps, including Bing, Facebook, Twitter, and more:  
![][6]  

#### Users who have no access
For users who are not a subscription administrator or have been assigned a PowerApps administrator role, they will not be able to view the PowerApps Enterprise blade. Instead they will see a *No Access* blade. 

![No Access PowerApps blade][5]  

## Next steps 
Now that you're company is signed up for PowerApps, [create an app service environment](powerapps-create-new-ase.md) before you can add APIs and connections that can be used by PowerApps or other kinds of apps. 

[Create an app service environment](powerapps-create-new-app-service-environment.md)  
[Add APIs and connections](powerapps-create-new-connector.md)  
[Monitor your PowerApps apps](powerapps-manage-monitor-usage.md)


[1]: ./media/powerapps-get-started-azure-portal/browseall.png
[2]: ./media/powerapps-get-started-azure-portal/allresources.png
[3]: ./media/powerapps-get-started-azure-portal/signup.png
[4]: ./media/powerapps-get-started-azure-portal/powerappsblade.png
[5]: ./media/powerapps-get-started-azure-portal/noaccess.png
[6]: ./media/powerapps-get-started-azure-portal/alllogicapps.png

