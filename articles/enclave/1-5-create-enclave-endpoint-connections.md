---
title: Create enclave or community endpoint resources in Azure Enclave
description: Create enclave or community endpoint resources in Azure Enclave.
author: aserfass-msft
ms.author: aserfass
ms.topic: tutorial
ms.date: 06/12/2026
---

# Tutorial 1-5: Create enclave or community endpoint resources in Azure Enclave

Community endpoints enable enclaves in a community to establish connections to resources outside of the community boundary to include public websites, public IP addresses, and external private networks through Site-to-Site (S2S) VPN or ExpressRoute connections. Enclave endpoints enable others to connect to your service by defining the means by which inbound traffic is allowed to flow into a given enclave once a connection is made.

In this tutorial, part six of eight, you create community and enclave endpoint resources. You learn how to:

  - Create community endpoint resources in communities
  - Create enclave endpoint resources in enclaves
  - View your endpoints in Azure portal

## Before you begin
In the previous tutorials, you created a [community](./1-1-create-community.md) and an [enclave](./1-2-create-enclaves-inside-community.md) using the Azure portal.

## Create an enclave endpoint

1. Navigate to an enclave hosting a service you want to make available to other enclaves in the community

1. While in your enclave's page, select `Enclave Endpoints` on the left side, and select `Create`.

    [ ![Screenshot showing the highlighted create button for enclave endpoints.](./media/tutorial-step-five-enclave-webapp-endpoint-list-create.png) ](./media/tutorial-step-five-enclave-webapp-endpoint-list-create.png#lightbox)

1. Enter your enclave endpoint name and then select `Next`:
   - Enclave endpoint name: Name of the enclave endpoint `ee-MyService`

1. Enter the endpoint rules for your app:
   - Select `+ Add` to add Endpoint Rules that represent how to access your app
      - Rule Name: `WebAppEndpointRules`
      - Destination IP/CIDR range: `<See the information box that gives your enclave webapp-subnet range (for example 10.0.2.0/26) and make sure there are no commas at the end>`
      - Protocol: `ANY`
      - Port: `443`

    [ ![Screenshot showing the enclave endpoint creation screen with endpoint rule dialog open as well.](./media/tutorial-step-five-enclave-webapp-endpoint-rule.png) ](./media/tutorial-step-five-enclave-webapp-endpoint-rule.png#lightbox)

1. Select `Save`, select `Review + Create`, and select `Create`

1. Once the endpoint resource is created, you can view them in Azure portal from the Enclave-WebApp `Enclave Endpoints`.

    [ ![Screenshot showing the completed enclave endpoint overview page.](./media/tutorial-step-five-enclave-webapp-endpoint-deployed.png) ](./media/tutorial-step-five-enclave-webapp-endpoint-deployed.png#lightbox)

## Create a community endpoint

1. Go to the `fabrikam` community and select `Community Endpoints`, and then select `Create`.

    [ ![Screenshot showing no existing community endpoints.](./media/tutorial-step-five-fabrikam-endpoint-list.png) ](./media/tutorial-step-five-fabrikam-endpoint-list.png#lightbox)

1. Enter the community endpoint name and then select `Next`:
   - Community endpoint name: `ce-fabrikam-website`

1. Enter the endpoint rules for your app:
   - Select `+ Add` to add Endpoint Rules that represent how to access your app
      - Rule Name: `Website-Rule`
      - Destination Type: `FQDN`
      - Destination: `*microsoft.com`
      - Protocol: `HTTPS`
      - Port: `443`

    [ ![Screenshot showing the creation page for the community endpoint with the required inputs.](./media/tutorial-step-five-fabrikam-endpoint-rules.png) ](./media/tutorial-step-five-fabrikam-endpoint-rules.png#lightbox)

1. Select `Save`, select `Review + Create`, and select `Create`.

1. Once the endpoint resource is created, you can view them in Azure portal from the Enclave-WebApp enclave endpoint page.

    [ ![Screenshot showing the completed community endpoint.](./media/tutorial-step-five-fabrikam-endpoint-deployed.png) ](./media/tutorial-step-five-fabrikam-endpoint-deployed.png#lightbox)

## Create an enclave connection
Create an enclave connection from the web app enclave to the community endpoint so the app can reach required site outside the community.

1. From the `cmt-fabrikam` community, select  `Enclave Connections`, then select `Create`.

   [ ![Screenshot showing no existing enclave connections.](./media/tutorial-step-five-fabrikam-connection-list.png) ](./media/tutorial-step-five-fabrikam-connection-list.png#lightbox)

1. Enter the details for your app/service
   - Resource Group: `myResourceGroup`
   - Enclave connection name: Name of the connection `ec-fabrikam-external-connection`
   - Community: Select `cmt-fabrikam` from the dropdown
   - Source Type: Select `Enclave`
   - Source enclave: Select `ve-Enclave-WebApp` from the dropdown
   - Source IP addresses/CIDR range(s): `<See the information box that gives your enclave subnet range (for example 10.0.2.0/26) and make sure there are no commas at the end>`
   - Destination Endpoint Type: Select `Community Endpoint`
   - Destination endpoint: Select `ce-fabrikam-website` from the dropdown

   [ ![Screenshot showing the required information entered into the enclave connection page.](./media/tutorial-step-five-fabrikam-connection-input.png) ](./media/tutorial-step-five-fabrikam-connection-input.png#lightbox)

1. Select `Review + Create` and then `Create`

   [ ![Screenshot showing the deployment finished and the connection is waiting for an approval.](./media/tutorial-step-five-fabrikam-connection-approval-pending.png) ](./media/tutorial-step-five-fabrikam-connection-approval-pending.png#lightbox)

1. Once the endpoint resource is created, you can view them in Azure portal from the `cmt-fabrikam` `Enclave Connections`. However, it's in a disconnected state because the community requires approvals on all new enclave connections and updates to those connections. 

   [ ![Screenshot showing the enclave connection created but in a disconnected state while pending approval.](./media/tutorial-step-five-fabrikam-connection-deployed-disconnected.png) ](./media/tutorial-step-five-fabrikam-connection-deployed-disconnected.png#lightbox)

1. Review the pending approvals in `Approvals` on the left for the enclave.

   [ ![Screenshot showing the pending connection approval.](./media/tutorial-step-five-fabrikam-connection-approval-review.png) ](./media/tutorial-step-five-fabrikam-connection-approval-review.png#lightbox)

1. Approve the pending approvals and the connection state is automatically updated to the `connected` state. For more information about reviewing approval requests, see [Manage approval requests](./manage-approvals.md). For resource-type approval settings, see [Configure approval settings](./configure-approvals.md).

## Next steps
In this tutorial, you deployed community and enclave endpoints using Azure portal. You also learned how to:

- [Create connections](./what-enclave-connection.md)

In the [next tutorial](./1-6-monitor-your-enclaves.md), you'll learn how to create connections using these endpoints.
