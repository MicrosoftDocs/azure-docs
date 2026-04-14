---
title: Azure Firewall explicit proxy (preview)
description: Learn about Azure Firewall's explicit proxy setting.
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 03/28/2026
ms.author: duau
ms.custom: sfi-image-nochange
# Customer intent: As a network administrator, I want to configure an explicit proxy on Azure Firewall, so that I can manage outbound traffic efficiently without using a user-defined route.
---

# Azure Firewall explicit proxy (preview)

> [!IMPORTANT]
> Explicit proxy is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Firewall operates in a transparent proxy mode by default. In this mode, you use a user-defined route (UDR) configuration to send traffic to the firewall. The firewall intercepts that traffic inline and passes it to the destination.

When you set up explicit proxy on the outbound path, you can configure a proxy setting on the sending application (such as a web browser) with Azure Firewall configured as the proxy. As a result, traffic from the sending application goes to the firewall's private IP address and therefore egresses directly from the firewall without using a UDR.

With the explicit proxy mode (supported for HTTP/S), you can define proxy settings in the browser to point to the firewall private IP address. You can manually configure the IP address on the browser or application, or you can configure a proxy auto config (PAC) file. The firewall can host the PAC file to serve the proxy requests after you upload it to the firewall.

## Configuration

- After you enable the feature, the following screen appears on the portal:

   :::image type="content" source="media/explicit-proxy/enable-explicit-proxy.png" alt-text="Screenshot showing the Enable explicit proxy setting.":::

   > [!NOTE]
   > The HTTP and HTTPS ports can't be the same.

1. Next, to allow the traffic through the firewall, create an **application** rule in the firewall policy to allow this traffic.

   > [!IMPORTANT]
   > You must use an application rule. A network rule doesn't work.

- Select **Enable proxy auto-configuration** to use the Proxy autoconfiguration (PAC) file.

1. First, upload the PAC file to a storage container that you create. Then, on the **Enable explicit proxy** pane, configure the shared access signature (SAS) URL. Configure the port where the PAC is served from, and then select **Apply** at the bottom of the page.

   The SAS URL must have **READ** permissions so the firewall can download the file. If you make changes to the PAC file, you need to generate a new SAS URL and configure it on the firewall **Enable explicit proxy** page.

   :::image type="content" source="media/explicit-proxy/shared-access-signature.png" alt-text="Screenshot showing generate shared access signature.":::

## Governance and compliance

To ensure consistent configuration of explicit proxy settings across your Azure Firewall deployments, use Azure Policy definitions. The following policies are available to govern explicit proxy configurations:

- **Enforce Explicit Proxy Configuration for Firewall Policies**: Ensures that all Azure Firewall policies have explicit proxy configuration enabled.
- **Enable PAC file configuration while using Explicit Proxy**: Audits that when explicit proxy is enabled, the PAC (Proxy Auto-Configuration) file is also properly configured.

For more information about these policies and how to implement them, see [Use Azure Policy to help secure your Azure Firewall deployments](firewall-azure-policy.md).

## Next steps

- To learn more about explicit proxy, see [Demystifying Explicit proxy: Enhancing Security with Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/demystifying-explicit-proxy-enhancing-security-with-azure/ba-p/3873445).
- To learn how to deploy an Azure Firewall, see [Deploy and configure Azure Firewall by using Azure PowerShell](deploy-ps.md).
