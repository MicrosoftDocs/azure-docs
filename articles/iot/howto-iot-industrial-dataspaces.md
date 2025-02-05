---
title: "Enable an industrial dataspace on Azure"
description: "Step by step guide that shows how to enable an industrial dataspace on Azure based on open-source reference implementations."
author: barnstee
ms.author: erichb
ms.service: azure-iot
ms.topic: how-to #Don't change.
ms.date: 1/31/2025

#customer intent: As a manufacturer, I need to provide machine-readable product data to my customers.

---

# Enable an industrial dataspace on Azure

Many manufacturers need to provide data about their manufactured products to their customers in digital and machine-readable from. Sometimes a law such as the European Commission's [Digital Product Passport](https://data.europa.eu/news-events/news/eus-digital-product-passport-advancing-transparency-and-sustainability) legislation mandates this requirement. To provide this data, manufacturers often create an industrial dataspace between their enterprise systems and their customer's system. The dataspace provides a secure, point-to-point communication channel for digital product data between the manufacturer and the customer.

## What is an industrial dataspace?

An industrial dataspace is a virtual environment designed to facilitate the secure and efficient exchange of data between different organizations within an industrial ecosystem, focusing on the following key principles:

* **Data sovereignty**: It ensures that data providers retain control over their data, including who can access it and under what conditions.
* **Interoperability**: It uses standardized protocols and governance models to enable seamless data sharing across various platforms and industries.
* **Security**: It incorporates robust security measures to protect data integrity and confidentiality.
* **Collaboration**: It supports collaborative efforts by allowing different stakeholders to share and utilize data for mutual benefit.

These principles are relevant in the context of *Industry 4.0*, where interconnected systems and data-driven decision-making are crucial for optimizing industrial processes and creating resilient supply chains.

The following diagram shows an overview of the solution:

:::image type="content" source="media/howto-iot-industrial-dataspaces/dataspaces-arch.png" alt-text="Diagram of an industrial IoT architecture that shows all components." lightbox="media/howto-iot-industrial-dataspaces/dataspaces-arch.png" border="false" :::

To learn more about the components in the solution, see the [Azure Industrial IoT reference architecture](tutorial-iot-industrial-solution-architecture.md) tutorial.

## Prerequisites

All the required components to enable the industrial dataspace are deployed to Azure during the [install the production line simulation and cloud services](tutorial-iot-industrial-solution-architecture.md#install-the-production-line-simulation-and-cloud-services) workflow. Make sure the simulated production lines are running before you continue.

## Industrial dataspace use case: Provide a carbon footprint for your produced products

Providing the Product Carbon Footprint (PCF) is one of the most popular use cases for industrial dataspaces. It's increasingly important in the buying decision for customers. Products with a low PCF are popular, but accurately calculating the PCF is hard. The [Green-House Gas (GHG) Protocol](https://ghgprotocol.org) is a popular calculation method for the PCF. It splits up the calculation task into scope 1, scope 2, and scope 3 emissions. This example and reference implementation focuses on calculating scope 2 emissions from the simulated production lines. Scope 2 emissions are the emissions produced during a production process. The simulated stations along the production lines provide energy consumption data during production. This energy consumption data is used to calculate scope 2 carbon footprint data for each produced product, if the *marginal carbon intensity* of the electrical energy consumed is known for the location of the simulated production lines. This information is optionally retrieved from a non-Microsoft cloud service operated by [WattTime](https://watttime.org). If the WattTime service isn't configured, the calculation uses an average value.

## IEC 63278 Asset Administration Shell

To provide product data in a machine-readable and standardized fashion, this example uses the IEC 63278 Asset Administration Shell (AAS). This example automatically creates an AAS for a sample of the simulated products produced and stored in an AAS repository. The repository is provided as an open-source reference implementation by the [Digital Twin Consortium](https://www.digitaltwinconsortium.org). This reference implementation supports AAS modeling with [OPC UA](https://opcfoundation.org/about/opc-technologies/opc-ua). This approach simplifies AAS modeling because you can use any OPC UA modeling tool such as the [Siemens OPC UA Modeling Editor (SiOME)](https://support.industry.siemens.com/cs/document/109755133/siemens-opc-ua-modeling-editor-(siome)?dti=0&lc=en-US) or the [CESMII Smart Manufacturing Profile Designer](https://profiledesigner.cesmii.net). The configuration of the deployed AAS repository happens automatically during the deployment workflow and comes with its own web dashboard. To access the dashboard, navigate to the **Overview** page of the AAS repository Container App from the Azure portal, and select the **Application URL** displayed to open the repository's dashboard. Expand the **AAS Environment** tree control to see the individual Asset Admin Shells. Navigate to the **AAS Environment > Objects > Submodels > CarbonFootprint > ProductCarbonFootprint > PCFCO2eq** node in the OPC UA tree and select it to display the calculated scope 2 CO2 PCF.

> [!NOTE]
> The AAS repository has a REST interface that's [OpenAPI](https://swagger.io/specification) compatible. To access the Swagger UI, add `/swagger` to the AAS repository URL in your web browser. To authenticate and authorize with the REST interface, select **Authorize** on the Swagger webpage. Enter `admin` as the username and use the password you chose during deployment of this reference solution for the password, then select **Authorize** followed by **Close**. To try out any of the REST interface methods, select it, select **Try it out**, provide any necessary parameters, and select **Execute**. The response from the AAS repository is available in the **Server response** text box.

### Optionally, configure the WattTime service

Optionally, to optionally configure the WattTime service for a more accurate carbon footprint calculation:

1. Go to [Register New User](https://docs.watttime.org/#tag/Authentication/operation/post_username_register_post) and choose a username and password for the service. You need these credentials later in this guide.

1. From a Windows command prompt, enter `wsl` to start the Windows Subsystem for Linux. If WSL isn't yet installed on your computer, install it by running `wsl --install` and reboot your computer.

1. To register your user account, enter the following command, making sure you replace `<username>` and `<password>` with the values you chose previously: `curl -L -X POST -d '{"username":"<username>","password":"<password>","email":"john@johnson.com"}' https://api.watttime.org/register --header 'Content-Type: application/json' --header 'Accept: application/json'`.

1. From a web browser, navigate to the [online basic auth header generator](https://www.debugbear.com/basic-auth-header-generator) and enter your username and password. Copy the generated access token.

1. To validate your registration, sign in to the service using the following command, making sure you replace `<YOUR_ACCESS_TOKEN>` with the token from the previous step:  `curl -L -X GET https://api.watttime.org/login -H 'Authorization: Basic <YOUR_ACCESS_TOKEN>'`. If the validation succeeds, you get a token as a response.

1. [Contact WattTime](https://watttime.org/contact) to upgrade your free account to a pro account. The free account only gives you access to the CAISO_North sub-region, but you need access to the location of the simulated production lines in Munich and Seattle.

1. Wait until you receive an email from WattTime that your account was upgraded to a pro account. Then, from the Azure portal, navigate to the Azure Container App instance for the deployed AAS repository. Follow the steps in [Add environment variables on existing container apps](/azure/container-apps/environment-variables?tabs=portal#add-environment-variables-on-existing-container-apps), navigate to the **Environment variables** section of the **Edit a container** panel, select **Manual entry** for the **Source** field, and enter your WattTime username and password in the **Value** field of the two existing environment variables **WATTTIME_USER** and **WATTTIME_PASSWORD**. Select **Save** and then **Create** to deploy a new revision of your AAS repository.

## ISO 20151 Eclipse Dataspace Components

The [Eclipse Dataspace Components (EDC)](https://eclipse-edc.github.io) is designed to support secure and sovereign data sharing between organizations. Here are the main components:

* **Connector**: Facilitates data exchange between participants such as the manufacturer of products and the customer of the manufactured products. Two connectors, a *provider* connector and a *consumer* connector, are automatically deployed in this reference solution.
* **Federated Catalog**: Enables participants to discover and publish data offerings.
* **Identity Hub**: Manages identities and ensures secure access.
* **Registration Service**: Handles the registration of participants and their data assets.
* **Data Dashboard (Management UI)**: Provides a user interface for managing and monitoring the dataspace.

These components are open source, designed to be extensible and interoperable, and support various protocols and standards.

### Configure the Eclipse Dataspace Connectors

The two EDC Connectors *provider* and *consumer* automatically deployed are provided as an open-source reference implementation by [Fraunhofer IOSB](https://www.iosb.fraunhofer.de/projects-and-products/faaast-tools-digital-twins-asset-administration-shell-industrie40.html) as part of the FA³ST ecosystem for AAS management. The connectors contain an extension for accessing an Asset Admin Shell repository like the one deployed in this reference solution. To configure the connectors, follow these steps:

1. From the Azure portal, navigate to the overview page of your **AAS repository** instance. Copy the **Application URL** displayed.

1. From a web browser, navigate to the [online URL encoder](https://www.urlencoder.org) and copy the AAS repository application URL into the text box, add `/api/v3.0` at the end of the URL and select **Encode**. Then copy the encoded URL.

1. From the Azure portal, navigate to the overview page of your **EDC provider** instance. Copy the **Application URL** displayed.

1. From a Windows command prompt, enter `wsl` to start the Windows Subsystem for Linux. If WSL isn't yet installed on your computer, install it by running `wsl --install` and reboot your computer.

1. To register the AAS repository with the EDC provider, enter `curl -L '<EDC provider URL>:8281/api/service?url=<URL-encoded AAS repository URL>' -d '{"type":"basic","username":"admin","password":"<deployment password>"}' --header 'Content-Type: application/json' --header 'x-api-key: password'`. Replace the `<EDC provider URL>` with the previously copied EDC provider URL but change `https` to `http`, replace the `<URL-encoded AAS repository URL>` with the previously copied URL-encoded AAS repository URL and replace the `<deployment password>` with the password you picked during deployment of this reference solution. The message **Registered new AAS Service at EDC** confirms a successful registration.

1. To display the metadata provided to the EDC provider from the AAS repository, navigate to `<EDC provider URL>:8281/api/selfDescription` in your web browser. Replace the `<EDC provider URL>` with the previously copied EDC provider URL but change `https` to `http`. You might need to check the **Pretty-print** checkbox in your browser, if available, to read the formatted version of the returned data. From the **submodels** section, copy one of the **id** values displayed, you need this value in the next section of this guide.

### Trigger an automatic digital contract negotiation through the dataspace protocol and transfer a PCF

The EDC Connector supports an automated EDC digital contract negotiation where the entire workflow is handled automatically. To trigger this automatic contract negotiation, followed by the transfer of a PCF from the AAS submodel for which you copied the ID in the previous step, complete the following steps:

1. In the Azure portal, navigate to the overview page of your **EDC provider** instance. Copy the **Application URL** displayed.

1. In a web browser, navigate to the [online URL encoder](https://www.urlencoder.org) and copy the EDC provider application URL into the text box, but change `https` to `http`, and select **Encode**. Then copy the encoded URL.

1. In the Azure portal, navigate to the overview page of your **EDC consumer** instance. Copy the **Application URL** displayed.

1. At a Windows command prompt, enter `wsl` to start the Windows Subsystem for Linux. If WSL isn't yet installed on your computer, install it by running `wsl --install` and reboot your computer.

1. To see the AAS submodel containing the PCF returned in a JSON document, enter `curl -L -X POST '<EDC consumer URL>:9291/api/automated/negotiate?providerId=provider&assetId=<assetId>&providerUrl=<URL-encoded provider URL>%3A8282%2Fdsp' --header 'x-api-key: password'`. Replace `<EDC consumer URL>` with the previously copied EDC consumer URL but change `https` to `http`, replace `<assetId>` with the AAS submodel ID copied in the previous section, and replace `<URL-encoded EDC provider URL>` with the previously copied URL-encoded EDC provider URL.
