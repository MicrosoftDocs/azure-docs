---
title: Azure Policy Regulatory Compliance controls for Azure App Service
description: Lists Azure Policy Regulatory Compliance controls available for Azure App Service. These built-in policy definitions provide common approaches to managing the compliance of your Azure resources.
ms.date: 06/03/2022
ms.topic: sample
ms.service: app-service
ms.custom: subject-policy-compliancecontrols
---
# Azure Policy Regulatory Compliance controls for Azure App Service

[Regulatory Compliance in Azure Policy](../governance/policy/concepts/regulatory-compliance.md)
provides Microsoft created and managed initiative definitions, known as _built-ins_, for the
**compliance domains** and **security controls** related to different compliance standards. This
page lists the **compliance domains** and **security controls** for Azure App Service. You can
assign the built-ins for a **security control** individually to help make your Azure resources
compliant with the specific standard.

[!INCLUDE [Azure-policy-compliancecontrols-introwarning](../../includes/policy/standards/intro-warning.md)]

[!INCLUDE [Azure-policy-compliancecontrols-appservice](../../includes/policy/standards/byrp/microsoft.web.md)]

## Release notes

### June 2022

- Deprecation of policy "API App should only be accessible over HTTPS"
- Rename of policy "Web Application should only be accessible over HTTPS" to "App Service apps should only be accessible over HTTPS"
- Update scope of policy "App Service apps should only be accessible over HTTPS" to include all app types except Function apps
- Update scope of policy "App Service apps should only be accessible over HTTPS" to include slots
- Update scope of policy "Function apps should only be accessible over HTTPS" to include slots
- Update logic of policy "App Service apps should use a SKU that supports private link" to include checks on App Service plan tier or name so that the policy supports Terraform deployments
- Update list of supported SKUs of policy "App Service apps should use a SKU that supports private link" to include the Basic and Standard tiers

## Next steps

- Learn more about [Azure Policy Regulatory Compliance](../governance/policy/concepts/regulatory-compliance.md).
- See the built-ins on the [Azure Policy GitHub repo](https://github.com/Azure/azure-policy).
