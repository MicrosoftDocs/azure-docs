---
title: Troubleshoot an attribute not synchronizing in Azure AD Connect | Microsoft Docs'
description: This topic provides steps for how to troubleshoot issues with attribute synchronization using the troubleshooting task.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: curtand
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/31/2019
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Troubleshoot an attribute not synchronizing in Azure AD Connect

## **Recommended Steps**

Before investigating attribute syncing issues, let’s understand the **Azure AD Connect** syncing process:

  ![Azure AD Connect Synchronization Process](media/tshoot-connect-attribute-not-syncing/tshoot-connect-attribute-not-syncing/syncingprocess.png)

### **Terminology**

* **CS:** Connector Space, a table in database.
* **MV:** Metaverse, a table in database.
* **AD:** Active Directory
* **AAD:** Azure Active Directory

### **Synchronization Steps**

* Import from AD: Active Directory objects are brought into AD CS.

* Import from AAD: Azure Active Directory objects are brought into AAD CS.

* Synchronization: **Inbound Synchronization Rules** and **Outbound Synchronization Rules** are run in the order of precedence number from lower to higher. To view the Synchronization Rules, you can go to **Synchronization Rules Editor** from the desktop applications. The **Inbound Synchronization Rules** brings in data from CS to MV. The **Outbound Synchronization Rules** moves data from MV to CS.

* Export to AD: After running Synchronization, objects are exported from AD CS to **Active Directory**.

* Export to AAD: After running Synchronization, objects are exported from AAD CS to **Azure Active Directory**.

### **Step by Step Investigation**

* We will start our search from the **Metaverse** and look at the attribute mapping from source to target.

* Launch **Synchronization Service Manager** from the desktop applications, as shown below:

  ![Launch Synchronization Service Manager](media/tshoot-connect-attribute-not-syncing/tshoot-connect-attribute-not-syncing/startmenu.png)

* On the **Synchronization Service Manager**, select the **Metaverse Search**, select **Scope by Object Type**, select the object using an attribute, and click **Search** button.

  ![Metaverse Search](media/tshoot-connect-attribute-not-syncing/tshoot-connect-attribute-not-syncing/mvsearch.png)

* Double click the object found in the **Metaverse** search to view all its attributes. You can click on the **Connectors** tab to look at corresponding object in all the **Connector Spaces**.

  ![Metaverse Object Connectors](media/tshoot-connect-attribute-not-syncing/tshoot-connect-attribute-not-syncing/mvattributes.png)

* Double click on the **Active Directory Connector** to view the **Connector Space** attributes. Click on the **Preview** button, on the following dialog click on the **Generate Preview** button.

  ![Connector Space Attributes](media/tshoot-connect-attribute-not-syncing/tshoot-connect-attribute-not-syncing/csattributes.png)

* Now click on the **Import Attribute Flow**, this shows flow of attributes from **Active Directory Connector Space** to the **Metaverse**. **Sync Rule** column shows which **Synchronization Rule** contributed to that attribute. **Data Source** column shows you the attributes from the **Connector Space**. **Metaverse Attribute** column shows you the attributes in the **Metaverse**. You can look for the attribute not syncing here. If you don't find the attribute here, then this is not mapped and you have to create new custom **Synchronization Rule** to map the attribute.

  ![Connector Space Attributes](media/tshoot-connect-attribute-not-syncing/tshoot-connect-attribute-not-syncing/cstomvattributeflow.png)

* Click on the **Export Attribute Flow** in the left pane to view the attribute flow from **Metaverse** back to **Active Directory Connector Space** using **Outbound Synchronization Rules**.

  ![Connector Space Attributes](media/tshoot-connect-attribute-not-syncing/tshoot-connect-attribute-not-syncing/mvtocsattributeflow.png)

* Similarly, you can view the **Azure Active Directory Connector Space** object and can generate the **Preview** to view attribute flow from **Metaverse** to the **Connector Space** and vice versa, this way you can investigate why an attribute is not syncing.

## **Recommended Documents**
* [Azure AD Connect sync: Technical Concepts](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-sync-technical-concepts)
* [Azure AD Connect sync: Understanding the architecture](https://docs.microsoft.com/azure/active-directory/hybrid/concept-azure-ad-connect-sync-architecture)
* [Azure AD Connect sync: Understanding Declarative Provisioning](https://docs.microsoft.com/azure/active-directory/hybrid/concept-azure-ad-connect-sync-declarative-provisioning)
* [Azure AD Connect sync: Understanding Declarative Provisioning Expressions](https://docs.microsoft.com/azure/active-directory/hybrid/concept-azure-ad-connect-sync-declarative-provisioning-expressions)
* [Azure AD Connect sync: Understanding the default configuration](https://docs.microsoft.com/azure/active-directory/hybrid/concept-azure-ad-connect-sync-default-configuration)
* [Azure AD Connect sync: Understanding Users, Groups, and Contacts](https://docs.microsoft.com/azure/active-directory/hybrid/concept-azure-ad-connect-sync-user-and-contacts)
* [Azure AD Connect sync: Shadow attributes](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-syncservice-shadow-attributes)

## Next Steps

- [Azure AD Connect sync](how-to-connect-sync-whatis.md).
- [What is hybrid identity?](whatis-hybrid-identity.md).
