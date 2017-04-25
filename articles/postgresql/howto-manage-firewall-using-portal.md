---
title: postgresql-howto-manage-firewall-using-portal | Microsoft Docs
description: Describes server-level firewall rules enable administrators to access an Azure Database for PostgreSQL Server from a specified IP address or range of IP addresses.
keywords: azure cloud postgresql postgres
services: postgresql
author:
ms.author:
manager: jhubbard
editor: jasonh

ms.assetid:
ms.service: postgresql - database
ms.tgt_pltfrm: portal
ms.topic: hero - article
ms.date: 04/30/2017
---
# Create and manage Azure Database for PostgreSQL firewall rules using the Azure portal
Server-level firewall rules enable administrators to access an Azure Database for PostgreSQL Server from a specified IP address or range of IP addresses. For an overview of Azure Database for PostgreSQL firewalls, see <TBD: Azure Database for PostgreSQL[>](file:///C:/Users/jasonh.NORTHAMERICA/AppData/Roaming/Microsoft/Word/tbd)
<Use an Include for this section, since it will be reused elsewhere>

## Create a server-level firewall rule in the Azure portal
1. On the PostgreSQL server blade, under Settings heading, click ****Connection Security**** to open the Connection Security blade for the Azure Database for PostgreSQL.

![](./media/postgresql-howto-manage-firewall-using-portal/1_connection-security.png)

2. Click **Add My IP** on the toolbar. This will create a rule automatically with the IP address of your computer, as perceived by the Azure system.

![](./media/postgresql-howto-manage-firewall-using-portal/2_add-my-ip.png)

3. Verify your IP address before saving the configuration. In some situations, the IP address observed by Azure portal differs from the IP address used when accessing the internet and Azure servers. Therefore, you may need to change the Start IP and End IP to make the rule function as expected.
Use a search engine or other online tool to check your own IP address (for example, search "what is my IP address").

![](./media/postgresql-howto-manage-firewall-using-portal/3_what-is-my-ip.png)

4. Click **Save** on the toolbar to save this server-level firewall rule. Wait for the confirmation that the update to the firewall rules was successful.

![](./media/postgresql-howto-manage-firewall-using-portal/4_save-firewall-rule.png)

>[!NOTE]
>In the rules for the Azure Database for PostgreSQL firewall, you can specify a single IP address, or a range of addresses. If you want to limit the rule to one single IP address, type the same address in the field for Start IP and End IP. Opening the firewall enables administrators and users to login to any database on the PostgreSQL server to which they have valid credentials.

![](./media/postgresql-howto-manage-firewall-using-portal/5_specify-addresses.png)

## Manage existing server-level firewall rules through the Azure portal
Repeat the steps to manage the firewall rules.
* To add the current computer, click + Add My IP.
* To add additional IP addresses, type in the Rule Name, Start IP Address, and End IP Address.
* To modify an existing rule, click any of the fields in the rule and modify.
* To delete an existing rule, click the ellipsis […] and click Delete remove the rule.
* Click **Save** to save the changes.

## Adding Azure Addresses
Currently, there is no option to switch to allow access from other Azure services to the Azure Database for PostgreSQL server.
One manual approach is to download the list of IP addresses for the Azure Services, and review that list to know which data center is connecting, and create firewall rules for those IP ranges. See the list of [Microsoft Azure Datacenter IP Ranges](https://www.microsoft.com/en-us/download/details.aspx?id=41653)
Another approach is to deploy the Azure Database for PostgreSQL Server using an ARM Template, which includes all the necessary firewall rules included to open the system to other Azure services.

## Next steps
- For a tutorial provisioning and connecting to an Azure Database for PostgreSQL server using server-level firewalls, see \[Tutorial\] TBD
- For help in connecting to an Azure Database for PostgreSQL server, see [Connectivity] TBD

## Additional resources

* [Securing your Azure Database for PostgreSQL]

