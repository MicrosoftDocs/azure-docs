---
title: Secure access to Azure Red Hat OpenShift with Azure Front Door 
description: This article explains how to use Azure Front Door to secure access to Azure Red Hat OpenShift applications.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.date: 12/07/2021
keywords: azure, openshift, red hat, front, door
#Customer intent: I need to understand how to secure access to Azure Red Hat OpenShift applications with Azure Front Door.
---

# Secure access to Azure Red Hat OpenShift with Azure Front Door 

This article explains how to use Azure Front Door Premium to secure access to Azure Red Hat OpenShift.  

## Prerequisites

The following prerequisites are required: 

- You have an existing Azure Red Hat OpenShift cluster. Follow this guide to [create a private Azure Red Hat OpenShift cluster](howto-create-private-cluster-4x.md).

- The cluster is configured with private ingress visibility.

- A custom domain name is used, for example:

    `example.com`

> [!NOTE]
> The initial state doesn't have DNS configured.
> No applications are exposed externally from the Azure Red Hat OpenShift cluster.

## Create an Azure Private Link service

This section explains how to create an Azure Private Link service. An Azure Private Link service is a reference to your own service that is powered by Azure Private Link.

Your service, which is running behind the Azure Standard Load Balancer, can be enabled for Private Link access so that consumers to your service can access it privately from their own VNets. Your customers can create a private endpoint inside their VNet and map it to this service.

For more information about the Azure Private Link service and how it's used, see [Azure Private Link service](../private-link/private-link-service-overview.md).

Create an  **AzurePrivateLinkSubnet**. This subnet includes a netmask that permits visibility of the subnet to the control plane and worker nodes of the Azure cluster. Don't delegate this new subnet to any services or configure any service endpoints. 

For example, if the virtual network is 10.10.0.0/16 and:

  - Existing Azure Red Hat OpenShift control plane subnet = 10.10.0.0/24
  - Existing Azure Red Hat OpenShift worker subnet = 10.10.1.0/24
  - New AzurePrivateLinkSubnet = 10.10.2.0/24

 Create a new Private Link at [Azure Private Link service](https://portal.azure.com/#create/Microsoft.PrivateLinkservice), as explained in the following steps:

1. On the **Basics** tab, configure the following options: 
   - **Project Details**
     * Select your Azure subscription.
     * Select the resource group in which your Azure Red Hat OpenShift cluster was deployed.
   - **Instance Details**
     -  Enter a **Name** for your Azure Private Link service, as in the following example: *example-com-private-link*.
     - Select a **Region** for your Private Link.

2. On the **Outbound Settings** tab:
   - Set the **Load Balancer** to the **-internal** load balancer of the cluster for which you're enabling external access. The choices are populated in the drop-down list.
   - Set the **Load Balancer frontend IP address** to the IP address of the Azure Red Hat OpenShift ingress controller, which typically ends in **.254**. If you're unsure, use the following command. 

     ```azurecli
      az aro show -n <cluster-name> -g <resource-group> -o tsv --query ingressProfiles[].ip
     ```

   - The **Source NAT subnet** should be the  **AzurePrivateLinkSubnet**, which you created.
   - No items should be changed in **Outbound Settings**.

3. On the **Access Security** tab, no changes are required.

    - At the **Who can request access to your service?** prompt, select **Anyone with your alias**. 
   - Don't add any subscriptions for auto-approval.

4. On the **Tags** tab, select **Review + create**.

5. Select **Create** to create the Azure Private Link service, and then wait for the process to complete.
   
6. When your deployment is complete, select **Go to resource group** under **Next steps**.

In the Azure portal, enter the Azure Private Link service that was deployed. Retain the **Alias** that was generated for the Azure Private Link service. It will be used later.

## Register domain in Azure DNS

This section explains how to register a domain in Azure DNS.

1. Create a global [Azure DNS](https://portal.azure.com/#create/Microsoft.DnsZone) zone for example.com.

2. Create a global [Azure DNS](https://portal.azure.com/#create/Microsoft.DnsZone) zone for apps.example.com.

3. Note the four nameservers that are present in Azure DNS for apps.example.com.

4. Create a new **NS** record set in the example.com zone that points to **apps** and specify the four nameservers that were present when the **apps** zone was created.

## Create a new Azure Front Door Premium service

To create a new Azure Front Door Premium service:

1. On [Microsoft Azure Compare offerings](https://portal.azure.com/#create/Microsoft.AFDX) select **Azure Front Door**, and then select **Continue to create a Front Door**.

2. On the **Create a front door profile** page in the **Subscription** > **Resource group**, select the resource group in which your Azure Red Hat OpenShift cluster was deployed to house your Azure Front Door Premium resource.

3. Name your Azure Front Door Premium service appropriately. For example, in the **Name** field, enter the following name:

    `example-com-frontdoor`

4. Select the  **Premium** tier. The Premium tier is the only choice that supports Azure Private Link.

5. For **Endpoint name**, choose an endpoint name that is appropriate for Azure Front Door. 

    For each application deployed, a CNAME will be created in the Azure DNS to point to this hostname. Therefore, it's important to choose a name that is agnostic to applications.  For security, the name shouldn't suggest the applications or architecture that you’ve deployed, such as **example01**. 
    
    The name you choose will be prepended to the **.z01.azurefd.net** domain.

6. For **Origin type**, select **Custom**.

7. For **Origin Host Name**, enter the following placeholder:

    `changeme.com` 

    This placeholder will be deleted later.

   At this stage, don't enable the Azure Private Link service, caching, or the Web Application Firewall (WAF) policy.

9. Select **Review + create** to create the Azure Front Door Premium resource, and then wait for the process to complete.

## Initial configuration of Azure Front Door Premium

To configure Azure Front Door Premium:

1. In the Azure portal, enter the Azure Front Door Premium service that was deployed.

2. In the **Endpoint Manager** window, modify the endpoint by selecting **Edit endpoint**.

3. Delete the default route, which was created as **default-route**.

4. Close the **Endpoint Manager** window.

5. In the **Origin Groups** window, delete the default origin group that was named **default-origin-group**.

## Exposing an application route in Azure Red Hat OpenShift

Azure Red Hat OpenShift must be configured to serve the application with the same hostname that Azure Front Door will be exposing externally (\*.apps.example.com). In our example, we'll expose the Reservations application with the following hostname:

`reservations.apps.example.com`

Also, create a secure route in Azure Red Hat OpenShift that exposes the hostname.

## Configure Azure DNS

To configure the Azure DNS: 

1. Enter the public **apps** DNS zone previously created.  

2. Create a new CNAME record set named **reservation**. This CNAME record set is an alias for our example Azure Front Door endpoint:

    `example01.z01.azurefd.net`

## Configure Azure Front Door Premium

The following steps explain how to configure Azure Front Door Premium.

1. In the Azure portal, enter the Azure Front Door Premium service you created previously: 

    `example-com-frontdoor`

 **In the Domains window**:

  1. Because all DNS servers are hosted on Azure, leave **DNS Management** set to **Azure managed DNS**.

3. Select the example domain:

    `apps.example.com`

4. Select the CNAME in our example: 

    `reservations.apps.example.com`

5. Use the default values for **HTTPS** and **Minimum TLS version**.

6. Select **Add**.

7. When the **Validation stat** changes to **Pending**, select **Pending**.

8. To authenticate ownership of the DNS zone, for **DNS record status**, select **Add**.

9. Select **Close**.

10. Continue to select **Refresh** until the **Validation state** of the domain changes to **Approved** and the **Endpoint association** changes to **Unassociated**.

**In the Origin Groups window**:

1. Select **Add**.

2. Give your **Origin Group** an appropriate name, such as **Reservations-App**.

3. Select **Add an origin**.

4. Enter the name of the origin, such as **ARO-Cluster-1**.

5. Choose an **Origin type** of **Custom**.

6. Enter the fully qualified domain name (FQDN) hostname that was exposed in your Azure Red Hat OpenShift cluster, such as:

    `reservations.apps.example.com`

7. Enable the **Private Link** service.

8. Enter the **Alias** that was obtained from the Azure Private Link service.

9. Select **Add** to return to the origin group creation window.

10. Select **Add** to add the origin group and return to the Azure portal.

## Grant approval in Azure Private Link

To grant approval to the **example-com-private-link**, which is the **Azure Private Link** service you created previously, complete the following steps.

1. On the **Private endpoint connections** tab, select the checkbox that now exists from the resource described as **do from AFD**.

2. Select **Approve**, and then select **Yes** to verify the approval.

## Complete Azure Front Door Premium configuration

The following steps explain how to complete the configuration of Azure Front Door Premium.

1. In the Azure portal, enter the Azure Front Door Premium service you previously created:

    `example-com-frontdoor`

2. In the **Endpoint Manager** window, select **Edit endpoint** to modify the endpoint.

3. Select **+Add** under **Routes**.

4. Give your route an appropriate name, such as **Reservations-App-Route-Config**.

5. Under **Domains**, then under **Available validated domains**, select the fully qualified domain name, for example:

     `reservations.apps.example.com`


6. To redirect HTTP traffic to use HTTPS, leave the **Redirect** checkbox selected.

7. Under **Origin group**, select  **Reservations-App**, the origin group you previously created.

8. You can enable caching, if appropriate.

9. Select **Add** to create the route.
After the route is configured, the **Endpoint manager** populates the **Domains** and **Origin groups** panes with the other elements created for this application. 

Because Azure Front Door is a global service, the application can take up to 30 minutes to deploy. During this time, you may choose to create a WAF for your application. When your application goes live, it can be accessed using the URL used in this example:

`https://reservations.apps.example.com`   

## Next steps

Create an Azure Web Application Firewall on Azure Front Door using the Azure portal:
> [!div class="nextstepaction"]
> [Tutorial: Create a Web Application Firewall policy on Azure Front Door using the Azure portal](../web-application-firewall/afds/waf-front-door-create-portal.md)
