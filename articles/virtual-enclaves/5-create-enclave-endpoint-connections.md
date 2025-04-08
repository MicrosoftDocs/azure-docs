---
title: Create Enclave or Community Endpoint resources in Azure Virtual Enclaves
description: Create Enclave or Community Endpoint resources in Azure Virtual Enclaves.
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: tutorial
ms.date: 04/08/2025
---

# Tutorial 5: Create Enclave or Community Endpoint resources in Azure Virtual Enclaves

Community endpoints enable enclaves in a community to establish connections to resources outside of the Community boundary to include public websites, public IP addresses, and external private networks through Site-to-Site (S2S) VPN or ExpressRoute connections. Enclave endpoints enable others to connect to your service by defining the means by which inbound traffic is allowed to flow into a given enclave once a connection is made.

In this tutorial, part six of eight, you create community and enclave endpoint resources. You learn how to:

- ✅ Create community endpoint resources in communities
- ✅ Create enclave endpoint resources in enclaves
- ✅ View your endpoints in Azure portal

## Before you begin
In the previous tutorials, you created a [community](./1-deploy-community.md) and an [enclave](./2-create-enclaves-inside-community.md) using the Azure portal.

If you haven't created those resources yet, return to those earlier tutorials.

## Create an Enclave Endpoint

1. Navigate to an Enclave hosting a service you want to make available to other Enclaves in the Community

2. While in your Enclave's page, select `Enclave endpoints` in the left menu.

![image1.png](./media/enclave-webapp-endpoint-list.png)

3. Select `Create`

![image2.png](./media/enclave-webapp-endpoint-list-create.png)

4. Enter the details for your app/service and then select `Save`
   - Enclave: Select the existing Enclave "Enclave-WebApp".
   - Enclave Endpoint name: Name of the enclave endpoint "endpoint-MyService"
   - Select `Add` to add Endpoint Rules that represent how to access your app/service
      - Name: 'WebAppEndpointRules'
      - Destination: `<See the information box that gives your enclave subnet range (e.g. 10.0.2.0/26)>`
      - Port: 443
      - Protocol: ANY

![image3.png](./media/enclave-webapp-endpoint-rule.png)

5. Select `Yes`, select `Review + Create`, and click `Create`

![image4.png](./media/image-a0b8d9e4-0146-40df-bf18-40d3edc6034d.png)

6. Once the endpoint resource is created, you can view them in Azure portal from the Enclave-WebApp `Enclave Endpoints`.

![image5.png](./media/enclave-webapp-endpoint-deployed.png)

## Create a Community Endpoint

1. Navigate to the `fabrikam` community, select `Community Endpoints`

![image6.png](./media/fabrikam-endpoint-list.png)

2. Select `Create`

![image7.png](./media/fabrikam-endpoint-create.png)

3. Enter the details for your app/service
   - Community Endpoint name: Name of the community endpoint `fabrikam-endpoint-website`
   - Select `Add` to add Endpoint Rules that represent how to access your app/service
      - Name: 'Website-Rule'
      - Destination Type: FQDN
      - Destination: *microsoft.com
      - Protocol: HTTPS
      - Port: 443

![image8.png](./media/fabrikam-endpoint-rules.png)

4. Select `Save`

5. Select `Yes`, select `Review + Create`, and click `Create`

![image9.png](./media/fabrikam-endpoint-reviewCreate.png)

6. Once the endpoint resource is created, you can view them in Azure portal from the Enclave-WebApp en.

![image10.png](./media/fabrikam-endpoint-deployed.png)

## Create an Enclave Connection associated to an Endpoint

1. From the `fabrikam` community, select  `Enclave connections`

![image11.png](./media/fabrikam-connection-list.png)

3. Select `Create`

![image12.png](./media/fabrikam-connection-create.png)

4. Enter the details for your app/service
   - Enclave connection name: Name of the connection `fabrikam-external-connection`
   - Community: Select `fabrikam` from the drop down
   - Source Type: Select `Enclave`
   - Source enclave: Select `Enclave-WebApp` from the drop down
   - Source IP addresses/CIDR range(s): `<See the information box that gives your enclave subnet range (e.g. 10.0.2.0/26)>`
   - Destination Endpoint Type: Select `Community Endpoint`
   - Destination endpoint: Select `fabrikam-endpoint-website` from the drop down

![image13.png](./media/fabrikam-connection-input.png)

5. Select `Review + Create` and then `Create`

6. Once the endpoint resource is created, you can view them in Azure portal from the `fabrikam` `Enclave connections`. However, it's in a disconnected state because we selected `Yes` to requiring approvals on connections for this endpoint.

![image14.png](./media/fabrikam-connection-deployed-disconnected.png)

7. Review the pending approvals in `Approvals` on the left for the enclave.

![image15.png](./media/fabrikam-connection-approval-pending.png)

7. Approve the pending approvals and the connection state will automatically update to the `connected` state.

## Next steps
In this tutorial, you deployed community and enclave endpoints using Azure portal. You also learned how to:

- [Create connections](./what-enclave-connection.md)

In the [next tutorial](./7-monitor-your-enclaves.md), you'll learn how to create connections using these endpoints.
