---
title: How to enable network security
description: This article gives an overview of the Azure Video Indexer  network security options.
ms.topic: article
ms.date: 04/11/2022
ms.author: juliako
---

# NSG service tags for Azure Video Indexer

Azure Video Indexer is a service hosted on Azure. In some architecture cases the service needs to interact with other services in order to index video files (that is, a Storage Account) or when a customer orchestrates indexing jobs against our API endpoint using their own service hosted on Azure (i.e AKS, Web Apps, Logic Apps, Functions). Customers who would like to limit access to their resources on a network level can use [Network Security Groups with Service Tags](../virtual-network/service-tags-overview.md). A service tag represents a group of IP address prefixes from a given Azure service, in this case Azure Video Indexer. Microsoft manages the address prefixes grouped by the service tag and automatically updates the service tag as addresses change in our backend, minimizing the complexity of frequent updates to network security rules by the customer.

## Get started with service tags

Currently we support the global service tag option for using service tags in your network security groups:

**Use a single global AzureVideoAnalyzerForMedia service tag**: This option opens your virtual network to all IP addresses that the Azure Video Indexer service uses across all regions we offer our service. This method will allow for all IP addresses owned and used by Azure Video Indexer to reach your network resources behind the NSG.

> [!NOTE]
> Currently we do not support IPs allocated to our services in the Switzerland North Region. These will be added soon. If your account is located in this region you cannot use Service Tags in your NSG today since these IPs are not in the Service Tag list and will be rejected by the NSG rule.

## Use a single global Azure Video Indexer service tag

The easiest way to begin using service tags with your Azure Video Indexer account is to add the global tag `AzureVideoAnalyzerForMedia` to an NSG rule.

1. From the [Azure portal](https://portal.azure.com/), select your network security group.
1. Under **Settings**, select **Inbound security rules**, and then select **+ Add**.
1. From the **Source** drop-down list, select **Service Tag**.
1. From the **Source service tag** drop-down list, select **AzureVideoAnalyzerForMedia**.

:::image type="content" source="./media/network-security/nsg-service-tag.png" alt-text="Add a service tag from the Azure portal":::

This tag contains the IP addresses of Azure Video Indexer services for all regions where available. The tag will ensure that your resource can communicate with the Azure Video Indexer services no matter where it's created.

## Using Azure CLI

You can also use Azure CLI to create a new or update an existing NSG rule and add the **AzureVideoAnalyzerForMedia** service tag using the `--source-address-prefixes`. For a full list of CLI commands and parameters see [az network nsg](/cli/azure/network/nsg/rule?view=azure-cli-latest&preserve-view=true)

Example of a security rule using service tags. For more details, visit https://aka.ms/servicetags

`az network nsg rule create -g MyResourceGroup --nsg-name MyNsg -n MyNsgRuleWithTags --priority 400 --source-address-prefixes AzureVideoAnalyzerForMedia --destination-address-prefixes '*' --destination-port-ranges '*' --direction Inbound --access Allow --protocol Tcp --description "Allow from VideoAnalyzerForMedia"`

## Next steps

[Disaster recovery](video-indexer-disaster-recovery.md)