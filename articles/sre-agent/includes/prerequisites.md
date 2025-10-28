---
author: craigshoemaker
ms.author: cshoe
ms.date: 10/28/2025
ms.service: azure-sre-agent
---

To create an agent, you need to grant your agent the correct permissions, configure the correct settings, and grant access to the right resources:

* **Azure account**: You need an Azure account with an active subscription. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

* **Security context**: Make sure that your user account has the `Microsoft.Authorization/roleAssignments/write` permissions as either [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles) or [User Access Administrator](/azure/role-based-access-control/built-in-roles).

* **Namespace registration**: Using Azure Cloud Shell in the Azure portal, run the following command to register the `Microsoft.App` namespace:

    ```azurecli  
    az provider register --namespace "Microsoft.App"
    ```

* **Firewall settings**: Add `*.azuresre.ai` to the allowlist in your firewall settings. Some networking profiles might block access to `*.azuresre.ai` domain by default.

* **Subscription ID for your allowlist**: Make sure that your Azure CLI session is set to the subscription ID in the preview allowlist. If you need to set the Azure CLI context to your subscription ID, use the following command:

    ```azurecli  
    az account set --subscription "<SUBSCRIPTION_ID>"
    ```

* **Access to the approved regions**: During the preview, the only allowed regions for SRE Agent are the *Sweden Central*, *East US 2*, and *Australia East* regions. Make sure that your user account has *owner* or *admin* permissions, along with permissions to create resources in the appropriate region.
