---
title: Secure hybrid access with Datawiza
titleSuffix: Azure AD
description: In this tutorial, learn how to integrate Datawiza with Azure AD for secure hybrid access 
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 8/27/2021
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Tutorial: Configure Datawiza with Azure Active Directory for secure hybrid access

In this sample tutorial, learn how to integrate Azure Active Directory (Azure AD) with [Datawiza](https://www.datawiza.com/) for secure hybrid access.

Datawiza's [Datawiza Access Broker
(DAB)](https://www.datawiza.com/access-broker) extends Azure AD to enable single sign-on (SSO) and granular access controls to protect on-premises and cloud-hosted applications, such as Oracle E-Business Suite, Microsoft IIS, and SAP.

By using this solution, enterprises can quickly transition from legacy web access managers (WAMs), such as Symantec SiteMinder, NetIQ, Oracle, and IBM to Azure AD without rewriting applications. Enterprises can also use Datawiza as a no-code or low-code solution to integrate new applications to Azure AD. This saves engineering time, reduces cost significantly, and delivers the project in a secured manner.

## Prerequisites

To get started, you'll need:

- An Azure subscription. If you don\'t have a subscription, you can get a [trial account](https://azure.microsoft.com/free/).

- An [Azure AD tenant](../fundamentals/active-directory-access-create-new-tenant.md)
that's linked to your Azure subscription.

- [Docker](https://docs.docker.com/get-docker/) and
[docker-compose](https://docs.docker.com/compose/install/)
are required to run DAB. Your applications can run on any platform, such as the virtual machine and bare metal.

- An application that you'll transition from a legacy identity system to Azure AD. In this example, DAB is deployed on the same server where the application is. The application will run on localhost: 3001, and DAB proxies traffic to the application via localhost: 9772. The traffic to the application will reach DAB first and then be proxied to the application.

## Scenario description

Datawiza integration includes the following components:

- [Azure AD](../fundamentals/active-directory-whatis.md) - A cloud-based identity and access management service from Microsoft, which helps users sign in and access external and internal resources.

- Datawiza Access Broker (DAB) - The service user sign on and transparently passes identity to applications through HTTP headers.

- Datawiza Cloud Management Console (DCMC) - A centralized management console that manages DAB. DCMC provides UI and RESTful APIs for administrators to manage the configurations of DAB and its access control policies.

The following architecture diagram shows the implementation.

![image shows architecture diagram](./media/datawiza-with-azure-active-directory/datawiza-architecture-diagram.png)

|Steps| Description|
|:----------|:-----------|
|  1. | The user makes a request to access the on-premises or cloud-hosted application. DAB proxies the request made by the user to the application.|
| 2. |The DAB checks the user's authentication state. If it doesn't receive a session token, or the supplied session token is invalid, then it sends the user to Azure AD for authentication.|
| 3. | Azure AD sends the user request to the endpoint specified during the DAB application's registration in the Azure AD tenant.|
| 4. | The DAB evaluates access policies and calculates attribute values to be included in HTTP headers forwarded to the application. During this step, the DAB may call out to the Identity provider to retrieve the information needed to set the header values correctly. The DAB sets the header values and sends the request to the application. |
| 5. |  The user is now authenticated and has access to the application.|

## Onboard with Datawiza

To integrate your on-premises or cloud-hosted application with Azure AD, login to [Datawiza Cloud Management
Console](https://console.datawiza.com/) (DCMC).

## Create an application on DCMC

[Create an application](https://docs.datawiza.com/step-by-step/step2.html) and generate a key pair of `PROVISIONING_KEY` and `PROVISIONING_SECRET` for the application on the DCMC.

For Azure AD, Datawiza offers a convenient [One click integration](https://docs.datawiza.com/tutorial/web-app-azure-one-click.html). This method to integrate Azure AD with DCMC can create an application registration on your behalf in your Azure AD tenant.

![image shows configure idp](./media/datawiza-with-azure-active-directory/configure-idp.png)

Instead, if you want to use an existing web application in your Azure AD tenant, you can disable the option and populate the fields of the form. You'll need the tenant ID, client ID, and client secret. [Create a web application and get these values in your tenant](https://docs.datawiza.com/idp/azure.html).

![image shows configure idp using form](./media/datawiza-with-azure-active-directory/use-form.png)

## Run DAB with a header-based application

1. You can use either Docker or Kubernetes to run DAB. The docker image is needed for users to create a sample header-based application. [Configure DAB and SSO
integration](https://docs.datawiza.com/step-by-step/step3.html). [Deploy DAB with Kubernetes](https://docs.datawiza.com/tutorial/web-app-AKS.html). A sample docker image `docker-compose.yml` file is provided for you to download and use. [Log in to the container registry](https://docs.datawiza.com/step-by-step/step3.html#important-step) to download the images of DAB and the header-based application.

    ```yaml
    services:
      datawiza-access-broker:
      image: registry.gitlab.com/datawiza/access-broker
      container_name: datawiza-access-broker
      restart: always
      ports:
      - "9772:9772"
      environment:
      PROVISIONING_KEY: #############################################
      PROVISIONING_SECRET: ##############################################
      
      header-based-app:
      image: registry.gitlab.com/datawiza/header-based-app
      restart: always
     ports:
     - "3001:3001"
   ```

2. After executing `docker-compose -f docker-compose.yml up`, the
header-based application should have SSO enabled with Azure AD. Open a browser and type in `http://localhost:9772/`.

3. An Azure AD login page will show up.

## Pass user attributes to the header-based application

1. DAB gets user attributes from IdP and can pass the user attributes to the application via header or cookie. See the instructions on how to [pass user attributes](https://docs.datawiza.com/step-by-step/step4.html) such as email address, firstname, and lastname to the header-based application.

2. After successfully configuring the user attributes, you should see the green check sign for each of the user attributes.

   ![image shows datawiza application home page](./media/datawiza-with-azure-active-directory/datawiza-application-home-page.png)

## Test the flow

1. Navigate to the application URL.

2. The DAB should redirect to the Azure AD login page.

3. After successfully authenticating, you should be redirected to DAB.

4. The DAB evaluates policies, calculates headers, and sends the user to the upstream application.

5. Your requested application should show up.

## Next steps

- [Configure Datawiza with Azure AD B2C](../../active-directory-b2c/partner-datawiza.md)

- [Datawiza documentation](https://docs.datawiza.com)