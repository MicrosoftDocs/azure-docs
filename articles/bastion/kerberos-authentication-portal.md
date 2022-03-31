---
title: 'Configure Bastion for Kerberos authentication: Azure portal'
titleSuffix: Azure Bastion
description: Learn how to configure Bastion to use Kerberos authentication via the Azure portal.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 03/08/2022
ms.author: cherylmc

---

# How to configure Bastion for Kerberos authentication using the Azure portal (Preview)

This article shows you how to configure Azure Bastion to use Kerberos authentication. Kerberos authentication can be used with both the Basic and the Standard Bastion SKUs. For more information about Kerberos authentication, see the [Kerberos authentication overview](/windows-server/security/kerberos/kerberos-authentication-overview). For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)

> [!NOTE]
> During Preview, the Kerberos setting for Azure Bastion can be configured in the Azure portal only.
>

## <a name="prereq"></a>Prerequisites

* An Azure account with an active subscription. If you don't have one, [create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). To be able to connect to a VM through your browser using Bastion, you must be able to sign in to the Azure portal.

* An Azure virtual network. For steps to create a VNet, see [Quickstart: Create a virtual network](../virtual-network/quick-create-portal.md).

## <a name="vnet"></a>Update VNet DNS servers

In this section, the following steps help you update your virtual network to specify custom DNS settings.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the virtual network for which you want to deploy the Bastion resources.
1. Go to the **DNS servers** page for your VNet and select **Custom**. Add the IP address of your Azure-hosted domain controller and **Save**.

   :::image type="content" source="./media/kerberos-authentication-portal/dns-servers.png" alt-text="Screenshot of DNS servers page." lightbox="./media/kerberos-authentication-portal/dns-servers.png":::

## <a name="deploy"></a>Deploy Bastion

In this section, the following steps help you deploy Bastion to your virtual network.

1. Deploy Bastion to your VNet using the steps in [Tutorial: Deploy Bastion using manual configuration settings](tutorial-create-host-portal.md). Configure the settings on the **Basics** tab. Then, select the **Advanced** tab.

1. On the **Advanced** tab, select **Kerberos**. Then select the **Review + create** and **Create** to deploy Bastion to your virtual network.

   :::image type="content" source="./media/kerberos-authentication-portal/select-kerberos.png" alt-text="Screenshot of Advanced tab." lightbox="./media/kerberos-authentication-portal/select-kerberos.png":::

1. Once the deployment completes, you can use it to sign in to any reachable Windows VMs joined to the custom DNS you specified in the earlier steps.

## <a name="modify"></a>To modify an existing Bastion deployment

In this section, the following steps help you modify your virtual network and existing Bastion deployment for Kerberos authentication.

1. [Update the DNS settings](#vnet) for your virtual network.
1. Go to the portal page for your Bastion deployment and select **Configuration**.
1. On the Configuration page, select **Kerberos authentication**, then select **Apply**.
1. Bastion will update with the new configuration settings.

## <a name="verify"></a>To verify Bastion is using Kerberos

Once you have enabled Kerberos on your Bastion resource, you can verify that it's actually using Kerberos for authentication to the target domain-joined VM.

1. Sign into the target VM (either via Bastion or not). Search for "Edit Group Policy" from the taskbar and open the **Local Group Policy Editor**.
1. Select **Computer Configuration > Windows Settings > Security Settings > Local Policies > Security Options**.
1. Find the policy **Networking security: Restrict NTLM: Incoming NTLM Traffic** and set it to **Deny all domain accounts**. Because Bastion uses NTLM for authentication when Kerberos is disabled, this setting ensures that NTLM-based authentication is unsuccessful for future sign-in attempts on the VM.
1. End the VM session.
1. Connect to the target VM again using Bastion. Sign-in should succeed, indicating that Bastion used Kerberos (and not NTLM) for authentication.

## Next steps

For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)
