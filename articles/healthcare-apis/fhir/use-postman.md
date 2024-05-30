---
title: Use Postman to access the FHIR service in Azure Health Data Services 
description: Learn how to access the FHIR service in Azure Health Data Services FHIR service with Postman.
services: healthcare-apis
author: expekesheth
ms.service: healthcare-apis
ms.topic: tutorial
ms.date: 04/16/2024
ms.author: kesheth
---

# Access the FHIR service by using Postman

This article shows the steps to access the FHIR&reg; service in Azure Health Data Services with [Postman](https://www.getpostman.com/).

## Prerequisites

- **FHIR service deployed in Azure**. For more information, see [Deploy a FHIR service](fhir-portal-quickstart.md).
- **A registered client application to access the FHIR service**. For more information, see [Register a service client application in Microsoft Entra ID](./../register-application.md). 
- **FHIR Data Contributor permissions** granted to the client application and your user account. 
- **Postman installed locally**. For more information, see [Get Started with Postman](https://www.getpostman.com/).

## Create a workspace, collection, and environment

If you're new to Postman, follow these steps to create a workspace, collection, and environment. 
 
Postman introduces the workspace concept to enable you and your team to share APIs, collections, environments, and other components. You can use the default **My workspace** or **Team workspace** or create a new workspace for you or your team.

:::image type="content" source="media/postman/postman-create-new-workspace.png" alt-text="Screenshot showing workspace creation." lightbox="media/postman/postman-create-new-workspace.png":::

Next, create a new collection where you can group all related REST API requests. In the workspace, select **Create Collections**. You can keep the default name **New collection** or rename it. The change is saved automatically.

:::image type="content" source="media/postman/postman-create-a-new-collection.png" alt-text="Screenshot showing creation of new collection." lightbox="media/postman/postman-create-a-new-collection.png":::

You can also import and export Postman collections. For more information, see [the Postman documentation](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/).

:::image type="content" source="media/postman/postman-import-data.png" alt-text="Screenshot showing import and export of collections." lightbox="media/postman/postman-import-data.png":::

## Create or update environment variables

Although you can use the full URL in the request, we recommend that you store the URL and other data in variables.

To access the FHIR service, you need to create or update these variables:


| **Variable** | **Description** | **Notes** |
|--------------|-----------------|----------|
| **tenantid** | Azure tenant where the FHIR service is deployed | Located on the Application registration overview |
| **subid** | Azure subscription where the FHIR service is deployed | Located on the FHIR service overview |
| **clientid** | Application client registration ID | - |
| **clientsecret** | Application client registration secret | - |
| **fhirurl** | The FHIR service full URL (for example, `https://xxx.azurehealthcareapis.com`) | Located on the FHIR service overview |
| **bearerToken** | Stores the Microsoft Entra access token in the script | Leave blank |

> [!NOTE]
> Ensure that you configured the redirect URL `https://www.getpostman.com/oauth2/callback` in the client application registration.

:::image type="content" source="media/postman/postman-environments-variable.png" alt-text="Screenshot showing environments variable." lightbox="media/postman/postman-environments-variable.png":::

## Get the capability statement

Enter `{{fhirurl}}/metadata` in the `GET`request, and then choose `Send`. You should see the capability statement of the FHIR service.

:::image type="content" source="media/postman/postman-capability-statement.png" alt-text="Screenshot showing capability request parameters." lightbox="media/postman/postman-create-new-request.png":::

:::image type="content" source="media/postman/postman-save-request.png" alt-text="Screenshot showing a save request." lightbox="media/postman/postman-save-request.png":::

<a name='get-azure-ad-access-token'></a>

## Get a Microsoft Entra access token

Get a Microsoft Entra access token by using a service principal or a Microsoft Entra user account. Choose one of the two methods.

### Use a service principal with a client credential grant type

The FHIR service is secured by Microsoft Entra ID. The default authentication can't be disabled. To access the FHIR service, you need to get a Microsoft Entra access token first. For more information, see [Microsoft identity platform access tokens](../../active-directory/develop/access-tokens.md).

Create a new `POST` request:

1. Enter the request header:
   `https://login.microsoftonline.com/{{tenantid}}/oauth2/token`

2. Select the **Body** tab and select **x-www-form-urlencoded**. Enter the following values in the key and value section:
    - **grant_type**: `Client_Credentials`
    - **client_id**: `{{clientid}}`
    - **client_secret**: `{{clientsecret}}`
    - **resource**: `{{fhirurl}}`
    
> [!NOTE]
> In scenarios where the FHIR service audience parameter isn't mapped to the FHIR service endpoint URL, the resource parameter value should be mapped to the audience value on the FHIR service **Authentication** pane.

3. Select the **Test** tab and enter in the text section: `pm.environment.set("bearerToken", pm.response.json().access_token);` To make the value available to the collection, use the pm.collectionVariables.set method. For more information on the set method and its scope level, see [Using variables in scripts](https://learning.postman.com/docs/sending-requests/variables/#defining-variables-in-scripts).
4. Select **Save** to save the settings.
5. Select **Send**. You should see a response with the Microsoft Entra access token, which is saved to the variable `bearerToken` automatically. You can then use it in all FHIR service API requests.

:::image type="content" source="media/postman/postman-send-button.png" alt-text="Screenshot showing the send button." lightbox="media/postman/postman-send-button.png":::

You can examine the access token using online tools such as [https://jwt.ms](https://jwt.ms). Select the **Claims** tab to see detailed descriptions for each claim in the token.

:::image type="content" source="media/postman/postman-access-token-claims.png" alt-text="Screenshot showing access token claims." lightbox="media/postman/postman-access-token-claims.png":::

## Use a user account with the authorization code grant type

You can get the Microsoft Entra access token by using your Entra account credentials and following the listed steps.

1. Verify that you're a member of Microsoft Entra tenant with the required access permissions.

1. Ensure that you configured the redirect URL `https://oauth.pstmn.io/v1/callback` for the web platform in the client application registration.

   :::image type="content" source="media/postman/callback-url.png" alt-text="Screenshot showing callback URL." lightbox="media/postman/callback-url.png":::

1. In the client application registration under **API Permissions**, add the **User_Impersonation** delegated permission for **Azure Healthcare APIS** from **APIs my organization uses**.

   :::image type="content" source="media/postman/app-registration-permissions.png" alt-text="Screenshot showing application registration permissions." lightbox="media/postman/app-registration-permissions.png":::

   :::image type="content" source="media/postman/app-registration-permissions-2.png" alt-text="Screenshot showing application registration permissions screen." lightbox="media/postman/app-registration-permissions-2.png":::

1. In the Postman, select the **Authorization** tab of either a collection or a specific REST Call, select **Type** as OAuth 2.0 and under **Configure New Token** section, set these values: 
    - **Callback URL**: `https://oauth.pstmn.io/v1/callback`
    
    - **Auth URL**: `https://login.microsoftonline.com/{{tenantid}}/oauth2/v2.0/authorize`
    
    - **Access Token URL**: `https://login.microsoftonline.com/{{tenantid}}/oauth2/v2.0/token`
    
    - **Client ID**: Application client registration ID  
    
    - **Client Secret**: Application client registration secret 
    
    - **Scope**: `{{fhirurl}}/.default`
    
    - **Client Authentication**: Send client credentials in body
    
    :::image type="content" source="media/postman/postman-configuration.png" alt-text="Screenshot showing configuration screen." lightbox="media/postman/postman-configuration.png":::

1. Choose **Get New Access Token** at the bottom of the page.

1. You're asked for User credentials for sign-in.

1. You receive the token. Choose **Use Token.**

1. Ensure the token is in the **Authorization Header** of the REST call.

Examine the access token using online tools such as [https://jwt.ms](https://jwt.ms). Select the **Claims** tab to see detailed descriptions for each claim in the token.

## Connect to the FHIR server

Open Postman, select the **workspace**, **collection**, and **environment** you want to use. Select the `+` icon to create a new request. 

:::image type="content" source="media/postman/postman-create-new-request.png" alt-text="Screenshot showing creation of new request." lightbox="media/postman/postman-create-new-request.png":::

To perform health check on FHIR service, enter `{{fhirurl}}/health/check` in the GET request, and then choose **Send**. You should be able to see the `Status of FHIR service - HTTP Status` code response with 200 and OverallStatus as **Healthy** in response, which means your health check is successful.

## Get the FHIR resource

After you obtain a Microsoft Entra access token, you can access the FHIR data. In a new `GET` request, enter `{{fhirurl}}/Patient`.

Select **Bearer Token** as authorization type. Enter `{{bearerToken}}` in the **Token** section. Select **Send**. As a response, you should see a list of patients in your FHIR resource.

:::image type="content" source="media/postman/postman-select-bearer-token.png" alt-text="Screenshot showing selection of bearer token." lightbox="media/postman/postman-select-bearer-token.png":::

## Create or update the FHIR resource

After you obtain a Microsoft Entra access token, you can create or update the FHIR data. For example, you can create a new patient or update an existing patient.
 
Create a new request, change the method to **Post**, and then enter the value in the request section.

`{{fhirurl}}/Patient`

Select **Bearer Token** as the authorization type. Enter `{{bearerToken}}` in the **Token** section. Select the **Body** tab. Select the **raw** option and **JSON** as body text format. Copy and paste the text to the body section. 


```
{
    "resourceType": "Patient",
    "active": true,
    "name": [
        {
            "use": "official",
            "family": "Kirk",
            "given": [
                "James",
                "Tiberious"
            ]
        },
        {
            "use": "usual",
            "given": [
                "Jim"
            ]
        }
    ],
    "gender": "male",
    "birthDate": "1960-12-25"
}
```
Select **Send**. You should see a new patient in the JSON response.

:::image type="content" source="media/postman/postman-send-create-new-patient.png" alt-text="Screenshot showing send button to create a new patient." lightbox="media/postman/postman-send-create-new-patient.png":::

## Export FHIR data

After you obtain a Microsoft Entra access token, you can export FHIR data to an Azure storage account.

Create a new `GET` request: `{{fhirurl}}/$export?_container=export`

Select **Bearer Token** as authorization type. Enter `{{bearerToken}}` in the **Token** section. Select **Headers** to add two new headers:

- **Accept**: `application/fhir+json`

- **Prefer**:  `respond-async`

Select **Send**. You should notice a `202 Accepted` response. Select the **Headers** tab of the response and make a note of the value in the **Content-Location**. You can use the value to query the export job status.

:::image type="content" source="media/postman/postman-202-accepted-response.png" alt-text="Screenshot showing selection 202 accepted response." lightbox="media/postman/postman-202-accepted-response.png":::

## Next steps

[Starter collection of Postman sample queries](https://github.com/Azure-Samples/azure-health-data-services-samples/tree/main/samples/sample-postman-queries)  

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]