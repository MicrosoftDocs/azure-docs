---
title: Understand billable assets
titleSuffix: Microsoft Defender EASM 
description: This article describes how users are billed for their Defender EASM resource usage, and guides them to the dashboard that displays their counts. 
author: danielledennis
ms.author: dandennis
ms.service: defender-easm
ms.date: 11/28/2022
ms.topic: how-to
---

# Understand billable assets

When customers create their first Microsoft Defender External Attack Surface Management (Defender EASM) resource, they are automatically granted a 30-day free trial.  Once the trial has completed, customers are automatically charged based on their count of billable assets.   The charged amount appears on their core Azure billing, with “Defender EASM” appearing as separate line item on their invoice.


## What is a billable asset? 

The following kinds of assets are considered billable:  

- Approved host : IP combinations  
- Approved domains 
- Approved IP addresses 
  
  
Assets are only categorized as billable if they have been placed in the Approved Inventory state.  We don't charge for any other state. Additionally, duplicative host assets are NOT included in the billable asset count.  



## Calculating billable assets 

This section describes the conditions that the three aforementioned asset types must meet to be deemed billable.  The sum of these billable asset counts comprises your total number of billable assets and thus determines the cost of your subscription.  



### Approved host : IP combinations

Hosts are considered billable if the Defender EASM system has observed resolutions within the last 30 days. If the host is in the Approved Inventory state, the host : IP combination is identified as a billable asset. All hosts in the Approved Inventory state are considered billable, regardless of the state of the coinciding IP address. The IP address does not need to be in the Approved Inventory state for the host : IP combination to be included in your billable asset count. 

 
For example: if www.contoso.com has resolved to 1.2.3.4 and 5.6.7.8 in the past 30 days, both combinations are added to the host count list: 

- www.contoso.com / 1.2.3.4 
- www.contoso.com / 5.6.7.8 


The list is then analyzed to identify duplicate entries and eliminate duplicate hosts.  If a host is a subdomain of a parent host that resolves to the same IP address, we exclude the child from the billable host count. For example, if both www.contoso.com and contoso.com resolve to 1.2.3.4, then we exclude www.contoso.com 1.2.3.4 from our Host Count list. 



### Approved IP addresses 

Excluding the IP addresses that resolve to a billable resolving host, all active IP addresses in the Approved Inventory state are part of the billable IP address count.  
 
For an IP address to be considered active and therefore billable, it must have one of the following:  

- A recent detected open port  
- A recent detected SSL certificate 
- Recently appeared on a reputation list 


These values are all considered “recent” if observed within the last 30 days. 



### Approved domains 

Excluding the domains associated with a billable resolving host, all domains in the Approved Inventory state are part of the billable domain count. If a billable host is registered to the domain in question, the domain is not included in the billable asset count.  

For example: if server1.contoso.com has recently resolved to an IP address and is therefore included in your billable asset count, then contoso.com is not added to this count.   


## Viewing billable asset data 

Users can view their billable assets count within their Defender EASM resource to better understand how Microsoft determines their pricing. This dashboard displays the total number of assets that are billable and therefore comprise your total spend. Users should expect to see counts from the last 30 days when applicable, excluding the most recent couple days that haven't yet processed.   

Prospective customers accessing Defender EASM with a 30-day trial can also see these billable asset counts. Although these users aren't charged until the trial has expired, they can view the billable asset dashboard to better understand how they would be billed according to the size of their attack surface.  
1. From the Defender EASM resource, select **Billable assets** from the **Manage** section of the left-hand navigation menu.


  ![Screenshot of Billable assets dashboard with left-hand Manage section highlighted in navigation pane.](media/billable-1a.png)


2. The chart displays billable asset counts over the past 30 days (if we have 30 days of data). The individual bars are segmented by asset type so users can quickly understand how their billable assets are distributed across their attack surface. Users can view the daily counts for each kind of asset by hovering their mouse over the chart. 

  ![Screenshot of Billable assets chart showing asset counts when hovering over bar.](media/billable-2a.png)


3. Beneath the chart, users can view their current billable asset counts. These numbers are useful when approximating your monthly spend to best protect your organization’s attack surface.  

  ![Screenshot of Billable assets counts beneath dashboard.](media/billable-3.png)


## Next steps 

- [Microsoft Defender External Attack Surface Management (Defender EASM) overview](index.md)   
