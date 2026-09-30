---
title: Associate Network Security Perimeter With Event Hubs
description: Discover step-by-step instructions to associate a network security perimeter with your Azure Event Hubs namespace and secure your data streams.
#customer intent: As an IT professional, I want to verify the association of a network security perimeter with my Event Hubs namespace so that I can ensure proper configuration.
ms.topic: how-to
ms.date: 01/31/2026
---

# Associate network security perimeter (NSP) with an Azure Event Hubs namespace

You can associate a network security perimeter (NSP) with an Azure Event Hubs namespace to enhance the security of your event streaming infrastructure. This association restricts access to the Event Hubs namespace based on the defined security perimeter, allowing you to:

- Control which Azure resources can communicate with your Event Hubs namespace.
- Define inbound and outbound access rules for your event streaming workloads.
- Monitor and audit network access to your Event Hubs resources.

> [!NOTE]
> For conceptual information, see [Network security perimeter for Azure Event Hubs](network-security-perimeter.md).

## Prerequisites

Before you begin, ensure you have the following prerequisites in place:

- An existing Azure Event Hubs namespace.
- An existing network security perimeter (NSP) in your Azure subscription. If you don't have one, [create a network security perimeter](/azure/private-link/create-network-security-perimeter-portal) first.
- A profile configured within the NSP to associate with your Event Hubs namespace.
- The **Contributor** role or higher on the Event Hubs namespace.
- The **Network Security Perimeter Contributor** role or higher on the NSP.

## Associate NSP with an Azure Event Hubs namespace

Follow these steps to associate an NSP with your Event Hubs namespace using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box, enter **Event Hubs**, and then select **Event Hubs** from the search results.
1. Select your Event Hubs namespace from the list.
1. In the left-hand menu under **Settings**, select **Networking**.   
1. Select the **Public access** tab.
1. Under the **Network security perimeter** section, select **Associate NSP**.

    :::image type="content" source="./media/associate-network-security-perimeter/associate-button.png" alt-text="Screenshot of the Networking page with Associate button for network security perimeter selected." lightbox="./media/associate-network-security-perimeter/associate-button.png":::
1. In the **Associate network security perimeter** page, complete the following configuration:

    | Setting | Description |
    | --- | --- |
    | **Network security perimeter** | Select the NSP you want to associate from the dropdown list. Only NSPs in the same region as your Event Hubs namespace are available. |
    | **Profile** | Select the profile within the NSP to associate with the Event Hubs namespace. Profiles contain the access rules that apply to associated resources. |

1. Select **Associate** to complete the association.

    :::image type="content" source="./media/associate-network-security-perimeter/associate-network-security-perimeter-page.png" alt-text="Screenshot of the Associate a network security perimeter page." lightbox="./media/associate-network-security-perimeter/associate-network-security-perimeter-page.png":::

1. Wait for the association to complete. The process typically takes a few minutes.
1. Once the association is complete, verify that the NSP appears under the **Network security perimeter** section of your Event Hubs namespace.

    :::image type="content" source="./media/associate-network-security-perimeter/public-access-page.png" alt-text="Screenshot of the Public access page with the network security perimeter selected." lightbox="./media/associate-network-security-perimeter/public-access-page.png":::    

## Manage NSP settings

After associating the NSP with your Event Hubs namespace, you can manage and configure the security settings.

### View and modify NSP configuration

1. On the **Networking** page of your Event Hubs namespace, select **Manage** in the **Network security perimeter** section.

    :::image type="content" source="./media/associate-network-security-perimeter/manage-button.png" alt-text="Screenshot of the Public access page with Manage button highlighted in the network security perimeter section." lightbox="./media/associate-network-security-perimeter/manage-button.png":::        

1. Review the inbound and outbound access rules configured for the NSP. These rules determine what traffic is allowed to and from your Event Hubs namespace.

    :::image type="content" source="./media/associate-network-security-perimeter/associate-inbound-outbound-rules.png" alt-text="Screenshot of the Network security perimeter configuration page." lightbox="./media/associate-network-security-perimeter/associate-inbound-outbound-rules.png":::            
1. To add or modify inbound and outbound rules:
    1. Navigate to the NSP configuration page by selecting the **NSP name** at the top of the page.
    1. In the NSP configuration, you can:
        - Add **inbound access rules** to allow specific external resources or IP addresses to access your Event Hubs namespace.
        - Add **outbound access rules** to allow your Event Hubs namespace to communicate with external resources.
        - Modify or delete existing rules as needed.

        > [!TIP]
        > When configuring access rules, follow the principle of least privilege by only allowing the minimum required access for your workloads.

### Assign a managed identity

To use managed identity with your NSP-associated Event Hubs namespace:

1. In the **Associate resource** section, select **Manage** for **Identity**.

    :::image type="content" source="./media/associate-network-security-perimeter/assign-managed-identity-link.png" alt-text="Screenshot of the Network security perimeter configuration page with the Manage button for the Identity is highlighted." lightbox="./media/associate-network-security-perimeter/assign-managed-identity-link.png":::

1. Follow the steps in [Enable managed identity for Event Hubs](enable-managed-identity.md) to assign a system-assigned or user-assigned managed identity to your namespace.               

## Verify the association

After completing the association, perform these verification steps:

1. **Test connectivity**: Verify that the Event Hubs namespace is accessible only from resources within the defined network security perimeter.
    - Attempt to connect from a resource inside the perimeter (should succeed).
    - Attempt to connect from a resource outside the perimeter (should be blocked unless allowed by access rules).
1. **Review diagnostic logs**: Enable diagnostic logging for your Event Hubs namespace to monitor connection attempts and identify any access issues.
1. **Validate application functionality**: Ensure that your applications can still send and receive events as expected.

## Best practices

Follow these best practices when using NSP with Event Hubs:

- **Plan your perimeter**: Before you associate an NSP, map out all the resources that need to communicate with your Event Hubs namespace.
- **Use profiles effectively**: Create separate profiles for different environments (development, staging, production) to apply appropriate access rules.
- **Monitor regularly**: Set up alerts and regularly review access logs to detect unauthorized access attempts.
- **Keep rules updated**: As your infrastructure changes, update your NSP rules to reflect new requirements while maintaining security.
- **Test changes**: Before applying NSP changes in production, test them in a nonproduction environment.

## Troubleshooting

If you encounter issues after associating an NSP with your Event Hubs namespace:

| Issue | Possible cause | Solution |
| --- | --- | --- |
| Applications can't connect to Event Hubs | NSP is blocking the traffic | Add an inbound access rule to allow traffic from your application's network. |
| Event Hubs can't send data to downstream services | Outbound rules are too restrictive | Add an outbound access rule to allow traffic to the required destination. |
| NSP doesn't appear in the dropdown list | NSP is in a different region | Create an NSP in the same region as your Event Hubs namespace. |
| Association fails | Insufficient permissions | Verify you have the required roles on both the Event Hubs namespace and the NSP. |

## Related content

- [Network security perimeter for Azure Event Hubs](network-security-perimeter.md)
- [Azure network security perimeter concepts](/azure/private-link/network-security-perimeter-concepts)
- [Create a network security perimeter](/azure/private-link/create-network-security-perimeter-portal)