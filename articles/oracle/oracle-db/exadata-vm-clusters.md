---
title: Onboard Oracle Exadata VM Clusters to Microsoft Defender for Cloud using Azure Arc  
description: Microsoft Defender for Cloud extends unified security protection and posture management to Oracle Exadata VM clusters running in Azure by leveraging Azure Arc. This enables continuous monitoring, threat detection, and vulnerability management for Oracle VMs as if they were native Azure resources.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 09/26/2025
---

# Onboard Oracle Exadata VM clusters to Microsoft Defender for Cloud using Azure Arc

In this article, you learn about how to onboard Oracle Exadata VM clusters into Azure using Azure Arc and enabling Microsoft Defender for Cloud’s Defender for Servers Plan 1 to effectively monitor and protect them.

Microsoft Defender for Cloud is a Cloud Native Application Protection Platform (CNAPP), that combines Cloud Security Posture Management (CSPM) and Cloud Workload Protection Platform (CWPP) capabilities to deliver unified threat protection and posture management across Azure and hybrid environments. It continuously monitors resources for misconfigurations, vulnerabilities, and active threats to help maintain a strong security posture. While Defender for Cloud is designed for Azure-native services, it can also extend protection to hybrid and non-Azure environments—such as **Oracle Database@Azure  Exadata VM clusters**—by leveraging Azure Arc. Defender for Cloud continuously assesses their configurations, monitors for threats, and generates security alerts (using Defender for Servers) if suspicious activity is detected. 

Defender for Cloud functions as the security guardian for Oracle infrastructure running in Azure, ensuring Oracle VMs hosted in Azure are secured and compliant just like native Azure services.  


## Prerequisites

To begin, ensure the following prerequisites are met: 

- **Azure subscription & permissions**
  - An active Azure subscription with Owner or Contributor access. Permissions to register Azure Arc resources and enable Defender for Cloud for that subscription are needed.
- **Oracle Exadata environment**
  - A deployed Oracle Database@Azure environment. Administrative access to the Oracle VM(s) in the cluster (for example, SSH) is required to install the Azure Arc Connected Machine agent.
- **Network connectivity**
  - Oracle Exadata VM(s) must be able to reach Azure Arc services. Ensure outbound HTTPS (port 443) to Azure is available, or set up Azure Arc Private Link or a proxy if required.
- **Azure Arc setup**
  - Register Azure Arc resource providers in the appropriate subscription (for example: `Microsoft.HybridCompute`, `Microsoft.GuestConfiguration`, etc.).
  - Review Azure Arc server [prerequisites](/azure/azure-arc/servers/prerequisites) for supported operating systems and networking requirements for Azure Arc. 

---

## Step-by-step instructions

The process requires the following three steps:  

### 1. Install Azure Arc Agent on Oracle Exadata VM clusters

Deploy the Azure Connected Machine agent on each Oracle VM in the Exadata cluster. This agent establishes the connection between the Exadata VM and Azure. Using Azure Arc onboarding (via the Azure portal script or CLI), register the Oracle VM(s) to the Azure subscription and resource group. Once connected, the servers become **Arc-enabled** and will appear in Azure as Arc resources.
1. **Generate and run the Arc installation script**: In the Azure portal, navigate to **Azure Arc > Servers** and click **+ Add** (Add a server). Select the option to Generate script for a single server. Azure will provide a tailored installation script. Run this script on each Oracle Exadata VM  to install the Connected Machine agent and onboard the machine to Azure Arc. For detailed instructions, see the [Quickstart: Connect a machine to Azure Arc-enabled servers | Microsoft Learn](/azure/azure-arc/servers/quick-enable-hybrid-vm).
2. **Network Requirements for Oracle Database@Azure:**
    -   Oracle Database@Azure has no internet access by default. Configure outbound connectivity using:
        - **Azure Private Link for Arc** (recommended) [Use Azure Private Link to connect servers to Azure Arc using a private endpoint - Azure Arc | Microsoft Learn](/azure/azure-arc/servers/private-link-security)
        - **Azure NAT Gateway** in a delegated subnet.
        - **Azure Firewall** with [Arc endpoint rules](/azure/azure-arc/servers/network-requirements) 
        - See Oracle Database@Azure network design [Security for Oracle Database@Azure - Cloud Adoption Framework | Microsoft Learn](/azure/cloud-adoption-framework/scenarios/oracle-on-azure/oracle-security-overview-odaa#design-considerations) for complete requirements. 
3. **Verify Azure resource visibility** 
    - After installing the agent, confirm that each Oracle DB server appears in the Azure portal as an Arc-enabled resource. In Azure portal, go to **Azure Arc > Servers** (or **Azure Arc > Machine** if updated) and verify that the Oracle Exadata machine is listed as an **Arc-enabled server** with a status of Connected. This means the Azure Arc agent is successfully reporting to Azure. 

### 2. Enable Microsoft Defender for Servers plan

Defender for Cloud includes Defender for Servers plans that provide workload protection for Arc-enabled machines.

- **Plan 1** - Provides basic endpoint detection and response (EDR) through Defender for Endpoint, along with software inventory. 
- **Plan 2** – Includes all Plan 1 features, plus Premium Vulnerability Management, compliance assessment, and file integrity monitoring.
For Oracle Database@Azure environments, consider Plan 2 for Premium Vulnerability Management capabilities. Compare Arc-specific features at [Support for the Defender for Servers plan - Microsoft Defender for Cloud | Microsoft Learn](/azure/defender-for-cloud/support-matrix-defender-for-servers#azure-arc-enabled-servers)

>[!NOTE]
> Agentless scanning is available only for Azure-native VMs and not for Arc-enabled servers. For Oracle Database@Azure environments, consider Plan 2 to get Premium Vulnerability Management.

Enabling this plan enrolls the Arc machines in Defender for Cloud and ensures they receive server-level threat protection and monitoring. 

1. Sign in to the Azure portal and open **Microsoft Defender for Cloud** from the left-hand menu. The Defender for Cloud overview page will open. 
2. In Defender for Cloud, select **Environment settings** from the menu on the left. This is where Defender plans per subscription or workspace can be configured. 
  :::image type="content" source="media/environment-settings.png" alt-text="Screenshot showing where to select environment settings.":::
3. Choose the Azure subscription (or Log Analytics workspace, if applicable) that contains the Arc-enabled Oracle Exadata VM cluster.
4. Under **Defender plans**, locate **Servers Plan** and switch it to **On** Plan. This enables Microsoft Defender for Servers Plan 1 or Plan 2 for the selected subscription.
  :::image type="content" source="media/oracle-defender-plans.png" alt-text="Screenshot showing where to server plan and how to toggle between plan 1 and plan 2.":::
5. Click **Save** to apply the change.
Microsoft Defender for Cloud is now active for those Arc-enabled servers. 

### 3. Monitor Exadata VM clusters in Defender for Cloud
Once the servers are Arc-enabled and the Defender for Servers plan is active, the Oracle Exadata VM(s) will appear in Defender for Cloud’s Inventory alongside other resources. Defender for Cloud will begin assessing their security posture and monitoring them for threats just like any Azure VM. 
1. In Defender for Cloud, go to the **Inventory page** (under **Asset management**). Filter or scroll to find the Oracle Exadata VM resource (it will show up with Resource Type **Machine – Azure Arc**).The Arc-enabled Oracle server will be listed here, indicating that it is now under Defender for Cloud’s protection
    :::image type="content" source="media/oracle-inventory-asset.png" alt-text="Screenshot showing where to find Inventory page and asset management.":::
2. With the Defender for Servers Plan 1 enabled, the Arc-enabled Oracle servers benefit from the following security capabilities in Defender for Cloud: 
    - **Threat detection**: Identifies potential threats in real time using machine learning and behavioral analytics, and raises **security alerts** for suspicious activities (via Microsoft Defender for Endpoint integration). 
    - **Vulnerability assessment**: Performs regular vulnerability scans on the servers and provides recommendations to mitigate discovered vulnerabilities.  
    - **Integration with Azure Security Center**: The Arc-enabled Oracle machines are integrated into Azure Security Center/Defender for Cloud just like native Azure VMs, allowing unified **secure score** and **recommendations** tracking. 
    - **Compliance monitoring**: Includes the Arc-enabled servers in Azure Policy and regulatory compliance evaluations, helping ensure they meet necessary organization’s security compliance requirements. 

    :::image type="content" source="media/oracle-microsoft-defender.png" alt-text="Screenshot showing the benefits enabled by plan 1.":::
## Summary

By following these steps, you have successfully onboarded Exadata VM cluster into Azure Arc and enabled Microsoft Defender for Cloud to protect it.  Oracle Exadata servers are now visible in Azure and are being continuously monitored by Defender for Cloud. This protection threat detection and security management is the same as any Azure native resource. This hybrid integration provides a unified security posture across both Azure and Oracle environments. 

---

## Related topics

Core Documentation 
- [Oracle Database@Azure Overview](/azure/oracle/oracle-db/database-overview) 
- [Oracle Database@Azure Security Guidelines](/azure/cloud-adoption-framework/scenarios/oracle-on-azure/oracle-security-overview-odaa) 
- [Azure Arc Planning Guide](/azure/azure-arc/servers/plan-at-scale-deployment) 
- [Defender for Servers Support Matrix](/azure/defender-for-cloud/support-matrix-defender-for-servers) 
Troubleshooting and Support 
- [Azure Arc Network Requirements](/azure/azure-arc/servers/network-requirements?tabs=azure-cloud) 
- [Defender for Cloud Onboarding Guide](/azure/defender-for-cloud/quickstart-onboard-machines) 
