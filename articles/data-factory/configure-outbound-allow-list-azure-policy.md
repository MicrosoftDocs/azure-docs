---
title: Outbound network rules with Azure Policy (Preview)
description: Learn about outbound network rules using Azure Policy (Preview).
ms.service: data-factory
ms.reviewer: jburchel
ms.author: abnarain
author: nabhishek
ms.topic: how-to
ms.date: 05/23/2023
---

# Outbound network rules using Azure Policy (Preview)

Outbound white listing of Fully Qualified Domain Names (FQDN) is a network security practice that allows organizations to control and restrict outbound traffic from their networks to specific, approved domain names.

## Overview

Outbound rules in Azure Data Factory are an effective way for users to limit outgoing traffic by specifying allowed Fully Qualified Domain Names (FQDN) or network endpoints. This critical feature offers network security administrators greater control, improving governance and preventing data exfiltration. [Azure Policy](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d02a511-74e5-4dab-a5fd-878704d4a61a) is used to enforce these rules .  

These outbound rules apply to various pipeline activities. This includes Copy, Dataflows, Web, Webhook, and Azure Function activities, as well as authoring scenarios like data preview and test connection. In addition to Managed VNet, these outbound rules help you build a secure and exfiltration-proof data integration solution.

> [!NOTE]
> This feature is currently in preview.

## Prerequisites

To apply an Azure Policy to Azure Data Factory, user needs to have the [Resource Policy Contributor](/azure/role-based-access-control/built-in-roles#resource-policy-contributor) permission. This role can be assigned to the individual responsible for configuring policies for Data Factory.

## Steps to enable Azure Policy for outbound rules

To apply policies to an Azure Data Factory instance, complete the following steps.

1. Navigate to a resource group that contains the Azure Data Factory instance.

   :::image type="content" source="media/configure-outbound-allow-list-azure-policy/access-policies-from-resource-group.png" alt-text="Screenshot showing a resource group in the Azure portal with the Policies settings option highlighted.":::

1. Select the policies tab on the left and then navigate to built-in policy definitions published by Microsoft. Select **ADF_Dataplane_Policies - Microsoft Azure**.

   :::image type="content" source="media/configure-outbound-allow-list-azure-policy/dataplane-policies.png" alt-text="Screenshot showing the ADF data plane Policies for Microsoft Azure.":::

1. Assign the policy.

1. On the **Parameters** tab, provide the list of domain names that are trusted, then select **Save**.

   > [!NOTE]
   > This is a JSON array and needs to be provided as shown in the image, with each domain in quotes, separated by commas, and the entire list surrounded by square brackets.

   :::image type="content" source="media/configure-outbound-allow-list-azure-policy/dataplane-policies-domain-name-list.png" alt-text="Screenshot showing the ADF_Dataplane_Policies policy assignment dialog with the Parameters tab selected and a domain list provided.":::

1. Review and create the policy.

1. Navigate to the [Azure Data Factory Studio](https://adf.azure.com) and enable outbound rules functionality by selecting the **Manage** tab on the left, and then **Outbound rules**.

   :::image type="content" source="media/configure-outbound-allow-list-azure-policy/outbound-rules.png" lightbox="media/configure-outbound-allow-list-azure-policy/outbound-rules.png" alt-text="Screenshot showing the outbound rules configuration in Azure Data Factory Studio.":::

   > [!NOTE]
   > To update the allow-list to add new URLs, edit the policy parameters.

## Known limitations

- Outbound policy rules aren't enforced for **Airflow** and **SSIS** scenarios.
- While configuring domain names, you must provide fully qualified domain names. Wildcard/regex patterns aren't supported in domain names. If you want to specify that both microsoft.com, & www.microsoft.com as trusted domains, then both need to be specified while configuring policy. For example: [“microsoft.com”, “www.microsoft.com”].
- Throttling limits applied in Azure Policy during the preview: 
  - For an individual Azure Data factory: 1,000 requests / 5 minutes. Only 1,000 activity runs can be executed in a 5-minute period. Subsequent run requests fail once this limit is reached. 
  - For a subscription: 50,000 requests / 5 minutes. Only 50,000 activity runs can be executed in a 5-minute period per subscription. Subsequent run requests fail once this limit is reached.

## Next steps

Check out the following article to learn more about the Azure security baseline:

[Azure security baseline](/security/benchmark/azure/baselines/data-factory-security-baseline?toc=%2Fazure%2Fdata-factory%2FTOC.json)
