# Tutorial: How to perform Security Analytics for Azure AD B2C with Sentinel

You can further secure your Azure AD B2C environment by routing logs and audit information to Azure Sentinel. Azure Sentinel is a cloud-native **Security Information Event Management (SIEM) and Security Orchestration Automated Response (SOAR)** solution. Azure Sentinel provides alert detection, threat visibility, proactive hunting, and threat response for **Azure AD B2C**.

By utilizing Azure Sentinel in conjunction with Azure AD B2C, you can:
1. Detect previously undetected threats, and minimize false positives using Microsoft's analytics and unparalleled threat intelligence.
1. Investigate threats with artificial intelligence, and hunt for suspicious activities at scale, tapping into years of cyber security work at Microsoft.
1. Respond to incidents rapidly with built-in orchestration and automation of common tasks.
1. Meet security and compliance requirements for your organization.

In this tutorial, you’ll learn:
1. How to transfer the B2C logs to Azure Monitor so they land in a Log Analytics workspace.
1. Enable Azure Sentinel the LA workspace.
1. Create a sample rule that will trigger an incident.
1. 9And lastly, configure some automated response.

### Deployment overview

1. ### Configure AAD B2C with Azure Monitor
Follow the link here to configure your Azure AD B2C tenant to send logs to Azure Monitor.
1. ### Deploy an Azure Sentinel instance

> [!IMPORTANT]
> To enable Azure Sentinel, you need contributor permissions to the subscription in which the Azure Sentinel workspace resides. To use Azure Sentinel, you need either contributor or reader permissions on the resource group that the workspace belongs to.

Once you've configured your Azure AD B2C instance to send logs to Azure Monitor, you need to enable an Azure Sentinel instance. 

