---
title: 'Call Grafana APIs programmatically with Azure Managed Grafana'
titleSuffix: Azure Managed Grafana
description: Learn how to call Grafana APIs programmatically with Microsoft Entra ID and an Azure service principal
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: tutorial
ms.date: 04/05/2023
ms.custom: engagement-fy23
---

# Tutorial: Call Grafana APIs programmatically

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Assign an Azure Managed Grafana role to the service principal of your application
> * Retrieve application details
> * Get an access token
> * Call Grafana APIs

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- An Azure Managed Grafana workspace. [Create an Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md).
- A Microsoft Entra application with a service principal. [Create a Microsoft Entra application and service principal](../active-directory/develop/howto-create-service-principal-portal.md). For simplicity, use an application located in the same Microsoft Entra tenant as your Azure Managed Grafana instance.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Assign an Azure Managed Grafana role to the service principal of your application

1. In the Azure portal, open your Managed Grafana instance.
1. Select **Access control (IAM)** in the navigation menu.
1. Select **Add**, then **Add role assignment**.
1. Select the **Grafana Editor** role and then **Next**.
1. Under **Assign access to**, select **User,group, or service principal**.
1. Select **Select members**, select your service principal, and hit **Select**.
1. Select **Review + assign**.

    :::image type="content" source="media/tutorial-api/role-assignment.png" alt-text="Screenshot of Add role assignment in the Azure platform.":::

## Retrieve application details

You now need to gather some information, which you'll use to get a Grafana API access token, and call Grafana APIs.

1. Find your tenant ID:
   1. In the Azure portal, enter *Microsoft Entra ID* in the **Search resources, services, and docs (G+ /)**.
   1. Select **Microsoft Entra ID**.
   1. Select **Properties** from the left menu.
   1. Locate the field **Tenant ID** and save its value.

    :::image type="content" source="./media/tutorial-api/tenant-id.png" alt-text="Screenshot of the Azure portal, getting tenant ID.":::

1. Find your client ID:
   1. In the Azure portal, in Microsoft Entra ID, select **App registrations** from the left menu.
   1. Select your app.
   1. In **Overview**, find the **Application (client) ID** field and save its value.

    :::image type="content" source="./media/tutorial-api/client-id.png" alt-text="Screenshot of the Azure portal, getting client ID.":::
  
1. Create an application secret:
   1. In the Azure portal, in Microsoft Entra ID, select **App registrations** from the left menu.
   1. Select your app.
   1. Select **Certificates & secrets** from the left menu.
   1. Select **New client secret**.
   1. Create a new client secret and save its value.

    :::image type="content" source="./media/tutorial-api/create-new-secret.png" alt-text="Screenshot of the Azure portal, creating a secret.":::

    > [!NOTE]
    > You can only access a secret's value immediately after creating it. Copy the value before leaving the page to use it in the next step of this tutorial.

1. Find the Grafana endpoint URL:

   1. In the Azure portal, enter *Azure Managed Grafana* in the **Search resources, services, and docs (G+ /)** bar.
   1. Select **Azure Managed Grafana** and open your Managed Grafana workspace.
   1. Select **Overview** from the left menu and save the **Endpoint** value.

    :::image type="content" source="media/tutorial-api/endpoint-url.png" alt-text="Screenshot of the Azure platform. Endpoint displayed in the Overview page.":::

## Get an access token

To access Grafana APIs, you need to get an access token. You can get the access token using the Azure CLI or making a POST request.

### [Azure CLI](#tab/azure-cli)

Sign in to the Azure CLI by running the [az login](/cli/azure/reference-index#az-login) command and replace `<client-id>`, `<client-secret>`, and `<tenant-id>` with the application (client) ID, client secret, and tenant ID collected in the previous step:

```
az login --service-principal --username "<client-id>" --password "<client-secret>" --tenant "<tenant-id>"
```

Use the command [az grafana api-key create](/cli/azure/grafana/api-key#az-grafana-api-key-create) to create a key. Here's an example output:

```
az grafana api-key create --key keyname --name <name> --resource-group <rg> --role editor --output json

{
  "id": 3,
  "key": "<redacted>",
  "name": "keyname"
}
```

> [!NOTE] 
> You can only view this key here once. Save it in a secure place.

### [POST request](#tab/post)

Follow the example below to call Microsoft Entra ID and retrieve a token. Replace `<tenant-id>`, `<client-id>`, and `<client-secret>` with the tenant ID, application (client) ID, and client secret collected in the previous step.

```bash
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' \
-d 'grant_type=client_credentials&client_id=<client-id>&client_secret=<client-secret>&resource=ce34e7e5-485f-4d76-964f-b3d2b16d1e4f' \
https://login.microsoftonline.com/<tenant-id>/oauth2/token
```

Here's an example of response:

```bash
{
  "token_type": "Bearer",
  "expires_in": "599",
  "ext_expires_in": "599",
  "expires_on": "1575500555",
  "not_before": "1575499766",
  "resource": "ce34...1e4f",
  "access_token": "eyJ0eXAiOiJ......AARUQ"
}
```

---

## Call Grafana APIs

You can now call Grafana APIs using the access token retrieved in the previous step as the Authorization header. For example:

```bash
curl -X GET \
-H 'Authorization: Bearer <access-token>' \
https://<grafana-url>/api/user
```

Replace `<access-token>` and `<grafana-url>` with the access token retrieved in the previous step and the endpoint URL of your Grafana instance. For example `https://my-grafana-abcd.cuse.grafana.azure.com`.

## Clean up resources

If you're not going to continue to use these resources, delete them with the following steps:

1. Delete Azure Managed Grafana:
   1. In the Azure portal, in Azure Managed Grafana, select **Overview** from the left menu.
   1. Select **Delete**.
   1. Enter the resource name to confirm deletion and select **Delete**.

1. Delete the Microsoft Entra application:
   1. In the Azure portal, in Microsoft Entra ID, select **App registrations** from the left menu.
   1. Select your app.
   1. In the **Overview** tab, select **Delete**.
   1. Select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [How to configure data sources](./how-to-data-source-plugins-managed-identity.md)
