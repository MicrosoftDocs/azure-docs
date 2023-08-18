---
title: Azure Firewall Explicit proxy (preview)
description: Learn about Azure Firewall's Explicit Proxy setting.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 03/30/2023
ms.author: magakman
---

# Azure Firewall Explicit proxy (preview)

> [!IMPORTANT]
> Explicit proxy is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Firewall operates in a transparent proxy mode by default. In this mode, traffic is sent to the firewall using a user defined route (UDR) configuration. The firewall intercepts that traffic inline and passes it to the destination.

With Explicit proxy set on the outbound path, you can configure a proxy setting on the sending application (such as a web browser) with Azure Firewall configured as the proxy. As a result, traffic from the sending application goes to the firewall's private IP address and therefore egresses directly from the firewall without the using  a UDR.

With the Explicit proxy mode (supported for HTTP/S), you can define proxy settings in the browser to point to the firewall private IP address. You can manually configure the IP address on the browser or application, or you can configure a proxy auto config (PAC) file. The firewall can host the PAC file to serve the proxy requests after you upload it to the firewall.

## Configuration

- Once the feature is enabled, the following screen shows on the portal:

   :::image type="content" source="media/explicit-proxy/enable-explicit-proxy.png" alt-text="Screenshot showing the Enable explicit proxy setting.":::

   > [!NOTE]
   > The HTTP and HTTPS ports can't be the same.

- Next, to allow the traffic to pass through the Firewall, create an **application** rule in the Firewall policy to allow this traffic.
   > [!IMPORTANT]
   > You must use an application rule. A network rule won't work.


- To use the Proxy autoconfiguration (PAC) file, select **Enable proxy auto-configuration**.

   :::image type="content" source="media/explicit-proxy/proxy-auto-configuration.png" alt-text="Screenshot showing the proxy autoconfiguration file setting.":::

- First, upload the PAC file to a storage container that you create. Then, on the **Enable explicit proxy** page, configure the shared access signature (SAS) URL. Configure the port where the PAC is served from, and then select **Apply** at the bottom of the page.

   The SAS URL must have READ permissions so the firewall can upload the file. If changes are made to the PAC file, a new SAS URL needs to be generated and configured on the firewall **Enable explicit proxy** page.

   :::image type="content" source="media/explicit-proxy/shared-access-signature.png" alt-text="Screenshot showing generate shared access signature.":::

## Next steps

- To learn more about Explicit proxy, see [Demystifying Explicit proxy: Enhancing Security with Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/demystifying-explicit-proxy-enhancing-security-with-azure/ba-p/3873445).
- To learn how to deploy an Azure Firewall, see [Deploy and configure Azure Firewall using Azure PowerShell](deploy-ps.md).
