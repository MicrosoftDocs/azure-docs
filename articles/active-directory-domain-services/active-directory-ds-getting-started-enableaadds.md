---
title: 'Azure Active Directory Domain Services: Enable Azure Active Directory Domain Services | Microsoft Docs'
description: Getting started with Azure Active Directory Domain Services
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: stevenpo
editor: curtand

ms.assetid: c659da59-f4b5-4edd-b702-1727a8ccb36f
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/06/2017
ms.author: maheshu

---
# Enable Azure Active Directory Domain Services
## Task 3: Enable Azure Active Directory Domain Services
In this task, you enable Azure Active Directory Domain Services (Azure AD DS) for your directory by doing the following:

1. Go to the [Azure classic portal](https://manage.windowsazure.com).
2. In the left pane, select the **Active Directory** button.
3. Select the Azure Active Directory (Azure AD) tenant (directory) for which you want to enable Azure AD DS.

    ![Select Azure AD Directory](./media/active-directory-domain-services-getting-started/select-aad-directory.png)
4. On the **preview directory** page, click the **Configure** tab.

    ![Configure tab of directory](./media/active-directory-domain-services-getting-started/configure-tab.png)
5. Under **domain services**, change the **Enable domain services for this directory** option to **Yes**.  
    Additional Azure Active Directory Domain Services configuration options appear on the page.

    ![Enable Domain Services](./media/active-directory-domain-services-getting-started/enable-domain-services.png)

   > [!NOTE]
   > When you enable Azure Active Directory Domain Services for your tenant, Azure AD generates and stores the Kerberos and NTLM credential hashes that are required for authenticating users.
   >
   >
6. Specify the **DNS domain name of domain services**.

   * The default domain name of the directory (with a **.onmicrosoft.com** suffix) is selected by default.

   * The list contains all domains that have been configured for your Azure AD directory, including both verified and unverified domains that you configure on the **Domains** tab.

   * You can also enter a custom domain name. In this example, the custom domain name is *contoso100.com*.

     > [!WARNING]
     > The prefix of your specified domain name (for example, *contoso100* in the *contoso100.com* domain name) must contain 15 or fewer characters. You cannot create an Azure Active Directory Domain Services domain with a prefix containing more than 15 characters.
     >
     >
7. Ensure that the DNS domain name you have chosen for the managed domain does not already exist in the virtual network. Specifically, check to see whether:

   * You already have a domain with the same DNS domain name on the virtual network.

   * The virtual network you've selected has a VPN connection with your on-premises network, and you have a domain with the same DNS domain name on your on-premises network.

   * You have an existing cloud service with that name on the virtual network.
8. Select a virtual network on which you want Azure Active Directory Domain Services to be available. Select the virtual network and dedicated subnet you created in the **Connect domain services to this virtual network** drop-down list. Also consider the following:

   * Ensure that the virtual network that you have specified belongs to an Azure region that's supported by Azure Active Directory Domain Services. To ascertain the Azure regions where Azure Active Directory Domain Services is available, see [Azure services by region](https://azure.microsoft.com/regions/#services/).

   * Virtual networks that belong to a region where Azure Active Directory Domain Services is not supported do not show up in the drop-down list.

   * Use a dedicated subnet within the virtual network for Azure Active Directory Domain Services. Do *not* select the gateway subnet. See [networking considerations](active-directory-ds-networking.md).

   * Similarly, virtual networks that were created by using Azure Resource Manager do not appear in the drop-down list. Resource Manager-based virtual networks are not currently supported by Azure Active Directory Domain Services.
9. To enable Azure Active Directory Domain Services, in the task pane at the bottom of the page, click **Save**. 
    * While Azure Active Directory Domain Services is being enabled for your directory, the page displays a status of *Pending*.

        ![Enable Domain Services window](./media/active-directory-domain-services-getting-started/enable-domain-services-pendingstate.png)

        > [!NOTE]
        > Azure Active Directory Domain Services provides high availability for your managed domain. After you enable Azure Active Directory Domain Services, note that the IP addresses at which domain services are available on the virtual network are displayed one at a time. The second IP address is displayed shortly after the first, as soon the service enables high availability for your domain. When high availability is configured and active for your domain, you should see two IP addresses in the **domain services** section of the **Configure** tab.
        >
        >
    * After about 20 to 30 minutes, the first IP address at which domain services are available on your virtual network in the **IP address** field on the **Configure** page.

        ![Domain Services window displaying first provisioned IP](./media/active-directory-domain-services-getting-started/domain-services-enabled-firstdc-available.png)
    * When high availability is operational for your domain, two IP addresses are displayed on the page. Your managed domain is available on your selected virtual network at these two IP addresses. 
    
10. Note the two IP addresses so that you can update the DNS settings for your virtual network. Doing so enables virtual machines on the virtual network to connect to the domain for operations such as domain join.

    ![Domain Services window showing both provisioned IPs](./media/active-directory-domain-services-getting-started/domain-services-enabled-bothdcs-available.png)

> [!NOTE]
> Depending on the size of your Azure AD tenant (for example, the number of users or groups), synchronization to your managed domain takes a while. This synchronization process happens in the background. For large tenants with tens of thousands of objects, it might take a day or two for all users, group memberships, and credentials to be synchronized.
>
>

## Next steps
Task 4: [Update the DNS settings for the Azure virtual network](active-directory-ds-getting-started-dns.md)
