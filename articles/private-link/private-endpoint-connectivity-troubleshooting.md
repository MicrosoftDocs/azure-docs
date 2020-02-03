---
title: troubleshoot private endpoint connectivity problems
description: Step-by-step guidance to diagnose private endpoint connectivity
services: private-endpoint
documentationcenter: na
author: rdhillon
manager: narayan
editor: ''

ms.service: private-endpoint
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/31/2020
ms.author: rdhillon

---

# Troubleshoot Private Endpoint connectivity problems

This guide provides step-by-step guidance to validate and diagnose your private endpoint connectivity setup. 

Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. This solution helps you secure your workloads in Azure by only providing private connectivity to your resources hosted in Azure services from your virtual network, effectively bringing those services to your virtual network. 

Here are the connectivity scenarios that are available with Private Endpoints 
- virtual network from the same region 
- regionally peered virtual networks
- globally peered virtual networks
- customer on-premises over VPN or Express Route circuits

## Diagnosing connectivity problems 

If you are experiencing connectivity problems with your private endpoint setup, please go over the steps listed below to make sure all the usual configurations are as expected.

1. Review Private Endpoint configuration by browsing the resource 

    a) Go to **Private Link Center**

    ![Private Link Center](./media/private-endpoint-tsg/private-link-center.png)

    b) Select Private Endpoints from the left navigation pane
    
    ![Private Endpoints](./media/private-endpoint-tsg/private-endpoints.png)

    c) Filter and select the private endpoint that you want to diagnose

    d) Review the virtual network and DNS information
    
    - Make sure the VM has connectivity to the VNet hosting the Private Endpoints
    - FQDN information (copy) and Private IP address assigned
    
    ![VNet and DNS Configuration](./media/private-endpoint-tsg/vnet-dns-configuration.png)    
    
2. Use [**Azure Monitor**](https://docs.microsoft.com/en-us/azure/azure-monitor/overview) to review data is flowing

    a) On Private Endpoint resource, select **Monitor**
    - Select data-in or out and review if the data is flowing when attempting to connect to the Private Endpoint (expect a delay of approx 10 mins)
    
    ![Verify Private Endpoint Telemetry](./media/private-endpoint-tsg/private-endpoint-monitor.png)

3. Use VM Connection Troubleshoot from **Network Watcher**

    a) Select the client VM

    b) Select the **Connection troubleshoot** section

    c) Select **Outbound connection test**

    d) Select **Test by FQDN**
    - Paste the FQDN from the Private Endpoint resource
    - Provide a port ( *typically 443 for Azure Storage or COSMOS, 1336 for Sql ...* )

    e) Click **Test** and validate the test results
    
    ![Network Watcher for Private Endpoints](./media/private-endpoint-tsg/network-watcher.png)
        
4. DNS resolution from the test results must have the same private IP address assigned to the Private Endpoint

    a) If DNS settings are not correct, do the following
    - Using Private Zone: 
        - Make sure client VM VNet is associated with the Private Zone
        - Review Private DNS zone record exists, create if not existing
        
    ![DNS private Zone](./media/private-endpoint-tsg/dns-private-zone.png)
    
    - Using custom DNS:
        - Review your customer DNS settings and validate DNS configuration is correct.
        Refer to [Private Endpoint overview - DNS Configuration](https://docs.microsoft.com/en-us/azure/private-link/private-endpoint-overview#dns-configuration) for guidance.
        
    ![DNS custom Zone](./media/private-endpoint-tsg/dns-custom-zone.png)

    b) If connectivity is failing due to NSG/UDRs
    - Review NSG outbound rules and create appropriate outbound rules to allow traffic

5. If the connection has validated results, the connectivity issue might be related to other aspects like secrets, tokens, passwords at the application layer.
- In this case, please review configuration of the Private Link resource associated with the private endpoint. Refer to [Private Link troubleshooting guide](https://docs.microsoft.com/en-us/azure/private-link/private-link-connectivity-troubleshooting). 

6. Please reach out to [Azure Support](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) team if your problem is still unresolved and connectivity problem still exists. 

## Next steps

* [Create a Private Endpoint on the updated subnet (Azure Portal)](https://docs.microsoft.com/en-us/azure/private-link/create-private-endpoint-portal)

* [Private Link troubleshooting guide](https://docs.microsoft.com/en-us/azure/private-link/private-link-connectivity-troubleshooting)
