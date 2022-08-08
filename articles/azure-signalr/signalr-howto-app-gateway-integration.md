---
title: How to integrate Azure SignalR with Azure Application Gateway
description: This article provides information about integrating Azure SignalR with Azure Application Gateway
author: vicancy
ms.author: lianwei
ms.date: 08/08/2022
ms.service: signalr
ms.topic: how-to
---

# How to integrate Azure SignalR with Azure Application Gateway

Azure Application Gateway is a web traffic load balancer that enables you to manage traffic to your web applications. Using the Azure Application Gateway with Azure SignalR Service enables you to:  

* Protect your applications from common web vulnerabilities.  
* Get application-level load-balancing for your scalable and highly available applications. 
* Setup end to end secure.
* Customize the domain name. 
 

Let’s go through the key steps together and learn how to implement this reference solution:  

* The Application Gateway helps you protect your applications and setup end to end secure.  
* The client cannot access the Azure SignalR Service instance through public network, and all the traffic is managed through Application Gateway.  
* The traffic between App Service and SignalR Service is also protected by Virtual Network.

:::image type="content" source="./media/signalr-howto-app-gateway-integration/arch.png" alt-text="The architecture of the Azure SignalR and Azure Application Gateway integration.":::

## Setup the Virtual Network

* Create the [Virtual Network](https://azure.microsoft.com/services/virtual-network) **_VN1_**. 
* There is a default subnet already created, and add 2 new subnets: 
    * Subnet **_applicationSN_** for your [App Service](https://azure.microsoft.com/services/app-service/) or [Azure Functions](https://azure.microsoft.com/services/functions/).  
    * Subnet **_gatewaySN_** for Application Gateway. 

:::image type="content" source="./media/signalr-howto-app-gateway-integration/step1.png" alt-text="Setup the Virtual Network for the Azure SignalR and Azure Application Gateway integration.":::   

## Setup SignalR Service  
* Create the resource of Azure SignalR Service **_ASRS1_**. 
* Go to the **_ASRS1_** in the portal. 
* Go to the *Private endpoint connections* blade, and create a new private endpoint **_PE1_** with the **_VN1_** and its **_default subnet_**. Learn more details about [use private endpoint for Azure SignalR Service](howto-private-endpoints.md). 
    * Resource 
        * Resource Type: Microsoft.SignalRService/SignalR 
        * Resource: **_ASRS1_**
    * Configuration 
        * Integration with private DNS zone: Yes 
        * Subnet: **_default_** subnet in **_VN1_** 

    :::image type="content" source="./media/signalr-howto-app-gateway-integration/step2.png" alt-text="Setup the private endpoint resource for the Azure SignalR.":::  

    :::image type="content" source="./media/signalr-howto-app-gateway-integration/step3.png" alt-text="Setup the private endpoint configuration for the Azure SignalR.":::  

* Go to the network access control blade of ASRS1 and **disable** the all connections in public network.  

## Setup the Application Gateway  

* Create the [Application Gateway](https://azure.microsoft.com/services/application-gateway) **_AG1_**  
* In the Basic, use the **_VN1_** and **_gatewaySN_** to configure the virtual network.

    :::image type="content" source="./media/signalr-howto-app-gateway-integration/step4.png" alt-text="Setup the application gateway network for the Azure SignalR.":::  

* In the Frontends, create a new public address.

    :::image type="content" source="./media/signalr-howto-app-gateway-integration/step5.png" alt-text="Setup the application gateway public address for the Azure SignalR.":::  

* In the Backends, create a new backend pool **_signalr_** for the SignalR Service resource. You need to use the **host name** of the SignalR Service resource as the Target. 

    :::image type="content" source="./media/signalr-howto-app-gateway-integration/step6.png" alt-text="Setup the application gateway backend pool for the Azure SignalR.":::  

    * In the Configuration, add a new routing rule **_signalrrule_** to route the traffic to SignalR Service. You need to create a new HTTP setting.  
        * Listener 
            * Protocol: HTTP (We use the HTTP frontend protocol on Application Gateway in this blog to simplify the demo and help you get started easier. But in reality, you may need to enable HTTPs and Customer Domain on it with production scenario.) 
        * Backend targets  
            * Target type: Backend pool 
            * Add new HTTP setting  
                * Backend protocol: HTTPs 
                * Use well known CA certificate: Yes 
                * Override with new host name: Yes 
                * Host name override: Pick host name from backend target.
    
    :::image type="content" source="./media/signalr-howto-app-gateway-integration/step7.png" alt-text="Setup the application gateway routing rule for the Azure SignalR."::: 
     
    :::image type="content" source="./media/signalr-howto-app-gateway-integration/step8.png" alt-text="Setup the application gateway HTTP setting for the Azure SignalR.":::   

* Review and create the **_AG1_**

    :::image type="content" source="./media/signalr-howto-app-gateway-integration/step9.png" alt-text="Setup the application gateway overview for the Azure SignalR."::: 

## Quick check
Now, we already setup the Virtual Network, SignalR Service and Application Gateway. Let’s quick test whether the configuration is correct.  
* Go to the network access control blade of **_ASRS1_** and set public network to allow server connection only.   

    :::image type="content" source="./media/signalr-howto-app-gateway-integration/step10.png" alt-text="Allow server connection only network access for the Azure SignalR.":::
* Go to **_AG1_**, open health probe, change the health probe path to /api/v1/health

    :::image type="content" source="./media/signalr-howto-app-gateway-integration/step11.png" alt-text="Setup the health probe for the Azure SignalR.":::
* Go to the Overview blade of **_AG1_**, and find out the Frontend public IP address 
* Open http://<frontend-public-IP-address>, and it should return 403.
* Open http://<frontend-public-IP-address>/api/v1/health, and it should return 200. 
* Go back to the network access control blade of **_ASRS1_** and disable the server connection in public network.  

## Run a Chat Application Locally  
Now, the traffic to Azure SignalR is already managed by the Application gateway. The customer could only use the public IP address or custom domain name to access the resource. In this blog, let’s use the chat application as an example, and start from running it locally.  

* Clone the github repo https://github.com/aspnet/AzureSignalR-samples 
* Go to the **Keys** blade of **_ASRS1_** and get the connection string  
* Go to samples/Chatroom and open the shell 
* Set the connection string and run the application locally, note that there is a `ClientEndpoint` section in the ConnectionString.

    ```bash
    dotnet restore 
    dotnet user-secrets set Azure:SignalR:ConnectionString "<connection-string-of-ASR1>;ClientEndpoint=http://< frontend-public-IP-address-of-AG1>" 
    dotnet run 
    ```
* Open http://localhost:5000 and view network traces via explorer to see WebSocket connection is established through **_AG1_**  

    :::image type="content" source="./media/signalr-howto-app-gateway-integration/step12.png" alt-text="Run chat application locally with App Gateway and Azure SignalR.":::

## Deploy the Chat Application to Azure 
* Create a Web App **_WA1_**. 
    * Publish: Code 
    * Runtime stack: .NET Core 3.1 
    * Operation System: Windows 
* Go to Networking blade and configure the VNET integration.  
* Select **_VN1_** and webapp subnet **_applicationSN_**  
* Publish the Web App with CLI 
    * Publish the application and its dependencies to a folder for deployment 

    ```bash
    dotnet publish -c Release
    ```
    * Package the bin\Release\netcoreapp3.1\publish folder as **_app.zip_**.  
    * Perform deployment using the kudu zip push deployment.

    ```bash
    az login  
    az account set –subscription <your-subscription-name-used-to-create-WA1> 
    az webapp deployment source config-zip -n WA1 -g <resource-group-of-WA1> --src app.zip 
    ```
    *  Go to the Configuration blade of **_WA1_**, and add following application setting to set connection string and enable private DNS zone. 

    ```
    Azure__SignalR__ConnectionString=<connection-string-of-ASR1>;ClientEndpoint=http://< frontend-public-IP-address-of-AG1> 
    WEBSITE_DNS_SERVER=168.63.129.16 
    WEBSITE_VNET_ROUTE_ALL=1  
    ```
    * Go to the TLS/SSL settings blade of **_WA1_**, and turn off the _HTTPS Only_. To Simplify the demo, we used the HTTP frontend protocol on Application Gateway. Therefore, we need to turn off this option to avoid changing the HTTP URL to HTTPs automatically.  
    * Go to the Overview blade and get the URL of **_WA1_**. 
    * Open the URL by replacing the https with http, and open network traces to see WebSocket connection is established through **_AG1_**  


## Next Steps 

Now, you are successful to build a real-time chatroom application with Azure SignalR Service and use Application Gateway to protect your applications and setup end to end secure. [Explore more about Azure SignalR from here](./signalr-overview.md).