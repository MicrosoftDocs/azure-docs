---
title: Deploy Standard logic apps to private storage accounts
description: Deploy Standard logic app workflows to Azure storage accounts that use private endpoints and deny public access.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.custom: engagement-fy23, devx-track-arm-template
ms.date: 10/18/2022
# As a developer, I want to deploy Standard logic apps to Azure storage accounts that use private endpoints.
---

# Deploy single-tenant Standard logic apps to private storage accounts using private endpoints

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

When you create a single-tenant Standard logic app resource, you're required to have a storage account for storing logic app artifacts. You can restrict access to this storage account so that only the resources inside a virtual network can connect to your logic app workflow. Azure Storage supports adding private endpoints to your storage account.

This article describes the steps to follow for deploying such logic apps to protected private storage accounts.

For more information, review the following documentation:

- [Secure traffic between Standard logic apps and Azure virtual networks using private endpoints](secure-single-tenant-workflow-virtual-network-private-endpoint.md)
- [Use private endpoints for Azure Storage](../storage/common/storage-private-endpoints.md)

<a name="deploy-with-portal-or-visual-studio-code"></a>

## Deploy using Azure portal or Visual Studio Code

This deployment method requires that temporary public access to your storage account. If you can't enable public access due to your organization's policies, you can still deploy your logic app to a private storage account. However, you have to [deploy with an Azure Resource Manager template (ARM template)](#deploy-arm-template), which is described in a later section. 

> [!NOTE]
> An exception to the previous rule is that you can use the Azure portal to deploy your logic app to an App Service Environment, 
> even if the storage account is protected with a private endpoint. However, you'll need connectivity between the 
> subnet used by the App Service Environment and the subnet used by the storage account's private endpoint. 

1. Create different private endpoints for each of the Table, Queue, Blob, and File storage services.

1. Enable temporary public access on your storage account when you deploy your logic app.

   1. In the [Azure portal](https://portal.azure.com), open your storage account resource.

   1. On the storage account resource menu, under **Security + networking**, select **Networking**.

   1. On the **Networking** pane, on the **Firewalls and virtual networks** tab, under **Allow access from**, select **All networks**.

1. Deploy your logic app resource by using either the Azure portal or Visual Studio Code.

1. After deployment finishes, enable virtual network integration between your logic app and the private endpoints on the virtual network that connects to your storage account.

   1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

   1. On the logic app resource menu, under **Settings**, select **Networking**.

   1. Select **VNet integration** on **Outbound Traffic** card to enable integration with a virtual network connecting to your storage account.

   1. To access your logic app workflow data over the virtual network, in your logic app resource settings, set the `WEBSITE_CONTENTOVERVNET` setting to `1`.

   If you use your own domain name server (DNS) with your virtual network, set your logic app resource's `WEBSITE_DNS_SERVER` app setting to the IP address for your DNS. If you have a secondary DNS, add another app setting named `WEBSITE_DNS_ALT_SERVER`, and set the value also to the IP for your secondary DNS.

1. After you apply these app settings, you can remove public access from your storage account.

   1. In the [Azure portal](https://portal.azure.com), open your storage account resource.

   1. On the storage account resource menu, under **Security + networking**, select **Networking**.

   1. On the **Networking** pane, on the **Firewalls and virtual networks** tab, under **Allow access from**, clear **Selected networks**, and add virtual networks as necessary.

   > [!NOTE]
   > Your logic app might experience an interruption because the connectivity switch between public and private endpoints might take time. 
   > This disruption might result in your workflows temporarily disappearing. If this behavior happens, you can try to reload your workflows 
   > by restarting the logic app and waiting several minutes.

<a name="deploy-arm-template"></a>

## Deploy using an Azure Resource Manager template

This deployment method doesn't require public access to the storage account. For an example ARM template, review [Deploy logic app using secured storage account with private endpoints](https://github.com/VeeraMS/LogicApp-deployment-with-Secure-Storage). The example template creates the following resources:

- A storage account that denies the public traffic
- An Azure virtual network and subnets
- Private DNS zones and private endpoints for Blob, File, Queue, and Table services
- A file share for the Azure Logic Apps runtime directories and files. For more information, review [Host and app settings for logic apps in single-tenant Azure Logic Apps](edit-app-settings-host-settings.md).
- An App Service plan (Workflow Standard WS1) for hosting Standard logic app resources
- A Standard logic app resource with a network configuration that's set up to use virtual network integration. This configuration enables the logic app to access the storage account through private endpoints.

## Troubleshoot common errors

The following errors commonly happen with a private storage account that's behind a firewall and indicate that the logic app can't access the storage account services.

| Problem | Error |
|---------|-------|
| Access to the `host.json` file is denied | `"System.Private.CoreLib: Access to the path 'C:\\home\\site\\wwwroot\\host.json' is denied."` |
| Can't load workflows in the logic app resource | `"Encountered an error (ServiceUnavailable) from host runtime."` |
|||

As the logic app isn't running when these errors occur, you can't use the Kudu console debugging service on the Azure platform to troubleshoot these errors. However, you can use the following methods instead:

- Create an Azure virtual machine (VM) inside a different subnet within the same virtual network that's integrated with your logic app. Try to connect from the VM to the storage account.

- Check access to the storage account services by using the [Storage Explorer tool](https://azure.microsoft.com/features/storage-explorer/#overview).

  If you find any connectivity issues using this tool, continue with the following steps:

  1. From the command prompt, run `nslookup` to check whether the storage services resolve to the private IP addresses for the virtual network:

     `C:\>nslookup {storage-account-host-name} [optional-DNS-server]`

  1. Check all the storage services:

     `C:\nslookup {storage-account-host-name}.blob.core.windows.net`

     `C:\nslookup {storage-account-host-name}.file.core.windows.net`

     `C:\nslookup {storage-account-host-name}.queue.core.windows.net`

     `C:\nslookup {storage-account-host-name}.table.core.windows.net`

  1. If these DNS queries resolve, run `psping` or `tcpping` to check traffic to the storage account over port 443:

     `C:\psping {storage-account-host-name} {port} [optional-DNS-server]`

  1. Check all the storage services:

     `C:\psping {storage-account-host-name}.blob.core.windows.net:443`

     `C:\psping {storage-account-host-name}.queue.core.windows.net:443`

     `C:\psping {storage-account-host-name}.table.core.windows.net:443`

     `C:\psping {storage-account-host-name}.file.core.windows.net:445`

  1. If the queries resolve from the VM, continue with the following steps:

     1. In the VM, find the DNS server that's used for resolution.

     1. In your logic app, [find and set the `WEBSITE_DNS_SERVER` app setting](edit-app-settings-host-settings.md?tabs=azure-portal?tabs=azure-portal#manage-app-settings---localsettingsjson) to the same DNS server value that you found in the previous step.

     1. Check that the virtual network integration is set up correctly with the appropriate virtual network and subnet in your logic app.

## Next steps

- [Logic Apps Anywhere: Networking possibilities with Logic Apps (single-tenant)](https://techcommunity.microsoft.com/t5/integrations-on-azure/logic-apps-anywhere-networking-possibilities-with-logic-app/ba-p/2105047)
