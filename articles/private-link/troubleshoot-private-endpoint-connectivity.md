---
title: Troubleshoot Azure Private Endpoint connectivity problems
description: Step-by-step guidance to diagnose private endpoint connectivity
author: abell
ms.service: azure-private-link
ms.topic: troubleshooting
ms.date: 02/18/2025
ms.author: abell
# Customer intent: As a network administrator, I want to troubleshoot Azure Private Endpoint connectivity issues, so that I can ensure secure and reliable access to Azure services from my virtual network.
---

# Troubleshoot Azure Private Endpoint connectivity problems

This article provides step-by-step guidance to validate and diagnose your Azure Private Endpoint connectivity setup.

Azure Private Endpoint is a network interface that connects you privately and securely to a private link service. This solution helps you secure your workloads in Azure by providing private connectivity to your Azure service resources from your virtual network. This solution effectively brings those services to your virtual network.

Here are the connectivity scenarios that are available with Private Endpoint:

- Virtual network from the same region

- Regionally peered virtual networks

- Globally peered virtual networks

- Customer on-premises over VPN or Azure ExpressRoute circuits

## Diagnose connectivity problems 

Review these steps to make sure all the usual configurations are as expected to resolve connectivity problems with your private endpoint setup.

1. Review private endpoint configuration by browsing the resource.

    a. Go to [Private Link Center](https://portal.azure.com/#blade/Microsoft_Azure_Network/PrivateLinkCenterBlade/overview).

    b. On the left pane, select **Private endpoints**.

    c. Filter and select the private endpoint that you want to diagnose.

    d. Review the virtual network and DNS information.

     - Validate that the connection state is **Approved**.

     - Make sure the VM has connectivity to the virtual network that hosts the private endpoints.

     - Check that the FQDN information (copy) and Private IP address are assigned.
    
1. Use [Azure Monitor](/azure/azure-monitor/overview) to see if data is flowing.

    a. On the private endpoint resource, select **Metrics**.

     - Select **Bytes In** or **Bytes Out**. 

     - See if data is flowing when you attempt to connect to the private endpoint. Expect a delay of approximately 10 minutes.

1.  Use **VM Connection troubleshoot** from Azure Network Watcher.

    a. Select the client VM.

    b. Select **Connection troubleshoot**, and then select the **Outbound connections** tab.
    
    c. Select **Use Network Watcher for detailed connection tracing**.

    d. Select **Test by FQDN**.

     - Paste the FQDN from the private endpoint resource.

     - Provide a port. Typically, use 443 for Azure Storage or Azure Cosmos DB and 1336 for SQL.

    e. Select **Test**, and validate the test results. 
        
1. DNS resolution from the test results must have the same private IP address assigned to the private endpoint.

    a. If the DNS settings are incorrect, follow these steps:

     - If you use a private zone: 

       - Make sure that the client VM virtual network is associated with the private zone.

       - Check to see that the private DNS zone record exists. If it doesn't exist, create it.

     - If you use custom DNS:

       - Review your custom DNS settings, and validate that the DNS configuration is correct.
       For guidance, see [Private endpoint overview: DNS configuration](./private-endpoint-overview.md#dns-configuration).

    b. If connectivity is failing because of network security groups (NSGs) or user-defined routes:
     - Review the NSG outbound rules, and create the appropriate outbound rules to allow traffic.

1. Source virtual machine should have the route to private endpoint IP next hop as InterfaceEndpoints in the network interface effective routes. 

    a. If you aren't able to see the private endpoint route in the source VM, check if 

     - The source VM and the private endpoint are part of the same virtual network. If yes, then you need to engage support. 

     - The source VM and the private endpoint are part of different virtual networks that are directly peered with each other. If yes, then you need to engage support.

     - The source VM and the private endpoint are part of different virtual networks that aren't directly peered with each other, then check for the IP connectivity between the virtual networks.

1. If the connection has validated results, the connectivity problem might be related to other aspects like secrets, tokens, and passwords at the application layer.

   - In this case, review the configuration of the private link resource associated with the private endpoint. For more information, see the [Azure Private Link troubleshooting guide](troubleshoot-private-link-connectivity.md)
   
1. It's always good to narrow down before raising the support ticket. 

    a. If the source is on-premises, connecting to private endpoint in Azure having issues, then:

      - Try to connect to another virtual machine from on-premises. Check if you have IP connectivity to the virtual network from on-premises. 

      - Try to connect from a virtual machine in the virtual network to the private endpoint.
      
    b. If the source is Azure and private endpoint is in different virtual network, then:

      - Try to connect to the private endpoint from a different source. By connecting from a different source, you can isolate any virtual machine specific issues. 

      - Try to connect to any virtual machine, which is part of the same virtual network of the private endpoint.  

1. If the private endpoint is linked to a [Private Link Service](./troubleshoot-private-link-connectivity.md), which is linked to a load balancer, check if the backend pool is reporting healthy. Fixing the load balancer health fixes the issue with connecting to the private endpoint.

    - You can see a visual diagram or a [resource view](../network-watcher/network-insights-overview.md#resource-view) of the related resources, metrics, and insights by going to:

        - Azure Monitor

        - Networks

        - Private endpoints

        - Resource view 

Contact the [Azure Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) team if your problem is still unresolved and a connectivity problem still exists.

## Next steps

 * [Create a private endpoint on the updated subnet (Azure portal)](./create-private-endpoint-portal.md)

 * [Azure Private Link troubleshooting guide](troubleshoot-private-link-connectivity.md)
