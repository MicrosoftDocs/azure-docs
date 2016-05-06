<properties
   pageTitle="Create a record set and records for a DNS Zone using the Azure portal | Microsoft Azure"
   description="How to create host records for Azure DNS and create record sets and records using the Azure portal"
   services="dns"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/06/2016"
   ms.author="cherylmc"/>



# Create DNS record sets and records using the Azure Portal


> [AZURE.SELECTOR]
- [Azure Portal](dns-getstarted-create-recordset-portal.md)
- [PowerShell](dns-getstarted-create-recordset.md)
- [Azure CLI](dns-getstarted-create-recordset-cli.md)


This article will walk you through creating records and records sets by using the Azure Portal. After creating your DNS Zone, you need to add the DNS records for your domain. To do this, you'll first need to understand DNS records and record sets.

[AZURE.INCLUDE [dns-about-records-include](../../includes/dns-about-records-include.md)] 


## Create a record set and a record

The following example will walk you through how to create a record set and records by using the Azure portal. We'll use the DNS 'A' record type.

1. Log in to the Azure portal.

2. Navigate to the **DNS zone** blade in which you want to create a record set.

3. In your DNS zone blade, at the top of the blade click **Record set** to open the **Add record set** blade. 
 
	![new record set](./media/dns-getstarted-create-recordset-portal/newrecordset500.png)

4. In the **Add record set** blade, name your records set. For example, you could name your record set "**www**".
  
	![add record set](./media/dns-getstarted-create-recordset-portal/addrecordset500.png)

5. Type, select the type of record you want to create. For example, **A**.

6. Set the **TTL**. The default in the portal is 1 hour.

7. Add the IP addresses, one IP address per line. Using the suggested record set name and record type from above, this adds the IPv4 IP addresses to the A record for the www record set.

8. When you have finished added IP addresses, click **OK** at the bottom of the blade. The DNS record set will be created.


## Next steps

To manage your record set and records, see [Manage DNS records and record sets using the Azure portal](dns-operations-recordsets-portal.md).

For more information about Azure DNS, see the [Azure DNS Overview](dns-overview.md).