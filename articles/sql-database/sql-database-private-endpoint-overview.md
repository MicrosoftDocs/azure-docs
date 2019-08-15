---
title: Private Link for Azure SQL Database and Data Warehouse  | Microsoft Docs
description: Overview of Private endpoint feature
author: rohitnayakmsft
ms.author: rohitna
ms.service: sql-database
ms.topic: overview 
ms.date: 08/07/2019
---

# What is Private Link?
Private Link allows you to connect to various PaaS services in Azure via a **private endpoint**. For a list to PaaS services that support Private Link functionality go to http://aka.ms/privatelink. A private endpoint is essentially a private IP address within a specific Vnet and Subnet. 

For Azure SQL Database, we have traditionally provided [network access controls](sql-database-networkaccess-overview.md) to limit the options for connecting via public endpoint. However these controls failed to properly address customers concerns around data exfiltration prevention and  on-premises connectivity via private peering.

## Data Exfiltration prevention
Data exfiltration - in context of Azure SQL Database - is when an authorized user e.g. database admin is able extract data from one system - SQL Database owned by their organization - and move it another location/system outside the organization e.g. SQL Database or storage account owned by a third party.

Let us consider a simple scenario with a user running SSMS inside Azure VM connecting to SQL Database in West US data center. Here is how we could use the current set of network access controls to tighten down access via public endpoints.

On Sql Database we shall disable all logins via the public endpoint by setting Allow Azure Services to  **OFF** and ensuring no IP addresses are whitelisted in the server and database level firewall rules. Next we shall specifically whitelist traffic using Private Ip address of the VM via Service Endpoint and Vnet Firewall rules.

Next on the Azure VM , we shall narrow down the scope of outgoing connection bys using Network Security Groups(NSGs) and Service Tags as follows
- Specify an NSG rule to allow traffic for  Service Tag = SQL.WestUs
- Specify an NSG rule to deny traffic for  Service Tag = SQL ( This will deny all other regions)

At the end of this setup, the Azure VM can connect only to SQL Database in the West US region. However. note that the connectivity is not restricted to a single SQL Database;rather it can connect to any SQL Database in the West US region ; including those that are not part of the subscription. Note that while we have reduced the scope of data exfiltration to a specific region, we have not eliminated it altogether. 

With Private Link, customers can now setup standard network access controls like NSGs to restrict access to the private endpoint. Individual Azure PaaS resources are mapped to specific private endpoints. Hence a malicious insider can only access the mapped PaaS resource () for example a SQL Database) and no other resource - thereby providing data exfiltration prevention capability

## On-premises connectivity over private peering
When customers connect to the public endpoint from on-premises machines, their IP address needs to be added to the IP based firewall via a [Server-level firewall rule](sql-database-server-level-firewall-rule.md). While this model works well for whitelisting individual machines for dev/test workloads, it is difficult to manage in a production environment. 
With Private Link, customers can enable cros-premises access to the private endpoint using ER private peering or VPN tunnel.They can subsequently disable all access via public endpoint and not use the IP based firewall to whitelist any IP addresses.


# How to setup Private Link for Azure SQL Database 
Describe the approval process and SoD for network admin ( create PE) vs database admin ( approve PE)
## Creation Process
*TBD Azure Networking docs TBD*
## Approval Process

## DNS configuration process
*TBD Azure Networking docs TBD*

# Use cases of Private Link for Azure SQL Database 
## Connect – From Azure VM 

## Connect – From Azure VM Peered Vnet

## Connect – From Azure VM Vnet2Vnet

## Connect – From on-premises over VPN

# Troubleshoot  Private Link for Azure SQL Database 
## Check Connectivity – Nmap 
## Check Connectivity - Telnet
## Check Connectivity – SSMS


<!---
After the intro, you can develop your overview by discussing the features that answer the "Why should I care" question with a bit more depth.
Be sure to call out any basic requirements and dependencies, as well as limitations or overhead.
Don't catalog every feature, and some may only need to be mentioned as available, without any discussion.
--->

<!---Suggested:
An effective way to structure you overview article is to create an H2 for the top customer tasks identified in milestone one of the [Content + Learning content model](contribute-get-started-mvc.md) and describe how the product/service helps customers with that task.
Create a new H2 for each task you list.
--->

## Next steps

<!---Some context for the following links goes here--->
- [link to next logical step for the customer](global-quickstart-template.md)

<!--- Required:
In Overview articles, provide at least one next step and no more than three.
Next steps in overview articles will often link to a quickstart.
Use regular links; do not use a blue box link. What you link to will depend on what is really a next step for the customer.
Do not use a "More info section" or a "Resources section" or a "See also section".
--->