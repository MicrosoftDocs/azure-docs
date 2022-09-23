---
title: 'Configure Bastion for Kerberos authentication: Azure portal'
titleSuffix: Azure Bastion
description: Learn how to configure Bastion to use Kerberos authentication via the Azure portal.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 08/03/2022
ms.author: cherylmc

---

# How to configure Bastion for Kerberos authentication using the Azure portal (Preview)

This article shows you how to configure Azure Bastion to use Kerberos authentication. Kerberos authentication can be used with both the Basic and the Standard Bastion SKUs. For more information about Kerberos authentication, see the [Kerberos authentication overview](/windows-server/security/kerberos/kerberos-authentication-overview). For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)

> [!NOTE]
> During Preview, the Kerberos setting for Azure Bastion can be configured in the Azure portal only.
>

## Prerequisites

* An Azure account with an active subscription. If you don't have one, [create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). To be able to connect to a VM through your browser using Bastion, you must be able to sign in to the Azure portal.

* An Azure virtual network. For steps to create a VNet, see [Quickstart: Create a virtual network](../virtual-network/quick-create-portal.md).

## Update VNet DNS servers

In this section, the following steps help you update your virtual network to specify custom DNS settings.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the virtual network for which you want to deploy the Bastion resources.
1. Go to the **DNS servers** page for your VNet and select **Custom**. Add the IP address of your Azure-hosted domain controller and **Save**.

## Deploy Bastion

1. Begin configuring your bastion deployment using the steps in [Tutorial: Deploy Bastion using manual configuration settings](tutorial-create-host-portal.md). Configure the settings on the **Basics** tab. Then, at the top of the page, click **Advanced** to go to the Advanced tab.

1. On the **Advanced** tab, select **Kerberos**.

   :::image type="content" source="./media/kerberos-authentication-portal/select-kerberos.png" alt-text="Screenshot of select bastion features." lightbox="./media/kerberos-authentication-portal/select-kerberos.png":::

1. At the bottom of the page, select **Review + create**, then **Create** to deploy Bastion to your virtual network.

1. Once the deployment completes, you can use it to sign in to any reachable Windows VMs joined to the custom DNS you specified in the earlier steps.

## To modify an existing Bastion deployment

In this section, the following steps help you modify your virtual network and existing Bastion deployment for Kerberos authentication.

1. [Update the DNS settings](#update-vnet-dns-servers) for your virtual network.
1. Go to the portal page for your Bastion deployment and select **Configuration**.
1. On the Configuration page, select **Kerberos authentication**, then select **Apply**.
1. Bastion will update with the new configuration settings.

## To verify Bastion is using Kerberos

Once you have enabled Kerberos on your Bastion resource, you can verify that it's actually using Kerberos for authentication to the target domain-joined VM.

1. Sign into the target VM (either via Bastion or not). Search for "Edit Group Policy" from the taskbar and open the **Local Group Policy Editor**.
1. Select **Computer Configuration > Windows Settings > Security Settings > Local Policies > Security Options**.
1. Find the policy **Networking security: Restrict NTLM: Incoming NTLM Traffic** and set it to **Deny all domain accounts**. Because Bastion uses NTLM for authentication when Kerberos is disabled, this setting ensures that NTLM-based authentication is unsuccessful for future sign-in attempts on the VM.
1. End the VM session.
1. Connect to the target VM again using Bastion. Sign-in should succeed, indicating that Bastion used Kerberos (and not NTLM) for authentication.

## Setup

To setup Kerberos, deploy the `KerberosDeployment.json` ARM template by running the following PS cmd: 
```
New-AzResourceGroupDeployment -ResourceGroupName <your-rg-name> -TemplateFile "<path-to-template>\KerberosDeployment.json"`
```
This template does the following:
- Deploys these Azure resources: 
  - Vnet
  - Bastion, Bastion-ip
  - ClientVM, ServerVM
- Have the DNS Server of the VNET point to the private IP address of the Server-vm (domain controller). This is required for the target ClientVM to successfully domain-join to the Domain Controller (ServerVM).
- Runs a Custom Script Extension on the ServerVM to promote it to a domain controller with domain name: `<domain-name-specified-in-deployment.json-file>`
- Runs a Custom Script Extension on the ClientVM to have it: 
  - **Restrict NTLM: Incoming NTLM traffic** = Deny all domain accounts (this is to ensure Kerberos is used for authentication)
  - Domain-join the `<domain-name-specified-in-deployment.json-file>` domain

Login to ClientVM using Bastion with Kerberos authentication:
- Make sure to have the `Kerberos` feature enabled on the bastion
- Login to ClientVM with Bastion using credentials: username = `serveruser@<domain-name-specified-in-deployment.json-file>` and password = `<password-used-in-deployment.json>`


## Next steps

For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)
