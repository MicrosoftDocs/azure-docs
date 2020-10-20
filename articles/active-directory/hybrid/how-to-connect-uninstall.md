---
title: Uninstall Azure AD Connect
description: This document describes how to move the Azure AD Connect database from the local SQL Server Express server to a remote SQL Server.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/15/2019
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Uninstall Azure AD Connect

This document describes how to correctly uninstall Azure AD Connect.

## Uninstall Azure AD Connect from the server
The first thing you need to do is remove Azure AD Connect from the server that it is running on.  Use the following steps:

1. Sign-in to the server running Azure AD Connect.
2. Navigate to **Control Panel**
3. Click **Uninstall a program**
![](media/how-to-connect-uninstall/uninstall1.png)</br>
4. Select **Azure AD Connect**.
![](media/how-to-connect-uninstall/uninstall2.png)</br>
5. When prompted, click **Yes** to confirm.
6. This will bring up the Azure AD Connect screen.  Click **Remove**.
7. ![](media/how-to-connect-uninstall/uninstall3.png)</br>
7. Once this completes, click **Exit**.
8. ![](media/how-to-connect-uninstall/uninstall4.png)</br>
8. Back in **Control Panel** click **Refresh** and all of the components should have been removed.
9. Sign-in to the **Azure portal**.

## Next steps

- Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
- [Install Azure AD Connect using an existing ADSync database](how-to-connect-install-existing-database.md)
- [Install Azure AD Connect using SQL delegated administrator permissions](how-to-connect-install-sql-delegation.md)

