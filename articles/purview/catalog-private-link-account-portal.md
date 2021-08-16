---
title: Connect to your Purview account from restricted network
description: This article describes how you can set up a private endpoint to connect to your Purview account from restricted network.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/16/2021
# Customer intent: As an Azure Purview admin, I want to set up private endpoints for my Azure Purview account for secure access.
---

# Connect to your Azure Purview account from restricted network
In this guide, you will learn how to deploy private endpoints for your Purview account to allow you connecting to your Azure Purview account and scan data sources only from restricted network. To achieve this goal, you need to deploy an _account_, a _portal_ and _ingestion_ private endpoints for your Azure Purview account.

The Azure Purview _account_ private endpoint is used to add another layer of security by enabling scenarios where only client calls that originate from within the virtual network are allowed to access the Azure Purview account. This private endpoint is also a prerequisite for the portal private endpoint.

The Azure Purview _portal_ private endpoint is required to enable connectivity to Azure Purview Studio using a private network.

   :::image type="content" source="media/catalog-private-link/purview-private-link-account-portal.png" alt-text="Diagram that shows Azure Purview and Private Link architecture.":::

For more information about Azure Private Link service, see [private links and private endpoints](../../private-link/index.yml) to learn more.

## Deployment checklist
Using the one of the deployment options from this guide, you can deploy a new Azure Purview account with _account_ and _portal_ private endpoints or you can choose to deploy these private endpoints for an existing Azure Purview account:

1. Before you start this guide, choose an appropriate Azure virtual network and a subnet to deploy Azure Purview private endpoints:
   - Deploy a [new virtual network](../virtual-network/quick-create-portal.md) in your Azure subscription.
   - Locate an existing Azure virtual network and a subnet in your Azure subscription.
  
2. Define an appropriate [DNS name resolution method](./catalog-private-link-name-resolution.md) so Azure Purview account and web portal can be accessible through private IP addresses. You can use any of the following options:
   - Deploy new Azure DNS zones using the steps explained further in this guide.
   - Add required DNS records to existing Azure DNS zones using the steps explained further in this guide.
   - After completing the steps in this guide, add required DNS A records in your existing DNS servers manually.
3. Deploy a [new Purview account](#option-1---deploy-a-new-azure-purview-account-with-account-and-portal-private-endpoints) with account and portal private endpoints, or deploy account and portal private endpoints for an [existing Purview account](#option-2---enable-account-and-portal-private-endpoint-on-existing-azure-purview-accounts).
4. [Enable access to Azure Active Directory](#enable-access-to-azure-active-directory) if your private network has network security group rules set to deny for all public internet traffic.
5. After completing this guide, adjust DNS configurations if needed.
6. Validate your network and name resolution from management machine to Azure Purview. 

## Option 1 - Deploy a new Azure Purview account with _account_ and _portal_ private endpoints

1. Go to the [Azure portal](https://portal.azure.com), and then go to the **Purview accounts** page. Select **+ Create** to create a new Azure Purview account.

2. Fill in the basic information, and on the **Networking** tab, set the connectivity method to **Private endpoint**. Set enable private endpoint to **Account and Portal only**.

3. Under **Account and portal** select **+ Add** to add a private endpoint for your Azure Purview account.

4. On the **Create a private endpoint** page, for **Purview sub-resource**, choose your location, provide a name for _account_ private endpoint and select **account**. Under **networking**, select your virtual network and subnet, and optionally, select **Integrate with private DNS zone** to create a new Azure Private DNS zone. 

   > [!NOTE]
   > You can also use your existing Azure Private DNS Zones or create DNS records in your DNS Servers manually later. For more information, see [Configure DNS Name Resolution for private endpoints](./catalog-private-link-name-resolution.md)

   :::image type="content" source="media/catalog-private-link/create-pe-account.png" alt-text="Screenshot that shows Create private endpoint page selections.":::

5. Select **OK**.
   
6. In **Create Purview account** wizard, select **+Add** again to add _portal_ private endpoint.
     
7. On the **Create a private endpoint** page, for **Purview sub-resource**,choose your location, provide a name for _portal_ private endpoint and select **portal**. Under **networking**, select your virtual network and subnet, and optionally, select **Integrate with private DNS zone** to create a new Azure Private DNS zone. 
   
   > [!NOTE]
   > You can also use your existing Azure Private DNS Zones or create DNS records in your DNS Servers manually later. For more information, see [Configure DNS Name Resolution for private endpoints](./catalog-private-link-name-resolution.md)

   :::image type="content" source="media/catalog-private-link/create-pe-portal.png" alt-text="Screenshot that shows Create private endpoint page selections.":::

8.  Select **OK**.
   
9.  Select **Review + Create**. On the **Review + Create** page, Azure validates your configuration.

10. When you see the "Validation passed" message, select **Create**.

    :::image type="content" source="media/catalog-private-link/validation-passed.png" alt-text="Screenshot that shows that validation passed for account creation.":::

## Option 2 - Enable _account_ and _portal_ private endpoint on existing Azure Purview accounts

There are two ways you can add Azure Purview _account_ and _portal_ private endpoints for an existing Azure Purview account:

- Use the Azure portal (Azure Purview account).
- Use the Private Link Center.

### Use the Azure portal (Azure Purview account)

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

### Use the Private Link Center

1. Go to the [Azure portal](https://portal.azure.com).

1. In the search bar at the top of the page, search for **private link** and go to the **Private Link** pane by selecting the first option.

1. Select **+ Add**, and fill in the basic details.

   :::image type="content" source="media/catalog-private-link/private-link-center.png" alt-text="Screenshot that shows creating private endpoints from the Private Link Center.":::

1. For **Resource**, select the already created Azure Purview account. For **Target sub-resource**, select **account**.

1. On the **Configuration** tab, select the virtual network and private DNS zone. Go to the summary page, and select **Create** to create the account private endpoint.

> [!NOTE]
> Follow the same steps when you select **portal** for **Target sub-resource**.

## Enable access to Azure Active Directory

> [!NOTE]
> If your VM, VPN gateway, or VNet Peering gateway has public internet access, it can access the Azure Purview portal and the Azure Purview account enabled with private endpoints. For this reason, you don't have to follow the rest of the instructions. If your private network has network security group rules set to deny all public internet traffic, you'll need to add some rules to enable Azure Active Directory (Azure AD) access. Follow the instructions to do so.

These instructions are provided for accessing Azure Purview securely from an Azure VM. Similar steps must be followed if you're using VPN or other VNet Peering gateways.

1. Go to your VM in the Azure portal, and under **Settings**, select **Networking**. Then select **Outbound port rules**, **Add outbound port rule**.

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

## Next steps

-  [Review name resolution for private endpoints](./catalog-private-link-name-resolution.md)
-  [Manage data sources in Azure Purview](./manage-data-sources.md)
-  [Troubleshooting private endpoint configuration for your Azure Purview account](./catalog-private-link-troubleshooting.md)