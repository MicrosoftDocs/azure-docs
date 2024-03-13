---
title: How to use SignalR Service with Azure Application Gateway
description: This article provides information about using Azure SignalR Service with Azure Application Gateway.
author: vicancy
ms.author: lianwei
ms.date: 08/16/2022
ms.service: signalr
ms.topic: how-to
---

# How to use Azure SignalR Service with Azure Application Gateway

Application Gateway is a web traffic load balancer that enables you to manage traffic to your web applications. Using Application Gateway with SignalR Service enables you to do the following:

- Protect your applications from common web vulnerabilities.
- Get application-level load-balancing for your scalable and highly available applications.
- Set up end-to-end security.
- Customize the domain name.

This article contains two parts,

- [The first part](#set-up-and-configure-application-gateway) shows how to configure Application Gateway so that the clients can access SignalR through Application Gateway.
- [The second part](#secure-signalr-service) shows how to secure SignalR Service by adding access control to SignalR Service and only allow traffic from Application Gateway.

:::image type="content" source="./media/signalr-howto-work-with-app-gateway/architecture.png" alt-text="Diagram that shows the architecture of using SignalR Service with Application Gateway.":::

## Set up and configure Application Gateway

### Create a SignalR Service instance

- Follow [the article](./signalr-quickstart-azure-signalr-service-arm-template.md) and create a SignalR Service instance **_ASRS1_**

### Create an Application Gateway instance

Create from the portal an Application Gateway instance **_AG1_**:

- On the [Azure portal](https://portal.azure.com/), search for **Application Gateway** and **Create**.
- On the **Basics** tab, use these values for the following application gateway settings:

  - **Subscription** and **Resource group** and **Region**: the same as what you choose for SignalR Service
  - **Application gateway name**: **_AG1_**
  - **Virtual network**, select **Create new**, and in the **Create virtual network** window that opens, enter the following values to create the virtual network and two subnets, one for the application gateway, and another for the backend servers.

    - **Name**: Enter **_VN1_** for the name of the virtual network.
    - **Subnets**: Update the **Subnets** grid with below 2 subnets

      | Subnet name       | Address range           | Note                                                                                                                                      |
      | ----------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
      | _myAGSubnet_      | (address range)         | Subnet for the application gateway. The application gateway subnet can contain only application gateways. No other resources are allowed. |
      | _myBackendSubnet_ | (another address range) | Subnet for the Azure SignalR instance.                                                                                                    |

  - Accept the default values for the other settings and then select **Next: Frontends**

  :::image type="content" source="./media/signalr-howto-work-with-app-gateway/basics.png" alt-text="Screenshot of creating Application Gateway instance with Basics tab.":::

- On the **Frontends** tab:

  - **Frontend IP address type**: **Public**.
  - Select **Add new** for the **Public IP address** and enter _myAGPublicIPAddress_ for the public IP address name, and then select **OK**.
  - Select **Next: Backends**
    :::image type="content" source="./media/signalr-howto-work-with-app-gateway/application-gateway-create-frontends.png" alt-text="Screenshot of creating Application Gateway instance with Frontends tab.":::

- On the **Backends** tab, select **Add a backend pool**:

  - **Name**: Enter **_signalr_** for the SignalR Service resource backend pool.
  - Backend targets **Target**: the **host name** of your SignalR Service instance **_ASRS1_**, for example `asrs1.service.signalr.net`
  - Select **Next: Configuration**

  :::image type="content" source="./media/signalr-howto-work-with-app-gateway/application-gateway-create-backends.png" alt-text="Screenshot of setting up the application gateway backend pool for the SignalR Service.":::

- On the **Configuration** tab, select **Add a routing rule** in the **Routing rules** column:

  - **Rule name**: **_myRoutingRule_**
  - **Priority**: 1
  - On the **Listener** tab within the **Add a routing rule** window, enter the following values for the listener:
    - **Listener name**: Enter _myListener_ for the name of the listener.
    - **Frontend IP**: Select **Public** to choose the public IP you created for the frontend.
    - **Protocol**: HTTP
      - We use the HTTP frontend protocol on Application Gateway in this article to simplify the demo and help you get started easier. But in reality, you may need to enable HTTPs and Customer Domain on it with production scenario.
    - Accept the default values for the other settings on the **Listener** tab
    :::image type="content" source="./media/signalr-howto-work-with-app-gateway/application-gateway-create-rule-listener.png" alt-text="Screenshot of setting up the application gateway routing rule listener tab for the SignalR Service.":::
  - On the **Backend targets** tab, use the following values:

    - **Target type**: Backend pool
    - **Backend target**: select **signalr** we previously created
    - **Backend settings**: select **Add new** to add a new setting.

      - **Backend settings name**: _mySetting_
      - **Backend protocol**: **HTTPS**
      - **Use well known CA certificate**: **Yes**
      - **Override with new host name**: **Yes**
      - **Host name override**: **Pick host name from backend target**
      - Others keep the default values

      :::image type="content" source="./media/signalr-howto-work-with-app-gateway/application-gateway-setup-backend.png" alt-text="Screenshot of setting up the application gateway backend setting for the SignalR Service.":::

    :::image type="content" source="./media/signalr-howto-work-with-app-gateway/application-gateway-create-rule-backends.png" alt-text="Screenshot of creating backend targets for application gateway.":::

- Review and create the **_AG1_**
  :::image type="content" source="./media/signalr-howto-work-with-app-gateway/application-gateway-review.png" alt-text="Screenshot of reviewing and creating the application gateway instance.":::

### Configure Application Gateway health probe

When **_AG1_** is created, go to **Health probes** tab under **Settings** section in the portal, change the health probe path to `/api/health`

:::image type="content" source="./media/signalr-howto-work-with-app-gateway/health-probe.png" alt-text="Screenshot of setting up the application gateway backend health probe for the SignalR Service.":::

### Quick test

- Try with an invalid client request `https://asrs1.service.signalr.net/client` and it returns _400_ with error message _'hub' query parameter is required._ It means the request arrived at the SignalR Service and did the request validation.
  ```bash
  curl -v https://asrs1.service.signalr.net/client
  ```
  returns
  ```
  < HTTP/1.1 400 Bad Request
  < ...
  <
  'hub' query parameter is required.
  ```
- Go to the Overview tab of **_AG1_**, and find out the Frontend public IP address

  :::image type="content" source="./media/signalr-howto-work-with-app-gateway/quick-test.png" alt-text="Screenshot of quick testing SignalR Service health endpoint through Application Gateway.":::

- Visit the health endpoint through **_AG1_** `http://<frontend-public-IP-address>/client`, and it also returns _400_ with error message _'hub' query parameter is required._ It means the request successfully went through Application Gateway to SignalR Service and did the request validation.

  ```bash
  curl -I http://<frontend-public-IP-address>/client
  ```

  returns

  ```
  < HTTP/1.1 400 Bad Request
  < ...
  <
  'hub' query parameter is required.
  ```

### Run chat through Application Gateway

Now, the traffic can reach SignalR Service through the Application Gateway. The customer could use the Application Gateway public IP address or custom domain name to access the resource. Let’s use [this chat application](https://github.com/aspnet/AzureSignalR-samples/tree/main/samples/ChatRoom) as an example. Let's start with running it locally.

- First let's get the connection string of **_ASRS1_**

  - On the **Connection strings** tab of **_ASRS1_**
    - **Client endpoint**: Enter the URL using frontend public IP address of **_AG1_**, for example `http://20.88.8.8`. It's a connection string generator when using reverse proxies, and the value isn't preserved when next time you come back to this tab. When value entered, the connection string appends a `ClientEndpoint` section.
    - Copy the Connection string
    :::image type="content" source="./media/signalr-howto-work-with-app-gateway/connection-string.png" alt-text="Screenshot of getting the connection string for SignalR Service with client endpoint.":::

- Clone the GitHub repo https://github.com/aspnet/AzureSignalR-samples
- Go to samples/Chatroom folder:
- Set the copied connection string and run the application locally, you can see that there's a `ClientEndpoint` section in the ConnectionString.

  ```bash
  cd samples/Chatroom
  dotnet restore
  dotnet user-secrets set Azure:SignalR:ConnectionString "<copied-onnection-string-with-client-endpoint>"
  dotnet run
  ```

- Open http://localhost:5000 from the browser and use F12 to view the network traces, you can see that the WebSocket connection is established through **_AG1_**

  :::image type="content" source="./media/signalr-howto-work-with-app-gateway/chat-local-run.png" alt-text="Screenshot of running chat application locally with App Gateway and SignalR Service.":::

## Secure SignalR Service

In previous section, we successfully configured SignalR Service as the backend service of Application Gateway, we can call SignalR Service directly from public network, or through Application Gateway.

In this section, let's configure SignalR Service to deny all the traffic from public network and only accept traffic from Application Gateway.

### Configure SignalR Service

Let's configure SignalR Service to only allow private access. You can find more details in [use private endpoint for SignalR Service](howto-private-endpoints.md).

- Go to the SignalR Service instance **_ASRS1_** in the portal.
- Go the **Networking** tab:

  - On **Public access** tab: **Public network access** change to **Disabled** and **Save**, now you're no longer able to access SignalR Service from public network

    :::image type="content" source="./media/signalr-howto-work-with-app-gateway/disable-public-access.png" alt-text="Screenshot of disabling public access for SignalR Service.":::

  - On **Private access** tab, select **+ Private endpoint**:
    - On **Basics** tab:
      - **Name**: **_PE1_**
      - **Network Interface Name**: **_PE1-nic_**
      - **Region**: make sure to choose the same region as your Application Gateway
      - Select **Next: Resources**
    - On **Resources** tab
      - Keep default values
      - Select **Next: Virtual Network**
    - On **Virtual Network** tab
      - **Virtual network**: Select previously created **_VN1_**
      - **Subnet**: Select previously created **_VN1/myBackendSubnet_**
      - Others keep the default settings
      - Select **Next: DNS**
    - On **DNS** tab
      - **Integration with private DNS zone**: **Yes**
    - Review and create the private endpoint

  :::image type="content" source="./media/signalr-howto-work-with-app-gateway/application-gateway-setup-private-endpoint.png" alt-text="Screenshot of setting up the private endpoint resource for the SignalR Service.":::  


### Refresh Application Gateway backend pool

Since Application Gateway was set up before there was a private endpoint for it to use, we need to **refresh** the backend pool for it to look at the Private DNS Zone and figure out that it should route the traffic to the private endpoint instead of the public address. We do the **refresh** by setting the backend FQDN to some other value and then changing it back.

Go to the **Backend pools** tab for **_AG1_**, and select **signalr**:

- Step1: change Target `asrs1.service.signalr.net` to some other value, for example, `x.service.signalr.net`, and select **Save**
- Step2: change Target back to `asrs1.service.signalr.net`

### Quick test

- Now let's visit `https://asrs1.service.signalr.net/client` again. With public access disabled, it returns _403_ instead.
  ```bash
  curl -v https://asrs1.service.signalr.net/client
  ```
  returns
  ```
  < HTTP/1.1 403 Forbidden
  ```
- Visit the endpoint through **_AG1_** `http://<frontend-public-IP-address>/client`, and it returns _400_ with error message _'hub' query parameter is required_. It means the request successfully went through the Application Gateway to SignalR Service.

  ```bash
  curl -I http://<frontend-public-IP-address>/client
  ```

  returns

  ```
  < HTTP/1.1 400 Bad Request
  < ...
  <
  'hub' query parameter is required.
  ```

Now if you run the Chat application locally again, you'll see error messages `Failed to connect to .... The server returned status code '403' when status code '101' was expected.`, it is because public access is disabled so that localhost server connections are longer able to connect to the SignalR service.

Let's deploy the Chat application into the same VNet with **_ASRS1_** so that the chat can talk with **_ASRS1_**.

### Deploy the chat application to Azure

- On the [Azure portal](https://portal.azure.com/), search for **App services** and **Create**.

- On the **Basics** tab, use these values for the following application gateway settings:
  - **Subscription** and **Resource group** and **Region**: the same as what you choose for SignalR Service
  - **Name**: **_WA1_**
  * **Publish**: **Code**
  * **Runtime stack**: **.NET 6 (LTS)**
  * **Operating System**: **Linux**
  * **Region**: Make sure it's the same as what you choose for SignalR Service
  * Select **Next: Docker**
- On the **Networking** tab
  - **Enable network injection**: select **On**
  - **Virtual Network**: select **_VN1_** we previously created
  - **Enable VNet integration**: **On**
  - **Outbound subnet**: create a new subnet
  - Select **Review + create**

Now let's deploy our chat application to Azure. Below we use Azure CLI to deploy the web app, you can also choose other deployment environments following [publish your web app section](/azure/app-service/quickstart-dotnetcore#publish-your-web-app).

Under folder samples/Chatroom, run the below commands:

```bash
# Build and publish the assemblies to publish folder
dotnet publish --os linux -o publish
# zip the publish folder as app.zip
cd publish
zip -r app.zip .
# use az CLI to deploy app.zip to our webapp
az login
az account set -s <your-subscription-name-used-to-create-WA1>
az webapp deployment source config-zip -n WA1 -g <resource-group-of-WA1> --src app.zip
```

Now the web app is deployed, let's go to the portal for **_WA1_** and make the following updates:

- On the **Configuration** tab:

  - New application settings:

    | Name                       | Value             |
    | -------------------------- | ----------------- |
    | **WEBSITE_DNS_SERVER**     | **168.63.129.16** |
    | **WEBSITE_VNET_ROUTE_ALL** | **1**             |

  - New connection string:

    | Name                                 | Value                                                  | Type              |
    | ------------------------------------ | ------------------------------------------------------ | ----------------- |
    | **Azure**SignalR**ConnectionString** | The copied connection string with ClientEndpoint value | select **Custom** |

  :::image type="content" source="./media/signalr-howto-work-with-app-gateway/web-app-settings.png" alt-text="Screenshot of configuring web app connection string.":::

- On the **TLS/SSL settings** tab:

  - **HTTPS Only**: **Off**. To Simplify the demo, we used the HTTP frontend protocol on Application Gateway. Therefore, we need to turn off this option to avoid changing the HTTP URL to HTTPs automatically.

- Go to the **Overview** tab and get the URL of **_WA1_**.
- Get the URL, and replace scheme https with http, for example, `http://wa1.azurewebsites.net`, open the URL in the browser, now you can start chatting! Use F12 to open network traces, and you can see the SignalR connection is established through **_AG1_**.

  > [!NOTE]
  >
  > Sometimes you need to disable browser's auto https redirection and browser cache to prevent the URL from redirecting to HTTPS automatically.

  :::image type="content" source="./media/signalr-howto-work-with-app-gateway/web-app-run.png" alt-text="Screenshot of running chat application in Azure with App Gateway and SignalR Service.":::

## Next steps

Now, you have successfully built a real-time chat application with SignalR Service and used Application Gateway to protect your applications and set up end-to-end security. [Learn more about SignalR Service](./signalr-overview.md).
