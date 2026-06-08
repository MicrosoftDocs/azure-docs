---
title: Secure Azure Health Data Services with Private Link
description: Azure Health Data Services Private Link configuration made easy. Learn how to set up secure FHIR and DICOM access on your private virtual network.
services: healthcare-apis
author: EXPEkesheth
ms.service: azure-health-data-services
ms.topic: tutorial
ms.date: 05/04/2026
ms.author: kesheth
ms.custom: sfi-image-nochange
---

# Configure Azure Private Link for secure Azure Health Data Services access

Azure Private Link enables secure access to Azure Health Data Services over a private endpoint in your virtual network. This article explains how to configure Private Link for FHIR and DICOM services, helping you protect sensitive health data by restricting access to a private IP address.

By using Private Link, you can access your services securely from your virtual network as a first-party service without going through a public Domain Name System (DNS). This article describes how to create, test, and manage your private endpoint for Azure Health Data Services.

In this tutorial, you:

> [!div class="checklist"]
> * Create a virtual network and subnet for Private Link
> * Create a private endpoint for your Azure Health Data Services workspace
> * Review and manage your private endpoint configuration in the Azure portal
> * Add a DNS record for the Private DNS Zone for new services created after the private endpoint
> * Test connectivity to Azure Health Data Services over the private endpoint

>[!NOTE]
> You can't move Private Link or Azure Health Data Services from one resource group or subscription to another once Private Link is enabled. To make a move, delete the Private Link first, and then move Azure Health Data Services. Create a new Private Link after the move is complete. Next, assess potential security ramifications before deleting the Private Link.
>
>If you're exporting audit logs and metrics that are enabled, update the export setting through **Diagnostic Settings** from the portal.


## Prerequisites

Before you create a private endpoint, create the following Azure resources:

- [An active Azure account](https://azure.microsoft.com/free/).
- **Resource Group** – The Azure resource group that contains the workspace, virtual network, and private endpoint.
- [An Azure Health Data Services workspace](healthcare-apis-quickstart.md):  You need the workspace to create the private endpoint. You create the private endpoint at the workspace level, and it applies to all services within the workspace. 
- A [FHIR service](fhir/fhir-portal-quickstart.md) or [DICOM service](dicom/deploy-dicom-services-in-azure.md) deployed in the workspace: The Azure Health Data Services resource that you want to connect to over the private endpoint. You don't need these resources to create the private endpoint, but you need them to test the private endpoint connectivity.
- An RBAC role with permission to create a virtual network in the resource group, such as **Owner**, **Contributor**, or **Network Contributor**. For more information, see [Manage a virtual network](../virtual-network/manage-virtual-network.yml).
- An RBAC role with permission to create a private endpoint in your resource group or Azure Health Data Services workspace, such as **Owner**, **Contributor**, or **Healthcare APIs Contributor**. For more information, see [Private Link RBAC permissions](../private-link/rbac-permissions.md#private-endpoint). 


## Create a virtual network and dedicated subnet

If you don't already have a virtual network, use the following steps to create the virtual network and a subnet dedicated to the private endpoint. 

If you already have a virtual network, make sure to create a dedicated subnet for the private endpoint. To add a subnet, see [Add a subnet](../virtual-network/virtual-network-manage-subnet.md#add-a-subnet).

Don't enable any service endpoints on the subnet you select for the private endpoint. Service endpoints aren't compatible with private endpoints and can cause connectivity problems.


To create a virtual network and subnet, follow these steps:

1. In the [Azure portal](https://portal.azure.com), search for and select **Virtual Network**.
1. Select **Create**.
1. On the **Basics** tab, select the subscription and resource group that contains your workspace. 
1. Enter a name for the virtual network, and select a region.
1. Go to **IP Addresses** and enter an address space for the virtual network or accept the default values. 
1. Create a subnet for the private endpoint by selecting **+ Add subnet**. 
1. Enter a name and select the address range, starting address, and size for the subnet. Select **Add** to add the subnet.
1. Select **Review + create**, and then select **Create**.


For more information on creating virtual networks, see [Manage a virtual network](../virtual-network/manage-virtual-network.yml).

## Create a private endpoint

To create a private endpoint, use the Azure portal as a user with role-based access control (RBAC) permissions on the workspace or the resource group where the workspace is located. Use the Azure portal because it automates the creation and configuration of the Private DNS Zone. For more information, see [Private Link Quick Start Guides](./../private-link/create-private-endpoint-portal.md).

You configure a private endpoint at the workspace level. The private endpoint automatically applies to all FHIR and DICOM services within the workspace. 


Follow these steps to create a private endpoint from the Network foundation experience:

1. Go to your workspace in the Azure portal.
1. Go to **Settings** > **Networking**.
1. Select **+ Private endpoint**.
1. On the **Basics** tab, select the subscription and resource group that contains your workspace. 
1. Enter a **Name** for the private endpoint, and select a region. The region for the private endpoint must be the same as the region for the virtual network.
1. Select **Next: Resource >**.

:::image type="content" source="media/private-link/create-private-endpoint-basics-tab.png" alt-text="Screenshot of create private endpoint Basics tab." lightbox="media/private-link/create-private-endpoint-basics-tab.png":::

### Resource configuration

Assign a resource to the private endpoint in one of two ways. The auto approval flow enables a user with RBAC permissions on the workspace to create a private endpoint without needing approval. The manual approval flow enables a user without permissions on the workspace to request that owners of the workspace or resource group approve the private endpoint.

#### [Auto approval](#tab/auto-approval)

For auto approval, follow these steps:

1. For **Connection method**, select **Connect to an Azure resource in my directory**. 
1. For the resource type, search for and select **Microsoft.HealthcareApis/workspaces** from the drop-down list. 
1. For the resource, select the workspace in the resource group. The **Target sub-resource** is automatically populated with  **healthcareworkspace**.
1. Select **Next: Virtual Network >**.

:::image type="content" source="media/private-link/create-private-endpoint-auto-approval.png" alt-text="Screenshot of create private endpoint Resources tab with auto approval selection." lightbox="media/private-link/create-private-endpoint-auto-approval.png":::

#### [Manual approval](#tab/manual-approval)

For manual approval, follow these steps:

1. For the **Connection method**, select the second option under Resource, **Connect to an Azure resource by resource ID or alias**. 
1. For the resource ID, enter `subscriptions/{subscriptionid}/resourceGroups/{resourcegroupname}/providers/Microsoft.HealthcareApis/workspaces/{workspacename}`. 
1. For the **Target sub-resource**, enter `healthcareworkspace`.
1. Enter a message for the approver in the **Message for approver** field to provide context for the approval request.
1. Select **Next: Virtual Network >**.

:::image type="content" source="media/private-link/create-private-endpoint-manual-approval.png" alt-text="Screenshot of create private endpoint Manual Approval Resources tab with manual approval selection." lightbox="media/private-link/create-private-endpoint-manual-approval.png":::

When you use manual approval, you can't integrate with a private DNS zone as part of the private endpoint creation process. To use Azure Private DNS, you need to manually create a private DNS zone and link it to your virtual network. For more information, see [Create a private zone](../dns/private-dns-getstarted-portal.md).

> [!NOTE]
> When you create an approved private endpoint for Azure Health Data Services, it automatically disables public traffic. 

---


### Virtual network configuration

1. For **Virtual network**, select the virtual network that you created for the private endpoint.
1. For **Subnet**, select the subnet that you created for the private endpoint.
1. To set up Network Security Group (NSG) rules or route tables to restrict the traffic to the private endpoint, select **edit** the **Network policy for private endpoints**. 
1. For **Private IP configuration**, choose to have an IP address automatically assigned from the subnet, or specify a static IP address from the subnet.
1. Select **Next: DNS >**.

:::image type="content" source="media/private-link/create-private-endpoint-vnet-tab.png" alt-text="Screenshot of create private endpoint Virtual Network tab." lightbox="media/private-link/create-private-endpoint-vnet-tab.png":::

### DNS configuration

If you use the auto approval method, you can integrate with Azure Private DNS zones as part of the private endpoint creation process. If you use the manual approval method and want to integrate with Azure Private DNS zones, you need to manually create a private DNS zone and link it to your virtual network. For more information, see [Private endpoint DNS configuration](#private-endpoint-dns-configuration).

If you choose to integrate with a private DNS zone, two private DNS zones are created, one for the workspace and FHIR services and one for DICOM services. The private DNS zones are automatically linked to the virtual network that you selected for the private endpoint.

:::image type="content" source="media/private-link/create-private-endpoint-dns-tab.png" alt-text="Screenshot of create private endpoint DNS tab." lightbox="media/private-link/create-private-endpoint-dns-tab.png":::

Select **Next: Tags >**.

### Tags

You can optionally add tags to the private endpoint for resource management and billing purposes. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

To add tags, enter a name and value for each tag you want to apply to the private endpoint. After adding any tags, select **Next: Review + create >** 

:::image type="content" source="media/private-link/create-private-endpoint-tags-tab.png" alt-text="Screenshot of create private endpoint Tags tab."lightbox="media/private-link/create-private-endpoint-tags-tab.png":::


### Review and create

Use this tab to review all the configuration settings you selected for the private endpoint. The result of the validation appears at the top of the tab. If there are any issues with the configuration, or you need to make changes, select the appropriate tab to go back and update the settings before creating the private endpoint.

Select **Create** to create the private endpoint.

:::image type="content" source="media/private-link/create-private-endpoint-review-tab.png" alt-text="Screenshot of create private endpoint Review + create tab." lightbox="media/private-link/create-private-endpoint-review-tab.png":::

## Private endpoint DNS configuration

If you integrate your private endpoint with  private DNS zones during the creation of the private endpoint, Azure automatically creates Azure Private DNS zones and the necessary DNS A records in those zones so that the endpoint can resolve the service IP addresses correctly. If you don't integrate with private DNS zones during the creation of the private endpoint, see [manual DNS configuration](#manual-dns-configuration).

After the deployment finishes, select the private endpoint resource in the resource group. Open **Settings** > **DNS configuration**. You see the IP address assignments for each service connected to the private endpoint and the private DNS zones that Azure automatically created and configured for the private endpoint.

:::image type="content" source="media/private-link/private-link-dns-configuration.png" alt-text="Screenshot of private endpoint DNS Configuration." lightbox="media/private-link/private-link-dns-configuration.png":::

Select a private DNS zone to see the configuration for the zone. Select **DNS Management** > **Virtual Network Links**. You see that the private DNS zone is linked to the virtual network. Make sure you associate only a single virtual network with the DNS zone. Associating multiple virtual networks with the same private DNS zone can cause DNS resolution conflicts that prevent the private endpoint from resolving the service IP addresses correctly.

If you need to support multiple virtual networks, you must create separate DNS zones in different resource groups. During the setup, confirm that the Private Endpoint and Private DNS Zone aren't shared across multiple virtual networks. This common misconfiguration can lead to IP resolution problems and access failures that result in HTTP 403 errors on the service.

Select **DNS Management** > **Recordsets** to view DNS records for that zone. You see the A record for each service with the private IP address assigned to that service.

After the private endpoint is created, newly created services in the workspace automatically have DNS records added to the appropriate private DNS zone.

### Manual DNS configuration

If you don't integrate your private endpoint with Azure Private DNS zones during the creation of the private endpoint, you must manually create the appropriate DNS A records in your custom DNS zone so that the private endpoint can resolve the service IP addresses correctly.  

If you want to use Azure Private DNS instead of a custom DNS zone, you need to:

1. [Create a private DNS zone](../dns/private-dns-getstarted-portal.md#create-a-private-dns-zone). 
1. [Link your private DNS zone to the virtual network](../dns/private-dns-getstarted-portal.md#link-the-virtual-network).
1. Add your DNS zone to the Private Endpoint configuration:
    1. Go to the Private Endpoint resource in the Azure portal, select **Settings** > **DNS configuration**.
    1. Select **+ Add configuration**.
    1. Select the private DNS zone you created earlier from the list and save the configuration.
1. [Add DNS A records](../dns/private-dns-getstarted-portal.md#create-another-dns-record) for each service in your workspace to the private DNS zone so that the private endpoint can resolve the service IP addresses correctly. 

> [!IMPORTANT]
> If you manually add private DNS zones, every time you add a new service into the Private Link enabled workspace, you need to [add a DNS record](../dns/private-dns-getstarted-portal.md#create-another-dns-record) to your private DNS zone or your custom DNS zone. If DNS A records aren't added in your private DNS zone, requests to the new service fail with a 403 Forbidden error. 

## Test private endpoint


To verify that your service isn't receiving public traffic after disabling public network access, open a browser or use a tool like `curl` from a machine outside of your virtual network and attempt to access the service endpoints over the public network. For example, attempt to access the `/metadata` endpoint for your FHIR service, or the `/health/check` endpoint of the DICOM service, and you receive the message 403 Forbidden. 

It can take up to five minutes after updating the public network access flag before public traffic is blocked.

To ensure your Private Endpoint can send traffic to your server:

1. Create a virtual machine (VM) that is connected to the virtual network and subnet your Private Endpoint is configured on. To ensure your traffic from the VM only uses the private network, disable the outbound internet traffic by using the network security group (NSG) rule.
1. Use Remote Desktop Protocol (RDP) to connect to the VM.
1. Access your FHIR server’s `/metadata` endpoint from the VM. You should receive the capability statement as a response.

## FAQ

### FHIR service configured with private endpoints is missing its private link DNS entries, what should I do?
If a FHIR service configured with a private endpoint is missing private link DNS entries, it resolves through the public CNAME path instead of resolving to the private IP address via `*.private link.fhir.azurehealthcareapis.com`. This problem can intermittently occur during provisioning and might prevent the correct configuration of the private link DNS entries.
Due to this problem, services might be unreachable from the virtual network, which can result in connectivity failures for applications relying on private network access.

To mitigate this problem, remove and re-add the private endpoint connection to the Azure Health Data Services (AHDS) Workspace. This action triggers a new provisioning cycle that correctly configures the private link DNS entries.

To resolve the problem, follow these steps:

1. Go to the AHDS Workspace in the Azure portal.
1. Select **Networking** > **Private endpoint connections**.
1. Remove the existing private endpoint.
1. Re-create the private endpoint by using the same configuration.
1. Verify that DNS resolution returns the private IP address.

### Logs show that requests fail with HTTP 403. The failures aren't due to bad tokens but instead Private Links rejects the requests because their origin isn't allowed to access the FHIR service.

Validate the following points:

-  Check if the request origin of those requests is part of the same virtual network where the FHIR service is.  

-  Check if the private endpoint and private DNS zone are shared with multiple virtual networks at the same time. This known misconfiguration can cause turbulence on the IP resolution and result in requests being rejected.

## Related articles

- [Create a private endpoint using the Azure portal](./../private-link/create-private-endpoint-portal.md)
- [Private Link Documentation](./../private-link/index.yml)

[!INCLUDE [FHIR and DICOM trademark statement](./includes/healthcare-apis-fhir-dicom-trademark.md)]
