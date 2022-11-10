---
title: Tutorial to configure Azure Active Directory B2C with Datawiza
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with Datawiza for secure hybrid access 
services: active-directory-b2c
author: gargi-sinha
manager: CelesteDG
ms.reviewer: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 09/13/2022
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial: Configure Azure AD B2C with Datawiza to provide secure hybrid access

In this sample tutorial, learn how to integrate Azure Active Directory (AD) B2C with [Datawiza](https://www.datawiza.com/).
Datawiza's [Datawiza Access Broker (DAB)](https://www.datawiza.com/access-broker) enables Single Sign-on (SSO) and granular access control extending Azure AD B2C to protect on-premises legacy applications. Using this solution enterprises can quickly transition from legacy to Azure AD B2C without rewriting applications.

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](./tutorial-create-tenant.md) that's linked to your Azure subscription.

- [Docker](https://docs.docker.com/get-docker/) is required to run DAB. Your applications can run on any platform, such as virtual machine and bare metal.

- An on-premises application that you'll transition from a legacy identity system to Azure AD B2C. In this sample, DAB is deployed on the same server where the application is. The application will run on localhost: 3001 and DAB proxies traffic to application via localhost: 9772. The traffic to the application will reach DAB first and then be proxied to the application.

## Scenario description

Datawiza integration includes the following components:

- **Azure AD B2C**: The authorization server that's responsible for verifying the user's credentials. Authenticated users may access on-premises applications using a local account stored in the Azure AD B2C directory.

- **Datawiza Access Broker (DAB)**: The service user sign-on and transparently passes identity to applications through HTTP headers.

- **Datawiza Cloud Management Console (DCMC)** - A centralized management console that manages DAB. DCMC provides UI and RESTful APIs for administrators to manage the configurations of DAB and its access control policies.

The following architecture diagram shows the implementation.

![Image show the architecture of an Azure AD B2C integration with Datawiza for secure access to hybrid applications](./media/partner-datawiza/datawiza-architecture-diagram.png)

| Steps | Description |
|:-------|:---------------|
| 1. | The user makes a request to access the on-premises hosted application. DAB proxies the request made by the user to the application.|
| 2. | The DAB checks the user's authentication state. If it doesn't receive a session token, or the supplied session token is invalid, then it sends the user to Azure AD B2C for authentication.|
| 3. | Azure AD B2C sends the user request to the endpoint specified during the DAB application's registration in the Azure AD B2C tenant.|
| 4. | The DAB evaluates access policies and calculates attribute values to be included in HTTP headers forwarded to the application. During this step, the DAB may call out to the IdP to retrieve the information needed to set the header values correctly. The DAB sets the header values and sends the request to the application. |
|5.  | The user is now authenticated and has access to the application.|

## Onboard with Datawiza

To integrate your legacy on-premises app with Azure AD B2C, contact [Datawiza](https://login.datawiza.com/df3f213b-68db-4966-bee4-c826eea4a310/b2c_1a_linkage/oauth2/v2.0/authorize?response_type=id_token&scope=openid%20profile&client_id=4f011d0f-44d4-4c42-ad4c-88c7bbcd1ac8&redirect_uri=https%3A%2F%2Fconsole.datawiza.com%2Fhome&state=eyJpZCI6Ijk3ZjI5Y2VhLWQ3YzUtNGM5YS1hOWU2LTg1MDNjMmUzYWVlZCIsInRzIjoxNjIxMjg5ODc4LCJtZXRob2QiOiJyZWRpcmVjdEludGVyYWN0aW9uIn0%3D&nonce=08e1b701-6e42-427b-894b-c5d655a9a6b0&client_info=1&x-client-SKU=MSAL.JS&x-client-Ver=1.3.3&client-request-id=3ac285ba-2d4d-4ae5-8dc2-9295ff6047c6&response_mode=fragment).

## Configure your Azure AD B2C tenant

1. [Register](https://docs.datawiza.com/idp/azureb2c.html#microsoft-azure-ad-b2c-configuration) your web application in Azure AD B2C tenant.

2. [Configure a Sign-up and sign-in user flow](https://docs.datawiza.com/idp/azureb2c.html#configure-a-user-flow) in Azure management portal.

  >[!NOTE]
  >You'll need the tenant name, user flow name, client ID, and client secret later when you set up DAB in the DCMC.

## Create an application on DCMC

1. [Create an application](https://docs.datawiza.com/step-by-step/step2.html) and generate a key pair of `PROVISIONING_KEY` and `PROVISIONING_SECRET` for this application on the DCMC.

2. [Configure Azure AD B2C](https://docs.datawiza.com/tutorial/web-app-azure-b2c.html#part-i-azure-ad-b2c-configuration) as the Identity Provider (IdP)

![Image show values to configure Idp](./media/partner-datawiza/configure-idp.png)

## Run DAB with a header-based application

1. You can use either Docker or Kubernetes to run DAB. The docker image is needed for users to create a sample header-based application. See instructions on how to [configure DAB and SSO integration](https://docs.datawiza.com/step-by-step/step3.html) for more details and how to [deploy DAB with Kubernetes](https://docs.datawiza.com/tutorial/web-app-AKS.html) for Kubernetes-specific instructions. A sample docker image `docker-compose.yml file` is provided for you to download and use. Log in to the container registry to download the images of DAB and the header-based application. Follow [these instructions](https://docs.datawiza.com/step-by-step/step3.html#important-step).

    ```yaml
    version: '3'

    services:
    datawiza-access-broker:
    image: registry.gitlab.com/datawiza/access-broker
    container_name: datawiza-access-broker
    restart: always
    ports:
      - "9772:9772"
    environment:
      PROVISIONING_KEY: #############################
      PROVISIONING_SECRET: #############################

    header-based-app:
    image: registry.gitlab.com/datawiza/header-based-app
    container_name: ab-demo-header-app
    restart: always
    environment:
      CONNECTOR: B2C
    ports:
      - "3001:3001"
    ```

2. After executing `docker-compose -f docker-compose.yml up`, the header-based application should have SSO enabled with Azure AD B2C. Open a browser and type in `http://localhost:9772/`.

3. An Azure AD B2C login page will show up.

## Pass user attributes to the header-based application

1. DAB gets user attributes from IdP and can pass the user attributes to the application via header or cookie. See the instructions on how to [pass user attributes](https://docs.datawiza.com/step-by-step/step4.html) such as email address, firstname, and lastname to the header-based application. 

2. After successfully configuring the user attributes, you should see the green check sign for each of the user attributes.

 ![Image shows passed user attributes](./media/partner-datawiza/pass-user-attributes.png)

## Test the flow

1. Navigate to the on-premises application URL.

2. The DAB should redirect to the page you configured in your user flow.

3. Select the IdP from the list on the page.

4. Once you're redirected to the IdP, supply your credentials as requested, including a Azure AD Multi-Factor Authentication (MFA) token if required by that IdP.

5. After successfully authenticating, you should be redirected to Azure AD B2C, which forwards the application request to the DAB redirect URI.

6. The DAB evaluates policies, calculates headers, and sends the user to the upstream application.  

7. You should see the requested application.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](./custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](./tutorial-create-user-flows.md?pivots=b2c-custom-policy&tabs=applications)
