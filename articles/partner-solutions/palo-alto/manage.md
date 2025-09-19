---
title: Manage a Cloud Next-Generation Firewall (NGFW) by Palo Alto Networks Resource by Using the Azure portal
description: Manage your Cloud NGFW resource in the Azure portal, including networking, NAT, rulestack settings, logging, Domain Name System (DNS) proxy configuration, and billing plan changes.
ms.topic: how-to
ms.date: 08/21/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-desc
  - ai-seo-date:12/09/2024
---

# Manage your Cloud NGFW by Palo Alto Networks resource by using the Azure portal

After you create your Cloud NGFW by Palo Alto Networks resource, you might need to get information about it or change its settings. 

## Resource overview 

[!INCLUDE [manage](../includes/manage.md)]

   :::image type="content" source="media/palo-alto-manage/palo-alto-overview.png" alt-text="Screenshot of the Cloud NGFW overview page." lightbox="media/palo-alto-manage/palo-alto-overview.png":::

You can view and change settings by selecting one of the following settings categories under **Settings** in the left pane:

- Networking & NAT
- Security Policies
- Log Settings
- DNS Proxy
- Rules
- Properties 
- Locks

## Networking & NAT

Select **Networking & NAT** under **Settings** in the left pane.
- In the **Networking** section, you can view networking settings. 
- To add prefixes to the private traffic range, select **Edit**, select the **Additional Prefixes** checkbox, and then add the prefixes in the resulting text box.
- In the **Source Network Address Translation (SNAT)** section, you can make changes by selecting the **Edit** button. You can then update the **Public IP Addresses**, select or clear the **Use the above Public IP addresses** checkbox, or update the **Source NAT Public IPs**. 
- In the **Destination Network Address Translation (DNAT)** section, you can make changes by selecting the **Edit** button. You can then add a frontend setting by selecting the **Add** button and providing a **Name**, **Protocol**, **Frontend IP**, **Frontend Port**, **Backend IP**, and **Backend Port**. You can also modify existing settings in this section. 
- In the **Private Source NAT** section, you can add a destination address by selecting the **Edit** button and then adding the address in the **Private Source NAT Destination Address** box. Private Source NAT replaces the source IP address with the trusted firewall IP address. 

## Security Policies

To view these settings, select **Security Policies** under **Settings** in the left pane.

The settings that you see on this tab depend on how your security policies are managed.

### Azure Rulestack

If your security policies are managed by an Azure rulestack, you see the settings described in this section. 

1. In **Local Rulestack**, select an existing rulestack from the dropdown list.
1. To manage settings for a rulestack, select the rulestack name under **Local Rulestack**. This action takes you to the local rulestack page. In the left pane, you see the following settings categories under **Resources**:
   - Rules
   - Security Services
   - Prefix List
   - FDQN List
   - Certificates
   - Deployment
   - Managed Identity 

#### Rules

Select **Rules** under **Resources** in the left pane of the local rulestack page. A page appears that shows local rules and allows you to add, delete, and configure them. 
   - To edit a rule, select the checkbox next to it and then select **Edit**. A pane showing the configured parameters for the rule appears. You can edit the parameters. 
   - To add a rule, select **Add**. A pane that allows you to configure and validate the parameters appears. 
   - To delete a rule, select the checkbox next to it and then select **Delete**. 

#### Security Services

Select **Security Services** under **Resources** in the left pane of the local rulestack page. 
   - Under **Advanced Threat Prevention**, you can enable, disable, and configure vulnerability protection, anti-spyware, antivirus, and file blocking profiles.  
   - Under **Advanced URL Filtering**, you can enable, disable, and configure URL access management profiles. 
   - Under **DNS Security**, you can enable, disable, and configure DNS security profiles. 
   - Under **Encrypted Threat Protection**, you can manage egress decryption settings.

#### Prefix List

 Select **Prefix List** under **Resources** in the left pane of the local rulestack page. A page appears that shows prefixes and allows you to add, delete, and configure them.
   - To edit a prefix, select the checkbox next to it and then select **Edit**. A pane showing the name, description, and address of the prefix appears. You can edit and validate the configuration.
   - To add a prefix, select the **Add** button. A pane that allows you to enter a name, description, and address appears. You can also validate the parameters. 
   - To delete a prefix, select the checkbox next to it and then select **Delete**.

#### FQDN List 

Select **FQDN List** under **Resources** in the left pane of the local rulestack page. A page appears that slows FQDNs and allows you to add, delete, and configure them. 
   - To edit an FQDN, select the checkbox next to it and then select **Edit**. A pane showing the configured name, description, and FQDN appears. You can edit and validate the configuration. 
   - To add an FQDN, select the **Add** button. A pane that allows you to enter a name, description, and FQDN appears. You can also validate the parameters. 
   - To delete an FQDN, select the checkbox next to it and then select **Delete**.

#### Certificates

Select **Certificates** under **Resources** in the left pane of the local rulestack page. A page appears that shows certificates and allows you to add, delete, and configure them. 
   - To add a certificate, select the **Add** button. A pane that allows you to configure the certificate appears. You can select the certificate from a key vault or paste in a URL. You can also add self-signed certificates. 
   - To edit a certificate, select the checkbox next to it and then select **Edit**. You can edit and validate the configuration.
   - To delete a certificate, select the checkbox next to it and then select **Delete**. 
 
#### Deployment

Select **Deployment** under **Resources** in the left pane of the local rulestack page. 
   - On the **Deployment** page, select **Deploy Configuration** to deploy changes that you made to the rulestack. 
   - Select **Revert** to remove all changes made since the last deployed configuration.

#### Managed Identity

1. Select **Managed Identity** under **Resources** in the left pane of the local rulestack page. 
1. On the **Managed Identity** page, you can enable or disable managed identity. 
   - To enable managed identity, select **Enable MI** and then select an identity in the **Identity** list. 
   - To disable managed identity, clear the **Enable MI** checkbox. 

### Strata Cloud Manager

If your security policies are managed by Strata Cloud Manager, you can view the **SCM Tenant ID** on the **Security Policies** tab.   

### Panorama

If your security policies are managed by Panorama, you can change the **Panorama Registration String** on the **Security Policies** tab.

You can also view the following setting on this tab: 

- Panorama IP 1
- Panorama IP 2
- Device Group
- Template Name

## Log Settings

1. Select **Log Settings** under **Settings** in the left pane.
1. Select **Edit** to enable **Log Settings**.
1. Select the **Enable Log Settings** checkbox.
1. In **Log Settings**, select the settings.

## DNS Proxy

1. Select **DNS Proxy** under **Settings** the left pane.
1. You can enable or disable **DNS Proxy** by selecting the appropriate option. 

## Rules

1. Select **Rules** under **Settings** in the left pane.
1. You can view a list of existing rules on the **Rules** page. You can also search for rules. 
1. To view configured parameters for a rule, double-click the rule. 

> [!NOTE]
> If your security policies are managed by Panorama, your rules won't appear on this tab. You can view them in Panorama. 

## Properties 

1. Select **Properties** under **Settings** in the left pane.
1. On the **Properties** page, you can view various properties of the firewall, including essentials like the ID, name, and location, the network profile, DNS settings, and plan data. 

## Locks

1. Select **Locks** under **Settings** in the left pane.
1. On the **Locks** page, you can view a list of locks. 
    - To edit a lock, select the **Edit** button next to the lock. You can also delete a lock. 
    - To add a lock, select **Add** and then enter a **Lock name**, **Lock type**, and, optionally, **Notes**. 

## Change plan

To change the Cloud NGFW's billing plan, select **Overview** in the left pane and then select **Change Plan**.

## Delete a resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

> [!NOTE]
> The **Delete** button on the resource is activated only if all connected resources are already deleted. For more information, see [Azure Resource Manager resource group and resource deletion](/azure/azure-resource-manager/management/delete-resource-group).

## Get support

Contact [Palo Alto Network](https://support.paloaltonetworks.com/Support/Index) for customer support.

You can also request support in the Azure portal from the [resource overview](#resource-overview).

Select **Support + Troubleshooting** > **New support request** from the service menu, then choose the link to [Contact PAN customer support](https://support.paloaltonetworks.com/Support/Index). 

## Related content

- [Azure Virtual Network FAQ](../../virtual-network/virtual-networks-faq.md)
- [Virtual WAN FAQ](../../virtual-wan/virtual-wan-faq.md)



