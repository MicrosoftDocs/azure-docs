---
title: Deploy Azure AD Application Proxy for Azure AD Domain Services | Microsoft Docs
description: Learn how to provide secure access to internal applications for remote workers by deploying and configuring Azure Active Directory Application Proxy in an Azure Active Directory Domain Services managed domain
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 938a5fbc-2dd1-4759-bcce-628a6e19ab9d
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 03/31/2020
ms.author: iainfou

---
# Deploy Azure AD Application Proxy for secure access to internal applications in an Azure Active Directory Domain Services managed domain

With Azure AD Domain Services (Azure AD DS), you can lift-and-shift legacy applications running on-premises into Azure. Azure Active Directory (AD) Application Proxy then helps you support remote workers by securely publishing those internal applications part of an Azure AD DS managed domain so they can be accessed over the internet.

If you're new to the Azure AD Application Proxy and want to learn more, see [How to provide secure remote access to internal applications](../active-directory/manage-apps/application-proxy.md).

This article shows you how to create and configure an Azure AD Application Proxy connector to provide secure access to applications in a managed domain.

## Before you begin

To complete this article, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
    * An **Azure AD Premium license** is required to use the Azure AD Application Proxy.
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, [create and configure an Azure Active Directory Domain Services managed domain][create-azure-ad-ds-instance].

## Create a domain-joined Windows VM

To route traffic to applications running in your environment, you install the Azure AD Application Proxy connector component. This Azure AD Application Proxy connector must be installed on Windows Server virtual machines (VM) that's joined to the managed domain. For some applications, you can deploy multiple servers that each have the connector installed. This deployment option gives you greater availability and helps handle heavier authentication loads.

The VM that runs the Azure AD Application Proxy connector must be on the same, or a peered, virtual network in which you have enabled Azure AD DS. The VMs that then host the applications you publish using the Application Proxy must also be deployed on the same Azure virtual network.

To create a VM for the Azure AD Application Proxy connector, complete the following steps:

1. [Create a custom OU](create-ou.md). You can delegate permissions to manage this custom OU to users within the managed domain. The VMs for Azure AD Application Proxy and that run your applications must be a part of the custom OU, not the default *AAD DC Computers* OU.
1. [Domain-join the virtual machines][create-join-windows-vm], both the one that runs the Azure AD Application Proxy connector, and the ones that run your applications, to the managed domain. Create these computer accounts in the custom OU from the previous step.

## Download the Azure AD Application Proxy connector

Perform the following steps to download the Azure AD Application Proxy connector. The setup file you download is copied to your App Proxy VM in the next section.

1. Sign in to the [Azure portal](https://portal.azure.com) with a user account that has *Enterprise administrator* permissions in Azure AD.
1. Search for and select **Azure Active Directory** at the top of the portal, then choose **Enterprise applications**.
1. Select **Application proxy** from the menu on the left-hand side. To create your first connector and enable App Proxy, select the link to **download a connector**.
1. On the download page, accept the license terms and privacy agreement, then select **Accept terms & Download**.

    ![Download the Azure AD App Proxy connector](./media/app-proxy/download-app-proxy-connector.png)

## Install and register the Azure AD Application Proxy connector

With a VM ready to be used as the Azure AD Application Proxy connector, now copy and run the setup file downloaded from the Azure portal.

1. Copy the Azure AD Application Proxy connector setup file to your VM.
1. Run the setup file, such as *AADApplicationProxyConnectorInstaller.exe*. Accept the software license terms.
1. During the install, you're prompted to register the connector with the Application Proxy in your Azure AD directory.
   * Provide the credentials for a global administrator in your Azure AD directory. The Azure AD global administrator credentials may be different from your  Azure credentials in the portal

        > [!NOTE]
        > The global administrator account used to register the connector must belong to the same directory where you enable the Application Proxy service.
        >
        > For example, if the Azure AD domain is *aaddscontoso.com*, the global administrator should be `admin@aaddscontoso.com` or another valid alias on that domain.

   * If Internet Explorer Enhanced Security Configuration is turned on for the VM where you install the connector, the registration screen might be blocked. To allow access, follow the instructions in the error message, or turn off Internet Explorer Enhanced Security during the install process.
   * If connector registration fails, see [Troubleshoot Application Proxy](../active-directory/manage-apps/application-proxy-troubleshoot.md).
1. At the end of the setup, a note is shown for environments with an outbound proxy. To configure the Azure AD Application Proxy connector to work through the outbound proxy, run the provided script, such as `C:\Program Files\Microsoft AAD App Proxy connector\ConfigureOutBoundProxy.ps1`.
1. On the Application proxy page in the Azure portal, the new connector is listed with a status of *Active*, as shown in the following example:

    ![The new Azure AD Application Proxy connector shown as active in the Azure portal](./media/app-proxy/connected-app-proxy.png)

> [!NOTE]
> To provide high availability for applications authenticating through the Azure AD Application Proxy, you can install connectors on multiple VMs. Repeat the same steps listed in the previous section to install the connector on other servers joined to the managed domain.

## Enable resource-based Kerberos constrained delegation

If you want to use single sign-on to your applications using Integrated Windows Authentication (IWA), grant the Azure AD Application Proxy connectors permission to impersonate users and send and receive tokens on their behalf. To grant these permissions, you configure Kerberos constrained delegation (KCD) for the connector to access resources on the managed domain. As you don't have domain administrator privileges in a managed domain, traditional account-level KCD cannot be configured on a managed domain. Instead, use resource-based KCD.

For more information, see [Configure Kerberos constrained delegation (KCD) in Azure Active Directory Domain Services](deploy-kcd.md).

> [!NOTE]
> You must be signed in to a user account that's a member of the *Azure AD DC administrators* group in your Azure AD tenant to run the following PowerShell cmdlets.
>
> The computer accounts for your App Proxy connector VM and application VMs must be in a custom OU where you have permissions to configure resource-based KCD. You can't configure resource-based KCD for a computer account in the built-in *AAD DC Computers* container.

Use the [Get-ADComputer][Get-ADComputer] to retrieve the settings for the computer on which the Azure AD Application Proxy connector is installed. From your domain-joined management VM and logged in as user account that's a member of the *Azure AD DC administrators* group, run the following cmdlets.

The following example gets information about the computer account named *appproxy.aaddscontoso.com*. Provide your own computer name for the Azure AD Application Proxy VM configured in the previous steps.

```powershell
$ImpersonatingAccount = Get-ADComputer -Identity appproxy.aaddscontoso.com
```

For each application server that runs the apps behind Azure AD Application Proxy use the [Set-ADComputer][Set-ADComputer] PowerShell cmdlet to configure resource-based KCD. In the following example, the Azure AD Application Proxy connector is granted permissions to use the *appserver.aaddscontoso.com* computer:

```powershell
Set-ADComputer appserver.aaddscontoso.com -PrincipalsAllowedToDelegateToAccount $ImpersonatingAccount
```

If you deploy multiple Azure AD Application Proxy connectors, you must configure resource-based KCD for each connector instance.

## Next steps

With the Azure AD Application Proxy integrated with Azure AD DS, publish applications for users to access. For more information, see [publish applications using Azure AD Application Proxy](../active-directory/manage-apps/application-proxy-publish-azure-portal.md).

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[create-join-windows-vm]: join-windows-vm.md
[azure-bastion]: ../bastion/bastion-create-host-portal.md
[Get-ADComputer]: /powershell/module/addsadministration/get-adcomputer
[Set-ADComputer]: /powershell/module/addsadministration/set-adcomputer
