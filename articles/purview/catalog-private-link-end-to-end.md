---
title: Connect to your Purview account and scan data sources from restricted network
description: This article describes how you can set up a private endpoint to connect to your Purview account and scan data sources from restricted network for an end to end isolation
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/16/2021
# Customer intent: As an Azure Purview admin, I want to set up private endpoints for my Azure Purview account to access purview account and scan data sources from restricted network.
---

# Deploy _account_ and _portal_ private endpoints for your Azure Purview account


In this guide, you will learn how to deploy _account_, _portal_ and _ingestion_ private endpoints for your Azure Purview account to access purview account and scan data sources using self-hosted integration runtime, enabling a end to end network isolation.

The Azure Purview _account_ private endpoint is used to add another layer of security by enabling scenarios where only client calls that originate from within the virtual network are allowed to access the Azure Purview account. This private endpoint is also a prerequisite for the portal private endpoint.

The Azure Purview _portal_ private endpoint is required to enable connectivity to Azure Purview Studio using a private network.

Azure Purview can scan data sources in Azure or an on-premises environment by using _ingestion_ private endpoints. Three private endpoint resources are required to be deployed and linked to Azure Purview managed resources when ingestion private endpoint is deployed:

- Blob private endpoint is linked to an Azure Purview managed storage account.
- Queue private endpoint is linked to an Azure Purview managed storage account.
- namespace private endpoint is linked to an Azure Purview managed event hub namespace.

   :::image type="content" source="media/catalog-private-link/purview-private-link-architecture.png" alt-text="Diagram that shows Azure Purview and Private Link architecture.":::

## Deployment checklist
Using the one of the deployment options explained further in this guide, you can deploy a new Azure Purview account with _account_, _portal_ and _ingestion_ private endpoints or you can choose to deploy these private endpoints for an existing Azure Purview account:

1. Before you start this guide, choose an appropriate Azure virtual network and a subnet to deploy Azure Purview private endpoints:
   - Deploy a [new virtual network](../virtual-network/quick-create-portal.md) in your Azure subscription.
   - Locate an existing Azure virtual network and a subnet in your Azure subscription.
  
2. Define an appropriate name resolution method, so you can access Azure Purview account adn scan data sources using private network. You can use any of the following options:
   - Deploy new Azure DNS zones using the steps explained further in this guide.
   - Add required DNS records to existing Azure DNS zones using the steps explained further in this guide.
   - After completing the steps in this guide, add required DNS A records in your existing DNS servers manually.
3. Deploy a [new Purview account](#option-1---deploy-a-new-azure-purview-account-with-account-portal-and-ingestion-private-endpoints) with all private endpoints, or deploy private endpoints for an [existing Purview account](#option-2---enable-account-portal-and-ingestion-private-endpoint-on-existing-azure-purview-accounts).
4. [Enable access to Azure Active Directory](#enable-access-to-azure-active-directory) if your private network has network security group rules set to deny for all public internet traffic.
5. Deploy and register [Self-hosted integration runtime](#deploy-self-hosted-integration-runtime-ir-and-scan-your-data-sources) inside the same VNet where Azure Purview ingestion private endpoints are deployed.
6. After completing this guide, adjust DNS configurations if needed.
7. Validate your network and name resolution between management machine, self-hosted IR VM and data sources to Azure Purview. 

## Option 1 - Deploy a new Azure Purview account with _account_, _portal_ and _ingestion_ private endpoints

1. Go to the [Azure portal](https://portal.azure.com), and then go to the **Purview accounts** page. Select **+ Create** to create a new Azure Purview account.

2. Fill in the basic information, and on the **Networking** tab, set the connectivity method to **Private endpoint**. Set enable private endpoint to **Account, Portal and ingestion**.

3. Under **Account and portal** select **+ Add** to add a private endpoint for your Azure Purview account.

4. On the **Create a private endpoint** page, for **Purview sub-resource**, choose your location, provide a name for _account_ private endpoint and select **account**. Under **networking**, select your virtual network and subnet, and optionally, select **Integrate with private DNS zone** to create a new Azure Private DNS zone. 

   > [!NOTE]
   > You can also use your existing Azure Private DNS Zones or create DNS records in your DNS Servers manually later. For more information, see [Configure DNS Name Resolution for private endpoints](./catalog-private-link-name-resolution.md)

   :::image type="content" source="media/catalog-private-link/create-pe-account.png" alt-text="Screenshot that shows Create private endpoint page selections.":::

5. Select **OK**.
   
6. Under **Account and portal** wizard, select **+Add** again to add _portal_ private endpoint. 
  
7. On the **Create a private endpoint** page, for **Purview sub-resource**,choose your location, provide a name for _portal_ private endpoint and select **portal**. Under **networking**, select your virtual network and subnet, and optionally, select **Integrate with private DNS zone** to create a new Azure Private DNS zone. 
   
   > [!NOTE]
   > You can also use your existing Azure Private DNS Zones or create DNS records in your DNS Servers manually later. For more information, see [Configure DNS Name Resolution for private endpoints](./catalog-private-link-name-resolution.md)

   :::image type="content" source="media/catalog-private-link/create-pe-portal.png" alt-text="Screenshot that shows Create private endpoint page selections.":::

8. Select **OK**.

9.  Under **Ingestion** set up your ingestion private endpoints by providing details for **Subscription**, **Virtual network**, and **Subnet** that you want to pair with your private endpoint.

   :::image type="content" source="media/catalog-private-link/create-pe-azure-portal.png" alt-text="Screenshot that shows creating a private endpoint in the Azure portal.":::

11. Optionally, select **Private DNS integration** to use Azure Private DNS Zones.
   
   > [!IMPORTANT]
   > It is important to select correct Azure Private DNS Zones to allow correct name resolution between Azure Purview and data sources. You can also use your existing Azure Private DNS Zones or create DNS records in your DNS Servers manually later. For more information, see [Configure DNS Name Resolution for private endpoints](./catalog-private-link-name-resolution.md)

12. Select **Review + Create**. On the **Review + Create** page, Azure validates your configuration.

13. When you see the "Validation passed" message, select **Create**.

    :::image type="content" source="media/catalog-private-link/validation-passed.png" alt-text="Screenshot that shows that validation passed for account creation.":::
   

## Option 2 - Enable _account_, _portal_ and _ingestion_ private endpoint on existing Azure Purview accounts

1. Go to the [Azure portal](https://portal.azure.com), and then click on to your Azure Purview account, and under **Settings** select **Networking**, and then select **Private endpoint connections**.

    :::image type="content" source="media/catalog-private-link/pe-portal.png" alt-text="Screenshot that shows creating an account private endpoint.":::

2. Select **+ Private endpoint** to create a new private endpoint.

3. Fill in the basic information.

4. On the **Resource** tab, for **Resource type**, select **Microsoft.Purview/accounts**.

5. For **Resource**, select the Azure Purview account, and for **Target sub-resource**, select **account**.

6. On the **Configuration** tab, select the virtual network and optionally, select Azure Private DNS zone to create a new Azure DNS Zone.
   
   > [!NOTE]
   > For DNS configuration, you can also use your existing Azure Private DNS Zones from the dropdown list or add the required DNS records to your DNS Servers manually later. For more information, see [Configure DNS Name Resolution for private endpoints](./catalog-private-link-name-resolution.md)

7. Go to the summary page, and select **Create** to create the portal private endpoint.
   
8. Follow the same steps when you select **portal** for **Target sub-resource**.
   
9.  From your Azure Purview account, under **Settings** select **Networking**, and then select **Ingestion private endpoint connections**.

10. Under Ingestion private endpoint connections, select **+ New** to create a new ingestion private endpoint.

11. Fill in the basic information, selecting your existing virtual network and a subnet details. Optionally, select **Private DNS integration** to use Azure Private DNS Zones. Select correct Azure Private DNS Zones from each list.
   
   > [!NOTE]
   > You can also use your existing Azure Private DNS zones or create DNS records in your DNS Servers manually later. For more information, see [Configure DNS Name Resolution for private endpoints](./catalog-private-link-name-resolution.md)

   :::image type="content" source="media/catalog-private-link/ingestion-pe-fill-details.png" alt-text="Screenshot that shows filling in private endpoint details.":::

13. Select **Create** to finish the setup.

## Enable access to Azure Active Directory

> [!NOTE]
> If your VM, VPN gateway, or VNet Peering gateway has public internet access, it can access the Azure Purview portal and the Azure Purview account enabled with private endpoints. For this reason, you don't have to follow the rest of the instructions. If your private network has network security group rules set to deny all public internet traffic, you'll need to add some rules to enable Azure Active Directory (Azure AD) access. Follow the instructions to do so.

These instructions are provided for accessing Azure Purview securely from an Azure VM. Similar steps must be followed if you're using VPN or other VNet Peering gateways.

1. Go to your VM in the Azure portal, and under **Settings**, select **Networking**. Then select **Outbound port rules** > **Add outbound port rule**.

   :::image type="content" source="media/catalog-private-link/outbound-rule-add.png" alt-text="Screenshot that shows adding an outbound rule.":::

1. On the **Add outbound security rule** pane:

   1. Under **Destination**, select **Service Tag**.
   1. Under **Destination service tag**, select **AzureActiveDirectory**.
   1. Under **Destination port ranges**, select *.
   1. Under **Action**, select **Allow**.
   1. Under **Priority**, the value should be higher than the rule that denied all internet traffic.
   
   Create the rule.

   :::image type="content" source="media/catalog-private-link/outbound-rule-details.png" alt-text="Screenshot that shows adding outbound rule details.":::

1. Follow the same steps to create another rule to allow the **AzureResourceManager** service tag. If you need to access the Azure portal, you can also add a rule for the **AzurePortal** service tag.

1. Connect to the VM and open the browser. Go to the browser console by selecting Ctrl+Shift+J, and switch to the network tab to monitor network requests. Enter web.purview.azure.com in the URL box, and try to sign in by using your Azure AD credentials. Sign-in will probably fail, and on the **Network** tab on the console, you can see Azure AD trying to access aadcdn.msauth.net but getting blocked.

   :::image type="content" source="media/catalog-private-link/login-fail.png" alt-text="Screenshot that shows sign-in fail details.":::

1. In this case, open a command prompt on the VM, ping aadcdn.msauth.net, get its IP, and then add an outbound port rule for the IP in the VM's network security rules. Set the **Destination** to **IP Addresses** and set **Destination IP addresses** to the aadcdn IP. Because of Azure Load Balancer and Azure Traffic Manager, the Azure AD Content Delivery Network IP might be dynamic. After you get its IP, it's better to add it into the VM's host file to force the browser to visit that IP to get the Azure AD Content Delivery Network.

   :::image type="content" source="media/catalog-private-link/ping.png" alt-text="Screenshot that shows the test ping.":::

   :::image type="content" source="media/catalog-private-link/aadcdn-rule.png" alt-text="Screenshot that shows the Azure A D Content Delivery Network rule.":::

1. After the new rule is created, go back to the VM and try to sign in by using your Azure AD credentials again. If sign-in succeeds, then the Azure Purview portal is ready to use. But in some cases, Azure AD redirects to other domains to sign in based on a customer's account type. For example, for a live.com account, Azure AD redirects to live.com to sign in, and then those requests are blocked again. For Microsoft employee accounts, Azure AD accesses msft.sts.microsoft.com for sign-in information.

   Check the networking requests on the browser **Networking** tab to see which domain's requests are getting blocked, redo the previous step to get its IP, and add outbound port rules in the network security group to allow requests for that IP. If possible, add the URL and IP to the VM's host file to fix the DNS resolution. If you know the exact sign-in domain's IP ranges, you can also directly add them into networking rules.

1. Now your Azure AD sign-in should be successful. The Azure Purview portal will load successfully, but listing all the Azure Purview accounts won't work because it can only access a specific Azure Purview account. Enter `web.purview.azure.com/resource/{PurviewAccountName}` to directly visit the Azure Purview account that you successfully set up a private endpoint for.

## Deploy self-hosted integration runtime (IR) and scan your data sources.
Once you deploy ingestion private endpoints for your Azure Purview, you need to setup and register at least one self-hosted integration runtime (IR):

- All on-premises source types like Azure SQL Server, Oracle, SAP, and others are currently supported only via self-hosted IR-based scans. The self-hosted IR must run within your private network and then be peered with your virtual network in Azure. 
   
- For all Azure source types like Azure Blob Storage and Azure SQL Database, you must explicitly choose to run the scan by using a self-hosted integration runtime that is deployed in the same VNet as Azure Purview ingestion private endpoint. 

Follow the steps in [Create and manage a self-hosted integration runtime](manage-integration-runtimes.md) to set up a self-hosted IR. Then set up your scan on the Azure source by choosing that self-hosted IR in the **Connect via integration runtime** dropdown list to ensure network isolation.
    
   :::image type="content" source="media/catalog-private-link/shir-for-azure.png" alt-text="Screenshot that shows running an Azure scan by using self-hosted IR.":::

## Firewalls to restrict public access

To cut off access to the Azure Purview account completely from the public internet, follow these steps. This setting applies to both private endpoint and ingestion private endpoint connections.

1. Go to the Azure Purview account from the Azure portal, and under **Settings** > **Networking**, select **Private endpoint connections**.

1. Go to the **Firewall** tab, and ensure that the toggle is set to **Deny**.

   :::image type="content" source="media/catalog-private-link/private-endpoint-firewall.png" alt-text="Screenshot that shows private endpoint firewall settings.":::

## Next steps

-  [Review name resolution for private endpoints](./catalog-private-link-name-resolution.md)
-  [Manage data sources in Azure Purview](./manage-data-sources.md)
-  [Troubleshooting private endpoint configuration for your Azure Purview account](./catalog-private-link-troubleshooting.md)