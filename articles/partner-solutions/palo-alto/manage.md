---
title: Manage a Cloud Next-Generation Firewall (NGFW) by Palo Alto Networks Resource by Using the Azure Portal
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

1. Select **Networking & NAT** under **Settings** in the left pane.
1. In the **Networking** section, you can view networking settings. 
1. To add prefixes to the private traffic range, select **Edit**, select the **Additional Prefixes** checkbox, and then add the prefixes in the resulting text box.
1. In the **Source Network Address Translation (SNAT)** section, you can make changes by selecting the **Edit** button. You can then update the **Public IP Addresses**, select or clear the **Use the above Public IP addresses** checkbox, or update the **Source NAT Public IPs**. 
1. In the **Destination Network Address Translation (DNAT)** section, you can make changes by selecting the **Edit** button. You can then add a frontend setting by selecting the **Add** button and providing a **Name**, **Protocol**, **Frontend IP**, **Frontend Port**, **Backend IP**, and **Backend Port**. You can also modify existing settings in this section. 
1. In the **Private Source NAT** section, you can add a destination address by selecting the **Edit** button and then adding the address in the **Private Source NAT Destination Address** box. Private Source NAT replaces the source IP address with the trusted firewall IP address. 

## Security Policies

1. Select **Security Policies** under **Settings** in the left pane.
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

1. Select **Rules** under **Resources** in the left pane of the local rulestack page. A page appears that shows local rules and allows you to add, delete, and configure them. 
1. To edit a rule, select the checkbox next to it and then select **Edit**. A pane showing the configured parameters for the rule appears. You can edit the parameters. 
1. To add a rule, select **Add**. A pane that allows you to configure and validate the parameters appears. 
1. To delete a rule, select the checkbox next to it and then select **Delete**. 

#### Security Services

1. Select **Security Services** under **Resources** in the left pane of the local rulestack page. 
1. Under **Advanced Threat Prevention**, you can enable, disable, and configure vulnerability protection, anti-spyware, antivirus, and file blocking profiles.  
1. Under **Advanced URL Filtering**, you can enable, disable, and configure URL access management profiles. 
1. Under **DNS Security**, you can enable, disable, and configure DNS security profiles. 
1. Under **Encrypted Threat Protection**, you can manage egress decryption settings.

#### Prefix List

1. Select **Prefix List** under **Resources** in the left pane of the local rulestack page. A page appears that shows prefixes and allows you to add, delete, and configure them.
1. To edit a prefix, select the checkbox next to it and then select **Edit**. A pane showing the name, description, and address of the prefix appears. You can edit and validate the configuration.
1. To add a prefix, select the **Add** button. A pane that allows you to enter a name, description, and address appears. You can also validate the parameters. 
1. To delete a prefix, select the checkbox next to it and then select **Delete**.

#### FQDN List 

1. Select **FQDN List** under **Resources** in the left pane of the local rulestack page. A page appears that slows FQDNs and allows you to add, delete, and configure them. 
1. To edit an FQDN, select the checkbox next to it and then select **Edit**. A pane showing the configured name, description, and FQDN appears. You can edit and validate the configuration. 
1. To add an FQDN, select the **Add** button. A pane that allows you to enter a name, description, and FQDN appears. You can also validate the parameters. 
1. To delete an FQDN, select the checkbox next to it and then select **Delete**.

#### Certificates

1. Select **Certificates** under **Resources** in the left pane of the local rulestack page. A page appears that shows certificates and allows you to add, delete, and configure them. 
1. To edit a certificate, select the checkbox next to it then select **Edit**. A pane that shows the current configuration appears. Edit the values as needed. 
1.  To add a certificate, select the **Add** button. A pane that allows you to configure the certificate appears. You can select the certificate from a key vault or paste in a URL. You can also add self-signed certificates. 
1. To edit a certificate, select the checkbox next to it and then select **Edit**. You can edit and validate the configuration.
1. To delete a certificate, select the checkbox next to it and then select **Delete**. 
 
#### Deployment

1. Select **Deployment** under **Resources** in the left pane of the local rulestack page. 
1. On the **Deployment** page, select **Deploy Configuration** to deploy changes that you made to the rulesack. 
1. Select **Revert** to remove all changes made since the last deployed configuration.

#### Managed Identity

1. Select **Managed Identity** under **Resources** in the left pane of the local rulestack page. 
1. On the **Managed Identity** page, you can enable or disable managed identity. 
1. To enable managed identity, select **Enable MI** and then select an identity in the **Identity** list. 
1. To disable managed identity, clear the **Enable MI** checkbox. 

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

## Properties 

1. Select **Properties** under **Settings** in the left pane.
1. On the **Properties** page, you can view various properties of the firewall, including essentials like the ID, name, and location, the network profile, the associated rulestack, DNS settings, and plan data. 

## Locks

1. Select **Locks** under **Settings** in the left pane.
1. On the **Locks** page, you can view a list of locks. 
1. To edit a lock, select the **Edit** button next to the lock. You can also delete a lock. 
1. To add a lock, select **Add** and then enter a **Lock name**, **Lock type**, and, optionally, **Notes**. 

## Change plan

To change the Cloud NGFW's billing plan, select **Overview** in the left pane and then select **Change Plan**.

## Delete a resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

> [!NOTE]
> The **Delete** button on the resource is activated only if all connected resources are already deleted. For more information, see [Azure Resource Manager resource group and resource deletion](/azure/azure-resource-manager/management/delete-resource-group).

## Related content

- [Azure Virtual Network FAQ](../../virtual-network/virtual-networks-faq.md)
- [Virtual WAN FAQ](../../virtual-wan/virtual-wan-faq.md)


