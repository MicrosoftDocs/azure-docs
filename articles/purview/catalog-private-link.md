---
title: Use private endpoints for secure access to Purview
description: This article describes how you can set up a private end point for your Purview account
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 03/02/2021
# Customer intent: As a Purview admin, I want to set up private endpoints for my Purview account, for secure access.
---

# Use private endpoints for your Purview account

You can use private endpoints for your Purview accounts to allow clients and users on a virtual network (VNet) to securely access the catalog over a Private Link. The private endpoint uses an IP address from the VNet address space for your Purview account. Network traffic between the clients on the VNet and the Purview account traverses over the VNet and a private link on the Microsoft backbone network, eliminating exposure from the public internet.

## Create Purview account with a Private Endpoint

1. Navigate to the [Azure portal](https://portal.azure.com) and then to your Purview account.

1. Fill basic information, and set connectivity method to Private endpoint in **Networking** tab. Set up your ingestion private endpoints by providing details of **Subscription, Vnet and Subnet** that you want to pair with your private endpoint.

    :::image type="content" source="media/catalog-private-link/create-pe-azure-portal.png" alt-text="Create a Private Endpoint in the Azure portal":::

1. You can also optionally choose to set up a **Private DNS zone** for each ingestion private endpoint.

1. Click Add to add a private endpoint for your Purview account.

1. In the Create private endpoint page, set Purview sub-resource to **account**, choose your virtual network and subnet, and select the Private DNS Zone where the DNS will be registered (you can also utilize your won DNS servers or create DNS records using host files on your virtual machines).

    :::image type="content" source="media/catalog-private-link/create-pe-account.png" alt-text="Private Endpoint creation selections":::

1. Select **OK**.

1. Select **Review + create**. You're taken to the Review + create page where Azure validates your configuration.

1. When you see the Validation passed message, select **Create**.

    :::image type="content" source="media/catalog-private-link/validation-passed.png" alt-text="Validation passed for account creation":::

## Create a private endpoint for the Purview web portal

1. Navigate to the Purview account you just created, select the Private endpoint connections under the Settings section.

1. Click +Private endpoint to create a new private endpoint.

    :::image type="content" source="media/catalog-private-link/pe-portal.png" alt-text="Create portal private endpoint":::

1. Fill in basic information.

1. In Resource tab, select Resource type to be **Microsoft.Purview/accounts**.

1. Select the Resource to be the newly created Purview account and select target sub-resource to be **portal**.
    :::image type="content" source="media/catalog-private-link/pe-portal-details.png" alt-text="Details for portal private endpoint":::

1. Select the virtual network and Private DNS Zone in the Configuration tab. Navigate to the summary page, and click **Create** to create the portal private endpoint.

## Enabling access to Azure Active Directory

> [!NOTE]
> If your VM, VPN gateway or VNET peering gateway has public internet access, it can access Purview portal and Purview account enabled with Private endpoints, and you do not have to follow the rest of the instructions below. If your private network has network security group rules set to deny all public Internet traffic, you will need to add some rules to enable AAD access. Please follow instructions below to do so.

The instructions below are for accessing Purview securely from an Azure VM. Similar steps need to be followed if you are using VPN or other Vnet peering gateways.

1. Navigate to your VM in the Azure portal, select Networking tab under Settings section. Then Select Outbound port rules and click Add outbound port rule.

   :::image type="content" source="media/catalog-private-link/outbound-rule-add.png" alt-text="Adding outbound rule":::

2. In Add outbound port rule blade, select *Destination* to be Service Tag, Destination service tag to be **AzureActiveDirectory**, Destination port ranges to be *, Action to be allow, **Priority should be higher than the rule that denied all Internet traffic**. Create the rule.

   :::image type="content" source="media/catalog-private-link/outbound-rule-details.png" alt-text="Adding outbound rule details":::

3. Follow the same steps to create another rule to allow '**AzureResourceManager**' service tag. If you need to access the Azure portal, you can also add a rule for '*AzurePortal*' service tag.

4. Connect to the VM, open the browser, navigate to the browser console (Ctrl + Shift + J) and switch to the network tab to monitor network requests. Enter web.purview.azure.com in the url box and try to login using your AAD credentials. Login may probably fail and in the network tab on the console you can see AAD trying to access aadcdn.msauth.net but getting blocked.

   :::image type="content" source="media/catalog-private-link/login-fail.png" alt-text="Login fail details":::

5. In this case, open a Command prompt on the VM and ping this url (aadcdn.msauth.net), get its IP, and then add an outbound port rule for the IP in VM's network security rules. Set the Destination to IP Address and set Destination IP addresses to aadcdn's IP. Due to load balancer and traffic manager, AAD CDN's IP might be dynamic. Once you get its IP, it's better to add it into VM's host file to force browser to visit that IP to get AAD CDN.

   :::image type="content" source="media/catalog-private-link/ping.png" alt-text="Test ping":::

   :::image type="content" source="media/catalog-private-link/aadcdn-rule.png" alt-text="AAD CDN rule":::

6. Once the new rule is created, navigate back to the VM and try logging in using your AAD credentials again. If the login succeeds, then Purview portal is ready to use. But in some cases, AAD will redirect to other domains to login based on customer's account type. For e.g. for a live.com account, AAD will redirect to live.com to login, then those requests would be blocked again. For Microsoft employee accounts, AAD will access msft.sts.microsoft.com for login information. Check the networking requests in browser networking tab to see which domain's requests are getting blocked, redo the previous step to get its IP and add outbound port rules in network security group to allow requests for that IP (if possible, add the url and IP to VM's host file to fix the DNS resolution). If you know the exact login domain's IP ranges, you can also directly add them into networking rules.

7. Now login to AAD should be successful. Purview Portal will load successfully but listing all Purview accounts won't work since it can only access a specific Purview account. Enter *web.purview.azure.com/resource/{PurviewAccountName}* to directly visit the Purview account that you successfully set up a private endpoint for.

## Enable private endpoint on existing Purview accounts

There are 2 ways you can add Purview private endpoints after creating your Purview account:

- Using the Azure portal (Purview account)
- Using the Private link center

### Using the Azure portal (Purview account)

1. Navigate to the Purview account from the Azure portal, select the Private endpoint connections under the **networking** section of **Settings**.

:::image type="content" source="media/catalog-private-link/pe-portal.png" alt-text="Create portal private endpoint":::

1. Click +Private endpoint to create a new private endpoint.

1. Fill in basic information.

1. In Resource tab, select Resource type to be **Microsoft.Purview/accounts**.

1. Select the Resource to be the Purview account and select target sub-resource to be **account**.

1. Select the **virtual network** and **Private DNS Zone** in the Configuration tab. Navigate to the summary page, and click **Create** to create the portal private endpoint.

> [!NOTE]
> You will need to follow the same steps as above for the target sub-resource selected as **Portal** as well.

### Using the Private link center

1. Navigate to the [Azure portal](https://portal.azure.com).

2. In the search bar at the top of the page, search for 'private link' and navigate to the private link blade by clicking on the first option.

3. Click on '+ Add' and fill in the basic details.

   :::image type="content" source="media/catalog-private-link/private-link-center.png" alt-text="Create PE from private link center":::

4. Select the Resource to be the already created Purview account and select target sub-resource to be **account**.

5. Select the virtual network and Private DNS Zone in the Configuration tab. Navigate to the summary page, and click **Create** to create the account private endpoint.

> [!NOTE]
> You will need to follow the same steps as above for the target sub-resource selected as **Portal** as well.

## Next steps

- [Browse the Azure Purview Data Catalog](how-to-browse-catalog.md)

- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
