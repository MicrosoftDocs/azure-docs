---
title:        Protect APIs hosted in APIM using Azure Web Application Firewall with Azure Front Door
description:  This article guides you through a process of creating an API in APIM and protects it from a web application attack using Azure Web Application Firewall integrated with Azure Front Door.
author:      sowmyam2019 # GitHub alias
ms.author:   sowmyam # Microsoft alias
ms.service:  web-application-firewall
ms.topic:    how-to
ms.reviewer: vhorne
ms.date: 07/13/2023
---

# Protect APIs hosted on API Management using Azure Web Application Firewall 

There are a growing number of enterprises adhering to API-first approach for their internal applications, and the number and complexity of security attacks against web applications is constantly evolving. This situation requires enterprises to adopt a strong security strategy to protect APIs from various web application attacks.

[Azure Web Application Firewall (WAF)](../overview.md) is an Azure Networking product that protects APIs from various [OWASP top 10](https://owasp.org/www-project-top-ten/) web attacks, CVE’s, and malicious bot attacks.

This article describes how to use [Azure Web Application Firewall on Azure Front Door](afds-overview.md) to protect APIs hosted on [Azure API Management](../../api-management/api-management-key-concepts.md)

## Create an APIM instance and publish an API in APIM that generates a mock API response

1. Create an APIM instance

   [Quickstart: Create a new Azure API Management service instance by using the Azure portal](../../api-management/get-started-create-service-instance.md)

   The following screenshot shows that an APIM instance called **contoso-afd-apim-resource** has been created. It can take up to 30 to 40 minutes to create and activate an API Management service. 

   :::image type="content" source="../media/protect-api-hosted-in-apim-by-waf/contoso-main-page.png" alt-text="A screenshot showing the APIM instance created." lightbox="../media/protect-api-hosted-in-apim-by-waf/contoso-main-page.png":::


2. Create an API and generate mock API responses
   
   [Tutorial: Mock API responses](../../api-management/mock-api-responses.md#add-an-operation-to-the-test-api)

   Replace the name of API from **Test API** given in the above tutorial with **Book API**.

   The Book API does a GET operation for `_/test_` as the URL path for the API. You can see the response for the API is set as **200 OK** with content type as application/json with text as `{“Book”:” $100”}`.

   :::image type="content" source="../media/protect-api-hosted-in-apim-by-waf/apim-get-test.png" alt-text="A screenshot showing the GET operation defined in APIM." lightbox="../media/protect-api-hosted-in-apim-by-waf/apim-get-test.png":::

   :::image type="content" source="../media/protect-api-hosted-in-apim-by-waf/apim-200-ok.png" alt-text="A screenshot showing the mock response created." lightbox="../media/protect-api-hosted-in-apim-by-waf/apim-200-ok.png":::


3. Deselect **Subscription required** check box under the API settings tab and select **Save**.

4. Test the mock responses from the APIM interface. You should receive a **200 OK** response.

Now, the Book API has been created. A successful call to this URL returns a **200 OK** response and returns the price of a book as $100.


## Create an Azure Front Door Premium instance with APIM hosted API as the origin

The Microsoft-managed Default Rule Set is based on the [OWASP Core Rule Set](https://github.com/coreruleset/coreruleset//) and includes Microsoft Threat Intelligence rules.

> [!NOTE]
> Managed Rule Set is not available for Azure Front Door Standard SKU. For more information about the different SKUs, see [Azure Front Door tier comparison](../../frontdoor/standard-premium/tier-comparison.md#feature-comparison-between-tiers).


Use the steps described in quick create option to create an Azure Front Door Premium profile with an associated WAF security policy in the same resource group:

[Quickstart: Create an Azure Front Door profile - Azure portal](../../frontdoor/create-front-door-portal.md)

Use the following settings when creating the Azure Front Door profile:
- Name: myAzureFrontDoor
- Endpoint Name: bookfrontdoor
- Origin type: API Management
- Origin host name: contoso-afd-apim-resource.azure-api.net(contoso-afd-apim-resource)
- WAF policy: Create a new WAF policy with name **bookwafpolicy**.

All other settings remain at default values.

## Enable Azure Web Application Firewall in prevention mode

Select the "bookwafpolicy" Azure WAF policy  and ensure the Policy mode is set to 
["Prevention" in the overview tab of the policy](waf-front-door-create-portal.md#change-mode)

Azure WAF detection mode is used for testing and validating the policy. Detection doesn't block the call but logs all threats detected, while prevention mode blocks the call if an attack is detected. Typically, you test the scenario before switching to prevention mode. For this exercise, we switch to prevention mode.  
[Azure Web Application Firewall on Azure Front Door](afds-overview.md#waf-modes) has more information about various WAF policy modes.


## Restrict APIM access through the Azure Front Door only

Requests routed through the Front Door include headers specific to your Front Door configuration. You can configure the 
[API Management policy reference](../../api-management/api-management-policies.md#access-restriction-policies) as an inbound APIM policy to filter incoming requests based on the unique value of the X-Azure-FDID HTTP request header that is sent to API Management. This header value is the Azure Front Door ID, which is available on the AFD Overview page.

 
1. Copy the Front Door ID from the AFD overview page.

   :::image type="content" source="../media/protect-api-hosted-in-apim-by-waf/afd-endpoint-fd-id.png" alt-text="A screenshot showing the AFD ID." lightbox="../media/protect-api-hosted-in-apim-by-waf/afd-endpoint-fd-id.png":::


2. Access the APIM API page, select the Book API, select **Design** and **All operations**.  In the Inbound policy, select **+ Add policy**.

   :::image type="content" source="../media/protect-api-hosted-in-apim-by-waf/apim-inbound-policy.png" alt-text="A screenshot showing how to add an inbound policy." lightbox="../media/protect-api-hosted-in-apim-by-waf/apim-inbound-policy.png":::

3. Select Other policies

   :::image type="content" source="../media/protect-api-hosted-in-apim-by-waf/apim-other-policies.png" alt-text="A screenshot showing other policies selected." lightbox="../media/protect-api-hosted-in-apim-by-waf/apim-other-policies.png":::

4. Select “Show snippets" and select **Check HTTP header**.

   :::image type="content" source="../media/protect-api-hosted-in-apim-by-waf/apim-check-http-header.png" alt-text="A screenshot showing check header selected." lightbox="../media/protect-api-hosted-in-apim-by-waf/apim-check-http-header.png":::

   Add the following code to the inbound policy for HTTP header `X-Azure-FDID`. Replace the `{FrontDoorId}`  with the AFD ID copied in the first step of this section.


   ```
   <check-header name="X-Azure-FDID" failed-check-httpcode="403" failed-check-error-message="Invalid request" ignore-case="false">
        <value>{FrontDoorId}</value>
   </check-header>

   ```

   :::image type="content" source="../media/protect-api-hosted-in-apim-by-waf/apim-final-check-header.png" alt-text="A screenshot showing the final policy configuration." lightbox="../media/protect-api-hosted-in-apim-by-waf/apim-final-check-header.png":::

   Select **Save**.

   At this point, APIM access is restricted to the Azure Front Door endpoint only.

## Verify the API call is routed through Azure Front Door and protected by Azure Web Application Firewall

1. Obtain the newly created Azure Front Door endpoint from the **Front Door Manager**.

   :::image type="content" source="../media/protect-api-hosted-in-apim-by-waf/afd-get-endpoint.png" alt-text="A screenshot showing the AFD endpoint selected." lightbox="../media/protect-api-hosted-in-apim-by-waf/afd-get-endpoint.png":::

2. Look at origin groups and confirm that the origin host name is __contoso-afd-apim-resource.azure-api.net.__ This step verifies that the APIM instance is an origin in the newly configured Azure Front Door premium.

3. Under the **Security Policies** section, verify that the WAF policy **bookwafpolicy** is provisioned.

4. Select **bookwafpolicy** and verify that the **bookwafpolicy** has Managed rules provisioned. The latest versions of Microsoft_DefaultRueSet and Microsoft_BotManagerRuleSet is provisioned which protects the origin against OWASP top 10 vulnerabilities and malicious bot attacks.

   :::image type="content" source="../media/protect-api-hosted-in-apim-by-waf/book-waf-policy.png" alt-text="A screenshot showing the WAF policy for managed rules." lightbox="../media/protect-api-hosted-in-apim-by-waf/book-waf-policy.png":::

At this point, the end-to-end call is set up, and the API is protected by Azure Web Application Firewall.

## Verify the setup

1. Access the API through the Azure Front Door endpoint from your browser. The API should return the following response:

   :::image type="content" source="../media/protect-api-hosted-in-apim-by-waf/test-book-front-door.png" alt-text="A screenshot showing API access through AFD endpoint.":::

2. Verify that APIM isn't accessible directly over the Internet and accessible only via the AFD:

   :::image type="content" source="../media/protect-api-hosted-in-apim-by-waf/block-direct-access.png" alt-text="A screenshot showing APIM inaccessible through the Internet.":::

3. Now try to invoke the AFD endpoint URL via any OWASP Top 10 attack or bot attack and you should receive `REQUEST IS BLOCKED` message and the request is blocked. The API has been protected from web attack by Azure Web Application Firewall.

## Related content

- [What is Azure Web Application Firewall?](../overview.md)
- [Recommendations to mitigate OWASP API Security Top 10 threats using API Management](../../api-management/mitigate-owasp-api-threats.md)
- [Configure Front Door Standard/Premium in front of Azure API Management](../../api-management/front-door-api-management.md)
