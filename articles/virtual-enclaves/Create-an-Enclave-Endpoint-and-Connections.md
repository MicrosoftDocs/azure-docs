---
title: 6. Create Enclave or Community Endpoint resources in Azure Virtual Enclaves
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Tutorial: Create Enclave or Community Endpoint resources in Azure Virtual Enclaves

Community endpoints enable enclaves in a community to establish connections to resources outside of the Community boundary to include public websites, public IP addresses, and external private networks through Site-to-Site (S2S) VPN or ExpressRoute connections. Enclave endpoints enable others to connect to your service by defining the means by which inbound traffic is allowed to flow into a given enclave once a connection is made.

In this tutorial, part six of eight, you create community and enclave endpoint resources. You learn how to:

- ✅ Create community endpoint resources in communities
- ✅ Create enclave endpoint resources in enclaves
- ✅ View your endpoints in Azure Portal

## Before you begin
In the previous tutorials, you created a [community](/Virtual-Enclaves-Docs/Tutorials/1.-Deploy-a-community) and an [enclave](/Virtual-Enclaves-Docs/Tutorials/2.-Create-enclaves-within-a-community) using the Azure Portal.

If you haven't created those resources yet, please return to those earlier tutorials.

...

## Create an Enclave Endpoint

1. Navigate to an Enclave hosting a service you want to make available to other Enclaves in the Community

2. While in your Enclave's page, select **Enclave endpoints** in the left menu.

3. Select Create from the **Enclave Endpoints** blade. 

4. Enter the details for your app/service 
   - Enclave: Select the existing Enclave.
   - Enclave Endpoint name: Name of the enclave endpoint (ex: `enc-MyService`)
   - Add Endpoint Rules that represent how to access your app/service
      - Name: 'MyEndpointRule'
      - Destination: <IP Addresses for your App/Service VMs>
      - Port: <Ports required to access your App/Service>
      - Protocol: <Protocol required to access your App/Service>

5. Select Create

![image.png](/assets/image-a0b8d9e4-0146-40df-bf18-40d3edc6034d.png)

## Create a Community Endpoint

1. Navigate to an existing Community within your Azure subscription, select the **Community Endpoints** blade, and click **Create**

![image.png](/assets/image-14144dce-d540-47e7-ad69-22af5af15cdb.png)

2. Provide a name for the Community Endpoint and click **Add** to create a Community rule. 

Community Endpoint rule types:
- **IP Address**: Enable traffic from an Enclave to an IP address outside of the Community vWAN
- **FQDN**: Enable traffic from an Enclave to a trusted FQDN (ex - *portal.azure.com)
- **FQDN Tag**: Enable traffic from Enclaves to known Microsoft/Azure services via FQDN Tags (Ex - "AzurePortal")
- **Private Network**: Enable traffic from Enclaves to an external private network through a [Transit Hub](docs/How%20To%20Guides/Create-a-Transit-Hub-from-the-Azure-Portal) connection

![image.png](/assets/image-b92e563b-574a-4cca-a7c6-a45e95ef5177.png)

3. Provide a name, destination type, destination, port, and protocol for the Community Endpoint Rule and click **Add**

![image.png](/assets/image-a2dde421-3678-4aa6-8de5-35f140226eba.png)
![image.png](/assets/image-dff67a65-9941-406c-80a0-9f5877569002.png)

4. Click **Review + Create** and click **Create**

![image.png](/assets/image-674a958e-abd5-472f-9cf6-83f23c897469.png)

# Create an Enclave Connection associated to an Endpoint

1. Navigate to the Enclave you want to connect to an app/service running

2. Select "Create Enclave Connection"

3. Select the source enclave/IP/CIDR and the Enclave or Community Endpoint you want to connect the enclave to.

![image.png](/assets/image-a0e843f6-42cc-444f-bc2b-1e5e6c77254a.png)

4. Select "Review + Create" and then "Create"


...

## Next steps
In this tutorial, you deployed community and enclave endpoints using Azure Portal. You also learned how to:

- [Create connections](/docs/Tutorials/7.-Create-connections-using-enclaves-and-endpoints.md)
- [Monitor your enclaves](/docs/Tutorials/8.-Monitor-your-enclaves.md)

In the [next tutorial](/Virtual-Enclaves-Docs/Tutorials/7.-Create-connections-using-enclaves-and-endpoints), you'll learn how to create connections using these endpoints.
