---
title: Create Enclave or Community Endpoint resources in Azure Virtual Enclaves
description: Create Enclave or Community Endpoint resources in Azure Virtual Enclaves
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: tutorial
ms.date: 01/31/2025
---

# Tutorial 6: Create Enclave or Community Endpoint resources in Azure Virtual Enclaves

Community endpoints enable enclaves in a community to establish connections to resources outside of the Community boundary to include public websites, public IP addresses, and external private networks through Site-to-Site (S2S) VPN or ExpressRoute connections. Enclave endpoints enable others to connect to your service by defining the means by which inbound traffic is allowed to flow into a given enclave once a connection is made.

In this tutorial, part six of eight, you create community and enclave endpoint resources. You learn how to:

- ✅ Create community endpoint resources in communities
- ✅ Create enclave endpoint resources in enclaves
- ✅ View your endpoints in Azure Portal

## Before you begin
In the previous tutorials, you created a [community](./1-deploy-a-community.md) and an [enclave](./2-create-enclaves-within-a-community.md) using the Azure Portal.

If you haven't created those resources yet, please return to those earlier tutorials.

...

## Create an Enclave Endpoint

1. Navigate to an Enclave hosting a service you want to make available to other Enclaves in the Community

2. While in your Enclave's page, select `Enclave endpoints` in the left menu.

![image.png](./media/enclave-webapp-endpointblade.png)

3. Select `Create`

![image.png](./media/enclave-webapp-endpointblade-create.png)

4. Enter the details for your app/service and then select `Save`
   - Enclave: Select the existing Enclave "Enclave-WebApp".
   - Enclave Endpoint name: Name of the enclave endpoint "endpoint-MyService"
   - Select `Add` to add Endpoint Rules that represent how to access your app/service
      - Name: 'WebAppEndpointRules'
      - Destination: `<See the information box that gives your enclave subnet range (e.g. 10.0.2.0/26)>`
      - Port: 443
      - Protocol: ANY

![image.png](./media/enclave-webapp-endpoint-rule.png)

5. Select `Yes`, select `Review + Create`, and click `Create`

![image.png](./media/image-a0b8d9e4-0146-40df-bf18-40d3edc6034d.png)

6. Once the endpoint resource is created, you can view them in Azure Portal from the Enclave-WebApp `Enclave Endpoints`.

![image.png](./media/enclave-webapp-endpoint-deployed.png)

## Create a Community Endpoint

1. Navigate to the `fabrikam` community, select `Community Endpoints`

![image.png](./media/fabrikam-endpoint-blade.png)

2. Select `Create`

![image.png](./media/fabrikam-endpoint-create.png)

3. Enter the details for your app/service
   - Community Endpoint name: Name of the community endpoint `fabrikam-endpoint-website`
   - Select `Add` to add Endpoint Rules that represent how to access your app/service
      - Name: 'Website-Rule'
      - Destination Type: FQDN
      - Destination: *microsoft.com
      - Protocol: HTTPS
      - Port: 443

![image.png](./media/fabrikam-endpoint-rules.png)

4. Select `Save`

5. Select `Yes`, select `Review + Create`, and click `Create`

![image.png](./media/fabrikam-endpoint-reviewCreate.png)

6. Once the endpoint resource is created, you can view them in Azure Portal from the Enclave-WebApp en.

![image.png](./media/fabrikam-endpoint-deployed.png)

# Create an Enclave Connection associated to an Endpoint

1. From the `fabrikam` community, select  `Enclave connections`

![image.png](./media/fabrikam-connection-blade.png)

3. Select `Create`

![image.png](./media/fabrikam-connection-create.png)

4. Enter the details for your app/service
   - Enclave connection name: Name of the connection `fabrikam-external-connection`
   - Community: Select `fabrikam` from the drop down
   - Source Type: Select `Enclave`
   - Source enclave: Select `Enclave-WebApp` from the drop down
   - Source IP addresses/CIDR range(s): `<See the information box that gives your enclave subnet range (e.g. 10.0.2.0/26)>`
   - Destination Endpoint Type: Select `Community Endpoint`
   - Destination endpoint: Select `fabrikam-endpoint-website` from the drop down

![image.png](./media/fabrikam-connection-input.png)

5. Select `Review + Create` and then `Create`

6. Once the endpoint resource is created, you can view them in Azure Portal from the `fabrikam` `Enclave connections`. However, it is in a disconnected state because we selected `Yes` to requiring approvals on connections for this endpoint.

![image.png](./media/fabrikam-connection-deployed-disconnected.png)

7. Select `Approvals` to review active approval requests and change the connection to the `connected` state.


...

## Next steps
In this tutorial, you deployed community and enclave endpoints using Azure Portal. You also learned how to:

- [Create connections](./7-create-connections-using-enclaves-and-endpoints.md)
- [Monitor your enclaves](./8-monitor-your-enclaves.md)

In the [next tutorial](./7-create-connections-using-enclaves-and-endpoints.md), you'll learn how to create connections using these endpoints.
