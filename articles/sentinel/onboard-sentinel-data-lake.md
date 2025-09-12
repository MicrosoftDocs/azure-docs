---
title: Onboard Microsoft Sentinel Data Lake
description: Enable and configure Microsoft Sentinel Data Lake, including prerequisites, permissions, onboarding steps, and data retention management in the Microsoft Defender portal.
author: KanenasCS
ms.author: bagol
ms.topic: how-to
ms.date: 09/01/2025
ms.collection: usx-security

#Customer intent: As a security operations team member, I want to onboard Microsoft Sentinel Data Lake so that I can store high-volume, long-term logs for up to 12 years and query them in the Microsoft Defender portal.
---

# Onboard Microsoft Sentinel Data Lake

Microsoft Sentinel Data Lake provides cost-effective, long-term storage for security logs and supports data analysis through [Microsoft Defender XDR](/microsoft-365/security/defender). With Data Lake, security teams can store high-volume, low-fidelity logs (such as firewall or DNS data, asset inventories, and historical records) for up to 12 years, while continuing to use the analytics tier for advanced hunting and real-time alerting.

This article explains how to enable Microsoft Sentinel Data Lake, configure roles and permissions, and manage table tiers and retention policies in the Microsoft Defender portal.

---

## Prerequisites and considerations

Before onboarding Microsoft Sentinel Data Lake, ensure the following:

- At least one active Azure subscription and a resource group for Data Lake billing.  
- Subscription [Owner](/azure/role-based-access-control/built-in-roles#owner) role required.  
- Global or Security Administrator role in Microsoft Entra ID.  
- Microsoft Sentinel primary workspace **must be integrated with Microsoft Defender XDR**.  
- Microsoft Sentinel workspace **must be in the same region as your tenant’s home region**.  
- Read privileges required in the primary and secondary workspaces to attach them to the Data Lake.  

**Considerations:**

- Once enabled, data in the Microsoft Sentinel analytics tier is also available in the Data Lake tier without extra charge.  
  ![Screenshot showing Microsoft Sentinel Data Lake enablement confirmation](https://github.com/user-attachments/assets/877cfd5d-42c9-45b2-8ce9-f5fa85ef563d)

- Data ingestion takes **90–120 minutes** after enabling or switching ingestion tiers.  
- Tables in the Auxiliary tier are migrated to Data Lake and no longer available in Advanced Hunting.  
- Tables in the Basic tier aren’t supported by Data Lake.  
- For the XDR tier, retention is limited to 30 days, with no option for direct Data Lake storage.  
- KQL jobs can be scheduled to promote results from the Data Lake tier to the Analytics tier.  

---

## Microsoft Sentinel Data Lake permissions

| Role Type            | Role Name          | Purpose                                                                 |
|----------------------|-------------------|-------------------------------------------------------------------------|
| Microsoft Entra ID   | Security Reader   | Read access to all Data Lake workspaces and run KQL queries              |
| Microsoft Entra ID   | Security Operator | Write access to Data Lake workspaces and manage jobs                     |
| Azure built-in roles | Sentinel Contributor, Lighthouse, etc. | Access to specific Sentinel workspaces |

---

## Onboard Microsoft Sentinel Data Lake

To enable Microsoft Sentinel Data Lake in the Defender portal:

1. Sign in to the [Microsoft Defender portal](https://security.microsoft.com).  
2. Go to **System > Settings > Microsoft Sentinel > Data Lake**.  
3. Select **Start setup**.  
   ![Screenshot showing Start setup option for Sentinel Data Lake](https://github.com/user-attachments/assets/9ae0871e-4025-4153-8070-b086a7d5c787)

4. Choose the subscription and resource group for Data Lake billing.  
5. Select **Set up data lake**.  
   ![Screenshot showing subscription and resource group selection for Data Lake](https://github.com/user-attachments/assets/e2ed24d1-9214-44c9-9cd5-4d9a20795118)

6. Wait 30–40 minutes for setup to complete.  
7. A confirmation banner appears on the Defender portal homepage once the Data Lake is created.  
   ![Screenshot showing confirmation banner for Data Lake creation](https://github.com/user-attachments/assets/32d05435-6c22-4f2f-84f6-c980957c1a0c)

8. The Defender XDR homepage also shows a banner confirming Data Lake creation.  
   ![Screenshot showing Defender XDR homepage with Data Lake banner](https://github.com/user-attachments/assets/7ab15fd1-b307-4574-bd1e-e0022708dc0a)

---

## Auto-created resources

When onboarding completes, a hidden resource is provisioned with the prefix `msg-resources-<GUID>`.  
![Screenshot showing auto-created msg-resources managed identity](https://github.com/user-attachments/assets/72272ebb-964f-4e92-8747-3993c2e6af8c)

- This resource is a managed identity.  
  ![Screenshot showing managed identity properties for Data Lake](https://github.com/user-attachments/assets/5e0e840f-ec43-42e1-9e83-d2347cc90a7f)

- It is granted the **Azure Reader** role for all subscriptions onboarded into the Data Lake.  
  ![Screenshot showing Azure Reader role assigned to Data Lake identity](https://github.com/user-attachments/assets/2959c8b0-b80d-42ad-9517-f4c253a842f0)

---

## Explore Data Lake with KQL queries

1. Navigate to **Microsoft Sentinel > Configuration > Data Lake exploration > KQL queries**.  
   ![Screenshot showing Data Lake exploration KQL queries page](https://github.com/user-attachments/assets/cde76574-79cc-4759-8ed7-eb7ae7e3774b)

2. In the workspace scope, switch from the default workspace to the connected Sentinel workspace.  
3. Run a KQL query against the Data Lake tier.  

---

## Manage table tiers and retention

You can manage table retention and tiers in a unified panel:  

1. Go to **Microsoft Sentinel > Configuration > Tables**.  
2. Select a table and choose **Manage table**.  
3. Configure data retention according to its assigned tier:  
   - **Analytics tier**: 90 days free, up to 2 years.  
   - **Data Lake tier**: Up to 12 years.  
   - **XDR default tier**: 30 days free, up to 12 years.  

> [!NOTE]  
> You can configure a table to ingest data exclusively in the Data Lake tier. Once enabled, new data won’t be ingested into the Analytics tier.  

---

## Next steps

- [Run KQL jobs to move data from the Data Lake tier to the Analytics tier](#)  
- [Explore Data Lake analytics in the Microsoft Defender portal](#)  
- [Manage Microsoft Sentinel costs](#)  
