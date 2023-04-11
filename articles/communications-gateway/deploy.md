---
title: Deploy Azure Communications Gateway 
description: This article guides you through how to deploy an Azure Communications Gateway.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to 
ms.date: 03/17/2023
---

# Deploy Azure Communications Gateway

This article guides you through creating an Azure Communications Gateway resource in Azure. You must configure this resource before you can deploy Azure Communications Gateway.

## Prerequisites

Carry out the steps detailed in [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md).

## 1. Start creating the Azure Communications Gateway resource

In this step, you'll create the Azure Communications Gateway resource.

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar at the top of the page, search for Communications Gateway and select **Communications Gateways**.  

    :::image type="content" source="media/deploy/search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for Azure Communications Gateway.":::

1. Select the **Create** option.

    :::image type="content" source="media/deploy/create.png" alt-text="Screenshot of the Azure portal. Shows the existing Azure Communications Gateway. A Create button allows you to create more Azure Communications Gateways.":::

1. Use the information you collected in [Collect Azure Communications Gateway resource values](prepare-to-deploy.md#4-collect-basic-information-for-deploying-an-azure-communications-gateway) to fill out the fields in the **Basics** configuration section and then select **Next: Service Regions**.

    :::image type="content" source="media/deploy/basics.png" alt-text="Screenshot of the Create an Azure Communications Gateway portal, showing the Basics section.":::

1. Use the information you collected in [Collect Service Regions configuration values](prepare-to-deploy.md#5-collect-service-regions-configuration-values) to fill out the fields in the **Service Regions** section and then select **Next: Tags**.
1. (Optional) Configure tags for your Azure Communications Gateway resource: enter a **Name** and **Value** for each tag you want to create.
1. Select **Review + create**.

If you've entered your configuration correctly, you'll see a **Validation Passed** message at the top of your screen. Navigate to the **Review + create** section.

If you haven't filled in the configuration correctly, you'll see an error message in the configuration section(s) containing the invalid configuration. Correct the invalid configuration by selecting the flagged section(s) and use the information within the error messages to correct invalid configuration before returning to the **Review + create** section.

:::image type="content" source="media/deploy/failed-validation.png" alt-text="Screenshot of the Create an Azure Communications Gateway portal, showing a validation that failed due to missing information in the Contacts section.":::

## 2. Submit your Azure Communications Gateway configuration

Check your configuration and ensure it matches your requirements. If the configuration is correct, select **Create**.

You now need to wait for your resource to be provisioned and connected to the Microsoft Teams environment. When your resource has been provisioned and connected, your onboarding team will contact you and the Provisioning Status filed on the resource overview will be "Complete". We recommend you check in periodically to see if your resource has been provisioned. This process can take up to two weeks, because updating ACLs in the Azure and Teams environments is done on a periodic basis.

Once your resource has been provisioned, a message appears saying **Your deployment is complete**. Select **Go to resource group**, and then check that your resource group contains the correct Azure Communications Gateway resource.

:::image type="content" source="media/deploy/go-to-resource-group.png" alt-text="Screenshot of the Create an Azure Communications Gateway portal, showing a completed deployment screen.":::

## 3. Provide additional information to your onboarding team

> [!NOTE]
>This step is required to set you up as an Operator in the Teams Phone Mobile (TPM) and Operator Connect (OC) environments. Skip this step if you have already onboarded to TPM or OC.

Before your onboarding team can finish onboarding you to the Operator Connect and/or Teams Phone Mobile environments, you need to provide them with some additional information.

1. Wait for your onboarding team to provide you with a form to collect the additional information. 
1. Complete the form and give it to your onboarding team.
1. Wait for your onboarding team to confirm that the onboarding process is complete.

If you don't already have an onboarding team, contact azcog-enablement@microsoft.com, providing your Azure subscription ID and contact details.

## 4. Test your Operator Connect portal access

> [!IMPORTANT]
> Before testing your Operator Connect portal access, wait for your onboarding team to confirm that the onboarding process is complete.

Go to the [Operator Connect homepage](https://operatorconnect.microsoft.com/) and check that you're able to sign in.

## 5. Add the application ID for Azure Communications Gateway to Operator Connect

You must enable the Azure Communications Gateway application within the Operator Connect or Teams Phone Mobile environment. Enabling the application allows Azure Communications Gateway to use the roles that you set up in [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md#10-set-up-application-roles-for-azure-communications-gateway).

To enable the Azure Communications Gateway application, add the application ID of the service principal representing Azure Communications Gateway to your Operator Connect or Teams Phone Mobile environment:

1. Optionally, check the application ID of the service principal to confirm that you're adding the right application.
    1. Search for `AzureCommunicationsGateway` with the search bar: it's under the **Azure Active Directory** subheading.
    1. On the overview page, check that the value of **Object ID** is `8502a0ec-c76d-412f-836c-398018e2312b`.
1. Log into the [Operator Connect portal](https://operatorconnect.microsoft.com/operator/configuration).
1. Add a new **Application Id**, pasting in the following value. This value is the application ID for Azure Communications Gateway.
    ```
    8502a0ec-c76d-412f-836c-398018e2312b
    ```

## 6. Register your deployment's domain name in Active Directory

Microsoft Teams only sends traffic to domains that you've confirmed that you own. Your Azure Communications Gateway deployment automatically receives an autogenerated fully qualified domain name (FQDN). You need to add this domain name to your Active Directory tenant as a custom domain name, share the details with your onboarding team and then verify the domain name. This process confirms that you own the domain.

1. Navigate to your Azure Communications Gateway resource and select **Properties**. Find the field named **Domain name**. This name is your deployment's domain name.
1. Complete the following procedure: [Add your custom domain name to Azure AD](../active-directory/fundamentals/add-custom-domain.md#add-your-custom-domain-name-to-azure-ad).
1. Share your DNS TXT record information with your onboarding team. Wait for your onboarding team to confirm that the DNS TXT record has been configured correctly.
1. Complete the following procedure: [Verify your custom domain name](../active-directory/fundamentals/add-custom-domain.md#verify-your-custom-domain-name).

## Next steps

- [Prepare for live traffic with Azure Communications Gateway](prepare-for-live-traffic.md)