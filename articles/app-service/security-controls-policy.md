---
title: Azure Policy Regulatory Compliance controls for Azure App Service
description: Lists Azure Policy Regulatory Compliance controls available for Azure App Service. These built-in policy definitions provide common approaches to managing the compliance of your Azure resources.
ms.date: 09/19/2023
ms.topic: sample
ms.service: app-service
ms.custom: "UpdateFrequency3, subject-policy-compliancecontrols"
author: cephalin
ms.author: cephalin
---
# Azure Policy Regulatory Compliance controls for Azure App Service

[Regulatory Compliance in Azure Policy](../governance/policy/concepts/regulatory-compliance.md)
provides Microsoft created and managed initiative definitions, known as *built-ins*, for the
**compliance domains** and **security controls** related to different compliance standards. This
page lists the **compliance domains** and **security controls** for Azure App Service. You can
assign the built-ins for a **security control** individually to help make your Azure resources
compliant with the specific standard.

[!INCLUDE [Azure-policy-compliancecontrols-introwarning](../../includes/policy/standards/intro-warning.md)]

[!INCLUDE [Azure-policy-compliancecontrols-appservice](../../includes/policy/standards/byrp/microsoft.web.md)]

## Release notes

### April 2023

- **App Service apps that use Java should use the latest 'Java version'**
  - Rename of policy to "App Service apps that use Java should use a specified 'Java version'"
  - Update policy so that it requires a version specification before assignment
- **App Service apps that use Python should use the latest 'Python version'**
  - Rename of policy to "App Service apps that use Python should use a specified 'Python version'"
  - Update policy so that it requires a version specification before assignment
- **Function apps that use Java should use the latest 'Java version'**
  - Rename of policy to "Function apps that use Java should use a specified 'Java version'"
  - Update policy so that it requires a version specification before assignment
- **Function apps that use Python should use the latest 'Python version'**
  - Rename of policy to "Function apps that use Python should use a specified 'Python version'"
  - Update policy so that it requires a version specification before assignment
- **App Service apps that use PHP should use the latest 'PHP version'**
  - Rename of policy to "App Service apps that use PHP should use a specified 'PHP version'"
  - Update policy so that it requires a version specification before assignment
- **App Service app slots that use Python should use a specified 'Python version'**
  - New policy created
- **Function app slots that use Python should use a specified 'Python version'**
  - New policy created
- **App Service app slots that use PHP should use a specified 'PHP version'**
  - New policy created
- **App Service app slots that use Java should use a specified 'Java version'**
  - New policy created
- **Function app slots that use Java should use a specified 'Java version'**
  - New policy created

### November 2022

- Deprecation of policy **App Service apps should enable outbound non-RFC 1918 traffic to Azure Virtual Network**
  - Replaced by a policy with the same display name based on the site property to support *Deny* effect
- Deprecation of policy **App Service app slots should enable outbound non-RFC 1918 traffic to Azure Virtual Network**
  - Replaced by a policy with the same display name based on the site property to support *Deny* effect
- **App Service apps should enable outbound non-RFC 1918 traffic to Azure Virtual Network**
  - New policy created
- **App Service app slots should enable outbound non-RFC 1918 traffic to Azure Virtual Network**
  - New policy created
- **App Service apps should enable configuration routing to Azure Virtual Network**
  - New policy created
- **App Service app slots should enable configuration routing to Azure Virtual Network**
  - New policy created

### October 2022

- **Function app slots should have remote debugging turned off**
  - New policy created
- **App Service app slots should have remote debugging turned off**
  - New policy created
- **Function app slots should use latest 'HTTP Version'**
  - New policy created
- **Function app slots should use the latest TLS version**
  - New policy created
- **App Service app slots should use the latest TLS version**
  - New policy created
- **App Service app slots should have resource logs enabled**
  - New policy created
- **App Service app slots should enable outbound non-RFC 1918 traffic to Azure Virtual Network**
  - New policy created
- **App Service app slots should use managed identity**
  - New policy created
- **App Service app slots should use latest 'HTTP Version'**
  - New policy created
- Deprecation of policy **Configure App Services to disable public network access**
  - Replaced by "Configure App Service apps to disable public network access"
- Deprecation of policy **App Services should disable public network access**
  - Replaced by "App Service apps should disable public network access" to support *Deny* effect
- **App Service apps should disable public network access**
  - New policy created
- **App Service app slots should disable public network access**
  - New policy created
- **Configure App Service apps to disable public network access**
  - New policy created
- **Configure App Service app slots to disable public network access**
  - New policy created
- **Function apps should disable public network access**
  - New policy created
- **Function app slots should disable public network access**
  - New policy created
- **Configure Function apps to disable public network access**
  - New policy created
- **Configure Function app slots to disable public network access**
  - New policy created
- **Configure App Service app slots to turn off remote debugging**
  - New policy created
- **Configure Function app slots to turn off remote debugging**
  - New policy created
- **Configure App Service app slots to use the latest TLS version**
  - New policy created
- **Configure Function app slots to use the latest TLS version**
  - New policy created
- **App Service apps should use latest 'HTTP Version'**
  - Update scope to include Windows apps
- **Function apps should use latest 'HTTP Version'**
  - Update scope to include Windows apps
- **App Service Environment apps should not be reachable over public internet**
  - Modify policy definition to remove check on API version

### September 2022

- **App Service apps should be injected into a virtual network**
  - Update scope of policy to remove slots
    - Creation of "App Service app slots should be injected into a virtual network" to monitor slots
- **App Service app slots should be injected into a virtual network**
  - New policy created
- **Function apps should have 'Client Certificates (Incoming client certificates)' enabled**
  - Update scope of policy to remove slots
    - Creation of "Function app slots should have 'Client Certificates (Incoming client certificates)' enabled" to monitor slots
- **Function app slots should have 'Client Certificates (Incoming client certificates)' enabled**
  - New policy created
- **Function apps should use an Azure file share for its content directory**
  - Update scope of policy to remove slots
    - Creation of "Function app slots should use an Azure file share for its content directory" to monitor slots
- **Function app slots should use an Azure file share for its content directory**
  - New policy created
- **App Service apps should have 'Client Certificates (Incoming client certificates)' enabled**
  - Update scope of policy to remove slots
    - Creation of "App Service app slots should have 'Client Certificates (Incoming client certificates)' enabled" to monitor slots
- **App Service app slots should have 'Client Certificates (Incoming client certificates)' enabled**
  - New policy created
- **App Service apps should use an Azure file share for its content directory**
  - Update scope of policy to remove slots
    - Creation of "App Service app slots should use an Azure file share for its content directory" to monitor slots
- **App Service app slots should use an Azure file share for its content directory**
  - New policy created 
- **Function app slots should require FTPS only**
  - New policy created
- **App Service app slots should require FTPS only**
  - New policy created
- **Function app slots should not have CORS configured to allow every resource to access your apps**
  - New policy created
- **App Service app slots should not have CORS configured to allow every resource to access your app**
  - New policy created
- **Function apps should only be accessible over HTTPS**
  - Update scope of policy to remove slots
    - Creation of "Function app slots should only be accessible over HTTPS" to monitor slots
  - Add "Deny" effect
  - Creation of "Configure Function apps to only be accessible over HTTPS" for enforcement of policy
- **Function app slots should only be accessible over HTTPS**
  - New policy created
- **Configure Function apps to only be accessible over HTTPS**
  - New policy created
- **Configure Function app slots to only be accessible over HTTPS**
  - New policy created
- **App Service apps should use a SKU that supports private link**
  - Update list of supported SKUs of policy to include the Workflow Standard tier for Logic Apps
- **Configure App Service apps to use the latest TLS version**
  - New policy created
- **Configure Function apps to use the latest TLS version**
  - New policy created
- **Configure App Service apps to turn off remote debugging**
  - New policy created
- **Configure Function apps to turn off remote debugging**
  - New policy created

### August 2022

- **App Service apps should only be accessible over HTTPS**
  - Update scope of policy to remove slots
    - Creation of "App Service app slots should only be accessible over HTTPS" to monitor slots
  - Add "Deny" effect
  - Creation of "Configure App Service apps to only be accessible over HTTPS" for enforcement of policy
- **App Service app slots should only be accessible over HTTPS**
  - New policy created
- **Configure App Service apps to only be accessible over HTTPS**
  - New policy created
- **Configure App Service app slots to only be accessible over HTTPS**
  - New policy created

### July 2022

- Deprecation of the following policies:
  - **Ensure API app has 'Client Certificates (Incoming client certificates)' set to 'On'**
  - **Ensure that 'Python version' is the latest, if used as a part of the API app**
  - **CORS should not allow every resource to access your API App**
  - **Managed identity should be used in your API App**
  - **Remote debugging should be turned off for API Apps**
  - **Ensure that 'PHP version' is the latest, if used as a part of the API app**
  - **API apps should use an Azure file share for its content directory**
  - **FTPS only should be required in your API App**
  - **Ensure that 'Java version' is the latest, if used as a part of the API app**
  - **Ensure that 'HTTP Version' is the latest, if used to run the API app**
  - **Latest TLS version should be used in your API App**
  - **Authentication should be enabled on your API app**
- **Function apps should have 'Client Certificates (Incoming client certificates)' enabled**
  - Update scope of policy to include slots
  - Update scope of policy to exclude Logic apps
- **Ensure WEB app has 'Client Certificates (Incoming client certificates)' set to 'On'**
  - Rename of policy to "App Service apps should have 'Client Certificates (Incoming client certificates)' enabled"
  - Update scope of policy to include slots
  - Update scope of policy to include all app types except Function apps
- **Ensure that 'Python version' is the latest, if used as a part of the Web app**
  - Rename of policy to "App Service apps that use Python should use the latest 'Python version'"
  - Update scope of policy to include all app types except Function apps
- **Ensure that 'Python version' is the latest, if used as a part of the Function app**
  - Rename of policy to "Function apps that use Python should use the latest 'Python version'"
  - Update scope of policy to exclude Logic apps
- **CORS should not allow every resource to access your Web Applications**
  - Rename of policy to "App Service apps should not have CORS configured to allow every resource to access your apps"
  - Update scope of policy to include all app types except Function apps
- **CORS should not allow every resource to access your Function Apps**
  - Rename of policy to "Function apps should not have CORS configured to allow every resource to access your apps"
  - Update scope of policy to exclude Logic apps
- **Managed identity should be used in your Function App**
  - Rename of policy to "Function apps should use managed identity"
  - Update scope of policy to exclude Logic apps
- **Managed identity should be used in your Web App**
  - Rename of policy to "App Service apps should use managed identity"
  - Update scope of policy to include all app types except Function apps
- **Remote debugging should be turned off for Function Apps**
  - Rename of policy to "Function apps should have remote debugging turned off"
  - Update scope of policy to exclude Logic apps
- **Remote debugging should be turned off for Web Applications**
  - Rename of policy to "App Service apps should have remote debugging turned off"
  - Update scope of policy to include all app types except Function apps
- **Ensure that 'PHP version' is the latest, if used as a part of the WEB app**
  - Rename of policy to "App Service apps that use PHP should use the latest 'PHP version'"
  - Update scope of policy to include all app types except Function apps
- **App Service slots should have local authentication methods disabled for SCM site deployment**
  - Rename of policy to "App Service app slots should have local authentication methods disabled for SCM site deployments"
- **App Service should have local authentication methods disabled for SCM site deployments**
  - Rename of policy to "App Service apps should have local authentication methods disabled for SCM site deployments"
- **App Service slots should have local authentication methods disabled for FTP deployments**
  - Rename of policy to "App Service app slots should have local authentication methods disabled for FTP deployments"
- **App Service should have local authentication methods disabled for FTP deployments**
  - Rename of policy to "App Service apps should have local authentication methods disabled for FTP deployments"
- **Function apps should use an Azure file share for its content directory**
  - Update scope of policy to include slots
  - Update scope of policy to exclude Logic apps
- **Web apps should use an Azure file share for its content directory**
  - Rename of policy to "App Service apps should use an Azure file share for its content directory"
  - Update scope of policy to include slots
  - Update scope of policy to include all app types except Function apps
- **FTPS only should be required in your Function App**
  - Rename of policy to "Function apps should require FTPS only"
  - Update scope of policy to exclude Logic apps
- **FTPS should be required in your Web App**
  - Rename of policy to "App Service apps should require FTPS only"
  - Update scope of policy to include all app types except Function apps
- **Ensure that 'Java version' is the latest, if used as a part of the Function app**
  - Rename of policy to "Function apps that use Java should use the latest 'Java version'"
  - Update scope of policy to exclude Logic apps
- **Ensure that 'Java version' is the latest, if used as a part of the Web app**
  - Rename of policy to "App Service apps that use Java should use the latest 'Java version"
  - Update scope of policy to include all app types except Function apps
- **App Service should use private link**
  - Rename of policy to "App Service apps should use private link"
- **Configure App Services to use private DNS zones**
  - Rename of policy to "Configure App Service apps to use private DNS zones"
- **App Service Apps should be injected into a virtual network**
  - Rename of policy to "App Service apps should be injected into a virtual network"
  - Update scope of policy to include slots
- **Ensure that 'HTTP Version' is the latest, if used to run the Web app**
  - Rename of policy to "App Service apps should use latest 'HTTP Version'"
  - Update scope of policy to include all app types except Function apps
- **Ensure that 'HTTP Version' is the latest, if used to run the Function app**
  - Rename of policy to "Function apps should use latest 'HTTP Version'"
  - Update scope of policy to exclude Logic apps
- **Latest TLS version should be used in your Web App**
  - Rename of policy to "App Service apps should use the latest TLS version"
  - Update scope of policy to include all app types except Function apps
- **Latest TLS version should be used in your Function App**
  - Rename of policy to "Function apps should use the latest TLS version"
  - Update scope of policy to exclude Logic apps
- **App Service Environment should disable TLS 1.0 and 1.1**
  - Rename of policy to "App Service Environment should have TLS 1.0 and 1.1 disabled"
- **Resource logs in App Services should be enabled**
  - Rename of policy to "App Service apps should have resource logs enabled"
- **Authentication should be enabled on your web app**
  - Rename of policy to "App Service apps should have authentication enabled"
- **Authentication should be enabled on your Function app**
  - Rename of policy to "Function apps should have authentication enabled"
  - Update scope of policy to exclude Logic apps
- **App Service Environment should enable internal encryption**
  - Rename of policy to "App Service Environment should have internal encryption enabled"
- **Function apps should only be accessible over HTTPS**
  - Update scope of policy to exclude Logic apps
- **App Service should use a virtual network service endpoint**
  - Rename of policy to "App Service apps should use a virtual network service endpoint"
  - Update scope of policy to include all app types except Function apps

### June 2022

- Deprecation of policy **API App should only be accessible over HTTPS**
- **Web Application should only be accessible over HTTPS**
  - Rename of policy to "App Service apps should only be accessible over HTTPS"
  - Update scope of policy to include all app types except Function apps
  - Update scope of policy to include slots
- **Function apps should only be accessible over HTTPS**
  - Update scope of policy to include slots
- **App Service apps should use a SKU that supports private link**
  - Update logic of policy to include checks on App Service plan tier or name so that the policy supports Terraform deployments
  - Update list of supported SKUs of policy to include the Basic and Standard tiers

## Next steps

- Learn more about [Azure Policy Regulatory Compliance](../governance/policy/concepts/regulatory-compliance.md).
- See the built-ins on the [Azure Policy GitHub repo](https://github.com/Azure/azure-policy).
