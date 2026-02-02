---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 01/28/2026
ms.author: danlep
ms.custom:
---

### Allow access to DigiCert IP addresses

Starting January 2026, Azure API Management needs inbound access on port 80 to [specific DigiCert IP addresses](https://knowledge.digicert.com/alerts/ip-address-domain-validation?utm_medium=organic&utm_source=docs-digicert&referrer=https://docs.digicert.com/en/certcentral/manage-certificates/domain-control-validation-methods/automatic-domain-control-validation-check.html) to renew (rotate) your managed certificate.  

If your API Management instance restricts incoming IP addresses, we recommend that you remove or modify existing IP restrictions by using one of the following methods based on your deployment architecture.

> [!NOTE]
> Any time you make changes to policy configurations, network security groups, or firewall rules, it's recommended to test access to your APIs to confirm the restrictions have been removed as intended.

### Remove or edit IP filter policies in API Management

If you implemented IP address restrictions by using built-in policies such as [ip-filter](../articles/api-management/ip-filter-policy.md):

1. Sign in to the Azure portal and go to your API Management instance.
1. Under **APIs**, select the API where the policy applies (or **All APIs** for a global change).
1. On the **Design** tab, in **Inbound processing**, select the code editor (`</>`) icon.
1. Locate the IP restriction policy statement.
1. Do one of the following:
   - Delete the entire XML snippet to remove the restriction completely.
   - Edit the elements to include or remove specific IP addresses or ranges as needed. We recommend that you add the DigiCert IP addresses to the allow list.
1. Select **Save** to apply changes immediately to the gateway.

### Modify network security group  rules (external virtual network deployment)

If you deploy your API Management instance in a [virtual network in external mode](../articles/api-management/api-management-using-with-vnet.md), inbound IP restrictions are typically managed using network security group rules on the subnet.

To modify the network security group that you configured on the subnet:

1. In the Azure portal, go to **Network security groups**.
1. Select the network security group associated with your API Management subnet.
1. Under **Settings** > **Inbound security rules**, locate rules that are enforcing the IP restriction (for example, rules with a specific source IP range or service tag that you want to remove or broaden).
1. Do one of the following:
   - **Delete** the restrictive rule: Select the rule and choose the **Delete** option.
   - **Edit the rule**: Change **Source** to **IP Addresses** and add the DigiCert IP addresses to the allow list on port 80.
1. Select **Save**.

### Internal virtual network deployment

If your API Management instance is deployed in a [virtual network in internal mode](../articles/api-management/api-management-using-with-internal-vnet.md) and is connected with Azure Application Gateway, Azure Front Door, or Azure Traffic Manager, then you need to implement the following architecture:

Azure Front Door / Traffic Manager → Application Gateway → API Management (internal virtual network)

Both the Application Gateway and API Management instances must be injected in the same virtual network. [Learn more about integrating Application Gateway with API Management](../articles/api-management/api-management-howto-integrate-internal-vnet-appgateway.md).

**Step 1: Configure Application Gateway in front of API Management and allow DigiCert IP addresses in network security group**

1. In the Azure portal, go to **Network security groups** and select the network security group for your API Management subnet.
1. Under **Settings** > **Inbound security rules**, locate rules that are enforcing the IP restriction (for example, rules with a specific source IP range or service tag that you want to remove or broaden).
1. Do one of the following:
   - **Delete** the restrictive rule: Select the rule and choose the **Delete** option.
   - **Edit the rule**: Change **Source** to **IP Addresses** and add the DigiCert IP addresses to the allow list on port 80.
1. Select **Save**.

**Step 2: Preserve target custom domain/hostname from the traffic manager through to the API Management instance**

Do one or more of the following based on your deployment:

- Configure Azure Front Door to preserve the host header (forward the original host header).
    - **Azure Front Door (classic):** Set **Backend host header** to the API Management hostname (not the Application Gateway FQDN), or select **Preserve the incoming host header** when using custom domains.
    - **Azure Front Door Standard/Premium:** In **Route > Origin > Origin settings**, enable **Forward Host Header** and select **Original host header**.

- Configure Application Gateway to preserve the host header.

    In **HTTP settings**, do one of the following to ensure that Application Gateway acts as a reverse proxy without rewriting the host header:

    - Set **Override host name** to **No**.
    - If you use hostname override, set **Pick hostname from incoming request** (recommended).

- Ensure API Management has a matching custom domain.

    API Management in internal virtual network mode still requires the incoming hostname to match an API Management custom domain you configured.
    
    For example:
    
    | Layer | Host header |
    |-------|-------------|
    | Client → Azure Front Door | `api.contoso.com` |
    | Azure Front Door → Application Gateway | `api.contoso.com` |
    | Application Gateway → API Management | `api.contoso.com` |
    
    API Management rejects requests if the incoming hostname doesn't match a configured custom domain.
    
    > [!IMPORTANT]
    > If you configured a free, managed certificate on Azure Front Door on the same domain `api.contoso.com`, then you can't use the free, managed certificate feature of API management. Instead, we recommend bringing your own certificate and uploading it to API Management for the custom domain.

### Modify Azure Firewall rules if used

If an Azure Firewall protects your API Management instance, modify the firewall's network rules to allow inbound access from DigiCert IP addresses on port 80:

1. Go to your **Azure Firewall** instance.
1. Under **Settings** > **Rules** (or **Network rules**), locate the rule collection and the specific rule that restricts inbound access to the API Management instance.
1. Edit or delete the rule to add the DigiCert IP addresses to the allow list on port 80.
1. Select **Save** and test API access.