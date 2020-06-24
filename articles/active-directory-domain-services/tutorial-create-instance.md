---
title: Tutorial - Create an Azure Active Directory Domain Services managed domain | Microsoft Docs
description: In this tutorial, you learn how to create and configure an Azure Active Directory Domain Services managed domain using the Azure portal.
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: tutorial
ms.date: 03/30/2020
ms.author: iainfou

#Customer intent: As an identity administrator, I want to create an Azure Active Directory Domain Services managed domain so that I can synchronize identity information with my Azure Active Directory tenant and provide Domain Services connectivity to virtual machines and applications in Azure.
---

# Tutorial: Create and configure an Azure Active Directory Domain Services managed domain

Azure Active Directory Domain Services (Azure AD DS) provides managed domain services such as domain join, group policy, LDAP, Kerberos/NTLM authentication that is fully compatible with Windows Server Active Directory. You consume these domain services without deploying, managing, and patching domain controllers yourself. Azure AD DS integrates with your existing Azure AD tenant. This integration lets users sign in using their corporate credentials, and you can use existing groups and user accounts to secure access to resources.

You can create a managed domain using default configuration options for networking and synchronization, or [manually define these settings][tutorial-create-instance-advanced]. This tutorial shows you how to use default options to create and configure an Azure AD DS managed domain using the Azure portal.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Understand DNS requirements for a managed domain
> * Create a managed domain
> * Enable password hash synchronization

If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this tutorial, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* You need *global administrator* privileges in your Azure AD tenant to enable Azure AD DS.
* You need *Contributor* privileges in your Azure subscription to create the required Azure AD DS resources.

Although not required for Azure AD DS, it's recommended to [configure self-service password reset (SSPR)][configure-sspr] for the Azure AD tenant. Users can change their password without SSPR, but SSPR helps if they forget their password and need to reset it.

> [!IMPORTANT]
> After you create a managed domain, you can't then move the managed domain to a different resource group, virtual network, subscription, etc. Take care to select the most appropriate subscription, resource group, region, and virtual network when you deploy the managed domain.

## Sign in to the Azure portal

In this tutorial, you create and configure the managed domain using the Azure portal. To get started, first sign in to the [Azure portal](https://portal.azure.com).

## Create a managed domain

To launch the **Enable Azure AD Domain Services** wizard, complete the following steps:

1. On the Azure portal menu or from the **Home** page, select **Create a resource**.
1. Enter *Domain Services* into the search bar, then choose *Azure AD Domain Services* from the search suggestions.
1. On the Azure AD Domain Services page, select **Create**. The **Enable Azure AD Domain Services** wizard is launched.
1. Select the Azure **Subscription** in which you would like to create the managed domain.
1. Select the **Resource group** to which the managed domain should belong. Choose to **Create new** or select an existing resource group.

When you create a managed domain, you specify a DNS name. There are some considerations when you choose this DNS name:

* **Built-in domain name:** By default, the built-in domain name of the directory is used (a *.onmicrosoft.com* suffix). If you wish to enable secure LDAP access to the managed domain over the internet, you can't create a digital certificate to secure the connection with this default domain. Microsoft owns the *.onmicrosoft.com* domain, so a Certificate Authority (CA) won't issue a certificate.
* **Custom domain names:** The most common approach is to specify a custom domain name, typically one that you already own and is routable. When you use a routable, custom domain, traffic can correctly flow as needed to support your applications.
* **Non-routable domain suffixes:** We generally recommend that you avoid a non-routable domain name suffix, such as *contoso.local*. The *.local* suffix isn't routable and can cause issues with DNS resolution.

> [!TIP]
> If you create a custom domain name, take care with existing DNS namespaces. It's recommended to use a domain name separate from any existing Azure or on-premises DNS name space.
>
> For example, if you have an existing DNS name space of *contoso.com*, create a managed domain with the custom domain name of *aaddscontoso.com*. If you need to use secure LDAP, you must register and own this custom domain name to generate the required certificates.
>
> You may need to create some additional DNS records for other services in your environment, or conditional DNS forwarders between existing DNS name spaces in your environment. For example, if you run a webserver that hosts a site using the root DNS name, there can be naming conflicts that require additional DNS entries.
>
> In these tutorials and how-to articles, the custom domain of *aaddscontoso.com* is used as a short example. In all commands, specify your own domain name.

The following DNS name restrictions also apply:

* **Domain prefix restrictions:** You can't create a managed domain with a prefix longer than 15 characters. The prefix of your specified domain name (such as *aaddscontoso* in the *aaddscontoso.com* domain name) must contain 15 or fewer characters.
* **Network name conflicts:** The DNS domain name for your managed domain shouldn't already exist in the virtual network. Specifically, check for the following scenarios that would lead to a name conflict:
    * If you already have an Active Directory domain with the same DNS domain name on the Azure virtual network.
    * If the virtual network where you plan to enable the managed domain has a VPN connection with your on-premises network. In this scenario, ensure you don't have a domain with the same DNS domain name on your on-premises network.
    * If you have an existing Azure cloud service with that name on the Azure virtual network.

Complete the fields in the *Basics* window of the Azure portal to create a managed domain:

1. Enter a **DNS domain name** for your managed domain, taking into consideration the previous points.
1. Choose the Azure **Location** in which the managed domain should be created. If you choose a region that supports Availability Zones, the Azure AD DS resources are distributed across zones for additional redundancy.

    Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there's a minimum of three separate zones in all enabled regions.

    There's nothing for you to configure for Azure AD DS to be distributed across zones. The Azure platform automatically handles the zone distribution of resources. For more information and to see region availability, see [What are Availability Zones in Azure?][availability-zones]

1. The **SKU** determines the performance, backup frequency, and maximum number of forest trusts you can create. You can change the SKU after the managed domain has been created if your business demands or requirements change. For more information, see [Azure AD DS SKU concepts][concepts-sku].

    For this tutorial, select the *Standard* SKU.
1. A *forest* is a logical construct used by Active Directory Domain Services to group one or more domains. By default, a managed domain is created as a *User* forest. This type of forest synchronizes all objects from Azure AD, including any user accounts created in an on-premises AD DS environment. A *Resource* forest only synchronizes users and groups created directly in Azure AD. Resource forests are currently in preview. For more information on *Resource* forests, including why you may use one and how to create forest trusts with on-premises AD DS domains, see [Azure AD DS resource forests overview][resource-forests].

    For this tutorial, choose to create a *User* forest.

    ![Configure basic settings for an Azure AD Domain Services managed domain](./media/tutorial-create-instance/basics-window.png)

To quickly create a managed domain, you can select **Review + create** to accept additional default configuration options. The following defaults are configured when you choose this create option:

* Creates a virtual network named *aadds-vnet* that uses the IP address range of *10.0.2.0/24*.
* Creates a subnet named *aadds-subnet* using the IP address range of *10.0.2.0/24*.
* Synchronizes *All* users from Azure AD into the managed domain.

Select **Review + create** to accept these default configuration options.

## Deploy the managed domain

On the **Summary** page of the wizard, review the configuration settings for the managed domain. You can go back to any step of the wizard to make changes. To redeploy a managed domain to a different Azure AD tenant in a consistent way using these configuration options, you can also **Download a template for automation**.

1. To create the managed domain, select **Create**. A note is displayed that certain configuration options such as DNS name or virtual network can't be changed once the Azure AD DS managed has been created. To continue, select **OK**.
1. The process of provisioning your managed domain can take up to an hour. A notification is displayed in the portal that shows the progress of your Azure AD DS deployment. Select the notification to see detailed progress for the deployment.

    ![Notification in the Azure portal of the deployment in progress](./media/tutorial-create-instance/deployment-in-progress.png)

1. The page will load with updates on the deployment process, including the creation of new resources in your directory.
1. Select your resource group, such as *myResourceGroup*, then choose your managed domain from the list of Azure resources, such as *aaddscontoso.com*. The **Overview** tab shows that the managed domain is currently *Deploying*. You can't configure the managed domain until it's fully provisioned.

    ![Domain Services status during the provisioning state](./media/tutorial-create-instance/provisioning-in-progress.png)

1. When the managed domain is fully provisioned, the **Overview** tab shows the domain status as *Running*.

    ![Domain Services status once successfully provisioned](./media/tutorial-create-instance/successfully-provisioned.png)

The managed domain is associated with your Azure AD tenant. During the provisioning process, Azure AD DS creates two Enterprise Applications named *Domain Controller Services* and *AzureActiveDirectoryDomainControllerServices* in the Azure AD tenant. These Enterprise Applications are needed to service your managed domain. Don't delete these applications.

## Update DNS settings for the Azure virtual network

With Azure AD DS successfully deployed, now configure the virtual network to allow other connected VMs and applications to use the managed domain. To provide this connectivity, update the DNS server settings for your virtual network to point to the two IP addresses where Azure AD DS is deployed.

1. The **Overview** tab for your managed domain shows some **Required configuration steps**. The first configuration step is to update DNS server settings for your virtual network. Once the DNS settings are correctly configured, this step is no longer shown.

    The addresses listed are the domain controllers for use in the virtual network. In this example, those addresses are *10.0.2.4* and *10.0.2.5*. You can later find these IP addresses on the **Properties** tab.

    ![Configure DNS settings for your virtual network with the Azure AD Domain Services IP addresses](./media/tutorial-create-instance/configure-dns.png)

1. To update the DNS server settings for the virtual network, select the **Configure** button. The DNS settings are automatically configured for your virtual network.

> [!TIP]
> If you selected an existing virtual network in the previous steps, any VMs connected to the network only get the new DNS settings after a restart. You can restart VMs using the Azure portal, Azure PowerShell, or the Azure CLI.

## Enable user accounts for Azure AD DS

To authenticate users on the managed domain, Azure AD DS needs password hashes in a format that's suitable for NT LAN Manager (NTLM) and Kerberos authentication. Azure AD doesn't generate or store password hashes in the format that's required for NTLM or Kerberos authentication until you enable Azure AD DS for your tenant. For security reasons, Azure AD also doesn't store any password credentials in clear-text form. Therefore, Azure AD can't automatically generate these NTLM or Kerberos password hashes based on users' existing credentials.

> [!NOTE]
> Once appropriately configured, the usable password hashes are stored in the managed domain. If you delete the managed domain, any password hashes stored at that point are also deleted. Synchronized credential information in Azure AD can't be re-used if you later create a managed domain - you must reconfigure the password hash synchronization to store the password hashes again. Previously domain-joined VMs or users won't be able to immediately authenticate - Azure AD needs to generate and store the password hashes in the new managed domain. For more information, see [Password hash sync process for Azure AD DS and Azure AD Connect][password-hash-sync-process].

The steps to generate and store these password hashes are different for cloud-only user accounts created in Azure AD versus user accounts that are synchronized from your on-premises directory using Azure AD Connect. A cloud-only user account is an account that was created in your Azure AD directory using either the Azure portal or Azure AD PowerShell cmdlets. These user accounts aren't synchronized from an on-premises directory. In this tutorial, let's work with a basic cloud-only user account. For more information on the additional steps required to use Azure AD Connect, see [Synchronize password hashes for user accounts synced from your on-premises AD to your managed domain][on-prem-sync].

> [!TIP]
> If your Azure AD tenant has a combination of cloud-only users and users from your on-premises AD, you need to complete both sets of steps.

For cloud-only user accounts, users must change their passwords before they can use Azure AD DS. This password change process causes the password hashes for Kerberos and NTLM authentication to be generated and stored in Azure AD. The account isn't synchronized from Azure AD to Azure AD DS until the password is changed. Either expire the passwords for all cloud users in the tenant who need to use Azure AD DS, which forces a password change on next sign-in, or instruct cloud users to manually change their passwords. For this tutorial, let's manually change a user password.

Before a user can reset their password, the Azure AD tenant must be [configured for self-service password reset][configure-sspr].

To change the password for a cloud-only user, the user must complete the following steps:

1. Go to the Azure AD Access Panel page at [https://myapps.microsoft.com](https://myapps.microsoft.com).
1. In the top-right corner, select your name, then choose **Profile** from the drop-down menu.

    ![Select profile](./media/tutorial-create-instance/select-profile.png)

1. On the **Profile** page, select **Change password**.
1. On the **Change password** page, enter your existing (old) password, then enter and confirm a new password.
1. Select **Submit**.

It takes a few minutes after you've changed your password for the new password to be usable in Azure AD DS and to successfully sign in to computers joined to the managed domain.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Understand DNS requirements for a managed domain
> * Create a managed domain
> * Add administrative users to domain management
> * Enable user accounts for Azure AD DS and generate password hashes

Before you domain-join VMs and deploy applications that use the managed domain, configure an Azure virtual network for application workloads.

> [!div class="nextstepaction"]
> [Configure Azure virtual network for application workloads to use your managed domain](tutorial-configure-networking.md)

<!-- INTERNAL LINKS -->
[tutorial-create-instance-advanced]: tutorial-create-instance-advanced.md
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[network-considerations]: network-considerations.md
[create-dedicated-subnet]: ../virtual-network/virtual-network-manage-subnet.md#add-a-subnet
[scoped-sync]: scoped-synchronization.md
[on-prem-sync]: tutorial-configure-password-hash-sync.md
[configure-sspr]: ../active-directory/authentication/quickstart-sspr.md
[password-hash-sync-process]: ../active-directory/hybrid/how-to-connect-password-hash-synchronization.md#password-hash-sync-process-for-azure-ad-domain-services
[tutorial-create-instance-advanced]: tutorial-create-instance-advanced.md
[skus]: overview.md
[resource-forests]: concepts-resource-forest.md
[availability-zones]: ../availability-zones/az-overview.md
[concepts-sku]: administration-concepts.md#azure-ad-ds-skus

<!-- EXTERNAL LINKS -->
[naming-prefix]: /windows-server/identity/ad-ds/plan/selecting-the-forest-root-domain#selecting-a-prefix
