---
title: Create a forest trust in Azure AD Domain Services | Microsoft Docs
description: Learn how to create an outbound forest to an on-premises AD DS domain in the Azure portal for Azure AD Domain Services
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 11/15/2019
ms.author: iainfou
---

# Create an outbound forest trust to an on-premises domain in Azure Active Directory Domain Services

For more information, see [What are resource forests?][concepts-forest] and [How do forest trusts work in Azure AD DS?][concepts-trust]

## Prerequisites

To complete this tutorial, you need the following resources and privileges:

* An active Azure subscription.
    * If you don’t have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain created using a resource forest and configured in your Azure AD tenant.
    * If needed, [create and configure an Azure Active Directory Domain Services instance][create-azure-ad-ds-instance-advanced].

## Networking considerations

The virtual network that hosts the Azure AD DS resource forest needs network connectivity to your on-premises Active Directory. Applications and services also need network connectivity to the virtual network hosting the Azure AD DS resource forest. Network connectivity to the Azure AD DS resource forest must be always on and stable otherwise users may fail to authenticate or access resources.

Before you configure a forest trust in Azure AD DS, make sure your networking between Azure and on-premises environment meets the following requirements:

* Use private IP addresses. Don't rely on DHCP with dynamic IP address assignment.
* Avoid overlapping IP address spaces to allow virtual network peering and routing to successfully communicate between Azure and on-premises.
* An Azure virtual network needs a gateway subnet to configure a site-to-site (S2S) VPN or ExpressRoute connection
* Create subnets with enough IP addresses to support your scenario.
* Make sure Azure AD DS has its own subnet, don't share this virtual network subnet with application VMs and services.
* Peered virtual networks are NOT transitive.
    * Azure virtual network peerings must created between all virtual networks you want to use the Azure AD DS resource forest trust to the on-premises AD DS environment.
* Provide continuous network connectivity to your on-premises Active Directory forest. Don't use on-demand connections.
* Make sure there's continuous name resolution (DNS) between your Azure AD DS resource forest name and your on-premises Active Directory forest name.

## Configure DNS in the on-premises domain

To correctly resolve the Azure AD DS managed domain from the on-premises environment, you may need to add forwarders to the existing DNS servers. If you haven't configure the on-premises environment to communicate with the Azure AD DS managed domain, complete the following steps from a management workstation for the on-premises AD DS domain:

1. Select **Start | Administrative Tools | DNS**
1. Right-select DNS server, such as *myAD01*, select **Properties**
1. Choose **Forwarders**, then **Edit** to add additional forwarders.
1. Add the IP addresses of the Azure AD DS managed domain, such as *10.0.1.4* and *10.0.1.5*.

## Create inbound forest trust in the on-premises domain

The on-premises AD DS domain needs an incoming forest trust for the Azure AD DS managed domain. This trust must be manually created in the on-premises AD DS domain, it can't be created from the Azure portal.

To configure inbound trust on the on-premises AD DS domain, complete the following steps from a management workstation for the on-premises AD DS domain:

1. Select **Start | Administrative Tools | Active Directory Domains and Trusts**
1. Right-select domain, such as *onprem.contoso.com*, select **Properties**
1. Choose **Trusts** tab, then **New Trust**
1. Enter name on Azure AD DS domain name, such as *aadds.contoso.com*, then select **Next**
1. Select the option to create a **Forest trust**, then to create a **One way: incoming** trust.
1. Choose to create the trust for **This domain only**. In the next step, you create the trust in the Azure portal for the Azure AD DS managed domain.
1. Choose to use **Forest-wide authentication**, then enter and confirm a trust password. This same password is also entered in the Azure portal in the next section.
1. Step through the next few windows with default options, then choose the option for **No, do not confirm the outgoing trust**.
1. Select **Finish**

## Create outbound forest trust in the Azure AD DS managed domain

With the on-premises AD DS domain configured to resolve the Azure AD DS managed domain and an inbound forest trust created, now created the outbound forest trust. This outbound forest trust completes the trust relationship between the on-premises AD DS domain and the Azure AD DS managed domain.

To create the outbound trust for the Azure AD DS managed domain in the Azure portal, complete the following steps:

1. In the Azure portal, search for and select **Azure AD Domain Services**, then select your managed domain, such as *aadds.contoso.com*
1. From the menu on the left-hand side of the Azure AD DS managed domain, select **Trusts**, then choose to **+ Add** a trust.
1. Enter a display name that identifies your trust, then the on-premises trusted forest DNS name, such as *onprem.contoso.com*
1. Provide the same trust password that was used when configuring the inbound forest trust for the on-premises AD DS domain in the previous section.
1. Provide at least two DNS servers for the on-premises AD DS domain, such as *10.0.2.4* and *10.0.2.5*
1. When ready, **Save** the outbound forest trust

    [Create outbound forest trust in the Azure portal](./media/create-forest-trust/portal-create-outbound-trust.png)

## Validate resource authentication

The following common scenarios let you validate that forest trust correctly authenticates users and access to resources:

* [On-premises user authentication from the Azure AD DS resource forest]()
* [Access resources in the Azure AD DS resource forest using on-premises user]()
    * [Enable file and printer sharing]()
    * [Create a security group and add members]()
    * [Create a file share for cross-forest access]()
    * [Validate cross-forest authentication to a resource]()

### On-premises user authentication from the Azure AD DS resource forest

You should have Windows Server virtual machine joined to the Azure AD DS resource domain. Use this virtual machine to test your on-premises user can authenticate on a virtual machine.

1. Connect to the Windows Server VM joined to the Azure AD DS resource forest using Remote Desktop and your Azure AD DS administrator credentials. If you get a Network Level Authentication (NLA) error, check the user account you used is not a domain user account.

    > [!NOTE]
    > To securely connect to your VMs joined to Azure AD Domain Services, you can use the [Azure Bastion Host Service](https://docs.microsoft.com/azure/bastion/bastion-overview) in supported Azure regions.

1. Open a Commannd prompt and use the `whoami` command to show the distinguished name of the currently authenticated user:

    ```console
    whoami /fqdn
    ```

1. Use the `runas` command to authenticate as a user from the on-premises domain. In the following command, replace `userUpn@trusteddomain.com` with the UPN of a user from the trusted on-premises domain. The command prompts you for the user’s password:

    ```console
    Runas /u:userUpn@trusteddomain.com cmd.exe
    ```

1. If the authentication is a successful, a new command prompt opens. The title of the new command prompt includes `running as userUpn@trusteddomain.com`.
1. Use `whoami /fqdn` in the new command prompt to view the distinguished name of the authenticated user from the on-premises Active Directory.

### Access resources in the Azure AD DS resource forest using on-premises user

Using the Windows Server VM joined to the Azure AD DS resource forest, you can test the scenario where users can access resources hosted in the resource forest when the authenticate from computers in the on-premises domain with users from the on-premises domain. The following examples show you how to create and test various common scenarios.

#### Enable file and printer sharing

1. Connect to the Windows Server virtual machine joined to the Azure AD DS resource forest using Remote Desktop and your Azure AD DS administrator credentials (If you get a Network Level Authentication (NLA) error, check the user account you used is not a domain user account.

    > [!NOTE]
    > Microsoft encourages using the [Azure Bastion Host Service](https://docs.microsoft.com/azure/bastion/bastion-overview) to securely connect to your virtual machines joined to Azure AD Domain Services.

2. Open **Windows Settings**. Search for **Network and Sharing Center**. Click the search result. Click **Change advanced sharing** settings. Under the **Domain Profile**, click **Turn on file and printer sharing** and then click **Save changes**. Close **Network and Sharing Center**.

#### Create a security group and add members

1. Open **Active Directory Users and Computers**. Right-click the domain name, select **New**, and click **Organizational Unit**. In the name box, type **LocalObjects**. Click **OK**.
2. Select and right-click **LocalObjects** in the navigation pane. Select **New** and then click **Group**. Type **FileServerAccess** in the **Group name** box. In **Group Scope**, select **Domain local**. Click **OK**.
3. In the content pane, double-click **FileServerAccess**. Click **Members**. Click **Add**. Click **Locations**. Select your on-premises Active Directory from the **Location** view. Click **OK**.
4. Type **Domain Users** in the Enter the object names to select. Click **Check Names**. Provide credentials for the on-premises Active Directory. Click **OK**.

    > [!NOTE]
    > You must provide credentials because the trust relationship is only one way. This means users from the Azure AD Domain Services cannot access resources or search for users or groups in the trusted (on-premises domain).

5. The **Domain Users** group from your on-premises Active Directory should be a member of the **FileServerAccess** group. Click **OK** to save the group and close the window.

#### Create a file share for cross-forest access

1. On the Windows Server virtual machine joined to the Azure AD DS resource forest, create a folder and provide it a name (example XForestShare).
2. Right-click the folder and then click **Properties**. Click the **Security** tab and then click **Edit**.
3. In the Permissions for \<Folder Name\> dialog box, click **Add**.
4. Type **FileServerAccess** in **Enter the object names to select**. Click **OK**.
5. Select **FileServerAccess** from the **Groups or user names** list. In the **Permissions for FileServerAccess** list. Select **Allow** for the **Modify** and **Write** permissions. Click **OK**.
6. Click the **Sharing** tab. Click **Advanced Sharing…** Select **Share this folder**. Type a memorable name for the file share in **Share name**.
7. Click **Permissions**. In the **Permissions for Everyone** list, select **Allow** for the **Change** permission. Click **OK** two times and then click **Close**.

#### Validate cross-forest authentication to a resource

1. Sign in a Windows computer **from your on-premises Active Directory** using a user account from your on-premises Active Directory.
2. Using **Windows Explorer**, connect to the share you created using the fully qualified host name and the share (hostname.fqdn_of_aadds_domain_name\sharename example: \\fs1.aadds.contoso.com\xforestShare).
3. Validate the write permission. Right-click in the folder, select **New** and click **Text Document**. Use the default name **New Text Document**.
4. Validate the read permission. Open **New Text Document**.
5. Validate the modify permission. Add text to the file and close **Notepad**. When prompted to save changes, click **Save**.
6. Validate the delete permission. Right-click **New Text Document** and click **Delete**. Click **Yes** to confirm file deletion.

## Next steps

For more conceptual information about forest types in Azure AD DS, see [What are resource forests?][resource-forests]

<!-- INTERNAL LINKS -->
[concepts-forest]: concepts-resource-forest.md
[concepts-trust]: concepts-forest-trust.md