---
title: Get started with Azure DNS using the Azure portal | Microsoft Docs
description: Learn how to create a DNS zone and record in Azure DNS. This is a step-by-step guide to create and manage your first DNS zone and record using the Azure portal.
services: dns
documentationcenter: na
author: jtuliani
manager: timlt
editor: ''
tags: azure-resource-manager
---
title: Get started with Azure DNS using Azure CLI 1.0 | Microsoft Docs
description: Learn how to create a DNS zone and record in Azure DNS. This is a step-by-step guide to create and manage your first DNS zone and record using the Azure CLI 1.0.
services: dns
documentationcenter: na
author: jtuliani
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: fb0aa0a6-d096-4d6a-b2f6-eda1c64f6182
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/03/2017
ms.author: jonatul
---

# Get started with Azure DNS using Azure CLI 1.0

> [!div class="op_single_selector"]
> * [Azure portal](dns-getstarted-portal.md)
> * [PowerShell](dns-getstarted-powershell.md)
> * [Azure CLI 1.0](dns-getstarted-cli-nodejs.md)
> * [Azure CLI 2.0](dns-getstarted-cli.md)

This article walks you through the steps to create your first DNS zone and record using the cross-platform Azure CLI 1.0, which is available for Windows, Mac and Linux. You can also perform these steps using the Azure portal or Azure PowerShell.

A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS record for your domain is then created inside this DNS zone. Finally, to publish your DNS zone to the Internet, you need to configure the name servers for the domain. Each of these steps is described below.

These instructions assume you have already installed and signed in to Azure CLI 1.0. If not, see [How to manage DNS zones using Azure CLI 1.0](dns-operations-dnszones-cli-nodejs.md).


## Create a DNS zone

A DNS zone is created using the `azure network dns zone create` command. To see help for this command, type `azure network dns zone create -h`.

The following example creates a DNS zone called *contoso.com* in the resource group called *MyResourceGroup*. Use the example to create a DNS zone, substituting the values for your own.

```azurecli
azure network dns zone create MyResourceGroup contoso.com
```


## Create a DNS record

To create a DNS record, use the `azure network dns record-set add-record` command. For help, see `azure network dns record-set add-record -h`.

The following example creates a record with the relative name "www" in the DNS Zone "contoso.com", in resource group "MyResourceGroup". The fully-qualified name of the record set is "www.contoso.com". The record type is "A", with IP address "1.2.3.4", and a default TTL of 3600 seconds (1 hour) is used.

```azurecli
azure network dns record-set add-record MyResourceGroup contoso.com www A -a 1.2.3.4
```

For other record types, for record sets with more than one record, for alternative TTL values, and to modify existing records, see [Manage DNS records and record sets using the Azure CLI 1.0](dns-operations-recordsets-cli-nodejs.md).


## View records

To list the DNS records in your zone, use:

```azurecli
azure network dns record-set list MyResourceGroup contoso.com
```


## Update name servers

Once you are satisfied that your DNS zone and records have been set up correctly in Azure DNS, you need to configure your domain name to use the Azure DNS name servers. This enables other users on the Internet to find your DNS records.

The name servers for your zone are given by the `azure network dns zone show` command:

```azurecli
azure network dns zone show MyResourceGroup contoso.com

info:    Executing command network dns zone show
+ Looking up the dns zone "contoso.com"
data:    Id                              : /subscriptions/a385a691-bd93-41b0-8084-8213ebc5bff7/resourceGroups/myresourcegroup/providers/Microsoft.Network/dnszones/contoso.com
data:    Name                            : contoso.com
data:    Type                            : Microsoft.Network/dnszones
data:    Location                        : global
data:    Number of record sets           : 3
data:    Max number of record sets       : 5000
data:    Name servers:
data:        **ns1-01.azure-dns.com.**
data:        **ns2-01.azure-dns.net.**
data:        **ns3-01.azure-dns.org.**
data:        **ns4-01.azure-dns.info.**
data:    Tags                            :
info:    network dns zone show command OK
```

These name servers need to be configured with the domain name registrar (where you purchased the domain name). Your registrar will offer the option to set up the name servers for the domain. For more information, see [delegate your domain to Azure DNS](dns-domain-delegation.md).


## Next steps

To learn more about Azure DNS, see [Azure DNS overview](dns-overview.md).

To learn more about managing DNS zones in Azure DNS, see [manage DNS zones in Azure DNS using Azure CLI 1.0](dns-operations-dnszones-cli-nodejs.md).

To learn more about managing DNS records in Azure DNS, see [manage DNS records and record sets in Azure DNS using Azure CLI 1.0](dns-operations-recordsets-cli-nodejs.md).

ms.assetid: fb0aa0a6-d096-4d6a-b2f6-eda1c64f6182
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/03/2017
ms.author: jonatul
---

# Create a DNS zone in the Azure portal

> [!div class="op_single_selector"]
> * [Azure portal](dns-getstarted-portal.md)
> * [PowerShell](dns-getstarted-powershell.md)
> * [Azure CLI 1.0](dns-getstarted-cli-nodejs.md)
> * [Azure CLI 2.0](dns-getstarted-cli.md)

This article walks you through the steps to create your first DNS zone and record using the Azure portal. You can also perform these steps using Azure PowerShell or the cross-platform Azure CLI.

A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS record for your domain is then created inside this DNS zone. Finally, to publish your DNS zone to the Internet, you need to configure the name servers for the domain. Each of these steps is described below.

## Create a DNS zone

1. Sign in to the Azure portal
2. On the Hub menu, click and click **New > Networking >** and then click **DNS zone** to open the Create DNS zone blade.

    ![DNS zone](./media/dns-getstarted-portal/openzone650.png)

4. On the **Create DNS zone** blade, Name your DNS zone. For example, *contoso.com*.
 
    ![Create zone](./media/dns-getstarted-portal/newzone250.png)

5. Next, specify the resource group that you want to use. You can either create a new resource group, or select one that already exists. If you choose to create a new resource group, use the **Location** dropdown to specify the location of the resource group. Note that this setting refers to the location of the resource group, and has no impact on the DNS zone. The DNS zone location is always "global", and is not shown.

6. You can leave the **Pin to dashboard** checkbox selected if you want to easily locate your new zone on your dashboard. Then click **Create**.

    ![Pin to dashboard](./media/dns-getstarted-portal/pindashboard150.png)

7. After you click Create, you'll see your new zone being configured on the dashboard.

    ![Creating](./media/dns-getstarted-portal/creating150.png)

8. When your new zone has been created, the blade for your new zone will open on the dashboard.


## Create a DNS record

The following example walks you through the process of creating new 'A' record. For other record types and to modify existing records, see [Manage DNS records and record sets by using the Azure portal](dns-operations-recordsets-portal.md). 


1. At the top of the **DNS zone** blade, select **+ Record set** to open the **Add record set** blade.

    ![New record set](./media/dns-getstarted-portal/newrecordset500.png)

4. On the **Add record set** blade, name your record set. For example, you could name your record set "**www**".

    ![Add record set](./media/dns-getstarted-portal/addrecordset500.png)

5. Select the type of record you want to create. For this example, select **A**.
6. Set the **TTL**. The default time to live is one hour.
7. Add the IP address of the record.
8. Select **OK** at the bottom of the blade. The DNS record will be created.


## View records

In the lower part of the DNS zone blade, you can see the records for the DNS zone. You should see the default NS and SOA records which are created in every zone, plus any new records you have created.

![zone](./media/dns-getstarted-portal/viewzone500.png)


## Update name servers

Once you are satisfied that your DNS zone and records have been set up correctly in Azure DNS, you need to configure your domain name to use the Azure DNS name servers. This enables other users on the Internet to find your DNS records.

The name servers for your zone are given in the Azure portal:

![zone](./media/dns-getstarted-portal/viewzonens500.png)

These name servers need to be configured with the domain name registrar (where you purchased the domain name). Your registrar will offer the option to set up the name servers for the domain. For more information, see [delegate your domain to Azure DNS](dns-domain-delegation.md).


## Next steps

To learn more about Azure DNS, see [Azure DNS overview](dns-overview.md).

To learn more about managing DNS records in Azure DNS, see [manage DNS records and record sets by using the Azure portal](dns-operations-recordsets-portal.md).

