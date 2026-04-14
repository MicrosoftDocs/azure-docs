---
services: azure-health-data-services
ms.service: fhir
ms.topic: include
ms.date: 03/23/2026
author: EXPEkesheth
ms.author: kesheth
ms.reviewer: v-catheribun
---

### Allow specific IP addresses to access the Azure storage account from other Azure regions

1. In the Azure portal, go to the storage account.
1. On the left menu, select **Security + Networking** > **Networking**.
1. On the **Public access** tab under **Public network access**, select **Manage**.
1. Select **Enabled from selected networks**.
1. Enter the IP addresses in the **IPv4 Addresses** section.

:::image type="content" source="../fhir/media/export-data/allow-selected-public-ip-addresses.png" alt-text="Screenshot of the page for allowing selected public IP addresses." lightbox="../fhir/media/export-data/allow-selected-public-ip-addresses.png":::

The following table lists the public IP addresses for the FHIR service in different Azure regions. You can use these IP addresses to allow access to the storage account from the FHIR service in other regions.

   |Azure region         |Public IP address |
   |:----------------------|:-------------------|
   | Australia East       | 20.53.44.80       |
   | Canada Central       | 20.48.192.84      |
   | Central US           | 52.182.208.31     |
   | East US              | 20.62.128.148     |
   | East US 2            | 20.49.102.228     |
   | East US 2 EUAP       | 20.39.26.254      |
   | Germany North        | 51.116.51.33      |
   | Germany West Central | 51.116.146.216    |
   | Japan East           | 20.191.160.26     |
   | Korea Central        | 20.41.69.51       |
   | North Central US     | 20.49.114.188     |
   | North Europe         | 52.146.131.52     |
   | South Africa North   | 102.133.220.197   |
   | South Central US     | 13.73.254.220     |
   | Southeast Asia       | 23.98.108.42      |
   | Switzerland North    | 51.107.60.95      |
   | UK South             | 51.104.30.170     |
   | UK West              | 51.137.164.94     |
   | West Central US      | 52.150.156.44     |
   | West Europe          | 20.61.98.66       |
   | West US 2            | 40.64.135.77      |

### Allow specific IP addresses to access the Azure storage account in the same region

The configuration process for IP addresses in the same region is just like the previous procedure, except that you use a specific IP address range in Classless Inter-Domain Routing (CIDR) format (for example, 100.64.0.0/10). You must specify the IP address range (100.64.0.0 to 100.127.255.255) because the FHIR service allocates an IP address each time you make an operation request.

> [!NOTE]
> You can use a private IP address within the range of 10.0.2.0/24, but there's no guarantee that the operation succeeds. If the operation request fails, you can retry. However, the request doesn't succeed until you use an IP address within the range of 100.64.0.0/10.
>
> This network behavior for IP address ranges is by design. The alternative is to configure the storage account in a different region.
