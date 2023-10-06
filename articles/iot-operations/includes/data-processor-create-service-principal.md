---
 title: include file
 description: include file
 author: dominicbetts
 ms.topic: include
 ms.date: 10/09/2023
 ms.author: dobett
 ms.custom: include file
---

- In the Azure portal, navigate to [App registrations](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps).
- Select **+ New registration**. Enter a name such as _dpp-dest_ and select **Register**. Make a note of the name and **Tenant ID**, you use these values later when you configure access to your Azure Data Explorer database.
- After you create the app registration, select your app registration from the list. If there are lots of app registrations in your subscription, select **Owned applications** to filter the list.
- Select **Certificates & secrets** in the **Manage** section.
- To create a new secret, select **New client secret**.
- Enter a description for the secret such as _Data processor pipeline access to Azure Data Explorer_, then select **Add**.
- Make a note of the **Value** and **Secret ID**, you need these values later when you configure the destination pipeline stage. Now is your only chance to make a note of the secret value. If you lose it, you have to create a new secret.
