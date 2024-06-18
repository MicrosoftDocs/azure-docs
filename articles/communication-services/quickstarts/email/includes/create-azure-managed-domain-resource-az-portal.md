---
author: v-vprasannak
ms.service: azure-communication-services
ms.topic: include
ms.date: 04/26/2024
ms.author: v-vprasannak
---
## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Communication Services Email Resource created and ready to add the domains. See [Get started with Creating Email Communication Resource](../../../quickstarts/email/create-email-communication-resource.md).

## Provision Azure Managed Domain

1. Open the Overview page of the Email Communications Service resource that you created in [Get started with Creating Email Communication Resource](../../../quickstarts/email/create-email-communication-resource.md).
2. Create an Azure Managed Domain using one of the following options.
    - (Option 1) Click the **1-click add** button under **Add a free Azure subdomain**. Continue to **step 3**.
    
    :::image type="content" source="../media/email-add-azure-domain.png" alt-text="Screenshot that highlights the adding a free Azure Managed Domain.":::

    - (Option 2) Click **Provision Domains** on the left navigation panel.
    
    :::image type="content" source="../media/email-add-azure-domain-navigation.png" alt-text="Screenshot that shows the Provision Domains navigation page.":::

    - Click **Add domain** on the upper navigation bar.
    - Select **Azure domain** from the dropdown.
    
3. Wait for the deployment to complete.
 
    :::image type="content" source="../media/email-add-azure-domain-progress.png" alt-text="Screenshot that shows the Deployment Progress." lightbox="../media/email-add-azure-domain-progress-expanded.png":::

4. Once the domain is created, you see a list view with the new domain.

    :::image type="content" source="../media/email-add-azure-domain-created.png" alt-text="Screenshot that shows the list of provisioned email domains." lightbox="../media/email-add-azure-domain-created-expanded.png":::

5. Click the name of the provisioned domain to open the overview page for the domain resource type.

    :::image type="content" source="../media/email-azure-domain-overview.png"  alt-text="Screenshot that shows Azure Managed Domain overview page." lightbox="../media/email-azure-domain-overview-expanded.png":::