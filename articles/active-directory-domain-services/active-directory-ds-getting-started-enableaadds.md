<properties
	pageTitle="Azure Active Directory Domain Services preview: Getting Started | Microsoft Azure"
	description="Getting started with Azure Active Directory Domain Services"
	services="active-directory-ds"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="udayh"
	editor="femila"/>

<tags
	ms.service="active-directory-ds"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/05/2015"
	ms.author="mahesh-unnikrishnan"/>

# Azure AD Domain Services *(Preview)* - Getting started

## Step 3: Enable Azure AD Domain Services
In this step you can enable Azure AD Domain Services for your directory. Perform the following configuration steps in order to enable Azure AD Domain Services for your directory.

1. Navigate to the **Azure management portal** ([https://manage.windowsazure.com](https://manage.windowsazure.com)).
2. Select the **Active Directory** node on the left pane.
3. Select the Azure AD tenant (directory) for which you would like to enable Azure AD Domain Services.

    ![Select AAD Directory](./media/active-directory-domain-services-getting-started/select-aad-directory.png)

4. Click on the **Configure** tab.

    ![Configure tab of directory](./media/active-directory-domain-services-getting-started/configure-tab.png)

5. Scroll down to a section titled **domain services**.

    ![Domain Services configuration section](./media/active-directory-domain-services-getting-started/domain-services-configuration.png)

6. Toggle the option titled **Enable domain services for this directory** to **YES**. You will notice a few more configuration options for Azure AD Domain services appear on the page.

    ![Enable Domain Services](./media/active-directory-domain-services-getting-started/enable-domain-services.png)

7. Specify the **DNS domain name of domain services**.
   - The default domain name of the directory (i.e. ending with the **.onmicrosoft.com** domain suffix) will be selected by default.
   - The drop-down lists all domains that have been configured for your Azure AD directory – including verified as well as unverified domains that you configure in the ‘Domains’ tab.
   - Additionally, you can also specify a custom domain name in this editable drop-down by typing it in.

8. The next step is to select a virtual network in which you'd like Azure AD Domain Services to be available. Select the virtual network you just created in the drop-down titled **Connect domain services to this virtual network**.
9. When you are done selecting the above options, click ‘Save’ from the task pane at the bottom of the page to enable Azure AD Domain Services.
10. The page will display a ‘Pending …’ state, while Azure AD Domain Services is being enabled for your directory.

    ![Enable Domain Services - pending state](./media/active-directory-domain-services-getting-started/enable-domain-services-pendingstate.png)

    > [AZURE.NOTE] Azure AD Domain Services provides high availability in the form of two domain controllers to service your domain. When you first enable Azure AD Domain Services for your domain, you will notice the IP addresses of these domain controllers show up one by one, as they are provisioned. The second (replica) domain controller will take a while to be provisioned and therefore its IP address will be displayed later. When both domain controllers are provisioned and active for your domain, you should see two IP addresses in the **domain services** section of the **Configure** tab.

11. After about 20-30 minutes, the first domain controller for your domain should be provisioned. At this point, you will see the IP address of this domain controller appear in the **IP address** field on the **Configure** page.

    ![Domain Services enabled - first DC provisioned](./media/active-directory-domain-services-getting-started/domain-services-enabled-firstdc-available.png)

12. When both domain controllers for your domain are provisioned, you will see two IP addresses displayed on the page. These are the IP addresses at which managed domain controllers will be available on your selected virtual network. Note down these IP addresses so you can update the DNS settings for your virtual network. This step enables virtual machines on the virtual network to connect to the domain for operations such as domain join.

    ![Domain Services enabled - both domain controllers provisioned](./media/active-directory-domain-services-getting-started/domain-services-enabled-bothdcs-available.png)

  > [AZURE.NOTE] Depending on the size of your Azure AD directory (number of users, groups etc.), it will take a while for the contents of the directory to be synchronized to Azure AD Domain Services. This synchronization process happens in the background. For large directories with tens of thousands of objects, it may take a day or two for all users, group memberships and credentials to be synchronized and available in Azure AD Domain Services.
